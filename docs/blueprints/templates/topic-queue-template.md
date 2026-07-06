# Queue Title

## Queue Goal

Replace this line with the queue goal.

## Boundary

This queue covers:

- Replace with in-scope item 1.
- Replace with in-scope item 2.

This queue does not cover:

- Replace with out-of-scope item 1.
- Replace with out-of-scope item 2.

## Parent Target

- Target spec:
  - `docs/blueprints/specs/...`
- Target plan:
  - `docs/blueprints/plans/...`

## Execution State

- Status: `in-progress`
- Last Updated: `2000-01-01`
- Current Focus: `Replace this line with the current queue focus.`
- Active Task:
  - `task....` or `none`
- Next Step:
  - `Replace this line with the next queue action.`
- Verification:
  - `Replace this line with the latest queue-level verification state.`
- Notes:
  - `Replace this line with current queue caveats.`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Replace with baseline truth note 1.`
  - `Replace with baseline truth note 2.`

## Current Queue

| Task ID | State | Summary | Depends On | Notes |
| --- | --- | --- | --- | --- |
| `task.example.a` | `candidate` | `Replace with task summary.` | `none` | `Replace this note.` |

## Next Executable Task

- Task ID:
  - `task.example.a`
- Required action before promotion:
  - `Replace with the required promotion action.`
- Expected output:
  - `Replace with the expected output.`

## Candidate Backlog

- `task.example.b`
  - State:
    - `candidate`
  - Reason:
    - `Replace with the backlog reason.`

## State Transition Rules

1. A `queued` task becomes `active` only after a baseline recheck.
2. A `blocked` task must record its blocker in the queue.
3. A `dropped` task must record why it was removed instead of disappearing silently.

## Progress Log

- 2000-01-01
  - Summary: `Queue created.`
  - Verification: `Not run`
  - Next: `Replace with the next real action.`
