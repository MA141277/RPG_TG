const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("house runtime coin reward flights stay shared and consume request pointer coordinates", () => {
  const contractSource = fs.readFileSync("src/core/contracts/house-runtime.ts", "utf8");
  const runtimeSource = fs.readFileSync("src/core/runtime/house-runtime.ts", "utf8");
  const mainSource = fs.readFileSync("src/main.ts", "utf8");

  assert.match(
    contractSource,
    /pointer\?:\s*\{\s*clientX:\s*number;\s*clientY:\s*number;\s*\}/s
  );
  assert.match(runtimeSource, /sideEffect\.type === "play-coin-reward"/);
  assert.match(
    runtimeSource,
    /sourceClientX:\s*requestContext\.pointer\.clientX/s
  );
  assert.match(
    runtimeSource,
    /sourceClientY:\s*requestContext\.pointer\.clientY/s
  );
  assert.match(mainSource, /playCoinReward:\s*\(\{/);
  assert.doesNotMatch(mainSource, /moduleId\s*===\s*["']tavern["']/);
});
