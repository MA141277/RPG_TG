# Settlement Command Money Phase Two Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the shared settlement-command runtime so `Effect.type === "changeMoney"` no longer stays outside the converged settlement mutation seam.

**Architecture:** Phase one extracted the already-covered concrete mutation families into `settlement-command-runtime`, but the outer `Effect` contract still exposes `changeMoney` as an unsupported holdout. This child adds one narrow player-money command family to the same runtime owner, keeps `runtime-settlement` as the outer `Effect` adapter, and defers broader inventory/city/building payload redesign.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 2 and Task 3 are complete locally. The branch now extends SettlementCommand with a narrow player-money command family, settlement-command-runtime mutates player gold through the shared runtime property mutation seam, and runtime-settlement maps outer changeMoney effects into that owner while preserving the external Effect-level unsupported/warning compatibility surface.`
- Next Step: `Commit and push this child checkpoint, then open the next adjacent runtime-only settlement/event-system slice for the remaining non-money command/payload gaps.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 22/22; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement command runtime|runtime settlement uses explicit contract|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 441/441; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` still fails only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
- Notes: `This child intentionally does not add inventory, city patch, or building patch command families. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only child after settlement-command phase one so changeMoney can converge onto the shared settlement-command runtime seam without broadening payload scope.`
  - Verification: `Plan authoring only.`
  - Next: `Audit current changeMoney ownership and add RED tests.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. After settlement-command phase one, changeMoney remained the only outer Effect family still exposed by src/core/contracts/effect.ts but left unsupported by runtime-settlement, so phase two should only add a narrow player-money command family rather than broad inventory/city/building command coverage.`
  - Verification: `sed -n '1,220p' src/core/contracts/effect.ts`; `sed -n '1,220p' src/core/contracts/settlement-command.ts`; `sed -n '1,240p' src/core/runtime/settlement-command-runtime.ts`; `sed -n '332,520p' src/core/runtime/runtime-settlement.ts`; `rg -n "changeMoney|player\\.money\\.change" src tests`.`
  - Next: `Add RED tests for player-money settlement command support.`
- 2026-07-30
  - Summary: `Completed Task 2 RED coverage. Added direct settlement-command-runtime tests for player-money change plus fail-closed behavior, added outer Effect-level changeMoney settlement coverage, and tightened robustness ownership guards so the new command family must live on the shared settlement-command seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs` failed as expected before implementation because changeMoney still stayed outside the shared settlement-command runtime seam.`
  - Next: `Implement the narrow player-money command family and delegate changeMoney into it.`
- 2026-07-30
  - Summary: `Completed Task 3. Extended SettlementCommand with player.money.change, taught settlement-command-runtime to mutate player gold through the shared runtime property mutation seam, and rewired runtime-settlement to map outer changeMoney effects into that owner while preserving the external Effect-level compatibility warning surface.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement command runtime|runtime settlement uses explicit contract|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
  - Next: `Commit and push this child, then open the next adjacent runtime-only settlement/event-system slice from this checkpoint.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-settlement-command-runtime-phase-one-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-settlement-runtime-owner-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `0059e92`, which introduced the shared settlement-command runtime owner for flag/variable/time/character numeric mutation families.
  - `src/core/contracts/effect.ts` still exposes `changeMoney`, but `runtime-settlement` currently leaves it unsupported.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- audit current `changeMoney` handling and document the remaining gap
- extend the `SettlementCommand` contract with one narrow player-money command family
- teach `settlement-command-runtime` to mutate player gold through the shared runtime property mutation seam
- map `Effect.type === "changeMoney"` into that command family inside `runtime-settlement`
- add focused RED/GREEN coverage and sync this child plus the parent handoff

### Still Out Of Scope

- inventory command families
- city/building patch command families
- broader event payload-schema redesign
- item/menu/house trigger migration
- `src/main.ts`, UI, map, backpack, or style changes

## File Map

### Existing files to modify

- `src/core/contracts/settlement-command.ts`
  - Add the narrow player-money command family.
- `src/core/runtime/settlement-command-runtime.ts`
  - Execute player-money changes through shared character numeric mutation.
- `src/core/runtime/runtime-settlement.ts`
  - Map `changeMoney` into the new settlement command while preserving the external `Effect` warning surface.
- `tests/settlement-command-runtime.test.cjs`
  - Add direct command-runtime coverage for player-money changes and fail-closed behavior.
- `tests/runtime-settlement-content.test.cjs`
  - Add outer `Effect`-level coverage for `changeMoney`.
- `tests/robustness.test.cjs`
  - Guard the new command family in the shared contract/runtime owner.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-settlement-command-money-phase-two-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `changeMoney` converges onto the shared settlement-command runtime seam
  - runtime-settlement continues to present `unsupported-effect:*` compatibility warnings externally
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement command runtime|runtime settlement uses explicit contract|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Remaining Money Gap

**Files:**
- Read: `src/core/contracts/effect.ts`
- Read: `src/core/contracts/settlement-command.ts`
- Read: `src/core/runtime/settlement-command-runtime.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-command-money-phase-two-plan.md`

- [x] **Step 1: Record the remaining outer Effect holdout**

Document that `changeMoney` is still part of the outer `Effect` contract but remains unsupported after phase one.

- [x] **Step 2: Lock the narrow phase-two boundary**

Document that phase two adds only player-money mutation and leaves inventory/city/building command families deferred.

## Task 2: Add RED Coverage For Player Money Settlement Commands

**Files:**
- Modify: `tests/settlement-command-runtime.test.cjs`
- Modify: `tests/runtime-settlement-content.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing player-money command tests**

Cover:

- settlement-command-runtime applies player-money changes through player gold mutation
- missing character definitions still fail closed for player-money commands
- runtime-settlement settles `changeMoney` through the shared command runtime

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs
```

Expected:

- the new player-money assertions fail before implementation

## Task 3: Implement Player Money Settlement Command Support

**Files:**
- Modify: `src/core/contracts/settlement-command.ts`
- Modify: `src/core/runtime/settlement-command-runtime.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-command-money-phase-two-plan.md`

- [x] **Step 1: Extend the shared command contract and runtime**

Add a narrow player-money command family and route it through the shared runtime property mutation owner.

- [x] **Step 2: Delegate outer changeMoney effects to the new command family**

Keep `runtime-settlement` as the outer orchestrator and compatibility surface.

- [x] **Step 3: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `changeMoney` converges onto the shared settlement-command runtime seam.
- [x] runtime-settlement preserves the outer `Effect` compatibility surface.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Settlement Command Money Phase Two`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-settlement-command-money-phase-two-and-open-next-runtime-only-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-settlement-command-money-phase-two-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Promote this completed-but-open checkpoint into branch history, then open the next adjacent runtime-only settlement/event-system child from the pushed commit.`
