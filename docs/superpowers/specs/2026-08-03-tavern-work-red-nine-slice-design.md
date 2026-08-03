# Tavern Work Red Nine-Slice Design

Date: 2026-08-03

## 1. Goal

Retheme the tavern work flow so its work-specific UI and action buttons use the project's unified red nine-slice visual treatment.

This batch must:

- cover only the tavern work branch
- keep the drink and gamble branches visually unchanged
- avoid adding tavern business branches to `src/main.ts`
- reuse the project's existing red nine-slice assets instead of introducing new tavern-only button art
- keep the implementation reusable instead of hardcoding tavern styling directly into unrelated global rendering paths

## 2. Scope

This design covers:

- the tavern work action menu when `workPanelMode !== "closed"`
- the tavern work submit-confirm overlay
- the tavern work QTE overlay
- the tavern work result overlay
- the shared view hooks needed to let one house flow opt into a different action/button skin
- focused UI contract tests for the tavern work path

This design does not cover:

- the tavern default menu before entering the work branch
- the tavern drink flow
- the tavern gamble choice, wager, short-table, or long-table UI
- temple, grain shop, keep, or other house modules
- new runtime state, new business actions, or `main.ts` wiring changes

## 3. Current Problem

The tavern house currently mixes two concerns:

1. tavern work behavior in `src/application/house-modules/tavern/tavern-house-module.ts`
2. tavern rendering in `src/ui/views/house/tavern-house-view.ts`

The work path currently renders with the same grain-shop modal and paper/gold button skin that also appears in other tavern overlays. That creates two problems:

- the tavern work branch does not match the project's newer unified red nine-slice treatment
- there is no small reusable rendering hook for one house flow to opt into a different action skin without forking `renderHouseActionContainer()` or hardcoding tavern logic into shared UI

If this is solved by branching on `moduleId === "tavern"` inside shared render plumbing or `src/main.ts`, the main shell and shared UI boundaries regress immediately.

## 4. Design Principles

The implementation must follow these rules:

1. `src/main.ts` remains unchanged
2. tavern work styling is activated by view-model data and local tavern rendering, not by shell branching
3. shared UI hooks may become more reusable, but they must stay presentation-only
4. the tavern gamble and drink paths must remain byte-for-byte unaffected unless a test explicitly proves otherwise
5. the red nine-slice look must reuse existing project assets already used by the assessment/review popups

## 5. Recommended Design

### 5.1 Reusable Action Container Skin Hook

Extend `HouseActionContainerViewModel` in `src/domain/house-module.ts` with optional presentation hooks:

```ts
type HouseActionContainerViewModel = {
  title?: string;
  className?: string;
  buttonClassName?: string;
  actions: HouseActionViewModel[];
};
```

`renderHouseActionContainer()` in `src/ui/views/house/house-shared-view.ts` should append these optional classes to:

- the action container `<nav>`
- every rendered house action button
- every injected default NPC interaction button

This keeps the hook generic. Shared rendering still knows nothing about tavern business rules; it only accepts presentational class names already prepared by the owning house view model.

### 5.2 Tavern Work Branch Opt-In

`src/application/house-modules/tavern/tavern-house-module.ts` should set the action container hooks only for the work branch:

- `workPanelMode === "closed"`: no new classes
- `workPanelMode === "accept"` or `"submit"`: opt into the red nine-slice action row/button classes

The default tavern menu must stay unchanged so `工作 / 喝酒 / 赌博 / 关闭` continues using the current tavern skin until the player enters the work branch.

Recommended class values:

- container: `c-house-red-nine-slice-actions c-tavern-work-actions`
- button: `c-house-red-nine-slice-button c-tavern-work-button`

The shared layer stays reusable and tavern-specific naming stays in tavern-owned code.

### 5.3 Reusable Red Nine-Slice Button Utility

Add reusable styling utilities in `src/styles/grain-shop.css` for the project's existing red nine-slice button treatment:

- `.c-house-red-nine-slice-actions`
- `.c-house-red-nine-slice-button`

These utilities should reuse the same red nine-slice asset already used by the assessment/review confirm buttons:

- `../../ui/yuansu/评定/generated/20260709-205123_button-clean-anti-seam.png`

They should also reuse the same seam-fill and text treatment already established by the assessment popup red buttons.

These new utility classes should not be scoped to tavern or to a specific modal. They are the reusable style seam for any future work flow that needs the same unified red control skin.

### 5.4 Work Overlay Skin Hook

Extend `renderHouseConfirmOverlay()` in `src/ui/views/house/house-shared-view.ts` so it accepts the same optional `OverlaySkinOptions` pattern already used by `renderHouseAlertOverlay()`:

```ts
function renderHouseConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "confirm" }>,
  options: OverlaySkinOptions = {}
): string
```

This lets one caller opt into:

- a different overlay data attribute
- additional modal classes

without adding tavern-specific branching to the shared helper.

### 5.5 Tavern Work Overlay Retheme

In `src/ui/views/house/tavern-house-view.ts`, only the tavern work overlays should opt into the red nine-slice popup treatment:

- submit confirm
- QTE
- result

Recommended behavior:

- submit confirm calls `renderHouseConfirmOverlay()` with assessment-popup style classes plus tavern-work-specific classes
- QTE and result append tavern-work popup classes directly in the local tavern renderer
- work overlay action rows use `.c-house-red-nine-slice-actions`
- work overlay buttons use `.c-house-red-nine-slice-button`

Recommended tavern-specific modal classes:

- `c-house-tavern-work-popup`
- `c-house-tavern-work-qte`
- `c-house-tavern-work-result`

The tavern gamble renderers must not receive these classes.

### 5.6 Style Ownership

Style ownership should be split like this:

- reusable red nine-slice utility classes live in `src/styles/grain-shop.css`
- tavern-only layout and sizing overrides live in `src/styles/tea-house.css`

Reason:

- the asset and button treatment already live with the grain-shop/shared popup skin system
- tavern-specific spacing, widths, and work-overlay tuning belong to tavern-owned style space

This keeps the reusable visual primitive separate from the tavern-specific layout tuning.

## 6. File Ownership

Expected files to modify:

- `src/domain/house-module.ts`
  - add optional presentational hooks to `HouseActionContainerViewModel`
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - opt tavern work action containers into the reusable red skin classes
- `src/ui/views/house/house-shared-view.ts`
  - accept action container class hooks
  - extend confirm overlay rendering with `OverlaySkinOptions`
- `src/ui/views/house/tavern-house-view.ts`
  - retheme only work-specific overlays
- `src/styles/grain-shop.css`
  - add reusable red nine-slice action/button utilities
- `src/styles/tea-house.css`
  - add tavern work popup sizing/layout overrides

Expected tests to add or update:

- a focused source/contract test that locks the tavern work branch to the new red nine-slice classes
- a regression assertion that tavern gamble overlays do not pick up the tavern work popup classes

## 7. Testing Strategy

Implementation must follow TDD:

1. add a failing test that proves the tavern work branch emits the new red nine-slice classes
2. run that test and confirm the failure is caused by the missing classes
3. implement the minimum rendering changes
4. rerun the focused test until it passes
5. run the relevant existing tavern/house UI tests plus TypeScript typecheck

Minimum verification for this batch:

- tavern work action container renders the red nine-slice classes only in work mode
- tavern QTE/result/submit-confirm overlays render the tavern work popup classes
- tavern gamble overlays do not render tavern work popup classes
- `tsc --noEmit -p tsconfig.json` passes

## 8. Risks And Guardrails

Primary risk: accidentally restyling the entire tavern module because the shared hooks are too broad.

Guardrails:

- only the tavern work branch may set the new container/button classes
- only tavern work overlays may pass tavern work popup classes
- the shared helper may append classes, but it must not inspect `moduleId`, `actionId`, or tavern state
- tests must assert that gamble markup remains outside the tavern work skin

## 9. Decision Summary

The smallest reusable solution is:

- add generic presentational hooks to the shared action container and confirm overlay helpers
- add reusable red nine-slice utility classes once
- let the tavern work branch opt into them explicitly
- keep gamble and drink rendering untouched

This satisfies the user request without spreading tavern-specific UI branching into shared runtime or shell ownership.
