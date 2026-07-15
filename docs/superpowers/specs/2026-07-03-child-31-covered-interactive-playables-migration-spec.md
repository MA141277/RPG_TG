# Child 31 Covered Interactive Playables Migration Spec

**Goal:** Move the already-runtime-adjacent short-form playables `activity-qte` and `city-begging` onto the shared playable runtime while preserving covered user-visible behavior.

## Why This Child Exists

After Child 30, the repository should have a shared runtime shell but still no proof that real minigame-family playables can use it safely. `activity-qte` and `city-begging` are the right first proof because they already sit closest to covered runtime ownership and have smaller blast radius than house-local mechanics or battle-family work.

This child exists to prove the shell with concrete minigame-family migrations before the queue touches house-local mechanics or `story-battle`.

## Baseline Snapshot

At baseline:

- `activity-qte` currently uses `state.core.runtime.activitySession` as its active mechanism carrier
- `city-begging` currently uses `state.app.beggingMiniGameState` as its active mechanism carrier
- both still pass through `src/core/runtime/interactive-runtime.ts`
- `activity-qte` still depends on concrete `interactive.activity-qte.*` action ids
- `city-begging` still depends on concrete `interactive.city-begging.*` launch/action ids
- neither path currently resolves through one formal `integrationId`

Detailed current ownership mapping is recorded in:

- `docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md`

## In Scope

- migrating `activity-qte` onto the shared playable runtime
- migrating `city-begging` onto the shared playable runtime
- preserving `city-begging` internal variants as internal playable detail
- converging launch/session/result/settlement/handoff ownership for those two playables
- proving that the shared shell works for ordinary minigame-family playables

## Out Of Scope

- `grain-accounting`
- `medicine-compounding`
- `story-battle`
- scaffold / validator / CI closeout
- deleting every remaining interactive-runtime compatibility path

## Expected End State

The target shape after Child 31 is:

```text
activity-qte -> playable runtime
city-begging -> playable runtime
variants stay internal to city-begging
```

At end state:

- covered short-form playables no longer rely on `interactive-runtime` as their long-term owner
- both playables emit facts and settle through the shared shell
- user-visible behavior remains stable enough to trust the shell for later children

## Exit Conditions

- `activity-qte` is owned by the shared playable runtime
- `city-begging` is owned by the shared playable runtime
- `city-begging` internal variants remain internal and do not become new top-level runtime families
- covered return behavior still works
- targeted regressions prove migration parity
- `npm run typecheck`
- `npm run build`

## Verification Story

Implementation must include:

- targeted checks for `activity-qte` launch and completion parity
- targeted checks for `city-begging` launch, tick, completion, and closeout parity
- checks that both now route through the shared playable shell rather than direct concrete owner code

## Risk Notes

- The main risk is leaking shell migration details into later house-local or battle-family work.
- Another risk is flattening `city-begging` variants into top-level families instead of keeping them internal.
