# Task 4 Report: Integrate Runtime Action, State Update, And HUD Rolling Value

## Implemented

- Added a focused source regression in `tests/robustness.test.cjs` for the Haozhou test coin button action path.
- Imported and used `applyCoinReward` in `src/main.ts` for the real persistent gold update.
- Imported and used `createCoinRewardAnimator` in `src/main.ts`.
- Added `coinRewardDisplayValue: number | null` as a runtime-local variable in `src/main.ts`, kept outside persistent `AppState`.
- Added a lazy `coinRewardAnimator` wrapper in `src/main.ts` so the animator binds only after the rendered `[data-ui-coin-reward-layer]` exists.
- Added `syncCoinRewardAnimatorTarget()` after render replacement so the animator can target the current `[data-ui-gold-target]`.
- Added click handling for `[data-action='grant-haozhou-test-coin']`:
  - reads the player character before mutation,
  - applies `applyCoinReward(appState, currentPlayerCharacterId, 10)`,
  - starts `coinRewardAnimator.play(...)`,
  - renders and returns.
- Added `coinRewardDisplayValue?: number | null` to `AppRenderInput` in `src/ui/app-render.ts`.
- Threaded the runtime-local display value from `main.ts` into `renderAppMarkup`.
- Converted `coinRewardDisplayValue` into the existing `goldTextOverride` field by replacing the numeric prefix of the panel model's existing `goldText`, avoiding a new currency literal and avoiding persistent UI state coupling.

## TDD Evidence

### RED

Required command attempted:

```powershell
node --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"
```

Result: could not execute because `node` is not on PATH in this shell.

Equivalent explicit Node command attempted:

```powershell
& 'C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe' --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"
```

Result: failed before test execution with `spawn EPERM`. Escalation was requested and rejected by the approval service, so the exact `node --test` RED run could not complete in this environment.

Focused in-process source assertion used as RED fallback before production edits:

```powershell
& 'C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe' -e "const fs=require('node:fs'); const assert=require('node:assert/strict'); const mainSource=fs.readFileSync('src/main.ts','utf8'); assert.match(mainSource, /\[data-action='grant-haozhou-test-coin'\]/); assert.match(mainSource, /applyCoinReward\(appState,\s*currentPlayerCharacterId,\s*10\)/); assert.match(mainSource, /coinRewardAnimator\.play\(/);"
```

Result: failed as expected on the first missing selector assertion:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /\[data-action='grant-haozhou-test-coin'\]/.
```

### GREEN

Focused in-process source assertion rerun after implementation:

```powershell
& 'C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe' -e "const fs=require('node:fs'); const assert=require('node:assert/strict'); const mainSource=fs.readFileSync('src/main.ts','utf8'); assert.match(mainSource, /\[data-action='grant-haozhou-test-coin'\]/); assert.match(mainSource, /applyCoinReward\(appState,\s*currentPlayerCharacterId,\s*10\)/); assert.match(mainSource, /coinRewardAnimator\.play\(/);"
```

Result: passed with exit code 0.

Required command attempted again after implementation:

```powershell
& 'C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe' --test tests/robustness.test.cjs --test-name-pattern "haozhou test button grants 10 gold and starts reward animation"
```

Result: still failed before test execution with `spawn EPERM`, so this remains an environment concern rather than a test assertion failure.

## Verification Commands

```powershell
& 'C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe' 'node_modules\typescript\bin\tsc' --noEmit -p tsconfig.json
```

Result: passed with exit code 0.

```powershell
git diff --check -- src/main.ts src/ui/app-render.ts tests/robustness.test.cjs
```

Result: passed with exit code 0. Git reported only LF-to-CRLF working-copy warnings.

## Files Changed

- `src/main.ts`
- `src/ui/app-render.ts`
- `tests/robustness.test.cjs`
- `.superpowers/sdd/task-4-report.md`

## Self-Review Notes

- `coinRewardDisplayValue` is runtime-local in `main.ts` and is not stored in `AppState`.
- The real gold mutation flows through `applyCoinReward`.
- The animator is lazy-created because the reward layer is rendered by `renderAppMarkup`; creating it before first render would risk a missing-layer startup failure.
- The implementation uses the existing global HUD `goldTextOverride` surface instead of widening domain state.
- The app renderer reuses the existing `goldText` suffix by replacing only the leading numeric value, avoiding a new non-ASCII currency literal in this task.
- The implementation does not attempt the full four-stage visual effect.

## Concerns

- `node` and `npm` are not on PATH in this shell; verification used `C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe`.
- `node --test` fails with `spawn EPERM` before loading `tests/robustness.test.cjs`; the exact requested named test command could not produce RED/GREEN assertion output in this environment.
- Escalation for the `node --test` spawn was rejected by the approval service.
- The working tree already contains many unrelated uncommitted changes from earlier tasks; this task only modified the files listed above.
