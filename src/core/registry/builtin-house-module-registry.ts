import { builtinHouseModuleRegistrations } from "../../application/house-modules/builtin-house-module-registrations";
import { builtinHouseRendererRegistrations } from "../../ui/views/house/builtin-house-module-renderers";
import {
  createHouseModuleRegistry,
  type HouseModuleRegistry,
} from "./house-module-registry";

export function installBuiltinHouseModuleRegistrations(
  registry: HouseModuleRegistry
): void {
  [...builtinHouseModuleRegistrations, ...builtinHouseRendererRegistrations].forEach(
    (registration) => {
      registry.register(registration);
    }
  );
}

export function createBuiltinHouseModuleRegistry(): HouseModuleRegistry {
  const registry = createHouseModuleRegistry();
  installBuiltinHouseModuleRegistrations(registry);
  return registry;
}

export const builtinHouseModuleRegistry = createBuiltinHouseModuleRegistry();
