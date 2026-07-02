# Weekly Orchestration Spec

## 1. Goal

This spec defines how a weekly orchestration plan governs one lightweight weekly set under `docs/superpowers/plans/`.

The target is to make weekly-set planning:

- explicit about execution order and child promotion rules
- light enough to stay readable while execution is moving
- resumable after Codex or developer interruptions
- compatible with the repository-wide `plan-governance-spec`
- explicit about when one weekly set is closed and when later work requires a new weekly set instead of appending to the old one

## 2. Scope

This spec applies to weekly orchestration files such as:

- `docs/superpowers/plans/*weekly-orchestration*.md`

This spec does not replace the per-plan rules in:

- `docs/superpowers/specs/plan-governance-spec.md`

Instead:

- the weekly orchestration plan governs queue order, promotion, and closeout
- each active child plan still governs its own implementation steps
- queued children stay as specs until promoted

Interpretation rule:

- one weekly orchestration plan represents one governed weekly set / iteration set
- it is not merely a calendar-week note file
- the same natural week may contain more than one weekly set if an earlier set closes and later continuation needs a fresh review

## 3. Weekly Orchestration Role

A weekly orchestration plan is a parent coordination artifact.

It must:

- define the weekly-set goal and boundary
- record the current visible child queue
- say which child is active, queued, or locked
- define promotion and closeout rules
- define how to resume after interruption

It must not:

- replace the checkbox execution of the active child plan
- treat queued child specs as executable plans
- reopen a closed weekly set by silently appending new executable children without a fresh review/promotion cycle

## 4. Required Weekly Sections

Every weekly orchestration plan must include:

- title heading
- `Goal`
- `Architecture`
- `Tech Stack`
- `## Execution State`
- `## Progress Log`
- `## Weekly Scope`
- `## Queue`
- `## Promotion Rule`
- `## Close Rule`
- `## Acceptance Gate`

Recommended additional sections:

- `## Weekly Deliverables`
- `## Deliverable Files`
- `## Blocker Rules`
- `## Verification Policy`
- `## Notes`

## 5. Queue Model

The weekly set queue should stay intentionally shallow.

Recommended maximum visible depth:

- one `active child`
- one `queued follow-up child`
- one `locked follow-up child`

Anything beyond that should remain in architecture review, backlog, or candidate status outside the active weekly set.

Each queue slot should record:

- child id or short child name
- spec path
- queue status
- primary boundary
- dependency note
- promotion note

If the slot is `active`, also record:

- plan path
- current execution focus or resume point

Allowed queue status values:

- `active`
- `queued`
- `locked`
- `completed`
- `blocked`
- `superseded`

Status meaning rule:

- `active`
  - the child is executable now and must have both spec and plan
- `queued`
  - the child is the next promotion candidate after the current active child closes
  - it may stay spec-only until promotion
  - missing a plan does not make it `locked`
- `locked`
  - the child is recorded inside the same weekly set, but it is not the next promotion candidate yet
  - it may stay spec-only until later governance promotion
- `completed`
  - the child finished inside this weekly set and remains recorded as historical queue truth
  - a completed child is not executable again unless a later review explicitly reopens the same boundary
- `blocked`
  - the child cannot continue yet because a recorded blocker prevents safe progress
  - lower-priority dependent queue items must obey the blocker rules

## 6. Child Document Rules

Rules:

- the current `active` child must have both a spec and a plan
- a `queued` or `locked` child may exist with a spec only
- a queued child plan is authored only after that child is promoted to `active`
- queued child specs must already define:
  - one primary boundary
  - one problem statement
  - one expected outcome
  - explicit out-of-scope constraints
  - exit conditions
  - verification story
  - promotion recheck expectations

## 7. Promotion And Baseline Recheck

When the active child completes:

1. update the relevant weekly artifacts
2. recheck the next queued child spec against the new code and artifact baseline
3. record one of these results:
   - `unchanged`
   - `narrowed`
   - `superseded`
4. only after that recheck may the next child be promoted to `active`
5. only after promotion may its executable plan be authored

Rules:

- after the prior `active` child completes and before the next child is promoted, the weekly set may temporarily have no `active` child
- a queued child must not be executed mechanically just because it was listed earlier
- promotion must be explicit in the weekly set plan
- if a child becomes `superseded`, do not auto-insert a replacement child into the same weekly set without a separate review decision

## 8. Queue Closeout And New Set Rule

When a weekly orchestration plan reaches queue closeout:

- the plan may remain as the authoritative record of that closed set
- it must not be reused as the live controller for newly executable children
- later continuation work must open a new weekly set with its own queue state, entry goal, and promotion rules

Clarifications:

- a natural calendar week does not force all work into one weekly orchestration plan
- if Child A through Child N are complete and the queue is closed on Tuesday, later work started on Wednesday should still open a new weekly set rather than reopening the old one
- architecture candidates or backlog items may still be recorded in the closed set, but they are not executable children

## 9. Resume Rules

When resuming weekly execution:

1. open the weekly orchestration plan
2. inspect `Execution State`
3. inspect the latest weekly `Progress Log`
4. inspect the `Queue`
5. if a child is already `active`, open that child plan and resume according to `plan-governance-spec`
6. if no child is `active`, inspect the first queued child whose dependencies are satisfied
7. perform baseline recheck before plan authoring or execution
8. if the recheck passes, promote that child and author its active plan before code work starts

Resume clarification:

- if the latest completed child is already marked `completed`, do not keep treating it as the active execution target
- the next execution step is either explicit promotion of the queued child or explicit closeout of the weekly set

If the weekly plan is already marked `completed` and no active queue item remains:

- do not resume by appending a new executable child into that file
- instead, start from a fresh weekly review and create the next weekly orchestration plan for the new set

## 10. Verification Policy

Weekly orchestration is not a replacement for child verification.

Rules:

- each child plan must still record its own verification commands
- the weekly plan must summarize whether the active child passed or failed verification
- weekly progress updates must reference the child verification outcome

## 11. Blocker Rules

If a child plan enters `blocked`:

- update the child plan first
- then update the weekly plan queue entry
- move the queue item to `blocked`
- record the blocker in weekly `Progress Log`

Queue advancement rules:

- unresolved `P0` blocks lower-priority queue execution
- unresolved `P1` blocks dependent queue items
- `P2` may be deferred only if explicitly logged and if the next queue item does not depend on the unresolved area

## 12. Acceptance Gate

A weekly orchestration plan may be marked `completed` only when:

- the intended weekly-set goal is complete, or the set is explicitly closed with no remaining executable child
- no unresolved `P0` or `P1` remains in weekly scope
- the active child plan state and weekly queue state agree
- required weekly artifacts are updated for the latest active-child completion or defer decision
- the latest weekly `Progress Log` records the weekly outcome

After a weekly orchestration plan is marked `completed`:

- it may still record explanatory notes, reconciliation notes, or architecture candidates
- it must not become the active execution controller again unless a higher-level governance document explicitly supersedes the closeout rule

## 13. Relationship To Repository Governance

Weekly orchestration plans must conform to:

- `docs/superpowers/specs/plan-governance-spec.md`
- `AGENTS.md`
- `docs/superpowers/README.md`

The weekly orchestration spec adds lightweight queue-level governance on top of the base plan structure.
