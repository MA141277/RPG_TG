# Runtime Dispatch Effect Settlement Contract Removal Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `runtime-dispatch.ts`'s direct dependency on `src/core/contracts/effect-settlement.ts` so the remaining effect-settlement compatibility contract is owned only by the adapter layer and its tests.

**Architecture:** The previous child already lowered `runtime-dispatch` off `settleRuntimeEffects(...)` and onto `settleRuntimeCommands(...)`. The remaining dependency is now type-level only: `runtime-dispatch.ts` still imports `EffectSettlementInput` / `EffectSettlementResult` from the compatibility contract file. This child keeps scope narrow by introducing dispatch-local compatibility input/result typing, preserving runtime behavior and diagnostics, and leaving the lower-level adapter plus its dedicated tests untouched.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `runtime-dispatch.ts no longer imports src/core/contracts/effect-settlement.ts and now derives its local compatibility typing from settleRuntimeCommands(...) plus mapCommandSettlementToEffects(...).`
- Next Step: `Commit/push this child, then continue shrinking the remaining lower-level effect-settlement adapter seam beneath runtime-dispatch.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 449/449; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child intentionally leaves src/core/contracts/effect-settlement.ts and settleRuntimeEffects(...) alive for the lower-level adapter and its dedicated tests. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next lower-level runtime-only child after runtime-dispatch command-settlement lowering. Audit found settleRuntimeEffects(...) is now only used by runtime-settlement itself and runtime-settlement-content tests, while runtime-dispatch still depends on the effect-settlement contract file for local helper typing.`
  - Verification: `rg -n "settleRuntimeEffects\\(" src tests --glob '!docs/**'`; `rg -n "EffectSettlement(Input|Result)|effect-settlement" src/core tests --glob '!docs/**'`; `sed -n '1,220p' src/core/contracts/effect-settlement.ts`; `sed -n '1,260p' src/core/runtime/runtime-dispatch.ts`.`
  - Next: `Add RED coverage that keeps runtime-dispatch off the effect-settlement contract file.`
- 2026-07-30
  - Summary: `Added a RED robustness guard for the contract import, then completed the child by replacing runtime-dispatch's EffectSettlementInput / EffectSettlementResult dependency with dispatch-local types derived from settleRuntimeCommands(...) and mapCommandSettlementToEffects(...), keeping behavior unchanged while confining the compat contract to the lower-level adapter seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 449/449; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then continue shrinking the remaining lower-level effect-settlement adapter seam beneath runtime-dispatch.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-dispatch-command-settlement-direct-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `5b7b8f1`, which lowered `runtime-dispatch` to command settlement directly.
  - Audit now shows `settleRuntimeEffects(...)` is only used by `src/core/runtime/runtime-settlement.ts` and `tests/runtime-settlement-content.test.cjs`.
  - `runtime-dispatch.ts` still imports `EffectSettlementInput` / `EffectSettlementResult` from `src/core/contracts/effect-settlement.ts`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- remove `runtime-dispatch.ts` import usage of `src/core/contracts/effect-settlement.ts`
- keep dispatch-local effect compatibility typing narrow and behavior-preserving
- preserve current routed/task settlement behavior and diagnostics
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- deleting `src/core/contracts/effect-settlement.ts`
- deleting `settleRuntimeEffects(...)`
- changing `tests/runtime-settlement-content.test.cjs` away from the lower-level adapter
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/runtime-dispatch.ts`
  - Replace `EffectSettlementInput` / `EffectSettlementResult` contract imports with dispatch-local compatibility typing.
- `tests/robustness.test.cjs`
  - Guard that `runtime-dispatch.ts` no longer imports the effect-settlement contract file.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-dispatch-effect-settlement-contract-removal-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `runtime-dispatch.ts` no longer imports `src/core/contracts/effect-settlement.ts`
  - dispatch-facing routed/task settlement behavior remains unchanged
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Contract-Level Dependency

**Files:**
- Read: `src/core/contracts/effect-settlement.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-dispatch-effect-settlement-contract-removal-plan.md`

- [x] **Step 1: Record the remaining contract-level dependency**

Document that `runtime-dispatch.ts` is already command-settlement-direct but still imports the effect-settlement compatibility contract.

- [x] **Step 2: Lock the child boundary**

Document that this child removes only the dispatch-level contract dependency, not the lower-level adapter or its dedicated tests.

## Task 2: Add RED Coverage For Contract Removal

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing contract-removal guard**

Cover:

- `runtime-dispatch.ts` no longer imports `../contracts/effect-settlement`
- dispatch still depends on `settleRuntimeCommands(...)`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch effect settlement contract removal"
```

Expected:

- the new guard fails before implementation

## Task 3: Remove runtime-dispatch From The Compat Contract

**Files:**
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-dispatch-effect-settlement-contract-removal-plan.md`

- [x] **Step 1: Replace contract imports with local dispatch typing**

Keep behavior unchanged and do not widen the effect-settlement contract back into dispatch.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `runtime-dispatch.ts` no longer imports `src/core/contracts/effect-settlement.ts`.
- [x] Dispatch-facing routed/task settlement behavior remains unchanged.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Dispatch Effect Settlement Contract Removal`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `not-started`
- Next Required Action: `commit-push-runtime-dispatch-effect-settlement-contract-removal`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-dispatch-effect-settlement-contract-removal-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, continue from the remaining lower-level effect-settlement adapter seam below runtime-dispatch and keep the cleanup runtime-only.`
