# Weekly Call Flows

**Week Of:** `2026-07-02`

## Purpose

Capture at least two real user-visible flows in the current architecture.

If a real flow cannot be described clearly, that area is still a black box.

## Flow 1: Covered `city-enter` Story Handoff After Child 16

### Narrative

The covered `city-enter` production line now enters the shared runtime dispatch path for navigation first, then passes through the shared story-trigger seam. `src/main.ts` no longer stitches `runEventRuntime()` and `runSceneFromEvent()` directly for this covered handoff.

### Call Chain

```text
UI -> src/main.ts confirmTravelOrEnterCity path -> createEnterCityRequest() -> dispatchRuntimeRequest() -> routeNavigationRuntime() -> triggerStoryEventsForTiming("city-enter") -> runStoryTriggerRuntime() -> appState write-back -> renderApp()
```

### Notes

- Child 16 is complete for this covered path: navigation entry stays converged and story handoff now uses one runtime-owned seam.

## Flow 2: Covered `indoor-screen-shown` Story Handoff After Child 16

### Narrative

The covered passive indoor story-trigger line still starts from `src/main.ts`, but the event activation and scene handoff inside that trigger now pass through the shared story-trigger seam rather than direct shell stitching.

### Call Chain

```text
UI / passive house sync -> src/main.ts syncPassiveStoryTriggers() -> triggerStoryEventsForTiming("indoor-screen-shown") -> runStoryTriggerRuntime() -> appState write-back
```

### Notes

- Child 16 is complete for this passive path: the remaining shell role is only the call site and state write-back, not event/scene stitching.

## Additional Flows

- Child 14's interactive convergence remains accepted and closed.
- Child 15's navigation/time convergence remains accepted and closed.
- Child 16's story-trigger convergence is now accepted and closed.
