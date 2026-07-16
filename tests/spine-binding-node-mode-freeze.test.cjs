const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("binding node mode freezes attachment rendering to bind pose", () => {
  const source = loadSource();
  assert.match(source, /const freezeToBindPose = isBindingMode\(\) && state\.bindingDragMode === "node";/);
  assert.match(source, /const pose = freezeToBindPose \? restWorldPose\(node\) : worldPose\(node\);/);
  assert.match(source, /drawFullSkinAttachment\(attachment, image, alpha, !freezeToBindPose\);/);
  assert.match(source, /drawSegmentedAttachment\(node, attachment, image, alpha, !freezeToBindPose\);/);
  assert.match(source, /end = endPoint\(freezeToBindPose \? restWorldPose\(chainNode\) : worldPose\(chainNode\)\);/);
});
