const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");

test("Spine editor defines a unit registry for swordsman and archer", () => {
  assert.match(source, /const SPINE_UNIT_CONFIGS = \{/);
  assert.match(
    source,
    /swordsman:\s*\{[\s\S]*projectUrl:\s*"\/src\/faxian\/leg\/swordsman\/project\.json"/,
  );
  assert.match(
    source,
    /archer:\s*\{[\s\S]*projectUrl:\s*"\/src\/faxian\/leg\/archer\/project\.json"/,
  );
});

test("Spine editor switches unit context only after a project load succeeds", () => {
  assert.match(source, /async function switchSpineUnitContext\(unitType\)/);
  assert.match(source, /const project = await loadProjectJsonFile\(config\.projectUrl\)/);
  assert.match(source, /if \(!project\) \{[\s\S]*return false;[\s\S]*\}/);
  assert.match(source, /state\.currentUnitType = unitType;/);
});

test("Spine editor exposes top-level swordsman and archer unit buttons", () => {
  assert.match(source, /id="unitContextToolbar"/);
  assert.match(source, /id="unitSwordsmanBtn"/);
  assert.match(source, /id="unitArcherBtn"/);
  assert.match(source, /currentUnitType:\s*"swordsman"/);
});

test("Spine editor binds the unit buttons to switchSpineUnitContext", () => {
  assert.match(
    source,
    /el\.unitSwordsmanBtn\.addEventListener\("click", \(\) => switchSpineUnitContext\("swordsman"\)\)/,
  );
  assert.match(
    source,
    /el\.unitArcherBtn\.addEventListener\("click", \(\) => switchSpineUnitContext\("archer"\)\)/,
  );
});

test("Spine editor gates swordsman and archer feature groups by unit context", () => {
  assert.match(source, /id="swordsmanFeatureGroup"/);
  assert.match(source, /id="archerFeatureGroup"/);
  assert.match(source, /function renderSpineUnitFeatureGroups\(\)/);
});
