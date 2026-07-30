const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const mapsPath = path.join(
  repoRoot,
  "src/content/scenario-packs/zhuyuanzhang/maps.json"
);
const runtimeHexGridPath = path.join(
  repoRoot,
  "src/content/scenario-packs/zhuyuanzhang/assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json"
);

const neighborDirections = [
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
];

const forbiddenModelFields = [
  "visualKind",
  "structureVisual",
  "modelUrl",
  "meshUrl",
  "model",
  "buildingInstances",
  "buildings",
  "marker",
  "nodeId",
  "cityId",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function roundCube(cube) {
  let rx = Math.round(cube.x);
  let ry = Math.round(cube.y);
  let rz = Math.round(cube.z);

  const xDiff = Math.abs(rx - cube.x);
  const yDiff = Math.abs(ry - cube.y);
  const zDiff = Math.abs(rz - cube.z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return { x: rx, y: rz };
}

function coordinateToRoundedHex(coordinate, coordinateSpace, coordinateSystem) {
  const bounds = coordinateSystem.hexPointBounds;
  assert.ok(bounds, "campaign runtime hex grid must define hexPointBounds");
  const u = coordinate.x / coordinateSpace.width;
  const terrainV = 1 - coordinate.y / coordinateSpace.height;
  const pixelX = bounds.minX + u * (bounds.maxX - bounds.minX);
  const pixelY = bounds.minY + terrainV * (bounds.maxY - bounds.minY);
  const axialX = (Math.sqrt(3) / 3) * pixelX - pixelY / 3;
  const axialY = (2 / 3) * pixelY;
  return roundCube({
    x: axialX,
    z: axialY,
    y: -axialX - axialY,
  });
}

test("campaign city nodes have 2 to 5 neighboring farmland hexes without map models", () => {
  const maps = readJson(mapsPath);
  const campaignMap = maps.find((map) => map.id === "map.yuanmo_campaign");
  assert.ok(campaignMap, "map.yuanmo_campaign must exist");

  const grid = readJson(runtimeHexGridPath);
  const coordinateSpace =
    campaignMap.coordinateSpace ?? grid.coordinateSystem.coordinateSpace;
  const cellsByKey = new Map(grid.cells.map((cell) => [`${cell.x},${cell.y}`, cell]));
  const campaignCityNodes = campaignMap.nodes.filter((node) => node.kind === "city");

  assert.ok(
    campaignCityNodes.length > 0,
    "test fixture must include runtime campaign city nodes"
  );

  for (const requiredCityId of [
    "settlement.fenyang_province",
    "settlement.kaifeng_province",
    "settlement.tieling_province",
  ]) {
    assert.ok(
      campaignCityNodes.some((node) => node.id === requiredCityId),
      `test fixture must include ${requiredCityId}`
    );
  }

  for (const city of campaignCityNodes) {
    const centerHex = coordinateToRoundedHex(city, coordinateSpace, grid.coordinateSystem);
    const neighborCells = neighborDirections
      .map((direction) =>
        cellsByKey.get(`${centerHex.x + direction.x},${centerHex.y + direction.y}`)
      )
      .filter(Boolean);
    const landNeighborCount = neighborCells.filter((cell) => cell.land).length;
    if (landNeighborCount < 2) {
      assert.equal(
        city.id,
        "settlement.ryukyu_province",
        `${city.id} is missing enough land neighbors for farmland placement`
      );
      continue;
    }
    const farmlandCells = neighborCells.filter(
      (cell) => cell.structureGround === "farmland"
    );

    assert.ok(
      farmlandCells.length >= 2 && farmlandCells.length <= 5,
      `${city.id} should have 2-5 neighboring farmland hexes, got ${farmlandCells.length}`
    );

    for (const cell of farmlandCells) {
      for (const field of forbiddenModelFields) {
        assert.equal(
          Object.hasOwn(cell, field),
          false,
          `${city.id} farmland hex ${cell.x},${cell.y} must not contain model field ${field}`
        );
      }
    }
  }
});
