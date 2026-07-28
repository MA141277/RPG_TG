import type { HouseId } from "./house";

export type CityId = string;

export type CityDefinition = {
  id: CityId;
  name: string;
  regionId: string;
  mapNodeId: string;
  mapPlacement?: {
    placementMode?: "coordinate" | "grid-index";
    mapId?: string;
    mapNodeId?: string;
    gridIndex?: number;
    x: number;
    y: number;
    kind?: "city" | "settlement" | "fort";
    label?: string;
    summary?: string;
  };
  houseIds: HouseId[];
  neighbourCityIds: CityId[];
  travelCost: number;
  tags: string[];
  prosperity: number;
  danger: number;
  specialDemand: string[];
};
