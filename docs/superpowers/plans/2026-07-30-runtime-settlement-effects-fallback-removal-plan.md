# Runtime Settlement Effects Fallback Removal Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the final `settlement.effects` runtime fallback from `state-sync-runtime` so runtime settlement ownership becomes command-only in production flow.

**Architecture:** The branch is already command-first everywhere relevant: `runtime-settlement` is canonical on commands, `RuntimeSettlementResult.effects` is now optional compatibility-only metadata, and there are no production emitters of `settlement.effects` left. The only remaining runtime fallback is `state-sync-runtime` settling explicit `settlement.effects` payloads. This child removes that final fallback, tightens tests to require command-only settlement in runtime commit flow, and keeps the lower-level `settleRuntimeEffects(...)` compatibility adapter intact for non-runtime callers.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 1 through Task 3 are complete locally. state-sync-runtime no longer settles settlement.effects in runtime commit flow, commitRuntimeRequest is command-only for settlement mutation, and legacy settlement.effects payloads now pass through as compatibility metadata without runtime mutation.`
- Next Step: `Commit and push this child checkpoint, then choose the next adjacent runtime-only compatibility cleanup instead of reopening runtime-flow settlement fallback.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/state-sync-runtime-commit.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effects fallback removal|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 445/445; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child intentionally does not remove settleRuntimeEffects(...) from lower-level compatibility surfaces outside runtime commit flow. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next adjacent runtime-only child after settlement.effects compatibility narrowing. Audit now shows the only remaining production settlement.effects consumer is state-sync-runtime's fallback branch, with one explicit compatibility test still guarding that behavior.`
  - Verification: `rg -n "settlement\\.effects|settlement\\?\\.effects|effects:\\s*settled\\.settledEffects|effects\\?: Effect\\[\\]" src tests`; `sed -n '120,240p' src/core/runtime/state-sync-runtime.ts`; `sed -n '70,180p' tests/state-sync-runtime-commit.test.cjs`.`
  - Next: `Add RED tests that make runtime commit settlement command-only.`
- 2026-07-30
  - Summary: `Completed Task 1 audit and Task 2 RED coverage. The child boundary stayed fixed on runtime commit flow only, while the new tests required commitRuntimeRequest to stop settling legacy settlement.effects payloads and required state-sync-runtime source to become command-only.`
  - Verification: `rg -n "settlement\\.effects|settlement\\?\\.effects|effects:\\s*settled\\.settledEffects|effects\\?: Effect\\[\\]" src tests`; `sed -n '120,240p' src/core/runtime/state-sync-runtime.ts`; `sed -n '70,180p' tests/state-sync-runtime-commit.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/state-sync-runtime-commit.test.cjs` failed at `commitRuntimeRequest no longer settles legacy playable settlement effects through runtime commit flow` before implementation.`
  - Next: `Delete the final runtime-flow settlement.effects fallback and rerun the full GREEN verification set.`
- 2026-07-30
  - Summary: `Completed Task 3. state-sync-runtime now settles only settlement.commands during runtime commit flow, the final runtime-flow settlement.effects fallback branch is removed, and legacy settlement.effects payloads survive only as compatibility metadata without mutating app state through commitRuntimeRequest.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/state-sync-runtime-commit.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effects fallback removal|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 445/445; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push this fallback-removal checkpoint, then choose the next adjacent runtime-only compatibility cleanup.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-time-advance-settlement-command-direct-callers-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-compat-optional-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `6720ab0`, which narrowed `settlement.effects` to optional compatibility-only metadata.
  - Audit now shows the only remaining runtime-flow settlement.effects path is `state-sync-runtime.ts`; there are no production emitters left.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- remove `settlement.effects` fallback settlement from `state-sync-runtime`
- update runtime commit tests to require command-only settlement in runtime flow
- tighten runtime contract/robustness coverage around fallback removal
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- removing `settleRuntimeEffects(...)` from runtime-settlement compatibility adapter
- changing routed runtime `effects` handling in runtime-dispatch
- removing lower-level effect settlement APIs from non-runtime callers
- UI, map, backpack, `src/main.ts`, or style changes

## File Map

### Existing files to modify

- `src/core/runtime/state-sync-runtime.ts`
  - Remove the final `settlement.effects` fallback branch from runtime commit flow.
- `tests/state-sync-runtime-commit.test.cjs`
  - Remove legacy runtime-commit effect fallback expectations and tighten command-only runtime settlement coverage.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Keep command-first expectations aligned if any settlement summary assertions still imply runtime-flow effect fallback.
- `tests/robustness.test.cjs`
  - Guard that state-sync-runtime no longer settles runtimeResult.settlement.effects.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-fallback-removal-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - runtime commit flow only settles settlement.commands
  - explicit legacy settlement.effects payloads no longer mutate app state through state-sync-runtime
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/state-sync-runtime-commit.test.cjs tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effects fallback removal|runtime settlement effects compatibility optional|runtime settlement uses explicit contract|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Final Runtime Fallback

**Files:**
- Read: `src/core/runtime/state-sync-runtime.ts`
- Read: `tests/state-sync-runtime-commit.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-fallback-removal-plan.md`

- [x] **Step 1: Record the last runtime-flow fallback seam**

Document that state-sync-runtime is the final production runtime-flow settlement.effects consumer.

- [x] **Step 2: Lock the child boundary**

Document that this child removes only the runtime-flow fallback, not the lower-level effect-settlement adapter APIs.

## Task 2: Add RED Coverage For Fallback Removal

**Files:**
- Modify: `tests/state-sync-runtime-commit.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing fallback-removal tests**

Cover:

- runtime commit no longer settles legacy settlement.effects payloads
- state-sync-runtime source no longer contains the settlement.effects fallback branch

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/state-sync-runtime-commit.test.cjs
```

Expected:

- the new fallback-removal assertions fail before implementation

## Task 3: Remove Runtime-Flow settlement.effects Fallback

**Files:**
- Modify: `src/core/runtime/state-sync-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-fallback-removal-plan.md`

- [x] **Step 1: Remove settlement.effects fallback settlement from runtime commit flow**

Keep command settlement intact and let legacy settlement.effects payloads pass through without runtime mutation.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `state-sync-runtime` no longer settles `runtimeResult.settlement.effects`.
- [x] Runtime commit flow is command-only for settlement mutation.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Settlement Effects Fallback Removal`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-and-push-runtime-settlement-effects-fallback-removal`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-fallback-removal-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Review the verified command-only runtime settlement diff, commit and push it, then open the next adjacent runtime-only compatibility cleanup child.`
