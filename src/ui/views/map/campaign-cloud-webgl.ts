import fallbackCloudNoiseTextureUrl from "../../../assets/yuanmo-map/yuanmo-fog-noise.png?url";
import {
  hexToCoordinate,
  hexToCoordinatePolygon,
  type CoordinateSpace,
  type HexCoordinate,
} from "../../../application/navigation/travel-to-coordinate";
import {
  getCampaignTerrainCamera,
  getCampaignTerrainProjectionSignature,
  projectCampaignTerrainUvToClientPointAtHeightAnchor,
} from "./campaign-terrain-webgl";
import cloudFragmentShaderRaw from "./shaders/campaign-cloud.frag.glsl?raw";
import cloudVertexShaderRaw from "./shaders/campaign-cloud.vert.glsl?raw";

const CLOUD_ANIMATION_FRAME_INTERVAL_MS = 1000 / 24;
const CLOUD_REVEAL_MASK_MAX_TEXTURE_SIZE = 2048;
const CLOUD_REVEAL_DISSOLVE_DURATION_MS = 1400;

// Reveal mask tuning table. This canvas stores a soft semantic field, not the
// final visible edge. The shader erodes this field with cloud noise.
const CLOUD_REVEAL_FIELD_HEX_RADIUS_SCALE = 1.04;
const CLOUD_REVEAL_FIELD_CLEAR_INNER_RATIO = 0.10;
const CLOUD_REVEAL_FIELD_CLEAR_OUTER_RATIO = 0.34;
const CLOUD_REVEAL_FIELD_SHALLOW_INNER_RATIO = 0.10;
const CLOUD_REVEAL_FIELD_SHALLOW_OUTER_RATIO = 1.45;
const CLOUD_REVEAL_FIELD_MAX_DISTANCE_PX = 512;

type CloudRevealMaskDescriptor = {
  coordinateSpace: CoordinateSpace;
  revealedHexes: HexCoordinate[];
  revealedHexSignature: string;
  maskWidth: number;
  maskHeight: number;
  signature: string;
};

type RevealMaskPoint = {
  x: number;
  y: number;
};

type RevealMaskPolygon = {
  points: RevealMaskPoint[];
  radiusPx: number;
};

type CampaignCloudRenderer = {
  canvas: HTMLCanvasElement;
  syncRevealMask: () => void;
  dispose: () => void;
};

const activeCloudRenderers = new Map<HTMLCanvasElement, CampaignCloudRenderer>();
const pendingCloudRendererCanvases = new Set<HTMLCanvasElement>();

export function syncCampaignCloudWebGl(root: ParentNode): void {
  const canvases = Array.from(
    root.querySelectorAll<HTMLCanvasElement>("[data-campaign-map-cloud]")
  );
  const nextCanvasSet = new Set(canvases);

  for (const [canvas, renderer] of activeCloudRenderers.entries()) {
    if (!nextCanvasSet.has(canvas)) {
      renderer.dispose();
      activeCloudRenderers.delete(canvas);
    }
  }
  for (const canvas of Array.from(pendingCloudRendererCanvases)) {
    if (!nextCanvasSet.has(canvas) || !canvas.isConnected) {
      pendingCloudRendererCanvases.delete(canvas);
    }
  }

  for (const canvas of canvases) {
    const activeRenderer = activeCloudRenderers.get(canvas);
    if (activeRenderer != null) {
      activeRenderer.syncRevealMask();
      continue;
    }

    if (pendingCloudRendererCanvases.has(canvas)) {
      continue;
    }

    pendingCloudRendererCanvases.add(canvas);
    try {
      const renderer = initCampaignCloudWebGl(canvas);
      if (!nextCanvasSet.has(canvas) || !canvas.isConnected) {
        renderer.dispose();
        continue;
      }

      activeCloudRenderers.set(canvas, renderer);
      canvas.classList.remove("has-error");
      canvas.classList.add("is-ready");
    } catch (error) {
      console.error("Failed to render campaign cloud WebGL overlay.", error);
      canvas.classList.add("has-error");
    } finally {
      pendingCloudRendererCanvases.delete(canvas);
    }
  }
}

function initCampaignCloudWebGl(
  canvas: HTMLCanvasElement
): CampaignCloudRenderer {
  const maybeGl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    preserveDrawingBuffer: false,
  });
  if (maybeGl == null) {
    throw new Error("This browser does not support WebGL.");
  }

  const gl: WebGLRenderingContext = maybeGl;
  const program = createProgram(gl, cloudVertexShaderRaw, cloudFragmentShaderRaw);
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const resolutionLocation = gl.getUniformLocation(program, "uResolution");
  const timeSecondsLocation = gl.getUniformLocation(program, "uTimeSeconds");
  const mapCameraLocation = gl.getUniformLocation(program, "uMapCamera");
  const noiseTextureLocation = gl.getUniformLocation(program, "uNoiseTexture");
  const revealTextureLocation = gl.getUniformLocation(program, "uRevealTexture");
  const previousRevealTextureLocation = gl.getUniformLocation(
    program,
    "uPreviousRevealTexture"
  );
  const revealTransitionLocation = gl.getUniformLocation(program, "uRevealTransition");
  const vertexBuffer = gl.createBuffer();
  const noiseTexture = createPlaceholderTexture(gl);
  const revealTexture = createPlaceholderTexture(gl, new Uint8Array([0, 0, 0, 0]));
  const previousRevealTexture = createPlaceholderTexture(
    gl,
    new Uint8Array([0, 0, 0, 0])
  );
  const missingResources = [
    positionLocation < 0 ? "aPosition" : null,
    resolutionLocation == null ? "uResolution" : null,
    timeSecondsLocation == null ? "uTimeSeconds" : null,
    mapCameraLocation == null ? "uMapCamera" : null,
    noiseTextureLocation == null ? "uNoiseTexture" : null,
    revealTextureLocation == null ? "uRevealTexture" : null,
    previousRevealTextureLocation == null ? "uPreviousRevealTexture" : null,
    revealTransitionLocation == null ? "uRevealTransition" : null,
    vertexBuffer == null ? "vertexBuffer" : null,
  ].filter((resource): resource is string => resource != null);
  if (missingResources.length > 0) {
    throw new Error(
      `Failed to initialize campaign cloud WebGL resources: ${missingResources.join(", ")}.`
    );
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]),
    gl.STATIC_DRAW
  );
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const cloudNoiseTextureUrl =
    canvas.dataset.mapCloudNoiseUrl ?? fallbackCloudNoiseTextureUrl;

  let frameId: number | null = null;
  let animationTimeoutId: number | null = null;
  let isDisposed = false;
  let revealMaskSignature = "";
  let revealHexSignature = "";
  let previousRevealHexes: HexCoordinate[] | null = null;
  let transitionRevealHexes: HexCoordinate[] | null = null;
  let transitionStartMs: number | null = null;
  const animationStartSeconds = performance.now() * 0.001;

  function resolveProjectionRoot(): ParentNode {
    return (
      canvas.closest<HTMLElement>("[data-campaign-map-viewport]") ??
      canvas.parentElement ??
      document
    );
  }

  function requestRender(): void {
    if (isDisposed || frameId != null) {
      return;
    }

    frameId = window.requestAnimationFrame(render);
  }

  function syncRevealMask(): void {
    if (isDisposed) {
      return;
    }

    const projectionRoot = resolveProjectionRoot();
    const descriptor = readCloudRevealMaskDescriptor(canvas, projectionRoot);
    if (descriptor.signature === revealMaskSignature) {
      return;
    }

    const currentMaskCanvas = createCloudRevealMaskCanvas(
      canvas,
      projectionRoot,
      descriptor
    );
    const didRevealSetChange =
      revealHexSignature !== "" &&
      descriptor.revealedHexSignature !== revealHexSignature;
    if (didRevealSetChange && previousRevealHexes != null) {
      transitionRevealHexes = previousRevealHexes;
      updateTexture(
        gl,
        previousRevealTexture,
        createCloudRevealMaskCanvas(canvas, projectionRoot, {
          ...descriptor,
          revealedHexes: transitionRevealHexes,
        })
      );
      transitionStartMs = performance.now();
    } else if (transitionStartMs != null && transitionRevealHexes != null) {
      updateTexture(
        gl,
        previousRevealTexture,
        createCloudRevealMaskCanvas(canvas, projectionRoot, {
          ...descriptor,
          revealedHexes: transitionRevealHexes,
        })
      );
    } else if (transitionStartMs == null) {
      updateTexture(gl, previousRevealTexture, currentMaskCanvas);
    }

    revealMaskSignature = descriptor.signature;
    revealHexSignature = descriptor.revealedHexSignature;
    previousRevealHexes = descriptor.revealedHexes;
    updateTexture(gl, revealTexture, currentMaskCanvas);
    requestRender();
  }

  loadImage(cloudNoiseTextureUrl)
    .then((image) => {
      if (isDisposed) {
        return;
      }

      updateTexture(gl, noiseTexture, image);
      requestRender();
    })
    .catch((error: unknown) => {
      console.warn("Failed to load campaign cloud noise texture.", error);
    });

  function render(): void {
    if (isDisposed) {
      return;
    }

    frameId = null;
    resizeCanvasToDisplaySize(canvas);
    syncRevealMask();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(
      timeSecondsLocation,
      performance.now() * 0.001 - animationStartSeconds
    );
    const mapCamera = getCampaignTerrainCamera();
    gl.uniform3f(
      mapCameraLocation,
      mapCamera.scale,
      mapCamera.offsetX,
      mapCamera.offsetY
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
    gl.uniform1i(noiseTextureLocation, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, revealTexture);
    gl.uniform1i(revealTextureLocation, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, previousRevealTexture);
    gl.uniform1i(previousRevealTextureLocation, 2);
    gl.uniform1f(revealTransitionLocation, resolveRevealTransition());
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    scheduleAnimationRender();
  }

  function resolveRevealTransition(): number {
    if (transitionStartMs == null) {
      return 1;
    }

    const transition = Math.min(
      1,
      (performance.now() - transitionStartMs) / CLOUD_REVEAL_DISSOLVE_DURATION_MS
    );
    if (transition >= 1) {
      transitionStartMs = null;
      transitionRevealHexes = null;
    }

    return transition;
  }

  function scheduleAnimationRender(): void {
    if (isDisposed || animationTimeoutId != null || frameId != null) {
      return;
    }

    animationTimeoutId = window.setTimeout(() => {
      animationTimeoutId = null;
      requestRender();
    }, CLOUD_ANIMATION_FRAME_INTERVAL_MS);
  }

  const handleResize = () => {
    requestRender();
  };

  syncRevealMask();
  requestRender();
  window.addEventListener("resize", handleResize);

  return {
    canvas,
    syncRevealMask,
    dispose: () => {
      isDisposed = true;
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
      if (animationTimeoutId != null) {
        window.clearTimeout(animationTimeoutId);
      }

      window.removeEventListener("resize", handleResize);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteTexture(noiseTexture);
      gl.deleteTexture(revealTexture);
      gl.deleteTexture(previousRevealTexture);
      gl.deleteProgram(program);
    },
  };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`Failed to load image "${url}".`));
    };
    image.src = url;
  });
}

function createPlaceholderTexture(
  gl: WebGLRenderingContext,
  rgba: Uint8Array = new Uint8Array([180, 180, 180, 255])
): WebGLTexture {
  const texture = gl.createTexture();
  if (texture == null) {
    throw new Error("Failed to allocate campaign cloud noise texture.");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    rgba
  );
  setCloudNoiseTextureParameters(gl);

  return texture;
}

function readCloudRevealMaskDescriptor(
  canvas: HTMLCanvasElement,
  projectionRoot: ParentNode
): CloudRevealMaskDescriptor {
  const coordinateWidth = Number.parseFloat(canvas.dataset.mapCoordinateWidth ?? "");
  const coordinateHeight = Number.parseFloat(canvas.dataset.mapCoordinateHeight ?? "");
  const coordinateSpace: CoordinateSpace = {
    width: Number.isFinite(coordinateWidth) && coordinateWidth > 0 ? coordinateWidth : 1,
    height:
      Number.isFinite(coordinateHeight) && coordinateHeight > 0
        ? coordinateHeight
        : 1,
  };
  const revealedHexes = (canvas.dataset.mapRevealedHexKeys ?? "")
    .split(/\s+/)
    .map(parseHexKey)
    .filter((hex): hex is HexCoordinate => hex != null);
  const maskSize = resolveRevealMaskTextureSize(canvas);
  const revealedHexSignature = revealedHexes
    .map((hex) => `${hex.x},${hex.y}`)
    .join("|");
  const signature = [
    coordinateSpace.width.toFixed(3),
    coordinateSpace.height.toFixed(3),
    maskSize.width,
    maskSize.height,
    getCampaignTerrainProjectionSignature(projectionRoot),
    revealedHexSignature,
  ].join("|");

  return {
    coordinateSpace,
    revealedHexes,
    revealedHexSignature,
    maskWidth: maskSize.width,
    maskHeight: maskSize.height,
    signature,
  };
}

function resolveRevealMaskTextureSize(canvas: HTMLCanvasElement): {
  width: number;
  height: number;
} {
  const sourceWidth = Math.max(canvas.width, 1);
  const sourceHeight = Math.max(canvas.height, 1);
  const scale = Math.min(
    1,
    CLOUD_REVEAL_MASK_MAX_TEXTURE_SIZE / Math.max(sourceWidth, sourceHeight)
  );

  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  };
}

function createCloudRevealMaskCanvas(
  canvas: HTMLCanvasElement,
  projectionRoot: ParentNode,
  descriptor: CloudRevealMaskDescriptor
): HTMLCanvasElement {
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = descriptor.maskWidth;
  maskCanvas.height = descriptor.maskHeight;
  const occupancyCanvas = document.createElement("canvas");
  occupancyCanvas.width = descriptor.maskWidth;
  occupancyCanvas.height = descriptor.maskHeight;
  const occupancyContext = occupancyCanvas.getContext("2d");
  if (occupancyContext == null) {
    return maskCanvas;
  }

  const polygons = buildRevealMaskPolygons({
    canvas,
    projectionRoot,
    descriptor,
    radiusScale: CLOUD_REVEAL_FIELD_HEX_RADIUS_SCALE,
  });
  occupancyContext.clearRect(0, 0, occupancyCanvas.width, occupancyCanvas.height);
  occupancyContext.globalCompositeOperation = "source-over";
  occupancyContext.fillStyle = "rgb(255, 255, 255)";
  for (const polygon of polygons) {
    drawRevealMaskPolygon(occupancyContext, polygon);
  }

  writeRevealDistanceTexture({
    outputCanvas: maskCanvas,
    occupancyCanvas,
    referenceHexRadiusPx: resolveRevealReferenceHexRadiusPx(polygons, descriptor),
  });

  return maskCanvas;
}

function writeRevealDistanceTexture(input: {
  outputCanvas: HTMLCanvasElement;
  occupancyCanvas: HTMLCanvasElement;
  referenceHexRadiusPx: number;
}): void {
  const outputContext = input.outputCanvas.getContext("2d");
  const occupancyContext = input.occupancyCanvas.getContext("2d");
  if (outputContext == null || occupancyContext == null) {
    return;
  }

  const width = input.outputCanvas.width;
  const height = input.outputCanvas.height;
  const occupancyImage = occupancyContext.getImageData(0, 0, width, height);
  const insideMask = new Uint8Array(width * height);
  for (let pixelIndex = 0; pixelIndex < insideMask.length; pixelIndex += 1) {
    insideMask[pixelIndex] = (occupancyImage.data[pixelIndex * 4 + 3] ?? 0) > 96 ? 1 : 0;
  }

  const distanceToBoundary = createRevealBoundaryDistanceField(
    insideMask,
    width,
    height
  );
  const clearInnerPx = clampNumber(
    input.referenceHexRadiusPx * CLOUD_REVEAL_FIELD_CLEAR_INNER_RATIO,
    2,
    18
  );
  const clearOuterPx = clampNumber(
    input.referenceHexRadiusPx * CLOUD_REVEAL_FIELD_CLEAR_OUTER_RATIO,
    8,
    42
  );
  const shallowInnerPx = clampNumber(
    input.referenceHexRadiusPx * CLOUD_REVEAL_FIELD_SHALLOW_INNER_RATIO,
    4,
    28
  );
  const shallowOuterPx = clampNumber(
    input.referenceHexRadiusPx * CLOUD_REVEAL_FIELD_SHALLOW_OUTER_RATIO,
    38,
    CLOUD_REVEAL_FIELD_MAX_DISTANCE_PX
  );
  const outputImage = outputContext.createImageData(width, height);
  for (let pixelIndex = 0; pixelIndex < insideMask.length; pixelIndex += 1) {
    const outputIndex = pixelIndex * 4;
    const isInside = (insideMask[pixelIndex] ?? 0) > 0;
    const boundaryDistance = distanceToBoundary[pixelIndex] ?? 0;
    const signedDistance = isInside ? boundaryDistance : -boundaryDistance;
    const outsideDistance = Math.max(0, -signedDistance);
    const clearField = smoothstepNumber(-clearOuterPx, clearInnerPx, signedDistance);
    const shallowField = isInside
      ? 0
      : 1 - smoothstepNumber(shallowInnerPx, shallowOuterPx, outsideDistance);
    outputImage.data[outputIndex] = Math.round(clampNumber(shallowField, 0, 1) * 255);
    outputImage.data[outputIndex + 1] = Math.round(clampNumber(clearField, 0, 1) * 255);
    outputImage.data[outputIndex + 2] = 0;
    outputImage.data[outputIndex + 3] = 255;
  }

  outputContext.putImageData(outputImage, 0, 0);
}

function buildRevealMaskPolygons(input: {
  canvas: HTMLCanvasElement;
  projectionRoot: ParentNode;
  descriptor: CloudRevealMaskDescriptor;
  radiusScale: number;
}): RevealMaskPolygon[] {
  const polygons: RevealMaskPolygon[] = [];
  for (const hex of input.descriptor.revealedHexes) {
    const heightAnchorCoordinate = hexToCoordinate(
      hex,
      input.descriptor.coordinateSpace
    );
    const polygon = hexToCoordinatePolygon({
      hex,
      coordinateSpace: input.descriptor.coordinateSpace,
      radiusScale: input.radiusScale,
    });
    const points = polygon
      .map((point) =>
        projectCoordinateToRevealMaskPoint({
          canvas: input.canvas,
          projectionRoot: input.projectionRoot,
          descriptor: input.descriptor,
          coordinate: point,
          heightAnchorCoordinate,
        })
      )
      .filter((point): point is RevealMaskPoint => point != null);
    if (points.length < 3) {
      continue;
    }

    polygons.push({
      points,
      radiusPx: resolveRevealPolygonRadiusPx(points),
    });
  }

  return polygons;
}

function resolveRevealPolygonRadiusPx(points: RevealMaskPoint[]): number {
  const center = points.reduce(
    (sum, point) => ({
      x: sum.x + point.x / points.length,
      y: sum.y + point.y / points.length,
    }),
    { x: 0, y: 0 }
  );
  const radiusSum = points.reduce((sum, point) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return sum + Math.hypot(dx, dy);
  }, 0);

  return radiusSum / Math.max(points.length, 1);
}

function resolveRevealReferenceHexRadiusPx(
  polygons: RevealMaskPolygon[],
  descriptor: CloudRevealMaskDescriptor
): number {
  if (polygons.length <= 0) {
    return Math.max(12, Math.min(descriptor.maskWidth, descriptor.maskHeight) * 0.04);
  }

  const sortedRadii = polygons
    .map((polygon) => polygon.radiusPx)
    .filter((radius) => Number.isFinite(radius) && radius > 0)
    .sort((a, b) => a - b);
  if (sortedRadii.length <= 0) {
    return Math.max(12, Math.min(descriptor.maskWidth, descriptor.maskHeight) * 0.04);
  }

  return sortedRadii[Math.floor(sortedRadii.length / 2)] ?? sortedRadii[0] ?? 12;
}

function createRevealBoundaryDistanceField(
  insideMask: Uint8Array,
  width: number,
  height: number
): Float32Array {
  const distance = new Float32Array(width * height);
  const maxDistance = width + height;
  for (let index = 0; index < distance.length; index += 1) {
    distance[index] = isRevealBoundaryPixel(insideMask, width, height, index)
      ? 0
      : maxDistance;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      let best = distance[index] ?? maxDistance;
      if (x > 0) {
        best = Math.min(best, (distance[index - 1] ?? maxDistance) + 1);
      }
      if (y > 0) {
        best = Math.min(best, (distance[index - width] ?? maxDistance) + 1);
      }
      if (x > 0 && y > 0) {
        best = Math.min(best, (distance[index - width - 1] ?? maxDistance) + Math.SQRT2);
      }
      if (x + 1 < width && y > 0) {
        best = Math.min(best, (distance[index - width + 1] ?? maxDistance) + Math.SQRT2);
      }
      distance[index] = best;
    }
  }

  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      const index = y * width + x;
      let best = distance[index] ?? maxDistance;
      if (x + 1 < width) {
        best = Math.min(best, (distance[index + 1] ?? maxDistance) + 1);
      }
      if (y + 1 < height) {
        best = Math.min(best, (distance[index + width] ?? maxDistance) + 1);
      }
      if (x + 1 < width && y + 1 < height) {
        best = Math.min(best, (distance[index + width + 1] ?? maxDistance) + Math.SQRT2);
      }
      if (x > 0 && y + 1 < height) {
        best = Math.min(best, (distance[index + width - 1] ?? maxDistance) + Math.SQRT2);
      }
      distance[index] = best;
    }
  }

  return distance;
}

function isRevealBoundaryPixel(
  insideMask: Uint8Array,
  width: number,
  height: number,
  index: number
): boolean {
  const state = insideMask[index] ?? 0;
  const x = index % width;
  const y = Math.floor(index / width);
  if (x <= 0 || y <= 0 || x + 1 >= width || y + 1 >= height) {
    return state > 0;
  }

  return (
    (insideMask[index - 1] ?? 0) !== state ||
    (insideMask[index + 1] ?? 0) !== state ||
    (insideMask[index - width] ?? 0) !== state ||
    (insideMask[index + width] ?? 0) !== state
  );
}

function smoothstepNumber(edge0: number, edge1: number, value: number): number {
  const t = clampNumber((value - edge0) / Math.max(edge1 - edge0, 0.0001), 0, 1);
  return t * t * (3 - 2 * t);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function drawRevealMaskPolygon(
  context: CanvasRenderingContext2D,
  polygon: RevealMaskPolygon
): void {
  context.beginPath();
  polygon.points.forEach((point, index) => {
    if (index === 0) {
      context.moveTo(point.x, point.y);
      return;
    }

    context.lineTo(point.x, point.y);
  });
  context.closePath();
  context.fill();
}

function projectCoordinateToRevealMaskPoint(input: {
  canvas: HTMLCanvasElement;
  projectionRoot: ParentNode;
  descriptor: CloudRevealMaskDescriptor;
  coordinate: { x: number; y: number };
  heightAnchorCoordinate: { x: number; y: number };
}): { x: number; y: number } | null {
  const u =
    input.coordinate.x / Math.max(input.descriptor.coordinateSpace.width, 1);
  const v =
    1 - input.coordinate.y / Math.max(input.descriptor.coordinateSpace.height, 1);
  const heightU =
    input.heightAnchorCoordinate.x /
    Math.max(input.descriptor.coordinateSpace.width, 1);
  const heightV =
    1 -
    input.heightAnchorCoordinate.y /
      Math.max(input.descriptor.coordinateSpace.height, 1);
  const projectedPoint = projectCampaignTerrainUvToClientPointAtHeightAnchor(
    input.projectionRoot,
    u,
    v,
    heightU,
    heightV
  );
  if (projectedPoint == null || !Number.isFinite(projectedPoint.clientX)) {
    return null;
  }

  const canvasRect = input.canvas.getBoundingClientRect();
  if (canvasRect.width <= 0 || canvasRect.height <= 0) {
    return null;
  }

  return {
    x:
      ((projectedPoint.clientX - canvasRect.left) / canvasRect.width) *
      input.descriptor.maskWidth,
    y:
      ((projectedPoint.clientY - canvasRect.top) / canvasRect.height) *
      input.descriptor.maskHeight,
  };
}

function parseHexKey(hexKey: string): HexCoordinate | null {
  const match = /^(-?\d+),(-?\d+)$/.exec(hexKey.trim());
  if (match == null) {
    return null;
  }

  return {
    x: Number.parseInt(match[1] ?? "0", 10),
    y: Number.parseInt(match[2] ?? "0", 10),
  };
}

function updateTexture(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  image: TexImageSource
): void {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  setCloudNoiseTextureParameters(gl);
}

function setCloudNoiseTextureParameters(gl: WebGLRenderingContext): void {
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): void {
  const rect = canvas.getBoundingClientRect();
  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * devicePixelRatio));
  const height = Math.max(1, Math.round(rect.height * devicePixelRatio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (shader == null) {
    throw new Error("Failed to create campaign cloud shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error.";
    gl.deleteShader(shader);
    throw new Error(info);
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (program == null) {
    throw new Error("Failed to create campaign cloud WebGL program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown program link error.";
    gl.deleteProgram(program);
    throw new Error(info);
  }

  return program;
}
