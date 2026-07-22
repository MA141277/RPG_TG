# Review Package

## Commits
34813d3 fix: support prefab-only editor imports
52c7ec9 chore: remove task 2 report artifact
3bb2202 fix: harden split city editor runtime handlers
a584e9d chore: drop task report artifact from repo
087029d feat: split city editor into prefab and layout modes

## Diff Stat
 .superpowers/sdd/city-prefab-task-2-report.md |   65 ++
 tests/city-map-building-editor.test.cjs       |  502 ++++++++++-
 tools/city-map-building-editor/index.html     | 1190 ++++++++++++++++++++-----
 3 files changed, 1510 insertions(+), 247 deletions(-)

## Full Diff
```diff
diff --git a/.superpowers/sdd/city-prefab-task-2-report.md b/.superpowers/sdd/city-prefab-task-2-report.md
new file mode 100644
index 0000000..60b49f9
--- /dev/null
+++ b/.superpowers/sdd/city-prefab-task-2-report.md
@@ -0,0 +1,65 @@
+Task 2 Report: Split The Editor Into Prefab And City Layout Modes
+
+Date: 2026-07-21
+Base commit: c4e2945
+
+Scope
+- Modified `tools/city-map-building-editor/index.html`
+- Modified `tests/city-map-building-editor.test.cjs`
+
+Task 2 implementation summary
+- Split the editor into authoritative source-state levels:
+  - `state.prefabLibrary`
+  - `state.cityLayout`
+- Kept `state.layout.entities` as a recomposed view-model for canvas/listing/selection only.
+- Added separate prefab and city-layout property panels with an editor-mode toggle.
+- Kept prefab-owned truth in the prefab library:
+  - category
+  - entry binding
+  - image path / natural size / scale / anchor / offsets
+  - footprint cols / rows
+  - clickable / label / hit-area fields
+- Kept city-layout-owned truth in the city layout:
+  - instance id
+  - placement
+  - visible / locked / z-index metadata
+- Added split exports:
+  - `exportPrefabLibraryJson()`
+  - `exportCityLayoutJson()`
+- Preserved runtime composition through one composed entity-like model for rendering.
+- Preserved migration support for legacy `entities` layouts.
+
+Earlier review fix pass
+- Fixed `renderCityLayoutPanel(...)` to resolve the selected instance's prefab/composed entity explicitly before reading footprint values.
+- Fixed `uploadEntityImage(...)` to resolve the selected prefab explicitly before mutating prefab-owned asset fields.
+- Fixed `updateCityLayoutFromForm(...)` to clamp authoritative source instance coordinates before recomposition/export.
+- Added VM-based behavior tests for:
+  - city-layout panel render path
+  - prefab image upload path
+  - source-instance clamp/export consistency
+
+Final fix pass
+- Added prefab-only import support:
+  - standalone prefab-library JSON (`{ "prefabs": [...] }`) now imports into `state.prefabLibrary`
+  - existing `state.cityLayout` is preserved during prefab-only import
+- Fixed stale prefab selection behavior:
+  - `selectPrefab()` now clears `selectedInstanceId` / `selectedId` when the selected prefab has no matching instance
+  - prefab-mode image uploads now resolve from `selectedPrefabId` first instead of a stale selected instance
+- Added behavior tests for:
+  - importing a prefab-library JSON while preserving city layout
+  - selecting and editing a prefab with no matching instance
+
+Focused verification
+- Red step after adding the final tests:
+  - `node --test tests/city-map-building-editor.test.cjs`
+  - Result: 12 passed, 2 failed
+  - Failures matched the reported issues:
+    - prefab-only import left the existing prefab library in place
+    - selecting a prefab without an instance left stale instance selection behind
+- Green step after the final fixes:
+  - `node --test tests/city-map-building-editor.test.cjs`
+  - Result: 14 passed, 0 failed
+
+Notes
+- The embedded Git binary from GitHub Desktop was used because `git` was not on `PATH` in this shell.
+- Unrelated dirty worktree files were left untouched.
diff --git a/tests/city-map-building-editor.test.cjs b/tests/city-map-building-editor.test.cjs
index 617cbeb..56df7d4 100644
--- a/tests/city-map-building-editor.test.cjs
+++ b/tests/city-map-building-editor.test.cjs
@@ -58,20 +58,280 @@ function loadCityStageLayoutDataModule() {
   }).outputText;
   const module = { exports: {} };
   vm.runInNewContext(transpiled, {
     module,
     exports: module.exports,
     require,
   });
   return module.exports;
 }
 
+function extractEditorScript() {
+  const html = readText(indexPath);
+  const match = html.match(/<script>([\s\S]*)<\/script>/);
+  assert.ok(match, "expected inline editor script");
+  return match[1];
+}
+
+function createClassList() {
+  const values = new Set();
+  return {
+    add(...tokens) {
+      for (const token of tokens) {
+        values.add(token);
+      }
+    },
+    remove(...tokens) {
+      for (const token of tokens) {
+        values.delete(token);
+      }
+    },
+    toggle(token, force) {
+      if (force === undefined) {
+        if (values.has(token)) {
+          values.delete(token);
+          return false;
+        }
+        values.add(token);
+        return true;
+      }
+      if (force) {
+        values.add(token);
+      } else {
+        values.delete(token);
+      }
+      return force;
+    },
+    contains(token) {
+      return values.has(token);
+    },
+  };
+}
+
+function createElement(overrides = {}) {
+  return {
+    value: "",
+    checked: false,
+    disabled: false,
+    textContent: "",
+    innerHTML: "",
+    src: "",
+    files: [],
+    style: {},
+    dataset: {},
+    classList: createClassList(),
+    closest() {
+      return { classList: createClassList() };
+    },
+    addEventListener() {},
+    removeEventListener() {},
+    focus() {},
+    ...overrides,
+  };
+}
+
+function createEditorRuntimeHarness() {
+  const source = `${extractEditorScript()}
+window.__cityEditorTestApi = {
+  state,
+  dom,
+  normalizePrefabLibrary,
+  normalizeCityLayout,
+  syncEditorLayoutFromSources,
+  renderCityLayoutPanel,
+  importJsonFile,
+  selectPrefab,
+  uploadEntityImage,
+  updateCityLayoutFromForm,
+  exportCityLayoutJson,
+  getSelectedPrefab,
+  getSelectedInstance,
+  getSelectedEntity,
+  assignDom(patch) {
+    Object.assign(dom, patch);
+  },
+  setSources(prefabLibrary, cityLayout, preferredSelectedId = null) {
+    state.prefabLibrary = normalizePrefabLibrary(prefabLibrary);
+    state.cityLayout = normalizeCityLayout(cityLayout);
+    syncEditorLayoutFromSources(preferredSelectedId);
+  },
+  stubUi() {
+    render = () => {};
+    renderProperties = () => {};
+    renderQuickSelect = () => {};
+    renderEntityList = () => {};
+    renderCanvas = () => {};
+    renderReadOnlyPrefabState = () => {};
+    setStatus = () => {};
+  },
+  stubReadImageFile(fn) {
+    readImageFile = fn;
+  },
+  stubFileReaderText(text) {
+    FileReader = class {
+      constructor() {
+        this.listeners = new Map();
+        this.result = "";
+      }
+      addEventListener(type, callback) {
+        this.listeners.set(type, callback);
+      }
+      readAsText() {
+        this.result = text;
+        const callback = this.listeners.get("load");
+        if (callback) {
+          callback();
+        }
+      }
+    };
+  }
+};`;
+  const context = {
+    console,
+    window: {},
+    document: {
+      addEventListener() {},
+      getElementById() {
+        return createElement();
+      },
+    },
+    confirm: () => true,
+    requestAnimationFrame: () => 0,
+    cancelAnimationFrame() {},
+    navigator: { clipboard: { writeText: async () => {} } },
+    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
+    Blob,
+    Image: class {},
+    FileReader: class {},
+    fetch: async () => ({ ok: true, json: async () => ({}) }),
+    setTimeout,
+    clearTimeout,
+  };
+  context.window = context;
+  vm.runInNewContext(source, context, { filename: indexPath });
+  return context.window.__cityEditorTestApi;
+}
+
+function createSplitEditorSources() {
+  return {
+    prefabLibrary: {
+      version: 2,
+      prefabs: [
+        {
+          id: "keep",
+          name: "Keep",
+          category: "special",
+          entry: { type: "house", houseId: "keep-house" },
+          asset: {
+            image: "keep.png",
+            naturalWidth: 320,
+            naturalHeight: 240,
+            scale: 1,
+            anchor: "bottom-center",
+            offsetX: 0,
+            offsetY: 0,
+          },
+          footprint: { cols: 4, rows: 3 },
+          interaction: {
+            clickable: true,
+            label: {
+              text: "Keep",
+              offsetX: 0,
+              offsetY: -32,
+              width: 120,
+              height: 30,
+            },
+            hitArea: {
+              type: "diamond",
+              offsetX: 0,
+              offsetY: 0,
+              width: 160,
+              height: 80,
+            },
+          },
+        },
+        {
+          id: "watchtower",
+          name: "Watchtower",
+          category: "special",
+          entry: { type: "none" },
+          asset: {
+            image: "watchtower.png",
+            naturalWidth: 256,
+            naturalHeight: 256,
+            scale: 1,
+            anchor: "bottom-center",
+            offsetX: 0,
+            offsetY: 0,
+          },
+          footprint: { cols: 2, rows: 2 },
+          interaction: {
+            clickable: false,
+            label: {
+              text: "Watchtower",
+              offsetX: 0,
+              offsetY: -24,
+              width: 96,
+              height: 24,
+            },
+            hitArea: {
+              type: "diamond",
+              offsetX: 0,
+              offsetY: 0,
+              width: 80,
+              height: 40,
+            },
+          },
+        },
+      ],
+    },
+    cityLayout: {
+      version: 2,
+      map: {
+        id: "test-city",
+        name: "Test City",
+        stageWidth: 1600,
+        stageHeight: 900,
+        backgroundImage: "",
+        foregroundImage: "",
+        baseSpace: { x: 0, y: 0, width: 1600, height: 900 },
+      },
+      grid: {
+        type: "isometric-board",
+        cols: 10,
+        rows: 9,
+        cellWidth: 40,
+        cellHeight: 20,
+        originX: 400,
+        originY: 120,
+        showCoordinates: true,
+        showBoardOutline: true,
+      },
+      instances: [
+        {
+          id: "instance.keep",
+          prefabId: "keep",
+          gridX: 2,
+          gridY: 3,
+          render: {
+            visible: true,
+            locked: false,
+            zIndexMode: "footprint",
+            zIndex: null,
+          },
+        },
+      ],
+      randomPools: [],
+    },
+  };
+}
+
 test("city map building editor ships standalone files and shared layout example", () => {
   assert.equal(fs.existsSync(indexPath), true);
   assert.equal(fs.existsSync(readmePath), true);
   assert.equal(fs.existsSync(examplePath), true);
   assert.equal(fs.existsSync(cityViewPath), true);
   assert.equal(fs.existsSync(cityStageLayoutPath), true);
 });
 
 test("editor keeps entity-first controls instead of old hardcoded building-only wording", () => {
   const html = readText(indexPath);
@@ -94,62 +354,50 @@ test("editor keeps entity-first controls instead of old hardcoded building-only
     "resize-lot-width",
     "resize-lot-height",
   ]) {
     assert.match(
       html,
       new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
     );
   }
 });
 
-test("editor keeps split example loading read-only instead of exposing prefab mutation controls", () => {
+test("editor still supports split example composition and migration imports", () => {
   const html = readText(indexPath);
 
   assert.match(html, /renderQuickSelect/);
   assert.match(html, /haozhou-city-prefabs\.example\.json/);
-  assert.match(html, /guardReadOnlyPrefabExample/);
-  assert.match(html, /isReadOnlyPrefabExampleLoaded/);
+  assert.match(html, /normalizePrefabLibrary/);
+  assert.match(html, /normalizeCityLayout/);
+  assert.match(html, /composeEditorEntities/);
   assert.match(html, /composePrefabLayoutForEditor/);
-  assert.doesNotMatch(html, /field-prefab-cols/);
-  assert.doesNotMatch(html, /field-prefab-rows/);
-  assert.doesNotMatch(html, /field-prefab-offset-x/);
-  assert.doesNotMatch(html, /field-prefab-offset-y/);
-  assert.doesNotMatch(html, /renderPrefabPreview/);
-  assert.doesNotMatch(html, /renderPrefabEditor/);
-  assert.doesNotMatch(html, /updatePrefabFromQuickEditor/);
-  assert.doesNotMatch(html, /data-quick-id="keep"/);
-  assert.match(
-    html,
-    /function onCanvasPointerDown\(event\)\s*{\s*if \(guardReadOnlyPrefabExample\(\)\)/
-  );
+  assert.match(html, /function setEditorLayout\(layout, preferredSelectedId = null, readOnlyPrefabExample = null\)/);
   assert.match(
     html,
-    /function exportJsonFile\(\)\s*{\s*if \(guardReadOnlyPrefabExample\(\)\)/
-  );
-  assert.match(
-    html,
-    /async function copyLayoutJson\(\)\s*{\s*if \(guardReadOnlyPrefabExample\(\)\)/
-  );
-  assert.match(
-    html,
-    /function syncLayoutJsonPreview\(\)\s*{\s*if \(isReadOnlyPrefabExampleLoaded\(\)\)/
-  );
-  assert.match(
-    html,
-    /function setEditorLayout\(layout, preferredSelectedId = null, readOnlyPrefabExample = null\)/
-  );
-  assert.match(
-    html,
-    /message:\s*"Prefab-backed example is read-only here\. Import a city layout JSON to edit or export data\."/
+    /function importJsonFile\(event\)/
   );
 });
 
+test("editor separates prefab editing from city layout editing", () => {
+  const html = readText(indexPath);
+
+  assert.match(html, /editor-mode-toggle/);
+  assert.match(html, /Prefab Editor/);
+  assert.match(html, /City Layout/);
+  assert.match(html, /composeEditorEntities/);
+  assert.match(html, /field-instance-prefab-id/);
+  assert.match(html, /exportPrefabLibraryJson/);
+  assert.match(html, /exportCityLayoutJson/);
+  assert.doesNotMatch(html, /field-instance-offset-x/);
+  assert.doesNotMatch(html, /field-instance-offset-y/);
+});
+
 test("editor copy no longer frames the layout around the old 20x20 coarse board", () => {
   const html = readText(indexPath);
 
   assert.doesNotMatch(html, /20×20/);
   assert.doesNotMatch(html, /20 x 20/);
   assert.doesNotMatch(html, /optionalBuildableMask/);
   assert.doesNotMatch(html, /buildablePolygon/);
 });
 
 test("example layout uses the fine city stage grid and prefab-backed instances", () => {
@@ -339,10 +587,200 @@ test("composeCityStageLayout preserves legacy entity imports during migration",
 
   assert.equal(composed.length, 1);
   assert.notEqual(composed[0], legacyEntity);
   assert.equal(composed[0].id, "legacy.keep");
   assert.equal(composed[0].asset.image, "legacy.png");
   assert.equal(composed[0].render.visible, true);
   assert.equal(composed[0].render.locked, false);
   assert.equal(composed[0].render.zIndexMode, "y-sort");
   assert.equal(composed[0].render.zIndex, null);
 });
+
+test("city layout panel render path uses split source data without runtime reference errors", () => {
+  const api = createEditorRuntimeHarness();
+  const { prefabLibrary, cityLayout } = createSplitEditorSources();
+  api.stubUi();
+  api.assignDom({
+    cityLayoutForm: createElement(),
+    propertiesEmpty: createElement(),
+    duplicateEntity: createElement(),
+    deleteEntity: createElement(),
+    selectedReadout: createElement(),
+    fieldInstanceId: createElement(),
+    fieldInstancePrefabId: createElement(),
+    fieldInstanceGridX: createElement(),
+    fieldInstanceGridY: createElement(),
+    fieldInstanceCols: createElement(),
+    fieldInstanceRows: createElement(),
+    fieldInstanceVisible: createElement(),
+    fieldInstanceLocked: createElement(),
+    fieldInstanceZIndexMode: createElement(),
+    fieldInstanceZIndex: createElement(),
+  });
+  api.setSources(prefabLibrary, cityLayout, "instance.keep");
+  api.state.editorMode = "city-layout";
+  api.state.selectedPrefabId = "keep";
+
+  assert.doesNotThrow(() => api.renderCityLayoutPanel("instance.keep"));
+  assert.equal(api.dom.fieldInstanceId.value, "instance.keep");
+  assert.equal(api.dom.fieldInstanceCols.value, 4);
+  assert.equal(api.dom.fieldInstanceRows.value, 3);
+});
+
+test("prefab image uploads resolve the selected prefab and update prefab-owned asset fields", () => {
+  const api = createEditorRuntimeHarness();
+  const { prefabLibrary, cityLayout } = createSplitEditorSources();
+  api.stubUi();
+  api.assignDom({
+    statusLine: createElement(),
+  });
+  api.stubReadImageFile((file, callback) => {
+    callback("data:image/png;base64,test", {
+      naturalWidth: 640,
+      naturalHeight: 320,
+    });
+  });
+  api.setSources(prefabLibrary, cityLayout, "instance.keep");
+  api.state.selectedPrefabId = "keep";
+  const event = {
+    target: {
+      files: [{ name: "keep-upload.png" }],
+      value: "filled",
+    },
+  };
+
+  assert.doesNotThrow(() => api.uploadEntityImage(event));
+  assert.equal(api.getSelectedPrefab().asset.naturalWidth, 640);
+  assert.equal(api.getSelectedPrefab().asset.naturalHeight, 320);
+  assert.equal(api.state.entityPreviews.get("keep"), "data:image/png;base64,test");
+  assert.equal(event.target.value, "");
+});
+
+test("city layout form clamps the source instance before recomposing and export", () => {
+  const api = createEditorRuntimeHarness();
+  const { prefabLibrary, cityLayout } = createSplitEditorSources();
+  api.stubUi();
+  api.assignDom({
+    fieldInstanceId: createElement({ value: "instance.keep" }),
+    fieldInstanceGridX: createElement({ value: "99" }),
+    fieldInstanceGridY: createElement({ value: "99" }),
+    fieldInstanceVisible: createElement({ checked: true }),
+    fieldInstanceLocked: createElement({ checked: false }),
+    fieldInstanceZIndexMode: createElement({ value: "footprint" }),
+    fieldInstanceZIndex: createElement({ value: "" }),
+  });
+  api.setSources(prefabLibrary, cityLayout, "instance.keep");
+  api.state.selectedPrefabId = "keep";
+  api.state.selectedInstanceId = "instance.keep";
+  api.state.selectedId = "instance.keep";
+
+  api.updateCityLayoutFromForm();
+
+  assert.equal(api.getSelectedInstance().gridX, 6);
+  assert.equal(api.getSelectedInstance().gridY, 6);
+  const exported = JSON.parse(api.exportCityLayoutJson());
+  assert.equal(exported.instances[0].gridX, 6);
+  assert.equal(exported.instances[0].gridY, 6);
+});
+
+test("prefab-library imports update prefab state and preserve the current city layout", () => {
+  const api = createEditorRuntimeHarness();
+  const { prefabLibrary, cityLayout } = createSplitEditorSources();
+  api.stubUi();
+  api.stubFileReaderText(
+    JSON.stringify({
+      version: 2,
+      prefabs: [
+        {
+          id: "imported-prefab",
+          name: "Imported Prefab",
+          category: "decoration",
+          entry: { type: "none" },
+          asset: {
+            image: "imported.png",
+            naturalWidth: 128,
+            naturalHeight: 128,
+            scale: 1,
+            anchor: "bottom-center",
+            offsetX: 0,
+            offsetY: 0,
+          },
+          footprint: { cols: 1, rows: 1 },
+          interaction: {
+            clickable: false,
+            label: {
+              text: "Imported",
+              offsetX: 0,
+              offsetY: -12,
+              width: 64,
+              height: 16,
+            },
+            hitArea: {
+              type: "diamond",
+              offsetX: 0,
+              offsetY: 0,
+              width: 32,
+              height: 16,
+            },
+          },
+        },
+      ],
+    })
+  );
+  api.setSources(prefabLibrary, cityLayout, "instance.keep");
+  const previousLayout = JSON.parse(api.exportCityLayoutJson());
+  const event = {
+    target: {
+      files: [{ name: "prefabs.json" }],
+      value: "filled",
+    },
+  };
+
+  api.importJsonFile(event);
+
+  assert.equal(api.state.prefabLibrary.prefabs.length, 1);
+  assert.equal(api.state.prefabLibrary.prefabs[0].id, "imported-prefab");
+  assert.deepEqual(JSON.parse(api.exportCityLayoutJson()), previousLayout);
+  assert.equal(event.target.value, "");
+});
+
+test("prefab selection without a matching instance clears stale instance state and edits the selected prefab", () => {
+  const api = createEditorRuntimeHarness();
+  const { prefabLibrary, cityLayout } = createSplitEditorSources();
+  api.stubUi();
+  api.assignDom({
+    statusLine: createElement(),
+  });
+  api.stubReadImageFile((file, callback) => {
+    callback("data:image/png;base64,watchtower", {
+      naturalWidth: 512,
+      naturalHeight: 128,
+    });
+  });
+  api.setSources(prefabLibrary, cityLayout, "instance.keep");
+  api.state.editorMode = "prefab";
+  api.state.selectedInstanceId = "instance.keep";
+  api.state.selectedId = "instance.keep";
+
+  api.selectPrefab("watchtower");
+
+  assert.equal(api.state.selectedPrefabId, "watchtower");
+  assert.equal(api.state.selectedInstanceId, null);
+  assert.equal(api.state.selectedId, null);
+
+  const keepBefore = api.state.prefabLibrary.prefabs.find((prefab) => prefab.id === "keep");
+  const watchtowerBefore = api.state.prefabLibrary.prefabs.find((prefab) => prefab.id === "watchtower");
+  const event = {
+    target: {
+      files: [{ name: "watchtower-upload.png" }],
+      value: "filled",
+    },
+  };
+
+  api.uploadEntityImage(event);
+
+  assert.equal(watchtowerBefore.asset.naturalWidth, 512);
+  assert.equal(watchtowerBefore.asset.naturalHeight, 128);
+  assert.equal(api.state.entityPreviews.get("watchtower"), "data:image/png;base64,watchtower");
+  assert.equal(keepBefore.asset.naturalWidth, 320);
+  assert.equal(keepBefore.asset.naturalHeight, 240);
+});
diff --git a/tools/city-map-building-editor/index.html b/tools/city-map-building-editor/index.html
index 1bcb485..057cbfd 100644
--- a/tools/city-map-building-editor/index.html
+++ b/tools/city-map-building-editor/index.html
@@ -917,20 +917,24 @@
         <button type="button" id="export-json">导出 JSON</button>
       </div>
       <label class="file-button">上传地图底图<input type="file" id="upload-background" accept="image/*"></label>
       <label class="file-button">上传前景墙体图<input type="file" id="upload-foreground" accept="image/*"></label>
       <label class="file-button">上传建筑图片<input type="file" id="upload-entity-image" accept="image/*"></label>
       <span></span>
       <button type="button" id="calibration-mode-toggle" disabled title="Grid is fixed to the city stage; edit entities only.">Grid fixed</button>
       <button type="button" id="mode-toggle">预览模式</button>
       <label class="toolbar__toggle">缩放画布 <input type="range" id="zoom-slider" min="0.25" max="1.25" step="0.05" value="0.55"> <span id="zoom-value">55%</span></label>
       <button type="button" id="validate-layout">校验布局</button>
+      <div class="toolbar__group">
+        <button type="button" id="editor-mode-toggle">Prefab Editor</button>
+        <span id="editor-mode-readout">Prefab Editor</span>
+      </div>
     </header>
 
     <main class="workspace">
       <aside class="panel" aria-label="左侧建筑列表">
         <section class="panel__section">
           <h2 class="panel__title">建筑列表</h2>
           <div class="button-row">
             <button type="button" id="add-entity">新建建筑</button>
             <button type="button" id="duplicate-entity">复制建筑</button>
             <button type="button" id="delete-entity">删除建筑</button>
@@ -961,20 +965,118 @@
               <span class="inline-label">随机池 JSON</span>
               <textarea id="random-pools-json" spellcheck="false" aria-label="随机池 JSON"></textarea>
             </label>
             <label class="field">
               <span class="inline-label">当前布局 JSON</span>
               <textarea id="layout-json-preview" spellcheck="false" readonly aria-label="当前布局 JSON"></textarea>
             </label>
             <button type="button" id="copy-layout-json">复制当前布局 JSON 到剪贴板</button>
           </div>
         </details>
+        <section class="panel__section hidden" id="properties-empty">
+          <div class="empty-state">Prefab Editor owns visual, interaction, and footprint truth. City Layout owns placement and instance render metadata only.</div>
+        </section>
+
+        <form class="panel__section form-grid hidden" id="prefab-form">
+          <h2 class="panel__title">Prefab Editor</h2>
+          <div class="field-row">
+            <label class="field"><span>Prefab ID</span><input id="field-prefab-id" type="text"></label>
+            <label class="field"><span>Prefab Name</span><input id="field-prefab-name" type="text"></label>
+          </div>
+          <label class="field">
+            <span>Category</span>
+            <select id="field-prefab-category">
+              <option value="special">鐗规畩寤虹瓚</option>
+              <option value="house">鏅�氬缓绛?/option>
+              <option value="random-slot">闅忔満姘戝眳妲戒綅</option>
+              <option value="decoration">瑁呴グ寤虹瓚</option>
+              <option value="ground-decoration">鍦伴潰瑁呴グ</option>
+            </select>
+          </label>
+          <h2 class="panel__title">鍏ュ彛缁戝畾</h2>
+          <label class="field">
+            <span>鍏ュ彛绫诲瀷</span>
+            <select id="field-prefab-entry-type">
+              <option value="none">鏃犲叆鍙?/option>
+              <option value="house">寤虹瓚鍏ュ彛 house</option>
+              <option value="city-entry">鍦扮偣鍏ュ彛 city-entry</option>
+            </select>
+          </label>
+          <label class="field"><span>houseId</span><input id="field-prefab-house-id" type="text" placeholder="house.kulan.keep"></label>
+          <label class="field"><span>cityEntryId</span><input id="field-prefab-city-entry-id" type="text" placeholder="city-entry.kulan.leader-residence"></label>
+          <h2 class="panel__title">鍥剧墖</h2>
+          <label class="field"><span>鍥剧墖璺緞</span><input id="field-prefab-image" type="text" placeholder="ui/yuansu/鑿卞舰鏍煎瓙/shuaifu.png"></label>
+          <div class="field-row">
+            <label class="field"><span>鍘熷瀹藉害</span><input id="field-prefab-natural-width" type="number" min="0" step="1"></label>
+            <label class="field"><span>鍘熷楂樺害</span><input id="field-prefab-natural-height" type="number" min="0" step="1"></label>
+          </div>
+          <div class="field-row">
+            <label class="field"><span>鍥剧墖缂╂斁</span><input id="field-prefab-scale" type="number" min="0.01" step="0.01"></label>
+            <label class="field"><span>鍥剧墖閿氱偣</span><select id="field-prefab-anchor"><option value="bottom-center">搴曢儴灞呬腑</option><option value="center">涓績</option><option value="top-left">宸︿笂瑙?/option></select></label>
+          </div>
+          <div class="field-row">
+            <label class="field"><span>鍥剧墖鍋忕Щ X</span><input id="field-prefab-offset-x" type="number" step="1"></label>
+            <label class="field"><span>鍥剧墖鍋忕Щ Y</span><input id="field-prefab-offset-y" type="number" step="1"></label>
+          </div>
+          <h2 class="panel__title">Footprint</h2>
+          <div class="field-row">
+            <label class="field"><span>鍗犲湴鍒楁暟</span><input id="field-prefab-cols" type="number" min="1" step="1"></label>
+            <label class="field"><span>鍗犲湴琛屾暟</span><input id="field-prefab-rows" type="number" min="1" step="1"></label>
+          </div>
+          <h2 class="panel__title">浜や簰</h2>
+          <div class="check-row">
+            <label><input id="field-prefab-clickable" type="checkbox"> 鍙偣鍑?/label>
+          </div>
+          <label class="field"><span>鏍囩鎸夐挳鏂囧瓧</span><input id="field-prefab-label-text" type="text"></label>
+          <div class="field-row">
+            <label class="field"><span>鏍囩鍋忕Щ X</span><input id="field-prefab-label-offset-x" type="number" step="1"></label>
+            <label class="field"><span>鏍囩鍋忕Щ Y</span><input id="field-prefab-label-offset-y" type="number" step="1"></label>
+          </div>
+          <div class="field-row">
+            <label class="field"><span>鏍囩瀹藉害</span><input id="field-prefab-label-width" type="number" min="1" step="1"></label>
+            <label class="field"><span>鏍囩楂樺害</span><input id="field-prefab-label-height" type="number" min="1" step="1"></label>
+          </div>
+          <label class="field"><span>鐐瑰嚮鍖哄煙褰㈢姸</span><select id="field-prefab-hit-type"><option value="rect">鐭╁舰</option><option value="ellipse">妞渾</option></select></label>
+          <div class="field-row">
+            <label class="field"><span>鐐瑰嚮鍖哄煙鍋忕Щ X</span><input id="field-prefab-hit-offset-x" type="number" step="1"></label>
+            <label class="field"><span>鐐瑰嚮鍖哄煙鍋忕Щ Y</span><input id="field-prefab-hit-offset-y" type="number" step="1"></label>
+          </div>
+          <div class="field-row">
+            <label class="field"><span>鐐瑰嚮鍖哄煙瀹藉害</span><input id="field-prefab-hit-width" type="number" min="1" step="1"></label>
+            <label class="field"><span>鐐瑰嚮鍖哄煙楂樺害</span><input id="field-prefab-hit-height" type="number" min="1" step="1"></label>
+          </div>
+        </form>
+
+        <form class="panel__section form-grid hidden" id="city-layout-form">
+          <h2 class="panel__title">City Layout</h2>
+          <div class="field-row">
+            <label class="field"><span>Instance ID</span><input id="field-instance-id" type="text"></label>
+            <label class="field"><span>Prefab ID</span><input id="field-instance-prefab-id" type="text" readonly></label>
+          </div>
+          <div class="field-row">
+            <label class="field"><span>鏍煎瓙 X</span><input id="field-instance-grid-x" type="number" step="1"></label>
+            <label class="field"><span>鏍煎瓙 Y</span><input id="field-instance-grid-y" type="number" step="1"></label>
+          </div>
+          <div class="field-row">
+            <label class="field"><span>Footprint 鍒楁暟</span><input id="field-instance-cols" type="number" readonly></label>
+            <label class="field"><span>Footprint 琛屾暟</span><input id="field-instance-rows" type="number" readonly></label>
+          </div>
+          <h2 class="panel__title">Instance Render</h2>
+          <div class="check-row">
+            <label><input id="field-instance-visible" type="checkbox"> 鍙</label>
+            <label><input id="field-instance-locked" type="checkbox"> 閿佸畾</label>
+          </div>
+          <div class="field-row">
+            <label class="field"><span>灞傜骇妯″紡</span><select id="field-instance-z-index-mode"><option value="y-sort">鎸?Y 鑷姩鎺掑簭</option><option value="manual">鎵嬪姩灞傜骇</option></select></label>
+            <label class="field"><span>鎵嬪姩灞傜骇</span><input id="field-instance-z-index" type="number" step="1"></label>
+          </div>
+        </form>
       </aside>
 
       <section class="editor" aria-label="中央画布">
         <div class="editor__bar">
           <div class="editor__meta">
             <span><strong id="map-title">濠州城</strong></span>
             <span id="stage-readout">舞台 2048x1152</span>
             <span id="base-readout">地图编辑区域 1771x976 @ 139,88</span>
             <span id="selected-readout">未选中建筑实体</span>
           </div>
@@ -1221,41 +1323,58 @@
         visible: true,
         showCoordinates: true,
         showOutline: true
       },
       entities: [],
       randomPools: [
         { id: "decor-house-pool-basic", name: "普通民居池", candidates: [] }
       ]
     };
 
+    const EMPTY_PREFAB_LIBRARY = {
+      prefabs: []
+    };
+
+    const EMPTY_CITY_LAYOUT = {
+      version: 2,
+      map: clone(EMPTY_LAYOUT.map),
+      grid: clone(EMPTY_LAYOUT.grid),
+      instances: [],
+      randomPools: clone(EMPTY_LAYOUT.randomPools)
+    };
+
     const CATEGORY_LABELS = {
       special: "特殊建筑",
       house: "普通建筑",
       "random-slot": "随机民居槽位",
       decoration: "装饰建筑",
       "ground-decoration": "地面装饰"
     };
 
     const layerState = {
       buildable: false,
       validGrid: true,
       footprint: true,
       imageBounds: true,
       labels: true,
       hitArea: true,
       forbidden: false
     };
 
     const state = {
+      prefabLibrary: normalizePrefabLibrary(EMPTY_PREFAB_LIBRARY),
+      cityLayout: normalizeCityLayout(EMPTY_CITY_LAYOUT),
       layout: normalizeLayout(EMPTY_LAYOUT),
       selectedId: null,
+      selectedPrefabId: null,
+      selectedInstanceId: null,
+      editorMode: "prefab",
       filter: "all",
       mode: "edit",
       calibrationMode: false,
       zoom: 0.55,
       opacity: {
         background: 1,
         foreground: 1,
         buildable: 0.9,
         grid: 1
       },
@@ -1272,20 +1391,22 @@
 
     document.addEventListener("DOMContentLoaded", init);
 
     function init() {
       for (const id of [
         "app",
         "new-layout",
         "load-example",
         "import-json",
         "export-json",
+        "editor-mode-toggle",
+        "editor-mode-readout",
         "upload-background",
         "upload-foreground",
         "upload-entity-image",
         "calibration-mode-toggle",
         "mode-toggle",
         "zoom-slider",
         "zoom-value",
         "validate-layout",
         "category-filter",
         "entity-list",
@@ -1330,20 +1451,23 @@
         "grid-origin-x",
         "grid-origin-y",
         "grid-cell-width",
         "grid-cell-height",
         "background-opacity",
         "foreground-opacity",
         "buildable-opacity",
         "grid-opacity",
         "entity-form",
         "entity-form-empty",
+        "properties-empty",
+        "prefab-form",
+        "city-layout-form",
         "add-entity",
         "duplicate-entity",
         "delete-entity",
         "field-id",
         "field-name",
         "field-category",
         "field-entry-type",
         "field-house-id",
         "field-city-entry-id",
         "field-image",
@@ -1368,24 +1492,61 @@
         "field-label-offset-x",
         "field-label-offset-y",
         "field-label-width",
         "field-label-height",
         "field-hit-type",
         "field-hit-offset-x",
         "field-hit-offset-y",
         "field-hit-width",
         "field-hit-height",
         "field-random-pool-id",
-        "field-random-tags"
+        "field-random-tags",
+        "field-prefab-id",
+        "field-prefab-name",
+        "field-prefab-category",
+        "field-prefab-entry-type",
+        "field-prefab-house-id",
+        "field-prefab-city-entry-id",
+        "field-prefab-image",
+        "field-prefab-natural-width",
+        "field-prefab-natural-height",
+        "field-prefab-scale",
+        "field-prefab-anchor",
+        "field-prefab-offset-x",
+        "field-prefab-offset-y",
+        "field-prefab-cols",
+        "field-prefab-rows",
+        "field-prefab-clickable",
+        "field-prefab-label-text",
+        "field-prefab-label-offset-x",
+        "field-prefab-label-offset-y",
+        "field-prefab-label-width",
+        "field-prefab-label-height",
+        "field-prefab-hit-type",
+        "field-prefab-hit-offset-x",
+        "field-prefab-hit-offset-y",
+        "field-prefab-hit-width",
+        "field-prefab-hit-height",
+        "field-instance-id",
+        "field-instance-prefab-id",
+        "field-instance-grid-x",
+        "field-instance-grid-y",
+        "field-instance-cols",
+        "field-instance-rows",
+        "field-instance-visible",
+        "field-instance-locked",
+        "field-instance-z-index-mode",
+        "field-instance-z-index"
       ]) {
         dom[toKey(id)] = document.getElementById(id);
       }
+      syncEditorLayoutFromSources();
       bindEvents();
       render();
     }
 
     function toKey(id) {
       return id.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
     }
 
     function bindEvents() {
       dom.newLayout.addEventListener("click", () => {
@@ -1393,41 +1554,47 @@
           return;
         }
         setEditorLayout(EMPTY_LAYOUT);
                 setStatus("已新建空白布局。");
         render();
       });
 
       dom.importJson.addEventListener("change", importJsonFile);
       dom.loadExample.addEventListener("click", loadHaozhouExample);
       dom.exportJson.addEventListener("click", exportJsonFile);
+      dom.editorModeToggle.addEventListener("click", toggleEditorMode);
       dom.uploadBackground.addEventListener("change", (event) => uploadMapImage(event, "background"));
       dom.uploadForeground.addEventListener("change", (event) => uploadMapImage(event, "foreground"));
       dom.uploadEntityImage.addEventListener("change", uploadEntityImage);
       dom.modeToggle.addEventListener("click", toggleMode);
       dom.zoomSlider.addEventListener("input", () => {
         state.zoom = Number(dom.zoomSlider.value);
         renderCanvas();
       });
       dom.validateLayout.addEventListener("click", () => {
         const result = validateLayout(state.layout);
         renderValidation(result);
         setStatus(`校验完成：${result.errors} 个错误，${result.warnings} 个警告，${result.info} 条提示。`);
       });
       dom.categoryFilter.addEventListener("change", () => {
         state.filter = dom.categoryFilter.value;
         renderEntityList();
       });
       dom.quickSelect.addEventListener("click", (event) => {
         const button = event.target.closest("[data-quick-id]");
+        const prefabButton = event.target.closest("[data-quick-prefab-id]");
         if (button != null) {
-          selectEntity(button.dataset.quickId);
+          selectInstance(button.dataset.quickId);
+          return;
+        }
+        if (prefabButton != null) {
+          selectPrefab(prefabButton.dataset.quickPrefabId);
         }
       });
       dom.addEntity.addEventListener("click", addEntity);
       dom.duplicateEntity.addEventListener("click", duplicateEntity);
       dom.deleteEntity.addEventListener("click", deleteEntity);
       dom.copyLayoutJson.addEventListener("click", copyLayoutJson);
       dom.randomPoolsJson.addEventListener("change", updateRandomPoolsFromTextarea);
       dom.optionalMaskJson.addEventListener("change", updateOptionalMaskFromTextarea);
       dom.forbiddenPolygonsJson.addEventListener("change", updateForbiddenPolygonsFromTextarea);
 
@@ -1479,23 +1646,28 @@
 
       for (const element of [
         dom.mapId,
         dom.mapName,
         dom.mapBackgroundImage,
         dom.mapForegroundImage
       ]) {
         element.addEventListener("input", updateMapFromForm);
       }
 
-      for (const element of dom.entityForm.elements) {
-        element.addEventListener("input", updateEntityFromForm);
-        element.addEventListener("change", updateEntityFromForm);
+      for (const element of dom.prefabForm.elements) {
+        element.addEventListener("input", updatePrefabFromForm);
+        element.addEventListener("change", updatePrefabFromForm);
+      }
+
+      for (const element of dom.cityLayoutForm.elements) {
+        element.addEventListener("input", updateCityLayoutFromForm);
+        element.addEventListener("change", updateCityLayoutFromForm);
       }
 
       dom.entityLayer.addEventListener("click", onCanvasClick);
       dom.mapSvg.addEventListener("click", onBoardClick);
       dom.mapSvg.addEventListener("mousemove", onBoardMouseMove);
       dom.mapSvg.addEventListener("mouseleave", () => {
         if (state.hoverGrid != null) {
           state.hoverGrid = null;
           renderSvgOverlay();
         }
@@ -1541,20 +1713,142 @@
         grid,
         entities: Array.isArray(source.entities)
           ? source.entities.map((entity) => normalizeEntity(entity, grid))
           : [],
         randomPools: Array.isArray(source.randomPools)
           ? source.randomPools
         : clone(EMPTY_LAYOUT.randomPools)
       };
     }
 
+    function normalizePrefabLibrary(input) {
+      const source = input && typeof input === "object" ? input : {};
+      return {
+        prefabs: Array.isArray(source.prefabs)
+          ? source.prefabs.map((prefab) => normalizePrefab(prefab))
+          : []
+      };
+    }
+
+    function normalizeCityLayout(input) {
+      const source = input && typeof input === "object" ? input : {};
+      const normalizedLayout = normalizeLayout({
+        version: source.version ?? EMPTY_CITY_LAYOUT.version,
+        map: source.map,
+        grid: source.grid,
+        randomPools: source.randomPools
+      });
+      return {
+        version: normalizedLayout.version,
+        map: normalizedLayout.map,
+        grid: normalizedLayout.grid,
+        instances: Array.isArray(source.instances)
+          ? source.instances.map((instance) => normalizeCityInstance(instance, normalizedLayout.grid))
+          : [],
+        randomPools: normalizedLayout.randomPools
+      };
+    }
+
+    function normalizePrefab(prefab) {
+      const safe = prefab && typeof prefab === "object" ? prefab : {};
+      const safeInteraction = safe.interaction || {};
+      return {
+        id: String(safe.id || "prefab"),
+        name: String(safe.name || "未命名 Prefab"),
+        category: CATEGORY_LABELS[safe.category] ? safe.category : "decoration",
+        entry: normalizeEntry(safe.entry),
+        asset: {
+          image: "",
+          naturalWidth: 512,
+          naturalHeight: 512,
+          scale: 0.25,
+          offsetX: 0,
+          offsetY: 0,
+          anchor: "bottom-center",
+          ...(safe.asset || {})
+        },
+        footprint: {
+          cols: Math.max(1, Math.round(numberOr(safe.footprint?.cols, 2))),
+          rows: Math.max(1, Math.round(numberOr(safe.footprint?.rows, 2)))
+        },
+        interaction: {
+          clickable: Boolean(safeInteraction.clickable),
+          label: {
+            text: "",
+            offsetX: 0,
+            offsetY: -120,
+            width: 96,
+            height: 32,
+            ...(safeInteraction.label || {})
+          },
+          hitArea: {
+            type: "ellipse",
+            offsetX: 0,
+            offsetY: -8,
+            width: 120,
+            height: 48,
+            ...(safeInteraction.hitArea || {})
+          }
+        }
+      };
+    }
+
+    function normalizeCityInstance(instance, grid = EMPTY_CITY_LAYOUT.grid) {
+      const safe = instance && typeof instance === "object" ? instance : {};
+      return {
+        id: String(safe.id || "instance"),
+        prefabId: String(safe.prefabId || ""),
+        gridX: Math.min(Math.max(Math.round(numberOr(safe.gridX, 0)), 0), Math.max(0, grid.cols - 1)),
+        gridY: Math.min(Math.max(Math.round(numberOr(safe.gridY, 0)), 0), Math.max(0, grid.rows - 1)),
+        render: {
+          visible: safe.render?.visible !== false,
+          locked: Boolean(safe.render?.locked),
+          zIndexMode: safe.render?.zIndexMode === "manual" ? "manual" : "y-sort",
+          zIndex: safe.render?.zIndex == null ? null : numberOr(safe.render.zIndex, null)
+        }
+      };
+    }
+
+    function composeEditorEntities(prefabLibrary, cityLayout) {
+      if (!Array.isArray(cityLayout?.instances) || !Array.isArray(prefabLibrary?.prefabs)) {
+        return [];
+      }
+
+      const prefabById = new Map(
+        prefabLibrary.prefabs.map((prefab) => [prefab.id, prefab])
+      );
+
+      return cityLayout.instances.flatMap((instance) => {
+        const prefab = prefabById.get(instance.prefabId);
+        if (prefab == null) {
+          return [];
+        }
+
+        return [{
+          id: instance.id,
+          prefabId: prefab.id,
+          name: prefab.name,
+          category: prefab.category,
+          entry: clone(prefab.entry),
+          asset: clone(prefab.asset),
+          lot: {
+            gridX: instance.gridX,
+            gridY: instance.gridY,
+            cols: prefab.footprint.cols,
+            rows: prefab.footprint.rows
+          },
+          render: clone(instance.render || {}),
+          interaction: clone(prefab.interaction)
+        }];
+      });
+    }
+
     function composePrefabLayoutForEditor(layoutSource, prefabLibrary) {
       if (!Array.isArray(layoutSource?.instances) || !Array.isArray(prefabLibrary?.prefabs)) {
         return layoutSource;
       }
 
       const prefabById = new Map(
         prefabLibrary.prefabs.map((prefab) => [prefab.id, prefab])
       );
 
       return {
@@ -1577,20 +1871,164 @@
               cols: prefab.footprint.cols,
               rows: prefab.footprint.rows
             },
             render: clone(instance.render || {}),
             interaction: clone(prefab.interaction)
           };
         })
       };
     }
 
+    function exportPrefabLibraryJson() {
+      return `${JSON.stringify(state.prefabLibrary, null, 2)}\n`;
+    }
+
+    function exportCityLayoutJson() {
+      return `${JSON.stringify(state.cityLayout, null, 2)}\n`;
+    }
+
+    function syncEditorLayoutFromSources(preferredSelectedInstanceId = state.selectedInstanceId) {
+      state.layout = normalizeLayout({
+        version: state.cityLayout.version,
+        map: clone(state.cityLayout.map),
+        grid: clone(state.cityLayout.grid),
+        entities: composeEditorEntities(state.prefabLibrary, state.cityLayout),
+        randomPools: clone(state.cityLayout.randomPools)
+      });
+
+      const availableInstanceIds = new Set(state.cityLayout.instances.map((instance) => instance.id));
+      state.selectedInstanceId = availableInstanceIds.has(preferredSelectedInstanceId)
+        ? preferredSelectedInstanceId
+        : state.cityLayout.instances[0]?.id || null;
+      state.selectedId = state.selectedInstanceId;
+
+      const availablePrefabIds = new Set(state.prefabLibrary.prefabs.map((prefab) => prefab.id));
+      if (!availablePrefabIds.has(state.selectedPrefabId)) {
+        state.selectedPrefabId = state.prefabLibrary.prefabs[0]?.id || null;
+      }
+
+      const selectedInstance = getSelectedInstance();
+      if (selectedInstance != null && (state.selectedPrefabId == null || !availablePrefabIds.has(state.selectedPrefabId))) {
+        state.selectedPrefabId = selectedInstance.prefabId;
+      }
+    }
+
+    function decomposeLayoutToSources(layout) {
+      const normalizedLayout = normalizeLayout(layout);
+      if (Array.isArray(layout?.prefabs)) {
+        return {
+          prefabLibrary: normalizePrefabLibrary(layout),
+          cityLayout: normalizeCityLayout(state.cityLayout)
+        };
+      }
+
+      if (Array.isArray(layout?.instances)) {
+        return {
+          prefabLibrary: normalizePrefabLibrary(state.prefabLibrary),
+          cityLayout: normalizeCityLayout(layout)
+        };
+      }
+
+      if (Array.isArray(layout?.entities)) {
+        const prefabs = [];
+        const instances = [];
+        for (const entity of normalizedLayout.entities) {
+          const prefabId = entity.prefabId || entity.id;
+          prefabs.push(normalizePrefab({
+            id: prefabId,
+            name: entity.name,
+            category: entity.category,
+            entry: entity.entry,
+            asset: entity.asset,
+            footprint: {
+              cols: entity.lot.cols,
+              rows: entity.lot.rows
+            },
+            interaction: entity.interaction
+          }));
+          instances.push(normalizeCityInstance({
+            id: entity.id,
+            prefabId,
+            gridX: entity.lot.gridX,
+            gridY: entity.lot.gridY,
+            render: entity.render
+          }, normalizedLayout.grid));
+        }
+        return {
+          prefabLibrary: normalizePrefabLibrary({ prefabs }),
+          cityLayout: normalizeCityLayout({
+            version: normalizedLayout.version,
+            map: normalizedLayout.map,
+            grid: normalizedLayout.grid,
+            instances,
+            randomPools: normalizedLayout.randomPools
+          })
+        };
+      }
+
+      return {
+        prefabLibrary: normalizePrefabLibrary(state.prefabLibrary),
+        cityLayout: normalizeCityLayout(layout)
+      };
+    }
+
+    function syncMapAndGridToSources() {
+      state.cityLayout.map = clone(state.layout.map);
+      state.cityLayout.grid = clone(state.layout.grid);
+    }
+
+    function syncEntityBackToSources(entity) {
+      if (entity == null) {
+        return;
+      }
+      const instance = state.cityLayout.instances.find((candidate) => candidate.id === entity.id);
+      if (instance != null) {
+        instance.gridX = entity.lot.gridX;
+        instance.gridY = entity.lot.gridY;
+        instance.render = {
+          visible: entity.render.visible,
+          locked: entity.render.locked,
+          zIndexMode: entity.render.zIndexMode,
+          zIndex: entity.render.zIndex ?? null
+        };
+      }
+      const prefab = state.prefabLibrary.prefabs.find((candidate) => candidate.id === (entity.prefabId || state.selectedPrefabId));
+      if (prefab != null) {
+        prefab.name = entity.name;
+        prefab.category = entity.category;
+        prefab.entry = clone(entity.entry);
+        prefab.asset = clone(entity.asset);
+        prefab.footprint = {
+          cols: entity.lot.cols,
+          rows: entity.lot.rows
+        };
+        prefab.interaction = clone(entity.interaction);
+      }
+    }
+
+    function setEditorSources(
+      prefabLibrary,
+      cityLayout,
+      preferredSelectedId = null,
+      readOnlyPrefabExample = null
+    ) {
+      state.prefabLibrary = normalizePrefabLibrary(prefabLibrary);
+      state.cityLayout = normalizeCityLayout(cityLayout);
+      state.readOnlyPrefabExample = readOnlyPrefabExample;
+      state.entityPreviews.clear();
+      state.backgroundPreview = "";
+      state.foregroundPreview = "";
+      syncEditorLayoutFromSources(preferredSelectedId);
+      state.centerSelectedAfterRender = true;
+      render();
+    }
+
     function isReadOnlyPrefabExampleLoaded() {
       return state.readOnlyPrefabExample != null;
     }
 
     function guardReadOnlyPrefabExample() {
       if (!isReadOnlyPrefabExampleLoaded()) {
         return false;
       }
       setStatus(state.readOnlyPrefabExample.message);
       return true;
@@ -1842,20 +2280,41 @@
       renderQuickSelect();
       renderEntityList();
       renderProperties();
       renderCanvas();
       syncRandomPoolsTextarea();
       syncLayoutJsonPreview();
     }
 
     function renderQuickSelect() {
       dom.quickSelect.innerHTML = "";
+      if (state.editorMode === "prefab") {
+        const prefabs = [...state.prefabLibrary.prefabs].sort((first, second) =>
+          first.category === second.category
+            ? first.name.localeCompare(second.name, "zh-Hans-CN")
+            : first.category.localeCompare(second.category)
+        );
+
+        for (const prefab of prefabs) {
+          const button = document.createElement("button");
+          button.type = "button";
+          button.dataset.quickPrefabId = prefab.id;
+          button.textContent = prefab.name;
+          button.title = `${prefab.id} · ${CATEGORY_LABELS[prefab.category] || prefab.category}`;
+          if (prefab.id === state.selectedPrefabId) {
+            button.classList.add("is-selected");
+          }
+          dom.quickSelect.append(button);
+        }
+        return;
+      }
+
       const entities = [...state.layout.entities].sort((first, second) =>
         first.category === second.category
           ? first.name.localeCompare(second.name, "zh-Hans-CN")
           : first.category.localeCompare(second.category)
       );
 
       for (const entity of entities) {
         const button = document.createElement("button");
         button.type = "button";
         button.dataset.quickId = entity.id;
@@ -1868,20 +2327,22 @@
       }
     }
 
     function renderToolbarState() {
       dom.app.classList.toggle("is-preview", state.mode === "preview");
       state.calibrationMode = false;
       dom.app.classList.remove("is-calibrating");
       dom.calibrationModeToggle.textContent = "Grid fixed";
       dom.calibrationModeToggle.disabled = true;
       dom.modeToggle.textContent = state.mode === "preview" ? "编辑模式" : "预览模式";
+      dom.editorModeToggle.textContent = state.editorMode === "prefab" ? "City Layout" : "Prefab Editor";
+      dom.editorModeReadout.textContent = state.editorMode === "prefab" ? "Prefab Editor" : "City Layout";
       dom.zoomSlider.value = String(state.zoom);
       dom.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
       dom.snapEnabled.checked = Boolean(state.layout.grid.snap);
       dom.showBuildable.checked = layerState.buildable;
       dom.showValidGrid.checked = layerState.validGrid;
       dom.showFootprint.checked = layerState.footprint;
       dom.showImageBounds.checked = layerState.imageBounds;
       dom.showLabels.checked = layerState.labels;
       dom.showHitArea.checked = layerState.hitArea;
       dom.showForbidden.checked = layerState.forbidden;
@@ -1898,30 +2359,36 @@
         dom.uploadForeground,
         dom.showCoordinates,
         dom.showBoardOutline,
         dom.snapEnabled,
         dom.optionalMaskJson,
         dom.forbiddenPolygonsJson,
         dom.randomPoolsJson,
         dom.exportJson,
         dom.copyLayoutJson,
         dom.addEntity,
+        dom.editorModeToggle,
         dom.uploadEntityImage
       ]) {
         element.disabled = readOnly;
       }
 
-      const hasEntitySelection = getSelectedEntity() != null;
-      dom.duplicateEntity.disabled = readOnly || !hasEntitySelection;
-      dom.deleteEntity.disabled = readOnly || !hasEntitySelection;
-      for (const element of dom.entityForm.elements) {
-        element.disabled = readOnly || !hasEntitySelection;
+      const hasPrefabSelection = getSelectedPrefab() != null;
+      const hasInstanceSelection = getSelectedInstance() != null;
+      const hasEditableSelection = state.editorMode === "prefab" ? hasPrefabSelection : hasInstanceSelection;
+      dom.duplicateEntity.disabled = readOnly || !hasEditableSelection;
+      dom.deleteEntity.disabled = readOnly || !hasEditableSelection;
+      for (const element of dom.prefabForm.elements) {
+        element.disabled = readOnly || !hasPrefabSelection;
+      }
+      for (const element of dom.cityLayoutForm.elements) {
+        element.disabled = readOnly || !hasInstanceSelection;
       }
     }
 
     function renderMapForm() {
       const map = state.layout.map;
       dom.mapId.value = map.id;
       dom.mapName.value = map.name;
       dom.mapBackgroundImage.value = map.backgroundImage;
       dom.mapForegroundImage.value = map.foregroundImage;
     }
@@ -1943,39 +2410,84 @@
       dom.showCoordinates.checked = state.layout.grid.showCoordinates !== false;
       dom.showBoardOutline.checked = state.layout.grid.showOutline !== false;
       dom.backgroundOpacity.value = String(state.opacity.background);
       dom.foregroundOpacity.value = String(state.opacity.foreground);
       dom.buildableOpacity.value = String(state.opacity.buildable);
       dom.gridOpacity.value = String(state.opacity.grid);
       renderReadOnlyPrefabState();
     }
 
     function renderEntityList() {
+      dom.entityList.innerHTML = "";
+      if (state.editorMode === "prefab") {
+        const prefabs = state.prefabLibrary.prefabs.filter((prefab) =>
+          state.filter === "all" ? true : prefab.category === state.filter
+        );
+
+        if (prefabs.length === 0) {
+          const empty = document.createElement("div");
+          empty.className = "empty-state";
+          empty.textContent = "当前类型下没有 prefab。";
+          dom.entityList.append(empty);
+          return;
+        }
+
+        for (const prefab of prefabs) {
+          const button = document.createElement("button");
+          button.type = "button";
+          button.className = `entity-card${prefab.id === state.selectedPrefabId ? " is-selected" : ""}`;
+          button.dataset.prefabId = prefab.id;
+          button.addEventListener("click", () => selectPrefab(prefab.id));
+
+          const thumb = document.createElement("span");
+          thumb.className = "entity-card__thumb";
+          const imageUrl = getPreviewUrl(prefab.asset.image);
+          if (imageUrl) {
+            const image = document.createElement("img");
+            image.src = imageUrl;
+            image.alt = "";
+            thumb.append(image);
+          } else {
+            thumb.textContent = "无图";
+          }
+
+          const text = document.createElement("span");
+          text.innerHTML = `
+            <span class="entity-card__name">${escapeHtml(prefab.name)}</span>
+            <span class="entity-card__meta">${escapeHtml(prefab.id)} · ${escapeHtml(CATEGORY_LABELS[prefab.category] || prefab.category)} · ${prefab.footprint.cols} x ${prefab.footprint.rows} 格</span>
+            <span class="entity-card__entry">${escapeHtml(getEntrySummary(prefab))}</span>
+          `;
+
+          button.append(thumb, text);
+          dom.entityList.append(button);
+        }
+        return;
+      }
+
       const entities = state.layout.entities.filter((entity) =>
         state.filter === "all" ? true : entity.category === state.filter
       );
 
-      dom.entityList.innerHTML = "";
       if (entities.length === 0) {
         const empty = document.createElement("div");
         empty.className = "empty-state";
         empty.textContent = "当前类型下没有建筑。";
         dom.entityList.append(empty);
         return;
       }
 
       for (const entity of entities) {
         const button = document.createElement("button");
         button.type = "button";
         button.className = `entity-card${entity.id === state.selectedId ? " is-selected" : ""}`;
         button.dataset.entityId = entity.id;
-        button.addEventListener("click", () => selectEntity(entity.id));
+        button.addEventListener("click", () => selectInstance(entity.id));
 
         const thumb = document.createElement("span");
         thumb.className = "entity-card__thumb";
         const imageUrl = getEntityImageUrl(entity);
         if (imageUrl) {
           const image = document.createElement("img");
           image.src = imageUrl;
           image.alt = "";
           thumb.append(image);
         } else {
@@ -1987,85 +2499,119 @@
           <span class="entity-card__name">${escapeHtml(entity.name)}</span>
           <span class="entity-card__meta">${escapeHtml(entity.id)} · ${escapeHtml(CATEGORY_LABELS[entity.category] || entity.category)} · ${entity.lot.cols} x ${entity.lot.rows} 格</span>
           <span class="entity-card__entry">${escapeHtml(getEntrySummary(entity))}</span>
         `;
 
         button.append(thumb, text);
         dom.entityList.append(button);
       }
     }
 
-    function toggleHitAreaFields(entity) {
+    function togglePrefabHitAreaFields(entity) {
       const shouldShow = Boolean(entity?.interaction.clickable);
       const nodes = [
-        dom.fieldHitType.closest("label"),
-        dom.fieldHitOffsetX.closest(".field-row"),
-        dom.fieldHitWidth.closest(".field-row"),
+        dom.fieldPrefabHitType.closest("label"),
+        dom.fieldPrefabHitOffsetX.closest(".field-row"),
+        dom.fieldPrefabHitWidth.closest(".field-row"),
       ].filter(Boolean);
       for (const node of nodes) {
         node.classList.toggle("is-hidden", !shouldShow);
       }
     }
 
     function renderProperties() {
-      const entity = getSelectedEntity();
-      dom.entityForm.classList.toggle("hidden", entity == null);
-      dom.entityFormEmpty.classList.toggle("hidden", entity != null);
-      dom.duplicateEntity.disabled = entity == null;
-      dom.deleteEntity.disabled = entity == null;
+      dom.entityForm.classList.add("hidden");
+      dom.entityFormEmpty.classList.add("hidden");
+      dom.propertiesEmpty.classList.add("hidden");
+      dom.prefabForm.classList.add("hidden");
+      dom.cityLayoutForm.classList.add("hidden");
+
+      if (state.editorMode === "prefab") {
+        renderPrefabPanel(state.selectedPrefabId);
+        return;
+      }
 
-      if (entity == null) {
-        dom.selectedReadout.textContent = "???????";
+      renderCityLayoutPanel(state.selectedInstanceId);
+    }
+
+    function renderPrefabPanel(prefabId) {
+      const prefab = getSelectedPrefab();
+      dom.prefabForm.classList.toggle("hidden", prefab == null);
+      dom.propertiesEmpty.classList.toggle("hidden", prefab == null);
+      dom.duplicateEntity.disabled = prefab == null;
+      dom.deleteEntity.disabled = prefab == null;
+
+      if (prefab == null) {
+        dom.selectedReadout.textContent = "未选中 prefab";
         renderReadOnlyPrefabState();
         return;
       }
 
-      dom.selectedReadout.textContent = `选中 ${entity.name} (${entity.id})`;
-      dom.fieldId.value = entity.id;
-      dom.fieldName.value = entity.name;
-      dom.fieldCategory.value = entity.category;
-      dom.fieldEntryType.value = entity.entry.type;
-      dom.fieldHouseId.value = entity.entry.type === "house" ? entity.entry.houseId : "";
-      dom.fieldCityEntryId.value = entity.entry.type === "city-entry" ? entity.entry.cityEntryId : "";
-      dom.fieldImage.value = entity.asset.image;
-      dom.fieldNaturalWidth.value = entity.asset.naturalWidth;
-      dom.fieldNaturalHeight.value = entity.asset.naturalHeight;
-      dom.fieldScale.value = entity.asset.scale;
-      dom.fieldOffsetX.value = entity.asset.offsetX;
-      dom.fieldOffsetY.value = entity.asset.offsetY;
-      dom.fieldAnchor.value = entity.asset.anchor;
-      dom.fieldLotX.value = Math.round(entity.lot.gridX);
-      dom.fieldLotY.value = Math.round(entity.lot.gridY);
-      dom.fieldCols.value = entity.lot.cols;
-      dom.fieldRows.value = entity.lot.rows;
-      dom.fieldFootprintWidth.value = Math.round(entity.lot.footprintWidth);
-      dom.fieldFootprintHeight.value = Math.round(entity.lot.footprintHeight);
-      dom.fieldVisible.checked = Boolean(entity.render.visible);
-      dom.fieldLocked.checked = Boolean(entity.render.locked);
-      dom.fieldZIndexMode.value = entity.render.zIndexMode;
-      dom.fieldZIndex.value = entity.render.zIndex ?? "";
-      dom.fieldClickable.checked = Boolean(entity.interaction.clickable);
-      dom.fieldLabelText.value = entity.interaction.label.text;
-      dom.fieldLabelOffsetX.value = entity.interaction.label.offsetX;
-      dom.fieldLabelOffsetY.value = entity.interaction.label.offsetY;
-      dom.fieldLabelWidth.value = entity.interaction.label.width;
-      dom.fieldLabelHeight.value = entity.interaction.label.height;
-      dom.fieldHitType.value = entity.interaction.hitArea.type;
-      dom.fieldHitOffsetX.value = entity.interaction.hitArea.offsetX;
-      dom.fieldHitOffsetY.value = entity.interaction.hitArea.offsetY;
-      dom.fieldHitWidth.value = entity.interaction.hitArea.width;
-      dom.fieldHitHeight.value = entity.interaction.hitArea.height;
-      dom.fieldRandomPoolId.value = entity.random?.poolId || "";
-      dom.fieldRandomTags.value = Array.isArray(entity.random?.allowedTags)
-        ? entity.random.allowedTags.join(", ")
-        : "";
-      toggleHitAreaFields(entity);
+      dom.selectedReadout.textContent = `选中 prefab ${prefab.name} (${prefab.id})`;
+      dom.fieldPrefabId.value = prefab.id;
+      dom.fieldPrefabName.value = prefab.name;
+      dom.fieldPrefabCategory.value = prefab.category;
+      dom.fieldPrefabEntryType.value = prefab.entry.type;
+      dom.fieldPrefabHouseId.value = prefab.entry.type === "house" ? prefab.entry.houseId : "";
+      dom.fieldPrefabCityEntryId.value = prefab.entry.type === "city-entry" ? prefab.entry.cityEntryId : "";
+      dom.fieldPrefabImage.value = prefab.asset.image;
+      dom.fieldPrefabNaturalWidth.value = prefab.asset.naturalWidth;
+      dom.fieldPrefabNaturalHeight.value = prefab.asset.naturalHeight;
+      dom.fieldPrefabScale.value = prefab.asset.scale;
+      dom.fieldPrefabOffsetX.value = prefab.asset.offsetX;
+      dom.fieldPrefabOffsetY.value = prefab.asset.offsetY;
+      dom.fieldPrefabAnchor.value = prefab.asset.anchor;
+      dom.fieldPrefabCols.value = prefab.footprint.cols;
+      dom.fieldPrefabRows.value = prefab.footprint.rows;
+      dom.fieldPrefabClickable.checked = Boolean(prefab.interaction.clickable);
+      dom.fieldPrefabLabelText.value = prefab.interaction.label.text;
+      dom.fieldPrefabLabelOffsetX.value = prefab.interaction.label.offsetX;
+      dom.fieldPrefabLabelOffsetY.value = prefab.interaction.label.offsetY;
+      dom.fieldPrefabLabelWidth.value = prefab.interaction.label.width;
+      dom.fieldPrefabLabelHeight.value = prefab.interaction.label.height;
+      dom.fieldPrefabHitType.value = prefab.interaction.hitArea.type;
+      dom.fieldPrefabHitOffsetX.value = prefab.interaction.hitArea.offsetX;
+      dom.fieldPrefabHitOffsetY.value = prefab.interaction.hitArea.offsetY;
+      dom.fieldPrefabHitWidth.value = prefab.interaction.hitArea.width;
+      dom.fieldPrefabHitHeight.value = prefab.interaction.hitArea.height;
+      togglePrefabHitAreaFields(prefab);
+      renderReadOnlyPrefabState();
+    }
+
+    function renderCityLayoutPanel(instanceId) {
+      const instance = getSelectedInstance(instanceId);
+      const prefab = instance == null
+        ? null
+        : getPrefabById(instance.prefabId) || getSelectedPrefab();
+      const entity = instance == null ? null : getComposedEntityById(instance.id);
+      dom.cityLayoutForm.classList.toggle("hidden", instance == null);
+      dom.propertiesEmpty.classList.toggle("hidden", instance == null);
+      dom.duplicateEntity.disabled = instance == null;
+      dom.deleteEntity.disabled = instance == null;
+
+      if (instance == null || entity == null) {
+        dom.selectedReadout.textContent = "未选中布局实例";
+        renderReadOnlyPrefabState();
+        return;
+      }
+
+      dom.selectedReadout.textContent = `选中实例 ${instance.id} -> ${instance.prefabId}`;
+      dom.fieldInstanceId.value = instance.id;
+      dom.fieldInstancePrefabId.value = instance.prefabId;
+      dom.fieldInstanceGridX.value = Math.round(instance.gridX);
+      dom.fieldInstanceGridY.value = Math.round(instance.gridY);
+      dom.fieldInstanceCols.value = entity?.lot.cols ?? prefab.footprint.cols;
+      dom.fieldInstanceRows.value = entity?.lot.rows ?? prefab.footprint.rows;
+      dom.fieldInstanceVisible.checked = Boolean(instance.render.visible);
+      dom.fieldInstanceLocked.checked = Boolean(instance.render.locked);
+      dom.fieldInstanceZIndexMode.value = instance.render.zIndexMode;
+      dom.fieldInstanceZIndex.value = instance.render.zIndex ?? "";
       renderReadOnlyPrefabState();
     }
 
     function renderCanvas() {
       const { map } = state.layout;
       const base = map.baseSpace;
       syncAllLotPixelFields();
       dom.mapTitle.textContent = map.name || map.id || "未命名地图";
       dom.stageReadout.textContent = `舞台 ${map.stageWidth}x${map.stageHeight}`;
       dom.baseReadout.textContent = `地图编辑区域 ${base.width}x${base.height} @ ${base.x},${base.y}`;
@@ -2221,24 +2767,27 @@
         return;
       }
 
       if (entity == null || !layerState.footprint) {
         return;
       }
 
       const bounds = getFootprintBounds(entity);
       const invalid = !isLotInsideBoard(entity, state.layout.grid);
       const controls = document.createDocumentFragment();
-      controls.append(createMoveAnchor(entity.lot.x, entity.lot.y + 34, "拖拽调整占地区域"));
-      controls.append(createLotHandle(bounds.right, (bounds.top + bounds.bottom) / 2, "resize-lot-width", "拖拽增加 / 减少占地列数", "?"));
-      controls.append(createLotHandle((bounds.left + bounds.right) / 2, bounds.top, "resize-lot-height", "拖拽增加 / 减少占地行数", "?"));
-      controls.append(createLotHandle(bounds.right, bounds.top, "resize-lot-area", "拖拽调整占用格数", "?"));
+      if (state.editorMode === "city-layout") {
+        controls.append(createMoveAnchor(entity.lot.x, entity.lot.y + 34, "拖拽调整占地区域"));
+      } else {
+        controls.append(createLotHandle(bounds.right, (bounds.top + bounds.bottom) / 2, "resize-lot-width", "拖拽增加 / 减少占地列数", "?"));
+        controls.append(createLotHandle((bounds.left + bounds.right) / 2, bounds.top, "resize-lot-height", "拖拽增加 / 减少占地行数", "?"));
+        controls.append(createLotHandle(bounds.right, bounds.top, "resize-lot-area", "拖拽调整占用格数", "?"));
+      }
 
       const badge = document.createElement("div");
       badge.className = "lot-count-badge";
       badge.style.left = `${entity.lot.x}px`;
       badge.style.top = `${bounds.top - 8}px`;
       badge.textContent = `${entity.lot.cols} x ${entity.lot.rows} 格`;
       controls.append(badge);
 
       if (invalid) {
         const warning = document.createElement("div");
@@ -2419,21 +2968,23 @@
     }
 
     function getEntityZIndex(entity) {
       if (entity.render.zIndexMode === "manual" && entity.render.zIndex != null && entity.render.zIndex !== "") {
         return Number(entity.render.zIndex);
       }
       return Math.round(entity.lot.y);
     }
 
     function getEntityImageUrl(entity) {
-      return state.entityPreviews.get(entity.id) || getPreviewUrl(entity.asset.image);
+      return state.entityPreviews.get(entity.prefabId || entity.id)
+        || state.entityPreviews.get(entity.id)
+        || getPreviewUrl(entity.asset.image);
     }
 
     function getPreviewUrl(path) {
       if (!path) {
         return "";
       }
       if (/^(data:|blob:|https?:|file:)/i.test(path)) {
         return path;
       }
       if (path.startsWith("../") || path.startsWith("./") || path.startsWith("/")) {
@@ -2444,274 +2995,435 @@
 
     function updateMapFromForm() {
       if (guardReadOnlyPrefabExample()) {
         renderMapForm();
         return;
       }
       state.layout.map.id = dom.mapId.value.trim();
       state.layout.map.name = dom.mapName.value.trim();
       state.layout.map.backgroundImage = dom.mapBackgroundImage.value.trim();
       state.layout.map.foregroundImage = dom.mapForegroundImage.value.trim();
+      syncMapAndGridToSources();
       renderCanvas();
     }
 
     function updateGridFromForm() {
       if (guardReadOnlyPrefabExample()) {
         renderCalibrationForm();
         return;
       }
       dom.gridOriginX.value = Math.round(state.layout.grid.originX);
       dom.gridOriginY.value = Math.round(state.layout.grid.originY);
       dom.gridCellWidth.value = Math.round(state.layout.grid.cellWidth);
       dom.gridCellHeight.value = Math.round(state.layout.grid.cellHeight);
       state.layout.grid.showCoordinates = dom.showCoordinates.checked;
       state.layout.grid.showOutline = dom.showBoardOutline.checked;
+      syncMapAndGridToSources();
       renderCanvas();
     }
 
     function updateOpacityFromForm() {
       state.opacity.background = numberOr(dom.backgroundOpacity.value, state.opacity.background);
       state.opacity.foreground = numberOr(dom.foregroundOpacity.value, state.opacity.foreground);
       state.opacity.buildable = numberOr(dom.buildableOpacity.value, state.opacity.buildable);
       state.opacity.grid = numberOr(dom.gridOpacity.value, state.opacity.grid);
       renderCanvas();
     }
 
     function updateOptionalMaskFromTextarea() {
       if (guardReadOnlyPrefabExample()) {
         renderCalibrationForm();
         return;
       }
       try {
         state.layout.map.referenceMask = normalizePointList(JSON.parse(dom.optionalMaskJson.value || "[]"), []);
+        syncMapAndGridToSources();
         setStatus("已更新城墙参考遮罩。它只用于视觉参考，不参与建筑放置校验。");
         renderCanvas();
       } catch (error) {
         setStatus(`城墙参考遮罩 JSON 解析失败：${error.message}`);
       }
     }
 
     function updateForbiddenPolygonsFromTextarea() {
       if (guardReadOnlyPrefabExample()) {
         renderCalibrationForm();
         return;
       }
       try {
         state.layout.map.forbiddenPolygons = normalizeForbiddenPolygons(JSON.parse(dom.forbiddenPolygonsJson.value || "[]"));
+        syncMapAndGridToSources();
         setStatus("已更新前景遮挡警戒区。");
         renderCanvas();
       } catch (error) {
         setStatus(`前景遮挡区 JSON 解析失败：${error.message}`);
       }
     }
 
-    function updateEntityFromForm(event) {
+    function updatePrefabFromForm(event) {
       if (guardReadOnlyPrefabExample()) {
         renderProperties();
         return;
       }
-      const entity = getSelectedEntity();
-      if (entity == null) {
+      const prefab = getSelectedPrefab();
+      if (prefab == null) {
         return;
       }
 
-      const previousId = entity.id;
-      entity.id = dom.fieldId.value.trim() || previousId;
-      entity.name = dom.fieldName.value;
-      entity.category = dom.fieldCategory.value;
-      entity.entry = readEntryFromForm();
-      entity.asset.image = dom.fieldImage.value.trim();
-      entity.asset.naturalWidth = numberOr(dom.fieldNaturalWidth.value, entity.asset.naturalWidth);
-      entity.asset.naturalHeight = numberOr(dom.fieldNaturalHeight.value, entity.asset.naturalHeight);
-      entity.asset.scale = Math.max(0.01, numberOr(dom.fieldScale.value, entity.asset.scale));
-      entity.asset.offsetX = numberOr(dom.fieldOffsetX.value, 0);
-      entity.asset.offsetY = numberOr(dom.fieldOffsetY.value, 0);
-      entity.asset.anchor = dom.fieldAnchor.value;
-      entity.lot.gridX = Math.round(numberOr(dom.fieldLotX.value, entity.lot.gridX));
-      entity.lot.gridY = Math.round(numberOr(dom.fieldLotY.value, entity.lot.gridY));
-      entity.lot.cols = Math.max(1, Math.round(numberOr(dom.fieldCols.value, 1)));
-      entity.lot.rows = Math.max(1, Math.round(numberOr(dom.fieldRows.value, 1)));
-      entity.lot.offsetX = numberOr(entity.lot.offsetX, 0);
-      entity.lot.offsetY = numberOr(entity.lot.offsetY, 0);
-      clampLotToBoard(entity);
-      syncLotPixelFields(entity);
-      entity.render.visible = dom.fieldVisible.checked;
-      entity.render.locked = dom.fieldLocked.checked;
-      entity.render.zIndexMode = dom.fieldZIndexMode.value;
-      entity.render.zIndex = dom.fieldZIndex.value === "" ? null : numberOr(dom.fieldZIndex.value, null);
-      entity.interaction.clickable = dom.fieldClickable.checked;
-      entity.interaction.label.text = dom.fieldLabelText.value;
-      entity.interaction.label.offsetX = numberOr(dom.fieldLabelOffsetX.value, 0);
-      entity.interaction.label.offsetY = numberOr(dom.fieldLabelOffsetY.value, 0);
-      entity.interaction.label.width = Math.max(1, numberOr(dom.fieldLabelWidth.value, 1));
-      entity.interaction.label.height = Math.max(1, numberOr(dom.fieldLabelHeight.value, 1));
-      entity.interaction.hitArea.type = dom.fieldHitType.value;
-      entity.interaction.hitArea.offsetX = numberOr(dom.fieldHitOffsetX.value, 0);
-      entity.interaction.hitArea.offsetY = numberOr(dom.fieldHitOffsetY.value, 0);
-      entity.interaction.hitArea.width = Math.max(1, numberOr(dom.fieldHitWidth.value, 1));
-      entity.interaction.hitArea.height = Math.max(1, numberOr(dom.fieldHitHeight.value, 1));
-
-      if (entity.category === "random-slot" || dom.fieldRandomPoolId.value.trim() || dom.fieldRandomTags.value.trim()) {
-        entity.random = {
-          poolId: dom.fieldRandomPoolId.value.trim(),
-          allowedTags: dom.fieldRandomTags.value.split(",").map((tag) => tag.trim()).filter(Boolean)
-        };
-      } else {
-        delete entity.random;
-      }
-
-      if (previousId !== entity.id) {
+      const previousId = prefab.id;
+      prefab.id = dom.fieldPrefabId.value.trim() || previousId;
+      prefab.name = dom.fieldPrefabName.value;
+      prefab.category = dom.fieldPrefabCategory.value;
+      prefab.entry = readPrefabEntryFromForm();
+      prefab.asset.image = dom.fieldPrefabImage.value.trim();
+      prefab.asset.naturalWidth = numberOr(dom.fieldPrefabNaturalWidth.value, prefab.asset.naturalWidth);
+      prefab.asset.naturalHeight = numberOr(dom.fieldPrefabNaturalHeight.value, prefab.asset.naturalHeight);
+      prefab.asset.scale = Math.max(0.01, numberOr(dom.fieldPrefabScale.value, prefab.asset.scale));
+      prefab.asset.offsetX = numberOr(dom.fieldPrefabOffsetX.value, 0);
+      prefab.asset.offsetY = numberOr(dom.fieldPrefabOffsetY.value, 0);
+      prefab.asset.anchor = dom.fieldPrefabAnchor.value;
+      prefab.footprint.cols = Math.max(1, Math.round(numberOr(dom.fieldPrefabCols.value, 1)));
+      prefab.footprint.rows = Math.max(1, Math.round(numberOr(dom.fieldPrefabRows.value, 1)));
+      prefab.interaction.clickable = dom.fieldPrefabClickable.checked;
+      prefab.interaction.label.text = dom.fieldPrefabLabelText.value;
+      prefab.interaction.label.offsetX = numberOr(dom.fieldPrefabLabelOffsetX.value, 0);
+      prefab.interaction.label.offsetY = numberOr(dom.fieldPrefabLabelOffsetY.value, 0);
+      prefab.interaction.label.width = Math.max(1, numberOr(dom.fieldPrefabLabelWidth.value, 1));
+      prefab.interaction.label.height = Math.max(1, numberOr(dom.fieldPrefabLabelHeight.value, 1));
+      prefab.interaction.hitArea.type = dom.fieldPrefabHitType.value;
+      prefab.interaction.hitArea.offsetX = numberOr(dom.fieldPrefabHitOffsetX.value, 0);
+      prefab.interaction.hitArea.offsetY = numberOr(dom.fieldPrefabHitOffsetY.value, 0);
+      prefab.interaction.hitArea.width = Math.max(1, numberOr(dom.fieldPrefabHitWidth.value, 1));
+      prefab.interaction.hitArea.height = Math.max(1, numberOr(dom.fieldPrefabHitHeight.value, 1));
+
+      if (previousId !== prefab.id) {
         const preview = state.entityPreviews.get(previousId);
         if (preview) {
           state.entityPreviews.delete(previousId);
-          state.entityPreviews.set(entity.id, preview);
+          state.entityPreviews.set(prefab.id, preview);
+        }
+        for (const instance of state.cityLayout.instances) {
+          if (instance.prefabId === previousId) {
+            instance.prefabId = prefab.id;
+          }
         }
-        state.selectedId = entity.id;
+        state.selectedPrefabId = prefab.id;
       }
 
-      if (event?.target === dom.fieldName && !dom.fieldLabelText.value.trim()) {
-        entity.interaction.label.text = entity.name;
+      if (event?.target === dom.fieldPrefabName && !dom.fieldPrefabLabelText.value.trim()) {
+        prefab.interaction.label.text = prefab.name;
       }
+      syncEditorLayoutFromSources();
       renderProperties();
       renderQuickSelect();
       renderEntityList();
       renderCanvas();
       syncRandomPoolsTextarea();
     }
 
-    function readEntryFromForm() {
-      if (dom.fieldEntryType.value === "house") {
-        return { type: "house", houseId: dom.fieldHouseId.value.trim() };
+    function updateCityLayoutFromForm() {
+      if (guardReadOnlyPrefabExample()) {
+        renderProperties();
+        return;
       }
-      if (dom.fieldEntryType.value === "city-entry") {
-        return { type: "city-entry", cityEntryId: dom.fieldCityEntryId.value.trim() };
+      const instance = getSelectedInstance();
+      if (instance == null) {
+        return;
+      }
+      const previousId = instance.id;
+      instance.id = dom.fieldInstanceId.value.trim() || previousId;
+      instance.gridX = Math.max(0, Math.round(numberOr(dom.fieldInstanceGridX.value, instance.gridX)));
+      instance.gridY = Math.max(0, Math.round(numberOr(dom.fieldInstanceGridY.value, instance.gridY)));
+      clampInstanceToBoard(instance);
+      instance.render.visible = dom.fieldInstanceVisible.checked;
+      instance.render.locked = dom.fieldInstanceLocked.checked;
+      instance.render.zIndexMode = dom.fieldInstanceZIndexMode.value;
+      instance.render.zIndex = dom.fieldInstanceZIndex.value === "" ? null : numberOr(dom.fieldInstanceZIndex.value, null);
+
+      if (previousId !== instance.id) {
+        state.selectedInstanceId = instance.id;
+        state.selectedId = instance.id;
+      }
+      syncEditorLayoutFromSources(instance.id);
+      renderProperties();
+      renderQuickSelect();
+      renderEntityList();
+      renderCanvas();
+    }
+
+    function readPrefabEntryFromForm() {
+      if (dom.fieldPrefabEntryType.value === "house") {
+        return { type: "house", houseId: dom.fieldPrefabHouseId.value.trim() };
+      }
+      if (dom.fieldPrefabEntryType.value === "city-entry") {
+        return { type: "city-entry", cityEntryId: dom.fieldPrefabCityEntryId.value.trim() };
       }
       return { type: "none" };
     }
 
     function addEntity() {
       if (guardReadOnlyPrefabExample()) {
         return;
       }
-      const entity = normalizeEntity({
-        id: createUniqueId("building"),
-        name: "新建筑",
-        category: "decoration",
-        lot: {
-          gridX: 9,
-          gridY: 9,
-          cols: 2,
-          rows: 2
-        },
-        interaction: {
-          clickable: false,
-          label: { text: "新建筑", offsetX: 0, offsetY: -118, width: 110, height: 36 },
-          hitArea: { type: "ellipse", offsetX: 0, offsetY: -8, width: 120, height: 52 }
+      if (state.editorMode === "prefab") {
+        const prefab = normalizePrefab({
+          id: `prefab-${state.prefabLibrary.prefabs.length + 1}`,
+          name: "新 Prefab",
+          category: "decoration",
+          asset: {
+            image: "",
+            naturalWidth: 512,
+            naturalHeight: 512,
+            scale: 0.25,
+            offsetX: 0,
+            offsetY: 0,
+            anchor: "bottom-center"
+          },
+          footprint: {
+            cols: 2,
+            rows: 2
+          },
+          interaction: {
+            clickable: false,
+            label: { text: "新 Prefab", offsetX: 0, offsetY: -118, width: 110, height: 36 },
+            hitArea: { type: "ellipse", offsetX: 0, offsetY: -8, width: 120, height: 52 }
+          }
+        });
+        state.prefabLibrary.prefabs.push(prefab);
+        syncEditorLayoutFromSources();
+        selectPrefab(prefab.id);
+        setStatus("已新建 prefab。");
+        return;
+      }
+
+      const prefabId = state.selectedPrefabId || state.prefabLibrary.prefabs[0]?.id || "";
+      const instance = normalizeCityInstance({
+        id: `instance-${state.cityLayout.instances.length + 1}`,
+        prefabId,
+        gridX: 9,
+        gridY: 9,
+        render: {
+          visible: true,
+          locked: false,
+          zIndexMode: "y-sort",
+          zIndex: null
         }
-      });
-      state.layout.entities.push(entity);
-      selectEntity(entity.id);
-      setStatus("已新建建筑。");
+      }, state.cityLayout.grid);
+      state.cityLayout.instances.push(instance);
+      syncEditorLayoutFromSources(instance.id);
+      selectInstance(instance.id);
+      setStatus("已新建布局实例。");
     }
 
     function duplicateEntity() {
       if (guardReadOnlyPrefabExample()) {
         return;
       }
-      const entity = getSelectedEntity();
-      if (entity == null) {
+      if (state.editorMode === "prefab") {
+        const prefab = getSelectedPrefab();
+        if (prefab == null) {
+          return;
+        }
+        const copy = normalizePrefab(clone(prefab));
+        copy.id = `${prefab.id}-copy`;
+        copy.name = `${prefab.name} 复制`;
+        state.prefabLibrary.prefabs.push(copy);
+        syncEditorLayoutFromSources();
+        selectPrefab(copy.id);
+        setStatus("已复制 prefab。");
+        return;
+      }
+
+      const instance = getSelectedInstance();
+      if (instance == null) {
         return;
       }
-      const copy = clone(entity);
-      copy.id = createUniqueId(`${entity.id}-copy`);
-      copy.name = `${entity.name} 复制`;
-      copy.lot.gridX = Math.min(state.layout.grid.cols - copy.lot.cols, copy.lot.gridX + 1);
-      copy.lot.gridY = Math.min(state.layout.grid.rows - copy.lot.rows, copy.lot.gridY + 1);
-      state.layout.entities.push(normalizeEntity(copy, state.layout.grid));
-      selectEntity(copy.id);
-      setStatus("已复制建筑。");
+      const copy = normalizeCityInstance(clone(instance), state.cityLayout.grid);
+      copy.id = `${instance.id}-copy`;
+      copy.gridX = Math.min(state.cityLayout.grid.cols - 1, copy.gridX + 1);
+      copy.gridY = Math.min(state.cityLayout.grid.rows - 1, copy.gridY + 1);
+      state.cityLayout.instances.push(copy);
+      syncEditorLayoutFromSources(copy.id);
+      selectInstance(copy.id);
+      setStatus("已复制布局实例。");
     }
 
     function deleteEntity() {
       if (guardReadOnlyPrefabExample()) {
         return;
       }
-      const entity = getSelectedEntity();
-      if (entity == null) {
+      if (state.editorMode === "prefab") {
+        const prefab = getSelectedPrefab();
+        if (prefab == null) {
+          return;
+        }
+        if (!confirm(`删除 prefab ${prefab.name}？`)) {
+          return;
+        }
+        state.prefabLibrary.prefabs = state.prefabLibrary.prefabs.filter((candidate) => candidate.id !== prefab.id);
+        state.cityLayout.instances = state.cityLayout.instances.filter((candidate) => candidate.prefabId !== prefab.id);
+        state.entityPreviews.delete(prefab.id);
+        syncEditorLayoutFromSources();
+        setStatus("已删除 prefab。");
+        render();
         return;
       }
-      if (!confirm(`删除建筑 ${entity.name}？`)) {
+
+      const instance = getSelectedInstance();
+      if (instance == null) {
         return;
       }
-      state.layout.entities = state.layout.entities.filter((candidate) => candidate.id !== entity.id);
-      state.entityPreviews.delete(entity.id);
-      state.selectedId = state.layout.entities[0]?.id || null;
-      setStatus("已删除建筑。");
+      if (!confirm(`删除布局实例 ${instance.id}？`)) {
+        return;
+      }
+      state.cityLayout.instances = state.cityLayout.instances.filter((candidate) => candidate.id !== instance.id);
+      syncEditorLayoutFromSources();
+      setStatus("已删除布局实例。");
       render();
     }
 
     function selectEntity(id) {
-      if (!state.layout.entities.some((entity) => entity.id === id)) {
+      const entity = state.layout.entities.find((candidate) => candidate.id === id);
+      if (entity == null) {
         setStatus(`没有找到建筑：${id}`);
         return;
       }
+      state.selectedInstanceId = id;
       state.selectedId = id;
+      state.selectedPrefabId = entity.prefabId || entity.id;
       state.centerSelectedAfterRender = true;
       renderEntityList();
       renderProperties();
       renderCanvas();
     }
 
     function centerViewportOnSelectedEntity() {
       const entity = getSelectedEntity();
       if (entity == null) {
         return;
       }
       const base = state.layout.map.baseSpace;
       const targetX = (base.x + entity.lot.x) * state.zoom;
       const targetY = (base.y + entity.lot.y - entity.lot.footprintHeight / 2) * state.zoom;
       dom.viewport.scrollLeft = Math.max(0, targetX - dom.viewport.clientWidth / 2);
       dom.viewport.scrollTop = Math.max(0, targetY - dom.viewport.clientHeight / 2);
     }
 
     function getSelectedEntity() {
-      return state.layout.entities.find((entity) => entity.id === state.selectedId) || null;
+      if (state.editorMode === "prefab") {
+        const selectedPrefab = getSelectedPrefab();
+        if (selectedPrefab == null) {
+          return null;
+        }
+        return state.layout.entities.find((entity) => entity.prefabId === selectedPrefab.id)
+          || state.layout.entities.find((entity) => entity.id === state.selectedId)
+          || null;
+      }
+      return state.layout.entities.find((entity) => entity.id === state.selectedInstanceId) || null;
+    }
+
+    function getSelectedPrefab() {
+      return getPrefabById(state.selectedPrefabId);
+    }
+
+    function getSelectedInstance(instanceId = state.selectedInstanceId) {
+      return state.cityLayout.instances.find((instance) => instance.id === instanceId) || null;
+    }
+
+    function getPrefabById(prefabId) {
+      return state.prefabLibrary.prefabs.find((prefab) => prefab.id === prefabId) || null;
+    }
+
+    function getComposedEntityById(instanceId) {
+      return state.layout.entities.find((entity) => entity.id === instanceId) || null;
+    }
+
+    function clampInstanceToBoard(instance) {
+      const prefab = getPrefabById(instance.prefabId);
+      const cols = Math.max(1, Math.round(numberOr(prefab?.footprint?.cols, 1)));
+      const rows = Math.max(1, Math.round(numberOr(prefab?.footprint?.rows, 1)));
+      const grid = state.cityLayout.grid;
+      instance.gridX = Math.max(0, Math.min(Math.max(0, grid.cols - cols), Math.round(numberOr(instance.gridX, 0))));
+      instance.gridY = Math.max(0, Math.min(Math.max(0, grid.rows - rows), Math.round(numberOr(instance.gridY, 0))));
+    }
+
+    function selectPrefab(prefabId) {
+      if (!state.prefabLibrary.prefabs.some((prefab) => prefab.id === prefabId)) {
+        setStatus(`没有找到 prefab：${prefabId}`);
+        return;
+      }
+      state.selectedPrefabId = prefabId;
+      const matchingInstance = state.cityLayout.instances.find((instance) => instance.prefabId === prefabId);
+      if (matchingInstance != null) {
+        state.selectedInstanceId = matchingInstance.id;
+        state.selectedId = matchingInstance.id;
+      } else {
+        state.selectedInstanceId = null;
+        state.selectedId = null;
+      }
+      state.centerSelectedAfterRender = true;
+      renderEntityList();
+      renderProperties();
+      renderCanvas();
+    }
+
+    function selectInstance(instanceId) {
+      const instance = getSelectedInstance(instanceId);
+      if (instance == null) {
+        setStatus(`没有找到实例：${instanceId}`);
+        return;
+      }
+      state.selectedInstanceId = instance.id;
+      state.selectedId = instance.id;
+      state.selectedPrefabId = instance.prefabId;
+      state.centerSelectedAfterRender = true;
+      renderEntityList();
+      renderProperties();
+      renderCanvas();
     }
 
     function createUniqueId(prefix) {
       const existingIds = new Set(state.layout?.entities?.map((entity) => entity.id) || []);
       let candidate = prefix;
       let index = 1;
       while (existingIds.has(candidate)) {
         index += 1;
         candidate = `${prefix}-${index}`;
       }
       return candidate;
     }
 
     function onBoardClick(event) {
       if (guardReadOnlyPrefabExample()) {
         return;
       }
+      if (state.editorMode !== "city-layout") {
+        return;
+      }
       if (state.mode === "preview" || state.drag != null) {
         return;
       }
       const cell = event.target.closest(".board-cell");
-      const entity = getSelectedEntity();
-      if (cell == null || entity == null || entity.render.locked) {
+      const instance = getSelectedInstance();
+      if (cell == null || instance == null || instance.render.locked) {
         return;
       }
-      entity.lot.gridX = Number(cell.dataset.gridX);
-      entity.lot.gridY = Number(cell.dataset.gridY);
-      clampLotToBoard(entity);
-      syncLotPixelFields(entity);
-      setStatus(`${entity.name} 已移动到格子 ${entity.lot.gridX},${entity.lot.gridY}。`);
+      instance.gridX = Number(cell.dataset.gridX);
+      instance.gridY = Number(cell.dataset.gridY);
+      syncEditorLayoutFromSources(instance.id);
+      const entity = getSelectedEntity();
+      if (entity != null) {
+        clampLotToBoard(entity);
+        syncEntityBackToSources(entity);
+        syncEditorLayoutFromSources(instance.id);
+      }
+      setStatus(`布局实例已移动到格子 ${instance.gridX},${instance.gridY}。`);
       renderProperties();
       renderEntityList();
       renderCanvas();
     }
 
     function onBoardMouseMove(event) {
       const cell = event.target.closest(".board-cell");
       if (cell == null) {
         if (state.hoverGrid != null) {
           state.hoverGrid = null;
@@ -2738,57 +3450,88 @@
       if (state.mode === "preview" && label != null) {
         event.preventDefault();
         const entity = state.layout.entities.find((candidate) => candidate.id === label.dataset.previewEntityId);
         if (entity != null) {
           showPreviewEntry(entity);
         }
         return;
       }
 
       if (entityNode != null && state.mode === "edit") {
-        selectEntity(entityNode.dataset.entityId);
+        const entityId = entityNode.dataset.entityId;
+        const entity = state.layout.entities.find((candidate) => candidate.id === entityId);
+        if (entity == null) {
+          return;
+        }
+        if (state.editorMode === "prefab") {
+          selectPrefab(entity.prefabId || entity.id);
+          return;
+        }
+        selectInstance(entity.id);
       }
     }
 
     function onCanvasPointerDown(event) {
       if (guardReadOnlyPrefabExample()) {
         return;
       }
       if (state.mode === "preview") {
         return;
       }
       const handle = event.target.closest("[data-drag-mode]");
       const dragMode = handle?.dataset.dragMode || "";
       if (dragMode === "move-board" || dragMode === "scale-board-width" || dragMode === "scale-board-height") {
         setStatus("Grid is fixed to the city stage. Edit entity lots and offsets instead.");
         event.preventDefault();
         return;
       }
+      if (state.editorMode === "prefab" && (dragMode === "move-entity" || dragMode === "move-board")) {
+        return;
+      }
+      if (
+        state.editorMode === "city-layout"
+        && ["resize-lot-width", "resize-lot-height", "resize-lot-area", "move-image-offset", "move-label", "move-hit-area", "resize-hit-area"].includes(dragMode)
+      ) {
+        return;
+      }
       const entityNode = event.target.closest(".entity");
       const selected = getSelectedEntity();
       const entity = entityNode != null
         ? state.layout.entities.find((candidate) => candidate.id === entityNode.dataset.entityId)
         : selected;
 
       if (entity == null) {
         return;
       }
       if (entityNode != null) {
-        selectEntity(entity.id);
+        if (state.editorMode === "prefab") {
+          selectPrefab(entity.prefabId || entity.id);
+        } else {
+          selectInstance(entity.id);
+        }
       }
       if (entity.render.locked) {
         setStatus(`建筑 ${entity.name} 已锁定，不能拖动。`);
         return;
       }
 
       const point = getBasePoint(event);
       const entityDragMode = handle?.dataset.dragMode || "move-entity";
+      if (state.editorMode === "prefab" && entityDragMode === "move-entity") {
+        return;
+      }
+      if (
+        state.editorMode === "city-layout"
+        && ["resize-lot-width", "resize-lot-height", "resize-lot-area", "move-image-offset", "move-label", "move-hit-area", "resize-hit-area"].includes(entityDragMode)
+      ) {
+        return;
+      }
       state.drag = {
         pointerId: event.pointerId,
         entityId: entity.id,
         mode: entityDragMode,
         startPoint: point,
         startLot: clone(entity.lot),
         startAnchor: { x: entity.lot.x, y: entity.lot.y },
         startAsset: clone(entity.asset),
         startLabel: clone(entity.interaction.label),
         startHitArea: clone(entity.interaction.hitArea)
@@ -2867,21 +3610,22 @@
       } else if (state.drag.mode === "move-label") {
         entity.interaction.label.offsetX = Math.round(state.drag.startLabel.offsetX + dx);
         entity.interaction.label.offsetY = Math.round(state.drag.startLabel.offsetY + dy);
       } else if (state.drag.mode === "move-hit-area") {
         entity.interaction.hitArea.offsetX = Math.round(state.drag.startHitArea.offsetX + dx);
         entity.interaction.hitArea.offsetY = Math.round(state.drag.startHitArea.offsetY + dy);
       } else if (state.drag.mode === "resize-hit-area") {
         entity.interaction.hitArea.width = Math.max(12, Math.round(state.drag.startHitArea.width + dx * 2));
         entity.interaction.hitArea.height = Math.max(12, Math.round(state.drag.startHitArea.height + dy * 2));
       }
-
+      syncEntityBackToSources(entity);
+      syncEditorLayoutFromSources(entity.id);
       renderProperties();
       renderCanvas();
     }
 
     function resizeLotByGridPoint(entity, point, axis) {
       const target = pixelToGrid(point.x, point.y);
       if (axis === "width" || axis === "area") {
         entity.lot.cols = Math.max(1, target.gridX - entity.lot.gridX + 1);
       }
       if (axis === "height" || axis === "area") {
@@ -2930,20 +3674,39 @@
     function toggleMode() {
       state.mode = state.mode === "edit" ? "preview" : "edit";
       if (state.mode === "preview") {
         state.calibrationMode = false;
       }
       renderToolbarState();
       renderCanvas();
       setStatus(state.mode === "preview" ? "预览模式：标签点击只显示模拟入口。" : "编辑模式：可直接拖拽建筑、地块、图片、标签和点击区域。");
     }
 
+    function toggleEditorMode() {
+      state.editorMode = state.editorMode === "prefab" ? "city-layout" : "prefab";
+      if (state.editorMode === "prefab" && state.selectedPrefabId == null) {
+        state.selectedPrefabId = state.prefabLibrary.prefabs[0]?.id || null;
+      }
+      if (state.editorMode === "city-layout" && state.selectedInstanceId == null) {
+        state.selectedInstanceId = state.cityLayout.instances[0]?.id || null;
+        state.selectedId = state.selectedInstanceId;
+      }
+      renderEntityList();
+      renderProperties();
+      renderToolbarState();
+      renderCanvas();
+      syncLayoutJsonPreview();
+      setStatus(state.editorMode === "prefab"
+        ? "Prefab Editor：编辑 visual / interaction / footprint truth。"
+        : "City Layout：编辑 instance placement 和 render metadata。");
+    }
+
     function toggleCalibrationMode() {
       state.calibrationMode = false;
       renderToolbarState();
       renderCanvas();
       setStatus("Grid is fixed to the city stage; edit entity lots, image size, and offsets here.");
     }
 
     function centerViewportOnGridOrigin() {
       const base = state.layout.map.baseSpace;
       const targetX = (base.x + state.layout.grid.originX) * state.zoom;
@@ -2969,21 +3732,21 @@
     }
 
     function importJsonFile(event) {
       const file = event.target.files?.[0];
       if (file == null) {
         return;
       }
       const reader = new FileReader();
       reader.addEventListener("load", () => {
         try {
-          setEditorLayout(JSON.parse(String(reader.result)), state.layout.entities[0]?.id || null);
+          setEditorLayout(JSON.parse(String(reader.result)), state.selectedInstanceId || null);
           setStatus(`已导入 ${file.name}。`);
         } catch (error) {
           setStatus(`导入失败：${error.message}`);
         }
       });
       reader.readAsText(file, "utf-8");
       event.target.value = "";
     }
 
     async function loadHaozhouExample() {
@@ -2995,66 +3758,51 @@
         if (!layoutResponse.ok) {
           throw new Error(`layout HTTP ${layoutResponse.status}`);
         }
         if (!prefabResponse.ok) {
           throw new Error(`prefab HTTP ${prefabResponse.status}`);
         }
         const [layout, prefabs] = await Promise.all([
           layoutResponse.json(),
           prefabResponse.json()
         ]);
-        setEditorLayout(
-          composePrefabLayoutForEditor(layout, prefabs),
-          null,
-          {
-            source: "haozhou-split-example",
-            message: "Prefab-backed example is read-only here. Import a city layout JSON to edit or export data."
-          }
-        );
-        setStatus("Split prefab example loaded in read-only compatibility mode.");
+        setEditorSources(prefabs, layout);
+        setStatus("Split prefab example loaded.");
       } catch (error) {
         setStatus(`载入示例失败：请使用“导入 JSON”选择 ${HAOZHOU_LAYOUT_EXAMPLE_PATH} 与 ${HAOZHOU_PREFAB_EXAMPLE_PATH}。原因：${error.message}`);
       }
     }
 
     function setEditorLayout(layout, preferredSelectedId = null, readOnlyPrefabExample = null) {
-      state.layout = normalizeLayout(layout);
-      state.readOnlyPrefabExample = readOnlyPrefabExample;
-      state.selectedId = state.layout.entities.some((entity) => entity.id === preferredSelectedId)
-        ? preferredSelectedId
-        : state.layout.entities[0]?.id || null;
-      state.centerSelectedAfterRender = true;
-      state.entityPreviews.clear();
-      state.backgroundPreview = "";
-      state.foregroundPreview = "";
-      render();
+      const { prefabLibrary, cityLayout } = decomposeLayoutToSources(layout);
+      setEditorSources(prefabLibrary, cityLayout, preferredSelectedId, readOnlyPrefabExample);
     }
 
     function exportJsonFile() {
       if (guardReadOnlyPrefabExample()) {
         return;
       }
-      const result = validateLayout(state.layout);
-      renderValidation(result);
-      if (result.errors > 0 && !confirm(`布局存在 ${result.errors} 个错误，仍然导出？`)) {
-        setStatus("已取消导出。");
-        return;
-      }
-      const blob = new Blob([`${JSON.stringify(state.layout, null, 2)}\n`], { type: "application/json" });
+      const text = state.editorMode === "prefab"
+        ? exportPrefabLibraryJson()
+        : exportCityLayoutJson();
+      const filename = state.editorMode === "prefab"
+        ? "city-stage-prefabs.json"
+        : "city-map-layout.json";
+      const blob = new Blob([text], { type: "application/json" });
       const link = document.createElement("a");
       link.href = URL.createObjectURL(blob);
-      link.download = "city-map-layout.json";
+      link.download = filename;
       document.body.append(link);
       link.click();
       link.remove();
       URL.revokeObjectURL(link.href);
-      setStatus("已导出 city-map-layout.json。");
+      setStatus(`已导出 ${filename}。`);
     }
 
     function uploadMapImage(event, kind) {
       const file = event.target.files?.[0];
       if (file == null) {
         return;
       }
       if (guardReadOnlyPrefabExample()) {
         event.target.value = "";
         return;
@@ -3064,110 +3812,122 @@
           state.backgroundPreview = dataUrl;
           if (!state.layout.map.backgroundImage) {
             state.layout.map.backgroundImage = file.name;
           }
         } else {
           state.foregroundPreview = dataUrl;
           if (!state.layout.map.foregroundImage) {
             state.layout.map.foregroundImage = file.name;
           }
         }
+        syncMapAndGridToSources();
         setStatus(`${file.name} 已作为${kind === "background" ? "地图底图" : "前景墙体图"}预览；导出前请填写项目内相对路径。`);
         render();
       });
       event.target.value = "";
     }
 
     function uploadEntityImage(event) {
-      const entity = getSelectedEntity();
+      const selectedInstance = getSelectedInstance();
+      const prefab = state.editorMode === "prefab"
+        ? getSelectedPrefab()
+        : selectedInstance == null
+          ? getSelectedPrefab()
+          : getPrefabById(selectedInstance.prefabId) || getSelectedPrefab();
       const file = event.target.files?.[0];
       if (file == null) {
         return;
       }
       if (guardReadOnlyPrefabExample()) {
         event.target.value = "";
         return;
       }
-      if (entity == null) {
+      if (prefab == null) {
         setStatus("请先选择一个建筑，再上传建筑图片。");
         event.target.value = "";
         return;
       }
       readImageFile(file, (dataUrl, image) => {
-        state.entityPreviews.set(entity.id, dataUrl);
-        entity.asset.naturalWidth = image.naturalWidth || entity.asset.naturalWidth;
-        entity.asset.naturalHeight = image.naturalHeight || entity.asset.naturalHeight;
-        if (!entity.asset.image) {
-          entity.asset.image = file.name;
+        state.entityPreviews.set(prefab.id, dataUrl);
+        prefab.asset.naturalWidth = image.naturalWidth || prefab.asset.naturalWidth;
+        prefab.asset.naturalHeight = image.naturalHeight || prefab.asset.naturalHeight;
+        if (!prefab.asset.image) {
+          prefab.asset.image = file.name;
         }
-        setStatus(`${file.name} 已作为 ${entity.name} 的本地预览；导出前请填写项目内相对路径。`);
+        syncEditorLayoutFromSources();
+        setStatus(`${file.name} 已作为 ${prefab.name} 的本地预览；导出前请填写项目内相对路径。`);
         render();
       });
       event.target.value = "";
     }
 
     function readImageFile(file, callback) {
       const reader = new FileReader();
       reader.addEventListener("load", () => {
         const dataUrl = String(reader.result);
         const image = new Image();
         image.addEventListener("load", () => callback(dataUrl, image));
         image.src = dataUrl;
       });
       reader.readAsDataURL(file);
     }
 
     async function copyLayoutJson() {
       if (guardReadOnlyPrefabExample()) {
         return;
       }
-      const text = JSON.stringify(state.layout, null, 2);
+      const text = state.editorMode === "prefab"
+        ? exportPrefabLibraryJson()
+        : exportCityLayoutJson();
       if (navigator.clipboard?.writeText != null) {
         await navigator.clipboard.writeText(text);
-        setStatus("已复制当前布局 JSON。");
+        setStatus(state.editorMode === "prefab" ? "已复制 Prefab Library JSON。" : "已复制 City Layout JSON。");
       } else {
         setStatus("当前浏览器不支持直接复制，请用导出 JSON。");
       }
     }
 
     function updateRandomPoolsFromTextarea() {
       if (guardReadOnlyPrefabExample()) {
         syncRandomPoolsTextarea();
         return;
       }
       try {
         const parsed = JSON.parse(dom.randomPoolsJson.value || "[]");
         if (!Array.isArray(parsed)) {
           throw new Error("随机池必须是数组。");
         }
-        state.layout.randomPools = parsed;
+        state.cityLayout.randomPools = parsed;
+        syncEditorLayoutFromSources();
         setStatus("已更新随机池。");
       } catch (error) {
         setStatus(`随机池 JSON 无效：${error.message}`);
       }
     }
 
     function syncRandomPoolsTextarea() {
       if (document.activeElement === dom.randomPoolsJson) {
         return;
       }
-      dom.randomPoolsJson.value = JSON.stringify(state.layout.randomPools, null, 2);
+      dom.randomPoolsJson.value = JSON.stringify(state.cityLayout.randomPools, null, 2);
     }
 
     function syncLayoutJsonPreview() {
       if (isReadOnlyPrefabExampleLoaded()) {
         dom.layoutJsonPreview.value = `${state.readOnlyPrefabExample.message}
 This compatibility loader only previews composed runtime entities. Import a city layout JSON to edit or export layout data.
 `;
         return;
       }
-      dom.layoutJsonPreview.value = `${JSON.stringify(state.layout, null, 2)}\n`;
+      dom.layoutJsonPreview.value = state.editorMode === "prefab"
+        ? exportPrefabLibraryJson()
+        : exportCityLayoutJson();
     }
 
     function validateLayout(layout) {
       const messages = [];
       const base = layout.map.baseSpace;
       const idCounts = new Map();
       const poolIds = new Set((layout.randomPools || []).map((pool) => pool.id));
       const specialEntities = layout.entities.filter((entity) => entity.category === "special");
       const grid = layout.grid;
 
```
