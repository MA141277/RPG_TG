# Tavern Short Stage Notice Design

## 1. Goal

Add a short-table-only center notice that briefly tells the player what to do when the local player
enters a new actionable phase.

The approved player-facing result is:

- a gold center notice appears when the player newly enters a playable short-table phase,
- the notice plays once per newly entered phase instead of replaying on every rerender,
- supported prompts are betting, discard/play, and chow/pong/kong claim opportunities,
- the animation timing is `0.2s` fade in, `1s` hold, `0.2s` fade out.

This is a UI-owned behavior change. It must not alter short-table rules, turn flow, or session
ownership.

## 2. Current Context And Mismatch

The short table already exposes enough typed state to know when the player can act:

- `availableActions`
- `claimOptions`
- `claimCountdown`
- `highlightAvailableActions`
- current short-hand phase

However, there is currently no one-shot center notice contract. A pure CSS animation tied directly
to rerendered markup would replay too often, while storing "already shown" UI hints in the tavern
session would pollute gameplay state.

## 3. Approved Design

### 3.1 Ownership

- `application/house-modules/tavern/tavern-short-gamble-view-model.ts`
  computes a typed stage notice payload for the short overlay.
- `ui/views/house/tavern-house-view.ts`
  renders a dedicated center notice node for the short table only.
- `ui/views/house/tavern-claim-countdown-dom.ts`
  owns the once-per-key playback behavior in a DOM runtime, alongside the existing tavern countdown
  runtime.
- `styles/tea-house.css`
  owns positioning and animation timing.

No short-table domain/runtime rule file should change behavior because of this feature.

### 3.2 Data Contract

The short `gamble-table` overlay adds:

```ts
stageNotice:
  | {
      key: string;
      label: string;
    }
  | null;
```

`key` identifies a newly entered actionable phase. It is UI-facing and may be derived from:

- prompt kind,
- hand phase,
- acting seat,
- draw round / betting round,
- claim option set.

It must change only when the player enters a meaningfully new actionable step, so the DOM runtime
can play once and ignore ordinary rerenders.

### 3.3 Supported Notices

Approved labels:

- betting phase: `请下注`
- draw-discard phase where the player is choosing a discard/play: `请出牌`
- claim window:
  - `可吃`
  - `可碰`
  - `可杠`
  - combined forms such as `可吃 / 碰 / 杠`

No center notice should appear for:

- NPC turns,
- settlement / showdown,
- between-hand continue-or-cashout prompts,
- rebuy-or-cashout prompts,
- phases where the player has no legal short-table action.

### 3.4 Playback Contract

The renderer may emit the notice markup whenever `stageNotice != null`, but playback timing must be
controlled by a DOM runtime that remembers the last played `key`.

Rules:

- same `key` + rerender: do not replay
- changed `key`: replay once from the start
- no notice element: clear the runtime state

This keeps the UI deterministic while avoiding session-persistent scratch state.

## 4. Implementation Shape

Files in scope:

- `src/domain/house-module.ts`
- `src/application/house-modules/tavern/tavern-short-gamble-view-model.ts`
- `src/ui/views/house/tavern-house-view.ts`
- `src/ui/views/house/tavern-claim-countdown-dom.ts`
- `src/styles/tea-house.css`
- `tests/tavern-short-gamble-ui-contract.test.cjs`
- `docs/special-house-interface.md`
- `docs/change-log.md`

No change is allowed in:

- `src/main.ts`
- short-table domain rule files
- tavern short session state shape

## 5. Testing And Verification

Add RED coverage that proves:

- short overlay emits a stage notice for player betting,
- short overlay emits a stage notice for player discard/play,
- short overlay emits a stage notice for player claim-window opportunities,
- NPC turns and settlement emit no stage notice,
- short renderer includes the center notice node and data key,
- CSS declares the center position and the `0.2 / 1 / 0.2` animation timing.

Minimum verification:

- `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\tavern-short-gamble-ui-contract.test.cjs`

## 6. Scope Guard

This child does not:

- change short-table betting, drawing, claim, or showdown rules,
- add a new persistent tavern session flag for "already shown" notices,
- change button visibility logic,
- move existing countdown or broadcast panels,
- introduce a generic house-wide stage-notice system.
