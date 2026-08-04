const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createBeggingStaminaRefusalDialogue,
  createHaozhouShortageBeggingRefusalDialogue,
} = require("../.test-dist/application/runtime/city-begging-refusal-dialogues.js");

test("haozhou shortage begging refusal dialogue centralizes default speaker and text ids", () => {
  assert.deepEqual(
    createHaozhouShortageBeggingRefusalDialogue({
      textEntriesById: {
        "runtime.zhu_yuanzhang.haozhou_shortage.001": "城里已经讨不到米了。",
        "runtime.zhu_yuanzhang.haozhou_shortage.002": "改往北路再试试。",
        "runtime.zhu_yuanzhang.haozhou_shortage.advance_hint": "改去北路",
      },
    }),
    {
      type: "house-access-refusal",
      speakerCharacterId: "char.kulan_temple_abbot",
      textLines: ["城里已经讨不到米了。", "改往北路再试试。"],
      advanceHintText: "改去北路",
    }
  );
});

test("begging stamina refusal dialogue centralizes default speaker and stamina template", () => {
  assert.deepEqual(
    createBeggingStaminaRefusalDialogue({
      textEntriesById: {
        "runtime.zhu_yuanzhang.begging_stamina_refusal.001":
          "先别硬撑着出门。",
        "runtime.zhu_yuanzhang.begging_stamina_refusal.002":
          "体力至少回到 {requiredStamina} 点。",
        "runtime.zhu_yuanzhang.begging_stamina_refusal.advance_hint": "先去休息",
      },
      requiredStamina: 15,
    }),
    {
      type: "house-access-refusal",
      speakerCharacterId: "char.kulan_temple_abbot",
      textLines: ["先别硬撑着出门。", "体力至少回到 15 点。"],
      advanceHintText: "先去休息",
    }
  );
});
