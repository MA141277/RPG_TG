import { parseScenarioPack } from "../scenario/scenario-pack-loader";
import {
  parseScriptEditorProject,
} from "./editor-project-loader";
import {
  compileScriptEditorProjectTasks,
  type ScriptEditorSharedRuleDiagnostic,
} from "./shared-rule-compiler";
import type {
  ScriptEditorDialogueRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorStoryNodeRecord,
  ScriptEditorStoryPackRecord,
  ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import type { ScenarioProfileDefinition } from "../../domain/scenario-profile";
import type { ActionNode, SceneDefinition } from "../../domain/action";

export type ScriptEditorRuntimeExportDiagnostic = {
  code:
    | "unsupported-family"
    | "missing-field"
    | "invalid-field"
    | "duplicate-id"
    | "runtime-pack-contract"
    | "missing-reference"
    | "unsupported-lowering";
  fieldPath: string;
  message: string;
};

type RuntimePackManifestFiles = {
  scenarioProfile: string;
  maps: string;
  characters: string;
  cities: string;
  houses: string;
  cityEntries: string;
  events: string;
  scenes: string;
  activities: string;
  tasks: string;
  textEntries: string;
  cards: string;
  valuables: string;
  cityNpcPools: string;
  houseAccessRefusalRules: string;
  houseModuleDefaults: string;
  cityPortraits: string;
  historicalCharacters: string;
  historicalCityRosters: string;
  historicalCharacterIdByCharacterId: string;
};

type RuntimePackManifest = {
  schemaVersion: 1;
  kind: "scenario-pack";
  id: string;
  title: string;
  description?: string;
  basePackId?: string;
  author?: string;
  version?: string;
  tags?: string[];
  files: RuntimePackManifestFiles;
};

const RUNTIME_PACK_MANIFEST_FILE = "pack.json";

const RUNTIME_PACK_CANONICAL_FILES: RuntimePackManifestFiles = {
  scenarioProfile: "./scenario-profile.json",
  maps: "./maps.json",
  characters: "./characters.json",
  cities: "./cities.json",
  houses: "./houses.json",
  cityEntries: "./city-entries.json",
  events: "./events.json",
  scenes: "./scenes.json",
  activities: "./activities.json",
  tasks: "./tasks.json",
  textEntries: "./text-entries.json",
  cards: "./cards.json",
  valuables: "./valuables.json",
  cityNpcPools: "./city-npc-pools.json",
  houseAccessRefusalRules: "./house-access-refusal-rules.json",
  houseModuleDefaults: "./house-module-defaults.json",
  cityPortraits: "./city-portraits.json",
  historicalCharacters: "./historical-characters.json",
  historicalCityRosters: "./historical-city-rosters.json",
  historicalCharacterIdByCharacterId: "./historical-character-id-map.json",
};

const DEFERRED_FAMILY_MESSAGES = {
  minigames:
    "minigames export is deferred in this bounded slice; activity/playable assembly belongs to a later export step.",
} as const;

export function validateScriptEditorProjectForRuntimeExport(
  value: ScriptEditorProjectDefinition
): ScriptEditorRuntimeExportDiagnostic[] {
  const project = parseScriptEditorProject(value);
  const diagnostics: ScriptEditorRuntimeExportDiagnostic[] = [];

  for (const [familyKey, message] of Object.entries(DEFERRED_FAMILY_MESSAGES) as [
    keyof typeof DEFERRED_FAMILY_MESSAGES,
    string,
  ][]) {
    if (project[familyKey].length > 0) {
      diagnostics.push({
        code: "unsupported-family",
        fieldPath: `project.${familyKey}`,
        message,
      });
    }
  }

  appendCompatibilityImportResidueDiagnostics(project.storyPack, diagnostics);

  appendActivityDiagnostics(project.activities, diagnostics);

  const scenarioProfile = extractScenarioProfile(project.storyPack, diagnostics);
  const exportedTextEntries = mapTextEntries(project.textEntries, diagnostics);
  const exportedScenes = lowerMinimalNarrativeScenes(project, diagnostics);
  const sharedRuleDiagnostics: ScriptEditorSharedRuleDiagnostic[] = [];
  const exportedTasks = compileScriptEditorProjectTasks(project, sharedRuleDiagnostics);
  appendSharedRuleDiagnostics(sharedRuleDiagnostics, diagnostics);

  if (
    diagnostics.length > 0 ||
    scenarioProfile == null ||
    exportedTextEntries == null ||
    exportedScenes == null ||
    exportedTasks == null
  ) {
    return diagnostics;
  }

  try {
    parseScenarioPack({
      schemaVersion: 1,
      id: project.storyPack.id,
      title: project.storyPack.title,
      ...(project.storyPack.description == null
        ? {}
        : { description: project.storyPack.description }),
      scenarioProfile,
      maps: project.maps,
      characters: project.people,
      cities: project.cities,
      houses: project.buildings,
      cityEntries: project.cityEntries,
      events: project.events,
      scenes: exportedScenes,
      activities: project.activities,
      tasks: exportedTasks,
      textEntries: exportedTextEntries,
      cards: project.cards,
      valuables: project.valuables,
      cityNpcPools: project.cityNpcPools,
      houseAccessRefusalRules: project.houseAccessRefusalRules,
      houseModuleDefaults: project.houseModuleDefaults,
      cityPortraits: project.cityPortraits,
      historicalCharacters: project.historicalCharacters,
      historicalCityRosters: project.historicalCityRosters,
      historicalCharacterIdByCharacterId: project.historicalCharacterIdByCharacterId,
    });
  } catch (error) {
    diagnostics.push({
      code: "runtime-pack-contract",
      fieldPath: "project.runtimePack",
      message:
        error instanceof Error
          ? error.message
          : "Runtime pack export failed scenario-pack contract validation.",
    });
  }

  return diagnostics;
}

export function exportScriptEditorProjectToScenarioPackFiles(
  value: ScriptEditorProjectDefinition
): Record<string, string> {
  const project = parseScriptEditorProject(value);
  const diagnostics = validateScriptEditorProjectForRuntimeExport(project);
  if (diagnostics.length > 0) {
    throw new Error(formatDiagnostics(diagnostics));
  }

  const scenarioProfile = extractScenarioProfile(project.storyPack, []);
  const exportedTextEntries = mapTextEntries(project.textEntries, []);
  const exportedScenes = lowerMinimalNarrativeScenes(project, []);
  const exportedTasks = compileScriptEditorProjectTasks(project, []);
  if (
    scenarioProfile == null ||
    exportedTextEntries == null ||
    exportedScenes == null ||
    exportedTasks == null
  ) {
    throw new Error(
      "Script editor runtime export validation unexpectedly failed after diagnostics passed."
    );
  }

  const manifest: RuntimePackManifest = {
    schemaVersion: 1,
    kind: "scenario-pack",
    id: project.storyPack.id,
    title: project.storyPack.title,
    ...(project.storyPack.description == null
      ? {}
      : { description: project.storyPack.description }),
    ...pickOptionalPackMetadata(project.storyPack),
    files: RUNTIME_PACK_CANONICAL_FILES,
  };

  return {
    [RUNTIME_PACK_MANIFEST_FILE]: stringifyJson(manifest),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.scenarioProfile)]: stringifyJson(
      scenarioProfile
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.maps)]: stringifyJson(
      project.maps
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.characters)]: stringifyJson(
      project.people
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cities)]: stringifyJson(
      project.cities
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.houses)]: stringifyJson(
      project.buildings
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cityEntries)]: stringifyJson(
      project.cityEntries
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.events)]: stringifyJson(
      project.events
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.scenes)]: stringifyJson(
      exportedScenes
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.activities)]: stringifyJson(
      project.activities
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.tasks)]: stringifyJson(
      exportedTasks
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.textEntries)]: stringifyJson(
      exportedTextEntries
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cards)]: stringifyJson(
      project.cards
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.valuables)]: stringifyJson(
      project.valuables
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cityNpcPools)]: stringifyJson(
      project.cityNpcPools
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.houseAccessRefusalRules)]: stringifyJson(
      project.houseAccessRefusalRules
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.houseModuleDefaults)]: stringifyJson(
      project.houseModuleDefaults
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cityPortraits)]: stringifyJson(
      project.cityPortraits
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.historicalCharacters)]: stringifyJson(
      project.historicalCharacters
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.historicalCityRosters)]: stringifyJson(
      project.historicalCityRosters
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.historicalCharacterIdByCharacterId)]: stringifyJson(
      project.historicalCharacterIdByCharacterId
    ),
  };
}

function extractScenarioProfile(
  storyPack: ScriptEditorStoryPackRecord,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): ScenarioProfileDefinition | null {
  const rawScenarioProfile = storyPack["scenarioProfile"];
  if (rawScenarioProfile == null || typeof rawScenarioProfile !== "object" || Array.isArray(rawScenarioProfile)) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: "project.storyPack.scenarioProfile",
      message:
        "storyPack.scenarioProfile is required to export a runtime-compatible scenario pack.",
    });
    return null;
  }

  const scenarioProfile = rawScenarioProfile as Record<string, unknown>;
  const initialLocation = readObject(
    scenarioProfile.initialLocation,
    "project.storyPack.scenarioProfile.initialLocation",
    diagnostics
  );

  const id = readString(
    scenarioProfile.id,
    "project.storyPack.scenarioProfile.id",
    diagnostics
  );
  const playerCharacterId = readString(
    scenarioProfile.playerCharacterId,
    "project.storyPack.scenarioProfile.playerCharacterId",
    diagnostics
  );
  const chapterId = readString(
    scenarioProfile.chapterId,
    "project.storyPack.scenarioProfile.chapterId",
    diagnostics
  );
  const mapId = readString(
    initialLocation?.mapId,
    "project.storyPack.scenarioProfile.initialLocation.mapId",
    diagnostics
  );
  const cityId = readString(
    initialLocation?.cityId,
    "project.storyPack.scenarioProfile.initialLocation.cityId",
    diagnostics
  );
  const view = readString(
    initialLocation?.view,
    "project.storyPack.scenarioProfile.initialLocation.view",
    diagnostics
  );

  if (
    id == null ||
    playerCharacterId == null ||
    chapterId == null ||
    mapId == null ||
    cityId == null ||
    view == null
  ) {
    return null;
  }

  const houseId = readNullableString(
    initialLocation?.houseId,
    "project.storyPack.scenarioProfile.initialLocation.houseId",
    diagnostics
  );

  return {
    ...cloneScenarioProfileRuntimeFields(scenarioProfile),
    id,
    title:
      typeof scenarioProfile.title === "string" && scenarioProfile.title.length > 0
        ? scenarioProfile.title
        : storyPack.title,
    playerCharacterId,
    chapterId,
    initialLocation: {
      mapId,
      cityId,
      houseId,
      view: view as ScenarioProfileDefinition["initialLocation"]["view"],
    },
  };
}

function cloneScenarioProfileRuntimeFields(
  scenarioProfile: Record<string, unknown>
): Partial<ScenarioProfileDefinition> {
  return cloneJsonCompatibleValue({
    ...(isCalendarDate(scenarioProfile.initialCalendar)
      ? { initialCalendar: scenarioProfile.initialCalendar }
      : {}),
    ...(isCoordinate(scenarioProfile.initialPlayerCoordinate)
      ? { initialPlayerCoordinate: scenarioProfile.initialPlayerCoordinate }
      : {}),
    ...(isInitialUi(scenarioProfile.initialUi)
      ? { initialUi: scenarioProfile.initialUi }
      : {}),
    ...(isInitialRuntime(scenarioProfile.initialRuntime)
      ? { initialRuntime: scenarioProfile.initialRuntime }
      : {}),
    ...(typeof scenarioProfile.entryEventId === "string" && scenarioProfile.entryEventId.length > 0
      ? { entryEventId: scenarioProfile.entryEventId }
      : {}),
    ...(typeof scenarioProfile.openingFlowId === "string" && scenarioProfile.openingFlowId.length > 0
      ? { openingFlowId: scenarioProfile.openingFlowId }
      : {}),
    ...(Array.isArray(scenarioProfile.tags) && scenarioProfile.tags.every((tag) => typeof tag === "string")
      ? { tags: scenarioProfile.tags }
      : {}),
  }) as Partial<ScenarioProfileDefinition>;
}

function isCalendarDate(value: unknown): value is ScenarioProfileDefinition["initialCalendar"] {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as Record<string, unknown>).year === "number" &&
    typeof (value as Record<string, unknown>).month === "number" &&
    typeof (value as Record<string, unknown>).day === "number"
  );
}

function isCoordinate(
  value: unknown
): value is NonNullable<ScenarioProfileDefinition["initialPlayerCoordinate"]> {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as Record<string, unknown>).x === "number" &&
    typeof (value as Record<string, unknown>).y === "number"
  );
}

function isInitialUi(value: unknown): value is ScenarioProfileDefinition["initialUi"] {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    (record.reviewDateText == null || typeof record.reviewDateText === "string") &&
    (record.mainHouseMissionText == null || typeof record.mainHouseMissionText === "string")
  );
}

function isInitialRuntime(
  value: unknown
): value is ScenarioProfileDefinition["initialRuntime"] {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    (record.flags == null || isBooleanRecord(record.flags)) &&
    (record.variables == null || isRuntimeVariableRecord(record.variables))
  );
}

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(
      (entry) => typeof entry === "boolean"
    )
  );
}

function isRuntimeVariableRecord(
  value: unknown
): value is Record<string, string | number> {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(
      (entry) => typeof entry === "string" || typeof entry === "number"
    )
  );
}

function mapTextEntries(
  textEntries: ScriptEditorTextEntryRecord[],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Record<string, string> | null {
  const exportedTextEntries: Record<string, string> = {};

  for (const [index, entry] of textEntries.entries()) {
    if (typeof entry.text !== "string" || entry.text.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.textEntries[${index}].text`,
        message: "Runtime export requires every text entry to provide a non-empty text string.",
      });
      continue;
    }

    if (Object.hasOwn(exportedTextEntries, entry.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.textEntries[${index}].id`,
        message: `Duplicate text entry id "${entry.id}" cannot be lowered into text-entries.json.`,
      });
      continue;
    }

    exportedTextEntries[entry.id] = entry.text;
  }

  return diagnostics.length === 0 ? exportedTextEntries : null;
}

function lowerMinimalNarrativeScenes(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): SceneDefinition[] | null {
  const storyNodeIds = new Set(project.storyNodes.map((storyNode) => storyNode.id));
  const textEntryIds = new Set(project.textEntries.map((entry) => entry.id));
  const loweredScenes: SceneDefinition[] = [];
  const sceneIds = new Set<string>();

  for (const [index, scene] of project.scenes.entries()) {
    if (typeof scene.id !== "string" || scene.id.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.scenes[${index}].id`,
        message: "Runtime scene export requires every imported scene to provide a non-empty id.",
      });
      continue;
    }
    if (sceneIds.has(scene.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.scenes[${index}].id`,
        message: `Duplicate scene id "${scene.id}" cannot be exported.`,
      });
      continue;
    }
    sceneIds.add(scene.id);
    loweredScenes.push(scene as unknown as SceneDefinition);
  }

  for (const [index, storyNode] of project.storyNodes.entries()) {
    appendUnsupportedStoryNodeDiagnostics(storyNode, index, diagnostics);
  }

  for (const [dialogueIndex, dialogue] of project.dialogues.entries()) {
    const scene = lowerDialogueToScene(
      dialogue,
      dialogueIndex,
      storyNodeIds,
      textEntryIds,
      diagnostics
    );
    if (scene == null) {
      continue;
    }
    if (sceneIds.has(scene.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.dialogues[${dialogueIndex}].id`,
        message: `Dialogue "${dialogue.id}" lowers to duplicate scene id "${scene.id}".`,
      });
      continue;
    }
    sceneIds.add(scene.id);
    loweredScenes.push(scene);
  }

  return diagnostics.length === 0 ? loweredScenes : null;
}

function appendUnsupportedStoryNodeDiagnostics(
  storyNode: ScriptEditorStoryNodeRecord,
  index: number,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  const relatedDialogueIds = storyNode.relatedDialogueIds ?? [];
  const relatedEventIds = storyNode.relatedEventIds ?? [];
  const relatedPersonIds = storyNode.relatedPersonIds ?? [];
  if (relatedDialogueIds.length > 0 || relatedEventIds.length > 0 || relatedPersonIds.length > 0) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.storyNodes[${index}]`,
      message:
        "Story node relation lowering is not supported in this minimal narrative export slice.",
    });
  }
}

function lowerDialogueToScene(
  dialogue: ScriptEditorDialogueRecord,
  dialogueIndex: number,
  storyNodeIds: Set<string>,
  textEntryIds: Set<string>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): SceneDefinition | null {
  if (dialogue.storyNodeId != null && dialogue.storyNodeId.length > 0 && !storyNodeIds.has(dialogue.storyNodeId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.dialogues[${dialogueIndex}].storyNodeId`,
      message: `Dialogue "${dialogue.id}" references missing story node "${dialogue.storyNodeId}".`,
    });
    return null;
  }

  const actions: ActionNode[] = [];
  const nodes = dialogue.nodes ?? [];
  for (const [nodeIndex, node] of nodes.entries()) {
    if (node.nodeType === "choice") {
      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}]`,
        message:
          "Choice dialogue nodes require a later branching narrative lowering step before runtime export.",
      });
      continue;
    }
    if (typeof node.textId !== "string" || node.textId.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].textId`,
        message: "Dialogue node export requires a non-empty textId.",
      });
      continue;
    }
    if (!textEntryIds.has(node.textId)) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes[${nodeIndex}].textId`,
        message: `Dialogue node references missing text entry "${node.textId}".`,
      });
      continue;
    }

    if (node.nodeType === "narration") {
      actions.push({ type: "narration", textId: node.textId });
      continue;
    }

    actions.push({
      type: "dialogue",
      characterId: node.speakerPersonId || "person.hero",
      side: "center",
      textId: node.textId,
    });
  }

  if (actions.length === 0) {
    const fallbackTextId = `text.${dialogue.id.replace(/^dialogue\./, "")}`;
    if (!textEntryIds.has(fallbackTextId)) {
      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `project.dialogues[${dialogueIndex}].nodes`,
        message:
          `Dialogue "${dialogue.id}" has no lowerable nodes and no matching fallback text entry "${fallbackTextId}".`,
      });
      return null;
    }
    actions.push({
      type: "dialogue",
      characterId: firstParticipantOrHero(dialogue),
      side: "center",
      textId: fallbackTextId,
    });
  }

  if ((dialogue.followUps ?? []).length > 0) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.dialogues[${dialogueIndex}].followUps`,
      message:
        "Dialogue follow-up lowering is not supported in this minimal narrative export slice.",
    });
  }

  return {
    id: `scene.${dialogue.id}`,
    name: dialogue.title || dialogue.id,
    actions,
  };
}

function firstParticipantOrHero(dialogue: ScriptEditorDialogueRecord): string {
  const firstParticipant = dialogue.participantPersonIds?.find(
    (participantId) => participantId.length > 0
  );
  return firstParticipant ?? "person.hero";
}

function pickOptionalPackMetadata(
  storyPack: ScriptEditorStoryPackRecord
): Partial<Pick<RuntimePackManifest, "basePackId" | "author" | "version" | "tags">> {
  return {
    ...(typeof storyPack["basePackId"] === "string"
      ? { basePackId: storyPack["basePackId"] }
      : {}),
    ...(typeof storyPack["author"] === "string"
      ? { author: storyPack["author"] }
      : {}),
    ...(typeof storyPack["version"] === "string"
      ? { version: storyPack["version"] }
      : {}),
    ...(Array.isArray(storyPack["tags"]) &&
    storyPack["tags"].every((tag) => typeof tag === "string")
      ? { tags: [...storyPack["tags"]] as string[] }
      : {}),
  };
}

function appendSharedRuleDiagnostics(
  sourceDiagnostics: ScriptEditorSharedRuleDiagnostic[],
  targetDiagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  targetDiagnostics.push(
    ...sourceDiagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      fieldPath: diagnostic.fieldPath,
      message: diagnostic.message,
    }))
  );
}

function appendActivityDiagnostics(
  activities: ScriptEditorProjectDefinition["activities"],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  for (const [index, activity] of activities.entries()) {
    if (!hasRequiredString(activity, "id")) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.activities[${index}].id`,
        message: "Activity export requires a non-empty id.",
      });
    }

    if (!hasRequiredString(activity, "label")) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.activities[${index}].label`,
        message: "Activity export requires a non-empty label.",
      });
    }

    if (!hasRequiredString(activity, "handlerId")) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `project.activities[${index}].handlerId`,
        message: "Activity export requires a non-empty handlerId.",
      });
    }

    if (activity.orderLineTextIds != null) {
      if (!Array.isArray(activity.orderLineTextIds)) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `project.activities[${index}].orderLineTextIds`,
          message: "Activity orderLineTextIds must be an array of text ids.",
        });
      } else if (
        activity.orderLineTextIds.some((value) => typeof value !== "string" || value.length === 0)
      ) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `project.activities[${index}].orderLineTextIds`,
          message: "Activity orderLineTextIds must contain only non-empty text ids.",
        });
      }
    }
  }
}

function hasRequiredString(
  value: Record<string, unknown>,
  key: string
): boolean {
  return typeof value[key] === "string" && (value[key] as string).length > 0;
}

function readObject(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Record<string, unknown> | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    diagnostics.push({
      code: value == null ? "missing-field" : "invalid-field",
      fieldPath,
      message: `${fieldPath} must be an object.`,
    });
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  if (typeof value !== "string" || value.length === 0) {
    diagnostics.push({
      code: value == null ? "missing-field" : "invalid-field",
      fieldPath,
      message: `${fieldPath} must be a non-empty string.`,
    });
    return null;
  }

  return value;
}

function readNullableString(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: `${fieldPath} must be a string or null.`,
    });
    return null;
  }

  return value;
}

function appendCompatibilityImportResidueDiagnostics(
  storyPack: ScriptEditorStoryPackRecord,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  const compatibilityImport = storyPack["compatibilityImport"];
  if (
    compatibilityImport == null ||
    typeof compatibilityImport !== "object" ||
    Array.isArray(compatibilityImport)
  ) {
    return;
  }

  const unresolvedFamilies = (compatibilityImport as Record<string, unknown>)[
    "unresolvedFamilies"
  ];
  if (
    unresolvedFamilies == null ||
    typeof unresolvedFamilies !== "object" ||
    Array.isArray(unresolvedFamilies)
  ) {
    return;
  }

  for (const familyKey of Object.keys(
    unresolvedFamilies as Record<string, unknown>
  ).sort()) {
    diagnostics.push({
      code: "unsupported-family",
      fieldPath: `project.storyPack.compatibilityImport.unresolvedFamilies.${familyKey}`,
      message:
        `Unresolved imported runtime family "${familyKey}" must be resolved or preserved by a later compatibility/export step before runtime export can proceed.`,
    });
  }
}

function formatDiagnostics(
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string {
  return [
    "Script editor runtime export validation failed.",
    ...diagnostics.map(
      (diagnostic) => `- ${diagnostic.fieldPath}: ${diagnostic.message}`
    ),
  ].join("\n");
}

function stripRelativePrefix(value: string): string {
  return value.startsWith("./") ? value.slice(2) : value;
}

function cloneJsonCompatibleValue(value: unknown): unknown {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function stringifyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
