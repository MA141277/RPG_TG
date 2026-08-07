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
