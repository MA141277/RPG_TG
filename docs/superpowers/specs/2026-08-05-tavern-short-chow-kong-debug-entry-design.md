# Tavern Short Chow-Kong Debug Entry Design

Date: 2026-08-05

## 1. Goal

Add a new short-table debug entry before entering the tavern short game so QA can directly start one fixed hand that demonstrates:

- the player first resolving a `chow`
- later in the same hand resolving a `kong`
- the existing short-table runtime, UI, and typed house session flow remaining unchanged outside that one test hand

This batch must:

- add the new test entry through the tavern house module contract
- avoid any tavern-specific branch in `src/main.ts`
- keep the existing reusable short-table debug cycle intact
- make the new test hand one-shot instead of a permanent mode that affects later hands
- keep the implementation typed and reusable instead of hiding debug state in globals or DOM-only behavior

## 2. Scope

This design covers:

- one new pre-short-game debug choice entry
- one new one-shot short-table debug preset selection path in tavern session state
- one new fixed short-hand debug preset that guarantees `chow` first and `kong` later in the same hand
- the minimum runtime support needed for a debug preset to reserve specific top-of-deck cards after initial dealing
- focused UI, house-session, and short-domain regression tests

This design does not cover:

- changing the normal short-table flow
- replacing the existing `claim-cycle` debug mode
- adding a general scripting engine for tavern debug hands
- changing long-table gambling
- adding any new `main.ts` wiring

## 3. Current Problem

The current short-table debug seam already exists and is correctly house-owned:

- `tavern-house-module.ts` exposes a typed `debugToggle`
- `TavernShortTableSession.debugPresetMode` stores the persistent short-table debug mode
- `tavern-short-gamble-session.ts` converts that mode into `debugPreset`
- `createTavernShortHand(...)` resolves the preset entirely inside short-table domain/runtime code

However, that seam only supports one persistent mode:

- `off`
- `claim-cycle`

And the current preset family only supports three single-claim opening hands:

- `claim-pong`
- `claim-kong`
- `claim-chow`

That is not enough for the requested QA flow, because the user wants one button that jumps into a fixed hand where the same hand demonstrates `chow` first and `kong` later.

If this is implemented by:

- adding tavern debug branches to `src/main.ts`
- injecting a one-off DOM button that bypasses typed overlays
- or mutating global scratch state during hand startup

then the repository regresses away from the required house interface contract.

## 4. Design Principles

The implementation must follow these rules:

1. the new entry remains owned by the tavern house module lifecycle
2. pre-game selection uses typed overlay/session data, not view-local branching
3. the special hand remains a debug preset resolved by the short-table domain/runtime seam
4. the new hand is one-shot and must not leak into later hands unless the player explicitly chooses it again
5. the existing `claim-cycle` debug mode remains unchanged
6. the implementation must add only the minimum extra preset/deck control needed for this QA hand

## 5. Recommended Design

### 5.1 Add A New Gamble Choice Entry

Extend the tavern `gamble-choice` overlay data with one additional option before the player enters the short-table wager overlay.

Recommended new choice:

- label: a dedicated Chinese QA entry meaning `short-table test: chow then kong`
- description: explains that the next short hand is a fixed QA hand
- action id: a tavern-owned action such as `choose-short-table-debug-chow-kong`

This keeps the new entry inside the existing typed tavern gamble-choice overlay instead of expanding the shared `gamble` overlay contract just to render a second debug button.

### 5.2 Add A One-Shot Pending Debug Preset

Extend tavern session state with a one-shot field dedicated to the next short-table hand only.

Recommended shape:

```ts
type TavernPendingShortDebugPreset =
  | "claim-chow-then-kong"
  | null;
```

Recommended ownership:

- stored under tavern session state, alongside existing short gamble setup state
- written when the new gamble-choice action is selected
- consumed by `confirm-gamble` when the player starts the short table
- cleared immediately after the first hand has been created

This is intentionally separate from `debugPresetMode`.

Reason:

- `debugPresetMode` is a persistent multi-hand mode
- the requested QA entry is a one-shot hand bootstrap override

Mixing the two would make the existing cycle harder to reason about and would cause later hands to keep the debug script unintentionally.

### 5.3 Keep The Existing Wager Flow

After the player selects the new `chow then kong` QA entry, the tavern house module must still open the normal short-table wager overlay.

That overlay continues to own:

- wager amount
- confirm/cancel flow
- existing short debug cycle toggle

The only extra behavior is:

- session state now remembers `pendingShortDebugPreset: "claim-chow-then-kong"`

This preserves current UI and avoids introducing a second special short-table startup path.

### 5.4 Resolve The One-Shot Preset On Confirm

When `confirm-gamble` starts a short table:

- the tavern house module passes the pending one-shot preset into short-table session creation
- short-table session creation uses it for the first `createTavernShortHand(...)`
- the one-shot field is cleared from tavern session state immediately after hand creation succeeds

Later `continue` / `rebuy` / subsequent hands must not reuse that one-shot preset.

### 5.5 Extend Short Debug Presets With A Deck Prefix

The current short debug presets only define:

- public cards
- opening five-card hands

That is enough for a single early claim window but not enough to reliably script a later `kong` in the same hand.

Add the minimum extension necessary:

```ts
type TavernShortDebugHandDefinition = {
  publicCardIds: string[];
  handCardIdsBySeatId: Record<...>;
  deckTopCardIds?: string[];
};
```

Behavior:

- initial 22 cards are still validated as unique
- `deckTopCardIds` is optional and debug-only
- if provided, those cards are moved to the top of the remaining deck in the declared order
- the rest of the deck preserves existing shuffled order after removing used cards

This remains small and reusable:

- it does not add a general event script language
- it does not couple the debug hand to UI code
- it is enough to guarantee later draw/claim timing in a deterministic QA hand

### 5.6 Add One New Debug Hand Preset

Add one new short debug preset:

- `claim-chow-then-kong`

Its definition must guarantee:

1. the early discard response window offers the player `chow`
2. after the chow branch resolves and play advances, the same hand later reaches a discard response window that offers the player `kong`

The exact card list belongs in the runtime preset definition and must be verified with domain tests.

The implementation must prefer the smallest deterministic card setup that proves the requested UX instead of trying to cover every possible follow-up branch.

## 6. File Ownership

Expected files to modify:

- `src/domain/house-modules/tavern-session.ts`
  - add the one-shot pending short debug preset field to tavern-owned typed session state
- `src/application/house-modules/tavern/tavern-house-module.ts`
  - add the new gamble-choice action
  - store/clear the one-shot pending preset
  - pass the preset into short-table creation
- `src/application/house-modules/tavern/tavern-short-gamble-session.ts`
  - accept the one-shot preset for first-hand startup
  - keep `claim-cycle` unchanged
- `src/domain/tavern-short-gambling.ts`
  - extend `TavernShortDebugHandPreset`
- `src/domain/tavern-short-gambling-runtime.ts`
  - add the new preset definition
  - add optional deck-top prefix handling for debug presets
- `src/ui/views/house/tavern-house-view.ts`
  - no hardcoded new branch beyond rendering the extra typed gamble-choice option already provided by view-model data

Expected tests to add or update:

- `tests/tavern-short-gamble-ui-contract.test.cjs`
  - lock the new gamble-choice option markup
- `tests/tavern-short-gamble-house.test.cjs`
  - lock tavern session behavior for selecting the one-shot entry and consuming it on first hand start
- `tests/tavern-short-gamble-domain.test.cjs`
  - lock the new preset so it deterministically reaches `chow` first and `kong` later in the same hand

## 7. Testing Strategy

Implementation must follow TDD:

1. add a failing UI contract test proving the new gamble-choice button is rendered through typed option data
2. add a failing house-session test proving the one-shot preset is stored on selection and consumed on `confirm-gamble`
3. add a failing domain test proving the new preset reaches `chow` first and `kong` later in the same hand
4. implement the smallest session/runtime changes needed to make those tests pass
5. rerun the focused tavern short tests plus TypeScript typecheck

Recommended verification set:

- `tests/tavern-short-gamble-ui-contract.test.cjs`
- `tests/tavern-short-gamble-house.test.cjs`
- `tests/tavern-short-gamble-domain.test.cjs`
- `node_modules/typescript/lib/tsc.js -p tsconfig.test.json`
- `node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json`

## 8. Risks And Guards

Primary risks:

- the one-shot preset accidentally persists into later hands
- extending debug preset deck control changes normal shuffled-hand behavior
- the new gamble-choice action bypasses the existing short wager flow

Guards:

- keep the one-shot preset in tavern session state and clear it immediately after first-hand creation
- scope `deckTopCardIds` handling to debug preset resolution only
- keep `confirm-gamble` as the only hand-start path
- retain existing `claim-cycle` tests unchanged so the current persistent debug mode cannot silently regress
