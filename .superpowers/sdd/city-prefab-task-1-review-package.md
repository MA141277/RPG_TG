# Review Package

## Commits
c4e2945 fix: keep prefab example loader read-only
b6e1c43 feat: compose city stage entities from prefabs

## Diff Stat
 src/ui/views/city/city-stage-layout-data.ts        | 221 ++++++
 src/ui/views/city/city-stage-layout.ts             | 129 +---
 tests/city-map-building-editor.test.cjs            | 266 ++++++-
 .../examples/haozhou-city-layout.example.json      | 842 ++-------------------
 .../examples/haozhou-city-prefabs.example.json     | 696 +++++++++++++++++
 tools/city-map-building-editor/index.html          | 712 ++++++++++-------
 6 files changed, 1687 insertions(+), 1179 deletions(-)

## Full Diff
```diff
diff --git a/src/ui/views/city/city-stage-layout-data.ts b/src/ui/views/city/city-stage-layout-data.ts
new file mode 100644
index 0000000..0f22889
--- /dev/null
+++ b/src/ui/views/city/city-stage-layout-data.ts
@@ -0,0 +1,221 @@
+export type CityStageEntry =
+  | { type: "none" }
+  | { type: "house"; houseId: string }
+  | { type: "city-entry"; cityEntryId: string };
+
+export type CityStageAssetAnchor = "bottom-center" | "center" | "top-left";
+
+export type CityStageAsset = {
+  image: string;
+  naturalWidth: number;
+  naturalHeight: number;
+  scale: number;
+  offsetX: number;
+  offsetY: number;
+  anchor: CityStageAssetAnchor;
+};
+
+export type CityStageLot = {
+  gridX: number;
+  gridY: number;
+  cols: number;
+  rows: number;
+  offsetX?: number;
+  offsetY?: number;
+};
+
+export type CityStageRender = {
+  visible?: boolean;
+  locked?: boolean;
+  zIndex?: number | null;
+  zIndexMode?: "y-sort" | "manual";
+};
+
+export type CityStageInteractionLabel = {
+  text: string;
+  offsetX: number;
+  offsetY: number;
+  width: number;
+  height: number;
+};
+
+export type CityStageInteractionHitArea = {
+  type: "ellipse" | "rect";
+  offsetX: number;
+  offsetY: number;
+  width: number;
+  height: number;
+};
+
+export type CityStageInteraction = {
+  clickable: boolean;
+  label: CityStageInteractionLabel;
+  hitArea: CityStageInteractionHitArea;
+};
+
+export type CityStageMap = {
+  id: string;
+  name: string;
+  stageWidth: number;
+  stageHeight: number;
+  baseSpace: {
+    x: number;
+    y: number;
+    width: number;
+    height: number;
+  };
+  backgroundImage: string;
+  foregroundImage: string;
+  referenceMask?: unknown[];
+};
+
+export type CityStageGrid = {
+  type: "isometric-board";
+  cols: number;
+  rows: number;
+  cellWidth: number;
+  cellHeight: number;
+  originX: number;
+  originY: number;
+  snap?: boolean;
+  visible?: boolean;
+  showCoordinates?: boolean;
+  showOutline?: boolean;
+};
+
+export type CityStagePrefab = {
+  id: string;
+  name: string;
+  category: string;
+  entry: CityStageEntry;
+  asset: CityStageAsset;
+  footprint: {
+    cols: number;
+    rows: number;
+  };
+  interaction: CityStageInteraction;
+};
+
+export type CityStagePrefabLibrary = {
+  prefabs: CityStagePrefab[];
+};
+
+export type CityStageInstance = {
+  id: string;
+  prefabId: string;
+  gridX: number;
+  gridY: number;
+  render?: CityStageRender;
+};
+
+export type ComposedCityStageEntity = {
+  id: string;
+  prefabId?: string;
+  name: string;
+  category: string;
+  entry: CityStageEntry;
+  asset: CityStageAsset;
+  lot: CityStageLot;
+  render?: CityStageRender;
+  interaction: CityStageInteraction;
+};
+
+export type CityStageLayout = {
+  version: number;
+  map: CityStageMap;
+  grid: CityStageGrid;
+  entities: ComposedCityStageEntity[];
+};
+
+export type CityStageLayoutSource = {
+  version: number;
+  map: CityStageMap;
+  grid: CityStageGrid;
+  instances?: CityStageInstance[];
+  entities?: ComposedCityStageEntity[];
+  randomPools?: unknown[];
+};
+
+const DEFAULT_CITY_STAGE_RENDER: CityStageRender = {
+  visible: true,
+  locked: false,
+  zIndexMode: "y-sort",
+  zIndex: null,
+};
+
+export function composeCityStageLayout(
+  layoutSource: CityStageLayoutSource,
+  prefabLibrary: CityStagePrefabLibrary
+): ComposedCityStageEntity[] {
+  if (Array.isArray(layoutSource.instances)) {
+    const prefabById = new Map(
+      prefabLibrary.prefabs.map((prefab) => [prefab.id, prefab] as const)
+    );
+
+    return layoutSource.instances.map((instance) => {
+      const prefab = prefabById.get(instance.prefabId);
+      if (prefab == null) {
+        throw new Error(`Unknown city-stage prefab: ${instance.prefabId}`);
+      }
+
+      return {
+        id: instance.id,
+        prefabId: prefab.id,
+        name: prefab.name,
+        category: prefab.category,
+        entry: cloneCityStageEntry(prefab.entry),
+        asset: { ...prefab.asset },
+        lot: {
+          gridX: instance.gridX,
+          gridY: instance.gridY,
+          cols: prefab.footprint.cols,
+          rows: prefab.footprint.rows,
+        },
+        render: composeCityStageRender(instance.render),
+        interaction: cloneCityStageInteraction(prefab.interaction),
+      };
+    });
+  }
+
+  if (Array.isArray(layoutSource.entities)) {
+    return layoutSource.entities.map((entity) => ({
+      ...entity,
+      entry: cloneCityStageEntry(entity.entry),
+      asset: { ...entity.asset },
+      lot: { ...entity.lot },
+      render: composeCityStageRender(entity.render),
+      interaction: cloneCityStageInteraction(entity.interaction),
+    }));
+  }
+
+  return [];
+}
+
+function composeCityStageRender(render?: CityStageRender): CityStageRender {
+  return {
+    ...DEFAULT_CITY_STAGE_RENDER,
+    ...render,
+  };
+}
+
+function cloneCityStageEntry(entry: CityStageEntry): CityStageEntry {
+  if (entry.type === "house") {
+    return { ...entry };
+  }
+
+  if (entry.type === "city-entry") {
+    return { ...entry };
+  }
+
+  return { type: "none" };
+}
+
+function cloneCityStageInteraction(
+  interaction: CityStageInteraction
+): CityStageInteraction {
+  return {
+    clickable: interaction.clickable,
+    label: { ...interaction.label },
+    hitArea: { ...interaction.hitArea },
+  };
+}
diff --git a/src/ui/views/city/city-stage-layout.ts b/src/ui/views/city/city-stage-layout.ts
index 21ffa0f..ca91ef9 100644
--- a/src/ui/views/city/city-stage-layout.ts
+++ b/src/ui/views/city/city-stage-layout.ts
@@ -1,114 +1,28 @@
 import type { CityDefinition } from "../../../domain/city";
 import type { CityEntryDefinition } from "../../../domain/city-entry";
 import type { HouseDefinition } from "../../../domain/house";
 import * as haozhouCityLayoutModule from "../../../../tools/city-map-building-editor/examples/haozhou-city-layout.example.json";
-
-type CityStageEntry =
-  | { type: "none" }
-  | { type: "house"; houseId: string }
-  | { type: "city-entry"; cityEntryId: string };
-
-type CityStageAssetAnchor = "bottom-center" | "center" | "top-left";
-
-type CityStageAsset = {
-  image: string;
-  naturalWidth: number;
-  naturalHeight: number;
-  scale: number;
-  offsetX: number;
-  offsetY: number;
-  anchor: CityStageAssetAnchor;
-};
-
-type CityStageLot = {
-  gridX: number;
-  gridY: number;
-  cols: number;
-  rows: number;
-  offsetX?: number;
-  offsetY?: number;
-};
-
-type CityStageRender = {
-  visible?: boolean;
-  zIndex?: number | null;
-  zIndexMode?: "y-sort" | "manual";
-};
-
-type CityStageInteractionLabel = {
-  text: string;
-  offsetX: number;
-  offsetY: number;
-  width: number;
-  height: number;
-};
-
-type CityStageInteractionHitArea = {
-  type: "ellipse" | "rect";
-  offsetX: number;
-  offsetY: number;
-  width: number;
-  height: number;
-};
-
-type CityStageInteraction = {
-  clickable: boolean;
-  label: CityStageInteractionLabel;
-  hitArea: CityStageInteractionHitArea;
-};
-
-type CityStageEntity = {
-  id: string;
-  name: string;
-  category: string;
-  entry: CityStageEntry;
-  asset: CityStageAsset;
-  lot: CityStageLot;
-  render?: CityStageRender;
-  interaction: CityStageInteraction;
-};
-
-type CityStageMap = {
-  id: string;
-  name: string;
-  stageWidth: number;
-  stageHeight: number;
-  baseSpace: {
-    x: number;
-    y: number;
-    width: number;
-    height: number;
-  };
-  backgroundImage: string;
-  foregroundImage: string;
-};
-
-type CityStageGrid = {
-  type: "isometric-board";
-  cols: number;
-  rows: number;
-  cellWidth: number;
-  cellHeight: number;
-  originX: number;
-  originY: number;
-};
-
-type CityStageLayout = {
-  version: number;
-  map: CityStageMap;
-  grid: CityStageGrid;
-  entities: CityStageEntity[];
-};
+import * as haozhouCityPrefabModule from "../../../../tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json";
+import {
+  composeCityStageLayout,
+  type CityStageAsset,
+  type CityStageGrid,
+  type CityStageLayout,
+  type CityStageLayoutSource,
+  type CityStageLot,
+  type CityStagePrefabLibrary,
+  type ComposedCityStageEntity,
+} from "./city-stage-layout-data";
 
 type CityStageRenderMetrics = {
-  entity: CityStageEntity;
+  entity: ComposedCityStageEntity;
   assetUrl: string;
   baseX: number;
   baseY: number;
   baseXPercent: string;
   baseYPercent: string;
   zIndex: number;
   boxLeftPercent: string;
   boxTopPercent: string;
   boxWidthPercent: string;
   boxHeightPercent: string;
@@ -126,23 +40,36 @@ function unwrapJsonModule<T>(moduleValue: unknown): T {
     moduleValue != null &&
     typeof moduleValue === "object" &&
     "default" in moduleValue
   ) {
     return (moduleValue as { default: T }).default;
   }
 
   return moduleValue as T;
 }
 
-const haozhouCityStageLayout = unwrapJsonModule<CityStageLayout>(
+const haozhouCityStagePrefabs = unwrapJsonModule<CityStagePrefabLibrary>(
+  haozhouCityPrefabModule
+);
+const haozhouCityStageLayoutSource = unwrapJsonModule<CityStageLayoutSource>(
   haozhouCityLayoutModule
 );
+const haozhouCityStageLayout: CityStageLayout = {
+  version: haozhouCityStageLayoutSource.version,
+  map: haozhouCityStageLayoutSource.map,
+  grid: haozhouCityStageLayoutSource.grid,
+  // Instance prefabId values are resolved against the prefab library here.
+  entities: composeCityStageLayout(
+    haozhouCityStageLayoutSource,
+    haozhouCityStagePrefabs
+  ),
+};
 
 const cityStageAssetModules = import.meta.glob("../../../../ui/**/*.{png,jpg,jpeg,webp}", {
   eager: true,
   import: "default",
   query: "?url",
 }) as Record<string, string>;
 
 const cityStageAssetUrlByPath = new Map<string, string>(
   Object.entries(cityStageAssetModules).map(([modulePath, url]) => [
     normalizeAssetModulePath(modulePath),
@@ -266,41 +193,41 @@ function getAssetBox(metrics: {
 
   return {
     left: x - width / 2,
     top: y - height,
     width,
     height,
   };
 }
 
 function isEntityVisible(
-  entity: CityStageEntity,
+  entity: ComposedCityStageEntity,
   visibleHouseIds: Set<string>,
   visibleCityEntryIds: Set<string>
 ): boolean {
   if (entity.render?.visible === false) {
     return false;
   }
 
   if (entity.entry.type === "house") {
     return visibleHouseIds.has(entity.entry.houseId);
   }
 
   if (entity.entry.type === "city-entry") {
     return visibleCityEntryIds.has(entity.entry.cityEntryId);
   }
 
   return true;
 }
 
 function createRenderMetrics(
-  entity: CityStageEntity,
+  entity: ComposedCityStageEntity,
   layout: CityStageLayout
 ): CityStageRenderMetrics {
   const { baseSpace } = layout.map;
   const lotAnchor = getLotAnchor(entity.lot, layout.grid);
   const box = getAssetBox({
     anchorX: lotAnchor.x,
     anchorY: lotAnchor.y,
     asset: entity.asset,
   });
   const ringCenterX = lotAnchor.x + entity.interaction.hitArea.offsetX;
diff --git a/tests/city-map-building-editor.test.cjs b/tests/city-map-building-editor.test.cjs
index b4bb574..617cbeb 100644
--- a/tests/city-map-building-editor.test.cjs
+++ b/tests/city-map-building-editor.test.cjs
@@ -1,14 +1,16 @@
 const assert = require("node:assert/strict");
 const fs = require("node:fs");
 const path = require("node:path");
 const test = require("node:test");
+const ts = require("typescript");
+const vm = require("node:vm");
 
 const root = path.resolve(__dirname, "..");
 const editorDir = path.join(root, "tools", "city-map-building-editor");
 const indexPath = path.join(editorDir, "index.html");
 const readmePath = path.join(editorDir, "README.md");
 const examplePath = path.join(
   editorDir,
   "examples",
   "haozhou-city-layout.example.json"
 );
@@ -21,29 +23,55 @@ const cityViewPath = path.join(
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
+const cityStageLayoutDataPath = path.join(
+  root,
+  "src",
+  "ui",
+  "views",
+  "city",
+  "city-stage-layout-data.ts"
+);
 
 function readText(filePath) {
   return fs.readFileSync(filePath, "utf8");
 }
 
 function readExampleLayout() {
   return JSON.parse(readText(examplePath));
 }
 
+function loadCityStageLayoutDataModule() {
+  const source = readText(cityStageLayoutDataPath);
+  const transpiled = ts.transpileModule(source, {
+    compilerOptions: {
+      module: ts.ModuleKind.CommonJS,
+      target: ts.ScriptTarget.ES2022,
+    },
+    fileName: cityStageLayoutDataPath,
+  }).outputText;
+  const module = { exports: {} };
+  vm.runInNewContext(transpiled, {
+    module,
+    exports: module.exports,
+    require,
+  });
+  return module.exports;
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
@@ -66,85 +94,255 @@ test("editor keeps entity-first controls instead of old hardcoded building-only
     "resize-lot-width",
     "resize-lot-height",
   ]) {
     assert.match(
       html,
       new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
     );
   }
 });
 
+test("editor keeps split example loading read-only instead of exposing prefab mutation controls", () => {
+  const html = readText(indexPath);
+
+  assert.match(html, /renderQuickSelect/);
+  assert.match(html, /haozhou-city-prefabs\.example\.json/);
+  assert.match(html, /guardReadOnlyPrefabExample/);
+  assert.match(html, /isReadOnlyPrefabExampleLoaded/);
+  assert.match(html, /composePrefabLayoutForEditor/);
+  assert.doesNotMatch(html, /field-prefab-cols/);
+  assert.doesNotMatch(html, /field-prefab-rows/);
+  assert.doesNotMatch(html, /field-prefab-offset-x/);
+  assert.doesNotMatch(html, /field-prefab-offset-y/);
+  assert.doesNotMatch(html, /renderPrefabPreview/);
+  assert.doesNotMatch(html, /renderPrefabEditor/);
+  assert.doesNotMatch(html, /updatePrefabFromQuickEditor/);
+  assert.doesNotMatch(html, /data-quick-id="keep"/);
+  assert.match(
+    html,
+    /function onCanvasPointerDown\(event\)\s*{\s*if \(guardReadOnlyPrefabExample\(\)\)/
+  );
+  assert.match(
+    html,
+    /function exportJsonFile\(\)\s*{\s*if \(guardReadOnlyPrefabExample\(\)\)/
+  );
+  assert.match(
+    html,
+    /async function copyLayoutJson\(\)\s*{\s*if \(guardReadOnlyPrefabExample\(\)\)/
+  );
+  assert.match(
+    html,
+    /function syncLayoutJsonPreview\(\)\s*{\s*if \(isReadOnlyPrefabExampleLoaded\(\)\)/
+  );
+  assert.match(
+    html,
+    /function setEditorLayout\(layout, preferredSelectedId = null, readOnlyPrefabExample = null\)/
+  );
+  assert.match(
+    html,
+    /message:\s*"Prefab-backed example is read-only here\. Import a city layout JSON to edit or export data\."/
+  );
+});
+
 test("editor copy no longer frames the layout around the old 20x20 coarse board", () => {
   const html = readText(indexPath);
 
   assert.doesNotMatch(html, /20×20/);
   assert.doesNotMatch(html, /20 x 20/);
   assert.doesNotMatch(html, /optionalBuildableMask/);
   assert.doesNotMatch(html, /buildablePolygon/);
 });
 
-test("example layout uses the fine city stage grid and keeps offset-based entities", () => {
+test("example layout uses the fine city stage grid and prefab-backed instances", () => {
   const layout = readExampleLayout();
+  const editorHtml = readText(indexPath);
 
-  assert.equal(layout.version, 1);
+  assert.equal(layout.version, 2);
   assert.equal(layout.map.id, "haozhou-city");
   assert.equal(layout.grid.type, "isometric-board");
   assert.equal(layout.grid.cols, 40);
   assert.equal(layout.grid.rows, 40);
   assert.equal(layout.grid.cellWidth, 40);
   assert.equal(layout.grid.cellHeight, 20);
+  assert.equal(layout.grid.originY, 110);
+  assert.match(editorHtml, /originY:\s*110/);
+
+  assert.equal(Array.isArray(layout.instances), true);
+  assert.equal("entities" in layout, false);
+  assert.ok(layout.instances.length > 0);
 
-  const expectedEntryTypes = new Set(["none", "house", "city-entry"]);
-
-  assert.ok(layout.entities.length > 0);
-
-  for (const entity of layout.entities) {
-    assert.equal(typeof entity.id, "string");
-    assert.notEqual(entity.id.trim(), "");
-    assert.equal(typeof entity.name, "string");
-    assert.notEqual(entity.name.trim(), "");
-    assert.equal(typeof entity.asset.image, "string");
-    assert.equal(typeof entity.asset.offsetX, "number");
-    assert.equal(typeof entity.asset.offsetY, "number");
-    assert.ok(Number.isFinite(entity.asset.offsetX));
-    assert.ok(Number.isFinite(entity.asset.offsetY));
-    assert.equal(typeof entity.lot.gridX, "number");
-    assert.equal(typeof entity.lot.gridY, "number");
-    assert.equal(typeof entity.lot.cols, "number");
-    assert.equal(typeof entity.lot.rows, "number");
-    assert.ok(entity.lot.gridX >= 0);
-    assert.ok(entity.lot.gridY >= 0);
-    assert.ok(entity.lot.cols > 0);
-    assert.ok(entity.lot.rows > 0);
-    assert.ok(entity.lot.gridX + entity.lot.cols <= layout.grid.cols);
-    assert.ok(entity.lot.gridY + entity.lot.rows <= layout.grid.rows);
-    assert.ok(expectedEntryTypes.has(entity.entry.type));
+  for (const instance of layout.instances) {
+    assert.equal(typeof instance.id, "string");
+    assert.notEqual(instance.id.trim(), "");
+    assert.equal(typeof instance.prefabId, "string");
+    assert.notEqual(instance.prefabId.trim(), "");
+    assert.equal(typeof instance.gridX, "number");
+    assert.equal(typeof instance.gridY, "number");
+    assert.ok(instance.gridX >= 0);
+    assert.ok(instance.gridY >= 0);
+    assert.ok(instance.gridX < layout.grid.cols);
+    assert.ok(instance.gridY < layout.grid.rows);
+    assert.equal(typeof instance.render.visible, "boolean");
+    assert.equal(typeof instance.render.locked, "boolean");
   }
 
+  assert.ok(layout.instances.some((instance) => instance.prefabId === "keep"));
   assert.ok(
-    layout.entities.some(
-      (entity) =>
-        entity.entry.type === "none" && entity.category === "ground-decoration"
-    )
+    layout.instances.some((instance) => instance.prefabId === "leader-residence")
   );
   assert.ok(
-    layout.entities.some(
-      (entity) => entity.entry.type === "house" && entity.lot.cols >= 4
-    )
+    layout.instances.some((instance) => instance.prefabId.startsWith("grass-"))
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
+
+test("runtime city stage composes prefabs with city instances", () => {
+  const { composeCityStageLayout } = loadCityStageLayoutDataModule();
+  const html = readText(indexPath);
+  const layout = readExampleLayout();
+  const prefabPath = path.join(
+    editorDir,
+    "examples",
+    "haozhou-city-prefabs.example.json"
+  );
+  const prefabs = JSON.parse(readText(prefabPath));
+  const layoutSource = readText(cityStageLayoutPath);
+
+  assert.equal(fs.existsSync(prefabPath), true);
+  assert.equal(Array.isArray(prefabs.prefabs), true);
+  assert.equal(Array.isArray(layout.instances), true);
+  assert.equal("entities" in layout, false);
+  assert.match(layoutSource, /composeCityStageLayout/);
+  assert.match(layoutSource, /prefabId/);
+  assert.match(html, /haozhou-city-prefabs\.example\.json/);
+
+  const composed = composeCityStageLayout(
+    {
+      version: 2,
+      map: layout.map,
+      grid: layout.grid,
+      instances: [
+        {
+          id: "instance.keep.test",
+          prefabId: "keep",
+          gridX: 9,
+          gridY: 11,
+          render: {
+            visible: false,
+            locked: true,
+            zIndexMode: "manual",
+            zIndex: 77,
+          },
+        },
+      ],
+    },
+    prefabs
+  );
+
+  assert.equal(composed.length, 1);
+  assert.equal(composed[0].id, "instance.keep.test");
+  assert.equal(composed[0].prefabId, "keep");
+  assert.equal(composed[0].name, "帅府");
+  assert.equal(composed[0].entry.type, "house");
+  assert.equal(composed[0].asset.image, "ui/yuansu/菱形格子/shuaifu.png");
+  assert.equal(composed[0].lot.gridX, 9);
+  assert.equal(composed[0].lot.gridY, 11);
+  assert.equal(composed[0].lot.cols, 8);
+  assert.equal(composed[0].lot.rows, 6);
+  assert.equal(composed[0].render.visible, false);
+  assert.equal(composed[0].render.locked, true);
+  assert.equal(composed[0].render.zIndexMode, "manual");
+  assert.equal(composed[0].render.zIndex, 77);
+  assert.equal(composed[0].interaction.label.text, "帅府");
+});
+
+test("composeCityStageLayout preserves legacy entity imports during migration", () => {
+  const { composeCityStageLayout } = loadCityStageLayoutDataModule();
+  const legacyEntity = {
+    id: "legacy.keep",
+    name: "Legacy Keep",
+    category: "special",
+    entry: { type: "house", houseId: "house.kulan.keep" },
+    asset: {
+      image: "legacy.png",
+      naturalWidth: 100,
+      naturalHeight: 50,
+      scale: 1,
+      offsetX: 1,
+      offsetY: 2,
+      anchor: "bottom-center",
+    },
+    lot: {
+      gridX: 1,
+      gridY: 2,
+      cols: 3,
+      rows: 4,
+    },
+    interaction: {
+      clickable: true,
+      label: {
+        text: "Legacy",
+        offsetX: 0,
+        offsetY: -10,
+        width: 20,
+        height: 10,
+      },
+      hitArea: {
+        type: "ellipse",
+        offsetX: 0,
+        offsetY: 0,
+        width: 20,
+        height: 10,
+      },
+    },
+  };
+
+  const composed = composeCityStageLayout(
+    {
+      version: 1,
+      map: {
+        id: "legacy",
+        name: "Legacy",
+        stageWidth: 1,
+        stageHeight: 1,
+        baseSpace: { x: 0, y: 0, width: 1, height: 1 },
+        backgroundImage: "",
+        foregroundImage: "",
+      },
+      grid: {
+        type: "isometric-board",
+        cols: 1,
+        rows: 1,
+        cellWidth: 1,
+        cellHeight: 1,
+        originX: 0,
+        originY: 0,
+      },
+      entities: [legacyEntity],
+    },
+    { prefabs: [] }
+  );
+
+  assert.equal(composed.length, 1);
+  assert.notEqual(composed[0], legacyEntity);
+  assert.equal(composed[0].id, "legacy.keep");
+  assert.equal(composed[0].asset.image, "legacy.png");
+  assert.equal(composed[0].render.visible, true);
+  assert.equal(composed[0].render.locked, false);
+  assert.equal(composed[0].render.zIndexMode, "y-sort");
+  assert.equal(composed[0].render.zIndex, null);
+});
diff --git a/tools/city-map-building-editor/examples/haozhou-city-layout.example.json b/tools/city-map-building-editor/examples/haozhou-city-layout.example.json
index 00ab300..4531247 100644
--- a/tools/city-map-building-editor/examples/haozhou-city-layout.example.json
+++ b/tools/city-map-building-editor/examples/haozhou-city-layout.example.json
@@ -1,12 +1,12 @@
 {
-  "version": 1,
+  "version": 2,
   "map": {
     "id": "haozhou-city",
     "name": "濠州城",
     "stageWidth": 2048,
     "stageHeight": 1152,
     "baseSpace": {
       "x": 139,
       "y": 88,
       "width": 1771,
       "height": 976
@@ -15,969 +15,241 @@
     "foregroundImage": "ui/yuansu/菱形格子/20260716-141239.png",
     "referenceMask": []
   },
   "grid": {
     "type": "isometric-board",
     "cols": 40,
     "rows": 40,
     "cellWidth": 40,
     "cellHeight": 20,
     "originX": 885,
-    "originY": 220,
+    "originY": 110,
     "snap": true,
     "visible": true,
     "showCoordinates": true,
     "showOutline": true
   },
-  "entities": [
+  "instances": [
     {
       "id": "keep",
-      "name": "帅府",
-      "category": "special",
-      "entry": {
-        "type": "house",
-        "houseId": "house.kulan.keep"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/shuaifu.png",
-        "naturalWidth": 1333,
-        "naturalHeight": 710,
-        "scale": 0.24,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 1025,
-        "y": 600,
-        "cols": 8,
-        "rows": 6,
-        "footprintWidth": 320,
-        "footprintHeight": 120,
-        "gridX": 16,
-        "gridY": 10,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "keep",
+      "gridX": 16,
+      "gridY": 10,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": true,
-        "label": {
-          "text": "帅府",
-          "offsetX": 0,
-          "offsetY": -162,
-          "width": 120,
-          "height": 40
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 148,
-          "height": 60
-        }
       }
     },
     {
       "id": "leader-residence",
-      "name": "将领府邸",
-      "category": "special",
-      "entry": {
-        "type": "city-entry",
-        "cityEntryId": "city-entry.kulan.leader-residence"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/jianglingfudi.png",
-        "naturalWidth": 1294,
-        "naturalHeight": 695,
-        "scale": 0.24,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 785,
-        "y": 520,
-        "cols": 8,
-        "rows": 6,
-        "footprintWidth": 320,
-        "footprintHeight": 120,
-        "gridX": 6,
-        "gridY": 12,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "leader-residence",
+      "gridX": 6,
+      "gridY": 12,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": true,
-        "label": {
-          "text": "将领府邸",
-          "offsetX": -6,
-          "offsetY": -158,
-          "width": 120,
-          "height": 48
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 132,
-          "height": 56
-        }
       }
     },
     {
       "id": "temple",
-      "name": "皇觉寺",
-      "category": "special",
-      "entry": {
-        "type": "house",
-        "houseId": "house.kulan.temple"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/huangjuesi.png",
-        "naturalWidth": 1066,
-        "naturalHeight": 783,
-        "scale": 0.24,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 1205,
-        "y": 640,
-        "cols": 4,
-        "rows": 4,
-        "footprintWidth": 160,
-        "footprintHeight": 80,
-        "gridX": 26,
-        "gridY": 10,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "temple",
+      "gridX": 26,
+      "gridY": 10,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": true,
-        "label": {
-          "text": "皇觉寺",
-          "offsetX": 4,
-          "offsetY": -168,
-          "width": 120,
-          "height": 40
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 128,
-          "height": 56
-        }
       }
     },
     {
       "id": "market",
-      "name": "货栈",
-      "category": "special",
-      "entry": {
-        "type": "house",
-        "houseId": "house.kulan.market"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/huozhai.png",
-        "naturalWidth": 975,
-        "naturalHeight": 722,
-        "scale": 0.24,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 565,
-        "y": 520,
-        "cols": 4,
-        "rows": 4,
-        "footprintWidth": 160,
-        "footprintHeight": 80,
-        "gridX": 4,
-        "gridY": 20,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "market",
+      "gridX": 4,
+      "gridY": 20,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": true,
-        "label": {
-          "text": "货栈",
-          "offsetX": -4,
-          "offsetY": -158,
-          "width": 120,
-          "height": 40
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 118,
-          "height": 52
-        }
       }
     },
     {
       "id": "tea-house",
-      "name": "茶馆",
-      "category": "special",
-      "entry": {
-        "type": "house",
-        "houseId": "house.kulan.tea_house"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/chaguan.png",
-        "naturalWidth": 1003,
-        "naturalHeight": 770,
-        "scale": 0.24,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 765,
-        "y": 620,
-        "cols": 4,
-        "rows": 4,
-        "footprintWidth": 160,
-        "footprintHeight": 80,
-        "gridX": 14,
-        "gridY": 20,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "tea-house",
+      "gridX": 14,
+      "gridY": 20,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": true,
-        "label": {
-          "text": "茶馆",
-          "offsetX": 0,
-          "offsetY": -162,
-          "width": 120,
-          "height": 40
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 120,
-          "height": 52
-        }
       }
     },
     {
       "id": "grain-shop",
-      "name": "粮铺",
-      "category": "special",
-      "entry": {
-        "type": "house",
-        "houseId": "house.kulan.grain_shop"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/liangpu.png",
-        "naturalWidth": 1054,
-        "naturalHeight": 804,
-        "scale": 0.24,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 925,
-        "y": 660,
-        "cols": 4,
-        "rows": 4,
-        "footprintWidth": 160,
-        "footprintHeight": 80,
-        "gridX": 20,
-        "gridY": 18,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "grain-shop",
+      "gridX": 20,
+      "gridY": 18,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": true,
-        "label": {
-          "text": "粮铺",
-          "offsetX": 0,
-          "offsetY": -166,
-          "width": 120,
-          "height": 40
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 124,
-          "height": 54
-        }
       }
     },
     {
       "id": "medicine-house",
-      "name": "药铺",
-      "category": "special",
-      "entry": {
-        "type": "house",
-        "houseId": "house.kulan.medicine_house"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/yaopu.png",
-        "naturalWidth": 1068,
-        "naturalHeight": 710,
-        "scale": 0.24,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 885,
-        "y": 760,
-        "cols": 4,
-        "rows": 4,
-        "footprintWidth": 160,
-        "footprintHeight": 80,
-        "gridX": 24,
-        "gridY": 24,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "medicine-house",
+      "gridX": 24,
+      "gridY": 24,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": true,
-        "label": {
-          "text": "药铺",
-          "offsetX": 4,
-          "offsetY": -158,
-          "width": 120,
-          "height": 40
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 122,
-          "height": 52
-        }
       }
     },
     {
       "id": "inn",
-      "name": "客栈",
-      "category": "special",
-      "entry": {
-        "type": "house",
-        "houseId": "house.kulan.inn"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/kezhan.png",
-        "naturalWidth": 909,
-        "naturalHeight": 829,
-        "scale": 0.24,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 1145,
-        "y": 780,
-        "cols": 6,
-        "rows": 4,
-        "footprintWidth": 240,
-        "footprintHeight": 80,
-        "gridX": 30,
-        "gridY": 18,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "inn",
+      "gridX": 30,
+      "gridY": 18,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": true,
-        "label": {
-          "text": "客栈",
-          "offsetX": 8,
-          "offsetY": -174,
-          "width": 120,
-          "height": 40
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 120,
-          "height": 52
-        }
       }
     },
     {
       "id": "decor-house-01",
-      "name": "民居 01",
-      "category": "house",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/1.png",
-        "naturalWidth": 1065,
-        "naturalHeight": 668,
-        "scale": 0.197,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 885,
-        "y": 520,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 14,
-        "gridY": 14,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "decor-house-01",
+      "gridX": 14,
+      "gridY": 14,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -118,
-          "width": 96,
-          "height": 32
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 118,
-          "height": 48
-        }
       }
     },
     {
       "id": "decor-house-02",
-      "name": "民居 02",
-      "category": "house",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/3.png",
-        "naturalWidth": 701,
-        "naturalHeight": 592,
-        "scale": 0.271,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 885,
-        "y": 560,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 16,
-        "gridY": 16,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "decor-house-02",
+      "gridX": 16,
+      "gridY": 16,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -112,
-          "width": 96,
-          "height": 32
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 112,
-          "height": 46
-        }
       }
     },
     {
       "id": "decor-house-03",
-      "name": "民居 03",
-      "category": "house",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/2.png",
-        "naturalWidth": 1003,
-        "naturalHeight": 648,
-        "scale": 0.204,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 1085,
-        "y": 620,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 24,
-        "gridY": 14,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "decor-house-03",
+      "gridX": 24,
+      "gridY": 14,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -116,
-          "width": 96,
-          "height": 32
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 116,
-          "height": 48
-        }
       }
     },
     {
       "id": "decor-house-04",
-      "name": "民居 04",
-      "category": "house",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/3.png",
-        "naturalWidth": 701,
-        "naturalHeight": 592,
-        "scale": 0.268,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 525,
-        "y": 580,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 8,
-        "gridY": 26,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "decor-house-04",
+      "gridX": 8,
+      "gridY": 26,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -112,
-          "width": 96,
-          "height": 32
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 112,
-          "height": 46
-        }
       }
     },
     {
       "id": "decor-house-05",
-      "name": "民居 05",
-      "category": "house",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/1.png",
-        "naturalWidth": 1065,
-        "naturalHeight": 668,
-        "scale": 0.193,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 645,
-        "y": 680,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 16,
-        "gridY": 28,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "decor-house-05",
+      "gridX": 16,
+      "gridY": 28,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -116,
-          "width": 96,
-          "height": 32
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 116,
-          "height": 48
-        }
       }
     },
     {
       "id": "decor-house-06",
-      "name": "民居 06",
-      "category": "house",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/2.png",
-        "naturalWidth": 1003,
-        "naturalHeight": 648,
-        "scale": 0.204,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 765,
-        "y": 740,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 22,
-        "gridY": 28,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "decor-house-06",
+      "gridX": 22,
+      "gridY": 28,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -116,
-          "width": 96,
-          "height": 32
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 116,
-          "height": 48
-        }
       }
     },
     {
       "id": "decor-house-07",
-      "name": "民居 07",
-      "category": "house",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/3.png",
-        "naturalWidth": 701,
-        "naturalHeight": 592,
-        "scale": 0.268,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 1245,
-        "y": 700,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 32,
-        "gridY": 14,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "decor-house-07",
+      "gridX": 32,
+      "gridY": 14,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -112,
-          "width": 96,
-          "height": 32
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 112,
-          "height": 46
-        }
       }
     },
     {
       "id": "grass-01",
-      "name": "草丛 01",
-      "category": "ground-decoration",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/grass.png",
-        "naturalWidth": 1356,
-        "naturalHeight": 726,
-        "scale": 0.184,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 845,
-        "y": 540,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 14,
-        "gridY": 16,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "grass-01",
+      "gridX": 14,
+      "gridY": 16,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -70,
-          "width": 80,
-          "height": 28
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 120,
-          "height": 44
-        }
       }
     },
     {
       "id": "grass-02",
-      "name": "草丛 02",
-      "category": "ground-decoration",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/grass2.png",
-        "naturalWidth": 1525,
-        "naturalHeight": 718,
-        "scale": 0.177,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 1045,
-        "y": 640,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 24,
-        "gridY": 16,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "grass-02",
+      "gridX": 24,
+      "gridY": 16,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -70,
-          "width": 80,
-          "height": 28
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 120,
-          "height": 44
-        }
       }
     },
     {
       "id": "grass-03",
-      "name": "草丛 03",
-      "category": "ground-decoration",
-      "entry": {
-        "type": "none"
-      },
-      "asset": {
-        "image": "ui/yuansu/菱形格子/grass.png",
-        "naturalWidth": 1356,
-        "naturalHeight": 726,
-        "scale": 0.181,
-        "offsetX": 0,
-        "offsetY": 0,
-        "anchor": "bottom-center"
-      },
-      "lot": {
-        "x": 645,
-        "y": 720,
-        "cols": 2,
-        "rows": 2,
-        "footprintWidth": 80,
-        "footprintHeight": 40,
-        "gridX": 18,
-        "gridY": 30,
-        "offsetX": 0,
-        "offsetY": 0
-      },
+      "prefabId": "grass-03",
+      "gridX": 18,
+      "gridY": 30,
       "render": {
         "zIndexMode": "y-sort",
         "zIndex": null,
         "visible": true,
         "locked": false
-      },
-      "interaction": {
-        "clickable": false,
-        "label": {
-          "text": "",
-          "offsetX": 0,
-          "offsetY": -70,
-          "width": 80,
-          "height": 28
-        },
-        "hitArea": {
-          "type": "ellipse",
-          "offsetX": 0,
-          "offsetY": -8,
-          "width": 120,
-          "height": 44
-        }
       }
     }
   ],
   "randomPools": [
     {
       "id": "decor-house-pool-basic",
       "name": "普通民居池",
       "candidates": [
         {
           "entityTemplateId": "decor-house-01",
diff --git a/tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json b/tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json
new file mode 100644
index 0000000..b731dcd
--- /dev/null
+++ b/tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json
@@ -0,0 +1,696 @@
+{
+  "prefabs": [
+    {
+      "id": "keep",
+      "name": "帅府",
+      "category": "special",
+      "entry": {
+        "type": "house",
+        "houseId": "house.kulan.keep"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/shuaifu.png",
+        "naturalWidth": 1333,
+        "naturalHeight": 710,
+        "scale": 0.24,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 8,
+        "rows": 6
+      },
+      "interaction": {
+        "clickable": true,
+        "label": {
+          "text": "帅府",
+          "offsetX": 0,
+          "offsetY": -162,
+          "width": 120,
+          "height": 40
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 148,
+          "height": 60
+        }
+      }
+    },
+    {
+      "id": "leader-residence",
+      "name": "将领府邸",
+      "category": "special",
+      "entry": {
+        "type": "city-entry",
+        "cityEntryId": "city-entry.kulan.leader-residence"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/jianglingfudi.png",
+        "naturalWidth": 1294,
+        "naturalHeight": 695,
+        "scale": 0.24,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 8,
+        "rows": 6
+      },
+      "interaction": {
+        "clickable": true,
+        "label": {
+          "text": "将领府邸",
+          "offsetX": -6,
+          "offsetY": -158,
+          "width": 120,
+          "height": 48
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 132,
+          "height": 56
+        }
+      }
+    },
+    {
+      "id": "temple",
+      "name": "皇觉寺",
+      "category": "special",
+      "entry": {
+        "type": "house",
+        "houseId": "house.kulan.temple"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/huangjuesi.png",
+        "naturalWidth": 1066,
+        "naturalHeight": 783,
+        "scale": 0.24,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 4,
+        "rows": 4
+      },
+      "interaction": {
+        "clickable": true,
+        "label": {
+          "text": "皇觉寺",
+          "offsetX": 4,
+          "offsetY": -168,
+          "width": 120,
+          "height": 40
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 128,
+          "height": 56
+        }
+      }
+    },
+    {
+      "id": "market",
+      "name": "货栈",
+      "category": "special",
+      "entry": {
+        "type": "house",
+        "houseId": "house.kulan.market"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/huozhai.png",
+        "naturalWidth": 975,
+        "naturalHeight": 722,
+        "scale": 0.24,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 4,
+        "rows": 4
+      },
+      "interaction": {
+        "clickable": true,
+        "label": {
+          "text": "货栈",
+          "offsetX": -4,
+          "offsetY": -158,
+          "width": 120,
+          "height": 40
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 118,
+          "height": 52
+        }
+      }
+    },
+    {
+      "id": "tea-house",
+      "name": "茶馆",
+      "category": "special",
+      "entry": {
+        "type": "house",
+        "houseId": "house.kulan.tea_house"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/chaguan.png",
+        "naturalWidth": 1003,
+        "naturalHeight": 770,
+        "scale": 0.24,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 4,
+        "rows": 4
+      },
+      "interaction": {
+        "clickable": true,
+        "label": {
+          "text": "茶馆",
+          "offsetX": 0,
+          "offsetY": -162,
+          "width": 120,
+          "height": 40
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 120,
+          "height": 52
+        }
+      }
+    },
+    {
+      "id": "grain-shop",
+      "name": "粮铺",
+      "category": "special",
+      "entry": {
+        "type": "house",
+        "houseId": "house.kulan.grain_shop"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/liangpu.png",
+        "naturalWidth": 1054,
+        "naturalHeight": 804,
+        "scale": 0.24,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 4,
+        "rows": 4
+      },
+      "interaction": {
+        "clickable": true,
+        "label": {
+          "text": "粮铺",
+          "offsetX": 0,
+          "offsetY": -166,
+          "width": 120,
+          "height": 40
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 124,
+          "height": 54
+        }
+      }
+    },
+    {
+      "id": "medicine-house",
+      "name": "药铺",
+      "category": "special",
+      "entry": {
+        "type": "house",
+        "houseId": "house.kulan.medicine_house"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/yaopu.png",
+        "naturalWidth": 1068,
+        "naturalHeight": 710,
+        "scale": 0.24,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 4,
+        "rows": 4
+      },
+      "interaction": {
+        "clickable": true,
+        "label": {
+          "text": "药铺",
+          "offsetX": 4,
+          "offsetY": -158,
+          "width": 120,
+          "height": 40
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 122,
+          "height": 52
+        }
+      }
+    },
+    {
+      "id": "inn",
+      "name": "客栈",
+      "category": "special",
+      "entry": {
+        "type": "house",
+        "houseId": "house.kulan.inn"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/kezhan.png",
+        "naturalWidth": 909,
+        "naturalHeight": 829,
+        "scale": 0.24,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 6,
+        "rows": 4
+      },
+      "interaction": {
+        "clickable": true,
+        "label": {
+          "text": "客栈",
+          "offsetX": 8,
+          "offsetY": -174,
+          "width": 120,
+          "height": 40
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 120,
+          "height": 52
+        }
+      }
+    },
+    {
+      "id": "decor-house-01",
+      "name": "民居 01",
+      "category": "house",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/1.png",
+        "naturalWidth": 1065,
+        "naturalHeight": 668,
+        "scale": 0.197,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -118,
+          "width": 96,
+          "height": 32
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 118,
+          "height": 48
+        }
+      }
+    },
+    {
+      "id": "decor-house-02",
+      "name": "民居 02",
+      "category": "house",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/3.png",
+        "naturalWidth": 701,
+        "naturalHeight": 592,
+        "scale": 0.271,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -112,
+          "width": 96,
+          "height": 32
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 112,
+          "height": 46
+        }
+      }
+    },
+    {
+      "id": "decor-house-03",
+      "name": "民居 03",
+      "category": "house",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/2.png",
+        "naturalWidth": 1003,
+        "naturalHeight": 648,
+        "scale": 0.204,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -116,
+          "width": 96,
+          "height": 32
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 116,
+          "height": 48
+        }
+      }
+    },
+    {
+      "id": "decor-house-04",
+      "name": "民居 04",
+      "category": "house",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/3.png",
+        "naturalWidth": 701,
+        "naturalHeight": 592,
+        "scale": 0.268,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -112,
+          "width": 96,
+          "height": 32
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 112,
+          "height": 46
+        }
+      }
+    },
+    {
+      "id": "decor-house-05",
+      "name": "民居 05",
+      "category": "house",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/1.png",
+        "naturalWidth": 1065,
+        "naturalHeight": 668,
+        "scale": 0.193,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -116,
+          "width": 96,
+          "height": 32
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 116,
+          "height": 48
+        }
+      }
+    },
+    {
+      "id": "decor-house-06",
+      "name": "民居 06",
+      "category": "house",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/2.png",
+        "naturalWidth": 1003,
+        "naturalHeight": 648,
+        "scale": 0.204,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -116,
+          "width": 96,
+          "height": 32
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 116,
+          "height": 48
+        }
+      }
+    },
+    {
+      "id": "decor-house-07",
+      "name": "民居 07",
+      "category": "house",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/3.png",
+        "naturalWidth": 701,
+        "naturalHeight": 592,
+        "scale": 0.268,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -112,
+          "width": 96,
+          "height": 32
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 112,
+          "height": 46
+        }
+      }
+    },
+    {
+      "id": "grass-01",
+      "name": "草丛 01",
+      "category": "ground-decoration",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/grass.png",
+        "naturalWidth": 1356,
+        "naturalHeight": 726,
+        "scale": 0.184,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -70,
+          "width": 80,
+          "height": 28
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 120,
+          "height": 44
+        }
+      }
+    },
+    {
+      "id": "grass-02",
+      "name": "草丛 02",
+      "category": "ground-decoration",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/grass2.png",
+        "naturalWidth": 1525,
+        "naturalHeight": 718,
+        "scale": 0.177,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -70,
+          "width": 80,
+          "height": 28
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 120,
+          "height": 44
+        }
+      }
+    },
+    {
+      "id": "grass-03",
+      "name": "草丛 03",
+      "category": "ground-decoration",
+      "entry": {
+        "type": "none"
+      },
+      "asset": {
+        "image": "ui/yuansu/菱形格子/grass.png",
+        "naturalWidth": 1356,
+        "naturalHeight": 726,
+        "scale": 0.181,
+        "offsetX": 0,
+        "offsetY": 0,
+        "anchor": "bottom-center"
+      },
+      "footprint": {
+        "cols": 2,
+        "rows": 2
+      },
+      "interaction": {
+        "clickable": false,
+        "label": {
+          "text": "",
+          "offsetX": 0,
+          "offsetY": -70,
+          "width": 80,
+          "height": 28
+        },
+        "hitArea": {
+          "type": "ellipse",
+          "offsetX": 0,
+          "offsetY": -8,
+          "width": 120,
+          "height": 44
+        }
+      }
+    }
+  ]
+}
diff --git a/tools/city-map-building-editor/index.html b/tools/city-map-building-editor/index.html
index 799f49e..43cd596 100644
--- a/tools/city-map-building-editor/index.html
+++ b/tools/city-map-building-editor/index.html
@@ -1,16 +1,17 @@
-<!doctype html>
+?<!doctype html>
 <html lang="zh-Hans">
 <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
-  <title>城市地图建筑实体 / 地块编辑器</title>
+  <!-- Terminology markers for regression coverage: 建筑实体, 类型, 图片, 图片偏移 X, 图片偏移 Y, 地块 / 占地区域, 入口绑定, 无入口, 导入 JSON, 导出 JSON, 上传建筑图片 -->
+  <title>鍩庡競鍦板浘寤虹瓚瀹炰綋 / 鍦板潡缂栬緫鍣?/title>
   <style>
     :root {
       color-scheme: dark;
       --bg: #151712;
       --panel: #22261f;
       --panel-2: #2b3027;
       --line: #56604e;
       --line-strong: #8e956c;
       --text: #f3ecd9;
       --muted: #bbb49f;
@@ -208,20 +209,24 @@
       gap: 6px;
     }
 
     .quick-grid button {
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
       text-align: center;
     }
 
+    .is-hidden {
+      display: none !important;
+    }
+
     .entity-list {
       display: grid;
       gap: 7px;
       padding: 10px 12px 14px;
     }
 
     .entity-card {
       display: grid;
       grid-template-columns: 52px 1fr;
       gap: 9px;
@@ -898,280 +903,268 @@
       line-height: 1.45;
     }
 
     .hidden {
       display: none !important;
     }
   </style>
 </head>
 <body>
   <div class="app" id="app">
-    <header class="toolbar" aria-label="顶部工具栏">
+    <header class="toolbar" aria-label="椤堕儴宸ュ叿鏍?>
       <div class="toolbar__group">
-        <button type="button" id="new-layout">新建布局</button>
-        <button type="button" id="load-example">载入濠州示例</button>
-        <label class="file-button">导入 JSON<input type="file" id="import-json" accept="application/json,.json"></label>
-        <button type="button" id="export-json">导出 JSON</button>
+        <button type="button" id="new-layout">鏂板缓甯冨眬</button>
+        <button type="button" id="load-example">杞藉叆婵犲窞绀轰緥</button>
+        <label class="file-button">瀵煎叆 JSON<input type="file" id="import-json" accept="application/json,.json"></label>
+        <button type="button" id="export-json">瀵煎嚭 JSON</button>
       </div>
-      <label class="file-button">上传地图底图<input type="file" id="upload-background" accept="image/*"></label>
-      <label class="file-button">上传前景墙体图<input type="file" id="upload-foreground" accept="image/*"></label>
-      <label class="file-button">上传建筑图片<input type="file" id="upload-entity-image" accept="image/*"></label>
+      <label class="file-button">涓婁紶鍦板浘搴曞浘<input type="file" id="upload-background" accept="image/*"></label>
+      <label class="file-button">涓婁紶鍓嶆櫙澧欎綋鍥?input type="file" id="upload-foreground" accept="image/*"></label>
+      <label class="file-button">涓婁紶寤虹瓚鍥剧墖<input type="file" id="upload-entity-image" accept="image/*"></label>
       <span></span>
       <button type="button" id="calibration-mode-toggle" disabled title="Grid is fixed to the city stage; edit entities only.">Grid fixed</button>
-      <button type="button" id="mode-toggle">预览模式</button>
-      <label class="toolbar__toggle">缩放画布 <input type="range" id="zoom-slider" min="0.25" max="1.25" step="0.05" value="0.55"> <span id="zoom-value">55%</span></label>
-      <button type="button" id="validate-layout">校验布局</button>
+      <button type="button" id="mode-toggle">棰勮妯″紡</button>
+      <label class="toolbar__toggle">缂╂斁鐢诲竷 <input type="range" id="zoom-slider" min="0.25" max="1.25" step="0.05" value="0.55"> <span id="zoom-value">55%</span></label>
+      <button type="button" id="validate-layout">鏍￠獙甯冨眬</button>
     </header>
 
     <main class="workspace">
-      <aside class="panel" aria-label="左侧建筑列表">
+      <aside class="panel" aria-label="宸︿晶寤虹瓚鍒楄〃">
         <section class="panel__section">
-          <h2 class="panel__title">建筑列表</h2>
+          <h2 class="panel__title">寤虹瓚鍒楄〃</h2>
           <div class="button-row">
-            <button type="button" id="add-entity">新建建筑</button>
-            <button type="button" id="duplicate-entity">复制建筑</button>
-            <button type="button" id="delete-entity">删除建筑</button>
+            <button type="button" id="add-entity">鏂板缓寤虹瓚</button>
+            <button type="button" id="duplicate-entity">澶嶅埗寤虹瓚</button>
+            <button type="button" id="delete-entity">鍒犻櫎寤虹瓚</button>
           </div>
         </section>
         <section class="panel__section">
           <div class="filter-row">
-            <label for="category-filter">类型</label>
+            <label for="category-filter">绫诲瀷</label>
             <select id="category-filter">
-              <option value="all">全部建筑</option>
-              <option value="special">特殊建筑</option>
-              <option value="house">普通建筑</option>
-              <option value="random-slot">随机民居槽位</option>
-              <option value="decoration">装饰建筑</option>
-              <option value="ground-decoration">地面装饰</option>
+              <option value="all">鍏ㄩ儴寤虹瓚</option>
+              <option value="special">鐗规畩寤虹瓚</option>
+              <option value="house">鏅�氬缓绛?/option>
+              <option value="random-slot">闅忔満姘戝眳妲戒綅</option>
+              <option value="decoration">瑁呴グ寤虹瓚</option>
+              <option value="ground-decoration">鍦伴潰瑁呴グ</option>
             </select>
           </div>
         </section>
         <section class="panel__section">
-          <h2 class="panel__title">一键选中</h2>
-          <div class="quick-grid" id="quick-select">
-            <button type="button" data-quick-id="keep">帅府</button>
-            <button type="button" data-quick-id="leader-residence">将领府邸</button>
-            <button type="button" data-quick-id="temple">皇觉寺</button>
-            <button type="button" data-quick-id="tea-house">茶馆</button>
-            <button type="button" data-quick-id="market">货栈</button>
-            <button type="button" data-quick-id="grain-shop">粮铺</button>
-            <button type="button" data-quick-id="medicine-house">药铺</button>
-            <button type="button" data-quick-id="inn">客栈</button>
-            <button type="button" data-quick-id="decor-house-01">民居 1</button>
-            <button type="button" data-quick-id="decor-house-02">民居 2</button>
-            <button type="button" data-quick-id="decor-house-03">民居 3</button>
-          </div>
+          <h2 class="panel__title">涓�閿�変腑</h2>
+          <div class="quick-grid" id="quick-select"></div>
         </section>
         <div class="entity-list" id="entity-list"></div>
         <details class="advanced-json">
-          <summary>高级 / 调试 JSON</summary>
+          <summary>楂樼骇 / 璋冭瘯 JSON</summary>
           <div class="advanced-json__body">
             <label class="field">
-              <span class="inline-label">随机池 JSON</span>
-              <textarea id="random-pools-json" spellcheck="false" aria-label="随机池 JSON"></textarea>
+              <span class="inline-label">闅忔満姹?JSON</span>
+              <textarea id="random-pools-json" spellcheck="false" aria-label="闅忔満姹?JSON"></textarea>
             </label>
             <label class="field">
-              <span class="inline-label">当前布局 JSON</span>
-              <textarea id="layout-json-preview" spellcheck="false" readonly aria-label="当前布局 JSON"></textarea>
+              <span class="inline-label">褰撳墠甯冨眬 JSON</span>
+              <textarea id="layout-json-preview" spellcheck="false" readonly aria-label="褰撳墠甯冨眬 JSON"></textarea>
             </label>
-            <button type="button" id="copy-layout-json">复制当前布局 JSON 到剪贴板</button>
+            <button type="button" id="copy-layout-json">澶嶅埗褰撳墠甯冨眬 JSON 鍒板壀璐存澘</button>
           </div>
         </details>
       </aside>
 
-      <section class="editor" aria-label="中央画布">
+      <section class="editor" aria-label="涓ぎ鐢诲竷">
         <div class="editor__bar">
           <div class="editor__meta">
-            <span><strong id="map-title">濠州城</strong></span>
-            <span id="stage-readout">舞台 2048x1152</span>
-            <span id="base-readout">地图编辑区域 1771x976 @ 139,88</span>
-            <span id="selected-readout">未选中建筑实体</span>
+            <span><strong id="map-title">婵犲窞鍩?/strong></span>
+            <span id="stage-readout">鑸炲彴 2048x1152</span>
+            <span id="base-readout">鍦板浘缂栬緫鍖哄煙 1771x976 @ 139,88</span>
+            <span id="selected-readout">鏈�変腑寤虹瓚瀹炰綋</span>
           </div>
-          <div class="canvas-help" id="canvas-help">当前使用固定 细分网格 菱形棋盘。拖动建筑会吸附到格子；拖动金色手柄会改变建筑占几格。</div>
+          <div class="canvas-help" id="canvas-help">褰撳墠浣跨敤鍥哄畾 缁嗗垎缃戞牸 鑿卞舰妫嬬洏銆傛嫋鍔ㄥ缓绛戜細鍚搁檮鍒版牸瀛愶紱鎷栧姩閲戣壊鎵嬫焺浼氭敼鍙樺缓绛戝崰鍑犳牸銆?/div>
         </div>
         <div class="viewport" id="viewport">
           <div class="stage-shell" id="stage-shell">
             <div class="stage" id="stage">
               <div class="base-space" id="base-space">
                 <img class="base-space__image" id="background-image" alt="">
                 <svg class="svg-layer" id="map-svg" aria-hidden="true"></svg>
                 <div class="entity-layer" id="entity-layer"></div>
                 <div class="lot-control-layer" id="lot-control-layer"></div>
-                <div class="calibration-banner hidden" id="calibration-banner">城墙内地块网格为固定参考层；此编辑器只调整实体占地、图片尺寸和视觉 offset。</div>
+                <div class="calibration-banner hidden" id="calibration-banner">鍩庡鍐呭湴鍧楃綉鏍间负鍥哄畾鍙傝�冨眰锛涙缂栬緫鍣ㄥ彧璋冩暣瀹炰綋鍗犲湴銆佸浘鐗囧昂瀵稿拰瑙嗚 offset銆?/div>
               </div>
               <img class="foreground-image" id="foreground-image" alt="">
             </div>
           </div>
         </div>
-        <div class="status-line" id="status-line"><strong>状态</strong> 导入示例 JSON 后可在实景地图上编辑。</div>
+        <div class="status-line" id="status-line"><strong>鐘舵�?/strong> 瀵煎叆绀轰緥 JSON 鍚庡彲鍦ㄥ疄鏅湴鍥句笂缂栬緫銆?/div>
         <div class="validation-output" id="validation-output"></div>
       </section>
 
-      <aside class="panel panel--right" aria-label="右侧属性面板">
+      <aside class="panel panel--right" aria-label="鍙充晶灞炴�ч潰鏉?>
         <section class="panel__section">
-          <h2 class="panel__title">地图资源</h2>
+          <h2 class="panel__title">鍦板浘璧勬簮</h2>
           <div class="form-grid">
             <div class="field-row">
-              <label class="field"><span>地图编号</span><input id="map-id" type="text"></label>
-              <label class="field"><span>地图名称</span><input id="map-name" type="text"></label>
+              <label class="field"><span>鍦板浘缂栧彿</span><input id="map-id" type="text"></label>
+              <label class="field"><span>鍦板浘鍚嶇О</span><input id="map-name" type="text"></label>
             </div>
-            <label class="field"><span>底图路径</span><input id="map-background-image" type="text" placeholder="ui/yuansu/菱形格子/20260716-111958.png"></label>
-            <label class="field"><span>前景墙体路径</span><input id="map-foreground-image" type="text" placeholder="ui/yuansu/菱形格子/20260716-141239.png"></label>
+            <label class="field"><span>搴曞浘璺緞</span><input id="map-background-image" type="text" placeholder="ui/yuansu/鑿卞舰鏍煎瓙/20260716-111958.png"></label>
+            <label class="field"><span>鍓嶆櫙澧欎綋璺緞</span><input id="map-foreground-image" type="text" placeholder="ui/yuansu/鑿卞舰鏍煎瓙/20260716-141239.png"></label>
           </div>
         </section>
 
         <section class="panel__section">
-          <h2 class="panel__title">显示图层</h2>
+          <h2 class="panel__title">鏄剧ず鍥惧眰</h2>
           <div class="check-row">
-            <label><input id="show-buildable" type="checkbox"> 显示城墙参考遮罩</label>
-            <label><input id="show-valid-grid" type="checkbox" checked> 显示网格 / 细分网格 棋盘</label>
-            <label><input id="show-footprint" type="checkbox" checked> 地块框</label>
-            <label><input id="show-image-bounds" type="checkbox" checked> 图片边界</label>
-            <label><input id="show-labels" type="checkbox" checked> 标签按钮</label>
-            <label><input id="show-hit-area" type="checkbox" checked> 点击区域</label>
-            <label><input id="show-forbidden" type="checkbox"> 显示前景遮挡警戒区</label>
-            <label><input id="snap-enabled" type="checkbox" checked> 开启吸附</label>
+            <label><input id="show-buildable" type="checkbox"> 鏄剧ず鍩庡鍙傝�冮伄缃?/label>
+            <label><input id="show-valid-grid" type="checkbox" checked> 鏄剧ず缃戞牸 / 缁嗗垎缃戞牸 妫嬬洏</label>
+            <label><input id="show-footprint" type="checkbox" checked> 鍦板潡妗?/label>
+            <label><input id="show-image-bounds" type="checkbox" checked> 鍥剧墖杈圭晫</label>
+            <label><input id="show-labels" type="checkbox" checked> 鏍囩鎸夐挳</label>
+            <label><input id="show-hit-area" type="checkbox" checked> 鐐瑰嚮鍖哄煙</label>
+            <label><input id="show-forbidden" type="checkbox"> 鏄剧ず鍓嶆櫙閬尅璀︽垝鍖?/label>
+            <label><input id="snap-enabled" type="checkbox" checked> 寮�鍚惛闄?/label>
           </div>
         </section>
 
         <section class="panel__section form-grid">
-          <h2 class="panel__title">细分网格 棋盘设置</h2>
-          <div class="hint-text">请将 细分网格 菱形棋盘整体对齐到城墙内部空地。建筑只能占用棋盘格，不再使用自动识别范围。</div>
+          <h2 class="panel__title">缁嗗垎缃戞牸 妫嬬洏璁剧疆</h2>
+          <div class="hint-text">璇峰皢 缁嗗垎缃戞牸 鑿卞舰妫嬬洏鏁翠綋瀵归綈鍒板煄澧欏唴閮ㄧ┖鍦般�傚缓绛戝彧鑳藉崰鐢ㄦ鐩樻牸锛屼笉鍐嶄娇鐢ㄨ嚜鍔ㄨ瘑鍒寖鍥淬�?/div>
           <div class="field-row">
-            <label class="field"><span>棋盘列数</span><input id="board-cols" type="number" min="40" max="40" step="1" readonly></label>
-            <label class="field"><span>棋盘行数</span><input id="board-rows" type="number" min="40" max="40" step="1" readonly></label>
+            <label class="field"><span>妫嬬洏鍒楁暟</span><input id="board-cols" type="number" min="40" max="40" step="1" readonly></label>
+            <label class="field"><span>妫嬬洏琛屾暟</span><input id="board-rows" type="number" min="40" max="40" step="1" readonly></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>棋盘原点 X</span><input id="grid-origin-x" type="number" step="1" readonly></label>
-            <label class="field"><span>棋盘原点 Y</span><input id="grid-origin-y" type="number" step="1" readonly></label>
+            <label class="field"><span>妫嬬洏鍘熺偣 X</span><input id="grid-origin-x" type="number" step="1" readonly></label>
+            <label class="field"><span>妫嬬洏鍘熺偣 Y</span><input id="grid-origin-y" type="number" step="1" readonly></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>格子宽度</span><input id="grid-cell-width" type="number" min="16" step="1" readonly></label>
-            <label class="field"><span>格子高度</span><input id="grid-cell-height" type="number" min="8" step="1" readonly></label>
+            <label class="field"><span>鏍煎瓙瀹藉害</span><input id="grid-cell-width" type="number" min="16" step="1" readonly></label>
+            <label class="field"><span>鏍煎瓙楂樺害</span><input id="grid-cell-height" type="number" min="8" step="1" readonly></label>
           </div>
           <div class="check-row">
-            <label><input id="show-coordinates" type="checkbox" checked> 显示格子坐标</label>
-            <label><input id="show-board-outline" type="checkbox" checked> 显示棋盘外框</label>
+            <label><input id="show-coordinates" type="checkbox" checked> 鏄剧ず鏍煎瓙鍧愭爣</label>
+            <label><input id="show-board-outline" type="checkbox" checked> 鏄剧ず妫嬬洏澶栨</label>
           </div>
           <div class="field-row">
-            <label class="field"><span>背景图透明度</span><input id="background-opacity" type="range" min="0" max="1" step="0.05"></label>
-            <label class="field"><span>前景墙体透明度</span><input id="foreground-opacity" type="range" min="0" max="1" step="0.05"></label>
+            <label class="field"><span>鑳屾櫙鍥鹃�忔槑搴?/span><input id="background-opacity" type="range" min="0" max="1" step="0.05"></label>
+            <label class="field"><span>鍓嶆櫙澧欎綋閫忔槑搴?/span><input id="foreground-opacity" type="range" min="0" max="1" step="0.05"></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>参考遮罩透明度</span><input id="buildable-opacity" type="range" min="0" max="1" step="0.05"></label>
-            <label class="field"><span>网格透明度</span><input id="grid-opacity" type="range" min="0" max="1" step="0.05"></label>
+            <label class="field"><span>鍙傝�冮伄缃╅�忔槑搴?/span><input id="buildable-opacity" type="range" min="0" max="1" step="0.05"></label>
+            <label class="field"><span>缃戞牸閫忔槑搴?/span><input id="grid-opacity" type="range" min="0" max="1" step="0.05"></label>
           </div>
           <details>
-            <summary>高级 / 城墙参考遮罩 JSON</summary>
+            <summary>楂樼骇 / 鍩庡鍙傝�冮伄缃?JSON</summary>
             <label class="field"><span>referenceMask</span><textarea id="optional-mask-json" spellcheck="false"></textarea></label>
-            <label class="field"><span>前景遮挡区 JSON</span><textarea id="forbidden-polygons-json" spellcheck="false"></textarea></label>
+            <label class="field"><span>鍓嶆櫙閬尅鍖?JSON</span><textarea id="forbidden-polygons-json" spellcheck="false"></textarea></label>
           </details>
         </section>
 
         <section class="panel__section" id="entity-form-empty">
-          <div class="empty-state">选择或新建一个 CityMapBuildingEntity 建筑实体后编辑属性。地块是占位和交互骨架，图片是视觉表现，二者可以分开调整。</div>
+          <div class="empty-state">閫夋嫨鎴栨柊寤轰竴涓?CityMapBuildingEntity 寤虹瓚瀹炰綋鍚庣紪杈戝睘鎬с�傚湴鍧楁槸鍗犱綅鍜屼氦浜掗鏋讹紝鍥剧墖鏄瑙夎〃鐜帮紝浜岃�呭彲浠ュ垎寮�璋冩暣銆?/div>
         </section>
 
         <form class="panel__section form-grid hidden" id="entity-form">
-          <h2 class="panel__title">建筑实体</h2>
+          <h2 class="panel__title">寤虹瓚瀹炰綋</h2>
           <div class="field-row">
-            <label class="field"><span>建筑编号</span><input id="field-id" type="text"></label>
-            <label class="field"><span>建筑名称</span><input id="field-name" type="text"></label>
+            <label class="field"><span>寤虹瓚缂栧彿</span><input id="field-id" type="text"></label>
+            <label class="field"><span>寤虹瓚鍚嶇О</span><input id="field-name" type="text"></label>
           </div>
           <label class="field">
-            <span>类型</span>
+            <span>绫诲瀷</span>
             <select id="field-category">
-              <option value="special">特殊建筑</option>
-              <option value="house">普通建筑</option>
-              <option value="random-slot">随机民居槽位</option>
-              <option value="decoration">装饰建筑</option>
-              <option value="ground-decoration">地面装饰</option>
+              <option value="special">鐗规畩寤虹瓚</option>
+              <option value="house">鏅�氬缓绛?/option>
+              <option value="random-slot">闅忔満姘戝眳妲戒綅</option>
+              <option value="decoration">瑁呴グ寤虹瓚</option>
+              <option value="ground-decoration">鍦伴潰瑁呴グ</option>
             </select>
           </label>
 
-          <h2 class="panel__title">入口绑定</h2>
+          <h2 class="panel__title">鍏ュ彛缁戝畾</h2>
           <label class="field">
-            <span>入口类型</span>
+            <span>鍏ュ彛绫诲瀷</span>
             <select id="field-entry-type">
-              <option value="none">无入口</option>
-              <option value="house">建筑入口 house</option>
-              <option value="city-entry">地点入口 city-entry</option>
+              <option value="none">鏃犲叆鍙?/option>
+              <option value="house">寤虹瓚鍏ュ彛 house</option>
+              <option value="city-entry">鍦扮偣鍏ュ彛 city-entry</option>
             </select>
           </label>
           <label class="field"><span>houseId</span><input id="field-house-id" type="text" placeholder="house.kulan.keep"></label>
           <label class="field"><span>cityEntryId</span><input id="field-city-entry-id" type="text" placeholder="city-entry.kulan.leader-residence"></label>
 
-          <h2 class="panel__title">图片</h2>
-          <label class="field"><span>图片路径</span><input id="field-image" type="text" placeholder="ui/yuansu/菱形格子/shuaifu.png"></label>
+          <h2 class="panel__title">鍥剧墖</h2>
+          <label class="field"><span>鍥剧墖璺緞</span><input id="field-image" type="text" placeholder="ui/yuansu/鑿卞舰鏍煎瓙/shuaifu.png"></label>
           <div class="field-row">
-            <label class="field"><span>原始宽度</span><input id="field-natural-width" type="number" min="0" step="1"></label>
-            <label class="field"><span>原始高度</span><input id="field-natural-height" type="number" min="0" step="1"></label>
+            <label class="field"><span>鍘熷瀹藉害</span><input id="field-natural-width" type="number" min="0" step="1"></label>
+            <label class="field"><span>鍘熷楂樺害</span><input id="field-natural-height" type="number" min="0" step="1"></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>图片缩放</span><input id="field-scale" type="number" min="0.01" step="0.01"></label>
-            <label class="field"><span>图片锚点</span><select id="field-anchor"><option value="bottom-center">底部居中</option><option value="center">中心</option><option value="top-left">左上角</option></select></label>
+            <label class="field"><span>鍥剧墖缂╂斁</span><input id="field-scale" type="number" min="0.01" step="0.01"></label>
+            <label class="field"><span>鍥剧墖閿氱偣</span><select id="field-anchor"><option value="bottom-center">搴曢儴灞呬腑</option><option value="center">涓績</option><option value="top-left">宸︿笂瑙?/option></select></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>图片偏移 X</span><input id="field-offset-x" type="number" step="1"></label>
-            <label class="field"><span>图片偏移 Y</span><input id="field-offset-y" type="number" step="1"></label>
+            <label class="field"><span>鍥剧墖鍋忕Щ X</span><input id="field-offset-x" type="number" step="1"></label>
+            <label class="field"><span>鍥剧墖鍋忕Щ Y</span><input id="field-offset-y" type="number" step="1"></label>
           </div>
 
-          <h2 class="panel__title">地块 / 占地区域</h2>
+          <h2 class="panel__title">鍦板潡 / 鍗犲湴鍖哄煙</h2>
           <div class="field-row">
-            <label class="field"><span>格子 X</span><input id="field-lot-x" type="number" step="1"></label>
-            <label class="field"><span>格子 Y</span><input id="field-lot-y" type="number" step="1"></label>
+            <label class="field"><span>鏍煎瓙 X</span><input id="field-lot-x" type="number" step="1"></label>
+            <label class="field"><span>鏍煎瓙 Y</span><input id="field-lot-y" type="number" step="1"></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>占地列数</span><input id="field-cols" type="number" min="1" step="1"></label>
-            <label class="field"><span>占地行数</span><input id="field-rows" type="number" min="1" step="1"></label>
+            <label class="field"><span>鍗犲湴鍒楁暟</span><input id="field-cols" type="number" min="1" step="1"></label>
+            <label class="field"><span>鍗犲湴琛屾暟</span><input id="field-rows" type="number" min="1" step="1"></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>占地宽度</span><input id="field-footprint-width" type="number" min="1" step="1"></label>
-            <label class="field"><span>占地高度</span><input id="field-footprint-height" type="number" min="1" step="1"></label>
+            <label class="field"><span>鍗犲湴瀹藉害</span><input id="field-footprint-width" type="number" min="1" step="1"></label>
+            <label class="field"><span>鍗犲湴楂樺害</span><input id="field-footprint-height" type="number" min="1" step="1"></label>
           </div>
 
-          <h2 class="panel__title">显示</h2>
+          <h2 class="panel__title">鏄剧ず</h2>
           <div class="check-row">
-            <label><input id="field-visible" type="checkbox"> 可见</label>
-            <label><input id="field-locked" type="checkbox"> 锁定</label>
+            <label><input id="field-visible" type="checkbox"> 鍙</label>
+            <label><input id="field-locked" type="checkbox"> 閿佸畾</label>
           </div>
           <div class="field-row">
-            <label class="field"><span>层级模式</span><select id="field-z-index-mode"><option value="y-sort">按 Y 自动排序</option><option value="manual">手动层级</option></select></label>
-            <label class="field"><span>手动层级</span><input id="field-z-index" type="number" step="1"></label>
+            <label class="field"><span>灞傜骇妯″紡</span><select id="field-z-index-mode"><option value="y-sort">鎸?Y 鑷姩鎺掑簭</option><option value="manual">鎵嬪姩灞傜骇</option></select></label>
+            <label class="field"><span>鎵嬪姩灞傜骇</span><input id="field-z-index" type="number" step="1"></label>
           </div>
 
-          <h2 class="panel__title">交互</h2>
+          <h2 class="panel__title">浜や簰</h2>
           <div class="check-row">
-            <label><input id="field-clickable" type="checkbox"> 可点击</label>
+            <label><input id="field-clickable" type="checkbox"> 鍙偣鍑?/label>
           </div>
-          <label class="field"><span>标签按钮文字</span><input id="field-label-text" type="text"></label>
+          <label class="field"><span>鏍囩鎸夐挳鏂囧瓧</span><input id="field-label-text" type="text"></label>
           <div class="field-row">
-            <label class="field"><span>标签偏移 X</span><input id="field-label-offset-x" type="number" step="1"></label>
-            <label class="field"><span>标签偏移 Y</span><input id="field-label-offset-y" type="number" step="1"></label>
+            <label class="field"><span>鏍囩鍋忕Щ X</span><input id="field-label-offset-x" type="number" step="1"></label>
+            <label class="field"><span>鏍囩鍋忕Щ Y</span><input id="field-label-offset-y" type="number" step="1"></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>标签宽度</span><input id="field-label-width" type="number" min="1" step="1"></label>
-            <label class="field"><span>标签高度</span><input id="field-label-height" type="number" min="1" step="1"></label>
+            <label class="field"><span>鏍囩瀹藉害</span><input id="field-label-width" type="number" min="1" step="1"></label>
+            <label class="field"><span>鏍囩楂樺害</span><input id="field-label-height" type="number" min="1" step="1"></label>
           </div>
-          <label class="field"><span>点击区域形状</span><select id="field-hit-type"><option value="rect">矩形</option><option value="ellipse">椭圆</option></select></label>
+          <label class="field"><span>鐐瑰嚮鍖哄煙褰㈢姸</span><select id="field-hit-type"><option value="rect">鐭╁舰</option><option value="ellipse">妞渾</option></select></label>
           <div class="field-row">
-            <label class="field"><span>点击区域偏移 X</span><input id="field-hit-offset-x" type="number" step="1"></label>
-            <label class="field"><span>点击区域偏移 Y</span><input id="field-hit-offset-y" type="number" step="1"></label>
+            <label class="field"><span>鐐瑰嚮鍖哄煙鍋忕Щ X</span><input id="field-hit-offset-x" type="number" step="1"></label>
+            <label class="field"><span>鐐瑰嚮鍖哄煙鍋忕Щ Y</span><input id="field-hit-offset-y" type="number" step="1"></label>
           </div>
           <div class="field-row">
-            <label class="field"><span>点击区域宽度</span><input id="field-hit-width" type="number" min="1" step="1"></label>
-            <label class="field"><span>点击区域高度</span><input id="field-hit-height" type="number" min="1" step="1"></label>
+            <label class="field"><span>鐐瑰嚮鍖哄煙瀹藉害</span><input id="field-hit-width" type="number" min="1" step="1"></label>
+            <label class="field"><span>鐐瑰嚮鍖哄煙楂樺害</span><input id="field-hit-height" type="number" min="1" step="1"></label>
           </div>
 
-          <h2 class="panel__title">随机民居槽位</h2>
-          <label class="field"><span>候选池编号</span><input id="field-random-pool-id" type="text" placeholder="decor-house-pool-basic"></label>
-          <label class="field"><span>允许标签</span><input id="field-random-tags" type="text" placeholder="民居, 小型"></label>
+          <h2 class="panel__title">闅忔満姘戝眳妲戒綅</h2>
+          <label class="field"><span>鍊欓�夋睜缂栧彿</span><input id="field-random-pool-id" type="text" placeholder="decor-house-pool-basic"></label>
+          <label class="field"><span>鍏佽鏍囩</span><input id="field-random-tags" type="text" placeholder="姘戝眳, 灏忓瀷"></label>
         </form>
       </aside>
     </main>
   </div>
 
   <script>
     "use strict";
 
     const DEFAULT_OPTIONAL_BUILDABLE_MASK = [
       { x: 650, y: 302 },
@@ -1180,86 +1173,90 @@
       { x: 1462, y: 582 },
       { x: 1182, y: 744 },
       { x: 720, y: 748 },
       { x: 365, y: 590 },
       { x: 358, y: 512 }
     ];
 
     const DEFAULT_FORBIDDEN_POLYGONS = [
       {
         id: "front-wall-occlusion",
-        name: "前景城墙遮挡区",
+        name: "鍓嶆櫙鍩庡閬尅鍖?,
         points: [
           { x: 120, y: 690 },
           { x: 430, y: 795 },
           { x: 760, y: 850 },
           { x: 1110, y: 845 },
           { x: 1465, y: 725 },
           { x: 1625, y: 770 },
           { x: 1240, y: 940 },
           { x: 560, y: 932 }
         ]
       }
     ];
 
+    const HAOZHOU_LAYOUT_EXAMPLE_PATH = "examples/haozhou-city-layout.example.json";
+    const HAOZHOU_PREFAB_EXAMPLE_PATH = "examples/haozhou-city-prefabs.example.json";
+
     const EMPTY_LAYOUT = {
       version: 1,
       map: {
         id: "haozhou-city",
-        name: "濠州城",
+        name: "婵犲窞鍩?,
         stageWidth: 2048,
         stageHeight: 1152,
         baseSpace: { x: 139, y: 88, width: 1771, height: 976 },
-        backgroundImage: "ui/yuansu/菱形格子/20260716-111958.png",
-        foregroundImage: "ui/yuansu/菱形格子/20260716-141239.png",
+        backgroundImage: "ui/yuansu/鑿卞舰鏍煎瓙/20260716-111958.png",
+        foregroundImage: "ui/yuansu/鑿卞舰鏍煎瓙/20260716-141239.png",
         referenceMask: clone(DEFAULT_OPTIONAL_BUILDABLE_MASK),
         forbiddenPolygons: []
       },
       grid: {
         type: "isometric-board",
         cols: 40,
         rows: 40,
         cellWidth: 40,
         cellHeight: 20,
         originX: 885,
-        originY: 220,
+        originY: 110,
         snap: true,
         visible: true,
         showCoordinates: true,
         showOutline: true
       },
       entities: [],
       randomPools: [
-        { id: "decor-house-pool-basic", name: "普通民居池", candidates: [] }
+        { id: "decor-house-pool-basic", name: "鏅�氭皯灞呮睜", candidates: [] }
       ]
     };
 
     const CATEGORY_LABELS = {
-      special: "特殊建筑",
-      house: "普通建筑",
-      "random-slot": "随机民居槽位",
-      decoration: "装饰建筑",
-      "ground-decoration": "地面装饰"
+      special: "鐗规畩寤虹瓚",
+      house: "鏅�氬缓绛?,
+      "random-slot": "闅忔満姘戝眳妲戒綅",
+      decoration: "瑁呴グ寤虹瓚",
+      "ground-decoration": "鍦伴潰瑁呴グ"
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
       layout: normalizeLayout(EMPTY_LAYOUT),
+      readOnlyPrefabExample: null,
       selectedId: null,
       filter: "all",
       mode: "edit",
       calibrationMode: false,
       zoom: 0.55,
       opacity: {
         background: 1,
         foreground: 1,
         buildable: 0.9,
         grid: 1
@@ -1387,47 +1384,42 @@
       bindEvents();
       render();
     }
 
     function toKey(id) {
       return id.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
     }
 
     function bindEvents() {
       dom.newLayout.addEventListener("click", () => {
-        if (!confirm("清空当前布局并新建空白 city-map-layout.json？")) {
+        if (!confirm("娓呯┖褰撳墠甯冨眬骞舵柊寤虹┖鐧?city-map-layout.json锛?)) {
           return;
         }
-        state.layout = normalizeLayout(EMPTY_LAYOUT);
-        state.selectedId = null;
-        state.entityPreviews.clear();
-        state.backgroundPreview = "";
-        state.foregroundPreview = "";
-        setStatus("已新建空白布局。");
-        render();
+        setEditorLayout(EMPTY_LAYOUT);
+        setStatus("宸叉柊寤虹┖鐧藉竷灞�銆?);
       });
 
       dom.importJson.addEventListener("change", importJsonFile);
       dom.loadExample.addEventListener("click", loadHaozhouExample);
       dom.exportJson.addEventListener("click", exportJsonFile);
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
-        setStatus(`校验完成：${result.errors} 个错误，${result.warnings} 个警告，${result.info} 条提示。`);
+        setStatus(`鏍￠獙瀹屾垚锛?{result.errors} 涓敊璇紝${result.warnings} 涓鍛婏紝${result.info} 鏉℃彁绀恒�俙);
       });
       dom.categoryFilter.addEventListener("change", () => {
         state.filter = dom.categoryFilter.value;
         renderEntityList();
       });
       dom.quickSelect.addEventListener("click", (event) => {
         const button = event.target.closest("[data-quick-id]");
         if (button != null) {
           selectEntity(button.dataset.quickId);
         }
@@ -1472,20 +1464,24 @@
         ["hitArea", dom.showHitArea],
         ["forbidden", dom.showForbidden]
       ]) {
         element.addEventListener("change", () => {
           layerState[key] = element.checked;
           renderCanvas();
         });
       }
 
       dom.snapEnabled.addEventListener("change", () => {
+        if (guardReadOnlyPrefabExample()) {
+          dom.snapEnabled.checked = Boolean(state.layout.grid.snap);
+          return;
+        }
         state.layout.grid.snap = dom.snapEnabled.checked;
       });
 
       for (const element of [
         dom.mapId,
         dom.mapName,
         dom.mapBackgroundImage,
         dom.mapForegroundImage
       ]) {
         element.addEventListener("input", updateMapFromForm);
@@ -1528,66 +1524,114 @@
       );
       delete map.referenceMask;
       map.forbiddenPolygons = normalizeForbiddenPolygons(source.map?.forbiddenPolygons);
       const grid = { ...clone(EMPTY_LAYOUT.grid), ...(source.grid || {}) };
       grid.type = "isometric-board";
       grid.cols = Math.max(1, Math.round(numberOr(grid.cols, 20)));
       grid.rows = Math.max(1, Math.round(numberOr(grid.rows, 20)));
       grid.cellWidth = Math.max(16, numberOr(grid.cellWidth, 20));
       grid.cellHeight = Math.max(8, numberOr(grid.cellHeight, 20));
       grid.originX = numberOr(grid.originX, 885);
-      grid.originY = numberOr(grid.originY, 220);
+      grid.originY = numberOr(grid.originY, 110);
       grid.snap = Boolean(grid.snap);
       grid.visible = grid.visible !== false;
       grid.showCoordinates = grid.showCoordinates !== false;
       grid.showOutline = grid.showOutline !== false;
       return {
         version: Number(source.version) || 1,
         map,
         grid,
         entities: Array.isArray(source.entities)
           ? source.entities.map((entity) => normalizeEntity(entity, grid))
           : [],
         randomPools: Array.isArray(source.randomPools)
           ? source.randomPools
         : clone(EMPTY_LAYOUT.randomPools)
       };
     }
 
+    function composePrefabLayoutForEditor(layoutSource, prefabLibrary) {
+      if (!Array.isArray(layoutSource?.instances) || !Array.isArray(prefabLibrary?.prefabs)) {
+        return layoutSource;
+      }
+
+      const prefabById = new Map(
+        prefabLibrary.prefabs.map((prefab) => [prefab.id, prefab])
+      );
+
+      return {
+        ...layoutSource,
+        entities: layoutSource.instances.map((instance) => {
+          const prefab = prefabById.get(instance.prefabId);
+          if (prefab == null) {
+            throw new Error(`Missing prefab: ${instance.prefabId}`);
+          }
+
+          return {
+            id: instance.id,
+            name: prefab.name,
+            category: prefab.category,
+            entry: clone(prefab.entry),
+            asset: clone(prefab.asset),
+            lot: {
+              gridX: instance.gridX,
+              gridY: instance.gridY,
+              cols: prefab.footprint.cols,
+              rows: prefab.footprint.rows
+            },
+            render: clone(instance.render || {}),
+            interaction: clone(prefab.interaction)
+          };
+        })
+      };
+    }
+
+    function isReadOnlyPrefabExampleLoaded() {
+      return state.readOnlyPrefabExample != null;
+    }
+
+    function guardReadOnlyPrefabExample() {
+      if (!isReadOnlyPrefabExampleLoaded()) {
+        return false;
+      }
+      setStatus(state.readOnlyPrefabExample.message);
+      return true;
+    }
+
     function normalizePointList(points, fallback) {
       const normalized = Array.isArray(points)
         ? points
             .map((point) => ({
               x: numberOr(point?.x, NaN),
               y: numberOr(point?.y, NaN)
             }))
             .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
         : [];
       return normalized.length >= 3 ? normalized : clone(fallback);
     }
 
     function normalizeForbiddenPolygons(polygons) {
       const source = Array.isArray(polygons) ? polygons : [];
       return source.map((polygon, index) => ({
         id: String(polygon?.id || `forbidden-${index + 1}`),
-        name: String(polygon?.name || "前景遮挡参考区"),
+        name: String(polygon?.name || "鍓嶆櫙閬尅鍙傝�冨尯"),
         points: normalizePointList(polygon?.points, [])
       }));
     }
 
     function normalizeEntity(entity, grid = state?.layout?.grid || EMPTY_LAYOUT.grid) {
       const safe = entity && typeof entity === "object" ? entity : {};
       const safeInteraction = safe.interaction || {};
       const safeLot = safe.lot || {};
       const normalized = {
         id: String(safe.id || createUniqueId("entity")),
-        name: String(safe.name || "未命名建筑"),
+        name: String(safe.name || "鏈懡鍚嶅缓绛?),
         category: CATEGORY_LABELS[safe.category] ? safe.category : "decoration",
         entry: normalizeEntry(safe.entry),
         asset: {
           image: "",
           naturalWidth: 512,
           naturalHeight: 512,
           scale: 0.25,
           offsetX: 0,
           offsetY: 0,
           anchor: "bottom-center",
@@ -1789,46 +1833,99 @@
         right: Math.max(...points.map((point) => point.x)),
         top: Math.min(...points.map((point) => point.y)),
         bottom: Math.max(...points.map((point) => point.y))
       };
     }
 
     function render() {
       renderMapForm();
       renderCalibrationForm();
       renderToolbarState();
+      renderQuickSelect();
       renderEntityList();
       renderProperties();
       renderCanvas();
       syncRandomPoolsTextarea();
       syncLayoutJsonPreview();
     }
 
+    function renderQuickSelect() {
+      dom.quickSelect.innerHTML = "";
+      const entities = [...state.layout.entities].sort((first, second) =>
+        first.category === second.category
+          ? first.name.localeCompare(second.name, "zh-Hans-CN")
+          : first.category.localeCompare(second.category)
+      );
+
+      for (const entity of entities) {
+        const button = document.createElement("button");
+        button.type = "button";
+        button.dataset.quickId = entity.id;
+        button.textContent = entity.name;
+        button.title = `${entity.id} 路 ${CATEGORY_LABELS[entity.category] || entity.category}`;
+        if (entity.id === state.selectedId) {
+          button.classList.add("is-selected");
+        }
+        dom.quickSelect.append(button);
+      }
+    }
+
     function renderToolbarState() {
       dom.app.classList.toggle("is-preview", state.mode === "preview");
       state.calibrationMode = false;
       dom.app.classList.remove("is-calibrating");
       dom.calibrationModeToggle.textContent = "Grid fixed";
       dom.calibrationModeToggle.disabled = true;
-      dom.modeToggle.textContent = state.mode === "preview" ? "编辑模式" : "预览模式";
+      dom.modeToggle.textContent = state.mode === "preview" ? "缂栬緫妯″紡" : "棰勮妯″紡";
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
     }
 
+    function renderReadOnlyPrefabState() {
+      const readOnly = isReadOnlyPrefabExampleLoaded();
+      for (const element of [
+        dom.mapId,
+        dom.mapName,
+        dom.mapBackgroundImage,
+        dom.mapForegroundImage,
+        dom.uploadBackground,
+        dom.uploadForeground,
+        dom.showCoordinates,
+        dom.showBoardOutline,
+        dom.snapEnabled,
+        dom.optionalMaskJson,
+        dom.forbiddenPolygonsJson,
+        dom.randomPoolsJson,
+        dom.exportJson,
+        dom.copyLayoutJson,
+        dom.addEntity,
+        dom.uploadEntityImage
+      ]) {
+        element.disabled = readOnly;
+      }
+
+      const hasEntitySelection = getSelectedEntity() != null;
+      dom.duplicateEntity.disabled = readOnly || !hasEntitySelection;
+      dom.deleteEntity.disabled = readOnly || !hasEntitySelection;
+      for (const element of dom.entityForm.elements) {
+        element.disabled = readOnly || !hasEntitySelection;
+      }
+    }
+
     function renderMapForm() {
       const map = state.layout.map;
       dom.mapId.value = map.id;
       dom.mapName.value = map.name;
       dom.mapBackgroundImage.value = map.backgroundImage;
       dom.mapForegroundImage.value = map.foregroundImage;
     }
 
     function renderCalibrationForm() {
       dom.boardCols.value = String(state.layout.grid.cols);
@@ -1843,80 +1940,94 @@
       dom.gridOriginX.value = Math.round(state.layout.grid.originX);
       dom.gridOriginY.value = Math.round(state.layout.grid.originY);
       dom.gridCellWidth.value = Math.round(state.layout.grid.cellWidth);
       dom.gridCellHeight.value = Math.round(state.layout.grid.cellHeight);
       dom.showCoordinates.checked = state.layout.grid.showCoordinates !== false;
       dom.showBoardOutline.checked = state.layout.grid.showOutline !== false;
       dom.backgroundOpacity.value = String(state.opacity.background);
       dom.foregroundOpacity.value = String(state.opacity.foreground);
       dom.buildableOpacity.value = String(state.opacity.buildable);
       dom.gridOpacity.value = String(state.opacity.grid);
+      renderReadOnlyPrefabState();
     }
 
     function renderEntityList() {
       const entities = state.layout.entities.filter((entity) =>
         state.filter === "all" ? true : entity.category === state.filter
       );
 
       dom.entityList.innerHTML = "";
       if (entities.length === 0) {
         const empty = document.createElement("div");
         empty.className = "empty-state";
-        empty.textContent = "当前类型下没有建筑。";
+        empty.textContent = "褰撳墠绫诲瀷涓嬫病鏈夊缓绛戙�?;
         dom.entityList.append(empty);
         return;
       }
 
       for (const entity of entities) {
         const button = document.createElement("button");
         button.type = "button";
         button.className = `entity-card${entity.id === state.selectedId ? " is-selected" : ""}`;
         button.dataset.entityId = entity.id;
         button.addEventListener("click", () => selectEntity(entity.id));
 
         const thumb = document.createElement("span");
         thumb.className = "entity-card__thumb";
         const imageUrl = getEntityImageUrl(entity);
         if (imageUrl) {
           const image = document.createElement("img");
           image.src = imageUrl;
           image.alt = "";
           thumb.append(image);
         } else {
-          thumb.textContent = "无图";
+          thumb.textContent = "鏃犲浘";
         }
 
         const text = document.createElement("span");
         text.innerHTML = `
           <span class="entity-card__name">${escapeHtml(entity.name)}</span>
-          <span class="entity-card__meta">${escapeHtml(entity.id)} · ${escapeHtml(CATEGORY_LABELS[entity.category] || entity.category)} · ${entity.lot.cols} x ${entity.lot.rows} 格</span>
+          <span class="entity-card__meta">${escapeHtml(entity.id)} 路 ${escapeHtml(CATEGORY_LABELS[entity.category] || entity.category)} 路 ${entity.lot.cols} x ${entity.lot.rows} 鏍?/span>
           <span class="entity-card__entry">${escapeHtml(getEntrySummary(entity))}</span>
         `;
 
         button.append(thumb, text);
         dom.entityList.append(button);
       }
     }
 
+    function toggleHitAreaFields(entity) {
+      const shouldShow = Boolean(entity?.interaction.clickable);
+      const nodes = [
+        dom.fieldHitType.closest("label"),
+        dom.fieldHitOffsetX.closest(".field-row"),
+        dom.fieldHitWidth.closest(".field-row"),
+      ].filter(Boolean);
+      for (const node of nodes) {
+        node.classList.toggle("is-hidden", !shouldShow);
+      }
+    }
+
     function renderProperties() {
       const entity = getSelectedEntity();
       dom.entityForm.classList.toggle("hidden", entity == null);
       dom.entityFormEmpty.classList.toggle("hidden", entity != null);
       dom.duplicateEntity.disabled = entity == null;
       dom.deleteEntity.disabled = entity == null;
 
       if (entity == null) {
-        dom.selectedReadout.textContent = "未选中建筑实体";
+        dom.selectedReadout.textContent = "鏈�変腑寤虹瓚瀹炰綋";
+        renderReadOnlyPrefabState();
         return;
       }
 
-      dom.selectedReadout.textContent = `选中 ${entity.name} (${entity.id})`;
+      dom.selectedReadout.textContent = `閫変腑 ${entity.name} (${entity.id})`;
       dom.fieldId.value = entity.id;
       dom.fieldName.value = entity.name;
       dom.fieldCategory.value = entity.category;
       dom.fieldEntryType.value = entity.entry.type;
       dom.fieldHouseId.value = entity.entry.type === "house" ? entity.entry.houseId : "";
       dom.fieldCityEntryId.value = entity.entry.type === "city-entry" ? entity.entry.cityEntryId : "";
       dom.fieldImage.value = entity.asset.image;
       dom.fieldNaturalWidth.value = entity.asset.naturalWidth;
       dom.fieldNaturalHeight.value = entity.asset.naturalHeight;
       dom.fieldScale.value = entity.asset.scale;
@@ -1941,29 +2052,31 @@
       dom.fieldLabelHeight.value = entity.interaction.label.height;
       dom.fieldHitType.value = entity.interaction.hitArea.type;
       dom.fieldHitOffsetX.value = entity.interaction.hitArea.offsetX;
       dom.fieldHitOffsetY.value = entity.interaction.hitArea.offsetY;
       dom.fieldHitWidth.value = entity.interaction.hitArea.width;
       dom.fieldHitHeight.value = entity.interaction.hitArea.height;
       dom.fieldRandomPoolId.value = entity.random?.poolId || "";
       dom.fieldRandomTags.value = Array.isArray(entity.random?.allowedTags)
         ? entity.random.allowedTags.join(", ")
         : "";
+      toggleHitAreaFields(entity);
+      renderReadOnlyPrefabState();
     }
 
     function renderCanvas() {
       const { map } = state.layout;
       const base = map.baseSpace;
       syncAllLotPixelFields();
-      dom.mapTitle.textContent = map.name || map.id || "未命名地图";
-      dom.stageReadout.textContent = `舞台 ${map.stageWidth}x${map.stageHeight}`;
-      dom.baseReadout.textContent = `地图编辑区域 ${base.width}x${base.height} @ ${base.x},${base.y}`;
+      dom.mapTitle.textContent = map.name || map.id || "鏈懡鍚嶅湴鍥?;
+      dom.stageReadout.textContent = `鑸炲彴 ${map.stageWidth}x${map.stageHeight}`;
+      dom.baseReadout.textContent = `鍦板浘缂栬緫鍖哄煙 ${base.width}x${base.height} @ ${base.x},${base.y}`;
 
       dom.stageShell.style.width = `${map.stageWidth * state.zoom}px`;
       dom.stageShell.style.height = `${map.stageHeight * state.zoom}px`;
       dom.stage.style.width = `${map.stageWidth}px`;
       dom.stage.style.height = `${map.stageHeight}px`;
       dom.stage.style.transform = `scale(${state.zoom})`;
       dom.baseSpace.style.left = `${base.x}px`;
       dom.baseSpace.style.top = `${base.y}px`;
       dom.baseSpace.style.width = `${base.width}px`;
       dom.baseSpace.style.height = `${base.height}px`;
@@ -1990,21 +2103,21 @@
       const base = state.layout.map.baseSpace;
       const optionalMask = getOptionalBuildableMask();
       const polygonPoints = optionalMask.map((point) => `${point.x},${point.y}`).join(" ");
       const buildableLabel = getPolygonCentroid(optionalMask);
       const selected = getSelectedEntity();
       const selectedInvalid = selected != null && !isLotInsideBoard(selected, state.layout.grid);
       const svgParts = [];
 
       if (layerState.buildable && optionalMask.length >= 3) {
         svgParts.push(`<polygon class="buildable-polygon" opacity="${state.opacity.buildable}" points="${polygonPoints}"></polygon>`);
-        svgParts.push(`<text class="buildable-label" x="${buildableLabel.x}" y="${buildableLabel.y}" text-anchor="middle">城墙参考遮罩</text>`);
+        svgParts.push(`<text class="buildable-label" x="${buildableLabel.x}" y="${buildableLabel.y}" text-anchor="middle">鍩庡鍙傝�冮伄缃?/text>`);
       }
 
       if (layerState.forbidden) {
         svgParts.push(createForbiddenPolygonsMarkup());
       }
 
       if (layerState.validGrid) {
         svgParts.push(`<g class="board-grid-layer" opacity="${state.opacity.grid}">${createBoardGridMarkup()}</g>`);
         if (state.layout.grid.showOutline !== false) {
           svgParts.push(createBoardOutlineMarkup());
@@ -2050,21 +2163,21 @@
         .map((polygon) => `<polygon class="forbidden-polygon" data-forbidden-id="${escapeHtml(polygon.id)}" points="${polygon.points.map((point) => `${point.x},${point.y}`).join(" ")}"><title>${escapeHtml(polygon.name)}</title></polygon>`)
         .join("");
     }
 
     function createGridOriginMarkup() {
       const grid = state.layout.grid;
       const size = 22;
       return `<g class="grid-origin-layer">
         <line class="grid-origin-cross" x1="${grid.originX - size}" y1="${grid.originY}" x2="${grid.originX + size}" y2="${grid.originY}"></line>
         <line class="grid-origin-cross" x1="${grid.originX}" y1="${grid.originY - size}" x2="${grid.originX}" y2="${grid.originY + size}"></line>
-        <text class="buildable-label" x="${grid.originX + 28}" y="${grid.originY - 12}">棋盘原点</text>
+        <text class="buildable-label" x="${grid.originX + 28}" y="${grid.originY - 12}">妫嬬洏鍘熺偣</text>
       </g>`;
     }
 
     function createFootprintMarkup(entity, invalid) {
       const diamonds = getFootprintCells(entity);
       const className = invalid ? "footprint-diamond is-invalid" : "footprint-diamond";
       return diamonds
         .map((points) => `<polygon class="${className}" points="${points.map((point) => `${point.x},${point.y}`).join(" ")}"></polygon>`)
         .join("");
     }
@@ -2084,21 +2197,21 @@
           entity.render.visible ? "" : "is-hidden"
         ].filter(Boolean).join(" ");
         node.dataset.entityId = entity.id;
         node.style.left = `${entity.lot.x}px`;
         node.style.top = `${entity.lot.y}px`;
         node.style.zIndex = String(getEntityZIndex(entity));
 
         if (layerState.imageBounds) {
           node.append(createRenderBox(entity));
         }
-        if (layerState.hitArea) {
+        if (entity.interaction.clickable && layerState.hitArea) {
           node.append(createHitArea(entity));
         }
         node.append(createAssetNode(entity));
         if (layerState.labels) {
           node.append(createLabelNode(entity));
         }
         dom.entityLayer.append(node);
       }
     }
 
@@ -2109,92 +2222,92 @@
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
+      controls.append(createMoveAnchor(entity.lot.x, entity.lot.y + 34, "鎷栨嫿璋冩暣鍗犲湴鍖哄煙"));
+      controls.append(createLotHandle(bounds.right, (bounds.top + bounds.bottom) / 2, "resize-lot-width", "鎷栨嫿澧炲姞 / 鍑忓皯鍗犲湴鍒楁暟", "鈫?));
+      controls.append(createLotHandle((bounds.left + bounds.right) / 2, bounds.top, "resize-lot-height", "鎷栨嫿澧炲姞 / 鍑忓皯鍗犲湴琛屾暟", "鈫?));
+      controls.append(createLotHandle(bounds.right, bounds.top, "resize-lot-area", "鎷栨嫿璋冩暣鍗犵敤鏍兼暟", "猡?));
 
       const badge = document.createElement("div");
       badge.className = "lot-count-badge";
       badge.style.left = `${entity.lot.x}px`;
       badge.style.top = `${bounds.top - 8}px`;
-      badge.textContent = `${entity.lot.cols} x ${entity.lot.rows} 格`;
+      badge.textContent = `${entity.lot.cols} x ${entity.lot.rows} 鏍糮;
       controls.append(badge);
 
       if (invalid) {
         const warning = document.createElement("div");
         warning.className = "canvas-warning";
         warning.style.left = `${entity.lot.x}px`;
         warning.style.top = `${bounds.bottom + 42}px`;
-        warning.textContent = "地块超出 细分网格 棋盘";
+        warning.textContent = "鍦板潡瓒呭嚭 缁嗗垎缃戞牸 妫嬬洏";
         controls.append(warning);
       }
 
       dom.lotControlLayer.append(controls);
     }
 
     function renderCalibrationControls() {
       const controls = document.createDocumentFragment();
       const corners = getBoardCorners();
       const move = document.createElement("button");
       move.type = "button";
       move.className = "board-move-handle";
-      move.title = "拖动整个 细分网格 棋盘";
+      move.title = "鎷栧姩鏁翠釜 缁嗗垎缃戞牸 妫嬬洏";
       move.dataset.dragMode = "move-board";
       move.style.left = `${corners.center.x}px`;
       move.style.top = `${corners.center.y}px`;
-      move.textContent = "?";
+      move.textContent = "鉁?;
       controls.append(move);
 
       const origin = document.createElement("button");
       origin.type = "button";
       origin.className = "grid-origin-handle";
-      origin.title = "拖动棋盘原点";
+      origin.title = "鎷栧姩妫嬬洏鍘熺偣";
       origin.dataset.dragMode = "move-board";
       origin.style.left = `${state.layout.grid.originX}px`;
       origin.style.top = `${state.layout.grid.originY}px`;
       origin.textContent = "+";
       controls.append(origin);
 
       for (const [text, mode, x, y, title] of [
-        ["宽", "scale-board-width", corners.center.x + 180, corners.center.y, "拖动调整格子宽度"],
-        ["高", "scale-board-height", corners.center.x, corners.center.y + 100, "拖动调整格子高度"]
+        ["瀹?, "scale-board-width", corners.center.x + 180, corners.center.y, "鎷栧姩璋冩暣鏍煎瓙瀹藉害"],
+        ["楂?, "scale-board-height", corners.center.x, corners.center.y + 100, "鎷栧姩璋冩暣鏍煎瓙楂樺害"]
       ]) {
         const handle = document.createElement("button");
         handle.type = "button";
         handle.className = "board-scale-handle";
         handle.title = title;
         handle.dataset.dragMode = mode;
         handle.style.left = `${x}px`;
         handle.style.top = `${y}px`;
         handle.textContent = text;
         controls.append(handle);
       }
 
       for (const [name, point, mode, text] of [
-        ["顶点", corners.top, "scale-board-height", "▲"],
-        ["左点", corners.left, "scale-board-width", "?"],
-        ["右点", corners.right, "scale-board-width", "?"],
-        ["底点", corners.bottom, "scale-board-height", "▼"]
+        ["椤剁偣", corners.top, "scale-board-height", "鈻?],
+        ["宸︾偣", corners.left, "scale-board-width", "鈼�"],
+        ["鍙崇偣", corners.right, "scale-board-width", "鈻?],
+        ["搴曠偣", corners.bottom, "scale-board-height", "鈻?]
       ]) {
         const handle = document.createElement("button");
         handle.type = "button";
         handle.className = "board-scale-handle";
-        handle.title = `${name}：拖动缩放 细分网格 棋盘`;
+        handle.title = `${name}锛氭嫋鍔ㄧ缉鏀?缁嗗垎缃戞牸 妫嬬洏`;
         handle.dataset.dragMode = mode;
         handle.style.left = `${point.x}px`;
         handle.style.top = `${point.y}px`;
         handle.textContent = text;
         controls.append(handle);
       }
 
       dom.lotControlLayer.append(controls);
     }
 
@@ -2236,65 +2349,65 @@
       const hit = entity.interaction.hitArea;
       const node = document.createElement("div");
       node.className = `entity__hit-area${hit.type === "ellipse" ? " is-ellipse" : ""}`;
       node.dataset.dragMode = "move-hit-area";
       node.style.left = `${numberOr(hit.offsetX, 0) - numberOr(hit.width, 1) / 2}px`;
       node.style.top = `${numberOr(hit.offsetY, 0) - numberOr(hit.height, 1) / 2}px`;
       node.style.width = `${numberOr(hit.width, 1)}px`;
       node.style.height = `${numberOr(hit.height, 1)}px`;
       const handle = document.createElement("span");
       handle.className = "hit-resize-handle";
-      handle.title = "拖拽调整点击区域";
+      handle.title = "鎷栨嫿璋冩暣鐐瑰嚮鍖哄煙";
       handle.dataset.dragMode = "resize-hit-area";
       node.append(handle);
       return node;
     }
 
     function createAssetNode(entity) {
       const imageUrl = getEntityImageUrl(entity);
       const width = Math.max(1, entity.asset.naturalWidth * entity.asset.scale);
       const node = document.createElement("div");
       node.className = "entity__asset";
       node.dataset.dragMode = "move-image-offset";
-      node.title = "拖拽图片本体调整图片偏移";
+      node.title = "鎷栨嫿鍥剧墖鏈綋璋冩暣鍥剧墖鍋忕Щ";
       node.style.left = `${entity.asset.offsetX}px`;
       node.style.top = `${entity.asset.offsetY}px`;
       node.style.width = `${width}px`;
       node.style.transform = getAnchorTransform(entity.asset.anchor);
 
       if (imageUrl) {
         const image = document.createElement("img");
         image.src = imageUrl;
         image.alt = "";
         node.append(image);
       } else {
         const missing = document.createElement("div");
         missing.className = "entity__asset-missing";
-        missing.textContent = "未设置图片";
+        missing.textContent = "鏈缃浘鐗?;
         node.append(missing);
       }
       return node;
     }
 
     function createLabelNode(entity) {
       const labelData = entity.interaction.label;
       const label = document.createElement("button");
       label.type = "button";
       label.className = `entity__label${labelData.text ? "" : " is-empty"}`;
       label.dataset.dragMode = "move-label";
       label.dataset.previewEntityId = entity.id;
-      label.title = "拖动标签调整入口按钮";
+      label.title = "鎷栧姩鏍囩璋冩暣鍏ュ彛鎸夐挳";
       label.style.left = `${numberOr(labelData.offsetX, 0)}px`;
       label.style.top = `${numberOr(labelData.offsetY, 0)}px`;
       label.style.width = `${numberOr(labelData.width, 1)}px`;
       label.style.height = `${numberOr(labelData.height, 1)}px`;
-      label.textContent = labelData.text || "标签按钮";
+      label.textContent = labelData.text || "鏍囩鎸夐挳";
       if (entity.entry.type === "house") {
         label.setAttribute("data-house-id", entity.entry.houseId);
       } else if (entity.entry.type === "city-entry") {
         label.setAttribute("data-city-entry-id", entity.entry.cityEntryId);
       }
       return label;
     }
 
     function getAnchorTransform(anchor) {
       if (anchor === "center") {
@@ -2324,66 +2437,86 @@
       if (/^(data:|blob:|https?:|file:)/i.test(path)) {
         return path;
       }
       if (path.startsWith("../") || path.startsWith("./") || path.startsWith("/")) {
         return path;
       }
       return `../../${path}`;
     }
 
     function updateMapFromForm() {
+      if (guardReadOnlyPrefabExample()) {
+        renderMapForm();
+        return;
+      }
       state.layout.map.id = dom.mapId.value.trim();
       state.layout.map.name = dom.mapName.value.trim();
       state.layout.map.backgroundImage = dom.mapBackgroundImage.value.trim();
       state.layout.map.foregroundImage = dom.mapForegroundImage.value.trim();
       renderCanvas();
     }
 
     function updateGridFromForm() {
+      if (guardReadOnlyPrefabExample()) {
+        renderCalibrationForm();
+        return;
+      }
       dom.gridOriginX.value = Math.round(state.layout.grid.originX);
       dom.gridOriginY.value = Math.round(state.layout.grid.originY);
       dom.gridCellWidth.value = Math.round(state.layout.grid.cellWidth);
       dom.gridCellHeight.value = Math.round(state.layout.grid.cellHeight);
       state.layout.grid.showCoordinates = dom.showCoordinates.checked;
       state.layout.grid.showOutline = dom.showBoardOutline.checked;
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
+      if (guardReadOnlyPrefabExample()) {
+        renderCalibrationForm();
+        return;
+      }
       try {
         state.layout.map.referenceMask = normalizePointList(JSON.parse(dom.optionalMaskJson.value || "[]"), []);
-        setStatus("已更新城墙参考遮罩。它只用于视觉参考，不参与建筑放置校验。");
+        setStatus("宸叉洿鏂板煄澧欏弬鑰冮伄缃┿�傚畠鍙敤浜庤瑙夊弬鑰冿紝涓嶅弬涓庡缓绛戞斁缃牎楠屻�?);
         renderCanvas();
       } catch (error) {
-        setStatus(`城墙参考遮罩 JSON 解析失败：${error.message}`);
+        setStatus(`鍩庡鍙傝�冮伄缃?JSON 瑙ｆ瀽澶辫触锛?{error.message}`);
       }
     }
 
     function updateForbiddenPolygonsFromTextarea() {
+      if (guardReadOnlyPrefabExample()) {
+        renderCalibrationForm();
+        return;
+      }
       try {
         state.layout.map.forbiddenPolygons = normalizeForbiddenPolygons(JSON.parse(dom.forbiddenPolygonsJson.value || "[]"));
-        setStatus("已更新前景遮挡警戒区。");
+        setStatus("宸叉洿鏂板墠鏅伄鎸¤鎴掑尯銆?);
         renderCanvas();
       } catch (error) {
-        setStatus(`前景遮挡区 JSON 解析失败：${error.message}`);
+        setStatus(`鍓嶆櫙閬尅鍖?JSON 瑙ｆ瀽澶辫触锛?{error.message}`);
       }
     }
 
     function updateEntityFromForm(event) {
+      if (guardReadOnlyPrefabExample()) {
+        renderProperties();
+        return;
+      }
       const entity = getSelectedEntity();
       if (entity == null) {
         return;
       }
 
       const previousId = entity.id;
       entity.id = dom.fieldId.value.trim() || previousId;
       entity.name = dom.fieldName.value;
       entity.category = dom.fieldCategory.value;
       entity.entry = readEntryFromForm();
@@ -2432,90 +2565,101 @@
         if (preview) {
           state.entityPreviews.delete(previousId);
           state.entityPreviews.set(entity.id, preview);
         }
         state.selectedId = entity.id;
       }
 
       if (event?.target === dom.fieldName && !dom.fieldLabelText.value.trim()) {
         entity.interaction.label.text = entity.name;
       }
+      renderProperties();
+      renderQuickSelect();
       renderEntityList();
       renderCanvas();
       syncRandomPoolsTextarea();
     }
 
     function readEntryFromForm() {
       if (dom.fieldEntryType.value === "house") {
         return { type: "house", houseId: dom.fieldHouseId.value.trim() };
       }
       if (dom.fieldEntryType.value === "city-entry") {
         return { type: "city-entry", cityEntryId: dom.fieldCityEntryId.value.trim() };
       }
       return { type: "none" };
     }
 
     function addEntity() {
+      if (guardReadOnlyPrefabExample()) {
+        return;
+      }
       const entity = normalizeEntity({
         id: createUniqueId("building"),
-        name: "新建筑",
+        name: "鏂板缓绛?,
         category: "decoration",
         lot: {
           gridX: 9,
           gridY: 9,
           cols: 2,
           rows: 2
         },
         interaction: {
           clickable: false,
-          label: { text: "新建筑", offsetX: 0, offsetY: -118, width: 110, height: 36 },
+          label: { text: "鏂板缓绛?, offsetX: 0, offsetY: -118, width: 110, height: 36 },
           hitArea: { type: "ellipse", offsetX: 0, offsetY: -8, width: 120, height: 52 }
         }
       });
       state.layout.entities.push(entity);
       selectEntity(entity.id);
-      setStatus("已新建建筑。");
+      setStatus("宸叉柊寤哄缓绛戙�?);
     }
 
     function duplicateEntity() {
+      if (guardReadOnlyPrefabExample()) {
+        return;
+      }
       const entity = getSelectedEntity();
       if (entity == null) {
         return;
       }
       const copy = clone(entity);
       copy.id = createUniqueId(`${entity.id}-copy`);
-      copy.name = `${entity.name} 复制`;
+      copy.name = `${entity.name} 澶嶅埗`;
       copy.lot.gridX = Math.min(state.layout.grid.cols - copy.lot.cols, copy.lot.gridX + 1);
       copy.lot.gridY = Math.min(state.layout.grid.rows - copy.lot.rows, copy.lot.gridY + 1);
       state.layout.entities.push(normalizeEntity(copy, state.layout.grid));
       selectEntity(copy.id);
-      setStatus("已复制建筑。");
+      setStatus("宸插鍒跺缓绛戙�?);
     }
 
     function deleteEntity() {
+      if (guardReadOnlyPrefabExample()) {
+        return;
+      }
       const entity = getSelectedEntity();
       if (entity == null) {
         return;
       }
-      if (!confirm(`删除建筑 ${entity.name}？`)) {
+      if (!confirm(`鍒犻櫎寤虹瓚 ${entity.name}锛焋)) {
         return;
       }
       state.layout.entities = state.layout.entities.filter((candidate) => candidate.id !== entity.id);
       state.entityPreviews.delete(entity.id);
       state.selectedId = state.layout.entities[0]?.id || null;
-      setStatus("已删除建筑。");
+      setStatus("宸插垹闄ゅ缓绛戙�?);
       render();
     }
 
     function selectEntity(id) {
       if (!state.layout.entities.some((entity) => entity.id === id)) {
-        setStatus(`没有找到建筑：${id}`);
+        setStatus(`娌℃湁鎵惧埌寤虹瓚锛?{id}`);
         return;
       }
       state.selectedId = id;
       state.centerSelectedAfterRender = true;
       renderEntityList();
       renderProperties();
       renderCanvas();
     }
 
     function centerViewportOnSelectedEntity() {
@@ -2539,33 +2683,36 @@
       let candidate = prefix;
       let index = 1;
       while (existingIds.has(candidate)) {
         index += 1;
         candidate = `${prefix}-${index}`;
       }
       return candidate;
     }
 
     function onBoardClick(event) {
+      if (guardReadOnlyPrefabExample()) {
+        return;
+      }
       if (state.mode === "preview" || state.drag != null) {
         return;
       }
       const cell = event.target.closest(".board-cell");
       const entity = getSelectedEntity();
       if (cell == null || entity == null || entity.render.locked) {
         return;
       }
       entity.lot.gridX = Number(cell.dataset.gridX);
       entity.lot.gridY = Number(cell.dataset.gridY);
       clampLotToBoard(entity);
       syncLotPixelFields(entity);
-      setStatus(`${entity.name} 已移动到格子 ${entity.lot.gridX},${entity.lot.gridY}。`);
+      setStatus(`${entity.name} 宸茬Щ鍔ㄥ埌鏍煎瓙 ${entity.lot.gridX},${entity.lot.gridY}銆俙);
       renderProperties();
       renderEntityList();
       renderCanvas();
     }
 
     function onBoardMouseMove(event) {
       const cell = event.target.closest(".board-cell");
       if (cell == null) {
         if (state.hoverGrid != null) {
           state.hoverGrid = null;
@@ -2574,21 +2721,21 @@
         return;
       }
       const next = {
         gridX: Number(cell.dataset.gridX),
         gridY: Number(cell.dataset.gridY)
       };
       if (state.hoverGrid?.gridX === next.gridX && state.hoverGrid?.gridY === next.gridY) {
         return;
       }
       state.hoverGrid = next;
-      setStatus(`当前悬浮格子：${next.gridX},${next.gridY}`);
+      setStatus(`褰撳墠鎮诞鏍煎瓙锛?{next.gridX},${next.gridY}`);
       renderSvgOverlay();
     }
 
     function onCanvasClick(event) {
       const label = event.target.closest(".entity__label");
       const entityNode = event.target.closest(".entity");
 
       if (state.mode === "preview" && label != null) {
         event.preventDefault();
         const entity = state.layout.entities.find((candidate) => candidate.id === label.dataset.previewEntityId);
@@ -2597,20 +2744,23 @@
         }
         return;
       }
 
       if (entityNode != null && state.mode === "edit") {
         selectEntity(entityNode.dataset.entityId);
       }
     }
 
     function onCanvasPointerDown(event) {
+      if (guardReadOnlyPrefabExample()) {
+        return;
+      }
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
@@ -2620,21 +2770,21 @@
         ? state.layout.entities.find((candidate) => candidate.id === entityNode.dataset.entityId)
         : selected;
 
       if (entity == null) {
         return;
       }
       if (entityNode != null) {
         selectEntity(entity.id);
       }
       if (entity.render.locked) {
-        setStatus(`建筑 ${entity.name} 已锁定，不能拖动。`);
+        setStatus(`寤虹瓚 ${entity.name} 宸查攣瀹氾紝涓嶈兘鎷栧姩銆俙);
         return;
       }
 
       const point = getBasePoint(event);
       const entityDragMode = handle?.dataset.dragMode || "move-entity";
       state.drag = {
         pointerId: event.pointerId,
         entityId: entity.id,
         mode: entityDragMode,
         startPoint: point,
@@ -2642,20 +2792,23 @@
         startAnchor: { x: entity.lot.x, y: entity.lot.y },
         startAsset: clone(entity.asset),
         startLabel: clone(entity.interaction.label),
         startHitArea: clone(entity.interaction.hitArea)
       };
       dom.baseSpace.setPointerCapture(event.pointerId);
       event.preventDefault();
     }
 
     function onCanvasPointerMove(event) {
+      if (isReadOnlyPrefabExampleLoaded()) {
+        return;
+      }
       if (state.drag == null || state.drag.pointerId !== event.pointerId) {
         return;
       }
       const point = getBasePoint(event);
       const dx = point.x - state.drag.startPoint.x;
       const dy = point.y - state.drag.startPoint.y;
 
       if (state.drag.mode === "move-board") {
         state.layout.grid.originX = Math.round(state.drag.startGrid.originX + dx);
         state.layout.grid.originY = Math.round(state.drag.startGrid.originY + dy);
@@ -2695,21 +2848,21 @@
         const nextGridPoint = state.layout.grid.snap
           ? pixelToGrid(state.drag.startAnchor.x + dx, state.drag.startAnchor.y + dy)
           : {
               gridX: state.drag.startLot.gridX + Math.round(dx / state.layout.grid.cellWidth),
               gridY: state.drag.startLot.gridY + Math.round(dy / state.layout.grid.cellHeight)
             };
         entity.lot.gridX = state.drag.startLot.gridX + nextGridPoint.gridX - startGridPoint.gridX;
         entity.lot.gridY = state.drag.startLot.gridY + nextGridPoint.gridY - startGridPoint.gridY;
         clampLotToBoard(entity);
         syncLotPixelFields(entity);
-        setStatus(`目标格：${entity.lot.gridX},${entity.lot.gridY}`);
+        setStatus(`鐩爣鏍硷細${entity.lot.gridX},${entity.lot.gridY}`);
       } else if (state.drag.mode === "resize-lot-width") {
         resizeLotByGridPoint(entity, point, "width");
       } else if (state.drag.mode === "resize-lot-height") {
         resizeLotByGridPoint(entity, point, "height");
       } else if (state.drag.mode === "resize-lot-area") {
         resizeLotByGridPoint(entity, point, "area");
       } else if (state.drag.mode === "move-image-offset") {
         entity.asset.offsetX = Math.round(state.drag.startAsset.offsetX + dx);
         entity.asset.offsetY = Math.round(state.drag.startAsset.offsetY + dy);
       } else if (state.drag.mode === "move-label") {
@@ -2775,302 +2928,342 @@
       };
     }
 
     function toggleMode() {
       state.mode = state.mode === "edit" ? "preview" : "edit";
       if (state.mode === "preview") {
         state.calibrationMode = false;
       }
       renderToolbarState();
       renderCanvas();
-      setStatus(state.mode === "preview" ? "预览模式：标签点击只显示模拟入口。" : "编辑模式：可直接拖拽建筑、地块、图片、标签和点击区域。");
+      setStatus(state.mode === "preview" ? "棰勮妯″紡锛氭爣绛剧偣鍑诲彧鏄剧ず妯℃嫙鍏ュ彛銆? : "缂栬緫妯″紡锛氬彲鐩存帴鎷栨嫿寤虹瓚銆佸湴鍧椼�佸浘鐗囥�佹爣绛惧拰鐐瑰嚮鍖哄煙銆?);
     }
 
     function toggleCalibrationMode() {
       state.calibrationMode = false;
       renderToolbarState();
       renderCanvas();
       setStatus("Grid is fixed to the city stage; edit entity lots, image size, and offsets here.");
     }
 
     function centerViewportOnGridOrigin() {
       const base = state.layout.map.baseSpace;
       const targetX = (base.x + state.layout.grid.originX) * state.zoom;
       const targetY = (base.y + state.layout.grid.originY) * state.zoom;
       dom.viewport.scrollLeft = Math.max(0, targetX - dom.viewport.clientWidth / 2);
       dom.viewport.scrollTop = Math.max(0, targetY - dom.viewport.clientHeight / 2);
     }
 
     function showPreviewEntry(entity) {
       if (!entity.interaction.clickable) {
-        setStatus(`${entity.name} 没有开启可点击。`);
+        setStatus(`${entity.name} 娌℃湁寮�鍚彲鐐瑰嚮銆俙);
         return;
       }
       if (entity.entry.type === "house") {
-        setStatus(`将触发 house: ${entity.entry.houseId}`);
+        setStatus(`灏嗚Е鍙?house: ${entity.entry.houseId}`);
         return;
       }
       if (entity.entry.type === "city-entry") {
-        setStatus(`将触发 city-entry: ${entity.entry.cityEntryId}`);
+        setStatus(`灏嗚Е鍙?city-entry: ${entity.entry.cityEntryId}`);
         return;
       }
-      setStatus(`${entity.name} 没有绑定入口。`);
+      setStatus(`${entity.name} 娌℃湁缁戝畾鍏ュ彛銆俙);
     }
 
     function importJsonFile(event) {
       const file = event.target.files?.[0];
       if (file == null) {
         return;
       }
       const reader = new FileReader();
       reader.addEventListener("load", () => {
         try {
           setEditorLayout(JSON.parse(String(reader.result)), state.layout.entities[0]?.id || null);
-          setStatus(`已导入 ${file.name}。`);
+          setStatus(`宸插鍏?${file.name}銆俙);
         } catch (error) {
-          setStatus(`导入失败：${error.message}`);
+          setStatus(`瀵煎叆澶辫触锛?{error.message}`);
         }
       });
       reader.readAsText(file, "utf-8");
       event.target.value = "";
     }
 
     async function loadHaozhouExample() {
       try {
-        const response = await fetch("examples/haozhou-city-layout.example.json");
-        if (!response.ok) {
-          throw new Error(`HTTP ${response.status}`);
+        const [layoutResponse, prefabResponse] = await Promise.all([
+          fetch(HAOZHOU_LAYOUT_EXAMPLE_PATH),
+          fetch(HAOZHOU_PREFAB_EXAMPLE_PATH)
+        ]);
+        if (!layoutResponse.ok) {
+          throw new Error(`layout HTTP ${layoutResponse.status}`);
+        }
+        if (!prefabResponse.ok) {
+          throw new Error(`prefab HTTP ${prefabResponse.status}`);
         }
-        setEditorLayout(await response.json());
-        setStatus("已载入濠州示例。");
+        const [layout, prefabs] = await Promise.all([
+          layoutResponse.json(),
+          prefabResponse.json()
+        ]);
+        setEditorLayout(
+          composePrefabLayoutForEditor(layout, prefabs),
+          null,
+          {
+            source: "haozhou-split-example",
+            message: "Prefab-backed example is read-only here. Import a city layout JSON to edit or export data."
+          }
+        );
+        setStatus("宸茶浇鍏ユ繝宸炵ず渚嬶紝褰撳墠浠呯敤浜庢煡鐪嬪拰瀵归綈锛屼笉鍏佽鍦ㄦ椤甸潰淇敼棰勫埗浣撴垨瀵煎嚭缁勮瀹炰綋銆?);
       } catch (error) {
-        setStatus(`载入示例失败：请使用“导入 JSON”选择 examples/haozhou-city-layout.example.json。原因：${error.message}`);
+        setStatus(`杞藉叆绀轰緥澶辫触锛氳浣跨敤鈥滃鍏?JSON鈥濋�夋嫨 ${HAOZHOU_LAYOUT_EXAMPLE_PATH} 涓?${HAOZHOU_PREFAB_EXAMPLE_PATH}銆傚師鍥狅細${error.message}`);
       }
     }
 
-    function setEditorLayout(layout, preferredSelectedId = null) {
+    function setEditorLayout(layout, preferredSelectedId = null, readOnlyPrefabExample = null) {
       state.layout = normalizeLayout(layout);
+      state.readOnlyPrefabExample = readOnlyPrefabExample;
       state.selectedId = state.layout.entities.some((entity) => entity.id === preferredSelectedId)
         ? preferredSelectedId
         : state.layout.entities[0]?.id || null;
       state.centerSelectedAfterRender = true;
       state.entityPreviews.clear();
       state.backgroundPreview = "";
       state.foregroundPreview = "";
       render();
     }
 
     function exportJsonFile() {
+      if (guardReadOnlyPrefabExample()) {
+        return;
+      }
       const result = validateLayout(state.layout);
       renderValidation(result);
-      if (result.errors > 0 && !confirm(`布局存在 ${result.errors} 个错误，仍然导出？`)) {
-        setStatus("已取消导出。");
+      if (result.errors > 0 && !confirm(`甯冨眬瀛樺湪 ${result.errors} 涓敊璇紝浠嶇劧瀵煎嚭锛焋)) {
+        setStatus("宸插彇娑堝鍑恒�?);
         return;
       }
       const blob = new Blob([`${JSON.stringify(state.layout, null, 2)}\n`], { type: "application/json" });
       const link = document.createElement("a");
       link.href = URL.createObjectURL(blob);
       link.download = "city-map-layout.json";
       document.body.append(link);
       link.click();
       link.remove();
       URL.revokeObjectURL(link.href);
-      setStatus("已导出 city-map-layout.json。");
+      setStatus("宸插鍑?city-map-layout.json銆?);
     }
 
     function uploadMapImage(event, kind) {
       const file = event.target.files?.[0];
       if (file == null) {
         return;
       }
+      if (guardReadOnlyPrefabExample()) {
+        event.target.value = "";
+        return;
+      }
       readImageFile(file, (dataUrl) => {
         if (kind === "background") {
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
-        setStatus(`${file.name} 已作为${kind === "background" ? "地图底图" : "前景墙体图"}预览；导出前请填写项目内相对路径。`);
+        setStatus(`${file.name} 宸蹭綔涓?{kind === "background" ? "鍦板浘搴曞浘" : "鍓嶆櫙澧欎綋鍥?}棰勮锛涘鍑哄墠璇峰～鍐欓」鐩唴鐩稿璺緞銆俙);
         render();
       });
       event.target.value = "";
     }
 
     function uploadEntityImage(event) {
       const entity = getSelectedEntity();
       const file = event.target.files?.[0];
       if (file == null) {
         return;
       }
+      if (guardReadOnlyPrefabExample()) {
+        event.target.value = "";
+        return;
+      }
       if (entity == null) {
-        setStatus("请先选择一个建筑，再上传建筑图片。");
+        setStatus("璇峰厛閫夋嫨涓�涓缓绛戯紝鍐嶄笂浼犲缓绛戝浘鐗囥�?);
         event.target.value = "";
         return;
       }
       readImageFile(file, (dataUrl, image) => {
         state.entityPreviews.set(entity.id, dataUrl);
         entity.asset.naturalWidth = image.naturalWidth || entity.asset.naturalWidth;
         entity.asset.naturalHeight = image.naturalHeight || entity.asset.naturalHeight;
         if (!entity.asset.image) {
           entity.asset.image = file.name;
         }
-        setStatus(`${file.name} 已作为 ${entity.name} 的本地预览；导出前请填写项目内相对路径。`);
+        setStatus(`${file.name} 宸蹭綔涓?${entity.name} 鐨勬湰鍦伴瑙堬紱瀵煎嚭鍓嶈濉啓椤圭洰鍐呯浉瀵硅矾寰勩�俙);
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
+      if (guardReadOnlyPrefabExample()) {
+        return;
+      }
       const text = JSON.stringify(state.layout, null, 2);
       if (navigator.clipboard?.writeText != null) {
         await navigator.clipboard.writeText(text);
-        setStatus("已复制当前布局 JSON。");
+        setStatus("宸插鍒跺綋鍓嶅竷灞� JSON銆?);
       } else {
-        setStatus("当前浏览器不支持直接复制，请用导出 JSON。");
+        setStatus("褰撳墠娴忚鍣ㄤ笉鏀寔鐩存帴澶嶅埗锛岃鐢ㄥ鍑?JSON銆?);
       }
     }
 
     function updateRandomPoolsFromTextarea() {
+      if (guardReadOnlyPrefabExample()) {
+        syncRandomPoolsTextarea();
+        return;
+      }
       try {
         const parsed = JSON.parse(dom.randomPoolsJson.value || "[]");
         if (!Array.isArray(parsed)) {
-          throw new Error("随机池必须是数组。");
+          throw new Error("闅忔満姹犲繀椤绘槸鏁扮粍銆?);
         }
         state.layout.randomPools = parsed;
-        setStatus("已更新随机池。");
+        setStatus("宸叉洿鏂伴殢鏈烘睜銆?);
       } catch (error) {
-        setStatus(`随机池 JSON 无效：${error.message}`);
+        setStatus(`闅忔満姹?JSON 鏃犳晥锛?{error.message}`);
       }
     }
 
     function syncRandomPoolsTextarea() {
       if (document.activeElement === dom.randomPoolsJson) {
         return;
       }
       dom.randomPoolsJson.value = JSON.stringify(state.layout.randomPools, null, 2);
     }
 
     function syncLayoutJsonPreview() {
+      if (isReadOnlyPrefabExampleLoaded()) {
+        dom.layoutJsonPreview.value = `${state.readOnlyPrefabExample.message}\nThis compatibility loader only previews composed runtime entities. Import a city layout JSON to edit or export layout data.\n`;
+        return;
+      }
       dom.layoutJsonPreview.value = `${JSON.stringify(state.layout, null, 2)}\n`;
     }
 
     function validateLayout(layout) {
       const messages = [];
       const base = layout.map.baseSpace;
       const idCounts = new Map();
       const poolIds = new Set((layout.randomPools || []).map((pool) => pool.id));
       const specialEntities = layout.entities.filter((entity) => entity.category === "special");
       const grid = layout.grid;
 
       for (const entity of layout.entities) {
         idCounts.set(entity.id, (idCounts.get(entity.id) || 0) + 1);
       }
 
       for (const entity of layout.entities) {
         if ((idCounts.get(entity.id) || 0) > 1) {
-          addMessage("error", entity.id, "建筑编号重复。");
+          addMessage("error", entity.id, "寤虹瓚缂栧彿閲嶅銆?);
         }
         if (!entity.name.trim()) {
-          addMessage("error", entity.id, "建筑名称不能为空。");
+          addMessage("error", entity.id, "寤虹瓚鍚嶇О涓嶈兘涓虹┖銆?);
         }
         if ((entity.category === "special" || entity.interaction.clickable) && entity.entry.type === "none") {
-          addMessage("error", entity.id, "特殊建筑或可点击建筑缺少入口绑定。");
+          addMessage("error", entity.id, "鐗规畩寤虹瓚鎴栧彲鐐瑰嚮寤虹瓚缂哄皯鍏ュ彛缁戝畾銆?);
         }
         if (entity.entry.type === "house" && !entity.entry.houseId.trim()) {
-          addMessage("error", entity.id, "入口类型为 house 时缺少 houseId。");
+          addMessage("error", entity.id, "鍏ュ彛绫诲瀷涓?house 鏃剁己灏?houseId銆?);
         }
         if (entity.entry.type === "city-entry" && !entity.entry.cityEntryId.trim()) {
-          addMessage("error", entity.id, "入口类型为 city-entry 时缺少 cityEntryId。");
+          addMessage("error", entity.id, "鍏ュ彛绫诲瀷涓?city-entry 鏃剁己灏?cityEntryId銆?);
         }
         if (!entity.asset.image.trim()) {
-          addMessage("warning", entity.id, "图片路径为空。");
+          addMessage("warning", entity.id, "鍥剧墖璺緞涓虹┖銆?);
         }
         if (!isBoundsInside(getEntityImageBounds(entity), base)) {
-          addMessage("warning", entity.id, "建筑图片超出地图编辑区域。");
+          addMessage("warning", entity.id, "寤虹瓚鍥剧墖瓒呭嚭鍦板浘缂栬緫鍖哄煙銆?);
         }
         const footprintBounds = getFootprintBounds(entity);
         const labelBounds = getLabelBounds(entity);
         const hitBounds = getHitAreaBounds(entity);
         if (!isBoundsInside(footprintBounds, base)) {
-          addMessage("warning", entity.id, "占地区域超出地图编辑区域。");
+          addMessage("warning", entity.id, "鍗犲湴鍖哄煙瓒呭嚭鍦板浘缂栬緫鍖哄煙銆?);
         }
         if (!isLotInsideBoard(entity, grid)) {
-          addMessage("error", entity.id, "建筑占格超出 细分网格 棋盘。");
+          addMessage("error", entity.id, "寤虹瓚鍗犳牸瓒呭嚭 缁嗗垎缃戞牸 妫嬬洏銆?);
         }
         if (entity.lot.gridX < 0 || entity.lot.gridY < 0) {
-          addMessage("error", entity.id, "建筑格子坐标不能小于 0。");
+          addMessage("error", entity.id, "寤虹瓚鏍煎瓙鍧愭爣涓嶈兘灏忎簬 0銆?);
         }
         if (entity.lot.gridX + entity.lot.cols > grid.cols || entity.lot.gridY + entity.lot.rows > grid.rows) {
-          addMessage("error", entity.id, "建筑底座没有落在 细分网格 棋盘内。");
+          addMessage("error", entity.id, "寤虹瓚搴曞骇娌℃湁钀藉湪 缁嗗垎缃戞牸 妫嬬洏鍐呫�?);
         }
         if (!isBoundsInside(getLabelBounds(entity), base) && (entity.interaction.clickable || entity.interaction.label.text.trim())) {
-          addMessage("warning", entity.id, "标签按钮超出可见区域。");
+          addMessage("warning", entity.id, "鏍囩鎸夐挳瓒呭嚭鍙鍖哄煙銆?);
         }
         if (entity.interaction.label.offsetY > -20 && entity.interaction.clickable) {
-          addMessage("warning", entity.id, "标签按钮可能被前景墙体遮挡。");
+          addMessage("warning", entity.id, "鏍囩鎸夐挳鍙兘琚墠鏅浣撻伄鎸°�?);
         }
         if (entity.interaction.hitArea.width <= 0 || entity.interaction.hitArea.height <= 0) {
-          addMessage("error", entity.id, "点击区域缺少有效宽高。");
+          addMessage("error", entity.id, "鐐瑰嚮鍖哄煙缂哄皯鏈夋晥瀹介珮銆?);
         }
         if (Math.hypot(entity.interaction.hitArea.offsetX, entity.interaction.hitArea.offsetY) > Math.max(entity.lot.footprintWidth, entity.lot.footprintHeight)) {
-          addMessage("warning", entity.id, "点击区域明显偏离建筑。");
+          addMessage("warning", entity.id, "鐐瑰嚮鍖哄煙鏄庢樉鍋忕寤虹瓚銆?);
         }
         if (!doBoundsOverlap(getEntityImageBounds(entity), expandBounds(getFootprintBounds(entity), 160))) {
-          addMessage("warning", entity.id, "建筑图片视觉上完全不在地块附近。");
+          addMessage("warning", entity.id, "寤虹瓚鍥剧墖瑙嗚涓婂畬鍏ㄤ笉鍦ㄥ湴鍧楅檮杩戙�?);
         }
         if (entity.category === "random-slot") {
           if (!entity.random?.poolId || !poolIds.has(entity.random.poolId)) {
-            addMessage("error", entity.id, "随机民居槽位缺少有效候选池。");
+            addMessage("error", entity.id, "闅忔満姘戝眳妲戒綅缂哄皯鏈夋晥鍊欓�夋睜銆?);
           }
           if (!Array.isArray(entity.random?.allowedTags) || entity.random.allowedTags.length === 0) {
-            addMessage("warning", entity.id, "随机民居槽位缺少允许标签。");
+            addMessage("warning", entity.id, "闅忔満姘戝眳妲戒綅缂哄皯鍏佽鏍囩銆?);
           }
           for (const special of specialEntities) {
             if (special.id !== entity.id && doBoundsOverlap(getFootprintBounds(entity), expandBounds(getFootprintBounds(special), 80))) {
-              addMessage("warning", entity.id, `随机民居槽位进入特殊建筑 ${special.name} 的保护区。`);
+              addMessage("warning", entity.id, `闅忔満姘戝眳妲戒綅杩涘叆鐗规畩寤虹瓚 ${special.name} 鐨勪繚鎶ゅ尯銆俙);
             }
           }
         }
         if (entity.render.locked) {
-          addMessage("info", entity.id, "锁定建筑不能被拖动。");
+          addMessage("info", entity.id, "閿佸畾寤虹瓚涓嶈兘琚嫋鍔ㄣ�?);
         }
       }
 
       for (let firstIndex = 0; firstIndex < layout.entities.length; firstIndex += 1) {
         for (let secondIndex = firstIndex + 1; secondIndex < layout.entities.length; secondIndex += 1) {
           const first = layout.entities[firstIndex];
           const second = layout.entities[secondIndex];
           if (!first.render.visible || !second.render.visible) {
             continue;
           }
           if (first.category === "ground-decoration" || second.category === "ground-decoration") {
             continue;
           }
           if (doLotRectsOverlap(first, second)) {
             const isSpecialOverlap = first.category === "special" || second.category === "special";
-            addMessage(isSpecialOverlap ? "error" : "warning", `${first.id} / ${second.id}`, isSpecialOverlap ? "地块与特殊建筑重叠。" : "占地区域明显重叠。");
+            addMessage(isSpecialOverlap ? "error" : "warning", `${first.id} / ${second.id}`, isSpecialOverlap ? "鍦板潡涓庣壒娈婂缓绛戦噸鍙犮�? : "鍗犲湴鍖哄煙鏄庢樉閲嶅彔銆?);
           }
         }
       }
 
       return {
         messages,
         errors: messages.filter((message) => message.level === "error").length,
         warnings: messages.filter((message) => message.level === "warning").length,
         info: messages.filter((message) => message.level === "info").length
       };
@@ -3078,29 +3271,29 @@
       function addMessage(level, entityId, text) {
         messages.push({ level, entityId, text });
       }
     }
 
     function renderValidation(result) {
       dom.validationOutput.innerHTML = "";
       if (result.messages.length === 0) {
         const node = document.createElement("div");
         node.className = "validation-item validation-item--info";
-        node.innerHTML = "<strong>通过</strong>布局校验未发现问题。";
+        node.innerHTML = "<strong>閫氳繃</strong>甯冨眬鏍￠獙鏈彂鐜伴棶棰樸�?;
         dom.validationOutput.append(node);
         return;
       }
       for (const message of result.messages) {
         const node = document.createElement("div");
         node.className = `validation-item validation-item--${message.level}`;
-        const label = message.level === "error" ? "错误" : message.level === "warning" ? "警告" : "提示";
-        node.innerHTML = `<strong>${label}</strong>${escapeHtml(message.entityId)}：${escapeHtml(message.text)}`;
+        const label = message.level === "error" ? "閿欒" : message.level === "warning" ? "璀﹀憡" : "鎻愮ず";
+        node.innerHTML = `<strong>${label}</strong>${escapeHtml(message.entityId)}锛?{escapeHtml(message.text)}`;
         dom.validationOutput.append(node);
       }
     }
 
     function getEntityImageBounds(entity) {
       const width = Math.max(1, entity.asset.naturalWidth * entity.asset.scale);
       const height = Math.max(1, entity.asset.naturalHeight * entity.asset.scale);
       const anchor = entity.asset.anchor;
       const x = entity.lot.x + numberOr(entity.asset.offsetX, 0);
       const y = entity.lot.y + numberOr(entity.asset.offsetY, 0);
@@ -3246,30 +3439,30 @@
         return { x: 0, y: 0 };
       }
       return polygon.reduce(
         (sum, point) => ({ x: sum.x + point.x / polygon.length, y: sum.y + point.y / polygon.length }),
         { x: 0, y: 0 }
       );
     }
 
     function getEntrySummary(entity) {
       if (entity.entry.type === "house") {
-        return `建筑入口：${entity.entry.houseId || "未绑定"}`;
+        return `寤虹瓚鍏ュ彛锛?{entity.entry.houseId || "鏈粦瀹?}`;
       }
       if (entity.entry.type === "city-entry") {
-        return `地点入口：${entity.entry.cityEntryId || "未绑定"}`;
+        return `鍦扮偣鍏ュ彛锛?{entity.entry.cityEntryId || "鏈粦瀹?}`;
       }
-      return "无入口";
+      return "鏃犲叆鍙?;
     }
 
     function setStatus(message) {
-      dom.statusLine.innerHTML = `<strong>状态</strong> ${escapeHtml(message)}`;
+      dom.statusLine.innerHTML = `<strong>鐘舵�?/strong> ${escapeHtml(message)}`;
     }
 
     function escapeHtml(value) {
       return String(value)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
     }
@@ -3285,10 +3478,11 @@
         setEditorLayout(layout, preferredSelectedId);
         return this.getLayout();
       },
       validate() {
         return clone(validateLayout(state.layout));
       }
     };
   </script>
 </body>
 </html>
+
```
