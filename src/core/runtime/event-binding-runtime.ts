import type {
  EventBinding,
  EventDefinition,
  EventRuntimeAction,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { RuntimeEventEntity } from "../contracts/event-router";
import type { RuntimeState } from "../contracts/runtime-state";
import { activateEvent, type ActivatedEvent } from "./event-activation";
import { createRuntimeEventEntity } from "./event-entity-projection";
import { createEventRouteActivationHandlers } from "./event-route-activation";
import { dispatchEventRoute } from "./event-router";
import {
  createRuntimeTriggerContext,
  isSupportedEventBindingOwnerFamily,
  isSupportedEventBindingTrigger,
  runModFirstEventBindingRuntime,
  selectModFirstEventBindingCandidate,
  type ModFirstEventBindingRuntimeCandidate,
  type ModFirstTriggerContext,
  type RuntimeTriggerContextInput,
} from "./mod-first-compatibility";

export {
  createRuntimeTriggerContext,
  isSupportedEventBindingOwnerFamily,
  isSupportedEventBindingTrigger,
  runModFirstEventBindingRuntime,
  selectModFirstEventBindingCandidate,
};

export type {
  ModFirstActivatedEvent,
  ModFirstEventBindingRuntimeInput,
  ModFirstEventBindingRuntimeResult,
  RuntimeTriggerContextInput,
} from "./mod-first-compatibility";

export type EventBindingRuntimeCandidate =
  ModFirstEventBindingRuntimeCandidate & {
    sceneId: string | null;
  };

export type EventBindingRuntimeInput = {
  state: GameState;
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindings: EventBinding[];
  triggerContext: ModFirstTriggerContext;
};

export type EventBindingRuntimeResult = {
  state: GameState;
  activation: ActivatedEvent | null;
  candidate: EventBindingRuntimeCandidate | null;
};

export type EventBindingSelectionResult = {
  activation: ActivatedEvent | null;
  candidate: EventBindingRuntimeCandidate | null;
  eventDefinition: EventDefinition | null;
};

export function runEventBindingRuntime(
  input: EventBindingRuntimeInput
): EventBindingRuntimeResult {
  const selection = selectEventBindingActivation(input);
  if (selection.activation == null || selection.eventDefinition == null) {
    return {
      state: input.state,
      activation:
        selection.eventDefinition == null ? null : selection.activation,
      candidate: selection.candidate,
    };
  }

  const actionState = applyEventRuntimeActions(
    input.state,
    selection.eventDefinition
  );
  if (hasOnlyStateRuntimeActions(selection.eventDefinition)) {
    return {
      state: actionState,
      activation: selection.activation,
      candidate: selection.candidate,
    };
  }

  return {
    state: routeBindingEvent(
      actionState,
      selection.eventDefinition,
      input.eventDefinitionsById
    ),
    activation: selection.activation,
    candidate: selection.candidate,
  };
}

export function selectEventBindingActivation(
  input: EventBindingRuntimeInput
): EventBindingSelectionResult {
  const selected = selectModFirstEventBindingCandidate(input);
  const eventDefinition =
    selected == null ? null : input.eventDefinitionsById[selected.eventId] ?? null;
  const candidate =
    selected == null
      ? null
      : toEventBindingRuntimeCandidate(selected, eventDefinition ?? undefined);

  return {
    activation: activateEvent(candidate),
    candidate,
    eventDefinition,
  };
}

function toEventBindingRuntimeCandidate(
  candidate: ModFirstEventBindingRuntimeCandidate,
  eventDefinition: EventDefinition | undefined
): EventBindingRuntimeCandidate {
  return {
    ...candidate,
    sceneId: eventDefinition?.entrySceneId ?? null,
  };
}

function routeBindingEvent(
  state: GameState,
  eventDefinition: EventDefinition,
  eventDefinitionsById: Record<string, EventDefinition>
): GameState {
  return dispatchEventRoute({
    state: toEventBindingRuntimeState(state),
    eventId: eventDefinition.id,
    context: {
      repository: {
        resolveById: (eventId) => {
          const resolved = eventDefinitionsById[eventId];
          return resolved == null ? null : toEventBindingRuntimeEventEntity(resolved);
        },
      },
      handlers: createEventRouteActivationHandlers({
        eventDefinitionsById,
        fallbackEventDefinition: eventDefinition,
      }),
    },
  }).state.core;
}

function toEventBindingRuntimeState(state: GameState): RuntimeState {
  return {
    core: state,
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function toEventBindingRuntimeEventEntity(
  eventDefinition: EventDefinition
): RuntimeEventEntity {
  const { emitEventIds } = eventDefinition;
  return createRuntimeEventEntity({
    ...eventDefinition,
    ...(emitEventIds == null ? {} : { emitEventIds }),
  });
}

export function applyEventRuntimeActions(
  state: GameState,
  eventDefinition: EventDefinition
): GameState {
  return applyRuntimeActions(state, eventDefinition.actions ?? []);
}

export function applyRuntimeActions(
  state: GameState,
  actions: readonly EventRuntimeAction[]
): GameState {
  return actions.reduce((currentState, action) => {
    if (action.type === "closeBuilding") {
      return {
        ...currentState,
        world: {
          ...currentState.world,
          currentHouseId: null,
        },
        ui: {
          ...currentState.ui,
          currentView: "city",
          overlayView: null,
          houseSession: null,
        },
      };
    }

    return currentState;
  }, state);
}

function hasOnlyStateRuntimeActions(eventDefinition: EventDefinition): boolean {
  const dialogueId =
    typeof eventDefinition.dialogueId === "string"
      ? eventDefinition.dialogueId.trim()
      : "";
  return (eventDefinition.actions?.length ?? 0) > 0 && dialogueId.length === 0;
}
