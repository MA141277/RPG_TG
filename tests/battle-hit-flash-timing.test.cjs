const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

test("battle melee hit flash timing still follows the action effect frame fallback", () => {
  assert.match(source, /const attackWhiteFlashStartFrame = infantryAttackPlan\?\.effectFrame \?\? Math\.max\(0, attackPeakFrame - 1\);/);
  assert.match(source, /effectFrame:\s*step\.hit \? attackWhiteFlashStartFrame : null,/);
});
