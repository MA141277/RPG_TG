# Weekly Call Flows

**Week Of:** `2026-07-02`

## Purpose

Capture at least two real user-visible flows in the current architecture.

If a real flow cannot be described clearly, that area is still a black box.

## Flow 1: Covered Story-Battle Action Reentry

### Narrative

The current production line for the covered story-battle action path already re-enters runtime-owned follow-up through the shared dispatch line and `houseRuntime.applyInteractiveFollowUp()`. This is the accepted post-Child-13 baseline that Child 14 must not reopen.

### Call Chain

```text
UI -> src/main.ts dispatchCurrentStoryBattleAction() -> createInteractiveActionRequest() -> dispatchRuntimeRequest() -> RuntimeRouter.route() -> runInteractiveRuntime() -> settleRuntimeEffects() -> RuntimeFollowUpContext.handleInteractive() -> houseRuntime.applyInteractiveFollowUp() -> RuntimeResult.state applied in src/main.ts
```

### Notes

- This path is already converged and is not the target of Child 14 except where residual interactive lifecycle ownership is still adapter-owned.

## Flow 2: Covered City-Begging Interactive Lifecycle

### Narrative

The covered city-begging path is the current proof that interactive lifecycle ownership can live under `interactive-runtime.ts`. Child 14 should use this as the nearest runtime-owned reference pattern when converging the remaining `activity-qte` and `story-battle` tails.

### Call Chain

```text
UI -> src/main.ts -> createLaunchInteractiveRequest() -> dispatchRuntimeRequest() -> RuntimeRouter.route() -> runInteractiveRuntime() -> runtime-owned city-begging lifecycle -> settleRuntimeEffects() -> RuntimeResult.state / RuntimeResult.interactive -> src/main.ts applies result
```

### Notes

- City-begging is already ownerized and should not be reopened by Child 14.

## Additional Flows

- Future Child 14 updates should add a real `activity-qte` converged flow here once the first implementation batch lands.
