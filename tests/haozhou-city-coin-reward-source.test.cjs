const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("city view and hud expose the coin reward animation anchors", () => {
  const cityViewSource = fs.readFileSync("src/ui/views/city/city-view.ts", "utf8");
  const panelSource = fs.readFileSync("src/ui/panels/global-player-panel.ts", "utf8");
  const appRenderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");
  const prototypeCssSource = fs.readFileSync("src/styles/prototype.css", "utf8");

  assert.match(cityViewSource, /data-action="grant-haozhou-test-coin"/);
  assert.match(panelSource, /data-ui-gold-target/);
  assert.match(panelSource, /data-ui-gold-value/);
  assert.match(appRenderSource, /data-ui-coin-reward-layer/);
  assert.match(prototypeCssSource, /\.c-kulan-city__coin-test-action/);
  assert.match(
    prototypeCssSource,
    /\.c-kulan-city__coin-test-action\s*\{[\s\S]*?bottom:\s*68px;/
  );
});

test("haozhou test coin button is declared in city view instead of choice skin", () => {
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
  assert.match(cityViewMatch[1], /grant-haozhou-test-coin/);
});
