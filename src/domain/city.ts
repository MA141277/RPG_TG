import type { HouseId } from "./house";

export type CityId = string;

export type CityDefinition = {
  id: CityId;
  name: string;
  backgroundId?: string;
  regionId: string;
  mapNodeId: string;
  houseIds: HouseId[];
  neighbourCityIds: CityId[];
  travelCost: number;
  tags: string[];
  prosperity: number;
  danger: number;
  specialDemand: string[];
};
