import type { CampaignHexGridCell, MapId } from "../domain/map";

export const YUANMO_PLAIN_TERRAIN = "平原";
export const YUANMO_MOUNTAIN_TERRAIN = "山脉";
export const YUANMO_GRASS_ENVIRONMENT = "草地";
export const YUANMO_FOREST_ENVIRONMENT = "森林";

export type YuanmoHexTerrain =
  | typeof YUANMO_PLAIN_TERRAIN
  | typeof YUANMO_MOUNTAIN_TERRAIN;

export type YuanmoHexEnvironment =
  | typeof YUANMO_GRASS_ENVIRONMENT
  | typeof YUANMO_FOREST_ENVIRONMENT;

export type SettlementType = "city" | "village" | "custom";
export type StructureGround = "city-ground" | "village-ground" | null;
export type StructureOverlayCategory = "city-ground" | "village-ground" | "farmland";
export type CustomSettlementVisualKind = Exclude<StructureGround, null>;

export type YuanmoSourceCropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type YuanmoHexSamplingConfig = {
  scale: number;
  step: number;
  offsetX: number;
  offsetY: number;
  sourceCrop: YuanmoSourceCropRect;
};

export type YuanmoHexEditorProject = {
  mapId: MapId;
  sampling: YuanmoHexSamplingConfig;
};

export type GeneratedHexCell = Omit<CampaignHexGridCell, "terrain" | "environment"> & {
  terrain: YuanmoHexTerrain;
  environment: YuanmoHexEnvironment;
  sourcePosition?: {
    x: number;
    y: number;
  };
};

export type GeneratedHexGrid = {
  mapId: MapId;
  generation: YuanmoHexSamplingConfig;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  counts: {
    cells: number;
    landCells: number;
    waterCells: number;
    terrains: Record<YuanmoHexTerrain, number>;
    environments: Record<YuanmoHexEnvironment, number>;
  };
  cells: GeneratedHexCell[];
};

export type YuanmoHexRasterLayerData = {
  width: number;
  height: number;
  data: Uint8ClampedArray | number[];
};

export type YuanmoHexRasterSource = {
  groundTypes: YuanmoHexRasterLayerData;
  heights?: YuanmoHexRasterLayerData | null;
};

export type WaterLandOverride = {
  x: number;
  y: number;
  land: boolean;
};

export type TerrainOverride = {
  x: number;
  y: number;
  terrain: YuanmoHexTerrain;
};

export type EnvironmentOverride = {
  x: number;
  y: number;
  environment: YuanmoHexEnvironment;
};

export type SettlementRecord = {
  id: string;
  name: string;
  type: SettlementType;
  customVisualKind?: CustomSettlementVisualKind;
  mapPosition: {
    x: number;
    y: number;
  };
  hexCell: {
    x: number;
    y: number;
  };
};

export type StructureOverlayRecord = {
  id: string;
  category: StructureOverlayCategory;
  cells: Array<{ x: number; y: number }>;
  settlementId?: string;
};

export type RegionColor = {
  red: number;
  green: number;
  blue: number;
};

export type RegionRecord = {
  id: string;
  name: string;
  color: RegionColor;
  cells: Array<{ x: number; y: number }>;
  capitalSettlementId?: string;
};

export type ResolvedHexVisualState = {
  land: boolean;
  terrain: YuanmoHexTerrain;
  environment: YuanmoHexEnvironment;
  structureGround: StructureGround;
  settlementId: string | null;
  settlementType: SettlementType | null;
};

export type ResolvedHexPassability = {
  isPassable: boolean;
  blockingReason: "water" | null;
};

export type ResolvedHexCell = Omit<GeneratedHexCell, "structureGround"> & {
  key: string;
  structureGround: StructureGround;
  overlays: StructureOverlayCategory[];
  settlementId: string | null;
  settlementType: SettlementType | null;
};

export type ResolveHexSemanticInput = {
  generated: GeneratedHexGrid;
  waterLandOverrides: WaterLandOverride[];
  terrainOverrides: TerrainOverride[];
  environmentOverrides: EnvironmentOverride[];
  structureOverlays: StructureOverlayRecord[];
  settlements: SettlementRecord[];
};

export type ResolvedHexSemanticState = {
  cells: ResolvedHexCell[];
  cellsByKey: Map<string, ResolvedHexCell>;
  landByCellKey: Map<string, boolean>;
  terrainByCellKey: Map<string, YuanmoHexTerrain>;
  environmentByCellKey: Map<string, YuanmoHexEnvironment>;
  structureGroundByCellKey: Map<string, StructureGround>;
  passabilityByCellKey: Map<string, ResolvedHexPassability>;
  visualStateByCellKey: Map<string, ResolvedHexVisualState>;
};
