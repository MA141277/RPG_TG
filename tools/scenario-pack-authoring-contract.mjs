export const SCENARIO_PACK_CANONICAL_FILES = {
  scenarioProfile: "./scenario-profile.json",
  characters: "./characters.json",
  cities: "./cities.json",
  houses: "./houses.json",
  maps: "./maps.json",
  cityEntries: "./city-entries.json",
  events: "./events.json",
  scenes: "./scenes.json",
  tasks: "./tasks.json",
  activities: "./activities.json",
  textEntries: "./text-entries.json",
};

export const SCENARIO_PACK_AUTHORING_TEMPLATE = "phase-3-canonical-v1";

export const SCENARIO_PACK_REQUIRED_FILE_KEYS = Object.keys(
  SCENARIO_PACK_CANONICAL_FILES
);

export function createScenarioPackManifest({ packId, title, description }) {
  return {
    schemaVersion: 1,
    kind: "scenario-pack",
    id: packId,
    title,
    authoringTemplate: SCENARIO_PACK_AUTHORING_TEMPLATE,
    ...(isNonEmptyString(description) ? { description } : {}),
    files: {
      ...SCENARIO_PACK_CANONICAL_FILES,
    },
  };
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
