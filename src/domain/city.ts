import type { HouseId } from "./house";

export type CityId = string;

export type CityMapPlacement = {
  mapId?: string;
  mapNodeId?: string;
  x: number;
  y: number;
  kind?: "city" | "settlement" | "fort";
  label?: string;
  summary?: string;
};

export type CityDefinition = {
  id: CityId;
  name: string;
  backgroundId?: string;
  regionId: string;
  mapNodeId: string;
  mapPlacement?: CityMapPlacement;
  houseIds: HouseId[];
  neighbourCityIds: CityId[];
  travelCost: number;
  tags: string[];
  prosperity: number;
  danger: number;
  specialDemand: string[];
};
