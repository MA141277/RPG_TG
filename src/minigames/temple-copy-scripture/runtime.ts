import type { ActivityDefinition, ActivityHandlerId } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type {
  PlayableIntegrationId,
  PlayableOwnerContext,
} from "../../core/contracts/playable-runtime";
import type { RuntimeState } from "../../core/contracts/runtime-state";
import {
  adjustActivityQteWagerPlayable,
  chooseActivityQteCommandPlayable,
  exitActivityQtePlayable,
  playActivityQtePlayable,
  startActivityQtePlayable,
  stopActivityQtePlayable,
  tickActivityQtePlayable,
} from "../../application/playables/activity-qte/activity-qte-definition";
import { TEMPLE_COPY_SCRIPTURE_HOUSE_INTEGRATION_ID } from "./contract";

type TempleCopyScripturePlayableResult = {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  completed: boolean;
};

export function launchTempleCopyScripturePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  handlerId: ActivityHandlerId;
  integrationId?: PlayableIntegrationId;
  ownerContext?: PlayableOwnerContext | undefined;
}): RuntimeState {
  const nextState = startActivityQtePlayable({
    state: input.state,
    activityDefinition: input.activityDefinition,
    handlerId: input.handlerId,
    integrationId:
      input.integrationId ?? TEMPLE_COPY_SCRIPTURE_HOUSE_INTEGRATION_ID,
    ...(input.ownerContext == null
      ? {}
      : { ownerContext: input.ownerContext }),
  });

  return {
    ...nextState,
    core: {
      ...nextState.core,
      runtime: {
        ...nextState.core.runtime,
        playableSession:
          nextState.core.runtime.playableSession == null
            ? null
            : {
                ...nextState.core.runtime.playableSession,
                sessionId: `playable.${TEMPLE_COPY_SCRIPTURE_HOUSE_INTEGRATION_ID}`,
                playableId: "temple-copy-scripture",
              },
      },
    },
  };
}

export function tickTempleCopyScripturePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): TempleCopyScripturePlayableResult {
  return tickActivityQtePlayable(input);
}

export function playTempleCopyScripturePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): TempleCopyScripturePlayableResult {
  return playActivityQtePlayable(input);
}

export function adjustTempleCopyScriptureWagerPlayable(input: {
  state: RuntimeState;
  characterDefinitions: CharacterDefinition[];
  direction: -1 | 1;
}): TempleCopyScripturePlayableResult {
  return adjustActivityQteWagerPlayable(input);
}

export function chooseTempleCopyScriptureCommandPlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
  commandId: string;
}): TempleCopyScripturePlayableResult {
  return chooseActivityQteCommandPlayable(input);
}

export function stopTempleCopyScripturePlayable(input: {
  state: RuntimeState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
}): TempleCopyScripturePlayableResult {
  return stopActivityQtePlayable(input);
}

export function exitTempleCopyScripturePlayable(
  state: RuntimeState
): RuntimeState {
  return exitActivityQtePlayable(state);
}
