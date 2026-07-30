# Event Binding Runtime Route Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `event-binding-runtime` activation onto the shared `event-router` seam so binding-selected events no longer start directly inside `runEventBindingRuntime(...)`.

**Architecture:** The previous child converged `event-runtime` trigger activation onto `dispatchEventRoute(...)` while keeping the `EventRuntimeResult` seam unchanged. This child applies the same pattern to `event-binding-runtime`: keep candidate selection and activation metadata intact, but route the selected event through the canonical router before returning state. The change stays inside `src/core/runtime/event-binding-runtime.ts` plus focused tests and governance docs.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `runEventBindingRuntime(...) now routes non-state-only binding-selected events through routeBindingEvent(...) -> dispatchEventRoute(...), while preserving the existing EventBindingRuntimeResult seam and current building/story binding callers.`
- Next Step: `Promote this verified checkpoint into branch history, then decide whether enter-house or another narrow direct-start caller family is the next runtime-only convergence slice.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event binding runtime route convergence|event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 429/429; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
- Notes: `This child stayed inside src/core/runtime/event-binding-runtime.ts, focused tests, and governance docs. enter-house remains a separate caller family for a later slice, and docs/superpowers/project-progress.md remains intentionally unrelated and unsynced.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next runtime-only child for event-binding route convergence after pushing the event-trigger runtime checkpoint.`
  - Verification: `git status --short --branch; sed -n '1,220p' src/core/runtime/event-binding-runtime.ts; sed -n '540,660p' src/application/story/story-runtime.ts; sed -n '1,220p' src/application/building/building-container-event-runtime.ts; sed -n '1,220p' tests/event-binding-start-runtime.test.cjs; rg -n "runEventBindingRuntime|dispatchEventRoute|startEvent|selectEventBindingActivation" src tests.`
  - Next: `Run Task 2 and add RED tests plus source-level assertions for router-first binding activation without widening into enter-house or story-runtime direct-entry callers.`
- 2026-07-30
  - Summary: `Completed the event-binding runtime route convergence child as a verified completed-but-open checkpoint. event-binding-runtime now routes selected events through the shared event-router seam, the new behavior test proves dispatchEventRoute(...) is exercised, and the robustness guard now anchors ownership on routeBindingEvent(...) rather than demanding an inline router call.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event binding runtime route convergence|event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
  - Next: `Commit/push this binding-route convergence checkpoint, then choose the next narrow direct-start caller family.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-trigger-runtime-route-convergence-plan.md`
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
  - The pushed event-trigger route checkpoint is `f9cfd32`.
  - The active uncovered runtime-owned direct-start caller is `src/core/runtime/event-binding-runtime.ts`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit `runEventBindingRuntime(...)` direct start ownership
- add focused RED tests that require binding-selected event activation to route through `dispatchEventRoute(...)`
- preserve current `EventBindingRuntimeResult` shape for current callers
- keep activation metadata and state-only runtime-action behavior intact
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- `enter-house`
- broader recursive event-chain execution after binding activation
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/core/runtime/event-binding-runtime.ts`
  - Route binding-selected events through `dispatchEventRoute(...)` while preserving the current result envelope.
- `tests/event-binding-start-runtime.test.cjs`
  - Add RED/GREEN coverage for router-first binding activation.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so `event-binding-runtime` cannot regress to direct binding-owned event start.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-event-binding-runtime-route-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `runEventBindingRuntime(...)` routes activated events through `dispatchEventRoute(...)`
  - building-container and story binding callers still receive the same activation/session behavior
  - state-only runtime actions still avoid opening scenes
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event binding runtime route convergence|event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Event Binding Route Ownership

**Files:**
- Read: `src/core/runtime/event-binding-runtime.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/building/building-container-event-runtime.ts`
- Read: `tests/event-binding-start-runtime.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-event-binding-runtime-route-convergence-plan.md`

- [x] **Step 1: Record the exact binding activation seam**

Run:

```bash
git status --short --branch
sed -n '1,220p' src/core/runtime/event-binding-runtime.ts
sed -n '540,660p' src/application/story/story-runtime.ts
sed -n '1,220p' src/application/building/building-container-event-runtime.ts
sed -n '1,220p' tests/event-binding-start-runtime.test.cjs
rg -n "runEventBindingRuntime|dispatchEventRoute|startEvent|selectEventBindingActivation" src tests
```

Expected:

- identify exactly where `event-binding-runtime` still starts the selected event directly
- confirm current callers already depend on `EventBindingRuntimeResult` rather than internal start mechanics
- confirm `enter-house` remains separate

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included caller family: `runEventBindingRuntime(...)`
- excluded caller family: `enter-house`
- current tests that can prove router-first binding activation before and after the change

Audit record:

- Included path: `runEventBindingRuntime(...)` currently returns `state: startEvent(actionState, selection.eventDefinition)` for non-state-only binding selections.
- Existing reusable seam: `dispatchEventRoute(...)` already supports dialogue/settlement event entities and the previous child established the same bridge pattern inside `event-runtime`.
- Excluded caller: `enter-house` still starts events directly in application land and should stay isolated for a later slice.
- Current proof tests: `tests/event-binding-start-runtime.test.cjs` already proves selected-event start and state-only runtime-action behavior; `tests/robustness.test.cjs` can add a router-ownership assertion similar to the trigger-runtime child.

- [x] **Step 3: Sync the parent handoff with this active child**

Update the parent handoff so it points at this child as the next runtime-only convergence slice after the pushed event-trigger route checkpoint.

## Task 2: Add Focused RED Coverage For Router-First Binding Activation

**Files:**
- Modify: `tests/event-binding-start-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for runEventBindingRuntime(...)**

Add RED coverage that monkey-patches `dispatchEventRoute(...)` and proves `runEventBindingRuntime(...)` still bypasses the shared event-router seam before implementation.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires `event-binding-runtime` to route activated events through `dispatchEventRoute(...)` and rejects a direct `startEvent(...)` return path in `runEventBindingRuntime(...)`.

- [x] **Step 3: Run the RED suite**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event binding runtime route convergence"
```

Expected:

- at least one new assertion fails against the pre-implementation binding path
- the failure points at `event-binding-runtime` still starting the event locally after selection

## Task 3: Implement Event Binding Route Convergence

**Files:**
- Modify: `src/core/runtime/event-binding-runtime.ts`

- [x] **Step 1: Route activated binding events through the canonical event-router seam**

Implement the thinnest change that:

- keeps `EventBindingRuntimeResult` unchanged for current callers
- routes selected events through `dispatchEventRoute(...)`
- preserves activation metadata and state-only action behavior

- [x] **Step 2: Keep current callers unchanged**

Do not widen the caller surface of:

- `triggerStoryEventBindings(...)`
- `triggerBuildingContainerItemAction(...)`

- [x] **Step 3: Keep focused behavior coverage green**

Update tests so they still prove:

- router-first binding activation is explicit
- state-only runtime actions still avoid opening scenes
- current caller behavior remains intact

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-event-binding-runtime-route-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**

Run the full verification plan listed above and record the exact outcomes in this child plan.

- [x] **Step 2: Record the new checkpoint**

Update:

- this child plan `Execution State`
- this child plan `Progress Log`
- the parent handoff `Execution State`
- the parent handoff `Progress Log`

with the exact verified resume point and the remaining next child scope.

## Exit Check

- [x] `event-binding-runtime` no longer owns direct binding-started event activation.
- [x] current callers still consume the same `EventBindingRuntimeResult` seam.
- [x] state-only runtime actions still avoid opening scenes.
