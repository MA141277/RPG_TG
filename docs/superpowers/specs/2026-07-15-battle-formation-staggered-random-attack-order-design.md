# Battle Formation Staggered Random Attack Order Design

## Goal

Replace the current fixed per-side strike order in formation battle overlay playback with a
randomized staggered launch schedule for the 9 formation members on each side.

The new behavior must:

- only apply to formation battle overlay combat
- randomly choose the next attacker from the current side's remaining attack-capable members
- start the next attacker after a random `200ms-400ms` delay counted from the previous attacker's
  animation start frame
- support swordsman jump/attack animations and archer stationary shooting animations under the same
  scheduling model
- finish one side's attack pool before handing initiative to the other side

## Scope

### In Scope

- changing formation battle strike timeline generation in `prototypes/battle-demo/index.html`
- changing formation battle overlay playback so strikes can launch at scheduled staggered times
- preserving current damage, hit, target selection, and morale resolution rules
- preserving current per-strike visual behavior once a strike has started
- adding regression coverage for randomized schedule generation and side handoff order

### Out Of Scope

- changing board-turn sequencing on the main battlefield
- changing unit movement range, hit chance, damage formulas, or target priority formulas
- changing the number of battle rounds
- changing battle Spine assets or animation content
- adding designer-facing controls for delay range tuning

## Current Behavior

`resolveAttack(attacker, defender)` currently builds a `timeline` by iterating each side's ready
members in the order returned by `sortFormationMembersForBattleOrder(getBattleReadyMembers(...))`.

Within `runSideRound(...)`:

- each member that can attack immediately pushes a `strike` step
- each strike stores a random `delayMs`
- the delay is informational only; it does not recursively determine the next strike's start time

Within `playFormationBattleTimeline(report)`:

- contiguous strike steps from the same side are grouped into a `strikeBatch`
- each batch is played as a side-local serial sequence through `playFormationStrikeBatch(...)`

This creates two mismatches against the requested behavior:

1. attack order is deterministic after the ready-member sort, not random within the ready pool
2. next-strike timing is not chained from the previous strike's animation start frame

## Required Behavior

For a given side and round:

1. Build the pool of attack-capable formation members for the current distance.
2. Randomly draw one attacker from that pool.
3. Launch that attack immediately at the side-local schedule time.
4. Immediately draw a random delay from `200ms-400ms`.
5. Count that delay from the current attack's animation start frame.
6. After the delay elapses, randomly draw the next attacker from the remaining pool.
7. Repeat until the current side has no remaining attack-capable members.
8. Only after that side finishes its pool may the opposing side begin its own pool.

For animation semantics:

- swordsman launch time is the first frame of the jump/attack animation sequence
- archer launch time is the first frame of the shoot animation sequence
- both are represented identically in the schedule model as strike `launchAtMs`

## Recommended Approach

Introduce explicit strike scheduling into the formation battle timeline instead of relying on
implicit same-side batching.

### Timeline Model

Each `strike` step should include:

```js
{
  type: "strike",
  sourceSide: "attacker" | "defender",
  targetSide: "attacker" | "defender",
  sourceSlotKey: "front-left",
  targetSlotKey: "front-left",
  sourceTroopType: "infantry" | "archer",
  targetTroopType: "infantry" | "archer",
  hit: true,
  damage: 12,
  launchAtMs: 0,
  nextDelayMs: 742
}
```

`launchAtMs` is the schedule anchor used by the overlay player. `nextDelayMs` exists for
inspection/debugging but the actual playback order is determined by `launchAtMs`.

### Generation Algorithm

Replace the current ordered loop in `runSideRound(...)` with:

1. Compute the ready-member pool.
2. Filter out members that cannot currently attack because of range, death, or stun.
3. Maintain `currentLaunchAtMs`, initially `0` for the side.
4. While the pool is non-empty:
   - randomly pick one member from the remaining pool
   - select its target using the existing `chooseFormationTarget(...)`
   - resolve hit/damage immediately using the existing combat logic
   - push a strike step with the current `launchAtMs`
   - draw `nextDelayMs = randInt(200, 400)`
   - increment `currentLaunchAtMs += nextDelayMs`
5. Emit an `entry` step if the pool is empty or no valid strikes could be formed.

This preserves deterministic battle state resolution once the random picks are made, and keeps
overlay playback as a pure consumer of precomputed strike events.

### Playback Model

Replace the current same-side serial `strikeBatch` playback with schedule-driven launch control.

Recommended structure:

- `playFormationBattleTimeline(report)` iterates the high-level step list
- contiguous strike steps from the same side become a `scheduledSideBlock`
- a new helper, for example `playScheduledFormationSideBlock(report, strikes, state)`, launches
  individual strike animations when their `launchAtMs` is reached
- individual strike playback remains delegated to a single-strike helper derived from the current
  `playFormationStrikeBatch(...)` internals

Important constraint:

- state snapshots after each strike must still be applied in strike schedule order so the overlay
  HP bars, damage popups, and formation snapshots remain aligned with the resolved combat results

## Data and Control Flow

### Resolution Phase

`resolveAttack(...)`
-> `runSideRound(...)`
-> random attacker selection + immediate combat resolution
-> strike steps written with `launchAtMs`
-> `showFormationBattleOverlay(report)`

### Playback Phase

`playFormationBattleTimeline(report)`
-> detects a scheduled same-side strike block
-> launches strike animations according to `launchAtMs`
-> applies snapshot progression after each strike completes
-> advances to the next side only after the current side block completes

## Edge Cases

### Empty Ready Pool

If a side has no attack-capable members at the current distance, emit the existing informational
entry step and do not schedule strikes.

### Target Dies Before Later Scheduled Strikes

This is already resolved during `resolveAttack(...)`, not during playback. Later strikes should
use the already resolved target snapshots contained in the timeline.

### Archer Scheduling

Archers do not move, but their strike still occupies a launch slot in the same schedule. No special
scheduler branch is needed beyond preserving their current stationary attack animation behavior.

### Delay Range

The requested delay range is inclusive `200ms-400ms`.

## Testing Strategy

Add regression tests covering:

- a same-side ready pool produces a random no-repeat attacker order until the pool is exhausted
- each later strike's `launchAtMs` equals the cumulative sum of previous side-local delay draws
- side handoff happens only after the current side's scheduled block finishes
- archer strikes participate in the same schedule model without requiring movement frames
- existing overlay state commit behavior still updates slot HP/loss state in the resolved strike order

## Risks

### Playback Complexity

The current overlay player assumes same-side serial strike batches. Converting it to scheduled
launches increases concurrency and requires tighter control over snapshot advancement.

### Visual Overlap Density

Because strikes can overlap, two nearby launches may cause denser simultaneous animation on screen.
This is intended behavior, but the playback helper must avoid double-resolving shared UI state.

## Recommended Implementation Boundary

Keep all logic inside the existing formation battle runtime in `prototypes/battle-demo/index.html`
for this iteration. Do not refactor board-turn ownership or broader combat systems as part of this
change.
