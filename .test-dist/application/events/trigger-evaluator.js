"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTriggeredEvents = selectTriggeredEvents;
const condition_evaluator_1 = require("./condition-evaluator");
const participant_resolver_1 = require("./participant-resolver");
function selectTriggeredEvents(state, eventDefinitions, input, context) {
    return eventDefinitions
        .filter((eventDefinition) => eventDefinition.trigger.timing === input.timing)
        .filter((eventDefinition) => matchesTriggerScope(eventDefinition, input))
        .filter((eventDefinition) => isOccurrenceAvailable(state, eventDefinition))
        .filter((eventDefinition) => eventDefinition.conditions.every((conditionNode) => (0, condition_evaluator_1.evaluateEventConditionNode)(state, conditionNode, context)))
        .filter((eventDefinition) => (0, participant_resolver_1.hasRequiredParticipants)(eventDefinition.participants, context))
        .sort((leftEvent, rightEvent) => (rightEvent.trigger.priority ?? 0) - (leftEvent.trigger.priority ?? 0));
}
function matchesTriggerScope(eventDefinition, input) {
    const triggerScope = eventDefinition.trigger.scope;
    if (triggerScope == null) {
        return true;
    }
    return ((triggerScope.cityId == null || triggerScope.cityId === input.cityId) &&
        (triggerScope.houseId == null || triggerScope.houseId === input.houseId) &&
        (triggerScope.characterId == null || triggerScope.characterId === input.characterId));
}
function isOccurrenceAvailable(state, eventDefinition) {
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
