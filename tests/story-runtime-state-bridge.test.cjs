const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createStoryRuntimeDefinitionContext,
  applyStoryRuntimeResultToAppState,
} = require("../.test-dist/application/story/story-runtime-state-bridge.js");

test("createStoryRuntimeDefinitionContext materializes authored world definitions through app-state status layers", () => {
  const appState = {
    gameState: { runtime: { flags: {} } },
    characterDefinitions: [],
    playerCoordinate: { q: 0, r: 0 },
    campaignActorState: { facingDegrees: 0, isMoving: false },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: { isOpen: false, targetId: null },
    cityStatusById: {
      "city.test": {
        valuePatch: { prosperity: 22, specialDemand: ["salt", "tea"] },
      },
    },
    buildingStatusById: {
      "house.test": {
        profilePatch: { defaultCharacterId: "char.override" },
        runtimePatch: { outputMultiplier: 3 },
      },
    },
  };
  const content = {
    cityDefinitionsById: {
      "city.test": {
        id: "city.test",
        name: "Test City",
        regionId: "region.test",
        mapNodeId: "settlement.test",
        houseIds: ["house.test"],
        neighbourCityIds: [],
        travelCost: 1,
        tags: ["market"],
        prosperity: 10,
        danger: 5,
        specialDemand: ["grain"],
      },
    },
    houseDefinitionsById: {
      "house.test": {
        id: "house.test",
        cityId: "city.test",
        name: "Test House",
        type: "custom",
        characterIds: [],
        defaultCharacterId: "char.base",
        outputMultiplier: 1,
        backAction: {
          label: "Back",
          targetView: "city",
        },
      },
    },
  };

  const result = createStoryRuntimeDefinitionContext(appState, content);

  assert.equal(result.cityDefinitions?.[0].prosperity, 22);
  assert.deepEqual(result.cityDefinitions?.[0].specialDemand, ["salt", "tea"]);
  assert.equal(result.houseDefinitions?.[0].defaultCharacterId, "char.override");
  assert.equal(result.houseDefinitions?.[0].outputMultiplier, 3);
});

test("applyStoryRuntimeResultToAppState derives city and building status patches from runtime definitions", () => {
  const appState = {
    gameState: { runtime: { flags: { before: true } } },
    characterDefinitions: [{ id: "char.player", stamina: 10 }],
    playerCoordinate: { q: 0, r: 0 },
    campaignActorState: { facingDegrees: 0, isMoving: false },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: { isOpen: false, targetId: null },
  };
  const content = {
    cityDefinitionsById: {
      "city.test": {
        id: "city.test",
        name: "Test City",
        regionId: "region.test",
        mapNodeId: "settlement.test",
        houseIds: ["house.test"],
        neighbourCityIds: [],
        travelCost: 1,
        tags: ["market"],
        prosperity: 10,
        danger: 5,
        specialDemand: ["grain"],
      },
    },
    houseDefinitionsById: {
      "house.test": {
        id: "house.test",
        cityId: "city.test",
        name: "Test House",
        type: "custom",
        characterIds: [],
        defaultCharacterId: "char.base",
        level: 1,
        damaged: false,
        outputMultiplier: 1,
        backAction: {
          label: "Back",
          targetView: "city",
        },
      },
    },
  };
  const runtimeResult = {
    state: { runtime: { flags: { after: true } } },
    characterDefinitions: [{ id: "char.player", stamina: 20 }],
    cityDefinitions: [
      {
        ...content.cityDefinitionsById["city.test"],
        prosperity: 15,
        specialDemand: ["grain", "salt"],
      },
    ],
    houseDefinitions: [
      {
        ...content.houseDefinitionsById["house.test"],
        defaultCharacterId: "char.override",
        outputMultiplier: 4,
      },
    ],
  };

  const nextAppState = applyStoryRuntimeResultToAppState(
    appState,
    content,
    runtimeResult
  );

  assert.deepEqual(nextAppState.gameState.runtime.flags, { after: true });
  assert.deepEqual(nextAppState.characterDefinitions, [
    { id: "char.player", stamina: 20 },
  ]);
  assert.deepEqual(nextAppState.cityStatusById, {
    "city.test": {
      valuePatch: {
        prosperity: 15,
        specialDemand: ["grain", "salt"],
      },
    },
  });
  assert.deepEqual(nextAppState.buildingStatusById, {
    "house.test": {
      profilePatch: { defaultCharacterId: "char.override" },
      runtimePatch: { outputMultiplier: 4 },
    },
  });
});
