# Child 16 Event + Scene Handoff Convergence Spec

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. Resume governed work from `docs/superpowers/project-progress.md` instead.

## 1. Goal

Define the formal `Child 16` boundary for the active executable child that follows completed `Child 15` in the fresh `2026-07-02` weekly continuation set.

Child 16 exists to converge the remaining mixed shell orchestration between `runEventRuntime()` and `runSceneFromEvent()` so covered event activation and scene handoff follow one explicit runtime-owned production line.

## 2. Basic Information

- Child name: `Event + Scene Handoff Convergence`
- Child index: `Child 16`
- One-line responsibility:
  - converge the remaining covered event activation and event-to-scene handoff ownership without reopening navigation/time convergence or inventing a new story system
- Architecture position:
  - active executable child after the post-Child-15 baseline recheck in the fresh `2026-07-02` weekly continuation set
- Primary target areas:
  - `Event Runtime` activation ownership cleanup
  - `Scene Runtime` handoff ownership cleanup
  - covered story handoff branch reduction in `src/main.ts`

## 3. Governing Inputs

Child 16 is governed by these documents in this priority order:

1. `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
2. `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
3. `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
4. `docs/superpowers/specs/2026-07-02-child-15-navigation-time-runtime-convergence-spec.md`
5. this spec

If Child 16 work would contradict a higher-priority source, Child 16 must stop and update the governing docs before implementation continues.

## 4. Problem Statement

After Child 14 and Child 15 are completed, the remaining continuation debt should no longer be primarily about interactive legacy lifecycle ownership or progression-layer mixed entry ownership.

The next unresolved problem type is expected to be the story handoff line:

- event activation still cooperates with shell-side control on some covered paths
- scene continuation is not yet centralized under one runtime-owned production line
- `src/main.ts` still carries story handoff stitching that belongs to the event/scene runtime family

The baseline recheck after Child 15 narrows this child further. The concrete covered production line is now the shell-owned `triggerStoryEventsForTiming()` chain in `src/main.ts`, with the currently observed covered call sites limited to:

- `triggerStoryEventsForTiming("city-enter")` after the converged navigation entry
- `triggerStoryEventsForTiming("indoor-screen-shown")` inside passive indoor trigger sync

Without Child 16:

- the repository keeps one remaining mixed orchestration seam for covered story flow
- event and scene ownership stay formally separated but not operationally unified
- later continuation risks growing into open-ended story-flow redesign instead of one bounded handoff child

## 5. Child 16 Objective

Child 16 must:

- reduce covered shell-owned event activation stitching
- reduce covered shell-owned event -> scene handoff stitching
- converge those covered paths on the existing event/scene runtime family
- keep content/schema redesign and broader story-system invention out of scope

Child 16 must not reinterpret this objective as a general narrative framework rewrite.

## 6. Scope

Child 16 includes exactly these workstreams.

### 6.1 Covered Event Activation Ownership Cleanup

Child 16 must converge the covered event activation paths under the existing `Event Runtime` line.

Minimum requirements:

- covered event activation no longer depends on direct shell-side stitching
- the convergence stays inside the approved event runtime family
- Child 16 does not reopen navigation/time progression ownership
- the narrowed covered activation line is limited to the current `triggerStoryEventsForTiming()` production path rather than every historical timing family

### 6.2 Covered Event -> Scene Handoff Convergence

Child 16 must converge the covered scene handoff paths under the existing `Scene Runtime` line.

Minimum requirements:

- covered scene continuation no longer depends on ad hoc `src/main.ts` orchestration
- event -> scene handoff is explicit and runtime-owned on the covered line
- the convergence stays inside the approved scene runtime family
- the narrowed covered scene handoff line is limited to scene activation launched from the current `triggerStoryEventsForTiming()` production path

### 6.3 Story Handoff Shell Reduction

Child 16 may reduce the minimum shell-side story handoff logic required so covered event/scene paths stop depending on browser-shell control.

Minimum requirements:

- the supporting change stays within covered event/scene ownership
- Child 16 does not become content-logic redesign
- any required supporting runtime touchpoint remains additive and bounded

## 7. Explicit In-Scope Files

### Primary Implementation Surface

- `src/core/runtime/event-runtime.ts`
- `src/core/runtime/scene-runtime.ts`
- covered event/scene orchestration points in `src/main.ts`
- `tests/robustness.test.cjs`

### Supporting But Not To Be Redesigned

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/navigation-runtime.ts`
- `src/core/runtime/time-runtime.ts`
- scene/event registries and current scene-session helpers

## 8. Out Of Scope

Child 16 does not include:

- interactive legacy cleanup
- navigation/time convergence
- new runtime contract families
- content schema redesign
- generalized story-system redesign
- boot/startup, save/load, mod, presenter, UI, or StateSync redesign

## 9. Queue Position And Unlock Rule

Child 16 is the formal active executable child after the Child 15 closeout sync and Child 16 baseline recheck.

Child 16 may start only when all of these are true:

- Child 14 is completed
- Child 15 is completed
- Child 15 closeout sync is recorded in the active weekly plan and fresh artifact bundle
- weekly governance explicitly records the Child 16 baseline recheck result and promotes Child 16 from `queued` to `active executable child`

## 10. Batch Sequence

Child 16 must execute in this order:

1. audit covered event/scene mixed handoff paths and add failing coverage
2. converge event activation ownership
3. converge scene handoff ownership
4. reduce retained shell residue and close out governance

## 11. Acceptance Criteria

Child 16 is acceptable only if:

- covered event activation no longer depends on shell-side stitching
- covered scene continuation no longer depends on ad hoc `src/main.ts` orchestration
- event -> scene handoff is explicit and runtime-owned on the covered line
- Child 16 does not reopen navigation/time convergence scope
- Child 16 does not expand into broader story-system redesign
- targeted regression coverage passes

## 12. Verification

Child 16 completion requires:

- targeted regression coverage for covered event activation paths
- targeted regression coverage for covered scene continuation paths
- targeted regression coverage for covered event -> scene handoff paths
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans` for queue/governance sync batches

## 13. Residual Debt Rule

If Child 16 completes successfully, any remaining continuation should be recorded as a new problem type rather than as another same-type event/scene handoff cleanup child.

If Child 16 would leave behind another same-type covered event/scene handoff remainder, that remainder must be recorded explicitly rather than silently deferred.

## 14. Escalation Rules

Child 16 must stop and update the governing docs before continuing if a change would:

- reopen Child 15 scope while Child 15 is still incomplete
- require content/schema redesign
- require a new public contract family
- turn the child into broader story-flow redesign

## 15. Done-Enough Exit Condition

Child 16 is done enough only when:

- the repository can point to one explicit covered runtime-owned event activation path
- the repository can point to one explicit covered runtime-owned event -> scene handoff path
- the remaining later continuation is no longer "event/scene handoff convergence" but a different problem type

If those answers remain ambiguous, Child 16 is not complete.
