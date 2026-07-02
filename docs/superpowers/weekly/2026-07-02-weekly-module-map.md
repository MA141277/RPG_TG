# Weekly Module Map

**Week Of:** `2026-07-02`

## Purpose

This file is the readable module map for the fresh weekly continuation set.

If a module cannot be summarized here, it is still acting like a black box.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/core/runtime/interactive-runtime.ts` | `official` | Own the covered interactive lifecycle under the core runtime boundary. | runtime requests, current runtime state, application interactive implementations | runtime results, interactive follow-up data | runtime dispatch/router, application interactive modules | `src/main.ts`, `runtime-dispatch.ts` | Covered `city-begging`, `activity-qte`, and `story-battle` runtime ownership now lands here after Child 14. |
| `src/core/adapters/legacy-interactive-adapter.ts` | `adapter` | Preserve historical file presence only; no longer owns the covered interactive lifecycle. | none for the covered production line | placeholder-only residue | none on the covered production line | none on the covered production line | Child 14 reduced this file to compatibility/history placeholder only. |
| `src/core/runtime/navigation-runtime.ts` | `provisional` | Own covered navigation entry paths. | typed navigation requests, shared runtime state | shared runtime results, navigation follow-up data | `runtime-dispatch.ts`, application navigation modules | `src/main.ts` | Covered `enter-city` production entry now routes through shared dispatch via `routeNavigationRuntime()`. Bounded city-enter story triggering remains shell-owned and is deferred to Child 16 rather than reopening Child 15. |
| `src/core/runtime/time-runtime.ts` | `provisional` | Own covered time progression entry paths. | typed tick/time requests, shared runtime state | shared runtime results | `runtime-dispatch.ts`, game-state time helpers | `src/main.ts` | Covered `day-start` and `advance-segments` production entries now route through shared dispatch via `routeTimeRuntime()`. Bounded council-priority follow-up remains shell-owned by design. |
| `src/core/runtime/event-runtime.ts` | `provisional` | Own covered event trigger and activation seam. | event runtime requests, scenario/event registries | event activation results, scene handoff inputs | event candidate selector, activation helpers | `src/main.ts`, `scene-runtime.ts` | Covered story-trigger activation now routes through `runStoryEventRuntime()` instead of shell-side trigger assembly. |
| `src/core/runtime/scene-runtime.ts` | `provisional` | Own scene handoff seam from event activation. | scene handoff inputs, scene definitions | scene session outputs | event runtime, scene session helpers | `src/main.ts` | Covered story-trigger handoff now routes through `runStoryTriggerRuntime()` instead of shell-side `runSceneFromEvent()` stitching. |
| `src/core/runtime/house-runtime.ts` | `official` | Own the covered house enter/dispatch/leave lifecycle and interactive follow-up seam. | house runtime requests, interactive follow-up context | runtime results and house-session results | runtime dispatch/router, application house modules | `src/main.ts`, `runtime-dispatch.ts` | Not the current blocker after Child 13. |
| `src/main.ts` | `legacy` | Browser-shell assembly, render invocation, and remaining mixed orchestration. | DOM events, runtime outputs, presenter input | runtime requests, render calls | runtime seams, presenter, adapters | browser UI | Child 15 removed the direct covered navigation/time runtime helper calls and Child 16 removed the shell-side event/scene stitching inside triggerStoryEventsForTiming(). |

## Status Legend

- `official`
  - stable intended module boundary
- `adapter`
  - transition-only compatibility seam
- `provisional`
  - likely to change after more integration
- `legacy`
  - old module not yet migrated into the current boundary

## Questions Raised This Week

- What later problem type, if any, still deserves extraction now that covered navigation/time entry and covered story-trigger handoff are both converged?
- Should the bounded council-priority follow-up stay shell-side, or does a future fresh review justify treating it as a different continuation category?
