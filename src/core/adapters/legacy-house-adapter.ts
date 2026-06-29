import {
  createHouseRuntime,
  type HouseRuntime,
} from "../../application/house/house-runtime";

export type LegacyHouseRuntimeAdapter = HouseRuntime;
export type LegacyHouseRuntimeDependencies = Parameters<
  typeof createHouseRuntime
>[0];

export function createLegacyHouseRuntimeAdapter(
  dependencies: LegacyHouseRuntimeDependencies
): LegacyHouseRuntimeAdapter {
  return createHouseRuntime(dependencies);
}
