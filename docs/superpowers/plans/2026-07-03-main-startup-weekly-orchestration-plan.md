# Main Startup Weekly Orchestration Plan

> **Purpose:** Govern the fresh post-Child-22 continuation set that opens a new problem type: extracting startup-family orchestration from `src/main.ts` without reopening the closed mod-first closure queue.

**Week Of:** `2026-07-03`

**Goal:** Open one fresh executable child that extracts `startup / continue / restore / scenario import` orchestration into an explicit coordinator seam while keeping render orchestration and runtime settlement semantics unchanged.

**Architecture:** The `2026-07-02` mod-first set is closed historical truth. This new set exists only because `src/main.ts` still owns a startup-family orchestration black box after Child 22. The set must stay narrow: it may extract startup-family entry routing and startup-bound bootstrap helpers, but it must not absorb render orchestration, follow-up ownership, `MainUiFlow` redesign, or new save-contract families.

**Tech Stack:** Markdown governance docs, TypeScript repository tasks, `npm run build:test`, Node test runner (`tests/robustness.test.cjs`), `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `Completed.`
- Next Step: `This weekly set is closed; any later main.ts continuation must begin from a fresh weekly review.`
- Verification: `2026-07-03: npm run build:test (pass); node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction|child 22 continue path|child 22 restore path|child 22 builtin and imported startup" (pass); npm run typecheck (pass); npm test (pass); npm run build (pass); npm run lint:plans (pass)`
- Notes: `This set must not pre-queue later children. Any work beyond startup-family orchestration requires a fresh review after Child 23 closes.`

## Progress Log

- 2026-07-03
  - Summary: `Opened a fresh weekly set after the closed Child 22 mod-first closure work. The new active boundary is startup-family orchestration extraction from main.ts, and the queue is intentionally capped at one active child with no queued or locked follow-up.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 23 Task 1 Step 1.`
- 2026-07-03
  - Summary: `Child 23 extracted startup / continue / restore / scenario import orchestration into src/application/startup/startup-session-coordinator.ts, and main.ts now consumes one coordinator seam while keeping render and runtime-settlement ownership unchanged. No additional same-boundary child was opened, so this weekly set is ready to close after governance verification.`
  - Verification: `npm run build:test (pass); node --test tests/robustness.test.cjs --test-name-pattern "child 23 startup coordinator|child 23 main startup extraction|child 22 continue path|child 22 restore path|child 22 builtin and imported startup" (pass); npm run typecheck (pass); npm test (pass); npm run build (pass)`
  - Next: `Run npm run lint:plans and close the weekly set.`
- 2026-07-03
  - Summary: `Governance verification passed and the weekly set is now closed. Child 23 is recorded as completed, the weekly review index is synchronized, and no queued or locked same-boundary child remains.`
  - Verification: `npm run lint:plans (pass)`
  - Next: `Closed.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-main-startup-orchestration-extraction-design.md`
- Prior closed weekly set:
  - `docs/superpowers/plans/2026-07-02-mod-first-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `The post-Child-22 codebase already proves startup/save/restore parity, so this set must not reopen that closure boundary.`
  - `The remaining executable debt is that main.ts still directly owns builtin startup, continue, restore, and scenario import/start decision trees.`
  - `Render orchestration, runtime follow-up ownership, and MainUiFlow redesign remain outside this set even if they appear adjacent.`

## Weekly Scope

### In Scope

- one active child for startup-family orchestration extraction
- fresh weekly artifact bundle under `docs/superpowers/weekly/2026-07-03-main-startup-*`
- queue governance for one active child and no pre-opened later child

### Out Of Scope

- reopening the closed `2026-07-02` mod-first weekly set
- reopening Child 22 save/source persistence work
- render orchestration redesign
- runtime follow-up or settlement redesign
- `MainUiFlow` public contract redesign
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

- Child: `docs/superpowers/plans/2026-07-03-child-23-main-startup-orchestration-extraction-plan.md`
- Queue status: `completed`
- Primary boundary: `Extract startup / continue / restore / scenario import orchestration from main.ts into one coordinator seam.`
- Depends on: `2026-07-03-main-startup-orchestration-extraction-design.md`
- Resume point: `Closed.`

### Slot 2: Queued Child

- Child: `None currently`
- Queue status: `queued`
- Primary boundary: `No queued child is allowed until Child 23 closes and a later review proves a different problem type remains.`
- Depends on: `Not applicable`
- Promotion note: `Do not append a queued child during Child 23 execution.`

### Slot 3: Locked Child

- Child: `None currently`
- Queue status: `locked`
- Primary boundary: `No locked child is recorded in this set at opening.`
- Depends on: `Not applicable`
- Promotion note: `Do not append a locked child without a fresh review outcome after Child 23.`

## Promotion Rule

When the active child closes:

1. update the `2026-07-03-main-startup` weekly artifact bundle
2. recheck whether any remaining work is still inside the same startup-family boundary
3. if the answer is `no`, close the set instead of inventing another child
4. only if a later review proves a different problem type may a new weekly set or queued child be opened

If implementation pressure reaches render orchestration, runtime follow-up, or `MainUiFlow` contract redesign, stop and record that the work has crossed out of this set.

## Close Rule

Close this weekly set when any of these becomes true:

- Child 23 completes and no same-boundary work remains
- Child 23 reveals that remaining work belongs to a different problem type
- the active child is blocked by an out-of-scope dependency such as render orchestration redesign

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
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-review-index.md`
- Module map:
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-module-map.md`
- Call flows:
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-call-flows.md`
- Next split review:
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-next-split-review.md`
- Architecture report:
  - `docs/superpowers/weekly/2026-07-03-main-startup-weekly-architecture-report.md`

## Verification Policy

- The active child plan owns detailed targeted verification.
- This weekly plan records opening governance verification and later queue-state synchronization.
- Doc-only governance batches may record `Not run as part of this doc-only change`.

## Blocker Rules

- If Child 23 hits `P0`, stop all continuation work in this set.
- If Child 23 reveals that render orchestration or `MainUiFlow` redesign is mandatory, mark the child `blocked` or `superseded` rather than stretching the scope.
- `P2` issues may be deferred only if they do not weaken the startup-family boundary claim.

## Acceptance Gate

Do not mark this weekly plan `completed` until:

- Child 23 is completed or explicitly superseded by a fresh review
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
