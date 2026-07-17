const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("battle renderer keeps the original triangle clip path so unit textures stay sharp", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.doesNotMatch(source, /expandTriangleForSeam/);
  assert.match(source, /ctx\.moveTo\(d0\.x,\s*d0\.y\);/);
  assert.match(source, /ctx\.lineTo\(d1\.x,\s*d1\.y\);/);
  assert.match(source, /ctx\.lineTo\(d2\.x,\s*d2\.y\);/);
});

test("battle renderer no longer emits in-game triangle debug strokes", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  assert.doesNotMatch(source, /__battleTriangleDebugStroke/);
  assert.doesNotMatch(source, /ctx\.strokeStyle = debugTriangleStroke;/);
  assert.doesNotMatch(source, /ctx\.stroke\(\);/);
});

test("spine tool keeps its original triangle clipping path so the helper view behavior stays local to the editor", () => {
  const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
  assert.doesNotMatch(source, /expandTriangleForSeam/);
  assert.doesNotMatch(source, /__battleTriangleDebugStroke/);
});
