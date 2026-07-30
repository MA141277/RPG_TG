const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

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

test("runEventChain executes immediate routed follow-up events in deterministic queue order", () => {
  const { runEventChain } = require("../.test-dist/core/runtime/event-chain-runtime.js");
  const visited = [];

  const result = runEventChain({
    state: createBaseRuntimeState(),
    rootEventId: "event.chain.root",
    maxDepth: 4,
    router: {
      dispatchEventRoute: ({ state, eventId }) => {
        visited.push(eventId);
        return {
          state: {
            ...state,
            core: {
              ...state.core,
              runtime: {
                ...state.core.runtime,
                flags: {
                  ...state.core.runtime.flags,
                  [eventId]: true,
                },
              },
            },
          },
          effects: [],
          event: {
            id: eventId,
            kind: "bridge",
            payload: {},
          },
          ...(eventId === "event.chain.root"
            ? { followUpEventIds: ["event.chain.second", "event.chain.third"] }
            : {}),
          ...(eventId === "event.chain.second"
            ? { followUpEventIds: ["event.chain.fourth"] }
            : {}),
        };
      },
    },
  });

  assert.deepEqual(visited, [
    "event.chain.root",
    "event.chain.second",
    "event.chain.third",
    "event.chain.fourth",
  ]);
  assert.deepEqual(result.visitedEventIds, visited);
  assert.deepEqual(result.effects, []);
  assert.deepEqual(result.taskInputs, []);
  assert.equal(result.state.core.runtime.flags["event.chain.fourth"], true);
});

test("runEventChain fails closed on duplicate follow-up events and max-depth overflow", () => {
  const { runEventChain } = require("../.test-dist/core/runtime/event-chain-runtime.js");

  const duplicateGuardResult = runEventChain({
    state: createBaseRuntimeState(),
    rootEventId: "event.chain.root",
    maxDepth: 4,
    router: {
      dispatchEventRoute: ({ state, eventId }) => ({
        state,
        effects: [],
        event: {
          id: eventId,
          kind: "bridge",
          payload: {},
        },
        ...(eventId === "event.chain.root"
          ? { followUpEventIds: ["event.chain.loop", "event.chain.loop"] }
          : {}),
      }),
    },
  });

  assert.deepEqual(duplicateGuardResult.visitedEventIds, [
    "event.chain.root",
    "event.chain.loop",
  ]);

  assert.throws(
    () =>
      runEventChain({
        state: createBaseRuntimeState(),
        rootEventId: "event.chain.depth.1",
        maxDepth: 2,
        router: {
          dispatchEventRoute: ({ state, eventId }) => ({
            state,
            effects: [],
            event: {
              id: eventId,
              kind: "bridge",
              payload: {},
            },
            followUpEventIds: [
              eventId === "event.chain.depth.1"
                ? "event.chain.depth.2"
                : "event.chain.depth.3",
            ],
          }),
        },
      }),
    /max-depth/i
  );
});

test("runEventChain rejects owner-paced dialogue and settlement follow-up events", () => {
  const { runEventChain } = require("../.test-dist/core/runtime/event-chain-runtime.js");

  assert.throws(
    () =>
      runEventChain({
        state: createBaseRuntimeState(),
        rootEventId: "event.chain.dialogue",
        maxDepth: 2,
        router: {
          dispatchEventRoute: ({ state, eventId }) => ({
            state,
            effects: [],
            event: {
              id: eventId,
              kind: "dialogue",
              payload: {},
            },
          }),
        },
      }),
    /owner-paced kind: dialogue/i
  );

  assert.throws(
    () =>
      runEventChain({
        state: createBaseRuntimeState(),
        rootEventId: "event.chain.settlement",
        maxDepth: 2,
        router: {
          dispatchEventRoute: ({ state, eventId }) => ({
            state,
            effects: [],
            event: {
              id: eventId,
              kind: "settlement",
              payload: {},
            },
          }),
        },
      }),
    /owner-paced kind: settlement/i
  );
});
