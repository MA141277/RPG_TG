import type { RuntimeInteractiveSignal } from "../../../core/contracts/runtime-result";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import type {
  ActivePlayableSession,
  PlayableIntegrationId,
  PlayableOwnerContext,
} from "../../../core/contracts/playable-runtime";
import type { GameState } from "../../../domain/game-state";
import type { StoryBattleCompletion } from "../../../domain/story-battle";
import {
  createSundeyaRescueBattleSession,
  dispatchStoryBattleAction,
  startStoryBattle,
} from "../../story-battle/story-battle-runtime";

function withPlayableSession(
  state: GameState,
  options: {
    integrationId?: PlayableIntegrationId;
    ownerContext?: PlayableOwnerContext;
    fallbackOwnerId?: string | null;
    previousSession?: ActivePlayableSession | null;
  }
): GameState {
  const previousSession = options.previousSession ?? null;
  const ownerContext =
    options.ownerContext ??
    previousSession?.ownerContext ?? {
      ownerKind: options.fallbackOwnerId == null ? "external" : "house",
      ownerId: options.fallbackOwnerId ?? null,
      returnPolicy: "reenter-owner",
    };
  return {
    ...state,
    runtime: {
      ...state.runtime,
      playableSession: {
        sessionId: "playable.story-battle",
        playableId: "story-battle",
        integrationId:
          options.integrationId ??
          previousSession?.integrationId ??
          "playable.story-battle.dialogue.default",
        ownerContext,
        status: "active",
      },
    },
  };
}

export function launchStoryBattlePlayable(input: {
  state: GameState;
  ownerId: string | null;
  integrationId?: PlayableIntegrationId | undefined;
  ownerContext?: PlayableOwnerContext | undefined;
  completion: StoryBattleCompletion;
  textEntriesById?: Record<string, string> | undefined;
}): GameState {
  return withPlayableSession(
    startStoryBattle(
      input.state,
      createSundeyaRescueBattleSession(input.completion, {
        textEntriesById: input.textEntriesById,
      })
    ),
    {
      fallbackOwnerId: input.ownerId,
      ...(input.integrationId == null
        ? {}
        : { integrationId: input.integrationId }),
      ...(input.ownerContext == null
        ? {}
        : { ownerContext: input.ownerContext }),
    }
  );
}

export function dispatchStoryBattlePlayableAction(input: {
  state: RuntimeState;
  battleActionId: string;
  textEntriesById?: Record<string, string> | undefined;
}): {
  state: RuntimeState;
  followUp: RuntimeInteractiveSignal;
} {
  const result = dispatchStoryBattleAction(input.state.core, input.battleActionId, {
    textEntriesById: input.textEntriesById,
  });
  const currentSession = input.state.core.runtime.playableSession;
  const ownerId =
    currentSession?.ownerContext.ownerId ??
    input.state.core.dialogue.activeDialogueId ??
    input.state.core.dialogue.activeEventId ??
    input.state.core.world.currentHouseId;
  const nextCore =
    result.state.storyBattle == null
      ? {
          ...result.state,
          runtime: {
            ...result.state.runtime,
            playableSession: null,
          },
        }
      : withPlayableSession(result.state, {
          fallbackOwnerId: ownerId,
          ...(currentSession?.integrationId == null
            ? {}
            : { integrationId: currentSession.integrationId }),
          ...(currentSession?.ownerContext == null
            ? {}
            : { ownerContext: currentSession.ownerContext }),
          ...(currentSession == null ? {} : { previousSession: currentSession }),
        });

  return {
    state: {
      ...input.state,
      core: nextCore,
    },
    followUp:
      result.enterHouseId == null
        ? { type: "none" }
        : { type: "reenter-house", houseId: result.enterHouseId },
  };
}

export function exitStoryBattlePlayable(state: RuntimeState): RuntimeState {
  return {
    ...state,
    core: {
      ...state.core,
      storyBattle: null,
      runtime: {
        ...state.core.runtime,
        playableSession: null,
      },
    },
  };
}
