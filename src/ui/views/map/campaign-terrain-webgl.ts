import type {
  CoordinateSpace,
  GridCoordinate,
  HexTravelGrid,
} from "../../../application/navigation/travel-to-coordinate";
import actorFragmentShaderRaw from "./shaders/campaign-actor.frag.glsl?raw";
import actorVertexShaderRaw from "./shaders/campaign-actor.vert.glsl?raw";
import terrainFragmentShaderRaw from "./shaders/campaign-terrain.frag.glsl?raw";
import terrainVertexShaderRaw from "./shaders/campaign-terrain.vert.glsl?raw";

type CampaignTerrainInput = {
  canvas: HTMLCanvasElement;
  textureUrl: string;
  heightUrl: string;
  materialUrl: string;
  grassTextureUrl: string | null;
  sandTextureUrl: string | null;
  waterTextureUrl: string | null;
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
  localRotation: [number, number, number, number];
};

type ActorModelAsset = {
  scale: number;
  facingOffsetDegrees: number;
  posturePitchDegrees: number;
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint16Array;
  vertexBoneIndices: Uint16Array;
  vertexBoneInfluenceIndices: Uint16Array;
  vertexBoneInfluenceWeights: Float32Array;
  inverseBindMatrices: Float32Array;
  bones: ActorBoneAsset[];
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
  localPositions?: number[][][];
  rootPositions: number[][];
  pelvisPositions: number[][];
};

type ActorAnimationSetAsset = {
  idle: ActorAnimationClipAsset;
  walk: ActorAnimationClipAsset;
};

type ActorAnimationClipName = keyof ActorAnimationSetAsset;

type ActorAnimationPose = {
  globalRotations: [number, number, number, number][];
  globalPositions: [number, number, number][];
};

type ActorAnimationPlaybackState = {
  activeClipName: ActorAnimationClipName;
  activeStartedAtMs: number;
  blendFromClipName: ActorAnimationClipName | null;
  blendFromStartedAtMs: number;
  blendStartedAtMs: number;
  blendDurationMs: number;
};

type Mat4 = Float32Array;

const GRID_COLUMNS = 768;
const GRID_ROWS = 680;
const HEIGHT_SCALE = 0.0675;
const TERRAIN_SCALE = 1.46;
const CAMERA_TILT_TOP_DOWN_RADIANS = -0.36;
const CAMERA_TILT_CLOSE_RADIANS = -0.96;
const CAMERA_TILT_TOP_DOWN_SCALE = 8;
const CAMERA_TILT_CLOSE_SCALE = 48;
const CAMERA_BASE_DISTANCE = 20;
const CAMERA_OFFSET_UNIT = 0.0032;
const CAMERA_REFERENCE_SCALE = 15;
const FOV_RADIANS = 24 * Math.PI / 180;
const ACTOR_REFERENCE_CAMERA_SCALE = 40;
const ACTOR_MODEL_BASE_SCALE = 0.011;
const ACTOR_MODEL_FACING_OFFSET_RADIANS = Math.PI / 2;
const ACTOR_ANIMATION_BLEND_DURATION_MS = 180;
const HEX_TERRAIN_SCALE = 138;
const HEX_MAP_ASPECT = 1.1285;
const SMOOTH_TERRAIN_MESH_STEP = 3;
const SMOOTH_TERRAIN_PASSES = 2;
const SMOOTH_TERRAIN_LAND_BLEND = 0.65;
const SMOOTH_TERRAIN_COAST_BLEND = 0.35;
const TERRAIN_GRID_LAND_OPACITY = 0.08;
const TERRAIN_GRID_WATER_OPACITY = 0.015;
const TERRAIN_NORMAL_SAMPLE_RADIUS_PIXELS = 5;
const TERRAIN_NORMAL_RELIEF_SCALE = 3.4;
const TERRAIN_DIRECTIONAL_LIGHT_STRENGTH = 0.30;
const TERRAIN_BACK_SHADOW_STRENGTH = 0.20;
const TERRAIN_STEEP_SHADOW_STRENGTH = 0;
const TERRAIN_WATER_SHADOW_STRENGTH = 0.12;
const TERRAIN_CAMERA_LIGHT_HEIGHT = 0.34;
const TERRAIN_CAMERA_LIGHT_HORIZONTAL_PULL = 0.64;
const TERRAIN_LAND_TEXTURE_TILING = 7.5;
const SHORELINE_CHAIN_DIRECTIONS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
] as const;
const SHORELINE_CHAIN_OPPOSITE_DIRECTION_INDEXES = [1, 0, 3, 2, 5, 4] as const;
type CampaignTerrainBeachTuning = {
  textureTiling: number;
  blendStrength: number;
  innerRadius: number;
  outerRadius: number;
  fineNoiseTiling: number;
  fineNoiseStrength: number;
  shorelineVisualWaterStrength: number;
  shorelineEdgeWidth: number;
  shorelineWaveStrength: number;
  shorelineWaveFrequency: number;
  shorelineErosionStrength: number;
  shorelineErosionFrequency: number;
  shorelineCornerRoundness: number;
};

type CampaignTerrainBeachConsoleCommand = (
  command?: "status" | "reset" | Partial<CampaignTerrainBeachTuning>
) => CampaignTerrainBeachTuning;

const DEFAULT_TERRAIN_BEACH_TUNING: CampaignTerrainBeachTuning = {
  textureTiling: 18,
  blendStrength: 1.0,
  innerRadius: 2.0,
  outerRadius: 2.4,
  fineNoiseTiling: 30,
  fineNoiseStrength: 0.16,
  shorelineVisualWaterStrength: 0.76,
  shorelineEdgeWidth: 0.38,
  shorelineWaveStrength: 0.30,
  shorelineWaveFrequency: 4.8,
  shorelineErosionStrength: 0.055,
  shorelineErosionFrequency: 22,
  shorelineCornerRoundness: 0.86,
};
const SMOOTH_TERRAIN_KERNEL = [
  { x: -1, y: -1, weight: 1 },
  { x: 0, y: -1, weight: 2 },
  { x: 1, y: -1, weight: 1 },
  { x: -1, y: 0, weight: 2 },
  { x: 0, y: 0, weight: 4 },
  { x: 1, y: 0, weight: 2 },
  { x: -1, y: 1, weight: 1 },
  { x: 0, y: 1, weight: 2 },
  { x: 1, y: 1, weight: 1 },
] as const;
const GRASS_TEXTURE_DETAIL = 1.15;
const GRASS_AMBIENT_LIGHT = 0.58;
const CITY_DEPTH_MESH_WORLD_SCALE = 0.035;
const CITY_DEPTH_MESH_HEIGHT_SCALE = 0.034;
const CITY_DEPTH_MESH_BASE_LIFT = 0.0015;
const CITY_DEPTH_MESH_TILE_OFFSET_X_SCALE = 2 / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE);
const CITY_DEPTH_MESH_TILE_OFFSET_Y_SCALE = 2 / HEX_TERRAIN_SCALE;
const WATER_ANIMATION_FRAME_INTERVAL_MS = 1000 / 24;
const vertexShaderSource = terrainVertexShaderRaw;
const fragmentShaderSource = terrainFragmentShaderRaw;
const actorVertexShaderSource = actorVertexShaderRaw;
const actorFragmentShaderSource = actorFragmentShaderRaw;
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
const IDENTITY_MATRIX_4 = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]);

export type CampaignTerrainCamera = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export function createCampaignTerrainCameraCenteredOnCoordinate(input: {
  coordinate: GridCoordinate;
  coordinateSpace: CoordinateSpace;
  scale: number;
}): CampaignTerrainCamera {
  const safeScale = Math.max(input.scale, 0.1);
  const u = input.coordinate.x / Math.max(input.coordinateSpace.width, 1);
  const v = 1 - input.coordinate.y / Math.max(input.coordinateSpace.height, 1);
  const worldPoint = createTerrainWorldPoint(u, v, 0);
  const scaledX = worldPoint[0] * TERRAIN_SCALE;
  const scaledY = worldPoint[1] * TERRAIN_SCALE;
  const scaledZ = worldPoint[2];
  const cameraTilt = getCampaignTerrainCameraTiltRadiansForScale(safeScale);
  const tiltCos = Math.cos(cameraTilt);
  const tiltSin = Math.sin(cameraTilt);
  const tiltedY = scaledY * tiltCos - scaledZ * tiltSin;
  const cameraTranslateX = -scaledX;
  const cameraTranslateY = -tiltedY;

  return {
    scale: safeScale,
    offsetX: Math.round(cameraTranslateX * safeScale / CAMERA_OFFSET_UNIT),
    offsetY: Math.round(-cameraTranslateY * safeScale / CAMERA_OFFSET_UNIT),
  };
}

type CampaignTerrainRenderer = {
  canvas: HTMLCanvasElement;
  dispose: () => void;
  render: () => void;
  requestRender: (reason?: "static" | "dynamic") => void;
  hasActorAsset: boolean;
  inputSignature: string;
  projectionInput: CampaignTerrainProjectionInput;
  travelGrid: HexTravelGrid;
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
  materialSemanticModel: CampaignMaterialSemanticModel;
  columns: number;
  rows: number;
};

type CampaignMaterialSemanticModel = {
  source: ImageData;
  textureColumns: number;
  textureRows: number;
  minCellX: number;
  minCellY: number;
  cellColumns: number;
  cellRows: number;
  cells: GridCoordinate[];
  landByCellKey: Map<string, boolean>;
};

type ShorelineChainTextureModel = {
  source: ImageData;
  textureColumns: number;
  textureRows: number;
  minCellX: number;
  minCellY: number;
  cellColumns: number;
  cellRows: number;
  maxMileage: number;
};

type ShorelineChainEdge = {
  id: number;
  landCell: GridCoordinate;
  waterCell: GridCoordinate;
  landDirectionIndex: number;
  waterDirectionIndex: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
  startKey: string;
  endKey: string;
  chainStartMileage: number;
  chainLength: number;
  chainSeed: number;
  reverseInChain: boolean;
};

export type CampaignTerrainUvPoint = {
  u: number;
  v: number;
};

export type CampaignTerrainClientPoint = {
  clientX: number;
  clientY: number;
  visible: boolean;
  w: number;
};

let currentCamera: CampaignTerrainCamera = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};
let terrainBeachTuning: CampaignTerrainBeachTuning = {
  ...DEFAULT_TERRAIN_BEACH_TUNING,
};

declare global {
  interface Window {
    rpgTerrainBeach?: CampaignTerrainBeachConsoleCommand;
  }
}

export function requestCampaignTerrainRender(reason: "static" | "dynamic" = "dynamic"): void {
  for (const renderer of activeRenderers.values()) {
    renderer.requestRender(reason);
  }
}

function clampTerrainBeachTuning(
  tuning: CampaignTerrainBeachTuning
): CampaignTerrainBeachTuning {
  return {
    textureTiling: clampNumber(tuning.textureTiling, 2, 80),
    blendStrength: clampNumber(tuning.blendStrength, 0, 2),
    innerRadius: clampNumber(tuning.innerRadius, 0.05, 2.4),
    outerRadius: clampNumber(
      tuning.outerRadius,
      Math.max(tuning.innerRadius + 0.02, 0.07),
      3.6
    ),
    fineNoiseTiling: clampNumber(tuning.fineNoiseTiling, 4, 120),
    fineNoiseStrength: clampNumber(tuning.fineNoiseStrength, 0, 0.5),
    shorelineVisualWaterStrength: clampNumber(tuning.shorelineVisualWaterStrength, 0, 1),
    shorelineEdgeWidth: clampNumber(tuning.shorelineEdgeWidth, 0.02, 1.2),
    shorelineWaveStrength: clampNumber(tuning.shorelineWaveStrength, 0, 0.5),
    shorelineWaveFrequency: clampNumber(tuning.shorelineWaveFrequency, 0.2, 12),
    shorelineErosionStrength: clampNumber(tuning.shorelineErosionStrength, 0, 0.45),
    shorelineErosionFrequency: clampNumber(tuning.shorelineErosionFrequency, 2, 80),
    shorelineCornerRoundness: clampNumber(tuning.shorelineCornerRoundness, 0, 1),
  };
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function setCampaignTerrainBeachTuning(
  nextTuning: Partial<CampaignTerrainBeachTuning>
): CampaignTerrainBeachTuning {
  terrainBeachTuning = clampTerrainBeachTuning({
    ...terrainBeachTuning,
    ...nextTuning,
  });
  requestCampaignTerrainRender("static");

  return { ...terrainBeachTuning };
}

window.rpgTerrainBeach = (command = "status") => {
  if (command === "reset") {
    return setCampaignTerrainBeachTuning(DEFAULT_TERRAIN_BEACH_TUNING);
  }
  if (command !== "status") {
    return setCampaignTerrainBeachTuning(command);
  }

  return { ...terrainBeachTuning };
};

export function setCampaignTerrainCamera(camera: CampaignTerrainCamera): void {
  currentCamera = camera;
  for (const renderer of activeRenderers.values()) {
    renderer.requestRender("static");
  }
}

export function getCampaignTerrainCamera(): CampaignTerrainCamera {
  return currentCamera;
}

export function getCampaignTerrainMapCoupledCamera(): CampaignTerrainCamera {
  const tiltCos = Math.cos(getCampaignTerrainCameraTiltRadians(currentCamera));
  const safeTiltCos = Math.abs(tiltCos) < 0.0001 ? 1 : tiltCos;

  return {
    scale: currentCamera.scale,
    offsetX: currentCamera.offsetX,
    offsetY: currentCamera.offsetY / safeTiltCos,
  };
}

function getCampaignTerrainCameraTiltRadians(
  camera: CampaignTerrainCamera
): number {
  return getCampaignTerrainCameraTiltRadiansForScale(camera.scale);
}

export function getCampaignTerrainCameraTiltRadiansForScale(scale: number): number {
  const normalizedScale = clamp(
    (scale - CAMERA_TILT_TOP_DOWN_SCALE) /
      Math.max(CAMERA_TILT_CLOSE_SCALE - CAMERA_TILT_TOP_DOWN_SCALE, 0.0001),
    0,
    1
  );
  const curvedScale = easeOutCubic(normalizedScale);

  return (
    CAMERA_TILT_TOP_DOWN_RADIANS +
    (CAMERA_TILT_CLOSE_RADIANS - CAMERA_TILT_TOP_DOWN_RADIANS) * curvedScale
  );
}

export function getCampaignTerrainProjectionSignature(root: ParentNode): string {
  const terrainCanvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  const renderer =
    terrainCanvas == null ? null : activeRenderers.get(terrainCanvas) ?? null;

  return [
    renderer == null ? "pending" : "ready",
    currentCamera.scale.toFixed(4),
    currentCamera.offsetX.toFixed(1),
    currentCamera.offsetY.toFixed(1),
    terrainCanvas?.width ?? 0,
    terrainCanvas?.height ?? 0,
  ].join("|");
}

export function projectCampaignTerrainUvToClientPoint(
  root: ParentNode,
  u: number,
  v: number
): CampaignTerrainClientPoint | null {
  return projectCampaignTerrainUvToClientPointAtHeightAnchor(root, u, v, u, v);
}

export function projectCampaignTerrainUvToClientPointAtHeightAnchor(
  root: ParentNode,
  u: number,
  v: number,
  heightU: number,
  heightV: number
): CampaignTerrainClientPoint | null {
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

  const matrix = createTerrainMatrix(
    terrainCanvas.width / Math.max(terrainCanvas.height, 1)
  );
  const height = sampleHeightAt(
    renderer.projectionInput.heights,
    renderer.projectionInput.columns,
    renderer.projectionInput.rows,
    heightU,
    heightV
  );
  const screenPoint = projectPoint(matrix, createTerrainWorldPoint(u, v, height));
  const normalizedX = (screenPoint.x + 1) / 2;
  const normalizedY = (1 - screenPoint.y) / 2;
  const visible =
    screenPoint.w > 0 &&
    screenPoint.z >= -1 &&
    screenPoint.z <= 1 &&
    normalizedX >= 0 &&
    normalizedX <= 1 &&
    normalizedY >= 0 &&
    normalizedY <= 1;

  return {
    clientX: rect.left + normalizedX * rect.width,
    clientY: rect.top + normalizedY * rect.height,
    visible,
    w: screenPoint.w,
  };
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

export function isCampaignTerrainUvPassable(
  root: ParentNode,
  u: number,
  v: number
): boolean | null {
  const terrainCanvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  if (terrainCanvas == null) {
    return null;
  }

  const renderer = activeRenderers.get(terrainCanvas);
  if (renderer == null) {
    return null;
  }

  return isHexPassableAtUv(
    renderer.projectionInput.materialSemanticModel,
    u,
    v
  );
}

export function getCampaignTerrainTravelGrid(root: ParentNode): HexTravelGrid | null {
  const terrainCanvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  if (terrainCanvas == null) {
    return null;
  }

  return activeRenderers.get(terrainCanvas)?.travelGrid ?? null;
}

function readCampaignTerrainInput(canvas: HTMLCanvasElement): CampaignTerrainInput | null {
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
    return null;
  }

  return {
    canvas,
    textureUrl,
    heightUrl,
    materialUrl,
    grassTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapGrassTextureUrl ?? null : null,
    sandTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapSandTextureUrl ?? null : null,
    waterTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapWaterTextureUrl ?? null : null,
    renderMode,
  };
}

function getCampaignTerrainInputSignature(input: CampaignTerrainInput): string {
  return [
    input.renderMode,
    input.textureUrl,
    input.heightUrl,
    input.materialUrl,
    input.grassTextureUrl ?? "",
    input.sandTextureUrl ?? "",
    input.waterTextureUrl ?? "",
  ].join("|");
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
    const input = readCampaignTerrainInput(canvas);
    if (input == null) {
      continue;
    }
    const inputSignature = getCampaignTerrainInputSignature(input);
    const activeRenderer = activeRenderers.get(canvas);
    if (activeRenderer != null) {
      if (activeRenderer.inputSignature === inputSignature) {
        continue;
      }

      activeRenderer.dispose();
      activeRenderers.delete(canvas);
      canvas.classList.remove("is-ready", "has-error", "has-actor-model");
    }
    if (pendingRendererCanvases.has(canvas)) {
      continue;
    }

    pendingRendererCanvases.add(canvas);
    void initCampaignTerrainWebGl(input).then((renderer) => {
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
  const waterTextureImagePromise =
    renderTerrain && input.waterTextureUrl != null
      ? loadImage(input.waterTextureUrl).catch((error: unknown) => {
        console.error("Failed to load campaign water texture.", error);
        return null;
      })
      : Promise.resolve(null);
  const grassTextureImagePromise =
    renderTerrain && input.grassTextureUrl != null
      ? loadImage(input.grassTextureUrl).catch((error: unknown) => {
        console.error("Failed to load campaign grass texture.", error);
        return null;
      })
      : Promise.resolve(null);
  const sandTextureImagePromise =
    renderTerrain && input.sandTextureUrl != null
      ? loadImage(input.sandTextureUrl).catch((error: unknown) => {
        console.error("Failed to load campaign sand texture.", error);
        return null;
      })
      : Promise.resolve(null);
  const [
    textureImage,
    heightImage,
    materialImage,
    waterTextureImage,
    grassTextureImage,
    sandTextureImage,
    actorAsset,
    cityDepthAsset,
  ] = await Promise.all([
    loadImage(input.textureUrl),
    loadImage(input.heightUrl),
    loadImage(input.materialUrl),
    waterTextureImagePromise,
    grassTextureImagePromise,
    sandTextureImagePromise,
    actorAssetPromise,
    cityDepthAssetPromise,
  ]);
  const baseHeightSamples = sampleHeightImage(heightImage, GRID_COLUMNS, GRID_ROWS);
  const materialLandMask = sampleMaterialLandMask(materialImage);
  const materialSemanticModel = createCampaignMaterialSemanticModel(
    materialLandMask.landMask,
    materialLandMask.columns,
    materialLandMask.rows
  );
  const heightSamples = createSmoothTerrainHeightSamples(
    baseHeightSamples,
    GRID_COLUMNS,
    GRID_ROWS,
    materialLandMask.landMask,
    materialLandMask.columns,
    materialLandMask.rows
  );
  const mesh = renderTerrain
    ? createSmoothTerrainMesh(
      heightSamples,
      GRID_COLUMNS,
      GRID_ROWS,
      SMOOTH_TERRAIN_MESH_STEP
    )
    : null;
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  const actorProgram = createProgram(gl, actorVertexShaderSource, actorFragmentShaderSource);
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const uvLocation = gl.getAttribLocation(program, "aUv");
  const normalLocation = gl.getAttribLocation(program, "aNormal");
  const matrixLocation = gl.getUniformLocation(program, "uMatrix");
  const heightScaleLocation = gl.getUniformLocation(program, "uHeightScale");
  const terrainCameraTiltSinCosLocation = gl.getUniformLocation(
    program,
    "uTerrainCameraTiltSinCos"
  );
  const textureLocation = gl.getUniformLocation(program, "uTexture");
  const materialTextureLocation = gl.getUniformLocation(program, "uMaterialTexture");
  const materialSemanticTextureLocation = gl.getUniformLocation(
    program,
    "uMaterialSemanticTexture"
  );
  const materialSemanticTextureSizeLocation = gl.getUniformLocation(
    program,
    "uMaterialSemanticTextureSize"
  );
  const materialSemanticBoundsLocation = gl.getUniformLocation(
    program,
    "uMaterialSemanticBounds"
  );
  const shorelineChainTextureLocation = gl.getUniformLocation(
    program,
    "uShorelineChainTexture"
  );
  const shorelineChainTextureSizeLocation = gl.getUniformLocation(
    program,
    "uShorelineChainTextureSize"
  );
  const shorelineChainBoundsLocation = gl.getUniformLocation(
    program,
    "uShorelineChainBounds"
  );
  const shorelineChainMaxMileageLocation = gl.getUniformLocation(
    program,
    "uShorelineChainMaxMileage"
  );
  const waterTextureLocation = gl.getUniformLocation(program, "uWaterTexture");
  const grassTextureLocation = gl.getUniformLocation(program, "uGrassTexture");
  const sandTextureLocation = gl.getUniformLocation(program, "uSandTexture");
  const waterTextureEnabledLocation = gl.getUniformLocation(
    program,
    "uWaterTextureEnabled"
  );
  const timeSecondsLocation = gl.getUniformLocation(program, "uTimeSeconds");
  const grassAmbientLightLocation = gl.getUniformLocation(program, "uGrassAmbientLight");
  const grassTextureDetailLocation = gl.getUniformLocation(program, "uGrassTextureDetail");
  const hexMapAspectLocation = gl.getUniformLocation(program, "uHexMapAspect");
  const hexTerrainScaleLocation = gl.getUniformLocation(program, "uHexTerrainScale");
  const terrainGridLandOpacityLocation = gl.getUniformLocation(
    program,
    "uTerrainGridLandOpacity"
  );
  const terrainGridWaterOpacityLocation = gl.getUniformLocation(
    program,
    "uTerrainGridWaterOpacity"
  );
  const terrainDirectionalLightStrengthLocation = gl.getUniformLocation(
    program,
    "uTerrainDirectionalLightStrength"
  );
  const terrainBackShadowStrengthLocation = gl.getUniformLocation(
    program,
    "uTerrainBackShadowStrength"
  );
  const terrainSteepShadowStrengthLocation = gl.getUniformLocation(
    program,
    "uTerrainSteepShadowStrength"
  );
  const terrainWaterShadowStrengthLocation = gl.getUniformLocation(
    program,
    "uTerrainWaterShadowStrength"
  );
  const terrainViewportSizeLocation = gl.getUniformLocation(program, "uTerrainViewportSize");
  const terrainCameraLightHeightLocation = gl.getUniformLocation(
    program,
    "uTerrainCameraLightHeight"
  );
  const terrainCameraLightHorizontalPullLocation = gl.getUniformLocation(
    program,
    "uTerrainCameraLightHorizontalPull"
  );
  const landTextureColorAdjustLocation = gl.getUniformLocation(
    program,
    "uLandTextureColorAdjust"
  );
  const landTextureShadeRangeLocation = gl.getUniformLocation(
    program,
    "uLandTextureShadeRange"
  );
  const landTextureTilingLocation = gl.getUniformLocation(program, "uLandTextureTiling");
  const beachTextureTilingLocation = gl.getUniformLocation(program, "uBeachTextureTiling");
  const beachBlendStrengthLocation = gl.getUniformLocation(program, "uBeachBlendStrength");
  const beachInnerRadiusLocation = gl.getUniformLocation(program, "uBeachInnerRadius");
  const beachOuterRadiusLocation = gl.getUniformLocation(program, "uBeachOuterRadius");
  const beachFineNoiseTilingLocation = gl.getUniformLocation(
    program,
    "uBeachFineNoiseTiling"
  );
  const beachFineNoiseStrengthLocation = gl.getUniformLocation(
    program,
    "uBeachFineNoiseStrength"
  );
  const shorelineVisualWaterStrengthLocation = gl.getUniformLocation(
    program,
    "uShorelineVisualWaterStrength"
  );
  const shorelineEdgeWidthLocation = gl.getUniformLocation(program, "uShorelineEdgeWidth");
  const shorelineWaveStrengthLocation = gl.getUniformLocation(
    program,
    "uShorelineWaveStrength"
  );
  const shorelineWaveFrequencyLocation = gl.getUniformLocation(
    program,
    "uShorelineWaveFrequency"
  );
  const shorelineErosionStrengthLocation = gl.getUniformLocation(
    program,
    "uShorelineErosionStrength"
  );
  const shorelineErosionFrequencyLocation = gl.getUniformLocation(
    program,
    "uShorelineErosionFrequency"
  );
  const shorelineCornerRoundnessLocation = gl.getUniformLocation(
    program,
    "uShorelineCornerRoundness"
  );
  const actorPositionLocation = gl.getAttribLocation(actorProgram, "aPosition");
  const actorNormalLocation = gl.getAttribLocation(actorProgram, "aNormal");
  const actorUvLocation = gl.getAttribLocation(actorProgram, "aUv");
  const actorMatrixLocation = gl.getUniformLocation(actorProgram, "uMatrix");
  const actorLightLocation = gl.getUniformLocation(actorProgram, "uLight");
  const actorTextureLocation = gl.getUniformLocation(actorProgram, "uTexture");
  const actorTintLocation = gl.getUniformLocation(actorProgram, "uTint");
  const actorForceOpaqueAlphaLocation = gl.getUniformLocation(actorProgram, "uForceOpaqueAlpha");
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  const actorVertexBuffer = gl.createBuffer();
  const actorIndexBuffer = gl.createBuffer();
  const cityDepthVertexBuffer = gl.createBuffer();
  const cityDepthIndexBuffer = gl.createBuffer();
  const texture = createTexture(gl, textureImage);
  const materialTexture = createTexture(gl, materialImage);
  const materialSemanticTexture = createTexture(
    gl,
    materialSemanticModel.source,
    {
      minFilter: gl.NEAREST,
      magFilter: gl.NEAREST,
    }
  );
  const shorelineChainTextureModel = createShorelineChainTextureModel(materialSemanticModel);
  const shorelineChainTexture = createTexture(gl, shorelineChainTextureModel.source, {
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
  });
  const grassTexture = createTexture(gl, grassTextureImage ?? textureImage);
  const sandTexture = createTexture(gl, sandTextureImage ?? textureImage);
  const waterTexture =
    waterTextureImage == null
      ? null
      : createTexture(gl, waterTextureImage, {
        wrapS: gl.REPEAT,
        wrapT: gl.REPEAT,
      });
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
    normalLocation < 0 ? "aNormal" : null,
    matrixLocation == null ? "uMatrix" : null,
    heightScaleLocation == null ? "uHeightScale" : null,
    terrainCameraTiltSinCosLocation == null ? "uTerrainCameraTiltSinCos" : null,
    textureLocation == null ? "uTexture" : null,
    materialTextureLocation == null ? "uMaterialTexture" : null,
    materialSemanticTextureLocation == null ? "uMaterialSemanticTexture" : null,
    materialSemanticTextureSizeLocation == null ? "uMaterialSemanticTextureSize" : null,
    materialSemanticBoundsLocation == null ? "uMaterialSemanticBounds" : null,
    shorelineChainTextureLocation == null ? "uShorelineChainTexture" : null,
    shorelineChainTextureSizeLocation == null ? "uShorelineChainTextureSize" : null,
    shorelineChainBoundsLocation == null ? "uShorelineChainBounds" : null,
    shorelineChainMaxMileageLocation == null ? "uShorelineChainMaxMileage" : null,
    waterTextureLocation == null ? "uWaterTexture" : null,
    grassTextureLocation == null ? "uGrassTexture" : null,
    sandTextureLocation == null ? "uSandTexture" : null,
    waterTextureEnabledLocation == null ? "uWaterTextureEnabled" : null,
    timeSecondsLocation == null ? "uTimeSeconds" : null,
    grassAmbientLightLocation == null ? "uGrassAmbientLight" : null,
    grassTextureDetailLocation == null ? "uGrassTextureDetail" : null,
    hexMapAspectLocation == null ? "uHexMapAspect" : null,
    hexTerrainScaleLocation == null ? "uHexTerrainScale" : null,
    terrainGridLandOpacityLocation == null ? "uTerrainGridLandOpacity" : null,
    terrainGridWaterOpacityLocation == null ? "uTerrainGridWaterOpacity" : null,
    terrainDirectionalLightStrengthLocation == null ? "uTerrainDirectionalLightStrength" : null,
    terrainBackShadowStrengthLocation == null ? "uTerrainBackShadowStrength" : null,
    terrainSteepShadowStrengthLocation == null ? "uTerrainSteepShadowStrength" : null,
    terrainWaterShadowStrengthLocation == null ? "uTerrainWaterShadowStrength" : null,
    terrainViewportSizeLocation == null ? "uTerrainViewportSize" : null,
    terrainCameraLightHeightLocation == null ? "uTerrainCameraLightHeight" : null,
    terrainCameraLightHorizontalPullLocation == null
      ? "uTerrainCameraLightHorizontalPull"
      : null,
    landTextureColorAdjustLocation == null ? "uLandTextureColorAdjust" : null,
    landTextureShadeRangeLocation == null ? "uLandTextureShadeRange" : null,
    landTextureTilingLocation == null ? "uLandTextureTiling" : null,
    beachTextureTilingLocation == null ? "uBeachTextureTiling" : null,
    beachBlendStrengthLocation == null ? "uBeachBlendStrength" : null,
    beachInnerRadiusLocation == null ? "uBeachInnerRadius" : null,
    beachOuterRadiusLocation == null ? "uBeachOuterRadius" : null,
    beachFineNoiseTilingLocation == null ? "uBeachFineNoiseTiling" : null,
    beachFineNoiseStrengthLocation == null ? "uBeachFineNoiseStrength" : null,
    shorelineVisualWaterStrengthLocation == null ? "uShorelineVisualWaterStrength" : null,
    shorelineEdgeWidthLocation == null ? "uShorelineEdgeWidth" : null,
    shorelineWaveStrengthLocation == null ? "uShorelineWaveStrength" : null,
    shorelineWaveFrequencyLocation == null ? "uShorelineWaveFrequency" : null,
    shorelineErosionStrengthLocation == null ? "uShorelineErosionStrength" : null,
    shorelineErosionFrequencyLocation == null ? "uShorelineErosionFrequency" : null,
    shorelineCornerRoundnessLocation == null ? "uShorelineCornerRoundness" : null,
    actorPositionLocation < 0 ? "actor.aPosition" : null,
    actorNormalLocation < 0 ? "actor.aNormal" : null,
    actorUvLocation < 0 ? "actor.aUv" : null,
    actorMatrixLocation == null ? "actor.uMatrix" : null,
    actorLightLocation == null ? "actor.uLight" : null,
    actorTextureLocation == null ? "actor.uTexture" : null,
    actorTintLocation == null ? "actor.uTint" : null,
    actorForceOpaqueAlphaLocation == null ? "actor.uForceOpaqueAlpha" : null,
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
  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  const projectionInput: CampaignTerrainProjectionInput = {
    canvas: input.canvas,
    heights: heightSamples,
    materialSemanticModel,
    columns: GRID_COLUMNS,
    rows: GRID_ROWS,
  };
  const travelGrid = createHexTravelGrid(materialSemanticModel);

  let frameId: number | null = null;
  let isDisposed = false;
  let hasPendingRender = false;
  let projectedPointsNeedSync = true;
  let lastActorSignature = "";
  let lastCityDepthMeshSignature = "";
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;
  const actorAnimationState = createActorAnimationPlaybackState();
  const animatesTerrainWater = renderTerrain && waterTexture != null;
  const animatesActorModel = shouldRenderActorInThisCanvas && actorAsset != null && actorTexture != null;
  let dynamicAnimationTimeoutId: number | null = null;
  const render = () => {
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
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, waterTexture ?? texture);
      gl.uniform1i(waterTextureLocation, 2);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, grassTexture);
      gl.uniform1i(grassTextureLocation, 3);
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, sandTexture);
      gl.uniform1i(sandTextureLocation, 4);
      gl.activeTexture(gl.TEXTURE5);
      gl.bindTexture(gl.TEXTURE_2D, shorelineChainTexture);
      gl.uniform1i(shorelineChainTextureLocation, 5);
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D, materialSemanticTexture);
      gl.uniform1i(materialSemanticTextureLocation, 6);
      gl.uniform2f(
        materialSemanticTextureSizeLocation,
        materialSemanticModel.textureColumns,
        materialSemanticModel.textureRows
      );
      gl.uniform4f(
        materialSemanticBoundsLocation,
        materialSemanticModel.minCellX,
        materialSemanticModel.minCellY,
        materialSemanticModel.cellColumns,
        materialSemanticModel.cellRows
      );
      gl.uniform1f(waterTextureEnabledLocation, waterTexture == null ? 0 : 1);
      gl.uniform1f(timeSecondsLocation, performance.now() * 0.001);
      gl.uniform1f(heightScaleLocation, HEIGHT_SCALE);
      const terrainCameraTilt = getCampaignTerrainCameraTiltRadians(currentCamera);
      gl.uniform2f(
        terrainCameraTiltSinCosLocation,
        Math.sin(terrainCameraTilt),
        Math.cos(terrainCameraTilt)
      );
      gl.uniform1f(grassAmbientLightLocation, GRASS_AMBIENT_LIGHT);
      gl.uniform1f(grassTextureDetailLocation, GRASS_TEXTURE_DETAIL);
      gl.uniform1f(hexMapAspectLocation, HEX_MAP_ASPECT);
      gl.uniform1f(hexTerrainScaleLocation, HEX_TERRAIN_SCALE);
      gl.uniform1f(terrainGridLandOpacityLocation, TERRAIN_GRID_LAND_OPACITY);
      gl.uniform1f(terrainGridWaterOpacityLocation, TERRAIN_GRID_WATER_OPACITY);
      gl.uniform1f(
        terrainDirectionalLightStrengthLocation,
        TERRAIN_DIRECTIONAL_LIGHT_STRENGTH
      );
      gl.uniform1f(terrainBackShadowStrengthLocation, TERRAIN_BACK_SHADOW_STRENGTH);
      gl.uniform1f(terrainSteepShadowStrengthLocation, TERRAIN_STEEP_SHADOW_STRENGTH);
      gl.uniform1f(terrainWaterShadowStrengthLocation, TERRAIN_WATER_SHADOW_STRENGTH);
      const terrainMatrix = createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1));
      gl.uniform2f(
        terrainViewportSizeLocation,
        input.canvas.width,
        input.canvas.height
      );
      gl.uniform1f(terrainCameraLightHeightLocation, TERRAIN_CAMERA_LIGHT_HEIGHT);
      gl.uniform1f(
        terrainCameraLightHorizontalPullLocation,
        TERRAIN_CAMERA_LIGHT_HORIZONTAL_PULL
      );
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
      gl.uniform1f(landTextureTilingLocation, TERRAIN_LAND_TEXTURE_TILING);
      gl.uniform1f(beachTextureTilingLocation, terrainBeachTuning.textureTiling);
      gl.uniform1f(beachBlendStrengthLocation, terrainBeachTuning.blendStrength);
      gl.uniform1f(beachInnerRadiusLocation, terrainBeachTuning.innerRadius);
      gl.uniform1f(beachOuterRadiusLocation, terrainBeachTuning.outerRadius);
      gl.uniform1f(beachFineNoiseTilingLocation, terrainBeachTuning.fineNoiseTiling);
      gl.uniform1f(beachFineNoiseStrengthLocation, terrainBeachTuning.fineNoiseStrength);
      gl.uniform1f(
        shorelineVisualWaterStrengthLocation,
        terrainBeachTuning.shorelineVisualWaterStrength
      );
      gl.uniform1f(shorelineEdgeWidthLocation, terrainBeachTuning.shorelineEdgeWidth);
      gl.uniform1f(shorelineWaveStrengthLocation, terrainBeachTuning.shorelineWaveStrength);
      gl.uniform1f(shorelineWaveFrequencyLocation, terrainBeachTuning.shorelineWaveFrequency);
      gl.uniform1f(
        shorelineErosionStrengthLocation,
        terrainBeachTuning.shorelineErosionStrength
      );
      gl.uniform1f(
        shorelineErosionFrequencyLocation,
        terrainBeachTuning.shorelineErosionFrequency
      );
      gl.uniform1f(shorelineCornerRoundnessLocation, terrainBeachTuning.shorelineCornerRoundness);
      gl.uniform2f(
        shorelineChainTextureSizeLocation,
        shorelineChainTextureModel.textureColumns,
        shorelineChainTextureModel.textureRows
      );
      gl.uniform4f(
        shorelineChainBoundsLocation,
        shorelineChainTextureModel.minCellX,
        shorelineChainTextureModel.minCellY,
        shorelineChainTextureModel.cellColumns,
        shorelineChainTextureModel.cellRows
      );
      gl.uniform1f(shorelineChainMaxMileageLocation, shorelineChainTextureModel.maxMileage);
      gl.uniformMatrix4fv(
        matrixLocation,
        false,
        terrainMatrix
      );

      const stride = 8 * Float32Array.BYTES_PER_ELEMENT;
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
      gl.enableVertexAttribArray(normalLocation);
      gl.vertexAttribPointer(
        normalLocation,
        3,
        gl.FLOAT,
        false,
        stride,
        5 * Float32Array.BYTES_PER_ELEMENT
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
      gl.uniform1f(actorForceOpaqueAlphaLocation, 0);
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
        actorAsset.animations,
        actorAnimationState
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
      gl.uniform1f(actorForceOpaqueAlphaLocation, 1);
      gl.disable(gl.CULL_FACE);
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

    if (animatesTerrainWater || animatesActorModel) {
      scheduleDynamicAnimationRender();
    }
  };

  const scheduleDynamicAnimationRender = () => {
    if (isDisposed || dynamicAnimationTimeoutId != null || hasPendingRender) {
      return;
    }

    dynamicAnimationTimeoutId = window.setTimeout(() => {
      dynamicAnimationTimeoutId = null;
      requestRender("dynamic");
    }, WATER_ANIMATION_FRAME_INTERVAL_MS);
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
    inputSignature: getCampaignTerrainInputSignature(input),
    projectionInput,
    travelGrid,
    dispose: () => {
      isDisposed = true;
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
      if (dynamicAnimationTimeoutId != null) {
        window.clearTimeout(dynamicAnimationTimeoutId);
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
      gl.deleteTexture(materialSemanticTexture);
      gl.deleteTexture(shorelineChainTexture);
      gl.deleteTexture(grassTexture);
      gl.deleteTexture(sandTexture);
      if (waterTexture != null) {
        gl.deleteTexture(waterTexture);
      }
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
      facingOffsetDegrees?: number;
      posturePitchDegrees?: number;
      positions: number[];
      normals: number[];
      uvs: number[];
      boneIndices: number[];
      boneInfluenceIndices?: number[];
      boneInfluenceWeights?: number[];
      inverseBindMatrices?: number[];
      indices: number[];
      origin: [number, number, number];
      bones: Array<{
        name: string;
        parentIndex: number | null;
        localPosition: [number, number, number];
        localRotation?: [number, number, number, number];
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
    localRotation: normalizeQuaternion(bone.localRotation ?? [0, 0, 0, 1]),
  }));
  const vertexBoneIndices = new Uint16Array(model.boneIndices);
  const vertexCount = model.positions.length / 3;
  const vertexBoneInfluenceIndices =
    model.boneInfluenceIndices != null &&
      model.boneInfluenceIndices.length === vertexCount * 4
      ? new Uint16Array(model.boneInfluenceIndices)
      : createSingleInfluenceIndices(vertexBoneIndices);
  const vertexBoneInfluenceWeights =
    model.boneInfluenceWeights != null &&
      model.boneInfluenceWeights.length === vertexCount * 4
      ? new Float32Array(model.boneInfluenceWeights)
      : createSingleInfluenceWeights(vertexCount);
  const originOffset: [number, number, number] = [
    -(model.origin[0] ?? 0),
    -(model.origin[1] ?? 0),
    -(model.origin[2] ?? 0),
  ];
  const inverseBindMatrices =
    model.inverseBindMatrices != null &&
      model.inverseBindMatrices.length === bones.length * 16
      ? new Float32Array(model.inverseBindMatrices)
      : createFallbackInverseBindMatrices(computeActorGlobalBonePose(bones, originOffset));

  return {
    model: {
      scale: model.scale ?? 1,
      facingOffsetDegrees: model.facingOffsetDegrees ?? 90,
      posturePitchDegrees: model.posturePitchDegrees ?? 0,
      positions: new Float32Array(model.positions),
      normals: new Float32Array(model.normals),
      uvs: new Float32Array(model.uvs),
      vertexBoneIndices,
      vertexBoneInfluenceIndices,
      vertexBoneInfluenceWeights,
      inverseBindMatrices,
      indices: new Uint16Array(model.indices),
      bones,
      originOffset,
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

function sampleMaterialLandMask(
  image: HTMLImageElement
): { landMask: Uint8Array; columns: number; rows: number } {
  const columns = Math.max(image.naturalWidth || image.width, 1);
  const rows = Math.max(image.naturalHeight || image.height, 1);
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (context == null) {
    throw new Error("Failed to create material sampling context.");
  }

  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0, columns, rows);
  const data = context.getImageData(0, 0, columns, rows).data;
  const landMask = new Uint8Array(columns * rows);

  for (let index = 0; index < landMask.length; index += 1) {
    const pixelOffset = index * 4;
    const red = data[pixelOffset] ?? 0;
    const green = data[pixelOffset + 1] ?? red;
    const blue = data[pixelOffset + 2] ?? red;
    landMask[index] = isWaterMaterialColor(red, green, blue) ? 0 : 1;
  }

  return {
    landMask,
    columns,
    rows,
  };
}

function createCampaignMaterialSemanticModel(
  materialLandMask: Uint8Array,
  columns: number,
  rows: number
): CampaignMaterialSemanticModel {
  const cells = getTerrainHexCells();
  const minCellX = cells.length > 0 ? Math.min(...cells.map((cell) => cell.x)) : 0;
  const maxCellX = cells.length > 0 ? Math.max(...cells.map((cell) => cell.x)) : 0;
  const minCellY = cells.length > 0 ? Math.min(...cells.map((cell) => cell.y)) : 0;
  const maxCellY = cells.length > 0 ? Math.max(...cells.map((cell) => cell.y)) : 0;
  const cellColumns = Math.max(maxCellX - minCellX + 1, 1);
  const cellRows = Math.max(maxCellY - minCellY + 1, 1);
  const textureColumns = cellColumns;
  const textureRows = cellRows;
  const pixels = new Uint8ClampedArray(textureColumns * textureRows * 4);
  const landByCellKey = new Map<string, boolean>();

  for (const cell of cells) {
    const isLand = isHexPassableAtHexPoint(
      materialLandMask,
      columns,
      rows,
      hexToPixel(cell.x, cell.y)
    );
    const pixelX = cell.x - minCellX;
    const pixelY = cell.y - minCellY;
    const pixelOffset = (pixelY * textureColumns + pixelX) * 4;
    const value = isLand ? 255 : 0;

    landByCellKey.set(getHexCellKey(cell.x, cell.y), isLand);
    pixels[pixelOffset] = value;
    pixels[pixelOffset + 1] = value;
    pixels[pixelOffset + 2] = value;
    pixels[pixelOffset + 3] = 255;
  }

  return {
    source: new ImageData(pixels, textureColumns, textureRows),
    textureColumns,
    textureRows,
    minCellX,
    minCellY,
    cellColumns,
    cellRows,
    cells,
    landByCellKey,
  };
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
    if (
      point.classList.contains("c-campaign-marker") ||
      point.classList.contains("c-campaign-player")
    ) {
      point.style.zIndex = "2";
    } else if (point.classList.contains("c-campaign-marker__summary")) {
      point.style.zIndex = "6";
    } else {
      point.style.zIndex = `${20 + depthLayer}`;
    }
  }
}

function sampleHeightAt(
  heights: Float32Array,
  columns: number,
  rows: number,
  u: number,
  v: number
): number {
  const sampleX = clamp(u, 0, 1) * Math.max(columns - 1, 0);
  const sampleY = clamp(v, 0, 1) * Math.max(rows - 1, 0);
  const leftX = Math.floor(sampleX);
  const topY = Math.floor(sampleY);
  const rightX = Math.min(leftX + 1, Math.max(columns - 1, 0));
  const bottomY = Math.min(topY + 1, Math.max(rows - 1, 0));
  const mixX = sampleX - leftX;
  const mixY = sampleY - topY;
  const topLeft = heights[topY * columns + leftX] ?? 0;
  const topRight = heights[topY * columns + rightX] ?? topLeft;
  const bottomLeft = heights[bottomY * columns + leftX] ?? topLeft;
  const bottomRight = heights[bottomY * columns + rightX] ?? bottomLeft;
  const top = topLeft + (topRight - topLeft) * mixX;
  const bottom = bottomLeft + (bottomRight - bottomLeft) * mixX;

  return top + (bottom - top) * mixY;
}

function sampleLandMaskAt(
  materialLandMask: Uint8Array,
  columns: number,
  rows: number,
  u: number,
  v: number
): number {
  if (u < 0 || u > 1 || v < 0 || v > 1) {
    return 0;
  }

  const x = Math.min(Math.max(Math.round(u * (columns - 1)), 0), columns - 1);
  const y = Math.min(Math.max(Math.round(v * (rows - 1)), 0), rows - 1);

  return materialLandMask[y * columns + x] ?? 0;
}

function createShorelineChainTextureModel(
  materialSemanticModel: CampaignMaterialSemanticModel
): ShorelineChainTextureModel {
  const cells = materialSemanticModel.cells;
  const minCellX = materialSemanticModel.minCellX;
  const minCellY = materialSemanticModel.minCellY;
  const cellColumns = materialSemanticModel.cellColumns;
  const cellRows = materialSemanticModel.cellRows;
  const directionsPerCell = SHORELINE_CHAIN_DIRECTIONS.length;
  const textureColumns = Math.max(cellColumns * directionsPerCell, 1);
  const textureRows = cellRows;
  const pixels = new Uint8ClampedArray(textureColumns * textureRows * 4);
  const cellKeys = new Set(cells.map((cell) => getHexCellKey(cell.x, cell.y)));
  const landByCellKey = materialSemanticModel.landByCellKey;

  const edges: ShorelineChainEdge[] = [];
  const endpointToEdgeIds = new Map<string, number[]>();

  for (const landCell of cells) {
    if (landByCellKey.get(getHexCellKey(landCell.x, landCell.y)) !== true) {
      continue;
    }

    SHORELINE_CHAIN_DIRECTIONS.forEach((direction, landDirectionIndex) => {
      const waterCell = {
        x: landCell.x + direction.x,
        y: landCell.y + direction.y,
      };
      const waterCellKey = getHexCellKey(waterCell.x, waterCell.y);
      if (!cellKeys.has(waterCellKey) || landByCellKey.get(waterCellKey) !== false) {
        return;
      }

      const landCenter = hexToPixel(landCell.x, landCell.y);
      const waterCenter = hexToPixel(waterCell.x, waterCell.y);
      const normalToWater = normalizeVector2({
        x: waterCenter.x - landCenter.x,
        y: waterCenter.y - landCenter.y,
      });
      const tangent = { x: -normalToWater.y, y: normalToWater.x };
      const edgeCenter = {
        x: (landCenter.x + waterCenter.x) * 0.5,
        y: (landCenter.y + waterCenter.y) * 0.5,
      };
      const start = {
        x: edgeCenter.x - tangent.x * 0.5,
        y: edgeCenter.y - tangent.y * 0.5,
      };
      const end = {
        x: edgeCenter.x + tangent.x * 0.5,
        y: edgeCenter.y + tangent.y * 0.5,
      };
      const edge: ShorelineChainEdge = {
        id: edges.length,
        landCell,
        waterCell,
        landDirectionIndex,
        waterDirectionIndex:
          SHORELINE_CHAIN_OPPOSITE_DIRECTION_INDEXES[landDirectionIndex] ?? 0,
        start,
        end,
        startKey: getShorelineEndpointKey(start),
        endKey: getShorelineEndpointKey(end),
        chainStartMileage: 0,
        chainLength: 1,
        chainSeed: 1,
        reverseInChain: false,
      };
      edges.push(edge);
      addShorelineEndpointEdge(endpointToEdgeIds, edge.startKey, edge.id);
      addShorelineEndpointEdge(endpointToEdgeIds, edge.endKey, edge.id);
    });
  }

  const maxMileage = Math.max(
    assignShorelineChainMetadata(edges, endpointToEdgeIds),
    1
  );

  for (const edge of edges) {
    writeShorelineChainEdgeMetadata(
      pixels,
      textureColumns,
      minCellX,
      minCellY,
      edge.landCell,
      edge.landDirectionIndex,
      edge,
      maxMileage
    );
    writeShorelineChainEdgeMetadata(
      pixels,
      textureColumns,
      minCellX,
      minCellY,
      edge.waterCell,
      edge.waterDirectionIndex,
      edge,
      maxMileage
    );
  }

  return {
    source: new ImageData(pixels, textureColumns, textureRows),
    textureColumns,
    textureRows,
    minCellX,
    minCellY,
    cellColumns,
    cellRows,
    maxMileage,
  };
}

function assignShorelineChainMetadata(
  edges: ShorelineChainEdge[],
  endpointToEdgeIds: Map<string, number[]>
): number {
  const usedEdgeIds = new Set<number>();
  let maxMileage = 0;
  let chainIndex = 0;

  while (usedEdgeIds.size < edges.length) {
    const startEdge = findShorelineChainStartEdge(edges, endpointToEdgeIds, usedEdgeIds);
    if (startEdge == null) {
      break;
    }

    const chainSeed = createShorelineChainSeedByte(startEdge, chainIndex);
    const chainEdgeIds: number[] = [];
    const chainStartKey = startEdge.startKey;
    let currentEdge: ShorelineChainEdge | null = startEdge;
    let currentEndpointKey = startEdge.startKey;
    let previousDirection: { x: number; y: number } | null = null;
    let chainMileage = 0;

    while (currentEdge != null && !usedEdgeIds.has(currentEdge.id)) {
      const entersAtStart = currentEdge.startKey === currentEndpointKey;
      const entersAtEnd = currentEdge.endKey === currentEndpointKey;
      if (!entersAtStart && !entersAtEnd) {
        break;
      }

      const from = entersAtStart ? currentEdge.start : currentEdge.end;
      const to = entersAtStart ? currentEdge.end : currentEdge.start;
      const direction = normalizeVector2({
        x: to.x - from.x,
        y: to.y - from.y,
      });

      currentEdge.chainStartMileage = chainMileage;
      currentEdge.chainSeed = chainSeed;
      currentEdge.reverseInChain = !entersAtStart;
      usedEdgeIds.add(currentEdge.id);
      chainEdgeIds.push(currentEdge.id);

      chainMileage += getDistance(from, to);
      currentEndpointKey = entersAtStart ? currentEdge.endKey : currentEdge.startKey;
      previousDirection = direction;

      if (currentEndpointKey === chainStartKey && chainEdgeIds.length > 1) {
        break;
      }

      currentEdge = findNextShorelineChainEdge(
        edges,
        endpointToEdgeIds,
        usedEdgeIds,
        currentEndpointKey,
        previousDirection
      )?.edge ?? null;
    }

    for (const edgeId of chainEdgeIds) {
      const edge = edges[edgeId];
      if (edge != null) {
        edge.chainLength = Math.max(chainMileage, 1);
      }
    }

    maxMileage = Math.max(maxMileage, chainMileage);
    chainIndex += 1;
  }

  return maxMileage;
}

function findShorelineChainStartEdge(
  edges: ShorelineChainEdge[],
  endpointToEdgeIds: Map<string, number[]>,
  usedEdgeIds: Set<number>
): ShorelineChainEdge | null {
  return (
    edges.find((edge) => {
      if (usedEdgeIds.has(edge.id)) {
        return false;
      }
      return countUnusedShorelineIncidentEdgesAt(
        edges,
        endpointToEdgeIds,
        usedEdgeIds,
        edge.startKey
      ) <= 1;
    }) ??
    edges.find((edge) => !usedEdgeIds.has(edge.id)) ??
    null
  );
}

function findNextShorelineChainEdge(
  edges: ShorelineChainEdge[],
  endpointToEdgeIds: Map<string, number[]>,
  usedEdgeIds: Set<number>,
  currentEndpointKey: string,
  previousDirection: { x: number; y: number } | null
): {
  edge: ShorelineChainEdge;
  entersAtStart: boolean;
  direction: { x: number; y: number };
} | null {
  const incidentEdgeIds = endpointToEdgeIds.get(currentEndpointKey) ?? [];
  const candidateIds = incidentEdgeIds.filter((edgeId) => {
    const edge = edges[edgeId];
    return edge != null && !usedEdgeIds.has(edge.id);
  });

  let best:
    | {
      edge: ShorelineChainEdge;
      entersAtStart: boolean;
      direction: { x: number; y: number };
      score: number;
    }
    | null = null;

  for (const edgeId of candidateIds) {
    const edge = edges[edgeId];
    if (edge == null) {
      continue;
    }

    const entersAtStart = edge.startKey === currentEndpointKey;
    const entersAtEnd = edge.endKey === currentEndpointKey;
    if (!entersAtStart && !entersAtEnd) {
      continue;
    }

    const from = entersAtStart ? edge.start : edge.end;
    const to = entersAtStart ? edge.end : edge.start;
    const direction = normalizeVector2({
      x: to.x - from.x,
      y: to.y - from.y,
    });
    const score =
      previousDirection == null
        ? 0
        : direction.x * previousDirection.x + direction.y * previousDirection.y;

    if (best == null || score > best.score) {
      best = {
        edge,
        entersAtStart,
        direction,
        score,
      };
    }
  }

  return best == null
    ? null
    : {
      edge: best.edge,
      entersAtStart: best.entersAtStart,
      direction: best.direction,
    };
}

function countUnusedShorelineIncidentEdgesAt(
  edges: ShorelineChainEdge[],
  endpointToEdgeIds: Map<string, number[]>,
  usedEdgeIds: Set<number>,
  endpointKey: string
): number {
  let count = 0;
  for (const edgeId of endpointToEdgeIds.get(endpointKey) ?? []) {
    const edge = edges[edgeId];
    if (edge != null && !usedEdgeIds.has(edge.id)) {
      count += 1;
    }
  }

  return count;
}

function addShorelineEndpointEdge(
  endpointToEdgeIds: Map<string, number[]>,
  endpointKey: string,
  edgeId: number
): void {
  const edgeIds = endpointToEdgeIds.get(endpointKey) ?? [];
  edgeIds.push(edgeId);
  endpointToEdgeIds.set(endpointKey, edgeIds);
}

function writeShorelineChainEdgeMetadata(
  pixels: Uint8ClampedArray,
  textureColumns: number,
  minCellX: number,
  minCellY: number,
  cell: GridCoordinate,
  directionIndex: number,
  edge: ShorelineChainEdge,
  maxMileage: number
): void {
  const pixelX = (cell.x - minCellX) * SHORELINE_CHAIN_DIRECTIONS.length + directionIndex;
  const pixelY = cell.y - minCellY;
  const offset = (pixelY * textureColumns + pixelX) * 4;
  if (pixelX < 0 || pixelX >= textureColumns || offset < 0 || offset + 3 >= pixels.length) {
    return;
  }

  const packedMileage = packNormalizedUint16(edge.chainStartMileage / maxMileage);
  const encodedSeedAndDirection = (edge.reverseInChain ? 128 : 0) + edge.chainSeed;
  pixels[offset] = packedMileage.high;
  pixels[offset + 1] = packedMileage.low;
  pixels[offset + 2] = Math.round(clamp(edge.chainLength / maxMileage, 0, 1) * 255);
  pixels[offset + 3] = encodedSeedAndDirection;
}

function packNormalizedUint16(value: number): { high: number; low: number } {
  const integer = Math.round(clamp(value, 0, 1) * 65535);

  return {
    high: Math.floor(integer / 256),
    low: integer % 256,
  };
}

function createShorelineChainSeedByte(edge: ShorelineChainEdge, chainIndex: number): number {
  const hash =
    Math.imul(edge.landCell.x, 73856093) ^
    Math.imul(edge.landCell.y, 19349663) ^
    Math.imul(edge.waterCell.x, 83492791) ^
    Math.imul(edge.waterCell.y, 2654435761) ^
    Math.imul(chainIndex + 1, 374761393);

  return Math.abs(hash % 127) + 1;
}

function getShorelineEndpointKey(point: { x: number; y: number }): string {
  return `${Math.round(point.x * 10000)},${Math.round(point.y * 10000)}`;
}

function normalizeVector2(input: { x: number; y: number }): { x: number; y: number } {
  const length = Math.hypot(input.x, input.y) || 1;

  return {
    x: input.x / length,
    y: input.y / length,
  };
}

function getDistance(
  left: { x: number; y: number },
  right: { x: number; y: number }
): number {
  return Math.hypot(right.x - left.x, right.y - left.y);
}

function isWaterHeightColor(red: number, green: number, blue: number): boolean {
  return blue > 72 && blue > red * 1.35 && blue > green * 1.18;
}

function isWaterMaterialColor(red: number, green: number, blue: number): boolean {
  return red >= 56 && green < 31 && blue < 31;
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
  animations: ActorAnimationSetAsset,
  animationState: ActorAnimationPlaybackState
): ActorMeshData {
  const scaleCompensation = clamp(
    ACTOR_REFERENCE_CAMERA_SCALE / Math.max(currentCamera.scale, 0.0001),
    0.18,
    1.6
  );
  const angle =
    actor.facingDegrees * Math.PI / 180 +
    (Number.isFinite(model.facingOffsetDegrees)
      ? model.facingOffsetDegrees * Math.PI / 180
      : ACTOR_MODEL_FACING_OFFSET_RADIANS);
  const timeMs = performance.now();
  const sampledPose = sampleActorAnimationSetPose(
    animations,
    model.bones,
    model.originOffset,
    actor.isMoving ? "walk" : "idle",
    animationState,
    timeMs
  );
  const center = createTerrainWorldPoint(
    actor.u,
    actor.v,
    height
  );
  const scale = ACTOR_MODEL_BASE_SCALE * model.scale * scaleCompensation;
  const positions = model.positions;
  const normals = model.normals;
  const vertexBoneInfluenceIndices = model.vertexBoneInfluenceIndices;
  const vertexBoneInfluenceWeights = model.vertexBoneInfluenceWeights;
  const poseMatrices = createActorPoseMatrices(sampledPose);
  const skinMatrices = poseMatrices.map((poseMatrix, boneIndex) =>
    multiplyMatrices(poseMatrix, readPackedMatrix4(model.inverseBindMatrices, boneIndex))
  );
  const uvs = model.uvs;
  const vertexCount = model.vertexBoneIndices.length;
  const output = new Float32Array(vertexCount * 8);
  const facingCos = Math.cos(angle);
  const facingSin = Math.sin(angle);
  const posturePitchRadians = model.posturePitchDegrees * Math.PI / 180;
  for (let vertexIndex = 0; vertexIndex < vertexCount; vertexIndex += 1) {
    const positionOffset = vertexIndex * 3;
    const uvOffset = vertexIndex * 2;
    const outputOffset = vertexIndex * 8;
    const sourcePosition: [number, number, number] = [
      positions[positionOffset] ?? 0,
      positions[positionOffset + 1] ?? 0,
      positions[positionOffset + 2] ?? 0,
    ];
    const sourceNormal: [number, number, number] = [
      normals[positionOffset] ?? 0,
      normals[positionOffset + 1] ?? 0,
      normals[positionOffset + 2] ?? 1,
    ];
    const animatedActorPosition: [number, number, number] = [0, 0, 0];
    const animatedActorNormal: [number, number, number] = [0, 0, 0];
    for (let influenceIndex = 0; influenceIndex < 4; influenceIndex += 1) {
      const packedInfluenceIndex = vertexIndex * 4 + influenceIndex;
      const influenceWeight = vertexBoneInfluenceWeights[packedInfluenceIndex] ?? 0;
      if (influenceWeight <= 0.00001) {
        continue;
      }

      const boneIndex = vertexBoneInfluenceIndices[packedInfluenceIndex] ?? 0;
      const skinMatrix = skinMatrices[boneIndex] ?? IDENTITY_MATRIX_4;
      const animatedLocalPosition = transformPointByMatrix(skinMatrix, sourcePosition);
      const animatedLocalNormal = transformDirectionByMatrix(skinMatrix, sourceNormal);
      animatedActorPosition[0] += animatedLocalPosition[0] * influenceWeight;
      animatedActorPosition[1] += animatedLocalPosition[1] * influenceWeight;
      animatedActorPosition[2] += animatedLocalPosition[2] * influenceWeight;
      animatedActorNormal[0] += animatedLocalNormal[0] * influenceWeight;
      animatedActorNormal[1] += animatedLocalNormal[1] * influenceWeight;
      animatedActorNormal[2] += animatedLocalNormal[2] * influenceWeight;
    }
    animatedActorPosition[0] *= scale;
    animatedActorPosition[1] *= scale;
    animatedActorPosition[2] *= scale;
    const posturedPosition = rotateVectorAroundX(animatedActorPosition, posturePitchRadians);
    const rotatedX =
      posturedPosition[0] * facingCos - posturedPosition[1] * facingSin;
    const rotatedY =
      posturedPosition[0] * facingSin + posturedPosition[1] * facingCos;
    const blendedNormal = normalizeVector3(
      rotateVectorAroundX(animatedActorNormal, posturePitchRadians)
    );
    const rotatedNormalX =
      blendedNormal[0] * facingCos - blendedNormal[1] * facingSin;
    const rotatedNormalY =
      blendedNormal[0] * facingSin + blendedNormal[1] * facingCos;

    output[outputOffset] = center[0] + rotatedX;
    output[outputOffset + 1] = center[1] + rotatedY;
    output[outputOffset + 2] = center[2] + posturedPosition[2];
    output[outputOffset + 3] = rotatedNormalX;
    output[outputOffset + 4] = rotatedNormalY;
    output[outputOffset + 5] = blendedNormal[2];
    output[outputOffset + 6] = uvs[uvOffset] ?? 0;
    output[outputOffset + 7] = uvs[uvOffset + 1] ?? 0;
  }

  return {
    vertices: output,
    indices: model.indices,
  };
}

function createSingleInfluenceIndices(vertexBoneIndices: Uint16Array): Uint16Array {
  const influenceIndices = new Uint16Array(vertexBoneIndices.length * 4);
  for (let vertexIndex = 0; vertexIndex < vertexBoneIndices.length; vertexIndex += 1) {
    influenceIndices[vertexIndex * 4] = vertexBoneIndices[vertexIndex] ?? 0;
  }
  return influenceIndices;
}

function createSingleInfluenceWeights(vertexCount: number): Float32Array {
  const influenceWeights = new Float32Array(vertexCount * 4);
  for (let vertexIndex = 0; vertexIndex < vertexCount; vertexIndex += 1) {
    influenceWeights[vertexIndex * 4] = 1;
  }
  return influenceWeights;
}

function createFallbackInverseBindMatrices(bindPose: ActorAnimationPose): Float32Array {
  const inverseBindMatrices = new Float32Array(bindPose.globalPositions.length * 16);
  for (let boneIndex = 0; boneIndex < bindPose.globalPositions.length; boneIndex += 1) {
    const bindMatrix = createTransformMatrixFromQuaternion(
      bindPose.globalPositions[boneIndex] ?? [0, 0, 0],
      bindPose.globalRotations[boneIndex] ?? IDENTITY_QUATERNION
    );
    inverseBindMatrices.set(invertMatrix4(bindMatrix), boneIndex * 16);
  }
  return inverseBindMatrices;
}

function computeActorGlobalBonePose(
  bones: ActorBoneAsset[],
  rootPosition: [number, number, number]
): ActorAnimationPose {
  const globalPositions = bones.map(() => [0, 0, 0] as [number, number, number]);
  const globalRotations = bones.map(() => [0, 0, 0, 1] as [number, number, number, number]);
  for (let index = 0; index < bones.length; index += 1) {
    const bone = bones[index];
    if (bone == null) {
      continue;
    }

    if (bone.parentIndex == null) {
      globalPositions[index] = [
        rootPosition[0] + bone.localPosition[0],
        rootPosition[1] + bone.localPosition[1],
        rootPosition[2] + bone.localPosition[2],
      ];
      globalRotations[index] = bone.localRotation;
      continue;
    }

    const parentPosition = globalPositions[bone.parentIndex] ?? [0, 0, 0];
    const parentRotation = globalRotations[bone.parentIndex] ?? IDENTITY_QUATERNION;
    const rotatedLocalPosition = rotateVectorByQuaternion(bone.localPosition, parentRotation);
    globalPositions[index] = [
      parentPosition[0] + rotatedLocalPosition[0],
      parentPosition[1] + rotatedLocalPosition[1],
      parentPosition[2] + rotatedLocalPosition[2],
    ];
    globalRotations[index] = normalizeQuaternion(
      multiplyQuaternions(parentRotation, bone.localRotation)
    );
  }
  return {
    globalPositions,
    globalRotations,
  };
}

function createActorPoseMatrices(pose: ActorAnimationPose): Mat4[] {
  return pose.globalPositions.map((position, index) =>
    createTransformMatrixFromQuaternion(
      position,
      pose.globalRotations[index] ?? IDENTITY_QUATERNION
    )
  );
}

function createActorAnimationPlaybackState(): ActorAnimationPlaybackState {
  return {
    activeClipName: "idle",
    activeStartedAtMs: 0,
    blendFromClipName: null,
    blendFromStartedAtMs: 0,
    blendStartedAtMs: 0,
    blendDurationMs: ACTOR_ANIMATION_BLEND_DURATION_MS,
  };
}

function sampleActorAnimationSetPose(
  animations: ActorAnimationSetAsset,
  bones: ActorBoneAsset[],
  originOffset: [number, number, number],
  targetClipName: ActorAnimationClipName,
  playbackState: ActorAnimationPlaybackState,
  timeMs: number
): ActorAnimationPose {
  if (playbackState.activeStartedAtMs <= 0) {
    playbackState.activeStartedAtMs = timeMs;
  }

  if (playbackState.activeClipName !== targetClipName) {
    playbackState.blendFromClipName = playbackState.activeClipName;
    playbackState.blendFromStartedAtMs = playbackState.activeStartedAtMs;
    playbackState.blendStartedAtMs = timeMs;
    playbackState.blendDurationMs = ACTOR_ANIMATION_BLEND_DURATION_MS;
    playbackState.activeClipName = targetClipName;
    playbackState.activeStartedAtMs = timeMs;
  }

  const activePose = sampleActorAnimationPose(
    animations[playbackState.activeClipName],
    bones,
    originOffset,
    timeMs - playbackState.activeStartedAtMs
  );

  if (playbackState.blendFromClipName == null) {
    return activePose;
  }

  const blendElapsedMs = timeMs - playbackState.blendStartedAtMs;
  const blendAmount = smoothstep(
    clamp(blendElapsedMs / Math.max(playbackState.blendDurationMs, 1), 0, 1)
  );
  if (blendAmount >= 1) {
    playbackState.blendFromClipName = null;
    return activePose;
  }

  const blendFromPose = sampleActorAnimationPose(
    animations[playbackState.blendFromClipName],
    bones,
    originOffset,
    timeMs - playbackState.blendFromStartedAtMs
  );

  return blendActorAnimationPoses(blendFromPose, activePose, blendAmount);
}

function blendActorAnimationPoses(
  from: ActorAnimationPose,
  to: ActorAnimationPose,
  amount: number
): ActorAnimationPose {
  const poseLength = Math.max(from.globalPositions.length, to.globalPositions.length);
  const globalPositions: [number, number, number][] = [];
  const globalRotations: [number, number, number, number][] = [];

  for (let index = 0; index < poseLength; index += 1) {
    globalPositions.push(
      lerpVector3(
        from.globalPositions[index] ?? [0, 0, 0],
        to.globalPositions[index] ?? from.globalPositions[index] ?? [0, 0, 0],
        amount
      )
    );
    globalRotations.push(
      nlerpQuaternion(
        from.globalRotations[index] ?? IDENTITY_QUATERNION,
        to.globalRotations[index] ?? from.globalRotations[index] ?? IDENTITY_QUATERNION,
        amount
      )
    );
  }

  return {
    globalPositions,
    globalRotations,
  };
}

function createTransformMatrixFromQuaternion(
  position: [number, number, number],
  rotation: [number, number, number, number]
): Mat4 {
  const [x, y, z, w] = normalizeQuaternion(rotation);
  const xx = x * x;
  const yy = y * y;
  const zz = z * z;
  const xy = x * y;
  const xz = x * z;
  const yz = y * z;
  const wx = w * x;
  const wy = w * y;
  const wz = w * z;

  return new Float32Array([
    1 - 2 * (yy + zz), 2 * (xy + wz), 2 * (xz - wy), 0,
    2 * (xy - wz), 1 - 2 * (xx + zz), 2 * (yz + wx), 0,
    2 * (xz + wy), 2 * (yz - wx), 1 - 2 * (xx + yy), 0,
    position[0], position[1], position[2], 1,
  ]);
}

function readPackedMatrix4(matrices: Float32Array, matrixIndex: number): Mat4 {
  const offset = matrixIndex * 16;
  if (offset < 0 || offset + 15 >= matrices.length) {
    return IDENTITY_MATRIX_4;
  }
  return new Float32Array(matrices.subarray(offset, offset + 16));
}

function transformPointByMatrix(
  matrix: Mat4,
  point: [number, number, number]
): [number, number, number] {
  const [x, y, z] = point;
  return [
    readMatrixValue(matrix, 0) * x +
      readMatrixValue(matrix, 4) * y +
      readMatrixValue(matrix, 8) * z +
      readMatrixValue(matrix, 12),
    readMatrixValue(matrix, 1) * x +
      readMatrixValue(matrix, 5) * y +
      readMatrixValue(matrix, 9) * z +
      readMatrixValue(matrix, 13),
    readMatrixValue(matrix, 2) * x +
      readMatrixValue(matrix, 6) * y +
      readMatrixValue(matrix, 10) * z +
      readMatrixValue(matrix, 14),
  ];
}

function transformDirectionByMatrix(
  matrix: Mat4,
  direction: [number, number, number]
): [number, number, number] {
  const [x, y, z] = direction;
  return normalizeVector3([
    readMatrixValue(matrix, 0) * x +
      readMatrixValue(matrix, 4) * y +
      readMatrixValue(matrix, 8) * z,
    readMatrixValue(matrix, 1) * x +
      readMatrixValue(matrix, 5) * y +
      readMatrixValue(matrix, 9) * z,
    readMatrixValue(matrix, 2) * x +
      readMatrixValue(matrix, 6) * y +
      readMatrixValue(matrix, 10) * z,
  ]);
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
    const localRotation = sampleClipQuaternion(
      clip,
      boneIndex - 1,
      frameA,
      frameB,
      frameMix,
      bone.localRotation
    );
    const localPosition = sampleClipVector3(
      clip.localPositions,
      boneIndex - 1,
      frameA,
      frameB,
      frameMix,
      bone.localPosition
    );
    const parentRotation = globalRotations[parentIndex] ?? IDENTITY_QUATERNION;
    const parentPosition = globalPositions[parentIndex] ?? [0, 0, 0];
    const rotatedLocalPosition = rotateVectorByQuaternion(localPosition, parentRotation);

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
  frameMix: number,
  fallback: [number, number, number, number]
): [number, number, number, number] {
  const frameARotation = clip.rotations[frameA]?.[animatedBoneIndex] ?? fallback;
  const frameBRotation = clip.rotations[frameB]?.[animatedBoneIndex] ?? frameARotation;
  return nlerpQuaternion(frameARotation, frameBRotation, frameMix);
}

function sampleClipVector3(
  frames: number[][][] | undefined,
  animatedBoneIndex: number,
  frameA: number,
  frameB: number,
  frameMix: number,
  fallback: [number, number, number]
): [number, number, number] {
  const frameAPosition = frames?.[frameA]?.[animatedBoneIndex] ?? fallback;
  const frameBPosition = frames?.[frameB]?.[animatedBoneIndex] ?? frameAPosition;
  return lerpVector3(frameAPosition, frameBPosition, frameMix);
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

function rotateVectorAroundX(
  vector: [number, number, number],
  angleRadians: number
): [number, number, number] {
  if (Math.abs(angleRadians) <= 0.000001) {
    return vector;
  }

  const cosine = Math.cos(angleRadians);
  const sine = Math.sin(angleRadians);
  return [
    vector[0],
    vector[1] * cosine - vector[2] * sine,
    vector[1] * sine + vector[2] * cosine,
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

function createSmoothTerrainHeightSamples(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialLandMask: Uint8Array,
  materialColumns: number,
  materialRows: number
): Float32Array {
  let currentHeights: Float32Array<ArrayBufferLike> = new Float32Array(heights.length);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const isLand = sampleLandMaskAt(
        materialLandMask,
        materialColumns,
        materialRows,
        u,
        v
      ) > 0;
      currentHeights[y * columns + x] = isLand ? heights[y * columns + x] ?? 0 : 0;
    }
  }

  for (let pass = 0; pass < SMOOTH_TERRAIN_PASSES; pass += 1) {
    currentHeights = smoothTerrainHeightPass(
      currentHeights,
      columns,
      rows,
      materialLandMask,
      materialColumns,
      materialRows
    );
  }

  return currentHeights;
}

function smoothTerrainHeightPass(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialLandMask: Uint8Array,
  materialColumns: number,
  materialRows: number
): Float32Array {
  const smoothedHeights = new Float32Array(heights.length);
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const outputIndex = y * columns + x;
      const centerHeight = heights[outputIndex] ?? 0;
      const isLand = sampleLandMaskAt(
        materialLandMask,
        materialColumns,
        materialRows,
        u,
        v
      ) > 0;

      if (!isLand) {
        smoothedHeights[outputIndex] = 0;
        continue;
      }

      let heightSum = 0;
      let landWeight = 0;
      let totalWeight = 0;
      for (const sample of SMOOTH_TERRAIN_KERNEL) {
        const sampleX = clamp(x + sample.x, 0, maxX);
        const sampleY = clamp(y + sample.y, 0, maxY);
        const sampleU = sampleX / Math.max(columns - 1, 1);
        const sampleV = sampleY / Math.max(rows - 1, 1);
        totalWeight += sample.weight;

        if (
          sampleLandMaskAt(
            materialLandMask,
            materialColumns,
            materialRows,
            sampleU,
            sampleV
          ) <= 0
        ) {
          continue;
        }

        heightSum += (heights[sampleY * columns + sampleX] ?? centerHeight) * sample.weight;
        landWeight += sample.weight;
      }

      if (landWeight <= 0 || totalWeight <= 0) {
        smoothedHeights[outputIndex] = centerHeight;
        continue;
      }

      const coastAmount = 1 - landWeight / totalWeight;
      const blend =
        SMOOTH_TERRAIN_LAND_BLEND +
        (SMOOTH_TERRAIN_COAST_BLEND - SMOOTH_TERRAIN_LAND_BLEND) * coastAmount;
      smoothedHeights[outputIndex] =
        centerHeight + (heightSum / landWeight - centerHeight) * blend;
    }
  }

  return smoothedHeights;
}

function createHexTravelGrid(materialSemanticModel: CampaignMaterialSemanticModel): HexTravelGrid {
  const hexCells = materialSemanticModel.cells;
  const passableHexKeys = new Set<string>();
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  for (const cell of hexCells) {
    bounds.minX = Math.min(bounds.minX, cell.x);
    bounds.maxX = Math.max(bounds.maxX, cell.x);
    bounds.minY = Math.min(bounds.minY, cell.y);
    bounds.maxY = Math.max(bounds.maxY, cell.y);
    if (isHexPassableAtHexCell(materialSemanticModel, cell)) {
      passableHexKeys.add(getHexCellKey(cell.x, cell.y));
    }
  }

  if (hexCells.length <= 0) {
    bounds.minX = 0;
    bounds.maxX = 0;
    bounds.minY = 0;
    bounds.maxY = 0;
  }

  return {
    passableHexKeys,
    bounds,
  };
}

function createSmoothTerrainMesh(
  heights: Float32Array,
  columns: number,
  rows: number,
  meshStep: number
): MeshData {
  const vertices: number[] = [];
  const indices: number[] = [];
  const columnSamples = createTerrainMeshSampleIndices(columns, meshStep);
  const rowSamples = createTerrainMeshSampleIndices(rows, meshStep);
  const vertexColumns = columnSamples.length;

  for (const sampleY of rowSamples) {
    const v = sampleY / Math.max(rows - 1, 1);
    for (const sampleX of columnSamples) {
      const u = sampleX / Math.max(columns - 1, 1);
      addSmoothTerrainVertex(
        vertices,
        u,
        v,
        sampleHeightAt(heights, columns, rows, u, v),
        createSmoothTerrainNormal(heights, columns, rows, u, v)
      );
    }
  }

  for (let row = 0; row < rowSamples.length - 1; row += 1) {
    for (let column = 0; column < columnSamples.length - 1; column += 1) {
      const topLeft = row * vertexColumns + column;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + vertexColumns;
      const bottomRight = bottomLeft + 1;
      indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
  };
}

function createTerrainMeshSampleIndices(count: number, step: number): number[] {
  const sampleIndices: number[] = [];
  const safeStep = Math.max(Math.floor(step), 1);

  for (let index = 0; index < count; index += safeStep) {
    sampleIndices.push(index);
  }

  const lastIndex = Math.max(count - 1, 0);
  if (sampleIndices[sampleIndices.length - 1] !== lastIndex) {
    sampleIndices.push(lastIndex);
  }

  return sampleIndices;
}

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

function addSmoothTerrainVertex(
  vertices: number[],
  u: number,
  v: number,
  height: number,
  normal: [number, number, number]
): number {
  const vertexIndex = vertices.length / 8;
  vertices.push(
    (u - 0.5) * 2,
    (0.5 - v) * 2,
    height * HEIGHT_SCALE,
    u,
    v,
    normal[0],
    normal[1],
    normal[2]
  );

  return vertexIndex;
}

function createSmoothTerrainNormal(
  heights: Float32Array,
  columns: number,
  rows: number,
  u: number,
  v: number
): [number, number, number] {
  const deltaU = TERRAIN_NORMAL_SAMPLE_RADIUS_PIXELS / Math.max(columns - 1, 1);
  const deltaV = TERRAIN_NORMAL_SAMPLE_RADIUS_PIXELS / Math.max(rows - 1, 1);
  const leftHeight = sampleHeightAt(heights, columns, rows, u - deltaU, v);
  const rightHeight = sampleHeightAt(heights, columns, rows, u + deltaU, v);
  const topHeight = sampleHeightAt(heights, columns, rows, u, v - deltaV);
  const bottomHeight = sampleHeightAt(heights, columns, rows, u, v + deltaV);
  const tangentU: [number, number, number] = [
    deltaU * 2,
    0,
    (rightHeight - leftHeight) * HEIGHT_SCALE * TERRAIN_NORMAL_RELIEF_SCALE,
  ];
  const tangentV: [number, number, number] = [
    0,
    -deltaV * 2,
    (bottomHeight - topHeight) * HEIGHT_SCALE * TERRAIN_NORMAL_RELIEF_SCALE,
  ];

  return normalizeVector3([
    tangentV[1] * tangentU[2] - tangentV[2] * tangentU[1],
    tangentV[2] * tangentU[0] - tangentV[0] * tangentU[2],
    tangentV[0] * tangentU[1] - tangentV[1] * tangentU[0],
  ]);
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

function isHexPassableAtUv(
  materialSemanticModel: CampaignMaterialSemanticModel,
  u: number,
  v: number
): boolean {
  const point = terrainUvToHexPoint(u, v);
  const cell = pixelToRoundedHex(point.x, point.y);
  return isHexPassableAtHexCell(materialSemanticModel, cell);
}

function isHexPassableAtHexCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate
): boolean {
  return materialSemanticModel.landByCellKey.get(getHexCellKey(cell.x, cell.y)) === true;
}

function isHexPassableAtHexPoint(
  materialLandMask: Uint8Array,
  columns: number,
  rows: number,
  center: { x: number; y: number }
): boolean {
  return (
    sampleLandMaskAt(
      materialLandMask,
      columns,
      rows,
      hexPointToTerrainU(center.x),
      hexPointToTerrainV(center.y)
    ) > 0
  );
}

function createTexture(
  gl: WebGLRenderingContext,
  image: TexImageSource,
  options?: {
    wrapS?: number;
    wrapT?: number;
    minFilter?: number;
    magFilter?: number;
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
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options?.minFilter ?? gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options?.magFilter ?? gl.LINEAR);

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
  const cameraDistance = createTranslationMatrix(
    0,
    0,
    -CAMERA_BASE_DISTANCE / CAMERA_REFERENCE_SCALE
  );
  const terrainPlanePan = createTerrainPlanePanMatrix(currentCamera);
  const tilt = createRotationXMatrix(getCampaignTerrainCameraTiltRadians(currentCamera));
  const scale = createScaleMatrix(TERRAIN_SCALE, TERRAIN_SCALE, 1);
  const screenZoom = createScaleMatrix(screenScale, screenScale, 1);

  return multiplyMatrices(
    screenZoom,
    multiplyMatrices(
      projection,
      multiplyMatrices(
        cameraDistance,
        multiplyMatrices(tilt, multiplyMatrices(terrainPlanePan, scale))
      )
    )
  );
}

function createTerrainPlanePanMatrix(camera: CampaignTerrainCamera): Mat4 {
  const safeScale = Math.max(camera.scale, 0.1);
  const tiltCos = Math.cos(getCampaignTerrainCameraTiltRadians(camera));
  const safeTiltCos = Math.abs(tiltCos) < 0.0001 ? 1 : tiltCos;

  return createTranslationMatrix(
    camera.offsetX * CAMERA_OFFSET_UNIT / safeScale,
    -camera.offsetY * CAMERA_OFFSET_UNIT / safeScale / safeTiltCos,
    0
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

function invertMatrix4(matrix: Mat4): Mat4 {
  const m: [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
  ] = [
    readMatrixValue(matrix, 0),
    readMatrixValue(matrix, 1),
    readMatrixValue(matrix, 2),
    readMatrixValue(matrix, 3),
    readMatrixValue(matrix, 4),
    readMatrixValue(matrix, 5),
    readMatrixValue(matrix, 6),
    readMatrixValue(matrix, 7),
    readMatrixValue(matrix, 8),
    readMatrixValue(matrix, 9),
    readMatrixValue(matrix, 10),
    readMatrixValue(matrix, 11),
    readMatrixValue(matrix, 12),
    readMatrixValue(matrix, 13),
    readMatrixValue(matrix, 14),
    readMatrixValue(matrix, 15),
  ];
  const inverse = new Float32Array(16);
  inverse[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] -
    m[9] * m[6] * m[15] + m[9] * m[7] * m[14] +
    m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
  inverse[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] +
    m[8] * m[6] * m[15] - m[8] * m[7] * m[14] -
    m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
  inverse[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] -
    m[8] * m[5] * m[15] + m[8] * m[7] * m[13] +
    m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
  inverse[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] +
    m[8] * m[5] * m[14] - m[8] * m[6] * m[13] -
    m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
  inverse[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] +
    m[9] * m[2] * m[15] - m[9] * m[3] * m[14] -
    m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
  inverse[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] -
    m[8] * m[2] * m[15] + m[8] * m[3] * m[14] +
    m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
  inverse[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] +
    m[8] * m[1] * m[15] - m[8] * m[3] * m[13] -
    m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
  inverse[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] -
    m[8] * m[1] * m[14] + m[8] * m[2] * m[13] +
    m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
  inverse[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] -
    m[5] * m[2] * m[15] + m[5] * m[3] * m[14] +
    m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
  inverse[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] +
    m[4] * m[2] * m[15] - m[4] * m[3] * m[14] -
    m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
  inverse[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] -
    m[4] * m[1] * m[15] + m[4] * m[3] * m[13] +
    m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
  inverse[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] +
    m[4] * m[1] * m[14] - m[4] * m[2] * m[13] -
    m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
  inverse[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] +
    m[5] * m[2] * m[11] - m[5] * m[3] * m[10] -
    m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
  inverse[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] -
    m[4] * m[2] * m[11] + m[4] * m[3] * m[10] +
    m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
  inverse[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] +
    m[4] * m[1] * m[11] - m[4] * m[3] * m[9] -
    m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
  inverse[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] -
    m[4] * m[1] * m[10] + m[4] * m[2] * m[9] +
    m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

  const determinant =
    m[0] * readMatrixValue(inverse, 0) +
    m[1] * readMatrixValue(inverse, 4) +
    m[2] * readMatrixValue(inverse, 8) +
    m[3] * readMatrixValue(inverse, 12);
  if (Math.abs(determinant) <= 0.0000001) {
    return IDENTITY_MATRIX_4;
  }

  for (let index = 0; index < 16; index += 1) {
    inverse[index] = readMatrixValue(inverse, index) / determinant;
  }
  return inverse;
}

function readMatrixValue(matrix: Mat4, index: number): number {
  return matrix[index] ?? 0;
}

function easeOutCubic(value: number): number {
  const clampedValue = clamp(value, 0, 1);

  return 1 - (1 - clampedValue) ** 3;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value: number): number {
  const clampedValue = clamp(value, 0, 1);
  return clampedValue * clampedValue * (3 - 2 * clampedValue);
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
