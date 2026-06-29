# Weekly Orchestration Plan

> **For agentic workers:** Use this file as the queue-level controller for the week's implementation plans. Execute concrete code work from child plans only. Update both the child plan and this weekly orchestration plan after each work batch.

**Goal:** Govern this week's repository plan execution so child plans run in the correct order, active work is visible, pending work is queued, and interrupted work can resume from a single weekly source of truth.

**Architecture:** Use one weekly parent plan to orchestrate plan sequencing and one weekly visibility companion to force de-black-box outputs. Keep concrete implementation in child plans. Reconcile inherited legacy plans separately from the active weekly queue so historical ambiguity does not corrupt the execution order of current work.

**Tech Stack:** Markdown plan governance, TypeScript repository tasks, `npm run lint:plans`, child-plan verification commands

## Execution State

- Status: `in-progress`
- Last Updated: `2026-06-29`
- Current Focus: `Child 3 is complete and the formal Child 4 / Child 5 child-plan files now exist. Child 4 is the next executable weekly target: it should move house / interactive / minigame / battle entry toward core runtime ownership before Child 5 begins presenter/render decoupling.`
- Next Step: `Start Child 4 from its formal child plan, then keep the visibility companion/artifact bundle in lockstep with that execution batch. Child 5 remains queued behind Child 4 completion.`
- Verification: `Child 3 closeout: npm run lint:plans; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"; npm run typecheck; npm test; npm run build`
- Notes: `This weekly plan governs current execution order. Active Child 3 implementation completed on branch codex/child3-nav after being seeded from the validated dev working tree state and receiving one targeted baseline sync for the temple-house module plus zhuyuanzhang text entries. The weekly visibility companion and the eight linked weekly artifact files have now been refreshed again against real implementation. Several older plans still have inherited or uncertain state and remain in reconciliation scope until individually reviewed.`

## Progress Log

- 2026-06-29
  - Summary: `Created the first weekly orchestration layer and queued current child plans under explicit dependency rules.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 1 and update both child and weekly status after the first work batch.`
- 2026-06-29
  - Summary: `Authored Child 2 as a formal save migration hardening plan and bound it to Save / Load Runtime plus State Sync Runtime responsibilities.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 1 as the active next implementation target; use Child 2 after Child 1 completes.`
- 2026-06-29
  - Summary: `Weekly orchestration wording tightened so Child 1 owns the first core boundary plus minimal save seam, while Child 2 exclusively owns save hardening after that seam.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 1 from Task 1 Step 1, then use Child 2 only after Child 1 reaches its acceptance gate.`
- 2026-06-29
  - Summary: `Authored the formal Child 3 plan and queued it behind Child 1 and Child 2 with explicit scope guards for event activation, scene handoff, and task seams only.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Keep Child 1 as the only executable next target; Child 3 remains queued until its dependency gate is satisfied.`
- 2026-06-29
  - Summary: `Refined weekly dependency rules so Child 3 can only bypass Child 2 through a recorded waiver in both the parent and weekly logs, and corrected queue formatting for Child 2.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Start Child 1; if Child 3 is ever considered before Child 2 completes, record an explicit waiver reason in both parent and weekly progress logs first.`
- 2026-06-29
  - Summary: `Added a weekly visibility companion so each implementation batch must also update module, flow, and architecture understanding artifacts.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `After the first Child 1 work batch, update both the weekly orchestration plan and docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md.`
- 2026-06-29
  - Summary: `Created the initial weekly artifact bundle under docs/superpowers/weekly and synchronized the weekly governance files to treat those artifacts as the active visibility baseline.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Start Child 1, then update the weekly orchestration plan, visibility companion, and weekly artifact bundle together after the first implementation batch.`
- 2026-06-29
  - Summary: `Executed the first Child 1 batch and synchronized weekly governance: Task 1 landed src/core/contracts, tests now cover the initial boundary, and the weekly artifact bundle was updated from baseline/planned state to implementation-backed state.`
  - Verification: `Child 1 Task 1: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 2 engine-session composition and then repeat the same synchronization cycle.`
- 2026-06-29
  - Summary: `Executed the second Child 1 batch in an isolated worktree: Task 2 landed src/core/engine, upgraded the registry seam, and refreshed the weekly artifact bundle to reflect the first real selected-mod bootstrap path.`
  - Verification: `Child 1 Task 2: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 3 runtime dispatch and repeat the same synchronization cycle after that batch.`
- 2026-06-29
  - Summary: `Executed the third Child 1 batch in an isolated worktree: Task 3 landed src/core/runtime, validated routed effect settlement, and refreshed the weekly artifact bundle to reflect the first runtime-owned state transition seam.`
  - Verification: `Child 1 Task 3: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 4 save-envelope work and repeat the same synchronization cycle after that batch.`
- 2026-06-29
  - Summary: `Executed the Child 1 closeout batch in an isolated worktree: Task 4 landed src/core/save/save-envelope.ts, Task 5 routed src/main.ts through src/core/adapters/legacy-main-adapter.ts, and the weekly artifact bundle now reflects a completed first core boundary instead of a planned handoff.`
  - Verification: `Child 1 closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "main.ts delegates boot through legacy-main-adapter"; npm run typecheck; npm test; npm run build`
  - Next: `Promote Child 2 as the next executable weekly target after Child 1 review/merge, then repeat the same weekly/visibility synchronization cycle.`
- 2026-06-29
  - Summary: `Executed the Child 2 save-hardening batch in an isolated worktree: src/core/save gained migration/loader/writer seams, regression tests now cover legacy normalization plus missing-mod rejection, and the weekly artifact bundle now reflects a hardened persistence boundary rather than a minimal save seam.`
  - Verification: `Child 2 closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes|missing selected mod|payload after load|save migration upgrades"; npm run typecheck; npm test; npm run build`
  - Next: `Promote Child 3 as the next executable weekly target after Child 2 review/merge, then repeat the same weekly/visibility synchronization cycle.`
- 2026-06-29
  - Summary: `Executed the Child 3 navigation/time/event batch in an isolated worktree: src/core/runtime gained navigation/time/event/scene seam files, regression tests now cover the new runtime entry surfaces, and the weekly artifact bundle now reflects runtime-owned navigation/time/event entry plus the first event-to-scene handoff seam.`
  - Verification: `Child 3 closeout: npm run lint:plans; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"; npm run typecheck; npm test; npm run build`
  - Next: `Promote Child 4 as the next executable weekly target after Child 3 review/merge, then repeat the same weekly/visibility synchronization cycle.`
- 2026-06-29
  - Summary: `Authored the formal Child 4 and Child 5 plan files plus their supporting specs. Queue state is now explicit: Child 4 is the next executable weekly target, while Child 5 is queued behind Child 4 so presentation work does not stabilize against the current mixed interaction ownership.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 4 from docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md and sync weekly visibility artifacts after the first Child 4 batch.`

---

## Weekly Goal

This week prioritizes:

1. stabilizing plan governance and orchestration
2. establishing the first executable `src/core` runtime boundary
3. avoiding parallel execution conflicts on shared runtime files

This week does not assume all legacy plans will be executed.
Legacy plans outside the active queue remain in reconciliation scope until explicitly promoted into the weekly queue.

## Weekly Constraints

- Execute concrete code changes from child plans only.
- Do not execute production code from the weekly visibility companion.
- Only one implementation child plan may be `in-progress` at a time unless this weekly plan is explicitly updated to allow parallel work.
- Do not start any dependent child plan before its prerequisite child plan is `completed`.
- A dependency waiver is valid only if:
  - the waived dependency and affected queue item are named explicitly
  - the reason is recorded in both this weekly plan's `Progress Log` and the parent orchestration plan's `Progress Log`
  - the active child plan repeats that waiver in its own `Execution State` or `Progress Log` before implementation starts
- After each child-plan batch, update:
  - the child plan's `Execution State`
  - the child plan's `Progress Log`
  - this weekly plan's `Execution State`
  - this weekly plan's `Plan Status Board`
  - this weekly plan's `Progress Log`
  - `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- If a child plan hits `P0` or `P1`, do not advance the queue until the blocker rule allows it.
- Runtime subsystem boundaries for active queue items are governed by `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`.

## Weekly Visibility Companion

- Companion file:
  - `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- Role:
  - force weekly visibility outputs so implementation progress also produces readable module boundaries and control-flow snapshots
- Rule:
  - do not mark this weekly orchestration plan `completed` until the companion file also satisfies its own acceptance gate

## Weekly Visibility Outputs

The weekly visibility companion governs the update process for these required weekly outputs:

- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- `docs/superpowers/weekly/2026-06-29-weekly-boundary-checklist.md`
- `docs/superpowers/weekly/2026-06-29-weekly-module-backlog.md`
- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- `docs/superpowers/weekly/2026-06-29-weekly-change-impact.md`
- `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
- `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`

These outputs are part of the weekly acceptance gate even though their detailed update rules live in the visibility companion.

## Plan Status Board

### Completed

- `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
  - Role: Child 2 save normalization, loader/writer/migration, and selected-mod validation workstream
  - Resume point: `Completed`

- `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
  - Role: Child 3 navigation/time trigger entry, event activation, and scene handoff workstream
  - Resume point: `Completed`

### In Progress

- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Role: active queue controller
  - Resume point: `Start Child 4 after Child 3 integration and synchronize weekly status after that next work batch.`

- `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
  - Role: active weekly visibility companion
  - Resume point: `After the next Child 4 work batch, update the weekly artifact bundle and summarize the interactive runtime delta.`

### Not Started

- `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
  - Role: planned Child 4
  - Primary subsystem boundary: `Interaction Runtime`, `House Runtime integration seam`
  - Depends on: Child 1 completed and Child 3 completed
  - Resume point: `Start Task 1 Step 1.`

- `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`
  - Role: planned Child 5
  - Primary subsystem boundary: `Presentation Bridge Runtime`
  - Depends on: Child 1 completed, Child 3 completed, and Child 4 completed
  - Resume point: `Wait for Child 4 completion, then start Task 1 Step 1.`

- `docs/superpowers/plans/2026-06-29-mod-manifest-loader-and-default-mod-migration-plan.md`
  - Role: planned Child 6
  - Primary subsystem boundary: `Boot Runtime`, `Save / Load Runtime compatibility`, `State Sync Runtime compatibility`
  - Depends on: Child 1, Child 2, Child 3, and Child 5 completed
  - Resume point: `Create the child plan file first`

### Blocked

- None currently recorded in the active weekly queue.

### Needs Reconciliation

- `docs/superpowers/plans/2026-06-25-story-text-externalization.md`
  - Current file status: `unknown`
  - Reason: inherited progress does not yet reflect verified current repository state

- `docs/superpowers/plans/2026-06-25-zhuyuanzhang-pack-loader-unification.md`
  - Current file status: `unknown`
  - Reason: repository may contain already-landed partial work; verify before promoting into queue

- `docs/superpowers/plans/2026-06-25-zhuyuanzhang-pack-migration-phase1.md`
  - Current file status: `unknown`
  - Reason: legacy phase plan needs explicit reconciliation against current codebase reality

- `docs/superpowers/plans/2026-06-26-hardcoded-text-migration.md`
  - Current file status: `unknown`
  - Reason: not currently in the engine-runtime weekly queue

- `docs/superpowers/plans/2026-06-26-interactive-module-modularization-plan.md`
  - Current file status: `unknown`
  - Reason: high-level predecessor plan must be reconciled against engine-first sequencing before execution

- `docs/superpowers/plans/2026-06-26-interactive-module-modularization-task-plan.md`
  - Current file status: `not-started`
  - Reason: not active this week until engine child queue unlocks it

- `docs/superpowers/plans/2026-06-26-pack-content-migration-remainder.md`
  - Current file status: `unknown`
  - Reason: outside current weekly priority; reconcile only if reprioritized

- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
  - Current file status: `in-progress`
  - Reason: orchestration parent is active and synchronized through Child 3, but remains outside the executable child queue because concrete code work belongs to child plans

## Execution Queue

1. `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
   - Queue status: `completed`
   - Depends on: approved design only
   - Start condition: satisfied
   - Exit condition:
      - child plan marked `completed`
      - first `src/core` bootstrap seam exists
      - runtime dispatch and effect-settlement seam exists
      - minimal `SaveEnvelope` seam exists
      - `main.ts` hands off into the core boundary

2. `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Save / Load Runtime`, `State Sync Runtime`
   - Depends on: Queue Item 1 completed
   - Start condition: Child 1 completed with the minimal `SaveEnvelope` seam in place
   - Exit condition:
      - loader, writer, and migration entrypoints exist on top of the Child 1 seam
      - selected-mod validation exists during load
      - mod-owned payload round-trip is covered
      - current save path remains readable during transition

3. `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
   - Queue status: `completed`
   - Primary subsystem boundary: `Navigation Runtime`, `Time Runtime`, `Event Runtime`, `Scene Runtime handoff seam`
   - Depends on: Queue Item 1 completed and Queue Item 2 completed, or a recorded Child 2 waiver in both parent and weekly logs
   - Start condition: Child 1 completed and Child 2 completed, or a recorded Child 2 waiver in both parent and weekly logs
   - Exit condition:
      - navigation and time entry flow through typed runtime requests
      - event candidate selection and activation are runtime-owned
      - at least one event path hands off into a scene seam
      - task action and task signal seams exist without full task-runtime extraction

4. `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
   - Queue status: `not-started`
   - Primary subsystem boundary: `Interaction Runtime`, `House Runtime integration seam`
   - Depends on: Queue Item 1 completed and Queue Item 3 completed
   - Start condition: satisfied
   - Exit condition:
     - interactive runtime is integrated under core dispatch

5. `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`
   - Queue status: `not-started`
   - Primary subsystem boundary: `Presentation Bridge Runtime`
   - Depends on: Queue Item 1 completed and Queue Item 4 completed
   - Start condition: Child 4 completed and child plan file already authored
   - Exit condition:
     - `app-render` consumes presenter output and layout schema seams

6. `docs/superpowers/plans/2026-06-29-mod-manifest-loader-and-default-mod-migration-plan.md`
   - Queue status: `not-started`
   - Primary subsystem boundary: `Boot Runtime`, `Save / Load Runtime compatibility`, `State Sync Runtime compatibility`
   - Depends on: Queue Item 1, Queue Item 2, Queue Item 3, and Queue Item 5 completed
   - Start condition: child plan file authored first
   - Exit condition:
     - built-in game runs as the first-party default mod on top of the extracted engine/runtime shell

## Verification Policy

- Child plans must record their own required verification commands.
- Weekly orchestration must summarize child verification outcomes in its `Progress Log`.
- For weekly orchestration doc-only updates, record:
  - `npm run lint:plans`

## Blocker Rules

- If the active child plan encounters `P0`, stop lower-priority queue execution and record the blocker here immediately.
- If the active child plan encounters `P1`, do not advance any dependent queue item.
- If a queue item lacks a child plan file, the next legal action is to author that child plan, not to start production code edits for its scope.
- If a legacy plan from `Needs Reconciliation` becomes urgent, reconcile its actual repository state before adding it to the active queue.

## Resume Rules

When resuming weekly work:

1. read this weekly plan's `Execution State`
2. read the latest weekly `Progress Log`
3. inspect the `In Progress` and `Not Started` groups in `Plan Status Board`
4. if no child implementation plan is `in-progress`, choose the first queue item whose dependencies are satisfied
   - A waived dependency counts as satisfied only after the waiver rule above is recorded in both required logs
5. then open that child plan and resume according to `plan-governance-spec`

If this weekly plan and a child plan disagree:

1. child plan actual state
2. latest weekly `Progress Log`
3. weekly status board
4. weekly execution queue

Then update this weekly plan before continuing code work.

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- the intended weekly queue items are completed or explicitly deferred with recorded reason
- no unresolved `P0` or `P1` remains in weekly scope
- child plan states and weekly status board agree
- the weekly visibility companion is updated and satisfies its own acceptance gate
- the latest weekly `Progress Log` records the weekly outcome

## Completion Checklist

- [x] Active child plan status synchronized back into this weekly plan
- [x] Weekly visibility companion synchronized
- [x] Queue order still reflects real dependency order
- [x] Blockers, if any, recorded
- [x] Weekly `Progress Log` updated
- [x] Weekly orchestration acceptance re-evaluated
