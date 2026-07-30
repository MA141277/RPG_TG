const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  triggerStoryEvents,
} = require("../.test-dist/application/story/story-runtime.js");
const {
  runStoryEventRuntime,
} = require("../.test-dist/core/runtime/event-runtime.js");
const {
  prototypeCharacters,
  prototypeCities,
  prototypeHouses,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");

function createBaseRuntimeState() {
  return {
    core: createInitialState({
      currentMapId: "map.test",
      currentCityId: "city.test",
      currentHouseId: null,
      playerCharacterId: "hero",
      chapterId: "chapter.test",
      year: 1560,
      month: 1,
      day: 1,
      pinnedCharacterId: "hero",
      reviewDateText: "",
      mainHouseMissionText: "",
      cards: { ownedCardIds: [] },
      valuables: { ownedItemIds: [] },
    }),
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function createBaseStoryState() {
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

function createStoryEvent(id, entrySceneId, trigger) {
  return {
    id,
    chapterId: "chapter.prototype",
    name: id,
    occurrence: "repeatable",
    trigger,
    conditions: [],
    entrySceneId,
  };
}

function createStoryHouse(id = "house.router.runtime") {
  return {
    id,
    cityId: "city.kulan",
    name: "Router Runtime House",
    type: "custom",
    characterIds: [],
    outputMultiplier: 1,
    backAction: {
      label: "Back",
      targetView: "city",
    },
  };
}

test("event router contract defines a canonical event entity and routed result seam", () => {
  const contractPath = path.join(
    process.cwd(),
    "src/core/contracts/event-router.ts"
  );

  assert.equal(fs.existsSync(contractPath), true);
  const source = fs.readFileSync(contractPath, "utf8");

  assert.match(source, /RuntimeEventKind/);
  assert.match(source, /"dialogue"/);
  assert.match(source, /"navigation"/);
  assert.match(source, /"menu"/);
  assert.match(source, /"playable"/);
  assert.match(source, /"settlement"/);
  assert.match(source, /"composite"/);
  assert.match(source, /"bridge"/);
  assert.match(source, /RuntimeEventEntity/);
  assert.match(source, /kind:\s*RuntimeEventKind/);
  assert.match(source, /payload:\s*Record<string,\s*unknown>/);
  assert.match(source, /nextEventId\??:/);
  assert.match(source, /emitEventIds\??:/);
  assert.match(source, /RuntimeEventRouteResult/);
  assert.match(source, /event:\s*RuntimeEventEntity/);
  assert.match(source, /effects:\s*Effect\[\]/);
  assert.match(source, /followUpEventIds\??:/);
});

test("runtime event entity payload projection preserves authored runtime payload", () => {
  const {
    createRuntimeEventEntity,
  } = require("../.test-dist/core/runtime/event-entity-projection.js");

  const entity = createRuntimeEventEntity({
    id: "event.payload.runtime",
    chapterId: "chapter.test",
    name: "Payload Runtime",
    occurrence: "repeatable",
    trigger: { timing: "manual" },
    conditions: [],
    entrySceneId: "scene.payload.runtime",
    dialogueId: "dialogue.payload.runtime",
    settlementId: "settlement.payload.runtime",
    taskInputs: [
      {
        type: "signal.test",
        source: "event.payload.runtime",
        occurredAt: "day:1",
      },
    ],
    actions: [
      {
        type: "closeBuilding",
      },
    ],
    nextEventId: "event.payload.next",
    emitEventIds: ["event.payload.emit.second"],
    tags: ["payload", "runtime"],
  });

  assert.equal(entity.id, "event.payload.runtime");
  assert.equal(entity.kind, "dialogue");
  assert.equal(entity.payload.entrySceneId, "scene.payload.runtime");
  assert.equal(entity.payload.dialogueId, "dialogue.payload.runtime");
  assert.equal(entity.payload.settlementId, "settlement.payload.runtime");
  assert.deepEqual(entity.payload.taskInputs, [
    {
      type: "signal.test",
      source: "event.payload.runtime",
      occurredAt: "day:1",
    },
  ]);
  assert.deepEqual(entity.payload.actions, [{ type: "closeBuilding" }]);
  assert.equal(entity.nextEventId, "event.payload.next");
  assert.deepEqual(entity.emitEventIds, ["event.payload.emit.second"]);
});

test("runtime event task input payload helper reads canonical task inputs from the routed event payload", () => {
  const {
    readRuntimeEventTaskInputs,
  } = require("../.test-dist/core/runtime/event-entity-projection.js");

  const taskInputs = readRuntimeEventTaskInputs({
    id: "event.task-input.payload",
    kind: "dialogue",
    payload: {
      taskInputs: [
        {
          type: "task.signal.test",
          taskId: "task.test.payload",
        },
      ],
    },
  });

  assert.deepEqual(taskInputs, [
    {
      type: "task.signal.test",
      taskId: "task.test.payload",
    },
  ]);
});

test("runtime event action payload helper reads canonical actions from the routed event payload", () => {
  const {
    readRuntimeEventActions,
  } = require("../.test-dist/core/runtime/event-entity-projection.js");

  const actions = readRuntimeEventActions({
    id: "event.action.payload",
    kind: "dialogue",
    payload: {
      actions: [{ type: "closeBuilding" }],
    },
  });

  assert.deepEqual(actions, [{ type: "closeBuilding" }]);
});

test("runtime event settlement id payload helper reads canonical settlement ids from the routed event payload", () => {
  const {
    readRuntimeEventSettlementId,
  } = require("../.test-dist/core/runtime/event-entity-projection.js");

  const settlementId = readRuntimeEventSettlementId({
    id: "event.settlement.payload",
    kind: "settlement",
    payload: {
      settlementId: "settlement.payload.runtime",
    },
  });

  assert.equal(settlementId, "settlement.payload.runtime");
});

test("runtime event dialogue id payload helper reads canonical dialogue ids from the routed event payload", () => {
  const {
    readRuntimeEventDialogueId,
  } = require("../.test-dist/core/runtime/event-entity-projection.js");

  const dialogueId = readRuntimeEventDialogueId({
    id: "event.dialogue.payload",
    kind: "dialogue",
    payload: {
      dialogueId: "dialogue.payload.runtime",
    },
  });

  assert.equal(dialogueId, "dialogue.payload.runtime");
});

test(
  "runStoryEventRuntime preserves authored emitEventIds on the routed runtime event entity",
  () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/core/runtime/event-runtime.ts"),
      "utf8"
    );
    const eventEntityProjectionBlock =
      source.match(
        /function toEventRuntimeEventEntity\([\s\S]*?\n}\n\nfunction createScopedTriggerContext/
      )?.[0] ?? "";

    assert.match(eventEntityProjectionBlock, /emitEventIds/);
  }
);

test("dispatchEventRoute resolves a canonical event entity and dispatches by kind", () => {
  const { dispatchEventRoute } = require("../.test-dist/core/runtime/event-router.js");
  const handledKinds = [];

  const result = dispatchEventRoute({
    state: createBaseRuntimeState(),
    eventId: "event.test.dialogue",
    context: {
      repository: {
        resolveById: (eventId) =>
          eventId === "event.test.dialogue"
            ? {
                id: eventId,
                kind: "dialogue",
                payload: {
                  dialogueId: "dialogue.test.entry",
                },
                nextEventId: "event.test.dialogue.follow-up",
              }
            : null,
      },
      handlers: {
        dialogue: ({ state, event }) => {
          handledKinds.push(event.kind);
          return {
            state,
            effects: [
              {
                type: "setFlag",
                key: "event.test.dialogue.routed",
                value: true,
              },
            ],
            dialogue: {
              id: event.payload.dialogueId,
              name: "Test Dialogue",
              nodes: [],
            },
          };
        },
      },
    },
  });

  assert.deepEqual(handledKinds, ["dialogue"]);
  assert.equal(result.event.id, "event.test.dialogue");
  assert.equal(result.event.kind, "dialogue");
  assert.equal(result.dialogue.id, "dialogue.test.entry");
  assert.deepEqual(result.effects, [
    {
      type: "setFlag",
      key: "event.test.dialogue.routed",
      value: true,
    },
  ]);
  assert.deepEqual(result.followUpEventIds, [
    "event.test.dialogue.follow-up",
  ]);
});

test("dispatchEventRoute returns a standardized routed result envelope and leaves settlement centralized", () => {
  const { dispatchEventRoute } = require("../.test-dist/core/runtime/event-router.js");

  const result = dispatchEventRoute({
    state: createBaseRuntimeState(),
    eventId: "event.test.settlement",
    context: {
      repository: {
        resolveById: (eventId) =>
          eventId === "event.test.settlement"
            ? {
                id: eventId,
                kind: "settlement",
                payload: {
                  flagKey: "event.test.settlement.pending",
                },
              }
            : null,
      },
      handlers: {
        settlement: ({ state, event }) => ({
          state,
          effects: [
            {
              type: "setFlag",
              key: event.payload.flagKey,
              value: true,
            },
          ],
        }),
      },
    },
  });

  assert.equal(result.event.kind, "settlement");
  assert.deepEqual(result.effects, [
    {
      type: "setFlag",
      key: "event.test.settlement.pending",
      value: true,
    },
  ]);
  assert.equal(result.state.core.runtime.flags["event.test.settlement.pending"], undefined);
  assert.equal(result.settlement, undefined);
});

test("event router follow-up ids are consumable by a shared chain owner for immediate routed events", () => {
  const { dispatchEventRoute } = require("../.test-dist/core/runtime/event-router.js");
  const { runEventChain } = require("../.test-dist/core/runtime/event-chain-runtime.js");

  const result = runEventChain({
    state: createBaseRuntimeState(),
    rootEventId: "event.test.chain.root",
    maxDepth: 4,
    router: {
      dispatchEventRoute: ({ state, eventId }) =>
        dispatchEventRoute({
          state,
          eventId,
          context: {
            repository: {
              resolveById: (resolvedEventId) =>
                resolvedEventId === "event.test.chain.root"
                  ? {
                      id: resolvedEventId,
                      kind: "bridge",
                      payload: {},
                      emitEventIds: [
                        "event.test.chain.second",
                        "event.test.chain.third",
                      ],
                    }
                  : {
                      id: resolvedEventId,
                      kind: "bridge",
                      payload: {},
                    },
            },
            handlers: {
              bridge: ({ state, event }) => ({
                state: {
                  ...state,
                  core: {
                    ...state.core,
                    runtime: {
                      ...state.core.runtime,
                      flags: {
                        ...state.core.runtime.flags,
                        [event.id]: true,
                      },
                    },
                  },
                },
                effects: [],
              }),
            },
          },
        }),
    },
  });

  assert.deepEqual(result.visitedEventIds, [
    "event.test.chain.root",
    "event.test.chain.second",
    "event.test.chain.third",
  ]);
  assert.equal(result.state.core.runtime.flags["event.test.chain.third"], true);
});

test("event route activation handlers share one canonical event-start seam", () => {
  const {
    createEventRouteActivationHandlers,
  } = require("../.test-dist/core/runtime/event-route-activation.js");
  const eventDefinitionsById = {
    "event.test.followup": createStoryEvent(
      "event.test.followup",
      "scene.test.followup",
      { timing: "manual" }
    ),
  };
  const handlers = createEventRouteActivationHandlers({
    eventDefinitionsById,
    fallbackEventDefinition: eventDefinitionsById["event.test.followup"],
  });

  assert.equal(
    handlers.dialogue,
    handlers.settlement,
    "dialogue and settlement activation should reuse the same handler seam"
  );

  const handled = handlers.dialogue({
    state: createBaseRuntimeState(),
    event: {
      id: "event.test.followup",
      kind: "dialogue",
      payload: {},
    },
  });

  assert.equal(handled.state.core.scene.activeEventId, "event.test.followup");
  assert.equal(
    handled.state.core.scene.activeSceneId,
    "scene.test.followup"
  );
  assert.deepEqual(handled.effects, []);
});

test(
  "startStoryEventById routes direct story entry through the shared activation seam",
  { concurrency: false },
  () => {
    const activationPath = require.resolve(
      "../.test-dist/core/runtime/event-route-activation.js"
    );
    const storyRuntimePath = require.resolve(
      "../.test-dist/application/story/story-runtime.js"
    );

    delete require.cache[storyRuntimePath];
    delete require.cache[activationPath];

    const activationModule = require(activationPath);
    const originalCreateHandlers =
      activationModule.createEventRouteActivationHandlers;
    let createHandlersCalls = 0;

    activationModule.createEventRouteActivationHandlers = (...args) => {
      createHandlersCalls += 1;
      return originalCreateHandlers(...args);
    };

    try {
      const {
        startStoryEventById: startStoryEventByIdWithPatchedActivation,
      } = require(storyRuntimePath);
      const content = {
        eventDefinitionsById: {
          "event.story.activation": createStoryEvent(
            "event.story.activation",
            "scene.story.activation",
            { timing: "manual" }
          ),
        },
        sceneDefinitionsById: {
          "scene.story.activation": {
            id: "scene.story.activation",
            name: "Story Activation",
            actions: [],
          },
        },
      };

      const started = startStoryEventByIdWithPatchedActivation(
        {
          state: createBaseStoryState(),
          characterDefinitions: prototypeCharacters,
          cityDefinitions: prototypeCities,
          houseDefinitions: prototypeHouses,
        },
        content,
        "event.story.activation"
      );

      assert.equal(
        started.state.runtime.eventHistory["event.story.activation"]?.firedCount,
        1
      );
      assert.ok(
        createHandlersCalls > 0,
        "story direct entry should reuse createEventRouteActivationHandlers instead of locally starting the event"
      );
    } finally {
      activationModule.createEventRouteActivationHandlers =
        originalCreateHandlers;
      delete require.cache[storyRuntimePath];
      delete require.cache[activationPath];
    }
  }
);

test(
  "runStoryEventRuntime routes activated trigger events through the shared event-router seam",
  { concurrency: false },
  () => {
    const eventRouterPath = require.resolve(
      "../.test-dist/core/runtime/event-router.js"
    );
    const eventRuntimePath = require.resolve(
      "../.test-dist/core/runtime/event-runtime.js"
    );

    delete require.cache[eventRuntimePath];
    delete require.cache[eventRouterPath];

    const patchedEventRouter = require(eventRouterPath);
    const originalDispatchEventRoute = patchedEventRouter.dispatchEventRoute;
    let dispatchEventRouteCalls = 0;

    patchedEventRouter.dispatchEventRoute = (...args) => {
      dispatchEventRouteCalls += 1;
      return originalDispatchEventRoute(...args);
    };

    try {
      const { runStoryEventRuntime: runStoryEventRuntimeWithPatchedRouter } =
        require(eventRuntimePath);
      const result = runStoryEventRuntimeWithPatchedRouter({
        timing: "city-enter",
        state: createBaseStoryState(),
        characterDefinitions: prototypeCharacters,
        eventDefinitionsById: {
          "event.router.triggered": createStoryEvent(
            "event.router.triggered",
            "scene.router.triggered",
            {
              timing: "city-enter",
              scope: {
                cityId: "city.kulan",
              },
            }
          ),
        },
      });

      assert.equal(result.activation?.activeEventId, "event.router.triggered");
      assert.equal(result.activation?.sceneId, "scene.router.triggered");
      assert.equal(result.state.scene.activeEventId, "event.router.triggered");
      assert.equal(result.state.scene.activeSceneId, "scene.router.triggered");
      assert.ok(
        dispatchEventRouteCalls > 0,
        "runStoryEventRuntime should route activated trigger events through dispatchEventRoute instead of starting them locally"
      );
    } finally {
      patchedEventRouter.dispatchEventRoute = originalDispatchEventRoute;
      delete require.cache[eventRuntimePath];
      delete require.cache[eventRouterPath];
    }
  }
);

test(
  "triggerStoryEvents routes non-binding direct fallback through the shared router seam while preserving world definitions",
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
          "event.router.city-enter": createStoryEvent(
            "event.router.city-enter",
            "scene.router.city-enter",
            {
              timing: "city-enter",
              scope: {
                cityId: "city.kulan",
              },
            }
          ),
        },
        sceneDefinitionsById: {
          "scene.router.city-enter": {
            id: "scene.router.city-enter",
            name: "Router City Enter",
            actions: [],
          },
        },
      };

      const started = triggerStoryEvents(
        {
          state: createBaseStoryState(),
          characterDefinitions: prototypeCharacters,
          cityDefinitions: prototypeCities,
          houseDefinitions: prototypeHouses,
        },
        content,
        {
          timing: "city-enter",
          cityId: "city.kulan",
        }
      );

      assert.equal(started.cityDefinitions, prototypeCities);
      assert.equal(started.houseDefinitions, prototypeHouses);
      assert.equal(
        started.state.runtime.eventHistory["event.router.city-enter"]?.firedCount,
        1
      );
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "triggerStoryEvents should route non-binding fallback entry through dispatchRuntimeRequest instead of starting the event locally"
      );
    } finally {
      runtimeDispatch.dispatchRuntimeRequest = originalDispatchRuntimeRequest;
    }
  }
);

test(
  "triggerStoryEvents preserves the binding-owned path without routing it through dispatchRuntimeRequest",
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
          "event.binding.city-enter": createStoryEvent(
            "event.binding.city-enter",
            "scene.binding.city-enter",
            {
              timing: "manual",
            }
          ),
        },
        sceneDefinitionsById: {
          "scene.binding.city-enter": {
            id: "scene.binding.city-enter",
            name: "Binding City Enter",
            actions: [],
          },
        },
        eventBindingsById: {
          "binding.city-enter": {
            id: "binding.city-enter",
            eventId: "event.binding.city-enter",
            owner: {
              family: "city",
              id: "city.kulan",
            },
            trigger: {
              timing: "after",
              action: "city-enter",
            },
          },
        },
      };

      const started = triggerStoryEvents(
        {
          state: createBaseStoryState(),
          characterDefinitions: prototypeCharacters,
          cityDefinitions: prototypeCities,
          houseDefinitions: prototypeHouses,
        },
        content,
        {
          timing: "city-enter",
          cityId: "city.kulan",
        }
      );

      assert.equal(
        started.state.runtime.eventHistory["event.binding.city-enter"]?.firedCount,
        1
      );
      assert.equal(
        dispatchRuntimeRequestCalls,
        0,
        "triggerStoryEventBindings should keep its existing binding-owned runtime path"
      );
    } finally {
      runtimeDispatch.dispatchRuntimeRequest = originalDispatchRuntimeRequest;
    }
  }
);

test(
  "triggerStoryEvents routes state-only binding continuation through the shared story direct-entry seam",
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
      const runtimeHouse = createStoryHouse();
      const baseState = createBaseStoryState();
      const started = triggerStoryEvents(
        {
          state: {
            ...baseState,
            world: {
              ...baseState.world,
              currentHouseId: runtimeHouse.id,
            },
            ui: {
              ...baseState.ui,
              currentView: "house",
            },
          },
          characterDefinitions: prototypeCharacters,
          cityDefinitions: prototypeCities,
          houseDefinitions: [...prototypeHouses, runtimeHouse],
        },
        {
          eventDefinitionsById: {
            "event.binding.state-only": {
              ...createStoryEvent(
                "event.binding.state-only",
                "scene.binding.state-only",
                { timing: "manual" }
              ),
              type: "settlement",
              settlementId: "settlement.binding.state-only",
              actions: [{ type: "closeBuilding" }],
            },
          },
          sceneDefinitionsById: {
            "scene.binding.state-only": {
              id: "scene.binding.state-only",
              name: "Binding State Only",
              actions: [],
            },
          },
          eventBindingsById: {
            "binding.state-only": {
              id: "binding.state-only",
              eventId: "event.binding.state-only",
              owner: {
                family: "building",
                id: runtimeHouse.id,
              },
              trigger: {
                timing: "after",
                action: "building-enter",
              },
            },
          },
          settlementDefinitionsById: {
            "settlement.binding.state-only": {
              id: "settlement.binding.state-only",
              title: "Binding State Only Settlement",
              contents: [],
            },
          },
          cityDefinitionsById: {
            "city.kulan": prototypeCities.find((city) => city.id === "city.kulan"),
          },
          houseDefinitionsById: {
            [runtimeHouse.id]: runtimeHouse,
          },
        },
        {
          timing: "house-enter",
          houseId: runtimeHouse.id,
        }
      );

      assert.equal(
        started.state.runtime.eventHistory["event.binding.state-only"]
          ?.firedCount,
        1
      );
      assert.equal(started.state.world.currentHouseId, null);
      assert.equal(started.state.ui.currentView, "city");
      assert.equal(started.state.scene.activeEventId, null);
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "state-only binding continuation should reuse routeStoryDirectEntry through dispatchRuntimeRequest instead of starting the event locally"
      );
    } finally {
      runtimeDispatch.dispatchRuntimeRequest = originalDispatchRuntimeRequest;
    }
  }
);
