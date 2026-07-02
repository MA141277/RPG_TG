# Weekly Next Split Review

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
  - `Child 16 Event + Scene Handoff Convergence`
- Reason:
  - once Child 15 closes, the next different problem type should be the still-separated event/scene handoff boundary rather than more same-type navigation/time cleanup
- Category:
  - `needs-convergence`
- Queue status:
  - `queued spec awaiting Child 15 closeout and later baseline recheck`
- Immediate queued follow-up:
  - `none beyond the current recommendation`
- Locked later follow-up:
  - `none currently recorded`

## Non-Selected Candidates

- `Child 15 Navigation + Time Runtime Convergence`
  - Already active in this set and therefore no longer a later split candidate.
- `Child 16 Event + Scene Handoff Convergence`
  - Remains queued because it is now the immediate follow-up after Child 15.
- `src/main.ts`
  - Still the largest black box, but while Child 15 is active the next safe later reduction after it should be Child 16's event/scene boundary rather than another broad `main.ts` sweep.
