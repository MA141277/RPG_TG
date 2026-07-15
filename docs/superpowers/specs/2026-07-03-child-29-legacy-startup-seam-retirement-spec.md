# Child 29 Legacy Startup Seam Retirement Spec

**Goal:** Retire the legacy startup seam from the primary startup path so builtin and mod startup share one explicit bootstrap contract without routing through legacy translation adapters.

## Why This Child Exists

Legacy startup adapters are now migration residue rather than the main architectural problem, but they still prevent full convergence of the startup path. This child exists only after upstream ownerization work has stabilized, so the primary bootstrap chain can stop depending on legacy translation seams.

This child is intentionally last in the continuation queue. If it is promoted too early, it risks hiding unresolved startup/bootstrap/content ownership debt that should be addressed first.

## Baseline Snapshot

At baseline:

- legacy startup adapters still participate in the primary path
- those seams are later-order debt rather than the highest-risk active problem
- builtin and mod startup are not yet expressed through one legacy-free primary contract

## In Scope

- removing primary-path reliance on legacy startup adapters
- converging builtin and mod startup on one bootstrap contract
- documenting any remaining compatibility seam as non-primary

## Out Of Scope

- upstream startup bootstrap redesign not required for seam retirement
- active content ownership migration
- broad engine bootstrap redesign
- unrelated runtime feature work
- house/task contract expansion

## Expected End State

The target shape after Child 29 is:

```text
builtin/mod startup request -> unified bootstrap contract -> startup result -> shell consumption
```

At end state:

- the primary path does not depend on legacy translation seams
- builtin and mod startup share one explicit bootstrap contract
- any remaining compatibility layer is clearly non-primary

## Exit Conditions

- primary startup path no longer depends on legacy startup seam
- builtin and mod startup share one explicit bootstrap contract
- any remaining compatibility layer is documented as non-primary only
- targeted verification proves no boot regression or white screen is introduced
- `npm run typecheck`
- `npm run build`
- `npm run lint:plans`

## Verification Story

Implementation must include:

- a builtin startup verification without legacy primary-path reliance
- a scenario/mod startup verification without legacy primary-path reliance
- a regression proving primary startup no longer routes through the legacy seam

## Risk Notes

- The main risk is doing this too early and masking unresolved upstream ownership debt.
- Another risk is partial seam removal that still leaves the primary path logically legacy-shaped.
