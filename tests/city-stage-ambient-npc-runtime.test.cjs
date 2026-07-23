const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const runtimePath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-ambient-npc-runtime.ts"
);
const domRuntimePath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-dom-runtime.ts"
);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("ambient NPC runtime source maintains a bounded 4..8 population", () => {
  const source = readText(runtimePath);

  assert.match(source, /4/);
  assert.match(source, /8/);
  assert.match(source, /getRenderables/);
  assert.match(source, /tick/);
  assert.match(source, /spriteSetId/);
  assert.match(source, /facing/);
});

test("ambient NPC runtime keeps bob offset disabled for static height preview", () => {
  const source = readText(runtimePath);

  assert.match(source, /bobOffset:\s*0/);
  assert.doesNotMatch(source, /Math\.sin\(walker\.stepPhase\)\s*\*\s*3/);
});

test("city-stage DOM runtime mounts a render layer", () => {
  const source = readText(domRuntimePath);

  assert.match(source, /mountCityStageDomRuntime/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /c-city-stage-ambient-npc-layer/);
  assert.match(source, /c-city-stage-ambient-npc__sprite/);
  assert.doesNotMatch(source, /c-city-stage-ambient-npc__capsule/);
});
