import type {
  EventDefinition,
  EventId,
  EventParticipant,
} from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import type { PlayableReturnPolicy } from "../contracts/playable-runtime";
import type {
  RuntimeTaskAction,
  RuntimeTaskSignal,
} from "../contracts/runtime-result";

export type ModFirstRuntimeTaskInput =
  | RuntimeTaskAction
  | RuntimeTaskSignal;

export type ModFirstEventBindingOwner = {
  family: string;
  id?: string;
  extra?: Record<string, unknown>;
};

export type ModFirstEventBindingTrigger = {
  timing: string;
  action: string;
  payloadSchemaId?: string;
  extra?: Record<string, unknown>;
};

export type ModFirstEventBindingConditionGroup = {
  operator: "all" | "any" | "not";
  conditions: ModFirstEventBindingConditionNode[];
};

export type ModFirstEventBindingConditionNode =
  | ModFirstEventBindingConditionGroup
  | {
      type: string;
      field?: string;
      operator?: string;
      value?: unknown;
      resolverId?: string;
      extra?: Record<string, unknown>;
    };

export type ModFirstEventBinding = {
  id: string;
  eventId: EventId;
  owner: ModFirstEventBindingOwner;
  trigger: ModFirstEventBindingTrigger;
  conditions?: ModFirstEventBindingConditionGroup;
  priority?: number;
  enabled?: boolean;
  meta?: Record<string, unknown>;
};

export type ModFirstTriggerContext = {
  timing: string;
  action: string;
  owner: {
    family: string;
    id?: string;
  };
  actorCharacterId?: string;
  currentCityId?: string;
  currentHouseId?: string;
  payload?: Record<string, unknown>;
};

export type ModFirstEventRuntimeAction =
  | {
      type: "closeBuilding";
    }
  | {
      type: "launchPlayable";
      playableId: string;
      integrationId: string;
      ownerContext: {
        ownerKind: "house" | "scene" | "dialogue" | "task" | "external";
        ownerId: string | null;
        returnPolicy: PlayableReturnPolicy;
      };
      payload?: Record<string, unknown>;
    }
  | {
      type: "launchFlow";
      flowId: string;
      ownerContext: {
        ownerKind: "house" | "scene" | "dialogue" | "task" | "external";
        ownerId: string | null;
        returnPolicy: PlayableReturnPolicy;
      };
    };

export type ModFirstEventDefinitionOverlay = {
  type?: "settlement";
  dialogueId?: string;
  actions?: ModFirstEventRuntimeAction[];
  settlementId?: string;
  taskInputs?: ModFirstRuntimeTaskInput[];
  participants?: EventParticipant[];
  tags?: string[];
};

export type ModFirstProgressionSettlementInstance = {
  settlementId: string;
  sourceEventId?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

export type ModFirstEventDefinition = EventDefinition &
  ModFirstEventDefinitionOverlay;

export type ModFirstEventBindingRuntimeCandidate = {
  bindingId: string;
  eventId: string;
  priority: number;
  taskInputs: ModFirstRuntimeTaskInput[];
};

export type ModFirstActivatedEvent = {
  activeEventId: string;
  taskInputs: ModFirstRuntimeTaskInput[];
};

export type ModFirstEventBindingRuntimeInput = {
  state: GameState;
  eventDefinitionsById: Record<string, ModFirstEventDefinition>;
  eventBindings: ModFirstEventBinding[];
  triggerContext: ModFirstTriggerContext;
};

export type ModFirstEventBindingRuntimeResult = {
  state: GameState;
  activation: ModFirstActivatedEvent | null;
  candidate: ModFirstEventBindingRuntimeCandidate | null;
};

const SUPPORTED_EVENT_BINDING_OWNER_FAMILIES = new Set([
  "story",
  "city",
  "building",
]);

const SUPPORTED_EVENT_BINDING_TRIGGER_KEYS = new Set([
  "after:story-progress",
  "after:city-enter",
  "after:building-enter",
  "after:indoor-screen-shown",
  "after:building-container-item-action",
]);

export type RuntimeTriggerContextInput = {
  state: Pick<GameState, "world">;
  owner: ModFirstTriggerContext["owner"];
  timing?: string;
  action: string;
  actorCharacterId?: string;
  payload?: Record<string, unknown>;
};

export function isSupportedEventBindingOwnerFamily(value: string): boolean {
  return SUPPORTED_EVENT_BINDING_OWNER_FAMILIES.has(value);
}

export function isSupportedEventBindingTrigger(
  trigger: Pick<ModFirstEventBindingTrigger, "timing" | "action">
): boolean {
  return SUPPORTED_EVENT_BINDING_TRIGGER_KEYS.has(
    `${trigger.timing}:${trigger.action}`
  );
}

export function createRuntimeTriggerContext(
  input: RuntimeTriggerContextInput
): ModFirstTriggerContext {
  return {
    owner: input.owner,
    timing: input.timing ?? "after",
    action: input.action,
    ...(input.actorCharacterId == null
      ? {}
      : { actorCharacterId: input.actorCharacterId }),
    ...(input.state.world.currentCityId == null
      ? {}
      : { currentCityId: input.state.world.currentCityId }),
    ...(input.state.world.currentHouseId == null
      ? {}
      : { currentHouseId: input.state.world.currentHouseId }),
    ...(input.payload == null ? {} : { payload: input.payload }),
  };
}

export function selectModFirstEventBindingCandidate(
  input: ModFirstEventBindingRuntimeInput
): ModFirstEventBindingRuntimeCandidate | null {
  return (
    input.eventBindings
      .filter((binding) => binding.enabled !== false)
      .filter((binding) =>
        matchesModFirstTriggerContext(binding, input.triggerContext)
      )
      .flatMap((binding) => {
        const eventDefinition = input.eventDefinitionsById[binding.eventId];
        if (eventDefinition == null) {
          return [];
        }

        if (
          !isModFirstOccurrenceAvailable(input.state, eventDefinition) ||
          !evaluateModFirstBindingConditions(input.state, binding.conditions)
        ) {
          return [];
        }

        return [toModFirstEventBindingRuntimeCandidate(binding, eventDefinition)];
      })
      .sort(compareModFirstCandidates)[0] ?? null
  );
}

export function runModFirstEventBindingRuntime(
  input: ModFirstEventBindingRuntimeInput
): ModFirstEventBindingRuntimeResult {
  const candidate = selectModFirstEventBindingCandidate(input);
  if (candidate == null) {
    return {
      state: input.state,
      activation: null,
      candidate: null,
    };
  }

  return {
    state: input.state,
    activation: {
      activeEventId: candidate.eventId,
      taskInputs: candidate.taskInputs,
    },
    candidate,
  };
}

function matchesModFirstTriggerContext(
  binding: ModFirstEventBinding,
  triggerContext: ModFirstTriggerContext
): boolean {
  return (
    binding.owner.family === triggerContext.owner.family &&
    (binding.owner.id == null ||
      matchesModFirstBindingOwnerId(binding.owner, triggerContext.owner)) &&
    binding.trigger.timing === triggerContext.timing &&
    binding.trigger.action === triggerContext.action &&
    matchesModFirstTriggerExtra(binding.trigger.extra, triggerContext.payload)
  );
}

function matchesModFirstBindingOwnerId(
  owner: ModFirstEventBinding["owner"],
  triggerOwner: ModFirstTriggerContext["owner"]
): boolean {
  if (owner.id == null) {
    return true;
  }

  if (owner.family !== "building") {
    return owner.id === triggerOwner.id;
  }

  return matchesCanonicalBuildingOwnerId(owner.id, triggerOwner.id);
}

function matchesModFirstTriggerExtra(
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

function isModFirstOccurrenceAvailable(
  state: GameState,
  eventDefinition: Pick<ModFirstEventDefinition, "id" | "occurrence">
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

function evaluateModFirstBindingConditions(
  state: GameState,
  conditionGroup: ModFirstEventBindingConditionGroup | undefined
): boolean {
  if (conditionGroup == null) {
    return true;
  }

  if (conditionGroup.operator === "all") {
    return conditionGroup.conditions.every((conditionNode) =>
      evaluateModFirstBindingConditionNode(state, conditionNode)
    );
  }

  if (conditionGroup.operator === "any") {
    return conditionGroup.conditions.some((conditionNode) =>
      evaluateModFirstBindingConditionNode(state, conditionNode)
    );
  }

  return !conditionGroup.conditions.some((conditionNode) =>
    evaluateModFirstBindingConditionNode(state, conditionNode)
  );
}

function evaluateModFirstBindingConditionNode(
  state: GameState,
  conditionNode: ModFirstEventBindingConditionNode
): boolean {
  if (isModFirstBindingConditionGroup(conditionNode)) {
    return evaluateModFirstBindingConditions(state, conditionNode);
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
      compareValue(state.runtime.variables[key], operator, condition["value"])
    );
  }

  if (condition.type === "event-fired") {
    const eventId = readStringProperty(condition, "eventId");
    const expected = condition["expected"] ?? true;
    return (
      eventId != null &&
      ((state.runtime.eventHistory[eventId]?.firedCount ?? 0) > 0) ===
        expected
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

function isModFirstBindingConditionGroup(
  value: ModFirstEventBindingConditionNode
): value is ModFirstEventBindingConditionGroup {
  return (
    "operator" in value &&
    (value.operator === "all" ||
      value.operator === "any" ||
      value.operator === "not") &&
    "conditions" in value &&
    Array.isArray(value.conditions)
  );
}

function toModFirstEventBindingRuntimeCandidate(
  binding: ModFirstEventBinding,
  eventDefinition: ModFirstEventDefinition
): ModFirstEventBindingRuntimeCandidate {
  return {
    bindingId: binding.id,
    eventId: eventDefinition.id,
    priority: binding.priority ?? 0,
    taskInputs: eventDefinition.taskInputs ?? [],
  };
}

function compareModFirstCandidates(
  leftCandidate: ModFirstEventBindingRuntimeCandidate,
  rightCandidate: ModFirstEventBindingRuntimeCandidate
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

function matchesCanonicalBuildingOwnerId(
  leftOwnerId: string | undefined,
  rightOwnerId: string | undefined
): boolean {
  if (leftOwnerId == null || rightOwnerId == null) {
    return leftOwnerId === rightOwnerId;
  }

  if (leftOwnerId === rightOwnerId) {
    return true;
  }

  if (
    (leftOwnerId === "home.template" &&
      /^home(?:_[0-9]+|\.[a-z0-9_]+)$/.test(rightOwnerId)) ||
    (rightOwnerId === "home.template" &&
      /^home(?:_[0-9]+|\.[a-z0-9_]+)$/.test(leftOwnerId))
  ) {
    return true;
  }

  const leftHouseTemplateFamily =
    /^house\.template\.([a-z0-9_]+)$/.exec(leftOwnerId)?.[1] ?? null;
  const rightHouseTemplateFamily =
    /^house\.template\.([a-z0-9_]+)$/.exec(rightOwnerId)?.[1] ?? null;
  const leftHouseSourceFamily =
    /^house\.([^.]+)\.([a-z0-9_]+)$/.exec(leftOwnerId)?.[2] ?? null;
  const rightHouseSourceFamily =
    /^house\.([^.]+)\.([a-z0-9_]+)$/.exec(rightOwnerId)?.[2] ?? null;

  return (
    (leftHouseTemplateFamily != null &&
      leftHouseTemplateFamily === rightHouseSourceFamily) ||
    (rightHouseTemplateFamily != null &&
      rightHouseTemplateFamily === leftHouseSourceFamily)
  );
}
