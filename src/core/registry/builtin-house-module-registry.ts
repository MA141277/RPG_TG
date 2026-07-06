import { builtinHouseModuleContributions } from "./builtin-house-module-contributions";
import {
  createHouseModuleRegistry,
  type HouseModuleRegistry,
} from "./house-module-registry";

export function installBuiltinHouseModuleRegistrations(
  registry: HouseModuleRegistry
): void {
  builtinHouseModuleContributions.forEach((registration) => {
    registry.register(registration);
  });
}

export function createBuiltinHouseModuleRegistry(): HouseModuleRegistry {
  const registry = createHouseModuleRegistry();
  installBuiltinHouseModuleRegistrations(registry);
  return registry;
}

export const builtinHouseModuleRegistry = createBuiltinHouseModuleRegistry();
