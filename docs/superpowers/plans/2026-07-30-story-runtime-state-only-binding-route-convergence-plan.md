# Story Runtime State-Only Binding Route Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `story-runtime`'s state-only binding continuation path onto the shared story direct-entry seam so `applyTriggeredStoryEvent(...)` no longer starts those events locally.

**Architecture:** Prior children already moved direct story entry, source-event continuation, choice next-event continuation, scene-runner continuation, event trigger activation, event binding activation, and navigation enter-house on-enter activation onto shared router seams. One remaining narrow direct-start branch still lives in `application/story/story-runtime.ts`: when binding activation produced a state-only runtime-action event, `applyTriggeredStoryEvent(...)` still calls `startEvent(...)` directly. This child keeps `triggerStoryEventBindings(...)` binding-owned, but routes that state-only continuation through the existing single `routeStoryDirectEntry(...)` seam with an explicit "actions already applied" option so runtime actions are not re-applied.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `story-runtime now routes the remaining state-only binding continuation branch back through routeStoryDirectEntry(...) with explicit actionsAlreadyApplied ownership, so applyTriggeredStoryEvent(...) no longer starts those events locally and the shared direct-entry seam remains singular.`
- Next Step: `Promote this verified checkpoint into branch history, then decide whether the next narrow runtime-only convergence slice should target continueToEvent(...) contract narrowing or another remaining story-runtime/application-level direct-start helper.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 7/7; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/indoor-screen-story-runtime.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story runtime state-only binding route convergence|story direct event entry convergence|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 431/431; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
- Notes: `This child stayed inside src/application/story/story-runtime.ts, focused tests, and governance docs. triggerStoryEventBindings(...) remains binding-owned for candidate selection and docs/superpowers/project-progress.md remains intentionally unrelated and unsynced.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next runtime-only child for story-runtime state-only binding route convergence after pushing the navigation enter-house checkpoint.`
  - Verification: `git status --short --branch; sed -n '1,260p' src/application/story/story-runtime.ts; sed -n '220,430p' tests/event-router-runtime.test.cjs; sed -n '15490,15630p' tests/robustness.test.cjs; rg -n "applyTriggeredStoryEvent|routeStoryDirectEntry|isStateOnlyRuntimeActionEvent|dispatchRuntimeRequest|triggerStoryEventBindings" src tests.`
  - Next: `Add RED behavior/source assertions for state-only binding continuation without widening the generic event-continuation helper or scene-runner contracts.`
- 2026-07-30
  - Summary: `Completed the story-runtime state-only binding route convergence child as a verified completed-but-open checkpoint. state-only binding continuation now reuses routeStoryDirectEntry(...) with actionsAlreadyApplied ownership, triggerStoryEventBindings(...) stays binding-owned, and the new behavior test proves this branch now exercises dispatchRuntimeRequest(...) instead of locally starting the event.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/indoor-screen-story-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story runtime state-only binding route convergence|story direct event entry convergence|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
  - Next: `Commit/push this checkpoint, then choose the next remaining direct-start convergence slice.`

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-binding-runtime-route-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-navigation-enter-house-route-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The pushed navigation enter-house checkpoint is `54450ac`.
  - The active uncovered branch is `applyTriggeredStoryEvent(...)` for state-only binding continuation inside `src/application/story/story-runtime.ts`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- route story-runtime state-only binding continuation through the existing direct-entry seam
- extend `routeStoryDirectEntry(...)` only as needed to avoid reapplying runtime actions
- add focused RED/GREEN coverage for the binding state-only path
- preserve `triggerStoryEventBindings(...)` as the binding-owned selection/activation seam
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- generic `continueToEvent(...)` contract changes
- `scene-runner`, `choice-resolver`, `dialogue-runtime`, or `game-store` continuation rewrites
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/story/story-runtime.ts`
  - Route the remaining state-only binding continuation branch through the shared direct-entry seam.
- `tests/event-router-runtime.test.cjs`
  - Add RED/GREEN coverage proving state-only binding continuation now exercises the shared seam.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so `applyTriggeredStoryEvent(...)` cannot regress to local event start ownership.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-story-runtime-state-only-binding-route-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - state-only binding continuation routes through the shared story direct-entry seam
  - runtime actions on that path are not re-applied
  - non-state-only binding path remains binding-owned
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/indoor-screen-story-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story runtime state-only binding route convergence|story direct event entry convergence|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Story Runtime State-Only Binding Ownership

**Files:**
- Read: `src/application/story/story-runtime.ts`
- Read: `tests/event-router-runtime.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-story-runtime-state-only-binding-route-convergence-plan.md`

- [x] **Step 1: Record the exact direct-start branch**

Run:

```bash
git status --short --branch
sed -n '1,260p' src/application/story/story-runtime.ts
sed -n '220,430p' tests/event-router-runtime.test.cjs
sed -n '15490,15630p' tests/robustness.test.cjs
rg -n "applyTriggeredStoryEvent|routeStoryDirectEntry|isStateOnlyRuntimeActionEvent|dispatchRuntimeRequest|triggerStoryEventBindings" src tests
```

Expected:

- identify exactly where `applyTriggeredStoryEvent(...)` still starts state-only binding events locally
- confirm the existing shared direct-entry seam can be reused
- confirm `triggerStoryEventBindings(...)` itself should remain binding-owned

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included branch: `applyTriggeredStoryEvent(...)` with `eventAlreadyStarted !== true`
- excluded work: generic `continueToEvent(...)` and scene-runner contract rewrites
- current tests that can prove seam reuse before and after the change

## Task 2: Add Focused RED Coverage For State-Only Binding Continuation

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for triggerStoryEvents(...) state-only bindings**

Add RED coverage that monkey-patches `dispatchRuntimeRequest(...)` and proves the state-only binding continuation branch still bypasses the shared story direct-entry seam before implementation.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires `applyTriggeredStoryEvent(...)` to reuse `routeStoryDirectEntry(...)` for the not-already-started branch and rejects a local `startEvent(...)` fallback there.

## Task 3: Implement Story Runtime State-Only Binding Route Convergence

**Files:**
- Modify: `src/application/story/story-runtime.ts`

- [x] **Step 1: Reuse the existing single story direct-entry seam**

Extend `routeStoryDirectEntry(...)` only as needed so callers can say whether runtime actions were already applied before routing.

- [x] **Step 2: Remove local state-only start ownership from applyTriggeredStoryEvent(...)**

Route the not-already-started branch through the shared seam while preserving settlement/progression behavior.

- [x] **Step 3: Keep non-state-only binding activation binding-owned**

Do not move candidate selection or activation out of `triggerStoryEventBindings(...)`.

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-story-runtime-state-only-binding-route-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**
- [x] **Step 2: Record the new checkpoint**

## Exit Check

- [x] `applyTriggeredStoryEvent(...)` no longer owns local state-only binding event start.
- [x] `routeStoryDirectEntry(...)` remains the only shared story direct-entry router seam.
- [x] non-state-only binding activation remains binding-owned.
