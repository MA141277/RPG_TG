const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const editorDir = path.join(root, "tools", "city-map-building-editor");
const indexPath = path.join(editorDir, "index.html");
const readmePath = path.join(editorDir, "README.md");
const examplePath = path.join(
  editorDir,
  "examples",
  "haozhou-city-layout.example.json"
);
const cityViewPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-view.ts"
);
const cityStageLayoutPath = path.join(
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

function readExampleLayout() {
  return JSON.parse(readText(examplePath));
}

test("city map building editor ships standalone files and shared layout example", () => {
  assert.equal(fs.existsSync(indexPath), true);
  assert.equal(fs.existsSync(readmePath), true);
  assert.equal(fs.existsSync(examplePath), true);
  assert.equal(fs.existsSync(cityViewPath), true);
  assert.equal(fs.existsSync(cityStageLayoutPath), true);
});

test("editor keeps entity-first controls instead of old hardcoded building-only wording", () => {
  const html = readText(indexPath);

  for (const requiredText of [
    "建筑实体",
    "类型",
    "图片",
    "图片偏移 X",
    "图片偏移 Y",
    "地块 / 占地区域",
    "入口绑定",
    "house",
    "city-entry",
    "无入口",
    "导入 JSON",
    "导出 JSON",
    "上传建筑图片",
    "move-image-offset",
    "resize-lot-width",
    "resize-lot-height",
  ]) {
    assert.match(
      html,
      new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    );
  }
});

test("editor copy no longer frames the layout around the old 20x20 coarse board", () => {
  const html = readText(indexPath);

  assert.doesNotMatch(html, /20×20/);
  assert.doesNotMatch(html, /20 x 20/);
  assert.doesNotMatch(html, /optionalBuildableMask/);
  assert.doesNotMatch(html, /buildablePolygon/);
});

test("example layout uses the fine city stage grid and keeps offset-based entities", () => {
  const layout = readExampleLayout();

  assert.equal(layout.version, 1);
  assert.equal(layout.map.id, "haozhou-city");
  assert.equal(layout.grid.type, "isometric-board");
  assert.equal(layout.grid.cols, 40);
  assert.equal(layout.grid.rows, 40);
  assert.equal(layout.grid.cellWidth, 40);
  assert.equal(layout.grid.cellHeight, 20);

  const expectedEntryTypes = new Set(["none", "house", "city-entry"]);

  assert.ok(layout.entities.length > 0);

  for (const entity of layout.entities) {
    assert.equal(typeof entity.id, "string");
    assert.notEqual(entity.id.trim(), "");
    assert.equal(typeof entity.name, "string");
    assert.notEqual(entity.name.trim(), "");
    assert.equal(typeof entity.asset.image, "string");
    assert.equal(typeof entity.asset.offsetX, "number");
    assert.equal(typeof entity.asset.offsetY, "number");
    assert.ok(Number.isFinite(entity.asset.offsetX));
    assert.ok(Number.isFinite(entity.asset.offsetY));
    assert.equal(typeof entity.lot.gridX, "number");
    assert.equal(typeof entity.lot.gridY, "number");
    assert.equal(typeof entity.lot.cols, "number");
    assert.equal(typeof entity.lot.rows, "number");
    assert.ok(entity.lot.gridX >= 0);
    assert.ok(entity.lot.gridY >= 0);
    assert.ok(entity.lot.cols > 0);
    assert.ok(entity.lot.rows > 0);
    assert.ok(entity.lot.gridX + entity.lot.cols <= layout.grid.cols);
    assert.ok(entity.lot.gridY + entity.lot.rows <= layout.grid.rows);
    assert.ok(expectedEntryTypes.has(entity.entry.type));
  }

  assert.ok(
    layout.entities.some(
      (entity) =>
        entity.entry.type === "none" && entity.category === "ground-decoration"
    )
  );
  assert.ok(
    layout.entities.some(
      (entity) => entity.entry.type === "house" && entity.lot.cols >= 4
    )
  );
});

test("runtime city stage uses the shared layout module instead of hardcoded map prototypes", () => {
  const cityViewSource = readText(cityViewPath);
  const layoutSource = readText(cityStageLayoutPath);

  assert.match(cityViewSource, /renderCityStageScene/);
  assert.match(layoutSource, /haozhou-city-layout\.example\.json/);
  assert.doesNotMatch(layoutSource, /CITY_MAP_BUILDING_PROTOTYPES/);
  assert.doesNotMatch(layoutSource, /CITY_MAP_BUILDABLE_POLYGON/);
  assert.match(layoutSource, /asset\.offsetX/);
  assert.match(layoutSource, /asset\.offsetY/);
  assert.match(layoutSource, /lot\.gridX/);
  assert.match(layoutSource, /lot\.cols/);
  assert.match(layoutSource, /entry\.type === "house"/);
  assert.match(layoutSource, /entry\.type === "city-entry"/);
});
