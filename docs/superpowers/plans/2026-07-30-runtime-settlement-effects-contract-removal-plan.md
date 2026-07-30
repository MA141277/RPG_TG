# Runtime Settlement Effects Contract Removal Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `effects` from `RuntimeSettlementResult` and stop runtime result layers from carrying settlement-effects compatibility metadata, leaving runtime settlement ownership on the command seam only.

**Architecture:** Production runtime flow is already command-only for settlement mutation, playable-owned settlement shells no longer emit default `effects: []`, and audit now shows no production source still emits `settlement.effects`. The remaining surface is purely compatibility residue in `RuntimeSettlementResult`, `runtime-dispatch` summary carry-through, and tests that still model passthrough behavior. This child removes that contract-level metadata surface, updates runtime-dispatch to stop preserving it, and tightens tests to require `commands` as the only runtime settlement payload seam.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 1 through Task 3 are complete locally. RuntimeSettlementResult no longer exposes effects, runtime-dispatch no longer preserves settlement.effects metadata, and runtime result settlement payloads are command-only at the runtime contract seam.`
- Next Step: `Commit and push this child checkpoint, then choose whether the next adjacent runtime-only cleanup should target the lower-level settleRuntimeEffects(...) adapter or another remaining compatibility seam.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effects contract removal|runtime settlement effects fallback removal|playable settlement effects compatibility optional|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 446/446; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child intentionally does not remove the lower-level settleRuntimeEffects(...) adapter or settledEffects/unsupportedEffects diagnostics from effect settlement results. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next adjacent runtime-only child after playable settlement compatibility narrowing. Audit found no production emitter of settlement.effects remains in src/core or src/application, so the remaining runtime settlement effects surface is contract/summary residue only.`
  - Verification: `rg -U -n "settlement:\\s*\\{[\\s\\S]{0,240}?effects\\s*:" src/core src/application`; `rg -n "settlement\\.effects|RuntimeSettlementResult|pendingSettlementEffects" src tests`; `sed -n '1,140p' src/core/contracts/runtime-result.ts`; `sed -n '145,230p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,180p' tests/state-sync-runtime-commit.test.cjs`.`
  - Next: `Add RED coverage that makes runtime settlement result command-only.`
- 2026-07-30
  - Summary: `Completed Task 1 audit and Task 2 RED coverage. The child boundary stayed fixed on runtime result metadata only, while the new tests required RuntimeSettlementResult to drop effects, required commitRuntimeRequest to stop exposing settlement.effects passthrough, and required runtime-dispatch source to stop carrying pendingSettlementEffects metadata.`
  - Verification: `rg -U -n "settlement:\\s*\\{[\\s\\S]{0,240}?effects\\s*:" src/core src/application`; `rg -n "settlement\\.effects|RuntimeSettlementResult|pendingSettlementEffects" src tests`; `sed -n '1,140p' src/core/contracts/runtime-result.ts`; `sed -n '145,230p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,180p' tests/state-sync-runtime-commit.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/state-sync-runtime-commit.test.cjs` failed at the new command-only settlement assertions before implementation.`
  - Next: `Remove settlement.effects from RuntimeSettlementResult and runtime-dispatch settlement summaries, then rerun the full GREEN verification set.`
- 2026-07-30
  - Summary: `Completed Task 3. RuntimeSettlementResult no longer declares effects, runtime-dispatch no longer preserves settlement.effects metadata even on sanitized passthrough, and runtime result settlement payloads now converge on commands-only metadata at the runtime contract seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effects contract removal|runtime settlement effects fallback removal|playable settlement effects compatibility optional|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 446/446; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push this contract-removal checkpoint, then choose the next adjacent runtime-only compatibility cleanup.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-fallback-removal-plan.md`
  - `docs/superpowers/plans/2026-07-30-playable-settlement-effects-compat-optional-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `c7f0204`, which narrowed playable settlement effects to optional compatibility metadata and removed default empty-array emission.
  - Audit now shows no production emitter of `settlement.effects` remains in runtime sources; the remaining surface is runtime result contract and dispatch metadata only.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- remove `effects` from `RuntimeSettlementResult`
- stop `runtime-dispatch` from preserving `settlement.effects` metadata in runtime settlement summaries
- update runtime-result/state-sync/runtime-dispatch tests to require command-only runtime settlement payloads
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- removing `settleRuntimeEffects(...)` from the lower-level compatibility adapter
- removing `settledEffects` / `unsupportedEffects` diagnostics from effect-settlement results
- changing non-runtime callers that still directly use effect-settlement APIs
- UI, map, backpack, `src/main.ts`, or style changes

## File Map

### Existing files to modify

- `src/core/contracts/runtime-result.ts`
  - Remove `effects` from `RuntimeSettlementResult`.
- `src/core/runtime/runtime-dispatch.ts`
  - Stop carrying `settlement.effects` through runtime settlement summaries.
- `tests/runtime-result-contract.test.cjs`
  - Require runtime settlement payloads to expose commands without compatibility `effects`.
- `tests/state-sync-runtime-commit.test.cjs`
  - Stop expecting runtime result settlement passthrough on `effects`.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Remove summary expectations that still carry pending settlement `effects`.
- `tests/robustness.test.cjs`
  - Guard that runtime result contract/dispatch no longer keep the `settlement.effects` payload seam.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-contract-removal-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - runtime settlement payloads expose `commands` only
  - runtime-dispatch no longer carries `settlement.effects`
  - runtime commit flow no longer promises legacy settlement-effects passthrough
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effects contract removal|runtime settlement effects fallback removal|playable settlement effects compatibility optional|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Remaining Runtime Settlement Effects Surface

**Files:**
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-contract-removal-plan.md`

- [x] **Step 1: Record the remaining contract-only seam**

Document that runtime settlement `effects` now remains only as contract/summary residue.

- [x] **Step 2: Lock the child boundary**

Document that this child removes runtime result metadata only, not the lower-level effect-settlement adapter.

## Task 2: Add RED Coverage For Contract Removal

**Files:**
- Modify: `tests/runtime-result-contract.test.cjs`
- Modify: `tests/state-sync-runtime-commit.test.cjs`
- Modify: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing contract-removal tests**

Cover:

- `RuntimeSettlementResult` no longer declares `effects`
- runtime result settlement passthrough no longer exposes `effects`
- runtime-dispatch source no longer carries `pendingSettlementEffects`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-result-contract.test.cjs tests/state-sync-runtime-commit.test.cjs
```

Expected:

- the new runtime-settlement-contract assertions fail before implementation

## Task 3: Remove Runtime Settlement Effects Contract Surface

**Files:**
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-contract-removal-plan.md`

- [x] **Step 1: Remove runtime settlement effects from contract and summary**

Keep settlement `commands` canonical and stop returning settlement-effects metadata in runtime results.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `RuntimeSettlementResult` no longer exposes `effects`.
- [x] `runtime-dispatch` no longer preserves `settlement.effects` metadata.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Settlement Effects Contract Removal`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-and-push-runtime-settlement-effects-contract-removal`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-settlement-effects-contract-removal-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Review the verified runtime-settlement contract-removal diff, commit and push it, then open the next adjacent runtime-only compatibility cleanup child.`
