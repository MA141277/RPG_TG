import type { ActivityDefinition } from "../../domain/activity";
import type { CharacterDefinition } from "../../domain/character";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type {
  HouseModuleId,
  HouseModuleSessionState,
} from "../../domain/house-module";
import { startActivityQtePlayable } from "../playables/activity-qte/activity-qte-definition";
import { applyEventRuntimeActions } from "../../core/runtime/event-binding-runtime";
import {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} from "../../core/runtime/playable-runtime";
import {
  triggerBuildingContainerItemAction,
  type BuildingContainerItemAction,
} from "../building/building-container-event-runtime";
import {
  createHousePlayableRuntimeState,
  readHousePlayableSessionState,
} from "../playables/house-playable-runtime-bridge";

export type HouseModulePackEventByIdInput = {
  state: GameState;
  eventDefinitionsById?: Record<string, EventDefinition> | undefined;
  eventId: string;
};

export type HouseModulePackEventByItemIdInput = {
  state: GameState;
  eventDefinitionsById?: Record<string, EventDefinition> | undefined;
  eventBindings?: EventBinding[] | undefined;
  houseId: string;
  itemId: string;
};

export type HouseModulePackEventByIdResult = {
  state: GameState;
  handled: boolean;
  eventDefinition: EventDefinition | null;
};

export type HouseModulePackBuildingActionInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById?: Record<string, EventDefinition> | undefined;
  eventBindings?: EventBinding[] | undefined;
  action: BuildingContainerItemAction;
};

export type HouseModulePackPlayableLaunchByItemIdInput<
  ModuleId extends HouseModuleId,
> = {
  gameState: GameState;
  moduleId: ModuleId;
  sessionState: HouseModuleSessionState<ModuleId> | null;
  characterDefinitions: CharacterDefinition[];
  playerCharacterId: string;
  eventDefinitionsById?: Record<string, EventDefinition> | undefined;
  eventBindings?: EventBinding[] | undefined;
  activityDefinitionsById?: Record<string, ActivityDefinition> | undefined;
  textEntriesById?: Record<string, string> | undefined;
  houseId: string;
  itemId: string;
};

export type HouseModulePackPlayableLaunchByItemIdResult<
  ModuleId extends HouseModuleId,
> = {
  gameState: GameState;
  characterDefinitions: CharacterDefinition[];
  sessionState: HouseModuleSessionState<ModuleId> | null;
  handled: boolean;
  eventDefinition: EventDefinition | null;
};

export function applyHouseModulePackEventById(
  input: HouseModulePackEventByIdInput
): HouseModulePackEventByIdResult {
  const eventDefinition =
    input.eventDefinitionsById?.[input.eventId] ?? null;
  if (eventDefinition == null) {
    return {
      state: input.state,
      handled: false,
      eventDefinition: null,
    };
  }

  return {
    state: applyEventRuntimeActions(input.state, eventDefinition),
    handled: true,
    eventDefinition,
  };
}

export function readHouseModulePackEventByItemId(
  input: HouseModulePackEventByItemIdInput
): EventDefinition | null {
  const binding = resolveBuildingContainerItemBinding(
    input.eventBindings,
    input.houseId,
    input.itemId
  );
  if (binding?.eventId == null || input.eventDefinitionsById == null) {
    return null;
  }

  return input.eventDefinitionsById[binding.eventId] ?? null;
}

export function applyHouseModulePackEventByItemId(
  input: HouseModulePackEventByItemIdInput
): HouseModulePackEventByIdResult {
  const eventDefinition = readHouseModulePackEventByItemId(input);
  if (eventDefinition == null) {
    return {
      state: input.state,
      handled: false,
      eventDefinition: null,
    };
  }

  return {
    state: applyEventRuntimeActions(input.state, eventDefinition),
    handled: true,
    eventDefinition,
  };
}

export function triggerHouseModulePackBuildingAction(
  input: HouseModulePackBuildingActionInput
) {
  if (input.eventDefinitionsById == null || input.eventBindings == null) {
    return {
      state: input.state,
      characterDefinitions: input.characterDefinitions,
      handled: false,
      activation: null,
    };
  }

  return triggerBuildingContainerItemAction({
    state: input.state,
    characterDefinitions: input.characterDefinitions,
    eventDefinitionsById: input.eventDefinitionsById,
    eventBindings: input.eventBindings,
    action: input.action,
  });
}

export function launchHouseModulePackPlayableByItemId<
  ModuleId extends HouseModuleId,
>(input: HouseModulePackPlayableLaunchByItemIdInput<ModuleId>): HouseModulePackPlayableLaunchByItemIdResult<ModuleId> {
  const binding = resolveBuildingContainerItemBinding(
    input.eventBindings,
    input.houseId,
    input.itemId
  );
  if (
    binding == null ||
    input.eventDefinitionsById == null ||
    binding.eventId == null
  ) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: input.sessionState,
      handled: false,
      eventDefinition: null,
    };
  }

  const eventDefinition = input.eventDefinitionsById[binding.eventId] ?? null;
  const launchPlayableAction = eventDefinition?.actions?.find(
    (action): action is Extract<
      NonNullable<EventDefinition["actions"]>[number],
      { type: "launchPlayable" }
    > => action.type === "launchPlayable"
  );
  if (eventDefinition == null || launchPlayableAction == null) {
    return {
      gameState: input.gameState,
      characterDefinitions: input.characterDefinitions,
      sessionState: input.sessionState,
      handled: false,
      eventDefinition,
    };
  }

  if (launchPlayableAction.playableId === "activity-qte") {
    const activityId = launchPlayableAction.payload?.activityId;
    const activityDefinition =
      typeof activityId === "string"
        ? input.activityDefinitionsById?.[activityId] ?? null
        : null;
    if (activityDefinition != null) {
      const handlerId =
        typeof launchPlayableAction.payload?.handlerId === "string"
          ? launchPlayableAction.payload.handlerId
          : activityDefinition.fallbackHandlerId ?? activityDefinition.handlerId;
      const nextState = startActivityQtePlayable({
        state: createHousePlayableRuntimeState({
          gameState: input.gameState,
          moduleId: input.moduleId,
          sessionState: input.sessionState,
        }),
        activityDefinition,
        handlerId,
        integrationId: launchPlayableAction.integrationId,
        ownerContext: launchPlayableAction.ownerContext,
      });

      return {
        gameState: nextState.core,
        characterDefinitions: input.characterDefinitions,
        sessionState:
          readHousePlayableSessionState(nextState, input.moduleId) ??
          input.sessionState,
        handled: nextState.core.runtime.playableSession != null,
        eventDefinition,
      };
    }
  }

  const runtimeResult = runPlayableRuntime({
    state: createHousePlayableRuntimeState({
      gameState: input.gameState,
      moduleId: input.moduleId,
      sessionState: input.sessionState,
    }),
    request: createLaunchPlayableRequest(launchPlayableAction.playableId, {
      integrationId: launchPlayableAction.integrationId,
      ownerContext: launchPlayableAction.ownerContext,
      ...(launchPlayableAction.payload == null
        ? {}
        : { payload: launchPlayableAction.payload }),
    }),
    characterDefinitions: input.characterDefinitions,
    playerCharacterId: input.playerCharacterId,
    ...(input.activityDefinitionsById == null
      ? {}
      : { activityDefinitionsById: input.activityDefinitionsById }),
    ...(input.textEntriesById == null
      ? {}
      : { textEntriesById: input.textEntriesById }),
  });

  return {
    gameState: runtimeResult.state.core,
    characterDefinitions:
      runtimeResult.characterDefinitions ?? input.characterDefinitions,
    sessionState:
      readHousePlayableSessionState(runtimeResult.state, input.moduleId) ??
      input.sessionState,
    handled:
      runtimeResult.handled &&
      runtimeResult.state.core.runtime.playableSession != null,
    eventDefinition,
  };
}

function resolveBuildingContainerItemBinding(
  eventBindings: EventBinding[] | undefined,
  houseId: string,
  itemId: string
): EventBinding | null {
  if (eventBindings == null) {
    return null;
  }

  return (
    eventBindings.find((binding) => {
      if (binding.owner.family !== "building" || binding.owner.id !== houseId) {
        return false;
      }
      if (
        binding.trigger.timing !== "after" ||
        binding.trigger.action !== "building-container-item-action"
      ) {
        return false;
      }
      const extra = binding.trigger.extra;
      return (
        extra != null &&
        typeof extra === "object" &&
        extra.itemId === itemId
      );
    }) ?? null
  );
}
