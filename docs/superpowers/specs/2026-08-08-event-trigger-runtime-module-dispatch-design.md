# Event Trigger Runtime Module Dispatch Design

## Goal

Converge the trigger-event runtime entry in `src/core/runtime/event-runtime.ts` onto the shared `dispatchRuntimeRequest(...)` lifecycle while keeping event routing owned by `dispatchEventRoute(...)` and keeping the event-facing API inside the event runtime module.

## Current Branch Context

The canonical project progress is at no active child after `Mod-First Event Binding Candidate Task Input Payload Consumption` closed. The next required action is `open-next-approved-child`, so this is a new narrow post-merge stabilization child.

The current trigger-event path is:

```text
runStoryEventRuntime(...)
  -> runEventRuntime(...)
    -> routeTriggeredEvent(...)
      -> dispatchEventRoute(...)
```

This already avoids direct `startEvent(...)` in `event-runtime.ts`, but `routeTriggeredEvent(...)` still stops on the route-only seam. Recent adjacent convergence work moved scene/dialogue continuation and navigation enter-house event entry through `dispatchRuntimeRequest(...)` while preserving `dispatchEventRoute(...)` as the event router owner.

## Decision

Use an event-module internal adapter:

```text
runEventRuntime(...)
  -> routeTriggeredEvent(...)
    -> dispatchRuntimeRequest(...)
      -> router.route(...)
        -> dispatchEventRoute(...)
      -> router.routeEventChain(...)
        -> dispatchEventRoute(...)
```

This keeps external callers using the event runtime API. It does not expose `dispatchRuntimeRequest(...)` to callers and does not move runtime-dispatch settlement logic into the event module.

## Explicit Non-Goals

- Do not implement a registered handler registry or notification bus in this child.
- Do not change `event-binding-runtime.ts`; binding-owned paths stay on the existing route-only owner path.
- Do not move files or create a new physical event module directory.
- Do not change Script Editor import/export/runtime preview contracts.
- Do not change scenario-pack JSON or builtin templates.
- Do not change playable, building, startup, review-system, `closeBuilding`, or `launchFlow` behavior.
- Do not copy follow-up, task, effect, or settlement logic from `runtime-dispatch.ts` into event runtime.

## Ownership Boundary

- `event-runtime.ts` owns trigger-event selection, activation, and the event-module adapter from trigger activation into shared runtime dispatch.
- `event-router.ts` owns event id resolution and event-kind handler dispatch.
- `runtime-dispatch.ts` owns follow-up event chain, task input settlement, effect settlement, and runtime follow-up settlement.
- `event-route-activation.ts` remains the activation handler factory for dialogue and settlement event kinds.

## Implementation Shape

`routeTriggeredEvent(...)` should call `dispatchRuntimeRequest(...)` with:

- `state: toEventRuntimeState(state)`
- `request: createEventTriggerRequest(eventDefinition.id)`
- `context.router.route(...)` delegating to `dispatchEventRoute(...)`
- `context.router.routeEventChain(...)` delegating to `dispatchEventRoute(...)`

The runtime request event id should be the activated event id, not the trigger family id such as `story.city-enter`.

## Acceptance Criteria

- `runStoryEventRuntime(...)` still exposes the same public API and result shape.
- Trigger-event activation calls `dispatchRuntimeRequest(...)` from inside `event-runtime.ts`.
- The dispatch router path inside `event-runtime.ts` still calls `dispatchEventRoute(...)`.
- Follow-up events emitted by a triggered event can be routed through runtime-dispatch event-chain handling.
- `event-binding-runtime.ts` remains unchanged by this child.
- No registered notification bus or handler registry is introduced.
- Governance docs and `docs/change-log.md` record the shared runtime/event wiring change.

## Verification

- RED/GREEN behavior coverage in `tests/event-router-runtime.test.cjs` for trigger events using `dispatchRuntimeRequest(...)`.
- Robustness guard in `tests/robustness.test.cjs` proving `routeTriggeredEvent(...)` uses both `dispatchRuntimeRequest(...)` and `dispatchEventRoute(...)`, and does not call `startEvent(...)`.
- Existing binding route tests remain green to prove binding ownership was not widened.
- Required commands:
  - `npm run build:test`
  - `node --test --test-name-pattern "runStoryEventRuntime routes activated trigger events through the shared runtime-dispatch seam|event trigger runtime dispatches emitted follow-up events through runtime-dispatch" tests/event-router-runtime.test.cjs`
  - `node --test --test-name-pattern "event trigger runtime route convergence keeps trigger activation on the shared event module dispatch adapter|event binding runtime route convergence" tests/robustness.test.cjs`
  - `node --test tests/event-router-runtime.test.cjs`
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint:plans`
  - `git diff --check`
