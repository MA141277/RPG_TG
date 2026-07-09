# Layout Editor Live Surface Retirement Design

## Context

`queue.layout-editor-retirement-and-reference-removal` is active, and its first frozen implementation slice is `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement`.

Current source truth still exposes the layout editor on the covered production path through:

- `src/ui/app-render.ts`
- `src/main.ts`
- `src/ui/tools/layout-editor-view.ts`
- `src/ui/views/character/character-detail-view.ts`

At the same time, `uiLayouts` and `src/content/layout-editor-presets.ts` still act as the current non-editor layout baseline for live rendering such as global HUD and character detail. That means removing the full layout baseline is broader than retiring the editor surface itself.

## Goal

Retire the live layout-editor surface from the production path without widening this first cut into shared `uiLayouts` baseline deletion or reserve-family redesign.

This slice intentionally does **not** solve:

- `uiLayouts` state removal
- `layout-editor-presets` removal
- UI reserve or registry activation
- broader shared UI layout-baseline redesign

## Recommended Approach

Remove the live editor entry, render, and interaction surface first, while preserving the current layout baseline consumed by non-editor views.

Why this is the right first cut:

- the editor is still user-facing on the covered path today
- the live editor surface is smaller than the shared layout baseline it currently rides on
- the queue can prove real feature retirement before deciding whether the remaining baseline residue is still same-queue work
- tests can guard that the production path no longer exposes editor launch, render, or interaction behavior

## Design

### 1. Render path

`src/ui/app-render.ts` should stop mounting `renderLayoutEditor(input.appState)` on the live render path.

The result should be that production rendering no longer shows:

- the editor launch button
- the live editor panel
- the editor modal preview shell

### 2. Event path

`src/main.ts` should stop instantiating or routing production input through `layoutEditorCoordinator`.

This includes removing the covered editor-only branches for:

- `input`
- `click`
- `pointerdown`
- `pointermove`
- `pointerup`
- `pointercancel`
- `mousedown`
- `mousemove`
- `mouseup`

The first cut should only remove editor-specific event handling. It should not redesign unrelated map drag, house drag, or other input families.

### 3. View bindings

Views that currently emit editor-only live binding attributes should stop doing so on the covered path.

For this slice, `src/ui/views/character/character-detail-view.ts` should stop exposing:

- `data-layout-component-*`
- `data-layout-element-*`
- resize handles
- editor-selected visual states

This keeps the live production markup free of editor interaction protocol once the editor surface is retired.

### 4. Preserved residue

This slice should preserve:

- `AppState.uiLayouts`
- `AppState.layoutEditor`
- `src/application/layout-editor/layout-editor-bootstrap.ts`
- `src/content/layout-editor-presets.ts`

Those artifacts remain only as post-slice residue to be classified by the queue's later `layout-baseline-residue-review` task.

## Testing Plan

Follow TDD.

First add failing regression coverage that proves the production path no longer exposes the live editor surface while preserving the non-editor layout baseline.

Coverage should include:

- `src/ui/app-render.ts` no longer mounts `renderLayoutEditor(...)`
- `src/main.ts` no longer instantiates or routes through `layoutEditorCoordinator`
- `src/ui/views/character/character-detail-view.ts` no longer emits editor-only live binding attributes or resize handles
- non-editor `uiLayouts` baseline consumption remains present on the covered path

Verification batch for this slice:

- targeted failing test first
- `npm run typecheck`
- `npm test`
- `npm run lint:blueprints`

## Risks

The main risk is widening this cut into shared layout-baseline removal.

Avoid that by treating any change to `uiLayouts`, preset defaults, or reserve-family layering as residue unless it is strictly required to sever the live editor surface.

## Acceptance

This slice is done when:

- the covered production render path no longer mounts the layout editor
- the live app shell no longer routes interaction through `layoutEditorCoordinator`
- covered live views no longer expose editor-only binding protocol
- non-editor layout baseline consumption remains intact
- broader `uiLayouts` and preset residue is left for explicit later review
