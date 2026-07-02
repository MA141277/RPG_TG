import {
  advanceGameStateOneDay,
  advanceGameStateTimeSegments,
} from "../../application/time/time-progression";
import type { GameState } from "../../domain/game-state";
import type { RuntimeRequest } from "../contracts/runtime-request";
import type { RuntimeResult } from "../contracts/runtime-result";
import type { RuntimeState } from "../contracts/runtime-state";

type TimeRuntimeResult = {
  state: GameState;
};

export function createDayStartRequest(): RuntimeRequest {
  return {
    family: "tick",
    type: "tick",
    tickId: "time.day-start",
  };
}

export function createAdvanceTimeSegmentsRequest(segments: number): RuntimeRequest {
  return {
    family: "tick",
    type: "tick",
    tickId: "time.advance-segments",
    payload: { segments },
  };
}

export function runTimeRuntime(input: {
  state: GameState;
  request: RuntimeRequest;
}): TimeRuntimeResult {
  if (input.request.type !== "tick") {
    return { state: input.state };
  }

  if (input.request.tickId === "time.day-start") {
    return {
      state: advanceGameStateOneDay(input.state),
    };
  }

  if (input.request.tickId === "time.advance-segments") {
    const segments = input.request.payload?.segments;
    return {
      state: advanceGameStateTimeSegments(
        input.state,
        typeof segments === "number" ? segments : 1
      ),
    };
  }

  return { state: input.state };
}

export function routeTimeRuntime(input: {
  state: RuntimeState;
  request: RuntimeRequest;
}): RuntimeResult {
  const result = runTimeRuntime({
    state: input.state.core,
    request: input.request,
  });

  return {
    state: {
      ...input.state,
      core: result.state,
    },
    effects: [],
  };
}
