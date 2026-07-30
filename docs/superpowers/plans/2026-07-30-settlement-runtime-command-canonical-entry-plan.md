# Settlement Runtime Command Canonical Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote `SettlementCommand[]` to the canonical `runtime-settlement` entry while keeping `Effect[]` as a compatibility adapter.

**Architecture:** The branch now centralizes all current settlement mutation families onto `settlement-command-runtime`, but `runtime-settlement` is still exposed primarily through `settleRuntimeEffects(...)`. This child adds a command-level canonical settlement contract and entrypoint, moves shared progression-plus-command orchestration behind that seam, and leaves `settleRuntimeEffects(...)` as a thin outer adapter that only maps legacy `Effect` records into commands and back.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 2 and Task 3 are complete locally. runtime-settlement now exposes settleRuntimeCommands(...) as the canonical command-level settlement entry, the shared progression-plus-command orchestration lives behind that seam, and settleRuntimeEffects(...) has been demoted to a compatibility adapter that only maps legacy Effect records into commands and back.`
- Next Step: `Commit and push this child checkpoint, then open the next adjacent runtime-only settlement/event-system slice for direct command-level caller adoption or broader payload lowering.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/settlement-command-runtime.test.cjs` passed 24/24; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 441/441; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` still fails only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
- Notes: `This child intentionally does not remove the legacy Effect contract from callers yet. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only child after settlement-command money phase two so runtime-settlement can expose a canonical command-level entry and demote Effect settlement to compatibility adaptation only.`
  - Verification: `Plan authoring only.`
  - Next: `Audit the remaining Effect-first seam and add RED tests.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. The covered settlement mutation families are now centralized on SettlementCommand, but runtime-settlement still exposed settleRuntimeEffects(...) as the primary external entry, so the remaining gap is canonical command-level entry promotion rather than further command-family expansion.`
  - Verification: `sed -n '1,220p' src/core/contracts/effect-settlement.ts`; `sed -n '1,220p' src/core/contracts/settlement-command.ts`; `sed -n '332,520p' src/core/runtime/runtime-settlement.ts`; `rg -n "settleRuntimeEffects|SettlementCommand|EffectSettlementInput|EffectSettlementResult" src tests`.`
  - Next: `Add RED tests for canonical command-level settlement entry.`
- 2026-07-30
  - Summary: `Completed Task 2 RED coverage. Added direct runtime-settlement tests for settleRuntimeCommands(...) plus command-oriented warning surfaces, and tightened robustness coverage so the canonical settlement contract must now expose command-level input/result types and runtime-settlement must export the new entry.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs` failed as expected before implementation because settleRuntimeCommands was not yet exported.`
  - Next: `Implement the canonical command-level settlement entry and demote settleRuntimeEffects(...) to adapter-only compatibility.`
- 2026-07-30
  - Summary: `Completed Task 3. Added command-oriented settlement input/result types next to the legacy Effect settlement adapter contract, exported settleRuntimeCommands(...) from runtime-settlement as the canonical entry, moved progression-plus-command orchestration behind that seam, and rewired settleRuntimeEffects(...) to become a thin compatibility adapter over the canonical command-level path.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/settlement-command-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
  - Next: `Commit and push this child, then open the next adjacent runtime-only settlement/event-system slice from this checkpoint.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-settlement-command-runtime-phase-one-plan.md`
  - `docs/superpowers/plans/2026-07-30-settlement-command-money-phase-two-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `c1eb9f2`, which converged `changeMoney` onto the shared settlement-command runtime seam.
  - `runtime-settlement` still exposes `settleRuntimeEffects(...)` as the primary external entry, so the remaining gap is command-level canonical entry rather than missing command coverage.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- audit the remaining Effect-first settlement seam
- add canonical command-level settlement input/result types alongside the legacy Effect settlement adapter contract
- export a command-level `runtime-settlement` entrypoint
- make `settleRuntimeEffects(...)` delegate through the canonical command-level entry
- add focused RED/GREEN coverage and sync this child plus the parent handoff

### Still Out Of Scope

- removing the legacy `Effect` contract from runtime callers
- inventory/city/building command family expansion
- broader event payload-schema redesign
- `src/main.ts`, UI, map, backpack, or style changes

## File Map

### Existing files to modify

- `src/core/contracts/effect-settlement.ts`
  - Add canonical command-level settlement input/result types while preserving legacy Effect adapter types.
- `src/core/runtime/runtime-settlement.ts`
  - Export the canonical command-level entry and demote `settleRuntimeEffects(...)` to compatibility adaptation.
- `tests/runtime-settlement-content.test.cjs`
  - Add direct command-level settlement runtime coverage.
- `tests/robustness.test.cjs`
  - Guard the canonical command-level settlement seam and the retained Effect adapter boundary.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-settlement-runtime-command-canonical-entry-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `runtime-settlement` exposes a canonical command-level entry
  - `settleRuntimeEffects(...)` remains a compatibility adapter over that canonical seam
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/runtime-dispatch-settlement.test.cjs tests/settlement-command-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Effect-First Seam

**Files:**
- Read: `src/core/contracts/effect-settlement.ts`
- Read: `src/core/contracts/settlement-command.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-runtime-command-canonical-entry-plan.md`

- [x] **Step 1: Record the remaining adapter-only gap**

Document that command coverage is now centralized, but `settleRuntimeEffects(...)` still remains the primary external `runtime-settlement` entry.

- [x] **Step 2: Lock the command-level canonical boundary**

Document that this child only promotes the command-level entry and does not remove legacy `Effect` callers yet.

## Task 2: Add RED Coverage For Command-Level Settlement Entry

**Files:**
- Modify: `tests/runtime-settlement-content.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing canonical-entry tests**

Cover:

- `runtime-settlement` exposes a direct command-level entry
- command-level settlement returns command-oriented result surfaces
- effect-level settlement remains functional through the compatibility adapter

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs
```

Expected:

- the new canonical-entry assertions fail before implementation

## Task 3: Implement Command-Level Canonical Settlement Entry

**Files:**
- Modify: `src/core/contracts/effect-settlement.ts`
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-settlement-runtime-command-canonical-entry-plan.md`

- [x] **Step 1: Add canonical command-level contract types**

Expose command-oriented settlement input/result types next to the legacy Effect adapter types.

- [x] **Step 2: Export the canonical command-level runtime entry**

Make progression-plus-command orchestration live behind the command-level seam, and keep `settleRuntimeEffects(...)` as an adapter.

- [x] **Step 3: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `runtime-settlement` exposes a canonical command-level entry.
- [x] `settleRuntimeEffects(...)` remains a compatibility adapter over that seam.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Settlement Runtime Command Canonical Entry`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-settlement-runtime-command-canonical-entry-and-open-next-runtime-only-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-settlement-runtime-command-canonical-entry-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Promote this completed-but-open checkpoint into branch history, then open the next adjacent runtime-only settlement/event-system child from the pushed commit.`
