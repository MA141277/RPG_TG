# Playable Runtime Migration Weekly Orchestration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute any promoted child task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Drive the phased playable-runtime migration queue from the Child 30 skeleton into later covered/house-local/battle/enforcement children without appending this problem type back into the old `main-shell-ownerization` weekly set.

**Architecture:** The playable-runtime migration remains a separate problem type from the prior `src/main.ts` shell-ownerization queue. It stayed split across multiple children so contract skeleton work, short-form covered migration, house-local promotion, battle-family migration, and enforcement closeout did not collapse into one oversized execution batch. Child 30 through Child 34 are now completed implementation proofs, and this weekly set is closed as history.

**Tech Stack:** Markdown governance docs, repository playable spec, plan governance spec, later TypeScript runtime/application/ui/content work, `npm run lint:plans`, child-plan verification commands after promotion.

## Execution State

- Status: `completed`
- Last Updated: `2026-07-03`
- Current Focus: `History only. Child 30 through Child 34 are completed and the first playable-runtime migration queue is closed.`
- Next Step: `If later playable work reopens this problem type, start a fresh weekly cycle instead of appending to this closed set.`
- Verification: `npm run validate:playables`, `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
- Notes: `Child 34 landed the repository-owned scaffold/validator/CI gate and narrowed legacy cleanup to the single obsolete interactive launch helper, while leaving still-live compatibility action ids explicit.`

## Progress Log

- 2026-07-03
  - Summary: `Created a candidate-only weekly orchestration plan for unified playable runtime migration. The queue is intentionally split across multiple future children rather than one oversized migration child. No child is active yet because the current main-shell continuation weekly set still owns the active execution slot.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Keep this queue non-executable until the current active weekly set closes and a fresh baseline recheck promotes Child 30.`
- 2026-07-03
  - Summary: `Ran governance verification for the new playable-runtime candidate queue. Plan lint passed, so the queue record is structurally valid while remaining non-executable.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for the current active weekly set to close before any Child 30 promotion decision.`
- 2026-07-03
  - Summary: `Pre-authored Child 30 through Child 34 as independent future plan files and linked them into the candidate queue without promoting any of them into active execution. The queue remains non-executable while the current main-shell continuation weekly set is still active.`
  - Verification: `npm run lint:plans`
  - Next: `Keep all playable-runtime children non-executable until the current active weekly set closes and Child 30 receives a fresh baseline recheck.`
- 2026-07-03
  - Summary: `The blocking weekly set is now closed, so Child 30 was baseline-rechecked, promoted, and completed. The repository now has a shared playable contract family, builtin playable definition/integration registries, a launch-normalization runtime seam, and interactive-runtime compatibility wiring. Concrete covered playable migration remains deferred to Child 31.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
  - Next: `Keep Child 31 non-executable until a fresh baseline recheck explicitly promotes it.`
- 2026-07-03
  - Summary: `Child 31 was baseline-rechecked, promoted, and completed. Activity-qte and city-begging now run through playable-runtime-owned lifecycle handlers with a shared playableSession carrier, while interactive-runtime remains only as a compatibility adapter for covered action ids.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
  - Next: `Keep Child 32 non-executable until a fresh baseline recheck explicitly promotes it.`
- 2026-07-03
  - Summary: `Child 32 was baseline-rechecked, promoted, and completed. Grain-accounting and medicine-compounding now launch and settle through shared playable-runtime house integrations, while their host house modules remain only as trigger/return owners and house-session shells.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
  - Next: `Keep Child 33 non-executable until a fresh baseline recheck explicitly promotes it.`
- 2026-07-03
  - Summary: `Child 33 was baseline-rechecked, promoted, and completed. Story-battle now launches with a shared battle-family playable session, settles through playable-runtime, and leaves interactive-runtime only as a compatibility delegation layer for legacy story-battle action ids.`
  - Verification: `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
  - Next: `Keep Child 34 candidate-only until a fresh enforcement/legacy closeout recheck explicitly promotes it.`
- 2026-07-03
  - Summary: `Child 34 was baseline-rechecked, narrowed, promoted, and completed. The repository now owns playable scaffolding, integration scaffolding, fail-closed playable validation, and a CI gate, while legacy cleanup stayed conservative and removed only the obsolete interactive launch helper.`
  - Verification: `npm run validate:playables`, `npm run lint:plans`, `npm run typecheck`, `npm test`, `npm run build`
  - Next: `Weekly set closed. Any later playable migration or expansion should open a fresh queue.`

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
  - `That original baseline justified promoting Child 30 once the prior weekly set closed. After Child 33 closeout, the only remaining child is Child 34 and it still requires its own fresh recheck before any enforcement batch begins.`

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

### Slot 1: Active / Most Recent Child

- Child: `Child 34 - Enforcement And Legacy Path Closeout`
- Plan: `docs/superpowers/plans/2026-07-03-child-34-playable-enforcement-and-legacy-closeout-plan.md`
- Queue status: `completed`
- Primary boundary: `Landed playable scaffold/validator/CI enforcement and removed only the obsolete interactive launch helper while keeping still-live compatibility action seams explicit.`
- Depends on: `Fresh baseline recheck after Child 33 closeout.`
- Resume point: `History only. Do not reopen this closed queue for later playable expansion work.`

## Candidate Later Work

None in this weekly set. Child 34 is completed and the queue is closed.

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

For each future promotion inside this queue:

1. confirm the currently active child is closed and no other weekly set owns the execution slot
2. run a fresh baseline recheck against the latest code and docs for the next queued child
3. record one result for that child:
   - `unchanged`
   - `narrowed`
   - `superseded`
4. only if the child is `unchanged` or `narrowed` may it be promoted to `active`
5. only after the active child closes may the next recorded queued child become the new promotion candidate
6. do not promote deeper locked or candidate-only children into the visible queue in the same batch that promotes the next queued child

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
- [x] Child 30 through Child 34 have independent future plan files
- [x] The plan explicitly forbids appending these children into the currently active weekly set
- [x] Child 30 was promoted only after the prior weekly set closed and a fresh baseline recheck stayed unchanged
- [x] Child 30 completed without auto-promoting Child 32-34 into the visible queue
- [x] Child 31 was promoted only after Child 30 closeout and a fresh baseline recheck narrowed the remaining scope
- [x] Child 31 completed without auto-opening Child 34 into the visible queue
- [x] Child 32 was promoted only after Child 31 closeout and a fresh baseline recheck narrowed the remaining house-local scope
- [x] Child 32 completed without auto-opening Child 34 into the visible queue
- [x] Child 33 was promoted only after Child 32 closeout and a fresh baseline recheck narrowed the remaining battle-family scope
- [x] Child 33 completed without auto-promoting Child 34 into an active implementation batch
- [x] Child 34 was promoted only after Child 33 closeout and a fresh baseline recheck narrowed the remaining enforcement and safe-legacy-cleanup scope
- [x] Child 34 completed and closed the first playable-runtime weekly queue without pretending still-live compatibility action ids were already removable

## Verification Policy

- This weekly plan is a governance artifact; runtime/type/test/build verification is recorded on the promoted child plan that executed.
- Child 30 verification has passed: `npm run typecheck`, `npm test`, `npm run build`, and `npm run lint:plans`.
- Child 31 verification has passed: `npm run typecheck`, `npm test`, `npm run build`, and `npm run lint:plans`.
- Child 32 verification has passed: `npm run typecheck`, `npm test`, `npm run build`, and `npm run lint:plans`.
- Child 33 verification has passed: `npm run typecheck`, `npm test`, `npm run build`, and `npm run lint:plans`.
- Child 34 verification has passed: `npm run validate:playables`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run lint:plans`.
- Future promoted children must record their own verification without treating Child 30 results as a blanket waiver.

## Task 1: Record And Govern The Queue Opening Through Child 30

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
- [x] Child 30 was promoted only after the blocking weekly set closed and a fresh baseline recheck stayed unchanged.
- [x] The next legal promotion point after Child 30 is explicit.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
