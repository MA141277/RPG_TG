const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("binding node mode preserves full-skin world position across drag commit", () => {
  const source = loadSource();
  assert.match(source, /function captureFullSkinWorldSnapshots\(\)\s*\{/);
  assert.match(source, /function restoreFullSkinWorldSnapshots\(snapshots\)\s*\{/);
  assert.match(
    source,
    /const preserveFullSkinWorld =\s*isBindingMode\(\) && state\.bindingDragMode === "node" \? captureFullSkinWorldSnapshots\(\) : null;/,
  );
  assert.match(source, /if \(preserveFullSkinWorld\) restoreFullSkinWorldSnapshots\(preserveFullSkinWorld\);/);
});
