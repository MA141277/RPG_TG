const assert = require("node:assert/strict");
const test = require("node:test");

const {
  runEventBindingRuntime,
} = require("../.test-dist/core/runtime/event-binding-runtime.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

function createBaseState(extra = {}) {
  return {
    ...createInitialState({
      currentMapId: "map.test",
      currentCityId: "city.test",
      currentHouseId: "building.temple",
      playerCharacterId: "char.player",
      chapterId: "chapter.test",
      year: 1351,
      month: 1,
      day: 2,
      pinnedCharacterId: "char.player",
      reviewDateText: "test",
      mainHouseMissionText: "test",
      currentView: "house",
    }),
    ...extra,
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

test("event binding runtime starts the selected event through the shared entry", () => {
  const state = createBaseState();
  const result = runEventBindingRuntime({
    state,
    eventDefinitionsById: {
      "event.temple.work": createEventDefinition("event.temple.work"),
    },
    eventBindings: [
      {
        id: "binding.temple.work",
        eventId: "event.temple.work",
        owner: { family: "building", id: "building.temple" },
        trigger: { timing: "after", action: "building-enter" },
      },
    ],
    triggerContext: {
      timing: "after",
      action: "building-enter",
      owner: { family: "building", id: "building.temple" },
    },
  });

  assert.equal(result.activation.activeEventId, "event.temple.work");
  assert.equal(result.activation.sceneId, "event.temple.work.scene");
  assert.equal(result.state.scene.activeEventId, "event.temple.work");
  assert.equal(result.state.scene.activeSceneId, "event.temple.work.scene");
  assert.equal(result.state.ui.currentView, "scene");
  assert.equal(
    result.state.runtime.eventHistory["event.temple.work"].firedCount,
    1
  );
});

test("event binding runtime applies state-only runtime actions without opening a scene", () => {
  const state = createBaseState({
    ui: {
      ...createBaseState().ui,
      currentView: "house",
      overlayView: "detail",
      houseSession: { moduleId: "module.test", state: {} },
    },
  });
  const result = runEventBindingRuntime({
    state,
    eventDefinitionsById: {
      "event.close.building": createEventDefinition("event.close.building", {
        actions: [{ type: "closeBuilding" }],
      }),
    },
    eventBindings: [
      {
        id: "binding.close.building",
        eventId: "event.close.building",
        owner: { family: "building", id: "building.temple" },
        trigger: { timing: "after", action: "building-exit" },
      },
    ],
    triggerContext: {
      timing: "after",
      action: "building-exit",
      owner: { family: "building", id: "building.temple" },
    },
  });

  assert.equal(result.activation.activeEventId, "event.close.building");
  assert.equal(result.state.world.currentHouseId, null);
  assert.equal(result.state.ui.currentView, "city");
  assert.equal(result.state.ui.overlayView, null);
  assert.equal(result.state.ui.houseSession, null);
  assert.equal(result.state.scene.activeEventId, null);
  assert.equal(result.state.scene.activeSceneId, null);
});
