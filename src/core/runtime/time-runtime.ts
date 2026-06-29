import {
  advanceGameStateOneDay,
  advanceGameStateTimeSegments,
} from "../../application/time/time-progression";
import type { GameState } from "../../domain/game-state";
import type { RuntimeRequest } from "../contracts/runtime-request";

type TimeRuntimeResult = {
  state: GameState;
};

export function createDayStartRequest(): RuntimeRequest {
  return {
    type: "tick",
    tickId: "time.day-start",
  };
}

export function createAdvanceTimeSegmentsRequest(segments: number): RuntimeRequest {
  return {
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
