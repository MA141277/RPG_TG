# Scene Runner Scene-End Continuation Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge automatic scene-end `nextEventId` continuation onto the shared router-first seam so `scene-runner` no longer starts follow-up events locally when a scene finishes under `story-runtime`.

**Architecture:** The prior child converged `start-event` actions through an injected scene-runner seam. This child targets the remaining adjacent caller, `continueSceneEvent(...)`, and narrows the design further by collapsing scene-owned continuation onto one shared optional continuation seam instead of separate start-event and scene-end callbacks. `scene-runner` stays story-agnostic, while `story-runtime` remains the only caller that injects router-first behavior.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime/story contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Tasks 2-4 are locally complete and verified. automatic scene-end continuation now routes through the shared router seam under story-runtime, and scene-runner continuation has been collapsed onto one shared continueFromSceneEvent seam used by both start-event and scene-end continuation.`
- Next Step: `Commit/push this checkpoint from codex/migration-hot-tasks, then decide whether the next adjacent child should target broader recursive event-chain execution beyond scene-runner-owned continuation.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner scene-end continuation convergence|scene runner start event convergence|story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 427/427; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stayed inside scene-runner, story-runtime, focused tests, and governance docs only. docs/superpowers/project-progress.md remains intentionally unrelated and unsynced. The remaining uncovered work, if any, is broader than scene-runner-owned continuation and should be planned as a separate runtime-only slice.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child for automatic scene-end continuation convergence after pushing the scene-runner start-event checkpoint.`
  - Verification: `sed -n '1,220p' docs/superpowers/project-progress.md; git show --stat --oneline --no-patch HEAD; git status --short --branch; sed -n '1,260p' src/application/scene/scene-runner.ts; sed -n '280,460p' src/application/story/story-runtime.ts; sed -n '240,420p' tests/event-continuation-runtime.test.cjs; sed -n '15500,15560p' tests/robustness.test.cjs; rg -n "continueSceneEvent|runSceneUntilPause|advanceScene|start-event|endedEventId|waiting-choice" src/application tests.`
  - Next: `Run Task 2 and add RED tests plus source-level assertions for router-first scene-end continuation while collapsing scene-owned continuation onto one seam.`
- 2026-07-30
  - Summary: `Completed the local scene-end continuation convergence checkpoint. scene-runner automatic scene-end follow-up now reuses the shared router-first seam under story-runtime, and the earlier start-event-specific callback was collapsed into one shared continueFromSceneEvent seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner scene-end continuation convergence|scene runner start event convergence|story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 427/427; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then decide whether broader event-chain routing beyond scene-runner continuation needs a new child plan.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-source-event-continuation-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-choice-event-continuation-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-scene-runner-start-event-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The pushed scene-runner start-event checkpoint is `5f81978`.
  - The remaining adjacent scene-runner continuation owner is automatic scene-end continuation via `continueSceneEvent(...)`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit automatic scene-end continuation via `continueSceneEvent(...)`
- add focused RED tests that require scene-end follow-up under `story-runtime` to route through the shared router seam
- collapse scene-owned continuation onto one narrow optional callback seam shared by `start-event` and scene-end continuation
- preserve loop fail-closed behavior and existing non-story scene-runner callers
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- broader recursive event-chain executor beyond scene-runner-owned continuation
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/scene/scene-runner.ts`
  - Unify `start-event` and scene-end continuation onto one optional seam.
- `src/application/story/story-runtime.ts`
  - Inject router-first continuation through the unified seam.
- `tests/event-continuation-runtime.test.cjs`
  - Add RED/GREEN coverage for router-first automatic scene-end continuation.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so scene-runner continuation cannot regress to separate or local-only seams.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-scene-runner-scene-end-continuation-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - automatic scene-end continuation routes through the shared router seam under `story-runtime`
  - `start-event` continuation still routes through the same seam after unification
  - loop fail-closed behavior remains intact
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner scene-end continuation convergence|scene runner start event convergence|story choice event continuation convergence|story source event continuation convergence|story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Scene-End Continuation Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/application/scene/scene-runner.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `tests/event-continuation-runtime.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-scene-runner-scene-end-continuation-convergence-plan.md`

- [x] **Step 1: Record the exact scene-end seam**

Run:

```bash
sed -n '1,220p' docs/superpowers/project-progress.md
git show --stat --oneline --no-patch HEAD
git status --short --branch
sed -n '1,260p' src/application/scene/scene-runner.ts
sed -n '280,460p' src/application/story/story-runtime.ts
sed -n '240,420p' tests/event-continuation-runtime.test.cjs
sed -n '15500,15560p' tests/robustness.test.cjs
rg -n "continueSceneEvent|runSceneUntilPause|advanceScene|start-event|endedEventId|waiting-choice" src/application tests
```

Expected:

- identify exactly where automatic scene-end continuation still starts the target event locally
- confirm `story-runtime` is the only caller that should inject router-first continuation now
- confirm the current `start-event` seam can be collapsed instead of introducing a second callback

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included caller branch: `continueSceneEvent(...)` automatic `nextEventId` continuation
- included refactor: collapse scene-owned continuation onto one seam shared by `start-event` and scene-end continuation
- excluded work: broader event-chain execution outside scene-runner
- current tests that can prove automatic continuation behavior before and after the change

Audit record:

- Included branch: `continueSceneEvent(...)` currently returns `continueToEvent(...)` output directly, so scene-runner still owns local automatic scene-end event start.
- Reusable seam: the existing `continueFromStartEvent` callback can be generalized into one unified continuation seam consumed by both `start-event` and scene-end continuation without making scene-runner import story-runtime.
- Excluded work: recursive routed continuation beyond scene-runner-owned continuation remains out of scope.
- Current proof tests: `tests/event-continuation-runtime.test.cjs` already covers loop fail-closed behavior and start-event router-first continuation; it can add a scene-end router test through `advanceStorySceneStep(...)`. `tests/robustness.test.cjs` already guards adjacent router-first slices and can be extended to assert the unified continuation seam remains explicit.

- [x] **Step 3: Sync the parent handoff with this active child**

Update the parent handoff so it points at this child as the next runtime-only continuation convergence slice after the pushed scene-runner start-event checkpoint.

## Task 2: Add Focused RED Coverage For Router-First Scene-End Continuation

**Files:**
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for story-runtime-driven scene-end continuation**

Add RED coverage that monkey-patches `dispatchRuntimeRequest(...)`, advances a scene to its end where the owning event has `nextEventId`, and proves `advanceStorySceneStep(...)` still bypasses the shared router before implementation.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires scene-runner to use one shared continuation seam for both `start-event` and scene-end continuation, and rejects local-only automatic continuation.

- [x] **Step 3: Run the RED suite**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runner scene-end continuation convergence"
```

Expected:

- at least one new assertion fails against the pre-implementation automatic continuation structure
- the failure points at scene-runner still starting the follow-up locally at scene end

## Task 3: Implement Unified Scene Continuation Convergence

**Files:**
- Modify: `src/application/scene/scene-runner.ts`
- Modify: `src/application/story/story-runtime.ts`

- [x] **Step 1: Collapse scene-owned continuation onto one optional seam**

Implement the thinnest change that:

- keeps scene-runner story-agnostic
- lets callers optionally replace local event start for both `start-event` and scene-end continuation
- preserves the existing fallback path for all current non-story callers

- [x] **Step 2: Inject router-first continuation from story-runtime only**

Use the unified seam only from story-runtime so both `advanceStorySceneStep(...)` paths reuse `routeStoryDirectEntry(...)`.

- [x] **Step 3: Keep focused behavior coverage green**

Update tests so they still prove:

- automatic scene-end continuation is router-first under story-runtime
- `start-event` continuation still routes through the same seam
- loop fail-closed behavior remains intact

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-scene-runner-start-event-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-scene-runner-scene-end-continuation-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**

Run the full verification plan listed above and record the exact outcomes in this child plan.

- [x] **Step 2: Record the new checkpoint**

Update:

- this child plan `Execution State`
- this child plan `Progress Log`
- the parent handoff `Execution State`
- the parent handoff `Progress Log`
- the prior start-event child if needed so the single-seam checkpoint is unambiguous

with the exact verified resume point and the remaining next child scope.

## Exit Check

- [x] automatic scene-end continuation no longer owns local event start when the story-runtime seam is provided.
- [x] scene-runner continuation is exposed as one shared seam instead of split start-event-specific ownership.
- [x] loop fail-closed behavior remains intact.
