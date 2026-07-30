const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("city begging entry is a top-level city menu button, not a location subnav item", () => {
  const source = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const subnavStart = source.indexOf("function renderCityLocationSubnav");
  const menuStart = source.indexOf("function renderCityMenuButtons");

  assert.notEqual(subnavStart, -1, "Expected renderCityLocationSubnav source.");
  assert.notEqual(menuStart, -1, "Expected renderCityMenuButtons source.");
  assert.ok(menuStart > subnavStart, "Expected subnav before menu buttons.");
  assert.doesNotMatch(source.slice(subnavStart, menuStart), /start-aibegging/);
  assert.match(source, /\{ id: "begging", label:/);
  assert.match(source, /data-action="start-aibegging"/);
  assert.doesNotMatch(source, /data-action="start-city-begging-default"/);
  assert.doesNotMatch(source, /data-action="start-begging-minigame"/);
});

test("city menu buttons keep pointer interaction enabled", () => {
  const source = fs.readFileSync("src/styles/prototype.css", "utf8");
  const appStyles = fs.readFileSync("src/styles/app.css", "utf8");

  assert.match(source, /\.c-city-menu\s*\{[\s\S]*pointer-events:\s*auto;/);
  assert.match(source, /\.c-city-menu__button\s*\{[\s\S]*pointer-events:\s*auto;/);
  assert.match(source, /\.c-city-menu__item\s*\{[\s\S]*pointer-events:\s*auto;/);
  assert.match(
    appStyles,
    /\.l-shell--prototype > \.c-city-begging-default\s*\{[\s\S]*position:\s*absolute;/
  );
  assert.match(
    appStyles,
    /--grain-shop-shopkeeper-portrait:\s*url\("\.\.\/\.\.\/ui\/user\/20\.png"\)/
  );
  assert.match(
    appStyles,
    /--grain-shop-shopkeeper-avatar:\s*url\("\.\.\/\.\.\/ui\/user\/20 - touxiang\.png"\)/
  );
});

test("city begging default dialogue uses scene choices and hides fixed fortune before draw", () => {
  const source = fs.readFileSync(
    "src/ui/views/minigames/city-begging-default-dialogue-view.ts",
    "utf8"
  );

  assert.match(source, /c-grain-shop-center c-grain-shop-center--open/);
  assert.match(source, /c-grain-shop-actions c-city-begging-default__choices/);
  assert.match(source, /c-button c-grain-shop-button c-grain-shop-button--paper/);
  assert.match(source, /data-scene-action="advance"/);
  assert.match(source, /data-scene-choice-id=/);
  assert.match(source, /location-options-thinking/);
  assert.match(source, /option-select-thinking/);
  assert.match(source, /renderThinking\(\)/);
  assert.match(source, /getNpcPortraitClassName\(location\.npc\.id\)/);
  assert.match(source, /c-city-begging-default__portrait--/);
  assert.doesNotMatch(source, /advance-city-begging-dialogue/);
  assert.doesNotMatch(source, /select-city-begging-location/);
  assert.doesNotMatch(source, /select-city-begging-option/);
  assert.doesNotMatch(source, /c-city-directory__option/);
  assert.doesNotMatch(source, /c-city-directory__list/);
  assert.doesNotMatch(source, /baselineResult/);
  assert.doesNotMatch(source, /fixedResult\)\)/);
});

test("ai begging dialogue renders as a shell overlay and does not use minigame hud suppression", () => {
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");
  const stageStart = appRenderSource.indexOf('<main class="l-stage">');
  const stageEnd = appRenderSource.indexOf("</main>", stageStart);
  const outsideStageStart = appRenderSource.indexOf("${renderNpcInteractionOverlay(input)}");
  const defaultOverlayIndex = appRenderSource.indexOf(
    "${renderCityBeggingDefaultDialogueOverlay(input.appState.beggingMiniGameState)}"
  );

  assert.notEqual(stageStart, -1, "Expected l-stage markup.");
  assert.notEqual(stageEnd, -1, "Expected l-stage closing markup.");
  assert.notEqual(outsideStageStart, -1, "Expected shell overlay markup.");
  assert.notEqual(defaultOverlayIndex, -1, "Expected ai begging overlay markup.");
  assert.doesNotMatch(
    appRenderSource.slice(stageStart, stageEnd),
    /renderCityBeggingDefaultDialogueOverlay/
  );
  assert.ok(
    defaultOverlayIndex > stageEnd && defaultOverlayIndex < outsideStageStart,
    "Expected ai begging overlay after l-stage and before generic shell overlays."
  );
  assert.doesNotMatch(
    appRenderSource.slice(outsideStageStart),
    /renderCityBeggingDefaultDialogueOverlay/
  );

  const overlayPresenterSource = fs.readFileSync(
    "src/application/presenter/overlay-presenters.ts",
    "utf8"
  );
  assert.match(overlayPresenterSource, /"variantId" in input\.appState\.beggingMiniGameState/);
});

test("city begging default dialogue maps NPC speakers to distinct portrait assets", () => {
  const appStyles = fs.readFileSync("src/styles/app.css", "utf8");

  assert.match(
    appStyles,
    /\.c-city-begging-default__portrait--haozhou_grain_merchant\s*\{[\s\S]*background-image:\s*url\("\.\.\/\.\.\/ui\/npc\/gudongshang\.png"\);/
  );
  assert.match(
    appStyles,
    /\.c-city-begging-default__portrait--haozhou_fisher_old_man\s*\{[\s\S]*background-image:\s*url\("\.\.\/\.\.\/ui\/npc\/elder\.png"\);/
  );
  assert.match(
    appStyles,
    /\.c-city-begging-default__portrait--haozhou_ciji_jinghui\s*\{[\s\S]*background-image:\s*url\("\.\.\/\.\.\/ui\/npc\/genv\.png"\);/
  );
});
