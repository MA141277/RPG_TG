const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  createPlayableRuntimeRegistriesFromActivatedMod,
} = require("../.test-dist/core/runtime/playable-runtime-registries.js");

test("playable runtime registries module exists in source", () => {
  assert.equal(
    fs.existsSync(
      path.join(process.cwd(), "src/core/runtime/playable-runtime-registries.ts")
    ),
    true
  );
});

test("createPlayableRuntimeRegistriesFromActivatedMod installs contributed playable definitions and integrations", () => {
  const registries = createPlayableRuntimeRegistriesFromActivatedMod({
    modId: "mod.test.playables",
    manifest: {
      id: "mod.test.playables",
      schemaVersion: "1",
      version: "1.0.0",
      title: "Playable Test",
      entryContentPackIds: ["pack.test.playables"],
    },
    normalizedContentSources: [
      {
        playables: [
          {
            id: "playable.training",
            family: "minigame",
            commandPrefix: "playable.training.",
          },
          {
            id: "playable.unlisted",
            family: "minigame",
            commandPrefix: "playable.unlisted.",
          },
        ],
        playableIntegrations: [
          {
            integrationId: "integration.training",
            playableId: "playable.training",
            ownerDefaults: {
              ownerKind: "external",
              ownerId: null,
              returnPolicy: "close-only",
            },
            trigger: {
              triggerId: "trigger.training",
              ownerKind: "external",
              trigger: "manual-launch",
            },
            outcomeConfig: {},
          },
          {
            integrationId: "integration.unlisted",
            playableId: "playable.training",
            ownerDefaults: {
              ownerKind: "external",
              ownerId: null,
              returnPolicy: "close-only",
            },
            trigger: {
              triggerId: "trigger.unlisted",
              ownerKind: "external",
              trigger: "manual-launch",
            },
            outcomeConfig: {},
          },
        ],
      },
    ],
    registeredDefinitionIds: ["pack.test.playables"],
    gameplayContributions: {
      contentPackIds: ["pack.test.playables"],
      navigation: [],
      events: [],
      scenes: [],
      dialogues: [],
      tasks: [],
      houses: [],
      houseModules: [],
      playables: ["playable.training"],
      playableIntegrations: ["integration.training"],
    },
    startupProfile: {},
  });

  assert.equal(registries.definitions.get("playable.training").id, "playable.training");
  assert.equal(registries.definitions.get("playable.unlisted"), null);
  assert.equal(registries.integrations.get("integration.training").integrationId, "integration.training");
  assert.equal(registries.integrations.get("integration.unlisted"), null);
});
