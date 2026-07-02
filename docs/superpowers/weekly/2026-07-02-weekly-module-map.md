# Weekly Module Map

**Week Of:** `2026-07-02`

## Purpose

This file is the readable module map for the fresh weekly continuation set.

If a module cannot be summarized here, it is still acting like a black box.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/core/runtime/interactive-runtime.ts` | `official` | Own the covered interactive lifecycle under the core runtime boundary. | runtime requests, current runtime state, legacy business implementations where still required | runtime results, interactive follow-up data | runtime dispatch/router, application interactive modules | `src/main.ts`, `runtime-dispatch.ts` | Active Child 14 owner target. |
| `src/core/adapters/legacy-interactive-adapter.ts` | `adapter` | Provide temporary compatibility for remaining interactive paths not yet fully ownerized. | runtime-owned interactive requests, legacy business implementations | compatibility bridge outputs | `interactive-runtime.ts`, application interactive modules | `interactive-runtime.ts` | Child 14 should reduce this to compatibility-only residue. |
| `src/core/runtime/navigation-runtime.ts` | `provisional` | Own covered navigation entry paths. | typed navigation requests | runtime results | `runtime-dispatch.ts`, application navigation modules | `src/main.ts` | Candidate Child 15 follow-up area. |
| `src/core/runtime/time-runtime.ts` | `provisional` | Own covered time progression entry paths. | typed tick/time requests | runtime results | `runtime-dispatch.ts`, game-state time helpers | `src/main.ts` | Candidate Child 15 follow-up area. |
| `src/core/runtime/event-runtime.ts` | `provisional` | Own covered event trigger and activation seam. | event runtime requests, scenario/event registries | event activation results, scene handoff inputs | event candidate selector, activation helpers | `src/main.ts`, `scene-runtime.ts` | Candidate Child 16 follow-up area. |
| `src/core/runtime/scene-runtime.ts` | `provisional` | Own scene handoff seam from event activation. | scene handoff inputs, scene definitions | scene session outputs | event runtime, scene session helpers | `src/main.ts` | Candidate Child 16 follow-up area. |
| `src/core/runtime/house-runtime.ts` | `official` | Own the covered house enter/dispatch/leave lifecycle and interactive follow-up seam. | house runtime requests, interactive follow-up context | runtime results and house-session results | runtime dispatch/router, application house modules | `src/main.ts`, `runtime-dispatch.ts` | Not the current blocker after Child 13. |
| `src/main.ts` | `legacy` | Browser-shell assembly, render invocation, and remaining mixed orchestration. | DOM events, runtime outputs, presenter input | runtime requests, render calls | runtime seams, presenter, adapters | browser UI | Child 14 should only reduce the remaining covered interactive tails. |

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

- Does `story-battle` still hide any cleanup or follow-up branch in `src/main.ts` beyond the already-accepted Child 13 convergence line?
- After Child 14, will `legacy-interactive-adapter.ts` still carry any same-type lifecycle ownership, or only narrow compatibility glue?
