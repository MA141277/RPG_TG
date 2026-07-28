import type { CharacterDefinition } from "../../domain/character";
import type { ActivePlayableSession } from "../../core/contracts/playable-runtime";
import type { RuntimeInteractiveSignal } from "../../core/contracts/runtime-result";

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
