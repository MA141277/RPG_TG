const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const packRoot = path.join(repoRoot, "src", "content", "scenario-packs", "zhuyuanzhang");
const map2Dir = path.join(repoRoot, "map2");
const buildRuntimeGridScriptPath = path.join(
  repoRoot,
  "tools",
  "build-yuanmo-runtime-grid-from-editor-package.cjs"
);
const mapsPath = path.join(packRoot, "maps.json");
const runtimeGridOutputPath = path.join(
  packRoot,
  "assets",
  "maps",
  "yuanmo-campaign-hex-grid-map2-runtime.json"
);
const YUANMO_COORDINATE_SPACE = { width: 509, height: 451 };
const BASE_HEX_TERRAIN_SCALE = 138;
const BASE_HEX_MAP_ASPECT = 1.1285;

function pixelToRoundedHex(x, y) {
  const axialX = 0.5773503 * x - 0.3333333 * y;
  const axialY = 0.6666667 * y;
  const axialZ = -axialX - axialY;
  let roundedX = Math.floor(axialX + 0.5);
  let roundedY = Math.floor(axialY + 0.5);
  let roundedZ = Math.floor(axialZ + 0.5);
  const diffX = Math.abs(roundedX - axialX);
  const diffY = Math.abs(roundedY - axialY);
  const diffZ = Math.abs(roundedZ - axialZ);

  if (diffX > diffY && diffX > diffZ) {
    roundedX = -roundedY - roundedZ;
  } else if (diffY > diffZ) {
    roundedY = -roundedX - roundedZ;
  } else {
    roundedZ = -roundedX - roundedY;
  }

  return { x: roundedX, y: roundedY };
}

function coordinateToRoundedHex(coordinate) {
  return coordinateToRoundedHexWithSystem(coordinate, {
    coordinateSpace: YUANMO_COORDINATE_SPACE,
    hexTerrainScale: BASE_HEX_TERRAIN_SCALE,
    hexMapAspect: BASE_HEX_MAP_ASPECT,
  });
}

function coordinateToRoundedHexWithSystem(coordinate, coordinateSystem) {
  const u = coordinate.x / coordinateSystem.coordinateSpace.width;
  const terrainV = 1 - coordinate.y / coordinateSystem.coordinateSpace.height;

  return pixelToRoundedHex(
    (u - 0.5) * coordinateSystem.hexMapAspect * coordinateSystem.hexTerrainScale,
    (terrainV - 0.5) * coordinateSystem.hexTerrainScale
  );
}

function hexToCoordinate(hex, coordinateSystem = {
  coordinateSpace: YUANMO_COORDINATE_SPACE,
  hexTerrainScale: BASE_HEX_TERRAIN_SCALE,
  hexMapAspect: BASE_HEX_MAP_ASPECT,
}) {
  const point = {
    x: Math.sqrt(3) * (hex.x + hex.y * 0.5),
    y: 1.5 * hex.y,
  };
  const u = Math.min(
    Math.max(point.x / (coordinateSystem.hexMapAspect * coordinateSystem.hexTerrainScale) + 0.5, 0),
    1
  );
  const terrainV = Math.min(Math.max(point.y / coordinateSystem.hexTerrainScale + 0.5, 0), 1);

  return {
    x: u * coordinateSystem.coordinateSpace.width,
    y: (1 - terrainV) * coordinateSystem.coordinateSpace.height,
  };
}

function mapEditorGameCoordinateToRuntimeHex(gameCoordinate, sourceCrop, coordinateSystem = {
  coordinateSpace: YUANMO_COORDINATE_SPACE,
  hexTerrainScale: BASE_HEX_TERRAIN_SCALE,
  hexMapAspect: BASE_HEX_MAP_ASPECT,
}) {
  const sourcePosition = {
    x: gameCoordinate.x,
    y: coordinateSystem.coordinateSpace.height - gameCoordinate.y,
  };
  return mapEditorSourcePositionToRuntimeHex(sourcePosition, sourceCrop, coordinateSystem);
}

function mapEditorSourcePositionToRuntimeHex(sourcePosition, sourceCrop, coordinateSystem) {
  const cropCoordinate = {
    x: sourcePosition.x - sourceCrop.x,
    y: sourcePosition.y - sourceCrop.y,
  };
  const u = cropCoordinate.x / sourceCrop.width;
  const terrainV = cropCoordinate.y / sourceCrop.height;

  return pixelToRoundedHex(
    (u - 0.5) * coordinateSystem.hexMapAspect * coordinateSystem.hexTerrainScale,
    (terrainV - 0.5) * coordinateSystem.hexTerrainScale
  );
}

test("yuanmo campaign keeps a runtime-compatible full hex grid and keeps Haozhou enterable", () => {
  const maps = JSON.parse(fs.readFileSync(path.join(packRoot, "maps.json"), "utf8"));
  const cities = JSON.parse(fs.readFileSync(path.join(packRoot, "cities.json"), "utf8"));
  const yuanmoMap = maps.find((map) => map.id === "map.yuanmo_campaign");
  const haozhouCity = cities.find((city) => city.id === "city.kulan");

  assert.ok(yuanmoMap, "Expected map.yuanmo_campaign in zhuyuanzhang maps.json.");
  assert.equal(
    yuanmoMap.campaignHexGridUrl,
    "./assets/maps/yuanmo-campaign-hex-grid-map2-runtime.json"
  );
  assert.equal(haozhouCity?.name, "濠州");
  assert.equal(haozhouCity?.mapNodeId, "settlement.fenyang_province");
  assert.equal(
    yuanmoMap.nodes.some((node) => node.id === "settlement.fenyang_province" && node.label === "濠州" && node.kind === "city"),
    true
  );
});

test("yuanmo campaign starts the player on the Haozhou land hex", () => {
  const maps = JSON.parse(fs.readFileSync(path.join(packRoot, "maps.json"), "utf8"));
  const grid = JSON.parse(
    fs.readFileSync(
      path.join(packRoot, "assets", "maps", "yuanmo-campaign-hex-grid-map2-runtime.json"),
      "utf8"
    )
  );
  const yuanmoMap = maps.find((map) => map.id === "map.yuanmo_campaign");
  const haozhouNode = yuanmoMap?.nodes.find((node) => node.id === "settlement.fenyang_province");
  const cellsByKey = new Map(grid.cells.map((cell) => [`${cell.x},${cell.y}`, cell]));

  assert.ok(yuanmoMap);
  assert.ok(haozhouNode);
  assert.deepEqual(yuanmoMap.initialPlayerCoordinate, {
    x: haozhouNode.x,
    y: haozhouNode.y,
  });

  const startHex = coordinateToRoundedHexWithSystem(
    yuanmoMap.initialPlayerCoordinate,
    grid.coordinateSystem
  );
  const haozhouHex = coordinateToRoundedHexWithSystem(haozhouNode, grid.coordinateSystem);

  assert.deepEqual(startHex, haozhouHex);
  assert.equal(cellsByKey.get(`${startHex.x},${startHex.y}`)?.land, true);
});

test("map2 settlement coordinates are projected from editor crop into campaign map nodes", () => {
  const maps = JSON.parse(fs.readFileSync(path.join(packRoot, "maps.json"), "utf8"));
  const project = JSON.parse(fs.readFileSync(path.join(repoRoot, "map2", "project.json"), "utf8"));
  const settlements = JSON.parse(fs.readFileSync(path.join(repoRoot, "map2", "settlements.json"), "utf8"));
  const grid = JSON.parse(fs.readFileSync(runtimeGridOutputPath, "utf8"));
  const yuanmoMap = maps.find((map) => map.id === "map.yuanmo_campaign");
  const haozhouSettlement = settlements.find((settlement) => settlement.id === "settlement.fenyang_province");
  const haozhouNode = yuanmoMap?.nodes.find((node) => node.id === "settlement.fenyang_province");

  assert.ok(project.sampling.sourceCrop);
  assert.ok(haozhouSettlement);
  assert.ok(haozhouNode);

  const projectedHex = mapEditorGameCoordinateToRuntimeHex(
    haozhouSettlement.mapPosition,
    project.sampling.sourceCrop,
    grid.coordinateSystem
  );
  const expectedCoordinate = hexToCoordinate(projectedHex, grid.coordinateSystem);

  assert.deepEqual(projectedHex, coordinateToRoundedHexWithSystem(expectedCoordinate, grid.coordinateSystem));
  assert.deepEqual(
    { x: haozhouNode.x, y: haozhouNode.y },
    expectedCoordinate
  );
  assert.deepEqual(yuanmoMap.initialPlayerCoordinate, expectedCoordinate);
});

test("map2 campaign map nodes contain only the editor package settlements", () => {
  const maps = JSON.parse(fs.readFileSync(path.join(packRoot, "maps.json"), "utf8"));
  const settlements = JSON.parse(fs.readFileSync(path.join(repoRoot, "map2", "settlements.json"), "utf8"));
  const yuanmoMap = maps.find((map) => map.id === "map.yuanmo_campaign");
  const settlementIds = new Set(settlements.map((settlement) => settlement.id));
  const nodeIds = new Set(yuanmoMap?.nodes.map((node) => node.id));

  assert.ok(yuanmoMap);
  assert.equal(yuanmoMap.nodes.length, settlementIds.size);
  assert.deepEqual(nodeIds, settlementIds);
  assert.equal(yuanmoMap.nodes.some((node) => node.kind === "fort"), false);
  assert.equal(yuanmoMap.nodes.some((node) => node.kind === "landmark"), false);
});

test("yuanmo runtime grid builder accepts an explicit editor package directory", () => {
  const tempRoot = fs.mkdtempSync(path.join(repoRoot, ".tmp-map-builder-"));
  const tempPackageDir = path.join(tempRoot, "editor-package");
  const mapsBackup = fs.readFileSync(mapsPath, "utf8");
  const runtimeBackup = fs.readFileSync(runtimeGridOutputPath, "utf8");

  try {
    fs.cpSync(map2Dir, tempPackageDir, { recursive: true });
    const stdout = execFileSync(
      process.execPath,
      [buildRuntimeGridScriptPath, "--input", tempPackageDir],
      {
        cwd: repoRoot,
        encoding: "utf8",
      }
    );

    assert.match(stdout, /editor package: .*editor-package/);
    assert.match(stdout, /water-land overrides: read \d+, applied \d+, skipped \d+/);
    assert.match(stdout, /rebuilt \d+ map nodes from .*editor-package settlements/);
  } finally {
    fs.writeFileSync(mapsPath, mapsBackup, "utf8");
    fs.writeFileSync(runtimeGridOutputPath, runtimeBackup, "utf8");
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("map2 yuanmo campaign runtime export keeps the editor hex grid coordinate space", () => {
  const gridPath = path.join(
    packRoot,
    "assets",
    "maps",
    "yuanmo-campaign-hex-grid-map2-runtime.json"
  );
  const grid = JSON.parse(fs.readFileSync(gridPath, "utf8"));

  assert.equal(grid.schemaVersion, 1);
  assert.equal(grid.format, "campaign-hex-grid-v1");
  assert.equal(grid.mapId, "map.yuanmo_campaign");
  assert.deepEqual(grid.bounds, {
    minX: -231,
    maxX: 231,
    minY: -153,
    maxY: 152,
  });
  assert.equal(grid.coordinateSystem.hexTerrainScale, 460);
  assert.equal(Number(grid.coordinateSystem.hexMapAspect.toFixed(6)), Number((200 / 169).toFixed(6)));
  assert.equal(grid.cells.length, 13512);
  assert.equal(grid.counts.cells, grid.cells.length);
  assert.equal(grid.source.editorOverlay.source, "yuanmo-hex-editor");
  assert.equal(grid.source.editorOverlay.projection, "editor-grid-exact-runtime-hex");
  assert.equal(grid.source.editorOverlay.editorCellsApplied, 13512);
  assert.equal(grid.source.editorOverlay.runtimeCellsChanged > 0, true);
  assert.equal(grid.source.editorOverlay.runtimeCellsChanged, 13512);
  assert.equal(
    grid.cells.some((cell) => cell.land && cell.referenceHeight > 0 && cell.referenceHeight < 1),
    true
  );
  assert.equal(
    grid.cells.every((cell) => !cell.land || cell.referenceHeight < 1),
    true
  );
  assert.equal(
    grid.cells.every((cell) =>
      cell.x >= grid.bounds.minX &&
      cell.x <= grid.bounds.maxX &&
      cell.y >= grid.bounds.minY &&
      cell.y <= grid.bounds.maxY
    ),
    true
  );
});

test("map2 yuanmo campaign hex grid remains an editor crop artifact, not the runtime grid", () => {
  const gridPath = path.join(
    packRoot,
    "assets",
    "maps",
    "yuanmo-campaign-hex-grid-map2.json"
  );
  const grid = JSON.parse(fs.readFileSync(gridPath, "utf8"));
  const haozhouCell = grid.cells.find((cell) => cell.x === 241 && cell.y === -90);

  assert.equal(grid.schemaVersion, 1);
  assert.equal(grid.format, "campaign-hex-grid-v1");
  assert.equal(grid.mapId, "map.yuanmo_campaign");
  assert.notDeepEqual(grid.bounds, {
    minX: -68,
    maxX: 68,
    minY: -46,
    maxY: 46,
  });
  assert.equal(grid.cells.length, 13512);
  assert.equal(grid.counts.cells, grid.cells.length);
  assert.ok(grid.defaults);
  assert.ok(grid.coordinateSystem);
  assert.ok(grid.source);
  assert.deepEqual(grid.bounds, {
    minX: 165,
    maxX: 338,
    minY: -164,
    maxY: -50,
  });
  assert.ok(haozhouCell, "Expected the map2 crop to include the Haozhou hex cell.");
  assert.equal(haozhouCell.land, true);
  assert.equal("sourcePosition" in haozhouCell, false);
});
