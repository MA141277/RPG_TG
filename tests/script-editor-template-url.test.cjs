const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { test } = require("node:test");

test("default script editor template url resolves to the registered builtin template publication", () => {
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
    "/builtin-script-editor-templates/zhuyuanzhang/pack.json",
    "default template URL should resolve to the registered builtin template publication"
  );
});

test("default script editor template url imports through the registered builtin template publication without fetching a public manifest", async () => {
  const configSource = fs.readFileSync(
    path.join(process.cwd(), "src", "modules", "script-editor", "config.ts"),
    "utf8"
  );
  const urlMatch = configSource.match(
    /DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL\s*=\s*\r?\n\s*"([^"]+)"/
  );
  assert.ok(urlMatch, "default template URL should be declared as a string literal");

  const {
    loadScriptEditorProjectFromScenarioPackUrl,
  } = require("../.test-dist/modules/script-editor/application/runtime-pack-import.js");
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input?.url;
    throw new Error(`unexpected fetch for registered builtin template publication: ${url}`);
  };

  try {
    const project = await loadScriptEditorProjectFromScenarioPackUrl(urlMatch[1]);
    assert.equal(project.id, "scenario-pack.zhu_yuanzhang.monk_opening");
    assert.equal(project.flows.length > 0, true);
    assert.equal(project.maps.length > 0, true);
  } finally {
    global.fetch = originalFetch;
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

test("default script editor template import stages map-referenced builtin assets for local folder import", () => {
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
  const createRelativePathsBlock =
    builtinLoaderSource.match(
      /function createBuiltinTemplateManifestRelativePaths\(\): string\[\] \{[\s\S]*?\n}\n/
    )?.[0] ?? "";
  const collectMapAssetsBlock =
    builtinLoaderSource.match(
      /function collectBuiltinTemplateMapAssetRelativePaths\(\): string\[\] \{[\s\S]*?\n}\n/
    )?.[0] ?? "";

  assert.match(createRelativePathsBlock, /collectBuiltinTemplateMapAssetRelativePaths/);
  assert.match(collectMapAssetsBlock, /mapsJson/);
  assert.match(collectMapAssetsBlock, /primaryImageUrl|regionOverlayImageUrl|imageUrl/);
  assert.match(collectMapAssetsBlock, /assetPath\.replace\(\/\^\\\.\\\//);
});

test("production script editor module no longer imports the default template public url constant", () => {
  const mainUiModuleSource = fs.readFileSync(
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

  assert.doesNotMatch(
    mainUiModuleSource,
    /DEFAULT_SCRIPT_EDITOR_TEMPLATE_SCENARIO_PACK_URL/
  );
});

test("registered builtin template publication resolves map asset references to browser-loadable absolute urls", async () => {
  const { loadScenarioPackFromUrl } = require("../.test-dist/application/scenario/scenario-pack-loader.js");
  const registeredAssetRoot = path.join(
    process.cwd(),
    "public",
    "builtin-script-editor-templates",
    "zhuyuanzhang"
  );
  const originalFetch = global.fetch;

  global.fetch = async (input) => {
    const url = typeof input === "string" ? input : input?.url;
    throw new Error(`unexpected fetch while loading registered builtin template pack: ${url}`);
  };

  let maps;
  try {
    const pack = await loadScenarioPackFromUrl(
      "/builtin-script-editor-templates/zhuyuanzhang/pack.json"
    );
    maps = pack.maps;
  } finally {
    global.fetch = originalFetch;
  }

  for (const mapDefinition of maps) {
    for (const imageUrl of [
      mapDefinition.primaryImageUrl,
      mapDefinition.regionOverlayImageUrl,
      ...(mapDefinition.layers ?? []).map((layer) => layer.imageUrl),
    ]) {
      if (imageUrl == null) {
        continue;
      }
      assert.equal(typeof imageUrl, "string");
      assert.notEqual(imageUrl.length, 0);
      assert.match(
        imageUrl,
        /^\/builtin-script-editor-templates\/zhuyuanzhang\/assets\/maps\//
      );
      assert.equal(
        fs.existsSync(
          path.join(
            registeredAssetRoot,
            imageUrl.replace(/^\/builtin-script-editor-templates\/zhuyuanzhang\//, "")
          )
        ),
        true,
        `registered builtin template asset should exist: ${imageUrl}`
      );
    }
  }
});
