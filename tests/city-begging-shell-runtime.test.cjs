const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCharacters,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");
const {
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");

const playerCharacterId = "char.player";

function createRuntimeState(coreState) {
  return {
    core: coreState,
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: null,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

test("city-begging is registered as a canonical playable shell", () => {
  const registrySource = fs.readFileSync(
    path.join(process.cwd(), "src/core/registry/builtin-playable-shell-registry.ts"),
    "utf8"
  );

  assert.match(registrySource, /cityBeggingPlayableShell/);
  assert.match(registrySource, /city-begging/);
});

test(
  "city-begging runs through shell session state instead of app beggingMiniGameState",
  { concurrency: false },
  () => {
    const launched = runPlayableRuntime({
      state: createRuntimeState(createBaseState()),
      request: createLaunchPlayableRequest("city-begging", {
        payload: {
          now: 0,
        },
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(launched.handled, true);
    assert.equal(launched.state.app.beggingMiniGameState, null);
    assert.equal(launched.state.core.runtime.playableSession?.playableId, "city-begging");
    assert.equal(
      launched.state.core.runtime.playableSession?.state?.minigameState?.variantState?.status,
      "playing"
    );

    const pointed = runPlayableRuntime({
      state: launched.state,
      request: createPlayableActionRequest("city-begging", "pointer", {
        pointerX: 160,
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(
      pointed.state.core.runtime.playableSession?.state?.minigameState?.variantState?.pointerX,
      160
    );
    assert.equal(pointed.state.app.beggingMiniGameState, null);
  }
);

test("city-begging no longer depends on bespoke runtime-state fallback seams", () => {
  const runtimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );
  const appShellSource = fs.readFileSync(
    path.join(process.cwd(), "src/application/app-shell.ts"),
    "utf8"
  );
  const runtimeStateSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-state.ts"),
    "utf8"
  );

  assert.doesNotMatch(runtimeSource, /if \(resolvedRequest\.launch\.launch\.playableId === "city-begging"\)/);
  assert.doesNotMatch(runtimeSource, /if \(resolvedRequest\.playableId === "city-begging"\)/);
  assert.doesNotMatch(runtimeSource, /state\.app\.beggingMiniGameState/);
  assert.doesNotMatch(appShellSource, /beggingMiniGameState/);
  assert.doesNotMatch(runtimeStateSource, /beggingMiniGameState/);
});
