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
    advanceCityBeggingDefaultDialogue,
    advanceCityBeggingDefaultThinking,
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import(
    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
  );

  const launched = createCityBeggingDefaultDialogueState(1000);
  assert.equal(launched.mode, "default-dialogue");
  assert.equal(launched.phase, "location-select");

  const atLocationLoading = advanceCityBeggingDefaultDialogue(launched, 1100);
  assert.equal(atLocationLoading.phase, "location-options-thinking");

  const atLocationChoices = advanceCityBeggingDefaultThinking(
    atLocationLoading,
    3500
  );
  assert.equal(atLocationChoices.phase, "location-options");

  const atLocation = selectCityBeggingDefaultLocation(
    atLocationChoices,
    "xicheng_guanyin"
  );
  assert.equal(atLocation.phase, "encounter");
  assert.equal(atLocation.selectedLocationId, "xicheng_guanyin");

  const atOptionLoading = advanceCityBeggingDefaultDialogue(atLocation, 3600);
  assert.equal(atOptionLoading.phase, "option-select-thinking");

  const atOptionChoices = advanceCityBeggingDefaultThinking(
    atOptionLoading,
    6000
  );
  assert.equal(atOptionChoices.phase, "option-select");

  const afterOption = selectCityBeggingDefaultOption(
    atOptionChoices,
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
    advanceCityBeggingDefaultDialogue,
    advanceCityBeggingDefaultThinking,
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import(
    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
  );

  const launched = createCityBeggingDefaultDialogueState(1000);
  const atLocationChoices = advanceCityBeggingDefaultThinking(
    advanceCityBeggingDefaultDialogue(launched, 1100),
    3500
  );
  const atLocation = selectCityBeggingDefaultLocation(
    atLocationChoices,
    "xicheng_guanyin"
  );
  const atOptionChoices = advanceCityBeggingDefaultThinking(
    advanceCityBeggingDefaultDialogue(atLocation, 3600),
    6000
  );

  const afterInvalidOption = selectCityBeggingDefaultOption(
    atOptionChoices,
    "not_a_real_option",
    1100
  );
  assert.strictEqual(afterInvalidOption, atOptionChoices);
  assert.equal(afterInvalidOption.phase, "option-select");
  assert.equal(afterInvalidOption.selectedOptionId, null);
  assert.equal(afterInvalidOption.fixedResult, null);

  const afterOption = selectCityBeggingDefaultOption(
    atOptionChoices,
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
    advanceCityBeggingDefaultDialogue,
    advanceCityBeggingDefaultThinking,
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import(
    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
  );

  const launched = createCityBeggingDefaultDialogueState(1000);
  const atLocationChoices = advanceCityBeggingDefaultThinking(
    advanceCityBeggingDefaultDialogue(launched, 1100),
    3500
  );
  const atLocation = selectCityBeggingDefaultLocation(
    atLocationChoices,
    "xicheng_guanyin"
  );
  const atOptionChoices = advanceCityBeggingDefaultThinking(
    advanceCityBeggingDefaultDialogue(atLocation, 3600),
    6000
  );
  const afterOption = selectCityBeggingDefaultOption(
    atOptionChoices,
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

test("city begging default dialogue continues through unvisited locations only", async () => {
  const {
    advanceCityBeggingDefaultDialogue,
    advanceCityBeggingDefaultThinking,
    confirmCityBeggingDefaultFortune,
    continueCityBeggingDefaultJourney,
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import(
    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
  );

  const launched = createCityBeggingDefaultDialogueState(1000, []);
  const atLocationChoices = advanceCityBeggingDefaultThinking(
    advanceCityBeggingDefaultDialogue(launched, 1100),
    3500
  );
  const atFirstLocation = selectCityBeggingDefaultLocation(
    atLocationChoices,
    "xicheng_guanyin"
  );
  assert.deepEqual(atFirstLocation.visitedLocationIds, ["xicheng_guanyin"]);

  const atOptionChoices = advanceCityBeggingDefaultThinking(
    advanceCityBeggingDefaultDialogue(atFirstLocation, 3600),
    6000
  );
  const atFortune = selectCityBeggingDefaultOption(
    atOptionChoices,
    "help_mend_net",
    6200
  );
  const atOutcome = advanceCityBeggingDefaultThinking(
    confirmCityBeggingDefaultFortune(atFortune),
    9000
  );
  const continued = continueCityBeggingDefaultJourney(atOutcome, 9200);

  assert.equal(continued.phase, "location-options-thinking");
  assert.equal(continued.selectedLocationId, null);
  assert.equal(continued.selectedOptionId, null);
  assert.equal(continued.fixedResult, null);
  assert.deepEqual(continued.visitedLocationIds, ["xicheng_guanyin"]);

  const secondLocationChoices = advanceCityBeggingDefaultThinking(
    continued,
    12000
  );
  const rejectedRepeat = selectCityBeggingDefaultLocation(
    secondLocationChoices,
    "xicheng_guanyin"
  );
  assert.strictEqual(rejectedRepeat, secondLocationChoices);

  const acceptedSecond = selectCityBeggingDefaultLocation(
    secondLocationChoices,
    "dongshi_mishi"
  );
  assert.equal(acceptedSecond.phase, "encounter");
  assert.deepEqual(acceptedSecond.visitedLocationIds, [
    "xicheng_guanyin",
    "dongshi_mishi",
  ]);
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

test("ai begging launch uses its own playable id and default dialogue actions", () => {
  let runtimeState = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("aibegging", {
      payload: { now: 1000 },
    }),
  }).state;

  assert.equal(runtimeState.core.runtime.playableSession?.playableId, "aibegging");
  assert.equal(runtimeState.app.beggingMiniGameState?.mode, "default-dialogue");
  assert.equal(runtimeState.app.beggingMiniGameState?.phase, "location-select");

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("aibegging", "advance-dialogue", {
      now: 1200,
    }),
  }).state;

  assert.equal(
    runtimeState.app.beggingMiniGameState?.phase,
    "location-options-thinking"
  );

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("aibegging", "tick", {
      now: 3600,
    }),
  }).state;

  assert.equal(runtimeState.app.beggingMiniGameState?.phase, "location-options");
});

test("ai begging launch refuses after all default locations are completed", () => {
  const completedState = createRuntimeState();
  completedState.core.runtime.flags["flag.city_begging.default.completed"] = true;

  const launched = runPlayableRuntime({
    state: completedState,
    request: createLaunchPlayableRequest("aibegging", {
      payload: { now: 1000 },
    }),
  });

  assert.equal(launched.handled, true);
  assert.equal(launched.state.app.beggingMiniGameState, null);
  assert.equal(launched.state.core.runtime.playableSession, null);
});

test("city begging default runtime advances dialogue before showing choices", () => {
  let runtimeState = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { mode: "default-dialogue", now: 1000 },
    }),
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "advance-dialogue", {
      now: 1200,
    }),
  }).state;

  assert.equal(
    runtimeState.app.beggingMiniGameState?.phase,
    "location-options-thinking"
  );

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "tick", {
      now: 3600,
    }),
  }).state;

  assert.equal(runtimeState.app.beggingMiniGameState?.phase, "location-options");

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "select-location", {
      locationId: "xicheng_guanyin",
    }),
  }).state;

  assert.equal(runtimeState.app.beggingMiniGameState?.phase, "encounter");

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "advance-dialogue", {
      now: 3700,
    }),
  }).state;

  assert.equal(
    runtimeState.app.beggingMiniGameState?.phase,
    "option-select-thinking"
  );

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "tick", {
      now: 6100,
    }),
  }).state;

  assert.equal(runtimeState.app.beggingMiniGameState?.phase, "option-select");
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
    request: createPlayableActionRequest("city-begging", "advance-dialogue", {
      now: 1200,
    }),
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
    request: createPlayableActionRequest("city-begging", "advance-dialogue", {
      now: 3700,
    }),
    characterDefinitions,
    playerCharacterId,
  }).state;

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("city-begging", "tick", {
      now: 6100,
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

test("city begging default runtime can continue and completes after all locations", () => {
  let runtimeState = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("aibegging", {
      payload: { now: 1000 },
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  }).state;

  function advanceToLocationChoices(now) {
    runtimeState = runPlayableRuntime({
      state: runtimeState,
      request: createPlayableActionRequest("aibegging", "advance-dialogue", {
        now,
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    }).state;
    runtimeState = runPlayableRuntime({
      state: runtimeState,
      request: createPlayableActionRequest("aibegging", "tick", {
        now: now + 3000,
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    }).state;
  }

  function completeLocation(locationId, optionId, now) {
    runtimeState = runPlayableRuntime({
      state: runtimeState,
      request: createPlayableActionRequest("aibegging", "select-location", {
        locationId,
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    }).state;
    runtimeState = runPlayableRuntime({
      state: runtimeState,
      request: createPlayableActionRequest("aibegging", "advance-dialogue", {
        now: now + 100,
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    }).state;
    runtimeState = runPlayableRuntime({
      state: runtimeState,
      request: createPlayableActionRequest("aibegging", "tick", {
        now: now + 3000,
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    }).state;
    runtimeState = runPlayableRuntime({
      state: runtimeState,
      request: createPlayableActionRequest("aibegging", "select-option", {
        optionId,
        now: now + 3100,
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    }).state;
    runtimeState = runPlayableRuntime({
      state: runtimeState,
      request: createPlayableActionRequest("aibegging", "confirm-fortune"),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    }).state;
    runtimeState = runPlayableRuntime({
      state: runtimeState,
      request: createPlayableActionRequest("aibegging", "tick", {
        now: now + 6200,
      }),
      characterDefinitions: prototypeCharacters,
      playerCharacterId,
    }).state;
  }

  advanceToLocationChoices(1200);
  completeLocation("xicheng_guanyin", "honest_request", 5000);
  assert.equal(
    runtimeState.core.runtime.flags[
      "flag.city_begging.default.visited_location.xicheng_guanyin"
    ],
    true
  );

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("aibegging", "continue-journey", {
      now: 12000,
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  }).state;
  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("aibegging", "tick", {
      now: 15000,
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  }).state;
  completeLocation("dongshi_mishi", "seek_small_shop", 16000);

  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("aibegging", "continue-journey", {
      now: 23000,
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  }).state;
  runtimeState = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("aibegging", "tick", {
      now: 26000,
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  }).state;
  completeLocation("beicheng_ciji", "ask_one_bowl", 27000);

  const completed = runPlayableRuntime({
    state: runtimeState,
    request: createPlayableActionRequest("aibegging", "confirm-outcome"),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });

  assert.equal(completed.state.app.beggingMiniGameState, null);
  assert.equal(
    completed.state.core.runtime.flags["flag.city_begging.default.completed"],
    true
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
    request: createPlayableActionRequest("city-begging", "advance-dialogue", {
      now: 1200,
    }),
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
