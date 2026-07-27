const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function loadAmbientNpcRuntimeHelpers() {
  const context = {
    window: {},
    performance: { now: () => 0 },
  };
  vm.runInNewContext(
    fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-scene-index.js", "utf8"),
    context
  );
  vm.runInNewContext(
    fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-pathfinder.js", "utf8"),
    context
  );
  vm.runInNewContext(
    fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-runtime.js", "utf8"),
    context
  );
  return context.window.PixelWorkflowCityAmbientNpc;
}

test("ambient runtime contract exposes bounded non-interactive capsule walkers", () => {
  const source = fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-runtime.js", "utf8");
  assert.match(source, /createAmbientNpcRuntime\(config/);
  assert.match(source, /minActive\s*=\s*4|minActive:\s*4/);
  assert.match(source, /maxActive\s*=\s*8|maxActive:\s*8/);
  assert.match(source, /interactive:\s*false|isInteractive:\s*false/);
  assert.match(source, /capsule-placeholder|capsule/);
});

test("ambient runtime owns a descriptor seam for later npc-pool hookup", () => {
  const source = fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-runtime.js", "utf8");
  assert.match(source, /getAmbientNpcDescriptors|getDescriptors/);
  assert.match(source, /sceneId/);
});

test("ambient runtime maintains a 4..8 active count and exposes capsule renderables", () => {
  const helpers = loadAmbientNpcRuntimeHelpers();
  const randomValues = [
    0.2, 0.0, 0.9, 0.3, 0.7, 0.1, 0.8, 0.4, 0.6, 0.05,
    0.95, 0.15, 0.55, 0.25, 0.75, 0.35, 0.65, 0.45,
  ];
  let randomIndex = 0;
  const runtime = helpers.createAmbientNpcRuntime({
    random() {
      const value = randomValues[randomIndex % randomValues.length];
      randomIndex += 1;
      return value;
    },
    walkSpeedWorldPerSec: 12,
  });

  const sceneIndex = {
    blockedTiles: new Set(["99,99"]),
    entranceNodes: [
      { objectId: 1, tile: { x: 1, y: 1 }, world: { x: 1.5, y: 1.5 } },
      { objectId: 2, tile: { x: 4, y: 1 }, world: { x: 4.5, y: 1.5 } },
    ],
    gateNodes: [
      { side: "north", tile: { x: 2, y: 0 }, world: { x: 2.5, y: 0.5 }, blocked: false },
      { side: "east", tile: { x: 5, y: 2 }, world: { x: 5.5, y: 2.5 }, blocked: false },
      { side: "south", tile: { x: 2, y: 5 }, world: { x: 2.5, y: 5.5 }, blocked: false },
      { side: "west", tile: { x: 0, y: 2 }, world: { x: 0.5, y: 2.5 }, blocked: false },
    ],
    bounds: { minX: 0, minY: 0, maxX: 5, maxY: 5 },
    worldFromTile(tile) {
      return { x: tile.x + 0.5, y: tile.y + 0.5 };
    },
    tileFromWorld(point) {
      return { x: Math.floor(point.x), y: Math.floor(point.y) };
    },
  };

  runtime.resetForScene("zyz_kulan_city", sceneIndex);
  runtime.tick(16);
  const renderables = runtime.getRenderables();

  assert.ok(renderables.length >= 4 && renderables.length <= 8);
  assert.equal(runtime.minActive, 4);
  assert.equal(runtime.maxActive, 8);
  assert.equal(runtime.getDescriptors("zyz_kulan_city").length >= renderables.length, true);
  for (const renderable of renderables) {
    assert.equal(renderable.interactive, false);
    assert.equal(renderable.type, "capsule-placeholder");
    assert.equal(Number.isFinite(renderable.wx), true);
    assert.equal(Number.isFinite(renderable.wy), true);
    assert.equal(Number.isFinite(renderable.bobOffset), true);
  }
});
