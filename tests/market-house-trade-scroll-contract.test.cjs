const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const SCROLL_RUNTIME_TEST_DIST = path.join(".test-dist", "ui", "runtime");

function compileRuntimeModuleForTest(fileName) {
  const sourcePath = path.join("src", "ui", "runtime", fileName);
  const outputPath = path.join(
    SCROLL_RUNTIME_TEST_DIST,
    fileName.replace(/\.ts$/, ".js")
  );
  const source = fs.readFileSync(sourcePath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      verbatimModuleSyntax: false,
    },
    fileName: sourcePath,
  });

  fs.mkdirSync(SCROLL_RUNTIME_TEST_DIST, { recursive: true });
  fs.writeFileSync(outputPath, outputText);
}

test("market house trade view declares a preserved scroll key for the goods list", () => {
  const source = fs.readFileSync(
    "src/ui/views/house/market-house-view.ts",
    "utf8"
  );

  assert.match(source, /data-preserve-scroll-key="house\.market-trade\.rows"/);
});

test("declared scroll restoration keeps matching scroll positions across rerender", () => {
  const runtimeModulePath = path.join(
    "src",
    "ui",
    "runtime",
    "declared-scroll-restoration.ts"
  );

  assert.ok(
    fs.existsSync(runtimeModulePath),
    "Expected a declared scroll restoration runtime module."
  );

  compileRuntimeModuleForTest("declared-scroll-restoration.ts");
  const {
    DeclaredScrollRestoration,
  } = require("../.test-dist/ui/runtime/declared-scroll-restoration.js");

  const restoration = new DeclaredScrollRestoration();
  const previousGoodsList = {
    dataset: { preserveScrollKey: "house.market-trade.rows" },
    scrollTop: 184,
    scrollLeft: 12,
  };
  const previousOtherList = {
    dataset: { preserveScrollKey: "house.unrelated.rows" },
    scrollTop: 36,
    scrollLeft: 4,
  };
  const nextGoodsList = {
    dataset: { preserveScrollKey: "house.market-trade.rows" },
    scrollTop: 0,
    scrollLeft: 0,
  };

  const previousRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "[data-preserve-scroll-key]");
      return [previousGoodsList, previousOtherList];
    },
  };
  const nextRoot = {
    querySelectorAll(selector) {
      assert.equal(selector, "[data-preserve-scroll-key]");
      return [nextGoodsList];
    },
  };

  const snapshot = restoration.capture(previousRoot);
  restoration.restore(nextRoot, snapshot);

  assert.equal(nextGoodsList.scrollTop, 184);
  assert.equal(nextGoodsList.scrollLeft, 12);
});

test("main render pipeline wires declared scroll restoration around full rerenders", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.match(source, /declaredScrollRestoration\.capture\(appRoot\)/);
  assert.match(
    source,
    /declaredScrollRestoration\.restore\(appRoot,\s*preservedDeclaredScrollState\)/
  );
});
