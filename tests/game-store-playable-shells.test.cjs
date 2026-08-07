const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createGameStore,
} = require("../.test-dist/application/state/game-store.js");
const {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
} = require("../.test-dist/core/runtime/playable-runtime-registries.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: "house.test",
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    activeEventId: "event.store.flow-preview",
    activeSceneId: "scene.store.flow-preview",
    currentView: "house",
  });
}

function createEvent(id, entrySceneId, nextEventId) {
  return {
    id,
    chapterId: "chapter.test",
    name: id,
    occurrence: "repeatable",
    trigger: { timing: "manual" },
    conditions: [],
    entrySceneId,
    ...(nextEventId == null ? {} : { nextEventId }),
  };
}

function configureFlowRuntimeRegistries() {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod({
    modId: "mod.test.game-store-playable-shells",
    manifest: {
      id: "mod.test.game-store-playable-shells",
      schemaVersion: "1",
      version: "1.0.0",
      title: "Game Store Playable Shells Test",
      entryContentPackIds: ["pack.test.game-store-playable-shells"],
    },
    normalizedContentSources: [
      {
        playables: [
          {
            id: "flow.test.game-store-preview",
            commandPrefix: "playable.flow.test.game-store-preview.",
          },
        ],
        playableIntegrations: [
          {
            integrationId: "playable.flow.test.game-store-preview.house.default",
            playableId: "flow.test.game-store-preview",
            ownerDefaults: {
              ownerKind: "house",
              ownerId: "house.test",
              returnPolicy: "reenter-owner",
            },
            trigger: {
              triggerId: "trigger.playable.flow.test.game-store-preview.house.default",
              ownerKind: "house",
              trigger: "manual-launch",
            },
            outcomeConfig: {},
          },
        ],
      },
    ],
    registeredDefinitionIds: ["pack.test.game-store-playable-shells"],
    gameplayContributions: {
      contentPackIds: ["pack.test.game-store-playable-shells"],
      navigation: [],
      events: [],
      scenes: [],
      dialogues: [],
      tasks: [],
      houses: [],
      houseModules: [],
      playables: ["flow.test.game-store-preview"],
      playableIntegrations: [
        "playable.flow.test.game-store-preview.house.default",
      ],
    },
    startupProfile: {},
  });
}

test("game store accepts playableShellsById as the canonical flow shell owner", () => {
  configureFlowRuntimeRegistries();

  try {
    const store = createGameStore(createBaseState(), {
      characterDefinitions: [{ id: "char.player", name: "Player" }],
      eventDefinitionsById: {
        "event.store.flow-preview": {
          id: "event.store.flow-preview",
          chapterId: "chapter.test",
          name: "Store Flow Preview",
          occurrence: "repeatable",
          trigger: { timing: "manual" },
          conditions: [],
          entrySceneId: "scene.store.flow-preview",
          actions: [
            {
              type: "launchPlayable",
              playableId: "flow.test.game-store-preview",
              integrationId:
                "playable.flow.test.game-store-preview.house.default",
              ownerContext: {
                ownerKind: "house",
                ownerId: "house.test",
                returnPolicy: "reenter-owner",
              },
            },
          ],
        },
      },
      sceneDefinitionsById: {},
      playableShellsById: {
        "flow.test.game-store-preview": {
          id: "flow.test.game-store-preview",
          title: "Game Store Flow Preview",
          initialNodeId: "node.start",
          nodes: [
            {
              id: "node.start",
              type: "text",
              text: "start",
              nextNodeId: "node.complete",
            },
            {
              id: "node.complete",
              type: "complete",
              outcome: "success",
            },
          ],
        },
      },
    });

    const snapshot = store.syncScene();
    assert.equal(snapshot.state.ui.currentView, "minigame");
    assert.equal(
      snapshot.state.runtime.playableSession?.playableId,
      "flow.test.game-store-preview"
    );
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});

test(
  "game store syncScene routes scene start-event continuation through dispatchRuntimeRequest",
  { concurrency: false },
  () => {
    const runtimeDispatchPath = require.resolve(
      "../.test-dist/core/runtime/runtime-dispatch.js"
    );
    const gameStorePath = require.resolve(
      "../.test-dist/application/state/game-store.js"
    );

    delete require.cache[gameStorePath];
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
      const { createGameStore: createGameStoreWithPatchedDispatch } = require(
        gameStorePath
      );
      const store = createGameStoreWithPatchedDispatch(createBaseState(), {
        characterDefinitions: [{ id: "char.player", name: "Player" }],
        eventDefinitionsById: {
          "event.store.flow-preview": createEvent(
            "event.store.flow-preview",
            "scene.store.flow-preview"
          ),
          "event.store.followup": createEvent(
            "event.store.followup",
            "scene.store.followup"
          ),
        },
        sceneDefinitionsById: {
          "scene.store.flow-preview": {
            id: "scene.store.flow-preview",
            name: "Store Start Event",
            actions: [
              {
                type: "start-event",
                eventId: "event.store.followup",
              },
            ],
          },
          "scene.store.followup": {
            id: "scene.store.followup",
            name: "Store Follow-up Event",
            actions: [],
          },
        },
      });

      dispatchRuntimeRequestCalls = 0;
      const snapshot = store.syncScene();

      assert.equal(
        snapshot.state.runtime.eventHistory["event.store.followup"]?.firedCount,
        1
      );
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "game store syncScene should route scene start-event continuation through dispatchRuntimeRequest instead of relying on the compatibility seam only"
      );
    } finally {
      patchedRuntimeDispatch.dispatchRuntimeRequest =
        originalDispatchRuntimeRequest;
      delete require.cache[gameStorePath];
      delete require.cache[runtimeDispatchPath];
    }
  }
);

test(
  "game store chooseOption routes nextEvent continuation through dispatchRuntimeRequest",
  { concurrency: false },
  () => {
    const runtimeDispatchPath = require.resolve(
      "../.test-dist/core/runtime/runtime-dispatch.js"
    );
    const gameStorePath = require.resolve(
      "../.test-dist/application/state/game-store.js"
    );

    delete require.cache[gameStorePath];
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
      const { createGameStore: createGameStoreWithPatchedDispatch } = require(
        gameStorePath
      );
      const store = createGameStoreWithPatchedDispatch(
        {
          ...createBaseState(),
          scene: {
            activeEventId: "event.store.choice",
            activeSceneId: "scene.store.choice",
            cursor: 0,
            status: "waiting-choice",
          },
        },
        {
          characterDefinitions: [{ id: "char.player", name: "Player" }],
          eventDefinitionsById: {
            "event.store.choice": createEvent(
              "event.store.choice",
              "scene.store.choice"
            ),
            "event.store.choice-followup": createEvent(
              "event.store.choice-followup",
              "scene.store.choice-followup"
            ),
          },
          sceneDefinitionsById: {
            "scene.store.choice": {
              id: "scene.store.choice",
              name: "Store Choice Event",
              actions: [
                {
                  type: "choice",
                  options: [
                    {
                      id: "option.store.followup",
                      label: "Follow-up",
                      nextEventId: "event.store.choice-followup",
                    },
                  ],
                },
              ],
            },
            "scene.store.choice-followup": {
              id: "scene.store.choice-followup",
              name: "Store Choice Follow-up Event",
              actions: [],
            },
          },
        }
      );

      dispatchRuntimeRequestCalls = 0;
      const snapshot = store.chooseOption({
        id: "option.store.followup",
        label: "Follow-up",
        nextEventId: "event.store.choice-followup",
      });

      assert.equal(
        snapshot.state.runtime.eventHistory["event.store.choice-followup"]
          ?.firedCount,
        1
      );
      assert.ok(
        dispatchRuntimeRequestCalls > 0,
        "game store chooseOption should route nextEvent continuation through dispatchRuntimeRequest instead of relying on the compatibility seam only"
      );
    } finally {
      patchedRuntimeDispatch.dispatchRuntimeRequest =
        originalDispatchRuntimeRequest;
      delete require.cache[gameStorePath];
      delete require.cache[runtimeDispatchPath];
    }
  }
);
