const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function createGameState(overrides = {}) {
  return {
    world: {
      currentCityId: "city.kulan",
      currentHouseId: null,
      ...overrides.world,
    },
    ui: {
      currentView: "city",
      ...overrides.ui,
    },
  };
}

function createHouseDefinitionsById() {
  return {
    "house.kulan.market": {
      id: "house.kulan.market",
      cityId: "city.kulan",
      name: "货栈",
    },
    "house.kulan.inn": {
      id: "house.kulan.inn",
      cityId: "city.kulan",
      name: "客栈",
    },
  };
}

test("house world-observed-event transition reports successful enter and leave house changes for downstream AI context", () => {
  const {
    collectHouseWorldObservedEventsForTransition,
  } = require("../.test-dist/application/runtime/transition/house-world-observed-event-transition.js");

  assert.deepEqual(
    collectHouseWorldObservedEventsForTransition({
      previousGameState: createGameState(),
      nextGameState: createGameState({
        world: {
          currentHouseId: "house.kulan.market",
        },
        ui: {
          currentView: "house",
        },
      }),
      houseDefinitionsById: createHouseDefinitionsById(),
    }),
    [
      {
        type: "system:enter-house",
        cityId: "city.kulan",
        houseId: "house.kulan.market",
        summary: "玩家进入了货栈。",
      },
    ]
  );

  assert.deepEqual(
    collectHouseWorldObservedEventsForTransition({
      previousGameState: createGameState({
        world: {
          currentHouseId: "house.kulan.market",
        },
        ui: {
          currentView: "house",
        },
      }),
      nextGameState: createGameState(),
      houseDefinitionsById: createHouseDefinitionsById(),
    }),
    [
      {
        type: "system:leave-house",
        cityId: "city.kulan",
        houseId: null,
        summary: "玩家离开了货栈。",
      },
    ]
  );
});

test("house world-observed-event transition stays silent when the player never actually changed buildings", () => {
  const {
    collectHouseWorldObservedEventsForTransition,
  } = require("../.test-dist/application/runtime/transition/house-world-observed-event-transition.js");

  assert.deepEqual(
    collectHouseWorldObservedEventsForTransition({
      previousGameState: createGameState({
        world: {
          currentHouseId: "house.kulan.market",
        },
        ui: {
          currentView: "house",
        },
      }),
      nextGameState: createGameState({
        world: {
          currentHouseId: "house.kulan.market",
        },
        ui: {
          currentView: "house",
        },
      }),
      houseDefinitionsById: createHouseDefinitionsById(),
    }),
    []
  );
});

test("main shell routes house enter and leave observation through the dedicated transition seam", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");

  assert.match(mainSource, /collectHouseWorldObservedEventsForTransition/u);
  assert.match(mainSource, /enterHouseThroughRuntimeWithObservedEvents/u);
  assert.match(mainSource, /leaveHouseThroughRuntimeWithObservedEvents/u);
});
