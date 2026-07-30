# Runtime Settlement applyEffects Wrapper Removal Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the unused core `applyEffects(...)` wrapper from `runtime-settlement.ts` so the remaining effect-settlement compatibility surface shrinks to the actual runtime-dispatch adapter seam.

**Architecture:** The branch already converged runtime settlement payloads on `commands`, removed runtime-flow settlement-effects fallback, and removed runtime-result settlement-effects metadata. Audit now shows the exported `applyEffects(...)` wrapper in `src/core/runtime/runtime-settlement.ts` has no production or test callers. This child removes that dead wrapper, tightens robustness coverage so the module only exposes the lower-level adapter entrypoints that still matter, and leaves `settleRuntimeEffects(...)` itself intact for `runtime-dispatch` and its focused compatibility tests.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused robustness/runtime tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 1 through Task 3 are complete locally. runtime-settlement.ts no longer exports the dead applyEffects(...) wrapper, the now-unused RuntimeState import is gone, and settleRuntimeEffects(...) remains the only live effect-settlement adapter entrypoint in that module.`
- Next Step: `Commit and push this child checkpoint, then choose whether the next adjacent runtime-only cleanup should target runtime-dispatch's direct settleRuntimeEffects(...) dependency or stop the current compatibility cleanup batch here.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 447/447; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child intentionally does not remove settleRuntimeEffects(...) itself, and does not change runtime-dispatch effect-settlement ownership. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next adjacent runtime-only child after runtime settlement contract removal. Audit found the exported core applyEffects(...) wrapper in runtime-settlement.ts is now unused by production code and tests, while settleRuntimeEffects(...) still remains in use by runtime-dispatch and lower-level compatibility tests.`
  - Verification: `rg -n "\\bRuntimeState\\b|export function applyEffects\\(" src/core/runtime/runtime-settlement.ts`; `rg -n "from \\"\\.\\/runtime-settlement\\"|from '../runtime/runtime-settlement'|from \\"../runtime-settlement\\"" src tests | rg "applyEffects|runtime-settlement"`.`
  - Next: `Add RED coverage that forbids the dead wrapper export.`
- 2026-07-30
  - Summary: `Completed Task 1 audit and Task 2 RED coverage. The child boundary stayed fixed on the dead wrapper only, and the new robustness guard required runtime-settlement.ts to stop exporting applyEffects(...) while keeping settleRuntimeEffects(...) and settleRuntimeCommands(...) intact.`
  - Verification: `rg -n "\\bRuntimeState\\b|export function applyEffects\\(" src/core/runtime/runtime-settlement.ts`; `rg -n "from \\"\\.\\/runtime-settlement\\"|from '../runtime/runtime-settlement'|from \\"../runtime-settlement\\"" src tests | rg "applyEffects|runtime-settlement"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement applyEffects wrapper removal"` failed at the new dead-wrapper assertion before implementation.`
  - Next: `Remove the dead wrapper and rerun the targeted GREEN verification set.`
- 2026-07-30
  - Summary: `Completed Task 3. runtime-settlement.ts no longer exports applyEffects(...), the now-unused RuntimeState import is gone, and the module now exposes only the live settlement adapter entrypoints plus settlement content helpers.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 447/447; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push this wrapper-removal checkpoint, then choose the next adjacent runtime-only compatibility cleanup.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-playable-settlement-effects-compat-optional-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-contract-removal-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `07b1e8b`, which removed runtime settlement effects from runtime-result contract/summaries.
  - Audit now shows the exported `applyEffects(...)` wrapper in runtime-settlement.ts is dead, while `settleRuntimeEffects(...)` still remains used by runtime-dispatch.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- remove the unused core `applyEffects(...)` export from `runtime-settlement.ts`
- remove any now-dead import/type dependency that existed only for that wrapper
- add robustness coverage that forbids the wrapper from coming back
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- removing `settleRuntimeEffects(...)` itself
- changing `runtime-dispatch` effect settlement ownership
- changing lower-level effect-settlement compatibility tests beyond what's needed for the dead wrapper removal
- UI, map, backpack, `src/main.ts`, or style changes

## File Map

### Existing files to modify

- `src/core/runtime/runtime-settlement.ts`
  - Remove the dead `applyEffects(...)` wrapper and any now-unused type import.
- `tests/robustness.test.cjs`
  - Guard that runtime-settlement no longer exports `applyEffects(...)`.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-settlement-apply-effects-wrapper-removal-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - runtime-settlement no longer exports `applyEffects(...)`
  - `settleRuntimeEffects(...)` remains intact for runtime-dispatch compatibility
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Dead Wrapper Scope

**Files:**
- Read: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-apply-effects-wrapper-removal-plan.md`

- [x] **Step 1: Record the dead wrapper seam**

Document that `applyEffects(...)` is now unused and can be removed without changing the live adapter entrypoints.

- [x] **Step 2: Lock the child boundary**

Document that this child stops at wrapper removal and does not remove `settleRuntimeEffects(...)`.

## Task 2: Add RED Coverage For Wrapper Removal

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing wrapper-removal test**

Cover:

- `runtime-settlement.ts` no longer exports `applyEffects(...)`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement applyEffects wrapper removal"
```

Expected:

- the new wrapper-removal assertion fails before implementation

## Task 3: Remove Dead Wrapper And Sync Governance

**Files:**
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-apply-effects-wrapper-removal-plan.md`

- [x] **Step 1: Remove the dead applyEffects wrapper**

Delete the wrapper and any now-unused type import; keep `settleRuntimeEffects(...)` unchanged.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `runtime-settlement.ts` no longer exports `applyEffects(...)`.
- [x] `settleRuntimeEffects(...)` remains available for its remaining live callers.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Settlement applyEffects Wrapper Removal`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-and-push-runtime-settlement-apply-effects-wrapper-removal`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-settlement-apply-effects-wrapper-removal-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Review the verified dead-wrapper removal diff, commit and push it, then choose the next adjacent runtime-only compatibility cleanup child.`
