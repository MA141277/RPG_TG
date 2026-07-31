const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const helperPath = "src/application/time/council-insufficient-time-dialogue.ts";
const insufficientTimeOwners = [
  "src/application/house-modules/grain-shop/grain-shop-house-module.ts",
  "src/application/house-modules/medicine-house/medicine-house-house-module.ts",
  "src/application/house-modules/tea-house/tea-house-house-module.ts",
  "src/application/house-modules/tavern/tavern-house-module.ts",
  "src/application/house-modules/temple-house/temple-house-house-module.ts",
];

function readSource(path) {
  return fs.readFileSync(path, "utf8");
}

test("council insufficient time uses one player-spoken dialogue copy", () => {
  const source = readSource(helperPath);

  assert.match(source, /时间不多了，先返回评定地点吧/);
  assert.match(source, /speakerCharacterId:\s*playerCharacterId/);
  assert.match(source, /advanceHintText:\s*"返回评定地点"/);
});

test("house timed activity insufficient-time branches use the shared dialogue helper", () => {
  for (const path of insufficientTimeOwners) {
    const source = readSource(path);

    assert.match(
      source,
      /createCouncilInsufficientTimeDialogueOverride/,
      `${path} should create the shared player dialogue`
    );
    assert.doesNotMatch(
      source,
      /createCouncilTimeInsufficientOverlay/,
      `${path} should not keep module-specific insufficient-time alert overlays`
    );
  }
});

test("main city begging insufficient-time branch uses the same player dialogue copy", () => {
  const source = readSource("src/main.ts");

  assert.match(source, /COUNCIL_INSUFFICIENT_TIME_DIALOGUE_TEXT/);
  assert.match(source, /speakerCharacterId:\s*appState\.gameState\.player\.characterId/);
  assert.doesNotMatch(source, /showCouncilInsufficientTimeRefusal/);
});
