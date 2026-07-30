# Event Router Runtime Core Phase A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the first usable event-router runtime kernel into the current baseline so covered runtime paths can emit `eventId`, resolve a canonical event entity, dispatch by event kind, and settle gameplay mutation through the centralized runtime settlement seam without changing UI ownership or rewriting script-editor schemas.

**Architecture:** This child only implements Phase A from `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`. The branch already has event activation, event binding, runtime dispatch, and settlement seams, but they are still fragmented and caller-specific. This child first locks the canonical runtime event entity and router contract inside `src/core/**`, then adds only the thinnest application/runtime adapters needed to feed that router without broad `main.ts`, UI, map, backpack, or script-editor rewiring. Separate event-chain or settlement-command files are only introduced if RED coverage proves the audited kernel cannot stay within the existing dispatch/settlement seam.

**Tech Stack:** TypeScript, Vite test build, Node test runner, runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Phase A is now locally complete and review-clean inside the audited seam: canonical event-router contract/runtime owner exist, covered story-trigger bindings dispatch through the shared router/dispatch path, settlement ownership stays centralized, and optional event-chain/settlement-command owners remain explicitly deferred because RED never proved they were required.`
- Next Step: `Decide whether to commit/push this local Phase A checkpoint and merge it back to the aligned baseline, or keep it as a local completed-but-open checkpoint before promoting a later phase.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event router runtime core|event chain runtime|settlement command runtime|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
- Notes: `This child still must not rewrite external script-editor project files or scenario-pack schemas. docs/superpowers/project-progress.md remains intentionally unrelated because the user kept this Phase A work isolated from broader promotion. The branch was already dirty before this task; Task 5 stayed inside the requested write scope and updated the stale task-action/task-signal robustness assertion to the current canonical taskInputs contract only because the exact required robustness command still executed that in-scope check.`

## Progress Log

- 2026-07-30
  - Summary: `Created the executable Phase A child plan from the approved event-router runtime core design.`
  - Verification: `Plan authoring only; implementation verification not started.`
  - Next: `Promote this child, re-open docs/superpowers/project-progress.md, then audit the exact mod-first-dev event-router kernel boundary before writing RED tests.`
- 2026-07-30
  - Summary: `Completed Task 1 audit and locked the Phase A kernel boundary: reuse the existing mod-first-derived binding selection semantics plus the current branch-owned dispatch/settlement seam, keep script-editor/schema compatibility surfaces deferred, and keep project-progress intentionally unrelated until explicit promotion.`
  - Verification: `git status --short --branch`; `sed -n '1,220p' docs/superpowers/project-progress.md`; `sed -n '1,260p' docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`; `sed -n '1,260p' src/core/runtime/event-binding-runtime.ts`; `sed -n '1,260p' src/core/runtime/runtime-router.ts`; `sed -n '1,320p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,260p' src/core/runtime/runtime-settlement.ts`; `sed -n '1,260p' src/application/story/story-runtime.ts`; `git show origin/mod-first-dev:src/core/runtime/event-binding-runtime.ts | sed -n '1,420p'`; `git show origin/mod-first-dev:src/core/runtime/runtime-router.ts | sed -n '1,260p'`; `git show origin/mod-first-dev:src/core/runtime/runtime-dispatch.ts | sed -n '1,340p'`; `sed -n '1,320p' src/core/runtime/mod-first-compatibility.ts`; `sed -n '1,240p' src/core/contracts/event-runtime.ts`; `sed -n '1,280p' src/core/contracts/runtime-result.ts`; `sed -n '1,260p' src/core/contracts/effect-settlement.ts`; `sed -n '1,260p' src/core/contracts/runtime-request.ts`
  - Next: `If the user promotes this child, write RED contract tests only for the audited kernel seam and keep the deferred schema/editor compatibility layers out of scope.`
- 2026-07-30
  - Summary: `Applied Task 1 review follow-up clarifications so the runnable audit checklist matches the declared file scope and the Phase A boundary text now distinguishes reused mod-first-dev semantics from current-branch-owned router/dispatch seams.`
  - Verification: `Plan text review only.`
  - Next: `Task 1 is review-clean; proceed to Task 2 RED coverage when this child is promoted for execution.`
- 2026-07-30
  - Summary: `Completed Task 2 RED coverage inside tests only: added a dedicated event-router runtime suite, extended runtime-dispatch-settlement coverage to reject router-owned pre-settled payload ownership, and added robustness guards that require a canonical event-router contract/runtime owner.`
  - Verification: `pnpm run build:test` failed initially because the shell PATH did not expose node; reran as `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` and it passed. `pnpm exec node --test tests/event-router-runtime.test.cjs` failed initially for the same PATH issue; reran with the same PATH fix and got 3 failing tests, all expected RED failures (missing src/core/contracts/event-router.ts and missing .test-dist/core/runtime/event-router.js). `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` failed initially for the same PATH issue; reran with the PATH fix and got 1 expected RED failure proving router-supplied settlement payloads still leak through instead of being replaced by runtime-settlement ownership. `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router seam is anchored to the canonical event-router contract|event-router runtime owner exists and dispatches canonical event kinds"` was rerun after narrowing the assertions; it surfaced the two expected event-router RED failures plus one unrelated pre-existing task-input robustness failure from the already-dirty branch, so the Task 2 signal remains limited to the missing canonical contract/runtime owner.`
  - Next: `Implement Task 3 against the current dispatch/settlement seam, keep optional event-chain and settlement-command files deferred, and do not touch protected shell/UI/map/backpack/style paths.`
- 2026-07-30
  - Summary: `Completed Task 3 inside the requested write scope: added src/core/contracts/event-router.ts, added the thin src/core/runtime/event-router.ts owner, anchored src/core/runtime/runtime-router.ts to the canonical contract without widening its public RuntimeRouteResult alias, and updated src/core/runtime/runtime-dispatch.ts so routed effect settlement metadata is synthesized by runtime-settlement instead of leaking router-supplied ownership.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 3/3. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 6/6. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router seam is anchored to the canonical event-router contract|event-router runtime owner exists and dispatches canonical event kinds"` still ran into the already-dirty branch's unrelated pre-existing failing task-input robustness test (`runtime dispatch settles routed task actions and signals into unified task state`), but the two Task 3 event-router assertions both passed. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed. `git diff --check` passed.`
  - Next: `Stop here for the isolated Task 3 handoff unless the user explicitly promotes later Phase A tasks.`
- 2026-07-30
  - Summary: `Applied Task 3 review follow-up fixes: made settlement.effects an explicit enumerable field in the runtime-settlement-owned summary, prevented missing event ids from dispatching through a future bridge handler by treating them as clean misses, and updated the Task 3 note text to remove the stale Task 2-only wording.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` rebuilt `.test-dist`. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 3/3. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 6/6. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/state-sync-runtime-commit.test.cjs` passed 2/2. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router seam is anchored to the canonical event-router contract|event-router runtime owner exists and dispatches canonical event kinds"` still surfaced the already-dirty branch's unrelated pre-existing failing task-input robustness test, while both targeted event-router assertions passed. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed. `git diff --check` passed.`
  - Next: `Task 3 is ready for final review closeout; stop here unless the user explicitly promotes later Phase A tasks.`
- 2026-07-30
  - Summary: `Completed Task 5 inside the requested write scope: event-binding now exposes a router-fed selection seam while keeping the legacy wrapper intact, covered story-trigger bindings route through dispatchEventRoute + dispatchRuntimeRequest, story post-route settlement remains thin, and focused dispatch/robustness coverage now guards centralized settlement ordering plus the shared router path.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 3/3. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs` passed 7/7. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event router runtime core|event chain runtime|settlement command runtime|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 406/406 on this branch after aligning the stale in-scope task-input robustness assertion with the canonical taskInputs contract. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed.`
  - Next: `Stop at the isolated Task 5 handoff unless the user explicitly promotes Task 6 closeout or a later Phase A task.`
- 2026-07-30
  - Summary: `Completed Task 6 governance sync for this local checkpoint: boundary proof stayed clean, plan lint still fails only on the unrelated pre-existing 2026-07-23 title issue, child closeout is now recorded as completed-but-open, and the parent handoff resume point can move to this Phase A checkpoint.`
  - Verification: `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output. `git diff --check` passed. `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Use this child as a completed-but-open local checkpoint until commit/push/merge-back or later phase promotion is explicitly chosen.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The branch currently contains local runtime-only convergence work that is not yet merged into the aligned baseline; this child is planned on top of that local checkpoint and should not assume a clean merge-back state until the user chooses to promote/execute it.
  - The approved design explicitly keeps script-editor project file/schema redesign out of Phase A even though later phases will touch `src/modules/script-editor/**` and scenario-pack data shapes.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- introduce a canonical internal event entity contract in `src/core/contracts/**`
- introduce or refactor one shared event router entry inside `src/core/runtime/**`
- adapt covered existing event-runtime / event-binding / dispatch seams so they can resolve and dispatch canonical event entities
- preserve centralized covered routed gameplay mutation through the existing runtime settlement seam instead of adding new direct feature-owned mutations
- only introduce separate event-chain or settlement-command files if Task 2 RED coverage proves the audited kernel cannot stay within the existing dispatch/settlement seam
- add focused runtime tests and ownership/robustness assertions for the new kernel
- sync child/handoff docs after implementation

### Still Out Of Scope

- rewriting `src/main.ts` into a full event-emitter shell
- broad UI, map, backpack, style, or presenter redesign
- full script-editor schema redesign
- full scenario-pack schema unification
- item/menu/house/dialogue authoring migration beyond the minimal adapters needed to feed the Phase A router
- deleting all legacy runtime callers in one pass
- any direct merge of `origin/mod-first-dev`

### Audit-Locked Phase A Boundary

- Reused from the audited mod-first-dev kernel:
  - the event-binding candidate semantics already extracted into `src/core/runtime/mod-first-compatibility.ts`: supported owner/trigger filtering, canonicalized building-owner matching, occurrence gating, nested condition evaluation, candidate priority ordering, and `taskInputs` capture
- Current-branch seams intentionally retained in Phase A:
  - the current `src/core/runtime/runtime-router.ts` seam remains the shared router/follow-up typing owner
  - the current branch `src/core/runtime/runtime-dispatch.ts` plus `src/core/runtime/runtime-settlement.ts` remain the settlement/follow-up owner; Phase A must layer the canonical event-router contract onto these files rather than regress to the simpler `origin/mod-first-dev` dispatch shape
- Coupling discovered and deferred out of Phase A:
  - direct application orchestration such as `startEvent(...)`, `continueToEvent(...)`, scene advancement, and story settlement/progression flows remain caller-owned adapters, not kernel code
  - compatibility/editor-shape bridges in `src/core/runtime/mod-first-compatibility.ts` such as scene/dialogue conversion and playable/flow action overlays are not part of the canonical router contract
  - broader script-editor/schema/project-file convergence remains deferred to later phases even if the mod-first-dev branch contains related runtime-adjacent helpers
  - `docs/superpowers/project-progress.md` remains intentionally unrelated until the user explicitly promotes this child

### Covered Caller Surfaces Allowed In Phase A

- `src/core/runtime/event-binding-runtime.ts`
  - allowed to swap direct activation output for the canonical routed-event seam while reusing the audited binding-selection kernel
- `src/application/story/story-runtime.ts`
  - allowed to adapt only `triggerStoryEventBindings(...)` and `createStoryEventBindingTriggerContext(...)` into a thin story-to-router trigger bridge
- `src/core/runtime/runtime-router.ts`
  - allowed to own the canonical route input/result typing and continuation metadata
- `src/core/runtime/runtime-dispatch.ts`
  - allowed to consume the routed result and preserve current settlement/follow-up behavior
- `src/core/runtime/runtime-settlement.ts`
  - allowed to keep centralized effect/progression settlement ownership for the covered routed path
- Explicitly not covered in Phase A:
  - `startStoryEventById(...)`, `continueStoryFromSourceEvent(...)`, scene-choice progression, progression review/council flow, `src/main.ts`, UI/map/backpack/style wiring, or any shell widening outside the listed adapters

## File Map

### Audit Scope Lock

- Mandatory canonical contract files for Phase A after Task 1:
  - create `src/core/contracts/event-router.ts`
  - reuse `src/core/contracts/runtime-request.ts`
  - reuse `src/core/contracts/runtime-result.ts`
  - reuse `src/core/contracts/effect-settlement.ts`
  - keep `src/core/contracts/event-runtime.ts` as a legacy adapter contract only; do not expand it into the canonical router contract
- Deferred from the mandatory Phase A kernel unless later RED tests prove they are required:
  - `src/core/contracts/settlement-command.ts`
  - `src/core/runtime/event-repository.ts`
  - `src/core/runtime/event-chain-runtime.ts`
  - `src/core/runtime/settlement-command-runtime.ts`

### Existing files to modify

- `src/core/contracts/runtime-result.ts`
  - Keep the shared routed result envelope and add only the canonical event-router data needed by the audited kernel without removing current compatibility follow-up surfaces.
- `src/core/contracts/runtime-request.ts`
  - Reuse the current request families as the outer route entry and add metadata only if the RED contract proves it is necessary.
- `src/core/runtime/runtime-router.ts`
  - Keep the shared router seam and attach the canonical event-router contract to it instead of porting the origin file wholesale.
- `src/core/runtime/runtime-dispatch.ts`
  - Preserve the current branch-owned settlement/follow-up sequencing while consuming the canonical routed-event result.
- `src/core/runtime/runtime-settlement.ts`
  - Reuse the existing centralized effect/progression settlement runtime rather than introducing a second settlement engine in Task 2.
- `src/core/runtime/event-binding-runtime.ts`
  - Adapt the binding caller to emit the canonical routed-event seam while reusing the already-extracted mod-first candidate/evaluation logic.
- `src/application/story/story-runtime.ts`
  - Limit changes to the thin `triggerStoryEventBindings(...)` / `createStoryEventBindingTriggerContext(...)` adapter path; leave direct story start/continue orchestration alone in Phase A.

### Existing files expected to be deleted

- `None expected in Phase A.`

### New files to create

- `src/core/contracts/event-router.ts`
  - Canonical internal event entity, trigger metadata, route request/result aliases, and continuation metadata for the Phase A kernel.
- `src/core/runtime/event-router.ts`
  - Optional thin implementation file if Task 2 RED tests show the existing `RuntimeRouter` interface needs a dedicated event-router owner rather than adapter-only changes.

## Verification Plan

- Targeted verification:
  - canonical event entities can be resolved from current content shapes without script-editor schema rewrite
  - one runtime router dispatches by event kind and returns standardized results
  - covered gameplay mutation on the routed path stays centralized in the existing runtime settlement seam
  - no extra event-chain or settlement-command runtime files are introduced unless their need is proven by RED coverage
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `pnpm run build:test`
  - `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`
  - `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event router runtime core|event chain runtime|settlement command runtime|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `pnpm run lint:plans`
- Optional only if later tasks create them:
  - `pnpm exec node --test tests/event-chain-runtime.test.cjs`
  - `pnpm exec node --test tests/settlement-command-runtime.test.cjs`

## Task 1: Audit The mod-first-dev Kernel Boundary

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Read: `src/core/runtime/event-binding-runtime.ts`
- Read: `src/core/runtime/runtime-router.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/runtime-settlement.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `origin/mod-first-dev:src/core/runtime/event-binding-runtime.ts`
- Read: `origin/mod-first-dev:src/core/runtime/runtime-router.ts`
- Read: `origin/mod-first-dev:src/core/runtime/runtime-dispatch.ts`
- Modify: `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`

- [x] **Step 1: Record the exact kernel slice to migrate**

Run:

```bash
git status --short --branch
sed -n '1,220p' docs/superpowers/project-progress.md
sed -n '1,260p' docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md
sed -n '1,260p' src/core/runtime/event-binding-runtime.ts
sed -n '1,260p' src/core/runtime/runtime-router.ts
sed -n '1,320p' src/core/runtime/runtime-dispatch.ts
sed -n '1,260p' src/core/runtime/runtime-settlement.ts
sed -n '1,260p' src/application/story/story-runtime.ts
git show origin/mod-first-dev:src/core/runtime/event-binding-runtime.ts | sed -n '1,260p'
git show origin/mod-first-dev:src/core/runtime/runtime-router.ts | sed -n '1,260p'
git show origin/mod-first-dev:src/core/runtime/runtime-dispatch.ts | sed -n '1,320p'
```

Expected:

- a written audit of which parts of the mod-first-dev kernel are reusable as-is
- a written audit of which parts are coupled to later schema/editor phases and must stay out of Phase A
- confirmation that project-progress remains intentionally unrelated until the user explicitly promotes this child

Audit record:

- Reusable as-is:
  - `origin/mod-first-dev:src/core/runtime/event-binding-runtime.ts` contributes the binding-selection kernel now already living in `src/core/runtime/mod-first-compatibility.ts`: trigger matching, owner matching, occurrence gating, condition evaluation, and deterministic candidate ordering.
  - `origin/mod-first-dev:src/core/runtime/runtime-router.ts` contributes only the shared route/follow-up seam shape; there is no larger router implementation in the audited slice to port wholesale.
  - `origin/mod-first-dev:src/core/runtime/runtime-dispatch.ts` confirms the kernel expects router -> settlement -> follow-up sequencing, but the local branch must keep its newer `taskUpdates`, `outcome`, and `interactive` handling rather than revert to the origin file.
- Coupled and deferred:
  - direct `startEvent(...)` story/application orchestration in the current `event-binding-runtime.ts` and `story-runtime.ts` remains an adapter concern, not part of the canonical kernel
  - compatibility/editor-shape helpers inside `src/core/runtime/mod-first-compatibility.ts` for scene/dialogue conversion and playable/flow launch overlays are later-phase compatibility work, not Phase A kernel contract
  - no audited origin file in this Task 1 slice establishes a standalone event repository, event-chain engine, or settlement-command runtime, so those remain optional/deferred until RED tests prove they are needed
- Project-progress confirmation:
  - `docs/superpowers/project-progress.md` still points at the unrelated campaign-hex runtime grid child and is intentionally left unchanged until the user explicitly promotes this event-router child
- Reviewer-context note:
  - `git status --short --branch` showed the branch was already dirty before Task 1. Task 1 itself stayed within the requested write scope and only updated this Phase A plan file.

- [x] **Step 2: Sync the plan scope after the audit**

Document:

- the exact canonical contract files to create or reuse
- the exact covered caller surfaces that Phase A is allowed to adapt
- any coupling discovered that must stay deferred to later phases

Scope sync result:

- Canonical contract files:
  - create `src/core/contracts/event-router.ts`
  - reuse `src/core/contracts/runtime-request.ts`
  - reuse `src/core/contracts/runtime-result.ts`
  - reuse `src/core/contracts/effect-settlement.ts`
  - keep `src/core/contracts/event-runtime.ts` as legacy adapter-only typing
- Covered caller surfaces:
  - `src/core/runtime/event-binding-runtime.ts`
  - `src/application/story/story-runtime.ts` only through `triggerStoryEventBindings(...)` and `createStoryEventBindingTriggerContext(...)`
  - `src/core/runtime/runtime-router.ts`
  - `src/core/runtime/runtime-dispatch.ts`
  - `src/core/runtime/runtime-settlement.ts`
- Deferred coupling:
  - script-editor/schema/editor compatibility bridges
  - non-trigger-based story start/continue flows
  - broader shell/UI/map/backpack/style ownership changes
  - separate event repository / event-chain / settlement-command runtime files unless later RED tests make them mandatory

## Task 2: Lock The Canonical Contracts With RED Tests

**Files:**
- Create: `tests/event-router-runtime.test.cjs`
- Modify: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Optional/Deferred: `tests/event-chain-runtime.test.cjs`
- Optional/Deferred: `tests/settlement-command-runtime.test.cjs`

- [x] **Step 1: Write failing contract coverage for canonical event entities**

Add tests that require:

- one canonical event entity contract
- router dispatch by event `kind`
- standardized routed result shape
- centralized settlement ownership on the routed path

Representative RED coverage:

```js
test("event router resolves a canonical event entity and dispatches by kind", async () => {
  const { dispatchEventRoute } = require("../.test-dist/core/runtime/event-router.js");

  const result = dispatchEventRoute({
    state: createBaseRuntimeState(),
    eventId: "event.test.dialogue",
    context: {
      repository: {
        resolveById: (eventId) =>
          eventId === "event.test.dialogue"
            ? {
                id: eventId,
                kind: "dialogue",
                payload: { dialogueId: "dialogue.test.entry" },
              }
            : null,
      },
      handlers: {
        dialogue: ({ state, event }) => ({
          state,
          dialogue: { id: event.payload.dialogueId, name: "Test", nodes: [] },
        }),
      },
    },
  });

  assert.equal(result.dialogue?.id, "dialogue.test.entry");
});
```

- [x] **Step 2: Write failing coverage for router-to-dispatch settlement ownership**

Add tests that require:

- routed gameplay mutation to stay centralized in `runtime-dispatch.ts` -> `runtime-settlement.ts`
- no direct feature mutation bypass on the new router path

Representative RED coverage:

```js
test("dispatchRuntimeRequest settles router-owned effects through runtime-settlement", async () => {
  const { dispatchRuntimeRequest } = require("../.test-dist/core/runtime/runtime-dispatch.js");

  const result = dispatchRuntimeRequest({
    state: createBaseRuntimeState(),
    request: { family: "external", type: "external", eventId: "event.test" },
    context: {
      router: {
        route: () => ({
          state: createBaseRuntimeState(),
          effects: [{ type: "setFlag", key: "event.test.fired", value: true }],
        }),
      },
    },
  });

  assert.equal(result.state.core.runtime.flags["event.test.fired"], true);
});
```

- [x] **Step 3: Only if RED exposes a real gap, add failing coverage for event-chain / settlement-command follow-ons**

Add optional tests only when the router contract cannot stay inside the audited seam without them:

- `nextEventId` / `emitEventIds[]` continuation coverage if the canonical contract actually needs a separate chain owner
- settlement-command coverage only if `EffectSettlementInput` and the existing settlement seam cannot express the required routed mutation

Representative RED coverage:

```js
test("event chain runtime follows nextEventId through the router with loop guards", async () => {
  const { runEventChain } = require("../.test-dist/core/runtime/event-chain-runtime.js");

  const result = runEventChain({
    state: createBaseRuntimeState(),
    rootEventId: "event.root",
    maxDepth: 4,
    router: {
      dispatchEventRoute: ({ eventId, state }) => ({
        state,
        followUpEvents:
          eventId === "event.root"
            ? ["event.second"]
            : eventId === "event.second"
              ? ["event.third"]
              : [],
      }),
    },
  });

  assert.deepEqual(result.visitedEventIds, ["event.root", "event.second", "event.third"]);
});
```

- [x] **Step 4: Run focused RED verification**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/event-router-runtime.test.cjs
pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs
```

Expected:

- at least one new test fails because the canonical router kernel does not exist yet
- if optional chain/settlement-command tests were added, run them separately and record why the extra seam became necessary

Task 2 result:

- `tests/event-router-runtime.test.cjs` now fails because `src/core/contracts/event-router.ts` and `.test-dist/core/runtime/event-router.js` do not exist yet.
- `tests/runtime-dispatch-settlement.test.cjs` now has one focused RED failure proving `dispatchRuntimeRequest(...)` still returns router-supplied settlement payload ownership instead of a runtime-settlement-owned summary.
- Optional event-chain / settlement-command tests were **not** added because the RED audit still fits inside the existing router/dispatch/settlement ownership; the current failures already isolate the missing Phase A kernel without proving a separate chain or settlement-command owner is mandatory.

## Task 3: Introduce Canonical Event Router Contracts And Thin Runtime Owner

**Files:**
- Create: `src/core/contracts/event-router.ts`
- Modify: `src/core/contracts/runtime-result.ts`
- Create: `src/core/runtime/event-router.ts`
- Optional/Deferred: `src/core/contracts/settlement-command.ts`
- Optional/Deferred: `src/core/runtime/event-repository.ts`
- Optional/Deferred: `src/core/runtime/event-chain-runtime.ts`
- Optional/Deferred: `src/core/runtime/settlement-command-runtime.ts`

- [x] **Step 1: Add the canonical event-router contracts**

Implement the minimum contract surface:

```ts
export type RuntimeEventKind =
  | "dialogue"
  | "navigation"
  | "menu"
  | "playable"
  | "settlement"
  | "composite"
  | "bridge";

export type RuntimeEventEntity = {
  id: string;
  kind: RuntimeEventKind;
  payload: Record<string, unknown>;
  nextEventId?: string | null;
  emitEventIds?: string[];
  metadata?: {
    title?: string;
    tags?: string[];
  };
};

export type RuntimeEventRouteResult = {
  state: RuntimeState;
  effects?: Effect[];
  followUpEvents?: string[];
};
```

- [x] **Step 2: Add a runtime event repository seam**

Create a repository owner that can lower current content into canonical entities without changing external schemas yet.

Representative implementation skeleton:

```ts
export interface RuntimeEventRepository {
  resolveById(eventId: string): RuntimeEventEntity | null;
}
```

- [x] **Step 3: Add the shared event-router entry**

Create the smallest router owner that:

- resolves an event entity
- dispatches by `kind`
- returns standardized results

Representative skeleton:

```ts
export function dispatchEventRoute(input: {
  state: RuntimeState;
  eventId: string;
  context: {
    repository: RuntimeEventRepository;
    handlers: Record<string, (input: { state: RuntimeState; event: RuntimeEventEntity }) => RuntimeEventRouteResult>;
  };
}): RuntimeEventRouteResult {
  const event = input.context.repository.resolveById(input.eventId);
  if (event == null) {
    return { state: input.state };
  }

  const handler = input.context.handlers[event.kind];
  if (handler == null) {
    return { state: input.state };
  }

  return handler({ state: input.state, event });
}
```

- [x] **Step 4: Rebuild test output and re-run focused tests**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/event-router-runtime.test.cjs
```

Expected:

- contract tests still fail only on incomplete router integration or dispatch behavior, not missing modules

## Task 4: Optional Follow-On For Event-Chain And Settlement-Command Owners

**Files:**
- Optional/Deferred: `src/core/runtime/event-chain-runtime.ts`
- Optional/Deferred: `src/core/runtime/settlement-command-runtime.ts`
- Optional/Deferred: `src/core/runtime/runtime-settlement.ts`
- Optional/Deferred: `src/core/contracts/effect-settlement.ts`

Only execute this task if Task 2 RED coverage proves the canonical router contract cannot remain inside the existing dispatch/settlement seam.

- [ ] **Step 1: Add the event-chain owner**

Implement the bounded continuation runner:

```ts
export function runEventChain(input: {
  state: RuntimeState;
  rootEventId: string;
  maxDepth: number;
  router: {
    dispatchEventRoute(input: { state: RuntimeState; eventId: string }): RuntimeEventRouteResult;
  };
}): {
  state: RuntimeState;
  visitedEventIds: string[];
} {
  // queue-based deterministic continuation with maxDepth and duplicate guard
}
```

- [ ] **Step 2: Add the settlement-command owner**

Implement the smallest centralized mutation surface for the covered commands introduced by Phase A.

Representative skeleton:

```ts
export function applySettlementCommands(input: {
  state: RuntimeState;
  commands: SettlementCommand[];
}): {
  state: RuntimeState;
  taskInputs?: RuntimeTaskInput[];
} {
  // apply canonical command mutations here
}
```

- [ ] **Step 3: Keep existing effect settlement as the lower-level executor where useful**

Refactor `runtime-settlement.ts` only as needed so:

- routed event settlement commands use one owner
- existing effect settlement remains reusable instead of duplicated

- [ ] **Step 4: Re-run focused router/chain/settlement tests**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/event-router-runtime.test.cjs tests/event-chain-runtime.test.cjs tests/settlement-command-runtime.test.cjs
```

Expected:

- the three new focused suites pass

## Task 5: Adapt Covered Existing Runtime Seams To The New Router

**Files:**
- Modify: `src/core/runtime/event-binding-runtime.ts`
- Modify: `src/core/runtime/event-activation.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Narrow event-binding/event-activation into router-fed roles**

Refactor these seams so they no longer act like mixed feature orchestrators on the covered path.

Expected direction:

- event binding selects or emits `eventId`
- activation remains a small normalization seam if still needed
- router owns kind dispatch

- [x] **Step 2: Teach shared dispatch to settle routed results centrally**

Extend `runtime-dispatch.ts` so covered routed event results can:

- keep routed gameplay mutation centralized in the existing runtime settlement seam
- enqueue follow-up events through the event-chain owner only if Task 4 became necessary
- preserve existing task settlement / follow-up ordering guarantees

- [x] **Step 3: Keep story/runtime adapters thin**

Only if needed, update `story-runtime.ts` or the closest application seam to lower current story-trigger content into canonical event-router calls without changing authoring shape.

- [x] **Step 4: Add ownership guards against new bypasses**

Update `tests/robustness.test.cjs` so the covered runtime path proves:

- the new event router exists
- covered routed event mutation stays inside the centralized settlement owner chosen by the audited scope
- no new direct feature bypass was added in `main.ts`

- [x] **Step 5: Run focused GREEN verification**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/event-router-runtime.test.cjs
pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs
pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event router runtime core|event chain runtime|settlement command runtime|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"
pnpm run typecheck
```

Expected:

- focused router/dispatch/ownership suites pass
- if Task 4 was required, run the optional chain/settlement-command suites separately and record why the extra owner was necessary
- typecheck passes

## Task 6: Final Verification, Governance Sync, And Merge-Checkpoint Readiness

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`

- [x] **Step 1: Run boundary proof and diff integrity checks**

Run:

```bash
git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles
git diff --check
pnpm run lint:plans
```

Expected:

- boundary diff is empty unless the user explicitly approved a protected-path exception
- `git diff --check` passes
- `pnpm run lint:plans` fails only on the unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` title issue, or passes if that blocker was separately resolved

- [x] **Step 2: Sync child and parent governance state**

Update:

- `Execution State`
- `Progress Log`
- `Exit Check`
- `Completion Checklist`
- `Child Closeout`
- parent handoff resume point

Record whether the checkpoint is only local, committed, pushed, or merged back.

- [x] **Step 3: Leave the child in the correct lifecycle state**

Use:

- `completed-but-open` if code/test work is done but commit/push/closeout is incomplete
- `closed` only if all closeout gates and remote push succeed

## Exit Check

- [x] Canonical internal event entity contracts exist and are used on the covered routed path.
- [x] One shared event router owns event-id-to-runtime dispatch for the covered Phase A path.
- [x] Covered routed gameplay mutation stays centralized in the existing runtime settlement seam; no separate settlement-command owner was required by Phase A RED coverage.
- [x] Event-chain continuation remains explicitly deferred because Phase A RED/GREEN never proved a separate chain owner was required.
- [x] Covered runtime callers use thin event-emitter or router-fed roles instead of direct feature execution on the migrated path.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress sync intentionally remains unchanged because this child was not promoted into `docs/superpowers/project-progress.md`.
- [x] Closeout block is present and the child remains `completed-but-open` rather than `closed` because commit/push/merge-back work has not been recorded.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Event Router Runtime Core Phase A`
- Parent Task: `Mod First Runtime Integration Handoff`
- Parent Stage: `Runtime Migration Narrowing`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Decide whether to commit/push this local Phase A checkpoint, then merge it back to the aligned baseline or promote a later phase from the same verified seam.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Stay on codex/migration-hot-tasks, review the verified Phase A checkpoint, then either commit/push/merge it back or promote the next runtime-only child without widening into UI/map/backpack/main shell work.`
