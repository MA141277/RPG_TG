# Runtime Settlement Commands Caller Phase One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let `RuntimeResult.settlement` carry canonical `commands` so router/dispatch/state-sync can begin adopting settlement commands without breaking legacy `effects` callers.

**Architecture:** `runtime-settlement` is now command-first internally, but the upstream runtime result surfaces still model settlement payloads as `effects`. This child adds `settlement.commands` as the canonical settlement payload on `RuntimeResult`, makes `runtime-dispatch` summarize settlement ownership in command-first form, and lets `state-sync-runtime` settle command payloads first while keeping `effects` as compatibility fallback.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Task 1 through Task 3 are complete locally. RuntimeResult.settlement now carries canonical settlement.commands, runtime-dispatch preserves command payload ownership in its settlement summary, and state-sync-runtime settles commands before falling back to legacy settlement.effects.`
- Next Step: `Commit and push this child checkpoint, then open the next adjacent runtime-only settlement/event-system slice that lowers one more caller family onto the canonical settlement-command payload.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs tests/runtime-settlement-content.test.cjs` passed 24/24; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 442/442; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` still fails only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
- Notes: `This child intentionally does not remove settlement.effects from RuntimeResult yet and does not migrate every feature runtime to emit commands directly in one batch. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only child after canonicalizing runtime-settlement entry so RuntimeResult.settlement can begin carrying canonical commands upstream with effects kept as compatibility fallback.`
  - Verification: `Plan authoring only.`
  - Next: `Audit RuntimeResult settlement payload ownership and add RED tests.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. runtime-settlement is already command-first internally, but RuntimeResult, runtime-dispatch, and state-sync-runtime still centered their caller seam on settlement.effects, so this child stayed narrowly scoped to adding settlement.commands plus canonical-first caller behavior without forcing repo-wide producer migration.`
  - Verification: `sed -n '1,220p' src/core/contracts/runtime-result.ts`; `sed -n '1,260p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,220p' src/core/runtime/state-sync-runtime.ts`; `git status --short`.`
  - Next: `Add RED tests for runtime-dispatch/state-sync canonical settlement command behavior.`
- 2026-07-30
  - Summary: `Completed Task 2 RED coverage. Added failing tests that require runtime-dispatch to preserve canonical settlement.commands, require state-sync-runtime to settle settlement.commands before app-state write-back, and tightened robustness coverage so RuntimeResult settlement payloads must expose canonical command ownership.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs` failed as expected before implementation on missing settlement.commands preservation and missing command-first state-sync settlement.`
  - Next: `Implement canonical settlement.commands on the caller seam and rerun the full focused verification set.`
- 2026-07-30
  - Summary: `Completed Task 3. RuntimeSettlementResult now exposes canonical settlement.commands, runtime-dispatch preserves command payload metadata in its settlement summary while keeping routed effect ownership separate, and state-sync-runtime settles settlement.commands before falling back to settlement.effects.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs tests/runtime-settlement-content.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing the required top-level title heading.`
  - Next: `Commit and push this child, then open the next adjacent runtime-only settlement/event-system slice from this checkpoint.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-settlement-command-money-phase-two-plan.md`
  - `docs/superpowers/plans/2026-07-30-settlement-runtime-command-canonical-entry-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `2ca188f`, which exposed `settleRuntimeCommands(...)` as the canonical runtime-settlement entry.
  - `RuntimeResult.settlement` still models payload ownership around `effects`, so the next gap is upstream caller adoption of canonical settlement commands.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- audit current settlement payload ownership in `RuntimeResult`, `runtime-dispatch`, and `state-sync-runtime`
- add `settlement.commands` to the shared runtime settlement payload shape
- make runtime-dispatch summarize settlement ownership in canonical command-first form
- make state-sync-runtime settle `settlement.commands` first and fall back to `settlement.effects`
- add focused RED/GREEN coverage and sync this child plus the parent handoff

### Still Out Of Scope

- removing `settlement.effects` from all callers
- changing every feature runtime to emit commands directly
- inventory/city/building command-family expansion
- `src/main.ts`, UI, map, backpack, or style changes

## File Map

### Existing files to modify

- `src/core/contracts/runtime-result.ts`
  - Extend `RuntimeSettlementResult` with canonical `commands`.
- `src/core/runtime/runtime-dispatch.ts`
  - Build runtime settlement summaries around commands first, with effects retained as compatibility payload.
- `src/core/runtime/state-sync-runtime.ts`
  - Prefer `settlement.commands` settlement and fall back to `settlement.effects`.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Add canonical command payload coverage for runtime-dispatch settlement summary.
- `tests/state-sync-runtime-commit.test.cjs`
  - Add state-sync coverage for settling canonical settlement commands before app-state write-back.
- `tests/robustness.test.cjs`
  - Guard the canonical settlement command payload on RuntimeResult/runtime-dispatch.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-settlement-commands-caller-phase-one-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `RuntimeResult.settlement` can carry canonical settlement commands
  - runtime-dispatch summarizes settlement ownership with commands first
  - state-sync-runtime settles canonical settlement commands before fallback effects
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs tests/runtime-settlement-content.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement uses explicit contract|settlement command runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Settlement Caller Ownership

**Files:**
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/state-sync-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-commands-caller-phase-one-plan.md`

- [x] **Step 1: Record the remaining caller-side gap**

Document that runtime-settlement is command-first internally, but `RuntimeResult.settlement` and state-sync still center settlement payload ownership on `effects`.

- [x] **Step 2: Lock the phase-one caller boundary**

Document that this child only adds canonical `settlement.commands` and fallback handling, not a whole-repo producer migration.

## Task 2: Add RED Coverage For Settlement Command Payloads

**Files:**
- Modify: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `tests/state-sync-runtime-commit.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing settlement command payload tests**

Cover:

- runtime-dispatch emits settlement summary with canonical `commands`
- state-sync-runtime settles `settlement.commands` before app-state write-back
- legacy `settlement.effects` behavior remains covered as compatibility fallback

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs tests/state-sync-runtime-commit.test.cjs
```

Expected:

- the new settlement command payload assertions fail before implementation

## Task 3: Implement Settlement Command Caller Adoption

**Files:**
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/state-sync-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-settlement-commands-caller-phase-one-plan.md`

- [x] **Step 1: Extend the shared runtime settlement payload contract**

Add canonical `commands` to `RuntimeSettlementResult` while retaining `effects` as compatibility payload.

- [x] **Step 2: Make runtime-dispatch and state-sync consume canonical commands first**

Summarize runtime settlement ownership in command-first form and settle command payloads before fallback effects.

- [x] **Step 3: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] `RuntimeResult.settlement` carries canonical settlement commands.
- [x] runtime-dispatch and state-sync-runtime prefer canonical settlement commands.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Settlement Commands Caller Phase One`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-runtime-settlement-commands-caller-phase-one-and-open-next-runtime-only-child`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-settlement-commands-caller-phase-one-plan.md`
- Push Status: `pending`
- Push Commit: `none`
- Resume From: `Promote this completed-but-open settlement.commands caller checkpoint into branch history, then open the next adjacent runtime-only settlement/event-system child from the pushed commit.`
