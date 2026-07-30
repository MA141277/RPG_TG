# Runtime Dispatch Command Settlement Direct Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `runtime-dispatch`'s direct dependency on `settleRuntimeEffects(...)` so covered runtime routing settles through `settleRuntimeCommands(...)` directly while still preserving effect-oriented diagnostics in the dispatch summary.

**Architecture:** The branch already converged runtime settlement payloads on `commands`, removed runtime-flow settlement-effects fallback, removed runtime-result settlement-effects metadata, and deleted the dead core `applyEffects(...)` wrapper. The remaining core direct effect-adapter dependency is `runtime-dispatch`, which still uses `settleRuntimeEffects(...)` for routed effects and task-completion effects. This child keeps scope narrow: reuse the existing effect->command mapping rules from `runtime-settlement`, settle commands directly in `runtime-dispatch`, and reconstruct `settledEffects` / `unsupportedEffects` / warning compatibility diagnostics locally for the runtime settlement summary.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `runtime-dispatch now lowers routed/task effect settlement through settleRuntimeCommands(...) directly while reusing runtime-settlement's effect->command translation helpers for compatibility diagnostics.`
- Next Step: `Commit/push this child, then open the next lower-level runtime-only cleanup beneath the remaining settleRuntimeEffects(...) compatibility adapter.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 448/448; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child intentionally keeps settleRuntimeEffects(...) alive for lower-level compatibility and tests; it only removes runtime-dispatch's direct use of that adapter. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next adjacent runtime-only child after dead wrapper removal. Audit found runtime-dispatch is now the last core runtime path still calling settleRuntimeEffects(...) directly, even though all runtime settlement ownership above it is already command-first.`
  - Verification: `sed -n '1,220p' src/core/runtime/runtime-dispatch.ts`; `sed -n '330,520p' src/core/runtime/runtime-settlement.ts`; `rg -n "settleRuntimeEffects\\(" src/core/runtime src/tests tests --glob '!docs/**'`.`
  - Next: `Add RED coverage that makes runtime-dispatch command-settlement-direct.`
- 2026-07-30
  - Summary: `Added the direct-command RED guard and completed the child by extracting reusable effect->command translation helpers from runtime-settlement, then lowering runtime-dispatch to settle routed/task effects through settleRuntimeCommands(...) directly while rebuilding effect-oriented compatibility diagnostics from command settlement output.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 448/448; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then open the next lower-level runtime-only cleanup beneath the remaining settleRuntimeEffects(...) compatibility adapter.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-contract-removal-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-apply-effects-wrapper-removal-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `c0cd5e2`, which removed the dead runtime-settlement applyEffects wrapper.
  - Audit now shows `runtime-dispatch.ts` is the last core runtime file still directly calling `settleRuntimeEffects(...)`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- stop `runtime-dispatch` from importing/calling `settleRuntimeEffects(...)`
- settle routed and task effects through `settleRuntimeCommands(...)` directly
- preserve current `settledEffects` / `unsupportedEffects` / warnings summary behavior from dispatch-facing tests
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- removing `settleRuntimeEffects(...)` itself
- changing non-runtime callers or lower-level effect-settlement tests to command-only
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/runtime-dispatch.ts`
  - Replace direct effect-settlement adapter calls with command-level settlement plus local compatibility summary mapping.
- `src/core/runtime/runtime-settlement.ts`
  - Expose the smallest reusable effect->command mapping helper needed by dispatch without duplicating translation rules.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Keep dispatch behavior assertions while updating them to reflect direct command-settlement ownership.
- `tests/robustness.test.cjs`
  - Guard that runtime-dispatch no longer imports or calls `settleRuntimeEffects(...)`.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-dispatch-command-settlement-direct-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `runtime-dispatch` no longer imports/calls `settleRuntimeEffects(...)`
  - routed/task effects still mutate runtime state correctly through command settlement
  - runtime settlement summary still reports `settledEffects` / `unsupportedEffects` compat diagnostics
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch command settlement direct|runtime settlement applyEffects wrapper removal|runtime settlement effects contract removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Last Core Direct Effect Adapter Dependency

**Files:**
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-dispatch-command-settlement-direct-plan.md`

- [x] **Step 1: Record the remaining core direct dependency**

Document that `runtime-dispatch` is the last core runtime path still directly calling `settleRuntimeEffects(...)`.

- [x] **Step 2: Lock the child boundary**

Document that this child removes only the dispatch-level direct dependency, not the lower-level adapter itself.

## Task 2: Add RED Coverage For Direct Command Settlement

**Files:**
- Modify: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing direct-command tests**

Cover:

- `runtime-dispatch.ts` no longer imports or calls `settleRuntimeEffects(...)`
- dispatch-facing behavior still expects canonical command payload preservation and effect-oriented diagnostics

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs
```

Expected:

- the new direct-command assertions fail before implementation

## Task 3: Lower runtime-dispatch To Command Settlement

**Files:**
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-dispatch-command-settlement-direct-plan.md`

- [x] **Step 1: Replace direct effect-settlement calls with command-settlement entry**

Keep one source of effect->command translation rules and preserve dispatch summary diagnostics.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `runtime-dispatch.ts` no longer imports or calls `settleRuntimeEffects(...)`.
- [x] Dispatch-facing behavior still preserves settlement diagnostics for covered effects.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Dispatch Command Settlement Direct`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `not-started`
- Next Required Action: `commit-push-runtime-dispatch-command-settlement-direct`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-dispatch-command-settlement-direct-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, open the next lower-level runtime-only cleanup beneath settleRuntimeEffects(...) and continue converging the remaining compatibility adapter seam.`
