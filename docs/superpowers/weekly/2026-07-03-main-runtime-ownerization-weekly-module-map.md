# Main Runtime Ownerization Weekly Module Map

**Week Of:** `2026-07-03`

## Purpose

This file maps the modules relevant to the fresh main-runtime ownerization set.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `legacy-owner` | Browser shell wiring, render scheduling, and still-mixed covered runtime-business orchestration. | DOM events, `MainUiFlow`, timers, runtime callbacks | render calls, runtime entry requests, shell callbacks | startup coordinator, runtime seams, presenter, UI | browser UI | Child 24 targets its remaining business orchestration residue rather than its file size. |
| `src/application/runtime/main-runtime-orchestrator.ts` | `planned` | Own covered runtime-business request routing, covered follow-up, and fixed write-back use outside `main.ts`. | shell-originated requests, app/session context | orchestration result consumable by `main.ts` | runtime seams, startup coordinator, state-sync sink | `src/main.ts` | This is the intended new owner for Child 24. |
| `src/application/startup/startup-session-coordinator.ts` | `official` | Own startup-family request selection after Child 23. | startup-family requests, activation helpers | bootstrap session result | mod runtime, startup helpers | `src/main.ts`, planned main-runtime orchestrator | Child 24 may narrow the apply contract but must not reopen request selection. |
| `src/core/runtime/state-sync-runtime.ts` | `official` | Provide runtime/app bridge helpers and state write-back sink. | runtime requests, app/runtime state | write-back result, sync result | runtime dispatch, hydration, presentation prep | `src/main.ts`, planned main-runtime orchestrator | Child 24 should keep this as the single write-back sink. |
| `src/core/runtime/scene-runtime.ts` | `partial-owner` | Own covered event-to-scene runtime path. | runtime state, event/scene definitions | scene runtime result | event runtime, scene runner | `src/main.ts` today, planned main-runtime orchestrator | Covered follow-up still leaks into `main.ts`. |
| `src/core/runtime/navigation-runtime.ts` | `partial-owner` | Own covered navigation runtime path. | runtime request, game state | runtime result with navigation target | navigation application helpers | `src/main.ts` | Child 24 must move covered follow-up out of shell-local chains. |
| `src/core/runtime/time-runtime.ts` | `partial-owner` | Own covered time progression runtime path. | tick request, game state | runtime result | time progression helpers | `src/main.ts` | Council and other covered follow-up still surround it in `main.ts`. |

## Questions Raised This Week

- Can one orchestration seam own startup session apply plus covered story/event/scene follow-up without forcing presenter redesign?
- Can passive trigger evaluation move out of `renderApp()` without changing the current render scheduling contract?
- Does Child 24 need only one new module, or one module plus a narrow contract/helper around `state-sync-runtime.ts`?
