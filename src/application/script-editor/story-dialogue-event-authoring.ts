import type {
  ScriptEditorDialogueFollowUp,
  ScriptEditorDialogueFollowUpTargetFamily,
  ScriptEditorDialogueNodeRecord,
  ScriptEditorDialogueNodeType,
  ScriptEditorDialogueRecord,
  ScriptEditorConditionComparisonOperator,
  ScriptEditorConditionGroupOperator,
  ScriptEditorEventDestination,
  ScriptEditorEventDestinationFamily,
  ScriptEditorEventBindingRecord,
  ScriptEditorEventRecord,
  ScriptEditorEventTriggerTiming,
  ScriptEditorStoryNodeRecord,
  ScriptEditorStoryProgressMode,
} from "../../domain/script-editor-project";

export const SCRIPT_EDITOR_STORY_PROGRESS_MODES: readonly ScriptEditorStoryProgressMode[] = [
  "block",
  "wait",
  "force-close",
] as const;

export const SCRIPT_EDITOR_DIALOGUE_NODE_TYPES: readonly ScriptEditorDialogueNodeType[] = [
  "narration",
  "dialogue",
  "choice",
] as const;

export const SCRIPT_EDITOR_DIALOGUE_FOLLOWUP_FAMILIES: readonly ScriptEditorDialogueFollowUpTargetFamily[] = [
  "dialogue",
  "event",
  "city",
  "building",
  "minigame",
] as const;

export const SCRIPT_EDITOR_EVENT_TRIGGER_TIMINGS: readonly ScriptEditorEventTriggerTiming[] = [
  "manual",
  "city-enter",
  "building-enter",
  "dialogue-finished",
  "story-progress",
] as const;

export const SCRIPT_EDITOR_EVENT_BINDING_CONDITION_GROUP_OPERATORS: readonly ScriptEditorConditionGroupOperator[] = [
  "all",
  "any",
  "not",
] as const;

export type ScriptEditorEventBindingConditionType =
  | "flag"
  | "variable"
  | "expression"
  | "custom"
  | "binding-context";

export type ScriptEditorEventBindingConditionSourceFamily =
  | "flag"
  | "variable"
  | "person"
  | "city"
  | "building"
  | "payload"
  | "binding-context"
  | "resolver"
  | "custom";

export type ScriptEditorEventBindingConditionValueType =
  | "boolean"
  | "number"
  | "string"
  | "enum"
  | "json";

export type ScriptEditorEventBindingConditionOperator =
  | ScriptEditorConditionComparisonOperator
  | "contains";

export type ScriptEditorEventBindingConditionFieldOption = {
  sourceFamily: ScriptEditorEventBindingConditionSourceFamily;
  path: string;
  label: string;
  valueType: ScriptEditorEventBindingConditionValueType;
  resolverId?: string;
  enumOptions?: readonly {
    value: string;
    label: string;
  }[];
};

const SCRIPT_EDITOR_EVENT_BINDING_CONDITION_FIELD_OPTIONS: readonly ScriptEditorEventBindingConditionFieldOption[] = [
  {
    sourceFamily: "flag",
    path: "story.ready",
    label: "剧情就绪标记",
    valueType: "boolean",
  },
  {
    sourceFamily: "flag",
    path: "event.completed",
    label: "事件完成标记",
    valueType: "boolean",
  },
  {
    sourceFamily: "variable",
    path: "story.progress",
    label: "剧情进度",
    valueType: "number",
  },
  {
    sourceFamily: "variable",
    path: "player.reputation",
    label: "主角声望",
    valueType: "number",
  },
  {
    sourceFamily: "person",
    path: "person.base.force",
    label: "人物武力",
    valueType: "number",
  },
  {
    sourceFamily: "person",
    path: "person.base.intelligence",
    label: "人物智谋",
    valueType: "number",
  },
  {
    sourceFamily: "person",
    path: "person.base.politics",
    label: "人物政务",
    valueType: "number",
  },
  {
    sourceFamily: "person",
    path: "person.custom.*",
    label: "人物自定义属性",
    valueType: "string",
  },
  {
    sourceFamily: "city",
    path: "city.base.prosperity",
    label: "城市繁荣",
    valueType: "number",
  },
  {
    sourceFamily: "city",
    path: "city.custom.*",
    label: "城市自定义属性",
    valueType: "string",
  },
  {
    sourceFamily: "building",
    path: "building.base.cityId",
    label: "建筑所属城市",
    valueType: "string",
  },
  {
    sourceFamily: "building",
    path: "building.custom.*",
    label: "建筑自定义属性",
    valueType: "string",
  },
  {
    sourceFamily: "payload",
    path: "payload.*",
    label: "触发载荷字段",
    valueType: "string",
  },
  {
    sourceFamily: "binding-context",
    path: "trigger.action",
    label: "触发动作",
    valueType: "enum",
    resolverId: "script-editor.trigger-action",
    enumOptions: [
      { value: "story-progress", label: "剧情推进" },
      { value: "city-enter", label: "进入城市" },
      { value: "building-enter", label: "进入建筑" },
      { value: "dialogue-finished", label: "对话结束" },
      { value: "menu-select", label: "菜单选择" },
      { value: "minigame-settled", label: "小游戏结算" },
      { value: "custom", label: "自定义触发" },
    ],
  },
  {
    sourceFamily: "binding-context",
    path: "owner.family",
    label: "绑定对象类型",
    valueType: "enum",
    resolverId: "script-editor.owner-family",
    enumOptions: [
      { value: "person", label: "人物" },
      { value: "city", label: "城市" },
      { value: "building", label: "建筑" },
      { value: "dialogue", label: "对话" },
      { value: "minigame", label: "小游戏" },
      { value: "story", label: "剧情节点" },
    ],
  },
  {
    sourceFamily: "binding-context",
    path: "owner.id",
    label: "绑定对象 ID",
    valueType: "string",
  },
] as const;

export function listScriptEditorEventBindingConditionFieldOptions(): readonly ScriptEditorEventBindingConditionFieldOption[] {
  return SCRIPT_EDITOR_EVENT_BINDING_CONDITION_FIELD_OPTIONS;
}

export const SCRIPT_EDITOR_CONDITION_NODE_TYPES = [
  "flag",
  "variable",
  "task-status",
  "signal",
  "elapsed-time",
  "event-fired",
  "chapter",
  "location",
  "character-exists",
  "character-available",
  "character-in-city",
  "mission-status",
] as const;

export const SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES: readonly ScriptEditorEventDestinationFamily[] = [
  "dialogue",
  "event",
  "minigame",
] as const;

export function createDefaultScriptEditorStoryNodeRecord(index: number): ScriptEditorStoryNodeRecord {
  const suffix = index + 1;
  return {
    id: `story-node.new.${suffix}`,
    title: `剧情段 ${suffix}`,
    chapterId: `chapter.${suffix}`,
    summary: "",
    progressMode: "block",
    relatedPersonIds: [],
    relatedDialogueIds: [],
    relatedEventIds: [],
  };
}

export function createDefaultScriptEditorDialogueRecord(index: number): ScriptEditorDialogueRecord {
  const suffix = index + 1;
  return {
    id: `dialogue.new.${suffix}`,
    title: `对话 ${suffix}`,
    storyNodeId: "",
    participantPersonIds: [],
    nodes: [createDefaultDialogueNode(0)],
    followUps: [],
  };
}

export function createDefaultScriptEditorEventRecord(index: number): ScriptEditorEventRecord {
  const suffix = index + 1;
  return {
    id: `event.new.${suffix}`,
    title: `事件 ${suffix}`,
    description: "",
    triggerTiming: "manual",
    repeatable: false,
    nextEventId: "",
    destination: {
      family: "dialogue",
      targetId: "",
    },
    relations: {
      storyNodeId: "",
      personIds: [],
      cityIds: [],
      buildingIds: [],
    },
    previewSummary: {
      previewNotes: "",
      validationNotes: "",
    },
  };
}

export function createDefaultScriptEditorEventBindingRecord(
  index: number
): ScriptEditorEventBindingRecord {
  const suffix = index + 1;
  return {
    id: `event-binding.new.${suffix}`,
    eventId: "",
    owner: {
      family: "manual",
      id: "",
    },
    trigger: {
      timing: "manual",
      action: "manual",
    },
    priority: 0,
    enabled: true,
  };
}

export function normalizeScriptEditorStoryNodeRecord(
  record: Partial<ScriptEditorStoryNodeRecord> & { id: string }
): ScriptEditorStoryNodeRecord {
  return {
    ...record,
    title: normalizeString(record.title, record.id),
    chapterId: normalizeOptionalString(record.chapterId),
    summary: normalizeOptionalString(record.summary),
    progressMode: normalizeStoryProgressMode(record.progressMode),
    relatedPersonIds: normalizeStringArray(record.relatedPersonIds),
    relatedDialogueIds: normalizeStringArray(record.relatedDialogueIds),
    relatedEventIds: normalizeStringArray(record.relatedEventIds),
  };
}

export function normalizeScriptEditorDialogueRecord(
  record: Partial<ScriptEditorDialogueRecord> & { id: string }
): ScriptEditorDialogueRecord {
  return {
    ...record,
    title: normalizeString(record.title, record.id),
    storyNodeId: normalizeOptionalString(record.storyNodeId),
    participantPersonIds: normalizeStringArray(record.participantPersonIds),
    nodes: (record.nodes ?? []).map(normalizeDialogueNodeRecord),
    followUps: (record.followUps ?? []).map(normalizeDialogueFollowUp),
  };
}

export function normalizeScriptEditorEventRecord(
  record: Partial<ScriptEditorEventRecord> & { id: string }
): ScriptEditorEventRecord {
  return {
    ...record,
    title: normalizeString(record.title, record.id),
    description: normalizeOptionalString(record.description),
    chapterId: normalizeOptionalString(record.chapterId),
    occurrence: normalizeEventOccurrence(record.occurrence),
    entrySceneId: normalizeOptionalString(record.entrySceneId),
    participants: Array.isArray(record.participants)
      ? record.participants
      : [],
    tags: normalizeStringArray(record.tags),
    triggerTiming: normalizeEventTriggerTiming(record.triggerTiming),
    repeatable: record.repeatable === true,
    nextEventId: normalizeOptionalString(record.nextEventId),
    destination: normalizeEventDestination(record.destination),
    relations: {
      storyNodeId: normalizeOptionalString(record.relations?.storyNodeId),
      personIds: normalizeStringArray(record.relations?.personIds),
      cityIds: normalizeStringArray(record.relations?.cityIds),
      buildingIds: normalizeStringArray(record.relations?.buildingIds),
    },
    previewSummary: {
      previewNotes: normalizeOptionalString(record.previewSummary?.previewNotes),
      validationNotes: normalizeOptionalString(record.previewSummary?.validationNotes),
    },
  };
}

function normalizeEventOccurrence(value: unknown): NonNullable<ScriptEditorEventRecord["occurrence"]> {
  return value === "repeatable" || value === "once-per-chapter" ? value : "once";
}

export function normalizeScriptEditorEventBindingRecord(
  record: Partial<ScriptEditorEventBindingRecord> & { id: string }
): ScriptEditorEventBindingRecord {
  const payloadSchemaId = normalizeOptionalTrimmedString(
    record.trigger?.payloadSchemaId
  );
  const conditions = normalizeEventBindingConditions(record.conditions);
  const normalizedConditions =
    conditions == null || conditions.conditions.length === 0 ? null : conditions;
  const { conditions: _ignoredConditions, ...recordWithoutConditions } = record;
  return {
    ...recordWithoutConditions,
    id: normalizeString(record.id, "event-binding.unknown"),
    eventId: normalizeOptionalTrimmedString(record.eventId),
    owner: {
      ...(record.owner ?? {}),
      family: normalizeString(record.owner?.family, "manual"),
      id: normalizeOptionalTrimmedString(record.owner?.id),
    },
    trigger: {
      ...(record.trigger ?? {}),
      timing: normalizeString(record.trigger?.timing, "manual"),
      action: normalizeString(record.trigger?.action, "manual"),
      ...(payloadSchemaId.length === 0 ? {} : { payloadSchemaId }),
    },
    priority:
      typeof record.priority === "number" && Number.isFinite(record.priority)
        ? record.priority
        : 0,
    enabled: record.enabled !== false,
    ...(normalizedConditions == null ? {} : { conditions: normalizedConditions }),
  };
}

export function updateScriptEditorEventBindingField(
  record: ScriptEditorEventBindingRecord,
  field: "eventId" | "priority" | "enabled",
  value: string | boolean
): ScriptEditorEventBindingRecord {
  if (field === "priority") {
    const priority = typeof value === "number" ? value : Number(String(value).trim());
    return {
      ...record,
      priority: Number.isFinite(priority) ? priority : 0,
    };
  }
  if (field === "enabled") {
    return { ...record, enabled: value === true };
  }
  return { ...record, eventId: String(value).trim() };
}

export function updateScriptEditorEventBindingOwnerField(
  record: ScriptEditorEventBindingRecord,
  field: "family" | "id",
  value: string
): ScriptEditorEventBindingRecord {
  return {
    ...record,
    owner: {
      ...record.owner,
      [field]: value.trim(),
    },
  };
}

export function updateScriptEditorEventBindingTriggerField(
  record: ScriptEditorEventBindingRecord,
  field: "timing" | "action",
  value: string
): ScriptEditorEventBindingRecord {
  if (field === "timing" && value.includes(":")) {
    const [timing = "", action = ""] = value.split(":", 2);
    return {
      ...record,
      trigger: {
        ...record.trigger,
        timing: timing.trim(),
        action: action.trim(),
      },
    };
  }
  return {
    ...record,
    trigger: {
      ...record.trigger,
      [field]: value.trim(),
    },
  };
}

export function updateScriptEditorEventBindingConditionOperator(
  record: ScriptEditorEventBindingRecord,
  value: string
): ScriptEditorEventBindingRecord {
  const conditions = ensureEventBindingConditions(record);
  return {
    ...record,
    conditions: {
      ...conditions,
      operator: normalizeConditionGroupMode(value),
    },
  };
}

export function appendScriptEditorEventBindingConditionItem(
  record: ScriptEditorEventBindingRecord,
  type: ScriptEditorEventBindingConditionType = "flag"
): ScriptEditorEventBindingRecord {
  const conditions = ensureEventBindingConditions(record);
  return {
    ...record,
    conditions: {
      ...conditions,
      conditions: [
        ...conditions.conditions,
        createDefaultEventBindingConditionItem(type),
      ],
    },
  };
}

export function removeScriptEditorEventBindingConditionItem(
  record: ScriptEditorEventBindingRecord,
  index: number
): ScriptEditorEventBindingRecord {
  const conditions = ensureEventBindingConditions(record);
  const nextConditions = conditions.conditions.filter(
    (_, itemIndex) => itemIndex !== index
  );
  const { conditions: _ignoredConditions, ...recordWithoutConditions } = record;
  return {
    ...recordWithoutConditions,
    ...(nextConditions.length === 0
      ? {}
      : {
          conditions: {
            ...conditions,
            conditions: nextConditions,
          },
        }),
  };
}

export function updateScriptEditorEventBindingConditionItemField(
  record: ScriptEditorEventBindingRecord,
  index: number,
  field:
    | "type"
    | "sourceFamily"
    | "field"
    | "operator"
    | "value"
    | "valueType"
    | "resolverId"
    | "handlerId"
    | "payload",
  value: string
): ScriptEditorEventBindingRecord {
  const conditions = ensureEventBindingConditions(record);
  return {
    ...record,
    conditions: {
      ...conditions,
      conditions: conditions.conditions.map((condition, itemIndex) =>
        itemIndex === index
          ? updateEventBindingConditionItemField(condition, field, value)
          : condition
      ),
    },
  };
}

export function updateScriptEditorStoryNodeField(
  record: ScriptEditorStoryNodeRecord,
  field: "id" | "title" | "chapterId" | "summary" | "progressMode",
  value: string
): ScriptEditorStoryNodeRecord {
  if (field === "progressMode") {
    return { ...record, progressMode: normalizeStoryProgressMode(value) };
  }
  if (field === "summary") {
    return { ...record, summary: value };
  }
  return { ...record, [field]: value.trim() };
}

export function appendScriptEditorStoryNodeRelation(
  record: ScriptEditorStoryNodeRecord,
  field: "relatedPersonIds" | "relatedDialogueIds" | "relatedEventIds"
): ScriptEditorStoryNodeRecord {
  return {
    ...record,
    [field]: [...(record[field] ?? []), ""],
  };
}

export function updateScriptEditorStoryNodeRelation(
  record: ScriptEditorStoryNodeRecord,
  field: "relatedPersonIds" | "relatedDialogueIds" | "relatedEventIds",
  index: number,
  value: string
): ScriptEditorStoryNodeRecord {
  return {
    ...record,
    [field]: (record[field] ?? []).map((entry, entryIndex) =>
      entryIndex === index ? value.trim() : entry
    ),
  };
}

export function removeScriptEditorStoryNodeRelation(
  record: ScriptEditorStoryNodeRecord,
  field: "relatedPersonIds" | "relatedDialogueIds" | "relatedEventIds",
  index: number
): ScriptEditorStoryNodeRecord {
  return {
    ...record,
    [field]: (record[field] ?? []).filter((_, entryIndex) => entryIndex !== index),
  };
}

export function updateScriptEditorDialogueField(
  record: ScriptEditorDialogueRecord,
  field: "id" | "title" | "storyNodeId",
  value: string
): ScriptEditorDialogueRecord {
  return {
    ...record,
    [field]: value.trim(),
  };
}

export function appendScriptEditorDialogueParticipant(
  record: ScriptEditorDialogueRecord
): ScriptEditorDialogueRecord {
  return {
    ...record,
    participantPersonIds: [...(record.participantPersonIds ?? []), ""],
  };
}

export function updateScriptEditorDialogueParticipant(
  record: ScriptEditorDialogueRecord,
  index: number,
  value: string
): ScriptEditorDialogueRecord {
  return {
    ...record,
    participantPersonIds: (record.participantPersonIds ?? []).map((entry, entryIndex) =>
      entryIndex === index ? value.trim() : entry
    ),
  };
}

export function removeScriptEditorDialogueParticipant(
  record: ScriptEditorDialogueRecord,
  index: number
): ScriptEditorDialogueRecord {
  return {
    ...record,
    participantPersonIds: (record.participantPersonIds ?? []).filter(
      (_, entryIndex) => entryIndex !== index
    ),
  };
}

export function appendScriptEditorDialogueNode(
  record: ScriptEditorDialogueRecord
): ScriptEditorDialogueRecord {
  return {
    ...record,
    nodes: [...(record.nodes ?? []), createDefaultDialogueNode(record.nodes?.length ?? 0)],
  };
}

export function updateScriptEditorDialogueNodeField(
  record: ScriptEditorDialogueRecord,
  index: number,
  field: keyof ScriptEditorDialogueNodeRecord,
  value: string
): ScriptEditorDialogueRecord {
  return {
    ...record,
    nodes: (record.nodes ?? []).map((node, nodeIndex) => {
      if (nodeIndex !== index) {
        return node;
      }
      if (field === "nodeType") {
        return {
          ...node,
          nodeType: normalizeDialogueNodeType(value),
        };
      }
      return {
        ...node,
        [field]: value.trim(),
      };
    }),
  };
}

export function removeScriptEditorDialogueNode(
  record: ScriptEditorDialogueRecord,
  index: number
): ScriptEditorDialogueRecord {
  return {
    ...record,
    nodes: (record.nodes ?? []).filter((_, nodeIndex) => nodeIndex !== index),
  };
}

export function appendScriptEditorDialogueFollowUp(
  record: ScriptEditorDialogueRecord
): ScriptEditorDialogueRecord {
  return {
    ...record,
    followUps: [...(record.followUps ?? []), { targetFamily: "event", targetId: "" }],
  };
}

export function updateScriptEditorDialogueFollowUpField(
  record: ScriptEditorDialogueRecord,
  index: number,
  field: keyof ScriptEditorDialogueFollowUp,
  value: string
): ScriptEditorDialogueRecord {
  return {
    ...record,
    followUps: (record.followUps ?? []).map((followUp, followUpIndex) => {
      if (followUpIndex !== index) {
        return followUp;
      }
      if (field === "targetFamily") {
        return {
          ...followUp,
          targetFamily: normalizeDialogueFollowUpTargetFamily(value),
        };
      }
      return {
        ...followUp,
        targetId: value.trim(),
      };
    }),
  };
}

export function removeScriptEditorDialogueFollowUp(
  record: ScriptEditorDialogueRecord,
  index: number
): ScriptEditorDialogueRecord {
  return {
    ...record,
    followUps: (record.followUps ?? []).filter((_, followUpIndex) => followUpIndex !== index),
  };
}

export function updateScriptEditorEventField(
  record: ScriptEditorEventRecord,
  field: "id" | "title" | "description",
  value: string
): ScriptEditorEventRecord {
  if (field === "description") {
    return { ...record, description: value };
  }
  if (field !== "id" && field !== "title") {
    return record;
  }
  return { ...record, [field]: value.trim() };
}

export function toggleScriptEditorEventRepeatable(
  record: ScriptEditorEventRecord,
  checked: boolean
): ScriptEditorEventRecord {
  return {
    ...record,
    repeatable: checked,
  };
}

export function updateScriptEditorEventDestinationField(
  record: ScriptEditorEventRecord,
  field: keyof ScriptEditorEventDestination,
  value: string
): ScriptEditorEventRecord {
  const currentDestination = normalizeEventDestination(record.destination);
  if (field === "family") {
    const nextFamily = normalizeEventDestinationFamily(value);
    return {
      ...record,
      destination: {
        ...currentDestination,
        family: nextFamily,
        targetId:
          currentDestination.family === nextFamily ? currentDestination.targetId : "",
      },
    };
  }

  return {
    ...record,
    destination: {
      ...currentDestination,
      [field]: value.trim(),
    },
  };
}

export function updateScriptEditorEventRelationField(
  record: ScriptEditorEventRecord,
  field: "storyNodeId" | "personIds" | "cityIds" | "buildingIds",
  indexOrValue: number | string,
  nextValue?: string
): ScriptEditorEventRecord {
  if (field === "storyNodeId") {
    return {
      ...record,
      relations: {
        ...record.relations,
        storyNodeId: String(indexOrValue).trim(),
      },
    };
  }

  const index = indexOrValue as number;
  const entries = record.relations?.[field] ?? [];
  return {
    ...record,
    relations: {
      ...record.relations,
      [field]: entries.map((entry, entryIndex) =>
        entryIndex === index ? (nextValue ?? "").trim() : entry
      ),
    },
  };
}

export function appendScriptEditorEventRelationEntry(
  record: ScriptEditorEventRecord,
  field: "personIds" | "cityIds" | "buildingIds"
): ScriptEditorEventRecord {
  return {
    ...record,
    relations: {
      ...record.relations,
      [field]: [...(record.relations?.[field] ?? []), ""],
    },
  };
}

export function removeScriptEditorEventRelationEntry(
  record: ScriptEditorEventRecord,
  field: "personIds" | "cityIds" | "buildingIds",
  index: number
): ScriptEditorEventRecord {
  return {
    ...record,
    relations: {
      ...record.relations,
      [field]: (record.relations?.[field] ?? []).filter((_, entryIndex) => entryIndex !== index),
    },
  };
}

export function updateScriptEditorEventPreviewSummaryField(
  record: ScriptEditorEventRecord,
  field: "previewNotes" | "validationNotes",
  value: string
): ScriptEditorEventRecord {
  return {
    ...record,
    previewSummary: {
      ...record.previewSummary,
      [field]: value,
    },
  };
}

function createDefaultDialogueNode(index: number): ScriptEditorDialogueNodeRecord {
  return {
    id: `dialogue-node.${index + 1}`,
    nodeType: "dialogue",
    speakerPersonId: "",
    textId: "",
    nextNodeId: "",
    choiceTargetNodeId: "",
  };
}

function normalizeDialogueNodeRecord(node: ScriptEditorDialogueNodeRecord): ScriptEditorDialogueNodeRecord {
  return {
    id: normalizeString(node.id, "dialogue-node"),
    nodeType: normalizeDialogueNodeType(node.nodeType),
    speakerPersonId: normalizeOptionalString(node.speakerPersonId),
    textId: normalizeOptionalString(node.textId),
    nextNodeId: normalizeOptionalString(node.nextNodeId),
    choiceTargetNodeId: normalizeOptionalString(node.choiceTargetNodeId),
  };
}

function normalizeDialogueFollowUp(followUp: ScriptEditorDialogueFollowUp): ScriptEditorDialogueFollowUp {
  return {
    targetFamily: normalizeDialogueFollowUpTargetFamily(followUp.targetFamily),
    targetId: normalizeOptionalString(followUp.targetId),
  };
}

type ScriptEditorEventBindingConditionGroup = {
  operator: ScriptEditorConditionGroupOperator;
  conditions: ScriptEditorEventBindingConditionItem[];
};

type ScriptEditorEventBindingConditionItem = {
  type: ScriptEditorEventBindingConditionType;
  sourceFamily?: ScriptEditorEventBindingConditionSourceFamily | undefined;
  field?: string | undefined;
  operator?: ScriptEditorEventBindingConditionOperator | undefined;
  value?: boolean | number | string | undefined;
  valueType?: ScriptEditorEventBindingConditionValueType | undefined;
  resolverId?: string | undefined;
  handlerId?: string | undefined;
  payload?: string | undefined;
};

function ensureEventBindingConditions(
  record: ScriptEditorEventBindingRecord
): ScriptEditorEventBindingConditionGroup {
  return normalizeEventBindingConditions(record.conditions) ?? {
    operator: "all",
    conditions: [],
  };
}

function normalizeEventBindingConditions(
  value: unknown
): ScriptEditorEventBindingConditionGroup | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const group = value as Record<string, unknown>;
  return {
    operator: normalizeConditionGroupMode(
      typeof group.operator === "string" ? group.operator : undefined
    ),
    conditions: (Array.isArray(group.conditions) ? group.conditions : [])
      .map(normalizeEventBindingConditionItem)
      .filter(
        (condition): condition is ScriptEditorEventBindingConditionItem =>
          condition != null
      ),
  };
}

function normalizeEventBindingConditionItem(
  value: unknown
): ScriptEditorEventBindingConditionItem | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Record<string, unknown>;
  if (!isEventBindingConditionType(item.type)) {
    return null;
  }

  if (item.type === "custom") {
    return omitEmptyEventBindingConditionItemFields({
      type: "custom",
      handlerId: normalizeOptionalTrimmedString(item.handlerId),
      payload: normalizeOptionalString(item.payload),
    });
  }

  const valueType = normalizeEventBindingConditionValueType(item.valueType);
  const field =
    typeof item.field === "string" && item.field.trim().length > 0
      ? item.field
      : item.key;
  const rawValue = Object.hasOwn(item, "value") ? item.value : item.expected;
  return omitEmptyEventBindingConditionItemFields({
    type: item.type,
    sourceFamily: normalizeEventBindingConditionSourceFamily(item.sourceFamily),
    field: normalizeOptionalTrimmedString(field),
    operator: normalizeEventBindingConditionOperator(item.operator),
    value:
      item.type === "flag"
        ? rawValue === true || rawValue === "true"
        : normalizeEventBindingConditionValue(rawValue, valueType),
    valueType: item.type === "flag" || item.type === "variable" ? undefined : valueType,
    resolverId: normalizeOptionalTrimmedString(item.resolverId),
  });
}

function createDefaultEventBindingConditionItem(
  type: ScriptEditorEventBindingConditionType
): ScriptEditorEventBindingConditionItem {
  if (type === "variable") {
    return { type: "variable", field: "", operator: "==", value: "" };
  }
  if (type === "expression") {
    return {
      type: "expression",
      sourceFamily: "variable",
      field: "story.progress",
      operator: "==",
      value: "",
      valueType: "number",
    };
  }
  if (type === "custom") {
    return { type: "custom", handlerId: "", payload: "" };
  }
  if (type === "binding-context") {
    return {
      type: "binding-context",
      sourceFamily: "binding-context",
      field: "trigger.action",
      operator: "==",
      value: "",
      valueType: "enum",
      resolverId: "script-editor.trigger-action",
    };
  }
  return { type: "flag", field: "", operator: "==", value: true };
}

function updateEventBindingConditionItemField(
  item: ScriptEditorEventBindingConditionItem,
  field:
    | "type"
    | "sourceFamily"
    | "field"
    | "operator"
    | "value"
    | "valueType"
    | "resolverId"
    | "handlerId"
    | "payload",
  value: string
): ScriptEditorEventBindingConditionItem {
  const normalizedValue = value.trim();
  if (field === "type") {
    return createDefaultEventBindingConditionItem(
      isEventBindingConditionType(normalizedValue) ? normalizedValue : "flag"
    );
  }
  if (field === "sourceFamily") {
    return {
      ...item,
      sourceFamily: normalizeEventBindingConditionSourceFamily(normalizedValue),
    };
  }
  if (field === "field") {
    return { ...item, field: normalizedValue };
  }
  if (field === "operator") {
    return { ...item, operator: normalizeEventBindingConditionOperator(normalizedValue) };
  }
  if (field === "valueType") {
    return {
      ...item,
      valueType: normalizeEventBindingConditionValueType(normalizedValue),
    };
  }
  if (field === "resolverId") {
    return { ...item, resolverId: normalizedValue };
  }
  if (field === "handlerId") {
    return { ...item, handlerId: normalizedValue };
  }
  if (field === "payload") {
    return { ...item, payload: value };
  }
  if (item.type === "flag") {
    return { ...item, value: normalizedValue !== "false" };
  }
  return {
    ...item,
    value: normalizeEventBindingConditionValue(normalizedValue, item.valueType),
  };
}

function isEventBindingConditionType(
  value: unknown
): value is ScriptEditorEventBindingConditionType {
  return (
    value === "flag" ||
    value === "variable" ||
    value === "expression" ||
    value === "custom" ||
    value === "binding-context"
  );
}

function normalizeEventBindingConditionSourceFamily(
  value: unknown
): ScriptEditorEventBindingConditionSourceFamily | undefined {
  return (
    value === "flag" ||
    value === "variable" ||
    value === "person" ||
    value === "city" ||
    value === "building" ||
    value === "payload" ||
    value === "binding-context" ||
    value === "resolver" ||
    value === "custom"
  )
    ? value
    : undefined;
}

function normalizeEventBindingConditionValueType(
  value: unknown
): ScriptEditorEventBindingConditionValueType {
  return (
    value === "boolean" ||
    value === "number" ||
    value === "string" ||
    value === "enum" ||
    value === "json"
  )
    ? value
    : "string";
}

function normalizeEventBindingConditionOperator(
  value: unknown
): ScriptEditorEventBindingConditionOperator {
  return value === "contains" ? "contains" : normalizeComparisonOperator(value);
}

function normalizeEventBindingConditionValue(
  value: unknown,
  valueType?: ScriptEditorEventBindingConditionValueType
): boolean | number | string {
  if (valueType === "boolean") {
    return value === true || value === "true";
  }
  if (valueType === "number") {
    const numericValue = typeof value === "number" ? value : Number(String(value).trim());
    return Number.isFinite(numericValue) ? numericValue : 0;
  }
  return normalizeConditionValue(value);
}

function omitEmptyEventBindingConditionItemFields(
  item: ScriptEditorEventBindingConditionItem
): ScriptEditorEventBindingConditionItem {
  return Object.fromEntries(
    Object.entries(item).filter(([, value]) => value !== undefined && value !== "")
  ) as ScriptEditorEventBindingConditionItem;
}

function normalizeEventDestination(destination?: ScriptEditorEventDestination): ScriptEditorEventDestination {
  return {
    family: normalizeEventDestinationFamily(destination?.family),
    targetId: normalizeOptionalString(destination?.targetId),
  };
}

function normalizeStoryProgressMode(value?: string): ScriptEditorStoryProgressMode {
  return SCRIPT_EDITOR_STORY_PROGRESS_MODES.includes(value as ScriptEditorStoryProgressMode)
    ? (value as ScriptEditorStoryProgressMode)
    : "block";
}

function normalizeDialogueNodeType(value?: string): ScriptEditorDialogueNodeType {
  return SCRIPT_EDITOR_DIALOGUE_NODE_TYPES.includes(value as ScriptEditorDialogueNodeType)
    ? (value as ScriptEditorDialogueNodeType)
    : "dialogue";
}

function normalizeDialogueFollowUpTargetFamily(
  value?: string
): ScriptEditorDialogueFollowUpTargetFamily {
  return SCRIPT_EDITOR_DIALOGUE_FOLLOWUP_FAMILIES.includes(
    value as ScriptEditorDialogueFollowUpTargetFamily
  )
    ? (value as ScriptEditorDialogueFollowUpTargetFamily)
    : "event";
}

function normalizeEventTriggerTiming(value?: string): ScriptEditorEventTriggerTiming {
  return SCRIPT_EDITOR_EVENT_TRIGGER_TIMINGS.includes(value as ScriptEditorEventTriggerTiming)
    ? (value as ScriptEditorEventTriggerTiming)
    : "manual";
}

function normalizeConditionGroupMode(value?: string): ScriptEditorConditionGroupOperator {
  return SCRIPT_EDITOR_EVENT_BINDING_CONDITION_GROUP_OPERATORS.includes(
    value as ScriptEditorConditionGroupOperator
  )
    ? (value as ScriptEditorConditionGroupOperator)
    : "all";
}

function normalizeComparisonOperator(value: unknown): ScriptEditorConditionComparisonOperator {
  return ["==", "!=", ">=", "<=", ">", "<"].includes(String(value))
    ? (value as ScriptEditorConditionComparisonOperator)
    : "==";
}

function normalizeConditionValue(value: unknown): string | number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "";
  }
  const numericValue = Number(trimmed);
  return Number.isFinite(numericValue) ? numericValue : trimmed;
}

function normalizeEventDestinationFamily(value?: string): ScriptEditorEventDestinationFamily {
  return SCRIPT_EDITOR_EVENT_DESTINATION_FAMILIES.includes(
    value as ScriptEditorEventDestinationFamily
  )
    ? (value as ScriptEditorEventDestinationFamily)
    : "dialogue";
}

function normalizeString(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeOptionalString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeOptionalTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringArray(value: readonly string[] | undefined): string[] {
  return Array.isArray(value)
    ? value.map((entry) => (typeof entry === "string" ? entry : "")).filter(Boolean)
    : [];
}
