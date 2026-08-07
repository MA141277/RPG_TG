# Mod-First Event Binding Candidate Task Input Payload Consumption Design

## Goal

Open the next approved `runtime/event` child on `merage-mod2ui-1` by moving mod-first event-binding candidate task-input projection onto the canonical runtime-event payload seam.

This design targets one narrow residual gap:

- current `event-runtime` candidate task inputs already consume `RuntimeEventEntity.payload.taskInputs`
- current story routed handlers already consume `readRuntimeEventTaskInputs(...)`
- but `src/core/runtime/mod-first-compatibility.ts` still builds event-binding candidates from authored `eventDefinition.taskInputs ?? []`

The goal is to remove that residual authored reread without reopening startup, review-system, source-unification, Script Editor contracts, or broad event-router redesign.

## Hard Constraints

- Do not reopen `B` startup work unless a new runtime drift is proven.
- Do not reopen `C` source-unification work; it is already closed.
- Do not reopen `D` review-system work; the user explicitly paused it.
- Do not add new business logic to `src/main.ts`.
- Do not widen this slice into a general event-router redesign.
- Keep the slice fully inside current runtime/event owners.
- Prefer canonical runtime-event payload metadata over rereading authored event shape on the covered path.

## Current Branch Context

### 1. Current canonical queue is empty

`docs/superpowers/project-progress.md` is back at:

- `Current Child: none`
- `Next Required Action: open-next-approved-child`

So the next move must be a fresh approved child from the current branch state.

### 2. Adjacent payload seams are already covered

Audit on `merage-mod2ui-1` shows:

- `src/core/runtime/event-runtime.ts`
  - `toEventRuntimeCandidate(...)` already uses `createRuntimeEventEntity(...)` and `readRuntimeEventTaskInputs(...)`
- `src/application/story/story-runtime.ts`
  - routed handlers already use `readRuntimeEventTaskInputs(event)`
- `src/core/runtime/event-binding-runtime.ts`
  - binding-owned action application already uses `readRuntimeEventActions(...)`
  - state-only classification already uses `readRuntimeEventDialogueId(...)`

### 3. A real mod-first event-binding candidate residual remains

Current source audit shows:

- `src/core/runtime/mod-first-compatibility.ts`
  - `toModFirstEventBindingRuntimeCandidate(...)` still returns `taskInputs: eventDefinition.taskInputs ?? []`

That means event-binding candidate activation can still read authored `taskInputs` directly instead of projecting through the shared runtime-event entity payload.

## Problem Statement

The branch has converged most runtime-event metadata consumption onto `RuntimeEventEntity.payload`, but mod-first event-binding candidate task-input projection still bypasses that seam.

That leaves two problems:

1. event-binding candidate metadata has a separate authored task-input read path
2. future changes to runtime-event payload projection can be bypassed by direct `eventDefinition.taskInputs`

The branch needs one narrow child that turns this seam from:

- `candidate taskInputs = authored eventDefinition.taskInputs`

into:

- `candidate taskInputs = readRuntimeEventTaskInputs(createRuntimeEventEntity(eventDefinition))`

## Approaches Considered

### Approach A: Reopen a historical runtime-only task-input child

This would reuse the old `2026-07-30-event-runtime-candidate-task-input-payload-consumption-plan.md`.

Pros:

- similar topic

Cons:

- that child is historical and targeted `event-runtime`, not `mod-first-compatibility`
- current canonical queue must open from `project-progress.md`
- reusing it would blur the current post-merge stabilization queue with older runtime-only governance

Verdict:

- rejected

### Approach B: Batch all remaining legacy action compatibility cleanup

This would combine `closeBuilding`, `launchFlow`, and candidate task input cleanup.

Pros:

- may reduce future passes

Cons:

- too broad
- touches different contracts and compatibility policies
- risks drifting into Script Editor/export/playable scope

Verdict:

- rejected

### Approach C: Open a new narrow child for mod-first event-binding candidate task inputs

This child only changes candidate task-input projection inside the current runtime/event owner.

Pros:

- fits current branch state
- narrow and testable
- aligns event-binding candidate metadata with existing runtime-event payload readers
- avoids startup, review-system, Script Editor, playable, and source-unification scope

Cons:

- does not solve every adjacent compatibility cleanup

Verdict:

- chosen

## Chosen Approach

Open a new `Post-Merge Branch Stabilization` child that moves `toModFirstEventBindingRuntimeCandidate(...)` task-input projection onto the shared runtime-event payload seam.

The child should:

1. audit the exact residual authored `taskInputs` read
2. add focused RED coverage proving candidate task inputs come from runtime-event payload projection
3. update `mod-first-compatibility.ts` to use `createRuntimeEventEntity(...)` and `readRuntimeEventTaskInputs(...)`
4. guard the boundary in `tests/robustness.test.cjs`
5. sync canonical governance and close the child after push

## In Scope

- `src/core/runtime/mod-first-compatibility.ts`
  - change `toModFirstEventBindingRuntimeCandidate(...)` task-input projection
- `tests/event-binding-start-runtime.test.cjs`
  - add focused runtime assertions for payload-owned binding candidate task inputs
- `tests/robustness.test.cjs`
  - add a guard that candidate task inputs no longer read `eventDefinition.taskInputs`
- canonical governance sync:
  - new spec
  - new plan
  - `docs/superpowers/project-progress.md`

## Out Of Scope

- startup-chain work
- review-system / temple-review work
- source-unification or Script Editor contract work
- broad event-router redesign
- `closeBuilding` or `launchFlow` compatibility cleanup
- authored event JSON rewrites
- playable runtime, playable integration, or playable settlement work

## Expected Outcome

After this child:

- mod-first event-binding candidate task inputs consume the canonical runtime-event payload seam
- event-binding activation behavior remains unchanged
- event-binding action application and state-only classification remain on their existing payload seams
- robustness coverage fails if a future change reintroduces `eventDefinition.taskInputs` inside the candidate projection

## Verification Expectations

At minimum, implementation must prove:

- event-binding candidate task inputs are projected through `readRuntimeEventTaskInputs(...)`
- event-binding activation still returns the intended `activation.taskInputs`
- existing binding route/action behavior stays green
- no startup, review-system, Script Editor, playable, UI, map, backpack, or style boundaries are touched
- governance docs remain lint-clean and synchronized

Expected verification set:

- `npm run build:test`
- `node --test tests/event-binding-start-runtime.test.cjs`
- `node --test --test-name-pattern "mod-first event binding candidate task input|runtime event binding action payload consumption|runtime event task input payload consumption|event binding runtime route convergence" tests/robustness.test.cjs`
- `npm run typecheck`
- `npm run build`
- `npm run lint:plans`
- `git diff --check`

## Exit Criteria

This design is complete only when:

1. a new child spec and plan exist for this slice
2. canonical progress points to that child as the active work item
3. implementation removes the covered authored `eventDefinition.taskInputs` reread
4. verification proves event-binding candidate task inputs still reach activation through the routed payload seam
