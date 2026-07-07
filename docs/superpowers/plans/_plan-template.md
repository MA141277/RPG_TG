# Plan Title

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this line with the concrete child outcome.

**Architecture:** Replace this line with the target boundary, constraints, and why this child exists separately.

**Tech Stack:** Replace this line with the relevant stack, commands, and verification tools.

## Execution State

- Status: `waiting`
- Last Updated: `2000-01-01`
- Current Focus: `Waiting for promotion or start.`
- Next Step: `Open docs/superpowers/project-progress.md and confirm this child is executable.`
- Verification: `Not run`
- Notes: `Use waiting/running/blocked/completed-but-open/closed for new plans.`

## Progress Log

- 2000-01-01
  - Summary: `Plan created.`
  - Verification: `Not run`
  - Next: `Open docs/superpowers/project-progress.md before starting implementation.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/...`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Replace with what changed since the spec was written.`
  - `Replace with any scope narrowing decided before execution starts.`

## Implementation Scope

### In Scope

- Replace with the concrete boundary work this child owns.

### Still Out Of Scope

- Replace with adjacent areas that must stay outside this child.

## File Map

### Existing files to modify

- `path/to/file`
  - Why it changes.

### Existing files expected to be deleted

- `path/to/file`

### New files to create

- `path/to/file`
  - Why it exists.

## Verification Plan

- Targeted verification:
  - `Replace with the primary regression / contract / ownership proof.`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Replace With Real Task Name

**Files:**
- Modify: `path/to/file`
- Read: `path/to/related-file`

- [ ] **Step 1: Replace with concrete step**

Describe the exact implementation action.

- [ ] **Step 2: Sync progress and governance state**

Update the child plan and any required owner docs so the next resume point remains explicit.

- [ ] **Step 3: Add the verification step**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- `PASS`

## Exit Check

- [ ] `Exit condition 1 from the child spec is satisfied.`
- [ ] `Exit condition 2 from the child spec is satisfied.`
- [ ] `Exit condition 3 from the child spec is satisfied.`
- [ ] Project progress sync is updated if the child state changed.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when closing.`
- Parent Stage: `Replace when closing.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`

`Push Commit` must point to a commit message that uses `<type>: <brief title>` plus a `Summary:` section with at least one bullet.
