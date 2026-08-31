const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

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
const yingtianSpecialtyGoodsIds = [
  "silk_textiles",
  "paper_brush",
  "wine",
  "salt",
];
const dormantOrdinaryGoodsId = "hides";

assert.ok(marketHouse, "Expected prototype market house to exist.");

function createCityMarketHouse(cityId) {
  return {
    ...marketHouse,
    id: `${marketHouse.id}.${cityId}`,
    cityId,
  };
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

function createBaseState(cityId, day = 1) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: cityId,
    currentHouseId: `${marketHouse.id}.${cityId}`,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day,
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

function getAbsoluteCalendarDay(day) {
  return 1567 * 360 + day;
}

function openMarketHouse(cityId, gold = 5000, day = 1) {
  defaultRuntimeContent.cities = prototypeCities;
  const houseDefinition = createCityMarketHouse(cityId);
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(cityId, day),
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

function selectViewModel(result, houseDefinition) {
  return marketHouseHouseModule.selectViewModel({
    gameState: result.gameState,
    characterDefinitions: result.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: result.sessionState,
  });
}

function pickYingtianSpecialtyGoodsId(overlay) {
  assert.equal(overlay?.type, "market-trade");
  if (overlay?.type !== "market-trade") {
    return null;
  }

  const specialtyRow =
    overlay.rows.find((row) => yingtianSpecialtyGoodsIds.includes(row.goodsId)) ?? null;
  assert.ok(
    specialtyRow,
    "Expected Yingtian specialty goods to appear in market-trade rows."
  );
  return specialtyRow?.goodsId ?? null;
}

function assertOnlyYingtianSpecialtyRows(overlay) {
  assert.equal(overlay?.type, "market-trade");
  if (overlay?.type !== "market-trade") {
    return;
  }

  assert.equal(overlay.rows.length > 0, true);
  assert.equal(
    overlay.rows.some((row) => !yingtianSpecialtyGoodsIds.includes(row.goodsId)),
    false
  );
}

test("market house host menu keeps only shared goods entry points in supported specialty cities", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);
  const viewModel = selectViewModel(openResult, houseDefinition);
  const hostEntry = viewModel.standbyRoster.find(
    (entry) => entry.characterId === houseDefinition.defaultCharacterId
  );
  const actionSummary =
    viewModel.actionContainer?.actions.map((action) => ({
      id: action.id,
      label: action.label,
    })) ?? [];
  const quickActionSummary =
    hostEntry?.interactionActions.map((action) => ({
      id: action.id,
      label: action.label,
    })) ?? [];

  assert.deepEqual(actionSummary, [
    { id: "buy-goods", label: "买入货物" },
    { id: "sell-goods", label: "卖出货物" },
    { id: "investigate-market", label: "调查行情" },
    { id: "dismiss-dialogue", label: "关闭" },
  ]);
  assert.deepEqual(quickActionSummary, [
    { id: "investigate-market", label: "调查行情" },
    { id: "buy-goods", label: "买入货物" },
    { id: "sell-goods", label: "卖出货物" },
  ]);
  assert.equal(
    [...actionSummary, ...quickActionSummary].some(
      (action) =>
        action.id.includes("settlement-trade") ||
        action.label === "特产买入" ||
        action.label === "特产卖出"
    ),
    false
  );
});

test("market house goods description uses readable Chinese labels in the shared trade overlay", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);
  const specialtyGoodsId = pickYingtianSpecialtyGoodsId(overlayViewModel.overlay);
  assertOnlyYingtianSpecialtyRows(overlayViewModel.overlay);
  const specialtyRow =
    overlayViewModel.overlay?.type === "market-trade"
      ? overlayViewModel.overlay.rows.find((row) => row.goodsId === specialtyGoodsId) ?? null
      : null;

  assert.equal(typeof specialtyRow?.quantityLabel, "string");
  assert.match(specialtyRow.quantityLabel, /^库存\s/u);
  assert.match(specialtyRow.quantityLabel, /\/ 持有\s/u);
});

test("market house specialty goods buy result overlay uses readable Chinese summaries", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);
  const specialtyGoodsId = pickYingtianSpecialtyGoodsId(overlayViewModel.overlay);
  assertOnlyYingtianSpecialtyRows(overlayViewModel.overlay);
  assert.equal(
    overlayResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "panel-open"
  );
  assert.equal(
    overlayResult.observedEvents?.[0]?.houseActionMemory?.panelId,
    "market-buy"
  );
  assert.equal(
    overlayResult.observedEvents?.[0]?.houseActionMemory?.resultKind,
    "preview"
  );

  const selectedResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: {
      type: "action",
      actionId: `select-market-goods:${specialtyGoodsId}`,
    },
  });
  const buyResult = marketHouseHouseModule.dispatch({
    gameState: selectedResult.gameState,
    characterDefinitions: selectedResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: selectedResult.sessionState,
    request: { type: "action", actionId: "confirm-trade" },
  });

  assert.equal(buyResult.sessionState?.overlay?.type, "alert");
  if (buyResult.sessionState?.overlay?.type !== "alert") {
    return;
  }

  assert.equal(buyResult.sessionState.overlay.title, "成交");
  assert.equal(
    buyResult.sessionState.overlay.paragraphs.some((line) => line.startsWith("花费 ")),
    true
  );
  assert.equal(
    buyResult.sessionState.overlay.paragraphs.some((line) => line.startsWith("金钱 ")),
    true
  );
  assert.equal(
    buyResult.sessionState.overlay.paragraphs.some((line) => line.startsWith("关系 ")),
    true
  );
  assert.equal(
    buyResult.sessionState.overlay.paragraphs.some((line) => line.startsWith("时间 ")),
    true
  );
  assert.equal(
    buyResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "trade-buy-success"
  );
  assert.equal(
    buyResult.observedEvents?.[0]?.houseActionMemory?.panelId,
    "market-buy"
  );
  assert.equal(
    buyResult.observedEvents?.[0]?.houseActionMemory?.quantity,
    1
  );
  assert.equal(
    (buyResult.observedEvents?.[0]?.houseActionMemory?.goldDelta ?? 0) < 0,
    true
  );
  assert.equal(
    buyResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    houseDefinition.defaultCharacterId
  );
});

test("market house conversation service can directly settle a generic cloth purchase into the backpack", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.kulan", 5000);

  const directBuyResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "conversation-service",
      serviceId: "market-buy",
      rawPlayerText: "那就给我来一匹布，先拿回去用。",
      targetCharacterId: houseDefinition.defaultCharacterId,
    },
  });

  const playerCharacter = directBuyResult.characterDefinitions.find(
    (character) => character.id === playerCharacterId
  );

  assert.equal(directBuyResult.sessionState?.overlay?.type, "alert");
  assert.ok(playerCharacter);
  assert.equal(playerCharacter.stats.gold < 5000, true);
  assert.equal(
    directBuyResult.gameState.runtime.variables[
      getPlayerItemQuantityVariableKey("ramie_cloth")
    ],
    1
  );
  assert.equal(
    directBuyResult.sessionState?.overlay?.paragraphs.some((line) =>
      line.includes("麻布")
    ),
    true
  );
  assert.equal(
    directBuyResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "trade-buy-success"
  );
  assert.equal(
    directBuyResult.observedEvents?.[0]?.houseActionMemory?.itemId,
    "ramie_cloth"
  );
  assert.equal(
    directBuyResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    houseDefinition.defaultCharacterId
  );
});

test("market house closing the buy overlay without settling emits a no-action memory event", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.kulan", 5000);
  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const closeResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: { type: "action", actionId: "close-trade" },
  });

  assert.equal(
    closeResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "panel-close-without-action"
  );
  assert.equal(
    closeResult.observedEvents?.[0]?.houseActionMemory?.panelId,
    "market-buy"
  );
  assert.equal(
    closeResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    houseDefinition.defaultCharacterId
  );
});

test("market house buy overlay keeps legacy ordinary shops dormant while showing specialty rows", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);
  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);

  assert.equal(
    openResult.gameState.runtime.cityMarkets[houseDefinition.cityId] ?? null,
    null
  );
  assertOnlyYingtianSpecialtyRows(overlayViewModel.overlay);
});

test("market house first city entry materializes and persists the specialty assortment", () => {
  const { houseDefinition, openResult } = withMockedMathRandom(0, () =>
    openMarketHouse("city.yingtian", 5000, 1)
  );

  assert.deepEqual(openResult.gameState.runtime.settlementTrade["city.yingtian"]?.__meta, {
    visibleGoodsIds: yingtianSpecialtyGoodsIds,
    lastRefreshedDay: getAbsoluteCalendarDay(1),
  });

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  assert.deepEqual(
    overlayViewModel.overlay.rows.map((row) => row.goodsId),
    yingtianSpecialtyGoodsIds
  );
});

test("market house refreshes the specialty assortment every 10 days from the first city entry", () => {
  defaultRuntimeContent.cities = prototypeCities;
  const houseDefinition = createCityMarketHouse("city.yingtian");
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState("city.yingtian", 11),
    prototypeCityNpcPools,
    () => 0.1
  );

  state.runtime.settlementTrade["city.yingtian"] = {
    __meta: {
      visibleGoodsIds: yingtianSpecialtyGoodsIds,
      lastRefreshedDay: 1,
    },
  };

  const enterResult = withMockedMathRandom(0.99, () =>
    marketHouseHouseModule.enter({
      gameState: state,
      characterDefinitions: createCharacters(5000),
      houseDefinition,
      playerCharacterId,
    })
  );
  const openResult = withMockedMathRandom(0.99, () =>
    marketHouseHouseModule.dispatch({
      gameState: enterResult.gameState,
      characterDefinitions: enterResult.characterDefinitions,
      houseDefinition,
      playerCharacterId,
      sessionState: enterResult.sessionState,
      request: { type: "action", actionId: "advance-greeting" },
    })
  );
  const viewModel = selectViewModel(openResult, houseDefinition);

  assert.deepEqual(openResult.gameState.runtime.settlementTrade["city.yingtian"]?.__meta, {
    visibleGoodsIds: ["silk_textiles"],
    lastRefreshedDay: getAbsoluteCalendarDay(11),
  });
  assert.match(
    viewModel.statusCard.subtitle,
    new RegExp(`${getAbsoluteCalendarDay(11) + 10}`)
  );

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  assert.deepEqual(overlayViewModel.overlay.rows.map((row) => row.goodsId), [
    "silk_textiles",
  ]);
});

test("market house supported city can buy specialty goods through the shared market-trade overlay", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);
  const specialtyGoodsId = pickYingtianSpecialtyGoodsId(overlayViewModel.overlay);

  const selectedResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: {
      type: "action",
      actionId: `select-market-goods:${specialtyGoodsId}`,
    },
  });
  const buyResult = marketHouseHouseModule.dispatch({
    gameState: selectedResult.gameState,
    characterDefinitions: selectedResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: selectedResult.sessionState,
    request: { type: "action", actionId: "confirm-trade" },
  });

  const playerCharacter = buyResult.characterDefinitions.find(
    (character) => character.id === playerCharacterId
  );

  assert.equal(buyResult.sessionState?.overlay?.type, "alert");
  assert.ok(playerCharacter);
  assert.equal(playerCharacter.stats.gold < 5000, true);
  assert.equal(
    buyResult.gameState.runtime.variables[
      getPlayerItemQuantityVariableKey(specialtyGoodsId)
    ] > 0,
    true
  );
});

test("market house supported city can sell specialty goods through the shared market-trade overlay", () => {
  const specialtyGoodsId = "silk_textiles";
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);

  openResult.gameState.runtime.variables[
    getPlayerItemQuantityVariableKey(specialtyGoodsId)
  ] = 3;
  openResult.gameState.runtime.variables[
    getPlayerItemQuantityVariableKey(dormantOrdinaryGoodsId)
  ] = 2;

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "sell-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  assertOnlyYingtianSpecialtyRows(overlayViewModel.overlay);
  assert.equal(
    overlayViewModel.overlay.rows.some((row) => row.goodsId === specialtyGoodsId),
    true
  );
  assert.equal(
    overlayViewModel.overlay.rows.some((row) => row.goodsId === dormantOrdinaryGoodsId),
    false
  );

  const selectedResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: {
      type: "action",
      actionId: `select-market-goods:${specialtyGoodsId}`,
    },
  });
  const sellResult = marketHouseHouseModule.dispatch({
    gameState: selectedResult.gameState,
    characterDefinitions: selectedResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: selectedResult.sessionState,
    request: { type: "action", actionId: "confirm-trade" },
  });

  const playerCharacter = sellResult.characterDefinitions.find(
    (character) => character.id === playerCharacterId
  );

  assert.equal(sellResult.sessionState?.overlay?.type, "alert");
  assert.ok(playerCharacter);
  assert.equal(playerCharacter.stats.gold > 5000, true);
  assert.equal(
    sellResult.gameState.runtime.variables[
      getPlayerItemQuantityVariableKey(specialtyGoodsId)
    ] < 3,
    true
  );
});

test("market house keeps ordinary city-market runtime unused in supported specialty cities", () => {
  const { houseDefinition, openResult } = openMarketHouse("city.yingtian", 5000);

  assert.equal(
    openResult.gameState.runtime.cityMarkets["city.yingtian"]?.shops?.[
      "settlement-trade"
    ] ?? null,
    null
  );

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  assertOnlyYingtianSpecialtyRows(overlayViewModel.overlay);
  assert.equal(
    overlayViewModel.overlay.rows.some((row) => row.goodsId === dormantOrdinaryGoodsId),
    false
  );
  assert.equal(
    overlayResult.gameState.runtime.cityMarkets["city.yingtian"] ?? null,
    null
  );
});

test("market house hides legacy compatibility goods behind explicit source markers", () => {
  const source = fs.readFileSync(
    "src/application/house-modules/market-house/market-house-house-module.ts",
    "utf8"
  );

  assert.match(source, /Legacy ordinary-goods compatibility path/u);
  assert.match(source, /collectLegacyCityMarketEntries/u);
});

test("market house unsupported runtime cities no longer expose hidden legacy goods", () => {
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
  const viewModel = selectViewModel(openResult, houseDefinition);

  assert.equal(
    viewModel.actionContainer?.actions.some(
      (action) =>
        action.id === "open-settlement-trade-buy" ||
        action.id === "open-settlement-trade-sell"
    ) ?? false,
    false
  );

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });
  const overlayViewModel = selectViewModel(overlayResult, houseDefinition);

  assert.equal(overlayViewModel.overlay?.type, "alert");
  if (overlayViewModel.overlay?.type !== "alert") {
    return;
  }

  assert.equal(overlayViewModel.overlay.title, "暂无存货");
});
