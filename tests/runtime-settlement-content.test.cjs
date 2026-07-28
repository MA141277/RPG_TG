const test = require("node:test");
const assert = require("node:assert/strict");

const {
  applySettlementContents,
} = require("../.test-dist/core/runtime/runtime-settlement.js");

test("applySettlementContents applies numeric, boolean, and enum changes", () => {
  const state = {
    people: {
      hero: {
        stats: { merit: 10 },
        enlisted: false,
        rank: "guest",
      },
    },
  };

  const nextState = applySettlementContents(state, {
    contents: [
      {
        targetFamily: "person",
        targetId: "hero",
        attributeKey: "stats.merit",
        attributeType: "number",
        operation: "add",
        value: 5,
      },
      {
        targetFamily: "person",
        targetId: "hero",
        attributeKey: "enlisted",
        attributeType: "boolean",
        operation: "set",
        value: true,
      },
      {
        targetFamily: "person",
        targetId: "hero",
        attributeKey: "rank",
        attributeType: "enum",
        operation: "set",
        value: "officer",
      },
    ],
  });

  assert.equal(nextState.people.hero.stats.merit, 15);
  assert.equal(nextState.people.hero.enlisted, true);
  assert.equal(nextState.people.hero.rank, "officer");
  assert.equal(state.people.hero.stats.merit, 10);
});

test("applySettlementContents ignores unsupported or missing targets", () => {
  const state = {
    cities: {
      haozhou: {
        prosperity: 20,
        open: true,
      },
    },
  };

  const nextState = applySettlementContents(state, {
    contents: [
      {
        targetFamily: "city",
        targetId: "missing",
        attributeKey: "prosperity",
        attributeType: "number",
        operation: "add",
        value: 10,
      },
      {
        targetFamily: "city",
        targetId: "haozhou",
        attributeKey: "open",
        attributeType: "boolean",
        operation: "add",
        value: true,
      },
    ],
  });

  assert.deepEqual(nextState, state);
});
