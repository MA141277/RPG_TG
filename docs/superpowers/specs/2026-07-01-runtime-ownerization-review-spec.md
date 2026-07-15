# Runtime Ownerization Review And Baseline Spec

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. Resume governed work from `docs/superpowers/project-progress.md` instead.

## 1. Goal

Define the formal `Child 10 Runtime Ownerization Review And Baseline` boundary for the current mod-first engine/runtime roadmap.

Child 10 is a review-and-baseline child, not a production ownerization child. Its purpose is to turn the post-Child-9 runtime situation into an explicit execution baseline so `Child 11 Sub-Runtime Ownerization Implementation` can iterate against frozen boundaries instead of reopening runtime ownership, adapter disposition, and `src/main.ts` responsibilities during implementation.

## 2. Basic Information

- Child name: `Runtime Ownerization Review And Baseline`
- Child index: `Child 10`
- One-line responsibility:
  - review current runtime maturity, freeze Child 11 boundaries, and produce the baseline document that unlocks Child 11
- Architecture position:
  - review/baseline layer between `Child 9 Runtime Contract Hardening` and `Child 11 Sub-Runtime Ownerization Implementation`
- Primary output:
  - `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`

## 3. Problem Statement

After Child 8 and Child 9, the repository has the runtime names and the minimum contract layer needed for mod-first architecture, but it still does not have one stable, repository-level answer for these questions:

- which runtimes are already formal owners
- which runtimes are still bridge-period seams
- which adapters must be removed in Child 11
- which adapters must remain temporarily
- which `src/main.ts` orchestration paths belong in Child 11
- which paths must stay outside Child 11

Without an explicit baseline, Child 11 would be forced to make those decisions ad hoc while also changing production code. That would expand implementation scope, blur exit criteria, and make queue control unreliable.

## 4. Child 10 Objective

Child 10 must produce one executable review baseline for Child 11.

That baseline must:

- classify the current sub-runtime inventory by maturity
- mark which seams are formal owners and which are bridge/adapter-backed
- record contract freeze surfaces that Child 11 must not reopen
- record adapter keep/remove decisions
- record `src/main.ts` coupling that Child 11 may and may not absorb
- define Child 11 batch order, boundaries, acceptance, and forbidden changes

Child 10 must not be expanded into:

- production runtime ownerization
- adapter removal in production code
- UI/layout/presenter redesign
- resource planning
- boot/content assembly redesign
- new gameplay systems

## 5. Scope

Child 10 includes exactly these review workstreams.

### 5.1 Runtime Maturity Review

Child 10 must review the promoted runtime inventory and classify each relevant runtime as:

- `formal-owner`
- `owner-first-slice`
- `partial-owner`
- `bridge`
- `adapter-only`

The baseline must explicitly mark which runtime currently owns production entry and which still depends on bridge-period compatibility.

### 5.2 Contract Freeze Review

Child 10 must record which shared contracts are frozen for Child 11 and which remain soft but constrained.

Minimum required review surfaces:

- `RuntimeRequest`
- `RuntimeResult`
- `RuntimeState`
- `Interactive Runtime` contract surface
- `House Runtime` request surface
- `Effect Settlement` surface

### 5.3 Bridge / Adapter Disposition Review

Child 10 must review the current bridge and adapter inventory and decide, for each item:

- remove in Child 11
- keep through Child 11
- keep until later child

Each disposition must have a reason tied to runtime ownership rather than convenience.

### 5.4 `src/main.ts` Coupling Review

Child 10 must identify which `src/main.ts` responsibilities belong to:

- browser shell only
- Child 11 ownerization scope
- later child scope

### 5.5 Child 11 Execution Baseline

Child 10 must define the execution baseline that Child 11 must follow, including:

- allowed file boundary
- required reading set
- batch order
- batch exit gates
- forbidden changes
- residual debt to keep out of scope
- verification mapping
- unlock rule

## 6. Non-Goals

Child 10 does not include:

- production code ownerization
- shared router redesign beyond baseline wording
- scene/navigation/event runtime expansion
- boot runtime rewrite
- Mod Runtime redesign
- save IO redesign
- resource loader/resource planner redesign
- UI/renderer/layout landing
- house feature/content expansion

## 7. Forward Applicability

This spec applies to:

- Child 10 baseline authoring
- Child 11 spec authoring
- Child 11 plan authoring
- any attempt to remove a bridge or adapter from interactive/house/shared runtime paths
- any attempt to move additional `src/main.ts` orchestration into runtime owners

If Child 11 wants to expand beyond this baseline, the baseline document, Child 11 spec, Child 11 plan, and weekly plan must all be revised before code work continues.

## 8. Core Constraints

### 8.1 Child 10 Is Document-Governance Work

- Child 10 must produce review artifacts and governance decisions.
- Child 10 must not claim implementation completion for runtime ownerization.

### 8.2 No New Runtime Invention

- Child 10 must not invent new top-level runtime names to justify mod-first coverage.
- Child 10 works on maturity, ownership, and execution control of the existing runtime inventory.

### 8.3 Owner vs Bridge Must Be Explicit

- Each relevant runtime must be marked as a formal owner or a bridge-period seam.
- Child 10 must not leave interactive/house/shared dispatch maturity in vague wording.

### 8.4 Child 11 Must Be Narrower Than The Total Runtime Inventory

- Child 11 only ownerizes the runtimes and seams explicitly named by the baseline.
- Everything else remains frozen or deferred.

### 8.5 Weekly Control Must Stay Authoritative

- Child 10 is not complete until weekly queue wording reflects the new Child 10 and Child 11 ordering.
- Child 11 may be scheduled, but must remain locked until Child 10 completion criteria are met.

## 9. Child 10 Output

When Child 10 is complete, the repository should have:

- a finalized Child 10 baseline document at `docs/superpowers/specs/2026-07-01-runtime-ownerization-baseline.md`
- explicit owner/bridge classifications for the current runtime inventory
- explicit bridge/adapter disposition decisions
- explicit `src/main.ts` coupling decisions for Child 11
- explicit Child 11 execution boundaries, forbidden changes, and batch order
- weekly plan queue entries for Child 10 and Child 11 with a clear unlock relationship

## 10. Acceptance Criteria

Child 10 is acceptable only if:

- the baseline explicitly marks which runtimes are formal owners and which are still bridge/adapter-backed
- the baseline explicitly marks which adapters are removed or retained through Child 11
- the baseline freezes the Child 11 execution boundary tightly enough to prevent scope drift
- the baseline defines Child 11 batch order and exit gates
- the baseline defines Child 11 verification mapping and residual debt handling
- the weekly plan records Child 10 as the review/baseline child and Child 11 as the locked implementation child
- Child 10 does not absorb production ownerization or unrelated module redesign
