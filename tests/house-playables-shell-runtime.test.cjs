const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");
const {
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");

const playerCharacterId = "char.player";
const grainHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "grain-shop"
);
const medicineHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "medicine-house"
);

assert.ok(grainHouse, "Expected prototype grain shop to exist.");
assert.ok(medicineHouse, "Expected prototype medicine house to exist.");

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

function createBaseState(houseId) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: houseId,
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

test(
  "grain-accounting runs through playable shell settlement and generic result overlay",
  { concurrency: false },
  () => {
    const launched = runPlayableRuntime({
      state: createRuntimeState(createBaseState(grainHouse.id)),
      request: createLaunchPlayableRequest("grain-accounting", {
        integrationId: "playable.grain-accounting.house.grain-shop",
        ownerContext: {
          ownerKind: "house",
          ownerId: grainHouse.id,
          returnPolicy: "resume-owner",
        },
        payload: {
          durationSec: 1,
          maxWrongAnswers: 1,
        },
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(launched.handled, true);
    assert.equal(launched.state.core.runtime.playableSession?.playableId, "grain-accounting");

    const ticked = runPlayableRuntime({
      state: launched.state,
      request: createPlayableActionRequest("grain-accounting", "tick"),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(ticked.handled, true);
    assert.equal(ticked.state.core.runtime.playableSession, null);
    assert.equal(
      ticked.state.core.ui.houseSession?.state?.overlay?.type,
      "playable-shell-result"
    );
    assert.equal(typeof ticked.settlement?.factResult.metrics?.score, "number");
    assert.equal(
      Array.isArray(ticked.settlement?.effects),
      true
    );
  }
);

test(
  "medicine-compounding runs through playable shell action settlement and generic result overlay",
  { concurrency: false },
  () => {
    const launched = runPlayableRuntime({
      state: createRuntimeState(createBaseState(medicineHouse.id)),
      request: createLaunchPlayableRequest("medicine-compounding", {
        integrationId: "playable.medicine-compounding.house.medicine-house",
        ownerContext: {
          ownerKind: "house",
          ownerId: medicineHouse.id,
          returnPolicy: "resume-owner",
        },
        payload: {
          maxTurns: 1,
        },
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(launched.handled, true);
    const availableHerbId =
      launched.state.core.runtime.playableSession?.state?.progress?.availableHerbs?.[0]?.id;
    assert.equal(typeof availableHerbId, "string");

    const selected = runPlayableRuntime({
      state: launched.state,
      request: createPlayableActionRequest(
        "medicine-compounding",
        `select-herb:${availableHerbId}`
      ),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    });

    assert.equal(selected.handled, true);
    assert.equal(selected.state.core.runtime.playableSession, null);
    assert.equal(
      selected.state.core.ui.houseSession?.state?.overlay?.type,
      "playable-shell-result"
    );
    assert.equal(
      typeof selected.settlement?.factResult.metrics?.rewardMedicine,
      "number"
    );
  }
);

test("house playable shell path removes old host-side hardcode", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );
  const overlaySource = fs.readFileSync(
    path.join(process.cwd(), "src/ui/views/playables/house-playable-overlay.ts"),
    "utf8"
  );
  const runtimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    mainSource,
    /playableId === "grain-accounting" \|\| playableId === "medicine-compounding"/
  );
  assert.doesNotMatch(mainSource, /action === "answer-correct"/);
  assert.doesNotMatch(mainSource, /action === "answer-wrong"/);
  assert.doesNotMatch(mainSource, /action === "select-herb"/);
  assert.doesNotMatch(mainSource, /action === "clear" \|\| action === "finish"/);
  assert.doesNotMatch(overlaySource, /renderGrainAccountingBody|renderMedicineCompoundingBody/);
  assert.doesNotMatch(runtimeSource, /launchGrainAccountingPlayable|launchMedicineCompoundingPlayable/);
  assert.doesNotMatch(runtimeSource, /answerGrainAccountingPlayable|tickMedicineCompoundingPlayable/);
});
