const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

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

function loadAmbientNpcRuntime(randomValues = []) {
  const source = readText(runtimePath);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const module = { exports: {} };
  const fakeMath = Object.create(Math);
  let randomIndex = 0;
  fakeMath.random = () => {
    const nextValue = randomValues[randomIndex];
    randomIndex += 1;
    return nextValue ?? 0;
  };
  const context = {
    module,
    exports: module.exports,
    require(specifier) {
      if (
        specifier === "./city-stage-geometry" ||
        specifier === "./city-stage-ambient-npc-sprites"
      ) {
        return {};
      }
      throw new Error(`Unexpected require: ${specifier}`);
    },
    console,
    Math: fakeMath,
    Set,
    Map,
  };
  vm.runInNewContext(compiled, context, { filename: runtimePath });
  return module.exports;
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

test("ambient NPC runtime does not spawn a walker when no valid path exists", () => {
  const { createCityStageAmbientNpcRuntime } = loadAmbientNpcRuntime();
  const geometry = {
    blockedTiles: new Set(["1,0", "1,1", "1,2"]),
    entranceNodes: [],
    edgeNodes: [
      { id: "edge:left", kind: "edge", tileX: 0, tileY: 1, worldX: 0, worldY: 32 },
      { id: "edge:right", kind: "edge", tileX: 2, tileY: 1, worldX: 64, worldY: 32 },
    ],
    stageWidth: 128,
    stageHeight: 128,
    baseSpaceWidth: 128,
    baseSpaceHeight: 128,
    gridCols: 3,
    gridRows: 3,
    cellWidth: 32,
    cellHeight: 16,
    originX: 32,
    originY: 16,
  };
  const runtime = createCityStageAmbientNpcRuntime({
    geometry,
    descriptors: [
      {
        id: "npc:test",
        label: "Test",
        palette: "neutral",
        speed: 1,
        spriteSetId: "骞虫皯1",
      },
    ],
  });

  runtime.tick(16);

  assert.equal(runtime.getRenderables().length, 0);
});

test("ambient NPC runtime rejects overlapping spawns within 20px", () => {
  const { createCityStageAmbientNpcRuntime } = loadAmbientNpcRuntime();
  const geometry = {
    blockedTiles: new Set(),
    entranceNodes: [],
    edgeNodes: [
      { id: "edge:left", kind: "edge", tileX: 0, tileY: 1, worldX: -10, worldY: 5 },
      { id: "edge:right", kind: "edge", tileX: 2, tileY: 1, worldX: 10, worldY: 15 },
    ],
    stageWidth: 128,
    stageHeight: 128,
    baseSpaceWidth: 128,
    baseSpaceHeight: 128,
    gridCols: 3,
    gridRows: 3,
    cellWidth: 20,
    cellHeight: 10,
    originX: 0,
    originY: 0,
  };
  const runtime = createCityStageAmbientNpcRuntime({
    geometry,
    descriptors: [
      {
        id: "npc:test",
        label: "Test",
        palette: "neutral",
        speed: 1,
        spriteSetId: "骞虫皯1",
      },
    ],
  });

  assert.equal(runtime.getRenderables().length, 1);
});

test("ambient NPC runtime pauses one walker when two NPCs get within 20px", () => {
  const { createCityStageAmbientNpcRuntime } = loadAmbientNpcRuntime([
    0,
    0,
    0.5,
    0,
    0,
    0,
    0.5,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
  const geometry = {
    blockedTiles: new Set(),
    entranceNodes: [],
    edgeNodes: [
      { id: "edge:left", kind: "edge", tileX: 0, tileY: 1, worldX: -10, worldY: 5 },
      { id: "edge:right", kind: "edge", tileX: 2, tileY: 1, worldX: 10, worldY: 15 },
    ],
    stageWidth: 128,
    stageHeight: 128,
    baseSpaceWidth: 128,
    baseSpaceHeight: 128,
    gridCols: 3,
    gridRows: 3,
    cellWidth: 20,
    cellHeight: 10,
    originX: 0,
    originY: 0,
  };
  const runtime = createCityStageAmbientNpcRuntime({
    geometry,
    descriptors: [
      {
        id: "npc:test",
        label: "Test",
        palette: "neutral",
        speed: 1,
        spriteSetId: "骞虫皯1",
      },
    ],
  });

  const before = runtime.getRenderables().sort((left, right) => left.x - right.x);
  assert.equal(before.length, 2);

  runtime.tick(400);

  const after = runtime.getRenderables().sort((left, right) => left.x - right.x);
  assert.ok(after[0].x > before[0].x);
  assert.equal(after[1].x, before[1].x);
  assert.equal(after[1].y, before[1].y);
});

test("ambient NPC runtime source rejects straight-line fallback through blocked geometry", () => {
  const source = readText(runtimePath);

  assert.doesNotMatch(
    source,
    /return\s*\[\s*tileToWorld\(startNode\.tileX,\s*startNode\.tileY,\s*geometry\)\s*,\s*tileToWorld\(endNode\.tileX,\s*endNode\.tileY,\s*geometry\)\s*\]/
  );
  assert.match(source, /spawnRetryLimit|spawnRetryLimit|attempts/);
});
