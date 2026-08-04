import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import type {
  MeetingActionDefinition,
  MeetingActionSetDefinition,
} from "../../domain/meeting/meeting-action-set";
import {
  applyReviewItemReward,
  resolveReviewItemRewardById,
} from "../review/faction-review";

export type RunMeetingActionSetInput = {
  actionSet: MeetingActionSetDefinition;
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
};

export type RunMeetingActionSetResult = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  executedActionIds: string[];
  diagnostics: string[];
  blocked: boolean;
};

function validateMeetingAction(
  action: MeetingActionDefinition
): string | null {
  if (action.type === "set-flag" || action.type === "set-variable") {
    return null;
  }

  if (action.type === "grant-reward") {
    return resolveReviewItemRewardById(action.rewardId) == null
      ? `Unsupported meeting reward id: ${action.rewardId}`
      : null;
  }

  return `Unsupported meeting action type: ${action.type}`;
}

function writeRuntimeFlag(
  gameState: GameState,
  flagId: string,
  value: boolean
): GameState {
  return {
    ...gameState,
    runtime: {
      ...gameState.runtime,
      flags: {
        ...gameState.runtime.flags,
        [flagId]: value,
      },
    },
  };
}

function writeRuntimeVariable(
  gameState: GameState,
  variableId: string,
  value: string | number
): GameState {
  return {
    ...gameState,
    runtime: {
      ...gameState.runtime,
      variables: {
        ...gameState.runtime.variables,
        [variableId]: value,
      },
    },
  };
}

function runMeetingAction(
  gameState: GameState,
  action: MeetingActionDefinition
): GameState {
  switch (action.type) {
    case "set-flag":
      return writeRuntimeFlag(gameState, action.flagId, action.value);
    case "set-variable":
      return writeRuntimeVariable(gameState, action.variableId, action.value);
    case "grant-reward": {
      const reward = resolveReviewItemRewardById(action.rewardId);
      if (reward == null) {
        return gameState;
      }
      return applyReviewItemReward(gameState, {
        ...reward,
        ...(action.amount == null ? {} : { quantity: action.amount }),
      });
    }
    default:
      return gameState;
  }
}

export function runMeetingActionSet(
  input: RunMeetingActionSetInput
): RunMeetingActionSetResult {
  for (const action of input.actionSet.actions) {
    const diagnostic = validateMeetingAction(action);
    if (diagnostic != null) {
      return {
        gameState: input.gameState,
        characterDefinitions: input.characterDefinitions,
        executedActionIds: [],
        diagnostics: [diagnostic],
        blocked: true,
      };
    }
  }

  let nextState = input.gameState;
  const executedActionIds: string[] = [];

  for (const action of input.actionSet.actions) {
    nextState = runMeetingAction(nextState, action);
    executedActionIds.push(action.id);
  }

  return {
    gameState: nextState,
    characterDefinitions: input.characterDefinitions,
    executedActionIds,
    diagnostics: [],
    blocked: false,
  };
}
