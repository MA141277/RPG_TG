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
  renderMarketHouseView,
} = require("../.test-dist/ui/views/house/market-house-view.js");
const {
  defaultPackTextEntries,
} = require("../.test-dist/content/pack-content-access.js");
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

async function openMarketHouse(houseDefinition = marketHouse) {
  defaultRuntimeContent.cities = prototypeCities;
  defaultRuntimeContent.textEntriesById = defaultPackTextEntries;
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(houseDefinition),
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

function selectGuestActor(openResult, houseDefinition = marketHouse) {
  const guestActorId = openResult.sessionState?.guestActorIds[0];

  assert.equal(typeof guestActorId, "string");

  return marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: `select-market-actor:${guestActorId}`,
    },
  });
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

test("market house investigate market enters shopkeeper report dialogue and hides actions", async () => {
  const yingtianHouse = createCityMarketHouse("city.yingtian");
  const { openResult } = await openMarketHouse(yingtianHouse);
  const reportResult = investigateMarket(openResult, yingtianHouse);
  const reportViewModel = selectViewModel(reportResult, yingtianHouse);
  const reportMarkup = renderMarketHouseView(reportViewModel);

  assert.equal(reportResult.timeAdvanceCost, 1);
  assert.equal(reportResult.sessionState?.overlay, null);
  assert.equal(reportResult.sessionState?.dialoguePhase, "investigation-report");
  assert.equal(reportResult.sessionState?.dialogueLines.length, 3);
  assert.equal(reportViewModel.actionContainer, null);
  assert.equal(reportViewModel.dialogue?.advanceActionId, "advance-investigation-report");
  assert.equal(reportViewModel.dialogue?.advanceHintText, "点击继续");
  assert.match(reportMarkup, /c-grain-shop-dialogue__text--with-hint/);
  assert.equal(
    reportViewModel.standbyRoster.every(
      (entry) => (entry.interactionActions?.length ?? 0) === 0
    ),
    true
  );
  assert.doesNotMatch(reportResult.sessionState?.dialogueLines[0] ?? "", /^本地特产：/);
  assert.doesNotMatch(reportResult.sessionState?.dialogueLines[1] ?? "", /^紧缺地区：/);
  assert.doesNotMatch(reportResult.sessionState?.dialogueLines[2] ?? "", /^掌柜口风：/);
  assert.match(
    reportResult.sessionState?.dialogueLines[0] ?? "",
    /\*\*云锦\*\*/
  );
  assert.match(
    reportResult.sessionState?.dialogueLines[1] ?? "",
    /\*\*濠州\*\*/
  );
  assert.match(
    reportResult.sessionState?.dialogueLines[1] ?? "",
    /\*\*(云锦|金箔)\*\*/
  );
  assert.match(
    reportMarkup,
    /<strong class="c-dialogue-typewriter__strong"><span[^>]*>云<\/span><span[^>]*>锦<\/span><\/strong>/
  );
  assert.doesNotMatch(
    reportMarkup,
    /\*\*云锦\*\*/
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

  const yingtianInvestigate = investigateMarket(
    (await openMarketHouse(yingtianHouse)).openResult,
    yingtianHouse
  );
  const wenzhouInvestigate = investigateMarket(
    (await openMarketHouse(wenzhouHouse)).openResult,
    wenzhouHouse
  );

  assert.equal(yingtianInvestigate.sessionState?.dialogueLines.length, 3);
  assert.equal(wenzhouInvestigate.sessionState?.dialogueLines.length, 3);
  assert.notEqual(
    yingtianInvestigate.sessionState?.dialogueLines.join("\n"),
    wenzhouInvestigate.sessionState?.dialogueLines.join("\n")
  );
});
