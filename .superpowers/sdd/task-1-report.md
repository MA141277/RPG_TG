# Task 1 Report

Status: DONE_WITH_CONCERNS

## Summary
- Converged the Script Editor settlement domain shape to settlement-level `nextEventId` plus executable typed `contents` rows.
- Added typed person custom-attribute records and helper support for explicit `number` attributes, including numeric value preservation.
- Kept event as the only routing owner; no resolver, selector, or intermediate routing layer was introduced.
- Updated settlement follow-up validation to read settlement-level `nextEventId`.
- Updated `docs/change-log.md` for the settlement domain/runtime validation shape change.

## TDD Evidence
- Red: `node --test tests\robustness.test.cjs --test-name-pattern "settlement|person custom attribute"` failed with missing `updateScriptEditorSettlementContentField` and missing typed person attribute fields.
- Green: same focused command passed with 512 passing, 0 failing, 176 skipped.

## Verification
- `npm.cmd run build:test`: passed.
- `node --test tests\robustness.test.cjs --test-name-pattern "settlement|person custom attribute"`: passed, 512 passing, 0 failing, 176 skipped.
- `npm.cmd run build`: passed.
- `npm.cmd test`: failed on existing unrelated `script editor city profile UI exposes mounted building and npc controls`; failure expects `appendScriptEditorCityMountedBuildingNpc(city, buildingIndex, nextNpcId)` in `src/ui/main-ui/main-ui-flow.js`.

## Concerns
- Full suite is not green because of the unrelated city-building source-pattern assertion above.
- `src/ui/main-ui/main-ui-flow.js` still has legacy settlement-result authoring UI text/import names; compatibility exports now delegate those old names to the new content/settlement-level helpers without recreating `results`, because this task is not the full settlement UI rollout.

## Fix Wave 1

### Summary
- Added a regression proving legacy settlement `description` and `results` input fields are stripped by `normalizeScriptEditorSettlementRecord()`.
- Replaced the settlement normalizer spread return with a clean minimal settlement object.

### TDD Evidence
- Red: `node --test tests\robustness.test.cjs --test-name-pattern "settlement|person custom attribute"` failed before rebuilding/fixing with `true !== false` on the legacy `description` leakage assertion.
- Green: after the normalizer fix and `npm.cmd run build:test`, the same focused command passed with 512 passing, 0 failing, 176 skipped.

### Verification
- `npm.cmd run build:test`: passed.
- `node --test tests\robustness.test.cjs --test-name-pattern "settlement|person custom attribute"`: passed, 512 passing, 0 failing, 176 skipped.

## Fix Wave 2

### Summary
- Renamed the task-local inventory constants so the classification matches the task brief:
  - residue candidates still present before cleanup:
    - `baseAttributes.security`
    - `baseAttributes.level`
    - `baseAttributes.outputMultiplier`
    - `baseAttributes.damaged`
    - `population?: number`
  - canonical runtime fields also present:
    - `danger`
    - `level`
    - `outputMultiplier`
    - `damaged`
- Updated the guard comment and grouped the assertion loops around those two classifications without changing the underlying inventory behavior.
- Commit subject recorded for this fix wave: `test: clarify task 1 inventory guard classification`

### Verification
- Executed: `node --test tests/robustness.test.cjs --test-name-pattern "legacy cutover inventory separates canonical keep fields from residue candidates"`
- Result: passed with exit code `0`; in this environment the run still executed the full `tests/robustness.test.cjs` file and finished with `559` passing, `0` failing, and `176` skipped.
