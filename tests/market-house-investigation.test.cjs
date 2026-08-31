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
  getMarketHouseGuestActorIdsVariableKey,
} = require("../.test-dist/domain/market-house.js");
const {
  renderMarketHouseView,
} = require("../.test-dist/ui/views/house/market-house-view.js");
const {
  defaultPackTextEntries,
} = require("../.test-dist/content/pack-content-access.js");
const {
  getCompactCityDisplayName,
} = require("../.test-dist/shared/city-display-name.js");
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createOtherCityNamePattern(currentCityId) {
  return new RegExp(
    prototypeCities
      .filter((cityDefinition) => cityDefinition.id !== currentCityId)
      .map((cityDefinition) =>
        escapeRegex(getCompactCityDisplayName(cityDefinition.name))
      )
      .join("|"),
    "u"
  );
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

function createBaseState(houseDefinition) {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: houseDefinition.cityId,
    currentHouseId: houseDefinition.id,
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

function createCityMarketHouse(cityId) {
  return {
    ...marketHouse,
    id: `${marketHouse.id}.${cityId}`,
    cityId,
  };
}

function createRuntimeCitiesWithNameOverrides(nameOverrides) {
  return prototypeCities.map((cityDefinition) => ({
    ...cityDefinition,
    name: nameOverrides[cityDefinition.id] ?? cityDefinition.name,
  }));
}

function withVariable(state, key, value) {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [key]: value,
      },
    },
  };
}

async function openMarketHouse(houseDefinition = marketHouse, options = {}) {
  defaultRuntimeContent.cities = options.runtimeCities ?? prototypeCities;
  defaultRuntimeContent.textEntriesById = defaultPackTextEntries;
  const seededState =
    Array.isArray(options.guestActorIds) && options.guestActorIds.length > 0
      ? withVariable(
          createBaseState(houseDefinition),
          getMarketHouseGuestActorIdsVariableKey(houseDefinition.id),
          options.guestActorIds.join(",")
        )
      : createBaseState(houseDefinition);
  const state = ensureCityNpcPoolsForCurrentDay(
    seededState,
    prototypeCityNpcPools,
    () => 0.1
  );
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition,
    playerCharacterId,
  });
  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  return {
    enterResult,
    openResult,
  };
}

function selectActor(openResult, actorId, houseDefinition = marketHouse) {
  assert.equal(typeof actorId, "string");

  return marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: `select-market-actor:${actorId}`,
    },
  });
}

function selectGuestActor(openResult, houseDefinition = marketHouse) {
  const guestActorId = openResult.sessionState?.guestActorIds[0];

  assert.equal(typeof guestActorId, "string");

  return selectActor(openResult, guestActorId, houseDefinition);
}

function selectViewModel(openResult, houseDefinition = marketHouse) {
  return marketHouseHouseModule.selectViewModel({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
  });
}

function investigateMarket(openResult, houseDefinition = marketHouse) {
  return marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "investigate-market",
    },
  });
}

function finishInvestigationReport(reportResult, houseDefinition = marketHouse) {
  return marketHouseHouseModule.dispatch({
    gameState: reportResult.gameState,
    characterDefinitions: reportResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: reportResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-investigation-report",
    },
  });
}

test("market house only exposes investigate market on the fixed shopkeeper", async () => {
  const { openResult } = await openMarketHouse();
  const hostViewModel = selectViewModel(openResult);

  assert.equal(
    hostViewModel.actionContainer?.actions.some(
      (action) => action.id === "investigate-market"
    ),
    true
  );

  const hostRosterEntry = hostViewModel.standbyRoster.find(
    (entry) => entry.characterId === marketHouse.defaultCharacterId
  );

  assert.ok(hostRosterEntry);
  assert.equal(
    hostRosterEntry.interactionActions?.some(
      (action) => action.id === "investigate-market"
    ),
    true
  );

  const guestResult = selectGuestActor(openResult);
  const guestViewModel = selectViewModel(guestResult);

  assert.equal(
    guestViewModel.actionContainer?.actions.some(
      (action) => action.id === "investigate-market"
    ) ?? false,
    false
  );

  const guestRosterEntry = guestViewModel.standbyRoster.find(
    (entry) => entry.characterId === guestResult.sessionState?.selectedActorId
  );

  assert.ok(guestRosterEntry);
  assert.equal(
    guestRosterEntry.interactionActions?.some(
      (action) => action.id === "investigate-market"
    ) ?? false,
    false
  );
});

test("market house medicine guest keeps a dedicated right-side portrait without overriding the left avatar", async () => {
  const { openResult } = await openMarketHouse(marketHouse, {
    guestActorIds: ["medicine_merchant"],
  });
  const guestResult = selectActor(openResult, "medicine_merchant");
  const guestViewModel = selectViewModel(guestResult);
  const guestRosterEntry = guestViewModel.standbyRoster.find(
    (entry) => entry.characterId === "medicine_merchant"
  );

  assert.ok(guestRosterEntry);
  assert.equal(guestRosterEntry.avatarArtClassName ?? null, null);
  assert.equal(
    guestRosterEntry.portraitArtClassName,
    "c-market-house-portrait-art--medicine-merchant"
  );
  assert.equal(guestViewModel.dialogue?.avatarArtClassName ?? null, null);
  assert.equal(
    guestViewModel.dialogue?.portraitArtClassName,
    "c-market-house-portrait-art--medicine-merchant"
  );
});

test("market house generic guest actors do not reuse the fixed host portrait art", async () => {
  const { openResult } = await openMarketHouse(marketHouse, {
    guestActorIds: ["horse_merchant"],
  });
  const guestResult = selectActor(openResult, "horse_merchant");
  const guestViewModel = selectViewModel(guestResult);
  const guestRosterEntry = guestViewModel.standbyRoster.find(
    (entry) => entry.characterId === "horse_merchant"
  );

  assert.ok(guestRosterEntry);
  assert.equal(guestRosterEntry.avatarArtClassName ?? null, null);
  assert.equal(
    guestRosterEntry.portraitArtClassName,
    "c-house-runtime-npc-portrait-art--merchant"
  );
  assert.equal(guestViewModel.dialogue?.avatarArtClassName ?? null, null);
  assert.equal(
    guestViewModel.dialogue?.portraitArtClassName,
    "c-house-runtime-npc-portrait-art--merchant"
  );
});

test("market house investigate market enters shopkeeper report dialogue and hides actions", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const reportResult = withMockedMathRandom(0, () =>
    investigateMarket(openResult, yingtianHouse)
  );
  const reportViewModel = selectViewModel(reportResult, yingtianHouse);
  const reportMarkup = renderMarketHouseView(reportViewModel);
  const reportLine = reportResult.sessionState?.dialogueLines[0] ?? "";

  assert.equal(reportResult.timeAdvanceCost, 1);
  assert.equal(reportResult.sessionState?.overlay, null);
  assert.equal(reportResult.sessionState?.dialoguePhase, "investigation-report");
  assert.equal(reportResult.sessionState?.dialogueLines.length, 1);
  assert.equal(
    reportResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-success"
  );
  assert.equal(
    reportResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "market-investigate"
  );
  assert.equal(
    reportResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    yingtianHouse.defaultCharacterId
  );
  assert.equal(reportViewModel.actionContainer, null);
  assert.equal(
    reportViewModel.dialogue?.advanceActionId,
    "advance-investigation-report"
  );
  assert.equal(
    (reportViewModel.dialogue?.advanceHintText?.length ?? 0) > 0,
    true
  );
  assert.match(reportMarkup, /c-grain-shop-dialogue__text--with-hint/);
  assert.equal(
    reportViewModel.standbyRoster.every(
      (entry) => (entry.interactionActions?.length ?? 0) === 0
    ),
    true
  );
  assert.doesNotMatch(reportLine, /^Local specialty:/);
  assert.doesNotMatch(reportLine, /^Featured route:/);
  assert.doesNotMatch(reportLine, /^Shopkeeper tip:/);
  assert.doesNotMatch(reportLine, /^本地特产：/u);
  assert.doesNotMatch(reportLine, /^紧缺地区：/u);
  assert.doesNotMatch(reportLine, /^掌柜口风：/u);
  assert.match(reportLine, /\*\*[^*]+\*\*/);
  assert.match(reportLine, /丝绸|纸笔/u);
  assert.match(reportLine, createOtherCityNamePattern(yingtianHouse.cityId));
  assert.match(reportMarkup, /c-dialogue-typewriter__strong/);
  assert.doesNotMatch(reportMarkup, /\*\*[^*]+\*\*/);
});

test("market house conversation-service investigation reuses the shopkeeper report flow", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const reportResult = withMockedMathRandom(0, () =>
    marketHouseHouseModule.dispatch({
      gameState: openResult.gameState,
      characterDefinitions: openResult.characterDefinitions,
      houseDefinition: yingtianHouse,
      playerCharacterId,
      sessionState: openResult.sessionState,
      request: {
        type: "conversation-service",
        serviceId: "market-investigate",
        rawPlayerText: "你这都有什么货",
        targetCharacterId: yingtianHouse.defaultCharacterId,
      },
    })
  );

  assert.equal(reportResult.timeAdvanceCost, 1);
  assert.equal(reportResult.sessionState?.overlay, null);
  assert.equal(reportResult.sessionState?.dialoguePhase, "investigation-report");
  assert.equal(reportResult.sessionState?.dialogueLines.length, 1);
  assert.equal(
    reportResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-success"
  );
  assert.equal(
    reportResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "market-investigate"
  );
});

test("market house investigate market emits a typed service-success memory event", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const reportResult = withMockedMathRandom(0, () =>
    investigateMarket(openResult, yingtianHouse)
  );

  assert.equal(
    reportResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-success"
  );
  assert.equal(
    reportResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "market-investigate"
  );
  assert.equal(
    reportResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    yingtianHouse.defaultCharacterId
  );
});

test("market house investigate market reports specialty intel in Chinese", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const reportResult = withMockedMathRandom(0, () =>
    investigateMarket(openResult, yingtianHouse)
  );
  const reportLines = reportResult.sessionState?.dialogueLines ?? [];
  const reportLine = reportLines[0] ?? "";

  assert.equal(reportLines.length, 1);
  assert.doesNotMatch(reportLine, /^本地特产：/u);
  assert.doesNotMatch(reportLine, /^紧缺地区：/u);
  assert.doesNotMatch(reportLine, /^掌柜口风：/u);
  assert.match(reportLine, /丝绸|纸笔/u);
  assert.match(reportLine, createOtherCityNamePattern(yingtianHouse.cityId));
  assert.doesNotMatch(
    reportLines.join("\n"),
    /Silk Textiles|Paper and Brush|Yingtian|Haozhou|Luzhou/u
  );
});

test("market house investigate market shows compact destination city names", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const runtimeCities = createRuntimeCitiesWithNameOverrides({
    "city.luzhou": "庐州路※合肥",
  });
  const originalRandom = Math.random;
  Math.random = () => 0;
  let openResult;
  try {
    ({ openResult } = await openMarketHouse(yingtianHouse, { runtimeCities }));
  } finally {
    Math.random = originalRandom;
  }
  const reportResult = withMockedMathRandom(0, () =>
    investigateMarket(openResult, yingtianHouse)
  );
  const reportLine = reportResult.sessionState?.dialogueLines[0] ?? "";
  const emphasizedTokens = [...reportLine.matchAll(/\*\*([^*]+)\*\*/g)].map(
    (match) => match[1]
  );

  assert.equal(emphasizedTokens.at(-1), "合肥");
  assert.doesNotMatch(reportLine, /庐州路/u);
  assert.doesNotMatch(reportLine, /※/u);
});

test("market house investigate market randomizes the shopkeeper route wording", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const firstResult = withMockedMathRandom(0, () =>
    investigateMarket(openResult, yingtianHouse)
  );
  const secondResult = withMockedMathRandom(0.999, () =>
    investigateMarket(openResult, yingtianHouse)
  );
  const firstLine = firstResult.sessionState?.dialogueLines[0] ?? "";
  const secondLine = secondResult.sessionState?.dialogueLines[0] ?? "";

  assert.equal(firstResult.sessionState?.dialogueLines.length, 1);
  assert.equal(secondResult.sessionState?.dialogueLines.length, 1);
  assert.notEqual(firstLine, secondLine);
  assert.match(firstLine, /丝绸|纸笔/u);
  assert.match(secondLine, /丝绸|纸笔/u);
  assert.match(firstLine, createOtherCityNamePattern(yingtianHouse.cityId));
  assert.match(secondLine, createOtherCityNamePattern(yingtianHouse.cityId));
});

test("market house guest inquiry only reports specialty intel in Chinese", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const guestResult = selectGuestActor(openResult, yingtianHouse);
  const reportLines = guestResult.sessionState?.dialogueLines ?? [];

  assert.equal(reportLines.length, 3);
  assert.match(reportLines[0] ?? "", /^特产门路：/u);
  assert.match(reportLines[1] ?? "", /^可去城路：/u);
  assert.match(reportLines[2] ?? "", /^客商口风：/u);
  assert.match(reportLines[0] ?? "", /丝绸|纸笔/u);
  assert.doesNotMatch(
    reportLines.join("\n"),
    /Silk Textiles|Paper and Brush|Yingtian|Haozhou|Luzhou/u
  );
});

test("market house investigate report restores normal buttons after advance", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const reportResult = investigateMarket(openResult, yingtianHouse);
  const resumedResult = finishInvestigationReport(reportResult, yingtianHouse);
  const resumedViewModel = selectViewModel(resumedResult, yingtianHouse);

  assert.equal(resumedResult.sessionState?.dialoguePhase, "open");
  assert.equal(
    resumedViewModel.actionContainer?.actions.some(
      (action) => action.id === "investigate-market"
    ) ?? false,
    true
  );
  assert.equal(
    resumedViewModel.standbyRoster.some(
      (entry) =>
        entry.characterId === yingtianHouse.defaultCharacterId &&
        (entry.interactionActions?.some(
          (action) => action.id === "investigate-market"
        ) ?? false)
    ),
    true
  );
});

test("market house investigate market gives different shopkeeper report lines by city", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const wenzhouHouse = createCityMarketHouse("city.wenzhou");
  const yingtianOpenResult = (await openMarketHouse(yingtianHouse)).openResult;
  const wenzhouOpenResult = (await openMarketHouse(wenzhouHouse)).openResult;

  const yingtianInvestigate = withMockedMathRandom(0, () =>
    investigateMarket(yingtianOpenResult, yingtianHouse)
  );
  const wenzhouInvestigate = withMockedMathRandom(0, () =>
    investigateMarket(wenzhouOpenResult, wenzhouHouse)
  );

  assert.equal(yingtianInvestigate.sessionState?.dialogueLines.length, 1);
  assert.equal(wenzhouInvestigate.sessionState?.dialogueLines.length, 1);
  assert.notEqual(
    yingtianInvestigate.sessionState?.dialogueLines.join("\n"),
    wenzhouInvestigate.sessionState?.dialogueLines.join("\n")
  );
});

test("market house investigation and specialty overlay derive from the same service snapshot", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const reportResult = investigateMarket(openResult, yingtianHouse);
  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: yingtianHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy-goods" },
  });

  const openedOverlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: yingtianHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
  });
  assert.equal(openedOverlayViewModel.overlay?.type, "market-trade");
  if (openedOverlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  const specialtyRow =
    openedOverlayViewModel.overlay.rows.find(
      (row) => row.goodsId === "silk_textiles" || row.goodsId === "paper_brush"
    ) ?? null;

  assert.ok(specialtyRow);

  const selectedOverlayResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: yingtianHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: {
      type: "action",
      actionId: `select-market-goods:${specialtyRow.goodsId}`,
    },
  });
  const overlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: selectedOverlayResult.gameState,
    characterDefinitions: selectedOverlayResult.characterDefinitions,
    houseDefinition: yingtianHouse,
    playerCharacterId,
    sessionState: selectedOverlayResult.sessionState,
  });

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  const selectedName = overlayViewModel.overlay.selectedSummary?.name ?? "";
  const reportLine = reportResult.sessionState?.dialogueLines[0] ?? "";
  assert.equal(
    reportLine.includes(selectedName) ||
      reportLine.includes("丝绸") ||
      reportLine.includes("纸笔"),
    true
  );
  assert.match(reportLine, createOtherCityNamePattern(yingtianHouse.cityId));
});
