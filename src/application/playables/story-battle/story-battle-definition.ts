import type {
  RuntimeFollowUp,
  RuntimeInteractiveSignal,
} from "../../../core/contracts/runtime-result";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import type { GameState } from "../../../domain/game-state";
import type { StoryBattleCompletion } from "../../../domain/story-battle";
import {
  createSundeyaRescueBattleSession,
  dispatchStoryBattleAction,
  startStoryBattle,
} from "../../story-battle/story-battle-runtime";

function withPlayableSession(
  state: GameState,
  ownerId: string | null
): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      playableSession: {
        sessionId: "playable.story-battle",
        playableId: "story-battle",
        integrationId: "playable.story-battle.scene.default",
        family: "battle",
        ownerContext: {
          ownerKind: "scene",
          ownerId,
          returnPolicy: "reenter-owner",
        },
        status: "active",
      },
    },
  };
}

export function launchStoryBattlePlayable(input: {
  state: GameState;
  ownerId: string | null;
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
    input.ownerId
  );
}

export function dispatchStoryBattlePlayableAction(input: {
  state: RuntimeState;
  battleActionId: string;
  textEntriesById?: Record<string, string> | undefined;
}): {
  state: RuntimeState;
  interactive: RuntimeInteractiveSignal;
  followUp: RuntimeFollowUp;
} {
  const result = dispatchStoryBattleAction(input.state.core, input.battleActionId, {
    textEntriesById: input.textEntriesById,
  });
  const ownerId =
    input.state.core.runtime.playableSession?.ownerContext.ownerId ??
    input.state.core.scene.activeSceneId ??
    "scene.unknown";
  const nextCore =
    result.state.storyBattle == null
      ? {
          ...result.state,
          runtime: {
            ...result.state.runtime,
            playableSession: null,
          },
        }
      : withPlayableSession(result.state, ownerId);

  const followUp: RuntimeFollowUp =
    result.state.scene.activeSceneId != null || result.enterHouseId == null
      ? { type: "none" }
      : { type: "reenter-house", houseId: result.enterHouseId };

  return {
    state: {
      ...input.state,
      core: nextCore,
    },
    interactive: followUp,
    followUp,
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
