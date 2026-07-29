import type { CharacterDefinition } from "../../domain/character";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { ActivatedEvent } from "../../core/runtime/event-activation";
import {
  createRuntimeTriggerContext,
  runEventBindingRuntime,
} from "../../core/runtime/event-binding-runtime";

export type BuildingContainerItemAction = {
  arrangementId: string;
  containerId: string;
  itemId: string;
  eventId?: string | undefined;
};

export type BuildingContainerEventRuntimeInput = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindings: EventBinding[];
  action: BuildingContainerItemAction;
};

export type BuildingContainerEventRuntimeResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  handled: boolean;
  activation: ActivatedEvent | null;
};

export function triggerBuildingContainerItemAction(
  input: BuildingContainerEventRuntimeInput
): BuildingContainerEventRuntimeResult {
  const currentHouseId = input.state.world.currentHouseId;
  if (currentHouseId == null) {
    return createUnhandledResult(input);
  }

  const bindingResult = runEventBindingRuntime({
    state: input.state,
    eventDefinitionsById: input.eventDefinitionsById,
    eventBindings: filterEventBindings(input.eventBindings, input.action),
    triggerContext: createRuntimeTriggerContext({
      state: input.state,
      owner: {
        family: "building",
        id: currentHouseId,
      },
      action: "building-container-item-action",
      payload: {
        arrangementId: input.action.arrangementId,
        containerId: input.action.containerId,
        itemId: input.action.itemId,
      },
    }),
  });

  if (bindingResult.activation == null) {
    return createUnhandledResult(input);
  }

  return {
    state: bindingResult.state,
    characterDefinitions: input.characterDefinitions,
    handled: true,
    activation: bindingResult.activation,
  };
}

function filterEventBindings(
  eventBindings: EventBinding[],
  action: BuildingContainerItemAction
): EventBinding[] {
  if (typeof action.eventId !== "string" || action.eventId.length === 0) {
    return eventBindings;
  }

  return eventBindings.filter((binding) => binding.eventId === action.eventId);
}

function createUnhandledResult(
  input: BuildingContainerEventRuntimeInput
): BuildingContainerEventRuntimeResult {
  return {
    state: input.state,
    characterDefinitions: input.characterDefinitions,
    handled: false,
    activation: null,
  };
}
