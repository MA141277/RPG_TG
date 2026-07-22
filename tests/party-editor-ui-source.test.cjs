const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

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
  assert.match(viewSource, /data-action="open-troop-management"/);
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
    /\.c-troop-management__pager--left\s*\{[\s\S]*clip-path:/
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
  assert.match(source, /appState = openTroopManagement\(appState\);/);
  assert.match(source, /\[data-action='close-troop-management'\]/);
  assert.match(source, /appState = closeTroopManagement\(appState\);/);
});
