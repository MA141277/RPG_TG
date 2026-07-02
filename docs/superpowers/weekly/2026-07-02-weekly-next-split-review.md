# Weekly Next Split Review

**Week Of:** `2026-07-02`

## Purpose

Use fixed criteria to decide which module should be refined next.

Do not decide the next split only from intuition.

## Candidate Review Table

| Module | More Than One Responsibility | No Stable Contract | Still Touches `main.ts` | Requires UI-Coupled Verification | Mods Cannot Consume Cleanly | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `src/core/runtime/interactive-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `high` |
| `src/core/runtime/navigation-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `medium` |
| `src/core/runtime/time-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `medium` |
| `src/core/runtime/event-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `medium` |
| `src/core/runtime/scene-runtime.ts` | `partial` | `no` | `indirect` | `no` | `partial` | `medium` |
| `src/main.ts` | `yes` | `partial` | `yes` | `yes` | `yes` | `high` |

## Recommended Next Split

- Module:
  - `Child 14 Interactive Remaining Legacy Convergence`
- Reason:
  - the remaining `legacy-interactive-adapter.ts` debt is the narrowest unresolved ownerization residue after Child 13 and has the clearest reviewable boundary
- Category:
  - `needs-boundary`
- Queue status:
  - `active executable child in the fresh 2026-07-02 weekly set`
- Immediate queued follow-up:
  - `Child 15 Navigation + Time Runtime Convergence`
- Locked later follow-up:
  - `Child 16 Event + Scene Handoff Convergence`

## Non-Selected Candidates

- `Child 15 Navigation + Time Runtime Convergence`
  - Now formally queued as the immediate follow-up, but still not executable while Child 14 remains open.
- `Child 16 Event + Scene Handoff Convergence`
  - Remains the locked later follow-up because it has the highest risk of expanding into broader story-flow redesign.
- `src/main.ts`
  - Still the largest black box, but the next safe reduction is Child 14's interactive tail cleanup rather than another broad `main.ts` sweep.
