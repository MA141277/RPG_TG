# Weekly Call Flows

**Week Of:** `2026-07-02`

## Purpose

Capture at least two real user-visible flows in the current architecture.

If a real flow cannot be described clearly, that area is still a black box.

## Flow 1: Covered `enter-city` Navigation After Child 15

### Narrative

The covered `enter-city` production line now enters the shared runtime dispatch path first. `src/main.ts` no longer calls `runNavigationRuntime()` directly on this covered entry. The bounded residue that remains outside Child 15 is the city-enter story trigger handoff after the runtime-owned navigation step has already completed.

### Call Chain

```text
UI -> src/main.ts confirmTravelOrEnterCity path -> createEnterCityRequest() -> dispatchRuntimeRequest() -> routeNavigationRuntime() -> runtime bridge state write-back -> triggerStoryEventsForTiming("city-enter") -> renderApp()
```

### Notes

- `triggerStoryEventsForTiming("city-enter")` remains intentionally outside Child 15 and is now the clearer handoff seam for Child 16 review.

## Flow 2: Covered `day-start` / `advance-segments` Time After Child 15

### Narrative

The covered time progression lines now route through shared runtime dispatch first. `src/main.ts` no longer calls `runTimeRuntime()` directly on the covered `day-start` and `advance-segments` entries. The bounded residue that remains outside Child 15 is the council-priority follow-up after runtime-owned time progression settles.

### Call Chain

```text
UI / auto-advance callback -> src/main.ts -> createDayStartRequest() or createAdvanceTimeSegmentsRequest() -> dispatchRuntimeRequest() -> routeTimeRuntime() -> runtime bridge state write-back -> syncCouncilPriorityAfterGameStateChange() -> renderApp() or follow-up interruption
```

### Notes

- Child 15 completed the covered time-entry convergence without widening into event/scene control. The retained council-priority follow-up is explicit bounded residue rather than hidden mixed entry.

## Additional Flows

- Child 14's interactive convergence remains accepted and should not be reopened while the set moves to Child 16 baseline recheck.
- Child 15 is now completed and should not be reopened for the bounded event/scene-facing residue it intentionally left behind.
