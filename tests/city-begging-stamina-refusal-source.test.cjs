const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("city begging stamina refusal is player self-talk to return to temple rest", () => {
  const textEntriesById = JSON.parse(
    fs.readFileSync(
      path.join(
        process.cwd(),
        "src/content/scenario-packs/zhuyuanzhang/text-entries.json"
      ),
      "utf8"
    )
  );
  const source = fs.readFileSync(path.join(process.cwd(), "src/main.ts"), "utf8");
  const openBeggingMiniGameBlock =
    source.match(
      /function openBeggingMiniGame\(\): void \{[\s\S]*?\r?\n}\r?\n\r?\nfunction createHouseRuntimeInstance/
    )?.[0] ?? "";
  const lowStaminaBlock =
    openBeggingMiniGameBlock.match(
      /if \(!canAffordActivityCost\(playerCharacter\)\) \{[\s\S]*?renderApp\(\);\s*return;\s*\}/
    )?.[0] ?? "";

  assert.equal(
    textEntriesById["runtime.zhu_yuanzhang.begging_stamina_refusal.001"],
    "回寺庙休息吧。"
  );
  assert.match(lowStaminaBlock, /speakerCharacterId:\s*currentPlayerCharacterId/);
  assert.match(
    lowStaminaBlock,
    /runtime\.zhu_yuanzhang\.begging_stamina_refusal\.001/
  );
  assert.doesNotMatch(lowStaminaBlock, /char\.kulan_temple_abbot/);
  assert.doesNotMatch(
    lowStaminaBlock,
    /runtime\.zhu_yuanzhang\.begging_stamina_refusal\.002/
  );
});
