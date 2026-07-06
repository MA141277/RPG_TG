# Weekly Next Split Review

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


**Week Of:** `2026-07-02`

## Purpose

Use fixed criteria to decide which module should be refined next.

Do not decide the next split only from intuition.

## Candidate Review Table

| Module | More Than One Responsibility | No Stable Contract | Still Touches `main.ts` | Requires UI-Coupled Verification | Mods Cannot Consume Cleanly | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `src/core/runtime/interactive-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `medium` |
| `src/core/runtime/navigation-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `high` |
| `src/core/runtime/time-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `high` |
| `src/core/runtime/event-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `medium` |
| `src/core/runtime/scene-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `medium` |
| `src/main.ts` | `yes` | `partial` | `yes` | `yes` | `yes` | `high` |

## Recommended Next Split

- Module:
  - `None currently in the closed 2026-07-02 set`
- Reason:
  - Child 16 is completed; a later candidate should be recorded only by a fresh weekly review if a different remaining problem type is still worth extracting
- Category:
  - `set-closed`
- Queue status:
  - `no later split recorded in this set`
- Immediate queued follow-up:
  - `none beyond the current recommendation`
- Locked later follow-up:
  - `none currently recorded`

## Non-Selected Candidates

- `Child 15 Navigation + Time Runtime Convergence`
  - Already completed in this set and therefore no longer a later split candidate.
- `Child 16 Event + Scene Handoff Convergence`
  - Already completed in this set and therefore no longer a later split candidate.
- `src/main.ts`
  - Still the largest black box, but the closed 2026-07-02 set no longer justifies inventing another child here without a fresh review.

