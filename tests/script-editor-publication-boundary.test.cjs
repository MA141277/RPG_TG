const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readSource(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("runtime publication registration no longer imports built-in template files from modules/script-editor", () => {
  const source = readSource(
    "src/application/scenario/registered-scenario-pack-publications.ts"
  );

  assert.doesNotMatch(source, /modules\/script-editor\/builtin-templates/);
  assert.match(source, /script-editor-publication-catalog/);
});

test("workflow controller loads default template project through injected template catalog", () => {
  const source = readSource(
    "src/modules/script-editor/kernel/script-editor-workflow-controller.ts"
  );

  assert.match(source, /getTemplateCatalog\(\)/);
  assert.doesNotMatch(source, /loadDefaultScriptEditorTemplateProject/);
});

test("script editor template catalog exposes a default template loader contract", () => {
  const source = readSource(
    "src/modules/script-editor/host/script-editor-template-catalog.ts"
  );

  assert.match(source, /loadDefaultProject\(\): Promise<ScriptEditorProjectDefinition>/);
});
