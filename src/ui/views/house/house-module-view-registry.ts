import type { HouseModuleId, HouseModuleViewModel } from "../../../domain/house-module";
import { renderGrainShopHouseView } from "./grain-shop-house-view";
import { renderKeepHouseView } from "./keep-house-view";
import { renderMarketHouseView } from "./market-house-view";
import { renderTavernHouseView } from "./tavern-house-view";
import { renderTeaHouseHouseView } from "./tea-house-house-view";

export type HouseModuleViewRenderer = (
  viewModel: HouseModuleViewModel
) => string;

export const houseModuleViewRegistry: Record<
  HouseModuleId,
  HouseModuleViewRenderer
> = {
  "keep-house": renderKeepHouseView,
  "grain-shop": renderGrainShopHouseView,
  "market-house": renderMarketHouseView,
  tavern: renderTavernHouseView,
  "tea-house": renderTeaHouseHouseView,
};

export function renderHouseModuleView(viewModel: HouseModuleViewModel): string {
  return houseModuleViewRegistry[viewModel.moduleId](viewModel);
}
