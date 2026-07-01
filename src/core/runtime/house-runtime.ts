import type {
  HouseRuntimeRequest,
  HouseRuntimeSessionRequest,
} from "../contracts/house-runtime";
import {
  createLegacyHouseRuntimeAdapter,
  type LegacyHouseRuntimeAdapter,
  type LegacyHouseRuntimeDependencies,
} from "../adapters/legacy-house-adapter";

export type HouseRuntimeBridge = {
  dispatch(request: HouseRuntimeRequest): void;
  applyMapAutoAdvanceCompletion: LegacyHouseRuntimeAdapter["applyMapAutoAdvanceCompletion"];
  clearAllHouseIntervals: LegacyHouseRuntimeAdapter["clearAllHouseIntervals"];
};

export function createHouseRuntimeBridge(
  dependencies: LegacyHouseRuntimeDependencies
): HouseRuntimeBridge {
  const runtime = createLegacyHouseRuntimeAdapter(dependencies);

  return {
    dispatch(request: HouseRuntimeRequest): void {
      dispatchLegacyHouseRuntimeRequest(runtime, request);
    },
    applyMapAutoAdvanceCompletion(completion): void {
      runtime.applyMapAutoAdvanceCompletion(completion);
    },
    clearAllHouseIntervals(): void {
      runtime.clearAllHouseIntervals();
    },
  };
}

export function enterHouseThroughRuntime(
  runtime: HouseRuntimeBridge,
  houseId: string
): void {
  runtime.dispatch({
    type: "enter",
    houseId,
  });
}

export function leaveHouseThroughRuntime(runtime: HouseRuntimeBridge): void {
  runtime.dispatch({
    type: "leave",
  });
}

export function dispatchHouseRuntimeRequest(
  runtime: HouseRuntimeBridge,
  request: HouseRuntimeSessionRequest
): void {
  runtime.dispatch({
    type: "dispatch",
    request,
  });
}

function dispatchLegacyHouseRuntimeRequest(
  runtime: LegacyHouseRuntimeAdapter,
  request: HouseRuntimeRequest
): void {
  if (request.type === "enter") {
    runtime.enterHouseById(request.houseId);
    return;
  }

  if (request.type === "leave") {
    runtime.leaveCurrentHouse();
    return;
  }

  runtime.dispatchCurrentHouseRequest(request.request);
}
