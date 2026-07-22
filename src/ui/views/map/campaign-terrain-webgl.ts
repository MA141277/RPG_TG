import type {
  CoordinateSpace,
  GridCoordinate,
  HexTravelGrid,
} from "../../../application/navigation/travel-to-coordinate";
import type {
  CampaignHexGridDefinition,
  CampaignVegetationMeshDefinition,
  CampaignVegetationRulesDefinition,
} from "../../../domain/map";
import actorFragmentShaderRaw from "./shaders/campaign-actor.frag.glsl?raw";
import actorVertexShaderRaw from "./shaders/campaign-actor.vert.glsl?raw";
import terrainFragmentShaderRaw from "./shaders/campaign-terrain.frag.glsl?raw";
import terrainVertexShaderRaw from "./shaders/campaign-terrain.vert.glsl?raw";
import vegetationFragmentShaderRaw from "./shaders/campaign-vegetation.frag.glsl?raw";
import vegetationShadowFragmentShaderRaw from "./shaders/campaign-vegetation-shadow.frag.glsl?raw";
import vegetationShadowVertexShaderRaw from "./shaders/campaign-vegetation-shadow.vert.glsl?raw";
import vegetationVertexShaderRaw from "./shaders/campaign-vegetation.vert.glsl?raw";

type CampaignTerrainInput = {
  canvas: HTMLCanvasElement;
  textureUrl: string;
  heightUrl: string;
  materialUrl: string;
  campaignHexGridUrl: string | null;
  campaignVegetationRulesUrl: string | null;
  grassTextureUrl: string | null;
  sandTextureUrl: string | null;
  rockTextureUrl: string | null;
  snowTextureUrl: string | null;
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

type VegetationMeshData = {
  vertices: Float32Array;
  indices: Uint32Array;
  shadowVertices: Float32Array;
  shadowIndices: Uint32Array;
  instanceCount: number;
};

type VegetationMeshAsset = {
  id: string;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
};

type CampaignVegetationRulesAsset = CampaignVegetationRulesDefinition & {
  variants: Array<CampaignVegetationRulesDefinition["variants"][number] & {
    meshUrl: string;
  }>;
};

type CampaignVegetationAsset = {
  rules: CampaignVegetationRulesAsset;
  meshesById: Map<string, VegetationMeshAsset>;
  meshPromisesById: Map<string, Promise<VegetationMeshAsset | null>>;
  failedMeshIds: Set<string>;
};

type CampaignVegetationCell = {
  x: number;
  y: number;
  u: number;
  v: number;
};

type CampaignVegetationAvoidancePoint = {
  u: number;
  v: number;
  radius: number;
};

type CampaignVegetationVisibleCell = {
  cell: CampaignVegetationCell;
  priority: number;
  screenX: number;
  screenY: number;
  targetCount: number;
};

type CampaignVegetationCellAllocation = {
  cell: CampaignVegetationCell;
  count: number;
};

type CampaignVegetationInstance = {
  mesh: VegetationMeshAsset;
  variant: CampaignVegetationRulesAsset["variants"][number];
  u: number;
  v: number;
  rotation: number;
  scale: number;
  colorJitter: number;
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
const CLOUD_REVEAL_REFERENCE_HEIGHT = 0.12;
const TERRAIN_SCALE = 1.46;
const CAMERA_TILT_TOP_DOWN_RADIANS = -0.36;
const CAMERA_TILT_CLOSE_RADIANS = -0.99;
const CAMERA_TILT_TOP_DOWN_SCALE = 8;
const CAMERA_TILT_CLOSE_SCALE = 80;
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
const SMOOTH_TERRAIN_MESH_STEP = 1;
const CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE = 8;
const CAMPAIGN_TERRAIN_INITIAL_RADIUS_HEX = 6;
const CAMPAIGN_TERRAIN_PREFETCH_RADIUS_HEX = 10;
const CAMPAIGN_TERRAIN_CHUNK_PADDING_HEX = 2;
const CAMPAIGN_TERRAIN_CHUNK_MIN_COLUMNS = 32;
const CAMPAIGN_TERRAIN_CHUNK_MIN_ROWS = 32;
const CAMPAIGN_TERRAIN_CHUNK_CACHE_DB_NAME = "campaign-terrain-cache-v1";
const CAMPAIGN_TERRAIN_CHUNK_CACHE_STORE_NAME = "chunks";
const CAMPAIGN_TERRAIN_CHUNK_ALGORITHM_VERSION = "2026-07-21-owned-grid-smooth-shadows-v1";
const SMOOTH_TERRAIN_PASSES = 2;
const SMOOTH_TERRAIN_LAND_BLEND = 0.65;
const SMOOTH_TERRAIN_COAST_BLEND = 0.35;
const NON_MOUNTAIN_HEIGHT_FLATTEN_STRENGTH = 0.82;
const NON_MOUNTAIN_HEIGHT_EDGE_FADE_START = 0.30;
const NON_MOUNTAIN_HEIGHT_EDGE_FADE_END = 0.50;
const NON_MOUNTAIN_HEIGHT_SMOOTH_STRENGTH = 0.34;
const MOUNTAIN_FLOOR_DIFFUSION_PASSES = 48;
const MOUNTAIN_FLOOR_SMOOTH_PASSES = 4;
const MOUNTAIN_HEIGHT_DELTA_MIN = 0.070;
const MOUNTAIN_HEIGHT_DELTA_REFERENCE_SCALE = 0.28;
const MOUNTAIN_HEIGHT_BODY_STRENGTH = 0.46;
const MOUNTAIN_HEIGHT_PEAK_STRENGTH = 0.52;
const MOUNTAIN_HEIGHT_RIDGE_STRENGTH = 0.32;
const MOUNTAIN_HEIGHT_VALLEY_STRENGTH = 0.22;
const MOUNTAIN_HEIGHT_DETAIL_STRENGTH = 0.090;
const MOUNTAIN_HEIGHT_PEAK_FIELD_SPACING = 1.9;
const MOUNTAIN_HEIGHT_EDGE_INSET_MIN = 0.18;
const MOUNTAIN_HEIGHT_EDGE_INSET_MAX = 0.56;
const MOUNTAIN_HEIGHT_CONTINUITY_BLEND = 0.36;
const MOUNTAIN_HEIGHT_ERODED_FBM_GAIN = 0.48;
const MOUNTAIN_HEIGHT_ERODED_FBM_LACUNARITY = 2.03;
const MOUNTAIN_HEIGHT_ERODED_FBM_GRADIENT_DAMPING = 0.58;
const MOUNTAIN_HEIGHT_ERODED_FBM_GRADIENT_EPSILON = 0.018;
const MOUNTAIN_HEIGHT_SUMMIT_ROUNDING_START = 0.64;
const MOUNTAIN_HEIGHT_SUMMIT_ROUNDING_STRENGTH = 0.18;
const TERRAIN_GRID_LAND_OPACITY = 0.08;
const TERRAIN_GRID_WATER_OPACITY = 0.015;
const TERRAIN_NORMAL_SAMPLE_RADIUS_PIXELS = 4;
const TERRAIN_NORMAL_SMOOTH_RADIUS_PIXELS = 3;
const TERRAIN_NORMAL_RELIEF_SCALE = 2.85;
const TERRAIN_DIRECTIONAL_LIGHT_STRENGTH = 0.18;
const TERRAIN_BACK_SHADOW_STRENGTH = 0.32;
const TERRAIN_STEEP_SHADOW_STRENGTH = 0;
const TERRAIN_WATER_SHADOW_STRENGTH = 0.12;
const TERRAIN_CAMERA_LIGHT_HEIGHT = 0.26;
const TERRAIN_CAMERA_LIGHT_HORIZONTAL_PULL = 0.58;
const TERRAIN_LAND_TEXTURE_TILING = 7.5;
const TERRAIN_SNOW_HEIGHT_START = 0.38;
const TERRAIN_SNOW_HEIGHT_FULL = 0.42;
const SHORELINE_DISTANCE_TEXTURE_DISTANCE_RANGE = 4.25;
const SHORELINE_DISTANCE_TEXTURE_MIN_REACH = 1.2;
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
  innerRadius: 1.0,
  outerRadius: 1.1,
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
const GRASS_TEXTURE_DETAIL = 1.04;
const GRASS_AMBIENT_LIGHT = 0.53;
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
const vegetationVertexShaderSource = vegetationVertexShaderRaw;
const vegetationFragmentShaderSource = vegetationFragmentShaderRaw;
const vegetationShadowVertexShaderSource = vegetationShadowVertexShaderRaw;
const vegetationShadowFragmentShaderSource = vegetationShadowFragmentShaderRaw;
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
  saturation: 0.94,
  brightness: 0.93,
  brightnessOffset: -0.018,
  shadeMin: 0.86,
  shadeMax: 1.0,
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
  sampleHeightAtUv: (u: number, v: number) => number;
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
  materialSemanticModel: CampaignMaterialSemanticModel;
  sampleHeightAtUv: (u: number, v: number) => number;
};

type CampaignTerrainSemanticData = {
  materialSemanticModel: CampaignMaterialSemanticModel;
  travelGrid: HexTravelGrid;
};

type CampaignTerrainChunkCoordinate = {
  x: number;
  y: number;
};

type CampaignTerrainChunkBounds = {
  minU: number;
  maxU: number;
  minV: number;
  maxV: number;
};

type CampaignTerrainChunkGrid = {
  bounds: CampaignTerrainChunkBounds;
  columns: number;
  rows: number;
};

type CampaignTerrainChunkData = {
  key: string;
  cacheKey: string;
  chunkX: number;
  chunkY: number;
  meshBounds: CampaignTerrainChunkBounds;
  sampleBounds: CampaignTerrainChunkBounds;
  columns: number;
  rows: number;
  heights: Float32Array;
  mesh: MeshData;
  shorelineSource: ImageData;
  shorelineDistanceRange: number;
  shorelineSignature: string;
};

type CampaignTerrainChunkRenderResource = {
  data: CampaignTerrainChunkData;
  vertexBuffer: WebGLBuffer;
  indexBuffer: WebGLBuffer;
  shorelineTexture: WebGLTexture;
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
  mountainByCellKey: Map<string, boolean>;
  referenceHeightByCellKey: Map<string, number>;
};

type CampaignHexGridAsset = CampaignHexGridDefinition;

type ShorelineDistanceTextureModel = {
  source: ImageData;
  textureColumns: number;
  textureRows: number;
  distanceRange: number;
  signature: string;
};

const campaignTerrainSemanticDataCache = new Map<
  string,
  Promise<CampaignTerrainSemanticData>
>();
const campaignTerrainChunkDataCache = new Map<string, Promise<CampaignTerrainChunkData>>();
const shorelineChainEdgesBySemanticModel = new WeakMap<
  CampaignMaterialSemanticModel,
  ShorelineChainEdge[]
>();
let campaignTerrainChunkCacheDbPromise: Promise<IDBDatabase | null> | null = null;

type ShorelineChainEdge = {
  id: number;
  landCell: GridCoordinate;
  waterCell: GridCoordinate;
  landDirectionIndex: number;
  waterDirectionIndex: number;
  normalToWater: { x: number; y: number };
  tangent: { x: number; y: number };
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

export function projectCampaignTerrainUvToClientPointAtCloudRevealHeight(
  root: ParentNode,
  u: number,
  v: number
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
  const screenPoint = projectPoint(
    matrix,
    createTerrainWorldPoint(u, v, CLOUD_REVEAL_REFERENCE_HEIGHT)
  );
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
  const height = renderer.sampleHeightAtUv(heightU, heightV);
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
    renderer.sampleHeightAtUv
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
    campaignHexGridUrl:
      renderMode === "terrain" || renderMode === "actor"
        ? canvas.dataset.mapHexGridUrl ?? null
        : null,
    campaignVegetationRulesUrl:
      renderMode === "terrain"
        ? canvas.dataset.mapVegetationRulesUrl ?? null
        : null,
    grassTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapGrassTextureUrl ?? null : null,
    sandTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapSandTextureUrl ?? null : null,
    rockTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapRockTextureUrl ?? null : null,
    snowTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapSnowTextureUrl ?? null : null,
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
    input.campaignHexGridUrl ?? "",
    input.campaignVegetationRulesUrl ?? "",
    input.grassTextureUrl ?? "",
    input.sandTextureUrl ?? "",
    input.rockTextureUrl ?? "",
    input.snowTextureUrl ?? "",
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
  const campaignHexGridPromise =
    input.campaignHexGridUrl == null
      ? Promise.resolve(null)
      : loadJson<CampaignHexGridAsset>(input.campaignHexGridUrl).catch((error: unknown) => {
        console.error("Failed to load campaign hex grid asset.", error);
        return null;
      });
  const vegetationAssetPromise =
    renderTerrain && input.campaignVegetationRulesUrl != null
      ? loadCampaignVegetationAsset(input.campaignVegetationRulesUrl).catch(
        (error: unknown) => {
          console.error("Failed to load campaign vegetation asset.", error);
          return null;
        }
      )
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
  const rockTextureImagePromise =
    renderTerrain && input.rockTextureUrl != null
      ? loadImage(input.rockTextureUrl).catch((error: unknown) => {
        console.error("Failed to load campaign rock texture.", error);
        return null;
      })
      : Promise.resolve(null);
  const snowTextureImagePromise =
    renderTerrain && input.snowTextureUrl != null
      ? loadImage(input.snowTextureUrl).catch((error: unknown) => {
        console.error("Failed to load campaign snow texture.", error);
        return null;
      })
      : Promise.resolve(null);
  const [
    textureImage,
    materialImage,
    waterTextureImage,
    grassTextureImage,
    sandTextureImage,
    rockTextureImage,
    snowTextureImage,
    actorAsset,
    cityDepthAsset,
    campaignHexGrid,
    vegetationAsset,
  ] = await Promise.all([
    loadImage(input.textureUrl),
    loadImage(input.materialUrl),
    waterTextureImagePromise,
    grassTextureImagePromise,
    sandTextureImagePromise,
    rockTextureImagePromise,
    snowTextureImagePromise,
    actorAssetPromise,
    cityDepthAssetPromise,
    campaignHexGridPromise,
    vegetationAssetPromise,
  ]);
  const semanticData = await getCampaignTerrainSemanticData({
    input,
    materialImage,
    campaignHexGrid,
  });
  const { materialSemanticModel, travelGrid } = semanticData;
  const vegetationCells =
    campaignHexGrid == null || vegetationAsset == null
      ? []
      : getCampaignVegetationCells(
        campaignHexGrid,
        vegetationAsset.rules.environment
      );
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  const actorProgram = createProgram(gl, actorVertexShaderSource, actorFragmentShaderSource);
  const vegetationProgram = createProgram(
    gl,
    vegetationVertexShaderSource,
    vegetationFragmentShaderSource
  );
  const vegetationShadowProgram = createProgram(
    gl,
    vegetationShadowVertexShaderSource,
    vegetationShadowFragmentShaderSource
  );
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  const uvLocation = gl.getAttribLocation(program, "aUv");
  const normalLocation = gl.getAttribLocation(program, "aNormal");
  const matrixLocation = gl.getUniformLocation(program, "uMatrix");
  const heightScaleLocation = gl.getUniformLocation(program, "uHeightScale");
  const terrainCameraTiltSinCosLocation = gl.getUniformLocation(
    program,
    "uTerrainCameraTiltSinCos"
  );
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
  const shorelineDistanceTextureLocation = gl.getUniformLocation(
    program,
    "uShorelineDistanceTexture"
  );
  const shorelineDistanceRangeLocation = gl.getUniformLocation(
    program,
    "uShorelineDistanceRange"
  );
  const shorelineDistanceBoundsLocation = gl.getUniformLocation(
    program,
    "uShorelineDistanceBounds"
  );
  const waterTextureLocation = gl.getUniformLocation(program, "uWaterTexture");
  const grassTextureLocation = gl.getUniformLocation(program, "uGrassTexture");
  const sandTextureLocation = gl.getUniformLocation(program, "uSandTexture");
  const rockTextureLocation = gl.getUniformLocation(program, "uRockTexture");
  const snowTextureLocation = gl.getUniformLocation(program, "uSnowTexture");
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
  const snowHeightStartLocation = gl.getUniformLocation(program, "uSnowHeightStart");
  const snowHeightFullLocation = gl.getUniformLocation(program, "uSnowHeightFull");
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
  const vegetationPositionLocation = gl.getAttribLocation(
    vegetationProgram,
    "aPosition"
  );
  const vegetationNormalLocation = gl.getAttribLocation(vegetationProgram, "aNormal");
  const vegetationColorLocation = gl.getAttribLocation(vegetationProgram, "aColor");
  const vegetationMatrixLocation = gl.getUniformLocation(vegetationProgram, "uMatrix");
  const vegetationCameraTiltSinCosLocation = gl.getUniformLocation(
    vegetationProgram,
    "uTerrainCameraTiltSinCos"
  );
  const vegetationAmbientLocation = gl.getUniformLocation(vegetationProgram, "uAmbient");
  const vegetationDirectionalLocation = gl.getUniformLocation(
    vegetationProgram,
    "uDirectional"
  );
  const vegetationViewportSizeLocation = gl.getUniformLocation(
    vegetationProgram,
    "uTerrainViewportSize"
  );
  const vegetationCameraLightHeightLocation = gl.getUniformLocation(
    vegetationProgram,
    "uTerrainCameraLightHeight"
  );
  const vegetationCameraLightHorizontalPullLocation = gl.getUniformLocation(
    vegetationProgram,
    "uTerrainCameraLightHorizontalPull"
  );
  const vegetationTerrainDirectionalLightStrengthLocation = gl.getUniformLocation(
    vegetationProgram,
    "uTerrainDirectionalLightStrength"
  );
  const vegetationTerrainBackShadowStrengthLocation = gl.getUniformLocation(
    vegetationProgram,
    "uTerrainBackShadowStrength"
  );
  const vegetationTerrainSteepShadowStrengthLocation = gl.getUniformLocation(
    vegetationProgram,
    "uTerrainSteepShadowStrength"
  );
  const vegetationShadowPositionLocation = gl.getAttribLocation(
    vegetationShadowProgram,
    "aPosition"
  );
  const vegetationShadowUvLocation = gl.getAttribLocation(vegetationShadowProgram, "aUv");
  const vegetationShadowMatrixLocation = gl.getUniformLocation(
    vegetationShadowProgram,
    "uMatrix"
  );
  const vegetationShadowOpacityLocation = gl.getUniformLocation(
    vegetationShadowProgram,
    "uOpacity"
  );
  const actorVertexBuffer = gl.createBuffer();
  const actorIndexBuffer = gl.createBuffer();
  const cityDepthVertexBuffer = gl.createBuffer();
  const cityDepthIndexBuffer = gl.createBuffer();
  const vegetationVertexBuffer = gl.createBuffer();
  const vegetationIndexBuffer = gl.createBuffer();
  const vegetationShadowVertexBuffer = gl.createBuffer();
  const vegetationShadowIndexBuffer = gl.createBuffer();
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
  const grassTexture = createTexture(gl, grassTextureImage ?? textureImage);
  const sandTexture = createTexture(gl, sandTextureImage ?? textureImage);
  const rockTexture = createTexture(gl, rockTextureImage ?? textureImage);
  const snowTexture = createTexture(gl, snowTextureImage ?? textureImage);
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
    materialTextureLocation == null ? "uMaterialTexture" : null,
    materialSemanticTextureLocation == null ? "uMaterialSemanticTexture" : null,
    materialSemanticTextureSizeLocation == null ? "uMaterialSemanticTextureSize" : null,
    materialSemanticBoundsLocation == null ? "uMaterialSemanticBounds" : null,
    shorelineDistanceTextureLocation == null ? "uShorelineDistanceTexture" : null,
    shorelineDistanceRangeLocation == null ? "uShorelineDistanceRange" : null,
    shorelineDistanceBoundsLocation == null ? "uShorelineDistanceBounds" : null,
    waterTextureLocation == null ? "uWaterTexture" : null,
    grassTextureLocation == null ? "uGrassTexture" : null,
    sandTextureLocation == null ? "uSandTexture" : null,
    rockTextureLocation == null ? "uRockTexture" : null,
    snowTextureLocation == null ? "uSnowTexture" : null,
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
    snowHeightStartLocation == null ? "uSnowHeightStart" : null,
    snowHeightFullLocation == null ? "uSnowHeightFull" : null,
    beachTextureTilingLocation == null ? "uBeachTextureTiling" : null,
    beachBlendStrengthLocation == null ? "uBeachBlendStrength" : null,
    beachInnerRadiusLocation == null ? "uBeachInnerRadius" : null,
    beachOuterRadiusLocation == null ? "uBeachOuterRadius" : null,
    beachFineNoiseTilingLocation == null ? "uBeachFineNoiseTiling" : null,
    beachFineNoiseStrengthLocation == null ? "uBeachFineNoiseStrength" : null,
    shorelineVisualWaterStrengthLocation == null ? "uShorelineVisualWaterStrength" : null,
    shorelineEdgeWidthLocation == null ? "uShorelineEdgeWidth" : null,
    shorelineCornerRoundnessLocation == null ? "uShorelineCornerRoundness" : null,
    actorPositionLocation < 0 ? "actor.aPosition" : null,
    actorNormalLocation < 0 ? "actor.aNormal" : null,
    actorUvLocation < 0 ? "actor.aUv" : null,
    actorMatrixLocation == null ? "actor.uMatrix" : null,
    actorLightLocation == null ? "actor.uLight" : null,
    actorTextureLocation == null ? "actor.uTexture" : null,
    actorTintLocation == null ? "actor.uTint" : null,
    actorForceOpaqueAlphaLocation == null ? "actor.uForceOpaqueAlpha" : null,
    vegetationPositionLocation < 0 ? "vegetation.aPosition" : null,
    vegetationNormalLocation < 0 ? "vegetation.aNormal" : null,
    vegetationColorLocation < 0 ? "vegetation.aColor" : null,
    vegetationMatrixLocation == null ? "vegetation.uMatrix" : null,
    vegetationCameraTiltSinCosLocation == null ? "vegetation.uTerrainCameraTiltSinCos" : null,
    vegetationAmbientLocation == null ? "vegetation.uAmbient" : null,
    vegetationDirectionalLocation == null ? "vegetation.uDirectional" : null,
    vegetationViewportSizeLocation == null ? "vegetation.uTerrainViewportSize" : null,
    vegetationCameraLightHeightLocation == null ? "vegetation.uTerrainCameraLightHeight" : null,
    vegetationCameraLightHorizontalPullLocation == null
      ? "vegetation.uTerrainCameraLightHorizontalPull"
      : null,
    vegetationTerrainDirectionalLightStrengthLocation == null
      ? "vegetation.uTerrainDirectionalLightStrength"
      : null,
    vegetationTerrainBackShadowStrengthLocation == null
      ? "vegetation.uTerrainBackShadowStrength"
      : null,
    vegetationTerrainSteepShadowStrengthLocation == null
      ? "vegetation.uTerrainSteepShadowStrength"
      : null,
    vegetationShadowPositionLocation < 0 ? "vegetationShadow.aPosition" : null,
    vegetationShadowUvLocation < 0 ? "vegetationShadow.aUv" : null,
    vegetationShadowMatrixLocation == null ? "vegetationShadow.uMatrix" : null,
    vegetationShadowOpacityLocation == null ? "vegetationShadow.uOpacity" : null,
    actorVertexBuffer == null ? "actor.vertexBuffer" : null,
    actorIndexBuffer == null ? "actor.indexBuffer" : null,
    cityDepthVertexBuffer == null ? "cityDepth.vertexBuffer" : null,
    cityDepthIndexBuffer == null ? "cityDepth.indexBuffer" : null,
    vegetationVertexBuffer == null ? "vegetation.vertexBuffer" : null,
    vegetationIndexBuffer == null ? "vegetation.indexBuffer" : null,
    vegetationShadowVertexBuffer == null ? "vegetationShadow.vertexBuffer" : null,
    vegetationShadowIndexBuffer == null ? "vegetationShadow.indexBuffer" : null,
  ].filter((resource): resource is string => resource != null);
  if (missingResources.length > 0) {
    throw new Error(
      `Failed to initialize campaign terrain WebGL resources: ${missingResources.join(", ")}.`
    );
  }

  if (renderTerrain) {
    const uintIndicesExtension = gl.getExtension("OES_element_index_uint");
    if (uintIndicesExtension == null) {
      throw new Error("This browser cannot draw the campaign terrain mesh.");
    }
  }
  let cityDepthMesh: CityDepthMeshData | null = null;
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  let frameId: number | null = null;
  let isDisposed = false;
  let hasPendingRender = false;
  let projectedPointsNeedSync = true;
  let lastActorSignature = "";
  let lastCityDepthMeshSignature = "";
  let lastVegetationMeshSignature = "";
  let lastChunkShorelineSignature = getShorelineDistanceTextureSignature(terrainBeachTuning);
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;
  let vegetationMesh: VegetationMeshData | null = null;
  const actorAnimationState = createActorAnimationPlaybackState();
  const animatesTerrainWater = renderTerrain && waterTexture != null;
  const animatesActorModel = shouldRenderActorInThisCanvas && actorAsset != null && actorTexture != null;
  const animatesVegetation =
    renderTerrain && vegetationAsset != null && vegetationCells.length > 0;
  let dynamicAnimationTimeoutId: number | null = null;
  const chunkDataByKey = new Map<string, CampaignTerrainChunkData>();
  const chunkResourcesByKey = new Map<string, CampaignTerrainChunkRenderResource>();
  const pendingChunkKeys = new Set<string>();
  const sampleHeightAtUv = (u: number, v: number): number =>
    sampleHeightFromCampaignTerrainChunks({
      materialSemanticModel,
      chunksByKey: chunkDataByKey,
      u,
      v,
    });
  const projectionInput: CampaignTerrainProjectionInput = {
    canvas: input.canvas,
    materialSemanticModel,
    sampleHeightAtUv,
  };
  const uploadCampaignTerrainChunk = (chunk: CampaignTerrainChunkData): void => {
    if (isDisposed) {
      return;
    }

    chunkDataByKey.set(chunk.key, chunk);
    if (!renderTerrain || chunkResourcesByKey.has(chunk.key)) {
      projectedPointsNeedSync = true;
      lastVegetationMeshSignature = "";
      lastCityDepthMeshSignature = "";
      cityDepthMesh = null;
      return;
    }

    const vertexBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    const shorelineTexture = createTexture(gl, chunk.shorelineSource, {
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });
    if (vertexBuffer == null || indexBuffer == null) {
      if (vertexBuffer != null) {
        gl.deleteBuffer(vertexBuffer);
      }
      if (indexBuffer != null) {
        gl.deleteBuffer(indexBuffer);
      }
      gl.deleteTexture(shorelineTexture);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, chunk.mesh.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, chunk.mesh.indices, gl.STATIC_DRAW);
    chunkResourcesByKey.set(chunk.key, {
      data: chunk,
      vertexBuffer,
      indexBuffer,
      shorelineTexture,
    });
    projectedPointsNeedSync = true;
    lastVegetationMeshSignature = "";
    lastCityDepthMeshSignature = "";
    cityDepthMesh = null;
  };
  const ensureCampaignTerrainChunkKeys = (keys: Iterable<string>): void => {
    for (const chunkKey of keys) {
      if (
        chunkResourcesByKey.has(chunkKey) ||
        pendingChunkKeys.has(chunkKey)
      ) {
        continue;
      }

      pendingChunkKeys.add(chunkKey);
      void getCampaignTerrainChunkData({
        input,
        semanticData,
        chunkKey,
        beachTuning: terrainBeachTuning,
      }).then((chunk) => {
        pendingChunkKeys.delete(chunkKey);
        uploadCampaignTerrainChunk(chunk);
        requestRender("static");
      }).catch((error: unknown) => {
        pendingChunkKeys.delete(chunkKey);
        console.error("Failed to build campaign terrain chunk.", error);
      });
    }
  };
  const ensureCampaignTerrainChunks = (radiusHex: number): void => {
    const focusCell = getCampaignTerrainFocusCell(input.canvas);
    ensureCampaignTerrainChunkKeys(
      getCampaignTerrainChunkKeysAroundCell(focusCell, radiusHex)
    );
  };
  if (renderTerrain) {
    ensureCampaignTerrainChunks(CAMPAIGN_TERRAIN_INITIAL_RADIUS_HEX);
    window.setTimeout(() => {
      if (!isDisposed) {
        ensureCampaignTerrainChunks(CAMPAIGN_TERRAIN_PREFETCH_RADIUS_HEX);
      }
    }, 0);
  } else {
    ensureCampaignTerrainChunks(CAMPAIGN_TERRAIN_INITIAL_RADIUS_HEX);
  }
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
    const terrainCameraTilt = getCampaignTerrainCameraTiltRadians(currentCamera);
    ensureCampaignTerrainChunks(CAMPAIGN_TERRAIN_INITIAL_RADIUS_HEX);
    if (renderTerrain) {
      ensureCampaignTerrainChunks(CAMPAIGN_TERRAIN_PREFETCH_RADIUS_HEX);
    }
    const chunkShorelineSignature = getShorelineDistanceTextureSignature(terrainBeachTuning);
    if (renderTerrain && chunkShorelineSignature !== lastChunkShorelineSignature) {
      for (const chunkResource of chunkResourcesByKey.values()) {
        gl.deleteBuffer(chunkResource.vertexBuffer);
        gl.deleteBuffer(chunkResource.indexBuffer);
        gl.deleteTexture(chunkResource.shorelineTexture);
      }
      chunkResourcesByKey.clear();
      chunkDataByKey.clear();
      lastChunkShorelineSignature = chunkShorelineSignature;
      lastVegetationMeshSignature = "";
      cityDepthMesh = null;
    }

    if (renderTerrain) {
      gl.useProgram(program);
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
      gl.bindTexture(gl.TEXTURE_2D, rockTexture);
      gl.uniform1i(rockTextureLocation, 5);
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D, snowTexture);
      gl.uniform1i(snowTextureLocation, 6);
      gl.uniform1i(shorelineDistanceTextureLocation, 7);
      gl.activeTexture(gl.TEXTURE8);
      gl.bindTexture(gl.TEXTURE_2D, materialSemanticTexture);
      gl.uniform1i(materialSemanticTextureLocation, 8);
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
      gl.uniform1f(snowHeightStartLocation, TERRAIN_SNOW_HEIGHT_START);
      gl.uniform1f(snowHeightFullLocation, TERRAIN_SNOW_HEIGHT_FULL);
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
      gl.uniform1f(shorelineCornerRoundnessLocation, terrainBeachTuning.shorelineCornerRoundness);
      gl.uniformMatrix4fv(
        matrixLocation,
        false,
        terrainMatrix
      );

      const drawTerrainChunkResource = (
        chunkResource: CampaignTerrainChunkRenderResource
      ): void => {
        gl.bindBuffer(gl.ARRAY_BUFFER, chunkResource.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, chunkResource.indexBuffer);
        gl.activeTexture(gl.TEXTURE7);
        gl.bindTexture(gl.TEXTURE_2D, chunkResource.shorelineTexture);
        gl.uniform1f(
          shorelineDistanceRangeLocation,
          chunkResource.data.shorelineDistanceRange
        );
        gl.uniform4f(
          shorelineDistanceBoundsLocation,
          chunkResource.data.sampleBounds.minU,
          chunkResource.data.sampleBounds.minV,
          chunkResource.data.sampleBounds.maxU - chunkResource.data.sampleBounds.minU,
          chunkResource.data.sampleBounds.maxV - chunkResource.data.sampleBounds.minV
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
        gl.drawElements(
          gl.TRIANGLES,
          chunkResource.data.mesh.indices.length,
          gl.UNSIGNED_INT,
          0
        );
      };

      for (const chunkResource of chunkResourcesByKey.values()) {
        drawTerrainChunkResource(chunkResource);
      }
    }

    if (renderTerrain && vegetationAsset != null && vegetationCells.length > 0) {
      const terrainMatrix = createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1));
      const avoidancePoints = readCampaignVegetationAvoidancePoints(
        input.canvas,
        vegetationAsset.rules
      );
      const vegetationMeshSignature = getCampaignVegetationMeshSignature(
        input.canvas,
        currentCamera,
        avoidancePoints
      );
      if (vegetationMesh == null || vegetationMeshSignature !== lastVegetationMeshSignature) {
        vegetationMesh = createCampaignVegetationMesh({
          cells: getCampaignVegetationCellsForChunks(
            vegetationCells,
            chunkDataByKey
          ),
          asset: vegetationAsset,
          sampleHeightAtUv,
          matrix: terrainMatrix,
          canvasWidth: input.canvas.width,
          canvasHeight: input.canvas.height,
          avoidancePoints,
          onVariantMeshNeeded: (variant) => {
            ensureCampaignVegetationVariantMesh(vegetationAsset, variant, () => {
              lastVegetationMeshSignature = "";
              requestRender("static");
            });
          },
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, vegetationVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vegetationMesh.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vegetationIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vegetationMesh.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, vegetationShadowVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vegetationMesh.shadowVertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vegetationShadowIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vegetationMesh.shadowIndices, gl.DYNAMIC_DRAW);
        lastVegetationMeshSignature = vegetationMeshSignature;
      }

      if (vegetationMesh.instanceCount > 0 && vegetationMesh.indices.length > 0) {
        if (vegetationMesh.shadowIndices.length > 0) {
          gl.useProgram(vegetationShadowProgram);
          gl.bindBuffer(gl.ARRAY_BUFFER, vegetationShadowVertexBuffer);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vegetationShadowIndexBuffer);
          const shadowStride = 5 * Float32Array.BYTES_PER_ELEMENT;
          gl.enableVertexAttribArray(vegetationShadowPositionLocation);
          gl.vertexAttribPointer(
            vegetationShadowPositionLocation,
            3,
            gl.FLOAT,
            false,
            shadowStride,
            0
          );
          gl.enableVertexAttribArray(vegetationShadowUvLocation);
          gl.vertexAttribPointer(
            vegetationShadowUvLocation,
            2,
            gl.FLOAT,
            false,
            shadowStride,
            3 * Float32Array.BYTES_PER_ELEMENT
          );
          gl.uniformMatrix4fv(vegetationShadowMatrixLocation, false, terrainMatrix);
          gl.uniform1f(
            vegetationShadowOpacityLocation,
            vegetationAsset.rules.shadow.opacity
          );
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          gl.depthMask(false);
          gl.drawElements(
            gl.TRIANGLES,
            vegetationMesh.shadowIndices.length,
            gl.UNSIGNED_INT,
            0
          );
          gl.depthMask(true);
          gl.disable(gl.BLEND);
        }

        gl.useProgram(vegetationProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, vegetationVertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vegetationIndexBuffer);
        const vegetationStride = 9 * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(vegetationPositionLocation);
        gl.vertexAttribPointer(
          vegetationPositionLocation,
          3,
          gl.FLOAT,
          false,
          vegetationStride,
          0
        );
        gl.enableVertexAttribArray(vegetationNormalLocation);
        gl.vertexAttribPointer(
          vegetationNormalLocation,
          3,
          gl.FLOAT,
          false,
          vegetationStride,
          3 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(vegetationColorLocation);
        gl.vertexAttribPointer(
          vegetationColorLocation,
          3,
          gl.FLOAT,
          false,
          vegetationStride,
          6 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.uniformMatrix4fv(vegetationMatrixLocation, false, terrainMatrix);
        gl.uniform2f(
          vegetationCameraTiltSinCosLocation,
          Math.sin(terrainCameraTilt),
          Math.cos(terrainCameraTilt)
        );
        gl.uniform1f(vegetationAmbientLocation, vegetationAsset.rules.shader.ambient);
        gl.uniform1f(
          vegetationDirectionalLocation,
          vegetationAsset.rules.shader.directional
        );
        gl.uniform2f(
          vegetationViewportSizeLocation,
          input.canvas.width,
          input.canvas.height
        );
        gl.uniform1f(vegetationCameraLightHeightLocation, TERRAIN_CAMERA_LIGHT_HEIGHT);
        gl.uniform1f(
          vegetationCameraLightHorizontalPullLocation,
          TERRAIN_CAMERA_LIGHT_HORIZONTAL_PULL
        );
        gl.uniform1f(
          vegetationTerrainDirectionalLightStrengthLocation,
          TERRAIN_DIRECTIONAL_LIGHT_STRENGTH
        );
        gl.uniform1f(
          vegetationTerrainBackShadowStrengthLocation,
          TERRAIN_BACK_SHADOW_STRENGTH
        );
        gl.uniform1f(
          vegetationTerrainSteepShadowStrengthLocation,
          TERRAIN_STEEP_SHADOW_STRENGTH
        );
        gl.disable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(-4, -8);
        gl.depthMask(true);
        gl.drawElements(gl.TRIANGLES, vegetationMesh.indices.length, gl.UNSIGNED_INT, 0);
        gl.disable(gl.POLYGON_OFFSET_FILL);
      }
    }

    if (renderTerrain && cityDepthAsset != null && cityDepthTexture != null) {
      const cityDepthMeshTransform = readCampaignCityDepthMeshTransform(input.canvas);
      const cityDepthMeshSignature = getCampaignCityDepthMeshTransformSignature(
        cityDepthMeshTransform
      );
      if (cityDepthMesh == null || cityDepthMeshSignature !== lastCityDepthMeshSignature) {
        cityDepthMesh = createCityDepthMesh(
          cityDepthAsset,
          sampleHeightAtUv,
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
      const actorHeight = sampleHeightAtUv(actor.u, actor.v);
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

    if (animatesTerrainWater || animatesActorModel || animatesVegetation) {
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
    sampleHeightAtUv,
    dispose: () => {
      isDisposed = true;
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
      if (dynamicAnimationTimeoutId != null) {
        window.clearTimeout(dynamicAnimationTimeoutId);
      }

      window.removeEventListener("resize", handleResize);
      for (const chunkResource of chunkResourcesByKey.values()) {
        gl.deleteBuffer(chunkResource.vertexBuffer);
        gl.deleteBuffer(chunkResource.indexBuffer);
        gl.deleteTexture(chunkResource.shorelineTexture);
      }
      chunkResourcesByKey.clear();
      gl.deleteBuffer(actorVertexBuffer);
      gl.deleteBuffer(actorIndexBuffer);
      gl.deleteBuffer(cityDepthVertexBuffer);
      gl.deleteBuffer(cityDepthIndexBuffer);
      gl.deleteBuffer(vegetationVertexBuffer);
      gl.deleteBuffer(vegetationIndexBuffer);
      gl.deleteBuffer(vegetationShadowVertexBuffer);
      gl.deleteBuffer(vegetationShadowIndexBuffer);
      gl.deleteTexture(texture);
      gl.deleteTexture(materialTexture);
      gl.deleteTexture(materialSemanticTexture);
      gl.deleteTexture(grassTexture);
      gl.deleteTexture(sandTexture);
      gl.deleteTexture(rockTexture);
      gl.deleteTexture(snowTexture);
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
      gl.deleteProgram(vegetationProgram);
      gl.deleteProgram(vegetationShadowProgram);
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

function getCampaignTerrainSemanticData(input: {
  input: CampaignTerrainInput;
  materialImage: HTMLImageElement;
  campaignHexGrid: CampaignHexGridAsset | null;
}): Promise<CampaignTerrainSemanticData> {
  const signature = getCampaignTerrainSemanticDataSignature(input.input);
  const cachedData = campaignTerrainSemanticDataCache.get(signature);
  if (cachedData != null) {
    return cachedData;
  }

  const dataPromise = Promise.resolve().then(() =>
    createCampaignTerrainSemanticData(input)
  );
  campaignTerrainSemanticDataCache.set(signature, dataPromise);
  dataPromise.catch(() => {
    if (campaignTerrainSemanticDataCache.get(signature) === dataPromise) {
      campaignTerrainSemanticDataCache.delete(signature);
    }
  });

  return dataPromise;
}

function getCampaignTerrainSemanticDataSignature(input: CampaignTerrainInput): string {
  return [
    input.materialUrl,
    input.campaignHexGridUrl ?? "",
  ].join("|");
}

function createCampaignTerrainSemanticData(input: {
  input: CampaignTerrainInput;
  materialImage: HTMLImageElement;
  campaignHexGrid: CampaignHexGridAsset | null;
}): CampaignTerrainSemanticData {
  const materialLandMask =
    input.campaignHexGrid == null ? sampleMaterialLandMask(input.materialImage) : null;
  const materialSemanticModel =
    input.campaignHexGrid != null
      ? createCampaignMaterialSemanticModelFromHexGrid(input.campaignHexGrid)
      : createCampaignMaterialSemanticModel(
        materialLandMask?.landMask ?? new Uint8Array(0),
        materialLandMask?.columns ?? 1,
        materialLandMask?.rows ?? 1
      );

  return {
    materialSemanticModel,
    travelGrid: createHexTravelGrid(materialSemanticModel),
  };
}

function getCampaignTerrainChunkKey(chunk: CampaignTerrainChunkCoordinate): string {
  return `${chunk.x},${chunk.y}`;
}

function getCampaignTerrainChunkForHexCell(cell: GridCoordinate): CampaignTerrainChunkCoordinate {
  return {
    x: Math.floor(cell.x / CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE),
    y: Math.floor(cell.y / CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE),
  };
}

function getCampaignTerrainHexCellAtUv(u: number, v: number): GridCoordinate {
  const point = terrainUvToHexPoint(u, v);
  return pixelToRoundedHex(point.x, point.y);
}

function getCampaignTerrainChunkForUv(u: number, v: number): CampaignTerrainChunkCoordinate {
  return getCampaignTerrainChunkForHexCell(getCampaignTerrainHexCellAtUv(u, v));
}

function getCampaignTerrainFocusCell(canvas: HTMLCanvasElement): GridCoordinate {
  const actor = readCampaignActorData(canvas);
  return getCampaignTerrainHexCellAtUv(actor?.u ?? 0.5, actor?.v ?? 0.5);
}

function getCampaignTerrainChunkKeysAroundCell(
  centerCell: GridCoordinate,
  radiusHex: number
): string[] {
  const minCellX = centerCell.x - radiusHex;
  const maxCellX = centerCell.x + radiusHex;
  const minCellY = centerCell.y - radiusHex;
  const maxCellY = centerCell.y + radiusHex;
  const minChunkX = Math.floor(minCellX / CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE);
  const maxChunkX = Math.floor(maxCellX / CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE);
  const minChunkY = Math.floor(minCellY / CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE);
  const maxChunkY = Math.floor(maxCellY / CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE);
  const keys: string[] = [];

  for (let chunkY = minChunkY; chunkY <= maxChunkY; chunkY += 1) {
    for (let chunkX = minChunkX; chunkX <= maxChunkX; chunkX += 1) {
      keys.push(getCampaignTerrainChunkKey({ x: chunkX, y: chunkY }));
    }
  }

  return keys;
}

function parseCampaignTerrainChunkKey(key: string): CampaignTerrainChunkCoordinate {
  const [xText, yText] = key.split(",");
  return {
    x: Number(xText) || 0,
    y: Number(yText) || 0,
  };
}

function getCampaignTerrainChunkCacheKey(input: {
  input: CampaignTerrainInput;
  chunkKey: string;
  beachTuning: CampaignTerrainBeachTuning;
}): string {
  return [
    CAMPAIGN_TERRAIN_CHUNK_ALGORITHM_VERSION,
    getCampaignTerrainInputSignature(input.input),
    input.chunkKey,
    GRID_COLUMNS,
    GRID_ROWS,
    CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE,
    getShorelineDistanceTextureSignature(input.beachTuning),
  ].join("|");
}

function getCampaignTerrainChunkData(input: {
  input: CampaignTerrainInput;
  semanticData: CampaignTerrainSemanticData;
  chunkKey: string;
  beachTuning: CampaignTerrainBeachTuning;
}): Promise<CampaignTerrainChunkData> {
  const cacheKey = getCampaignTerrainChunkCacheKey({
    input: input.input,
    chunkKey: input.chunkKey,
    beachTuning: input.beachTuning,
  });
  const memoryKey = cacheKey;
  const cached = campaignTerrainChunkDataCache.get(memoryKey);
  if (cached != null) {
    return cached;
  }

  const promise = readCampaignTerrainChunkFromPersistentCache(cacheKey).then((cachedChunk) => {
    if (cachedChunk != null) {
      return cachedChunk;
    }

    const chunk = createCampaignTerrainChunkData({
      input: input.input,
      semanticData: input.semanticData,
      chunkKey: input.chunkKey,
      cacheKey,
      beachTuning: input.beachTuning,
    });
    void writeCampaignTerrainChunkToPersistentCache(chunk);
    return chunk;
  });
  campaignTerrainChunkDataCache.set(memoryKey, promise);
  promise.catch(() => {
    if (campaignTerrainChunkDataCache.get(memoryKey) === promise) {
      campaignTerrainChunkDataCache.delete(memoryKey);
    }
  });

  return promise;
}

function createCampaignTerrainChunkData(input: {
  input: CampaignTerrainInput;
  semanticData: CampaignTerrainSemanticData;
  chunkKey: string;
  cacheKey: string;
  beachTuning: CampaignTerrainBeachTuning;
}): CampaignTerrainChunkData {
  const chunk = parseCampaignTerrainChunkKey(input.chunkKey);
  const sampleGrid = createCampaignTerrainChunkGrid(
    chunk,
    CAMPAIGN_TERRAIN_CHUNK_PADDING_HEX
  );
  const meshGrid = createCampaignTerrainChunkGrid(chunk, 0);
  const sampleBounds = sampleGrid.bounds;
  const meshBounds = meshGrid.bounds;
  const columns = sampleGrid.columns;
  const rows = sampleGrid.rows;
  const heights = createCampaignTerrainChunkHeightSamples(
    input.semanticData.materialSemanticModel,
    sampleBounds,
    columns,
    rows
  );
  const mesh = createSmoothTerrainChunkMesh(
    heights,
    columns,
    rows,
    sampleBounds,
    meshBounds,
    meshGrid.columns,
    meshGrid.rows,
    chunk
  );
  const shoreline = createShorelineDistanceTextureModel(
    input.semanticData.materialSemanticModel,
    input.beachTuning,
    {
      bounds: sampleBounds,
      textureColumns: columns,
      textureRows: rows,
    }
  );

  return {
    key: input.chunkKey,
    cacheKey: input.cacheKey,
    chunkX: chunk.x,
    chunkY: chunk.y,
    meshBounds,
    sampleBounds,
    columns,
    rows,
    heights,
    mesh,
    shorelineSource: shoreline.source,
    shorelineDistanceRange: shoreline.distanceRange,
    shorelineSignature: shoreline.signature,
  };
}

function createCampaignTerrainChunkGrid(
  chunk: CampaignTerrainChunkCoordinate,
  paddingHex: number
): CampaignTerrainChunkGrid {
  const rawBounds = createCampaignTerrainChunkUvBounds(chunk, paddingHex);
  const maxColumn = GRID_COLUMNS - 1;
  const maxRow = GRID_ROWS - 1;
  const columnRange = expandCampaignTerrainGridRange(
    Math.floor(rawBounds.minU * maxColumn),
    Math.ceil(rawBounds.maxU * maxColumn),
    CAMPAIGN_TERRAIN_CHUNK_MIN_COLUMNS,
    maxColumn
  );
  const rowRange = expandCampaignTerrainGridRange(
    Math.floor(rawBounds.minV * maxRow),
    Math.ceil(rawBounds.maxV * maxRow),
    CAMPAIGN_TERRAIN_CHUNK_MIN_ROWS,
    maxRow
  );

  return {
    bounds: {
      minU: columnRange.min / Math.max(maxColumn, 1),
      maxU: columnRange.max / Math.max(maxColumn, 1),
      minV: rowRange.min / Math.max(maxRow, 1),
      maxV: rowRange.max / Math.max(maxRow, 1),
    },
    columns: columnRange.max - columnRange.min + 1,
    rows: rowRange.max - rowRange.min + 1,
  };
}

function expandCampaignTerrainGridRange(
  rawMin: number,
  rawMax: number,
  minSize: number,
  maxIndex: number
): { min: number; max: number } {
  let min = clamp(Math.min(rawMin, rawMax), 0, maxIndex);
  let max = clamp(Math.max(rawMin, rawMax), 0, maxIndex);

  while (max - min + 1 < minSize) {
    if (min > 0) {
      min -= 1;
    }
    if (max - min + 1 >= minSize) {
      break;
    }
    if (max < maxIndex) {
      max += 1;
    }
    if (min === 0 && max === maxIndex) {
      break;
    }
  }

  return { min, max };
}

function createCampaignTerrainChunkUvBounds(
  chunk: CampaignTerrainChunkCoordinate,
  paddingHex: number
): CampaignTerrainChunkBounds {
  const minCellX = chunk.x * CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE - paddingHex;
  const minCellY = chunk.y * CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE - paddingHex;
  const maxCellX =
    (chunk.x + 1) * CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE - 1 + paddingHex;
  const maxCellY =
    (chunk.y + 1) * CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE - 1 + paddingHex;
  let minU = 1;
  let maxU = 0;
  let minV = 1;
  let maxV = 0;

  for (let y = minCellY; y <= maxCellY; y += 1) {
    for (let x = minCellX; x <= maxCellX; x += 1) {
      const center = hexToPixel(x, y);
      const radiusX = Math.sqrt(3) * 0.5;
      const radiusY = 1;
      minU = Math.min(minU, hexPointToTerrainU(center.x - radiusX));
      maxU = Math.max(maxU, hexPointToTerrainU(center.x + radiusX));
      minV = Math.min(minV, hexPointToTerrainV(center.y - radiusY));
      maxV = Math.max(maxV, hexPointToTerrainV(center.y + radiusY));
    }
  }

  return {
    minU: clamp(minU, 0, 1),
    maxU: clamp(maxU, 0, 1),
    minV: clamp(minV, 0, 1),
    maxV: clamp(maxV, 0, 1),
  };
}

function createCampaignTerrainChunkHeightSamples(
  materialSemanticModel: CampaignMaterialSemanticModel,
  bounds: CampaignTerrainChunkBounds,
  columns: number,
  rows: number
): Float32Array {
  const heights = new Float32Array(columns * rows);

  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      const index = y * columns + x;
      heights[index] = createCampaignTerrainChunkHeightAtPoint(
        materialSemanticModel,
        point,
        cell
      );
    }
  }

  return smoothCampaignTerrainChunkHeightSamples(
    heights,
    columns,
    rows,
    bounds,
    materialSemanticModel
  );
}

function createCampaignTerrainChunkHeightAtPoint(
  materialSemanticModel: CampaignMaterialSemanticModel,
  point: { x: number; y: number },
  cell: GridCoordinate
): number {
  if (!isLandTerrainHexCell(materialSemanticModel, cell)) {
    return 0;
  }

  const referenceHeight = getCampaignTerrainReferenceHeightForCell(
    materialSemanticModel,
    cell
  );
  if (!isMountainHexCell(materialSemanticModel, cell)) {
    const localFrame = getHexLocalMountainFrame(point, cell);
    const interiorAmount =
      1 - smoothstepRange(
        NON_MOUNTAIN_HEIGHT_EDGE_FADE_START,
        NON_MOUNTAIN_HEIGHT_EDGE_FADE_END,
        localFrame.hexRadius
      );
    const localNoise =
      (valueNoise2d(point.x * 0.34 + 5.7, point.y * 0.34 - 8.9) - 0.5) *
      0.012 *
      (1 - interiorAmount * NON_MOUNTAIN_HEIGHT_FLATTEN_STRENGTH);

    return clamp(referenceHeight + localNoise, 0, 1);
  }

  const terrainBaseHeight = getCampaignTerrainMountainFloorHeightForCell(
    materialSemanticModel,
    cell
  );
  const boundaryFactor = getMountainBoundaryHeightFactor(
    materialSemanticModel,
    point,
    cell
  );

  return createMountainHeightAtPoint(
    point,
    terrainBaseHeight,
    referenceHeight,
    boundaryFactor
  );
}

function smoothCampaignTerrainChunkHeightSamples(
  heights: Float32Array,
  columns: number,
  rows: number,
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  let current = heights;

  for (let pass = 0; pass < 2; pass += 1) {
    const smoothed = new Float32Array(current);
    const maxX = Math.max(columns - 1, 0);
    const maxY = Math.max(rows - 1, 0);
    for (let y = 0; y < rows; y += 1) {
      const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
      for (let x = 0; x < columns; x += 1) {
        const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
        if (!isLandTerrainSample(materialSemanticModel, u, v)) {
          smoothed[y * columns + x] = 0;
          continue;
        }

        const center = current[y * columns + x] ?? 0;
        let sum = 0;
        let weight = 0;
        for (const sample of SMOOTH_TERRAIN_KERNEL) {
          const sampleX = clamp(x + sample.x, 0, maxX);
          const sampleY = clamp(y + sample.y, 0, maxY);
          const sampleU = getCampaignTerrainChunkSampleU(bounds, columns, sampleX);
          const sampleV = getCampaignTerrainChunkSampleV(bounds, rows, sampleY);
          if (!isLandTerrainSample(materialSemanticModel, sampleU, sampleV)) {
            continue;
          }
          sum += (current[sampleY * columns + sampleX] ?? center) * sample.weight;
          weight += sample.weight;
        }
        if (weight > 0) {
          smoothed[y * columns + x] = center + (sum / weight - center) * 0.24;
        }
      }
    }
    current = smoothed;
  }

  return current;
}

function getCampaignTerrainReferenceHeightForCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate
): number {
  return materialSemanticModel.referenceHeightByCellKey.get(getHexCellKey(cell.x, cell.y)) ?? 0;
}

function getCampaignTerrainMountainFloorHeightForCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate
): number {
  let heightSum = 0;
  let heightWeight = 0;

  for (let radius = 1; radius <= 4; radius += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const distance = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dx + dy));
        if (distance !== radius) {
          continue;
        }

        const sampleCell = { x: cell.x + dx, y: cell.y + dy };
        if (!isNonMountainTerrainHexCell(materialSemanticModel, sampleCell)) {
          continue;
        }

        const weight = 1 / radius;
        heightSum += getCampaignTerrainReferenceHeightForCell(
          materialSemanticModel,
          sampleCell
        ) * weight;
        heightWeight += weight;
      }
    }

    if (heightWeight > 0) {
      break;
    }
  }

  if (heightWeight > 0) {
    return heightSum / heightWeight;
  }

  return getCampaignTerrainReferenceHeightForCell(materialSemanticModel, cell) * 0.42;
}

function getCampaignTerrainChunkSampleU(
  bounds: CampaignTerrainChunkBounds,
  columns: number,
  x: number
): number {
  return bounds.minU + (bounds.maxU - bounds.minU) * (x / Math.max(columns - 1, 1));
}

function getCampaignTerrainChunkSampleV(
  bounds: CampaignTerrainChunkBounds,
  rows: number,
  y: number
): number {
  return bounds.minV + (bounds.maxV - bounds.minV) * (y / Math.max(rows - 1, 1));
}

function createSmoothTerrainChunkMesh(
  heights: Float32Array,
  columns: number,
  rows: number,
  sampleBounds: CampaignTerrainChunkBounds,
  meshBounds: CampaignTerrainChunkBounds,
  meshColumns: number,
  meshRows: number,
  chunk: CampaignTerrainChunkCoordinate
): MeshData {
  const vertices: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row < meshRows; row += 1) {
    const v = getCampaignTerrainChunkSampleV(meshBounds, meshRows, row);
    for (let column = 0; column < meshColumns; column += 1) {
      const u = getCampaignTerrainChunkSampleU(meshBounds, meshColumns, column);
      addSmoothTerrainVertex(
        vertices,
        u,
        v,
        sampleHeightAtChunkBounds(heights, columns, rows, sampleBounds, u, v),
        createSmoothTerrainChunkNormal(heights, columns, rows, sampleBounds, u, v)
      );
    }
  }

  for (let row = 0; row < meshRows - 1; row += 1) {
    for (let column = 0; column < meshColumns - 1; column += 1) {
      if (
        !isCampaignTerrainChunkMeshQuadOwnedByChunk(
          meshBounds,
          meshColumns,
          meshRows,
          column,
          row,
          chunk
        )
      ) {
        continue;
      }

      const topLeft = row * meshColumns + column;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + meshColumns;
      const bottomRight = bottomLeft + 1;
      indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
  };
}

function isCampaignTerrainChunkMeshQuadOwnedByChunk(
  bounds: CampaignTerrainChunkBounds,
  columns: number,
  rows: number,
  column: number,
  row: number,
  chunk: CampaignTerrainChunkCoordinate
): boolean {
  const centerU =
    (getCampaignTerrainChunkSampleU(bounds, columns, column) +
      getCampaignTerrainChunkSampleU(bounds, columns, column + 1)) *
    0.5;
  const centerV =
    (getCampaignTerrainChunkSampleV(bounds, rows, row) +
      getCampaignTerrainChunkSampleV(bounds, rows, row + 1)) *
    0.5;
  const owner = getCampaignTerrainChunkForUv(centerU, centerV);
  return owner.x === chunk.x && owner.y === chunk.y;
}

function sampleHeightAtChunkBounds(
  heights: Float32Array,
  columns: number,
  rows: number,
  bounds: CampaignTerrainChunkBounds,
  u: number,
  v: number
): number {
  const localU = (clamp(u, bounds.minU, bounds.maxU) - bounds.minU) /
    Math.max(bounds.maxU - bounds.minU, 0.000001);
  const localV = (clamp(v, bounds.minV, bounds.maxV) - bounds.minV) /
    Math.max(bounds.maxV - bounds.minV, 0.000001);

  return sampleHeightAt(heights, columns, rows, localU, localV);
}

function createSmoothTerrainChunkNormal(
  heights: Float32Array,
  columns: number,
  rows: number,
  bounds: CampaignTerrainChunkBounds,
  u: number,
  v: number
): [number, number, number] {
  const deltaU = TERRAIN_NORMAL_SAMPLE_RADIUS_PIXELS / Math.max(GRID_COLUMNS - 1, 1);
  const deltaV = TERRAIN_NORMAL_SAMPLE_RADIUS_PIXELS / Math.max(GRID_ROWS - 1, 1);
  const leftHeight = sampleSmoothedHeightAtChunkBounds(
    heights,
    columns,
    rows,
    bounds,
    u - deltaU,
    v
  );
  const rightHeight = sampleSmoothedHeightAtChunkBounds(
    heights,
    columns,
    rows,
    bounds,
    u + deltaU,
    v
  );
  const topHeight = sampleSmoothedHeightAtChunkBounds(
    heights,
    columns,
    rows,
    bounds,
    u,
    v - deltaV
  );
  const bottomHeight = sampleSmoothedHeightAtChunkBounds(
    heights,
    columns,
    rows,
    bounds,
    u,
    v + deltaV
  );
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

function sampleSmoothedHeightAtChunkBounds(
  heights: Float32Array,
  columns: number,
  rows: number,
  bounds: CampaignTerrainChunkBounds,
  u: number,
  v: number
): number {
  const radiusU = TERRAIN_NORMAL_SMOOTH_RADIUS_PIXELS / Math.max(GRID_COLUMNS - 1, 1);
  const radiusV = TERRAIN_NORMAL_SMOOTH_RADIUS_PIXELS / Math.max(GRID_ROWS - 1, 1);
  const center = sampleHeightAtChunkBounds(heights, columns, rows, bounds, u, v);
  const horizontal =
    sampleHeightAtChunkBounds(heights, columns, rows, bounds, u - radiusU, v) +
    sampleHeightAtChunkBounds(heights, columns, rows, bounds, u + radiusU, v);
  const vertical =
    sampleHeightAtChunkBounds(heights, columns, rows, bounds, u, v - radiusV) +
    sampleHeightAtChunkBounds(heights, columns, rows, bounds, u, v + radiusV);
  const diagonal =
    sampleHeightAtChunkBounds(heights, columns, rows, bounds, u - radiusU, v - radiusV) +
    sampleHeightAtChunkBounds(heights, columns, rows, bounds, u + radiusU, v - radiusV) +
    sampleHeightAtChunkBounds(heights, columns, rows, bounds, u - radiusU, v + radiusV) +
    sampleHeightAtChunkBounds(heights, columns, rows, bounds, u + radiusU, v + radiusV);

  return (center * 4 + horizontal * 2 + vertical * 2 + diagonal) / 16;
}

function sampleHeightFromCampaignTerrainChunks(input: {
  materialSemanticModel: CampaignMaterialSemanticModel;
  chunksByKey: Map<string, CampaignTerrainChunkData>;
  u: number;
  v: number;
}): number {
  const chunkKey = getCampaignTerrainChunkKey(getCampaignTerrainChunkForUv(input.u, input.v));
  const chunk = input.chunksByKey.get(chunkKey);
  if (chunk != null) {
    return sampleHeightAtChunkBounds(
      chunk.heights,
      chunk.columns,
      chunk.rows,
      chunk.sampleBounds,
      input.u,
      input.v
    );
  }

  const cell = getCampaignTerrainHexCellAtUv(input.u, input.v);
  if (!isLandTerrainHexCell(input.materialSemanticModel, cell)) {
    return 0;
  }

  return getCampaignTerrainReferenceHeightForCell(input.materialSemanticModel, cell);
}

type SerializedCampaignTerrainChunkData = {
  key: string;
  cacheKey: string;
  chunkX: number;
  chunkY: number;
  meshBounds: CampaignTerrainChunkBounds;
  sampleBounds: CampaignTerrainChunkBounds;
  columns: number;
  rows: number;
  heights: Float32Array;
  meshVertices: Float32Array;
  meshIndices: Uint32Array;
  shorelinePixels: Uint8ClampedArray;
  shorelineColumns: number;
  shorelineRows: number;
  shorelineDistanceRange: number;
  shorelineSignature: string;
};

function serializeCampaignTerrainChunkData(
  data: CampaignTerrainChunkData
): SerializedCampaignTerrainChunkData {
  return {
    key: data.key,
    cacheKey: data.cacheKey,
    chunkX: data.chunkX,
    chunkY: data.chunkY,
    meshBounds: data.meshBounds,
    sampleBounds: data.sampleBounds,
    columns: data.columns,
    rows: data.rows,
    heights: data.heights,
    meshVertices: data.mesh.vertices,
    meshIndices: data.mesh.indices,
    shorelinePixels: new Uint8ClampedArray(data.shorelineSource.data),
    shorelineColumns: data.shorelineSource.width,
    shorelineRows: data.shorelineSource.height,
    shorelineDistanceRange: data.shorelineDistanceRange,
    shorelineSignature: data.shorelineSignature,
  };
}

function deserializeCampaignTerrainChunkData(
  data: SerializedCampaignTerrainChunkData
): CampaignTerrainChunkData {
  return {
    key: data.key,
    cacheKey: data.cacheKey,
    chunkX: data.chunkX,
    chunkY: data.chunkY,
    meshBounds: data.meshBounds,
    sampleBounds: data.sampleBounds,
    columns: data.columns,
    rows: data.rows,
    heights: data.heights,
    mesh: {
      vertices: data.meshVertices,
      indices: data.meshIndices,
    },
    shorelineSource: new ImageData(
      new Uint8ClampedArray(data.shorelinePixels),
      data.shorelineColumns,
      data.shorelineRows
    ),
    shorelineDistanceRange: data.shorelineDistanceRange,
    shorelineSignature: data.shorelineSignature,
  };
}

function openCampaignTerrainChunkCacheDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }
  if (campaignTerrainChunkCacheDbPromise != null) {
    return campaignTerrainChunkCacheDbPromise;
  }

  campaignTerrainChunkCacheDbPromise = new Promise((resolve) => {
    const request = indexedDB.open(CAMPAIGN_TERRAIN_CHUNK_CACHE_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CAMPAIGN_TERRAIN_CHUNK_CACHE_STORE_NAME)) {
        db.createObjectStore(CAMPAIGN_TERRAIN_CHUNK_CACHE_STORE_NAME, {
          keyPath: "cacheKey",
        });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });

  return campaignTerrainChunkCacheDbPromise;
}

async function readCampaignTerrainChunkFromPersistentCache(
  cacheKey: string
): Promise<CampaignTerrainChunkData | null> {
  const db = await openCampaignTerrainChunkCacheDb();
  if (db == null) {
    return null;
  }

  return new Promise((resolve) => {
    const transaction = db.transaction(CAMPAIGN_TERRAIN_CHUNK_CACHE_STORE_NAME, "readonly");
    const store = transaction.objectStore(CAMPAIGN_TERRAIN_CHUNK_CACHE_STORE_NAME);
    const request = store.get(cacheKey);
    request.onsuccess = () => {
      const result = request.result as SerializedCampaignTerrainChunkData | undefined;
      resolve(result == null ? null : deserializeCampaignTerrainChunkData(result));
    };
    request.onerror = () => resolve(null);
  });
}

async function writeCampaignTerrainChunkToPersistentCache(
  data: CampaignTerrainChunkData
): Promise<void> {
  const db = await openCampaignTerrainChunkCacheDb();
  if (db == null) {
    return;
  }

  await new Promise<void>((resolve) => {
    const transaction = db.transaction(CAMPAIGN_TERRAIN_CHUNK_CACHE_STORE_NAME, "readwrite");
    const store = transaction.objectStore(CAMPAIGN_TERRAIN_CHUNK_CACHE_STORE_NAME);
    const request = store.put(serializeCampaignTerrainChunkData(data));
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
  });
}

async function loadCampaignVegetationAsset(
  rulesUrl: string
): Promise<CampaignVegetationAsset> {
  const rules = await loadJson<CampaignVegetationRulesDefinition>(rulesUrl);
  validateCampaignVegetationRules(rules);
  const normalizedRules: CampaignVegetationRulesAsset = {
    ...rules,
    variants: rules.variants.map((variant) => ({
      ...variant,
      meshUrl: resolveAssetUrl(variant.meshUrl, rulesUrl),
    })),
  };

  return {
    rules: normalizedRules,
    meshesById: new Map(),
    meshPromisesById: new Map(),
    failedMeshIds: new Set(),
  };
}

async function loadCampaignVegetationMeshAsset(
  meshUrl: string
): Promise<VegetationMeshAsset> {
  const mesh = await loadJson<CampaignVegetationMeshDefinition>(meshUrl);
  validateCampaignVegetationMesh(mesh);

  return {
    id: mesh.id,
    positions: new Float32Array(mesh.positions),
    normals: new Float32Array(mesh.normals),
    colors: new Float32Array(mesh.colors),
    indices: new Uint32Array(mesh.indices),
    bounds: mesh.bounds,
  };
}

function ensureCampaignVegetationVariantMesh(
  asset: CampaignVegetationAsset,
  variant: CampaignVegetationRulesAsset["variants"][number],
  onLoaded: () => void
): void {
  if (
    asset.meshesById.has(variant.id) ||
    asset.meshPromisesById.has(variant.id) ||
    asset.failedMeshIds.has(variant.id)
  ) {
    return;
  }

  const promise = loadCampaignVegetationMeshAsset(variant.meshUrl)
    .then((mesh) => {
      asset.meshesById.set(variant.id, mesh);
      onLoaded();
      return mesh;
    })
    .catch((error: unknown) => {
      asset.failedMeshIds.add(variant.id);
      console.error(
        `Failed to load campaign vegetation mesh "${variant.id}".`,
        error
      );
      return null;
    })
    .finally(() => {
      asset.meshPromisesById.delete(variant.id);
    });

  asset.meshPromisesById.set(variant.id, promise);
}

function resolveAssetUrl(value: string, baseUrl: string): string {
  if (/^(https?:|file:|blob:|\/)/.test(value)) {
    return value;
  }
  return new URL(value, baseUrl).href;
}

function validateCampaignVegetationRules(
  rules: CampaignVegetationRulesDefinition
): void {
  if (rules.format !== "campaign-vegetation-rules-v1") {
    throw new Error(`Unsupported campaign vegetation rules format "${rules.format}".`);
  }
  if (rules.environment === "" || rules.variants.length === 0) {
    throw new Error("Campaign vegetation rules must declare an environment and variants.");
  }
}

function validateCampaignVegetationMesh(mesh: CampaignVegetationMeshDefinition): void {
  if (mesh.format !== "campaign-vegetation-mesh-v1") {
    throw new Error(`Unsupported campaign vegetation mesh format "${mesh.format}".`);
  }
  if (
    mesh.positions.length % 3 !== 0 ||
    mesh.normals.length !== mesh.positions.length ||
    mesh.colors.length !== mesh.positions.length ||
    mesh.indices.length % 3 !== 0
  ) {
    throw new Error(`Campaign vegetation mesh "${mesh.id}" arrays are inconsistent.`);
  }
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
  sampleHeightAtUv: (u: number, v: number) => number,
  transform: CampaignCityDepthMeshTransform
): CityDepthMeshData {
  const snappedCenter = snapTerrainUvToHexCenter(asset.u, asset.v);
  const terrainHeight = sampleHeightAtUv(snappedCenter.u, snappedCenter.v);
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

function sampleHeightImageFromRequiredImage(
  image: HTMLImageElement | null,
  columns: number,
  rows: number
): Float32Array {
  if (image == null) {
    throw new Error("Campaign height image is required for maps without a hex grid.");
  }

  return sampleHeightImage(image, columns, rows);
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
  const mountainByCellKey = new Map<string, boolean>();
  const referenceHeightByCellKey = new Map<string, number>();

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
    mountainByCellKey.set(getHexCellKey(cell.x, cell.y), false);
    referenceHeightByCellKey.set(getHexCellKey(cell.x, cell.y), 0);
    pixels[pixelOffset] = value;
    pixels[pixelOffset + 1] = 0;
    pixels[pixelOffset + 2] = 0;
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
    mountainByCellKey,
    referenceHeightByCellKey,
  };
}

function createCampaignMaterialSemanticModelFromHexGrid(
  campaignHexGrid: CampaignHexGridAsset
): CampaignMaterialSemanticModel {
  if (campaignHexGrid.format !== "campaign-hex-grid-v1") {
    throw new Error(`Unsupported campaign hex grid format "${campaignHexGrid.format}".`);
  }

  const cells = campaignHexGrid.cells.map((cell) => ({ x: cell.x, y: cell.y }));
  const minCellX =
    cells.length > 0 ? Math.min(...cells.map((cell) => cell.x)) : campaignHexGrid.bounds.minX;
  const maxCellX =
    cells.length > 0 ? Math.max(...cells.map((cell) => cell.x)) : campaignHexGrid.bounds.maxX;
  const minCellY =
    cells.length > 0 ? Math.min(...cells.map((cell) => cell.y)) : campaignHexGrid.bounds.minY;
  const maxCellY =
    cells.length > 0 ? Math.max(...cells.map((cell) => cell.y)) : campaignHexGrid.bounds.maxY;
  const cellColumns = Math.max(maxCellX - minCellX + 1, 1);
  const cellRows = Math.max(maxCellY - minCellY + 1, 1);
  const textureColumns = cellColumns;
  const textureRows = cellRows;
  const pixels = new Uint8ClampedArray(textureColumns * textureRows * 4);
  const landByCellKey = new Map<string, boolean>();
  const mountainByCellKey = new Map<string, boolean>();
  const referenceHeightByCellKey = new Map<string, number>();

  for (const cell of campaignHexGrid.cells) {
    const pixelX = cell.x - minCellX;
    const pixelY = cell.y - minCellY;
    const pixelOffset = (pixelY * textureColumns + pixelX) * 4;
    const value = cell.land ? 255 : 0;
    const mountainValue = cell.land && cell.terrain === "山脉" ? 255 : 0;

    if (
      pixelX < 0 ||
      pixelX >= textureColumns ||
      pixelY < 0 ||
      pixelY >= textureRows ||
      pixelOffset < 0 ||
      pixelOffset + 3 >= pixels.length
    ) {
      continue;
    }

    landByCellKey.set(getHexCellKey(cell.x, cell.y), cell.land);
    mountainByCellKey.set(getHexCellKey(cell.x, cell.y), mountainValue > 0);
    referenceHeightByCellKey.set(
      getHexCellKey(cell.x, cell.y),
      cell.land ? clamp(cell.referenceHeight, 0, 1) : 0
    );
    pixels[pixelOffset] = value;
    pixels[pixelOffset + 1] = mountainValue;
    pixels[pixelOffset + 2] = 0;
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
    mountainByCellKey,
    referenceHeightByCellKey,
  };
}

function getCampaignVegetationCells(
  campaignHexGrid: CampaignHexGridAsset,
  environment: string
): CampaignVegetationCell[] {
  return campaignHexGrid.cells
    .filter((cell) => cell.land && cell.environment === environment)
    .map((cell) => {
      const center = hexToPixel(cell.x, cell.y);

      return {
        x: cell.x,
        y: cell.y,
        u: hexPointToTerrainU(center.x),
        v: hexPointToTerrainV(center.y),
      };
    });
}

function getCampaignVegetationCellsForChunks(
  cells: CampaignVegetationCell[],
  chunksByKey: Map<string, CampaignTerrainChunkData>
): CampaignVegetationCell[] {
  if (chunksByKey.size <= 0) {
    return [];
  }

  return cells.filter((cell) =>
    chunksByKey.has(
      getCampaignTerrainChunkKey(getCampaignTerrainChunkForHexCell(cell))
    )
  );
}

function readCampaignVegetationAvoidancePoints(
  canvas: HTMLCanvasElement,
  rules: CampaignVegetationRulesAsset
): CampaignVegetationAvoidancePoint[] {
  const stage = canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  if (stage == null) {
    return [];
  }

  const points: CampaignVegetationAvoidancePoint[] = [];
  const appendPoint = (element: HTMLElement, radius: number) => {
    const u = Number(element.dataset.mapHeightU);
    const v = Number(element.dataset.mapHeightV);
    if (!Number.isFinite(u) || !Number.isFinite(v)) {
      return;
    }

    points.push({ u, v, radius });
  };

  stage
    .querySelectorAll<HTMLElement>("[data-campaign-marker-id][data-map-height-u][data-map-height-v]")
    .forEach((element) => {
      appendPoint(element, rules.avoidance.markerRadius);
    });
  stage
    .querySelectorAll<HTMLElement>("[data-campaign-player='true'][data-map-height-u][data-map-height-v]")
    .forEach((element) => {
      appendPoint(element, rules.avoidance.playerRadius);
    });
  stage
    .querySelectorAll<HTMLElement>("[data-campaign-travel-path-point][data-map-height-u][data-map-height-v]")
    .forEach((element) => {
      appendPoint(element, rules.avoidance.pathRadius);
    });

  return points;
}

function getCampaignVegetationMeshSignature(
  canvas: HTMLCanvasElement,
  camera: CampaignTerrainCamera,
  avoidancePoints: CampaignVegetationAvoidancePoint[]
): string {
  return [
    canvas.width,
    canvas.height,
    camera.scale.toFixed(2),
    camera.offsetX.toFixed(1),
    camera.offsetY.toFixed(1),
    avoidancePoints
      .map((point) => `${point.u.toFixed(4)},${point.v.toFixed(4)},${point.radius.toFixed(2)}`)
      .join(";"),
  ].join("|");
}

function createCampaignVegetationMesh(input: {
  cells: CampaignVegetationCell[];
  asset: CampaignVegetationAsset;
  sampleHeightAtUv: (u: number, v: number) => number;
  matrix: Mat4;
  canvasWidth: number;
  canvasHeight: number;
  avoidancePoints: CampaignVegetationAvoidancePoint[];
  onVariantMeshNeeded: (
    variant: CampaignVegetationRulesAsset["variants"][number]
  ) => void;
}): VegetationMeshData {
  const density = getCampaignVegetationDensity(currentCamera.scale, input.asset.rules);
  const instances: CampaignVegetationInstance[] = [];
  const maxInstances = Math.max(
    Math.floor(input.asset.rules.lod.maxVisibleInstances),
    0
  );
  const visibleCells = input.cells
    .map((cell): CampaignVegetationVisibleCell | null => {
      const visibility = getCampaignVegetationCellVisibility(
        cell,
        input.matrix,
        input.sampleHeightAtUv
      );
      if (visibility == null) {
        return null;
      }
      if (
        !isCampaignVegetationHeightAllowed(
          cell.u,
          cell.v,
          input.sampleHeightAtUv,
          input.asset.rules
        )
      ) {
        return null;
      }
      const targetCount = getCampaignVegetationCellTargetCount(
        cell,
        input.asset,
        density,
        input.avoidancePoints
      );
      if (targetCount <= 0) {
        return null;
      }

      return {
        cell,
        priority: visibility.priority,
        screenX: visibility.screenX,
        screenY: visibility.screenY,
        targetCount,
      };
    })
    .filter((item): item is CampaignVegetationVisibleCell => item != null);
  const allocations = createUniformCampaignVegetationCellAllocations(
    visibleCells,
    maxInstances
  );

  for (const allocation of allocations) {
    if (instances.length >= maxInstances) {
      break;
    }

    appendCampaignVegetationCellInstances(
      instances,
      allocation.cell,
      input.asset,
      input.avoidancePoints,
      input.sampleHeightAtUv,
      input.onVariantMeshNeeded,
      allocation.count,
      maxInstances
    );
  }

  return buildCampaignVegetationMeshFromInstances(
    instances,
    input.asset.rules,
    input.sampleHeightAtUv,
    input.matrix,
    input.canvasWidth / Math.max(input.canvasHeight, 1)
  );
}

function getCampaignVegetationDensity(
  scale: number,
  rules: CampaignVegetationRulesAsset
): { min: number; max: number } {
  if (scale >= rules.lod.nearMinScale) {
    return rules.density.near;
  }
  if (scale >= rules.lod.mediumMinScale) {
    return rules.density.medium;
  }
  return rules.density.far;
}

function getCampaignVegetationCellVisibility(
  cell: CampaignVegetationCell,
  matrix: Mat4,
  sampleHeightAtUv: (u: number, v: number) => number
): { priority: number; screenX: number; screenY: number } | null {
  const height = sampleHeightAtUv(cell.u, cell.v);
  const screenPoint = projectPoint(matrix, createTerrainWorldPoint(cell.u, cell.v, height));
  const isVisible =
    screenPoint.w > 0 &&
    screenPoint.z >= -1.35 &&
    screenPoint.z <= 1.35 &&
    screenPoint.x >= -1.55 &&
    screenPoint.x <= 1.55 &&
    screenPoint.y >= -1.55 &&
    screenPoint.y <= 1.55;
  if (!isVisible) {
    return null;
  }

  return {
    priority: Math.hypot(screenPoint.x, screenPoint.y),
    screenX: screenPoint.x,
    screenY: screenPoint.y,
  };
}

function createUniformCampaignVegetationCellAllocations(
  visibleCells: CampaignVegetationVisibleCell[],
  maxInstances: number
): CampaignVegetationCellAllocation[] {
  const totalTargetCount = visibleCells.reduce(
    (sum, item) => sum + item.targetCount,
    0
  );
  const instanceBudget = Math.min(Math.max(Math.floor(maxInstances), 0), totalTargetCount);
  if (instanceBudget <= 0) {
    return [];
  }

  const bucketColumns = 12;
  const bucketRows = 8;
  const buckets = new Map<
    string,
    {
      items: CampaignVegetationVisibleCell[];
      targetCount: number;
      budget: number;
      remainder: number;
      hash: number;
    }
  >();

  for (const item of visibleCells) {
    const bucketX = clamp(
      Math.floor(((item.screenX + 1.55) / 3.1) * bucketColumns),
      0,
      bucketColumns - 1
    );
    const bucketY = clamp(
      Math.floor(((item.screenY + 1.55) / 3.1) * bucketRows),
      0,
      bucketRows - 1
    );
    const bucketKey = `${bucketX},${bucketY}`;
    const bucket =
      buckets.get(bucketKey) ??
      {
        items: [],
        targetCount: 0,
        budget: 0,
        remainder: 0,
        hash: seededRandom01(bucketX, bucketY, 359),
      };
    bucket.items.push(item);
    bucket.targetCount += item.targetCount;
    buckets.set(bucketKey, bucket);
  }

  const bucketList = Array.from(buckets.values());
  let assignedBudget = 0;
  for (const bucket of bucketList) {
    const rawBudget = (bucket.targetCount / totalTargetCount) * instanceBudget;
    bucket.budget = Math.floor(rawBudget);
    bucket.remainder = rawBudget - bucket.budget;
    assignedBudget += bucket.budget;
  }

  if (instanceBudget >= bucketList.length) {
    for (const bucket of bucketList) {
      if (bucket.budget === 0) {
        bucket.budget = 1;
        assignedBudget += 1;
      }
    }
  }

  if (assignedBudget > instanceBudget) {
    const overBudget = assignedBudget - instanceBudget;
    bucketList
      .filter((bucket) => bucket.budget > 1)
      .sort((left, right) => left.remainder - right.remainder || left.hash - right.hash)
      .slice(0, overBudget)
      .forEach((bucket) => {
        bucket.budget -= 1;
      });
  } else if (assignedBudget < instanceBudget) {
    const remainingBudget = instanceBudget - assignedBudget;
    bucketList
      .sort((left, right) => right.remainder - left.remainder || left.hash - right.hash)
      .slice(0, remainingBudget)
      .forEach((bucket) => {
        bucket.budget += 1;
      });
  }

  return bucketList.flatMap((bucket) =>
    createUniformCampaignVegetationBucketAllocations(bucket.items, bucket.budget)
  );
}

function createUniformCampaignVegetationBucketAllocations(
  cells: CampaignVegetationVisibleCell[],
  budget: number
): CampaignVegetationCellAllocation[] {
  const safeBudget = Math.max(Math.floor(budget), 0);
  if (safeBudget <= 0 || cells.length === 0) {
    return [];
  }

  const sortedCells = [...cells].sort(
    (left, right) =>
      seededRandom01(left.cell.x, left.cell.y, 397) -
        seededRandom01(right.cell.x, right.cell.y, 397) ||
      left.priority - right.priority
  );

  if (safeBudget < sortedCells.length) {
    return sortedCells.slice(0, safeBudget).map((item) => ({
      cell: item.cell,
      count: 1,
    }));
  }

  const allocations = sortedCells.map((item) => ({
    item,
    count: 1,
    remainder: 0,
  }));
  const extraBudget = safeBudget - sortedCells.length;
  const totalExtraTarget = sortedCells.reduce(
    (sum, item) => sum + Math.max(item.targetCount - 1, 0),
    0
  );
  let assignedExtra = 0;

  if (totalExtraTarget > 0 && extraBudget > 0) {
    for (const allocation of allocations) {
      const rawExtra =
        (Math.max(allocation.item.targetCount - 1, 0) / totalExtraTarget) *
        extraBudget;
      const extra = Math.min(
        Math.floor(rawExtra),
        Math.max(allocation.item.targetCount - allocation.count, 0)
      );
      allocation.count += extra;
      allocation.remainder = rawExtra - extra;
      assignedExtra += extra;
    }

    const remainingExtra = extraBudget - assignedExtra;
    allocations
      .filter((allocation) => allocation.count < allocation.item.targetCount)
      .sort(
        (left, right) =>
          right.remainder - left.remainder ||
          seededRandom01(left.item.cell.x, left.item.cell.y, 421) -
            seededRandom01(right.item.cell.x, right.item.cell.y, 421)
      )
      .slice(0, remainingExtra)
      .forEach((allocation) => {
        allocation.count += 1;
      });
  }

  return allocations
    .filter((allocation) => allocation.count > 0)
    .map((allocation) => ({
      cell: allocation.item.cell,
      count: allocation.count,
    }));
}

function getCampaignVegetationCellTargetCount(
  cell: CampaignVegetationCell,
  asset: CampaignVegetationAsset,
  density: { min: number; max: number },
  avoidancePoints: CampaignVegetationAvoidancePoint[]
): number {
  const rules = asset.rules;
  const baseCount =
    density.min +
    Math.floor(
      seededRandom01(cell.x, cell.y, 17) *
        Math.max(density.max - density.min + 1, 1)
    );
  const cellCenter = hexToPixel(cell.x, cell.y);
  const avoidanceMultiplier = getCampaignVegetationAvoidanceDensityMultiplier(
    cellCenter,
    avoidancePoints,
    rules
  );

  return Math.max(0, Math.floor(baseCount * avoidanceMultiplier));
}

function appendCampaignVegetationCellInstances(
  instances: CampaignVegetationInstance[],
  cell: CampaignVegetationCell,
  asset: CampaignVegetationAsset,
  avoidancePoints: CampaignVegetationAvoidancePoint[],
  sampleHeightAtUv: (u: number, v: number) => number,
  onVariantMeshNeeded: (
    variant: CampaignVegetationRulesAsset["variants"][number]
  ) => void,
  targetCount: number,
  maxInstances: number
): void {
  const rules = asset.rules;
  const cellCenter = hexToPixel(cell.x, cell.y);
  const maxAttempts = Math.max(targetCount * 4, targetCount + 6);
  let resolvedCount = 0;

  for (
    let attemptIndex = 0;
    attemptIndex < maxAttempts &&
      resolvedCount < targetCount &&
      instances.length < maxInstances;
    attemptIndex += 1
  ) {
    const radiusRandom = seededRandom01(cell.x, cell.y, attemptIndex * 19 + 31);
    const angleRandom = seededRandom01(cell.x, cell.y, attemptIndex * 23 + 47);
    const radius =
      rules.placement.innerRadius +
      Math.sqrt(radiusRandom) *
        Math.max(rules.placement.outerRadius - rules.placement.innerRadius, 0);
    const angle = angleRandom * Math.PI * 2;
    const point = {
      x: cellCenter.x + Math.cos(angle) * radius,
      y: cellCenter.y + Math.sin(angle) * radius,
    };

    if (isCampaignVegetationPointAvoided(point, avoidancePoints)) {
      continue;
    }

    const u = hexPointToTerrainU(point.x);
    const v = hexPointToTerrainV(point.y);
    if (!isCampaignVegetationHeightAllowed(u, v, sampleHeightAtUv, rules)) {
      resolvedCount += 1;
      continue;
    }

    const variant = chooseCampaignVegetationVariant(
      rules,
      seededRandom01(cell.x, cell.y, attemptIndex * 29 + 61)
    );
    const mesh = asset.meshesById.get(variant.id);
    if (mesh == null) {
      onVariantMeshNeeded(variant);
      continue;
    }
    const placement = getCampaignVegetationVariantPlacement(rules, variant);

    instances.push({
      mesh,
      variant,
      u,
      v,
      rotation: seededRandom01(cell.x, cell.y, attemptIndex * 31 + 73) * Math.PI * 2,
      scale:
        placement.scaleMin +
        seededRandom01(cell.x, cell.y, attemptIndex * 37 + 89) *
          Math.max(placement.scaleMax - placement.scaleMin, 0),
      colorJitter:
        0.88 + seededRandom01(cell.x, cell.y, attemptIndex * 41 + 101) * 0.22,
    });
    resolvedCount += 1;
  }
}

function isCampaignVegetationHeightAllowed(
  u: number,
  v: number,
  sampleHeightAtUv: (u: number, v: number) => number,
  rules: CampaignVegetationRulesAsset
): boolean {
  const maxTerrainHeight = rules.altitude?.maxTerrainHeight;
  if (typeof maxTerrainHeight !== "number" || !Number.isFinite(maxTerrainHeight)) {
    return true;
  }

  return sampleHeightAtUv(u, v) <= maxTerrainHeight;
}

function getCampaignVegetationAvoidanceDensityMultiplier(
  cellCenter: { x: number; y: number },
  avoidancePoints: CampaignVegetationAvoidancePoint[],
  rules: CampaignVegetationRulesAsset
): number {
  for (const avoidancePoint of avoidancePoints) {
    const point = terrainUvToHexPoint(avoidancePoint.u, avoidancePoint.v);
    if (getDistance(point, cellCenter) <= avoidancePoint.radius * 1.15) {
      return clamp(rules.avoidance.densityMultiplierNearAvoidance, 0, 1);
    }
  }

  return 1;
}

function isCampaignVegetationPointAvoided(
  point: { x: number; y: number },
  avoidancePoints: CampaignVegetationAvoidancePoint[]
): boolean {
  return avoidancePoints.some((avoidancePoint) => {
    const avoidPoint = terrainUvToHexPoint(avoidancePoint.u, avoidancePoint.v);
    return getDistance(point, avoidPoint) <= avoidancePoint.radius;
  });
}

function chooseCampaignVegetationVariant(
  rules: CampaignVegetationRulesAsset,
  randomValue: number
): CampaignVegetationRulesAsset["variants"][number] {
  const totalWeight = rules.variants.reduce(
    (sum, variant) => sum + Math.max(variant.weight, 0),
    0
  );
  const fallbackVariant = rules.variants[0];
  if (fallbackVariant == null) {
    throw new Error("Campaign vegetation rules did not declare any variants.");
  }
  if (totalWeight <= 0) {
    return fallbackVariant;
  }

  let cursor = randomValue * totalWeight;
  for (const variant of rules.variants) {
    cursor -= Math.max(variant.weight, 0);
    if (cursor <= 0) {
      return variant;
    }
  }

  return rules.variants[rules.variants.length - 1] ?? fallbackVariant;
}

function getCampaignVegetationVariantPlacement(
  rules: CampaignVegetationRulesAsset,
  variant: CampaignVegetationRulesAsset["variants"][number]
): CampaignVegetationRulesAsset["placement"] {
  return {
    ...rules.placement,
    ...variant.placement,
  };
}

function isCampaignVegetationVariantShadowEnabled(
  variant: CampaignVegetationRulesAsset["variants"][number]
): boolean {
  return variant.shadow?.enabled ?? true;
}

function buildCampaignVegetationMeshFromInstances(
  instances: CampaignVegetationInstance[],
  rules: CampaignVegetationRulesAsset,
  sampleHeightAtUv: (u: number, v: number) => number,
  matrix: Mat4,
  viewportAspectRatio: number
): VegetationMeshData {
  const vertexCount = instances.reduce(
    (sum, instance) => sum + instance.mesh.positions.length / 3,
    0
  );
  const indexCount = instances.reduce(
    (sum, instance) => sum + instance.mesh.indices.length,
    0
  );
  const vertices = new Float32Array(vertexCount * 9);
  const indices = new Uint32Array(indexCount);
  const shadowVertices = new Float32Array(instances.length * 4 * 5);
  const shadowIndices = new Uint32Array(instances.length * 6);
  let vertexOffset = 0;
  let indexOffset = 0;
  let shadowVertexOffset = 0;
  let shadowIndexOffset = 0;

  for (const instance of instances) {
    const height = sampleHeightAtUv(instance.u, instance.v);
    const center = createTerrainWorldPoint(instance.u, instance.v, height);
    const rotationCos = Math.cos(instance.rotation);
    const rotationSin = Math.sin(instance.rotation);
    const placement = getCampaignVegetationVariantPlacement(rules, instance.variant);
    const worldScale = placement.baseWorldScale * instance.scale;
    const sourceVertexCount = instance.mesh.positions.length / 3;
    for (let sourceVertexIndex = 0; sourceVertexIndex < sourceVertexCount; sourceVertexIndex += 1) {
      const sourcePositionOffset = sourceVertexIndex * 3;
      const outputOffset = (vertexOffset + sourceVertexIndex) * 9;
      const localX = (instance.mesh.positions[sourcePositionOffset] ?? 0) * worldScale;
      const localY = (instance.mesh.positions[sourcePositionOffset + 1] ?? 0) * worldScale;
      const localZ = (instance.mesh.positions[sourcePositionOffset + 2] ?? 0) * worldScale;
      const rotatedX = localX * rotationCos - localY * rotationSin;
      const rotatedY = localX * rotationSin + localY * rotationCos;
      const normalX = instance.mesh.normals[sourcePositionOffset] ?? 0;
      const normalY = instance.mesh.normals[sourcePositionOffset + 1] ?? 0;
      const normalZ = instance.mesh.normals[sourcePositionOffset + 2] ?? 1;
      const rotatedNormal = normalizeVector3([
        normalX * rotationCos - normalY * rotationSin,
        normalX * rotationSin + normalY * rotationCos,
        normalZ,
      ]);
      vertices[outputOffset] = center[0] + rotatedX;
      vertices[outputOffset + 1] = center[1] + rotatedY;
      vertices[outputOffset + 2] = center[2] + localZ + placement.lift;
      vertices[outputOffset + 3] = rotatedNormal[0];
      vertices[outputOffset + 4] = rotatedNormal[1];
      vertices[outputOffset + 5] = rotatedNormal[2];
      vertices[outputOffset + 6] = clamp(
        (instance.mesh.colors[sourcePositionOffset] ?? 1) * instance.colorJitter,
        0,
        1
      );
      vertices[outputOffset + 7] = clamp(
        (instance.mesh.colors[sourcePositionOffset + 1] ?? 1) * instance.colorJitter,
        0,
        1
      );
      vertices[outputOffset + 8] = clamp(
        (instance.mesh.colors[sourcePositionOffset + 2] ?? 1) * instance.colorJitter,
        0,
        1
      );
    }

    for (let index = 0; index < instance.mesh.indices.length; index += 1) {
      indices[indexOffset + index] =
        vertexOffset + (instance.mesh.indices[index] ?? 0);
    }
    if (isCampaignVegetationVariantShadowEnabled(instance.variant)) {
      appendCampaignVegetationShadowGeometry(
        shadowVertices,
        shadowIndices,
        shadowVertexOffset,
        shadowIndexOffset,
        center,
        instance,
        rules,
        matrix,
        viewportAspectRatio
      );
      shadowVertexOffset += 4;
      shadowIndexOffset += 6;
    }
    vertexOffset += sourceVertexCount;
    indexOffset += instance.mesh.indices.length;
  }

  return {
    vertices,
    indices,
    shadowVertices: shadowVertices.subarray(0, shadowVertexOffset * 5),
    shadowIndices: shadowIndices.subarray(0, shadowIndexOffset),
    instanceCount: instances.length,
  };
}

function appendCampaignVegetationShadowGeometry(
  vertices: Float32Array,
  indices: Uint32Array,
  vertexOffset: number,
  indexOffset: number,
  center: [number, number, number],
  instance: CampaignVegetationInstance,
  rules: CampaignVegetationRulesAsset,
  matrix: Mat4,
  viewportAspectRatio: number
): void {
  const placement = getCampaignVegetationVariantPlacement(rules, instance.variant);
  const worldScale = placement.baseWorldScale * instance.scale;
  const width = Math.max(
    instance.mesh.bounds.max[0] - instance.mesh.bounds.min[0],
    instance.mesh.bounds.max[1] - instance.mesh.bounds.min[1],
    0.0001
  ) * worldScale;
  const height = Math.max(
    instance.mesh.bounds.max[2] - instance.mesh.bounds.min[2],
    0.0001
  ) * worldScale;
  const shadowLength =
    Math.max(width, height * 0.58) *
    rules.shadow.radiusScaleX *
    (1 + clamp(rules.shadow.lightOffsetScale, 0, 0.72));
  const shadowWidth = Math.max(width * 0.42, height * 0.12) * rules.shadow.radiusScaleY;
  const shadowDirection = getCampaignVegetationShadowWorldDirection(
    center,
    matrix,
    getCampaignVegetationTerrainShadowScreenDirection(center, matrix, viewportAspectRatio)
  );
  const perpendicular: [number, number] = [-shadowDirection[1], shadowDirection[0]];
  const rootX = center[0];
  const rootY = center[1];
  const farX = rootX + shadowDirection[0] * shadowLength;
  const farY = rootY + shadowDirection[1] * shadowLength;
  const shadowZ = center[2] + rules.shadow.lift;
  const corners: Array<{
    x: number;
    y: number;
    u: number;
    v: number;
  }> = [
    {
      x: rootX - perpendicular[0] * shadowWidth * 0.22,
      y: rootY - perpendicular[1] * shadowWidth * 0.22,
      u: 0,
      v: -1,
    },
    {
      x: farX - perpendicular[0] * shadowWidth,
      y: farY - perpendicular[1] * shadowWidth,
      u: 1,
      v: -1,
    },
    {
      x: farX + perpendicular[0] * shadowWidth,
      y: farY + perpendicular[1] * shadowWidth,
      u: 1,
      v: 1,
    },
    {
      x: rootX + perpendicular[0] * shadowWidth * 0.22,
      y: rootY + perpendicular[1] * shadowWidth * 0.22,
      u: 0,
      v: 1,
    },
  ];

  for (let index = 0; index < corners.length; index += 1) {
    const corner = corners[index] ?? { x: rootX, y: rootY, u: 0, v: 0 };
    const offset = (vertexOffset + index) * 5;
    vertices[offset] = corner.x;
    vertices[offset + 1] = corner.y;
    vertices[offset + 2] = shadowZ;
    vertices[offset + 3] = corner.u;
    vertices[offset + 4] = corner.v;
  }

  indices[indexOffset] = vertexOffset;
  indices[indexOffset + 1] = vertexOffset + 1;
  indices[indexOffset + 2] = vertexOffset + 2;
  indices[indexOffset + 3] = vertexOffset;
  indices[indexOffset + 4] = vertexOffset + 2;
  indices[indexOffset + 5] = vertexOffset + 3;
}

function getCampaignVegetationTerrainShadowScreenDirection(
  center: [number, number, number],
  matrix: Mat4,
  viewportAspectRatio: number
): [number, number] {
  const projectedCenter = projectPoint(matrix, center);
  const centerToFragment: [number, number] = [
    -projectedCenter.x * 0.5 * viewportAspectRatio,
    -projectedCenter.y * 0.5,
  ];
  const vegetationShadowDirection = normalizeTuple2([
    -centerToFragment[0],
    -Math.max(Math.abs(centerToFragment[1]), TERRAIN_CAMERA_LIGHT_HEIGHT),
  ]);
  const verticallyFlippedShadowDirection: [number, number] = [
    vegetationShadowDirection[0],
    -vegetationShadowDirection[1],
  ];

  return verticallyFlippedShadowDirection;
}

function getCampaignVegetationShadowWorldDirection(
  center: [number, number, number],
  matrix: Mat4,
  screenDirection: [number, number]
): [number, number] {
  const projectedCenter = projectPoint(matrix, center);
  const normalizedScreenDirection = normalizeTuple2(screenDirection);
  const sampleStep = 0.002;
  const projectedWorldX = projectPoint(matrix, [
    center[0] + sampleStep,
    center[1],
    center[2],
  ]);
  const projectedWorldY = projectPoint(matrix, [
    center[0],
    center[1] + sampleStep,
    center[2],
  ]);
  const basisX: [number, number] = [
    projectedWorldX.x - projectedCenter.x,
    projectedWorldX.y - projectedCenter.y,
  ];
  const basisY: [number, number] = [
    projectedWorldY.x - projectedCenter.x,
    projectedWorldY.y - projectedCenter.y,
  ];
  const determinant = basisX[0] * basisY[1] - basisY[0] * basisX[1];
  const worldDirection =
    Math.abs(determinant) > 0.0000001
      ? normalizeTuple2([
          (normalizedScreenDirection[0] * basisY[1] -
            basisY[0] * normalizedScreenDirection[1]) /
            determinant,
          (basisX[0] * normalizedScreenDirection[1] -
            normalizedScreenDirection[0] * basisX[1]) /
            determinant,
        ])
      : normalizedScreenDirection;
  return worldDirection;
}

function normalizeTuple2(input: [number, number]): [number, number] {
  const length = Math.hypot(input[0], input[1]) || 1;

  return [input[0] / length, input[1] / length];
}

function seededRandom01(x: number, y: number, salt: number): number {
  let hash = 2166136261;
  hash ^= Math.imul(x | 0, 374761393);
  hash = Math.imul(hash, 16777619);
  hash ^= Math.imul(y | 0, 668265263);
  hash = Math.imul(hash, 16777619);
  hash ^= Math.imul(salt | 0, 2246822519);
  hash = Math.imul(hash ^ (hash >>> 15), 2246822507);
  hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
  return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296;
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
  sampleHeightAtUv: (u: number, v: number) => number;
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

    const height = input.sampleHeightAtUv(u, v);
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

function createShorelineDistanceTextureModel(
  materialSemanticModel: CampaignMaterialSemanticModel,
  tuning: CampaignTerrainBeachTuning,
  options?: {
    bounds: CampaignTerrainChunkBounds;
    textureColumns: number;
    textureRows: number;
  }
): ShorelineDistanceTextureModel {
  const textureColumns = options?.textureColumns ?? GRID_COLUMNS;
  const textureRows = options?.textureRows ?? GRID_ROWS;
  const bounds = options?.bounds ?? {
    minU: 0,
    maxU: 1,
    minV: 0,
    maxV: 1,
  };
  const distanceRange = SHORELINE_DISTANCE_TEXTURE_DISTANCE_RANGE;
  const pixels = new Uint8ClampedArray(textureColumns * textureRows * 4);
  const bestAbsDistanceByPixel = new Float32Array(textureColumns * textureRows);
  const signedDistanceByPixel = new Float32Array(textureColumns * textureRows);
  const edges = getShorelineChainEdges(materialSemanticModel);
  const maxReach = Math.min(
    distanceRange,
    Math.max(
      SHORELINE_DISTANCE_TEXTURE_MIN_REACH,
      tuning.outerRadius * 1.35,
      tuning.shorelineEdgeWidth * 2.65 + tuning.shorelineWaveStrength * 1.45,
      tuning.shorelineErosionStrength * 3.20 + 0.82
    )
  );

  bestAbsDistanceByPixel.fill(Number.POSITIVE_INFINITY);
  signedDistanceByPixel.fill(0);

  for (const edge of edges) {
    rasterizeShorelineDistanceEdge({
      edge,
      tuning,
      maxReach,
      bounds,
      textureColumns,
      textureRows,
      bestAbsDistanceByPixel,
      signedDistanceByPixel,
    });
  }

  const cellKeys = new Set(
    materialSemanticModel.cells.map((cell) => getHexCellKey(cell.x, cell.y))
  );

  for (let index = 0; index < signedDistanceByPixel.length; index += 1) {
    if (!Number.isFinite(bestAbsDistanceByPixel[index])) {
      const pixelX = index % textureColumns;
      const pixelY = Math.floor(index / textureColumns);
      const u = getCampaignTerrainChunkSampleU(bounds, textureColumns, pixelX);
      const v = getCampaignTerrainChunkSampleV(bounds, textureRows, pixelY);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      const cellKey = getHexCellKey(cell.x, cell.y);
      if (!cellKeys.has(cellKey)) {
        pixels[index * 4] = 128;
        pixels[index * 4 + 1] = 0;
        pixels[index * 4 + 2] = 0;
        pixels[index * 4 + 3] = 0;
        continue;
      }

      const fallbackSignedDistance =
        materialSemanticModel.landByCellKey.get(cellKey) === true
          ? -distanceRange
          : distanceRange;
      const packedFallbackDistance = packNormalizedUint16(
        signedDistanceToShorelineDistanceTextureValue(
          fallbackSignedDistance,
          distanceRange
        )
      );
      pixels[index * 4] = packedFallbackDistance.high;
      pixels[index * 4 + 1] = packedFallbackDistance.low;
      pixels[index * 4 + 2] = 0;
      pixels[index * 4 + 3] = 255;
      continue;
    }

    const packedDistance = packNormalizedUint16(
      signedDistanceToShorelineDistanceTextureValue(
        signedDistanceByPixel[index] ?? 0,
        distanceRange
      )
    );
    const offset = index * 4;
    pixels[offset] = packedDistance.high;
    pixels[offset + 1] = packedDistance.low;
    pixels[offset + 2] = 0;
    pixels[offset + 3] = 255;
  }

  return {
    source: new ImageData(pixels, textureColumns, textureRows),
    textureColumns,
    textureRows,
    distanceRange,
    signature: getShorelineDistanceTextureSignature(tuning),
  };
}

function getShorelineChainEdges(
  materialSemanticModel: CampaignMaterialSemanticModel
): ShorelineChainEdge[] {
  const cachedEdges = shorelineChainEdgesBySemanticModel.get(materialSemanticModel);
  if (cachedEdges != null) {
    return cachedEdges;
  }

  const edges = createShorelineChainEdges(materialSemanticModel);
  shorelineChainEdgesBySemanticModel.set(materialSemanticModel, edges);
  return edges;
}

function createShorelineChainEdges(
  materialSemanticModel: CampaignMaterialSemanticModel
): ShorelineChainEdge[] {
  const cells = materialSemanticModel.cells;
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
        normalToWater,
        tangent,
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

  assignShorelineChainMetadata(edges, endpointToEdgeIds);

  return edges;
}

function rasterizeShorelineDistanceEdge(input: {
  edge: ShorelineChainEdge;
  tuning: CampaignTerrainBeachTuning;
  maxReach: number;
  bounds: CampaignTerrainChunkBounds;
  textureColumns: number;
  textureRows: number;
  bestAbsDistanceByPixel: Float32Array;
  signedDistanceByPixel: Float32Array;
}): void {
  const edgeLength = Math.max(getDistance(input.edge.start, input.edge.end), 0.000001);
  const minX = Math.min(input.edge.start.x, input.edge.end.x) - input.maxReach;
  const maxX = Math.max(input.edge.start.x, input.edge.end.x) + input.maxReach;
  const minY = Math.min(input.edge.start.y, input.edge.end.y) - input.maxReach;
  const maxY = Math.max(input.edge.start.y, input.edge.end.y) + input.maxReach;
  const minEdgeU = hexPointToTerrainU(minX);
  const maxEdgeU = hexPointToTerrainU(maxX);
  const minEdgeV = hexPointToTerrainV(minY);
  const maxEdgeV = hexPointToTerrainV(maxY);
  if (
    maxEdgeU < input.bounds.minU ||
    minEdgeU > input.bounds.maxU ||
    maxEdgeV < input.bounds.minV ||
    minEdgeV > input.bounds.maxV
  ) {
    return;
  }

  const minPixelX = Math.max(
    Math.floor(
      ((minEdgeU - input.bounds.minU) /
        Math.max(input.bounds.maxU - input.bounds.minU, 0.000001)) *
        Math.max(input.textureColumns - 1, 0)
    ),
    0
  );
  const maxPixelX = Math.min(
    Math.ceil(
      ((maxEdgeU - input.bounds.minU) /
        Math.max(input.bounds.maxU - input.bounds.minU, 0.000001)) *
        Math.max(input.textureColumns - 1, 0)
    ),
    input.textureColumns - 1
  );
  const minPixelY = Math.max(
    Math.floor(
      ((minEdgeV - input.bounds.minV) /
        Math.max(input.bounds.maxV - input.bounds.minV, 0.000001)) *
        Math.max(input.textureRows - 1, 0)
    ),
    0
  );
  const maxPixelY = Math.min(
    Math.ceil(
      ((maxEdgeV - input.bounds.minV) /
        Math.max(input.bounds.maxV - input.bounds.minV, 0.000001)) *
        Math.max(input.textureRows - 1, 0)
    ),
    input.textureRows - 1
  );

  for (let pixelY = minPixelY; pixelY <= maxPixelY; pixelY += 1) {
    const v = getCampaignTerrainChunkSampleV(input.bounds, input.textureRows, pixelY);
    for (let pixelX = minPixelX; pixelX <= maxPixelX; pixelX += 1) {
      const u = getCampaignTerrainChunkSampleU(input.bounds, input.textureColumns, pixelX);
      const point = terrainUvToHexPoint(u, v);
      const pointCell = pixelToRoundedHex(point.x, point.y);
      if (
        !(
          pointCell.x === input.edge.landCell.x &&
          pointCell.y === input.edge.landCell.y
        ) &&
        !(
          pointCell.x === input.edge.waterCell.x &&
          pointCell.y === input.edge.waterCell.y
        )
      ) {
        continue;
      }

      const localX = point.x - input.edge.start.x;
      const localY = point.y - input.edge.start.y;
      const along = localX * input.edge.tangent.x + localY * input.edge.tangent.y;
      const clampedAlong = clamp(along, 0, edgeLength);
      const closest = {
        x: input.edge.start.x + input.edge.tangent.x * clampedAlong,
        y: input.edge.start.y + input.edge.tangent.y * clampedAlong,
      };
      const normalDistance =
        (point.x - closest.x) * input.edge.normalToWater.x +
        (point.y - closest.y) * input.edge.normalToWater.y;
      const endpointDistance = Math.max(Math.abs(along - edgeLength * 0.5) - edgeLength * 0.5, 0);
      const capsuleDistance = Math.hypot(
        endpointDistance * (1.18 - input.tuning.shorelineCornerRoundness * 0.42),
        normalDistance
      );
      if (capsuleDistance > input.maxReach) {
        continue;
      }

      const chainMileage =
        input.edge.chainStartMileage +
        (input.edge.reverseInChain ? edgeLength - clampedAlong : clampedAlong);
      const inwardErosion = sampleShorelineInwardErosion(
        chainMileage,
        input.edge.chainLength,
        input.edge.chainSeed,
        normalDistance,
        input.tuning
      );
      const signedDistance = normalDistance + inwardErosion;
      const absDistance = Math.abs(signedDistance);
      const pixelIndex = pixelY * input.textureColumns + pixelX;
      const blendWeight = 1 - smoothstepRange(input.maxReach * 0.68, input.maxReach, capsuleDistance);
      const weightedAbsDistance = absDistance / Math.max(blendWeight, 0.0001);

      if (
        weightedAbsDistance <
        (input.bestAbsDistanceByPixel[pixelIndex] ?? Number.POSITIVE_INFINITY)
      ) {
        input.bestAbsDistanceByPixel[pixelIndex] = weightedAbsDistance;
        input.signedDistanceByPixel[pixelIndex] = signedDistance;
      }
    }
  }
}

function sampleShorelineInwardErosion(
  chainMileage: number,
  chainLength: number,
  chainSeed: number,
  normalDistance: number,
  tuning: CampaignTerrainBeachTuning
): number {
  const safeLength = Math.max(chainLength, 1);
  const progress = fract(chainMileage / safeLength);
  const seed = chainSeed * 0.037;
  const broadCycles = Math.max(2, Math.round(safeLength * tuning.shorelineWaveFrequency * 0.115));
  const mediumCycles = Math.max(
    broadCycles + 2,
    Math.round(safeLength * tuning.shorelineWaveFrequency * 0.260)
  );
  const angle = progress * Math.PI * 2;
  const periodicX = Math.cos(angle);
  const periodicY = Math.sin(angle);
  const warp =
    shorelineFbm2d(periodicX * 2.1 + seed * 7.1, periodicY * 2.1 - seed * 4.3) - 0.5;
  const broad =
    Math.sin((progress * broadCycles + seed + warp * 0.18) * Math.PI * 2) * 0.5 + 0.5;
  const medium =
    Math.sin((progress * mediumCycles - seed * 0.73 + warp * 0.12) * Math.PI * 2) * 0.5 + 0.5;
  const erosion =
    shorelineFbm2d(
      chainMileage * tuning.shorelineErosionFrequency * 0.28 + seed * 17.0,
      normalDistance * 1.35 + seed * 29.0
    );
  const broadInset = broad * tuning.shorelineWaveStrength * 0.62;
  const mediumInset = medium * tuning.shorelineWaveStrength * 0.18;
  const fineInset = erosion * tuning.shorelineErosionStrength * 0.52;

  return Math.max(broadInset + mediumInset + fineInset, 0);
}

function shorelineFbm2d(x: number, y: number): number {
  const first = valueNoise2d(x, y);
  const second = valueNoise2d(x * 2.03 + 11.7, y * 2.03 - 4.2);
  const third = valueNoise2d(x * 4.11 - 8.1, y * 4.11 + 19.4);

  return first * 0.56 + second * 0.30 + third * 0.14;
}

function signedDistanceToShorelineDistanceTextureValue(
  signedDistance: number,
  distanceRange: number
): number {
  return clamp(signedDistance / (distanceRange * 2) + 0.5, 0, 1);
}

function getShorelineDistanceTextureSignature(tuning: CampaignTerrainBeachTuning): string {
  return [
    GRID_COLUMNS,
    GRID_ROWS,
    tuning.outerRadius.toFixed(4),
    tuning.shorelineEdgeWidth.toFixed(4),
    tuning.shorelineWaveStrength.toFixed(4),
    tuning.shorelineWaveFrequency.toFixed(4),
    tuning.shorelineErosionStrength.toFixed(4),
    tuning.shorelineErosionFrequency.toFixed(4),
    tuning.shorelineCornerRoundness.toFixed(4),
  ].join("|");
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

function createCampaignHexReferenceHeightSamples(
  materialSemanticModel: CampaignMaterialSemanticModel,
  columns: number,
  rows: number
): Float32Array {
  let heightSamples: Float32Array = new Float32Array(columns * rows);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      const cellKey = getHexCellKey(cell.x, cell.y);

      heightSamples[y * columns + x] =
        materialSemanticModel.landByCellKey.get(cellKey) === true
          ? materialSemanticModel.referenceHeightByCellKey.get(cellKey) ?? 0
          : 0;
    }
  }

  for (let pass = 0; pass < SMOOTH_TERRAIN_PASSES; pass += 1) {
    heightSamples = smoothCampaignHexReferenceHeightPass(
      heightSamples,
      columns,
      rows,
      materialSemanticModel
    );
  }

  return heightSamples;
}

function smoothCampaignHexReferenceHeightPass(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const smoothedHeights = new Float32Array(heights);
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      if (!isLandTerrainSample(materialSemanticModel, u, v)) {
        smoothedHeights[y * columns + x] = 0;
        continue;
      }

      const outputIndex = y * columns + x;
      const centerHeight = heights[outputIndex] ?? 0;
      let heightSum = 0;
      let heightWeight = 0;
      for (const sample of SMOOTH_TERRAIN_KERNEL) {
        const sampleX = clamp(x + sample.x, 0, maxX);
        const sampleY = clamp(y + sample.y, 0, maxY);
        const sampleU = sampleX / Math.max(columns - 1, 1);
        const sampleV = sampleY / Math.max(rows - 1, 1);
        if (!isLandTerrainSample(materialSemanticModel, sampleU, sampleV)) {
          continue;
        }

        heightSum += (heights[sampleY * columns + sampleX] ?? centerHeight) *
          sample.weight;
        heightWeight += sample.weight;
      }

      if (heightWeight <= 0) {
        continue;
      }

      smoothedHeights[outputIndex] =
        centerHeight + (heightSum / heightWeight - centerHeight) * 0.42;
    }
  }

  return smoothedHeights;
}

type NonMountainHeightCellStats = {
  sum: number;
  count: number;
  average: number;
};

function createNonMountainFlattenedHeightSamples(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const cellStats = createNonMountainHeightCellStats(
    heights,
    columns,
    rows,
    materialSemanticModel
  );
  const flattenedHeights = new Float32Array(heights);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      if (!isNonMountainTerrainHexCell(materialSemanticModel, cell)) {
        continue;
      }

      const cellStatsForSample = cellStats.get(getHexCellKey(cell.x, cell.y));
      if (cellStatsForSample == null || cellStatsForSample.count <= 0) {
        continue;
      }

      const index = y * columns + x;
      const frame = getHexLocalMountainFrame(point, cell);
      const interiorAmount =
        1 - smoothstepRange(
          NON_MOUNTAIN_HEIGHT_EDGE_FADE_START,
          NON_MOUNTAIN_HEIGHT_EDGE_FADE_END,
          frame.hexRadius
        );
      const flattenStrength = NON_MOUNTAIN_HEIGHT_FLATTEN_STRENGTH * interiorAmount;
      const currentHeight = heights[index] ?? 0;
      flattenedHeights[index] =
        currentHeight +
        (cellStatsForSample.average - currentHeight) * flattenStrength;
    }
  }

  return smoothNonMountainFlattenedHeightSamples(
    flattenedHeights,
    columns,
    rows,
    materialSemanticModel
  );
}

function createNonMountainHeightCellStats(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Map<string, NonMountainHeightCellStats> {
  const cellStats = new Map<string, NonMountainHeightCellStats>();

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      if (!isNonMountainTerrainHexCell(materialSemanticModel, cell)) {
        continue;
      }

      const key = getHexCellKey(cell.x, cell.y);
      const stats = cellStats.get(key) ?? { sum: 0, count: 0, average: 0 };
      stats.sum += heights[y * columns + x] ?? 0;
      stats.count += 1;
      cellStats.set(key, stats);
    }
  }

  for (const stats of cellStats.values()) {
    stats.average = stats.count > 0 ? stats.sum / stats.count : 0;
  }

  return cellStats;
}

function smoothNonMountainFlattenedHeightSamples(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const smoothedHeights = new Float32Array(heights);
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      if (!isNonMountainTerrainHexCell(materialSemanticModel, cell)) {
        continue;
      }

      const outputIndex = y * columns + x;
      const centerHeight = heights[outputIndex] ?? 0;
      let heightSum = 0;
      let heightWeight = 0;
      for (const sample of SMOOTH_TERRAIN_KERNEL) {
        const sampleX = clamp(x + sample.x, 0, maxX);
        const sampleY = clamp(y + sample.y, 0, maxY);
        const sampleU = sampleX / Math.max(columns - 1, 1);
        const sampleV = sampleY / Math.max(rows - 1, 1);
        const samplePoint = terrainUvToHexPoint(sampleU, sampleV);
        const sampleCell = pixelToRoundedHex(samplePoint.x, samplePoint.y);
        if (sampleCell.x !== cell.x || sampleCell.y !== cell.y) {
          continue;
        }

        heightSum += (heights[sampleY * columns + sampleX] ?? centerHeight) *
          sample.weight;
        heightWeight += sample.weight;
      }

      if (heightWeight <= 0) {
        continue;
      }

      smoothedHeights[outputIndex] =
        centerHeight +
        (heightSum / heightWeight - centerHeight) *
          NON_MOUNTAIN_HEIGHT_SMOOTH_STRENGTH;
    }
  }

  return smoothedHeights;
}

function createMountainFloorHeightSamples(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  let floorHeights: Float32Array<ArrayBufferLike> = new Float32Array(heights);
  let seededSamples = createMountainFloorSeedMask(
    heights,
    columns,
    rows,
    materialSemanticModel
  );
  const fallbackFloorHeight = createMountainFloorFallbackHeight(
    heights,
    seededSamples
  );

  for (let pass = 0; pass < MOUNTAIN_FLOOR_DIFFUSION_PASSES; pass += 1) {
    const nextHeights: Float32Array<ArrayBufferLike> = new Float32Array(floorHeights);
    const nextSeededSamples = new Uint8Array(seededSamples);
    let filledAnySample = false;

    for (let y = 0; y < rows; y += 1) {
      const v = y / Math.max(rows - 1, 1);
      for (let x = 0; x < columns; x += 1) {
        const u = x / Math.max(columns - 1, 1);
        const point = terrainUvToHexPoint(u, v);
        const cell = pixelToRoundedHex(point.x, point.y);
        if (!isMountainHexCell(materialSemanticModel, cell)) {
          continue;
        }

        const index = y * columns + x;
        if (seededSamples[index] === 1) {
          continue;
        }

        const neighborHeight = sampleSeededNeighborHeight(
          floorHeights,
          seededSamples,
          columns,
          rows,
          x,
          y
        );
        if (neighborHeight == null) {
          continue;
        }

        nextHeights[index] = neighborHeight;
        nextSeededSamples[index] = 1;
        filledAnySample = true;
      }
    }

    floorHeights = nextHeights;
    seededSamples = nextSeededSamples;
    if (!filledAnySample) {
      break;
    }
  }

  fillUnseededMountainFloorSamples(
    floorHeights,
    seededSamples,
    fallbackFloorHeight,
    columns,
    rows,
    materialSemanticModel
  );

  for (let pass = 0; pass < MOUNTAIN_FLOOR_SMOOTH_PASSES; pass += 1) {
    floorHeights = smoothMountainFloorHeightSamples(
      floorHeights,
      columns,
      rows,
      materialSemanticModel
    );
  }

  return floorHeights;
}

function createMountainFloorFallbackHeight(
  heights: Float32Array,
  seededSamples: Uint8Array
): number {
  let seededHeightSum = 0;
  let seededCount = 0;
  let fallbackHeightSum = 0;
  let fallbackCount = 0;

  for (let index = 0; index < heights.length; index += 1) {
    const height = heights[index] ?? 0;
    if (!Number.isFinite(height)) {
      continue;
    }

    fallbackHeightSum += height;
    fallbackCount += 1;
    if (seededSamples[index] === 1) {
      seededHeightSum += height;
      seededCount += 1;
    }
  }

  if (seededCount > 0) {
    return seededHeightSum / seededCount;
  }

  return fallbackCount > 0 ? fallbackHeightSum / fallbackCount : 0;
}

function fillUnseededMountainFloorSamples(
  heights: Float32Array,
  seededSamples: Uint8Array,
  fallbackFloorHeight: number,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): void {
  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      if (!isMountainHexCell(materialSemanticModel, cell)) {
        continue;
      }

      const index = y * columns + x;
      if (seededSamples[index] === 1) {
        continue;
      }

      heights[index] = fallbackFloorHeight;
      seededSamples[index] = 1;
    }
  }
}

function createMountainFloorSeedMask(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Uint8Array {
  const seededSamples = new Uint8Array(columns * rows);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      const index = y * columns + x;

      if (!isLandTerrainSample(materialSemanticModel, u, v)) {
        seededSamples[index] = 0;
        continue;
      }

      if (isMountainHexCell(materialSemanticModel, cell)) {
        seededSamples[index] = 0;
        continue;
      }

      seededSamples[index] = Number.isFinite(heights[index]) ? 1 : 0;
    }
  }

  return seededSamples;
}

function sampleSeededNeighborHeight(
  heights: Float32Array,
  seededSamples: Uint8Array,
  columns: number,
  rows: number,
  x: number,
  y: number
): number | null {
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);
  let heightSum = 0;
  let heightWeight = 0;

  for (const sample of SMOOTH_TERRAIN_KERNEL) {
    const sampleX = clamp(x + sample.x, 0, maxX);
    const sampleY = clamp(y + sample.y, 0, maxY);
    const sampleIndex = sampleY * columns + sampleX;
    if (seededSamples[sampleIndex] !== 1) {
      continue;
    }

    heightSum += (heights[sampleIndex] ?? 0) * sample.weight;
    heightWeight += sample.weight;
  }

  return heightWeight > 0 ? heightSum / heightWeight : null;
}

function smoothMountainFloorHeightSamples(
  heights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const smoothedHeights = new Float32Array(heights);
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      if (!isMountainHexCell(materialSemanticModel, cell)) {
        continue;
      }

      const outputIndex = y * columns + x;
      const centerHeight = heights[outputIndex] ?? 0;
      let heightSum = 0;
      let landWeight = 0;
      for (const sample of SMOOTH_TERRAIN_KERNEL) {
        const sampleX = clamp(x + sample.x, 0, maxX);
        const sampleY = clamp(y + sample.y, 0, maxY);
        const sampleU = sampleX / Math.max(columns - 1, 1);
        const sampleV = sampleY / Math.max(rows - 1, 1);
        if (!isLandTerrainSample(materialSemanticModel, sampleU, sampleV)) {
          continue;
        }

        heightSum += (heights[sampleY * columns + sampleX] ?? centerHeight) *
          sample.weight;
        landWeight += sample.weight;
      }

      if (landWeight <= 0) {
        continue;
      }

      smoothedHeights[outputIndex] =
        centerHeight +
        (heightSum / landWeight - centerHeight) *
          MOUNTAIN_HEIGHT_CONTINUITY_BLEND;
    }
  }

  return smoothedHeights;
}

function createCampaignMountainHeightSamples(
  terrainBaseHeights: Float32Array,
  referenceHeights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const mountainHeights = new Float32Array(terrainBaseHeights);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const index = y * columns + x;
      if (!isLandTerrainSample(materialSemanticModel, u, v)) {
        mountainHeights[index] = 0;
        continue;
      }

      const point = terrainUvToHexPoint(u, v);
      const cell = pixelToRoundedHex(point.x, point.y);
      if (!isMountainHexCell(materialSemanticModel, cell)) {
        continue;
      }

      const terrainBaseHeight = terrainBaseHeights[index] ?? 0;
      const referenceHeight = referenceHeights[index] ?? terrainBaseHeight;
      const boundaryFactor = getMountainBoundaryHeightFactor(
        materialSemanticModel,
        point,
        cell
      );
      const mountainHeight = createMountainHeightAtPoint(
        point,
        terrainBaseHeight,
        referenceHeight,
        boundaryFactor
      );

      mountainHeights[index] = mountainHeight;
    }
  }

  return smoothMountainContinuityHeightPass(
    mountainHeights,
    terrainBaseHeights,
    columns,
    rows,
    materialSemanticModel
  );
}

function smoothMountainContinuityHeightPass(
  heights: Float32Array,
  terrainBaseHeights: Float32Array,
  columns: number,
  rows: number,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const smoothedHeights = new Float32Array(heights);
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const outputIndex = y * columns + x;
      if (!isLandTerrainSample(materialSemanticModel, u, v)) {
        smoothedHeights[outputIndex] = 0;
        continue;
      }

      let heightSum = 0;
      let landWeight = 0;
      for (const sample of SMOOTH_TERRAIN_KERNEL) {
        const sampleX = clamp(x + sample.x, 0, maxX);
        const sampleY = clamp(y + sample.y, 0, maxY);
        const sampleU = sampleX / Math.max(columns - 1, 1);
        const sampleV = sampleY / Math.max(rows - 1, 1);
        if (!isLandTerrainSample(materialSemanticModel, sampleU, sampleV)) {
          continue;
        }

        heightSum += (heights[sampleY * columns + sampleX] ?? heights[outputIndex] ?? 0) *
          sample.weight;
        landWeight += sample.weight;
      }

      if (landWeight <= 0) {
        continue;
      }

      const centerHeight = heights[outputIndex] ?? 0;
      const terrainBaseHeight = terrainBaseHeights[outputIndex] ?? centerHeight;
      const smoothHeight = heightSum / landWeight;
      const continuityHeight =
        centerHeight + (smoothHeight - centerHeight) * MOUNTAIN_HEIGHT_CONTINUITY_BLEND;
      smoothedHeights[outputIndex] = Math.max(terrainBaseHeight, continuityHeight);
    }
  }

  return smoothedHeights;
}

function createMountainHeightAtPoint(
  point: { x: number; y: number },
  terrainBaseHeight: number,
  referenceHeight: number,
  boundaryFactor: number
): number {
  const terrainBaseAmount = getMountainHeightSourceAmount(terrainBaseHeight);
  const referenceAmount = getMountainHeightSourceAmount(referenceHeight);
  const rangeRelief = createMountainRangeReliefAtPoint(point, referenceAmount);
  const mountainDeltaScale =
    MOUNTAIN_HEIGHT_DELTA_MIN +
    referenceAmount * MOUNTAIN_HEIGHT_DELTA_REFERENCE_SCALE;
  const heightCap = clamp(
    terrainBaseAmount + mountainDeltaScale * 1.08,
    terrainBaseAmount,
    0.94
  );
  const boundaryAmount = Math.pow(clamp(boundaryFactor, 0, 1), 1.18);
  const normalizedRelief = clamp(
    rangeRelief.body * MOUNTAIN_HEIGHT_BODY_STRENGTH +
      rangeRelief.peak * MOUNTAIN_HEIGHT_PEAK_STRENGTH +
      rangeRelief.ridge * MOUNTAIN_HEIGHT_RIDGE_STRENGTH -
      rangeRelief.valley * MOUNTAIN_HEIGHT_VALLEY_STRENGTH +
      rangeRelief.detail *
        MOUNTAIN_HEIGHT_DETAIL_STRENGTH *
        (0.72 + referenceAmount * 0.28),
    0,
    1
  );
  const mountainHeight =
    terrainBaseAmount +
    mountainDeltaScale * normalizedRelief * boundaryAmount;

  return roundMountainSummitHeight(
    clamp(mountainHeight, terrainBaseAmount, heightCap),
    terrainBaseAmount,
    heightCap
  );
}

function getMountainHeightSourceAmount(sourceHeight: number): number {
  return clamp(sourceHeight, 0, 1);
}

type MountainRangeReliefSample = {
  body: number;
  peak: number;
  ridge: number;
  valley: number;
  detail: number;
};

function createMountainRangeReliefAtPoint(
  point: { x: number; y: number },
  referenceAmount: number
): MountainRangeReliefSample {
  const warpX = sampleMountainErodedFbm(point.x * 0.20 + 13.2, point.y * 0.20 - 4.1, 4);
  const warpY = sampleMountainErodedFbm(point.x * 0.18 - 8.4, point.y * 0.18 + 21.6, 4);
  const warpedPoint = {
    x: point.x + (warpX.value - 0.5) * 0.62,
    y: point.y + (warpY.value - 0.5) * 0.62,
  };
  const peakField = sampleMountainPeakFieldAtPoint(warpedPoint);
  const primary = sampleOrientedMountainRangeRidge(
    warpedPoint,
    -0.54,
    0.12,
    0.92,
    0
  );
  const secondary = sampleOrientedMountainRangeRidge(
    warpedPoint,
    0.72,
    0.15,
    0.82,
    37.3
  );
  const cross = sampleOrientedMountainRangeRidge(
    warpedPoint,
    1.18,
    0.22,
    1.28,
    -19.7
  );
  const valley = sampleOrientedMountainRangeRidge(
    warpedPoint,
    0.18,
    0.30,
    2.55,
    71.9
  );
  const detailFbm = sampleMountainErodedFbm(
    warpedPoint.x * 2.25 + 5.7,
    warpedPoint.y * 2.25 - 16.4,
    4
  );
  const ridgeAmount = Math.max(
    peakField.ridge,
    primary.ridge * 0.74,
    secondary.ridge * 0.66,
    cross.ridge * 0.42
  );
  const broadRangeMass = smoothstepRange(
    0.22,
    0.72,
    ridgeAmount * 0.72 +
      Math.max(cross.ridge, secondary.ridge) * 0.34 +
      (warpX.value + warpY.value) * 0.16
  );
  const body = clamp(
    peakField.body * 0.82 +
      broadRangeMass * 0.34 +
      peakField.peak * 0.18,
    0,
    1
  );
  const erodedDetail =
    (detailFbm.value - 0.5) *
    (1 - clamp(detailFbm.erosionAmount * 0.52, 0, 0.52)) *
    (0.64 + referenceAmount * 0.36);

  return {
    body,
    peak: peakField.peak,
    ridge: ridgeAmount,
    valley: valley.ridge * body,
    detail: erodedDetail,
  };
}

type MountainPeakFieldSample = {
  body: number;
  peak: number;
  ridge: number;
};

function sampleMountainPeakFieldAtPoint(
  point: { x: number; y: number }
): MountainPeakFieldSample {
  const spacing = MOUNTAIN_HEIGHT_PEAK_FIELD_SPACING;
  const gridX = Math.floor(point.x / spacing);
  const gridY = Math.floor(point.y / spacing);
  let body = 0;
  let peak = 0;
  let ridge = 0;

  for (let yOffset = -2; yOffset <= 2; yOffset += 1) {
    for (let xOffset = -2; xOffset <= 2; xOffset += 1) {
      const peakCellX = gridX + xOffset;
      const peakCellY = gridY + yOffset;
      const center = createMountainPeakCenter(peakCellX, peakCellY, spacing);
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      const angleCos = Math.cos(center.angle);
      const angleSin = Math.sin(center.angle);
      const axis = dx * angleCos - dy * angleSin;
      const cross = dx * angleSin + dy * angleCos;
      const distance = Math.hypot(
        axis / center.longRadius,
        cross / center.shortRadius
      );
      const cone = Math.pow(clamp(1 - distance, 0, 1), 1.42) * center.amplitude;
      const shoulder = Math.pow(clamp(1 - distance * 0.58, 0, 1), 2.05) *
        center.amplitude *
        0.42;
      const ridgeBand =
        createSmoothBand(cross, center.shortRadius * 0.22, center.shortRadius * 0.48) *
        createSmoothBand(axis, center.longRadius * 0.76, center.longRadius * 0.38) *
        center.amplitude;

      body = clamp(body + cone * 0.72 + shoulder * 0.34, 0, 1.35);
      peak = Math.max(peak, cone);
      ridge = Math.max(ridge, ridgeBand);
    }
  }

  return {
    body: smoothstepRange(0.08, 0.92, body),
    peak: clamp(peak, 0, 1),
    ridge: clamp(ridge, 0, 1),
  };
}

function createMountainPeakCenter(
  cellX: number,
  cellY: number,
  spacing: number
): {
  x: number;
  y: number;
  angle: number;
  longRadius: number;
  shortRadius: number;
  amplitude: number;
} {
  const jitterX = hash2d(cellX * 3 + 11, cellY * 5 - 17) - 0.5;
  const jitterY = hash2d(cellX * 7 - 23, cellY * 2 + 31) - 0.5;

  return {
    x: (cellX + 0.5 + jitterX * 0.82) * spacing,
    y: (cellY + 0.5 + jitterY * 0.82) * spacing,
    angle: hash2d(cellX * 13 + 3, cellY * 17 - 9) * Math.PI,
    longRadius: spacing * (0.74 + hash2d(cellX * 19 - 5, cellY * 23 + 7) * 0.62),
    shortRadius: spacing * (0.24 + hash2d(cellX * 29 + 1, cellY * 31 - 3) * 0.24),
    amplitude: 0.72 + hash2d(cellX * 37 - 13, cellY * 41 + 19) * 0.34,
  };
}

function sampleOrientedMountainRangeRidge(
  point: { x: number; y: number },
  angle: number,
  axisScale: number,
  crossScale: number,
  offset: number
): MountainErodedFbmSample & { ridge: number } {
  const angleCos = Math.cos(angle);
  const angleSin = Math.sin(angle);
  const axis = point.x * angleCos - point.y * angleSin;
  const cross = point.x * angleSin + point.y * angleCos;
  const sample = sampleMountainErodedFbm(
    axis * axisScale + offset,
    cross * crossScale - offset * 0.37,
    5
  );
  const ridge =
    createMountainRidgeAmount(sample.value, 1.28) *
    (1 - clamp(sample.erosionAmount * 0.40, 0, 0.40));

  return {
    ...sample,
    ridge,
  };
}

type MountainErodedFbmSample = {
  value: number;
  erosionAmount: number;
};

function sampleMountainErodedFbm(
  x: number,
  y: number,
  octaves: number
): MountainErodedFbmSample {
  let valueSum = 0;
  let amplitudeSum = 0;
  let totalAmplitude = 0;
  let amplitude = 1;
  let frequency = 1;
  let accumulatedGradient = 0;
  let erosionSum = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    const sample = sampleValueNoiseWithGradient(
      x * frequency + octave * 17.13,
      y * frequency - octave * 11.71
    );
    const gradientDamping =
      1 /
      (1 + accumulatedGradient * MOUNTAIN_HEIGHT_ERODED_FBM_GRADIENT_DAMPING);
    const octaveAmplitude = amplitude * gradientDamping;

    valueSum += sample.value * octaveAmplitude;
    amplitudeSum += octaveAmplitude;
    erosionSum += (1 - gradientDamping) * amplitude;
    totalAmplitude += amplitude;
    accumulatedGradient += sample.gradientMagnitude * octaveAmplitude;
    amplitude *= MOUNTAIN_HEIGHT_ERODED_FBM_GAIN;
    frequency *= MOUNTAIN_HEIGHT_ERODED_FBM_LACUNARITY;
  }

  return {
    value: amplitudeSum > 0 ? valueSum / amplitudeSum : 0,
    erosionAmount: totalAmplitude > 0 ? clamp(erosionSum / totalAmplitude, 0, 1) : 0,
  };
}

function sampleValueNoiseWithGradient(
  x: number,
  y: number
): { value: number; gradientMagnitude: number } {
  const epsilon = MOUNTAIN_HEIGHT_ERODED_FBM_GRADIENT_EPSILON;
  const value = valueNoise2d(x, y);
  const gradientX =
    (valueNoise2d(x + epsilon, y) - valueNoise2d(x - epsilon, y)) /
    (epsilon * 2);
  const gradientY =
    (valueNoise2d(x, y + epsilon) - valueNoise2d(x, y - epsilon)) /
    (epsilon * 2);

  return {
    value,
    gradientMagnitude: Math.hypot(gradientX, gradientY),
  };
}

function createMountainRidgeAmount(noiseValue: number, exponent: number): number {
  return Math.pow(1 - Math.abs(noiseValue * 2 - 1), exponent);
}

function roundMountainSummitHeight(
  height: number,
  sourceAmount: number,
  heightCap: number
): number {
  const heightRange = Math.max(heightCap - sourceAmount, 0.000001);
  const normalizedHeight = clamp((height - sourceAmount) / heightRange, 0, 1);
  const summitAmount = smoothstepRange(
    MOUNTAIN_HEIGHT_SUMMIT_ROUNDING_START,
    1,
    normalizedHeight
  );
  const roundedHeight =
    normalizedHeight -
    summitAmount * summitAmount *
      MOUNTAIN_HEIGHT_SUMMIT_ROUNDING_STRENGTH *
      normalizedHeight;

  return sourceAmount + roundedHeight * heightRange;
}

function getHexLocalMountainFrame(
  point: { x: number; y: number },
  cell: GridCoordinate
): { x: number; y: number; hexRadius: number } {
  const center = hexToPixel(cell.x, cell.y);
  const localX = point.x - center.x;
  const localY = point.y - center.y;
  const axialX = 0.5773503 * localX - 0.3333333 * localY;
  const axialY = 0.6666667 * localY;
  const axialZ = -axialX - axialY;

  return {
    x: localX,
    y: localY,
    hexRadius: Math.max(Math.abs(axialX), Math.abs(axialY), Math.abs(axialZ)),
  };
}

function createSmoothBand(value: number, radius: number, feather: number): number {
  return 1 - smoothstepRange(radius, radius + feather, Math.abs(value));
}

function getMountainBoundaryHeightFactor(
  materialSemanticModel: CampaignMaterialSemanticModel,
  point: { x: number; y: number },
  cell: GridCoordinate
): number {
  let boundaryFactor = 1;

  for (const direction of SHORELINE_CHAIN_DIRECTIONS) {
    const neighbor = {
      x: cell.x + direction.x,
      y: cell.y + direction.y,
    };
    if (isMountainHexCell(materialSemanticModel, neighbor)) {
      continue;
    }

    boundaryFactor = Math.min(
      boundaryFactor,
      getMountainExposedEdgeHeightFactor(point, cell, neighbor)
    );
  }

  return boundaryFactor;
}

function getMountainExposedEdgeHeightFactor(
  point: { x: number; y: number },
  cell: GridCoordinate,
  neighbor: GridCoordinate
): number {
  const center = hexToPixel(cell.x, cell.y);
  const neighborCenter = hexToPixel(neighbor.x, neighbor.y);
  const normal = normalizeVector2({
    x: neighborCenter.x - center.x,
    y: neighborCenter.y - center.y,
  });
  const tangent = { x: -normal.y, y: normal.x };
  const edgeCenter = {
    x: (center.x + neighborCenter.x) * 0.5,
    y: (center.y + neighborCenter.y) * 0.5,
  };
  const edgeDepth =
    (point.x - edgeCenter.x) * -normal.x +
    (point.y - edgeCenter.y) * -normal.y;
  const alongEdge =
    (point.x - edgeCenter.x) * tangent.x +
    (point.y - edgeCenter.y) * tangent.y;
  const edgeNoise = valueNoise2d(
    alongEdge * 4.8 + cell.x * 0.71,
    cell.y * 0.71 - alongEdge * 1.9
  );
  const insetWidth =
    MOUNTAIN_HEIGHT_EDGE_INSET_MIN +
    (MOUNTAIN_HEIGHT_EDGE_INSET_MAX - MOUNTAIN_HEIGHT_EDGE_INSET_MIN) *
      edgeNoise;
  const raggedDepth =
    edgeDepth +
    (edgeNoise - 0.5) * 0.10 +
    (valueNoise2d(point.x * 6.2 + 8.7, point.y * 6.2 - 4.9) - 0.5) * 0.045;

  return smoothstepRange(0.035, insetWidth, raggedDepth);
}

function isMountainHexCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate
): boolean {
  return materialSemanticModel.mountainByCellKey.get(getHexCellKey(cell.x, cell.y)) === true;
}

function isLandTerrainHexCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate
): boolean {
  return materialSemanticModel.landByCellKey.get(getHexCellKey(cell.x, cell.y)) === true;
}

function isLandTerrainSample(
  materialSemanticModel: CampaignMaterialSemanticModel,
  u: number,
  v: number
): boolean {
  const point = terrainUvToHexPoint(u, v);
  const cell = pixelToRoundedHex(point.x, point.y);

  return materialSemanticModel.landByCellKey.get(getHexCellKey(cell.x, cell.y)) === true;
}

function isNonMountainTerrainHexCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate
): boolean {
  const cellKey = getHexCellKey(cell.x, cell.y);

  return (
    materialSemanticModel.landByCellKey.get(cellKey) === true &&
    materialSemanticModel.mountainByCellKey.get(cellKey) !== true
  );
}

function valueNoise2d(x: number, y: number): number {
  const cellX = Math.floor(x);
  const cellY = Math.floor(y);
  const localX = x - cellX;
  const localY = y - cellY;
  const curveX = localX * localX * (3 - 2 * localX);
  const curveY = localY * localY * (3 - 2 * localY);
  const bottomLeft = hash2d(cellX, cellY);
  const bottomRight = hash2d(cellX + 1, cellY);
  const topLeft = hash2d(cellX, cellY + 1);
  const topRight = hash2d(cellX + 1, cellY + 1);
  const bottom = bottomLeft + (bottomRight - bottomLeft) * curveX;
  const top = topLeft + (topRight - topLeft) * curveX;

  return bottom + (top - bottom) * curveY;
}

function hash2d(x: number, y: number): number {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

function fract(value: number): number {
  return value - Math.floor(value);
}

function smoothstepRange(edge0: number, edge1: number, value: number): number {
  const amount = clamp((value - edge0) / Math.max(edge1 - edge0, 0.000001), 0, 1);

  return amount * amount * (3 - 2 * amount);
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
  return addTerrainVertex(vertices, u, v, u, v, height, normal);
}

function addTerrainVertex(
  vertices: number[],
  positionU: number,
  positionV: number,
  sampleU: number,
  sampleV: number,
  height: number,
  normal: [number, number, number]
): number {
  const vertexIndex = vertices.length / 8;
  vertices.push(
    (positionU - 0.5) * 2,
    (0.5 - positionV) * 2,
    height * HEIGHT_SCALE,
    sampleU,
    sampleV,
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
  const leftHeight = sampleSmoothedHeightAt(heights, columns, rows, u - deltaU, v);
  const rightHeight = sampleSmoothedHeightAt(heights, columns, rows, u + deltaU, v);
  const topHeight = sampleSmoothedHeightAt(heights, columns, rows, u, v - deltaV);
  const bottomHeight = sampleSmoothedHeightAt(heights, columns, rows, u, v + deltaV);
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

function sampleSmoothedHeightAt(
  heights: Float32Array,
  columns: number,
  rows: number,
  u: number,
  v: number
): number {
  const radiusU = TERRAIN_NORMAL_SMOOTH_RADIUS_PIXELS / Math.max(columns - 1, 1);
  const radiusV = TERRAIN_NORMAL_SMOOTH_RADIUS_PIXELS / Math.max(rows - 1, 1);
  const center = sampleHeightAt(heights, columns, rows, u, v);
  const horizontal =
    sampleHeightAt(heights, columns, rows, u - radiusU, v) +
    sampleHeightAt(heights, columns, rows, u + radiusU, v);
  const vertical =
    sampleHeightAt(heights, columns, rows, u, v - radiusV) +
    sampleHeightAt(heights, columns, rows, u, v + radiusV);
  const diagonal =
    sampleHeightAt(heights, columns, rows, u - radiusU, v - radiusV) +
    sampleHeightAt(heights, columns, rows, u + radiusU, v - radiusV) +
    sampleHeightAt(heights, columns, rows, u - radiusU, v + radiusV) +
    sampleHeightAt(heights, columns, rows, u + radiusU, v + radiusV);

  return (center * 4 + horizontal * 2 + vertical * 2 + diagonal) / 16;
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

function updateTextureImage(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  image: TexImageSource
): void {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
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
  sampleHeightAtUv: (u: number, v: number) => number
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
        sampleHeightAtUv
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
          sampleHeightAtUv
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
  sampleHeightAtUv: (u: number, v: number) => number
): number {
  const height = sampleHeightAtUv(u, v);
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
