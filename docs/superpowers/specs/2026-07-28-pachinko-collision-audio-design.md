## Pachinko Collision Audio Design

Date: 2026-07-28

## 1. Goal

Add shared pachinko collision audio to the centralized app audio system so the temple work marble minigame plays randomized impact sounds whenever a marble collides and actually changes direction.

Requested behavior for this batch:

- keep the feature inside the existing house and playable contracts
- do not hardcode audio playback against one temple button or one temple-only branch
- expose the collision trigger through a dedicated audio management class
- randomly draw from two provided wall-hit samples on every playback
- apply lightweight per-play humanization:
  - pitch offset within the existing `±5% ~ ±15%` brief
  - volume offset within `±2 ~ ±3 dB`
  - occasional tiny start-offset / fade-in variation
- play one collision hit for:
  - side-wall rebounds
  - pin rebounds
  - flipper rebounds
  - moving-gate pin rebounds
  - bottom wall / slot-divider rebounds
- play two quick staggered hits when a ball settles into a slot
- make the two slot-settle hits feel like `哒哒` rather than one simultaneous stack

## 2. House Contract Alignment

This work extends an existing special house flow, so it must continue to follow the repository house interface contract:

- `temple-house` remains the house business owner
- the pachinko board remains a shared `activity-qte` playable
- centralized audio ownership remains in `src/application/audio/*`
- `src/main.ts` may only host stable cross-system wiring

This means the sound must not be implemented by:

- temple-specific `new Audio(...)` playback
- `main.ts` string-matching on a temple task id
- view-layer one-off listeners bound directly to one renderer

## 3. Current Runtime Location

The requested minigame is already split across shared seams:

- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - launches and hosts the shared pachinko playable
- `src/application/activity/activity-qte-runtime.ts`
  - owns pachinko physics, rebounds, gate contact, and slot settlement
- `src/main.ts`
  - drives the shared `activity-qte` tick loop and owns the centralized audio controller
- `src/application/audio/audio-manager.ts`
  - owns cue registration, overlap caps, and playback variation
- small wrapper classes under `src/application/audio/*.ts`
  - already centralize named sound calls such as enter, troop selection, and troop mutation

That makes the shared pachinko runtime the correct place to detect collision events, and the shared audio layer the correct place to own playback.

## 4. Current Mismatch

The codebase already has the playback-variation machinery this request wants:

- centralized cue registration
- overlap control
- randomized pitch / volume / start offset / fade-in support

However, the current pachinko flow still lacks:

- a dedicated collision sound wrapper class
- shared pachinko collision cue registrations for the two external samples
- a runtime pulse that tells the app layer which tick produced audible rebounds
- a reusable slot-settle burst rule

If the sound were added by directly calling raw cue ids from temple gameplay code, the implementation would violate the requested “sound manager class” rule and would make later audio swaps more expensive.

## 5. Scope

This design covers:

- copying the two provided external mp3 files into shared activity audio assets
- central cue registration for two pachinko collision samples
- a dedicated pachinko collision audio management class
- shared collision pulse data emitted by the pachinko runtime
- one stable app-level consumer that turns those pulses into playback
- one staggered two-hit rule for slot settlement
- regression coverage for the audio class, cue registry, runtime pulse, and app playback seam

This design does not cover:

- pachinko launch audio
- temple work scoring or reward balance
- view markup changes for new collision buttons or controls
- non-pachinko temple sounds
- other minigames

## 6. Approaches Considered

### 6.1 Recommended: Shared Physics Pulse + Shared Audio Class

Detect audible rebounds inside the shared pachinko physics runtime, write a small per-tick audio pulse into the shared pachinko session, and let the app-level `activity-qte` loop consume that pulse through a dedicated pachinko collision sound class.

Pros:

- matches the real collision truth
- keeps temple business code clean
- keeps playback centralized
- reuses the existing audio variation system
- lets future pachinko-like playables reuse the same seam

Cons:

- requires a small shared runtime-session extension

### 6.2 Temple Module Side Effect

Let `temple-house` infer when the shared playable probably collided and emit audio side effects from the house module.

Pros:

- lower change count in the shared app layer

Cons:

- wrong ownership boundary
- temple module does not own the actual collision math
- becomes fragile if the same playable is reused outside the temple

### 6.3 View / DOM Playback Hook

Infer collisions from rerendered board state or DOM animation hooks and play audio from the view layer.

Pros:

- quick to prototype

Cons:

- bypasses centralized audio ownership
- hard to distinguish real rebounds from non-audible corrections
- risks duplicate or dropped playback

## 7. Approved Direction

Use approach `6.1`.

The shared pachinko runtime emits collision pulses. The centralized audio system owns the real sound playback. A dedicated pachinko collision audio class chooses the sample pool and exposes the call site so callers never hardcode cue ids or mp3 paths.

## 8. Recommended Architecture

### 8.1 Shared Cue Contract

Register two shared non-looping sfx cues in `src/application/audio/audio-manager.ts`:

- builtin key `activityPachinkoBounce1`
  - cue id `activity.pachinko.bounce.1`
  - asset path `audio/activity/pachinko-bounce-1.mp3`
- builtin key `activityPachinkoBounce2`
  - cue id `activity.pachinko.bounce.2`
  - asset path `audio/activity/pachinko-bounce-2.mp3`

Each cue should use the same playback config:

- `bus: "sfx"`
- `loop: false`
- `maxInstances: 12`
- a shared `PACHINKO_BOUNCE_PLAYBACK_VARIATION` profile with:
  - `pitchOffsetRatioRange: { min: 0.05, max: 0.15 }`
  - `volumeOffsetDbRange: { min: 2, max: 3 }`
  - occasional small `startOffsetSeconds`
  - occasional short `fadeInSeconds`

This keeps the “2 samples × randomized playback” rule centralized and editable in one place.

### 8.2 Dedicated Audio Management Class

Add a new file:

- `src/application/audio/pachinko-collision-sound.ts`

Required exports:

```ts
class PachinkoCollisionSoundEffect
const PACHINKO_COLLISION_SOUND
```

The class should own the reusable collision sample pool rather than exposing raw cue ids to gameplay code.

Recommended shape:

- `cueIds: readonly string[]`
- `pickCueId(random?)`
- `play(target, random?)`

`target` only needs a stable `playCue(cueId: string)`-like seam, so the class can trigger immediate tick-driven playback without making `main.ts` know which concrete sample was chosen.

The app layer should refer to `PACHINKO_COLLISION_SOUND`, not to `activity.pachinko.bounce.1` / `.2` directly.

### 8.3 Shared Pachinko Audio Pulse

Extend `ActivityPachinkoBoardSession` with one per-tick audio pulse payload, for example:

```ts
audioPulse: {
  token: number;
  collisionCount: number;
  settleCount: number;
}
```

Rules:

- `collisionCount`
  - counts rebounds that should emit exactly one impact sound
- `settleCount`
  - counts slot settlements that should emit the `哒哒` double-hit rule
- `token`
  - increments only when the current tick produced at least one new audible event

The pulse is reset on the next non-event tick. The app layer consumes each `token` at most once.

### 8.4 Collision Detection Rule

An audible collision is defined as “the physics step applied a rebound that changed velocity direction.”

Apply the rule to:

- side-wall rebounds from `collidePachinkoBallWithSideWalls(...)`
- pin rebounds from `collidePachinkoBallWithPin(...)`
- flipper rebounds from `collidePachinkoBallWithFlipper(...)`
- moving-gate pin rebounds
  - already covered because gate pins are part of the shared collision pin list
- bottom wall / slot-divider rebounds from `collidePachinkoBallWithBottomWall(...)`

Do not count:

- pure position corrections with no velocity direction change
- passing cleanly through the moving gate
- wheel reward flow

### 8.5 Slot Settlement Burst

When `settlePachinkoBall(...)` resolves a ball into a slot:

- increment `settleCount` by `1`
- app playback converts that into `2` impact plays
- the two plays are staggered by `80ms`

This keeps the rule data-driven:

- one runtime settlement event
- one centralized burst interpretation

It also lets the “哒哒” spacing be tuned later in one place.

### 8.6 App-Level Playback Consumer

Consume pachinko audio pulses in the stable `activity-qte` loop inside `src/main.ts`.

Recommended flow:

1. tick the shared `activity-qte` runtime
2. inspect the next `pachinko-board` session
3. if the pulse `token` is new:
   - call `PACHINKO_COLLISION_SOUND.play(appAudioController)` once per `collisionCount`
   - call the same sound twice per `settleCount`, with the second hit delayed by `80ms`
4. update the locally consumed token

Important boundary rule:

- `src/main.ts` may call the sound class through one stable helper
- it must not mention concrete pachinko collision cue ids or asset paths
- it must not branch on temple task ids

## 9. Asset Wiring

Copy the provided source files into:

- `src/assets/audio/activity/pachinko-bounce-1.mp3`
- `src/assets/audio/activity/pachinko-bounce-2.mp3`

Then add static imports plus `STATIC_AUDIO_ASSET_URLS` mapping entries in `src/main.ts`.

The asset filenames stay ASCII-only even though the original source files are Chinese-named.

## 10. Testing Requirements

Implementation must add or extend regression coverage for:

1. `PACHINKO_COLLISION_SOUND` is exposed through one dedicated collision-audio class rather than raw cue ids in gameplay code
2. the collision sound class randomly chooses only from the two registered bounce cues
3. `audio-manager.ts` registers:
   - `activityPachinkoBounce1`
   - `activityPachinkoBounce2`
   - both activity asset paths
   - the shared pachinko playback-variation profile
4. `src/main.ts` imports and statically maps:
   - `./assets/audio/activity/pachinko-bounce-1.mp3?url`
   - `./assets/audio/activity/pachinko-bounce-2.mp3?url`
5. the shared pachinko runtime emits one collision pulse when:
   - a side wall rebound flips horizontal direction
   - a pin rebound reflects velocity
   - a flipper rebound reflects velocity
   - a bottom wall / divider rebound flips direction
6. the runtime emits one settlement pulse when `settlePachinkoBall(...)` resolves a slot
7. the app-level `activity-qte` loop consumes a new pulse token only once
8. settlement playback schedules two collision hits with an `80ms` gap

## 11. Documentation Follow-Up

If implementation changes shipped runtime session shape or shared registry shape, the code batch must also update:

- `docs/change-log.md`

`docs/special-house-interface.md` does not need a new contract section for this batch unless implementation broadens the public house lifecycle surface beyond the shared runtime seam described here.

## 12. Final Recommendation

Implement pachinko collision audio as a shared activity-runtime pulse consumed by one centralized audio management class. Register both provided mp3 files as centralized bounce cues, let the dedicated pachinko collision sound class randomize which sample is used, reuse the existing playback-variation system for pitch/volume/start-offset humanization, and interpret slot settlement as a centralized two-hit `80ms` burst. This satisfies the requested “do not hardcode” rule while keeping the feature reusable outside one temple-only path.
