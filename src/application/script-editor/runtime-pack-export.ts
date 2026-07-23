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
  ScriptEditorEventBindingRecord,
  ScriptEditorEventRecord,
  ScriptEditorFlowRecord,
  ScriptEditorProjectDefinition,
  ScriptEditorRuntimePackSchemaVersion,
  ScriptEditorStoryPackRecord,
} from "../../domain/script-editor-project";
import { SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION } from "../../domain/script-editor-project";
import type { ScenarioProfileDefinition } from "../../domain/scenario-profile";
import { GAME_VIEW_NAMES, isViewName } from "../../domain/game-state";
import type { RuntimeDialogueDefinition } from "../../domain/dialogue";
import type {
  EventBinding,
  EventDefinition,
  EventRuntimeAction,
} from "../../domain/event";
import type { RuntimeTaskInput } from "../../core/contracts/runtime-result";
import type {
  PlayableDefinition,
  PlayableIntegrationDefinition,
  PlayableOutcome,
  PlayableReturnPolicy,
} from "../../core/contracts/playable-runtime";
import type { FlowPlayableDefinition } from "../../domain/playables/flow";
import {
  isSupportedEventBindingOwnerFamily,
  isSupportedEventBindingTrigger,
} from "../../core/runtime/event-binding-contract";
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
  buildingArrangements: string;
  cityEntries: string;
  events: string;
  eventBindings: string;
  dialogues: string;
  activities: string;
  playables: string;
  playableIntegrations: string;
  flowPlayables: string;
  tasks: string;
  textEntries: string;
  cards: string;
  valuables: string;
  cityNpcPools: string;
  locationAccess: string;
  houseModuleDefaults: string;
  portraits: string;
  portraitVariants: string;
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
  buildingArrangements: "./building-arrangements.json",
  cityEntries: "./city-entries.json",
  events: "./events.json",
  eventBindings: "./event-bindings.json",
  dialogues: "./dialogues.json",
  activities: "./activities.json",
  playables: "./playables.json",
  playableIntegrations: "./playable-integrations.json",
  flowPlayables: "./flow-playables.json",
  tasks: "./tasks.json",
  textEntries: "./text-entries.json",
  cards: "./cards.json",
  valuables: "./valuables.json",
  cityNpcPools: "./city-npc-pools.json",
  locationAccess: "./location-access.json",
  houseModuleDefaults: "./house-module-defaults.json",
  portraits: "./portraits.json",
  portraitVariants: "./portrait-variants.json",
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
  appendMountedBuildingDiagnostics(project, diagnostics);
  appendCityBuildingCustomAttributeDiagnostics(project, diagnostics);
  const exportedDialogues = narrativeRuntime.dialogues;
  const exportedEvents = extractRuntimeEvents(
    project,
    exportedDialogues ?? [],
    diagnostics
  );
  const exportedEventBindings = extractRuntimeEventBindings(project, diagnostics);
  const sharedRuleDiagnostics: ScriptEditorSharedRuleDiagnostic[] = [];
  const exportedTasks = compileScriptEditorProjectTasks(project, sharedRuleDiagnostics);
  appendSharedRuleDiagnostics(sharedRuleDiagnostics, diagnostics);

  if (
    diagnostics.length > 0 ||
    scenarioProfile == null ||
    exportedTextEntries == null ||
    exportedDialogues == null ||
    exportedEvents == null ||
    exportedEventBindings == null ||
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
      buildingArrangements: cityBuildingRuntimeFamilies.buildingArrangements,
      cityEntries: cityBuildingRuntimeFamilies.cityEntries,
      events: exportedEvents,
      eventBindings: exportedEventBindings,
      dialogues: exportedDialogues,
      activities: project.activities,
      playables: playableRuntimeFamilies.playables,
      playableIntegrations: playableRuntimeFamilies.playableIntegrations,
      flowPlayables: playableRuntimeFamilies.flowPlayables,
      tasks: exportedTasks,
      textEntries: exportedTextEntries,
      cards: project.cards,
      valuables: project.valuables,
      cityNpcPools: cityBuildingRuntimeFamilies.cityNpcPools,
      locationAccess: cityBuildingRuntimeFamilies.locationAccess,
      houseModuleDefaults: project.houseModuleDefaults,
      portraits: project.portraits,
      portraitVariants: project.portraitVariants,
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

function appendMountedBuildingDiagnostics(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  const personIds = new Set(project.people.map((person) => person.id));

  project.cities.forEach((city, cityIndex) => {
    (city.mountedBuildings ?? []).forEach((mountedBuilding, buildingIndex) => {
      mountedBuilding.npcIds.forEach((npcId, npcIndex) => {
        if (!personIds.has(npcId)) {
          diagnostics.push({
            code: "missing-reference",
            fieldPath: `project.cities[${cityIndex}].mountedBuildings[${buildingIndex}].npcIds[${npcIndex}]`,
            message: `Mounted building NPC id "${npcId}" does not resolve to a project person record.`,
          });
        }
      });

      if (
        mountedBuilding.primaryNpcId != null &&
        mountedBuilding.primaryNpcId.length > 0 &&
        !mountedBuilding.npcIds.includes(mountedBuilding.primaryNpcId)
      ) {
        diagnostics.push({
          code: "missing-reference",
          fieldPath: `project.cities[${cityIndex}].mountedBuildings[${buildingIndex}].primaryNpcId`,
          message:
            `Primary mounted NPC id "${mountedBuilding.primaryNpcId}" must be included in the same mounted building npcIds array.`,
        });
      }
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
  const exportedDialogues = narrativeRuntime.dialogues;
  const exportedEvents = extractRuntimeEvents(project, exportedDialogues ?? [], []);
  const exportedEventBindings = extractRuntimeEventBindings(project, []);
  const exportedTasks = compileScriptEditorProjectTasks(project, []);
  const playableRuntimeFamilies = materializeScriptEditorPlayableRuntimeFamilies(
    project,
    []
  );
  if (
    scenarioProfile == null ||
    exportedTextEntries == null ||
    exportedDialogues == null ||
    exportedEvents == null ||
    exportedEventBindings == null ||
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
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.buildingArrangements)]: stringifyJson(
      cityBuildingRuntimeFamilies.buildingArrangements
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.cityEntries)]: stringifyJson(
      cityBuildingRuntimeFamilies.cityEntries
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.events)]: stringifyJson(
      exportedEvents
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.eventBindings)]: stringifyJson(
      exportedEventBindings
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.dialogues)]: stringifyJson(
      exportedDialogues
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
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.flowPlayables)]: stringifyJson(
      playableRuntimeFamilies.flowPlayables
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
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.locationAccess)]: stringifyJson(
      cityBuildingRuntimeFamilies.locationAccess
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.houseModuleDefaults)]: stringifyJson(
      project.houseModuleDefaults
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.portraits)]: stringifyJson(
      project.portraits
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.portraitVariants)]: stringifyJson(
      project.portraitVariants
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
  flowPlayables: FlowPlayableDefinition[];
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
        message: `Minigame binding ownerKind must be one of: house, dialogue, task, external.`,
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
  const flowPlayables = materializeRuntimeFlowDefinitions(project.flows, diagnostics);

  return {
    playables: Array.from(playablesById.values()),
    playableIntegrations,
    flowPlayables,
  };
}

function materializeRuntimeFlowDefinitions(
  flows: readonly ScriptEditorFlowRecord[],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): FlowPlayableDefinition[] {
  const runtimeFlows: FlowPlayableDefinition[] = [];
  const flowIds = new Set<string>();

  for (const [index, flow] of flows.entries()) {
    const fieldPath = `project.flows[${index}]`;
    const flowId = readRequiredTrimmedString(flow.id, `${fieldPath}.id`, diagnostics);
    const title = readRequiredTrimmedString(flow.title, `${fieldPath}.title`, diagnostics);
    const initialNodeId = readRequiredTrimmedString(
      flow.initialNodeId,
      `${fieldPath}.initialNodeId`,
      diagnostics
    );
    if (flowId == null || title == null || initialNodeId == null) {
      continue;
    }
    if (flowIds.has(flowId)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `${fieldPath}.id`,
        message: `Duplicate flow definition id "${flowId}" cannot be exported.`,
      });
      continue;
    }
    if (
      !Array.isArray(flow.nodes) ||
      flow.nodes.length === 0 ||
      !flow.nodes.some((node) => node.id === initialNodeId)
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.initialNodeId`,
        message: "Flow initialNodeId must reference a declared node.",
      });
      continue;
    }

    flowIds.add(flowId);
    const runtimeFlow: FlowPlayableDefinition = {
      id: flowId,
      title,
      initialNodeId,
      nodes: cloneJsonCompatibleValue(flow.nodes) as FlowPlayableDefinition["nodes"],
    };
    if (typeof flow.description === "string" && flow.description.trim().length > 0) {
      runtimeFlow.description = flow.description.trim();
    }
    if (Array.isArray(flow.outcomeRoutes) && flow.outcomeRoutes.length > 0) {
      runtimeFlow.outcomeRoutes = cloneJsonCompatibleValue(
        flow.outcomeRoutes
      ) as NonNullable<FlowPlayableDefinition["outcomeRoutes"]>;
    }
    if (typeof flow.notes === "string" && flow.notes.trim().length > 0) {
      runtimeFlow.notes = flow.notes.trim();
    }
    runtimeFlows.push(runtimeFlow);
  }

  return runtimeFlows;
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
  return value === "house" || value === "dialogue" || value === "task" || value === "external";
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
  const defaultPortraitId = project.portraits[0]?.id;
  const portraitResourceById = Object.fromEntries(
    project.portraits.map((portrait) => [portrait.id, portrait])
  );

  return project.people.map((person) => {
    const character = materializeScriptEditorPersonRuntimeCharacter(person, {
      ...(defaultCityId == null ? {} : { cityId: defaultCityId }),
      ...(defaultPortraitId == null ? {} : { portraitId: defaultPortraitId }),
    });
    const portraitVariants = project.portraitVariants
      .filter((variant) => variant.parentPortraitId === character.portraitId)
      .map((variant) => {
        const portrait = portraitResourceById[variant.portraitId];
        return {
          id: variant.id,
          label: variant.label,
          portraitId: variant.portraitId,
          ...(portrait == null
            ? {}
            : {
                portraitImageUrl: portrait.portraitImage,
                ...(portrait.avatarImage == null
                  ? {}
                  : { avatarImageUrl: portrait.avatarImage }),
              }),
        };
      });
    const activeVariant =
      portraitVariants.find((variant) => variant.id === character.portraitVariantId) ??
      null;
    const basePortrait = portraitResourceById[character.portraitId];

    return {
      ...character,
      portraitVariants,
      ...(activeVariant?.portraitImageUrl != null
        ? { portraitImageUrl: activeVariant.portraitImageUrl }
        : basePortrait == null
          ? {}
          : { portraitImageUrl: basePortrait.portraitImage }),
      ...(activeVariant?.avatarImageUrl != null
        ? { avatarImageUrl: activeVariant.avatarImageUrl }
        : basePortrait?.avatarImage == null
          ? {}
          : { avatarImageUrl: basePortrait.avatarImage }),
    };
  });
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
  if (!isViewName(view)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: "project.storyPack.scenarioProfile.initialLocation.view",
      message: `project.storyPack.scenarioProfile.initialLocation.view must be one of: ${GAME_VIEW_NAMES.join(", ")}.`,
    });
    return null;
  }

  const houseId = readNullableString(
    initialLocation?.houseId,
    "project.storyPack.scenarioProfile.initialLocation.houseId",
    diagnostics
  );
  const dialogueId = readNullableString(
    initialLocation?.dialogueId,
    "project.storyPack.scenarioProfile.initialLocation.dialogueId",
    diagnostics
  );
  return {
    ...cloneScenarioProfileRuntimeFields(scenarioProfile, diagnostics),
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
      ...(dialogueId == null ? {} : { dialogueId }),
      view: view as ScenarioProfileDefinition["initialLocation"]["view"],
    },
  };
}

function cloneScenarioProfileRuntimeFields(
  scenarioProfile: Record<string, unknown>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Partial<ScenarioProfileDefinition> {
  const characterStartups = lowerScenarioCharacterStartups(
    scenarioProfile.characterStartups,
    diagnostics
  );
  const launchPolicy = lowerScenarioLaunchPolicy(
    scenarioProfile.launchPolicy,
    diagnostics
  );
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
    ...(characterStartups == null ? {} : { characterStartups }),
    ...(launchPolicy == null ? {} : { launchPolicy }),
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

function lowerScenarioCharacterStartups(
  value: unknown,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): ScenarioProfileDefinition["characterStartups"] | undefined {
  if (value == null) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: "project.storyPack.scenarioProfile.characterStartups",
      message: "project.storyPack.scenarioProfile.characterStartups must be an array when present.",
    });
    return undefined;
  }
  for (const [index, record] of value.entries()) {
    if (record == null || typeof record !== "object" || Array.isArray(record)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `project.storyPack.scenarioProfile.characterStartups[${index}]`,
        message: "Scenario character startup override must be an object.",
      });
      continue;
    }
    appendScenarioLocationViewDiagnostic(
      (record as Record<string, unknown>).initialLocation,
      `project.storyPack.scenarioProfile.characterStartups[${index}].initialLocation`,
      diagnostics
    );
    appendScenarioLaunchPolicyDiagnostics(
      (record as Record<string, unknown>).launchPolicy,
      `project.storyPack.scenarioProfile.characterStartups[${index}].launchPolicy`,
      diagnostics
    );
  }
  return diagnostics.length === 0 && isScenarioCharacterStartups(value)
    ? (cloneJsonCompatibleValue(
        value
      ) as ScenarioProfileDefinition["characterStartups"])
    : undefined;
}

function lowerScenarioLaunchPolicy(
  value: unknown,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): ScenarioProfileDefinition["launchPolicy"] | undefined {
  if (value == null) {
    return undefined;
  }
  appendScenarioLaunchPolicyDiagnostics(
    value,
    "project.storyPack.scenarioProfile.launchPolicy",
    diagnostics
  );
  return diagnostics.length === 0 && isLaunchPolicy(value)
    ? (cloneJsonCompatibleValue(value) as ScenarioProfileDefinition["launchPolicy"])
    : undefined;
}

function appendScenarioLocationViewDiagnostic(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  if (value == null) {
    return;
  }
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: `${fieldPath} must be an object when present.`,
    });
    return;
  }
  const record = value as Record<string, unknown>;
  if (record.view != null && !isViewName(record.view)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.view`,
      message: `${fieldPath}.view must be one of: ${GAME_VIEW_NAMES.join(", ")}.`,
    });
  }
}

function appendScenarioLaunchPolicyDiagnostics(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  if (value == null) {
    return;
  }
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: `${fieldPath} must be an object when present.`,
    });
    return;
  }
  const record = value as Record<string, unknown>;
  if (
    record.characterSelection != null &&
    record.characterSelection !== "shell" &&
    record.characterSelection !== "fixed"
  ) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.characterSelection`,
      message: `${fieldPath}.characterSelection must be "shell" or "fixed".`,
    });
  }
  if (record.initialView != null && !isViewName(record.initialView)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.initialView`,
      message: `${fieldPath}.initialView must be one of: ${GAME_VIEW_NAMES.join(", ")}.`,
    });
  }
  if (
    record.entryEventTiming != null &&
    record.entryEventTiming !== "immediate" &&
    record.entryEventTiming !== "after-map-entry"
  ) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.entryEventTiming`,
      message: `${fieldPath}.entryEventTiming must be "immediate" or "after-map-entry".`,
    });
  }
}

function extractRuntimeEvents(
  project: ScriptEditorProjectDefinition,
  exportedDialogues: RuntimeDialogueDefinition[],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventDefinition[] | null {
  return lowerEditorEventsToRuntimeEvents(project, exportedDialogues, diagnostics);
}

function lowerEditorEventsToRuntimeEvents(
  project: ScriptEditorProjectDefinition,
  exportedDialogues: RuntimeDialogueDefinition[],
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

  const dialogueIds = new Set(exportedDialogues.map((dialogue) => dialogue.id));
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
  const sourceFlowIds = new Set(
    project.flows
      .map((flowRecord) => flowRecord.id)
      .filter((flowId): flowId is string => typeof flowId === "string" && flowId.length > 0)
  );
  const minigamesById = new Map(
    project.minigames
      .filter((minigame) => typeof minigame.id === "string" && minigame.id.length > 0)
      .map((minigame) => [minigame.id, minigame] as const)
  );
  const exportedEvents: EventDefinition[] = [];
  const eventIds = new Set<string>();
  const referencedEventIds = collectRuntimeReferencedEventIds(project);
  const derivedFlowLaunchActionsByEventId =
    collectLegacyFlowLaunchActionsByEventId(project, diagnostics);
  const flowStartEventIds = new Set(derivedFlowLaunchActionsByEventId.keys());
  for (const [index, eventRecord] of project.events.entries()) {
    if (isUnreferencedDraftEditorEvent(eventRecord, referencedEventIds)) {
      continue;
    }
    const exportedEvent = lowerEditorEventToRuntimeEvent(
      eventRecord,
      index,
      chapterId,
      dialogueIds,
      sourceEventIds,
      sourceTaskIds,
      sourceFlowIds,
      minigamesById,
      flowStartEventIds,
      derivedFlowLaunchActionsByEventId.get(eventRecord.id) ?? [],
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

function collectRuntimeReferencedEventIds(
  project: ScriptEditorProjectDefinition
): Set<string> {
  const eventIds = new Set<string>();
  for (const binding of project.eventBindings) {
    if (typeof binding.eventId === "string" && binding.eventId.length > 0) {
      eventIds.add(binding.eventId);
    }
  }

  const scenarioProfile = project.storyPack.scenarioProfile;
  if (
    scenarioProfile != null &&
    typeof scenarioProfile === "object" &&
    !Array.isArray(scenarioProfile)
  ) {
    const entryEventId = (scenarioProfile as Record<string, unknown>).entryEventId;
    if (typeof entryEventId === "string" && entryEventId.length > 0) {
      eventIds.add(entryEventId);
    }
  }

  for (const eventRecord of project.events) {
    if (
      typeof eventRecord.nextEventId === "string" &&
      eventRecord.nextEventId.length > 0
    ) {
      eventIds.add(eventRecord.nextEventId);
    }
  }

  return eventIds;
}

function collectLegacyFlowLaunchActionsByEventId(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Map<string, EventRuntimeAction[]> {
  const actionsByEventId = new Map<string, EventRuntimeAction[]>();

  for (const [index, flowRecord] of project.flows.entries()) {
    const fieldPath = `project.flows[${index}]`;
    const flow = flowRecord as ScriptEditorFlowRecord & Record<string, unknown>;
    const eventStartTarget = isPlainObject(flow.eventStartTarget)
      ? flow.eventStartTarget
      : null;
    if (eventStartTarget == null) {
      continue;
    }

    const eventId = readRequiredTrimmedString(
      eventStartTarget.eventId,
      `${fieldPath}.eventStartTarget.eventId`,
      diagnostics
    );
    const ownerKind = readRequiredTrimmedString(
      flow.ownerKind,
      `${fieldPath}.ownerKind`,
      diagnostics
    );
    const ownerId = readRequiredTrimmedString(
      flow.ownerId,
      `${fieldPath}.ownerId`,
      diagnostics
    );
    const returnPolicy = readRequiredTrimmedString(
      flow.returnPolicy,
      `${fieldPath}.returnPolicy`,
      diagnostics
    );
    if (
      eventId == null ||
      ownerKind == null ||
      ownerId == null ||
      returnPolicy == null
    ) {
      continue;
    }

    const mappedOwnerKind = mapLegacyFlowOwnerKind(
      ownerKind,
      `${fieldPath}.ownerKind`,
      diagnostics
    );
    if (mappedOwnerKind == null) {
      continue;
    }
    if (!isPlayableReturnPolicy(returnPolicy)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.returnPolicy`,
        message:
          'Legacy flow returnPolicy must be one of: "resume-owner", "reenter-owner", or "close-only".',
      });
      continue;
    }

    const nextActions = actionsByEventId.get(eventId) ?? [];
    nextActions.push({
      type: "launchFlow",
      flowId: flow.id,
      ownerContext: {
        ownerKind: mappedOwnerKind,
        ownerId,
        returnPolicy,
      },
    });
    actionsByEventId.set(eventId, nextActions);
  }

  return actionsByEventId;
}

function mapLegacyFlowOwnerKind(
  value: string,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): "house" | "dialogue" | "task" | "external" | null {
  if (value === "building") {
    return "house";
  }
  if (value === "dialogue" || value === "task" || value === "external") {
    return value;
  }
  diagnostics.push({
    code: "invalid-field",
    fieldPath,
    message:
      'Legacy flow ownerKind must be one of: "building", "dialogue", "task", or "external".',
  });
  return null;
}

function isUnreferencedDraftEditorEvent(
  eventRecord: ScriptEditorEventRecord,
  referencedEventIds: Set<string>
): boolean {
  if (
    typeof eventRecord.id === "string" &&
    eventRecord.id.length > 0 &&
    referencedEventIds.has(eventRecord.id)
  ) {
    return false;
  }

  const destinationTargetId =
    typeof eventRecord.destination?.targetId === "string"
      ? eventRecord.destination.targetId.trim()
      : "";
  if (destinationTargetId.length > 0) {
    return false;
  }

  if ((eventRecord.actions?.length ?? 0) > 0) {
    return false;
  }

  const nextEventId =
    typeof eventRecord.nextEventId === "string" ? eventRecord.nextEventId.trim() : "";

  return (
    nextEventId.length === 0 &&
    (eventRecord.taskInputs == null || eventRecord.taskInputs.length === 0)
  );
}

function lowerEditorEventToRuntimeEvent(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  chapterId: string,
  dialogueIds: Set<string>,
  sourceEventIds: Set<string>,
  sourceTaskIds: Set<string>,
  sourceFlowIds: Set<string>,
  minigamesById: Map<string, ScriptEditorProjectDefinition["minigames"][number]>,
  flowStartEventIds: Set<string>,
  derivedFlowActions: EventRuntimeAction[],
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

  const destinationLaunchAction = lowerEventDestinationLaunchAction(
    eventRecord,
    eventIndex,
    minigamesById,
    diagnostics
  );
  if (destinationLaunchAction === null) {
    return null;
  }

  const dialogueId = resolveEventDialogueId(
    eventRecord,
    eventIndex,
    flowStartEventIds,
    derivedFlowActions.length > 0,
    destinationLaunchAction != null,
    diagnostics
  );
  if (dialogueId == null) {
    return null;
  }

  if (dialogueId.length > 0 && !dialogueIds.has(dialogueId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.events[${eventIndex}].destination.targetId`,
      message:
        `Event "${eventRecord.id}" references missing dialogue "${dialogueId}".`,
    });
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

  const actions = lowerEventRuntimeActions(
    eventRecord,
    eventIndex,
    destinationLaunchAction,
    derivedFlowActions,
    diagnostics
  );
  if (actions === null) {
    return null;
  }
  for (const action of actions) {
    if (action.type === "launchFlow" && !sourceFlowIds.has(action.flowId)) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `project.events[${eventIndex}].actions`,
        message: `Event "${eventRecord.id}" references missing flow "${action.flowId}".`,
      });
      return null;
    }
  }

  return {
    id: eventRecord.id,
    chapterId:
      typeof eventRecord.chapterId === "string" && eventRecord.chapterId.length > 0
        ? eventRecord.chapterId
        : chapterId,
    name: eventRecord.title || eventRecord.id,
    occurrence:
      eventRecord.occurrence === "repeatable" ||
      eventRecord.occurrence === "once-per-chapter"
        ? eventRecord.occurrence
        : eventRecord.repeatable === true
          ? "repeatable"
          : "once",
    ...(Array.isArray(eventRecord.participants) && eventRecord.participants.length > 0
    ? { participants: eventRecord.participants }
      : {}),
    dialogueId,
    ...(actions.length === 0 ? {} : { actions }),
    ...(nextEventId.length === 0 ? {} : { nextEventId }),
    ...(taskInputs.length === 0 ? {} : { taskInputs }),
    ...(Array.isArray(eventRecord.tags) && eventRecord.tags.length > 0
      ? { tags: eventRecord.tags }
      : {}),
  };
}

function resolveEventDialogueId(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  flowStartEventIds: Set<string>,
  hasDerivedFlowAction: boolean,
  hasDestinationLaunchAction: boolean,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  if (hasRuntimeEventActions(eventRecord)) {
    return "";
  }

  if (hasDestinationLaunchAction) {
    return "";
  }

  if (
    hasDerivedFlowAction ||
    (typeof eventRecord.id === "string" && flowStartEventIds.has(eventRecord.id))
  ) {
    return "";
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
        "Event export currently supports only dialogue destinations, minigame destinations with matching event-owned playable bindings, or event-owned runtime actions without dialogue output.",
    });
    return null;
  }

  return destination.targetId;
}

function hasRuntimeEventActions(eventRecord: ScriptEditorEventRecord): boolean {
  return Array.isArray(eventRecord.actions) && eventRecord.actions.length > 0;
}

function lowerEventRuntimeActions(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  destinationLaunchAction:
    | Extract<EventRuntimeAction, { type: "launchPlayable" }>
    | null
    | undefined,
  derivedFlowActions: EventRuntimeAction[],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventRuntimeAction[] | null {
  const actions: EventRuntimeAction[] = [];
  if (destinationLaunchAction != null) {
    actions.push(destinationLaunchAction);
  }
  for (const [actionIndex, action] of (eventRecord.actions ?? []).entries()) {
    if (action?.type === "closeBuilding") {
      actions.push({ type: "closeBuilding" });
      continue;
    }
    if (
      action?.type === "launchPlayable" &&
      typeof action.playableId === "string" &&
      action.playableId.trim().length > 0 &&
      typeof action.integrationId === "string" &&
      action.integrationId.trim().length > 0 &&
      action.ownerContext != null
    ) {
      const ownerKind = action.ownerContext.ownerKind;
      const ownerId = action.ownerContext.ownerId;
      const returnPolicy = action.ownerContext.returnPolicy;
      if (
        (ownerKind !== "house" &&
          ownerKind !== "dialogue" &&
          ownerKind !== "task" &&
          ownerKind !== "external") ||
        !isPlayableReturnPolicy(returnPolicy)
      ) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `project.events[${eventIndex}].actions[${actionIndex}]`,
          message: "launchPlayable actions require a supported ownerContext contract.",
        });
        return null;
      }
      actions.push({
        type: "launchPlayable",
        playableId: action.playableId.trim(),
        integrationId: action.integrationId.trim(),
        ownerContext: {
          ownerKind,
          ownerId:
            typeof ownerId === "string" && ownerId.trim().length > 0
              ? ownerId.trim()
              : null,
          returnPolicy,
        },
        ...(action.payload == null ? {} : { payload: action.payload }),
      });
      continue;
    }
    if (
      action?.type === "launchFlow" &&
      typeof action.flowId === "string" &&
      action.flowId.trim().length > 0 &&
      action.ownerContext != null
    ) {
      const ownerKind = action.ownerContext.ownerKind;
      const ownerId = action.ownerContext.ownerId;
      const returnPolicy = action.ownerContext.returnPolicy;
      if (
        (ownerKind !== "house" &&
          ownerKind !== "dialogue" &&
          ownerKind !== "task" &&
          ownerKind !== "external") ||
        !isPlayableReturnPolicy(returnPolicy)
      ) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `project.events[${eventIndex}].actions[${actionIndex}]`,
          message: "launchFlow actions require a supported ownerContext contract.",
        });
        return null;
      }
      actions.push({
        type: "launchFlow",
        flowId: action.flowId.trim(),
        ownerContext: {
          ownerKind,
          ownerId:
            typeof ownerId === "string" && ownerId.trim().length > 0
              ? ownerId.trim()
              : null,
          returnPolicy,
        },
      });
      continue;
    }
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.events[${eventIndex}].actions[${actionIndex}]`,
      message:
        "Event export currently supports only closeBuilding, launchPlayable, and launchFlow runtime actions.",
    });
    return null;
  }

  actions.push(...derivedFlowActions);
  return actions;
}

function lowerEventDestinationLaunchAction(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  minigamesById: Map<string, ScriptEditorProjectDefinition["minigames"][number]>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Extract<EventRuntimeAction, { type: "launchPlayable" }> | null | undefined {
  const destination = eventRecord.destination;
  if (destination?.family !== "minigame") {
    return undefined;
  }

  const targetId =
    typeof destination.targetId === "string" ? destination.targetId.trim() : "";
  if (targetId.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `project.events[${eventIndex}].destination.targetId`,
      message: "Minigame event destinations require a targetId.",
    });
    return null;
  }

  const minigame = minigamesById.get(targetId);
  if (minigame == null) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.events[${eventIndex}].destination.targetId`,
      message: `Event "${eventRecord.id}" references missing minigame "${targetId}".`,
    });
    return null;
  }

  const fieldPath = `project.events[${eventIndex}].destination`;
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
  const triggerSource = readRequiredTrimmedString(
    minigame.triggerSource,
    `${fieldPath}.triggerSource`,
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
    triggerSource == null ||
    triggerEvent == null
  ) {
    return null;
  }

  if (!isPlayableOwnerKind(ownerKind)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.ownerKind`,
      message: `Minigame destination ownerKind must be one of: house, dialogue, task, external.`,
    });
    return null;
  }

  if (!isPlayableReturnPolicy(returnPolicy)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.returnPolicy`,
      message:
        `Minigame destination returnPolicy must be one of: resume-owner, reenter-owner, close-only.`,
    });
    return null;
  }

  if (triggerSource !== "event-destination") {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.triggerSource`,
      message: `Minigame destination "${targetId}" must use triggerSource "event-destination".`,
    });
    return null;
  }

  if (triggerEvent !== eventRecord.id) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.triggerEvent`,
      message:
        `Minigame destination "${targetId}" must set triggerEvent to "${eventRecord.id}".`,
    });
    return null;
  }

  if (
    ownerKind !== "external" &&
    (typeof minigame.ownerId !== "string" || minigame.ownerId.trim().length === 0)
  ) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `${fieldPath}.ownerId`,
      message: `Minigame destination ownerId is required for ${ownerKind} owners.`,
    });
    return null;
  }

  return {
    type: "launchPlayable",
    playableId,
    integrationId,
    ownerContext: {
      ownerKind,
      ownerId:
        ownerKind === "external" ? null : minigame.ownerId?.trim() ?? null,
      returnPolicy,
    },
  };
}

function lowerRuntimeEventBindings(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventBinding[] | null {
  const eventIds = new Set(project.events.map((eventRecord) => eventRecord.id));
  const loweredBindings: EventBinding[] = [];

  for (const [bindingIndex, binding] of project.eventBindings.entries()) {
    const fieldPath = `project.eventBindings[${bindingIndex}]`;
    const loweredBinding = lowerRuntimeEventBinding(
      binding,
      fieldPath,
      eventIds,
      diagnostics
    );
    if (loweredBinding != null) {
      loweredBindings.push(loweredBinding);
    }
  }

  return diagnostics.length === 0 ? loweredBindings : null;
}

function extractRuntimeEventBindings(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): unknown[] | null {
  return lowerRuntimeEventBindings(project, diagnostics);
}

function lowerRuntimeEventBinding(
  binding: ScriptEditorEventBindingRecord,
  fieldPath: string,
  eventIds: Set<string>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventBinding | null {
  if (!eventIds.has(binding.eventId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `${fieldPath}.eventId`,
      message: `Event binding references missing event "${binding.eventId}".`,
    });
    return null;
  }

  if (!isSupportedEventBindingOwnerFamily(binding.owner.family)) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `${fieldPath}.owner.family`,
      message: `Event binding owner family "${binding.owner.family}" is not supported by runtime export.`,
    });
    return null;
  }

  if (!isSupportedEventBindingTrigger(binding.trigger)) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `${fieldPath}.trigger`,
      message:
        `Event binding trigger "${binding.trigger.timing}:${binding.trigger.action}" is not supported by runtime export.`,
    });
    return null;
  }

  const conditions = lowerEventBindingConditions(
    binding.conditions,
    `${fieldPath}.conditions`,
    diagnostics
  );
  if (conditions === null) {
    return null;
  }

  if (binding.trigger.payloadSchemaId != null) {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `${fieldPath}.trigger.payloadSchemaId`,
      message:
        "Event binding payload schemas require a later registered payload lowering step.",
    });
    return null;
  }

  return {
    id: binding.id,
    eventId: binding.eventId,
    owner: {
      family: binding.owner.family,
      ...(binding.owner.id == null || binding.owner.id.length === 0
        ? {}
        : { id: binding.owner.id }),
    },
    trigger: {
      timing: binding.trigger.timing,
      action: binding.trigger.action,
      ...(isPlainObject(binding.trigger.extra)
        ? { extra: cloneJsonCompatibleValue(binding.trigger.extra) as Record<string, unknown> }
        : {}),
    },
    ...(conditions == null ? {} : { conditions }),
    ...(typeof binding.priority === "number" ? { priority: binding.priority } : {}),
    ...(binding.enabled == null ? {} : { enabled: binding.enabled }),
  };
}

function lowerEventBindingConditions(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventBinding["conditions"] | undefined | null {
  if (value == null) {
    return undefined;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: "Event binding conditions must be an object when present.",
    });
    return null;
  }

  const group = value as Record<string, unknown>;
  const operator = group.operator;
  if (operator !== "all" && operator !== "any" && operator !== "not") {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.operator`,
      message: "Event binding condition operator must be all, any, or not.",
    });
    return null;
  }

  if (!Array.isArray(group.conditions)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.conditions`,
      message: "Event binding conditions must contain a conditions array.",
    });
    return null;
  }

  const loweredConditions: NonNullable<EventBinding["conditions"]>["conditions"] = [];
  for (const [conditionIndex, condition] of group.conditions.entries()) {
    const loweredCondition = lowerEventBindingConditionNode(
      condition,
      `${fieldPath}.conditions[${conditionIndex}]`,
      diagnostics
    );
    if (loweredCondition != null) {
      loweredConditions.push(loweredCondition);
    }
  }

  if (loweredConditions.length === 0) {
    return undefined;
  }

  return diagnostics.length === 0
    ? {
        operator,
        conditions: loweredConditions,
      }
    : null;
}

function lowerEventBindingConditionNode(
  value: unknown,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): NonNullable<EventBinding["conditions"]>["conditions"][number] | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: "Event binding condition item must be an object.",
    });
    return null;
  }

  const condition = value as Record<string, unknown>;
  if (condition.type === "flag") {
    return lowerEventBindingFlagCondition(condition, fieldPath, diagnostics);
  }

  if (condition.type === "variable") {
    return lowerEventBindingVariableCondition(condition, fieldPath, diagnostics);
  }

  diagnostics.push({
    code: "unsupported-lowering",
    fieldPath,
    message:
      "Event binding condition export only supports basic flag and variable conditions.",
  });
  return null;
}

function lowerEventBindingFlagCondition(
  condition: Record<string, unknown>,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): NonNullable<EventBinding["conditions"]>["conditions"][number] | null {
  const key = readEventBindingConditionField(condition, fieldPath, diagnostics);
  const operator =
    typeof condition.operator === "string"
      ? readEventBindingConditionOperator(condition, fieldPath, diagnostics)
      : "==";
  if (key == null || operator == null) {
    return null;
  }

  if (operator !== "==" && operator !== "!=") {
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `${fieldPath}.operator`,
      message: "Flag event binding conditions only support == and != operators.",
    });
    return null;
  }

  const value = Object.hasOwn(condition, "value")
    ? condition.value
    : condition.expected;
  if (typeof value !== "boolean") {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.value`,
      message: "Flag event binding conditions require a boolean value.",
    });
    return null;
  }

  return {
    type: "flag",
    key,
    expected: operator === "==" ? value : !value,
  } as NonNullable<EventBinding["conditions"]>["conditions"][number];
}

function lowerEventBindingVariableCondition(
  condition: Record<string, unknown>,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): NonNullable<EventBinding["conditions"]>["conditions"][number] | null {
  const key = readEventBindingConditionField(condition, fieldPath, diagnostics);
  const operator = readEventBindingConditionOperator(condition, fieldPath, diagnostics);
  if (key == null || operator == null) {
    return null;
  }

  return {
    type: "variable",
    key,
    operator,
    value: condition.value,
  } as NonNullable<EventBinding["conditions"]>["conditions"][number];
}

function readEventBindingConditionField(
  condition: Record<string, unknown>,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  const field = typeof condition.field === "string" ? condition.field : condition.key;
  if (typeof field !== "string" || field.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `${fieldPath}.field`,
      message: "Event binding condition field is required for export.",
    });
    return null;
  }

  return field;
}

function readEventBindingConditionOperator(
  condition: Record<string, unknown>,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  if (
    condition.operator !== "==" &&
    condition.operator !== "!=" &&
    condition.operator !== ">=" &&
    condition.operator !== "<=" &&
    condition.operator !== ">" &&
    condition.operator !== "<"
  ) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.operator`,
      message:
        "Event binding condition operator must be ==, !=, >=, <=, >, or <.",
    });
    return null;
  }

  return condition.operator;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
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

function isScenarioCharacterStartups(
  value: unknown
): value is ScenarioProfileDefinition["characterStartups"] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((record) => {
    if (record == null || typeof record !== "object" || Array.isArray(record)) {
      return false;
    }

    const candidate = record as Record<string, unknown>;
    return (
      typeof candidate.characterId === "string" &&
      (candidate.initialCalendar == null || isCalendarDate(candidate.initialCalendar)) &&
      (candidate.initialLocation == null ||
        isScenarioCharacterStartupLocation(candidate.initialLocation)) &&
      (candidate.initialPlayerCoordinate == null ||
        isCoordinate(candidate.initialPlayerCoordinate)) &&
      (candidate.initialUi == null || isInitialUi(candidate.initialUi)) &&
      (candidate.initialRuntime == null || isInitialRuntime(candidate.initialRuntime)) &&
      (candidate.launchPolicy == null || isScenarioCharacterLaunchPolicy(candidate.launchPolicy)) &&
      (candidate.entryEventId == null || typeof candidate.entryEventId === "string") &&
      (candidate.openingFlowId == null || typeof candidate.openingFlowId === "string")
    );
  });
}

function isScenarioCharacterStartupLocation(value: unknown): boolean {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    (record.mapId == null || typeof record.mapId === "string") &&
    (record.cityId == null || typeof record.cityId === "string") &&
    (record.houseId == null || typeof record.houseId === "string") &&
    (record.dialogueId == null || typeof record.dialogueId === "string") &&
    (record.view == null || isViewName(record.view))
  );
}

function isScenarioCharacterLaunchPolicy(value: unknown): boolean {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    (record.initialView == null || isViewName(record.initialView)) &&
    (record.entryEventTiming == null ||
      record.entryEventTiming === "immediate" ||
      record.entryEventTiming === "after-map-entry")
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
    (record.initialView == null || isViewName(record.initialView)) &&
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
