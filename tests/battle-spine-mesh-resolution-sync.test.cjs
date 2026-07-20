const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const battleSource = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
const editorSource = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");

test("battle renderer preserves authored attachment mesh resolution instead of capping it below the editor settings", () => {
  assert.match(
    editorSource,
    /const cols = Math\.max\(3, Math\.round\(Number\(attachment\.meshCols\) \|\| \(restPart\.partId === "torso" \? 5 : 4\)\)\);/,
  );
  assert.match(
    editorSource,
    /const rows = Math\.max\(6, Math\.round\(Number\(attachment\.meshRows\) \|\| segments\.length \* 5\)\);/,
  );
  assert.match(
    battleSource,
    /const cols = authoredMeshCols > 0\s*\? Math\.max\(3, authoredMeshCols\)\s*: defaultCols;/,
  );
  assert.match(
    battleSource,
    /const rows = authoredMeshRows > 0\s*\? Math\.max\(6, authoredMeshRows\)\s*: defaultRows;/,
  );
  assert.doesNotMatch(
    battleSource,
    /Math\.min\(defaultCols,\s*authoredMeshCols\)|Math\.min\(defaultRows,\s*authoredMeshRows\)/,
  );
});
