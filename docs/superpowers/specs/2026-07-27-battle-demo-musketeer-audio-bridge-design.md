## Battle-Demo Musketeer Audio Bridge Design

Date: 2026-07-27

## 1. Goal

Add frame-accurate musketeer reload and fire audio to the embedded `battle-demo` runtime while keeping real playback ownership inside the centralized app audio system.

Requested behavior:

- start reload audio on frame `9`
- if reload is still active during frames `26-28`, fade it out across that window
- start fire audio on frame `29`
- fire audio must play whether the strike hits or misses
- musketeer strikes do not play a separate hit-impact cue

This batch only covers `battle-demo`.

## 2. Current Runtime Mismatch

The repository already has:

- centralized cue ownership in `src/application/audio/audio-manager.ts`
- battle mp3 asset resolution in `src/main.ts`
- controller-side battle audio humanization for pitch, volume, and optional start/fade micro-variation
- an existing iframe-to-parent archer audio bridge that only understands `draw`, `release`, and `impact`

However, the embedded battle runtime currently has no musketeer-specific bridge timing, and the shared cue registry has no musketeer reload or fire asset cues.

If musketeer mp3 playback is implemented directly inside `prototypes/battle-demo/index.html`, the new behavior would bypass the existing randomized playback system and split battle audio ownership into two runtimes.

## 3. Scope

This design covers:

- musketeer attack audio timing in `prototypes/battle-demo/index.html`
- copying the provided musketeer reload and fire mp3 assets into `src/assets/audio/battle/`
- extending the existing iframe-to-parent battle-demo audio bridge to support musketeer phases
- main-app handling that still routes playback through the shared audio controller
- regression tests for source timing, asset wiring, and parent-side bridge behavior

This design does not cover:

- `prototypes/troop-management-preview/index.html`
- melee timing changes
- new hit visual effects
- replacing the centralized app audio controller

## 4. Design Principles

The implementation must follow these rules:

1. `battle-demo` decides frame timing, but does not own mp3 playback.
2. The parent app remains the only owner of real battle cue playback.
3. Existing controller-side playback variation stays active for musketeer reload and fire cues.
4. Fade-outs apply only within a single musketeer attack chain and never across different attackers.
5. Musketeer bridge handling must not fabricate an impact cue on hit or miss.
6. The existing musketeer hit frame remains the source of truth for gameplay damage timing unless explicitly changed later.

## 5. Confirmed Frame Contract

The current battle-demo runtime already resolves musketeer damage timing to frame `30`.

This comes from the existing stationary musketeer attack path:

- `BATTLE_SPINE_TROOP_ASSETS.musketeer.attackImpactFrame = 30`
- `playBattleSpineStrike(...)` resolves `attackPeakFrame` from `troopAsset.attackImpactFrame`
- `animateBattleSpineProxy(... onImpact)` fires once `actionFrame >= impactFrame`

Therefore the musketeer audio contract for this batch is:

- frame `9`: start `battle.musketeer.reload`
- frames `26-28`: if the same attack chain still has an active reload player, fade it out
- frame `29`: start `battle.musketeer.fire`
- no separate impact cue on hit or miss

Frame `30` still remains the existing gameplay damage frame for musketeer strikes, but this batch no longer binds audio playback to that moment.

All frame thresholds must use `actionFrame >= targetFrame` plus one-shot guards so dropped render frames cannot skip audio events.

## 6. Recommended Architecture

### 6.1 Ownership Split

`prototypes/battle-demo/index.html` should own:

- musketeer strike frame detection
- per-strike bridge message emission
- attack-chain identity generation

The parent app should own:

- cue lookup
- actual audio element creation
- fade scheduling
- playback variation
- duplicate suppression for stale transitions

### 6.2 Bridge Message

Reuse the existing `rpg-tg:battle-demo-audio` message type, but extend the semantic phase contract with:

- `reload`
- `fire`

Recommended message shape after this batch:

```ts
type BattleDemoAudioMessage = {
  type: "rpg-tg:battle-demo-audio";
  scenarioId: string;
  chainId: string;
  phase: "draw" | "release" | "reload" | "fire" | "impact";
  mode: "play" | "transition";
  currentActionFrame: number;
  frameDurationMs: number;
  fadeFrames?: number;
  nextStartFrame?: number;
};
```

Messages must remain semantic and must not send asset paths.

### 6.3 Chain Identity

Each musketeer strike must produce a chain-local id so fade requests only touch the previous audio segment from the same shot.

Recommended shape:

```ts
`${step.sourceSide}:${step.sourceSlotKey}:${step.launchAtMs}`
```

The exact string format is not important as long as one strike consistently reuses one `chainId`.

## 7. Battle-Demo Runtime Design

Inside `playBattleSpineStrike(...)`, musketeer strikes should resolve one local timing plan:

- `reloadStartFrame = 9`
- `reloadFadeStartFrame = 26`
- `fireStartFrame = 29`
- `hit = step.hit`

The musketeer `onFrame` callback should emit:

1. one `play(reload)` message once `actionFrame >= 9`
2. one `transition(fire)` message once `actionFrame >= 26`

The transition payload must include:

- `currentActionFrame`
- `fadeFrames`
- `nextStartFrame`

Recommended musketeer payload details:

- reload to fire: `fadeFrames = 3`, `nextStartFrame = 29`

For both hits and misses:

- emit reload start
- emit reload-to-fire transition
- do not emit any impact transition

## 8. Parent Audio Bridge Design

Extend the existing shared audio bridge so the phase-to-cue map becomes:

- `draw` -> `battle.bow.draw`
- `release` -> `battle.arrow.release`
- `reload` -> `battle.musketeer.reload`
- `fire` -> `battle.musketeer.fire`

Add two new shared cue ids and cue definitions:

- `battle.musketeer.reload`
- `battle.musketeer.fire`

Both new cues must use the same battle asset humanization config that already randomizes pitch, volume, and optional start/fade variation for battle mp3 cues.

## 9. Asset Design

Copy the user-provided local files into the repository with ASCII filenames:

- `src/assets/audio/battle/musketeer-reload.mp3`
- `src/assets/audio/battle/musketeer-fire.mp3`

Then wire them through `src/main.ts` static battle asset resolution using the same `?url` import pattern as the existing bow/arrow/impact assets.

## 10. Testing Requirements

Implementation must add regression coverage for:

1. musketeer strikes emit exactly one reload start at frame `9`
2. musketeer strikes emit exactly one reload-to-fire transition once frame `26` is reached
3. musketeer strikes do not emit any impact transition on hit or miss
4. `src/main.ts` imports and maps the two new musketeer mp3 assets
5. the shared audio controller can fade reload over the remaining frame window before starting fire for the same `chainId`
6. chain-local fade scheduling remains isolated across different `chainId` values

## 11. Final Recommendation

Implement battle-demo musketeer attack audio as an extension of the existing semantic iframe-to-parent battle-demo bridge.

The correct version is:

- battle-demo frame detection at `9` and `26`, with fire start on `29` and gameplay damage timing still occurring on `30`
- centralized parent-side playback through the shared battle cue registry
- new centralized musketeer reload and fire cue ids backed by the provided mp3 assets
- chain-local fade handoff from reload to fire only
- no local mp3 playback inside the iframe
