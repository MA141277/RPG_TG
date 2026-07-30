# Task 2 Report: Default Dialogue Runtime Reducer

## Status

DONE

## Summary

- Added the pure city-begging default-dialogue reducer/state module.
- Added immutable state transitions for default launch, location selection, option selection, and thinking advancement.
- Added city-begging launch support for `payload.mode === "default-dialogue"` while preserving legacy minigame launch as the default.
- Kept action routing and settlement out of scope for Task 3.

## Files Changed

- `tests/city-begging-default-runtime.test.cjs`
- `src/application/playables/city-begging/city-begging-default-dialogue.ts`
- `src/domain/city-begging-minigame.ts`
- `src/application/playables/city-begging/city-begging-definition.ts`
- `src/application/app-shell.ts`
- `src/core/runtime/playable-runtime.ts`

## TDD Evidence

Red check:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs }
```

Expected failure observed:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'D:\RPG_TG\src\application\playables\city-begging\city-begging-default-dialogue.ts'
```

Additional launch payload red check:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
+ undefined
- 'default-dialogue'
```

## Verification

Targeted command:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
```

Result:

```text
tests 6
pass 6
fail 0
```

## Notes

- The reducer test uses the repo's established `.test-dist` import pattern after `build:test`; the initial direct `.ts` import red check proved the module was missing but conflicted with TypeScript emit for extensioned source dependencies.
- No `src/main.ts` changes were made.
- No Task 3 action routing or settlement behavior was implemented.

## Review Fixes

- Guarded `selectCityBeggingDefaultOption()` so option selection only applies from `phase === "encounter"` when a location is selected and no option/fixed result is already locked.
- Added a focused reducer regression test covering invalid option selection and duplicate/change attempts after a fixed result is locked.
- Added `docs/change-log.md` entry for the Task 2 default dialogue runtime/session wiring and result-lock behavior.

## Review Fix TDD Evidence

Red check:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
```

Expected failure observed:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be reference-equal to "expected":
...
+   thinkingUntil: 3700
-   thinkingUntil: 3600
```

Green check:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
```

Result:

```text
tests 7
pass 7
fail 0
```

## Second Review Fixes

- Guarded `selectCityBeggingDefaultLocation()` so location selection only applies from the initial `location-select` phase before any location, option, or fixed result is locked.
- Added focused regression coverage proving location reselection after a fixed option result returns the same state and cannot clear `selectedOptionId`, `fixedResult`, `thinkingUntil`, or `settlementApplied`.

Second review-fix red check:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
```

Expected failure observed:

```text
city begging default dialogue does not clear a locked result by reselecting location
AssertionError [ERR_ASSERTION]: Expected "actual" to be reference-equal to "expected"
actual fixedResult: null
expected fixedResult: 'ji'
```

Second review-fix green check:

```text
npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/city-begging-default-runtime.test.cjs tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs }
```

Result:

```text
tests 8
pass 8
fail 0
```
