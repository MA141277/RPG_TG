const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("script editor minigame inputs commit on input for live authoring persistence", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "main-ui", "main-ui-flow.js"),
    "utf8"
  );
  const onInputSource =
    source.match(/onInput\(event\) \{[\s\S]*?\n  }\n\n  onCompositionEnd\(event\)/)?.[0] ??
    "";

  assert.ok(onInputSource.length > 0, "Expected to find the main UI onInput handler.");
  assert.match(
    onInputSource,
    /target\.matches\("\[data-script-editor-minigame-field\]"\)/,
    "Expected live input handling for minigame basics fields."
  );
  assert.match(
    onInputSource,
    /target\.matches\("\[data-script-editor-minigame-config-field\]"\)/,
    "Expected live input handling for minigame config fields."
  );
  assert.match(
    onInputSource,
    /target\.matches\("\[data-script-editor-minigame-settlement-field\]"\)/,
    "Expected live input handling for minigame settlement fields."
  );
});
