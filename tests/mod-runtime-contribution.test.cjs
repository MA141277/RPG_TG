const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseModManifest,
} = require("../.test-dist/core/mods/mod-parser.js");
const {
  createEmptyModRuntimeState,
  createLoadedModFromManifest,
  createLoadedModFromScenarioPack,
  runModRuntime,
} = require("../.test-dist/core/mods/mod-runtime.js");

test("parseModManifest accepts mod-first dialogue and playable contribution metadata", () => {
  const manifest = parseModManifest({
    id: "mod.test.mod-first",
    title: "Mod First",
    entryContentPackIds: ["pack.mod-first"],
    gameplayContributions: {
      dialogues: ["dialogue.opening"],
      playables: ["playable.training"],
      playableIntegrations: ["integration.training"],
    },
    defaultStart: {
      dialogueId: "dialogue.opening",
    },
  });

  assert.deepEqual(manifest.gameplayContributions.dialogues, [
    "dialogue.opening",
  ]);
  assert.deepEqual(manifest.gameplayContributions.playables, [
    "playable.training",
  ]);
  assert.deepEqual(manifest.gameplayContributions.playableIntegrations, [
    "integration.training",
  ]);
  assert.equal(manifest.defaultStart.dialogueId, "dialogue.opening");
});

test("runModRuntime installs dialogue and playable contribution registries", async () => {
  const loadedMod = createLoadedModFromManifest({
    source: { kind: "builtin", modId: "mod.test.mod-first" },
    manifest: {
      id: "mod.test.mod-first",
      schemaVersion: "1",
      version: "1.0.0",
      title: "Mod First",
      entryContentPackIds: ["pack.mod-first"],
      gameplayContributions: {
        dialogues: ["dialogue.opening"],
        playables: ["playable.training"],
        playableIntegrations: ["integration.training"],
      },
      defaultStart: {
        dialogueId: "dialogue.opening",
      },
    },
    rawContent: {
      id: "pack.mod-first",
      dialogues: [{ id: "dialogue.opening" }],
      playables: [{ id: "playable.training" }],
      playableIntegrations: [{ integrationId: "integration.training" }],
    },
  });

  const result = await runModRuntime({
    state: createEmptyModRuntimeState(),
    request: {
      type: "mod.activate-loaded",
      requestId: "test:mod-first-contributions",
      loadedMod,
    },
    context: {
      allowedCapabilities: [],
    },
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.activatedMod.gameplayContributions.dialogues, [
    "dialogue.opening",
  ]);
  assert.deepEqual(result.activatedMod.gameplayContributions.playables, [
    "playable.training",
  ]);
  assert.deepEqual(
    result.activatedMod.gameplayContributions.playableIntegrations,
    ["integration.training"]
  );
  assert.equal(
    result.activatedMod.startupProfile.dialogueId,
    "dialogue.opening"
  );
});

test("createLoadedModFromScenarioPack declares playable runtime contributions", async () => {
  const loadedMod = createLoadedModFromScenarioPack({
    source: { kind: "builtin", modId: "scenario.test.playables" },
    scenarioPack: {
      schemaVersion: 1,
      id: "scenario.test.playables",
      title: "Playable Scenario",
      scenarioProfile: {
        id: "profile.test.playables",
        title: "Playable Scenario",
        playerCharacterId: "char.player",
        chapterId: "chapter.test",
        initialLocation: {
          mapId: "map.test",
          cityId: "city.test",
          houseId: null,
          view: "city",
        },
      },
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
  });

  const result = await runModRuntime({
    state: createEmptyModRuntimeState(),
    request: {
      type: "mod.activate-loaded",
      requestId: "test:scenario-playable-contributions",
      loadedMod,
    },
    context: {
      allowedCapabilities: [],
    },
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.activatedMod.gameplayContributions.playables, [
    "playable.training",
  ]);
  assert.deepEqual(
    result.activatedMod.gameplayContributions.playableIntegrations,
    ["integration.training"]
  );
});
