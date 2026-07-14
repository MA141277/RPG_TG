import type {
  ScriptEditorBuildingRecord,
  ScriptEditorCityRecord,
  ScriptEditorDialogueRecord,
  ScriptEditorEntityRecord,
  ScriptEditorEventRecord,
  ScriptEditorMinigameRecord,
  ScriptEditorPersonRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorProjectFileKey,
  ScriptEditorStoryNodeRecord,
  ScriptEditorStoryPackRecord,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import {
  createDefaultScriptEditorBuildingRecord,
  createDefaultScriptEditorCityRecord,
} from "./city-building-authoring";
import { createDefaultScriptEditorPersonRecord } from "./person-authoring";
import { createDefaultScriptEditorMinigameRecord } from "./minigame-binding-authoring";
import {
  createDefaultScriptEditorDialogueRecord,
  createDefaultScriptEditorEventRecord,
  createDefaultScriptEditorStoryNodeRecord,
} from "./story-dialogue-event-authoring";

export const SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES = [
  "storyPack",
  "people",
  "cities",
  "buildings",
  "dialogues",
  "minigames",
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
    maps: [],
    people: [
      {
        id: "person.hero",
        name: "Hero",
        personType: "角色",
        role: "playable",
        title: "主角",
        occupation: "待定",
        biography: "默认主角，用于最小工作流的导出与作者面首切。",
        extendedAttributes: [],
        dialogueIds: [],
        eventIds: [],
        tradeBinding: {
          enabled: false,
          entryId: "",
        },
      },
    ],
    cities: [
      {
        ...createDefaultScriptEditorCityRecord(0),
        id: "city.start",
        name: "Starting City",
      },
    ],
    buildings: [
      {
        ...createDefaultScriptEditorBuildingRecord(0, "city.start"),
        id: "building.home",
        cityId: "city.start",
        name: "Home",
      },
    ],
    cityEntries: [],
    events: [
      {
        ...createDefaultScriptEditorEventRecord(0),
        id: "event.opening",
        title: "Opening Event",
        destination: {
          family: "dialogue",
          targetId: "dialogue.opening",
        },
      },
    ],
    scenes: [],
    quests: [],
    activities: [],
    cards: [],
    valuables: [],
    cityNpcPools: [],
    houseAccessRefusalRules: [],
    houseModuleDefaults: {},
    cityPortraits: {},
    historicalCharacters: [],
    historicalCityRosters: [],
    historicalCharacterIdByCharacterId: {},
    dialogues: [
      {
        ...createDefaultScriptEditorDialogueRecord(0),
        id: "dialogue.opening",
        title: "Opening Dialogue",
        storyNodeId: "story-node.opening",
      },
    ],
    minigames: [],
    storyNodes: [
      {
        ...createDefaultScriptEditorStoryNodeRecord(0),
        id: "story-node.opening",
        title: "Opening Node",
      },
    ],
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
):
  | ScriptEditorPersonRecord[]
  | ScriptEditorCityRecord[]
  | ScriptEditorBuildingRecord[]
  | ScriptEditorDialogueRecord[]
  | ScriptEditorMinigameRecord[]
  | ScriptEditorStoryNodeRecord[]
  | ScriptEditorEventRecord[]
  | ScriptEditorEntityRecord[]
  | ScriptEditorTextEntryRecord[] {
  switch (family) {
    case "people":
      return project.people;
    case "cities":
      return project.cities;
    case "buildings":
      return project.buildings;
    case "dialogues":
      return project.dialogues;
    case "minigames":
      return project.minigames;
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
):
  | ScriptEditorPersonRecord
  | ScriptEditorCityRecord
  | ScriptEditorBuildingRecord
  | ScriptEditorDialogueRecord
  | ScriptEditorMinigameRecord
  | ScriptEditorStoryNodeRecord
  | ScriptEditorEventRecord
  | ScriptEditorEntityRecord
  | ScriptEditorTextEntryRecord {
  const suffix = index + 1;

  switch (family) {
    case "people":
      return createDefaultScriptEditorPersonRecord(index) as ScriptEditorPersonRecord;
    case "cities":
      return createDefaultScriptEditorCityRecord(index) as ScriptEditorCityRecord;
    case "buildings":
      return createDefaultScriptEditorBuildingRecord(index) as ScriptEditorBuildingRecord;
    case "dialogues":
      return createDefaultScriptEditorDialogueRecord(index) as ScriptEditorDialogueRecord;
    case "minigames":
      return createDefaultScriptEditorMinigameRecord(index) as ScriptEditorMinigameRecord;
    case "textEntries":
      return {
        id: `text.new.${suffix}`,
        text: `Text entry ${suffix}.`,
      };
    case "storyNodes":
      return createDefaultScriptEditorStoryNodeRecord(index) as ScriptEditorStoryNodeRecord;
    case "events":
      return createDefaultScriptEditorEventRecord(index) as ScriptEditorEventRecord;
  }
}

export function upsertScriptEditorWorkflowRecord(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMinimalWorkflowRecordFamily,
  nextRecord:
    | ScriptEditorPersonRecord
    | ScriptEditorCityRecord
    | ScriptEditorBuildingRecord
    | ScriptEditorDialogueRecord
    | ScriptEditorMinigameRecord
    | ScriptEditorStoryNodeRecord
    | ScriptEditorEventRecord
    | ScriptEditorEntityRecord
    | ScriptEditorTextEntryRecord
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
  nextRecords:
    | ScriptEditorPersonRecord[]
    | ScriptEditorCityRecord[]
    | ScriptEditorBuildingRecord[]
    | ScriptEditorDialogueRecord[]
    | ScriptEditorStoryNodeRecord[]
    | ScriptEditorEventRecord[]
    | ScriptEditorEntityRecord[]
    | ScriptEditorTextEntryRecord[]
): ScriptEditorProjectDefinition {
  switch (family) {
    case "people":
      return { ...project, people: nextRecords as ScriptEditorPersonRecord[] };
    case "cities":
      return { ...project, cities: nextRecords as ScriptEditorCityRecord[] };
    case "buildings":
      return { ...project, buildings: nextRecords as ScriptEditorBuildingRecord[] };
    case "dialogues":
      return { ...project, dialogues: nextRecords as ScriptEditorDialogueRecord[] };
    case "minigames":
      return { ...project, minigames: nextRecords as ScriptEditorMinigameRecord[] };
    case "textEntries":
      return { ...project, textEntries: nextRecords as ScriptEditorTextEntryRecord[] };
    case "storyNodes":
      return { ...project, storyNodes: nextRecords as ScriptEditorStoryNodeRecord[] };
    case "events":
      return { ...project, events: nextRecords as ScriptEditorEventRecord[] };
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
