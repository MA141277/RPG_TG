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

test("settlement trade resets multiplier and progress after 30 quiet days", () => {
  const service = new SettlementTradeService();
  const state = createBaseState("city.yingtian");

  state.runtime.settlementTrade = {
    "city.yingtian": {
      silk_textiles: {
        stockQuantity: 18,
        priceMultiplier: 1.45,
        progressUnits: 7,
        lastTradedDay: 1,
      },
    },
  };

  const row = service
    .createSnapshot({
      state,
      cityId: "city.yingtian",
      currentDay: 31,
    })
    .rows.find((candidate) => candidate.goodsId === "silk_textiles");

  assert.notEqual(row, undefined);
  assert.equal(row?.priceMultiplier, 1);
  assert.equal(row?.progressUnits, 0);
  assert.equal(row?.daysUntilReset, 30);
});

test("settlement trade post-reset trades emit absolute multiplier from the reset baseline", () => {
  const service = new SettlementTradeService();
  const state = createBaseState("city.yingtian");

  state.runtime.settlementTrade = {
    "city.yingtian": {
      silk_textiles: {
        stockQuantity: 18,
        priceMultiplier: 1.45,
        progressUnits: 7,
        lastTradedDay: 1,
      },
    },
  };

  const result = service.resolveTrade({
    state,
    cityId: "city.yingtian",
    currentDay: 31,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 10,
    playerGold: 10000,
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const multiplierMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-multiplier"
  );

  assert.deepEqual(multiplierMutation, {
    type: "set-settlement-trade-multiplier",
    cityId: "city.yingtian",
    goodsId: "silk_textiles",
    priceMultiplier: 1.01,
  });
});

test("settlement trade buy pressure adds 0.01 for each 10 bought units and keeps residual progress", () => {
  const service = new SettlementTradeService();
  const result = service.resolveTrade({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 25,
    playerGold: 10000,
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const multiplierMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-multiplier"
  );
  const progressMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-progress"
  );
  const lastTradedDayMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-last-traded-day"
  );

  assert.deepEqual(multiplierMutation, {
    type: "set-settlement-trade-multiplier",
    cityId: "city.yingtian",
    goodsId: "silk_textiles",
    priceMultiplier: 1.02,
  });
  assert.deepEqual(progressMutation, {
    type: "set-settlement-trade-progress",
    cityId: "city.yingtian",
    goodsId: "silk_textiles",
    progressUnits: 5,
  });
  assert.deepEqual(lastTradedDayMutation, {
    type: "set-settlement-trade-last-traded-day",
    cityId: "city.yingtian",
    goodsId: "silk_textiles",
    dayNumber: 1,
  });
});

test("settlement trade sell pressure keeps signed residual progress and reads legacy market inventory", () => {
  const service = new SettlementTradeService();
  const state = createBaseState("city.fuzhou");

  state.runtime.settlementTrade["city.fuzhou"] = {
    tea: {
      stockQuantity: 18,
      priceMultiplier: 1.15,
      progressUnits: 3,
      lastTradedDay: 6,
    },
  };
  state.runtime.variables[getTradeInventoryQuantityVariableKey("tea")] = 15;

  const result = service.resolveTrade({
    state,
    cityId: "city.fuzhou",
    currentDay: 7,
    goodsId: "tea",
    mode: "sell",
    quantity: 15,
    playerGold: 0,
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const multiplierMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-multiplier"
  );
  const progressMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-progress"
  );
  const itemMutation = result.mutations.find(
    (mutation) => mutation.type === "change-player-item"
  );

  assert.deepEqual(multiplierMutation, {
    type: "set-settlement-trade-multiplier",
    cityId: "city.fuzhou",
    goodsId: "tea",
    priceMultiplier: 1.14,
  });
  assert.deepEqual(progressMutation, {
    type: "set-settlement-trade-progress",
    cityId: "city.fuzhou",
    goodsId: "tea",
    progressUnits: -2,
  });
  assert.deepEqual(itemMutation, {
    type: "change-player-item",
    itemId: "tea",
    delta: -15,
  });
});

test("settlement trade pressure clamps at the 2.0 multiplier ceiling", () => {
  const service = new SettlementTradeService();
  const state = createBaseState("city.yingtian");

  state.runtime.settlementTrade["city.yingtian"] = {
    silk_textiles: {
      stockQuantity: 50,
      priceMultiplier: 1.99,
      progressUnits: 9,
      lastTradedDay: 1,
    },
  };

  const result = service.resolveTrade({
    state,
    cityId: "city.yingtian",
    currentDay: 2,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 20,
    playerGold: 10000,
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const multiplierMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-multiplier"
  );
  const progressMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-progress"
  );

  assert.deepEqual(multiplierMutation, {
    type: "set-settlement-trade-multiplier",
    cityId: "city.yingtian",
    goodsId: "silk_textiles",
    priceMultiplier: 2,
  });
  assert.deepEqual(progressMutation, {
    type: "set-settlement-trade-progress",
    cityId: "city.yingtian",
    goodsId: "silk_textiles",
    progressUnits: 0,
  });
});

test("settlement trade pressure clamps at the 0.5 multiplier floor", () => {
  const service = new SettlementTradeService();
  const state = createBaseState("city.fuzhou");

  state.runtime.settlementTrade["city.fuzhou"] = {
    tea: {
      stockQuantity: 18,
      priceMultiplier: 0.51,
      progressUnits: -9,
      lastTradedDay: 6,
    },
  };
  state.runtime.variables[getTradeInventoryQuantityVariableKey("tea")] = 30;

  const result = service.resolveTrade({
    state,
    cityId: "city.fuzhou",
    currentDay: 7,
    goodsId: "tea",
    mode: "sell",
    quantity: 20,
    playerGold: 0,
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const multiplierMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-multiplier"
  );
  const progressMutation = result.mutations.find(
    (mutation) => mutation.type === "set-settlement-trade-progress"
  );

  assert.deepEqual(multiplierMutation, {
    type: "set-settlement-trade-multiplier",
    cityId: "city.fuzhou",
    goodsId: "tea",
    priceMultiplier: 0.5,
  });
  assert.deepEqual(progressMutation, {
    type: "set-settlement-trade-progress",
    cityId: "city.fuzhou",
    goodsId: "tea",
    progressUnits: 0,
  });
});

test("settlement trade keeps buy price at round(sell price * 1.2) and rejects insufficient resources", () => {
  const service = new SettlementTradeService();
  const snapshot = service.createSnapshot({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });
  const row = snapshot.rows.find((candidate) => candidate.goodsId === "silk_textiles");

  assert.notEqual(row, undefined);
  assert.equal(row?.currentBuyPrice, Math.round((row?.currentSellPrice ?? 0) * 1.2));

  const insufficientGold = service.resolveTrade({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 1,
    playerGold: 0,
  });
  assert.equal(insufficientGold.ok, false);
  if (insufficientGold.ok) {
    return;
  }
  assert.equal(insufficientGold.code, "insufficient-gold");

  const insufficientStock = service.resolveTrade({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 999,
    playerGold: 999999,
  });
  assert.equal(insufficientStock.ok, false);
  if (insufficientStock.ok) {
    return;
  }
  assert.equal(insufficientStock.code, "insufficient-stock");

  const insufficientOwnedQuantity = service.resolveTrade({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "sell",
    quantity: 1,
    playerGold: 0,
  });
  assert.equal(insufficientOwnedQuantity.ok, false);
  if (insufficientOwnedQuantity.ok) {
    return;
  }
  assert.equal(insufficientOwnedQuantity.code, "insufficient-owned-quantity");
});

test("settlement trade returns structured validation failures for unsupported inputs", () => {
  const service = new SettlementTradeService();

  const unsupportedCity = service.resolveTrade({
    state: createBaseState("city.huangcun"),
    cityId: "city.huangcun",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 1,
    playerGold: 1000,
  });
  assert.equal(unsupportedCity.ok, false);
  if (unsupportedCity.ok) {
    return;
  }
  assert.equal(unsupportedCity.code, "unsupported-city");

  const unknownGoods = service.resolveTrade({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "hides",
    mode: "buy",
    quantity: 1,
    playerGold: 1000,
  });
  assert.equal(unknownGoods.ok, false);
  if (unknownGoods.ok) {
    return;
  }
  assert.equal(unknownGoods.code, "unknown-goods");

  const invalidQuantity = service.resolveTrade({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 0,
    playerGold: 1000,
  });
  assert.equal(invalidQuantity.ok, false);
  if (invalidQuantity.ok) {
    return;
  }
  assert.equal(invalidQuantity.code, "invalid-quantity");
});
