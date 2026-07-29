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
  continueStoryFromSourceEvent,
  startStoryEventById,
} = require("../.test-dist/application/story/story-runtime.js");
const {
  applyEventOwnedPlayableCompletion,
} = require("../.test-dist/application/events/event-playable-runtime.js");
const {
  prototypeCharacters,
  prototypeCities,
  prototypeHouses,
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

function createEventOwnedPlayableSession(sourceEventId) {
  return {
    sessionId: "playable.story-battle",
    playableId: "story-battle",
    integrationId: "playable.story-battle.scene.default",
    family: "battle",
    status: "active",
    ownerContext: {
      ownerKind: "scene",
      ownerId: "scene.source",
      returnPolicy: "reenter-owner",
      sessionToken: sourceEventId,
    },
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

test(
  "event-owned playable completion continues the source event through story continuation seam",
  () => {
    assert.equal(
      typeof continueStoryFromSourceEvent,
      "function",
      "story runtime should expose event-owned playable continuation"
    );

    const content = {
      eventDefinitionsById: {
        "event.playable.source": createEvent(
          "event.playable.source",
          "scene.playable.source",
          "event.playable.followup"
        ),
        "event.playable.followup": createEvent(
          "event.playable.followup",
          "scene.playable.followup"
        ),
      },
      sceneDefinitionsById: {
        "scene.playable.source": {
          id: "scene.playable.source",
          name: "Playable Source",
          actions: [],
        },
        "scene.playable.followup": {
          id: "scene.playable.followup",
          name: "Playable Follow-up",
          actions: [],
        },
      },
    };

    const result = applyEventOwnedPlayableCompletion({
      state: createBaseState(),
      characterDefinitions: prototypeCharacters,
      previousPlayableSession: createEventOwnedPlayableSession(
        "event.playable.source"
      ),
      settlement: { outcome: "success" },
      continueFromSourceEvent: ({ sourceEventId, state, characterDefinitions }) =>
        continueStoryFromSourceEvent(
          {
            state,
            characterDefinitions,
          },
          content,
          sourceEventId
        ),
    });

    assert.equal(result.handled, true);
    assert.equal(
      result.state.runtime.eventHistory["event.playable.followup"]?.firedCount,
      1
    );
    assert.equal(result.state.scene.activeEventId, null);
    assert.equal(result.state.scene.activeSceneId, null);
    assert.equal(result.state.scene.status, "idle");
  }
);

test(
  "event-owned playable completion applies a source event settlement continuation",
  () => {
    const characterDefinitions = prototypeCharacters.map((character) =>
      character.id === "char.player"
        ? {
            ...character,
            stamina: 100,
          }
        : character
    );
    const content = {
      eventDefinitionsById: {
        "event.playable.source": createEvent(
          "event.playable.source",
          "scene.playable.source",
          "event.playable.settlement"
        ),
        "event.playable.settlement": {
          ...createEvent(
            "event.playable.settlement",
            "scene.playable.settlement"
          ),
          type: "settlement",
          settlementId: "settlement.playable.reward",
        },
      },
      sceneDefinitionsById: {
        "scene.playable.source": {
          id: "scene.playable.source",
          name: "Playable Source",
          actions: [],
        },
        "scene.playable.settlement": {
          id: "scene.playable.settlement",
          name: "Playable Settlement",
          actions: [],
        },
      },
      settlementDefinitionsById: {
        "settlement.playable.reward": {
          id: "settlement.playable.reward",
          title: "Playable Reward",
          contents: [
            {
              targetFamily: "person",
              targetId: "char.player",
              attributeKey: "stamina",
              attributeType: "number",
              operation: "add",
              value: 10,
            },
          ],
        },
      },
    };

    const result = applyEventOwnedPlayableCompletion({
      state: createBaseState(),
      characterDefinitions,
      previousPlayableSession: createEventOwnedPlayableSession(
        "event.playable.source"
      ),
      settlement: { outcome: "success" },
      continueFromSourceEvent: ({ sourceEventId, state, characterDefinitions }) =>
        continueStoryFromSourceEvent(
          {
            state,
            characterDefinitions,
          },
          content,
          sourceEventId
        ),
    });

    const player = result.characterDefinitions.find(
      (character) => character.id === "char.player"
    );

    assert.equal(result.handled, true);
    assert.equal(player?.stamina, 110);
    assert.equal(
      result.state.runtime.eventHistory["event.playable.settlement"]
        ?.firedCount,
      1
    );
    assert.equal(result.state.scene.activeEventId, null);
    assert.equal(result.state.scene.activeSceneId, null);
    assert.equal(result.state.scene.status, "idle");
  }
);

test(
  "event-owned playable settlement continuation returns city and building changes",
  () => {
    const cityBefore = prototypeCities.find((city) => city.id === "city.kulan");
    const houseBefore = prototypeHouses.find(
      (house) => house.moduleId === "grain-shop"
    );
    assert.ok(cityBefore, "Expected prototype Kulan city to exist.");
    assert.ok(houseBefore, "Expected prototype grain shop house to exist.");

    const content = {
      eventDefinitionsById: {
        "event.playable.source": createEvent(
          "event.playable.source",
          "scene.playable.source",
          "event.playable.settlement"
        ),
        "event.playable.settlement": {
          ...createEvent(
            "event.playable.settlement",
            "scene.playable.settlement"
          ),
          type: "settlement",
          settlementId: "settlement.playable.world-reward",
        },
      },
      sceneDefinitionsById: {
        "scene.playable.source": {
          id: "scene.playable.source",
          name: "Playable Source",
          actions: [],
        },
        "scene.playable.settlement": {
          id: "scene.playable.settlement",
          name: "Playable Settlement",
          actions: [],
        },
      },
      settlementDefinitionsById: {
        "settlement.playable.world-reward": {
          id: "settlement.playable.world-reward",
          title: "Playable World Reward",
          contents: [
            {
              targetFamily: "city",
              targetId: cityBefore.id,
              attributeKey: "prosperity",
              attributeType: "number",
              operation: "add",
              value: 5,
            },
            {
              targetFamily: "building",
              targetId: houseBefore.id,
              attributeKey: "outputMultiplier",
              attributeType: "number",
              operation: "set",
              value: 2,
            },
          ],
        },
      },
    };

    const result = applyEventOwnedPlayableCompletion({
      state: createBaseState(),
      characterDefinitions: prototypeCharacters,
      previousPlayableSession: createEventOwnedPlayableSession(
        "event.playable.source"
      ),
      settlement: { outcome: "success" },
      continueFromSourceEvent: ({ sourceEventId, state, characterDefinitions }) =>
        continueStoryFromSourceEvent(
          {
            state,
            characterDefinitions,
            cityDefinitions: prototypeCities,
            houseDefinitions: prototypeHouses,
          },
          content,
          sourceEventId
        ),
    });

    const cityAfter = result.cityDefinitions?.find(
      (city) => city.id === cityBefore.id
    );
    const houseAfter = result.houseDefinitions?.find(
      (house) => house.id === houseBefore.id
    );

    assert.equal(result.handled, true);
    assert.equal(cityAfter?.prosperity, cityBefore.prosperity + 5);
    assert.equal(houseAfter?.outputMultiplier, 2);
  }
);
