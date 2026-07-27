const test = require("node:test");
const assert = require("node:assert/strict");

test("applyCoinReward adds gold only to the targeted player character", async () => {
  const { applyCoinReward } = await import("../src/application/rewards/coin-reward.ts");

  const state = {
    characterDefinitions: [
      { id: "char.player", stats: { gold: 10, fame: 0 } },
      { id: "char.other", stats: { gold: 99, fame: 0 } },
    ],
  };

  const nextState = applyCoinReward(state, "char.player", 10);

  assert.equal(nextState.characterDefinitions[0].stats.gold, 20);
  assert.equal(nextState.characterDefinitions[1].stats.gold, 99);
  assert.notEqual(nextState, state);
});
