import type { ActivityDefinition, ActivityHandlerId } from "../../../domain/activity";
import type { CharacterDefinition } from "../../../domain/character";
import type { RuntimeState } from "../../../core/contracts/runtime-state";
import {
  advanceActivityQteMarker,
  createActivityQteSession,
  stopActivityQte,
} from "../../activity/activity-qte-runtime";

export function startActivityQtePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  handlerId: ActivityHandlerId;
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
          integrationId: "playable.activity-qte.scene.default",
          family: "minigame",
          ownerContext: {
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

export function stopActivityQtePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  completed: boolean;
} {
  const completion = stopActivityQte(
    input.state.core,
    input.activityDefinition,
    input.characterDefinitions
  );
  const activitySession = completion.state.runtime.activitySession;
  const completed = activitySession?.type === "result";
  const currentPlayableSession = input.state.core.runtime.playableSession;

  return {
    state: {
      ...input.state,
      core: {
        ...completion.state,
        runtime: {
          ...completion.state.runtime,
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
    characterDefinitions: completion.characterDefinitions,
    completed,
  };
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
