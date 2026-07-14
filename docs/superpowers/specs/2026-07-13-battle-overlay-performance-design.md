# Battle Overlay Performance Design

## Goal

Improve frame rate during the full-screen formation battle presentation in
`prototypes/battle-demo/index.html` without changing visible behavior.

This work targets the presentation path driven by:

- `renderBattleAnimationState()`
- `updateBattleFormationView()`
- related formation-slot, portrait-slot, and battle-overlay state updates

The objective is to reduce avoidable DOM churn and duplicate UI commits while
keeping battle logic, timing, effects, and Spine presentation unchanged.

## Scope

### In Scope

- optimize only the full-screen battle overlay presentation path
- reduce repeated DOM reconstruction during battle playback
- reuse stable overlay view structure and cache stable DOM references
- apply slot-level incremental updates instead of full view rebuilds
- deduplicate repeated UI commits when the effective overlay state is unchanged
- add regression tests that lock in the no-behavior-change contract and verify
  structure reuse / reduced duplicate refresh behavior

### Out Of Scope

- no changes to the isometric board renderer `renderBoard()`
- no changes to battle rules, targeting, damage, morale, or timing logic
- no changes to Spine project assets, action data, or effect trigger frames
- no visual downgrades, effect removal, or frame-rate caps
- no aggressive frame skipping or throttling in this batch

## Current Problems

The current battle overlay flow appears to pay unnecessary UI cost while an
animation batch is playing:

1. overlay updates are submitted repeatedly through `renderBattleAnimationState()`
2. the formation presentation path likely rebuilds large chunks of DOM that are
   structurally stable across the whole playback session
3. high-frequency UI work repeatedly performs DOM queries, node creation,
   class/style rewrites, and layout-sensitive updates even when only a small
   subset of slot state has actually changed

This causes avoidable main-thread work during battle playback and lowers
rendering smoothness.

## Recommended Approach

Use a persistent battle-overlay view model with slot-level incremental updates.

### Why

- it preserves the current visual contract
- it targets the most likely bottleneck: repeated DOM work during animation
- it reduces UI cost without altering animation timing or battle logic
- it creates a safer base for later, separately approved scheduling optimizations
  if they are ever needed

## Runtime Design

### Overlay View Lifetime

The full-screen battle overlay should build its stable DOM structure once per
overlay session and then reuse it for the entire playback.

Stable structure includes:

- left and right formation containers
- formation slot nodes
- portrait / Spine host containers
- static meter / label scaffolding

These nodes should not be torn down and recreated on every presentation update.

### Slot-Level State Model

Each displayed formation slot should be treated as a reusable view instance with
its own last-committed snapshot.

Tracked fields should include at least:

- occupant identity
- alive / dead visibility state
- soldier count display
- morale bar / morale text state
- active animation state
- movement / attack / return state
- hit white flash state
- model shake state
- damage-number state
- any slot-specific classes or inline style values written during playback

Only fields that changed relative to the last committed snapshot should trigger
DOM writes.

### Forced-Update Fields

Some presentation states are transient and must never be skipped simply because
their surrounding slot data appears stable.

These include:

- white flash
- model shake
- damage-number spawn / clear
- per-step attack / impact / return animation markers

These fields must be evaluated explicitly as playback events, not inferred from
static slot identity alone.

### Cached References

The overlay runtime should cache stable references instead of repeatedly
querying them during playback.

Expected cache targets include:

- overlay root elements
- left / right formation view handles
- slot DOM maps by slot key
- portrait / Spine frame hosts
- meter / label elements
- troop-type renderer handles
- frequently reused action-duration lookups when they are stable for the loaded
  renderer

## Rendering Rules

### No Full Rebuild During Playback

Once the overlay session is initialized, battle playback updates must not
rebuild the entire formation view unless the overlay itself is being recreated.

Instead:

- reuse the existing view skeleton
- update only the slots and summary fields whose committed state changed

### Commit Deduplication

If multiple render requests in the same playback phase would produce the same
effective overlay state, only one real UI commit should occur.

Rules:

- logical battle progression must still execute normally
- deduplication only suppresses redundant DOM work
- deduplication must not suppress transient effects whose state genuinely
  changed

### Explicit Reset on Reuse

Because nodes will now be reused, all reused slot views must clear old
presentation state explicitly.

This includes:

- stale classes
- stale `dataset` flags
- stale inline styles
- stale timeout / RAF bookkeeping markers stored on elements

The implementation must not rely on DOM recreation as an implicit reset.

## Approval Boundary

This design intentionally excludes more aggressive scheduling optimizations.

### Approved in This Batch

- pure implementation-level optimization
- DOM reuse
- cached references
- incremental updates
- duplicate commit removal

### Not Approved in This Batch

- playback-only throttling
- frame skipping
- repeated-frame suppression at the scheduler layer

If this first optimization pass is insufficient, any additional scheduling
optimization must be brought back for explicit user approval before
implementation.

## Testing Strategy

Add or update tests to verify:

- the battle overlay reuses its stable structure instead of rebuilding the whole
  formation view on each playback update
- repeated identical overlay state submissions do not cause duplicate commit
  work
- transient effects still render when their effect state changes
- battle results and presentation sequence remain unchanged from the caller's
  perspective

Existing battle / Spine regression tests must continue to pass.

## Acceptance Criteria

This work is complete when all of the following are true:

- full-screen formation battle presentation looks the same as before
- attack timing, impact timing, white flash, shake, damage numbers, and return
  behavior remain unchanged
- battle outcomes remain unchanged
- overlay playback no longer rebuilds the entire formation presentation on every
  state update
- slot-level updates are incremental and reuse stable DOM nodes
- redundant identical UI commits are suppressed
- automated tests cover the reuse / duplicate-update contract
- no playback throttling or frame skipping is introduced in this batch
