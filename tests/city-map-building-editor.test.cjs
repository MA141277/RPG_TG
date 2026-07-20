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

test("editor exposes prefab-first controls and keeps hit area tied to clickable entities", () => {
  const html = readText(indexPath);

  assert.match(html, /renderQuickSelect/);
  assert.match(html, /prefab-summary/);
  assert.match(html, /field-prefab-cols/);
  assert.match(html, /field-prefab-rows/);
  assert.match(html, /field-prefab-offset-x/);
  assert.match(html, /field-prefab-offset-y/);
  assert.match(html, /renderPrefabPreview/);
  assert.match(html, /prefab-preview-stage/);
  assert.match(html, /ground-decoration/);
  assert.match(html, /entity\.interaction\.clickable && layerState\.hitArea/);
  assert.match(html, /toggleHitAreaFields/);
  assert.doesNotMatch(html, /data-quick-id="keep"/);
});

test("editor copy no longer frames the layout around the old 20x20 coarse board", () => {
  const html = readText(indexPath);

  assert.doesNotMatch(html, /20×20/);
  assert.doesNotMatch(html, /20 x 20/);
  assert.doesNotMatch(html, /optionalBuildableMask/);
  assert.doesNotMatch(html, /buildablePolygon/);
});

test("example layout uses the fine city stage grid and prefab-backed instances", () => {
  const layout = readExampleLayout();
  const editorHtml = readText(indexPath);

  assert.equal(layout.version, 2);
  assert.equal(layout.map.id, "haozhou-city");
  assert.equal(layout.grid.type, "isometric-board");
  assert.equal(layout.grid.cols, 40);
  assert.equal(layout.grid.rows, 40);
  assert.equal(layout.grid.cellWidth, 40);
  assert.equal(layout.grid.cellHeight, 20);
  assert.equal(layout.grid.originY, 110);
  assert.match(editorHtml, /originY:\s*110/);

  assert.equal(Array.isArray(layout.instances), true);
  assert.equal("entities" in layout, false);
  assert.ok(layout.instances.length > 0);

  for (const instance of layout.instances) {
    assert.equal(typeof instance.id, "string");
    assert.notEqual(instance.id.trim(), "");
    assert.equal(typeof instance.prefabId, "string");
    assert.notEqual(instance.prefabId.trim(), "");
    assert.equal(typeof instance.gridX, "number");
    assert.equal(typeof instance.gridY, "number");
    assert.ok(instance.gridX >= 0);
    assert.ok(instance.gridY >= 0);
    assert.ok(instance.gridX < layout.grid.cols);
    assert.ok(instance.gridY < layout.grid.rows);
    assert.equal(typeof instance.render.visible, "boolean");
    assert.equal(typeof instance.render.locked, "boolean");
  }

  assert.ok(layout.instances.some((instance) => instance.prefabId === "keep"));
  assert.ok(
    layout.instances.some((instance) => instance.prefabId === "leader-residence")
  );
  assert.ok(
    layout.instances.some((instance) => instance.prefabId.startsWith("grass-"))
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

test("runtime city stage composes prefabs with city instances", () => {
  const html = readText(indexPath);
  const layout = readExampleLayout();
  const prefabPath = path.join(
    editorDir,
    "examples",
    "haozhou-city-prefabs.example.json"
  );
  const prefabs = JSON.parse(readText(prefabPath));
  const layoutSource = readText(cityStageLayoutPath);

  assert.equal(fs.existsSync(prefabPath), true);
  assert.equal(Array.isArray(prefabs.prefabs), true);
  assert.equal(Array.isArray(layout.instances), true);
  assert.equal("entities" in layout, false);
  assert.match(layoutSource, /composeCityStageLayout/);
  assert.match(layoutSource, /prefabId/);
  assert.match(html, /haozhou-city-prefabs\.example\.json/);
});
