import type { HouseModuleDefinition, HouseModuleId } from "../../domain/house-module";
import { grainShopHouseModule } from "./grain-shop/grain-shop-house-module";

export const houseModuleRegistry: Record<HouseModuleId, HouseModuleDefinition> = {
  "grain-shop": grainShopHouseModule,
};

export function getHouseModule(moduleId: HouseModuleId): HouseModuleDefinition {
  return houseModuleRegistry[moduleId];
}
