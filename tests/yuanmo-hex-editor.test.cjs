const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const repoRoot = process.cwd();
const transpiledModuleCache = new Map();
const zhuyuanzhangPackRoot = path.join(
  repoRoot,
  "src",
  "content",
  "scenario-packs",
  "zhuyuanzhang"
);

function loadRepoModule(specifier, fromFile = path.join(repoRoot, "tests", "yuanmo-hex-editor.test.cjs")) {
  const resolvedPath = resolveRepoModulePath(specifier, fromFile);
  if (resolvedPath.endsWith(".json")) {
    return JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  }
  if (resolvedPath.endsWith(".js")) {
    return require(resolvedPath);
  }
  const cachedExports = transpiledModuleCache.get(resolvedPath);
  if (cachedExports != null) {
    return cachedExports;
  }

  const source = fs.readFileSync(resolvedPath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: resolvedPath,
  });
  const module = { exports: {} };
  transpiledModuleCache.set(resolvedPath, module.exports);
  const localRequire = (childSpecifier) => {
    if (!childSpecifier.startsWith(".") && !childSpecifier.startsWith("/")) {
      return require(childSpecifier);
    }
    return loadRepoModule(childSpecifier, resolvedPath);
  };
  const wrapper = vm.runInThisContext(
    `(function (exports, require, module, __filename, __dirname) { ${transpiled.outputText}\n})`,
    { filename: resolvedPath }
  );
  wrapper(module.exports, localRequire, module, resolvedPath, path.dirname(resolvedPath));
  transpiledModuleCache.set(resolvedPath, module.exports);
  return module.exports;
}

function resolveRepoModulePath(specifier, fromFile) {
  if (!specifier.startsWith(".") && !specifier.startsWith("/")) {
    return specifier;
  }
  const basePath = specifier.startsWith(".")
    ? path.resolve(path.dirname(fromFile), specifier)
    : specifier;
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.js`,
    `${basePath}.json`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.js"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Cannot resolve module "${specifier}" from "${fromFile}".`);
}

test("yuanmo hex editor generator output changes when sampling step changes", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");

  const base = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 0,
      y: 0,
      width: 509,
      height: 451,
    },
  });
  const stepped = generateBaselineHexGrid({
    scale: 1,
    step: 2,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 0,
      y: 0,
      width: 509,
      height: 451,
    },
  });

  assert.equal(base.generation.scale, 1);
  assert.equal(base.generation.step, 1);
  assert.equal(stepped.generation.step, 2);
  assert.notDeepEqual(
    base.cells.map((cell) => [cell.x, cell.y, cell.land, cell.referenceHeight, cell.terrain, cell.environment]),
    stepped.cells.map((cell) => [cell.x, cell.y, cell.land, cell.referenceHeight, cell.terrain, cell.environment])
  );
});

test("yuanmo editor map2 crop is normalized onto the runtime campaign grid", () => {
  const {
    createRuntimeCampaignHexGridFromEditorPackage,
    mapEditorSourcePositionToRuntimeHex,
  } = loadRepoModule("./../src/yuanmo-hex-editor/runtime-grid-export");
  const runtimeGrid = JSON.parse(
    fs.readFileSync(
      path.join(zhuyuanzhangPackRoot, "assets", "maps", "yuanmo-campaign-hex-grid.json"),
      "utf8"
    )
  );
  const editorGenerated = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "map2", "hex-grid.generated.json"), "utf8")
  );
  const waterLandOverrides = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "map2", "hex-overrides.water-land.json"), "utf8")
  );
  const terrainOverrides = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "map2", "hex-overrides.terrain.json"), "utf8")
  );
  const environmentOverrides = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "map2", "hex-overrides.environment.json"), "utf8")
  );
  const haozhouEditorCell = editorGenerated.cells.find((cell) => cell.x === 241 && cell.y === -90);

  assert.ok(haozhouEditorCell?.sourcePosition);
  assert.deepEqual(
    mapEditorSourcePositionToRuntimeHex(
      haozhouEditorCell.sourcePosition,
      runtimeGrid.coordinateSystem.coordinateSpace,
      editorGenerated.generation.sourceCrop
    ),
    { x: 6, y: -14 }
  );

  const exportedGrid = createRuntimeCampaignHexGridFromEditorPackage({
    runtimeGrid,
    editorGenerated,
    waterLandOverrides,
    terrainOverrides,
    environmentOverrides,
  });

  assert.equal(exportedGrid.format, "campaign-hex-grid-v1");
  assert.deepEqual(exportedGrid.bounds, runtimeGrid.bounds);
  assert.equal(exportedGrid.cells.length, runtimeGrid.cells.length);
  assert.equal(exportedGrid.counts.cells, runtimeGrid.cells.length);
  assert.equal(exportedGrid.source.editorOverlay.source, "yuanmo-hex-editor");
  assert.equal(exportedGrid.source.editorOverlay.projection, "source-position-to-runtime-hex");
  assert.equal(exportedGrid.source.editorOverlay.editorCellsApplied > 0, true);
  assert.equal(exportedGrid.source.editorOverlay.runtimeCellsChanged > 0, true);
  assert.equal(
    exportedGrid.cells.every((cell) => cell.x >= -68 && cell.x <= 68 && cell.y >= -46 && cell.y <= 46),
    true
  );
  assert.equal(
    exportedGrid.cells.some((cell, index) =>
      cell.land !== runtimeGrid.cells[index].land ||
      cell.terrain !== runtimeGrid.cells[index].terrain ||
      cell.environment !== runtimeGrid.cells[index].environment
    ),
    true
  );
  assert.equal(
    exportedGrid.cells.some((cell) => cell.x < -40 && cell.land),
    true
  );
  assert.equal(
    exportedGrid.cells.some((cell) => cell.x > 40 && cell.land),
    true
  );
});

test("yuanmo editor runtime export applies manual water-land overrides as hard runtime cell edits", () => {
  const {
    createRuntimeCampaignHexGridFromEditorPackage,
    mapEditorSourcePositionToRuntimeHex,
  } = loadRepoModule("./../src/yuanmo-hex-editor/runtime-grid-export");
  const runtimeGrid = JSON.parse(
    fs.readFileSync(
      path.join(zhuyuanzhangPackRoot, "assets", "maps", "yuanmo-campaign-hex-grid.json"),
      "utf8"
    )
  );
  const editorGenerated = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "map2", "hex-grid.generated.json"), "utf8")
  );
  const override = { x: 263, y: -99, land: false };
  const overriddenEditorCell = editorGenerated.cells.find(
    (cell) => cell.x === override.x && cell.y === override.y
  );

  assert.ok(overriddenEditorCell?.sourcePosition);
  const runtimeHex = mapEditorSourcePositionToRuntimeHex(
    overriddenEditorCell.sourcePosition,
    runtimeGrid.coordinateSystem.coordinateSpace,
    editorGenerated.generation.sourceCrop
  );
  assert.deepEqual(runtimeHex, { x: 15, y: -6 });

  const exportedGrid = createRuntimeCampaignHexGridFromEditorPackage({
    runtimeGrid,
    editorGenerated,
    waterLandOverrides: [override],
    terrainOverrides: [],
    environmentOverrides: [],
  });
  const runtimeCell = exportedGrid.cells.find(
    (cell) => cell.x === runtimeHex.x && cell.y === runtimeHex.y
  );

  assert.ok(runtimeCell);
  assert.equal(runtimeCell.land, false);
  assert.equal(runtimeCell.referenceHeight, 0);
});

test("yuanmo one-to-one runtime export applies map3 forests without overriding settlement or farmland cells", () => {
  const { createOneToOneRuntimeCampaignHexGridFromEditorPackage } = loadRepoModule(
    "./../src/yuanmo-hex-editor/runtime-grid-export"
  );
  const generated = {
    mapId: "map.yuanmo_campaign",
    generation: {
      scale: 1,
      step: 1,
      offsetX: 0,
      offsetY: 0,
      sourceCrop: { x: 0, y: 0, width: 100, height: 100 },
    },
    bounds: { minX: 0, maxX: 2, minY: 0, maxY: 0 },
    counts: {
      cells: 3,
      landCells: 3,
      waterCells: 0,
      terrains: { "平原": 3 },
      environments: { "草地": 3, "森林": 0 },
    },
    cells: [
      { x: 0, y: 0, land: true, referenceHeight: 0.2, terrain: "平原", environment: "草地" },
      { x: 1, y: 0, land: true, referenceHeight: 0.2, terrain: "平原", environment: "草地" },
      { x: 2, y: 0, land: true, referenceHeight: 0.2, terrain: "平原", environment: "草地" },
    ],
  };
  const runtimeGrid = {
    schemaVersion: 1,
    format: "campaign-hex-grid-v1",
    mapId: "map.yuanmo_campaign",
    defaults: { terrain: "平原", environment: "草地" },
    coordinateSystem: {
      hexTerrainScale: 138,
      hexMapAspect: 1,
      coordinateSpace: { width: 100, height: 100 },
    },
    source: {
      kind: "sampled-raster-layer",
      sourceLayerId: "test",
      sourceImage: { path: "test.png", width: 100, height: 100 },
      sampler: {
        method: "hex-center-nearest-pixel",
        hexCellSource: "test",
        terrainUvFormula: "test",
        pixelFormula: "test",
        waterMaterialRule: "test",
        landRule: "test",
      },
    },
    bounds: { minX: -1, maxX: 1, minY: 0, maxY: 0 },
    counts: {
      cells: 3,
      landCells: 3,
      waterCells: 0,
      terrains: { "平原": 3 },
      environments: { "草地": 3 },
    },
    cells: [
      { x: -1, y: 0, land: true, referenceHeight: 0.2, terrain: "平原", environment: "草地" },
      { x: 0, y: 0, land: true, referenceHeight: 0.2, terrain: "平原", environment: "森林" },
      { x: 1, y: 0, land: true, referenceHeight: 0.2, terrain: "平原", environment: "森林" },
    ],
  };

  const exported = createOneToOneRuntimeCampaignHexGridFromEditorPackage({
    runtimeGrid,
    editorGenerated: generated,
    environmentOverrides: [
      { x: 0, y: 0, environment: "森林" },
      { x: 1, y: 0, environment: "森林" },
      { x: 2, y: 0, environment: "森林" },
    ],
    settlementAnchors: [
      {
        id: "settlement.city",
        type: "city",
        mapPosition: { x: 50, y: 50 },
        hexCell: { x: 1, y: 0 },
      },
    ],
    structureOverlays: [
      {
        id: "structure.farm",
        category: "farmland",
        cells: [{ x: 2, y: 0 }],
      },
    ],
  });
  const cellByKey = new Map(exported.cells.map((cell) => [`${cell.x},${cell.y}`, cell]));

  assert.equal(cellByKey.get("-1,0")?.environment, "森林");
  assert.equal(cellByKey.get("0,0")?.environment, "草地");
  assert.equal(cellByKey.get("1,0")?.environment, "草地");
});

test("yuanmo hex editor sampling scale changes generated map density", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");

  const coarse = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 120,
      y: 120,
      width: 80,
      height: 80,
    },
  });
  const fine = generateBaselineHexGrid({
    scale: 0.5,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 120,
      y: 120,
      width: 80,
      height: 80,
    },
  });

  assert.equal(fine.generation.scale, 0.5);
  assert.ok(
    fine.cells.length > coarse.cells.length,
    `Expected smaller hex scale to create more cells, got coarse=${coarse.cells.length}, fine=${fine.cells.length}.`
  );
  assert.ok(
    fine.bounds.maxY - fine.bounds.minY > coarse.bounds.maxY - coarse.bounds.minY,
    "Expected generated local map bounds to expand when sampling more densely."
  );
});

test("yuanmo hex editor sampling step supports sub-unit precision and changes map size", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");

  const unitStep = generateBaselineHexGrid({
    scale: 0.75,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 160,
      y: 160,
      width: 60,
      height: 60,
    },
  });
  const fineStep = generateBaselineHexGrid({
    scale: 0.75,
    step: 0.5,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 160,
      y: 160,
      width: 60,
      height: 60,
    },
  });

  assert.equal(fineStep.generation.step, 0.5);
  assert.ok(
    fineStep.cells.length > unitStep.cells.length,
    `Expected smaller source sampling step to create more hex cells, got unit=${unitStep.cells.length}, fine=${fineStep.cells.length}.`
  );
  assert.ok(
    fineStep.bounds.maxY - fineStep.bounds.minY > unitStep.bounds.maxY - unitStep.bounds.minY,
    "Expected generated local map bounds to expand when source sampling step is smaller."
  );
});

test("yuanmo hex editor sampling step keeps changing below 0.7", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");

  const baseConfig = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 0,
      y: 0,
      width: 180,
      height: 180,
    },
  };
  const step07 = generateBaselineHexGrid({ ...baseConfig, step: 0.7 });
  const step06 = generateBaselineHexGrid({ ...baseConfig, step: 0.6 });
  const step05 = generateBaselineHexGrid({ ...baseConfig, step: 0.5 });

  assert.ok(
    step06.cells.length > step07.cells.length,
    `Expected step 0.6 to create more cells than 0.7, got ${step06.cells.length} <= ${step07.cells.length}.`
  );
  assert.ok(
    step05.cells.length > step06.cells.length,
    `Expected step 0.5 to create more cells than 0.6, got ${step05.cells.length} <= ${step06.cells.length}.`
  );
});

test("yuanmo hex editor crop filters a global hex grid without resetting grid phase", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");

  const full = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 0,
      y: 0,
      width: 220,
      height: 180,
    },
  });
  const cropped = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 48,
      y: 36,
      width: 72,
      height: 72,
    },
  });
  const fullPositionKeys = new Set(
    full.cells.map((cell) => `${cell.sourcePosition?.x},${cell.sourcePosition?.y}`)
  );

  assert.ok(cropped.cells.length > 0);
  assert.equal(
    cropped.cells.every((cell) =>
      fullPositionKeys.has(`${cell.sourcePosition?.x},${cell.sourcePosition?.y}`)
    ),
    true
  );
});

test("yuanmo hex editor generator samples supplied source raster pixels", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");
  const whiteLandPixel = [255, 255, 255, 255];
  const rasterData = new Uint8ClampedArray(Array.from({ length: 8 * 8 }, () => whiteLandPixel).flat());
  const lowHeightPixel = [64, 64, 64, 255];
  const heightData = new Uint8ClampedArray(Array.from({ length: 8 * 8 }, () => lowHeightPixel).flat());

  const rasterSampled = generateBaselineHexGrid(
    {
      scale: 1,
      step: 1,
      offsetX: 0,
      offsetY: 0,
      sourceCrop: {
        x: 0,
        y: 0,
        width: 120,
        height: 120,
      },
    },
    {
      groundTypes: {
        width: 8,
        height: 8,
        data: rasterData,
      },
      heights: {
        width: 8,
        height: 8,
        data: heightData,
      },
    }
  );

  assert.equal(rasterSampled.counts.landCells, rasterSampled.counts.cells);
  assert.ok(rasterSampled.cells.every((cell) => cell.land), "Expected white source raster pixels to produce land cells.");
  assert.ok(
    rasterSampled.cells.every((cell) => !cell.land || cell.referenceHeight < 0.26),
    "Expected supplied height raster pixels to control land reference heights."
  );
});

test("yuanmo hex editor Perlin forest generator creates deterministic land-only environment overrides", async () => {
  const { applyPerlinForestEnvironmentOverrides } = loadRepoModule(
    "./../src/yuanmo-hex-editor/forest-noise"
  );
  const generated = {
    cells: [
      { x: 0, y: 0, land: true, environment: "草地" },
      { x: 1, y: 0, land: true, environment: "草地" },
      { x: 2, y: 0, land: true, environment: "森林" },
      { x: 0, y: 1, land: false, environment: "草地" },
      { x: 1, y: 1, land: true, environment: "草地" },
      { x: 2, y: 1, land: true, environment: "草地" },
      { x: 0, y: 2, land: true, environment: "草地" },
      { x: 1, y: 2, land: true, environment: "草地" },
      { x: 2, y: 2, land: true, environment: "草地" },
    ],
  };
  const existingOverrides = [{ x: 8, y: 8, environment: "森林" }];

  const sparse = applyPerlinForestEnvironmentOverrides({
    generated,
    existingOverrides,
    density: 0.25,
    scale: 1.1,
    seed: "forest-seed",
    landOnly: true,
  });
  const sparseAgain = applyPerlinForestEnvironmentOverrides({
    generated,
    existingOverrides,
    density: 0.25,
    scale: 1.1,
    seed: "forest-seed",
    landOnly: true,
  });
  const dense = applyPerlinForestEnvironmentOverrides({
    generated,
    existingOverrides,
    density: 0.75,
    scale: 1.1,
    seed: "forest-seed",
    landOnly: true,
  });

  assert.deepEqual(sparse, sparseAgain);
  assert.equal(sparse.some((override) => override.x === 0 && override.y === 1), false);
  assert.equal(sparse.some((override) => override.x === 8 && override.y === 8), false);
  assert.ok(
    dense.length > sparse.length,
    `Expected higher density to produce more forest overrides, got sparse=${sparse.length}, dense=${dense.length}.`
  );
  assert.equal(
    dense.every((override) =>
      generated.cells.some((cell) => cell.x === override.x && cell.y === override.y && cell.land)
    ),
    true
  );
  assert.equal(dense.every((override) => override.environment === "森林"), true);
});

test("yuanmo hex editor sampling step is not hidden behind a radius floor", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "generator.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /Math\.max\(\s*samplingStep\s*,\s*radius\s*\/\s*5\s*\)/);
});

test("yuanmo hex editor exposes explicit sub-unit sampling step controls", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "main.ts"),
    "utf8"
  );

  assert.match(source, /data-sampling-adjust="step:-0\.1"/);
  assert.match(source, /data-sampling-adjust="step:0\.1"/);
  assert.match(source, /normalizeYuanmoHexSamplingConfig\(\{\s*\.\.\.session\.draftSampling,\s*\[field\]: session\.draftSampling\[field\] \+ delta,/);
});

test("yuanmo hex editor edit workspace keeps long inspector content from stretching the canvas", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "yuanmo-hex-editor.css"),
    "utf8"
  );

  assert.match(
    source,
    /\.yuanmo-hex-editor__workspace\s*{[^}]*align-items:\s*start;/s
  );
  assert.match(
    source,
    /#app\[data-active-step="edit"\]\s+\.yuanmo-hex-editor__panel\s*{[^}]*overflow:\s*auto;/s
  );
  assert.match(
    source,
    /#app\[data-active-step="edit"\]\s+\.yuanmo-hex-editor__canvas-shell\s*{[^}]*height:\s*clamp\(/s
  );
});

test("yuanmo hex editor viewport camera zooms around the pointer and pans within the source space", async () => {
  const {
    createCropEditorViewBox,
    panEditorViewBox,
    zoomEditorViewBox,
  } = loadRepoModule("./../src/yuanmo-hex-editor/viewport-camera");
  const coordinateSpace = { width: 509, height: 451 };

  const initialViewBox = createCropEditorViewBox(
    { x: 100, y: 80, width: 200, height: 120 },
    coordinateSpace
  );
  const anchor = {
    x: initialViewBox.x + initialViewBox.width * 0.25,
    y: initialViewBox.y + initialViewBox.height * 0.4,
  };
  const zoomed = zoomEditorViewBox(initialViewBox, anchor, 2, coordinateSpace);
  const anchorRatioX = (anchor.x - zoomed.x) / zoomed.width;
  const anchorRatioY = (anchor.y - zoomed.y) / zoomed.height;

  assert.ok(zoomed.width < initialViewBox.width);
  assert.ok(zoomed.height < initialViewBox.height);
  assert.ok(Math.abs(anchorRatioX - 0.25) < 0.000001);
  assert.ok(Math.abs(anchorRatioY - 0.4) < 0.000001);

  const panned = panEditorViewBox(zoomed, { x: 9999, y: 9999 }, coordinateSpace);
  assert.ok(panned.x + panned.width > coordinateSpace.width);
  assert.ok(panned.y + panned.height > coordinateSpace.height);
  assert.ok(panned.x + panned.width <= coordinateSpace.width * 1.18 + 0.000001);
  assert.ok(panned.y + panned.height <= coordinateSpace.height * 1.18 + 0.000001);
});

test("yuanmo hex editor draws source overlay below visible hex cells", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "canvas-view.ts"),
    "utf8"
  );
  const overlayIndex = source.indexOf("drawSourceImageCropOverlay(");
  const cellIndex = source.indexOf("drawResolvedCell(context, viewport, cell, input.selectedHexKey)");

  assert.notEqual(overlayIndex, -1);
  assert.notEqual(cellIndex, -1);
  assert.ok(overlayIndex < cellIndex);
});

test("yuanmo hex editor exposes an edit-step region overlay toggle", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "main.ts"),
    "utf8"
  );

  assert.match(source, /data-region-overlay-toggle/);
  assert.match(source, /showRegionOverlay/);
});

test("yuanmo hex editor exposes Perlin forest generation controls in the environment tool", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "main.ts"),
    "utf8"
  );

  assert.match(source, /data-forest-density/);
  assert.match(source, /data-forest-scale/);
  assert.match(source, /data-forest-seed/);
  assert.match(source, /data-forest-land-only/);
  assert.match(source, /data-action="generate-perlin-forest"/);
  assert.match(source, /data-action="clear-forest-overrides"/);
  assert.match(source, /createPerlinForestEnvironmentOverrides/);
});

test("yuanmo hex editor canvas draws sampled region overlays and labels", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "canvas-view.ts"),
    "utf8"
  );

  assert.match(source, /drawRegionOverlayCells\(/);
  assert.match(source, /drawRegionLabels\(/);
  assert.match(source, /regionOverlay/);
});

test("yuanmo hex editor draws hex cells from source coordinates without right-edge clamping", async () => {
  const { createSourceHexPolygon } = loadRepoModule("./../src/yuanmo-hex-editor/canvas-view");

  const polygon = createSourceHexPolygon({ x: 508, y: 220 }, 12, 1);

  assert.equal(polygon.length, 6);
  assert.ok(
    polygon.some((point) => point.x > 509),
    "Expected edge hex geometry to keep source-space vertices beyond the source image instead of clamping to x=509."
  );
});

test("yuanmo hex editor visual hex radius follows sub-unit source sampling step", async () => {
  const { getVisualSourceHexRadius } = loadRepoModule("./../src/yuanmo-hex-editor/canvas-view");
  const coordinateSpace = { width: 509, height: 451 };
  const baseSampling = {
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 0,
      y: 0,
      width: 509,
      height: 451,
    },
  };

  const unitRadius = getVisualSourceHexRadius(coordinateSpace, baseSampling);
  const fineRadius = getVisualSourceHexRadius(coordinateSpace, {
    ...baseSampling,
    step: 0.5,
  });

  assert.equal(fineRadius, unitRadius * 0.5);
});

test("yuanmo hex editor draws sampled hex tiles without shrinking gaps between neighbors", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "canvas-view.ts"),
    "utf8"
  );
  const drawResolvedCell = source.match(
    /function drawResolvedCell[\s\S]*?function drawRegionOverlayCells/
  )?.[0];

  assert.ok(drawResolvedCell);
  assert.doesNotMatch(
    drawResolvedCell,
    /viewport\.sourceHexRadius,\s*0\.[0-9]+/,
    "Sampled hex cells should be drawn at full source-grid radius; shrinking each tile creates visible loose gaps."
  );
});

test("yuanmo hex editor overdraws base hex fills instead of rendering loose grid seams", async () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "yuanmo-hex-editor", "canvas-view.ts"),
    "utf8"
  );
  const drawResolvedCell = source.match(
    /function drawResolvedCell[\s\S]*?function drawRegionOverlayCells/
  )?.[0];

  assert.ok(drawResolvedCell);
  assert.match(
    drawResolvedCell,
    /viewport\.sourceHexRadius,\s*1\.0[1-9]/,
    "Base hex fills should slightly overdraw neighbors to hide anti-aliased seams."
  );
  assert.match(
    drawResolvedCell,
    /if\s*\(\s*cellKey\s*!==\s*selectedHexKey\s*\)\s*\{\s*return;\s*\}/,
    "Unselected hexes should not draw default grid strokes that read as gaps between tiles."
  );
});

test("yuanmo hex editor only resamples inside the selected source crop", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");

  const coordinateSpace = { width: 509, height: 451 };
  const fullCrop = {
    x: 0,
    y: 0,
    width: coordinateSpace.width,
    height: coordinateSpace.height,
  };
  const uncropped = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: fullCrop,
  });
  const crop = {
    x: 120,
    y: 160,
    width: 36,
    height: 36,
  };
  const cropped = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: crop,
  });

  assert.equal(cropped.cells.length < uncropped.cells.length, true);
  const normalizedCrop = cropped.generation.sourceCrop;
  assert.equal(
    cropped.cells.every((cell) => {
      assert.ok(cell.sourcePosition);
      return (
        cell.sourcePosition.x >= normalizedCrop.x &&
        cell.sourcePosition.x <= normalizedCrop.x + normalizedCrop.width &&
        cell.sourcePosition.y >= normalizedCrop.y &&
        cell.sourcePosition.y <= normalizedCrop.y + normalizedCrop.height
      );
    }),
    true
  );

  assert.equal(cropped.counts.landCells < uncropped.counts.landCells, true);
});

test("yuanmo hex editor crop uses the visible source image y-axis", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");

  const coordinateSpace = { width: 509, height: 451 };
  const cropped = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 0,
      y: 0,
      width: 40,
      height: 40,
    },
  });

  const normalizedCrop = cropped.generation.sourceCrop;
  assert.equal(
    cropped.cells.every((cell) => {
      assert.ok(cell.sourcePosition);
      return (
        cell.sourcePosition.x >= normalizedCrop.x &&
        cell.sourcePosition.x <= normalizedCrop.x + normalizedCrop.width &&
        cell.sourcePosition.y >= normalizedCrop.y &&
        cell.sourcePosition.y <= normalizedCrop.y + normalizedCrop.height
      );
    }),
    true
  );
  assert.equal(cropped.cells.some((cell) => (cell.sourcePosition?.y ?? coordinateSpace.height) < 20), true);
  assert.equal(cropped.cells.every((cell) => (cell.sourcePosition?.y ?? coordinateSpace.height) < 50), true);
});

test("yuanmo hex editor default sampling creates a global grid over the full source map", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");

  const coordinateSpace = { width: 509, height: 451 };
  const generated = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 0,
      y: 0,
      width: coordinateSpace.width,
      height: coordinateSpace.height,
    },
  });

  assert.equal(generated.generation.scale, 1);
  assert.equal(generated.generation.step, 1);
  assert.ok(generated.cells.length > 8000);
  assert.ok(generated.bounds.minY < 0);
  assert.ok(generated.bounds.maxX > 80);
  assert.equal(
    generated.cells.every((cell) => {
      assert.ok(cell.sourcePosition);
      return (
        cell.sourcePosition.x >= 0 &&
        cell.sourcePosition.x <= coordinateSpace.width &&
        cell.sourcePosition.y >= 0 &&
        cell.sourcePosition.y <= coordinateSpace.height
      );
    }),
    true
  );
});

test("yuanmo hex editor maps source map settlements inside crop to nearest generated hex", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");
  const { createSettlementsFromMapNodes } = loadRepoModule("./../src/yuanmo-hex-editor/settlement-mapping");

  const generated = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 300,
      y: 300,
      width: 70,
      height: 50,
    },
  });
  const nodes = [
    { id: "settlement.inside", label: "Inside City", x: 318, y: 124, kind: "settlement", summary: "Level: city" },
    { id: "settlement.outside", label: "Outside City", x: 210, y: 210, kind: "settlement", summary: "Level: city" },
  ];

  const settlements = createSettlementsFromMapNodes({
    nodes,
    generated,
    sourceCrop: generated.generation.sourceCrop,
  });
  const inside = settlements.find((settlement) => settlement.id === "settlement.inside");

  assert.equal(settlements.length, 1);
  assert.ok(inside);
  assert.equal(inside.name, "Inside City");
  assert.deepEqual(inside.mapPosition, { x: 318, y: 124 });
  assert.ok(
    generated.cells.some((cell) => cell.x === inside.hexCell.x && cell.y === inside.hexCell.y),
    "Expected mapped settlement to reference an existing generated hex cell."
  );
});

test("yuanmo hex editor maps game node coordinates to visible source crop y-axis", async () => {
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");
  const { createSettlementsFromMapNodes } = loadRepoModule("./../src/yuanmo-hex-editor/settlement-mapping");
  const sourceHeight = 451;
  const generated = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 300,
      y: 16,
      width: 70,
      height: 50,
    },
  });
  const nodes = [
    {
      id: "settlement.top",
      label: "Top City",
      x: 318,
      y: sourceHeight - 27,
      kind: "settlement",
      summary: "Level: city",
    },
    {
      id: "settlement.direct-y-would-be-wrong",
      label: "Wrong Direct Y",
      x: 318,
      y: 27,
      kind: "settlement",
      summary: "Level: city",
    },
  ];

  const settlements = createSettlementsFromMapNodes({
    nodes,
    generated,
    sourceCrop: generated.generation.sourceCrop,
  });

  assert.deepEqual(
    settlements.map((settlement) => settlement.id),
    ["settlement.top"]
  );
  assert.deepEqual(settlements[0].mapPosition, { x: 318, y: 424 });
}
);

test("yuanmo hex editor maps pure-color region raster areas onto generated hex cells", async () => {
  const { createRegionsFromSourceMap } = loadRepoModule("./../src/yuanmo-hex-editor/region-mapping");
  const generated = {
    mapId: "test-map",
    generation: {
      scale: 1,
      step: 1,
      offsetX: 0,
      offsetY: 0,
      sourceCrop: { x: 0, y: 0, width: 100, height: 100 },
    },
    bounds: { minX: 0, maxX: 2, minY: 0, maxY: 0 },
    counts: {
      cells: 3,
      landCells: 3,
      waterCells: 0,
      terrains: {},
      environments: {},
    },
    cells: [
      { x: 0, y: 0, land: true, referenceHeight: 1, terrain: "骞冲師", environment: "鑽夊湴", sourcePosition: { x: 10, y: 10 } },
      { x: 1, y: 0, land: true, referenceHeight: 1, terrain: "骞冲師", environment: "鑽夊湴", sourcePosition: { x: 20, y: 10 } },
      { x: 2, y: 0, land: true, referenceHeight: 1, terrain: "骞冲師", environment: "鑽夊湴", sourcePosition: { x: 80, y: 80 } },
    ],
  };
  const raster = createSolidBlocksRaster(509, 451, [
    { x: 0, y: 0, width: 50, height: 50, color: [120, 20, 30, 255] },
    { x: 60, y: 60, width: 70, height: 70, color: [10, 90, 180, 255] },
  ]);

  const regions = createRegionsFromSourceMap({
    generated,
    regionRaster: raster,
    nodes: [
      {
        id: "settlement.luzhou.capital",
        label: "★泸州路 合肥 要塞",
        x: 20,
        y: 451 - 10,
        kind: "settlement",
        summary: "Region: ignored fallback",
      },
      {
        id: "settlement.blue",
        label: "蓝州路 外城",
        x: 80,
        y: 451 - 80,
        kind: "settlement",
        summary: "Region: blue fallback",
      },
    ],
  });

  const redRegion = regions.find((region) => region.id === "region.rgb.120-20-30");
  const blueRegion = regions.find((region) => region.id === "region.rgb.10-90-180");

  assert.ok(redRegion);
  assert.equal(redRegion.name, "泸州路");
  assert.equal(redRegion.capitalSettlementId, "settlement.luzhou.capital");
  assert.deepEqual(redRegion.cells, [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);
  assert.ok(blueRegion);
  assert.equal(blueRegion.name, "蓝州路");
});

test("yuanmo hex editor exported package includes sampled regions", async () => {
  const { createEditorStateFromPackageData } = loadRepoModule("./../src/yuanmo-hex-editor/editor-state");
  const { exportEditorPackage } = loadRepoModule("./../src/yuanmo-hex-editor/exporter");
  const base = createEditorStateFromPackageData({
    regions: [
      {
        id: "region.rgb.1-2-3",
        name: "测试路",
        color: { red: 1, green: 2, blue: 3 },
        cells: [{ x: 1, y: 2 }],
        capitalSettlementId: "settlement.test",
      },
    ],
  });

  const files = exportEditorPackage(base);

  assert.ok(files["regions.json"]);
  assert.equal(JSON.parse(files["regions.json"])[0].name, "测试路");
});

test("yuanmo hex editor validation reports invalid settlements and unknown categories", async () => {
  const { createEditorState } = loadRepoModule("./../src/yuanmo-hex-editor/editor-state");
  const { validateEditorProject } = loadRepoModule("./../src/yuanmo-hex-editor/validation");

  const baseState = createEditorState();
  const waterCell = baseState.resolved.cells.find((cell) => !cell.land);
  const landCell = baseState.resolved.cells.find((cell) => cell.land);

  assert.ok(waterCell);
  assert.ok(landCell);

  const issues = validateEditorProject({
    ...baseState,
    terrainOverrides: [{ x: landCell.x, y: landCell.y, terrain: "unknown-terrain" }],
    environmentOverrides: [{ x: landCell.x, y: landCell.y, environment: "unknown-environment" }],
    settlements: [
      {
        id: "settlement.duplicate",
        name: "  ",
        type: "city",
        mapPosition: { x: 0, y: 0 },
        hexCell: { x: waterCell.x, y: waterCell.y },
      },
      {
        id: "settlement.duplicate",
        name: "Invalid Type",
        type: "harbor",
        mapPosition: { x: 12, y: 18 },
        hexCell: { x: landCell.x, y: landCell.y },
      },
    ],
    structureOverlays: [
      {
        id: "overlay.bad-category",
        category: "unknown-overlay",
        cells: [{ x: landCell.x, y: landCell.y }],
      },
    ],
  });

  assert.deepEqual(
    issues.map((issue) => issue.code).sort(),
    [
      "environment-category-unknown",
      "settlement-id-duplicate",
      "settlement-name-required",
      "settlement-on-resolved-water",
      "settlement-type-unsupported",
      "structure-overlay-category-unknown",
      "terrain-category-unknown",
    ]
  );
});

test("yuanmo hex editor exporter writes the agreed layered package split", async () => {
  const { createEditorState } = loadRepoModule("./../src/yuanmo-hex-editor/editor-state");
  const { exportEditorPackage } = loadRepoModule("./../src/yuanmo-hex-editor/exporter");

  const state = createEditorState();
  const files = exportEditorPackage(state);

  assert.deepEqual(Object.keys(files).sort(), [
    "hex-grid.generated.json",
    "hex-overrides.environment.json",
    "hex-overrides.terrain.json",
    "hex-overrides.water-land.json",
    "project.json",
    "regions.json",
    "settlements.json",
    "structure-overlays.json",
  ]);

  const projectFile = JSON.parse(files["project.json"]);
  assert.equal(projectFile.mapId, state.project.mapId);
  assert.equal(projectFile.sampling.step, state.project.sampling.step);
  assert.equal(
    projectFile.sourceAssets.terrainSourceImagePath,
    state.project.sourceAssets.terrainSourceImagePath
  );
});

test("yuanmo hex editor import round-trip preserves resolved semantics and supports regeneration", async () => {
  const {
    YUANMO_FOREST_ENVIRONMENT,
    YUANMO_MOUNTAIN_TERRAIN,
  } = loadRepoModule("./../src/yuanmo-hex-editor/model");
  const { createEditorState, createEditorStateFromPackageData, regenerateEditorState } = loadRepoModule(
    "./../src/yuanmo-hex-editor/editor-state"
  );
  const { exportEditorPackage } = loadRepoModule("./../src/yuanmo-hex-editor/exporter");
  const { importEditorPackage } = loadRepoModule("./../src/yuanmo-hex-editor/importer");

  const initialState = createEditorState();
  const sampleLandCell = initialState.resolved.cells.find((cell) => cell.land);
  assert.ok(sampleLandCell);

  const customizedState = createEditorStateFromPackageData({
    project: {
      ...initialState.project,
      uiState: {
        ...initialState.project.uiState,
        activeToolId: "structure",
        showValidationOverlay: true,
      },
    },
    generated: initialState.generated,
    waterLandOverrides: [{ x: sampleLandCell.x, y: sampleLandCell.y, land: true }],
    terrainOverrides: [{ x: sampleLandCell.x, y: sampleLandCell.y, terrain: YUANMO_MOUNTAIN_TERRAIN }],
    environmentOverrides: [{ x: sampleLandCell.x, y: sampleLandCell.y, environment: YUANMO_FOREST_ENVIRONMENT }],
    settlements: [
      {
        id: "settlement.city.kaifeng",
        name: "Kaifeng",
        type: "city",
        mapPosition: { x: 320, y: 220 },
        hexCell: { x: sampleLandCell.x, y: sampleLandCell.y },
      },
    ],
    structureOverlays: [
      {
        id: "overlay.city.kaifeng",
        category: "city-ground",
        settlementId: "settlement.city.kaifeng",
        cells: [{ x: sampleLandCell.x, y: sampleLandCell.y }],
      },
    ],
  });

  const regeneratedState = regenerateEditorState(customizedState, {
    ...customizedState.project.sampling,
    step: 2,
  });
  assert.equal(regeneratedState.project.sampling.step, 2);
  assert.equal(regeneratedState.generated.generation.step, 2);

  const importedPackage = importEditorPackage(exportEditorPackage(regeneratedState));
  const roundTrippedState = createEditorStateFromPackageData(importedPackage);

  assert.deepEqual(snapshotResolvedState(roundTrippedState), snapshotResolvedState(regeneratedState));
  assert.deepEqual(roundTrippedState.project, regeneratedState.project);
});

function snapshotResolvedState(state) {
  return {
    cells: state.resolved.cells
      .map((cell) => ({
        key: cell.key,
        land: cell.land,
        terrain: cell.terrain,
        environment: cell.environment,
        structureGround: cell.structureGround,
        overlays: [...cell.overlays].sort(),
        settlementId: cell.settlementId,
        settlementType: cell.settlementType,
      }))
      .sort((left, right) => left.key.localeCompare(right.key)),
    passability: [...state.resolved.passabilityByCellKey.entries()].sort(([left], [right]) =>
      left.localeCompare(right)
    ),
    visuals: [...state.resolved.visualStateByCellKey.entries()].sort(([left], [right]) =>
      left.localeCompare(right)
    ),
  };
}

function createSolidBlocksRaster(width, height, blocks) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (const block of blocks) {
    for (let y = block.y; y < block.y + block.height; y += 1) {
      for (let x = block.x; x < block.x + block.width; x += 1) {
        const index = (y * width + x) * 4;
        data[index] = block.color[0];
        data[index + 1] = block.color[1];
        data[index + 2] = block.color[2];
        data[index + 3] = block.color[3];
      }
    }
  }
  return { width, height, data };
}

test("yuanmo hex editor resolver uses override values as the single final semantic state", async () => {
  const { getCampaignHexCellKey } = loadRepoModule("./../src/domain/campaign-hex");
  const { generateBaselineHexGrid } = loadRepoModule("./../src/yuanmo-hex-editor/generator");
  const { resolveHexSemanticState } = loadRepoModule("./../src/yuanmo-hex-editor/resolver");

  const generated = generateBaselineHexGrid({
    scale: 1,
    step: 1,
    offsetX: 0,
    offsetY: 0,
    sourceCrop: {
      x: 0,
      y: 0,
      width: 509,
      height: 451,
    },
  });
  const sampleCell = generated.cells.find((cell) => cell.land) ?? generated.cells[0];
  const key = getCampaignHexCellKey(sampleCell.x, sampleCell.y);
  const resolved = resolveHexSemanticState({
    generated,
    waterLandOverrides: [{ x: sampleCell.x, y: sampleCell.y, land: false }],
    terrainOverrides: [{ x: sampleCell.x, y: sampleCell.y, terrain: "平原" }],
    environmentOverrides: [{ x: sampleCell.x, y: sampleCell.y, environment: "森林" }],
    structureOverlays: [
      {
        id: "overlay.village",
        category: "village-ground",
        cells: [{ x: sampleCell.x, y: sampleCell.y }],
      },
    ],
    settlements: [
      {
        id: "settlement.sample",
        name: "Sample Village",
        type: "village",
        mapPosition: { x: 0, y: 0 },
        hexCell: { x: sampleCell.x, y: sampleCell.y },
      },
    ],
  });

  const finalCell = resolved.cellsByKey.get(key);
  assert.ok(finalCell);
  assert.equal(finalCell.land, false);
  assert.equal(finalCell.terrain, "平原");
  assert.equal(finalCell.environment, "森林");
  assert.equal(finalCell.structureGround, "village-ground");
  assert.deepEqual(finalCell.overlays, ["village-ground"]);
  assert.equal(resolved.passabilityByCellKey.get(key)?.isPassable, false);
  assert.equal(resolved.passabilityByCellKey.get(key)?.blockingReason, "water");
  assert.deepEqual(resolved.visualStateByCellKey.get(key), {
    land: false,
    terrain: "平原",
    environment: "森林",
    structureGround: "village-ground",
    settlementId: "settlement.sample",
    settlementType: "village",
  });
});
