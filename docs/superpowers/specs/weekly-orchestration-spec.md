# Weekly Orchestration Spec

## 1. Goal

This spec defines how a weekly orchestration plan governs multiple implementation plans under `docs/superpowers/plans/`.

The target is to make weekly planning:

- explicit about which plans are completed, in progress, pending, blocked, or unknown
- explicit about execution order and dependency rules
- resumable after Codex or developer interruptions
- compatible with the repository-wide `plan-governance-spec`
- explicit about when one weekly set is closed and when later work requires a new weekly set instead of appending to the old one

## 2. Scope

This spec applies to weekly orchestration files such as:

- `docs/superpowers/plans/*weekly-orchestration*.md`

This spec does not replace the per-plan rules in:

- `docs/superpowers/specs/plan-governance-spec.md`

Instead:

- the weekly orchestration plan governs plan-to-plan sequencing
- each child plan still governs its own implementation steps

Interpretation rule:

- one weekly orchestration plan represents one governed weekly set / iteration set
- it is not merely a calendar-week note file
- the same natural week may contain more than one weekly set if an earlier set closes and later continuation needs a fresh review

## 3. Weekly Orchestration Role

A weekly orchestration plan is a parent coordination artifact.

It must:

- list the plans in scope for the week
- record each plan's orchestration status
- define queue order and dependency rules
- define what to do when a plan is blocked
- define how to resume after interruption

It must not:

- replace the concrete checkbox execution of child plans
- hide implementation state inside prose only
- mark a child plan completed if the child plan itself is not updated
- reopen a closed weekly set by silently appending new executable children without a fresh review/promotion cycle

## 4. Required Weekly Sections

Every weekly orchestration plan must include:

- title heading
- `Goal`
- `Architecture`
- `Tech Stack`
- `## Execution State`
- `## Progress Log`
- `## Weekly Goal`
- `## Weekly Constraints`
- `## Plan Status Board`
- `## Execution Queue`
- `## Resume Rules`
- `## Acceptance Gate`

Recommended additional sections:

- `## Blocker Rules`
- `## Verification Policy`
- `## Notes`
- `## Current Iteration Phase`
- `## Post-Queue Continuation Rules`

## 5. Weekly Plan Status Model

Each tracked plan in the weekly orchestration file must use one of these status values:

- `completed`
- `in-progress`
- `not-started`
- `blocked`
- `unknown`

Definitions:

- `completed`
  - the child plan is marked complete in its own file and its acceptance gate is satisfied
- `in-progress`
  - the child plan has active execution this week or is the current active queue item
- `not-started`
  - the child plan is approved for this queue but execution has not begun
- `blocked`
  - the child plan cannot continue until a recorded blocker is resolved
- `unknown`
  - historical or inherited plan state has not yet been reconciled against current codebase reality

## 6. Status Board Contract

The weekly orchestration plan must maintain a `Plan Status Board` grouped by status:

- `Completed`
- `In Progress`
- `Not Started`
- `Blocked`
- `Needs Reconciliation`

Each listed plan entry should contain:

- plan path or plan id
- owner scope or short description
- dependency note
- current resume point or blocker

## 7. Execution Queue Rules

The weekly orchestration plan must define a queue in execution order.

For each queue item, record:

- sequence number
- plan path
- status
- depends on
- start condition
- exit condition

Rules:

- only one queue item should be the active `in-progress` implementation target at a time unless the weekly plan explicitly allows parallel work
- a dependent plan must not start before its prerequisites are complete
- if a queue item does not yet have a child plan file, the child plan file must be authored before code execution begins for that scope
- once the weekly set has been closed and the weekly orchestration plan is marked `completed`, do not append another executable child to that same set
- any later continuation after queue closeout must begin through a fresh weekly review and a new weekly orchestration plan or explicitly superseding weekly set

## 7.1 Queue Closeout And New Set Rule

When a weekly orchestration plan reaches queue closeout:

- the plan may remain as the authoritative record of that closed set
- it must not be reused as the live controller for newly executable children
- later continuation work must open a new weekly set with its own queue state, entry goal, and promotion rules

Clarifications:

- a natural calendar week does not force all work into one weekly orchestration plan
- if Child A through Child N are complete and the queue is closed on Tuesday, later work started on Wednesday should still open a new weekly set rather than reopening the old one
- architecture candidates or backlog items may still be recorded in the closed set, but they are not executable children

## 8. Resume Rules

When resuming weekly execution:

1. open the weekly orchestration plan
2. inspect `Execution State`
3. inspect the latest weekly `Progress Log`
4. inspect the `In Progress` group in the status board
5. if no child plan is `in-progress`, choose the first queue item with:
   - `status = not-started`
   - all dependencies satisfied
6. then open that child plan and resume according to `plan-governance-spec`

If weekly plan state and child plan state disagree:

1. child plan actual state
2. latest weekly `Progress Log`
3. weekly status board
4. weekly execution queue

Then update the weekly plan before doing more code work.

If the weekly plan is already marked `completed` and no active queue item remains:

- do not resume by appending a new executable child into that file
- instead, start from a fresh weekly review and create the next weekly orchestration plan for the new set

## 9. Verification Policy

Weekly orchestration is not a replacement for child verification.

Rules:

- each child plan must still record its own verification commands
- the weekly plan must summarize whether the active child passed or failed verification
- weekly progress updates must reference the child verification outcome

Recommended weekly summary wording:

- `Child 1 verification passed: npm run typecheck, npm test, npm run build`
- `Child 2 blocked by P1; do not advance queue`

## 10. Blocker Rules

If a child plan enters `blocked`:

- update the child plan first
- then update the weekly plan status board
- move the queue item to `Blocked`
- record the blocker in weekly `Progress Log`

Queue advancement rules:

- unresolved `P0` blocks lower-priority queue execution
- unresolved `P1` blocks dependent queue items
- `P2` may be deferred only if explicitly logged and if the next queue item does not depend on the unresolved area

## 11. Acceptance Gate

A weekly orchestration plan may be marked `completed` only when:

- every required queue item for the week is `completed`
- no unresolved `P0` or `P1` remains in weekly scope
- child plans and weekly status board agree
- the latest weekly `Progress Log` records the weekly outcome

After a weekly orchestration plan is marked `completed`:

- it may still record explanatory notes, reconciliation notes, or architecture candidates
- it must not become the active execution controller again unless a higher-level governance document explicitly supersedes the closeout rule

## 12. Relationship To Repository Governance

Weekly orchestration plans must conform to:

- `docs/superpowers/specs/plan-governance-spec.md`
- `AGENTS.md`
- `docs/superpowers/README.md`

The weekly orchestration spec adds queue-level governance on top of the base plan structure.
