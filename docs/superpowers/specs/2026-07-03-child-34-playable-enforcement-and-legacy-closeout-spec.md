# Child 34 Playable Enforcement And Legacy Closeout Spec

**Goal:** Close the first playable-runtime migration set by adding repository-owned scaffold/validator enforcement and removing only the legacy direct paths that earlier children have already proven obsolete.

## Why This Child Exists

The playable spec is not truly closed-loop if later humans or AI still need to hand-wire new playables or if old direct branches stay alive indefinitely. This child exists to:

- turn the playable contract into enforceable repository tooling
- remove legacy direct paths only after migration parity is proven

It must come last, because enforcement and deletion should follow proven migration outcomes rather than precede them.

## Baseline Snapshot

At baseline:

- the playable spec already requires scaffold, validator, and CI-facing enforcement surfaces
- the repository does not yet provide those playable-specific tools
- concrete interactive ids and compatibility ownership still remain in `src/main.ts` and `src/core/runtime/interactive-runtime.ts`
- some playable-like flows outside the first queue still remain later candidates and therefore must not be deleted prematurely

Detailed current ownership mapping is recorded in:

- `docs/superpowers/specs/2026-07-03-playable-current-state-inventory-and-ownership-matrix.md`

## In Scope

- adding playable scaffold tooling
- adding playable integration scaffold tooling
- adding playable validation tooling
- wiring validation into repository command surfaces
- removing direct concrete launch/result paths that earlier children have already made obsolete
- adding final regression coverage for the first playable-runtime set

## Out Of Scope

- reopening earlier migration children for unrelated feature requests
- deleting compatibility paths that still own real production behavior
- broad CI redesign unrelated to playable enforcement
- migrating later candidate playables not yet covered by the first set

## Expected End State

The target shape after Child 34 is:

```text
new playable request -> scaffold path
new integration request -> scaffold path
validation -> repository command / CI gate
obsolete direct branches -> removed where parity is proven
```

At end state:

- the first playable-runtime set has an enforceable repository entry path
- later additions do not depend on ad hoc folder and glue discovery
- legacy direct branches are reduced only where prior migration children already closed the ownership gap

## Exit Conditions

- playable scaffold tooling exists
- playable integration scaffold tooling exists
- playable validation tooling exists
- obsolete direct launch/result branches are removed where migration parity is already proven
- targeted regressions prove enforcement surfaces and closeout claims
- `npm run typecheck`
- `npm run build`

## Verification Story

Implementation must include:

- targeted checks that scaffold commands exist
- targeted checks that validator commands exist
- targeted checks that obsolete direct branches are gone where this child claims they are gone
- checks that still-needed compatibility paths remain explicit rather than silently assumed gone

## Risk Notes

- The main risk is deleting compatibility paths before the earlier children actually prove parity.
- Another risk is adding tooling names without making them real repository entry points.
