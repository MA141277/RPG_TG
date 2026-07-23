const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const cityViewPath = path.join(root, "src", "ui", "views", "city", "city-view.ts");
const cityStageLayoutPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-layout.ts"
);
const cityStageLayoutDataPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-layout-data.ts"
);
const haozhouLayoutExamplePath = path.join(
  root,
  "tools",
  "city-map-building-editor",
  "examples",
  "haozhou-city-layout.example.json"
);
const haozhouPrefabsExamplePath = path.join(
  root,
  "tools",
  "city-map-building-editor",
  "examples",
  "haozhou-city-prefabs.example.json"
);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("formal city-stage foundation files exist in the worktree", () => {
  assert.equal(fs.existsSync(cityStageLayoutPath), true);
  assert.equal(fs.existsSync(cityStageLayoutDataPath), true);
  assert.equal(fs.existsSync(haozhouLayoutExamplePath), true);
  assert.equal(fs.existsSync(haozhouPrefabsExamplePath), true);
});

test("city view routes city rendering through the formal city-stage renderer", () => {
  const source = readText(cityViewPath);

  assert.match(source, /renderCityStageScene/);
  assert.match(source, /function renderCityMapScene\(input:/);
  assert.match(source, /return renderCityStageScene\(input\);/);
});

test("formal city-stage runtime composes Haozhou layout instances from prefab data", () => {
  const layoutSource = readText(cityStageLayoutPath);
  const dataSource = readText(cityStageLayoutDataPath);

  assert.match(layoutSource, /composeCityStageLayout/);
  assert.match(layoutSource, /renderCityStageScene/);
  assert.match(dataSource, /export function composeCityStageLayout/);
  assert.match(dataSource, /Unknown city-stage prefab/);
});
