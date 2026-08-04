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
  settlementTradeCityProfilesByCityId,
} = require("../.test-dist/content/markets/settlement-trade-city-profiles.js");
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

function withMockedMathRandom(sequence, run) {
  const originalRandom = Math.random;
  const values = Array.isArray(sequence) ? [...sequence] : [sequence];
  let index = 0;
  Math.random = () => values[Math.min(index++, values.length - 1)] ?? 0;

  try {
    return run();
  } finally {
    Math.random = originalRandom;
  }
}

function createBaseState(cityId = "city.yingtian", runtimeCities = prototypeCities) {
  defaultRuntimeContent.cities = runtimeCities;
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

test("settlement trade prepare snapshot creates the first city assortment from tier odds", () => {
  const service = new SettlementTradeService();
  const prepared = withMockedMathRandom([0.9, 0.1, 0.59], () =>
    service.prepareSnapshot({
      state: createBaseState("city.yingtian"),
      cityId: "city.yingtian",
      currentDay: 1,
    })
  );

  assert.deepEqual(
    prepared.snapshot.rows.map((row) => row.goodsId),
    ["silk_textiles", "wine", "salt"]
  );
  assert.equal(prepared.snapshot.nextRefreshDay, 11);
  assert.deepEqual(prepared.mutations, [
    {
      type: "set-settlement-trade-city-assortment",
      cityId: "city.yingtian",
      visibleGoodsIds: ["silk_textiles", "wine", "salt"],
      refreshedDay: 1,
    },
  ]);
});

test("settlement trade prepare snapshot keeps the current city assortment within 10 days", () => {
  const state = createBaseState("city.yingtian");
  state.runtime.settlementTrade["city.yingtian"] = {
    __meta: {
      visibleGoodsIds: ["silk_textiles", "paper_brush"],
      lastRefreshedDay: 1,
    },
  };

  const service = new SettlementTradeService();
  const prepared = withMockedMathRandom(0, () =>
    service.prepareSnapshot({
      state,
      cityId: "city.yingtian",
      currentDay: 10,
    })
  );

  assert.deepEqual(
    prepared.snapshot.rows.map((row) => row.goodsId),
    ["silk_textiles", "paper_brush"]
  );
  assert.equal(prepared.snapshot.nextRefreshDay, 11);
  assert.deepEqual(prepared.mutations, []);
});

test("settlement trade prepare snapshot rerolls the city assortment after 10 days", () => {
  const state = createBaseState("city.yingtian");
  state.runtime.settlementTrade["city.yingtian"] = {
    __meta: {
      visibleGoodsIds: ["silk_textiles", "paper_brush", "wine", "salt"],
      lastRefreshedDay: 1,
    },
  };

  const service = new SettlementTradeService();
  const prepared = withMockedMathRandom([0.95, 0.95, 0.95], () =>
    service.prepareSnapshot({
      state,
      cityId: "city.yingtian",
      currentDay: 11,
    })
  );

  assert.deepEqual(
    prepared.snapshot.rows.map((row) => row.goodsId),
    ["silk_textiles"]
  );
  assert.equal(prepared.snapshot.nextRefreshDay, 21);
  assert.deepEqual(prepared.mutations, [
    {
      type: "set-settlement-trade-city-assortment",
      cityId: "city.yingtian",
      visibleGoodsIds: ["silk_textiles"],
      refreshedDay: 11,
    },
  ]);
});

test("settlement trade prepare snapshot already supports future extreme-scarce goods odds", () => {
  const customCityId = "city.probability_test";
  const runtimeCities = [
    ...prototypeCities,
    {
      ...prototypeCities[0],
      id: customCityId,
      name: "Probability Test",
    },
  ];

  settlementTradeCityProfilesByCityId[customCityId] = {
    cityId: customCityId,
    cityName: "Probability Test",
    goods: {
      silk_textiles: {
        tier: "abundant",
        initialStock: 16,
      },
      paper_brush: {
        tier: "local",
        initialStock: 12,
      },
      salt: {
        tier: "scarce",
        initialStock: 10,
      },
      tea: {
        tier: "extreme-scarce",
        initialStock: 8,
      },
    },
  };

  try {
    const service = new SettlementTradeService();
    const prepared = withMockedMathRandom([0.81, 0.59, 0.39], () =>
      service.prepareSnapshot({
        state: createBaseState(customCityId, runtimeCities),
        cityId: customCityId,
        currentDay: 1,
      })
    );

    assert.deepEqual(
      prepared.snapshot.rows.map((row) => row.goodsId),
      ["silk_textiles", "salt", "tea"]
    );
    assert.deepEqual(prepared.mutations, [
      {
        type: "set-settlement-trade-city-assortment",
        cityId: customCityId,
        visibleGoodsIds: ["silk_textiles", "salt", "tea"],
        refreshedDay: 1,
      },
    ]);
  } finally {
    delete settlementTradeCityProfilesByCityId[customCityId];
    defaultRuntimeContent.cities = prototypeCities;
  }
});

test("settlement trade prepare snapshot evaluates Haozhou against the full goods matrix", () => {
  const service = new SettlementTradeService();
  const prepared = withMockedMathRandom(
    [
      0.5, // silk_textiles scarce -> show
      0.7, // cotton_cloth scarce -> hide
      0.5, // tea scarce -> show
      0.2, // copperware scarce -> show
      0.1, // ironware scarce -> show
      0.3, // salt scarce -> show
      0.8, // paper_brush scarce -> hide
      0.7, // bamboo_woodware scarce -> hide
      0.2, // woven_goods local -> show
      0.8, // lacquer_oil scarce -> hide
      0.9, // stone_goods local -> hide
      0.2, // hides local -> show
    ],
    () =>
      service.prepareSnapshot({
        state: createBaseState("city.kulan"),
        cityId: "city.kulan",
        currentDay: 1,
      })
  );

  assert.deepEqual(
    prepared.snapshot.rows.map((row) => row.goodsId),
    [
      "silk_textiles",
      "ramie_cloth",
      "tea",
      "wine",
      "ceramics",
      "copperware",
      "ironware",
      "salt",
      "woven_goods",
      "hides",
    ]
  );
});

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

test("settlement trade snapshot applies the configured tier price multipliers", () => {
  const service = new SettlementTradeService();
  const rowsByGoodsId = Object.fromEntries(
    service
      .createSnapshot({
        state: createBaseState("city.yingtian"),
        cityId: "city.yingtian",
        currentDay: 1,
      })
      .rows.map((row) => [row.goodsId, row])
  );

  assert.equal(rowsByGoodsId.silk_textiles?.staticReferencePrice, 600);
  assert.equal(rowsByGoodsId.paper_brush?.staticReferencePrice, 140);
  assert.equal(rowsByGoodsId.wine?.staticReferencePrice, 140);
  assert.equal(rowsByGoodsId.salt?.staticReferencePrice, 132);
});

test("settlement trade snapshot matches the Haozhou authored base prices and tiers from the planning table", () => {
  const service = new SettlementTradeService();
  const rowsByGoodsId = Object.fromEntries(
    service
      .createSnapshot({
        state: createBaseState("city.kulan"),
        cityId: "city.kulan",
        currentDay: 1,
      })
      .rows.map((row) => [row.goodsId, row])
  );

  assert.equal(rowsByGoodsId.ramie_cloth?.staticReferencePrice, 120);
  assert.equal(rowsByGoodsId.wine?.staticReferencePrice, 100);
  assert.equal(rowsByGoodsId.ceramics?.staticReferencePrice, 200);
  assert.equal(rowsByGoodsId.woven_goods?.staticReferencePrice, 56);
  assert.equal(rowsByGoodsId.stone_goods?.staticReferencePrice, 140);
  assert.equal(rowsByGoodsId.hides?.staticReferencePrice, 420);
});

test("settlement trade snapshot uses localized specialty labels for the current runtime pack", () => {
  const service = new SettlementTradeService();
  const row = service
    .createSnapshot({
      state: createBaseState("city.yingtian"),
      cityId: "city.yingtian",
      currentDay: 1,
    })
    .rows.find((candidate) => candidate.goodsId === "silk_textiles");

  assert.notEqual(row, undefined);
  assert.equal(row?.name, "丝绸");
  assert.equal(row?.categoryLabel, "织品");
  assert.equal(row?.unit, "匹");
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
  assert.match(snapshot.helperLines[0] ?? "", /尚未开通|未开通/u);
});

test("settlement trade helper and validation copy stay localized in Chinese", () => {
  const service = new SettlementTradeService();
  const supportedSnapshot = service.createSnapshot({
    state: createBaseState("city.yingtian"),
    cityId: "city.yingtian",
    currentDay: 1,
  });
  const unsupportedResolution = service.resolveTrade({
    state: createBaseState("city.unsupported"),
    cityId: "city.unsupported",
    currentDay: 1,
    goodsId: "silk_textiles",
    mode: "buy",
    quantity: 1,
    playerGold: 1000,
  });

  assert.match(supportedSnapshot.helperLines[0] ?? "", /买入价|卖出价/u);
  assert.match(supportedSnapshot.helperLines[1] ?? "", /每买卖 10 个/u);
  assert.equal(unsupportedResolution.ok, false);
  if (unsupportedResolution.ok) {
    return;
  }

  assert.match(unsupportedResolution.title, /特产/u);
  assert.doesNotMatch(
    [unsupportedResolution.title, ...unsupportedResolution.paragraphs].join("\n"),
    /Specialty market unavailable|This city does not have a specialty market/i
  );
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
    playerGold: 20000,
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
    playerGold: 30000,
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
