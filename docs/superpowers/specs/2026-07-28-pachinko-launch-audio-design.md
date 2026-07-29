## Pachinko Launch Audio Design

Date: 2026-07-28

## 1. Goal

Add a shared pachinko launch sound to the centralized app audio layer so the temple work pachinko minigame plays the provided external marble-launch mp3 whenever the player clicks the launch button.

Requested behavior for this batch:

- locate the temple work pachinko minigame entry and render path
- add one reusable launch cue for the shared `pachinko-board` playable
- keep playback owned by the centralized app audio system
- expose the sound through a dedicated audio class rather than inline cue strings

## 2. Current Runtime Location

The requested minigame is not a one-off temple-only runtime anymore.

Current ownership is split across these shared seams:

- `src/application/house-modules/temple-house/temple-house-house-module.ts`
  - temple work can launch the shared `activity-qte` playable
  - the temple playable overlay can expose a `pachinko-board`
- `src/application/activity/activity-qte-runtime.ts`
  - shared pachinko launch and board simulation logic live here
- `src/ui/views/house/temple-house-view.ts`
  - renders the house-owned `pachinko-board` overlay
- `src/ui/views/scene/scene-view.ts`
  - renders the scene-owned `pachinko-board` overlay for the same shared playable shape

That means the sound should be attached to the shared `pachinko-board` launch interaction rather than to temple-only business logic.

## 3. Current Runtime Mismatch

The repository already has:

- centralized cue ownership in `src/application/audio/audio-manager.ts`
- small dedicated audio wrapper classes such as:
  - `src/application/audio/enter-sound.ts`
  - `src/application/audio/troop-selection-sound.ts`
  - `src/application/audio/troop-mutation-sound.ts`
- a global click-capture seam in `src/main.ts`
- click sound resolution in `src/application/audio/button-sound.ts`

However, the current pachinko launch button only dispatches its existing action id:

- house overlay: `data-house-action="temple-work-board-play"`
- scene overlay: `data-activity-action="play-board"`

There is currently no shared pachinko launch cue, no dedicated pachinko launch audio class, and no launch-specific audio marker on either playable overlay.

If the sound were added by:

- hardcoding `appAudioController.playCue(...)` in `main.ts`, or
- adding temple-only button logic in the house module, or
- playing `new Audio(...)` directly inside a view,

the implementation would break the house interface contract, bypass the centralized cue registry, or tie a shared playable interaction back to one concrete house.

## 4. Scope

This design covers:

- copying the provided external marble-launch mp3 into `src/assets/audio/activity/pachinko-launch.mp3`
- adding a shared app audio cue for pachinko launch
- adding a dedicated pachinko launch audio wrapper class
- extending click sound resolution so a launch marker can resolve to the new cue
- marking both house and scene `pachinko-board` launch buttons with one shared audio attribute
- regression tests for the cue wrapper, resolver seam, asset seam, and UI contract

This design does not cover:

- temple work settlement logic
- `activity-qte` board physics or scoring
- new pointer-dispatch rules in `src/main.ts`
- non-pachinko temple sounds
- any other house module

## 5. Design Principles

The implementation must follow these rules:

1. `src/main.ts` may keep only stable audio wiring, not temple-specific launch branches.
2. The shared `pachinko-board` interaction owns the sound marker, not `temple-house` business logic.
3. Real playback remains owned by the centralized app audio controller.
4. The launch sound must be exposed through a dedicated audio class, not magic cue strings scattered across callers.
5. Both house and scene renderers must resolve to the same shared launch cue.
6. Asset filenames under `src/assets/audio/` stay ASCII-only.

## 6. Recommended Architecture

### 6.1 Shared Cue Contract

Add one new centralized cue id:

- `activity.pachinko.launch`

Required builtin registry key:

- `activityPachinkoLaunch`

Asset path:

- `audio/activity/pachinko-launch.mp3`

The cue should be registered as a normal non-looping sfx cue in `src/application/audio/audio-manager.ts`.

This sound is a gameplay interaction cue, so it should not be placed under the battle cue family and should not be modeled as a generic UI button tone.

### 6.2 Dedicated Audio Class

Add a new file:

- `src/application/audio/pachinko-launch-sound.ts`

Required exports:

```ts
class PachinkoLaunchSoundEffect
const PACHINKO_LAUNCH_SOUND
function resolvePachinkoLaunchSoundEffectById(soundId)
function resolvePachinkoLaunchSoundEffectFromTarget(target)
```

The class should follow the same shape as the existing small audio wrappers:

- keep a single `cueId`
- expose `queue(session)` for the centralized app audio session

For this batch only one sound id is needed:

- `launch`

### 6.3 Click Resolution Path

Extend `src/application/audio/button-sound.ts` so `resolveUiClickCueIdFromTarget(...)` checks for a dedicated pachinko launch marker before the existing enter/button/fallback flow.

Required resolution order:

1. `data-pachinko-sound`
2. `data-enter-sound`
3. `data-button-sound`
4. fallback `ui.click` when explicitly allowed

This keeps the launch sound on the existing click-capture seam and avoids adding a second ad hoc event-listener path for one playable.

### 6.4 Shared UI Marking

Mark both launch buttons with the same shared attribute:

- `data-pachinko-sound="launch"`

Required render sites:

- `src/ui/views/house/temple-house-view.ts`
- `src/ui/views/scene/scene-view.ts`

The launch action ids remain unchanged:

- house overlay keeps `data-house-action="${overlay.playActionId}"`
- scene overlay keeps `data-activity-action="play-board"`

The sound marker is additive only.

## 7. Runtime Design

The user-facing flow for this batch should be:

1. Temple work opens the shared `pachinko-board` playable through the existing house/playable runtime seam.
2. The rendered launch button includes `data-pachinko-sound="launch"`.
3. The global capture click handler in `src/main.ts` calls `resolveUiClickCueIdFromTarget(...)`.
4. The resolver sees the pachinko launch marker and returns `activity.pachinko.launch`.
5. The centralized app audio session queues that cue and the audio controller plays it through the normal output sync path.

No gameplay logic changes are needed in:

- `src/application/house-modules/temple-house/temple-house-house-module.ts`
- `src/application/activity/activity-qte-runtime.ts`

## 8. Testing Requirements

Implementation must add or extend regression coverage for:

1. `PACHINKO_LAUNCH_SOUND.queue(...)` enqueues `activity.pachinko.launch`
2. `resolvePachinkoLaunchSoundEffectById("launch")` resolves the shared wrapper object
3. `resolveUiClickCueIdFromTarget(...)` prioritizes `data-pachinko-sound="launch"` over button tones and fallback click sound
4. `src/application/audio/audio-manager.ts` registers:
   - `activityPachinkoLaunch`
   - `activity.pachinko.launch`
   - `audio/activity/pachinko-launch.mp3`
5. `src/main.ts` imports and statically maps `./assets/audio/activity/pachinko-launch.mp3?url`
6. `src/ui/views/house/temple-house-view.ts` marks the house pachinko launch button with `data-pachinko-sound="launch"`
7. `src/ui/views/scene/scene-view.ts` marks the scene pachinko launch button with `data-pachinko-sound="launch"`

This batch does not need new temple lifecycle or pachinko physics tests because it does not change action dispatch, settlement, or simulation rules.

## 9. Final Recommendation

Implement the temple work marble sound as a shared `pachinko-board` launch cue rather than as a temple-only button hack. The sound should be registered centrally, wrapped by a dedicated pachinko launch audio class, and triggered through one shared `data-pachinko-sound="launch"` marker on both house and scene launch buttons. This keeps the feature inside the existing house and playable contracts and preserves centralized audio ownership.
