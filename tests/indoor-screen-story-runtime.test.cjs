const test = require("node:test");
const assert = require("node:assert/strict");

const {
  applyIndoorScreenStoryFollowUp,
} = require("../.test-dist/application/runtime/indoor-screen-story-follow-up.js");
const {
  createMainRuntimeOrchestrator,
} = require("../.test-dist/application/runtime/main-runtime-orchestrator.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createHouseRuntimeBridge,
  enterHouseThroughRuntime,
} = require("../.test-dist/core/runtime/house-runtime.js");
const {
  prototypeCharacters,
  prototypeCities,
  prototypeHouses,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";
const targetCity = prototypeCities.find((city) => city.id === "city.kulan");
const targetHouse = prototypeHouses.find((house) => house.moduleId === "grain-shop");

assert.ok(targetCity, "Expected prototype city.kulan.");
assert.ok(targetHouse, "Expected prototype grain-shop house.");

const runtimeHouse = {
  id: "house.test.runtime",
  cityId: targetCity.id,
  name: "Runtime House",
  type: "custom",
  characterIds: [],
  outputMultiplier: 1,
  backAction: {
    label: "Back",
    targetView: "city",
  },
};

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: targetCity.id,
    currentHouseId: null,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

function createAppState() {
  const baseState = createBaseState();
  return {
    gameState: baseState,
    characterDefinitions: prototypeCharacters,
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  };
}

function createSettlementContent(eventDefinition, houseDefinition = targetHouse) {
  return {
    eventDefinitionsById: {
      [eventDefinition.id]: eventDefinition,
    },
    sceneDefinitionsById: {
      [eventDefinition.entrySceneId]: {
        id: eventDefinition.entrySceneId,
        name: "Settlement Scene",
        actions: [],
      },
    },
    settlementDefinitionsById: {
      [eventDefinition.settlementId]: {
        id: eventDefinition.settlementId,
        title: "Settlement Reward",
        contents: [
          {
            targetFamily: "city",
            targetId: targetCity.id,
            attributeKey: "prosperity",
            attributeType: "number",
            operation: "add",
            value: 5,
          },
          {
            targetFamily: "building",
            targetId: houseDefinition.id,
            attributeKey: "outputMultiplier",
            attributeType: "number",
            operation: "set",
            value: 3,
          },
        ],
      },
    },
    cityDefinitionsById: {
      [targetCity.id]: targetCity,
    },
    houseDefinitionsById: {
      [houseDefinition.id]: houseDefinition,
    },
  };
}

test("applyIndoorScreenStoryFollowUp projects settlement world updates into app-state status layers", () => {
  const appState = {
    ...createAppState(),
    gameState: {
      ...createBaseState(),
      world: {
        ...createBaseState().world,
        currentCityId: targetCity.id,
        currentHouseId: targetHouse.id,
      },
      ui: {
        ...createBaseState().ui,
        currentView: "house",
      },
    },
  };
  const content = createSettlementContent({
    id: "event.test.indoor-follow-up",
    chapterId: "chapter.prototype",
    name: "Indoor Follow Up",
    occurrence: "once",
    trigger: {
      timing: "indoor-screen-shown",
      scope: {
        cityId: targetCity.id,
        houseId: targetHouse.id,
      },
    },
    conditions: [],
    entrySceneId: "scene.test.indoor-follow-up",
    type: "settlement",
    settlementId: "settlement.test.indoor-follow-up",
  });

  const nextAppState = applyIndoorScreenStoryFollowUp({
    appState,
    content,
  });

  assert.equal(
    nextAppState.gameState.runtime.eventHistory["event.test.indoor-follow-up"]
      ?.firedCount,
    1
  );
  assert.deepEqual(nextAppState.cityStatusById?.[targetCity.id], {
    valuePatch: {
      prosperity: targetCity.prosperity + 5,
    },
  });
  assert.deepEqual(nextAppState.buildingStatusById?.[targetHouse.id], {
    runtimePatch: {
      outputMultiplier: 3,
    },
  });
});

test("main runtime orchestrator trigger-story-events projects settlement world updates", () => {
  let appState = createAppState();
  const eventDefinition = {
    id: "event.test.main-trigger",
    chapterId: "chapter.prototype",
    name: "Main Trigger",
    occurrence: "once",
    trigger: {
      timing: "city-enter",
      scope: {
        cityId: targetCity.id,
      },
    },
    conditions: [],
    entrySceneId: "scene.test.main-trigger",
    type: "settlement",
    settlementId: "settlement.test.main-trigger",
  };
  const storyContent = createSettlementContent(eventDefinition);
  const orchestrator = createMainRuntimeOrchestrator({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    setPlayerCharacterId: () => {},
    getStoryContent: () => storyContent,
    resetMainGameRuntime: () => {},
    setActiveContentContext: () => {},
    recreateHouseRuntime: () => {},
    setGameVisibility: () => {},
    hideMainUiFlow: () => {},
  });

  const result = orchestrator.execute({
    type: "trigger-story-events",
    timing: "city-enter",
    state: {
      ...appState.gameState,
      world: {
        ...appState.gameState.world,
        currentCityId: targetCity.id,
      },
    },
    characterDefinitions: appState.characterDefinitions,
  });

  assert.equal(
    result.gameState.runtime.eventHistory["event.test.main-trigger"]?.firedCount,
    1
  );
  assert.deepEqual(result.cityStatusById?.[targetCity.id], {
    valuePatch: {
      prosperity: targetCity.prosperity + 5,
    },
  });
  assert.deepEqual(result.buildingStatusById?.[targetHouse.id], {
    runtimePatch: {
      outputMultiplier: 3,
    },
  });
});

test("house runtime enter applies house-enter settlement world updates before render", () => {
  let appState = createAppState();
  let renderCount = 0;
  const eventDefinition = {
    id: "event.test.house-enter",
    chapterId: "chapter.prototype",
    name: "House Enter",
    occurrence: "once",
    trigger: {
      timing: "house-enter",
      scope: {
        cityId: targetCity.id,
        houseId: runtimeHouse.id,
      },
    },
    conditions: [],
    entrySceneId: "scene.test.house-enter",
    type: "settlement",
    settlementId: "settlement.test.house-enter",
  };
  const storyContent = createSettlementContent(eventDefinition, runtimeHouse);
  const runtime = createHouseRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {
      renderCount += 1;
    },
    startMapAutoAdvance: () => {},
    stopMapAutoAdvance: () => {},
    houseDefinitions: [runtimeHouse],
    playerCharacterId,
    eventDefinitionsById: storyContent.eventDefinitionsById,
    sceneDefinitionsById: storyContent.sceneDefinitionsById,
    settlementDefinitionsById: storyContent.settlementDefinitionsById,
    cityDefinitionsById: storyContent.cityDefinitionsById,
    houseDefinitionsById: storyContent.houseDefinitionsById,
    syncCouncilPriorityAfterGameStateChange: () => false,
  });

  enterHouseThroughRuntime(runtime, runtimeHouse.id);

  assert.equal(
    appState.gameState.runtime.eventHistory["event.test.house-enter"]?.firedCount,
    1
  );
  assert.deepEqual(appState.cityStatusById?.[targetCity.id], {
    valuePatch: {
      prosperity: targetCity.prosperity + 5,
    },
  });
  assert.deepEqual(appState.buildingStatusById?.[runtimeHouse.id], {
    runtimePatch: {
      outputMultiplier: 3,
    },
  });
  assert.equal(renderCount, 1);
});
