import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type {
  ActivePlayableSession,
  PlayableResult,
} from "../../core/contracts/playable-runtime";
import type { RuntimeFollowUp } from "../../core/contracts/runtime-result";
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

export type EventOwnedPlayableContinuationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  cityDefinitions?: CityDefinition[] | undefined;
  houseDefinitions?: HouseDefinition[] | undefined;
};

export type EventOwnedPlayableCompletionResult =
  EventOwnedPlayableContinuationResult & {
    handled: boolean;
  };

export function runEventPlayableRuntime(
  input: EventPlayableRuntimeInput
): EventPlayableRuntimeResult | null {
  const activeEventDefinition = input.eventDefinition;
  const launchPlayableAction = activeEventDefinition?.actions?.find(
    (action): action is Extract<NonNullable<EventDefinition["actions"]>[number], { type: "launchPlayable" }> =>
      action.type === "launchPlayable"
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
      runtime: {
        ...playableResult.state.core.runtime,
        playableSession:
          playableResult.state.core.runtime.playableSession == null
            ? null
            : {
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

export function applyEventOwnedPlayableCompletion(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  previousPlayableSession: ActivePlayableSession | null | undefined;
  settlement?: PlayableResult | null | undefined;
  followUp?: RuntimeFollowUp | null | undefined;
  continueFromSourceEvent?:
    | ((
        input: EventOwnedPlayableContinuationResult & {
          sourceEventId: string;
        }
      ) => EventOwnedPlayableContinuationResult | null)
    | undefined;
  startFromEventId?:
    | ((
        input: EventOwnedPlayableContinuationResult & {
          eventId: string;
        }
      ) => EventOwnedPlayableContinuationResult | null)
    | undefined;
  applyFollowUp?:
    | ((
        input: EventOwnedPlayableContinuationResult & {
          followUp: Exclude<NonNullable<RuntimeFollowUp>, { type: "none" }>;
        }
      ) => {
        state: GameState;
        characterDefinitions?: CharacterDefinition[] | undefined;
      })
    | undefined;
}): EventOwnedPlayableCompletionResult {
  const sourceEventId = readEventOwnedSourceEventId(input.previousPlayableSession);
  const routedEventId = readPlayableFollowUpEventId(input.settlement);
  const followUp =
    input.followUp == null || input.followUp.type === "none"
      ? null
      : input.followUp;
  if (
    sourceEventId == null ||
    (input.settlement == null && followUp == null)
  ) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      handled: false,
    };
  }
  const continuationEventId = routedEventId ?? sourceEventId;

  const continuationInput: EventOwnedPlayableContinuationResult & {
    sourceEventId: string;
  } = {
    sourceEventId: continuationEventId,
    state: input.state,
    characterDefinitions: input.characterDefinitions,
  };
  if (routedEventId != null && input.startFromEventId != null) {
    const started = input.startFromEventId({
      eventId: routedEventId,
      state: input.state,
      characterDefinitions: input.characterDefinitions,
    });
    if (started != null) {
      return {
        ...started,
        handled: true,
      };
    }
  }
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
  return typeof sourceEventId === "string" && sourceEventId.trim().length > 0
    ? sourceEventId.trim()
    : null;
}

function readPlayableFollowUpEventId(
  settlement: PlayableResult | null | undefined
): string | null {
  const followUpEventId = settlement?.followUpEventId;
  return typeof followUpEventId === "string" && followUpEventId.trim().length > 0
    ? followUpEventId.trim()
    : null;
}
