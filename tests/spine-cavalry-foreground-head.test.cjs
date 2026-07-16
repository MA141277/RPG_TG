const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function loadSource() {
  return fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");
}

test("cavalry body split keeps the whole horse body and only extracts a foreground neck-head copy", () => {
  const source = loadSource();
  assert.match(source, /return \{\s*body: component,\s*neckHead: buildComponent\(neckHeadPixels\),\s*\};/);
});

test("cavalry generation shares hidden contour anchors between whole horse body and foreground head copy", () => {
  const source = loadSource();
  assert.match(source, /const horseHeadContourBones = \[/);
  assert.match(source, /const sharedHorseHeadSkinBoneIds = \[/);
  assert.match(source, /const horseBodyPiece = addPiece\("马身", "cavalry-horse-piece", horseBodyImageId, horseBodyComponent, 30, sharedHorseHeadSkinBoneIds\);/);
  assert.match(source, /const horseNeckHeadPiece = addPiece\(\s*"马脖子到马头",\s*"cavalry-horse-neck-piece",[\s\S]*?85,[\s\S]*?sharedHorseHeadSkinBoneIds,/);
});

test("cavalry horse full-skin mesh uses explicit low mesh density controls", () => {
  const source = loadSource();
  assert.match(source, /horseBodyPiece\.attachment\.meshCols = 6;/);
  assert.match(source, /horseBodyPiece\.attachment\.meshRows = 18;/);
  assert.match(source, /horseNeckHeadPiece\.attachment\.meshCols = 5;/);
  assert.match(source, /horseNeckHeadPiece\.attachment\.meshRows = 14;/);
  assert.match(source, /const cols = Math\.max\(3, Math\.round\(Number\(attachment\.meshCols\)/);
  assert.match(source, /const rows = Math\.max\(6, Math\.round\(Number\(attachment\.meshRows\)/);
});
