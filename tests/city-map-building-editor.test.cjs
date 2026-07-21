const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");
const vm = require("node:vm");

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
const cityStageLayoutDataPath = path.join(
  root,
  "src",
  "ui",
  "views",
  "city",
  "city-stage-layout-data.ts"
);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readExampleLayout() {
  return JSON.parse(readText(examplePath));
}

function loadCityStageLayoutDataModule() {
  const source = readText(cityStageLayoutDataPath);
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: cityStageLayoutDataPath,
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(transpiled, {
    module,
    exports: module.exports,
    require,
  });
  return module.exports;
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

test("editor still supports split example composition and migration imports", () => {
  const html = readText(indexPath);

  assert.match(html, /renderQuickSelect/);
  assert.match(html, /haozhou-city-prefabs\.example\.json/);
  assert.match(html, /normalizePrefabLibrary/);
  assert.match(html, /normalizeCityLayout/);
  assert.match(html, /composeEditorEntities/);
  assert.match(html, /composePrefabLayoutForEditor/);
  assert.match(html, /function setEditorLayout\(layout, preferredSelectedId = null, readOnlyPrefabExample = null\)/);
  assert.match(
    html,
    /function importJsonFile\(event\)/
  );
});

test("editor separates prefab editing from city layout editing", () => {
  const html = readText(indexPath);

  assert.match(html, /editor-mode-toggle/);
  assert.match(html, /Prefab Editor/);
  assert.match(html, /City Layout/);
  assert.match(html, /composeEditorEntities/);
  assert.match(html, /field-instance-prefab-id/);
  assert.match(html, /exportPrefabLibraryJson/);
  assert.match(html, /exportCityLayoutJson/);
  assert.doesNotMatch(html, /field-instance-offset-x/);
  assert.doesNotMatch(html, /field-instance-offset-y/);
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
  const { composeCityStageLayout } = loadCityStageLayoutDataModule();
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

  const composed = composeCityStageLayout(
    {
      version: 2,
      map: layout.map,
      grid: layout.grid,
      instances: [
        {
          id: "instance.keep.test",
          prefabId: "keep",
          gridX: 9,
          gridY: 11,
          render: {
            visible: false,
            locked: true,
            zIndexMode: "manual",
            zIndex: 77,
          },
        },
      ],
    },
    prefabs
  );

  assert.equal(composed.length, 1);
  assert.equal(composed[0].id, "instance.keep.test");
  assert.equal(composed[0].prefabId, "keep");
  assert.equal(composed[0].name, "帅府");
  assert.equal(composed[0].entry.type, "house");
  assert.equal(composed[0].asset.image, "ui/yuansu/菱形格子/shuaifu.png");
  assert.equal(composed[0].lot.gridX, 9);
  assert.equal(composed[0].lot.gridY, 11);
  assert.equal(composed[0].lot.cols, 8);
  assert.equal(composed[0].lot.rows, 6);
  assert.equal(composed[0].render.visible, false);
  assert.equal(composed[0].render.locked, true);
  assert.equal(composed[0].render.zIndexMode, "manual");
  assert.equal(composed[0].render.zIndex, 77);
  assert.equal(composed[0].interaction.label.text, "帅府");
});

test("composeCityStageLayout preserves legacy entity imports during migration", () => {
  const { composeCityStageLayout } = loadCityStageLayoutDataModule();
  const legacyEntity = {
    id: "legacy.keep",
    name: "Legacy Keep",
    category: "special",
    entry: { type: "house", houseId: "house.kulan.keep" },
    asset: {
      image: "legacy.png",
      naturalWidth: 100,
      naturalHeight: 50,
      scale: 1,
      offsetX: 1,
      offsetY: 2,
      anchor: "bottom-center",
    },
    lot: {
      gridX: 1,
      gridY: 2,
      cols: 3,
      rows: 4,
    },
    interaction: {
      clickable: true,
      label: {
        text: "Legacy",
        offsetX: 0,
        offsetY: -10,
        width: 20,
        height: 10,
      },
      hitArea: {
        type: "ellipse",
        offsetX: 0,
        offsetY: 0,
        width: 20,
        height: 10,
      },
    },
  };

  const composed = composeCityStageLayout(
    {
      version: 1,
      map: {
        id: "legacy",
        name: "Legacy",
        stageWidth: 1,
        stageHeight: 1,
        baseSpace: { x: 0, y: 0, width: 1, height: 1 },
        backgroundImage: "",
        foregroundImage: "",
      },
      grid: {
        type: "isometric-board",
        cols: 1,
        rows: 1,
        cellWidth: 1,
        cellHeight: 1,
        originX: 0,
        originY: 0,
      },
      entities: [legacyEntity],
    },
    { prefabs: [] }
  );

  assert.equal(composed.length, 1);
  assert.notEqual(composed[0], legacyEntity);
  assert.equal(composed[0].id, "legacy.keep");
  assert.equal(composed[0].asset.image, "legacy.png");
  assert.equal(composed[0].render.visible, true);
  assert.equal(composed[0].render.locked, false);
  assert.equal(composed[0].render.zIndexMode, "y-sort");
  assert.equal(composed[0].render.zIndex, null);
});
