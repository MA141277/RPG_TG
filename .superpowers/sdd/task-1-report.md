# Task 1 Report: Shared Primary Actor Roster Helper

Status: DONE

## Summary

Implemented `orderHouseStandbyRoster` in `src/application/house/house-primary-actor-roster.ts` and added the requested robustness tests in `tests/robustness.test.cjs`.

The helper:

- Deduplicates standby actors by `characterId`, preserving the first model for each actor.
- Moves the first matching `primaryCharacterId` actor to the front.
- Leaves roster order unchanged when `primaryCharacterId` is `null` or missing from the deduplicated roster.

## TDD Evidence

RED:

- Added the two requested tests before creating the helper.
- Ran `npm run build:test`: exited 0.
- Ran `node --test tests/robustness.test.cjs --test-name-pattern "primary house actor roster helper"`: exited 1 with `MODULE_NOT_FOUND` for `../.test-dist/application/house/house-primary-actor-roster.js`, the expected missing-helper failure.

GREEN:

- Created `src/application/house/house-primary-actor-roster.ts` with the requested function.
- Ran `npm run build:test`: exited 0.
- Ran `node --test tests/robustness.test.cjs --test-name-pattern "primary house actor roster helper"`: exited 0; the two helper tests passed.

## Commit

- `b9bd39b6 test: add house primary actor roster helper`

## Scope Control

Committed only:

- `src/application/house/house-primary-actor-roster.ts`
- `tests/robustness.test.cjs`

The repository had unrelated uncommitted changes before this task; they were not reverted, staged, or committed.

## Concerns

None.
