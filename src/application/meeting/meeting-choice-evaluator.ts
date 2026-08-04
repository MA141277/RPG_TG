import type { GameState } from "../../domain/game-state";
import type {
  MeetingChoiceConditionDefinition,
  MeetingChoiceDefinition,
} from "../../domain/meeting/meeting-choice-set";

function isNonEmptyText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function evaluateCondition(
  condition: MeetingChoiceConditionDefinition,
  gameState: GameState
): boolean {
  if (condition.type === "always") {
    return true;
  }

  if (condition.type === "flag-set") {
    return gameState.runtime.flags[condition.flagId] === true;
  }

  if (condition.type === "flag-equals") {
    return gameState.runtime.flags[condition.flagId] === condition.value;
  }

  const variableValue = gameState.runtime.variables[condition.variableId];
  if (condition.type === "variable-equals") {
    return variableValue === condition.value;
  }
  if (typeof variableValue !== "number" && typeof condition.value !== "number") {
    return false;
  }
  if (typeof variableValue !== "number" || typeof condition.value !== "number") {
    return false;
  }
  if (condition.type === "variable-gte") {
    return variableValue >= condition.value;
  }
  if (condition.type === "variable-lte") {
    return variableValue <= condition.value;
  }

  return false;
}

export function areMeetingChoiceConditionsSatisfied(
  choice: MeetingChoiceDefinition,
  gameState: GameState
): boolean {
  const conditions = choice.conditions ?? [];
  return conditions.every((condition) => evaluateCondition(condition, gameState));
}

export function getMeetingChoiceDisabledReason(
  choice: MeetingChoiceDefinition,
  gameState: GameState
): string | null {
  if (isNonEmptyText(choice.disabledHint)) {
    return choice.disabledHint ?? null;
  }

  if (!areMeetingChoiceConditionsSatisfied(choice, gameState)) {
    return "conditions-are-not-satisfied";
  }

  return null;
}

export function isMeetingChoiceSelectable(
  choice: MeetingChoiceDefinition,
  gameState: GameState
): boolean {
  return getMeetingChoiceDisabledReason(choice, gameState) == null;
}
