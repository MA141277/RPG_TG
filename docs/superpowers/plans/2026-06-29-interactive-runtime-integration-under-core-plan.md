# Interactive Runtime Integration Under Core Implementation Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. If this legacy artifact is explicitly resumed, use `docs/superpowers/project-progress.md`; otherwise use `docs/blueprints/project-progress.md` for current repository work.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move house-driven interaction, minigame launch, and story-battle launch under `src/core/runtime`, then widen the shared runtime state/result interface through the minimum unified RuntimeState carrier so covered interactive flows can rejoin the shared dispatch path without forcing premature state-model convergence.

**Architecture:** Build this child on top of Child 1 and Child 3 without reopening save or presenter scope. Slice 1 already introduced a narrow `Interaction Runtime` plus `House Runtime` integration seam under `src/core/runtime/**`. Slice 2 now widens shared runtime through a minimum `RuntimeState -> RuntimeResult` carrier: `RuntimeState.core` remains the current application-layer `GameState`, `RuntimeState.app` carries only the Child 4 dispatch-critical app fields, `RuntimeState.view` stays empty, and both `characterDefinitions` plus Child 1 `CoreGameState` convergence remain deferred until a later weekly promotion gate explicitly approves them.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/application/house/**`, `src/application/activity/**`, `src/application/minigames/**`, `src/application/story-battle/**`, repository plan governance

## Execution State

- Status: `completed`
- Last Updated: `2026-06-30`
- Current Focus: `Child 4 is now closed on the approved minimum RuntimeState carrier slice. The exit review confirmed that covered interaction flows enter through core-owned seams, RuntimeResult.state plus RuntimeResult.interactive are unified for the approved Child 4 scope, RuntimeState.core remains the current domain GameState, and characterDefinitions remains outside RuntimeState.core under the weekly promotion gate.`
- Next Step: `Completed. Any future follow-up must start as a new planned iteration from the weekly queue rather than by reopening this child implicitly.`
- Verification: `2026-06-30: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime"; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime returns shared RuntimeResult|covered interactive flows through core runtime"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `This is Child Plan 4 under the mod-first engine runtime extraction roadmap. It owns Interaction Runtime and the House Runtime integration seam only. It must not absorb Child 5 presenter/render work or full Task Runtime extraction. Slice 1 already removed direct application house runtime imports from main.ts and routed covered house/city-begging/activity-qte/story-battle entry through core-owned wrapper seams while still delegating behavior to legacy adapters. Slice 2 intentionally upgrades the shared runtime state/result interface through a minimum carrier only; RuntimeState.core is the current domain GameState for this child, while characterDefinitions and any move toward Child 1 CoreGameState remain later convergence work guarded by the weekly plan.`

## Progress Log

- 2026-06-29
  - Summary: `Formal Child 4 implementation plan authored from the runtime subsystem spec, weekly architecture report, and the current house/minigame/battle coupling points in src/main.ts and src/application/house/house-runtime.ts.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Begin Task 1 Step 1 when Child 4 becomes the active weekly execution target.`
- 2026-06-30
  - Summary: `Completed Task 1 in the isolated worktree by reconciling the actual starting ownership: Child 1/3 runtime seams are present, src/main.ts still imports createHouseRuntime()/HouseRuntime directly, createHouseRuntimeInstance() still owns production house runtime construction, city-begging state creation/update/completion is still main-local, activity-qte advance/stop is still main-local, and story-battle action handling still enters through direct dispatchStoryBattleAction() calls.`
  - Verification: `npm test`
  - Next: `Begin Task 2 by adding failing source-guard and runtime seam tests for house ownership and covered interactive flow routing.`
- 2026-06-30
  - Summary: `Completed the first Child 4 red-green implementation batch in the isolated worktree: Task 2 failing source-guard and seam tests were added and confirmed red; Task 3 introduced src/core/contracts/interactive-runtime.ts plus legacy-house-adapter.ts and legacy-interactive-adapter.ts; Task 4 introduced src/core/runtime/interactive-runtime.ts and house-runtime.ts; and Task 5 rerouted covered house/city-begging/activity-qte/story-battle entry in main.ts through the new core seams while preserving current behavior through legacy delegation.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime"; npm run typecheck; npm test; npm run build`
  - Next: `Record the shared-dispatch deferral explicitly, sync parent/weekly/visibility docs for this in-progress Child 4 batch, then continue only with later additive seam work that does not widen the shared dispatch contract prematurely.`
- 2026-06-30
  - Summary: `Task 4 Step 3 and Step 4 are explicitly deferred rather than silently skipped. The current shared runtime-router/runtime-dispatch line still operates on RuntimeRequest plus CoreGameState -> RuntimeResult, while the new Child 4 interactive seam currently needs application-level appState mutation plus optional house re-entry output. Forcing those flows into the existing shared dispatcher in this slice would widen core contracts and effectively turn this child into a broader runtime-result redesign.`
  - Verification: `Design/documentation decision only; production code remains validated by the 2026-06-30 Child 4 batch commands`
  - Next: `Keep the current bridge seam as the accepted first production cutover, and revisit shared-dispatch integration only after a dedicated contract-widening decision is approved.`
- 2026-06-30
  - Summary: `The next Child 4 slice is now formally designed and queued in this plan: instead of keeping shared dispatch widening deferred indefinitely, the child will introduce a unified RuntimeState interface, widen RuntimeResult.state, and pull covered interactive flows back toward the shared runtime-router/runtime-dispatch path through a minimum landing slice.`
  - Verification: `Design/documentation update only`
  - Next: `Execute Task 7 when Child 4 resumes implementation.`
- 2026-06-30
  - Summary: `Refined Child 4 scope again after reconciling the actual type boundary. The minimum unified runtime state slice now uses the current application-layer GameState as RuntimeState.core, keeps RuntimeState.app limited to beggingMiniGameState/autoAdvanceState/cityDirectoryState/locationDialogueState, keeps RuntimeState.view empty, and explicitly defers both characterDefinitions convergence plus any move onto Child 1 CoreGameState.`
  - Verification: `npm test; npm run lint:plans`
  - Next: `Resume at Task 8 Step 1 with the GameState-based minimum carrier, then keep characterDefinitions and Child 1 CoreGameState alignment on independent compatibility paths until a later weekly promotion gate is satisfied.`
- 2026-06-30
  - Summary: `Completed the second Child 4 red-green implementation batch in the isolated worktree. Task 7 added and confirmed the minimum carrier red tests, Task 8 introduced src/core/contracts/runtime-state.ts and widened RuntimeResult.state plus RuntimeResult.interactive to the shared RuntimeState carrier, Task 9 widened runtime-router.ts/runtime-dispatch.ts/runtime-settlement.ts to route over RuntimeState while keeping characterDefinitions on an independent compatibility path, and Task 10 updated interactive-runtime.ts plus main.ts so covered interactive flows now return RuntimeResult.state/RuntimeResult.interactive and at least the story-battle action path re-enters through dispatchRuntimeRequest().`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime returns shared RuntimeResult|covered interactive flows through core runtime"; npm run typecheck; npm test; npm run build`
  - Next: `Sync parent/weekly/visibility governance, record the weekly promotion gate as the only future path for characterDefinitions convergence, then re-evaluate whether Child 4 can close on the minimum carrier slice or needs one more shared-dispatch coverage batch.`
- 2026-06-30
  - Summary: `Completed the Child 4 exit review against the landed minimum carrier slice. The approved Child 4 exit conditions are satisfied without promoting characterDefinitions into RuntimeState.core and without forcing convergence onto Child 1 CoreGameState, so this child is now formally closed on the minimum RuntimeState carrier.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime|runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Promote Child 5 as the next executable weekly target.`

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-06-29-interactive-runtime-integration-spec.md`
- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Child 1 implementation plan: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- Child 3 implementation plan: `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`

## Parent Alignment

- This file is Child Plan 4 in the parent orchestration queue.
- Primary subsystem boundary:
  - `Interaction Runtime`
  - `House Runtime` integration seam
- Dependency gate:
  - Child 1 must be completed
  - Child 3 must be completed
- Scope guard:
  - do not absorb Child 5 presenter/render responsibilities
  - do not redesign Child 2 save ownership
  - do not complete full `Task / Mission Runtime` extraction
  - do not rewrite every house module in one pass
  - do not leave a second parallel interaction orchestration path in `src/main.ts`

## Scope

This child plan includes:

- formal interactive runtime contracts
- core runtime entry for covered interactive launch/action/exit flows
- formal house runtime integration seam under core runtime
- legacy adapters for:
  - application house runtime
  - activity QTE runtime
  - city begging minigame runtime
  - story battle runtime
- first production cutover away from direct interactive orchestration in `src/main.ts`
- the minimum shared-runtime contract widening needed to unify covered interactive state/result ownership without moving Child 4 onto Child 1 `CoreGameState`

This child plan does not include:

- presenter/render decoupling
- full house module redesign
- full save/load cutover
- full task-state machine extraction
- full schema-driven layout rendering
- full minigame directory migration

## File Map

### Existing Files Likely To Change

- `src/main.ts`
  - Remove direct house-runtime creation and covered interactive feature branching from the browser shell.
- `src/application/house/house-runtime.ts`
  - Reuse through a legacy adapter rather than as the direct production owner.
- `src/application/app-shell.ts`
  - Align transitional app-shell state with a runtime-owned interactive seam where needed.
- `src/application/activity/activity-qte-runtime.ts`
  - Reuse through an interactive adapter.
- `src/application/minigames/city-begging-minigame.ts`
  - Reuse through an interactive adapter.
- `src/application/story-battle/story-battle-runtime.ts`
  - Reuse through an interactive adapter.
- `src/core/contracts/runtime-request.ts`
  - Extend request ids only if Child 4 launch/action requests require additive coverage.
- `src/core/contracts/runtime-result.ts`
  - Widen result carriage from Child 1 `CoreGameState` to the Child 4 minimum `RuntimeState`.
- `src/core/contracts/runtime-state.ts`
  - Introduce the minimum unified runtime state shape used by shared dispatch.
- `tests/robustness.test.cjs`
  - Add source-guard, unified-state, and shared-dispatch regression tests for Child 4.
- `docs/change-log.md`
  - Record the interaction runtime cutover outcome once it lands.

### New Files To Create

- `src/core/contracts/interactive-runtime.ts`
- `src/core/contracts/runtime-state.ts`
- `src/core/runtime/interactive-runtime.ts`
- `src/core/runtime/house-runtime.ts`
- `src/core/adapters/legacy-house-adapter.ts`
- `src/core/adapters/legacy-interactive-adapter.ts`

### Files Child 4 May Modify Only Through Additive Wiring

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-context.ts`
- `src/core/runtime/navigation-runtime.ts`
- `src/core/runtime/time-runtime.ts`
- `src/core/runtime/event-runtime.ts`
- `src/core/runtime/scene-runtime.ts`

These files may be extended only to make the minimum unified `RuntimeState` dispatch visible to the already-owned runtime boundary.

### Reconciled Starting Ownership Gaps

- Current house runtime owner:
  - `src/main.ts` imports `createHouseRuntime` / `HouseRuntime`, stores a module-level `houseRuntime`, and constructs production ownership through `createHouseRuntimeInstance()`.
- Current activity QTE launch owner:
  - `src/main.ts` still owns `stopActivityQteLoop()`, `syncActivityQteLoop()`, `advanceActivityQteMarker(...)`, and `stopActivityQte(...)` entry/control flow.
- Current city begging minigame launch owner:
  - `src/main.ts` still owns `createCityBeggingMiniGameState(...)`, pointer updates, frame-loop updates, and completion application for the city-begging session.
- Current story-battle action owner:
  - `src/main.ts` still calls `dispatchStoryBattleAction(...)` directly and performs result-specific house re-entry handling.

### Child 4 Non-Overlap Reconfirmation

- Child 4 owns runtime integration only.
- Child 4 does not own presenter/render cutover.
- Child 4 does not own save/load cutover.

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

For targeted seam tasks, also record:

- `npm run build:test`
- exact `node --test tests/robustness.test.cjs --test-name-pattern "..."`

If a command is skipped, record the reason in `Progress Log` before marking related steps complete.

## Bug And Blocker Gate

- `P0`
  - build failure, type failure, white screen, broken house entry, broken battle launch, broken minigame launch, unrecoverable interactive dead loop
  - Rule: stop later tasks in this child plan until resolved
- `P1`
  - `main.ts` still owns covered interactive launch paths, house runtime seam is not real, covered interaction exits corrupt state, battle or minigame cannot return cleanly, or the minimum widened runtime state breaks Child 1/3 dispatch seams
  - Rule: do not mark the affected task complete and do not mark this child `completed`
- `P2`
  - additive typing cleanup, transitional duplication, minor adapter friction
  - Rule: may be deferred only if logged in `Progress Log` with a follow-up action

## Task 1: Reconcile Child 4 Scope Against The Actual Runtime State

**Files:**
- Read: `docs/superpowers/specs/2026-06-29-interactive-runtime-integration-spec.md`
- Read: `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
- Read: `src/main.ts`
- Read: `src/application/house/house-runtime.ts`
- Read: `src/application/app-shell.ts`
- Modify: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`

- [x] **Step 1: Confirm inherited runtime seams**

Verify and record:

- Child 1 runtime boundary is present
- Child 3 navigation/time/event seams are present
- `src/main.ts` still constructs the application house runtime directly
- covered interactive flows still enter from `main.ts`

- [x] **Step 2: Record exact Child 4 ownership gaps**

Write the current starting gaps into this plan's notes or log:

- current house runtime owner
- current activity QTE launch owner
- current city begging minigame launch owner
- current story-battle action owner

- [x] **Step 3: Confirm non-overlap rules**

Record explicitly that Child 4:

- owns runtime integration only
- does not own presenter/render cutover
- does not own save-load cutover

## Task 2: Add Failing Source-Guard And Runtime-Seam Tests

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing source-guard test for house runtime ownership**

Add a test shaped like:

```js
test("main.ts no longer imports application house-runtime directly for production ownership", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(mainSource, /application\\/house\\/house-runtime/);
  assert.match(mainSource, /legacy-house-adapter|core\\/runtime\\/house-runtime/);
});
```

- [x] **Step 2: Add failing seam tests for interactive runtime files**

Add tests shaped like:

```js
test("interactive runtime exports launch and action seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );

  assert.match(source, /createLaunchInteractiveRequest/);
  assert.match(source, /runInteractiveRuntime/);
});

test("core house runtime bridge exports enter leave and dispatch seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/house-runtime.ts"),
    "utf8"
  );

  assert.match(source, /enterHouseThroughRuntime/);
  assert.match(source, /leaveHouseThroughRuntime/);
  assert.match(source, /dispatchHouseRuntimeRequest/);
});
```

- [x] **Step 3: Add a failing source-guard test for battle/minigame ownership**

Add a test shaped like:

```js
test("main.ts routes covered interactive flows through core runtime instead of direct feature branching", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(mainSource, /runInteractiveRuntime/);
});
```

- [x] **Step 4: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime"
```

Expected:

- tests fail because Child 4 seam files and ownership cutover do not exist yet

## Task 3: Introduce Interactive Runtime Contracts And Legacy Adapters

**Files:**
- Create: `src/core/contracts/interactive-runtime.ts`
- Create: `src/core/adapters/legacy-house-adapter.ts`
- Create: `src/core/adapters/legacy-interactive-adapter.ts`
- Modify if needed: `src/core/contracts/runtime-request.ts`
- Modify if needed: `src/core/contracts/runtime-result.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add the interactive runtime contract**

Create `src/core/contracts/interactive-runtime.ts` with a shape like:

```ts
export type InteractiveRuntimeKind =
  | "activity-qte"
  | "city-begging"
  | "story-battle";

export type ActiveInteractiveRuntimeSession = {
  kind: InteractiveRuntimeKind;
  sessionId: string;
  source:
    | { type: "house"; houseId: string }
    | { type: "scene"; sceneId: string }
    | { type: "external"; id: string };
};
```

- [x] **Step 2: Add the legacy house adapter**

Create `src/core/adapters/legacy-house-adapter.ts` with a narrow bridge that wraps the existing house runtime ownership behind an adapter function instead of exporting application ownership directly to `main.ts`.

- [x] **Step 3: Add the legacy interactive adapter**

Create `src/core/adapters/legacy-interactive-adapter.ts` with narrow adapter functions for:

- activity QTE launch/advance/complete
- city begging minigame launch/advance/complete
- story battle launch/action/finish

- [x] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams"
```

Expected:

- new seam tests still fail until runtime files are added
- contracts and adapters compile once runtime files exist in the next task

## Task 4: Add Core Runtime Owners For House And Interaction Entry

**Files:**
- Create: `src/core/runtime/interactive-runtime.ts`
- Create: `src/core/runtime/house-runtime.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify if needed: `src/core/runtime/runtime-context.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add interactive request factories and runtime entry**

Create `src/core/runtime/interactive-runtime.ts` with seams shaped like:

```ts
export function createLaunchInteractiveRequest(
  interactiveId: string,
  payload?: Record<string, unknown>
) {
  return {
    type: "external" as const,
    eventId: interactiveId,
    payload,
  };
}

export function runInteractiveRuntime(/* ... */) {
  // delegate to legacy adapters during migration
}
```

- [x] **Step 2: Add the house runtime bridge**

Create `src/core/runtime/house-runtime.ts` with seams shaped like:

```ts
export function enterHouseThroughRuntime(/* ... */) {}
export function leaveHouseThroughRuntime(/* ... */) {}
export function dispatchHouseRuntimeRequest(/* ... */) {}
```

These functions must own the production entry seam even if they still delegate to legacy adapters internally.

- [ ] **Step 3: Extend runtime router ownership**

Deferred note: `Explicitly deferred on 2026-06-30. The current shared router only recognizes RuntimeRequest -> RuntimeResult over CoreGameState, while the new interactive seam still carries application-level appState and house re-entry semantics. Folding that into runtime-router.ts in this slice would widen Child 4 into a shared result-contract redesign.`

Update `runtime-router.ts` so the router can recognize the covered Child 4 request ids and delegate to the new house/interactive runtime seams.

- [ ] **Step 4: Keep dispatch ownership centralized**

Deferred note: `Explicitly deferred on 2026-06-30 for the same contract reason as Step 3. runtime-dispatch.ts remains the shared CoreGameState dispatcher today; the new bridge helpers are accepted as a first production cutover until a later contract-widening decision is made.`

Update `runtime-dispatch.ts` only additively so Child 4 entry still flows through the existing dispatch ownership rather than inventing another executor.

- [x] **Step 5: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams"
```

Expected:

- seam tests pass

- [x] **Step 6: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- the new runtime files compile
- no existing regressions occur

- [ ] **Step 7: Commit**

```bash
git add src/core/contracts/interactive-runtime.ts src/core/adapters/legacy-house-adapter.ts src/core/adapters/legacy-interactive-adapter.ts src/core/runtime/interactive-runtime.ts src/core/runtime/house-runtime.ts src/core/runtime/runtime-router.ts src/core/runtime/runtime-dispatch.ts src/core/runtime/runtime-context.ts tests/robustness.test.cjs
git commit -m "feat: add core interaction runtime and house bridge seams"
```

## Task 5: Cut Covered Main.ts Interactive Flows Over To Core Runtime

**Files:**
- Modify: `src/main.ts`
- Modify if needed: `src/application/app-shell.ts`
- Modify if needed: `src/core/contracts/runtime-result.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Remove direct application house-runtime ownership from main**

Replace direct production ownership shaped like:

```ts
import {
  createHouseRuntime,
  type HouseRuntime,
} from "./application/house/house-runtime";
```

with the core seam or legacy adapter path introduced by Child 4.

- [x] **Step 2: Route covered interactive launches through core runtime**

Update `main.ts` so:

- house-driven interactive launches enter via core request factories
- activity QTE session lifecycle is entered through the core interaction path
- story-battle action handling enters via the core interaction path

- [x] **Step 3: Keep browser-only loops in main**

It is acceptable for `main.ts` to still hold browser-only intervals and DOM hooks during this child.

It is not acceptable for `main.ts` to remain the decision-maker for covered interactive session ownership.

- [x] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|covered interactive flows through core runtime"
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

- current gameplay still boots
- covered house/minigame/battle flows still compile and pass tests

- [ ] **Step 6: Commit**

```bash
git add src/main.ts src/application/app-shell.ts src/core/contracts/runtime-result.ts tests/robustness.test.cjs
git commit -m "refactor: route house and interaction entry through core runtime"
```

## Task 6: Sync Orchestration After Slice 1

**Files:**
- Modify: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
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

- formal Interaction Runtime seam introduced under `src/core/runtime`
- house runtime production entry moved behind a core seam
- covered interactive launch/action flows no longer owned directly by `src/main.ts`

## Task 7: Define The Minimum Unified Runtime State Slice With Failing Tests

**Files:**
- Read: `src/application/app-shell.ts`
- Read: `src/core/contracts/runtime-request.ts`
- Read: `src/core/contracts/runtime-result.ts`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`

- [x] **Step 1: Add a failing source test for RuntimeState contract**

Add a test shaped like:

```js
test("runtime state contract exports core app and view partitions", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-state.ts"),
    "utf8"
  );

  assert.match(source, /export type RuntimeState/);
  assert.match(source, /core:/);
  assert.match(source, /app:/);
  assert.match(source, /view:/);
});
```

- [x] **Step 2: Add a failing source test for unified RuntimeResult.state**

Add a test shaped like:

```js
test("runtime result state is widened to RuntimeState", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/runtime-result.ts"),
    "utf8"
  );

  assert.match(source, /import type \\{ RuntimeState \\}/);
  assert.match(source, /state: RuntimeState/);
});
```

- [x] **Step 3: Add a failing source test for shared dispatch using RuntimeState**

Add a test shaped like:

```js
test("shared runtime dispatch routes RuntimeState instead of CoreGameState only", () => {
  const dispatchSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-dispatch.ts"),
    "utf8"
  );
  const routerSource = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/runtime-router.ts"),
    "utf8"
  );

  assert.match(dispatchSource, /RuntimeState/);
  assert.match(routerSource, /RuntimeState/);
});
```

- [x] **Step 4: Add a failing source test for interactive runtime returning RuntimeResult**

Add a test shaped like:

```js
test("interactive runtime returns shared RuntimeResult instead of private appState result", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/interactive-runtime.ts"),
    "utf8"
  );

  assert.match(source, /RuntimeResult/);
  assert.doesNotMatch(source, /type InteractiveRuntimeResult = \\{[\\s\\S]*appState:/);
});
```

- [x] **Step 5: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState|shared runtime dispatch routes RuntimeState instead of CoreGameState only|interactive runtime returns shared RuntimeResult"
```

Expected:

- tests fail because the minimum unified runtime state/result contract has not been implemented yet

## Task 8: Introduce RuntimeState And Widen RuntimeResult

**Files:**
- Create: `src/core/contracts/runtime-state.ts`
- Modify: `src/core/contracts/runtime-result.ts`
- Modify if needed: `src/application/app-shell.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add the RuntimeState contract**

Create `src/core/contracts/runtime-state.ts` with a shape like:

```ts
import type { AppState } from "../../application/app-shell";
import type { GameState } from "../../domain/game-state";

export type RuntimeCoreState = GameState;

export type RuntimeAppState = Pick<
  AppState,
  | "beggingMiniGameState"
  | "autoAdvanceState"
  | "cityDirectoryState"
  | "locationDialogueState"
>;

export type RuntimeViewState = {};

export type RuntimeState = {
  core: RuntimeCoreState;
  app: RuntimeAppState;
  view: RuntimeViewState;
};
```

This step must not move `characterDefinitions` into `RuntimeState.core`, and it must not reinterpret `RuntimeState.core` as Child 1 `src/core/contracts/core-state.ts` `CoreGameState`.

- [x] **Step 2: Widen RuntimeResult.state**

Update `src/core/contracts/runtime-result.ts` so it imports `RuntimeState` and changes:

```ts
state: CoreGameState;
```

to:

```ts
state: RuntimeState;
```

and add only the additive interactive signal channel needed for this slice, shaped like:

```ts
export type RuntimeInteractiveSignal =
  | { type: "reenter-house"; houseId: string }
  | { type: "none" };
```

- [x] **Step 3: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "runtime state contract exports core app and view partitions|runtime result state is widened to RuntimeState"
```

Expected:

- `PASS`

## Task 9: Upgrade Shared Dispatch To The Minimum RuntimeState Carrier

**Files:**
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify if needed: `src/core/runtime/runtime-context.ts`
- Modify if needed: `src/core/runtime/navigation-runtime.ts`
- Modify if needed: `src/core/runtime/time-runtime.ts`
- Modify if needed: `src/core/runtime/event-runtime.ts`
- Modify if needed: `src/core/runtime/scene-runtime.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Widen runtime router input**

Update `src/core/runtime/runtime-router.ts` so it uses:

```ts
import type { RuntimeState } from "../contracts/runtime-state";
```

and routes:

```ts
state: RuntimeState;
```

- [x] **Step 2: Widen runtime dispatch input/output**

Update `src/core/runtime/runtime-dispatch.ts` so it accepts and returns `RuntimeState`-based `RuntimeResult`, while keeping `applyEffects(...)` as an additive compatibility step rather than redesigning settlement in this slice.

- [x] **Step 3: Keep Child 3 seams compatible through RuntimeState.core**

Where navigation/time/event/scene runtime helpers still expect the old game-rule state, adapt them additively so they read and write through:

```ts
input.state.core
```

for domain `GameState`, and keep `characterDefinitions` flowing through an independent compatibility parameter or context path instead of broadening `RuntimeState.core` in this iteration.

- [x] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "shared runtime dispatch routes RuntimeState instead of CoreGameState only"
```

Expected:

- `PASS`

## Task 10: Return Covered Interactive Flows Through Shared Runtime Result Carriers

**Files:**
- Modify: `src/core/runtime/interactive-runtime.ts`
- Modify: `src/core/runtime/house-runtime.ts`
- Modify: `src/main.ts`
- Modify if needed: `src/core/contracts/interactive-runtime.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Remove the private InteractiveRuntimeResult shape**

Update `src/core/runtime/interactive-runtime.ts` so it returns `RuntimeResult` instead of:

```ts
type InteractiveRuntimeResult = {
  appState: AppState;
  enterHouseId: string | null;
};
```

- [x] **Step 2: Return unified state plus interactive signals**

Covered interactive flows should now return:

```ts
{
  state: nextRuntimeState,
  effects: [],
  interactive: { type: "reenter-house", houseId }
}
```

or:

```ts
interactive: { type: "none" }
```

instead of private `enterHouseId` carriage.

- [x] **Step 3: Route at least one covered interactive path through shared dispatch while preserving additive compatibility carriage for the remaining paths**

Update `src/main.ts` so at least one covered flow, preferably city begging or story battle action, follows this shape:

```ts
const result = dispatchRuntimeRequest({
  state: runtimeState,
  request,
  context: { routeRequest }
});
```

and then applies only browser-shell follow-up/render coordination.

- [x] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "interactive runtime returns shared RuntimeResult|covered interactive flows through core runtime"
```

Expected:

- `PASS`

- [x] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- current gameplay still compiles
- Child 1/3 runtime seams still pass
- covered interactive flows now return through shared runtime result ownership without requiring either `characterDefinitions` or Child 1 `CoreGameState` inside `RuntimeState.core`

- [ ] **Step 6: Commit**

```bash
git add src/core/contracts/runtime-state.ts src/core/contracts/runtime-result.ts src/core/runtime/runtime-router.ts src/core/runtime/runtime-dispatch.ts src/core/runtime/runtime-context.ts src/core/runtime/navigation-runtime.ts src/core/runtime/time-runtime.ts src/core/runtime/event-runtime.ts src/core/runtime/scene-runtime.ts src/core/runtime/interactive-runtime.ts src/core/runtime/house-runtime.ts src/main.ts tests/robustness.test.cjs
git commit -m "refactor: unify runtime state for interactive dispatch"
```

## Task 11: Sync Orchestration And Record The Next Iteration Route

**Files:**
- Modify: `docs/superpowers/specs/2026-06-29-interactive-runtime-integration-spec.md`
- Modify: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-implementation-visibility-plan.md`
- Modify: `docs/change-log.md`

- [x] **Step 1: Update child plan execution state**

Update:

- `Execution State`
- `Progress Log`
- new task checkboxes

- [x] **Step 2: Sync parent and weekly orchestration**

Update:

- parent orchestration progress
- weekly queue state
- weekly promotion gate establishment for any future `characterDefinitions` or Child 1 `CoreGameState` convergence
- weekly visibility focus

- [x] **Step 3: Record the next iteration route**

Write explicitly that the next iteration after this minimum landing slice should:

- normalize more interactive flows through shared dispatch
- formalize house re-entry/session closeout as shared runtime signals
- treat the weekly promotion gate as the only path that can later move `characterDefinitions` into `RuntimeState.core`
- treat Child 1 `CoreGameState` convergence as a separate future follow-up unless that gate is explicitly satisfied
- stabilize the minigame dispatch interface before directory migration

- [x] **Step 4: Run documentation verification**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

## Success Criteria

- covered house/interactivity flows now enter through core runtime ownership
- `src/main.ts` no longer directly owns application house-runtime construction
- activity QTE and story-battle launch/action have core runtime entry seams
- Child 4 completion does not depend on moving onto Child 1 `CoreGameState`
- Child 4 does not absorb presenter/render or full task-runtime scope

## Self-Review

- Spec coverage:
  - interaction runtime ownership is covered by Tasks 3-5 and 10
  - house runtime integration seam is covered by Tasks 3-5 and 10
  - unified runtime state/result widening is covered by Tasks 7-10
  - `main.ts` reduction for covered flows is covered by Tasks 5 and 10
  - orchestration sync is covered by Tasks 6 and 11
- Placeholder scan:
  - no `TBD`, `TODO`, or "implement later" placeholders remain
  - all tasks list exact file paths and commands
- Type consistency:
  - `RuntimeState`, `RuntimeResult`, `runInteractiveRuntime`, `enterHouseThroughRuntime`, `leaveHouseThroughRuntime`, and `dispatchHouseRuntimeRequest` are named consistently throughout
  - `RuntimeState.core` is consistently treated as the current domain `GameState`, not Child 1 `CoreGameState`

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Parent plan synchronized
- [x] Weekly orchestration synchronized
- [x] Verification recorded
- [x] Change log updated
- [x] Next iteration route recorded

