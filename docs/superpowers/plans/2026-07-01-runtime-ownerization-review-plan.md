# Runtime Ownerization Review And Baseline Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. If this legacy artifact is explicitly resumed, use `docs/superpowers/project-progress.md`; otherwise use `docs/blueprints/project-progress.md` for current repository work.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Child 10 review pass that turns the current runtime inventory into one stable baseline document, then use that baseline to lock Child 11 scope, ordering, and execution rules.

**Architecture:** Build Child 10 as a doc-governance child after `Child 9 Runtime Contract Hardening`. Child 10 does not ownerize runtimes in production code. It finalizes runtime maturity, owner/bridge classification, adapter disposition, `src/main.ts` coupling boundaries, and Child 11 implementation controls inside the Child 10 baseline document and weekly queue controller.

**Tech Stack:** Markdown plan governance, repository runtime architecture docs, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-01`
- Current Focus: `Child 10 Runtime Ownerization Review And Baseline remains finalized as a completed governance child. Its baseline is now consumed by the authored Child 11 spec/plan set and the recorded weekly unlock sync.`
- Next Step: `Start Child 11 from docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md when production ownerization work begins.`
- Verification: `npm run lint:plans`
- Notes: `This child stayed document-governance only. It finalized runtime maturity, owner/bridge classification, adapter disposition, main.ts coupling, and Child 11 execution controls without absorbing production ownerization, adapter removal in code, UI/presenter work, resource planning, or boot/content assembly redesign.`

## Progress Log

- 2026-07-01
  - Summary: `Child 10 Runtime Ownerization Review And Baseline plan authored. The plan is limited to finalizing runtime maturity, owner/bridge classification, adapter disposition, main.ts coupling, Child 11 execution controls, and weekly queue sync.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for Child 9 closeout, then start Task 1 Step 1.`
- 2026-07-01
  - Summary: `Completed Child 10. The runtime ownerization baseline is now finalized, owner vs bridge status is explicit, adapter disposition and main.ts coupling are frozen for Child 11, and weekly governance now records Child 10 as completed while Child 11 remains locked pending spec/plan authoring.`
  - Verification: `npm run lint:plans`
  - Next: `Author Child 11 spec and plan against the finalized Child 10 baseline before any ownerization code work starts.`
- 2026-07-01
  - Summary: `Child 11 spec and plan were authored against the finalized Child 10 baseline, and weekly unlock sync now records Child 11 as the next executable implementation child without reopening the baseline.`
  - Verification: `npm run lint:plans`
  - Next: `Begin Child 11 from its own implementation plan when code work starts.`

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-07-01-runtime-ownerization-review-spec.md`
- Baseline output: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Reusable template: `docs/superpowers/templates/runtime-ownerization-baseline-template.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Child 9 spec: `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md`
- Child 9 plan: `docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md`

## Parent Alignment

- This file is `Child Plan 10` in the weekly queue.
- Primary subsystem boundary:
  - `Runtime ownerization review / baseline governance`
- Secondary subsystem relationships:
  - consumes the stable contract surface produced by Child 9
  - freezes the runtime ownership work that Child 11 is allowed to perform
  - prevents Child 11 from reopening router, adapter, and main-shell boundaries ad hoc
- Queue rule:
  - Child 9 must complete before Child 10 starts.
  - Child 11 must not start until Child 10 completes and the weekly plan records Child 11 as unlocked.

## Scope

This child plan includes:

- finalizing the Child 10 baseline document
- runtime maturity and owner/bridge classification
- contract freeze review
- bridge/adapter disposition review
- `src/main.ts` coupling review
- Child 11 execution boundary, batch order, and acceptance gates
- weekly plan sync for Child 10 and Child 11 queue state

This child plan does not include:

- production code ownerization
- runtime adapter removal in code
- UI/layout/presenter changes
- save/runtime/mod implementation work
- resource planning

## File Map

### Existing Files To Modify

- `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
  - Finalize the Child 10 baseline artifact that unlocks Child 11.
- `docs/superpowers/plans/2026-07-01-runtime-ownerization-review-plan.md`
  - Track execution state and progress.
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Sync Child 10 and Child 11 queue state and unlock rules.
- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
  - Sync Child 10 review/baseline status if queue wording changes.
- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
  - Sync runtime maturity wording when the baseline is finalized.
- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
  - Sync target runtime flow wording if Child 10 finalizes examples.
- `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
  - Sync the next-child recommendation after Child 10 closes.
- `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`
  - Sync architecture wording if Child 10 finalizes owner/bridge status.

## Required Verification Gate

Because this is a doc-governance child, record:

- `npm run lint:plans`

If Child 10 updates non-plan governance docs only, record:

- `Not run as part of this doc-only governance change`

when no stronger automated check exists.

## Bug And Blocker Gate

- `P0`
  - weekly queue state becomes contradictory, Child 11 is treated as unlocked before Child 10 completion, or Child 10 baseline leaves critical owner/bridge status undefined
  - Rule: stop and reconcile the baseline plus weekly queue before proceeding.
- `P1`
  - Child 10 drifts into production implementation decisions, or Child 11 scope remains open-ended after baseline work
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - wording cleanup, extra rationale, or optional artifact phrasing refinement outside the baseline unlock surface
  - Rule: may be deferred only if logged in `Progress Log`.

## Task 1: Reconcile Child 10 Scope Against Post-Child-9 State

**Files:**
- Read: `docs/superpowers/specs/2026-07-01-runtime-ownerization-review-spec.md`
- Read: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Read: `docs/superpowers/specs/2026-07-01-runtime-contract-hardening-spec.md`
- Read: `docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md`
- Read: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Modify: `docs/superpowers/plans/2026-07-01-runtime-ownerization-review-plan.md`

- [x] **Step 1: Confirm Child 10 remains a review child**

Record that Child 10 exists to freeze Child 11 boundaries and not to ownerize runtime code directly.

- [x] **Step 2: Confirm the runtime inventory is sufficient**

Record that the current runtime inventory is enough to support mod-first architecture and that Child 10 does not invent new top-level runtimes.

- [x] **Step 3: Confirm Child 11 target seams**

Record that Child 11 is primarily about shared dispatch convergence, interactive runtime ownerization, house runtime ownerization, and effect-settlement alignment.

### Task 1 Findings

- Child 10 remains a review/baseline child only; production ownerization stays deferred to Child 11.
- The current runtime inventory is sufficient for the approved mod-first direction; Child 10 does not invent any new top-level runtime.
- Child 11 is now frozen to four implementation targets only: shared dispatch convergence, interactive runtime ownerization, house runtime ownerization, and effect-settlement alignment.

## Task 2: Finalize Runtime / Contract / Adapter Baseline

**Files:**
- Modify: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`

- [x] **Step 1: Finalize runtime maturity classification**

Complete the runtime inventory so each promoted runtime is marked with explicit owner/bridge maturity and current production owner status.

- [x] **Step 2: Finalize contract freeze surface**

Complete the baseline sections that define which contract surfaces Child 11 may use but may not casually reopen.

- [x] **Step 3: Finalize bridge/adapter disposition**

Complete the baseline so each bridge or adapter is marked `remove`, `keep-through-Child-11`, or `defer-beyond-Child-11`, with a reason.

- [x] **Step 4: Finalize `src/main.ts` coupling audit**

Complete the baseline so Child 11 can distinguish browser-shell responsibilities from runtime responsibilities.

## Task 3: Finalize Child 11 Execution Controls

**Files:**
- Modify: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`

- [x] **Step 1: Finalize Child 11 execution boundary**

State which modules and seams Child 11 may change, and which adjacent concerns remain frozen.

- [x] **Step 2: Finalize Child 11 batch order and exit gates**

Define the implementation sequence Child 11 must follow and the per-batch completion signal for each stage.

- [x] **Step 3: Finalize Child 11 forbidden changes**

State which kinds of scope growth are prohibited unless the baseline and weekly plan are both revised first.

- [x] **Step 4: Finalize verification mapping and residual debt**

State the checks, example flows, retained bridges, and accepted residual debt that bound Child 11 execution.

## Task 4: Synchronize Weekly Queue Governance

**Files:**
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Modify: `docs/superpowers/plans/2026-07-01-runtime-ownerization-review-plan.md`

- [x] **Step 1: Record Child 10 as the post-Child-9 review child**

Update weekly status wording so Child 10 exists as a formal queued child rather than an implied future review.

- [x] **Step 2: Record Child 11 as the locked implementation child**

Update weekly queue wording so Child 11 is scheduled but cannot start until Child 10 baseline completion and Child 11 spec/plan authoring both occur.

- [x] **Step 3: Sync unlock wording**

Ensure the weekly plan, Child 10 baseline, and this plan use the same unlock condition for Child 11.

## Task 5: Child 10 Closeout

**Files:**
- Modify: `docs/superpowers/plans/2026-07-01-runtime-ownerization-review-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`

- [x] **Step 1: Record final Child 10 output**

Log the final baseline status, the Child 11 unlock decision, and any retained residual debt.

- [x] **Step 2: Run required verification**

Run:

```bash
npm run lint:plans
```

Expected:

- plan-governance checks pass
- Child 10/11 queue wording is structurally valid

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

