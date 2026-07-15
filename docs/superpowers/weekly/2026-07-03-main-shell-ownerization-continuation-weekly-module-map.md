# Main Shell Ownerization Continuation Weekly Module Map

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


**Week Of:** `2026-07-03`

## Purpose

This file maps the modules most relevant to the fresh `main.ts` shell-ownerization continuation queue.

## Module Table

| Module | Status | Responsibility | Inputs | Outputs | Depends On | Depended On By | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `shell-owner with residual debt` | Browser shell wiring, request dispatch, and final render scheduling after Child 24. | DOM events, `MainUiFlow`, timers, runtime callbacks | shell requests, render scheduling | startup coordinator, orchestration seam, presenter, UI | browser UI | Child 24 removed the first orchestration residue, but continuation debt still remains in follow-up ownership, render purity, startup bootstrap edges, and content ownership. |
| `src/application/runtime/main-runtime-orchestrator.ts` | `official migration seam` | Own the covered orchestration that Child 24 extracted from `main.ts`. | shell-originated requests, app/session context | orchestration result consumable by `main.ts` | startup coordinator, scene runtime, story runtime | `src/main.ts` | Continuation work may use this seam, but must not turn it into a permanent universal gameplay center. |
| `src/core/runtime/navigation-runtime.ts` | `partial-owner` | Own covered navigation runtime behavior. | runtime requests, game state | navigation runtime result | navigation helpers | `src/main.ts` | Child 25 targets shell-owned follow-up still attached to some covered navigation outcomes. |
| `src/core/runtime/time-runtime.ts` | `partial-owner` | Own covered time progression runtime behavior. | tick/day-start requests, game state | time runtime result | time helpers | `src/main.ts` | Child 25 also targets shell-owned continuation still attached to some covered time outcomes. |
| `src/application/startup/startup-session-coordinator.ts` | `official` | Own startup-family request selection and startup session production. | startup-family requests, activation helpers | startup session/bootstrap result | mod runtime, startup helpers | `src/main.ts`, orchestration seam | Child 27 will revisit only the startup story-bootstrap edge, not the already-closed startup-family selection boundary. |
| `src/application/content/active-game-content.ts` | `partial-owner` | Build active content definitions and derived content structures. | builtin content, activated content sources | active content bundle | content sources, pack data | `src/main.ts`, startup paths | Child 28 targets moving shell-owned active-content synchronization toward an explicit composition owner. |
| `src/core/adapters/legacy-main-adapter.ts` | `legacy seam` | Provide compatibility bootstrap translation for the older startup path. | startup bootstrap input | legacy bootstrap handoff | engine/bootstrap layer | `src/main.ts` | Child 29 targets retiring this seam from the primary path. |
| `src/core/adapters/mod-runtime-main-adapter.ts` | `legacy seam` | Translate mod activation result into legacy bootstrap-compatible shape. | mod activation result | legacy-shaped bootstrap input | mod runtime | `src/main.ts` | Child 29 targets removing this from the primary path rather than from every compatibility use immediately. |

## Outcome Notes

- The closed Child 24 seam remains historical truth and should not be reopened under a new name.
- The continuation queue is intentionally separated by problem type so each child removes one residual shell-boundary debt at a time.
- `src/main.ts` remains the highest-priority module only because it still exposes the residual debt being queued, not because the goal is generic file splitting.

