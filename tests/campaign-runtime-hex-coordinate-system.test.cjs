const test = require("node:test");
const assert = require("node:assert/strict");

const {
  coordinateToRoundedHex,
  hexToCoordinate,
  hexToCoordinatePolygon,
} = require("../.test-dist/application/navigation/travel-to-coordinate.js");
const { campaignHexToPixel } = require("../.test-dist/domain/campaign-hex.js");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const repoRoot = path.resolve(__dirname, "..");
const transpiledModuleCache = new Map();

function loadRepoModule(specifier, fromFile = path.join(repoRoot, "tests", "campaign-runtime-hex-coordinate-system.test.cjs")) {
  const resolvedPath = resolveRepoModulePath(specifier, fromFile);
  if (resolvedPath.endsWith(".json")) {
    return JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  }
  if (resolvedPath.endsWith(".js") || resolvedPath.endsWith(".cjs")) {
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
  if (!specifier.startsWith(".") && !specifier.startsWith("/") && !path.isAbsolute(specifier)) {
    return specifier;
  }
  const basePath =
    specifier.startsWith(".") || !path.isAbsolute(specifier)
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

const map3CoordinateSystem = {
  hexTerrainScale: 138,
  hexMapAspect: 1.1285,
  coordinateSpace: { width: 509, height: 451 },
  hexPointBounds: {
    minX: -103.057023,
    maxX: 101.324972,
    minY: -86.5,
    maxY: 86.5,
  },
};

test("campaign runtime coordinate system maps coordinates through loaded hexPointBounds", () => {
  const haozhouCoordinate = {
    x: 245.87288158317762,
    y: 291.97687861271675,
  };

  assert.deepEqual(
    coordinateToRoundedHex(
      haozhouCoordinate,
      map3CoordinateSystem.coordinateSpace,
      map3CoordinateSystem
    ),
    { x: 6, y: -17 }
  );
});

test("campaign runtime coordinate system converts runtime hex centers back to map coordinates", () => {
  const coordinate = hexToCoordinate(
    { x: 6, y: -17 },
    map3CoordinateSystem.coordinateSpace,
    map3CoordinateSystem
  );

  assert.ok(Math.abs(coordinate.x - 245.87288158317762) < 0.000001);
  assert.ok(Math.abs(coordinate.y - 291.97687861271675) < 0.000001);
});

test("campaign runtime coordinate system sizes hover polygons from loaded hexPointBounds", () => {
  const polygon = hexToCoordinatePolygon({
    hex: { x: 6, y: -17 },
    coordinateSpace: map3CoordinateSystem.coordinateSpace,
    coordinateSystem: map3CoordinateSystem,
  });
  const width = Math.max(...polygon.map((point) => point.x)) - Math.min(...polygon.map((point) => point.x));
  const height = Math.max(...polygon.map((point) => point.y)) - Math.min(...polygon.map((point) => point.y));

  assert.ok(width > 3.9 && width < 4.6);
  assert.ok(height > 4.9 && height < 5.5);
});

test("map3 one-to-one runtime export keeps source image y direction", () => {
  const {
    createOneToOneRuntimeCampaignHexGridFromEditorPackage,
    mapEditorSourcePositionToOneToOneRuntimeHex,
  } = loadRepoModule("../src/yuanmo-hex-editor/runtime-grid-export");
  const editorGenerated = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "map3", "hex-grid.generated.json"), "utf8")
  );
  const runtimeGrid = JSON.parse(
    fs.readFileSync(
      path.join(
        repoRoot,
        "src",
        "content",
        "scenario-packs",
        "zhuyuanzhang",
        "assets",
        "maps",
        "yuanmo-campaign-hex-grid.json"
      ),
      "utf8"
    )
  );
  const exportedGrid = createOneToOneRuntimeCampaignHexGridFromEditorPackage({
    runtimeGrid,
    editorGenerated,
  });
  const topCell = editorGenerated.cells.reduce((best, cell) =>
    cell.sourcePosition.y < best.sourcePosition.y ? cell : best
  );
  const bottomCell = editorGenerated.cells.reduce((best, cell) =>
    cell.sourcePosition.y > best.sourcePosition.y ? cell : best
  );
  const topHex = mapEditorSourcePositionToOneToOneRuntimeHex(
    topCell.sourcePosition,
    editorGenerated
  );
  const bottomHex = mapEditorSourcePositionToOneToOneRuntimeHex(
    bottomCell.sourcePosition,
    editorGenerated
  );
  const bounds = exportedGrid.coordinateSystem.hexPointBounds;
  const toTerrainV = (hex) => {
    const point = campaignHexToPixel(hex);
    return (point.y - bounds.minY) / (bounds.maxY - bounds.minY);
  };

  assert.ok(
    toTerrainV(bottomHex) > toTerrainV(topHex),
    "Expected lower source-image cells to render lower on the campaign terrain."
  );
});
