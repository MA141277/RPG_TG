# Time Advance Settlement Command Direct Callers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lower the remaining direct time-advance settlement callers from `Effect[]` to canonical `SettlementCommand[]` in core runtime owners.

**Architecture:** The branch already made `runtime-settlement`, `RuntimeResult.settlement`, `runtime-dispatch`, and `state-sync-runtime` command-first for the covered settlement path. The remaining production callers that still invoke `settleRuntimeEffects(...)` directly are `playable-runtime` and `house-runtime`, both only for time-advance behavior. This child keeps the scope narrow: replace those direct effect-level time-advance callers with direct command-level settlement calls, keep the legacy `Effect` adapter in place for compatibility, and avoid widening into UI, shell, or unrelated gameplay systems.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 1 through Task 3 are complete locally. playable-runtime city-begging completion and house-runtime timeAdvanceCost settlement now call settleRuntimeCommands(...) directly with canonical time.advance commands instead of direct advanceTime effects.`
- Next Step: `Commit and push this child checkpoint, then open the next adjacent runtime-only settlement/event-system slice that lowers another remaining effect-first compatibility seam.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "covered settlement path stays on shared runtime ownership|child 31 city-begging completion clears shared playable session after settlement|time advance settlement command direct callers|runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 443/443; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` still fails only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
- Notes: `This child intentionally does not remove settleRuntimeEffects(...) itself, and does not migrate runtime-dispatch/state-sync-runtime again because those caller layers are already command-first. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next adjacent runtime-only child after runtime settlement commands caller adoption. The remaining direct effect-first production callers are now narrowed to playable-runtime city-begging completion and house-runtime timeAdvanceCost settlement, both of which only need canonical time.advance command settlement.`
  - Verification: `sed -n '800,900p' src/core/runtime/playable-runtime.ts`; `sed -n '140,230p' src/core/runtime/house-runtime.ts`; `rg -n "settleRuntimeEffects\\(" src/core/runtime tests`; `sed -n '1,220p' docs/superpowers/project-progress.md`.`
  - Next: `Add RED tests and robustness guards for direct time-advance caller lowering.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. The only remaining direct production settleRuntimeEffects(...) callers were playable-runtime city-begging completion and house-runtime timeAdvanceCost settlement, and both were already limited to time advancement rather than broader effect-family coverage.`
  - Verification: `sed -n '1,120p' src/core/runtime/playable-runtime.ts`; `sed -n '1,120p' src/core/runtime/house-runtime.ts`; `sed -n '19070,19140p' tests/robustness.test.cjs`; `rg -n "settleRuntimeEffects\\(" src/core/runtime tests`.`
  - Next: `Add RED coverage that locks the direct caller seam to canonical settlement commands.`
- 2026-07-30
  - Summary: `Completed Task 2 RED coverage. Added behavior coverage that city-begging completion still advances time correctly, and added robustness guards that require playable-runtime and house-runtime to import settleRuntimeCommands(...) and drop the old direct advanceTime effect-level caller pattern.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/city-begging-runtime-status.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "time advance settlement command direct callers"` failed as expected before implementation on the missing settleRuntimeCommands(...) direct caller imports.`
  - Next: `Replace the two remaining direct effect-level time-advance callers with settleRuntimeCommands(...) and rerun the focused verification set.`
- 2026-07-30
  - Summary: `Completed Task 3. playable-runtime city-begging completion and house-runtime timeAdvanceCost settlement now call settleRuntimeCommands(...) directly with canonical time.advance commands, while behavior and shared runtime ownership stay unchanged.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "covered settlement path stays on shared runtime ownership|child 31 city-begging completion clears shared playable session after settlement|time advance settlement command direct callers|runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
  - Next: `Commit and push this child, then open the next adjacent runtime-only settlement/event-system slice from this checkpoint.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-settlement-runtime-command-canonical-entry-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-settlement-commands-caller-phase-one-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `12f5b1b`, which made `RuntimeResult.settlement`, `runtime-dispatch`, and `state-sync-runtime` command-first for settlement caller ownership.
  - The remaining direct production `settleRuntimeEffects(...)` callers are `src/core/runtime/playable-runtime.ts` and `src/core/runtime/house-runtime.ts`, each only using time-advance settlement.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- audit the two remaining direct effect-first time-advance callers
- add RED coverage for command-level direct settlement in playable-runtime and house-runtime
- replace direct `settleRuntimeEffects(...)` time-advance calls with `settleRuntimeCommands(...)`
- preserve existing runtime result and house/playable behavior while lowering the caller seam
- sync this child plus the parent runtime handoff after GREEN verification

### Still Out Of Scope

- removing `settleRuntimeEffects(...)` from runtime-dispatch, state-sync-runtime, or runtime-settlement compatibility paths
- changing settlement payload schemas beyond direct caller lowering
- UI, map, backpack, `src/main.ts`, or style changes
- non-time-advance settlement command family expansion

## File Map

### Existing files to modify

- `src/core/runtime/playable-runtime.ts`
  - Replace the city-begging completion time-advance settlement caller with canonical settlement commands.
- `src/core/runtime/house-runtime.ts`
  - Replace `timeAdvanceCost` effect construction/settlement with canonical settlement commands.
- `tests/city-begging-runtime-status.test.cjs`
  - Add direct coverage that playable-runtime still advances time correctly after command-level caller lowering.
- `tests/robustness.test.cjs`
  - Guard that playable-runtime and house-runtime no longer keep the direct `settleRuntimeEffects(...)` time-advance caller pattern.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-time-advance-settlement-command-direct-callers-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - playable-runtime still advances time and clears the playable session after city-begging completion
  - house-runtime still applies timeAdvanceCost through shared settlement ownership
  - playable-runtime and house-runtime use direct command-level settlement callers instead of direct effect-level time settlement
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/city-begging-runtime-status.test.cjs tests/interactive-runtime-status.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "covered settlement path stays on shared runtime ownership|child 31 city-begging completion clears shared playable session after settlement|time advance settlement command direct callers|runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Direct Time-Advance Callers

**Files:**
- Read: `src/core/runtime/playable-runtime.ts`
- Read: `src/core/runtime/house-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-30-time-advance-settlement-command-direct-callers-plan.md`

- [x] **Step 1: Record the remaining direct caller seam**

Document that the remaining direct production `settleRuntimeEffects(...)` callers are playable-runtime city-begging completion and house-runtime timeAdvanceCost settlement.

- [x] **Step 2: Lock the child boundary**

Document that this child only lowers those direct time-advance callers to canonical settlement commands and does not broaden into other runtime effect compatibility seams.

## Task 2: Add RED Coverage For Direct Command-Level Callers

**Files:**
- Modify: `tests/city-begging-runtime-status.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing caller-lowering tests**

Cover:

- playable-runtime city-begging completion still advances time while using command-level settlement ownership
- house-runtime shared settlement ownership stays intact after time-advance caller lowering
- direct playable/house runtime sources no longer keep the old direct effect-level settlement call pattern

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/city-begging-runtime-status.test.cjs
```

Expected:

- the new command-level caller assertions fail before implementation

## Task 3: Lower Direct Time-Advance Callers To Settlement Commands

**Files:**
- Modify: `src/core/runtime/playable-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-time-advance-settlement-command-direct-callers-plan.md`

- [x] **Step 1: Replace playable-runtime time settlement with canonical commands**

Lower the city-begging completion caller from direct time-advance effects to direct `SettlementCommand[]`.

- [x] **Step 2: Replace house-runtime time settlement with canonical commands**

Lower `timeAdvanceCost` settlement from direct `advanceTime` effects to direct `time.advance` settlement commands.

- [x] **Step 3: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] playable-runtime no longer uses a direct effect-level time-advance settlement caller.
- [x] house-runtime no longer uses a direct effect-level time-advance settlement caller.
- [x] Covered time settlement behavior remains unchanged for city-begging completion and house-runtime timeAdvanceCost paths.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Time Advance Settlement Command Direct Callers`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-time-advance-settlement-command-direct-callers-and-open-next-runtime-only-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-time-advance-settlement-command-direct-callers-plan.md`
- Push Status: `pending`
- Push Commit: `none`
- Resume From: `Promote this completed-but-open direct caller lowering checkpoint into branch history, then open the next adjacent runtime-only settlement/event-system child from the pushed commit.`
