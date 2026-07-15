# Child 26 Render Purity Contract Spec

**Goal:** Remove gameplay mutation from the render path so `src/main.ts` render flow consumes settled state only and no longer triggers passive gameplay progression before presenter/render output.

## Why This Child Exists

Even after orchestration extraction, render is not pure if it still causes gameplay mutation before UI output is built. As long as render triggers passive story/event progression, `main.ts` is still more than a shell. This child exists to fix that purity boundary and ensure render becomes a display-only phase.

This child is sequenced after Child 25 because render purity should stabilize against already-correct post-settlement follow-up ownership. Otherwise render purity risks compensating for behavior that should have moved earlier in the pipeline.

## Baseline Snapshot

At baseline:

- passive trigger behavior remains render-adjacent debt
- the shell boundary is still weakened if render is allowed to cause gameplay mutation
- presenter/render semantics must be preserved while removing mutation ownership

## In Scope

- removing passive gameplay mutation from render path
- relocating passive trigger execution to explicit runtime settlement/follow-up ownership
- preserving current display behavior while purifying render responsibilities
- documenting the render purity contract

## Out Of Scope

- UI markup redesign
- presenter model redesign beyond purity-preserving changes
- startup story bootstrap work
- active content ownership work
- unrelated animation or WebGL refactors

## Expected End State

The target shape after Child 26 is:

```text
settled state -> presenter -> render
```

At end state:

- render does not mutate gameplay state
- passive trigger timing has a non-render owner
- presenter consumes settled state only
- shell render flow is a display phase, not a continuation phase

## Exit Conditions

- `renderApp()` and render-adjacent shell helpers no longer mutate gameplay state
- passive trigger execution has an explicit non-render owner
- presenter consumes settled state only
- targeted regression checks prove passive triggers still occur at the correct timing
- `npm run typecheck`
- `npm run build`
- `npm run lint:plans`

## Verification Story

Implementation must include:

- a regression proving render-path mutation is gone
- a regression proving passive trigger timing still occurs correctly
- documentation of the owner that replaced render-path mutation

## Risk Notes

- The main risk is losing passive trigger timing when removing it from render.
- Another risk is hiding mutation inside presenter or another shell-adjacent helper instead of truly relocating ownership.
