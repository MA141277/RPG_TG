# Story Settlement Next Event Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the missing `mod-first-dev` story settlement `nextEventId` continuation path on the current runtime-only branch so settlement-authored follow-up events can continue through the converged story direct-entry seam.

**Architecture:** Keep this child narrow and runtime-only. The work stays inside `src/application/story/**`, the existing event-continuation seam, and focused tests; it does not introduce a new global event-chain owner yet, and it does not rewrite script-editor schemas, UI wiring, or `src/main.ts`. Settlement follow-up must resolve through the current branch's shared `routeStoryDirectEntry(...)` seam instead of reintroducing caller-local `startEvent(...)` logic.

**Tech Stack:** TypeScript, Node test runner, `pnpm run build:test`, targeted `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `The missing mod-first-dev story settlement nextEventId continuation is restored and pushed at 494de4a on codex/migration-hot-tasks: settlement-authored follow-up events continue through resolveEventContinuation(...) + routeStoryDirectEntry(...), settlement contents still apply before continuation, and no local startEvent(...) path was reintroduced.`
- Next Step: `Treat this child as a pushed completed-but-open checkpoint, then continue directly into the next runtime-only event-system slice instead of reopening this settlement path.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 17/17. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/story-settlement-continuation.test.cjs` passed 1/1. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story settlement next-event convergence|story source event continuation convergence|story choice event continuation convergence|story runtime activation seam convergence|scene fallback continuation seam convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 437/437. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed. `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output. `git diff --check` passed. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` still fails only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
- Notes: `This child intentionally stops short of a global event-chain runtime. It only restores the already-proven story settlement follow-up path while preserving the branch's single direct-entry seam. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the child plan for restoring story settlement nextEventId continuation on top of the converged event-router baseline.`
  - Verification: `Plan authoring only.`
  - Next: `Write the RED tests and confirm the current branch still misses the settlement follow-up path.`
- 2026-07-30
  - Summary: `Completed the runtime-only child: story settlement events now apply settlement contents, then continue through settlement.nextEventId on the shared direct-entry seam, restoring the missing mod-first-dev continuation path without introducing a new global chain owner.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 17/17. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/story-settlement-continuation.test.cjs` passed 1/1. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story settlement next-event convergence|story source event continuation convergence|story choice event continuation convergence|story runtime activation seam convergence|scene fallback continuation seam convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 437/437. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed. `git diff --check` passed.`
  - Next: `Commit/push this checkpoint, then open the next runtime-only event-system child.`
- 2026-07-30
  - Summary: `Committed and pushed the story settlement next-event convergence checkpoint as 494de4a on codex/migration-hot-tasks.`
  - Verification: `git show --stat --oneline 494de4a`; `git push origin codex/migration-hot-tasks`
  - Next: `Continue directly into the next runtime-only event-system child from the pushed checkpoint.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed child:
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The branch already converged explicit local `startEvent(...)` callers behind shared activation/continuation seams, so this child can focus only on the missing settlement-authored next-event continuation.
  - `docs/superpowers/project-progress.md` still points at unrelated map-renderer work and must remain unchanged for this isolated runtime child.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- restore settlement-authored `nextEventId` continuation in shared story runtime flow
- keep settlement continuation on the converged `routeStoryDirectEntry(...)` seam
- preserve loop/duplicate protection through the existing event-continuation tracker
- add focused runtime tests and ownership guards for the restored path
- sync this child plan and the parent handoff after verification

### Still Out Of Scope

- a generic global event-chain runtime
- a settlement-command runtime
- script-editor schema or pack-format redesign
- UI, map, backpack, style, or `src/main.ts` changes
- broad continuation rewrites outside the story settlement path

## File Map

### Existing files to modify

- `src/application/story/story-runtime.ts`
  - Reintroduce settlement-authored follow-up continuation on the current shared direct-entry seam.
- `tests/event-continuation-runtime.test.cjs`
  - Add behavior coverage that fails until settlement `nextEventId` continuation is restored.
- `tests/robustness.test.cjs`
  - Add ownership guards so story settlement continuation stays on the shared seam and does not regress to local `startEvent(...)`.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Record the new child as the current adjacent runtime-only continuation once verified.
- `docs/superpowers/plans/2026-07-30-story-settlement-next-event-convergence-plan.md`
  - Track execution state, progress log, and verification for this child.

### Existing files expected to be deleted

- `None.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - settlement events can apply settlement contents and then continue to settlement-authored `nextEventId`
  - the restored continuation reuses the current shared direct-entry seam
  - loop protection still prevents revisiting already continued events
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/story-settlement-continuation.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story settlement next-event convergence|story source event continuation convergence|story choice event continuation convergence|story runtime activation seam convergence|scene fallback continuation seam convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Restore Story Settlement Follow-Up Continuation

**Files:**
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-30-story-settlement-next-event-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`

- [x] **Step 1: Add failing runtime coverage for settlement-authored next-event continuation**

Add a focused test where:

- a source event routes into a settlement event
- the settlement applies content
- the settlement definition carries `nextEventId`
- the follow-up event is started through the shared story direct-entry seam

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs
```

Expected:

- the new settlement follow-up assertion fails on the current branch before implementation

- [x] **Step 3: Implement the minimal story-runtime continuation logic**

Restore settlement-authored continuation in `src/application/story/story-runtime.ts` by:

- reading the authored settlement definition for the active settlement event
- resolving `settlement.nextEventId` through `resolveEventContinuation(...)`
- routing the resolved follow-up target through `routeStoryDirectEntry(...)`
- preserving the existing convergence rule that story direct entry remains the only local bridge

- [x] **Step 4: Add or update ownership guard coverage**

Guard that the restored path:

- stays inside shared story-runtime helpers
- uses `routeStoryDirectEntry(...)`
- does not reintroduce local `startEvent(...)` calls in the settlement continuation block

- [x] **Step 5: Run GREEN verification and sync governance**

Run the full verification set from `Verification Plan`, then update:

- this child plan `Execution State`
- this child plan `Progress Log`
- parent handoff `Execution State` and `Progress Log`

## Exit Check

- [x] Settlement-authored `nextEventId` continuation works on the covered story runtime path.
- [x] The restored continuation reuses the shared story direct-entry seam instead of local `startEvent(...)`.
- [x] Existing continuation loop protection still fails closed on revisits.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.
- [x] Closeout state is recorded before the child is marked `completed-but-open` or `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Story Settlement Next Event Convergence`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-and-continue`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-story-settlement-next-event-convergence-plan.md`
- Push Status: `success`
- Push Commit: `494de4a`
- Resume From: `Open this child plan, then continue directly into the next runtime-only event-system child from pushed checkpoint 494de4a.`
