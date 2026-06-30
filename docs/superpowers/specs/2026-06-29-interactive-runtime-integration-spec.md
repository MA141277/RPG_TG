# Interactive Runtime Integration Spec

## 1. Goal

This spec defines how the project should move house-driven interaction, minigame launch, and story-battle launch under `src/core/runtime` so `src/main.ts` stops directly owning those session lifecycles.

The target is not to rewrite the underlying house modules, minigames, or battle logic in one pass.

The target is to introduce a stable runtime-owned interaction path that:

- receives launch and action requests
- coordinates house/session handoff
- owns interactive session start and completion entry
- leaves rendering and presenter work for a later child plan

As of the second Child 4 implementation slice, the repository already has both bridge-level house/interactive seams and the minimum unified runtime state carrier. The remaining design target is no longer "whether to widen state/result at all"; it is how far to expand shared-dispatch coverage on top of that landed carrier without forcing premature convergence into the Child 1 `src/core/contracts/core-state.ts` shell.

## 2. Non-Goals

This spec does not define:

- presenter/render decoupling
- full house module redesign
- full task runtime extraction
- full save/load cutover
- full engine-session production integration closure
- schema-driven layout rendering

Those remain separate workstreams.

## 3. Current Repository State

The repository already contains:

- Child 1 core runtime boundary files under `src/core/**`
- Child 3 runtime seam files for navigation, time, event, and first scene handoff
- a legacy application house runtime in `src/application/house/house-runtime.ts`
- the first Child 4 bridge slice under:
  - `src/core/contracts/interactive-runtime.ts`
  - `src/core/runtime/interactive-runtime.ts`
  - `src/core/runtime/house-runtime.ts`
  - `src/core/adapters/legacy-house-adapter.ts`
  - `src/core/adapters/legacy-interactive-adapter.ts`
- the second Child 4 minimum-carrier slice under:
  - `src/core/contracts/runtime-state.ts`
  - widened `src/core/contracts/runtime-result.ts`
  - widened `src/core/runtime/runtime-router.ts`
  - widened `src/core/runtime/runtime-dispatch.ts`
  - widened `src/core/runtime/runtime-settlement.ts`

Current interaction ownership is still fragmented:

- `src/main.ts` no longer imports `application/house/house-runtime` directly for covered flows, but some covered paths still call dedicated bridge helpers such as `runInteractiveRuntime(...)` directly while only part of the surface has rejoined shared dispatch
- `src/core/runtime/runtime-router.ts` and `src/core/runtime/runtime-dispatch.ts` now operate on `RuntimeState`, but shared-dispatch coverage is not yet complete across every covered interactive flow
- `src/core/runtime/interactive-runtime.ts` now returns shared `RuntimeResult` carriage plus additive compatibility `characterDefinitions`, rather than the old private `{ appState, enterHouseId }` shape
- `src/application/house/house-runtime.ts` depends on `getAppState`, `setAppState`, `renderApp`, browser timers, and map auto-advance hooks

That means the app now has core runtime seams for navigation/time/event plus a landed minimum interactive state/result carrier, but interaction-heavy flows still do not all share one final runtime owner yet.

## 4. Problem Statement

The current interaction flows have three structural problems:

1. session ownership is split between `GameState`, `AppState`, `HouseRuntime`, and direct `main.ts` control flow
2. house, minigame, and battle launch/action paths still do not all enter through one fully shared runtime dispatch boundary
3. `src/main.ts` still mixes browser event binding with feature-specific interactive orchestration and compatibility-state application
4. the shared runtime contract is now widened to `RuntimeState -> RuntimeResult`, but characterDefinitions and some interactive-session carriage still remain on compatibility paths by design

Without fixing those problems, Child 5 presenter work would stabilize against the wrong runtime boundary.

## 5. Target Runtime Model

Child 4 should converge the covered flows on this shape:

`browser event -> runtime request factory -> shared runtime dispatch over RuntimeState -> interaction runtime / house bridge -> legacy feature adapter -> runtime result -> main render coordination`

The important ownership rule is:

- `src/main.ts` may still bind DOM events and trigger re-render
- `src/main.ts` must stop directly deciding how house sessions, minigame sessions, and story-battle sessions start, advance, and exit

The shared runtime is the single execution layer that:

- accepts runtime requests
- routes them to navigation/event/scene/interactive/house runtime owners
- mutates one unified runtime state shape
- returns one unified runtime result shape to the browser shell

## 6. Interaction Runtime Responsibilities

`Interaction Runtime` must own:

- launch request validation for covered interactive flows
- session lifecycle entry for:
  - activity QTE
  - city begging minigame
  - embedded story battle
- action dispatch for active interactive sessions
- completion and cancellation handoff back into shared runtime state

`Interaction Runtime` must not own:

- concrete HTML rendering
- house entry gating policy
- navigation ownership outside interactive launch/exit handoff
- full house business rule redesign

## 7. House Runtime Integration Seam

`House Runtime` in Child 4 is not a full new gameplay subsystem rewrite.

The required seam is:

- house entry, leave, and request dispatch become core-routed operations
- legacy `application/house/house-runtime.ts` behavior may remain behind an adapter
- house modules continue to produce their current session results during migration
- house-triggered interactive launches delegate into `Interaction Runtime` instead of opening parallel session paths from `main.ts`

This means Child 4 is responsible for a house bridge, not for rewriting every house module.

## 8. Session Ownership Rule

The covered interaction flows must converge toward runtime-owned session channels.

At minimum, Child 4 must define and document ownership for:

- active house session
- active activity/QTE session
- active city begging minigame session
- active embedded story battle session

During migration, the repository may temporarily keep some session payloads in legacy shapes, but launch/advance/complete ownership must still route through core runtime entrypoints.

## 9. Unified Runtime State Interface

The next Child 4 slice should introduce a minimum unified runtime state interface shaped like:

```ts
type RuntimeState = {
  core: GameState;
  app: RuntimeAppState;
  view: {};
};
```

With responsibility split:

- `core`
  - persistent game-rule state
  - current application-layer `GameState`
- `app`
  - runtime-owned session and flow state that affects dispatch
  - house/minigame/battle handoff state
  - auto-advance or gate state that changes runtime decisions
- `view`
  - intentionally empty in this iteration
  - reserved for a later convergence step only if shared dispatch proves it needs non-rule carrier fields

The first widening pass must not migrate every field in `AppState`.

The first widening pass should move only the app-level state needed for covered shared dispatch ownership.

Recommended first-pass mapping:

- `RuntimeState.core`
  - current `gameState` (`src/domain/game-state.ts`)
- `RuntimeState.app`
  - `beggingMiniGameState`
  - `autoAdvanceState`
  - `cityDirectoryState`
  - `locationDialogueState`
- `RuntimeState.view`
  - `{}`

Deferred from this iteration:

- `characterDefinitions` stays outside `RuntimeState.core`
- wide `RuntimeState.view` field mapping stays out of scope
- convergence from domain `GameState` to Child 1 `src/core/contracts/core-state.ts` `CoreGameState` stays out of scope

Defer rationale:

- the currently executing interactive flows already read and write the application-layer `GameState`, so treating that shape as the minimum `RuntimeState.core` carrier keeps Child 4 on the smallest viable landing
- forcing Child 4 to adopt Child 1 `CoreGameState` now would expand the work from interactive dispatch/result convergence into a broader state-model migration across unrelated engine seams
- `characterDefinitions` is still consumed through legacy-compatible seams that do not yet justify broadening the minimum rules-state carrier
- the current landing goal is to unify dispatch ownership for covered interactive flows first, not to complete all runtime-state convergence in one pass

Convergence gate for future promotion beyond this minimum carrier:

- shared dispatch coverage has expanded beyond the minimum interactive carrier slice
- `RuntimeResult.interactive` signaling is already normalized enough that the extra convergence step is isolated and reviewable
- the weekly orchestration plan explicitly promotes the next convergence target before implementation resumes
- the active child plan records why moving from domain `GameState` to Child 1 `CoreGameState`, or merging `characterDefinitions` into `RuntimeState.core`, is lower risk than keeping compatibility carriage in place

## 10. Required Contracts

Child 4 should introduce an additive contract file such as:

- `src/core/contracts/interactive-runtime.ts`
- `src/core/contracts/runtime-state.ts`

The contract should define:

- interactive launch kinds
- active interactive session metadata
- request factory ids used by `src/main.ts`
- unified runtime state shape used by shared runtime dispatch
- runtime-side result payload needed for later presenter work and house re-entry signals

Recommended categories:

- `activity-qte`
- `city-begging`
- `story-battle`

If a separate house-bridge contract is needed, it should remain narrow and focused on integration only.

## 11. Runtime Request And Result Direction

The repository may keep the current `RuntimeRequest` union shape during the next slice.

The first unified-state slice should prioritize widening `state` and `result`, not redesigning every request id.

Required direction:

- `RuntimeRequest` can remain action/tick/external
- shared runtime inputs must change from Child 1 `CoreGameState` to the Child 4 `RuntimeState`
- shared runtime results must change from Child 1 `CoreGameState` to the Child 4 `RuntimeState`
- Child 4 `RuntimeState.core` is the current application-layer `GameState`, not Child 1 `CoreGameState`
- `characterDefinitions` may continue to flow through additive compatibility parameters during this iteration
- covered interactive flows must stop returning a private `{ appState, enterHouseId }` result

The result shape should move toward:

```ts
type RuntimeResult = {
  state: RuntimeState;
  effects: Effect[];
  navigation?: NavigationTarget | null;
  scene?: { sceneId: string; currentNodeId?: string | null } | null;
  taskActions?: RuntimeTaskAction[];
  taskSignals?: RuntimeTaskSignal[];
  interactive?: RuntimeInteractiveSignal | null;
};
```

Where `interactive` is a unified signal channel for outcomes such as:

- re-enter this house
- close this interactive session
- hand control back to the current house runtime

## 12. Required Runtime Files

Child 4 should introduce or formalize:

- `src/core/runtime/interactive-runtime.ts`
- `src/core/runtime/house-runtime.ts` or `src/core/runtime/house-runtime-bridge.ts`
- `src/core/adapters/legacy-house-adapter.ts`
- `src/core/adapters/legacy-interactive-adapter.ts`
- `src/core/contracts/runtime-state.ts`

These files should:

- keep legacy feature code reusable
- move orchestration ownership out of `main.ts`
- avoid creating a second parallel interaction architecture

## 13. Main.ts Reduction Rule

After Child 4:

- `src/main.ts` may still bind click/pointer/keyboard/browser loop handlers
- `src/main.ts` may still schedule render and browser-only animation hooks
- `src/main.ts` must no longer directly own:
  - house runtime construction from application layer
  - city begging minigame launch/exit decisions
  - embedded story battle action branching
  - direct feature-specific interactive session start/stop orchestration
  - a private interactive result path that bypasses shared runtime dispatch for covered flows

## 14. Adapter Rule

Legacy behavior may remain, but only behind explicit adapters.

Allowed transitional reuse:

- `src/application/house/**`
- `src/application/house-modules/**`
- `src/application/activity/**`
- `src/application/minigames/**`
- `src/application/story-battle/**`

Not allowed:

- new direct `main.ts -> application/feature-runtime` branches for interaction scope
- introducing a second house runtime owner outside the core path
- widening `view` state into shared runtime rules ownership without a clear dispatch need

## 15. Iteration 2 Minimum Landing Scope

The next implementation slice should land only the following:

- define the minimum `RuntimeState`
- widen `RuntimeResult.state` to `RuntimeState`
- update `runtime-router.ts` and `runtime-dispatch.ts` to route over `RuntimeState`
- adapt `interactive-runtime.ts` to return shared `RuntimeResult`
- unify `RuntimeResult.interactive` for the covered Child 4 result path
- move at least one covered interactive request path through shared dispatch instead of dedicated helper-only ownership
- keep navigation/time/event seams working through additive compatibility
- keep `RuntimeState.core` based on the current application-layer `GameState`
- keep `characterDefinitions` outside `RuntimeState.core`

This slice should not:

- redesign save/load
- pull presenter/render into Child 4
- redesign all `AppState` fields at once
- fully modularize minigames yet
- migrate Child 4 all the way onto Child 1 `CoreGameState`
- merge `characterDefinitions` into `RuntimeState.core`
- broaden `RuntimeState.view` beyond `{}` for convenience-only mapping

## 16. Acceptance Criteria

Child 4 is successful only when:

- the formal child plan exists and is executable
- at least one house-driven interaction path enters through core runtime ownership
- activity/QTE launch and completion no longer depend on direct `main.ts` orchestration decisions
- story-battle launch/action handling no longer depends on direct `main.ts` feature branching
- house runtime integration is represented by a core seam rather than only by application runtime ownership
- covered interactive flows can return through shared runtime result ownership rather than a private `appState + enterHouseId` shape
- no presenter/render decoupling work is pulled into this child

## 17. Verification Expectations

Any implementation plan based on this spec must include:

- source-guard tests proving `main.ts` no longer imports/owns the old application runtime path for covered interaction scope
- focused runtime seam tests for interactive request factories and runtime entrypoints
- failing tests that prove shared runtime dispatch cannot yet carry the new unified runtime state/result shape before implementation
- `npm run typecheck`
- `npm test`
- `npm run build`

If some browser-loop behavior remains manual-only during transition, the plan must record a smoke path explicitly.

## 18. Next Iteration Route

After the minimum unified-state slice lands, the next iteration should move in this order:

1. widen more covered interactive flows to shared runtime dispatch until dedicated bridge-only control is no longer the default
2. normalize house re-entry, session closeout, and interactive completion through shared runtime signals
3. review the weekly convergence gate and only then decide whether Child 4 should move beyond domain `GameState` carriage or merge `characterDefinitions` into `RuntimeState.core`
4. define a stable minigame dispatch interface on top of the stabilized shared runtime path
5. only then start broader minigame directory migration and Child 5 presenter/render decoupling against the stabilized runtime boundary
