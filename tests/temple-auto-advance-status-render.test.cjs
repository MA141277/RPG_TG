const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  renderTempleAutoAdvanceStatusPanel,
} = require("../.test-dist/ui/views/house/temple-auto-advance-status-view.js");

test("temple auto advance status panel renders a read-only red modal", () => {
  const markup = renderTempleAutoAdvanceStatusPanel({
    variant: "temple-review-rest",
    title: "休至评定日",
    lines: ["当前：寺中静修", "评定：距离评定 2 天", "体力：70 / 100"],
  });

  assert.match(markup, /休至评定日/);
  assert.match(markup, /c-assessment-popup/);
  assert.match(markup, /c-house-temple-utility-popup/);
  assert.match(markup, /当前：寺中静修/);
  assert.doesNotMatch(markup, /data-house-action=/);
});

test("app render mounts auto advance status outside the HUD overlay container", () => {
  const source = fs.readFileSync("src/ui/app-render.ts", "utf8");
  const statusPanelCalls = source.match(/renderAutoAdvanceStatusPanel\(input\)/g) ?? [];

  assert.match(source, /renderTempleAutoAdvanceStatusPanel/);
  assert.match(source, /autoAdvanceState\?\.statusPanel/);
  assert.equal(statusPanelCalls.length, 1);
  assert.match(
    source,
    /\$\{renderAutoAdvanceStatusPanel\(input\)\}\s*\$\{renderModal\(/
  );
});
