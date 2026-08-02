import type { ActivityDefinition, ActivityHandlerId } from "../../domain/activity";
import { GENERIC_QTE_ACTIVITY_HANDLER_ID } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { startActivityQtePlayable } from "../playables/activity-qte/activity-qte-definition";

export type ActivityRunnerContext = {
  activityDefinitionsById: Record<string, ActivityDefinition>;
  characterDefinitions: CharacterDefinition[];
};

export type ActivityRunResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  handled: boolean;
  activityId: string | null;
  handlerId: ActivityHandlerId | null;
};

const BUILT_IN_ACTIVITY_HANDLERS = new Set<ActivityHandlerId>([
  GENERIC_QTE_ACTIVITY_HANDLER_ID,
]);

export function runActivity(
  state: GameState,
  activityId: string,
  context: ActivityRunnerContext,
  fallbackActivityId?: string
): ActivityRunResult {
  const activityDefinition =
    context.activityDefinitionsById[activityId] ??
    (fallbackActivityId == null
      ? null
      : context.activityDefinitionsById[fallbackActivityId]);

  if (activityDefinition == null) {
    return {
      state,
      characterDefinitions: context.characterDefinitions,
      handled: false,
      activityId: null,
      handlerId: null,
    };
  }

  const handlerId = resolveRunnableHandlerId(activityDefinition);
  if (handlerId == null) {
    return {
      state,
      characterDefinitions: context.characterDefinitions,
      handled: false,
      activityId: activityDefinition.id,
      handlerId: activityDefinition.handlerId,
    };
  }

  if (handlerId === GENERIC_QTE_ACTIVITY_HANDLER_ID) {
    return runGenericQteActivity(state, activityDefinition, context, handlerId);
  }

  return {
    state,
    characterDefinitions: context.characterDefinitions,
    handled: false,
    activityId: activityDefinition.id,
    handlerId,
  };
}

function resolveRunnableHandlerId(
  activityDefinition: ActivityDefinition
): ActivityHandlerId | null {
  if (BUILT_IN_ACTIVITY_HANDLERS.has(activityDefinition.handlerId)) {
    return activityDefinition.handlerId;
  }

  if (
    activityDefinition.fallbackHandlerId != null &&
    BUILT_IN_ACTIVITY_HANDLERS.has(activityDefinition.fallbackHandlerId)
  ) {
    return activityDefinition.fallbackHandlerId;
  }

  return null;
}

function runGenericQteActivity(
  state: GameState,
  activityDefinition: ActivityDefinition,
  context: ActivityRunnerContext,
  handlerId: ActivityHandlerId
): ActivityRunResult {
  const runtimeState = {
    core: state,
    app: {
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };

  return {
    state: startActivityQtePlayable({
      state: runtimeState,
      activityDefinition,
      handlerId,
    }).core,
    characterDefinitions: context.characterDefinitions,
    handled: true,
    activityId: activityDefinition.id,
    handlerId,
  };
}
