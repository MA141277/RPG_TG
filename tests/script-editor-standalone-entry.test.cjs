const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("vite exposes a standalone script editor entry", () => {
  const viteConfig = fs.readFileSync(path.join(process.cwd(), "vite.config.ts"), "utf8");

  assert.match(
    viteConfig,
    /scriptEditor:\s*resolve\(__dirname, "prototypes\/script-editor\/index\.html"\)/
  );
});

test("standalone script editor prototype exists", () => {
  assert.equal(
    fs.existsSync(
      path.join(process.cwd(), "prototypes", "script-editor", "index.html")
    ),
    true
  );
});

test("standalone script editor bootstrap exists", () => {
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "standalone",
        "script-editor-standalone.ts"
      )
    ),
    true
  );
});

test("script editor landing view stays package-local instead of importing entry-shell view", () => {
  const moduleSource = fs.readFileSync(
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

  assert.doesNotMatch(moduleSource, /entry-shell\/entry-shell-view/);
  assert.match(moduleSource, /script-editor-landing-view/);
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "ui",
        "views",
        "script-editor-landing-view.ts"
      )
    ),
    true
  );
});

test("script editor background option lists stay package-local instead of importing shared ui location backgrounds", () => {
  const moduleSource = fs.readFileSync(
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

  assert.doesNotMatch(moduleSource, /ui\/location-backgrounds/);
  assert.match(moduleSource, /script-editor-location-background-options/);
  assert.equal(
    fs.existsSync(
      path.join(
        process.cwd(),
        "src",
        "modules",
        "script-editor",
        "ui",
        "views",
        "script-editor-location-background-options.ts"
      )
    ),
    true
  );
});
