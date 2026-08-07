const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function readSource(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("script editor host contract uses injected previewHost templateCatalog and publicationCatalog fields", () => {
  const source = readSource("src/modules/script-editor/host/script-editor-host.ts");

  assert.match(source, /previewHost\?: ScriptEditorPreviewHost/);
  assert.match(source, /templateCatalog\?: ScriptEditorTemplateCatalog/);
  assert.match(source, /publicationCatalog\?: ScriptEditorPublicationCatalog/);
  assert.doesNotMatch(source, /previewRuntime/);
});

test("runtime person attribute support imports the neutral contract instead of modules script editor", () => {
  const source = readSource("src/application/character/person-attribute-runtime.ts");

  assert.match(source, /core\/contracts\/script-editor-person-attributes/);
  assert.doesNotMatch(source, /modules\/script-editor/);
});

test("neutral script editor person attribute contract file exists under core contracts", () => {
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src/core/contracts/script-editor-person-attributes.ts"
      )
    ),
    true
  );
});
