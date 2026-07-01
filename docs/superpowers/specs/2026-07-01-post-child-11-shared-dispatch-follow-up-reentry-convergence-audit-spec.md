# Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit Spec

## 1. Goal

Define the formal `Child 13` boundary for the current mod-first roadmap.

Child 13 exists to audit the remaining runtime-owned follow-up and reentry paths that still sit outside the shared dispatch line after Child 11, then converge every in-scope path into the shared dispatch surface in one controlled child.

## 2. Basic Information

- Child name: `Post-Child-11 Shared Dispatch Follow-Up / Reentry Convergence Audit`
- Child index: `Child 13`
- One-line responsibility:
  - classify the remaining post-Child-11 follow-up and reentry paths, then converge every in-scope path onto shared dispatch without reopening frozen Child 9/10/11 surfaces
- Architecture position:
  - the preferred post-Child-11 runtime continuation child, queued before the preserved Child 12 UI reserve work
- Primary target areas:
  - shared dispatch convergence
  - runtime-owned follow-up path audit
  - runtime-owned reentry path audit
  - residual `src/main.ts` shell-branch reduction for already-covered runtime families

## 3. Governing Inputs

Child 13 is governed by these documents in this priority order:

1. `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
2. `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
3. `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
4. `docs/superpowers/specs/2026-07-01-sub-runtime-ownerization-implementation-spec.md`
5. this spec

If Child 13 work would contradict a higher-priority source, Child 13 must stop and update the governing docs before implementation continues.

## 4. Problem Statement

Child 11 is the first production ownerization child, but its scope is intentionally limited to the approved ownerization baseline.

That means the repository may still contain:

- runtime-owned follow-up paths that remain shell-owned in `src/main.ts`
- reentry paths that return to browser-shell logic instead of rejoining shared dispatch
- covered runtime families that now have a formal owner but still do not converge through one consistent follow-up path

Without Child 13:

- the project would keep a second tier of runtime-owned behavior outside the shared dispatch line
- `src/main.ts` would keep follow-up and reentry branching that belongs to existing runtime families
- later runtime work would keep reopening the same convergence question in smaller patches

## 5. Child 13 Is Not Child 11 Backfill

Child 13 is not a silent continuation of Child 11 and is not permission to reopen Child 11's accepted exit condition.

Child 13 may only exist as its own child if:

- Child 11 completed validly against its own spec and plan
- the remaining work is about follow-up or reentry convergence inside already-approved runtime families
- the remaining work does not require a new public contract family
- the remaining work does not require a new top-level runtime owner or a new baseline review child

If a discovered issue is actually a missed Child 11 primary-path obligation, it is `Child 11 backfill`, not Child 13 scope.

## 6. Classification Rule

Every remaining path discovered during Child 13 must be classified into exactly one bucket before implementation continues.

### 6.1 Bucket A: Convergence-In-Scope

Use Bucket A only if all of these are true:

- the path belongs to a runtime family already covered by Child 9, Child 10, and Child 11 governance
- the path is a follow-up, reentry, or shell-owned continuation of an already-owned runtime flow
- converging the path does not require a new public contract family
- converging the path does not reopen Child 11's primary-path completion scope

Bucket A is the actionable Child 13 implementation scope.

### 6.2 Bucket B: Child-11-Backfill

Use Bucket B if the path reveals:

- a missed Child 11 must-have path
- a direct contradiction with the accepted Child 11 exit condition
- a defect that means Child 11 was not actually complete on its own governed surface

Bucket B must be recorded explicitly and must not be silently absorbed into Child 13.

### 6.3 Bucket C: New-Boundary-Follow-Up

Use Bucket C if the path would require:

- a new public contract family
- a new runtime owner outside the Child 11 family
- boot/mod/save/presenter/UI/layout/resource-planning work
- broader `RuntimeState` carrier redesign
- generalized minigame-entry normalization beyond the current approved runtime family

Bucket C is deferred future work and must not be absorbed into Child 13.

## 7. Scope

Child 13 includes exactly these workstreams.

### 7.1 Remaining Covered Follow-Up / Reentry Path Audit

Child 13 must enumerate the remaining follow-up and reentry paths related to the current Child 11 runtime family and classify every path into Bucket A, B, or C.

### 7.2 Shared Dispatch Convergence For Bucket A

Child 13 must converge every Bucket A path onto the existing shared dispatch line.

Minimum requirements:

- follow-up and reentry no longer stay as shell-owned branches when they belong to an already-owned runtime family
- the chosen convergence path reuses existing dispatch/router/settlement seams
- no same-type Bucket A path is intentionally deferred to another later child

### 7.3 Minimal Supporting Runtime Alignment

Child 13 may make the minimum runtime alignment needed to support Bucket A convergence in:

- `runtime-dispatch`
- `runtime-router`
- `interactive-runtime`
- `house-runtime`
- `runtime-settlement`

But Child 13 must not use this as permission to redesign those modules broadly.

## 8. Explicit In Scope Files

### Primary Runtime Surface

- `src/main.ts`
- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/interactive-runtime.ts`
- `src/core/runtime/house-runtime.ts`
- `src/core/runtime/runtime-settlement.ts`
- `tests/robustness.test.cjs`

### Governance Surface

- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- `docs/superpowers/plans/2026-07-01-post-child-11-shared-dispatch-follow-up-reentry-convergence-audit-plan.md`
- this spec

## 9. Out Of Scope

Child 13 does not include:

- new runtime families
- new public contract families
- Child 11 primary-path backfill by default
- boot/startup redesign
- Mod Runtime redesign
- Save / Load Runtime redesign
- presenter/render redesign
- UI/layout/resource-planning work
- generalized minigame-entry normalization outside the current approved runtime family
- `RuntimeState` carrier convergence
- Editor mode or content-pack UI reserve work

## 10. One-Type-Of-Problem Rule

Child 13 is acceptable only if it stays on one problem type:

- runtime-owned follow-up and reentry convergence for already-covered runtime families

If implementation starts absorbing unrelated runtime cleanup, new ownerization, or new contract design, Child 13 has exceeded scope.

## 11. Exhaustion Rule

Child 13 must not intentionally leave behind another same-type `Bucket A` remainder for a later Child 14+.

Child 13 is allowed only if the child can make a credible claim that:

- every remaining same-type path was audited
- every in-scope path was converged in this child
- anything left over is explicitly Bucket B or Bucket C

## 12. Acceptance Criteria

Child 13 is acceptable only if:

- every discovered remaining path is classified into Bucket A, Bucket B, or Bucket C
- every Bucket A path converges through the shared dispatch line
- `src/main.ts` no longer retains shell-owned branching for Bucket A paths
- no same-type Bucket A path is intentionally deferred to a later child
- every Bucket B or Bucket C path is recorded explicitly with reason
- Child 13 does not become Child 11 backfill or new-boundary ownerization

## 13. Verification

Child 13 completion requires:

- `npm run build:test`
- `node --test tests/robustness.test.cjs --test-name-pattern "child 13|follow-up|reentry|shared dispatch"`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans`

## 14. Escalation Rules

Child 13 must stop and update the governing docs before continuing if a change would:

- reopen Child 11 completion validity
- require a new public contract family
- require a new runtime owner outside the current covered family
- move into Child 12 UI/resource reserve scope
- leave same-type Bucket A paths for a later child without explicit governance approval

## 15. Done-Enough Exit Condition

Child 13 is done enough only when:

- the repository can point to one explicit classification record for every remaining path reviewed
- all actionable convergence work for Bucket A landed in the same child
- the queue can explain clearly why anything not landed belongs to Bucket B or Bucket C instead

If those answers remain ambiguous, Child 13 is not complete.
