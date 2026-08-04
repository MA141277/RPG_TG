const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  startStoryEventById,
} = require("../.test-dist/application/story/story-runtime.js");
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
    currentView: "house",
  });
}

function configureFlowRuntimeRegistries() {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod({
    modId: "mod.test.story-runtime-playable-shells",
    manifest: {
      id: "mod.test.story-runtime-playable-shells",
      schemaVersion: "1",
      version: "1.0.0",
      title: "Story Runtime Playable Shells Test",
      entryContentPackIds: ["pack.test.story-runtime-playable-shells"],
    },
    normalizedContentSources: [
      {
        playables: [
          {
            id: "flow.test.story-runtime-preview",
            commandPrefix: "playable.flow.test.story-runtime-preview.",
          },
        ],
        playableIntegrations: [
          {
            integrationId: "playable.flow.test.story-runtime-preview.house.default",
            playableId: "flow.test.story-runtime-preview",
            ownerDefaults: {
              ownerKind: "house",
              ownerId: "house.test",
              returnPolicy: "reenter-owner",
            },
            trigger: {
              triggerId: "trigger.playable.flow.test.story-runtime-preview.house.default",
              ownerKind: "house",
              trigger: "manual-launch",
            },
            outcomeConfig: {},
          },
        ],
      },
    ],
    registeredDefinitionIds: ["pack.test.story-runtime-playable-shells"],
    gameplayContributions: {
      contentPackIds: ["pack.test.story-runtime-playable-shells"],
      navigation: [],
      events: [],
      scenes: [],
      dialogues: [],
      tasks: [],
      houses: [],
      houseModules: [],
      playables: ["flow.test.story-runtime-preview"],
      playableIntegrations: [
        "playable.flow.test.story-runtime-preview.house.default",
      ],
    },
    startupProfile: {},
  });
}

test("story runtime accepts playableShellsById as the canonical flow shell owner", () => {
  configureFlowRuntimeRegistries();

  try {
    const result = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: [{ id: "char.player", name: "Player" }],
      },
      {
        eventDefinitionsById: {
          "event.story.flow-preview": {
            id: "event.story.flow-preview",
            chapterId: "chapter.test",
            name: "Story Flow Preview",
            occurrence: "repeatable",
            entrySceneId: "scene.story.flow-preview",
            actions: [
              {
                type: "launchPlayable",
                playableId: "flow.test.story-runtime-preview",
                integrationId:
                  "playable.flow.test.story-runtime-preview.house.default",
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
          "flow.test.story-runtime-preview": {
            id: "flow.test.story-runtime-preview",
            title: "Flow Preview",
            initialNodeId: "node.start",
            nodes: [
              {
                id: "node.start",
                type: "text",
                text: "Flow preview start",
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
      },
      "event.story.flow-preview"
    );

    assert.equal(result.state.ui.currentView, "minigame");
    assert.equal(
      result.state.runtime.playableSession?.playableId,
      "flow.test.story-runtime-preview"
    );
    assert.equal(
      result.state.runtime.playableSession?.ownerContext.sessionToken,
      "event.story.flow-preview"
    );
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});
