# City-House Transition Composition Seam Lift Design

## Context

`queue.cross-mechanism-composition-contract-closure` is active, and its first frozen implementation slice is `task.cross-mechanism-composition-contract-closure.city-house-transition-composition-seam-lift`.

The current covered city/house path still splits composition ownership across:

- `src/application/runtime/city-house-transition-coordinator.ts`
- `src/application/runtime/city-view-transition.ts`
- `src/application/house/house-runtime.ts`
- `src/main.ts`

The narrow live problem is not all remaining composition residue. It is that `city-house-transition-coordinator` already owns one reusable transition seam through `applyCityViewTransition(...)`, while `house-runtime` still writes direct `currentView` and `overlayView` outcomes for house entry, house leave, and map-auto-advance completion.

## Goal

Move the covered city/house transition path onto one shared application-owned seam so `city-house-transition-coordinator` and `house-runtime` stop duplicating direct view-transition ownership.

This design intentionally does **not** solve:

- main runtime story sequencing
- interactive action to story-battle follow-up composition
- story-battle completion routing
- broader prototype/bootstrap residue

## Recommended Approach

Reuse and extend the existing `city-view-transition` seam instead of inventing a queue-wide composition abstraction.

Why this is the right first cut:

- the seam already exists on the city-side path
- the missing coverage is local and concrete
- the task can close one still-live owner line without reopening broader story or battle composition work
- tests can prove the ownership move with bounded behavior checks

## Design

### 1. Shared transition seam

Expand `src/application/runtime/city-view-transition.ts` from a city-only helper into the shared transition helper for the covered city/house path.

It should become the canonical place for these covered transitions:

- leave city -> map
- enter city 3d -> city-3d
- leave city 3d -> city
- enter house -> house
- leave house -> city
- map auto-advance completion into an already-resolved house session -> house

The helper should return updated `AppState` only. It should not render, trigger story, or dispatch house module logic.

### 2. Coordinator ownership

`src/application/runtime/city-house-transition-coordinator.ts` should continue owning:

- when a city transition action is requested
- whether entry to city 3d is allowed
- when to render after state change
- when to open house-access refusal dialogue

It should not own a separate transition state-writing path once the shared seam is expanded.

### 3. House runtime ownership

`src/application/house/house-runtime.ts` should keep owning:

- which house is active
- when house modules enter/leave/dispatch
- when story triggers fire after house entry
- when map auto-advance completion resolves into house entry vs a prebuilt house session

But it should stop owning direct covered view-state writes for:

- house entry
- house leave
- auto-advance completion into a house session

Those state writes should flow through the shared transition seam.

### 4. Main wiring

`src/main.ts` should only keep dependency wiring. It should not gain new composition logic for this cut.

If `house-runtime` needs a transition helper injected rather than imported directly, prefer the smaller change that matches existing repo patterns. Do not create a new registry or runtime family for this slice.

## Testing Plan

Follow TDD.

First add failing regression coverage that proves the shared seam owns the covered transitions and that `house-runtime` no longer duplicates the direct state-writing line.

Coverage should include:

- `applyCityViewTransition(...)` handles the added house-oriented transitions
- covered house entry/leave/auto-advance behavior remains equivalent
- guard test that the covered `house-runtime` path routes through the shared transition helper instead of open-coded `currentView` / `overlayView` writes

Verification batch for the implementation slice:

- targeted failing test first
- `npm run typecheck`
- `npm test`
- `npm run lint:blueprints`

## Risks

The main risk is silently widening the seam into story or battle composition.

Avoid that by keeping this cut limited to city/house view-state transitions only. If a change would require touching story-battle completion routing or main-runtime orchestration logic, that belongs to a later task in the same queue rather than this first implementation slice.

## Acceptance

This slice is done when:

- the covered city/house transition path uses one shared application seam
- `house-runtime` no longer open-codes the covered view transitions
- city/house behavior stays equivalent on the covered path
- no broader composition families are absorbed into this cut
