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
