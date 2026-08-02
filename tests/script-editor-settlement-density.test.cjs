const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("script editor settlement editor exposes compact panel hooks", () => {
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
  const cssSource = fs.readFileSync(
    path.join(process.cwd(), "src", "styles", "script-editor.css"),
    "utf8"
  );

  assert.match(
    source,
    /<section class="c-script-editor-narrative-panel c-script-editor-settlement-panel" aria-label="结算编辑面板">/,
    "Expected the settlement editor panel to expose a compact layout hook."
  );
  assert.match(
    source,
    /<section class="c-script-editor-minigame-list c-script-editor-settlement-content-list">/,
    "Expected the settlement content list to expose a compact layout hook."
  );
  assert.match(
    source,
    /<article class="c-script-editor-minigame-list__route c-script-editor-settlement-content-card">/,
    "Expected settlement content cards to expose a compact layout hook."
  );
  assert.match(
    source,
    /class="c-script-editor-person-summary__remove c-script-editor-settlement-content-card__remove"/,
    "Expected settlement content cards to use the shared red remove button treatment."
  );
  assert.match(
    cssSource,
    /\.c-script-editor-settlement-panel\s*\{[\s\S]*?gap:\s*12px;[\s\S]*?align-content:\s*start;/,
    "Expected the settlement panel to use a tighter vertical gap."
  );
  assert.match(
    cssSource,
    /\.c-script-editor-settlement-panel > \.c-script-editor-form-grid\s*\{[\s\S]*?gap:\s*10px 12px;/,
    "Expected the settlement top form grid to use tighter field spacing."
  );
  assert.match(
    cssSource,
    /\.c-script-editor-settlement-content-list\s*\{[\s\S]*?gap:\s*10px;[\s\S]*?align-content:\s*start;/,
    "Expected the settlement content list to stay packed at the top."
  );
  assert.match(
    cssSource,
    /\.c-script-editor-settlement-content-card\s*\{[\s\S]*?position:\s*relative;[\s\S]*?padding:\s*16px 12px 12px;/,
    "Expected settlement content cards to reserve space for a top-right remove button."
  );
  assert.match(
    cssSource,
    /\.c-script-editor-settlement-content-card \.c-script-editor-form-field__input\s*\{[\s\S]*?min-height:\s*40px;/,
    "Expected settlement content cards to reduce input height."
  );
});
