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
  createExitPlayableRequest,
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");

const playerCharacterId = "char.player";
const activityDefinition = {
  id: "activity.test.activity-qte.shell",
  label: "Activity QTE Shell",
  handlerId: "generic.qte",
  qte: {
    totalRounds: 1,
    requiredSuccesses: 1,
  },
};

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
    currentView: "dialogue",
  });
}

test("activity-qte is registered as a canonical playable shell", () => {
  const registrySource = fs.readFileSync(
    path.join(process.cwd(), "src/core/registry/builtin-playable-shell-registry.ts"),
    "utf8"
  );
  const definitionSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/registry/builtin-playable-definition-registry.ts"),
    "utf8"
  );
  const scenarioPlayablesSource = fs.readFileSync(
    path.join(process.cwd(), "src/content/scenario-packs/zhuyuanzhang/playables.json"),
    "utf8"
  );
  const templatePlayablesSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/builtin-templates/zhuyuanzhang/playables.json"
    ),
    "utf8"
  );

  assert.match(registrySource, /activityQtePlayableShell/);
  assert.doesNotMatch(definitionSource, /activityQtePlayableShell/);
  assert.match(definitionSource, /id: "activity-qte"/);
  assert.match(definitionSource, /commandPrefix: "playable\.activity-qte\."/);
  assert.match(scenarioPlayablesSource, /playable\.activity-qte\./);
  assert.match(templatePlayablesSource, /playable\.activity-qte\./);
});

test(
  "activity-qte runs through shell session state and canonical playable commands",
  { concurrency: false },
  () => {
    const launched = runPlayableRuntime({
      state: createRuntimeState(createBaseState()),
      request: createLaunchPlayableRequest("activity-qte", {
        integrationId: "playable.activity-qte.dialogue.default",
        ownerContext: {
          ownerKind: "dialogue",
          ownerId: "dialogue.test.activity-qte",
          returnPolicy: "resume-owner",
        },
        payload: {
          activityId: activityDefinition.id,
        },
      }),
      activityDefinitionsById: {
        [activityDefinition.id]: activityDefinition,
      },
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(launched.handled, true);
    assert.equal(launched.state.core.runtime.playableSession?.playableId, "activity-qte");
    assert.equal(
      launched.state.core.runtime.playableSession?.state?.activitySession?.type,
      "fortune-board"
    );

    const played = runPlayableRuntime({
      state: launched.state,
      request: createPlayableActionRequest("activity-qte", "play"),
      activityDefinitionsById: {
        [activityDefinition.id]: activityDefinition,
      },
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(
      played.state.core.runtime.playableSession?.state?.activitySession?.phase,
      "scanning"
    );

    const exited = runPlayableRuntime({
      state: played.state,
      request: createExitPlayableRequest("activity-qte"),
      activityDefinitionsById: {
        [activityDefinition.id]: activityDefinition,
      },
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(exited.handled, true);
    assert.equal(exited.state.core.runtime.playableSession, null);
    assert.equal(exited.state.core.runtime.activitySession, null);
  }
);

test("activity-qte no longer depends on interactive runtime or bespoke playable-runtime branches", () => {
  const playableRuntimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );
  const interactiveRuntimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );
  const interactiveContractSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/interactive-runtime.ts"),
    "utf8"
  );
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    playableRuntimeSource,
    /if \(resolvedRequest\.launch\.launch\.playableId === "activity-qte"\)/
  );
  assert.doesNotMatch(
    playableRuntimeSource,
    /if \(resolvedRequest\.playableId === "activity-qte"\)/
  );
  assert.doesNotMatch(interactiveRuntimeSource, /activity-qte/);
  assert.doesNotMatch(interactiveContractSource, /activity-qte/);
  assert.doesNotMatch(mainSource, /interactive\.activity-qte\./);
  assert.doesNotMatch(mainSource, /createExitInteractiveRequest\("activity-qte"\)/);
});
