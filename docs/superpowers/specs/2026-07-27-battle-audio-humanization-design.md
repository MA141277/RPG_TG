# Battle Audio Humanization Design

Date: 2026-07-27

## 1. Goal

Add a low-cost, battle-audio-only humanization layer for the newly added real mp3 battle cues.

Each playback of the current battle asset cues should receive small randomized variation in:

- pitch
- volume
- occasional start offset
- occasional fade-in

The implementation must preserve the existing centralized audio seam and must not hardcode audio behavior inside battle, damage, or skill logic.

## 2. Current Problem

The repository already has:

- a centralized cue registry in `src/application/audio/audio-manager.ts`
- a shared battle sound facade in `src/application/audio/battle-sound.ts`
- seven new real mp3-backed battle cues

Today those seven battle asset cues still play identically every time.

That creates audible repetition even before any future sample-pool or action routing work is added.

The requested improvement is not a battle-logic feature. It is a playback-layer feature and should live at the one-shot audio controller boundary.

## 3. Scope

This design covers:

- playback humanization for the current seven real mp3-backed battle cues
- deterministic test seams for randomization and fade scheduling
- additive controller-side behavior only

This design does not cover:

- assigning battle actions to sounds
- random sample-pool selection between multiple slash-hit methods
- changing existing generated cues such as `battle.command`, `battle.impact`, or `battle.victory`
- creating a separate battle-only playback system

## 4. Design Principles

The implementation must follow these rules:

1. only the current real battle asset cues receive humanization
2. battle logic and `battle-sound.ts` remain cue-queueing code, not playback-randomization code
3. `audio-manager.ts` remains the owner of playback policy
4. the new behavior must be configurable per cue through cue definition metadata
5. old generated battle cues must remain behaviorally unchanged in this batch

## 5. Recommended Design

### 5.1 Ownership

Extend `AudioCueDefinition` with an optional playback humanization profile.

Only these seven cues receive the profile:

- `battle.slash.hit.1`
- `battle.slash.hit.2`
- `battle.slash.hit.3`
- `battle.slash.miss`
- `battle.bow.draw`
- `battle.arrow.release`
- `battle.impact.hit`

No UI cue, BGM cue, or legacy generated battle cue should receive this profile.

### 5.2 Humanization Parameters

The battle asset profile should apply these rules on every playback:

- pitch offset:
  - symmetric random offset
  - magnitude sampled from `5%` to `15%`
  - sign sampled independently
- volume offset:
  - symmetric random offset in decibels
  - magnitude sampled from `2 dB` to `3 dB`
  - sign sampled independently
  - converted to volume multiplier before being applied to the cue default volume
- start offset:
  - occasional
  - low probability trigger
  - tiny offset range only, measured in seconds
- fade-in:
  - occasional
  - low probability trigger
  - extremely short ramp in

Recommended initial defaults:

- pitch magnitude range: `0.05` to `0.15`
- volume magnitude range: `2` to `3` dB
- start offset chance: `20%`
- start offset range: `0.006` to `0.018` seconds
- fade-in chance: `20%`
- fade-in range: `0.012` to `0.024` seconds
- fade-in steps: `4`

### 5.3 Playback-Layer Application

Humanization must be applied inside the one-shot playback path in `createAppAudioController()`.

Required behavior:

1. resolve cue source normally
2. create audio element normally
3. if the cue has a playback humanization profile, compute one randomized playback state
4. apply:
   - `playbackRate`
   - `volume`
   - optional `currentTime` offset
   - optional short scheduled fade-in
5. then play through the existing controller flow

### 5.4 Pitch Behavior

When pitch variation is applied:

- set `playbackRate`
- disable pitch preservation on supported browsers when the property exists

The controller should support:

- `preservesPitch`
- `mozPreservesPitch`
- `webkitPreservesPitch`

when those properties are present on the audio element.

### 5.5 Test Seams

Extend `createAppAudioController()` with deterministic inputs for testing:

- `random?: () => number`
- `scheduleTask?: (callback: () => void, delayMs: number) => unknown`

Production defaults:

- `random` falls back to `Math.random`
- `scheduleTask` falls back to `setTimeout`

This lets tests prove exact pitch, volume, start offset, and fade timing without depending on real nondeterministic playback.

## 6. Behavioral Contract

After this batch:

- the seven real battle asset cues sound slightly different on repeated playback
- `battle-sound.ts` API remains unchanged
- legacy generated battle cues remain unchanged
- playback randomization still stays centralized in the audio controller

## 7. File-Level Change Plan

### 7.1 `src/application/audio/audio-manager.ts`

Change responsibilities:

- add playback humanization metadata to the seven real battle asset cues
- add randomized playback helpers
- add deterministic controller seams for random and scheduling

Do not:

- change cue queue semantics
- move logic into battle runtime code
- modify generated battle cue mappings

### 7.2 `tests/audio-manager.test.cjs`

Add regression tests for:

- deterministic pitch and volume variation on battle asset cues
- deterministic start offset on battle asset cues
- deterministic fade-in scheduling on battle asset cues
- non-application to legacy generated battle cues

## 8. Open Follow-Up

A later batch may add random sample-pool selection such as:

- one semantic slash method selecting among multiple slash assets
- one semantic impact method selecting among multiple impact assets

That follow-up should reuse the same controller-side humanization system rather than inventing a parallel randomizer.

## 9. Final Recommendation

Implement battle audio variation as cue-owned metadata interpreted by the existing one-shot controller.

The correct first version is:

- cue-level battle-only humanization metadata
- deterministic test seams
- randomized pitch, volume, start offset, and fade-in
- no battle-logic coupling
