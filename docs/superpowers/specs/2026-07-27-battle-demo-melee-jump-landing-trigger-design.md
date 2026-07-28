## Battle-Demo Melee Jump And Landing Trigger Design

Date: 2026-07-27

## 1. Goal

Bind the shared `battle.jump` and `battle.landing` cues to battle-demo melee attack animations for swordsmen and spearmen only, at the exact animation frames requested by the user.

Requested behavior:

- swordsman standard jump attack:
  - frame `9`: play jump
  - frame `27`: play landing
  - phase owner: move phase
- swordsman jump-chop attack:
  - frame `29`: play jump
  - frame `42`: play landing
  - phase owner: attack phase
- spearman jump thrust:
  - frame `8`: play jump
  - frame `29`: play landing
  - phase owner: move phase
- jump and landing sounds may overlap with the existing melee attack hit or miss cue

This batch remains battle-demo only.

## 2. Current Runtime Mismatch

The repository already has:

- shared `battle.jump` and `battle.landing` cues in the centralized app audio system
- embedded melee cue forwarding from `prototypes/battle-demo/index.html` into the parent app via `cueId`
- battle-demo `onFrame` attack timing for melee strike sounds, archer draw/release/impact, and musketeer reload/fire

However, swordsman and spearman attack animations currently do not emit any jump or landing audio trigger at their motion frames.

Follow-up debugging confirmed one important runtime nuance:

- `animateBattleSpineProxy(...).onFrame` reports `actionFrame` for the current clip only
- `jump_slash` and `jump_thrust` both have a separate move or jump clip before the attack clip
- `jump_chop` keeps its jump motion inside the attack clip

That means binding all jump and landing cues to the attack-phase `onFrame` will make swordsman standard jump and spearman jump thrust sound late even if their trigger frame numbers are otherwise correct.

If jump and landing were implemented with direct local iframe playback, the new behavior would bypass centralized playback variation and split battle-demo audio ownership.

## 3. Scope

This design covers:

- battle-demo swordsman and spearman frame detection for jump and landing
- parent-app shared cue resolution for embedded `jump` and `landing` cue ids
- regression tests for the new frame thresholds and resolver mapping

This design does not cover:

- `prototypes/troop-management-preview/index.html`
- cavalry, archer, or musketeer jump and landing
- new fade rules between jump and landing
- any attack timing changes

## 4. Design Principles

The implementation must follow these rules:

1. Real playback remains owned by the centralized parent audio system.
2. Swordsman and spearman jump and landing should reuse the existing embedded melee cue forwarding path because no cross-phase fade contract is required.
3. Jump and landing must remain independent from melee strike hit or miss playback so both can sound in the same attack.
4. All frame checks must use `info.actionFrame >= targetFrame` plus one-shot guards.
5. Only swordsman and spearman attack variants in battle-demo receive the new triggers in this batch.
6. Frame checks must run on the clip that actually owns the motion:
   - `jump_slash` and `jump_thrust`: move phase
   - `jump_chop`: attack phase

## 5. Recommended Architecture

### 5.1 Trigger Resolution

Add one small helper in `prototypes/battle-demo/index.html`:

```ts
function resolveBattleJumpLandingSoundPlan({
  troopType,
  variant = null,
}): {
  jumpTriggerFrame: number;
  landingTriggerFrame: number;
} | null
```

Required mapping:

- `infantry` + `jump_slash` -> `{ jumpTriggerFrame: 9, landingTriggerFrame: 27 }`
- `infantry` + `jump_chop` -> `{ jumpTriggerFrame: 29, landingTriggerFrame: 42 }`
- `spear` + `jump_thrust` -> `{ jumpTriggerFrame: 8, landingTriggerFrame: 29 }`
- all other combinations -> `null`

### 5.2 Playback Path

Use the existing embedded melee cue message path:

- battle-demo posts `postBattleDemoAudioMessage({ cueId: "jump" })`
- battle-demo posts `postBattleDemoAudioMessage({ cueId: "landing" })`
- `src/application/audio/battle-sound.ts` extends `resolveBattleDemoCueId(...)`
- `src/main.ts` continues to call `appAudioController.playCue(...)`

This path is preferred over semantic phase-chain messages because:

- no fade handoff is required
- overlap with melee attack cues is explicitly allowed
- it reuses the simplest existing embedded cue bridge

## 6. Runtime Design

Inside `playBattleSpineStrike(...)`:

- resolve `jumpLandingSoundPlan` next to the existing `meleeSoundPlan`
- split that plan into:
  - `moveJumpLandingSoundPlan` when `infantryAttackPlan?.moveAction` exists
  - `attackJumpLandingSoundPlan` when `infantryAttackPlan?.moveAction` does not exist
- keep separate one-shot guard state for the move phase and attack phase
- inside move-phase `animateBattleSpineProxy(... infantryAttackPlan.moveAction ...)`, emit:
  - `jump` once `info.actionFrame >= jumpLandingSoundPlan.jumpTriggerFrame`
  - `landing` once `info.actionFrame >= jumpLandingSoundPlan.landingTriggerFrame`
  - this path covers swordsman `jump_slash` and spearman `jump_thrust`
- inside attack-phase `animateBattleSpineProxy(... attackActionId ...)`, emit:
  - `jump` once `info.actionFrame >= jumpLandingSoundPlan.jumpTriggerFrame`
  - `landing` once `info.actionFrame >= jumpLandingSoundPlan.landingTriggerFrame`
  - this path covers swordsman `jump_chop`

The new branch must not gate or delay the existing melee hit or miss cue branch, and it must use the phase-local `actionFrame` rather than treating different clips as one continuous timeline.

## 7. Testing Requirements

Implementation must add regression coverage for:

1. swordsman `jump_slash` resolves to frames `9` and `27`
2. swordsman `jump_chop` resolves to frames `29` and `42`
3. spearman `jump_thrust` resolves to frames `8` and `29`
4. battle-demo routes `jump_slash` and `jump_thrust` jump and landing cues through the move phase
5. battle-demo routes `jump_chop` jump and landing cues through the attack phase
6. `resolveBattleDemoCueId("jump")` maps to `battle.jump`
7. `resolveBattleDemoCueId("landing")` maps to `battle.landing`

## 8. Final Recommendation

Implement swordsman and spearman jump and landing triggers in battle-demo by extending the existing embedded melee cue bridge rather than adding a new chain-based phase bridge. The important detail is to emit from the clip-local `onFrame` that actually owns the jump motion: move phase for `jump_slash` and `jump_thrust`, attack phase for `jump_chop`. This matches the requested overlap behavior and keeps playback centralized.
