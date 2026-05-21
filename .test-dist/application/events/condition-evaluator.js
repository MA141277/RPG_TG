"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateEventConditionNode = evaluateEventConditionNode;
function evaluateEventConditionNode(state, conditionNode, context) {
    if (conditionNode.type === "group") {
        if (conditionNode.operator === "all") {
            return conditionNode.conditions.every((childNode) => evaluateEventConditionNode(state, childNode, context));
        }
        if (conditionNode.operator === "any") {
            return conditionNode.conditions.some((childNode) => evaluateEventConditionNode(state, childNode, context));
        }
        return !conditionNode.conditions.some((childNode) => evaluateEventConditionNode(state, childNode, context));
    }
    return evaluateSingleEventCondition(state, conditionNode, context);
}
function evaluateSingleEventCondition(state, condition, context) {
    switch (condition.type) {
        case "flag":
            return state.runtime.flags[condition.key] === condition.expected;
        case "variable":
            return compareValue(state.runtime.variables[condition.key], condition.operator, condition.value);
        case "event-fired":
            return context.hasEventFired(condition.eventId) === (condition.expected ?? true);
        case "event-fired-count":
            return compareNumber(context.getEventFiredCount(condition.eventId), condition.operator, condition.value);
        case "months-since-event": {
            const monthsSinceEvent = context.getMonthsSinceEvent(condition.eventId);
            if (monthsSinceEvent == null) {
                return false;
            }
            return compareNumber(monthsSinceEvent, condition.operator, condition.value);
        }
        case "chapter":
            return state.calendar.chapterId === condition.chapterId;
        case "date":
            return compareDate(state, condition.operator, condition.value);
        case "location":
            return ((condition.cityId == null || state.world.currentCityId === condition.cityId) &&
                (condition.houseId == null || state.world.currentHouseId === condition.houseId));
        case "character-exists":
            return context.isCharacterAvailable(condition.characterId) === (condition.expected ?? true);
        case "character-available":
            return context.isCharacterAvailable(condition.characterId) === (condition.expected ?? true);
        case "character-in-clan":
            return context.isCharacterInClan(condition.characterId, condition.clanId);
        case "character-in-city":
            return context.isCharacterInCity(condition.characterId, condition.cityId);
        case "clan-exists":
            return context.doesClanExist(condition.clanId) === (condition.expected ?? true);
        case "clan-relation":
            return (context.getClanRelation(condition.leftClanId, condition.rightClanId) ===
                condition.relation);
        case "city-owner":
            return context.isCityOwnedByClan(condition.cityId, condition.clanId);
        case "mission-status":
            return context.getMissionStatus(condition.missionId) === condition.status;
        case "custom":
            return context.runCustomCondition(condition.handlerId, condition.payload, state);
        default:
            return false;
    }
}
function compareNumber(leftValue, operator, rightValue) {
    switch (operator) {
        case "==":
            return leftValue === rightValue;
        case "!=":
            return leftValue !== rightValue;
        case ">=":
            return leftValue >= rightValue;
        case "<=":
            return leftValue <= rightValue;
        case ">":
            return leftValue > rightValue;
        case "<":
            return leftValue < rightValue;
        default:
            return false;
    }
}
function compareValue(leftValue, operator, rightValue) {
    if (typeof leftValue === "number" && typeof rightValue === "number") {
        return compareNumber(leftValue, operator, rightValue);
    }
    if (typeof leftValue === "string" && typeof rightValue === "string") {
        switch (operator) {
            case "==":
                return leftValue === rightValue;
            case "!=":
                return leftValue !== rightValue;
            default:
                return false;
        }
    }
    return false;
}
function compareDate(state, operator, rightValue) {
    const leftDateNumber = state.calendar.year * 10000 + state.calendar.month * 100 + state.calendar.day;
    const rightDateNumber = rightValue.year * 10000 + (rightValue.month ?? 1) * 100 + (rightValue.day ?? 1);
    return compareNumber(leftDateNumber, operator, rightDateNumber);
}
