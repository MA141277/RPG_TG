# Tavern Short Tile Sorting Design

## 1. Goal

Add reusable hand-sorting interaction for the tavern short table so the player can:

- hover a hand tile to lift it,
- hold the left mouse button to start dragging,
- see a same-tile ghost placeholder in the target gap while dragging,
- let neighboring tiles move aside to preserve that gap,
- release to commit the new order,

while keeping the existing short-table discard-selection flow intact.

This child only owns the current tavern short-table hand row. It must still extract the
existing house tile drag behavior out of `src/main.ts` into a reusable class so future
house/table surfaces can reuse the same interaction seam.

## 2. Current Context And Mismatch

Two mismatches exist today:

1. The repository already has house hand reordering, but it is implemented directly in
   `src/main.ts` through `houseTileDragState`, pointer handlers, and generic
   `[data-house-*]` selectors. That violates the main-shell contract because the shell
   owns too much DOM interaction state and drag behavior.
2. Tavern short-table hand tiles currently only model discard arming state through
   `selectedDiscardCardId`, `liftedDiscardCardId`, and `droppingDiscardCardId`. They do
   not expose a short-owned reorder path or a typed enable/disable flag for non-discard
   phases.

Because of that mismatch, this feature must not be added as another tavern-specific branch
inside `src/main.ts`, and it must not piggyback on the short discard-selection state.

## 3. Approved Behavior Contract

### 3.1 Scope

- This child covers the current tavern short-table player hand row only.
- Public cards, seat discard lanes, exposed meld rows, NPC hands, and other house UIs are
  out of scope.
- The existing long-table reorder flow should migrate onto the new shared runtime as an
  extraction-only cleanup, with no tavern-business branches left behind in `src/main.ts`.

### 3.2 Hover Lift

- When the short-table overlay says hand sorting is enabled, moving the pointer onto a
  player hand tile lifts that tile with the same upward visual language used by the
  existing selected/lifted short tile state.
- Hover lift is disabled during the short `draw-discard` phase.
- Hover lift is also disabled while a drag is already active.

### 3.3 Drag Start

- Sorting starts only after the player holds the primary pointer on an enabled hand tile
  for a small long-press threshold.
- A quick click must still behave like the current click-driven house action flow.
- Starting a drag creates:
  - a floating drag ghost that follows the pointer,
  - a same-size placeholder clone inserted into the hand row,
  - a hidden source tile in the original row so layout can close around the placeholder.

### 3.4 Drag Preview

- The placeholder must move to the gap the pointer currently targets.
- The other hand tiles must yield space by normal layout flow rather than through tavern-
  specific hardcoded offsets.
- The runtime must understand only generic tile ordering metadata such as tile payload,
  root action prefix, and current `before` target. It must not know tavern-specific
  reorder rules.

### 3.5 Drop And Cancel

- Releasing after a real drag dispatches one generic house action in the existing
  `prefix + payload + before-target` format.
- Releasing without crossing into a new insertion slot, cancelling the pointer, or leaving
  a valid sortable root cleans up the runtime-only ghost/placeholder state without
  dispatching an action.
- The drag runtime must suppress the follow-up click after a successful reorder so the drop
  does not also fire the tile's normal button action.

### 3.6 Disabled Draw-Discard Window

- During `draw-discard`, short hand sorting is fully disabled.
- That means no hover lift, no long-press drag, and no reorder action dispatch.
- The current short discard flow remains authoritative:
  - click once to arm one discard candidate,
  - click the same tile again to clear it,
  - mouseleave can still trigger the existing fall animation when the armed tile is
    deselected.

## 4. Architecture

### 4.1 Shared DOM Runtime

Create a reusable DOM interaction module under `src/ui/views/house/`, tentatively:

- `src/ui/views/house/house-sortable-tile-runtime.ts`

This runtime owns:

- pointer tracking,
- long-press drag activation,
- floating ghost lifecycle,
- placeholder insertion and cleanup,
- hover-lift class toggling,
- dispatching one generic reorder action through an injected callback.

It does not own:

- tavern session state,
- house business semantics,
- persistence of tile order,
- renderer-specific tavern rules.

### 4.2 Main Shell Boundary

`src/main.ts` may:

- create the shared sortable runtime once,
- pass `appElement` plus a generic dispatch callback into it,
- destroy it on teardown if needed.

`src/main.ts` must not:

- keep house tile drag session state,
- calculate insert positions itself,
- know short/long tavern action prefixes,
- distinguish tavern short from tavern long business semantics.

### 4.3 View Contract

The runtime consumes generic data attributes only.

Sortable root contract:

```html
<div
  data-house-drop-action-prefix="gamble-short-reorder:"
  data-house-drop-before="end"
  data-house-sort-enabled="true"
>
```

Sortable tile contract:

```html
<button
  data-house-sortable-tile="true"
  data-house-drag-payload="bing-3"
  data-house-drop-before="bing-3"
>
```

Shared runtime-only classes:

- `is-house-hover-lifted`
- `is-house-drag-origin`
- `is-house-drag-ghost`
- `is-house-drop-placeholder`

These classes stay generic and reusable. They do not encode tavern-specific meaning.

### 4.4 Short Table Owner

The tavern short owner continues to live in tavern application/domain modules.

Short-specific additions:

- a typed short reorder action prefix such as `gamble-short-reorder:`,
- a pure/domain reorder helper for the human short hand order,
- a typed overlay/view-model field that explicitly tells the view whether sorting is
  enabled for the current phase.

The short house module may reject reorder requests during `draw-discard`, but the renderer
and DOM runtime must not infer that rule from current button labels or loose CSS state.

### 4.5 Long Table Migration

The existing long-table reorder flow keeps its current behavior contract:

- same generic house action dispatch format,
- same persistent tavern-owned hand order.

But it must stop relying on inline pointer logic in `src/main.ts` and instead reuse the
new shared sortable runtime.

## 5. State Ownership

### 5.1 Runtime-Only State

The shared sortable runtime may keep transient DOM interaction state such as:

- active pointer id,
- pressed tile/root references,
- drag-start timer id,
- floating ghost node,
- placeholder node,
- current target `before` id,
- click-suppression deadline,
- hovered tile reference.

This state is non-persistent and must never be stored in `GameState`, tavern session state,
or top-level globals outside the runtime instance.

### 5.2 Persistent Hand Order

Persistent order remains owned by the house/domain layer:

- tavern long keeps its existing persistent hand-order owner,
- tavern short persists the new order by reordering the human player's stable hand array.

The shared runtime dispatches only the generic reorder action. The house module owns the
meaning of that action.

## 6. Testing And Verification

Implementation must prove all of the following:

1. `src/main.ts` no longer contains the house tile drag session logic that currently owns
   pointerdown/pointermove/pointerup reorder behavior.
2. The new shared runtime can:
   - lift enabled tiles on hover,
   - start a drag only after long press,
   - create and move a placeholder,
   - dispatch the generic reorder action on drop,
   - clean up correctly on cancel.
3. Tavern short view-model/markup exposes sorting only outside `draw-discard`.
4. Tavern short domain/application code applies a reorder action to the human hand only
   when short sorting is allowed.
5. Existing short discard-selection behavior remains green during `draw-discard`.

## 7. Exit Conditions

This child is complete only when:

- the shared sortable runtime exists as its own reusable class/module,
- long and short tavern hand sorting both use that runtime rather than inline shell code,
- tavern short hand sorting is disabled during `draw-discard` and enabled in other active
  short-table phases,
- targeted runtime, UI, house, and domain tests all pass,
- any shared interface or ownership changes are documented in
  `docs/special-house-interface.md` and `docs/change-log.md`.
