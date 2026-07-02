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
  - `Child 20 House Runtime Mod Registration`
- Reason:
  - Child 20 is now completed, so the next remaining roadmap boundary shifts to unified gameplay contribution registration after a fresh baseline recheck.
- Category:
  - `house runtime registration follow-up`
- Queue status:
  - `queued pending baseline recheck`
- Immediate queued follow-up:
  - `Child 21 Unified Gameplay Contribution Registry`
- Locked later follow-up:
  - `Child 22 End-to-End Mod-First Runtime Closure`

## Non-Selected Candidates

- `Child 17 Pack Content Decoupling`
  - Already completed in this set and therefore no longer the next split candidate.
- `Child 18 Runtime Spine Unification`
  - Already completed in this set and should now remain historical truth rather than absorb task-contract work.
- `Child 20 House Runtime Mod Registration`
  - It is now completed and should remain queue history rather than absorb the next registry boundary.
- `src/core/registry/content-registry.ts`
  - Clearly underpowered, but the unified registry problem should not be promoted ahead of the active Child 20 house-registration work.
