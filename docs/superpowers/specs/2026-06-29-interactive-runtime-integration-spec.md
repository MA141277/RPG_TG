# Interactive Runtime Integration Spec

## 1. Goal

This spec defines how the project should move house-driven interaction, minigame launch, and story-battle launch under `src/core/runtime` so `src/main.ts` stops directly owning those session lifecycles.

The target is not to rewrite the underlying house modules, minigames, or battle logic in one pass.

The target is to introduce a stable runtime-owned interaction path that:

- receives launch and action requests
- coordinates house/session handoff
- owns interactive session start and completion entry
- leaves rendering and presenter work for a later child plan

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
- minigame and story-battle runtime logic still launched from `src/main.ts`

Current interaction ownership is still fragmented:

- `src/main.ts` creates and holds `HouseRuntime`
- `src/main.ts` starts and stops city begging minigame loops
- `src/main.ts` directly handles story-battle action routing
- `src/application/house/house-runtime.ts` depends on `getAppState`, `setAppState`, `renderApp`, browser timers, and map auto-advance hooks

That means the app has core runtime seams for navigation/time/event, but interaction-heavy flows still bypass one shared runtime owner.

## 4. Problem Statement

The current interaction flows have three structural problems:

1. session ownership is split between `GameState`, `AppState`, `HouseRuntime`, and direct `main.ts` control flow
2. house, minigame, and battle launch paths do not enter through one core runtime dispatch boundary
3. `src/main.ts` still mixes browser event binding with feature-specific interactive orchestration

Without fixing those problems, Child 5 presenter work would stabilize against the wrong runtime boundary.

## 5. Target Runtime Model

Child 4 should converge the covered flows on this shape:

`browser event -> runtime request factory -> core runtime dispatch -> interaction runtime / house bridge -> legacy feature adapter -> runtime result -> main render coordination`

The important ownership rule is:

- `src/main.ts` may still bind DOM events and trigger re-render
- `src/main.ts` must stop directly deciding how house sessions, minigame sessions, and story-battle sessions start, advance, and exit

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

## 9. Required Contracts

Child 4 should introduce an additive contract file such as:

- `src/core/contracts/interactive-runtime.ts`

The contract should define:

- interactive launch kinds
- active interactive session metadata
- request factory ids used by `src/main.ts`
- runtime-side result payload needed for later presenter work

Recommended categories:

- `activity-qte`
- `city-begging`
- `story-battle`

If a separate house-bridge contract is needed, it should remain narrow and focused on integration only.

## 10. Required Runtime Files

Child 4 should introduce or formalize:

- `src/core/runtime/interactive-runtime.ts`
- `src/core/runtime/house-runtime.ts` or `src/core/runtime/house-runtime-bridge.ts`
- `src/core/adapters/legacy-house-adapter.ts`
- `src/core/adapters/legacy-interactive-adapter.ts`

These files should:

- keep legacy feature code reusable
- move orchestration ownership out of `main.ts`
- avoid creating a second parallel interaction architecture

## 11. Main.ts Reduction Rule

After Child 4:

- `src/main.ts` may still bind click/pointer/keyboard/browser loop handlers
- `src/main.ts` may still schedule render and browser-only animation hooks
- `src/main.ts` must no longer directly own:
  - house runtime construction from application layer
  - city begging minigame launch/exit decisions
  - embedded story battle action branching
  - direct feature-specific interactive session start/stop orchestration

## 12. Adapter Rule

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

## 13. Acceptance Criteria

Child 4 is successful only when:

- the formal child plan exists and is executable
- at least one house-driven interaction path enters through core runtime ownership
- activity/QTE launch and completion no longer depend on direct `main.ts` orchestration decisions
- story-battle launch/action handling no longer depends on direct `main.ts` feature branching
- house runtime integration is represented by a core seam rather than only by application runtime ownership
- no presenter/render decoupling work is pulled into this child

## 14. Verification Expectations

Any implementation plan based on this spec must include:

- source-guard tests proving `main.ts` no longer imports/owns the old application runtime path for covered interaction scope
- focused runtime seam tests for interactive request factories and runtime entrypoints
- `npm run typecheck`
- `npm test`
- `npm run build`

If some browser-loop behavior remains manual-only during transition, the plan must record a smoke path explicitly.
