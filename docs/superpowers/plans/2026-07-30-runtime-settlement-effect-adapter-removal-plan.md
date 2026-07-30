# Runtime Settlement Effect Adapter Removal Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the remaining `settleRuntimeEffects(...)` compatibility adapter and effect-specific settlement contract types so runtime settlement is fully command-native.

**Architecture:** The previous children already lowered all production callers off the effect adapter and removed `runtime-dispatch.ts` from the effect-settlement compat contract. The remaining effect-level seam is now isolated to `runtime-settlement.ts`, `src/core/contracts/effect-settlement.ts`, and `tests/runtime-settlement-content.test.cjs`. This child removes the adapter and the effect-specific contract types, keeps `translateEffectsToSettlementCommands(...)` plus `mapCommandSettlementToEffects(...)` as explicit compatibility helpers, and rewrites the lower-level tests to exercise those helpers around `settleRuntimeCommands(...)` directly.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `The effect-level settlement adapter is gone. runtime-settlement is now command-native and keeps only explicit translation helpers around settleRuntimeCommands(...).`
- Next Step: `Commit/push this child, then continue from the remaining command-native settlement/test cleanup surface instead of any effect adapter seam.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 450/450; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child intentionally keeps translateEffectsToSettlementCommands(...) and mapCommandSettlementToEffects(...) as explicit compatibility helpers. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next lower-level runtime-only child after runtime-dispatch effect-settlement contract removal. Audit found settleRuntimeEffects(...) and EffectSettlementInput / EffectSettlementResult are now isolated to runtime-settlement.ts, the effect-settlement contract file, and runtime-settlement-content tests.`
  - Verification: `rg -n "settleRuntimeEffects\\(|EffectSettlement(Input|Result|Applier)" src tests --glob '!docs/**'`; `sed -n '1,520p' src/core/runtime/runtime-settlement.ts`; `sed -n '1,460p' tests/runtime-settlement-content.test.cjs`; `sed -n '1,220p' src/core/contracts/effect-settlement.ts`.`
  - Next: `Add RED coverage that deletes the remaining effect adapter seam while preserving explicit translation helpers.`
- 2026-07-30
  - Summary: `Added RED guards for effect adapter removal, then deleted settleRuntimeEffects(...) plus EffectSettlementApplier / EffectSettlementInput / EffectSettlementResult. runtime-settlement-content tests now exercise translateEffectsToSettlementCommands(...) + settleRuntimeCommands(...) + mapCommandSettlementToEffects(...) directly, so runtime settlement is fully command-native while effect compatibility survives only as explicit helper seams.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 450/450; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then continue from the remaining command-native settlement/test cleanup surface instead of any effect adapter seam.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-dispatch-command-settlement-direct-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-dispatch-effect-settlement-contract-removal-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `8d2b9f1`, which removed `runtime-dispatch.ts` from the effect-settlement contract file.
  - Audit now shows the effect-level adapter seam is isolated to `src/core/runtime/runtime-settlement.ts`, `src/core/contracts/effect-settlement.ts`, and `tests/runtime-settlement-content.test.cjs`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- remove `settleRuntimeEffects(...)`
- remove `EffectSettlementApplier`, `EffectSettlementInput`, and `EffectSettlementResult`
- keep command settlement as the only runtime-settlement execution entrypoint
- preserve explicit effect translation/compatibility helpers for tests and any future non-owner adapters
- rewrite lower-level runtime-settlement tests to exercise helpers around `settleRuntimeCommands(...)`
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- renaming `src/core/contracts/effect-settlement.ts`
- changing `src/main.ts`, UI, map, backpack, or style paths
- widening effect-level compatibility back into production callers

## File Map

### Existing files to modify

- `src/core/contracts/effect-settlement.ts`
  - Remove effect-specific settlement types and keep command-native settlement types only.
- `src/core/runtime/runtime-settlement.ts`
  - Remove `settleRuntimeEffects(...)` and switch helper typing to command-native contract types.
- `tests/runtime-settlement-content.test.cjs`
  - Rewrite effect adapter tests around `translateEffectsToSettlementCommands(...)`, `settleRuntimeCommands(...)`, and `mapCommandSettlementToEffects(...)`.
- `tests/robustness.test.cjs`
  - Guard that effect-specific contract types and `settleRuntimeEffects(...)` are gone while explicit translation helpers remain.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-settlement-effect-adapter-removal-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `settleRuntimeEffects(...)` and effect-specific settlement contract exports are gone
  - lower-level tests still cover effect->command translation and effect-oriented diagnostics
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effect adapter removal|runtime dispatch effect settlement contract removal|runtime dispatch command settlement direct|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Last Effect Adapter Seam

**Files:**
- Read: `src/core/runtime/runtime-settlement.ts`
- Read: `src/core/contracts/effect-settlement.ts`
- Read: `tests/runtime-settlement-content.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-effect-adapter-removal-plan.md`

- [x] **Step 1: Record the isolated effect adapter seam**

Document that only the lower-level adapter module, its contract, and its dedicated tests still depend on effect-specific settlement types.

- [x] **Step 2: Lock the child boundary**

Document that this child keeps explicit translation helpers but removes the execution adapter and effect-specific contract types.

## Task 2: Add RED Coverage For Adapter Removal

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing adapter-removal guards**

Cover:

- `src/core/runtime/runtime-settlement.ts` no longer exports `settleRuntimeEffects(...)`
- `src/core/contracts/effect-settlement.ts` no longer exports `EffectSettlementApplier`, `EffectSettlementInput`, or `EffectSettlementResult`
- `translateEffectsToSettlementCommands(...)` and `mapCommandSettlementToEffects(...)` stay exported

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement effect adapter removal"
```

Expected:

- the new guard fails before implementation

## Task 3: Remove The Effect Adapter And Rewire Tests

**Files:**
- Modify: `src/core/contracts/effect-settlement.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `tests/runtime-settlement-content.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-effect-adapter-removal-plan.md`

- [x] **Step 1: Remove the adapter and keep explicit helper seams**

Keep command-native execution only and preserve lower-level testability through explicit translation helpers.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `settleRuntimeEffects(...)` is removed.
- [x] `EffectSettlementApplier`, `EffectSettlementInput`, and `EffectSettlementResult` are removed.
- [x] Lower-level tests still cover effect translation and diagnostics via explicit helpers around `settleRuntimeCommands(...)`.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Settlement Effect Adapter Removal`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `not-started`
- Next Required Action: `commit-push-runtime-settlement-effect-adapter-removal`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-settlement-effect-adapter-removal-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, continue from the remaining command-native settlement/test cleanup surface and keep the next slice runtime-only.`
