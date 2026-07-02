# Child 16 Event + Scene Handoff Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the remaining covered shell-owned story handoff line so covered event activation and event-to-scene handoff become runtime-owned on the narrowed `triggerStoryEventsForTiming()` production path.

**Architecture:** Child 16 becomes the active executable child only after the post-Child-15 baseline recheck. That recheck narrows the child to the concrete covered story-trigger line still visible in production today: `triggerStoryEventsForTiming()` and its current `city-enter` plus `indoor-screen-shown` call sites in `src/main.ts`. Child 16 must keep navigation/time, interactive, and broader story-system redesign out of scope.

**Tech Stack:** TypeScript, Node test runner (`tests/robustness.test.cjs`), existing event/scene runtime seams, `npm run typecheck`, `npm test`, `npm run build`, `npm run lint:plans`

## Execution State

- Status: `completed`
- Last Updated: `2026-07-02`
- Current Focus: `Child 16 is closed. The covered city-enter and indoor-screen-shown story trigger paths now route through one runtime-owned story-trigger seam, and the weekly set no longer has another same-type child behind it.`
- Next Step: `No further execution inside Child 16. Any later continuation must start from a new weekly review and identify a different problem type.`
- Verification: `node --test tests/robustness.test.cjs --test-name-pattern "child 16|event runtime|scene runtime|story trigger"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
- Notes: `Child 16 stayed inside its narrowed triggerStoryEventsForTiming() boundary. It did not reopen navigation/time scope and did not expand into broader story-system redesign.`

## Progress Log

- 2026-07-02
  - Summary: `Child 16 baseline recheck completed after Child 15 closeout and the result is narrowed rather than unchanged. The active executable scope is now limited to the concrete covered story handoff path still present in src/main.ts: triggerStoryEventsForTiming() with the current city-enter and indoor-screen-shown production call sites. Child 16 is promoted to active and this executable plan is authored against that narrowed baseline.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 1 Step 1.`
- 2026-07-02
  - Summary: `Completed Child 16 against the narrowed baseline. The remaining covered triggerStoryEventsForTiming() production line in src/main.ts was audited, red tests were added first, and the production path now routes through runStoryTriggerRuntime() instead of shell-side runEventRuntime() + runSceneFromEvent() stitching. Covered city-enter and indoor-screen-shown story handoff now share one runtime-owned seam while main.ts keeps only shell-facing call sites and appState write-back.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "child 16|event runtime|scene runtime|story trigger"` + `npm run typecheck` + `npm test` + `npm run build` + `npm run lint:plans`
  - Next: `Close the weekly set because the visible queue has been consumed and no same-type queued child remains.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-02-child-16-event-scene-handoff-convergence-spec.md`
- Weekly set plan:
  - `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`

## Baseline Recheck

- Recheck result: `narrowed`
- Notes:
  - `The concrete covered event/scene target is now the triggerStoryEventsForTiming() line in src/main.ts rather than a broader historical event family sweep.`
  - `The currently observed covered production call sites are limited to city-enter follow-up after navigation dispatch and indoor-screen-shown passive trigger sync.`
  - `Scene action continuation, battle follow-up, content/schema redesign, and broader story-system work all remain outside this child.`

## Implementation Scope

### In Scope

- audit of the remaining covered `triggerStoryEventsForTiming()` mixed handoff tails
- targeted red-to-green regression coverage for the narrowed Child 16 ownership boundary
- covered event activation convergence for the current `city-enter` and `indoor-screen-shown` production lines
- covered event -> scene handoff convergence for the same narrowed story-trigger line
- minimum shell-side story handoff reduction needed for that narrowed line
- required weekly/governance sync

### Still Out Of Scope

- navigation/time convergence
- interactive legacy cleanup
- house runtime redesign
- new runtime contract families
- broader story-system redesign
- content/schema redesign
- scene action continuation redesign
- battle follow-up redesign
- boot/startup, save/load, mod, presenter, UI, or StateSync redesign

## File Map

### Existing files to modify

- `src/core/runtime/event-runtime.ts`
  - Converge the covered event activation production line on a clearer runtime-owned handoff.
- `src/core/runtime/scene-runtime.ts`
  - Converge the covered event -> scene production handoff on a clearer runtime-owned line.
- `src/main.ts`
  - Reduce the remaining shell-owned story handoff orchestration for the narrowed covered paths.
- `tests/robustness.test.cjs`
  - Add red-to-green regression coverage for the narrowed Child 16 ownership boundary.
- `docs/superpowers/specs/2026-07-02-child-16-event-scene-handoff-convergence-spec.md`
  - Record the narrowed post-Child-15 baseline and active-child status.
- `docs/superpowers/plans/2026-07-02-child-16-event-scene-handoff-convergence-plan.md`
  - Record execution state, progress, and closeout.
- `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
  - Sync Child 16 promotion state and queue truth.
- `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
  - Keep the visibility companion aligned once Child 16 work starts or closes.
- `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
  - Record Child 16 promotion, verification, and queue state.
- `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
  - Record the narrowed event/scene owner targets.
- `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
  - Record the current pre-Child-16 story handoff baseline and later converged flow.
- `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
  - Keep later split recommendations synchronized once Child 16 is active.
- `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
  - Keep runtime maturity and queue state synchronized.

### Existing files to read

- `src/core/contracts/runtime-result.ts`
- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/event-runtime.ts`
- `src/core/runtime/scene-runtime.ts`
- `src/main.ts`

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "child 16|event runtime|scene runtime|story trigger"`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Task 1: Audit Narrowed Story Handoff Tails

**Files:**
- Read: `docs/superpowers/specs/2026-07-02-child-16-event-scene-handoff-convergence-spec.md`
- Read: `src/core/runtime/event-runtime.ts`
- Read: `src/core/runtime/scene-runtime.ts`
- Read: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Enumerate the remaining covered story handoff tails**

Record the exact covered `triggerStoryEventsForTiming()` production tails that still depend on shell-owned orchestration in `src/main.ts`.

- [x] **Step 2: Add failing regression tests for the narrowed Child 16 boundary**

Write red tests that prove the covered event activation and event -> scene handoff paths are not yet fully runtime-owned.

- [x] **Step 3: Run the targeted red tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "child 16|event runtime|scene runtime|story trigger"
```

Expected:

- at least one named covered story handoff ownership tail fails before implementation

- [x] **Step 4: Record the audit result in the plan state**

Update this plan's `Execution State` and `Progress Log` with the enumerated remaining paths before moving into implementation.

## Task 2: Converge Covered Event Activation Ownership

**Files:**
- Modify: `src/core/runtime/event-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Implement the minimum covered event activation convergence**

Move the covered story-trigger event activation line onto a clearer runtime-owned path and reduce the direct shell-owned activation stitching in `src/main.ts`.

- [x] **Step 2: Re-run the targeted event tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "child 16|event runtime|story trigger"
```

Expected:

- the covered event activation ownership tests pass

- [x] **Step 3: Run the full verification gate for Task 2**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without reopening unrelated runtime-family failures

## Task 3: Converge Covered Event -> Scene Handoff Ownership

**Files:**
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Implement the minimum covered scene handoff convergence**

Move the covered event -> scene handoff line onto a clearer runtime-owned path and reduce the direct shell-owned scene stitching in `src/main.ts`.

- [x] **Step 2: Re-run the targeted scene tests**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "child 16|scene runtime|story trigger"
```

Expected:

- the covered scene ownership tests pass

- [x] **Step 3: Run the full verification gate for Task 3**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- all commands pass without reopening unrelated runtime-family failures

## Task 4: Reduce Shell Story Residue And Close Out Governance

**Files:**
- Modify: `src/main.ts`
- Modify: `docs/superpowers/specs/2026-07-02-child-16-event-scene-handoff-convergence-spec.md`
- Modify: `docs/superpowers/plans/2026-07-02-child-16-event-scene-handoff-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-07-02-weekly-implementation-visibility-plan.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-review-index.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-module-map.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-call-flows.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-next-split-review.md`
- Modify: `docs/superpowers/weekly/2026-07-02-weekly-architecture-report.md`
- Modify: `docs/change-log.md`

- [x] **Step 1: Reduce retained shell-only story residue for the covered paths**

Keep only shell-facing input/output duties in `src/main.ts` for the covered Child 16 paths and explicitly record any bounded residue that must remain outside Child 16.

- [x] **Step 2: Update weekly artifacts and queue truth**

Record Child 16 outcome, verification state, and any remaining later-child recommendation across the `2026-07-02` artifact bundle.

- [x] **Step 3: Run governance verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `Superpowers plan lint passed`

## Exit Check

- [x] covered story-trigger event activation ownership is runtime-owned
- [x] covered story-trigger event -> scene handoff ownership is runtime-owned
- [x] `src/main.ts` keeps only shell-facing duties on the covered Child 16 paths
- [x] Child 16 does not reopen navigation/time scope
- [x] Child 16 does not expand into broader story-system redesign
- [x] targeted regression coverage passes
- [x] weekly artifacts are updated
- [x] weekly queue state is updated

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded
