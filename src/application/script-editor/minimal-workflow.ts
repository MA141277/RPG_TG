import type {
  ScriptEditorEntityRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorProjectFileKey,
  ScriptEditorStoryPackRecord,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";

export const SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES = [
  "storyPack",
  "people",
  "textEntries",
  "storyNodes",
  "events",
] as const;

export type ScriptEditorMinimalWorkflowFamily =
  (typeof SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES)[number];

export type ScriptEditorMinimalWorkflowRecordFamily = Exclude<
  ScriptEditorMinimalWorkflowFamily,
  "storyPack"
>;

export function isScriptEditorMinimalWorkflowFamily(
  value: string
): value is ScriptEditorMinimalWorkflowFamily {
  return (
    SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES as readonly string[]
  ).includes(value);
}

export function createDefaultScriptEditorProjectDefinition(input?: {
  idBase?: string | undefined;
  title?: string | undefined;
}): ScriptEditorProjectDefinition {
  const idBase = input?.idBase?.trim() || "script-editor.demo";
  const title = input?.title?.trim() || "Script Editor Demo Project";

  return {
    schemaVersion: 1,
    kind: "script-editor-project",
    id: `project.${idBase}`,
    title,
    description:
      "A bounded project-first script editor workspace used to prove the first visible minimal workflow.",
    storyPack: {
      id: `story-pack.${idBase}`,
      title,
      description:
        "Minimal workflow project root. Later queues may widen authoring semantics, but this queue only proves the first visible loop.",
      basePackId: "content-pack.base-game.zhuyuanzhang",
      scenarioProfile: {
        id: `scenario.${idBase}`,
        title: `${title} Opening`,
        playerCharacterId: "person.hero",
        chapterId: `chapter.${idBase}`,
        initialLocation: {
          mapId: "map.demo",
          cityId: "city.start",
          houseId: "building.home",
          view: "city",
        },
      },
    },
    people: [
      {
        id: "person.hero",
        name: "Hero",
        role: "playable",
      },
    ],
    cities: [
      {
        id: "city.start",
        name: "Starting City",
      },
    ],
    buildings: [
      {
        id: "building.home",
        cityId: "city.start",
        name: "Home",
      },
    ],
    events: [
      {
        id: "event.opening",
        title: "Opening Event",
      },
    ],
    quests: [],
    dialogues: [],
    minigames: [],
    storyNodes: [],
    textEntries: [
      {
        id: "text.opening",
        text: "Opening line.",
      },
    ],
    conditionGroups: [],
    effectBundles: [],
  };
}

export function listScriptEditorWorkflowFamilyRecords(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMinimalWorkflowRecordFamily
): ScriptEditorEntityRecord[] | ScriptEditorTextEntryRecord[] {
  switch (family) {
    case "people":
      return project.people;
    case "textEntries":
      return project.textEntries;
    case "storyNodes":
      return project.storyNodes;
    case "events":
      return project.events;
  }
}

export function createScriptEditorWorkflowRecordDraft(
  family: ScriptEditorMinimalWorkflowRecordFamily,
  index: number
): ScriptEditorEntityRecord | ScriptEditorTextEntryRecord {
  const suffix = index + 1;

  switch (family) {
    case "people":
      return {
        id: `person.new.${suffix}`,
        name: `Person ${suffix}`,
        role: "support",
      };
    case "textEntries":
      return {
        id: `text.new.${suffix}`,
        text: `Text entry ${suffix}.`,
      };
    case "storyNodes":
      return {
        id: `story-node.new.${suffix}`,
        title: `Story Node ${suffix}`,
      };
    case "events":
      return {
        id: `event.new.${suffix}`,
        title: `Event ${suffix}`,
      };
  }
}

export function upsertScriptEditorWorkflowRecord(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMinimalWorkflowRecordFamily,
  nextRecord: ScriptEditorEntityRecord | ScriptEditorTextEntryRecord
): ScriptEditorProjectDefinition {
  const currentRecords = listScriptEditorWorkflowFamilyRecords(project, family);
  const nextRecords = replaceOrAppendRecord(currentRecords, nextRecord);
  return replaceProjectFamily(project, family, nextRecords);
}

export function removeScriptEditorWorkflowRecord(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMinimalWorkflowRecordFamily,
  recordId: string
): ScriptEditorProjectDefinition {
  const nextRecords = listScriptEditorWorkflowFamilyRecords(project, family).filter(
    (record) => record.id !== recordId
  );
  return replaceProjectFamily(project, family, nextRecords);
}

export function updateScriptEditorWorkflowStoryPack(
  project: ScriptEditorProjectDefinition,
  nextStoryPack: ScriptEditorStoryPackRecord
): ScriptEditorProjectDefinition {
  return {
    ...project,
    storyPack: nextStoryPack,
  };
}

function replaceProjectFamily(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMinimalWorkflowRecordFamily,
  nextRecords: ScriptEditorEntityRecord[] | ScriptEditorTextEntryRecord[]
): ScriptEditorProjectDefinition {
  switch (family) {
    case "people":
      return { ...project, people: nextRecords };
    case "textEntries":
      return { ...project, textEntries: nextRecords };
    case "storyNodes":
      return { ...project, storyNodes: nextRecords };
    case "events":
      return { ...project, events: nextRecords };
  }
}

function replaceOrAppendRecord<
  TRecord extends ScriptEditorEntityRecord | ScriptEditorTextEntryRecord,
>(records: readonly TRecord[], nextRecord: TRecord): TRecord[] {
  const existingIndex = records.findIndex((record) => record.id === nextRecord.id);
  if (existingIndex < 0) {
    return [...records, nextRecord];
  }

  return records.map((record, index) =>
    index === existingIndex ? nextRecord : record
  );
}

export function getScriptEditorWorkflowVisibleFamilies(): readonly ScriptEditorProjectFileKey[] {
  return SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES;
}
