import type { ScenarioPackDefinition } from "../../domain/scenario-pack";

export async function loadScenarioPackFromUrl(
  url: string
): Promise<ScenarioPackDefinition> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load scenario pack: ${response.status}`);
  }

  return parseScenarioPack(await response.json());
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
  assertArray(value.events, "scenario events");
  assertArray(value.scenes, "scenario scenes");

  if (value.activities != null) {
    assertArray(value.activities, "scenario activities");
  }

  return value as ScenarioPackDefinition;
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
