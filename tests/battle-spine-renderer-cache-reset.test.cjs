const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

test("formation battle overlay clears cached Spine renderers so updated troop project.json files reload on next battle", () => {
  assert.match(source, /function clearBattleSpineRendererCache\(cacheKey = null\) \{/);
  assert.match(source, /function showFormationBattleOverlay\(report\) \{[\s\S]*?clearBattleSpineRendererCache\(\);/);
  assert.match(source, /function closeFormationBattleOverlay\(\) \{[\s\S]*?clearBattleSpineRendererCache\(\);/);
});
