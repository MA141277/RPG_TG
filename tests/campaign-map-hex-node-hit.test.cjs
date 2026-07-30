const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const repoRoot = path.resolve(__dirname, "..");
const transpiledModuleCache = new Map();

function loadRepoModule(specifier, fromFile = __filename) {
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

test("campaign hex click resolves the city node occupying the same highlighted hex", () => {
  const { resolveCampaignMapNodeAtCoordinate } = loadRepoModule(
    "../src/application/map/campaign-map-node-hit"
  );
  const campaignMap = loadRepoModule(
    "../src/content/scenario-packs/zhuyuanzhang/maps.json"
  ).find((map) => map.id === "map.yuanmo_campaign");

  const resolvedNode = resolveCampaignMapNodeAtCoordinate({
    mapDefinition: campaignMap,
    coordinate: { x: 240.13892857142858, y: 280.7475 },
    coordinateSystem: map3CoordinateSystem,
  });

  assert.equal(resolvedNode?.id, "settlement.huangcun");
  assert.equal(resolvedNode?.cityId, "city.huangcun");
});
