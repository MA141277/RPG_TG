import type { HouseModuleId, HouseModuleViewModel } from "../../../domain/house-module";
import { renderGrainShopHouseView } from "./grain-shop-house-view";

export type HouseModuleViewRenderer = (
  viewModel: HouseModuleViewModel
) => string;

export const houseModuleViewRegistry: Record<
  HouseModuleId,
  HouseModuleViewRenderer
> = {
  "grain-shop": renderGrainShopHouseView,
};

export function renderHouseModuleView(viewModel: HouseModuleViewModel): string {
  return houseModuleViewRegistry[viewModel.moduleId](viewModel);
}
