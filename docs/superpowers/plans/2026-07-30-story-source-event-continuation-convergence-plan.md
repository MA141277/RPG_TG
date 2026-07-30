# Story Source Event Continuation Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `continueStoryFromSourceEvent(...)` onto the shared event-router seam so source-event follow-up no longer starts the next event through caller-owned continuation orchestration.

**Architecture:** Event Router Runtime Core Phase A and Story Direct Event Entry Convergence already established one canonical router-first seam for direct story entry. This child stays inside `src/application/story/story-runtime.ts` plus focused runtime tests, and narrows only the source-event continuation caller that currently uses `continueToEvent(...)` for both target resolution and event start. Scene action continuation inside `scene-runner` and choice continuation inside `choice-resolver` remain out of scope because they still own adjacent scene/choice semantics and should be converged in later isolated slices.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime/story contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Tasks 2-4 are locally complete and verified. continueStoryFromSourceEvent(...) now keeps continueToEvent(...) only for target resolution/loop guarding and routes the resolved follow-up event back through routeStoryDirectEntry(...) so source-event continuation reuses the shared router-first seam. chooseStorySceneOption(...), scene-runner start-event continuation, and broader event-chain execution remain unchanged.`
- Next Step: `Decide whether to keep this as a local verified checkpoint or commit/push it from codex/migration-hot-tasks before opening the next adjacent continuation slice for choice/scene-owned callers.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 10/10; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 424/424; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stayed inside story-runtime and focused tests only. docs/superpowers/project-progress.md remains intentionally unrelated and unsynced. The next uncovered adjacent seams are chooseStorySceneOption(...) and scene-runner start-event continuation, which still depend on continueToEvent(...) outside this child.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child for source-event continuation convergence after confirming direct-entry convergence is complete and the remaining uncovered seam is continueStoryFromSourceEvent(...).`
  - Verification: `git status --short --branch; sed -n '1,220p' docs/superpowers/project-progress.md; sed -n '1,220p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md; sed -n '100,470p' src/application/story/story-runtime.ts; sed -n '1,260p' src/application/events/event-continuation.ts; sed -n '1,180p' src/application/scene/choice-resolver.ts; sed -n '120,280p' src/application/scene/scene-runner.ts; sed -n '390,680p' tests/event-continuation-runtime.test.cjs; sed -n '15340,15530p' tests/robustness.test.cjs; rg -n "continueStoryFromSourceEvent|chooseStorySceneOption|continueToEvent|dispatchRuntimeRequest|dispatchEventRoute|routeStoryDirectEntry" src/application tests.`
  - Next: `Run Task 2 and add RED tests plus source-level assertions for router-first source-event continuation without widening into choice or scene-runner semantics.`
- 2026-07-30
  - Summary: `Completed the local source-event continuation convergence checkpoint. continueStoryFromSourceEvent(...) now reuses routeStoryDirectEntry(...) for canonical routed follow-up entry while preserving source-event settlement/world-definition behavior and leaving choice/scene continuation untouched.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 10/10; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 424/424; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Keep this child local for now unless the user explicitly wants commit/push; the next adjacent slice should target choice/scene-owned continuation callers rather than reopening source-event continuation.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The pushed direct-entry checkpoint is `a0eddfe`, but local branch head is newer because merge-back/doc updates were kept locally after that push.
  - The canonical router owner already exists; this child only converges one remaining caller onto that owner.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit `continueStoryFromSourceEvent(...)` and the `continueToEvent(...)` usage it currently owns
- add focused RED tests that require source-event continuation to reuse the shared router seam instead of caller-owned local continuation start
- implement the thinnest story-runtime reuse of the existing direct-entry router helper or equivalent narrow router adapter
- preserve current fail-closed behavior for missing/looped continuation targets
- preserve current settlement, progression, and world-definition passthrough behavior for source-event continuation
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- `chooseStorySceneOption(...)`
- scene-runner `start-event` action continuation
- any broader event-chain executor or recursive routed continuation runtime
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/story/story-runtime.ts`
  - Narrow `continueStoryFromSourceEvent(...)` so it resolves the next event id safely but routes the target event through the shared router seam instead of starting it locally.
- `tests/event-continuation-runtime.test.cjs`
  - Extend continuation behavior coverage to prove router-first source-event continuation while preserving settlement/world-definition behavior.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so `continueStoryFromSourceEvent(...)` cannot regress to caller-owned continuation start orchestration.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `continueStoryFromSourceEvent(...)` routes the continuation target through the shared router seam
  - source-event settlement continuation still applies settlement/progression and returns world-definition updates
  - missing/looped continuation targets still fail closed
  - `chooseStorySceneOption(...)` and scene-runner continuation remain unchanged in this child
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Source-Event Continuation Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/events/event-continuation.ts`
- Read: `src/application/scene/choice-resolver.ts`
- Read: `src/application/scene/scene-runner.ts`
- Read: `tests/event-continuation-runtime.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`

- [x] **Step 1: Record the exact continuation seam**

Run:

```bash
git status --short --branch
sed -n '1,220p' docs/superpowers/project-progress.md
sed -n '100,470p' src/application/story/story-runtime.ts
sed -n '1,260p' src/application/events/event-continuation.ts
sed -n '1,180p' src/application/scene/choice-resolver.ts
sed -n '120,280p' src/application/scene/scene-runner.ts
sed -n '390,680p' tests/event-continuation-runtime.test.cjs
sed -n '15340,15530p' tests/robustness.test.cjs
rg -n "continueStoryFromSourceEvent|chooseStorySceneOption|continueToEvent|dispatchRuntimeRequest|dispatchEventRoute|routeStoryDirectEntry" src/application tests
```

Expected:

- identify exactly where `continueStoryFromSourceEvent(...)` still owns local continuation orchestration
- confirm direct-entry router helper already exists and can likely be reused
- confirm choice/scene continuation remains adjacent but separate
- confirm `docs/superpowers/project-progress.md` remains intentionally unrelated and must stay unsynced

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included continuation caller: `continueStoryFromSourceEvent(...)`
- excluded continuation callers: `chooseStorySceneOption(...)`, scene-runner `start-event`, and any path still owned by `continueToEvent(...)` outside story-runtime
- current tests that can prove settlement/world-definition behavior before and after the change

Audit record:

- Included caller: `continueStoryFromSourceEvent(...)` is the only story-runtime continuation seam that still invokes `continueToEvent(...)`, consumes `continuation.state`, and then applies settlement plus `syncStoryScene(...)` locally.
- Existing reusable helper: `routeStoryDirectEntry(...)` already emits canonical `eventId` routing through `dispatchRuntimeRequest(...)` -> `dispatchEventRoute(...)` and then re-enters `applyTriggeredStoryEvent(..., { eventAlreadyStarted: true })` for settlement/progression/scene sync.
- Excluded callers: `chooseStorySceneOption(...)`, `scene-runner` `start-event`, and any continuation path that still depends on `continueToEvent(...)` outside `story-runtime`.
- Current proof tests: `tests/event-continuation-runtime.test.cjs` already proves source-event continuation behavior for follow-up, settlement, and world-definition updates, while `tests/robustness.test.cjs` already guards the existing direct-entry router-first convergence and can add a new ownership assertion for source-event continuation.

- [x] **Step 3: Sync the parent handoff with this active child**

Update the parent handoff so it points at this child as the next runtime-only continuation convergence slice after the completed direct-entry checkpoint.

## Task 2: Add Focused RED Coverage For Router-First Source-Event Continuation

**Files:**
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for continueStoryFromSourceEvent(...)**

Add RED coverage that monkey-patches `dispatchRuntimeRequest(...)` and proves source-event continuation still bypasses the shared router before implementation. Keep the current follow-up, settlement, and world-definition expectations.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires `continueStoryFromSourceEvent(...)` to reuse the shared router seam and rejects a direct local `applyStorySettlementEvent(...)` continuation block in the converged story-runtime function.

- [x] **Step 3: Run the RED suite**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story source event continuation convergence"
```

Expected:

- at least one new assertion fails against the pre-implementation source-event continuation structure
- the failure points at `continueStoryFromSourceEvent(...)` still owning local continuation start

## Task 3: Implement Source-Event Continuation Convergence

**Files:**
- Modify: `src/application/story/story-runtime.ts`
- Modify: `tests/event-continuation-runtime.test.cjs`

- [x] **Step 1: Reuse the shared router adapter for source-event continuation**

Implement the thinnest change that:

- keeps `continueToEvent(...)` only as the target-resolution / loop-guard helper
- routes the resolved continuation target back through the shared router seam
- preserves current fail-closed behavior when continuation is invalid
- preserves settlement/progression/world-definition passthrough behavior

- [x] **Step 2: Keep adjacent continuation callers unchanged**

Do not change:

- `chooseStorySceneOption(...)`
- scene-runner `start-event` continuation
- any continuation path outside `story-runtime`

- [x] **Step 3: Keep focused behavior coverage green**

Update tests so they still prove:

- event-owned playable continuation still reaches the follow-up event
- settlement continuation still updates player/world data
- router-first ownership is explicit in source-level guards

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**

Run the full verification plan listed above and record the exact outcomes in this child plan.

- [x] **Step 2: Record the new checkpoint and stale push-state cleanup**

Update:

- this child plan `Execution State`
- this child plan `Progress Log`
- the parent handoff `Execution State`
- the parent handoff `Progress Log`
- the direct-entry child closeout metadata if its stale `Push Status` or resume point still conflicts with the current branch history

with the exact verified resume point and the remaining next child scope.

## Exit Check

- [x] `continueStoryFromSourceEvent(...)` no longer owns local continuation start orchestration outside the shared router seam.
- [x] settlement/progression/world-definition behavior remains intact for source-event continuation.
- [x] `chooseStorySceneOption(...)` and scene-runner continuation remain untouched in this child.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Story Source Event Continuation Convergence`
- Parent Task: `Mod First Runtime Integration Handoff`
- Parent Stage: `Runtime Migration Narrowing`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Decide whether to keep this verified checkpoint local or commit/push it from codex/migration-hot-tasks before opening the next continuation child for choice/scene-owned callers.`
- Next Entry Document: `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Stay on codex/migration-hot-tasks at the verified local source-event continuation checkpoint, then either commit/push it or open the next adjacent continuation child without widening into UI/map/backpack/main shell work.`
