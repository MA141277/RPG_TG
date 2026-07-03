# Main Runtime Ownerization Weekly Module Map

**Week Of:** `2026-07-03`

## Purpose

This file maps the modules relevant to the fresh main-runtime ownerization set.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `shell-owner` | Browser shell wiring and final render scheduling after Child 24. | DOM events, `MainUiFlow`, timers, runtime callbacks | shell requests, render scheduling | startup coordinator, runtime seams, presenter, UI | browser UI | Child 24 removed the covered startup/story/passive-trigger orchestration residue but did not redesign presenter/render. |
| `src/application/runtime/main-runtime-orchestrator.ts` | `official` | Own covered startup session apply, story timing follow-up, scene progression / choice, and passive trigger sync outside `main.ts`. | shell-originated requests, app/session context | orchestration result consumable by `main.ts` | startup coordinator, scene runtime, story runtime, state-sync sink | `src/main.ts` | This is the landed Child 24 owner seam. |
| `src/application/startup/startup-session-coordinator.ts` | `official` | Own startup-family request selection after Child 23. | startup-family requests, activation helpers | bootstrap session result | mod runtime, startup helpers | `src/main.ts`, `src/application/runtime/main-runtime-orchestrator.ts` | Child 24 narrowed apply ownership but did not reopen request selection. |
| `src/core/runtime/state-sync-runtime.ts` | `official` | Provide runtime/app bridge helpers and covered runtime write-back sink. | runtime requests, app/runtime state | write-back result, sync result | runtime dispatch, hydration, presentation prep | `src/main.ts`, `src/application/runtime/main-runtime-orchestrator.ts` | Child 24 kept this as the covered runtime commit sink. |
| `src/core/runtime/scene-runtime.ts` | `partial-owner` | Own covered event-to-scene runtime path. | runtime state, event/scene definitions | scene runtime result | event runtime, scene runner | `src/application/runtime/main-runtime-orchestrator.ts` | Covered handoff no longer leaks directly into `main.ts`. |
| `src/core/runtime/navigation-runtime.ts` | `partial-owner` | Own covered navigation runtime path. | runtime request, game state | runtime result with navigation target | navigation application helpers | `src/main.ts` | Runtime request entry remains in main shell, but Child 24 moved the covered city-enter story follow-up off the shell-local helper path. |
| `src/core/runtime/time-runtime.ts` | `partial-owner` | Own covered time progression runtime path. | tick request, game state | runtime result | time progression helpers | `src/main.ts` | Council handling remains outside Child 24; later work must prove it is a different problem type before reopening this area. |

## Outcome Notes

- One orchestration seam was enough for Child 24; no second coordinator or helper family was needed.
- Passive trigger evaluation moved out of the pure render frame without forcing presenter/render redesign.
- Later `main.ts` work must start from a fresh review rather than treating this module map as an open queue.
