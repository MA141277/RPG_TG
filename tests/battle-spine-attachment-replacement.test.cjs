const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function loadBattleAttachmentFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  return { source };
}

test("battle Spine renderer resolves replacement attachment images from the current action timeline", () => {
  const { source } = loadBattleAttachmentFns();
  assert.match(source, /attachmentImageKeys\(node,\s*action\)\s*\{/);
  assert.match(source, /getSortedTimelineKeys\(action,\s*node\?\.id\)\.filter\(/);
  assert.match(source, /const variants = this\.attachmentImageVariants\(attachment\);/);
  assert.match(source, /const keys = this\.attachmentImageKeys\(node,\s*action\)\s*\n\s*\.filter\(\(item\) => item\.frame <= frame\)/);
  assert.match(source, /const replacement = keys\.length \? String\(keys\[keys\.length - 1\]\.attachmentImage \|\| ''\) : '';/);
  assert.match(source, /const imageKey = replacement && \(!variants\.length \|\| variants\.includes\(replacement\)\) \? replacement : defaultImage;/);
});

test("battle Spine renderer draws attachments from the resolved replacement image and re-anchors slash effects with frame-aware images", () => {
  const { source } = loadBattleAttachmentFns();
  assert.match(source, /const imageKey = this\.getAttachmentImageForFrame\(node,\s*action,\s*frame\);/);
  assert.match(source, /const image = imageMap\[imageKey\] \|\| imageMap\[attachment\.image\];/);
  assert.match(source, /slashFxGripLocalForPiece\(piece,\s*action = null,\s*frame = 0\)/);
  assert.match(source, /const imageKey = this\.getAttachmentImageForFrame\(piece,\s*action,\s*frame\);/);
  assert.match(source, /this\.slashFxGripLocalForPiece\(this\.slashFxPieceForNode\(node\),\s*action,\s*frame\)/);
});
