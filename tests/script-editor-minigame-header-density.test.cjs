const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("script editor minigame panel header uses compact density rules", () => {
  const cssSource = fs.readFileSync(
    path.join(process.cwd(), "src", "styles", "script-editor.css"),
    "utf8"
  );

  assert.match(
    cssSource,
    /\.c-script-editor-minigame-panel,\s*\.c-script-editor-minigame-list,\s*\.c-script-editor-minigame-list__route\s*\{[\s\S]*?align-content:\s*start;/,
    "Expected minigame panel grids to keep content packed at the top."
  );
  assert.match(
    cssSource,
    /\.c-script-editor-minigame-panel > \.c-script-editor-narrative-panel__header\s*\{[\s\S]*?gap:\s*8px;/,
    "Expected minigame panel headers to use a tighter gap."
  );
  assert.match(
    cssSource,
    /\.c-script-editor-minigame-panel > \.c-script-editor-narrative-panel__header \.c-script-editor-editor-card__eyebrow\s*\{[\s\S]*?margin:\s*0 0 2px;/,
    "Expected minigame panel eyebrows to use a reduced bottom margin."
  );
});
