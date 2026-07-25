import {
  resolveContentPackMapAssetUrls,
  resolveContentPackPortraitAssetUrls,
} from "../content/content-pack-loader";
import { assertHouseModuleDefaults } from "../content/house-module-defaults";
import { GAME_VIEW_NAMES } from "../../domain/game-state";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";

type SettlementAttributeMetadata = {
  attributeType: "number" | "boolean" | "enum";
  options?: readonly string[];
};

const PERSON_SETTLEMENT_BASE_ATTRIBUTES: Record<string, SettlementAttributeMetadata> = {
  age: { attributeType: "number" },
  stamina: { attributeType: "number" },
  "stats.leadership": { attributeType: "number" },
  "stats.martial": { attributeType: "number" },
  "stats.intelligence": { attributeType: "number" },
  "stats.politics": { attributeType: "number" },
  "stats.charm": { attributeType: "number" },
  "stats.fame": { attributeType: "number" },
  "stats.gold": { attributeType: "number" },
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

export async function loadScenarioPackFromUrl(
  url: string
): Promise<ScenarioPackDefinition> {
  const resolvedManifestUrl = resolveScenarioPackManifestUrl(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load scenario pack: ${response.status}`);
  }

  const rawPack = await response.json();
  if (isScenarioPackManifest(rawPack)) {
    return parseScenarioPack(
      await hydrateScenarioPackManifest(rawPack, resolvedManifestUrl)
    );
  }

  return parseScenarioPack(rawPack);
}

export async function loadScenarioPackFromFiles(
  files: readonly File[]
): Promise<ScenarioPackDefinition> {
  if (files.length === 0) {
    throw new Error("Scenario pack import must include at least one file.");
  }

  const indexedFiles = indexScenarioPackImportFiles(files);
  const manifestFileEntry = selectScenarioPackManifestFileEntry(indexedFiles);

  if (manifestFileEntry == null) {
    const scriptEditorProjectManifestEntry =
      selectScriptEditorProjectManifestFileEntry(indexedFiles);
    if (scriptEditorProjectManifestEntry != null) {
      const rawProjectManifest = JSON.parse(
        await scriptEditorProjectManifestEntry.file.text()
      );
      if (
        typeof rawProjectManifest === "object" &&
        rawProjectManifest != null &&
        (rawProjectManifest as { kind?: unknown }).kind === "script-editor-project"
      ) {
        throw new Error(
          "导入的是 Script Editor 项目包（project.json kind=script-editor-project），不是 JSON 开局需要的运行时剧本包。请在剧本编辑器中打开项目，或先导出运行时剧本包再用于 JSON 开局；JSON 开局目录必须包含 pack.json。"
        );
      }
    }

    if (files.length === 1) {
      const [singleFile] = files;
      if (singleFile == null) {
        throw new Error("Scenario pack import must include at least one file.");
      }
      return parseScenarioPackText(await singleFile.text());
    }

    throw new Error("Imported scenario pack is missing pack.json.");
  }

  const rawPack = JSON.parse(await manifestFileEntry.file.text());
  if (isScenarioPackManifest(rawPack)) {
    return parseScenarioPack(
      await hydrateScenarioPackManifestFromFiles(
        rawPack,
        manifestFileEntry.relativePath,
        indexedFiles
      )
    );
  }

  return parseScenarioPack(rawPack);
}

export function parseScenarioPackText(text: string): ScenarioPackDefinition {
  return parseScenarioPack(JSON.parse(text));
}

export function parseScenarioPack(value: unknown): ScenarioPackDefinition {
  assertObject(value, "scenario pack");
  if (value.schemaVersion !== 1) {
    throw new Error("Scenario pack schemaVersion must be 1.");
  }
  assertString(value.id, "scenario pack id");
  assertString(value.title, "scenario pack title");
  assertObject(value.scenarioProfile, "scenario profile");
  assertString(value.scenarioProfile.id, "scenario profile id");
  assertString(value.scenarioProfile.playerCharacterId, "scenario playerCharacterId");
  assertString(value.scenarioProfile.chapterId, "scenario chapterId");
  assertObject(value.scenarioProfile.initialLocation, "scenario initialLocation");
  assertString(value.scenarioProfile.initialLocation.mapId, "scenario initialLocation.mapId");
  assertString(value.scenarioProfile.initialLocation.cityId, "scenario initialLocation.cityId");
  if (
    value.scenarioProfile.initialLocation.houseId !== null &&
    typeof value.scenarioProfile.initialLocation.houseId !== "string"
  ) {
    throw new Error("scenario initialLocation.houseId must be string or null.");
  }
  if (
    value.scenarioProfile.initialLocation.dialogueId !== undefined &&
    value.scenarioProfile.initialLocation.dialogueId !== null &&
    typeof value.scenarioProfile.initialLocation.dialogueId !== "string"
  ) {
    throw new Error("scenario initialLocation.dialogueId must be string or null.");
  }
  assertEnum(
    value.scenarioProfile.initialLocation.view,
    "scenario initialLocation.view",
    GAME_VIEW_NAMES
  );
  if (value.scenarioProfile.launchPolicy != null) {
    assertObject(value.scenarioProfile.launchPolicy, "scenario launchPolicy");
    assertOptionalEnum(
      value.scenarioProfile.launchPolicy.characterSelection,
      "scenario launchPolicy.characterSelection",
      ["shell", "fixed"]
    );
    assertOptionalEnum(
      value.scenarioProfile.launchPolicy.initialView,
      "scenario launchPolicy.initialView",
      GAME_VIEW_NAMES
    );
    assertOptionalEnum(
      value.scenarioProfile.launchPolicy.entryEventTiming,
      "scenario launchPolicy.entryEventTiming",
      ["immediate", "after-map-entry"]
    );
  }
  if (value.scenarioProfile.characterStartups != null) {
    assertArray(
      value.scenarioProfile.characterStartups,
      "scenario characterStartups"
    );
    for (const [index, record] of value.scenarioProfile.characterStartups.entries()) {
      assertObject(record, `scenario characterStartups[${index}]`);
      assertString(
        record.characterId,
        `scenario characterStartups[${index}].characterId`
      );
      if (record.initialLocation != null) {
        assertObject(
          record.initialLocation,
          `scenario characterStartups[${index}].initialLocation`
        );
        assertOptionalString(
          record.initialLocation.mapId,
          `scenario characterStartups[${index}].initialLocation.mapId`
        );
        assertOptionalString(
          record.initialLocation.cityId,
          `scenario characterStartups[${index}].initialLocation.cityId`
        );
        if (
          record.initialLocation.houseId !== undefined &&
          record.initialLocation.houseId !== null &&
          typeof record.initialLocation.houseId !== "string"
        ) {
          throw new Error(
            `scenario characterStartups[${index}].initialLocation.houseId must be string or null.`
          );
        }
        if (
          record.initialLocation.dialogueId !== undefined &&
          record.initialLocation.dialogueId !== null &&
          typeof record.initialLocation.dialogueId !== "string"
        ) {
          throw new Error(
            `scenario characterStartups[${index}].initialLocation.dialogueId must be string or null.`
          );
        }
        assertOptionalEnum(
          record.initialLocation.view,
          `scenario characterStartups[${index}].initialLocation.view`,
          GAME_VIEW_NAMES
        );
      }
      if (record.initialUi != null) {
        assertObject(
          record.initialUi,
          `scenario characterStartups[${index}].initialUi`
        );
        assertOptionalString(
          record.initialUi.reviewDateText,
          `scenario characterStartups[${index}].initialUi.reviewDateText`
        );
        assertOptionalString(
          record.initialUi.mainHouseMissionText,
          `scenario characterStartups[${index}].initialUi.mainHouseMissionText`
        );
      }
      if (record.initialRuntime != null) {
        assertObject(
          record.initialRuntime,
          `scenario characterStartups[${index}].initialRuntime`
        );
      }
      if (record.launchPolicy != null) {
        assertObject(
          record.launchPolicy,
          `scenario characterStartups[${index}].launchPolicy`
        );
        assertOptionalEnum(
          record.launchPolicy.initialView,
          `scenario characterStartups[${index}].launchPolicy.initialView`,
          GAME_VIEW_NAMES
        );
        assertOptionalEnum(
          record.launchPolicy.entryEventTiming,
          `scenario characterStartups[${index}].launchPolicy.entryEventTiming`,
          ["immediate", "after-map-entry"]
        );
      }
      if (
        record.entryEventId !== undefined &&
        record.entryEventId !== null &&
        typeof record.entryEventId !== "string"
      ) {
        throw new Error(
          `scenario characterStartups[${index}].entryEventId must be string or null.`
        );
      }
      if (
        record.openingFlowId !== undefined &&
        record.openingFlowId !== null &&
        typeof record.openingFlowId !== "string"
      ) {
        throw new Error(
          `scenario characterStartups[${index}].openingFlowId must be string or null.`
        );
      }
    }
  }
  assertArray(value.characters, "scenario characters");
  if (value.cities != null) {
    assertArray(value.cities, "scenario cities");
  }
  if (value.houses != null) {
    assertArray(value.houses, "scenario houses");
  }
  if (value.buildingArrangements != null) {
    assertArray(value.buildingArrangements, "scenario building arrangements");
  }
  if (value.maps != null) {
    assertArray(value.maps, "scenario maps");
  }
  if (value.cityEntries != null) {
    assertArray(value.cityEntries, "scenario city entries");
  }
  const rawSettlements = (value as Record<string, unknown>).settlements;
  if (rawSettlements != null) {
    assertRuntimeSettlementDefinitions(rawSettlements, value as Record<string, unknown>);
  }
  const rawProgressTracks = (value as Record<string, unknown>).progressTracks;
  if (rawProgressTracks != null) {
    assertRuntimeProgressTrackDefinitions(rawProgressTracks, rawSettlements);
  }
  const rawProgressTrackBindings = (value as Record<string, unknown>)
    .progressTrackBindings;
  if (rawProgressTrackBindings != null) {
    assertArray(rawProgressTrackBindings, "scenario progressTrackBindings");
  }
  assertArray(value.events, "scenario events");
  assertRuntimeEventsDoNotUseRetiredTriggerFields(value.events);
  assertRuntimeEventsPreserveCanonicalRoutingContracts(
    value.events,
    isRecord(rawSettlements) ||
      Array.isArray(rawSettlements)
      ? rawSettlements
      : undefined
  );
  if (value.eventBindings != null) {
    assertArray(value.eventBindings, "scenario eventBindings");
  }
  assertArray(value.dialogues, "scenario dialogues");
  assertRuntimeDialoguesDoNotUseRetiredActions(value.dialogues);
  if (value.tasks != null) {
    assertArray(value.tasks, "scenario tasks");
  }
  if (value.playables != null) {
    assertArray(value.playables, "scenario playables");
  }
  if (value.playableIntegrations != null) {
    assertArray(value.playableIntegrations, "scenario playable integrations");
    assertPlayableIntegrationsDoNotUseRetiredSceneOwnerKind(
      value.playableIntegrations
    );
  }
  if (value.flowDefinitions != null) {
    throw new Error(
      'scenario flowDefinitions is retired; use flowPlayables as the content-only flow family.'
    );
  }
  if (value.flowPlayables != null) {
    assertArray(value.flowPlayables, "scenario flow playables");
    assertFlowPlayablesDoNotUseRetiredSceneOwnerKind(value.flowPlayables);
  }

  if (value.activities != null) {
    assertArray(value.activities, "scenario activities");
  }
  if (value.cards != null) {
    assertArray(value.cards, "scenario cards");
  }
  if (value.valuables != null) {
    assertArray(value.valuables, "scenario valuables");
  }
  if (value.cityNpcPools != null) {
    assertArray(value.cityNpcPools, "scenario city npc pools");
  }
  if (value.locationAccess != null) {
    assertArray(value.locationAccess, "scenario location access");
  }
  if (value.houseModuleDefaults != null) {
    assertHouseModuleDefaults(
      value.houseModuleDefaults,
      "scenario houseModuleDefaults"
    );
  }
  if (value.historicalCharacters != null) {
    assertArray(value.historicalCharacters, "scenario historical characters");
  }
  if (value.historicalCityRosters != null) {
    assertArray(value.historicalCityRosters, "scenario historical city rosters");
  }
  if (value.cityPortraits != null) {
    assertObject(value.cityPortraits, "scenario city portraits");
  }
  if (value.portraits != null) {
    assertArray(value.portraits, "scenario portraits");
  }
  if (value.portraitVariants != null) {
    assertArray(value.portraitVariants, "scenario portrait variants");
  }
  if (value.textEntries != null) {
    assertObject(value.textEntries, "scenario text entries");
  }
  if (value.historicalCharacterIdByCharacterId != null) {
    assertObject(
      value.historicalCharacterIdByCharacterId,
      "scenario historical character mapping"
    );
  }

  const runtimeDialogues = Array.isArray(value.dialogues)
    ? (value.dialogues as NonNullable<ScenarioPackDefinition["dialogues"]>)
    : [];

  return {
    ...(value as ScenarioPackDefinition),
    dialogues: runtimeDialogues,
  };
}

function assertRuntimeEventsDoNotUseRetiredTriggerFields(events: unknown[]): void {
  events.forEach((eventDefinition, index) => {
    assertObject(eventDefinition, `scenario events[${index}]`);
    if (
      Object.hasOwn(eventDefinition, "trigger") ||
      Object.hasOwn(eventDefinition, "conditions")
    ) {
      throw new Error(
        `scenario events[${index}] event body trigger/conditions are retired; use event-bindings.json for runtime trigger configuration.`
      );
    }
  });
}

function assertRuntimeSettlementDefinitions(
  settlements: unknown,
  pack: Record<string, unknown>
): void {
  assertArray(settlements, "scenario settlements");
  const metadataContext = createRuntimeSettlementMetadataContext(pack);
  settlements.forEach((settlementDefinition, settlementIndex) => {
    assertObject(
      settlementDefinition,
      `scenario settlements[${settlementIndex}]`
    );
    if (Object.hasOwn(settlementDefinition, "results")) {
      assertLegacySettlementResultsRouteUnambiguously(
        settlementDefinition.results,
        settlementIndex,
        typeof settlementDefinition.nextEventId === "string"
          ? settlementDefinition.nextEventId.trim()
          : ""
      );
    }
    if (settlementDefinition.contents != null) {
      assertArray(
        settlementDefinition.contents,
        `scenario settlements[${settlementIndex}].contents`
      );
      settlementDefinition.contents.forEach((contentDefinition, contentIndex) => {
        assertObject(
          contentDefinition,
          `scenario settlements[${settlementIndex}].contents[${contentIndex}]`
        );
        assertEnum(
          contentDefinition.targetFamily,
          `scenario settlements[${settlementIndex}].contents[${contentIndex}].targetFamily`,
          ["person", "city", "building"]
        );
        assertEnum(
          contentDefinition.attributeType,
          `scenario settlements[${settlementIndex}].contents[${contentIndex}].attributeType`,
          ["number", "boolean", "enum"]
        );
        assertEnum(
          contentDefinition.operation,
          `scenario settlements[${settlementIndex}].contents[${contentIndex}].operation`,
          ["add", "subtract", "set"]
        );
        if (
          (contentDefinition.attributeType === "boolean" ||
            contentDefinition.attributeType === "enum") &&
          contentDefinition.operation !== "set"
        ) {
          throw new Error(
            `scenario settlements[${settlementIndex}].contents[${contentIndex}] attribute type requires operation set.`
          );
        }
        assertRuntimeSettlementContentTargetAndValue(
          contentDefinition,
          settlementIndex,
          contentIndex,
          metadataContext
        );
      });
    }
  });
}

type RuntimeSettlementMetadataContext = {
  peopleById: Record<string, Record<string, unknown>>;
  citiesById: Record<string, Record<string, unknown>>;
  buildingsById: Record<string, Record<string, unknown>>;
};

function createRuntimeSettlementMetadataContext(
  pack: Record<string, unknown>
): RuntimeSettlementMetadataContext {
  return {
    peopleById: indexRuntimeSettlementRecords(pack.characters),
    citiesById: indexRuntimeSettlementRecords(pack.cities),
    buildingsById: indexRuntimeSettlementRecords(pack.houses),
  };
}

function indexRuntimeSettlementRecords(
  value: unknown
): Record<string, Record<string, unknown>> {
  if (!Array.isArray(value)) {
    return {};
  }
  const recordsById: Record<string, Record<string, unknown>> = {};
  for (const record of value) {
    if (record == null || typeof record !== "object" || Array.isArray(record)) {
      continue;
    }
    const id =
      typeof (record as Record<string, unknown>).id === "string"
        ? ((record as Record<string, unknown>).id as string).trim()
        : "";
    if (id.length > 0) {
      recordsById[id] = record as Record<string, unknown>;
    }
  }
  return recordsById;
}

function assertRuntimeSettlementContentTargetAndValue(
  contentDefinition: Record<string, unknown>,
  settlementIndex: number,
  contentIndex: number,
  context: RuntimeSettlementMetadataContext
): void {
  const fieldPath = `scenario settlements[${settlementIndex}].contents[${contentIndex}]`;
  const targetFamily = contentDefinition.targetFamily as "person" | "city" | "building";
  const attributeType = contentDefinition.attributeType as "number" | "boolean" | "enum";
  const targetId =
    typeof contentDefinition.targetId === "string"
      ? contentDefinition.targetId.trim()
      : "";
  const attributeKey =
    typeof contentDefinition.attributeKey === "string"
      ? contentDefinition.attributeKey.trim()
      : "";

  if (targetId.length === 0) {
    throw new Error(`${fieldPath}.targetId must be a non-empty string.`);
  }
  if (attributeKey.length === 0) {
    throw new Error(`${fieldPath}.attributeKey must be a non-empty string.`);
  }

  const metadata = resolveRuntimeSettlementAttributeMetadata(
    targetFamily,
    targetId,
    attributeKey,
    attributeType,
    contentDefinition.value,
    fieldPath,
    context
  );
  if (metadata.attributeType !== attributeType) {
    throw new Error(
      `${fieldPath}.attributeType does not match the eligible settlement attribute.`
    );
  }
  assertRuntimeSettlementContentValue(
    contentDefinition.value,
    metadata,
    fieldPath
  );
}

function resolveRuntimeSettlementAttributeMetadata(
  targetFamily: "person" | "city" | "building",
  targetId: string,
  attributeKey: string,
  declaredAttributeType: "number" | "boolean" | "enum",
  value: unknown,
  fieldPath: string,
  context: RuntimeSettlementMetadataContext
): SettlementAttributeMetadata {
  if (targetFamily === "person") {
    const person = context.peopleById[targetId];
    if (person == null) {
      throw new Error(`${fieldPath}.targetId references missing person target.`);
    }
    const metadata =
      PERSON_SETTLEMENT_BASE_ATTRIBUTES[attributeKey] ??
      resolveRuntimeCharacterCustomPropertyMetadata(person, attributeKey) ??
      inferRuntimeSettlementValueMetadata(
        declaredAttributeType,
        value
      );
    if (metadata != null) {
      return metadata;
    }
  } else if (targetFamily === "city") {
    if (context.citiesById[targetId] == null) {
      throw new Error(`${fieldPath}.targetId references missing city target.`);
    }
    const metadata = CITY_SETTLEMENT_BASE_ATTRIBUTES[attributeKey];
    if (metadata != null) {
      return metadata;
    }
  } else {
    if (context.buildingsById[targetId] == null) {
      throw new Error(`${fieldPath}.targetId references missing building target.`);
    }
    const metadata = BUILDING_SETTLEMENT_BASE_ATTRIBUTES[attributeKey];
    if (metadata != null) {
      return metadata;
    }
  }

  throw new Error(
    `${fieldPath}.attributeKey must be an eligible calculable settlement attribute.`
  );
}

function resolveRuntimeCharacterCustomPropertyMetadata(
  person: Record<string, unknown>,
  attributeKey: string
): SettlementAttributeMetadata | null {
  const customProperties = person.customProperties;
  if (
    customProperties == null ||
    typeof customProperties !== "object" ||
    Array.isArray(customProperties)
  ) {
    return null;
  }
  const value = (customProperties as Record<string, unknown>)[attributeKey];
  if (typeof value === "number") {
    return { attributeType: "number" };
  }
  if (typeof value === "boolean") {
    return { attributeType: "boolean" };
  }
  return null;
}

function inferRuntimeSettlementValueMetadata(
  declaredAttributeType: "number" | "boolean" | "enum",
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

function assertRuntimeSettlementContentValue(
  value: unknown,
  metadata: SettlementAttributeMetadata,
  fieldPath: string
): void {
  if (metadata.attributeType === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error(`${fieldPath}.value must be a finite number.`);
    }
    return;
  }

  if (metadata.attributeType === "boolean") {
    if (typeof value !== "boolean") {
      throw new Error(`${fieldPath}.value must be a boolean value type.`);
    }
    return;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldPath}.value must be a non-empty enum option.`);
  }
  if ((metadata.options?.length ?? 0) > 0 && !metadata.options?.includes(value)) {
    throw new Error(`${fieldPath}.value must be one of the enum options.`);
  }
}

function assertRuntimeProgressTrackDefinitions(
  progressTracks: unknown,
  settlements: unknown
): void {
  assertArray(progressTracks, "scenario progressTracks");
  const settlementIds = new Set<string>();

  if (Array.isArray(settlements)) {
    settlements.forEach((settlementDefinition, index) => {
      assertObject(settlementDefinition, `scenario settlements[${index}]`);
      const settlementId = settlementDefinition.id;
      assertString(settlementId, `scenario settlements[${index}].id`);
      settlementIds.add(settlementId.trim());
    });
  }

  progressTracks.forEach((trackDefinition, trackIndex) => {
    assertObject(trackDefinition, `scenario progressTracks[${trackIndex}]`);
    const trackIdValue =
      typeof trackDefinition.id === "string" && trackDefinition.id.trim().length > 0
        ? trackDefinition.id.trim()
        : `progressTracks[${trackIndex}]`;
    assertArray(
      trackDefinition.tiers,
      `scenario progressTracks[${trackIndex}].tiers`
    );
    trackDefinition.tiers.forEach((tierDefinition, tierIndex) => {
      assertObject(
        tierDefinition,
        `scenario progressTracks[${trackIndex}].tiers[${tierIndex}]`
      );
      const settlementId =
        typeof tierDefinition.targetTierSettlementId === "string"
          ? tierDefinition.targetTierSettlementId.trim()
          : "";
      if (settlementId.length === 0 || settlementIds.size === 0) {
        return;
      }

      if (!settlementIds.has(settlementId)) {
        const tierIdValue =
          typeof tierDefinition.id === "string" && tierDefinition.id.trim().length > 0
            ? tierDefinition.id.trim()
            : `tiers[${tierIndex}]`;
        throw new Error(
          `Progress tier "${trackIdValue}:${tierIdValue}" references missing settlement "${settlementId}" through targetTierSettlementId.`
        );
      }
    });
  });
}

function assertLegacySettlementResultsRouteUnambiguously(
  results: unknown,
  settlementIndex: number,
  settlementNextEventId: string
): void {
  assertArray(results, `scenario settlements[${settlementIndex}].results`);
  const nextEventIds = new Set<string>();
  results.forEach((resultDefinition, resultIndex) => {
    assertObject(
      resultDefinition,
      `scenario settlements[${settlementIndex}].results[${resultIndex}]`
    );
    const nextEventId =
      typeof resultDefinition.nextEventId === "string"
        ? resultDefinition.nextEventId.trim()
        : "";
    nextEventIds.add(nextEventId);
  });

  if (nextEventIds.size > 1) {
    throw new Error(
      "Ambiguous legacy settlement result routing must fail closed."
    );
  }
  const legacyNextEventId = [...nextEventIds][0] ?? "";
  if (
    legacyNextEventId.length > 0 &&
    settlementNextEventId.length > 0 &&
    legacyNextEventId !== settlementNextEventId
  ) {
    throw new Error(
      "Conflicting legacy settlement result routing and settlement nextEventId is ambiguous and must fail closed."
    );
  }
}

function assertRuntimeEventsPreserveCanonicalRoutingContracts(
  events: unknown[],
  settlements: unknown
): void {
  const eventIds = new Set<string>();
  const settlementIds = new Set<string>();

  if (settlements != null) {
    assertArray(settlements, "scenario settlements");
    settlements.forEach((settlementDefinition, index) => {
      assertObject(settlementDefinition, `scenario settlements[${index}]`);
      const settlementId = settlementDefinition.id;
      assertString(settlementId, `scenario settlements[${index}].id`);
      settlementIds.add(settlementId.trim());
    });
  }

  events.forEach((eventDefinition, index) => {
    assertObject(eventDefinition, `scenario events[${index}]`);
    const eventId = eventDefinition.id;
    assertString(eventId, `scenario events[${index}].id`);
    eventIds.add(eventId.trim());
  });

  events.forEach((eventDefinition, index) => {
    assertObject(eventDefinition, `scenario events[${index}]`);
    const eventIdValue = eventDefinition.id;
    assertString(eventIdValue, `scenario events[${index}].id`);
    const eventId = eventIdValue.trim();
    const nextEventId =
      typeof eventDefinition.nextEventId === "string"
        ? eventDefinition.nextEventId.trim()
        : "";
    if (nextEventId.length > 0) {
      if (nextEventId === eventId) {
        throw new Error(
          `Event "${eventId}" cannot reference itself through nextEventId.`
        );
      }
      if (!eventIds.has(nextEventId)) {
        throw new Error(
          `Event "${eventId}" references missing next event "${nextEventId}".`
        );
      }
    }

    const settlementId =
      typeof eventDefinition.settlementId === "string"
        ? eventDefinition.settlementId.trim()
        : "";
    if (eventDefinition.type !== "settlement") {
      return;
    }
    if (settlementId.length === 0) {
      throw new Error(
        `Settlement event "${eventId}" requires a non-empty settlementId.`
      );
    }
    if (settlements != null && !settlementIds.has(settlementId)) {
      throw new Error(
        `Settlement event "${eventId}" references missing settlement "${settlementId}".`
      );
    }
  });
}

function assertRuntimeDialoguesDoNotUseRetiredActions(dialogues: unknown[]): void {
  dialogues.forEach((dialogueDefinition, index) => {
    assertObject(dialogueDefinition, `scenario dialogues[${index}]`);
    if (Object.hasOwn(dialogueDefinition, "actions")) {
      throw new Error(
        `scenario dialogues[${index}] uses retired actions[]; use dialogues[].nodes instead.`
      );
    }
  });
}

function assertPlayableIntegrationsDoNotUseRetiredSceneOwnerKind(
  playableIntegrations: unknown[]
): void {
  playableIntegrations.forEach((integrationDefinition, index) => {
    assertObject(
      integrationDefinition,
      `scenario playableIntegrations[${index}]`
    );
    const ownerDefaults = isRecord(integrationDefinition.ownerDefaults)
      ? integrationDefinition.ownerDefaults
      : null;
    const trigger = isRecord(integrationDefinition.trigger)
      ? integrationDefinition.trigger
      : null;
    if (
      ownerDefaults?.ownerKind === "scene" ||
      trigger?.ownerKind === "scene"
    ) {
      throw new Error(
        `scenario playableIntegrations[${index}] uses retired ownerKind "scene".`
      );
    }
  });
}

function assertFlowPlayablesDoNotUseRetiredSceneOwnerKind(
  flowPlayables: unknown[]
): void {
  flowPlayables.forEach((flowPlayable, index) => {
    assertObject(flowPlayable, `scenario flowPlayables[${index}]`);
    const record = flowPlayable as Record<string, unknown>;
    if (record.ownerKind === "scene") {
      throw new Error(
        `scenario flowPlayables[${index}] uses retired ownerKind "scene".`
      );
    }
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
      if (Object.hasOwn(record, retiredField)) {
        throw new Error(
          `scenario flowPlayables[${index}] uses retired routing field "${retiredField}".`
        );
      }
    }
  });
}

type ScenarioPackManifestFiles = {
  scenarioProfile: string;
  characters: string;
  events: string;
  dialogues: string;
  progressTracks?: string;
  progressTrackBindings?: string;
  tasks?: string;
  playables?: string;
  playableIntegrations?: string;
  flowPlayables?: string;
  cities?: string;
  houses?: string;
  buildingArrangements?: string;
  maps?: string;
  cityEntries?: string;
  settlements?: string;
  textEntries?: string;
  eventBindings?: string;
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
};

type ScenarioPackManifest = {
  schemaVersion: 1;
  kind?: "scenario-pack";
  id: string;
  title: string;
  description?: string;
  files: ScenarioPackManifestFiles;
};

type ScenarioPackImportFileEntry = {
  file: File;
  relativePath: string;
};

function resolveScenarioPackManifestUrl(url: string): string {
  if (/^(https?:|file:)/.test(url)) {
    return url;
  }

  if (url.startsWith("/") && typeof window !== "undefined") {
    return new URL(url, window.location.href).href;
  }

  return url;
}

function indexScenarioPackImportFiles(
  files: readonly File[]
): Record<string, ScenarioPackImportFileEntry> {
  return Object.fromEntries(
    files.map((file) => {
      const relativePath = normalizeScenarioPackImportPath(
        file.webkitRelativePath || file.name
      );
      return [relativePath, { file, relativePath }] as const;
    })
  );
}

function selectScenarioPackManifestFileEntry(
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
): ScenarioPackImportFileEntry | null {
  const manifestEntries = Object.values(indexedFiles).filter((entry) =>
    entry.relativePath.endsWith("/pack.json") || entry.relativePath === "pack.json"
  );

  if (manifestEntries.length === 0) {
    return null;
  }

  if (manifestEntries.length > 1) {
    throw new Error("Imported scenario pack contains multiple pack.json files.");
  }

  return manifestEntries[0] ?? null;
}

function selectScriptEditorProjectManifestFileEntry(
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
): ScenarioPackImportFileEntry | null {
  const projectEntries = Object.values(indexedFiles).filter((entry) =>
    entry.relativePath.endsWith("/project.json") || entry.relativePath === "project.json"
  );

  if (projectEntries.length === 0) {
    return null;
  }

  return projectEntries[0] ?? null;
}

async function hydrateScenarioPackManifest(
  manifest: ScenarioPackManifest,
  manifestUrl: string
): Promise<unknown> {
  const fileEntries = Object.entries(manifest.files);
  const resolvedEntries = await Promise.all(
    fileEntries.map(async ([key, relativePath]) => {
      const response = await fetch(new URL(relativePath, manifestUrl).href);
      if (!response.ok) {
        throw new Error(`Failed to load scenario pack file "${key}": ${response.status}`);
      }

      return [key, await response.json()] as const;
    })
  );

  const hydratedFields = Object.fromEntries(resolvedEntries);
  const resolvedMaps = resolveContentPackMapAssetUrls(
    hydratedFields.maps,
    manifestUrl
  );
  const resolvedPortraits = resolveContentPackPortraitAssetUrls(
    hydratedFields.portraits,
    manifestUrl
  );

  return {
    schemaVersion: manifest.schemaVersion,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    ...hydratedFields,
    ...(resolvedMaps == null ? {} : { maps: resolvedMaps }),
    ...(resolvedPortraits == null ? {} : { portraits: resolvedPortraits }),
  };
}

async function hydrateScenarioPackManifestFromFiles(
  manifest: ScenarioPackManifest,
  manifestFilePath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
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
  const resolvedMaps = resolveImportedScenarioPackMapAssetUrls(
    hydratedFields.maps,
    manifestDirectoryPath,
    indexedFiles
  );
  const resolvedPortraits = resolveImportedScenarioPackPortraitAssetUrls(
    hydratedFields.portraits,
    manifestDirectoryPath,
    indexedFiles
  );

  return {
    schemaVersion: manifest.schemaVersion,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    ...hydratedFields,
    ...(resolvedMaps == null ? {} : { maps: resolvedMaps }),
    ...(resolvedPortraits == null ? {} : { portraits: resolvedPortraits }),
  };
}

function resolveImportedScenarioPackPortraitAssetUrls(
  portraits: ScenarioPackDefinition["portraits"],
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
) {
  if (!Array.isArray(portraits)) {
    return portraits;
  }

  const assetUrlCache: Record<string, string> = {};
  return portraits.map((portrait, index) => ({
    ...portrait,
    portraitImage: resolveImportedScenarioPackAssetReference(
      portrait.portraitImage,
      `scenario portraits[${index}].portraitImage`,
      manifestDirectoryPath,
      indexedFiles,
      assetUrlCache
    ),
    ...(portrait.avatarImage == null
      ? {}
      : {
          avatarImage: resolveImportedScenarioPackAssetReference(
            portrait.avatarImage,
            `scenario portraits[${index}].avatarImage`,
            manifestDirectoryPath,
            indexedFiles,
            assetUrlCache
          ),
        }),
  }));
}

function resolveImportedScenarioPackMapAssetUrls(
  maps: ScenarioPackDefinition["maps"],
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>
) {
  const assetUrlCache: Record<string, string> = {};

  return maps?.map((mapDefinition, mapIndex) => ({
    ...mapDefinition,
    ...(mapDefinition.primaryImageUrl == null
      ? {}
      : {
          primaryImageUrl: resolveImportedScenarioPackAssetUrl(
            readImportedScenarioPackAssetPath(
              mapDefinition.primaryImageUrl,
              `scenario maps[${mapIndex}].primaryImageUrl`
            ),
            manifestDirectoryPath,
            indexedFiles,
            assetUrlCache
          ),
        }),
    ...(mapDefinition.regionOverlayImageUrl == null
      ? {}
      : {
          regionOverlayImageUrl: resolveImportedScenarioPackAssetUrl(
            readImportedScenarioPackAssetPath(
              mapDefinition.regionOverlayImageUrl,
              `scenario maps[${mapIndex}].regionOverlayImageUrl`
            ),
            manifestDirectoryPath,
            indexedFiles,
            assetUrlCache
          ),
        }),
    ...(mapDefinition.layers == null
      ? {}
      : {
          layers: mapDefinition.layers.map((layerDefinition, layerIndex) => ({
            ...layerDefinition,
            imageUrl: resolveImportedScenarioPackAssetUrl(
              readImportedScenarioPackAssetPath(
                layerDefinition.imageUrl,
                `scenario maps[${mapIndex}].layers[${layerIndex}].imageUrl`
              ),
              manifestDirectoryPath,
              indexedFiles,
              assetUrlCache
            ),
          })),
        }),
  }));
}

function readImportedScenarioPackAssetPath(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function resolveImportedScenarioPackAssetUrl(
  value: string,
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>,
  assetUrlCache: Record<string, string>
): string {
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

  const nextAssetUrl = URL.createObjectURL(createImportedAssetBlob(importedFile));
  assetUrlCache[importedFile.relativePath] = nextAssetUrl;
  return nextAssetUrl;
}

function createImportedAssetBlob(importedFile: ScenarioPackImportFileEntry): Blob {
  const mimeType = resolveImportedAssetMimeType(importedFile);
  if (mimeType === importedFile.file.type) {
    return importedFile.file;
  }

  return new Blob([importedFile.file], { type: mimeType });
}

function resolveImportedAssetMimeType(
  importedFile: ScenarioPackImportFileEntry
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
  return matchedExtension == null
    ? importedFile.file.type || "application/octet-stream"
    : (mimeTypeByExtension[matchedExtension] as string);
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

function resolveScenarioPackImportedFileEntry(
  indexedFiles: Record<string, ScenarioPackImportFileEntry>,
  manifestDirectoryPath: string,
  relativePath: string
): ScenarioPackImportFileEntry {
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

function isScenarioPackManifest(value: unknown): value is ScenarioPackManifest {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  if (candidate.files == null || typeof candidate.files !== "object" || Array.isArray(candidate.files)) {
    return false;
  }

  if (typeof candidate.id !== "string" || typeof candidate.title !== "string") {
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

function resolveImportedScenarioPackAssetReference(
  value: string,
  label: string,
  manifestDirectoryPath: string,
  indexedFiles: Record<string, ScenarioPackImportFileEntry>,
  assetUrlCache: Record<string, string>
): string {
  if (value.startsWith("builtin:")) {
    return value;
  }

  return resolveImportedScenarioPackAssetUrl(
    readImportedScenarioPackAssetPath(value, label),
    manifestDirectoryPath,
    indexedFiles,
    assetUrlCache
  );
}

function assertObject(
  value: unknown,
  label: string
): asserts value is Record<string, unknown> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
}

function assertArray(value: unknown, label: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertEnum<T extends string>(
  value: unknown,
  label: string,
  allowedValues: readonly T[]
): asserts value is T {
  if (!allowedValues.includes(value as T)) {
    throw new Error(`${label} must be one of: ${allowedValues.join(", ")}.`);
  }
}

function assertOptionalString(
  value: unknown,
  label: string
): asserts value is string | undefined {
  if (value != null && (typeof value !== "string" || value.length === 0)) {
    throw new Error(`${label} must be a non-empty string when present.`);
  }
}

function assertOptionalEnum<T extends string>(
  value: unknown,
  label: string,
  allowedValues: readonly T[]
): asserts value is T | undefined {
  if (value != null && !allowedValues.includes(value as T)) {
    throw new Error(`${label} must be one of: ${allowedValues.join(", ")}.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}
