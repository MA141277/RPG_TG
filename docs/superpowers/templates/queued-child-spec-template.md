# Queued Child Spec

> **Purpose:** Use this template for a child that is approved as a candidate inside the current weekly set but is not yet executable. A queued child spec locks boundary and completion criteria early while leaving concrete implementation sequencing to the later active child plan.

## Basic Info

- Child: `Child X`
- Status: `queued`
- Parent weekly set: `docs/superpowers/plans/YYYY-MM-DD-weekly-orchestration-plan.md`
- Depends on: `Replace with the required predecessor child or none.`

## Primary Boundary

- This child only targets: `Replace with one runtime / seam / ownership boundary.`
- Do not mix with: `Replace with adjacent areas that must remain out of scope.`

## Problem Statement

- Current mixed / legacy / unclear ownership:
  - `Replace with the current problem.`
- Why this needs to be a separate child:
  - `Replace with the split justification.`

## Expected Outcome

- After this child:
  - `Replace with the covered path that becomes owned.`
  - `Replace with the residue that should disappear or shrink.`
  - `Replace with the boundary that becomes clearer or more formal.`

## Out Of Scope

- `Replace with the first excluded area.`
- `Replace with the second excluded area.`
- `Replace with the third excluded area.`

## Exit Conditions

- [ ] `Replace with exit condition 1.`
- [ ] `Replace with exit condition 2.`
- [ ] `Replace with exit condition 3.`

## Verification Story

- Primary verification focus:
  - `Replace with the main regression / contract / ownership proof.`
- Required checks:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Promotion Recheck

Before this child is promoted from `queued` to `active`, recheck:

- does the primary boundary still exist?
- did the previous child already absorb part of this scope?
- should this child stay `unchanged`, become `narrowed`, or be `superseded`?

Promotion result:

- `unchanged` / `narrowed` / `superseded`

## Notes

- Candidate risks:
  - `Replace with any risk worth rechecking before promotion.`
- Weekly artifacts to refresh before planning:
  - `weekly-review-index`
  - `weekly-module-map`
  - `weekly-call-flows`
  - `weekly-next-split-review`
  - `weekly-architecture-report`
