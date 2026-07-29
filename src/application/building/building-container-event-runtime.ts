import type { CharacterDefinition } from "../../domain/character";
import type { EventBinding, EventDefinition } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { ModFirstActivatedEvent } from "../../core/runtime/event-binding-runtime";
import {
  createRuntimeTriggerContext,
  runModFirstEventBindingRuntime,
} from "../../core/runtime/event-binding-runtime";
import { startEvent } from "../events/event-runner";

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
  activation: ModFirstActivatedEvent | null;
};

export function triggerBuildingContainerItemAction(
  input: BuildingContainerEventRuntimeInput
): BuildingContainerEventRuntimeResult {
  const currentHouseId = input.state.world.currentHouseId;
  if (currentHouseId == null) {
    return createUnhandledResult(input);
  }

  const bindingResult = runModFirstEventBindingRuntime({
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

  const eventDefinition =
    input.eventDefinitionsById[bindingResult.activation.activeEventId];
  if (eventDefinition == null) {
    return createUnhandledResult(input);
  }

  return {
    state: startEvent(bindingResult.state, eventDefinition),
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
