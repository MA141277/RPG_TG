## Task 1: Add Failing Tests And UI Entry Contract

**Files:**
- Modify: `C:\Users\EDY\Documents\GitHub\RPG_TG\tests\city-map-building-editor.test.cjs`
- Modify: `C:\Users\EDY\Documents\GitHub\RPG_TG\tools\city-map-building-editor\index.html`

**Interfaces:**
- Consumes:
  - Existing editor state with `prefabLibrary`, `cityLayout`, `editorMode`
- Produces:
  - `function autoPlaceMissingEnterableBuildings(): void`
  - `function getMissingEnterablePrefabs(): Array<PrefabLike>`
  - toolbar button id `auto-place-enterable-buildings`

- [ ] **Step 1: Write the failing test**

```js
test("city layout exposes an auto-place action for missing enterable buildings", () => {
  const html = readText(indexPath);

  assert.match(html, /id="auto-place-enterable-buildings"/);
  assert.match(html, /一键补齐可进入建筑/);
  assert.match(html, /autoPlaceMissingEnterableBuildings/);
});

test("auto-place only considers missing enterable prefabs once each", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  prefabLibrary.prefabs.push({
    id: "decor-only",
    name: "Decor Only",
    category: "decoration",
    entry: { type: "none" },
    asset: { image: "decor.png", naturalWidth: 32, naturalHeight: 32, scale: 1, offsetX: 0, offsetY: 0, rotation: 0, anchor: "bottom-center" },
    footprint: { cols: 1, rows: 1 },
    interaction: {
      clickable: false,
      label: { text: "", offsetX: 0, offsetY: 0, width: 1, height: 1 },
      hitArea: { type: "rect", offsetX: 0, offsetY: 0, width: 1, height: 1 }
    }
  });
  cityLayout.instances = [
    cityLayout.instances[0],
    {
      id: "existing.watchtower",
      prefabId: "watchtower",
      gridX: 20,
      gridY: 20,
      render: { visible: true, locked: false, zIndexMode: "y-sort", zIndex: null }
    }
  ];
  api.setSources(prefabLibrary, cityLayout, "instance.keep");
  api.state.editorMode = "city-layout";

  const missing = api.getMissingEnterablePrefabs().map((prefab) => prefab.id);

  assert.deepEqual(missing.includes("keep"), false);
  assert.deepEqual(missing.includes("watchtower"), false);
  assert.deepEqual(missing.includes("decor-only"), false);
  assert.deepEqual(missing.length > 0, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- Missing button id
- Missing helper exports

- [ ] **Step 3: Write minimal implementation**

```html
<div class="button-row">
  <button type="button" id="add-entity">新建建筑</button>
  <button type="button" id="duplicate-entity">复制建筑</button>
  <button type="button" id="delete-entity">删除建筑</button>
  <button type="button" id="auto-place-enterable-buildings">一键补齐可进入建筑</button>
</div>
```

```js
function getMissingEnterablePrefabs() {
  const placedPrefabIds = new Set(state.cityLayout.instances.map((instance) => instance.prefabId));
  return state.prefabLibrary.prefabs.filter((prefab) => {
    return prefab.entry.type !== "none" && !placedPrefabIds.has(prefab.id);
  });
}

function autoPlaceMissingEnterableBuildings() {
  return;
}
```

```js
dom.autoPlaceEnterableBuildings.addEventListener("click", autoPlaceMissingEnterableBuildings);
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `PASS`
- Button and helper now exist

- [ ] **Step 5: Commit**

```bash
git add tests/city-map-building-editor.test.cjs tools/city-map-building-editor/index.html
git commit -m "feat: add city layout auto-place entry points"
```

