const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("special contour anchors have a dedicated visibility toggle button and default to hidden", () => {
  const source = loadSource();
  assert.match(source, /id="specialAnchorToggleBtn"/);
  assert.match(source, /showSpecialAnchorBones:\s*false,/);
  assert.match(source, /function isSpecialAnchorNode\(node\) \{/);
  assert.match(source, /return node\?\.role === "cavalry-horse-head-anchor";/);
});

test("special contour anchors are removed from canvas draw and hit-test when hidden", () => {
  const source = loadSource();
  assert.match(source, /function isCanvasVisibleNode\(node, frame = state\.currentFrame\) \{/);
  assert.match(source, /if \(isSpecialAnchorNode\(node\) && !state\.showSpecialAnchorBones\) return false;/);
  assert.match(source, /if \(!isCanvasVisibleNode\(node\)\) return;/);
  assert.match(source, /if \(!parent \|\| !isCanvasVisibleNode\(node\) \|\| !isCanvasVisibleNode\(parent\)\) return;/);
  assert.match(source, /if \(!isCanvasVisibleNode\(node\)\) continue;/);
});
