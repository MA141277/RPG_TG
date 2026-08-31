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
  grainShopHouseModule,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-house-module.js");
const {
  medicineHouseHouseModule,
} = require("../.test-dist/application/house-modules/medicine-house/medicine-house-house-module.js");
const {
  teaHouseHouseModule,
} = require("../.test-dist/application/house-modules/tea-house/tea-house-house-module.js");
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
const grainShopHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "grain-shop"
);
const medicineHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "medicine-house"
);
const teaHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tea-house"
);

assert.ok(grainShopHouse, "Expected prototype grain shop to exist.");
assert.ok(medicineHouse, "Expected prototype medicine house to exist.");
assert.ok(teaHouse, "Expected prototype tea house to exist.");

function createCharacters(gold = 5000) {
  return prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold,
          },
        }
  );
}

function createBaseState(houseDefinition) {
  const state = createInitialState({
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

  return {
    ...state,
    world: {
      ...state.world,
      schedule: {
        ...state.world.schedule,
        councilDate: {
          year: state.calendar.year,
          month: state.calendar.month,
          day: 20,
        },
      },
    },
  };
}

function openModule(moduleDefinition, houseDefinition, options = {}) {
  defaultRuntimeContent.cities = prototypeCities;
  defaultRuntimeContent.cityNpcPools = prototypeCityNpcPools;
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(houseDefinition),
    prototypeCityNpcPools,
    () => 0.1
  );
  const enterResult = moduleDefinition.enter({
    gameState: state,
    characterDefinitions: createCharacters(options.gold ?? 5000),
    houseDefinition,
    playerCharacterId,
  });
  const openResult = moduleDefinition.dispatch({
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

test("grain shop buy preview and close without trade emit typed action-memory events", () => {
  const { openResult } = openModule(grainShopHouseModule, grainShopHouse);
  const previewResult = grainShopHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy" },
  });
  const closeResult = grainShopHouseModule.dispatch({
    gameState: previewResult.gameState,
    characterDefinitions: previewResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: previewResult.sessionState,
    request: { type: "action", actionId: "close-trade" },
  });

  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "panel-open"
  );
  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.panelId,
    "grain-buy"
  );
  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.resultKind,
    "preview"
  );
  assert.equal(
    closeResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "panel-close-without-action"
  );
  assert.equal(
    closeResult.observedEvents?.[0]?.houseActionMemory?.panelId,
    "grain-buy"
  );
  assert.equal(
    closeResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    grainShopHouse.defaultCharacterId
  );
});

test("grain shop confirm trade emits a typed buy-success memory event", () => {
  const { openResult } = openModule(grainShopHouseModule, grainShopHouse);
  const previewResult = grainShopHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "buy" },
  });
  const tradeResult = grainShopHouseModule.dispatch({
    gameState: previewResult.gameState,
    characterDefinitions: previewResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: previewResult.sessionState,
    request: { type: "action", actionId: "confirm-trade" },
  });

  assert.equal(
    tradeResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "trade-buy-success"
  );
  assert.equal(
    tradeResult.observedEvents?.[0]?.houseActionMemory?.panelId,
    "grain-buy"
  );
  assert.equal(
    tradeResult.observedEvents?.[0]?.houseActionMemory?.quantity,
    1
  );
  assert.equal(
    (tradeResult.observedEvents?.[0]?.houseActionMemory?.goldDelta ?? 0) < 0,
    true
  );
  assert.equal(
    tradeResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    grainShopHouse.defaultCharacterId
  );
});

test("medicine house buy preview and cancel emit typed service-memory events", () => {
  const { openResult } = openModule(
    medicineHouseHouseModule,
    medicineHouse
  );
  const previewResult = medicineHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-buy" },
  });
  const cancelResult = medicineHouseHouseModule.dispatch({
    gameState: previewResult.gameState,
    characterDefinitions: previewResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: previewResult.sessionState,
    request: { type: "action", actionId: "close-buy" },
  });

  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-preview"
  );
  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "medicine-buy"
  );
  assert.equal(
    cancelResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-cancel"
  );
  assert.equal(
    cancelResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "medicine-buy"
  );
  assert.equal(
    cancelResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    medicineHouse.defaultCharacterId
  );
});

test("medicine house confirm buy emits a typed service-success memory event", () => {
  const { openResult } = openModule(
    medicineHouseHouseModule,
    medicineHouse
  );
  const previewResult = medicineHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "open-buy" },
  });
  const selectedItemId =
    previewResult.sessionState?.overlay?.type === "buy"
      ? previewResult.sessionState.overlay.selectedItemId
      : null;
  const buyResult = medicineHouseHouseModule.dispatch({
    gameState: previewResult.gameState,
    characterDefinitions: previewResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: previewResult.sessionState,
    request: { type: "action", actionId: "confirm-buy" },
  });

  assert.equal(
    buyResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-success"
  );
  assert.equal(
    buyResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "medicine-buy"
  );
  assert.equal(
    buyResult.observedEvents?.[0]?.houseActionMemory?.itemId,
    selectedItemId
  );
  assert.equal(
    buyResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    medicineHouse.defaultCharacterId
  );
});

test("tea house debate preview and cancel emit typed service-memory events", () => {
  const { openResult } = openModule(teaHouseHouseModule, teaHouse);
  const previewResult = teaHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "start-debate" },
  });
  const cancelResult = teaHouseHouseModule.dispatch({
    gameState: previewResult.gameState,
    characterDefinitions: previewResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: previewResult.sessionState,
    request: { type: "action", actionId: "cancel-activity-confirm" },
  });

  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-preview"
  );
  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "tea-debate"
  );
  assert.equal(
    cancelResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-cancel"
  );
  assert.equal(
    cancelResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "tea-debate"
  );
  assert.equal(
    cancelResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    teaHouse.defaultCharacterId
  );
});

test("tea house inquire emits a typed service-success memory event", () => {
  const { openResult } = openModule(teaHouseHouseModule, teaHouse);
  const inquireResult = teaHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "inquire" },
  });

  assert.equal(
    inquireResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "service-success"
  );
  assert.equal(
    inquireResult.observedEvents?.[0]?.houseActionMemory?.serviceId,
    "tea-inquire"
  );
  assert.equal(
    inquireResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    teaHouse.defaultCharacterId
  );
});
