# City Layout Auto Place Task 1 Report

## What I Changed

- Added Task 1 TDD coverage in `tests/city-map-building-editor.test.cjs`.
  - Exposed guarded harness accessors for `getMissingEnterablePrefabs` and `autoPlaceMissingEnterableBuildings` so the runtime contract can be asserted without crashing unrelated tests before implementation.
  - Added a UI contract test for the City Layout auto-place button id, label, and function reference.
  - Added a runtime contract test proving only missing enterable prefabs are returned, excluding already placed prefabs and non-enterable prefabs.
- Added the minimal City Layout UI entry contract in `tools/city-map-building-editor/index.html`.
  - Added button id `auto-place-enterable-buildings` with proper Chinese label `一键补齐可进入建筑`.
  - Registered the button in the DOM lookup list.
  - Added `getMissingEnterablePrefabs()` helper.
  - Added no-op `autoPlaceMissingEnterableBuildings()` function.
  - Wired the button click to `autoPlaceMissingEnterableBuildings`.
- Kept the implementation intentionally limited to the entry contract only. No placement logic or status reporting was added.

## Files Changed

- `C:\Users\EDY\Documents\GitHub\RPG_TG\tests\city-map-building-editor.test.cjs`
- `C:\Users\EDY\Documents\GitHub\RPG_TG\tools\city-map-building-editor\index.html`

## TDD Evidence

### RED

Command:

```powershell
node --test tests/city-map-building-editor.test.cjs
```

Observed result:

- Exit code: `1`
- New failure 1: `city layout exposes an auto-place action for missing enterable buildings`
  - Missing `id="auto-place-enterable-buildings"`
- New failure 2: `auto-place only considers missing enterable prefabs once each`
  - `TypeError: api.getMissingEnterablePrefabs is not a function`
- Also present before completion of this task run:
  - `runtime city stage composes prefabs with city instances`
  - Assertion mismatch `11 !== 8`

### GREEN For Task 1 Contract Tests

Command:

```powershell
node --test --test-name-pattern "auto-place" tests/city-map-building-editor.test.cjs
```

Observed result:

```text
✔ city layout exposes an auto-place action for missing enterable buildings
✔ auto-place only considers missing enterable prefabs once each
ℹ tests 2
ℹ pass 2
ℹ fail 0
```

### Full Targeted File Re-run

Command:

```powershell
node --test tests/city-map-building-editor.test.cjs
```

Observed result:

- Exit code: `1`
- Task 1 tests now pass.
- One unrelated pre-existing failure remains:
  - `runtime city stage composes prefabs with city instances`
  - Assertion mismatch `11 !== 8`

## Tests Run

1. `node --test tests/city-map-building-editor.test.cjs`
   - RED confirmed for the new Task 1 tests.
2. `node --test --test-name-pattern "auto-place" tests/city-map-building-editor.test.cjs`
   - GREEN for the new Task 1 contract tests.
3. `node --test tests/city-map-building-editor.test.cjs`
   - New Task 1 tests remain green; unrelated existing failure remains in the file.

## Self-Review

- The helper only inspects prefab enterability and existing placed prefab ids, matching the narrow Task 1 contract.
- The button label stays in proper Chinese to match the editor’s current UI copy conventions.
- No `main.ts` or runtime gameplay wiring was touched.
- No auto-placement behavior was implemented prematurely.

## Concerns

- The targeted test file is not fully green because of an unrelated existing failure:
  - `runtime city stage composes prefabs with city instances`
  - Current observed mismatch: expected `8`, actual `11`
- The owned files already had other in-progress edits in the working tree before this task. I adjusted to the current file state and did not revert unrelated changes.
