import type { HouseDefinition } from "../../../domain/house";
import type {
  EventOccurrence,
  EventParticipant,
  EventRouteCommand,
} from "../../../domain/event";
import type {
  LocationAccessConditionExpression,
  LocationAccessConditionSubject,
  LocationAccessValueRef,
} from "../../../domain/location-access";
import type { RuntimeTaskInput } from "./script-editor-runtime-result-contract";
import type { FlowNode } from "../../../domain/playables/flow";
import type {
  PortraitResourceDefinition,
  PortraitVariantDefinition,
} from "../../../domain/portrait-resource";
import type {
  ProgressTierDefinition,
  ProgressTrackBinding,
  ProgressTrackDefinition,
} from "../../../core/contracts/progression-runtime";
import type {
  MenuEntryDefinition,
  MenuInstanceDefinition,
  MenuResourceDefinition,
  MenuTargetFamily,
} from "../../../domain/menu";
import type { DialogueSide } from "../../../domain/dialogue";
import type {
  ScriptEditorPersonAttributeMapping,
  ScriptEditorPersonAttributeValue,
  ScriptEditorPersonSemanticBinding,
} from "../../../core/contracts/script-editor-person-attributes";
export type {
  ScriptEditorPersonAttributeMapping,
  ScriptEditorPersonAttributeValue,
  ScriptEditorPersonSemanticBinding,
} from "../../../core/contracts/script-editor-person-attributes";

export const SCRIPT_EDITOR_PROJECT_KIND = "script-editor-project";
export const SCRIPT_EDITOR_PROJECT_MANIFEST_FILE = "project.json";
export const SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION = 1;
export const SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION = 1;

export type ScriptEditorProjectSchemaVersion =
  typeof SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION;
export type ScriptEditorRuntimePackSchemaVersion =
  typeof SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION;

export const SCRIPT_EDITOR_PROJECT_FILE_KEYS = [
  "storyPack",
  "maps",
  "people",
  "cities",
  "buildings",
  "buildingArrangements",
  "cityEntries",
  "settlements",
  "events",
  "eventBindings",
  "progressTracks",
  "progressTrackBindings",
  "menuResources",
  "menuInstances",
  "quests",
  "activities",
  "cards",
  "valuables",
  "cityNpcPools",
  "houseModuleDefaults",
  "portraits",
  "portraitVariants",
  "cityPortraits",
  "historicalCharacters",
  "historicalCityRosters",
  "historicalCharacterIdByCharacterId",
  "dialogues",
  "minigames",
  "flows",
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
  buildingArrangements: "./building-arrangements.json",
  cityEntries: "./city-entries.json",
  settlements: "./settlements.json",
  events: "./events.json",
  eventBindings: "./event-bindings.json",
  progressTracks: "./progress-tracks.json",
  progressTrackBindings: "./progress-track-bindings.json",
  menuResources: "./menu-resources.json",
  menuInstances: "./menu-instances.json",
  quests: "./quests.json",
  activities: "./activities.json",
  cards: "./cards.json",
  valuables: "./valuables.json",
  cityNpcPools: "./city-npc-pools.json",
  houseModuleDefaults: "./house-module-defaults.json",
  portraits: "./portraits.json",
  portraitVariants: "./portrait-variants.json",
  cityPortraits: "./city-portraits.json",
  historicalCharacters: "./historical-characters.json",
  historicalCityRosters: "./historical-city-rosters.json",
  historicalCharacterIdByCharacterId: "./historical-character-id-map.json",
  dialogues: "./dialogues.json",
  minigames: "./minigames.json",
  flows: "./flows.json",
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

export type ScriptEditorTypedAttributeType =
  | "number"
  | "boolean"
  | "enum"
  | "string";

export type ScriptEditorTypedAttributeRecord = {
  key: string;
  label?: string | undefined;
  type: ScriptEditorTypedAttributeType;
  value?: string | number | boolean | undefined;
  options?: string[] | undefined;
};

export type ScriptEditorKeyValueEntry = {
  key: string;
  label?: string | undefined;
  value: string;
};

export type ScriptEditorPersonTradeBinding = {
  enabled: boolean;
  entryId: string;
};

export type ScriptEditorPersonAttributeGroup = {
  title: string;
  order: number;
  attributeKeys: string[];
};

export type ScriptEditorPortraitResourceRecord = PortraitResourceDefinition;
export type ScriptEditorPortraitVariantRecord = PortraitVariantDefinition;
export type ScriptEditorProgressTrackTierRecord = ProgressTierDefinition;
export type ScriptEditorProgressTrackRecord = ProgressTrackDefinition;
export type ScriptEditorProgressTrackBindingRecord = ProgressTrackBinding;

export type ScriptEditorMenuTargetFamily = MenuTargetFamily;
export type ScriptEditorMenuEntry = MenuEntryDefinition;
export type ScriptEditorMenuResourceRecord = MenuResourceDefinition;
export type ScriptEditorMenuInstanceRecord = MenuInstanceDefinition;

export type {
  LocationAccessConditionExpression,
  LocationAccessConditionSubject,
  LocationAccessValueRef,
};

export type ScriptEditorAccessRule = {
  conditionExpression?: LocationAccessConditionExpression | undefined;
  leaveConditionExpression?: LocationAccessConditionExpression | undefined;
  blockedReason?: string | undefined;
  blockedTitle?: string | undefined;
  blockedMessage?: string | undefined;
  blockedDialogueId?: string | undefined;
  blockedSpeakerId?: string | "player" | undefined;
  guidance?: string | undefined;
};

export type ScriptEditorBuildingEntryBinding = {
  defaultPersonId: string;
  returnTarget: string;
};

export type ScriptEditorLegacyPersonRecord = ScriptEditorEntityRecord & {
  name: string;
  personType?: "NPC" | "角色";
};

export type ScriptEditorPersonLegacyFieldSet = {
  role?: string;
  title?: string;
  occupation?: string;
  biography?: string;
  cityId?: string;
  houseId?: string;
  portraitId?: string;
  portraitVariantId?: string | null | undefined;
  extendedAttributes?: ScriptEditorTypedAttributeRecord[];
  dialogueIds?: string[];
  eventIds?: string[];
  tradeBinding?: ScriptEditorPersonTradeBinding;
  birthYear?: number;
  deathYear?: number | null;
  age?: number;
  clanId?: string;
  affiliationLabel?: string;
  stamina?: number;
  stats?: Record<string, unknown>;
  skills?: Record<string, unknown>;
  availableFunctions?: unknown[];
  customProperties?: Record<string, string | number | boolean>;
  onTalkDialogueId?: string;
  teachableSkillKeys?: string[];
  flags?: string[];
  isHistoricalFigure?: boolean;
  leaderResidenceEligible?: boolean;
  leaderResidenceStatus?: string;
};

export type ScriptEditorPersonRecord = ScriptEditorEntityRecord & {
  name: string;
  personType: "NPC" | "角色";
  attributeGroup: Record<string, ScriptEditorPersonAttributeGroup>;
  attributeMappings: ScriptEditorPersonAttributeMapping[];
  attributeValues: ScriptEditorPersonAttributeValue[];
};

export type ScriptEditorCityRecord = ScriptEditorEntityRecord & {
  name: string;
  regionId?: string;
  mapNodeId?: string;
  mapPlacement?: {
    placementMode?: "coordinate" | "grid-index";
    mapId?: string;
    mapNodeId?: string;
    gridIndex?: number;
    x: number;
    y: number;
    kind?: "city" | "settlement" | "fort";
    label?: string;
    summary?: string;
  };
  backgroundId?: string;
  houseIds?: string[];
  mountedBuildings?: ScriptEditorCityMountedBuilding[];
  neighbourCityIds?: string[];
  travelCost?: number;
  baseAttributes?: {
    ownerFactionId?: string;
    prosperity?: number;
    security?: number;
  };
  profileMap?: {
    displayName?: string;
    description?: string;
    tags?: string[];
  };
  extendedAttributes?: ScriptEditorTypedAttributeRecord[];
  description?: string;
  menuEntries?: ScriptEditorMenuEntry[];
  menuInstanceIds?: string[];
  access?: ScriptEditorAccessRule;
};

export type ScriptEditorCityMountedBuilding = {
  buildingId: string;
  npcIds: string[];
  primaryNpcId: string | null;
};

export type ScriptEditorBuildingContainerType =
  | "character-seats"
  | "action-menu"
  | "status-panel"
  | "text-panel"
  | "image-panel"
  | "resource-panel";

export type ScriptEditorBuildingContainerSource =
  | {
      type: "arrangement-mounted-npcs";
      includeNpcIds?: string[] | undefined;
    }
  | {
      type: "static-records";
      recordIds: string[];
    };

export type ScriptEditorBuildingContainerActionItem = {
  id: string;
  label: string;
  eventId: string;
  isVisible?: boolean | undefined;
  isEnabled?: boolean | undefined;
  disabledHint?: string | undefined;
};

export type ScriptEditorBuildingLayoutTemplateId =
  | "default-shell"
  | "meeting-stage";

export type ScriptEditorBuildingLayoutNodeKind =
  | "header"
  | "description"
  | "character-seats"
  | "action-menu"
  | "leave-action"
  | "fallback-panels";

export type ScriptEditorBuildingLayoutCharacterFilter =
  | "all"
  | "primary"
  | "secondary";

export type ScriptEditorBuildingLayoutActionFilter =
  | "all"
  | "non-leave"
  | "leave-only";

export type ScriptEditorBuildingLayoutNodeRecord = {
  id: string;
  kind: ScriptEditorBuildingLayoutNodeKind;
  regionId: string;
  sourceContainerId?: string | undefined;
  sourceContainerType?: ScriptEditorBuildingContainerType | undefined;
  presentation?: string | undefined;
  characterFilter?: ScriptEditorBuildingLayoutCharacterFilter | undefined;
  actionFilter?: ScriptEditorBuildingLayoutActionFilter | undefined;
  previewSelectable?: boolean | undefined;
  previewDraggable?: boolean | undefined;
  previewDropTarget?: boolean | undefined;
  clickActionId?: string | undefined;
};

export type ScriptEditorBuildingLayoutRecord = {
  templateId: ScriptEditorBuildingLayoutTemplateId;
  shellClassNames?: string[] | undefined;
  nodes?: ScriptEditorBuildingLayoutNodeRecord[] | undefined;
};

export type ScriptEditorBuildingContainerRecord = {
  id: string;
  type: ScriptEditorBuildingContainerType;
  title?: string | undefined;
  source?: ScriptEditorBuildingContainerSource | undefined;
  /**
   * Legacy compatibility residue only. Project loading rejects action-menu items
   * and requires registry-owned menu resources/instances instead.
   */
  items?: ScriptEditorBuildingContainerActionItem[] | undefined;
};

export type ScriptEditorBuildingArrangementRecord = ScriptEditorEntityRecord & {
  cityId: string;
  buildingId: string;
  displayName?: string | undefined;
  description?: string | undefined;
  backgroundId?: string | undefined;
  layout?: ScriptEditorBuildingLayoutRecord | undefined;
  mountedNpcIds: string[];
  primaryNpcId: string | null;
  containers: ScriptEditorBuildingContainerRecord[];
  visibleRule?: ScriptEditorAccessRule | undefined;
  enterRule?: ScriptEditorAccessRule | undefined;
  exitRule?: ScriptEditorAccessRule | undefined;
};

export type ScriptEditorBuildingRecord = ScriptEditorEntityRecord & {
  cityId: string;
  name: string;
  backgroundId?: string;
  baseAttributes?: {
    houseType: HouseDefinition["type"];
    activityLocationId?: HouseDefinition["activityLocationId"];
    moduleId?: HouseDefinition["moduleId"];
    characterIds: string[];
    defaultCharacterId: string | null;
    level?: number;
    damaged?: boolean;
    outputMultiplier?: number;
    visibleStoryStages?: string[];
    enterableStoryStages?: string[];
    requiresPlayerCurrentCityMatch?: boolean;
  };
  profileMap?: {
    displayName?: string;
    description?: string;
    tags?: string[];
  };
  extendedAttributes?: ScriptEditorTypedAttributeRecord[];
  description?: string;
  menuEntries?: ScriptEditorMenuEntry[];
  menuInstanceIds?: string[];
  access?: ScriptEditorAccessRule;
  entryBinding?: ScriptEditorBuildingEntryBinding;
  backAction?: HouseDefinition["backAction"];
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
  | "background"
  | "music"
  | "narration"
  | "dialogue"
  | "choice";

export type ScriptEditorDialogueFollowUpTargetFamily =
  | "dialogue"
  | "event"
  | "task"
  | "city"
  | "building"
  | "minigame";

export type ScriptEditorDialogueNodeRecord = {
  id: string;
  nodeType: ScriptEditorDialogueNodeType;
  speakerPersonId: string;
  backgroundId?: string;
  musicId?: string;
  loop?: boolean;
  side?: DialogueSide;
  portraitId?: string;
  textId: string;
  nextNodeId: string;
  choiceTargetNodeId: string;
};

export type ScriptEditorDialogueFollowUp = {
  targetFamily: ScriptEditorDialogueFollowUpTargetFamily;
  targetId: string;
};

export type ScriptEditorDialogueMode = "linear" | "choice";

export type ScriptEditorDialogueCastRecord = {
  personId: string;
  side: DialogueSide;
};

export type ScriptEditorDialogueOptionRecord = {
  id: string;
  textId: string;
  nextEventId: string;
};

export type ScriptEditorDialogueRecord = ScriptEditorEntityRecord & {
  title: string;
  mode?: ScriptEditorDialogueMode;
  textId?: string;
  speakerPersonId?: string;
  cast?: ScriptEditorDialogueCastRecord[];
  nextEventId?: string;
  options?: ScriptEditorDialogueOptionRecord[];
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

export type ScriptEditorEventDestinationFamily =
  | "dialogue"
  | "event"
  | "menu"
  | "minigame"
  | "task";

export type ScriptEditorEventType = "settlement" | "menu";

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

export type ScriptEditorSettlementContentRecord = {
  targetFamily: "person" | "city" | "building";
  targetId: string;
  attributeKey: string;
  attributeType: "number" | "boolean" | "enum";
  operation: "add" | "subtract" | "set";
  value: string | number | boolean;
};

export type ScriptEditorSettlementRecord = ScriptEditorEntityRecord & {
  title: string;
  nextEventId?: string;
  contents?: ScriptEditorSettlementContentRecord[];
};

export type ScriptEditorMinigameOwnerKind =
  | "house"
  | "scene"
  | "dialogue"
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

export type ScriptEditorPlayableConfigValueType =
  | "number"
  | "text"
  | "boolean"
  | "enum";

export type ScriptEditorPlayableConfigEntry = {
  id: string;
  label: string;
  valueType: ScriptEditorPlayableConfigValueType;
  value: string | number | boolean | null;
  notes?: string;
  enumOptions?: Array<{ value: string; label: string }>;
};

export type ScriptEditorPlayableMetricRule = {
  metricKey: string;
  operator: ">" | ">=" | "<" | "<=" | "=";
  value: string | number | boolean;
};

export type ScriptEditorPlayableSettlementRouteConditions = {
  outcomeIn?: ScriptEditorMinigameOutcome[];
  scoreMin?: number;
  scoreMax?: number;
  metricRules?: ScriptEditorPlayableMetricRule[];
};

export type ScriptEditorPlayableSettlementRoute = {
  id: string;
  title: string;
  enabled: boolean;
  targetEventId: string;
  conditions: ScriptEditorPlayableSettlementRouteConditions;
};

export type ScriptEditorMinigameRecord = ScriptEditorEntityRecord & {
  title: string;
  description?: string;
  playableId?: string;
  configEntries?: ScriptEditorPlayableConfigEntry[];
  settlementRoutes?: ScriptEditorPlayableSettlementRoute[];
  integrationId?: string;
  settlementId?: string;
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

export type ScriptEditorFlowOwnerKind =
  | "building"
  | "dialogue"
  | "task"
  | "external";

export type ScriptEditorFlowTriggerSource =
  | "manual"
  | "event-destination"
  | "container-item"
  | "other";

export type ScriptEditorFlowRecord = ScriptEditorEntityRecord & {
  title: string;
  description?: string;
  initialNodeId: string;
  nodes: FlowNode[];
  outcomeRoutes: ScriptEditorMinigameOutcomeRoute[];
  notes?: string;
};

export type ScriptEditorActivityRecord = ScriptEditorEntityRecord & {
  label: string;
  handlerId: string;
};

export type ScriptEditorEventRecord = ScriptEditorEntityRecord & {
  title: string;
  description?: string;
  chapterId?: string;
  occurrence?: EventOccurrence;
  type?: ScriptEditorEventType;
  participants?: EventParticipant[];
  actions?: EventRouteCommand[];
  settlementId?: string;
  tags?: string[];
  triggerTiming?: ScriptEditorEventTriggerTiming;
  repeatable?: boolean;
  nextEventId?: string;
  taskInputs?: RuntimeTaskInput[];
  destination?: ScriptEditorEventDestination;
  relations?: ScriptEditorEventRelationRecord;
  previewSummary?: ScriptEditorEventPreviewSummary;
};

export type ScriptEditorEventBindingRecord = ScriptEditorEntityRecord & {
  eventId: string;
  owner: {
    family: string;
    id?: string;
    [key: string]: unknown;
  };
  trigger: {
    timing: string;
    action: string;
    payloadSchemaId?: string;
    [key: string]: unknown;
  };
  conditions?: unknown;
  priority?: number;
  enabled?: boolean;
  meta?: Record<string, unknown>;
};

export type ScriptEditorStoryPackRecord = {
  id: string;
  title: string;
  description?: string;
  personAttributeSemantics?: ScriptEditorPersonSemanticBinding[];
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
  schemaVersion: ScriptEditorProjectSchemaVersion;
  kind: typeof SCRIPT_EDITOR_PROJECT_KIND;
  id: string;
  title: string;
  description?: string;
  completionState: ScriptEditorProjectCompletionState;
  files: Record<ScriptEditorProjectFileKey, string>;
};

export type ScriptEditorProjectDefinition = {
  schemaVersion: ScriptEditorProjectSchemaVersion;
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
  buildingArrangements: ScriptEditorBuildingArrangementRecord[];
  cityEntries: ScriptEditorEntityRecord[];
  settlements: ScriptEditorSettlementRecord[];
  events: ScriptEditorEventRecord[];
  eventBindings: ScriptEditorEventBindingRecord[];
  progressTracks?: ScriptEditorProgressTrackRecord[];
  progressTrackBindings?: ScriptEditorProgressTrackBindingRecord[];
  menuResources: ScriptEditorMenuResourceRecord[];
  menuInstances: ScriptEditorMenuInstanceRecord[];
  quests: ScriptEditorEntityRecord[];
  activities: ScriptEditorActivityRecord[];
  cards: ScriptEditorEntityRecord[];
  valuables: ScriptEditorEntityRecord[];
  cityNpcPools: ScriptEditorRuntimeRecord[];
  houseModuleDefaults: Record<string, unknown>;
  portraits: ScriptEditorPortraitResourceRecord[];
  portraitVariants: ScriptEditorPortraitVariantRecord[];
  cityPortraits: Record<string, string>;
  historicalCharacters: ScriptEditorEntityRecord[];
  historicalCityRosters: ScriptEditorRuntimeRecord[];
  historicalCharacterIdByCharacterId: Record<string, string>;
  dialogues: ScriptEditorDialogueRecord[];
  minigames: ScriptEditorMinigameRecord[];
  flows: ScriptEditorFlowRecord[];
  storyNodes: ScriptEditorStoryNodeRecord[];
  textEntries: ScriptEditorTextEntryRecord[];
  conditionGroups: ScriptEditorEntityRecord[];
  effectBundles: ScriptEditorEntityRecord[];
};
