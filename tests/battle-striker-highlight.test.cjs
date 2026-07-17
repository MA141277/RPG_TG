const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");

test("battle attacking striker slots no longer apply the yellow outline glow", () => {
  assert.doesNotMatch(
    source,
    /\.formation-slot\.striker\s*\{\s*filter:\s*drop-shadow\(0 0 18px rgba\(255,\s*225,\s*122,\s*0\.8\)\)\s*drop-shadow\(0 14px 8px rgba\(0,0,0,0\.42\)\);\s*\}/,
  );
});
