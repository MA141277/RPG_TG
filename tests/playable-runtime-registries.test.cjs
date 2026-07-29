const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  createPlayableRuntimeRegistriesFromActivatedMod,
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
} = require("../.test-dist/core/runtime/playable-runtime-registries.js");
const {
  createLaunchPlayableRequest,
  resolvePlayableLaunchRequest,
} = require("../.test-dist/core/runtime/playable-runtime.js");

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

test("playable runtime resolves launches through the configured default runtime registries", () => {
  try {
    configureDefaultPlayableRuntimeRegistriesFromActivatedMod({
      modId: "mod.test.default-playables",
      manifest: {
        id: "mod.test.default-playables",
        schemaVersion: "1",
        version: "1.0.0",
        title: "Default Playable Test",
        entryContentPackIds: ["pack.test.default-playables"],
      },
      normalizedContentSources: [
        {
          playables: [
            {
              id: "playable.training",
              family: "minigame",
              commandPrefix: "playable.training.",
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
          ],
        },
      ],
      registeredDefinitionIds: ["pack.test.default-playables"],
      gameplayContributions: {
        contentPackIds: ["pack.test.default-playables"],
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

    const launch = resolvePlayableLaunchRequest({
      request: createLaunchPlayableRequest("playable.training"),
    });

    assert.equal(launch.ok, true);
    assert.equal(launch.launch.playableId, "playable.training");
    assert.equal(launch.launch.integrationId, "integration.training");
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});
