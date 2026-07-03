# Main Runtime Ownerization Weekly Next Split Review

**Week Of:** `2026-07-03`

## Purpose

Use fixed criteria to decide what may happen after Child 24, without allowing speculative queue growth now.

## Candidate Review Table

| Module | More Than One Responsibility | No Stable Contract | Still Touches `main.ts` | Requires UI-Coupled Verification | Mods Cannot Consume Cleanly | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `yes` | `partial` | `yes` | `yes` | `indirect` | `high` |
| `src/application/runtime/main-runtime-orchestrator.ts` | `partial` | `official` | `direct` | `yes` | `indirect` | `medium` |
| `src/core/runtime/state-sync-runtime.ts` | `partial` | `official` | `indirect` | `no` | `indirect` | `medium` |
| `src/ui/main-ui/main-ui-flow.js` | `partial` | `official` | `direct` | `yes` | `indirect` | `medium` |
| `src/content/pack-content-access.ts` | `partial` | `partial` | `indirect` | `no` | `yes` | `medium` |

## Recommended Next Split

- Module:
  - `None inside this set`
- Reason:
  - Child 24 is closed, so this set does not authorize another same-boundary split
- Category:
  - `fresh-review required`
- Queue status:
  - `closed`
- Immediate queued follow-up:
  - `None currently`
- Locked later follow-up:
  - `None currently`

## Non-Selected Candidates

- `presenter/render orchestration extraction`
  - Child 24 is already closed; this can only start after a fresh review proves it is a separate problem type.
- `MainUiFlow redesign`
  - Still explicitly outside the closed Child 24 boundary.
- `pack-content active selector work`
  - Still a real candidate later, but not part of the closed main-runtime ownerization boundary.
- `task or house contract expansion`
  - Must begin from a fresh weekly review rather than piggybacking on the closed Child 24 queue.
