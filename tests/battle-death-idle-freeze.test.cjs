const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

test("fallen battle units freeze on idle frame zero after the first render instead of reanimating", () => {
  assert.match(source, /entry\.canvas\.dataset\.freezeIdleFrame = nextState\.isFallen \? 'true' : 'false';/);
  assert.match(source, /entry\.canvas\.__battleFrozenFrameRendered = false;/);
  assert.match(
    source,
    /if \(entry\.canvas\.dataset\.freezeIdleFrame === 'true' && entry\.canvas\.__battleFrozenFrameRendered === true\) \{\s*continue;\s*\}/,
  );
  assert.match(source, /const freezeIdleFrame = entry\.canvas\.dataset\.freezeIdleFrame === 'true';/);
  assert.match(source, /const elapsedMs = freezeIdleFrame \? 0 : now \+ Number\(entry\.canvas\.dataset\.phase \|\| 0\);/);
  assert.match(source, /if \(freezeIdleFrame\) \{\s*entry\.canvas\.__battleFrozenFrameRendered = true;\s*\}/);
});
