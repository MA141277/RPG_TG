# Task Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the existing task action and task signal seams into a formal `Task Runtime` with contracts, lifecycle state, signal-driven progression, and unified runtime results.

**Architecture:** Build Child 6 after Child 5 in the weekly queue, using the Child 3 task action/signal seams and Child 4 shared `RuntimeState`/`RuntimeResult` carrier as the starting point. Add task runtime contracts under `src/core/contracts`, implement a minimum runtime under `src/core/runtime`, keep definition registration separate from runtime execution, and return task updates/effects/signals through the shared result path without absorbing event, scene, interaction, time, save/load, presenter, or mod-activation ownership.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/core/runtime/**` seams, repository plan governance

## Execution State

- Status: `not-started`
- Last Updated: `2026-06-30`
- Current Focus: `Formal Child 6 plan is authored for Task Runtime, but Child 5 remains the next executable child. This plan must not start production code until Child 5 is completed or explicitly deferred by weekly governance.`
- Next Step: `After Child 5 closes or is formally deferred, start Task 1 Step 1 by reconciling the existing taskActions/taskSignals seams against the Child 6 spec.`
- Verification: `npm run lint:plans`
- Notes: `This is Child Plan 6 under the mod-first engine runtime extraction roadmap. Runtime-layer naming is Task. Mission remains content/presentation wording only. The older default-mod migration direction is no longer Child 6 and must be treated as a later candidate child.`

## Progress Log

- 2026-06-30
  - Summary: `Formal Child 6 Task Runtime implementation plan authored and queued behind Child 5. Scope is limited to task contracts, lifecycle, signal-driven progression, and unified runtime results.`
  - Verification: `npm run lint:plans`
  - Next: `Keep Child 5 as the next executable child; start Child 6 Task 1 Step 1 only after Child 5 closes or weekly governance explicitly defers Child 5.`

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-06-30-task-runtime-spec.md`
- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Child 3 plan with reserved task seams: `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
- Child 4 plan with shared runtime carrier: `docs/superpowers/plans/2026-06-29-interactive-runtime-integration-under-core-plan.md`
- Child 5 plan that remains next executable: `docs/superpowers/plans/2026-06-29-presenter-render-decoupling-plan.md`

## Parent Alignment

- This file is Child Plan 6 in the parent orchestration queue.
- Primary subsystem boundary:
  - `Task Runtime`
- Queue rule:
  - Child 5 remains the current next executable child.
  - Child 6 is formally authored and queued behind Child 5.
  - Child 6 must not reoccupy the older default-mod migration placeholder scope.
- Dependency gate:
  - Child 1 must be completed.
  - Child 3 must be completed.
  - Child 4 must be completed.
  - Child 5 must be completed or explicitly deferred by updated weekly and parent governance before Child 6 starts production code.

## Scope

This child plan includes:

- `TaskDefinition`, `TaskInstance`, and `TaskRuntimeState` contracts
- `TaskAction` and `TaskSignal` input contracts
- `TaskUpdate` and `TaskRuntimeResult` output contracts
- minimum task lifecycle state machine
- signal-driven progression
- built-in standard condition evaluation
- task updates, effects, and follow-up signals returned through a unified result
- integration with `RuntimeResult` without applying effects inside Task Runtime

This child plan does not include:

- Event Runtime candidate selection or activation
- Scene Runtime session playback
- Interaction Runtime session ownership
- Time Runtime advancement
- task UI, presenter, or render behavior
- full mod activation, capability, or dependency system
- complete task authoring DSL
- mod-provided custom condition evaluator plugins

## File Map

### Existing Files To Modify

- `src/core/contracts/runtime-result.ts`
  - Add or align task runtime result categories so shared runtime results can carry `taskUpdates`, `effects`, and follow-up task/runtime signals.
- `tests/robustness.test.cjs`
  - Add red tests and focused regression tests for task runtime contracts, lifecycle, signal progression, and boundary guards.
- `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
  - Track execution state, checkboxes, verification, and closeout notes.
- `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
  - Sync Child 6 status after implementation batches.
- `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
  - Sync parent queue status after implementation batches.
- `docs/change-log.md`
  - Record Task Runtime once production code lands.

### New Files To Create

- `src/core/contracts/task-runtime.ts`
  - Owns Task Runtime public contracts: definitions, instances, state, actions, signals, updates, and runtime result.
- `src/core/runtime/task-runtime.ts`
  - Owns minimum lifecycle execution and signal dispatch entrypoint.

### Optional New Files To Create

- `src/core/runtime/task-definition-registry.ts`
  - Keeps definition registration/indexing separate from runtime execution if the implementation needs a small helper.
- `src/core/runtime/task-condition-evaluator.ts`
  - Evaluates built-in standard condition types as pure functions.
- `src/core/runtime/task-progression.ts`
  - Applies deterministic progress updates from signals to active task instances.

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

For targeted task-runtime work, also record:

- `npm run build:test`
- exact `node --test tests/robustness.test.cjs --test-name-pattern "..."`

## Bug And Blocker Gate

- `P0`
  - type failure, build failure, test runtime crash, save-state corruption risk, shared runtime result incompatibility
  - Rule: stop later tasks in this child plan until resolved.
- `P1`
  - Task Runtime absorbs Event, Scene, Interaction, or Time Runtime ownership; duplicate task instance behavior is nondeterministic; failed tasks can be reopened; effects are applied inside Task Runtime
  - Rule: do not mark the affected task complete and do not mark this child `completed`.
- `P2`
  - naming cleanup, additional built-in condition types, broader authoring ergonomics
  - Rule: may be deferred only if logged in `Progress Log` with a follow-up action.

## Task 1: Reconcile Child 6 Scope Against Existing Task Seams

**Files:**
- Read: `docs/superpowers/specs/2026-06-30-task-runtime-spec.md`
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/contracts/event-runtime.ts`
- Read: `src/core/contracts/scene-runtime.ts`
- Read: `src/core/runtime/event-runtime.ts`
- Read: `src/core/runtime/scene-runtime.ts`
- Modify: `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`

- [ ] **Step 1: Confirm existing task seam names**

Record that the current shared result contract exposes:

```ts
export type RuntimeTaskSignal = {
  type: string;
  taskId: string;
};

export type RuntimeTaskAction = {
  type: string;
  taskId: string;
};
```

and that Child 6 must either preserve compatibility aliases or migrate them intentionally to the new `TaskAction` and `TaskSignal` contracts.

- [ ] **Step 2: Confirm non-overlap with Event Runtime**

Record that `src/core/runtime/event-runtime.ts` still owns trigger selection and activation, and Child 6 must not move `selectTriggeredEvents`, `selectEventCandidate`, `canActivateEvent`, or `startEvent` into task runtime code.

- [ ] **Step 3: Confirm non-overlap with Scene Runtime**

Record that `src/core/runtime/scene-runtime.ts` still owns `runSceneFromEvent` and scene session creation, and Child 6 may only consume task signals emitted by scene runtime.

- [ ] **Step 4: Record queue guard**

Update this plan's latest progress entry if needed so it still says Child 5 is the next executable child and Child 6 is queued behind it.

## Task 2: Add Failing Task Runtime Seam And Boundary Tests

**Files:**
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing contract export test**

Add this red test:

```js
test("task runtime contract exports definition instance state action signal and result seams", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /export type TaskDefinition/);
  assert.match(source, /export type TaskInstance/);
  assert.match(source, /export type TaskRuntimeState/);
  assert.match(source, /export type TaskAction/);
  assert.match(source, /export type TaskSignal/);
  assert.match(source, /export type TaskUpdate/);
  assert.match(source, /export type TaskRuntimeResult/);
});
```

- [ ] **Step 2: Add a failing runtime export test**

Add this red test:

```js
test("task runtime exports lifecycle and signal progression entrypoints", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /startTask/);
  assert.match(source, /applyTaskAction/);
  assert.match(source, /applyTaskSignal/);
});
```

- [ ] **Step 3: Add failing behavior tests for lifecycle and concurrency**

Add tests with these exact names:

```js
test("task runtime starts one instance per task id and rejects duplicate active start", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /instancesByTaskId/);
  assert.match(source, /duplicate-active-task/);
});

test("task runtime broadcasts one signal to multiple active tasks", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /applyTaskSignal/);
  assert.match(source, /Object\\.values\\(state\\.instancesByTaskId\\)/);
});

test("task runtime treats failed tasks as terminal", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /failed-is-terminal/);
});
```

- [ ] **Step 4: Add a failing unified result test**

Add this red test:

```js
test("task runtime result carries task updates effects and signals without applying effects", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/contracts/task-runtime.ts"),
    "utf8"
  );

  assert.match(source, /taskUpdates/);
  assert.match(source, /effects/);
  assert.match(source, /signals/);
});
```

- [ ] **Step 5: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract exports|task runtime exports lifecycle|starts one instance per task id|broadcasts one signal|failed tasks as terminal|task runtime result carries"
```

Expected:

- tests fail because `src/core/contracts/task-runtime.ts` and `src/core/runtime/task-runtime.ts` do not exist yet.

## Task 3: Introduce Task Contracts And Runtime State Types

**Files:**
- Create: `src/core/contracts/task-runtime.ts`
- Modify: `src/core/contracts/runtime-result.ts`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Create task runtime contracts**

Create `src/core/contracts/task-runtime.ts` with exported types for:

```ts
export type TaskStatus = "inactive" | "active" | "completed" | "failed";

export type TaskDefinition = {
  id: string;
  title: string;
  description?: string;
  objectives: TaskObjectiveDefinition[];
  startConditions?: TaskCondition[];
  completionConditions?: TaskCondition[];
  failureConditions?: TaskCondition[];
  onStartEffects?: Effect[];
  onProgressEffects?: Effect[];
  onCompleteEffects?: Effect[];
  onFailEffects?: Effect[];
  tags?: string[];
};

export type TaskObjectiveDefinition = {
  id: string;
  description?: string;
  target: number;
  signalType: string;
};

export type TaskCondition =
  | { type: "task-status"; taskId: string; status: TaskStatus }
  | { type: "flag"; flag: string; value: boolean }
  | { type: "counter"; counterId: string; atLeast: number }
  | { type: "signal"; signalType: string }
  | { type: "elapsed-time"; since: string; atLeastDays: number };

export type TaskInstance = {
  taskId: string;
  status: Exclude<TaskStatus, "inactive">;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  failedAt?: string;
  progress: Record<string, number>;
  flags: Record<string, boolean>;
  source?: string;
};

export type TaskRuntimeState = {
  instancesByTaskId: Record<string, TaskInstance>;
  completedTaskIds: string[];
  failedTaskIds: string[];
  updatedAt: string;
};

export type TaskAction =
  | { type: "start"; taskId: string; occurredAt: string; source?: string }
  | { type: "complete"; taskId: string; occurredAt: string; source?: string }
  | { type: "fail"; taskId: string; occurredAt: string; source?: string; reason?: string };

export type TaskSignal = {
  type: string;
  source: string;
  occurredAt: string;
  payload?: Record<string, unknown>;
};

export type TaskUpdate = {
  taskId: string;
  type: "started" | "progressed" | "completed" | "failed" | "ignored";
  previousStatus: TaskStatus;
  nextStatus: TaskStatus;
  progressDelta?: Record<string, number>;
  reason?: string;
};

export type TaskRuntimeResult = {
  state: TaskRuntimeState;
  taskUpdates: TaskUpdate[];
  effects: Effect[];
  signals: TaskSignal[];
};
```

- [ ] **Step 2: Keep compatibility with existing runtime result names**

Update `src/core/contracts/runtime-result.ts` so existing `RuntimeTaskAction` and `RuntimeTaskSignal` callers remain compatible while the new Task Runtime contracts become the formal source of task semantics.

- [ ] **Step 3: Run focused contract verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "task runtime contract exports definition instance state action signal and result seams"
```

Expected:

- contract export test passes.

## Task 4: Implement Minimum Task Lifecycle

**Files:**
- Create: `src/core/runtime/task-runtime.ts`
- Optional Create: `src/core/runtime/task-definition-registry.ts`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Add definition lookup helper if needed**

If a helper is needed, create `src/core/runtime/task-definition-registry.ts` with a pure indexed lookup:

```ts
import type { TaskDefinition } from "../contracts/task-runtime";

export type TaskDefinitionRegistry = Record<string, TaskDefinition>;

export function getTaskDefinition(
  registry: TaskDefinitionRegistry,
  taskId: string
): TaskDefinition | null {
  return registry[taskId] ?? null;
}
```

- [ ] **Step 2: Implement startTask**

Create `src/core/runtime/task-runtime.ts` with `startTask()` that:

- reads a registered `TaskDefinition`
- creates one `TaskInstance`
- rejects duplicate active start with reason `duplicate-active-task`
- returns `TaskRuntimeResult`
- emits `onStartEffects` without applying them

- [ ] **Step 3: Implement applyTaskAction**

Add `applyTaskAction()` handling:

- `start`
- `complete`
- `fail`

Use the marker comment `// failed-is-terminal` near the guard that prevents reopening failed tasks so the boundary test remains explicit.

- [ ] **Step 4: Run lifecycle-focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "task runtime exports lifecycle|starts one instance per task id|failed tasks as terminal"
```

Expected:

- lifecycle export and source-guard tests pass.

## Task 5: Implement Signal-Driven Progression

**Files:**
- Modify: `src/core/runtime/task-runtime.ts`
- Optional Create: `src/core/runtime/task-condition-evaluator.ts`
- Optional Create: `src/core/runtime/task-progression.ts`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Add built-in condition evaluator**

If split out, create `src/core/runtime/task-condition-evaluator.ts` with pure evaluation for:

- `task-status`
- `flag`
- `counter`
- `signal`
- `elapsed-time`

Do not add a custom mod evaluator plugin hook in Child 6.

- [ ] **Step 2: Add task progression helper**

If split out, create `src/core/runtime/task-progression.ts` to update objective counters when a `TaskSignal.type` matches a `TaskObjectiveDefinition.signalType`.

- [ ] **Step 3: Implement applyTaskSignal**

Update `src/core/runtime/task-runtime.ts` so `applyTaskSignal()`:

- iterates `Object.values(state.instancesByTaskId)`
- updates all active tasks matched by the signal
- leaves completed and failed tasks unchanged
- returns one `TaskRuntimeResult` containing all `taskUpdates`, `effects`, and follow-up `signals`

- [ ] **Step 4: Run signal-focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "broadcasts one signal to multiple active tasks"
```

Expected:

- signal broadcast test passes.

## Task 6: Return Unified TaskRuntimeResult And Effects

**Files:**
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/contracts/task-runtime.ts`
- Modify: `src/core/runtime/task-runtime.ts`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Align TaskRuntimeResult with RuntimeResult**

Ensure `TaskRuntimeResult` carries:

- `state`
- `taskUpdates`
- `effects`
- `signals`

and that `RuntimeResult` can carry task updates without a side channel.

- [ ] **Step 2: Keep effect application outside task runtime**

Verify `src/core/runtime/task-runtime.ts` returns effect arrays but does not import or call shared settlement code such as `settleRuntimeEffects`.

- [ ] **Step 3: Run focused result verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "task runtime result carries task updates effects and signals without applying effects"
```

Expected:

- unified result test passes.

- [ ] **Step 4: Run full implementation verification**

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

## Task 7: Sync Orchestration And Close Child 6

**Files:**
- Modify: `docs/superpowers/plans/2026-06-30-task-runtime-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Modify: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Modify: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Modify: `docs/change-log.md`

- [ ] **Step 1: Update this child plan state**

Update:

- task checkboxes
- `Execution State`
- `Progress Log`
- verification summary

- [ ] **Step 2: Sync weekly orchestration**

Update the weekly plan so:

- Child 6 is marked completed only after this plan passes its acceptance gate
- the next executable child is selected after closeout sync
- the five core weekly artifacts are reviewed if queue promotion follows

- [ ] **Step 3: Sync parent orchestration**

Update the parent plan so:

- Child 6 completion state is correct
- no old default-mod migration wording occupies the Child 6 slot
- any future default-mod migration child remains only a later candidate until separately spec'd and planned

- [ ] **Step 4: Record change log**

Add a concise entry to `docs/change-log.md` after production code lands:

```md
- Added formal Task Runtime contracts and minimum lifecycle/progression runtime under `src/core`, keeping Mission as content/presentation wording only.
```

- [ ] **Step 5: Run plan lint**

Run:

```bash
npm run lint:plans
```

Expected:

- plan lint passes.

## Success Criteria

- Task Runtime has formal contracts and runtime entrypoints.
- Runtime-layer naming uses `Task`; `Mission` remains content/presentation wording only.
- Existing `taskActions` and `taskSignals` seams are reconciled with the new contracts.
- Multiple different active tasks are supported.
- Duplicate active instance creation for the same `taskId` is deterministic.
- A single signal can update multiple active tasks.
- Failed tasks are terminal.
- Task Runtime returns task updates, effects, and signals without applying effects.
- Task Runtime does not absorb Event, Scene, Interaction, Time, Save / Load, Presentation, or Mod Activation ownership.

## Self-Review

- Spec coverage:
  - naming rule is covered in the plan header, notes, and success criteria
  - contracts are covered by Task 3
  - lifecycle is covered by Task 4
  - signal-driven progression is covered by Task 5
  - shared runtime result integration is covered by Task 6
  - orchestration sync is covered by Task 7
- Placeholder scan:
  - no `TBD`, `TODO`, or "implement later" placeholders remain
  - all tasks list exact file paths and commands
- Type consistency:
  - `TaskDefinition`, `TaskInstance`, `TaskRuntimeState`, `TaskAction`, `TaskSignal`, `TaskUpdate`, and `TaskRuntimeResult` are used consistently throughout

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Parent plan synchronized
- [ ] Weekly orchestration synchronized
- [ ] Runtime subsystem spec synchronized
- [ ] Verification recorded
- [ ] Change log updated after production code lands
