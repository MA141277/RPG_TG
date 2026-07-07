# Presenter Render Decoupling Implementation Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. If this legacy artifact is explicitly resumed, use `docs/superpowers/project-progress.md`; otherwise use `docs/blueprints/project-progress.md` for current repository work.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate runtime-to-view projection from rendering so `src/ui/app-render.ts` consumes prepared presenter output instead of owning gameplay-dependent view selection and lookup logic.

**Architecture:** Build this child on top of the Child 4 interaction/runtime stabilization and the existing Child 3 runtime boundary. Introduce presenter output contracts and application presenter modules, move stage/overlay/modal/HUD projection into `src/application/presenter/**`, and reduce `src/ui/app-render.ts` to render-branch selection plus pure rendering calls. Reuse existing view renderers during migration; do not redesign runtime ownership here.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/ui/**` view renderers, existing application services, repository plan governance

## Execution State

- Status: `completed`
- Last Updated: `2026-06-30`
- Current Focus: `Child 5 is completed. src/application/presenter now owns the presenter output seam, src/ui/app-render.ts consumes presenterOutput for stage/overlay/HUD selection, and src/main.ts assembles render input through createAppPresenterOutput().`
- Next Step: `Promote Child 6 Task Runtime as the next executable weekly child after closeout sync is committed.`
- Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "no longer imports gameplay selection helpers directly|top-level presenter output seam|assembles render input through application presenter output"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `This is Child Plan 5 under the mod-first engine runtime extraction roadmap. It owns Presentation Bridge Runtime only and must not absorb Child 4 interaction extraction or save/runtime closure work.`

## Progress Log

- 2026-06-29
  - Summary: `Formal Child 5 implementation plan authored from the runtime subsystem spec, weekly architecture report, and the current coupling points inside src/ui/app-render.ts and src/main.ts render input assembly.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Begin Task 1 Step 1 only after Child 4 is completed and presenter inputs can stabilize against the new interaction/runtime seam.`
- 2026-06-30
  - Summary: `Child 5 dependency gate is now satisfied. Child 4 completed on the approved minimum RuntimeState carrier slice, so presenter/render decoupling can start against the stabilized post-interaction runtime boundary rather than the earlier mixed-ownership state.`
  - Verification: `Child 4 exit review: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime|runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"; npm run typecheck; npm test; npm run build`
  - Next: `Begin Task 1 Step 1 when Child 5 becomes the active implementation child.`
- 2026-06-30
  - Summary: `Started Child 5 and completed Task 1 scope reconciliation. src/ui/app-render.ts still imports getHouseModule, story-stage visibility selectors, and selectCityNpcSummariesForHouse; renderStage still owns active view, house/module, city visibility, overlay, modal, dialogue, HUD, and scene input selection; src/main.ts still calls getCurrentSceneAction/getCurrentChoiceOptions inline during render assembly.`
  - Verification: `rg -n "getHouseModule|isCityEntryVisibleForStoryStage|selectCityNpcSummariesForHouse|renderAppMarkup|currentSceneAction|currentSceneChoiceOptions" src/ui/app-render.ts src/main.ts`
  - Next: `Add the Task 2 red source-guard tests and verify they fail before introducing presenter production code.`
- 2026-06-30
  - Summary: `Completed Child 5. Added presenter output contracts and app/stage/overlay presenter modules, moved house/module lookup, city/story visibility filtering, fallback house NPC selection, scene action/choice selection, overlay state, and HUD visibility behind presenter output, and reduced src/ui/app-render.ts to presenter consumption plus existing renderer calls.`
  - Verification: `RED: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "no longer imports gameplay selection helpers directly|top-level presenter output seam|assembles render input through application presenter output" failed with 3 expected tests. GREEN: same focused command passed. Full: npm run typecheck; npm test; npm run build; npm run lint:plans.`
  - Next: `Child 6 Task Runtime is the next executable child after weekly and parent closeout sync.`

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-06-29-presenter-render-decoupling-spec.md`
- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Child 3 implementation plan: `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
- Child 4 implementation plan: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`

## Parent Alignment

- This file is Child Plan 5 in the parent orchestration queue.
- Primary subsystem boundary:
  - `Presentation Bridge Runtime`
- Dependency gate:
  - Child 1 must be completed
  - Child 3 must be completed
  - Child 4 must be completed
- Scope guard:
  - do not absorb Interaction Runtime ownership
  - do not absorb save/load cutover
  - do not redesign full engine/session ownership
  - do not rebuild every existing view renderer from scratch

## Scope

This child plan includes:

- presenter output contract
- stage presenter extraction
- overlay/modal/dialogue/HUD presenter extraction
- `src/main.ts` render-input assembly reduction
- `src/ui/app-render.ts` dependency reduction away from gameplay helper imports

This child plan does not include:

- interaction runtime extraction
- house runtime extraction
- save/load cutover
- schema-driven layout authoring completion
- full UI visual redesign

## File Map

### Existing Files Likely To Change

- `src/main.ts`
  - Stop assembling render-only gameplay selections inline; call presenter assembly instead.
- `src/ui/app-render.ts`
  - Stop importing gameplay selection helpers and consume presenter output instead.
- `tests/robustness.test.cjs`
  - Add source-guard and presenter-output regression tests for Child 5.
- `docs/change-log.md`
  - Record presenter/render decoupling once it lands.

### New Files To Create

- `src/application/presenter/presenter-output.ts`
- `src/application/presenter/app-presenter.ts`
- `src/application/presenter/stage-presenters.ts`
- `src/application/presenter/overlay-presenters.ts`

### Existing Files Child 5 May Continue To Reuse

- `src/ui/views/map/**`
- `src/ui/views/city/**`
- `src/ui/views/house/**`
- `src/ui/views/scene/**`
- `src/ui/views/battle/**`
- `src/ui/views/minigames/**`

These renderers may remain, but their gameplay-dependent input selection must move to presenter code.

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

For targeted presenter tasks, also record:

- `npm run build:test`
- exact `node --test tests/robustness.test.cjs --test-name-pattern "..."`

## Bug And Blocker Gate

- `P0`
  - build failure, type failure, white screen, render crash, missing primary screen
  - Rule: stop later tasks in this child plan until resolved
- `P1`
  - `app-render.ts` still owns gameplay selection logic, presenter output is incomplete for current flow, render path regresses for house/city/map/scene/battle branches
  - Rule: do not mark the affected task complete and do not mark this child `completed`
- `P2`
  - additive view-model cleanup, transitional duplication, non-critical renderer follow-up
  - Rule: may be deferred only if logged in `Progress Log` with a follow-up action

## Task 1: Reconcile Child 5 Scope Against The Current Render Path

**Files:**
- Read: `docs/superpowers/specs/2026-06-29-presenter-render-decoupling-spec.md`
- Read: `src/ui/app-render.ts`
- Read: `src/main.ts`
- Modify: `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`

- [x] **Step 1: Confirm current render coupling**

Verify and record that `src/ui/app-render.ts` still performs:

- active stage selection
- house/module lookup
- story-stage visibility filtering
- overlay selection

Current review result:

- `renderStage()` in `src/ui/app-render.ts` still selects active stages from `appState.gameState.ui.currentView`.
- `src/ui/app-render.ts` still imports and calls `getHouseModule()` for module-backed house rendering.
- `src/ui/app-render.ts` still imports and calls `isHouseVisibleForStoryStage()` and `isCityEntryVisibleForStoryStage()` for city/house eligibility filtering.
- `src/ui/app-render.ts` still imports and calls `selectCityNpcSummariesForHouse()` for fallback house view-model projection.
- `renderOverlay()`, `renderModal()`, `renderLocationDialogue()`, and the HUD decision still derive presentation choices inside the render file.
- `src/main.ts` still passes `currentSceneAction: getCurrentSceneAction(...)` and `currentSceneChoiceOptions: getCurrentChoiceOptions(...)` directly into `renderAppMarkup()`.

- [x] **Step 2: Confirm Child 4 dependency**

Record explicitly that Child 5 waits for Child 4 because presenter output must bind to the post-interaction runtime seam.

Child 4 is completed on the approved minimum `RuntimeState` carrier slice. Child 5 can now bind presenter output to the stabilized post-interaction runtime/app state bridge without reopening Child 4 interaction extraction or the deferred `characterDefinitions` convergence gate.

- [x] **Step 3: Record non-overlap rules**

Record explicitly that Child 5:

- owns projection only
- does not own runtime mutation
- does not own interaction extraction

Non-overlap rule for this child:

- Child 5 owns render-time projection and presenter output only.
- Child 5 must not mutate gameplay state, settle runtime effects, move interaction session ownership, or change save/load behavior.
- Child 5 may pass existing state into presenter modules, but any state transition must remain in existing runtime/application paths.

## Task 2: Add Failing Source-Guard And Presenter Tests

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing source-guard test for app-render imports**

Add a test shaped like:

```js
test("ui/app-render.ts no longer imports gameplay selection helpers directly", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/app-render.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /getHouseModule/);
  assert.doesNotMatch(source, /isCityEntryVisibleForStoryStage/);
  assert.doesNotMatch(source, /selectCityNpcSummariesForHouse/);
});
```

- [x] **Step 2: Add a failing presenter seam test**

Add a test shaped like:

```js
test("application presenter exports a top-level presenter output seam", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/application/presenter/app-presenter.ts"),
    "utf8"
  );

  assert.match(source, /createAppPresenterOutput/);
});
```

- [x] **Step 3: Add a failing source-guard test for main render assembly**

Add a test shaped like:

```js
test("main.ts assembles render input through application presenter output", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(source, /createAppPresenterOutput/);
});
```

- [x] **Step 4: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "no longer imports gameplay selection helpers directly|top-level presenter output seam|assembles render input through application presenter output"
```

Expected:

- tests fail because presenter files and ownership cutover do not exist yet

## Task 3: Introduce Presenter Output Contracts And Presenter Modules

**Files:**
- Create: `src/application/presenter/presenter-output.ts`
- Create: `src/application/presenter/app-presenter.ts`
- Create: `src/application/presenter/stage-presenters.ts`
- Create: `src/application/presenter/overlay-presenters.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add presenter output contracts**

Create `src/application/presenter/presenter-output.ts` with a narrow output shape for:

- stage selection
- overlay
- modal
- location dialogue
- HUD

- [x] **Step 2: Add top-level app presenter**

Create `src/application/presenter/app-presenter.ts` with a seam shaped like:

```ts
export function createAppPresenterOutput(/* ... */) {
  // compose stage + overlay + modal + HUD output
}
```

- [x] **Step 3: Add stage and overlay presenter helpers**

Create:

- `src/application/presenter/stage-presenters.ts`
- `src/application/presenter/overlay-presenters.ts`

These files must own the gameplay-dependent selection that currently lives in `ui/app-render.ts`.

- [x] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "top-level presenter output seam"
```

Expected:

- presenter seam test passes

## Task 4: Move Render-Selection Logic Out Of Ui/App-Render.ts

**Files:**
- Modify: `src/ui/app-render.ts`
- Modify: `src/main.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Update main.ts to call presenter assembly**

Replace render-input assembly shaped like:

```ts
renderAppMarkup({
  appState,
  ...
  currentSceneAction: getCurrentSceneAction(...),
  currentSceneChoiceOptions: getCurrentChoiceOptions(...),
});
```

with a presenter-driven seam that first creates presenter output and then passes that to the renderer.

- [x] **Step 2: Reduce ui/app-render.ts to presenter consumption**

Update `src/ui/app-render.ts` so it no longer directly imports or uses gameplay selection helpers for:

- house module lookup
- story-stage visibility checks
- city-NPC house selection

- [x] **Step 3: Keep current view renderers but narrow their inputs**

Reuse existing renderers, but feed them from presenter-selected inputs rather than from raw state plus helper lookups.

- [x] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "no longer imports gameplay selection helpers directly|assembles render input through application presenter output"
```

Expected:

- source-guard tests pass

- [x] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- current render path still compiles and builds
- current player flows remain renderable

- [x] **Step 6: Commit**

```bash
git add src/application/presenter/presenter-output.ts src/application/presenter/app-presenter.ts src/application/presenter/stage-presenters.ts src/application/presenter/overlay-presenters.ts src/ui/app-render.ts src/main.ts tests/robustness.test.cjs
git commit -m "refactor: move render selection into application presenters"
```

## Task 5: Sync Orchestration And Close Child 5

**Files:**
- Modify: `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/change-log.md`

- [x] **Step 1: Update this child plan state**

Update:

- `Execution State`
- `Progress Log`
- task checkboxes

- [x] **Step 2: Sync parent and weekly orchestration**

Update:

- parent orchestration progress
- weekly status board
- weekly queue state

- [x] **Step 3: Record change log**

Add a concise entry summarizing:

- presenter output now owns render-time selection
- `ui/app-render.ts` is reduced to render consumption
- `src/main.ts` uses presenter assembly instead of ad hoc render lookup wiring

## Success Criteria

- presenter output becomes the real render input contract
- `src/ui/app-render.ts` no longer imports gameplay selection helpers directly
- `src/main.ts` no longer assembles render-only gameplay lookups inline
- Child 5 does not absorb interaction-runtime or save/runtime closure scope

## Self-Review

- Spec coverage:
  - presenter output contract is covered by Task 3
  - `ui/app-render.ts` dependency reduction is covered by Task 4
  - `main.ts` render assembly reduction is covered by Task 4
  - orchestration sync is covered by Task 5
- Placeholder scan:
  - no `TBD`, `TODO`, or "implement later" placeholders remain
  - all tasks list exact file paths and commands
- Type consistency:
  - `createAppPresenterOutput` and presenter-output terminology are used consistently throughout

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Parent plan synchronized
- [x] Weekly orchestration synchronized
- [x] Verification recorded
- [x] Change log updated

