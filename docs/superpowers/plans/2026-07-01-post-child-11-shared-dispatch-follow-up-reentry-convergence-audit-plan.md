# Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit all remaining post-Child-11 covered runtime-owned follow-up and reentry paths, classify them into Bucket A/B/C, and converge every Bucket A path through shared dispatch in one child.

**Architecture:** Child 13 starts only after Child 11 completes validly and Child 12 closes as the UI layout/interface-reserve unlock child. It first classifies all remaining follow-up/reentry paths across the already-approved runtime family, then lands every Bucket A convergence path in the same child while explicitly recording any Bucket B Child-11-backfill findings or Bucket C new-boundary follow-ups. The child is a convergence audit, not a silent Child 11 extension and not a new contract-design child.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), Vite build, current runtime dispatch/router/interactive/house/settlement seams, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Child 13 is completed. The remaining in-scope post-Child-11 Bucket A path was the story-battle action -> reenter-house follow-up still branched inline in src/main.ts, and that path now converges through houseRuntime.applyInteractiveFollowUp() under the shared dispatch line.`
- Next Step: `Do not resume Child 13. Any later runtime continuation work now requires a fresh weekly review plus new spec/plan authoring rather than another same-type Bucket A follow-up child.`
- Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `Classification record: Bucket A = the remaining covered story-battle action -> reenter-house follow-up in dispatchCurrentStoryBattleAction(), where main.ts still owned the inline reentry branch before this child. Bucket B = none discovered in the remaining post-Child-11 covered-path audit. Bucket C = none discovered in the remaining post-Child-11 follow-up/reentry audit; direct launch or browser-entry flows remain outside Child 13 because they are not same-type runtime-owned follow-up/reentry continuations.`

## Progress Log

- 2026-07-01
  - Summary: `Plan created as the locked Child 13 follow-up behind the Child 12 UI layout/interface-reserve child.`
  - Verification: `npm run lint:plans`
  - Next: `Wait for Child 11 completion, Child 12 closeout, and a weekly unlock review before starting Task 1 Step 1.`
- 2026-07-02
  - Summary: `Child 12 closeout and weekly governance sync are complete. Child 13 is now unlocked as the next executable child, but remains not-started until resumed from this plan.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1 from this plan when implementation resumes.`
- 2026-07-02
  - Summary: `Completed Child 13. The remaining post-Child-11 covered-path audit found one Bucket A path: the story-battle action -> reenter-house follow-up still handled inline in src/main.ts after dispatch returned. No Bucket B Child-11-backfill issue and no Bucket C new-boundary follow-up was discovered in the remaining in-scope audit. Child 13 added red-to-green regression coverage, moved the reentry handling behind houseRuntime.applyInteractiveFollowUp(), and synchronized weekly closeout state.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `No active queued child remains in the current weekly set; require a fresh weekly review before authoring any later continuation child.`

---

## Source Documents

- Child 13 spec: `docs/superpowers/specs/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-spec.md`
- Child 11 implementation spec: `docs/superpowers/specs/2026-07-01-sub-runtime-ownerization-implementation-spec.md`
- Child 11 implementation plan: `docs/superpowers/plans/2026-07-01-sub-runtime-ownerization-implementation-plan.md`
- Child 10 ownerization baseline: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Child 10 review spec: `docs/superpowers/specs/2026-07-01-runtime-ownerization-review-spec.md`
- Weekly controller: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Plan governance: `docs/superpowers/specs/plan-governance-spec.md`

## Parent Alignment

- This file is `Child Plan 13` in the weekly queue.
- Primary subsystem boundary:
  - `Shared dispatch convergence`
  - `Runtime-owned follow-up / reentry convergence audit`
- Secondary subsystem relationships:
  - must start only after Child 11 validly completes
  - must remain locked until Child 12 completes as the UI layout/interface-reserve child
  - must not reopen Child 9/10/11 contract and baseline scope
- Queue rule:
  - Child 13 is not executable until Child 11 and Child 12 complete and a later weekly review explicitly unlocks Child 13.

## Scope

This child plan includes:

- remaining post-Child-11 follow-up and reentry path audit
- explicit Bucket A / Bucket B / Bucket C classification
- all Bucket A shared dispatch convergence work in one child
- minimal `src/main.ts` shell-branch reduction for Bucket A paths
- minimum runtime support alignment in `runtime-dispatch`, `runtime-router`, `interactive-runtime`, `house-runtime`, and `runtime-settlement`
- regression tests covering classification targets and converged follow-up/reentry behavior
- required weekly/governance closeout sync

This child plan does not include:

- Child 11 primary-path backfill by default
- new runtime families or new public contract families
- boot/mod/save/presenter/UI/layout/resource work
- `RuntimeState` carrier redesign
- Child 12 UI contract reserve implementation

## File Map

### Existing files to modify

- `src/main.ts`
  - Remove remaining shell-owned Bucket A follow-up and reentry branching.
- `src/core/runtime/runtime-dispatch.ts`
  - Support converged Bucket A follow-up and reentry flow through shared dispatch.
- `src/core/runtime/runtime-router.ts`
  - Route any remaining Bucket A request shapes on the approved runtime family.
- `src/core/runtime/interactive-runtime.ts`
  - Align runtime-owned follow-up and reentry behavior where Child 13 convergence requires it.
- `src/core/runtime/house-runtime.ts`
  - Align house-runtime reentry/follow-up ownership where Child 13 convergence requires it.
- `src/core/runtime/runtime-settlement.ts`
  - Keep settlement aligned with the converged shared-dispatch path.
- `tests/robustness.test.cjs`
  - Add failing then passing coverage for the classified Bucket A follow-up/reentry paths.
- `docs/change-log.md`
  - Record the Child 13 convergence landing once execution completes.

### Governance files to modify

- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Record Child 13 execution and closeout state.
- `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
  - Keep queued-child wording synchronized.
- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
  - Record Child 13 queue and later closeout state.
- `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
  - Record Child 13 queue and convergence boundary updates.
- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
  - Record the Child 11 closeout to Child 13 unlock flow and any landed real convergence flow.
- `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
  - Record Child 13 as the locked runtime follow-up unlocked by Child 12 closeout.
- `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`
  - Keep the approved-target queue and convergence narrative synchronized.

## Verification Gate

Do not mark Child 13 complete until all of these have passed:

- `npm run build:test`
- `node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans`

## Task 1: Audit And Classify Remaining Paths

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `src/main.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/runtime-router.ts`
- Read: `src/core/runtime/interactive-runtime.ts`
- Read: `src/core/runtime/house-runtime.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Read: `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- Read: `docs/superpowers/specs/2026-07-01-sub-runtime-ownerization-implementation-spec.md`

- [x] **Step 1: Enumerate all remaining post-Child-11 follow-up and reentry paths**

Write an explicit audit list that names each remaining path and its current owner.

- [x] **Step 2: Write failing classification-driven regression coverage**

Add targeted tests in `tests/robustness.test.cjs` that expose the expected Child 13 Bucket A convergence targets and protect against silent Bucket B/C absorption.

- [x] **Step 3: Run the targeted red tests**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"`
Expected: `FAIL` on at least one named remaining Bucket A convergence target before implementation.

- [x] **Step 4: Record Bucket A, Bucket B, and Bucket C explicitly in the child plan log**

Update this plan's `Progress Log` and `Execution State` notes so later batches have one explicit source of truth for the classification result.

## Task 2: Converge Every Bucket A Path Under Shared Dispatch

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Route the first Bucket A path through shared dispatch**

Implement the minimum production change so the first classified Bucket A follow-up or reentry path no longer remains shell-owned in `src/main.ts`.

- [x] **Step 2: Run targeted tests for the first converged path**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"`
Expected: the first Bucket A case now passes while any remaining unimplemented Bucket A cases still fail.

- [x] **Step 3: Converge the remaining Bucket A paths**

Complete the rest of the Bucket A follow-up and reentry moves so all same-type in-scope paths now rejoin the existing shared dispatch line.

- [x] **Step 4: Re-run targeted tests for full Bucket A coverage**

Run: `node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"`
Expected: all targeted Child 13 convergence tests pass.

## Task 3: Apply Minimum Supporting Runtime Alignment

**Files:**
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `src/main.ts`

- [x] **Step 1: Remove residual shell-owned Bucket A branch logic from `src/main.ts`**

Reduce `src/main.ts` to browser-shell responsibilities only for the converged Child 13 paths.

- [x] **Step 2: Keep settlement and router semantics aligned**

Adjust the minimum settlement/router behavior required so the converged Bucket A paths stay on the approved request -> route -> runtime -> settlement line.

- [x] **Step 3: Run build-time and typed verification**

Run: `npm run build:test && npm run typecheck`
Expected: `PASS`

## Task 4: Child 13 Closeout And Governance Sync

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-module-map.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`

- [x] **Step 1: Record the Child 13 convergence landing in the change log**

Document which Bucket A paths were converged and which paths remained Bucket B or Bucket C.

- [x] **Step 2: Record Child 13 execution outcome**

Update this plan's `Execution State` and `Progress Log` with the completed audit/classification/convergence result.

- [x] **Step 3: Sync weekly queue truth**

Update weekly controller and visibility docs so Child 13 no longer appears as a queued future candidate after closeout.

- [x] **Step 4: Run full verification**

Run: `npm test && npm run build && npm run lint:plans`
Expected: `PASS`

## Completion Checklist

- [x] Every remaining reviewed path is explicitly classified into Bucket A, Bucket B, or Bucket C
- [x] Every Bucket A path now converges through shared dispatch
- [x] `src/main.ts` no longer owns Bucket A follow-up or reentry branching
- [x] No same-type Bucket A path is intentionally deferred to a later child
- [x] Bucket B and Bucket C items are explicitly recorded rather than silently absorbed
- [x] Weekly/governance docs reflect Child 13 queue truth and final outcome
