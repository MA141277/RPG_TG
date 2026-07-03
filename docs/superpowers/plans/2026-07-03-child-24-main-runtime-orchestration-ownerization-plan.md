# Child 24 Main Runtime Orchestration Ownerization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the remaining covered runtime-business orchestration from `src/main.ts` so shell entry points delegate into one explicit orchestration seam with fixed follow-up ownership and one state write-back sink.

**Architecture:** Child 24 is a fresh post-Child-23 continuation child. It must extract covered story / event / scene follow-up, startup session apply business orchestration, and passive render-time trigger mutation out of `src/main.ts`, but it must stop before presenter redesign, `MainUiFlow` redesign, registry work, or task/house contract expansion. The target is one narrow main-runtime orchestration seam that owns covered request routing and follow-up while `state-sync-runtime` remains the write-back sink.

**Tech Stack:** TypeScript, `src/main.ts`, runtime orchestration seam, startup coordinator, `src/core/runtime/state-sync-runtime.ts`, `tests/robustness.test.cjs`, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `not-started`
- Last Updated: `2026-07-03`
- Current Focus: `Plan created; implementation has not started.`
- Next Step: `Start Task 1 Step 1.`
- Verification: `2026-07-03: npm run lint:plans (pass)`
- Notes: `This child fails if it spreads ownership across multiple unrelated seams or drifts into presenter/render redesign.`

## Progress Log

- 2026-07-03
  - Summary: `Plan created from the approved main-runtime orchestration ownerization spec. Child 24 is the only active child in the fresh weekly set and has not started implementation yet.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Start Task 1 Step 1.`
- 2026-07-03
  - Summary: `Plan governance recheck passed. Child 24 remains not-started, but the fresh plan and weekly set now satisfy repository plan-lint rules and are ready for execution.`
  - Verification: `npm run lint:plans (pass)`
  - Next: `Start Task 1 Step 1.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-03-child-24-main-runtime-orchestration-ownerization-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-03-main-runtime-ownerization-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `Child 23 removed startup-family request selection from main.ts, but startup session apply still owns business orchestration through active content sync plus app-state bootstrap sequencing.`
  - `main.ts` still directly invokes covered story/event/scene progression helpers and still mutates gameplay state through render-time passive trigger sync.`
  - `state-sync-runtime.ts` already provides a viable write-back sink and should remain the single sink unless implementation proves otherwise.`

## Implementation Scope

### In Scope

- one explicit main-runtime orchestration seam
- covered startup session apply business orchestration extraction
- covered story / event / scene follow-up extraction
- passive render-time gameplay mutation extraction
- fixed ownership statement for request entry, runtime decision owner, follow-up owner, and state write-back sink
- targeted ownership regressions and weekly artifact updates

### Still Out Of Scope

- presenter or render markup redesign
- `MainUiFlow` redesign
- task-runtime contract redesign
- house-runtime mod registration redesign
- contribution-registry work
- content-pack direct-import cleanup
- converting every shell callback into runtime-owned code

## File Map

### Existing files to modify

- `src/main.ts`
  - Stop owning covered runtime-business orchestration and consume the new orchestration seam.
- `src/application/startup/startup-session-coordinator.ts`
  - Align startup result shape if session apply ownership moves behind the new orchestration seam.
- `src/core/runtime/state-sync-runtime.ts`
  - Keep or formalize the single write-back sink if the new orchestration seam needs a narrow wrapper.
- `tests/robustness.test.cjs`
  - Add ownership regressions proving the covered business seams moved out of `main.ts`.
- `docs/change-log.md`
  - Record the Child 24 boundary outcome once implementation closes.
- `docs/superpowers/plans/2026-07-03-child-24-main-runtime-orchestration-ownerization-plan.md`
  - Record execution progress and closeout.
- `docs/superpowers/plans/2026-07-03-main-runtime-ownerization-weekly-orchestration-plan.md`
  - Sync queue state and weekly closeout when the child finishes.

### New files to create

- `src/application/runtime/main-runtime-orchestrator.ts`
  - Own covered runtime request routing, covered follow-up, and startup session apply orchestration outside `main.ts`.

## Verification Plan

- Targeted verification:
  - `npm run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "child 24 main runtime orchestrator|child 24 main runtime follow-up ownership|child 24 passive render trigger extraction|child 23 startup coordinator|child 22 continue path|child 22 restore path"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `npm run lint:plans`

## Task 1: Recheck The Main Runtime Ownership Baseline

**Files:**
- Read: `src/main.ts`
- Read: `docs/superpowers/specs/2026-07-03-child-24-main-runtime-orchestration-ownerization-spec.md`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-03-child-24-main-runtime-orchestration-ownerization-plan.md`

- [ ] **Step 1: Enumerate the remaining covered business owners in `main.ts`**

Record the exact helpers and call chains that still own:

- startup session apply business orchestration
- covered story / event / scene follow-up
- passive render-time trigger mutation

- [ ] **Step 2: Add failing ownership regressions**

Add red tests that prove:

- `main.ts` still directly owns the covered business orchestration seams before extraction
- a dedicated main-runtime orchestration module does not yet exist
- Child 23 startup-coordinator and Child 22 restore/continue parity remain the baseline guards

- [ ] **Step 3: Run the targeted red tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "child 24 main runtime orchestrator|child 24 main runtime follow-up ownership|child 24 passive render trigger extraction|child 23 startup coordinator|child 22 continue path|child 22 restore path"
```

Expected:

- at least one new Child 24 ownership guard fails before implementation

- [ ] **Step 4: Record the baseline result in plan state**

Update `Execution State` and `Progress Log` with the unchanged or narrowed baseline.

## Task 2: Introduce The Main Runtime Orchestration Seam

**Files:**
- Create: `src/application/runtime/main-runtime-orchestrator.ts`
- Modify: `src/core/runtime/state-sync-runtime.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add the orchestration module and narrow contract**

Create one orchestration seam that accepts shell-originated requests and owns:

- covered runtime route selection
- covered follow-up chaining
- one documented write-back call path

- [ ] **Step 2: Keep state write-back converged through one sink**

If needed, add a narrow helper around `state-sync-runtime.ts`, but do not create a second business write-back owner.

- [ ] **Step 3: Re-run the targeted ownership tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "child 24 main runtime orchestrator|child 24 main runtime follow-up ownership"
```

Expected:

- the new seam is detectable and the ownership tests pass or move to the next failing point

## Task 3: Rewire Startup Session Apply And Covered Follow-Up

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/runtime/main-runtime-orchestrator.ts`
- Modify: `src/application/startup/startup-session-coordinator.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Move startup session apply business orchestration out of `main.ts`**

Rewire the startup apply path so `main.ts` consumes a prepared runtime-owned session apply result instead of owning active content sync plus bootstrap sequencing itself.

- [ ] **Step 2: Move covered story / event / scene follow-up behind the new seam**

Rewire covered scene progression, story trigger follow-up, and related covered handoffs so `main.ts` no longer directly owns those business call chains.

- [ ] **Step 3: Re-run targeted green tests**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "child 24 main runtime orchestrator|child 24 main runtime follow-up ownership|child 23 startup coordinator|child 22 continue path|child 22 restore path"
```

Expected:

- Child 24 ownership tests pass
- Child 23 and Child 22 guardrails remain green

## Task 4: Remove Passive Render-Time Gameplay Mutation

**Files:**
- Modify: `src/main.ts`
- Modify: `src/application/runtime/main-runtime-orchestrator.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Extract passive trigger sync from the render pre-pass**

Move passive gameplay mutation out of `renderApp()` and place it behind an explicit orchestration-owned sync path.

- [ ] **Step 2: Preserve presenter/render semantics**

Keep `renderApp()` focused on presenter preparation and DOM render scheduling without redesigning presenter output or markup shape.

- [ ] **Step 3: Re-run the full targeted ownership suite**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "child 24 main runtime orchestrator|child 24 main runtime follow-up ownership|child 24 passive render trigger extraction|child 23 startup coordinator|child 22 continue path|child 22 restore path"
```

Expected:

- all Child 24 ownership tests pass
- prior startup/restore guards remain green

- [ ] **Step 4: Run the full verification gate**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass

## Task 5: Close Out Child 24 Governance

**Files:**
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-03-child-24-main-runtime-orchestration-ownerization-plan.md`
- Modify: `docs/superpowers/plans/2026-07-03-main-runtime-ownerization-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-weekly-call-flows.md`
- Modify: `docs/superpowers/weekly/2026-07-03-main-runtime-ownerization-weekly-architecture-report.md`

- [ ] **Step 1: Record the Child 24 boundary outcome**

Document the fixed ownership answers for:

- request entry
- runtime decision owner
- follow-up owner
- state write-back sink

- [ ] **Step 2: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [ ] `src/main.ts` no longer directly owns the covered startup session apply business orchestration.`
- [ ] `src/main.ts` no longer directly owns the covered story / event / scene follow-up chain.`
- [ ] `renderApp()` no longer mutates gameplay state through passive trigger sync before presenter/render output.`
- [ ] one explicit orchestration seam exists for covered runtime-business routing and follow-up.`
- [ ] state write-back still converges through one documented sink.`
- [ ] Targeted regression coverage passes.`

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
