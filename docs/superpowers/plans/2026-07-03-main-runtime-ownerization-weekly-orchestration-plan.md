# Main Runtime Ownerization Weekly Orchestration Plan

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open one fresh weekly set that removes the remaining covered runtime-business orchestration from `src/main.ts` without reopening the closed startup-family set or expanding into renderer redesign.

**Architecture:** The earlier `2026-07-03-main-startup` set is closed historical truth and must remain closed. This new set exists only because `src/main.ts` still owns mixed runtime-business orchestration after shell input enters the app. The set must stay narrow: it may extract covered startup session apply, story / event / scene follow-up, passive render-time trigger logic, and one explicit state write-back path, but it must not absorb presenter redesign, `MainUiFlow` redesign, task/house contract expansion, or contribution-registry work.

**Tech Stack:** Markdown governance docs, TypeScript repository tasks, `tests/robustness.test.cjs`, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Completed.`
- Next Step: `This weekly set is closed; any later main.ts continuation must begin from a fresh weekly review.`
- Verification: `2026-07-03: npm run build:test (pass); node --test tests/robustness.test.cjs --test-name-pattern "child 24 main runtime orchestrator|child 24 main runtime follow-up ownership|child 24 passive render trigger extraction|child 23 startup coordinator|child 22 continue path|child 22 restore path|child 15 covered enter-city|child 16 story trigger helper|child 16 covered city-enter|child 16 covered indoor-screen-shown|child 23 scenario-pack startup" (pass); npm run typecheck (pass); npm test (pass); npm run build (pass); npm run lint:plans (pass)`
- Notes: `This set must not pre-queue later children. Any work beyond Child 24 requires a fresh review after this queue closes.`

## Progress Log

- 2026-07-03
  - Summary: `Opened a fresh weekly set after the closed main-startup queue. The new active boundary is main.ts runtime-business orchestration ownerization, with one active child and no queued or locked follow-up child.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Start Child 24 Task 1 Step 1.`
- 2026-07-03
  - Summary: `Weekly set artifacts and Child 24 plan were written, and governance structure passed plan lint. The set remains not-started because no implementation work has begun yet.`
  - Verification: `npm run lint:plans (pass)`
  - Next: `Start Child 24 Task 1 Step 1.`
- 2026-07-03
  - Summary: `Child 24 introduced src/application/runtime/main-runtime-orchestrator.ts and moved covered startup session apply, story timing handoff, scene progression, and passive render-time trigger sync out of main.ts local ownership without expanding into presenter/render redesign or contract-family work.`
  - Verification: `npm run build:test (pass); node --test tests/robustness.test.cjs --test-name-pattern "child 24 main runtime orchestrator|child 24 main runtime follow-up ownership|child 24 passive render trigger extraction|child 23 startup coordinator|child 22 continue path|child 22 restore path|child 15 covered enter-city|child 16 story trigger helper|child 16 covered city-enter|child 16 covered indoor-screen-shown|child 23 scenario-pack startup" (pass); npm run typecheck (pass); npm test (pass); npm run build (pass)`
  - Next: `Run npm run lint:plans and close the weekly set.`
- 2026-07-03
  - Summary: `Governance closeout passed and the weekly set is now closed. Child 24 is recorded as completed, the weekly review index is synchronized, and no queued or locked same-boundary child remains.`
  - Verification: `npm run lint:plans (pass)`
  - Next: `Closed.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-24-main-runtime-orchestration-ownerization-spec.md`
- Prior closed weekly set:
  - `docs/superpowers/plans/2026-07-03-main-startup-weekly-orchestration-plan.md`
- Roadmap reference:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Child 23 already closed startup-family request selection, so this set must not reopen that boundary.`
  - `The remaining executable debt is main.ts still owning covered runtime-business follow-up, startup session apply business orchestration, and passive render-time trigger mutation.`
  - `Render markup/presenter redesign, MainUiFlow redesign, task/house contract expansion, and pack-content work remain outside this set.`

## Weekly Scope

### In Scope

- one active child for main.ts runtime orchestration ownerization
- fresh weekly artifact bundle under `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-*`
- one explicit ownership statement for request entry, runtime decision owner, follow-up owner, and state write-back sink

### Out Of Scope

- reopening the closed `2026-07-03-main-startup` weekly set
- startup-family request selection redesign
- presenter/render redesign
- `MainUiFlow` contract redesign
- task-runtime mod-facing expansion
- house-runtime mod-facing expansion
- contribution-registry or manifest expansion
- speculative queue growth beyond one active child

## Queue

Keep the visible queue intentionally minimal.

- one `active child`
- zero initial `queued` children
- zero initial `locked` children

Status meaning:

- `active`: executable now, with a plan and verified boundary
- `queued`: next promotion candidate after the active child closes
- `locked`: recorded but not eligible for promotion yet
- `completed`: closed inside this set and retained as history
- `blocked`: cannot continue until a recorded blocker is cleared

### Slot 1: Active Child

- Child: `docs/superpowers/plans/2026-07-03-child-24-main-runtime-orchestration-ownerization-plan.md`
- Queue status: `completed`
- Primary boundary: `Remove covered runtime-business orchestration ownership from src/main.ts and fix one explicit request -> decision -> follow-up -> write-back chain.`
- Depends on: `2026-07-03-child-24-main-runtime-orchestration-ownerization-spec.md`
- Resume point: `Closed.`

### Slot 2: Queued Child

- Child: `None currently`
- Queue status: `queued`
- Primary boundary: `No queued child is allowed until Child 24 closes and a fresh review proves a different problem type remains.`
- Depends on: `Not applicable`
- Promotion note: `Do not append a queued child during Child 24 execution.`

### Slot 3: Locked Child

- Child: `None currently`
- Queue status: `locked`
- Primary boundary: `No locked child is recorded at weekly-set opening.`
- Depends on: `Not applicable`
- Promotion note: `Do not append a locked child without a fresh review after Child 24.`

## Promotion Rule

When the active child closes:

1. update the `2026-07-03-main-runtime-ownerization` weekly artifact bundle
2. recheck whether any remaining work is still inside the same main-shell runtime-orchestration boundary
3. if the answer is `no`, close the set instead of inventing another child
4. only if a fresh review proves a different problem type may a new weekly set or queued child be opened

If implementation pressure reaches presenter/render redesign, `MainUiFlow` redesign, task/house contract expansion, or registry work, stop and record that the work has crossed out of this set.

## Close Rule

Close this weekly set when any of these becomes true:

- Child 24 completes and no same-boundary work remains
- Child 24 reveals that remaining work belongs to a different problem type
- the active child is blocked by an out-of-scope dependency such as presenter/render redesign

After closeout:

- no new executable child may be appended into this same set
- later continuation must begin from a fresh weekly review

## Weekly Deliverables

- [x] fresh weekly set plan exists
- [x] one active child plan exists
- [x] fresh weekly review index exists
- [x] fresh weekly module map exists
- [x] fresh weekly call flows exists
- [x] fresh weekly next split review exists
- [x] fresh weekly architecture report exists

## Deliverable Files

- Weekly review index:
  - `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-weekly-review-index.md`
- Module map:
  - `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-weekly-module-map.md`
- Call flows:
  - `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-weekly-call-flows.md`
- Next split review:
  - `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-weekly-architecture-report.md`

## Verification Policy

- The active child plan owns detailed targeted verification.
- This weekly plan records opening governance verification and later queue-state synchronization.
- Doc-only governance batches may record `Not run as part of this doc-only change`.

## Blocker Rules

- If Child 24 hits `P0`, stop all continuation work in this set.
- If Child 24 reveals that presenter/render redesign or `MainUiFlow` redesign is mandatory, mark the child `blocked` or `superseded` rather than stretching scope.
- `P2` issues may be deferred only if they do not weaken the boundary claim that `main.ts` no longer owns covered runtime-business orchestration.

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- Child 24 is completed or explicitly superseded by a fresh review
- no unresolved `P0` or `P1` remains in weekly scope
- the weekly artifact bundle and queue state are synchronized
- the latest `Progress Log` records the set outcome

## Completion Checklist

- [x] Queue state updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
- [x] Weekly review index updated
- [x] Required visibility deliverables linked and present

