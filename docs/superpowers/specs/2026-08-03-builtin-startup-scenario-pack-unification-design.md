# Builtin Startup Scenario-Pack Unification Design

## Goal

Unify the post-character-selection startup semantics between:

- main-menu `开始游戏`
- script-editor `使用模板 -> 运行预览`

without changing the current UI shell, feature surface, or visible start-flow order.

The required visible behavior remains:

- `开始游戏 -> 角色选择界面 -> 地图`
- `使用模板 -> 运行预览 -> 进入运行时`

The change is limited to the runtime bootstrap path used after the player commits the start action.

## Hard Constraints

- Keep the current UI structure, button layout, and visible navigation order.
- Keep the current functional surface for map, house, layout editor, and script editor.
- Do not collapse `开始游戏` directly into gameplay without the current character-selection screen.
- Do not redesign or reorder the script-editor runtime-preview flow.
- Do not use this slice to broadly clean scenario-owned hardcoded content across the whole repo.
- Do not expand `src/main.ts` with new business logic; only allow shell-level startup wiring changes.

## Current Split

### Builtin startup

`开始游戏` currently reaches:

- `startMainGameWithLoading(...)` in `src/main.ts`
- `runStartupSessionCoordinator({ type: "builtin", ... })`
- `createBuiltinStartupSession(...)` in `src/application/startup/startup-session-coordinator.ts`
- `createPrototypeAppState(...)` in `src/main.ts`

This path still creates a prototype-shaped app state directly in code, including hardcoded startup values such as default map/city selection, `chapter.prototype`, initial calendar values, startup mission text, and Zhu Yuanzhang stage-specific behavior.

### Runtime preview startup

`使用模板 -> 运行预览` currently reaches:

- `exportScriptEditorProjectToScenarioPackFiles(...)`
- `loadScenarioPackFromFiles(...)`
- `startLoadedScenarioPackWithLoading(...)`
- `runStartupSessionCoordinator({ type: "loaded-scenario-pack", ... })`
- `createScenarioPackAppState(...)`

This path is already scenario-pack-driven.

## Problem Statement

The two entry flows do not currently produce runtime state through the same startup semantics:

- builtin start uses prototype startup
- runtime preview uses scenario-pack startup

Because of that split, even if scenario-owned hardcoded content is later moved out of the codebase, the two user-visible start flows can still diverge at bootstrap time.

The primary goal of this slice is therefore not “remove all hardcoding,” but:

1. eliminate the bootstrap split
2. keep the visible `开始游戏` experience unchanged
3. make later hardcoding cleanup land once in the shared scenario-pack path

## Chosen Approach

Builtin startup remains a distinct request type at the shell level, but after character selection it must bootstrap through the same scenario-pack-oriented app-state path as runtime preview.

Concretely:

- `开始游戏` keeps its current outer UI flow and loading screen behavior
- the builtin startup request still activates the builtin default mod
- after activation, builtin startup must build app state from builtin scenario-pack data rather than from `createPrototypeAppState(...)`
- the scenario-pack-backed app state must still reproduce the current visible builtin start result: first gameplay screen remains the map

This is a startup-path unification, not a UI-flow unification.

## Non-Goals

This slice does not:

- remove every scenario-specific branch in the repository
- fully retire `createPrototypeAppState(...)` for every possible fallback case on day one
- unify template-source files and runtime-source files into a generated single-source system
- rewrite house, map, dialogue, or story mechanics
- change current main-menu affordances or character-selection presentation

## Architecture

### 1. Keep shell routing stable

`src/main.ts` should continue to own:

- loading-screen request lifecycle
- top-level start/continue/restore request dispatch
- application of the returned startup session

It should not gain more gameplay branching.

### 2. Narrow builtin startup to “builtin source selection”

`type: "builtin"` should stop meaning “use prototype state construction.”

Instead it should mean:

- activate the builtin default mod
- resolve the builtin startup content source
- build startup app state through the scenario-pack path
- optionally apply a small builtin-only startup overlay only when the current visible behavior cannot yet be represented by pack/profile data

The default target is zero overlay. If a temporary overlay is necessary, it must be narrow, documented, and treated as migration residue.

### 3. Reuse `createScenarioPackAppState(...)` as the shared app-state bootstrap seam

`createScenarioPackAppState(...)` in `src/main.ts` is already the scenario-pack bootstrap seam. This slice should converge builtin startup onto that seam rather than duplicating a second scenario-pack-specific constructor elsewhere.

If the seam needs extension to support the current builtin visible result, prefer data-driven inputs over shell-side business branches.

### 4. Move startup-shaping data into builtin scenario-pack data where practical

Values that describe the initial visible runtime state should be represented through builtin pack/profile data whenever the current pack schema already supports them, for example:

- initial location
- initial calendar
- initial view
- initial UI labels such as mission/review text where pack/profile fields already exist

This slice may keep some existing story bootstrap helpers if they are still mechanism-level rather than content-level. The point is to stop creating the initial runtime state from prototype-only code.

## Boundary Rules

### Allowed owners

- `src/application/startup/startup-session-coordinator.ts`
- `src/main.ts` for shell wiring only
- builtin `zhuyuanzhang` scenario-pack data under `src/content/scenario-packs/zhuyuanzhang/**`
- startup bootstrap helpers already on the covered startup seam

### Disallowed expansion

- no new house-specific logic in `src/main.ts`
- no new map business logic in `src/main.ts`
- no new editor-preview conditionals in builtin startup
- no template-generation work in this slice

## Expected File Impact

### Likely code files

- `src/application/startup/startup-session-coordinator.ts`
  - converge builtin startup away from prototype-state construction
- `src/main.ts`
  - shell-only startup wiring adjustments
  - potentially reduce or bypass `createPrototypeAppState(...)` on the covered builtin start path
- `src/content/scenario-packs/zhuyuanzhang/scenario-profile.json`
  - align builtin visible start state with data where possible
- `src/content/scenario-packs/zhuyuanzhang/text-entries.json`
  - if current startup-visible labels need to be sourced through pack-owned text

### Likely tests

- startup/session coordinator coverage
- targeted regression covering builtin start request -> scenario-pack app-state path
- targeted regression covering “start game still reaches map after character selection”
- targeted regression proving runtime preview remains functional

## Migration Shape

### Phase 1

Converge builtin startup onto scenario-pack app-state creation while preserving visible behavior.

Success condition:

- character selection still appears
- selecting a character still leads into the current map-first gameplay start
- app state is no longer created through the covered `createPrototypeAppState(...)` path for normal builtin start

### Phase 2

Use the shared startup path as the landing zone for future cleanup of startup-owned hardcoded values.

This phase is explicitly out of scope for the initial implementation batch.

## Risk Areas

### Visible flow regression

If builtin startup is converged too aggressively, the main risk is changing the observed `开始游戏 -> 角色选择 -> 地图` sequence or losing the current map-first start.

Mitigation:

- define this visible sequence as a must-pass smoke check
- do not change pre-game UI routing in this slice

### Story/bootstrap divergence

Some current startup state may still be coming from startup-story bootstrap helpers or Zhu Yuanzhang stage logic.

Mitigation:

- keep mechanism-level bootstrap helpers if required
- only remove prototype-state assembly first
- defer deeper story-content cleanup to later slices

### Main-shell boundary drift

It is easy to reintroduce startup business logic into `src/main.ts`.

Mitigation:

- restrict `main.ts` edits to startup request wiring and session application
- keep app-state semantics in startup/data seams rather than in shell branches

## Verification

### Manual

1. Launch app at `http://localhost:5173/`
2. Click `开始游戏`
3. Confirm current character-selection screen still appears
4. Select the current builtin character path
5. Confirm gameplay still first lands on the map
6. Confirm current visible HUD/task/date presentation is unchanged for the covered path
7. Open `剧本编辑 -> 使用模板 -> 运行预览`
8. Confirm runtime preview still starts successfully

### Automated

At minimum, the implementation plan must cover:

- coordinator-level test for builtin startup no longer relying on prototype-state construction on the covered path
- regression test for scenario-pack startup state creation on builtin start
- existing targeted script-editor runtime preview compatibility test rerun
- typecheck/build verification

## Acceptance Criteria

This design is complete when all of the following are true:

- builtin `开始游戏` still presents the current character-selection UI
- after selection, builtin gameplay still first lands on the map
- the covered builtin start path no longer depends on direct prototype-state construction
- runtime preview still works
- current UI shell and feature surface are preserved
- no new startup business branching is added to `src/main.ts` beyond shell wiring
