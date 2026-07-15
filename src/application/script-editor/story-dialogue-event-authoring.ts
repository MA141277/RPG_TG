import type {
  ScriptEditorDialogueFollowUp,
  ScriptEditorDialogueFollowUpTargetFamily,
  ScriptEditorDialogueNodeRecord,
  ScriptEditorDialogueNodeType,
  ScriptEditorDialogueRecord,
  ScriptEditorConditionComparisonOperator,
  ScriptEditorEventConditionGroup,
  ScriptEditorEventConditionGroupMode,
  ScriptEditorConditionNode,
  ScriptEditorEventDestination,
  ScriptEditorEventDestinationFamily,
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

export const SCRIPT_EDITOR_EVENT_CONDITION_GROUP_MODES: readonly ScriptEditorEventConditionGroupMode[] = [
  "all",
  "any",
  "not",
] as const;

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
  "city",
  "building",
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
    conditionGroups: [createDefaultConditionGroup(0)],
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
    triggerTiming: normalizeEventTriggerTiming(record.triggerTiming),
    repeatable: record.repeatable === true,
    conditionGroups: (record.conditionGroups ?? []).map(normalizeConditionGroup),
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
  field: "id" | "title" | "description" | "triggerTiming",
  value: string
): ScriptEditorEventRecord {
  if (field === "description") {
    return { ...record, description: value };
  }
  if (field === "triggerTiming") {
    return { ...record, triggerTiming: normalizeEventTriggerTiming(value) };
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

export function appendScriptEditorEventConditionGroup(
  record: ScriptEditorEventRecord
): ScriptEditorEventRecord {
  return {
    ...record,
    conditionGroups: [
      ...(record.conditionGroups ?? []),
      createDefaultConditionGroup(record.conditionGroups?.length ?? 0),
    ],
  };
}

export function updateScriptEditorEventConditionGroupMode(
  record: ScriptEditorEventRecord,
  index: number,
  value: string
): ScriptEditorEventRecord {
  return {
    ...record,
    conditionGroups: (record.conditionGroups ?? []).map((group, groupIndex) =>
      groupIndex === index
        ? { ...group, operator: normalizeConditionGroupMode(value) }
        : group
    ),
  };
}

export function removeScriptEditorEventConditionGroup(
  record: ScriptEditorEventRecord,
  index: number
): ScriptEditorEventRecord {
  return {
    ...record,
    conditionGroups: (record.conditionGroups ?? []).filter((_, groupIndex) => groupIndex !== index),
  };
}

export function appendScriptEditorEventConditionItem(
  record: ScriptEditorEventRecord,
  groupIndex: number
): ScriptEditorEventRecord {
  return {
    ...record,
    conditionGroups: (record.conditionGroups ?? []).map((group, currentGroupIndex) =>
      currentGroupIndex === groupIndex
        ? {
            ...group,
            conditions: [
              ...group.conditions,
              createDefaultConditionItem(group.conditions.length),
            ],
          }
        : group
    ),
  };
}

export function updateScriptEditorEventConditionItemField(
  record: ScriptEditorEventRecord,
  groupIndex: number,
  itemIndex: number,
  field: string,
  value: string
): ScriptEditorEventRecord {
  return {
    ...record,
    conditionGroups: (record.conditionGroups ?? []).map((group, currentGroupIndex) => {
      if (currentGroupIndex !== groupIndex) {
        return group;
      }
      return {
        ...group,
        conditions: group.conditions.map((item, currentItemIndex) =>
          currentItemIndex === itemIndex
            ? updateConditionNodeField(item, field, value)
            : item
        ),
      };
    }),
  };
}

export function removeScriptEditorEventConditionItem(
  record: ScriptEditorEventRecord,
  groupIndex: number,
  itemIndex: number
): ScriptEditorEventRecord {
  return {
    ...record,
    conditionGroups: (record.conditionGroups ?? []).map((group, currentGroupIndex) =>
      currentGroupIndex === groupIndex
        ? {
            ...group,
            conditions: group.conditions.filter((_, currentItemIndex) => currentItemIndex !== itemIndex),
          }
        : group
    ),
  };
}

export function updateScriptEditorEventDestinationField(
  record: ScriptEditorEventRecord,
  field: keyof ScriptEditorEventDestination,
  value: string
): ScriptEditorEventRecord {
  return {
    ...record,
    destination: {
      ...normalizeEventDestination(record.destination),
      [field]:
        field === "family"
          ? normalizeEventDestinationFamily(value)
          : value.trim(),
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

function createDefaultConditionGroup(index: number): ScriptEditorEventConditionGroup {
  return {
    id: `condition-group.${index + 1}`,
    operator: "all",
    conditions: [],
  };
}

function createDefaultConditionItem(_index: number): ScriptEditorConditionNode {
  return {
    type: "flag",
    key: "",
    expected: true,
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

function normalizeConditionGroup(group: Partial<ScriptEditorEventConditionGroup> & { id?: string }): ScriptEditorEventConditionGroup {
  return {
    id: normalizeString(group.id, "condition-group"),
    operator: normalizeConditionGroupMode(group.operator),
    conditions: (Array.isArray(group.conditions) ? group.conditions : [])
      .map(normalizeConditionNode)
      .filter((condition): condition is ScriptEditorConditionNode => condition != null),
  };
}

function updateConditionNodeField(
  node: ScriptEditorConditionNode,
  field: string,
  value: string
): ScriptEditorConditionNode {
  const normalizedValue = value.trim();
  if (field === "type") {
    return createDefaultConditionNodeForType(normalizedValue);
  }

  if (node.type === "flag") {
    if (field === "key") {
      return { ...node, key: normalizedValue };
    }
    if (field === "expected") {
      return { ...node, expected: normalizedValue !== "false" };
    }
    return node;
  }

  if (node.type === "variable") {
    if (field === "key") {
      return { ...node, key: normalizedValue };
    }
    if (field === "operator") {
      return { ...node, operator: normalizeComparisonOperator(normalizedValue) };
    }
    if (field === "value") {
      return { ...node, value: normalizeConditionValue(normalizedValue) };
    }
    return node;
  }

  if (node.type === "task-status" && field === "taskId") {
    return { ...node, taskId: normalizedValue };
  }

  if (node.type === "signal" && field === "signalType") {
    return { ...node, signalType: normalizedValue };
  }

  if (node.type === "elapsed-time") {
    if (field === "since") {
      return { ...node, since: normalizedValue };
    }
    if (field === "atLeastDays") {
      return { ...node, atLeastDays: Number(normalizedValue) || 0 };
    }
  }

  return node;
}

function createDefaultConditionNodeForType(type: string): ScriptEditorConditionNode {
  switch (type) {
    case "variable":
      return { type: "variable", key: "", operator: "==", value: "" };
    case "task-status":
      return { type: "task-status", taskId: "", status: "completed" };
    case "signal":
      return { type: "signal", signalType: "" };
    case "elapsed-time":
      return { type: "elapsed-time", since: "", atLeastDays: 0 };
    case "event-fired":
      return { type: "event-fired", eventId: "", expected: true };
    case "chapter":
      return { type: "chapter", chapterId: "" };
    case "location":
      return { type: "location", cityId: "" };
    case "character-exists":
      return { type: "character-exists", characterId: "", expected: true };
    case "character-available":
      return { type: "character-available", characterId: "", expected: true };
    case "character-in-city":
      return { type: "character-in-city", characterId: "", cityId: "" };
    case "mission-status":
      return { type: "mission-status", missionId: "", status: "completed" };
    case "flag":
    default:
      return { type: "flag", key: "", expected: true };
  }
}

function normalizeConditionNode(value: unknown): ScriptEditorConditionNode | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const node = value as Record<string, unknown>;
  if (node.type === "group") {
    return {
      type: "group",
      operator: normalizeConditionGroupMode(node.operator as string | undefined),
      conditions: (Array.isArray(node.conditions) ? node.conditions : [])
        .map(normalizeConditionNode)
        .filter((condition): condition is ScriptEditorConditionNode => condition != null),
    };
  }

  if (node.type === "flag") {
    return {
      type: "flag",
      key: normalizeOptionalString(node.key),
      expected: node.expected !== false,
    };
  }

  if (node.type === "variable") {
    return {
      type: "variable",
      key: normalizeOptionalString(node.key),
      operator: normalizeComparisonOperator(node.operator),
      value: normalizeConditionValue(node.value),
    };
  }

  if (node.type === "task-status") {
    return {
      type: "task-status",
      taskId: normalizeOptionalString(node.taskId),
      status: normalizeTaskStatus(node.status),
    };
  }

  if (node.type === "signal") {
    return { type: "signal", signalType: normalizeOptionalString(node.signalType) };
  }

  if (node.type === "elapsed-time") {
    return {
      type: "elapsed-time",
      since: normalizeOptionalString(node.since),
      atLeastDays: typeof node.atLeastDays === "number" ? node.atLeastDays : 0,
    };
  }

  if (node.type === "event-fired") {
    return {
      type: "event-fired",
      eventId: normalizeOptionalString(node.eventId),
      expected: node.expected === false ? false : true,
    };
  }

  return null;
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

function normalizeConditionGroupMode(value?: string): ScriptEditorEventConditionGroupMode {
  return SCRIPT_EDITOR_EVENT_CONDITION_GROUP_MODES.includes(
    value as ScriptEditorEventConditionGroupMode
  )
    ? (value as ScriptEditorEventConditionGroupMode)
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

function normalizeTaskStatus(value: unknown): "inactive" | "active" | "completed" | "failed" {
  return ["inactive", "active", "completed", "failed"].includes(String(value))
    ? (value as "inactive" | "active" | "completed" | "failed")
    : "completed";
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

function normalizeStringArray(value: readonly string[] | undefined): string[] {
  return Array.isArray(value)
    ? value.map((entry) => (typeof entry === "string" ? entry : "")).filter(Boolean)
    : [];
}
