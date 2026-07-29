# Battle Shared Jump And Landing Audio Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shared battle jump and landing cues to the centralized soldier audio layer so later battle UI work can call them without bypassing the shared audio system.

**Architecture:** `src/application/audio/battle-sound.ts` remains the soldier-facing facade, `src/application/audio/audio-manager.ts` remains the only owner of shared cue definitions and playback variation, and `src/main.ts` remains the static battle mp3 resolver. This child only extends those existing boundaries and does not add trigger timing.

**Tech Stack:** TypeScript app runtime, CommonJS-compiled node tests via `npm run build:test`, source-contract tests in `tests/*.cjs`, repository governance docs, `npm run lint:plans`, and `npm run typecheck`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-27`
- Current Focus: `Implementation is complete for the shared jump and landing cue batch; the next follow-up is optional trigger-point wiring in a later battle integration task.`
- Next Step: `Review the diff and request runtime trigger integration when the battle UI timing is ready.`
- Verification: `bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; bundled node.exe -e "require('./tests/battle-sound.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"; bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; bundled node.exe tools/lint-superpowers-plans.mjs`
- Notes: `docs/superpowers/project-progress.md currently tracks an unrelated open child, so this plan should remain local to this audio batch unless governance is intentionally resynced later.`

## Progress Log

- 2026-07-27
  - Summary: `Created the shared battle jump and landing audio spec and plan from the approved centralized-cue design.`
  - Verification: `Not run`
  - Next: `Write the failing tests for the new facade methods, cue ids, and static battle asset map.`
- 2026-07-27
  - Summary: `Copied the provided jump and landing mp3 files into src/assets/audio/battle, added shared battle.jump and battle.landing cues, exposed them through the battle sound facade, and extended the central seam and controller tests.`
  - Verification: `bundled node.exe .\node_modules\typescript\bin\tsc -p tsconfig.test.json; bundled node.exe -e "require('./tests/battle-sound.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"; bundled node.exe .\node_modules\typescript\bin\tsc --noEmit -p tsconfig.json; bundled node.exe tools/lint-superpowers-plans.mjs`
  - Next: `Review the diff and request battle trigger timing integration when the caller side is ready.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-27-battle-shared-jump-landing-audio-design.md`
- Supporting specs:
  - `docs/superpowers/specs/2026-07-27-battle-audio-humanization-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The centralized battle audio layer already owns slash, bow, musketeer, and impact cues.`
  - `The provided jump and landing mp3 files currently live outside the repository and are not yet wired through src/main.ts.`
  - `No shared battle jump or landing facade methods currently exist.`
  - `docs/superpowers/project-progress.md currently tracks a different open child, so this plan should stop at completed-but-open unless governance is intentionally resynced later.`

## Implementation Scope

### In Scope

- Copy the provided jump and landing mp3 files into `src/assets/audio/battle/` with ASCII filenames.
- Add shared cue ids and cue definitions for jump and landing.
- Add `playJump(...)` and `playLanding(...)` to the battle sound facade.
- Wire the new battle assets through `src/main.ts`.
- Add regression coverage for the facade, cue registry, and static asset seam.

### Still Out Of Scope

- battle-demo timing hooks
- run / footstep timing
- direct playback in UI modules
- governance resync for the unrelated child tracked in `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/audio/battle-sound.ts`
  - Add the new shared facade methods.
- `src/application/audio/audio-manager.ts`
  - Register jump and landing cue ids and cue definitions.
- `src/main.ts`
  - Import and map the new battle mp3 assets.
- `tests/battle-sound.test.cjs`
  - Lock the new facade methods and queued cue ids.
- `tests/audio-seam.test.cjs`
  - Lock the new battle asset imports and centralized cue registry strings.
- `tests/audio-manager.test.cjs`
  - Verify the controller can play the new shared battle cues through the normal sfx bus.

### New files to create

- `src/assets/audio/battle/jump.mp3`
  - Repository copy of the provided jump sound.
- `src/assets/audio/battle/landing.mp3`
  - Repository copy of the provided landing sound.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node -e "require('./tests/battle-sound.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`

## Task 1: Add Shared Battle Jump And Landing Audio

**Files:**
- Modify: `src/application/audio/battle-sound.ts`
- Modify: `src/application/audio/audio-manager.ts`
- Modify: `src/main.ts`
- Modify: `tests/battle-sound.test.cjs`
- Modify: `tests/audio-seam.test.cjs`
- Modify: `tests/audio-manager.test.cjs`
- Create: `src/assets/audio/battle/jump.mp3`
- Create: `src/assets/audio/battle/landing.mp3`

- [x] **Step 1: Write the failing tests**

Extend the facade, seam, and controller tests so the new jump and landing cues must exist before production code passes.

- [x] **Step 2: Wire the new shared battle cues**

Copy the provided mp3 files into the repository, register the new cue ids and asset paths, and expose `playJump(...)` plus `playLanding(...)` through the battle sound facade.

- [x] **Step 3: Verify and sync plan state**

Run:

```bash
npm run build:test
node -e "require('./tests/battle-sound.test.cjs'); require('./tests/audio-seam.test.cjs'); require('./tests/audio-manager.test.cjs')"
npm run typecheck
npm run lint:plans
```

Expected:

- `PASS`

## Exit Check

- [x] `battle.jump` is queued through the shared battle sound facade.
- [x] `battle.landing` is queued through the shared battle sound facade.
- [x] `src/main.ts` resolves both new battle assets through the static mp3 URL map.
- [x] `src/application/audio/audio-manager.ts` registers both new cue ids and asset-backed definitions.
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Not closed`
- Parent Task: `Untracked local battle audio batch`
- Parent Stage: `Untracked local battle audio batch`
- Closeout Status: `not-closed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Review the diff and request trigger-point wiring in a later batch if needed.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-27-battle-shared-jump-landing-audio-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md only if governance needs resync; otherwise continue from the next battle trigger integration batch.`
