const assert = require("node:assert/strict");
const test = require("node:test");

const {
  runSceneUntilPause,
} = require("../.test-dist/application/scene/scene-runner.js");
const {
  continueToEvent,
  resolveEventContinuation,
} = require("../.test-dist/application/events/event-continuation.js");
const {
  startEvent,
} = require("../.test-dist/application/events/event-runner.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  advanceStorySceneStep,
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
  "story runtime preserves world definitions across scene start and choice helpers",
  () => {
    const startContent = {
      eventDefinitionsById: {
        "event.world.start": createEvent("event.world.start", "scene.world.start"),
      },
      sceneDefinitionsById: {
        "scene.world.start": {
          id: "scene.world.start",
          name: "World Start",
          actions: [],
        },
      },
    };

    const started = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: prototypeCharacters,
        cityDefinitions: prototypeCities,
        houseDefinitions: prototypeHouses,
      },
      startContent,
      "event.world.start"
    );

    assert.equal(started.cityDefinitions, prototypeCities);
    assert.equal(started.houseDefinitions, prototypeHouses);

    const choiceContent = {
      eventDefinitionsById: {
        "event.world.choice": createEvent(
          "event.world.choice",
          "scene.world.choice"
        ),
        "event.world.followup": createEvent(
          "event.world.followup",
          "scene.world.followup"
        ),
      },
      sceneDefinitionsById: {
        "scene.world.choice": {
          id: "scene.world.choice",
          name: "World Choice",
          actions: [
            {
              type: "choice",
              options: [
                {
                  id: "option.world.followup",
                  label: "Follow-up",
                  nextEventId: "event.world.followup",
                },
              ],
            },
          ],
        },
        "scene.world.followup": {
          id: "scene.world.followup",
          name: "World Follow-up",
          actions: [],
        },
      },
    };

    const waitingChoice = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: prototypeCharacters,
        cityDefinitions: prototypeCities,
        houseDefinitions: prototypeHouses,
      },
      choiceContent,
      "event.world.choice"
    );

    assert.equal(waitingChoice.state.scene.status, "waiting-choice");
    assert.equal(waitingChoice.cityDefinitions, prototypeCities);
    assert.equal(waitingChoice.houseDefinitions, prototypeHouses);

    const continued = chooseStorySceneOption(waitingChoice, choiceContent, {
      id: "option.world.followup",
      label: "Follow-up",
      nextEventId: "event.world.followup",
    });

    assert.equal(continued.cityDefinitions, prototypeCities);
    assert.equal(continued.houseDefinitions, prototypeHouses);
    assert.equal(
      continued.state.runtime.eventHistory["event.world.followup"]?.firedCount,
      1
    );
  }
);

test(
  "startStoryEventById routes direct story entry through the shared router seam while preserving world definitions",
  { concurrency: false },
  () => {
    const runtimeDispatch = require("../.test-dist/core/runtime/runtime-dispatch.js");
    const originalDispatchRuntimeRequest =
      runtimeDispatch.dispatchRuntimeRequest;
    let dispatchRuntimeRequestCalls = 0;

    runtimeDispatch.dispatchRuntimeRequest = (...args) => {
      dispatchRuntimeRequestCalls += 1;
      return originalDispatchRuntimeRequest(...args);
    };

    try {
      const content = {
        eventDefinitionsById: {
          "event.world.router-start": createEvent(
            "event.world.router-start",
            "scene.world.router-start"
          ),
        },
        sceneDefinitionsById: {
          "scene.world.router-start": {
            id: "scene.world.router-start",
            name: "World Router Start",
            actions: [],
          },
        },
      };

      const started = startStoryEventById(
        {
          state: createBaseState(),
          characterDefinitions: prototypeCharacters,
          cityDefinitions: prototypeCities,
          houseDefinitions: prototypeHouses,
        },
        content,
        "event.world.router-start"
      );

      assert.equal(started.cityDefinitions, prototypeCities);
      assert.equal(started.houseDefinitions, prototypeHouses);
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "startStoryEventById should route direct story entry through dispatchRuntimeRequest instead of starting the event locally"
      );
    } finally {
      runtimeDispatch.dispatchRuntimeRequest = originalDispatchRuntimeRequest;
    }
  }
);

test("startStoryEventById fails closed when the requested event does not exist", () => {
  const runtime = {
    state: createBaseState(),
    characterDefinitions: prototypeCharacters,
    cityDefinitions: prototypeCities,
    houseDefinitions: prototypeHouses,
  };
  const content = {
    eventDefinitionsById: {},
    sceneDefinitionsById: {},
  };

  const result = startStoryEventById(runtime, content, "event.missing");

  assert.strictEqual(result, runtime);
});

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

test("resolveEventContinuation returns the next event definition without mutating state", () => {
  const eventDefinitionsById = {
    "event.loop.a": createEvent("event.loop.a", "scene.empty.a", "event.loop.b"),
    "event.loop.b": createEvent("event.loop.b", "scene.empty.b"),
  };
  const state = createBaseState();

  const continuation = resolveEventContinuation({
    state,
    eventDefinitionsById,
    sourceEventId: "event.loop.a",
    targetEventId: "event.loop.b",
    visitedEventIds: ["event.loop.a"],
  });

  assert.ok(continuation, "Expected pure continuation resolution to succeed.");
  assert.equal(continuation.eventDefinition.id, "event.loop.b");
  assert.equal(continuation.visitedEventIds.has("event.loop.a"), true);
  assert.equal(continuation.visitedEventIds.has("event.loop.b"), true);
  assert.equal(state.scene.activeEventId, null);
  assert.equal(state.scene.activeSceneId, null);
});

test(
  "advanceStorySceneStep routes scene start-event actions through the shared router seam",
  { concurrency: false },
  () => {
    const runtimeDispatchPath = require.resolve(
      "../.test-dist/core/runtime/runtime-dispatch.js"
    );
    const storyRuntimePath = require.resolve(
      "../.test-dist/application/story/story-runtime.js"
    );

    delete require.cache[storyRuntimePath];
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
        advanceStorySceneStep: advanceStorySceneStepWithPatchedDispatch,
        startStoryEventById: startStoryEventByIdWithPatchedDispatch,
      } = require(storyRuntimePath);
      const content = {
        eventDefinitionsById: {
          "event.scene.start": createEvent(
            "event.scene.start",
            "scene.scene.start"
          ),
          "event.scene.followup": createEvent(
            "event.scene.followup",
            "scene.scene.followup"
          ),
        },
        sceneDefinitionsById: {
          "scene.scene.start": {
            id: "scene.scene.start",
            name: "Scene Start Event",
            actions: [
              {
                type: "narration",
                text: "Lead-in",
              },
              {
                type: "start-event",
                eventId: "event.scene.followup",
              },
            ],
          },
          "scene.scene.followup": {
            id: "scene.scene.followup",
            name: "Scene Follow-up Event",
            actions: [],
          },
        },
      };

      const started = startStoryEventByIdWithPatchedDispatch(
        {
          state: createBaseState(),
          characterDefinitions: prototypeCharacters,
          cityDefinitions: prototypeCities,
          houseDefinitions: prototypeHouses,
        },
        content,
        "event.scene.start"
      );
      dispatchRuntimeRequestCalls = 0;

      const continued = advanceStorySceneStepWithPatchedDispatch(
        started,
        content
      );

      assert.equal(continued.cityDefinitions, prototypeCities);
      assert.equal(continued.houseDefinitions, prototypeHouses);
      assert.equal(
        continued.state.runtime.eventHistory["event.scene.followup"]?.firedCount,
        1
      );
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "advanceStorySceneStep should route scene start-event continuation through dispatchRuntimeRequest instead of starting the follow-up locally"
      );
    } finally {
      patchedRuntimeDispatch.dispatchRuntimeRequest =
        originalDispatchRuntimeRequest;
      delete require.cache[storyRuntimePath];
      delete require.cache[runtimeDispatchPath];
    }
  }
);

test(
  "advanceStorySceneStep routes automatic scene-end continuation through the shared router seam",
  { concurrency: false },
  () => {
    const runtimeDispatchPath = require.resolve(
      "../.test-dist/core/runtime/runtime-dispatch.js"
    );
    const storyRuntimePath = require.resolve(
      "../.test-dist/application/story/story-runtime.js"
    );

    delete require.cache[storyRuntimePath];
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
        advanceStorySceneStep: advanceStorySceneStepWithPatchedDispatch,
        startStoryEventById: startStoryEventByIdWithPatchedDispatch,
      } = require(storyRuntimePath);
      const content = {
        eventDefinitionsById: {
          "event.scene.auto-start": createEvent(
            "event.scene.auto-start",
            "scene.scene.auto-start",
            "event.scene.auto-followup"
          ),
          "event.scene.auto-followup": createEvent(
            "event.scene.auto-followup",
            "scene.scene.auto-followup"
          ),
        },
        sceneDefinitionsById: {
          "scene.scene.auto-start": {
            id: "scene.scene.auto-start",
            name: "Scene Auto Start",
            actions: [
              {
                type: "narration",
                text: "Lead-in",
              },
            ],
          },
          "scene.scene.auto-followup": {
            id: "scene.scene.auto-followup",
            name: "Scene Auto Follow-up",
            actions: [],
          },
        },
      };

      const started = startStoryEventByIdWithPatchedDispatch(
        {
          state: createBaseState(),
          characterDefinitions: prototypeCharacters,
          cityDefinitions: prototypeCities,
          houseDefinitions: prototypeHouses,
        },
        content,
        "event.scene.auto-start"
      );
      dispatchRuntimeRequestCalls = 0;

      const continued = advanceStorySceneStepWithPatchedDispatch(
        started,
        content
      );

      assert.equal(continued.cityDefinitions, prototypeCities);
      assert.equal(continued.houseDefinitions, prototypeHouses);
      assert.equal(
        continued.state.runtime.eventHistory["event.scene.auto-followup"]?.firedCount,
        1
      );
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "advanceStorySceneStep should route automatic scene-end continuation through dispatchRuntimeRequest instead of starting the follow-up locally"
      );
    } finally {
      patchedRuntimeDispatch.dispatchRuntimeRequest =
        originalDispatchRuntimeRequest;
      delete require.cache[storyRuntimePath];
      delete require.cache[runtimeDispatchPath];
    }
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
  "scene runner non-owner start-event fallback reuses continueToEvent compatibility seam",
  { concurrency: false },
  () => {
    const continuationPath = require.resolve(
      "../.test-dist/application/events/event-continuation.js"
    );
    const sceneRunnerPath = require.resolve(
      "../.test-dist/application/scene/scene-runner.js"
    );

    delete require.cache[sceneRunnerPath];
    delete require.cache[continuationPath];

    const continuationModule = require(continuationPath);
    const originalContinueToEvent = continuationModule.continueToEvent;
    let continueToEventCalls = 0;

    continuationModule.continueToEvent = (...args) => {
      continueToEventCalls += 1;
      return originalContinueToEvent(...args);
    };

    try {
      const { runSceneUntilPause: runSceneUntilPauseWithPatchedContinuation } =
        require(sceneRunnerPath);
      const state = startEvent(
        createBaseState(),
        createEvent("event.scene.owner", "scene.scene.owner")
      );
      const result = runSceneUntilPauseWithPatchedContinuation(state, {
        sceneDefinitionsById: {
          "scene.scene.owner": {
            id: "scene.scene.owner",
            name: "Scene Owner",
            actions: [
              {
                type: "start-event",
                eventId: "event.scene.followup",
              },
            ],
          },
          "scene.scene.followup": {
            id: "scene.scene.followup",
            name: "Scene Follow-up",
            actions: [],
          },
        },
        eventDefinitionsById: {
          "event.scene.owner": createEvent(
            "event.scene.owner",
            "scene.scene.owner"
          ),
          "event.scene.followup": createEvent(
            "event.scene.followup",
            "scene.scene.followup"
          ),
        },
        characterDefinitions: prototypeCharacters,
      });

      assert.equal(
        result.state.runtime.eventHistory["event.scene.followup"]?.firedCount,
        1
      );
      assert.ok(
        continueToEventCalls > 0,
        "scene-runner fallback should reuse continueToEvent instead of locally starting follow-up events"
      );
    } finally {
      continuationModule.continueToEvent = originalContinueToEvent;
      delete require.cache[sceneRunnerPath];
      delete require.cache[continuationPath];
    }
  }
);

test(
  "choice resolver nextEvent fallback reuses continueToEvent compatibility seam",
  { concurrency: false },
  () => {
    const continuationPath = require.resolve(
      "../.test-dist/application/events/event-continuation.js"
    );
    const choiceResolverPath = require.resolve(
      "../.test-dist/application/scene/choice-resolver.js"
    );

    delete require.cache[choiceResolverPath];
    delete require.cache[continuationPath];

    const continuationModule = require(continuationPath);
    const originalContinueToEvent = continuationModule.continueToEvent;
    let continueToEventCalls = 0;

    continuationModule.continueToEvent = (...args) => {
      continueToEventCalls += 1;
      return originalContinueToEvent(...args);
    };

    try {
      const { resolveChoiceOption: resolveChoiceOptionWithPatchedContinuation } =
        require(choiceResolverPath);
      const state = startEvent(
        createBaseState(),
        createEvent("event.choice.owner", "scene.choice.owner")
      );
      const result = resolveChoiceOptionWithPatchedContinuation(
        {
          ...state,
          scene: {
            ...state.scene,
            status: "waiting-choice",
          },
        },
        {
          id: "option.choice.followup",
          label: "Follow-up",
          nextEventId: "event.choice.followup",
        },
        {
          sceneDefinitionsById: {
            "scene.choice.owner": {
              id: "scene.choice.owner",
              name: "Choice Owner",
              actions: [],
            },
            "scene.choice.followup": {
              id: "scene.choice.followup",
              name: "Choice Follow-up",
              actions: [],
            },
          },
          eventDefinitionsById: {
            "event.choice.owner": createEvent(
              "event.choice.owner",
              "scene.choice.owner"
            ),
            "event.choice.followup": createEvent(
              "event.choice.followup",
              "scene.choice.followup"
            ),
          },
          characterDefinitions: prototypeCharacters,
        }
      );

      assert.equal(result.state.scene.activeEventId, "event.choice.followup");
      assert.ok(
        continueToEventCalls > 0,
        "choice-resolver fallback should reuse continueToEvent instead of locally starting the follow-up event"
      );
    } finally {
      continuationModule.continueToEvent = originalContinueToEvent;
      delete require.cache[choiceResolverPath];
      delete require.cache[continuationPath];
    }
  }
);

test(
  "chooseStorySceneOption routes nextEvent choices through the shared router seam",
  { concurrency: false },
  () => {
    const runtimeDispatchPath = require.resolve(
      "../.test-dist/core/runtime/runtime-dispatch.js"
    );
    const storyRuntimePath = require.resolve(
      "../.test-dist/application/story/story-runtime.js"
    );

    delete require.cache[storyRuntimePath];
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
        chooseStorySceneOption: chooseStorySceneOptionWithPatchedDispatch,
        startStoryEventById: startStoryEventByIdWithPatchedDispatch,
      } = require(storyRuntimePath);
      const content = {
        eventDefinitionsById: {
          "event.choice.router-start": createEvent(
            "event.choice.router-start",
            "scene.choice.router-start"
          ),
          "event.choice.router-followup": createEvent(
            "event.choice.router-followup",
            "scene.choice.router-followup"
          ),
        },
        sceneDefinitionsById: {
          "scene.choice.router-start": {
            id: "scene.choice.router-start",
            name: "Choice Router Start",
            actions: [
              {
                type: "choice",
                options: [
                  {
                    id: "option.router-followup",
                    label: "Follow-up",
                    nextEventId: "event.choice.router-followup",
                  },
                ],
              },
            ],
          },
          "scene.choice.router-followup": {
            id: "scene.choice.router-followup",
            name: "Choice Router Follow-up",
            actions: [],
          },
        },
      };

      const waitingChoice = startStoryEventByIdWithPatchedDispatch(
        {
          state: createBaseState(),
          characterDefinitions: prototypeCharacters,
          cityDefinitions: prototypeCities,
          houseDefinitions: prototypeHouses,
        },
        content,
        "event.choice.router-start"
      );
      dispatchRuntimeRequestCalls = 0;

      const continued = chooseStorySceneOptionWithPatchedDispatch(
        waitingChoice,
        content,
        {
          id: "option.router-followup",
          label: "Follow-up",
          nextEventId: "event.choice.router-followup",
        }
      );

      assert.equal(continued.cityDefinitions, prototypeCities);
      assert.equal(continued.houseDefinitions, prototypeHouses);
      assert.equal(
        continued.state.runtime.eventHistory["event.choice.router-followup"]
          ?.firedCount,
        1
      );
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "chooseStorySceneOption should route nextEvent continuation through dispatchRuntimeRequest instead of starting the follow-up locally"
      );
    } finally {
      patchedRuntimeDispatch.dispatchRuntimeRequest =
        originalDispatchRuntimeRequest;
      delete require.cache[storyRuntimePath];
      delete require.cache[runtimeDispatchPath];
    }
  }
);

test(
  "continueStoryFromSourceEvent routes the follow-up target through the shared router seam",
  { concurrency: false },
  () => {
    const runtimeDispatchPath = require.resolve(
      "../.test-dist/core/runtime/runtime-dispatch.js"
    );
    const storyRuntimePath = require.resolve(
      "../.test-dist/application/story/story-runtime.js"
    );

    delete require.cache[storyRuntimePath];
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
        continueStoryFromSourceEvent: continueStoryFromSourceEventWithPatchedDispatch,
      } = require(storyRuntimePath);
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

      const continued = continueStoryFromSourceEventWithPatchedDispatch(
        {
          state: createBaseState(),
          characterDefinitions: prototypeCharacters,
        },
        content,
        "event.playable.source"
      );

      assert.ok(continued, "Expected source event continuation to succeed.");
      assert.equal(
        continued.state.runtime.eventHistory["event.playable.followup"]
          ?.firedCount,
        1
      );
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "continueStoryFromSourceEvent should route the continuation target through dispatchRuntimeRequest instead of starting it locally"
      );
    } finally {
      patchedRuntimeDispatch.dispatchRuntimeRequest =
        originalDispatchRuntimeRequest;
      delete require.cache[storyRuntimePath];
      delete require.cache[runtimeDispatchPath];
    }
  }
);

test(
  "continueStoryFromSourceEvent applies settlement nextEventId continuation through the shared router seam",
  { concurrency: false },
  () => {
    const runtimeDispatchPath = require.resolve(
      "../.test-dist/core/runtime/runtime-dispatch.js"
    );
    const storyRuntimePath = require.resolve(
      "../.test-dist/application/story/story-runtime.js"
    );

    delete require.cache[storyRuntimePath];
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
        continueStoryFromSourceEvent: continueStoryFromSourceEventWithPatchedDispatch,
      } = require(storyRuntimePath);
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
          "event.playable.settlement-followup": createEvent(
            "event.playable.settlement-followup",
            "scene.playable.settlement-followup"
          ),
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
          "scene.playable.settlement-followup": {
            id: "scene.playable.settlement-followup",
            name: "Playable Settlement Follow-up",
            actions: [],
          },
        },
        settlementDefinitionsById: {
          "settlement.playable.reward": {
            id: "settlement.playable.reward",
            title: "Playable Reward",
            nextEventId: "event.playable.settlement-followup",
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

      const characterDefinitions = prototypeCharacters.map((character) =>
        character.id === "char.player"
          ? {
              ...character,
              stamina: 100,
            }
          : character
      );

      const continued = continueStoryFromSourceEventWithPatchedDispatch(
        {
          state: createBaseState(),
          characterDefinitions,
        },
        content,
        "event.playable.source"
      );

      assert.ok(continued, "Expected settlement source continuation to succeed.");
      assert.equal(
        continued.characterDefinitions.find(
          (character) => character.id === "char.player"
        )?.stamina,
        110
      );
      assert.equal(
        continued.state.runtime.eventHistory["event.playable.settlement"]
          ?.firedCount,
        1
      );
      assert.equal(
        continued.state.runtime.eventHistory[
          "event.playable.settlement-followup"
        ]?.firedCount,
        1
      );
      assert.ok(
        dispatchRuntimeRequestCalls > 1,
        "continueStoryFromSourceEvent should route settlement follow-up through dispatchRuntimeRequest instead of stopping after the settlement event"
      );
    } finally {
      patchedRuntimeDispatch.dispatchRuntimeRequest =
        originalDispatchRuntimeRequest;
      delete require.cache[storyRuntimePath];
      delete require.cache[runtimeDispatchPath];
    }
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
