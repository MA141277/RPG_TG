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
    "src/ui/entry-shell/entry-shell-view.js",
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

test("main menu presents the script editor entry as the editor hub", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src", "ui", "entry-shell", "entry-shell-view.js"),
    "utf8"
  );

  assert.match(source, /data-main-ui-action="open-script-editor"/);
  assert.match(source, /编辑器工作台/);
});

test("script editor landing is a development hub with the expected editor entries", () => {
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

  const expectedToolIds = [
    "script-editor",
    "point-assembly-event-editor",
    "city-map-building-editor",
    "yuanmo-hex-editor",
    "troop-editor",
    "troop-management",
    "party-editor",
    "spine-node-timeline-editor",
    "spine-node-timeline-editor-archer",
    "faxian-piece-spine-editor",
    "tilemap-editor",
    "obj-mesh-decimator",
    "pixel-workflow",
    "live-layout-editor",
  ];

  assert.match(source, /renderScriptEditorDevelopmentHub/);
  assert.match(source, /open-script-editor-projects/);
  assert.match(source, /back-to-dev-hub/);
  assert.match(source, /data-script-editor-tool-url=/);

  for (const id of expectedToolIds) {
    assert.match(source, new RegExp(`id:\\s*"${id}"`), `${id} should be listed`);
  }
});
