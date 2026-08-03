import type { RuntimeFollowUp } from "../../core/contracts/runtime-result";
import type { RuntimeState } from "../../core/contracts/runtime-state";
import {
  createNavigateRequest,
  routeNavigationRuntime,
  runNavigationRuntime,
} from "../../core/runtime/navigation-runtime";
import type { GameState } from "../../domain/game-state";
import type { AppState } from "../app-shell";

type ActiveRuntimeFollowUp = Exclude<NonNullable<RuntimeFollowUp>, { type: "none" }>;

export function applyNavigationRuntimeFollowUp(input: {
  state: AppState;
  followUp: ActiveRuntimeFollowUp;
}): AppState {
  return {
    ...input.state,
    gameState: applyNavigationRuntimeFollowUpToGameState({
      state: input.state.gameState,
      followUp: input.followUp,
    }).state,
  };
}

export function applyNavigationRuntimeFollowUpToGameState(input: {
  state: GameState;
  followUp: ActiveRuntimeFollowUp;
}): { state: GameState } {
  if (input.followUp.type !== "reenter-house") {
    return { state: input.state };
  }

  return {
    state: runNavigationRuntime({
      state: input.state,
      request: createNavigateRequest({
        kind: "reenterBuilding",
        houseId: input.followUp.houseId,
      }),
    }).state,
  };
}

export function applyNavigationRuntimeFollowUpToRuntimeState(input: {
  state: RuntimeState;
  followUp: ActiveRuntimeFollowUp;
}): { state: RuntimeState } {
  if (input.followUp.type !== "reenter-house") {
    return { state: input.state };
  }

  return {
    state: routeNavigationRuntime({
      state: input.state,
      request: createNavigateRequest({
        kind: "reenterBuilding",
        houseId: input.followUp.houseId,
      }),
    }).state,
  };
}
