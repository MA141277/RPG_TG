# Task 1 Report: Lock The Unit Registry Contract With A Failing Test

## Scope

- Task brief: `.superpowers/sdd/task-1-brief.md`
- Owned implementation files:
  - `tests/spine-unit-context.test.cjs`
  - `tools/spine-node-timeline-editor.html`

## TDD Record

### RED

Added `tests/spine-unit-context.test.cjs` first, using the exact source-level assertions from the task brief.

Command:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'tests\spine-unit-context.test.cjs'
```

Observed result:

```text
✖ Spine editor defines a unit registry for swordsman and archer
✖ Spine editor switches unit context only after a project load succeeds
✖ Spine editor gates swordsman and archer feature groups by unit context
ℹ pass 0
ℹ fail 3
```

Failure reason matched the brief:

- `SPINE_UNIT_CONFIGS` did not exist
- `switchSpineUnitContext(unitType)` did not exist
- `swordsmanFeatureGroup` / `archerFeatureGroup` markers did not exist

### GREEN

Added the minimum runtime skeleton in `tools/spine-node-timeline-editor.html`:

- `const SPINE_UNIT_CONFIGS = { swordsman, archer }`
- `state.currentUnitType`
- `getSpineUnitConfig(unitType)`
- `renderSpineUnitFeatureGroups()`
- `async function switchSpineUnitContext(unitType)`
- top-level feature-group marker nodes:
  - `id="swordsmanFeatureGroup"`
  - `id="archerFeatureGroup"`

Command:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'tests\spine-unit-context.test.cjs'
```

Observed result:

```text
✔ Spine editor defines a unit registry for swordsman and archer
✔ Spine editor switches unit context only after a project load succeeds
✔ Spine editor gates swordsman and archer feature groups by unit context
ℹ pass 3
ℹ fail 0
```

## Implementation Notes

- The task stayed at contract/skeleton level only.
- No selector UI was added.
- `switchSpineUnitContext(unitType)` sets `state.currentUnitType` only after a successful project load and `applyProjectData(project)`.
- The feature-group markers are placeholders for later tasks; they are rendered through `renderSpineUnitFeatureGroups()` but do not yet introduce selector behavior.

## Working Tree Safety

- `tools/spine-node-timeline-editor.html` already had unrelated unstaged modifications before this task.
- I did not revert or overwrite those unrelated edits.
- The task commit should include only the Task 1 unit-context hunks plus the new test file.

## Self-Review

- Verified the new test was written before implementation and observed failing output first.
- Verified the same focused test passes after the minimal implementation.
- Checked that the task did not add selector UI or broader unit-specific behavior beyond the requested skeleton.
- No additional findings for this batch.

## Commit Info

- `50edb2c` `feat: add spine unit context registry`
- `321aeea` `feat: add spine unit context registry skeleton`
- Fresh verification after commits:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs`
  - Result: 3 passed, 0 failed
