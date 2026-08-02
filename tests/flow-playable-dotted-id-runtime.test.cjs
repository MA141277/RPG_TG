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
const dottedFlowDefinition = {
  id: "flow.building.house.kulan.temple.carry_water",
  title: "Temple Carry Water Flow Dispatch Test",
  initialNodeId: "intro",
  nodes: [
    {
      id: "intro",
      type: "text",
      text: "Carry water intro",
      nextNodeId: "done",
    },
    {
      id: "done",
      type: "complete",
      outcome: "success",
      metrics: { score: 1 },
      detail: { flagKey: "temple.carry_water.completed" },
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

function configureDottedFlowPlayableRegistry() {
  configureDefaultPlayableRuntimeRegistriesFromActivatedMod({
    modId: "mod.test.flow-dispatch.dotted",
    manifest: {
      id: "mod.test.flow-dispatch.dotted",
      schemaVersion: "1",
      version: "1.0.0",
      title: "Dotted Flow Dispatch Test",
      entryContentPackIds: ["pack.test.flow-dispatch.dotted"],
    },
    normalizedContentSources: [
      {
        playableShells: [dottedFlowDefinition],
      },
    ],
    registeredDefinitionIds: ["pack.test.flow-dispatch.dotted"],
    gameplayContributions: {
      contentPackIds: ["pack.test.flow-dispatch.dotted"],
      navigation: [],
      events: [],
      scenes: [],
      dialogues: [],
      tasks: [],
      houses: [],
      houseModules: [],
      playables: [dottedFlowDefinition.id],
      playableIntegrations: [`playable.${dottedFlowDefinition.id}.default`],
    },
    startupProfile: {},
  });
}

test("playable runtime dispatches actions for dotted flow playable ids", () => {
  try {
    configureDottedFlowPlayableRegistry();

    const launched = runPlayableRuntime({
      state: createRuntimeState(),
      request: createLaunchPlayableRequest(dottedFlowDefinition.id, {
        integrationId: `playable.${dottedFlowDefinition.id}.default`,
        ownerContext: {
          ownerKind: "dialogue",
          ownerId: "dialogue.test.flow.dotted",
          returnPolicy: "resume-owner",
        },
      }),
      characterDefinitions: prototypeCharacters,
    });

    assert.equal(launched.handled, true);
    assert.deepEqual(launched.state.core.runtime.playableSession?.state, {
      currentNodeId: "intro",
    });

    const confirmed = runPlayableRuntime({
      state: launched.state,
      request: createPlayableActionRequest(dottedFlowDefinition.id, "confirm"),
      characterDefinitions: prototypeCharacters,
    });

    assert.equal(confirmed.handled, true);
    assert.equal(confirmed.state.core.runtime.playableSession, null);
    assert.equal(
      confirmed.settlement?.integrationId,
      `playable.${dottedFlowDefinition.id}.default`
    );
    assert.equal(confirmed.settlement?.outcome, "success");
    assert.deepEqual(confirmed.settlement?.factResult, {
      status: "completed",
      metrics: { score: 1 },
      detail: { flagKey: "temple.carry_water.completed" },
    });
    assert.deepEqual(confirmed.settlement?.handoff, {
      type: "resume-owner",
      ownerKind: "dialogue",
      ownerId: "dialogue.test.flow.dotted",
    });
    assert.ok(Array.isArray(confirmed.settlement?.effects));
    assert.ok((confirmed.settlement?.effects.length ?? 0) > 0);
  } finally {
    resetDefaultPlayableRuntimeRegistries();
  }
});
