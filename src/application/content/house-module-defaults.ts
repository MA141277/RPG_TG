import {
  HOUSE_MODULE_IDS,
  type HouseModuleId,
} from "../../domain/house-module";

export type HouseModuleDefaults = Partial<
  Record<HouseModuleId, Record<string, unknown>>
>;

const HOUSE_MODULE_ID_SET = new Set<string>(HOUSE_MODULE_IDS);

export function assertHouseModuleDefaults(
  value: unknown,
  label: string
): asserts value is HouseModuleDefaults {
  assertRecord(value, label);

  for (const [moduleId, moduleDefaults] of Object.entries(value)) {
    if (!HOUSE_MODULE_ID_SET.has(moduleId)) {
      throw new Error(
        `${label} contains unsupported house module id "${moduleId}".`
      );
    }

    assertRecord(
      moduleDefaults,
      `${label} entry "${moduleId}"`
    );
  }
}

export function mergeHouseModuleDefaults(
  base: HouseModuleDefaults | undefined,
  override: HouseModuleDefaults | undefined
): HouseModuleDefaults {
  const mergedDefaults: HouseModuleDefaults = {};

  for (const moduleId of HOUSE_MODULE_IDS) {
    const baseEntry = base?.[moduleId];
    const overrideEntry = override?.[moduleId];
    if (baseEntry == null && overrideEntry == null) {
      continue;
    }

    mergedDefaults[moduleId] = {
      ...(baseEntry ?? {}),
      ...(overrideEntry ?? {}),
    };
  }

  return mergedDefaults;
}

export function getHouseModuleDefaults<Defaults extends Record<string, unknown>>(
  defaultsByModuleId: HouseModuleDefaults | undefined,
  moduleId: HouseModuleId
): Defaults | undefined {
  const moduleDefaults = defaultsByModuleId?.[moduleId];
  return moduleDefaults as Defaults | undefined;
}

function assertRecord(
  value: unknown,
  label: string
): asserts value is Record<string, unknown> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}
