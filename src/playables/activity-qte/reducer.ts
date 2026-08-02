import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import {
  adjustActivityFortuneBoardWager,
  chooseActivityQteCommand,
  playActivityFortuneBoard,
  stopActivityQte,
  tickActivityFortuneBoard,
} from "../../application/activity/activity-qte-runtime";
import type { ActivityQtePlayableResult } from "./contract";
import type { RuntimeState } from "../../core/contracts/runtime-state";

export function tickActivityQtePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): ActivityQtePlayableResult {
  return toActivityQtePlayableResult({
    state: input.state,
    completion: tickActivityFortuneBoard(
      input.state.core,
      input.activityDefinition,
      input.characterDefinitions
    ),
  });
}

export function playActivityQtePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): ActivityQtePlayableResult {
  return toActivityQtePlayableResult({
    state: input.state,
    completion: playActivityFortuneBoard(
      input.state.core,
      input.activityDefinition,
      input.characterDefinitions
    ),
  });
}

export function adjustActivityQteWagerPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  direction: -1 | 1;
}): ActivityQtePlayableResult {
  return toActivityQtePlayableResult({
    state: input.state,
    completion: {
      state: adjustActivityFortuneBoardWager(input.state.core, input.direction),
      characterDefinitions: input.characterDefinitions,
    },
  });
}

export function stopActivityQtePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): ActivityQtePlayableResult {
  return toActivityQtePlayableResult({
    state: input.state,
    completion: stopActivityQte(
      input.state.core,
      input.activityDefinition,
      input.characterDefinitions
    ),
  });
}

export function chooseActivityQteCommandPlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
  commandId: string;
}): ActivityQtePlayableResult {
  return toActivityQtePlayableResult({
    state: input.state,
    completion: chooseActivityQteCommand(
      input.state.core,
      input.activityDefinition,
      input.characterDefinitions,
      input.commandId
    ),
  });
}

function toActivityQtePlayableResult(input: {
  state: RuntimeState;
  completion: {
    state: RuntimeState["core"];
    characterDefinitions: CharacterDefinition[];
  };
}): ActivityQtePlayableResult {
  const activitySession = input.completion.state.runtime.activitySession;
  const completed = activitySession?.type === "result";
  const currentPlayableSession = input.state.core.runtime.playableSession;

  return {
    state: {
      ...input.state,
      core: {
        ...input.completion.state,
        runtime: {
          ...input.completion.state.runtime,
          playableSession:
            completed && currentPlayableSession != null
              ? {
                  ...currentPlayableSession,
                  status: "completed",
                }
              : currentPlayableSession,
        },
      },
    },
    characterDefinitions: input.completion.characterDefinitions,
    completed,
  };
}
