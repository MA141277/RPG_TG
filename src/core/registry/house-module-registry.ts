import type {
  HouseModuleDefinition,
  HouseModuleId,
  HouseModuleViewRenderer,
} from "../../domain/house-module";
import { builtinHouseModuleRegistrations } from "../../application/house-modules/builtin-house-module-registrations";
import { builtinHouseRendererRegistrations } from "../../ui/views/house/builtin-house-module-renderers";

export type HouseModuleRegistration = {
  moduleId: HouseModuleId;
  module?: HouseModuleDefinition | undefined;
  render?: HouseModuleViewRenderer | undefined;
};

export type HouseModuleRegistry = {
  register(registration: HouseModuleRegistration): void;
  getModule(moduleId: HouseModuleId): HouseModuleDefinition | null;
  getRenderer(moduleId: HouseModuleId): HouseModuleViewRenderer | null;
  entries(): HouseModuleRegistration[];
};

export function createHouseModuleRegistry(
  registrations: HouseModuleRegistration[] = []
): HouseModuleRegistry {
  const registrationsById = new Map<HouseModuleId, HouseModuleRegistration>();

  const register = (registration: HouseModuleRegistration): void => {
    const existingRegistration = registrationsById.get(registration.moduleId);

    registrationsById.set(registration.moduleId, {
      moduleId: registration.moduleId,
      ...(existingRegistration?.module == null
        ? {}
        : { module: existingRegistration.module }),
      ...(existingRegistration?.render == null
        ? {}
        : { render: existingRegistration.render }),
      ...(registration.module == null ? {} : { module: registration.module }),
      ...(registration.render == null ? {} : { render: registration.render }),
    });
  };

  registrations.forEach(register);

  return {
    register,
    getModule(moduleId) {
      return registrationsById.get(moduleId)?.module ?? null;
    },
    getRenderer(moduleId) {
      return registrationsById.get(moduleId)?.render ?? null;
    },
    entries() {
      return Array.from(registrationsById.values());
    },
  };
}

export function createBuiltinHouseModuleRegistry(): HouseModuleRegistry {
  return createHouseModuleRegistry([
    ...builtinHouseModuleRegistrations,
    ...builtinHouseRendererRegistrations,
  ]);
}

export const builtinHouseModuleRegistry = createBuiltinHouseModuleRegistry();
