const test = require("node:test");
const assert = require("node:assert/strict");

const { createInitialState } = require("../.test-dist/application/state/create-initial-state.js");
const {
  ensureCityNpcPoolsForCurrentDay,
  pickCityNpcActivityLocation,
} = require("../.test-dist/application/city-npcs/refresh-city-npc-pools.js");
const {
  selectCityNpcSummariesForHouse,
} = require("../.test-dist/application/city-npcs/select-city-npcs-for-house.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeCityEntries,
  prototypeHistoricalCharacterIdByCharacterId,
  prototypeLeaderResidenceHistoricalCharacters,
  prototypeHouses,
  prototypeMap,
  prototypeCityNpcPools,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const { executeGrainTrade } = require("../.test-dist/application/grain-shop/grain-trade.js");
const {
  homeHouseHouseModule,
} = require("../.test-dist/application/house-modules/home-house/home-house-house-module.js");
const {
  grainShopHouseModule,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-house-module.js");
const {
  keepHouseHouseModule,
} = require("../.test-dist/application/house-modules/keep-house/keep-house-house-module.js");
const {
  marketHouseHouseModule,
} = require("../.test-dist/application/house-modules/market-house/market-house-house-module.js");
const {
  medicineHouseHouseModule,
} = require("../.test-dist/application/house-modules/medicine-house/medicine-house-house-module.js");
const {
  teaHouseHouseModule,
} = require("../.test-dist/application/house-modules/tea-house/tea-house-house-module.js");
const {
  resolveCompoundingGrade,
} = require("../.test-dist/application/medicine-house/compounding-minigame.js");
const {
  tavernHouseModule,
} = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
const {
  leaderResidenceHouseModule,
} = require("../.test-dist/application/house-modules/leader-residence/leader-residence-house-module.js");
const {
  selectLeaderResidenceOptions,
} = require("../.test-dist/application/city-entries/select-leader-residence-options.js");
const {
  createInitialGrainShopSessionState,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-session-state.js");
const {
  equipValuableItem,
  getVisibleOwnedCards,
  getVisibleValuables,
  resolveSelectedCardId,
  resolveSelectedValuableId,
} = require("../.test-dist/application/inventory/inventory-selection.js");
const {
  accountingGradeRewards,
} = require("../.test-dist/content/houses/grain-shop-content.js");
const { GRAIN_SHOP_VARIABLE_KEYS } = require("../.test-dist/domain/grain-shop.js");
const { HOME_HOUSE_VARIABLE_KEYS } = require("../.test-dist/domain/home-house.js");
const { KEEP_HOUSE_VARIABLE_KEYS } = require("../.test-dist/domain/keep-house.js");
const {
  getMedicineInventoryQuantityVariableKey,
  getPlayerFatigueVariableKey,
} = require("../.test-dist/domain/medicine-house.js");
const {
  getLeaderResidenceRelationKey,
  LEADER_RESIDENCE_VARIABLE_KEYS,
} = require("../.test-dist/domain/leader-residence.js");
const {
  pickTeaHouseAiTopic,
  resolveTeaHouseDebateRound,
} = require("../.test-dist/application/tea-house/tea-house-debate.js");

const playerCharacterId = "char.player";
const keepHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "keep-house"
);
const homeHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "home-house"
);
const grainShopHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "grain-shop"
);
const teaHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tea-house"
);
const marketHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "market-house"
);
const medicineHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "medicine-house"
);
const tavernHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tavern"
);
const leaderResidenceHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "leader-residence"
);
const leaderResidenceEntry = prototypeCityEntries.find(
  (entryDefinition) => entryDefinition.id === "city-entry.kulan.leader-residence"
);

assert.ok(homeHouse, "Expected prototype home house to exist.");
assert.ok(keepHouse, "Expected prototype keep house to exist.");
assert.ok(grainShopHouse, "Expected prototype grain shop house to exist.");
assert.ok(marketHouse, "Expected prototype market house to exist.");
assert.ok(teaHouse, "Expected prototype tea house to exist.");
assert.ok(medicineHouse, "Expected prototype medicine house to exist.");
assert.ok(tavernHouse, "Expected prototype tavern house to exist.");
assert.ok(
  leaderResidenceHouse,
  "Expected prototype leader residence house to exist."
);
assert.ok(
  leaderResidenceEntry,
  "Expected prototype leader residence city entry to exist."
);

function createBaseState() {
  return createInitialState({
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
  });
}

function createStateWithGrainVariables() {
  const state = createBaseState();
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [GRAIN_SHOP_VARIABLE_KEYS.food]: 5,
        [GRAIN_SHOP_VARIABLE_KEYS.relationship]: 0,
        [GRAIN_SHOP_VARIABLE_KEYS.time]: 1,
        [GRAIN_SHOP_VARIABLE_KEYS.grainPrice]: 100,
      },
    },
  };
}

function getPlayerCharacter(characterDefinitions) {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerCharacter);
  return playerCharacter;
}

test("grain trade succeeds for a valid buy and advances runtime state", () => {
  const state = createStateWithGrainVariables();
  const result = executeGrainTrade(
    state,
    prototypeCharacters,
    playerCharacterId,
    "buy",
    1,
    100
  );

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const playerCharacter = getPlayerCharacter(result.mutation.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 20);
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.food], 6);
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 2);
});

test("leader residence selector only lists eligible historical visitors in the city", () => {
  const state = createBaseState();
  const options = selectLeaderResidenceOptions(
    state,
    prototypeCharacters,
    leaderResidenceEntry,
    {
      historicalCharacters: prototypeLeaderResidenceHistoricalCharacters,
      historicalCharacterIdByCharacterId: prototypeHistoricalCharacterIdByCharacterId,
    }
  );

  assert.equal(options.length > 0, true);
  assert.equal(
    options.every((option) => {
      const historicalCharacterId =
        prototypeHistoricalCharacterIdByCharacterId[option.characterId];
      if (historicalCharacterId == null) {
        return false;
      }
      const historicalCharacter = prototypeLeaderResidenceHistoricalCharacters.find(
        (characterRecord) => characterRecord.id === historicalCharacterId
      );
      return historicalCharacter?.leaderResidenceProfile?.eligible === true;
    }),
    true
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_lord"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_tea_boss"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_grain_shopkeeper"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_merchant"),
    false
  );

  const liuBowenOption = options.find(
    (option) => option.characterId === "char.kulan_liu_bowen"
  );
  assert.ok(liuBowenOption);
  assert.equal(liuBowenOption.tags.length > 0, true);
});

test("leader residence enter requires a selected character id in runtime variables", () => {
  const state = createBaseState();

  assert.throws(() => {
    leaderResidenceHouseModule.enter({
      gameState: state,
      characterDefinitions: prototypeCharacters,
      houseDefinition: leaderResidenceHouse,
      playerCharacterId,
    });
  }, /pending selected character id/i);
});

test("leader residence interaction flow updates relation and learning skill", () => {
  const selectedCharacterId = "char.kulan_liu_bowen";
  const relationKey = getLeaderResidenceRelationKey(selectedCharacterId);
  const state = {
    ...createBaseState(),
    runtime: {
      ...createBaseState().runtime,
      variables: {
        ...createBaseState().runtime.variables,
        [LEADER_RESIDENCE_VARIABLE_KEYS.pendingCharacterId]: selectedCharacterId,
      },
    },
  };
  const playerBefore = getPlayerCharacter(prototypeCharacters);
  const originalMilitarySkill = playerBefore.skills.military;

  const enterResult = leaderResidenceHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
  });

  assert.equal(
    enterResult.sessionState?.selectedCharacterId,
    selectedCharacterId
  );

  const greetingResult = leaderResidenceHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "leader-residence:greeting" },
  });
  assert.equal(greetingResult.gameState.runtime.variables[relationKey], 1);

  const giftResult = leaderResidenceHouseModule.dispatch({
    gameState: greetingResult.gameState,
    characterDefinitions: greetingResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: greetingResult.sessionState,
    request: { type: "action", actionId: "leader-residence:gift" },
  });
  assert.equal(giftResult.gameState.runtime.variables[relationKey], 3);
  assert.equal(giftResult.sessionState?.overlay?.type, "alert");

  const learnResult = leaderResidenceHouseModule.dispatch({
    gameState: giftResult.gameState,
    characterDefinitions: giftResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: giftResult.sessionState,
    request: { type: "action", actionId: "leader-residence:learn" },
  });
  const playerAfter = getPlayerCharacter(learnResult.characterDefinitions);

  assert.equal(playerAfter.skills.military, originalMilitarySkill + 1);
  assert.equal(learnResult.sessionState?.mode, "learning");
  assert.equal(learnResult.sessionState?.overlay?.type, "alert");
});

test("grain trade fails when the player cannot afford the purchase", () => {
  const state = createStateWithGrainVariables();
  const result = executeGrainTrade(
    state,
    prototypeCharacters,
    playerCharacterId,
    "buy",
    2,
    1000
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.errorTitle.length > 0, true);
  assert.equal(result.errorMessage.length > 0, true);
});

test("house enter and leave keep session wiring and interval side effects consistent", () => {
  const state = createBaseState();
  const enterResult = grainShopHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
  assert.equal(enterResult.gameState.runtime.cityMarkets["city.kulan"] != null, true);
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["grain-shop"] != null,
    true
  );
  assert.deepEqual(enterResult.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);

  const leaveResult = grainShopHouseModule.leave({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(leaveResult.sessionState, null);
  assert.deepEqual(leaveResult.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("keep house starts review meeting at countdown zero and resets to 60 after assignment", () => {
  const state = createBaseState();
  const enterResult = keepHouseHouseModule.enter({
    gameState: {
      ...state,
      runtime: {
        ...state.runtime,
        variables: {
          ...state.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.mode, "meeting");
  assert.equal(enterResult.sessionState?.meetingStage, "intro");

  const contributionResult = keepHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(contributionResult.sessionState?.meetingStage, "contribution");
  assert.equal(contributionResult.sessionState?.overlay?.type, "alert");

  const praiseResult = keepHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-alert" },
  });
  assert.equal(praiseResult.sessionState?.meetingStage, "praise");

  const strategyResult = keepHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(strategyResult.sessionState?.meetingStage, "strategy");

  const assignTaskResult = keepHouseHouseModule.dispatch({
    gameState: strategyResult.gameState,
    characterDefinitions: strategyResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: strategyResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(assignTaskResult.sessionState?.meetingStage, "assign-task");

  const assignedResult = keepHouseHouseModule.dispatch({
    gameState: assignTaskResult.gameState,
    characterDefinitions: assignTaskResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: assignTaskResult.sessionState,
    request: { type: "action", actionId: "assign-keep-task:grain-procurement" },
  });

  assert.equal(
    assignedResult.gameState.missions.activeMissionId,
    "mission.keep.grain-procurement"
  );
  assert.equal(assignedResult.gameState.ui.mainHouseMissionText, "采办军粮");
  assert.equal(
    assignedResult.gameState.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    60
  );
  assert.equal(assignedResult.gameState.world.schedule.councilDate.day, 1);
  assert.equal(assignedResult.gameState.world.schedule.councilDate.month, 3);
  assert.equal(assignedResult.sessionState?.overlay?.type, "alert");
});

test("home house rest-one-day advances date, restores hp and fatigue, and resets morning", () => {
  const enterResult = homeHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
  });

  const preparedCharacters = enterResult.characterDefinitions.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stamina: 40,
        }
  );
  const preparedState = {
    ...enterResult.gameState,
    world: {
      ...enterResult.gameState.world,
      timeOfDay: "night",
      schedule: {
        councilDate: {
          year: 1567,
          month: 1,
          day: 10,
        },
      },
    },
    runtime: {
      ...enterResult.gameState.runtime,
      variables: {
        ...enterResult.gameState.runtime.variables,
        [HOME_HOUSE_VARIABLE_KEYS.hp]: 50,
        [HOME_HOUSE_VARIABLE_KEYS.maxHp]: 100,
        [HOME_HOUSE_VARIABLE_KEYS.fatigue]: 40,
        [HOME_HOUSE_VARIABLE_KEYS.maxFatigue]: 100,
      },
    },
  };

  const restResult = homeHouseHouseModule.dispatch({
    gameState: preparedState,
    characterDefinitions: preparedCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "rest-one-day",
    },
  });

  const playerCharacter = getPlayerCharacter(restResult.characterDefinitions);
  assert.equal(restResult.gameState.calendar.day, 2);
  assert.equal(restResult.gameState.world.timeOfDay, "morning");
  assert.equal(restResult.gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.hp] > 50, true);
  assert.equal(restResult.gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.fatigue] > 40, true);
  assert.equal(playerCharacter.stamina > 40, true);
  assert.equal(restResult.sessionState?.overlay?.type, "alert");
});

test("home house rest-until-council stops at configured council date", () => {
  const enterResult = homeHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
  });
  const preparedState = {
    ...enterResult.gameState,
    world: {
      ...enterResult.gameState.world,
      schedule: {
        councilDate: {
          year: 1567,
          month: 1,
          day: 3,
        },
      },
    },
  };

  const restResult = homeHouseHouseModule.dispatch({
    gameState: preparedState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: homeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "rest-until-council",
    },
  });

  assert.equal(restResult.gameState.calendar.day, 3);
  assert.equal(restResult.gameState.ui.reviewDateText, "今日评定");
  assert.equal(restResult.sessionState?.overlay?.type, "alert");
  if (restResult.sessionState?.overlay?.type !== "alert") {
    return;
  }

  assert.equal(
    restResult.sessionState.overlay.paragraphs.some((paragraph) => paragraph.includes("评定")),
    true
  );
});

test("grain shop trade overlay reads buy and sell price from unified city market", () => {
  const enterResult = grainShopHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
  });

  const openBuy = grainShopHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "buy" },
  });
  const openSell = grainShopHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "sell" },
  });

  assert.equal(openBuy.sessionState?.overlay?.type, "trade");
  assert.equal(openSell.sessionState?.overlay?.type, "trade");
  if (openBuy.sessionState?.overlay?.type !== "trade") {
    return;
  }
  if (openSell.sessionState?.overlay?.type !== "trade") {
    return;
  }

  assert.equal(openBuy.sessionState.overlay.mode, "buy");
  assert.equal(openSell.sessionState.overlay.mode, "sell");
  assert.equal(
    openBuy.sessionState.overlay.grainPrice >= openSell.sessionState.overlay.grainPrice,
    true
  );
});

test("market house enters through module registry and ensures unified city shop data", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
  assert.equal(enterResult.gameState.runtime.cityMarkets["city.kulan"] != null, true);
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["grain-shop"] != null,
    true
  );
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["silk-shop"] != null,
    true
  );

  const viewModel = marketHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(viewModel.moduleId, "market-house");
  assert.equal(viewModel.sceneTitle, "货栈");
  assert.equal(viewModel.sceneTitle.length > 0, true);
});

test("market house inventory excludes grain and horse goods", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "buy-goods",
    },
  });

  const overlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
  });

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  assert.equal(
    overlayViewModel.overlay.rows.some(
      (row) => row.categoryLabel === "粮食" || row.categoryLabel === "马匹"
    ),
    false
  );
});

test("market house follows greeting open idle rhythm with fixed boss and guest roster", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.selectedActorId, "shopkeeper_qian");
  assert.equal(enterResult.sessionState?.guestActorIds.length >= 1, true);

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");
  assert.equal(openResult.sessionState?.dialogueLines[0].includes("钱掌柜"), true);

  const idleResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "dismiss-dialogue",
    },
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");

  const idleViewModel = marketHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.standbyRoster.length >= 2, true);
  assert.equal(idleViewModel.actionContainer, null);
});

test("market house can open trade overlay and execute buy flow", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const wealthyCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 5000,
          },
        }
  );
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: wealthyCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "buy-goods",
    },
  });

  assert.equal(overlayResult.sessionState?.overlay?.type, "market-trade");
  if (overlayResult.sessionState?.overlay?.type !== "market-trade") {
    return;
  }

  const goodsId = overlayResult.sessionState.overlay.selectedGoodsId;
  assert.equal(typeof goodsId, "string");

  const overlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
  });

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }
  assert.equal(overlayViewModel.overlay.rows.length > 0, true);

  const buyResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-trade",
    },
  });

  assert.equal(buyResult.sessionState?.overlay?.type, "alert");
  const playerCharacter = getPlayerCharacter(buyResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold < 5000, true);
  assert.equal(
    buyResult.gameState.runtime.variables[`var.trade_inventory.${goodsId}`] > 0,
    true
  );
});

test("minigame tick settles into result overlay and applies grade reward", () => {
  const state = createStateWithGrainVariables();
  const sessionState = {
    ...createInitialGrainShopSessionState("greeting", "default"),
    overlay: {
      type: "minigame",
      score: 14,
      wrongCount: 0,
      secondsLeft: 1,
      question: {
        bought: 10,
        sold: 4,
        displayedStock: 6,
        isLedgerCorrect: true,
      },
    },
  };

  const result = grainShopHouseModule.dispatch({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState,
    request: {
      type: "tick",
      tickId: "grain-shop-accounting",
    },
  });

  assert.equal(result.sessionState?.overlay?.type, "result");
  if (result.sessionState?.overlay?.type !== "result") {
    return;
  }

  const reward = accountingGradeRewards.A;
  const playerCharacter = getPlayerCharacter(result.characterDefinitions);
  assert.equal(result.sessionState.overlay.grade, "A");
  assert.equal(playerCharacter.stats.gold, 120 + reward.money);
  assert.equal(playerCharacter.skills.arithmetic, 1 + reward.math);
  assert.equal(
    result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.relationship],
    reward.relationship
  );
  assert.equal(result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 2);
  assert.deepEqual(result.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("inventory filtering and equip logic preserve valid selection", () => {
  const visibleBattleCards = getVisibleOwnedCards(
    prototypeCards,
    {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[2]?.id ?? null,
    },
    "battle"
  );
  assert.equal(
    resolveSelectedCardId(visibleBattleCards, prototypeCards[2]?.id ?? null),
    prototypeCards[2]?.id ?? null
  );

  const visibleSecretCards = getVisibleOwnedCards(
    prototypeCards,
    {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[2]?.id ?? null,
    },
    "secret-technique"
  );
  assert.equal(
    resolveSelectedCardId(visibleSecretCards, prototypeCards[2]?.id ?? null),
    prototypeCards[1]?.id ?? null
  );

  const visibleEquipment = getVisibleValuables(prototypeValuables, "equipment");
  assert.equal(
    resolveSelectedValuableId(visibleEquipment, prototypeValuables[1]?.id ?? null),
    prototypeValuables[1]?.id ?? null
  );

  const equippedInventory = equipValuableItem(
    {
      items: prototypeValuables,
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
    prototypeValuables[0].id
  );
  assert.equal(equippedInventory.selectedItemId, prototypeValuables[0].id);
  assert.equal(equippedInventory.equippedWeaponSet.swordId, prototypeValuables[0].id);
  assert.equal(equippedInventory.equippedWeaponSet.armorId, null);
});

test("city npc daily refresh picks weighted locations and stays stable within the same day", () => {
  const residentDefinition = prototypeCityNpcPools[0].residents[0];
  assert.equal(
    pickCityNpcActivityLocation(
      {
        ...residentDefinition,
        activityWeight: { market: 60, tavern: 40 },
      },
      () => 0.1
    ),
    "market"
  );
  assert.equal(
    pickCityNpcActivityLocation(
      {
        ...residentDefinition,
        activityWeight: { market: 60, tavern: 40 },
      },
      () => 0.9
    ),
    "tavern"
  );

  const refreshedState = ensureCityNpcPoolsForCurrentDay(
    createBaseState(),
    prototypeCityNpcPools,
    () => 0.1
  );
  const stableState = ensureCityNpcPoolsForCurrentDay(
    refreshedState,
    prototypeCityNpcPools,
    () => 0.9
  );

  assert.equal(stableState, refreshedState);
  assert.equal(
    refreshedState.runtime.cityNpcPools["city.kulan"].lastRefreshedOn,
    "1567-01-01"
  );
});

test("house city npc selector reads from shared city pool instead of fixed house ownership", () => {
  const state = createBaseState();
  const marketHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.market"
  );

  assert.ok(marketHouse);

  const stateWithNpcPool = {
    ...state,
    runtime: {
      ...state.runtime,
      cityNpcPools: {
        "city.kulan": {
          cityId: "city.kulan",
          lastRefreshedOn: "1567-01-01",
          residents: {
            "city-npc.kulan.merchant_zhou": {
              npcId: "city-npc.kulan.merchant_zhou",
              favorability: 0,
              currentLocationId: "market",
            },
            "city-npc.kulan.scholar_he": {
              npcId: "city-npc.kulan.scholar_he",
              favorability: 0,
              currentLocationId: "tea-house",
            },
          },
        },
      },
    },
  };

  const summaries = selectCityNpcSummariesForHouse(
    stateWithNpcPool,
    marketHouse,
    prototypeCityNpcPools
  );

  assert.deepEqual(summaries, [
    {
      id: "city-npc.kulan.merchant_zhou",
      name: "周掌柜",
      title: "盐商",
    },
  ]);
});

test("tea house enter samples up to two city guests plus fixed boss", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  assert.ok(enterResult.sessionState);
  assert.equal(enterResult.sessionState.guestNpcIds.length <= 2, true);
  assert.equal(enterResult.sessionState.selectedActorId, "char.kulan_tea_boss");

  const viewModel = teaHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(viewModel.moduleId, "tea-house");
  assert.equal(viewModel.dialogue?.speakerName, "柳四");
});

test("tea house follows greeting open idle rhythm like grain shop", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");

  const openResult = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");

  const idleResult = teaHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "dismiss-dialogue",
    },
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");

  const idleViewModel = teaHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.standbyRoster.length > 0, true);
  assert.equal(idleViewModel.actionContainer, null);
});

test("tea house debate resolves counters and timeout penalty", () => {
  const roundResult = resolveTeaHouseDebateRound(
    {
      round: 1,
      playerSpirit: 10,
      npcSpirit: 10,
      timeoutCount: 0,
      consecutivePlayerWins: 1,
    },
    "义",
    "利",
    true
  );

  assert.equal(roundResult.winner, "player");
  assert.equal(roundResult.nextState.playerSpirit, 9);
  assert.equal(roundResult.nextState.npcSpirit, 7);
  assert.equal(roundResult.nextState.timeoutCount, 1);
  assert.equal(roundResult.nextState.consecutivePlayerWins, 2);
});

test("tea house ai weights bias topic choice by personality", () => {
  assert.equal(pickTeaHouseAiTopic("精明", () => 0.2), "利");
  assert.equal(pickTeaHouseAiTopic("傲气", () => 0.5), "名");
});

test("tavern drink flow spends 100 gold after confirmation", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openDrink = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "order-drink" },
  });

  assert.equal(openDrink.sessionState?.overlay?.type, "drink-confirm");

  const confirmDrink = tavernHouseModule.dispatch({
    gameState: openDrink.gameState,
    characterDefinitions: openDrink.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openDrink.sessionState,
    request: { type: "action", actionId: "confirm-drink" },
  });

  const playerCharacter = getPlayerCharacter(confirmDrink.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 20);
  assert.equal(confirmDrink.sessionState?.overlay?.type, "alert");
});

test("tavern gamble flow returns wager at 1.1x placeholder payout", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openGamble = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-gamble" },
  });

  assert.equal(openGamble.sessionState?.overlay?.type, "gamble");

  const settleGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...openGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  const playerCharacter = getPlayerCharacter(settleGamble.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 130);
  assert.equal(settleGamble.sessionState?.overlay?.type, "alert");
});

test("tavern work flow completes one side offer and grants reward", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });

  const takeWork = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "take-work" },
  });

  const playerCharacter = getPlayerCharacter(takeWork.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 200);
  assert.equal(takeWork.sessionState?.availableOffers.length, 2);
});

test("medicine house greeting flow opens actions after advance", () => {
  const state = createBaseState();
  const enterResult = medicineHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");

  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");
  const viewModel = medicineHouseHouseModule.selectViewModel({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
  });

  assert.equal(viewModel.actionContainer?.actions.length, 5);
});

test("medicine house heal and buy update fatigue inventory and gold", () => {
  const state = createBaseState();
  const richCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 300,
          },
        }
      : characterDefinition
  );
  const enterResult = medicineHouseHouseModule.enter({
    gameState: {
      ...state,
      runtime: {
        ...state.runtime,
        variables: {
          ...state.runtime.variables,
          [getPlayerFatigueVariableKey()]: 40,
        },
      },
    },
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });

  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });

  const healResult = medicineHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "heal" },
  });

  assert.equal(healResult.gameState.runtime.variables[getPlayerFatigueVariableKey()], 10);

  const playerAfterHeal = getPlayerCharacter(healResult.characterDefinitions);
  assert.equal(playerAfterHeal.stats.gold, 250);

  const afterAlert = medicineHouseHouseModule.dispatch({
    gameState: healResult.gameState,
    characterDefinitions: healResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: healResult.sessionState,
    request: { type: "action", actionId: "close-alert" },
  });

  const buyOpen = medicineHouseHouseModule.dispatch({
    gameState: afterAlert.gameState,
    characterDefinitions: afterAlert.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: afterAlert.sessionState,
    request: { type: "action", actionId: "open-buy" },
  });

  assert.equal(buyOpen.sessionState?.overlay?.type, "buy");

  const buyResult = medicineHouseHouseModule.dispatch({
    gameState: buyOpen.gameState,
    characterDefinitions: buyOpen.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: buyOpen.sessionState,
    request: { type: "action", actionId: "confirm-buy" },
  });

  assert.equal(
    buyResult.gameState.runtime.variables[
      getMedicineInventoryQuantityVariableKey("medicine_heal_001")
    ],
    1
  );
});

test("medicine compounding grades targets by closeness", () => {
  const perfect = resolveCompoundingGrade(
    {
      ailmentId: "wind_cold",
      ailmentName: "风寒",
      coldRequired: 2,
      healRequired: 5,
      maxPoison: 1,
    },
    [
      { herbId: "herb_bo_he", amount: 1 },
      { herbId: "herb_xing_ren", amount: 1 },
      { herbId: "herb_dang_gui", amount: 1 },
    ],
    [
      { id: "herb_bo_he", name: "薄荷", cold: 2, heat: 0, poison: 0, heal: 1 },
      { id: "herb_xing_ren", name: "杏仁", cold: 1, heat: 0, poison: 0, heal: 2 },
      { id: "herb_dang_gui", name: "当归", cold: 0, heat: 1, poison: 0, heal: 3 },
    ]
  );

  assert.equal(perfect.grade, "S");
});
