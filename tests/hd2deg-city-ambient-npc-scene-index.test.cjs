const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function loadCityAmbientHelpers() {
  const context = { window: {} };
  vm.runInNewContext(
    fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-scene-index.js", "utf8"),
    context
  );
  vm.runInNewContext(
    fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-pathfinder.js", "utf8"),
    context
  );
  return context.window.PixelWorkflowCityAmbientNpc;
}

function key(tile) {
  return tile.x + "," + tile.y;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test("scene index contract covers blocked tiles, entrances, and four gates", () => {
  const source = fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-scene-index.js", "utf8");
  assert.match(source, /buildSceneIndex\(scene, helpers\)/);
  assert.match(source, /entranceNodes/);
  assert.match(source, /gateNodes/);
  assert.match(source, /blockedTiles/);
});

test("pathfinder contract exposes shortest path over unblocked tiles", () => {
  const source = fs.readFileSync("HD2DEG/scripts/app/city-ambient-npc-pathfinder.js", "utf8");
  assert.match(source, /findShortestTilePath\(sceneIndex, startTile, endTile\)/);
  assert.match(source, /openSet|frontier/);
  assert.match(source, /blockedTiles/);
});

test("buildSceneIndex derives blocked tiles, entrance nodes, gate nodes, and coordinate adapters", () => {
  const helpers = loadCityAmbientHelpers();
  const sceneIndex = helpers.buildSceneIndex(
    {
      bounds: { minX: 0, minY: 0, maxX: 5, maxY: 4 },
      objects: [
        {
          id: 7,
          wx: 2,
          wy: 2,
          angle: 0,
          scale: 1,
          tags: ["house"],
          drawRoad: true,
          model: { W: 2, D: 2 },
        },
      ],
    },
    {
      buildingFootprintWorld(object) {
        const halfW = object.model.W * 0.5;
        const halfD = object.model.D * 0.5;
        return [
          { x: object.wx - halfW, y: object.wy - halfD },
          { x: object.wx + halfW, y: object.wy - halfD },
          { x: object.wx + halfW, y: object.wy + halfD },
          { x: object.wx - halfW, y: object.wy + halfD },
        ];
      },
      worldFromTile(tile) {
        return { x: tile.x + 0.5, y: tile.y + 0.5 };
      },
      tileFromWorld(point) {
        return { x: Math.floor(point.x), y: Math.floor(point.y) };
      },
    }
  );

  assert.equal(sceneIndex.blockedTiles.has("2,2"), true);
  assert.equal(sceneIndex.blockedTiles.has("0,0"), false);
  assert.deepEqual(plain(sceneIndex.bounds), { minX: 0, minY: 0, maxX: 5, maxY: 4 });
  assert.equal(sceneIndex.entranceNodes.length, 1);
  assert.deepEqual(plain(sceneIndex.entranceNodes[0].tile), { x: 2, y: 3 });
  assert.equal(sceneIndex.gateNodes.length, 4);
  assert.deepEqual(Array.from(sceneIndex.gateNodes, (node) => node.side).sort(), ["east", "north", "south", "west"]);
  assert.deepEqual(plain(sceneIndex.worldFromTile({ x: 3, y: 1 })), { x: 3.5, y: 1.5 });
  assert.deepEqual(plain(sceneIndex.tileFromWorld({ x: 3.9, y: 1.1 })), { x: 3, y: 1 });
});

test("findShortestTilePath returns the shortest four-way path that avoids blocked tiles", () => {
  const helpers = loadCityAmbientHelpers();
  const sceneIndex = {
    bounds: { minX: 0, minY: 0, maxX: 2, maxY: 2 },
    blockedTiles: new Set(["1,0"]),
  };

  const path = helpers.findShortestTilePath(sceneIndex, { x: 0, y: 0 }, { x: 2, y: 0 });

  assert.deepEqual(Array.from(path, key), ["0,0", "0,1", "1,1", "2,1", "2,0"]);
});
