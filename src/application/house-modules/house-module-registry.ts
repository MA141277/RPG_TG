import type { HouseModuleDefinition, HouseModuleId } from "../../domain/house-module";
import {
  builtinHouseModuleRegistry,
  createBuiltinHouseModuleRegistry,
} from "../../core/registry/builtin-house-module-registry";

export { builtinHouseModuleRegistry, createBuiltinHouseModuleRegistry };

export function getHouseModule(moduleId: HouseModuleId): HouseModuleDefinition {
  const houseModule = builtinHouseModuleRegistry.getModule(moduleId);
  if (houseModule == null) {
    throw new Error(`House module "${moduleId}" is not registered.`);
  }

  return houseModule;
}
