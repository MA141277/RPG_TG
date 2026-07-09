const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

test(".test-dist emits base-game-content-pack for robustness imports", () => {
  const compiledModulePath = path.join(
    projectRoot,
    ".test-dist",
    "content",
    "base-game-content-pack.js"
  );

  assert.equal(
    fs.existsSync(compiledModulePath),
    true,
    `Expected build:test to emit ${compiledModulePath}`
  );
});
