const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  tavernHouseModule,
} = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
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
const {
  getTavernCompletedWorkKey,
  getTavernFailedWorkKey,
} = require("../.test-dist/domain/tavern.js");

const playerCharacterId = "char.player";
const tavernHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tavern"
);

assert.ok(tavernHouse, "Expected prototype tavern house to exist.");

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

function openAcceptPanel() {
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
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

  return tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });
}

function reopenAcceptPanel(afterResult) {
  const closeResult = closeResultOverlay(afterResult);
  const returnToWorkMenu = tavernHouseModule.dispatch({
    gameState: closeResult.gameState,
    characterDefinitions: closeResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: closeResult.sessionState,
    request: { type: "action", actionId: "return-to-work-menu" },
  });

  return tavernHouseModule.dispatch({
    gameState: returnToWorkMenu.gameState,
    characterDefinitions: returnToWorkMenu.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: returnToWorkMenu.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });
}

function closeResultOverlay(afterResult) {
  return tavernHouseModule.dispatch({
    gameState: afterResult.gameState,
    characterDefinitions: afterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: afterResult.sessionState,
    request: { type: "action", actionId: "close-tavern-result" },
  });
}

function finishDishwashingCycle() {
  const openAccept = openAcceptPanel();
  const acceptWork = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
  });
  const confirmedWork = tavernHouseModule.dispatch({
    gameState: acceptWork.gameState,
    characterDefinitions: acceptWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptWork.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.wash_dishes",
    },
  });

  let qteResult = confirmedWork;
  for (let round = 0; round < 3; round += 1) {
    qteResult = tavernHouseModule.dispatch({
      gameState: qteResult.gameState,
      characterDefinitions: qteResult.characterDefinitions,
      houseDefinition: tavernHouse,
      playerCharacterId,
      sessionState: {
        ...qteResult.sessionState,
        overlay: {
          ...qteResult.sessionState.overlay,
          markerPercent: qteResult.sessionState.overlay.targetStartPercent,
        },
      },
      request: { type: "action", actionId: "tavern-work-stop" },
    });
  }

  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: qteResult.gameState,
    characterDefinitions: qteResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: qteResult.sessionState,
    request: { type: "action", actionId: "submit-work:offer.kulan.wash_dishes" },
  });

  return tavernHouseModule.dispatch({
    gameState: openSubmitConfirm.gameState,
    characterDefinitions: openSubmitConfirm.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openSubmitConfirm.sessionState,
    request: { type: "action", actionId: "confirm-submit-work" },
  });
}

function failSupplyRunCycle() {
  const openAccept = openAcceptPanel();
  const acceptWork = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.supply_run" },
  });
  const confirmedWork = tavernHouseModule.dispatch({
    gameState: acceptWork.gameState,
    characterDefinitions: acceptWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptWork.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.supply_run",
    },
  });
  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: confirmedWork.gameState,
    characterDefinitions: confirmedWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: confirmedWork.sessionState,
    request: { type: "action", actionId: "submit-work:offer.kulan.supply_run" },
  });

  return tavernHouseModule.dispatch({
    gameState: openSubmitConfirm.gameState,
    characterDefinitions: openSubmitConfirm.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openSubmitConfirm.sessionState,
    request: { type: "action", actionId: "confirm-submit-work" },
  });
}

test("tavern dishwashing work returns to the available list after a successful submission", () => {
  const submitResult = finishDishwashingCycle();

  assert.deepEqual(submitResult.sideEffects, [
    { type: "stop-interval", intervalId: "tavern-work-qte" },
    {
      type: "play-coin-reward",
      playerCharacterId,
      delta: 70,
      source: "request-pointer",
    },
  ]);
  assert.equal(
    submitResult.gameState.runtime.flags[
      getTavernCompletedWorkKey(tavernHouse.id, "offer.kulan.wash_dishes")
    ],
    true
  );

  const reopenedAccept = reopenAcceptPanel(submitResult);

  assert.equal(
    reopenedAccept.sessionState?.availableOffers.some(
      (offer) => offer.id === "offer.kulan.wash_dishes"
    ),
    true
  );

  const acceptAgain = tavernHouseModule.dispatch({
    gameState: reopenedAccept.gameState,
    characterDefinitions: reopenedAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: reopenedAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
  });

  assert.equal(acceptAgain.sessionState?.overlay?.type, "activity-confirm");
});

test("tavern dishwashing submit result closes back into an accept list that still shows dishwashing", () => {
  const submitResult = finishDishwashingCycle();
  const closeResult = closeResultOverlay(submitResult);
  const closeView = tavernHouseModule.selectViewModel({
    gameState: closeResult.gameState,
    characterDefinitions: closeResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: closeResult.sessionState,
  });

  assert.equal(closeResult.sessionState?.overlay, null);
  assert.equal(
    closeView.actionContainer?.actions.some(
      (action) => action.id === "accept-work:offer.kulan.wash_dishes"
    ),
    true
  );
});

test("tavern failed placeholder work also returns to the available list after submission clears the active job", () => {
  const submitResult = failSupplyRunCycle();

  assert.deepEqual(submitResult.sideEffects, [
    { type: "stop-interval", intervalId: "tavern-work-qte" },
  ]);
  assert.equal(
    submitResult.gameState.runtime.flags[
      getTavernFailedWorkKey(tavernHouse.id, "offer.kulan.supply_run")
    ],
    true
  );

  const reopenedAccept = reopenAcceptPanel(submitResult);

  assert.equal(
    reopenedAccept.sessionState?.availableOffers.some(
      (offer) => offer.id === "offer.kulan.supply_run"
    ),
    true
  );

  const acceptAgain = tavernHouseModule.dispatch({
    gameState: reopenedAccept.gameState,
    characterDefinitions: reopenedAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: reopenedAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.supply_run" },
  });

  assert.equal(acceptAgain.sessionState?.overlay?.type, "activity-confirm");
});
