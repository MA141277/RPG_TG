# Main Startup Weekly Next Split Review

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


**Week Of:** `2026-07-03`

## Purpose

Use fixed criteria to decide what may happen after Child 23, without allowing speculative queue growth now.

## Candidate Review Table

| Module | More Than One Responsibility | No Stable Contract | Still Touches `main.ts` | Requires UI-Coupled Verification | Mods Cannot Consume Cleanly | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `src/main.ts` | `yes` | `partial` | `yes` | `yes` | `indirect` | `high` |
| `src/application/startup/startup-session-coordinator.ts` | `planned` | `planned` | `direct` | `yes` | `indirect` | `high` |
| `src/content/pack-content-access.ts` | `partial` | `partial` | `indirect` | `no` | `yes` | `medium` |
| `src/ui/main-ui/main-ui-flow.js` | `partial` | `partial` | `direct` | `yes` | `indirect` | `medium` |

## Recommended Next Split

- Module:
  - `Child 23 Main Startup Orchestration Extraction (active)`
- Reason:
  - startup-family orchestration is the only approved executable boundary in this fresh set
- Category:
  - `startup-family orchestration extraction`
- Queue status:
  - `active`
- Immediate queued follow-up:
  - `None currently`
- Locked later follow-up:
  - `None currently`

## Non-Selected Candidates

- `render orchestration extraction`
  - Explicitly out of scope for this set until Child 23 closes and a fresh review proves it is a separate problem type.
- `MainUiFlow redesign`
  - Explicitly out of scope for this set.
- `pack-content active selector work`
  - Still a real candidate later, but not part of the startup-family boundary now.

