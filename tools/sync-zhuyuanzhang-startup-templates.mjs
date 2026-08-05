import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import {
  ADDITIVE_SHARED_TEXT_ENTRY_PREFIXES,
  BUILTIN_TEMPLATE_ONLY_MANIFEST_FILE_KEYS,
  CITY_SHARED_FIELD_KEYS,
  CITY_ENTRY_RUNTIME_LEADER_RESIDENCE_TARGET_HOUSE_ID_PREFIX,
  CITY_ENTRY_RUNTIME_LEADER_RESIDENCE_TARGET_HOUSE_ID_SUFFIX,
  CITY_ENTRY_TEMPLATE_LEADER_RESIDENCE_TARGET_HOUSE_ID,
  CITY_ENTRY_TEMPLATE_ONLY_IDS,
  EVENT_RUNTIME_CANONICAL_IDS,
  EVENT_RUNTIME_STORY_FORMAT_GAP_IDS,
  HOUSE_RUNTIME_CITY_SCOPED_SUFFIXES,
  HOUSE_RUNTIME_HOME_ID_PREFIX,
  HOUSE_RUNTIME_HOME_SPECIAL_IDS,
  HOUSE_SHARED_FIELD_KEYS,
  HOUSE_TEMPLATE_CONCRETE_SCENARIO_IDS,
  HOUSE_TEMPLATE_GENERIC_IDS,
  LEGACY_PUBLIC_TEMPLATE_PUBLICATION_ROOT,
  MAP_RUNTIME_CANONICAL_IDS,
  MAP_RUNTIME_ONLY_FIELD_KEYS,
  MAP_TEMPLATE_PRESERVED_FIELD_KEYS,
  PACK_MANIFEST_RUNTIME_ONLY_FILE_KEYS,
  PACK_MANIFEST_SHARED_FILE_KEYS,
  PACK_MANIFEST_TEMPLATE_ONLY_FILE_KEYS,
  PLAYABLE_FAMILY_FILE_NAMES,
  REGISTERED_BUILTIN_TEMPLATE_ASSET_FILE_NAMES,
  REGISTERED_BUILTIN_TEMPLATE_ASSET_PUBLICATION_ROOT,
  PUBLICATION_OMITTED_EVENT_IDS,
  PUBLICATION_OMITTED_MENU_RESOURCE_ENTRY_IDS,
  PUBLICATION_OMITTED_PLAYABLE_INTEGRATION_IDS,
  PUBLICATION_ONLY_MANIFEST_FILE_KEYS,
  PUBLICATION_SYNC_FILE_RULES,
  RUNTIME_BUILDING_SUPPORT_FILE_NAMES,
  RUNTIME_SAFE_EVENT_MIRROR_IDS,
  resolveZhuyuanzhangPackRoots,
  resolveZhuyuanzhangSyncDirection,
  SHARED_SYNC_FILE_RULES,
} from "./zhuyuanzhang-source-sync-contract.mjs";

const repoRoot = process.cwd();
const characterStartupFieldKeys = [
  "name",
  "birthYear",
  "deathYear",
  "age",
  "title",
  "occupation",
  "clanId",
  "affiliationLabel",
  "biography",
];
const runtimeMirrorManifestFileMap = Object.freeze({
  playables: "playables.json",
  playableIntegrations: "playable-integrations.json",
  playableShells: "playable-shells.json",
  buildingArrangements: "building-arrangements.json",
  dialogues: "dialogues.json",
  eventBindings: "event-bindings.json",
  houseModuleDefaults: "house-module-defaults.json",
  locationAccess: "location-access.json",
  menuInstances: "menu-instances.json",
  menuResources: "menu-resources.json",
  settlements: "settlements.json",
});

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readJsonIfExists(filePath) {
  try {
    return await readJson(filePath);
  } catch (error) {
    if (error != null && typeof error === "object" && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function readFileIfExists(filePath) {
  try {
    return await readFile(filePath);
  } catch (error) {
    if (error != null && typeof error === "object" && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function toStableIdList(records) {
  return [...new Set(
    (Array.isArray(records) ? records : []).flatMap((record) => {
      if (
        record != null &&
        typeof record === "object" &&
        !Array.isArray(record) &&
        typeof record.id === "string" &&
        record.id.trim().length > 0
      ) {
        return [record.id.trim()];
      }
      return [];
    })
  )].sort();
}

function syncCharacterStartupFields(runtimeCharacters, targetCharacters) {
  const runtimeById = new Map(runtimeCharacters.map((record) => [record.id, record]));

  return targetCharacters.map((record) => {
    const runtimeRecord = runtimeById.get(record.id);
    if (runtimeRecord == null) {
      return record;
    }

    const nextRecord = { ...record };
    for (const key of characterStartupFieldKeys) {
      if (Object.prototype.hasOwnProperty.call(runtimeRecord, key)) {
        nextRecord[key] = runtimeRecord[key];
        continue;
      }

      delete nextRecord[key];
    }
    return nextRecord;
  });
}

export function projectTextEntriesForSync(sourceEntries, targetEntries) {
  const nextEntries = {};
  for (const key of Object.keys(targetEntries)) {
    if (Object.prototype.hasOwnProperty.call(sourceEntries, key)) {
      nextEntries[key] = sourceEntries[key];
      continue;
    }

    nextEntries[key] = targetEntries[key];
  }

  for (const key of Object.keys(sourceEntries)) {
    if (Object.prototype.hasOwnProperty.call(nextEntries, key)) {
      continue;
    }

    if (
      ADDITIVE_SHARED_TEXT_ENTRY_PREFIXES.some((prefix) => key.startsWith(prefix))
    ) {
      nextEntries[key] = sourceEntries[key];
    }
  }
  return nextEntries;
}

export function projectActivitiesForSync(sourceActivities, targetActivities) {
  const sourceById = new Map(sourceActivities.map((record) => [record.id, record]));

  return targetActivities.map((targetRecord) => {
    const sourceRecord = sourceById.get(targetRecord.id);
    if (sourceRecord == null) {
      return targetRecord;
    }

    return {
      ...targetRecord,
      ...sourceRecord,
    };
  });
}

function projectManifestMetadata(sourceManifest, targetManifest) {
  const nextManifest = JSON.parse(JSON.stringify(targetManifest ?? {}));
  nextManifest.schemaVersion = sourceManifest.schemaVersion;
  nextManifest.kind = sourceManifest.kind;
  nextManifest.id = sourceManifest.id;
  nextManifest.title = sourceManifest.title;
  if (sourceManifest.description == null) {
    delete nextManifest.description;
  } else {
    nextManifest.description = sourceManifest.description;
  }
  return nextManifest;
}

function appendMissingManifestKeys(projectedFiles, sourceFiles, allowedKeys) {
  for (const key of allowedKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(projectedFiles, key) &&
      typeof sourceFiles?.[key] === "string" &&
      sourceFiles[key].length > 0
    ) {
      projectedFiles[key] = sourceFiles[key];
    }
  }
}

export function projectTemplatePackManifestForSync(
  sourceManifest,
  targetManifest
) {
  const nextManifest = projectManifestMetadata(sourceManifest, targetManifest);
  const projectedFiles = {};

  for (const key of Object.keys(targetManifest?.files ?? {})) {
    if (
      PACK_MANIFEST_SHARED_FILE_KEYS.includes(key) &&
      typeof sourceManifest?.files?.[key] === "string"
    ) {
      projectedFiles[key] = sourceManifest.files[key];
      continue;
    }

    if (
      PACK_MANIFEST_TEMPLATE_ONLY_FILE_KEYS.includes(key) &&
      typeof targetManifest?.files?.[key] === "string"
    ) {
      projectedFiles[key] = targetManifest.files[key];
    }
  }

  appendMissingManifestKeys(
    projectedFiles,
    sourceManifest?.files ?? {},
    PACK_MANIFEST_SHARED_FILE_KEYS
  );
  appendMissingManifestKeys(
    projectedFiles,
    targetManifest?.files ?? {},
    PACK_MANIFEST_TEMPLATE_ONLY_FILE_KEYS
  );

  nextManifest.files = projectedFiles;
  return nextManifest;
}

function projectTemplateCityHouseIdsForSync(sourceHouseIds) {
  return (Array.isArray(sourceHouseIds) ? sourceHouseIds : []).map((houseId) => {
    const templateHouseId = resolveTemplateHouseIdForRuntimeHouse({ id: houseId });
    return templateHouseId ?? houseId;
  });
}

function projectRuntimeCityHouseIdsForSync(sourceHouseIds, targetHouseIds) {
  const runtimeHouseIdByTemplateId = new Map(
    (Array.isArray(targetHouseIds) ? targetHouseIds : []).map((houseId) => [
      resolveTemplateHouseIdForRuntimeHouse({ id: houseId }) ?? houseId,
      houseId,
    ])
  );

  return (Array.isArray(sourceHouseIds) ? sourceHouseIds : []).map((houseId) => {
    return runtimeHouseIdByTemplateId.get(houseId) ?? houseId;
  });
}

function cloneJsonCompatibleValue(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function getMapNodeIdentity(node) {
  if (node == null || typeof node !== "object") {
    return null;
  }

  if (typeof node.id === "string" && node.id.length > 0) {
    return node.id;
  }
  if (typeof node.cityId === "string" && node.cityId.length > 0) {
    return node.cityId;
  }
  return null;
}

function isCoordinateRecord(value) {
  return (
    value != null &&
    typeof value === "object" &&
    typeof value.x === "number" &&
    typeof value.y === "number"
  );
}

function coordinatesMatch(left, right) {
  return (
    isCoordinateRecord(left) &&
    isCoordinateRecord(right) &&
    Math.abs(left.x - right.x) < 1e-6 &&
    Math.abs(left.y - right.y) < 1e-6
  );
}

function projectTemplateMapNodesForSync(sourceNodes, targetNodes) {
  const targetNodeByIdentity = new Map(
    (Array.isArray(targetNodes) ? targetNodes : []).flatMap((node) => {
      const identity = getMapNodeIdentity(node);
      return identity == null ? [] : [[identity, node]];
    })
  );

  return (Array.isArray(sourceNodes) ? sourceNodes : []).map((sourceNode) => {
    const nextNode = cloneJsonCompatibleValue(sourceNode);
    const identity = getMapNodeIdentity(sourceNode);
    const targetNode = identity == null ? null : targetNodeByIdentity.get(identity);
    if (
      targetNode != null &&
      typeof targetNode.x === "number" &&
      typeof targetNode.y === "number"
    ) {
      nextNode.x = targetNode.x;
      nextNode.y = targetNode.y;
    }
    return nextNode;
  });
}

function projectTemplateMapInitialPlayerCoordinateForSync(
  sourceMap,
  projectedNodes
) {
  if (!isCoordinateRecord(sourceMap?.initialPlayerCoordinate)) {
    return undefined;
  }

  const sourceNode = (Array.isArray(sourceMap?.nodes) ? sourceMap.nodes : []).find((node) =>
    coordinatesMatch(node, sourceMap.initialPlayerCoordinate)
  );
  const sourceNodeIdentity = getMapNodeIdentity(sourceNode);
  if (sourceNodeIdentity == null) {
    return cloneJsonCompatibleValue(sourceMap.initialPlayerCoordinate);
  }

  const projectedNode = (Array.isArray(projectedNodes) ? projectedNodes : []).find(
    (node) => getMapNodeIdentity(node) === sourceNodeIdentity
  );
  if (
    projectedNode != null &&
    typeof projectedNode.x === "number" &&
    typeof projectedNode.y === "number"
  ) {
    return {
      x: projectedNode.x,
      y: projectedNode.y,
    };
  }

  return cloneJsonCompatibleValue(sourceMap.initialPlayerCoordinate);
}

function projectRuntimeMapToTemplateMap(sourceMap, targetMap) {
  const nextMap = {};
  for (const [key, value] of Object.entries(sourceMap ?? {})) {
    if (
      MAP_RUNTIME_ONLY_FIELD_KEYS.includes(key) ||
      MAP_TEMPLATE_PRESERVED_FIELD_KEYS.includes(key)
    ) {
      continue;
    }
    if (key === "nodes") {
      continue;
    }
    if (key === "initialPlayerCoordinate") {
      continue;
    }
    nextMap[key] = cloneJsonCompatibleValue(value);
  }

  const projectedNodes = projectTemplateMapNodesForSync(
    sourceMap?.nodes,
    targetMap?.nodes
  );
  nextMap.nodes = projectedNodes;

  const projectedInitialPlayerCoordinate =
    projectTemplateMapInitialPlayerCoordinateForSync(sourceMap, projectedNodes);
  if (projectedInitialPlayerCoordinate != null) {
    nextMap.initialPlayerCoordinate = projectedInitialPlayerCoordinate;
  }

  for (const key of MAP_TEMPLATE_PRESERVED_FIELD_KEYS) {
    if (Object.prototype.hasOwnProperty.call(targetMap ?? {}, key)) {
      nextMap[key] = cloneJsonCompatibleValue(targetMap[key]);
    }
  }

  return nextMap;
}

export function projectTemplateMapsForSync(sourceMaps, targetMaps) {
  const sourceById = new Map(
    (Array.isArray(sourceMaps) ? sourceMaps : []).map((record) => [record.id, record])
  );
  const runtimeCanonicalIds = new Set(MAP_RUNTIME_CANONICAL_IDS);
  const nextMaps = [];
  const seenIds = new Set();

  for (const targetMap of Array.isArray(targetMaps) ? targetMaps : []) {
    if (
      targetMap == null ||
      typeof targetMap !== "object" ||
      typeof targetMap.id !== "string"
    ) {
      nextMaps.push(targetMap);
      continue;
    }

    if (!runtimeCanonicalIds.has(targetMap.id)) {
      nextMaps.push(targetMap);
      continue;
    }

    const sourceMap = sourceById.get(targetMap.id);
    if (sourceMap == null) {
      nextMaps.push(targetMap);
      continue;
    }

    nextMaps.push(projectRuntimeMapToTemplateMap(sourceMap, targetMap));
    seenIds.add(targetMap.id);
  }

  for (const mapId of MAP_RUNTIME_CANONICAL_IDS) {
    if (seenIds.has(mapId)) {
      continue;
    }

    const sourceMap = sourceById.get(mapId);
    if (sourceMap != null) {
      nextMaps.push(projectRuntimeMapToTemplateMap(sourceMap, null));
    }
  }

  return nextMaps;
}

export function projectTemplateCitiesForSync(sourceCities, targetCities) {
  const sourceById = new Map(
    (Array.isArray(sourceCities) ? sourceCities : []).map((record) => [
      record.id,
      record,
    ])
  );

  return (Array.isArray(targetCities) ? targetCities : []).map((targetCity) => {
    const sourceCity = sourceById.get(targetCity.id);
    if (sourceCity == null) {
      return targetCity;
    }

    const nextCity = { ...targetCity };
    for (const key of CITY_SHARED_FIELD_KEYS) {
      if (Object.prototype.hasOwnProperty.call(sourceCity, key)) {
        nextCity[key] = sourceCity[key];
      }
    }
    nextCity.houseIds = projectTemplateCityHouseIdsForSync(sourceCity.houseIds);
    return nextCity;
  });
}

export function projectRuntimeCitiesForSync(sourceCities, targetCities) {
  const sourceById = new Map(
    (Array.isArray(sourceCities) ? sourceCities : []).map((record) => [
      record.id,
      record,
    ])
  );

  return (Array.isArray(targetCities) ? targetCities : []).map((targetCity) => {
    const sourceCity = sourceById.get(targetCity.id);
    if (sourceCity == null) {
      return targetCity;
    }

    const nextCity = { ...targetCity };
    for (const key of CITY_SHARED_FIELD_KEYS) {
      if (Object.prototype.hasOwnProperty.call(sourceCity, key)) {
        nextCity[key] = sourceCity[key];
      }
    }
    nextCity.houseIds = projectRuntimeCityHouseIdsForSync(
      sourceCity.houseIds,
      targetCity.houseIds
    );
    return nextCity;
  });
}

function projectRuntimeEventToTemplateEvent(sourceEvent, targetEvent) {
  if (sourceEvent == null || typeof sourceEvent !== "object") {
    return targetEvent;
  }

  if (!EVENT_RUNTIME_STORY_FORMAT_GAP_IDS.includes(sourceEvent.id)) {
    return JSON.parse(JSON.stringify(sourceEvent));
  }

  const nextEvent = {};
  for (const key of ["id", "chapterId", "name", "occurrence", "tags", "actions"]) {
    if (Object.prototype.hasOwnProperty.call(sourceEvent, key)) {
      nextEvent[key] = JSON.parse(JSON.stringify(sourceEvent[key]));
    }
  }

  if (typeof sourceEvent.dialogueId === "string" && sourceEvent.dialogueId.length > 0) {
    nextEvent.dialogueId = sourceEvent.dialogueId;
  } else if (
    typeof sourceEvent.entrySceneId === "string" &&
    sourceEvent.entrySceneId.length > 0
  ) {
    nextEvent.dialogueId = sourceEvent.entrySceneId;
  } else if (
    targetEvent != null &&
    typeof targetEvent === "object" &&
    typeof targetEvent.dialogueId === "string"
  ) {
    nextEvent.dialogueId = targetEvent.dialogueId;
  }

  return nextEvent;
}

export function projectTemplateEventsForSync(sourceEvents, targetEvents) {
  const sourceById = new Map(
    (Array.isArray(sourceEvents) ? sourceEvents : []).map((record) => [
      record.id,
      record,
    ])
  );
  const runtimeCanonicalIds = new Set(EVENT_RUNTIME_CANONICAL_IDS);
  const seenIds = new Set();
  const nextEvents = [];

  for (const targetEvent of Array.isArray(targetEvents) ? targetEvents : []) {
    if (
      targetEvent == null ||
      typeof targetEvent !== "object" ||
      typeof targetEvent.id !== "string"
    ) {
      nextEvents.push(targetEvent);
      continue;
    }

    if (!runtimeCanonicalIds.has(targetEvent.id)) {
      nextEvents.push(targetEvent);
      continue;
    }

    const sourceEvent = sourceById.get(targetEvent.id);
    if (sourceEvent == null) {
      nextEvents.push(targetEvent);
      continue;
    }

    nextEvents.push(projectRuntimeEventToTemplateEvent(sourceEvent, targetEvent));
    seenIds.add(targetEvent.id);
  }

  for (const eventId of EVENT_RUNTIME_CANONICAL_IDS) {
    if (seenIds.has(eventId)) {
      continue;
    }

    const sourceEvent = sourceById.get(eventId);
    if (sourceEvent != null) {
      nextEvents.push(projectRuntimeEventToTemplateEvent(sourceEvent, null));
    }
  }

  return nextEvents;
}

export function projectRuntimeEventsForSync(sourceEvents, targetEvents) {
  const sourceById = new Map(
    (Array.isArray(sourceEvents) ? sourceEvents : []).map((record) => [
      record.id,
      record,
    ])
  );
  const mirroredIds = new Set(RUNTIME_SAFE_EVENT_MIRROR_IDS);
  const nextEvents = [];
  const seenMirroredIds = new Set();

  for (const targetRecord of Array.isArray(targetEvents) ? targetEvents : []) {
    if (!mirroredIds.has(targetRecord.id)) {
      nextEvents.push(targetRecord);
      continue;
    }

    const sourceRecord = sourceById.get(targetRecord.id);
    if (sourceRecord == null) {
      nextEvents.push(targetRecord);
      continue;
    }

    nextEvents.push(sourceRecord);
    seenMirroredIds.add(targetRecord.id);
  }

  for (const eventId of RUNTIME_SAFE_EVENT_MIRROR_IDS) {
    if (seenMirroredIds.has(eventId)) {
      continue;
    }
    const sourceRecord = sourceById.get(eventId);
    if (sourceRecord != null) {
      nextEvents.push(sourceRecord);
    }
  }

  return nextEvents;
}

export function projectRuntimeEventBindingsForSync(
  sourceEventBindings,
  runtimeEvents
) {
  const runtimeEventIds = new Set(
    (Array.isArray(runtimeEvents) ? runtimeEvents : []).flatMap((record) => {
      if (
        record != null &&
        typeof record === "object" &&
        typeof record.id === "string" &&
        record.id.trim().length > 0
      ) {
        return [record.id.trim()];
      }
      return [];
    })
  );

  return (Array.isArray(sourceEventBindings) ? sourceEventBindings : []).filter(
    (record) =>
      record != null &&
      typeof record === "object" &&
      typeof record.eventId === "string" &&
      runtimeEventIds.has(record.eventId)
  );
}

export function projectPublicEventsForSync(sourceEvents) {
  return (Array.isArray(sourceEvents) ? sourceEvents : []).filter(
    (record) =>
      record != null &&
      typeof record === "object" &&
      typeof record.id === "string" &&
      !PUBLICATION_OMITTED_EVENT_IDS.includes(record.id)
  );
}

export function projectPublicDialoguesForSync(sourceDialogues) {
  return JSON.parse(JSON.stringify(Array.isArray(sourceDialogues) ? sourceDialogues : []));
}

export function projectPublicEventBindingsForSync(sourceEventBindings) {
  return JSON.parse(
    JSON.stringify(Array.isArray(sourceEventBindings) ? sourceEventBindings : [])
  );
}

export function projectPublicMenuResourcesForSync(sourceMenuResources) {
  return JSON.parse(
    JSON.stringify(Array.isArray(sourceMenuResources) ? sourceMenuResources : [])
  ).map((record) => {
    if (record?.id !== "menu-resource.city.default") {
      return record;
    }

    return {
      ...record,
      entries: (Array.isArray(record.entries) ? record.entries : []).filter(
        (entry) =>
          !PUBLICATION_OMITTED_MENU_RESOURCE_ENTRY_IDS.includes(entry.id)
      ),
    };
  });
}

export function projectPublicHouseModuleDefaultsForSync(
  sourceHouseModuleDefaults
) {
  return JSON.parse(JSON.stringify(sourceHouseModuleDefaults ?? {}));
}

export function projectPublicPlayableIntegrationsForSync(
  sourcePlayableIntegrations
) {
  return JSON.parse(
    JSON.stringify(Array.isArray(sourcePlayableIntegrations) ? sourcePlayableIntegrations : [])
  ).filter(
    (record) =>
      record != null &&
      typeof record === "object" &&
      typeof record.integrationId === "string" &&
      !PUBLICATION_OMITTED_PLAYABLE_INTEGRATION_IDS.includes(record.integrationId)
  );
}

export function projectPublicPackManifestForSync(
  sourceManifest,
  targetManifest
) {
  const projectedFiles = {};
  for (const [key, value] of Object.entries(sourceManifest.files ?? {})) {
    if (BUILTIN_TEMPLATE_ONLY_MANIFEST_FILE_KEYS.includes(key)) {
      continue;
    }
    projectedFiles[key] = value;
  }

  for (const key of PUBLICATION_ONLY_MANIFEST_FILE_KEYS) {
    const targetValue = targetManifest?.files?.[key];
    if (typeof targetValue === "string" && targetValue.length > 0) {
      projectedFiles[key] = targetValue;
    }
  }

  return {
    schemaVersion: sourceManifest.schemaVersion,
    kind: sourceManifest.kind,
    id: sourceManifest.id,
    title: sourceManifest.title,
    ...(sourceManifest.description == null
      ? {}
      : { description: sourceManifest.description }),
    files: projectedFiles,
  };
}

export function projectRuntimePackManifestForSync(
  sourceManifest,
  targetManifest
) {
  const nextManifest = projectManifestMetadata(sourceManifest, targetManifest);
  const projectedFiles = {};

  for (const key of Object.keys(targetManifest?.files ?? {})) {
    if (
      PACK_MANIFEST_SHARED_FILE_KEYS.includes(key) &&
      typeof sourceManifest?.files?.[key] === "string"
    ) {
      projectedFiles[key] = sourceManifest.files[key];
      continue;
    }

    if (
      PACK_MANIFEST_RUNTIME_ONLY_FILE_KEYS.includes(key) &&
      typeof targetManifest?.files?.[key] === "string"
    ) {
      projectedFiles[key] = targetManifest.files[key];
    }
  }

  appendMissingManifestKeys(
    projectedFiles,
    sourceManifest?.files ?? {},
    PACK_MANIFEST_SHARED_FILE_KEYS
  );
  appendMissingManifestKeys(
    projectedFiles,
    targetManifest?.files ?? {},
    PACK_MANIFEST_RUNTIME_ONLY_FILE_KEYS
  );

  for (const [manifestKey, fileName] of Object.entries(
    runtimeMirrorManifestFileMap
  )) {
    projectedFiles[manifestKey] = fileName;
  }

  nextManifest.files = projectedFiles;
  return nextManifest;
}

function toRuntimeLeaderResidenceTargetHouseId(cityId) {
  return `${CITY_ENTRY_RUNTIME_LEADER_RESIDENCE_TARGET_HOUSE_ID_PREFIX}${cityId.replace(
    /^city\./,
    ""
  )}${CITY_ENTRY_RUNTIME_LEADER_RESIDENCE_TARGET_HOUSE_ID_SUFFIX}`;
}

export function projectRuntimeCityEntriesForSync(sourceEntries, targetEntries) {
  const sourceById = new Map(
    (Array.isArray(sourceEntries) ? sourceEntries : []).map((record) => [
      record.id,
      record,
    ])
  );
  const nextEntries = [];
  const seenIds = new Set();

  for (const targetRecord of Array.isArray(targetEntries) ? targetEntries : []) {
    const sourceRecord = sourceById.get(targetRecord.id);
    if (
      sourceRecord == null ||
      CITY_ENTRY_TEMPLATE_ONLY_IDS.includes(targetRecord.id)
    ) {
      nextEntries.push(targetRecord);
      seenIds.add(targetRecord.id);
      continue;
    }

    if (sourceRecord.directoryType === "leader-residence") {
      nextEntries.push({
        ...sourceRecord,
        targetHouseId: toRuntimeLeaderResidenceTargetHouseId(sourceRecord.cityId),
      });
      seenIds.add(targetRecord.id);
      continue;
    }

    nextEntries.push(sourceRecord);
    seenIds.add(targetRecord.id);
  }

  for (const sourceRecord of Array.isArray(sourceEntries) ? sourceEntries : []) {
    if (
      seenIds.has(sourceRecord.id) ||
      CITY_ENTRY_TEMPLATE_ONLY_IDS.includes(sourceRecord.id)
    ) {
      continue;
    }
    nextEntries.push(
      sourceRecord.directoryType === "leader-residence"
        ? {
            ...sourceRecord,
            targetHouseId: toRuntimeLeaderResidenceTargetHouseId(sourceRecord.cityId),
          }
        : sourceRecord
    );
  }

  return nextEntries;
}

export function projectTemplateCityEntriesForSync(sourceEntries, targetEntries) {
  const sourceById = new Map(
    (Array.isArray(sourceEntries) ? sourceEntries : []).map((record) => [
      record.id,
      record,
    ])
  );
  const nextEntries = [];
  const seenIds = new Set();

  for (const targetRecord of Array.isArray(targetEntries) ? targetEntries : []) {
    if (CITY_ENTRY_TEMPLATE_ONLY_IDS.includes(targetRecord.id)) {
      nextEntries.push(targetRecord);
      seenIds.add(targetRecord.id);
      continue;
    }

    const sourceRecord = sourceById.get(targetRecord.id);
    if (sourceRecord == null) {
      nextEntries.push(targetRecord);
      seenIds.add(targetRecord.id);
      continue;
    }

    nextEntries.push(
      sourceRecord.directoryType === "leader-residence"
        ? {
            ...sourceRecord,
            targetHouseId: CITY_ENTRY_TEMPLATE_LEADER_RESIDENCE_TARGET_HOUSE_ID,
          }
        : sourceRecord
    );
    seenIds.add(targetRecord.id);
  }

  for (const sourceRecord of Array.isArray(sourceEntries) ? sourceEntries : []) {
    if (seenIds.has(sourceRecord.id)) {
      continue;
    }
    nextEntries.push(
      sourceRecord.directoryType === "leader-residence"
        ? {
            ...sourceRecord,
            targetHouseId: CITY_ENTRY_TEMPLATE_LEADER_RESIDENCE_TARGET_HOUSE_ID,
          }
        : sourceRecord
    );
  }

  return nextEntries;
}

function resolveRuntimeHouseIdForTemplateHouse(templateHouse) {
  if (templateHouse == null || typeof templateHouse !== "object") {
    return null;
  }

  if (HOUSE_TEMPLATE_CONCRETE_SCENARIO_IDS.includes(templateHouse.id)) {
    return templateHouse.id;
  }

  if (templateHouse.id === "home.template") {
    return HOUSE_RUNTIME_HOME_SPECIAL_IDS[0] ?? null;
  }

  if (
    typeof templateHouse.id !== "string" ||
    !HOUSE_TEMPLATE_GENERIC_IDS.includes(templateHouse.id) ||
    typeof templateHouse.cityId !== "string" ||
    !templateHouse.cityId.startsWith("city.") ||
    !templateHouse.id.startsWith("house.template.")
  ) {
    return null;
  }

  const citySlug = templateHouse.cityId.slice("city.".length);
  const suffix = templateHouse.id.slice("house.template".length);
  return `house.${citySlug}${suffix}`;
}

function resolveTemplateHouseIdForRuntimeHouse(runtimeHouse) {
  if (runtimeHouse == null || typeof runtimeHouse !== "object") {
    return null;
  }

  if (HOUSE_TEMPLATE_CONCRETE_SCENARIO_IDS.includes(runtimeHouse.id)) {
    return runtimeHouse.id;
  }

  if (
    runtimeHouse.id === HOUSE_RUNTIME_HOME_SPECIAL_IDS[0] ||
    (typeof runtimeHouse.id === "string" &&
      runtimeHouse.id.startsWith(HOUSE_RUNTIME_HOME_ID_PREFIX))
  ) {
    return "home.template";
  }

  if (typeof runtimeHouse.id !== "string" || !runtimeHouse.id.startsWith("house.")) {
    return null;
  }

  const suffix = HOUSE_RUNTIME_CITY_SCOPED_SUFFIXES.find((candidate) =>
    runtimeHouse.id.endsWith(candidate)
  );
  if (suffix == null) {
    return null;
  }

  return `house.template${suffix}`;
}

export function projectTemplateHousesForSync(sourceHouses, targetHouses) {
  const sourceById = new Map(
    (Array.isArray(sourceHouses) ? sourceHouses : []).map((record) => [
      record.id,
      record,
    ])
  );

  return (Array.isArray(targetHouses) ? targetHouses : []).map((targetHouse) => {
    const runtimeHouseId = resolveRuntimeHouseIdForTemplateHouse(targetHouse);
    const sourceHouse =
      runtimeHouseId == null ? null : sourceById.get(runtimeHouseId) ?? null;
    if (sourceHouse == null) {
      return targetHouse;
    }

    const nextHouse = { ...targetHouse };

    for (const key of HOUSE_SHARED_FIELD_KEYS) {
      if (Object.prototype.hasOwnProperty.call(sourceHouse, key)) {
        nextHouse[key] = sourceHouse[key];
      }
    }

    return nextHouse;
  });
}

export function projectRuntimeHousesForSync(sourceHouses, targetHouses) {
  const sourceById = new Map(
    (Array.isArray(sourceHouses) ? sourceHouses : []).map((record) => [
      record.id,
      record,
    ])
  );

  return (Array.isArray(targetHouses) ? targetHouses : []).map((targetHouse) => {
    const templateHouseId = resolveTemplateHouseIdForRuntimeHouse(targetHouse);
    const sourceHouse =
      templateHouseId == null ? null : sourceById.get(templateHouseId) ?? null;
    if (sourceHouse == null) {
      return targetHouse;
    }

    const nextHouse = { ...targetHouse };

    for (const key of HOUSE_SHARED_FIELD_KEYS) {
      if (Object.prototype.hasOwnProperty.call(sourceHouse, key)) {
        nextHouse[key] = sourceHouse[key];
      }
    }

    return nextHouse;
  });
}

export async function resolveCanonicalPlayableFamilyForSync(
  repoRootPath,
  sourceRoot,
  sourcePlayableFamily
) {
  if (
    sourceRoot.includes("/builtin-templates/") &&
    sourcePlayableFamily != null
  ) {
    return {
      playables: JSON.parse(JSON.stringify(sourcePlayableFamily.playables ?? [])),
      playableIntegrations: JSON.parse(
        JSON.stringify(sourcePlayableFamily.playableIntegrations ?? [])
      ),
      playableShells: JSON.parse(
        JSON.stringify(sourcePlayableFamily.playableShells ?? [])
      ),
    };
  }

  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRootPath);
  return {
    playables: await readJson(path.join(builtinTemplateRoot, "playables.json")),
    playableIntegrations: await readJson(
      path.join(builtinTemplateRoot, "playable-integrations.json")
    ),
    playableShells: await readJson(
      path.join(builtinTemplateRoot, "playable-shells.json")
    ),
  };
}

export async function resolveCanonicalRuntimeBuildingSupportForSync(
  repoRootPath,
  sourceRoot,
  sourceRuntimeBuildingSupport
) {
  const fileNameByKey = {
    buildingArrangements: "building-arrangements.json",
    dialogues: "dialogues.json",
    eventBindings: "event-bindings.json",
    houseModuleDefaults: "house-module-defaults.json",
    locationAccess: "location-access.json",
    menuInstances: "menu-instances.json",
    menuResources: "menu-resources.json",
    settlements: "settlements.json",
  };

  if (
    sourceRoot.includes("/builtin-templates/") &&
    sourceRuntimeBuildingSupport != null
  ) {
    return Object.fromEntries(
      Object.keys(fileNameByKey).map((key) => [
        key,
        JSON.parse(JSON.stringify(sourceRuntimeBuildingSupport[key] ?? [])),
      ])
    );
  }

  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRootPath);
  return Object.fromEntries(
    await Promise.all(
      Object.entries(fileNameByKey).map(async ([key, fileName]) => [
        key,
        await readJson(path.join(builtinTemplateRoot, fileName)),
      ])
    )
  );
}

export async function resolveCanonicalRuntimeEventsForSync(
  repoRootPath,
  sourceRoot,
  sourceEvents
) {
  if (sourceRoot.includes("/builtin-templates/") && Array.isArray(sourceEvents)) {
    return JSON.parse(JSON.stringify(sourceEvents));
  }

  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRootPath);
  return readJson(path.join(builtinTemplateRoot, "events.json"));
}

export async function resolveCanonicalRuntimeMapsForSync(
  repoRootPath,
  sourceRoot,
  sourceMaps
) {
  if (!sourceRoot.includes("/builtin-templates/") && Array.isArray(sourceMaps)) {
    return cloneJsonCompatibleValue(sourceMaps);
  }

  const { runtimeRoot } = resolveZhuyuanzhangPackRoots(repoRootPath);
  return readJson(path.join(runtimeRoot, "maps.json"));
}

async function buildTargetContents(sourceRoot, targetRoots) {
  const { runtimeRoot } = resolveZhuyuanzhangPackRoots(repoRoot);
  const sourceScenarioProfile = await readJson(
    path.join(sourceRoot, "scenario-profile.json")
  );
  const sourceCharacters = await readJson(path.join(sourceRoot, "characters.json"));
  const sourceTextEntries = await readJson(path.join(sourceRoot, "text-entries.json"));
  const sourceActivities = await readJson(path.join(sourceRoot, "activities.json"));
  const sourcePackManifest = await readJson(path.join(sourceRoot, "pack.json"));
  const sourceCities = await readJson(path.join(sourceRoot, "cities.json"));
  const sourceMaps = await readJson(path.join(sourceRoot, "maps.json"));
  const sourceCityEntries = await readJson(path.join(sourceRoot, "city-entries.json"));
  const sourceEvents = await readJson(path.join(sourceRoot, "events.json"));
  const sourceHouses = await readJson(path.join(sourceRoot, "houses.json"));
  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRoot);
  const legacyPublicTemplateRoot = path.join(
    repoRoot,
    LEGACY_PUBLIC_TEMPLATE_PUBLICATION_ROOT
  );
  async function readTargetJsonForBuild(targetRoot, fileName, fallbackValue) {
    const targetPath = path.join(targetRoot, fileName);
    const directValue = await readJsonIfExists(targetPath);
    if (directValue != null) {
      return directValue;
    }

    return fallbackValue == null
      ? null
      : JSON.parse(JSON.stringify(fallbackValue));
  }
  async function readPublicationJsonForBuild(fileName, fallbackValue = null) {
    for (const candidateRoot of [
      builtinTemplateRoot,
      sourceRoot,
    ]) {
      const value = await readJsonIfExists(path.join(candidateRoot, fileName));
      if (value != null) {
        return value;
      }
    }

    return fallbackValue == null
      ? null
      : JSON.parse(JSON.stringify(fallbackValue));
  }
  const canonicalRuntimeMirrorManifestSource =
    sourceRoot.includes("/builtin-templates/")
      ? sourcePackManifest
      : await readJson(path.join(builtinTemplateRoot, "pack.json"));
  const canonicalPublicationManifestSource =
    sourceRoot.includes("/builtin-templates/")
      ? sourcePackManifest
      : await readJson(path.join(builtinTemplateRoot, "pack.json"));
  const sourcePlayableShellsPath = path.join(sourceRoot, "playable-shells.json");
  const sourcePlayableShells =
    sourceRoot.includes("/builtin-templates/")
      ? await readJson(sourcePlayableShellsPath)
      : null;
  const canonicalPlayableFamily = await resolveCanonicalPlayableFamilyForSync(
    repoRoot,
    sourceRoot,
    sourceRoot.includes("/builtin-templates/")
      ? {
          playables: await readJson(path.join(sourceRoot, "playables.json")),
          playableIntegrations: await readJson(
            path.join(sourceRoot, "playable-integrations.json")
          ),
          playableShells: sourcePlayableShells,
        }
      : null
  );
  const canonicalRuntimeBuildingSupport =
    await resolveCanonicalRuntimeBuildingSupportForSync(
      repoRoot,
      sourceRoot,
      sourceRoot.includes("/builtin-templates/")
        ? {
            buildingArrangements: await readJson(
              path.join(sourceRoot, "building-arrangements.json")
            ),
            dialogues: await readJson(path.join(sourceRoot, "dialogues.json")),
            eventBindings: await readJson(
              path.join(sourceRoot, "event-bindings.json")
            ),
            houseModuleDefaults: await readJson(
              path.join(sourceRoot, "house-module-defaults.json")
            ),
            locationAccess: await readJson(
              path.join(sourceRoot, "location-access.json")
            ),
            menuInstances: await readJson(
              path.join(sourceRoot, "menu-instances.json")
            ),
            menuResources: await readJson(
              path.join(sourceRoot, "menu-resources.json")
            ),
            settlements: await readJson(path.join(sourceRoot, "settlements.json")),
          }
        : null
    );
  const canonicalRuntimeEvents = await resolveCanonicalRuntimeEventsForSync(
    repoRoot,
    sourceRoot,
    sourceRoot.includes("/builtin-templates/")
      ? await readJson(path.join(sourceRoot, "events.json"))
      : null
  );
  const canonicalRuntimeMaps = await resolveCanonicalRuntimeMapsForSync(
    repoRoot,
    sourceRoot,
    sourceMaps
  );

  const results = [];
  for (const targetRoot of targetRoots) {
    const runtimeProjectedEvents =
      targetRoot === runtimeRoot
        ? projectRuntimeEventsForSync(
            canonicalRuntimeEvents,
            await readJson(path.join(targetRoot, "events.json"))
          )
        : null;

    const targetCharactersPath = path.join(targetRoot, "characters.json");
    const targetCharacters =
      (await readTargetJsonForBuild(targetRoot, "characters.json", sourceCharacters)) ??
      sourceCharacters;
    const nextCharacters = syncCharacterStartupFields(
      sourceCharacters,
      targetCharacters
    );

    const nextPackManifest =
      targetRoot === runtimeRoot
        ? projectRuntimePackManifestForSync(
            canonicalRuntimeMirrorManifestSource,
            (await readTargetJsonForBuild(targetRoot, "pack.json", {})) ?? {}
          )
        : path.basename(targetRoot) === "zhuyuanzhang" &&
            targetRoot.includes("/public/")
        ? projectPublicPackManifestForSync(
            canonicalPublicationManifestSource,
            (await readTargetJsonForBuild(targetRoot, "pack.json", {})) ?? {}
          )
        : targetRoot === builtinTemplateRoot
        ? projectTemplatePackManifestForSync(
            sourcePackManifest,
            (await readTargetJsonForBuild(targetRoot, "pack.json", {})) ?? {}
          )
        : (await readTargetJsonForBuild(targetRoot, "pack.json", {})) ?? {};
    const nextCities =
      targetRoot === runtimeRoot
        ? projectRuntimeCitiesForSync(
            sourceCities,
            (await readTargetJsonForBuild(targetRoot, "cities.json", [])) ?? []
          )
        : targetRoot === builtinTemplateRoot
        ? projectTemplateCitiesForSync(
            sourceCities,
            (await readTargetJsonForBuild(targetRoot, "cities.json", [])) ?? []
          )
        : null;
    const nextMaps =
      targetRoot === builtinTemplateRoot || targetRoot.includes("/public/")
        ? projectTemplateMapsForSync(
            canonicalRuntimeMaps,
            (await readTargetJsonForBuild(targetRoot, "maps.json", [])) ?? []
          )
        : null;
    const nextEvents =
      targetRoot === builtinTemplateRoot
        ? projectTemplateEventsForSync(
            sourceEvents,
            (await readTargetJsonForBuild(targetRoot, "events.json", [])) ?? []
          )
        : null;
    const nextCityEntries =
      targetRoot === runtimeRoot
        ? projectRuntimeCityEntriesForSync(
            sourceCityEntries,
            (await readTargetJsonForBuild(targetRoot, "city-entries.json", [])) ?? []
          )
        : targetRoot === builtinTemplateRoot
        ? projectTemplateCityEntriesForSync(
            sourceCityEntries,
            (await readTargetJsonForBuild(targetRoot, "city-entries.json", [])) ?? []
          )
        : null;
    const nextHouses =
      targetRoot === runtimeRoot
        ? projectRuntimeHousesForSync(
            sourceHouses,
            (await readTargetJsonForBuild(targetRoot, "houses.json", [])) ?? []
          )
        : targetRoot === builtinTemplateRoot
        ? projectTemplateHousesForSync(
            sourceHouses,
            (await readTargetJsonForBuild(targetRoot, "houses.json", [])) ?? []
          )
        : null;
    const explicitlyManagedPublicFileNames = new Set([
      "scenario-profile.json",
      "characters.json",
      "text-entries.json",
      "activities.json",
      "pack.json",
      "maps.json",
      "playables.json",
      "playable-integrations.json",
      "playable-shells.json",
      "settlements.json",
      "dialogues.json",
      "events.json",
      "event-bindings.json",
      "menu-resources.json",
      "house-module-defaults.json",
    ]);
    const supplementalPublicFiles =
      targetRoot.includes("/public/")
        ? await Promise.all(
            Object.values(nextPackManifest.files ?? {})
              .filter(
                (fileName) =>
                  typeof fileName === "string" &&
                  fileName.endsWith(".json") &&
                  !explicitlyManagedPublicFileNames.has(fileName)
              )
              .map(async (fileName) => ({
                fileName,
                filePath: path.join(targetRoot, fileName),
                publicationManaged: true,
                content: formatJson(
                  (await readPublicationJsonForBuild(
                    fileName,
                    await readTargetJsonForBuild(targetRoot, fileName, null)
                  )) ?? []
                ),
              }))
          )
        : [];

    results.push({
      targetRoot,
      scenarioProfilePath: path.join(targetRoot, "scenario-profile.json"),
      scenarioProfileContent: formatJson(sourceScenarioProfile),
      charactersPath: targetCharactersPath,
      charactersContent: formatJson(nextCharacters),
      textEntriesPath: path.join(targetRoot, "text-entries.json"),
      textEntriesContent: formatJson(
        projectTextEntriesForSync(
          sourceTextEntries,
          (await readTargetJsonForBuild(
            targetRoot,
            "text-entries.json",
            sourceTextEntries
          )) ?? sourceTextEntries
        )
      ),
      activitiesPath: path.join(targetRoot, "activities.json"),
      activitiesContent: formatJson(
        projectActivitiesForSync(
          sourceActivities,
          (await readTargetJsonForBuild(
            targetRoot,
            "activities.json",
            sourceActivities
          )) ?? sourceActivities
        )
      ),
      citiesPath: nextCities == null ? null : path.join(targetRoot, "cities.json"),
      citiesContent: nextCities == null ? null : formatJson(nextCities),
      mapsPath: nextMaps == null ? null : path.join(targetRoot, "maps.json"),
      mapsContent: nextMaps == null ? null : formatJson(nextMaps),
      eventsPath: nextEvents == null ? null : path.join(targetRoot, "events.json"),
      eventsContent: nextEvents == null ? null : formatJson(nextEvents),
      packManifestPath: path.join(targetRoot, "pack.json"),
      packManifestContent: formatJson(nextPackManifest),
      cityEntriesPath:
        nextCityEntries == null ? null : path.join(targetRoot, "city-entries.json"),
      cityEntriesContent:
        nextCityEntries == null ? null : formatJson(nextCityEntries),
      housesPath: nextHouses == null ? null : path.join(targetRoot, "houses.json"),
      housesContent: nextHouses == null ? null : formatJson(nextHouses),
      supplementalPublicFiles,
      publicPlayableShellsPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "playable-shells.json")
          : null,
      publicPlayableShellsContent:
        targetRoot.includes("/public/")
          ? formatJson(canonicalPlayableFamily.playableShells)
          : null,
      publicPlayablesPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "playables.json")
          : null,
      publicPlayablesContent:
        targetRoot.includes("/public/")
          ? formatJson(canonicalPlayableFamily.playables)
          : null,
      publicPlayableIntegrationsPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "playable-integrations.json")
          : null,
      publicPlayableIntegrationsContent:
        targetRoot.includes("/public/")
          ? formatJson(
              projectPublicPlayableIntegrationsForSync(
                canonicalPlayableFamily.playableIntegrations
              )
            )
          : null,
      publicDialoguesPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "dialogues.json")
          : null,
      publicDialoguesContent:
        targetRoot.includes("/public/")
          ? formatJson(
              projectPublicDialoguesForSync(
                canonicalRuntimeBuildingSupport.dialogues
              )
            )
          : null,
      publicEventsPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "events.json")
          : null,
      publicEventsContent:
        targetRoot.includes("/public/")
          ? formatJson(projectPublicEventsForSync(canonicalRuntimeEvents))
          : null,
      publicEventBindingsPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "event-bindings.json")
          : null,
      publicEventBindingsContent:
        targetRoot.includes("/public/")
          ? formatJson(
              projectPublicEventBindingsForSync(
                canonicalRuntimeBuildingSupport.eventBindings
              )
            )
          : null,
      publicMenuResourcesPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "menu-resources.json")
          : null,
      publicMenuResourcesContent:
        targetRoot.includes("/public/")
          ? formatJson(
              projectPublicMenuResourcesForSync(
                canonicalRuntimeBuildingSupport.menuResources
              )
            )
          : null,
      publicHouseModuleDefaultsPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "house-module-defaults.json")
          : null,
      publicHouseModuleDefaultsContent:
        targetRoot.includes("/public/")
          ? formatJson(
              projectPublicHouseModuleDefaultsForSync(
                canonicalRuntimeBuildingSupport.houseModuleDefaults
              )
            )
          : null,
      publicSettlementsPath:
        targetRoot.includes("/public/")
          ? path.join(targetRoot, "settlements.json")
          : null,
      publicSettlementsContent:
        targetRoot.includes("/public/")
          ? formatJson(canonicalRuntimeBuildingSupport.settlements)
          : null,
      runtimePlayablesPath:
        targetRoot === runtimeRoot ? path.join(targetRoot, "playables.json") : null,
      runtimePlayablesContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalPlayableFamily.playables)
          : null,
      runtimePlayableIntegrationsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "playable-integrations.json")
          : null,
      runtimePlayableIntegrationsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalPlayableFamily.playableIntegrations)
          : null,
      runtimePlayableShellsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "playable-shells.json")
          : null,
      runtimePlayableShellsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalPlayableFamily.playableShells)
          : null,
      runtimeBuildingArrangementsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "building-arrangements.json")
          : null,
      runtimeBuildingArrangementsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.buildingArrangements)
          : null,
      runtimeDialoguesPath:
        targetRoot === runtimeRoot ? path.join(targetRoot, "dialogues.json") : null,
      runtimeDialoguesContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.dialogues)
          : null,
      runtimeEventBindingsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "event-bindings.json")
          : null,
      runtimeEventBindingsContent:
        targetRoot === runtimeRoot
          ? formatJson(
              projectRuntimeEventBindingsForSync(
                canonicalRuntimeBuildingSupport.eventBindings,
                runtimeProjectedEvents
              )
            )
          : null,
      runtimeHouseModuleDefaultsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "house-module-defaults.json")
          : null,
      runtimeHouseModuleDefaultsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.houseModuleDefaults)
          : null,
      runtimeLocationAccessPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "location-access.json")
          : null,
      runtimeLocationAccessContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.locationAccess)
          : null,
      runtimeMenuInstancesPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "menu-instances.json")
          : null,
      runtimeMenuInstancesContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.menuInstances)
          : null,
      runtimeMenuResourcesPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "menu-resources.json")
          : null,
      runtimeMenuResourcesContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.menuResources)
          : null,
      runtimeSettlementsPath:
        targetRoot === runtimeRoot
          ? path.join(targetRoot, "settlements.json")
          : null,
      runtimeSettlementsContent:
        targetRoot === runtimeRoot
          ? formatJson(canonicalRuntimeBuildingSupport.settlements)
          : null,
      runtimeEventsPath:
        targetRoot === runtimeRoot ? path.join(targetRoot, "events.json") : null,
      runtimeEventsContent:
        targetRoot === runtimeRoot
          ? formatJson(runtimeProjectedEvents)
          : null,
    });
  }

  if (sourceRoot === runtimeRoot) {
    results.push({
      targetRoot: runtimeRoot,
      scenarioProfilePath: null,
      scenarioProfileContent: null,
      charactersPath: null,
      charactersContent: null,
      textEntriesPath: null,
      textEntriesContent: null,
      activitiesPath: null,
      activitiesContent: null,
      packManifestPath: path.join(runtimeRoot, "pack.json"),
      packManifestContent: formatJson(
        projectRuntimePackManifestForSync(
          canonicalRuntimeMirrorManifestSource,
          await readJson(path.join(runtimeRoot, "pack.json"))
        )
      ),
      publicFlowPlayablesPath: null,
      publicFlowPlayablesContent: null,
      runtimePlayablesPath: path.join(runtimeRoot, "playables.json"),
      runtimePlayablesContent: formatJson(canonicalPlayableFamily.playables),
      runtimePlayableIntegrationsPath: path.join(
        runtimeRoot,
        "playable-integrations.json"
      ),
      runtimePlayableIntegrationsContent: formatJson(
        canonicalPlayableFamily.playableIntegrations
      ),
      runtimePlayableShellsPath: path.join(runtimeRoot, "playable-shells.json"),
      runtimePlayableShellsContent: formatJson(
        canonicalPlayableFamily.playableShells
      ),
      runtimeBuildingArrangementsPath: path.join(
        runtimeRoot,
        "building-arrangements.json"
      ),
      runtimeBuildingArrangementsContent: formatJson(
        canonicalRuntimeBuildingSupport.buildingArrangements
      ),
      runtimeDialoguesPath: path.join(runtimeRoot, "dialogues.json"),
      runtimeDialoguesContent: formatJson(canonicalRuntimeBuildingSupport.dialogues),
      runtimeEventBindingsPath: path.join(runtimeRoot, "event-bindings.json"),
      runtimeEventBindingsContent: formatJson(
        projectRuntimeEventBindingsForSync(
          canonicalRuntimeBuildingSupport.eventBindings,
          projectRuntimeEventsForSync(
            canonicalRuntimeEvents,
            await readJson(path.join(runtimeRoot, "events.json"))
          )
        )
      ),
      runtimeHouseModuleDefaultsPath: path.join(
        runtimeRoot,
        "house-module-defaults.json"
      ),
      runtimeHouseModuleDefaultsContent: formatJson(
        canonicalRuntimeBuildingSupport.houseModuleDefaults
      ),
      runtimeLocationAccessPath: path.join(runtimeRoot, "location-access.json"),
      runtimeLocationAccessContent: formatJson(
        canonicalRuntimeBuildingSupport.locationAccess
      ),
      runtimeMenuInstancesPath: path.join(runtimeRoot, "menu-instances.json"),
      runtimeMenuInstancesContent: formatJson(
        canonicalRuntimeBuildingSupport.menuInstances
      ),
      runtimeMenuResourcesPath: path.join(runtimeRoot, "menu-resources.json"),
      runtimeMenuResourcesContent: formatJson(
        canonicalRuntimeBuildingSupport.menuResources
      ),
      runtimeSettlementsPath: path.join(runtimeRoot, "settlements.json"),
      runtimeSettlementsContent: formatJson(
        canonicalRuntimeBuildingSupport.settlements
      ),
      runtimeEventsPath: path.join(runtimeRoot, "events.json"),
      runtimeEventsContent: formatJson(
        projectRuntimeEventsForSync(
          canonicalRuntimeEvents,
          await readJson(path.join(runtimeRoot, "events.json"))
        )
      ),
    });
  }

  return results;
}

function areJsonValuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function areBinaryValuesEqual(left, right) {
  if (!Buffer.isBuffer(left) || !Buffer.isBuffer(right)) {
    return false;
  }
  return left.equals(right);
}

async function main() {
  const checkMode = process.argv.includes("--check");
  const writeMode = !checkMode || process.argv.includes("--write");
  const sourceArg = process.argv.find((arg) => arg.startsWith("--source="));
  const source =
    sourceArg?.slice("--source=".length) ?? "script-editor-template-pack";
  const updates = [];
  const { sourceRoot, targetRoots } = resolveZhuyuanzhangSyncDirection(
    repoRoot,
    source
  );
  const targets = await buildTargetContents(sourceRoot, targetRoots);
  const supportedFileNames = new Set(
    SHARED_SYNC_FILE_RULES.map((rule) => rule.fileName)
  );
  const publicationFileNames = new Set(
    PUBLICATION_SYNC_FILE_RULES.map((rule) => rule.fileName)
  );
  const runtimeMirrorFileNames = new Set([
    ...PLAYABLE_FAMILY_FILE_NAMES,
    ...RUNTIME_BUILDING_SUPPORT_FILE_NAMES,
    "events.json",
  ]);

  for (const target of targets) {
    for (const file of [
      {
        fileName: "scenario-profile.json",
        filePath: target.scenarioProfilePath,
        content: target.scenarioProfileContent,
      },
      {
        fileName: "characters.json",
        filePath: target.charactersPath,
        content: target.charactersContent,
      },
      {
        fileName: "text-entries.json",
        filePath: target.textEntriesPath,
        content: target.textEntriesContent,
      },
      {
        fileName: "activities.json",
        filePath: target.activitiesPath,
        content: target.activitiesContent,
      },
      {
        fileName: "cities.json",
        filePath: target.citiesPath,
        content: target.citiesContent,
      },
      {
        fileName: "maps.json",
        filePath: target.mapsPath,
        content: target.mapsContent,
      },
      {
        fileName: "events.json",
        filePath: target.eventsPath,
        content: target.eventsContent,
      },
      {
        fileName: "pack.json",
        filePath: target.packManifestPath,
        content: target.packManifestContent,
      },
      {
        fileName: "city-entries.json",
        filePath: target.cityEntriesPath,
        content: target.cityEntriesContent,
      },
      {
        fileName: "houses.json",
        filePath: target.housesPath,
        content: target.housesContent,
      },
      {
        fileName: "playables.json",
        filePath: target.publicPlayablesPath,
        content: target.publicPlayablesContent,
      },
      {
        fileName: "playable-integrations.json",
        filePath: target.publicPlayableIntegrationsPath,
        content: target.publicPlayableIntegrationsContent,
      },
      {
        fileName: "playable-shells.json",
        filePath: target.publicPlayableShellsPath,
        content: target.publicPlayableShellsContent,
      },
      {
        fileName: "settlements.json",
        filePath: target.publicSettlementsPath,
        content: target.publicSettlementsContent,
      },
      {
        fileName: "dialogues.json",
        filePath: target.publicDialoguesPath,
        content: target.publicDialoguesContent,
      },
      {
        fileName: "events.json",
        filePath: target.publicEventsPath,
        content: target.publicEventsContent,
      },
      {
        fileName: "event-bindings.json",
        filePath: target.publicEventBindingsPath,
        content: target.publicEventBindingsContent,
      },
      {
        fileName: "menu-resources.json",
        filePath: target.publicMenuResourcesPath,
        content: target.publicMenuResourcesContent,
      },
      {
        fileName: "house-module-defaults.json",
        filePath: target.publicHouseModuleDefaultsPath,
        content: target.publicHouseModuleDefaultsContent,
      },
      {
        fileName: "playables.json",
        filePath: target.runtimePlayablesPath,
        content: target.runtimePlayablesContent,
      },
      {
        fileName: "playable-integrations.json",
        filePath: target.runtimePlayableIntegrationsPath,
        content: target.runtimePlayableIntegrationsContent,
      },
      {
        fileName: "playable-shells.json",
        filePath: target.runtimePlayableShellsPath,
        content: target.runtimePlayableShellsContent,
      },
      {
        fileName: "building-arrangements.json",
        filePath: target.runtimeBuildingArrangementsPath,
        content: target.runtimeBuildingArrangementsContent,
      },
      {
        fileName: "dialogues.json",
        filePath: target.runtimeDialoguesPath,
        content: target.runtimeDialoguesContent,
      },
      {
        fileName: "event-bindings.json",
        filePath: target.runtimeEventBindingsPath,
        content: target.runtimeEventBindingsContent,
      },
      {
        fileName: "house-module-defaults.json",
        filePath: target.runtimeHouseModuleDefaultsPath,
        content: target.runtimeHouseModuleDefaultsContent,
      },
      {
        fileName: "location-access.json",
        filePath: target.runtimeLocationAccessPath,
        content: target.runtimeLocationAccessContent,
      },
      {
        fileName: "menu-instances.json",
        filePath: target.runtimeMenuInstancesPath,
        content: target.runtimeMenuInstancesContent,
      },
      {
        fileName: "menu-resources.json",
        filePath: target.runtimeMenuResourcesPath,
        content: target.runtimeMenuResourcesContent,
      },
      {
        fileName: "settlements.json",
        filePath: target.runtimeSettlementsPath,
        content: target.runtimeSettlementsContent,
      },
      {
        fileName: "events.json",
        filePath: target.runtimeEventsPath,
        content: target.runtimeEventsContent,
      },
      ...(Array.isArray(target.supplementalPublicFiles)
        ? target.supplementalPublicFiles
        : []),
    ]) {
      if (
        typeof file.filePath !== "string" ||
        typeof file.content !== "string"
      ) {
        continue;
      }
      if (
        target.targetRoot.includes("/public/") &&
        (publicationFileNames.has(file.fileName) ||
          file.publicationManaged === true)
      ) {
        if (file.fileName === "pack.json" && source !== "script-editor-template-pack") {
          continue;
        }
        const existingValue = await readJsonIfExists(file.filePath);
        if (!areJsonValuesEqual(existingValue, JSON.parse(file.content))) {
          updates.push(file.filePath);
          if (writeMode) {
            await writeFile(file.filePath, file.content, "utf8");
          }
        }
        continue;
      }

      if (
        target.targetRoot === resolveZhuyuanzhangPackRoots(repoRoot).runtimeRoot &&
        runtimeMirrorFileNames.has(file.fileName)
      ) {
        const existingValue = await readJsonIfExists(file.filePath);
        if (!areJsonValuesEqual(existingValue, JSON.parse(file.content))) {
          updates.push(file.filePath);
          if (writeMode) {
            await writeFile(file.filePath, file.content, "utf8");
          }
        }
        continue;
      }

      if (
        target.targetRoot === resolveZhuyuanzhangPackRoots(repoRoot).runtimeRoot &&
        file.fileName === "pack.json"
      ) {
        const existingValue = await readJsonIfExists(file.filePath);
        if (!areJsonValuesEqual(existingValue, JSON.parse(file.content))) {
          updates.push(file.filePath);
          if (writeMode) {
            await writeFile(file.filePath, file.content, "utf8");
          }
        }
        continue;
      }

      if (!supportedFileNames.has(file.fileName)) {
        continue;
      }

      const existingValue = await readJsonIfExists(file.filePath);
      if (!areJsonValuesEqual(existingValue, JSON.parse(file.content))) {
        updates.push(file.filePath);
        if (writeMode) {
          await writeFile(file.filePath, file.content, "utf8");
        }
      }
    }
  }

  const { builtinTemplateRoot } = resolveZhuyuanzhangPackRoots(repoRoot);
  const registeredBuiltinTemplateAssetPublicationRoot = path.join(
    repoRoot,
    REGISTERED_BUILTIN_TEMPLATE_ASSET_PUBLICATION_ROOT
  );
  const legacyPublicTemplateRoot = path.join(
    repoRoot,
    LEGACY_PUBLIC_TEMPLATE_PUBLICATION_ROOT
  );
  for (const relativePath of REGISTERED_BUILTIN_TEMPLATE_ASSET_FILE_NAMES) {
    const sourceAssetPath = path.join(builtinTemplateRoot, relativePath);
    const targetAssetPath = path.join(
      registeredBuiltinTemplateAssetPublicationRoot,
      relativePath
    );
    const sourceBuffer = await readFile(sourceAssetPath);
    const existingBuffer = await readFileIfExists(targetAssetPath);
    if (areBinaryValuesEqual(existingBuffer, sourceBuffer)) {
      continue;
    }
    updates.push(targetAssetPath);
    if (writeMode) {
      await mkdir(path.dirname(targetAssetPath), { recursive: true });
      await writeFile(targetAssetPath, sourceBuffer);
    }
  }

  if (existsSync(legacyPublicTemplateRoot)) {
    updates.push(legacyPublicTemplateRoot);
    if (writeMode) {
      await rm(legacyPublicTemplateRoot, { recursive: true, force: true });
    }
  }

  if (updates.length === 0) {
    console.log(`Zhuyuanzhang startup template files are already aligned for source ${source}.`);
    return;
  }

  if (checkMode) {
    console.error(`Zhuyuanzhang startup template files are out of date for source ${source}:`);
    for (const update of updates) {
      console.error(`- ${path.relative(repoRoot, update)}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Updated zhuyuanzhang startup template files:");
  for (const update of updates) {
    console.log(`- ${path.relative(repoRoot, update)}`);
  }
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
