const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = process.cwd();
const testDistContentRoot = path.join(repoRoot, ".test-dist", "content");
const requiredNodeTestContentOutputs = [
  "base-game-content-pack.js",
  "prototype-world.js",
  "sample-scenario.js",
];

test("build:test emits root content modules required by the node robustness suite", () => {
  const missingOutputs = requiredNodeTestContentOutputs.filter((outputName) => {
    const outputPath = path.join(testDistContentRoot, outputName);
    return !fs.existsSync(outputPath);
  });

  assert.deepStrictEqual(
    missingOutputs,
    [],
    `Expected build:test to emit ${missingOutputs.join(", ")} from src/content root modules`
  );
});
