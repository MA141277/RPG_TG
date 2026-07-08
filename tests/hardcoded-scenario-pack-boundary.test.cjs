const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

const guardedTargets = [
  "src/content/houses/home-house-content.ts",
  "src/content/houses/keep-house-content.ts",
  "src/application/house-modules/home-house/home-house-house-module.ts",
  "src/application/house-modules/keep-house/keep-house-house-module.ts",
  "src/application/house-modules/grain-shop/grain-shop-house-module.ts",
  "src/application/house-modules/market-house/market-house-house-module.ts",
  "src/application/house-modules/medicine-house/medicine-house-house-module.ts",
  "src/application/house-modules/temple-house/temple-house-house-module.ts",
  "src/application/house-modules/tavern/tavern-session-state.ts",
  "src/application/house-modules/tavern/tavern-house-module.ts",
];

const forbiddenScenarioPattern = /朱元璋|皇觉寺|濠州|帅府|住持|方丈|化缘|红巾军|军议|军令/u;

function collectForbiddenMatches() {
  const matches = [];
  for (const relativePath of guardedTargets) {
    const absolutePath = path.join(projectRoot, relativePath);
    const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/u);
    lines.forEach((line, index) => {
      if (!forbiddenScenarioPattern.test(line)) {
        return;
      }
      matches.push({
        file: relativePath,
        line: index + 1,
        text: line.trim(),
      });
    });
  }
  return matches;
}

test("cleaned house modules do not reintroduce zhuyuanzhang pack prose", () => {
  assert.deepEqual(collectForbiddenMatches(), []);
});

test("temple house module no longer imports pack-content-access fallback glue", () => {
  const source = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "house-modules",
      "temple-house",
      "temple-house-house-module.ts"
    ),
    "utf8"
  );

  assert.equal(
    source.includes("../../content/pack-content-access"),
    false,
    "Expected temple-house-house-module.ts to stop importing pack-content-access fallback glue."
  );
});

test("keep house module no longer imports pack-content-access fallback glue", () => {
  const source = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "house-modules",
      "keep-house",
      "keep-house-house-module.ts"
    ),
    "utf8"
  );

  assert.equal(
    source.includes("../../content/pack-content-access"),
    false,
    "Expected keep-house-house-module.ts to stop importing pack-content-access fallback glue."
  );
});

test("market house module no longer imports market-house-content fallback glue", () => {
  const source = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "house-modules",
      "market-house",
      "market-house-house-module.ts"
    ),
    "utf8"
  );

  assert.equal(
    source.includes("../../../content/houses/market-house-content"),
    false,
    "Expected market-house-house-module.ts to stop importing market-house-content fallback glue."
  );
});

test("grain market source no longer imports grain-shop-content fallback glue", () => {
  const source = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "grain-shop",
      "grain-market.ts"
    ),
    "utf8"
  );

  assert.equal(
    source.includes("../../content/houses/grain-shop-content"),
    false,
    "Expected grain-market.ts to stop importing grain-shop-content fallback glue."
  );
});

test("grain-shop session seed helpers no longer import grain-shop-content fallback glue", () => {
  const initSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "grain-shop",
      "init-grain-shop-session.ts"
    ),
    "utf8"
  );
  const snapshotSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "grain-shop",
      "grain-shop-snapshot.ts"
    ),
    "utf8"
  );

  assert.equal(
    initSource.includes("../../content/houses/grain-shop-content"),
    false,
    "Expected init-grain-shop-session.ts to stop importing grain-shop-content fallback glue."
  );
  assert.equal(
    snapshotSource.includes("../../content/houses/grain-shop-content"),
    false,
    "Expected grain-shop-snapshot.ts to stop importing grain-shop-content fallback glue."
  );
});

test("grain-shop accounting family no longer imports grain-shop-content fallback glue", () => {
  const accountingMinigameSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "grain-shop",
      "accounting-minigame.ts"
    ),
    "utf8"
  );
  const grainShopModuleSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "house-modules",
      "grain-shop",
      "grain-shop-house-module.ts"
    ),
    "utf8"
  );
  const grainAccountingPlayableSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "playables",
      "grain-accounting",
      "grain-accounting-definition.ts"
    ),
    "utf8"
  );

  assert.equal(
    accountingMinigameSource.includes("../../content/houses/grain-shop-content"),
    false,
    "Expected accounting-minigame.ts to stop importing grain-shop-content fallback glue."
  );
  assert.equal(
    grainShopModuleSource.includes("../../../content/houses/grain-shop-content"),
    false,
    "Expected grain-shop-house-module.ts to stop importing grain-shop-content fallback glue."
  );
  assert.equal(
    grainAccountingPlayableSource.includes("../../../content/houses/grain-shop-content"),
    false,
    "Expected grain-accounting-definition.ts to stop importing grain-shop-content fallback glue."
  );
});

test("pack-content-access no longer carries grain-shop fallback glue", () => {
  const source = fs.readFileSync(
    path.join(projectRoot, "src", "content", "pack-content-access.ts"),
    "utf8"
  );

  assert.equal(
    source.includes("grain-shop-content.json"),
    false,
    "Expected pack-content-access.ts to stop importing grain-shop-content.json."
  );
  assert.equal(
    source.includes("defaultGrainShopContent"),
    false,
    "Expected pack-content-access.ts to stop exporting grain-shop fallback glue."
  );
});

test("tavern sources no longer import tavern-content fallback glue", () => {
  const tavernModuleSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "house-modules",
      "tavern",
      "tavern-house-module.ts"
    ),
    "utf8"
  );
  const tavernSessionStateSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "house-modules",
      "tavern",
      "tavern-session-state.ts"
    ),
    "utf8"
  );

  assert.equal(
    tavernModuleSource.includes("../../../content/houses/tavern-content"),
    false,
    "Expected tavern-house-module.ts to stop importing tavern-content fallback glue."
  );
  assert.equal(
    tavernSessionStateSource.includes("../../../content/houses/tavern-content"),
    false,
    "Expected tavern-session-state.ts to stop importing tavern-content fallback glue."
  );
});

test("tea-house sources no longer import tea-house-content fallback glue", () => {
  const teaHouseModuleSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "house-modules",
      "tea-house",
      "tea-house-house-module.ts"
    ),
    "utf8"
  );
  const teaHouseActorsSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "tea-house",
      "tea-house-actors.ts"
    ),
    "utf8"
  );
  const teaHouseDebateSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "tea-house",
      "tea-house-debate.ts"
    ),
    "utf8"
  );

  assert.equal(
    teaHouseModuleSource.includes("../../../content/houses/tea-house-content"),
    false,
    "Expected tea-house-house-module.ts to stop importing tea-house-content fallback glue."
  );
  assert.equal(
    teaHouseActorsSource.includes("../../content/houses/tea-house-content"),
    false,
    "Expected tea-house-actors.ts to stop importing tea-house-content fallback glue."
  );
  assert.equal(
    teaHouseDebateSource.includes("../../content/houses/tea-house-content"),
    false,
    "Expected tea-house-debate.ts to stop importing tea-house-content fallback glue."
  );
});

test("medicine-house sources no longer import medicine-house-content fallback glue", () => {
  const medicineHouseModuleSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "house-modules",
      "medicine-house",
      "medicine-house-house-module.ts"
    ),
    "utf8"
  );
  const medicineCompoundingSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "medicine-house",
      "compounding-minigame.ts"
    ),
    "utf8"
  );
  const medicinePlayableSource = fs.readFileSync(
    path.join(
      projectRoot,
      "src",
      "application",
      "playables",
      "medicine-compounding",
      "medicine-compounding-definition.ts"
    ),
    "utf8"
  );

  assert.equal(
    medicineHouseModuleSource.includes("../../../content/houses/medicine-house-content"),
    false,
    "Expected medicine-house-house-module.ts to stop importing medicine-house-content fallback glue."
  );
  assert.equal(
    medicineCompoundingSource.includes("../../content/houses/medicine-house-content"),
    false,
    "Expected compounding-minigame.ts to stop importing medicine-house-content fallback glue."
  );
  assert.equal(
    medicinePlayableSource.includes("../../../content/houses/medicine-house-content"),
    false,
    "Expected medicine-compounding-definition.ts to stop importing medicine-house-content fallback glue."
  );
});
