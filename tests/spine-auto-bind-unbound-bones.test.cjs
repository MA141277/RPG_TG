const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("editor exposes an auto-bind button for unbound bones in binding mode", () => {
  const source = loadSource();
  assert.match(source, /id="autoBindUnboundBonesBtn"/);
  assert.match(source, /autoBindUnboundBonesBtn:\s*document\.getElementById\("autoBindUnboundBonesBtn"\)/);
  assert.match(source, /el\.autoBindUnboundBonesBtn\.addEventListener\("click", autoBindUnboundBonesToSelectedPiece\)/);
});

test("auto-bind only pulls globally unbound bones that intersect the selected piece bind area", () => {
  const source = loadSource();
  assert.match(source, /function boundSkinBoneIdsExcludingPiece\(pieceId = null\) \{/);
  assert.match(source, /function pieceContainsBoneBindPose\(piece, node\) \{/);
  assert.match(source, /const boundElsewhereIds = boundSkinBoneIdsExcludingPiece\(piece\.id\);/);
  assert.match(source, /\.filter\(\(node\) => !currentIds\.has\(node\.id\) && !boundElsewhereIds\.has\(node\.id\)\)/);
  assert.match(source, /\.filter\(\(node\) => pieceContainsBoneBindPose\(piece, node\)\)/);
  assert.match(source, /toast\(`已自动绑定 \$\{candidateIds\.length\} 根未绑骨骼。`\);/);
});
