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
  assert.match(source, /data-scene-action="continue-journey"/);
  assert.match(source, /data-scene-choice-id=/);
  const outcomeStart = source.indexOf("function renderOutcome");
  assert.notEqual(outcomeStart, -1, "Expected renderOutcome source.");
  const outcomeSource = source.slice(outcomeStart);
  assert.ok(
    outcomeSource.indexOf('data-scene-action="continue-journey"') <
      outcomeSource.indexOf('data-scene-action="advance"'),
    "Expected continue journey before the final accept-outcome action in source."
  );
  assert.match(source, /visitedLocationIds\.includes\(location\.locationId\)/);
  assert.match(source, /filter\(/);
  assert.doesNotMatch(source, /visited\s\?\s*"disabled"/);
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

test("city begging default completion refuses relaunch with player dialogue", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  const textEntries = JSON.parse(
    fs.readFileSync(
      "src/content/scenario-packs/zhuyuanzhang/text-entries.json",
      "utf8"
    )
  );

  assert.match(mainSource, /flag\.city_begging\.default\.completed/);
  assert.match(mainSource, /speakerCharacterId:\s*currentPlayerCharacterId/);
  assert.match(
    mainSource,
    /runtime\.city_begging\.default\.completed_refusal\.001/
  );
  assert.equal(
    textEntries["runtime.city_begging.default.completed_refusal.001"],
    "\u8fd9\u5ea7\u57ce\u5e02\u90fd\u901b\u904d\u4e86\uff0c\u56de\u5bfa\u5e99\u4f11\u606f\u7b49\u5019\u8bc4\u5b9a\u5427\u3002"
  );
  assert.doesNotMatch(mainSource, /\u8fd9\u5ea7\u57ce\u5e02\u90fd\u901b\u904d\u4e86/);
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
    /\.c-city-begging-default__portrait--haozhou_ciji_jinghui\s*\{[\s\S]*background-image:\s*url\("\.\.\/\.\.\/ui\/npc\/shinv\.png"\);/
  );
});
