# Child 28 Active Content Ownership Convergence Spec

**Goal:** Remove centralized active content ownership from `src/main.ts` so shell and presenter consume already-activated content context instead of directly synchronizing active definitions.

## Why This Child Exists

Even if gameplay orchestration moves out of shell, mod-first convergence is incomplete while `src/main.ts` still centrally rewrites active maps, cities, houses, text, events, scenes, tasks, and activities. This child exists to move active content activation and synchronization into startup/mod composition ownership.

This child is deliberately later than startup bootstrap because content ownership changes should be applied against already-stabilized startup outputs. Otherwise the project risks changing content activation and startup bootstrap at the same time without a clear owner boundary.

## Baseline Snapshot

At baseline:

- `src/main.ts` still centrally synchronizes active definitions
- builtin and mod content activation do not yet converge on one shell-consumed content context
- shell still owns more content-shape mutation than a pure shell should own

## In Scope

- migrating active content synchronization out of `src/main.ts`
- converging builtin and mod content activation output shape
- establishing shell-consumed content snapshot/context ownership
- documenting the explicit owner for active content

## Out Of Scope

- content authoring redesign
- registry-family redesign unrelated to active content ownership
- legacy startup seam retirement
- unrelated mod manifest expansion
- render contract work

## Expected End State

The target shape after Child 28 is:

```text
startup/mod activation -> content composition owner -> content snapshot/context -> shell/presenter consumption
```

At end state:

- `src/main.ts` no longer centrally writes active definitions
- builtin and mod activation converge on one content output shape
- shell consumes content context instead of owning it

## Exit Conditions

- `src/main.ts` no longer centrally owns active content synchronization
- active content owner is explicit and documented
- builtin and mod activation paths converge on one output shape
- shell reads content context rather than writing active definitions directly
- `npm run typecheck`
- `npm run build`
- `npm run lint:plans`

## Verification Story

Implementation must include:

- a check for builtin content activation output
- a check for scenario/mod content activation output
- a proof that shell consumption no longer depends on central active-definition writes

## Risk Notes

- The main risk is ending up with two parallel active registries during migration.
- Another risk is moving ownership to a new global singleton without a proper contract, which would only relocate the problem.
