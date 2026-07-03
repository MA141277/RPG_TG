# Main Runtime Ownerization Weekly Next Split Review

**Week Of:** `2026-07-03`

## Purpose

Use fixed criteria to decide what may happen after Child 24, without allowing speculative queue growth now.

## Candidate Review Table

| Module | More Than One Responsibility | No Stable Contract | Still Touches `main.ts` | Requires UI-Coupled Verification | Mods Cannot Consume Cleanly | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `yes` | `partial` | `yes` | `yes` | `indirect` | `high` |
| `src/application/runtime/main-runtime-orchestrator.ts` | `planned` | `planned` | `direct` | `yes` | `indirect` | `high` |
| `src/core/runtime/state-sync-runtime.ts` | `partial` | `official` | `indirect` | `no` | `indirect` | `medium` |
| `src/ui/main-ui/main-ui-flow.js` | `partial` | `official` | `direct` | `yes` | `indirect` | `medium` |
| `src/content/pack-content-access.ts` | `partial` | `partial` | `indirect` | `no` | `yes` | `medium` |

## Recommended Next Split

- Module:
  - `Child 24 Main Runtime Orchestration Ownerization (active)`
- Reason:
  - main.ts still owns covered runtime-business orchestration even after startup-family request selection moved out
- Category:
  - `main-shell runtime ownerization`
- Queue status:
  - `active`
- Immediate queued follow-up:
  - `None currently`
- Locked later follow-up:
  - `None currently`

## Non-Selected Candidates

- `presenter/render orchestration extraction`
  - Explicitly out of scope for this set until Child 24 closes and a fresh review proves it is a separate problem type.
- `MainUiFlow redesign`
  - Explicitly out of scope for this set.
- `pack-content active selector work`
  - Still a real candidate later, but not part of the current main-runtime ownerization boundary.
- `task or house contract expansion`
  - Must wait until shell runtime-business orchestration ownership is no longer mixed inside `main.ts`.
