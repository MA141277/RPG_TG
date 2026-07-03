# Playable Runtime Migration Weekly Orchestration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute any promoted child task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pre-author a fresh weekly-set candidate queue for unified playable runtime migration without appending a new executable child into the currently active `main-shell-ownerization` weekly set.

**Architecture:** This is a different problem type from the current `src/main.ts` shell-ownerization queue. The playable runtime migration must therefore exist as its own fresh weekly orchestration candidate, with no active executable child yet, and with the migration split across multiple children so contract skeleton work, short-form migration, house-local promotion, battle-family migration, and enforcement closeout do not collapse into one oversized execution batch.

**Tech Stack:** Markdown governance docs, repository playable spec, plan governance spec, later TypeScript runtime/application/ui/content work, `npm run lint:plans`, child-plan verification commands after promotion.

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Candidate-only queue authoring. No playable-runtime child is executable while the current main-shell continuation weekly set still has an active child.`
- Next Step: `Wait for the current active weekly set to close, then run a fresh baseline recheck and promote Child 30 only if the playable-runtime scope remains unchanged or narrowed.`
- Verification: `npm run lint:plans`
- Notes: `This file records the next problem-type queue only. It must not be treated as authorization to start playable-runtime implementation before the current active weekly set closes.`

## Progress Log

- 2026-07-03
  - Summary: `Created a candidate-only weekly orchestration plan for unified playable runtime migration. The queue is intentionally split across multiple future children rather than one oversized migration child. No child is active yet because the current main-shell continuation weekly set still owns the active execution slot.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Keep this queue non-executable until the current active weekly set closes and a fresh baseline recheck promotes Child 30.`
- 2026-07-03
  - Summary: `Ran governance verification for the new playable-runtime candidate queue. Plan lint passed, so the queue record is structurally valid while remaining non-executable.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for the current active weekly set to close before any Child 30 promotion decision.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Plan governance spec:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Playable plan template:
  - `docs/superpowers/plans/_playable-plan-template.md`
- Current active weekly set that blocks promotion:
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The playable-runtime spec is approved and now includes integrationId, trigger-evaluation ownership, owner-session recovery, and validator/scaffold/CI enforcement boundaries.`
  - `Current repository playable-like surfaces remain split across interactive-runtime-owned covered paths, house-local mechanisms, and battle-adjacent flow ownership, so the problem still exists as a real migration queue.`
  - `This queue remains candidate-only because Child 27 is still the active executable child in the current weekly set.`

## Weekly Scope

### In Scope

- one future playable-runtime migration queue
- phased child decomposition for contract skeleton, covered migration, house-local promotion, battle-family migration, and enforcement closeout
- promotion order and boundary discipline for future playable-runtime execution

### Out Of Scope

- reopening the currently active `main-shell-ownerization` weekly set
- promoting a playable-runtime child while another weekly set still has an active executable child
- collapsing all playable migration work into one child
- unrelated `main.ts` shell cleanup
- unrelated mod-first/runtime-roadmap continuation outside the playable contract boundary

## Queue

Keep the visible queue intentionally shallow. Recommended maximum after this queue becomes active:

- one `active child`
- one `queued child`
- one `locked child`

Status meaning:

- `active`: executable now, must have a promoted child plan and current baseline truth
- `queued`: next promotion candidate after the current active child closes
- `locked`: recorded in this set but not yet the next promotion candidate
- `candidate-only`: named future work that is not yet visible queue depth
- `completed`: closed inside this set and kept only as history

### Slot 1: Active Child

- Child: `None currently`
- Queue status: `queued`
- Primary boundary: `No playable-runtime child is active yet because the current active execution slot is still owned by the 2026-07-03 main-shell continuation weekly set.`
- Depends on: `Current active weekly set closes with no unresolved P0/P1 that block later queue opening.`
- Resume point: `Promote Child 30 only after a fresh baseline recheck confirms unchanged or narrowed scope.`

### Slot 2: Queued Child

- `Child 30 - Playable Runtime Skeleton And Integration Registry`
  - Planned boundary:
    - install one unified playable definition registry
    - install one integration-instance identity seam centered on `integrationId`
    - normalize launch/session/settlement/handoff contracts through the playable runtime shell
    - add the minimum trigger-evaluation seam and validation seam needed for later migrations
  - Promotion rule: `Promote only after the current active weekly set closes and this child baseline recheck records unchanged or narrowed scope.`
  - Queue state: `queued; non-executable until fresh weekly promotion`

### Slot 3: Locked Child

- `Child 31 - Covered Interactive Playables Migration`
  - Planned boundary:
    - migrate `activity-qte`
    - migrate `city-begging`
    - preserve covered user-visible behavior while moving launch/session/presenter/result/settlement onto the Child 30 skeleton
  - Promotion rule: `Promote only after Child 30 closes with no unresolved P0/P1 in playable-runtime scope.`
  - Queue state: `locked; non-executable until Child 30 closes`

## Candidate Later Work

These remain candidate-only and are not executable in the current queue phase:

- `Child 32 - House-Local Mechanic Promotion`
  - promote `grain-accounting` and `medicine-compounding` from house-local mechanisms to full playable definitions
- `Child 33 - Battle-Family Playable Migration`
  - migrate `story-battle` into the unified playable registry/runtime while preserving `family: "battle"` semantics
- `Child 34 - Enforcement And Legacy Path Closeout`
  - add scaffold/validator/CI enforcement, tighten regression coverage, and delete proven-obsolete direct launch/result branches

## Child Decomposition Rule

The playable-runtime queue must remain phased. Do not merge these children back into one “big migration” plan.

Required phase intent:

1. `Child 30`
   - establish the shared runtime skeleton and integration identity seam first
2. `Child 31`
   - prove the skeleton with the already-runtime-adjacent short-form playables
3. `Child 32`
   - promote house-local mechanics only after the shared shell already exists
4. `Child 33`
   - move `story-battle` only after minigame-family migration proves the top-level shell
5. `Child 34`
   - tighten enforcement and remove obsolete legacy residue only after migrated paths are stable

## Promotion Rule

When this queue is eventually opened for execution:

1. confirm the currently active weekly set is closed
2. run a fresh baseline recheck against the latest code and docs
3. record one result for Child 30:
   - `unchanged`
   - `narrowed`
   - `superseded`
4. only if Child 30 is `unchanged` or `narrowed` may it be promoted to `active`
5. only after Child 30 closes may Child 31 become the next visible executable child
6. do not promote Child 32, Child 33, or Child 34 into the visible queue in the same batch that opens Child 30

If any child becomes `superseded`, do not auto-create a replacement child in the same work batch.

## Close Rule

This weekly set may be marked `completed` only when:

- the active executable child is closed
- the visible queued and locked children are either completed, explicitly deferred, or moved into a later fresh weekly cycle
- the latest `Progress Log` records the next allowed continuation state
- no unresolved `P0` or `P1` remains in the playable-runtime scope

## Weekly Deliverables

- [x] A fresh playable-runtime weekly orchestration candidate exists
- [x] The queue is split across multiple children instead of one oversized migration child
- [x] Child 30 is defined as the next future promotion candidate
- [x] Child 31 is defined as the locked follow-up
- [x] Later candidate-only children are recorded without becoming executable
- [x] The plan explicitly forbids appending these children into the currently active weekly set

## Verification Policy

- This candidate-only weekly plan is a doc-only governance artifact for now.
- Required runtime/type/test/build verification belongs to the child plan that is eventually promoted.
- This file should at minimum pass `npm run lint:plans`.

## Task 1: Record The Candidate Queue Without Opening Execution

**Files:**
- Modify: `docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md`
- Read: `docs/superpowers/specs/2026-07-03-unified-playable-runtime-contract-spec.md`
- Read: `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`

- [x] **Step 1: Confirm the current active weekly set blocks playable promotion**

Record that playable-runtime work is a different problem type and must not be appended into the currently active weekly set.

- [x] **Step 2: Split the future playable-runtime queue across multiple children**

Record one queued child, one locked child, and additional candidate-only later children.

- [x] **Step 3: Keep the queue non-executable until a fresh promotion point exists**

Do not author this file as an active implementation queue yet.

- [x] **Step 4: Run plan lint after adding the candidate queue**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

## Exit Check

- [x] The playable-runtime queue exists as a fresh weekly-set candidate rather than a new child appended into the wrong active set.
- [x] The migration is explicitly phased across multiple children.
- [x] No playable-runtime child is accidentally marked executable yet.
- [x] The next legal promotion point is explicit.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
