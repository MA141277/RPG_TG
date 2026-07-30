const assert = require("node:assert/strict");
const test = require("node:test");

const {
  runStartupSessionCoordinator,
} = require("../.test-dist/application/startup/startup-session-coordinator.js");

function createScenarioPack() {
  return {
    schemaVersion: 1,
    id: "pack.preview",
    title: "Runtime Preview Pack",
    scenarioProfile: {
      id: "scenario.preview",
      title: "Runtime Preview Scenario",
      playerCharacterId: "char.preview",
      chapterId: "chapter.preview",
      initialLocation: {
        mapId: "map.preview",
        cityId: "city.preview",
        houseId: null,
        view: "map",
      },
      initialCalendar: {
        year: 1,
        month: 2,
        day: 3,
      },
      entryEventId: "event.preview.entry",
    },
  };
}

function createDeps(log, scenarioPack) {
  return {
    async activateBuiltinDefaultMod() {
      throw new Error("builtin startup should not run for loaded scenario pack");
    },
    async restoreModFromSave() {
      throw new Error("restore should not run for loaded scenario pack");
    },
    async activateScenarioPackMod(pack, source, requestId) {
      log.push({
        type: "activate",
        pack,
        source,
        requestId,
      });
      return {
        ok: true,
        modId: "mod.preview",
        source,
        content: {
          source: pack,
        },
      };
    },
    createPrototypeAppState() {
      throw new Error("prototype startup should not run for loaded scenario pack");
    },
    createHaozhouReturnEncounterAppState() {
      throw new Error("builtin story bootstrap should not run for loaded scenario pack");
    },
    createScenarioPackAppState(pack) {
      log.push({
        type: "create-app-state",
        pack,
      });
      return {
        sourcePackId: pack.id,
      };
    },
    createStartupContentContext(activationResult) {
      log.push({
        type: "content-context",
        activationResult,
      });
      return {
        activated: activationResult.modId,
      };
    },
    bootstrapStartupStoryAppState({ appState, bootstrap }) {
      log.push({
        type: "bootstrap",
        bootstrap,
      });
      return {
        ...appState,
        bootstrap,
      };
    },
  };
}

test("loaded scenario pack startup reuses the provided pack and source descriptor", async () => {
  const scenarioPack = createScenarioPack();
  const log = [];
  const source = {
    kind: "file",
    name: "runtime-preview",
    filePath: "runtime-preview:pack.preview",
  };
  const result = await runStartupSessionCoordinator(
    {
      type: "loaded-scenario-pack",
      scenarioPack,
      source,
    },
    createDeps(log, scenarioPack)
  );

  assert.equal(result.ok, true);
  assert.equal(result.session.playerCharacterId, "char.preview");
  assert.deepEqual(log[0], {
    type: "activate",
    pack: scenarioPack,
    source,
    requestId: "startup:file:pack.preview",
  });

  const appState = result.session.createAppState();

  assert.deepEqual(appState, {
    sourcePackId: "pack.preview",
    bootstrap: {
      eventId: "event.preview.entry",
    },
  });
  assert.deepEqual(log.slice(1), [
    {
      type: "content-context",
      activationResult: {
        ok: true,
        modId: "mod.preview",
        source,
        content: {
          source: scenarioPack,
        },
      },
    },
    {
      type: "create-app-state",
      pack: scenarioPack,
    },
    {
      type: "bootstrap",
      bootstrap: {
        eventId: "event.preview.entry",
      },
    },
  ]);
});
