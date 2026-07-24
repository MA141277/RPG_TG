const assert = require("node:assert/strict");
const fs = require("node:fs");
const { test } = require("node:test");

const read = (path) => fs.readFileSync(path, "utf8");

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

test("battle UI editor defaults preserve the prototype action menu size", () => {
  const battleUiEditor = read("src/domain/battle-ui-editor.ts");
  const battlePrototype = read("prototypes/battle-demo/index.html");

  assert.match(
    battlePrototype,
    /--battle-action-menu-width:\s*6\.75%;/
  );
  assert.match(
    battlePrototype,
    /--battle-action-menu-height:\s*17\.7%;/
  );
  assert.match(
    battleUiEditor,
    /name:\s*"--battle-action-menu-width"[\s\S]*?defaultValue:\s*"6\.75%"/
  );
  assert.match(
    battleUiEditor,
    /name:\s*"--battle-action-menu-height"[\s\S]*?defaultValue:\s*"17\.7%"/
  );
});

test("battle UI persistence normalizes the legacy stretched action menu defaults", () => {
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
  assert.match(main, /normalizePersistedBattleUiEditorValue\(definition\.name, value\)/);
});
