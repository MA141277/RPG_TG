const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function readSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("story battle action buttons disable generic fallback click audio because dispatch owns battle cues", () => {
  const source = readSource("src/ui/views/battle/story-battle-view.ts");

  assert.match(
    source,
    /data-story-battle-action="player-advance"[\s\S]*data-ui-click-sound="none"/
  );
  assert.match(
    source,
    /data-story-battle-action="npc-resolve"[\s\S]*data-ui-click-sound="none"/
  );
  assert.match(
    source,
    /data-story-battle-action="finish"[\s\S]*data-ui-click-sound="none"/
  );
});

test("campaign travel controls disable generic fallback click audio because travel already queues troop selection", () => {
  const source = readSource("src/ui/views/map/map-view.ts");

  assert.match(
    source,
    /class="c-grid-cell[\s\S]*data-ui-click-sound="none"/
  );
  assert.match(
    source,
    /class="c-campaign-hex-building__hotspot"[\s\S]*data-ui-click-sound="none"/
  );
  assert.match(
    source,
    /class="c-campaign-marker[\s\S]*data-ui-click-sound="none"/
  );
});
