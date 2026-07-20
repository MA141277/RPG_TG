import type {
  EventBinding,
  EventBindingConditionGroup,
  EventDefinition,
  TriggerContext,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import { startEvent } from "../../application/events/event-runner";
import { activateEvent, type ActivatedEvent } from "./event-activation";
import type { EventRuntimeCandidate } from "../contracts/event-runtime";

export type EventBindingRuntimeCandidate = EventRuntimeCandidate & {
  bindingId: string;
};

export type EventBindingRuntimeInput = {
  state: GameState;
  eventDefinitionsById: Record<string, EventDefinition>;
  eventBindings: EventBinding[];
  triggerContext: TriggerContext;
};

export type EventBindingRuntimeResult = {
  state: GameState;
  activation: ActivatedEvent | null;
  candidate: EventBindingRuntimeCandidate | null;
};

export function runEventBindingRuntime(
  input: EventBindingRuntimeInput
): EventBindingRuntimeResult {
  const candidate = selectEventBindingCandidate(input);
  const activation = activateEvent(candidate);
  if (activation == null) {
    return {
      state: input.state,
      activation: null,
      candidate,
    };
  }

  const eventDefinition = input.eventDefinitionsById[activation.activeEventId];
  if (eventDefinition == null) {
    return {
      state: input.state,
      activation: null,
      candidate,
    };
  }

  const actionState = applyEventRuntimeActions(input.state, eventDefinition);
  if (hasOnlyStateRuntimeActions(eventDefinition)) {
    return {
      state: actionState,
      activation,
      candidate,
    };
  }

  return {
    state: startEvent(actionState, eventDefinition),
    activation,
    candidate,
  };
}

function selectEventBindingCandidate(
  input: EventBindingRuntimeInput
): EventBindingRuntimeCandidate | null {
  return input.eventBindings
    .filter((binding) => binding.enabled !== false)
    .filter((binding) => matchesTriggerContext(binding, input.triggerContext))
    .flatMap((binding) => {
      const eventDefinition = input.eventDefinitionsById[binding.eventId];
      if (eventDefinition == null) {
        return [];
      }

      if (
        !isOccurrenceAvailable(input.state, eventDefinition) ||
        !evaluateBindingConditions(input.state, binding.conditions)
      ) {
        return [];
      }

      return [toEventBindingRuntimeCandidate(binding, eventDefinition)];
    })
    .sort(compareCandidates)[0] ?? null;
}

function matchesTriggerContext(
  binding: EventBinding,
  triggerContext: TriggerContext
): boolean {
  return (
    binding.owner.family === triggerContext.owner.family &&
    (binding.owner.id == null || binding.owner.id === triggerContext.owner.id) &&
    binding.trigger.timing === triggerContext.timing &&
    binding.trigger.action === triggerContext.action &&
    matchesTriggerExtra(binding.trigger.extra, triggerContext.payload)
  );
}

function matchesTriggerExtra(
  expected: Record<string, unknown> | undefined,
  payload: Record<string, unknown> | undefined
): boolean {
  if (expected == null) {
    return true;
  }

  return Object.entries(expected).every(
    ([key, value]) => payload?.[key] === value
  );
}

function applyEventRuntimeActions(
  state: GameState,
  eventDefinition: EventDefinition
): GameState {
  return (eventDefinition.actions ?? []).reduce((currentState, action) => {
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
  return (
    (eventDefinition.actions?.length ?? 0) > 0 &&
    eventDefinition.entrySceneId.length === 0
  );
}

function isOccurrenceAvailable(
  state: GameState,
  eventDefinition: EventDefinition
): boolean {
  const eventHistory = state.runtime.eventHistory[eventDefinition.id];
  const firedCount = eventHistory?.firedCount ?? 0;

  if (eventDefinition.occurrence === "repeatable") {
    return true;
  }

  if (eventDefinition.occurrence === "once") {
    return firedCount === 0;
  }

  const chapterKey = `${eventDefinition.id}:${state.calendar.chapterId}`;
  return (state.runtime.variables[chapterKey] ?? 0) === 0;
}

function evaluateBindingConditions(
  state: GameState,
  conditionGroup: EventBindingConditionGroup | undefined
): boolean {
  if (conditionGroup == null) {
    return true;
  }

  if (conditionGroup.operator === "all") {
    return conditionGroup.conditions.every((conditionNode) =>
      evaluateBindingConditionNode(state, conditionNode)
    );
  }

  if (conditionGroup.operator === "any") {
    return conditionGroup.conditions.some((conditionNode) =>
      evaluateBindingConditionNode(state, conditionNode)
    );
  }

  return !conditionGroup.conditions.some((conditionNode) =>
    evaluateBindingConditionNode(state, conditionNode)
  );
}

function evaluateBindingConditionNode(
  state: GameState,
  conditionNode: EventBindingConditionGroup["conditions"][number]
): boolean {
  if (isBindingConditionGroup(conditionNode)) {
    return evaluateBindingConditions(state, conditionNode);
  }

  const condition = conditionNode as Record<string, unknown>;

  if (condition.type === "flag") {
    const key = readStringProperty(condition, "key");
    return key != null && state.runtime.flags[key] === condition["expected"];
  }

  if (condition.type === "variable") {
    const key = readStringProperty(condition, "key");
    const operator = readStringProperty(condition, "operator");
    return (
      key != null &&
      operator != null &&
      compareValue(
        state.runtime.variables[key],
        operator,
        condition["value"]
      )
    );
  }

  if (condition.type === "event-fired") {
    const eventId = readStringProperty(condition, "eventId");
    const expected = condition["expected"] ?? true;
    return (
      eventId != null &&
      (state.runtime.eventHistory[eventId]?.firedCount ?? 0) > 0 === expected
    );
  }

  if (condition.type === "event-fired-count") {
    const eventId = readStringProperty(condition, "eventId");
    const operator = readStringProperty(condition, "operator");
    return (
      eventId != null &&
      operator != null &&
      compareValue(
        state.runtime.eventHistory[eventId]?.firedCount ?? 0,
        operator,
        condition["value"]
      )
    );
  }

  return false;
}

function isBindingConditionGroup(
  value: EventBindingConditionGroup["conditions"][number]
): value is EventBindingConditionGroup {
  return (
    "operator" in value &&
    (value.operator === "all" ||
      value.operator === "any" ||
      value.operator === "not") &&
    "conditions" in value &&
    Array.isArray(value.conditions)
  );
}

function toEventBindingRuntimeCandidate(
  binding: EventBinding,
  eventDefinition: EventDefinition
): EventBindingRuntimeCandidate {
  return {
    bindingId: binding.id,
    eventId: eventDefinition.id,
    priority: binding.priority ?? 0,
    sceneId: eventDefinition.entrySceneId,
    taskInputs: eventDefinition.taskInputs ?? [],
  };
}

function compareCandidates(
  leftCandidate: EventBindingRuntimeCandidate,
  rightCandidate: EventBindingRuntimeCandidate
): number {
  const priorityDelta = rightCandidate.priority - leftCandidate.priority;
  if (priorityDelta !== 0) {
    return priorityDelta;
  }

  return leftCandidate.bindingId.localeCompare(rightCandidate.bindingId);
}

function readStringProperty(
  value: Record<string, unknown>,
  key: string
): string | null {
  const propertyValue = value[key];
  return typeof propertyValue === "string" ? propertyValue : null;
}

function compareValue(
  actual: number | string | undefined,
  operator: string,
  expected: unknown
): boolean {
  if (operator === "==") {
    return actual === expected;
  }

  if (operator === "!=") {
    return actual !== expected;
  }

  if (typeof actual !== "number" || typeof expected !== "number") {
    return false;
  }

  switch (operator) {
    case ">=":
      return actual >= expected;
    case "<=":
      return actual <= expected;
    case ">":
      return actual > expected;
    case "<":
      return actual < expected;
    default:
      return false;
  }
}
