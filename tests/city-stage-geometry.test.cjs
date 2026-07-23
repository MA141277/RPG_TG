const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const geometryPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-geometry.ts"
);
const registryPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-registry.ts"
);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("geometry source defines blocked tiles, entrances, and edge nodes", () => {
  const source = readText(geometryPath);

  assert.match(source, /buildCityStageGeometry/);
  assert.match(source, /blockedTiles/);
  assert.match(source, /entranceNodes/);
  assert.match(source, /edgeNodes/);
});

test("registry fallback source synthesizes default ambient NPC descriptors", () => {
  const source = readText(registryPath);

  assert.match(source, /getAmbientNpcDescriptors/);
  assert.match(source, /default|fallback/i);
  assert.match(source, /spriteSetId/);
});
