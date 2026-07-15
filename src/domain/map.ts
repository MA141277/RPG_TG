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
  };
  cells: CampaignHexGridCell[];
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
  initialPlayerCoordinate?: {
    x: number;
    y: number;
  };
  nodes: MapNode[];
  layers?: MapLayer[];
  stats?: MapStats;
};
