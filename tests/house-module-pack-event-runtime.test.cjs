const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  applyHouseModulePackEventById,
} = require("../.test-dist/application/house/house-module-pack-event-runtime.js");
const {
  templeHouseHouseModule,
} = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");

function createHouseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "house",
  });
}

function createTempleLeaveEvent() {
  return {
    id: "event.building.template.house.temple.leave",
    chapterId: "chapter.test",
    name: "Temple Leave",
    occurrence: "repeatable",
    dialogueId: "",
    actions: [{ type: "closeBuilding" }],
  };
}

test("house module pack event runtime can apply pack-owned close-building events", () => {
  const state = createHouseState();

  const result = applyHouseModulePackEventById({
    state,
    eventDefinitionsById: {
      "event.building.template.house.temple.leave": createTempleLeaveEvent(),
    },
    eventId: "event.building.template.house.temple.leave",
  });

  assert.equal(result.handled, true);
  assert.equal(result.state.world.currentHouseId, null);
  assert.equal(result.state.ui.currentView, "city");
});

test("temple leave uses the pack-owned leave event when the temple exit is not blocked", () => {
  const state = createHouseState();

  const result = templeHouseHouseModule.leave({
    gameState: state,
    characterDefinitions: [{ id: "char.player", name: "Player" }],
    houseDefinition: {
      id: "house.kulan.temple",
      cityId: "city.kulan",
      name: "皇觉寺",
      type: "temple",
      moduleId: "temple-house",
      defaultCharacterId: "char.player",
    },
    playerCharacterId: "char.player",
    sessionState: null,
    eventDefinitionsById: {
      "event.building.template.house.temple.leave": createTempleLeaveEvent(),
    },
    eventBindings: [],
    activityDefinitionsById: {},
    textEntriesById: {},
  });

  assert.equal(result.sessionState, null);
  assert.equal(result.gameState.world.currentHouseId, null);
  assert.equal(result.gameState.ui.currentView, "city");
});
