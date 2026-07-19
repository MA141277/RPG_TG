import type {
  LocationAccessConditionExpression,
  LocationAccessConditionSubject,
  LocationAccessValueRef,
} from "../../domain/location-access";

export type LocationAccessConditionSourceFamily = Exclude<
  LocationAccessConditionSubject,
  "story"
>;

export type ScriptEditorLocationAccessConditionFieldOption = {
  family: LocationAccessConditionSourceFamily;
  fieldId: string;
  label: string;
  valueType: "string" | "number" | "boolean" | "string-list";
};

const FIELD_OPTIONS: ScriptEditorLocationAccessConditionFieldOption[] = [
  { family: "world", fieldId: "chapterId", label: "章节", valueType: "string" },
  { family: "world", fieldId: "currentMapId", label: "当前地图", valueType: "string" },
  { family: "world", fieldId: "currentCityId", label: "当前城市", valueType: "string" },
  { family: "world", fieldId: "currentHouseId", label: "当前建筑", valueType: "string" },
  { family: "world", fieldId: "timeOfDay", label: "时段", valueType: "string" },
  { family: "targetCity", fieldId: "id", label: "城市 ID", valueType: "string" },
  { family: "targetCity", fieldId: "name", label: "城市名称", valueType: "string" },
  { family: "targetCity", fieldId: "regionId", label: "区域", valueType: "string" },
  { family: "targetCity", fieldId: "mapNodeId", label: "地图节点", valueType: "string" },
  { family: "targetCity", fieldId: "backgroundId", label: "默认背景", valueType: "string" },
  { family: "targetCity", fieldId: "travelCost", label: "通行成本", valueType: "number" },
  { family: "targetCity", fieldId: "prosperity", label: "繁荣", valueType: "number" },
  { family: "targetCity", fieldId: "danger", label: "危险", valueType: "number" },
  { family: "targetCity", fieldId: "tags", label: "标签", valueType: "string-list" },
  { family: "targetCity", fieldId: "specialDemand", label: "特产需求", valueType: "string-list" },
  { family: "targetCity", fieldId: "houseIds", label: "建筑列表", valueType: "string-list" },
  { family: "targetBuilding", fieldId: "id", label: "建筑 ID", valueType: "string" },
  { family: "targetBuilding", fieldId: "cityId", label: "所属城市", valueType: "string" },
  { family: "targetBuilding", fieldId: "name", label: "建筑名称", valueType: "string" },
  { family: "targetBuilding", fieldId: "backgroundId", label: "默认背景", valueType: "string" },
  { family: "targetBuilding", fieldId: "type", label: "建筑类型", valueType: "string" },
  { family: "targetBuilding", fieldId: "level", label: "等级", valueType: "number" },
  { family: "targetBuilding", fieldId: "damaged", label: "损毁", valueType: "boolean" },
  {
    family: "targetBuilding",
    fieldId: "outputMultiplier",
    label: "产出倍率",
    valueType: "number",
  },
  {
    family: "targetBuilding",
    fieldId: "activityLocationId",
    label: "活动地点",
    valueType: "string",
  },
  {
    family: "targetBuilding",
    fieldId: "requiresPlayerCurrentCityMatch",
    label: "要求玩家在同城",
    valueType: "boolean",
  },
  {
    family: "targetBuilding",
    fieldId: "enterableStoryStages",
    label: "可进入阶段",
    valueType: "string-list",
  },
  {
    family: "targetBuilding",
    fieldId: "visibleStoryStages",
    label: "可见阶段",
    valueType: "string-list",
  },
  { family: "targetBuilding", fieldId: "characterIds", label: "人物列表", valueType: "string-list" },
  { family: "player", fieldId: "characterId", label: "当前角色", valueType: "string" },
];

export function listScriptEditorLocationAccessConditionFieldOptions(): ScriptEditorLocationAccessConditionFieldOption[] {
  return FIELD_OPTIONS.map((option) => ({ ...option }));
}

export function createDefaultScriptEditorLocationAccessCondition(): LocationAccessConditionExpression {
  const firstOption = getDefaultFieldOption();
  return {
    type: "compare",
    left: createFieldRef(firstOption.family, firstOption.fieldId),
    operator: "equals",
    right: { type: "literal", value: "" },
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
    if (left == null || left.type !== "field" || !isSupportedField(left)) {
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
  field: "sourceField" | "operator" | "literalValue",
  nextValue: string
): LocationAccessConditionExpression | undefined {
  const conditions = readEditableConditions(value);
  const current = conditions[index];
  if (current == null || current.type !== "compare") {
    return normalizeScriptEditorLocationAccessConditionExpression({
      type: "all",
      conditions,
    });
  }
  const nextCondition = updateCompareCondition(current, field, nextValue);
  conditions[index] = nextCondition;
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
  condition: Extract<LocationAccessConditionExpression, { type: "compare" }>,
  field: "sourceField" | "operator" | "literalValue",
  nextValue: string
): Extract<LocationAccessConditionExpression, { type: "compare" }> {
  if (field === "sourceField") {
    const option = FIELD_OPTIONS.find(
      (entry) => `${entry.family}:${entry.fieldId}` === nextValue
    ) ?? getDefaultFieldOption();
    return {
      ...condition,
      left: createFieldRef(option.family, option.fieldId),
    };
  }
  if (field === "operator") {
    return {
      ...condition,
      operator: normalizeCompareOperator(nextValue) ?? "equals",
    };
  }
  const left = condition.left.type === "field" ? condition.left : null;
  const option =
    left == null
      ? getDefaultFieldOption()
      : FIELD_OPTIONS.find(
          (entry) => entry.family === left.subject && entry.fieldId === left.fieldId
        ) ?? getDefaultFieldOption();
  return {
    ...condition,
    right: {
      type: "literal",
      value: coerceLiteralValue(nextValue, option.valueType),
    },
  };
}

function getDefaultFieldOption(): ScriptEditorLocationAccessConditionFieldOption {
  const option = FIELD_OPTIONS[0];
  if (option == null) {
    throw new Error("Location access condition field registry is empty.");
  }
  return option;
}

function createFieldRef(
  subject: LocationAccessConditionSourceFamily,
  fieldId: string
): LocationAccessValueRef {
  return { type: "field", subject, fieldId };
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
    isConditionFamily(ref.subject) &&
    typeof ref.fieldId === "string"
  ) {
    return { type: "field", subject: ref.subject, fieldId: ref.fieldId };
  }
  return undefined;
}

function isConditionFamily(value: unknown): value is LocationAccessConditionSourceFamily {
  return (
    value === "world" ||
    value === "targetCity" ||
    value === "targetBuilding" ||
    value === "player"
  );
}

function isSupportedField(value: Extract<LocationAccessValueRef, { type: "field" }>): boolean {
  return FIELD_OPTIONS.some(
    (option) => option.family === value.subject && option.fieldId === value.fieldId
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

function coerceLiteralValue(
  value: string,
  valueType: ScriptEditorLocationAccessConditionFieldOption["valueType"]
): unknown {
  if (valueType === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (valueType === "boolean") {
    return value === "true";
  }
  return value;
}
