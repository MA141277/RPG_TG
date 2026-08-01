import type { DialogueSide } from "../../../domain/dialogue";
import type {
  ScriptEditorDialogueCastRecord,
  ScriptEditorDialogueFollowUp,
  ScriptEditorDialogueFollowUpTargetFamily,
  ScriptEditorDialogueMode,
  ScriptEditorDialogueNodeRecord,
  ScriptEditorDialogueNodeType,
  ScriptEditorDialogueOptionRecord,
  ScriptEditorDialogueRecord,
  ScriptEditorConditionComparisonOperator,
  ScriptEditorConditionGroupOperator,
  ScriptEditorEventDestination,
  ScriptEditorEventDestinationFamily,
  ScriptEditorEventBindingRecord,
  ScriptEditorEventRecord,
  ScriptEditorEventType,
  ScriptEditorProgressTrackBindingRecord,
  ScriptEditorProgressTrackRecord,
  ScriptEditorProgressTrackTierRecord,
  ScriptEditorEventTriggerTiming,
  ScriptEditorSettlementContentRecord,
  ScriptEditorSettlementRecord,
  ScriptEditorStoryNodeRecord,
  ScriptEditorStoryProgressMode,
} from "../domain/script-editor-project";
import { createDefaultScriptEditorCanonicalId } from "./script-editor-id-allocation";

export const SCRIPT_EDITOR_STORY_PROGRESS_MODES: readonly ScriptEditorStoryProgressMode[] = [
  "block",
  "wait",
  "force-close",
] as const;

const SCRIPT_EDITOR_LEGACY_DIALOGUE_NODE_TYPES: readonly ScriptEditorDialogueNodeType[] = [
  "narration",
  "dialogue",
  "choice",
] as const;

export const SCRIPT_EDITOR_DIALOGUE_MODES: readonly ScriptEditorDialogueMode[] = [
  "linear",
  "choice",
] as const;

const SCRIPT_EDITOR_LEGACY_DIALOGUE_FOLLOWUP_FAMILIES: readonly ScriptEditorDialogueFollowUpTargetFamily[] = [
  "dialogue",
  "event",
  "task",
  "city",
  "building",
  "minigame",
] as const;

export const SCRIPT_EDITOR_EVENT_TRIGGER_TIMINGS: readonly ScriptEditorEventTriggerTiming[] = [
  "manual",
  "city-enter",
  "building-enter",
  "story-progress",
] as const;

const SCRIPT_EDITOR_COMPAT_EVENT_TRIGGER_TIMINGS: readonly ScriptEditorEventTriggerTiming[] = [
  ...SCRIPT_EDITOR_EVENT_TRIGGER_TIMINGS,
  "dialogue-finished",
] as const;

export const SCRIPT_EDITOR_EVENT_TYPES: readonly ScriptEditorEventType[] = [
  "settlement",
  "menu",
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
  "menu",
  "minigame",
  "task",
] as const;

export function createDefaultScriptEditorStoryNodeRecord(
  indexOrId: number | string
): ScriptEditorStoryNodeRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("storyNodes", indexOrId),
    title: `剧情段 ${suffix}`,
    chapterId: `chapter.${suffix}`,
    summary: "",
    progressMode: "block",
    relatedPersonIds: [],
    relatedDialogueIds: [],
    relatedEventIds: [],
  };
}

export function createDefaultScriptEditorDialogueRecord(
  indexOrId: number | string
): ScriptEditorDialogueRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("dialogues", indexOrId),
    title: `对话 ${suffix}`,
    mode: "linear",
    textId: "",
    speakerPersonId: "",
    cast: [],
    nextEventId: "",
    options: [],
  };
}

export function createDefaultScriptEditorEventRecord(
  indexOrId: number | string
): ScriptEditorEventRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("events", indexOrId),
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

export function createDefaultScriptEditorSettlementRecord(
  indexOrId: number | string
): ScriptEditorSettlementRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("settlements", indexOrId),
    title: `结算 ${suffix}`,
    nextEventId: "",
    contents: [createDefaultScriptEditorSettlementContentRecord()],
  };
}

export function createDefaultScriptEditorProgressTrackRecord(
  indexOrId: number | string
): ScriptEditorProgressTrackRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("progressTracks", indexOrId),
    title: `阶段轨道 ${suffix}`,
    metricKey: "",
    metricLabel: "进度值",
    hostFamily: "person",
    allowDemotion: false,
    tiers: [createDefaultScriptEditorProgressTrackTierRecord(0)],
  };
}

export function createDefaultScriptEditorProgressTrackBindingRecord(
  indexOrId: number | string
): ScriptEditorProgressTrackBindingRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId(
            "progressTrackBindings",
            indexOrId
          ),
    trackId: "",
    host: {
      family: "person",
      id: "",
    },
    enabled: true,
  };
}

export function createDefaultScriptEditorEventBindingRecord(
  indexOrId: number | string
): ScriptEditorEventBindingRecord {
  const suffix = typeof indexOrId === "number" ? indexOrId + 1 : 1;
  return {
    id:
      typeof indexOrId === "string"
        ? indexOrId
        : createDefaultScriptEditorCanonicalId("eventBindings", indexOrId),
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
    relatedPersonIds: normalizeStringArray(record.relatedPersonIds, { preserveEmptyEntries: true }),
    relatedDialogueIds: normalizeStringArray(record.relatedDialogueIds, {
      preserveEmptyEntries: true,
    }),
    relatedEventIds: normalizeStringArray(record.relatedEventIds, { preserveEmptyEntries: true }),
  };
}

export function normalizeScriptEditorDialogueRecord(
  record: Partial<ScriptEditorDialogueRecord> & { id: string }
): ScriptEditorDialogueRecord {
  const normalizedCast = (record.cast ?? []).map(normalizeDialogueCastRecord);
  const normalizedOptions = (record.options ?? []).map(normalizeDialogueOptionRecord);
  const normalizedNodes = (record.nodes ?? []).map(normalizeDialogueNodeRecord);
  const normalizedFollowUps = Array.isArray(record.followUps)
    ? record.followUps.map(normalizeDialogueFollowUp)
    : [];
  const compatParticipantPersonIds = normalizeStringArray(record.participantPersonIds, {
    preserveEmptyEntries: true,
  });
  const legacyMigration = migrateLegacyDialogueRecordToSingleScreen({
    nodes: normalizedNodes,
    followUps: normalizedFollowUps,
    participantPersonIds: compatParticipantPersonIds,
    hasPrimaryFields:
      record.mode != null ||
      record.textId != null ||
      record.speakerPersonId != null ||
      record.cast != null ||
      record.nextEventId != null ||
      record.options != null,
  });
  const {
    participantPersonIds: _ignoredParticipantPersonIds,
    nodes: _ignoredNodes,
    followUps: _ignoredFollowUps,
    ...recordWithoutLegacyDialogueFields
  } = record;

  return {
    ...(legacyMigration.retireLegacyFields ? recordWithoutLegacyDialogueFields : record),
    title: normalizeString(record.title, record.id),
    mode: legacyMigration.mode ?? normalizeDialogueMode(record.mode),
    textId:
      legacyMigration.textId ??
      normalizeOptionalTrimmedString(record.textId),
    speakerPersonId:
      legacyMigration.speakerPersonId ??
      normalizeOptionalTrimmedString(record.speakerPersonId),
    cast: legacyMigration.cast ?? normalizedCast,
    nextEventId:
      legacyMigration.nextEventId ??
      normalizeOptionalTrimmedString(record.nextEventId),
    options: legacyMigration.options ?? normalizedOptions,
    ...(typeof record.storyNodeId === "string"
      ? { storyNodeId: normalizeOptionalString(record.storyNodeId) }
      : {}),
    ...(legacyMigration.retireLegacyFields || compatParticipantPersonIds.length === 0
      ? {}
      : { participantPersonIds: compatParticipantPersonIds }),
    ...(legacyMigration.retireLegacyFields || normalizedNodes.length === 0
      ? {}
      : { nodes: normalizedNodes }),
    ...(legacyMigration.retireLegacyFields || normalizedFollowUps.length === 0
      ? {}
      : { followUps: normalizedFollowUps }),
  };
}

type LegacyDialogueSingleScreenMigration = {
  mode?: ScriptEditorDialogueMode;
  textId?: string;
  speakerPersonId?: string;
  cast?: ScriptEditorDialogueCastRecord[];
  nextEventId?: string;
  options?: ScriptEditorDialogueOptionRecord[];
  retireLegacyFields: boolean;
};

function migrateLegacyDialogueRecordToSingleScreen(input: {
  nodes: ScriptEditorDialogueNodeRecord[];
  followUps: ScriptEditorDialogueFollowUp[];
  participantPersonIds: string[];
  hasPrimaryFields: boolean;
}): LegacyDialogueSingleScreenMigration {
  if (input.hasPrimaryFields) {
    return { retireLegacyFields: false };
  }

  if (input.nodes.length !== 1) {
    return { retireLegacyFields: false };
  }

  const [node] = input.nodes;
  if (node == null || node.nodeType !== "dialogue" || node.textId.length === 0) {
    return { retireLegacyFields: false };
  }
  if (node.speakerPersonId.length === 0) {
    return { retireLegacyFields: false };
  }
  if (
    node.nextNodeId.length > 0 ||
    node.choiceTargetNodeId.length > 0 ||
    input.followUps.some((followUp) => followUp.targetFamily !== "event")
  ) {
    return { retireLegacyFields: false };
  }

  const safeNextEventId =
    input.followUps.length === 1 ? input.followUps[0]?.targetId.trim() ?? "" : "";
  if (input.followUps.length > 1) {
    return { retireLegacyFields: false };
  }

  const cast =
    input.participantPersonIds.length > 0
      ? input.participantPersonIds
          .slice(0, 2)
          .map((personId, index) => ({
            personId,
            side: (index === 1 ? "right" : "left") as DialogueSide,
          }))
      : node.speakerPersonId.length > 0
        ? [{ personId: node.speakerPersonId, side: "left" as const }]
        : [];

  return {
    mode: "linear",
    textId: node.textId,
    speakerPersonId: node.speakerPersonId,
    cast,
    nextEventId: safeNextEventId,
    options: [],
    retireLegacyFields: true,
  };
}

export function normalizeScriptEditorEventRecord(
  record: Partial<ScriptEditorEventRecord> & { id: string }
): ScriptEditorEventRecord {
  const eventType = normalizeScriptEditorEventType(record.type);
  return {
    ...record,
    title: normalizeString(record.title, record.id),
    description: normalizeOptionalString(record.description),
    chapterId: normalizeOptionalString(record.chapterId),
    occurrence: normalizeEventOccurrence(record.occurrence),
    ...(eventType == null ? {} : { type: eventType }),
    participants: Array.isArray(record.participants)
      ? record.participants
      : [],
    ...(eventType !== "settlement"
      ? {}
      : {
          settlementId: normalizeOptionalTrimmedString(record.settlementId),
        }),
    tags: normalizeStringArray(record.tags),
    triggerTiming: normalizeEventTriggerTiming(record.triggerTiming),
    repeatable: record.repeatable === true,
    nextEventId: normalizeOptionalString(record.nextEventId),
    destination: normalizeEventDestination(record.destination),
    relations: {
      storyNodeId: normalizeOptionalString(record.relations?.storyNodeId),
      personIds: normalizeStringArray(record.relations?.personIds, {
        preserveEmptyEntries: true,
      }),
      cityIds: normalizeStringArray(record.relations?.cityIds, {
        preserveEmptyEntries: true,
      }),
      buildingIds: normalizeStringArray(record.relations?.buildingIds, {
        preserveEmptyEntries: true,
      }),
    },
    previewSummary: {
      previewNotes: normalizeOptionalString(record.previewSummary?.previewNotes),
      validationNotes: normalizeOptionalString(record.previewSummary?.validationNotes),
    },
  };
}

export function normalizeScriptEditorSettlementRecord(
  record: Partial<ScriptEditorSettlementRecord> & { id: string }
): ScriptEditorSettlementRecord {
  return {
    id: normalizeString(record.id, "settlement.unknown"),
    title: normalizeString(record.title, record.id),
    nextEventId: normalizeOptionalTrimmedString(record.nextEventId),
    contents: (record.contents ?? []).map(normalizeScriptEditorSettlementContentRecord),
  };
}

export function normalizeScriptEditorProgressTrackRecord(
  record: Partial<ScriptEditorProgressTrackRecord> & { id: string }
): ScriptEditorProgressTrackRecord {
  return {
    id: normalizeString(record.id, "progress-track.unknown"),
    title: normalizeString(record.title, record.id),
    metricKey: normalizeOptionalTrimmedString(record.metricKey),
    metricLabel: normalizeString(record.metricLabel, "进度值"),
    hostFamily: normalizeString(record.hostFamily, "person"),
    allowDemotion: record.allowDemotion === true,
    tiers: (record.tiers ?? []).map(normalizeScriptEditorProgressTrackTierRecord),
  };
}

export function normalizeScriptEditorProgressTrackBindingRecord(
  record: Partial<ScriptEditorProgressTrackBindingRecord> & { id: string }
): ScriptEditorProgressTrackBindingRecord {
  return {
    id: normalizeString(record.id, "progress-binding.unknown"),
    trackId: normalizeOptionalTrimmedString(record.trackId),
    host: {
      family: normalizeString(record.host?.family, "person"),
      id: normalizeOptionalTrimmedString(record.host?.id),
    },
    enabled: record.enabled !== false,
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
  field:
    | "id"
    | "title"
    | "mode"
    | "textId"
    | "speakerPersonId"
    | "nextEventId",
  value: string
): ScriptEditorDialogueRecord {
  if (field === "mode") {
    const mode = normalizeDialogueMode(value);
    return {
      ...record,
      mode,
      ...(mode === "linear"
        ? { nextEventId: normalizeOptionalTrimmedString(record.nextEventId) }
        : {}),
    };
  }

  return {
    ...record,
    [field]: normalizeOptionalTrimmedString(value),
  };
}

export function appendScriptEditorDialogueCast(
  record: ScriptEditorDialogueRecord
): ScriptEditorDialogueRecord {
  return {
    ...record,
    cast: [...(record.cast ?? []), { personId: "", side: "left" }],
  };
}

export function updateScriptEditorDialogueCastField(
  record: ScriptEditorDialogueRecord,
  index: number,
  field: keyof ScriptEditorDialogueCastRecord,
  value: string
): ScriptEditorDialogueRecord {
  return {
    ...record,
    cast: (record.cast ?? []).map((entry, entryIndex) =>
      entryIndex === index
        ? {
            ...entry,
            [field]:
              field === "side"
                ? normalizeDialogueSide(value)
                : normalizeOptionalTrimmedString(value),
          }
        : entry
    ),
  };
}

export function removeScriptEditorDialogueCast(
  record: ScriptEditorDialogueRecord,
  index: number
): ScriptEditorDialogueRecord {
  return {
    ...record,
    cast: (record.cast ?? []).filter(
      (_, entryIndex) => entryIndex !== index
    ),
  };
}

export function appendScriptEditorDialogueOption(
  record: ScriptEditorDialogueRecord
): ScriptEditorDialogueRecord {
  const nextIndex = (record.options?.length ?? 0) + 1;
  return {
    ...record,
    options: [
      ...(record.options ?? []),
      {
        id: `option.${nextIndex}`,
        textId: "",
        nextEventId: "",
      },
    ],
  };
}

export function updateScriptEditorDialogueOptionField(
  record: ScriptEditorDialogueRecord,
  index: number,
  field: keyof ScriptEditorDialogueOptionRecord,
  value: string
): ScriptEditorDialogueRecord {
  return {
    ...record,
    options: (record.options ?? []).map((option, optionIndex) =>
      optionIndex === index
        ? {
            ...option,
            [field]: normalizeOptionalTrimmedString(value),
          }
        : option
    ),
  };
}

export function removeScriptEditorDialogueOption(
  record: ScriptEditorDialogueRecord,
  index: number
): ScriptEditorDialogueRecord {
  return {
    ...record,
    options: (record.options ?? []).filter((_, optionIndex) => optionIndex !== index),
  };
}

export function updateScriptEditorEventField(
  record: ScriptEditorEventRecord,
  field: "id" | "title" | "description" | "type" | "settlementId" | "nextEventId",
  value: string
): ScriptEditorEventRecord {
  if (field === "description") {
    return { ...record, description: value };
  }
  if (field === "nextEventId") {
    return { ...record, nextEventId: value.trim() };
  }
  if (field === "type") {
    const nextType = normalizeScriptEditorEventType(value);
    if (nextType == null) {
      const { type: _ignoredType, settlementId: _ignoredSettlementId, ...nextRecord } =
        record;
      return nextRecord;
    }
    if (nextType !== "settlement") {
      const { settlementId: _ignoredSettlementId, ...nextRecord } = record;
      return { ...nextRecord, type: nextType };
    }
    return { ...record, type: nextType };
  }
  if (field === "settlementId") {
    if (record.type !== "settlement") {
      return record;
    }
    return { ...record, settlementId: value.trim() };
  }
  if (field !== "id" && field !== "title") {
    return record;
  }
  return { ...record, [field]: value.trim() };
}

export function updateScriptEditorSettlementField(
  record: ScriptEditorSettlementRecord,
  field: "id" | "title" | "nextEventId",
  value: string
): ScriptEditorSettlementRecord {
  if (field === "nextEventId") {
    return { ...record, nextEventId: value.trim() };
  }
  return { ...record, [field]: value.trim() };
}

export function updateScriptEditorProgressTrackField(
  record: ScriptEditorProgressTrackRecord,
  field: "id" | "title" | "metricKey" | "metricLabel" | "hostFamily" | "allowDemotion",
  value: string | boolean
): ScriptEditorProgressTrackRecord {
  if (field === "allowDemotion") {
    return { ...record, allowDemotion: value === true };
  }
  return {
    ...record,
    [field]: String(value).trim(),
  };
}

export function appendScriptEditorProgressTrackTier(
  record: ScriptEditorProgressTrackRecord
): ScriptEditorProgressTrackRecord {
  return {
    ...record,
    tiers: [
      ...(record.tiers ?? []),
      createDefaultScriptEditorProgressTrackTierRecord(record.tiers?.length ?? 0),
    ],
  };
}

export function removeScriptEditorProgressTrackTier(
  record: ScriptEditorProgressTrackRecord,
  index: number
): ScriptEditorProgressTrackRecord {
  return {
    ...record,
    tiers: (record.tiers ?? []).filter((_, tierIndex) => tierIndex !== index),
  };
}

export function updateScriptEditorProgressTrackTierField(
  record: ScriptEditorProgressTrackRecord,
  index: number,
  field:
    | "id"
    | "title"
    | "threshold"
    | "onEnterRepeatPolicy"
    | "targetTierSettlementId",
  value: string
): ScriptEditorProgressTrackRecord {
  return {
    ...record,
    tiers: (record.tiers ?? []).map((tier, tierIndex) =>
      tierIndex === index
        ? normalizeScriptEditorProgressTrackTierRecord({
            ...tier,
            [field]: value,
          })
        : tier
    ),
  };
}

export function updateScriptEditorProgressTrackBindingField(
  record: ScriptEditorProgressTrackBindingRecord,
  field: "id" | "trackId" | "enabled" | "hostFamily" | "hostId",
  value: string | boolean
): ScriptEditorProgressTrackBindingRecord {
  if (field === "enabled") {
    return { ...record, enabled: value === true };
  }
  if (field === "hostFamily") {
    return {
      ...record,
      host: {
        ...record.host,
        family: String(value).trim(),
        id: "",
      },
    };
  }
  if (field === "hostId") {
    return {
      ...record,
      host: {
        ...record.host,
        id: String(value).trim(),
      },
    };
  }
  return {
    ...record,
    [field]: String(value).trim(),
  };
}

export function appendScriptEditorSettlementContent(
  record: ScriptEditorSettlementRecord
): ScriptEditorSettlementRecord {
  return {
    ...record,
    contents: [
      ...(record.contents ?? []),
      createDefaultScriptEditorSettlementContentRecord(),
    ],
  };
}

export function removeScriptEditorSettlementContent(
  record: ScriptEditorSettlementRecord,
  index: number
): ScriptEditorSettlementRecord {
  return {
    ...record,
    contents: (record.contents ?? []).filter((_, contentIndex) => contentIndex !== index),
  };
}

export function updateScriptEditorSettlementContentField(
  record: ScriptEditorSettlementRecord,
  index: number,
  field: keyof ScriptEditorSettlementContentRecord,
  value: string | number | boolean
): ScriptEditorSettlementRecord {
  return {
    ...record,
    contents: (record.contents ?? []).map((content, contentIndex) =>
      contentIndex === index
        ? normalizeScriptEditorSettlementContentRecord({
            ...content,
            [field]: value,
          })
        : content
    ),
  };
}

export function appendScriptEditorSettlementResult(
  record: ScriptEditorSettlementRecord
): ScriptEditorSettlementRecord {
  return appendScriptEditorSettlementContent(record);
}

export function removeScriptEditorSettlementResult(
  record: ScriptEditorSettlementRecord,
  index: number
): ScriptEditorSettlementRecord {
  return removeScriptEditorSettlementContent(record, index);
}

export function updateScriptEditorSettlementResultField(
  record: ScriptEditorSettlementRecord,
  index: number,
  field: "id" | "label" | "nextEventId",
  value: string
): ScriptEditorSettlementRecord {
  if (field === "nextEventId") {
    return updateScriptEditorSettlementField(record, "nextEventId", value);
  }
  return record;
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

function normalizeDialogueMode(value: unknown): ScriptEditorDialogueMode {
  return SCRIPT_EDITOR_DIALOGUE_MODES.includes(value as ScriptEditorDialogueMode)
    ? (value as ScriptEditorDialogueMode)
    : "linear";
}

function normalizeDialogueNodeType(value?: string): ScriptEditorDialogueNodeType {
  return SCRIPT_EDITOR_LEGACY_DIALOGUE_NODE_TYPES.includes(
    value as ScriptEditorDialogueNodeType
  )
    ? (value as ScriptEditorDialogueNodeType)
    : "dialogue";
}

function normalizeDialogueFollowUpTargetFamily(
  value?: string
): ScriptEditorDialogueFollowUpTargetFamily {
  return SCRIPT_EDITOR_LEGACY_DIALOGUE_FOLLOWUP_FAMILIES.includes(
    value as ScriptEditorDialogueFollowUpTargetFamily
  )
    ? (value as ScriptEditorDialogueFollowUpTargetFamily)
    : "event";
}

function normalizeDialogueSide(value: unknown): "left" | "right" | "center" {
  return value === "right" || value === "center" ? value : "left";
}

function normalizeEventTriggerTiming(value?: string): ScriptEditorEventTriggerTiming {
  return SCRIPT_EDITOR_COMPAT_EVENT_TRIGGER_TIMINGS.includes(
    value as ScriptEditorEventTriggerTiming
  )
    ? (value as ScriptEditorEventTriggerTiming)
    : "manual";
}

function normalizeDialogueCastRecord(
  record: Partial<ScriptEditorDialogueCastRecord> | undefined
): ScriptEditorDialogueCastRecord {
  return {
    personId: normalizeOptionalTrimmedString(record?.personId),
    side: normalizeDialogueSide(record?.side),
  };
}

function normalizeDialogueOptionRecord(
  record: Partial<ScriptEditorDialogueOptionRecord> | undefined
): ScriptEditorDialogueOptionRecord {
  return {
    id: normalizeString(record?.id, "option.unknown"),
    textId: normalizeOptionalTrimmedString(record?.textId),
    nextEventId: normalizeOptionalTrimmedString(record?.nextEventId),
  };
}

function createDefaultScriptEditorSettlementContentRecord(): ScriptEditorSettlementContentRecord {
  return {
    targetFamily: "person",
    targetId: "",
    attributeKey: "",
    attributeType: "number",
    operation: "set",
    value: 0,
  };
}

function createDefaultScriptEditorProgressTrackTierRecord(
  index: number
): ScriptEditorProgressTrackTierRecord {
  const suffix = index + 1;
  return {
    id: `progress-tier.${suffix}`,
    title: `阶段 ${suffix}`,
    threshold: index === 0 ? 0 : suffix * 10,
    onEnterRepeatPolicy: "once-ever",
    targetTierSettlementId: "",
  };
}

function normalizeScriptEditorProgressTrackTierRecord(
  record: Partial<ScriptEditorProgressTrackTierRecord> | undefined
): ScriptEditorProgressTrackTierRecord {
  const threshold =
    typeof record?.threshold === "number"
      ? record.threshold
      : Number(String(record?.threshold ?? "").trim());
  return {
    id: normalizeString(record?.id, "progress-tier.unknown"),
    title: normalizeString(record?.title, record?.id ?? "阶段"),
    threshold: Number.isFinite(threshold) ? threshold : 0,
    onEnterRepeatPolicy:
      record?.onEnterRepeatPolicy === "once-per-entry"
        ? "once-per-entry"
        : "once-ever",
    targetTierSettlementId: normalizeOptionalTrimmedString(
      record?.targetTierSettlementId
    ),
  };
}

function normalizeScriptEditorSettlementContentRecord(
  record: Partial<ScriptEditorSettlementContentRecord> | undefined
): ScriptEditorSettlementContentRecord {
  const attributeType = normalizeSettlementAttributeType(record?.attributeType);
  return {
    targetFamily: normalizeSettlementTargetFamily(record?.targetFamily),
    targetId: normalizeOptionalTrimmedString(record?.targetId),
    attributeKey: normalizeOptionalTrimmedString(record?.attributeKey),
    attributeType,
    operation: normalizeSettlementOperation(record?.operation, attributeType),
    value: normalizeSettlementValue(record?.value, attributeType),
  };
}

function normalizeSettlementTargetFamily(
  value: unknown
): ScriptEditorSettlementContentRecord["targetFamily"] {
  return value === "city" || value === "building" ? value : "person";
}

function normalizeSettlementAttributeType(
  value: unknown
): ScriptEditorSettlementContentRecord["attributeType"] {
  return value === "boolean" || value === "enum" ? value : "number";
}

function normalizeSettlementOperation(
  value: unknown,
  attributeType: ScriptEditorSettlementContentRecord["attributeType"]
): ScriptEditorSettlementContentRecord["operation"] {
  if (attributeType !== "number") {
    return "set";
  }
  return value === "add" || value === "subtract" || value === "set"
    ? value
    : "set";
}

function normalizeSettlementValue(
  value: unknown,
  attributeType: ScriptEditorSettlementContentRecord["attributeType"]
): string | number | boolean {
  if (attributeType === "number") {
    const numberValue = Number(String(value ?? "").trim());
    return Number.isFinite(numberValue) ? numberValue : 0;
  }
  if (attributeType === "boolean") {
    return value === true || String(value).trim() === "true";
  }
  return normalizeOptionalTrimmedString(value);
}

function normalizeScriptEditorEventType(
  value: unknown
): ScriptEditorEventType | undefined {
  return SCRIPT_EDITOR_EVENT_TYPES.includes(value as ScriptEditorEventType)
    ? (value as ScriptEditorEventType)
    : undefined;
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

function normalizeStringArray(
  value: readonly string[] | undefined,
  options: { preserveEmptyEntries?: boolean } = {}
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalizedEntries = value.map((entry) => (typeof entry === "string" ? entry : ""));
  return options.preserveEmptyEntries === true
    ? normalizedEntries
    : normalizedEntries.filter(Boolean);
}
