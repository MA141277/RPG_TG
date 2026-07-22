# Building Layout Template Runtime Design

## Document Role

- Status: `draft-approved-for-review`
- Scope: `target.building-arrangement-container-flow-refactor`
- Related queue: `queue.building-arrangement-final-acceptance-and-removal-guard`
- Purpose: `Define the next runtime-shell generalization direction for building UI so migrated buildings recover pre-refactor visual structure through Script Editor-authored layout configuration instead of building-specific renderer branches.`

## Goal

- Replace the remaining old building-specific UI layout branches in the runtime building shell with a template-driven layout system.
- Keep the runtime building module as a generic container renderer.
- Restore every currently migrated building to a visual structure that matches the pre-refactor UI as closely as possible.
- Make the layout contract durable enough for future Script Editor preview-side selection, drag/drop, and layout editing without implementing those editing interactions in this batch.

## Required Constraints

- Building behavior must continue to follow the Script Editor arrangement / event binding / playable-flow path.
- Do not hardcode building-specific business branches in `src/main.ts`.
- Do not restore legacy house runtime ownership or house-specific UI renderers as active code paths.
- Do not bypass `building-container-item-action -> event binding -> flow/playable/closeBuilding` for runtime functionality.
- Do not model layout templates as building-name branches such as `templeLayout`, `grainShopLayout`, or similar one-off renderer forks.
- Layout configuration may control visual structure, placement, and view composition, but not building gameplay ownership.

## Problem Statement

The current runtime building shell still contains residual building-specific layout logic, most visibly in the arrangement renderer path that uses named layout variants such as `temple-stage`. That keeps the runtime shell from being a truly generic building module, makes future layout changes expensive, and blocks a clean authoring path for future preview-time layout manipulation.

At the same time, the project cannot simply flatten every building into one generic panel layout because the immediate requirement is visual parity with the pre-refactor building UI across all migrated buildings. The replacement therefore needs to be both generic and visually expressive.

## Chosen Approach

### Canonical Layout Ownership

- Introduce a reusable layout template table as canonical layout structure.
- Each `buildingArrangement` references a `templateId`.
- Each `buildingArrangement` may apply narrowly scoped instance overrides for local presentation differences.
- The runtime building renderer consumes resolved layout data rather than branching on building identity.

### Why This Approach

- It keeps repeated structural logic out of individual building records.
- It lets multiple migrated buildings share one structural skeleton while preserving per-instance art, roster, and action details.
- It matches the future requirement that preview-side layout adjustments should eventually write back to configuration rather than runtime code.

## Non-Goals

- This batch does not implement preview-side drag/drop editing.
- This batch does not implement preview-side component selection tooling.
- This batch does not implement generic component click editing behavior.
- This batch does not introduce a new gameplay runtime or a new playable family.
- This batch does not reintroduce old house module files, old house module session types, or house-specific renderer ownership.

## Target Runtime Model

### 1. Layout Template Table

Add a reusable layout-template family that defines the visual skeleton for a building page.

Each template should be able to describe:

- stable `templateId`
- a list of `regions`
- region placement and ordering
- layout sizing or slot semantics
- style tokens for panel and role presentation
- empty-state rules for regions
- optional fallback rules for regions when bound content is absent

The template names must stay structure-oriented rather than building-oriented. Example categories are acceptable only when they describe geometry or composition, such as:

- `hero-actions-roster`
- `sidebar-roster-center-actions`
- `header-body-actions`
- `primary-npc-secondary-roster-actions`

### 2. Arrangement Layout Binding

Each `buildingArrangement` gains a layout binding section that resolves:

- `templateId`
- container-to-region mapping
- NPC presentation mapping
- optional local token overrides
- optional local region visibility overrides

The arrangement remains the owner of building-local content identity, but not the owner of the renderer's structural logic.

### 3. Runtime Layout View Model

The runtime building presenter/materializer should resolve:

- the chosen template
- the arrangement's bound containers
- NPC/primary NPC roster mapping
- final region visibility
- final style tokens

into one generic building layout view model consumed by the renderer.

This view model should carry stable identifiers for future editor extensibility:

- `layoutNodeId`
- `regionId`
- `containerId` when applicable

Those ids are required now as reserved extension seams even though interactive preview editing is out of scope for this batch.

## Layout Semantics

The layout system should support at least these runtime-visible concepts:

- title/header region
- description/hero region
- primary NPC region
- NPC roster region
- action-menu region
- status/info region
- notes/text region
- leave/back region

The actual renderer may compose these with shared low-level panel primitives, but the layout contract must expose them as explicit configurable regions rather than implicit DOM order.

## Visual Parity Rule

The first implementation target is not abstract elegance. It is pre-refactor visual equivalence.

For every currently migrated building arrangement:

- the page should preserve the old visual reading order as closely as possible
- the relative position of major NPC presentation blocks should remain familiar
- the relative position of action menus should remain familiar
- the leave/back affordance should remain where players expect it
- the page should not regress into a generic stacked card layout when the old UI had a stronger visual structure

When tradeoffs are required, preserve visible structure first and refactor elegance second.

## Future Preview Extension Seams

This batch only reserves extension seams. It does not implement the editing interactions.

The layout contract must still be shaped so future preview tooling can add:

- selecting a layout region
- selecting a bound container
- dragging a container between regions
- changing order within a region
- resizing or changing slot spans
- editing visual token assignments

To support that future work, the layout model must be geometry-aware and node-addressable, not just a CSS-class string bundle.

## Reserved Interaction Metadata

The system should reserve optional interaction metadata fields on layout nodes and rendered layout view models, but leave them inactive in this batch.

Allowed reserved metadata includes:

- node identity
- whether a node is selectable in preview
- whether a node is draggable in preview
- whether a node is a drop target in preview
- future click-target metadata

This metadata must not take over runtime gameplay ownership. Runtime gameplay actions continue to come from building containers and their authored action bindings.

## Runtime Functionality Rule

The current report says some building functions are not working. Functional repair in this direction is in scope only when it preserves the generic building pipeline:

- layout node -> bound container/action
- `building-container-item-action`
- `EventBindingRuntime`
- authored event action
- authored flow/playable or `closeBuilding`

Out-of-scope fixes include:

- restoring house runtime fallback
- adding building-name-specific dispatch in `main.ts`
- making the layout interpreter directly execute gameplay logic

## File/Module Impact Areas

Expected affected layers for the eventual implementation:

- `src/domain/building-arrangement.ts`
- `src/domain/script-editor-project.ts`
- `src/application/script-editor/**`
- `src/application/building/**`
- `src/application/presenter/**`
- `src/ui/views/building/**`
- migrated built-in arrangement data under `src/content/scenario-packs/zhuyuanzhang/**`
- regression tests under `tests/**`

Likely documentation touchpoints for implementation:

- `docs/change-log.md`
- active Blueprint queue / plan documents if queue scope or closeout evidence changes

## Acceptance Direction For The Eventual Implementation

The eventual implementation should be considered correct only if all of the following are true:

- all currently migrated buildings render through the generic building module
- visual structure tracks the pre-refactor UI closely enough for manual browser comparison
- no new building-specific renderer branch is added to `main.ts`
- no legacy house runtime UI path is restored
- building functionality still routes through the shared event/flow pipeline
- layout data is driven by configuration, not renderer conditionals on building identity
- the resolved layout view model carries stable ids needed for future preview editing seams

## Verification Expectations

When implementation begins, the verification baseline should include:

- `npm run typecheck`
- `npm run lint:blueprints`
- `npm test`
- in-app browser manual review of normal start building entry
- in-app browser manual review of JSON import path
- in-app browser manual review of Script Editor runtime preview path
- per-building visual comparison against pre-refactor structure expectations
- action-menu and leave-path verification for affected buildings

## Open Decisions Already Resolved In This Design

- Layout ownership uses reusable template tables plus arrangement-level binding/override.
- The template layer includes both structure and visual token configuration.
- Future preview editing support is reserved in the model now but not implemented in this batch.
- Component click/edit interactions are reserved as extension seams only and are not part of the current batch.

## Self-Review

- Placeholder scan: `passed`
- Internal consistency: `passed`
- Scope check: `focused on runtime building-layout generalization and future editor-facing seams`
- Ambiguity check: `resolved in favor of template-table ownership with arrangement bindings and runtime-only generic rendering`
