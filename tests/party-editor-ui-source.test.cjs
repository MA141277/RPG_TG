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

[
  "troop-preview-grid.ts",
  "troop-button-sound-policy.ts",
  "troop-editor-view.ts",
  "troop-management-view.ts",
].forEach(compileTroopEditorModuleForTest);

const {
  renderTroopEditorView,
} = require("../.test-dist/ui/views/troop-editor/troop-editor-view.js");
const {
  renderTroopManagementView,
} = require("../.test-dist/ui/views/troop-editor/troop-management-view.js");

const PREVIEW_SLOTS = [
  "rear-left",
  "middle-left",
  "front-left",
  "rear-center",
  "middle-center",
  "front-center",
  "rear-right",
  "middle-right",
  "front-right",
].map((slotKey) => ({
  slotKey,
  label: slotKey,
  role: null,
  isOccupied: false,
}));

const BATTLEFIELD_SLOTS = PREVIEW_SLOTS.map((slot, index) => ({
  ...slot,
  row: Math.floor(index / 3),
  column: index % 3,
}));

function createTroopEditorHtml() {
  return renderTroopEditorView({
    title: "troop-editor",
    resources: [],
    troops: [
      {
        id: "troop.a",
        name: "Troop A",
        subtitle: "",
        slots: PREVIEW_SLOTS,
      },
    ],
    reserveMembers: [
      { id: "reserve.a", name: "Reserve A", roleLabel: "infantry" },
    ],
    shopOffers: [
      {
        id: "offer.a",
        name: "Offer A",
        roleLabel: "cavalry",
        price: 100,
        priceText: "100",
        requiredFame: 0,
        requiredFameText: "0",
      },
    ],
    menu: [
      { id: "manage", label: "manage", actionId: "open-troop-management" },
      { id: "create", label: "create", actionId: null },
      { id: "exit", label: "exit", actionId: "close-troop-editor" },
    ],
    selectedTroopId: "troop.a",
    selectedMenuId: "manage",
    reserveCount: 1,
    reserveCapacity: 6,
    playerGold: 100,
    playerFame: 0,
  });
}

function createTroopManagementHtml() {
  return renderTroopManagementView({
    title: "troop-management",
    resources: [],
    troops: [
      {
        id: "troop.a",
        name: "Troop A",
        subtitle: "",
        slots: PREVIEW_SLOTS,
      },
    ],
    previousTroopId: "troop.b",
    nextTroopId: "troop.b",
    canCycleTroops: true,
    selectedTroopId: "troop.a",
    troopName: "Troop A",
    previewSlots: PREVIEW_SLOTS,
    actions: [
      { id: "move", label: "move", actionId: null },
      { id: "add", label: "add", actionId: null },
      { id: "remove", label: "remove", actionId: null },
      { id: "clear", label: "clear", actionId: null },
      { id: "disband", label: "disband", actionId: null },
      { id: "back", label: "back", actionId: "close-troop-management" },
    ],
    summaryFields: [],
    battlefieldSlots: BATTLEFIELD_SLOTS,
    battlefieldUnits: [],
    battlePreview: {
      id: "troop.a",
      name: "Troop A",
      side: "player",
      generalName: "General",
      morale: 80,
      members: [],
    },
    reserveMembers: [
      { id: "reserve.a", name: "Reserve A", roleLabel: "infantry" },
    ],
    reserveCapacity: 6,
  });
}

test("map view renders a campaign troop-editor entry button", () => {
  const source = fs.readFileSync("src/ui/views/map/map-view.ts", "utf8");
  assert.match(source, /data-action="open-troop-editor"/);
  assert.match(source, /class="c-map-troop-editor-entry/);
  assert.match(source, />\s*部队\s*</);
});

test("troop-editor view renders the requested layout with scroll list and menu", () => {
  const viewSource = fs.readFileSync(
    "src/ui/views/troop-editor/troop-editor-view.ts",
    "utf8"
  );
  const styleSource = fs.readFileSync("src/styles/views.css", "utf8");
  assert.match(viewSource, /class="view-troop-editor"/);
  assert.match(viewSource, /class="c-troop-editor__resource-bar"/);
  assert.match(viewSource, /class="c-troop-editor__troop-scroll"/);
  assert.match(viewSource, /class="c-troop-editor__menu"/);
  assert.match(viewSource, /button\.actionId == null \? "disabled" : ""/);
  assert.match(viewSource, /data-action="\$\{button\.actionId\}"/);
  assert.doesNotMatch(viewSource, /c-troop-editor__troop-subtitle/);
  assert.match(
    styleSource,
    /\.c-troop-editor__troop-scroll\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/
  );
  assert.match(
    styleSource,
    /\.c-troop-editor__troop-card\s*\{[\s\S]*aspect-ratio:\s*5\s*\/\s*6;/
  );
  assert.match(
    styleSource,
    /\.c-troop-editor__troop-head\s*\{[\s\S]*justify-items:\s*center;/
  );
  assert.match(
    styleSource,
    /\.c-troop-preview-grid__slot\s*\{[\s\S]*width:\s*100%;[\s\S]*aspect-ratio:\s*1\s*\/\s*1;[\s\S]*min-height:\s*0;/
  );
});

test("troop-editor applies heavy only to the manage entry and confirm-side actions", () => {
  const html = createTroopEditorHtml();

  assert.match(
    html,
    /data-action="open-troop-management"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    html,
    /data-action="close-troop-editor"[\s\S]*data-button-sound="light"/
  );
  assert.match(html, /data-troop-editor-card[\s\S]*data-button-sound="light"/);
  assert.match(
    html,
    /data-troop-editor-shop-offer="offer\.a"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-shop-prompt-action="buy"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    html,
    /data-troop-editor-shop-prompt-action="cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-shop-back[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-create-choice="confirm"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    html,
    /data-troop-editor-create-choice="cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-dismiss-member="reserve\.a"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-dismiss-prompt-action="dismiss"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    html,
    /data-troop-editor-dismiss-prompt-action="back"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-dismiss-close[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-dismiss-confirm-choice="confirm"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    html,
    /data-troop-editor-dismiss-confirm-choice="cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-confirm-choice="confirm"[\s\S]*data-button-sound="heavy"/
  );
  assert.match(
    html,
    /data-troop-editor-confirm-choice="cancel"[\s\S]*data-button-sound="light"/
  );
  assert.match(
    html,
    /data-troop-editor-alert-close[\s\S]*data-button-sound="light"/
  );
});

test(
  "troop-management keeps browsing light, keeps reserve assign heavy, and leaves remove confirm silent by default",
  () => {
    const html = createTroopManagementHtml();

    assert.match(
      html,
      /data-action="open-troop-management"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /c-troop-management__cycle-button--left[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /c-troop-management__cycle-button--right[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-action="move"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-action="add"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-action="remove"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-action="clear"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-action="disband"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-action="close-troop-management"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-reserve-member="reserve\.a"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-reserve-prompt-action="assign"[\s\S]*data-button-sound="heavy"/
    );
    assert.match(
      html,
      /data-troop-management-reserve-prompt-action="back"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-reserve-close[\s\S]*data-button-sound="light"/
    );
    assert.doesNotMatch(
      html,
      /<button[^>]*data-troop-management-remove-confirm-choice="confirm"[^>]*data-button-sound=/
    );
    assert.match(
      html,
      /data-troop-management-remove-confirm-choice="cancel"[\s\S]*data-button-sound="light"/
    );
    assert.match(
      html,
      /data-troop-management-alert-close[\s\S]*data-button-sound="light"/
    );
  }
);

test("troop-management view renders battle workspace, preview, actions and summary", () => {
  const viewSource = fs.readFileSync(
    "src/ui/views/troop-editor/troop-management-view.ts",
    "utf8"
  );
  const styleSource = fs.readFileSync("src/styles/views.css", "utf8");
  assert.match(viewSource, /class="view-troop-management"/);
  assert.match(viewSource, /class="c-troop-management__battlefield"/);
  assert.match(viewSource, /class="c-troop-management__action-list"/);
  assert.match(
    viewSource,
    /action\.actionId == null \? "" : `data-action="\$\{action\.actionId\}"`/
  );
  assert.match(viewSource, /class="c-troop-management__summary-grid"/);
  assert.match(
    styleSource,
    /\.c-troop-management__battle-slot\s*\{[\s\S]*--slot-row/
  );
  assert.match(
    styleSource,
    /\.c-troop-management__cycle-button--left\s*\{[\s\S]*clip-path:/
  );
});

test("shared troop preview seam is available for battle and troop editor consumers", () => {
  const selectorSource = fs.readFileSync(
    "src/application/troop-editor/troop-editor-selectors.ts",
    "utf8"
  );
  const source = fs.readFileSync("src/ui/app-render.ts", "utf8");
  const battleViewSource = fs.readFileSync(
    "src/ui/views/battle/story-battle-view.ts",
    "utf8"
  );
  assert.match(selectorSource, /export function selectPlayerTroopSnapshots\(/);
  assert.match(source, /createBattleTroopPreviewViewModel\(/);
  assert.match(
    source,
    /renderStoryBattleView\(input\.appState\.gameState\.storyBattle,\s*\{\s*formationPreview:/
  );
  assert.match(
    battleViewSource,
    /options: \{ formationPreview\?: BattleFormationPreviewViewModel \| null \} = \{\}/
  );
});

test("main wires the troop-editor entry and exit actions", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");
  assert.match(source, /\[data-action='open-troop-editor'\]/);
  assert.match(source, /appState = openTroopEditor\(appState\);/);
  assert.match(source, /\[data-action='close-troop-editor'\]/);
  assert.match(source, /appState = closeTroopEditor\(appState\);/);
  assert.match(source, /\[data-action='open-troop-management'\]/);
  assert.match(
    source,
    /appState = openTroopManagement\(appState,\s*\{\s*troopId:/
  );
  assert.match(source, /\[data-action='close-troop-management'\]/);
  assert.match(source, /appState = closeTroopManagement\(appState\);/);
});
