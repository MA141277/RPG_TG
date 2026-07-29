## Battle Shared Jump And Landing Audio Design

Date: 2026-07-27

## 1. Goal

Add shared battle jump and landing cues to the centralized soldier audio layer so battle UI callers can queue those sounds through the same battle audio system that already owns slash, bow, musketeer, and impact playback.

Requested scope for this batch:

- add a shared jump cue
- add a shared landing cue
- expose both through the battle sound facade used by soldier audio callers
- wire the provided mp3 assets into the centralized asset resolver

This batch does not yet decide runtime trigger timing.

## 2. Current Runtime Mismatch

The repository already has:

- centralized battle cue ownership in `src/application/audio/audio-manager.ts`
- a battle sound facade in `src/application/audio/battle-sound.ts`
- static battle mp3 asset resolution in `src/main.ts`
- controller-side playback humanization for battle asset cues

However, there are currently no shared `jump` or `landing` battle cues, no facade methods for them, and no registered battle assets for the two provided mp3 files.

If jump and landing playback were added ad hoc later in UI code, that would bypass the existing centralized cue registry and split battle audio behavior across multiple ownership paths.

## 3. Scope

This design covers:

- copying the provided jump and landing mp3 files into `src/assets/audio/battle/`
- adding shared cue ids and cue definitions for jump and landing
- adding `playJump(...)` and `playLanding(...)` to `BattleSoundPlayer`
- wiring the two new assets through `src/main.ts`
- regression tests for the facade, cue registry, and static asset seam

This design does not cover:

- battle-demo frame hooks
- run / footstep timing
- direct local `Audio` playback in UI modules
- any trigger logic outside the shared battle audio layer

## 4. Design Principles

The implementation must follow these rules:

1. Real playback remains owned by the centralized app audio controller.
2. Jump and landing use the same battle asset humanization path as other battle mp3 cues.
3. The soldier-facing battle sound facade stays the entry point for higher-level callers.
4. Asset filenames under `src/assets/audio/battle/` stay ASCII-only.
5. This batch adds reusable mechanism only, not battle-specific trigger timing.

## 5. Cue Contract

Add two new shared cue ids:

- `battle.jump`
- `battle.landing`

Expose them through `BattleSoundPlayer` as:

- `playJump(session)`
- `playLanding(session)`

The centralized cue registry should back them with:

- `audio/battle/jump.mp3`
- `audio/battle/landing.mp3`

Both cues should use the same battle playback variation settings already used by the other asset-backed battle one-shots.

## 6. Testing Requirements

Implementation must add regression coverage for:

1. the battle sound facade queues `battle.jump` and `battle.landing`
2. `src/main.ts` imports and maps `jump.mp3` and `landing.mp3`
3. `src/application/audio/audio-manager.ts` registers both cue ids and asset paths
4. the shared audio controller can play the new battle cues through the normal sfx bus

## 7. Final Recommendation

Implement jump and landing as new shared battle cues inside the existing centralized soldier audio layer, with asset-backed playback continuing to flow through `audio-manager.ts`, `battle-sound.ts`, and `main.ts`.
