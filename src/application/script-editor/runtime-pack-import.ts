import {
  loadScenarioPackFromUrl,
  parseScenarioPack,
} from "../scenario/scenario-pack-loader";
import { parseScriptEditorProject } from "./editor-project-loader";
import {
  normalizeScriptEditorBuildingRecord,
  normalizeScriptEditorCityRecord,
} from "./city-building-authoring";
import { normalizeScriptEditorPersonRecord } from "./person-authoring";
import { createDraftScriptEditorProjectCompletionState } from "./project-completion-state";
import {
  SCRIPT_EDITOR_PROJECT_MANIFEST_FILE,
  SCRIPT_EDITOR_PROJECT_KIND,
  SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
  SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION,
  type ScriptEditorAccessRule,
  type ScriptEditorEntityRecord,
  type ScriptEditorEventRecord,
  type ScriptEditorEventTriggerTiming,
  type ScriptEditorKeyValueEntry,
  type ScriptEditorMinigameOutcome,
  type ScriptEditorMinigameOutcomeRoute,
  type ScriptEditorMinigameOwnerKind,
  type ScriptEditorMinigameReturnPolicy,
  type ScriptEditorProjectDefinition,
  type ScriptEditorRuntimePackSchemaVersion,
  type ScriptEditorRuntimeRecord,
  type ScriptEditorStoryPackRecord,
  type ScriptEditorTextEntryRecord,
} from "../../domain/script-editor-project";
import type { EventDefinition } from "../../domain/event";
import type { LocationAccessDefinition } from "../../domain/location-access";
import type { PlayableIntegrationDefinition } from "../../core/contracts/playable-runtime";

export type ScriptEditorCompatibilityImportDiagnostic = {
  code:
    | "unsupported-family"
    | "missing-field"
    | "invalid-field"
    | "runtime-pack-contract";
  fieldPath: string;
  message: string;
};

export type ScriptEditorCompatibilityImportResidue = {
  unresolvedFamilies: Record<string, unknown>;
  diagnostics: ScriptEditorCompatibilityImportDiagnostic[];
};

type RuntimePackImportFileEntry = {
  file: File;
  relativePath: string;
};

type RuntimePackManifestFiles = {
  scenarioProfile: string;
  characters: string;
  events: string;
  scenes: string;
  tasks?: string;
  playables?: string;
  playableIntegrations?: string;
  cities?: string;
  houses?: string;
  maps?: string;
  cityEntries?: string;
  textEntries?: string;
  activities?: string;
  cards?: string;
  valuables?: string;
  cityNpcPools?: string;
  houseAccessRefusalRules?: string;
  locationAccess?: string;
  houseModuleDefaults?: string;
  historicalCharacters?: string;
  historicalCityRosters?: string;
  cityPortraits?: string;
  historicalCharacterIdByCharacterId?: string;
  uiScreenSchemas?: string;
  uiLayouts?: string;
  uiSkins?: string;
  uiAssetCatalogs?: string;
};

type RuntimePackManifest = {
  schemaVersion: ScriptEditorRuntimePackSchemaVersion;
  kind?: "scenario-pack";
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

const UNSUPPORTED_RUNTIME_FAMILY_MESSAGES = [
  {
    familyKey: "uiScreenSchemas",
    fieldPath: "pack.uiScreenSchemas",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.uiScreenSchemas) && pack.uiScreenSchemas.length > 0,
    message:
      "uiScreenSchemas cannot be imported in this bounded slice; UI reserve compatibility remains a later queue.",
  },
  {
    familyKey: "uiLayouts",
    fieldPath: "pack.uiLayouts",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.uiLayouts) && pack.uiLayouts.length > 0,
    message:
      "uiLayouts cannot be imported in this bounded slice; UI reserve compatibility remains a later queue.",
  },
  {
    familyKey: "uiSkins",
    fieldPath: "pack.uiSkins",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.uiSkins) && pack.uiSkins.length > 0,
    message:
      "uiSkins cannot be imported in this bounded slice; UI reserve compatibility remains a later queue.",
  },
  {
    familyKey: "uiAssetCatalogs",
    fieldPath: "pack.uiAssetCatalogs",
    hasValue: (pack: Record<string, unknown>) =>
      Array.isArray(pack.uiAssetCatalogs) && pack.uiAssetCatalogs.length > 0,
    message:
      "uiAssetCatalogs cannot be imported in this bounded slice; UI reserve compatibility remains a later queue.",
  },
] as const;

export async function loadScriptEditorProjectFromScenarioPackFiles(
  files: readonly File[]
): Promise<ScriptEditorProjectDefinition> {
  if (files.length === 0) {
    throw new Error("Scenario pack import must include at least one file.");
  }

  const indexedFiles = indexScenarioPackImportFiles(files);
  const manifestFileEntry = selectScenarioPackManifestFileEntry(indexedFiles);
  if (manifestFileEntry == null) {
    if (hasScriptEditorProjectManifest(indexedFiles)) {
      throw new Error(
        `Imported files contain ${SCRIPT_EDITOR_PROJECT_MANIFEST_FILE}, which is a script editor project export rather than a runtime pack export. Use the project-open flow for project.json exports, or import a runtime pack that contains ${RUNTIME_PACK_MANIFEST_FILE}.`
      );
    }
    throw new Error(
      `Imported scenario pack is missing ${RUNTIME_PACK_MANIFEST_FILE}.`
    );
  }

  const rawPack = JSON.parse(await manifestFileEntry.file.text());
  if (!isScenarioPackManifest(rawPack)) {
    throw new Error(
      `Imported scenario pack ${RUNTIME_PACK_MANIFEST_FILE} must be a manifest-driven scenario pack.`
    );
  }

  return importScenarioPackToScriptEditorProject(
    await hydrateScenarioPackManifestFromFiles(
      rawPack,
      manifestFileEntry.relativePath,
      indexedFiles
    )
  );
}

export async function loadScriptEditorProjectFromScenarioPackUrl(
  url: string
): Promise<ScriptEditorProjectDefinition> {
  return importScenarioPackToScriptEditorProject(
    await loadScenarioPackFromUrl(url)
  );
}

export function validateScenarioPackForScriptEditorImport(
  value: unknown
): ScriptEditorCompatibilityImportDiagnostic[] {
  const pack = parseScenarioPack(value);
  const rawPack = pack as Record<string, unknown>;

  return UNSUPPORTED_RUNTIME_FAMILY_MESSAGES.flatMap((entry) =>
    entry.hasValue(rawPack)
      ? [
          {
            code: "unsupported-family" as const,
            fieldPath: entry.fieldPath,
            message: entry.message,
          },
        ]
      : []
  );
}

export function importScenarioPackToScriptEditorProject(
  value: unknown
): ScriptEditorProjectDefinition {
  const pack = parseScenarioPack(value);
  const diagnostics = validateScenarioPackForScriptEditorImport(pack);
  const rawPack = pack as Record<string, unknown>;
  const importedLocationAccess = readLocationAccessFamily(rawPack);
  const cityNpcPools = readArrayFamily(rawPack, "cityNpcPools");
  const importedPeople = collectImportedPeople(pack.characters ?? [], cityNpcPools);
  const importedCities = (pack.cities ?? []).map((city) =>
    applyImportedMountedBuildings(
      applyImportedLocationAccess(city, "city", importedLocationAccess),
      pack.cityEntries ?? [],
      pack.houses ?? [],
      cityNpcPools
    )
  );
  const project = {
    schemaVersion: SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
    kind: SCRIPT_EDITOR_PROJECT_KIND,
    id: pack.id,
    title: pack.title,
    ...(pack.description == null ? {} : { description: pack.description }),
    completionState: createDraftScriptEditorProjectCompletionState(),
    storyPack: createStoryPackRecord(
      pack,
      rawPack,
      collectCompatibilityImportResidue(rawPack, diagnostics)
    ),
    maps: readEntityArrayFamily(rawPack, "maps"),
    people: importedPeople.map((character) =>
      normalizeScriptEditorPersonRecord(character as Record<string, unknown>)
    ),
    cities: importedCities.map((city) =>
      normalizeScriptEditorCityRecord(
        city
      )
    ),
    buildings: (pack.houses ?? []).map((house) =>
      normalizeScriptEditorBuildingRecord(
        applyImportedLocationAccess(house, "building", importedLocationAccess)
      )
    ),
    cityEntries: pack.cityEntries ?? [],
    events: mapImportedEvents(pack.events ?? []),
    eventBindings: [],
    scenes: pack.scenes ?? [],
    quests: pack.tasks ?? [],
    activities: pack.activities ?? [],
    cards: pack.cards ?? [],
    valuables: pack.valuables ?? [],
    cityNpcPools,
    houseAccessRefusalRules: pack.houseAccessRefusalRules ?? [],
    houseModuleDefaults: cloneObjectRecord(pack.houseModuleDefaults),
    cityPortraits: cloneStringRecord(pack.cityPortraits),
    historicalCharacters: pack.historicalCharacters ?? [],
    historicalCityRosters: readArrayFamily(rawPack, "historicalCityRosters"),
    historicalCharacterIdByCharacterId: cloneStringRecord(
      pack.historicalCharacterIdByCharacterId
    ),
    dialogues: [],
    minigames: mapImportedPlayableIntegrations(rawPack),
    storyNodes: [],
    textEntries: mapTextEntries(pack.textEntries),
    conditionGroups: [],
    effectBundles: [],
  } satisfies ScriptEditorProjectDefinition;

  try {
    return parseScriptEditorProject(project);
  } catch (error) {
    throw new Error(
      formatDiagnostics([
        {
          code: "runtime-pack-contract",
          fieldPath: "pack",
          message:
            error instanceof Error
              ? error.message
              : "Scenario pack import failed script-editor project contract validation.",
        },
      ])
    );
  }
}

function createStoryPackRecord(
  pack: ReturnType<typeof parseScenarioPack>,
  rawPack: Record<string, unknown>,
  compatibilityImportResidue: ScriptEditorCompatibilityImportResidue | null
): ScriptEditorStoryPackRecord {
  return {
    id: pack.id,
    title: pack.title,
    ...(pack.description == null ? {} : { description: pack.description }),
    scenarioProfile: pack.scenarioProfile,
    ...(typeof rawPack.basePackId === "string"
      ? { basePackId: rawPack.basePackId }
      : {}),
    ...(typeof rawPack.author === "string" ? { author: rawPack.author } : {}),
    ...(typeof rawPack.version === "string" ? { version: rawPack.version } : {}),
    ...(Array.isArray(rawPack.tags) &&
    rawPack.tags.every((tag) => typeof tag === "string")
      ? { tags: [...rawPack.tags] as string[] }
      : {}),
    ...(Array.isArray(rawPack.events)
      ? { runtimeEvents: cloneJsonCompatibleValue(rawPack.events) }
      : {}),
    ...(compatibilityImportResidue == null
      ? {}
      : { compatibilityImport: compatibilityImportResidue }),
  };
}

function mapImportedEvents(events: EventDefinition[]): ScriptEditorEventRecord[] {
  return events.map((eventDefinition) => {
    const importedEvent = eventDefinition as EventDefinition & {
      title?: string;
      description?: string;
      triggerTiming?: ScriptEditorEventTriggerTiming;
      repeatable?: boolean;
    };
    const triggerScope = eventDefinition.trigger?.scope;
    const importedConditions = Array.isArray(eventDefinition.conditions)
      ? eventDefinition.conditions
      : [];

    return {
      id: eventDefinition.id,
      title: normalizeImportedEventTitle(eventDefinition),
      description: buildImportedEventDescription(importedEvent),
      triggerTiming:
        importedEvent.triggerTiming ?? mapImportedEventTriggerTiming(eventDefinition.trigger?.timing),
      repeatable:
        importedEvent.repeatable === true || eventDefinition.occurrence === "repeatable",
      nextEventId: eventDefinition.nextEventId ?? "",
      taskInputs: eventDefinition.taskInputs ?? [],
      conditionGroups: [],
      destination: {
        family: "event",
        targetId: eventDefinition.nextEventId ?? "",
      },
      relations: {
        storyNodeId: "",
        personIds: (eventDefinition.participants ?? []).map((participant) => participant.characterId),
        cityIds: triggerScope?.cityId != null ? [triggerScope.cityId] : [],
        buildingIds: triggerScope?.houseId != null ? [triggerScope.houseId] : [],
      },
      previewSummary: {
        previewNotes:
          typeof eventDefinition.entrySceneId === "string" && eventDefinition.entrySceneId.length > 0
            ? `Imported runtime entry scene: ${eventDefinition.entrySceneId}`
            : "",
        validationNotes:
          importedConditions.length > 0
            ? `Original runtime event carries ${importedConditions.length} condition nodes that still require bounded translation.`
            : "",
      },
    };
  });
}

function normalizeImportedEventTitle(eventDefinition: EventDefinition): string {
  const importedTitle = (eventDefinition as EventDefinition & { title?: string }).title;
  const fallbackTitle = typeof importedTitle === "string" ? importedTitle : "";
  const runtimeName = typeof eventDefinition.name === "string" ? eventDefinition.name : "";
  const candidate: string = runtimeName.trim().length > 0 ? runtimeName : fallbackTitle;
  return candidate.trim().length > 0 ? candidate.trim() : eventDefinition.id;
}

function buildImportedEventDescription(
  eventDefinition: EventDefinition & { description?: string }
): string {
  if (typeof eventDefinition.description === "string" && eventDefinition.description.length > 0) {
    return eventDefinition.description;
  }

  const summaryParts = [
    `Imported from runtime event ${eventDefinition.id}.`,
  ];
  if (typeof eventDefinition.chapterId === "string" && eventDefinition.chapterId.length > 0) {
    summaryParts.push(`Chapter ${eventDefinition.chapterId}.`);
  }
  if (typeof eventDefinition.entrySceneId === "string" && eventDefinition.entrySceneId.length > 0) {
    summaryParts.push(`Entry scene ${eventDefinition.entrySceneId}.`);
  }
  if (typeof eventDefinition.nextEventId === "string" && eventDefinition.nextEventId.length > 0) {
    summaryParts.push(`Next event ${eventDefinition.nextEventId}.`);
  }
  return summaryParts.join(" ");
}

function mapImportedEventTriggerTiming(
  timing?: EventDefinition["trigger"]["timing"]
): ScriptEditorEventTriggerTiming {
  switch (timing) {
    case "city-enter":
      return "city-enter";
    case "house-enter":
      return "building-enter";
    default:
      return "manual";
  }
}

function mapTextEntries(
  textEntries: Record<string, string> | undefined
): ScriptEditorTextEntryRecord[] {
  return Object.entries(textEntries ?? {}).map(([id, text]) => ({
    id,
    text,
  }));
}

function mapImportedPlayableIntegrations(
  rawPack: Record<string, unknown>
): ScriptEditorProjectDefinition["minigames"] {
  const playableIntegrations = rawPack.playableIntegrations;
  if (!Array.isArray(playableIntegrations)) {
    return [];
  }

  return playableIntegrations.flatMap((value, index) => {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      return [];
    }

    const integration = value as PlayableIntegrationDefinition & {
      editorRecordId?: string;
    };
    if (
      typeof integration.integrationId !== "string" ||
      typeof integration.playableId !== "string"
    ) {
      return [];
    }

    const ownerDefaults = integration.ownerDefaults ?? {};
    const trigger = integration.trigger;
    const ownerKind =
      typeof ownerDefaults.ownerKind === "string"
        ? ownerDefaults.ownerKind
        : typeof trigger?.ownerKind === "string"
          ? trigger.ownerKind
          : "external";
    const returnPolicy =
      typeof ownerDefaults.returnPolicy === "string"
        ? ownerDefaults.returnPolicy
        : "close-only";

    return [
      {
        id:
          typeof integration.editorRecordId === "string" &&
          integration.editorRecordId.length > 0
            ? integration.editorRecordId
            : `minigame.imported.${index + 1}`,
        title: integration.integrationId,
        description: "",
        playableId: integration.playableId,
        integrationId: integration.integrationId,
        ownerKind: normalizeImportedOwnerKind(ownerKind),
        ownerId:
          typeof ownerDefaults.ownerId === "string" ? ownerDefaults.ownerId : "",
        returnPolicy: normalizeImportedReturnPolicy(returnPolicy),
        triggerId: typeof trigger?.triggerId === "string" ? trigger.triggerId : "",
        triggerSource: "manual",
        triggerEvent: typeof trigger?.trigger === "string" ? trigger.trigger : "",
        launchPayload: mapImportedLaunchPayload(trigger?.launchPayload),
        outcomeRoutes: mapImportedOutcomeRoutes(integration.outcomeConfig),
        notes: "Imported from runtime playable integration.",
      },
    ];
  });
}

function mapImportedLaunchPayload(
  launchPayload: Record<string, unknown> | undefined
): ScriptEditorKeyValueEntry[] {
  return Object.entries(launchPayload ?? {}).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
  }));
}

function mapImportedOutcomeRoutes(
  outcomeConfig: PlayableIntegrationDefinition["outcomeConfig"] | undefined
): ScriptEditorMinigameOutcomeRoute[] {
  return Object.entries(outcomeConfig?.handoffByOutcome ?? {}).map(
    ([outcome, handoffPolicy], index) => ({
      id: `outcome-route.${index + 1}`,
      outcome: normalizeImportedOutcome(outcome),
      handoffPolicy: normalizeImportedReturnPolicy(handoffPolicy),
      summary: "",
      effectHint: "",
    })
  );
}

function normalizeImportedOwnerKind(
  value: string
): ScriptEditorMinigameOwnerKind {
  return value === "house" || value === "scene" || value === "task" || value === "external"
    ? value
    : "external";
}

function normalizeImportedReturnPolicy(
  value: unknown
): ScriptEditorMinigameReturnPolicy {
  return value === "resume-owner" || value === "reenter-owner" || value === "close-only"
    ? value
    : "close-only";
}

function normalizeImportedOutcome(
  value: string
): ScriptEditorMinigameOutcome {
  return value === "success" || value === "failure" || value === "cancelled"
    ? value
    : "success";
}

function readArrayFamily(
  rawPack: Record<string, unknown>,
  familyKey: string
): ScriptEditorRuntimeRecord[] {
  const value = rawPack[familyKey];
  return Array.isArray(value)
    ? (cloneJsonCompatibleValue(value) as ScriptEditorRuntimeRecord[])
    : [];
}

function readEntityArrayFamily(
  rawPack: Record<string, unknown>,
  familyKey: string
): ScriptEditorEntityRecord[] {
  return readArrayFamily(rawPack, familyKey) as ScriptEditorEntityRecord[];
}

function collectImportedPeople(
  characters: readonly Record<string, unknown>[],
  cityNpcPools: readonly Record<string, unknown>[]
): Record<string, unknown>[] {
  const importedPeople = [...characters];
  const importedPersonIds = new Set(
    importedPeople.map((person) => readString(person.id)).filter((id) => id.length > 0)
  );

  for (const pool of cityNpcPools) {
    const fallbackCityId = readString(pool.cityId);
    if (!Array.isArray(pool.residents)) {
      continue;
    }

    for (const resident of pool.residents) {
      if (resident == null || typeof resident !== "object" || Array.isArray(resident)) {
        continue;
      }

      const residentRecord = resident as Record<string, unknown>;
      const id = readString(residentRecord.id);
      if (id.length === 0 || importedPersonIds.has(id)) {
        continue;
      }

      importedPeople.push({
        ...(cloneJsonCompatibleValue(residentRecord) as Record<string, unknown>),
        id,
        personType: "NPC",
        role: readString(residentRecord.role) || "support",
        cityId: readString(residentRecord.cityId) || fallbackCityId,
      });
      importedPersonIds.add(id);
    }
  }

  return importedPeople;
}

function readLocationAccessFamily(
  rawPack: Record<string, unknown>
): LocationAccessDefinition[] {
  const value = rawPack.locationAccess;
  return Array.isArray(value)
    ? (cloneJsonCompatibleValue(value) as LocationAccessDefinition[])
    : [];
}

function applyImportedLocationAccess<T extends { id: string }>(
  record: T,
  targetFamily: LocationAccessDefinition["targetFamily"],
  locationAccessDefinitions: readonly LocationAccessDefinition[]
): T & { access?: ScriptEditorAccessRule } {
  const accessDefinition = locationAccessDefinitions.find(
    (definition) =>
      definition.targetFamily === targetFamily &&
      definition.targetId === record.id
  );
  if (accessDefinition == null) {
    return record;
  }

  return {
    ...record,
    access: {
      conditionExpression: accessDefinition.conditionExpression,
      ...(accessDefinition.blockedReason == null
        ? {}
        : { blockedReason: accessDefinition.blockedReason }),
      ...(accessDefinition.blockedMessage == null
        ? {}
        : { blockedMessage: accessDefinition.blockedMessage }),
      ...(accessDefinition.blockedSpeakerId == null
        ? {}
        : { blockedSpeakerId: accessDefinition.blockedSpeakerId }),
      ...(accessDefinition.guidance == null
        ? {}
        : { guidance: accessDefinition.guidance }),
      ...(accessDefinition.refusalEventId == null
        ? {}
        : { refusalEventId: accessDefinition.refusalEventId }),
    },
  };
}

function applyImportedMountedBuildings<T extends { id: string }>(
  city: T,
  cityEntries: readonly Record<string, unknown>[],
  houses: readonly Record<string, unknown>[],
  cityNpcPools: readonly Record<string, unknown>[]
): T & { mountedBuildings?: { buildingId: string; npcIds: string[]; primaryNpcId: string | null }[] } {
  const mountedBuildings = cityEntries.flatMap((entry) => {
    if (readString(entry.cityId) !== city.id) {
      return [];
    }
    const buildingId = readString(entry.targetHouseId);
    if (buildingId.length === 0) {
      return [];
    }
    const house = houses.find((candidate) => readString(candidate.id) === buildingId);
    if (house == null) {
      return [];
    }
    return [
      {
        buildingId,
        npcIds: readImportedMountedNpcIds(city.id, house, cityNpcPools),
        primaryNpcId: readImportedPrimaryNpcId(house),
      },
    ];
  });

  if (mountedBuildings.length === 0) {
    return city;
  }

  return {
    ...city,
    mountedBuildings,
  };
}

function readImportedMountedNpcIds(
  cityId: string,
  house: Record<string, unknown>,
  cityNpcPools: readonly Record<string, unknown>[]
): string[] {
  const houseCharacterIds = readStringArray(house.characterIds);
  if (houseCharacterIds.length === 0) {
    return [];
  }
  const cityPool = cityNpcPools.find((pool) => readString(pool.cityId) === cityId);
  if (cityPool == null || !Array.isArray(cityPool.residents)) {
    return houseCharacterIds;
  }
  const residentIds = new Set(
    cityPool.residents.flatMap((resident) =>
      resident != null && typeof resident === "object" && !Array.isArray(resident)
        ? [readString((resident as Record<string, unknown>).id)]
        : []
    )
  );
  return houseCharacterIds.filter((characterId) => residentIds.has(characterId));
}

function readImportedPrimaryNpcId(house: Record<string, unknown>): string | null {
  const defaultCharacterId = readString(house.defaultCharacterId);
  return defaultCharacterId.length > 0 ? defaultCharacterId : null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => readString(entry))
    .filter((entry) => entry.length > 0);
}

async function hydrateScenarioPackManifestFromFiles(
  manifest: RuntimePackManifest,
  manifestFilePath: string,
  indexedFiles: Record<string, RuntimePackImportFileEntry>
): Promise<unknown> {
  const manifestDirectoryPath = getScenarioPackImportDirectoryPath(
    manifestFilePath
  );
  const fileEntries = Object.entries(manifest.files);
  const resolvedEntries = await Promise.all(
    fileEntries.map(async ([key, relativePath]) => {
      const importedFile = resolveScenarioPackImportedFileEntry(
        indexedFiles,
        manifestDirectoryPath,
        relativePath
      );
      return [key, JSON.parse(await importedFile.file.text())] as const;
    })
  );
  const hydratedFields = Object.fromEntries(resolvedEntries);
  const resolvedMaps = await resolveImportedScenarioPackMapAssetDataUrls(
    hydratedFields.maps,
    manifestDirectoryPath,
    indexedFiles
  );
  return {
    schemaVersion: manifest.schemaVersion,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    ...(manifest.basePackId == null ? {} : { basePackId: manifest.basePackId }),
    ...(manifest.author == null ? {} : { author: manifest.author }),
    ...(manifest.version == null ? {} : { version: manifest.version }),
    ...(manifest.tags == null ? {} : { tags: [...manifest.tags] }),
    ...hydratedFields,
    ...(resolvedMaps == null ? {} : { maps: resolvedMaps }),
  };
}

async function resolveImportedScenarioPackMapAssetDataUrls(
  maps: unknown,
  manifestDirectoryPath: string,
  indexedFiles: Record<string, RuntimePackImportFileEntry>
): Promise<unknown> {
  if (!Array.isArray(maps)) {
    return maps;
  }

  const assetUrlCache: Record<string, string> = {};
  return Promise.all(
    maps.map(async (mapDefinition) => {
      if (mapDefinition == null || typeof mapDefinition !== "object" || Array.isArray(mapDefinition)) {
        return mapDefinition;
      }

      const rawMap = mapDefinition as Record<string, unknown>;
      return {
        ...rawMap,
        ...(typeof rawMap.primaryImageUrl === "string"
          ? {
              primaryImageUrl: await resolveImportedScenarioPackAssetDataUrl(
                rawMap.primaryImageUrl,
                manifestDirectoryPath,
                indexedFiles,
                assetUrlCache
              ),
            }
          : {}),
        ...(typeof rawMap.regionOverlayImageUrl === "string"
          ? {
              regionOverlayImageUrl: await resolveImportedScenarioPackAssetDataUrl(
                rawMap.regionOverlayImageUrl,
                manifestDirectoryPath,
                indexedFiles,
                assetUrlCache
              ),
            }
          : {}),
        ...(Array.isArray(rawMap.layers)
          ? {
              layers: await Promise.all(
                rawMap.layers.map(async (layerDefinition) => {
                  if (
                    layerDefinition == null ||
                    typeof layerDefinition !== "object" ||
                    Array.isArray(layerDefinition)
                  ) {
                    return layerDefinition;
                  }
                  const rawLayer = layerDefinition as Record<string, unknown>;
                  return {
                    ...rawLayer,
                    ...(typeof rawLayer.imageUrl === "string"
                      ? {
                          imageUrl: await resolveImportedScenarioPackAssetDataUrl(
                            rawLayer.imageUrl,
                            manifestDirectoryPath,
                            indexedFiles,
                            assetUrlCache
                          ),
                        }
                      : {}),
                  };
                })
              ),
            }
          : {}),
      };
    })
  );
}

async function resolveImportedScenarioPackAssetDataUrl(
  value: string,
  manifestDirectoryPath: string,
  indexedFiles: Record<string, RuntimePackImportFileEntry>,
  assetUrlCache: Record<string, string>
): Promise<string> {
  if (value.startsWith("data:")) {
    return normalizeImageDataUrlMime(value);
  }

  if (/^(https?:|file:|blob:|\/)/.test(value)) {
    return value;
  }

  const importedFile = resolveScenarioPackImportedFileEntry(
    indexedFiles,
    manifestDirectoryPath,
    value
  );
  const cachedAssetUrl = assetUrlCache[importedFile.relativePath];
  if (cachedAssetUrl != null) {
    return cachedAssetUrl;
  }

  const assetBuffer = await importedFile.file.arrayBuffer();
  const nextAssetUrl = `data:${resolveImportedAssetMimeType(
    importedFile,
    assetBuffer
  )};base64,${arrayBufferToBase64(assetBuffer)}`;
  assetUrlCache[importedFile.relativePath] = nextAssetUrl;
  return nextAssetUrl;
}

function resolveImportedAssetMimeType(
  importedFile: RuntimePackImportFileEntry,
  buffer: ArrayBuffer
): string {
  if (importedFile.file.type.startsWith("image/")) {
    return importedFile.file.type;
  }

  const mimeTypeByExtension: Record<string, string> = {
    ".apng": "image/apng",
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  const lowerPath = importedFile.relativePath.toLowerCase();
  const matchedExtension = Object.keys(mimeTypeByExtension).find((extension) =>
    lowerPath.endsWith(extension)
  );
  if (matchedExtension != null) {
    return mimeTypeByExtension[matchedExtension] as string;
  }

  return detectImageMimeType(buffer) ?? (importedFile.file.type || "application/octet-stream");
}

function normalizeImageDataUrlMime(value: string): string {
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=]+)/.exec(value);
  if (match == null || match[1] !== "application/octet-stream") {
    return value;
  }

  const detectedMimeType = detectBase64ImageMimeType(match[2] ?? "");
  return detectedMimeType == null
    ? value
    : value.replace("data:application/octet-stream;base64,", `data:${detectedMimeType};base64,`);
}

function detectBase64ImageMimeType(base64Value: string): string | null {
  if (base64Value.startsWith("iVBORw0KGgo")) {
    return "image/png";
  }
  if (base64Value.startsWith("/9j/")) {
    return "image/jpeg";
  }
  if (base64Value.startsWith("R0lGOD")) {
    return "image/gif";
  }
  if (base64Value.startsWith("UklGR")) {
    return "image/webp";
  }
  return null;
}

function detectImageMimeType(buffer: ArrayBuffer): string | null {
  const bytes = new Uint8Array(buffer);
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "image/gif";
  }
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function indexScenarioPackImportFiles(
  files: readonly File[]
): Record<string, RuntimePackImportFileEntry> {
  return Object.fromEntries(
    files.map((file) => {
      const relativePath = normalizeScenarioPackImportPath(
        file.webkitRelativePath || file.name
      );
      return [relativePath, { file, relativePath }] as const;
    })
  );
}

function hasScriptEditorProjectManifest(
  indexedFiles: Record<string, RuntimePackImportFileEntry>
): boolean {
  return Object.values(indexedFiles).some(
    (entry) =>
      entry.relativePath.endsWith(`/${SCRIPT_EDITOR_PROJECT_MANIFEST_FILE}`) ||
      entry.relativePath === SCRIPT_EDITOR_PROJECT_MANIFEST_FILE
  );
}

function selectScenarioPackManifestFileEntry(
  indexedFiles: Record<string, RuntimePackImportFileEntry>
): RuntimePackImportFileEntry | null {
  const manifestEntries = Object.values(indexedFiles).filter((entry) =>
    entry.relativePath.endsWith(`/${RUNTIME_PACK_MANIFEST_FILE}`) ||
    entry.relativePath === RUNTIME_PACK_MANIFEST_FILE
  );

  if (manifestEntries.length === 0) {
    return null;
  }

  if (manifestEntries.length > 1) {
    throw new Error(
      `Imported scenario pack contains multiple ${RUNTIME_PACK_MANIFEST_FILE} files.`
    );
  }

  return manifestEntries[0] ?? null;
}

function resolveScenarioPackImportedFileEntry(
  indexedFiles: Record<string, RuntimePackImportFileEntry>,
  manifestDirectoryPath: string,
  relativePath: string
): RuntimePackImportFileEntry {
  const resolvedPath = resolveScenarioPackImportPath(
    manifestDirectoryPath,
    relativePath
  );
  const importedFile = indexedFiles[resolvedPath];

  if (importedFile == null) {
    throw new Error(`Imported scenario pack is missing "${relativePath}".`);
  }

  return importedFile;
}

function getScenarioPackImportDirectoryPath(filePath: string): string {
  const lastSeparatorIndex = filePath.lastIndexOf("/");
  return lastSeparatorIndex < 0 ? "" : filePath.slice(0, lastSeparatorIndex);
}

function resolveScenarioPackImportPath(
  baseDirectoryPath: string,
  relativePath: string
): string {
  const combinedPath =
    baseDirectoryPath.length === 0
      ? relativePath
      : `${baseDirectoryPath}/${relativePath}`;

  return normalizeScenarioPackImportPath(combinedPath);
}

function normalizeScenarioPackImportPath(pathValue: string): string {
  const normalizedSegments: string[] = [];

  for (const segment of pathValue.replaceAll("\\", "/").split("/")) {
    if (segment.length === 0 || segment === ".") {
      continue;
    }
    if (segment === "..") {
      normalizedSegments.pop();
      continue;
    }
    normalizedSegments.push(segment);
  }

  return normalizedSegments.join("/");
}

function isScenarioPackManifest(value: unknown): value is RuntimePackManifest {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  if (
    candidate.files == null ||
    typeof candidate.files !== "object" ||
    Array.isArray(candidate.files)
  ) {
    return false;
  }

  if (
    candidate.schemaVersion !== SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION ||
    typeof candidate.id !== "string" ||
    typeof candidate.title !== "string"
  ) {
    return false;
  }

  const files = candidate.files as Record<string, unknown>;
  return (
    typeof files.scenarioProfile === "string" &&
    typeof files.characters === "string" &&
    typeof files.events === "string" &&
    typeof files.scenes === "string"
  );
}

function hasObjectEntries(value: unknown): boolean {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? Object.keys(value).length > 0
    : false;
}

function cloneObjectRecord(
  value: Record<string, unknown> | undefined
): Record<string, unknown> {
  return value == null
    ? {}
    : (cloneJsonCompatibleValue(value) as Record<string, unknown>);
}

function cloneStringRecord(
  value: Record<string, string> | undefined
): Record<string, string> {
  return value == null ? {} : { ...value };
}

function collectCompatibilityImportResidue(
  rawPack: Record<string, unknown>,
  diagnostics: ScriptEditorCompatibilityImportDiagnostic[]
): ScriptEditorCompatibilityImportResidue | null {
  if (diagnostics.length === 0) {
    return null;
  }

  const unresolvedFamilies = Object.fromEntries(
    UNSUPPORTED_RUNTIME_FAMILY_MESSAGES.flatMap((entry) => {
      const value = rawPack[entry.familyKey];
      return entry.hasValue(rawPack) ? [[entry.familyKey, cloneJsonCompatibleValue(value)]] : [];
    })
  );

  return {
    unresolvedFamilies,
    diagnostics: diagnostics.map((diagnostic) => ({ ...diagnostic })),
  };
}

function cloneJsonCompatibleValue(value: unknown): unknown {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function formatDiagnostics(
  diagnostics: ScriptEditorCompatibilityImportDiagnostic[]
): string {
  return [
    "Script editor compatibility import validation failed.",
    ...diagnostics.map(
      (diagnostic) => `- ${diagnostic.fieldPath}: ${diagnostic.message}`
    ),
  ].join("\n");
}
