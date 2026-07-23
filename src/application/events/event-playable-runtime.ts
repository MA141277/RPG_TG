import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { createLaunchPlayableRequest, runPlayableRuntime } from "../../core/runtime/playable-runtime";
import { stateSyncCoreSeam } from "../../core/runtime/state-sync-core-seam";

export type EventPlayableRuntimeInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  eventDefinition: EventDefinition | null | undefined;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
};

export type EventPlayableRuntimeResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  handled: boolean;
};

export function runEventPlayableRuntime(
  input: EventPlayableRuntimeInput
): EventPlayableRuntimeResult | null {
  const launchPlayableAction = input.eventDefinition?.actions?.find(
    (action): action is Extract<NonNullable<EventDefinition["actions"]>[number], { type: "launchPlayable" }> =>
      action.type === "launchPlayable"
  );
  if (launchPlayableAction == null) {
    return null;
  }

  const playableResult = runPlayableRuntime({
    state: stateSyncCoreSeam.createRuntimeStateFromAppState({
      gameState: input.state,
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    }),
    request: createLaunchPlayableRequest(launchPlayableAction.playableId, {
      integrationId: launchPlayableAction.integrationId,
      ownerContext: launchPlayableAction.ownerContext,
      ...(launchPlayableAction.payload == null
        ? {}
        : { payload: launchPlayableAction.payload }),
    }),
    characterDefinitions: input.characterDefinitions,
    ...(input.activityDefinitionsById == null
      ? {}
      : { activityDefinitionsById: input.activityDefinitionsById }),
    ...(input.textEntriesById == null
      ? {}
      : { textEntriesById: input.textEntriesById }),
  });
  if (!playableResult.handled || playableResult.state.core.runtime.playableSession == null) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      handled: false,
    };
  }

  return {
    state: {
      ...playableResult.state.core,
      dialogue: {
        ...playableResult.state.core.dialogue,
        activeEventId: null,
        activeDialogueId: null,
        cursor: 0,
        status: "idle",
      },
      ui: {
        ...playableResult.state.core.ui,
        currentView: "minigame",
      },
    },
    characterDefinitions:
      playableResult.characterDefinitions ?? input.characterDefinitions,
    handled: true,
  };
}
