Task 2 Report: Split The Editor Into Prefab And City Layout Modes

Date: 2026-07-21
Base commit: c4e2945

Scope
- Modified `tools/city-map-building-editor/index.html`
- Modified `tests/city-map-building-editor.test.cjs`

Implementation summary
- Added an explicit editor mode toggle with separate `Prefab Editor` and `City Layout` property panels.
- Introduced authoritative split source state in the editor:
  - `state.prefabLibrary`
  - `state.cityLayout`
- Kept `state.layout.entities` as a composed editor view-model only, rebuilt from `composeEditorEntities(prefabLibrary, cityLayout)`.
- Added export helpers:
  - `exportPrefabLibraryJson()`
  - `exportCityLayoutJson()`
- Updated copy/export preview flows to emit split source JSON instead of composed entity JSON.
- Updated import/migration handling so legacy `entities` layouts remain decomposable into prefab + instance source data during editor import.
- Reworked editor mutation flows so:
  - prefab form writes only to `state.prefabLibrary`
  - city-layout form writes only to `state.cityLayout`
  - canvas placement/render updates sync back into source state and then recompose the editor view
- Preserved runtime/editor composition support for split prefab + instance data.

Behavioral changes
- Prefab mode owns prefab truth:
  - category
  - entry binding
  - image path / natural size / scale / anchor / offset
  - footprint cols / rows
  - clickable / label / hit-area fields
- City Layout mode owns instance truth:
  - instance id
  - prefab id readout
  - grid placement
  - visible / locked / z-index metadata
- City Layout mode no longer exposes per-instance asset, interaction, or footprint override fields.

Tests
- Added/updated focused editor tests to cover:
  - split prefab/layout editing entry points
  - split source normalization/composition presence
  - continued migration import support
- Verification command:
  - `node --test tests/city-map-building-editor.test.cjs`
- Result:
  - 9 tests passed, 0 failed

Self-review
- Checked that split exports now serialize source-authoritative prefab/layout JSON rather than composed entities.
- Checked that legacy import still has a decomposition path through `setEditorLayout(...)`.
- Checked that source mutations recompose the legacy canvas/listing view instead of treating composed entities as the write target.

Notes
- The embedded Git binary from GitHub Desktop was used because `git` was not on `PATH` in this shell.
- Browser-level/manual interaction checks were not run in this task; verification stayed on the requested focused Node test path.

Review follow-up: 2026-07-21

Scope
- Fixed `renderCityLayoutPanel(...)` to resolve the selected instance's prefab/composed entity explicitly before reading footprint values, eliminating the undefined `entity` runtime error in City Layout mode.
- Fixed `uploadEntityImage(...)` to resolve the selected prefab explicitly before mutating prefab-owned asset fields, eliminating the undefined `prefab` runtime error.
- Fixed `updateCityLayoutFromForm(...)` to clamp the authoritative `state.cityLayout.instances[*].gridX/gridY` values before recomposition so exported layout JSON matches the rendered/canvas layout.

Test coverage addendum
- Added a VM-based editor runtime harness in `tests/city-map-building-editor.test.cjs`.
- Added behavior-level tests for:
  - city-layout panel rendering without runtime reference errors
  - prefab image upload updating prefab-owned asset state
  - city-layout form clamping source instance coordinates before export

Verification
- Red step:
  - `node --test tests/city-map-building-editor.test.cjs`
  - Result: 9 passed, 3 failed
  - Failures matched the reported regressions: undefined `entity`, undefined `prefab`, unclamped exported source coordinates
- Green step / focused verification:
  - `node --test tests/city-map-building-editor.test.cjs`
  - Result: 12 passed, 0 failed
