# Story Direct Event Entry Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the remaining direct story event start callers onto the shared event-router seam so `startStoryEventById(...)` and the non-binding branch of `triggerStoryEvents(...)` resolve and route by canonical `eventId` instead of starting story events through caller-owned direct `startEvent(...)` orchestration.

**Architecture:** Event Router Runtime Core Phase A already introduced the canonical event-router contract/runtime owner and moved covered event-binding activation through the shared dispatch path. The next adjacent runtime-only slice should stay inside `src/application/story/story-runtime.ts` plus focused runtime tests, and it should only converge direct story event entry callers that can safely emit `eventId` into the existing router without widening shell/UI/map/backpack ownership. `continueStoryFromSourceEvent(...)`, scene-choice continuation, and broader event-chain execution stay out of scope because they add continuation semantics that are adjacent to, but not required for, this caller convergence slice.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime/story contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Tasks 2-4 are locally complete and verified. startStoryEventById(...) plus the non-binding triggerStoryEvents(...) fallback now converge through one shared direct-entry helper that emits canonical eventId routing via dispatchRuntimeRequest(...) -> dispatchEventRoute(...), while triggerStoryEventBindings(...) stays on the binding-owned path and continuation/choice paths remain unchanged.`
- Next Step: `Decide whether to keep this as a local verified checkpoint or commit/push/merge-back it from codex/migration-hot-tasks. Do not repoint docs/superpowers/project-progress.md unless the user explicitly wants canonical governance moved.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 407/407; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `routeStoryDirectEntry(...) is now the only non-binding shared direct-entry helper in story-runtime outside triggerStoryEventBindings(...). startStoryEventById(...) and the non-binding triggerStoryEvents(...) fallback no longer call applyTriggeredStoryEvent(...) directly; binding-driven activation still re-enters applyTriggeredStoryEvent(..., { eventAlreadyStarted: true }) on the binding-owned runtime path. docs/superpowers/project-progress.md remains intentionally unrelated and must stay unsynced for this local checkpoint. Do not widen into src/main.ts, UI, map, backpack, styles, or script-editor schema work.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child on top of the local Event Router Runtime Core Phase A checkpoint.`
  - Verification: `Planning only.`
  - Next: `Execute Task 1, then write RED tests that lock startStoryEventById(...) and the non-binding triggerStoryEvents(...) fallback behind the shared event-router seam.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. startStoryEventById(...) and the non-binding triggerStoryEvents(...) fallback are the only in-scope direct story entry callers still invoking applyTriggeredStoryEvent(...) directly, while triggerStoryEventBindings(...) already resolves eventId through the shared event-router/dispatch path.`
  - Verification: `git status --short --branch; sed -n '1,260p' docs/superpowers/project-progress.md; sed -n '1,260p' docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md; sed -n '100,340p' src/application/story/story-runtime.ts; sed -n '360,520p' src/application/story/story-runtime.ts; sed -n '1,240p' src/core/runtime/event-router.ts; sed -n '1,280p' src/core/runtime/runtime-dispatch.ts; sed -n '1,320p' tests/event-continuation-runtime.test.cjs; sed -n '1,260p' tests/event-router-runtime.test.cjs; sed -n '1,260p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md; rg -n "startStoryEventById|triggerStoryEvents|applyTriggeredStoryEvent|dispatchEventRoute|continueStoryFromSourceEvent" src/application/story tests; rg -n "binding|external|dispatchRuntimeRequest|settlement|followUpEventIds|router" tests/event-router-runtime.test.cjs; rg -n "continueStoryFromSourceEvent|chooseStorySceneOption|startStoryEventById|missing|world definitions|fails closed|shared continuation seam" tests/event-continuation-runtime.test.cjs.`
  - Next: `Run Task 2 and add RED coverage for the two included direct-entry callers without widening into continuation/choice semantics or repointing docs/superpowers/project-progress.md.`
- 2026-07-30
  - Summary: `Completed the local direct-entry convergence checkpoint. startStoryEventById(...) and the non-binding triggerStoryEvents(...) fallback now route through one shared direct-entry helper, triggerStoryEventBindings(...) remains on the binding-owned path, and continuation/choice behavior stays unchanged.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 407/407; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Decide whether to keep this local verified checkpoint as-is or commit/push/merge-back it; do not repoint docs/superpowers/project-progress.md as part of this child-local sync.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
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
  - This child is planned on top of the local completed-but-open Event Router Runtime Core Phase A checkpoint; it should not assume commit/push/merge-back has happened yet.
  - The shared event-router runtime owner already exists in `src/core/runtime/event-router.ts`; this child is about caller convergence, not creating another router runtime.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit `startStoryEventById(...)` and the non-binding branch inside `triggerStoryEvents(...)`
- add focused RED tests that require these direct story event entry callers to resolve an event entity and route through the shared event-router seam
- add the thinnest story-runtime adapter needed to emit `eventId` into the existing router and reuse the current settlement/scene sync flow
- preserve current world-definition passthrough (`characterDefinitions`, `cityDefinitions`, `houseDefinitions`) on the converged path
- preserve current fail-closed behavior when the target event id is missing or the trigger selection returns no event
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- `continueStoryFromSourceEvent(...)`
- scene-choice continuation and `chooseStorySceneOption(...)`
- any new event-chain runtime or follow-up executor
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- changing settlement semantics beyond routing the caller through the already-owned dispatch/settlement seam
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/story/story-runtime.ts`
  - Narrow direct story event entry callers so they resolve the target event by id and route through the shared event-router/dispatch seam instead of starting the event locally first.
- `tests/event-continuation-runtime.test.cjs`
  - Keep direct story entry behavior covered, including world-definition passthrough and fail-closed start semantics.
- `tests/event-router-runtime.test.cjs`
  - Extend canonical router coverage to include story direct-entry caller integration or shared route expectations if needed.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so the direct story entry child remains router-first and does not regress to caller-owned startEvent orchestration.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the parent handoff with this new active child.
- `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `startStoryEventById(...)` routes the selected event through the shared event-router seam
  - the non-binding branch of `triggerStoryEvents(...)` routes the selected event through the shared event-router seam
  - story-runtime still preserves world definitions and fail-closed missing-event behavior
  - continuation/choice behavior remains unchanged because it stays outside this child
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story direct event entry convergence|event router runtime core|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Direct Story Event Entry Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/core/runtime/event-router.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `tests/event-continuation-runtime.test.cjs`
- Read: `tests/event-router-runtime.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`

- [x] **Step 1: Record the exact direct caller seam**

Run:

```bash
git status --short --branch
sed -n '1,220p' docs/superpowers/project-progress.md
sed -n '100,340p' src/application/story/story-runtime.ts
sed -n '1,220p' src/core/runtime/event-router.ts
sed -n '1,260p' src/core/runtime/runtime-dispatch.ts
sed -n '1,260p' tests/event-continuation-runtime.test.cjs
sed -n '1,220p' tests/event-router-runtime.test.cjs
rg -n "startStoryEventById|triggerStoryEvents|applyTriggeredStoryEvent|dispatchEventRoute|continueStoryFromSourceEvent" src/application/story tests
```

Expected:

- identify exactly which story entry paths still call `applyTriggeredStoryEvent(...)` directly instead of routing by `eventId`
- confirm the shared event-router path already exists for binding-driven activation
- confirm `docs/superpowers/project-progress.md` remains intentionally unrelated and must stay unsynced

- [x] **Step 2: Lock the child scope after the audit**

Document:

- which direct callers are included in this child
- which continuation/choice callers stay excluded
- which current tests can prove behavior before and after the change

Audit record:

- Included direct callers: `startStoryEventById(...)` and the non-binding `triggerStoryEvents(...)` branch that runs after `triggerStoryEventBindings(...)` returns `null`. Both callers still resolve an `EventDefinition` locally and call `applyTriggeredStoryEvent(runtime, content, eventDefinition)` directly.
- Existing shared router owner already in use: `triggerStoryEventBindings(...)` resolves `bindingResult.activation.eventId`, then routes it through `dispatchRuntimeRequest(...)`, which invokes `dispatchEventRoute(...)` inside the router callback, before re-entering `applyTriggeredStoryEvent(..., { eventAlreadyStarted: true })` for settlement/scene sync. This is the canonical runtime seam the child should reuse.
- Excluded callers: `continueStoryFromSourceEvent(...)`, `chooseStorySceneOption(...)`, and any continuation path that depends on `continueToEvent(...)`. Those paths still own continuation semantics rather than direct event entry and stay outside this convergence slice.
- Current proof tests for the before/after change: `tests/event-continuation-runtime.test.cjs` already covers `startStoryEventById(...)` world-definition passthrough plus continuation/choice fail-closed behavior that must stay unchanged, and `tests/event-router-runtime.test.cjs` plus the existing robustness router assertions already prove the shared event-router/dispatch seam exists for covered routing. No current test yet forces the two in-scope direct-entry callers through that shared router; Task 2 should add that RED coverage.

- [x] **Step 3: Sync the parent handoff with this active child**

Update the parent handoff so it points at this child as the next runtime-only convergence slice on top of Event Router Runtime Core Phase A.

## Task 2: Add Focused RED Coverage For Router-First Direct Story Entry

**Files:**
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for startStoryEventById(...)**

Add RED coverage that proves `startStoryEventById(...)` still bypasses the shared router before implementation. The test should keep world-definition passthrough expectations and assert the routed path is used instead of a direct caller-owned start.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires the converged direct-entry helper to call the shared router/dispatch seam and rejects a direct `applyTriggeredStoryEvent(runtime, content, eventDefinition)` path inside the in-scope direct-entry branch.

- [x] **Step 3: Run the RED suite**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story direct event entry convergence"
```

Expected:

- at least one new assertion fails against the pre-implementation direct-entry structure
- the failure points at `story-runtime` still starting direct story events without the shared router seam

## Task 3: Implement Story Direct Entry Convergence

**Files:**
- Modify: `src/application/story/story-runtime.ts`
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/event-router-runtime.test.cjs`

- [x] **Step 1: Introduce one thin story direct-entry router adapter**

Implement the smallest story-runtime helper that:

- resolves `eventId` from the existing story content
- emits the request through `dispatchEventRoute(...)` plus `dispatchRuntimeRequest(...)`
- reuses the current post-route `applyTriggeredStoryEvent(..., { eventAlreadyStarted: true })` settlement/scene-sync flow
- preserves current world-definition passthrough and fail-closed missing-event behavior

- [x] **Step 2: Move the included callers to the shared adapter**

Use the new helper for:

- `startStoryEventById(...)`
- the non-binding `triggerStoryEvents(...)` branch after `selectTriggeredEvents(...)`

Keep these callers unchanged in this child:

- `continueStoryFromSourceEvent(...)`
- `chooseStorySceneOption(...)`
- any continuation path that depends on `continueToEvent(...)`

- [x] **Step 3: Keep focused behavior coverage green**

Update tests so they still prove:

- world definitions survive direct start plus routed trigger fallback
- missing events fail closed
- router-first ownership is explicit in source-level guards

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**

Run the full verification plan listed above and record the exact outcomes in this child plan.

- [x] **Step 2: Record the new local checkpoint**

Update:

- this child plan `Execution State`
- this child plan `Progress Log`
- the parent handoff `Execution State`
- the parent handoff `Progress Log`

with the exact verified resume point and whether the child is ready for commit/push or should remain a local checkpoint.

## Exit Check

- [x] `startStoryEventById(...)` no longer owns direct event start orchestration outside the shared router seam.
- [x] The non-binding `triggerStoryEvents(...)` fallback no longer owns direct event start orchestration outside the shared router seam.
- [x] `continueStoryFromSourceEvent(...)` and scene-choice continuation remain untouched in this child.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Story Direct Event Entry Convergence`
- Parent Task: `Mod First Runtime Integration Handoff`
- Parent Stage: `Runtime Migration Narrowing`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Decide whether to keep this verified checkpoint local or commit/push/merge-back it from codex/migration-hot-tasks.`
- Next Entry Document: `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Resume this child at the commit/push/merge-back decision point; direct-entry convergence is locally implemented and verified, and docs/superpowers/project-progress.md remains intentionally unsynced.`
