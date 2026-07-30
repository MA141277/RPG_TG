const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("main auto advance playback preserves snapshot status panels without temple dependencies", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.match(source, /statusPanel/);
  assert.match(source, /autoAdvanceState:\s*\{[\s\S]*statusPanel/);
  assert.match(source, /nextSnapshot\.statusPanel/);
  assert.doesNotMatch(source, /createTempleReviewRestAutoAdvanceStatus/);
  assert.doesNotMatch(source, /application\/house-modules\/temple-house/);
  assert.doesNotMatch(source, /当前：寺中静修/);
  assert.doesNotMatch(source, /贡献：/);
  assert.doesNotMatch(source, /周次：第/);
});
