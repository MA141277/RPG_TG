const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createActiveGameContent,
} = require("../.test-dist/application/content/active-game-content.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  startEvent,
} = require("../.test-dist/application/events/event-runner.js");
const {
  parseScenarioPack,
} = require("../.test-dist/application/scenario/scenario-pack-loader.js");
const {
  runDialogueFromEvent,
} = require("../.test-dist/core/runtime/dialogue-runtime.js");
const {
  runSceneFromEvent,
} = require("../.test-dist/core/runtime/scene-runtime.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

function createDialoguePack() {
  return {
    schemaVersion: 1,
    id: "pack.dialogue-runtime",
    title: "Dialogue Runtime",
    characters: [{ id: "char.player", name: "Player" }],
    events: [
      {
        id: "event.dialogue.opening",
        chapterId: "chapter.test",
        name: "Opening",
        occurrence: "repeatable",
        trigger: { timing: "manual" },
        conditions: [],
        entrySceneId: "dialogue.opening",
        dialogueId: "dialogue.opening",
      },
    ],
    dialogues: [
      {
        id: "dialogue.opening",
        name: "Opening Dialogue",
        nodes: [
          {
            type: "dialogue",
            characterId: "char.player",
            side: "left",
            text: "Hello",
          },
          {
            type: "jump",
            nextDialogueId: "dialogue.followup",
          },
        ],
      },
      {
        id: "dialogue.followup",
        name: "Follow-up Dialogue",
        nodes: [
          {
            type: "narration",
            text: "Follow-up",
          },
        ],
      },
    ],
  };
}

test("scenario packs may provide dialogues without legacy scenes", () => {
  const pack = parseScenarioPack({
    ...createDialoguePack(),
    scenarioProfile: {
      id: "scenario.dialogue-runtime",
      playerCharacterId: "char.player",
      chapterId: "chapter.test",
      initialLocation: {
        mapId: "map.test",
        cityId: "city.test",
        houseId: null,
        view: "city",
      },
    },
  });

  assert.equal(pack.scenes, undefined);
  assert.equal(pack.dialogues.length, 2);
});

test("active content exposes dialogue definitions as compatible scene definitions", () => {
  const content = createActiveGameContent(createDialoguePack());

  assert.equal(content.dialogueDefinitionsById["dialogue.opening"].id, "dialogue.opening");
  assert.equal(content.sceneDefinitionsById["dialogue.opening"].id, "dialogue.opening");
  assert.equal(
    content.sceneDefinitionsById["dialogue.opening"].actions[1].nextSceneId,
    "dialogue.followup"
  );
});

test("dialogue runtime runs dialogue definitions through the current scene carrier", () => {
  const content = createActiveGameContent(createDialoguePack());
  const eventDefinition = content.eventDefinitionsById["event.dialogue.opening"];
  const startedState = startEvent(createBaseState(), eventDefinition);

  const result = runDialogueFromEvent({
    state: startedState,
    characterDefinitions: content.characters,
    dialogueDefinitionsById: content.dialogueDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
  });

  assert.equal(result.state.scene.activeEventId, "event.dialogue.opening");
  assert.equal(result.state.scene.activeSceneId, "dialogue.opening");
  assert.equal(result.state.scene.status, "playing");
  assert.equal(result.session.dialogueId, "dialogue.opening");
  assert.equal(result.session.eventId, "event.dialogue.opening");
});

test("dialogue runtime accepts events that only declare dialogueId", () => {
  const content = createActiveGameContent({
    ...createDialoguePack(),
    events: [
      {
        id: "event.dialogue.dialogue-only",
        chapterId: "chapter.test",
        name: "Dialogue Only",
        occurrence: "repeatable",
        trigger: { timing: "manual" },
        conditions: [],
        entrySceneId: "",
        dialogueId: "dialogue.opening",
      },
    ],
  });
  const eventDefinition =
    content.eventDefinitionsById["event.dialogue.dialogue-only"];
  const startedState = startEvent(createBaseState(), eventDefinition);
  const result = runDialogueFromEvent({
    state: startedState,
    characterDefinitions: content.characters,
    dialogueDefinitionsById: content.dialogueDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
  });

  assert.equal(startedState.scene.activeSceneId, "dialogue.opening");
  assert.equal(result.state.scene.activeSceneId, "dialogue.opening");
  assert.equal(result.session?.dialogueId, "dialogue.opening");
  assert.equal(result.session?.eventId, "event.dialogue.dialogue-only");
});

test(
  "scene runtime routes automatic nextEvent continuation through the shared event-router seam",
  { concurrency: false },
  () => {
    const eventRouterPath = require.resolve(
      "../.test-dist/core/runtime/event-router.js"
    );
    const sceneRuntimePath = require.resolve(
      "../.test-dist/core/runtime/scene-runtime.js"
    );

    delete require.cache[sceneRuntimePath];
    delete require.cache[eventRouterPath];

    const patchedEventRouter = require(eventRouterPath);
    const originalDispatchEventRoute = patchedEventRouter.dispatchEventRoute;
    let dispatchEventRouteCalls = 0;

    patchedEventRouter.dispatchEventRoute = (...args) => {
      dispatchEventRouteCalls += 1;
      return originalDispatchEventRoute(...args);
    };

    try {
      const {
        runSceneFromEvent: runSceneFromEventWithPatchedRouter,
      } = require(sceneRuntimePath);
      const eventDefinitionsById = {
        "event.scene.start": {
          id: "event.scene.start",
          chapterId: "chapter.test",
          name: "Scene Start",
          occurrence: "repeatable",
          trigger: { timing: "manual" },
          conditions: [],
          entrySceneId: "scene.start",
          nextEventId: "event.scene.followup",
        },
        "event.scene.followup": {
          id: "event.scene.followup",
          chapterId: "chapter.test",
          name: "Scene Followup",
          occurrence: "repeatable",
          trigger: { timing: "manual" },
          conditions: [],
          entrySceneId: "scene.followup",
        },
      };
      const startedState = startEvent(
        createBaseState(),
        eventDefinitionsById["event.scene.start"]
      );

      const result = runSceneFromEventWithPatchedRouter({
        state: startedState,
        characterDefinitions: [{ id: "char.player", name: "Player" }],
        sceneDefinitionsById: {
          "scene.start": {
            id: "scene.start",
            name: "Scene Start",
            actions: [],
          },
          "scene.followup": {
            id: "scene.followup",
            name: "Scene Followup",
            actions: [],
          },
        },
        eventDefinitionsById,
      });

      assert.equal(
        result.state.runtime.eventHistory["event.scene.followup"]?.firedCount,
        1
      );
      assert.ok(
        dispatchEventRouteCalls > 0,
        "runSceneFromEvent should route continuation through dispatchEventRoute instead of leaving scene-runner on the local continuation fallback"
      );
    } finally {
      patchedEventRouter.dispatchEventRoute = originalDispatchEventRoute;
      delete require.cache[sceneRuntimePath];
      delete require.cache[eventRouterPath];
    }
  }
);

test(
  "dialogue runtime routes automatic nextEvent continuation through the shared event-router seam",
  { concurrency: false },
  () => {
    const eventRouterPath = require.resolve(
      "../.test-dist/core/runtime/event-router.js"
    );
    const dialogueRuntimePath = require.resolve(
      "../.test-dist/core/runtime/dialogue-runtime.js"
    );

    delete require.cache[dialogueRuntimePath];
    delete require.cache[eventRouterPath];

    const patchedEventRouter = require(eventRouterPath);
    const originalDispatchEventRoute = patchedEventRouter.dispatchEventRoute;
    let dispatchEventRouteCalls = 0;

    patchedEventRouter.dispatchEventRoute = (...args) => {
      dispatchEventRouteCalls += 1;
      return originalDispatchEventRoute(...args);
    };

    try {
      const {
        runDialogueFromEvent: runDialogueFromEventWithPatchedRouter,
      } = require(dialogueRuntimePath);
      const eventDefinitionsById = {
        "event.dialogue.empty": {
          id: "event.dialogue.empty",
          chapterId: "chapter.test",
          name: "Dialogue Empty",
          occurrence: "repeatable",
          trigger: { timing: "manual" },
          conditions: [],
          entrySceneId: "dialogue.empty",
          dialogueId: "dialogue.empty",
          nextEventId: "event.dialogue.followup",
        },
        "event.dialogue.followup": {
          id: "event.dialogue.followup",
          chapterId: "chapter.test",
          name: "Dialogue Followup",
          occurrence: "repeatable",
          trigger: { timing: "manual" },
          conditions: [],
          entrySceneId: "dialogue.followup",
          dialogueId: "dialogue.followup",
        },
      };
      const startedState = startEvent(
        createBaseState(),
        eventDefinitionsById["event.dialogue.empty"]
      );

      const result = runDialogueFromEventWithPatchedRouter({
        state: startedState,
        characterDefinitions: [{ id: "char.player", name: "Player" }],
        dialogueDefinitionsById: {
          "dialogue.empty": {
            id: "dialogue.empty",
            name: "Empty",
            nodes: [],
          },
          "dialogue.followup": {
            id: "dialogue.followup",
            name: "Followup",
            nodes: [],
          },
        },
        eventDefinitionsById,
      });

      assert.equal(
        result.state.runtime.eventHistory["event.dialogue.followup"]?.firedCount,
        1
      );
      assert.ok(
        dispatchEventRouteCalls > 0,
        "runDialogueFromEvent should route continuation through dispatchEventRoute instead of leaving scene-runner on the local continuation fallback"
      );
    } finally {
      patchedEventRouter.dispatchEventRoute = originalDispatchEventRoute;
      delete require.cache[dialogueRuntimePath];
      delete require.cache[eventRouterPath];
    }
  }
);
