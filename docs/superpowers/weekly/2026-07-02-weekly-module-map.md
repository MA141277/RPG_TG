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
| `src/core/runtime/navigation-runtime.ts` | `provisional` | Own covered navigation entry paths. | typed navigation requests | runtime results | `runtime-dispatch.ts`, application navigation modules | `src/main.ts` | Active Child 15 owner target, narrowed to the covered `enter-city` production line. |
| `src/core/runtime/time-runtime.ts` | `provisional` | Own covered time progression entry paths. | typed tick/time requests | runtime results | `runtime-dispatch.ts`, game-state time helpers | `src/main.ts` | Active Child 15 owner target, narrowed to the covered `day-start` and `advance-segments` production lines. |
| `src/core/runtime/event-runtime.ts` | `provisional` | Own covered event trigger and activation seam. | event runtime requests, scenario/event registries | event activation results, scene handoff inputs | event candidate selector, activation helpers | `src/main.ts`, `scene-runtime.ts` | Candidate Child 16 follow-up area. |
| `src/core/runtime/scene-runtime.ts` | `provisional` | Own scene handoff seam from event activation. | scene handoff inputs, scene definitions | scene session outputs | event runtime, scene session helpers | `src/main.ts` | Candidate Child 16 follow-up area. |
| `src/core/runtime/house-runtime.ts` | `official` | Own the covered house enter/dispatch/leave lifecycle and interactive follow-up seam. | house runtime requests, interactive follow-up context | runtime results and house-session results | runtime dispatch/router, application house modules | `src/main.ts`, `runtime-dispatch.ts` | Not the current blocker after Child 13. |
| `src/main.ts` | `legacy` | Browser-shell assembly, render invocation, and remaining mixed orchestration. | DOM events, runtime outputs, presenter input | runtime requests, render calls | runtime seams, presenter, adapters | browser UI | Child 14 removed the covered `activity-qte` result-clear tail; the next mixed-entry debt is now navigation/time. |

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

- Can the covered `enter-city` path be converged without silently absorbing the city-enter story trigger handoff into Child 15?
- Can the covered `day-start` and `advance-segments` paths reduce council-priority shell stitching without widening into broader event/scene control?
