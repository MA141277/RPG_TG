const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("layout editor launch button is not rendered into player-facing UI", () => {
  const layoutEditorSource = readSource("src/ui/tools/layout-editor-view.ts");

  assert.doesNotMatch(layoutEditorSource, /data-action="open-layout-editor"/);
  assert.doesNotMatch(layoutEditorSource, /class="c-layout-editor-launch"\s*[\s\S]*open-layout-editor/);
});

test("campaign map hides debug parameter controls while keeping backpack entry", () => {
  const mapViewSource = readSource("src/ui/views/map/map-view.ts");

  assert.doesNotMatch(mapViewSource, /c-campaign-map-debug/);
  assert.doesNotMatch(mapViewSource, /data-map-debug-action/);
  assert.match(mapViewSource, /data-action="open-backpack"/);
});
