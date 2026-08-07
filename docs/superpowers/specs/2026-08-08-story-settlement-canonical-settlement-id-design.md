# Story Settlement Canonical Settlement Id Design

## Goal

Open the next approved `runtime/event` child on `merage-mod2ui-1` by converging story settlement consumption onto the canonical routed runtime-event seam.

This design targets one narrow residual gap:

- story settlement application and lookup already accept routed `settlementId`
- but they still preserve authored `eventDefinition.settlementId` fallback on the hot path
- so the current branch is not yet fully canonical-first on this runtime/event seam

The goal is to remove that residual fallback from the covered runtime path without reopening startup work, review-system work, or source-unification work.

## Hard Constraints

- Do not reopen `B` startup work unless a new runtime drift is proven.
- Do not reopen `C` source-unification work; it is already closed.
- Do not reopen `D` review-system work; the user explicitly paused it.
- Do not add new business logic to `src/main.ts`.
- Do not widen this slice into a general event-router redesign.
- Keep the slice fully inside current runtime/event/story owners.
- Prefer canonical runtime-event payload metadata over rereading authored event shape on the covered path.

## Current Branch Context

### 1. Current canonical queue is empty on purpose

`docs/superpowers/project-progress.md` is back at:

- `Current Child: none`
- `Next Required Action: open-next-approved-child`

That means the next move is not to resume an old local checkpoint. The next move is to promote a new approved child for the current branch.

### 2. B, C, and D are not the right next child

- startup (`B`) is currently frozen after targeted audit found no new runtime drift
- source-unification (`C`) is already closed and pushed
- review-system (`D`) remains paused by user instruction

So the next child must be a fresh runtime/event slice rather than a return to those lines.

### 3. A real runtime/event residual still exists

Current source audit shows that story settlement handling still reads authored settlement metadata directly on the covered path:

- `src/application/story/story-runtime.ts`
  - `readStorySettlement(...)` still falls back to `eventDefinition.settlementId`
- `src/application/story/story-settlement-continuation.ts`
  - `applyStorySettlementEvent(...)` still falls back to `eventDefinition.settlementId`

At the same time, the current branch already has the canonical routed seam:

- `src/core/runtime/event-entity-projection.ts`
  - `readRuntimeEventSettlementId(...)`
- routed event flow already threads `RuntimeEventEntity` through story runtime

So this is no longer a missing-feature problem. It is a residual fallback-removal problem.

## Problem Statement

The current branch already moved settlement metadata onto routed runtime-event payloads, but the covered story settlement path still tolerates direct authored fallback.

That leaves two problems:

1. canonical runtime ownership is incomplete on the covered path
2. future regressions can silently bypass routed metadata because authored `eventDefinition.settlementId` still works as an escape hatch

The branch therefore needs one new narrow child that turns this seam from:

- `canonical payload if present, otherwise authored fallback`

into:

- `canonical routed settlement metadata on the covered runtime path`

while keeping the slice narrow and fully local to runtime/event/story ownership.

## Approaches Considered

### Approach A: Open a broad event-router/runtime-core child

This would continue the old runtime-only migration style and batch multiple payload/fallback cleanups together.

Pros:

- can clear several adjacent seams in one stream

Cons:

- too wide for the current branch state
- high risk of drifting into unrelated router work
- conflicts with the requirement to open one clear next child from the empty canonical queue

Verdict:

- rejected for this branch step

### Approach B: Reuse an old completed-but-open runtime-only child as the current child

This would treat the historical `2026-07-30-runtime-event-settlement-id-payload-consumption-plan.md` line as the current canonical next step.

Pros:

- superficially similar subject matter

Cons:

- it belongs to a different queue and branch context
- it intentionally preserved authored fallback behavior
- promoting it directly would blur historical runtime-only migration governance with the current post-merge stabilization queue

Verdict:

- rejected

### Approach C: Open a new stabilization child for story settlement canonical-settlement-id convergence

This creates a fresh child under the current canonical queue and treats authored settlement-id fallback as the only in-scope residual.

Pros:

- fits the current branch state
- narrow enough to execute and verify quickly
- stays entirely inside runtime/event/story owners
- directly advances canonical runtime ownership

Cons:

- does not solve every adjacent runtime-event fallback in one batch

Verdict:

- chosen approach

## Chosen Approach

Open a new `Post-Merge Branch Stabilization` child that removes authored `settlementId` fallback from the covered story settlement runtime path.

The child should:

1. audit all remaining covered settlement-id authored fallback reads
2. add focused regression coverage proving canonical-first runtime ownership
3. remove the covered authored fallback from story-runtime and story-settlement-continuation
4. sync canonical governance and continue only if a new adjacent runtime/event residual is proven afterward

## In Scope

- `src/application/story/story-runtime.ts`
  - remove covered authored settlement-id fallback from `readStorySettlement(...)`
- `src/application/story/story-settlement-continuation.ts`
  - remove covered authored settlement-id fallback from `applyStorySettlementEvent(...)`
- `src/core/runtime/event-entity-projection.ts`
  - audit existing settlement-id reader and extend only if the current branch truly needs another helper
- focused tests for story settlement continuation / routed event runtime behavior
- canonical governance sync:
  - new spec
  - new plan
  - `docs/superpowers/project-progress.md`

## Out Of Scope

- startup request/context/follow-up work
- review-system or temple review work
- scenario-pack source synchronization
- generic event-router redesign
- unrelated dialogue-id, task-input, or action-payload migration
- changing authored event JSON or Script Editor export contracts unless the audit proves a real dependency

## Expected Outcome

After this child:

- covered story settlement runtime consumption is canonical-first, not authored-fallback-first
- routed settlement metadata is the only supported input on the covered runtime path
- story settlement regression coverage explicitly fails if a future change reintroduces authored fallback
- canonical project-progress truth points at this child while it is active

## Verification Expectations

At minimum, implementation must prove:

- routed settlement metadata still applies the correct settlement definition
- story settlement continuation still reaches the correct next event behavior after settlement
- no new changes appear under `src/main.ts`, UI, map, backpack, or style boundaries
- governance docs remain lint-clean and synchronized

Expected verification set:

- `npm run build:test`
- `node --test tests/story-settlement-continuation.test.cjs`
- one focused runtime/event suite covering routed settlement metadata on story runtime
- `npm run typecheck`
- `npm run build`
- `npm run lint:plans`
- `git diff --check`

## Exit Criteria

This design is complete only when:

1. a new child spec and plan exist for this slice
2. canonical progress points to that child as the active work item
3. the implementation removes the covered authored settlement-id fallback
4. verification proves the routed runtime-event seam still works

