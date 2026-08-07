# Event Trigger Runtime Module Dispatch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move trigger-event runtime entry onto an event-module internal `dispatchRuntimeRequest(...)` adapter while keeping actual event routing inside `dispatchEventRoute(...)`.

**Architecture:** This child keeps the public event runtime API and current file locations intact. `event-runtime.ts` will own the adapter from triggered event activation into runtime-dispatch, while `event-router.ts` remains the event route owner and `runtime-dispatch.ts` remains the lifecycle owner for follow-up chains, task inputs, effects, and settlement.

**Tech Stack:** TypeScript runtime modules, Node test runner, robustness source guards, `npm run build:test`, targeted `node --test`, `npm run typecheck`, `npm run build`, `npm run lint:plans`, and `git diff --check`.

## Execution State

- Status: `running`
- Last Updated: `2026-08-08`
- Current Focus: `Plan opened for the event-runtime trigger-entry adapter after the user rejected registered notification/handler-registry work for this slice.`
- Next Step: `Execute Task 1 by adding RED coverage that proves runStoryEventRuntime(...) trigger activation must route through dispatchRuntimeRequest(...) while still using dispatchEventRoute(...).`
- Verification: `Not run for this child yet.`
- Notes: `Do not implement registry/notification semantics in this child. Do not touch event-binding-runtime, Script Editor, scenario packs, playable, building, startup, review-system, closeBuilding, or launchFlow.`

## Progress Log

- 2026-08-08
  - Summary: `Opened a narrow event-trigger runtime module dispatch child. The accepted design keeps event as the public module boundary and adds only an internal adapter from event-runtime trigger activation to dispatchRuntimeRequest(...), with dispatchEventRoute(...) still owning event routing.`
  - Verification: `Spec and plan created from current source audit; implementation verification not run yet.`
  - Next: `Add RED coverage for trigger-event dispatchRuntimeRequest usage and event-router preservation.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-08-08-event-trigger-runtime-module-dispatch-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `Canonical progress has no active child and explicitly says open-next-approved-child.`
  - `src/core/runtime/event-runtime.ts routeTriggeredEvent(...) currently calls dispatchEventRoute(...) directly and returns .state.core.`
  - `src/core/runtime/navigation-runtime.ts and src/core/runtime/scene-runtime.ts already contain adjacent patterns where a local runtime helper calls dispatchRuntimeRequest(...) and delegates router.route / router.routeEventChain to dispatchEventRoute(...).`
  - `event-binding-runtime.ts is intentionally out of scope because binding-owned activation is protected as a separate route-only owner path.`

## Implementation Scope

### In Scope

- Add RED behavior coverage for `runStoryEventRuntime(...)` calling `dispatchRuntimeRequest(...)` from the event runtime trigger path.
- Add RED behavior coverage that follow-up events emitted from a triggered event flow through runtime-dispatch event-chain handling.
- Add a robustness guard that `routeTriggeredEvent(...)` uses the event-module dispatch adapter pattern:
  - `dispatchRuntimeRequest(...)`
  - `dispatchEventRoute(...)`
  - no direct `startEvent(...)`
- Update `src/core/runtime/event-runtime.ts` with the minimal adapter.
- Update `docs/change-log.md`, this plan, and `docs/superpowers/project-progress.md`.

### Still Out Of Scope

- Registered notification bus or handler registry.
- `src/core/runtime/event-binding-runtime.ts`.
- Script Editor import/export/runtime preview.
- Scenario-pack JSON and builtin templates.
- Playable/minigame/QTE/story-battle runtime.
- Building behavior, startup, review-system, source-unification, `closeBuilding`, or `launchFlow`.

## File Map

### Existing files to modify

- `src/core/runtime/event-runtime.ts`
  - Import `dispatchRuntimeRequest(...)` and use it inside `routeTriggeredEvent(...)`.
- `tests/event-router-runtime.test.cjs`
  - Add trigger-runtime behavior coverage for dispatchRuntimeRequest and emitted follow-up routing.
- `tests/robustness.test.cjs`
  - Tighten source ownership guard for `routeTriggeredEvent(...)`.
- `docs/change-log.md`
  - Record the shared runtime/event wiring change.
- `docs/superpowers/project-progress.md`
  - Open, sync, and close the child.
- `docs/superpowers/plans/2026-08-08-event-trigger-runtime-module-dispatch-plan.md`
  - Track execution state, progress, verification, and closeout.

### Existing files expected to be deleted

- `none`

### New files to create

- `docs/superpowers/specs/2026-08-08-event-trigger-runtime-module-dispatch-design.md`
  - Records the accepted narrow design and explicit registry/notification non-goal.

## Verification Plan

- Targeted verification:
  - `runStoryEventRuntime(...)` trigger activation routes through `dispatchRuntimeRequest(...)`.
  - Triggered event `emitEventIds` follow-up routing reaches runtime-dispatch chain handling.
  - `routeTriggeredEvent(...)` keeps event routing on `dispatchEventRoute(...)`.
  - `event-binding-runtime.ts` remains outside this child.
- Required commands:
  - `npm run build:test`
  - `node --test --test-name-pattern "runStoryEventRuntime routes activated trigger events through the shared runtime-dispatch seam|event trigger runtime dispatches emitted follow-up events through runtime-dispatch" tests/event-router-runtime.test.cjs`
  - `node --test --test-name-pattern "event trigger runtime route convergence keeps trigger activation on the shared event module dispatch adapter|event binding runtime route convergence" tests/robustness.test.cjs`
  - `node --test tests/event-router-runtime.test.cjs`
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`
  - `git diff --check`

## Task 1: Add RED Coverage For Event Module Dispatch Adapter

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add behavior coverage for trigger activation dispatch**

Add a test named:

```text
runStoryEventRuntime routes activated trigger events through the shared runtime-dispatch seam
```

The test must monkey-patch `../.test-dist/core/runtime/runtime-dispatch.js` before requiring `event-runtime.js`, run `runStoryEventRuntime(...)`, and assert that `dispatchRuntimeRequestCalls > 0`.

- [ ] **Step 2: Add behavior coverage for emitted follow-up routing**

Add a test named:

```text
event trigger runtime dispatches emitted follow-up events through runtime-dispatch
```

The test should create a city-enter triggered event with `emitEventIds: ["event.router.follow-up"]`, provide a follow-up event with a second scene id, and assert that both event history entries are recorded after `runStoryEventRuntime(...)`.

- [ ] **Step 3: Add source guard coverage**

Update the robustness test currently named:

```text
event trigger runtime route convergence keeps trigger activation on the shared event-router seam
```

Rename or replace it with:

```text
event trigger runtime route convergence keeps trigger activation on the shared event module dispatch adapter
```

The guard must assert that `routeTriggeredEvent(...)` contains `dispatchRuntimeRequest(...)`, contains `dispatchEventRoute(...)`, and does not call `startEvent(...)`.

- [ ] **Step 4: Run RED verification**

Run:

```bash
npm run build:test
node --test --test-name-pattern "runStoryEventRuntime routes activated trigger events through the shared runtime-dispatch seam|event trigger runtime dispatches emitted follow-up events through runtime-dispatch" tests/event-router-runtime.test.cjs
node --test --test-name-pattern "event trigger runtime route convergence keeps trigger activation on the shared event module dispatch adapter" tests/robustness.test.cjs
```

Expected:

- focused event-router test fails because `dispatchRuntimeRequestCalls` is `0`
- robustness test fails because `routeTriggeredEvent(...)` does not contain `dispatchRuntimeRequest(...)`

## Task 2: Implement The Event Runtime Internal Adapter

**Files:**
- Modify: `src/core/runtime/event-runtime.ts`

- [ ] **Step 1: Import runtime dispatch**

Add:

```ts
import { dispatchRuntimeRequest } from "./runtime-dispatch";
```

- [ ] **Step 2: Wrap routeTriggeredEvent in dispatchRuntimeRequest**

Replace the direct `dispatchEventRoute(...).state.core` return with a local `dispatchRuntimeRequest(...)` call whose `router.route(...)` and `router.routeEventChain(...)` both delegate to `dispatchEventRoute(...)` using the existing repository and activation handler construction.

- [ ] **Step 3: Preserve the activated event id as the runtime request id**

Use:

```ts
request: createEventTriggerRequest(eventDefinition.id)
```

inside `routeTriggeredEvent(...)`, so the request points at the activated event rather than the trigger family id.

- [ ] **Step 4: Run GREEN verification**

Run:

```bash
node --test --test-name-pattern "runStoryEventRuntime routes activated trigger events through the shared runtime-dispatch seam|event trigger runtime dispatches emitted follow-up events through runtime-dispatch" tests/event-router-runtime.test.cjs
node --test --test-name-pattern "event trigger runtime route convergence keeps trigger activation on the shared event module dispatch adapter|event binding runtime route convergence" tests/robustness.test.cjs
```

Expected:

- `PASS`

## Task 3: Verify, Sync Governance, Commit, Push, And Close

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/project-progress.md`
- Modify: `docs/superpowers/plans/2026-08-08-event-trigger-runtime-module-dispatch-plan.md`

- [ ] **Step 1: Run the full verification batch**

Run:

```bash
npm run build:test
node --test --test-name-pattern "runStoryEventRuntime routes activated trigger events through the shared runtime-dispatch seam|event trigger runtime dispatches emitted follow-up events through runtime-dispatch" tests/event-router-runtime.test.cjs
node --test --test-name-pattern "event trigger runtime route convergence keeps trigger activation on the shared event module dispatch adapter|event binding runtime route convergence" tests/robustness.test.cjs
node --test tests/event-router-runtime.test.cjs
npm run typecheck
npm run build
npm run lint:plans
git diff --check
```

Expected:

- `PASS`

- [ ] **Step 2: Sync implementation checkpoint state**

Update this plan to `completed-but-open`, append the verification log, update `docs/superpowers/project-progress.md` to `completed-but-open`, and add a `docs/change-log.md` entry for the event trigger runtime module dispatch change.

- [ ] **Step 3: Commit and push implementation**

Commit all implementation, tests, spec, plan, change-log, and project-progress changes with:

```text
fix: route trigger events through runtime dispatch

Summary:
- Route event-runtime trigger activation through an internal dispatchRuntimeRequest adapter.
- Add trigger-event dispatch and follow-up coverage while preserving dispatchEventRoute ownership.
- Sync governed plan and change-log state for the verified child.
```

- [ ] **Step 4: Close the child**

Update this plan to `closed`, update project progress to no active child, record push commit, run:

```bash
npm run lint:plans
git diff --check
```

Then commit and push closeout docs with:

```text
docs: close event trigger runtime dispatch plan

Summary:
- Close the event trigger runtime module dispatch child after the pushed implementation checkpoint.
- Sync project progress back to no active child with the implementation push result.
```

## Exit Check

- [ ] Trigger-event activation goes through `dispatchRuntimeRequest(...)` from inside `event-runtime.ts`.
- [ ] Event routing still goes through `dispatchEventRoute(...)`.
- [ ] Follow-up events emitted from a triggered event are handled through runtime-dispatch event-chain flow.
- [ ] `event-binding-runtime.ts` remains outside this child.
- [ ] No registered notification bus or handler registry is introduced.
- [ ] No scenario-pack JSON, Script Editor, playable, building, startup, review-system, `closeBuilding`, or `launchFlow` changes are made.
- [ ] Project progress sync is updated.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Post-Merge Branch Stabilization`
- Parent Stage: `Post-Merge Branch Stabilization`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
