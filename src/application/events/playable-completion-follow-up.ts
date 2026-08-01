import type { CharacterDefinition } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type {
  ActivePlayableSession,
  PlayableResult,
} from "../../core/contracts/playable-runtime";
import type { RuntimeFollowUp } from "../../core/contracts/runtime-result";

export type PlayableCompletionContinuationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  cityDefinitions?: CityDefinition[] | undefined;
  houseDefinitions?: HouseDefinition[] | undefined;
};

export type PlayableCompletionFollowUpResult =
  PlayableCompletionContinuationResult & {
    handled: boolean;
  };

export function applyPlayableCompletionFollowUp(input: {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  previousPlayableSession: ActivePlayableSession | null | undefined;
  settlement?: PlayableResult | null | undefined;
  followUp?: RuntimeFollowUp | null | undefined;
  startFromEventId?:
    | ((
        input: PlayableCompletionContinuationResult & {
          eventId: string;
        }
      ) => PlayableCompletionContinuationResult | null)
    | undefined;
  applyFollowUp?:
    | ((
        input: PlayableCompletionContinuationResult & {
          followUp: Exclude<NonNullable<RuntimeFollowUp>, { type: "none" }>;
        }
      ) => {
        state: GameState;
        characterDefinitions?: CharacterDefinition[] | undefined;
      })
    | undefined;
}): PlayableCompletionFollowUpResult {
  if (isEventOwnedPlayableSession(input.previousPlayableSession)) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      handled: false,
    };
  }

  const routedEventId = readPlayableFollowUpEventId(input.settlement);
  const followUp =
    input.followUp == null || input.followUp.type === "none"
      ? null
      : input.followUp;

  if (routedEventId == null && followUp == null) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      handled: false,
    };
  }

  const continuationInput: PlayableCompletionContinuationResult = {
    state: input.state,
    characterDefinitions: input.characterDefinitions,
  };

  if (routedEventId != null && input.startFromEventId != null) {
    const started = input.startFromEventId({
      ...continuationInput,
      eventId: routedEventId,
    });
    if (started != null) {
      return {
        ...started,
        handled: true,
      };
    }
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

function isEventOwnedPlayableSession(
  session: ActivePlayableSession | null | undefined
): boolean {
  const sessionToken = session?.ownerContext.sessionToken;
  return typeof sessionToken === "string" && sessionToken.trim().length > 0;
}

function readPlayableFollowUpEventId(
  settlement: PlayableResult | null | undefined
): string | null {
  const followUpEventId = settlement?.followUpEventId;
  return typeof followUpEventId === "string" && followUpEventId.trim().length > 0
    ? followUpEventId.trim()
    : null;
}
