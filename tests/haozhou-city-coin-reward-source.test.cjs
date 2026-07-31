const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("city view and hud expose the coin reward animation anchors", () => {
  const cityViewSource = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const panelSource = fs.readFileSync("src/ui/panels/global-player-panel.ts", "utf8");
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");
  const prototypeCssSource = fs.readFileSync("src/styles/prototype.css", "utf8");

  assert.doesNotMatch(cityViewSource, /data-action="grant-haozhou-test-coin"/);
  assert.doesNotMatch(cityViewSource, /测试\+10文|测试获得十文钱/);
  assert.match(panelSource, /data-ui-gold-target/);
  assert.match(panelSource, /data-ui-gold-value/);
  assert.doesNotMatch(panelSource, /data-action="toggle-coin-anchor-editor"/);
  assert.doesNotMatch(panelSource, /data-ui-coin-anchor-input="x"/);
  assert.doesNotMatch(panelSource, /data-ui-coin-anchor-input="y"/);
  assert.doesNotMatch(panelSource, /data-action="confirm-coin-anchor-editor"/);
  assert.doesNotMatch(panelSource, /data-action="revert-coin-anchor-editor"/);
  assert.match(appRenderSource, /data-ui-coin-reward-layer/);
  assert.doesNotMatch(prototypeCssSource, /\.c-kulan-city__coin-test-action/);
  assert.match(prototypeCssSource, /\.p-global-status-compact__coin-anchor-toggle/);
  assert.match(prototypeCssSource, /display:\s*none;/);
});

test("haozhou test coin button is hidden from city view and choice skin", () => {
  const cityViewSource = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const choiceSkinMatch = cityViewSource.match(
    /function renderCityChoiceSkin\(\): string \{([\s\S]*?)^\}/m
  );
  const cityViewMatch = cityViewSource.match(
    /export function renderCityView\([\s\S]*?\): string \{([\s\S]*?)^\}/m
  );

  assert.ok(choiceSkinMatch, "Expected renderCityChoiceSkin source.");
  assert.ok(cityViewMatch, "Expected renderCityView source.");
  assert.doesNotMatch(choiceSkinMatch[1], /grant-haozhou-test-coin/);
  assert.doesNotMatch(cityViewMatch[1], /grant-haozhou-test-coin/);
});

test("coin anchor editor wiring exists in main runtime and animator", () => {
  const mainSource = fs.readFileSync("src/main.ts", "utf8");
  const animatorSource = fs.readFileSync("src/ui/animations/coin-reward-animation.ts", "utf8");

  assert.match(mainSource, /actualOffsetX:\s*-151/);
  assert.match(mainSource, /actualOffsetY:\s*25/);
  assert.match(mainSource, /draftOffsetX:\s*-151/);
  assert.match(mainSource, /draftOffsetY:\s*25/);
  assert.match(animatorSource, /setTargetOffset/);
  assert.match(animatorSource, /setPreviewTargetOffset/);
  assert.match(animatorSource, /display = "none"/);
  assert.match(animatorSource, /backgroundImage/);
});
