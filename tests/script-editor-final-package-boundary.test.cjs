const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readSource(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("script editor index exposes final package surfaces and not bridge/install internals", () => {
  const source = readSource("src/modules/script-editor/index.ts");

  assert.match(source, /entries\/mount-script-editor/);
  assert.match(source, /entries\/open-script-editor/);
  assert.doesNotMatch(source, /installMainUiFlowScriptEditorModule/);
  assert.doesNotMatch(source, /scriptEditorMainUiBridge/);
});

test("current project shell no longer depends on script editor bridge or install surface", () => {
  const source = readSource("src/ui/main-ui/main-ui-flow.js");

  assert.doesNotMatch(source, /installMainUiFlowScriptEditorModule/);
  assert.doesNotMatch(source, /captureScriptEditorScrollPosition/);
  assert.doesNotMatch(source, /renderScriptEditorWorkspace/);
});

test("main-ui bridge is removed or no longer referenced by package public surfaces", () => {
  const indexSource = readSource("src/modules/script-editor/index.ts");
  assert.doesNotMatch(indexSource, /main-ui-bridge/);
});
