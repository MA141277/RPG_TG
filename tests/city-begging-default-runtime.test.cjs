const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createPlayableActionRequest,
  createLaunchPlayableRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

function createRuntimeState() {
  const grainShopHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.moduleId === "grain-shop"
  );

  return {
    core: createInitialState({
      currentMapId: prototypeMap.id,
      currentCityId: "city.kulan",
      currentHouseId: grainShopHouse.id,
      playerCharacterId,
      chapterId: "chapter.prototype",
      year: 1567,
      month: 1,
      day: 1,
      pinnedCharacterId: playerCharacterId,
      reviewDateText: "test",
      mainHouseMissionText: "test",
      cards: {
        ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
        selectedCardId: prototypeCards[0]?.id ?? null,
      },
      valuables: {
        items: prototypeValuables,
        selectedItemId: prototypeValuables[0]?.id ?? null,
        equippedWeaponSet: {
          swordId:
            prototypeValuables.find(
              (valuableDefinition) => valuableDefinition.category === "weapon"
            )?.id ?? null,
          armorId:
            prototypeValuables.find(
              (valuableDefinition) => valuableDefinition.category === "armor"
            )?.id ?? null,
        },
      },
      currentView: "house",
    }),
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

test("city begging default dialogue selects a location and locks a fixed option result", async () => {
  const {
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import(
    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
  );

  const launched = createCityBeggingDefaultDialogueState(1000);
  assert.equal(launched.mode, "default-dialogue");
  assert.equal(launched.phase, "location-select");

  const atLocation = selectCityBeggingDefaultLocation(
    launched,
    "xicheng_guanyin"
  );
  assert.equal(atLocation.phase, "encounter");
  assert.equal(atLocation.selectedLocationId, "xicheng_guanyin");

  const afterOption = selectCityBeggingDefaultOption(
    atLocation,
    "help_mend_net",
    1200
  );
  assert.equal(afterOption.phase, "fortune-draw");
  assert.equal(afterOption.selectedOptionId, "help_mend_net");
  assert.equal(afterOption.fixedResult, "ji");
  assert.equal(afterOption.settlementApplied, false);
});

test("city begging default dialogue ignores invalid and duplicate option selection", async () => {
  const {
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import(
    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
  );

  const launched = createCityBeggingDefaultDialogueState(1000);
  const atLocation = selectCityBeggingDefaultLocation(
    launched,
    "xicheng_guanyin"
  );

  const afterInvalidOption = selectCityBeggingDefaultOption(
    atLocation,
    "not_a_real_option",
    1100
  );
  assert.strictEqual(afterInvalidOption, atLocation);
  assert.equal(afterInvalidOption.phase, "encounter");
  assert.equal(afterInvalidOption.selectedOptionId, null);
  assert.equal(afterInvalidOption.fixedResult, null);

  const afterOption = selectCityBeggingDefaultOption(
    atLocation,
    "help_mend_net",
    1200
  );
  assert.equal(afterOption.phase, "fortune-draw");
  assert.equal(afterOption.selectedOptionId, "help_mend_net");
  assert.equal(afterOption.fixedResult, "ji");

  const afterDuplicateOption = selectCityBeggingDefaultOption(
    afterOption,
    "help_mend_net",
    1300
  );
  assert.strictEqual(afterDuplicateOption, afterOption);

  const afterChangedOption = selectCityBeggingDefaultOption(
    afterOption,
    "honest_request",
    1400
  );
  assert.strictEqual(afterChangedOption, afterOption);
  assert.equal(afterChangedOption.selectedOptionId, "help_mend_net");
  assert.equal(afterChangedOption.fixedResult, "ji");
});

test("city begging default dialogue does not clear a locked result by reselecting location", async () => {
  const {
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import(
    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
  );

  const launched = createCityBeggingDefaultDialogueState(1000);
  const atLocation = selectCityBeggingDefaultLocation(
    launched,
    "xicheng_guanyin"
  );
  const afterOption = selectCityBeggingDefaultOption(
    atLocation,
    "help_mend_net",
    1200
  );

  const afterReselectLocation = selectCityBeggingDefaultLocation(
    afterOption,
    "dongshi_mishi"
  );

  assert.strictEqual(afterReselectLocation, afterOption);
  assert.equal(afterReselectLocation.selectedLocationId, "xicheng_guanyin");
  assert.equal(afterReselectLocation.selectedOptionId, "help_mend_net");
  assert.equal(afterReselectLocation.fixedResult, "ji");
  assert.equal(afterReselectLocation.thinkingUntil, 3600);
  assert.equal(afterReselectLocation.settlementApplied, false);
});

test("city begging launch payload can start the default dialogue mode", () => {
  const launched = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { mode: "default-dialogue", now: 1000 },
    }),
  });

  assert.equal(launched.handled, true);
  assert.equal(launched.state.app.beggingMiniGameState?.mode, "default-dialogue");
  assert.equal(
    launched.state.app.beggingMiniGameState?.phase,
    "location-select"
  );
});

test("city begging default runtime applies outcome effects once", () => {
  let characterDefinitions = prototypeCharacters;
  let runtimeState = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { mode: "default-dialogue", now: 1000 },
    }),
    characterDefinitions,
    playerCharacterId,
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "select-location", {
      locationId: "xicheng_guanyin",
    }),
    characterDefinitions,
    playerCharacterId,
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "select-option", {
      optionId: "help_mend_net",
      now: 1200,
    }),
    characterDefinitions,
    playerCharacterId,
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "confirm-fortune"),
    characterDefinitions,
    playerCharacterId,
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "tick", {
      now: 3600,
    }),
    characterDefinitions,
    playerCharacterId,
  }).state;

  const result = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "confirm-outcome"),
    characterDefinitions,
    playerCharacterId,
  });
  characterDefinitions = result.characterDefinitions ?? characterDefinitions;

  assert.equal(result.handled, true);
  assert.equal(result.session, null);
  assert.equal(result.state.app.beggingMiniGameState, null);
  assert.equal(result.state.core.runtime.playableSession, null);
  assert.equal(
    result.state.core.runtime.variables[
      "flag.city_begging.xicheng_guanyin.fisher_old_man_bonded"
    ],
    true
  );
  assert.equal(
    result.state.core.runtime.variables[
      "var.city_begging.bond.bond.city_begging.xicheng_fisher_old_man"
    ],
    2
  );

  const repeated = runPlayableRuntime({
    state: result.state,
    request: createPlayableActionRequest("city-begging", "confirm-outcome"),
    characterDefinitions,
    playerCharacterId,
  });

  assert.equal(repeated.handled, false);
  assert.equal(
    repeated.state.core.runtime.variables[
      "var.city_begging.bond.bond.city_begging.xicheng_fisher_old_man"
    ],
    2
  );
});

test("city begging default runtime ignores early outcome confirmation", () => {
  const characterDefinitions = prototypeCharacters;
  let runtimeState = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { mode: "default-dialogue", now: 1000 },
    }),
    characterDefinitions,
    playerCharacterId,
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "select-location", {
      locationId: "xicheng_guanyin",
    }),
    characterDefinitions,
    playerCharacterId,
  }).state;

  const result = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "confirm-outcome"),
    characterDefinitions,
    playerCharacterId,
  });

  assert.equal(result.handled, true);
  assert.equal(result.state.app.beggingMiniGameState?.phase, "encounter");
  assert.equal(result.session?.playableId, "city-begging");
  assert.equal(
    result.state.core.runtime.variables[
      "flag.city_begging.xicheng_guanyin.fisher_old_man_bonded"
    ],
    undefined
  );
});
