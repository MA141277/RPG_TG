import type { HouseModuleDefinition, HouseModuleId } from "../../domain/house-module";
import { grainShopHouseModule } from "./grain-shop/grain-shop-house-module";
import { keepHouseHouseModule } from "./keep-house/keep-house-house-module";
import { marketHouseHouseModule } from "./market-house/market-house-house-module";
import { tavernHouseModule } from "./tavern/tavern-house-module";
import { teaHouseHouseModule } from "./tea-house/tea-house-house-module";

export const houseModuleRegistry: Record<HouseModuleId, HouseModuleDefinition> = {
  "keep-house": keepHouseHouseModule,
  "grain-shop": grainShopHouseModule,
  "market-house": marketHouseHouseModule,
  tavern: tavernHouseModule,
  "tea-house": teaHouseHouseModule,
};

export function getHouseModule(moduleId: HouseModuleId): HouseModuleDefinition {
  return houseModuleRegistry[moduleId];
}
