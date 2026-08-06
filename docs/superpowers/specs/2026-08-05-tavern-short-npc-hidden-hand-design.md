# Tavern Short NPC Hidden Hand Design

## 1. Goal

Add real-time concealed-hand visuals for the three NPC seats in the tavern short table so the
felt shows how many hidden cards each opponent currently holds without revealing card identity.

The player-facing behavior is:

- only the three NPC seats render this concealed-hand stack,
- the stack count always matches the NPC's live concealed hand count,
- normal draw, discard, chow, pong, and kong all update that count immediately,
- the stack renders only colored backs with no white face and no label text,
- the top visible layer is blue, the second is dark blue, and the third-plus layers are gray.

This change must not be hardcoded inline inside the short seat renderer. The repository should get
a dedicated new class that builds the NPC hidden-hand view data through the typed tavern
application/view-model seam.

## 2. Current Context And Mismatch

Two mismatches exist today:

1. The short-table seat model currently exposes only summary text, exposed meld groups, and discard
   tiles. It does not expose any structured concealed-hand model for NPC seats.
2. The short-table seat renderer only knows how to place summary, melds, and discards, so adding
   NPC hidden hands directly there would force the renderer to infer live card counts from tavern
   business state, which violates the house interface contract.

Because of that mismatch, the NPC hidden-hand stack must be introduced as explicit typed overlay
data, and the count/tone rules must live in a dedicated class rather than as ad hoc renderer logic.

## 3. Approved Behavior Contract

### 3.1 Seat Ownership

- The player seat does not render this concealed-hand stack.
- Only NPC rows render it.
- The concealed-hand stack belongs in each NPC seat block, between the seat summary and the public
  discard / exposed-meld rows.

### 3.2 Real-Time Count Rules

For each NPC seat, the rendered concealed-hand stack count follows these rules:

- base count = `player.hand.length`
- if that NPC currently has `pendingIncomingCard` and its `source === "draw"`, render one extra
  concealed tile so the count becomes `player.hand.length + 1`
- if `pendingIncomingCard.source === "claim"`, do not add an extra concealed tile because the
  claimed card is already exposed by the meld flow and must not reappear as a hidden card
- after chow / pong / kong, the concealed count must fall immediately because exposed cards have
  already left the concealed hand
- after the forced discard that follows a claim, the concealed count must again reflect the new
  live concealed hand size

This is the same live count the tavern short hand logic already owns. The UI must not simulate or
approximate it.

### 3.3 Visual Contract

Each concealed tile is a pure back-face model:

- no label text
- no white front face
- no suit/rank marker
- only background / border / depth styling

Tone mapping is fixed by stack order:

- visual layer 1 (topmost visible tile): `top`
- visual layer 2: `mid`
- visual layers 3 and beyond: `base`

The stack renders tightly overlapped so the seat communicates quantity while staying compact.

### 3.4 Synchronization Scope

The NPC concealed-hand visuals must stay synchronized with the same gameplay moments that already
move the player's real hand:

- opening deal
- NPC draw
- NPC discard
- NPC chow / pong / kong
- NPC forced discard after claim
- showdown / finished hand teardown

The player continues to use the existing explicit hand row on the felt. This feature does not add a
second concealed-hand stack for the player seat.

## 4. Architecture

### 4.1 New Application Class

Create a dedicated new class under the tavern application/view-model area:

- `src/application/house-modules/tavern/tavern-short-npc-hidden-hand-stack-builder.ts`

Class responsibility:

- accept the active short hand plus one seat/player snapshot,
- resolve that NPC's live concealed-card count,
- build an explicit ordered list of concealed-tile view models,
- assign the tone for each tile (`top`, `mid`, `base`),
- return an empty list for the player seat.

Class shape:

```ts
export type TavernShortHiddenHandTone = "top" | "mid" | "base";

export type TavernShortHiddenHandTileViewModel = {
  id: string;
  tone: TavernShortHiddenHandTone;
};

export class TavernShortNpcHiddenHandStackBuilder {
  buildForSeat(input: {
    hand: TavernShortHandState;
    player: TavernShortPlayerState;
    viewerSeatId: string;
  }): TavernShortHiddenHandTileViewModel[];
}
```

This class owns the count/tone mapping so `selectTavernShortGambleOverlay()` does not accumulate
another long inline branch and `renderShortSeat()` does not need tavern-specific state knowledge.

### 4.2 Typed Overlay Contract

Extend the short-table seat row contract with an explicit concealed-hand field:

```ts
hiddenHandTiles?: Array<{
  id: string;
  tone: "top" | "mid" | "base";
}>;
```

Rules:

- the field is optional to preserve compatibility with older short overlay fixtures
- tavern short view-model generation fills it for NPC seats and omits it for the player seat
- the renderer consumes only this field and never derives count from melds, discards, or raw tavern
  domain state

### 4.3 View Renderer

Add a dedicated short-seat render helper:

- `renderShortSeatHiddenHand()`

That helper:

- reads `hiddenHandTiles`
- renders one blank concealed tile per item
- places the concealed stack between summary and public rows
- emits only generic presentational markup, with no card labels

The existing short seat section-order helper should grow from:

- `summary`
- `melds`
- `discards`

to:

- `summary`
- `hidden-hand`
- `melds`
- `discards`

with the per-seat order still controlled by table position.

### 4.4 Styling

Add a dedicated short-seat concealed-hand strip in `src/styles/tea-house.css`, driven by new
component tokens rather than hardcoded inline color values.

New CSS classes:

- `.c-tavern-gamble__seat-hidden-hand`
- `.c-tavern-gamble__tile--hidden-hand`
- `.c-tavern-gamble__tile--hidden-hand-top`
- `.c-tavern-gamble__tile--hidden-hand-mid`
- `.c-tavern-gamble__tile--hidden-hand-base`

New CSS tokens (global or component-scoped):

- `--tavern-short-hidden-hand-top-bg`
- `--tavern-short-hidden-hand-mid-bg`
- `--tavern-short-hidden-hand-base-bg`
- `--tavern-short-hidden-hand-border`
- `--tavern-short-hidden-hand-overlap`

Visual rules:

- concealed tiles are narrower / shorter than the player's active hand tiles
- tiles overlap with a negative or compressed inline offset
- no text color is needed because no text is rendered
- side seats may align the stack toward their existing left/right anchor; top seat may stay centered

## 5. Data Flow

1. Tavern short domain/runtime continues to own the real concealed hand arrays.
2. `selectTavernShortGambleOverlay()` creates one `TavernShortNpcHiddenHandStackBuilder` instance
   and asks it for each seat's concealed-tile model.
3. The resulting `hiddenHandTiles` are attached to `playerRows`.
4. `renderShortSeat()` renders the new concealed-hand section when `hiddenHandTiles.length > 0`.
5. CSS applies the back-face-only visual treatment and the top/mid/base palette.

At no point should the renderer inspect `player.hand.length`, `pendingIncomingCard`, or tavern
phase data directly.

## 6. Error Handling And Compatibility

- If no active short hand exists, the overlay continues to expose an empty `playerRows` array.
- If an older fixture omits `hiddenHandTiles`, the renderer should simply skip the concealed-hand
  strip.
- If a seat is folded, the concealed-hand strip may still render at the current count unless the
  existing folded opacity styling already dims the whole seat block; no separate folded rule is
  needed in this child.

## 7. Testing And Verification

Implementation must prove all of the following:

1. Overlay contract:
   - NPC seats expose `hiddenHandTiles` with the same live count as their concealed hand
   - player seat omits or leaves `hiddenHandTiles` empty
   - pending NPC draw adds one temporary concealed tile
   - NPC claim windows do not add a fake concealed tile for `source === "claim"`
2. Markup contract:
   - short seat markup renders a dedicated concealed-hand strip for NPC seats
   - the strip contains blank hidden-hand tiles rather than visible card labels
   - player seat markup does not render this concealed-hand strip
3. CSS contract:
   - hidden-hand strip exists
   - concealed tiles overlap
   - top/mid/base tone classes exist
   - hidden-hand tiles do not rely on visible text/white card-face styling

Minimum verification commands after implementation:

- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs`
- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-house.test.cjs`

## 8. Scope Guard

This child does not:

- change tavern short game rules,
- reveal NPC real card identity,
- add a second concealed-hand stack for the player seat,
- redesign discard / meld lane positions,
- change showdown layout,
- migrate this visual to the long-table variant.

If future work wants the same concealed-hand stack on other table variants, it should reuse the new
class and typed field rather than duplicating the count logic inside another renderer.
