# Task 2 Report: Add The City Button And HUD/Overlay Contracts

## Status

DONE_WITH_CONCERNS

## Implemented

- Added the Haozhou city test button in `src/ui/views/city/city-view.ts`.
- The button is permanently rendered in the city page and exposes `data-action="grant-haozhou-test-coin"`.
- Added `goldTextOverride?: string | null` to `GlobalPlayerPanelModel` in `src/ui/panels/global-player-panel.ts`.
- Added `resolvedGoldText = model.goldTextOverride ?? \`银两 ${model.goldText}\`` in the HUD render path.
- Added `data-ui-gold-target` on the HUD gold target wrapper.
- Added `data-ui-gold-value` on the HUD gold numeric text node.
- Added the global coin reward layer mount point in `src/ui/app-render.ts`:
  `<div class="p-ui-coin-reward-layer" data-ui-coin-reward-layer aria-hidden="true"></div>`.
- Added the requested source-contract test in `tests/haozhou-city-coin-reward-source.test.cjs`.

No runtime action handling, state mutation wiring, or animator implementation was added.

## TDD RED Evidence

Added `tests/haozhou-city-coin-reward-source.test.cjs` with the exact assertions from the task brief.

Initial task command:

```powershell
node --test tests\haozhou-city-coin-reward-source.test.cjs
```

Result: could not run because `node` is not on this PowerShell PATH.

Bundled Node default test runner:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\haozhou-city-coin-reward-source.test.cjs
```

Result: failed before assertions with `Error: spawn EPERM`.

Sandbox-compatible RED run:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests\haozhou-city-coin-reward-source.test.cjs
```

Result: failed as expected on missing `data-action="grant-haozhou-test-coin"`.

## TDD GREEN Evidence

After minimal implementation, reran:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --test-isolation=none tests\haozhou-city-coin-reward-source.test.cjs
```

Result:

```text
✔ city view and hud expose the coin reward animation anchors (2.1893ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 14.9598
```

## Additional Verification

TypeScript check:

```powershell
& 'C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
```

Result: exit code 0, no diagnostics.

## Files Changed

- `src/ui/views/city/city-view.ts`
- `src/ui/panels/global-player-panel.ts`
- `src/ui/app-render.ts`
- `tests/haozhou-city-coin-reward-source.test.cjs`
- `.superpowers/sdd/task-2-report.md`

## Self-Review Notes

- Scope stayed limited to UI/source contracts.
- The city button only emits the requested action attribute; no handler was implemented.
- HUD override is optional and preserves existing text when unset.
- The app shell layer is a passive mount point only.
- No `main.ts` changes were made.
- No gameplay state mutation or persistent data wiring was added.

## Git / Commit

Attempted:

```powershell
git add tests/haozhou-city-coin-reward-source.test.cjs src/ui/views/city/city-view.ts src/ui/panels/global-player-panel.ts src/ui/app-render.ts
```

Result:

```text
fatal: Unable to create 'D:/GitHub克隆文件/RPG_TG/RPG_TG/.git/index.lock': Permission denied
```

No commit was created because git index writes are blocked in this environment.

## Concerns

- The exact requested `node --test ...` command cannot run from the current PATH because `node` is not available there.
- The bundled Node default test runner cannot spawn child test processes in this sandbox (`spawn EPERM`), so RED/GREEN evidence used `--test-isolation=none`.
- Git staging/commit is blocked by `.git/index.lock` permission denial, as anticipated in the task brief.
