const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("troop editor overview uses three desktop columns and a real scroll container", () => {
  const styleSource = fs.readFileSync("src/styles/views.css", "utf8");

  assert.match(
    styleSource,
    /\.view-troop-editor\s+\.c-troop-editor__troops-panel-body\s*\{[\s\S]*display:\s*grid;/
  );
  assert.match(
    styleSource,
    /\.view-troop-editor\s+\.c-troop-editor__troop-scroll\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);[\s\S]*height:\s*100%;[\s\S]*overflow-y:\s*auto;/
  );
  assert.match(
    styleSource,
    /@media \(width <= 900px\)\s*\{[\s\S]*\.view-troop-editor\s+\.c-troop-editor__troop-scroll\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/
  );
  assert.match(
    styleSource,
    /@media \(width <= 640px\)\s*\{[\s\S]*\.view-troop-editor\s+\.c-troop-editor__troop-scroll\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\);/
  );
});

test("troop editor troop list declares a preserved scroll key", () => {
  const viewSource = fs.readFileSync(
    "src/ui/views/troop-editor/troop-editor-view.ts",
    "utf8"
  );

  assert.match(
    viewSource,
    /data-preserve-scroll-key="troop-editor\.troop-list"/
  );
});
