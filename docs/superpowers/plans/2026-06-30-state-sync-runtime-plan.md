# StateSync Runtime Implementation Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. If this legacy artifact is explicitly resumed, use `docs/superpowers/project-progress.md`; otherwise use `docs/blueprints/project-progress.md` for current repository work.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a formal `StateSync Runtime` that defines canonical runtime state authority and synchronizes runtime, app, save, and presentation state through trigger-based sync paths.

**Architecture:** Build Child 8 as a state-boundary runtime behind Child 5, Child 6, and Child 7 in the weekly queue. Define `CanonicalRuntimeState`, bridge-period legacy state aliases, app/save/presentation boundary contracts, and one small `StateSyncRuntime.sync()` API. Implement hydration, normalization, app bridge sync, prepare-save, mod-activation rebuild, and consistency validation without absorbing gameplay runtime dispatch, save IO, mod activation, or presenter/render ownership.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/core/contracts/runtime-state.ts`, existing `src/core/save/**`, existing `src/core/runtime/**`, repository plan governance

## Execution State

- Status: `completed`
- Last Updated: `2026-07-01`
- Current Focus: `Child 8 StateSync Runtime is completed on the first canonical state boundary slice. src/core/contracts/state-sync-runtime.ts defines CanonicalRuntimeState, app/save/presentation boundaries, mandatory triggers, StateSyncResult, and StateSyncRuntime; src/core/runtime/state-sync-* owns syncState plus hydration, normalization, app bridge, pre-save, mod rebuild, presentation input, and validation helpers.`
- Next Step: `Child 9 Runtime Contract Hardening is now the next executable child; continue follow-up work from docs/superpowers/plans/2026-07-01-runtime-contract-hardening-plan.md.`
- Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "state sync runtime contract exports|state sync trigger contract includes|state sync runtime exports one small sync entrypoint|main.ts does not add new feature-specific state sync branches"; npm run typecheck; npm test; npm run build; npm run lint:plans`
- Notes: `This is Child Plan 8 under the mod-first engine/runtime extraction roadmap. It owns synchronization, normalization, hydration, reconstruction, and write-back coordination only. It must not become gameplay dispatch, save IO, mod activation, presenter, or feature-specific orchestration.`

## Progress Log

- 2026-06-30
  - Summary: `Formal Child 8 StateSync Runtime implementation plan authored and queued behind Child 7. Scope is limited to state authority, trigger-based sync, canonical runtime state, app/save/presentation bridges, and main.ts state-bridge migration boundaries.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 5 as the next executable child, keep Child 6 queued behind it, keep Child 7 queued behind Child 6, and start Child 8 only after those queue gates are satisfied or explicitly deferred by updated governance.`
- 2026-07-01
  - Summary: `Child 7 Mod Runtime closeout completed and weekly/parent/artifact state now promotes Child 8 StateSync Runtime as the next executable child.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "mod runtime contract exports|mod runtime normalizes builtin file and url sources|mod runtime activation is atomic|mod runtime main adapter lets startup consume|save restore re-activates selected mod|mod runtime does not absorb content assembly"; npm run typecheck; npm test; npm run build; npm run lint:plans`
  - Next: `Start Task 1 Step 1.`
- 2026-07-01
  - Summary: `Completed Task 1 reconciliation. runtime-state.ts currently exports RuntimeState as a bridge carrier built from GameState plus Pick<AppState>; core-state.ts also exports a separate RuntimeState for core flags/variables/events/tasks; main.ts still creates RuntimeState from AppState, applies RuntimeState back into AppState, writes back post-interactive results, reconstructs scenario app state, and holds the placeholder save-loading/pre-save seam.`
  - Verification: `Repository inspection of src/core/contracts/runtime-state.ts, src/core/contracts/core-state.ts, src/core/contracts/runtime-result.ts, src/core/save/save-loader.ts, src/core/save/save-writer.ts, and src/main.ts`
  - Next: `Add failing StateSync contract, trigger, runtime entrypoint, and main.ts boundary tests.`
- 2026-07-01
  - Summary: `Completed Child 8 StateSync Runtime. Added formal StateSync contracts, mandatory sync triggers, a small syncState entrypoint, dedicated helper modules for validation, normalization, hydration, app bridge sync, pre-save snapshot preparation, mod activation rebuild, and presentation input preparation, plus bridge-period aliases for legacy RuntimeState shapes. Moved the current interactive RuntimeState creation/write-back helpers out of src/main.ts and behind the StateSync runtime boundary without moving DOM, render, loading-screen, save IO, Mod Runtime, task/event/story progression, or gameplay dispatch ownership.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "state sync runtime contract exports|state sync trigger contract includes|state sync runtime exports one small sync entrypoint|main.ts does not add new feature-specific state sync branches"; npm run typecheck; npm test; npm run build`
  - Next: `Sync weekly, parent, runtime subsystem spec, change log, and five core weekly artifacts, then run npm run lint:plans before committing.`

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-06-30-state-sync-runtime-spec.md`
- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Child 2 save hardening plan: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
- Child 4 interactive runtime plan: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
- Child 5 presenter plan: `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`
- Child 6 task-runtime plan: `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
- Child 7 mod-runtime plan: `docs/superpowers/plans/2026-06-30-mod-runtime-plan.md`

## Parent Alignment

- This file is Child Plan 8 in the parent and weekly orchestration queues.
- Primary subsystem boundary:
  - `StateSync Runtime`
- Secondary subsystem relationships:
  - depends on Save / Load Runtime compatibility from Child 2
  - depends on Child 4 minimum `RuntimeState` / `RuntimeResult` carrier as the current bridge-period baseline
  - should run after Child 5 so presentation input ownership is clearer, unless weekly governance explicitly defers Child 5
  - should run after Child 6 so task state slice ownership is clearer, unless weekly governance explicitly defers Child 6
  - should run after Child 7 so mod activation rebuild ownership is clearer, unless weekly governance explicitly defers Child 7
- Queue rule:
  - Child 5 is completed.
  - Child 6 is completed.
  - Child 7 is completed.
  - Child 8 is completed.
  - Child 9 Runtime Contract Hardening is now the next executable child.

## Scope

This child plan includes:

- `CanonicalRuntimeState` contract
- bridge-period legacy runtime state aliasing and naming
- app bridge contract
- save snapshot contract
- presentation input contract
- mandatory `StateSyncTrigger` union
- `StateSyncResult`
- `StateSyncRuntime.sync()` public API
- hydration from save snapshot
- runtime-state normalization
- app bridge synchronization
- pre-save state preparation
- mod-activation state rebuild
- consistency validation
- `src/main.ts` state-bridge migration toward StateSync-owned helpers

This child plan does not include:

- task progression
- event trigger evaluation
- story/narrative progression decisions
- UI rendering or layout
- save file IO
- mod parsing, registration, activation, capability, or dependency ownership
- global runtime dispatch
- feature-specific gameplay logic
- effect settlement policy

## File Map

### Existing Files To Modify

- `src/core/contracts/runtime-state.ts`
  - Rename or alias the current bridge-period `RuntimeState` shape so it no longer competes with canonical runtime state authority.
- `src/core/contracts/runtime-result.ts`
  - Align runtime results with the canonical state-sync boundary without adding feature-specific sync side channels.
- `src/core/runtime/runtime-dispatch.ts`
  - Keep dispatch ownership separate while allowing runtime commits to pass through StateSync when the implementation reaches that step.
- `src/core/runtime/runtime-settlement.ts`
  - Keep effect settlement separate from state sync; do not move effect application into StateSync.
- `src/core/save/save-loader.ts`
  - Keep IO/migration ownership in Save / Load Runtime while exposing load results to hydrate through StateSync.
- `src/core/save/save-writer.ts`
  - Keep write ownership in Save / Load Runtime while consuming a prepared save snapshot from StateSync.
- `src/main.ts`
  - Remove or reduce ad hoc state bridge helpers after StateSync contracts exist.
- `tests/robustness.test.cjs`
  - Add red tests and focused regression tests for canonical state authority, triggers, sync result shape, and boundary guards.
- `docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md`
  - Track execution state, progress, verification, and closeout notes.
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Sync Child 8 status after any implementation batch.
- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
  - Sync parent queue state after any implementation batch.
- `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
  - Keep Child 8 boundary ownership synchronized.
- `docs/change-log.md`
  - Record StateSync Runtime once production code lands.

### New Files To Create

- `src/core/contracts/state-sync-runtime.ts`
  - Owns canonical runtime, app bridge, save snapshot, presentation input, trigger, result, context, and runtime interface contracts.
- `src/core/runtime/state-sync-runtime.ts`
  - Owns the public `sync()` implementation and trigger routing.
- `src/core/runtime/state-sync-hydration.ts`
  - Hydrates canonical runtime state from save snapshots.
- `src/core/runtime/state-sync-normalization.ts`
  - Normalizes canonical runtime top-level shape and required slices.
- `src/core/runtime/state-sync-app-bridge.ts`
  - Builds bridge-period app shell/session/view state from canonical runtime state.
- `src/core/runtime/state-sync-save.ts`
  - Prepares save snapshots from canonical runtime state without performing IO.
- `src/core/runtime/state-sync-mod-rebuild.ts`
  - Rebuilds or completes canonical state after mod activation handoff.
- `src/core/runtime/state-sync-validation.ts`
  - Validates invariants and returns warnings/errors.

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

For targeted StateSync work, also record:

- `npm run build:test`
- exact `node --test tests/robustness.test.cjs --test-name-pattern "..."`

## Bug And Blocker Gate

- `P0`
  - type failure, build failure, invalid canonical runtime state after sync, save corruption risk, hard error swallowed by caller, `src/main.ts` sync branch regression
  - Rule: stop later tasks in this child plan until resolved.
- `P1`
  - StateSync absorbs gameplay dispatch, save IO, mod activation, presenter rendering, or feature-specific business logic; `AppState` becomes canonical business state again; legacy and canonical top-level state names remain ambiguous
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - additional slice normalization, optional warning ergonomics, broader module-specific state cleanup
  - Rule: may be deferred only if logged in `Progress Log` with a follow-up action.

## Task 1: Reconcile Child 8 Scope Against Current State Boundaries

**Files:**
- Read: `docs/superpowers/specs/2026-06-30-state-sync-runtime-spec.md`
- Read: `src/core/contracts/runtime-state.ts`
- Read: `src/core/contracts/core-state.ts`
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/save/save-loader.ts`
- Read: `src/core/save/save-writer.ts`
- Read: `src/main.ts`
- Modify: `docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md`

- [x] **Step 1: Record current RuntimeState ambiguity**

Record that `src/core/contracts/runtime-state.ts` defines the Child 4 minimum runtime carrier and that `src/core/contracts/core-state.ts` also defines a different `RuntimeState` name. Child 8 must make the canonical state name explicit as `CanonicalRuntimeState` and rename or alias legacy bridge-period shapes.

- [x] **Step 2: Record current AppState dependency direction**

Record that current runtime bridge code depends on application shell state through `Pick<AppState>`. Child 8 must reverse the target authority direction so app/save/presentation depend on canonical runtime state instead of runtime contracts depending on host shell state.

- [x] **Step 3: Record current main.ts bridge responsibilities**

Record the current bridge responsibilities in `src/main.ts`:

- creating runtime state from app state
- applying runtime result state back into app state
- post-interactive completion write-back
- scenario boot/restart reconstruction
- pre-save or future save normalization hooks

- [x] **Step 4: Record queue guard**

Update this plan's latest progress entry if needed so it says Child 5, Child 6, and Child 7 are completed, Child 8 is the next executable child, and no child after Child 8 may be promoted before another runtime/module/artifact review.

## Task 2: Add Failing StateSync Contract And Boundary Tests

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing contract export test**

Add this red test:

```js
test("state sync runtime contract exports canonical app save presentation trigger and result seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/state-sync-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type CanonicalRuntimeState/);
  assert.match(source, /export type AppStateBridge/);
  assert.match(source, /export type SaveState/);
  assert.match(source, /export type PresentationInput/);
  assert.match(source, /export type StateSyncTrigger/);
  assert.match(source, /export type StateSyncResult/);
  assert.match(source, /export interface StateSyncRuntime/);
});
```

- [x] **Step 2: Add a failing mandatory trigger test**

Add this red test:

```js
test("state sync trigger contract includes all mandatory sync points", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/state-sync-runtime.ts"),
    "utf8"
  );

  for (const trigger of [
    "boot",
    "load",
    "runtime-commit",
    "mod-activated",
    "session-rebuild",
    "pre-save",
  ]) {
    assert.match(source, new RegExp(`type: "${trigger}"`));
  }
});
```

- [x] **Step 3: Add a failing runtime export test**

Add this red test:

```js
test("state sync runtime exports one small sync entrypoint", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/state-sync-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export function syncState/);
  assert.doesNotMatch(source, /runTask/);
  assert.doesNotMatch(source, /activateEvent/);
  assert.doesNotMatch(source, /renderApp/);
  assert.doesNotMatch(source, /writeSave/);
});
```

- [x] **Step 4: Add a failing main.ts source guard**

Add this red test:

```js
test("main.ts does not add new feature-specific state sync branches after state sync runtime exists", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /function createInteractiveRuntimeState/);
  assert.doesNotMatch(source, /function applyInteractiveRuntimeState/);
});
```

This test is expected to fail at first because current bridge helpers still live in `src/main.ts`.

- [x] **Step 5: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "state sync runtime contract exports|state sync trigger contract includes|state sync runtime exports one small sync entrypoint|main.ts does not add new feature-specific state sync branches"
```

Expected:

- tests fail because StateSync contract/runtime files do not exist and `main.ts` still owns bridge helpers.

## Task 3: Introduce Canonical StateSync Contracts

**Files:**
- Create: `src/core/contracts/state-sync-runtime.ts`
- Modify: `src/core/contracts/runtime-state.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Create state sync contracts**

Create `src/core/contracts/state-sync-runtime.ts` with exported types for the canonical state boundary. If Child 5, Child 6, or Child 7 have not yet introduced concrete slice state types, define explicit bridge-period aliases first so the contract is self-contained and typecheckable:

```ts
export type CoreRuntimeState = Record<string, unknown>;
export type TaskRuntimeState = Record<string, unknown>;
export type EventRuntimeState = Record<string, unknown>;
export type NarrativeRuntimeState = Record<string, unknown>;
export type WorldRuntimeState = Record<string, unknown>;
export type InteractiveRuntimeState = Record<string, unknown>;
export type UIState = Record<string, unknown>;
export type SessionState = Record<string, unknown>;

export type CanonicalRuntimeState = {
  core: CoreRuntimeState;
  tasks: TaskRuntimeState;
  events: EventRuntimeState;
  narrative: NarrativeRuntimeState;
  world: WorldRuntimeState;
  interactive: InteractiveRuntimeState;
  modules: Record<string, unknown>;
};

export type AppStateBridge = {
  ui: UIState;
  session: SessionState;
  view: Record<string, unknown>;
};

export type SaveState = {
  version: string;
  timestamp: number;
  runtime: Partial<CanonicalRuntimeState>;
  meta?: Record<string, unknown>;
};

export type PresentationInput = {
  runtime: CanonicalRuntimeState;
  app: AppStateBridge;
};

export type StateSyncTrigger =
  | { type: "boot" }
  | { type: "load" }
  | { type: "runtime-commit"; source: string }
  | { type: "mod-activated"; modId: string }
  | { type: "session-rebuild" }
  | { type: "pre-save" };

export type StateSyncResult = {
  runtimeState: CanonicalRuntimeState;
  appState?: AppStateBridge;
  saveState?: SaveState;
  warnings: string[];
};

export type StateSyncContext = {
  runtimeState?: CanonicalRuntimeState;
  appState?: AppStateBridge;
  saveState?: SaveState;
  presentationInput?: PresentationInput;
};

export interface StateSyncRuntime {
  sync(trigger: StateSyncTrigger, context: StateSyncContext): StateSyncResult;
}
```

- [x] **Step 2: Rename or alias bridge-period RuntimeState**

Update `src/core/contracts/runtime-state.ts` so the current Child 4 carrier is explicitly named as bridge-period state, for example:

```ts
export type BridgeRuntimeState = {
  core: RuntimeCoreState;
  app: RuntimeAppState;
  view: RuntimeViewState;
};

export type RuntimeState = BridgeRuntimeState;
```

The alias may remain temporarily, but the file must document that `CanonicalRuntimeState` is the future authority.

- [x] **Step 3: Run focused contract verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "state sync runtime contract exports|state sync trigger contract includes"
```

Expected:

- contract and trigger tests pass.

## Task 4: Implement Minimum StateSync Runtime Entry

**Files:**
- Create: `src/core/runtime/state-sync-runtime.ts`
- Create: `src/core/runtime/state-sync-validation.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add consistency validation helper**

Create `src/core/runtime/state-sync-validation.ts` with pure validation helpers:

```ts
import type { CanonicalRuntimeState } from "../contracts/state-sync-runtime";

export type StateSyncValidationResult = {
  valid: boolean;
  warnings: string[];
};

export function validateCanonicalRuntimeState(
  state: CanonicalRuntimeState
): StateSyncValidationResult {
  const warnings: string[] = [];

  if (state.modules == null) {
    warnings.push("missing-modules-slice");
  }

  return {
    valid:
      state.core != null &&
      state.tasks != null &&
      state.events != null &&
      state.narrative != null &&
      state.world != null &&
      state.interactive != null,
    warnings,
  };
}
```

- [x] **Step 2: Add syncState entrypoint**

Create `src/core/runtime/state-sync-runtime.ts` with one public entrypoint:

```ts
export function syncState(
  trigger: StateSyncTrigger,
  context: StateSyncContext
): StateSyncResult {
  // route mandatory triggers to internal helpers
}
```

The public entrypoint must handle all mandatory triggers and must not call task/event/render/save IO functions.

- [x] **Step 3: Run focused runtime verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "state sync runtime exports one small sync entrypoint"
```

Expected:

- runtime export and boundary guard test passes.

## Task 5: Implement Hydration, Normalization, App Bridge, And Save Preparation Helpers

**Files:**
- Create: `src/core/runtime/state-sync-hydration.ts`
- Create: `src/core/runtime/state-sync-normalization.ts`
- Create: `src/core/runtime/state-sync-app-bridge.ts`
- Create: `src/core/runtime/state-sync-save.ts`
- Modify: `src/core/runtime/state-sync-runtime.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add hydrate helper**

Create `src/core/runtime/state-sync-hydration.ts` with `hydrateFromSave()` that maps `SaveState.runtime` into `CanonicalRuntimeState` and returns warnings for recoverable optional fields.

- [x] **Step 2: Add normalization helper**

Create `src/core/runtime/state-sync-normalization.ts` with `normalizeRuntimeState()` that ensures required top-level slices exist or returns a hard failure before callers continue.

- [x] **Step 3: Add app bridge helper**

Create `src/core/runtime/state-sync-app-bridge.ts` with `syncAppState()` that creates `AppStateBridge` from `CanonicalRuntimeState` without defining gameplay truth in app state.

- [x] **Step 4: Add prepare-save helper**

Create `src/core/runtime/state-sync-save.ts` with `prepareSaveState()` that returns `SaveState` without writing to disk.

- [x] **Step 5: Wire helpers into syncState**

Update `syncState()` so:

- `load` calls hydration
- `runtime-commit` calls normalization
- `session-rebuild` calls app bridge sync
- `pre-save` calls prepare-save
- warnings flow into `StateSyncResult.warnings`

## Task 6: Implement Mod Activation Rebuild And Presentation Input Preparation

**Files:**
- Create: `src/core/runtime/state-sync-mod-rebuild.ts`
- Modify: `src/core/contracts/state-sync-runtime.ts`
- Modify: `src/core/runtime/state-sync-runtime.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add mod activation rebuild helper**

Create `src/core/runtime/state-sync-mod-rebuild.ts` with `rebuildAfterModActivation()` that initializes or validates `modules[modId]` after a `mod-activated` trigger.

- [x] **Step 2: Keep mod activation ownership outside StateSync**

Verify `state-sync-mod-rebuild.ts` does not parse manifests, resolve dependencies, or select active mods. It only completes canonical state after Mod Runtime activation.

- [x] **Step 3: Add presentation input preparation if needed**

If presentation input needs a helper, add it as an internal helper or contract function that returns `PresentationInput` from `CanonicalRuntimeState` plus `AppStateBridge`. Do not render HTML and do not import UI renderers.

## Task 7: Migrate main.ts Bridge Calls To StateSync Boundary

**Files:**
- Modify: `src/main.ts`
- Modify: `tests/robustness.test.cjs`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Replace createInteractiveRuntimeState bridge**

Move the current bridge logic shaped like `createInteractiveRuntimeState(appState)` behind StateSync-owned helper calls or an adapter that consumes canonical runtime/app bridge contracts.

- [x] **Step 2: Replace applyInteractiveRuntimeState bridge**

Move the current bridge logic shaped like `applyInteractiveRuntimeState(appState, runtimeState)` behind StateSync-owned write-back coordination.

- [x] **Step 3: Keep browser and render concerns in main.ts**

Do not move DOM event listeners, loading screen behavior, direct render orchestration, or raw input listeners as part of Child 8.

- [x] **Step 4: Run focused main.ts guard**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "main.ts does not add new feature-specific state sync branches"
```

Expected:

- main bridge source guard passes.

## Task 8: Verify Full StateSync Boundary And Sync Governance

**Files:**
- Modify: `docs/superpowers/plans/2026-06-30-state-sync-runtime-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Modify: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Modify: `docs/change-log.md`

- [x] **Step 1: Run full implementation verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- typecheck passes
- full test suite passes
- production build passes

- [x] **Step 2: Update this child plan state**

Update:

- task checkboxes
- `Execution State`
- `Progress Log`
- verification summary

- [x] **Step 3: Sync weekly orchestration**

Update the weekly plan so:

- Child 8 completion state is accurate
- queue promotion does not occur unless Child 8 actually satisfies its own acceptance gate
- any next child beyond Child 8 requires a fresh review and spec/plan update

- [x] **Step 4: Sync parent orchestration**

Update the parent plan so:

- Child 8 completion state is correct
- StateSync remains a state-boundary runtime, not a gameplay dispatcher
- final parent closure still waits for all required children

- [x] **Step 5: Record change log**

Add a concise entry to `docs/change-log.md` after production code lands:

```md
- Added formal StateSync Runtime contracts and trigger-based state synchronization boundaries for canonical runtime, app bridge, save snapshot, and presentation input.
```

- [x] **Step 6: Run plan lint**

Run:

```bash
npm run lint:plans
```

Expected:

- plan lint passes.

## Success Criteria

- One canonical runtime-state authority is defined as `CanonicalRuntimeState`.
- Current bridge-period runtime state is explicitly named and no longer competes with canonical authority.
- `AppState` is shell/UI/session state, not gameplay truth.
- save state is a snapshot, not live runtime.
- presentation input is downstream projection input, not gameplay truth.
- mandatory sync triggers exist.
- `StateSyncRuntime.sync()` or equivalent public entrypoint is small and stable.
- StateSync does not absorb task, event, story, presentation, save IO, mod activation, or global dispatch ownership.
- `src/main.ts` no longer owns new feature-specific state bridge branches.

## Self-Review

- Spec coverage:
  - canonical runtime state is covered by Task 3
  - trigger-based sync is covered by Task 2 and Task 4
  - hydrate/normalize/app/save helpers are covered by Task 5
  - mod activation rebuild is covered by Task 6
  - `main.ts` migration scope is covered by Task 7
  - orchestration sync is covered by Task 8
- Placeholder scan:
  - no unresolved placeholder markers remain
  - all tasks list exact file paths and commands
- Type consistency:
  - `CanonicalRuntimeState`, `AppStateBridge`, `SaveState`, `PresentationInput`, `StateSyncTrigger`, `StateSyncResult`, `StateSyncContext`, and `StateSyncRuntime` are used consistently throughout

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Parent plan synchronized
- [x] Weekly orchestration synchronized
- [x] Runtime subsystem spec synchronized
- [x] Verification recorded
- [x] Change log updated after production code lands

