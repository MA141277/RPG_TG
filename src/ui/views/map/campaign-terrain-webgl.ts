import type {
  CoordinateSpace,
  GridCoordinate,
  HexCoordinate,
  HexCoordinateSystem,
  HexTravelGrid,
} from "../../../application/navigation/travel-to-coordinate";
import type {
  CampaignHexGridDefinition,
  CampaignHexStructureGround,
  CampaignFortCityRulesDefinition,
  CampaignMapNodeMeshDefinition,
  CampaignVegetationMeshDefinition,
  CampaignVegetationRulesDefinition,
} from "../../../domain/map";
import actorFragmentShaderRaw from "./shaders/campaign-actor.frag.glsl?raw";
import actorVertexShaderRaw from "./shaders/campaign-actor.vert.glsl?raw";
import fortCityFragmentShaderRaw from "./shaders/campaign-fort-city.frag.glsl?raw";
import fortCityInstancedVertexShaderRaw from "./shaders/campaign-fort-city-instanced.vert.glsl?raw";
import terrainFragmentShaderRaw from "./shaders/campaign-terrain.frag.glsl?raw";
import terrainVertexShaderRaw from "./shaders/campaign-terrain.vert.glsl?raw";
import structureShadowFragmentShaderRaw from "./shaders/campaign-structure-shadow.frag.glsl?raw";
import vegetationFragmentShaderRaw from "./shaders/campaign-vegetation.frag.glsl?raw";
import vegetationShadowFragmentShaderRaw from "./shaders/campaign-vegetation-shadow.frag.glsl?raw";
import vegetationShadowVertexShaderRaw from "./shaders/campaign-vegetation-shadow.vert.glsl?raw";
import vegetationVertexShaderRaw from "./shaders/campaign-vegetation.vert.glsl?raw";
import {
  getRegisteredCampaignFortCityAsset,
  type RegisteredCampaignFortCityAsset,
} from "./campaign-fort-city-asset-registry";
import {
  IDENTITY_MATRIX_4,
  clamp,
  createPerspectiveMatrix,
  createRotationXMatrix,
  createScaleMatrix,
  createTranslationMatrix,
  easeOutCubic,
  invertMatrix4,
  multiplyMatrices,
  readMatrixValue,
  smoothstep,
  type Mat4,
} from "./campaign-terrain-math";

type CampaignTerrainInput = {
  canvas: HTMLCanvasElement;
  textureUrl: string;
  heightUrl: string;
  materialUrl: string;
  campaignHexGridUrl: string | null;
  campaignVegetationRulesUrl: string | null;
  campaignFortCityAssetId: string | null;
  campaignFortCityRulesUrl: string | null;
  campaignFortWallMeshUrl: string | null;
  grassTextureUrl: string | null;
  grassNormalTextureUrl: string | null;
  sandTextureUrl: string | null;
  villageGroundTextureUrl: string | null;
  cityGroundTextureUrl: string | null;
  rockTextureUrl: string | null;
  snowTextureUrl: string | null;
  waterTextureUrl: string | null;
  renderMode: "terrain" | "actor";
};

type MeshData = {
  vertices: Float32Array;
  indices: Uint32Array;
};

type CampaignTerrainWorldScale = {
  x: number;
  y: number;
};

type CampaignTerrainHexPointBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type CampaignTerrainCoordinateSystem = {
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"];
  hexPointBounds: CampaignTerrainHexPointBounds;
  worldScale: CampaignTerrainWorldScale;
};

type CampaignStructureGroundSemantic = CampaignHexStructureGround;

const CAMPAIGN_STRUCTURE_GROUND_SEMANTIC_VALUE: Record<
  CampaignStructureGroundSemantic,
  number
> = {
  farmland: 64,
  village: 128,
  city: 255,
};

function isCampaignStructureGroundSemantic(
  value: unknown
): value is CampaignStructureGroundSemantic {
  return value === "farmland" || value === "village" || value === "city";
}

type ActorMeshData = {
  vertices: Float32Array;
  indices: Uint16Array;
};

type FortWallMeshData = {
  vertices: Float32Array;
  indices: Uint32Array;
  drawGroups: FortWallMeshDrawGroup[];
};

type VegetationMeshData = {
  vertices: Float32Array;
  indices: Uint32Array;
  shadowVertices: Float32Array;
  shadowIndices: Uint32Array;
  instanceCount: number;
};

type CampaignProjectedShadowMeshData = {
  vertices: Float32Array;
  indices: Uint16Array;
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

type CampaignFortCityRulesAsset = CampaignFortCityRulesDefinition & {
  variants: Array<CampaignFortCityRulesDefinition["variants"][number] & {
    meshUrl: string;
  }>;
};

type CampaignSettlementVillageRulesAsset = NonNullable<
  CampaignFortCityRulesDefinition["settlementVillage"]
> & {
  variants: CampaignFortCityRulesAsset["variants"];
};

type CampaignStructureBuildingRulesAsset = {
  count: CampaignFortCityRulesAsset["count"];
  lod: CampaignFortCityRulesAsset["lod"];
  variants: CampaignFortCityRulesAsset["variants"];
  placement: CampaignFortCityRulesAsset["placement"];
  shader: CampaignFortCityRulesAsset["shader"];
};

type CampaignFortCityAsset = {
  rules: CampaignFortCityRulesAsset;
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

type CampaignFortCityBuildingInstance = {
  mesh: VegetationMeshAsset | null;
  variant: CampaignFortCityRulesAsset["variants"][number];
  u: number;
  v: number;
  rotation: number;
  scale: number;
  colorJitter: number;
  footprintRadius: number;
};

type CampaignStructureBuildingCacheKind = "city" | "village";

type CampaignStructureBuildingCellCacheEntry = {
  signature: string;
  instances: CampaignFortCityBuildingInstance[];
};

type CampaignStructureBuildingChunkCache = Map<
  string,
  CampaignStructureBuildingCellCacheEntry
>;

type CampaignStructureBuildingCache = Map<
  string,
  CampaignStructureBuildingChunkCache
>;

type CampaignFortCityInstancedBatch = {
  mesh: VegetationMeshAsset;
  variant: CampaignFortCityRulesAsset["variants"][number];
  instances: CampaignFortCityBuildingInstance[];
  instanceData: Float32Array;
};

type CampaignFortCityInstancedRenderModel = {
  signature: string;
  batches: CampaignFortCityInstancedBatch[];
  instanceCount: number;
};

type CampaignFortCityInstancedVariantResource = {
  mesh: VegetationMeshAsset;
  vertexBuffer: WebGLBuffer;
  indexBuffer: WebGLBuffer;
  indexCount: number;
};

type CampaignFortCityVisibleFort = {
  fort: FortCityInstance;
  targetCount: number;
  priority: number;
};

type CampaignFortCityFortAllocation = {
  fort: FortCityInstance;
  count: number;
  targetCount: number;
};

type CampaignFortCityAcceptedPoint = {
  x: number;
  y: number;
  radius: number;
};

type FortWallMeshAsset = {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
  drawGroups: Array<{
    materialName: string;
    textureUrl: string | null;
    start: number;
    count: number;
  }>;
  placement: CampaignMapNodeMeshDefinition["placement"];
  texturesByUrl: Map<string, HTMLImageElement>;
};

type FortWallMeshDrawGroup = {
  textureUrl: string | null;
  start: number;
  count: number;
};

type FortWallInstance = {
  u: number;
  v: number;
  key: string;
  x: number;
  y: number;
};

type FortCityInstance = FortWallInstance;

type CampaignRuntimeMarker = {
  id: string;
  cityId: string | null;
  name: string;
  x: number;
  y: number;
  kind: "city" | "settlement" | "fort" | "landmark";
  summary: string;
  isRevealed: boolean;
  left: number;
  bottom: number;
  u: number;
  v: number;
  historicalCharacters: {
    primary: string[];
    secondary: string[];
    background: string[];
    notes: string;
  } | null;
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

const GRID_COLUMNS = 768;
const GRID_ROWS = 680;
const HEIGHT_SCALE = 0.0675;
const TERRAIN_SCALE = 1.46;
const CAMERA_TILT_TOP_DOWN_RADIANS = -0.36;
const CAMERA_TILT_CLOSE_RADIANS = -0.99;
const CAMERA_TILT_TOP_DOWN_SCALE = 8;
const CAMERA_TILT_CLOSE_SCALE = 80;
const CAMERA_BASE_DISTANCE = 20;
const CAMERA_OFFSET_UNIT = 0.0032;
const CAMERA_REFERENCE_SCALE = 15;
const FOV_RADIANS = 24 * Math.PI / 180;
const ACTOR_MODEL_BASE_SCALE = 0.016;
const ACTOR_MODEL_FACING_OFFSET_RADIANS = Math.PI / 2;
const ACTOR_ANIMATION_BLEND_DURATION_MS = 180;
const HEX_TERRAIN_SCALE = 138;
const HEX_MAP_ASPECT = 1.1285;
const DEFAULT_TERRAIN_WORLD_SCALE: CampaignTerrainWorldScale = { x: 1, y: 1 };
let currentTerrainWorldScale: CampaignTerrainWorldScale = DEFAULT_TERRAIN_WORLD_SCALE;
const SMOOTH_TERRAIN_MESH_STEP = 1;
const CAMPAIGN_TERRAIN_CHUNK_HEX_SIZE = 8;
const CAMPAIGN_TERRAIN_MAX_PENDING_CHUNKS = 12;
const CAMPAIGN_TERRAIN_STARTUP_READY_CHUNK_COUNT = 9;
const CAMPAIGN_TERRAIN_ACTIVE_CHUNK_RADIUS = 2;
const CAMPAIGN_TERRAIN_CHUNK_PADDING_HEX = 2;
const CAMPAIGN_TERRAIN_CHUNK_MIN_COLUMNS = 32;
const CAMPAIGN_TERRAIN_CHUNK_MIN_ROWS = 32;
const CAMPAIGN_TERRAIN_CHUNK_CACHE_DB_NAME = "campaign-terrain-cache-v1";
const CAMPAIGN_TERRAIN_CHUNK_CACHE_STORE_NAME = "chunks";
const CAMPAIGN_TERRAIN_CHUNK_ALGORITHM_VERSION = "2026-08-02-solid-ridge-mountains-v1";
const SMOOTH_TERRAIN_PASSES = 2;
const SMOOTH_TERRAIN_LAND_BLEND = 0.65;
const SMOOTH_TERRAIN_COAST_BLEND = 0.35;
const NON_MOUNTAIN_HEIGHT_FLATTEN_STRENGTH = 0.82;
const NON_MOUNTAIN_HEIGHT_EDGE_FADE_START = 0.30;
const NON_MOUNTAIN_HEIGHT_EDGE_FADE_END = 0.50;
const NON_MOUNTAIN_HEIGHT_SMOOTH_STRENGTH = 0.34;
const MOUNTAIN_FLOOR_DIFFUSION_PASSES = 48;
const MOUNTAIN_FLOOR_SMOOTH_PASSES = 4;
const MOUNTAIN_REFERENCE_STRENGTH_FLOOR = 0.48;
const MOUNTAIN_REFERENCE_STRENGTH_RANDOM_MIN = 0.48;
const MOUNTAIN_REFERENCE_STRENGTH_RANDOM_MAX = 0.76;
const MOUNTAIN_HEIGHT_DELTA_MIN = 0.070;
const MOUNTAIN_HEIGHT_DELTA_REFERENCE_SCALE = 0.28;
const MOUNTAIN_HEIGHT_BODY_STRENGTH = 0.46;
const MOUNTAIN_HEIGHT_PEAK_STRENGTH = 0.66;
const MOUNTAIN_HEIGHT_RIDGE_STRENGTH = 0.46;
const MOUNTAIN_HEIGHT_VALLEY_STRENGTH = 0.0;
const MOUNTAIN_HEIGHT_VALLEY_PEAK_GUARD = 1.24;
const MOUNTAIN_HEIGHT_DETAIL_STRENGTH = 0.058;
const MOUNTAIN_HEIGHT_PEAK_FIELD_SPACING = 1.9;
const MOUNTAIN_HEIGHT_EDGE_INSET_MIN = 0.10;
const MOUNTAIN_HEIGHT_EDGE_INSET_MAX = 0.34;
const MOUNTAIN_HEIGHT_CONTINUITY_BLEND = 0.22;
const MOUNTAIN_HEIGHT_ERODED_FBM_GAIN = 0.48;
const MOUNTAIN_HEIGHT_ERODED_FBM_LACUNARITY = 2.03;
const MOUNTAIN_HEIGHT_ERODED_FBM_GRADIENT_DAMPING = 0.58;
const MOUNTAIN_HEIGHT_ERODED_FBM_GRADIENT_EPSILON = 0.018;
const MOUNTAIN_HEIGHT_SUMMIT_ROUNDING_START = 0.64;
const MOUNTAIN_HEIGHT_SUMMIT_ROUNDING_STRENGTH = 0.02;
const TERRAIN_GRID_LAND_OPACITY = 0.08;
const TERRAIN_GRID_WATER_OPACITY = 0.015;
const TERRAIN_NORMAL_SAMPLE_RADIUS_PIXELS = 4;
const TERRAIN_NORMAL_SMOOTH_RADIUS_PIXELS = 3;
const TERRAIN_NORMAL_RELIEF_SCALE = 2.85;
const TERRAIN_DIRECTIONAL_LIGHT_STRENGTH = 0.18;
const TERRAIN_BACK_SHADOW_STRENGTH = 0.32;
const TERRAIN_STEEP_SHADOW_STRENGTH = 0;
const TERRAIN_WATER_SHADOW_STRENGTH = 0.12;
const CAMPAIGN_MODEL_DIRECTIONAL_LIGHT_STRENGTH = 0.18;
const CAMPAIGN_MODEL_BACK_SHADOW_STRENGTH = 0.32;
const CAMPAIGN_MODEL_STEEP_SHADOW_STRENGTH = 0;
const TERRAIN_CAMERA_LIGHT_HEIGHT = 0.26;
const TERRAIN_CAMERA_LIGHT_HORIZONTAL_PULL = 0.58;
const TERRAIN_LAND_TEXTURE_TILING = 7.5;
const CAMPAIGN_STRUCTURE_SHADOW_OPACITY = 0.18;
const CAMPAIGN_STRUCTURE_SHADOW_RADIUS_SCALE_X = 0.64;
const CAMPAIGN_STRUCTURE_SHADOW_RADIUS_SCALE_Y = 0.46;
const CAMPAIGN_STRUCTURE_SHADOW_LIGHT_OFFSET_SCALE = 0.08;
const CAMPAIGN_STRUCTURE_SHADOW_LIFT = 0.00050;
const CAMPAIGN_STRUCTURE_MODEL_LOD_HIDE_BELOW_SCALE = 8;
const CAMPAIGN_STRUCTURE_MODEL_LOD_REDUCED_BELOW_SCALE = 20;
const CAMPAIGN_STRUCTURE_MODEL_LOD_REDUCED_BUDGET_RATIO = 0.35;
const CAMPAIGN_ACTOR_SHADOW_OPACITY = 0.52;
const CAMPAIGN_ACTOR_SHADOW_RADIUS_SCALE_X = 1.18;
const CAMPAIGN_ACTOR_SHADOW_RADIUS_SCALE_Y = 0.72;
const CAMPAIGN_ACTOR_SHADOW_LIGHT_OFFSET_SCALE = 0.30;
const CAMPAIGN_ACTOR_SHADOW_LIFT = 0.00046;
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
const WATER_ANIMATION_FRAME_INTERVAL_MS = 1000 / 24;
const vertexShaderSource = terrainVertexShaderRaw;
const fragmentShaderSource = terrainFragmentShaderRaw;
const actorVertexShaderSource = actorVertexShaderRaw;
const actorFragmentShaderSource = actorFragmentShaderRaw;
const vegetationVertexShaderSource = vegetationVertexShaderRaw;
const vegetationFragmentShaderSource = vegetationFragmentShaderRaw;
const vegetationShadowVertexShaderSource = vegetationShadowVertexShaderRaw;
const vegetationShadowFragmentShaderSource = vegetationShadowFragmentShaderRaw;
const structureShadowFragmentShaderSource = structureShadowFragmentShaderRaw;
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
const REVEAL_HEX_CORNER_OFFSETS = [
  { x: 0, y: -1 },
  { x: Math.sqrt(3) / 2, y: -0.5 },
  { x: Math.sqrt(3) / 2, y: 0.5 },
  { x: 0, y: 1 },
  { x: -Math.sqrt(3) / 2, y: 0.5 },
  { x: -Math.sqrt(3) / 2, y: -0.5 },
] as const;

export type CampaignTerrainCamera = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type CampaignTerrainCloudProjectionUniforms = {
  inverseTerrainMatrix: Mat4;
  viewportAspectRatio: number;
  terrainScale: number;
  heightScale: number;
  terrainWorldScale: CampaignTerrainWorldScale;
  cameraScaleRatio: number;
  cameraReferenceScale: number;
  cameraBaseDistance: number;
  fovRadians: number;
};

export function createCampaignTerrainCameraCenteredOnCoordinate(input: {
  coordinate: GridCoordinate;
  coordinateSpace: CoordinateSpace;
  scale: number;
}): CampaignTerrainCamera {
  const u = input.coordinate.x / Math.max(input.coordinateSpace.width, 1);
  const v = 1 - input.coordinate.y / Math.max(input.coordinateSpace.height, 1);

  return createCampaignTerrainCameraCenteredOnUv({
    u,
    v,
    scale: input.scale,
    worldScale: DEFAULT_TERRAIN_WORLD_SCALE,
  });
}

function createCampaignTerrainCameraCenteredOnUv(input: {
  u: number;
  v: number;
  scale: number;
  worldScale: CampaignTerrainWorldScale;
}): CampaignTerrainCamera {
  const safeScale = Math.max(input.scale, 0.1);
  const worldPoint = createTerrainWorldPoint(input.u, input.v, 0, input.worldScale);
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
  getLoadingProgress: () => CampaignTerrainLoadingProgress;
  hasActorAsset: boolean;
  inputSignature: string;
  projectionInput: CampaignTerrainProjectionInput;
  travelGrid: HexTravelGrid;
  sampleHeightAtUv: (u: number, v: number) => number;
};

export type CampaignTerrainLoadingProgress = {
  loaded: number;
  total: number;
  pending: number;
  ready: boolean;
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
let terrainChunkLoadingDeferredUntilMs = 0;
let terrainChunkLoadingHoldCount = 0;
let terrainChunkLoadingResumeTimeoutId: number | null = null;

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
  signature: string;
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"];
  terrainCoordinates: CampaignTerrainCoordinateSystem;
  worldScale: CampaignTerrainWorldScale;
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
  terrainByCellKey: Map<string, string>;
  referenceHeightByCellKey: Map<string, number>;
  structureGroundByCellKey: Map<string, CampaignStructureGroundSemantic>;
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
const campaignMarkerSourceCache = new WeakMap<HTMLScriptElement, CampaignRuntimeMarker[]>();
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

export function deferCampaignTerrainChunkLoadingUntil(timestampMs: number): void {
  if (!Number.isFinite(timestampMs)) {
    return;
  }

  terrainChunkLoadingDeferredUntilMs = Math.max(
    terrainChunkLoadingDeferredUntilMs,
    timestampMs
  );
  scheduleCampaignTerrainChunkLoadingResume();
}

export function holdCampaignTerrainChunkLoading(): () => void {
  let released = false;
  terrainChunkLoadingHoldCount += 1;
  if (terrainChunkLoadingResumeTimeoutId != null) {
    window.clearTimeout(terrainChunkLoadingResumeTimeoutId);
    terrainChunkLoadingResumeTimeoutId = null;
  }

  return () => {
    if (released) {
      return;
    }

    released = true;
    terrainChunkLoadingHoldCount = Math.max(terrainChunkLoadingHoldCount - 1, 0);
    scheduleCampaignTerrainChunkLoadingResume();
  };
}

function getCampaignTerrainChunkLoadingResumeDelayMs(): number {
  return Math.max(terrainChunkLoadingDeferredUntilMs - performance.now(), 0);
}

function isCampaignTerrainChunkLoadingDeferred(): boolean {
  return terrainChunkLoadingHoldCount > 0 ||
    getCampaignTerrainChunkLoadingResumeDelayMs() > 0;
}

function isCampaignTerrainChunkLoadingHeld(): boolean {
  return terrainChunkLoadingHoldCount > 0;
}

function scheduleCampaignTerrainChunkLoadingResume(): void {
  if (terrainChunkLoadingResumeTimeoutId != null) {
    window.clearTimeout(terrainChunkLoadingResumeTimeoutId);
    terrainChunkLoadingResumeTimeoutId = null;
  }

  if (terrainChunkLoadingHoldCount > 0) {
    return;
  }

  const delayMs = getCampaignTerrainChunkLoadingResumeDelayMs();
  if (delayMs <= 0) {
    requestCampaignTerrainRender("static");
    return;
  }

  terrainChunkLoadingResumeTimeoutId = window.setTimeout(() => {
    terrainChunkLoadingResumeTimeoutId = null;
    requestCampaignTerrainRender("static");
  }, delayMs);
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
  currentCamera = scaleCampaignTerrainCameraForWorldScale(camera, currentTerrainWorldScale);
  for (const renderer of activeRenderers.values()) {
    renderer.requestRender("static");
  }
}

function scaleCampaignTerrainCameraForWorldScale(
  camera: CampaignTerrainCamera,
  worldScale: CampaignTerrainWorldScale
): CampaignTerrainCamera {
  return {
    scale: camera.scale,
    offsetX: camera.offsetX * worldScale.x,
    offsetY: camera.offsetY * worldScale.y,
  };
}

function rescaleCampaignTerrainCamera(
  camera: CampaignTerrainCamera,
  previousWorldScale: CampaignTerrainWorldScale,
  nextWorldScale: CampaignTerrainWorldScale
): CampaignTerrainCamera {
  return {
    scale: camera.scale,
    offsetX: camera.offsetX * nextWorldScale.x / Math.max(previousWorldScale.x, 0.0001),
    offsetY: camera.offsetY * nextWorldScale.y / Math.max(previousWorldScale.y, 0.0001),
  };
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

export function getCampaignTerrainCloudProjectionUniforms(
  root: ParentNode
): CampaignTerrainCloudProjectionUniforms {
  const terrainCanvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  const renderer =
    terrainCanvas == null ? null : activeRenderers.get(terrainCanvas) ?? null;
  const viewportAspectRatio =
    terrainCanvas == null
      ? 1
      : terrainCanvas.width / Math.max(terrainCanvas.height, 1);
  const terrainMatrix = createTerrainMatrix(viewportAspectRatio);

  return {
    inverseTerrainMatrix: invertMatrix4(terrainMatrix),
    viewportAspectRatio,
    terrainScale: TERRAIN_SCALE,
    heightScale: HEIGHT_SCALE,
    terrainWorldScale:
      renderer?.projectionInput.materialSemanticModel.worldScale ??
      DEFAULT_TERRAIN_WORLD_SCALE,
    cameraScaleRatio: currentCamera.scale / CAMERA_REFERENCE_SCALE,
    cameraReferenceScale: CAMERA_REFERENCE_SCALE,
    cameraBaseDistance: CAMERA_BASE_DISTANCE,
    fovRadians: FOV_RADIANS,
  };
}

export function getCampaignTerrainRevealUvPolygon(input: {
  hex: HexCoordinate;
  coordinateSystem: HexCoordinateSystem;
  radiusScale?: number;
}): { u: number; v: number }[] {
  const center = hexToPixel(input.hex.x, input.hex.y);
  const radiusScale = input.radiusScale ?? 1;

  return REVEAL_HEX_CORNER_OFFSETS.map((corner) => ({
    u: hexPointToTerrainU(
      center.x + corner.x * radiusScale,
      input.coordinateSystem
    ),
    v: hexPointToTerrainV(
      center.y + corner.y * radiusScale,
      input.coordinateSystem
    ),
  }));
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
  const height = renderer.sampleHeightAtUv(heightU, heightV);
  const screenPoint = projectPoint(
    matrix,
    createTerrainWorldPoint(u, v, height, renderer.projectionInput.materialSemanticModel.worldScale)
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
    renderer.sampleHeightAtUv,
    renderer.projectionInput.materialSemanticModel.worldScale
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

export function getCampaignTerrainHexCoordinateSystem(
  root: ParentNode
): HexCoordinateSystem | null {
  const terrainCanvas = root.querySelector<HTMLCanvasElement>("[data-campaign-map-terrain]");
  if (terrainCanvas == null) {
    return null;
  }

  return activeRenderers.get(terrainCanvas)?.projectionInput.materialSemanticModel.coordinateSystem ?? null;
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
    campaignFortCityAssetId:
      renderMode === "terrain" ? canvas.dataset.campaignFortCityAssetId ?? null : null,
    campaignFortCityRulesUrl:
      renderMode === "terrain" ? canvas.dataset.campaignFortCityRulesUrl ?? null : null,
    campaignFortWallMeshUrl:
      renderMode === "terrain" ? canvas.dataset.campaignFortWallMeshUrl ?? null : null,
    grassTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapGrassTextureUrl ?? null : null,
    grassNormalTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapGrassNormalTextureUrl ?? null : null,
    sandTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapSandTextureUrl ?? null : null,
    villageGroundTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapVillageGroundTextureUrl ?? null : null,
    cityGroundTextureUrl:
      renderMode === "terrain" ? canvas.dataset.mapCityGroundTextureUrl ?? null : null,
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
    input.campaignFortCityAssetId ?? "",
    input.campaignFortCityRulesUrl ?? "",
    input.campaignFortWallMeshUrl ?? "",
    input.grassTextureUrl ?? "",
    input.grassNormalTextureUrl ?? "",
    input.sandTextureUrl ?? "",
    input.villageGroundTextureUrl ?? "",
    input.cityGroundTextureUrl ?? "",
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

export function getCampaignTerrainLoadingProgress(
  root: ParentNode
): CampaignTerrainLoadingProgress {
  const canvases = Array.from(
    root.querySelectorAll<HTMLCanvasElement>("[data-campaign-map-terrain]")
  );

  if (canvases.length === 0) {
    return {
      loaded: 1,
      total: 1,
      pending: 0,
      ready: true,
    };
  }

  let loaded = 0;
  let total = 0;
  let pending = 0;
  let ready = true;

  for (const canvas of canvases) {
    const renderer = activeRenderers.get(canvas);
    if (renderer == null) {
      total += 1;
      if (pendingRendererCanvases.has(canvas)) {
        pending += 1;
      }
      ready = false;
      continue;
    }

    const progress = renderer.getLoadingProgress();
    loaded += progress.loaded;
    total += progress.total;
    pending += progress.pending;
    ready = ready && progress.ready;
  }

  return {
    loaded,
    total: Math.max(total, 1),
    pending,
    ready,
  };
}

export function waitForCampaignTerrainReady(
  root: ParentNode,
  onProgress?: (progress: CampaignTerrainLoadingProgress) => void
): Promise<void> {
  return new Promise((resolve) => {
    const tick = (): void => {
      const progress = getCampaignTerrainLoadingProgress(root);
      onProgress?.(progress);

      if (progress.ready) {
        resolve();
        return;
      }

      window.requestAnimationFrame(tick);
    };

    tick();
  });
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
  const fortWallAssetPromise =
    renderTerrain && input.campaignFortWallMeshUrl != null
      ? loadCampaignFortWallMeshAsset(input.campaignFortWallMeshUrl).catch(
        (error: unknown) => {
          console.error("Failed to load campaign fort wall mesh asset.", error);
          return null;
        }
      )
      : Promise.resolve(null);
  const fortCityAssetPromise =
    renderTerrain &&
      (input.campaignFortCityAssetId != null ||
        input.campaignFortCityRulesUrl != null)
      ? loadCampaignFortCityAsset({
        assetId: input.campaignFortCityAssetId,
        rulesUrl: input.campaignFortCityRulesUrl,
      }).catch(
        (error: unknown) => {
          console.error("Failed to load campaign fort city asset.", error);
          return null;
        }
      )
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
  const grassNormalTextureImagePromise =
    renderTerrain && input.grassNormalTextureUrl != null
      ? loadImage(input.grassNormalTextureUrl).catch((error: unknown) => {
        console.error("Failed to load campaign grass normal texture.", error);
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
  const villageGroundTextureImagePromise =
    renderTerrain && input.villageGroundTextureUrl != null
      ? loadImage(input.villageGroundTextureUrl).catch((error: unknown) => {
        console.error("Failed to load campaign village ground texture.", error);
        return null;
      })
      : Promise.resolve(null);
  const cityGroundTextureImagePromise =
    renderTerrain && input.cityGroundTextureUrl != null
      ? loadImage(input.cityGroundTextureUrl).catch((error: unknown) => {
        console.error("Failed to load campaign city ground texture.", error);
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
    grassNormalTextureImage,
    sandTextureImage,
    villageGroundTextureImage,
    cityGroundTextureImage,
    rockTextureImage,
    snowTextureImage,
    actorAsset,
    fortWallAsset,
    fortCityAsset,
    campaignHexGrid,
    vegetationAsset,
  ] = await Promise.all([
    loadImage(input.textureUrl),
    loadImage(input.materialUrl),
    waterTextureImagePromise,
    grassTextureImagePromise,
    grassNormalTextureImagePromise,
    sandTextureImagePromise,
    villageGroundTextureImagePromise,
    cityGroundTextureImagePromise,
    rockTextureImagePromise,
    snowTextureImagePromise,
    actorAssetPromise,
    fortWallAssetPromise,
    fortCityAssetPromise,
    campaignHexGridPromise,
    vegetationAssetPromise,
  ]);
  const semanticData = await getCampaignTerrainSemanticData({
    input,
    materialImage,
    campaignHexGrid,
    fortCityRules: fortCityAsset?.rules ?? null,
  });
  const { materialSemanticModel, travelGrid } = semanticData;
  const previousTerrainWorldScale = currentTerrainWorldScale;
  currentTerrainWorldScale = materialSemanticModel.worldScale;
  currentCamera = rescaleCampaignTerrainCamera(
    currentCamera,
    previousTerrainWorldScale,
    currentTerrainWorldScale
  );
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
  const fortCityProgram = createProgram(
    gl,
    vegetationVertexShaderSource,
    fortCityFragmentShaderRaw
  );
  const fortCityInstancedArrays =
    renderTerrain ? gl.getExtension("ANGLE_instanced_arrays") : null;
  const fortCityInstancedProgram =
    fortCityInstancedArrays == null
      ? null
      : createProgram(
        gl,
        fortCityInstancedVertexShaderRaw,
        fortCityFragmentShaderRaw
      );
  const vegetationShadowProgram = createProgram(
    gl,
    vegetationShadowVertexShaderSource,
    vegetationShadowFragmentShaderSource
  );
  const structureShadowProgram = createProgram(
    gl,
    vegetationShadowVertexShaderSource,
    structureShadowFragmentShaderSource
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
  const hexPointBoundsLocation = gl.getUniformLocation(program, "uHexPointBounds");
  const waterTextureLocation = gl.getUniformLocation(program, "uWaterTexture");
  const grassTextureLocation = gl.getUniformLocation(program, "uGrassTexture");
  const grassNormalTextureLocation = gl.getUniformLocation(program, "uGrassNormalTexture");
  const sandTextureLocation = gl.getUniformLocation(program, "uSandTexture");
  const structureGroundTextureLocation = gl.getUniformLocation(
    program,
    "uStructureGroundTexture"
  );
  const rockTextureLocation = gl.getUniformLocation(program, "uRockTexture");
  const snowTextureLocation = gl.getUniformLocation(program, "uSnowTexture");
  const villageGroundTextureEnabledLocation = gl.getUniformLocation(
    program,
    "uVillageGroundTextureEnabled"
  );
  const cityGroundTextureEnabledLocation = gl.getUniformLocation(
    program,
    "uCityGroundTextureEnabled"
  );
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
  const fortCityPositionLocation = gl.getAttribLocation(
    fortCityProgram,
    "aPosition"
  );
  const fortCityNormalLocation = gl.getAttribLocation(fortCityProgram, "aNormal");
  const fortCityColorLocation = gl.getAttribLocation(fortCityProgram, "aColor");
  const fortCityMatrixLocation = gl.getUniformLocation(fortCityProgram, "uMatrix");
  const fortCityCameraTiltSinCosLocation = gl.getUniformLocation(
    fortCityProgram,
    "uTerrainCameraTiltSinCos"
  );
  const fortCityAmbientLocation = gl.getUniformLocation(fortCityProgram, "uAmbient");
  const fortCityDirectionalLocation = gl.getUniformLocation(
    fortCityProgram,
    "uDirectional"
  );
  const fortCityViewportSizeLocation = gl.getUniformLocation(
    fortCityProgram,
    "uTerrainViewportSize"
  );
  const fortCityCameraLightHeightLocation = gl.getUniformLocation(
    fortCityProgram,
    "uTerrainCameraLightHeight"
  );
  const fortCityCameraLightHorizontalPullLocation = gl.getUniformLocation(
    fortCityProgram,
    "uTerrainCameraLightHorizontalPull"
  );
  const fortCityTerrainDirectionalLightStrengthLocation = gl.getUniformLocation(
    fortCityProgram,
    "uTerrainDirectionalLightStrength"
  );
  const fortCityTerrainBackShadowStrengthLocation = gl.getUniformLocation(
    fortCityProgram,
    "uTerrainBackShadowStrength"
  );
  const fortCityTerrainSteepShadowStrengthLocation = gl.getUniformLocation(
    fortCityProgram,
    "uTerrainSteepShadowStrength"
  );
  const fortCityInstancedPositionLocation =
    fortCityInstancedProgram == null
      ? -1
      : gl.getAttribLocation(fortCityInstancedProgram, "aPosition");
  const fortCityInstancedNormalLocation =
    fortCityInstancedProgram == null
      ? -1
      : gl.getAttribLocation(fortCityInstancedProgram, "aNormal");
  const fortCityInstancedColorLocation =
    fortCityInstancedProgram == null
      ? -1
      : gl.getAttribLocation(fortCityInstancedProgram, "aColor");
  const fortCityInstancedCenterLocation =
    fortCityInstancedProgram == null
      ? -1
      : gl.getAttribLocation(fortCityInstancedProgram, "aInstanceCenter");
  const fortCityInstancedRotationLocation =
    fortCityInstancedProgram == null
      ? -1
      : gl.getAttribLocation(fortCityInstancedProgram, "aInstanceRotation");
  const fortCityInstancedWorldScaleLocation =
    fortCityInstancedProgram == null
      ? -1
      : gl.getAttribLocation(fortCityInstancedProgram, "aInstanceWorldScale");
  const fortCityInstancedLiftLocation =
    fortCityInstancedProgram == null
      ? -1
      : gl.getAttribLocation(fortCityInstancedProgram, "aInstanceLift");
  const fortCityInstancedColorJitterLocation =
    fortCityInstancedProgram == null
      ? -1
      : gl.getAttribLocation(fortCityInstancedProgram, "aInstanceColorJitter");
  const fortCityInstancedMatrixLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(fortCityInstancedProgram, "uMatrix");
  const fortCityInstancedCameraTiltSinCosLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(
        fortCityInstancedProgram,
        "uTerrainCameraTiltSinCos"
      );
  const fortCityInstancedAmbientLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(fortCityInstancedProgram, "uAmbient");
  const fortCityInstancedDirectionalLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(fortCityInstancedProgram, "uDirectional");
  const fortCityInstancedViewportSizeLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(fortCityInstancedProgram, "uTerrainViewportSize");
  const fortCityInstancedCameraLightHeightLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(
        fortCityInstancedProgram,
        "uTerrainCameraLightHeight"
      );
  const fortCityInstancedCameraLightHorizontalPullLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(
        fortCityInstancedProgram,
        "uTerrainCameraLightHorizontalPull"
      );
  const fortCityInstancedTerrainDirectionalLightStrengthLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(
        fortCityInstancedProgram,
        "uTerrainDirectionalLightStrength"
      );
  const fortCityInstancedTerrainBackShadowStrengthLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(
        fortCityInstancedProgram,
        "uTerrainBackShadowStrength"
      );
  const fortCityInstancedTerrainSteepShadowStrengthLocation =
    fortCityInstancedProgram == null
      ? null
      : gl.getUniformLocation(
        fortCityInstancedProgram,
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
  const structureShadowPositionLocation = gl.getAttribLocation(
    structureShadowProgram,
    "aPosition"
  );
  const structureShadowUvLocation = gl.getAttribLocation(structureShadowProgram, "aUv");
  const structureShadowMatrixLocation = gl.getUniformLocation(
    structureShadowProgram,
    "uMatrix"
  );
  const structureShadowOpacityLocation = gl.getUniformLocation(
    structureShadowProgram,
    "uOpacity"
  );
  const actorVertexBuffer = gl.createBuffer();
  const actorIndexBuffer = gl.createBuffer();
  const fortCityVertexBuffer = gl.createBuffer();
  const fortCityIndexBuffer = gl.createBuffer();
  const settlementVillageVertexBuffer = gl.createBuffer();
  const settlementVillageIndexBuffer = gl.createBuffer();
  const fortCityInstancedInstanceBuffer =
    fortCityInstancedProgram == null ? null : gl.createBuffer();
  const fortWallVertexBuffer = gl.createBuffer();
  const fortWallIndexBuffer = gl.createBuffer();
  const vegetationVertexBuffer = gl.createBuffer();
  const vegetationIndexBuffer = gl.createBuffer();
  const vegetationShadowVertexBuffer = gl.createBuffer();
  const vegetationShadowIndexBuffer = gl.createBuffer();
  const projectedShadowVertexBuffer = gl.createBuffer();
  const projectedShadowIndexBuffer = gl.createBuffer();
  const texture = createTexture(gl, textureImage);
  const materialSemanticTexture = createTexture(
    gl,
    materialSemanticModel.source,
    {
      minFilter: gl.NEAREST,
      magFilter: gl.NEAREST,
    }
  );
  const grassTexture = createTexture(gl, grassTextureImage ?? textureImage);
  const grassNormalTexture = createTexture(
    gl,
    grassNormalTextureImage ?? grassTextureImage ?? textureImage
  );
  const sandTexture = createTexture(gl, sandTextureImage ?? textureImage);
  const structureGroundTexture = createTexture(
    gl,
    createStructureGroundTextureAtlas(
      villageGroundTextureImage ?? grassTextureImage ?? textureImage,
      cityGroundTextureImage ?? grassTextureImage ?? textureImage
    )
  );
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
  const fortWallTexturesByUrl = new Map<string, WebGLTexture>();
  if (fortWallAsset != null) {
    for (const [textureUrl, textureImage] of fortWallAsset.texturesByUrl.entries()) {
      fortWallTexturesByUrl.set(textureUrl, createRepeatableTexture(gl, textureImage));
    }
  }

  const missingResources = [
    positionLocation < 0 ? "aPosition" : null,
    uvLocation < 0 ? "aUv" : null,
    normalLocation < 0 ? "aNormal" : null,
    matrixLocation == null ? "uMatrix" : null,
    heightScaleLocation == null ? "uHeightScale" : null,
    terrainCameraTiltSinCosLocation == null ? "uTerrainCameraTiltSinCos" : null,
    materialSemanticTextureLocation == null ? "uMaterialSemanticTexture" : null,
    materialSemanticTextureSizeLocation == null ? "uMaterialSemanticTextureSize" : null,
    materialSemanticBoundsLocation == null ? "uMaterialSemanticBounds" : null,
    shorelineDistanceTextureLocation == null ? "uShorelineDistanceTexture" : null,
    shorelineDistanceRangeLocation == null ? "uShorelineDistanceRange" : null,
    shorelineDistanceBoundsLocation == null ? "uShorelineDistanceBounds" : null,
    hexPointBoundsLocation == null ? "uHexPointBounds" : null,
    waterTextureLocation == null ? "uWaterTexture" : null,
    grassTextureLocation == null ? "uGrassTexture" : null,
    grassNormalTextureLocation == null ? "uGrassNormalTexture" : null,
    sandTextureLocation == null ? "uSandTexture" : null,
    structureGroundTextureLocation == null ? "uStructureGroundTexture" : null,
    rockTextureLocation == null ? "uRockTexture" : null,
    snowTextureLocation == null ? "uSnowTexture" : null,
    villageGroundTextureEnabledLocation == null ? "uVillageGroundTextureEnabled" : null,
    cityGroundTextureEnabledLocation == null ? "uCityGroundTextureEnabled" : null,
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
    fortCityPositionLocation < 0 ? "fortCity.aPosition" : null,
    fortCityNormalLocation < 0 ? "fortCity.aNormal" : null,
    fortCityColorLocation < 0 ? "fortCity.aColor" : null,
    fortCityMatrixLocation == null ? "fortCity.uMatrix" : null,
    fortCityCameraTiltSinCosLocation == null ? "fortCity.uTerrainCameraTiltSinCos" : null,
    fortCityAmbientLocation == null ? "fortCity.uAmbient" : null,
    fortCityDirectionalLocation == null ? "fortCity.uDirectional" : null,
    fortCityViewportSizeLocation == null ? "fortCity.uTerrainViewportSize" : null,
    fortCityCameraLightHeightLocation == null ? "fortCity.uTerrainCameraLightHeight" : null,
    fortCityCameraLightHorizontalPullLocation == null
      ? "fortCity.uTerrainCameraLightHorizontalPull"
      : null,
    fortCityTerrainDirectionalLightStrengthLocation == null
      ? "fortCity.uTerrainDirectionalLightStrength"
      : null,
    fortCityTerrainBackShadowStrengthLocation == null
      ? "fortCity.uTerrainBackShadowStrength"
      : null,
    fortCityTerrainSteepShadowStrengthLocation == null
      ? "fortCity.uTerrainSteepShadowStrength"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedPositionLocation < 0
      ? "fortCityInstanced.aPosition"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedNormalLocation < 0
      ? "fortCityInstanced.aNormal"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedColorLocation < 0
      ? "fortCityInstanced.aColor"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedCenterLocation < 0
      ? "fortCityInstanced.aInstanceCenter"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedRotationLocation < 0
      ? "fortCityInstanced.aInstanceRotation"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedWorldScaleLocation < 0
      ? "fortCityInstanced.aInstanceWorldScale"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedLiftLocation < 0
      ? "fortCityInstanced.aInstanceLift"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedColorJitterLocation < 0
      ? "fortCityInstanced.aInstanceColorJitter"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedMatrixLocation == null
      ? "fortCityInstanced.uMatrix"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedCameraTiltSinCosLocation == null
      ? "fortCityInstanced.uTerrainCameraTiltSinCos"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedAmbientLocation == null
      ? "fortCityInstanced.uAmbient"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedDirectionalLocation == null
      ? "fortCityInstanced.uDirectional"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedViewportSizeLocation == null
      ? "fortCityInstanced.uTerrainViewportSize"
      : null,
    fortCityInstancedProgram != null && fortCityInstancedCameraLightHeightLocation == null
      ? "fortCityInstanced.uTerrainCameraLightHeight"
      : null,
    fortCityInstancedProgram != null &&
      fortCityInstancedCameraLightHorizontalPullLocation == null
      ? "fortCityInstanced.uTerrainCameraLightHorizontalPull"
      : null,
    fortCityInstancedProgram != null &&
      fortCityInstancedTerrainDirectionalLightStrengthLocation == null
      ? "fortCityInstanced.uTerrainDirectionalLightStrength"
      : null,
    fortCityInstancedProgram != null &&
      fortCityInstancedTerrainBackShadowStrengthLocation == null
      ? "fortCityInstanced.uTerrainBackShadowStrength"
      : null,
    fortCityInstancedProgram != null &&
      fortCityInstancedTerrainSteepShadowStrengthLocation == null
      ? "fortCityInstanced.uTerrainSteepShadowStrength"
      : null,
    vegetationShadowPositionLocation < 0 ? "vegetationShadow.aPosition" : null,
    vegetationShadowUvLocation < 0 ? "vegetationShadow.aUv" : null,
    vegetationShadowMatrixLocation == null ? "vegetationShadow.uMatrix" : null,
    vegetationShadowOpacityLocation == null ? "vegetationShadow.uOpacity" : null,
    structureShadowPositionLocation < 0 ? "structureShadow.aPosition" : null,
    structureShadowUvLocation < 0 ? "structureShadow.aUv" : null,
    structureShadowMatrixLocation == null ? "structureShadow.uMatrix" : null,
    structureShadowOpacityLocation == null ? "structureShadow.uOpacity" : null,
    actorVertexBuffer == null ? "actor.vertexBuffer" : null,
    actorIndexBuffer == null ? "actor.indexBuffer" : null,
    fortCityVertexBuffer == null ? "fortCity.vertexBuffer" : null,
    fortCityIndexBuffer == null ? "fortCity.indexBuffer" : null,
    settlementVillageVertexBuffer == null ? "settlementVillage.vertexBuffer" : null,
    settlementVillageIndexBuffer == null ? "settlementVillage.indexBuffer" : null,
    fortCityInstancedProgram != null && fortCityInstancedInstanceBuffer == null
      ? "fortCityInstanced.instanceBuffer"
      : null,
    fortWallVertexBuffer == null ? "fortWall.vertexBuffer" : null,
    fortWallIndexBuffer == null ? "fortWall.indexBuffer" : null,
    vegetationVertexBuffer == null ? "vegetation.vertexBuffer" : null,
    vegetationIndexBuffer == null ? "vegetation.indexBuffer" : null,
    vegetationShadowVertexBuffer == null ? "vegetationShadow.vertexBuffer" : null,
    vegetationShadowIndexBuffer == null ? "vegetationShadow.indexBuffer" : null,
    projectedShadowVertexBuffer == null ? "projectedShadow.vertexBuffer" : null,
    projectedShadowIndexBuffer == null ? "projectedShadow.indexBuffer" : null,
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
  let fortCityMesh: VegetationMeshData | null = null;
  let settlementVillageMesh: VegetationMeshData | null = null;
  let fortWallMesh: FortWallMeshData | null = null;
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  let frameId: number | null = null;
  let isDisposed = false;
  let hasPendingRender = false;
  let projectedPointsNeedSync = true;
  let lastActorSignature = "";
  let lastFortCityMeshSignature = "";
  let lastFortCityInstancedModelSignature = "";
  let lastFortCityShadowMeshSignature = "";
  let lastSettlementVillageMeshSignature = "";
  let lastSettlementVillageInstancedModelSignature = "";
  let lastSettlementVillageShadowMeshSignature = "";
  let lastFortWallMeshSignature = "";
  let lastCampaignMarkerLayerSignature = "";
  let lastVegetationMeshSignature = "";
  let lastChunkShorelineSignature = getShorelineDistanceTextureSignature(terrainBeachTuning);
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;
  let vegetationMesh: VegetationMeshData | null = null;
  let fortCityInstancedModel: CampaignFortCityInstancedRenderModel | null = null;
  let settlementVillageInstancedModel: CampaignFortCityInstancedRenderModel | null = null;
  let fortCityShadowMesh: CampaignProjectedShadowMeshData | null = null;
  let settlementVillageShadowMesh: CampaignProjectedShadowMeshData | null = null;
  const structureBuildingCache: CampaignStructureBuildingCache = new Map();
  const fortCityInstancedVariantResourcesById =
    new Map<string, CampaignFortCityInstancedVariantResource>();
  const actorAnimationState = createActorAnimationPlaybackState();
  const animatesTerrainWater = renderTerrain && waterTexture != null;
  const animatesActorModel = shouldRenderActorInThisCanvas && actorAsset != null && actorTexture != null;
  const animatesVegetation =
    renderTerrain && vegetationAsset != null && vegetationCells.length > 0;
  let dynamicAnimationTimeoutId: number | null = null;
  const chunkDataByKey = new Map<string, CampaignTerrainChunkData>();
  const chunkResourcesByKey = new Map<string, CampaignTerrainChunkRenderResource>();
  const pendingChunkKeys = new Set<string>();
  const failedChunkKeys = new Set<string>();
  const deferredChunkUploadsByKey = new Map<string, CampaignTerrainChunkData>();
  let deferredChunkUploadTimeoutId: number | null = null;
  const allChunkKeys = getCampaignTerrainChunkKeysForCells(materialSemanticModel.cells);
  const getRendererLoadingProgress = (): CampaignTerrainLoadingProgress => {
    if (!renderTerrain) {
      return {
        loaded: 1,
        total: 1,
        pending: pendingChunkKeys.size,
        ready: true,
      };
    }

    const activeChunkKeys = getCampaignTerrainActiveChunkKeys(
      allChunkKeys,
      materialSemanticModel.terrainCoordinates,
      materialSemanticModel.worldScale
    );
    const startupChunkKeys = getCampaignTerrainStartupChunkKeys(
      allChunkKeys,
      materialSemanticModel.terrainCoordinates,
      materialSemanticModel.worldScale
    );
    const loaded = activeChunkKeys.filter(
      (chunkKey) =>
        chunkResourcesByKey.has(chunkKey) ||
        failedChunkKeys.has(chunkKey)
    ).length;
    const total = Math.max(activeChunkKeys.length, 1);

    return {
      loaded,
      total,
      pending: pendingChunkKeys.size + deferredChunkUploadsByKey.size,
      ready: startupChunkKeys.every(
        (chunkKey) =>
          chunkResourcesByKey.has(chunkKey) ||
          failedChunkKeys.has(chunkKey)
      ),
    };
  };
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
  const clearCampaignStructureRenderModels = (): void => {
    lastFortCityMeshSignature = "";
    lastFortCityInstancedModelSignature = "";
    lastFortCityShadowMeshSignature = "";
    lastSettlementVillageMeshSignature = "";
    lastSettlementVillageInstancedModelSignature = "";
    lastSettlementVillageShadowMeshSignature = "";
    fortCityMesh = null;
    settlementVillageMesh = null;
    fortCityInstancedModel = null;
    settlementVillageInstancedModel = null;
    fortCityShadowMesh = null;
    settlementVillageShadowMesh = null;
  };
  const clearCampaignStructureBuildingCache = (): void => {
    structureBuildingCache.clear();
    clearCampaignStructureRenderModels();
  };
  const drawCampaignProjectedShadowMesh = (
    mesh: CampaignProjectedShadowMeshData | null,
    opacity: number,
    terrainMatrix: Mat4
  ): void => {
    if (mesh == null || mesh.indices.length <= 0 || opacity <= 0) {
      return;
    }

    gl.useProgram(vegetationShadowProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, projectedShadowVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, projectedShadowIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.DYNAMIC_DRAW);
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
    gl.uniform1f(vegetationShadowOpacityLocation, opacity);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  };
  const drawCampaignStructureShadowMesh = (
    mesh: CampaignProjectedShadowMeshData | null,
    opacity: number,
    terrainMatrix: Mat4
  ): void => {
    if (mesh == null || mesh.indices.length <= 0 || opacity <= 0) {
      return;
    }

    gl.useProgram(structureShadowProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, projectedShadowVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, projectedShadowIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.DYNAMIC_DRAW);
    const shadowStride = 5 * Float32Array.BYTES_PER_ELEMENT;
    gl.enableVertexAttribArray(structureShadowPositionLocation);
    gl.vertexAttribPointer(
      structureShadowPositionLocation,
      3,
      gl.FLOAT,
      false,
      shadowStride,
      0
    );
    gl.enableVertexAttribArray(structureShadowUvLocation);
    gl.vertexAttribPointer(
      structureShadowUvLocation,
      2,
      gl.FLOAT,
      false,
      shadowStride,
      3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.uniformMatrix4fv(structureShadowMatrixLocation, false, terrainMatrix);
    gl.uniform1f(structureShadowOpacityLocation, opacity);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  };
  const drawCampaignFortCityInstancedModel = (
    model: CampaignFortCityInstancedRenderModel,
    rules: CampaignStructureBuildingRulesAsset,
    terrainMatrix: Mat4,
    terrainCameraTiltRadians: number,
    polygonOffsetFactor: number,
    polygonOffsetUnits: number
  ): boolean => {
    const programForDraw = fortCityInstancedProgram;
    const arraysForDraw = fortCityInstancedArrays;
    const instanceBufferForDraw = fortCityInstancedInstanceBuffer;
    const matrixForDraw = fortCityInstancedMatrixLocation;
    const tiltForDraw = fortCityInstancedCameraTiltSinCosLocation;
    const ambientForDraw = fortCityInstancedAmbientLocation;
    const directionalForDraw = fortCityInstancedDirectionalLocation;
    const viewportSizeForDraw = fortCityInstancedViewportSizeLocation;
    const lightHeightForDraw = fortCityInstancedCameraLightHeightLocation;
    const lightHorizontalPullForDraw =
      fortCityInstancedCameraLightHorizontalPullLocation;
    const terrainDirectionalForDraw =
      fortCityInstancedTerrainDirectionalLightStrengthLocation;
    const terrainBackShadowForDraw =
      fortCityInstancedTerrainBackShadowStrengthLocation;
    const terrainSteepShadowForDraw =
      fortCityInstancedTerrainSteepShadowStrengthLocation;
    if (
      programForDraw == null ||
      arraysForDraw == null ||
      instanceBufferForDraw == null ||
      matrixForDraw == null ||
      tiltForDraw == null ||
      ambientForDraw == null ||
      directionalForDraw == null ||
      viewportSizeForDraw == null ||
      lightHeightForDraw == null ||
      lightHorizontalPullForDraw == null ||
      terrainDirectionalForDraw == null ||
      terrainBackShadowForDraw == null ||
      terrainSteepShadowForDraw == null
    ) {
      return false;
    }
    if (model.instanceCount <= 0) {
      return true;
    }

    gl.useProgram(programForDraw);
    gl.uniformMatrix4fv(matrixForDraw, false, terrainMatrix);
    gl.uniform2f(
      tiltForDraw,
      Math.sin(terrainCameraTiltRadians),
      Math.cos(terrainCameraTiltRadians)
    );
    gl.uniform1f(ambientForDraw, rules.shader.ambient);
    gl.uniform1f(directionalForDraw, rules.shader.directional);
    gl.uniform2f(viewportSizeForDraw, input.canvas.width, input.canvas.height);
    gl.uniform1f(lightHeightForDraw, TERRAIN_CAMERA_LIGHT_HEIGHT);
    gl.uniform1f(
      lightHorizontalPullForDraw,
      TERRAIN_CAMERA_LIGHT_HORIZONTAL_PULL
    );
    gl.uniform1f(
      terrainDirectionalForDraw,
      CAMPAIGN_MODEL_DIRECTIONAL_LIGHT_STRENGTH
    );
    gl.uniform1f(terrainBackShadowForDraw, CAMPAIGN_MODEL_BACK_SHADOW_STRENGTH);
    gl.uniform1f(terrainSteepShadowForDraw, CAMPAIGN_MODEL_STEEP_SHADOW_STRENGTH);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(polygonOffsetFactor, polygonOffsetUnits);
    gl.depthMask(true);

    const vertexStride = 9 * Float32Array.BYTES_PER_ELEMENT;
    const instanceStride = 8 * Float32Array.BYTES_PER_ELEMENT;
    for (const batch of model.batches) {
      if (batch.instances.length <= 0) {
        continue;
      }
      const resource = getOrCreateCampaignFortCityInstancedVariantResource({
        gl,
        resourcesById: fortCityInstancedVariantResourcesById,
        mesh: batch.mesh,
      });
      if (resource == null) {
        continue;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, resource.vertexBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resource.indexBuffer);
      gl.enableVertexAttribArray(fortCityInstancedPositionLocation);
      gl.vertexAttribPointer(
        fortCityInstancedPositionLocation,
        3,
        gl.FLOAT,
        false,
        vertexStride,
        0
      );
      gl.enableVertexAttribArray(fortCityInstancedNormalLocation);
      gl.vertexAttribPointer(
        fortCityInstancedNormalLocation,
        3,
        gl.FLOAT,
        false,
        vertexStride,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(fortCityInstancedColorLocation);
      gl.vertexAttribPointer(
        fortCityInstancedColorLocation,
        3,
        gl.FLOAT,
        false,
        vertexStride,
        6 * Float32Array.BYTES_PER_ELEMENT
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBufferForDraw);
      gl.bufferData(gl.ARRAY_BUFFER, batch.instanceData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(fortCityInstancedCenterLocation);
      gl.vertexAttribPointer(
        fortCityInstancedCenterLocation,
        3,
        gl.FLOAT,
        false,
        instanceStride,
        0
      );
      gl.enableVertexAttribArray(fortCityInstancedRotationLocation);
      gl.vertexAttribPointer(
        fortCityInstancedRotationLocation,
        2,
        gl.FLOAT,
        false,
        instanceStride,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(fortCityInstancedWorldScaleLocation);
      gl.vertexAttribPointer(
        fortCityInstancedWorldScaleLocation,
        1,
        gl.FLOAT,
        false,
        instanceStride,
        5 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(fortCityInstancedLiftLocation);
      gl.vertexAttribPointer(
        fortCityInstancedLiftLocation,
        1,
        gl.FLOAT,
        false,
        instanceStride,
        6 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(fortCityInstancedColorJitterLocation);
      gl.vertexAttribPointer(
        fortCityInstancedColorJitterLocation,
        1,
        gl.FLOAT,
        false,
        instanceStride,
        7 * Float32Array.BYTES_PER_ELEMENT
      );
      arraysForDraw.vertexAttribDivisorANGLE(fortCityInstancedCenterLocation, 1);
      arraysForDraw.vertexAttribDivisorANGLE(fortCityInstancedRotationLocation, 1);
      arraysForDraw.vertexAttribDivisorANGLE(
        fortCityInstancedWorldScaleLocation,
        1
      );
      arraysForDraw.vertexAttribDivisorANGLE(fortCityInstancedLiftLocation, 1);
      arraysForDraw.vertexAttribDivisorANGLE(
        fortCityInstancedColorJitterLocation,
        1
      );
      arraysForDraw.drawElementsInstancedANGLE(
        gl.TRIANGLES,
        resource.indexCount,
        gl.UNSIGNED_INT,
        0,
        batch.instances.length
      );
    }

    arraysForDraw.vertexAttribDivisorANGLE(fortCityInstancedCenterLocation, 0);
    arraysForDraw.vertexAttribDivisorANGLE(fortCityInstancedRotationLocation, 0);
    arraysForDraw.vertexAttribDivisorANGLE(
      fortCityInstancedWorldScaleLocation,
      0
    );
    arraysForDraw.vertexAttribDivisorANGLE(fortCityInstancedLiftLocation, 0);
    arraysForDraw.vertexAttribDivisorANGLE(
      fortCityInstancedColorJitterLocation,
      0
    );
    gl.disable(gl.POLYGON_OFFSET_FILL);
    return true;
  };
  const uploadCampaignTerrainChunk = (chunk: CampaignTerrainChunkData): void => {
    if (isDisposed) {
      return;
    }

    chunkDataByKey.set(chunk.key, chunk);
    if (!renderTerrain || chunkResourcesByKey.has(chunk.key)) {
      projectedPointsNeedSync = true;
      lastVegetationMeshSignature = "";
      clearCampaignStructureRenderModels();
      lastFortWallMeshSignature = "";
      fortWallMesh = null;
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
    clearCampaignStructureRenderModels();
    lastFortWallMeshSignature = "";
    fortWallMesh = null;
  };
  const scheduleDeferredChunkUploadFlush = (): void => {
    if (deferredChunkUploadTimeoutId != null) {
      window.clearTimeout(deferredChunkUploadTimeoutId);
      deferredChunkUploadTimeoutId = null;
    }

    if (isCampaignTerrainChunkLoadingHeld()) {
      return;
    }

    const delayMs = getCampaignTerrainChunkLoadingResumeDelayMs();
    if (delayMs <= 0) {
      requestRender("static");
      return;
    }

    deferredChunkUploadTimeoutId = window.setTimeout(() => {
      deferredChunkUploadTimeoutId = null;
      requestRender("static");
    }, delayMs);
  };
  const flushDeferredChunkUploads = (): void => {
    if (deferredChunkUploadsByKey.size <= 0) {
      return;
    }
    if (isCampaignTerrainChunkLoadingDeferred()) {
      scheduleDeferredChunkUploadFlush();
      return;
    }

    for (const chunk of deferredChunkUploadsByKey.values()) {
      uploadCampaignTerrainChunk(chunk);
    }
    deferredChunkUploadsByKey.clear();
  };
  const ensureCampaignTerrainChunkKeys = (keys: Iterable<string>): void => {
    if (isCampaignTerrainChunkLoadingDeferred()) {
      scheduleCampaignTerrainChunkLoadingResume();
      return;
    }

    for (const chunkKey of keys) {
      if (pendingChunkKeys.size >= CAMPAIGN_TERRAIN_MAX_PENDING_CHUNKS) {
        break;
      }
      if (
        chunkResourcesByKey.has(chunkKey) ||
        deferredChunkUploadsByKey.has(chunkKey) ||
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
        failedChunkKeys.delete(chunkKey);
        if (isCampaignTerrainChunkLoadingDeferred()) {
          deferredChunkUploadsByKey.set(chunk.key, chunk);
          scheduleDeferredChunkUploadFlush();
          return;
        }

        uploadCampaignTerrainChunk(chunk);
        requestRender("static");
      }).catch((error: unknown) => {
        pendingChunkKeys.delete(chunkKey);
        failedChunkKeys.add(chunkKey);
        console.error("Failed to build campaign terrain chunk.", error);
        requestRender("static");
      });
    }
  };
  const ensureActiveCampaignTerrainChunks = (): void => {
    ensureCampaignTerrainChunkKeys(
      getCampaignTerrainActiveChunkKeys(
        allChunkKeys,
        materialSemanticModel.terrainCoordinates,
        materialSemanticModel.worldScale
      )
    );
  };
  const disposeInactiveCampaignTerrainChunks = (activeChunkKeys: Set<string>): void => {
    for (const [chunkKey, chunkResource] of chunkResourcesByKey.entries()) {
      if (activeChunkKeys.has(chunkKey)) {
        continue;
      }

      gl.deleteBuffer(chunkResource.vertexBuffer);
      gl.deleteBuffer(chunkResource.indexBuffer);
      gl.deleteTexture(chunkResource.shorelineTexture);
      chunkResourcesByKey.delete(chunkKey);
      chunkDataByKey.delete(chunkKey);
      deferredChunkUploadsByKey.delete(chunkKey);
      failedChunkKeys.delete(chunkKey);
      projectedPointsNeedSync = true;
      lastVegetationMeshSignature = "";
      clearCampaignStructureRenderModels();
      lastFortWallMeshSignature = "";
      fortWallMesh = null;
    }
  };
  if (renderTerrain) {
    ensureActiveCampaignTerrainChunks();
    window.setTimeout(() => {
      if (!isDisposed) {
        ensureActiveCampaignTerrainChunks();
      }
    }, 0);
  } else {
    ensureActiveCampaignTerrainChunks();
  }
  const render = () => {
    if (isDisposed) {
      return;
    }

    frameId = null;
    hasPendingRender = false;
    resizeCanvasToDisplaySize(input.canvas);
    flushDeferredChunkUploads();
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
    const currentTerrainMatrix = createTerrainMatrix(
      input.canvas.width / Math.max(input.canvas.height, 1)
    );
    const activeChunkKeys = new Set(
      getCampaignTerrainActiveChunkKeys(
        allChunkKeys,
        materialSemanticModel.terrainCoordinates,
        materialSemanticModel.worldScale
      )
    );
    disposeInactiveCampaignTerrainChunks(activeChunkKeys);
    ensureActiveCampaignTerrainChunks();
    if (renderTerrain) {
      ensureActiveCampaignTerrainChunks();
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
      failedChunkKeys.clear();
      lastChunkShorelineSignature = chunkShorelineSignature;
      lastVegetationMeshSignature = "";
      clearCampaignStructureBuildingCache();
      lastFortWallMeshSignature = "";
      fortWallMesh = null;
    }

    if (renderTerrain) {
      const campaignMarkerLayerSignature = syncCampaignMarkerLayer({
        canvas: input.canvas,
        materialSemanticModel,
        loadedChunkKeys: new Set(chunkResourcesByKey.keys()),
      });
      if (campaignMarkerLayerSignature !== lastCampaignMarkerLayerSignature) {
        lastCampaignMarkerLayerSignature = campaignMarkerLayerSignature;
        projectedPointsNeedSync = true;
        clearCampaignStructureBuildingCache();
        lastFortWallMeshSignature = "";
        fortWallMesh = null;
      }
    }

    const loadedChunkKeys = new Set(
      [...chunkResourcesByKey.keys()].filter((chunkKey) =>
        activeChunkKeys.has(chunkKey)
      )
    );
    const activeChunkDataByKey = new Map(
      [...chunkDataByKey.entries()].filter(([chunkKey]) =>
        activeChunkKeys.has(chunkKey)
      )
    );
    const fortInstances = renderTerrain
      ? readCampaignFortWallInstances(
        input.canvas,
        loadedChunkKeys,
        materialSemanticModel,
        fortCityAsset?.rules ?? null
      )
      : [];
    const cityStructureInstances = renderTerrain
      ? readCampaignCityStructureInstances({
        canvas: input.canvas,
        loadedChunkKeys,
        materialSemanticModel,
        rules: fortCityAsset?.rules ?? null,
      })
      : [];
    const fortCityBuildingInstances =
      renderTerrain && fortCityAsset != null
        ? createCampaignFortCityBuildingInstances({
          asset: fortCityAsset,
          rules: fortCityAsset.rules,
          fortInstances: cityStructureInstances,
          matrix: createTerrainMatrix(
            input.canvas.width / Math.max(input.canvas.height, 1)
          ),
          sampleHeightAtUv,
          worldScale: materialSemanticModel.worldScale,
          terrainCoordinates: materialSemanticModel.terrainCoordinates,
          onVariantMeshNeeded: (variant) => {
            ensureCampaignFortCityVariantMesh(fortCityAsset, variant, () => {
              clearCampaignStructureBuildingCache();
              requestRender("static");
            });
          },
          cacheKind: "city",
          structureBuildingCache,
        })
        : [];
    const settlementVillageRules =
      fortCityAsset == null
        ? null
        : getCampaignSettlementVillageRules(fortCityAsset.rules);
    const settlementVillageInstances =
      renderTerrain && settlementVillageRules != null
        ? readCampaignSettlementVillageInstances({
          canvas: input.canvas,
          loadedChunkKeys,
          materialSemanticModel,
          cityHexKeys: new Set(cityStructureInstances.map((instance) => instance.key)),
          rules: fortCityAsset?.rules ?? null,
        })
        : [];
    const settlementVillageBuildingInstances =
      renderTerrain && fortCityAsset != null && settlementVillageRules != null
        ? createCampaignFortCityBuildingInstances({
          asset: fortCityAsset,
          rules: settlementVillageRules,
          fortInstances: settlementVillageInstances,
          matrix: createTerrainMatrix(
            input.canvas.width / Math.max(input.canvas.height, 1)
          ),
          sampleHeightAtUv,
          worldScale: materialSemanticModel.worldScale,
          terrainCoordinates: materialSemanticModel.terrainCoordinates,
          onVariantMeshNeeded: (variant) => {
            ensureCampaignFortCityVariantMesh(fortCityAsset, variant, () => {
              clearCampaignStructureBuildingCache();
              requestRender("static");
            });
          },
          cacheKind: "village",
          structureBuildingCache,
        })
        : [];
    const fortStructureAvoidancePoints = renderTerrain
      ? createCampaignFortStructureAvoidancePoints(
        fortInstances,
        [...fortCityBuildingInstances, ...settlementVillageBuildingInstances],
        fortCityAsset?.rules ?? null
      )
      : [];

    if (renderTerrain) {
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, waterTexture ?? texture);
      gl.uniform1i(waterTextureLocation, 2);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, grassTexture);
      gl.uniform1i(grassTextureLocation, 3);
      gl.activeTexture(gl.TEXTURE9);
      gl.bindTexture(gl.TEXTURE_2D, grassNormalTexture);
      gl.uniform1i(grassNormalTextureLocation, 9);
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, sandTexture);
      gl.uniform1i(sandTextureLocation, 4);
      gl.activeTexture(gl.TEXTURE5);
      gl.bindTexture(gl.TEXTURE_2D, rockTexture);
      gl.uniform1i(rockTextureLocation, 5);
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D, snowTexture);
      gl.uniform1i(snowTextureLocation, 6);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, structureGroundTexture);
      gl.uniform1i(structureGroundTextureLocation, 0);
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
      gl.uniform1f(
        villageGroundTextureEnabledLocation,
        villageGroundTextureImage == null ? 0 : 1
      );
      gl.uniform1f(
        cityGroundTextureEnabledLocation,
        cityGroundTextureImage == null ? 0 : 1
      );
      gl.uniform1f(timeSecondsLocation, performance.now() * 0.001);
      gl.uniform1f(heightScaleLocation, HEIGHT_SCALE);
      gl.uniform2f(
        terrainCameraTiltSinCosLocation,
        Math.sin(terrainCameraTilt),
        Math.cos(terrainCameraTilt)
      );
      gl.uniform1f(grassAmbientLightLocation, GRASS_AMBIENT_LIGHT);
      gl.uniform1f(grassTextureDetailLocation, GRASS_TEXTURE_DETAIL);
      gl.uniform1f(hexMapAspectLocation, materialSemanticModel.coordinateSystem.hexMapAspect);
      gl.uniform1f(hexTerrainScaleLocation, materialSemanticModel.coordinateSystem.hexTerrainScale);
      gl.uniform4f(
        hexPointBoundsLocation,
        materialSemanticModel.terrainCoordinates.hexPointBounds.minX,
        materialSemanticModel.terrainCoordinates.hexPointBounds.maxX,
        materialSemanticModel.terrainCoordinates.hexPointBounds.minY,
        materialSemanticModel.terrainCoordinates.hexPointBounds.maxY
      );
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
        vegetationAsset.rules,
        fortStructureAvoidancePoints
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
            activeChunkDataByKey
          ),
          asset: vegetationAsset,
          sampleHeightAtUv,
          matrix: terrainMatrix,
          canvasWidth: input.canvas.width,
          canvasHeight: input.canvas.height,
          worldScale: materialSemanticModel.worldScale,
          terrainCoordinates: materialSemanticModel.terrainCoordinates,
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
          CAMPAIGN_MODEL_DIRECTIONAL_LIGHT_STRENGTH
        );
        gl.uniform1f(
          vegetationTerrainBackShadowStrengthLocation,
          CAMPAIGN_MODEL_BACK_SHADOW_STRENGTH
        );
        gl.uniform1f(
          vegetationTerrainSteepShadowStrengthLocation,
          CAMPAIGN_MODEL_STEEP_SHADOW_STRENGTH
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

    if (
      renderTerrain &&
      settlementVillageRules != null &&
      settlementVillageBuildingInstances.length > 0
    ) {
      const terrainMatrix = createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1));
      const settlementVillageMeshSignature = getCampaignFortCityMeshSignature(
        settlementVillageBuildingInstances
      );
      if (
        settlementVillageShadowMesh == null ||
        settlementVillageMeshSignature !== lastSettlementVillageShadowMeshSignature
      ) {
        settlementVillageShadowMesh = createCampaignFortCityShadowMesh({
          instances: settlementVillageBuildingInstances,
          sampleHeightAtUv,
          rules: settlementVillageRules,
          matrix: terrainMatrix,
          viewportAspectRatio: input.canvas.width / Math.max(input.canvas.height, 1),
          worldScale: materialSemanticModel.worldScale,
        });
        lastSettlementVillageShadowMeshSignature = settlementVillageMeshSignature;
      }
      drawCampaignStructureShadowMesh(
        settlementVillageShadowMesh,
        CAMPAIGN_STRUCTURE_SHADOW_OPACITY * 0.82,
        terrainMatrix
      );
      const drewSettlementVillageInstanced =
        fortCityInstancedProgram != null &&
        (() => {
          if (
            settlementVillageInstancedModel == null ||
            settlementVillageMeshSignature !==
              lastSettlementVillageInstancedModelSignature
          ) {
            settlementVillageInstancedModel =
              createCampaignFortCityInstancedRenderModel({
                instances: settlementVillageBuildingInstances,
                sampleHeightAtUv,
                rules: settlementVillageRules,
                signature: settlementVillageMeshSignature,
                worldScale: materialSemanticModel.worldScale,
              });
            lastSettlementVillageInstancedModelSignature =
              settlementVillageMeshSignature;
          }

          return drawCampaignFortCityInstancedModel(
            settlementVillageInstancedModel,
            settlementVillageRules,
            terrainMatrix,
            terrainCameraTilt,
            -4.75,
            -8.75
          );
        })();

      if (!drewSettlementVillageInstanced) {
        if (
          settlementVillageMesh == null ||
          settlementVillageMeshSignature !== lastSettlementVillageMeshSignature
        ) {
          settlementVillageMesh = createCampaignFortCityMesh({
            instances: settlementVillageBuildingInstances,
            sampleHeightAtUv,
            rules: settlementVillageRules,
            worldScale: materialSemanticModel.worldScale,
          });
          gl.bindBuffer(gl.ARRAY_BUFFER, settlementVillageVertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, settlementVillageMesh.vertices, gl.DYNAMIC_DRAW);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, settlementVillageIndexBuffer);
          gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            settlementVillageMesh.indices,
            gl.DYNAMIC_DRAW
          );
          lastSettlementVillageMeshSignature = settlementVillageMeshSignature;
        }
      }

      if (
        !drewSettlementVillageInstanced &&
        settlementVillageMesh != null &&
        settlementVillageMesh.indices.length > 0
      ) {
        gl.useProgram(fortCityProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, settlementVillageVertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, settlementVillageIndexBuffer);
        const fortCityStride = 9 * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(fortCityPositionLocation);
        gl.vertexAttribPointer(
          fortCityPositionLocation,
          3,
          gl.FLOAT,
          false,
          fortCityStride,
          0
        );
        gl.enableVertexAttribArray(fortCityNormalLocation);
        gl.vertexAttribPointer(
          fortCityNormalLocation,
          3,
          gl.FLOAT,
          false,
          fortCityStride,
          3 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(fortCityColorLocation);
        gl.vertexAttribPointer(
          fortCityColorLocation,
          3,
          gl.FLOAT,
          false,
          fortCityStride,
          6 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.uniformMatrix4fv(fortCityMatrixLocation, false, terrainMatrix);
        gl.uniform2f(
          fortCityCameraTiltSinCosLocation,
          Math.sin(terrainCameraTilt),
          Math.cos(terrainCameraTilt)
        );
        gl.uniform1f(fortCityAmbientLocation, settlementVillageRules.shader.ambient);
        gl.uniform1f(
          fortCityDirectionalLocation,
          settlementVillageRules.shader.directional
        );
        gl.uniform2f(
          fortCityViewportSizeLocation,
          input.canvas.width,
          input.canvas.height
        );
        gl.uniform1f(fortCityCameraLightHeightLocation, TERRAIN_CAMERA_LIGHT_HEIGHT);
        gl.uniform1f(
          fortCityCameraLightHorizontalPullLocation,
          TERRAIN_CAMERA_LIGHT_HORIZONTAL_PULL
        );
        gl.uniform1f(
          fortCityTerrainDirectionalLightStrengthLocation,
          CAMPAIGN_MODEL_DIRECTIONAL_LIGHT_STRENGTH
        );
        gl.uniform1f(
          fortCityTerrainBackShadowStrengthLocation,
          CAMPAIGN_MODEL_BACK_SHADOW_STRENGTH
        );
        gl.uniform1f(
          fortCityTerrainSteepShadowStrengthLocation,
          CAMPAIGN_MODEL_STEEP_SHADOW_STRENGTH
        );
        gl.disable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(-4.75, -8.75);
        gl.depthMask(true);
        gl.drawElements(
          gl.TRIANGLES,
          settlementVillageMesh.indices.length,
          gl.UNSIGNED_INT,
          0
        );
        gl.disable(gl.POLYGON_OFFSET_FILL);
      }
    }

    if (
      renderTerrain &&
      fortCityAsset != null &&
      fortCityBuildingInstances.length > 0
    ) {
      const terrainMatrix = createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1));
      const fortCityMeshSignature = getCampaignFortCityMeshSignature(
        fortCityBuildingInstances
      );
      if (
        fortCityShadowMesh == null ||
        fortCityMeshSignature !== lastFortCityShadowMeshSignature
      ) {
        fortCityShadowMesh = createCampaignFortCityShadowMesh({
          instances: fortCityBuildingInstances,
          sampleHeightAtUv,
          rules: fortCityAsset.rules,
          matrix: terrainMatrix,
          viewportAspectRatio: input.canvas.width / Math.max(input.canvas.height, 1),
          worldScale: materialSemanticModel.worldScale,
        });
        lastFortCityShadowMeshSignature = fortCityMeshSignature;
      }
      drawCampaignStructureShadowMesh(
        fortCityShadowMesh,
        CAMPAIGN_STRUCTURE_SHADOW_OPACITY,
        terrainMatrix
      );
      const drewFortCityInstanced =
        fortCityInstancedProgram != null &&
        (() => {
          if (
            fortCityInstancedModel == null ||
            fortCityMeshSignature !== lastFortCityInstancedModelSignature
          ) {
            fortCityInstancedModel = createCampaignFortCityInstancedRenderModel({
              instances: fortCityBuildingInstances,
              sampleHeightAtUv,
              rules: fortCityAsset.rules,
              signature: fortCityMeshSignature,
              worldScale: materialSemanticModel.worldScale,
            });
            lastFortCityInstancedModelSignature = fortCityMeshSignature;
          }

          return drawCampaignFortCityInstancedModel(
            fortCityInstancedModel,
            fortCityAsset.rules,
            terrainMatrix,
            terrainCameraTilt,
            -5,
            -9
          );
        })();

      if (!drewFortCityInstanced) {
        if (
          fortCityMesh == null ||
          fortCityMeshSignature !== lastFortCityMeshSignature
        ) {
          fortCityMesh = createCampaignFortCityMesh({
            instances: fortCityBuildingInstances,
            sampleHeightAtUv,
            rules: fortCityAsset.rules,
            worldScale: materialSemanticModel.worldScale,
          });
          gl.bindBuffer(gl.ARRAY_BUFFER, fortCityVertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, fortCityMesh.vertices, gl.DYNAMIC_DRAW);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fortCityIndexBuffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, fortCityMesh.indices, gl.DYNAMIC_DRAW);
          lastFortCityMeshSignature = fortCityMeshSignature;
        }
      }

      if (
        !drewFortCityInstanced &&
        fortCityMesh != null &&
        fortCityMesh.indices.length > 0
      ) {
        gl.useProgram(fortCityProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, fortCityVertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fortCityIndexBuffer);
        const fortCityStride = 9 * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(fortCityPositionLocation);
        gl.vertexAttribPointer(
          fortCityPositionLocation,
          3,
          gl.FLOAT,
          false,
          fortCityStride,
          0
        );
        gl.enableVertexAttribArray(fortCityNormalLocation);
        gl.vertexAttribPointer(
          fortCityNormalLocation,
          3,
          gl.FLOAT,
          false,
          fortCityStride,
          3 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(fortCityColorLocation);
        gl.vertexAttribPointer(
          fortCityColorLocation,
          3,
          gl.FLOAT,
          false,
          fortCityStride,
          6 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.uniformMatrix4fv(fortCityMatrixLocation, false, terrainMatrix);
        gl.uniform2f(
          fortCityCameraTiltSinCosLocation,
          Math.sin(terrainCameraTilt),
          Math.cos(terrainCameraTilt)
        );
        gl.uniform1f(fortCityAmbientLocation, fortCityAsset.rules.shader.ambient);
        gl.uniform1f(
          fortCityDirectionalLocation,
          fortCityAsset.rules.shader.directional
        );
        gl.uniform2f(
          fortCityViewportSizeLocation,
          input.canvas.width,
          input.canvas.height
        );
        gl.uniform1f(fortCityCameraLightHeightLocation, TERRAIN_CAMERA_LIGHT_HEIGHT);
        gl.uniform1f(
          fortCityCameraLightHorizontalPullLocation,
          TERRAIN_CAMERA_LIGHT_HORIZONTAL_PULL
        );
        gl.uniform1f(
          fortCityTerrainDirectionalLightStrengthLocation,
          CAMPAIGN_MODEL_DIRECTIONAL_LIGHT_STRENGTH
        );
        gl.uniform1f(
          fortCityTerrainBackShadowStrengthLocation,
          CAMPAIGN_MODEL_BACK_SHADOW_STRENGTH
        );
        gl.uniform1f(
          fortCityTerrainSteepShadowStrengthLocation,
          CAMPAIGN_MODEL_STEEP_SHADOW_STRENGTH
        );
        gl.disable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(-5, -9);
        gl.depthMask(true);
        gl.drawElements(gl.TRIANGLES, fortCityMesh.indices.length, gl.UNSIGNED_INT, 0);
        gl.disable(gl.POLYGON_OFFSET_FILL);
      }
    }

    if (renderTerrain && fortWallAsset != null && fortWallTexturesByUrl.size > 0) {
      const fortWallMeshSignature = getCampaignFortWallMeshSignature(
        fortInstances
      );
      if (fortWallMesh == null || fortWallMeshSignature !== lastFortWallMeshSignature) {
        fortWallMesh = createCampaignFortWallMesh(
          fortWallAsset,
          fortInstances,
          sampleHeightAtUv,
          materialSemanticModel.worldScale
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, fortWallVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, fortWallMesh.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fortWallIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, fortWallMesh.indices, gl.DYNAMIC_DRAW);
        lastFortWallMeshSignature = fortWallMeshSignature;
      }

      if (fortWallMesh.indices.length > 0) {
        gl.useProgram(actorProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, fortWallVertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fortWallIndexBuffer);
        const fortWallStride = 8 * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(actorPositionLocation);
        gl.vertexAttribPointer(
          actorPositionLocation,
          3,
          gl.FLOAT,
          false,
          fortWallStride,
          0
        );
        gl.enableVertexAttribArray(actorNormalLocation);
        gl.vertexAttribPointer(
          actorNormalLocation,
          3,
          gl.FLOAT,
          false,
          fortWallStride,
          3 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.enableVertexAttribArray(actorUvLocation);
        gl.vertexAttribPointer(
          actorUvLocation,
          2,
          gl.FLOAT,
          false,
          fortWallStride,
          6 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.uniformMatrix4fv(
          actorMatrixLocation,
          false,
          createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1))
        );
        gl.uniform3f(actorLightLocation, -0.58, 0.52, 0.62);
        gl.uniform3f(actorTintLocation, 1, 1, 1);
        gl.uniform1f(actorForceOpaqueAlphaLocation, 0);
        gl.disable(gl.CULL_FACE);
        gl.depthMask(true);
        for (const drawGroup of fortWallMesh.drawGroups) {
          const textureObject =
            drawGroup.textureUrl == null
              ? null
              : fortWallTexturesByUrl.get(drawGroup.textureUrl);
          if (textureObject == null || drawGroup.count <= 0) {
            continue;
          }
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, textureObject);
          gl.uniform1i(actorTextureLocation, 0);
          gl.drawElements(
            gl.TRIANGLES,
            drawGroup.count,
            gl.UNSIGNED_INT,
            drawGroup.start * Uint32Array.BYTES_PER_ELEMENT
          );
        }
      }
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
      const terrainMatrix = createTerrainMatrix(input.canvas.width / Math.max(input.canvas.height, 1));
      const actorShadowMesh = createCampaignActorShadowMesh({
        actor,
        height: actorHeight,
        model: actorAsset.model,
        matrix: terrainMatrix,
        viewportAspectRatio: input.canvas.width / Math.max(input.canvas.height, 1),
        worldScale: materialSemanticModel.worldScale,
      });
      drawCampaignProjectedShadowMesh(
        actorShadowMesh,
        CAMPAIGN_ACTOR_SHADOW_OPACITY,
        terrainMatrix
      );
      const actorMesh = createActorMesh(
        actor,
        actorHeight,
        actorAsset.model,
        actorAsset.animations,
        actorAnimationState,
        materialSemanticModel.worldScale
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
        terrainMatrix
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
    getLoadingProgress: getRendererLoadingProgress,
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
      if (deferredChunkUploadTimeoutId != null) {
        window.clearTimeout(deferredChunkUploadTimeoutId);
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
      gl.deleteBuffer(fortCityVertexBuffer);
      gl.deleteBuffer(fortCityIndexBuffer);
      gl.deleteBuffer(settlementVillageVertexBuffer);
      gl.deleteBuffer(settlementVillageIndexBuffer);
      if (fortCityInstancedInstanceBuffer != null) {
        gl.deleteBuffer(fortCityInstancedInstanceBuffer);
      }
      for (const resource of fortCityInstancedVariantResourcesById.values()) {
        gl.deleteBuffer(resource.vertexBuffer);
        gl.deleteBuffer(resource.indexBuffer);
      }
      fortCityInstancedVariantResourcesById.clear();
      gl.deleteBuffer(fortWallVertexBuffer);
      gl.deleteBuffer(fortWallIndexBuffer);
      gl.deleteBuffer(vegetationVertexBuffer);
      gl.deleteBuffer(vegetationIndexBuffer);
      gl.deleteBuffer(vegetationShadowVertexBuffer);
      gl.deleteBuffer(vegetationShadowIndexBuffer);
      gl.deleteBuffer(projectedShadowVertexBuffer);
      gl.deleteBuffer(projectedShadowIndexBuffer);
      gl.deleteTexture(texture);
      gl.deleteTexture(materialSemanticTexture);
      gl.deleteTexture(grassTexture);
      gl.deleteTexture(sandTexture);
      gl.deleteTexture(structureGroundTexture);
      gl.deleteTexture(rockTexture);
      gl.deleteTexture(snowTexture);
      if (waterTexture != null) {
        gl.deleteTexture(waterTexture);
      }
      if (actorTexture != null) {
        gl.deleteTexture(actorTexture);
      }
      for (const fortWallTexture of fortWallTexturesByUrl.values()) {
        gl.deleteTexture(fortWallTexture);
      }
      gl.deleteProgram(program);
      gl.deleteProgram(actorProgram);
      gl.deleteProgram(vegetationProgram);
      gl.deleteProgram(fortCityProgram);
      if (fortCityInstancedProgram != null) {
        gl.deleteProgram(fortCityInstancedProgram);
      }
      gl.deleteProgram(vegetationShadowProgram);
      gl.deleteProgram(structureShadowProgram);
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
  fortCityRules: CampaignFortCityRulesAsset | null;
}): Promise<CampaignTerrainSemanticData> {
  const signature = getCampaignTerrainSemanticDataSignature(
    input.input,
    input.campaignHexGrid,
    input.fortCityRules
  );
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

function getCampaignTerrainSemanticDataSignature(
  input: CampaignTerrainInput,
  campaignHexGrid: CampaignHexGridAsset | null,
  fortCityRules: CampaignFortCityRulesAsset | null
): string {
  return [
    input.materialUrl,
    input.campaignHexGridUrl ?? "",
    getCampaignHexGridContentSignature(campaignHexGrid),
    getCampaignMarkerSourceSignature(input.canvas),
    fortCityRules?.fortifiedNodeIds?.join(",") ?? "",
    fortCityRules?.settlementVillage == null ? "" : "settlement-village",
  ].join("|");
}

function getCampaignHexGridContentSignature(
  campaignHexGrid: CampaignHexGridAsset | null
): string {
  if (campaignHexGrid == null) {
    return "material-image";
  }

  let hash = 2166136261;
  const addNumber = (value: number): void => {
    hash ^= Math.round(value * 100000) | 0;
    hash = Math.imul(hash, 16777619);
  };
  const addText = (value: string): void => {
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
  };

  addText(campaignHexGrid.format);
  addText(campaignHexGrid.mapId);
  addNumber(campaignHexGrid.coordinateSystem.hexTerrainScale);
  addNumber(campaignHexGrid.coordinateSystem.hexMapAspect);
  if (campaignHexGrid.coordinateSystem.hexPointBounds != null) {
    addNumber(campaignHexGrid.coordinateSystem.hexPointBounds.minX);
    addNumber(campaignHexGrid.coordinateSystem.hexPointBounds.maxX);
    addNumber(campaignHexGrid.coordinateSystem.hexPointBounds.minY);
    addNumber(campaignHexGrid.coordinateSystem.hexPointBounds.maxY);
  } else {
    addText("no-hex-point-bounds");
  }
  addNumber(campaignHexGrid.bounds.minX);
  addNumber(campaignHexGrid.bounds.maxX);
  addNumber(campaignHexGrid.bounds.minY);
  addNumber(campaignHexGrid.bounds.maxY);
  addNumber(campaignHexGrid.cells.length);

  for (const cell of campaignHexGrid.cells) {
    addNumber(cell.x);
    addNumber(cell.y);
    addNumber(cell.land ? 1 : 0);
    addText(cell.terrain);
    addText(cell.environment);
    addNumber(cell.referenceHeight);
  }

  return `hex-grid-${(hash >>> 0).toString(16)}`;
}

function createCampaignTerrainSemanticData(input: {
  input: CampaignTerrainInput;
  materialImage: HTMLImageElement;
  campaignHexGrid: CampaignHexGridAsset | null;
  fortCityRules: CampaignFortCityRulesAsset | null;
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
  applyCampaignStructureGroundSemanticOverlay(
    materialSemanticModel,
    input.input.canvas,
    input.fortCityRules
  );

  return {
    materialSemanticModel,
    travelGrid: createHexTravelGrid(materialSemanticModel),
  };
}

function getCampaignMarkerSourceSignature(canvas: HTMLCanvasElement): string {
  const stage = canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  const sourceElement = stage?.querySelector<HTMLScriptElement>(
    "script[data-campaign-marker-source]"
  );

  return sourceElement?.textContent ?? "";
}

function applyCampaignStructureGroundSemanticOverlay(
  materialSemanticModel: CampaignMaterialSemanticModel,
  canvas: HTMLCanvasElement,
  rules: CampaignFortCityRulesAsset | null
): void {
  const stage = canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  if (stage == null) {
    return;
  }

  const fortifiedNodeIds = new Set(rules?.fortifiedNodeIds ?? []);
  const cityCells = new Set<string>();

  for (const marker of readCampaignRuntimeMarkers(stage)) {
    if (!Number.isFinite(marker.u) || !Number.isFinite(marker.v)) {
      continue;
    }

    const cell = getCampaignTerrainHexCellAtUv(
      marker.u,
      marker.v,
      materialSemanticModel.coordinateSystem
    );
    if (!isPlainTerrainHexCell(materialSemanticModel, cell)) {
      continue;
    }

    const cellKey = getHexCellKey(cell.x, cell.y);
    const isCityStructure =
      marker.kind === "city" ||
      marker.kind === "fort" ||
      fortifiedNodeIds.has(marker.id);
    if (isCityStructure) {
      cityCells.add(cellKey);
      setCampaignStructureGroundSemanticCell(materialSemanticModel, cell, "city");
      continue;
    }

    if (marker.kind === "settlement" && !cityCells.has(cellKey)) {
      setCampaignStructureGroundSemanticCell(materialSemanticModel, cell, "village");
    }
  }
}

function setCampaignStructureGroundSemanticCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate,
  ground: Exclude<CampaignStructureGroundSemantic, "farmland">
): void {
  const pixelX = cell.x - materialSemanticModel.minCellX;
  const pixelY = cell.y - materialSemanticModel.minCellY;
  if (
    pixelX < 0 ||
    pixelX >= materialSemanticModel.textureColumns ||
    pixelY < 0 ||
    pixelY >= materialSemanticModel.textureRows
  ) {
    return;
  }

  const cellKey = getHexCellKey(cell.x, cell.y);
  const currentGround = materialSemanticModel.structureGroundByCellKey.get(cellKey);
  if (currentGround === "city" && ground === "village") {
    return;
  }

  const pixelOffset =
    (pixelY * materialSemanticModel.textureColumns + pixelX) * 4;
  materialSemanticModel.source.data[pixelOffset + 2] =
    CAMPAIGN_STRUCTURE_GROUND_SEMANTIC_VALUE[ground];
  materialSemanticModel.structureGroundByCellKey.set(cellKey, ground);
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

function getCampaignTerrainHexCellAtUv(
  u: number,
  v: number,
  coordinateSystem: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"]
): GridCoordinate {
  const point = terrainUvToHexPoint(u, v, coordinateSystem);
  return pixelToRoundedHex(point.x, point.y);
}

function getCampaignTerrainChunkForUv(
  u: number,
  v: number,
  coordinateSystem: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"]
): CampaignTerrainChunkCoordinate {
  return getCampaignTerrainChunkForHexCell(getCampaignTerrainHexCellAtUv(u, v, coordinateSystem));
}

function getCampaignTerrainChunkKeysForCells(cells: GridCoordinate[]): string[] {
  const keys = new Set<string>();

  for (const cell of cells) {
    keys.add(getCampaignTerrainChunkKey(getCampaignTerrainChunkForHexCell(cell)));
  }

  return [...keys].sort();
}

function getCampaignTerrainCameraFocusUv(
  worldScale: CampaignTerrainWorldScale
): { u: number; v: number } {
  const safeScale = Math.max(currentCamera.scale, 0.1);
  const tiltCos = Math.cos(getCampaignTerrainCameraTiltRadians(currentCamera));
  const safeTiltCos = Math.abs(tiltCos) < 0.0001 ? 1 : tiltCos;
  const worldX =
    -currentCamera.offsetX * CAMERA_OFFSET_UNIT /
    safeScale /
    TERRAIN_SCALE;
  const worldY =
    currentCamera.offsetY * CAMERA_OFFSET_UNIT /
    safeScale /
    safeTiltCos /
    TERRAIN_SCALE;

  return {
    u: clamp(worldX / Math.max(2 * worldScale.x, 0.000001) + 0.5, 0, 1),
    v: clamp(0.5 - worldY / Math.max(2 * worldScale.y, 0.000001), 0, 1),
  };
}

function getCampaignTerrainCameraFocusChunk(
  coordinateSystem: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"],
  worldScale: CampaignTerrainWorldScale
): CampaignTerrainChunkCoordinate {
  const focusUv = getCampaignTerrainCameraFocusUv(worldScale);

  return getCampaignTerrainChunkForUv(
    focusUv.u,
    focusUv.v,
    coordinateSystem
  );
}

function sortCampaignTerrainChunkKeysByCameraFocus(
  chunkKeys: string[],
  coordinateSystem: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"],
  worldScale: CampaignTerrainWorldScale
): string[] {
  const focusChunk = getCampaignTerrainCameraFocusChunk(coordinateSystem, worldScale);

  return [...chunkKeys].sort((leftKey, rightKey) => {
    const left = parseCampaignTerrainChunkKey(leftKey);
    const right = parseCampaignTerrainChunkKey(rightKey);
    const leftDistance =
      (left.x - focusChunk.x) ** 2 + (left.y - focusChunk.y) ** 2;
    const rightDistance =
      (right.x - focusChunk.x) ** 2 + (right.y - focusChunk.y) ** 2;

    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance;
    }

    return leftKey.localeCompare(rightKey);
  });
}

function getCampaignTerrainActiveChunkKeys(
  allChunkKeys: string[],
  coordinateSystem: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"],
  worldScale: CampaignTerrainWorldScale
): string[] {
  const focusChunk = getCampaignTerrainCameraFocusChunk(coordinateSystem, worldScale);
  const localChunkKeys = allChunkKeys.filter((chunkKey) => {
    const chunk = parseCampaignTerrainChunkKey(chunkKey);

    return (
      Math.abs(chunk.x - focusChunk.x) <= CAMPAIGN_TERRAIN_ACTIVE_CHUNK_RADIUS &&
      Math.abs(chunk.y - focusChunk.y) <= CAMPAIGN_TERRAIN_ACTIVE_CHUNK_RADIUS
    );
  });
  const sortedLocalChunkKeys = sortCampaignTerrainChunkKeysByCameraFocus(
    localChunkKeys,
    coordinateSystem,
    worldScale
  );

  if (sortedLocalChunkKeys.length >= CAMPAIGN_TERRAIN_STARTUP_READY_CHUNK_COUNT) {
    return sortedLocalChunkKeys;
  }

  return sortCampaignTerrainChunkKeysByCameraFocus(
    allChunkKeys,
    coordinateSystem,
    worldScale
  ).slice(0, CAMPAIGN_TERRAIN_STARTUP_READY_CHUNK_COUNT);
}

function getCampaignTerrainStartupChunkKeys(
  allChunkKeys: string[],
  coordinateSystem: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"],
  worldScale: CampaignTerrainWorldScale
): string[] {
  return getCampaignTerrainActiveChunkKeys(
    allChunkKeys,
    coordinateSystem,
    worldScale
  ).slice(0, CAMPAIGN_TERRAIN_STARTUP_READY_CHUNK_COUNT);
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
  semanticData: CampaignTerrainSemanticData;
  chunkKey: string;
  beachTuning: CampaignTerrainBeachTuning;
}): string {
  return [
    CAMPAIGN_TERRAIN_CHUNK_ALGORITHM_VERSION,
    getCampaignTerrainInputSignature(input.input),
    input.semanticData.materialSemanticModel.signature,
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
    semanticData: input.semanticData,
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
    CAMPAIGN_TERRAIN_CHUNK_PADDING_HEX,
    input.semanticData.materialSemanticModel.coordinateSystem
  );
  const meshGrid = createCampaignTerrainChunkGrid(
    chunk,
    0,
    input.semanticData.materialSemanticModel.coordinateSystem
  );
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
    chunk,
    input.semanticData.materialSemanticModel.worldScale,
    input.semanticData.materialSemanticModel.coordinateSystem
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
  paddingHex: number,
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
): CampaignTerrainChunkGrid {
  const rawBounds = createCampaignTerrainChunkUvBounds(chunk, paddingHex, coordinateSystem);
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
  paddingHex: number,
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
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
      minU = Math.min(minU, hexPointToTerrainU(center.x - radiusX, coordinateSystem));
      maxU = Math.max(maxU, hexPointToTerrainU(center.x + radiusX, coordinateSystem));
      minV = Math.min(minV, hexPointToTerrainV(center.y - radiusY, coordinateSystem));
      maxV = Math.max(maxV, hexPointToTerrainV(center.y + radiusY, coordinateSystem));
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
      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
      const cell = pixelToRoundedHex(point.x, point.y);
      const index = y * columns + x;
      heights[index] = createCampaignTerrainChunkHeightAtPoint(
        materialSemanticModel,
        point,
        cell
      );
    }
  }

  const flattenedHeights = createNonMountainFlattenedHeightSamples(
    heights,
    columns,
    rows,
    bounds,
    materialSemanticModel
  );
  const mountainFloorHeights = createMountainFloorHeightSamples(
    flattenedHeights,
    columns,
    rows,
    bounds,
    materialSemanticModel
  );
  const mountainHeights = createCampaignMountainHeightSamples(
    mountainFloorHeights,
    materialSemanticModel,
    bounds,
    columns,
    rows
  );
  return smoothCampaignTerrainChunkHeightSamples(
    mountainHeights,
    columns,
    rows,
    bounds,
    materialSemanticModel
  );
}

function createCampaignMountainHeightSamples(
  terrainBaseHeights: Float32Array,
  materialSemanticModel: CampaignMaterialSemanticModel,
  bounds: CampaignTerrainChunkBounds,
  columns: number,
  rows: number
): Float32Array {
  const mountainHeights = new Float32Array(terrainBaseHeights);

  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
      const cell = pixelToRoundedHex(point.x, point.y);
      const index = y * columns + x;
      if (!isLandTerrainHexCell(materialSemanticModel, cell)) {
        mountainHeights[index] = 0;
        continue;
      }
      if (!isMountainHexCell(materialSemanticModel, cell)) {
        continue;
      }

      const mountainReferenceStrength = getMountainReferenceStrengthForCell(
        materialSemanticModel,
        cell
      );
      mountainHeights[index] = createMountainHeightAtPoint(
        point,
        terrainBaseHeights[index] ?? mountainReferenceStrength,
        mountainReferenceStrength,
        1
      );
    }
  }

  return smoothMountainContinuityHeightPass(
    mountainHeights,
    terrainBaseHeights,
    columns,
    rows,
    bounds,
    materialSemanticModel
  );
}

function createCampaignHexReferenceHeightSamples(
  materialSemanticModel: CampaignMaterialSemanticModel,
  columns: number,
  rows: number
): Float32Array {
  let heightSamples: Float32Array<ArrayBufferLike> = new Float32Array(
    columns * rows
  );

  for (let y = 0; y < rows; y += 1) {
    const v = y / Math.max(rows - 1, 1);
    for (let x = 0; x < columns; x += 1) {
      const u = x / Math.max(columns - 1, 1);
      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
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

function smoothMountainContinuityHeightPass(
  heights: Float32Array,
  terrainBaseHeights: Float32Array,
  columns: number,
  rows: number,
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const smoothedHeights = new Float32Array(heights);
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);

  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
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
        const sampleU = getCampaignTerrainChunkSampleU(bounds, columns, sampleX);
        const sampleV = getCampaignTerrainChunkSampleV(bounds, rows, sampleY);
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

type NonMountainHeightCellStats = {
  sum: number;
  count: number;
  average: number;
};

function createNonMountainFlattenedHeightSamples(
  heights: Float32Array,
  columns: number,
  rows: number,
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const cellStats = createNonMountainHeightCellStats(
    heights,
    columns,
    rows,
    bounds,
    materialSemanticModel
  );
  const flattenedHeights = new Float32Array(heights);

  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
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
    bounds,
    materialSemanticModel
  );
}

function createNonMountainHeightCellStats(
  heights: Float32Array,
  columns: number,
  rows: number,
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): Map<string, NonMountainHeightCellStats> {
  const cellStats = new Map<string, NonMountainHeightCellStats>();

  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
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
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const smoothedHeights = new Float32Array(heights);
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);

  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
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
        const sampleU = getCampaignTerrainChunkSampleU(bounds, columns, sampleX);
        const sampleV = getCampaignTerrainChunkSampleV(bounds, rows, sampleY);
        const samplePoint = terrainUvToHexPoint(
          sampleU,
          sampleV,
          materialSemanticModel.terrainCoordinates
        );
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
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  let floorHeights: Float32Array<ArrayBufferLike> = new Float32Array(heights);
  let seededSamples = createMountainFloorSeedMask(
    heights,
    columns,
    rows,
    bounds,
    materialSemanticModel
  );
  const fallbackFloorHeight = createMountainFloorFallbackHeight(
    heights,
    seededSamples
  );

  for (let pass = 0; pass < MOUNTAIN_FLOOR_DIFFUSION_PASSES; pass += 1) {
    const nextHeights = new Float32Array(floorHeights);
    const nextSeededSamples = new Uint8Array(seededSamples);
    let filledAnySample = false;

    for (let y = 0; y < rows; y += 1) {
      const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
      for (let x = 0; x < columns; x += 1) {
        const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
        const point = terrainUvToHexPoint(
          u,
          v,
          materialSemanticModel.terrainCoordinates
        );
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
    bounds,
    materialSemanticModel
  );

  for (let pass = 0; pass < MOUNTAIN_FLOOR_SMOOTH_PASSES; pass += 1) {
    floorHeights = smoothMountainFloorHeightSamples(
      floorHeights,
      columns,
      rows,
      bounds,
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
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): void {
  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
      const point = terrainUvToHexPoint(u, v, materialSemanticModel.terrainCoordinates);
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
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): Uint8Array {
  const seededSamples = new Uint8Array(columns * rows);

  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
      const point = terrainUvToHexPoint(
        u,
        v,
        materialSemanticModel.terrainCoordinates
      );
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
  bounds: CampaignTerrainChunkBounds,
  materialSemanticModel: CampaignMaterialSemanticModel
): Float32Array {
  const smoothedHeights = new Float32Array(heights);
  const maxX = Math.max(columns - 1, 0);
  const maxY = Math.max(rows - 1, 0);

  for (let y = 0; y < rows; y += 1) {
    const v = getCampaignTerrainChunkSampleV(bounds, rows, y);
    for (let x = 0; x < columns; x += 1) {
      const u = getCampaignTerrainChunkSampleU(bounds, columns, x);
      const point = terrainUvToHexPoint(
        u,
        v,
        materialSemanticModel.terrainCoordinates
      );
      const cell = pixelToRoundedHex(point.x, point.y);
      if (!isMountainHexCell(materialSemanticModel, cell)) {
        continue;
      }

      const outputIndex = y * columns + x;
      const centerHeight = heights[outputIndex] ?? 0;
      let heightSum = 0;
      let heightWeight = 0;
      for (const sample of SMOOTH_TERRAIN_KERNEL) {
        const sampleX = clamp(x + sample.x, 0, maxX);
        const sampleY = clamp(y + sample.y, 0, maxY);
        const sampleU = getCampaignTerrainChunkSampleU(bounds, columns, sampleX);
        const sampleV = getCampaignTerrainChunkSampleV(bounds, rows, sampleY);
        const samplePoint = terrainUvToHexPoint(
          sampleU,
          sampleV,
          materialSemanticModel.terrainCoordinates
        );
        const sampleCell = pixelToRoundedHex(samplePoint.x, samplePoint.y);
        if (!isMountainHexCell(materialSemanticModel, sampleCell)) {
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
        centerHeight + (heightSum / heightWeight - centerHeight) * 0.22;
    }
  }

  return smoothedHeights;
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
  const mountainReferenceStrength = getMountainReferenceStrengthForCell(
    materialSemanticModel,
    cell
  );

  return createMountainHeightAtPoint(
    point,
    terrainBaseHeight,
    mountainReferenceStrength,
    1
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

function getMountainReferenceStrengthForCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate
): number {
  const referenceHeight = getCampaignTerrainReferenceHeightForCell(
    materialSemanticModel,
    cell
  );

  return Math.max(
    referenceHeight,
    MOUNTAIN_REFERENCE_STRENGTH_FLOOR,
    createStableMountainReferenceStrength(cell)
  );
}

function createStableMountainReferenceStrength(cell: GridCoordinate): number {
  const noise = hash2d(cell.x * 1.37 + 19.11, cell.y * 1.73 - 42.07);
  const shapedNoise = smoothstepRange(0.08, 0.92, noise);

  return (
    MOUNTAIN_REFERENCE_STRENGTH_RANDOM_MIN +
    (MOUNTAIN_REFERENCE_STRENGTH_RANDOM_MAX -
      MOUNTAIN_REFERENCE_STRENGTH_RANDOM_MIN) *
      shapedNoise
  );
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
  chunk: CampaignTerrainChunkCoordinate,
  worldScale: CampaignTerrainWorldScale,
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
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
        createSmoothTerrainChunkNormal(heights, columns, rows, sampleBounds, u, v),
        worldScale
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
          chunk,
          coordinateSystem
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
  const nx = tangentU[1] * tangentV[2] - tangentU[2] * tangentV[1];
  const ny = tangentU[2] * tangentV[0] - tangentU[0] * tangentV[2];
  const nz = tangentU[0] * tangentV[1] - tangentU[1] * tangentV[0];
  const length = Math.hypot(nx, ny, nz) || 1;

  return [nx / length, ny / length, nz / length];
}

function isCampaignTerrainChunkMeshQuadOwnedByChunk(
  bounds: CampaignTerrainChunkBounds,
  columns: number,
  rows: number,
  column: number,
  row: number,
  chunk: CampaignTerrainChunkCoordinate,
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
): boolean {
  const centerU =
    (getCampaignTerrainChunkSampleU(bounds, columns, column) +
      getCampaignTerrainChunkSampleU(bounds, columns, column + 1)) *
    0.5;
  const centerV =
    (getCampaignTerrainChunkSampleV(bounds, rows, row) +
      getCampaignTerrainChunkSampleV(bounds, rows, row + 1)) *
    0.5;
  const owner = getCampaignTerrainChunkForUv(centerU, centerV, coordinateSystem);
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
  const chunkKey = getCampaignTerrainChunkKey(
    getCampaignTerrainChunkForUv(
      input.u,
      input.v,
      input.materialSemanticModel.coordinateSystem
    )
  );
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

  const cell = getCampaignTerrainHexCellAtUv(
    input.u,
    input.v,
    input.materialSemanticModel.coordinateSystem
  );
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

async function loadCampaignFortCityAsset(input: {
  assetId: string | null;
  rulesUrl: string | null;
}): Promise<CampaignFortCityAsset> {
  if (input.assetId != null) {
    const registeredAsset = getRegisteredCampaignFortCityAsset(input.assetId);
    if (registeredAsset != null) {
      return createRegisteredCampaignFortCityAsset(registeredAsset);
    }
  }

  if (input.rulesUrl == null) {
    throw new Error("Campaign fort city asset is missing a registered asset id or rules URL.");
  }

  const rules = await loadJson<CampaignFortCityRulesDefinition>(input.rulesUrl);
  validateCampaignFortCityRules(rules);
  const normalizedRules: CampaignFortCityRulesAsset = {
    ...rules,
    variants: rules.variants.map((variant) => ({
      ...variant,
      meshUrl: resolveAssetUrl(variant.meshUrl, input.rulesUrl as string),
    })),
  };

  return {
    rules: normalizedRules,
    meshesById: new Map(),
    meshPromisesById: new Map(),
    failedMeshIds: new Set(),
  };
}

function createRegisteredCampaignFortCityAsset(
  registeredAsset: RegisteredCampaignFortCityAsset
): CampaignFortCityAsset {
  validateCampaignFortCityRules(registeredAsset.rules);
  const meshesById = new Map<string, VegetationMeshAsset>();

  for (const variant of registeredAsset.rules.variants) {
    const mesh = registeredAsset.meshesByVariantId[variant.id];
    if (mesh == null) {
      throw new Error(`Registered campaign fort city mesh "${variant.id}" is missing.`);
    }
    validateCampaignVegetationMesh(mesh);
    meshesById.set(variant.id, createVegetationMeshAsset(mesh));
  }

  return {
    rules: registeredAsset.rules as CampaignFortCityRulesAsset,
    meshesById,
    meshPromisesById: new Map(),
    failedMeshIds: new Set(),
  };
}

function createVegetationMeshAsset(
  mesh: CampaignVegetationMeshDefinition
): VegetationMeshAsset {
  return {
    id: mesh.id,
    positions: new Float32Array(mesh.positions),
    normals: new Float32Array(mesh.normals),
    colors: new Float32Array(mesh.colors),
    indices: new Uint32Array(mesh.indices),
    bounds: mesh.bounds,
  };
}

function ensureCampaignFortCityVariantMesh(
  asset: CampaignFortCityAsset,
  variant: CampaignFortCityRulesAsset["variants"][number],
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
        `Failed to load campaign fort city mesh "${variant.id}".`,
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

function validateCampaignFortCityRules(
  rules: CampaignFortCityRulesDefinition
): void {
  if (rules.format !== "campaign-fort-city-rules-v1") {
    throw new Error(`Unsupported campaign fort city rules format "${rules.format}".`);
  }
  if (rules.variants.length === 0) {
    throw new Error("Campaign fort city rules must declare at least one variant.");
  }
  if (rules.count.max < rules.count.min || rules.count.max <= 0) {
    throw new Error("Campaign fort city rules count range is invalid.");
  }
  if (rules.lod.maxVisibleInstances <= 0) {
    throw new Error("Campaign fort city rules must declare a positive visible instance limit.");
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

async function loadCampaignFortWallMeshAsset(
  meshUrl: string
): Promise<FortWallMeshAsset> {
  const asset = await loadJson<CampaignMapNodeMeshDefinition>(meshUrl);
  if (asset.format !== "campaign-map-node-mesh-v1") {
    throw new Error(`Unsupported campaign map node mesh format "${asset.format}".`);
  }
  if (
    asset.positions.length % 3 !== 0 ||
    asset.normals.length !== asset.positions.length ||
    asset.uvs.length !== (asset.positions.length / 3) * 2 ||
    asset.indices.length % 3 !== 0
  ) {
    throw new Error("Campaign map node mesh arrays are inconsistent.");
  }

  const textureUrls = Array.from(
    new Set(
      asset.drawGroups
        .map((drawGroup) => drawGroup.textureUrl)
        .filter((textureUrl): textureUrl is string => textureUrl != null)
    )
  );
  const texturesByUrl = new Map<string, HTMLImageElement>();
  const absoluteMeshUrl = new URL(meshUrl, window.location.href).toString();
  await Promise.all(
    textureUrls.map(async (textureUrl) => {
      const resolvedTextureUrl = new URL(textureUrl, absoluteMeshUrl).toString();
      texturesByUrl.set(textureUrl, await loadImage(resolvedTextureUrl));
    })
  );

  return {
    positions: new Float32Array(asset.positions),
    normals: new Float32Array(asset.normals),
    uvs: new Float32Array(asset.uvs),
    indices: new Uint32Array(asset.indices),
    drawGroups: asset.drawGroups,
    placement: asset.placement,
    texturesByUrl,
  };
}

function createCampaignFortWallMesh(
  asset: FortWallMeshAsset,
  instances: FortWallInstance[],
  sampleHeightAtUv: (u: number, v: number) => number,
  worldScale: CampaignTerrainWorldScale
): FortWallMeshData {
  const sourceVertexCount = asset.positions.length / 3;
  const vertices = new Float32Array(instances.length * sourceVertexCount * 8);
  const groupIndicesByTextureUrl = new Map<string | null, number[]>();
  const rotation = asset.placement.rotationDegrees * Math.PI / 180;
  const rotationCos = Math.cos(rotation);
  const rotationSin = Math.sin(rotation);

  for (let instanceIndex = 0; instanceIndex < instances.length; instanceIndex += 1) {
    const instance = instances[instanceIndex];
    if (instance == null) {
      continue;
    }
    const terrainHeight = sampleHeightAtUv(instance.u, instance.v);
    const center = createTerrainWorldPoint(instance.u, instance.v, terrainHeight, worldScale);
    const vertexBase = instanceIndex * sourceVertexCount;
    const outputVertexOffset = instanceIndex * sourceVertexCount * 8;

    for (let vertexIndex = 0; vertexIndex < sourceVertexCount; vertexIndex += 1) {
      const sourcePositionOffset = vertexIndex * 3;
      const sourceUvOffset = vertexIndex * 2;
      const outputOffset = outputVertexOffset + vertexIndex * 8;
      const localX =
        (asset.positions[sourcePositionOffset] ?? 0) * asset.placement.baseWorldScale;
      const localY =
        (asset.positions[sourcePositionOffset + 1] ?? 0) *
        asset.placement.baseWorldScale;
      const rotatedX = localX * rotationCos - localY * rotationSin;
      const rotatedY = localX * rotationSin + localY * rotationCos;
      const normalX = asset.normals[sourcePositionOffset] ?? 0;
      const normalY = asset.normals[sourcePositionOffset + 1] ?? 0;
      const rotatedNormalX = normalX * rotationCos - normalY * rotationSin;
      const rotatedNormalY = normalX * rotationSin + normalY * rotationCos;

      vertices[outputOffset] =
        center[0] + (asset.placement.offsetX ?? 0) + rotatedX;
      vertices[outputOffset + 1] =
        center[1] + (asset.placement.offsetY ?? 0) + rotatedY;
      vertices[outputOffset + 2] =
        center[2] +
        asset.placement.lift +
        (asset.positions[sourcePositionOffset + 2] ?? 0) * asset.placement.baseWorldScale;
      vertices[outputOffset + 3] = rotatedNormalX;
      vertices[outputOffset + 4] = rotatedNormalY;
      vertices[outputOffset + 5] = asset.normals[sourcePositionOffset + 2] ?? 1;
      vertices[outputOffset + 6] = asset.uvs[sourceUvOffset] ?? 0;
      vertices[outputOffset + 7] = asset.uvs[sourceUvOffset + 1] ?? 0;
    }

    for (const drawGroup of asset.drawGroups) {
      if (drawGroup.count <= 0) {
        continue;
      }

      let indices = groupIndicesByTextureUrl.get(drawGroup.textureUrl);
      if (indices == null) {
        indices = [];
        groupIndicesByTextureUrl.set(drawGroup.textureUrl, indices);
      }

      const end = drawGroup.start + drawGroup.count;
      for (let index = drawGroup.start; index < end; index += 1) {
        indices.push((asset.indices[index] ?? 0) + vertexBase);
      }
    }
  }

  const indexChunks = Array.from(groupIndicesByTextureUrl.entries())
    .filter(([, indices]) => indices.length > 0)
    .sort(([leftTextureUrl], [rightTextureUrl]) =>
      String(leftTextureUrl ?? "").localeCompare(String(rightTextureUrl ?? ""))
    );
  const mergedIndices: number[] = [];
  const drawGroups: FortWallMeshDrawGroup[] = [];
  for (const [textureUrl, indices] of indexChunks) {
    const start = mergedIndices.length;
    for (const index of indices) {
      mergedIndices.push(index);
    }
    drawGroups.push({
      textureUrl,
      start,
      count: indices.length,
    });
  }

  return {
    vertices,
    indices: new Uint32Array(mergedIndices),
    drawGroups,
  };
}

function syncCampaignMarkerLayer(input: {
  canvas: HTMLCanvasElement;
  materialSemanticModel: CampaignMaterialSemanticModel;
  loadedChunkKeys: Set<string>;
}): string {
  const stage = input.canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  if (stage == null) {
    return "";
  }

  const markerLayer = stage.querySelector<HTMLElement>("[data-campaign-marker-layer]");
  if (markerLayer == null) {
    return "";
  }

  const markers = readCampaignRuntimeMarkers(stage);
  const visibleMarkers = markers.filter((marker) =>
    isCampaignRuntimeMarkerInLoadedPlainTerrain({
      marker,
      materialSemanticModel: input.materialSemanticModel,
      loadedChunkKeys: input.loadedChunkKeys,
    })
  );
  const signature = visibleMarkers
    .map(
      (marker) =>
        `${marker.id}:${marker.kind}:${marker.isRevealed ? "1" : "0"}:${marker.u.toFixed(5)}:${marker.v.toFixed(5)}`
    )
    .join("|");

  if (markerLayer.dataset.campaignMarkerLayerSignature === signature) {
    return signature;
  }

  syncCampaignRuntimeMarkerElements(markerLayer, visibleMarkers);
  markerLayer.dataset.campaignMarkerLayerSignature = signature;
  return signature;
}

function syncCampaignRuntimeMarkerElements(
  markerLayer: HTMLElement,
  visibleMarkers: CampaignRuntimeMarker[]
): void {
  const visibleMarkerIds = new Set(visibleMarkers.map((marker) => marker.id));
  for (const markerElement of Array.from(
    markerLayer.querySelectorAll<HTMLElement>("[data-campaign-marker-id]")
  )) {
    const markerId = markerElement.dataset.campaignMarkerId;
    if (markerId != null && visibleMarkerIds.has(markerId)) {
      continue;
    }

    const summaryElement =
      markerId == null
        ? null
        : markerLayer.querySelector<HTMLElement>(
          `[data-campaign-marker-summary-id="${escapeCssAttributeValue(markerId)}"]`
        );
    markerElement.remove();
    summaryElement?.remove();
  }

  const markerElementsById = new Map<string, HTMLElement>();
  markerLayer
    .querySelectorAll<HTMLElement>("[data-campaign-marker-id]")
    .forEach((element) => {
      const markerId = element.dataset.campaignMarkerId;
      if (markerId != null) {
        markerElementsById.set(markerId, element);
      }
    });
  const summaryElementsById = new Map<string, HTMLElement>();
  markerLayer
    .querySelectorAll<HTMLElement>("[data-campaign-marker-summary-id]")
    .forEach((element) => {
      const markerId = element.dataset.campaignMarkerSummaryId;
      if (markerId != null) {
        summaryElementsById.set(markerId, element);
      }
    });

  for (const marker of visibleMarkers) {
    const renderedElements = createCampaignRuntimeMarkerElements(marker);
    let markerElement = markerElementsById.get(marker.id) ?? null;
    let summaryElement = summaryElementsById.get(marker.id) ?? null;

    if (markerElement == null) {
      markerElement = renderedElements.markerElement;
    } else {
      syncCampaignRuntimeMarkerElement(
        markerElement,
        renderedElements.markerElement
      );
    }

    if (summaryElement == null) {
      summaryElement = renderedElements.summaryElement;
    } else {
      syncCampaignRuntimeMarkerElement(
        summaryElement,
        renderedElements.summaryElement
      );
    }

    markerLayer.append(markerElement, summaryElement);
  }
}

function createCampaignRuntimeMarkerElements(marker: CampaignRuntimeMarker): {
  markerElement: HTMLElement;
  summaryElement: HTMLElement;
} {
  const template = document.createElement("template");
  template.innerHTML = renderCampaignRuntimeMarker(marker);
  const markerElement = template.content.querySelector<HTMLElement>(
    "[data-campaign-marker-id]"
  );
  const summaryElement = template.content.querySelector<HTMLElement>(
    "[data-campaign-marker-summary-id]"
  );
  if (markerElement == null || summaryElement == null) {
    throw new Error("Failed to render campaign runtime marker elements.");
  }

  return {
    markerElement,
    summaryElement,
  };
}

function syncCampaignRuntimeMarkerElement(
  preservedElement: HTMLElement,
  replacementElement: HTMLElement
): void {
  const dynamicProjectionAttributes = new Set([
    "style",
    "hidden",
    "data-terrain-projection-ready",
  ]);

  for (const attribute of Array.from(preservedElement.attributes)) {
    if (dynamicProjectionAttributes.has(attribute.name)) {
      continue;
    }
    if (!replacementElement.hasAttribute(attribute.name)) {
      preservedElement.removeAttribute(attribute.name);
    }
  }

  for (const attribute of Array.from(replacementElement.attributes)) {
    if (dynamicProjectionAttributes.has(attribute.name)) {
      continue;
    }
    preservedElement.setAttribute(attribute.name, attribute.value);
  }

  if (preservedElement.dataset.campaignMarkerContentSignature !==
    replacementElement.dataset.campaignMarkerContentSignature) {
    preservedElement.innerHTML = replacementElement.innerHTML;
  }
}

function isCampaignRuntimeMarkerInLoadedPlainTerrain(input: {
  marker: CampaignRuntimeMarker;
  materialSemanticModel: CampaignMaterialSemanticModel;
  loadedChunkKeys: Set<string>;
}): boolean {
  if (!Number.isFinite(input.marker.u) || !Number.isFinite(input.marker.v)) {
    return false;
  }

  const hexCell = getCampaignTerrainHexCellAtUv(
    input.marker.u,
    input.marker.v,
    input.materialSemanticModel.coordinateSystem
  );
  const chunkKey = getCampaignTerrainChunkKey(
    getCampaignTerrainChunkForHexCell(hexCell)
  );
  return (
    input.loadedChunkKeys.has(chunkKey) &&
    isPlainTerrainHexCell(input.materialSemanticModel, hexCell)
  );
}

function readCampaignRuntimeMarkers(stage: HTMLElement): CampaignRuntimeMarker[] {
  const sourceElement = stage.querySelector<HTMLScriptElement>(
    "script[data-campaign-marker-source]"
  );
  if (sourceElement == null) {
    return [];
  }

  const cachedMarkers = campaignMarkerSourceCache.get(sourceElement);
  if (cachedMarkers != null) {
    return cachedMarkers;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(sourceElement.textContent ?? "[]");
  } catch (error) {
    console.error("Failed to parse campaign marker source.", error);
    campaignMarkerSourceCache.set(sourceElement, []);
    return [];
  }

  const markers = Array.isArray(parsed)
    ? parsed.filter(isCampaignRuntimeMarker)
    : [];
  campaignMarkerSourceCache.set(sourceElement, markers);
  return markers;
}

function isCampaignRuntimeMarker(value: unknown): value is CampaignRuntimeMarker {
  if (value == null || typeof value !== "object") {
    return false;
  }

  const marker = value as Partial<CampaignRuntimeMarker>;
  return (
    typeof marker.id === "string" &&
    (typeof marker.cityId === "string" || marker.cityId == null) &&
    typeof marker.name === "string" &&
    Number.isFinite(marker.x) &&
    Number.isFinite(marker.y) &&
    (marker.kind === "city" ||
      marker.kind === "settlement" ||
      marker.kind === "fort" ||
      marker.kind === "landmark") &&
    typeof marker.summary === "string" &&
    typeof marker.isRevealed === "boolean" &&
    Number.isFinite(marker.left) &&
    Number.isFinite(marker.bottom) &&
    Number.isFinite(marker.u) &&
    Number.isFinite(marker.v)
  );
}

function renderCampaignRuntimeMarker(marker: CampaignRuntimeMarker): string {
  const displayName = getCampaignMarkerDisplayName(marker.name);
  const markerName = escapeHtml(marker.name);
  const markerSummary = escapeHtml(marker.summary);
  const contentSignature = escapeHtml(getCampaignRuntimeMarkerContentSignature(marker));
  const markerPositionStyle =
    `--marker-left:${marker.left.toFixed(3)}%; --marker-bottom:${marker.bottom.toFixed(3)}%;`;
  const markerInteractionAttributes = marker.isRevealed
    ? `
          data-map-node-id="${escapeHtml(marker.id)}"
          data-map-node-name="${markerName}"
          title="${markerName} (${marker.x}, ${marker.y})"
        `
    : `
          disabled
          aria-hidden="true"
          tabindex="-1"
          data-map-node-revealed="false"
        `;
  const markerProjectionAttributes = `
          data-terrain-projected-point="true"
          data-map-height-u="${marker.u.toFixed(5)}"
          data-map-height-v="${marker.v.toFixed(5)}"
        `;

  return `
        <button
          class="c-campaign-marker ${getCampaignMarkerClass(marker.kind)}"
          style="${markerPositionStyle}"
          ${markerProjectionAttributes}
          data-campaign-marker-id="${escapeHtml(marker.id)}"
          data-campaign-marker-content-signature="${contentSignature}"
          data-map-x="${marker.x}"
          data-map-y="${marker.y}"
          data-city-id="${escapeHtml(marker.cityId ?? "")}"
          ${markerInteractionAttributes}
        >
          <span class="c-campaign-marker__dot"></span>
          <span class="c-campaign-marker__label">${escapeHtml(displayName)}</span>
        </button>
        <span
          class="c-campaign-marker__summary"
          style="${markerPositionStyle}"
          ${markerProjectionAttributes}
          data-campaign-marker-summary-id="${escapeHtml(marker.id)}"
          data-campaign-marker-content-signature="${contentSignature}"
          aria-hidden="true"
          data-map-node-revealed="${marker.isRevealed ? "true" : "false"}"
        >
          <strong>${markerName}</strong>
          ${marker.summary === "" ? "" : `<span>${markerSummary}</span>`}
          ${renderCampaignRuntimeMarkerHistoricalCharacters(marker)}
        </span>
      `;
}

function getCampaignRuntimeMarkerContentSignature(
  marker: CampaignRuntimeMarker
): string {
  return JSON.stringify({
    name: marker.name,
    kind: marker.kind,
    summary: marker.summary,
    isRevealed: marker.isRevealed,
    historicalCharacters: marker.historicalCharacters,
  });
}

function getCampaignMarkerClass(kind: CampaignRuntimeMarker["kind"]): string {
  if (kind === "fort") {
    return "c-campaign-marker--fort";
  }

  if (kind === "settlement" || kind === "city") {
    return "c-campaign-marker--settlement";
  }

  return "c-campaign-marker--landmark";
}

function getCampaignMarkerDisplayName(name: string): string {
  const markerIndex = Math.max(
    name.lastIndexOf("\u2605"),
    name.lastIndexOf("\u203b"),
    name.lastIndexOf("\u25cf")
  );
  if (markerIndex >= 0) {
    return name.slice(markerIndex + 1).trim();
  }

  return name.replace(/^\u3010(.+)\u3011$/, "$1");
}

function renderCampaignRuntimeMarkerHistoricalCharacters(
  marker: CampaignRuntimeMarker
): string {
  if (marker.historicalCharacters == null) {
    return "";
  }

  const characterGroups = [
    renderCampaignRuntimeMarkerCharacterGroup(
      "Primary: ",
      marker.historicalCharacters.primary
    ),
    renderCampaignRuntimeMarkerCharacterGroup(
      "Related: ",
      marker.historicalCharacters.secondary
    ),
    renderCampaignRuntimeMarkerCharacterGroup(
      "Background: ",
      marker.historicalCharacters.background
    ),
  ]
    .filter((item) => item !== "")
    .join("");
  const notes =
    marker.historicalCharacters.notes === ""
      ? ""
      : `<span><b>Notes: </b>${escapeHtml(marker.historicalCharacters.notes)}</span>`;

  return `<span class="c-campaign-marker__characters">${characterGroups}${notes}</span>`;
}

function renderCampaignRuntimeMarkerCharacterGroup(
  label: string,
  names: string[]
): string {
  if (names.length === 0) {
    return "";
  }

  return `<span><b>${label}</b>${names.map(escapeHtml).join(" / ")}</span>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeCssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

function readCampaignFortWallInstances(
  canvas: HTMLCanvasElement,
  loadedChunkKeys: Set<string>,
  materialSemanticModel: CampaignMaterialSemanticModel,
  rules: CampaignFortCityRulesAsset | null
): FortWallInstance[] {
  const stage = canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  if (stage == null || loadedChunkKeys.size === 0) {
    return [];
  }

  const fortifiedNodeIds = new Set(rules?.fortifiedNodeIds ?? []);
  const instancesByHexKey = new Map<string, FortWallInstance>();
  for (const marker of readCampaignRuntimeMarkers(stage)) {
    if (
      marker.kind !== "city" &&
      marker.kind !== "fort" &&
      !fortifiedNodeIds.has(marker.id)
    ) {
      continue;
    }

    const hexCell = getCampaignTerrainHexCellAtUv(
      marker.u,
      marker.v,
      materialSemanticModel.coordinateSystem
    );
    const chunkKey = getCampaignTerrainChunkKey(
      getCampaignTerrainChunkForHexCell(hexCell)
    );
    if (!loadedChunkKeys.has(chunkKey)) {
      continue;
    }

    const center = hexToPixel(hexCell.x, hexCell.y);
    const instance = {
      u: hexPointToTerrainU(center.x, materialSemanticModel.terrainCoordinates),
      v: hexPointToTerrainV(center.y, materialSemanticModel.terrainCoordinates),
      key: getHexCellKey(hexCell.x, hexCell.y),
      x: hexCell.x,
      y: hexCell.y,
    };
    instancesByHexKey.set(instance.key, instance);
  }

  return Array.from(instancesByHexKey.values()).sort((left, right) =>
    left.key.localeCompare(right.key)
  );
}

function readCampaignCityStructureInstances(input: {
  canvas: HTMLCanvasElement;
  loadedChunkKeys: Set<string>;
  materialSemanticModel: CampaignMaterialSemanticModel;
  rules: CampaignFortCityRulesAsset | null;
}): FortCityInstance[] {
  const stage = input.canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  if (stage == null || input.loadedChunkKeys.size === 0) {
    return [];
  }

  const fortifiedNodeIds = new Set(input.rules?.fortifiedNodeIds ?? []);
  const instancesByHexKey = new Map<string, FortCityInstance>();
  for (const marker of readCampaignRuntimeMarkers(stage)) {
    if (
      marker.kind !== "city" &&
      marker.kind !== "fort" &&
      !fortifiedNodeIds.has(marker.id)
    ) {
      continue;
    }

    const hexCell = getCampaignTerrainHexCellAtUv(
      marker.u,
      marker.v,
      input.materialSemanticModel.coordinateSystem
    );
    if (!isPlainTerrainHexCell(input.materialSemanticModel, hexCell)) {
      continue;
    }

    const chunkKey = getCampaignTerrainChunkKey(
      getCampaignTerrainChunkForHexCell(hexCell)
    );
    if (!input.loadedChunkKeys.has(chunkKey)) {
      continue;
    }

    const center = hexToPixel(hexCell.x, hexCell.y);
    const instance = {
      u: hexPointToTerrainU(center.x, input.materialSemanticModel.terrainCoordinates),
      v: hexPointToTerrainV(center.y, input.materialSemanticModel.terrainCoordinates),
      key: getHexCellKey(hexCell.x, hexCell.y),
      x: hexCell.x,
      y: hexCell.y,
    };
    instancesByHexKey.set(instance.key, instance);
  }

  return Array.from(instancesByHexKey.values()).sort((left, right) =>
    left.key.localeCompare(right.key)
  );
}

function getCampaignSettlementVillageRules(
  rules: CampaignFortCityRulesAsset
): CampaignSettlementVillageRulesAsset | null {
  if (rules.settlementVillage == null) {
    return null;
  }

  return {
    ...rules.settlementVillage,
    variants: rules.variants,
  };
}

function readCampaignSettlementVillageInstances(input: {
  canvas: HTMLCanvasElement;
  loadedChunkKeys: Set<string>;
  materialSemanticModel: CampaignMaterialSemanticModel;
  cityHexKeys: Set<string>;
  rules: CampaignFortCityRulesAsset | null;
}): FortCityInstance[] {
  const stage = input.canvas.closest<HTMLElement>("[data-campaign-map-transform]");
  if (stage == null || input.loadedChunkKeys.size === 0) {
    return [];
  }

  const fortifiedNodeIds = new Set(input.rules?.fortifiedNodeIds ?? []);
  const cityHexKeys = new Set(input.cityHexKeys);
  const markers = readCampaignRuntimeMarkers(stage);

  for (const marker of markers) {
    if (
      marker.kind !== "city" &&
      marker.kind !== "fort" &&
      !fortifiedNodeIds.has(marker.id)
    ) {
      continue;
    }

    const cell = getCampaignTerrainHexCellAtUv(
      marker.u,
      marker.v,
      input.materialSemanticModel.coordinateSystem
    );
    cityHexKeys.add(getHexCellKey(cell.x, cell.y));
  }

  const instancesByHexKey = new Map<string, FortCityInstance>();
  for (const marker of markers) {
    if (marker.kind !== "settlement" || fortifiedNodeIds.has(marker.id)) {
      continue;
    }

    const hexCell = getCampaignTerrainHexCellAtUv(
      marker.u,
      marker.v,
      input.materialSemanticModel.coordinateSystem
    );
    const hexKey = getHexCellKey(hexCell.x, hexCell.y);
    if (
      cityHexKeys.has(hexKey) ||
      !isPlainTerrainHexCell(input.materialSemanticModel, hexCell)
    ) {
      continue;
    }

    const chunkKey = getCampaignTerrainChunkKey(
      getCampaignTerrainChunkForHexCell(hexCell)
    );
    if (!input.loadedChunkKeys.has(chunkKey)) {
      continue;
    }

    const center = hexToPixel(hexCell.x, hexCell.y);
    instancesByHexKey.set(hexKey, {
      u: hexPointToTerrainU(center.x, input.materialSemanticModel.terrainCoordinates),
      v: hexPointToTerrainV(center.y, input.materialSemanticModel.terrainCoordinates),
      key: hexKey,
      x: hexCell.x,
      y: hexCell.y,
    });
  }

  return Array.from(instancesByHexKey.values()).sort((left, right) =>
    left.key.localeCompare(right.key)
  );
}

function getCampaignFortWallMeshSignature(
  instances: FortWallInstance[]
): string {
  return instances.map((instance) => instance.key).join(",");
}

function createCampaignFortCityFortAllocations(
  fortInstances: FortCityInstance[],
  rules: CampaignStructureBuildingRulesAsset,
  matrix: Mat4,
  sampleHeightAtUv: (u: number, v: number) => number,
  worldScale: CampaignTerrainWorldScale
): CampaignFortCityFortAllocation[] {
  const visibleForts = fortInstances
    .map((fort): CampaignFortCityVisibleFort | null => {
      const visibility = getCampaignFortCityVisibility(
        fort,
        matrix,
        sampleHeightAtUv,
        worldScale
      );
      if (visibility == null) {
        return null;
      }

      return {
        fort,
        targetCount: getCampaignFortCityTargetCount(fort, rules),
        priority: visibility.priority,
      };
    })
    .filter((item): item is CampaignFortCityVisibleFort => item != null);
  const totalTargetCount = visibleForts.reduce(
    (sum, item) => sum + item.targetCount,
    0
  );
  const lodBudget = getCampaignStructureModelLodBudget(rules.lod.maxVisibleInstances);
  const budget = Math.min(
    lodBudget,
    totalTargetCount
  );
  if (budget <= 0) {
    return [];
  }

  const sortedForts = visibleForts.sort(
    (left, right) =>
      seededRandom01(left.fort.x, left.fort.y, 631) -
        seededRandom01(right.fort.x, right.fort.y, 631) ||
      left.priority - right.priority
  );
  if (budget < sortedForts.length) {
    return sortedForts.slice(0, budget).map((item) => ({
      fort: item.fort,
      count: 1,
      targetCount: item.targetCount,
    }));
  }

  const allocations = sortedForts.map((item) => ({
    item,
    count: 1,
    remainder: 0,
  }));
  const extraBudget = budget - allocations.length;
  const totalExtraTarget = allocations.reduce(
    (sum, allocation) => sum + Math.max(allocation.item.targetCount - 1, 0),
    0
  );
  let assignedExtra = 0;

  if (extraBudget > 0 && totalExtraTarget > 0) {
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

    allocations
      .filter((allocation) => allocation.count < allocation.item.targetCount)
      .sort(
        (left, right) =>
          right.remainder - left.remainder ||
          seededRandom01(left.item.fort.x, left.item.fort.y, 647) -
            seededRandom01(right.item.fort.x, right.item.fort.y, 647)
      )
      .slice(0, extraBudget - assignedExtra)
      .forEach((allocation) => {
        allocation.count += 1;
      });
  }

  return allocations
    .filter((allocation) => allocation.count > 0)
    .map((allocation) => ({
      fort: allocation.item.fort,
      count: allocation.count,
      targetCount: allocation.item.targetCount,
    }));
}

function getCampaignStructureModelLodBudget(maxVisibleInstances: number): number {
  if (currentCamera.scale < CAMPAIGN_STRUCTURE_MODEL_LOD_HIDE_BELOW_SCALE) {
    return 0;
  }

  if (currentCamera.scale < CAMPAIGN_STRUCTURE_MODEL_LOD_REDUCED_BELOW_SCALE) {
    return Math.max(
      1,
      Math.floor(
        maxVisibleInstances * CAMPAIGN_STRUCTURE_MODEL_LOD_REDUCED_BUDGET_RATIO
      )
    );
  }

  return Math.max(Math.floor(maxVisibleInstances), 0);
}

function getCampaignFortCityVisibility(
  fort: FortCityInstance,
  matrix: Mat4,
  sampleHeightAtUv: (u: number, v: number) => number,
  worldScale: CampaignTerrainWorldScale
): { priority: number } | null {
  const height = sampleHeightAtUv(fort.u, fort.v);
  const screenPoint = projectPoint(
    matrix,
    createTerrainWorldPoint(fort.u, fort.v, height, worldScale)
  );
  const isVisible =
    screenPoint.w > 0 &&
    screenPoint.z >= -1.45 &&
    screenPoint.z <= 1.45 &&
    screenPoint.x >= -1.65 &&
    screenPoint.x <= 1.65 &&
    screenPoint.y >= -1.65 &&
    screenPoint.y <= 1.65;
  if (!isVisible) {
    return null;
  }

  return {
    priority: Math.hypot(screenPoint.x, screenPoint.y),
  };
}

function getCampaignFortCityTargetCount(
  fort: FortCityInstance,
  rules: CampaignStructureBuildingRulesAsset
): number {
  const min = Math.max(Math.floor(rules.count.min), 0);
  const max = Math.max(Math.floor(rules.count.max), min);
  return min + Math.floor(seededRandom01(fort.x, fort.y, 503) * (max - min + 1));
}

function createCampaignFortCityBuildingInstances(input: {
  asset: CampaignFortCityAsset;
  rules: CampaignStructureBuildingRulesAsset;
  fortInstances: FortCityInstance[];
  matrix: Mat4;
  sampleHeightAtUv: (u: number, v: number) => number;
  worldScale: CampaignTerrainWorldScale;
  terrainCoordinates: CampaignTerrainCoordinateSystem;
  onVariantMeshNeeded: (
    variant: CampaignFortCityRulesAsset["variants"][number]
  ) => void;
  cacheKind?: CampaignStructureBuildingCacheKind;
  structureBuildingCache?: CampaignStructureBuildingCache;
}): CampaignFortCityBuildingInstance[] {
  const rules = input.rules;
  const instances: CampaignFortCityBuildingInstance[] = [];
  const maxAttemptsPerBuilding = Math.max(
    Math.floor(rules.placement.maxAttemptsPerBuilding),
    1
  );
  const allocations = createCampaignFortCityFortAllocations(
    input.fortInstances,
    rules,
    input.matrix,
    input.sampleHeightAtUv,
    input.worldScale
  );
  const rulesSignature =
    input.structureBuildingCache == null
      ? ""
      : getCampaignStructureBuildingRulesSignature(rules);
  const meshReadinessSignature =
    input.structureBuildingCache == null
      ? ""
      : getCampaignFortCityVariantMeshReadinessSignature(input.asset, rules);

  for (const allocation of allocations) {
    const cellInstances =
      input.cacheKind == null || input.structureBuildingCache == null
        ? createCampaignFortCityBuildingInstancesForFort({
          asset: input.asset,
          rules,
          fort: allocation.fort,
          targetCount: allocation.targetCount,
          maxAttemptsPerBuilding,
          terrainCoordinates: input.terrainCoordinates,
          onVariantMeshNeeded: input.onVariantMeshNeeded,
        })
        : getCachedCampaignFortCityBuildingInstancesForFort({
          asset: input.asset,
          rules,
          fort: allocation.fort,
          targetCount: allocation.targetCount,
          maxAttemptsPerBuilding,
          terrainCoordinates: input.terrainCoordinates,
          onVariantMeshNeeded: input.onVariantMeshNeeded,
          cacheKind: input.cacheKind,
          structureBuildingCache: input.structureBuildingCache,
          rulesSignature,
          meshReadinessSignature,
        });
    instances.push(...cellInstances.slice(0, allocation.count));
  }

  return instances;
}

function getCachedCampaignFortCityBuildingInstancesForFort(input: {
  asset: CampaignFortCityAsset;
  rules: CampaignStructureBuildingRulesAsset;
  fort: FortCityInstance;
  targetCount: number;
  maxAttemptsPerBuilding: number;
  terrainCoordinates: CampaignTerrainCoordinateSystem;
  onVariantMeshNeeded: (
    variant: CampaignFortCityRulesAsset["variants"][number]
  ) => void;
  cacheKind: CampaignStructureBuildingCacheKind;
  structureBuildingCache: CampaignStructureBuildingCache;
  rulesSignature: string;
  meshReadinessSignature: string;
}): CampaignFortCityBuildingInstance[] {
  const chunkKey = getCampaignTerrainChunkKey(
    getCampaignTerrainChunkForHexCell({
      x: input.fort.x,
      y: input.fort.y,
    })
  );
  const cellKey = `${input.cacheKind}:${input.fort.key}`;
  const signature = [
    input.cacheKind,
    input.fort.key,
    input.targetCount,
    input.rulesSignature,
    input.meshReadinessSignature,
  ].join("|");
  let chunkCache = input.structureBuildingCache.get(chunkKey);
  if (chunkCache == null) {
    chunkCache = new Map();
    input.structureBuildingCache.set(chunkKey, chunkCache);
  }
  const cached = chunkCache.get(cellKey);
  if (cached != null && cached.signature === signature) {
    return cached.instances;
  }

  const instances = createCampaignFortCityBuildingInstancesForFort({
    asset: input.asset,
    rules: input.rules,
    fort: input.fort,
    targetCount: input.targetCount,
    maxAttemptsPerBuilding: input.maxAttemptsPerBuilding,
    terrainCoordinates: input.terrainCoordinates,
    onVariantMeshNeeded: input.onVariantMeshNeeded,
  });
  chunkCache.set(cellKey, {
    signature,
    instances,
  });
  return instances;
}

function createCampaignFortCityBuildingInstancesForFort(input: {
  asset: CampaignFortCityAsset;
  rules: CampaignStructureBuildingRulesAsset;
  fort: FortCityInstance;
  targetCount: number;
  maxAttemptsPerBuilding: number;
  terrainCoordinates: CampaignTerrainCoordinateSystem;
  onVariantMeshNeeded: (
    variant: CampaignFortCityRulesAsset["variants"][number]
  ) => void;
}): CampaignFortCityBuildingInstance[] {
  const instances: CampaignFortCityBuildingInstance[] = [];
  const fortCenter = hexToPixel(input.fort.x, input.fort.y);
  const accepted: CampaignFortCityAcceptedPoint[] = [];
  const variantUsage = new Map<string, number>();

  for (let slotIndex = 0; slotIndex < input.targetCount; slotIndex += 1) {
    let placedInstance: {
      instance: CampaignFortCityBuildingInstance;
      point: CampaignFortCityAcceptedPoint;
    } | null = null;
    const variantAttempts = getCampaignFortCityVariantAttemptOrder({
      rules: input.rules,
      fort: input.fort,
      slotIndex,
      variantUsage,
    });

    for (const variant of variantAttempts) {
      placedInstance = createCampaignFortCityBuildingInstance({
        asset: input.asset,
        rules: input.rules,
        fort: input.fort,
        fortCenter,
        accepted,
        slotIndex,
        variant,
        maxAttemptCount: input.maxAttemptsPerBuilding,
        terrainCoordinates: input.terrainCoordinates,
        onVariantMeshNeeded: input.onVariantMeshNeeded,
      });
      if (placedInstance != null) {
        break;
      }
    }

    if (placedInstance != null) {
      instances.push(placedInstance.instance);
      accepted.push(placedInstance.point);
      variantUsage.set(
        placedInstance.instance.variant.id,
        (variantUsage.get(placedInstance.instance.variant.id) ?? 0) + 1
      );
    }
  }

  return instances;
}

function createCampaignFortCityBuildingInstance(input: {
  asset: CampaignFortCityAsset;
  rules: CampaignStructureBuildingRulesAsset;
  fort: FortCityInstance;
  fortCenter: { x: number; y: number };
  accepted: CampaignFortCityAcceptedPoint[];
  slotIndex: number;
  variant: CampaignFortCityRulesAsset["variants"][number];
  maxAttemptCount: number;
  terrainCoordinates: CampaignTerrainCoordinateSystem;
  onVariantMeshNeeded: (
    variant: CampaignFortCityRulesAsset["variants"][number]
  ) => void;
}): {
  instance: CampaignFortCityBuildingInstance;
  point: CampaignFortCityAcceptedPoint;
} | null {
  const variant = input.variant;
  const placement = getCampaignFortCityVariantPlacement(input.rules, variant);
  const scale =
    placement.scaleMin +
    seededRandom01(
      input.fort.x,
      input.fort.y,
      587 + input.slotIndex * 67
    ) *
      Math.max(placement.scaleMax - placement.scaleMin, 0);
  const footprintRadius = placement.footprintRadius * Math.max(scale, 0.01);
  const point = getCampaignFortCityBestCandidatePoint({
    rules: input.rules,
    fort: input.fort,
    fortCenter: input.fortCenter,
    accepted: input.accepted,
    slotIndex: input.slotIndex,
    maxAttemptCount: input.maxAttemptCount,
    footprintRadius,
  });

  if (point == null) {
    return null;
  }

  const mesh = input.asset.meshesById.get(variant.id) ?? null;
  if (mesh == null) {
    input.onVariantMeshNeeded(variant);
  }
  const instance: CampaignFortCityBuildingInstance = {
    mesh,
    variant,
    u: hexPointToTerrainU(point.x, input.terrainCoordinates),
    v: hexPointToTerrainV(point.y, input.terrainCoordinates),
    rotation:
      seededRandom01(
        input.fort.x,
        input.fort.y,
        601 + input.slotIndex * 71
      ) *
      Math.PI *
      2,
    scale,
    colorJitter:
      0.92 +
      seededRandom01(
        input.fort.x,
        input.fort.y,
        617 + input.slotIndex * 73
      ) *
        0.16,
    footprintRadius,
  };

  return {
    instance,
    point: {
      x: point.x,
      y: point.y,
      radius: instance.footprintRadius,
    },
  };
}

function getCampaignFortCityBestCandidatePoint(input: {
  rules: CampaignStructureBuildingRulesAsset;
  fort: FortCityInstance;
  fortCenter: { x: number; y: number };
  accepted: CampaignFortCityAcceptedPoint[];
  slotIndex: number;
  maxAttemptCount: number;
  footprintRadius: number;
}): { x: number; y: number } | null {
  const availableRadius = Math.max(
    input.rules.placement.outerRadius - input.footprintRadius,
    input.rules.placement.innerRadius
  );
  let bestPoint: { x: number; y: number } | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let attemptIndex = 0; attemptIndex < input.maxAttemptCount; attemptIndex += 1) {
    const point = getCampaignFortCityBuildingCandidatePoint({
      fort: input.fort,
      fortCenter: input.fortCenter,
      slotIndex: input.slotIndex,
      attemptIndex,
      radius: availableRadius,
    });
    const score =
      input.accepted.length === 0
        ? 0
        : Math.min(
            ...input.accepted.map(
              (item) =>
                getDistance(point, item) -
                item.radius -
                input.footprintRadius -
                input.rules.placement.minSpacing
            )
          );

    if (score >= 0 && (bestPoint == null || score > bestScore)) {
      bestPoint = point;
      bestScore = score;
      if (input.accepted.length === 0) {
        break;
      }
    }
  }

  return bestPoint;
}

function getCampaignFortCityBuildingCandidatePoint(input: {
  fort: FortCityInstance;
  fortCenter: { x: number; y: number };
  slotIndex: number;
  attemptIndex: number;
  radius: number;
}): { x: number; y: number } {
  for (let retryIndex = 0; retryIndex < 8; retryIndex += 1) {
    const seedBase =
      661 + input.slotIndex * 97 + input.attemptIndex * 43 + retryIndex * 17;
    const localX =
      (seededRandom01(input.fort.x, input.fort.y, seedBase) * 2 - 1) *
      input.radius *
      (Math.sqrt(3) / 2);
    const localY =
      (seededRandom01(input.fort.x, input.fort.y, seedBase + 7) * 2 - 1) *
      input.radius;

    if (isPointInsideCampaignFortCityHex(localX, localY, input.radius)) {
      return {
        x: input.fortCenter.x + localX,
        y: input.fortCenter.y + localY,
      };
    }
  }

  const fallbackAngle =
    seededRandom01(input.fort.x, input.fort.y, 673 + input.slotIndex * 101) *
    Math.PI *
    2;
  const fallbackRadius =
    Math.sqrt(
      seededRandom01(
        input.fort.x,
        input.fort.y,
        677 + input.slotIndex * 103 + input.attemptIndex * 47
      )
    ) *
    input.radius *
    0.86;

  return {
    x: input.fortCenter.x + Math.cos(fallbackAngle) * fallbackRadius,
    y: input.fortCenter.y + Math.sin(fallbackAngle) * fallbackRadius,
  };
}

function isPointInsideCampaignFortCityHex(
  x: number,
  y: number,
  radius: number
): boolean {
  return (
    Math.abs(y) <= radius &&
    Math.abs(Math.sqrt(3) * x + y) <= 2 * radius &&
    Math.abs(Math.sqrt(3) * x - y) <= 2 * radius
  );
}

function createCampaignFortStructureAvoidancePoints(
  fortInstances: FortCityInstance[],
  buildingInstances: CampaignFortCityBuildingInstance[],
  rules: CampaignFortCityRulesAsset | null
): CampaignVegetationAvoidancePoint[] {
  const wallRadius = rules?.avoidance.wallRadius ?? 0.64;
  const buildingRadiusPadding = rules?.avoidance.buildingRadiusPadding ?? 0.08;

  return [
    ...fortInstances.map((instance) => ({
      u: instance.u,
      v: instance.v,
      radius: wallRadius,
    })),
    ...buildingInstances.map((instance) => ({
      u: instance.u,
      v: instance.v,
      radius: instance.footprintRadius + buildingRadiusPadding,
    })),
  ];
}

function getCampaignFortCityMeshSignature(
  instances: CampaignFortCityBuildingInstance[]
): string {
  return instances
    .map(
      (instance) =>
        [
          instance.variant.id,
          instance.mesh == null ? "pending" : "ready",
          instance.u.toFixed(4),
          instance.v.toFixed(4),
          instance.rotation.toFixed(3),
          instance.scale.toFixed(3),
        ].join(":")
    )
    .join("|");
}

function getCampaignStructureBuildingRulesSignature(
  rules: CampaignStructureBuildingRulesAsset
): string {
  return JSON.stringify({
    count: rules.count,
    placement: rules.placement,
    variants: rules.variants.map((variant) => ({
      id: variant.id,
      weight: variant.weight,
      placement: variant.placement ?? null,
    })),
  });
}

function getCampaignFortCityVariantMeshReadinessSignature(
  asset: CampaignFortCityAsset,
  rules: CampaignStructureBuildingRulesAsset
): string {
  return rules.variants
    .map((variant) => `${variant.id}:${asset.meshesById.has(variant.id) ? 1 : 0}`)
    .join(",");
}

function createCampaignFortCityInstancedRenderModel(input: {
  instances: CampaignFortCityBuildingInstance[];
  sampleHeightAtUv: (u: number, v: number) => number;
  rules: CampaignStructureBuildingRulesAsset;
  signature: string;
  worldScale: CampaignTerrainWorldScale;
}): CampaignFortCityInstancedRenderModel {
  const groupedInstances = new Map<
    string,
    {
      mesh: VegetationMeshAsset;
      variant: CampaignFortCityRulesAsset["variants"][number];
      instances: CampaignFortCityBuildingInstance[];
    }
  >();
  for (const instance of input.instances) {
    if (instance.mesh == null) {
      continue;
    }
    const group = groupedInstances.get(instance.variant.id);
    if (group == null) {
      groupedInstances.set(instance.variant.id, {
        mesh: instance.mesh,
        variant: instance.variant,
        instances: [instance],
      });
      continue;
    }

    group.instances.push(instance);
  }

  const batches = Array.from(groupedInstances.values())
    .sort((left, right) => left.variant.id.localeCompare(right.variant.id))
    .map((group): CampaignFortCityInstancedBatch => {
      const instanceData = new Float32Array(group.instances.length * 8);
      const placement = getCampaignFortCityVariantPlacement(
        input.rules,
        group.variant
      );
      for (let index = 0; index < group.instances.length; index += 1) {
        const instance = group.instances[index];
        if (instance == null) {
          continue;
        }
        const height = input.sampleHeightAtUv(instance.u, instance.v);
        const center = createTerrainWorldPoint(
          instance.u,
          instance.v,
          height,
          input.worldScale
        );
        const outputOffset = index * 8;
        instanceData[outputOffset] = center[0];
        instanceData[outputOffset + 1] = center[1];
        instanceData[outputOffset + 2] = center[2];
        instanceData[outputOffset + 3] = Math.cos(instance.rotation);
        instanceData[outputOffset + 4] = Math.sin(instance.rotation);
        instanceData[outputOffset + 5] = placement.baseWorldScale * instance.scale;
        instanceData[outputOffset + 6] = placement.lift;
        instanceData[outputOffset + 7] = instance.colorJitter;
      }

      return {
        mesh: group.mesh,
        variant: group.variant,
        instances: group.instances,
        instanceData,
      };
    });

  return {
    signature: input.signature,
    batches,
    instanceCount: batches.reduce(
      (sum, batch) => sum + batch.instances.length,
      0
    ),
  };
}

function getOrCreateCampaignFortCityInstancedVariantResource(input: {
  gl: WebGLRenderingContext;
  resourcesById: Map<string, CampaignFortCityInstancedVariantResource>;
  mesh: VegetationMeshAsset;
}): CampaignFortCityInstancedVariantResource | null {
  const cached = input.resourcesById.get(input.mesh.id);
  if (cached != null && cached.mesh === input.mesh) {
    return cached;
  }
  if (cached != null) {
    input.gl.deleteBuffer(cached.vertexBuffer);
    input.gl.deleteBuffer(cached.indexBuffer);
    input.resourcesById.delete(input.mesh.id);
  }

  const vertexBuffer = input.gl.createBuffer();
  const indexBuffer = input.gl.createBuffer();
  if (vertexBuffer == null || indexBuffer == null) {
    if (vertexBuffer != null) {
      input.gl.deleteBuffer(vertexBuffer);
    }
    if (indexBuffer != null) {
      input.gl.deleteBuffer(indexBuffer);
    }
    return null;
  }

  input.gl.bindBuffer(input.gl.ARRAY_BUFFER, vertexBuffer);
  input.gl.bufferData(
    input.gl.ARRAY_BUFFER,
    createCampaignFortCityInstancedVariantVertices(input.mesh),
    input.gl.STATIC_DRAW
  );
  input.gl.bindBuffer(input.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  input.gl.bufferData(
    input.gl.ELEMENT_ARRAY_BUFFER,
    input.mesh.indices,
    input.gl.STATIC_DRAW
  );

  const resource: CampaignFortCityInstancedVariantResource = {
    mesh: input.mesh,
    vertexBuffer,
    indexBuffer,
    indexCount: input.mesh.indices.length,
  };
  input.resourcesById.set(input.mesh.id, resource);
  return resource;
}

function createCampaignFortCityInstancedVariantVertices(
  mesh: VegetationMeshAsset
): Float32Array {
  const sourceVertexCount = mesh.positions.length / 3;
  const vertices = new Float32Array(sourceVertexCount * 9);
  for (let sourceVertexIndex = 0; sourceVertexIndex < sourceVertexCount; sourceVertexIndex += 1) {
    const sourceOffset = sourceVertexIndex * 3;
    const outputOffset = sourceVertexIndex * 9;
    vertices[outputOffset] = mesh.positions[sourceOffset] ?? 0;
    vertices[outputOffset + 1] = mesh.positions[sourceOffset + 1] ?? 0;
    vertices[outputOffset + 2] = mesh.positions[sourceOffset + 2] ?? 0;
    vertices[outputOffset + 3] = mesh.normals[sourceOffset] ?? 0;
    vertices[outputOffset + 4] = mesh.normals[sourceOffset + 1] ?? 0;
    vertices[outputOffset + 5] = mesh.normals[sourceOffset + 2] ?? 1;
    vertices[outputOffset + 6] = mesh.colors[sourceOffset] ?? 1;
    vertices[outputOffset + 7] = mesh.colors[sourceOffset + 1] ?? 1;
    vertices[outputOffset + 8] = mesh.colors[sourceOffset + 2] ?? 1;
  }

  return vertices;
}

function createCampaignFortCityMesh(input: {
  instances: CampaignFortCityBuildingInstance[];
  sampleHeightAtUv: (u: number, v: number) => number;
  rules: CampaignStructureBuildingRulesAsset;
  worldScale: CampaignTerrainWorldScale;
}): VegetationMeshData {
  const drawableInstances = input.instances.filter(
    (instance): instance is CampaignFortCityBuildingInstance & {
      mesh: VegetationMeshAsset;
    } => instance.mesh != null
  );
  const vertexCount = drawableInstances.reduce(
    (sum, instance) => sum + instance.mesh.positions.length / 3,
    0
  );
  const indexCount = drawableInstances.reduce(
    (sum, instance) => sum + instance.mesh.indices.length,
    0
  );
  const vertices = new Float32Array(vertexCount * 9);
  const indices = new Uint32Array(indexCount);
  let vertexOffset = 0;
  let indexOffset = 0;

  for (const instance of drawableInstances) {
    const height = input.sampleHeightAtUv(instance.u, instance.v);
    const center = createTerrainWorldPoint(instance.u, instance.v, height, input.worldScale);
    const rotationCos = Math.cos(instance.rotation);
    const rotationSin = Math.sin(instance.rotation);
    const placement = getCampaignFortCityVariantPlacement(
      input.rules,
      instance.variant
    );
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
    vertexOffset += sourceVertexCount;
    indexOffset += instance.mesh.indices.length;
  }

  return {
    vertices,
    indices,
    shadowVertices: new Float32Array(),
    shadowIndices: new Uint32Array(),
    instanceCount: drawableInstances.length,
  };
}

function getCampaignFortCityVariantAttemptOrder(input: {
  rules: CampaignStructureBuildingRulesAsset;
  fort: FortCityInstance;
  slotIndex: number;
  variantUsage: Map<string, number>;
}): CampaignStructureBuildingRulesAsset["variants"] {
  return [...input.rules.variants].sort((left, right) => {
    const usageDelta =
      (input.variantUsage.get(left.id) ?? 0) -
      (input.variantUsage.get(right.id) ?? 0);
    if (usageDelta !== 0) {
      return usageDelta;
    }

    const leftIndex = input.rules.variants.indexOf(left);
    const rightIndex = input.rules.variants.indexOf(right);
    const leftWeight = Math.max(left.weight, 0);
    const rightWeight = Math.max(right.weight, 0);
    const weightDelta = rightWeight - leftWeight;
    const leftTieBreaker = seededRandom01(
      input.fort.x,
      input.fort.y,
      541 + input.slotIndex * 53 + leftIndex * 97
    );
    const rightTieBreaker = seededRandom01(
      input.fort.x,
      input.fort.y,
      541 + input.slotIndex * 53 + rightIndex * 97
    );

    return weightDelta || leftTieBreaker - rightTieBreaker;
  });
}

function getCampaignFortCityVariantPlacement(
  rules: CampaignStructureBuildingRulesAsset,
  variant: CampaignFortCityRulesAsset["variants"][number]
): {
  scaleMin: number;
  scaleMax: number;
  baseWorldScale: number;
  lift: number;
  footprintRadius: number;
} {
  return {
    scaleMin: variant.placement?.scaleMin ?? rules.placement.scaleMin,
    scaleMax: variant.placement?.scaleMax ?? rules.placement.scaleMax,
    baseWorldScale:
      variant.placement?.baseWorldScale ?? rules.placement.baseWorldScale,
    lift: variant.placement?.lift ?? rules.placement.lift,
    footprintRadius:
      variant.placement?.footprintRadius ?? rules.placement.footprintRadius,
  };
}

function snapTerrainUvToHexCenter(
  u: number,
  v: number,
  terrainCoordinates: CampaignTerrainCoordinateSystem
): { u: number; v: number } {
  const point = terrainUvToHexPoint(u, v, terrainCoordinates);
  const cell = pixelToRoundedHex(point.x, point.y);
  const center = hexToPixel(cell.x, cell.y);

  return {
    u: hexPointToTerrainU(center.x, terrainCoordinates),
    v: hexPointToTerrainV(center.y, terrainCoordinates),
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
  const terrainByCellKey = new Map<string, string>();
  const referenceHeightByCellKey = new Map<string, number>();
  const structureGroundByCellKey = new Map<string, CampaignStructureGroundSemantic>();

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
    terrainByCellKey.set(getHexCellKey(cell.x, cell.y), isLand ? "平原" : "");
    referenceHeightByCellKey.set(getHexCellKey(cell.x, cell.y), 0);
    pixels[pixelOffset] = value;
    pixels[pixelOffset + 1] = 0;
    pixels[pixelOffset + 2] = 0;
    pixels[pixelOffset + 3] = 255;
  }

  const coordinateSystem = {
    hexTerrainScale: HEX_TERRAIN_SCALE,
    hexMapAspect: HEX_MAP_ASPECT,
    coordinateSpace: {
      width: columns,
      height: rows,
    },
  };
  const terrainCoordinates = createCampaignTerrainCoordinateSystem(coordinateSystem);

  return {
    signature: [
      "material-image",
      columns,
      rows,
      cellColumns,
      cellRows,
    ].join("|"),
    coordinateSystem,
    terrainCoordinates,
    worldScale: terrainCoordinates.worldScale,
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
    terrainByCellKey,
    referenceHeightByCellKey,
    structureGroundByCellKey,
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
  const terrainByCellKey = new Map<string, string>();
  const referenceHeightByCellKey = new Map<string, number>();
  const structureGroundByCellKey = new Map<string, CampaignStructureGroundSemantic>();

  for (const cell of campaignHexGrid.cells) {
    const pixelX = cell.x - minCellX;
    const pixelY = cell.y - minCellY;
    const pixelOffset = (pixelY * textureColumns + pixelX) * 4;
    const value = cell.land ? 255 : 0;
    const cellKey = getHexCellKey(cell.x, cell.y);
    const structureGround =
      cell.land && isCampaignStructureGroundSemantic(cell.structureGround)
        ? cell.structureGround
        : null;
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

    landByCellKey.set(cellKey, cell.land);
    mountainByCellKey.set(cellKey, mountainValue > 0);
    terrainByCellKey.set(cellKey, cell.land ? cell.terrain : "");
    referenceHeightByCellKey.set(
      cellKey,
      cell.land ? clamp(cell.referenceHeight, 0, 1) : 0
    );
    pixels[pixelOffset] = value;
    pixels[pixelOffset + 1] = mountainValue;
    pixels[pixelOffset + 2] =
      structureGround == null
        ? 0
        : CAMPAIGN_STRUCTURE_GROUND_SEMANTIC_VALUE[structureGround];
    pixels[pixelOffset + 3] = 255;
    if (structureGround != null) {
      structureGroundByCellKey.set(cellKey, structureGround);
    }
  }

  const terrainCoordinates = createCampaignTerrainCoordinateSystem(
    campaignHexGrid.coordinateSystem
  );

  return {
    signature: getCampaignHexGridContentSignature(campaignHexGrid),
    coordinateSystem: campaignHexGrid.coordinateSystem,
    terrainCoordinates,
    worldScale: terrainCoordinates.worldScale,
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
    terrainByCellKey,
    referenceHeightByCellKey,
    structureGroundByCellKey,
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
        u: hexPointToTerrainU(center.x, campaignHexGrid.coordinateSystem),
        v: hexPointToTerrainV(center.y, campaignHexGrid.coordinateSystem),
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
  rules: CampaignVegetationRulesAsset,
  structureAvoidancePoints: CampaignVegetationAvoidancePoint[] = []
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

  points.push(...structureAvoidancePoints);

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
  worldScale: CampaignTerrainWorldScale;
  terrainCoordinates: CampaignTerrainCoordinateSystem;
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
        input.sampleHeightAtUv,
        input.worldScale
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
        input.avoidancePoints,
        input.terrainCoordinates
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
      input.terrainCoordinates,
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
    input.canvasWidth / Math.max(input.canvasHeight, 1),
    input.worldScale
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
  sampleHeightAtUv: (u: number, v: number) => number,
  worldScale: CampaignTerrainWorldScale
): { priority: number; screenX: number; screenY: number } | null {
  const height = sampleHeightAtUv(cell.u, cell.v);
  const screenPoint = projectPoint(
    matrix,
    createTerrainWorldPoint(cell.u, cell.v, height, worldScale)
  );
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
  avoidancePoints: CampaignVegetationAvoidancePoint[],
  terrainCoordinates: CampaignTerrainCoordinateSystem
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
    rules,
    terrainCoordinates
  );

  return Math.max(0, Math.floor(baseCount * avoidanceMultiplier));
}

function appendCampaignVegetationCellInstances(
  instances: CampaignVegetationInstance[],
  cell: CampaignVegetationCell,
  asset: CampaignVegetationAsset,
  avoidancePoints: CampaignVegetationAvoidancePoint[],
  terrainCoordinates: CampaignTerrainCoordinateSystem,
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

    if (isCampaignVegetationPointAvoided(point, avoidancePoints, terrainCoordinates)) {
      continue;
    }

    const u = hexPointToTerrainU(point.x, terrainCoordinates);
    const v = hexPointToTerrainV(point.y, terrainCoordinates);
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
  rules: CampaignVegetationRulesAsset,
  terrainCoordinates: CampaignTerrainCoordinateSystem
): number {
  for (const avoidancePoint of avoidancePoints) {
    const point = terrainUvToHexPoint(
      avoidancePoint.u,
      avoidancePoint.v,
      terrainCoordinates
    );
    if (getDistance(point, cellCenter) <= avoidancePoint.radius * 1.15) {
      return clamp(rules.avoidance.densityMultiplierNearAvoidance, 0, 1);
    }
  }

  return 1;
}

function isCampaignVegetationPointAvoided(
  point: { x: number; y: number },
  avoidancePoints: CampaignVegetationAvoidancePoint[],
  terrainCoordinates: CampaignTerrainCoordinateSystem
): boolean {
  return avoidancePoints.some((avoidancePoint) => {
    const avoidPoint = terrainUvToHexPoint(
      avoidancePoint.u,
      avoidancePoint.v,
      terrainCoordinates
    );
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
  viewportAspectRatio: number,
  terrainWorldScale: CampaignTerrainWorldScale
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
    const center = createTerrainWorldPoint(instance.u, instance.v, height, terrainWorldScale);
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
  appendCampaignProjectedShadowGeometry({
    vertices,
    indices,
    vertexOffset,
    indexOffset,
    center,
    width,
    height,
    matrix,
    viewportAspectRatio,
    radiusScaleX: rules.shadow.radiusScaleX,
    radiusScaleY: rules.shadow.radiusScaleY,
    lightOffsetScale: rules.shadow.lightOffsetScale,
    lift: rules.shadow.lift,
  });
}

function appendCampaignProjectedShadowGeometry(input: {
  vertices: Float32Array;
  indices: Uint16Array | Uint32Array;
  vertexOffset: number;
  indexOffset: number;
  center: [number, number, number];
  width: number;
  height: number;
  matrix: Mat4;
  viewportAspectRatio: number;
  radiusScaleX: number;
  radiusScaleY: number;
  lightOffsetScale: number;
  lift: number;
}): void {
  const shadowLength =
    Math.max(input.width, input.height * 0.58) *
    input.radiusScaleX *
    (1 + clamp(input.lightOffsetScale, 0, 0.72));
  const shadowWidth =
    Math.max(input.width * 0.42, input.height * 0.12) * input.radiusScaleY;
  const shadowDirection = getCampaignVegetationShadowWorldDirection(
    input.center,
    input.matrix,
    getCampaignVegetationTerrainShadowScreenDirection(
      input.center,
      input.matrix,
      input.viewportAspectRatio
    )
  );
  const perpendicular: [number, number] = [-shadowDirection[1], shadowDirection[0]];
  const rootX = input.center[0];
  const rootY = input.center[1];
  const farX = rootX + shadowDirection[0] * shadowLength;
  const farY = rootY + shadowDirection[1] * shadowLength;
  const shadowZ = input.center[2] + input.lift;
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
    const offset = (input.vertexOffset + index) * 5;
    input.vertices[offset] = corner.x;
    input.vertices[offset + 1] = corner.y;
    input.vertices[offset + 2] = shadowZ;
    input.vertices[offset + 3] = corner.u;
    input.vertices[offset + 4] = corner.v;
  }

  input.indices[input.indexOffset] = input.vertexOffset;
  input.indices[input.indexOffset + 1] = input.vertexOffset + 1;
  input.indices[input.indexOffset + 2] = input.vertexOffset + 2;
  input.indices[input.indexOffset + 3] = input.vertexOffset;
  input.indices[input.indexOffset + 4] = input.vertexOffset + 2;
  input.indices[input.indexOffset + 5] = input.vertexOffset + 3;
}

function appendCampaignStructureBlobShadowGeometry(input: {
  vertices: Float32Array;
  indices: Uint16Array | Uint32Array;
  vertexOffset: number;
  indexOffset: number;
  center: [number, number, number];
  width: number;
  height: number;
  footprintRadius: number;
  matrix: Mat4;
  viewportAspectRatio: number;
  radiusScaleX: number;
  radiusScaleY: number;
  lightOffsetScale: number;
  lift: number;
}): void {
  const shadowDirection = getCampaignVegetationShadowWorldDirection(
    input.center,
    input.matrix,
    getCampaignVegetationTerrainShadowScreenDirection(
      input.center,
      input.matrix,
      input.viewportAspectRatio
    )
  );
  const perpendicular: [number, number] = [-shadowDirection[1], shadowDirection[0]];
  const visualRadius = Math.max(input.width * 0.50, 0.0001);
  const placementRadius = Math.max(input.footprintRadius * 0.42, 0.0001);
  const footprintRadius = clamp(
    Math.max(visualRadius, placementRadius),
    visualRadius * 0.72,
    visualRadius * 1.35
  );
  const shadowHalfWidth = footprintRadius * input.radiusScaleX;
  const shadowHalfLength =
    Math.max(footprintRadius * 0.58, input.height * 0.040) *
    input.radiusScaleY;
  const shadowOffset =
    Math.max(footprintRadius * 0.18, input.height * 0.018) *
    clamp(input.lightOffsetScale, 0, 0.24);
  const centerX = input.center[0] + shadowDirection[0] * shadowOffset;
  const centerY = input.center[1] + shadowDirection[1] * shadowOffset;
  const shadowZ = input.center[2] + input.lift;
  const corners: Array<{
    x: number;
    y: number;
    u: number;
    v: number;
  }> = [
    {
      x: centerX - perpendicular[0] * shadowHalfWidth - shadowDirection[0] * shadowHalfLength,
      y: centerY - perpendicular[1] * shadowHalfWidth - shadowDirection[1] * shadowHalfLength,
      u: -1,
      v: -1,
    },
    {
      x: centerX + perpendicular[0] * shadowHalfWidth - shadowDirection[0] * shadowHalfLength,
      y: centerY + perpendicular[1] * shadowHalfWidth - shadowDirection[1] * shadowHalfLength,
      u: 1,
      v: -1,
    },
    {
      x: centerX + perpendicular[0] * shadowHalfWidth + shadowDirection[0] * shadowHalfLength,
      y: centerY + perpendicular[1] * shadowHalfWidth + shadowDirection[1] * shadowHalfLength,
      u: 1,
      v: 1,
    },
    {
      x: centerX - perpendicular[0] * shadowHalfWidth + shadowDirection[0] * shadowHalfLength,
      y: centerY - perpendicular[1] * shadowHalfWidth + shadowDirection[1] * shadowHalfLength,
      u: -1,
      v: 1,
    },
  ];

  for (let index = 0; index < corners.length; index += 1) {
    const corner = corners[index] ?? { x: centerX, y: centerY, u: 0, v: 0 };
    const offset = (input.vertexOffset + index) * 5;
    input.vertices[offset] = corner.x;
    input.vertices[offset + 1] = corner.y;
    input.vertices[offset + 2] = shadowZ;
    input.vertices[offset + 3] = corner.u;
    input.vertices[offset + 4] = corner.v;
  }

  input.indices[input.indexOffset] = input.vertexOffset;
  input.indices[input.indexOffset + 1] = input.vertexOffset + 1;
  input.indices[input.indexOffset + 2] = input.vertexOffset + 2;
  input.indices[input.indexOffset + 3] = input.vertexOffset;
  input.indices[input.indexOffset + 4] = input.vertexOffset + 2;
  input.indices[input.indexOffset + 5] = input.vertexOffset + 3;
}

function createCampaignFortCityShadowMesh(input: {
  instances: CampaignFortCityBuildingInstance[];
  sampleHeightAtUv: (u: number, v: number) => number;
  rules: CampaignStructureBuildingRulesAsset;
  matrix: Mat4;
  viewportAspectRatio: number;
  worldScale: CampaignTerrainWorldScale;
}): CampaignProjectedShadowMeshData {
  const drawableInstances = input.instances.filter(
    (instance): instance is CampaignFortCityBuildingInstance & {
      mesh: VegetationMeshAsset;
    } => instance.mesh != null
  );
  const shadowVertices = new Float32Array(drawableInstances.length * 4 * 5);
  const shadowIndices = new Uint16Array(drawableInstances.length * 6);
  let shadowVertexOffset = 0;
  let shadowIndexOffset = 0;

  for (const instance of drawableInstances) {
    const height = input.sampleHeightAtUv(instance.u, instance.v);
    const center = createTerrainWorldPoint(instance.u, instance.v, height, input.worldScale);
    const placement = getCampaignFortCityVariantPlacement(
      input.rules,
      instance.variant
    );
    const worldScale = placement.baseWorldScale * instance.scale;
    const width = Math.max(
      instance.mesh.bounds.max[0] - instance.mesh.bounds.min[0],
      instance.mesh.bounds.max[1] - instance.mesh.bounds.min[1],
      0.0001
    ) * worldScale;
    const meshHeight = Math.max(
      instance.mesh.bounds.max[2] - instance.mesh.bounds.min[2],
      0.0001
    ) * worldScale;
    appendCampaignStructureBlobShadowGeometry({
      vertices: shadowVertices,
      indices: shadowIndices,
      vertexOffset: shadowVertexOffset,
      indexOffset: shadowIndexOffset,
      center,
      width,
      height: meshHeight,
      footprintRadius: instance.footprintRadius,
      matrix: input.matrix,
      viewportAspectRatio: input.viewportAspectRatio,
      radiusScaleX: CAMPAIGN_STRUCTURE_SHADOW_RADIUS_SCALE_X,
      radiusScaleY: CAMPAIGN_STRUCTURE_SHADOW_RADIUS_SCALE_Y,
      lightOffsetScale: CAMPAIGN_STRUCTURE_SHADOW_LIGHT_OFFSET_SCALE,
      lift: CAMPAIGN_STRUCTURE_SHADOW_LIFT,
    });
    shadowVertexOffset += 4;
    shadowIndexOffset += 6;
  }

  return {
    vertices: shadowVertices.subarray(0, shadowVertexOffset * 5),
    indices: shadowIndices.subarray(0, shadowIndexOffset),
  };
}

function createCampaignActorShadowMesh(input: {
  actor: CampaignActorData;
  height: number;
  model: ActorModelAsset;
  matrix: Mat4;
  viewportAspectRatio: number;
  worldScale: CampaignTerrainWorldScale;
}): CampaignProjectedShadowMeshData {
  const center = createTerrainWorldPoint(
    input.actor.u,
    input.actor.v,
    input.height,
    input.worldScale
  );
  const scale = getCampaignActorModelWorldScale(input.model);
  const width = Math.max(
    input.model.bounds.max[0] - input.model.bounds.min[0],
    input.model.bounds.max[1] - input.model.bounds.min[1],
    0.0001
  ) * scale;
  const height = Math.max(
    input.model.bounds.max[2] - input.model.bounds.min[2],
    0.0001
  ) * scale;
  const shadowVertices = new Float32Array(4 * 5);
  const shadowIndices = new Uint16Array(6);
  appendCampaignProjectedShadowGeometry({
    vertices: shadowVertices,
    indices: shadowIndices,
    vertexOffset: 0,
    indexOffset: 0,
    center,
    width,
    height,
    matrix: input.matrix,
    viewportAspectRatio: input.viewportAspectRatio,
    radiusScaleX: CAMPAIGN_ACTOR_SHADOW_RADIUS_SCALE_X,
    radiusScaleY: CAMPAIGN_ACTOR_SHADOW_RADIUS_SCALE_Y,
    lightOffsetScale: CAMPAIGN_ACTOR_SHADOW_LIGHT_OFFSET_SCALE,
    lift: CAMPAIGN_ACTOR_SHADOW_LIFT,
  });

  return {
    vertices: shadowVertices,
    indices: shadowIndices,
  };
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

function syncProjectedPoints(input: {
  canvas: HTMLCanvasElement;
  materialSemanticModel: CampaignMaterialSemanticModel;
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
    const worldPoint = createTerrainWorldPoint(
      u,
      v,
      height,
      input.materialSemanticModel.worldScale
    );
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
      terrainCoordinates: materialSemanticModel.terrainCoordinates,
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
      const point = terrainUvToHexPoint(
        u,
        v,
        materialSemanticModel.terrainCoordinates
      );
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
  terrainCoordinates: CampaignTerrainCoordinateSystem;
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
  const minEdgeU = hexPointToTerrainU(minX, input.terrainCoordinates);
  const maxEdgeU = hexPointToTerrainU(maxX, input.terrainCoordinates);
  const minEdgeV = hexPointToTerrainV(minY, input.terrainCoordinates);
  const maxEdgeV = hexPointToTerrainV(maxY, input.terrainCoordinates);
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
      const point = terrainUvToHexPoint(u, v, input.terrainCoordinates);
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
  animationState: ActorAnimationPlaybackState,
  worldScale: CampaignTerrainWorldScale
): ActorMeshData {
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
    height,
    worldScale
  );
  const scale = getCampaignActorModelWorldScale(model);
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

function getCampaignActorModelWorldScale(model: ActorModelAsset): number {
  return ACTOR_MODEL_BASE_SCALE * model.scale;
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
  const summitErosionGuard = clamp(
    Math.max(rangeRelief.peak, rangeRelief.ridge) * 1.35,
    0,
    0.98
  );
  const detailScale =
    MOUNTAIN_HEIGHT_DETAIL_STRENGTH *
    (0.72 + referenceAmount * 0.28);
  const constructiveDetail = Math.max(rangeRelief.detail, 0) * detailScale;
  const erosiveDetail =
    Math.min(rangeRelief.detail, 0) *
    detailScale *
    (1 - summitErosionGuard);
  const erosiveValley =
    rangeRelief.valley *
    MOUNTAIN_HEIGHT_VALLEY_STRENGTH *
    (1 - summitErosionGuard);
  const normalizedRelief = clamp(
    rangeRelief.body * MOUNTAIN_HEIGHT_BODY_STRENGTH +
      rangeRelief.peak * MOUNTAIN_HEIGHT_PEAK_STRENGTH +
      rangeRelief.ridge * MOUNTAIN_HEIGHT_RIDGE_STRENGTH -
      erosiveValley +
      constructiveDetail +
      erosiveDetail,
    0,
    1
  );
  const mountainHeight =
    terrainBaseAmount +
    mountainDeltaScale * normalizedRelief * boundaryAmount;

  return clamp(mountainHeight, terrainBaseAmount, heightCap);
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
  const guardedValley =
    valley.ridge *
    body *
    (1 - clamp(Math.max(peakField.peak, ridgeAmount) * MOUNTAIN_HEIGHT_VALLEY_PEAK_GUARD, 0, 0.98));
  const peakRidgeGuard = clamp(
    Math.max(peakField.peak, ridgeAmount) * MOUNTAIN_HEIGHT_VALLEY_PEAK_GUARD,
    0,
    0.98
  );
  const detailValue = detailFbm.value - 0.5;
  const guardedDetail =
    detailValue < 0
      ? detailValue * (1 - peakRidgeGuard)
      : detailValue;
  const erodedDetail =
    guardedDetail *
    (1 - clamp(detailFbm.erosionAmount * 0.52, 0, 0.52)) *
    (0.64 + referenceAmount * 0.36);

  return {
    body,
    peak: peakField.peak,
    ridge: ridgeAmount,
    valley: guardedValley,
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
    createMountainRidgeAmount(sample.value, 1.72) *
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

function isPlainTerrainHexCell(
  materialSemanticModel: CampaignMaterialSemanticModel,
  cell: GridCoordinate
): boolean {
  const cellKey = getHexCellKey(cell.x, cell.y);

  return (
    materialSemanticModel.landByCellKey.get(cellKey) === true &&
    materialSemanticModel.terrainByCellKey.get(cellKey) === "平原"
  );
}

function isLandTerrainSample(
  materialSemanticModel: CampaignMaterialSemanticModel,
  u: number,
  v: number
): boolean {
  const point = terrainUvToHexPoint(
    u,
    v,
    materialSemanticModel.terrainCoordinates
  );
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
  normal: [number, number, number],
  worldScale: CampaignTerrainWorldScale = DEFAULT_TERRAIN_WORLD_SCALE
): number {
  return addTerrainVertex(vertices, u, v, u, v, height, normal, worldScale);
}

function addTerrainVertex(
  vertices: number[],
  positionU: number,
  positionV: number,
  sampleU: number,
  sampleV: number,
  height: number,
  normal: [number, number, number],
  worldScale: CampaignTerrainWorldScale = DEFAULT_TERRAIN_WORLD_SCALE
): number {
  const vertexIndex = vertices.length / 8;
  vertices.push(
    (positionU - 0.5) * 2 * worldScale.x,
    (0.5 - positionV) * 2 * worldScale.y,
    height * HEIGHT_SCALE,
    sampleU,
    sampleV,
    normal[0],
    normal[1],
    normal[2]
  );

  return vertexIndex;
}

function createDefaultCampaignTerrainCoordinateSystemInput(): CampaignHexGridAsset["coordinateSystem"] {
  return {
    hexTerrainScale: HEX_TERRAIN_SCALE,
    hexMapAspect: HEX_MAP_ASPECT,
    coordinateSpace: { width: GRID_COLUMNS, height: GRID_ROWS },
  };
}

function getCampaignHexPointBounds(
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
): CampaignTerrainHexPointBounds {
  if (coordinateSystem.hexPointBounds != null) {
    return coordinateSystem.hexPointBounds;
  }

  return {
    minX: -coordinateSystem.hexMapAspect * coordinateSystem.hexTerrainScale * 0.5,
    maxX: coordinateSystem.hexMapAspect * coordinateSystem.hexTerrainScale * 0.5,
    minY: -coordinateSystem.hexTerrainScale * 0.5,
    maxY: coordinateSystem.hexTerrainScale * 0.5,
  };
}

function createCampaignTerrainCoordinateSystem(
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
): CampaignTerrainCoordinateSystem {
  const hexPointBounds = getCampaignHexPointBounds(coordinateSystem);
  const width = Math.max(hexPointBounds.maxX - hexPointBounds.minX, 1);
  const height = Math.max(hexPointBounds.maxY - hexPointBounds.minY, 1);

  return {
    coordinateSystem,
    hexPointBounds,
    worldScale: {
      x: Math.max(width / (HEX_MAP_ASPECT * HEX_TERRAIN_SCALE), 1),
      y: Math.max(height / HEX_TERRAIN_SCALE, 1),
    },
  };
}

function isCampaignTerrainCoordinateSystem(
  coordinates: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"]
): coordinates is CampaignTerrainCoordinateSystem {
  return (
    "coordinateSystem" in coordinates &&
    "hexPointBounds" in coordinates &&
    "worldScale" in coordinates
  );
}

function normalizeCampaignTerrainCoordinates(
  coordinates: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"] =
    createDefaultCampaignTerrainCoordinateSystemInput()
): CampaignTerrainCoordinateSystem {
  return isCampaignTerrainCoordinateSystem(coordinates)
    ? coordinates
    : createCampaignTerrainCoordinateSystem(coordinates);
}

function createCampaignTerrainWorldScale(
  coordinateSystem: CampaignHexGridAsset["coordinateSystem"]
): CampaignTerrainWorldScale {
  return createCampaignTerrainCoordinateSystem(coordinateSystem).worldScale;
}

function terrainUvToHexPoint(
  u: number,
  v: number,
  coordinates: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"] =
    createDefaultCampaignTerrainCoordinateSystemInput()
): { x: number; y: number } {
  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
  const bounds = terrainCoordinates.hexPointBounds;

  return {
    x: bounds.minX + u * (bounds.maxX - bounds.minX),
    y: bounds.minY + v * (bounds.maxY - bounds.minY),
  };
}

function hexPointToTerrainU(
  x: number,
  coordinates: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"] =
    createDefaultCampaignTerrainCoordinateSystemInput()
): number {
  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
  const bounds = terrainCoordinates.hexPointBounds;
  return clamp(
    (x - bounds.minX) / Math.max(bounds.maxX - bounds.minX, 0.000001),
    0,
    1
  );
}

function hexPointToTerrainV(
  y: number,
  coordinates: CampaignTerrainCoordinateSystem | CampaignHexGridAsset["coordinateSystem"] =
    createDefaultCampaignTerrainCoordinateSystemInput()
): number {
  const terrainCoordinates = normalizeCampaignTerrainCoordinates(coordinates);
  const bounds = terrainCoordinates.hexPointBounds;
  return clamp(
    (y - bounds.minY) / Math.max(bounds.maxY - bounds.minY, 0.000001),
    0,
    1
  );
}

function getHexCellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function isHexPassableAtUv(
  materialSemanticModel: CampaignMaterialSemanticModel,
  u: number,
  v: number
): boolean {
  const point = terrainUvToHexPoint(
    u,
    v,
    materialSemanticModel.terrainCoordinates
  );
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

function createStructureGroundTextureAtlas(
  villageImage: CanvasImageSource,
  cityImage: CanvasImageSource
): HTMLCanvasElement {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (context == null) {
    throw new Error("Failed to create campaign structure ground texture atlas.");
  }

  context.drawImage(villageImage, 0, 0, width / 2, height);
  context.drawImage(cityImage, width / 2, 0, width / 2, height);
  return canvas;
}

function createRepeatableTexture(
  gl: WebGLRenderingContext,
  image: HTMLImageElement
): WebGLTexture {
  const width = Math.max(image.naturalWidth || image.width, 1);
  const height = Math.max(image.naturalHeight || image.height, 1);
  const repeatableImage =
    isPowerOfTwo(width) && isPowerOfTwo(height)
      ? image
      : createPowerOfTwoTextureCanvas(image, width, height);

  return createTexture(gl, repeatableImage, {
    wrapS: gl.REPEAT,
    wrapT: gl.REPEAT,
  });
}

function createPowerOfTwoTextureCanvas(
  image: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = nextPowerOfTwo(width);
  canvas.height = nextPowerOfTwo(height);

  const context = canvas.getContext("2d");
  if (context == null) {
    throw new Error("Failed to create repeatable texture canvas.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function isPowerOfTwo(value: number): boolean {
  return value > 0 && (value & (value - 1)) === 0;
}

function nextPowerOfTwo(value: number): number {
  return 2 ** Math.ceil(Math.log2(Math.max(value, 1)));
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): void {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1);
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
  height: number,
  worldScale: CampaignTerrainWorldScale = DEFAULT_TERRAIN_WORLD_SCALE
): [number, number, number] {
  return [
    (u - 0.5) * 2 * worldScale.x,
    (0.5 - v) * 2 * worldScale.y,
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
  sampleHeightAtUv: (u: number, v: number) => number,
  worldScale: CampaignTerrainWorldScale
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
        sampleHeightAtUv,
        worldScale
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
          sampleHeightAtUv,
          worldScale
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
  sampleHeightAtUv: (u: number, v: number) => number,
  worldScale: CampaignTerrainWorldScale
): number {
  const height = sampleHeightAtUv(u, v);
  const screenPoint = projectPoint(matrix, createTerrainWorldPoint(u, v, height, worldScale));
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

