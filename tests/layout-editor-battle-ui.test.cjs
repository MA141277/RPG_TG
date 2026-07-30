const assert = require("node:assert/strict");
const fs = require("node:fs");
const { test } = require("node:test");

const read = (path) => fs.readFileSync(path, "utf8");

function getBattleDemoRootVariables(demo) {
  const rootMatch = demo.match(/:root\s*\{([\s\S]*?)\n\s*\}/);
  assert.ok(rootMatch, "battle demo :root block should exist");
  return Object.fromEntries(
    [...rootMatch[1].matchAll(/(--battle-[\w-]+):\s*([^;]+);/g)].map(
      (match) => [match[1], match[2].trim()]
    )
  );
}

function getBattleUiEditorDefaults(source) {
  return Object.fromEntries(
    [
      ...source.matchAll(
        /name:\s*"([^"]+)",[\s\S]*?defaultValue:\s*"([^"]+)"/g
      ),
    ].map((match) => [match[1], match[2]])
  );
}

test("layout editor exposes battle UI target and persistent variable state", () => {
  const uiLayout = read("src/domain/ui-layout.ts");
  const presets = read("src/content/layout-editor-presets.ts");
  const registry = read("src/application/layout-editor/layout-editor-target-registry.ts");
  const actions = read("src/application/layout-editor/layout-editor-actions.ts");
  const view = read("src/ui/tools/layout-editor-view.ts");
  const main = read("src/main.ts");

  assert.match(uiLayout, /\|\s*"battle-ui-screen"/);
  assert.match(uiLayout, /battleUiValues:\s*BattleUiEditorValues;/);
  assert.match(presets, /function createDefaultBattleUiScreenLayout\(\)/);
  assert.match(registry, /id:\s*"battle-ui-screen"/);
  assert.match(registry, /label:\s*"战斗界面调整"/);
  assert.match(actions, /function setLayoutEditorBattleUiValue\(/);
  assert.match(view, /function renderBattleUiEditorSection\(/);
  assert.match(view, /data-battle-ui-var/);
  assert.match(main, /BATTLE_UI_EDITOR_STORAGE_KEY/);
  assert.match(main, /function syncEmbeddedBattleUiEditor\(/);
  assert.match(main, /type:\s*"rpg-tg:battle-ui-config"/);
});

test("battle UI editor defaults match the embedded battle demo root variables", () => {
  const demoVars = getBattleDemoRootVariables(
    read("prototypes/battle-demo/index.html")
  );
  const editorDefaults = getBattleUiEditorDefaults(
    read("src/domain/battle-ui-editor.ts")
  );

  for (const [name, value] of Object.entries(editorDefaults)) {
    assert.equal(value, demoVars[name], `${name} default should match demo CSS`);
  }
});

test("battle UI persistence normalizes legacy persisted defaults", () => {
  const main = read("src/main.ts");

  assert.match(main, /const LEGACY_BATTLE_UI_EDITOR_VALUE_FIXES/);
  assert.match(
    main,
    /"--battle-action-menu-width":\s*\{[\s\S]*?oldValue:\s*"29\.75%"[\s\S]*?newValue:\s*"6\.75%"[\s\S]*?\}/
  );
  assert.match(
    main,
    /"--battle-action-menu-height":\s*\{[\s\S]*?oldValue:\s*"26\.85%"[\s\S]*?newValue:\s*"17\.7%"[\s\S]*?\}/
  );
  assert.match(main, /function normalizePersistedBattleUiEditorValue\(/);
  assert.match(
    main,
    /normalizePersistedBattleUiEditorValue\(definition\.name, value\)/
  );
});

test("battle demo right corner button labels stay inside their image frames", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.match(demo, /--battle-controls-button-height:\s*4\.9479%;/);
  assert.match(demo, /--battle-start-left:\s*83\.3008%;/);
  assert.match(demo, /--battle-start-top:\s*94\.4444%;/);
  assert.match(demo, /--battle-start-width:\s*7\.9102%;/);
  assert.match(demo, /--battle-end-turn-left:\s*91\.8945%;/);
  assert.match(demo, /--battle-end-turn-top:\s*94\.4444%;/);
  assert.match(demo, /--battle-end-turn-width:\s*7\.9102%;/);
  assert.match(
    demo,
    /\.battle-stage #btn-start,\s*\n\s*\.battle-stage #btn-end-turn\s*\{[\s\S]*?height:\s*var\(--battle-controls-button-height\);[\s\S]*?align-items:\s*center;[\s\S]*?justify-content:\s*center;/
  );
  assert.match(
    demo,
    /\.battle-stage #btn-start\s*\{[\s\S]*?left:\s*var\(--battle-start-left\);[\s\S]*?top:\s*var\(--battle-start-top\);[\s\S]*?width:\s*var\(--battle-start-width\);/
  );
  assert.match(
    demo,
    /\.battle-stage #btn-end-turn\s*\{[\s\S]*?left:\s*var\(--battle-end-turn-left\);[\s\S]*?top:\s*var\(--battle-end-turn-top\);[\s\S]*?width:\s*var\(--battle-end-turn-width\);/
  );
});

test("battle demo text overlays use readable high-contrast typography", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.match(demo, /--battle-header-row-font-size:\s*0\.78rem;/);
  assert.match(demo, /--battle-objective-font-size:\s*0\.68rem;/);
  assert.match(demo, /--battle-top-side-font-size:\s*0\.66rem;/);
  assert.match(demo, /--battle-unit-name-font-size:\s*0\.92rem;/);
  assert.match(demo, /\.battle-stage header\s*\{[\s\S]*?color:\s*#f2dfad;/);
  assert.match(demo, /\.battle-stage \.phase-badge\s*\{[\s\S]*?color:\s*#f4d99a;[\s\S]*?font-size:\s*0\.72rem;/);
  assert.match(demo, /\.battle-stage #turn-info\s*\{[\s\S]*?color:\s*#f4d99a;[\s\S]*?font-size:\s*0\.72rem;/);
  assert.match(demo, /\.top-side-info\s*\{[\s\S]*?font-size:\s*var\(--battle-top-side-font-size\);[\s\S]*?color:\s*#e9d19a;/);
  assert.match(demo, /\.battle-stage \.unit-summary\s*\{[\s\S]*?color:\s*#f2dfad;[\s\S]*?font-size:\s*0\.64rem;[\s\S]*?line-height:\s*1\.34;/);
  assert.match(demo, /\.battle-stage \.unit-summary \.muted\s*\{[\s\S]*?color:\s*#d8bf85;[\s\S]*?font-size:\s*0\.56rem;[\s\S]*?line-height:\s*1\.32;/);
  assert.match(demo, /\.battle-stage \.battle-log-panel h3\s*\{[\s\S]*?color:\s*#f2dfad;[\s\S]*?font-size:\s*0\.76rem;/);
  assert.match(demo, /\.battle-log-scroll\s*\{[\s\S]*?color:\s*#f1dfad;[\s\S]*?font-size:\s*0\.62rem;[\s\S]*?line-height:\s*1\.58;/);
});

test("battle demo left panel overlay stays below flag decorations", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.match(demo, /\.battle-ui-overlays img\s*\{[\s\S]*?z-index:\s*1;/);
  assert.match(demo, /\.battle-ui-overlays \.battle-ui-overlay-left-panel\s*\{[\s\S]*?z-index:\s*0;/);
  assert.match(
    demo,
    /<img\s+class="battle-ui-overlay-left-panel"\s+src="\.\.\/\.\.\/ui\/battle\/战斗\/20260702-195702\.png"\s+alt="">/
  );
});

test("battle demo omits card deployment frame overlay when cards are not deployed", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.doesNotMatch(
    demo,
    /img_v3_02137_c83b7d73-03ae-4c9f-88dd-36c12f66f68g\.png/
  );
});

test("battle demo formation panel starts below enlarged unit summary", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.match(demo, /--battle-unit-card-translate-y:\s*-24px;/);
  assert.match(demo, /--battle-formation-panel-padding-top:\s*calc\(14\.8% \+ 15px\);/);
  assert.match(demo, /\.battle-stage \.unit-formation-panel \.panel-title\s*\{[\s\S]*?color:\s*#f2dfad;[\s\S]*?text-shadow:\s*0 1px 2px rgba\(0,\s*0,\s*0,\s*0\.72\);/);
});

test("battle demo left command text stays inside its container", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.match(demo, /\.battle-stage \.command-panel\s*\{[\s\S]*?overflow:\s*hidden;/);
  assert.match(demo, /\.battle-stage \.unit-card-body\s*\{[\s\S]*?overflow:\s*hidden;/);
  assert.match(demo, /\.battle-stage \.unit-summary\s*\{[\s\S]*?max-width:\s*100%;[\s\S]*?overflow:\s*hidden;/);
  assert.match(demo, /\.battle-stage \.unit-summary-header\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?overflow:\s*hidden;/);
  assert.match(demo, /\.battle-stage \.unit-summary \.name\s*\{[\s\S]*?overflow:\s*hidden;[\s\S]*?overflow-wrap:\s*anywhere;/);
  assert.match(demo, /\.battle-stage \.unit-stat-row\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*var\(--battle-unit-stat-label-width\) minmax\(0,\s*1fr\);[\s\S]*?overflow:\s*hidden;/);
  assert.match(demo, /\.battle-stage \.unit-stat-row strong\s*\{[\s\S]*?overflow:\s*hidden;[\s\S]*?overflow-wrap:\s*anywhere;/);
});

test("battle demo battle log text is constrained to the log frame image", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.match(demo, /--battle-right-panel-left:\s*0\.0488%;/);
  assert.match(demo, /--battle-right-panel-top:\s*71\.875%;/);
  assert.match(demo, /--battle-right-panel-width:\s*21\.1914%;/);
  assert.match(demo, /--battle-right-panel-height:\s*28\.125%;/);
  assert.match(demo, /<img\s+class="battle-ui-overlay-log-panel"\s+src="\.\.\/\.\.\/ui\/battle\/战斗\/20260702-195648\.png"\s+alt="">/);
  assert.match(demo, /\.battle-log-scroll\s*\{[\s\S]*?overflow-y:\s*auto;[\s\S]*?overflow-x:\s*hidden;[\s\S]*?overflow-wrap:\s*anywhere;/);
  assert.match(demo, /\.battle-log-scroll\s*\{[\s\S]*?scrollbar-width:\s*thin;[\s\S]*?scrollbar-color:\s*#f6dfa2 rgba\(246,\s*223,\s*162,\s*0\.18\);/);
  assert.match(demo, /\.battle-log-scroll::-webkit-scrollbar\s*\{\s*width:\s*3px;\s*\}/);
  assert.match(demo, /\.battle-log-scroll::-webkit-scrollbar-track\s*\{\s*background:\s*rgba\(246,\s*223,\s*162,\s*0\.18\);\s*\}/);
  assert.match(demo, /\.battle-log-scroll::-webkit-scrollbar-thumb\s*\{[\s\S]*?background:\s*#f6dfa2;[\s\S]*?border-radius:\s*999px;/);
  assert.match(demo, /\.battle-stage \.log-panel\s*\{[\s\S]*?max-width:\s*100%;[\s\S]*?overflow:\s*hidden;/);
  assert.match(demo, /\.battle-stage \.morale-log-panel\s*\{[\s\S]*?max-width:\s*100%;[\s\S]*?overflow:\s*hidden;/);
});

test("battle demo objective intro popup uses a 60 percent nine-slice frame", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.match(demo, /--battle-objective-intro-scale:\s*0\.6;/);
  assert.match(demo, /--battle-objective-intro-min-width:\s*312px;/);
  assert.match(demo, /--battle-objective-intro-max-vw:\s*43\.2vw;/);
  assert.match(demo, /--battle-objective-intro-max-width:\s*492px;/);
  assert.match(demo, /--battle-objective-intro-min-height:\s*156px;/);
  assert.match(demo, /--battle-objective-intro-max-vh:\s*42vh;/);
  assert.match(demo, /--battle-objective-intro-max-height:\s*312px;/);
  assert.match(demo, /--battle-objective-intro-border-y:\s*28\.8px;/);
  assert.match(demo, /--battle-objective-intro-border-x:\s*25\.2px;/);
  assert.match(
    demo,
    /\.objective-intro-box\s*\{[\s\S]*?min-width:\s*min\(var\(--battle-objective-intro-min-width\),\s*calc\(100vw - 48px\)\);[\s\S]*?max-width:\s*min\(var\(--battle-objective-intro-max-vw\),\s*var\(--battle-objective-intro-max-width\)\);[\s\S]*?min-height:\s*var\(--battle-objective-intro-min-height\);[\s\S]*?max-height:\s*min\(var\(--battle-objective-intro-max-vh\),\s*var\(--battle-objective-intro-max-height\)\);/
  );
  assert.match(
    demo,
    /\.objective-intro-box\s*\{[\s\S]*?border:\s*var\(--battle-objective-intro-border-y\) solid transparent;[\s\S]*?border-left-width:\s*var\(--battle-objective-intro-border-x\);[\s\S]*?border-right-width:\s*var\(--battle-objective-intro-border-x\);[\s\S]*?border-image-source:\s*var\(--battle-popup-frame\);[\s\S]*?border-image-slice:\s*54 42 54 42 fill;[\s\S]*?border-image-width:\s*var\(--battle-objective-intro-border-y\) var\(--battle-objective-intro-border-x\);/
  );
  assert.doesNotMatch(
    demo,
    /\.objective-intro-box\s*\{[\s\S]*?max-width:\s*none;/
  );
  assert.match(
    demo,
    /\.objective-intro-box h2\s*\{[\s\S]*?max-width:\s*min\(52vw,\s*560px\);[\s\S]*?font-size:\s*clamp\(0\.78rem,\s*1\.42vw,\s*1\.08rem\);/
  );
  assert.match(
    demo,
    /\.objective-intro-box p\s*\{[\s\S]*?max-width:\s*min\(52vw,\s*560px\);[\s\S]*?font-size:\s*clamp\(0\.56rem,\s*0\.9vw,\s*0\.76rem\);/
  );
  assert.match(
    demo,
    /\.objective-intro-box #btn-objective-ok\s*\{[\s\S]*?width:\s*min\(20\.4%,\s*157px\);[\s\S]*?max-width:\s*calc\(100% - 40px\);[\s\S]*?min-width:\s*96px;[\s\S]*?transform:\s*translateY\(-15px\);/
  );
});

test("battle demo hides deploy pool when no player units can deploy", () => {
  const demo = read("prototypes/battle-demo/index.html");

  assert.match(demo, /\.battle-stage \.deploy-pool\.hidden\s*\{[\s\S]*?display:\s*none;/);
  assert.match(demo, /const shouldShowDeployPool = phase === 'deploy' && undeployed\.length > 0;/);
  assert.match(demo, /pool\.classList\.toggle\('hidden', !shouldShowDeployPool\);/);
  assert.match(demo, /if \(!shouldShowDeployPool\) return;/);
  assert.doesNotMatch(demo, /部署完成 · 点击开始战斗/);
});
