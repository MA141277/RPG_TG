const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  ensureCityNpcPoolsForCurrentDay,
} = require("../.test-dist/application/city-npcs/refresh-city-npc-pools.js");
const {
  defaultRuntimeContent,
} = require("../.test-dist/application/content/default-runtime-content.js");
const {
  marketHouseHouseModule,
} = require("../.test-dist/application/house-modules/market-house/market-house-house-module.js");
const {
  getPlayerItemQuantityVariableKey,
} = require("../.test-dist/application/inventory/player-item-inventory.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeCities,
  prototypeCityNpcPools,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";
const marketHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "market-house"
);

assert.ok(marketHouse, "Expected prototype market house to exist.");

function createCityMarketHouse(cityId) {
  return {
    ...marketHouse,
    id: `${marketHouse.id}.${cityId}`,
    cityId,
  };
}

function createBaseState(cityId) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: cityId,
    currentHouseId: `${marketHouse.id}.${cityId}`,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: prototypeCards.map((card) => card.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: { swordId: null, armorId: null },
    },
    currentView: "house",
  });
}

function createCharacters(gold = 5000) {
  return prototypeCharacters.map((character) =>
    character.id !== playerCharacterId
      ? character
      : {
          ...character,
          stats: {
            ...character.stats,
            gold,
          },
        }
  );
}

function openMarketHouse(cityId, gold = 5000) {
  defaultRuntimeContent.cities = prototypeCities;
  const houseDefinition = createCityMarketHouse(cityId);
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(cityId),
    prototypeCityNpcPools,
    () => 0.1
  );
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: createCharacters(gold),
    houseDefinition,
    playerCharacterId,
  });

  return {
    houseDefinition,
    openResult: marketHouseHouseModule.dispatch({
      gameState: enterResult.gameState,
      characterDefinitions: enterResult.characterDefinitions,
      houseDefinition,
      playerCharacterId,
      sessionState: enterResult.sessionState,
      request: { type: "action", actionId: "advance-greeting" },
    }),
  };
}

test("market house supported city can open settlement trade overlay and execute specialty buy flow", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-settlement-trade-buy" },
  });

  assert.equal(overlayResult.sessionState?.overlay?.type, "settlement-trade");
  if (overlayResult.sessionState?.overlay?.type !== "settlement-trade") {
    return;
  }

  const goodsId = overlayResult.sessionState.overlay.selectedGoodsId;
  assert.equal(typeof goodsId, "string");

  const buyResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: { type: "action", actionId: "confirm-settlement-trade" },
  });

  const playerCharacter = buyResult.characterDefinitions.find(
    (character) => character.id === playerCharacterId
  );

  assert.equal(buyResult.sessionState?.overlay?.type, "alert");
  assert.ok(playerCharacter);
  assert.equal(playerCharacter.stats.gold < 5000, true);
  assert.equal(
    buyResult.gameState.runtime.variables[
      getPlayerItemQuantityVariableKey(goodsId)
    ] > 0,
    true
  );
});

test("market house supported city can execute specialty sell flow through the shared settlement path", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-settlement-trade-sell" },
  });

  assert.equal(overlayResult.sessionState?.overlay?.type, "settlement-trade");
  if (overlayResult.sessionState?.overlay?.type !== "settlement-trade") {
    return;
  }

  const goodsId = overlayResult.sessionState.overlay.selectedGoodsId;
  assert.equal(typeof goodsId, "string");
  overlayResult.gameState.runtime.variables[
    getPlayerItemQuantityVariableKey(goodsId)
  ] = 3;

  const sellResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: { type: "action", actionId: "confirm-settlement-trade" },
  });

  const playerCharacter = sellResult.characterDefinitions.find(
    (character) => character.id === playerCharacterId
  );

  assert.equal(sellResult.sessionState?.overlay?.type, "alert");
  assert.ok(playerCharacter);
  assert.equal(playerCharacter.stats.gold > 5000, true);
  assert.equal(
    sellResult.gameState.runtime.variables[
      getPlayerItemQuantityVariableKey(goodsId)
    ] < 3,
    true
  );
});

test("market house keeps ordinary market trade separate from the specialty market path in supported cities", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);

  assert.equal(
    openResult.gameState.runtime.cityMarkets["city.yingtian"]?.shops?.[
      "settlement-trade"
    ] ?? null,
    null
  );

  const ordinaryOverlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const specialtyOverlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-settlement-trade-buy" },
  });

  assert.equal(ordinaryOverlayResult.sessionState?.overlay?.type, "market-trade");
  assert.equal(
    specialtyOverlayResult.sessionState?.overlay?.type,
    "settlement-trade"
  );
});

test("market house hides specialty trade actions for unsupported runtime cities", () => {
  const unsupportedCity = {
    ...prototypeCities[0],
    id: "city.unsupported",
    name: "Unsupported Test City",
  };

  defaultRuntimeContent.cities = [...prototypeCities, unsupportedCity];

  const houseDefinition = createCityMarketHouse(unsupportedCity.id);
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(unsupportedCity.id),
    prototypeCityNpcPools,
    () => 0.1
  );
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: createCharacters(5000),
    houseDefinition,
    playerCharacterId,
  });
  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });
  const viewModel = marketHouseHouseModule.selectViewModel({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
  });

  assert.equal(
    viewModel.actionContainer?.actions.some(
      (action) =>
        action.id === "open-settlement-trade-buy" ||
        action.id === "open-settlement-trade-sell"
    ) ?? false,
    false
  );
});
