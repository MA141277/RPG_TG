# Child 18 Runtime Spine Unification Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. Resume governed work from `docs/superpowers/project-progress.md` instead.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the remaining mixed runtime orchestration in `src/main.ts` behind one clearer request/router/sub-runtime/settlement/state-sync spine so later mod-facing contract work lands on a stable production path.

**Architecture:** Child 18 begins only after Child 17 has removed scenario-specific content access coupling. Child 18 does not reopen the covered Child 15/16 convergence work; instead it audits the remaining main-owned orchestration residue that still glues together runtime entry, settlement, write-back, and render triggers across multiple sub-runtimes. The child must keep its scope on the spine and must not absorb task contract, house registration, or contribution registry redesign.

**Tech Stack:** TypeScript, runtime dispatch/router/settlement seams, `src/main.ts`, Node test runner (`tests/robustness.test.cjs`), `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Child 18 is closed. Covered runtime entry and covered interactive write-back paths now share the runtime commit seam, and no further same-type residue remains inside this child boundary.`
- Next Step: `Run Child 19 baseline recheck before any promotion decision.`
- Verification: `node --test tests/robustness.test.cjs --test-name-pattern "runtime spine|main runtime orchestration|dispatchRuntimeRequest|runtime settlement|state sync|child 15 covered|child 16 covered"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
- Notes: `Child 18 closed without reopening Child 15/16 history and without absorbing task, house-registration, or contribution-registry redesign.`

## Progress Log

- 2026-07-02
  - Summary: `Plan created from the mod-first unified contract roadmap. Child 18 remains non-executable until a fresh weekly set promotes it after Child 17.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Recheck main-owned runtime residue after Child 17 closes.`
- 2026-07-02
  - Summary: `Post-Child-17 baseline recheck promoted Child 18 to active execution. The narrowed residue was the repeated main-owned create/apply runtime bridge glue on covered day-start, advance-segments, enter-city, and story-battle dispatch paths. Added red tests for a shared runtime commit helper, implemented commitRuntimeRequest() in state-sync-runtime, rewired the covered main.ts paths to it, and revalidated the narrowed runtime-spine batch.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "runtime spine|main runtime orchestration|dispatchRuntimeRequest|runtime settlement|state sync"` + `node --test tests/robustness.test.cjs --test-name-pattern "runtime spine|main runtime orchestration|dispatchRuntimeRequest|runtime settlement|state sync|child 15 covered|child 16 covered"` + `npm run typecheck` + `npm test` + `npm run build`
  - Next: `Continue with Task 3 and decide whether any remaining covered settlement/write-back glue should move off main.ts in this child or be explicitly left as shell-owned.`
- 2026-07-02
  - Summary: `Completed Task 3 and Child 18 closeout. Covered city-begging and activity-qte write-back paths in main.ts now also route through commitRuntimeRequest(), removing the remaining repeated interactive runtime bridge create/apply glue from the covered spine. main.ts keeps shell-facing follow-up and render decisions only.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "interactive covered main write-back|runtime spine|main runtime orchestration|activity qte result close|minigame dispatch"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Close Child 18 and recheck Child 19 against the post-Child-18 baseline.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-mod-first-unified-contract-roadmap-design.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-02-mod-first-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `The known runtime spine files are src/core/runtime/runtime-dispatch.ts, runtime-router.ts, runtime-settlement.ts, state-sync-runtime.ts, and src/main.ts.`
  - `The child should only absorb orchestration that still keeps main.ts as a mixed runtime owner, not browser-shell-only work.`
  - `Child 18 should leave contribution registration and manifest redesign for later children.`

## Implementation Scope

### In Scope

- audit of residual main-owned runtime orchestration after Child 17
- shared request/dispatch entry cleanup across existing sub-runtimes
- settlement/state-sync cleanup where main still owns runtime glue
- targeted regression coverage proving the runtime spine owns the covered flow
- governance/doc sync for the new child outcome

### Still Out Of Scope

- direct scenario import cleanup
- task contribution schema redesign
- house module registration redesign
- manifest/dependency policy redesign
- presenter layout redesign

## File Map

### Existing files to modify

- `src/main.ts`
  - Shrink mixed runtime orchestration and preserve shell-only responsibilities.
- `src/core/runtime/runtime-dispatch.ts`
  - Clarify one dispatch entry spine for covered runtime requests.
- `src/core/runtime/runtime-router.ts`
  - Clarify route ownership across existing sub-runtimes.
- `src/core/runtime/runtime-settlement.ts`
  - Pull covered write-back/effect settlement out of main-owned glue where needed.
- `src/core/runtime/state-sync-runtime.ts`
  - Centralize state-sync helpers that main still owns directly.
- `src/core/runtime/navigation-runtime.ts`
  - Adjust only if dispatch wiring needs a narrower interface.
- `src/core/runtime/time-runtime.ts`
  - Adjust only if dispatch wiring needs a narrower interface.
- `src/core/runtime/event-runtime.ts`
  - Adjust only if dispatch wiring needs a narrower interface.
- `src/core/runtime/scene-runtime.ts`
  - Adjust only if dispatch wiring needs a narrower interface.
- `src/core/runtime/interactive-runtime.ts`
  - Keep compatibility if the shared spine changes covered dispatch entry shape.
- `src/core/runtime/house-runtime.ts`
  - Keep compatibility if the shared spine changes covered dispatch entry shape.
- `tests/robustness.test.cjs`
  - Add regression coverage for main-owned runtime residue.
- `docs/change-log.md`
  - Record the Child 18 spine outcome.
- `docs/superpowers/plans/2026-07-02-child-18-runtime-spine-unification-plan.md`
  - Record execution progress and closeout.

### Existing files to read

- `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
- `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
- `src/core/contracts/runtime-result.ts`
- `src/core/contracts/runtime-state.ts`

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "runtime spine|main runtime orchestration|dispatchRuntimeRequest|runtime settlement|state sync"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit Residual Main-Owned Runtime Orchestration

**Files:**
- Read: `src/main.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/runtime-router.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Enumerate every covered runtime flow still mixed in `src/main.ts`**

Record the exact remaining orchestration tails that keep `src/main.ts` beyond shell-only responsibility.

- [x] **Step 2: Add failing regression tests for the mixed runtime residue**

Write red tests that lock the enumerated runtime-spine gaps before implementation.

- [x] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "runtime spine|main runtime orchestration|dispatchRuntimeRequest|runtime settlement|state sync"
```

Expected:

- at least one runtime-spine guard fails before implementation

- [x] **Step 4: Record the audit result in plan state**

Update `Execution State` and `Progress Log` with the enumerated mixed-orchestration baseline.

## Task 2: Unify Shared Runtime Dispatch And Routing Entry

**Files:**
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Move covered runtime entry glue onto one clearer dispatch/router line**

Reduce direct per-runtime branching in `src/main.ts` for the covered flows.

- [x] **Step 2: Re-run the targeted dispatch tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "runtime spine|dispatchRuntimeRequest|runtime router"
```

Expected:

- the covered runtime entry tests pass

- [x] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 3: Converge Covered Settlement And State-Sync Glue

**Files:**
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `src/core/runtime/state-sync-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Move covered write-back and settlement glue off `src/main.ts`**

Keep only browser-shell write/read and render triggers in `src/main.ts`.

- [x] **Step 2: Re-run the targeted settlement tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "runtime settlement|state sync|main runtime orchestration"
```

Expected:

- the covered settlement/write-back tests pass

- [x] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 4: Close Out Child 18 Governance

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-18-runtime-spine-unification-plan.md`

- [x] **Step 1: Record the final `main.ts` runtime boundary**

Document what remains shell-owned and what has moved behind the runtime spine.

- [x] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [x] Covered runtime entry dispatch no longer depends on mixed `main.ts` glue.
- [x] Covered settlement/write-back no longer depends on mixed `main.ts` glue.
- [x] `src/main.ts` keeps only shell-facing responsibilities for covered flows.
- [x] Child 18 does not redesign task, house, or manifest contribution families.
- [x] Targeted regression coverage passes.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
