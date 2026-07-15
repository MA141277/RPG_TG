const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

const guardedTargets = [
  "src/content/houses/grain-shop-content.ts",
  "src/content/houses/home-house-content.ts",
  "src/content/houses/keep-house-content.ts",
  "src/content/houses/medicine-house-content.ts",
  "src/content/houses/temple-house-content.ts",
  "src/content/houses/tavern-content.ts",
  "src/application/house-modules/home-house/home-house-house-module.ts",
  "src/application/house-modules/keep-house/keep-house-house-module.ts",
  "src/application/house-modules/grain-shop/grain-shop-house-module.ts",
  "src/application/house-modules/medicine-house/medicine-house-house-module.ts",
  "src/application/house-modules/temple-house/temple-house-house-module.ts",
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
