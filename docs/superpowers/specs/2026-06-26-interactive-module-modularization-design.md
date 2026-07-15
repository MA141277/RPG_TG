# Interactive Module Modularization Design

## 1. Goal

This design defines a unified runtime contract for the project's playable interactive systems.

The target is to let the runtime host:

- score/grade-driven minigames
- longer multi-phase table interactions
- full-screen or embedded story battles

through one shared orchestration layer.

This design is intentionally broader than a "minigame spec".

Reason:

- some interactions are ordinary minigames
- `story-battle` is not an ordinary minigame
- both still belong to the same larger category of standalone interactive runtime modules

## 2. Core Vocabulary

### 2.1 `interactive`

`interactive` means:

- a module enters a dedicated runtime session
- it accepts player input and/or timed ticks
- it owns temporary session state while running
- it resolves into a structured result
- control then returns to the normal story / house / city / map loop

Examples in this repository:

- city begging
- grain accounting
- medicine compounding
- tea-house debate
- tavern work QTE
- tavern gamble
- story battle

### 2.2 `InteractiveModuleContract`

This is the widest shared contract.

It defines what any interactive module must expose to the runtime:

- how to create a session
- how to handle requests
- how to build a renderable model
- how to resolve a result

This contract must support both:

- overlay minigames
- full-screen battle-like modules

### 2.3 `MinigameContract`

This is a semantic specialization of `InteractiveModuleContract`.

A minigame is still an interactive module, but with narrower assumptions:

- usually score/grade driven
- usually overlay or in-place UI
- usually returns `success / failure / partial`
- usually settles through reward/effect application and returns to a previous view

### 2.4 `story-battle`

`story-battle` is an interactive module.

It is not required to fit the narrower minigame assumptions.

Why:

- it has a dedicated `battle` view
- it may render through embedded iframe mode
- it owns battle-specific phase logic
- its settlement modifies story-facing mission/review/navigation state

## 3. Scope

This design defines:

- shared runtime contracts
- session shape
- request shape
- result shape
- rendering-mode distinctions
- migration constraints

This design does not define:

- the final visual design of every minigame
- scenario-pack JSON schema for launching interactions
- a replacement battle ruleset
- the exact implementation order of every file change

Implementation sequencing belongs in the paired plan document:

- [2026-06-26-interactive-module-modularization-plan.md](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/docs/superpowers/plans/2026-06-26-interactive-module-modularization-plan.md:1)

## 4. Architectural Rule

All standalone interactions must eventually follow this layered structure:

### Layer A: Shared Interactive Runtime

Owns:

- session lifecycle
- registry lookup
- shared request routing
- shared settlement path

Does not own:

- scenario-specific launch conditions
- house-specific stamina checks
- story-specific trigger timing

### Layer B: Interactive Module Implementations

Owns:

- module-local session state
- module-local request handling
- module-local view model payload
- module-local result semantics

### Layer C: Caller Adapters

Owns:

- deciding when a module may launch
- constructing launch config
- invoking the shared runtime

Callers include:

- scene callback paths
- house modules
- city-level actions

### Layer D: Content / Story / Scenario Data

Owns:

- which event or house action launches which module
- localized text ids
- configurable interaction payload values

## 5. Non-Negotiable Boundary Rules

### 5.1 No module-specific orchestration branches in `main.ts`

`main.ts` may orchestrate the shared interactive runtime.

It must not gain branches like:

- `if battle X then ...`
- `if accounting then ...`
- `if tavern gamble then ...`

### 5.2 House modules become launch adapters, not gameplay engines

A house module may still:

- block launch
- construct config
- consume results

But the gameplay loop itself should move out of the house module when it is truly reusable or independently interactive.

### 5.3 Result settlement must be unified

Interactive modules may compute their own outcomes.

They must not each invent unrelated settlement pipelines for:

- flags
- variables
- mission text
- return navigation

Those must pass through one shared runtime settlement path.

### 5.4 Rendering mode must be explicit

The shared system must not assume all interactive modules are overlays.

Battle-style modules may require:

- full-screen view mode
- embedded iframe mode

### 5.5 Legacy state fragmentation is transitional only

Current repository state uses multiple session channels.

That is acceptable during migration.

It is not the target architecture.

## 6. Contract Overview

## 6.1 Module Identity

Every interactive module must have a stable id.

Recommended ids:

- `city-begging`
- `grain-accounting`
- `medicine-compounding`
- `tea-house-debate`
- `tavern-work-qte`
- `tavern-gamble`
- `story-battle`

These ids are runtime ids, not view ids and not content text ids.

## 6.2 Category

Every module declares:

- `minigame`
- `battle`

Current intended classification:

- `city-begging` -> `minigame`
- `grain-accounting` -> `minigame`
- `medicine-compounding` -> `minigame`
- `tea-house-debate` -> `minigame`
- `tavern-work-qte` -> `minigame`
- `tavern-gamble` -> `minigame`
- `story-battle` -> `battle`

## 6.3 Request Contract

The shared runtime must accept a stable request union.

Recommended shape:

```ts
type InteractiveRequest =
  | { type: "action"; actionId: string }
  | { type: "field"; fieldId: string; value: string }
  | { type: "tick"; tickId: string }
  | { type: "external"; eventId: string; payload?: Record<string, unknown> };
```

Purpose of each kind:

- `action`: button click or explicit command
- `field`: input field mutation
- `tick`: timer- or interval-driven advancement
- `external`: iframe callback, browser message, or similar integration bridge

`external` is required because `story-battle` already uses an embedded callback completion path.

## 6.4 Origin Contract

The runtime must remember where a module came from.

Recommended shape:

```ts
type InteractiveOrigin = {
  source: "scene-action" | "house-action" | "city-action" | "story-callback";
  cityId?: string;
  houseId?: string;
  eventId?: string;
  sceneId?: string;
};
```

Reason:

- result settlement may need to restore a caller-specific context
- analytics/debugging become possible
- story battle launch source is not the same as a house button

## 6.5 Completion Contract

The runtime must know how to return from the module.

Recommended shape:

```ts
type InteractiveCompletionPlan = {
  returnView: ViewName;
  enterHouseId?: string | null;
  mainMissionText?: string;
  reviewDateText?: string;
};
```

This is especially important for `story-battle`.

## 7. Shared Session Contract

## 7.1 Goal

The project should converge on one shared active session channel for interactive modules.

Recommended target:

```ts
type ActiveInteractiveSession =
  | {
      moduleId: InteractiveModuleId;
      category: "minigame" | "battle";
      state: unknown;
      origin: InteractiveOrigin;
      completion: InteractiveCompletionPlan;
    }
  | null;
```

## 7.2 Transitional Rule

During migration it is acceptable to keep:

- `runtime.activitySession`
- `appState.beggingMiniGameState`
- `gameState.storyBattle`

But they should be treated as compatibility shims, not the final design.

## 8. Shared Result Contract

Every interactive module must resolve into a structured result.

Recommended shape:

```ts
type InteractiveResult = {
  moduleId: InteractiveModuleId;
  category: "minigame" | "battle";
  outcome: "victory" | "defeat" | "success" | "failure" | "partial";
  score?: number;
  grade?: string;
  summaryLines?: string[];
  effects?: Effect[];
  flags?: Record<string, boolean>;
  variables?: Record<string, string | number>;
  navigation?: {
    returnView?: ViewName;
    enterHouseId?: string | null;
  };
};
```

### Result Rules

- `score` and `grade` are optional
- `victory / defeat` must be allowed for battle
- `effects` should be preferred for generic gameplay mutations
- flags and variables may still be included for runtime-owned story hooks
- navigation must be explicit when the caller cannot safely infer it

## 9. Rendering Contract

The runtime must distinguish presentation mode from gameplay category.

Recommended shape:

```ts
type InteractivePresentation =
  | { mode: "overlay" }
  | { mode: "full-screen" }
  | { mode: "embedded-iframe"; src: string };
```

### Rules

- most minigames should use `overlay`
- full-page interactions may use `full-screen`
- embedded battle demos may use `embedded-iframe`

Do not infer rendering mode from `category`.

Reason:

- category answers "what kind of module is this?"
- presentation answers "how should it be shown?"

## 10. `InteractiveModuleContract`

Recommended shape:

```ts
type InteractiveModuleContract<
  Config,
  SessionState,
  ViewModel
> = {
  id: InteractiveModuleId;
  category: "minigame" | "battle";
  createSession(input: {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    config: Config;
    origin: InteractiveOrigin;
    completion: InteractiveCompletionPlan;
  }): SessionState;
  dispatch(input: {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    config: Config;
    sessionState: SessionState;
    request: InteractiveRequest;
  }): {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    sessionState: SessionState;
    result?: InteractiveResult | null;
  };
  buildViewModel(input: {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    config: Config;
    sessionState: SessionState;
  }): ViewModel;
  resolveResult?(input: {
    gameState: GameState;
    characterDefinitions: CharacterDefinition[];
    config: Config;
    sessionState: SessionState;
  }): InteractiveResult | null;
};
```

### Rules

- `createSession` is required
- `dispatch` is required
- `buildViewModel` is required
- `resolveResult` may be inline in `dispatch` or supplied separately

Either pattern is allowed:

- `dispatch` returns `result`
- or `resolveResult` derives `result` from a finished session state

But one module should use one clear convention, not both in contradictory ways.

## 11. `MinigameContract`

`MinigameContract` is not a second runtime.

It is a narrower semantic specialization of `InteractiveModuleContract`.

Additional assumptions:

- usually launched from house/city overlays
- usually has score or grade
- usually returns to a previous house/city/scene flow

It may share the exact same runtime implementation with `InteractiveModuleContract`.

The distinction is architectural, not necessarily code-structural.

## 12. Story Battle Rules

`story-battle` must join the shared interactive runtime under these rules:

### 12.1 It remains category `battle`

It must not be mislabeled as `minigame` just to satisfy a smaller contract.

### 12.2 It may keep battle-specific session structure

Its internal state may still include:

- units
- phase
- battle log
- completion payload
- embedded demo metadata

No requirement exists to flatten battle state into a score/round-only shape.

### 12.3 It must use shared settlement shape

Even though its internal phase logic differs, its completion must still flow through:

- `InteractiveResult`
- shared runtime navigation/flag/variable handling

### 12.4 Embedded callback completion must route through shared request dispatch

The current embedded completion path should be modeled as an `external` request instead of a battle-only side channel.

## 13. Existing Repository Mapping

### Current minigame-side sources

- `src/application/minigames/city-begging-minigame.ts`
- `src/application/grain-shop/accounting-minigame.ts`
- `src/application/medicine-house/compounding-minigame.ts`
- `src/application/tea-house/tea-house-debate.ts`
- `src/application/house-modules/tavern/tavern-house-module.ts`

### Current battle-side sources

- `src/domain/story-battle.ts`
- `src/application/story-battle/story-battle-runtime.ts`
- `src/ui/views/battle/story-battle-view.ts`

### Current runtime fragmentation

- `runtime.activitySession`
- `appState.beggingMiniGameState`
- `gameState.storyBattle`

This design exists to converge those paths, not to preserve fragmentation.

## 14. Migration Constraints

### 14.1 Do not move everything at once

Migrate simple minigames first:

- accounting
- compounding
- debate

Then:

- city begging
- tavern work QTE
- tavern gamble

Finally:

- story battle

### 14.2 Keep behavior stable before deleting legacy fields

The shared contract may be introduced before old fields are removed.

Compatibility is preferable to premature cleanup.

### 14.3 Preserve house and story launch semantics

This design does not allow rewriting:

- story triggers into house triggers
- battle callbacks into fake house flows
- full-screen battle into forced overlay mode

## 15. Parallel Collaboration Safety

This design document is safe to create while other Codex threads are modifying the repository.

Implementation is not automatically safe.

High-conflict files include:

- `src/domain/game-state.ts`
- `src/domain/house-module.ts`
- `src/main.ts`
- `src/ui/app-render.ts`
- `tests/robustness.test.cjs`

Recommended rule:

- documentation may proceed in the current worktree
- runtime implementation should use a dedicated worktree if other threads are active on shared boundaries

## 16. Done Condition

This design is successfully realized when:

- one shared interactive runtime exists
- ordinary minigames use the shared contract
- `story-battle` uses the same top-level runtime path without losing battle-specific behavior
- house modules act as launch adapters rather than private gameplay engines
- rendering mode is explicit and no longer inferred from ad hoc module branches
