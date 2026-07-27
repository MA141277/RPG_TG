const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("overlay presenter allows the shared global HUD in house view", () => {
  const source = readSource("src/application/presenter/overlay-presenters.ts");

  assert.doesNotMatch(
    source,
    /currentView\s*!==\s*"house"/,
    "house view must not be excluded from the shared global HUD"
  );
  assert.match(source, /currentView\s*!==\s*"battle"/);
});

test("app renderer keeps house HUD rendering in the shared overlay layer", () => {
  const source = readSource("src/ui/app-render.ts");

  assert.match(source, /shouldShowGlobalHud[\s\S]*renderGlobalPlayerPanel/);
  assert.doesNotMatch(
    source,
    /currentView\s*===\s*"house"[\s\S]{0,160}renderGlobalPlayerPanel/,
    "house HUD rendering must not be a house-specific app-render branch"
  );
});

test("main entry has no house-specific global HUD branch", () => {
  const source = readSource("src/main.ts");

  assert.doesNotMatch(
    source,
    /currentView\s*===\s*"house"[\s\S]{0,200}(globalHud|GlobalHud|main-ui|mainUi|playerPanel|PlayerPanel)/
  );
});
