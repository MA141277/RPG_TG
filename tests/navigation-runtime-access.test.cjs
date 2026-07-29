const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createEnterCityRequest,
  createEnterHouseRequest,
  runNavigationRuntime,
} = require("../.test-dist/core/runtime/navigation-runtime.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.start",
    currentHouseId: null,
    playerCharacterId: "hero",
    chapterId: "chapter.test",
    year: 1560,
    month: 1,
    day: 1,
    pinnedCharacterId: "hero",
    reviewDateText: "",
    mainHouseMissionText: "",
    cards: { ownedCardIds: [] },
    valuables: { ownedItemIds: [] },
    currentView: "city",
  });
}

function createHouseDefinition() {
  return {
    id: "house.temple",
    cityId: "city.start",
    name: "Temple",
    type: "temple",
    characterIds: [],
    defaultCharacterId: "hero",
    backAction: { label: "Back", targetView: "city" },
  };
}

test("navigation runtime preserves enter-city behavior when access definitions are not provided", () => {
  const result = runNavigationRuntime({
    state: createBaseState(),
    request: createEnterCityRequest("city.next"),
  });

  assert.equal(result.state.world.currentCityId, "city.next");
  assert.deepEqual(result.navigation, { view: "city", cityId: "city.next" });
  assert.deepEqual(result.outcome, {
    type: "navigation.entered-city",
    cityId: "city.next",
  });
  assert.equal(result.access, undefined);
});

test("navigation runtime blocks enter-city when location access denies the target", () => {
  const state = createBaseState();
  const result = runNavigationRuntime({
    state,
    request: createEnterCityRequest("city.locked"),
    cityDefinitionsById: {
      "city.locked": {
        id: "city.locked",
        name: "Locked City",
        regionId: "region.test",
        mapNodeId: "node.locked",
        houseIds: [],
        neighbourCityIds: [],
        travelCost: 1,
        tags: [],
        prosperity: 1,
        danger: 9,
        specialDemand: [],
      },
    },
    locationAccessDefinitions: [
      {
        id: "access.city.locked",
        targetFamily: "city",
        targetId: "city.locked",
        conditionExpression: { type: "literal", value: false },
        blockedTitle: "Locked City",
        blockedMessage: "The road is closed.",
        guidance: "Return",
      },
    ],
  });

  assert.equal(result.state, state);
  assert.equal(result.navigation, null);
  assert.deepEqual(result.access, {
    canEnter: false,
    refusal: {
      ruleId: "access.city.locked",
      speakerCharacterId: "hero",
      title: "Locked City",
      text: "The road is closed.",
      confirmLabel: "Return",
    },
  });
  assert.equal(result.outcome, undefined);
});

test("navigation runtime blocks enter-house when location access denies the building", () => {
  const state = createBaseState();
  const result = runNavigationRuntime({
    state,
    request: createEnterHouseRequest("house.temple"),
    houseDefinition: createHouseDefinition(),
    eventDefinitionsById: {},
    locationAccessDefinitions: [
      {
        id: "access.house.temple",
        targetFamily: "building",
        targetId: "house.temple",
        conditionExpression: { type: "literal", value: false },
        blockedMessage: "The temple is closed.",
        guidance: "Leave",
      },
    ],
  });

  assert.equal(result.state, state);
  assert.equal(result.navigation, null);
  assert.deepEqual(result.access, {
    canEnter: false,
    refusal: {
      ruleId: "access.house.temple",
      speakerCharacterId: "hero",
      title: "Temple",
      text: "The temple is closed.",
      confirmLabel: "Leave",
    },
  });
});
