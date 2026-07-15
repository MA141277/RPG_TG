# Main Shell Ownerization Continuation Weekly Orchestration Plan

> **Historical Artifact:** Deprecated under `fail-closed progress-driven governance`. This file records the retired weekly-governance model and must not be used as the active resume entry for new work.


> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Control the post-Child-24 continuation queue that moves `src/main.ts` toward a pure shell without reopening the closed Child 24 set or allowing unbounded queue growth.

**Architecture:** This weekly set governs a bounded continuation queue rather than a general-purpose `main.ts` cleanup stream. The shell boundary is fixed first, then remaining non-shell responsibilities are promoted in order: navigation/time follow-up, render purity, startup story bootstrap, active content ownership, and legacy startup seam retirement.

**Tech Stack:** Markdown governance artifacts, TypeScript repository tasks, `npm run lint:plans`, `npm run typecheck`, `npm run build`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `This bounded continuation weekly set is closed after Child 29 completion. No additional executable child remains in queue.`
- Next Step: `Require a fresh weekly review before any new continuation child is introduced.`
- Verification: `Child 29 closeout passed: npm run typecheck; npm run build; npm run lint:plans; npm test -- --test-name-pattern="child 22|child 23|child 27|child 28|child 29".`
- Notes: `This queue follows the closed Child 24 set and must not be appended back into the already-completed 2026-07-03 main-runtime ownerization weekly set.`

## Progress Log

- 2026-07-03
  - Summary: `Opened a fresh continuation weekly set after the closed Child 24 queue. Child 25 is active, Child 26 is the immediate queued follow-up, Child 27 is locked, and Child 28-29 remain candidate-only.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Start Child 25 Task 1 Step 1.`
- 2026-07-03
  - Summary: `Synced Child 25 baseline recheck: scope remains unchanged, and the active debt is still the shell-owned navigation/time follow-up in main.ts. Queue state is unchanged: Child 25 active, Child 26 queued, Child 27 locked, Child 28-29 candidate-only.`
  - Verification: `Baseline inspection only; required commands not run yet.`
  - Next: `Continue Child 25 Task 1 Step 2 without promoting another child.`
- 2026-07-03
  - Summary: `Child 25 closed without promoting another child. The covered navigation/time follow-up is now owned by the narrow outcome-driven follow-up contract, Child 26 remains the immediate queued follow-up, Child 27 remains locked, and Child 28-29 remain candidate-only.`
  - Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 15|child 16|child 25"`.
  - Next: `Wait for a later explicit continuation request before baseline-rechecking and promoting Child 26.`
- 2026-07-03
  - Summary: `Continuation was explicitly requested, so Child 26 was baseline-rechecked and promoted. Result is narrowed rather than superseded: render-owned passive indoor-screen trigger execution remains the active debt, Child 27 becomes the immediate queued follow-up, Child 28 becomes the locked follow-up, and Child 29 stays candidate-only.`
  - Verification: `Baseline inspection only; Child 26 required commands not run yet.`
  - Next: `Execute Child 26 Task 1 Step 2 without promoting Child 27.`
- 2026-07-03
  - Summary: `Child 26 closed. Passive indoor-screen follow-up now belongs to an explicit narrow helper used by house-runtime and post-scene settlement, renderApp() is display-only for this contract, Child 27 becomes the next executable child, Child 28 stays locked, and Child 29 stays candidate-only.`
  - Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 16|child 23|child 24|child 25|child 26"`.
  - Next: `Wait for a later explicit continuation request before baseline-rechecking and promoting Child 27.`
- 2026-07-03
  - Summary: `Continuation was explicitly requested again, so Child 27 was baseline-rechecked and promoted. Scope remains unchanged: startup story bootstrap still starts directly inside main.ts builder helpers for scenario-pack and haozhou-return startup paths; Child 28 stays locked and Child 29 stays candidate-only.`
  - Verification: `Baseline inspection only; Child 27 required commands not run yet.`
  - Next: `Execute Child 27 Task 1 Step 2 without promoting Child 28.`
- 2026-07-03
  - Summary: `Child 27 implementation batch moved startup story bootstrap composition into the startup coordinator output seam through a narrow helper. main.ts startup builders now return base state only, while Child 28 remains locked pending Child 27 full verification.`
  - Verification: `npm test -- --test-name-pattern="child 23|child 27"`.
  - Next: `Run Child 27 closeout verification before updating queue state again.`
- 2026-07-03
  - Summary: `Child 27 closed cleanly. Startup story bootstrap no longer starts directly inside main.ts startup builders, Child 28 becomes the next executable child for a later continuation request, and Child 29 remains locked behind Child 28 baseline recheck.`
  - Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 22|child 23|child 24|child 25|child 26|child 27"`.
  - Next: `Do not execute Child 28 in this batch; wait for explicit continuation before its baseline recheck and promotion.`
- 2026-07-03
  - Summary: `Continuation was explicitly requested again, so Child 28 was baseline-rechecked and promoted. Scope remains unchanged: main.ts still owns syncActiveGameContent(), the active-definition top-level write set, and activated-content-source write-back; Child 29 remains locked and non-executable.`
  - Verification: `Baseline inspection only; Child 28 required commands not run yet.`
  - Next: `Execute Child 28 Task 1 Step 2 without promoting Child 29.`
- 2026-07-03
  - Summary: `Child 28 RED regressions are in place. The expected failures confirm the current debt remains unchanged: contentContext is not yet carried by startup sessions, startup apply still routes through syncActivatedContentSource(), and main.ts still keeps the active-content mirror write set.`
  - Verification: `npm test -- --test-name-pattern="child 23|child 27|child 28"` (expected Child 28 failures).
  - Next: `Implement Child 28 without promoting Child 29.`
- 2026-07-03
  - Summary: `Child 28 implementation batch moved active content ownership behind an explicit contentContext seam. startup-session-coordinator now emits contentContext, main-runtime-orchestrator applies it before createAppState(), and main.ts now consumes content context instead of synchronizing central active-definition mirrors.`
  - Verification: `npm test -- --test-name-pattern="child 23|child 27|child 28"`.
  - Next: `Run Child 28 closeout verification before updating queue state again.`
- 2026-07-03
  - Summary: `Child 28 closed cleanly. Active content composition is now startup/mod-owned through contentContext, Child 29 becomes the next executable child for a later continuation request, and no further locked child is introduced in this batch.`
  - Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 22|child 23|child 24|child 25|child 26|child 27|child 28"`.
  - Next: `Do not execute Child 29 in this batch; wait for explicit continuation before its baseline recheck and promotion.`
- 2026-07-03
  - Summary: `Continuation was explicitly requested again, so Child 29 was baseline-rechecked and promoted. Scope remains unchanged: src/main.ts still routes primary startup through legacy-main-adapter and mod-runtime-main-adapter residue, and no additional locked child is introduced behind Child 29.`
  - Verification: `Baseline inspection only; Child 29 required commands not run yet.`
  - Next: `Execute Child 29 Task 1 Step 2 without adding any new continuation child.`
- 2026-07-03
  - Summary: `Child 29 implementation batch removed the primary-path legacy startup seam. main.ts no longer imports or calls the legacy startup adapters, builtin startup initializes through the existing ModActivationResult/contentContext contract, and the legacy adapter files were retired instead of being converted into a new shared orchestrator sink.`
  - Verification: `npm test -- --test-name-pattern="child 29".`
  - Next: `Run Child 29 closeout verification before closing the weekly continuation queue.`
- 2026-07-03
  - Summary: `Child 29 closed cleanly with no in-scope P0/P1 findings, so this bounded continuation weekly queue is complete. No immediate queued or locked child remains; any further shell-continuation work now requires a fresh weekly review instead of auto-promotion.`
  - Verification: `npm run typecheck`; `npm run build`; `npm run lint:plans`; `npm test -- --test-name-pattern="child 22|child 23|child 27|child 28|child 29"`.
  - Next: `Stop execution for this weekly set. Do not auto-spawn a new continuation child.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-main-shell-ownerization-continuation-spec.md`
- Prior closed weekly set:
  - `docs/superpowers/plans/2026-07-03-main-runtime-ownerization-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `Child 24 already extracted the first main-runtime orchestration seam and closed its own weekly set.`
  - `Remaining continuation debt should now be handled as separate child problem types rather than reopening Child 24 scope.`

## Weekly Scope

### In Scope

- one active continuation child
- one immediate queued follow-up child
- one locked follow-up child
- bounded governance for later candidate-only continuation work

### Out Of Scope

- reopening Child 24
- broad presenter/render redesign
- general house runtime redesign
- manifest/contribution-registry expansion
- speculative queue growth beyond controlled depth

## Queue

### Active Executable Child

- `Child 29 - Legacy Startup Seam Retirement`
  - Plan: `docs/superpowers/plans/2026-07-03-child-29-legacy-startup-seam-retirement-plan.md`
  - Baseline Recheck: `unchanged`
  - Status: `completed in this batch; no further execution allowed here`

### Immediate Queued Follow-Up

- `None currently`
  - Promotion Rule: `This weekly set is closed. Any future continuation requires a fresh weekly review rather than queue carry-over.`
  - Queue State: `empty`

### Locked Follow-Up Child

- `None currently`
  - Promotion Rule: `Do not add a new locked child in this batch; later continuation requires a fresh weekly review if more queue depth is needed.`

## Candidate Later Work

These remain candidate-only and are not executable in the current queue phase.

## Promotion Rule

- Only one child may be executable at a time.
- A queued child must not start implementation before:
  - the current active child is closed
  - baseline recheck is recorded
  - queue state is updated in this weekly plan
- If the next child is found to be `superseded`, do not auto-spawn a replacement child in the same batch.
- If unresolved `P0` exists in the active child scope, block promotion of all lower-priority children.
- If unresolved `P1` exists in the active child scope, do not mark the child `completed` and do not promote the next child until queue state is explicitly revised.

## Close Rule

This weekly set may be marked `completed` only when:

- the active executable child is closed
- the immediate queued follow-up is either promoted into a later cycle or explicitly deferred with reason
- locked and candidate work remain clearly non-executable
- the latest `Progress Log` records the next allowed executable child or the requirement for a fresh weekly review before continuation

## Task 1: Govern The Continuation Queue

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`
- Read: `docs/superpowers/specs/2026-07-03-main-shell-ownerization-continuation-spec.md`

- [x] **Step 1: Keep Child 25 as the only active executable child**

Do not promote another child while Child 25 remains active.

- [x] **Step 2: Recheck queue state after each completed work batch**

Update `Execution State`, `Progress Log`, and queue labels after each child milestone.

- [x] **Step 3: Run plan lint after material queue restructuring**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

## Exit Check

- [x] Active child state is accurate.
- [x] Immediate queued follow-up state is accurate.
- [x] Locked follow-up state is accurate.
- [x] Queue close or continuation rule is recorded.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

