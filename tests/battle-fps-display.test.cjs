const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function extractFunctionBody(source, signature) {
  const start = source.indexOf(signature);
  if (start === -1) throw new Error(`Missing signature: ${signature}`);
  const bodyStart = source.indexOf("{", start + signature.length);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(bodyStart + 1, index);
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function loadBattleFpsFns() {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const formatBody = extractFunctionBody(source, "function formatFpsReadout(fpsValue)");
  const samplerBody = extractFunctionBody(source, "function createFpsSampler(windowMs = 500)");
  const formatFpsReadout = new Function(
    `return function formatFpsReadout(fpsValue) {${formatBody}};`,
  )();
  const createFpsSampler = new Function(
    `return function createFpsSampler(windowMs = 500) {${samplerBody}};`,
  )();
  return { formatFpsReadout, createFpsSampler };
}

test("battle FPS readout formats integers as top-right HUD text", () => {
  const { formatFpsReadout } = loadBattleFpsFns();
  assert.equal(formatFpsReadout(59.6), "FPS: 60");
  assert.equal(formatFpsReadout(null), "FPS: 0");
});

test("battle FPS sampler returns a stable positive value from rolling frame timestamps", () => {
  const { createFpsSampler } = loadBattleFpsFns();
  const sampler = createFpsSampler(500);
  sampler.push(0);
  sampler.push(16);
  sampler.push(32);
  sampler.push(48);
  assert.equal(sampler.current() > 0, true);
});

test("battle FPS HUD stays outside battle stage so embedded combat does not clip it", () => {
  const source = fs.readFileSync("prototypes/battle-demo/index.html", "utf8");
  const hudIndex = source.indexOf('<div class="battle-fps-hud" data-battle-fps-hud="true">');
  const stageIndex = source.indexOf('<div class="battle-stage">');
  assert.notEqual(hudIndex, -1);
  assert.notEqual(stageIndex, -1);
  assert.equal(hudIndex < stageIndex, true);
});
