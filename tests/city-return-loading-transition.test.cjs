const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const mainSourcePath = path.join(repoRoot, "src", "main.ts");
const cityViewSourcePath = path.join(
  repoRoot,
  "src",
  "ui",
  "views",
  "city",
  "city-view.ts"
);

function readSource(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("leave-city returns to campaign map through the shared loading screen", () => {
  const source = readSource(mainSourcePath);

  assert.match(source, /function returnToCampaignMapWithLoading\(\): void/);
  assert.match(
    source,
    /function returnToCampaignMapWithLoading\(\): void \{[\s\S]*?const requestId = beginLoadingScreen\(\);[\s\S]*?simulateLoadingProgress\(/s
  );
  assert.match(
    source,
    /function returnToCampaignMapWithLoading\(\): void \{[\s\S]*?applyCampaignMapReturnState\(\);[\s\S]*?renderApp\(\);[\s\S]*?setGameVisibility\(true\);[\s\S]*?await waitForInitialMapReadyWithLoading\(requestId\);[\s\S]*?endLoadingScreen\(requestId\);/s
  );
  assert.match(
    source,
    /if \(leaveCityButton != null\) \{[\s\S]*?returnToCampaignMapWithLoading\(\);[\s\S]*?return;[\s\S]*?\}/s
  );
});

test("city view hides the temporary 3d city entry button", () => {
  const source = readSource(cityViewSourcePath);

  assert.doesNotMatch(source, /data-action="enter-city-3d"/);
  assert.doesNotMatch(source, /c-kulan-city__three-d-action/);
});
