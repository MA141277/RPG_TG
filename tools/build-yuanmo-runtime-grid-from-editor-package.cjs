const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { PNG } = require("pngjs");

const repoRoot = path.resolve(__dirname, "..");
const transpiledModuleCache = new Map();
const cliOptions = parseCliOptions(process.argv.slice(2));

const runtimeGridPath = path.join(
  repoRoot,
  "src",
  "content",
  "scenario-packs",
  "zhuyuanzhang",
  "assets",
  "maps",
  "yuanmo-campaign-hex-grid.json"
);
const outputGridPath = path.join(
  repoRoot,
  "src",
  "content",
  "scenario-packs",
  "zhuyuanzhang",
  "assets",
  "maps",
  "yuanmo-campaign-hex-grid-map2-runtime.json"
);
const mapsPath = path.join(repoRoot, "src", "content", "scenario-packs", "zhuyuanzhang", "maps.json");
const editorPackageDir = resolveEditorPackageDir(cliOptions.input);
const editorPackageLabel = formatRepoPath(editorPackageDir);

const {
  createOneToOneRuntimeCampaignHexGridFromEditorPackage,
  mapEditorSourcePositionToOneToOneRuntimeHex,
  mapEditorGameCoordinateToOneToOneRuntimeHex,
  mapRuntimeHexToGameCoordinate,
} = loadRepoModule(
  path.join(repoRoot, "src", "yuanmo-hex-editor", "runtime-grid-export.ts")
);
const { getCampaignHexCellKey } = loadRepoModule(
  path.join(repoRoot, "src", "domain", "campaign-hex.ts")
);

const runtimeGrid = readJson(runtimeGridPath);
const editorGenerated = withResampledEditorHeights(
  readJson(path.join(editorPackageDir, "hex-grid.generated.json")),
  path.join(
    repoRoot,
    "src",
    "content",
    "scenario-packs",
    "zhuyuanzhang",
    "assets",
    "maps",
    "yuanmo-map-heights.png"
  )
);
const waterLandOverrides = readOptionalJson(
  path.join(editorPackageDir, "hex-overrides.water-land.json")
);
const terrainOverrides = readOptionalJson(path.join(editorPackageDir, "hex-overrides.terrain.json"));
const environmentOverrides = readOptionalJson(
  path.join(editorPackageDir, "hex-overrides.environment.json")
);
const settlementAnchors = readOptionalJson(path.join(editorPackageDir, "settlements.json"))
  .filter((settlement) => settlement?.mapPosition != null)
  .map((settlement) => ({
    id: settlement.id,
    name: settlement.name,
    type: settlement.type,
    mapPosition: settlement.mapPosition,
  }));
const exportedGrid = createOneToOneRuntimeCampaignHexGridFromEditorPackage({
  runtimeGrid,
  editorGenerated,
  waterLandOverrides,
  terrainOverrides,
  environmentOverrides,
  settlementAnchors,
});
const waterLandOverrideStats = countProjectedOverrides({
  overrides: waterLandOverrides,
  editorGenerated,
  runtimeGrid: exportedGrid,
  projectionRuntimeGrid: runtimeGrid,
  sourceCrop: editorGenerated.generation?.sourceCrop,
});
const terrainOverrideStats = countProjectedOverrides({
  overrides: terrainOverrides,
  editorGenerated,
  runtimeGrid: exportedGrid,
  projectionRuntimeGrid: runtimeGrid,
  sourceCrop: editorGenerated.generation?.sourceCrop,
});
const environmentOverrideStats = countProjectedOverrides({
  overrides: environmentOverrides,
  editorGenerated,
  runtimeGrid: exportedGrid,
  projectionRuntimeGrid: runtimeGrid,
  sourceCrop: editorGenerated.generation?.sourceCrop,
});

fs.writeFileSync(outputGridPath, `${JSON.stringify(exportedGrid, null, 2)}\n`, "utf8");
syncMapNodesFromEditorSettlements({
  mapsPath,
  mapId: exportedGrid.mapId,
  editorPackageLabel,
  settlements: settlementAnchors,
  runtimeGrid: exportedGrid,
  projectionRuntimeGrid: runtimeGrid,
  sourceCrop: editorGenerated.generation?.sourceCrop,
});
console.log(`Using editor package: ${editorPackageLabel}`);
console.log(formatOverrideStats("water-land overrides", waterLandOverrideStats));
console.log(formatOverrideStats("terrain overrides", terrainOverrideStats));
console.log(formatOverrideStats("environment overrides", environmentOverrideStats));
console.log(
  `Wrote ${path.relative(repoRoot, outputGridPath)}: ${exportedGrid.counts.cells} runtime cells, ` +
    `${exportedGrid.source.editorOverlay.editorCellsApplied} editor samples applied, ` +
    `${exportedGrid.source.editorOverlay.runtimeCellsChanged} runtime cells changed.`
);

function parseCliOptions(argv) {
  const options = {
    input: "map2",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--input") {
      const value = argv[index + 1];
      if (value == null || value.startsWith("--")) {
        throw new Error("Missing value for --input.");
      }
      options.input = value;
      index += 1;
      continue;
    }
    if (argument.startsWith("--input=")) {
      options.input = argument.slice("--input=".length);
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  return options;
}

function resolveEditorPackageDir(input) {
  const resolved = path.resolve(repoRoot, input);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`Editor package directory does not exist: ${input}`);
  }
  return resolved;
}

function formatRepoPath(filePath) {
  const relativePath = path.relative(repoRoot, filePath);
  return relativePath.length === 0 ? "." : relativePath;
}

function formatOverrideStats(label, stats) {
  return `${label}: read ${stats.read}, applied ${stats.applied}, skipped ${stats.skipped}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function withResampledEditorHeights(editorGenerated, heightImagePath) {
  const heightRaster = PNG.sync.read(fs.readFileSync(heightImagePath));
  const coordinateSpace = editorGenerated.coordinateSystem?.coordinateSpace ?? {
    width: 509,
    height: 451,
  };

  return {
    ...editorGenerated,
    cells: editorGenerated.cells.map((cell) => {
      if (!cell.land || cell.sourcePosition == null) {
        return {
          ...cell,
          referenceHeight: 0,
        };
      }

      return {
        ...cell,
        referenceHeight: sampleHeightAtSourcePosition(
          heightRaster,
          cell.sourcePosition,
          coordinateSpace
        ),
      };
    }),
  };
}

function sampleHeightAtSourcePosition(raster, position, coordinateSpace) {
  const pixelX = Math.min(
    raster.width - 1,
    Math.max(0, Math.round((position.x / Math.max(coordinateSpace.width, 1)) * (raster.width - 1)))
  );
  const pixelY = Math.min(
    raster.height - 1,
    Math.max(0, Math.round((position.y / Math.max(coordinateSpace.height, 1)) * (raster.height - 1)))
  );
  const index = (pixelY * raster.width + pixelX) * 4;
  const red = raster.data[index] ?? 0;
  const green = raster.data[index + 1] ?? 0;
  const blue = raster.data[index + 2] ?? 0;
  return Number(((red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255).toFixed(6));
}

function readOptionalJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return readJson(filePath);
}

function countProjectedOverrides(input) {
  const editorCellsByKey = new Map(
    input.editorGenerated.cells.map((cell) => [getCampaignHexCellKey(cell.x, cell.y), cell])
  );
  const runtimeCellsByKey = new Set(
    input.runtimeGrid.cells.map((cell) => getCampaignHexCellKey(cell.x, cell.y))
  );
  let applied = 0;
  let skipped = 0;

  for (const override of input.overrides) {
    const editorCell = editorCellsByKey.get(getCampaignHexCellKey(override.x, override.y));
    if (editorCell?.sourcePosition == null) {
      skipped += 1;
      continue;
    }

    const runtimeHex = mapEditorSourcePositionToOneToOneRuntimeHex(
      editorCell.sourcePosition,
      input.editorGenerated
    );
    if (runtimeHex != null && runtimeCellsByKey.has(getCampaignHexCellKey(runtimeHex.x, runtimeHex.y))) {
      applied += 1;
    } else {
      skipped += 1;
    }
  }

  return {
    read: input.overrides.length,
    applied,
    skipped,
  };
}

function syncMapNodesFromEditorSettlements(input) {
  if (input.settlements.length === 0 || input.sourceCrop == null) {
    return;
  }

  const maps = readJson(input.mapsPath);
  const mapDefinition = maps.find((map) => map.id === input.mapId);
  if (mapDefinition == null || !Array.isArray(mapDefinition.nodes)) {
    return;
  }

  const previousNodeById = new Map(
    mapDefinition.nodes
      .filter((node) => typeof node.id === "string")
      .map((node) => [node.id, node])
  );
  const uniqueSettlements = [];
  const seenSettlementIds = new Set();
  for (const settlement of input.settlements) {
    if (typeof settlement.id !== "string" || seenSettlementIds.has(settlement.id)) {
      continue;
    }
    seenSettlementIds.add(settlement.id);
    uniqueSettlements.push(settlement);
  }

  mapDefinition.nodes = uniqueSettlements.map((settlement) => {
    const previousNode = previousNodeById.get(settlement.id);
    const runtimeHex = mapEditorGameCoordinateToOneToOneRuntimeHex(
      settlement.mapPosition,
      editorGenerated,
      input.projectionRuntimeGrid ?? input.runtimeGrid
    );
    const coordinate = mapRuntimeHexToGameCoordinate(
      runtimeHex,
      input.runtimeGrid.coordinateSystem.coordinateSpace,
      input.runtimeGrid.coordinateSystem
    );

    return {
      id: settlement.id,
      label: settlement.name,
      x: coordinate.x,
      y: coordinate.y,
      kind: getMapNodeKindForSettlementType(settlement.type),
      ...(previousNode?.summary == null ? {} : { summary: previousNode.summary }),
    };
  });

  const haozhouNode = mapDefinition.nodes.find((node) => node.id === "settlement.fenyang_province");
  if (haozhouNode != null) {
    mapDefinition.initialPlayerCoordinate = {
      x: haozhouNode.x,
      y: haozhouNode.y,
    };
  }
  mapDefinition.stats = {
    ...(mapDefinition.stats ?? {
      regionCount: 0,
      settlementCount: 0,
      fortCount: 0,
      resourceCount: 0,
      resourceSummary: "",
    }),
    settlementCount: mapDefinition.nodes.length,
    fortCount: 0,
    resourceCount: 0,
    resourceSummary: "",
  };

  fs.writeFileSync(input.mapsPath, `${JSON.stringify(maps, null, 2)}\n`, "utf8");
  console.log(`Updated ${path.relative(repoRoot, input.mapsPath)}: rebuilt ${mapDefinition.nodes.length} map nodes from ${input.editorPackageLabel} settlements.`);
}

function getMapNodeKindForSettlementType(type) {
  return type === "city" ? "city" : "settlement";
}

function loadRepoModule(specifier, fromFile = __filename) {
  const resolvedPath = resolveRepoModulePath(specifier, fromFile);
  if (resolvedPath.endsWith(".json")) {
    return readJson(resolvedPath);
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
