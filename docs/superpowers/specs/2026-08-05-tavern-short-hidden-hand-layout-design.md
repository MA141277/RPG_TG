# Tavern Short Hidden-Hand Layout Design

## 1. Goal

Adjust the tavern short-table seat layout so concealed-hand stacks and public tile lanes use the
available table space more clearly without changing any short-table rules or seat data contracts.

The approved player-facing result is:

- left and right NPC concealed-hand stacks render vertically instead of horizontally,
- the left and right public discard / chow-pong-kong lanes shift inward toward the table center,
- the left and right summary text blocks stay anchored where they already are,
- the top NPC concealed-hand stack moves to the right side of the summary block,
- the top NPC discard and meld lanes stay below the summary area instead of sharing a row with the
  concealed stack.

This is a display-only change. No gameplay rule, overlay data model, or runtime ownership changes.

## 2. Current Context And Mismatch

The current short-table NPC seat layout already exposes four distinct view sections:

- summary,
- concealed hand,
- melds,
- discards.

However, all three NPC concealed-hand strips still behave like compact horizontal rows, and the
left/right public rows still sit close to the outer seat edge. That leaves unused vertical space
beside the left/right summaries and makes the outward seat lanes feel more crowded than the center
felt.

The approved change is therefore not to redesign the short-table seat model, but to remap the same
view sections onto more intentional anchors:

- use the side-seat spare vertical margin for concealed stacks,
- pull side-seat public rows slightly inward,
- place the top-seat concealed stack beside the name block instead of beneath it.

## 3. Approved Behavior Contract

### 3.1 Scope And Ownership

- Only tavern short-table presentation changes.
- The implementation stays in the short-table renderer and short-table CSS.
- No change is allowed in:
  - `src/main.ts`,
  - short-table domain rules,
  - tavern short runtime mutations,
  - `hiddenHandTiles` data shape,
  - discard or meld payload structure.

### 3.2 Left And Right NPC Seats

For both side NPC seats:

- the summary block remains fixed at its current anchor,
- the concealed-hand strip changes from a horizontal row to a vertical stack,
- that vertical concealed stack uses the outside spare margin near the summary block,
- the public discard lane moves inward toward the center felt by a small amount,
- the public chow/pong/kong lane also moves inward toward the center felt by a small amount,
- discard and meld remain separate sections and do not merge into one shared container.

The user-approved magnitude is the conservative `A` variant:

- move the public lanes inward only slightly,
- do not relocate the summary text,
- do not create a dramatic center pull.

### 3.3 Top NPC Seat

For the top NPC seat:

- the summary block remains the visual anchor,
- the concealed-hand strip moves to the immediate right of the summary block,
- the discard lane remains below the summary area,
- the meld lane remains below the summary area,
- the concealed stack does not join the discard/meld row.

This should read visually as one summary row with a right-side concealed indicator, followed by the
existing public rows beneath it.

### 3.4 Bottom Player Seat

The player seat is unchanged by this child.

No new concealed-hand strip appears for the player, and the player public rows keep their current
layout.

## 4. Architecture

### 4.1 Renderer Ownership

The renderer continues to expose the same sections:

- `summary`
- `hiddenHand`
- `melds`
- `discards`

`renderShortSeatHiddenHand()` remains the concealed-hand renderer. No new view-model field is
introduced.

`getShortSeatSectionOrder()` may remain as-is if CSS alone can produce the approved geometry. If a
small top-seat-only wrapper or ordering adjustment simplifies the layout, it must still consume only
the existing typed seat sections and must not inspect raw runtime state.

### 4.2 CSS Ownership

The main work lives in `src/styles/tea-house.css`.

Approved responsibilities:

- side-seat concealed-hand container becomes vertical,
- side-seat discard and meld anchors move inward,
- top-seat summary and concealed-hand alignment becomes a shared horizontal row,
- the change stays seat-position-specific and does not leak into long-table or unrelated tavern
  layouts.

Because this child changes only position and flow, it should prefer existing tokens and component
variables. No new raw color values are needed.

### 4.3 Data Contract Stability

The short-table overlay contract stays unchanged:

- `hiddenHandTiles` still drives concealed tile count and tone,
- `meldGroups` still drives chow/pong/kong display,
- `discardTiles` still drives public discards.

The renderer must continue to derive layout only from the existing typed fields and seat position.

## 5. Implementation Shape

### 5.1 Files To Modify

- `src/ui/views/house/tavern-house-view.ts`
- `src/styles/tea-house.css`
- `tests/tavern-short-gamble-ui-contract.test.cjs`

No other production files are required for the approved scope.

### 5.2 Left/Right Seat Layout Strategy

For seat `short-1` and `short-3`:

- keep `.c-tavern-gamble__seat-summary` fixed,
- anchor `.c-tavern-gamble__seat-hidden-hand` as a vertical column,
- keep its tiles compact and stacked top-to-bottom,
- move `.c-tavern-gamble__seat-discards` inward,
- move `.c-tavern-gamble__seat-melds` inward,
- preserve left/right alignment semantics so the left seat still reads from the left side and the
  right seat still mirrors it.

The inward move should be a modest offset, not a structural relocation to the center column.

### 5.3 Top Seat Layout Strategy

For seat `short-2`:

- add a top-seat layout rule where summary and concealed-hand occupy the same horizontal band,
- keep concealed tiles on the summary block's right side,
- leave the public lanes below that band,
- preserve the existing top-seat center alignment relative to the green felt.

This can be implemented by either:

- a top-seat-specific flex/grid rule on the existing section order, or
- a tiny renderer wrapper for the top summary + concealed section.

The preferred implementation is the smallest change that keeps renderer ownership clear and avoids a
new data contract.

## 6. Testing And Verification

This child should use UI contract tests only.

### 6.1 RED Targets

Add failing coverage in `tests/tavern-short-gamble-ui-contract.test.cjs` that proves:

- side-seat concealed-hand layout now declares a vertical flow,
- side-seat public rows have the new inward anchors,
- top-seat summary and concealed-hand layout share the same horizontal band,
- player seat markup/layout remains unchanged for this feature.

The tests should lock CSS contract and, where useful, short markup structure. They do not need new
house/domain assertions because no data or rule contract changes.

### 6.2 GREEN Verification

Minimum verification commands:

- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs`

If the implementation ends up touching shared seat structure more than expected, rerun
`tests\tavern-short-gamble-house.test.cjs` as a safety check, but it is not required by scope.

## 7. Scope Guard

This child does not:

- change tavern short betting, drawing, or claim rules,
- change concealed-hand count logic,
- change card size, color palette, or showdown scoring behavior,
- add new overlay fields,
- redesign bottom player seat layout,
- alter long-table layout.

If future work wants stronger seat-layout decomposition, that should be a separate child. This
change remains a focused short-table presentation pass.
