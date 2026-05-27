import type { HouseModuleId, HouseModuleViewModel } from "../../../domain/house-module";
import { renderHomeHouseView } from "./home-house-view";
import { renderGrainShopHouseView } from "./grain-shop-house-view";
import { renderKeepHouseView } from "./keep-house-view";
import { renderLeaderResidenceHouseView } from "./leader-residence-house-view";
import { renderMarketHouseView } from "./market-house-view";
import { renderTavernHouseView } from "./tavern-house-view";
import { renderMedicineHouseHouseView } from "./medicine-house-house-view";
import { renderTeaHouseHouseView } from "./tea-house-house-view";

export type HouseModuleViewRenderer = (
  viewModel: HouseModuleViewModel
) => string;

export const houseModuleViewRegistry: Record<
  HouseModuleId,
  HouseModuleViewRenderer
> = {
  "home-house": renderHomeHouseView,
  "keep-house": renderKeepHouseView,
  "leader-residence": renderLeaderResidenceHouseView,
  "grain-shop": renderGrainShopHouseView,
  "market-house": renderMarketHouseView,
  "medicine-house": renderMedicineHouseHouseView,
  tavern: renderTavernHouseView,
  "tea-house": renderTeaHouseHouseView,
};

export function renderHouseModuleView(viewModel: HouseModuleViewModel): string {
  return houseModuleViewRegistry[viewModel.moduleId](viewModel);
}
