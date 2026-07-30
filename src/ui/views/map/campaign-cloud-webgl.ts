import fallbackCloudNoiseTextureUrl from "../../../assets/yuanmo-map/yuanmo-fog-noise.png?url";
import type { HexCoordinate } from "../../../application/navigation/travel-to-coordinate";
import {
  getCampaignTerrainCloudProjectionUniforms,
  getCampaignTerrainProjectionSignature,
  holdCampaignTerrainChunkLoading,
} from "./campaign-terrain-webgl";
import {
  createCloudRevealMaskCanvas,
  readCloudRevealMaskDescriptor,
} from "./campaign-cloud-reveal-mask";
import cloudFragmentShaderRaw from "./shaders/campaign-cloud.frag.glsl?raw";
import cloudVertexShaderRaw from "./shaders/campaign-cloud.vert.glsl?raw";

const CLOUD_RENDER_MAX_DEVICE_PIXEL_RATIO = 1;
const CLOUD_RENDER_MAX_LONG_EDGE_PX = 960;
const CLOUD_REVEAL_DISSOLVE_DURATION_MS = 1400;
const CLOUD_REVEAL_TERRAIN_LOAD_BUFFER_MS = 700;
const CLOUD_ANIMATION_FRAME_INTERVAL_MS = 1000 / 12;
const CLOUD_IDLE_TIME_SCALE = 0.35;
const CLOUD_PROJECTION_READY_RETRY_INTERVAL_MS = 120;
const CLOUD_PROJECTION_READY_MAX_RETRIES = 50;
export const DEFAULT_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST = 2.72;
export const MIN_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST = 0.5;
export const MAX_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST = 50;

type CampaignCloudRenderer = {
  canvas: HTMLCanvasElement;
  requestRender: () => void;
  syncRevealMask: () => void;
  beginInteractionFreeze: () => void;
  endInteractionFreeze: () => void;
  dispose: () => void;
};

type CampaignCloudConsoleCommand = (
  command?: boolean | "on" | "off" | "toggle" | "status"
) => {
  enabled: boolean;
};

const activeCloudRenderers = new Map<HTMLCanvasElement, CampaignCloudRenderer>();
const pendingCloudRendererCanvases = new Set<HTMLCanvasElement>();
const activeCloudInteractionReasons = new Set<string>();
let campaignCloudShaderEnabled = true;
let campaignCloudTextureScaleBoost = DEFAULT_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST;

declare global {
  interface Window {
    rpgCloud?: CampaignCloudConsoleCommand;
  }
}

export function syncCampaignCloudWebGl(root: ParentNode): void {
  const canvases = Array.from(
    root.querySelectorAll<HTMLCanvasElement>("[data-campaign-map-cloud]")
  );
  if (!campaignCloudShaderEnabled) {
    disposeCampaignCloudRenderers();
    for (const canvas of canvases) {
      canvas.classList.add("is-disabled");
      canvas.classList.remove("is-ready");
    }
    return;
  }

  for (const canvas of canvases) {
    canvas.classList.remove("is-disabled");
  }

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

export function requestCampaignCloudRender(): void {
  for (const renderer of activeCloudRenderers.values()) {
    renderer.requestRender();
  }
}

export function getCampaignCloudTextureScaleBoost(): number {
  return campaignCloudTextureScaleBoost;
}

export function setCampaignCloudTextureScaleBoost(value: number): number {
  if (!Number.isFinite(value)) {
    return campaignCloudTextureScaleBoost;
  }

  campaignCloudTextureScaleBoost = Math.min(
    Math.max(value, MIN_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST),
    MAX_CAMPAIGN_CLOUD_TEXTURE_SCALE_BOOST
  );
  requestCampaignCloudRender();
  return campaignCloudTextureScaleBoost;
}

export function beginCampaignCloudInteraction(reason: string): void {
  const wasInactive = activeCloudInteractionReasons.size <= 0;
  activeCloudInteractionReasons.add(reason);
  if (!wasInactive) {
    return;
  }

  for (const renderer of activeCloudRenderers.values()) {
    renderer.beginInteractionFreeze();
  }
}

export function endCampaignCloudInteraction(reason: string): void {
  activeCloudInteractionReasons.delete(reason);
  if (activeCloudInteractionReasons.size > 0) {
    return;
  }

  for (const renderer of activeCloudRenderers.values()) {
    renderer.endInteractionFreeze();
  }
}

function isCloudInteractionActive(): boolean {
  return activeCloudInteractionReasons.size > 0;
}

function setCampaignCloudShaderEnabled(enabled: boolean): { enabled: boolean } {
  campaignCloudShaderEnabled = enabled;
  const canvases = Array.from(
    document.querySelectorAll<HTMLCanvasElement>("[data-campaign-map-cloud]")
  );
  if (!enabled) {
    disposeCampaignCloudRenderers();
    for (const canvas of canvases) {
      canvas.classList.add("is-disabled");
      canvas.classList.remove("is-ready");
    }
  } else {
    for (const canvas of canvases) {
      canvas.classList.remove("is-disabled");
    }
    syncCampaignCloudWebGl(document);
  }

  return { enabled: campaignCloudShaderEnabled };
}

function disposeCampaignCloudRenderers(): void {
  for (const renderer of activeCloudRenderers.values()) {
    renderer.dispose();
  }
  activeCloudRenderers.clear();
  pendingCloudRendererCanvases.clear();
}

window.rpgCloud = (command = "status") => {
  if (command === "toggle") {
    return setCampaignCloudShaderEnabled(!campaignCloudShaderEnabled);
  }
  if (command === "on" || command === true) {
    return setCampaignCloudShaderEnabled(true);
  }
  if (command === "off" || command === false) {
    return setCampaignCloudShaderEnabled(false);
  }

  return { enabled: campaignCloudShaderEnabled };
};

if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    disposeCampaignCloudRenderers();
    updatedModule?.syncCampaignCloudWebGl(document);
  });
  import.meta.hot.dispose(() => {
    disposeCampaignCloudRenderers();
  });
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
  const cloudProjectionLocation = gl.getUniformLocation(program, "uCloudProjection");
  const terrainWorldScaleLocation = gl.getUniformLocation(program, "uTerrainWorldScale");
  const cloudInverseTerrainMatrixLocation = gl.getUniformLocation(
    program,
    "uCloudInverseTerrainMatrix"
  );
  const noiseTextureLocation = gl.getUniformLocation(program, "uNoiseTexture");
  const revealTextureLocation = gl.getUniformLocation(program, "uRevealTexture");
  const previousRevealTextureLocation = gl.getUniformLocation(
    program,
    "uPreviousRevealTexture"
  );
  const revealTransitionLocation = gl.getUniformLocation(program, "uRevealTransition");
  const cloudTextureScaleBoostLocation = gl.getUniformLocation(
    program,
    "uCloudTextureScaleBoost"
  );
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
    cloudProjectionLocation == null ? "uCloudProjection" : null,
    terrainWorldScaleLocation == null ? "uTerrainWorldScale" : null,
    cloudInverseTerrainMatrixLocation == null ? "uCloudInverseTerrainMatrix" : null,
    noiseTextureLocation == null ? "uNoiseTexture" : null,
    revealTextureLocation == null ? "uRevealTexture" : null,
    previousRevealTextureLocation == null ? "uPreviousRevealTexture" : null,
    revealTransitionLocation == null ? "uRevealTransition" : null,
    cloudTextureScaleBoostLocation == null ? "uCloudTextureScaleBoost" : null,
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
  let projectionReadyTimeoutId: number | null = null;
  let projectionReadyRetryCount = 0;
  let isDisposed = false;
  let revealMaskSignature = "";
  let revealHexSignature = "";
  let previousRevealHexes: HexCoordinate[] | null = null;
  let transitionRevealHexes: HexCoordinate[] | null = null;
  let transitionStartMs: number | null = null;
  let releaseTerrainChunkLoadingHold: (() => void) | null = null;
  let terrainChunkLoadingReleaseTimeoutId: number | null = null;
  let idleCloudTimeOffsetSeconds = 0;
  let idleCloudResumeMs = performance.now();
  let frozenCloudTimeSeconds = 0;
  let isCloudTimeFrozen = false;
  let isRendering = false;

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

  function beginInteractionFreeze(): void {
    if (isDisposed || isCloudTimeFrozen) {
      return;
    }

    frozenCloudTimeSeconds = resolveIdleCloudTimeSeconds();
    isCloudTimeFrozen = true;
    requestRender();
  }

  function endInteractionFreeze(): void {
    if (isDisposed || !isCloudTimeFrozen) {
      return;
    }

    idleCloudTimeOffsetSeconds = frozenCloudTimeSeconds;
    idleCloudResumeMs = performance.now();
    isCloudTimeFrozen = false;
    requestRender();
  }

  function resolveCloudTimeSeconds(): number {
    if (isCloudInteractionActive()) {
      if (!isCloudTimeFrozen) {
        beginInteractionFreeze();
      }

      return frozenCloudTimeSeconds;
    }

    return resolveIdleCloudTimeSeconds();
  }

  function resolveIdleCloudTimeSeconds(): number {
    return (
      idleCloudTimeOffsetSeconds +
      ((performance.now() - idleCloudResumeMs) * 0.001 * CLOUD_IDLE_TIME_SCALE)
    );
  }

  function holdTerrainChunkLoadingForRevealTransition(): void {
    if (terrainChunkLoadingReleaseTimeoutId != null) {
      window.clearTimeout(terrainChunkLoadingReleaseTimeoutId);
      terrainChunkLoadingReleaseTimeoutId = null;
    }
    if (releaseTerrainChunkLoadingHold == null) {
      releaseTerrainChunkLoadingHold = holdCampaignTerrainChunkLoading();
    }
  }

  function scheduleTerrainChunkLoadingHoldRelease(): void {
    if (
      releaseTerrainChunkLoadingHold == null ||
      terrainChunkLoadingReleaseTimeoutId != null
    ) {
      return;
    }

    terrainChunkLoadingReleaseTimeoutId = window.setTimeout(() => {
      terrainChunkLoadingReleaseTimeoutId = null;
      releaseTerrainChunkLoadingHold?.();
      releaseTerrainChunkLoadingHold = null;
    }, CLOUD_REVEAL_TERRAIN_LOAD_BUFFER_MS);
  }

  function syncRevealMask(): void {
    if (isDisposed) {
      return;
    }

    const projectionRoot = resolveProjectionRoot();
    const descriptor = readCloudRevealMaskDescriptor(canvas, projectionRoot);
    if (descriptor.signature === revealMaskSignature) {
      scheduleProjectionReadyRetry();
      return;
    }
    if (getCampaignTerrainProjectionSignature(projectionRoot).startsWith("ready|")) {
      projectionReadyRetryCount = 0;
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
      holdTerrainChunkLoadingForRevealTransition();
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
    if (!isRendering) {
      requestRender();
    }
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
    isRendering = true;
    try {
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
        resolveCloudTimeSeconds()
      );
      const cloudProjection = getCampaignTerrainCloudProjectionUniforms(resolveProjectionRoot());
      gl.uniform4f(
        cloudProjectionLocation,
        cloudProjection.viewportAspectRatio,
        cloudProjection.terrainScale,
        cloudProjection.heightScale,
        cloudProjection.cameraScaleRatio
      );
      gl.uniform2f(
        terrainWorldScaleLocation,
        cloudProjection.terrainWorldScale.x,
        cloudProjection.terrainWorldScale.y
      );
      gl.uniformMatrix4fv(
        cloudInverseTerrainMatrixLocation,
        false,
        cloudProjection.inverseTerrainMatrix
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
      gl.uniform1f(cloudTextureScaleBoostLocation, campaignCloudTextureScaleBoost);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      scheduleAnimationRender();
      scheduleProjectionReadyRetry();
    } finally {
      isRendering = false;
    }
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
      scheduleTerrainChunkLoadingHoldRelease();
    }

    return transition;
  }

  function scheduleAnimationRender(): void {
    if (
      isDisposed ||
      isCloudInteractionActive() ||
      animationTimeoutId != null ||
      frameId != null
    ) {
      return;
    }

    animationTimeoutId = window.setTimeout(() => {
      animationTimeoutId = null;
      requestRender();
    }, CLOUD_ANIMATION_FRAME_INTERVAL_MS);
  }

  function scheduleProjectionReadyRetry(): void {
    if (
      isDisposed ||
      projectionReadyTimeoutId != null ||
      frameId != null ||
      projectionReadyRetryCount >= CLOUD_PROJECTION_READY_MAX_RETRIES ||
      getCampaignTerrainProjectionSignature(resolveProjectionRoot()).startsWith("ready|")
    ) {
      return;
    }

    projectionReadyRetryCount += 1;
    projectionReadyTimeoutId = window.setTimeout(() => {
      projectionReadyTimeoutId = null;
      requestRender();
    }, CLOUD_PROJECTION_READY_RETRY_INTERVAL_MS);
  }

  const handleResize = () => {
    requestRender();
  };

  syncRevealMask();
  requestRender();
  window.addEventListener("resize", handleResize);

  return {
    canvas,
    requestRender,
    syncRevealMask,
    beginInteractionFreeze,
    endInteractionFreeze,
    dispose: () => {
      isDisposed = true;
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
      if (animationTimeoutId != null) {
        window.clearTimeout(animationTimeoutId);
      }
      if (projectionReadyTimeoutId != null) {
        window.clearTimeout(projectionReadyTimeoutId);
      }
      if (terrainChunkLoadingReleaseTimeoutId != null) {
        window.clearTimeout(terrainChunkLoadingReleaseTimeoutId);
      }
      releaseTerrainChunkLoadingHold?.();
      releaseTerrainChunkLoadingHold = null;

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
  const devicePixelRatio = Math.min(
    window.devicePixelRatio || 1,
    CLOUD_RENDER_MAX_DEVICE_PIXEL_RATIO
  );
  const rawWidth = Math.max(1, Math.round(rect.width * devicePixelRatio));
  const rawHeight = Math.max(1, Math.round(rect.height * devicePixelRatio));
  const longEdgeScale = Math.min(
    1,
    CLOUD_RENDER_MAX_LONG_EDGE_PX / Math.max(rawWidth, rawHeight)
  );
  const width = Math.max(1, Math.round(rawWidth * longEdgeScale));
  const height = Math.max(1, Math.round(rawHeight * longEdgeScale));
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
