import { resolveContentPackMapAssetUrls } from "../content/content-pack-loader";
import type { ScenarioPackDefinition } from "../../domain/scenario-pack";

export async function loadScenarioPackFromUrl(
  url: string
): Promise<ScenarioPackDefinition> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load scenario pack: ${response.status}`);
  }

  const rawPack = await response.json();
  if (isScenarioPackManifest(rawPack)) {
    return parseScenarioPack(await hydrateScenarioPackManifest(rawPack, url));
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
  assertString(value.scenarioProfile.initialLocation.view, "scenario initialLocation.view");
  assertArray(value.characters, "scenario characters");
  if (value.cities != null) {
    assertArray(value.cities, "scenario cities");
  }
  if (value.houses != null) {
    assertArray(value.houses, "scenario houses");
  }
  if (value.maps != null) {
    assertArray(value.maps, "scenario maps");
  }
  if (value.cityEntries != null) {
    assertArray(value.cityEntries, "scenario city entries");
  }
  assertArray(value.events, "scenario events");
  assertArray(value.scenes, "scenario scenes");

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
  if (value.houseAccessRefusalRules != null) {
    assertArray(value.houseAccessRefusalRules, "scenario house access refusal rules");
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
  if (value.textEntries != null) {
    assertObject(value.textEntries, "scenario text entries");
  }
  if (value.historicalCharacterIdByCharacterId != null) {
    assertObject(
      value.historicalCharacterIdByCharacterId,
      "scenario historical character mapping"
    );
  }

  return value as ScenarioPackDefinition;
}

type ScenarioPackManifestFiles = {
  scenarioProfile: string;
  characters: string;
  events: string;
  scenes: string;
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

  return {
    schemaVersion: manifest.schemaVersion,
    id: manifest.id,
    title: manifest.title,
    ...(manifest.description == null ? {} : { description: manifest.description }),
    ...hydratedFields,
    ...(resolvedMaps == null ? {} : { maps: resolvedMaps }),
  };
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
    typeof files.scenes === "string"
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
