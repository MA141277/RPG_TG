const assert = require("node:assert/strict");
const test = require("node:test");

const {
  runSceneUntilPause,
} = require("../.test-dist/application/scene/scene-runner.js");
const {
  startEvent,
} = require("../.test-dist/application/events/event-runner.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  chooseStorySceneOption,
  startStoryEventById,
} = require("../.test-dist/application/story/story-runtime.js");
const {
  prototypeCharacters,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
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

function createEvent(id, entrySceneId, nextEventId) {
  return {
    id,
    chapterId: "chapter.prototype",
    name: id,
    occurrence: "repeatable",
    trigger: { timing: "manual" },
    conditions: [],
    entrySceneId,
    ...(nextEventId == null ? {} : { nextEventId }),
  };
}

test(
  "scene runner fails closed when automatic nextEvent continuation revisits an already continued event",
  () => {
    const eventDefinitionsById = {
      "event.loop.a": createEvent("event.loop.a", "scene.empty.a", "event.loop.b"),
      "event.loop.b": createEvent("event.loop.b", "scene.empty.b", "event.loop.a"),
    };

    const result = runSceneUntilPause(
      startEvent(createBaseState(), eventDefinitionsById["event.loop.a"]),
      {
        sceneDefinitionsById: {
          "scene.empty.a": { id: "scene.empty.a", name: "A", actions: [] },
          "scene.empty.b": { id: "scene.empty.b", name: "B", actions: [] },
        },
        eventDefinitionsById,
        characterDefinitions: prototypeCharacters,
      }
    );

    assert.equal(result.state.scene.activeEventId, null);
    assert.equal(result.state.scene.activeSceneId, null);
    assert.equal(result.state.scene.status, "idle");
    assert.equal(
      result.state.runtime.eventHistory["event.loop.a"]?.firedCount,
      1
    );
    assert.equal(
      result.state.runtime.eventHistory["event.loop.b"]?.firedCount,
      1
    );
  }
);

test(
  "story scene choice nextEvent fails closed when selected option points back to the active event",
  () => {
    const content = {
      eventDefinitionsById: {
        "event.choice.loop": createEvent("event.choice.loop", "scene.choice.loop"),
      },
      sceneDefinitionsById: {
        "scene.choice.loop": {
          id: "scene.choice.loop",
          name: "Choice Loop",
          actions: [
            {
              type: "choice",
              options: [
                {
                  id: "option.loop",
                  label: "Loop",
                  nextEventId: "event.choice.loop",
                },
              ],
            },
          ],
        },
      },
    };

    const runtime = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: prototypeCharacters,
      },
      content,
      "event.choice.loop"
    );

    assert.equal(runtime.state.scene.status, "waiting-choice");

    const continued = chooseStorySceneOption(runtime, content, {
      id: "option.loop",
      label: "Loop",
      nextEventId: "event.choice.loop",
    });

    assert.equal(continued.state.scene.activeEventId, null);
    assert.equal(continued.state.scene.activeSceneId, null);
    assert.equal(continued.state.scene.status, "idle");
    assert.equal(
      continued.state.runtime.eventHistory["event.choice.loop"]?.firedCount,
      1
    );
  }
);

test(
  "story scene choice nextEvent starts the selected follow-up event through the shared continuation seam",
  () => {
    const content = {
      eventDefinitionsById: {
        "event.choice.start": createEvent("event.choice.start", "scene.choice.start"),
        "event.choice.followup": createEvent(
          "event.choice.followup",
          "scene.empty.followup"
        ),
      },
      sceneDefinitionsById: {
        "scene.choice.start": {
          id: "scene.choice.start",
          name: "Choice Start",
          actions: [
            {
              type: "choice",
              options: [
                {
                  id: "option.followup",
                  label: "Follow-up",
                  nextEventId: "event.choice.followup",
                },
              ],
            },
          ],
        },
        "scene.empty.followup": {
          id: "scene.empty.followup",
          name: "Follow-up",
          actions: [],
        },
      },
    };

    const runtime = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: prototypeCharacters,
      },
      content,
      "event.choice.start"
    );

    const continued = chooseStorySceneOption(runtime, content, {
      id: "option.followup",
      label: "Follow-up",
      nextEventId: "event.choice.followup",
    });

    assert.equal(
      continued.state.runtime.eventHistory["event.choice.start"]?.firedCount,
      1
    );
    assert.equal(
      continued.state.runtime.eventHistory["event.choice.followup"]?.firedCount,
      1
    );
    assert.equal(continued.state.scene.activeEventId, null);
    assert.equal(continued.state.scene.activeSceneId, null);
    assert.equal(continued.state.scene.status, "idle");
  }
);
