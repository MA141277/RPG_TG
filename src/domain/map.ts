import type { CityId } from "./city";

export type MapId = string;

export type MapNode = {
  cityId?: CityId;
  id?: string;
  label?: string;
  x: number;
  y: number;
  kind?: "city" | "settlement" | "fort" | "landmark";
  summary?: string;
  visualKind?: "structure";
  structureVisual?: {
    kind: "settlement-building";
  };
};

export type MapLayer = {
  id: string;
  label: string;
  width: number;
  height: number;
  description: string;
  imageUrl: string;
};

export type MapStats = {
  regionCount: number;
  settlementCount: number;
  fortCount: number;
  resourceCount: number;
  resourceSummary: string;
};

export type MapExplorationState = {
  revealedHexKeys: string[];
  revealingHexStartedAtMsByKey: Record<string, number>;
};

export type CampaignHexTerrain = string;

export type CampaignHexEnvironment = string;

export type CampaignHexGridCell = {
  x: number;
  y: number;
  land: boolean;
  referenceHeight: number;
  terrain: CampaignHexTerrain;
  environment: CampaignHexEnvironment;
};

export type CampaignHexGridDefinition = {
  schemaVersion: 1;
  format: "campaign-hex-grid-v1";
  mapId: MapId;
  defaults: {
    terrain: CampaignHexTerrain;
    environment: CampaignHexEnvironment;
  };
  coordinateSystem: {
    hexTerrainScale: number;
    hexMapAspect: number;
    coordinateSpace: {
      width: number;
      height: number;
    };
  };
  source: {
    kind: "sampled-raster-layer";
    sourceLayerId: string;
    sourceImage: {
      path: string;
      width: number;
      height: number;
    };
    sampler: {
      method: "hex-center-nearest-pixel";
      hexCellSource: string;
      terrainUvFormula: string;
      pixelFormula: string;
      waterMaterialRule: string;
      landRule: string;
      mapOutsideRule?: string;
    };
    terrainSampler?: {
      method: "hex-multi-point-color-palette";
      sourceLayerId: string;
      sampleOffsets: Array<{ x: number; y: number }>;
      matchRule: string;
      fallbackTerrain: CampaignHexTerrain;
      matches: Array<{
        terrain: CampaignHexTerrain;
        colors: string[];
        minHits: number;
      }>;
    };
    heightSampler?: {
      method: "hex-multi-point-height-average";
      sourceLayerId: string;
      sourceImage: {
        path: string;
        width: number;
        height: number;
      };
      sampleOffsets: Array<{ x: number; y: number }>;
      colorFormula: "luminance";
      fallbackHeight: number;
    };
    environmentSampler?: {
      method: "hex-multi-point-color-palette";
      sourceLayerId: string;
      sourceImage: {
        path: string;
        width: number;
        height: number;
      };
      sampleOffsets: Array<{ x: number; y: number }>;
      matchRule: string;
      fallbackEnvironment: CampaignHexEnvironment;
      matches: Array<{
        environment: CampaignHexEnvironment;
        colors: string[];
        minHits: number;
      }>;
    };
  };
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
    terrains?: Record<CampaignHexTerrain, number>;
    environments?: Record<CampaignHexEnvironment, number>;
  };
  cells: CampaignHexGridCell[];
};

export type CampaignVegetationMeshDefinition = {
  schemaVersion: 1;
  format: "campaign-vegetation-mesh-v1";
  id: string;
  label: string;
  source: {
    kind: "obj-mtl";
    objPath: string;
    mtlPath: string;
    materialNames: string[];
  };
  origin: [number, number, number];
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
  positions: number[];
  normals: number[];
  colors: number[];
  indices: number[];
};

export type CampaignVegetationRulesDefinition = {
  schemaVersion: 1;
  format: "campaign-vegetation-rules-v1";
  id: string;
  environment: CampaignHexEnvironment;
  profile: string;
  seed: string;
  variants: Array<{
    id: string;
    meshUrl: string;
    weight: number;
    placement?: Partial<{
      scaleMin: number;
      scaleMax: number;
      baseWorldScale: number;
      lift: number;
    }>;
    shadow?: {
      enabled?: boolean;
    };
  }>;
  density: {
    far: { min: number; max: number };
    medium: { min: number; max: number };
    near: { min: number; max: number };
  };
  lod: {
    mediumMinScale: number;
    nearMinScale: number;
    maxVisibleInstances: number;
  };
  altitude?: {
    maxTerrainHeight: number;
  };
  placement: {
    innerRadius: number;
    outerRadius: number;
    scaleMin: number;
    scaleMax: number;
    baseWorldScale: number;
    lift: number;
  };
  avoidance: {
    markerRadius: number;
    playerRadius: number;
    pathRadius: number;
    densityMultiplierNearAvoidance: number;
  };
  shader: {
    ambient: number;
    directional: number;
  };
  shadow: {
    opacity: number;
    radiusScaleX: number;
    radiusScaleY: number;
    lightOffsetScale: number;
    lift: number;
  };
};

export type MapDefinition = {
  id: MapId;
  name: string;
  backgroundId: string;
  mode?: "grid" | "campaign";
  size?: number;
  coordinateSpace?: {
    width: number;
    height: number;
  };
  displaySize?: {
    width: number;
    height: number;
  };
  primaryImageUrl?: string;
  regionOverlayImageUrl?: string;
  campaignHexGridUrl?: string;
  campaignVegetationRulesUrl?: string;
  campaignStructureProfileId?: string;
  initialPlayerCoordinate?: {
    x: number;
    y: number;
  };
  nodes: MapNode[];
  layers?: MapLayer[];
  stats?: MapStats;
};
