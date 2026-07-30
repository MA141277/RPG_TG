# Story Choice Event Continuation Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `chooseStorySceneOption(...)` next-event continuation onto the shared event-router seam so story choice follow-up no longer starts the next event through choice-owned local continuation orchestration.

**Architecture:** Event Router Runtime Core Phase A, direct-entry convergence, and source-event continuation convergence already established the canonical router-first seam inside `story-runtime`. This child stays inside `src/application/story/story-runtime.ts` plus focused runtime tests, and narrows only the `ChoiceOption.nextEventId` branch owned by `chooseStorySceneOption(...)`. `scene-runner` `start-event` actions and broader recursive event-chain execution remain out of scope because they add scene-action semantics that should be converged in a later isolated slice.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime/story contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Tasks 2-4 are locally complete and verified. chooseStorySceneOption(...) now routes the selectedOption.nextEventId branch through routeStoryDirectEntry(...) while preserving choice effects, loop fail-closed behavior, and world-definition passthrough. nextSceneId, cursor-advance choice behavior, and scene-runner start-event continuation remain unchanged.`
- Next Step: `This checkpoint was promoted after verification. The next adjacent continuation slice is docs/superpowers/plans/2026-07-30-scene-runner-start-event-convergence-plan.md, and automatic scene-end continuation remains the next uncovered caller after that child.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 11/11; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 425/425; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stayed inside story-runtime and focused tests only. docs/superpowers/project-progress.md remains intentionally unrelated and unsynced. The next uncovered adjacent continuation seam is scene-runner start-event routing.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child for choice next-event continuation convergence after pushing the source-event continuation checkpoint.`
  - Verification: `git status --short --branch; sed -n '1,120p' src/application/story/story-runtime.ts; sed -n '1,260p' src/application/scene/choice-resolver.ts; sed -n '120,390p' tests/event-continuation-runtime.test.cjs; rg -n "chooseStorySceneOption|resolveChoiceOption|continueToEvent|waiting-choice" src/application tests; sed -n '1,80p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md.`
  - Next: `Run Task 2 and add RED tests plus source-level assertions for router-first choice next-event continuation without widening into scene-runner semantics.`
- 2026-07-30
  - Summary: `Completed the local choice next-event continuation convergence checkpoint. chooseStorySceneOption(...) now routes valid nextEventId choices through routeStoryDirectEntry(...), preserves choice effects and world definitions, and keeps nextSceneId/plain choice behavior on the existing resolver path.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 11/11; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 425/425; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this child into branch history, then target scene-runner start-event continuation rather than reopening choice or source-event callers.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The pushed source-event continuation checkpoint is `fb32b99`.
  - The shared router owner already exists; this child only converges the remaining story-runtime choice caller.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit `chooseStorySceneOption(...)` and its current `resolveChoiceOption(...)` ownership of `nextEventId` continuation
- add focused RED tests that require choice next-event continuation to reuse the shared router seam instead of local continuation start
- implement the thinnest story-runtime-owned handling for `ChoiceOption.nextEventId`
- preserve current choice effects, loop fail-closed behavior, and world-definition passthrough
- leave `nextSceneId` and plain cursor-advance choice behavior on the existing resolver path
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- `scene-runner` `start-event` continuation
- any broader event-chain executor or recursive routed continuation runtime
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/story/story-runtime.ts`
  - Narrow `chooseStorySceneOption(...)` so only the `nextEventId` branch routes through the shared router seam while preserving other choice branches.
- `tests/event-continuation-runtime.test.cjs`
  - Extend choice continuation behavior coverage to prove router-first next-event continuation and preserve world-definition behavior.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so `chooseStorySceneOption(...)` cannot regress to choice-owned local continuation start.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `chooseStorySceneOption(...)` routes `nextEventId` continuation targets through the shared router seam
  - choice effects and world-definition passthrough remain intact
  - loop / invalid next-event behavior remains fail-closed
  - `nextSceneId` and cursor-advance choice behavior remain unchanged
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Choice Next-Event Continuation Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/scene/choice-resolver.ts`
- Read: `tests/event-continuation-runtime.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`

- [x] **Step 1: Record the exact choice continuation seam**

Run:

```bash
git status --short --branch
sed -n '1,120p' src/application/story/story-runtime.ts
sed -n '1,260p' src/application/scene/choice-resolver.ts
sed -n '120,390p' tests/event-continuation-runtime.test.cjs
rg -n "chooseStorySceneOption|resolveChoiceOption|continueToEvent|waiting-choice" src/application tests
```

Expected:

- identify exactly where `chooseStorySceneOption(...)` still owns local `nextEventId` continuation orchestration
- confirm shared direct-entry router helper already exists
- confirm `nextSceneId` and cursor-advance behavior can stay on the existing resolver path

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included caller branch: `chooseStorySceneOption(...)` with `selectedOption.nextEventId`
- excluded branches: `nextSceneId`, plain cursor advance, and `scene-runner` `start-event`
- current tests that can prove choice/world-definition behavior before and after the change

Audit record:

- Included branch: `chooseStorySceneOption(...)` currently delegates all choice continuation to `resolveChoiceOption(...)`, whose `nextEventId` branch still calls `continueToEvent(...)` directly.
- Existing reusable helper: `routeStoryDirectEntry(...)` already emits canonical `eventId` routing through `dispatchRuntimeRequest(...)` -> `dispatchEventRoute(...)` and then re-enters `applyTriggeredStoryEvent(..., { eventAlreadyStarted: true })` for settlement/progression/scene sync.
- Excluded branches: `nextSceneId`, cursor advance without next event, and `scene-runner` `start-event` continuation.
- Current proof tests: `tests/event-continuation-runtime.test.cjs` already proves choice next-event world-definition passthrough and loop fail-closed behavior; `tests/robustness.test.cjs` already guards router-first direct-entry/source-event convergence and can add a new ownership assertion for choice next-event continuation.

- [x] **Step 3: Sync the parent handoff with this active child**

Update the parent handoff so it points at this child as the next runtime-only continuation convergence slice after the pushed source-event checkpoint.

## Task 2: Add Focused RED Coverage For Router-First Choice Next-Event Continuation

**Files:**
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for chooseStorySceneOption(...)**

Add RED coverage that monkey-patches `dispatchRuntimeRequest(...)` and proves the `nextEventId` branch still bypasses the shared router before implementation. Keep current world-definition and follow-up behavior expectations.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires `chooseStorySceneOption(...)` to reuse the shared router seam for `nextEventId` choices and rejects a direct local `resolveChoiceOption(...)`-owned next-event continuation in the converged story-runtime function.

- [x] **Step 3: Run the RED suite**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story choice event continuation convergence"
```

Expected:

- at least one new assertion fails against the pre-implementation choice next-event structure
- the failure points at `chooseStorySceneOption(...)` still owning local next-event continuation start

## Task 3: Implement Choice Next-Event Continuation Convergence

**Files:**
- Modify: `src/application/story/story-runtime.ts`
- Modify: `tests/event-continuation-runtime.test.cjs`

- [x] **Step 1: Route only the next-event choice branch through the shared adapter**

Implement the thinnest change that:

- preserves choice effects before routing
- keeps loop / invalid next-event fail-closed behavior
- routes valid `nextEventId` choices through the shared router seam
- leaves `nextSceneId` and cursor-advance behavior on the existing resolver path

- [x] **Step 2: Keep adjacent continuation callers unchanged**

Do not change:

- `scene-runner` `start-event` continuation
- `continueStoryFromSourceEvent(...)`
- any continuation path outside `story-runtime`

- [x] **Step 3: Keep focused behavior coverage green**

Update tests so they still prove:

- choice next-event follow-up and world definitions stay correct
- loop fail-closed behavior remains intact
- router-first ownership is explicit in source-level guards

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**

Run the full verification plan listed above and record the exact outcomes in this child plan.

- [x] **Step 2: Record the new checkpoint**

Update:

- this child plan `Execution State`
- this child plan `Progress Log`
- the parent handoff `Execution State`
- the parent handoff `Progress Log`
- the source-event child closeout metadata if needed so the next child pointer is unambiguous

with the exact verified resume point and the remaining next child scope.

## Exit Check

- [x] `chooseStorySceneOption(...)` no longer owns local next-event continuation start orchestration outside the shared router seam.
- [x] choice effects, loop fail-closed behavior, and world-definition passthrough remain intact.
- [x] `nextSceneId`, cursor-advance choice behavior, and scene-runner continuation remain untouched in this child.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Story Choice Event Continuation Convergence`
- Parent Task: `Mod First Runtime Integration Handoff`
- Parent Stage: `Runtime Migration Narrowing`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Decide whether to keep this verified checkpoint local or commit/push it from codex/migration-hot-tasks before opening the next continuation child for scene-runner start-event routing.`
- Next Entry Document: `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Stay on codex/migration-hot-tasks at the verified local choice-event continuation checkpoint, then either commit/push it or open the next adjacent continuation child for scene-runner start-event routing without widening into UI/map/backpack/main shell work.`
