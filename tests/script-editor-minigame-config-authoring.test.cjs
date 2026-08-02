const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("script editor minigame authoring omits retired notes and description fields", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "modules",
      "script-editor",
      "ui",
      "main-ui-script-editor-module.js"
    ),
    "utf8"
  );

  const configPanelSource =
    source.match(
      /if \(this\.scriptEditorMinigameTab === "config"\) \{[\s\S]*?if \(this\.scriptEditorMinigameTab === "settlement"\)/
    )?.[0] ?? "";

  assert.ok(configPanelSource.length > 0, "Expected to find the minigame config panel source.");
  assert.doesNotMatch(
    configPanelSource,
    /<span>说明<\/span>/,
    "Expected the minigame config panel to omit the notes field label."
  );
  assert.doesNotMatch(
    configPanelSource,
    /data-script-editor-minigame-config-field="notes"/,
    "Expected the minigame config panel to omit the notes field input."
  );

  const basicsPanelSource =
    source.match(
      /return `\s*<section class="c-script-editor-minigame-panel" aria-label="玩法基础信息分栏">[\s\S]*?\n    `;\n  }/
    )?.[0] ?? "";

  assert.ok(basicsPanelSource.length > 0, "Expected to find the minigame basics panel source.");
  assert.doesNotMatch(
    basicsPanelSource,
    /玩法说明/,
    "Expected the minigame basics panel to omit the retired description field."
  );
  assert.doesNotMatch(
    basicsPanelSource,
    /data-script-editor-minigame-field="description"/,
    "Expected the minigame basics panel to omit the retired description textarea."
  );

  assert.match(
    configPanelSource,
    /c-script-editor-person-summary__remove c-script-editor-minigame-list__remove/,
    "Expected config cards to use the shared top-right red remove button."
  );
  assert.match(
    source,
    /class="c-script-editor-person-summary__remove c-script-editor-minigame-list__remove"[\s\S]*data-script-editor-action="remove-minigame-settlement-route"/,
    "Expected settlement cards to use the shared top-right red remove button."
  );
});
