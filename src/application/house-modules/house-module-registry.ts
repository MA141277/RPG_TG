import type { HouseModuleDefinition, HouseModuleId } from "../../domain/house-module";
import { grainShopHouseModule } from "./grain-shop/grain-shop-house-module";
import { teaHouseHouseModule } from "./tea-house/tea-house-house-module";

export const houseModuleRegistry: Record<HouseModuleId, HouseModuleDefinition> = {
  "grain-shop": grainShopHouseModule,
  "tea-house": teaHouseHouseModule,
};

export function getHouseModule(moduleId: HouseModuleId): HouseModuleDefinition {
  return houseModuleRegistry[moduleId];
}
