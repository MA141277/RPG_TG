# City Prefab Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a standalone city-stage prefab library plus instance-based city layouts so reusable entity alignment is edited once and reused across cities.

**Architecture:** Split authoring storage into two JSON layers: `prefabs` hold reusable visual and interaction data, while city `instances` hold only placement and instance render metadata. Keep runtime rendering on one composed entity model by adding a composition adapter in the city-stage runtime and mirroring the same ownership split inside the standalone editor.

**Tech Stack:** TypeScript runtime modules under `src/ui/views/city`, standalone HTML/CSS/JS editor in `tools/city-map-building-editor`, JSON example files, Node test runner (`node --test`), TypeScript compiler (`npm run typecheck`), build verification (`npm run build`), and plan linting (`npm run lint:plans`).

## Global Constraints

- Prefab visual truth lives only in the prefab library.
- City instances may edit only placement and instance render metadata.
- City layout editing must not allow per-city overrides of prefab `asset`, `interaction`, or footprint values.
- The editor must support prefab editing without loading a city background.
- Old layouts with `entities` must remain importable during migration.
- Runtime rendering must continue to consume one composed entity-like model.
- The existing dirty worktree changes outside this plan must remain untouched unless the task explicitly requires them.

## Execution State

- Status: `running`
- Last Updated: `2026-07-21`
- Current Focus: `Task 2: split the editor into Prefab and City Layout modes.`
- Next Step: `Dispatch the Task 2 implementer from this plan and preserve the prefab/instance ownership boundary in the editor UI.`
- Verification: `Task 1 passed: node --test tests/city-map-building-editor.test.cjs; npm run typecheck`
- Notes: `Task 1 is complete with commits b6e1c43 and c4e2945; the example loader stays read-only until native prefab-aware editor state lands.`

## Progress Log

- 2026-07-21
  - Summary: `Plan created from the approved city prefab layout design spec.`
  - Verification: `npm run lint:plans`
  - Next: `Choose execution mode and begin Task 1.`
- 2026-07-21
  - Summary: `Completed Task 1: added runtime prefab composition, migrated the example assets to prefab+instance data, and locked the split example loader to read-only compatibility mode.`
  - Verification: `node --test tests/city-map-building-editor.test.cjs; npm run typecheck`
  - Next: `Start Task 2 and replace the blended editor surface with separate Prefab and City Layout authoring modes.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-21-city-prefab-layout-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `tools/city-map-building-editor/index.html`, `README.md`, `examples/haozhou-city-layout.example.json`, and `tests/city-map-building-editor.test.cjs` already contain uncommitted editor work and must be edited in place without reverting unrelated user changes.
  - `src/ui/views/city/city-stage-layout.ts` still reads full city-owned entities from the example layout and must be adapted through a composition layer rather than a renderer rewrite.
  - The approved spec explicitly forbids city-instance overrides of prefab visual data; every task below preserves that boundary.

## Implementation Scope

### In Scope

- Add a standalone prefab example JSON and switch the example city layout to `instances`.
- Add runtime composition helpers that merge prefab data with city instances into renderable entities.
- Split the standalone editor into `Prefab` and `City Layout` modes with the correct ownership boundary.
- Preserve legacy `entities` import by converting old layouts into prefab plus instance data on load.
- Update editor tests and README for the new workflow.

### Still Out Of Scope

- Prefab inheritance or per-city prefab overrides.
- Instance-level directional variants beyond a plain `prefabId`.
- Full-project migration of every city layout outside the provided example assets.
- House gameplay behavior changes unrelated to city-stage authoring.

## File Map

### Existing files to modify

- `src/ui/views/city/city-stage-layout.ts`
  - Replace direct `entities` consumption with composed runtime entities created from prefab and instance data.
- `tools/city-map-building-editor/index.html`
  - Split the editor state and UI into prefab editing and city layout editing, plus legacy import conversion.
- `tools/city-map-building-editor/README.md`
  - Document the new prefab library workflow and legacy import behavior.
- `tools/city-map-building-editor/examples/haozhou-city-layout.example.json`
  - Convert the example city from full `entities` to `instances`.
- `tests/city-map-building-editor.test.cjs`
  - Lock the new prefab/instance data model and editor UI contract.

### Existing files expected to be deleted

- `none`

### New files to create

- `src/ui/views/city/city-stage-layout-data.ts`
  - Own runtime-facing prefab types, instance types, normalization, and composition helpers.
- `tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json`
  - Provide the reusable prefab library for the example city and editor.

## Verification Plan

- Targeted verification:
  - `node --test tests/city-map-building-editor.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`
  - `node --test tests/city-map-building-editor.test.cjs`

## Task 1: Add Runtime Prefab Composition And Example Assets

**Files:**
- Create: `src/ui/views/city/city-stage-layout-data.ts`
- Create: `tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json`
- Modify: `src/ui/views/city/city-stage-layout.ts`
- Modify: `tools/city-map-building-editor/examples/haozhou-city-layout.example.json`
- Modify: `tests/city-map-building-editor.test.cjs`

**Interfaces:**
- Consumes:
  - `haozhou-city-layout.example.json`
  - `haozhou-city-prefabs.example.json`
- Produces:
  - `type CityStagePrefabLibrary`
  - `type CityStageLayoutSource`
  - `type ComposedCityStageEntity`
  - `function composeCityStageLayout(layoutSource: CityStageLayoutSource, prefabLibrary: CityStagePrefabLibrary): ComposedCityStageEntity[]`

- [x] **Step 1: Write the failing test**

```js
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
  assert.match(html, /haozhou-city-prefabs\\.example\\.json/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- Missing `haozhou-city-prefabs.example.json`
- The example layout still exposes `entities`

- [x] **Step 3: Write minimal implementation**

```ts
// src/ui/views/city/city-stage-layout-data.ts
export type CityStagePrefab = {
  id: string;
  name: string;
  category: string;
  entry: CityStageEntry;
  asset: CityStageAsset;
  footprint: { cols: number; rows: number };
  interaction: CityStageInteraction;
};

export type CityStageInstance = {
  id: string;
  prefabId: string;
  gridX: number;
  gridY: number;
  render?: CityStageRender;
};

export function composeCityStageLayout(
  layoutSource: CityStageLayoutSource,
  prefabLibrary: CityStagePrefabLibrary
): ComposedCityStageEntity[] {
  const prefabById = new Map(prefabLibrary.prefabs.map((prefab) => [prefab.id, prefab]));
  return layoutSource.instances.map((instance) => {
    const prefab = prefabById.get(instance.prefabId);
    if (!prefab) {
      throw new Error(`Unknown city-stage prefab: ${instance.prefabId}`);
    }
    return {
      id: instance.id,
      prefabId: prefab.id,
      name: prefab.name,
      category: prefab.category,
      entry: prefab.entry,
      asset: prefab.asset,
      lot: {
        gridX: instance.gridX,
        gridY: instance.gridY,
        cols: prefab.footprint.cols,
        rows: prefab.footprint.rows,
      },
      render: instance.render ?? { visible: true, locked: false, zIndexMode: "y-sort", zIndex: null },
      interaction: prefab.interaction,
    };
  });
}
```

```ts
// src/ui/views/city/city-stage-layout.ts
import * as haozhouCityPrefabModule from "../../../../tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json";
import {
  composeCityStageLayout,
  type CityStagePrefabLibrary,
  type CityStageLayoutSource,
} from "./city-stage-layout-data";

const haozhouCityStagePrefabs = unwrapJsonModule<CityStagePrefabLibrary>(haozhouCityPrefabModule);
const haozhouCityStageLayout = unwrapJsonModule<CityStageLayoutSource>(haozhouCityLayoutModule);
const composedHaozhouEntities = composeCityStageLayout(
  haozhouCityStageLayout,
  haozhouCityStagePrefabs
);
```

```json
// tools/city-map-building-editor/examples/haozhou-city-layout.example.json
{
  "version": 2,
  "map": {
    "id": "haozhou-city",
    "name": "毫州城",
    "stageWidth": 2048,
    "stageHeight": 1152,
    "baseSpace": {
      "x": 139,
      "y": 88,
      "width": 1771,
      "height": 976
    },
    "backgroundImage": "ui/yuansu/菱形格子/20260716-111958.png",
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
    "originY": 110,
    "snap": true,
    "visible": true,
    "showCoordinates": true,
    "showOutline": true
  },
  "instances": [
    {
      "id": "haozhou-keep",
      "prefabId": "keep",
      "gridX": 16,
      "gridY": 10,
      "render": { "visible": true, "locked": false, "zIndexMode": "y-sort", "zIndex": null }
    }
  ]
}
```

- [x] **Step 4: Run verification for the new runtime data path**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
npm run typecheck
```

Expected:

- `PASS`
- `composeCityStageLayout` is referenced by runtime code
- example layout uses `instances`

- [x] **Step 5: Commit**

```bash
git add \
  src/ui/views/city/city-stage-layout-data.ts \
  src/ui/views/city/city-stage-layout.ts \
  tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json \
  tools/city-map-building-editor/examples/haozhou-city-layout.example.json \
  tests/city-map-building-editor.test.cjs
git commit -m "feat: compose city stage entities from prefabs"
```

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

## Task 3: Preserve Legacy `entities` Import Through Conversion

**Files:**
- Modify: `tools/city-map-building-editor/index.html`
- Modify: `tests/city-map-building-editor.test.cjs`

**Interfaces:**
- Consumes:
  - Legacy city layout objects with `entities`
- Produces:
  - `function convertLegacyEntitiesLayout(input: LegacyCityStageLayout): { prefabLibrary: CityStagePrefabLibrary; cityLayout: CityStageLayoutSource }`
  - `function setEditorData(prefabLibrary: CityStagePrefabLibrary, cityLayout: CityStageLayoutSource): void`

- [ ] **Step 1: Write the failing test**

```js
test("editor converts legacy entity layouts into prefabs and instances", () => {
  const html = readText(indexPath);
  assert.match(html, /convertLegacyEntitiesLayout/);
  assert.match(html, /legacyLayout\\.entities/);
  assert.match(html, /prefabId/);
  assert.match(html, /instances/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- No legacy conversion helper exists yet

- [ ] **Step 3: Write minimal implementation**

```js
function convertLegacyEntitiesLayout(legacyLayout) {
  const prefabs = [];
  const instances = [];

  for (const entity of legacyLayout.entities || []) {
    prefabs.push({
      id: entity.id,
      name: entity.name,
      category: entity.category,
      entry: clone(entity.entry),
      asset: clone(entity.asset),
      footprint: {
        cols: entity.lot.cols,
        rows: entity.lot.rows,
      },
      interaction: clone(entity.interaction),
    });
    instances.push({
      id: entity.id,
      prefabId: entity.id,
      gridX: entity.lot.gridX,
      gridY: entity.lot.gridY,
      render: clone(entity.render || {}),
    });
  }

  return {
    prefabLibrary: normalizePrefabLibrary({ version: 1, prefabs }),
    cityLayout: normalizeCityLayout({
      version: 2,
      map: clone(legacyLayout.map || {}),
      grid: clone(legacyLayout.grid || {}),
      instances,
    }),
  };
}
```

```js
function setEditorLayout(input) {
  if (Array.isArray(input?.entities)) {
    const converted = convertLegacyEntitiesLayout(input);
    setEditorData(converted.prefabLibrary, converted.cityLayout);
    return;
  }
  setEditorData(
    normalizePrefabLibrary(input?.prefabs ? input : state.prefabLibrary),
    normalizeCityLayout(input?.instances ? input : state.cityLayout)
  );
}
```

- [ ] **Step 4: Run verification for legacy import compatibility**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
npm run typecheck
```

Expected:

- `PASS`
- Legacy `entities` import remains supported through conversion

- [ ] **Step 5: Commit**

```bash
git add tools/city-map-building-editor/index.html tests/city-map-building-editor.test.cjs
git commit -m "feat: convert legacy city entities into prefab data"
```

## Task 4: Update Documentation, Example Workflow, And Final Verification

**Files:**
- Modify: `tools/city-map-building-editor/README.md`
- Modify: `tests/city-map-building-editor.test.cjs`
- Read: `docs/superpowers/specs/2026-07-21-city-prefab-layout-design.md`

**Interfaces:**
- Consumes:
  - Completed prefab and city-layout editor flow from Tasks 1-3
- Produces:
  - README sections for prefab workflow, city-layout workflow, and legacy import behavior

- [ ] **Step 1: Write the failing test**

```js
test("editor docs describe prefab-first workflow and legacy import", () => {
  const readme = readText(readmePath);

  assert.match(readme, /Prefab Editor/);
  assert.match(readme, /City Layout/);
  assert.match(readme, /haozhou-city-prefabs\\.example\\.json/);
  assert.match(readme, /legacy entities import/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/city-map-building-editor.test.cjs
```

Expected:

- `FAIL`
- The README still describes the old blended entity workflow

- [ ] **Step 3: Write minimal implementation**

```md
## Prefab Editor

Use `Prefab Editor` to adjust reusable city-stage entity body data:

- image path and dimensions
- scale
- `offsetX / offsetY`
- footprint size
- label bounds
- hit area

## City Layout

Use `City Layout` to place prefab instances into one city:

- choose `prefabId`
- move `gridX / gridY`
- edit instance render metadata only

## Legacy Import

Older layouts that still contain `entities` are converted on load into a prefab library plus city instances.
```

- [ ] **Step 4: Run full verification**

Run:

```bash
npm run lint:plans
node --test tests/city-map-building-editor.test.cjs
npm run typecheck
npm run build
```

Expected:

- `PASS`
- No remaining test failures
- TypeScript and build stay green after the data-model split

- [ ] **Step 5: Commit**

```bash
git add \
  docs/superpowers/plans/2026-07-21-city-prefab-layout.md \
  tools/city-map-building-editor/README.md \
  tests/city-map-building-editor.test.cjs
git commit -m "docs: document prefab-first city editor workflow"
```

## Exit Check

- [ ] `prefabs.json`-style reusable entity definitions exist and are wired into the example city flow.
- [ ] The standalone editor exposes separate `Prefab` and `City Layout` authoring levels.
- [ ] Legacy `entities` layouts remain importable through explicit conversion.
- [ ] Runtime rendering composes instance placement with prefab body data.
- [ ] Final verification commands pass and are recorded in the plan log.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `none`
- Parent Task: `none`
- Parent Stage: `none`
- Closeout Status: `open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `choose-execution-mode`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-21-city-prefab-layout.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then return to this feature plan and start Task 1.`
