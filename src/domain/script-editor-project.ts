export const SCRIPT_EDITOR_PROJECT_KIND = "script-editor-project";
export const SCRIPT_EDITOR_PROJECT_MANIFEST_FILE = "project.json";

export const SCRIPT_EDITOR_PROJECT_FILE_KEYS = [
  "storyPack",
  "people",
  "cities",
  "buildings",
  "events",
  "quests",
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
  people: "./people.json",
  cities: "./cities.json",
  buildings: "./buildings.json",
  events: "./events.json",
  quests: "./quests.json",
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

export type ScriptEditorKeyValueEntry = {
  key: string;
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

export type ScriptEditorEventConditionGroupMode =
  | "all"
  | "any"
  | "not";

export type ScriptEditorEventConditionItem = {
  id: string;
  conditionType: string;
  operator: string;
  value: string;
};

export type ScriptEditorEventConditionGroup = {
  id: string;
  mode: ScriptEditorEventConditionGroupMode;
  items: ScriptEditorEventConditionItem[];
};

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

export type ScriptEditorTextEntryRecord = ScriptEditorEntityRecord & {
  text?: string;
};

export type ScriptEditorProjectManifest = {
  schemaVersion: 1;
  kind: typeof SCRIPT_EDITOR_PROJECT_KIND;
  id: string;
  title: string;
  description?: string;
  files: Record<ScriptEditorProjectFileKey, string>;
};

export type ScriptEditorProjectDefinition = {
  schemaVersion: 1;
  kind: typeof SCRIPT_EDITOR_PROJECT_KIND;
  id: string;
  title: string;
  description?: string;
  storyPack: ScriptEditorStoryPackRecord;
  people: ScriptEditorPersonRecord[];
  cities: ScriptEditorCityRecord[];
  buildings: ScriptEditorBuildingRecord[];
  events: ScriptEditorEventRecord[];
  quests: ScriptEditorEntityRecord[];
  dialogues: ScriptEditorDialogueRecord[];
  minigames: ScriptEditorMinigameRecord[];
  storyNodes: ScriptEditorStoryNodeRecord[];
  textEntries: ScriptEditorTextEntryRecord[];
  conditionGroups: ScriptEditorEntityRecord[];
  effectBundles: ScriptEditorEntityRecord[];
};
