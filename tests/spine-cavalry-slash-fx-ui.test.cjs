const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("cavalry is treated as a slash-fx unit", () => {
  const source = loadSource();
  assert.match(
    source,
    /function isSlashFxUnit\(unitType = state\.currentUnitType\) \{\s*return \["swordsman", "spearman", "musketeer", "cavalry"\]\.includes\(unitType\);/s,
  );
});

test("cavalry reuses the swordsman feature group and slash-fx binding controls", () => {
  const source = loadSource();
  assert.match(source, /cavalry:\s*\{[\s\S]*featureGroups:\s*\["swordsman"\],/);
  assert.match(source, /el\.swordsmanFeatureGroup\.hidden = !isSlashFxUnit\(\);/);
  assert.match(source, /el\.createSlashFxRigBtn\.hidden = !isSlashFxUnit\(\);/);
});
