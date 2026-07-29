const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

assert.equal(
  fs.existsSync(
    path.join(
      process.cwd(),
      "src/application/building/building-container-event-runtime.ts"
    )
  ),
  true,
  "building container event runtime source module should exist"
);

const {
  triggerBuildingContainerItemAction,
} = require("../.test-dist/application/building/building-container-event-runtime.js");

function createState() {
  return {
    world: {
      currentMapId: "map.test",
      currentCityId: "city.test",
      currentHouseId: "building.temple",
      timeOfDay: "morning",
      schedule: {
        councilDate: { year: 1351, month: 1, day: 1 },
      },
    },
    player: { characterId: "char.player" },
    calendar: {
      chapterId: "chapter.test",
      year: 1351,
      month: 1,
      day: 2,
    },
    scene: {
      activeEventId: null,
      activeSceneId: null,
      cursor: 0,
      status: "idle",
    },
    ui: { currentView: "house" },
    runtime: {
      flags: {},
      variables: {},
      eventHistory: {},
    },
  };
}

function createEventDefinition(id) {
  return {
    id,
    chapterId: "chapter.test",
    name: id,
    occurrence: "repeatable",
    trigger: { timing: "manual" },
    conditions: [],
    entrySceneId: `${id}.scene`,
  };
}

test("building container item action starts the matching bound event", () => {
  const state = createState();
  const characterDefinitions = [{ id: "char.player" }];

  const result = triggerBuildingContainerItemAction({
    state,
    characterDefinitions,
    eventDefinitionsById: {
      "event.temple.work": createEventDefinition("event.temple.work"),
    },
    eventBindings: [
      {
        id: "binding.temple.work",
        eventId: "event.temple.work",
        owner: {
          family: "building",
          id: "building.temple",
        },
        trigger: {
          timing: "after",
          action: "building-container-item-action",
          extra: {
            arrangementId: "arrangement.temple",
            containerId: "container.temple.actions",
            itemId: "work",
          },
        },
        priority: 1,
      },
    ],
    action: {
      arrangementId: "arrangement.temple",
      containerId: "container.temple.actions",
      itemId: "work",
    },
  });

  assert.equal(result.handled, true);
  assert.equal(result.activation?.activeEventId, "event.temple.work");
  assert.equal(result.state.scene.activeEventId, "event.temple.work");
  assert.equal(result.state.scene.activeSceneId, "event.temple.work.scene");
  assert.equal(result.state.ui.currentView, "scene");
  assert.equal(
    result.state.runtime.eventHistory["event.temple.work"].firedCount,
    1
  );
  assert.equal(result.characterDefinitions, characterDefinitions);
});

test("building container item action ignores nonmatching payload and missing house context", () => {
  const state = createState();
  const characterDefinitions = [{ id: "char.player" }];
  const eventDefinitionsById = {
    "event.temple.work": createEventDefinition("event.temple.work"),
  };
  const eventBindings = [
    {
      id: "binding.temple.work",
      eventId: "event.temple.work",
      owner: { family: "building", id: "building.temple" },
      trigger: {
        timing: "after",
        action: "building-container-item-action",
        extra: {
          arrangementId: "arrangement.temple",
          containerId: "container.temple.actions",
          itemId: "work",
        },
      },
    },
  ];

  const nonmatching = triggerBuildingContainerItemAction({
    state,
    characterDefinitions,
    eventDefinitionsById,
    eventBindings,
    action: {
      arrangementId: "arrangement.temple",
      containerId: "container.temple.actions",
      itemId: "rest",
    },
  });

  assert.equal(nonmatching.handled, false);
  assert.equal(nonmatching.state, state);

  const missingHouse = triggerBuildingContainerItemAction({
    state: {
      ...state,
      world: {
        ...state.world,
        currentHouseId: null,
      },
    },
    characterDefinitions,
    eventDefinitionsById,
    eventBindings,
    action: {
      arrangementId: "arrangement.temple",
      containerId: "container.temple.actions",
      itemId: "work",
    },
  });

  assert.equal(missingHouse.handled, false);
  assert.equal(missingHouse.state.world.currentHouseId, null);
});
