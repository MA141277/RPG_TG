import type { CharacterDefinition, CharacterId } from "../../domain/character";
import type { CityDefinition } from "../../domain/city";
import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import type {
  LocationAccessConditionExpression,
  LocationAccessDefinition,
  LocationAccessResult,
  LocationAccessTargetFamily,
  LocationAccessValueRef,
} from "../../domain/location-access";
import { readZhuYuanzhangStoryStage } from "../../domain/zhu-yuanzhang-story";

export type EvaluateLocationAccessInput = {
  state: GameState;
  targetFamily: LocationAccessTargetFamily;
  targetId: string;
  targetCity?: CityDefinition | null;
  targetBuilding?: Pick<HouseDefinition, "id" | "cityId" | "name"> | null;
  characterDefinitions?: readonly CharacterDefinition[];
  locationAccessDefinitions?: readonly LocationAccessDefinition[];
};

export function evaluateLocationAccess(
  input: EvaluateLocationAccessInput
): LocationAccessResult {
  const accessDefinition = input.locationAccessDefinitions?.find(
    (definition) =>
      definition.targetFamily === input.targetFamily &&
      definition.targetId === input.targetId
  );
  if (accessDefinition == null) {
    return { canEnter: true, refusal: null };
  }

  if (evaluateConditionExpression(accessDefinition.conditionExpression, input)) {
    return { canEnter: true, refusal: null };
  }

  return {
    canEnter: false,
    refusal: {
      ruleId: accessDefinition.id,
      speakerCharacterId: resolveSpeakerCharacterId(
        input.state,
        accessDefinition.blockedSpeakerId
      ),
      title: resolveRefusalTitle(accessDefinition, input),
      text:
        accessDefinition.blockedMessage ??
        accessDefinition.blockedReason ??
        "This location is not available.",
      confirmLabel: accessDefinition.guidance ?? "Return",
    },
  };
}

function evaluateConditionExpression(
  expression: LocationAccessConditionExpression,
  input: EvaluateLocationAccessInput
): boolean {
  switch (expression.type) {
    case "literal":
      return expression.value;
    case "compare":
      return evaluateCompareExpression(expression, input);
    case "all":
      return expression.conditions.every((condition) =>
        evaluateConditionExpression(condition, input)
      );
    case "any":
      return expression.conditions.some((condition) =>
        evaluateConditionExpression(condition, input)
      );
    case "not":
      return !evaluateConditionExpression(expression.condition, input);
  }
}

function evaluateCompareExpression(
  expression: Extract<LocationAccessConditionExpression, { type: "compare" }>,
  input: EvaluateLocationAccessInput
): boolean {
  const left = resolveValueRef(expression.left, input);
  const right =
    expression.right == null ? undefined : resolveValueRef(expression.right, input);

  switch (expression.operator) {
    case "equals":
      return left === right;
    case "not-equals":
      return left !== right;
    case "greater-than":
      return compareOrdered(left, right, (leftValue, rightValue) => leftValue > rightValue);
    case "greater-than-or-equal":
      return compareOrdered(left, right, (leftValue, rightValue) => leftValue >= rightValue);
    case "less-than":
      return compareOrdered(left, right, (leftValue, rightValue) => leftValue < rightValue);
    case "less-than-or-equal":
      return compareOrdered(left, right, (leftValue, rightValue) => leftValue <= rightValue);
    case "includes":
      return includesValue(left, right);
    case "exists":
      return left != null && left !== "";
  }
}

function compareOrdered(
  left: unknown,
  right: unknown,
  compare: (leftValue: number | string, rightValue: number | string) => boolean
): boolean {
  if (
    (typeof left === "number" && typeof right === "number") ||
    (typeof left === "string" && typeof right === "string")
  ) {
    return compare(left, right);
  }
  return false;
}

function includesValue(left: unknown, right: unknown): boolean {
  if (Array.isArray(left)) {
    return left.includes(right);
  }
  if (typeof left === "string" && typeof right === "string") {
    return left.includes(right);
  }
  return false;
}

function resolveValueRef(
  valueRef: LocationAccessValueRef,
  input: EvaluateLocationAccessInput
): unknown {
  if (valueRef.type === "literal") {
    return valueRef.value;
  }

  switch (valueRef.subject) {
    case "targetCity":
      return readField(input.targetCity, valueRef.fieldId);
    case "targetBuilding":
      return readField(input.targetBuilding, valueRef.fieldId);
    case "event":
      return readEventField(input.state, valueRef.entityId, valueRef.fieldId);
    case "person":
      return readPersonField(input, valueRef.entityId, valueRef.fieldId);
    case "time":
      return readTimeField(input.state, valueRef.fieldId);
    case "player":
      return readField(input.state.player, valueRef.fieldId);
    case "world":
      return readWorldField(input.state, valueRef.fieldId);
    case "story":
      return readStoryField(input.state, valueRef.fieldId);
  }
}

function readWorldField(state: GameState, fieldId: string): unknown {
  if (fieldId === "chapterId") {
    return state.calendar.chapterId;
  }
  return readField(state.world, fieldId);
}

function readEventField(
  state: GameState,
  eventId: string | undefined,
  fieldId: string
): unknown {
  if (eventId == null || eventId.length === 0) {
    return undefined;
  }
  const history = state.runtime.eventHistory[eventId];
  if (fieldId === "completed") {
    return (history?.firedCount ?? 0) > 0;
  }
  if (fieldId === "firedCount") {
    return history?.firedCount ?? 0;
  }
  return readField(history, fieldId);
}

function readPersonField(
  input: EvaluateLocationAccessInput,
  personId: string | undefined,
  fieldId: string
): unknown {
  const resolvedPersonId =
    personId != null && personId.length > 0
      ? personId
      : input.state.player.characterId;
  const person = input.characterDefinitions?.find(
    (definition) => definition.id === resolvedPersonId
  );
  return readField(person, fieldId);
}

function readTimeField(state: GameState, fieldId: string): unknown {
  if (fieldId === "timeOfDay") {
    return state.world.timeOfDay;
  }
  return readField(state.calendar, fieldId);
}

function readStoryField(state: GameState, fieldId: string): unknown {
  if (fieldId === "zhuYuanzhangStage") {
    return readZhuYuanzhangStoryStage(state);
  }
  if (fieldId.startsWith("flag:")) {
    return state.runtime.flags[fieldId.slice("flag:".length)] === true;
  }
  if (fieldId === "chapterId") {
    return state.calendar.chapterId;
  }
  return readField(state.dialogue, fieldId);
}

function readField(value: unknown, fieldId: string): unknown {
  return fieldId.split(".").reduce<unknown>((currentValue, segment) => {
    if (
      currentValue == null ||
      typeof currentValue !== "object" ||
      Array.isArray(currentValue)
    ) {
      return undefined;
    }
    return (currentValue as Record<string, unknown>)[segment];
  }, value);
}

function resolveSpeakerCharacterId(
  state: GameState,
  speakerCharacterId: CharacterId | "player" | undefined
): CharacterId {
  if (speakerCharacterId == null || speakerCharacterId === "player") {
    return state.player.characterId;
  }
  return speakerCharacterId;
}

function resolveRefusalTitle(
  accessDefinition: LocationAccessDefinition,
  input: EvaluateLocationAccessInput
): string {
  return (
    accessDefinition.blockedTitle ??
    input.targetCity?.name ??
    input.targetBuilding?.name ??
    input.targetId
  );
}
