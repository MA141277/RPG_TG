const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readSource(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("main ui flow delegates script editor session ownership to kernel script-editor-session", () => {
  const source = readSource("src/ui/main-ui/main-ui-flow.js");

  assert.match(source, /createEmbeddedScriptEditorSession/);
  assert.doesNotMatch(source, /createScriptEditorWorkflowController/);
  assert.doesNotMatch(source, /installMainUiFlowScriptEditorModule/);
});

test("script editor entry helpers use kernel script-editor-session", () => {
  const mountSource = readSource("src/modules/script-editor/entries/mount-script-editor.ts");
  const openSource = readSource("src/modules/script-editor/entries/open-script-editor.ts");

  assert.match(mountSource, /kernel\/script-editor-session/);
  assert.match(openSource, /kernel\/script-editor-session/);
});

test("kernel script-editor-session exists", () => {
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/modules/script-editor/kernel/script-editor-session.ts"
      )
    ),
    true
  );
});

test("main ui flow no longer owns direct script editor click routing", () => {
  const mainUiFlowSource = readSource("src/ui/main-ui/main-ui-flow.js");
  const sessionSource = readSource(
    "src/modules/script-editor/kernel/script-editor-session.ts"
  );

  assert.doesNotMatch(mainUiFlowSource, /scriptEditorActionElement/);
  assert.doesNotMatch(mainUiFlowSource, /scriptEditorFamilyElement/);
  assert.doesNotMatch(mainUiFlowSource, /scriptEditorRecordElement/);
  assert.match(sessionSource, /data-script-editor-action/);
  assert.match(sessionSource, /data-script-editor-family/);
  assert.match(sessionSource, /data-script-editor-record-id/);
});
