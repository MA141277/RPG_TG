# Interactive Module Modularization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modularize the project's built-in playable interactions under a shared runtime contract so minigames and `story-battle` can be loaded, run, rendered, and settled through one unified interaction framework rather than fragmented house-specific pipelines.

**Architecture:** Introduce a two-level contract model. `InteractiveModuleContract` is the superset contract for any standalone interactive runtime, including full-screen battle modules. `MinigameContract` is a narrower contract for overlay-driven score/grade-oriented interactions such as accounting, compounding, debate, tavern work QTE, tavern gamble, and city begging. Keep house modules responsible only for entry gating, scenario routing, and post-result world integration. Keep scenario/story content responsible for choosing *when* to launch an interaction, not *how* the interaction works internally.

**Tech Stack:** TypeScript, Vite, unified runtime state, house-module registry, scenario-pack JSON content, CommonJS robustness test suite, ripgrep

## Execution State

- Status: `unknown`
- Last Updated: `2026-06-26`
- Current Focus: `Inspect completed checkboxes and current code state before resuming.`
- Next Step: `Resume from the first unchecked checkbox.`
- Verification: `Check latest progress entry and rerun required commands before continuing.`
- Notes: `Historical progress before this tracking block may be incomplete.`

## Progress Log

- 2026-06-26
  - Summary: `Added standardized progress-tracking sections to this plan.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Resume from the first unchecked checkbox.`

---

## Functional Boundary

### Layer 1: Interactive Module Runtime

Owns:
- session creation
- unified request dispatch (`action`, `field`, `tick`, optional external callback bridge)
- module registry lookup
- view-model construction
- result settlement
- return navigation

Does not own:
- story trigger evaluation
- house-specific unlock logic
- scenario-specific mission cadence

### Layer 2: Minigame Specialization

Owns:
- score/grade style interactions
- overlay-style or in-place interaction loops
- common result shape for rewardable interactions

Expected modules:
- city begging
- grain accounting
- medicine compounding
- tea-house debate
- tavern work QTE
- tavern gamble

### Layer 3: Story Battle Specialization

Owns:
- battle session state
- battle phase progression
- battle-specific result semantics such as victory / defeat
- battle view mode (`full-screen` or embedded demo iframe)

Important distinction:
- `story-battle` should join the shared *interactive* runtime
- it should **not** be forced into the narrower minigame assumptions too early

### Layer 4: Caller Adapters

Current callers that should become adapters:
- scene callbacks
- house module actions
- city menu actions
- future scenario-pack-configured interactive launchers

Adapters should only:
- validate stamina / unlock / timing
- construct config payload
- launch an interactive module
- consume the settled result

## Proposed Contract Model

### `InteractiveModuleContract`

Purpose:
- the widest reusable contract
- supports both minigames and story battles

Required responsibilities:
- `createSession`
- `dispatch`
- `buildViewModel`
- `resolveResult`

Expected shape:

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

### `MinigameContract`

Purpose:
- narrow specialization for score/grade/reward-oriented interactions
- overlay-driven by default

Expected assumptions:
- result is usually `success / failure / partial`
- often has `score`, `grade`, and reward lines
- usually returns to `house`, `city`, or `scene`

Rule:
- `MinigameContract` should be a semantic specialization of `InteractiveModuleContract`, not a separate incompatible runtime

### `InteractiveResult`

Purpose:
- unify settlement across all interactive modules

Must support:
- score / grade for minigames
- victory / defeat for battle
- world-state flags and variables
- optional `Effect[]`
- navigation back into normal runtime

Expected fields:

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

### `InteractiveSession`

Purpose:
- replace fragmented global interaction slots

Current fragmentation to retire progressively:
- `runtime.activitySession`
- `appState.beggingMiniGameState`
- `gameState.storyBattle`
- selected house overlays that are actually active game loops

Target direction:

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

## Current Built-In Interaction Inventory

### P0: Minigames with standalone rule logic and visible UI

- `city-begging`
- `grain-accounting`
- `medicine-compounding`
- `tea-house-debate`

Reason for priority:
- each already has a recognizable state machine
- each has a dedicated runtime file or strongly isolated rule file
- each is simpler than tavern gamble and less entangled than story battle

### P1: Minigames still embedded inside a house module loop

- `tavern-work-qte`
- `tavern-gamble`

Reason for later priority:
- both are playable, but state is tightly coupled to tavern session structure
- gamble in particular has a larger session surface and more action ids

### P2: Story battle as a shared interactive module, not a minigame

- `story-battle`

Reason for final migration:
- owns a dedicated `battle` view
- has embedded iframe mode
- settlement currently rewrites mission text, review text, flags, and navigation
- should validate the shared contract after the minigame path is stable

## Migration Order

### Phase 0: Freeze shared architecture before code movement

- [ ] Define vocabulary and ownership boundaries in docs
- [ ] Agree that `story-battle` joins the shared interactive runtime but is not forced into the minigame subset
- [ ] Confirm no parallel feature branch is actively rewriting `domain/game-state.ts`, `ui/app-render.ts`, or `house-module.ts`

### Phase 1: Add new shared runtime types without deleting old state

- [ ] Add `src/domain/interactive-module.ts`
- [ ] Introduce `InteractiveModuleId`, `InteractiveRequest`, `InteractiveOrigin`, `InteractiveCompletionPlan`, `InteractiveResult`, and `ActiveInteractiveSession`
- [ ] Keep legacy fields in place temporarily for compatibility

Success criteria:
- no gameplay path changes yet
- type layer compiles

### Phase 2: Build shared runtime and registry

- [ ] Add `src/application/interactive/interactive-module-registry.ts`
- [ ] Add `src/application/interactive/interactive-runtime.ts`
- [ ] Define shared start / dispatch / settle flow
- [ ] Add a presentation model that distinguishes overlay vs full-screen vs embedded iframe

Success criteria:
- runtime can host at least one migrated minigame end-to-end

### Phase 3: Migrate simple minigames first

- [ ] Migrate `grain-accounting`
- [ ] Migrate `medicine-compounding`
- [ ] Migrate `tea-house-debate`

Reason:
- these have the cleanest module-local rule boundaries
- they are good probes for action / field / tick compatibility

### Phase 4: Migrate global minigame runtime

- [ ] Migrate `city-begging`
- [ ] Retire dedicated `beggingMiniGameState` once parity is proven

Reason:
- already separate from house logic
- good test for non-house launch points and dedicated minigame rendering

### Phase 5: Migrate tavern interactions

- [ ] Migrate `tavern-work-qte`
- [ ] Migrate `tavern-gamble`

Reason:
- both are currently house-owned loops
- gamble is the highest-risk minigame because of action density and long-session state

### Phase 6: Migrate story battle into shared interactive runtime

- [ ] Wrap `story-battle` as an `InteractiveModuleContract`
- [ ] Preserve battle-specific view mode and embedded demo support
- [ ] Replace direct `gameState.storyBattle` entry logic with shared launch path
- [ ] Replace direct finish logic with `InteractiveResult` settlement

Success criteria:
- scene callback still launches the same battle
- `battle` view still renders
- post-battle return to keep review remains behaviorally identical

## Expected File Change Inventory

### New domain files

- [ ] `src/domain/interactive-module.ts`

### New application runtime files

- [ ] `src/application/interactive/interactive-module-registry.ts`
- [ ] `src/application/interactive/interactive-runtime.ts`

### Likely new migrated module wrappers

- [ ] `src/application/interactive/modules/grain-accounting.ts`
- [ ] `src/application/interactive/modules/medicine-compounding.ts`
- [ ] `src/application/interactive/modules/tea-house-debate.ts`
- [ ] `src/application/interactive/modules/city-begging.ts`
- [ ] `src/application/interactive/modules/tavern-work-qte.ts`
- [ ] `src/application/interactive/modules/tavern-gamble.ts`
- [ ] `src/application/interactive/modules/story-battle.ts`

### Existing files likely to change

- [ ] `src/domain/game-state.ts`
- [ ] `src/domain/activity-session.ts`
- [ ] `src/domain/house-module.ts`
- [ ] `src/application/activity/activity-runner.ts`
- [ ] `src/application/story/story-callbacks.ts`
- [ ] `src/application/story-battle/story-battle-runtime.ts`
- [ ] `src/application/minigames/city-begging-minigame.ts`
- [ ] `src/application/house-modules/grain-shop/grain-shop-house-module.ts`
- [ ] `src/application/house-modules/medicine-house/medicine-house-house-module.ts`
- [ ] `src/application/house-modules/tea-house/tea-house-house-module.ts`
- [ ] `src/application/house-modules/tavern/tavern-house-module.ts`
- [ ] `src/main.ts`
- [ ] `src/ui/app-render.ts`
- [ ] `src/ui/views/scene/scene-view.ts`
- [ ] `src/ui/views/minigames/city-begging-minigame-view.ts`
- [ ] `src/ui/views/battle/story-battle-view.ts`
- [ ] dedicated house views that currently render embedded interaction overlays
- [ ] `tests/robustness.test.cjs`
- [ ] `docs/change-log.md`

### Compatibility / cleanup files likely to change later

- [ ] pack text entry files if action labels or battle copy need id stabilization
- [ ] future pack-owned interactive config tables if mod loading is expanded

## Risk Analysis

### Runtime-shape risk

- current runtime keeps multiple parallel session channels
- migrating too quickly can break one path while another still expects the legacy slot

Mitigation:
- keep old fields temporarily
- bridge them inside the shared runtime during transition

### View-layer risk

- battle is a full-screen view
- most minigames are overlays
- forcing one rendering mode too early will either bloat overlay code or special-case battle again

Mitigation:
- introduce explicit `presentation.mode`
- do not assume all interactive modules render as overlays

### House-coupling risk

- tavern and some house modules currently own both launch logic and internal gameplay state
- moving too much logic at once can break entry gating and result application

Mitigation:
- split migration into rule extraction first, launch adapter second

### Story-callback risk

- `story-battle` is launched through callback wiring, not through a normal house button
- callback semantics must stay stable during migration

Mitigation:
- callback should call the new shared interactive runtime, not re-implement launch logic

### Parallel-work risk

- this refactor touches high-conflict shared boundaries
- especially risky files:
  - `src/domain/game-state.ts`
  - `src/domain/house-module.ts`
  - `src/main.ts`
  - `src/ui/app-render.ts`
  - `tests/robustness.test.cjs`

Mitigation:
- do not begin implementation while other Codex threads are actively modifying shared runtime/view files in the same worktree
- prefer a dedicated worktree for the actual code migration
- safe work during parallel execution:
  - design docs
  - type drafts in isolated proposal docs
  - migration inventories
- unsafe work during parallel execution:
  - changing state contracts
  - moving house overlay rendering
  - editing `main.ts` orchestration

## Collaboration Notes

- This plan is safe to author while other Codex threads are running because it only changes documentation.
- Implementation should begin only after confirming no concurrent thread is editing the shared runtime or UI boundary files.
- If concurrent implementation cannot be avoided, split by phase and isolate work into separate worktrees.
- Detailed execution breakdown: `docs/superpowers/plans/2026-06-26-interactive-module-modularization-task-plan.md`

## Exit Criteria

- One shared interactive runtime exists.
- At least one migrated minigame proves the contract.
- `story-battle` runs through the shared interactive path without losing current battle behavior.
- House modules become launch adapters rather than private gameplay runtimes.
- The project is closer to pack-owned, reusable, and mod-friendly interactive systems.
