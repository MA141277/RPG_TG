# Settlement Command Runtime Phase One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a first shared settlement-command runtime owner for the already-covered effect families, then make `runtime-settlement` delegate command execution to it.

**Architecture:** The current branch already centralizes post-route effect settlement in `src/core/runtime/runtime-settlement.ts`, but that file still owns both orchestration and concrete mutation execution. This child extracts the covered mutation families into a dedicated `settlement-command` runtime under `src/core/runtime/**`, keeps the existing `Effect` contract as the outer adapter for now, and leaves wider payload-schema and missing command families for later children.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 2 and Task 3 are complete locally. The branch now has a canonical phase-one SettlementCommand contract, a dedicated settlement-command-runtime owner for flag/variable/time/character numeric mutation commands, and runtime-settlement delegates covered execution to that owner while preserving the external Effect-level warning/unsupported surface. changeMoney and broader payload/command redesign remain deferred.`
- Next Step: `Commit and push this child checkpoint, then open the next adjacent runtime-only settlement/event-system slice for remaining command families or router-owned payload lowering.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 19/19; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement command runtime|runtime settlement uses explicit contract|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 441/441; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` still fails only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
- Notes: `This child intentionally does not redesign the external Effect contract or broaden command coverage to money/inventory/city/building patch commands yet. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only child after story-settlement-owner convergence to extract a dedicated shared settlement-command runtime owner from runtime-settlement.`
  - Verification: `Plan authoring only.`
  - Next: `Audit the currently covered mutation families and write RED coverage.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. The current runtime-settlement implementation already owns direct execution for setFlag, setVariable, advanceTime, and mutateCharacterNumericProperty, and those are the only concrete mutation families with stable tests today. changeMoney still exists on the outer Effect contract but is not handled by runtime-settlement, so phase one should not expand into new command coverage; it should only extract the currently executed families into a dedicated shared settlement-command runtime owner.`
  - Verification: `sed -n '1,220p' src/core/contracts/effect.ts`; `sed -n '260,480p' src/core/runtime/runtime-settlement.ts`; `sed -n '1,220p' src/application/character/runtime-property-mutation.ts`; `sed -n '1,360p' tests/runtime-settlement-content.test.cjs`; `rg -n "changeMoney|setFlag|setVariable|advanceTime|mutateCharacterNumericProperty" src tests`.`
  - Next: `Add RED tests for shared settlement-command ownership and runtime-settlement delegation.`
- 2026-07-30
  - Summary: `Completed Task 2 RED coverage. Added focused settlement-command runtime tests, a delegation assertion proving runtime-settlement calls the new owner seam, and robustness guards that pin settlement-command-runtime as the concrete mutation owner while runtime-settlement stays the orchestrator.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs` failed as expected before implementation because ../.test-dist/core/runtime/settlement-command-runtime.js did not exist and runtime-settlement still executed covered families inline.`
  - Next: `Implement the shared settlement command contract/runtime and delegate runtime-settlement to it.`
- 2026-07-30
  - Summary: `Completed Task 3. Added src/core/contracts/settlement-command.ts and src/core/runtime/settlement-command-runtime.ts, moved the covered flag/variable/time/character numeric mutation execution into the new owner, and rewired runtime-settlement to map Effect -> SettlementCommand pairs, delegate execution, and preserve the existing Effect-level unsupported/warning surface.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement command runtime|runtime settlement uses explicit contract|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
  - Next: `Commit and push this child, then open the next adjacent runtime-only settlement/event-system slice from this checkpoint.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
  - `docs/superpowers/plans/2026-07-30-event-chain-runtime-convergence-plan.md`
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
  - The latest pushed checkpoint is `b0de0be`, which converged story settlement definition application onto shared runtime-settlement ownership.
  - `runtime-settlement` still directly executes the concrete covered mutation families instead of delegating to a narrower settlement-command runtime owner.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- audit the currently covered effect families already executed in `runtime-settlement`
- add a phase-one `SettlementCommand` contract for the already-covered families
- create `src/core/runtime/settlement-command-runtime.ts`
- delegate covered command execution from `runtime-settlement` to that runtime
- add focused RED/GREEN tests and ownership guards
- sync this child plan and the parent handoff after verification

### Still Out Of Scope

- broad external effect-contract redesign
- new money/inventory/city/building patch command families
- event payload-schema lowering
- item/menu/house trigger migration
- `src/main.ts`, UI, map, backpack, or style changes

## File Map

### Existing files to modify

- `src/core/contracts/effect-settlement.ts`
  - Add any minimal references needed so settlement orchestration can describe the command-runtime result surface.
- `src/core/runtime/runtime-settlement.ts`
  - Keep orchestration/progression behavior, but delegate the covered concrete mutation families to the new command runtime owner.
- `tests/runtime-settlement-content.test.cjs`
  - Keep proving orchestration and add delegation coverage if needed.
- `tests/robustness.test.cjs`
  - Guard the dedicated settlement-command runtime owner and ensure runtime-settlement remains the orchestrator rather than the concrete mutation owner.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-settlement-command-runtime-phase-one-plan.md`
  - This child plan.

### New files to create

- `src/core/contracts/settlement-command.ts`
  - Canonical phase-one settlement command union for the already-covered mutation families.
- `src/core/runtime/settlement-command-runtime.ts`
  - Shared runtime owner that executes the covered settlement commands.
- `tests/settlement-command-runtime.test.cjs`
  - Focused behavior coverage for the shared command runtime.

## Verification Plan

- Targeted verification:
  - a dedicated shared command runtime exists for the covered command families
  - runtime-settlement delegates covered concrete mutation execution to that command runtime
  - existing runtime-settlement behavior remains intact
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "settlement command runtime|runtime settlement uses explicit contract|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Phase-One Command Families

**Files:**
- Read: `src/core/contracts/effect.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Read: `src/application/character/runtime-property-mutation.ts`
- Read: `tests/runtime-settlement-content.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-command-runtime-phase-one-plan.md`

- [x] **Step 1: Record the currently covered concrete mutation families**

Document which mutation families already execute in `runtime-settlement` and which should be included in phase one.

- [x] **Step 2: Lock the first settlement-command runtime boundary**

Document that phase one covers only the mutation families already executed today, and that `changeMoney` / inventory / city patch / building patch remain deferred.

## Task 2: Add RED Coverage For Shared Settlement Commands

**Files:**
- Create: `tests/settlement-command-runtime.test.cjs`
- Modify: `tests/runtime-settlement-content.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing shared-command runtime tests**

Cover:

- command runtime applies the covered command families
- missing character definitions still fail closed for numeric character mutation
- runtime-settlement delegates covered execution to the command runtime owner

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/settlement-command-runtime.test.cjs tests/runtime-settlement-content.test.cjs
```

Expected:

- the new shared-command assertions fail before implementation

## Task 3: Implement Phase-One Settlement Command Runtime

**Files:**
- Create: `src/core/contracts/settlement-command.ts`
- Create: `src/core/runtime/settlement-command-runtime.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-command-runtime-phase-one-plan.md`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`

- [x] **Step 1: Add the shared command contract and runtime owner**

Implement the minimal command union and runtime needed for the already-covered families.

- [x] **Step 2: Delegate runtime-settlement execution to the new owner**

Keep `runtime-settlement` as the settlement orchestrator while removing direct covered mutation execution from it.

- [x] **Step 3: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] A dedicated shared settlement-command runtime exists for the covered mutation families.
- [x] runtime-settlement delegates covered concrete command execution to that runtime.
- [x] Existing runtime-settlement behavior remains intact.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Settlement Command Runtime Phase One`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-settlement-command-phase-one-and-open-next-runtime-only-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-settlement-command-runtime-phase-one-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Promote this completed-but-open checkpoint into branch history, then open the next adjacent runtime-only settlement/event-system child from the pushed commit.`
