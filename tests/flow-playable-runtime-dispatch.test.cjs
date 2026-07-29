const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod,
  resetDefaultPlayableRuntimeRegistries,
} = require("../.test-dist/core/runtime/playable-runtime-registries.js");
const {
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  createExitPlayableRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

const flowDefinition = {
  id: "flow-test",
  title: "Flow Dispatch Test",
  initialNodeId: "intro",
  nodes: [
    {
      id: "intro",
      type: "text",
      text: "Intro text",
      nextNodeId: "choice",
    },
    {
      id: "choice",
      type: "choice",
      prompt: "Choose",
      options: [{ id: "success", label: "Success", nextNodeId: "done" }],
    },
    {
      id: "done",
      type: "complete",
      outcome: "success",
      metrics: { score: 1 },
      detail: { flagKey: "flow.completed" },
    },
  ],
};

function createRuntimeState() {
  const grainShopHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.moduleId === "grain-shop"
  );

  return {
    core: createInitialState({
      currentMapId: prototypeMap.id,
      currentCityId: "city.kulan",
      currentHouseId: grainShopHouse.id,
      playerCharacterId,
      chapterId: "chapter.prototype",
      year: 1567,
      month: 1,
      day: 1,
      pinnedCharacterId: playerCharacterId,
      reviewDateText: "test",
      mainHouseMissionText: "test",
      cards: {
        ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
        selectedCardId: prototypeCards[0]?.id ?? null,
      },
      valuables: {
        items: prototypeValuables,
        selectedItemId: prototypeValuables[0]?.id ?? null,
        equippedWeaponSet: {
          swordId:
            prototypeValuables.find(
              (valuableDefinition) => valuableDefinition.category === "weapon"
            )?.id ?? null,
          armorId:
            prototypeValuables.find(
              (valuableDefinition) => valuableDefinition.category === "armor"
            )?.id ?? null,
        },
      },
      currentView: "house",
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

function configureFlowPlayableRegistry() {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod({
    modId: "mod.test.flow-dispatch",
    manifest: {
      id: "mod.test.flow-dispatch",
      schemaVersion: "1",
      version: "1.0.0",
      title: "Flow Dispatch Test",
      entryContentPackIds: ["pack.test.flow-dispatch"],
    },
    normalizedContentSources: [
      {
        playables: [
          {
            id: "flow-test",
            family: "flow",
            commandPrefix: "playable.flow-test.",
          },
        ],
        playableIntegrations: [
          {
            integrationId: "integration.flow-test",
            playableId: "flow-test",
            ownerDefaults: {
              ownerKind: "dialogue",
              ownerId: "dialogue.test.flow",
              returnPolicy: "resume-owner",
            },
            trigger: {
              triggerId: "trigger.flow-test",
              ownerKind: "dialogue",
              trigger: "manual-launch",
            },
            outcomeConfig: {},
          },
        ],
      },
    ],
    registeredDefinitionIds: ["pack.test.flow-dispatch"],
    gameplayContributions: {
      contentPackIds: ["pack.test.flow-dispatch"],
      navigation: [],
      events: [],
      scenes: [],
      dialogues: [],
      tasks: [],
      houses: [],
      houseModules: [],
      playables: ["flow-test"],
      playableIntegrations: ["integration.flow-test"],
    },
    startupProfile: {},
  });
}

test("playable runtime launches and reduces flow playables", () => {
  try {
    configureFlowPlayableRegistry();

    const launched = runPlayableRuntime({
      state: createRuntimeState(),
      request: createLaunchPlayableRequest("flow-test"),
      characterDefinitions: prototypeCharacters,
      flowPlayablesById: { "flow-test": flowDefinition },
    });

    assert.equal(launched.handled, true);
    assert.equal(launched.session?.playableId, "flow-test");
    assert.equal(launched.session?.family, "flow");
    assert.deepEqual(launched.state.core.runtime.playableSession?.state, {
      currentNodeId: "intro",
    });

    const confirmed = runPlayableRuntime({
      state: launched.state,
      request: createPlayableActionRequest("flow-test", "confirm"),
      characterDefinitions: prototypeCharacters,
      flowPlayablesById: { "flow-test": flowDefinition },
    });

    assert.equal(confirmed.handled, true);
    assert.deepEqual(confirmed.state.core.runtime.playableSession?.state, {
      currentNodeId: "choice",
    });

    const completed = runPlayableRuntime({
      state: confirmed.state,
      request: createPlayableActionRequest("flow-test", "select", {
        value: "success",
      }),
      characterDefinitions: prototypeCharacters,
      flowPlayablesById: { "flow-test": flowDefinition },
    });

    assert.equal(completed.handled, true);
    assert.equal(completed.session, null);
    assert.equal(completed.state.core.runtime.playableSession, null);
    assert.deepEqual(completed.settlement, {
      integrationId: "integration.flow-test",
      outcome: "success",
      factResult: {
        status: "completed",
        metrics: { score: 1 },
        detail: { flagKey: "flow.completed" },
      },
      handoff: {
        type: "resume-owner",
        ownerKind: "dialogue",
        ownerId: "dialogue.test.flow",
      },
      effects: [],
    });
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});

test("playable runtime exits active flow playables", () => {
  try {
    configureFlowPlayableRegistry();

    const launched = runPlayableRuntime({
      state: createRuntimeState(),
      request: createLaunchPlayableRequest("flow-test"),
      characterDefinitions: prototypeCharacters,
      flowPlayablesById: { "flow-test": flowDefinition },
    });

    const exited = runPlayableRuntime({
      state: launched.state,
      request: createExitPlayableRequest("flow-test"),
      characterDefinitions: prototypeCharacters,
      flowPlayablesById: { "flow-test": flowDefinition },
    });

    assert.equal(exited.handled, true);
    assert.equal(exited.session, null);
    assert.equal(exited.state.core.runtime.playableSession, null);
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});
