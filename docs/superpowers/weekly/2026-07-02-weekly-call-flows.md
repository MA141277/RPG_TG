# Weekly Call Flows

**Week Of:** `2026-07-02`

## Purpose

Capture at least two real user-visible flows in the current architecture.

If a real flow cannot be described clearly, that area is still a black box.

## Flow 1: Current Covered `enter-city` Navigation Baseline

### Narrative

The current production line for the covered `enter-city` path still enters `navigation-runtime.ts` directly from `src/main.ts`, then immediately returns to shell-owned orchestration for city-enter story triggering. This is the narrowed navigation baseline that Child 15 is allowed to converge.

### Call Chain

```text
UI -> src/main.ts confirmTravelOrEnterCity path -> createEnterCityRequest() -> runNavigationRuntime() -> triggerStoryEventsForTiming("city-enter") -> appState write-back -> renderApp()
```

### Notes

- `triggerStoryEventsForTiming("city-enter")` remains out of Child 15 scope except where the covered navigation entry still needs less shell-side stitching.

## Flow 2: Current Covered `day-start` / `advance-segments` Time Baseline

### Narrative

The current production line for covered time progression still calls `runTimeRuntime()` directly in `src/main.ts` and then performs council-priority shell follow-up checks outside the time runtime seam. This is the narrowed time baseline that Child 15 is allowed to converge.

### Call Chain

```text
UI / auto-advance callback -> src/main.ts -> createDayStartRequest() or createAdvanceTimeSegmentsRequest() -> runTimeRuntime() -> syncCouncilPriorityAfterGameStateChange() -> renderApp() or follow-up interruption
```

### Notes

- Child 15 may reduce the minimum shell follow-up stitching required for these covered time paths, but it must not widen into broader event/scene control.

## Additional Flows

- Child 14's interactive convergence remains accepted and should not be reopened while Child 15 is active.
