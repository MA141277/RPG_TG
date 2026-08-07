const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createNavigateRequest,
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

function createEventDefinition(id, extra = {}) {
  return {
    id,
    chapterId: "chapter.test",
    name: id,
    occurrence: "repeatable",
    trigger: { timing: "manual" },
    conditions: [],
    entrySceneId: `${id}.scene`,
    ...extra,
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

test("navigation runtime supports canonical leaveBuilding route targets", () => {
  const baseState = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.start",
    currentHouseId: "house.temple",
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
    currentView: "house",
  });

  const result = runNavigationRuntime({
    state: baseState,
    request: createNavigateRequest({ kind: "leaveBuilding" }),
  });

  assert.equal(result.state.world.currentHouseId, null);
  assert.equal(result.state.ui.currentView, "city");
  assert.equal(result.state.ui.overlayView, null);
  assert.equal(result.state.ui.houseSession, null);
  assert.deepEqual(result.navigation, { view: "city", cityId: "city.start" });
});

test("navigation runtime supports canonical reenterBuilding route targets", () => {
  const result = runNavigationRuntime({
    state: createBaseState(),
    request: createNavigateRequest({
      kind: "reenterBuilding",
      houseId: "house.temple",
    }),
  });

  assert.equal(result.state.world.currentHouseId, "house.temple");
  assert.equal(result.state.ui.currentView, "house");
  assert.equal(result.state.ui.overlayView, null);
  assert.equal(result.state.ui.houseSession, null);
  assert.deepEqual(result.navigation, {
    view: "house",
    houseId: "house.temple",
  });
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

test(
  "navigation runtime routes house on-enter events through the shared runtime-dispatch seam",
  { concurrency: false },
  () => {
    const runtimeDispatchPath = require.resolve(
      "../.test-dist/core/runtime/runtime-dispatch.js"
    );
    const navigationRuntimePath = require.resolve(
      "../.test-dist/core/runtime/navigation-runtime.js"
    );

    delete require.cache[navigationRuntimePath];
    delete require.cache[runtimeDispatchPath];

    const patchedRuntimeDispatch = require(runtimeDispatchPath);
    const originalDispatchRuntimeRequest =
      patchedRuntimeDispatch.dispatchRuntimeRequest;
    let dispatchRuntimeRequestCalls = 0;

    patchedRuntimeDispatch.dispatchRuntimeRequest = (...args) => {
      dispatchRuntimeRequestCalls += 1;
      return originalDispatchRuntimeRequest(...args);
    };

    try {
      const {
        runNavigationRuntime: runNavigationRuntimeWithPatchedRouter,
        createEnterHouseRequest: createEnterHouseRequestWithPatchedRouter,
      } = require(navigationRuntimePath);
      const state = createBaseState();
      const result = runNavigationRuntimeWithPatchedRouter({
        state,
        request: createEnterHouseRequestWithPatchedRouter("house.temple"),
        houseDefinition: {
          ...createHouseDefinition(),
          onEnterEventId: "event.house.temple.enter",
        },
        eventDefinitionsById: {
          "event.house.temple.enter": createEventDefinition(
            "event.house.temple.enter"
          ),
        },
      });

      assert.equal(result.state.world.currentHouseId, "house.temple");
      assert.equal(result.state.scene.activeEventId, "event.house.temple.enter");
      assert.equal(
        result.state.scene.activeSceneId,
        "event.house.temple.enter.scene"
      );
      assert.deepEqual(result.navigation, {
        view: "house",
        houseId: "house.temple",
      });
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "navigation enter-house should route onEnterEventId through dispatchRuntimeRequest instead of stopping on the route-only seam"
      );
    } finally {
      patchedRuntimeDispatch.dispatchRuntimeRequest =
        originalDispatchRuntimeRequest;
      delete require.cache[navigationRuntimePath];
      delete require.cache[runtimeDispatchPath];
    }
  }
);
