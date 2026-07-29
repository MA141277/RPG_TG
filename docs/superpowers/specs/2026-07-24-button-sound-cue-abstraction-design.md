# Button Sound Cue Abstraction Design

Date: 2026-07-24

## 1. Goal

Add two real-audio-backed, reusable button sound abstractions for `light` and `heavy` button interactions.

The implementation must let future button code depend on a shared sound object or cue identity instead of:

- hardcoded mp3 paths
- hand-written `if button X then play file Y` branches
- direct button-to-file coupling in `src/main.ts`

The first batch only needs to deliver the shared sound abstractions and real asset integration. Full migration of all existing buttons to light/heavy assignment is a separate follow-up.

## 2. Current Problem

The repository already has a centralized audio seam in `src/application/audio/audio-manager.ts`.

Today:

- BGM and one-shot cues are registered centrally
- `src/main.ts` owns the app audio controller and sync loop
- generic button activation currently queues the generated `ui.click` cue

This is a good base, but it does not yet support the requested workflow:

- define `light button sound` once
- define `heavy button sound` once
- assign either one to many buttons
- update the underlying audio file in one place later

If the project solves this by wiring mp3 files directly inside button handlers, the code immediately regresses into hardcoded UI-specific branches.

## 3. Scope

This design covers:

- two new real mp3-backed UI cues: `light` and `heavy`
- a reusable button sound class that wraps cue usage
- stable asset placement inside the repository
- Vite-friendly static asset URL integration for the two mp3 files
- regression tests around the new abstraction boundary

This design does not cover:

- assigning every existing button to light/heavy immediately
- removing the existing generated `ui.click` cue in this batch
- creating separate sounds for hover, focus, or release
- adding a button-style taxonomy beyond `light` and `heavy`

## 4. Design Principles

The implementation must follow these rules:

1. button code chooses a reusable sound abstraction, not a file path
2. `audio-manager.ts` remains the owner of cue registry, queue semantics, cooldowns, and playback
3. `src/main.ts` may own only stable runtime wiring and static asset URL resolution, not button-specific business mapping
4. the two new mp3 files must live inside the repository under stable ASCII filenames
5. this batch must be additive and non-breaking for existing generic `ui.click` behavior

## 5. Recommended Design

### 5.1 Audio Cue Ownership

Extend `src/application/audio/audio-manager.ts` with two new built-in cue ids:

- `ui.button.light`
- `ui.button.heavy`

Both cues remain on the existing `ui` bus and remain non-looping one-shot sounds.

They should use `asset-path` sources, not generated waveforms.

The cue definitions should use these exact logical asset keys:

- `audio/ui/button-light.mp3`
- `audio/ui/button-heavy.mp3`

The cue registry stays centralized so that changing the actual sound asset later still happens in one place.

### 5.2 Button Sound Class

Add a new application-layer module:

`src/application/audio/button-sound.ts`

This module should export a small class that represents a reusable button sound identity.

API contract:

```ts
class ButtonSoundEffect {
  readonly cueId: string;

  constructor(cueId: string);
  queue(session: AppAudioSession): AppAudioSession;
}
```

Canonical shared instances:

```ts
export const LIGHT_BUTTON_SOUND: ButtonSoundEffect;
export const HEAVY_BUTTON_SOUND: ButtonSoundEffect;
```

This keeps future button code simple:

- choose a sound object once
- call `sound.queue(appAudioSession)`
- then run the existing app audio sync path

The class must not create `Audio` elements directly and must not bypass the app audio session.

### 5.3 Real Asset Placement

Copy the provided files into the repository under stable ASCII names:

- `src/assets/audio/ui/button-light.mp3`
- `src/assets/audio/ui/button-heavy.mp3`

The project should not keep the original desktop path as a runtime dependency.

ASCII naming is required here because the existing repository already mixes multiple path conventions, and this batch should avoid introducing encoding-sensitive audio asset paths into the new abstraction boundary.

### 5.4 Static Asset URL Resolution

The existing audio seam accepts logical `assetPath` strings and resolves them in `src/main.ts`.

For these two new button sounds, use static Vite-managed URL imports instead of dynamic string-only path construction.

Required shape in `src/main.ts`:

1. import the two mp3 files with `?url`
2. create a small map from logical asset key to imported URL
3. update `resolveAssetPath` to:
   - return the static imported URL for the new button sound asset keys
   - fall back to the current dynamic path behavior for legacy cues

This keeps the change narrow:

- existing BGM logic is not reworked in this batch
- the new button sounds become reliably bundled and playable

### 5.5 Static Asset Typing

The repository currently declares `*.img?url`, `*.mp4?url`, and `*.json?url`, but not `*.mp3?url`.

Add a matching declaration for `*.mp3?url` so TypeScript accepts the new static audio imports cleanly.

## 6. Behavioral Contract

After this batch:

- the project has two reusable button sound objects with stable identities
- either object can be assigned to any future button logic
- changing the light/heavy underlying asset happens centrally
- the new sounds are real mp3-backed playback, not generated waveforms

After this batch, the project still may have buttons that continue using the existing generic `ui.click` cue until the follow-up migration assigns them explicitly.

## 7. File-Level Change Plan

### 7.1 `src/application/audio/audio-manager.ts`

Change responsibilities:

- add new built-in cue ids
- add new cue definitions for light/heavy button sounds
- keep queue and controller behavior unchanged

Do not:

- add button-name-specific branching
- add button appearance policy here
- create a second playback path

### 7.2 `src/application/audio/button-sound.ts`

Add responsibilities:

- define the reusable button sound class
- export the two canonical sound instances
- wrap `queueAppAudioCue` usage through the class boundary

Do not:

- render UI
- create HTML strings
- instantiate browser audio directly

### 7.3 `src/main.ts`

Change responsibilities:

- import the two mp3 files as static URLs
- extend `resolveAssetPath` with a narrow static map for the new cue asset keys

Do not:

- map concrete buttons to light/heavy here in this batch
- create `if (buttonId === ...)` sound routing logic

### 7.4 `src/vite-env.d.ts`

Add `*.mp3?url` support.

## 8. Testing Requirements

Implementation must add regression coverage for:

1. `LIGHT_BUTTON_SOUND.queue(session)` appends the light cue through the shared app audio session model
2. `HEAVY_BUTTON_SOUND.queue(session)` appends the heavy cue through the shared app audio session model
3. the new built-in cue ids are exported from the audio manager
4. the new cue definitions resolve as asset-backed sources, not generated waveforms
5. the audio controller plays the new cues through the normal one-shot path
6. the static asset typing accepts `mp3?url` imports without TypeScript errors

The first implementation does not need tests for specific concrete button assignments, because that migration is explicitly out of scope for this batch.

## 9. Open Follow-Up

After this batch lands, the next integration batch can safely:

- classify existing buttons as light or heavy
- replace selected `ui.click` call sites with the new sound objects
- optionally introduce additional shared UI sounds such as page turn, panel open, or confirm

That later work must still route through the same button sound abstraction and centralized cue system rather than creating per-button file references.

## 10. Final Recommendation

Implement the requested feature by extending the existing centralized audio seam, not by building a parallel button-only audio system.

The correct first version is:

- two centralized real mp3-backed button cues
- one reusable button sound class
- two canonical shared instances
- static asset URL wiring for reliable playback
- additive behavior that does not force a full button migration in the same patch
