# Child 15 Navigation + Time Runtime Convergence Spec

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. If this legacy artifact is explicitly resumed, use `docs/superpowers/project-progress.md`; otherwise use `docs/blueprints/project-progress.md` for current repository work.

## 1. Goal

Define the formal `Child 15` boundary for the queued follow-up child behind `Child 14` in the fresh `2026-07-02` weekly continuation set.

Child 15 exists to reduce direct `src/main.ts` orchestration around `runNavigationRuntime()` and `runTimeRuntime()` so covered navigation and time progression entry paths converge on clearer runtime-owned control without dragging event/scene story handoff into scope.

## 2. Basic Information

- Child name: `Navigation + Time Runtime Convergence`
- Child index: `Child 15`
- One-line responsibility:
  - converge the remaining covered navigation/time mixed entry ownership without reopening interactive legacy cleanup or event/scene handoff scope
- Architecture position:
  - immediate queued follow-up child behind Child 14 in the fresh `2026-07-02` weekly continuation set
- Primary target areas:
  - `Navigation Runtime` mixed entry reduction
  - `Time Runtime` mixed entry reduction
  - covered progression-layer shell-branch reduction in `src/main.ts`

## 3. Governing Inputs

Child 15 is governed by these documents in this priority order:

1. `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
2. `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
3. `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
4. `docs/superpowers/specs/2026-07-02-child-14-interactive-remaining-legacy-convergence-spec.md`
5. this spec

If Child 15 work would contradict a higher-priority source, Child 15 must stop and update the governing docs before implementation continues.

## 4. Problem Statement

After Child 13, the remaining ownerization debt is no longer primarily about shared-dispatch reentry or covered house flow ownership.

Once Child 14 resolves the remaining interactive legacy tails, the next unresolved mixed ownership is expected to be the progression-layer shell/runtime split:

- `src/main.ts` still directly coordinates covered navigation flow on some paths
- `src/main.ts` still directly coordinates covered time progression on some paths
- navigation/time remain structurally related because they share the same progression-entry pattern

Without Child 15:

- the repository keeps shell-owned progression control in `src/main.ts`
- later event/scene work would be forced to build on top of unresolved navigation/time mixed entry rules
- continuation decomposition would lose its clean subsystem order

## 5. Child 15 Objective

Child 15 must:

- reduce covered shell-owned navigation entry orchestration in `src/main.ts`
- reduce covered shell-owned time entry orchestration in `src/main.ts`
- converge those covered paths on the existing runtime family rather than inventing new top-level owners
- keep event activation and scene continuation out of scope

Child 15 must not reinterpret this objective as a general story-flow or event redesign.

## 6. Scope

Child 15 includes exactly these workstreams.

### 6.1 Covered Navigation Entry Convergence

Child 15 must converge the covered navigation entry paths under the existing `Navigation Runtime` line.

Minimum requirements:

- covered navigation entry no longer depends on direct shell-owned orchestration
- the convergence stays inside the approved navigation runtime family
- `src/main.ts` keeps only shell-facing input/output duties on the covered navigation paths

### 6.2 Covered Time Progression Entry Convergence

Child 15 must converge the covered time progression entry paths under the existing `Time Runtime` line.

Minimum requirements:

- covered time entry no longer depends on direct shell-owned orchestration
- the convergence stays inside the approved time runtime family
- Child 15 does not silently turn into settlement redesign

### 6.3 Shared Progression Follow-Up Reduction

Child 15 may reduce the minimum shared progression follow-up logic required so covered navigation/time paths stop depending on shell-side stitching.

Minimum requirements:

- the supporting change stays within covered navigation/time ownership
- event/scene handoff is not absorbed into Child 15
- any required supporting runtime touchpoint remains additive and bounded

## 7. Explicit In-Scope Files

### Primary Implementation Surface

- `src/core/runtime/navigation-runtime.ts`
- `src/core/runtime/time-runtime.ts`
- covered navigation/time orchestration points in `src/main.ts`
- `tests/robustness.test.cjs`

### Supporting But Not To Be Redesigned

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/event-runtime.ts`
- `src/core/runtime/scene-runtime.ts`

## 8. Out Of Scope

Child 15 does not include:

- interactive legacy cleanup
- event activation redesign
- scene handoff redesign
- new runtime contract families
- broader settlement redesign
- boot/startup, save/load, mod, presenter, UI, or StateSync redesign
- story-system redesign

## 9. Queue Position And Unlock Rule

Child 15 is a formal queued follow-up child, not an active executable child.

Child 15 may start only when all of these are true:

- Child 14 is completed
- Child 14 closeout sync is recorded in the active weekly plan and fresh artifact bundle
- weekly governance explicitly promotes Child 15 from `queued` to `active executable child`
- Child 16 remains unpromoted at Child 15 start time

## 10. Batch Sequence

Child 15 must execute in this order:

1. audit covered navigation/time mixed entry paths and add failing coverage
2. converge navigation entry
3. converge time entry
4. reduce retained shell residue and close out governance

## 11. Acceptance Criteria

Child 15 is acceptable only if:

- covered navigation entry no longer depends on direct shell orchestration
- covered time entry no longer depends on direct shell orchestration
- `src/main.ts` keeps only shell-facing responsibilities for those covered progression paths
- Child 15 does not reopen interactive legacy cleanup scope
- Child 15 does not absorb event/scene handoff convergence
- targeted regression coverage passes

## 12. Verification

Child 15 completion requires:

- targeted regression coverage for covered navigation entry paths
- targeted regression coverage for covered time progression entry paths
- targeted regression coverage for covered progression follow-up on the converged line
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans` for queue/governance sync batches

## 13. Residual Debt Rule

If Child 15 completes successfully, the expected next continuation debt should narrow primarily to:

- `Child 16 Event + Scene Handoff Convergence`

If Child 15 would leave behind another same-type covered navigation/time mixed-entry remainder, that remainder must be recorded explicitly rather than silently pushed into Child 16.

## 14. Escalation Rules

Child 15 must stop and update the governing docs before continuing if a change would:

- reopen Child 14 scope while Child 14 is still incomplete
- widen into event activation or scene handoff redesign
- require a new contract family
- turn the child into broader story-flow or settlement redesign

## 15. Done-Enough Exit Condition

Child 15 is done enough only when:

- the repository can point to one explicit covered navigation runtime-owned entry path
- the repository can point to one explicit covered time runtime-owned entry path
- the remaining later continuation is no longer "navigation/time mixed entry cleanup" but a different problem type

If those answers remain ambiguous, Child 15 is not complete.

