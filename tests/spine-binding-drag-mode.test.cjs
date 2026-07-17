const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("binding mode exposes dedicated piece, bone, and stretch drag mode buttons", () => {
  const source = loadSource();
  assert.match(source, /id="bindingNodeModeBtn"/);
  assert.match(source, /id="bindingPieceModeBtn"/);
  assert.match(source, /id="bindingBoneModeBtn"/);
  assert.match(source, /id="bindingStretchModeBtn"/);
  assert.match(source, /bindingDragMode:\s*"node"/);
});

test("binding hit testing gates pieces and bones by the dedicated binding drag mode", () => {
  const source = loadSource();
  assert.match(source, /const bindingNodeMode = bindingMode && state\.bindingDragMode === "node";/);
  assert.match(source, /const bindingPieceMode = bindingMode && state\.bindingDragMode === "piece";/);
  assert.match(source, /const bindingBoneMode = bindingMode && state\.bindingDragMode === "bone";/);
  assert.match(source, /const bindingStretchMode = bindingMode && state\.bindingDragMode === "stretch";/);
  assert.match(source, /const allowJointHits = !bindingMode \|\| bindingNodeMode;/);
  assert.match(source, /const allowBoneHits = !bindingMode \|\| bindingBoneMode;/);
  assert.match(source, /if \(bindingPieceMode\) \{/);
  assert.match(source, /if \(allowJointHits && distance\(point, end\) <= effectiveJointRadius\) \{/);
  assert.match(source, /if \(allowJointHits && distance\(point, \{ x: pose\.worldX, y: pose\.worldY \}\) <= effectiveJointRadius\) \{/);
  assert.match(source, /if \(allowBoneHits && pointSegmentDistance\(point, \{ x: pose\.worldX, y: pose\.worldY \}, end\) <= boneRadius\) \{/);
  assert.match(source, /if \(bindingMode && !bindingBoneMode\) return null;/);
  assert.match(source, /bindingNodeModeBtn\.addEventListener\("click", \(\) => \{[\s\S]*state\.bindingDragMode = "node";/);
});
