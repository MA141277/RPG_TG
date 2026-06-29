# Mod-First Engine Runtime Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the current game loop into a reusable engine/runtime so any future mod can plug into a stable boot, state, navigation, interaction, and save contract without editing core orchestration files.

**Architecture:** Split the project into four layers: `engine kernel`, `runtime services`, `adapter/presenter`, and `mod content packs`. The engine becomes responsible for lifecycle, state mutation, registries, and module dispatch; runtime services host navigation, interaction, time, and settlement; UI renders view models only; mods provide JSON/content/config plus optional registered behavior modules through declared capabilities.

**Tech Stack:** TypeScript, Vite, Node test runner (`tests/robustness.test.cjs`), existing content-pack system, shared domain state, registry-based runtime modules

---

## Execution State

- Status: `not-started`
- Last Updated: `2026-06-29`
- Current Focus: `Plan only. No runtime refactor executed by this document.`
- Next Step: `Approve this master plan, then produce the first child task plan for kernel/boot extraction.`
- Verification: `Not run`
- Notes: `This is the parent plan for a mod-first refactor. Child subsystem task plans should be derived from it before code changes begin.`

## Why This Plan Exists

The current project already has the start of a content boundary in [src/application/content/active-game-content.ts](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/application/content/active-game-content.ts:1), but the runtime boundary is still too weak. [src/main.ts](C:/Users/Administrator/Desktop/workspace/project/RPG_TG/src/main.ts:1) still owns too much boot, navigation, interaction, and view orchestration logic, so changing content format alone would not make the project truly `mod-first`.

This plan therefore prioritizes:

1. extracting stable engine/runtime contracts
2. shrinking `main.ts` into a thin bootstrap shell
3. making mods attach through registries and declared capabilities
4. treating JSON/data migration as a later consumer of the new runtime, not the first step

## Scope

This plan covers:

- boot/runtime extraction
- engine/service boundaries
- registry-driven module loading
- save schema separation
- navigation and interaction runtime separation
- capability-based mod integration
- migration of the current built-in game into the new structure

This plan does not directly execute:

- full content JSON migration
- full hardcoded text migration
- every minigame migration detail
- house-specific implementation design

Those belong in child plans after the engine seams are in place.

## Target Layering

### Layer 1: Engine Kernel

Owns:

- app boot
- active mod selection
- registry composition
- game state creation
- save/load migration
- effect settlement pipeline
- module dispatch entrypoints

Must not own:

- scenario-specific story branches
- concrete house logic
- concrete battle/minigame internals
- direct DOM rendering logic

### Layer 2: Runtime Services

Owns:

- navigation runtime
- scene/city/house entry orchestration
- interactive runtime
- story trigger runtime
- time progression runtime
- economy/task settlement helpers

### Layer 3: Adapter / Presenter

Owns:

- transforming engine state into UI view models
- browser input mapping
- overlay/full-screen presentation routing
- asset and text resolution for display

### Layer 4: Mods / Content Packs

Owns:

- maps, cities, houses, characters, events, scenes
- story callbacks and text ids
- mod metadata and capability declaration
- optional registered module configurations

## File Map

### Existing Files Likely To Change Early

- `src/main.ts`
  - Reduce to bootstrap and browser wiring only.
- `src/application/content/active-game-content.ts`
  - Keep as content index composition point, then move behind engine-facing services.
- `src/application/state/create-initial-state.ts`
  - Shift from scenario-specific initialization toward engine boot initialization.
- `src/domain/game-state.ts`
  - Separate core runtime state from mod/session-specific extension state.
- `src/ui/app-render.ts`
  - Stop depending on ad hoc runtime branches and render via presenter output.
- `tests/robustness.test.cjs`
  - Add regression coverage for registry-based boot, mod swap, and runtime dispatch.

### Existing Runtime Areas To Modularize Behind Contracts

- `src/application/navigation/`
- `src/application/scene/`
- `src/application/story/`
- `src/application/story-battle/`
- `src/application/minigames/`
- `src/application/house/`
- `src/application/house-modules/`
- `src/application/time/`
- `src/application/effects/`
- `src/application/events/`

### New Files / Directories Expected

- `src/engine/boot/engine-bootstrap.ts`
- `src/engine/boot/engine-context.ts`
- `src/engine/kernel/game-engine.ts`
- `src/engine/kernel/engine-registry.ts`
- `src/engine/kernel/engine-capabilities.ts`
- `src/engine/runtime/runtime-dispatch.ts`
- `src/engine/runtime/runtime-settlement.ts`
- `src/engine/save/save-contract.ts`
- `src/engine/save/save-migrations.ts`
- `src/engine/mods/mod-manifest.ts`
- `src/engine/mods/mod-registry.ts`
- `src/engine/mods/mod-loader.ts`
- `src/application/navigation/navigation-runtime.ts`
- `src/application/presenter/app-presenter.ts`
- `src/application/presenter/view-models.ts`
- `docs/superpowers/specs/2026-06-29-mod-first-engine-runtime-extraction-design.md`
- `docs/change-log.md`

## Architectural Rules

- `main.ts` may bootstrap the engine, but must not remain the long-term owner of gameplay routing.
- Mods may provide data and registered module references, but must not directly mutate global runtime state outside the engine settlement pipeline.
- Save files must distinguish core engine schema from mod-owned state payload.
- Capability declarations must decide which services a mod is allowed to use.
- Interaction modules, house modules, and story modules must all integrate through registries, not through direct `import` branches in the bootstrap layer.

## Task 1: Freeze the Core Runtime Boundary

**Files:**
- Modify: `src/main.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Modify: `tests/robustness.test.cjs`
- Create: `docs/superpowers/specs/2026-06-29-mod-first-engine-runtime-extraction-design.md`

- [ ] Define the engine-owned state boundary.
  Deliverable: identify which fields in `GameState` are `core runtime`, `feature runtime`, and `mod-owned runtime`.
- [ ] Add regression tests that assert engine boot can create state without importing a concrete scenario entry module.
  Verification target: a focused boot test passes using only a stub registry and empty mod.
- [ ] Write the companion design doc for the engine boundary before moving runtime code.
  Required sections: boot contract, registry contract, save contract, capability contract, presenter boundary.
- [ ] Reduce `main.ts` responsibilities into an explicit checklist.
  Required buckets: boot, input wiring, render loop, navigation dispatch, interaction dispatch, content sync.
- [ ] Record freeze rules for shared files likely to conflict with other Codex threads.

**Exit condition:** the repository has an approved engine-boundary design and failing tests that describe the future bootstrap path.

## Task 2: Extract Engine Boot and Registry Composition

**Files:**
- Create: `src/engine/boot/engine-bootstrap.ts`
- Create: `src/engine/boot/engine-context.ts`
- Create: `src/engine/kernel/engine-registry.ts`
- Create: `src/engine/mods/mod-registry.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] Create an engine bootstrap entry that accepts a registry and selected mod id instead of importing a built-in scenario directly.
- [ ] Move content-pack activation behind bootstrap composition.
  Existing source to reuse: `src/application/content/active-game-content.ts`.
- [ ] Add tests for:
  - boot with built-in default mod
  - boot with empty stub mod
  - boot failure when requested capability is missing
- [ ] Keep browser startup behavior unchanged by making `main.ts` call the bootstrap layer rather than re-implement it.
- [ ] Document the bootstrap API in the change log once it stabilizes.

**Exit condition:** startup no longer depends on hardcoded content imports in `main.ts`; the engine can boot from a registry-composed mod selection.

## Task 3: Separate Save Contract From Runtime Implementation

**Files:**
- Create: `src/engine/save/save-contract.ts`
- Create: `src/engine/save/save-migrations.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] Define a save envelope with:
  - engine version
  - selected mod id
  - core runtime state
  - mod-owned state payload
  - migration metadata
- [ ] Add migration hooks so future mod schema upgrades do not require rewriting the engine save loader.
- [ ] Add tests for:
  - loading an old save into the new envelope
  - rejecting a save for a missing mod
  - preserving unknown mod payload through engine round-trip
- [ ] Keep current saves readable during transition, even if they are normalized on next save.

**Exit condition:** save/load becomes an engine feature with explicit versioning, not a byproduct of the current runtime object shape.

## Task 4: Extract Runtime Dispatch Services

**Files:**
- Create: `src/engine/runtime/runtime-dispatch.ts`
- Create: `src/engine/runtime/runtime-settlement.ts`
- Create: `src/application/navigation/navigation-runtime.ts`
- Modify: `src/application/navigation/`
- Modify: `src/application/time/`
- Modify: `src/application/events/`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] Move navigation actions behind a dedicated runtime service.
  Target: map, city, house, and scene transitions stop being decided inline in `main.ts`.
- [ ] Move time advancement and effect settlement behind shared runtime dispatch.
- [ ] Introduce a single dispatch surface for:
  - UI action input
  - timer/tick input
  - external callback input
- [ ] Add regression tests that prove the same dispatch entry can advance time, switch views, and trigger runtime effects without UI knowledge.
- [ ] Keep the old behavior stable by preserving current action ids and routing semantics during the first extraction pass.

**Exit condition:** `main.ts` delegates navigation/time/event mutation to runtime services instead of owning those mutations directly.

## Task 5: Fold Interactive Runtime Into the Engine Plan

**Files:**
- Modify: `docs/superpowers/plans/2026-06-26-interactive-module-modularization-task-plan.md`
- Create or Modify: `src/application/interactive/`
- Modify: `src/application/minigames/`
- Modify: `src/application/story-battle/`
- Modify: `src/application/house-modules/`
- Modify: `tests/robustness.test.cjs`

- [ ] Treat the interactive-module migration as a child workstream of this engine/runtime plan, not as a parallel architecture.
- [ ] Keep one authoritative runtime session channel for standalone interactions.
- [ ] Require all future minigame and story-battle launches to go through engine runtime dispatch after the registry phase lands.
- [ ] Update the older interactive plan if its file map or sequencing conflicts with the engine bootstrap extraction.
- [ ] Add a source guard that fails if `main.ts` regains module-specific minigame or battle orchestration.

**Exit condition:** the previously planned interactive runtime becomes a service under the new engine, not an isolated subsystem.

## Task 6: Extract Presenter and Rendering Adapters

**Files:**
- Create: `src/application/presenter/app-presenter.ts`
- Create: `src/application/presenter/view-models.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/views/`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] Introduce a presenter layer that maps engine state to view models.
- [ ] Stop letting `app-render` inspect raw runtime objects with feature-specific assumptions.
- [ ] Route overlay/full-screen/embedded interactive display through presenter output instead of direct runtime branching.
- [ ] Add tests for presenter output stability on:
  - map view
  - city view
  - house view
  - interactive view
  - story battle view
- [ ] Keep current DOM structure stable where practical so the visual layer does not need a wholesale rewrite during engine extraction.

**Exit condition:** UI becomes a consumer of presenter output, reducing coupling between browser rendering and engine/runtime state.

## Task 7: Formalize the Mod Contract

**Files:**
- Create: `src/engine/mods/mod-manifest.ts`
- Create: `src/engine/mods/mod-loader.ts`
- Modify: `src/domain/content-pack.ts`
- Modify: `src/domain/scenario-pack.ts`
- Modify: `src/application/content/active-game-content.ts`
- Modify: `tests/robustness.test.cjs`

- [ ] Define a `GameModManifest` that declares:
  - mod id
  - version
  - entry content pack ids
  - required capabilities
  - optional registered runtime modules
  - save compatibility rules
- [ ] Make the loader validate capability requirements before activation.
- [ ] Keep current built-in content loadable by wrapping it as the first-party default mod.
- [ ] Add tests for:
  - valid mod manifest activation
  - duplicate id rejection
  - missing capability rejection
  - incompatible save version rejection
- [ ] Document how future JSON mods register content and runtime hooks without editing engine bootstrap files.

**Exit condition:** the project has a real mod contract, not just "JSON files happen to load".

## Task 8: Migrate the Current Built-In Campaign To the New Engine Shell

**Files:**
- Modify: `src/content/`
- Modify: `src/application/content/active-game-content.ts`
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/change-log.md`

- [ ] Repackage the current built-in experience as the default first-party mod.
- [ ] Keep current start flow and browser experience unchanged for the user.
- [ ] Verify boot, save/load, navigation, house entry, and one interactive path all work through the new engine shell.
- [ ] Add a smoke test matrix that covers:
  - default mod boot
  - map to city to house navigation
  - one story callback path
  - one minigame path
  - save and reload
- [ ] Record remaining hardcoded content debt that still blocks full external JSON migration.

**Exit condition:** the existing game becomes the first consumer of the extracted engine/runtime rather than the engine itself.

## Task 9: Cleanup, Compatibility Removal, and Documentation

**Files:**
- Modify: `src/main.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-06-26-interactive-module-modularization-plan.md`
- Modify: `docs/superpowers/plans/2026-06-26-interactive-module-modularization-task-plan.md`

- [ ] Remove temporary compatibility shims only after all boot/runtime paths are covered by tests.
- [ ] Update older modularization plans so they reference the engine-first sequence.
- [ ] Add source guard tests that reject new direct concrete-module imports in `main.ts`.
- [ ] Update the change log with engine extraction milestones and remaining mod migration debt.
- [ ] Freeze new architectural rules for future contributors.

**Exit condition:** the engine-first structure is the default development path and old bootstrap shortcuts are explicitly disallowed.

## Recommended Child Plans

This parent plan is too broad to execute safely in one pass. Before code changes, split execution into these child task plans:

1. `kernel-boot-registry-extraction`
2. `save-contract-and-migration-envelope`
3. `navigation-time-event-runtime-extraction`
4. `interactive-runtime-integration-under-engine`
5. `presenter-render-decoupling`
6. `mod-manifest-loader-and-default-mod-migration`

## Parallel Collaboration Rules

- Do not execute `Task 1`, `Task 2`, `Task 4`, `Task 6`, or `Task 9` in the same worktree as another Codex thread editing `src/main.ts`, `src/domain/game-state.ts`, `src/ui/app-render.ts`, or `tests/robustness.test.cjs`.
- Documentation-only updates are safe in the current worktree.
- After `engine-registry.ts` and `save-contract.ts` stabilize, treat them as frozen contracts; later tasks should conform rather than opportunistically redesign them.
- The interactive-module migration should not proceed past adapter-only cleanup until the engine bootstrap and runtime dispatch seams are merged.

## Success Criteria

- The engine can boot from a selected mod registry entry instead of a hardcoded scenario import path.
- `main.ts` becomes a thin browser/bootstrap adapter rather than a gameplay orchestrator.
- Save files explicitly separate engine schema from mod payload.
- Navigation, time, events, and interactive modules dispatch through reusable runtime services.
- The current built-in campaign runs as the first-party default mod on top of the extracted engine shell.
- New mods can declare capabilities and content without editing engine bootstrap files.

## Completion Checklist

- [ ] Parent plan approved
- [ ] Child plans created
- [ ] Shared-file conflict policy acknowledged
- [ ] Execution worktree strategy chosen
- [ ] First child plan selected for implementation
