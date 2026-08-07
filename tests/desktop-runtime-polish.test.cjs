const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

test("base styles prevent accidental game text selection while keeping edit fields selectable", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "styles", "base.css"),
    "utf8"
  );

  assert.match(source, /html,\s*\r?\nbody\s*\{[\s\S]*user-select:\s*none/);
  assert.match(source, /#app\s*\{[\s\S]*user-select:\s*none/);
  assert.match(source, /input,\s*\r?\ntextarea,\s*\r?\nselect,\s*\r?\n\[contenteditable="true"\]\s*\{[\s\S]*user-select:\s*text/);
});

test("city runtime view uses a static default background when city data has no background id", () => {
  const cityViewSource = fs.readFileSync(
    path.join(repoRoot, "src", "ui", "views", "city", "city-view.ts"),
    "utf8"
  );
  const backgroundSource = fs.readFileSync(
    path.join(repoRoot, "src", "ui", "location-backgrounds.ts"),
    "utf8"
  );

  assert.match(backgroundSource, /DEFAULT_CITY_BACKGROUND_ID\s*=\s*"chengzhen"/);
  assert.match(backgroundSource, /function resolveCityBackgroundImageUrl/);
  assert.match(cityViewSource, /resolveCityBackgroundImageUrl/);
  assert.match(cityViewSource, /class="c-kulan-city__background-image"/);
  assert.doesNotMatch(cityViewSource, /c-kulan-city__background-video/);
  assert.doesNotMatch(cityViewSource, /city\.mp4\?url/);
});
