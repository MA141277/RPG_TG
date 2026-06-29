# Interactive Runtime Integration Under Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move house-driven interaction, minigame launch, and story-battle launch under `src/core/runtime` so `src/main.ts` stops directly owning those interactive session lifecycles and house integration gains a formal core seam.

**Architecture:** Build this child on top of Child 1 and Child 3 without reopening save or presenter scope. Introduce a narrow `Interaction Runtime` plus `House Runtime` integration seam under `src/core/runtime/**`, keep current house modules and interactive feature runtimes behind explicit legacy adapters, and reduce `main.ts` to browser events, request creation, and render coordination only for the covered interaction flows.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/application/house/**`, `src/application/activity/**`, `src/application/minigames/**`, `src/application/story-battle/**`, repository plan governance

## Execution State

- Status: `in-progress`
- Last Updated: `2026-06-30`
- Current Focus: `The first Child 4 implementation slice is now landed in the isolated worktree: src/core/contracts/interactive-runtime.ts plus legacy house/interactive adapters and core runtime bridge files exist, main.ts no longer imports application/house/house-runtime directly, and covered city-begging/activity-qte/story-battle entry now routes through runInteractiveRuntime() / house bridge seams.`
- Next Step: `Keep the first bridge slice in place, explicitly defer runtime-router/runtime-dispatch integration until the shared RuntimeRequest/CoreGameState -> RuntimeResult contract is widened for appState + house re-entry semantics, and continue Child 4 from the next additive seam batch instead of forcing that contract rewrite into the current slice.`
- Verification: `2026-06-30: npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "application house-runtime directly|interactive runtime exports launch and action seams|core house runtime bridge exports enter leave and dispatch seams|covered interactive flows through core runtime"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `This is Child Plan 4 under the mod-first engine runtime extraction roadmap. It owns Interaction Runtime and the House Runtime integration seam only. It must not absorb Child 5 presenter/render work or full Task Runtime extraction. The first production cutover now removes direct application house runtime imports from main.ts and routes covered house/city-begging/activity-qte/story-battle entry through core-owned wrapper seams while still delegating behavior to legacy adapters. Shared runtime-router/runtime-dispatch integration is intentionally deferred for now because the current shared dispatch contract still assumes CoreGameState -> RuntimeResult, while the new interactive bridge paths currently return richer appState plus optional house re-entry semantics.`

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

This child plan does not include:

- presenter/render decoupling
- full house module redesign
- full save/load cutover
- full task-state machine extraction
- full schema-driven layout rendering

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
  - Extend result carriage only if covered interaction flows need additive output.
- `tests/robustness.test.cjs`
  - Add source-guard and runtime seam regression tests for Child 4.
- `docs/change-log.md`
  - Record the interaction runtime cutover outcome once it lands.

### New Files To Create

- `src/core/contracts/interactive-runtime.ts`
- `src/core/runtime/interactive-runtime.ts`
- `src/core/runtime/house-runtime.ts`
- `src/core/adapters/legacy-house-adapter.ts`
- `src/core/adapters/legacy-interactive-adapter.ts`

### Files Child 4 May Modify Only Through Additive Wiring

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/runtime/runtime-context.ts`

These files may be extended only to make Interaction Runtime and House Runtime integration visible to the already-owned runtime boundary.

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
  - `main.ts` still owns covered interactive launch paths, house runtime seam is not real, covered interaction exits corrupt state, battle or minigame cannot return cleanly
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

## Task 6: Sync Orchestration And Close Child 4

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

## Success Criteria

- covered house/interactivity flows now enter through core runtime ownership
- `src/main.ts` no longer directly owns application house-runtime construction
- activity QTE and story-battle launch/action have core runtime entry seams
- Child 4 does not absorb presenter/render or full task-runtime scope

## Self-Review

- Spec coverage:
  - interaction runtime ownership is covered by Tasks 3-5
  - house runtime integration seam is covered by Tasks 3-5
  - `main.ts` reduction for covered flows is covered by Task 5
  - orchestration sync is covered by Task 6
- Placeholder scan:
  - no `TBD`, `TODO`, or "implement later" placeholders remain
  - all tasks list exact file paths and commands
- Type consistency:
  - `runInteractiveRuntime`, `enterHouseThroughRuntime`, `leaveHouseThroughRuntime`, and `dispatchHouseRuntimeRequest` are named consistently throughout

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Parent plan synchronized
- [x] Weekly orchestration synchronized
- [x] Verification recorded
- [x] Change log updated
