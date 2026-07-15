export const SCRIPT_EDITOR_PROJECT_KIND = "script-editor-project";
export const SCRIPT_EDITOR_PROJECT_MANIFEST_FILE = "project.json";

export const SCRIPT_EDITOR_PROJECT_FILE_KEYS = [
  "storyPack",
  "maps",
  "people",
  "cities",
  "buildings",
  "cityEntries",
  "events",
  "scenes",
  "quests",
  "activities",
  "cards",
  "valuables",
  "cityNpcPools",
  "houseAccessRefusalRules",
  "houseModuleDefaults",
  "cityPortraits",
  "historicalCharacters",
  "historicalCityRosters",
  "historicalCharacterIdByCharacterId",
  "dialogues",
  "minigames",
  "storyNodes",
  "textEntries",
  "conditionGroups",
  "effectBundles",
] as const;

export type ScriptEditorProjectFileKey =
  (typeof SCRIPT_EDITOR_PROJECT_FILE_KEYS)[number];

export const SCRIPT_EDITOR_PROJECT_CANONICAL_FILES: Record<
  ScriptEditorProjectFileKey,
  string
> = {
  storyPack: "./story-pack.json",
  maps: "./maps.json",
  people: "./people.json",
  cities: "./cities.json",
  buildings: "./buildings.json",
  cityEntries: "./city-entries.json",
  events: "./events.json",
  scenes: "./scenes.json",
  quests: "./quests.json",
  activities: "./activities.json",
  cards: "./cards.json",
  valuables: "./valuables.json",
  cityNpcPools: "./city-npc-pools.json",
  houseAccessRefusalRules: "./house-access-refusal-rules.json",
  houseModuleDefaults: "./house-module-defaults.json",
  cityPortraits: "./city-portraits.json",
  historicalCharacters: "./historical-characters.json",
  historicalCityRosters: "./historical-city-rosters.json",
  historicalCharacterIdByCharacterId: "./historical-character-id-map.json",
  dialogues: "./dialogues.json",
  minigames: "./minigames.json",
  storyNodes: "./story-nodes.json",
  textEntries: "./text-entries.json",
  conditionGroups: "./condition-groups.json",
  effectBundles: "./effect-bundles.json",
};

export type ScriptEditorEntityRecord = {
  id: string;
  [key: string]: unknown;
};

export type ScriptEditorRuntimeRecord = Record<string, unknown>;

export type ScriptEditorKeyValueEntry = {
  key: string;
  label?: string | undefined;
  value: string;
};

export type ScriptEditorPersonTradeBinding = {
  enabled: boolean;
  entryId: string;
};

export type ScriptEditorMenuTargetFamily =
  | "dialogue"
  | "event"
  | "trade"
  | "minigame"
  | "info";

export type ScriptEditorMenuEntry = {
  id: string;
  label: string;
  menuFamily: string;
  targetFamily: ScriptEditorMenuTargetFamily;
  targetId: string;
  isVisible: boolean;
  isEnabled: boolean;
  disabledHint: string;
};

export type ScriptEditorAccessState =
  | "visible-enabled"
  | "visible-disabled"
  | "hidden";

export type ScriptEditorAccessRule = {
  state: ScriptEditorAccessState;
  blockedMessage: string;
  blockedSpeaker: string;
  guidance: string;
};

export type ScriptEditorBuildingEntryBinding = {
  defaultPersonId: string;
  onEnterEventId: string;
  onLeaveEventId: string;
  returnTarget: string;
};

export type ScriptEditorPersonRecord = ScriptEditorEntityRecord & {
  name: string;
  personType?: "NPC" | "角色";
  role?: string;
  title?: string;
  occupation?: string;
  biography?: string;
  cityId?: string;
  houseId?: string;
  portraitId?: string;
  portraitVariantId?: string | null | undefined;
  extendedAttributes?: ScriptEditorKeyValueEntry[];
  dialogueIds?: string[];
  eventIds?: string[];
  tradeBinding?: ScriptEditorPersonTradeBinding;
};

export type ScriptEditorCityRecord = ScriptEditorEntityRecord & {
  name: string;
  description?: string;
  menuEntries?: ScriptEditorMenuEntry[];
  access?: ScriptEditorAccessRule;
};

export type ScriptEditorBuildingRecord = ScriptEditorEntityRecord & {
  cityId: string;
  name: string;
  description?: string;
  menuEntries?: ScriptEditorMenuEntry[];
  access?: ScriptEditorAccessRule;
  entryBinding?: ScriptEditorBuildingEntryBinding;
};

export type ScriptEditorStoryProgressMode =
  | "block"
  | "wait"
  | "force-close";

export type ScriptEditorStoryNodeRecord = ScriptEditorEntityRecord & {
  title: string;
  chapterId?: string;
  summary?: string;
  progressMode?: ScriptEditorStoryProgressMode;
  relatedPersonIds?: string[];
  relatedDialogueIds?: string[];
  relatedEventIds?: string[];
};

export type ScriptEditorDialogueNodeType =
  | "narration"
  | "dialogue"
  | "choice";

export type ScriptEditorDialogueFollowUpTargetFamily =
  | "dialogue"
  | "event"
  | "city"
  | "building"
  | "minigame";

export type ScriptEditorDialogueNodeRecord = {
  id: string;
  nodeType: ScriptEditorDialogueNodeType;
  speakerPersonId: string;
  textId: string;
  nextNodeId: string;
  choiceTargetNodeId: string;
};

export type ScriptEditorDialogueFollowUp = {
  targetFamily: ScriptEditorDialogueFollowUpTargetFamily;
  targetId: string;
};

export type ScriptEditorDialogueRecord = ScriptEditorEntityRecord & {
  title: string;
  storyNodeId?: string;
  participantPersonIds?: string[];
  nodes?: ScriptEditorDialogueNodeRecord[];
  followUps?: ScriptEditorDialogueFollowUp[];
};

export type ScriptEditorEventTriggerTiming =
  | "manual"
  | "city-enter"
  | "building-enter"
  | "dialogue-finished"
  | "story-progress";

export type ScriptEditorConditionGroupOperator =
  | "all"
  | "any"
  | "not";

export type ScriptEditorConditionComparisonOperator =
  | "=="
  | "!="
  | ">="
  | "<="
  | ">"
  | "<";

export type ScriptEditorConditionNode =
  | {
      type: "group";
      operator: ScriptEditorConditionGroupOperator;
      conditions: ScriptEditorConditionNode[];
    }
  | {
      type: "flag";
      key: string;
      expected: boolean;
    }
  | {
      type: "variable";
      key: string;
      operator: ScriptEditorConditionComparisonOperator;
      value: number | string;
    }
  | {
      type: "task-status";
      taskId: string;
      status: "inactive" | "active" | "completed" | "failed";
    }
  | {
      type: "signal";
      signalType: string;
    }
  | {
      type: "elapsed-time";
      since: string;
      atLeastDays: number;
    }
  | {
      type: "event-fired";
      eventId: string;
      expected?: boolean;
    }
  | {
      type: "chapter";
      chapterId: string;
    }
  | {
      type: "location";
      cityId?: string;
      houseId?: string;
    }
  | {
      type: "character-exists" | "character-available";
      characterId: string;
      expected?: boolean;
    }
  | {
      type: "character-in-city";
      characterId: string;
      cityId: string;
    }
  | {
      type: "mission-status";
      missionId: string;
      status: "inactive" | "active" | "completed" | "failed";
    };

export type ScriptEditorConditionGroup = {
  id: string;
  operator: ScriptEditorConditionGroupOperator;
  conditions: ScriptEditorConditionNode[];
};

export type ScriptEditorEventConditionGroupMode = ScriptEditorConditionGroupOperator;

export type ScriptEditorEventConditionGroup = ScriptEditorConditionGroup;

export type ScriptEditorEventDestinationFamily =
  | "dialogue"
  | "event"
  | "city"
  | "building"
  | "minigame";

export type ScriptEditorEventDestination = {
  family: ScriptEditorEventDestinationFamily;
  targetId: string;
};

export type ScriptEditorEventRelationRecord = {
  storyNodeId?: string;
  personIds?: string[];
  cityIds?: string[];
  buildingIds?: string[];
};

export type ScriptEditorEventPreviewSummary = {
  previewNotes?: string;
  validationNotes?: string;
};

export type ScriptEditorMinigameOwnerKind =
  | "house"
  | "scene"
  | "task"
  | "external";

export type ScriptEditorMinigameReturnPolicy =
  | "resume-owner"
  | "reenter-owner"
  | "close-only";

export type ScriptEditorMinigameTriggerSource =
  | "manual"
  | "dialogue-follow-up"
  | "event-destination"
  | "location-menu"
  | "other";

export type ScriptEditorMinigameOutcome =
  | "success"
  | "failure"
  | "cancelled";

export type ScriptEditorMinigameOutcomeRoute = {
  id: string;
  outcome: ScriptEditorMinigameOutcome;
  handoffPolicy: ScriptEditorMinigameReturnPolicy;
  summary: string;
  effectHint: string;
};

export type ScriptEditorMinigameRecord = ScriptEditorEntityRecord & {
  title: string;
  description?: string;
  playableId?: string;
  integrationId?: string;
  ownerKind?: ScriptEditorMinigameOwnerKind;
  ownerId?: string;
  returnPolicy?: ScriptEditorMinigameReturnPolicy;
  triggerId?: string;
  triggerSource?: ScriptEditorMinigameTriggerSource;
  triggerEvent?: string;
  launchPayload?: ScriptEditorKeyValueEntry[];
  outcomeRoutes?: ScriptEditorMinigameOutcomeRoute[];
  notes?: string;
};

export type ScriptEditorActivityRecord = ScriptEditorEntityRecord & {
  label: string;
  handlerId: string;
};

export type ScriptEditorEventRecord = ScriptEditorEntityRecord & {
  title: string;
  description?: string;
  triggerTiming?: ScriptEditorEventTriggerTiming;
  repeatable?: boolean;
  conditionGroups?: ScriptEditorEventConditionGroup[];
  destination?: ScriptEditorEventDestination;
  relations?: ScriptEditorEventRelationRecord;
  previewSummary?: ScriptEditorEventPreviewSummary;
};

export type ScriptEditorStoryPackRecord = {
  id: string;
  title: string;
  description?: string;
  [key: string]: unknown;
};

export type ScriptEditorProjectCompletionState =
  | {
      state: "draft";
      completedAt?: undefined;
      completedBy?: undefined;
    }
  | {
      state: "complete";
      completedAt: string;
      completedBy: "runtime-export";
    };

export type ScriptEditorTextEntryRecord = ScriptEditorEntityRecord & {
  text?: string;
};

export type ScriptEditorProjectManifest = {
  schemaVersion: 1;
  kind: typeof SCRIPT_EDITOR_PROJECT_KIND;
  id: string;
  title: string;
  description?: string;
  completionState: ScriptEditorProjectCompletionState;
  files: Record<ScriptEditorProjectFileKey, string>;
};

export type ScriptEditorProjectDefinition = {
  schemaVersion: 1;
  kind: typeof SCRIPT_EDITOR_PROJECT_KIND;
  id: string;
  title: string;
  description?: string;
  completionState: ScriptEditorProjectCompletionState;
  storyPack: ScriptEditorStoryPackRecord;
  maps: ScriptEditorEntityRecord[];
  people: ScriptEditorPersonRecord[];
  cities: ScriptEditorCityRecord[];
  buildings: ScriptEditorBuildingRecord[];
  cityEntries: ScriptEditorEntityRecord[];
  events: ScriptEditorEventRecord[];
  scenes: ScriptEditorEntityRecord[];
  quests: ScriptEditorEntityRecord[];
  activities: ScriptEditorActivityRecord[];
  cards: ScriptEditorEntityRecord[];
  valuables: ScriptEditorEntityRecord[];
  cityNpcPools: ScriptEditorRuntimeRecord[];
  houseAccessRefusalRules: ScriptEditorEntityRecord[];
  houseModuleDefaults: Record<string, unknown>;
  cityPortraits: Record<string, string>;
  historicalCharacters: ScriptEditorEntityRecord[];
  historicalCityRosters: ScriptEditorRuntimeRecord[];
  historicalCharacterIdByCharacterId: Record<string, string>;
  dialogues: ScriptEditorDialogueRecord[];
  minigames: ScriptEditorMinigameRecord[];
  storyNodes: ScriptEditorStoryNodeRecord[];
  textEntries: ScriptEditorTextEntryRecord[];
  conditionGroups: ScriptEditorEntityRecord[];
  effectBundles: ScriptEditorEntityRecord[];
};
