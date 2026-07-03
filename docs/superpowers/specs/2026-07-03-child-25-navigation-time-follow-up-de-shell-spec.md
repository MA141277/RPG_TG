# Child 25 Navigation Time Follow-Up De-Shell Spec

**Goal:** Remove the remaining shell-owned post-settlement follow-up from `src/main.ts` for covered navigation and time flows so request handling no longer depends on `main.ts` stitching business continuation after runtime settlement.

## Why This Child Exists

`Child 24` moved covered orchestration behind `main-runtime-orchestrator`, but `src/main.ts` still retains cross-runtime follow-up around some navigation/time paths. The remaining debt is not request dispatch itself; the debt is that shell-owned code still decides when covered follow-up such as story timing or council-priority continuation should run after navigation/time settlement.

This child exists to finish that problem type before render purity, startup bootstrap, or active content ownership are promoted. If covered follow-up remains shell-owned, later children would be forced to stabilize against the wrong outer contract.

## Baseline Snapshot

At baseline:

- covered navigation settlement still has shell-adjacent post-processing paths
- covered time/day-start settlement still has shell-adjacent follow-up paths
- some of those follow-ups involve story timing or council-priority continuation
- the shell boundary is still weakened because `main.ts` remains responsible for “after runtime finishes, do this next”

## In Scope

- covered `navigation -> follow-up` extraction
- covered `time -> follow-up` extraction
- removing shell-owned post-settlement chaining in `src/main.ts`
- documenting the new owner for navigation/time follow-up
- targeted regressions proving follow-up no longer belongs to the shell

## Narrow Follow-Up Contract

Child 25 must use an outcome-driven narrow follow-up contract.

Covered navigation/time runtime paths may emit explicit outcomes, and only those declared outcomes may be consumed by one narrow follow-up contract outside `src/main.ts`.

Allowed outcome families in this child:

- `navigation.entered-city`
- `time.advanced`
- `time.council-threshold-crossed`

Allowed follow-up continuations in this child:

- `navigation.entered-city -> trigger story timing(city-enter)`
- `time.advanced` or `time.council-threshold-crossed -> council-priority follow-up`

This contract must not become a generic orchestration layer, must not accept arbitrary shell callbacks, and must not introduce a second state write-back sink.

## Out Of Scope

- render/presenter redesign
- startup bootstrap redesign
- active content ownership migration
- house internal redesign beyond blocker-level support
- legacy startup seam retirement

## Expected End State

The target shape after Child 25 is:

```text
shell request -> navigation/time runtime -> explicit follow-up owner -> state settlement -> render scheduling
```

At end state:

- `src/main.ts` still packages shell-originated requests
- `src/main.ts` no longer decides covered navigation/time continuation after settlement
- follow-up timing is owned by an explicit runtime-side owner
- later children can treat the navigation/time edge as stable

## Exit Conditions

- `src/main.ts` no longer hand-stitches covered navigation follow-up
- `src/main.ts` no longer hand-stitches covered time follow-up
- the follow-up owner is explicit and documented
- targeted regression checks prove behavior still fires at the correct trigger points
- `npm run typecheck`
- `npm run build`
- `npm run lint:plans`

## Verification Story

Implementation must include:

- targeted checks for covered navigation-triggered follow-up timing
- targeted checks for covered time/day-start follow-up timing
- evidence that shell-owned post-settlement business stitching was removed rather than renamed

## Risk Notes

- The main risk is moving follow-up into an overgrown generic orchestrator instead of a clear runtime owner.
- A second risk is behavioral drift in story timing or council timing after extraction.
