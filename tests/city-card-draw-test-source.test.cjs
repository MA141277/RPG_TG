const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function decodeEscapedUnicode(value) {
  return JSON.parse(`"${value}"`);
}

function includesLiteralOrEscape(source, escapedValue) {
  const literalValue = decodeEscapedUnicode(escapedValue);
  return source.includes(literalValue) || source.includes(escapedValue);
}

test("city view declares the temporary card draw test button in player-facing city markup", () => {
  const cityViewSource = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const prototypeCssSource = fs.readFileSync("src/styles/prototype.css", "utf8");

  assert.match(cityViewSource, /data-action="open-city-card-draw-test"/);
  assert.match(cityViewSource, /c-kulan-city__card-draw-test-action/);
  assert.match(prototypeCssSource, /\.c-kulan-city__card-draw-test-action/);
  assert.match(
    prototypeCssSource,
    /\.c-kulan-city__card-draw-test-action\s*\{[\s\S]*?bottom:\s*68px;/
  );
});

test("city card draw test button stays in renderCityView instead of shared choice skin", () => {
  const cityViewSource = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const choiceSkinMatch = cityViewSource.match(
    /function renderCityChoiceSkin\(\): string \{([\s\S]*?)^\}/m
  );
  const cityViewMatch = cityViewSource.match(
    /export function renderCityView\([\s\S]*?\): string \{([\s\S]*?)^\}/m
  );

  assert.ok(choiceSkinMatch, "Expected renderCityChoiceSkin source.");
  assert.ok(cityViewMatch, "Expected renderCityView source.");
  assert.doesNotMatch(choiceSkinMatch[1], /open-city-card-draw-test/);
  assert.match(cityViewMatch[1], /open-city-card-draw-test/);
});

test("main render path and runtime wire the temporary city card draw overlay", () => {
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  const appShellSource = fs.readFileSync("src/application/app-shell.ts", "utf8");

  assert.match(appRenderSource, /data-city-card-draw-overlay/);
  assert.match(mainSource, /open-city-card-draw-test/);
  assert.match(mainSource, /close-city-card-draw-test/);
  assert.match(mainSource, /confirm-city-card-draw-test/);
  assert.match(mainSource, /CardDrawAnimator/);
  assert.match(mainSource, /createCardDrawAudioCuePlayer/);
  assert.match(mainSource, /soundPlayer:\s*createCardDrawAudioCuePlayer/);
  assert.match(appShellSource, /cityCardDrawTestState:/);
});

test("city card draw overlay invalidates preserved runtime instances when animator wiring changes", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");

  assert.match(mainSource, /const CITY_CARD_DRAW_OVERLAY_RUNTIME_VERSION = \d+;/);
  assert.match(
    mainSource,
    /type CityCardDrawOverlayRuntime = \{[\s\S]*runtimeVersion: number;/
  );
  assert.match(
    mainSource,
    /cityCardDrawOverlayRuntime\.runtimeVersion\s*===\s*CITY_CARD_DRAW_OVERLAY_RUNTIME_VERSION/
  );
  assert.match(
    mainSource,
    /runtimeVersion: CITY_CARD_DRAW_OVERLAY_RUNTIME_VERSION/
  );
});

test("city card draw test copy is stored as readable chinese instead of mojibake", () => {
  const cityViewSource = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");
  const mainSource = fs.readFileSync("src/main.ts", "utf8");

  assert.ok(includesLiteralOrEscape(cityViewSource, "\\u62bd\\u5361\\u6d4b\\u8bd5"));
  assert.ok(includesLiteralOrEscape(cityViewSource, "\\u6d4b\\u8bd5\\u62bd\\u5361\\u52a8\\u753b"));
  assert.ok(includesLiteralOrEscape(appRenderSource, "\\u4e34\\u65f6\\u6d4b\\u8bd5"));
  assert.ok(includesLiteralOrEscape(appRenderSource, "\\u62bd\\u5361\\u52a8\\u753b"));
  assert.ok(includesLiteralOrEscape(appRenderSource, "\\u5173\\u95ed\\u62bd\\u5361\\u6d4b\\u8bd5"));
  assert.ok(
    includesLiteralOrEscape(
      appRenderSource,
      "\\u70b9\\u51fb\\u5361\\u724c\\u5f00\\u59cb\\u62bd\\u53d6\\uff0c\\u8fd4\\u56de 1-6 \\u7684\\u6d4b\\u8bd5\\u7ed3\\u679c\\u3002"
    )
  );
  assert.ok(includesLiteralOrEscape(appRenderSource, "\\u672c\\u6b21\\u7ed3\\u679c\\u4e3a"));
  assert.ok(includesLiteralOrEscape(appRenderSource, "\\u786e\\u5b9a"));
  assert.ok(
    includesLiteralOrEscape(
      mainSource,
      "\\u70b9\\u51fb\\u5361\\u724c\\u5f00\\u59cb\\u62bd\\u53d6\\uff0c\\u8fd4\\u56de 1-6 \\u7684\\u6d4b\\u8bd5\\u7ed3\\u679c\\u3002"
    )
  );
  assert.ok(includesLiteralOrEscape(mainSource, "\\u672c\\u6b21\\u7ed3\\u679c\\u4e3a"));
});
