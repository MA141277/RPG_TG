type CampaignTerrainInput = {
  canvas: HTMLCanvasElement;
  textureUrl: string;
  heightUrl: string;
  materialUrl: string;
  renderMode: "terrain" | "actor";
};

type MeshData = {
  vertices: Float32Array;
  indices: Uint32Array;
};

type ActorMeshData = {
  vertices: Float32Array;
  indices: Uint16Array;
};

type CityDepthMeshData = {
  vertices: Float32Array;
  indices: Uint32Array;
};

type CityDepthMeshAsset = {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
  textureImage: HTMLImageElement;
  u: number;
  v: number;
  minHeight: number;
};

type CityDepthMeshAssetJson = {
  format: string;
  positions: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
};

export type CampaignCityDepthMeshTransform = {
  rotationDegrees: number;
  pitchDegrees: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  lift: number;
};

type ActorBoneAsset = {
  name: string;
  parentIndex: number | null;
  localPosition: [number, number, number];
};

type ActorModelAsset = {
  scale: number;
  localBindPositions: Float32Array;
  bindNormals: Float32Array;
  uvs: Float32Array;
  indices: Uint16Array;
  vertexBoneIndices: Uint16Array;
  bones: ActorBoneAsset[];
  bindGlobalPositions: [number, number, number][];
  originOffset: [number, number, number];
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
};

type ActorAnimationClipAsset = {
  format: string;
  fps: number;
  numFrames: number;
  numAnimatedBones: number;
  animatedBoneNames: string[];
  rotations: number[][][];
  rootPositions: number[][];
  pelvisPositions: number[][];
};

type ActorAnimationSetAsset = {
  idle: ActorAnimationClipAsset;
  walk: ActorAnimationClipAsset;
};

type ActorAnimationPose = {
  globalRotations: [number, number, number, number][];
  globalPositions: [number, number, number][];
};

type Mat4 = Float32Array;

const GRID_COLUMNS = 768;
const GRID_ROWS = 680;
const HEIGHT_SCALE = 0.0675;
const TERRAIN_SCALE = 1.46;
const CAMERA_TILT_RADIANS = -0.82;
const CAMERA_BASE_DISTANCE = 2.72;
const CAMERA_OFFSET_UNIT = 0.0032;
const CAMERA_REFERENCE_SCALE = 15;
const FOV_RADIANS = 38 * Math.PI / 180;
const ACTOR_REFERENCE_CAMERA_SCALE = 40;
const ACTOR_MODEL_BASE_SCALE = 0.011;
const ACTOR_MODEL_FACING_OFFSET_RADIANS = Math.PI / 2;
const HEX_TERRAIN_SCALE = 138;
const HEX_MAP_ASPECT = 1.1285;
const HEX_ELEVATION_LEVELS = 8;
const HEX_WATER_HEIGHT_THRESHOLD = 0.005;
const HEX_WALL_HEIGHT_EPSILON = 0.01;
const GRASS_TEXTURE_DETAIL = 1.15;
const GRASS_AMBIENT_LIGHT = 0.58;
const CITY_DEPTH_MESH_WORLD_SCALE = 0.035;
const CITY_DEPTH_MESH_HEIGHT_SCALE = 0.034;
const CITY_DEPTH_MESH_BASE_LIFT = 0.0015;
const CITY_DEPTH_MESH_TILE_OFFSET_X_SCALE = 2 / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE);
const CITY_DEPTH_MESH_TILE_OFFSET_Y_SCALE = 2 / HEX_TERRAIN_SCALE;
export const DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM: CampaignCityDepthMeshTransform = {
  rotationDegrees: 0,
  pitchDegrees: 0,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  lift: 0,
};
export type CampaignTerrainStyle = {
  saturation: number;
  brightness: number;
  brightnessOffset: number;
  shadeMin: number;
  shadeMax: number;
};

export const DEFAULT_CAMPAIGN_TERRAIN_STYLE: CampaignTerrainStyle = {
  saturation: 1,
  brightness: 1,
  brightnessOffset: 0,
  shadeMin: 1,
  shadeMax: 1,
};
const IDENTITY_QUATERNION: [number, number, number, number] = [0, 0, 0, 1];

type CampaignTerrainCamera = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

type CampaignTerrainRenderer = {
  canvas: HTMLCanvasElement;
  dispose: () => void;
  render: () => void;
  requestRender: (reason?: "static" | "dynamic") => void;
  hasActorAsset: boolean;
  projectionInput: {
    canvas: HTMLCanvasElement;
    heights: Float32Array;
    columns: number;
    rows: number;
  };
};

type CampaignActorData = {
  u: number;
  v: number;
  facingDegrees: number;
  isMoving: boolean;
  modelUrl: string | null;
  textureUrl: string | null;
  idleAnimationUrl: string | null;
  walkAnimationUrl: string | null;
};

const activeRenderers = new Map<HTMLCanvasElement, CampaignTerrainRenderer>();
const pendingRendererCanvases = new Set<HTMLCanvasElement>();

type CampaignTerrainProjectionInput = {
  canvas: HTMLCanvasElement;
  heights: Float32Array;
  columns: number;
  rows: number;
};

export type CampaignTerrainUvPoint = {
  u: number;
  v: number;
};

type CampaignFpsSampler = {
  push: (timestampMs: number) => number;
  current: () => number;
};

let currentCamera: CampaignTerrainCamera = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

const campaignFpsState = {
  sampler: createCampaignFpsSampler(500),
  lastText: "FPS: 0",
};

export function formatCampaignFpsReadout(
  fpsValue: number | null | undefined
): string {
  const numericValue =
    typeof fpsValue === "number" && Number.isFinite(fpsValue) ? fpsValue : 0;
  const value = Math.max(0, Math.round(numericValue));
  return `FPS: ${value}`;
}

export function createCampaignFpsSampler(windowMs = 500): CampaignFpsSampler {
  const frameTimes: number[] = [];
  let lastFps = 0;
  return {
    push(timestampMs: number) {
      frameTimes.push(timestampMs);
      while (frameTimes.length > 1) {
        const firstTimestamp = frameTimes[0];
        if (firstTimestamp == null || timestampMs - firstTimestamp <= windowMs) {
          break;
        }
        frameTimes.shift();
      }
      if (frameTimes.length > 1) {
        const firstTimestamp = frameTimes[0];
        const lastTimestamp = frameTimes[frameTimes.length - 1];
        if (firstTimestamp != null && lastTimestamp != null) {
          const durationMs = lastTimestamp - firstTimestamp;
          lastFps =
            durationMs > 0 ? ((frameTimes.length - 1) * 1000) / durationMs : lastFps;
        }
      }
      return lastFps;
    },
    current() {
      return lastFps;
    },
  };
}

export function ensureCampaignFpsHud(root: ParentNode): HTMLElement | null {
  return root.querySelector<HTMLElement>("[data-campaign-fps-hud='true']");
}

function updateCampaignFpsHud(root: ParentNode, timestampMs: number): void {
  const hud = ensureCampaignFpsHud(root);
  if (hud == null) {
    return;
  }

  const fps = campaignFpsState.sampler.push(timestampMs);
  const nextText = formatCampaignFpsReadout(fps);
  if (nextText !== campaignFpsState.lastText) {
    hud.textContent = nextText;
    campaignFpsState.lastText = nextText;
  }
}

export function requestCampaignTerrainRender(reason: "static" | "dynamic" = "dynamic"): void {
  for (const renderer of activeRenderers.values()) {
    renderer.requestRender(reason);
  }
}

export function setCampaignTerrainCamera(camera: CampaignTerrainCamera): void {
  currentCamera = camera;
  for (const renderer of activeRenderers.values()) {
    renderer.requestRender("static");
  }
}

export function resolveCampaignTerrainUvFromClientPosition(
  root: ParentNode,
  clientX: number,
  clientY: number
): CampaignTerrainUvPoint | null {
  const terrainCanvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  if (terrainCanvas == null) {
    return null;
  }

  const renderer = activeRenderers.get(terrainCanvas);
  if (renderer == null) {
    return null;
  }

  const rect = terrainCanvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const normalizedX = clamp((clientX - rect.left) / rect.width, 0, 1);
  const normalizedY = clamp((clientY - rect.top) / rect.height, 0, 1);
  const matrix = createTerrainMatrix(
    terrainCanvas.width / Math.max(terrainCanvas.height, 1)
  );
  const targetScreenX = normalizedX * 2 - 1;
  const targetScreenY = 1 - normalizedY * 2;

  return findNearestTerrainUvForScreenPoint(
    matrix,
    targetScreenX,
    targetScreenY,
    renderer.projectionInput.heights,
    renderer.projectionInput.columns,
    renderer.projectionInput.rows
  );
}

export function syncCampaignTerrainWebGl(root: ParentNode): void {
  const canvases = Array.from(
    root.querySelectorAll<HTMLCanvasElement>(
      "[data-campaign-map-terrain], [data-campaign-map-actor-layer]"
    )
  );
  const nextCanvasSet = new Set(canvases);

  for (const [canvas, renderer] of activeRenderers.entries()) {
    if (!nextCanvasSet.has(canvas)) {
      renderer.dispose();
      activeRenderers.delete(canvas);
    }
  }
  for (const canvas of Array.from(pendingRendererCanvases)) {
    if (!nextCanvasSet.has(canvas) || !canvas.isConnected) {
      pendingRendererCanvases.delete(canvas);
    }
  }

  if (canvases.length === 0) {
    return;
  }

  for (const canvas of canvases) {
    if (activeRenderers.has(canvas) || pendingRendererCanvases.has(canvas)) {
      continue;
    }

    const textureUrl = canvas.dataset.mapTextureUrl;
    const heightUrl = canvas.dataset.mapHeightUrl;
    const materialUrl = canvas.dataset.mapMaterialUrl;
    const renderMode =
      canvas.dataset.campaignMapActorLayer === "true" ? "actor" : "terrain";
    if (
      textureUrl == null ||
      heightUrl == null ||
      materialUrl == null
    ) {
      continue;
    }

    pendingRendererCanvases.add(canvas);
    void initCampaignTerrainWebGl({
      canvas,
      textureUrl,
      heightUrl,
      materialUrl,
      renderMode,
    }).then((renderer) => {
      if (!nextCanvasSet.has(canvas) || !canvas.isConnected) {
        renderer.dispose();
        return;
      }

      activeRenderers.set(canvas, renderer);
      canvas.classList.remove("has-error");
      canvas.classList.add("is-ready");
      canvas.classList.toggle("has-actor-model", renderer.hasActorAsset);
    }).catch((error: unknown) => {
      console.error("Failed to render campaign terrain WebGL map.", error);
      canvas.classList.add("has-error");
    }).finally(() => {
      pendingRendererCanvases.delete(canvas);
    });
  }
}

async function initCampaignTerrainWebGl(
  input: CampaignTerrainInput
): Promise<CampaignTerrainRenderer> {
  const renderTerrain = input.renderMode === "terrain";
  const shouldRenderActorInThisCanvas = input.renderMode === "actor";
  const gl = input.canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: false,
  });
  if (gl == null) {
    throw new Error("This browser does not support WebGL.");
  }

  const actorAssetPromise = shouldRenderActorInThisCanvas
    ? loadCampaignActorAsset(input.canvas).catch((error: unknown) => {
      console.error("Failed to load campaign actor asset.", error);
      return null;
    })
    : Promise.resolve(null);
  const cityDepthAssetPromise = renderTerrain
    ? loadCampaignCityDepthMeshAsset(input.canvas).catch((error: unknown) => {
      console.error("Failed to load campaign city depth mesh asset.", error);
      return null;
    })
    : Promise.resolve(null);
  const [textureImage, heightImage, materialImage, actorAsset, cityDepthAsset] = await Promise.all([
    loadImage(input.textureUrl),
    loadImage(input.heightUrl),
    loadImage(input.materialUrl),
    actorAssetPromise,
    cityDepthAssetPromise,
  ]);
  const baseHeightSamples = sampleHeightImage(heightImage, GRID_COLUMNS, GRID_ROWS);
  const heightSamples = createHexLayeredHeightSamples(
    baseHeightSamples,
    GRID_COLUMNS,
    GRID_ROWS
  );
  const mesh = renderTerrain
    ? createHexLayeredTerrainMesh(
      heightSamples,
      GRID_COLUMNS,
      GRID_ROWS
    )
    : null;
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  const actorProgram = createProgram(gl, actorVertexShaderSource, actorFragmentShaderSource);
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const uvLocation = gl.getAttribLocation(program, "aUv");
  const matrixLocation = gl.getUniformLocation(program, "uMatrix");
  const textureLocation = gl.getUniformLocation(program, "uTexture");
  const materialTextureLocation = gl.getUniformLocation(program, "uMaterialTexture");
  const landTextureColorAdjustLocation = gl.getUniformLocation(
    program,
    "uLandTextureColorAdjust"
  );
  const landTextureShadeRangeLocation = gl.getUniformLocation(
    program,
    "uLandTextureShadeRange"
  );
  const actorPositionLocation = gl.getAttribLocation(actorProgram, "aPosition");
  const actorNormalLocation = gl.getAttribLocation(actorProgram, "aNormal");
  const actorUvLocation = gl.getAttribLocation(actorProgram, "aUv");
  const actorMatrixLocation = gl.getUniformLocation(actorProgram, "uMatrix");
  const actorLightLocation = gl.getUniformLocation(actorProgram, "uLight");
  const actorTextureLocation = gl.getUniformLocation(actorProgram, "uTexture");
  const actorTintLocation = gl.getUniformLocation(actorProgram, "uTint");
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  const actorVertexBuffer = gl.createBuffer();
  const actorIndexBuffer = gl.createBuffer();
  const cityDepthVertexBuffer = gl.createBuffer();
  const cityDepthIndexBuffer = gl.createBuffer();
  const texture = createTexture(gl, textureImage);
  const materialTexture = createTexture(gl, materialImage);
  const actorTexture =
    actorAsset?.textureImage == null
      ? null
      : createTexture(gl, actorAsset.textureImage, {
        wrapS: gl.REPEAT,
        wrapT: gl.REPEAT,
      });
  const cityDepthTexture =
    cityDepthAsset == null ? null : createTexture(gl, cityDepthAsset.textureImage);

  const missingResources = [
    positionLocation < 0 ? "aPosition" : null,
    uvLocation < 0 ? "aUv" : null,
    matrixLocation == null ? "uMatrix" : null,
    textureLocation == null ? "uTexture" : null,
    materialTextureLocation == null ? "uMaterialTexture" : null,
    landTextureColorAdjustLocation == null ? "uLandTextureColorAdjust" : null,
    landTextureShadeRangeLocation == null ? "uLandTextureShadeRange" : null,
    actorPositionLocation < 0 ? "actor.aPosition" : null,
    actorNormalLocation < 0 ? "actor.aNormal" : null,
    actorUvLocation < 0 ? "actor.aUv" : null,
    actorMatrixLocation == null ? "actor.uMatrix" : null,
    actorLightLocation == null ? "actor.uLight" : null,
    actorTextureLocation == null ? "actor.uTexture" : null,
    actorTintLocation == null ? "actor.uTint" : null,
    vertexBuffer == null ? "terrain.vertexBuffer" : null,
    indexBuffer == null ? "terrain.indexBuffer" : null,
    actorVertexBuffer == null ? "actor.vertexBuffer" : null,
    actorIndexBuffer == null ? "actor.indexBuffer" : null,
    cityDepthVertexBuffer == null ? "cityDepth.vertexBuffer" : null,
    cityDepthIndexBuffer == null ? "cityDepth.indexBuffer" : null,
  ].filter((resource): resource is string => resource != null);
  if (missingResources.length > 0) {
    throw new Error(
      `Failed to initialize campaign terrain WebGL resources: ${missingResources.join(", ")}.`
    );
  }

  if (mesh != null) {
    const uintIndicesExtension = gl.getExtension("OES_element_index_uint");
    if (uintIndicesExtension == null) {
      throw new Error("This browser cannot draw the campaign terrain mesh.");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
  }
  let cityDepthMesh =
    cityDepthAsset == null
      ? null
      : createCityDepthMesh(
        cityDepthAsset,
        heightSamples,
        GRID_COLUMNS,
        GRID_ROWS,
        readCampaignCityDepthMeshTransform(input.canvas)
      );
  if (cityDepthMesh != null) {
    gl.bindBuffer(gl.ARRAY_BUFFER, cityDepthVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cityDepthMesh.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cityDepthIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cityDepthMesh.indices, gl.STATIC_DRAW);
  }
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  const projectionInput: CampaignTerrainProjectionInput = {
    canvas: input.canvas,
    heights: heightSamples,
    columns: GRID_COLUMNS,
    rows: GRID_ROWS,
  };

  let frameId: number | null = null;
  let isDisposed = false;
  let hasPendingRender = false;
  let projectedPointsNeedSync = true;
  let lastActorSignature = "";
  let lastCityDepthMeshSignature = "";
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;
  const render = (timestampMs = performance.now()) => {
    if (isDisposed) {
      return;
    }

    frameId = null;
    hasPendingRender = false;
    resizeCanvasToDisplaySize(input.canvas);
    const resized =
      input.canvas.width !== lastCanvasWidth || input.canvas.height !== lastCanvasHeight;
    if (resized) {
      lastCanvasWidth = input.canvas.width;
      lastCanvasHeight = input.canvas.height;
      projectedPointsNeedSync = true;
    }
    gl.viewport(0, 0, input.canvas.width, input.canvas.height);
    gl.clearColor(renderTerrain ? 0.02 : 0, renderTerrain ? 0.04 : 0, renderTerrain ? 0.04 : 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (renderTerrain && mesh != null) {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(textureLocation, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, materialTexture);
      gl.uniform1i(materialTextureLocation, 1);
      const terrainStyle = readCampaignTerrainStyle(input.canvas);
      gl.uniform3f(
        landTextureColorAdjustLocation,
        terrainStyle.saturation,
        terrainStyle.brightness,
        terrainStyle.brightnessOffset
      );
      gl.uniform2f(
        landTextureShadeRangeLocation,
        terrainStyle.shadeMin,
        terrainStyle.shadeMax
      );
      gl.uniformMatrix4fv(
        matrixLocation,
        false,
        createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1))
      );

      const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(uvLocation);
      gl.vertexAttribPointer(
        uvLocation,
        2,
        gl.FLOAT,
        false,
        stride,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0);
    }

    if (renderTerrain && cityDepthAsset != null && cityDepthTexture != null) {
      const cityDepthMeshTransform = readCampaignCityDepthMeshTransform(input.canvas);
      const cityDepthMeshSignature = getCampaignCityDepthMeshTransformSignature(
        cityDepthMeshTransform
      );
      if (cityDepthMesh == null || cityDepthMeshSignature !== lastCityDepthMeshSignature) {
        cityDepthMesh = createCityDepthMesh(
          cityDepthAsset,
          heightSamples,
          GRID_COLUMNS,
          GRID_ROWS,
          cityDepthMeshTransform
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, cityDepthVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cityDepthMesh.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cityDepthIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cityDepthMesh.indices, gl.STATIC_DRAW);
        lastCityDepthMeshSignature = cityDepthMeshSignature;
      }
      gl.useProgram(actorProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, cityDepthVertexBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cityDepthIndexBuffer);
      const cityDepthStride = 8 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(actorPositionLocation);
      gl.vertexAttribPointer(
        actorPositionLocation,
        3,
        gl.FLOAT,
        false,
        cityDepthStride,
        0
      );
      gl.enableVertexAttribArray(actorNormalLocation);
      gl.vertexAttribPointer(
        actorNormalLocation,
        3,
        gl.FLOAT,
        false,
        cityDepthStride,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(actorUvLocation);
      gl.vertexAttribPointer(
        actorUvLocation,
        2,
        gl.FLOAT,
        false,
        cityDepthStride,
        6 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.uniformMatrix4fv(
        actorMatrixLocation,
        false,
        createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1))
      );
      gl.uniform3f(actorLightLocation, -0.58, 0.52, 0.62);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, cityDepthTexture);
      gl.uniform1i(actorTextureLocation, 0);
      gl.uniform3f(actorTintLocation, 1, 1, 1);
      gl.disable(gl.CULL_FACE);
      gl.depthMask(true);
      gl.drawElements(gl.TRIANGLES, cityDepthMesh.indices.length, gl.UNSIGNED_INT, 0);
    }

    const actor = readCampaignActorData(input.canvas);
    if (shouldRenderActorInThisCanvas && actor != null && actorAsset != null && actorTexture != null) {
      const actorSignature = [
        actor.u.toFixed(5),
        actor.v.toFixed(5),
        actor.facingDegrees.toFixed(2),
        actor.isMoving ? "1" : "0",
      ].join("|");
      if (actorSignature !== lastActorSignature) {
        projectedPointsNeedSync = true;
        lastActorSignature = actorSignature;
      }
      const actorHeight = sampleHeightAt(heightSamples, GRID_COLUMNS, GRID_ROWS, actor.u, actor.v);
      const actorMesh = createActorMesh(
        actor,
        actorHeight,
        actorAsset.model,
        actorAsset.animations
      );
      gl.useProgram(actorProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, actorVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, actorMesh.vertices, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, actorIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, actorMesh.indices, gl.DYNAMIC_DRAW);
      const actorStride = 8 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(actorPositionLocation);
      gl.vertexAttribPointer(
        actorPositionLocation,
        3,
        gl.FLOAT,
        false,
        actorStride,
        0
      );
      gl.enableVertexAttribArray(actorNormalLocation);
      gl.vertexAttribPointer(
        actorNormalLocation,
        3,
        gl.FLOAT,
        false,
        actorStride,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(actorUvLocation);
      gl.vertexAttribPointer(
        actorUvLocation,
        2,
        gl.FLOAT,
        false,
        actorStride,
        6 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.uniformMatrix4fv(
        actorMatrixLocation,
        false,
        createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1))
      );
      gl.uniform3f(actorLightLocation, -0.92, 0.28, 0.36);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, actorTexture);
      gl.uniform1i(actorTextureLocation, 0);
      gl.uniform3f(actorTintLocation, 1, 1, 1);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.drawElements(gl.TRIANGLES, actorMesh.indices.length, gl.UNSIGNED_SHORT, 0);
      gl.disable(gl.CULL_FACE);
    } else {
      if (lastActorSignature !== "") {
        projectedPointsNeedSync = true;
        lastActorSignature = "";
      }
    }

    if (renderTerrain && projectedPointsNeedSync) {
      syncProjectedPoints(projectionInput);
      projectedPointsNeedSync = false;
    }

    if (renderTerrain) {
      updateCampaignFpsHud(input.canvas.getRootNode() as ParentNode, timestampMs);
    }
  };

  const requestRender = (reason: "static" | "dynamic" = "dynamic") => {
    if (isDisposed) {
      return;
    }

    if (reason === "static") {
      projectedPointsNeedSync = true;
    }
    if (hasPendingRender) {
      return;
    }

    hasPendingRender = true;
    frameId = window.requestAnimationFrame(render);
  };
  const handleResize = () => {
    requestRender("static");
  };

  requestRender("static");
  window.addEventListener("resize", handleResize);

  return {
    canvas: input.canvas,
    render,
    requestRender,
    hasActorAsset: actorAsset != null && actorTexture != null,
    projectionInput,
    dispose: () => {
      isDisposed = true;
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", handleResize);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteBuffer(actorVertexBuffer);
      gl.deleteBuffer(actorIndexBuffer);
      gl.deleteBuffer(cityDepthVertexBuffer);
      gl.deleteBuffer(cityDepthIndexBuffer);
      gl.deleteTexture(texture);
      gl.deleteTexture(materialTexture);
      if (actorTexture != null) {
        gl.deleteTexture(actorTexture);
      }
      if (cityDepthTexture != null) {
        gl.deleteTexture(cityDepthTexture);
      }
      gl.deleteProgram(program);
      gl.deleteProgram(actorProgram);
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

async function loadJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load JSON "${url}" (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

async function loadCampaignActorAsset(
  canvas: HTMLCanvasElement
): Promise<{ model: ActorModelAsset; textureImage: HTMLImageElement; animations: ActorAnimationSetAsset } | null> {
  const actor = readCampaignActorData(canvas);
  if (
    actor?.modelUrl == null ||
    actor.textureUrl == null ||
    actor.idleAnimationUrl == null ||
    actor.walkAnimationUrl == null
  ) {
    return null;
  }

  const [model, textureImage, idleAnimation, walkAnimation] = await Promise.all([
    loadJson<{
      scale?: number;
      positions: number[];
      normals: number[];
      uvs: number[];
      boneIndices: number[];
      indices: number[];
      origin: [number, number, number];
      bones: Array<{
        name: string;
        parentIndex: number | null;
        localPosition: [number, number, number];
      }>;
      bounds: {
        min: [number, number, number];
        max: [number, number, number];
      };
    }>(actor.modelUrl),
    loadImage(actor.textureUrl),
    loadJson<ActorAnimationClipAsset>(actor.idleAnimationUrl),
    loadJson<ActorAnimationClipAsset>(actor.walkAnimationUrl),
  ]);

  const bones = model.bones.map((bone) => ({
    name: bone.name,
    parentIndex: bone.parentIndex,
    localPosition: bone.localPosition,
  }));
  const bindGlobalPositions = computeActorGlobalBonePositions(bones);
  const vertexBoneIndices = new Uint16Array(model.boneIndices);
  const localBindPositions = new Float32Array(model.positions.length);
  const centeredBindGlobalPositions = bindGlobalPositions.map((position) => ([
    position[0] - (model.origin[0] ?? 0),
    position[1] - (model.origin[1] ?? 0),
    position[2] - (model.origin[2] ?? 0),
  ] as [number, number, number]));

  for (let vertexIndex = 0; vertexIndex < model.positions.length / 3; vertexIndex += 1) {
    const positionOffset = vertexIndex * 3;
    const boneIndex = vertexBoneIndices[vertexIndex] ?? 0;
    const bindBonePosition = centeredBindGlobalPositions[boneIndex] ?? [0, 0, 0];
    localBindPositions[positionOffset] = (model.positions[positionOffset] ?? 0) - bindBonePosition[0];
    localBindPositions[positionOffset + 1] =
      (model.positions[positionOffset + 1] ?? 0) - bindBonePosition[1];
    localBindPositions[positionOffset + 2] =
      (model.positions[positionOffset + 2] ?? 0) - bindBonePosition[2];
  }

  return {
    model: {
      scale: model.scale ?? 1,
      localBindPositions,
      bindNormals: new Float32Array(model.normals),
      uvs: new Float32Array(model.uvs),
      vertexBoneIndices,
      indices: new Uint16Array(model.indices),
      bones,
      bindGlobalPositions: centeredBindGlobalPositions,
      originOffset: [
        -(model.origin[0] ?? 0),
        -(model.origin[1] ?? 0),
        -(model.origin[2] ?? 0),
      ],
      bounds: model.bounds,
    },
    textureImage,
    animations: {
      idle: idleAnimation,
      walk: walkAnimation,
    },
  };
}

async function loadCampaignCityDepthMeshAsset(
  canvas: HTMLCanvasElement
): Promise<CityDepthMeshAsset | null> {
  const meshUrl = canvas.dataset.campaignCityMeshUrl;
  const textureUrl = canvas.dataset.campaignCityTextureUrl;
  const u = Number(canvas.dataset.campaignCityU);
  const v = Number(canvas.dataset.campaignCityV);
  if (
    meshUrl == null ||
    textureUrl == null ||
    !Number.isFinite(u) ||
    !Number.isFinite(v)
  ) {
    return null;
  }

  const [asset, textureImage] = await Promise.all([
    loadJson<CityDepthMeshAssetJson>(meshUrl),
    loadImage(textureUrl),
  ]);
  if (asset.format !== "city-depth-mesh-lowpoly-v1") {
    throw new Error(`Unsupported city depth mesh format "${asset.format}".`);
  }
  if (
    asset.positions.length % 3 !== 0 ||
    asset.normals.length !== asset.positions.length ||
    asset.uvs.length !== (asset.positions.length / 3) * 2 ||
    asset.indices.length % 3 !== 0
  ) {
    throw new Error("City depth mesh asset arrays are inconsistent.");
  }

  let minHeight = Number.POSITIVE_INFINITY;
  for (let index = 1; index < asset.positions.length; index += 3) {
    minHeight = Math.min(minHeight, asset.positions[index] ?? minHeight);
  }

  return {
    positions: new Float32Array(asset.positions),
    normals: new Float32Array(asset.normals),
    uvs: new Float32Array(asset.uvs),
    indices: new Uint32Array(asset.indices),
    textureImage,
    u: clamp(u, 0, 1),
    v: clamp(v, 0, 1),
    minHeight: Number.isFinite(minHeight) ? minHeight : 0,
  };
}

function createCityDepthMesh(
  asset: CityDepthMeshAsset,
  heights: Float32Array,
  columns: number,
  rows: number,
  transform: CampaignCityDepthMeshTransform
): CityDepthMeshData {
  const snappedCenter = snapTerrainUvToHexCenter(asset.u, asset.v);
  const terrainHeight = sampleHeightAt(
    heights,
    columns,
    rows,
    snappedCenter.u,
    snappedCenter.v
  );
  const center = createTerrainWorldPoint(
    snappedCenter.u,
    snappedCenter.v,
    terrainHeight
  );
  const centerX =
    center[0] + transform.offsetX * CITY_DEPTH_MESH_TILE_OFFSET_X_SCALE;
  const centerY =
    center[1] - transform.offsetY * CITY_DEPTH_MESH_TILE_OFFSET_Y_SCALE;
  const vertices = new Float32Array((asset.positions.length / 3) * 8);
  const rotation = transform.rotationDegrees * Math.PI / 180;
  const rotationCos = Math.cos(rotation);
  const rotationSin = Math.sin(rotation);
  const pitch = transform.pitchDegrees * Math.PI / 180;
  const pitchCos = Math.cos(pitch);
  const pitchSin = Math.sin(pitch);
  const horizontalScale = CITY_DEPTH_MESH_WORLD_SCALE * transform.scale;
  const verticalScale = CITY_DEPTH_MESH_HEIGHT_SCALE * transform.scale;

  for (let vertexIndex = 0; vertexIndex < asset.positions.length / 3; vertexIndex += 1) {
    const positionOffset = vertexIndex * 3;
    const uvOffset = vertexIndex * 2;
    const outputOffset = vertexIndex * 8;
    const localX = asset.positions[positionOffset] ?? 0;
    const localHeight = asset.positions[positionOffset + 1] ?? asset.minHeight;
    const localY = asset.positions[positionOffset + 2] ?? 0;
    const localZ = localHeight - asset.minHeight;
    const pitchedY =
      localY * horizontalScale * pitchCos - localZ * verticalScale * pitchSin;
    const pitchedZ =
      localY * horizontalScale * pitchSin + localZ * verticalScale * pitchCos;
    const rotatedX = localX * horizontalScale * rotationCos - pitchedY * rotationSin;
    const rotatedY = localX * horizontalScale * rotationSin + pitchedY * rotationCos;
    const normalX = asset.normals[positionOffset] ?? 0;
    const normalHeight = asset.normals[positionOffset + 1] ?? 1;
    const normalY = asset.normals[positionOffset + 2] ?? 0;
    const pitchedNormalY = normalY * pitchCos - normalHeight * pitchSin;
    const pitchedNormalZ = normalY * pitchSin + normalHeight * pitchCos;
    const rotatedNormalX = normalX * rotationCos - pitchedNormalY * rotationSin;
    const rotatedNormalY = normalX * rotationSin + pitchedNormalY * rotationCos;
    const worldNormal = normalizeVector3([
      rotatedNormalX,
      -rotatedNormalY,
      pitchedNormalZ,
    ]);

    vertices[outputOffset] = centerX + rotatedX;
    vertices[outputOffset + 1] = centerY - rotatedY;
    vertices[outputOffset + 2] =
      center[2] +
      CITY_DEPTH_MESH_BASE_LIFT +
      transform.lift +
      pitchedZ;
    vertices[outputOffset + 3] = worldNormal[0];
    vertices[outputOffset + 4] = worldNormal[1];
    vertices[outputOffset + 5] = worldNormal[2];
    vertices[outputOffset + 6] = asset.uvs[uvOffset] ?? 0;
    vertices[outputOffset + 7] = asset.uvs[uvOffset + 1] ?? 0;
  }

  return {
    vertices,
    indices: asset.indices,
  };
}

function snapTerrainUvToHexCenter(u: number, v: number): { u: number; v: number } {
  const point = terrainUvToHexPoint(u, v);
  const cell = pixelToRoundedHex(point.x, point.y);
  const center = hexToPixel(cell.x, cell.y);

  return {
    u: hexPointToTerrainU(center.x),
    v: hexPointToTerrainV(center.y),
  };
}

function normalizeVector3(input: [number, number, number]): [number, number, number] {
  const length = Math.hypot(input[0], input[1], input[2]) || 1;

  return [
    input[0] / length,
    input[1] / length,
    input[2] / length,
  ];
}

function sampleHeightImage(
  image: HTMLImageElement,
  columns: number,
  rows: number
): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (context == null) {
    throw new Error("Failed to create heightmap sampling context.");
  }

  context.drawImage(image, 0, 0, columns, rows);
  const data = context.getImageData(0, 0, columns, rows).data;
  const heights = new Float32Array(columns * rows);

  for (let index = 0; index < heights.length; index += 1) {
    const pixelOffset = index * 4;
    const red = data[pixelOffset] ?? 0;
    const green = data[pixelOffset + 1] ?? red;
    const blue = data[pixelOffset + 2] ?? red;
    heights[index] = getHeightFromHeightmapColor(red, green, blue);
  }

  return heights;
}

function hexToPixel(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.sqrt(3) * (x + y * 0.5),
    y: 1.5 * y,
  };
}

function pixelToRoundedHex(x: number, y: number): { x: number; y: number } {
  const axialX = 0.5773503 * x - 0.3333333 * y;
  const axialY = 0.6666667 * y;
  const axialZ = -axialX - axialY;
  let roundedX = Math.floor(axialX + 0.5);
  let roundedY = Math.floor(axialY + 0.5);
  let roundedZ = Math.floor(axialZ + 0.5);
  const diffX = Math.abs(roundedX - axialX);
  const diffY = Math.abs(roundedY - axialY);
  const diffZ = Math.abs(roundedZ - axialZ);

  if (diffX > diffY && diffX > diffZ) {
    roundedX = -roundedY - roundedZ;
  } else if (diffY > diffZ) {
    roundedY = -roundedX - roundedZ;
  } else {
    roundedZ = -roundedX - roundedY;
  }

  return { x: roundedX, y: roundedY };
}

function getHeightFromHeightmapColor(red: number, green: number, blue: number): number {
  if (isWaterHeightColor(red, green, blue)) {
    return 0;
  }

  const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
  return Math.max(0, Math.min(luminance, 1));
}

function syncProjectedPoints(input: {
  canvas: HTMLCanvasElement;
  heights: Float32Array;
  columns: number;
  rows: number;
}): void {
  const stage = input.canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  if (stage == null) {
    return;
  }

  const matrix = createTerrainMatrix(
    input.canvas.width / Math.max(input.canvas.height, 1)
  );
  const points = stage.querySelectorAll<HTMLElement>("[data-terrain-projected-point]");
  for (const point of points) {
    const u = Number(point.dataset.mapHeightU);
    const v = Number(point.dataset.mapHeightV);
    if (!Number.isFinite(u) || !Number.isFinite(v)) {
      point.removeAttribute("data-terrain-projection-ready");
      continue;
    }

    const height = sampleHeightAt(input.heights, input.columns, input.rows, u, v);
    const worldPoint = createTerrainWorldPoint(u, v, height);
    const screenPoint = projectPoint(matrix, worldPoint);
    const left = ((screenPoint.x + 1) / 2) * 100;
    const bottom = ((screenPoint.y + 1) / 2) * 100;
    const isVisible =
      screenPoint.w > 0 &&
      screenPoint.z >= -1 &&
      screenPoint.z <= 1 &&
      left >= 0 &&
      left <= 100 &&
      bottom >= 0 &&
      bottom <= 100;
    point.toggleAttribute("hidden", !isVisible);
    point.setAttribute("data-terrain-projection-ready", "true");
    if (!isVisible) {
      continue;
    }
    const perspectiveScale = Math.min(Math.max(1 / Math.max(screenPoint.w, 0.45), 0.58), 1.42);
    const depthLayer = Math.round((1 - screenPoint.y) * 100);
    point.style.setProperty(
      "--terrain-point-offset-x",
      "0px"
    );
    point.style.setProperty(
      "--terrain-point-offset-y",
      "0px"
    );
    point.style.setProperty("--terrain-point-left", `${left.toFixed(3)}%`);
    point.style.setProperty("--terrain-point-top", "auto");
    point.style.setProperty("--terrain-point-bottom", `${bottom.toFixed(3)}%`);
    point.style.setProperty("--terrain-point-perspective-scale", perspectiveScale.toFixed(3));
    point.style.zIndex = `${20 + depthLayer}`;
  }
}

function sampleHeightAt(
  heights: Float32Array,
  columns: number,
  rows: number,
  u: number,
  v: number
): number {
  const x = Math.min(Math.max(Math.round(u * (columns - 1)), 0), columns - 1);
  const y = Math.min(Math.max(Math.round(v * (rows - 1)), 0), rows - 1);
  return heights[y * columns + x] ?? 0;
}

function isWaterHeightColor(red: number, green: number, blue: number): boolean {
  return blue > 72 && blue > red * 1.35 && blue > green * 1.18;
}

function readCampaignActorData(canvas: HTMLCanvasElement): CampaignActorData | null {
  const stage = canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  const playerElement = stage?.querySelector<HTMLElement>("[data-campaign-player='true']");
  if (playerElement == null) {
    return null;
  }

  const u = Number(playerElement.dataset.mapHeightU);
  const v = Number(playerElement.dataset.mapHeightV);
  if (!Number.isFinite(u) || !Number.isFinite(v)) {
    return null;
  }

  return {
    u,
    v,
    facingDegrees: Number(playerElement.dataset.campaignPlayerFacingDeg) || 0,
    isMoving: playerElement.dataset.campaignPlayerMoving === "true",
    modelUrl: playerElement.dataset.campaignPlayerModelUrl ?? null,
    textureUrl: playerElement.dataset.campaignPlayerTextureUrl ?? null,
    idleAnimationUrl: playerElement.dataset.campaignPlayerIdleAnimationUrl ?? null,
    walkAnimationUrl: playerElement.dataset.campaignPlayerWalkAnimationUrl ?? null,
  };
}

function readCampaignTerrainStyle(canvas: HTMLCanvasElement): CampaignTerrainStyle {
  return {
    saturation: readFiniteDatasetNumber(
      canvas.dataset.mapTextureSaturation,
      DEFAULT_CAMPAIGN_TERRAIN_STYLE.saturation,
      0,
      3
    ),
    brightness: readFiniteDatasetNumber(
      canvas.dataset.mapTextureBrightness,
      DEFAULT_CAMPAIGN_TERRAIN_STYLE.brightness,
      0,
      3
    ),
    brightnessOffset: readFiniteDatasetNumber(
      canvas.dataset.mapTextureBrightnessOffset,
      DEFAULT_CAMPAIGN_TERRAIN_STYLE.brightnessOffset,
      -0.5,
      0.5
    ),
    shadeMin: readFiniteDatasetNumber(
      canvas.dataset.mapTextureShadeMin,
      DEFAULT_CAMPAIGN_TERRAIN_STYLE.shadeMin,
      0,
      2
    ),
    shadeMax: readFiniteDatasetNumber(
      canvas.dataset.mapTextureShadeMax,
      DEFAULT_CAMPAIGN_TERRAIN_STYLE.shadeMax,
      0,
      2
    ),
  };
}

function readCampaignCityDepthMeshTransform(
  canvas: HTMLCanvasElement
): CampaignCityDepthMeshTransform {
  return {
    rotationDegrees: readFiniteDatasetNumber(
      canvas.dataset.campaignCityRotation,
      DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM.rotationDegrees,
      -180,
      180
    ),
    pitchDegrees: readFiniteDatasetNumber(
      canvas.dataset.campaignCityPitch,
      DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM.pitchDegrees,
      -90,
      90
    ),
    scale: readFiniteDatasetNumber(
      canvas.dataset.campaignCityScale,
      DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM.scale,
      0.1,
      6
    ),
    offsetX: readFiniteDatasetNumber(
      canvas.dataset.campaignCityOffsetX,
      DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM.offsetX,
      -1,
      1
    ),
    offsetY: readFiniteDatasetNumber(
      canvas.dataset.campaignCityOffsetY,
      DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM.offsetY,
      -1,
      1
    ),
    lift: readFiniteDatasetNumber(
      canvas.dataset.campaignCityLift,
      DEFAULT_CAMPAIGN_CITY_DEPTH_MESH_TRANSFORM.lift,
      -0.08,
      0.16
    ),
  };
}

function getCampaignCityDepthMeshTransformSignature(
  transform: CampaignCityDepthMeshTransform
): string {
  return [
    transform.rotationDegrees.toFixed(3),
    transform.pitchDegrees.toFixed(3),
    transform.scale.toFixed(3),
    transform.offsetX.toFixed(3),
    transform.offsetY.toFixed(3),
    transform.lift.toFixed(4),
  ].join("|");
}

function readFiniteDatasetNumber(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.min(Math.max(parsedValue, min), max);
}

function createActorMesh(
  actor: CampaignActorData,
  height: number,
  model: ActorModelAsset,
  animations: ActorAnimationSetAsset
): ActorMeshData {
  const scaleCompensation = clamp(
    ACTOR_REFERENCE_CAMERA_SCALE / Math.max(currentCamera.scale, 0.0001),
    0.18,
    1.6
  );
  const angle =
    actor.facingDegrees * Math.PI / 180 +
    ACTOR_MODEL_FACING_OFFSET_RADIANS;
  const activeClip = actor.isMoving ? animations.walk : animations.idle;
  const sampledPose = sampleActorAnimationPose(
    activeClip,
    model.bones,
    model.originOffset,
    performance.now()
  );
  const center = createTerrainWorldPoint(
    actor.u,
    actor.v,
    height
  );
  const scale = ACTOR_MODEL_BASE_SCALE * model.scale * scaleCompensation;
  const localBindPositions = model.localBindPositions;
  const bindNormals = model.bindNormals;
  const uvs = model.uvs;
  const output = new Float32Array((localBindPositions.length / 3) * 8);
  const facingCos = Math.cos(angle);
  const facingSin = Math.sin(angle);
  for (let vertexIndex = 0; vertexIndex < localBindPositions.length / 3; vertexIndex += 1) {
    const positionOffset = vertexIndex * 3;
    const uvOffset = vertexIndex * 2;
    const outputOffset = vertexIndex * 8;
    const boneIndex = model.vertexBoneIndices[vertexIndex] ?? 0;
    const boneRotation = sampledPose.globalRotations[boneIndex] ?? IDENTITY_QUATERNION;
    const bonePosition = sampledPose.globalPositions[boneIndex] ?? [0, 0, 0];
    const animatedLocalPosition = rotateVectorByQuaternion([
      (localBindPositions[positionOffset] ?? 0) * scale,
      (localBindPositions[positionOffset + 1] ?? 0) * scale,
      (localBindPositions[positionOffset + 2] ?? 0) * scale,
    ], boneRotation);
    const animatedActorPosition: [number, number, number] = [
      bonePosition[0] * scale + animatedLocalPosition[0],
      bonePosition[1] * scale + animatedLocalPosition[1],
      bonePosition[2] * scale + animatedLocalPosition[2],
    ];
    const rotatedX =
      animatedActorPosition[0] * facingCos - animatedActorPosition[1] * facingSin;
    const rotatedY =
      animatedActorPosition[0] * facingSin + animatedActorPosition[1] * facingCos;
    const rotatedNormal = rotateVectorByQuaternion([
      bindNormals[positionOffset] ?? 0,
      bindNormals[positionOffset + 1] ?? 0,
      bindNormals[positionOffset + 2] ?? 1,
    ], boneRotation);
    const rotatedNormalX =
      rotatedNormal[0] * facingCos - rotatedNormal[1] * facingSin;
    const rotatedNormalY =
      rotatedNormal[0] * facingSin + rotatedNormal[1] * facingCos;

    output[outputOffset] = center[0] + rotatedX;
    output[outputOffset + 1] = center[1] + rotatedY;
    output[outputOffset + 2] = center[2] + animatedActorPosition[2];
    output[outputOffset + 3] = rotatedNormalX;
    output[outputOffset + 4] = rotatedNormalY;
    output[outputOffset + 5] = rotatedNormal[2];
    output[outputOffset + 6] = uvs[uvOffset] ?? 0;
    output[outputOffset + 7] = uvs[uvOffset + 1] ?? 0;
  }

  return {
    vertices: output,
    indices: model.indices,
  };
}

function computeActorGlobalBonePositions(bones: ActorBoneAsset[]): [number, number, number][] {
  const globalPositions = bones.map(() => [0, 0, 0] as [number, number, number]);
  for (let index = 0; index < bones.length; index += 1) {
    const bone = bones[index];
    if (bone == null) {
      continue;
    }

    if (bone.parentIndex == null) {
      globalPositions[index] = [...bone.localPosition];
      continue;
    }

    const parentPosition = globalPositions[bone.parentIndex] ?? [0, 0, 0];
    globalPositions[index] = [
      parentPosition[0] + bone.localPosition[0],
      parentPosition[1] + bone.localPosition[1],
      parentPosition[2] + bone.localPosition[2],
    ];
  }
  return globalPositions;
}

function sampleActorAnimationPose(
  clip: ActorAnimationClipAsset,
  bones: ActorBoneAsset[],
  originOffset: [number, number, number],
  timeMs: number
): ActorAnimationPose {
  const durationFrames = Math.max(clip.numFrames, 1);
  const frameFloat = ((timeMs / 1000) * Math.max(clip.fps, 0.001)) % durationFrames;
  const frameA = Math.floor(frameFloat) % durationFrames;
  const frameB = (frameA + 1) % durationFrames;
  const frameMix = frameFloat - Math.floor(frameFloat);
  const globalRotations = bones.map(() => [0, 0, 0, 1] as [number, number, number, number]);
  const globalPositions = bones.map(() => [0, 0, 0] as [number, number, number]);
  const firstRootPosition = clip.rootPositions[0] ?? [0, 0, 0];
  const sampledRootPosition = lerpVector3(
    clip.rootPositions[frameA] ?? firstRootPosition,
    clip.rootPositions[frameB] ?? firstRootPosition,
    frameMix
  );

  globalPositions[0] = [
    originOffset[0] ?? 0,
    originOffset[1] ?? 0,
    (originOffset[2] ?? 0) + sampledRootPosition[2] - (firstRootPosition[2] ?? 0),
  ];
  globalRotations[0] = [0, 0, 0, 1];

  for (let boneIndex = 1; boneIndex < bones.length; boneIndex += 1) {
    const bone = bones[boneIndex];
    if (bone == null) {
      continue;
    }

    const parentIndex = bone.parentIndex ?? 0;
    const localRotation = sampleClipQuaternion(clip, boneIndex - 1, frameA, frameB, frameMix);
    const parentRotation = globalRotations[parentIndex] ?? IDENTITY_QUATERNION;
    const parentPosition = globalPositions[parentIndex] ?? [0, 0, 0];
    const rotatedLocalPosition = rotateVectorByQuaternion(bone.localPosition, parentRotation);

    globalRotations[boneIndex] = normalizeQuaternion(
      multiplyQuaternions(parentRotation, localRotation)
    );
    globalPositions[boneIndex] = [
      parentPosition[0] + rotatedLocalPosition[0],
      parentPosition[1] + rotatedLocalPosition[1],
      parentPosition[2] + rotatedLocalPosition[2],
    ];
  }

  return {
    globalRotations,
    globalPositions,
  };
}

function sampleClipQuaternion(
  clip: ActorAnimationClipAsset,
  animatedBoneIndex: number,
  frameA: number,
  frameB: number,
  frameMix: number
): [number, number, number, number] {
  const frameARotation = clip.rotations[frameA]?.[animatedBoneIndex] ?? IDENTITY_QUATERNION;
  const frameBRotation = clip.rotations[frameB]?.[animatedBoneIndex] ?? frameARotation;
  return nlerpQuaternion(frameARotation, frameBRotation, frameMix);
}

function lerpVector3(
  from: number[],
  to: number[],
  amount: number
): [number, number, number] {
  return [
    (from[0] ?? 0) + ((to[0] ?? 0) - (from[0] ?? 0)) * amount,
    (from[1] ?? 0) + ((to[1] ?? 0) - (from[1] ?? 0)) * amount,
    (from[2] ?? 0) + ((to[2] ?? 0) - (from[2] ?? 0)) * amount,
  ];
}

function multiplyQuaternions(
  a: [number, number, number, number],
  b: [number, number, number, number]
): [number, number, number, number] {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

function rotateVectorByQuaternion(
  vector: [number, number, number],
  quaternion: [number, number, number, number]
): [number, number, number] {
  const [x, y, z] = vector;
  const [qx, qy, qz, qw] = quaternion;
  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;

  return [
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx,
  ];
}

function normalizeQuaternion(input: number[]): [number, number, number, number] {
  const length =
    Math.hypot(input[0] ?? 0, input[1] ?? 0, input[2] ?? 0, input[3] ?? 0) ||
    1;
  return [
    (input[0] ?? 0) / length,
    (input[1] ?? 0) / length,
    (input[2] ?? 0) / length,
    (input[3] ?? 1) / length,
  ];
}

function nlerpQuaternion(
  from: number[],
  to: number[],
  amount: number
): [number, number, number, number] {
  const dot =
    (from[0] ?? 0) * (to[0] ?? 0) +
    (from[1] ?? 0) * (to[1] ?? 0) +
    (from[2] ?? 0) * (to[2] ?? 0) +
    (from[3] ?? 1) * (to[3] ?? 1);
  const sign = dot < 0 ? -1 : 1;
  return normalizeQuaternion([
    (from[0] ?? 0) + ((to[0] ?? 0) * sign - (from[0] ?? 0)) * amount,
    (from[1] ?? 0) + ((to[1] ?? 0) * sign - (from[1] ?? 0)) * amount,
    (from[2] ?? 0) + ((to[2] ?? 0) * sign - (from[2] ?? 0)) * amount,
    (from[3] ?? 1) + ((to[3] ?? 1) * sign - (from[3] ?? 1)) * amount,
  ]);
}

function createHexLayeredHeightSamples(
  heights: Float32Array,
  columns: number,
  rows: number
): Float32Array {
  const layeredHeights = new Float32Array(heights.length);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const hexPoint = terrainUvToHexPoint(u, v);
      const hexCell = pixelToRoundedHex(hexPoint.x, hexPoint.y);
      const hexCenter = hexToPixel(hexCell.x, hexCell.y);
      const centerU = hexPointToTerrainU(hexCenter.x);
      const centerV = hexPointToTerrainV(hexCenter.y);
      const centerHeight = sampleHeightAt(heights, columns, rows, centerU, centerV);
      layeredHeights[y * columns + x] = quantizeHexElevation(centerHeight);
    }
  }

  return layeredHeights;
}

function createHexLayeredTerrainMesh(
  heights: Float32Array,
  columns: number,
  rows: number
): MeshData {
  const vertices: number[] = [];
  const indices: number[] = [];
  const hexCells = getTerrainHexCells();
  const heightByCellKey = new Map<string, number>();

  for (const cell of hexCells) {
    const center = hexToPixel(cell.x, cell.y);
    const height = sampleHeightAt(
      heights,
      columns,
      rows,
      hexPointToTerrainU(center.x),
      hexPointToTerrainV(center.y)
    );
    heightByCellKey.set(getHexCellKey(cell.x, cell.y), height);
  }

  for (const cell of hexCells) {
    const center = hexToPixel(cell.x, cell.y);
    const height = heightByCellKey.get(getHexCellKey(cell.x, cell.y)) ?? 0;
    const centerVertexIndex = addHexTerrainVertex(vertices, center.x, center.y, height);
    const cornerVertexIndices = HEX_CORNER_OFFSETS.map((corner) =>
      addHexTerrainVertex(vertices, center.x + corner.x, center.y + corner.y, height)
    );

    for (let cornerIndex = 0; cornerIndex < cornerVertexIndices.length; cornerIndex += 1) {
      const nextCornerIndex = (cornerIndex + 1) % cornerVertexIndices.length;
      indices.push(
        centerVertexIndex,
        cornerVertexIndices[nextCornerIndex] ?? centerVertexIndex,
        cornerVertexIndices[cornerIndex] ?? centerVertexIndex
      );
    }

    for (let edgeIndex = 0; edgeIndex < HEX_NEIGHBOR_DIRECTIONS.length; edgeIndex += 1) {
      const neighbor = HEX_NEIGHBOR_DIRECTIONS[edgeIndex] ?? { x: 0, y: 0 };
      const neighborHeight =
        heightByCellKey.get(getHexCellKey(cell.x + neighbor.x, cell.y + neighbor.y)) ??
        0;
      if (height <= neighborHeight + HEX_WALL_HEIGHT_EPSILON) {
        continue;
      }

      const firstCorner = HEX_CORNER_OFFSETS[edgeIndex] ?? HEX_CORNER_OFFSETS[0];
      const secondCorner =
        HEX_CORNER_OFFSETS[(edgeIndex + 1) % HEX_CORNER_OFFSETS.length] ??
        HEX_CORNER_OFFSETS[0];
      addHexTerrainWall(
        vertices,
        indices,
        center.x + firstCorner.x,
        center.y + firstCorner.y,
        center.x + secondCorner.x,
        center.y + secondCorner.y,
        height,
        neighborHeight
      );
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
  };
}

const HEX_CORNER_OFFSETS = [
  { x: 0, y: -1 },
  { x: Math.sqrt(3) / 2, y: -0.5 },
  { x: Math.sqrt(3) / 2, y: 0.5 },
  { x: 0, y: 1 },
  { x: -Math.sqrt(3) / 2, y: 0.5 },
  { x: -Math.sqrt(3) / 2, y: -0.5 },
] as const;

const HEX_NEIGHBOR_DIRECTIONS = [
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
] as const;

function getTerrainHexCells(): Array<{ x: number; y: number }> {
  const mapMinX = -HEX_MAP_ASPECT * HEX_TERRAIN_SCALE * 0.5;
  const mapMaxX = HEX_MAP_ASPECT * HEX_TERRAIN_SCALE * 0.5;
  const mapMinY = -HEX_TERRAIN_SCALE * 0.5;
  const mapMaxY = HEX_TERRAIN_SCALE * 0.5;
  const axialBounds = [
    pixelToRoundedHex(mapMinX, mapMinY),
    pixelToRoundedHex(mapMaxX, mapMinY),
    pixelToRoundedHex(mapMinX, mapMaxY),
    pixelToRoundedHex(mapMaxX, mapMaxY),
  ];
  const minX = Math.min(...axialBounds.map((cell) => cell.x)) - 2;
  const maxX = Math.max(...axialBounds.map((cell) => cell.x)) + 2;
  const minY = Math.min(...axialBounds.map((cell) => cell.y)) - 2;
  const maxY = Math.max(...axialBounds.map((cell) => cell.y)) + 2;
  const cells: Array<{ x: number; y: number }> = [];

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const center = hexToPixel(x, y);
      if (
        center.x < mapMinX - Math.sqrt(3) ||
        center.x > mapMaxX + Math.sqrt(3) ||
        center.y < mapMinY - 1 ||
        center.y > mapMaxY + 1
      ) {
        continue;
      }
      cells.push({ x, y });
    }
  }

  return cells;
}

function addHexTerrainWall(
  vertices: number[],
  indices: number[],
  firstX: number,
  firstY: number,
  secondX: number,
  secondY: number,
  topHeight: number,
  bottomHeight: number
): void {
  const topFirst = addHexTerrainVertex(vertices, firstX, firstY, topHeight);
  const topSecond = addHexTerrainVertex(vertices, secondX, secondY, topHeight);
  const bottomFirst = addHexTerrainVertex(vertices, firstX, firstY, bottomHeight);
  const bottomSecond = addHexTerrainVertex(vertices, secondX, secondY, bottomHeight);

  indices.push(topFirst, bottomFirst, topSecond, topSecond, bottomFirst, bottomSecond);
}

function addHexTerrainVertex(
  vertices: number[],
  hexPointX: number,
  hexPointY: number,
  height: number
): number {
  const u = hexPointToTerrainU(hexPointX);
  const v = hexPointToTerrainV(hexPointY);
  const vertexIndex = vertices.length / 5;
  vertices.push(
    (u - 0.5) * 2,
    (0.5 - v) * 2,
    height * HEIGHT_SCALE,
    u,
    v
  );

  return vertexIndex;
}

function terrainUvToHexPoint(u: number, v: number): { x: number; y: number } {
  return {
    x: (u - 0.5) * HEX_MAP_ASPECT * HEX_TERRAIN_SCALE,
    y: (v - 0.5) * HEX_TERRAIN_SCALE,
  };
}

function hexPointToTerrainU(x: number): number {
  return clamp(x / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE) + 0.5, 0, 1);
}

function hexPointToTerrainV(y: number): number {
  return clamp(y / HEX_TERRAIN_SCALE + 0.5, 0, 1);
}

function getHexCellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function quantizeHexElevation(height: number): number {
  if (height <= HEX_WATER_HEIGHT_THRESHOLD) {
    return 0;
  }

  const level = Math.max(
    1,
    Math.round(clamp(height, 0, 1) * (HEX_ELEVATION_LEVELS - 1))
  );

  return level / (HEX_ELEVATION_LEVELS - 1);
}

function createTexture(
  gl: WebGLRenderingContext,
  image: TexImageSource,
  options?: {
    wrapS?: number;
    wrapT?: number;
  }
): WebGLTexture {
  const texture = gl.createTexture();
  if (texture == null) {
    throw new Error("Failed to allocate campaign map texture.");
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_S,
    options?.wrapS ?? gl.CLAMP_TO_EDGE
  );
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_T,
    options?.wrapT ?? gl.CLAMP_TO_EDGE
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): void {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(Math.floor(canvas.clientWidth * pixelRatio), 1);
  const height = Math.max(Math.floor(canvas.clientHeight * pixelRatio), 1);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function createTerrainMatrix(aspectRatio: number): Mat4 {
  const safeScale = Math.max(currentCamera.scale, 0.1);
  const screenScale = safeScale / CAMERA_REFERENCE_SCALE;
  const projection = createPerspectiveMatrix(FOV_RADIANS, aspectRatio, 0.1, 20);
  const translation = createTranslationMatrix(
    currentCamera.offsetX * CAMERA_OFFSET_UNIT / CAMERA_REFERENCE_SCALE / screenScale,
    -currentCamera.offsetY * CAMERA_OFFSET_UNIT / CAMERA_REFERENCE_SCALE / screenScale,
    -CAMERA_BASE_DISTANCE / CAMERA_REFERENCE_SCALE
  );
  const tilt = createRotationXMatrix(CAMERA_TILT_RADIANS);
  const scale = createScaleMatrix(TERRAIN_SCALE, TERRAIN_SCALE, 1);
  const screenZoom = createScaleMatrix(screenScale, screenScale, 1);

  return multiplyMatrices(
    screenZoom,
    multiplyMatrices(
      projection,
      multiplyMatrices(translation, multiplyMatrices(tilt, scale))
    )
  );
}

function createTerrainWorldPoint(
  u: number,
  v: number,
  height: number
): [number, number, number] {
  return [
    (u - 0.5) * 2,
    (0.5 - v) * 2,
    height * HEIGHT_SCALE,
  ];
}

function projectPoint(matrix: Mat4, point: [number, number, number]): {
  x: number;
  y: number;
  z: number;
  w: number;
} {
  const [x, y, z] = point;
  const clipX =
    readMatrixValue(matrix, 0) * x +
    readMatrixValue(matrix, 4) * y +
    readMatrixValue(matrix, 8) * z +
    readMatrixValue(matrix, 12);
  const clipY =
    readMatrixValue(matrix, 1) * x +
    readMatrixValue(matrix, 5) * y +
    readMatrixValue(matrix, 9) * z +
    readMatrixValue(matrix, 13);
  const clipZ =
    readMatrixValue(matrix, 2) * x +
    readMatrixValue(matrix, 6) * y +
    readMatrixValue(matrix, 10) * z +
    readMatrixValue(matrix, 14);
  const clipW =
    readMatrixValue(matrix, 3) * x +
    readMatrixValue(matrix, 7) * y +
    readMatrixValue(matrix, 11) * z +
    readMatrixValue(matrix, 15);
  const safeW = Math.abs(clipW) < 0.0001 ? 1 : clipW;

  return {
    x: clipX / safeW,
    y: clipY / safeW,
    z: clipZ / safeW,
    w: Math.abs(safeW),
  };
}

function findNearestTerrainUvForScreenPoint(
  matrix: Mat4,
  targetScreenX: number,
  targetScreenY: number,
  heights: Float32Array,
  columns: number,
  rows: number
): CampaignTerrainUvPoint | null {
  let bestPoint: CampaignTerrainUvPoint | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  const coarseColumns = 28;
  const coarseRows = 20;

  for (let row = 0; row <= coarseRows; row += 1) {
    const v = row / coarseRows;
    for (let column = 0; column <= coarseColumns; column += 1) {
      const u = column / coarseColumns;
      const distance = getScreenDistanceToTerrainPoint(
        matrix,
        targetScreenX,
        targetScreenY,
        u,
        v,
        heights,
        columns,
        rows
      );
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPoint = { u, v };
      }
    }
  }

  if (bestPoint == null || !Number.isFinite(bestDistance)) {
    return null;
  }

  for (const radius of [0.12, 0.06, 0.03, 0.015, 0.0075]) {
    const center = bestPoint;
    for (let deltaV = -1; deltaV <= 1; deltaV += 1) {
      for (let deltaU = -1; deltaU <= 1; deltaU += 1) {
        const u = clamp(center.u + deltaU * radius, 0, 1);
        const v = clamp(center.v + deltaV * radius, 0, 1);
        const distance = getScreenDistanceToTerrainPoint(
          matrix,
          targetScreenX,
          targetScreenY,
          u,
          v,
          heights,
          columns,
          rows
        );
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPoint = { u, v };
        }
      }
    }
  }

  return bestPoint;
}

function getScreenDistanceToTerrainPoint(
  matrix: Mat4,
  targetScreenX: number,
  targetScreenY: number,
  u: number,
  v: number,
  heights: Float32Array,
  columns: number,
  rows: number
): number {
  const height = sampleHeightAt(heights, columns, rows, u, v);
  const screenPoint = projectPoint(matrix, createTerrainWorldPoint(u, v, height));
  if (
    !Number.isFinite(screenPoint.x) ||
    !Number.isFinite(screenPoint.y) ||
    screenPoint.w <= 0 ||
    screenPoint.z < -1 ||
    screenPoint.z > 1
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const deltaX = screenPoint.x - targetScreenX;
  const deltaY = screenPoint.y - targetScreenY;
  return Math.hypot(deltaX, deltaY);
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (shader == null) {
    throw new Error("Failed to allocate WebGL shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error.";
    gl.deleteShader(shader);
    throw new Error(message);
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
    throw new Error("Failed to allocate WebGL program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown WebGL link error.";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

function multiplyMatrices(left: Mat4, right: Mat4): Mat4 {
  const result = new Float32Array(16);

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      result[column * 4 + row] =
        readMatrixValue(left, row) * readMatrixValue(right, column * 4) +
        readMatrixValue(left, 4 + row) * readMatrixValue(right, column * 4 + 1) +
        readMatrixValue(left, 8 + row) * readMatrixValue(right, column * 4 + 2) +
        readMatrixValue(left, 12 + row) * readMatrixValue(right, column * 4 + 3);
    }
  }

  return result;
}

function readMatrixValue(matrix: Mat4, index: number): number {
  return matrix[index] ?? 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function createPerspectiveMatrix(
  fovRadians: number,
  aspectRatio: number,
  near: number,
  far: number
): Mat4 {
  const f = 1 / Math.tan(fovRadians / 2);
  const rangeInverse = 1 / (near - far);

  return new Float32Array([
    f / aspectRatio, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInverse, -1,
    0, 0, near * far * rangeInverse * 2, 0,
  ]);
}

function createTranslationMatrix(x: number, y: number, z: number): Mat4 {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ]);
}

function createRotationXMatrix(angleRadians: number): Mat4 {
  const cosine = Math.cos(angleRadians);
  const sine = Math.sin(angleRadians);

  return new Float32Array([
    1, 0, 0, 0,
    0, cosine, sine, 0,
    0, -sine, cosine, 0,
    0, 0, 0, 1,
  ]);
}

function createScaleMatrix(x: number, y: number, z: number): Mat4 {
  return new Float32Array([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z,
    0,
    0, 0, 0, 1,
  ]);
}

const vertexShaderSource = `
  attribute vec3 aPosition;
  attribute vec2 aUv;
  uniform mat4 uMatrix;
  varying vec2 vUv;
  varying float vHeight;
  varying vec2 vTerrainPosition;

  void main() {
    vUv = aUv;
    vHeight = aPosition.z / ${HEIGHT_SCALE.toFixed(2)};
    vTerrainPosition = aPosition.xy;
    gl_Position = uMatrix * vec4(aPosition, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform sampler2D uMaterialTexture;
  uniform vec3 uLandTextureColorAdjust;
  uniform vec2 uLandTextureShadeRange;
  varying vec2 vUv;
  varying float vHeight;
  varying vec2 vTerrainPosition;

  float colorDistance(vec3 left, vec3 right) {
    return distance(left, right);
  }

  float materialWeight(vec3 material, vec3 target, float radius) {
    return 1.0 - smoothstep(0.0, radius, colorDistance(material, target));
  }

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  float getWaterAmount(vec3 terrainType) {
    return
      step(0.22, terrainType.r) *
      (1.0 - step(0.12, terrainType.g)) *
      (1.0 - step(0.12, terrainType.b));
  }

  vec2 hexToPixel(vec2 hex) {
    return vec2(
      1.7320508 * (hex.x + hex.y * 0.5),
      1.5 * hex.y
    );
  }

  vec3 cubeRound(vec3 cube) {
    vec3 rounded = floor(cube + 0.5);
    vec3 difference = abs(rounded - cube);

    if (difference.x > difference.y && difference.x > difference.z) {
      rounded.x = -rounded.y - rounded.z;
    } else if (difference.y > difference.z) {
      rounded.y = -rounded.x - rounded.z;
    } else {
      rounded.z = -rounded.x - rounded.y;
    }

    return rounded;
  }

  vec2 pixelToRoundedHex(vec2 point) {
    vec2 axial = vec2(
      0.5773503 * point.x - 0.3333333 * point.y,
      0.6666667 * point.y
    );
    vec3 cube = vec3(axial.x, axial.y, -axial.x - axial.y);
    vec3 roundedCube = cubeRound(cube);

    return roundedCube.xy;
  }

  float getHexGridLine(vec2 point, vec2 cell) {
    vec2 center = hexToPixel(cell);
    float centerDistance = length(point - center);
    float neighborDistance = 1000.0;

    neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(1.0, 0.0))));
    neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(-1.0, 0.0))));
    neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(0.0, 1.0))));
    neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(0.0, -1.0))));
    neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(1.0, -1.0))));
    neighborDistance = min(neighborDistance, length(point - hexToPixel(cell + vec2(-1.0, 1.0))));

    float boundaryDistance = abs(neighborDistance - centerDistance);
    float lineWidth = 0.026;

    return 1.0 - smoothstep(0.0, lineWidth, boundaryDistance);
  }

  vec2 getHexAtlasUv(vec2 point, vec2 cell) {
    const float tileCount = 4.0;
    vec2 localPoint = point - hexToPixel(cell);
    vec2 localUv = clamp(
      vec2(localPoint.x / 1.7320508 + 0.5, localPoint.y / 2.0 + 0.5),
      0.0,
      1.0
    );
    float tileIndex = floor(hash(cell) * 16.0);
    vec2 tile = vec2(mod(tileIndex, tileCount), floor(tileIndex / tileCount));

    return (tile + localUv) / tileCount;
  }

  vec3 getHexTerrainColor(vec3 terrainType) {
    float water = getWaterAmount(terrainType);
    float plain =
      step(0.22, terrainType.g) *
      step(terrainType.r, 0.45) *
      (1.0 - water);
    float coast =
      step(0.36, terrainType.b) *
      step(0.30, terrainType.g) *
      (1.0 - water);
    float mountain =
      max(
        materialWeight(terrainType, vec3(0.38, 0.25, 0.25), 0.22),
        materialWeight(terrainType, vec3(0.50, 0.50, 0.25), 0.24)
      ) * (1.0 - water) * (1.0 - plain);

    vec3 color = vec3(0.39, 0.52, 0.27);
    color = mix(color, vec3(0.18, 0.55, 0.26), plain);
    color = mix(color, vec3(0.44, 0.38, 0.25), mountain);
    color = mix(color, vec3(0.24, 0.64, 0.52), coast * (1.0 - plain));
    color = mix(color, vec3(0.10, 0.35, 0.72), water);

    return color;
  }

  vec3 boostLandTextureColor(vec3 color) {
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 saturated = mix(vec3(luma), color, uLandTextureColorAdjust.x);

    return clamp(
      saturated * uLandTextureColorAdjust.y + vec3(uLandTextureColorAdjust.z),
      0.0,
      1.0
    );
  }

  void main() {
    const float hexScale = ${HEX_TERRAIN_SCALE.toFixed(1)};
    const float mapAspect = ${HEX_MAP_ASPECT.toFixed(4)};
    vec2 hexPoint = vec2((vUv.x - 0.5) * mapAspect, vUv.y - 0.5) * hexScale;
    vec2 hexCell = pixelToRoundedHex(hexPoint);
    vec2 hexCenter = hexToPixel(hexCell);
    vec2 hexUv = vec2(
      hexCenter.x / (hexScale * mapAspect) + 0.5,
      hexCenter.y / hexScale + 0.5
    );
    vec2 atlasUv = getHexAtlasUv(hexPoint, hexCell);
    vec4 base = texture2D(uTexture, atlasUv);
    vec3 material = texture2D(uMaterialTexture, clamp(hexUv, 0.0, 1.0)).rgb;
    vec3 terrainColor = getHexTerrainColor(material);
    float water = getWaterAmount(material);
    float shade = clamp(${GRASS_AMBIENT_LIGHT.toFixed(2)} + vHeight * 0.16, 0.50, 1.08);
    float materialLuma = dot(material, vec3(0.2126, 0.7152, 0.0722));
    vec3 landTexture = boostLandTextureColor(base.rgb);
    float landTextureLuma = dot(landTexture, vec3(0.2126, 0.7152, 0.0722));
    landTexture = clamp(
      mix(vec3(landTextureLuma), landTexture, ${GRASS_TEXTURE_DETAIL.toFixed(2)}),
      0.0,
      1.0
    );
    float landShade = mix(uLandTextureShadeRange.x, uLandTextureShadeRange.y, shade);
    vec3 landColor = landTexture * landShade * mix(0.96, 1.08, materialLuma);
    vec3 waterColor = terrainColor * shade;
    vec3 color = mix(landColor, waterColor, water);

    float border = getHexGridLine(hexPoint, hexCell);
    color = mix(color, vec3(0.0), border * 0.34);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const actorVertexShaderSource = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aUv;
  uniform mat4 uMatrix;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vNormal = aNormal;
    vUv = aUv;
    gl_Position = uMatrix * vec4(aPosition, 1.0);
  }
`;

const actorFragmentShaderSource = `
  precision mediump float;
  uniform vec3 uLight;
  uniform sampler2D uTexture;
  uniform vec3 uTint;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    float directionalLight = max(dot(normal, normalize(uLight)), 0.0);
    float light = 0.42 + directionalLight * 0.58;
    vec3 rim = vec3(0.16, 0.12, 0.08) * pow(1.0 - max(normal.z, 0.0), 2.0);
    vec4 base = texture2D(uTexture, vUv);
    if (base.a < 0.08) {
      discard;
    }
    vec3 color = base.rgb * uTint;
    gl_FragColor = vec4(color * light + rim, base.a);
  }
`;
