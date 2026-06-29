import type { HouseModuleRequest } from "../../domain/house-module";
import {
  createLegacyHouseRuntimeAdapter,
  type LegacyHouseRuntimeAdapter,
  type LegacyHouseRuntimeDependencies,
} from "../adapters/legacy-house-adapter";

export type HouseRuntimeBridge = LegacyHouseRuntimeAdapter;

export function createHouseRuntimeBridge(
  dependencies: LegacyHouseRuntimeDependencies
): HouseRuntimeBridge {
  return createLegacyHouseRuntimeAdapter(dependencies);
}

export function enterHouseThroughRuntime(
  runtime: HouseRuntimeBridge,
  houseId: string
): void {
  runtime.enterHouseById(houseId);
}

export function leaveHouseThroughRuntime(runtime: HouseRuntimeBridge): void {
  runtime.leaveCurrentHouse();
}

export function dispatchHouseRuntimeRequest(
  runtime: HouseRuntimeBridge,
  request: HouseModuleRequest
): void {
  runtime.dispatchCurrentHouseRequest(request);
}
