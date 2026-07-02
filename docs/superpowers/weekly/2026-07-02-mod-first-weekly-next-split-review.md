# Mod-First Weekly Next Split Review

**Week Of:** `2026-07-02`

## Purpose

Use fixed criteria to decide which module should be refined next inside the fresh mod-first continuation set.

Do not decide the next split only from intuition.

## Candidate Review Table

| Module | More Than One Responsibility | No Stable Contract | Still Touches `main.ts` | Requires UI-Coupled Verification | Mods Cannot Consume Cleanly | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `src/content/story/index.ts` | `yes` | `yes` | `indirect` | `no` | `yes` | `high` |
| `src/content/houses/*.ts` | `partial` | `partial` | `indirect` | `no` | `yes` | `high` |
| `src/application/content/default-runtime-content.ts` | `partial` | `partial` | `direct` | `no` | `partial` | `high` |
| `src/main.ts` | `yes` | `partial` | `yes` | `yes` | `yes` | `high` |
| `src/core/runtime/task-runtime.ts` | `partial` | `partial` | `indirect` | `no` | `partial` | `medium` |
| `src/application/house-modules/house-module-registry.ts` | `partial` | `partial` | `indirect` | `yes` | `partial` | `medium` |
| `src/core/registry/content-registry.ts` | `yes` | `yes` | `indirect` | `no` | `yes` | `medium` |

## Recommended Next Split

- Module:
  - `Fresh weekly review required`
- Reason:
  - Child 22 is completed and the visible queue is closed. Do not auto-append another same-type child into this weekly set.
- Category:
  - `fresh continuation decision`
- Queue status:
  - `completed`
- Immediate queued follow-up:
  - `None currently`
- Locked later follow-up:
  - `None currently`

## Non-Selected Candidates

- `Child 17 Pack Content Decoupling`
  - Already completed in this set and therefore no longer the next split candidate.
- `Child 18 Runtime Spine Unification`
  - Already completed in this set and should now remain historical truth rather than absorb task-contract work.
- `Child 20 House Runtime Mod Registration`
  - It is now completed and should remain queue history rather than absorb the next registry boundary.
- `Child 21 Unified Gameplay Contribution Registry`
  - It is now completed and should remain queue history rather than absorb end-to-end startup/save/restore closure work.
- `src/core/registry/content-registry.ts`
  - It is no longer placeholder-grade, but registry typing alone is not the next highest-risk boundary after Child 21 closeout.
- `Child 22 End-to-End Mod-First Runtime Closure`
  - It is now completed and should remain closed history rather than keep absorbing same-type save/restore follow-up.
