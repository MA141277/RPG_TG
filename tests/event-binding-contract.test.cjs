const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createRuntimeTriggerContext,
  isSupportedEventBindingOwnerFamily,
  isSupportedEventBindingTrigger,
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
