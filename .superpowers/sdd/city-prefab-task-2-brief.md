## Task 2: Split The Editor Into Prefab And City Layout Modes

**Files:**
- Modify: `tools/city-map-building-editor/index.html`
- Modify: `tests/city-map-building-editor.test.cjs`

**Interfaces:**
- Consumes:
  - `CityStagePrefabLibrary`
  - `CityStageLayoutSource`
- Produces:
  - `function composeEditorEntities(prefabLibrary, cityLayout): EditorEntity[]`
  - `function renderPrefabPanel(prefabId: string | null): void`
  - `function renderCityLayoutPanel(instanceId: string | null): void`
  - `function exportPrefabLibraryJson(): string`
  - `function exportCityLayoutJson(): string`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- The current editor still exposes one blended entity editing surface

- [ ] **Step 3: Write minimal implementation**

```html
<!-- tools/city-map-building-editor/index.html -->
<div class="toolbar__group">
  <button id="editor-mode-toggle" type="button">Prefab Editor</button>
  <span id="editor-mode-readout">Prefab Editor</span>
</div>
```

```js
const state = {
  prefabLibrary: normalizePrefabLibrary(EMPTY_PREFAB_LIBRARY),
  cityLayout: normalizeCityLayout(EMPTY_LAYOUT),
  editorMode: "prefab",
  selectedPrefabId: null,
  selectedInstanceId: null,
};

function composeEditorEntities(prefabLibrary, cityLayout) {
  return composePrefabsAndInstances(prefabLibrary, cityLayout);
}

function exportPrefabLibraryJson() {
  return `${JSON.stringify(state.prefabLibrary, null, 2)}\n`;
}

function exportCityLayoutJson() {
  return `${JSON.stringify(state.cityLayout, null, 2)}\n`;
}

function renderProperties() {
  if (state.editorMode === "prefab") {
    renderPrefabPanel(state.selectedPrefabId);
    return;
  }
  renderCityLayoutPanel(state.selectedInstanceId);
}
```

```js
function renderCityLayoutPanel(instanceId) {
  const instance = getSelectedInstance(instanceId);
  dom.fieldInstancePrefabId.value = instance?.prefabId ?? "";
  dom.fieldLotX.value = instance?.gridX ?? "";
  dom.fieldLotY.value = instance?.gridY ?? "";
}
```

- [ ] **Step 4: Run verification for the split editor**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `PASS`
- Raw HTML includes separate prefab and city-layout editing entry points
- No city-instance offset fields are introduced

- [ ] **Step 5: Commit**

```bash
git add tools/city-map-building-editor/index.html tests/city-map-building-editor.test.cjs
git commit -m "feat: split city editor into prefab and layout modes"
```

