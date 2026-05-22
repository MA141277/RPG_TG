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
  prototypeHouses,
  prototypeMap,
  prototypeCityNpcPools,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const { executeGrainTrade } = require("../.test-dist/application/grain-shop/grain-trade.js");
const {
  grainShopHouseModule,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-house-module.js");
const {
  marketHouseHouseModule,
} = require("../.test-dist/application/house-modules/market-house/market-house-house-module.js");
const {
  teaHouseHouseModule,
} = require("../.test-dist/application/house-modules/tea-house/tea-house-house-module.js");
const {
  tavernHouseModule,
} = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
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
const {
  pickTeaHouseAiTopic,
  resolveTeaHouseDebateRound,
} = require("../.test-dist/application/tea-house/tea-house-debate.js");

const playerCharacterId = "char.player";
const grainShopHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "grain-shop"
);
const teaHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tea-house"
);
const marketHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "market-house"
);
const tavernHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tavern"
);

assert.ok(grainShopHouse, "Expected prototype grain shop house to exist.");
assert.ok(marketHouse, "Expected prototype market house to exist.");
assert.ok(teaHouse, "Expected prototype tea house to exist.");
assert.ok(tavernHouse, "Expected prototype tavern house to exist.");

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
  assert.equal(viewModel.sceneTitle.length > 0, true);
});

test("market house can switch selected shop type and expose inventory in dialogue", () => {
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

  assert.equal(openResult.sessionState?.dialoguePhase, "open");

  const switchedResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "select-market-shop:silk-shop",
    },
  });

  assert.equal(switchedResult.sessionState?.selectedShopType, "silk-shop");
  assert.equal(switchedResult.sessionState?.dialogueLines[0].includes("绸"), true);

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: switchedResult.gameState,
    characterDefinitions: switchedResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: switchedResult.sessionState,
    request: {
      type: "action",
      actionId: "inspect-shop",
    },
  });

  assert.equal(overlayResult.sessionState?.overlay?.type, "alert");
  assert.equal(overlayResult.sessionState?.overlay?.paragraphs.length > 0, true);
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
