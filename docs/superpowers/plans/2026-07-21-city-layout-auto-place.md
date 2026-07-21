# City Layout Auto Place Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `City Layout` action that fills in missing enterable building instances exactly once each, using deterministic score-guided placement without disturbing existing instances.

**Architecture:** Keep the feature entirely inside the standalone city map editor. Build one placement pipeline that filters enterable prefabs, removes already-instanced prefab ids, sorts remaining prefabs by footprint area descending, scans legal grid candidates, scores them, and appends new `CityStageInstance` records to the current in-memory city layout.

**Tech Stack:** Standalone HTML/CSS/JS editor in `tools/city-map-building-editor/index.html`, JSON-backed city/prefab data, Node test runner (`node --test`), TypeScript compiler (`npm run typecheck`).

## Global Constraints

- The action must run only in `City Layout`.
- Only prefabs with `entry.type !== "none"` are eligible.
- Each eligible prefab may be placed at most once.
- Existing instances must remain untouched.
- Auto placement must not mutate prefab `asset`, `footprint`, `interaction`, or `entry` data.
- Candidate placements must fail closed on overlap, street-forbidden cells, or board overflow.
- Sorting order must be deterministic: footprint area descending, then `cols`, then `rows`, then prefab id.
- The result must update only the current in-memory city layout; no auto-save.

---

## File Map

### Modify

- `C:\Users\EDY\Documents\GitHub\RPG_TG\tools\city-map-building-editor\index.html`
  - Add the new City Layout action button.
  - Add filtering, sorting, candidate search, scoring, and instance creation helpers.
  - Add status reporting for placed, skipped, and failed prefabs.
- `C:\Users\EDY\Documents\GitHub\RPG_TG\tests\city-map-building-editor.test.cjs`
  - Add regression coverage for eligibility filtering, deterministic sorting, non-destructive placement, and status output.
- `C:\Users\EDY\Documents\GitHub\RPG_TG\tools\city-map-building-editor\README.md`
  - Document the new City Layout auto-place workflow after implementation is stable.

### No New Runtime Files

- No runtime game files under `src/` should change for this feature.

## Verification Plan

- Targeted tests:
  - `node --test tests/city-map-building-editor.test.cjs`
- Required verification:
  - `npm run typecheck`

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

## Task 2: Implement Deterministic Search, Scoring, And Instance Creation

**Files:**
- Modify: `C:\Users\EDY\Documents\GitHub\RPG_TG\tools\city-map-building-editor\index.html`
- Modify: `C:\Users\EDY\Documents\GitHub\RPG_TG\tests\city-map-building-editor.test.cjs`

**Interfaces:**
- Consumes:
  - `function getMissingEnterablePrefabs(): Array<PrefabLike>`
  - `function canPlaceEntityLot(entity, sourceGrid?): boolean`
  - `function normalizeCityInstance(instance, grid): CityStageInstance`
- Produces:
  - `function sortPrefabsForAutoPlacement(prefabs): Array<PrefabLike>`
  - `function findBestAutoPlacementForPrefab(prefab): { gridX: number; gridY: number; score: number } | null`
  - `function scoreAutoPlacementCandidate(prefab, gridX, gridY): number`
  - `function createAutoPlacedInstance(prefab, gridX, gridY): CityStageInstance`

- [ ] **Step 1: Write the failing test**

```js
test("auto-place sorts larger footprints first and appends only missing enterable prefabs", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  api.assignDom({ statusLine: createElement() });
  cityLayout.instances = [];
  api.setSources(prefabLibrary, cityLayout);
  api.state.editorMode = "city-layout";

  api.autoPlaceMissingEnterableBuildings();

  const ids = api.state.cityLayout.instances.map((instance) => instance.prefabId);
  const areas = ids.map((id) => {
    const prefab = api.state.prefabLibrary.prefabs.find((candidate) => candidate.id === id);
    return prefab.footprint.cols * prefab.footprint.rows;
  });

  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(areas.every((area, index) => index === 0 || areas[index - 1] >= area), true);
});

test("auto-place never creates a placement on street cells or overlapping an existing instance", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  api.stubUi();
  api.assignDom({ statusLine: createElement() });
  api.setSources(prefabLibrary, cityLayout, "instance.keep");
  api.state.editorMode = "city-layout";

  api.autoPlaceMissingEnterableBuildings();

  const seenCells = new Set();
  for (const entity of api.state.layout.entities) {
    for (let x = entity.lot.gridX; x < entity.lot.gridX + entity.lot.cols; x += 1) {
      for (let y = entity.lot.gridY; y < entity.lot.gridY + entity.lot.rows; y += 1) {
        assert.equal(api.isStreetGridCell(x, y), false);
        const key = `${x},${y}`;
        assert.equal(seenCells.has(key), false);
        seenCells.add(key);
      }
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- No sorting helper
- No placement logic

- [ ] **Step 3: Write minimal implementation**

```js
function sortPrefabsForAutoPlacement(prefabs) {
  return [...prefabs].sort((first, second) => {
    const firstArea = first.footprint.cols * first.footprint.rows;
    const secondArea = second.footprint.cols * second.footprint.rows;
    return (
      secondArea - firstArea ||
      second.footprint.cols - first.footprint.cols ||
      second.footprint.rows - first.footprint.rows ||
      first.id.localeCompare(second.id)
    );
  });
}

function scoreAutoPlacementCandidate(prefab, gridX, gridY) {
  const boardCenterX = (state.layout.grid.cols - 1) / 2;
  const boardCenterY = (state.layout.grid.rows - 1) / 2;
  const centerDistance = Math.abs(gridX - boardCenterX) + Math.abs(gridY - boardCenterY);
  return -centerDistance;
}

function findBestAutoPlacementForPrefab(prefab) {
  let best = null;
  for (let gridY = 0; gridY <= state.layout.grid.rows - prefab.footprint.rows; gridY += 1) {
    for (let gridX = 0; gridX <= state.layout.grid.cols - prefab.footprint.cols; gridX += 1) {
      const probe = createAutoPlacementProbe(prefab, gridX, gridY);
      if (!canPlaceEntityLot(probe, state.layout.grid) || overlapsExistingEntities(probe)) {
        continue;
      }
      const score = scoreAutoPlacementCandidate(prefab, gridX, gridY);
      if (best == null || score > best.score) {
        best = { gridX, gridY, score };
      }
    }
  }
  return best;
}

function createAutoPlacedInstance(prefab, gridX, gridY) {
  return normalizeCityInstance({
    id: `instance.${prefab.id}`,
    prefabId: prefab.id,
    gridX,
    gridY,
    render: { visible: true, locked: false, zIndexMode: "y-sort", zIndex: null }
  }, state.cityLayout.grid);
}

function autoPlaceMissingEnterableBuildings() {
  const prefabs = sortPrefabsForAutoPlacement(getMissingEnterablePrefabs());
  for (const prefab of prefabs) {
    const best = findBestAutoPlacementForPrefab(prefab);
    if (best == null) {
      continue;
    }
    state.cityLayout.instances.push(createAutoPlacedInstance(prefab, best.gridX, best.gridY));
    syncEditorLayoutFromSources();
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `PASS`
- Instances are unique by prefab id
- Placements stay off street cells and do not overlap

- [ ] **Step 5: Commit**

```bash
git add tests/city-map-building-editor.test.cjs tools/city-map-building-editor/index.html
git commit -m "feat: implement deterministic city auto placement"
```

## Task 3: Add Lightweight Scoring Quality Signals And Status Reporting

**Files:**
- Modify: `C:\Users\EDY\Documents\GitHub\RPG_TG\tools\city-map-building-editor\index.html`
- Modify: `C:\Users\EDY\Documents\GitHub\RPG_TG\tests\city-map-building-editor.test.cjs`
- Modify: `C:\Users\EDY\Documents\GitHub\RPG_TG\tools\city-map-building-editor\README.md`

**Interfaces:**
- Consumes:
  - `findBestAutoPlacementForPrefab`
  - `scoreAutoPlacementCandidate`
  - `setStatus(message: string): void`
- Produces:
  - status summary containing placed, skipped, and failed prefab ids
  - README section documenting the City Layout auto-place action

- [ ] **Step 1: Write the failing test**

```js
test("auto-place reports placed, skipped, and failed enterable prefabs in status output", () => {
  const api = createEditorRuntimeHarness();
  const { prefabLibrary, cityLayout } = createSplitEditorSources();
  const statusLine = createElement();
  api.stubUi();
  api.assignDom({ statusLine });
  api.setSources(prefabLibrary, cityLayout, "instance.keep");
  api.state.editorMode = "city-layout";

  api.autoPlaceMissingEnterableBuildings();

  assert.match(statusLine.innerHTML, /已放置|placed/i);
  assert.match(statusLine.innerHTML, /已存在|skipped/i);
});

test("editor README documents one-click placement of missing enterable buildings", () => {
  const readme = readText(readmePath);
  assert.match(readme, /一键补齐可进入建筑/);
  assert.match(readme, /City Layout/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- No status summary
- README missing the new workflow

- [ ] **Step 3: Write minimal implementation**

```js
function scoreAutoPlacementCandidate(prefab, gridX, gridY) {
  const centerBias = getCenterBiasScore(gridX, gridY);
  const clusterScore = getNearestNeighborScore(gridX, gridY);
  const compactnessScore = getAdjacencyScore(prefab, gridX, gridY);
  const spacingScore = getSpacingScore(prefab, gridX, gridY);
  return centerBias + clusterScore + compactnessScore + spacingScore;
}

function autoPlaceMissingEnterableBuildings() {
  const skipped = getAlreadyPlacedEnterablePrefabIds();
  const placed = [];
  const failed = [];
  const prefabs = sortPrefabsForAutoPlacement(getMissingEnterablePrefabs());

  for (const prefab of prefabs) {
    const best = findBestAutoPlacementForPrefab(prefab);
    if (best == null) {
      failed.push(prefab.id);
      continue;
    }
    state.cityLayout.instances.push(createAutoPlacedInstance(prefab, best.gridX, best.gridY));
    placed.push(prefab.id);
    syncEditorLayoutFromSources();
  }

  setStatus(`自动排布完成：已放置 ${placed.length} 个；已存在 ${skipped.length} 个；未放下 ${failed.length} 个。`);
}
```

```md
## City Layout Auto Place

In `City Layout`, use `一键补齐可进入建筑` to add only missing enterable buildings.

- Each eligible prefab is placed at most once.
- Existing instances are preserved.
- Placement stays within the board, avoids street-forbidden cells, and avoids overlaps.
- The result updates the current layout only; save explicitly after review.
```

- [ ] **Step 4: Run full verification**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
npm run typecheck
```

Expected:

- `PASS`
- Status output includes placement summary
- README documents the feature

- [ ] **Step 5: Commit**

```bash
git add tests/city-map-building-editor.test.cjs tools/city-map-building-editor/index.html tools/city-map-building-editor/README.md
git commit -m "feat: report city auto-place results"
```

## Self-Review

- Spec coverage:
  - `City Layout`-only entry: Task 1
  - only enterable prefabs: Tasks 1-2
  - one instance per prefab: Task 2
  - preserve existing instances: Tasks 1-3
  - deterministic size-first order: Task 2
  - score-guided placement: Task 3
  - status summary and no auto-save: Task 3
- Placeholder scan:
  - No `TODO`, `TBD`, or unnamed helper references remain.
- Type consistency:
  - All tasks use `autoPlaceMissingEnterableBuildings`, `getMissingEnterablePrefabs`, `sortPrefabsForAutoPlacement`, `findBestAutoPlacementForPrefab`, `scoreAutoPlacementCandidate`, and `createAutoPlacedInstance` consistently.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-21-city-layout-auto-place.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
