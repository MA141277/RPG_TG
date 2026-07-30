import type { AppState } from "../app-shell";
import type { CityMenuEntryAction } from "./city-menu";
import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import { createLaunchPlayableRequest, runPlayableRuntime } from "../../core/runtime/playable-runtime";
import { commitRuntimeRequest } from "../../core/runtime/state-sync-runtime";

export function launchCityMenuPlayable(input: {
  state: AppState;
  action: Extract<CityMenuEntryAction, { type: "minigame" }>;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId?: string | undefined;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
}): {
  state: AppState;
  handled: boolean;
} {
  const result = commitRuntimeRequest({
    state: input.state,
    request: createLaunchPlayableRequest(input.action.minigameId, {
      ...(input.action.integrationId == null
        ? {}
        : { integrationId: input.action.integrationId }),
    }),
    context: {
      router: {
        route: ({ state, request }) =>
          runPlayableRuntime({
            state,
            request,
            characterDefinitions: input.characterDefinitions,
            ...(input.playerCharacterId == null
              ? {}
              : { playerCharacterId: input.playerCharacterId }),
            ...(input.activityDefinitionsById == null
              ? {}
              : { activityDefinitionsById: input.activityDefinitionsById }),
          }),
      },
    },
  });
  const didStartPlayable =
    result.runtimeResult.state.core.runtime.playableSession != null;
  const nextState =
    didStartPlayable
      ? {
          ...result.state,
          gameState: {
            ...result.state.gameState,
            ui: {
              ...result.state.gameState.ui,
              currentView: "minigame" as const,
            },
          },
        }
      : result.state;

  return {
    state: nextState,
    handled: result.runtimeResult.settlement != null ||
      didStartPlayable,
  };
}
