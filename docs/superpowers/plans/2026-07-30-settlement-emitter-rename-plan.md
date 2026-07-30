# Settlement Emitter Rename Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the command-native settlement contract's `EffectEmitter` type to `SettlementEmitter` so the contract terminology matches current command-native ownership.

**Architecture:** After the contract file rename, the remaining core misnomer in the command-native settlement contract is `EffectEmitter`. This child keeps scope intentionally tiny: rename the exported contract type, repoint any dependents and robustness assertions, and leave runtime behavior unchanged.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `The command-native settlement contract now exports SettlementEmitter, so the last effect-era exported core type name is gone from the settlement runtime seam.`
- Next Step: `Commit/push this child, then continue from the remaining runtime-only event-system migration surface.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement emitter rename|settlement runtime contract rename|runtime settlement effect adapter removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 452/452; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child changes naming only; runtime behavior stays unchanged. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only terminology cleanup child after settlement-runtime contract rename. Audit found EffectEmitter now survives only as the command-native settlement contract's exported emitter type and robustness assertions.`
  - Verification: `rg -n "EffectEmitter|SettlementEmitter" src tests --glob '!docs/**'`; `sed -n '1,120p' src/core/contracts/settlement-runtime.ts`; `sed -n '16720,16780p' tests/robustness.test.cjs`.`
  - Next: `Add RED coverage that forces the contract emitter rename.`
- 2026-07-30
  - Summary: `Added RED coverage for the remaining emitter misnomer, then renamed EffectEmitter to SettlementEmitter in src/core/contracts/settlement-runtime.ts and repointed the surviving robustness assertion so the command-native settlement seam no longer exports an effect-era emitter type name.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement emitter rename|settlement runtime contract rename|runtime settlement effect adapter removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 452/452; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then continue from the remaining runtime-only event-system migration surface.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-effect-adapter-removal-plan.md`
  - `docs/superpowers/plans/2026-07-30-settlement-runtime-contract-rename-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `9e05734`, which renamed the command-native settlement contract file.
  - Audit now shows the remaining effect-era core contract type name is `EffectEmitter`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- rename `EffectEmitter` to `SettlementEmitter`
- repoint active code and robustness assertions
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- broader helper/test name cleanup
- runtime behavior changes
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/contracts/settlement-runtime.ts`
  - Rename the exported emitter type.
- `tests/robustness.test.cjs`
  - Update contract assertions.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-settlement-emitter-rename-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `SettlementEmitter` replaces `EffectEmitter` in the contract
  - runtime behavior remains unchanged
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement emitter rename|settlement runtime contract rename|runtime settlement effect adapter removal|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Core Terminology Debt

**Files:**
- Read: `src/core/contracts/settlement-runtime.ts`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-emitter-rename-plan.md`

- [x] **Step 1: Record the remaining core terminology debt**

Document that `EffectEmitter` is the last effect-era exported core type name in the command-native settlement contract.

- [x] **Step 2: Lock the child boundary**

Document that this child renames the contract type only and does not change runtime behavior.

## Task 2: Add RED Coverage For The Emitter Rename

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing rename guard**

Cover:

- `settlement-runtime.ts` exports `SettlementEmitter`
- `settlement-runtime.ts` no longer exports `EffectEmitter`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement emitter rename"
```

Expected:

- the new guard fails before implementation

## Task 3: Rename The Contract Type

**Files:**
- Modify: `src/core/contracts/settlement-runtime.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-emitter-rename-plan.md`

- [x] **Step 1: Rename EffectEmitter to SettlementEmitter**

Keep behavior unchanged and do not widen the slice into helper/test-name refactors.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `SettlementEmitter` replaces `EffectEmitter` in the command-native settlement contract.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Settlement Emitter Rename`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-settlement-emitter-rename`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-settlement-emitter-rename-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, continue from the remaining runtime-only event-system migration surface and keep the next slice command-native.`
