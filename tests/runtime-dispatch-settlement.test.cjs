const assert = require("node:assert/strict");
const test = require("node:test");

const {
  dispatchRuntimeRequest,
} = require("../.test-dist/core/runtime/runtime-dispatch.js");
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

function createCharacterDefinition() {
  return {
    id: "hero",
    name: "Hero",
    birthYear: 1540,
    age: 20,
    cityId: "city.test",
    portraitId: "portrait.hero",
    stats: {
      leadership: 10,
      martial: 20,
      intelligence: 30,
      politics: 40,
      charm: 50,
      fame: 0,
      gold: 100,
    },
    stamina: 100,
    availableFunctions: [],
  };
}

test("dispatchRuntimeRequest carries routed character definitions through effect settlement", () => {
  const characterDefinitions = [createCharacterDefinition()];

  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: { family: "action", type: "action", actionId: "test.character" },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [
            {
              type: "mutateCharacterNumericProperty",
              characterId: "hero",
              propertyId: "stats.martial",
              operation: "add",
              value: 6,
            },
          ],
          characterDefinitions,
        }),
      },
    },
  });

  assert.equal(result.characterDefinitions[0].stats.martial, 26);
  assert.deepEqual(result.characterStatusById.hero.statPatch, {
    martial: 26,
  });
});

test("dispatchRuntimeRequest settles routed taskInputs without requiring split task action and signal fields", () => {
  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: { family: "action", type: "action", actionId: "test.task-inputs" },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [],
          taskInputs: [
            {
              type: "start",
              taskId: "task.dispatch.input",
              occurredAt: "2026-07-29T08:00:00.000Z",
              source: "event-runtime",
            },
            {
              type: "scene.reported",
              source: "scene-runtime",
              occurredAt: "2026-07-29T08:05:00.000Z",
            },
          ],
        }),
      },
      taskDefinitionsById: {
        "task.dispatch.input": {
          id: "task.dispatch.input",
          title: "Dispatch Input Task",
          objectives: [
            { id: "report", target: 1, signalType: "scene.reported" },
          ],
          onCompleteEffects: [
            {
              type: "setFlag",
              key: "task.dispatch.input.completed",
              value: true,
            },
          ],
        },
      },
    },
  });

  assert.equal(
    result.state.core.runtime.tasks.instancesByTaskId["task.dispatch.input"]
      .status,
    "completed"
  );
  assert.equal(
    result.state.core.runtime.flags["task.dispatch.input.completed"],
    true
  );
  assert.deepEqual(
    result.taskUpdates.map((update) => update.type),
    ["started", "completed"]
  );
});

test("dispatchRuntimeRequest routes immediate followUpEventIds through the shared event-chain owner", () => {
  const visitedEventIds = [];

  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: {
      family: "action",
      type: "action",
      actionId: "test.follow-up-event-chain",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [
            {
              type: "setFlag",
              key: "event.chain.root",
              value: true,
            },
          ],
          followUpEventIds: ["event.chain.second"],
        }),
        routeEventChain: ({ state, eventId }) => {
          visitedEventIds.push(eventId);
          return {
            state,
            effects: [
              {
                type: "setFlag",
                key: eventId,
                value: true,
              },
            ],
            taskInputs: [
              {
                type: "start",
                taskId: `task.${eventId}`,
                occurredAt: "2026-07-30T10:00:00.000Z",
                source: "event-runtime",
              },
            ],
            event: {
              id: eventId,
              kind: "bridge",
              payload: {},
            },
            ...(eventId === "event.chain.second"
              ? { followUpEventIds: ["event.chain.third"] }
              : {}),
          };
        },
      },
      taskDefinitionsById: {
        "task.event.chain.second": {
          id: "task.event.chain.second",
          title: "Second Chain Task",
          objectives: [],
          onCompleteEffects: [],
        },
        "task.event.chain.third": {
          id: "task.event.chain.third",
          title: "Third Chain Task",
          objectives: [],
          onCompleteEffects: [],
        },
      },
    },
  });

  assert.deepEqual(visitedEventIds, [
    "event.chain.second",
    "event.chain.third",
  ]);
  assert.equal(result.state.core.runtime.flags["event.chain.root"], true);
  assert.equal(result.state.core.runtime.flags["event.chain.second"], true);
  assert.equal(result.state.core.runtime.flags["event.chain.third"], true);
  assert.equal(
    result.state.core.runtime.tasks.instancesByTaskId["task.event.chain.second"]
      .status,
    "active"
  );
  assert.equal(
    result.state.core.runtime.tasks.instancesByTaskId["task.event.chain.third"]
      .status,
    "active"
  );
});

test("dispatchRuntimeRequest treats split task action and signal fields as fallback-only when canonical taskInputs are present", () => {
  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: {
      family: "action",
      type: "action",
      actionId: "test.task-inputs-canonical-first",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [],
          taskInputs: [
            {
              type: "start",
              taskId: "task.dispatch.primary",
              occurredAt: "2026-07-30T08:00:00.000Z",
              source: "event-runtime",
            },
            {
              type: "scene.reported",
              source: "scene-runtime",
              occurredAt: "2026-07-30T08:05:00.000Z",
            },
          ],
          taskActions: [
            {
              type: "start",
              taskId: "task.dispatch.legacy",
              occurredAt: "2026-07-30T08:10:00.000Z",
              source: "event-runtime",
            },
          ],
          taskSignals: [
            {
              type: "scene.legacy-only",
              source: "scene-runtime",
              occurredAt: "2026-07-30T08:15:00.000Z",
            },
          ],
        }),
      },
      taskDefinitionsById: {
        "task.dispatch.primary": {
          id: "task.dispatch.primary",
          title: "Dispatch Primary Task",
          objectives: [
            { id: "report", target: 1, signalType: "scene.reported" },
          ],
          onCompleteEffects: [
            {
              type: "setFlag",
              key: "task.dispatch.primary.completed",
              value: true,
            },
          ],
        },
        "task.dispatch.legacy": {
          id: "task.dispatch.legacy",
          title: "Dispatch Legacy Task",
          objectives: [
            { id: "report", target: 1, signalType: "scene.legacy-only" },
          ],
          onCompleteEffects: [
            {
              type: "setFlag",
              key: "task.dispatch.legacy.completed",
              value: true,
            },
          ],
        },
      },
    },
  });

  assert.equal(
    result.state.core.runtime.tasks.instancesByTaskId["task.dispatch.primary"]
      .status,
    "completed"
  );
  assert.equal(
    result.state.core.runtime.tasks.instancesByTaskId["task.dispatch.legacy"],
    undefined
  );
  assert.equal(
    result.state.core.runtime.flags["task.dispatch.primary.completed"],
    true
  );
  assert.equal(
    result.state.core.runtime.flags["task.dispatch.legacy.completed"],
    undefined
  );
  assert.deepEqual(
    result.taskUpdates.map((update) => ({
      taskId: update.taskId,
      type: update.type,
    })),
    [
      { taskId: "task.dispatch.primary", type: "started" },
      { taskId: "task.dispatch.primary", type: "completed" },
    ]
  );
});

test("dispatchRuntimeRequest handles routed followUp before legacy interactive fallback", () => {
  const state = createBaseRuntimeState();
  let handledFollowUp = null;
  let handledInteractive = null;

  const result = dispatchRuntimeRequest({
    state,
    request: { family: "action", type: "action", actionId: "test.follow-up" },
    context: {
      router: {
        route: ({ state: routeState }) => ({
          state: routeState,
          effects: [],
          followUp: { type: "reenter-house", houseId: "house.follow-up" },
          interactive: { type: "reenter-house", houseId: "house.legacy" },
        }),
      },
      followUp: {
        handleFollowUp: ({ state: followUpState, followUp }) => {
          handledFollowUp = followUp;
          return {
            state: {
              ...followUpState,
              core: {
                ...followUpState.core,
                world: {
                  ...followUpState.core.world,
                  currentHouseId: followUp.houseId,
                },
              },
            },
          };
        },
        handleInteractive: ({ interactive }) => {
          handledInteractive = interactive;
          return state;
        },
      },
    },
  });

  assert.deepEqual(handledFollowUp, {
    type: "reenter-house",
    houseId: "house.follow-up",
  });
  assert.equal(handledInteractive, null);
  assert.equal(result.state.core.world.currentHouseId, "house.follow-up");
  assert.deepEqual(result.followUp, { type: "none" });
  assert.deepEqual(result.interactive, {
    type: "reenter-house",
    houseId: "house.legacy",
  });
});

test("dispatchRuntimeRequest keeps legacy interactive follow-up fallback", () => {
  let handledInteractive = null;

  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: {
      family: "action",
      type: "action",
      actionId: "test.legacy-interactive",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [],
          interactive: { type: "reenter-house", houseId: "house.legacy" },
        }),
      },
      followUp: {
        handleInteractive: ({ state, interactive }) => {
          handledInteractive = interactive;
          return {
            ...state,
            core: {
              ...state.core,
              world: {
                ...state.core.world,
                currentHouseId: interactive.houseId,
              },
            },
          };
        },
      },
    },
  });

  assert.deepEqual(handledInteractive, {
    type: "reenter-house",
    houseId: "house.legacy",
  });
  assert.equal(result.state.core.world.currentHouseId, "house.legacy");
  assert.deepEqual(result.interactive, { type: "none" });
});

test("dispatchRuntimeRequest settles routed and task effects before follow-up handling", () => {
  let followUpFlags = null;

  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: {
      family: "action",
      type: "action",
      actionId: "test.follow-up-after-settlement",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [
            {
              type: "setFlag",
              key: "event.test.follow-up.routed",
              value: true,
            },
          ],
          taskInputs: [
            {
              type: "start",
              taskId: "task.follow-up.settlement",
              occurredAt: "2026-07-30T09:00:00.000Z",
              source: "event-runtime",
            },
            {
              type: "scene.reported",
              source: "scene-runtime",
              occurredAt: "2026-07-30T09:05:00.000Z",
            },
          ],
          followUp: { type: "reenter-house", houseId: "house.after-settlement" },
        }),
      },
      taskDefinitionsById: {
        "task.follow-up.settlement": {
          id: "task.follow-up.settlement",
          title: "Follow-Up Settlement Task",
          objectives: [
            { id: "report", target: 1, signalType: "scene.reported" },
          ],
          onCompleteEffects: [
            {
              type: "setFlag",
              key: "event.test.follow-up.task",
              value: true,
            },
          ],
        },
      },
      followUp: {
        handleFollowUp: ({ state, followUp }) => {
          followUpFlags = {
            routed: state.core.runtime.flags["event.test.follow-up.routed"],
            task: state.core.runtime.flags["event.test.follow-up.task"],
          };
          return {
            state: {
              ...state,
              core: {
                ...state.core,
                world: {
                  ...state.core.world,
                  currentHouseId: followUp.houseId,
                },
              },
            },
          };
        },
      },
    },
  });

  assert.deepEqual(followUpFlags, {
    routed: true,
    task: true,
  });
  assert.equal(result.state.core.world.currentHouseId, "house.after-settlement");
  assert.deepEqual(result.followUp, { type: "none" });
});

test("dispatchRuntimeRequest does not treat router-supplied settlement payloads as the routed settlement owner", () => {
  const settledEffect = {
    type: "setFlag",
    key: "event.test.router-owned-settlement",
    value: true,
  };

  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: {
      family: "external",
      type: "external",
      eventId: "event.test.router-owned-settlement",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [settledEffect],
          settlement: {
            appliedBy: "feature-runtime",
            emittedBy: "runtime-router",
            settledEffects: [],
            unsupportedEffects: [settledEffect],
            warnings: ["router-pre-settled"],
          },
        }),
      },
    },
  });

  assert.equal(
    result.state.core.runtime.flags["event.test.router-owned-settlement"],
    true
  );
  assert.deepEqual(result.settlement, {
    commands: [],
    appliedBy: "runtime-settlement",
    emittedBy: "runtime-router",
    settledEffects: [settledEffect],
    unsupportedEffects: [],
    warnings: [],
  });
});

test("dispatchRuntimeRequest preserves canonical settlement command payloads for downstream settlement", () => {
  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: {
      family: "external",
      type: "external",
      eventId: "event.test.pending-settlement-commands",
    },
    context: {
      router: {
        route: ({ state }) => ({
          state,
          effects: [
            {
              type: "setFlag",
              key: "event.test.pending-settlement-routed",
              value: true,
            },
          ],
          settlement: {
            integrationId: "playable.pending",
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
                key: "event.test.pending-settlement-command",
                value: true,
              },
            ],
          },
        }),
      },
    },
  });

  assert.deepEqual(result.settlement.commands, [
    {
      type: "flag.set",
      key: "event.test.pending-settlement-command",
      value: true,
    },
  ]);
  assert.equal(
    result.state.core.runtime.flags["event.test.pending-settlement-routed"],
    true
  );
  assert.equal(
    result.state.core.runtime.flags["event.test.pending-settlement-command"],
    undefined
  );
  assert.deepEqual(result.settlement.settledEffects, [
    {
      type: "setFlag",
      key: "event.test.pending-settlement-routed",
      value: true,
    },
  ]);
  assert.equal("effects" in result.settlement, false);
});
