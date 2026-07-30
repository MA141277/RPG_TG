# Scene Runner Start Event Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `scene-runner` `start-event` actions onto the shared event-router seam so story scenes no longer start follow-up events through scene-owned local continuation orchestration.

**Architecture:** Prior story-runtime slices already converged direct entry, source-event continuation, and choice `nextEventId` continuation onto the canonical router-first seam. This child stays inside `src/application/scene/scene-runner.ts`, `src/application/story/story-runtime.ts`, and focused runtime tests. The scene runner remains story-agnostic by accepting one narrow optional callback seam for `start-event` actions; `story-runtime` injects router-first behavior through that seam. Automatic scene-end continuation (`continueSceneEvent(...)`) remains out of scope.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime/story contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `This checkpoint remains completed, and its earlier start-event-specific seam has now been subsumed by the later single-seam child. scene-runner currentAction.type === "start-event" still keeps continueToEvent(...) for target resolution and loop guarding, but now delegates event start through the shared continueFromSceneEvent seam used by both start-event and scene-end continuation under story-runtime.`
- Next Step: `Use docs/superpowers/plans/2026-07-30-scene-runner-scene-end-continuation-convergence-plan.md as the newer single-seam checkpoint for future resume; do not reopen this child independently unless a regression is isolated to start-event-only behavior.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner start event convergence|story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 426/426; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stayed inside scene-runner, story-runtime, focused tests, and governance docs only. docs/superpowers/project-progress.md remains intentionally unrelated and unsynced. A later child converged continueSceneEvent(...) too and collapsed the earlier start-event-specific seam into the shared continueFromSceneEvent seam.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child for scene-runner start-event convergence after pushing the choice continuation checkpoint.`
  - Verification: `git status --short --branch; sed -n '1,80p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md; sed -n '1,120p' src/application/scene/scene-runner.ts; sed -n '100,220p' src/application/scene/scene-runner.ts; sed -n '220,280p' src/application/scene/scene-runner.ts; rg -n "runSceneUntilPause|advanceScene|continueToEvent|start-event" src/application tests.`
  - Next: `Run Task 2 and add RED tests plus source-level assertions for router-first scene start-event continuation without widening into automatic scene-end continuation.`
- 2026-07-30
  - Summary: `Completed the local scene-runner start-event convergence checkpoint. scene-runner now exposes one narrow optional continueFromStartEvent seam, story-runtime injects router-first direct-entry behavior through it, and start-event actions no longer own local event start when running under story-runtime.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner start event convergence|story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 426/426; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then open the next adjacent continuation slice for automatic scene-end continuation if router convergence should continue.`
- 2026-07-30
  - Summary: `A later adjacent child converged automatic scene-end continuation too and collapsed the earlier continueFromStartEvent callback into the shared continueFromSceneEvent seam. This start-event child remains a valid historical checkpoint, but future resume should prefer the newer single-seam child.`
  - Verification: `See docs/superpowers/plans/2026-07-30-scene-runner-scene-end-continuation-convergence-plan.md for the superseding single-seam verification record.`
  - Next: `Do not reopen this child independently unless a regression is isolated to start-event-only behavior.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The pushed choice continuation checkpoint is `5879e60`.
  - The shared router owner already exists; this child only converges the remaining story-scene `start-event` caller.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit `scene-runner` `currentAction.type === "start-event"` and its current local `continueToEvent(...)` continuation start
- add focused RED tests that require story-runtime-driven scene `start-event` actions to reuse the shared router seam instead of local continuation start
- introduce one narrow optional callback seam in `SceneRunnerContext` so story-runtime can route by canonical `eventId` without making scene-runner import story-runtime
- preserve loop fail-closed behavior and existing non-story scene-runner call sites
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- automatic scene-end continuation via `continueSceneEvent(...)`
- `chooseStorySceneOption(...)`
- `continueStoryFromSourceEvent(...)`
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/scene/scene-runner.ts`
  - Add the narrow optional callback seam and use it only for `start-event` actions when provided.
- `src/application/story/story-runtime.ts`
  - Inject router-first scene `start-event` behavior into scene-runner through the new seam.
- `tests/event-continuation-runtime.test.cjs`
  - Add RED/GREEN coverage for router-first scene `start-event` continuation under story-runtime.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so scene-runner `start-event` cannot regress to local continuation start when the seam exists.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-scene-runner-start-event-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - story-runtime-driven scene `start-event` actions route through the shared router seam
  - loop fail-closed behavior remains intact
  - automatic scene-end continuation stays unchanged
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner start event convergence|story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Scene Start-Event Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/application/scene/scene-runner.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `tests/event-continuation-runtime.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-scene-runner-start-event-convergence-plan.md`

- [x] **Step 1: Record the exact scene start-event seam**

Run:

```bash
git status --short --branch
sed -n '1,120p' src/application/scene/scene-runner.ts
sed -n '100,220p' src/application/scene/scene-runner.ts
sed -n '220,280p' src/application/scene/scene-runner.ts
rg -n "runSceneUntilPause|advanceScene|continueToEvent|start-event" src/application tests
```

Expected:

- identify exactly where scene-runner still owns local `start-event` continuation start
- confirm story-runtime is the only caller that can safely inject router-first behavior now
- confirm automatic scene-end continuation remains separate

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included branch: `currentAction.type === "start-event"` inside `runSceneUntilPause(...)`
- excluded branch: `continueSceneEvent(...)` automatic scene-end continuation
- current tests that can prove story-runtime-driven scene `start-event` behavior before and after the change

Audit record:

- Included branch: scene-runner `start-event` currently calls `continueToEvent(...)` and immediately uses `continuedState.state`, which means the target event starts locally inside scene-runner.
- Existing reusable helper: story-runtime already owns `routeStoryDirectEntry(...)`, which can be injected through a narrow callback seam without making scene-runner import story-runtime.
- Excluded branch: `continueSceneEvent(...)` remains on the current path because it owns automatic scene-end continuation semantics.
- Current proof tests: `tests/event-continuation-runtime.test.cjs` already covers scene runner loop fail-closed behavior and story-runtime continuation families; it can add a routed scene `start-event` test via `advanceStorySceneStep(...)`. `tests/robustness.test.cjs` already guards the adjacent router-first convergence slices and can add a source-level assertion for the new seam.

- [x] **Step 3: Sync the parent handoff with this active child**

Update the parent handoff so it points at this child as the next runtime-only continuation convergence slice after the pushed choice checkpoint.

## Task 2: Add Focused RED Coverage For Router-First Scene Start-Event Continuation

**Files:**
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for story-runtime-driven scene start-event**

Add RED coverage that monkey-patches `dispatchRuntimeRequest(...)`, starts a story event whose scene advances into a `start-event` action, resets the initial direct-entry dispatch count, then proves `advanceStorySceneStep(...)` still bypasses the shared router before implementation.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires scene-runner `start-event` to use a narrow callback seam when provided and rejects a direct local `continuedState.state` start path as the only behavior.

- [x] **Step 3: Run the RED suite**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner start event convergence"
```

Expected:

- at least one new assertion fails against the pre-implementation scene `start-event` structure
- the failure points at scene-runner still starting the target event locally

## Task 3: Implement Scene Start-Event Convergence

**Files:**
- Modify: `src/application/scene/scene-runner.ts`
- Modify: `src/application/story/story-runtime.ts`

- [x] **Step 1: Add one narrow optional callback seam to SceneRunnerContext**

Implement the thinnest change that:

- keeps scene-runner story-agnostic
- lets callers optionally replace local `start-event` continuation start with an injected routed result
- preserves the existing fallback path for all current non-story callers

- [x] **Step 2: Inject router-first behavior from story-runtime only**

Use the new seam only from story-runtime so `advanceStorySceneStep(...)` and related scene progression can reuse `routeStoryDirectEntry(...)` for `start-event` actions.

- [x] **Step 3: Keep focused behavior coverage green**

Update tests so they still prove:

- scene `start-event` routing is router-first under story-runtime
- loop fail-closed behavior remains intact
- automatic scene-end continuation remains unchanged in this child

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-scene-runner-start-event-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**

Run the full verification plan listed above and record the exact outcomes in this child plan.

- [x] **Step 2: Record the new checkpoint**

Update:

- this child plan `Execution State`
- this child plan `Progress Log`
- the parent handoff `Execution State`
- the parent handoff `Progress Log`
- the prior choice child closeout metadata if needed so the next child pointer is unambiguous

with the exact verified resume point and the remaining next child scope.

## Exit Check

- [x] scene-runner `start-event` no longer owns local event start when the story-runtime seam is provided.
- [x] loop fail-closed behavior remains intact.
- [x] automatic scene-end continuation remains untouched in this child.
- [ ] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Scene Runner Start Event Convergence`
- Parent Task: `Mod First Runtime Integration Handoff`
- Parent Stage: `Runtime Migration Narrowing`
- Closeout Status: `running`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Finish Task 2 RED coverage, then converge scene-runner start-event routing onto the shared router seam.`
- Next Entry Document: `docs/superpowers/plans/2026-07-30-scene-runner-start-event-convergence-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-scene-runner-start-event-convergence-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Stay on codex/migration-hot-tasks and continue with Task 2 RED coverage for scene-runner start-event convergence without widening into automatic scene-end continuation or shell work.`
