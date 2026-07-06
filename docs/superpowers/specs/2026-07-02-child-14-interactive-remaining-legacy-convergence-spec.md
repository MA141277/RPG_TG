# Child 14 Interactive Remaining Legacy Convergence Spec

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. Resume governed work from `docs/superpowers/project-progress.md` instead.

## 1. Goal

Define the formal `Child 14` boundary for the first fresh weekly continuation set after the closed `Child 13` queue.

Child 14 exists to converge the remaining interactive legacy lifecycle ownership so the covered `activity-qte` and `story-battle` paths stop depending on `src/core/adapters/legacy-interactive-adapter.ts` and residual shell-owned follow-up branches in `src/main.ts`.

## 2. Basic Information

- Child name: `Interactive Remaining Legacy Convergence`
- Child index: `Child 14`
- One-line responsibility:
  - converge the remaining covered interactive legacy tails under `src/core/runtime/interactive-runtime.ts` without reopening broader runtime-family scope
- Architecture position:
  - first executable continuation child after the closed `Child 13` queue
- Primary target areas:
  - `Interaction Runtime` remaining lifecycle ownership
  - residual `legacy-interactive-adapter.ts` reduction
  - covered interactive cleanup / follow-up reduction in `src/main.ts`

## 3. Governing Inputs

Child 14 is governed by these documents in this priority order:

1. `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
2. `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
3. `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
4. `docs/superpowers/specs/2026-07-01-sub-runtime-ownerization-implementation-spec.md`
5. `docs/superpowers/specs/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-spec.md`
6. this spec

If Child 14 work would contradict a higher-priority source, Child 14 must stop and update the governing docs before implementation continues.

## 4. Problem Statement

After Child 11 and Child 13:

- covered city-begging lifecycle ownership is already runtime-owned
- covered shared-dispatch reentry follow-up is already converged
- covered grain-shop lifecycle and settlement alignment are already runtime-owned on the approved line

But the repository still retains a narrowed interactive compatibility seam:

- `activity-qte` still depends on legacy interactive adapter-owned lifecycle control
- `story-battle` still depends on legacy interactive adapter-owned lifecycle control for covered launch/action/exit/completion tails
- `src/main.ts` still carries shell-owned interactive cleanup or follow-up logic on those remaining paths

Without Child 14:

- interactive ownerization remains only partially complete
- the remaining adapter debt stays concentrated in one family but unresolved
- later navigation/time/event/scene work would start while the clearest remaining interactive debt still exists

## 5. Child 14 Objective

Child 14 must converge exactly the remaining covered interactive legacy tails:

- move covered `activity-qte` lifecycle ownership under `src/core/runtime/interactive-runtime.ts`
- move covered `story-battle` lifecycle ownership under `src/core/runtime/interactive-runtime.ts`
- reduce `src/core/adapters/legacy-interactive-adapter.ts` to justified compatibility-only residue, or remove the covered path dependence entirely
- reduce `src/main.ts` shell-owned interactive cleanup / follow-up logic for the covered paths only

Child 14 must not reinterpret this objective as a general runtime-family rewrite.

## 6. Scope

Child 14 includes exactly these workstreams.

### 6.1 `activity-qte` Lifecycle Convergence

Child 14 must converge the covered `activity-qte` launch / action / exit / completion lifecycle under the existing interactive runtime owner line.

Minimum requirements:

- covered `activity-qte` launch no longer depends on adapter-owned lifecycle control
- covered `activity-qte` action / completion follow-up no longer depends on shell-owned cleanup
- the convergence stays inside the existing interactive runtime family

### 6.2 `story-battle` Lifecycle Convergence

Child 14 must converge the covered `story-battle` launch / action / exit / completion lifecycle under the existing interactive runtime owner line.

Minimum requirements:

- covered `story-battle` launch no longer depends on adapter-owned lifecycle control
- covered `story-battle` completion / cleanup no longer depends on shell-owned follow-up on the covered path
- the convergence does not reopen already-accepted Child 13 follow-up conclusions

### 6.3 Legacy Interactive Adapter Reduction

Child 14 must reduce `src/core/adapters/legacy-interactive-adapter.ts` to the thinnest justified compatibility seam still required after the covered convergence work lands.

Minimum requirements:

- the covered lifecycle owner is `interactive-runtime.ts`, not the adapter
- any retained adapter code is explicitly compatibility-only
- retained adapter code does not silently keep business lifecycle ownership

### 6.4 `src/main.ts` Interactive Tail Reduction

Child 14 must reduce only the covered interactive cleanup / follow-up tails still held in `src/main.ts`.

Minimum requirements:

- shell-owned cleanup/follow-up for the converged paths is removed
- browser-shell responsibilities remain in `src/main.ts`
- Child 14 does not absorb navigation/time/event/scene orchestration

## 7. Explicit In-Scope Files

### Primary Implementation Surface

- `src/core/runtime/interactive-runtime.ts`
- `src/core/adapters/legacy-interactive-adapter.ts`
- covered interactive follow-up / cleanup points in `src/main.ts`
- `tests/robustness.test.cjs`

### Supporting But Not To Be Redesigned

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/house-runtime.ts`
- `src/application/minigames/**`
- `src/application/story-battle/**`

## 8. Out Of Scope

Child 14 does not include:

- navigation runtime convergence
- time runtime convergence
- event activation or scene handoff redesign
- new runtime contract families
- broader `RuntimeState` carrier redesign
- house runtime expansion beyond currently approved interactive follow-up seams
- boot/startup redesign
- Mod Runtime, Save / Load Runtime, StateSync Runtime, or presenter/UI redesign
- general story-system redesign

## 9. Adapter Rules

Child 14 may reduce `src/core/adapters/legacy-interactive-adapter.ts` only if all of these are true:

- the target path already belongs to the approved interactive runtime family
- the replacement path stays under `src/core/runtime/interactive-runtime.ts`
- the covered shell-owned tail no longer remains in `src/main.ts`
- targeted regression coverage exists for the covered path

Child 14 must not remove the adapter merely for cosmetic cleanup if lifecycle ownership still depends on it.

## 10. `src/main.ts` Reduction Rules

### May Move Out Of `src/main.ts`

- covered `activity-qte` cleanup / follow-up handling
- covered `story-battle` cleanup / follow-up handling
- covered interactive branch logic that exists only because the adapter still owns the lifecycle

### Must Stay In `src/main.ts`

- browser DOM/event wiring
- boot/startup orchestration
- presenter assembly and render invocation
- unrelated navigation/time/event/scene shell work

## 11. Batch Sequence

Child 14 must execute in this order:

1. audit remaining interactive paths and add failing coverage
2. converge `activity-qte`
3. converge `story-battle`
4. reduce retained adapter / shell residue and close out governance

Child 14 must not reorder these batches unless the weekly plan, this spec, and the Child 14 plan are all updated first.

## 12. Acceptance Criteria

Child 14 is acceptable only if:

- covered `activity-qte` lifecycle ownership is runtime-owned
- covered `story-battle` lifecycle ownership is runtime-owned
- `src/main.ts` no longer carries the covered interactive cleanup / follow-up tails
- `legacy-interactive-adapter.ts` is reduced to justified compatibility-only residue or no longer owns the covered paths
- Child 14 does not reopen navigation/time/event/scene scope
- targeted regression coverage passes

## 13. Verification

Child 14 completion requires:

- targeted regression coverage for covered `activity-qte` lifecycle ownership
- targeted regression coverage for covered `story-battle` lifecycle ownership
- targeted regression coverage for covered launch / action / exit / completion follow-up tails
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans` for queue/governance sync batches

## 14. Residual Debt Rule

Child 14 may leave behind residual debt only if it is explicitly recorded in closeout.

Expected residual debt after Child 14 should be limited to:

- `Navigation + Time Runtime Convergence`
- `Event + Scene Handoff Convergence`

If Child 14 leaves behind another same-type interactive legacy lifecycle tail, it is not complete unless governance explicitly records why that remainder is out of scope.

## 15. Escalation Rules

Child 14 must stop and update the governing docs before continuing if a change would:

- reopen frozen Child 10 ownerization-baseline rules
- widen into navigation/time/event/scene convergence
- require a new public contract family
- require broader story-flow redesign
- convert Child 14 into house/runtime/presenter/UI work

## 16. Done-Enough Exit Condition

Child 14 is done enough only when:

- the repository can point to one explicit covered `activity-qte` runtime-owned lifecycle
- the repository can point to one explicit covered `story-battle` runtime-owned lifecycle
- the remaining legacy interactive adapter code is no longer the lifecycle owner for those paths
- the remaining work can move on to Child 15 / Child 16 rather than another same-type interactive cleanup child

If those answers remain ambiguous, Child 14 is not complete.
