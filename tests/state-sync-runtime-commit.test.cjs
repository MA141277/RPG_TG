const assert = require("node:assert/strict");
const test = require("node:test");

const {
  commitRuntimeRequest,
} = require("../.test-dist/core/runtime/state-sync-runtime.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

function createAppState() {
  return {
    gameState: createInitialState({
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
    beggingMiniGameState: null,
    autoAdvanceState: null,
    campaignTravelState: null,
    cityDirectoryState: null,
    cityMenuState: null,
    locationDialogueState: null,
    modalState: null,
    characterDefinitions: [{ id: "hero" }],
    characterStatusById: {
      hero: { statPatch: { martial: 20 } },
    },
    cityStatusById: {
      "city.test": { valuePatch: { prosperity: 10 } },
    },
    buildingStatusById: {
      "house.test": { runtimePatch: { level: 1 } },
    },
  };
}

test("commitRuntimeRequest applies runtime status patches through the state sync seam", () => {
  const result = commitRuntimeRequest({
    state: createAppState(),
    request: { family: "action", type: "action", actionId: "test.status" },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [],
          characterStatusById: {
            hero: { skillPatch: { arithmetic: 3 } },
          },
          cityStatusById: {
            "city.test": { valuePatch: { danger: 4 } },
          },
          buildingStatusById: {
            "house.test": { runtimePatch: { damaged: true } },
          },
        }),
      },
    },
  });

  assert.deepEqual(result.state.characterStatusById.hero, {
    statPatch: { martial: 20 },
    skillPatch: { arithmetic: 3 },
  });
  assert.deepEqual(result.state.cityStatusById["city.test"], {
    valuePatch: { prosperity: 10, danger: 4 },
  });
  assert.deepEqual(result.state.buildingStatusById["house.test"], {
    runtimePatch: { level: 1, damaged: true },
  });
});

test("commitRuntimeRequest no longer settles legacy playable settlement effects through runtime commit flow", () => {
  const result = commitRuntimeRequest({
    state: createAppState(),
    request: {
      family: "action",
      type: "action",
      actionId: "test.playable-settlement",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [],
          settlement: {
            integrationId: "playable.test",
            outcome: "success",
            factResult: { status: "completed" },
            handoff: {
              type: "close-only",
              ownerKind: "external",
              ownerId: null,
            },
            effects: [
              {
                type: "setFlag",
                key: "playable.settled",
                value: true,
              },
            ],
          },
        }),
      },
    },
  });

  assert.equal(result.state.gameState.runtime.flags["playable.settled"], undefined);
  assert.deepEqual(result.runtimeResult.settlement.effects, [
    {
      type: "setFlag",
      key: "playable.settled",
      value: true,
    },
  ]);
});

test("commitRuntimeRequest settles playable settlement commands before app state write-back", () => {
  const result = commitRuntimeRequest({
    state: createAppState(),
    request: {
      family: "action",
      type: "action",
      actionId: "test.playable-settlement-commands",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [],
          settlement: {
            integrationId: "playable.test",
            outcome: "success",
            factResult: { status: "completed" },
            handoff: {
              type: "close-only",
              ownerKind: "external",
              ownerId: null,
            },
            commands: [
              {
                type: "flag.set",
                key: "playable.commands.settled",
                value: true,
              },
            ],
            effects: [],
          },
        }),
      },
    },
  });

  assert.equal(
    result.state.gameState.runtime.flags["playable.commands.settled"],
    true
  );
  assert.deepEqual(result.runtimeResult.settlement.commands, [
    {
      type: "flag.set",
      key: "playable.commands.settled",
      value: true,
    },
  ]);
});
