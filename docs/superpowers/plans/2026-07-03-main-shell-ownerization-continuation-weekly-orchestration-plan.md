# Main Shell Ownerization Continuation Weekly Orchestration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Control the post-Child-24 continuation queue that moves `src/main.ts` toward a pure shell without reopening the closed Child 24 set or allowing unbounded queue growth.

**Architecture:** This weekly set governs a bounded continuation queue rather than a general-purpose `main.ts` cleanup stream. The shell boundary is fixed first, then remaining non-shell responsibilities are promoted in order: navigation/time follow-up, render purity, startup story bootstrap, active content ownership, and legacy startup seam retirement.

**Tech Stack:** Markdown governance artifacts, TypeScript repository tasks, `npm run lint:plans`, `npm run typecheck`, `npm run build`

## Execution State

- Status: `in-progress`
- Last Updated: `2026-07-03`
- Current Focus: `Child 25 is the only active executable child in the continuation queue.`
- Next Step: `Execute Child 25 baseline recheck and begin Task 1 Step 1 in the active child plan.`
- Verification: `Not run as part of this doc-only change`
- Notes: `This queue follows the closed Child 24 set and must not be appended back into the already-completed 2026-07-03 main-runtime ownerization weekly set.`

## Progress Log

- 2026-07-03
  - Summary: `Opened a fresh continuation weekly set after the closed Child 24 queue. Child 25 is active, Child 26 is the immediate queued follow-up, Child 27 is locked, and Child 28-29 remain candidate-only.`
  - Verification: `Not run as part of this doc-only change.`
  - Next: `Start Child 25 Task 1 Step 1.`

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

- `Child 25 - Navigation Time Follow-Up De-Shell`
  - Plan: `docs/superpowers/plans/2026-07-03-child-25-navigation-time-follow-up-de-shell-plan.md`
  - Baseline Recheck: `unchanged`

### Immediate Queued Follow-Up

- `Child 26 - Render Purity Contract`
  - Plan: `docs/superpowers/plans/2026-07-03-child-26-render-purity-contract-plan.md`
  - Promotion Rule: `Promote only after Child 25 closes with no unresolved P0/P1 in scope.`

### Locked Follow-Up Child

- `Child 27 - Startup Story Bootstrap Ownership`
  - Plan: `docs/superpowers/plans/2026-07-03-child-27-startup-story-bootstrap-ownership-plan.md`
  - Promotion Rule: `Promote only after Child 26 baseline recheck confirms unchanged or narrowed scope.`

## Candidate Later Work

- `Child 28 - Active Content Ownership Convergence`
  - Plan: `docs/superpowers/plans/2026-07-03-child-28-active-content-ownership-convergence-plan.md`
- `Child 29 - Legacy Startup Seam Retirement`
  - Plan: `docs/superpowers/plans/2026-07-03-child-29-legacy-startup-seam-retirement-plan.md`

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

- [ ] **Step 1: Keep Child 25 as the only active executable child**

Do not promote another child while Child 25 remains active.

- [ ] **Step 2: Recheck queue state after each completed work batch**

Update `Execution State`, `Progress Log`, and queue labels after each child milestone.

- [ ] **Step 3: Run plan lint after material queue restructuring**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

## Exit Check

- [ ] Active child state is accurate.
- [ ] Immediate queued follow-up state is accurate.
- [ ] Locked follow-up state is accurate.
- [ ] Queue close or continuation rule is recorded.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
