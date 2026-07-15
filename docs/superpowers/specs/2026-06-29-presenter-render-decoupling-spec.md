# Presenter Render Decoupling Spec

## 1. Goal

This spec defines how the repository should separate runtime-to-view projection from DOM/string rendering so `src/ui/app-render.ts` stops owning gameplay selection logic and becomes a consumer of presenter output.

The target is to make the rendering stack depend on prepared presentation models rather than on raw game/application state plus feature-specific helpers.

## 2. Non-Goals

This spec does not define:

- interaction runtime extraction
- save/load cutover
- engine-session closure work
- full schema-driven UI authoring system
- complete redesign of every existing view renderer

Those remain separate workstreams.

## 3. Current Repository State

The repository already renders through `src/ui/app-render.ts`, but that file still performs a large amount of runtime selection logic itself.

Current responsibilities inside `src/ui/app-render.ts` include:

- selecting active view based on `currentView`
- looking up active house definitions
- checking story-stage visibility for city entries and houses
- selecting city NPC summaries for houses
- looking up house modules directly
- deriving modal, overlay, dialogue, HUD, and stage data inline

That means the render layer currently mixes:

- projection logic
- gameplay-dependent lookup logic
- HTML generation

## 4. Problem Statement

The current render path has three structural problems:

1. `ui/app-render.ts` depends on gameplay/application services instead of a narrow presenter contract
2. `src/main.ts` computes render inputs ad hoc before calling `renderAppMarkup()`
3. view renderers cannot be treated as pure consumers of prepared stage and overlay models

If Child 5 is skipped, the project can continue extracting runtime pieces, but presentation remains coupled to legacy runtime data access.

## 5. Target Flow

Child 5 should converge the covered render path on this shape:

`runtime state -> application presenter -> presenter output -> ui render functions -> DOM mount`

Rules:

- gameplay selection belongs in presenter code
- `ui/**` belongs to rendering only
- presenter output should be explicit enough that `app-render.ts` does not need to call gameplay services to decide what to show

## 6. Presentation Bridge Runtime Responsibilities

The presentation bridge must own:

- deriving stage selection from runtime/application state
- deriving overlay and modal models
- deriving HUD visibility and summary data
- preparing view-model input for house, city, map, scene, battle, and library views

The presentation bridge must not own:

- gameplay state mutation
- DOM writes
- browser event listeners
- core runtime request dispatch

## 7. Required Presenter Files

Child 5 should introduce:

- `src/application/presenter/app-presenter.ts`
- `src/application/presenter/presenter-output.ts`
- `src/application/presenter/stage-presenters/**`
- `src/application/presenter/overlay-presenters/**`

The exact split may vary, but the resulting structure must clearly separate:

- stage selection
- overlay/modal/dialogue projection
- top-level presenter output contract

## 8. App Render Boundary

After Child 5:

- `src/ui/app-render.ts` should consume presenter output
- `src/ui/app-render.ts` should stop importing gameplay services such as:
  - `getHouseModule`
  - story-stage access selectors
  - city-NPC house selectors
- `src/ui/app-render.ts` may still call view renderers and layout helpers

The key rule is:

- `app-render.ts` may select render branches from presenter output shape
- `app-render.ts` must not compute gameplay-dependent branch eligibility from raw game state

## 9. Main.ts Render Rule

After Child 5:

- `src/main.ts` should call presenter assembly before rendering
- `src/main.ts` should pass presenter output into the render layer
- `src/main.ts` should stop computing scene action and choice options inline for render input

`main.ts` remains the browser shell, but not the presentation assembler.

## 10. Relationship To Layout Schema Work

Child 5 does not need to implement the final schema-driven layout authoring system.

However, it must leave a clean seam for later layout work by ensuring:

- presenter output is a stable data shape
- layout-aware fields are grouped into render-facing models
- `ui/app-render.ts` no longer needs raw gameplay services to choose which view model to build

## 11. Transitional Reuse Rule

Child 5 may continue to reuse existing view renderers such as:

- map view renderer
- city view renderer
- house module view renderer
- scene view renderer
- battle view renderer
- library overlays

But those renderers must receive inputs chosen by presenter code rather than performing gameplay lookups themselves.

## 12. Acceptance Criteria

Child 5 is successful only when:

- a formal child plan exists and is executable
- presenter output becomes the primary input to `ui/app-render.ts`
- `ui/app-render.ts` no longer imports core gameplay selection helpers for stage eligibility and module lookup
- `src/main.ts` no longer computes ad hoc render-only gameplay selections inline
- render logic remains functionally equivalent for current player flows
- Child 5 does not absorb interaction-runtime extraction or save/load work

## 13. Verification Expectations

Any implementation plan based on this spec must include:

- source-guard tests that `ui/app-render.ts` stops importing gameplay selection helpers directly
- focused presenter-output tests
- `npm run typecheck`
- `npm test`
- `npm run build`

If some render branches remain transitional, the plan must describe the exact remaining transitional ownership instead of implying full decoupling.
