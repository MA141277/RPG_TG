const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { test } = require("node:test");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), "utf8"));
}

test("default script editor template url resolves to packaged static files", () => {
  const projectRoot = process.cwd();
  const configSource = fs.readFileSync(
    path.join(projectRoot, "src", "modules", "script-editor", "config.ts"),
    "utf8"
  );
  const urlMatch = configSource.match(
    /DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL\s*=\s*\r?\n\s*"([^"]+)"/
  );

  assert.ok(urlMatch, "default template URL should be declared as a string literal");
  assert.equal(
    urlMatch[1],
    "/script-editor-templates/zhuyuanzhang/pack.json",
    "default template URL should remain a public static template URL"
  );

  const templateRoot = path.join(projectRoot, "public", "script-editor-templates", "zhuyuanzhang");
  const manifestPath = path.join(templateRoot, "pack.json");
  assert.equal(fs.existsSync(manifestPath), true, "public template manifest should exist");

  const manifest = readJson("public/script-editor-templates/zhuyuanzhang/pack.json");
  for (const [key, relativePath] of Object.entries(manifest.files)) {
    assert.equal(
      fs.existsSync(path.join(templateRoot, relativePath)),
      true,
      `public template file for ${key} should exist`
    );
  }
});

test("script editor default template import no longer depends on the public template url", () => {
  const controllerSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "modules",
      "script-editor",
      "kernel",
      "script-editor-workflow-controller.ts"
    ),
    "utf8"
  );
  const builtinLoaderSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src",
      "modules",
      "script-editor",
      "application",
      "default-template-project-loader.ts"
    ),
    "utf8"
  );

  assert.match(
    controllerSource,
    /loadDefaultScriptEditorTemplateProject/
  );
  assert.doesNotMatch(
    controllerSource,
    /loadScriptEditorProjectFromScenarioPackUrl\(\s*DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL/
  );
  assert.match(
    builtinLoaderSource,
    /loadScriptEditorProjectFromScenarioPackFiles/
  );
  assert.match(
    builtinLoaderSource,
    /packManifestJson/
  );
  assert.match(
    builtinLoaderSource,
    /assets\/maps\/HD\.png\?url/
  );
});

test("default script editor template map asset references resolve to packaged files", () => {
  const templateRoot = path.join(
    process.cwd(),
    "public",
    "script-editor-templates",
    "zhuyuanzhang"
  );
  const maps = readJson("public/script-editor-templates/zhuyuanzhang/maps.json");

  for (const mapDefinition of maps) {
    for (const imageUrl of [
      mapDefinition.primaryImageUrl,
      mapDefinition.regionOverlayImageUrl,
      ...(mapDefinition.layers ?? []).map((layer) => layer.imageUrl),
    ]) {
      if (typeof imageUrl !== "string" || imageUrl.length === 0 || /^(https?:|data:|\/)/.test(imageUrl)) {
        continue;
      }

      assert.equal(
        fs.existsSync(path.join(templateRoot, imageUrl)),
        true,
        `public template map asset should exist: ${imageUrl}`
      );
    }
  }
});
