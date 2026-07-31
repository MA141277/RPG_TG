const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  defaultRuntimeContent,
} = require("../.test-dist/application/content/default-runtime-content.js");
const {
  SettlementTradeService,
} = require("../.test-dist/application/markets/settlement-trade-service.js");
const {
  getTradeInventoryQuantityVariableKey,
} = require("../.test-dist/domain/market-house.js");
const {
  prototypeCards,
  prototypeCities,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

function getMarketCityIds() {
  return prototypeCities
    .filter((city) => city.houseIds.some((houseId) => houseId.endsWith(".market")))
    .map((city) => city.id);
}

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

test("settlement trade snapshot reads content defaults for supported cities", () => {
  const service = new SettlementTradeService();
  const snapshot = service.createSnapshot({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });

  assert.equal(snapshot.supported, true);
  assert.equal(snapshot.rows.length > 0, true);
  assert.equal(snapshot.rows.every((row) => row.priceMultiplier === 1), true);
  assert.equal(snapshot.rows.every((row) => row.progressUnits === 0), true);
  assert.equal(snapshot.rows.every((row) => row.daysUntilReset === 30), true);
});

test("settlement trade snapshot supports every runtime city that has a market house", () => {
  const service = new SettlementTradeService();
  const marketCityIds = getMarketCityIds();

  assert.equal(marketCityIds.length > 0, true);

  for (const cityId of marketCityIds) {
    const snapshot = service.createSnapshot({
      state: createBaseState(cityId),
      cityId,
      currentDay: 1,
    });

    assert.equal(snapshot.supported, true, `expected ${cityId} to be supported`);
    assert.equal(
      snapshot.rows.length > 0,
      true,
      `expected ${cityId} to expose specialty goods`
    );
  }
});

test("settlement trade snapshot preserves signed progress and legacy market inventory", () => {
  const state = createBaseState("city.fuzhou");

  state.runtime.settlementTrade["city.fuzhou"] = {
    tea: {
      stockQuantity: 18,
      priceMultiplier: 1.15,
      progressUnits: -7,
      lastTradedDay: 6,
    },
  };
  state.runtime.variables[getTradeInventoryQuantityVariableKey("tea")] = 4;

  const service = new SettlementTradeService();
  const row = service
    .createSnapshot({
      state,
      cityId: "city.fuzhou",
      currentDay: 7,
    })
    .rows.find((entry) => entry.goodsId === "tea");

  assert.notEqual(row, undefined);
  assert.equal(row?.progressUnits, -7);
  assert.equal(row?.ownedQuantity, 4);
  assert.equal(row?.daysUntilReset, 29);
});

test("settlement trade snapshot rejects cities without a specialty profile", () => {
  const service = new SettlementTradeService();
  const snapshot = service.createSnapshot({
    state: createBaseState("city.unsupported"),
    cityId: "city.unsupported",
    currentDay: 1,
  });

  assert.equal(snapshot.supported, false);
  assert.deepEqual(snapshot.rows, []);
  assert.match(snapshot.helperLines[0] ?? "", /not available/i);
});

test("settlement trade investigation summary is derived from the snapshot rows", () => {
  const service = new SettlementTradeService();
  const snapshot = service.createSnapshot({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });
  const summary = service.createInvestigationSummary({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });

  assert.equal(summary.cityId, snapshot.cityId);
  assert.deepEqual(
    summary.headlineGoodsIds,
    snapshot.rows.slice(0, 2).map((row) => row.goodsId)
  );
});
