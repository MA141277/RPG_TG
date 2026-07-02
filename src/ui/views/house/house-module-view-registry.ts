import type {
  HouseModuleId,
  HouseModuleViewModel,
  HouseModuleViewRenderer,
} from "../../../domain/house-module";
import {
  builtinHouseModuleRegistry,
  type HouseModuleRegistry,
} from "../../../core/registry/house-module-registry";

export function getHouseModuleRenderer(
  moduleId: HouseModuleId,
  registry: HouseModuleRegistry = builtinHouseModuleRegistry
): HouseModuleViewRenderer {
  const render = registry.getRenderer(moduleId);
  if (render == null) {
    throw new Error(`House renderer "${moduleId}" is not registered.`);
  }

  return render;
}

export function renderHouseModuleView(
  viewModel: HouseModuleViewModel,
  registry: HouseModuleRegistry = builtinHouseModuleRegistry
): string {
  return getHouseModuleRenderer(viewModel.moduleId, registry)(viewModel);
}
