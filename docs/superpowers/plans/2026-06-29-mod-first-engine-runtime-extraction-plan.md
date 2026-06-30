# Mod-First Engine Runtime Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the current game loop into a reusable engine/runtime so any future mod can plug into stable boot, state, navigation, interaction, and save seams without editing core orchestration files.

**Architecture:** Split the project into five layers rooted at `src/core`, `src/application`, `src/ui`, `src/modding`, and `src/content`. `src/core` owns engine boot, runtime dispatch, registries, effect settlement, and the minimal save/state boundary; later child plans deepen save hardening, navigation, interaction, and presentation decoupling on top of that seam. `src/application` hosts migration-era gameplay services and adapters; `src/ui` remains the rendering consumer; `src/modding` and `src/content` stay downstream of the extracted runtime boundary.

**Tech Stack:** TypeScript, Vite, Node test runner (`tests/robustness.test.cjs`), existing content-pack system, shared domain state, registry-based runtime modules

---

## Execution State

- Status: `in-progress`
- Last Updated: `2026-07-01`
- Current Focus: `Child 6 Task Runtime is completed. Child 7 Mod Runtime is now the next executable orchestration target, and Child 8 remains queued behind Child 7.`
- Next Step: `Start Child 7 from docs/superpowers/plans/2026-06-30-mod-runtime-plan.md Task 1 Step 1 after the Child 6 closeout commit; keep Child 8 queued behind Child 7.`
- Verification: `Child 6 closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract exports|task runtime exports lifecycle|starts one instance per task id|broadcasts one signal|failed tasks as terminal|task runtime result carries|progresses active tasks|signal-only failure conditions"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `This remains an orchestration-only parent plan. Child 1, Child 2, Child 3, Child 4, Child 5, and Child 6 are completed. Child 7 is formally queued as Mod Runtime and is now the next executable child. Child 8 is formally queued as StateSync Runtime. The older default-mod migration direction is superseded by the broader Child 7 Mod Runtime scope. Commit batching remains per-child so isolated slices can be reviewed and integrated cleanly before later children proceed.`

## Progress Log

- 2026-06-29
  - Summary: `Parent orchestration plan created to sequence the mod-first engine runtime extraction.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Execute Child Plan 1, then sync this parent plan before starting another child plan.`
- 2026-06-29
  - Summary: `Parent orchestration wording tightened so Child 1 owns only the first core boundary plus minimal save seam, and Child 2 exclusively owns save hardening.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Execute Child Plan 1 using the narrowed boundary-first scope, then keep Child 2 as the follow-up save hardening workstream.`
- 2026-06-29
  - Summary: `Authored the formal Child 3 plan and aligned it with the event-task-scene collaboration spec so Child 3 now owns navigation/time trigger entry, event activation, and scene handoff without absorbing full task runtime extraction.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Keep Child 1 as the active next execution target; use Child 3 only after Child 1 and Child 2 dependency rules are satisfied.`
- 2026-06-29
  - Summary: `Clarified that any Child 2 waiver for Child 3 must be recorded in both parent and weekly logs, and aligned Child 3 contract examples with Child 1 runtime-request ownership.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Execute Child 1 first; only consider Child 3 ahead of Child 2 if a recorded waiver is added to both orchestration logs with explicit reason.`
- 2026-06-29
  - Summary: `Child 1 execution has started and completed Task 1 Steps 1-4: src/core/contracts landed, a minimal engine-registry type placeholder was introduced, and the test-build whitelist was expanded so src/core is compiled into .test-dist.`
  - Verification: `Child 1 Task 1: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 2 engine-session composition; do not advance to Child 2 before Child 1 reaches its full acceptance gate.`
- 2026-06-29
  - Summary: `Child 1 Task 2 is now complete in the isolated worktree: src/core/engine and the real registry typing were introduced, proving the first selected-mod-to-session bootstrap seam on top of the Task 1 contracts.`
  - Verification: `Child 1 Task 2: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 3 runtime dispatch and effect settlement; do not advance to Child 2 before Child 1 reaches its full acceptance gate.`
- 2026-06-29
  - Summary: `Child 1 Task 3 is now complete in the isolated worktree: src/core/runtime exists, effect settlement is applied after routing, and the first runtime-owned state transition seam is validated.`
  - Verification: `Child 1 Task 3: npm run typecheck; npm test; npm run build`
  - Next: `Continue Child 1 with Task 4 save-envelope work; do not advance to Child 2 before Child 1 reaches its full acceptance gate.`
- 2026-06-29
  - Summary: `Child 1 closeout is complete in the isolated worktree: Task 4 added src/core/save/save-envelope.ts, Task 5 routed src/main.ts through src/core/adapters/legacy-main-adapter.ts, and the first production-safe core boundary now spans boot, runtime dispatch, save identity, and legacy handoff.`
  - Verification: `Child 1 closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "main.ts delegates boot through legacy-main-adapter"; npm run typecheck; npm test; npm run build`
  - Next: `Use Child 2 as the next executable plan for save hardening after Child 1 review/merge; keep Child 3+ queued behind their documented dependency rules.`
- 2026-06-29
  - Summary: `Child 2 closeout is complete in the isolated worktree: src/core/save now includes save-migrations.ts, save-loader.ts, and save-writer.ts, legacy save normalization is covered by regression tests, missing selected mods now fail explicitly, and mod-owned payload survives round-trip serialization.`
  - Verification: `Child 2 closeout: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "loadSaveEnvelope normalizes|missing selected mod|payload after load|save migration upgrades"; npm run typecheck; npm test; npm run build`
  - Next: `Use Child 3 as the next executable plan after Child 2 review/merge; keep Child 4 and Child 5 queued behind their documented dependency rules.`
- 2026-06-29
  - Summary: `Child 3 closeout is complete in the isolated worktree: src/core/runtime now includes dedicated navigation/time/event/scene seam files, runtime-result carries scene/task metadata, and main.ts routes real city-entry, timed advancement, and event-trigger entry through those new runtime wrappers instead of owning those trigger paths inline.`
  - Verification: `Child 3 closeout: npm run lint:plans; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"; npm run typecheck; npm test; npm run build`
  - Next: `Use Child 4 as the next executable plan after Child 3 review/merge; keep Child 5 and Child 6 queued behind their documented dependency rules.`
- 2026-06-29
  - Summary: `Authored the formal Child 4 and Child 5 implementation plan files plus their supporting specs. Child 4 is now the active next child for Interaction Runtime and House Runtime integration; Child 5 remains formally queued behind Child 4 so presenter/render boundaries do not lock against the current mixed interaction ownership.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 4 from docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md, then promote Child 5 only after Child 4 completes.`
- 2026-06-30
  - Summary: `Child 4 has started in its isolated worktree. The first red-green batch introduced src/core/contracts/interactive-runtime.ts, legacy house/interactive adapters, and core house/interactive runtime bridge files, then rerouted covered city-begging/activity-qte/story-battle entry in src/main.ts through those seams while preserving current behavior behind legacy delegation.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Keep Child 4 active, document the shared-dispatch follow-up explicitly in the child plan, and do not promote Child 5 until Child 4 reaches its acceptance gate.`
- 2026-06-30
  - Summary: `Child 4 planning was realigned after reconciling the actual type boundary inside the isolated worktree. The minimum unified RuntimeState slice now uses the current application-layer GameState as RuntimeState.core instead of forcing an immediate move onto Child 1 CoreGameState, while characterDefinitions remains separate compatibility carriage and Child 5 stays queued behind Child 4 completion.`
  - Verification: `npm test; npm run lint:plans`
  - Next: `Resume Child 4 at Task 8 Step 1 on the GameState-based minimum carrier, then sync parent/weekly/visibility after the next implementation batch.`
- 2026-06-30
  - Summary: `Child 4 batch 2 is now complete in the isolated worktree. The child introduced src/core/contracts/runtime-state.ts, widened RuntimeResult plus the shared router/dispatch/settlement line to RuntimeState, kept RuntimeState.core on the current domain GameState, kept characterDefinitions on additive compatibility carriage, and proved at least one covered interactive path can return through dispatchRuntimeRequest() without promoting Child 4 onto Child 1 CoreGameState.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime returns shared RuntimeResult|covered interactive flows through core runtime"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Re-evaluate Child 4 exit conditions on the landed minimum carrier slice before promoting Child 5.`
- 2026-06-30
  - Summary: `Completed the Child 4 exit review and advanced parent orchestration. Child 4 satisfies its approved exit condition on the minimum RuntimeState carrier, so the parent queue now promotes Child 5 as the next executable child while keeping characterDefinitions/CoreGameState convergence as separately governed future work.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime|runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md.`
- 2026-06-30
  - Summary: `Synchronized stale parent-plan notes after the weekly controller was expanded. The parent now consistently states that Child 4 is completed and Child 5 is unlocked but not-started.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md.`
- 2026-06-30
  - Summary: `Created formal Child 6 Task Runtime spec and plan, replaced the old Child 6 default-mod migration placeholder, and kept Child 5 as the next executable child.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md; keep docs/superpowers/plans/2026-06-30-task-runtime-plan.md queued behind it.`
- 2026-06-30
  - Summary: `Completed the required post-Child-6 review for an additional child, created formal Child 7 Mod Runtime spec and plan, and queued that work behind Child 6 without changing Child 5's status as the next executable child.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md; keep Child 6 queued behind it and Child 7 queued behind Child 6.`
- 2026-06-30
  - Summary: `Created formal Child 8 StateSync Runtime spec and plan from the approved state-sync checklist, and queued that work behind Child 7 without changing Child 5's status as the next executable child.`
  - Verification: `npm run lint:plans`
  - Next: `Start Child 5 from docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md; keep Child 6 queued behind it, Child 7 queued behind Child 6, and Child 8 queued behind Child 7.`
- 2026-06-30
  - Summary: `Completed Child 5 presenter/render decoupling. src/application/presenter now provides presenter output contracts plus app/stage/overlay presenter modules, src/main.ts creates presenter output before rendering, and src/ui/app-render.ts consumes presenter-selected stage/overlay/HUD data instead of importing gameplay selection helpers directly.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "no longer imports gameplay selection helpers directly|top-level presenter output seam|assembles render input through application presenter output"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Start Child 6 from docs/superpowers/plans/2026-06-30-task-runtime-plan.md Task 1 Step 1.`
- 2026-07-01
  - Summary: `Completed Child 6 Task Runtime. The repository now has formal task runtime contracts and a minimum runtime for task creation, action handling, signal-driven progression, duplicate active guard, terminal failed/completed guard, and unified taskUpdates/effects/signals output without applying effects.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract exports|task runtime exports lifecycle|starts one instance per task id|broadcasts one signal|failed tasks as terminal|task runtime result carries|progresses active tasks|signal-only failure conditions"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Run Child 6 closeout sync and npm run lint:plans, then start Child 7 from docs/superpowers/plans/2026-06-30-mod-runtime-plan.md Task 1 Step 1.`

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
- minimal save boundary plus later save hardening
- navigation and interaction runtime separation
- task runtime lifecycle and progression extraction
- capability-based mod integration
- migration of the current built-in game into the new structure

This plan does not directly execute:

- full content JSON migration
- full hardcoded text migration
- every minigame migration detail
- house-specific implementation design

Those belong in child plans after the engine seams are in place.

## Target Layering

### Layer 1: Core

Owns:

- stable contracts
- engine boot
- runtime dispatch
- registry composition
- minimal save/state boundary, with deeper load hardening in later child plans
- mod activation
- effect settlement pipeline

Must not own:

- scenario-specific story branches
- concrete house logic
- concrete battle/minigame internals
- direct DOM rendering logic

### Layer 2: Application

Owns:

- gameplay/domain services during migration
- adapters from legacy feature modules into core contracts
- presenter assembly from runtime data into render models

### Layer 3: UI

Owns:

- layout rendering
- screen routing
- reusable player-facing components
- theme resolution

### Layer 4: Modding

Owns:

- authoring presets
- schema validators
- starter templates
- examples for creators

### Layer 5: Content

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

- `src/core/contracts/*`
- `src/core/engine/engine-bootstrap.ts`
- `src/core/engine/engine-factory.ts`
- `src/core/engine/engine-session.ts`
- `src/core/engine/engine-capability-guard.ts`
- `src/core/engine/engine-mod-activation.ts`
- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-settlement.ts`
- `src/core/runtime/runtime-context.ts`
- `src/core/contracts/task-runtime.ts`
- `src/core/runtime/task-runtime.ts`
- `src/core/registry/engine-registry.ts`
- `src/core/registry/mod-registry.ts`
- `src/core/mods/mod-loader.ts`
- `src/core/mods/mod-activation.ts`
- `src/core/mods/mod-content-index.ts`
- `src/core/save/save-envelope.ts`
- `src/core/save/save-migrations.ts`
- `src/core/adapters/legacy-main-adapter.ts`
- `src/application/navigation/navigation-runtime.ts`
- `src/application/presenter/app-presenter.ts`
- `src/ui/layout-renderer.ts`
- `docs/superpowers/specs/2026-06-29-engine-runtime-boundary-design.md`
- `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- `docs/change-log.md`

## Architectural Rules

- `main.ts` may bootstrap the engine, but must not remain the long-term owner of gameplay routing.
- Mods may provide data and registered module references, but must not directly mutate global runtime state outside the engine settlement pipeline.
- Save files must distinguish core engine schema from mod-owned state payload.
- Capability declarations must decide which services a mod is allowed to use.
- Interaction modules, house modules, and story modules must all integrate through registries, not through direct `import` branches in the bootstrap layer.

## Parent Execution Rules

- This file is an orchestration plan only.
- Do not implement production code directly from this parent plan.
- Concrete file edits, test commands, and checkbox execution must live in child plans.
- After any child plan work batch, update both:
  - the child plan's `Execution State` and `Progress Log`
  - this parent plan's `Execution State` and `Progress Log`
- Do not start a child plan whose dependencies are not satisfied.
- If a child plan is missing, create it before starting code work for that scope.
- Runtime subsystem boundaries are governed by `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`.

### Task 1: Execute Child 1 Boundary Plan

**Files:**
- Read: `docs/superpowers/specs/2026-06-29-engine-runtime-boundary-design.md`
- Read: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

- [x] **Step 1: Verify Child 1 is the active execution entry**

Confirm:

- `docs/superpowers/specs/2026-06-29-engine-runtime-boundary-design.md` is approved
- `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md` exists
- no later child plan starts before Child 1 reaches its acceptance gate

- [x] **Step 2: Execute Child 1 from its own checklist**

Run all implementation work from:

```text
docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md
```

Do not execute code directly from this parent file.

- [x] **Step 3: Sync parent status after Child 1 work**

Update this parent file:

- `Execution State`
- `Progress Log`
- child completion markers in the completion checklist

- [x] **Step 4: Verify Child 1 exit condition**

Confirm:

- Child 1 is marked `completed`
- `src/core` bootstrap seam exists
- runtime dispatch and effect settlement seam exists
- minimal `SaveEnvelope` seam exists
- `main.ts` has an explicit handoff into the new core boundary

### Task 2: Reconcile Child 2 Save Migration Hardening Plan

**Files:**
- Modify: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Read: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`

- [x] **Step 1: Confirm the remaining save scope after Child 1**

Child 2 must not duplicate Child 1.

Its scope is limited to:

- old-save normalization
- migration sequencing
- backward compatibility checks
- mod-owned payload preservation hardening
- loader/writer behavior
- load-time selected mod validation
- runtime subsystem boundary:
  - `Save / Load Runtime`
  - `StateSync Runtime`

It must not re-define the initial `SaveEnvelope` contract already introduced by Child 1.

- [x] **Step 2: Reconcile the Child 2 plan with the narrowed Child 1 boundary**

Update:

```text
docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md
```

Ensure it states:

- Child 1 owns only the minimal envelope seam
- Child 2 owns `save-loader`, `save-writer`, `save-migrations`, normalization, and selected-mod validation
- Child 2 does not absorb presenter, navigation, or mod activation responsibilities

- [x] **Step 3: Update parent orchestration metadata**

Record in this parent file:

- Child 2 exists
- Child 2 depends on Child 1 completed
- Child 2 covers migration hardening only
- Child 2 owns loader/writer/migration behavior after the Child 1 seam
- Child 2 primary subsystem boundary is:
  - `Save / Load Runtime`
  - `StateSync Runtime`

- [x] **Step 4: Verify Child 2 is ready to execute**

Confirm:

- Child 2 plan file exists
- Child 2 no longer overlaps Child 1 save-envelope scope
- Child 2 now owns all non-minimal save hardening responsibilities

### Task 3: Execute Child 2 Save Migration Hardening

**Files:**
- Read: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

- [x] **Step 1: Verify Child 2 dependencies**

Confirm:

- Child 1 is completed
- core state boundary from Child 1 is stable enough for save hardening
- minimal `SaveEnvelope` seam from Child 1 is present

- [x] **Step 2: Execute Child 2 from its own checklist**

Run all implementation work from:

```text
docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md
```

- [x] **Step 3: Sync parent status after Child 2 work**

Update this parent file:

- `Execution State`
- `Progress Log`
- completion checklist

- [x] **Step 4: Verify Child 2 exit condition**

Confirm:

- migration entrypoints exist
- load-time selected-mod validation exists
- mod payload round-trip is covered
- current save path remains readable during transition
- Child 2 is marked `completed`

### Task 4: Reconcile And Execute Child 3 Navigation Time Event Extraction

**Files:**
- Modify: `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
- Read: `docs/superpowers/specs/2026-06-29-event-task-scene-runtime-collaboration-spec.md`
- Read: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

- [x] **Step 1: Reconcile Child 3 against the approved collaboration spec**

Update:

```text
docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md
```

Ensure it states:

- runtime dispatch ownership for navigation and time trigger entry
- event candidate filtering and activation
- first scene handoff seam
- task action and task signal seams only
- runtime subsystem boundary:
  - `Navigation Runtime`
  - `Time Runtime`
  - `Event Runtime`
  - `Scene Runtime` handoff seam where required

Ensure it does not claim:

- full `Task Runtime`
- interactive runtime
- presenter/render cutover

- [x] **Step 2: Verify Child 3 dependencies**

Confirm:

- Child 1 is completed
- Child 2 is completed, or a Child 2 waiver is recorded in both this parent plan and the weekly plan with explicit reason before Child 3 begins

- [x] **Step 3: Execute Child 3 from its own checklist**

Run all implementation work from the Child 3 plan file.

- [x] **Step 4: Verify Child 3 exit condition and sync parent log**

Confirm:

- `main.ts` no longer owns primary navigation/time/event mutations inline
- event activation can hand off into a scene seam
- task action and task signal seams exist without full task runtime extraction
- Child 3 is marked `completed`
- parent log is updated

### Task 5: Author And Execute Child 4 Interactive Runtime Integration

**Files:**
- Create: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

- [x] **Step 1: Author Child 4 interactive runtime plan**

Create:

```text
docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md
```

This child covers:

- minigame launch routing
- story-battle launch routing
- removal of parallel interactive orchestration paths
- runtime subsystem boundary:
  - `Interaction Runtime`
  - `House Runtime` integration seam where house-owned interactions delegate into shared runtime

- [x] **Step 2: Verify Child 4 dependencies**

Confirm:

- Child 1 completed
- Child 3 completed

- [x] **Step 3: Execute Child 4 from its own checklist**

Run all implementation work from the Child 4 plan file, not from this parent file. The active minimum landing must follow the corrected Child 4 spec/weekly alignment: `RuntimeState.core` is the current domain `GameState` for this slice, while `characterDefinitions` and Child 1 `CoreGameState` convergence remain deferred.

- [x] **Step 4: Verify Child 4 exit condition and sync parent log**

Confirm:

- interactive runtime is unified under the approved minimum shared runtime carrier rather than a permanent parallel architecture
- Child 4 is marked `completed`
- parent log is updated

### Task 6: Author And Execute Child 5 Presenter Render Decoupling

**Files:**
- Create: `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

- [x] **Step 1: Author Child 5 presenter render decoupling plan**

Create:

```text
docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md
```

This child covers:

- full presenter-output adoption
- `app-render` decoupling
- first presenter-output bridge for later layout rendering
- runtime subsystem boundary:
  - `Presentation Bridge Runtime`

- [x] **Step 2: Verify Child 5 dependencies**

Confirm:

- Child 5 depends on Child 1 completed
- Child 5 depends on Child 3 completed
- Child 5 depends on Child 4 completed

- [x] **Step 3: Execute Child 5 from its own checklist**

Run all implementation work from the Child 5 plan file, not from this parent file.

- [x] **Step 4: Verify Child 5 exit condition and sync parent log**

Confirm:

- `app-render` consumes presenter output instead of raw runtime assumptions
- Child 5 is marked `completed`

### Task 7: Author And Execute Child 6 Task Runtime

**Files:**
- Create: `docs/superpowers/specs/2026-06-30-task-runtime-spec.md`
- Create: `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

- [x] **Step 1: Author Child 6 Task Runtime spec and plan**

Create:

```text
docs/superpowers/specs/2026-06-30-task-runtime-spec.md
docs/superpowers/plans/2026-06-30-task-runtime-plan.md
```

Scope:

- formal Task Runtime contracts
- task lifecycle state machine
- signal-driven task progression
- task updates, effects, and follow-up signals through shared runtime result
- runtime subsystem boundary:
  - `Task Runtime`

Naming rule:

- runtime layer uses `Task`
- `Mission` remains content/presentation wording only

Out of scope:

- Event Runtime candidate selection and activation
- Scene Runtime sessions
- Interaction Runtime sessions
- Time Runtime advancement
- task UI/presenter
- full mod activation/capability/dependency

- [x] **Step 2: Verify Child 6 dependencies**

Confirm:

- Child 1 completed
- Child 3 completed
- Child 4 completed
- Child 5 completed
  - or Child 5 explicitly deferred by updated weekly and parent governance before Child 6 starts production code

- [x] **Step 3: Execute Child 6 from its own checklist**

Run all implementation work from the Child 6 plan file, not from this parent file.

- [x] **Step 4: Verify Child 6 exit condition and sync parent log**

Confirm:

- `TaskDefinition`, `TaskInstance`, and `TaskRuntimeState` contracts exist
- minimum task lifecycle exists
- signal-driven progression supports multiple active tasks
- failed tasks are terminal
- Task Runtime returns task updates, effects, and signals without applying effects
- Child 6 is marked `completed`

### Task 8: Author And Execute Child 7 Mod Runtime

**Files:**
- Create: `docs/superpowers/specs/2026-06-30-mod-runtime-spec.md`
- Create: `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

- [x] **Step 1: Author Child 7 Mod Runtime spec and plan**

Create:

```text
docs/superpowers/specs/2026-06-30-mod-runtime-spec.md
docs/superpowers/plans/2026-06-30-mod-runtime-plan.md
```

Scope:

- formal Mod Runtime contracts
- builtin/file/url source normalization
- activation validation and atomic activation handoff
- startup-time and restore-time mod re-activation
- runtime subsystem boundary:
  - `Mod Runtime`

Out of scope:

- final content assembly
- save/load IO ownership
- gameplay runtime execution
- UI/menu/loading-screen implementation
- hot reload or sandboxing

- [ ] **Step 2: Verify Child 7 dependencies**

Confirm:

- Child 1 completed
- Child 2 completed
- Child 5 completed
  - or Child 5 explicitly deferred by updated weekly and parent governance before Child 7 starts production code
- Child 6 completed
  - or Child 6 explicitly deferred by updated weekly and parent governance before Child 7 starts production code

- [ ] **Step 3: Execute Child 7 from its own checklist**

Run all implementation work from the Child 7 plan file, not from this parent file.

- [ ] **Step 4: Verify Child 7 exit condition and sync parent log**

Confirm:

- builtin/file/url startup paths flow through a formal Mod Runtime seam
- restore-time selected-mod activation flows through Mod Runtime
- activation returns one unified handoff for downstream startup
- Mod Runtime does not absorb content assembly, save/load IO, or gameplay execution ownership
- Child 7 is marked `completed`

### Task 9: Author And Execute Child 8 StateSync Runtime

**Files:**
- Create: `docs/superpowers/specs/2026-06-30-state-sync-runtime-spec.md`
- Create: `docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`

- [x] **Step 1: Author Child 8 StateSync Runtime spec and plan**

Create:

```text
docs/superpowers/specs/2026-06-30-state-sync-runtime-spec.md
docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md
```

Scope:

- canonical runtime-state authority
- runtime/app/save/presentation source-of-truth boundary
- trigger-based state synchronization
- hydration, normalization, reconstruction, and write-back coordination
- runtime subsystem boundary:
  - `StateSync Runtime`

Out of scope:

- gameplay runtime dispatch
- task/event/story progression
- UI rendering
- save file IO
- mod parsing or activation

- [ ] **Step 2: Verify Child 8 dependencies**

Confirm:

- Child 2 completed
- Child 4 completed
- Child 5 completed
  - or Child 5 explicitly deferred by updated weekly and parent governance before Child 8 starts production code
- Child 6 completed
  - or Child 6 explicitly deferred by updated weekly and parent governance before Child 8 starts production code
- Child 7 completed
  - or Child 7 explicitly deferred by updated weekly and parent governance before Child 8 starts production code

- [ ] **Step 3: Execute Child 8 from its own checklist**

Run all implementation work from the Child 8 plan file, not from this parent file.

- [ ] **Step 4: Verify Child 8 exit condition and sync parent log**

Confirm:

- canonical runtime state authority is defined
- runtime/app/save/presentation boundaries are explicit
- mandatory sync triggers exist
- `src/main.ts` state-bridge migration boundary is recorded
- StateSync Runtime does not absorb gameplay dispatch, save IO, mod activation, or presentation ownership
- Child 8 is marked `completed`

### Task 10: Close the parent orchestration plan

Confirm:

- built-in game runs as first-party mod on top of extracted engine/runtime
- all required child plans are marked `completed`
- parent `Execution State` and `Progress Log` reflect the final orchestration state

## Parent Acceptance Gate

Do not mark this parent plan `completed` until:

- all required child plans exist
- all required child plans are marked `completed`
- no unresolved `P0` or `P1` remains in any child plan still within scope
- the latest parent `Progress Log` records the final orchestration state

## Blocker And Escalation Rules

- If a child plan hits a `P0`, stop lower-priority child work and record the blocker in both the child and parent logs.
- If a child plan hits a `P1`, do not mark that child `completed` and do not start any dependent child plan.
- If a child plan is blocked by missing design or missing file ownership, author or revise the required child/spec doc before resuming code work.
- If parallel worktree conflicts are detected on shared files, defer to the child plan conflict rules and record the decision here.

## Parallel Collaboration Rules

- Do not execute Child 1, Child 3, Child 4, Child 5, Child 6, Child 7, or Child 8 in the same worktree as another Codex thread editing `src/main.ts`, `src/domain/game-state.ts`, `src/ui/app-render.ts`, `src/core/contracts/runtime-result.ts`, `src/core/contracts/runtime-state.ts`, `src/core/contracts/mod-manifest.ts`, or `tests/robustness.test.cjs`.
- Documentation-only updates are safe in the current worktree.
- After `src/core/contracts/` and `src/core/registry/engine-registry.ts` stabilize, treat them as frozen contracts; later tasks should conform rather than opportunistically redesign them.
- The interactive-module migration should not proceed past adapter-only cleanup until the engine bootstrap and runtime dispatch seams are merged.

## Success Criteria

- The engine can boot from a selected mod registry entry instead of a hardcoded scenario import path.
- `main.ts` becomes a thin browser/bootstrap adapter rather than a gameplay orchestrator.
- Save files explicitly separate engine schema from mod payload through a minimal envelope plus hardened migration path.
- Navigation, time, events, and interactive modules dispatch through reusable `src/core/runtime` services.
- Task lifecycle and signal-driven task progression run through a formal `Task Runtime`.
- Mod-related startup and restore activation flow through a formal `Mod Runtime`.
- Canonical runtime, app bridge, save snapshot, and presentation input synchronization flow through a formal `StateSync Runtime`.
- The current built-in campaign runs as the first-party default mod on top of the extracted engine shell.
- New mods can declare capabilities and content without editing engine bootstrap files.

## Completion Checklist

- [x] Parent orchestration state updated
- [x] Child 1 completed
- [x] Child 2 authored and completed
- [x] Child 3 authored and completed
- [x] Child 4 authored and completed
- [x] Child 5 authored and completed
- [x] Child 6 Task Runtime spec and plan authored
- [x] Child 6 completed
- [x] Child 7 Mod Runtime spec and plan authored
- [ ] Child 7 completed
- [x] Child 8 StateSync Runtime spec and plan authored
- [ ] Child 8 completed
- [x] Shared-file conflict policy acknowledged
- [ ] Final orchestration verification recorded
