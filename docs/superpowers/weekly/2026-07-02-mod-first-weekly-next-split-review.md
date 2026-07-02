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
  - Child 19 is now completed. The next remaining roadmap boundary is house runtime registration, but it should only be promoted after a fresh baseline recheck confirms Child 19 did not expose a narrower follow-up first.
- Category:
  - `house runtime registration follow-up`
- Queue status:
  - `queued pending baseline recheck`
- Immediate queued follow-up:
  - `Child 20 House Runtime Mod Registration`
- Locked later follow-up:
  - `Child 21 Unified Gameplay Contribution Registry`

## Non-Selected Candidates

- `Child 17 Pack Content Decoupling`
  - Already completed in this set and therefore no longer the next split candidate.
- `Child 18 Runtime Spine Unification`
  - Already completed in this set and should now remain historical truth rather than absorb task-contract work.
- `Child 20 House Runtime Mod Registration`
  - It is now the next candidate, but it still needs a fresh recheck before promotion.
- `src/core/registry/content-registry.ts`
  - Clearly underpowered, but the unified registry problem should not be promoted ahead of the more immediate queued Child 19 task-contract work.
