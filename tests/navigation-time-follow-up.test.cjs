const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  resolveCouncilPriorityHouseDefinition,
} = require("../.test-dist/application/runtime/navigation-time-follow-up.js");

function createBaseState(currentCityId = "city.kulan") {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId,
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

test(
  "resolveCouncilPriorityHouseDefinition applies city-scoped arrangement speaker override to the canonical priority house",
  () => {
    const gameState = createBaseState("city.kulan");
    const houseDefinitions = [
      {
        id: "house.template.keep",
        cityId: "city.other",
        name: "Keep",
        type: "castle",
        characterIds: [],
        defaultCharacterId: "char.keep.default",
        moduleId: "keep-house",
        backAction: {
          label: "Back",
          targetView: "city",
        },
      },
    ];
    const buildingArrangements = [
      {
        id: "arrangement.kulan.keep",
        cityId: "city.kulan",
        buildingId: "house.kulan.keep",
        mountedNpcIds: ["char.keep.kulan"],
        primaryNpcId: "char.keep.kulan",
        containers: [],
      },
    ];

    const resolved = resolveCouncilPriorityHouseDefinition(
      gameState,
      houseDefinitions,
      buildingArrangements
    );

    assert.ok(resolved);
    assert.equal(resolved.id, "house.template.keep");
    assert.equal(resolved.cityId, "city.kulan");
    assert.equal(resolved.defaultCharacterId, "char.keep.kulan");
  }
);
