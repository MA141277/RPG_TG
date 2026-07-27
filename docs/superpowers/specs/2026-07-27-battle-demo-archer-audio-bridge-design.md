## Battle-Demo Archer Audio Bridge Design

Date: 2026-07-27

## 1. Goal

Add frame-accurate archer attack audio to the embedded `battle-demo` runtime while keeping real playback ownership inside the centralized app audio system.

Requested behavior:

- start bow-draw audio on frame `18`
- if bow-draw is still active during frames `37-40`, fade it out across that window
- start arrow-release audio on frame `41`
- if the strike hits and arrow-release is still active during frames `45-48`, fade it out across that window
- if the strike hits, play the impact cue on frame `49`
- if the strike misses, do not play the impact cue

This batch only covers `prototypes/battle-demo/index.html`.

## 2. Current Runtime Mismatch

The repository already has:

- centralized battle cue ownership in `src/application/audio/audio-manager.ts`
- a semantic battle sound facade in `src/application/audio/battle-sound.ts`
- controller-side playback variation for the real battle mp3 cues

However, the visible battle animation currently runs inside the embedded iframe page:

- `prototypes/battle-demo/index.html`

That page currently:

- owns archer animation and frame callbacks
- owns archer visual effects timing
- only sends `rpg-tg:battle-demo-result` messages upward
- does not send any semantic audio messages to the parent app

If archer mp3 playback is implemented directly inside the iframe with local `Audio` elements, the new behavior will bypass the existing randomized playback system and split battle audio ownership into two runtimes.

## 3. Scope

This design covers:

- archer attack audio timing in `prototypes/battle-demo/index.html`
- an iframe-to-parent semantic audio bridge for the embedded battle demo
- chain-local fade-out handoff between archer attack phases
- main-app handling that still routes real playback through the shared battle cue system
- regression tests for battle-demo message timing and parent-side bridge behavior

This design does not cover:

- `prototypes/troop-management-preview/index.html`
- melee sound timing
- new battle audio assets
- replacing the centralized app audio controller
- generic iframe audio messaging for all future systems

## 4. Design Principles

The implementation must follow these rules:

1. `battle-demo` decides frame timing, but does not own mp3 playback
2. the parent app remains the only owner of real battle cue playback
3. existing controller-side playback variation stays active for archer cues
4. fade-outs apply only within a single archer attack chain and never across different attackers
5. miss handling must not fabricate an impact cue
6. the existing battle-demo impact frame remains the source of truth for archer hit timing

## 5. Confirmed Frame Contract

The current battle-demo runtime already resolves archer damage timing to frame `49`.

This comes from the existing `playBattleSpineStrike(...)` flow:

- archer uses the stationary attack path
- `impactFrame` falls back to `49` for archer strikes
- `animateBattleSpineProxy(...)` fires `onImpact` once `actionFrame >= impactFrame`

The archer visual-effect plan already aligns with that cadence:

- arrow launch begins on frame `41`
- impact-side visual staging begins on frame `49`

Therefore the archer audio contract for this batch is:

- frame `18`: start `battle.bow.draw`
- frames `37-40`: if the same attack chain still has an active draw player, fade it out
- frame `41`: start `battle.arrow.release`
- frames `45-48`: if `hit === true` and the same attack chain still has an active release player, fade it out
- frame `49`: if `hit === true`, start `battle.impact.hit`
- miss: do not start any impact cue

All frame thresholds must use `actionFrame >= targetFrame` plus one-shot guards so dropped render frames cannot skip audio events.

## 6. Recommended Architecture

### 6.1 Ownership Split

`prototypes/battle-demo/index.html` should own:

- archer strike frame detection
- per-strike message emission
- attack-chain identity generation

The parent app should own:

- cue lookup
- actual audio element creation
- fade scheduling
- playback variation
- duplicate suppression for stale transitions

### 6.2 Bridge Message

Add a second battle-demo iframe message beside `rpg-tg:battle-demo-result`:

- `rpg-tg:battle-demo-audio`

Messages must remain semantic and must not send asset paths.

Recommended payload shape:

```ts
type BattleDemoAudioMessage = {
  type: "rpg-tg:battle-demo-audio";
  scenarioId: string;
  chainId: string;
  phase: "draw" | "release" | "impact";
  mode: "play" | "transition";
  currentActionFrame: number;
  frameDurationMs: number;
  fadeFrames?: number;
  nextStartFrame?: number;
};
```

`scenarioId` is required for parent-side validation against the active embedded battle session.

`currentActionFrame` is required so the parent can compress a fade window if a dropped render frame causes the iframe to send the transition late.

### 6.3 Chain Identity

Each archer strike must produce a chain-local id so fade requests only touch the previous audio segment from the same shot.

Recommended ingredients:

- `sourceSide`
- `sourceSlotKey`
- `launchAtMs`

Example shape:

```ts
`${step.sourceSide}:${step.sourceSlotKey}:${step.launchAtMs}`
```

The exact string format is not important as long as one strike consistently reuses one `chainId`.

## 7. Battle-Demo Runtime Design

### 7.1 Archer Audio Planning

Inside `playBattleSpineStrike(...)`, archer strikes should resolve one local timing plan:

- `drawStartFrame = 18`
- `drawFadeStartFrame = 37`
- `drawEndFrame = 41`
- `releaseStartFrame = 41`
- `releaseFadeStartFrame = 45`
- `releaseEndFrame = 49`
- `impactFrame = 49`
- `hit = step.hit`

This plan is consumed only by the current strike animation.

### 7.2 Message Emission

The archer `onFrame` callback should emit:

1. one `play(draw)` message once `actionFrame >= 18`
2. one `transition(release)` message once `actionFrame >= 37`
3. if `step.hit === true`, one `transition(impact)` message once `actionFrame >= 45`

The transition payload must include:

- `currentActionFrame`
- `fadeFrames`
- `nextStartFrame`

The parent uses those values to fade the current phase during the remaining frame window and to start the next phase at the authored target frame.

This means the iframe does not need to post a separate frame-`41` play message for release or a separate frame-`49` play message for impact if the parent bridge treats transition messages as:

- fade current phase now
- schedule next phase at `nextStartFrame`

That is the recommended contract because it keeps all timing for a single handoff in one message.

### 7.3 Miss Handling

For misses:

- emit draw start
- emit draw-to-release transition
- do not emit any impact transition or impact play message

Release is allowed to finish naturally on misses.

## 8. Parent Audio Bridge Design

### 8.1 Message Intake

Extend the existing global `window.addEventListener("message", ...)` handler in `src/main.ts` to:

- preserve `handleBattleDemoResultMessage(...)`
- validate and route `rpg-tg:battle-demo-audio`

Invalid messages must be ignored when:

- `type` does not match
- the active story battle has no `demoScenarioId`
- `scenarioId` does not match the active embedded battle session
- `chainId` is missing
- `phase` or `mode` is unknown

### 8.2 Bridge State Table

The parent audio bridge should keep a map keyed by `chainId`.

Each entry should track:

- current active player for the chain
- current phase
- current cue id
- a generation token used to invalidate stale fade schedules

### 8.3 Cue Mapping

Map semantic archer phases to the already-registered shared battle cues:

- `draw` -> `battle.bow.draw`
- `release` -> `battle.arrow.release`
- `impact` -> `battle.impact.hit`

The bridge must use these existing centralized cue ids rather than creating new archer-only cue definitions.

### 8.4 Transition Behavior

For `play`:

- start the mapped cue immediately
- store the created player under the chain entry

For `transition`:

- compute `remainingFadeFrames = max(0, nextStartFrame - currentActionFrame)`
- compute `fadeDurationMs = remainingFadeFrames * frameDurationMs`
- if the current chain player is still active, schedule a short stepped fade-out over that duration
- start the mapped next cue after `fadeDurationMs`
- replace the chain entry with the new active player and increment generation

If the older player already ended before the fade window begins:

- skip the fade
- still start the next cue after the remaining computed delay

If `remainingFadeFrames === 0` because the iframe crossed the threshold late:

- skip any audible fade
- start the next cue immediately

If a stale scheduled fade or start callback runs after a newer generation took ownership:

- ignore it

## 9. Fade Rules

### 9.1 Draw To Release

For the requested handoff:

- fade window begins at frame `37`
- fade duration spans `4` frames
- release starts on frame `41`

This exactly matches the user-approved example:

- if draw is still audible when frame `37` begins
- fade it out across `37-40`
- start release on `41`

### 9.2 Release To Impact

For hit-only handoff:

- fade window begins at frame `45`
- fade duration spans `4` frames
- impact starts on frame `49`

On miss:

- do not cut release for a nonexistent impact cue

### 9.3 Fade Implementation Notes

The bridge should use the current runtime frame duration reported by the iframe so fade timing stays aligned even if the renderer fps differs from an assumed fixed value.

Recommended initial fade shape:

- four stepped volume reductions
- ending at zero or near-zero just before next cue start

This is intentionally a battle-demo bridge concern and should not replace the existing per-cue fade-in variation system.

## 10. Testing Requirements

Implementation must add regression coverage for:

1. `battle-demo` archer strikes emit exactly one draw start at frame `18`
2. `battle-demo` archer strikes emit exactly one draw-to-release transition once frame `37` is reached
3. hit archer strikes emit exactly one release-to-impact transition once frame `45` is reached
4. miss archer strikes do not emit any impact transition or impact play message
5. the parent ignores malformed or scenario-mismatched battle-demo audio messages
6. chain-local fade scheduling only affects the active player for the same `chainId`
7. two different `chainId` values can overlap without fading each other
8. the next cue still starts on time when the previous cue already ended before the fade window

## 11. File-Level Change Plan

### 11.1 `prototypes/battle-demo/index.html`

Add responsibilities:

- resolve the archer audio timing plan
- emit semantic audio bridge messages on the approved frame thresholds
- assign a stable `chainId` per archer strike

Do not:

- import battle mp3 assets
- construct local `Audio` players
- duplicate playback-variation rules

### 11.2 `src/main.ts`

Add responsibilities:

- parse `rpg-tg:battle-demo-audio` messages
- validate them against the active embedded battle session
- forward them into the app audio bridge

Do not:

- add battle-demo-specific cue file paths
- move animation timing logic out of the iframe

### 11.3 `src/application/audio/audio-manager.ts`

Add responsibilities:

- support chain-local battle-demo bridge playback state
- support fade-out scheduling for a live one-shot player when a validated transition message arrives

Do not:

- remove or weaken existing playback variation
- special-case archer timing inside the shared cue registry

## 12. Final Recommendation

Implement battle-demo archer attack audio as a semantic iframe-to-parent bridge.

The correct first version is:

- battle-demo frame detection at `18`, `37`, `45`, and existing impact timing at `49`
- centralized parent-side playback through the shared battle cues
- chain-local fade handoff between draw and release, and between release and impact on hit only
- no local mp3 playback inside the iframe
