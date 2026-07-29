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

function createBaseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1351,
    month: 1,
    day: 2,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

test("scene runner launches event-owned playable actions through the playable runtime", () => {
  const eventDefinition = {
    id: "event.playable.training",
    chapterId: "chapter.test",
    name: "Playable Training",
    occurrence: "repeatable",
    trigger: { timing: "manual" },
    conditions: [],
    entrySceneId: "dialogue.playable.training",
    actions: [
      {
        type: "launchPlayable",
        playableId: "activity-qte",
        integrationId: "playable.activity-qte.dialogue.default",
        ownerContext: {
          ownerKind: "dialogue",
          ownerId: "dialogue.playable.training",
          returnPolicy: "resume-owner",
        },
        payload: {
          activityId: "activity.training",
        },
      },
    ],
  };

  const result = runSceneUntilPause(startEvent(createBaseState(), eventDefinition), {
    sceneDefinitionsById: {},
    eventDefinitionsById: {
      [eventDefinition.id]: eventDefinition,
    },
    activityDefinitionsById: {
      "activity.training": {
        id: "activity.training",
        label: "Training",
        handlerId: "generic.qte",
        qte: {
          totalRounds: 1,
          requiredSuccesses: 1,
        },
      },
    },
    characterDefinitions: [{ id: "char.player", name: "Player" }],
  });

  assert.equal(result.state.ui.currentView, "minigame");
  assert.equal(result.state.scene.activeEventId, null);
  assert.equal(result.state.scene.activeSceneId, null);
  assert.equal(result.state.runtime.playableSession.playableId, "activity-qte");
  assert.equal(
    result.state.runtime.playableSession.ownerContext.sessionToken,
    "event.playable.training"
  );
  assert.equal(
    result.state.runtime.playableSession.ownerContext.ownerId,
    "dialogue.playable.training"
  );
  assert.equal(result.state.runtime.activitySession.activityId, "activity.training");
});
