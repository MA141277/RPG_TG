const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  tavernHouseModule,
} = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
const {
  renderTavernHouseView,
} = require("../.test-dist/ui/views/house/tavern-house-view.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeCityEntries,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const {
  KEEP_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/keep-house.js");

const playerCharacterId = "char.player";
const tavernHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tavern"
);

assert.ok(tavernHouse, "Expected prototype tavern house to exist.");

const repoRoot = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: tavernHouse.id,
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
        swordId: null,
        armorId: null,
      },
    },
    currentView: "house",
    characters: prototypeCharacters,
    houses: prototypeHouses,
    cityEntries: prototypeCityEntries,
    map: prototypeMap,
  });
}

function addTestDays(date, days) {
  const currentNumber = date.year * 360 + (date.month - 1) * 30 + date.day;
  const nextNumber = currentNumber + days;
  const nextYear = Math.floor((nextNumber - 1) / 360);
  const dayOfYear = nextNumber - nextYear * 360;

  return {
    year: nextYear,
    month: Math.floor((dayOfYear - 1) / 30) + 1,
    day: ((dayOfYear - 1) % 30) + 1,
  };
}

function withCouncilInDays(state, days = 30) {
  return {
    ...state,
    world: {
      ...state.world,
      schedule: {
        ...state.world.schedule,
        councilDate: addTestDays(state.calendar, days),
      },
    },
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: days,
      },
    },
  };
}

test("tavern work menus opt into red nine-slice classes while the closed tavern menu stays unchanged", () => {
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const openResult = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });
  const openWork = tavernHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });
  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });

  const closedView = tavernHouseModule.selectViewModel({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
  });
  const workView = tavernHouseModule.selectViewModel({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
  });

  assert.equal(closedView.actionContainer?.className ?? null, null);
  assert.equal(
    workView.actionContainer?.className,
    "c-house-red-nine-slice-actions c-tavern-work-actions"
  );
  assert.equal(
    workView.actionContainer?.buttonClassName,
    "c-house-red-nine-slice-button c-tavern-work-button"
  );

  const closedMarkup = renderTavernHouseView(closedView);
  const workMarkup = renderTavernHouseView(workView);

  assert.doesNotMatch(closedMarkup, /c-house-red-nine-slice-actions/);
  assert.match(workMarkup, /c-house-red-nine-slice-actions/);
  assert.match(workMarkup, /c-house-red-nine-slice-button/);
});

test("tavern work panels only keep work-scope actions plus return and never append default npc menu actions", () => {
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const openResult = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });
  const workMainResult = tavernHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });
  const acceptResult = tavernHouseModule.dispatch({
    gameState: workMainResult.gameState,
    characterDefinitions: workMainResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: workMainResult.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });
  const submitCandidate =
    acceptResult.sessionState?.availableOffers.find(
      (offer) => offer.id === "offer.kulan.supply_run"
    ) ??
    acceptResult.sessionState?.availableOffers.find(
      (offer) => offer.canStartImmediately !== true
    ) ??
    null;

  assert.ok(
    submitCandidate,
    "Expected tavern test fixtures to expose a non-immediate work offer for the submit panel."
  );

  const selectOfferResult = tavernHouseModule.dispatch({
    gameState: acceptResult.gameState,
    characterDefinitions: acceptResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptResult.sessionState,
    request: {
      type: "action",
      actionId: `accept-work:${submitCandidate.id}`,
    },
  });
  const confirmOfferResult = tavernHouseModule.dispatch({
    gameState: selectOfferResult.gameState,
    characterDefinitions: selectOfferResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: selectOfferResult.sessionState,
    request: {
      type: "action",
      actionId: `confirm-start-work:${submitCandidate.id}`,
    },
  });

  const workMainView = tavernHouseModule.selectViewModel({
    gameState: workMainResult.gameState,
    characterDefinitions: workMainResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: workMainResult.sessionState,
  });
  const acceptView = tavernHouseModule.selectViewModel({
    gameState: acceptResult.gameState,
    characterDefinitions: acceptResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptResult.sessionState,
  });
  const submitView = tavernHouseModule.selectViewModel({
    gameState: confirmOfferResult.gameState,
    characterDefinitions: confirmOfferResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: confirmOfferResult.sessionState,
  });

  assert.deepEqual(
    workMainView.actionContainer?.actions.map((action) => action.label),
    ["接取", "提交", "返回"]
  );
  assert.equal(
    workMainView.actionContainer?.actions.some((action) => action.label === "关闭"),
    false
  );
  assert.equal(
    acceptView.actionContainer?.actions.some((action) => action.label === "关闭"),
    false
  );
  assert.equal(
    submitView.actionContainer?.actions.some((action) => action.label === "关闭"),
    false
  );
  assert.equal(
    acceptView.actionContainer?.actions.at(-1)?.label,
    "返回"
  );
  assert.equal(
    submitView.actionContainer?.actions.at(-1)?.label,
    "返回"
  );

  for (const markup of [
    renderTavernHouseView(workMainView),
    renderTavernHouseView(acceptView),
    renderTavernHouseView(submitView),
  ]) {
    assert.doesNotMatch(markup, /data-npc-action="profile"/);
    assert.doesNotMatch(markup, /data-npc-action="talk"/);
    assert.doesNotMatch(markup, /data-npc-action="gift"/);
    assert.doesNotMatch(markup, />\s*关闭\s*</u);
  }
});

test("tavern work overlays use tavern-work popup classes while drink and gamble overlays do not", () => {
  const qteMarkup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    leaveAction: { id: "leave-house", label: "Leave" },
    overlay: {
      type: "qte-bar",
      title: "Dishwashing",
      taskLabel: "Stop inside the target zone",
      round: 1,
      totalRounds: 3,
      successes: 0,
      markerPercent: 10,
      targetStartPercent: 20,
      targetWidthPercent: 16,
      helperLines: ["Line one", "Line two"],
      stopActionId: "tavern-work-stop",
    },
  });
  const resultMarkup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    leaveAction: { id: "leave-house", label: "Leave" },
    overlay: {
      type: "result",
      title: "Work Result",
      grade: "A",
      score: 3,
      rewardLines: ["Reward 70 cash"],
      confirmActionId: "close-tavern-result",
      confirmLabel: "Collect",
    },
  });
  const confirmMarkup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    leaveAction: { id: "leave-house", label: "Leave" },
    overlay: {
      type: "confirm",
      title: "Submit Work",
      paragraphs: ["Confirm the hand-in."],
      overlayAttribute: ' data-house-overlay-variant="assessment-popup"',
      modalClassName:
        "c-assessment-popup c-house-tavern-work-popup c-house-tavern-work-confirm",
      actionsClassName: "c-house-red-nine-slice-actions",
      buttonClassName: "c-house-red-nine-slice-button c-tavern-work-button",
      confirmActionId: "confirm-submit-work",
      confirmLabel: "Confirm",
      cancelActionId: "cancel-submit-work",
      cancelLabel: "Later",
    },
  });
  const drinkEnterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });
  const drinkOpenResult = tavernHouseModule.dispatch({
    gameState: drinkEnterResult.gameState,
    characterDefinitions: drinkEnterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: drinkEnterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });
  const drinkConfirmResult = tavernHouseModule.dispatch({
    gameState: drinkOpenResult.gameState,
    characterDefinitions: drinkOpenResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: drinkOpenResult.sessionState,
    request: { type: "action", actionId: "order-drink" },
  });
  const drinkConfirmMarkup = renderTavernHouseView(
    tavernHouseModule.selectViewModel({
      gameState: drinkConfirmResult.gameState,
      characterDefinitions: drinkConfirmResult.characterDefinitions,
      houseDefinition: tavernHouse,
      playerCharacterId,
      sessionState: drinkConfirmResult.sessionState,
    })
  );
  const gambleMarkup = renderTavernHouseView({
    moduleId: "tavern",
    houseId: "house.tavern",
    sceneTitle: "Tavern",
    standbyRoster: [],
    dialogue: null,
    actionContainer: null,
    statusCard: null,
    leaveAction: { id: "leave-house", label: "Leave" },
    overlay: {
      type: "gamble",
      title: "Wager",
      variantLabel: "Short Table",
      wager: 100,
      options: [20, 100, 200],
      decrementActionId: "decrease-wager",
      incrementActionId: "increase-wager",
      confirmActionId: "confirm-gamble",
      confirmLabel: "Start",
      cancelActionId: "cancel-overlay",
      cancelLabel: "Cancel",
    },
  });

  assert.match(qteMarkup, /c-house-tavern-work-popup/);
  assert.match(qteMarkup, /c-house-tavern-work-qte/);
  assert.match(resultMarkup, /c-house-tavern-work-popup/);
  assert.match(resultMarkup, /c-house-tavern-work-result/);
  assert.match(confirmMarkup, /c-house-tavern-work-popup/);
  assert.match(confirmMarkup, /c-house-tavern-work-confirm/);
  assert.doesNotMatch(drinkConfirmMarkup, /c-house-tavern-work-popup/);
  assert.doesNotMatch(gambleMarkup, /c-house-tavern-work-popup/);
});

test("tavern work red nine-slice utility reuses the shared assessment button asset path", () => {
  const source = readSource("src/styles/grain-shop.css");
  const sharedAssetMatch = source.match(
    /\.c-grain-shop-modal\.c-assessment-popup\.c-house-contribution-settlement[\s\S]*?\.c-grain-shop-button--gold \{[\s\S]*?border-image-source:\s*url\("([^"]+)"\);/u
  );
  const utilityAssetMatch = source.match(
    /\.c-grain-shop-actions\.c-house-red-nine-slice-actions \.c-house-red-nine-slice-button,[\s\S]*?border-image-source:\s*url\("([^"]+)"\);/u
  );

  assert.ok(
    sharedAssetMatch,
    "Expected the shared assessment gold button rule to define a border image source."
  );
  assert.ok(
    utilityAssetMatch,
    "Expected tavern work red nine-slice utility block to define a border image source."
  );
  assert.equal(
    utilityAssetMatch[1],
    sharedAssetMatch[1]
  );
});
