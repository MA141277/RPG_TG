import type {
  LocationAccessConditionExpression,
  LocationAccessValueRef,
} from "../domain/script-editor-location-access-contract";

export type LocationAccessConditionSourceFamily = "event" | "person" | "time";

export type ScriptEditorLocationAccessConditionFieldOption = {
  family: LocationAccessConditionSourceFamily;
  fieldId: string;
  label: string;
  valueType: "string" | "number" | "boolean";
};

type LocationAccessCompareCondition = Extract<
  LocationAccessConditionExpression,
  { type: "compare" }
>;

const FIELD_OPTIONS: ScriptEditorLocationAccessConditionFieldOption[] = [
  { family: "event", fieldId: "completed", label: "事件完成状态", valueType: "boolean" },
  { family: "person", fieldId: "stats.politics", label: "人物政务", valueType: "number" },
  { family: "time", fieldId: "year", label: "年份", valueType: "number" },
  { family: "time", fieldId: "month", label: "月份", valueType: "number" },
  { family: "time", fieldId: "day", label: "日期", valueType: "number" },
  { family: "time", fieldId: "timeOfDay", label: "时段", valueType: "string" },
];

export function listScriptEditorLocationAccessConditionFieldOptions(): ScriptEditorLocationAccessConditionFieldOption[] {
  return FIELD_OPTIONS.map((option) => ({ ...option }));
}

export function createDefaultScriptEditorLocationAccessCondition(): LocationAccessCompareCondition {
  return {
    type: "compare",
    left: { type: "field", subject: "event", entityId: "", fieldId: "completed" },
    operator: "equals",
    right: { type: "literal", value: true },
  };
}

export function normalizeScriptEditorLocationAccessConditionExpression(
  value: unknown
): LocationAccessConditionExpression | undefined {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const expression = value as Record<string, unknown>;
  if (expression.type === "literal" && typeof expression.value === "boolean") {
    return { type: "literal", value: expression.value };
  }
  if (expression.type === "compare") {
    const left = normalizeValueRef(expression.left);
    if (left == null) {
      return undefined;
    }
    const operator = normalizeCompareOperator(expression.operator);
    if (operator == null) {
      return undefined;
    }
    const right = normalizeValueRef(expression.right);
    return {
      type: "compare",
      left,
      operator,
      ...(right == null ? {} : { right }),
    };
  }
  if (expression.type === "all" || expression.type === "any") {
    const conditions = Array.isArray(expression.conditions)
      ? expression.conditions
          .map(normalizeScriptEditorLocationAccessConditionExpression)
          .filter((condition): condition is LocationAccessConditionExpression => condition != null)
      : [];
    if (conditions.length === 0) {
      return undefined;
    }
    return { type: expression.type, conditions };
  }
  if (expression.type === "not") {
    const condition = normalizeScriptEditorLocationAccessConditionExpression(
      expression.condition
    );
    return condition == null ? undefined : { type: "not", condition };
  }
  return undefined;
}

export function appendScriptEditorLocationAccessCondition(
  value: LocationAccessConditionExpression | undefined
): LocationAccessConditionExpression {
  const condition = createDefaultScriptEditorLocationAccessCondition();
  const normalized = normalizeScriptEditorLocationAccessConditionExpression(value);
  if (normalized == null) {
    return { type: "all", conditions: [condition] };
  }
  if (normalized.type === "all") {
    return { type: "all", conditions: [...normalized.conditions, condition] };
  }
  return { type: "all", conditions: [normalized, condition] };
}

export function removeScriptEditorLocationAccessCondition(
  value: LocationAccessConditionExpression | undefined,
  index: number
): LocationAccessConditionExpression | undefined {
  const conditions = readEditableConditions(value).filter(
    (_condition, conditionIndex) => conditionIndex !== index
  );
  return normalizeScriptEditorLocationAccessConditionExpression({
    type: "all",
    conditions,
  });
}

export function updateScriptEditorLocationAccessConditionField(
  value: LocationAccessConditionExpression | undefined,
  index: number,
  field:
    | "factor"
    | "eventId"
    | "eventState"
    | "personId"
    | "personField"
    | "timeField"
    | "operator"
    | "literalValue"
    | "sourceField",
  nextValue: string
): LocationAccessConditionExpression | undefined {
  const conditions = readEditableConditions(value);
  const current = conditions[index];
  const compareCondition =
    current?.type === "compare"
      ? current
      : createDefaultScriptEditorLocationAccessCondition();
  conditions[index] = updateCompareCondition(compareCondition, field, nextValue);
  return normalizeScriptEditorLocationAccessConditionExpression({
    type: "all",
    conditions,
  });
}

export function readEditableScriptEditorLocationAccessConditions(
  value: LocationAccessConditionExpression | undefined
): LocationAccessConditionExpression[] {
  return readEditableConditions(value);
}

function readEditableConditions(
  value: LocationAccessConditionExpression | undefined
): LocationAccessConditionExpression[] {
  const normalized = normalizeScriptEditorLocationAccessConditionExpression(value);
  if (normalized == null) {
    return [];
  }
  return normalized.type === "all" ? [...normalized.conditions] : [normalized];
}

function updateCompareCondition(
  condition: LocationAccessCompareCondition,
  field:
    | "factor"
    | "eventId"
    | "eventState"
    | "personId"
    | "personField"
    | "timeField"
    | "operator"
    | "literalValue"
    | "sourceField",
  nextValue: string
): LocationAccessCompareCondition {
  if (field === "sourceField") {
    const [family, fieldId] = nextValue.split(":");
    return createCompareForFamily(
      normalizeFamily(family),
      condition.left.type === "field" ? condition.left.entityId ?? "" : "",
      fieldId
    );
  }
  if (field === "factor") {
    return createCompareForFamily(normalizeFamily(nextValue));
  }
  if (field === "eventId") {
    return {
      ...condition,
      left: { type: "field", subject: "event", entityId: nextValue.trim(), fieldId: "completed" },
    };
  }
  if (field === "eventState") {
    return {
      ...condition,
      right: { type: "literal", value: nextValue !== "incomplete" },
    };
  }
  if (field === "personId") {
    const left = condition.left.type === "field" ? condition.left : null;
    return {
      ...condition,
      left: {
        type: "field",
        subject: "person",
        entityId: nextValue.trim(),
        fieldId: left?.subject === "person" ? left.fieldId : "stats.politics",
      },
    };
  }
  if (field === "personField") {
    const left = condition.left.type === "field" ? condition.left : null;
    return {
      ...condition,
      left: {
        type: "field",
        subject: "person",
        entityId: left?.subject === "person" ? left.entityId ?? "" : "",
        fieldId: nextValue.trim() || "stats.politics",
      },
    };
  }
  if (field === "timeField") {
    return {
      ...condition,
      left: {
        type: "field",
        subject: "time",
        fieldId: normalizeTimeField(nextValue),
      },
    };
  }
  if (field === "operator") {
    return {
      ...condition,
      operator: normalizeCompareOperator(nextValue) ?? "equals",
    };
  }
  return {
    ...condition,
    right: {
      type: "literal",
      value: coerceLiteralValue(nextValue, readValueType(condition.left)),
    },
  };
}

function createCompareForFamily(
  family: LocationAccessConditionSourceFamily,
  entityId = "",
  fieldId?: string
): LocationAccessCompareCondition {
  if (family === "person") {
    return {
      type: "compare",
      left: { type: "field", subject: "person", entityId, fieldId: fieldId || "stats.politics" },
      operator: "greater-than-or-equal",
      right: { type: "literal", value: 0 },
    };
  }
  if (family === "time") {
    return {
      type: "compare",
      left: { type: "field", subject: "time", fieldId: normalizeTimeField(fieldId) },
      operator: "greater-than-or-equal",
      right: { type: "literal", value: 0 },
    };
  }
  return {
    type: "compare",
    left: { type: "field", subject: "event", entityId, fieldId: "completed" },
    operator: "equals",
    right: { type: "literal", value: true },
  };
}

function normalizeValueRef(value: unknown): LocationAccessValueRef | undefined {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const ref = value as Record<string, unknown>;
  if (ref.type === "literal") {
    return { type: "literal", value: ref.value };
  }
  if (
    ref.type === "field" &&
    isConditionSubject(ref.subject) &&
    typeof ref.fieldId === "string"
  ) {
    return {
      type: "field",
      subject: ref.subject,
      fieldId: ref.fieldId,
      ...(typeof ref.entityId === "string" ? { entityId: ref.entityId } : {}),
    };
  }
  return undefined;
}

function isConditionSubject(
  value: unknown
): value is Extract<LocationAccessValueRef, { type: "field" }>["subject"] {
  return (
    value === "event" ||
    value === "person" ||
    value === "time" ||
    value === "targetCity" ||
    value === "targetBuilding" ||
    value === "player" ||
    value === "world" ||
    value === "story"
  );
}

function normalizeCompareOperator(
  value: unknown
): Extract<LocationAccessConditionExpression, { type: "compare" }>["operator"] | undefined {
  switch (value) {
    case "equals":
    case "not-equals":
    case "greater-than":
    case "greater-than-or-equal":
    case "less-than":
    case "less-than-or-equal":
    case "includes":
    case "exists":
      return value;
    default:
      return undefined;
  }
}

function normalizeFamily(value: unknown): LocationAccessConditionSourceFamily {
  return value === "person" || value === "time" ? value : "event";
}

function normalizeTimeField(value: unknown): string {
  return value === "month" || value === "day" || value === "timeOfDay"
    ? value
    : "year";
}

function readValueType(ref: LocationAccessValueRef): ScriptEditorLocationAccessConditionFieldOption["valueType"] {
  if (ref.type !== "field") {
    return "string";
  }
  if (ref.subject === "event") {
    return "boolean";
  }
  if (ref.subject === "time" && ref.fieldId === "timeOfDay") {
    return "string";
  }
  if (ref.subject === "time") {
    return "number";
  }
  return ref.fieldId === "personType" ||
    ref.fieldId === "role" ||
    ref.fieldId === "cityId" ||
    ref.fieldId === "houseId" ||
    ref.fieldId.startsWith("customProperties.")
    ? "string"
    : "number";
}

function coerceLiteralValue(
  value: string,
  valueType: ScriptEditorLocationAccessConditionFieldOption["valueType"]
): unknown {
  if (valueType === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (valueType === "boolean") {
    return value === "true" || value === "completed";
  }
  return value;
}
