const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createRuntimeTriggerContext,
  isSupportedEventBindingOwnerFamily,
  isSupportedEventBindingTrigger,
  runModFirstEventBindingRuntime,
  selectModFirstEventBindingCandidate,
} = require("../.test-dist/core/runtime/event-binding-contract.js");

test("event binding contract recognizes supported runtime binding surfaces", () => {
  assert.equal(isSupportedEventBindingOwnerFamily("city"), true);
  assert.equal(isSupportedEventBindingOwnerFamily("unknown"), false);
  assert.equal(
    isSupportedEventBindingTrigger({
      timing: "after",
      action: "city-enter",
    }),
    true
  );
  assert.equal(
    isSupportedEventBindingTrigger({
      timing: "before",
      action: "city-enter",
    }),
    false
  );
});

test("createRuntimeTriggerContext carries current location and payload", () => {
  const context = createRuntimeTriggerContext({
    state: {
      world: {
        currentCityId: "haozhou",
        currentHouseId: "temple",
      },
    },
    owner: {
      family: "building",
      id: "temple",
    },
    action: "building-enter",
    actorCharacterId: "player",
    payload: {
      source: "test",
    },
  });

  assert.deepEqual(context, {
    owner: {
      family: "building",
      id: "temple",
    },
    timing: "after",
    action: "building-enter",
    actorCharacterId: "player",
    currentCityId: "haozhou",
    currentHouseId: "temple",
    payload: {
      source: "test",
    },
  });
});

test("selectModFirstEventBindingCandidate filters and sorts bindings", () => {
  const state = {
    calendar: {
      chapterId: "chapter-1",
    },
    runtime: {
      flags: {
        ready: true,
      },
      variables: {
        score: 5,
      },
      eventHistory: {
        alreadyUsed: {
          firedCount: 1,
          lastTriggeredOn: "1351-01-01",
        },
      },
    },
  };
  const eventDefinitionsById = {
    lowPriority: createEventDefinition("lowPriority", "repeatable"),
    highPriority: createEventDefinition("highPriority", "repeatable", {
      taskInputs: [{ type: "custom-task", taskId: "task-1" }],
    }),
    alreadyUsed: createEventDefinition("alreadyUsed", "once"),
  };

  const candidate = selectModFirstEventBindingCandidate({
    state,
    eventDefinitionsById,
    triggerContext: {
      timing: "after",
      action: "building-enter",
      owner: {
        family: "building",
        id: "house.haozhou.temple",
      },
    },
    eventBindings: [
      {
        id: "ignored-used",
        eventId: "alreadyUsed",
        owner: { family: "building", id: "house.template.temple" },
        trigger: { timing: "after", action: "building-enter" },
        priority: 100,
      },
      {
        id: "low",
        eventId: "lowPriority",
        owner: { family: "building", id: "house.template.temple" },
        trigger: { timing: "after", action: "building-enter" },
        priority: 1,
      },
      {
        id: "high",
        eventId: "highPriority",
        owner: { family: "building", id: "house.template.temple" },
        trigger: { timing: "after", action: "building-enter" },
        priority: 10,
        conditions: {
          operator: "all",
          conditions: [
            { type: "flag", key: "ready", expected: true },
            { type: "variable", key: "score", operator: ">=", value: 5 },
          ],
        },
      },
    ],
  });

  assert.deepEqual(candidate, {
    bindingId: "high",
    eventId: "highPriority",
    priority: 10,
    taskInputs: [{ type: "custom-task", taskId: "task-1" }],
  });
});

test("runModFirstEventBindingRuntime activates candidate without mutating state", () => {
  const state = {
    calendar: {
      chapterId: "chapter-1",
    },
    runtime: {
      flags: {},
      variables: {},
      eventHistory: {},
    },
  };
  const eventDefinitionsById = {
    eventA: createEventDefinition("eventA", "repeatable", {
      taskInputs: [{ type: "custom-task", taskId: "task-1" }],
    }),
  };

  const result = runModFirstEventBindingRuntime({
    state,
    eventDefinitionsById,
    triggerContext: {
      timing: "after",
      action: "city-enter",
      owner: {
        family: "city",
        id: "haozhou",
      },
    },
    eventBindings: [
      {
        id: "binding-a",
        eventId: "eventA",
        owner: { family: "city", id: "haozhou" },
        trigger: { timing: "after", action: "city-enter" },
      },
    ],
  });

  assert.equal(result.state, state);
  assert.deepEqual(result.activation, {
    activeEventId: "eventA",
    taskInputs: [{ type: "custom-task", taskId: "task-1" }],
  });
  assert.equal(result.candidate.bindingId, "binding-a");
});

test("runModFirstEventBindingRuntime returns empty activation when no binding matches", () => {
  const state = {
    calendar: {
      chapterId: "chapter-1",
    },
    runtime: {
      flags: {},
      variables: {},
      eventHistory: {},
    },
  };

  const result = runModFirstEventBindingRuntime({
    state,
    eventDefinitionsById: {
      eventA: createEventDefinition("eventA", "repeatable"),
    },
    triggerContext: {
      timing: "after",
      action: "city-enter",
      owner: {
        family: "city",
        id: "haozhou",
      },
    },
    eventBindings: [
      {
        id: "binding-a",
        eventId: "eventA",
        owner: { family: "city", id: "other-city" },
        trigger: { timing: "after", action: "city-enter" },
      },
    ],
  });

  assert.equal(result.state, state);
  assert.equal(result.activation, null);
  assert.equal(result.candidate, null);
});

function createEventDefinition(id, occurrence, extra = {}) {
  return {
    id,
    chapterId: "chapter-1",
    name: id,
    occurrence,
    trigger: {
      timing: "manual",
    },
    conditions: [],
    entrySceneId: `${id}.scene`,
    ...extra,
  };
}
