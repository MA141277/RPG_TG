const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("menu authoring no longer offers dialogue as a new target family on the main path", () => {
  const uiSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/ui/main-ui-script-editor-module.js"
    ),
    "utf8"
  );
  const authoringSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/modules/script-editor/application/menu-authoring.ts"
    ),
    "utf8"
  );

  const optionBlock =
    uiSource.match(
      /getScriptEditorLocationMenuTargetFamilyOptions\(selectedValue = ""\) \{[\s\S]*?\n  }\n\n  getScriptEditorLocationMenuOptionsWithFallback/
    )?.[0] ?? "";

  assert.doesNotMatch(optionBlock, /\{ value: "dialogue", label: "对话" \}/);
  assert.match(optionBlock, /\{ value: "event", label: "事件" \}/);
  assert.match(authoringSource, /if \(entry\.targetFamily === "dialogue" && targetId\.length > 0\)/);
});
