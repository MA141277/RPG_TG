import type { HouseId } from "./house";

export type CityId = string;

export type CityDefinition = {
  id: CityId;
  name: string;
  regionId: string;
  mapNodeId: string;
  houseIds: HouseId[];
  neighbourCityIds: CityId[];
  travelCost: number;
  tags?: Array<"castle-town" | "port" | "market" | "capital" | "custom">;
};
