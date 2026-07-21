Task 2 Report: Split The Editor Into Prefab And City Layout Modes

Date: 2026-07-21
Base commit: c4e2945

Scope
- Modified `tools/city-map-building-editor/index.html`
- Modified `tests/city-map-building-editor.test.cjs`

Task 2 implementation summary
- Split the editor into authoritative source-state levels:
  - `state.prefabLibrary`
  - `state.cityLayout`
- Kept `state.layout.entities` as a recomposed view-model for canvas/listing/selection only.
- Added separate prefab and city-layout property panels with an editor-mode toggle.
- Kept prefab-owned truth in the prefab library:
  - category
  - entry binding
  - image path / natural size / scale / anchor / offsets
  - footprint cols / rows
  - clickable / label / hit-area fields
- Kept city-layout-owned truth in the city layout:
  - instance id
  - placement
  - visible / locked / z-index metadata
- Added split exports:
  - `exportPrefabLibraryJson()`
  - `exportCityLayoutJson()`
- Preserved runtime composition through one composed entity-like model for rendering.
- Preserved migration support for legacy `entities` layouts.

Earlier review fix pass
- Fixed `renderCityLayoutPanel(...)` to resolve the selected instance's prefab/composed entity explicitly before reading footprint values.
- Fixed `uploadEntityImage(...)` to resolve the selected prefab explicitly before mutating prefab-owned asset fields.
- Fixed `updateCityLayoutFromForm(...)` to clamp authoritative source instance coordinates before recomposition/export.
- Added VM-based behavior tests for:
  - city-layout panel render path
  - prefab image upload path
  - source-instance clamp/export consistency

Final fix pass
- Added prefab-only import support:
  - standalone prefab-library JSON (`{ "prefabs": [...] }`) now imports into `state.prefabLibrary`
  - existing `state.cityLayout` is preserved during prefab-only import
- Fixed stale prefab selection behavior:
  - `selectPrefab()` now clears `selectedInstanceId` / `selectedId` when the selected prefab has no matching instance
  - prefab-mode image uploads now resolve from `selectedPrefabId` first instead of a stale selected instance
- Added behavior tests for:
  - importing a prefab-library JSON while preserving city layout
  - selecting and editing a prefab with no matching instance

Focused verification
- Red step after adding the final tests:
  - `node --test tests/city-map-building-editor.test.cjs`
  - Result: 12 passed, 2 failed
  - Failures matched the reported issues:
    - prefab-only import left the existing prefab library in place
    - selecting a prefab without an instance left stale instance selection behind
- Green step after the final fixes:
  - `node --test tests/city-map-building-editor.test.cjs`
  - Result: 14 passed, 0 failed

Notes
- The embedded Git binary from GitHub Desktop was used because `git` was not on `PATH` in this shell.
- Unrelated dirty worktree files were left untouched.
