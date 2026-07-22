# City Prefab Task 1 Report

## Task

Add runtime prefab composition and example assets for city-stage layout data without rewriting the renderer.

## Commit

- `b6e1c4323af821edf3202d89197b29b10657040e` `feat: compose city stage entities from prefabs`

## What Changed

### Runtime/data layer

- Added `src/ui/views/city/city-stage-layout-data.ts`.
- Introduced the shared runtime types:
  - `CityStagePrefabLibrary`
  - `CityStageLayoutSource`
  - `ComposedCityStageEntity`
- Implemented `composeCityStageLayout(layoutSource, prefabLibrary)`.
- Kept migration compatibility by accepting legacy `layoutSource.entities` and returning composed entities unchanged when old layouts are imported.
- Enforced prefab truth at composition time:
  - prefab library owns `name`, `category`, `entry`, `asset`, `footprint`, and `interaction`
  - city instances contribute only `id`, `prefabId`, `gridX`, `gridY`, and optional `render`

### Runtime adapter wiring

- Updated `src/ui/views/city/city-stage-layout.ts` to:
  - import the prefab example JSON
  - unwrap the new layout source and prefab library
  - compose runtime entities through `composeCityStageLayout(...)`
  - keep the renderer consuming the same composed entity-like model (`layout.entities`)
- Removed duplicated local city-stage type declarations from `city-stage-layout.ts` in favor of the shared data module.

### Example assets

- Added `tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json`.
- Converted `tools/city-map-building-editor/examples/haozhou-city-layout.example.json` from:
  - `version: 1` + `entities`
  - to `version: 2` + `instances`
- Preserved current placements and render metadata in the new instance list.

### Editor/example-loader compatibility

- Updated `tools/city-map-building-editor/index.html` so the example loader fetches both:
  - `examples/haozhou-city-layout.example.json`
  - `examples/haozhou-city-prefabs.example.json`
- Added an editor-only composition helper that maps prefab + instance data back into the existing entity-shaped editor layout so the current editor can still open the split example without a full editor rewrite.

### Tests

- Updated `tests/city-map-building-editor.test.cjs` to verify:
  - prefab library example exists
  - layout example now exposes `instances`
  - runtime references `composeCityStageLayout`
  - runtime/source path contains `prefabId`
  - editor HTML references the prefab example asset path

## Verification

Ran after implementation:

```powershell
node --test tests/city-map-building-editor.test.cjs
npm run typecheck
```

Results:

- `node --test tests/city-map-building-editor.test.cjs`
  - 7 tests passed
  - 0 failed
- `npm run typecheck`
  - passed

## TDD Record

1. Added the failing test from the task brief asserting:
   - prefab example file exists
   - layout uses `instances`
   - runtime references `composeCityStageLayout`
   - HTML references the prefab example path
2. Ran `node --test tests/city-map-building-editor.test.cjs`.
3. Observed the expected red failure:
   - missing `haozhou-city-prefabs.example.json`
4. Implemented the runtime/data split and example asset migration.
5. Re-ran the focused test and fixed the remaining loader/source-path seam until green.
6. Re-ran focused verification and typecheck after the last patch.

## Self-Review

### Findings

- No blocking issues found in the committed task scope.

### Residual risks

- `tools/city-map-building-editor/index.html` now contains an editor-only adapter that composes prefab + instance data back into `entities`. This is intentionally transitional and should be replaced by native prefab-aware editor state in later tasks.
- `randomPools` remain structurally untouched in the example layout. Task 1 did not change their semantics because the runtime prefab composition path does not consume them.

## Worktree Notes

- Left unrelated existing worktree changes untouched:
  - `tools/city-map-building-editor/README.md`
  - untracked planning/brief files outside the committed task implementation

## Review Fix Follow-Up

### Issue addressed

- The split-example compatibility path in `tools/city-map-building-editor/index.html` still allowed mutation/export behavior against composed entity state even though prefab-owned truth must remain read-only.

### Fixes applied

- Removed the leftover prefab quick-edit UI/functions from the editor page instead of preserving a prefab-mutation surface.
- Removed the leftover prefab-preview CSS after restoring the editor file text so no dead prefab-edit affordance remains in the shipped page.
- Changed `loadHaozhouExample()` + `setEditorLayout(...)` so the split example is loaded with explicit read-only compatibility state.
- Wired `guardReadOnlyPrefabExample()` into the relevant mutating paths:
  - map/grid form updates
  - optional mask / forbidden polygons / random pools JSON updates
  - entity form updates
  - add / duplicate / delete
  - drag / board placement
  - image upload
  - export / copy
  - snap toggle
- Disabled mutating controls while the split example is active so the compatibility mode is visibly read-only as well as behaviorally guarded.
- Changed `syncLayoutJsonPreview()` so the split example no longer previews raw exported entity JSON; it now shows a read-only compatibility message instead.

### Test coverage additions

- Strengthened `tests/city-map-building-editor.test.cjs` to assert more direct Task 1 behavior:
  - `composeCityStageLayout(...)` output composes prefab + instance data correctly
  - legacy `entities` fallback remains importable during migration
  - the editor HTML no longer exposes prefab quick-edit identifiers/functions
  - the editor HTML guards drag/export/copy/read-only preview paths for the split example

### Verification rerun

Ran after the review fix:

```powershell
node --test tests/city-map-building-editor.test.cjs
npm run typecheck
```

Results:

- `node --test tests/city-map-building-editor.test.cjs`
  - 8 tests passed
  - 0 failed
- `npm run typecheck`
  - passed

## Controller Fix After Review

- Review required one additional fix pass because the split prefab example compatibility path still allowed mutations and export of composed entity-shaped data.
- Tightened the read-only guard flow in `tools/city-map-building-editor/index.html` so the loaded split example stays preview-only for mutation/export paths while preserving the rest of the editor worktree changes.
- Kept the stronger Task 1 tests that verify:
  - direct `composeCityStageLayout(...)` behavior
  - legacy `entities` fallback behavior
  - read-only protection around the split example loader path

### Fix Verification

```powershell
node --test tests/city-map-building-editor.test.cjs
npm run typecheck
```

Results:

- `node --test tests/city-map-building-editor.test.cjs` passed (8/8)
- `npm run typecheck` passed
