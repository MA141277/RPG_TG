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
  grainShopHouseModule,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-house-module.js");
const {
  medicineHouseHouseModule,
} = require("../.test-dist/application/house-modules/medicine-house/medicine-house-house-module.js");
const {
  tavernHouseModule,
} = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
const {
  teaHouseHouseModule,
} = require("../.test-dist/application/house-modules/tea-house/tea-house-house-module.js");
const {
  createHouseConversationActionCoordinator,
} = require("../.test-dist/application/runtime/house-conversation-action-coordinator.js");
const {
  getMarketHouseGuestActorIdsVariableKey,
} = require("../.test-dist/domain/market-house.js");
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
const grainShopHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "grain-shop"
);
const medicineHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "medicine-house"
);
const tavernHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tavern"
);
const teaHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tea-house"
);

assert.ok(marketHouse, "Expected prototype market house to exist.");
assert.ok(grainShopHouse, "Expected prototype grain shop to exist.");
assert.ok(medicineHouse, "Expected prototype medicine house to exist.");
assert.ok(tavernHouse, "Expected prototype tavern to exist.");
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

function openModule(moduleDefinition, houseDefinition, options = {}) {
  defaultRuntimeContent.cities = prototypeCities;
  defaultRuntimeContent.cityNpcPools = prototypeCityNpcPools;
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
    request: { type: "action", actionId: "advance-greeting" },
  });

  return {
    enterResult,
    openResult,
  };
}

function selectConversationServiceIds(
  moduleDefinition,
  result,
  houseDefinition
) {
  assert.equal(typeof moduleDefinition.selectConversationServices, "function");
  return moduleDefinition
    .selectConversationServices({
      gameState: result.gameState,
      characterDefinitions: result.characterDefinitions,
      houseDefinition,
      playerCharacterId,
      sessionState: result.sessionState,
    })
    .map((service) => service.serviceId);
}

function createCoordinatorHouseStageOutput() {
  return {
    type: "house",
    activeHouse: {
      id: "house.kulan.market",
      cityId: "city.kulan",
      name: "货栈",
      type: "merchant",
      moduleId: "market-house",
      characterIds: ["char.kulan_merchant"],
      defaultCharacterId: "char.kulan_merchant",
      backAction: { label: "返回濠州", targetView: "city" },
    },
    moduleViewModel: {
      moduleId: "market-house",
      houseId: "house.kulan.market",
      sceneTitle: "货栈",
      standbyRoster: [
        {
          characterId: "char.kulan_merchant",
          name: "钱掌柜",
          isSelected: true,
        },
      ],
      dialogue: null,
      actionContainer: {
        actions: [
          {
            id: "buy-goods",
            label: "买入货物",
          },
        ],
      },
      statusCard: null,
      overlay: null,
      leaveAction: { id: "leave-house", label: "离开货栈" },
    },
    cityNpcSummaries: [],
  };
}

function createCoordinatorAppState() {
  const gameState = createBaseState({
    id: "house.kulan.market",
    cityId: "city.kulan",
    name: "货栈",
    type: "merchant",
    moduleId: "market-house",
    characterIds: ["char.kulan_merchant"],
    defaultCharacterId: "char.kulan_merchant",
    backAction: { label: "返回濠州", targetView: "city" },
  });

  return {
    gameState: {
      ...gameState,
      ui: {
        ...gameState.ui,
        npcInteractionSession: {
          mode: "ai-dialogue",
          targetCharacterId: "char.kulan_merchant",
          context: {
            type: "house",
            houseId: "house.kulan.market",
            moduleId: "market-house",
          },
          requestId: "npc-request",
          messages: [],
          customInputOpen: false,
          currentOptions: [],
          streamingText: "",
          status: "idle",
          errorNotice: null,
          started: true,
          pendingSpecialActionId: null,
          pendingRoute: null,
          memoriesByCharacterId: {},
        },
      },
    },
    characterDefinitions: createCharacters(),
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: { facingDegrees: 0, isMoving: false },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityCardDrawTestState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {
      active: false,
      selectedTargetId: null,
      selectedComponentId: null,
      selectedElementId: null,
      backgroundMode: "off",
      backgroundAssetId: null,
      backgroundAssetQuery: "",
      backgroundSlice: null,
      battleUiValues: {},
    },
    worldIntentState: {
      draftText: "",
      status: "idle",
      currentRequestId: null,
      pendingResolution: null,
      lastError: null,
    },
  };
}

test("market house publishes hidden conversation services for the fixed host", () => {
  const { openResult } = openModule(marketHouseHouseModule, marketHouse);

  assert.deepEqual(
    selectConversationServiceIds(
      marketHouseHouseModule,
      openResult,
      marketHouse
    ),
    ["market-buy", "market-sell", "market-investigate"]
  );
});

test("market house guest-selected state does not expose host-only conversation services", () => {
  const { openResult } = openModule(marketHouseHouseModule, marketHouse, {
    guestActorIds: ["medicine_merchant"],
  });
  const guestResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "select-market-actor:medicine_merchant",
    },
  });

  assert.deepEqual(
    selectConversationServiceIds(
      marketHouseHouseModule,
      guestResult,
      marketHouse
    ),
    []
  );
});

test("grain shop publishes hidden conversation services for trade intel and accounting", () => {
  const { openResult } = openModule(grainShopHouseModule, grainShopHouse);

  assert.deepEqual(
    selectConversationServiceIds(
      grainShopHouseModule,
      openResult,
      grainShopHouse
    ),
    ["grain-buy", "grain-sell", "grain-intel", "grain-accounting"]
  );
});

test("medicine house publishes hidden conversation services for heal buy and compounding", () => {
  const { openResult } = openModule(medicineHouseHouseModule, medicineHouse);

  assert.deepEqual(
    selectConversationServiceIds(
      medicineHouseHouseModule,
      openResult,
      medicineHouse
    ),
    ["medicine-heal", "medicine-buy", "medicine-compound"]
  );
});

test("tavern publishes hidden conversation services for work drink and gamble", () => {
  const { openResult } = openModule(tavernHouseModule, tavernHouse);

  assert.deepEqual(
    selectConversationServiceIds(
      tavernHouseModule,
      openResult,
      tavernHouse
    ),
    ["tavern-work", "tavern-drink", "tavern-gamble"]
  );
});

test("tea house publishes hidden conversation services for tea inquiry and debate", () => {
  const { openResult } = openModule(teaHouseHouseModule, teaHouse);

  assert.deepEqual(
    selectConversationServiceIds(teaHouseHouseModule, openResult, teaHouse),
    ["tea-serve", "tea-inquire", "tea-debate"]
  );
});

test("house conversation coordinator dispatches settled house services with the current NPC target", () => {
  let appState = createCoordinatorAppState();
  const dispatchedServices = [];
  let closeCount = 0;
  const coordinator = createHouseConversationActionCoordinator({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    getStageOutput: () => createCoordinatorHouseStageOutput(),
    renderApp() {},
    closeActiveRequest: () => {
      closeCount += 1;
    },
    dispatchHouseConversationService: (input) => {
      dispatchedServices.push(input);
    },
  });

  const dispatched = coordinator.dispatchResolvedRoute({
    kind: "settle-house-service",
    serviceId: "market-investigate",
    rawPlayerText: "你这都有什么货",
  });

  assert.equal(dispatched, true);
  assert.equal(closeCount, 1);
  assert.deepEqual(dispatchedServices, [
    {
      serviceId: "market-investigate",
      rawPlayerText: "你这都有什么货",
      targetCharacterId: "char.kulan_merchant",
    },
  ]);
});
