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
    currentHouseId: "house.kulan.temple",
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "house",
  });
}

test("temple-copy-scripture is registered as a canonical playable shell", () => {
  const registrySource = fs.readFileSync(
    path.join(process.cwd(), "src/core/registry/builtin-playable-shell-registry.ts"),
    "utf8"
  );
  const definitionSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/registry/builtin-playable-definition-registry.ts"),
    "utf8"
  );
  const contractSource = fs.readFileSync(
    path.join(process.cwd(), "src/playables/temple-copy-scripture/contract.ts"),
    "utf8"
  );

  assert.match(registrySource, /templeCopyScriptureShell/);
  assert.match(definitionSource, /templeCopyScriptureShell\.manifest\.commandPrefix/);
  assert.match(contractSource, /playable\.temple-copy-scripture\./);
});

test(
  "temple-copy-scripture runs through shell session state instead of playable-runtime special cases",
  { concurrency: false },
  () => {
    const launched = runPlayableRuntime({
      state: createRuntimeState(createBaseState()),
      request: createLaunchPlayableRequest("temple-copy-scripture", {
        integrationId:
          "playable.temple-copy-scripture.instance.template.temple-copy-scripture",
        ownerContext: {
          ownerKind: "house",
          ownerId: "house.kulan.temple",
          returnPolicy: "resume-owner",
        },
        payload: {},
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(launched.handled, true);
    assert.equal(
      launched.state.core.runtime.playableSession?.playableId,
      "temple-copy-scripture"
    );
    assert.equal(
      launched.state.core.runtime.playableSession?.state?.session?.phase,
      "active"
    );
    assert.equal(
      launched.state.core.runtime.playableSession?.state?.session?.currentPromptIndex,
      0
    );

    const played = runPlayableRuntime({
      state: launched.state,
      request: createPlayableActionRequest("temple-copy-scripture", "custom", {
        actionId: "trace",
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(
      played.state.core.runtime.playableSession?.state?.session?.phase,
      "active"
    );
    assert.equal(
      played.state.core.runtime.playableSession?.state?.session?.currentPromptIndex,
      1
    );
  }
);

test("temple-copy-scripture no longer depends on bespoke playable-runtime launch/action branches", () => {
  const runtimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    runtimeSource,
    /if \(resolvedRequest\.launch\.launch\.playableId === "temple-copy-scripture"\)/
  );
  assert.doesNotMatch(
    runtimeSource,
    /if \(resolvedRequest\.playableId === "temple-copy-scripture"\)/
  );
  assert.doesNotMatch(mainSource, /playableSession\?\.playableId === "temple-copy-scripture"/);
});
