import type {
  ScriptEditorDialogueFollowUp,
  ScriptEditorDialogueFollowUpTargetFamily,
  ScriptEditorDialogueNodeRecord,
  ScriptEditorDialogueNodeType,
  ScriptEditorDialogueRecord,
  ScriptEditorEventConditionGroup,
  ScriptEditorEventConditionGroupMode,
  ScriptEditorEventConditionItem,
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
        ? { ...group, mode: normalizeConditionGroupMode(value) }
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
            items: [...group.items, createDefaultConditionItem(group.items.length)],
          }
        : group
    ),
  };
}

export function updateScriptEditorEventConditionItemField(
  record: ScriptEditorEventRecord,
  groupIndex: number,
  itemIndex: number,
  field: keyof ScriptEditorEventConditionItem,
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
        items: group.items.map((item, currentItemIndex) =>
          currentItemIndex === itemIndex
            ? {
                ...item,
                [field]: value.trim(),
              }
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
            items: group.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex),
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
    mode: "all",
    items: [createDefaultConditionItem(0)],
  };
}

function createDefaultConditionItem(index: number): ScriptEditorEventConditionItem {
  return {
    id: `condition-item.${index + 1}`,
    conditionType: "",
    operator: "==",
    value: "",
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

function normalizeConditionGroup(group: ScriptEditorEventConditionGroup): ScriptEditorEventConditionGroup {
  return {
    id: normalizeString(group.id, "condition-group"),
    mode: normalizeConditionGroupMode(group.mode),
    items: (group.items ?? []).map((item) => ({
      id: normalizeString(item.id, "condition-item"),
      conditionType: normalizeOptionalString(item.conditionType),
      operator: normalizeOptionalString(item.operator),
      value: normalizeOptionalString(item.value),
    })),
  };
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
