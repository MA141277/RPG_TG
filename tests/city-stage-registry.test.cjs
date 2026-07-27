const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const registryPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-registry.ts"
);
const layoutPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-layout.ts"
);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("city-stage registry source auto-discovers layout and prefab pairs", () => {
  const source = readText(registryPath);

  assert.match(source, /import\.meta\.glob/);
  assert.match(source, /getCityStageBundleForCity/);
  assert.match(source, /city-layout/);
  assert.match(source, /city-prefabs/);
});

test("city-stage renderer no longer hardcodes Haozhou JSON imports", () => {
  const source = readText(layoutPath);

  assert.doesNotMatch(source, /haozhouCityLayoutModule/);
  assert.doesNotMatch(source, /haozhouCityPrefabModule/);
  assert.match(source, /getCityStageBundleForCity/);
});
