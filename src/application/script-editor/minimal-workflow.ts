import {
  SCRIPT_EDITOR_PROJECT_KIND,
  SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
  type ScriptEditorBuildingRecord,
  type ScriptEditorCityRecord,
  type ScriptEditorDialogueFollowUp,
  type ScriptEditorDialogueRecord,
  type ScriptEditorEntityRecord,
  type ScriptEditorEventBindingRecord,
  type ScriptEditorEventRecord,
  type ScriptEditorFlowRecord,
  type ScriptEditorMinigameRecord,
  type ScriptEditorMenuEntry,
  type ScriptEditorPersonRecord,
  type ScriptEditorProjectDefinition,
  type ScriptEditorProjectFileKey,
  type ScriptEditorStoryNodeRecord,
  type ScriptEditorStoryPackRecord,
  type ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import {
  createDefaultScriptEditorBuildingRecord,
  createDefaultScriptEditorCityRecord,
} from "./city-building-authoring";
import { createDefaultScriptEditorPersonRecord } from "./person-authoring";
import { createDefaultScriptEditorMinigameRecord } from "./minigame-binding-authoring";
import { createDefaultScriptEditorFlowRecord } from "./flow-authoring";
import {
  createDefaultScriptEditorDialogueRecord,
  createDefaultScriptEditorEventBindingRecord,
  createDefaultScriptEditorEventRecord,
  createDefaultScriptEditorStoryNodeRecord,
} from "./story-dialogue-event-authoring";
import { createDraftScriptEditorProjectCompletionState } from "./project-completion-state";

export const SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES = [
  "storyPack",
  "people",
  "cities",
  "buildings",
  "dialogues",
  "minigames",
  "flows",
  "textEntries",
  "storyNodes",
  "events",
  "eventBindings",
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
    schemaVersion: SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
    kind: SCRIPT_EDITOR_PROJECT_KIND,
    id: `project.${idBase}`,
    title,
    description:
      "A bounded project-first script editor workspace used to prove the first visible minimal workflow.",
    completionState: createDraftScriptEditorProjectCompletionState(),
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
    buildingArrangements: [],
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
    eventBindings: [],
    scenes: [],
    quests: [],
    activities: [],
    cards: [],
    valuables: [],
    cityNpcPools: [],
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
        participantPersonIds: ["person.hero"],
        nodes: [
          {
            id: "dialogue-node.opening.1",
            nodeType: "dialogue",
            speakerPersonId: "person.hero",
            textId: "text.opening",
            nextNodeId: "",
            choiceTargetNodeId: "",
          },
        ],
      },
    ],
    minigames: [],
    flows: [],
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
  | ScriptEditorFlowRecord[]
  | ScriptEditorStoryNodeRecord[]
  | ScriptEditorEventRecord[]
  | ScriptEditorEventBindingRecord[]
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
    case "flows":
      return project.flows;
    case "textEntries":
      return project.textEntries;
    case "storyNodes":
      return project.storyNodes;
    case "events":
      return project.events;
    case "eventBindings":
      return project.eventBindings;
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
  | ScriptEditorFlowRecord
  | ScriptEditorStoryNodeRecord
  | ScriptEditorEventRecord
  | ScriptEditorEventBindingRecord
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
    case "flows":
      return createDefaultScriptEditorFlowRecord(index);
    case "textEntries":
      return {
        id: `text.new.${suffix}`,
        text: `Text entry ${suffix}.`,
      };
    case "storyNodes":
      return createDefaultScriptEditorStoryNodeRecord(index) as ScriptEditorStoryNodeRecord;
    case "events":
      return createDefaultScriptEditorEventRecord(index) as ScriptEditorEventRecord;
    case "eventBindings":
      return createDefaultScriptEditorEventBindingRecord(index) as ScriptEditorEventBindingRecord;
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
    | ScriptEditorFlowRecord
    | ScriptEditorStoryNodeRecord
    | ScriptEditorEventRecord
    | ScriptEditorEventBindingRecord
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
  const nextProject =
    family === "events"
      ? removeEventReferencesFromScriptEditorProject(project, recordId)
      : project;
  const nextRecords = listScriptEditorWorkflowFamilyRecords(nextProject, family).filter(
    (record) => record.id !== recordId
  );
  return replaceProjectFamily(nextProject, family, nextRecords);
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
    | ScriptEditorEventBindingRecord[]
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
    case "flows":
      return { ...project, flows: nextRecords as ScriptEditorFlowRecord[] };
    case "textEntries":
      return { ...project, textEntries: nextRecords as ScriptEditorTextEntryRecord[] };
    case "storyNodes":
      return { ...project, storyNodes: nextRecords as ScriptEditorStoryNodeRecord[] };
    case "events":
      return { ...project, events: nextRecords as ScriptEditorEventRecord[] };
    case "eventBindings":
      return {
        ...project,
        eventBindings: nextRecords as ScriptEditorEventBindingRecord[],
      };
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

function removeEventReferencesFromScriptEditorProject(
  project: ScriptEditorProjectDefinition,
  removedEventId: string
): ScriptEditorProjectDefinition {
  const nextStoryPack = removeEventReferencesFromStoryPack(project.storyPack, removedEventId);
  return {
    ...project,
    storyPack: nextStoryPack,
    people: project.people.map((person) => {
      const currentEventIds = person.eventIds ?? [];
      const nextEventIds = currentEventIds.filter((eventId) => eventId !== removedEventId);
      return nextEventIds.length === currentEventIds.length
        ? person
        : { ...person, eventIds: nextEventIds };
    }),
    cities: project.cities.map((city) => {
      const nextMenuEntries = removeMenuEntriesPointingToEvent(city.menuEntries, removedEventId);
      if (nextMenuEntries === city.menuEntries || nextMenuEntries == null) {
        return city;
      }
      return {
        ...city,
        menuEntries: nextMenuEntries,
      };
    }),
    buildings: project.buildings.map((building) => {
      const nextMenuEntries = removeMenuEntriesPointingToEvent(
        building.menuEntries,
        removedEventId
      );
      const nextEntryBinding = removeBuildingEventBindingReferences(
        building.entryBinding,
        removedEventId
      );
      const nextEventBindings = removeBuildingEventBindingReferences(
        building.eventBindings,
        removedEventId
      );
      if (
        nextMenuEntries === building.menuEntries &&
        nextEntryBinding === building.entryBinding &&
        nextEventBindings === building.eventBindings
      ) {
        return building;
      }
      const nextBuilding: ScriptEditorBuildingRecord = { ...building };
      if (nextMenuEntries !== building.menuEntries && nextMenuEntries != null) {
        nextBuilding.menuEntries = nextMenuEntries;
      }
      if (
        nextEntryBinding !== building.entryBinding &&
        nextEntryBinding != null
      ) {
        nextBuilding.entryBinding =
          nextEntryBinding as NonNullable<ScriptEditorBuildingRecord["entryBinding"]>;
      }
      if (
        nextEventBindings !== building.eventBindings &&
        nextEventBindings != null
      ) {
        nextBuilding.eventBindings =
          nextEventBindings as NonNullable<ScriptEditorBuildingRecord["eventBindings"]>;
      }
      return nextBuilding;
    }),
    dialogues: project.dialogues.map((dialogue) => {
      const nextFollowUps = removeDialogueEventFollowUps(dialogue.followUps, removedEventId);
      if (nextFollowUps === dialogue.followUps || nextFollowUps == null) {
        return dialogue;
      }
      return {
        ...dialogue,
        followUps: nextFollowUps,
      };
    }),
    events: project.events.map((eventRecord) => {
      const nextNextEventId =
        eventRecord.nextEventId === removedEventId ? "" : eventRecord.nextEventId;
      const nextDestination =
        eventRecord.destination?.family === "event" &&
        eventRecord.destination.targetId === removedEventId
          ? { ...eventRecord.destination, targetId: "" }
          : eventRecord.destination;
      if (
        nextNextEventId === eventRecord.nextEventId &&
        nextDestination === eventRecord.destination
      ) {
        return eventRecord;
      }
      const nextEventRecord: ScriptEditorEventRecord = { ...eventRecord };
      if (nextNextEventId !== eventRecord.nextEventId) {
        nextEventRecord.nextEventId = nextNextEventId as string;
      }
      if (nextDestination !== eventRecord.destination && nextDestination != null) {
        nextEventRecord.destination = nextDestination;
      }
      return nextEventRecord;
    }),
    storyNodes: project.storyNodes.map((storyNode) => {
      const currentRelatedEventIds = storyNode.relatedEventIds ?? [];
      const nextRelatedEventIds = currentRelatedEventIds.filter(
        (eventId) => eventId !== removedEventId
      );
      return nextRelatedEventIds.length === currentRelatedEventIds.length
        ? storyNode
        : {
            ...storyNode,
            relatedEventIds: nextRelatedEventIds,
          };
    }),
  };
}

function removeEventReferencesFromStoryPack(
  storyPack: ScriptEditorStoryPackRecord,
  removedEventId: string
): ScriptEditorStoryPackRecord {
  const nextStoryPack: ScriptEditorStoryPackRecord = { ...storyPack };
  let changed = false;

  if (typeof storyPack.entryEventId === "string" && storyPack.entryEventId === removedEventId) {
    delete nextStoryPack.entryEventId;
    changed = true;
  }

  return changed ? nextStoryPack : storyPack;
}

function removeMenuEntriesPointingToEvent(
  entries: ScriptEditorMenuEntry[] | undefined,
  removedEventId: string
): ScriptEditorMenuEntry[] | undefined {
  if (entries == null) {
    return entries;
  }

  const nextEntries = entries.filter(
    (entry) => !(entry.targetFamily === "event" && entry.targetId === removedEventId)
  );
  return nextEntries.length === entries.length ? entries : nextEntries;
}

function removeDialogueEventFollowUps(
  followUps: ScriptEditorDialogueFollowUp[] | undefined,
  removedEventId: string
): ScriptEditorDialogueFollowUp[] | undefined {
  if (followUps == null) {
    return followUps;
  }

  const nextFollowUps = followUps.filter(
    (followUp) => !(followUp.targetFamily === "event" && followUp.targetId === removedEventId)
  );
  return nextFollowUps.length === followUps.length ? followUps : nextFollowUps;
}

function removeBuildingEventBindingReferences(
  binding:
    | ScriptEditorBuildingRecord["entryBinding"]
    | ScriptEditorBuildingRecord["eventBindings"]
    | undefined,
  removedEventId: string
): ScriptEditorBuildingRecord["entryBinding"] | ScriptEditorBuildingRecord["eventBindings"] | undefined {
  if (binding == null) {
    return binding;
  }

  const nextOnEnterEventId =
    binding.onEnterEventId === removedEventId ? "" : binding.onEnterEventId;
  const nextOnLeaveEventId =
    binding.onLeaveEventId === removedEventId ? "" : binding.onLeaveEventId;
  if (
    nextOnEnterEventId === binding.onEnterEventId &&
    nextOnLeaveEventId === binding.onLeaveEventId
  ) {
    return binding;
  }

  const nextBinding: Record<string, unknown> = { ...binding };
  if (nextOnEnterEventId == null) {
    delete nextBinding.onEnterEventId;
  } else {
    nextBinding.onEnterEventId = nextOnEnterEventId;
  }
  if (nextOnLeaveEventId == null) {
    delete nextBinding.onLeaveEventId;
  } else {
    nextBinding.onLeaveEventId = nextOnLeaveEventId;
  }
  return nextBinding as
    | ScriptEditorBuildingRecord["entryBinding"]
    | ScriptEditorBuildingRecord["eventBindings"];
}

export function getScriptEditorWorkflowVisibleFamilies(): readonly ScriptEditorProjectFileKey[] {
  return SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES;
}
