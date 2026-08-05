# Tavern Short Public Ghost Sorting Design

## 1. Goal

Extend the tavern short-table hand-sorting surface so revealed public cards also appear as
sortable ghost entries inside the player hand row, while the original center public-card lane
remains visible.

The approved player-facing result is:

- the short-table center public-card lane stays exactly where it is today,
- the hand row also contains ghost copies of the currently revealed public cards,
- those ghost public cards can be inserted into any hand gap during sorting,
- those ghost public cards are visually distinct from real hand cards,
- those ghost public cards can never be selected or discarded as playable cards,
- sorting remains reusable and event-owned through the existing house sortable runtime,
- no tavern business branch is added to `src/main.ts`.

This child covers tavern short only. It does not change long-table public-card behavior.

## 2. Current Context And Mismatch

The current tavern short-table overlay exposes two separate display channels:

- `publicCards` for the center public-card lane,
- `handCards` for the player hand row.

That separation matches current rendering, but it cannot satisfy the new approved behavior because:

1. the player cannot currently mix public information into the hand-row sort order,
2. the hand-row reorder path only knows stable hand cards plus the current draw card,
3. discard selection and confirm-discard logic currently infer playability from entries rendered in
   `handCards`.

If this feature were implemented as a pure view-only splice, the hand-row order would not have a
stable owner and would collapse on rerender or phase changes. If it were implemented by turning
public cards into real hand cards, discard and claim logic would become polluted by non-playable
entries.

So the needed seam is a short-owned display-order layer that is separate from true hand/business
state.

## 3. Approved Behavior Contract

### 3.1 Scope

- This child covers tavern short-table only.
- The center public-card lane remains rendered from `publicCards`.
- The hand row gains additional ghost entries for the currently revealed public cards.
- Long-table public-card behavior is unchanged.

### 3.2 Public Ghost Entries In Hand Row

- Every currently revealed short-table public card also appears once in the hand row as a ghost
  entry.
- The hand row may therefore contain three kinds of entries:
  - real hand cards,
  - the current incoming draw card when applicable,
  - public ghost cards.
- Public ghost cards may be inserted into any gap just like real hand cards.
- Public ghost cards are only display entries. They are not promoted into the player's true hand.

### 3.3 Original Public Zone

- The center public-card lane remains visible and continues to render the real revealed public-card
  list.
- Sorting ghost entries in the hand row never reorders the center public-card lane.
- The hand-row ghost order is a player-local organization aid only.

### 3.4 Sorting Availability

- Short-table sorting remains available whenever an active hand exists and the table is not in a
  completed/between-hand state.
- Sorting is explicitly allowed during:
  - `betting`,
  - `draw-discard`,
  - `claim-window`.
- Sorting is not available when the short hand is already finished or when the short table is on a
  between-hand prompt such as continue/cashout or rebuy/cashout.

### 3.5 Discard And Selection Rules

- Public ghost cards can be dragged and reordered.
- Public ghost cards can never be armed as discard candidates.
- Public ghost cards can never dispatch `gamble-play-tile:*`.
- Real discard selection keeps using the existing real-card candidate set.
- Confirm-discard keeps using only real discard candidates and ignores public ghost entries.

### 3.6 Persistence Window

- The mixed hand-row order persists only within the current short hand.
- Starting a new short hand rebuilds the display-order layer.
- Revealing a new public card appends a new public ghost entry without destroying the player's
  existing mixed order.
- If a revealed public card becomes unavailable for display in this hand context, its public ghost
  entry is removed from the display-order layer.

### 3.7 Visual Treatment

- Public ghost entries in the hand row must remain visually sortable and use the same short-table
  thickness / layered card language as other hand-row tiles.
- They must also be visibly distinct from real hand cards through a dedicated ghost treatment:
  - lower opacity,
  - lighter / softer face styling,
  - no playable-card armed highlight behavior.
- Hover lift and drag lift still apply, because the player must be able to sort them naturally.

## 4. Architecture

### 4.1 Short-Owned Display Order Layer

Add a short-hand display-order owner inside the tavern short current-hand/session state, tentatively
named:

- `displayOrderEntries`

Each entry should be a typed projection entry rather than a raw card mutation, for example:

```ts
type TavernShortDisplayOrderEntry =
  | { kind: "hand"; cardId: string }
  | { kind: "incoming-draw"; cardId: string }
  | { kind: "public-ghost"; cardId: string };
```

This layer owns only hand-row display order. It does not replace:

- the player's true `hand`,
- the hand's `publicCards`,
- the hand's `pendingIncomingCard`.

### 4.2 View-Model Projection

`selectTavernShortGambleOverlay()` becomes the short-table owner that projects
`displayOrderEntries` into `handCards`.

The projected `handCards` entries gain enough metadata for the shared sortable runtime and the view
to distinguish display role from playability, for example:

- `sortEntryId`
- `role: "hand" | "incoming-draw" | "public-ghost"`

The view keeps rendering a single hand-row button list, but:

- `data-house-drag-payload` comes from `sortEntryId`,
- `public-ghost` entries render with no discard action id,
- `public-ghost` entries render with a dedicated ghost class.

### 4.3 Shared Sortable Runtime Boundary

The shared `house-sortable-tile-runtime` remains generic.

It continues to own only:

- hover lift,
- long-press activation,
- floating ghost,
- placeholder insertion,
- generic reorder dispatch.

It must not learn tavern business semantics such as:

- whether an entry is playable,
- whether an entry came from the public zone,
- whether a dragged entry may be discarded later.

That means the runtime now accepts stable entry ids rather than assuming every draggable payload is
the id of a real hand card.

### 4.4 House Module Boundary

The tavern short house module remains the owner of the typed reorder action.

It should:

- decode the reordered `sortEntryId`,
- update only the short display-order layer,
- reject reorder requests when no active hand exists or when the current table prompt is outside
  sortable states.

It must not:

- mutate the real short hand array when reordering display-only public ghosts,
- reinterpret public ghosts as discard candidates,
- move this logic into `src/main.ts`.

## 5. State Ownership

### 5.1 Persistent Business State

These remain the source of truth for gameplay:

- player hand cards,
- revealed public cards,
- pending incoming draw card,
- selected/lifted/dropping discard card ids.

### 5.2 Persistent Display State

`displayOrderEntries` is persistent only for the lifetime of the current short hand.

It stores:

- the mixed order of real hand entries,
- the incoming draw entry when visible in the hand row,
- public ghost entries.

It does not store:

- visual hover/drag state,
- DOM nodes,
- discard-selection state.

### 5.3 Runtime-Only State

The shared sortable runtime continues to store transient pointer/ghost/placeholder state only in
its own reusable class/module.

No new drag globals or tavern-specific shell state are allowed.

## 6. Interaction Flow

### 6.1 Hand Start

When a short hand becomes active:

- build `displayOrderEntries` from the current visible hand entries,
- append currently revealed public ghosts after the initial hand entries,
- include the current draw entry only when the short hand is in a state that already surfaces that
  card inside the hand row.

### 6.2 Sorting During Play

- The player may long-press any hand-row entry and reorder it through the existing shared sortable
  runtime.
- A successful drop dispatches the existing typed reorder action prefix, but now with a
  `sortEntryId` payload rather than a raw real-card id.
- Reorder updates only `displayOrderEntries`.

### 6.3 Public Reveal Changes

When a new short public card becomes revealed:

- the center public-card lane updates as usual,
- a new `public-ghost` entry is appended to `displayOrderEntries` if not already present,
- the rest of the mixed order remains stable.

When a public ghost should no longer appear in the hand-row projection:

- remove its `public-ghost` entry from `displayOrderEntries`,
- preserve the relative order of all remaining entries.

### 6.4 Draw-Discard Phase

During `draw-discard`:

- the hand row remains sortable,
- real discard candidates keep their current click-driven arm/deselect flow,
- public ghost entries remain draggable but never become selectable discard candidates.

The implementation must preserve the current click suppression after a successful drag so sorting
does not also arm or clear a discard candidate on drop.

## 7. Testing And Verification

Implementation must prove all of the following:

1. Tavern short view-model projects public ghosts into `handCards` while preserving the original
   center `publicCards` lane.
2. Public ghost hand-row entries:
   - have stable sortable entry ids,
   - render with a dedicated ghost role/style,
   - never receive discard action ids.
3. Short reorder logic updates mixed display order using entry ids rather than only real-card ids.
4. Sorting remains available during active short-hand phases, including `draw-discard`.
5. Discard selection and confirm-discard still use only true discard candidates.
6. Shared sortable runtime continues to work without tavern-specific public-card branches.

Minimum verification coverage should include:

- `tests/tavern-short-gamble-ui-contract.test.cjs`
- `tests/tavern-short-gamble-house.test.cjs`
- `tests/tavern-short-gamble-reorder-domain.test.cjs`
- `tests/house-sortable-tile-runtime.test.cjs`
- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`

## 8. Exit Conditions

This child is complete only when:

- tavern short still renders the original center public-card lane,
- tavern short hand row also renders sortable public ghost entries,
- public ghost entries can be placed into arbitrary hand gaps,
- public ghost entries can never be played/discarded,
- sorting remains reusable through the shared house sortable runtime,
- no new tavern business branch lands in `src/main.ts`,
- shared interface or ownership changes are documented in
  `docs/special-house-interface.md` and `docs/change-log.md` if implementation changes those
  contracts.
