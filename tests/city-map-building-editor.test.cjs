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

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readExampleLayout() {
  return JSON.parse(readText(examplePath));
}

test("city map building editor ships standalone files", () => {
  assert.equal(fs.existsSync(indexPath), true);
  assert.equal(fs.existsSync(readmePath), true);
  assert.equal(fs.existsSync(examplePath), true);
});

test("editor exposes required toolbar, panels, and preview hooks", () => {
  const html = readText(indexPath);

  for (const requiredText of [
    "新建布局",
    "导入 JSON",
    "导出 JSON",
    "上传地图底图",
    "上传前景墙体图",
    "上传建筑图片",
    "棋盘校准模式",
    "编辑模式",
    "预览模式",
    "显示网格",
    "开启吸附",
    "校验布局",
    "CityMapBuildingEntity",
    "data-house-id",
    "data-city-entry-id",
  ]) {
    assert.match(html, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("editor uses Chinese visual editing labels instead of raw engineering labels", () => {
  const html = readText(indexPath);

  for (const requiredText of [
    "特殊建筑",
    "普通建筑",
    "随机民居槽位",
    "装饰建筑",
    "地面装饰",
    "建筑实体",
    "类型",
    "图片",
    "地块",
    "显示",
    "交互",
    "点击区域",
    "标签按钮",
    "图片缩放",
    "图片偏移 X",
    "图片偏移 Y",
    "占地区域",
    "地图编辑区域",
    "高级 / 调试 JSON",
  ]) {
    assert.match(html, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("editor includes visual footprint controls and buildable city range overlay", () => {
  const html = readText(indexPath);

  for (const requiredText of [
    "gridToPixel",
    "pixelToGrid",
    "isometric-board",
    "20×20 棋盘",
    "board-grid-layer",
    "board-cell",
    "board-outline",
    "footprint-grid-layer",
    "lot-resize-handle",
    "拖拽增加 / 减少占地列数",
    "拖拽增加 / 减少占地行数",
    "拖拽调整占用格数",
    "当前使用固定 20×20 菱形棋盘。拖动建筑会吸附到格子；拖动金色手柄会改变建筑占几格。",
    "resize-lot-width",
    "resize-lot-height",
    "move-image-offset",
    "move-label",
    "resize-hit-area",
  ]) {
    assert.match(html, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(html, /CITY_MAP_BUILDABLE_POLYGON/);
  assert.doesNotMatch(html, /建筑地块超出 buildablePolygon/);
});

test("editor exposes 20x20 board calibration controls", () => {
  const html = readText(indexPath);

  for (const requiredText of [
    "20×20 棋盘设置",
    "棋盘列数",
    "棋盘行数",
    "棋盘原点 X",
    "棋盘原点 Y",
    "格子宽度",
    "格子高度",
    "显示格子坐标",
    "显示棋盘外框",
    "显示城墙参考遮罩",
    "请将 20×20 菱形棋盘整体对齐到城墙内部空地。建筑只能占用棋盘格，不再使用自动识别范围。",
    "前景墙体透明度",
    "背景图透明度",
    "网格透明度",
    "board-move-handle",
    "board-scale-handle",
    "move-board",
    "scale-board-width",
    "scale-board-height",
    "optionalBuildableMask",
  ]) {
    assert.match(html, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(html, /添加控制点/);
  assert.doesNotMatch(html, /删除选中控制点/);
  assert.doesNotMatch(html, /重置为默认可放置区域/);
});

test("editor keeps random pool JSON folded into advanced tools", () => {
  const html = readText(indexPath);

  assert.match(html, /<details[^>]*class="advanced-json"/);
  assert.match(html, /<summary>高级 \/ 调试 JSON<\/summary>/);
  assert.doesNotMatch(html, /<h2[^>]*>随机池 JSON<\/h2>/);
});

test("example layout preserves haozhou map coordinates and required entries", () => {
  const layout = readExampleLayout();

  assert.equal(layout.version, 1);
  assert.equal(layout.map.id, "haozhou-city");
  assert.deepEqual(layout.map.baseSpace, {
    x: 139,
    y: 88,
    width: 1771,
    height: 976,
  });
  assert.equal(layout.grid.type, "isometric-board");
  assert.equal(layout.grid.cols, 20);
  assert.equal(layout.grid.rows, 20);
  assert.equal(layout.grid.showCoordinates, true);
  for (const key of ["originX", "originY", "cellWidth", "cellHeight"]) {
    assert.equal(typeof layout.grid[key], "number");
  }
  assert.ok(Array.isArray(layout.map.optionalBuildableMask));

  const entitiesById = new Map(layout.entities.map((entity) => [entity.id, entity]));
  const expectedBindings = {
    keep: { type: "house", houseId: "house.kulan.keep" },
    "leader-residence": {
      type: "city-entry",
      cityEntryId: "city-entry.kulan.leader-residence",
    },
    temple: { type: "house", houseId: "house.kulan.temple" },
    "tea-house": { type: "house", houseId: "house.kulan.tea_house" },
    market: { type: "house", houseId: "house.kulan.market" },
    "grain-shop": { type: "house", houseId: "house.kulan.grain_shop" },
    "medicine-house": { type: "house", houseId: "house.kulan.medicine_house" },
    inn: { type: "house", houseId: "house.kulan.inn" },
  };

  for (const [entityId, expectedEntry] of Object.entries(expectedBindings)) {
    assert.deepEqual(entitiesById.get(entityId)?.entry, expectedEntry);
  }

  assert.ok(layout.entities.some((entity) => entity.category === "house"));
  assert.ok(
    layout.entities.some((entity) => entity.category === "ground-decoration")
  );
});

test("example layout ids are unique and interaction bounds are populated", () => {
  const layout = readExampleLayout();
  const ids = layout.entities.map((entity) => entity.id);

  assert.equal(new Set(ids).size, ids.length);

  for (const entity of layout.entities) {
    assert.equal(typeof entity.name, "string");
    assert.notEqual(entity.name.trim(), "");
    assert.equal(typeof entity.asset.image, "string");
    assert.notEqual(entity.asset.image.trim(), "");
    assert.equal(typeof entity.lot.gridX, "number");
    assert.equal(typeof entity.lot.gridY, "number");
    assert.ok(entity.lot.gridX >= 0);
    assert.ok(entity.lot.gridY >= 0);
    assert.ok(entity.lot.gridX + entity.lot.cols <= layout.grid.cols);
    assert.ok(entity.lot.gridY + entity.lot.rows <= layout.grid.rows);
    assert.ok(entity.lot.cols > 0);
    assert.ok(entity.lot.rows > 0);
    assert.ok(entity.interaction.hitArea.width > 0);
    assert.ok(entity.interaction.hitArea.height > 0);
  }
});
