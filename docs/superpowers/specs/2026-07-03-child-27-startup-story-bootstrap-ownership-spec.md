# Child 27 Startup Story Bootstrap Ownership Spec

**Goal:** Move startup-time story bootstrap ownership out of `src/main.ts` so builtin, restore, and scenario startup flows begin from runtime-owned bootstrap results instead of shell-triggered event start logic.

## Why This Child Exists

After `Child 24`, startup apply moved behind an orchestration seam, but some startup builders still directly start story events from `main.ts`-owned construction paths. That means startup is not fully ownerized yet. This child exists to converge startup story bootstrap under one explicit startup/runtime owner.

This child stays behind Child 26 because startup bootstrap should be addressed only after shell follow-up and render purity boundaries are stabilized. Otherwise startup work would risk reintroducing shell-side compensations.

## Baseline Snapshot

At baseline:

- startup apply no longer owns the whole problem, but startup story bootstrap still leaks through shell-adjacent builders
- builtin, restore, and scenario startup parity must remain intact
- startup output is not yet fully bootstrap-complete for every covered path

## In Scope

- removing direct startup story bootstrap from `src/main.ts`
- converging builtin / restore / scenario startup bootstrap ownership
- ensuring startup output already includes bootstrap-complete state
- documenting the startup bootstrap owner

## Out Of Scope

- general story runtime redesign
- render purity work
- active content ownership migration
- legacy startup seam retirement
- save format redesign

## Expected End State

The target shape after Child 27 is:

```text
startup request -> startup/bootstrap owner -> bootstrap-complete session/result -> shell apply -> render
```

At end state:

- `src/main.ts` no longer directly starts startup story events
- startup paths share a consistent bootstrap owner
- startup output is already prepared for shell consumption

## Exit Conditions

- `src/main.ts` no longer directly starts startup story events
- startup bootstrap owner is explicit and documented
- builtin and scenario startup paths still reach correct opening state
- targeted regression checks prove startup parity remains intact
- `npm run typecheck`
- `npm run build`
- `npm run lint:plans`

## Verification Story

Implementation must include:

- targeted checks for builtin startup opening state
- targeted checks for scenario-pack startup opening state
- restore-path verification if bootstrap parity applies there

## Risk Notes

- The main risk is divergence between builtin, restore, and scenario-pack startup behavior.
- Another risk is scattering bootstrap logic across multiple builders instead of converging ownership.
