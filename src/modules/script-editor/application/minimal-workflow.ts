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
  type ScriptEditorItemRecord,
  type ScriptEditorMenuInstanceRecord,
  type ScriptEditorMinigameRecord,
  type ScriptEditorPortraitResourceRecord,
  type ScriptEditorPortraitVariantRecord,
  type ScriptEditorMenuEntry,
  type ScriptEditorPersonRecord,
  type ScriptEditorProgressTrackBindingRecord,
  type ScriptEditorProgressTrackRecord,
  type ScriptEditorProjectDefinition,
  type ScriptEditorProjectFileKey,
  type ScriptEditorSettlementRecord,
  type ScriptEditorStoryNodeRecord,
  type ScriptEditorStoryPackRecord,
  type ScriptEditorTextEntryRecord,
} from "../domain/script-editor-project";
import {
  createDefaultScriptEditorBuildingRecord,
  createDefaultScriptEditorCityRecord,
} from "./city-building-authoring";
import {
  createDefaultScriptEditorPersonRecord,
  readScriptEditorPersonStringArrayField,
} from "./person-authoring";
import { createDefaultScriptEditorMinigameRecord } from "./minigame-binding-authoring";
import { createDefaultScriptEditorFlowRecord } from "./flow-authoring";
import {
  createDefaultScriptEditorPortraitRecord,
  createDefaultScriptEditorPortraitVariantRecord,
} from "./portrait-authoring";
import {
  createDefaultScriptEditorDialogueRecord,
  createDefaultScriptEditorEventBindingRecord,
  createDefaultScriptEditorEventRecord,
  createDefaultScriptEditorProgressTrackBindingRecord,
  createDefaultScriptEditorProgressTrackRecord,
  createDefaultScriptEditorSettlementRecord,
  createDefaultScriptEditorStoryNodeRecord,
} from "./story-dialogue-event-authoring";
import { formalizeScriptEditorProjectMenus } from "./menu-authoring";
import { createDraftScriptEditorProjectCompletionState } from "./project-completion-state";
import {
  allocateNextScriptEditorProjectCanonicalId,
  createDefaultScriptEditorCanonicalId,
} from "./script-editor-id-allocation";

export const SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES = [
  "storyPack",
  "people",
  "portraits",
  "portraitVariants",
  "cities",
  "buildings",
  "quests",
  "dialogues",
  "minigames",
  "flows",
  "textEntries",
  "items",
  "menuResources",
  "storyNodes",
  "settlements",
  "events",
  "eventBindings",
  "progressTracks",
  "progressTrackBindings",
] as const;

export const SCRIPT_EDITOR_STAGE_CONFIGURATION_SOURCE_FAMILIES = [
  "progressTracks",
  "progressTrackBindings",
] as const satisfies readonly ScriptEditorProjectFileKey[];

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
  const defaultPortrait = createDefaultScriptEditorPortraitRecord(0);

  return formalizeScriptEditorProjectMenus({
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
      personAttributeSemantics: [],
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
        attributeGroup: {},
        attributeMappings: [],
        attributeValues: [],
        name: "Hero",
        personType: "角色",
        role: "playable",
        title: "主角",
        occupation: "待定",
        biography: "默认主角，用于最小工作流的导出与作者面首切。",
        portraitId: defaultPortrait.id,
        dialogueIds: [],
        eventIds: [],
        tradeBinding: {
          enabled: false,
          entryId: "",
        },
      },
    ],
    portraits: [
      {
        ...defaultPortrait,
        label: "默认立绘",
        portraitImage: "builtin:user/20.png",
        avatarImage: "builtin:user/20 - touxiang.png",
      },
    ],
    portraitVariants: [],
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
    settlements: [],
    progressTracks: [],
    progressTrackBindings: [],
    menuResources: [],
    menuInstances: [],
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
    quests: [],
    activities: [],
    cards: [],
    valuables: [],
    items: [],
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
  });
}

export function listScriptEditorWorkflowFamilyRecords(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMinimalWorkflowRecordFamily
):
  | ScriptEditorPersonRecord[]
  | ScriptEditorPortraitResourceRecord[]
  | ScriptEditorPortraitVariantRecord[]
  | ScriptEditorCityRecord[]
  | ScriptEditorBuildingRecord[]
  | ScriptEditorSettlementRecord[]
  | ScriptEditorProgressTrackRecord[]
  | ScriptEditorProgressTrackBindingRecord[]
  | ScriptEditorDialogueRecord[]
  | ScriptEditorMenuInstanceRecord[]
  | ScriptEditorEntityRecord[]
  | ScriptEditorMinigameRecord[]
  | ScriptEditorFlowRecord[]
  | ScriptEditorStoryNodeRecord[]
  | ScriptEditorEventRecord[]
  | ScriptEditorEventBindingRecord[]
  | ScriptEditorEntityRecord[]
  | ScriptEditorTextEntryRecord[]
  | ScriptEditorItemRecord[] {
  switch (family) {
    case "people":
      return project.people;
    case "portraits":
      return project.portraits;
    case "portraitVariants":
      return project.portraitVariants;
    case "cities":
      return project.cities;
    case "buildings":
      return project.buildings;
    case "quests":
      return project.quests;
    case "dialogues":
      return project.dialogues;
    case "minigames":
      return project.minigames;
    case "flows":
      return project.flows;
    case "textEntries":
      return project.textEntries;
    case "items":
      return project.items;
    case "menuResources":
      return project.menuInstances;
    case "storyNodes":
      return project.storyNodes;
    case "settlements":
      return project.settlements;
    case "events":
      return project.events;
    case "eventBindings":
      return project.eventBindings;
    case "progressTracks":
      return project.progressTracks ?? [];
    case "progressTrackBindings":
      return project.progressTrackBindings ?? [];
  }
}

export function createScriptEditorWorkflowRecordDraft(
  family: ScriptEditorMinimalWorkflowRecordFamily,
  projectOrIndex: ScriptEditorProjectDefinition | number
):
  | ScriptEditorPersonRecord
  | ScriptEditorPortraitResourceRecord
  | ScriptEditorPortraitVariantRecord
  | ScriptEditorCityRecord
  | ScriptEditorBuildingRecord
  | ScriptEditorSettlementRecord
  | ScriptEditorProgressTrackRecord
  | ScriptEditorProgressTrackBindingRecord
  | ScriptEditorDialogueRecord
  | ScriptEditorMenuInstanceRecord
  | ScriptEditorEntityRecord
  | ScriptEditorMinigameRecord
  | ScriptEditorFlowRecord
  | ScriptEditorStoryNodeRecord
  | ScriptEditorEventRecord
  | ScriptEditorEventBindingRecord
  | ScriptEditorEntityRecord
  | ScriptEditorTextEntryRecord
  | ScriptEditorItemRecord {
  const project =
    typeof projectOrIndex === "number" ? null : projectOrIndex;
  const legacyIndex = typeof projectOrIndex === "number" ? projectOrIndex : 0;

  switch (family) {
    case "people":
      return createDefaultScriptEditorPersonRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "people")
      ) as ScriptEditorPersonRecord;
    case "portraits":
      return createDefaultScriptEditorPortraitRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "portraits")
      );
    case "portraitVariants":
      return createDefaultScriptEditorPortraitVariantRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "portraitVariants")
      );
    case "cities":
      return createDefaultScriptEditorCityRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "cities")
      ) as ScriptEditorCityRecord;
    case "buildings":
      return createDefaultScriptEditorBuildingRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "buildings")
      ) as ScriptEditorBuildingRecord;
    case "quests":
      return {
        id:
          project == null
            ? createDefaultScriptEditorCanonicalId("quests", legacyIndex)
            : allocateNextScriptEditorProjectCanonicalId(project, "quests"),
        title: `Task ${(project?.quests.length ?? legacyIndex) + 1}`,
      };
    case "dialogues":
      return createDefaultScriptEditorDialogueRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "dialogues")
      ) as ScriptEditorDialogueRecord;
    case "minigames":
      return createDefaultScriptEditorMinigameRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "minigames")
      ) as ScriptEditorMinigameRecord;
    case "flows":
      return createDefaultScriptEditorFlowRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "flows")
      );
    case "textEntries":
      return {
        id:
          project == null
            ? createDefaultScriptEditorCanonicalId("textEntries", legacyIndex)
            : allocateNextScriptEditorProjectCanonicalId(project, "textEntries"),
        text: `Text entry ${(project?.textEntries.length ?? legacyIndex) + 1}.`,
      };
    case "items": {
      const itemIndex = (project?.items.length ?? legacyIndex) + 1;
      const name = `道具 ${itemIndex}`;
      return {
        id:
          project == null
            ? createDefaultScriptEditorCanonicalId("items", legacyIndex)
            : allocateNextScriptEditorProjectCanonicalId(project, "items"),
        name,
        display: {
          title: name,
        },
        stack: {
          stackable: false,
        },
        menuInstanceIds: [],
      };
    }
    case "menuResources":
      return {
        id:
          project == null
            ? createDefaultScriptEditorCanonicalId("menuInstances", legacyIndex)
            : allocateNextScriptEditorProjectCanonicalId(project, "menuInstances"),
        title: `菜单项 ${(project?.menuInstances.length ?? legacyIndex) + 1}`,
        resourceId:
          project == null
            ? createDefaultScriptEditorCanonicalId("menuResources", legacyIndex)
            : allocateNextScriptEditorProjectCanonicalId(project, "menuResources"),
      };
    case "storyNodes":
      return createDefaultScriptEditorStoryNodeRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "storyNodes")
      ) as ScriptEditorStoryNodeRecord;
    case "settlements":
      return createDefaultScriptEditorSettlementRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "settlements")
      ) as ScriptEditorSettlementRecord;
    case "events":
      return createDefaultScriptEditorEventRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "events")
      ) as ScriptEditorEventRecord;
    case "eventBindings":
      return createDefaultScriptEditorEventBindingRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "eventBindings")
      ) as ScriptEditorEventBindingRecord;
    case "progressTracks":
      return createDefaultScriptEditorProgressTrackRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(project, "progressTracks")
      ) as ScriptEditorProgressTrackRecord;
    case "progressTrackBindings":
      return createDefaultScriptEditorProgressTrackBindingRecord(
        project == null
          ? legacyIndex
          : allocateNextScriptEditorProjectCanonicalId(
              project,
              "progressTrackBindings"
            )
      ) as ScriptEditorProgressTrackBindingRecord;
  }
}

export function upsertScriptEditorWorkflowRecord(
  project: ScriptEditorProjectDefinition,
  family: ScriptEditorMinimalWorkflowRecordFamily,
  nextRecord:
    | ScriptEditorPersonRecord
    | ScriptEditorCityRecord
    | ScriptEditorBuildingRecord
    | ScriptEditorSettlementRecord
  | ScriptEditorProgressTrackRecord
  | ScriptEditorProgressTrackBindingRecord
  | ScriptEditorDialogueRecord
  | ScriptEditorMenuInstanceRecord
  | ScriptEditorEntityRecord
    | ScriptEditorMinigameRecord
    | ScriptEditorFlowRecord
    | ScriptEditorStoryNodeRecord
    | ScriptEditorEventRecord
    | ScriptEditorEventBindingRecord
    | ScriptEditorEntityRecord
    | ScriptEditorTextEntryRecord
    | ScriptEditorItemRecord
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
    | ScriptEditorPortraitResourceRecord[]
    | ScriptEditorPortraitVariantRecord[]
    | ScriptEditorCityRecord[]
    | ScriptEditorBuildingRecord[]
    | ScriptEditorSettlementRecord[]
    | ScriptEditorProgressTrackRecord[]
    | ScriptEditorProgressTrackBindingRecord[]
    | ScriptEditorDialogueRecord[]
    | ScriptEditorMenuInstanceRecord[]
    | ScriptEditorMinigameRecord[]
    | ScriptEditorFlowRecord[]
    | ScriptEditorStoryNodeRecord[]
    | ScriptEditorEventRecord[]
    | ScriptEditorEventBindingRecord[]
    | ScriptEditorEntityRecord[]
    | ScriptEditorTextEntryRecord[]
    | ScriptEditorItemRecord[]
): ScriptEditorProjectDefinition {
  switch (family) {
    case "people":
      return { ...project, people: nextRecords as ScriptEditorPersonRecord[] };
    case "portraits":
      return {
        ...project,
        portraits: nextRecords as ScriptEditorPortraitResourceRecord[],
      };
    case "portraitVariants":
      return {
        ...project,
        portraitVariants: nextRecords as ScriptEditorPortraitVariantRecord[],
      };
    case "cities":
      return { ...project, cities: nextRecords as ScriptEditorCityRecord[] };
    case "buildings":
      return { ...project, buildings: nextRecords as ScriptEditorBuildingRecord[] };
    case "quests":
      return { ...project, quests: nextRecords as ScriptEditorEntityRecord[] };
    case "dialogues":
      return { ...project, dialogues: nextRecords as ScriptEditorDialogueRecord[] };
    case "minigames":
      return { ...project, minigames: nextRecords as ScriptEditorMinigameRecord[] };
    case "flows":
      return { ...project, flows: nextRecords as ScriptEditorFlowRecord[] };
    case "textEntries":
      return { ...project, textEntries: nextRecords as ScriptEditorTextEntryRecord[] };
    case "items":
      return { ...project, items: nextRecords as ScriptEditorItemRecord[] };
    case "menuResources":
      return {
        ...project,
        menuInstances: nextRecords as ScriptEditorMenuInstanceRecord[],
      };
    case "storyNodes":
      return { ...project, storyNodes: nextRecords as ScriptEditorStoryNodeRecord[] };
    case "settlements":
      return {
        ...project,
        settlements: nextRecords as ScriptEditorSettlementRecord[],
      };
    case "events":
      return { ...project, events: nextRecords as ScriptEditorEventRecord[] };
    case "eventBindings":
      return {
        ...project,
        eventBindings: nextRecords as ScriptEditorEventBindingRecord[],
      };
    case "progressTracks":
      return {
        ...project,
        progressTracks: nextRecords as ScriptEditorProgressTrackRecord[],
      };
    case "progressTrackBindings":
      return {
        ...project,
        progressTrackBindings: nextRecords as ScriptEditorProgressTrackBindingRecord[],
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
      const currentEventIds = readScriptEditorPersonStringArrayField(
        person,
        "eventIds"
      );
      const nextEventIds = currentEventIds.filter((eventId) => eventId !== removedEventId);
      return nextEventIds.length === currentEventIds.length
        ? person
        : { ...person, eventIds: nextEventIds };
    }),
    menuResources: project.menuResources.map((menuResource) => ({
      ...menuResource,
      entries: removeMenuEntriesPointingToEvent(menuResource.entries, removedEventId) ?? [],
    })),
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

export function getScriptEditorWorkflowVisibleFamilies(): readonly ScriptEditorProjectFileKey[] {
  return SCRIPT_EDITOR_MINIMAL_WORKFLOW_FAMILIES.filter(
    (family) => family !== "flows" && family !== "storyNodes"
  ) as readonly ScriptEditorProjectFileKey[];
}
