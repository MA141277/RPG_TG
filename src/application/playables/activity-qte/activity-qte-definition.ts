import type { ActivityDefinition, ActivityHandlerId } from "../../../domain/activity";
import type { CharacterDefinition } from "../../../domain/character";
import type {
  PlayableIntegrationId,
  PlayableOwnerContext,
} from "../../../core/contracts/playable-runtime";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import {
  adjustActivityFortuneBoardWager,
  advanceActivityQteMarker,
  chooseActivityQteCommand,
  createActivityQteSession,
  playActivityQte,
  stopActivityQte,
  tickActivityQte,
} from "../../activity/activity-qte-runtime";

type ActivityQtePlayableResult = {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  completed: boolean;
};

export function startActivityQtePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  handlerId: ActivityHandlerId;
  integrationId?: PlayableIntegrationId;
  ownerContext?: PlayableOwnerContext;
}): RuntimeState {
  const session = createActivityQteSession(
    input.activityDefinition,
    input.handlerId
  );

  return {
    ...input.state,
    core: {
      ...input.state.core,
      runtime: {
        ...input.state.core.runtime,
        playableSession: {
          sessionId: "playable.activity-qte",
          playableId: "activity-qte",
          integrationId:
            input.integrationId ?? "playable.activity-qte.scene.default",
          family: "minigame",
          ownerContext:
            input.ownerContext ?? {
              ownerKind: "scene",
              ownerId: input.state.core.scene.activeSceneId ?? "scene.unknown",
              returnPolicy: "resume-owner",
            },
          status: "active",
        },
        activitySession: session,
      },
    },
  };
}

export function advanceActivityQtePlayable(state: RuntimeState): RuntimeState {
  return {
    ...state,
    core: advanceActivityQteMarker(state.core),
  };
}

export function tickActivityQtePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): ActivityQtePlayableResult {
  return toActivityQtePlayableResult({
    state: input.state,
    completion: tickActivityQte(
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
    completion: playActivityQte(
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

export function exitActivityQtePlayable(state: RuntimeState): RuntimeState {
  return {
    ...state,
    core: {
      ...state.core,
      runtime: {
        ...state.core.runtime,
        playableSession: null,
        activitySession: null,
      },
    },
  };
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
