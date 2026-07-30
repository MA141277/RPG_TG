const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { test } = require("node:test");

test("script editor entry assets remain present in source", () => {
  const projectRoot = process.cwd();
  const expectedPaths = [
    "src/modules/script-editor/index.ts",
    "src/modules/script-editor/entries/open-script-editor.ts",
    "src/modules/script-editor/ui/main-ui-script-editor-module.js",
    "src/styles/script-editor.css",
  ];

  for (const relativePath of expectedPaths) {
    assert.equal(
      fs.existsSync(path.join(projectRoot, relativePath)),
      true,
      `${relativePath} should exist`
    );
  }
});

test("main ui flow still wires the script editor entry", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "main-ui", "main-ui-flow.js"),
    "utf8"
  );

  assert.match(source, /installMainUiFlowScriptEditorModule/);
  assert.match(source, /createScriptEditorWorkflowController/);
  assert.match(source, /open-script-editor/);
});

test("main.ts wires script editor runtime preview callbacks into MainUiFlow", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "main.ts"),
    "utf8"
  );

  assert.match(source, /onStartLoadedScenarioPack:/);
  assert.match(source, /onExitRuntimePreview:/);
});
