export type HouseModuleDefaults = Record<string, Record<string, unknown>>;

export function assertHouseModuleDefaults(
  value: unknown,
  label: string
): asserts value is HouseModuleDefaults {
  assertRecord(value, label);

  for (const [moduleId, moduleDefaults] of Object.entries(value)) {
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

  const moduleIds = new Set([
    ...Object.keys(base ?? {}),
    ...Object.keys(override ?? {}),
  ]);

  for (const moduleId of moduleIds) {
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
  moduleId: string
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
