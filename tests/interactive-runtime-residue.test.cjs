const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("interactive runtime residue no longer carries city-begging compatibility helpers", () => {
  const playableRuntimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/playable-runtime.ts"),
    "utf8"
  );
  const interactiveRuntimeSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );

  assert.doesNotMatch(playableRuntimeSource, /\|\s*"city-begging"/);
  assert.doesNotMatch(playableRuntimeSource, /input\.playableId === "city-begging"/);
  assert.doesNotMatch(playableRuntimeSource, /playable\.city-begging\.external\.default/);
  assert.match(interactiveRuntimeSource, /story-battle/);
  assert.doesNotMatch(interactiveRuntimeSource, /city-begging/);
});
