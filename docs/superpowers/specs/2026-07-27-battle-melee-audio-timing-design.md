# Battle Melee Audio Timing Design

Date: 2026-07-27

## 1. Goal

Add frame-accurate melee attack sound playback to the formation battle runtime.

This batch only covers three melee troop families:

- swordsman
- spearman
- cavalry

Requested behavior:

- if the attack misses, play the shared swing-miss sound
- if the attack hits, randomly choose one of the three slash-hit samples
- trigger playback on the authored animation frame, not on the later damage-apply callback

## 2. Current Runtime Mismatch

The repository already has a centralized battle audio seam in:

- `src/application/audio/audio-manager.ts`
- `src/application/audio/battle-sound.ts`

However, the actual battle scene the player sees runs inside iframe-driven prototype pages:

- `prototypes/battle-demo/index.html`
- `prototypes/troop-management-preview/index.html`

Those pages currently execute as plain inline scripts and do not consume the main app audio session directly.

That means there is a real boundary mismatch:

- the semantic cue registry already exists in application code
- the live battle animation timing lives in prototype code

Because this batch is explicitly scoped to the prototype battle runtime and must not change `src/main.ts`, the implementation must solve timing in the prototype layer first while preserving semantic sound ownership.

## 3. Scope

This design covers:

- melee sound routing for swordsman, spearman, and cavalry only
- frame-accurate triggering inside the prototype battle runtime
- semantic sound selection based on troop type, attack variant, and hit result
- synchronized changes in both prototype battle pages
- regression tests for sound-plan mapping and frame-trigger integration

This design does not cover:

- archer or gunner sound timing
- parent-window audio message bridging
- replacing the existing main-app audio controller wiring
- BGM or result audio
- adding new audio assets or new cue ids

## 4. Design Principles

The implementation must follow these rules:

1. melee sound choice must be resolved semantically, not by hardcoding mp3 paths inside damage logic
2. sound playback timing must be driven by animation frames, not by the impact state mutation callback
3. miss and hit sound selection must remain decoupled from white flash, damage popup, and shake effects
4. the same behavior must exist in both prototype battle pages
5. this batch must not modify `src/main.ts`

## 5. Recommended Design

### 5.1 Trigger Layer

The correct trigger point is `animateBattleSpineProxy(... onFrame)`.

Why:

- `onImpact` fires at the damage application frame
- the requested swordsman slash timing is one frame earlier than current damage application for the default slash chain
- if sound stays on `onImpact`, swordsman slash sound will drift from frame `13` to frame `14`

Therefore melee audio must be triggered from frame progression, with a one-shot guard that fires once when:

`actionFrame >= triggerFrame`

### 5.2 Sound Planning Step

Before starting the attack animation in `playBattleSpineStrike`, resolve one sound plan for the current strike.

Inputs:

- `troopType`
- `infantryAttackPlan?.variant`
- `step.hit`
- one random value for hit-sample selection

Output:

- `triggerFrame`
- `cueKind`

The plan is local to a single strike and is consumed only by the current attack animation.

### 5.3 Mapping Rules

#### Miss

For all three melee troop families:

- if `step.hit === false`
- use the shared miss cue

Trigger frames:

- swordsman `jump_slash`: `13`
- swordsman `jump_chop`: `42`
- spearman `jump_thrust`: `14`
- cavalry `dash_slash`: `30`

#### Hit

For all three melee troop families:

- if `step.hit === true`
- choose exactly one cue from the three slash-hit samples

Random choice must be uniform across the three hit samples.

Trigger frames:

- swordsman `jump_slash`: `13`
- swordsman `jump_chop`: `42`
- spearman `jump_thrust`: `14`
- cavalry `dash_slash`: `30`

### 5.4 Runtime Ownership

Because this batch is prototype-only, the prototype pages need a local semantic battle-sound helper.

That helper should:

- expose semantic methods for melee hit and melee miss playback
- own the mapping from semantic cue name to prototype-usable asset source
- keep file-path references out of strike-resolution logic

This keeps the prototype battle runtime aligned with the same abstraction rule already used by `src/application/audio/battle-sound.ts`, even though the parent app bridge is intentionally out of scope here.

### 5.5 Separation From Damage Effects

Existing responsibilities stay split:

- `onFrame`: melee sound trigger
- `onImpact`: damage application, damage popup, hit shake
- `onEffect`: white flash overlay

This separation is required so future frame tuning can change sound timing without changing damage timing.

## 6. Behavioral Contract

After this batch:

- swordsman slash sound triggers on frame `13`
- swordsman jump-chop sound triggers on frame `42`
- spearman thrust sound triggers on frame `14`
- cavalry slash sound triggers on frame `30`
- misses always play the miss cue
- hits always play one of the three hit cues
- hit sound choice stays random
- damage numbers, white flash, and shake behavior remain unchanged

## 7. File-Level Change Plan

### 7.1 `prototypes/battle-demo/index.html`

Add responsibilities:

- resolve a melee sound plan before attack playback
- trigger the sound plan from `onFrame`
- keep `onImpact` and `onEffect` behavior unchanged

Do not:

- move damage application into the sound system
- hardcode mp3 paths in the strike state mutation logic

### 7.2 `prototypes/troop-management-preview/index.html`

Mirror the same melee sound planning and frame-trigger behavior so preview and live battle stay in sync.

### 7.3 Tests

Add regression coverage for:

1. troop-type and variant mapping to the requested trigger frame
2. miss routing to the shared miss cue
3. hit routing to one of the three hit cues
4. battle runtime integration using `onFrame` rather than `onImpact`

## 8. Testing Strategy

Follow TDD:

1. add a failing source-level regression test for melee sound-plan mapping
2. add a failing source-level regression test that asserts `playBattleSpineStrike` triggers melee audio from `onFrame`
3. implement the minimum prototype logic to satisfy both tests
4. rerun the targeted tests against both affected battle pages where applicable

## 9. Follow-Up

A later batch may bridge prototype semantic cue playback upward into the main app audio controller so the iframe battle scene and the centralized app audio session share one runtime playback path.

That follow-up is intentionally out of scope for this batch because the user explicitly requested no `src/main.ts` change here.

## 10. Final Recommendation

Implement melee strike sound timing in the prototype battle runtime by resolving a semantic strike sound plan per attack and firing it from `onFrame` at the authored frame threshold.

Do not attach melee sound playback to `onImpact`, because that will produce incorrect frame timing for swordsman slash attacks.
