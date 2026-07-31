# Playable Minigame Independence Design

**Date:** 2026-07-31
**Status:** Draft for review
**Scope:** `city-begging` and `grain-accounting` as the first two reference slices for fully independent, cross-project-portable minigames

## Goal

Move representative minigames to a truly independent playable model so they no longer depend on house-local or shell-local business flow. After this slice, menu, house, dialogue, task, or future entrypoints should only launch a minigame through the unified playable runtime. Persistent gameplay changes must still land through unified event routing and settlement.

This independence target is not limited to repository-local cleanup. The first two slices should also establish a directory/resource structure that makes a minigame realistically portable to another project with only shared-runtime adapter work.

## Why This Slice Comes First

Current work has already connected much of the launch chain:

- event destinations can lower to `launchPlayable`
- playable integrations exist
- menu-triggered minigames can route through event commands

But the minigames themselves are still not independent enough. They can be triggered, yet they still depend on old host-owned behavior or incomplete runtime ownership. That blocks later work on templates, editor authoring, future entry sources, and consistent settlement routing.

This slice therefore prioritizes minigame independence over new editor affordances.

## Representative Coverage

The first two sample minigames are:

1. `city-begging`
   - represents an external-entry minigame
   - should be launchable from city/menu/event flow
   - should not require a concrete house-local owner to function
   - should close cleanly through unified runtime/routing

2. `grain-accounting`
   - represents a host-return minigame
   - should be launchable from a house-owned entry
   - should run as an independent playable session
   - should return through unified runtime/routing rather than house-private branches

These two slices define the standard for later minigames such as `medicine-compounding`, `activity-qte`, and future custom playables.

## Portability Goal

The intended target is cross-project portability, not just in-repo tidiness.

Each minigame should move toward a self-contained package directory that carries:

- gameplay runtime logic
- launch/completion adapter entrypoints
- presenter/view code
- text/config owned by the minigame
- minigame-local assets
- explicit exports used by shared runtime and routing layers

Shared layers should remain outside the minigame package only when they are truly generic:

- playable contracts
- playable runtime loader
- event-route bridge
- settlement bridge
- generic UI primitives/utilities

## Core Design

### 1. Minigame Module Independence

A minigame is not defined by where it is launched from. A minigame module must stay neutral with respect to menu, house, dialogue, task, or any future trigger source.

A minigame module should define only:

- runtime input contract
- runtime session state
- gameplay step/update logic
- presentation state needed by the unified playable overlay
- standard completion result

A minigame module must not define:

- host-specific navigation behavior
- direct writes to persistent game state
- direct page transitions
- direct dependency on house-local or shell-local business modules

### 2. Unified Runtime Ownership

All minigames must be loaded and owned by the shared playable runtime.

This runtime is responsible for:

- creating the playable session
- passing standardized launch input
- exposing safe read access to external context
- rendering the minigame inside the shared playable overlay/runtime shell
- receiving the minigame’s completion result
- translating completion into routed follow-up work

No minigame should bootstrap or dismiss itself through an ad hoc host-specific path.

This runtime ownership should also make portability easier: the imported project should only need to wire the shared playable runtime and route bridge, not rediscover host-local lifecycle code.

### 3. Context Is Session Input, Not Minigame Identity

The minigame itself must not statically declare host categories such as `house`, `dialogue`, `task`, or `external`.

Those values are launch-session context, supplied by the launching route/integration. This keeps the minigame independent from future trigger families. New trigger sources should only need new adapters that produce the same standardized launch context.

### 4. Read-Only External Context

Minigames are allowed to read outside data, but only through unified runtime-owned inputs:

- launch-time snapshot data
- runtime-provided read-only context query interface

This allows a minigame to inspect the outside world without directly coupling to host-private modules or shell state.

Examples of allowed reads:

- current actor/city/building snapshot at launch
- configured difficulty or target score
- runtime-owned read access to current inventory/resource/task status

Examples of forbidden reads:

- importing a house module to inspect private session data
- reading shell/UI state directly
- reading arbitrary feature-owned globals

### 4a. Resource Ownership

To support portability, minigame-owned resources should live with the minigame package by default.

Preferred ownership:

- minigame-local texts/config stay under the minigame directory
- minigame-local images/audio/animation assets stay under the minigame directory
- resource references leave the package only through explicit exported paths or a small adapter layer

Avoid:

- scattering minigame assets under unrelated house/UI/shared feature paths
- hidden imports of project-internal resource paths from the minigame implementation
- relying on host-private assets unless they are passed through an explicit adapter seam

### 5. Completion Must Route Through Event + Settlement

Minigames must not directly apply persistent changes.

Instead, a minigame completes by emitting a standard raw result:

- `outcome`
- gameplay metrics
- result payload

The runtime/routing layer then converts that result into unified routed follow-up:

- a required `settlement`
- an optional follow-up `event`

Persistent gameplay changes therefore remain owned by settlement/runtime commit rather than by the minigame module itself.

This rule applies even when the minigame is cancelled. Cancellation may route to a no-op or minimal settlement, but it should still stay inside the unified event/settlement flow.

## Hard Rules For New Minigames

1. A minigame must run under the shared playable runtime.
2. A minigame must accept only standardized launch input and runtime-provided context readers.
3. A minigame must not import or depend on a concrete house, menu, dialogue, task, or shell business module.
4. A minigame must not directly modify persistent character, city, building, inventory, money, stamina, skill, or task state.
5. A minigame must emit a standard completion result rather than directly applying state changes or navigation changes.
6. The completion result must always be translated into `settlement`, with optional follow-up `event`.
7. Return/close/reenter behavior is determined by runtime/routing context, not by the minigame module itself.
8. Minigame UI must render through the shared playable overlay/runtime, not a host-private page container.
9. New trigger sources must adapt into the shared launch contract; they must not require minigame-specific rewrites.
10. New minigames must reuse the same launch, completion, settlement, and follow-up contract rather than inventing a special one-off protocol.
11. Minigame code should live in a self-contained package directory rather than being split across unrelated feature folders.
12. Minigame-owned texts/config/images/audio/animation assets should live with the minigame package by default.
13. If a minigame must use shared project resources, it must do so through an explicit adapter seam rather than hardcoded project-internal paths.

## Boundary Summary

### What Stays Outside The Minigame

- menu composition
- event routing
- house ownership and return flow
- dialogue/task/startup entry selection
- persistent settlement application
- broader navigation continuation

### What Moves Fully Inside The Minigame Slice

- gameplay loop
- session-local counters, timers, turns, score, and transient progress
- session-local validation for player actions
- standard completion decision
- presentation state needed by the playable overlay
- minigame-owned texts/config
- minigame-owned images/audio/animation assets

## Target Package Shape

The reference slices should move toward a package structure similar to:

```text
src/application/playables/builtin/<minigame-id>/
  index.ts
  <minigame-id>-definition.ts
  <minigame-id>-runtime.ts
  <minigame-id>-presenter.ts
  <minigame-id>-view.ts
  <minigame-id>-settlement.ts
  <minigame-id>-config.ts
  texts/
  assets/
```

Exact filenames may vary to fit existing repository conventions, but the ownership intent must remain:

- one package directory per minigame
- minigame-owned logic and resources co-located
- shared runtime/route/settlement seams outside the package

## First Implementation Target

The implementation phase should use the following sequence:

1. make `city-begging` independent as the external-entry reference slice
2. make `grain-accounting` independent as the host-return reference slice
3. converge shared launch/completion/settlement expectations from those two slices
4. apply the same contract to later minigames

## Expected Outcome

After this design is implemented:

- minigames are no longer treated as host-private features
- future entry sources can launch existing minigames without rewriting them
- future minigames can be added under a stable shared contract
- minigame-local assets and texts are no longer scattered across unrelated feature paths
- the first two reference slices become realistic candidates for cross-project transplantation
- settlement and follow-up continue to obey the repository’s unified event-route direction
