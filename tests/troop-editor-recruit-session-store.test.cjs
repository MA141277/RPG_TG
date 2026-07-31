const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const TROOP_EDITOR_TEST_DIST = path.join(
  ".test-dist",
  "ui",
  "views",
  "troop-editor"
);

function compileTroopEditorModuleForTest(fileName) {
  const sourcePath = path.join("src", "ui", "views", "troop-editor", fileName);
  const outputPath = path.join(
    TROOP_EDITOR_TEST_DIST,
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

  fs.mkdirSync(TROOP_EDITOR_TEST_DIST, { recursive: true });
  fs.writeFileSync(outputPath, outputText);
}

test("troop editor recruit session store restores the buy prompt after re-render when the offer still exists", () => {
  compileTroopEditorModuleForTest("troop-editor-recruit-session-store.ts");
  const {
    createTroopEditorRecruitSessionStore,
  } = require("../.test-dist/ui/views/troop-editor/troop-editor-recruit-session-store.js");

  const store = createTroopEditorRecruitSessionStore();
  store.remember({
    mode: "recruit-menu",
    selectedRecruitOfferId: "offer.spearman",
  });

  assert.deepEqual(store.consume(["offer.spearman", "offer.archer"]), {
    mode: "recruit-menu",
    selectedOfferId: "offer.spearman",
  });
  assert.equal(store.consume(["offer.spearman"]), null);
});

test("troop editor recruit session store falls back to the recruit list when the selected offer disappears", () => {
  compileTroopEditorModuleForTest("troop-editor-recruit-session-store.ts");
  const {
    createTroopEditorRecruitSessionStore,
  } = require("../.test-dist/ui/views/troop-editor/troop-editor-recruit-session-store.js");

  const store = createTroopEditorRecruitSessionStore();
  store.remember({
    mode: "recruit-menu",
    selectedRecruitOfferId: "offer.spearman",
  });

  assert.deepEqual(store.consume(["offer.archer"]), {
    mode: "recruit-list",
    selectedOfferId: null,
  });

  store.remember({
    mode: "idle",
    selectedRecruitOfferId: null,
  });
  assert.equal(store.consume(["offer.archer"]), null);
});

test("troop editor interactions restore and persist recruit session state", () => {
  const source = fs.readFileSync(
    "src/ui/views/troop-editor/troop-editor-interactions.ts",
    "utf8"
  );

  assert.match(source, /troopEditorRecruitSessionStore\.consume\(/);
  assert.match(
    source,
    /state\.mode = restoredRecruitSession\.mode;[\s\S]*state\.selectedRecruitOfferId = restoredRecruitSession\.selectedOfferId;/
  );
  assert.match(source, /troopEditorRecruitSessionStore\.remember\(\{/);
});
