# Battle Audio Facade Design

Date: 2026-07-27

## 1. Goal

Add seven real-audio-backed battle sound effects through the existing centralized audio seam.

The implementation must let future battle code depend on one shared battle sound class instead of:

- hardcoded mp3 paths in battle logic
- direct `new Audio()` usage
- sound routing branches scattered across combat, damage, or skill code

This batch only delivers the shared battle sound facade and cue registration. Battle action-to-sound assignment is a separate follow-up.

## 2. Current Problem

The repository already has a centralized audio seam in `src/application/audio/audio-manager.ts`.

Today:

- BGM and one-shot cues are registered centrally
- `src/main.ts` owns static asset URL resolution
- reusable UI sound wrappers already exist for button and enter sounds

This is a good base, but battle sound ownership is still incomplete for the requested workflow:

- define a stable battle sound method once
- map that method to one cue once
- change the underlying mp3 later in one place
- keep battle logic independent from file names

If the project solves this by putting file paths into attack or damage code, the battle runtime will immediately regress into tightly coupled audio branches.

## 3. Scope

This design covers:

- seven new real mp3-backed battle cues
- one shared battle sound facade class with semantic methods
- stable repository asset placement for the seven mp3 files
- Vite-friendly static asset URL integration in `src/main.ts`
- regression tests for the new abstraction boundary

This design does not cover:

- assigning any current battle animation or damage event to these sounds yet
- replacing existing generated battle cues in the current runtime
- adding probabilistic sound selection, variation groups, or sequencing
- creating a second battle-only playback system

## 4. Design Principles

The implementation must follow these rules:

1. battle logic chooses a reusable sound method, not a file path
2. `audio-manager.ts` remains the owner of cue registry, buses, cooldowns, and playback
3. `src/main.ts` only resolves static asset URLs and keeps no battle-specific trigger logic
4. the seven mp3 files must live inside the repository under stable ASCII filenames
5. this batch must be additive and must not change current battle trigger behavior

## 5. Recommended Design

### 5.1 Audio Cue Ownership

Extend `src/application/audio/audio-manager.ts` with seven new built-in cue ids:

- `battle.slash.hit.1`
- `battle.slash.hit.2`
- `battle.slash.hit.3`
- `battle.slash.miss`
- `battle.bow.draw`
- `battle.arrow.release`
- `battle.impact.hit`

All seven cues stay on the existing `sfx` bus and remain non-looping one-shot sounds.

All seven use `asset-path` sources.

The logical asset keys should be:

- `audio/battle/slash-hit-1.mp3`
- `audio/battle/slash-hit-2.mp3`
- `audio/battle/slash-hit-3.mp3`
- `audio/battle/slash-miss.mp3`
- `audio/battle/bow-draw.mp3`
- `audio/battle/arrow-release.mp3`
- `audio/battle/impact.mp3`

### 5.2 Battle Sound Facade Class

Add a new application-layer module:

`src/application/audio/battle-sound.ts`

This module should export one shared facade class that wraps cue usage through semantic methods.

API contract:

```ts
class BattleSoundPlayer {
  playSlashHit1(session: AppAudioSession): AppAudioSession;
  playSlashHit2(session: AppAudioSession): AppAudioSession;
  playSlashHit3(session: AppAudioSession): AppAudioSession;
  playSlashMiss(session: AppAudioSession): AppAudioSession;
  playBowDraw(session: AppAudioSession): AppAudioSession;
  playArrowRelease(session: AppAudioSession): AppAudioSession;
  playImpact(session: AppAudioSession): AppAudioSession;
}
```

Canonical shared instance:

```ts
export const BATTLE_SOUND: BattleSoundPlayer;
```

The class must not create `Audio` elements directly and must not bypass the app audio session.

### 5.3 Real Asset Placement

Copy the provided desktop files into the repository under stable ASCII names:

- `src/assets/audio/battle/slash-hit-1.mp3`
- `src/assets/audio/battle/slash-hit-2.mp3`
- `src/assets/audio/battle/slash-hit-3.mp3`
- `src/assets/audio/battle/slash-miss.mp3`
- `src/assets/audio/battle/bow-draw.mp3`
- `src/assets/audio/battle/impact.mp3`
- `src/assets/audio/battle/arrow-release.mp3`

The original desktop paths must not remain as runtime dependencies.

### 5.4 Static Asset URL Resolution

Use the same static mp3 URL wiring pattern already used for UI sounds:

1. import the seven mp3 files in `src/main.ts` with `?url`
2. extend the static asset URL map with the seven logical battle asset keys
3. keep the current dynamic fallback for legacy audio assets

The repository already declares `*.mp3?url` in `src/vite-env.d.ts`, so no additional typing change is needed in this batch.

## 6. Behavioral Contract

After this batch:

- the project has seven centralized battle cue ids
- future battle logic can depend on one shared battle sound facade
- changing any underlying battle mp3 happens centrally
- the new cues are real mp3-backed one-shot playback

Repository mismatch handled in this batch:

- the current runtime already has an older generated cue at `battle.impact`
- this batch must stay additive and must not silently replace that live cue
- therefore the new real mp3 impact cue is added as `battle.impact.hit`

After this batch, no current battle logic is required to trigger these sounds yet.

## 7. File-Level Change Plan

### 7.1 `src/application/audio/audio-manager.ts`

Change responsibilities:

- add seven built-in battle cue ids
- add seven mp3-backed cue definitions
- keep queue and controller behavior unchanged

Do not:

- add battle-action-specific branching here
- add animation timing logic here
- create a second playback path

### 7.2 `src/application/audio/battle-sound.ts`

Add responsibilities:

- define the shared battle sound facade class
- export the canonical shared instance
- wrap `queueAppAudioCue` through semantic battle methods

Do not:

- render UI
- create HTML strings
- instantiate browser audio directly

### 7.3 `src/main.ts`

Change responsibilities:

- import the seven mp3 files as static URLs
- extend the static audio asset URL map for the new battle asset keys

Do not:

- map concrete battle animations or attacks to these sounds in this batch
- add battle-specific trigger routing here

## 8. Testing Requirements

Implementation must add regression coverage for:

1. the shared battle sound facade queues all seven battle cues through the shared app audio session model
2. the new built-in cue ids are exported from the audio manager
3. the audio controller plays the new battle cues through the normal one-shot asset path
4. `src/main.ts` resolves the seven battle audio assets through static mp3 URL imports before the dynamic fallback

This batch does not need tests for battle event timing, because that mapping is explicitly out of scope.

## 9. Open Follow-Up

After this batch lands, the next integration batch can safely:

- assign specific swordsman, archer, cavalry, or other troop actions to these sound methods
- replace temporary generated battle cues where appropriate
- tune cooldowns, concurrency, and volumes per cue

That follow-up must still route through the shared battle sound facade and centralized cue registry rather than introducing per-action file references.

## 10. Final Recommendation

Implement the requested feature by extending the existing centralized audio seam and adding a battle-specific facade class.

The correct first version is:

- seven centralized real mp3-backed battle cues
- one shared battle sound facade class
- one canonical shared instance
- static asset URL wiring for reliable playback
- additive behavior that does not modify current battle trigger logic
