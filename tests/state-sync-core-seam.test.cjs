const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  stateSyncCoreSeam,
} = require("../.test-dist/core/runtime/state-sync-core-seam.js");

test("state sync core seam module exists in source", () => {
  assert.equal(
    fs.existsSync(
      path.join(process.cwd(), "src/core/runtime/state-sync-core-seam.ts")
    ),
    true
  );
});

test("state sync core seam creates and reapplies runtime bridge state", () => {
  const appState = {
    gameState: { runtime: { flags: { ready: true } } },
    beggingMiniGameState: { status: "idle" },
    autoAdvanceState: { pending: false },
    campaignTravelState: { path: [] },
    cityDirectoryState: { selectedCityId: null },
    cityMenuState: { open: false },
    locationDialogueState: { activeDialogueId: null },
    modalState: { kind: null },
    characterDefinitions: [{ id: "hero" }],
  };

  const runtimeState = stateSyncCoreSeam.createRuntimeStateFromAppState(appState);
  assert.equal(runtimeState.core, appState.gameState);
  assert.equal(runtimeState.app.modalState, appState.modalState);

  const nextAppState = stateSyncCoreSeam.applyRuntimeStateToAppState(
    appState,
    {
      ...runtimeState,
      core: { runtime: { flags: { ready: false } } },
      app: {
        ...runtimeState.app,
        modalState: { kind: "notice" },
      },
    },
    [{ id: "updated-hero" }]
  );

  assert.deepEqual(nextAppState.gameState.runtime.flags, { ready: false });
  assert.deepEqual(nextAppState.modalState, { kind: "notice" });
  assert.deepEqual(nextAppState.characterDefinitions, [{ id: "updated-hero" }]);
});

test("state sync core seam merges runtime status patches back into app state", () => {
  const appState = {
    gameState: { runtime: { flags: { ready: true } } },
    beggingMiniGameState: null,
    autoAdvanceState: null,
    campaignTravelState: null,
    cityDirectoryState: null,
    cityMenuState: null,
    locationDialogueState: null,
    modalState: null,
    characterDefinitions: [{ id: "hero" }],
    characterStatusById: {
      hero: { statPatch: { martial: 20 } },
    },
    cityStatusById: {
      "city.test": { valuePatch: { prosperity: 10 } },
    },
    buildingStatusById: {
      "house.test": { runtimePatch: { level: 1 } },
    },
  };

  const runtimeState = stateSyncCoreSeam.createRuntimeStateFromAppState(appState);
  const nextAppState = stateSyncCoreSeam.applyRuntimeStateToAppState(
    appState,
    runtimeState,
    undefined,
    {
      hero: { skillPatch: { arithmetic: 3 } },
    },
    {
      "city.test": { valuePatch: { danger: 4 } },
    },
    {
      "house.test": { runtimePatch: { damaged: true } },
    }
  );

  assert.deepEqual(nextAppState.characterStatusById.hero, {
    statPatch: { martial: 20 },
    skillPatch: { arithmetic: 3 },
  });
  assert.deepEqual(nextAppState.cityStatusById["city.test"], {
    valuePatch: { prosperity: 10, danger: 4 },
  });
  assert.deepEqual(nextAppState.buildingStatusById["house.test"], {
    runtimePatch: { level: 1, damaged: true },
  });
});
