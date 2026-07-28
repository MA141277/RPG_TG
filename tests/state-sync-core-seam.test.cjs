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
