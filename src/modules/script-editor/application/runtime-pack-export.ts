import { parseScenarioPack } from "./script-editor-scenario-pack-codec";
import {
  parseScriptEditorProject,
} from "./editor-project-loader";
import {
  compileScriptEditorProjectTasks,
  type ScriptEditorSharedRuleDiagnostic,
} from "./shared-rule-compiler";
import { materializeScriptEditorCityBuildingRuntimeFamilies } from "./city-building-runtime-materializer";
import { materializeScriptEditorDialogueStoryRuntime } from "./dialogue-story-runtime-materializer";
import {
  materializeScriptEditorPersonRuntimeCharacter,
  readScriptEditorPersonTypedAttributes,
} from "./person-authoring";
import type {
  ScriptEditorEventBindingRecord,
  ScriptEditorEventRecord,
  ScriptEditorFlowRecord,
  ScriptEditorPersonSemanticBinding,
  ScriptEditorProjectDefinition,
  ScriptEditorProgressTrackRecord,
  ScriptEditorRuntimePackSchemaVersion,
  ScriptEditorSettlementContentRecord,
  ScriptEditorStoryPackRecord,
  ScriptEditorTypedAttributeRecord,
} from "../domain/script-editor-project";
import { SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION } from "../domain/script-editor-project";
import type { ScenarioProfileDefinition } from "./script-editor-scenario-profile-contract";
import { GAME_VIEW_NAMES, isViewName } from "./script-editor-game-state-contract";
import type { ContentPackAudioSettings } from "./script-editor-content-pack-contract";
import type { RuntimeDialogueDefinition } from "../domain/script-editor-dialogue-contract";
import type {
  EventBinding,
  EventDefinition,
  EventRouteCommand,
} from "../domain/script-editor-event-contract";
import type { RuntimeTaskInput } from "../domain/script-editor-runtime-result-contract";
import type {
  PlayableDefinition,
  PlayableIntegrationDefinition,
  PlayableOutcome,
  PlayableSettlementRoute,
  PlayableReturnPolicy,
} from "./script-editor-playable-runtime-contract";
import type { FlowPlayableDefinition } from "../domain/script-editor-flow-contract";
import {
  isSupportedEventBindingOwnerFamily,
  isSupportedEventBindingTrigger,
} from "./script-editor-event-binding-contract";
import {
  isScriptEditorShellBackedMinigamePlayableId,
} from "./minigame-binding-authoring";
import { createBuiltinScriptEditorPlayableCatalog } from "../host/script-editor-playable-catalog";

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

const builtinScriptEditorPlayableCatalog =
  createBuiltinScriptEditorPlayableCatalog();

type RuntimePackManifestFiles = {
  scenarioProfile: string;
  maps: string;
  characters: string;
  cities: string;
  houses: string;
  buildingArrangements: string;
  cityEntries: string;
  settlements: string;
  events: string;
  eventBindings: string;
  progressTracks: string;
  progressTrackBindings: string;
  menuResources: string;
  menuInstances: string;
  dialogues: string;
  activities: string;
  playables: string;
  playableIntegrations: string;
  playableShells: string;
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

type SettlementAttributeMetadata = {
  attributeType: ScriptEditorSettlementContentRecord["attributeType"];
  options?: readonly string[];
};

const PERSON_SETTLEMENT_BASE_ATTRIBUTES: Record<string, SettlementAttributeMetadata> = {
  age: { attributeType: "number" },
  stamina: { attributeType: "number" },
  "stats.gold": { attributeType: "number" },
  "stats.leadership": { attributeType: "number" },
  "stats.martial": { attributeType: "number" },
  "stats.intelligence": { attributeType: "number" },
  "stats.politics": { attributeType: "number" },
  "stats.charm": { attributeType: "number" },
  "stats.fame": { attributeType: "number" },
};

const CITY_SETTLEMENT_BASE_ATTRIBUTES: Record<string, SettlementAttributeMetadata> = {
  travelCost: { attributeType: "number" },
  prosperity: { attributeType: "number" },
  danger: { attributeType: "number" },
};

const BUILDING_SETTLEMENT_BASE_ATTRIBUTES: Record<string, SettlementAttributeMetadata> = {
  level: { attributeType: "number" },
  outputMultiplier: { attributeType: "number" },
  damaged: { attributeType: "boolean" },
};

type RuntimePackManifest = {
  schemaVersion: ScriptEditorRuntimePackSchemaVersion;
  kind: "scenario-pack";
  id: string;
  title: string;
  description?: string;
  audioSettings?: ContentPackAudioSettings;
  basePackId?: string;
  author?: string;
  version?: string;
  tags?: string[];
  personAttributeSemantics?: ScriptEditorPersonSemanticBinding[];
  files: RuntimePackManifestFiles;
};

const RUNTIME_PACK_MANIFEST_FILE = "pack.json";
const SCRIPT_EDITOR_DERIVED_EVENT_DESTINATION_SOURCE = "script-editor:event-destination";

const RUNTIME_PACK_CANONICAL_FILES: RuntimePackManifestFiles = {
  scenarioProfile: "./scenario-profile.json",
  maps: "./maps.json",
  characters: "./characters.json",
  cities: "./cities.json",
  houses: "./houses.json",
  buildingArrangements: "./building-arrangements.json",
  cityEntries: "./city-entries.json",
  settlements: "./settlements.json",
  events: "./events.json",
  eventBindings: "./event-bindings.json",
  progressTracks: "./progress-tracks.json",
  progressTrackBindings: "./progress-track-bindings.json",
  menuResources: "./menu-resources.json",
  menuInstances: "./menu-instances.json",
  dialogues: "./dialogues.json",
  activities: "./activities.json",
  playables: "./playables.json",
  playableIntegrations: "./playable-integrations.json",
  playableShells: "./playable-shells.json",
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
  appendSettlementAuthoringDiagnostics(project, diagnostics);
  appendProgressTrackAuthoringDiagnostics(project, diagnostics);
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
  const exportedMenuResources = materializeRuntimeMenuResources(project);

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
      settlements: project.settlements,
      events: exportedEvents,
      eventBindings: exportedEventBindings,
      progressTracks: project.progressTracks ?? [],
      progressTrackBindings: project.progressTrackBindings ?? [],
      menuResources: exportedMenuResources,
      menuInstances: project.menuInstances,
      dialogues: exportedDialogues,
      activities: project.activities,
      playables: playableRuntimeFamilies.playables,
      playableIntegrations: playableRuntimeFamilies.playableIntegrations,
      playableShells: playableRuntimeFamilies.playableShells,
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

function appendSettlementAuthoringDiagnostics(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  const firstSettlementIndexByTitle = new Map<string, number>();

  project.settlements.forEach((settlementRecord, settlementIndex) => {
    const fieldPath = `project.settlements[${settlementIndex}]`;
    const title =
      typeof settlementRecord.title === "string"
        ? settlementRecord.title.trim()
        : "";
    const normalizedTitle = title.toLocaleLowerCase();
    if (normalizedTitle.length > 0) {
      const firstIndex = firstSettlementIndexByTitle.get(normalizedTitle);
      if (firstIndex == null) {
        firstSettlementIndexByTitle.set(normalizedTitle, settlementIndex);
      } else {
        diagnostics.push({
          code: "duplicate-id",
          fieldPath: `${fieldPath}.title`,
          message: "Duplicate settlement title.",
        });
      }
    }

    appendLegacySettlementResultDiagnostics(settlementRecord, fieldPath, diagnostics);

    (settlementRecord.contents ?? []).forEach((content, contentIndex) => {
      const contentFieldPath = `${fieldPath}.contents[${contentIndex}]`;
      if (content == null || typeof content !== "object" || Array.isArray(content)) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: contentFieldPath,
          message: "Settlement content row must be an object.",
        });
        return;
      }

      const contentRecord = content as Record<string, unknown>;
      const targetFamily = contentRecord.targetFamily;
      const attributeType = contentRecord.attributeType;
      const operation = contentRecord.operation;
      const targetId =
        typeof contentRecord.targetId === "string"
          ? contentRecord.targetId.trim()
          : "";
      const attributeKey =
        typeof contentRecord.attributeKey === "string"
          ? contentRecord.attributeKey.trim()
          : "";
      if (
        targetFamily !== "person" &&
        targetFamily !== "city" &&
        targetFamily !== "building"
      ) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `${contentFieldPath}.targetFamily`,
          message: "Settlement content targetFamily must be person, city, or building.",
        });
        return;
      }

      if (targetId.length === 0) {
        diagnostics.push({
          code: "missing-field",
          fieldPath: `${contentFieldPath}.targetId`,
          message: "Settlement content targetId must be non-empty.",
        });
      }

      if (attributeKey.length === 0) {
        diagnostics.push({
          code: "missing-field",
          fieldPath: `${contentFieldPath}.attributeKey`,
          message: "Settlement content attributeKey must be non-empty.",
        });
      }

      if (
        attributeType !== "number" &&
        attributeType !== "boolean" &&
        attributeType !== "enum"
      ) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `${contentFieldPath}.attributeType`,
          message: "Settlement content attribute type must be number, boolean, or enum.",
        });
        return;
      }

      if (operation !== "add" && operation !== "subtract" && operation !== "set") {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `${contentFieldPath}.operation`,
          message: "Settlement content operation must be add, subtract, or set.",
        });
        return;
      }

      if ((attributeType === "boolean" || attributeType === "enum") && operation !== "set") {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `${contentFieldPath}.operation`,
          message: "Settlement content attribute type boolean or enum requires operation set.",
        });
      }

      const metadata = resolveScriptEditorSettlementAttributeMetadata(
        project,
        targetFamily,
        targetId,
        attributeKey,
        contentFieldPath,
        diagnostics
      );
      if (metadata == null) {
        return;
      }
      if (metadata.attributeType !== attributeType) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `${contentFieldPath}.attributeType`,
          message:
            `Settlement content attributeKey "${attributeKey}" is ${metadata.attributeType}, not ${attributeType}.`,
        });
        return;
      }

      appendSettlementValueDiagnostic(
        contentRecord.value,
        metadata,
        `${contentFieldPath}.value`,
        diagnostics
      );
    });
  });
}

function resolveScriptEditorSettlementAttributeMetadata(
  project: ScriptEditorProjectDefinition,
  targetFamily: ScriptEditorSettlementContentRecord["targetFamily"],
  targetId: string,
  attributeKey: string,
  contentFieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): SettlementAttributeMetadata | null {
  if (targetId.length === 0 || attributeKey.length === 0) {
    return null;
  }

  if (targetFamily === "person") {
    const person = project.people.find((record) => record.id === targetId);
    if (person == null) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `${contentFieldPath}.targetId`,
        message: `Settlement content targetId "${targetId}" does not resolve to a person target.`,
      });
      return null;
    }
    return (
      PERSON_SETTLEMENT_BASE_ATTRIBUTES[attributeKey] ??
      resolveTypedSettlementAttributeMetadata(
        readScriptEditorPersonTypedAttributes(person),
        attributeKey
      ) ??
      pushIneligibleSettlementAttributeDiagnostic(
        attributeKey,
        `${contentFieldPath}.attributeKey`,
        diagnostics
      )
    );
  }

  if (targetFamily === "city") {
    if (!project.cities.some((record) => record.id === targetId)) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `${contentFieldPath}.targetId`,
        message: `Settlement content targetId "${targetId}" does not resolve to a city target.`,
      });
      return null;
    }
    return (
      CITY_SETTLEMENT_BASE_ATTRIBUTES[attributeKey] ??
      pushIneligibleSettlementAttributeDiagnostic(
        attributeKey,
        `${contentFieldPath}.attributeKey`,
        diagnostics
      )
    );
  }

  if (!project.buildings.some((record) => record.id === targetId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `${contentFieldPath}.targetId`,
      message: `Settlement content targetId "${targetId}" does not resolve to a building target.`,
    });
    return null;
  }
  return (
    BUILDING_SETTLEMENT_BASE_ATTRIBUTES[attributeKey] ??
    pushIneligibleSettlementAttributeDiagnostic(
      attributeKey,
      `${contentFieldPath}.attributeKey`,
      diagnostics
    )
  );
}

function resolveTypedSettlementAttributeMetadata(
  attributes: readonly ScriptEditorTypedAttributeRecord[] | undefined,
  attributeKey: string
): SettlementAttributeMetadata | null {
  const attribute = (attributes ?? []).find((entry) => entry.key === attributeKey);
  if (
    attribute == null ||
    (attribute.type !== "number" &&
      attribute.type !== "boolean" &&
      attribute.type !== "enum")
  ) {
    return null;
  }
  return {
    attributeType: attribute.type,
    ...(attribute.type === "enum" ? { options: attribute.options ?? [] } : {}),
  };
}

function pushIneligibleSettlementAttributeDiagnostic(
  attributeKey: string,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): null {
  diagnostics.push({
    code: "invalid-field",
    fieldPath,
    message:
      `Settlement content attributeKey "${attributeKey}" must be an eligible calculable settlement attribute.`,
  });
  return null;
}

function appendSettlementValueDiagnostic(
  value: unknown,
  metadata: SettlementAttributeMetadata,
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  if (metadata.attributeType === "number") {
    const numericValue = typeof value === "number" ? value : NaN;
    if (!Number.isFinite(numericValue)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message: "Settlement content number value must be a finite number.",
      });
    }
    return;
  }

  if (metadata.attributeType === "boolean") {
    if (typeof value !== "boolean") {
      diagnostics.push({
        code: "invalid-field",
        fieldPath,
        message: "Settlement content boolean value must use a boolean value type.",
      });
    }
    return;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: "Settlement content enum value must be a non-empty string.",
    });
    return;
  }

  if ((metadata.options?.length ?? 0) > 0 && !metadata.options?.includes(value)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath,
      message: "Settlement content enum value must be one of the authored enum options.",
    });
  }
}

function appendProgressTrackAuthoringDiagnostics(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  const allowedTrackOwnerKinds = new Set(["person", "city", "building", "*"]);
  const allowedBindingOwnerKinds = new Set(["person", "city", "building"]);
  const settlementIds = new Set(
    project.settlements
      .map((settlementRecord) =>
        typeof settlementRecord.id === "string" ? settlementRecord.id.trim() : ""
      )
      .filter((settlementId) => settlementId.length > 0)
  );
  const progressTracksById: Record<string, ScriptEditorProgressTrackRecord> = {};
  for (const trackRecord of project.progressTracks ?? []) {
    const trackId =
      typeof trackRecord.id === "string" ? trackRecord.id.trim() : "";
    if (trackId.length > 0) {
      progressTracksById[trackId] = trackRecord;
    }
  }
  const hostIdsByFamily = {
    person: new Set(
      (project.people ?? [])
        .map((personRecord) =>
          typeof personRecord.id === "string" ? personRecord.id.trim() : ""
        )
        .filter((personId) => personId.length > 0)
    ),
    city: new Set(
      (project.cities ?? [])
        .map((cityRecord) =>
          typeof cityRecord.id === "string" ? cityRecord.id.trim() : ""
        )
        .filter((cityId) => cityId.length > 0)
    ),
    building: new Set(
      (project.buildings ?? [])
        .map((buildingRecord) =>
          typeof buildingRecord.id === "string" ? buildingRecord.id.trim() : ""
        )
        .filter((buildingId) => buildingId.length > 0)
    ),
  };

  (project.progressTracks ?? []).forEach((trackRecord, trackIndex) => {
    const trackId =
      typeof trackRecord.id === "string" && trackRecord.id.length > 0
        ? trackRecord.id
        : `progress-track.${trackIndex + 1}`;
    const metricKey =
      typeof trackRecord.metricKey === "string" ? trackRecord.metricKey.trim() : "";
    if (metricKey.length === 0) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `project.progressTracks[${trackIndex}].metricKey`,
        message: `Progress track "${trackId}" must declare a non-empty metricKey.`,
      });
    }
    const hostFamily =
      typeof trackRecord.hostFamily === "string" ? trackRecord.hostFamily.trim() : "";
    if (!allowedTrackOwnerKinds.has(hostFamily)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `project.progressTracks[${trackIndex}].hostFamily`,
        message:
          `Progress track "${trackId}" hostFamily "${hostFamily}" is not supported by the first progression runtime slice.`,
      });
    }
    const tiers = Array.isArray(trackRecord.tiers) ? trackRecord.tiers : [];

    tiers.forEach((tierRecord, tierIndex) => {
      const settlementId =
        typeof tierRecord?.targetTierSettlementId === "string"
          ? tierRecord.targetTierSettlementId.trim()
          : "";
      if (settlementId.length === 0 || settlementIds.has(settlementId)) {
        return;
      }

      const tierId =
        typeof tierRecord?.id === "string" && tierRecord.id.length > 0
          ? tierRecord.id
          : `tier.${tierIndex + 1}`;
      diagnostics.push({
        code: "missing-reference",
        fieldPath:
          `project.progressTracks[${trackIndex}].tiers[${tierIndex}].targetTierSettlementId`,
        message:
          `Progress tier "${trackId}:${tierId}" references missing settlement "${settlementId}" through targetTierSettlementId.`,
      });
    });
  });

  (project.progressTrackBindings ?? []).forEach((bindingRecord, bindingIndex) => {
    const fieldPath = `project.progressTrackBindings[${bindingIndex}]`;
    const bindingId =
      typeof bindingRecord.id === "string" && bindingRecord.id.length > 0
        ? bindingRecord.id
        : `progress-binding.${bindingIndex + 1}`;
    const trackId =
      typeof bindingRecord.trackId === "string" ? bindingRecord.trackId.trim() : "";
    if (trackId.length === 0) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.trackId`,
        message: `Progress binding "${bindingId}" must declare a non-empty trackId.`,
      });
      return;
    }
    const trackRecord = progressTracksById[trackId];
    if (trackRecord == null) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `${fieldPath}.trackId`,
        message:
          `Progress binding "${bindingId}" references missing track "${trackId}" through trackId.`,
      });
      return;
    }

    const hostFamily =
      typeof bindingRecord.host?.family === "string"
        ? bindingRecord.host.family.trim()
        : "";
    if (!allowedBindingOwnerKinds.has(hostFamily)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.host.family`,
        message:
          `Progress binding "${bindingId}" host family "${hostFamily}" is not supported by the first progression runtime slice.`,
      });
    }
    const trackHostFamily =
      typeof trackRecord.hostFamily === "string" ? trackRecord.hostFamily.trim() : "";
    if (
      trackHostFamily.length > 0 &&
      trackHostFamily !== "*" &&
      hostFamily.length > 0 &&
      trackHostFamily !== hostFamily
    ) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.host.family`,
        message:
          `Progress binding "${bindingId}" host family "${hostFamily}" does not match track "${trackId}" hostFamily "${trackHostFamily}".`,
      });
    }
    const hostId =
      typeof bindingRecord.host?.id === "string"
        ? bindingRecord.host.id.trim()
        : "";
    if (hostId.length === 0) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.host.id`,
        message:
          `Progress binding "${bindingId}" must declare a concrete host id in the first progression runtime slice.`,
      });
    } else if (
      (hostFamily === "person" || hostFamily === "city" || hostFamily === "building") &&
      !hostIdsByFamily[hostFamily].has(hostId)
    ) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `${fieldPath}.host.id`,
        message:
          `Progress binding "${bindingId}" references missing ${hostFamily} host "${hostId}".`,
      });
    }
    const hostTag =
      typeof (bindingRecord.host as Record<string, unknown> | undefined)?.hostTag ===
      "string"
        ? String(
            (bindingRecord.host as Record<string, unknown>).hostTag
          ).trim()
        : "";
    if (hostTag.length > 0) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.host.hostTag`,
        message:
          `Progress binding "${bindingId}" hostTag is not supported in the first progression runtime slice.`,
      });
    }
  });
}

function appendLegacySettlementResultDiagnostics(
  settlementRecord: ScriptEditorProjectDefinition["settlements"][number],
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  const rawResults = (settlementRecord as Record<string, unknown>).results;
  if (rawResults == null) {
    return;
  }
  if (!Array.isArray(rawResults)) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.results`,
      message: "Legacy settlement result routing must be an array.",
    });
    return;
  }

  const nextEventIds = new Set<string>();
  for (const result of rawResults) {
    if (result == null || typeof result !== "object" || Array.isArray(result)) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `${fieldPath}.results`,
        message: "Legacy settlement result routing rows must be objects.",
      });
      return;
    }
    const nextEventId =
      typeof (result as Record<string, unknown>).nextEventId === "string"
        ? ((result as Record<string, unknown>).nextEventId as string).trim()
        : "";
    nextEventIds.add(nextEventId);
  }

  if (nextEventIds.size > 1) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.results`,
      message: "Ambiguous legacy settlement result routing must fail closed.",
    });
    return;
  }

  const legacyNextEventId = [...nextEventIds][0] ?? "";
  const settlementNextEventId =
    typeof settlementRecord.nextEventId === "string"
      ? settlementRecord.nextEventId.trim()
      : "";
  if (
    legacyNextEventId.length > 0 &&
    settlementNextEventId.length > 0 &&
    legacyNextEventId !== settlementNextEventId
  ) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.results`,
      message:
        "Conflicting legacy settlement result routing and settlement nextEventId is ambiguous and must fail closed.",
    });
  }
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
  const exportedMenuResources = materializeRuntimeMenuResources(project);
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
    ...pickOptionalAudioSettings(project.storyPack),
    ...(Array.isArray(project.storyPack.personAttributeSemantics)
      ? {
          personAttributeSemantics:
            project.storyPack.personAttributeSemantics as ScriptEditorPersonSemanticBinding[],
        }
      : {}),
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
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.settlements)]: stringifyJson(
      project.settlements
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.events)]: stringifyJson(
      exportedEvents
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.eventBindings)]: stringifyJson(
      exportedEventBindings
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.progressTracks)]: stringifyJson(
      project.progressTracks ?? []
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.progressTrackBindings)]:
      stringifyJson(project.progressTrackBindings ?? []),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.menuResources)]: stringifyJson(
      exportedMenuResources
    ),
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.menuInstances)]: stringifyJson(
      project.menuInstances
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
    [stripRelativePrefix(RUNTIME_PACK_CANONICAL_FILES.playableShells)]: stringifyJson(
      playableRuntimeFamilies.playableShells
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
  playableShells: FlowPlayableDefinition[];
} {
  const playablesById = new Map<string, PlayableDefinition>();
  const playableIntegrations: PlayableIntegrationDefinition[] = [];
  const integrationIds = new Set<string>();
  const authoredFlowIds = new Set(
    project.flows.flatMap((flow) =>
      typeof flow.id === "string" && flow.id.trim().length > 0
        ? [flow.id.trim()]
        : []
    )
  );
  const menuLaunchedMinigameIds = collectMenuLaunchedMinigameIds(project);
  const eventLaunchEventIdsByMinigameId = collectEventLaunchEventIdsByMinigameId(project);

  for (const [index, minigame] of project.minigames.entries()) {
    const fieldPath = `project.minigames[${index}]`;
    const playableId = readRequiredTrimmedString(
      minigame.playableId,
      `${fieldPath}.playableId`,
      diagnostics
    );
    const eventLaunchEventId = eventLaunchEventIdsByMinigameId.get(minigame.id) ?? "";
    if (playableId == null) {
      continue;
    }
    const usesBuiltinPlayableShell =
      isScriptEditorShellBackedMinigamePlayableId(playableId);
    const usesAuthoredFlowShell = authoredFlowIds.has(playableId);
    if (!usesBuiltinPlayableShell && !usesAuthoredFlowShell) {
      diagnostics.push({
        code: "unsupported-family",
        fieldPath: `${fieldPath}.playableId`,
        message:
          `Minigame binding references playable "${playableId}", which requires ` +
          "a registered playable shell and cannot be exported as a minigame binding.",
      });
      continue;
    }
    const integrationId = resolveScriptEditorMinigameIntegrationId(
      minigame,
      playableId
    );
    const triggerId = createDerivedMinigameTriggerId(minigame.id, playableId);
    const triggerEvent = eventLaunchEventId.length > 0 ? eventLaunchEventId : "manual-launch";

    const definition = usesBuiltinPlayableShell
      ? builtinScriptEditorPlayableCatalog.getPlayableDefinition(playableId)
      : {
          id: playableId,
          commandPrefix: `playable.${playableId}.`,
        };
    if (definition == null) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `${fieldPath}.playableId`,
        message: `Minigame binding references unknown playable "${playableId}".`,
      });
      continue;
    }

    const isEventLaunched = eventLaunchEventIdsByMinigameId.has(minigame.id);

    if (integrationIds.has(integrationId)) {
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `${fieldPath}.integrationId`,
        message: `Duplicate playable integration id "${integrationId}" cannot be exported.`,
      });
      continue;
    }

    const outcomeConfig = materializeMinigameOutcomeConfig(
      minigame.settlementRoutes,
      fieldPath,
      diagnostics
    );
    if (outcomeConfig == null) {
      continue;
    }

    integrationIds.add(integrationId);
    playablesById.set(playableId, {
      id: definition.id,
      commandPrefix: definition.commandPrefix,
    });
    const launchPayload = materializeMinigameLaunchPayload({
      minigame,
      project,
      isMenuLaunched: menuLaunchedMinigameIds.has(minigame.id) || isEventLaunched,
    });

    playableIntegrations.push({
      editorRecordId: minigame.id,
      integrationId,
      playableId,
      ownerDefaults: {
        ownerKind: "external",
        ownerId: null,
        returnPolicy: "close-only",
      },
      trigger: {
        triggerId,
        ownerKind: "external",
        trigger: triggerEvent,
        ...launchPayload,
      },
      outcomeConfig,
    } as PlayableIntegrationDefinition & { editorRecordId: string });
  }
  const playableShells = materializeRuntimeFlowDefinitions(project.flows, diagnostics);
  for (const flow of playableShells) {
    const integrationId = createDerivedFlowIntegrationId(flow.id);
    if (integrationIds.has(integrationId)) {
      if (playablesById.get(flow.id)?.id === flow.id) {
        continue;
      }
      diagnostics.push({
        code: "duplicate-id",
        fieldPath: `project.flows.${flow.id}.integrationId`,
        message: `Duplicate playable integration id "${integrationId}" cannot be exported.`,
      });
      continue;
    }

    integrationIds.add(integrationId);
    playablesById.set(flow.id, {
      id: flow.id,
      commandPrefix: `playable.${flow.id}.`,
    });
    playableIntegrations.push({
      integrationId,
      playableId: flow.id,
      ownerDefaults: {
        ownerKind: "external",
        ownerId: null,
        returnPolicy: "close-only",
      },
      trigger: {
        triggerId: createDerivedFlowTriggerId(flow.id),
        ownerKind: "external",
        trigger: "manual-launch",
      },
      outcomeConfig: {},
    });
  }

  return {
    playables: Array.from(playablesById.values()),
    playableIntegrations,
    playableShells,
  };
}

function materializeRuntimeMenuResources(
  project: ScriptEditorProjectDefinition
): ScriptEditorProjectDefinition["menuResources"] {
  const integrationIdByMinigameId = new Map(
    project.minigames.flatMap((minigame) => {
      const minigameId = typeof minigame.id === "string" ? minigame.id : "";
      const playableId =
        typeof minigame.playableId === "string" ? minigame.playableId.trim() : "";
      const integrationId =
        minigameId.length > 0 && playableId.length > 0
          ? resolveScriptEditorMinigameIntegrationId(minigame, playableId)
          : "";
      return minigameId.length > 0 && integrationId.length > 0
        ? [[minigameId, integrationId] as const]
        : [];
    })
  );

  return project.menuResources.map((resource) => ({
    ...resource,
    entries: resource.entries.map((entry) => {
      if (entry.targetFamily !== "minigame") {
        return entry;
      }
      const runtimeTargetId =
        integrationIdByMinigameId.get(entry.targetId) ?? entry.targetId;
      return {
        ...entry,
        targetId: runtimeTargetId,
      };
    }),
  }));
}

function collectMenuLaunchedMinigameIds(
  project: ScriptEditorProjectDefinition
): Set<string> {
  const minigameIds = new Set<string>();
  for (const resource of project.menuResources ?? []) {
    for (const entry of resource.entries ?? []) {
      if (entry.targetFamily !== "minigame") {
        continue;
      }
      const targetId =
        typeof entry.targetId === "string" ? entry.targetId.trim() : "";
      if (targetId.length > 0) {
        minigameIds.add(targetId);
      }
    }
  }
  return minigameIds;
}

function collectEventLaunchEventIdsByMinigameId(
  project: ScriptEditorProjectDefinition
): Map<string, string> {
  const eventIdsByMinigameId = new Map<string, string>();
  for (const eventRecord of project.events ?? []) {
    if (eventRecord.destination?.family !== "minigame") {
      continue;
    }
    const minigameId =
      typeof eventRecord.destination.targetId === "string"
        ? eventRecord.destination.targetId.trim()
        : "";
    const eventId = typeof eventRecord.id === "string" ? eventRecord.id.trim() : "";
    if (minigameId.length === 0 || eventId.length === 0) {
      continue;
    }
    if (!eventIdsByMinigameId.has(minigameId)) {
      eventIdsByMinigameId.set(minigameId, eventId);
    }
  }
  return eventIdsByMinigameId;
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
  settlementRoutes: ScriptEditorProjectDefinition["minigames"][number]["settlementRoutes"],
  fieldPath: string,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): PlayableIntegrationDefinition["outcomeConfig"] | null {
  if (settlementRoutes == null || settlementRoutes.length === 0) {
    return {
      handoffByOutcome: {
        success: "close-only",
        failure: "close-only",
        cancelled: "close-only",
      },
    };
  }

  const exportedRoutes: PlayableSettlementRoute[] = [];
  for (const [index, route] of settlementRoutes.entries()) {
    const targetEventId =
      typeof route.targetEventId === "string" ? route.targetEventId.trim() : "";
    if (targetEventId.length === 0) {
      diagnostics.push({
        code: "missing-field",
        fieldPath: `${fieldPath}.settlementRoutes[${index}].targetEventId`,
        message: "玩法结算路由必须指定目标事件。",
      });
      continue;
    }
    const outcomeIn = (route.conditions?.outcomeIn ?? []).filter(isPlayableOutcome);
    const metricRules = (route.conditions?.metricRules ?? []).flatMap((metricRule, ruleIndex) => {
      const metricKey =
        typeof metricRule.metricKey === "string" ? metricRule.metricKey.trim() : "";
      if (metricKey.length === 0) {
        diagnostics.push({
          code: "missing-field",
          fieldPath: `${fieldPath}.settlementRoutes[${index}].conditions.metricRules[${ruleIndex}].metricKey`,
          message: "玩法结算路由的指标规则必须填写指标键名。",
        });
        return [];
      }
      if (
        metricRule.operator !== ">" &&
        metricRule.operator !== ">=" &&
        metricRule.operator !== "<" &&
        metricRule.operator !== "<=" &&
        metricRule.operator !== "="
      ) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `${fieldPath}.settlementRoutes[${index}].conditions.metricRules[${ruleIndex}].operator`,
          message: "玩法结算路由的指标规则运算符必须是 >、>=、<、<= 或 =。",
        });
        return [];
      }
      return [
        {
          metricKey,
          operator: metricRule.operator,
          value: metricRule.value,
        },
      ];
    });
    exportedRoutes.push({
      id:
        typeof route.id === "string" && route.id.trim().length > 0
          ? route.id.trim()
          : `settlement-route.${index + 1}`,
      title:
        typeof route.title === "string" && route.title.trim().length > 0
          ? route.title.trim()
          : `结算路由 ${index + 1}`,
      targetEventId,
      enabled: route.enabled !== false,
      conditions: {
        ...(outcomeIn.length === 0 ? {} : { outcomeIn }),
        ...(typeof route.conditions?.scoreMin === "number"
          ? { scoreMin: route.conditions.scoreMin }
          : {}),
        ...(typeof route.conditions?.scoreMax === "number"
          ? { scoreMax: route.conditions.scoreMax }
          : {}),
        ...(metricRules.length === 0 ? {} : { metricRules }),
      },
    });
  }

  return {
    handoffByOutcome: {
      success: "close-only",
      failure: "close-only",
      cancelled: "close-only",
    },
    settlementRoutes: exportedRoutes,
  };
}

function materializeLaunchPayload(
  entries: ScriptEditorProjectDefinition["minigames"][number]["configEntries"]
): Pick<PlayableIntegrationDefinition["trigger"], "launchPayload"> {
  const launchPayload = Object.fromEntries(
    (entries ?? [])
      .filter((entry) => isMeaningfulConfigEntry(entry))
      .map((entry) => [entry.id.trim(), entry.value])
  );
  return Object.keys(launchPayload).length === 0 ? {} : { launchPayload };
}

function materializeMinigameLaunchPayload(input: {
  minigame: ScriptEditorProjectDefinition["minigames"][number];
  project: ScriptEditorProjectDefinition;
  isMenuLaunched: boolean;
}): Pick<PlayableIntegrationDefinition["trigger"], "launchPayload"> {
  const materialized = materializeLaunchPayload(input.minigame.configEntries);
  if (
    !input.isMenuLaunched ||
    input.minigame.playableId !== "activity-qte" ||
    materialized.launchPayload?.activityId != null
  ) {
    return materialized;
  }

  const fallbackActivityId = input.project.activities[0]?.id;
  if (fallbackActivityId == null || fallbackActivityId.length === 0) {
    return materialized;
  }

  return {
    launchPayload: {
      ...(materialized.launchPayload ?? {}),
      activityId: fallbackActivityId,
    },
  };
}

function isMeaningfulConfigEntry(
  entry: NonNullable<
    ScriptEditorProjectDefinition["minigames"][number]["configEntries"]
  >[number]
): boolean {
  const key = entry.id.trim();
  if (key.length === 0) {
    return false;
  }
  return !(entry.value === "" && /^config\d+$/.test(key));
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

function createDerivedMinigameIntegrationId(
  minigameId: string,
  playableId: string
): string {
  return `playable.${playableId}.instance.${minigameId}`;
}

function resolveScriptEditorMinigameIntegrationId(
  minigame: ScriptEditorProjectDefinition["minigames"][number],
  playableId: string
): string {
  const explicitIntegrationId =
    typeof minigame.integrationId === "string"
      ? minigame.integrationId.trim()
      : "";
  return explicitIntegrationId.length > 0
    ? explicitIntegrationId
    : createDerivedMinigameIntegrationId(minigame.id, playableId);
}

function createDerivedMinigameTriggerId(
  minigameId: string,
  playableId: string
): string {
  return `trigger.playable.${playableId}.instance.${minigameId}`;
}

function createDerivedFlowIntegrationId(flowId: string): string {
  return `playable.${flowId}.default`;
}

function createDerivedFlowTriggerId(flowId: string): string {
  return `trigger.playable.${flowId}.manual-launch`;
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
    record.characterSelection !== "fixed" &&
    record.characterSelection !== "select" &&
    record.characterSelection !== "first-playable"
  ) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.characterSelection`,
      message: `${fieldPath}.characterSelection must be "fixed", "select", or "first-playable".`,
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
  appendSettlementRecordDiagnostics(
    project.settlements,
    sourceEventIds,
    diagnostics
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
  const supportedPlayableIdByIntegrationId =
    collectSupportedPlayableIdByIntegrationId(project);
  const sourceSettlementIds = new Set(
    project.settlements
      .map((settlementRecord) => settlementRecord.id)
      .filter(
        (settlementId): settlementId is string =>
          typeof settlementId === "string" && settlementId.length > 0
      )
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
      supportedPlayableIdByIntegrationId,
      sourceSettlementIds,
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

  for (const settlementRecord of project.settlements) {
    if (
      typeof settlementRecord.nextEventId === "string" &&
      settlementRecord.nextEventId.length > 0
    ) {
      eventIds.add(settlementRecord.nextEventId);
    }
  }

  return eventIds;
}

function appendSettlementRecordDiagnostics(
  settlements: ScriptEditorProjectDefinition["settlements"],
  sourceEventIds: Set<string>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): void {
  for (const [settlementIndex, settlementRecord] of settlements.entries()) {
    const fieldPath = `project.settlements[${settlementIndex}]`;
    const nextEventId =
      typeof settlementRecord.nextEventId === "string"
        ? settlementRecord.nextEventId.trim()
        : "";
    if (nextEventId.length === 0 || sourceEventIds.has(nextEventId)) {
      continue;
    }
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `${fieldPath}.nextEventId`,
      message:
        `Settlement "${settlementRecord.id}" references missing next event "${nextEventId}".`,
    });
  }
}

function collectLegacyFlowLaunchActionsByEventId(
  project: ScriptEditorProjectDefinition,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Map<string, EventRouteCommand[]> {
  const actionsByEventId = new Map<string, EventRouteCommand[]>();

  for (const [index, flowRecord] of project.flows.entries()) {
    const fieldPath = `project.flows[${index}]`;
    const flow = flowRecord as ScriptEditorFlowRecord & Record<string, unknown>;
    for (const retiredField of [
      "eventStartTarget",
      "ownerKind",
      "ownerId",
      "returnPolicy",
      "triggerId",
      "triggerSource",
      "triggerEvent",
      "launchPayload",
      "playableId",
      "integrationId",
    ]) {
      if (!Object.hasOwn(flow, retiredField)) {
        continue;
      }
      diagnostics.push({
        code: "unsupported-lowering",
        fieldPath: `${fieldPath}.${retiredField}`,
        message: `Flow "${flow.id ?? `flow.${index + 1}`}" still carries retired routing field "${retiredField}".`,
      });
    }
  }

  return actionsByEventId;
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
  supportedPlayableIdByIntegrationId: Map<string, string>,
  sourceSettlementIds: Set<string>,
  minigamesById: Map<string, ScriptEditorProjectDefinition["minigames"][number]>,
  flowStartEventIds: Set<string>,
  derivedFlowActions: EventRouteCommand[],
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

  const destinationMenuAction = lowerEventDestinationMenuAction(
    eventRecord
  );
  if (destinationMenuAction === null) {
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
  if (
    !validateExclusiveEventRouteSeams(
      eventRecord,
      eventIndex,
      diagnostics
    )
  ) {
    return null;
  }

  const dialogueId = resolveEventDialogueId(
    eventRecord,
    eventIndex,
    flowStartEventIds,
    derivedFlowActions.length > 0,
    destinationLaunchAction != null || destinationMenuAction != null,
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

  const actions = lowerEventRouteCommands(
    eventRecord,
    eventIndex,
    destinationMenuAction ?? destinationLaunchAction,
    sourceFlowIds,
    supportedPlayableIdByIntegrationId,
    derivedFlowActions,
    diagnostics
  );
  if (actions === null) {
    return null;
  }
  const settlementId = lowerEventSettlementId(
    eventRecord,
    eventIndex,
    sourceSettlementIds,
    diagnostics
  );
  if (settlementId === null) {
    return null;
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
    trigger: {
      timing: lowerEventTriggerTiming(eventRecord.triggerTiming),
    },
    conditions: [],
    entrySceneId: dialogueId.length > 0 ? dialogueId : eventRecord.id,
    ...(Array.isArray(eventRecord.participants) && eventRecord.participants.length > 0
    ? { participants: eventRecord.participants }
      : {}),
    ...(eventRecord.type === "settlement" ? { type: "settlement" as const } : {}),
    dialogueId,
    ...(actions.length === 0 ? {} : { actions }),
    ...(settlementId.length === 0 ? {} : { settlementId }),
    ...(nextEventId.length === 0 ? {} : { nextEventId }),
    ...(taskInputs.length === 0 ? {} : { taskInputs }),
    ...(Array.isArray(eventRecord.tags) && eventRecord.tags.length > 0
      ? { tags: eventRecord.tags }
      : {}),
  };
}

function lowerEventTriggerTiming(
  timing: ScriptEditorEventRecord["triggerTiming"]
): EventDefinition["trigger"]["timing"] {
  if (timing === "city-enter") {
    return "city-enter";
  }
  if (timing === "building-enter") {
    return "house-enter";
  }
  return "manual";
}

function lowerEventSettlementId(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  sourceSettlementIds: Set<string>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  const settlementId =
    typeof eventRecord.settlementId === "string" ? eventRecord.settlementId.trim() : "";
  if (eventRecord.type !== "settlement") {
    if (settlementId.length > 0) {
      diagnostics.push({
        code: "invalid-field",
        fieldPath: `project.events[${eventIndex}].settlementId`,
        message:
          `Event "${eventRecord.id}" cannot carry settlementId unless type=settlement.`,
      });
      return null;
    }
    return "";
  }

  if (settlementId.length === 0) {
    diagnostics.push({
      code: "missing-field",
      fieldPath: `project.events[${eventIndex}].settlementId`,
      message:
        `Settlement event "${eventRecord.id}" requires a non-empty settlementId.`,
    });
    return null;
  }

  if (!sourceSettlementIds.has(settlementId)) {
    diagnostics.push({
      code: "missing-reference",
      fieldPath: `project.events[${eventIndex}].settlementId`,
      message:
        `Settlement event "${eventRecord.id}" references missing settlement "${settlementId}".`,
    });
    return null;
  }

  return settlementId;
}

function resolveEventDialogueId(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  flowStartEventIds: Set<string>,
  hasDerivedFlowAction: boolean,
  hasDestinationLaunchAction: boolean,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): string | null {
  const actions = eventRecord.actions ?? [];
  const destinationFamily = eventRecord.destination?.family;
  if (hasRouteOwningEventActions(actions)) {
    return "";
  }

  if (actions.length > 0 && destinationFamily !== "dialogue") {
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
  if (destination?.family === "menu") {
    return "";
  }
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

function collectSupportedPlayableIdByIntegrationId(
  project: ScriptEditorProjectDefinition
): Map<string, string> {
  const integrationIdByPlayableId = new Map<string, string>();

  for (const minigame of project.minigames) {
    const minigameId = typeof minigame.id === "string" ? minigame.id.trim() : "";
    const playableId =
      typeof minigame.playableId === "string" ? minigame.playableId.trim() : "";
    if (minigameId.length === 0 || playableId.length === 0) {
      continue;
    }
    const explicitIntegrationId =
      typeof minigame.integrationId === "string"
        ? minigame.integrationId.trim()
        : "";
    if (explicitIntegrationId.length > 0) {
      integrationIdByPlayableId.set(explicitIntegrationId, playableId);
    }
    integrationIdByPlayableId.set(
      createDerivedMinigameIntegrationId(minigameId, playableId),
      playableId
    );
  }

  for (const flow of project.flows) {
    const flowId = typeof flow.id === "string" ? flow.id.trim() : "";
    if (flowId.length === 0) {
      continue;
    }
    integrationIdByPlayableId.set(createDerivedFlowIntegrationId(flowId), flowId);
  }

  return integrationIdByPlayableId;
}

function hasRouteOwningEventActions(
  actions: readonly NonNullable<ScriptEditorEventRecord["actions"]>[number][]
): boolean {
  return actions.some(
    (action) =>
      action?.type === "openCityMenuPanel" ||
      action?.type === "launchPlayable" ||
      action?.type === "launchFlow"
  );
}

function validateExclusiveEventRouteSeams(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): boolean {
  const destinationFamily = eventRecord.destination?.family;
  const actions = eventRecord.actions ?? [];
  const hasRouteOwningAction = hasRouteOwningEventActions(actions);
  if (destinationFamily === "dialogue" && hasRouteOwningAction) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `project.events[${eventIndex}].actions`,
      message:
        `Event "${eventRecord.id}" cannot combine destination.family="dialogue" with route-owning payload actions.`,
    });
    return false;
  }
  if (
    destinationFamily === "menu" &&
    actions.some((action) => action?.type === "openCityMenuPanel")
  ) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `project.events[${eventIndex}].actions`,
      message:
        `Event "${eventRecord.id}" cannot combine destination.family="menu" with explicit openCityMenuPanel payload actions.`,
    });
    return false;
  }

  if (
    destinationFamily === "minigame" &&
    actions.some((action) => action?.type === "launchPlayable")
  ) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `project.events[${eventIndex}].actions`,
      message:
        `Event "${eventRecord.id}" cannot combine destination.family="minigame" with explicit playable payload actions.`,
    });
    return false;
  }

  return true;
}

function lowerEventRouteCommands(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  destinationAction:
    | Extract<
        EventRouteCommand,
        { type: "launchPlayable" } | { type: "openCityMenuPanel" }
      >
    | null
    | undefined,
  sourceFlowIds: Set<string>,
  supportedPlayableIdByIntegrationId: Map<string, string>,
  derivedFlowActions: EventRouteCommand[],
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): EventRouteCommand[] | null {
  const actions: EventRouteCommand[] = [];
  if (destinationAction != null) {
    actions.push(destinationAction);
  }
  for (const [actionIndex, action] of (eventRecord.actions ?? []).entries()) {
    if (action?.type === "closeBuilding") {
      actions.push({ type: "closeBuilding" });
      continue;
    }
    if (action?.type === "openCityMenuPanel") {
      const panelId = normalizeCityMenuPanelId(action.panelId);
      if (panelId == null) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `project.events[${eventIndex}].actions[${actionIndex}].panelId`,
          message:
            `Event "${eventRecord.id}" carries unsupported city menu panel "${String(action.panelId)}".`,
        });
        return null;
      }
      actions.push({
        type: "openCityMenuPanel",
        panelId,
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
      const flowId = action.flowId.trim();
      if (!sourceFlowIds.has(flowId)) {
        diagnostics.push({
          code: "missing-reference",
          fieldPath: `project.events[${eventIndex}].actions[${actionIndex}].flowId`,
          message: `Event "${eventRecord.id}" references missing flow "${flowId}".`,
        });
        return null;
      }
      actions.push({
        type: "launchPlayable",
        playableId: flowId,
        integrationId: createDerivedFlowIntegrationId(flowId),
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
      const playableId = action.playableId.trim();
      const integrationId = action.integrationId.trim();
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
      const supportedPlayableId =
        supportedPlayableIdByIntegrationId.get(integrationId);
      if (supportedPlayableId == null) {
        diagnostics.push({
          code: "missing-reference",
          fieldPath: `project.events[${eventIndex}].actions[${actionIndex}].integrationId`,
          message:
            `Event "${eventRecord.id}" references missing playable integration "${integrationId}".`,
        });
        return null;
      }
      if (supportedPlayableId !== playableId) {
        diagnostics.push({
          code: "invalid-field",
          fieldPath: `project.events[${eventIndex}].actions[${actionIndex}]`,
          message:
            `Event "${eventRecord.id}" uses playable integration "${integrationId}" with mismatched playableId "${playableId}".`,
        });
        return null;
      }
      actions.push({
        type: "launchPlayable",
        playableId,
        integrationId,
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
    diagnostics.push({
      code: "unsupported-lowering",
      fieldPath: `project.events[${eventIndex}].actions[${actionIndex}]`,
      message:
        "Event export currently supports only closeBuilding, openCityMenuPanel, launchFlow, and launchPlayable runtime actions.",
    });
    return null;
  }

  actions.push(...derivedFlowActions);
  return actions;
}

function lowerEventDestinationMenuAction(
  eventRecord: ScriptEditorEventRecord
): Extract<EventRouteCommand, { type: "openCityMenuPanel" }> | null | undefined {
  const destination = eventRecord.destination;
  if (destination?.family !== "menu") {
    return undefined;
  }

  const panelId = normalizeCityMenuPanelId(destination.targetId);
  if (panelId == null) {
    return undefined;
  }

  return {
    type: "openCityMenuPanel",
    panelId,
    meta: {
      scriptEditorSource: SCRIPT_EDITOR_DERIVED_EVENT_DESTINATION_SOURCE,
    },
  };
}

function normalizeCityMenuPanelId(
  value: unknown
): Extract<EventRouteCommand, { type: "openCityMenuPanel" }>["panelId"] | null {
  const normalized =
    typeof value === "string"
      ? value.trim().toLowerCase().replace(/^city-panel\./, "")
      : "";
  switch (normalized) {
    case "overview":
    case "culture":
      return "overview";
    case "intel":
      return "intel";
    case "locations":
      return "locations";
    case "management":
      return "management";
    default:
      return null;
  }
}

function lowerEventDestinationLaunchAction(
  eventRecord: ScriptEditorEventRecord,
  eventIndex: number,
  minigamesById: Map<string, ScriptEditorProjectDefinition["minigames"][number]>,
  diagnostics: ScriptEditorRuntimeExportDiagnostic[]
): Extract<EventRouteCommand, { type: "launchPlayable" }> | null | undefined {
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
    const playableDefinition =
      builtinScriptEditorPlayableCatalog.getPlayableDefinition(targetId);
    if (playableDefinition != null) {
      diagnostics.push({
        code: "missing-reference",
        fieldPath: `project.events[${eventIndex}].destination.targetId`,
        message:
          `Event "${eventRecord.id}" references minigame prototype "${targetId}"; create a gameplay instance in the minigame module first.`,
      });
      return null;
    }
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
  if (playableId == null) {
    return null;
  }
  const integrationId = resolveScriptEditorMinigameIntegrationId(
    minigame,
    playableId
  );

  return {
    type: "launchPlayable",
    playableId,
    integrationId,
    ownerContext: {
      ownerKind: "external",
      ownerId: null,
      returnPolicy: "close-only",
    },
    payload: {
      scriptEditorSource: SCRIPT_EDITOR_DERIVED_EVENT_DESTINATION_SOURCE,
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

  const ownerId =
    typeof binding.owner.id === "string" ? binding.owner.id.trim() : "";
  if (ownerId.length === 0) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `${fieldPath}.owner.id`,
      message:
        "Event binding runtime export requires a concrete owner id and does not allow empty wildcard owners.",
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
      id: ownerId,
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

  if (nextEventId === eventRecord.id) {
    diagnostics.push({
      code: "invalid-field",
      fieldPath: `project.events[${eventIndex}].nextEventId`,
      message:
        `Event "${eventRecord.id}" cannot reference itself through nextEventId.`,
    });
    return null;
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
      record.characterSelection === "fixed" ||
      record.characterSelection === "select" ||
      record.characterSelection === "first-playable") &&
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

function pickOptionalAudioSettings(
  storyPack: ScriptEditorStoryPackRecord
): Partial<Pick<RuntimePackManifest, "audioSettings">> {
  if (
    storyPack["audioSettings"] == null ||
    typeof storyPack["audioSettings"] !== "object" ||
    Array.isArray(storyPack["audioSettings"])
  ) {
    return {};
  }

  const authoredAudioSettings = storyPack["audioSettings"] as { muted?: unknown };
  return {
    audioSettings: {
      muted: authoredAudioSettings.muted === true,
    },
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

  diagnostics.push({
    code: "unsupported-family",
    fieldPath: "project.storyPack.compatibilityImport",
    message:
      "compatibilityImport is retired and now fail closed. Remove the leftover field instead of preserving compatibility residue for runtime export.",
  });
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
