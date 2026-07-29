import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { ActivePlayableSession } from "../../core/contracts/playable-runtime";
import type { RuntimeInteractiveSignal } from "../../core/contracts/runtime-result";
import {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} from "../../core/runtime/playable-runtime";
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

export type EventOwnedPlayableContinuationResult<State = unknown> = {
  state: State;
  characterDefinitions: CharacterDefinition[];
};

export type EventOwnedPlayableCompletionResult<State = unknown> =
  EventOwnedPlayableContinuationResult<State> & {
    handled: boolean;
  };

export type EventOwnedPlayableCompletionInput<State = unknown> = {
  state: State;
  characterDefinitions: CharacterDefinition[];
  previousPlayableSession: ActivePlayableSession | null | undefined;
  settlement?: unknown;
  followUp?: RuntimeInteractiveSignal | null | undefined;
  continueFromSourceEvent?:
    | ((
        input: EventOwnedPlayableContinuationResult<State> & {
          sourceEventId: string;
        }
      ) => EventOwnedPlayableContinuationResult<State> | null)
    | undefined;
  applyFollowUp?:
    | ((
        input: EventOwnedPlayableContinuationResult<State> & {
          sourceEventId: string;
          followUp: Exclude<RuntimeInteractiveSignal, { type: "none" }>;
        }
      ) => {
        state: State;
        characterDefinitions?: CharacterDefinition[] | undefined;
      })
    | undefined;
};

export function runEventPlayableRuntime(
  input: EventPlayableRuntimeInput
): EventPlayableRuntimeResult | null {
  const activeEventDefinition = input.eventDefinition;
  const launchPlayableAction = activeEventDefinition?.actions?.find(
    (
      action
    ): action is Extract<
      NonNullable<EventDefinition["actions"]>[number],
      { type: "launchPlayable" }
    > => action.type === "launchPlayable"
  );
  if (launchPlayableAction == null || activeEventDefinition == null) {
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
      ownerContext: {
        ...launchPlayableAction.ownerContext,
        sessionToken: activeEventDefinition.id,
      },
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
  if (
    !playableResult.handled ||
    playableResult.state.core.runtime.playableSession == null
  ) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      handled: false,
    };
  }

  return {
    state: {
      ...playableResult.state.core,
      scene: {
        ...playableResult.state.core.scene,
        activeEventId: null,
        activeSceneId: null,
        cursor: 0,
        status: "idle",
      },
      ui: {
        ...playableResult.state.core.ui,
        currentView: "minigame",
      },
      runtime: {
        ...playableResult.state.core.runtime,
        playableSession: {
          ...playableResult.state.core.runtime.playableSession,
          ownerContext: {
            ...playableResult.state.core.runtime.playableSession.ownerContext,
            sessionToken: activeEventDefinition.id,
          },
        },
      },
    },
    characterDefinitions:
      playableResult.characterDefinitions ?? input.characterDefinitions,
    handled: true,
  };
}

export function applyEventOwnedPlayableCompletion<State = unknown>(
  input: EventOwnedPlayableCompletionInput<State>
): EventOwnedPlayableCompletionResult<State> {
  const sourceEventId = readEventOwnedSourceEventId(
    input.previousPlayableSession
  );
  const followUp =
    input.followUp == null || input.followUp.type === "none"
      ? null
      : input.followUp;

  if (sourceEventId == null || (input.settlement == null && followUp == null)) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      handled: false,
    };
  }

  const continuationInput = {
    sourceEventId,
    state: input.state,
    characterDefinitions: input.characterDefinitions,
  };
  const continued = input.continueFromSourceEvent?.(continuationInput) ?? null;
  if (continued != null) {
    return {
      ...continued,
      handled: true,
    };
  }

  if (followUp != null && input.applyFollowUp != null) {
    const appliedFollowUp = input.applyFollowUp({
      ...continuationInput,
      followUp,
    });
    return {
      state: appliedFollowUp.state,
      characterDefinitions:
        appliedFollowUp.characterDefinitions ?? input.characterDefinitions,
      handled: true,
    };
  }

  return {
    state: input.state,
    characterDefinitions: input.characterDefinitions,
    handled: false,
  };
}

function readEventOwnedSourceEventId(
  session: ActivePlayableSession | null | undefined
): string | null {
  const sourceEventId = session?.ownerContext.sessionToken;
  if (typeof sourceEventId !== "string") {
    return null;
  }

  const trimmedSourceEventId = sourceEventId.trim();
  return trimmedSourceEventId.length === 0 ? null : trimmedSourceEventId;
}
