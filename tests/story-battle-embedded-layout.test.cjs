const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("story battle embedded host removes stage gutter and fallback background so the battle fills the screen", () => {
  const viewStyleSource = fs.readFileSync("src/styles/views.css", "utf8");
  const battleStyleSource = fs.readFileSync("src/styles/story-battle.css", "utf8");

  assert.match(
    viewStyleSource,
    /\.l-stage:has\(> \.view-story-battle\)\s*\{[\s\S]*padding:\s*0;[\s\S]*background:\s*#000;/
  );
  assert.match(
    battleStyleSource,
    /\.view-story-battle--embedded\s*\{[\s\S]*position:\s*absolute;[\s\S]*inset:\s*0;[\s\S]*background:\s*transparent;/
  );
  assert.match(
    battleStyleSource,
    /\.c-story-battle__demo-frame\s*\{[\s\S]*background:\s*transparent;/
  );
});
