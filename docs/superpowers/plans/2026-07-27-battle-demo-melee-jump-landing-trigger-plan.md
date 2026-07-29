# Battle-Demo Melee Jump And Landing Trigger Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bind shared jump and landing battle cues to swordsman and spearman attack frames in battle-demo, with each cue attached to the correct move or attack clip, without breaking the existing melee strike, archer, or musketeer audio paths.

**Architecture:** `prototypes/battle-demo/index.html` will resolve swordsman and spearman jump and landing frame plans, route `jump_slash` and `jump_thrust` through the move clip, route `jump_chop` through the attack clip, and emit embedded `cueId` messages through the existing melee audio bridge. `src/application/audio/battle-sound.ts` will extend `resolveBattleDemoCueId(...)` so the parent app can keep centralized playback ownership through `appAudioController.playCue(...)`.

**Tech Stack:** Inline prototype JavaScript, TypeScript app runtime, CommonJS source-contract tests via `npm run build:test`, repository governance docs, `npm run lint:plans`, and `npm run typecheck`.

## Global Constraints

- Only `battle-demo` is in scope; `prototypes/troop-management-preview/index.html` must not change in this child.
- Jump and landing playback must stay in the centralized parent audio system.
- Jump and landing must be bound only to swordsman and spearman in this batch.
- Requested frame contract is fixed to:
  - swordsman `jump_slash`: jump `9`, landing `27`
  - swordsman `jump_chop`: jump `29`, landing `42`
  - spearman `jump_thrust`: jump `8`, landing `29`
- Phase ownership is fixed to:
  - swordsman `jump_slash`: move phase
  - swordsman `jump_chop`: attack phase
  - spearman `jump_thrust`: move phase
- Jump and landing must remain able to overlap with the existing melee attack cue.
- No new fade or chain-transition logic is needed for this batch.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-27`
- Current Focus: `The timing bugfix is verified: swordsman jump_slash and spearman jump_thrust now fire from the move clip, while swordsman jump_chop fires from the attack clip.`
- Next Step: `Review the diff and request another troop or preview parity batch only if needed.`
- Verification: `bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; bundled node.exe -e "require('./tests/battle-demo-melee-jump-landing-trigger.test.cjs'); require('./tests/battle-sound.test.cjs')"; bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; bundled node.exe .\tools\lint-superpowers-plans.mjs`
- Notes: `The targeted verification for this bugfix intentionally excludes unrelated cavalry/audio drift in other source-contract tests. docs/superpowers/project-progress.md currently tracks an unrelated open child, so this plan should remain local to this battle-demo audio batch unless governance is intentionally resynced later.`

## Progress Log

- 2026-07-27
  - Summary: `Created the battle-demo melee jump and landing trigger spec and plan from the approved swordsman/spearman frame contract.`
  - Verification: `Not run`
  - Next: `Write the failing source-contract and resolver tests for the new jump and landing frame hooks.`
- 2026-07-27
  - Summary: `Added battle-demo swordsman and spearman jump/landing frame resolution, emitted embedded jump and landing cue ids from onFrame, and extended the shared battle-demo cue resolver so the parent app keeps centralized playback ownership.`
  - Verification: `bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; bundled node.exe -e "require('./tests/battle-melee-audio-timing.test.cjs'); require('./tests/battle-demo-archer-audio-bridge.test.cjs'); require('./tests/battle-demo-musketeer-audio-bridge.test.cjs'); require('./tests/battle-sound.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"; bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; bundled node.exe tools/lint-superpowers-plans.mjs`
  - Next: `Review the diff and request preview or other troop parity only if needed.`
- 2026-07-27
  - Summary: `User-reported timing drift was confirmed. The root cause was clip-local actionFrame accounting: jump_slash and jump_thrust were incorrectly judged on the later attack clip instead of the move clip. The battle-demo runtime now routes jump_slash and jump_thrust through the move-phase onFrame and keeps jump_chop on the attack-phase onFrame.`
  - Verification: `bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; bundled node.exe -e "require('./tests/battle-demo-melee-jump-landing-trigger.test.cjs'); require('./tests/battle-sound.test.cjs')"; bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; bundled node.exe .\tools\lint-superpowers-plans.mjs`
  - Next: `No further code change is required for this child unless another troop type needs phase-specific jump or landing bindings.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-battle-demo-melee-jump-landing-trigger-design.md`
- Supporting specs:
  - `docs/superpowers/specs/2026-07-27-battle-shared-jump-landing-audio-design.md`
  - `docs/superpowers/specs/2026-07-27-battle-audio-humanization-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The shared battle.jump and battle.landing cues already exist in the centralized app audio layer.`
  - `Battle-demo already forwards embedded melee cue ids into the parent app, and swordsman/spearman attack variants are already resolved inside playBattleSpineStrike(...).`
  - `Battle-demo currently has no swordsman or spearman jump/landing frame audio emission.`
  - `docs/superpowers/project-progress.md currently tracks a different open child, so this plan should stop at completed-but-open unless governance is intentionally resynced later.`

## Implementation Scope

### In Scope

- Add a battle-demo helper that resolves swordsman and spearman jump and landing frame plans.
- Emit `jump` and `landing` cue ids from battle-demo `onFrame` for the requested attack variants.
- Extend the parent shared battle-demo cue resolver so embedded `jump` and `landing` messages play centralized cues.
- Add regression coverage for the frame contract and resolver mapping.

### Still Out Of Scope

- `prototypes/troop-management-preview/index.html`
- cavalry, archer, and musketeer jump or landing cues
- new bridge phases, chain ids, or fade rules
- governance resync for the unrelated child tracked in `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `prototypes/battle-demo/index.html`
  - Add the swordsman/spearman jump-landing frame helper and `onFrame` cue emission.
- `src/application/audio/battle-sound.ts`
  - Extend embedded cue resolution for `jump` and `landing`.
- `tests/battle-demo-melee-jump-landing-trigger.test.cjs`
  - Lock the move-phase versus attack-phase jump/landing routing contract.
- `tests/battle-sound.test.cjs`
  - Lock `resolveBattleDemoCueId("jump")` and `resolveBattleDemoCueId("landing")`.

## Verification Plan

- Targeted verification:
  - `bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json`
  - `bundled node.exe -e "require('./tests/battle-demo-melee-jump-landing-trigger.test.cjs'); require('./tests/battle-sound.test.cjs')"`
- Required commands:
  - `bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json`
  - `bundled node.exe .\tools\lint-superpowers-plans.mjs`

## Task 1: Add Battle-Demo Swordsman And Spearman Jump/Landing Triggers

**Files:**
- Modify: `prototypes/battle-demo/index.html`
- Modify: `src/application/audio/battle-sound.ts`
- Modify: `tests/battle-demo-melee-jump-landing-trigger.test.cjs`
- Modify: `tests/battle-sound.test.cjs`

- [x] **Step 1: Write the failing tests**

Extend the source-contract tests so battle-demo must expose the swordsman and spearman jump/landing frame mapping and must emit embedded `jump` and `landing` cue ids from `onFrame`. Extend the shared cue resolver test so `resolveBattleDemoCueId(...)` must map those cue ids into centralized battle cues.

- [x] **Step 2: Run the targeted tests and verify they fail**

Run:

```bash
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe -e "require('./tests/battle-demo-melee-jump-landing-trigger.test.cjs'); require('./tests/battle-sound.test.cjs')"
```

Expected:

- `FAIL`
- the first failures report the missing jump/landing frame helper or missing embedded cue resolver mappings

- [x] **Step 3: Write the minimal production changes**

Add the frame helper, wire the `onFrame` one-shot guards, emit `cueId: "jump"` and `cueId: "landing"` through `postBattleDemoAudioMessage(...)`, and extend `resolveBattleDemoCueId(...)` to map those embedded cue ids.

- [x] **Step 4: Run the full verification for this child**

Run:

```bash
bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json
bundled node.exe -e "require('./tests/battle-demo-melee-jump-landing-trigger.test.cjs'); require('./tests/battle-sound.test.cjs')"
bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json
bundled node.exe .\tools\lint-superpowers-plans.mjs
```

Expected:

- `PASS`

## Exit Check

- [x] swordsman `jump_slash` triggers jump at frame `9` and landing at frame `27`
- [x] swordsman `jump_chop` triggers jump at frame `29` and landing at frame `42`
- [x] spearman `jump_thrust` triggers jump at frame `8` and landing at frame `29`
- [x] `jump_slash` and `jump_thrust` are emitted from the move-phase `onFrame`
- [x] `jump_chop` is emitted from the attack-phase `onFrame`
- [x] embedded `jump` and `landing` cue ids resolve into centralized battle cues
- [ ] Project progress sync is updated if the child state changed
- [ ] Closeout block is added before the child is marked `closed`

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Not closed`
- Parent Task: `Untracked local battle-demo audio batch`
- Parent Stage: `Untracked local battle-demo audio batch`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Review the diff and request preview or non-battle-demo parity only if needed.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-27-battle-demo-melee-jump-landing-trigger-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Continue from the next battle audio trigger batch unless governance needs explicit resync.`
