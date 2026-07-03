# Child 24 Main Runtime Orchestration Ownerization Spec

**Goal:** Remove the remaining runtime-business orchestration from `src/main.ts` so shell entry points hand requests into one explicit orchestration seam, covered follow-up stays outside the shell, and state write-back has one documented sink.

## Why This Child Exists

`Child 23` closed the startup-family decision tree extraction, but it intentionally left a different problem type unresolved: `src/main.ts` still owns mixed runtime-business orchestration after shell input enters the app.

The remaining debt is not that `src/main.ts` is large by itself. The real debt is that `main.ts` still decides or stitches business follow-up in places that should belong to a runtime owner:

- story / event / scene follow-up is still partially chained in `main.ts`
- startup session apply still performs business orchestration such as active content sync
- render-time passive trigger logic still mutates game state before presenter/render output
- covered runtime request handling still depends on ad hoc `main.ts` router closures instead of one fixed orchestration owner

This child exists to fix that ownership line before later task / house / mod contract work continues.

## Baseline Snapshot

At baseline:

- `src/application/startup/startup-session-coordinator.ts` owns startup-family request selection, but `main.ts` still owns session apply business orchestration
- `src/core/runtime/navigation-runtime.ts` and `src/core/runtime/time-runtime.ts` exist, but `main.ts` still owns follow-up chaining such as story triggers and council checks around some covered paths
- `src/core/runtime/event-runtime.ts` and `src/core/runtime/scene-runtime.ts` exist, but `main.ts` still directly invokes story/event/scene progression helpers in several places
- `renderApp()` still calls passive gameplay mutation before presenter output is built
- `state-sync-runtime.ts` already provides the write-back bridge and must remain the single state write-back sink unless a stronger reason is documented

## Primary Boundary

This child owns one problem type only:

- **main-shell runtime orchestration ownerization**

That means:

- shell input may still originate in `main.ts`
- browser render scheduling may still originate in `main.ts`
- but covered business decisions, follow-up chaining, and state write-back preparation must move behind one explicit orchestration seam

## Required Boundary Contract

The implementation must end with these answers being explicit and documentable:

### 1. Request Entry

Requests enter from shell-owned code only:

- `MainUiFlow`
- DOM event handlers
- animation / interval callbacks that are still shell-owned

Those entry points may package input, but they must not own runtime-business follow-up.

### 2. Runtime Decision Owner

One explicit orchestration owner must decide which covered runtime path handles a request and whether additional covered follow-up is required.

This owner may be one module or one module plus a narrow contract file, but it must not be scattered across unrelated `main.ts` helpers.

### 3. Follow-Up Owner

Story / event / scene / covered startup follow-up must be owned by the orchestration seam, not by `main.ts`-local call chains.

Examples in scope:

- startup session apply follow-up that syncs active content before app-state bootstrap
- covered navigation/time follow-up that immediately triggers story/event handling
- covered scene progression / option selection handoff
- render-prepass passive trigger evaluation

### 4. State Write-Back Sink

State write-back must converge through one existing sink:

- `src/core/runtime/state-sync-runtime.ts`
- or one documented wrapper around it

`main.ts` must not directly become an alternate business write-back owner.

## In Scope

- extracting covered runtime-business orchestration out of `src/main.ts`
- moving startup session apply business orchestration behind the new owner
- moving covered story / event / scene follow-up behind the new owner
- removing passive gameplay mutation from the `renderApp()` pre-pass path
- documenting the fixed boundary in the new weekly architecture artifacts
- adding targeted ownership regressions that prove `main.ts` no longer owns these covered runtime decisions

## Out Of Scope

- `renderApp()` markup or presenter redesign
- `MainUiFlow` contract redesign
- task-runtime contract expansion
- house-runtime registration redesign
- content-pack / scenario-pack decoupling
- mod manifest / registry redesign
- save-envelope redesign
- opportunistic removal of every `commitRuntimeRequest()` call from `main.ts`

## Expected End State

The target shape after Child 24 is:

```text
shell input -> main shell entry -> main runtime orchestration seam -> sub-runtime / covered follow-up -> state write-back sink -> render scheduling
```

At end state:

- `main.ts` still owns shell input wiring and render scheduling
- `main.ts` no longer owns covered startup/session apply business orchestration
- `main.ts` no longer owns covered story/event/scene follow-up
- `renderApp()` no longer mutates gameplay state through passive trigger sync before presenter output
- the boundary can be described in one call flow without referring to ad hoc local helpers

## Exit Conditions

- `src/main.ts` no longer directly owns the covered follow-up chain for startup session apply, story/event/scene progression, and passive render-time trigger handling
- one explicit orchestration owner exists for covered runtime-business routing and follow-up
- state write-back still converges through one documented sink
- targeted ownership regressions pass
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run lint:plans`

## Verification Story

Implementation must include:

- targeted robustness tests proving `main.ts` no longer directly owns the covered business orchestration seams
- one updated weekly call-flow artifact showing request entry, runtime decision, follow-up owner, and write-back sink
- full repository verification gates

## Risk Notes

- If the child drifts into presenter/render redesign, it has crossed scope
- If the child rewrites task or house contract families, it has crossed scope
- If the child creates multiple new orchestration owners instead of one narrow seam, it has failed the boundary objective
