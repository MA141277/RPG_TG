const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadBattleAnimationThrottleFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const gateBody = extractFunctionBody(
    source,
    "function createBattleSpineFrameGate(frameDurationMs)",
  );
  const createBattleSpineFrameGate = new Function(
    `return function createBattleSpineFrameGate(frameDurationMs) {${gateBody}};`,
  )();
  return { createBattleSpineFrameGate };
}

test("battle spine frame gate suppresses duplicate renders inside the same animation frame window", () => {
  const { createBattleSpineFrameGate } = loadBattleAnimationThrottleFns();
  const gate = createBattleSpineFrameGate(1000 / 36);

  assert.equal(gate.shouldRender(0, 900), true);
  assert.equal(gate.shouldRender(5, 900), false);
  assert.equal(gate.shouldRender(20, 900), false);
  assert.equal(gate.shouldRender(30, 900), true);
});

test("battle spine frame gate still allows the final frame render at animation end", () => {
  const { createBattleSpineFrameGate } = loadBattleAnimationThrottleFns();
  const gate = createBattleSpineFrameGate(1000 / 36);

  assert.equal(gate.shouldRender(845, 900), true);
  assert.equal(gate.shouldRender(850, 900), false);
  assert.equal(gate.shouldRender(900, 900), true);
});
