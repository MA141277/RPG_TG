# City Market Ambient Audio Design

Date: 2026-08-03

## 1. Goal

Add a reusable city-market ambient music system that plays only while the player is on the city interface.

The feature must:

- use a dedicated reusable class instead of hardcoded city-audio branches
- avoid feature business branching in `src/main.ts`
- keep ambient playback separate from the existing main BGM track so both can play in parallel
- fade in over 1 second when entering the city interface
- fade out over 1 second when leaving the city interface for buildings, scenes, battles, or the campaign map
- preserve playback position when leaving the city interface and resume from that position when returning
- crossfade the ambient loop near the end of the file so repeated playback does not hard-cut

This batch only covers the city market ambient cue and its reusable playback mechanism.

This batch does not cover:

- replacing the existing BGM stack
- adding building-specific ambient tracks
- adding scene-specific ambient tracks
- creating a general-purpose resource manifest migration
- reworking all current audio imports out of `src/main.ts`

## 2. Current Problem

The repository already has a centralized audio seam in `src/application/audio/audio-manager.ts`.

Today:

- one-shot UI and SFX cues are registered centrally
- the main BGM track is managed centrally
- `src/main.ts` owns stable audio controller wiring and asset URL resolution

However, the current seam does not support the requested city ambience behavior:

- there is no dedicated parallel ambient layer
- there is no reusable scope-driven ambient controller
- there is no saved-position resume flow for looped ambience
- there is no tail crossfade loop for long ambient music

If this is implemented by writing `if currentView === ... then play/pause file X` branches directly into `src/main.ts` or house click handlers, the audio system will immediately regress into ad hoc view-specific wiring.

## 3. Scope

This design covers:

- one new ambient cue: `ambience.city.market`
- a reusable ambient loop playback handle owned by the centralized audio manager
- a reusable scope controller that activates or deactivates an ambient loop from shell state
- 1-second fade in and 1-second fade out behavior
- saved-position pause and resume behavior
- 1-second end-of-track crossfade loop behavior
- regression tests for the playback seam, the scope controller, and the `main.ts` wiring boundary

This design does not cover:

- adding multiple ambient cues in the same batch
- layering several ambient loops at once
- converting city-specific logic into content-driven audio selection in the same cut
- storing ambient playback position in persistent save data

## 4. Design Principles

The implementation must follow these rules:

1. ambient playback remains owned by the centralized audio seam, not by `src/main.ts`
2. `src/main.ts` may only compose and sync reusable controllers; it must not gain building or story audio branches
3. the reusable scope controller must not read DOM, create `Audio` elements, or resolve file paths itself
4. the ambient loop playback layer must be able to run in parallel with the existing BGM player
5. leaving the city interface must preserve the current ambient playback position instead of resetting to `0`
6. loop smoothing must be implemented as a configurable crossfade behavior, not as city-only one-off code

## 5. Recommended Design

### 5.1 Cue Ownership

Extend `src/application/audio/audio-manager.ts` with one new built-in cue id:

- `ambience.city.market`

The cue should use a dedicated ambient asset key:

- `audio/ambient/city-market.mp3`

The asset should live in the repository under a stable ASCII filename:

- `src/assets/audio/ambient/city-market.mp3`

This keeps the cue registry centralized and avoids coupling city ambient playback to a desktop path or a raw file URL.

### 5.2 Ambient Bus And Playback Boundary

Extend the centralized audio system with an ambient playback capability that is separate from the existing main BGM player.

Recommended ownership:

- add an `ambient` bus classification in the audio cue model
- keep one-shot UI and SFX behavior unchanged
- keep the existing BGM stack behavior unchanged
- add a new ambient loop player factory on top of the audio manager

The ambient loop playback path must not route through `AppAudioSession` queue commands.

Reason:

- one-shot cues are event-like
- ambient loops are stateful and continuous
- saved-position resume and tail crossfade need a persistent playback owner, not a fire-and-forget queue item

### 5.3 Ambient Loop Handle

Add a reusable playback handle exported from the audio manager layer.

Recommended shape:

```ts
type AmbientLoopHandle = {
  activate(): void;
  deactivate(): void;
  destroy(): void;
};
```

Recommended creation seam:

```ts
const handle = appAudioController.createAmbientLoopHandle({
  cueId: BUILTIN_AUDIO_CUE_IDS.ambienceCityMarket,
  fadeInMs: 1000,
  fadeOutMs: 1000,
  crossfadeMs: 1000,
});
```

The first implementation should use this boundary directly:

- `audio-manager.ts` owns browser audio objects and playback timing
- the caller owns only activation lifecycle

### 5.4 Scoped Ambient Loop Controller

Add a reusable class:

- `src/application/audio/scoped-ambient-loop-controller.ts`

Recommended responsibility:

- receive a snapshot of shell state
- decide whether the ambient loop should be active
- call `activate()` or `deactivate()` on the provided ambient handle only when the active state changes

Recommended shape:

```ts
class ScopedAmbientLoopController<TSnapshot> {
  constructor(input: {
    target: AmbientLoopHandle;
    isActive(snapshot: TSnapshot): boolean;
  });

  sync(snapshot: TSnapshot): void;
  destroy(): void;
}
```

This keeps the controller reusable across future scopes such as:

- map ambience
- building ambience
- battlefield ambience

without forcing those future features to own raw audio playback.

### 5.5 City Scope Wiring

For this batch, the city-market ambience uses the existing shell snapshot:

```ts
{
  isGameVisible: boolean;
  currentView: AppState["gameState"]["ui"]["currentView"];
}
```

Active rule for the first instance:

- active only when `isGameVisible === true && currentView === "city"`

Inactive for:

- `map`
- `house`
- `scene`
- `battle`
- `city-3d`
- troop editor or management views
- any future non-city shell view by default

`src/main.ts` may instantiate this controller and feed it the current snapshot from the existing audio sync seam.

`src/main.ts` must not add separate branches for:

- entering a specific building
- leaving a specific building
- entering a specific story event
- returning from a specific story event

The `currentView` boundary already owns that transition information.

### 5.6 Fade Contract

When the scoped controller activates the ambient loop:

- first playback starts from `0`
- resumed playback starts from the last saved playback position
- volume fades from `0` to target volume over 1000 ms

When the scoped controller deactivates the ambient loop:

- the currently audible playback fades out over 1000 ms
- playback then pauses
- the active timeline position is saved
- the saved position is not reset to `0`

The fade logic must be owned by the ambient playback handle, not by the scope controller.

### 5.7 Saved-Position Resume Contract

Leaving the city interface must preserve the most recent audible position.

Resume behavior:

- if the ambient loop has never played before, activation starts from `0`
- if the ambient loop was previously deactivated, activation resumes from the saved position
- resuming must not discard progress just because the player entered and exited a building

The saved position should live in the ambient playback handle's in-memory runtime state.

This batch does not persist the position into save data because the requirement is only for within-session continuity.

### 5.8 Tail Crossfade Loop Contract

The ambient loop must not rely on a hard `loop = true` restart.

Instead, it must support a dual-player crossfade:

- when the active player enters the last 1000 ms of the cue, the current player becomes the outgoing player
- a second player for the same cue starts from the beginning of the file
- the outgoing player fades from current volume to `0` over 1000 ms
- the incoming player fades from `0` to target volume over 1000 ms
- after the crossfade window completes, the incoming player becomes the new primary player
- the old player pauses and is recycled

This behavior must be implemented as a reusable cue-level loop policy, not as city-only custom code.

### 5.9 Resume Near The Crossfade Window

If the player leaves the city while playback is near the end of the cue, the system must preserve the real audible position instead of snapping back to the start.

If the player later returns while the saved position is already inside the final crossfade window:

- playback resumes from the saved position
- the ambient layer may immediately enter crossfade preparation
- the outgoing tail may use the remaining tail duration that is actually left
- the incoming loop still fades in smoothly

This makes the behavior deterministic and avoids hidden position rewrites.

### 5.10 Deactivation Overrides Tail Crossfade

If the player leaves the city during a tail crossfade:

- scope deactivation wins
- the ambient layer stops preparing the next loop as an always-on requirement
- the currently audible timeline is captured
- both players fade or pause under the deactivation path

The system should save the next resume point from the timeline the player would actually continue hearing, not expose both internal player positions to shell code.

### 5.11 Metadata And Duration Handling

Tail crossfade needs a real cue duration.

The ambient playback implementation should therefore support duration-aware playback by:

- reading the audio element duration once metadata is available
- scheduling crossfade only after a finite duration is known
- polling or listening for metadata in the same centralized audio layer

If duration is temporarily unavailable, playback may begin normally and the ambient layer should arm the crossfade once duration becomes known.

If duration never becomes available, the system should fail closed without crashing the app.

Acceptable fail-closed behavior:

- ambient playback continues without a crossfade restart
- or the cue pauses at end and waits for the next activation

The app must not throw or break the existing BGM path in this case.

### 5.12 Failure And Autoplay Handling

The current audio controller already treats `play()` promise rejection as a non-fatal browser autoplay limitation.

The new ambient loop path must follow the same rule:

- `play()` rejection does not throw into the app shell
- ambient failure does not break one-shot cues
- ambient failure does not stop main BGM playback

Missing asset resolution should also fail closed:

- no shell crash
- no retry storm
- future successful activations may still recover once the asset path is valid

## 6. File-Level Change Plan

### 6.1 `src/application/audio/audio-manager.ts`

Add responsibilities:

- export the new built-in cue id for city market ambience
- register the ambient cue definition
- extend cue typing to support an ambient bus
- add a reusable ambient loop playback handle factory
- implement saved-position resume
- implement dual-player tail crossfade

Do not:

- add city-view or building-view business branches
- move current shell logic into the audio manager
- replace the existing BGM stack

### 6.2 `src/application/audio/scoped-ambient-loop-controller.ts`

Add responsibilities:

- own scope activation state
- compare previous and next activation results
- activate or deactivate the provided ambient loop handle

Do not:

- create `Audio` elements
- resolve asset URLs
- read DOM
- special-case the city market cue internally

### 6.3 `src/main.ts`

Change responsibilities:

- import the ambient asset as a Vite-managed static URL
- register the new logical asset key in the existing audio asset URL map
- create the ambient loop handle once
- create one scoped ambient controller instance for the city view
- call the controller from the existing audio sync seam

Do not:

- add building-specific audio branches
- add story-specific ambient branches
- create a second manual audio subsystem
- manipulate raw `Audio` elements directly

### 6.4 `src/vite-env.d.ts`

No behavioral change is required here because the repository already declares `*.mp3?url`.

The implementation should only touch this file if the new import path reveals a typing regression.

### 6.5 Asset Placement

Copy the provided desktop file into:

- `src/assets/audio/ambient/city-market.mp3`

The repository must not depend on the original desktop path at runtime.

## 7. Testing Requirements

Implementation must add regression coverage for the following behaviors.

### 7.1 Audio Manager Playback Tests

Extend `tests/audio-manager.test.cjs` to cover:

1. the new ambient cue id is exported and registered as an asset-backed cue
2. ambient playback can run while main BGM remains active
3. first activation starts from the beginning and fades in over 1000 ms
4. deactivation fades out over 1000 ms and preserves playback position
5. reactivation resumes from the saved playback position
6. entering the last 1000 ms of the cue starts a dual-player crossfade
7. the incoming player becomes primary after the crossfade
8. deactivation during a crossfade does not leave both players running

The test doubles will likely need ambient-specific timing fields such as:

- `duration`
- volume changes over scheduled time
- two simultaneous active players for the same cue

### 7.2 Scoped Controller Tests

Add a new controller-focused test file such as:

- `tests/scoped-ambient-loop-controller.test.cjs`

Cover:

1. entering `city` activates the target handle exactly once
2. repeated syncs inside `city` do not spam repeated activation
3. leaving `city` deactivates the target handle exactly once
4. non-city views never activate the target handle
5. returning to `city` reactivates the same target handle

### 7.3 Shell Wiring Source Test

Add a source or seam test such as:

- `tests/city-ambient-audio-source.test.cjs`

Cover:

1. `src/main.ts` wires one scoped ambient controller for the city view
2. `src/main.ts` does not gain hardcoded building-specific ambient branches
3. `src/main.ts` does not create raw `Audio` objects for city ambience

## 8. Follow-Up Work

After this batch lands, follow-up work can safely add:

- additional ambience cues for other scopes
- content-driven ambience selection for different cities
- a shared view-snapshot audio orchestration layer if more scoped ambience systems appear
- persistent save-data restore if the design later requires cross-session continuity

That later work must continue using:

- centralized cue ownership
- reusable scope controllers
- thin shell wiring

instead of reintroducing file-path-based view logic.

## 9. Final Recommendation

Implement the feature as a reusable, scope-driven ambient playback system layered beside the existing BGM system.

The correct first version is:

- one centralized ambient cue
- one reusable ambient loop playback handle with saved-position resume
- one reusable scoped controller
- one city-view wiring instance
- one 1-second tail crossfade loop policy

This satisfies the requested player behavior without turning `src/main.ts` into a second audio business owner.
