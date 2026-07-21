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

function extractEditorScript() {
  const html = readText(indexPath);
  const match = html.match(/<script>([\s\S]*)<\/script>/);
  assert.ok(match, "expected inline editor script");
  return match[1];
}

function createClassList() {
  const values = new Set();
  return {
    add(...tokens) {
      for (const token of tokens) {
        values.add(token);
      }
    },
    remove(...tokens) {
      for (const token of tokens) {
        values.delete(token);
      }
    },
    toggle(token, force) {
      if (force === undefined) {
        if (values.has(token)) {
          values.delete(token);
          return false;
        }
        values.add(token);
        return true;
      }
      if (force) {
        values.add(token);
      } else {
        values.delete(token);
      }
      return force;
    },
    contains(token) {
      return values.has(token);
    },
  };
}

function createElement(overrides = {}) {
  return {
    value: "",
    checked: false,
    disabled: false,
    textContent: "",
    innerHTML: "",
    src: "",
    files: [],
    style: {},
    dataset: {},
    classList: createClassList(),
    closest() {
      return { classList: createClassList() };
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    ...overrides,
  };
}

function createEditorRuntimeHarness() {
  const source = `${extractEditorScript()}
window.__cityEditorTestApi = {
  state,
  dom,
  normalizePrefabLibrary,
  normalizeCityLayout,
  convertLegacyEntitiesLayout,
  setEditorLayout,
  setEditorSources,
  syncEditorLayoutFromSources,
  renderCityLayoutPanel,
  importJsonFile,
  selectPrefab,
  uploadEntityImage,
  updateCityLayoutFromForm,
  exportCityLayoutJson,
  getSelectedPrefab,
  getSelectedInstance,
  getSelectedEntity,
  assignDom(patch) {
    Object.assign(dom, patch);
  },
  setSources(prefabLibrary, cityLayout, preferredSelectedId = null) {
    setEditorSources(prefabLibrary, cityLayout, preferredSelectedId);
  },
  stubUi() {
    render = () => {};
    renderProperties = () => {};
    renderQuickSelect = () => {};
    renderEntityList = () => {};
    renderCanvas = () => {};
    renderReadOnlyPrefabState = () => {};
    setStatus = () => {};
  },
  stubReadImageFile(fn) {
    readImageFile = fn;
  },
  stubFileReaderText(text) {
    FileReader = class {
      constructor() {
        this.listeners = new Map();
        this.result = "";
      }
      addEventListener(type, callback) {
        this.listeners.set(type, callback);
      }
      readAsText() {
        this.result = text;
        const callback = this.listeners.get("load");
        if (callback) {
          callback();
        }
      }
    };
  }
};`;
  const context = {
    console,
    window: {},
    document: {
      addEventListener() {},
      getElementById() {
        return createElement();
      },
    },
    confirm: () => true,
    requestAnimationFrame: () => 0,
    cancelAnimationFrame() {},
    navigator: { clipboard: { writeText: async () => {} } },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob,
    Image: class {},
    FileReader: class {},
    fetch: async () => ({ ok: true, json: async () => ({}) }),
    setTimeout,
    clearTimeout,
  };
  context.window = context;
  vm.runInNewContext(source, context, { filename: indexPath });
  return context.window.__cityEditorTestApi;
}

function createSplitEditorSources() {
  return {
    prefabLibrary: {
      version: 2,
      prefabs: [
        {
          id: "keep",
          name: "Keep",
          category: "special",
          entry: { type: "house", houseId: "keep-house" },
          asset: {
            image: "keep.png",
            naturalWidth: 320,
            naturalHeight: 240,
            scale: 1,
            anchor: "bottom-center",
            offsetX: 0,
            offsetY: 0,
          },
          footprint: { cols: 4, rows: 3 },
          interaction: {
            clickable: true,
            label: {
              text: "Keep",
              offsetX: 0,
              offsetY: -32,
              width: 120,
              height: 30,
            },
            hitArea: {
              type: "diamond",
              offsetX: 0,
              offsetY: 0,
              width: 160,
              height: 80,
            },
          },
        },
        {
          id: "watchtower",
          name: "Watchtower",
          category: "special",
          entry: { type: "none" },
          asset: {
            image: "watchtower.png",
            naturalWidth: 256,
            naturalHeight: 256,
            scale: 1,
            anchor: "bottom-center",
            offsetX: 0,
            offsetY: 0,
          },
          footprint: { cols: 2, rows: 2 },
          interaction: {
            clickable: false,
            label: {
              text: "Watchtower",
              offsetX: 0,
              offsetY: -24,
              width: 96,
              height: 24,
            },
            hitArea: {
              type: "diamond",
              offsetX: 0,
              offsetY: 0,
              width: 80,
              height: 40,
            },
          },
        },
      ],
    },
    cityLayout: {
      version: 2,
      map: {
        id: "test-city",
        name: "Test City",
        stageWidth: 1600,
        stageHeight: 900,
        backgroundImage: "",
        foregroundImage: "",
        baseSpace: { x: 0, y: 0, width: 1600, height: 900 },
      },
      grid: {
        type: "isometric-board",
        cols: 10,
        rows: 9,
        cellWidth: 40,
        cellHeight: 20,
        originX: 400,
        originY: 120,
        showCoordinates: true,
        showBoardOutline: true,
      },
      instances: [
        {
          id: "instance.keep",
          prefabId: "keep",
          gridX: 2,
          gridY: 3,
          render: {
            visible: true,
            locked: false,
            zIndexMode: "footprint",
            zIndex: null,
          },
        },
      ],
      randomPools: [],
    },
  };
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

test("editor docs describe prefab-first workflow and legacy import", () => {
  const readme = readText(readmePath);

  assert.match(readme, /Prefab Editor/);
  assert.match(readme, /City Layout/);
  assert.match(readme, /haozhou-city-prefabs\.example\.json/);
  assert.match(readme, /legacy entities import/i);
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

test("city layout panel render path uses split source data without runtime reference errors", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  api.assignDom({
    cityLayoutForm: createElement(),
    propertiesEmpty: createElement(),
    duplicateEntity: createElement(),
    deleteEntity: createElement(),
    selectedReadout: createElement(),
    fieldInstanceId: createElement(),
    fieldInstancePrefabId: createElement(),
    fieldInstanceGridX: createElement(),
    fieldInstanceGridY: createElement(),
    fieldInstanceCols: createElement(),
    fieldInstanceRows: createElement(),
    fieldInstanceVisible: createElement(),
    fieldInstanceLocked: createElement(),
    fieldInstanceZIndexMode: createElement(),
    fieldInstanceZIndex: createElement(),
  });
  api.setSources(prefabLibrary, cityLayout, "instance.keep");
  api.state.editorMode = "city-layout";
  api.state.selectedPrefabId = "keep";

  assert.doesNotThrow(() => api.renderCityLayoutPanel("instance.keep"));
  assert.equal(api.dom.fieldInstanceId.value, "instance.keep");
  assert.equal(api.dom.fieldInstanceCols.value, 4);
  assert.equal(api.dom.fieldInstanceRows.value, 3);
});

test("prefab image uploads resolve the selected prefab and update prefab-owned asset fields", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  api.assignDom({
    statusLine: createElement(),
  });
  api.stubReadImageFile((file, callback) => {
    callback("data:image/png;base64,test", {
      naturalWidth: 640,
      naturalHeight: 320,
    });
  });
  api.setSources(prefabLibrary, cityLayout, "instance.keep");
  api.state.selectedPrefabId = "keep";
  const event = {
    target: {
      files: [{ name: "keep-upload.png" }],
      value: "filled",
    },
  };

  assert.doesNotThrow(() => api.uploadEntityImage(event));
  assert.equal(api.getSelectedPrefab().asset.naturalWidth, 640);
  assert.equal(api.getSelectedPrefab().asset.naturalHeight, 320);
  assert.equal(api.state.entityPreviews.get("keep"), "data:image/png;base64,test");
  assert.equal(event.target.value, "");
});

test("city layout form clamps the source instance before recomposing and export", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  api.assignDom({
    fieldInstanceId: createElement({ value: "instance.keep" }),
    fieldInstanceGridX: createElement({ value: "99" }),
    fieldInstanceGridY: createElement({ value: "99" }),
    fieldInstanceVisible: createElement({ checked: true }),
    fieldInstanceLocked: createElement({ checked: false }),
    fieldInstanceZIndexMode: createElement({ value: "footprint" }),
    fieldInstanceZIndex: createElement({ value: "" }),
  });
  api.setSources(prefabLibrary, cityLayout, "instance.keep");
  api.state.selectedPrefabId = "keep";
  api.state.selectedInstanceId = "instance.keep";
  api.state.selectedId = "instance.keep";

  api.updateCityLayoutFromForm();

  assert.equal(api.getSelectedInstance().gridX, 6);
  assert.equal(api.getSelectedInstance().gridY, 6);
  const exported = JSON.parse(api.exportCityLayoutJson());
  assert.equal(exported.instances[0].gridX, 6);
  assert.equal(exported.instances[0].gridY, 6);
});

test("prefab-library imports update prefab state and preserve the current city layout", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  api.stubFileReaderText(
    JSON.stringify({
      version: 2,
      prefabs: [
        {
          id: "imported-prefab",
          name: "Imported Prefab",
          category: "decoration",
          entry: { type: "none" },
          asset: {
            image: "imported.png",
            naturalWidth: 128,
            naturalHeight: 128,
            scale: 1,
            anchor: "bottom-center",
            offsetX: 0,
            offsetY: 0,
          },
          footprint: { cols: 1, rows: 1 },
          interaction: {
            clickable: false,
            label: {
              text: "Imported",
              offsetX: 0,
              offsetY: -12,
              width: 64,
              height: 16,
            },
            hitArea: {
              type: "diamond",
              offsetX: 0,
              offsetY: 0,
              width: 32,
              height: 16,
            },
          },
        },
      ],
    })
  );
  api.setSources(prefabLibrary, cityLayout, "instance.keep");
  const previousLayout = JSON.parse(api.exportCityLayoutJson());
  const event = {
    target: {
      files: [{ name: "prefabs.json" }],
      value: "filled",
    },
  };

  api.importJsonFile(event);

  assert.equal(api.state.prefabLibrary.prefabs.length, 1);
  assert.equal(api.state.prefabLibrary.prefabs[0].id, "imported-prefab");
  assert.deepEqual(JSON.parse(api.exportCityLayoutJson()), previousLayout);
  assert.equal(event.target.value, "");
});

test("editor converts legacy entity layouts into prefabs and instances", () => {
  const api = createEditorRuntimeHarness();
  const { cityLayout } = createSplitEditorSources();
  api.stubUi();

  const converted = api.convertLegacyEntitiesLayout({
    version: 1,
    map: cityLayout.map,
    grid: cityLayout.grid,
    entities: [
      {
        id: "legacy.keep",
        prefabId: "keep-prefab",
        name: "Legacy Keep",
        category: "special",
        entry: { type: "house", houseId: "legacy-keep" },
        asset: {
          image: "legacy-keep.png",
          naturalWidth: 400,
          naturalHeight: 300,
          scale: 1,
          offsetX: 8,
          offsetY: -4,
          anchor: "bottom-center",
        },
        lot: {
          gridX: 3,
          gridY: 5,
          cols: 4,
          rows: 2,
        },
        render: {
          visible: false,
          locked: true,
          zIndexMode: "manual",
          zIndex: 99,
        },
        interaction: {
          clickable: true,
          label: {
            text: "Legacy Keep",
            offsetX: 0,
            offsetY: -20,
            width: 100,
            height: 24,
          },
          hitArea: {
            type: "diamond",
            offsetX: 0,
            offsetY: 0,
            width: 96,
            height: 48,
          },
        },
      },
    ],
  });

  assert.equal(converted.prefabLibrary.prefabs.length, 1);
  assert.equal(converted.prefabLibrary.prefabs[0].id, "keep-prefab");
  assert.equal(converted.prefabLibrary.prefabs[0].asset.offsetX, 8);
  assert.equal(converted.prefabLibrary.prefabs[0].footprint.cols, 4);
  assert.equal(converted.cityLayout.instances.length, 1);
  assert.equal(converted.cityLayout.instances[0].id, "legacy.keep");
  assert.equal(converted.cityLayout.instances[0].prefabId, "keep-prefab");
  assert.equal(converted.cityLayout.instances[0].gridX, 3);
  assert.equal(converted.cityLayout.instances[0].render.zIndex, 99);
});

test("legacy entity imports keep conflicting shared prefab ids distinct", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  api.stubFileReaderText(
    JSON.stringify({
      version: 1,
      map: cityLayout.map,
      grid: cityLayout.grid,
      entities: [
        {
          id: "legacy.instance.keep-a",
          prefabId: "shared-keep",
          name: "Keep A",
          category: "special",
          entry: { type: "house", houseId: "keep-a" },
          asset: {
            image: "keep-a.png",
            naturalWidth: 256,
            naturalHeight: 256,
            scale: 1,
            offsetX: 4,
            offsetY: 0,
            anchor: "bottom-center",
          },
          lot: {
            gridX: 1,
            gridY: 2,
            cols: 2,
            rows: 2,
          },
          interaction: {
            clickable: true,
            label: {
              text: "Keep A",
              offsetX: 0,
              offsetY: -16,
              width: 80,
              height: 20,
            },
            hitArea: {
              type: "diamond",
              offsetX: 0,
              offsetY: 0,
              width: 64,
              height: 32,
            },
          },
        },
        {
          id: "legacy.instance.keep-b",
          prefabId: "shared-keep",
          name: "Keep B",
          category: "special",
          entry: { type: "house", houseId: "keep-b" },
          asset: {
            image: "keep-b.png",
            naturalWidth: 320,
            naturalHeight: 160,
            scale: 1,
            offsetX: -12,
            offsetY: 5,
            anchor: "bottom-center",
          },
          lot: {
            gridX: 5,
            gridY: 4,
            cols: 3,
            rows: 1,
          },
          interaction: {
            clickable: true,
            label: {
              text: "Keep B",
              offsetX: 2,
              offsetY: -18,
              width: 90,
              height: 22,
            },
            hitArea: {
              type: "ellipse",
              offsetX: 0,
              offsetY: 0,
              width: 72,
              height: 36,
            },
          },
        },
      ],
    })
  );
  api.setSources(prefabLibrary, cityLayout, "instance.keep");

  api.importJsonFile({
    target: {
      files: [{ name: "legacy-layout.json" }],
      value: "filled",
    },
  });

  const importedPrefabIds = api.state.prefabLibrary.prefabs.map((prefab) => prefab.id);
  const importedInstancePrefabIds = api.state.cityLayout.instances.map((instance) => instance.prefabId);

  assert.equal(importedPrefabIds.length, 2);
  assert.equal(importedInstancePrefabIds.length, 2);
  assert.equal(importedPrefabIds[0], "shared-keep");
  assert.match(importedPrefabIds[1], /^shared-keep-\d+$/);
  assert.deepEqual(importedInstancePrefabIds, importedPrefabIds);
});

test("prefab selection without a matching instance clears stale instance state and edits the selected prefab", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  api.assignDom({
    statusLine: createElement(),
  });
  api.stubReadImageFile((file, callback) => {
    callback("data:image/png;base64,watchtower", {
      naturalWidth: 512,
      naturalHeight: 128,
    });
  });
  api.setSources(prefabLibrary, cityLayout, "instance.keep");
  api.state.editorMode = "prefab";
  api.state.selectedInstanceId = "instance.keep";
  api.state.selectedId = "instance.keep";

  api.selectPrefab("watchtower");

  assert.equal(api.state.selectedPrefabId, "watchtower");
  assert.equal(api.state.selectedInstanceId, null);
  assert.equal(api.state.selectedId, null);

  const keepBefore = api.state.prefabLibrary.prefabs.find((prefab) => prefab.id === "keep");
  const watchtowerBefore = api.state.prefabLibrary.prefabs.find((prefab) => prefab.id === "watchtower");
  const event = {
    target: {
      files: [{ name: "watchtower-upload.png" }],
      value: "filled",
    },
  };

  api.uploadEntityImage(event);

  assert.equal(watchtowerBefore.asset.naturalWidth, 512);
  assert.equal(watchtowerBefore.asset.naturalHeight, 128);
  assert.equal(api.state.entityPreviews.get("watchtower"), "data:image/png;base64,watchtower");
  assert.equal(keepBefore.asset.naturalWidth, 320);
  assert.equal(keepBefore.asset.naturalHeight, 240);
});

test("setEditorSources clamps imported city instances against prefab footprints before export", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();

  cityLayout.instances = [
    {
      id: "instance.keep.edge",
      prefabId: "keep",
      gridX: 9,
      gridY: 8,
      render: {
        visible: true,
        locked: false,
        zIndexMode: "y-sort",
        zIndex: null,
      },
    },
  ];

  api.setSources(prefabLibrary, cityLayout, "instance.keep.edge");

  assert.equal(api.getSelectedEntity().lot.gridX, 6);
  assert.equal(api.getSelectedEntity().lot.gridY, 6);
  const exported = JSON.parse(api.exportCityLayoutJson());
  assert.equal(exported.instances[0].gridX, 6);
  assert.equal(exported.instances[0].gridY, 6);
});
