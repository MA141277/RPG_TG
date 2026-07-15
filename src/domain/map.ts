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
  initialPlayerCoordinate?: {
    x: number;
    y: number;
  };
  nodes: MapNode[];
  layers?: MapLayer[];
  stats?: MapStats;
};
