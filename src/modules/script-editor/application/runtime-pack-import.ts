import {
  loadScenarioPackFromUrl,
  parseScenarioPack,
} from "../../../application/scenario/scenario-pack-loader";
import { parseScriptEditorProject } from "./editor-project-loader";
import {
  normalizeScriptEditorBuildingRecord,
  normalizeScriptEditorCityRecord,
} from "./city-building-authoring";
import { normalizeScriptEditorPersonRecord } from "./person-authoring";
import {
  normalizeScriptEditorEventBindingRecord,
} from "./story-dialogue-event-authoring";
import {
  createDefaultScriptEditorMinigameRecord,
} from "./minigame-binding-authoring";
import { createDraftScriptEditorProjectCompletionState } from "./project-completion-state";
import type { ContentPackAudioSettings } from "../../../domain/content-pack";
import {
  SCRIPT_EDITOR_PROJECT_MANIFEST_FILE,
  SCRIPT_EDITOR_PROJECT_KIND,
  SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
  SCRIPT_EDITOR_RUNTIME_PACK_SCHEMA_VERSION,
  type ScriptEditorAccessRule,
  type ScriptEditorBuildingArrangementRecord,
  type ScriptEditorDialogueOptionRecord,
  type ScriptEditorDialogueRecord,
  type ScriptEditorEntityRecord,
  type ScriptEditorEventRecord,
  type ScriptEditorEventTriggerTiming,
  type ScriptEditorKeyValueEntry,
  type ScriptEditorProjectDefinition,
  type ScriptEditorPersonSemanticBinding,
  type ScriptEditorRuntimePackSchemaVersion,
  type ScriptEditorRuntimeRecord,
  type ScriptEditorSettlementContentRecord,
  type ScriptEditorStoryPackRecord,
  type ScriptEditorTextEntryRecord,
  type ScriptEditorTypedAttributeRecord,
} from "../domain/script-editor-project";
import type { EventDefinition } from "../../../domain/event";
import type { LocationAccessDefinition } from "../../../domain/location-access";
import type { PlayableIntegrationDefinition } from "../../../core/contracts/playable-runtime";

export type ScriptEditorRuntimePackImportDiagnostic = {
  code:
    | "unsupported-family"
    | "missing-field"
    | "invalid-field"
    | "runtime-pack-contract";
  fieldPath: string;
  message: string;
};

type RuntimePackImportFileEntry = {
  file: File;
  relativePath: string;
};

type RuntimePackManifestFiles = {
  scenarioProfile: string;
  characters: string;
  events: string;
  dialogues: string;
  progressTracks?: string;
  progressTrackBindings?: string;
  menuResources?: string;
  menuInstances?: string;
  tasks?: string;
  playables?: string;
  playableIntegrations?: string;
  playableShells?: string;
  cities?: string;
  houses?: string;
  buildingArrangements?: string;
  settlements?: string;
  maps?: string;
  cityEntries?: string;
  textEntries?: string;
  activities?: string;
  cards?: string;
  valuables?: string;
  cityNpcPools?: string;
  locationAccess?: string;
  houseModuleDefaults?: string;
  portraits?: string;
  portraitVariants?: string;
  historicalCharacters?: string;
  historicalCityRosters?: string;
  cityPortraits?: string;
  historicalCharacterIdByCharacterId?: string;
  uiScreenSchemas?: string;
  uiLayouts?: string;
  uiSkins?: string;
  uiAssetCatalogs?: string;
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
  kind?: "scenario-pack";
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
): ScriptEditorRuntimePackImportDiagnostic[] {
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
  if (diagnostics.length > 0) {
    throw new Error(formatDiagnostics(diagnostics));
  }
  const rawPack = pack as Record<string, unknown>;
  const importedLocationAccess = readLocationAccessFamily(rawPack);
  const cityNpcPools = readArrayFamily(rawPack, "cityNpcPools");
  const importedPeople = collectImportedPeople(pack.characters ?? [], cityNpcPools);
  const importedMapNodeById = indexImportedMapNodes(pack.maps ?? []);
  const importedCities = (pack.cities ?? []).map((city) =>
    applyImportedCityMapPlacement(
      applyImportedLocationAccess(city, "city", importedLocationAccess),
      importedMapNodeById
    )
  );
  const importedMinigames = mapImportedPlayableIntegrations(rawPack);
  const project = {
    schemaVersion: SCRIPT_EDITOR_PROJECT_SCHEMA_VERSION,
    kind: SCRIPT_EDITOR_PROJECT_KIND,
    id: pack.id,
    title: pack.title,
    ...(pack.description == null ? {} : { description: pack.description }),
    completionState: createDraftScriptEditorProjectCompletionState(),
    storyPack: createStoryPackRecord(pack, rawPack),
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
    buildingArrangements: readBuildingArrangementsFamily(rawPack),
    cityEntries: pack.cityEntries ?? [],
    settlements: mapImportedSettlements(rawPack),
    events: mapImportedEvents(pack.events ?? [], importedMinigames),
    eventBindings: mapImportedEventBindings(rawPack),
    progressTracks: readProgressTrackFamily(rawPack),
    progressTrackBindings: readProgressTrackBindingFamily(rawPack),
    menuResources: mapImportedMenuResources(rawPack, importedMinigames),
    menuInstances: readMenuInstanceFamily(rawPack),
    dialogues: mapImportedRuntimeDialogues(
      rawPack,
      typeof pack.scenarioProfile.playerCharacterId === "string"
        ? pack.scenarioProfile.playerCharacterId.trim()
        : ""
    ),
    quests: pack.tasks ?? [],
    activities: pack.activities ?? [],
    cards: pack.cards ?? [],
    valuables: pack.valuables ?? [],
    cityNpcPools,
    houseModuleDefaults: cloneObjectRecord(pack.houseModuleDefaults),
    portraits: readPortraitFamily(rawPack),
    portraitVariants: readPortraitVariantFamily(rawPack),
    cityPortraits: cloneStringRecord(pack.cityPortraits),
    historicalCharacters: pack.historicalCharacters ?? [],
    historicalCityRosters: readArrayFamily(rawPack, "historicalCityRosters"),
    historicalCharacterIdByCharacterId: cloneStringRecord(
      pack.historicalCharacterIdByCharacterId
    ),
    minigames: importedMinigames,
    flows: readFlowPlayablesFamily(rawPack),
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

function indexImportedMapNodes(
  maps: readonly Record<string, unknown>[]
): Map<string, Record<string, unknown>> {
  const mapNodeById = new Map<string, Record<string, unknown>>();

  for (const mapDefinition of maps) {
    const nodes = Array.isArray(mapDefinition.nodes) ? mapDefinition.nodes : [];
    for (const node of nodes) {
      if (node == null || typeof node !== "object" || Array.isArray(node)) {
        continue;
      }
      const record = node as Record<string, unknown>;
      const id = readString(record.id);
      if (id.length === 0) {
        continue;
      }
      mapNodeById.set(id, record);
    }
  }

  return mapNodeById;
}

function applyImportedCityMapPlacement<
  T extends { id: string; name?: string; mapNodeId?: string; mapPlacement?: unknown }
>(
  city: T,
  mapNodeById: Map<string, Record<string, unknown>>
): T & { mapPlacement?: Record<string, unknown> } {
  if (city.mapPlacement != null) {
    return city as T & { mapPlacement?: Record<string, unknown> };
  }

  const mapNodeId = typeof city.mapNodeId === "string" ? city.mapNodeId : "";
  if (mapNodeId.length === 0) {
    return city as T & { mapPlacement?: Record<string, unknown> };
  }

  const mapNode = mapNodeById.get(mapNodeId);
  if (
    mapNode == null ||
    typeof mapNode.x !== "number" ||
    !Number.isFinite(mapNode.x) ||
    typeof mapNode.y !== "number" ||
    !Number.isFinite(mapNode.y)
  ) {
    return city as T & { mapPlacement?: Record<string, unknown> };
  }

  return {
    ...city,
    mapPlacement: {
      placementMode: "coordinate",
      mapNodeId,
      x: mapNode.x,
      y: mapNode.y,
      ...(typeof mapNode.kind === "string" ? { kind: mapNode.kind } : {}),
      ...(typeof mapNode.label === "string"
        ? { label: mapNode.label }
        : typeof city.name === "string"
          ? { label: city.name }
          : {}),
      ...(typeof mapNode.summary === "string" ? { summary: mapNode.summary } : {}),
    },
  };
}

function createStoryPackRecord(
  pack: ReturnType<typeof parseScenarioPack>,
  rawPack: Record<string, unknown>
): ScriptEditorStoryPackRecord {
  const rawAudioSettings =
    rawPack.audioSettings != null &&
    typeof rawPack.audioSettings === "object" &&
    !Array.isArray(rawPack.audioSettings)
      ? (rawPack.audioSettings as { muted?: unknown })
      : null;
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
    ...(rawAudioSettings != null
      ? {
          audioSettings: {
            muted: rawAudioSettings.muted === true,
          },
        }
      : {}),
    ...(Array.isArray(rawPack.tags) &&
    rawPack.tags.every((tag) => typeof tag === "string")
      ? { tags: [...rawPack.tags] as string[] }
      : {}),
    ...(Array.isArray(rawPack.personAttributeSemantics)
      ? {
          personAttributeSemantics: cloneJsonCompatibleValue(
            rawPack.personAttributeSemantics
          ) as ScriptEditorPersonSemanticBinding[],
        }
      : {}),
  };
}

function mapImportedEvents(
  events: EventDefinition[],
  importedMinigames: ScriptEditorProjectDefinition["minigames"]
): ScriptEditorEventRecord[] {
  const importedMinigameIdByIntegrationId =
    createImportedMinigameIdByIntegrationId(importedMinigames);
  return events.map((eventDefinition) => {
    const importedEvent = eventDefinition as EventDefinition & {
      title?: string;
      description?: string;
      triggerTiming?: ScriptEditorEventTriggerTiming;
      repeatable?: boolean;
    };
    const importedDialogueId =
      typeof importedEvent.dialogueId === "string" && importedEvent.dialogueId.length > 0
        ? importedEvent.dialogueId
        : "";
    const importedPlayableAction = (eventDefinition.actions ?? []).find(
      (action): action is Extract<NonNullable<EventDefinition["actions"]>[number], { type: "launchPlayable" }> =>
        action.type === "launchPlayable"
    );
    const importedMinigameId =
      importedPlayableAction == null
        ? ""
        : importedMinigameIdByIntegrationId.get(importedPlayableAction.integrationId) ?? "";
    const destinationFamily =
      importedDialogueId.length > 0
        ? "dialogue"
        : importedMinigameId.length > 0
          ? "minigame"
          : "event";
    const destinationTargetId =
      destinationFamily === "dialogue"
        ? importedDialogueId
        : destinationFamily === "minigame"
          ? importedMinigameId
          : eventDefinition.nextEventId ?? "";

    return {
      id: eventDefinition.id,
      title: normalizeImportedEventTitle(eventDefinition),
      description: buildImportedEventDescription(importedEvent),
      chapterId: eventDefinition.chapterId,
      occurrence: eventDefinition.occurrence,
      ...(eventDefinition.type === "settlement" ? { type: "settlement" as const } : {}),
      participants: eventDefinition.participants ?? [],
      actions: eventDefinition.actions ?? [],
      ...(eventDefinition.type === "settlement" &&
      typeof eventDefinition.settlementId === "string"
        ? { settlementId: eventDefinition.settlementId }
        : {}),
      tags: eventDefinition.tags ?? [],
      triggerTiming: importedEvent.triggerTiming ?? "manual",
      repeatable:
        importedEvent.repeatable === true || eventDefinition.occurrence === "repeatable",
      nextEventId: eventDefinition.nextEventId ?? "",
      taskInputs: eventDefinition.taskInputs ?? [],
      conditionGroups: [],
      destination: {
        family: destinationFamily,
        targetId: destinationTargetId,
      },
      relations: {
        storyNodeId: "",
        personIds: (eventDefinition.participants ?? []).map((participant) => participant.characterId),
        cityIds: [],
        buildingIds: [],
      },
      previewSummary: {
        previewNotes:
          importedDialogueId.length > 0
            ? `Imported runtime dialogue: ${importedDialogueId}`
            : importedMinigameId.length > 0
              ? `Imported runtime minigame: ${importedMinigameId}`
            : "",
        validationNotes: "",
      },
    };
  });
}

function mapImportedMenuResources(
  rawPack: Record<string, unknown>,
  importedMinigames: ScriptEditorProjectDefinition["minigames"]
): ScriptEditorProjectDefinition["menuResources"] {
  const importedMinigameIdByIntegrationId =
    createImportedMinigameIdByIntegrationId(importedMinigames);

  return readMenuResourceFamily(rawPack).map((resource) => ({
    ...resource,
    entries: resource.entries.map((entry) => {
      if (entry.targetFamily !== "minigame") {
        return entry;
      }
      return {
        ...entry,
        targetId:
          importedMinigameIdByIntegrationId.get(entry.targetId) ??
          entry.targetId,
      };
    }),
  }));
}

function mapImportedEventBindings(
  rawPack: Record<string, unknown>
): ScriptEditorProjectDefinition["eventBindings"] {
  if (!Array.isArray(rawPack.eventBindings)) {
    return [];
  }

  return rawPack.eventBindings
    .filter(
      (binding): binding is Record<string, unknown> =>
        binding != null &&
        typeof binding === "object" &&
        !Array.isArray(binding) &&
        typeof binding.id === "string"
    )
    .map((binding) => normalizeScriptEditorEventBindingRecord(binding as never));
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

  return "这里仅用于记录事件备注说明，不会参与剧本演出。";
}

function mapImportedRuntimeDialogues(
  rawPack: Record<string, unknown>,
  fallbackSpeakerPersonId: string
): ScriptEditorDialogueRecord[] {
  const importedDialogues = Array.isArray(rawPack.dialogues)
    ? rawPack.dialogues
    : [];
  const mappedDialogues: ScriptEditorDialogueRecord[] = [];

  for (const [dialogueIndex, value] of importedDialogues.entries()) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      continue;
    }

    const runtimeDialogue = value as Record<string, unknown>;
    const id = readString(runtimeDialogue.id) || `dialogue.imported.${dialogueIndex + 1}`;
    const title = readString(runtimeDialogue.name) || id;
    if (
      runtimeDialogue.screen != null &&
      typeof runtimeDialogue.screen === "object" &&
      !Array.isArray(runtimeDialogue.screen)
    ) {
      const screen = runtimeDialogue.screen as Record<string, unknown>;
      const mode = readString(screen.mode) === "choice" ? "choice" : "linear";
      const cast = Array.isArray(screen.cast)
        ? screen.cast.flatMap((memberValue) => {
            if (
              memberValue == null ||
              typeof memberValue !== "object" ||
              Array.isArray(memberValue)
            ) {
              return [];
            }
            const member = memberValue as Record<string, unknown>;
            const personId = readString(member.characterId);
            if (personId.length === 0) {
              return [];
            }
            const side: "left" | "right" =
              readString(member.side) === "right" ? "right" : "left";
            return [{ personId, side }];
          })
        : [];
      const options =
        mode === "choice" && Array.isArray(screen.options)
          ? screen.options.flatMap((optionValue, optionIndex) => {
              if (
                optionValue == null ||
                typeof optionValue !== "object" ||
                Array.isArray(optionValue)
              ) {
                return [];
              }
              const option = optionValue as Record<string, unknown>;
              return [
                {
                  id:
                    readString(option.id) ||
                    `option.imported.${dialogueIndex + 1}.${optionIndex + 1}`,
                  textId: readString(option.labelTextId),
                  nextEventId: readString(option.nextEventId),
                },
              ];
            })
          : [];

      mappedDialogues.push({
        id,
        title,
        mode,
        textId: readString(screen.textId),
        speakerPersonId: readString(screen.speakerCharacterId),
        cast,
        nextEventId: mode === "linear" ? readString(screen.nextEventId) : "",
        options,
      });
      continue;
    }

    if (!Array.isArray(runtimeDialogue.nodes)) {
      if (Array.isArray(runtimeDialogue.actions)) {
        throw new Error(
          `Imported runtime dialogue "${id}" still uses retired actions[]; use dialogues[].nodes instead.`
        );
      }
      continue;
    }
    const rawNodes = runtimeDialogue.nodes;
    const nodes = rawNodes.flatMap((nodeValue, nodeIndex) =>
      mapImportedRuntimeDialogueNode(nodeValue, nodeIndex)
    );
    const participantPersonIds = Array.from(
      new Set(
        rawNodes.flatMap((nodeValue) => {
          if (
            nodeValue == null ||
            typeof nodeValue !== "object" ||
            Array.isArray(nodeValue)
          ) {
            return [];
          }

          const characterId = readString(
            (nodeValue as Record<string, unknown>).characterId
          );
          return characterId.length > 0 ? [characterId] : [];
        })
      )
    );
    const firstDialogueNode = nodes.find((node) => node.nodeType === "dialogue");
    const firstTextNode = nodes.find((node) => node.textId.length > 0);
    const migratedSpeakerPersonId =
      firstDialogueNode?.speakerPersonId ??
      participantPersonIds[0] ??
      fallbackSpeakerPersonId;
    const migratedCastSourcePersonIds =
      participantPersonIds.length > 0
        ? participantPersonIds
        : migratedSpeakerPersonId.length > 0
          ? [migratedSpeakerPersonId]
          : [];
    const migratedCast = migratedCastSourcePersonIds
      .slice(0, 2)
      .map((personId, index) => ({
        personId,
        side: (index === 1 ? "right" : "left") as "left" | "right",
      }));
    const migratedOptions = extractImportedLegacyDialogueOptions(
      rawNodes,
      dialogueIndex
    );

    mappedDialogues.push({
      id,
      title,
      mode: migratedOptions.length > 0 ? "choice" : "linear",
      textId: firstTextNode?.textId ?? "",
      speakerPersonId: migratedSpeakerPersonId,
      cast: migratedCast,
      nextEventId: "",
      options: migratedOptions,
      participantPersonIds,
      nodes,
    });
  }

  return mappedDialogues;
}

function extractImportedLegacyDialogueOptions(
  rawNodes: unknown[],
  dialogueIndex: number
): ScriptEditorDialogueOptionRecord[] {
  const migratedOptions: ScriptEditorDialogueOptionRecord[] = [];

  for (const nodeValue of rawNodes) {
    if (
      nodeValue == null ||
      typeof nodeValue !== "object" ||
      Array.isArray(nodeValue)
    ) {
      continue;
    }

    const node = nodeValue as Record<string, unknown>;
    if (readString(node.type) !== "choice" || !Array.isArray(node.options)) {
      continue;
    }

    node.options.forEach((optionValue, optionIndex) => {
      if (
        optionValue == null ||
        typeof optionValue !== "object" ||
        Array.isArray(optionValue)
      ) {
        return;
      }

      const option = optionValue as Record<string, unknown>;
      migratedOptions.push({
        id:
          readString(option.id) ||
          `option.imported.${dialogueIndex + 1}.${optionIndex + 1}`,
        textId: readString(option.labelTextId),
        nextEventId: readString(option.nextEventId),
      });
    });
  }

  return migratedOptions;
}

function mapImportedRuntimeDialogueNode(
  value: unknown,
  nodeIndex: number
): NonNullable<ScriptEditorDialogueRecord["nodes"]> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  const node = value as Record<string, unknown>;
  const type = readString(node.type);
  const baseId = readString(node.id) || `imported-node-${nodeIndex + 1}`;

  if (type === "background") {
    const backgroundId = readString(node.backgroundId);
    return [
      {
        id: baseId,
        nodeType: "background",
        speakerPersonId: "",
        ...(backgroundId.length === 0 ? {} : { backgroundId }),
        textId: "",
        nextNodeId: "",
        choiceTargetNodeId: "",
      },
    ];
  }

  if (type === "music") {
    const musicId = readString(node.musicId);
    return [
      {
        id: baseId,
        nodeType: "music",
        speakerPersonId: "",
        ...(musicId.length === 0 ? {} : { musicId }),
        ...(node.loop === true ? { loop: true } : {}),
        textId: "",
        nextNodeId: "",
        choiceTargetNodeId: "",
      },
    ];
  }

  if (type === "dialogue") {
    const side = readDialogueSide(node.side);
    const portraitId = readString(node.portraitId);
    return [
      {
        id: baseId,
        nodeType: "dialogue",
        speakerPersonId: readString(node.characterId),
        ...(side == null ? {} : { side }),
        ...(portraitId.length === 0 ? {} : { portraitId }),
        textId: readString(node.textId),
        nextNodeId: "",
        choiceTargetNodeId: "",
      },
    ];
  }

  if (type === "narration") {
    return [
      {
        id: baseId,
        nodeType: "narration",
        speakerPersonId: "",
        textId: readString(node.textId),
        nextNodeId: "",
        choiceTargetNodeId: "",
      },
    ];
  }

  if (type === "choice") {
    const options = Array.isArray(node.options) ? node.options : [];
    const firstOption =
      options.find(
        (option): option is Record<string, unknown> =>
          option != null && typeof option === "object" && !Array.isArray(option)
      ) ?? null;
    return [
      {
        id: baseId,
        nodeType: "choice",
        speakerPersonId: "",
        textId: readString(node.promptTextId),
        nextNodeId: "",
        choiceTargetNodeId:
          firstOption == null ? "" : readString(firstOption.nextDialogueId),
      },
    ];
  }

  return [];
}

function readDialogueSide(value: unknown): "left" | "right" | "center" | undefined {
  return value === "left" || value === "right" || value === "center"
    ? value
    : undefined;
}

function mapTextEntries(
  textEntries: Record<string, string> | undefined
): ScriptEditorTextEntryRecord[] {
  return Object.entries(textEntries ?? {}).map(([id, text]) => ({
    id,
    text,
  }));
}

function mapImportedSettlements(
  rawPack: Record<string, unknown>
): ScriptEditorProjectDefinition["settlements"] {
  const settlements = rawPack.settlements;
  if (!Array.isArray(settlements)) {
    return [];
  }
  const metadataContext = createImportedSettlementMetadataContext(rawPack);

  return settlements.map((value, index) => {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Imported settlements[${index}] must be an object.`);
    }

    const settlement = value as Record<string, unknown>;
    const id = readString(settlement.id) || `settlement.imported.${index + 1}`;
    if (Object.hasOwn(settlement, "results")) {
      throw new Error(
        `Imported settlements[${index}] uses retired results routing and is not supported.`
      );
    }
    const nextEventId = readString(settlement.nextEventId);
    const contents = Array.isArray(settlement.contents)
      ? settlement.contents.map((content, contentIndex) =>
          mapImportedSettlementContent(
            content,
            index,
            contentIndex,
            metadataContext
          )
        )
      : [];

    return {
      id,
      title: readString(settlement.title) || id,
      ...(nextEventId.length === 0 ? {} : { nextEventId }),
      ...(contents.length === 0 ? {} : { contents }),
    };
  });
}

function mapImportedSettlementContent(
  value: unknown,
  settlementIndex: number,
  contentIndex: number,
  metadataContext: ImportedSettlementMetadataContext
): NonNullable<ScriptEditorProjectDefinition["settlements"][number]["contents"]>[number] {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}] must be an object.`
    );
  }

  const content = value as Record<string, unknown>;
  const targetFamily = readString(content.targetFamily);
  const attributeType = readString(content.attributeType);
  const operation = readString(content.operation);
  const targetId = readString(content.targetId);
  const attributeKey = readString(content.attributeKey);
  if (
    targetFamily !== "person" &&
    targetFamily !== "city" &&
    targetFamily !== "building"
  ) {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}].targetFamily must be person, city, or building.`
    );
  }
  if (
    attributeType !== "number" &&
    attributeType !== "boolean" &&
    attributeType !== "enum"
  ) {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}].attributeType must be number, boolean, or enum.`
    );
  }
  if (operation !== "add" && operation !== "subtract" && operation !== "set") {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}].operation must be add, subtract, or set.`
    );
  }
  if ((attributeType === "boolean" || attributeType === "enum") && operation !== "set") {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}] attribute type requires operation set.`
    );
  }
  if (targetId.length === 0) {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}].targetId must be non-empty.`
    );
  }
  if (attributeKey.length === 0) {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}].attributeKey must be non-empty.`
    );
  }

  const metadata = resolveImportedSettlementAttributeMetadata(
    metadataContext,
    targetFamily,
    targetId,
    attributeKey,
    attributeType,
    content.value,
    settlementIndex,
    contentIndex
  );
  if (metadata.attributeType !== attributeType) {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}].attributeType does not match eligible attributeKey type.`
    );
  }

  return {
    targetFamily,
    targetId,
    attributeKey,
    attributeType,
    operation,
    value: normalizeImportedSettlementValue(
      content.value,
      metadata,
      settlementIndex,
      contentIndex
    ),
  };
}

function normalizeImportedSettlementValue(
  value: unknown,
  metadata: SettlementAttributeMetadata,
  settlementIndex: number,
  contentIndex: number
): string | number | boolean {
  if (metadata.attributeType === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(
        `Imported settlements[${settlementIndex}].contents[${contentIndex}].value must be a finite number.`
      );
    }
    return value;
  }
  if (metadata.attributeType === "boolean") {
    if (typeof value !== "boolean") {
      throw new Error(
        `Imported settlements[${settlementIndex}].contents[${contentIndex}].value must be a boolean value type.`
      );
    }
    return value;
  }
  const enumValue = readString(value);
  if (enumValue.length === 0) {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}].value must be a non-empty enum option.`
    );
  }
  if ((metadata.options?.length ?? 0) > 0 && !metadata.options?.includes(enumValue)) {
    throw new Error(
      `Imported settlements[${settlementIndex}].contents[${contentIndex}].value must be one of the enum options.`
    );
  }
  return enumValue;
}

type ImportedSettlementMetadataContext = {
  peopleById: Record<string, Record<string, unknown>>;
  citiesById: Record<string, Record<string, unknown>>;
  buildingsById: Record<string, Record<string, unknown>>;
};

function createImportedSettlementMetadataContext(
  rawPack: Record<string, unknown>
): ImportedSettlementMetadataContext {
  return {
    peopleById: indexImportedRecords(rawPack.characters),
    citiesById: indexImportedRecords(rawPack.cities),
    buildingsById: indexImportedRecords(rawPack.houses),
  };
}

function indexImportedRecords(value: unknown): Record<string, Record<string, unknown>> {
  if (!Array.isArray(value)) {
    return {};
  }
  const recordsById: Record<string, Record<string, unknown>> = {};
  for (const record of value) {
    if (record == null || typeof record !== "object" || Array.isArray(record)) {
      continue;
    }
    const id = readString((record as Record<string, unknown>).id);
    if (id.length > 0) {
      recordsById[id] = record as Record<string, unknown>;
    }
  }
  return recordsById;
}

function resolveImportedSettlementAttributeMetadata(
  context: ImportedSettlementMetadataContext,
  targetFamily: ScriptEditorSettlementContentRecord["targetFamily"],
  targetId: string,
  attributeKey: string,
  declaredAttributeType: ScriptEditorSettlementContentRecord["attributeType"],
  value: unknown,
  settlementIndex: number,
  contentIndex: number
): SettlementAttributeMetadata {
  if (targetFamily === "person") {
    const person = context.peopleById[targetId];
    if (person == null) {
      throw new Error(
        `Imported settlements[${settlementIndex}].contents[${contentIndex}].targetId references missing person target.`
      );
    }
    const metadata =
      PERSON_SETTLEMENT_BASE_ATTRIBUTES[attributeKey] ??
      resolveImportedTypedAttributeMetadata(person.extendedAttributes, attributeKey) ??
      resolveImportedCustomPropertyMetadata(person.customProperties, attributeKey) ??
      inferImportedSettlementValueMetadata(declaredAttributeType, value);
    if (metadata != null) {
      return metadata;
    }
  } else if (targetFamily === "city") {
    if (context.citiesById[targetId] == null) {
      throw new Error(
        `Imported settlements[${settlementIndex}].contents[${contentIndex}].targetId references missing city target.`
      );
    }
    const metadata = CITY_SETTLEMENT_BASE_ATTRIBUTES[attributeKey];
    if (metadata != null) {
      return metadata;
    }
  } else {
    if (context.buildingsById[targetId] == null) {
      throw new Error(
        `Imported settlements[${settlementIndex}].contents[${contentIndex}].targetId references missing building target.`
      );
    }
    const metadata = BUILDING_SETTLEMENT_BASE_ATTRIBUTES[attributeKey];
    if (metadata != null) {
      return metadata;
    }
  }

  throw new Error(
    `Imported settlements[${settlementIndex}].contents[${contentIndex}].attributeKey must be an eligible calculable settlement attribute.`
  );
}

function resolveImportedTypedAttributeMetadata(
  value: unknown,
  attributeKey: string
): SettlementAttributeMetadata | null {
  if (!Array.isArray(value)) {
    return null;
  }
  const attribute = value.find(
    (entry): entry is ScriptEditorTypedAttributeRecord =>
      entry != null &&
      typeof entry === "object" &&
      !Array.isArray(entry) &&
      readString((entry as Record<string, unknown>).key) === attributeKey
  );
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

function resolveImportedCustomPropertyMetadata(
  value: unknown,
  attributeKey: string
): SettlementAttributeMetadata | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const currentValue = (value as Record<string, unknown>)[attributeKey];
  if (typeof currentValue === "number") {
    return { attributeType: "number" };
  }
  if (typeof currentValue === "boolean") {
    return { attributeType: "boolean" };
  }
  if (typeof currentValue === "string") {
    return { attributeType: "enum" };
  }
  return null;
}

function inferImportedSettlementValueMetadata(
  declaredAttributeType: ScriptEditorSettlementContentRecord["attributeType"],
  value: unknown
): SettlementAttributeMetadata | null {
  if (
    declaredAttributeType === "number" &&
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return { attributeType: "number" };
  }
  if (declaredAttributeType === "boolean" && typeof value === "boolean") {
    return { attributeType: "boolean" };
  }
  if (
    declaredAttributeType === "enum" &&
    typeof value === "string" &&
    value.trim().length > 0
  ) {
    return { attributeType: "enum" };
  }
  return null;
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
      title?: string;
      description?: string;
    };
    if (
      typeof integration.integrationId !== "string" ||
      typeof integration.playableId !== "string"
    ) {
      return [];
    }

    const trigger = integration.trigger;
    const defaultRecord = createDefaultScriptEditorMinigameRecord(
      typeof integration.editorRecordId === "string" &&
        integration.editorRecordId.length > 0
        ? integration.editorRecordId
        : `minigame.imported.${index + 1}`
    );

    return [
      {
        ...defaultRecord,
        title:
          typeof integration.title === "string" && integration.title.trim().length > 0
            ? integration.title.trim()
            : integration.integrationId,
        description:
          typeof integration.description === "string"
            ? integration.description.trim()
            : "",
        playableId: integration.playableId,
        integrationId: integration.integrationId,
        ...(integration.ownerDefaults?.ownerKind != null ||
        integration.trigger?.ownerKind != null
          ? {
              ownerKind:
                integration.ownerDefaults?.ownerKind ??
                integration.trigger?.ownerKind,
            }
          : {}),
        ...(typeof integration.ownerDefaults?.ownerId === "string"
          ? { ownerId: integration.ownerDefaults.ownerId }
          : {}),
        ...(typeof integration.ownerDefaults?.returnPolicy === "string"
          ? { returnPolicy: integration.ownerDefaults.returnPolicy }
          : {}),
        ...(typeof integration.trigger?.triggerId === "string"
          ? { triggerId: integration.trigger.triggerId }
          : {}),
        triggerSource: "event-destination",
        ...(typeof integration.trigger?.trigger === "string"
          ? { triggerEvent: integration.trigger.trigger }
          : {}),
        configEntries: mapImportedLaunchPayload(trigger?.launchPayload),
        settlementRoutes: mapImportedSettlementRoutes(integration.outcomeConfig),
        notes: "Imported from runtime playable integration.",
      },
    ];
  });
}

function mapImportedLaunchPayload(
  launchPayload: Record<string, unknown> | undefined
): NonNullable<ScriptEditorProjectDefinition["minigames"][number]["configEntries"]> {
  return Object.entries(launchPayload ?? {}).map(([key, value]) => ({
    id: key,
    label: key,
    valueType: normalizeImportedConfigValueType(value),
    value: normalizeImportedConfigValue(value),
  }));
}

function mapImportedSettlementRoutes(
  outcomeConfig: PlayableIntegrationDefinition["outcomeConfig"] | undefined
): NonNullable<ScriptEditorProjectDefinition["minigames"][number]["settlementRoutes"]> {
  return (outcomeConfig?.settlementRoutes ?? []).map((route, index) => ({
    id:
      typeof route.id === "string" && route.id.length > 0
        ? route.id
        : `settlement-route.${index + 1}`,
    title:
      typeof route.title === "string" && route.title.length > 0
        ? route.title
        : `结算路由 ${index + 1}`,
    enabled: route.enabled !== false,
    targetEventId:
      typeof route.targetEventId === "string" ? route.targetEventId : "",
    conditions: {
      ...(Array.isArray(route.conditions?.outcomeIn)
        ? {
            outcomeIn: route.conditions.outcomeIn.filter(
              (value) =>
                value === "success" || value === "failure" || value === "cancelled"
            ),
          }
        : {}),
      ...(typeof route.conditions?.scoreMin === "number"
        ? { scoreMin: route.conditions.scoreMin }
        : {}),
      ...(typeof route.conditions?.scoreMax === "number"
        ? { scoreMax: route.conditions.scoreMax }
        : {}),
      ...(Array.isArray(route.conditions?.metricRules)
        ? {
            metricRules: route.conditions.metricRules.flatMap((metricRule) => {
              const metricKey =
                typeof metricRule.metricKey === "string"
                  ? metricRule.metricKey.trim()
                  : "";
              if (metricKey.length === 0) {
                return [];
              }
              if (
                metricRule.operator !== ">" &&
                metricRule.operator !== ">=" &&
                metricRule.operator !== "<" &&
                metricRule.operator !== "<=" &&
                metricRule.operator !== "="
              ) {
                return [];
              }
              return [
                {
                  metricKey,
                  operator: metricRule.operator,
                  value: normalizeImportedMetricRuleValue(metricRule.value),
                },
              ];
            }),
          }
        : {}),
    },
  }));
}

function createImportedMinigameIdByIntegrationId(
  importedMinigames: ScriptEditorProjectDefinition["minigames"]
): Map<string, string> {
  return new Map(
    importedMinigames.flatMap((minigame) => {
      const minigameId = typeof minigame.id === "string" ? minigame.id : "";
      const integrationId =
        typeof minigame.integrationId === "string" &&
        minigame.integrationId.trim().length > 0
          ? minigame.integrationId.trim()
          : minigameId.length > 0 &&
              typeof minigame.playableId === "string" &&
              minigame.playableId.trim().length > 0
            ? createDerivedMinigameIntegrationId(minigameId, minigame.playableId)
            : "";
      return integrationId.length > 0 ? [[integrationId, minigameId] as const] : [];
    })
  );
}

function normalizeImportedConfigValueType(
  value: unknown
): "number" | "text" | "boolean" {
  if (typeof value === "number") {
    return "number";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  return "text";
}

function normalizeImportedConfigValue(
  value: unknown
): string | number | boolean | null {
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (value == null) {
    return null;
  }
  return typeof value === "string" ? value : JSON.stringify(value);
}

function normalizeImportedMetricRuleValue(
  value: unknown
): string | number | boolean {
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return typeof value === "string" ? value : JSON.stringify(value);
}

function createDerivedMinigameIntegrationId(
  minigameId: string,
  playableId: string
): string {
  return `playable.${playableId}.instance.${minigameId}`;
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

function readFlowPlayablesFamily(
  rawPack: Record<string, unknown>
): ScriptEditorProjectDefinition["flows"] {
  if (rawPack.flowDefinitions != null) {
    throw new Error(
      'Imported runtime pack still uses retired family "flowDefinitions"; use "playableShells" instead.'
    );
  }

  const value = rawPack.playableShells;
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((flow, index) => mapImportedFlowPlayable(flow, index));
}

function mapImportedFlowPlayable(
  value: unknown,
  index: number
): ScriptEditorProjectDefinition["flows"][number] {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Imported playableShells[${index}] must be an object.`);
  }

  const flow = value as Record<string, unknown>;
  for (const retiredField of [
    "playableId",
    "integrationId",
    "ownerKind",
    "ownerId",
    "returnPolicy",
    "triggerId",
    "triggerSource",
    "triggerEvent",
    "eventStartTarget",
    "launchPayload",
  ]) {
    if (Object.hasOwn(flow, retiredField)) {
      throw new Error(
        `Imported playableShells[${index}] still carries retired routing field "${retiredField}".`
      );
    }
  }

  return {
    id: readString(flow.id) || `flow.imported.${index + 1}`,
    title: readString(flow.title) || readString(flow.id) || `flow.imported.${index + 1}`,
    description: readString(flow.description),
    initialNodeId: readString(flow.initialNodeId) || "node.start",
    nodes: Array.isArray(flow.nodes)
      ? (cloneJsonCompatibleValue(flow.nodes) as ScriptEditorProjectDefinition["flows"][number]["nodes"])
      : [],
    outcomeRoutes: Array.isArray(flow.outcomeRoutes)
      ? (cloneJsonCompatibleValue(
          flow.outcomeRoutes
        ) as ScriptEditorProjectDefinition["flows"][number]["outcomeRoutes"])
      : [],
    notes: readString(flow.notes),
  };
}

function readBuildingArrangementsFamily(
  rawPack: Record<string, unknown>
): ScriptEditorBuildingArrangementRecord[] {
  return readArrayFamily(
    rawPack,
    "buildingArrangements"
  ) as ScriptEditorBuildingArrangementRecord[];
}

function readProgressTrackFamily(
  rawPack: Record<string, unknown>
): NonNullable<ScriptEditorProjectDefinition["progressTracks"]> {
  return readArrayFamily(
    rawPack,
    "progressTracks"
  ) as NonNullable<ScriptEditorProjectDefinition["progressTracks"]>;
}

function readProgressTrackBindingFamily(
  rawPack: Record<string, unknown>
): NonNullable<ScriptEditorProjectDefinition["progressTrackBindings"]> {
  return readArrayFamily(
    rawPack,
    "progressTrackBindings"
  ) as NonNullable<ScriptEditorProjectDefinition["progressTrackBindings"]>;
}

function readMenuResourceFamily(
  rawPack: Record<string, unknown>
): ScriptEditorProjectDefinition["menuResources"] {
  return readArrayFamily(
    rawPack,
    "menuResources"
  ) as ScriptEditorProjectDefinition["menuResources"];
}

function readMenuInstanceFamily(
  rawPack: Record<string, unknown>
): ScriptEditorProjectDefinition["menuInstances"] {
  return readArrayFamily(
    rawPack,
    "menuInstances"
  ) as ScriptEditorProjectDefinition["menuInstances"];
}

function readPortraitFamily(
  rawPack: Record<string, unknown>
): ScriptEditorProjectDefinition["portraits"] {
  return readArrayFamily(
    rawPack,
    "portraits"
  ) as ScriptEditorProjectDefinition["portraits"];
}

function readPortraitVariantFamily(
  rawPack: Record<string, unknown>
): ScriptEditorProjectDefinition["portraitVariants"] {
  return readArrayFamily(
    rawPack,
    "portraitVariants"
  ) as ScriptEditorProjectDefinition["portraitVariants"];
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
      (definition.purpose ?? "enter") === "enter" &&
      definition.targetFamily === targetFamily &&
      definition.targetId === record.id
  );
  const leaveAccessDefinition = locationAccessDefinitions.find(
    (definition) =>
      definition.purpose === "leave" &&
      definition.targetFamily === targetFamily &&
      definition.targetId === record.id
  );
  if (accessDefinition == null && leaveAccessDefinition == null) {
    return record;
  }

  return {
    ...record,
    access: {
      ...(accessDefinition == null
        ? {}
        : {
            conditionExpression: accessDefinition.conditionExpression,
            ...(accessDefinition.blockedReason == null
              ? {}
              : { blockedReason: accessDefinition.blockedReason }),
            ...(accessDefinition.blockedTitle == null
              ? {}
              : { blockedTitle: accessDefinition.blockedTitle }),
            ...(accessDefinition.blockedMessage == null
              ? {}
              : { blockedMessage: accessDefinition.blockedMessage }),
            ...(accessDefinition.blockedSpeakerId == null
              ? {}
              : { blockedSpeakerId: accessDefinition.blockedSpeakerId }),
            ...(accessDefinition.guidance == null
              ? {}
              : { guidance: accessDefinition.guidance }),
          }),
      ...(leaveAccessDefinition == null
        ? {}
        : {
            leaveConditionExpression: leaveAccessDefinition.conditionExpression,
          }),
    },
  };
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
    ...(manifest.audioSettings == null
      ? {}
      : {
          audioSettings: {
            muted: manifest.audioSettings.muted === true,
          },
        }),
    ...(manifest.basePackId == null ? {} : { basePackId: manifest.basePackId }),
    ...(manifest.author == null ? {} : { author: manifest.author }),
    ...(manifest.version == null ? {} : { version: manifest.version }),
    ...(manifest.tags == null ? {} : { tags: [...manifest.tags] }),
    ...(manifest.personAttributeSemantics == null
      ? {}
      : {
          personAttributeSemantics: cloneJsonCompatibleValue(
            manifest.personAttributeSemantics
          ) as ScriptEditorPersonSemanticBinding[],
        }),
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
    typeof files.dialogues === "string"
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

function cloneJsonCompatibleValue(value: unknown): unknown {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function formatDiagnostics(
  diagnostics: ScriptEditorRuntimePackImportDiagnostic[]
): string {
  return [
    "Script editor runtime-pack import validation failed.",
    ...diagnostics.map(
      (diagnostic) => `- ${diagnostic.fieldPath}: ${diagnostic.message}`
    ),
  ].join("\n");
}
