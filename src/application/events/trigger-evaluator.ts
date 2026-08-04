import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { GameState } from "../../domain/game-state";
import {
  evaluateEventConditionNode,
  type EventConditionContext,
} from "./condition-evaluator";
import { hasRequiredParticipants, type ParticipantResolverContext } from "./participant-resolver";

export type TriggerEvaluationInput = {
  timing: EventTriggerTiming;
  cityId?: string;
  houseId?: string;
  characterId?: string;
};

export type TriggerEvaluatorContext = EventConditionContext & ParticipantResolverContext;

export function selectTriggeredEvents(
  state: GameState,
  eventDefinitions: readonly (EventDefinition | null | undefined)[],
  input: TriggerEvaluationInput,
  context: TriggerEvaluatorContext
): EventDefinition[] {
  return eventDefinitions
    .filter((eventDefinition): eventDefinition is EventDefinition => eventDefinition != null)
    .filter(
      (
        eventDefinition
      ): eventDefinition is EventDefinition & { trigger: NonNullable<EventDefinition["trigger"]> } =>
        eventDefinition.trigger != null
    )
    .filter((eventDefinition) => eventDefinition.trigger.timing === input.timing)
    .filter((eventDefinition) => matchesTriggerScope(eventDefinition, input))
    .filter((eventDefinition) =>
      isOccurrenceAvailable(state, eventDefinition)
    )
    .filter((eventDefinition) =>
      eventDefinition.conditions.every((conditionNode) =>
        evaluateEventConditionNode(state, conditionNode, context)
      )
    )
    .filter((eventDefinition) =>
      hasRequiredParticipants(eventDefinition.participants, context)
    )
    .sort(
      (leftEvent, rightEvent) =>
        (rightEvent.trigger.priority ?? 0) - (leftEvent.trigger.priority ?? 0)
    );
}

function matchesTriggerScope(
  eventDefinition: EventDefinition,
  input: TriggerEvaluationInput
): boolean {
  const triggerScope = eventDefinition.trigger.scope;

  if (triggerScope == null) {
    return true;
  }

  return (
    (triggerScope.cityId == null || triggerScope.cityId === input.cityId) &&
    (triggerScope.houseId == null || triggerScope.houseId === input.houseId) &&
    (triggerScope.characterId == null || triggerScope.characterId === input.characterId)
  );
}

function isOccurrenceAvailable(state: GameState, eventDefinition: EventDefinition): boolean {
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
