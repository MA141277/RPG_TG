# Child 32 House-Local Mechanic Promotion Spec

**Goal:** Promote `grain-accounting` and `medicine-compounding` from house-local mechanics into full shared playables while keeping their host houses as integration owners rather than long-term mechanic owners.

## Why This Child Exists

After Child 31, the shared playable shell should already be proven by covered short-form playables. The next hard boundary is not another covered interactive path; it is the house-local mechanic problem. `grain-accounting` and `medicine-compounding` still live inside house modules, overlays, and local result branches, so they need a dedicated child that separates:

- house-owned narrative/menu hosting
- playable-owned mechanic lifecycle/result ownership

This child exists to solve that boundary without reopening house-system redesign as a whole.

## Baseline Snapshot

At baseline:

- `grain-accounting` still launches from `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- its active mechanic state still lives in a house overlay with `overlay.type === "minigame"`
- result and reward logic still close inside grain-shop local flow through `finalizeAccountingMinigame()` and `applyAccountingReward()`
- `medicine-compounding` still launches from `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- its active mechanic state still lives in a house overlay with `overlay.type === "compounding"`
- result and stamina/reward write-back still close inside medicine-house local flow through `finalizeCompounding()`

Detailed current ownership mapping is recorded in:

- `docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md`

## In Scope

- promoting `grain-accounting` into a shared playable definition
- promoting `medicine-compounding` into a shared playable definition
- moving lifecycle/result/settlement/handoff ownership behind the shared playable runtime
- keeping grain-shop and medicine-house as integration owners and return destinations where appropriate
- updating shared house/playable docs if launch/return contracts move

## Out Of Scope

- `story-battle`
- tavern / tea-house / temple-house later candidates
- broad house-system redesign
- scaffold / validator / CI closeout
- creation of new special house implementations

## Expected End State

The target shape after Child 32 is:

```text
grain-shop host -> shared playable runtime -> grain-accounting
medicine-house host -> shared playable runtime -> medicine-compounding
```

At end state:

- host houses still own story/menu/integration timing
- the two mechanics no longer use house modules as long-term mechanic owners
- return to the correct house/session is explicit through the shared handoff path

## Exit Conditions

- `grain-accounting` is a shared playable
- `medicine-compounding` is a shared playable
- host houses still return to the correct owner/session
- `docs/special-house-interface.md` is updated if shared launch/return boundaries changed
- targeted regressions prove parity
- `npm run typecheck`
- `npm run build`

## Verification Story

Implementation must include:

- targeted checks for grain-shop launch/result parity
- targeted checks for medicine-house launch/result parity
- checks that house return behavior still recovers the correct session or reentry path

## Risk Notes

- The main risk is replacing house integration ownership with a new hidden global owner instead of a formal handoff.
- Another risk is leaving reward semantics trapped inside house-local mechanic code instead of moving them toward integration-owned outcome handling.
