import type { CityId } from "./city";

export type MapId = string;

export type MapNode = {
  cityId: CityId;
  x: number;
  y: number;
};

export type MapDefinition = {
  id: MapId;
  name: string;
  backgroundId: string;
  nodes: MapNode[];
};
