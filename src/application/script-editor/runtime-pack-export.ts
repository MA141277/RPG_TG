import { parseScenarioPack } from "../scenario/scenario-pack-loader";
import {
  parseScriptEditorProject,
} from "./editor-project-loader";
import {
  compileScriptEditorProjectTasks,
  type ScriptEditorSharedRuleDiagnostic,
} from "./shared-rule-compiler";
import { materializeScriptEditorCityBuildingRuntimeFamilies } from "./city-building-runtime-materializer";
import { materializeScriptEditorDialogueStoryRuntime } from "./dialogue-story-runtime-materializer";
import { materializeScriptEditorPersonRuntimeCharacter } from "./person-authoring";
import type {
  ScriptEditorConditionNode,
  ScriptEditorEventRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorRuntimePackSchemaVersion,
  ScriptEditorStoryPackRecord,
} from "../../domain/script-editor-project";
import { SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION } from "../../domain/script-editor-project";
import type { ScenarioProfileDefinition } from "../../domain/scenario-profile";
import type { SceneDefinition } from "../../domain/action";
import type { EventDefinition, EventTriggerTiming } from "../../domain/event";
import type { RuntimeTaskInput } from "../../core/contracts/runtime-result";
import type {
  PlayableDefinition,
  PlayableIntegrationDefinition,
  PlayableOutcome,
  PlayableReturnPolicy,
} from "../../core/contracts/playable-runtime";
import {
  builtinPlayableDefinitionRegistry,
} from "../../core/registry/builtin-playable-definition-registry";

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
  playables: string;
  playableIntegrations: string;
  tasks: string;
  textEntries: string;
  cards: string;
  valuables: string;
  cityNpcPools: string;
  houseAccessRefusalRules: string;
  locationAccess: string;
  houseModuleDefaults: string;
  cityPortraits: string;
  historicalCharacters: string;
  historicalCityRosters: string;
  historicalCharacterIdByCharacterId: string;
};

type RuntimePackManifest = {
  schemaVersion: ScriptEditorRuntimePackSchemaVersion;
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
  playables: "./playables.json",
  playableIntegrations: "./playable-integrations.json",
  tasks: "./tasks.json",
  textEntries: "./text-entries.json",
  cards: "./cards.json",
  valuables: "./valuables.json",
  cityNpcPools: "./city-npc-pools.json",
  houseAccessRefusalRules: "./house-access-refusal-rules.json",
  locationAccess: "./location-access.json",
  houseModuleDefaults: "./house-module-defaults.json",
  cityPortraits: "./city-portraits.json",
  historicalCharacters: "./historical-characters.json",
  historicalCityRosters: "./historical-city-rosters.json",
  historicalCharacterIdByCharacterId: "./historical-character-id-map.json",
};

export function validateScriptEditorProjectForRuntimeExport(
  value: ScriptEditorProjectDefinition
): ScriptEditorRuntimeExportDiagnostic[] {
  const project = parseScriptEditorProject(value);
  const diagnostics: ScriptEditorRuntimeExportDiagnostic[] = [];

  appendCompatibilityImportResidueDiagnostics(project.storyPack, diagnostics);

  appendActivityDiagnostics(project.activities, diagnostics);
  const playableRuntimeFamilies = materializeScriptEditorPlayableRuntimeFamilies(
    project,
    diagnostics
  );

  const scenarioProfile = extractScenarioProfile(project.storyPack, diagnostics);
  const narrativeRuntime = materializeScriptEditorDialogueStoryRuntime(project);
  diagnostics.push(...narrativeRuntime.diagnostics);
  const exportedTextEntries = narrativeRuntime.textEntries;
  const exportedCharacters = materializeRuntimeCharacters(project);
  const cityBuildingRuntimeFamilies =
    materializeScriptEditorCityBuildingRuntimeFamilies(project);
  appendCityBuildingCustomAttributeDiagnostics(project, diagnostics);
  const exportedScenes = narrativeRuntime.scenes;
  const exportedEvents = extractRuntimeEvents(
    project,
    exportedScenes ?? [],
    diagnostics
  );
  const sharedRuleDiagnostics: ScriptEditorSharedRuleDiagnostic[] = [];
  const exportedTasks = compileScriptEditorProjectTasks(project, sharedRuleDiagnostics);
  appendSharedRuleDiagnostics(sharedRuleDiagnostics, diagnostics);

  if (
    diagnostics.length > 0 ||
    scenarioProfile == null ||
    exportedTextEntries == null ||
    exportedScenes == null ||
    exportedEvents == null ||
    exportedTasks == null
  ) {
    return diagnostics;
  }

  try {
    parseScenarioPack({
      schemaVersion: SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION,
      id: project.storyPack.id,
      title: project.storyPack.title,
      ...(project.storyPack.description == null
        ? {}
        : { description: project.storyPack.description }),
      scenarioProfile,
      maps: project.maps,
      characters: exportedCharacters,
      cities: cityBuildingRuntimeFamilies.cities,
      houses: cityBuildingRuntimeFamilies.houses,
      cityEntries: cityBuildingRuntimeFamilies.cityEntries,
      events: exportedEvents,
      scenes: exportedScenes,
      activities: project.activities,
      playables: playableRuntimeFamilies.playables,
      playableIntegrations: playableRuntimeFamilies.playableIntegrations,
      tasks: exportedTasks,
      textEntries: exportedTextEntries,
      cards: project.cards,
      valuables: project.valuables,
      cityNpcPools: cityBuildingRuntimeFamilies.cityNpcPools,
      houseAccessRefusalRules:
        cityBuildingRuntimeFamilies.houseAccessRefusalRules,
      locationAccess: cityBuildingRuntimeFamilies.locationAccess,
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

function appendCityBuildingCustomAttributeDiagnostics(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  project.cities.forEach((city, cityIndex) => {
    (city.extendedAttributes ?? []).forEach((entry, attributeIndex) => {
      const key = typeof entry.key === "string" ? entry.key.trim() : "";
      if (key.length === 0 || key === "specialDemand") {
        return;
      }

      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `project.cities[${cityIndex}].extendedAttributes[${attributeIndex}]`,
        message:
          `City custom attribute "${key}" cannot be exported to the current runtime CityDefinition contract.`,
      });
    });
  });

  project.buildings.forEach((building, buildingIndex) => {
    (building.extendedAttributes ?? []).forEach((entry, attributeIndex) => {
      const key = typeof entry.key === "string" ? entry.key.trim() : "";
      if (key.length === 0) {
        return;
      }

      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `project.buildings[${buildingIndex}].extendedAttributes[${attributeIndex}]`,
        message:
          `Building custom attribute "${key}" cannot be exported to the current runtime HouseDefinition contract.`,
      });
    });
  });
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
  const narrativeRuntime = materializeScriptEditorDialogueStoryRuntime(project);
  const exportedTextEntries = narrativeRuntime.textEntries;
  const exportedCharacters = materializeRuntimeCharacters(project);
  const cityBuildingRuntimeFamilies =
    materializeScriptEditorCityBuildingRuntimeFamilies(project);
  const exportedScenes = narrativeRuntime.scenes;
  const exportedEvents = extractRuntimeEvents(project, exportedScenes ?? [], []);
  const exportedTasks = compileScriptEditorProjectTasks(project, []);
  const playableRuntimeFamilies = materializeScriptEditorPlayableRuntimeFamilies(
    project,
    []
  );
  if (
    scenarioProfile == null ||
    exportedTextEntries == null ||
    exportedScenes == null ||
    exportedEvents == null ||
    exportedTasks == null
  ) {
    throw new Error(
      "Script editor runtime export validation unexpectedly failed after diagnostics passed."
    );
  }

  const manifest: RuntimePackManifest = {
    schemaVersion: SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION,
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
      exportedCharacters
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cities)]: stringifyJson(
      cityBuildingRuntimeFamilies.cities
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.houses)]: stringifyJson(
      cityBuildingRuntimeFamilies.houses
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cityEntries)]: stringifyJson(
      cityBuildingRuntimeFamilies.cityEntries
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.events)]: stringifyJson(
      exportedEvents
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.scenes)]: stringifyJson(
      exportedScenes
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.activities)]: stringifyJson(
      project.activities
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.playables)]: stringifyJson(
      playableRuntimeFamilies.playables
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.playableIntegrations)]: stringifyJson(
      playableRuntimeFamilies.playableIntegrations
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
      cityBuildingRuntimeFamilies.cityNpcPools
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.houseAccessRefusalRules)]: stringifyJson(
      cityBuildingRuntimeFamilies.houseAccessRefusalRules
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.locationAccess)]: stringifyJson(
      cityBuildingRuntimeFamilies.locationAccess
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

function materializeScriptEditorPlayableRuntimeFamilies(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): {
  playables: PlayableDefinition[];
  playableIntegrations: PlayableIntegrationDefinition[];
} {
  const playablesById = new Map<string, PlayableDefinition>();
  const playableIntegrations: PlayableIntegrationDefinition[] = [];
  const integrationIds = new Set<string>();

  for (const [index, minigame] of project.minigames.entries()) {
    const fieldPath = `project.minigames[${index}]`;
    const playableId = readRequiredTrimmedString(
      minigame.playableId,
      `${fieldPath}.playableId`,
      diagnostics
    );
    const integrationId = readRequiredTrimmedString(
      minigame.integrationId,
      `${fieldPath}.integrationId`,
      diagnostics
    );
    const ownerKind = readRequiredTrimmedString(
      minigame.ownerKind,
      `${fieldPath}.ownerKind`,
      diagnostics
    );
    const returnPolicy = readRequiredTrimmedString(
      minigame.returnPolicy,
      `${fieldPath}.returnPolicy`,
      diagnostics
    );
    const triggerId = readRequiredTrimmedString(
      minigame.triggerId,
      `${fieldPath}.triggerId`,
      diagnostics
    );
    const triggerEvent = readRequiredTrimmedString(
      minigame.triggerEvent,
      `${fieldPath}.triggerEvent`,
      diagnostics
    );

    if (
      playableId == null ||
      integrationId == null ||
      ownerKind == null ||
      returnPolicy == null ||
      triggerId == null ||
      triggerEvent == null
    ) {
      continue;
    }

    const definition = builtinPlayableDefinitionRegistry.get(playableId);
    if (definition == null || definition.family !== "minigame") {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `${fieldPath}.playableId`,
        message: `Minigame binding references unknown playable "${playableId}".`,
      });
      continue;
    }

    if (!isPlayableOwnerKind(ownerKind)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.ownerKind`,
        message: `Minigame binding ownerKind must be one of: house, scene, task, external.`,
      });
      continue;
    }

    if (!isPlayableReturnPolicy(returnPolicy)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.returnPolicy`,
        message:
          `Minigame binding returnPolicy must be one of: resume-owner, reenter-owner, close-only.`,
      });
      continue;
    }

    if (ownerKind !== "external" && (minigame.ownerId == null || minigame.ownerId.trim().length === 0)) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `${fieldPath}.ownerId`,
        message: `Minigame binding ownerId is required for ${ownerKind} owners.`,
      });
      continue;
    }

    if (integrationIds.has(integrationId)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `${fieldPath}.integrationId`,
        message: `Duplicate playable integration id "${integrationId}" cannot be exported.`,
      });
      continue;
    }

    const outcomeConfig = materializeMinigameOutcomeConfig(
      minigame.outcomeRoutes,
      fieldPath,
      diagnostics
    );
    if (outcomeConfig == null) {
      continue;
    }

    integrationIds.add(integrationId);
    playablesById.set(playableId, {
      id: definition.id,
      family: definition.family,
      commandPrefix: definition.commandPrefix,
    });
    playableIntegrations.push({
      editorRecordId: minigame.id,
      integrationId,
      playableId,
      ownerDefaults: {
        ownerKind,
        ownerId:
          ownerKind === "external" ? null : minigame.ownerId?.trim() ?? null,
        returnPolicy,
      },
      trigger: {
        triggerId,
        ownerKind,
        trigger: triggerEvent,
        ...materializeLaunchPayload(minigame.launchPayload),
      },
      outcomeConfig,
    } as PlayableIntegrationDefinition & { editorRecordId: string });
  }

  return {
    playables: Array.from(playablesById.values()),
    playableIntegrations,
  };
}

function materializeMinigameOutcomeConfig(
  outcomeRoutes: ScriptEditorProjectDefinition["minigames"][number]["outcomeRoutes"],
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): PlayableIntegrationDefinition["outcomeConfig"] | null {
  if (outcomeRoutes == null || outcomeRoutes.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `${fieldPath}.outcomeRoutes`,
      message: "Minigame binding requires at least one outcome route.",
    });
    return null;
  }

  const handoffByOutcome: Partial<Record<PlayableOutcome, PlayableReturnPolicy>> = {};
  for (const [index, route] of outcomeRoutes.entries()) {
    if (!isPlayableOutcome(route.outcome)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.outcomeRoutes[${index}].outcome`,
        message: "Minigame outcome route must be success, failure, or cancelled.",
      });
      continue;
    }
    if (!isPlayableReturnPolicy(route.handoffPolicy)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.outcomeRoutes[${index}].handoffPolicy`,
        message:
          "Minigame outcome route handoffPolicy must be resume-owner, reenter-owner, or close-only.",
      });
      continue;
    }
    handoffByOutcome[route.outcome] = route.handoffPolicy;
  }

  return Object.keys(handoffByOutcome).length === 0 ? null : { handoffByOutcome };
}

function materializeLaunchPayload(
  entries: ScriptEditorProjectDefinition["minigames"][number]["launchPayload"]
): Pick<PlayableIntegrationDefinition["trigger"], "launchPayload"> {
  const launchPayload = Object.fromEntries(
    (entries ?? [])
      .filter((entry) => entry.key.trim().length > 0)
      .map((entry) => [entry.key.trim(), entry.value])
  );
  return Object.keys(launchPayload).length === 0 ? {} : { launchPayload };
}

function readRequiredTrimmedString(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    diagnostics.push({
      code: value == null ? "missing-field" : "invalid-field",
      fieldPath,
      message: `${fieldPath} must be a non-empty string.`,
    });
    return null;
  }
  return value.trim();
}

function isPlayableOwnerKind(value: string): value is PlayableIntegrationDefinition["ownerDefaults"]["ownerKind"] & string {
  return value === "house" || value === "scene" || value === "task" || value === "external";
}

function isPlayableReturnPolicy(value: string): value is PlayableReturnPolicy {
  return value === "resume-owner" || value === "reenter-owner" || value === "close-only";
}

function isPlayableOutcome(value: string): value is PlayableOutcome {
  return value === "success" || value === "failure" || value === "cancelled";
}

function materializeRuntimeCharacters(
  project: ScriptEditorProjectDefinition
) {
  const defaultCityId = project.cities[0]?.id;
  return project.people.map((person) =>
    materializeScriptEditorPersonRuntimeCharacter(person, {
      ...(defaultCityId == null ? {} : { cityId: defaultCityId }),
      portraitId: "portrait.default",
    })
  );
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
    ...(isLaunchPolicy(scenarioProfile.launchPolicy)
      ? { launchPolicy: scenarioProfile.launchPolicy }
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

function extractRuntimeEvents(
  project: ScriptEditorProjectDefinition,
  exportedScenes: SceneDefinition[],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventDefinition[] | null {
  const runtimeEvents = project.storyPack.runtimeEvents;
  if (runtimeEvents == null) {
    return lowerEditorEventsToRuntimeEvents(project, exportedScenes, diagnostics);
  }

  if (!Array.isArray(runtimeEvents)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: "project.storyPack.runtimeEvents",
      message: "storyPack.runtimeEvents must be an array when present.",
    });
    return null;
  }

  const invalidIndex = runtimeEvents.findIndex(
    (eventDefinition) => !isRuntimeEventDefinition(eventDefinition)
  );
  if (invalidIndex >= 0) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `project.storyPack.runtimeEvents[${invalidIndex}]`,
      message:
        "storyPack.runtimeEvents entries must keep the runtime EventDefinition shape.",
    });
    return null;
  }

  return cloneJsonCompatibleValue(runtimeEvents) as EventDefinition[];
}

function lowerEditorEventsToRuntimeEvents(
  project: ScriptEditorProjectDefinition,
  exportedScenes: SceneDefinition[],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventDefinition[] | null {
  const scenarioProfile = project.storyPack.scenarioProfile;
  const chapterId =
    scenarioProfile != null &&
    typeof scenarioProfile === "object" &&
    !Array.isArray(scenarioProfile)
      ? (scenarioProfile as Record<string, unknown>).chapterId
      : undefined;
  if (typeof chapterId !== "string" || chapterId.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: "project.storyPack.scenarioProfile.chapterId",
      message: "Event export requires storyPack.scenarioProfile.chapterId.",
    });
    return null;
  }

  const sceneIds = new Set(exportedScenes.map((scene) => scene.id));
  const sourceEventIds = new Set(
    project.events
      .map((eventRecord) => eventRecord.id)
      .filter((eventId): eventId is string => typeof eventId === "string" && eventId.length > 0)
  );
  const sourceTaskIds = new Set(
    project.quests
      .map((questRecord) => questRecord.id)
      .filter((taskId): taskId is string => typeof taskId === "string" && taskId.length > 0)
  );
  const exportedEvents: EventDefinition[] = [];
  const eventIds = new Set<string>();
  for (const [index, eventRecord] of project.events.entries()) {
    const exportedEvent = lowerEditorEventToRuntimeEvent(
      eventRecord,
      index,
      chapterId,
      sceneIds,
      sourceEventIds,
      sourceTaskIds,
      diagnostics
    );
    if (exportedEvent == null) {
      continue;
    }
    if (eventIds.has(exportedEvent.id)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.events[${index}].id`,
        message: `Duplicate event id "${exportedEvent.id}" cannot be exported.`,
      });
      continue;
    }
    eventIds.add(exportedEvent.id);
    exportedEvents.push(exportedEvent);
  }

  return diagnostics.length === 0 ? exportedEvents : null;
}

function lowerEditorEventToRuntimeEvent(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  chapterId: string,
  sceneIds: Set<string>,
  sourceEventIds: Set<string>,
  sourceTaskIds: Set<string>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventDefinition | null {
  if (typeof eventRecord.id !== "string" || eventRecord.id.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `project.events[${eventIndex}].id`,
      message: "Event export requires a non-empty id.",
    });
    return null;
  }

  const destination = eventRecord.destination;
  if (
    destination == null ||
    destination.family !== "dialogue" ||
    typeof destination.targetId !== "string" ||
    destination.targetId.length === 0
  ) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.events[${eventIndex}].destination`,
      message:
        "Event export currently supports only editor events whose destination targets a dialogue.",
    });
    return null;
  }

  const entrySceneId = `scene.${destination.targetId}`;
  if (!sceneIds.has(entrySceneId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.events[${eventIndex}].destination.targetId`,
      message:
        `Event "${eventRecord.id}" targets dialogue "${destination.targetId}", but lowered scene "${entrySceneId}" is missing.`,
    });
    return null;
  }

  const conditions = lowerEventConditionGroups(
    eventRecord,
    eventIndex,
    diagnostics
  );
  if (conditions == null) {
    return null;
  }

  const triggerTiming = lowerEventTriggerTiming(
    eventRecord,
    eventIndex,
    diagnostics
  );
  if (triggerTiming == null) {
    return null;
  }

  const nextEventId = lowerEventNextEventId(
    eventRecord,
    eventIndex,
    sourceEventIds,
    diagnostics
  );
  if (nextEventId === null) {
    return null;
  }

  const taskInputs = lowerEventTaskInputs(
    eventRecord,
    eventIndex,
    sourceTaskIds,
    diagnostics
  );
  if (taskInputs === null) {
    return null;
  }

  return {
    id: eventRecord.id,
    chapterId,
    name: eventRecord.title || eventRecord.id,
    occurrence: eventRecord.repeatable === true ? "repeatable" : "once",
    trigger: {
      timing: triggerTiming,
      ...lowerEventTriggerScope(eventRecord, triggerTiming),
    },
    conditions,
    entrySceneId,
    ...(nextEventId.length === 0 ? {} : { nextEventId }),
    ...(taskInputs.length === 0 ? {} : { taskInputs }),
  };
}

function lowerEventTaskInputs(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  sourceTaskIds: Set<string>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): RuntimeTaskInput[] | null {
  if (eventRecord.taskInputs == null) {
    return [];
  }

  if (!Array.isArray(eventRecord.taskInputs)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `project.events[${eventIndex}].taskInputs`,
      message: "Event taskInputs must be an array when present.",
    });
    return null;
  }

  const loweredTaskInputs: RuntimeTaskInput[] = [];
  for (const [taskInputIndex, taskInput] of eventRecord.taskInputs.entries()) {
    const fieldPath = `project.events[${eventIndex}].taskInputs[${taskInputIndex}]`;
    const loweredTaskInput = lowerEventTaskInput(
      taskInput,
      fieldPath,
      sourceTaskIds,
      diagnostics
    );
    if (loweredTaskInput == null) {
      continue;
    }
    loweredTaskInputs.push(loweredTaskInput);
  }

  return diagnostics.length === 0 ? loweredTaskInputs : null;
}

function lowerEventTaskInput(
  value: RuntimeTaskInput,
  fieldPath: string,
  sourceTaskIds: Set<string>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): RuntimeTaskInput | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: "Event task input must be an object.",
    });
    return null;
  }

  const taskInput = value as Record<string, unknown>;
  if (typeof taskInput.type !== "string" || taskInput.type.length === 0) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.type`,
      message: "Event task input requires a non-empty type.",
    });
    return null;
  }

  if (
    taskInput.type === "start" ||
    taskInput.type === "complete" ||
    taskInput.type === "fail"
  ) {
    if (typeof taskInput.taskId !== "string" || taskInput.taskId.length === 0) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.taskId`,
        message: "Event task action input requires a non-empty taskId.",
      });
      return null;
    }

    if (!sourceTaskIds.has(taskInput.taskId)) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `${fieldPath}.taskId`,
        message: `Event task action references missing task "${taskInput.taskId}".`,
      });
      return null;
    }

    if (
      typeof taskInput.occurredAt !== "string" ||
      taskInput.occurredAt.length === 0
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.occurredAt`,
        message: "Event task action input requires a non-empty occurredAt.",
      });
      return null;
    }

    return cloneJsonCompatibleValue(taskInput) as RuntimeTaskInput;
  }

  if (
    typeof taskInput.source !== "string" ||
    taskInput.source.length === 0 ||
    typeof taskInput.occurredAt !== "string" ||
    taskInput.occurredAt.length === 0
  ) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message:
        "Event task signal input requires non-empty source and occurredAt fields.",
    });
    return null;
  }

  return cloneJsonCompatibleValue(taskInput) as RuntimeTaskInput;
}

function lowerEventNextEventId(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  sourceEventIds: Set<string>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  const nextEventId =
    typeof eventRecord.nextEventId === "string" ? eventRecord.nextEventId.trim() : "";
  if (nextEventId.length === 0) {
    return "";
  }

  if (!sourceEventIds.has(nextEventId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.events[${eventIndex}].nextEventId`,
      message:
        `Event "${eventRecord.id}" references missing next event "${nextEventId}".`,
    });
    return null;
  }

  return nextEventId;
}

function lowerEventConditionGroups(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventDefinition["conditions"] | null {
  const loweredConditions: EventDefinition["conditions"] = [];

  for (const [groupIndex, conditionGroup] of (eventRecord.conditionGroups ?? []).entries()) {
    if (conditionGroup.conditions.length === 0) {
      continue;
    }

    const loweredGroup = lowerEventConditionNode(
      {
        type: "group",
        operator: conditionGroup.operator,
        conditions: conditionGroup.conditions,
      },
      `project.events[${eventIndex}].conditionGroups[${groupIndex}]`,
      diagnostics
    );
    if (loweredGroup != null) {
      loweredConditions.push(loweredGroup);
    }
  }

  return diagnostics.length === 0 ? loweredConditions : null;
}

function lowerEventConditionNode(
  conditionNode: ScriptEditorConditionNode,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventDefinition["conditions"][number] | null {
  if (conditionNode.type === "group") {
    const loweredChildren = conditionNode.conditions.flatMap((childNode, index) => {
      const loweredChild = lowerEventConditionNode(
        childNode,
        `${fieldPath}.conditions[${index}]`,
        diagnostics
      );
      return loweredChild == null ? [] : [loweredChild];
    });

    if (loweredChildren.length !== conditionNode.conditions.length) {
      return null;
    }

    return {
      type: "group",
      operator: conditionNode.operator,
      conditions: loweredChildren,
    };
  }

  switch (conditionNode.type) {
    case "flag":
      if (conditionNode.key.length === 0) {
        pushInvalidEventConditionDiagnostic(
          fieldPath,
          "Flag event condition requires a non-empty key.",
          diagnostics
        );
        return null;
      }

      return { ...conditionNode };
    case "variable":
      if (conditionNode.key.length === 0) {
        pushInvalidEventConditionDiagnostic(
          fieldPath,
          "Variable event condition requires a non-empty key.",
          diagnostics
        );
        return null;
      }

      return { ...conditionNode };
    case "event-fired":
      if (conditionNode.eventId.length === 0) {
        pushInvalidEventConditionDiagnostic(
          fieldPath,
          "Event-fired condition requires a non-empty eventId.",
          diagnostics
        );
        return null;
      }

      return { ...conditionNode };
    case "chapter":
      if (conditionNode.chapterId.length === 0) {
        pushInvalidEventConditionDiagnostic(
          fieldPath,
          "Chapter condition requires a non-empty chapterId.",
          diagnostics
        );
        return null;
      }

      return { ...conditionNode };
    case "location":
      if (
        (conditionNode.cityId == null || conditionNode.cityId.length === 0) &&
        (conditionNode.houseId == null || conditionNode.houseId.length === 0)
      ) {
        pushInvalidEventConditionDiagnostic(
          fieldPath,
          "Location condition requires cityId or houseId.",
          diagnostics
        );
        return null;
      }

      return { ...conditionNode };
    case "character-exists":
    case "character-available":
      if (conditionNode.characterId.length === 0) {
        pushInvalidEventConditionDiagnostic(
          fieldPath,
          "Character condition requires a non-empty characterId.",
          diagnostics
        );
        return null;
      }

      return { ...conditionNode };
    case "character-in-city":
      if (conditionNode.characterId.length === 0 || conditionNode.cityId.length === 0) {
        pushInvalidEventConditionDiagnostic(
          fieldPath,
          "Character-in-city condition requires characterId and cityId.",
          diagnostics
        );
        return null;
      }

      return { ...conditionNode };
    case "mission-status":
      if (conditionNode.missionId.length === 0) {
        pushInvalidEventConditionDiagnostic(
          fieldPath,
          "Mission-status condition requires a non-empty missionId.",
          diagnostics
        );
        return null;
      }

      return { ...conditionNode };
    case "task-status":
    case "signal":
    case "elapsed-time":
      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath,
        message:
          `Event condition export does not support task-only condition type "${conditionNode.type}".`,
      });
      return null;
  }
}

function pushInvalidEventConditionDiagnostic(
  fieldPath: string,
  message: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  diagnostics.push({
    code: "invalid-field",
    fieldPath,
    message,
  });
}

function lowerEventTriggerTiming(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventTriggerTiming | null {
  switch (eventRecord.triggerTiming ?? "manual") {
    case "manual":
      return "manual";
    case "city-enter":
      return "city-enter";
    case "building-enter":
      return "house-enter";
    default:
      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `project.events[${eventIndex}].triggerTiming`,
        message:
          `Event trigger "${eventRecord.triggerTiming}" requires a later runtime trigger lowering step.`,
      });
      return null;
  }
}

function lowerEventTriggerScope(
  eventRecord: ScriptEditorEventRecord,
  timing: EventTriggerTiming
): Pick<EventDefinition["trigger"], "scope"> {
  if (timing === "city-enter") {
    const cityId = eventRecord.relations?.cityIds?.find((id) => id.length > 0);
    return cityId == null ? {} : { scope: { cityId } };
  }

  if (timing === "house-enter") {
    const houseId = eventRecord.relations?.buildingIds?.find((id) => id.length > 0);
    return houseId == null ? {} : { scope: { houseId } };
  }

  return {};
}

function isRuntimeEventDefinition(value: unknown): value is EventDefinition {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const eventDefinition = value as Record<string, unknown>;
  const trigger = eventDefinition.trigger;
  return (
    typeof eventDefinition.id === "string" &&
    typeof eventDefinition.chapterId === "string" &&
    typeof eventDefinition.name === "string" &&
    typeof eventDefinition.entrySceneId === "string" &&
    (eventDefinition.occurrence === "once" ||
      eventDefinition.occurrence === "repeatable" ||
      eventDefinition.occurrence === "once-per-chapter") &&
    Array.isArray(eventDefinition.conditions) &&
    (eventDefinition.participants == null ||
      Array.isArray(eventDefinition.participants)) &&
    trigger != null &&
    typeof trigger === "object" &&
    !Array.isArray(trigger) &&
    typeof (trigger as Record<string, unknown>).timing === "string"
  );
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

function isLaunchPolicy(
  value: unknown
): value is NonNullable<ScenarioProfileDefinition["launchPolicy"]> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    (record.characterSelection == null ||
      record.characterSelection === "shell" ||
      record.characterSelection === "fixed") &&
    (record.initialView == null ||
      (typeof record.initialView === "string" && record.initialView.length > 0)) &&
    (record.entryEventTiming == null ||
      record.entryEventTiming === "immediate" ||
      record.entryEventTiming === "after-map-entry")
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
