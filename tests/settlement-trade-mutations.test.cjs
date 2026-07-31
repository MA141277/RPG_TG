const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  applySettlementTradeMutations,
} = require("../.test-dist/application/markets/apply-settlement-trade-mutations.js");
const {
  SettlementTradeService,
} = require("../.test-dist/application/markets/settlement-trade-service.js");
const {
  defaultRuntimeContent,
} = require("../.test-dist/application/content/default-runtime-content.js");
const {
  getPlayerItemQuantityVariableKey,
} = require("../.test-dist/application/inventory/player-item-inventory.js");
const {
  getTradeInventoryQuantityVariableKey,
} = require("../.test-dist/domain/market-house.js");
const {
  prototypeCards,
  prototypeCities,
  prototypeMap,
  prototypeValuables,
  prototypeCharacters,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

function createBaseState(cityId = "city.yingtian") {
  defaultRuntimeContent.cities = prototypeCities;
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: cityId,
    currentHouseId: null,
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

test("apply settlement trade mutations updates gold, items, stock, multiplier, progress, and day", () => {
  const state = createBaseState("city.yingtian");
  state.runtime.settlementTrade = {
    "city.yingtian": {
      silk_textiles: {
        stockQuantity: 8,
        priceMultiplier: 1,
        progressUnits: 2,
        lastTradedDay: 1,
      },
    },
  };

  const result = applySettlementTradeMutations({
    state,
    characterDefinitions: createCharacters(5000),
    playerCharacterId,
    mutations: [
      { type: "change-player-gold", amount: -240 },
      { type: "change-player-item", itemId: "silk_textiles", delta: 2 },
      {
        type: "set-settlement-trade-stock",
        cityId: "city.yingtian",
        goodsId: "silk_textiles",
        stockQuantity: 6,
      },
      {
        type: "set-settlement-trade-multiplier",
        cityId: "city.yingtian",
        goodsId: "silk_textiles",
        priceMultiplier: 1.01,
      },
      {
        type: "set-settlement-trade-progress",
        cityId: "city.yingtian",
        goodsId: "silk_textiles",
        progressUnits: 0,
      },
      {
        type: "set-settlement-trade-last-traded-day",
        cityId: "city.yingtian",
        goodsId: "silk_textiles",
        dayNumber: 12,
      },
    ],
  });

  const player = result.characterDefinitions.find(
    (character) => character.id === playerCharacterId
  );

  assert.ok(player);
  assert.equal(player.stats.gold, 4760);
  assert.equal(
    result.state.runtime.variables[
      getPlayerItemQuantityVariableKey("silk_textiles")
    ],
    2
  );
  assert.deepEqual(result.state.runtime.settlementTrade["city.yingtian"], {
    silk_textiles: {
      stockQuantity: 6,
      priceMultiplier: 1.01,
      progressUnits: 0,
      lastTradedDay: 12,
    },
  });
});

test("apply settlement trade mutations migrates legacy market inventory through the shared player item path", () => {
  const state = createBaseState("city.fuzhou");
  state.runtime.variables[getTradeInventoryQuantityVariableKey("tea")] = 4;

  const result = applySettlementTradeMutations({
    state,
    characterDefinitions: createCharacters(5000),
    playerCharacterId,
    mutations: [{ type: "change-player-item", itemId: "tea", delta: -1 }],
  });

  assert.equal(
    result.state.runtime.variables[getPlayerItemQuantityVariableKey("tea")],
    3
  );
  assert.equal(
    result.state.runtime.variables[getTradeInventoryQuantityVariableKey("tea")],
    0
  );
});

test("apply settlement trade mutations preserves the service stock baseline on the first trade write", () => {
  const service = new SettlementTradeService();
  const state = createBaseState("city.yingtian");

  const resolution = service.resolveTrade({
    state,
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 2,
    playerGold: 10000,
  });

  assert.equal(resolution.ok, true);
  if (!resolution.ok) {
    return;
  }

  const result = applySettlementTradeMutations({
    state,
    characterDefinitions: createCharacters(10000),
    playerCharacterId,
    mutations: resolution.mutations,
  });

  assert.deepEqual(result.state.runtime.settlementTrade["city.yingtian"], {
    silk_textiles: {
      stockQuantity: 34,
      priceMultiplier: 1,
      progressUnits: 2,
      lastTradedDay: 1,
    },
  });
});
