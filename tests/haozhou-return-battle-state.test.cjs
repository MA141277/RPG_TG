const assert = require("node:assert/strict");
const test = require("node:test");

const {
  resolveHaozhouReturnEncounterBattleSeed,
} = require("../.test-dist/application/startup/haozhou-return-battle-state.js");

test("haozhou return encounter battle seed centralizes the post-battle main mission text", () => {
  assert.deepEqual(
    resolveHaozhouReturnEncounterBattleSeed({
      textEntriesById: {
        "runtime.zhu_yuanzhang.main_mission.sundeya_battle_review":
          "返濠州听候盘查",
      },
    }),
    {
      mainMissionText: "返濠州听候盘查",
    }
  );
});
