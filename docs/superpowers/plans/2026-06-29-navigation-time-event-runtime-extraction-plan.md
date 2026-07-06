# Navigation Time Event Runtime Extraction Plan

> **Legacy Governance Context:** This document was authored under the retired `weekly plan / weekly set / weekly orchestration` model. Keep its technical scope, but treat any weekly-governance references as historical context only. Resume governed work from `docs/superpowers/project-progress.md` instead.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move navigation-triggered and time-triggered event entry into the core runtime pipeline so `main.ts` no longer owns primary navigation/time/event orchestration inline, while also establishing the first controlled handoff from `Event Runtime` into `Scene Runtime`.

**Architecture:** Build Child 3 on top of the Child 1 runtime seam and Child 2 save seam without redesigning either. Introduce `Navigation Runtime`, `Time Runtime`, `Event Runtime`, and a first `Scene Runtime` handoff seam inside `src/core/runtime/**`, while temporarily reusing existing `src/application/navigation/**`, `src/application/time/**`, `src/application/events/**`, and `src/application/scene/**` logic through adapters or transitional calls. Do not implement the full `Task / Mission Runtime` here; only reserve task action and task signal seams required by the approved collaboration spec.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing navigation/time/event/scene application services, repository plan governance

---

## Execution State

- Status: `completed`
- Last Updated: `2026-06-29`
- Current Focus: `Child 3 acceptance is satisfied in the isolated worktree: navigation/time request factories, event candidate activation, and the first scene handoff seam now exist under src/core/runtime, and main.ts routes real navigation/time/event entry through those seams instead of owning those trigger paths inline.`
- Next Step: `Sync this completed Child 3 slice back into the dev working tree, then promote Child 4 interactive runtime integration as the next executable child after Child 3 review/merge.`
- Verification: `2026-06-29: npm run lint:plans; npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"; npm run typecheck; npm test; npm run build`
- Notes: `This is Child Plan 3 under the mod-first engine runtime extraction roadmap. Work executed in the isolated worktree on branch codex/child3-nav, seeded from the validated dev working tree because Child 1 and Child 2 remain uncommitted there. The Child 3 setup also required a targeted baseline sync of src/application/house-modules/temple-house/temple-house-house-module.ts and src/content/scenario-packs/zhuyuanzhang/text-entries.json so verification matched the passing dev state before runtime work resumed. Child 3 owns Navigation Runtime, Time Runtime, Event Runtime, and the first Scene Runtime handoff seam, but not full Task / Mission Runtime extraction.`

## Progress Log

- 2026-06-29
  - Summary: `Child Plan 3 authored from the event-task-scene collaboration spec and runtime subsystem mapping.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Wait for Child 1 completion and Child 2 completion, or a recorded Child 2 waiver in both parent and weekly logs, then begin Task 1 Step 1.`
- 2026-06-29
  - Summary: `Opened Child 3 in isolated worktree codex/child3-nav after re-verifying Child 2 on dev, reconciled the plan against actual inherited seams, recorded explicit non-overlap rules, and finalized the remaining Child 3 inventory against the real src/core/runtime and src/core/save boundaries.`
  - Verification: `npm run lint:plans`
  - Next: `Start Task 2 by adding failing navigation/time/event/scene seam tests, then confirm the expected red state before production code changes.`
- 2026-06-29
  - Summary: `Completed Task 2 in the isolated worktree by adding focused navigation/time/event/scene seam tests first, confirming the expected red state because the new runtime files did not exist yet, and diagnosing one unrelated baseline mismatch back to missing dev-sync copies of the temple-house module and zhuyuanzhang text entries before resuming the Child 3 red/green cycle.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"`
  - Next: `Implement the runtime seam files and route at least one real navigation/time/event path through them before running full verification.`
- 2026-06-29
  - Summary: `Completed Task 3 through Task 6 in the isolated worktree: src/core/runtime now includes navigation-runtime.ts, time-runtime.ts, event-runtime.ts, event-candidate-selector.ts, event-condition-evaluator.ts, event-activation.ts, scene-runtime.ts, scene-session.ts, and scene-choice-resolution.ts; src/core/contracts gained event-runtime.ts plus scene-runtime.ts; runtime-result.ts now carries scene/task seams; and main.ts routes real city-entry, timed advancement, and story-trigger entry through the new runtime wrappers instead of owning those trigger paths inline.`
  - Verification: `npm run build:test; node --test tests/robustness.test.cjs --test-name-pattern "navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"; npm run typecheck; npm test; npm run build`
  - Next: `Close Child 3 by updating docs/change-log.md plus the parent/weekly orchestration and weekly visibility artifacts.`
- 2026-06-29
  - Summary: `Completed Task 7 closeout in the isolated worktree: Child 3 is now marked complete, docs/change-log.md and the parent/weekly/visibility docs reflect navigation/time/event extraction, and the weekly artifact bundle now describes runtime-owned navigation/time/event entry plus the first event-to-scene handoff seam.`
  - Verification: `npm run lint:plans`
  - Next: `Promote Child 4 as the next executable child after this Child 3 slice is reviewed and integrated.`

## Source Documents

- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Runtime subsystem authority: `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Event/task/scene authority: `docs/superpowers/specs/2026-06-29-event-task-scene-runtime-collaboration-spec.md`
- Child 1 implementation plan: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- Child 2 implementation plan: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`

## Parent Alignment

- This file is Child Plan 3 in the parent orchestration queue.
- Primary subsystem boundary:
  - `Navigation Runtime`
  - `Time Runtime`
  - `Event Runtime`
  - `Scene Runtime` handoff seam
- Secondary dependency:
  - `Effect Settlement Runtime` from Child 1
  - `Save / Load Runtime` from Child 2 unless explicitly waived in both the parent and weekly progress logs with a recorded reason
- Scope guard:
  - do not redesign Child 1 engine/bootstrap ownership
  - do not redesign Child 2 save-loader/save-writer/save-migrations ownership
  - do not complete full `Task / Mission Runtime` extraction in this child
  - do not implement presenter/render cutover in this child
  - do not replace the existing `application/story/story-runtime.ts` scene playback loop in one pass; wrap or hand off through additive core runtime seams first

## Scope

This child plan includes:

- navigation-driven runtime requests
- time-driven runtime requests
- event candidate selection and activation inside `src/core/runtime/**`
- story/routine/npc/incident event policy hooks inside one event pipeline
- first scene handoff from `Event Runtime` into `Scene Runtime`
- task action and task signal seams only

This child plan does not include:

- full task-state machine extraction
- interactive runtime extraction
- house runtime extraction
- presenter/render decoupling
- mod manifest loader or default mod migration

## File Map

### Existing Files Likely To Change

- `src/main.ts`
  - Reduce inline navigation/time/event branching by routing through runtime entry seams.
- `tests/robustness.test.cjs`
  - Add navigation/time/event/scene runtime seam regression tests.
- `src/application/navigation/enter-city.ts`
  - Reuse through runtime seam rather than direct boot-path orchestration.
- `src/application/navigation/enter-house.ts`
  - Reuse through runtime seam rather than direct boot-path orchestration.
- `src/application/time/time-progression.ts`
  - Reuse as a transitional time mutation dependency behind typed runtime requests.
- `src/application/events/event-runner.ts`
  - Reuse or wrap as a transitional event activation dependency.
- `src/application/events/condition-evaluator.ts`
  - Reuse or wrap as a transitional event condition dependency.
- `src/application/events/trigger-evaluator.ts`
  - Reuse or wrap as a transitional trigger dependency.
- `src/application/scene/scene-runner.ts`
  - Reuse as the first scene-runtime execution seam.
- `src/application/scene/choice-resolver.ts`
  - Reuse as the first scene choice-resolution seam.
- `docs/change-log.md`
  - Record navigation/time/event/scene seam extraction once it lands.

### New Files To Create

- `src/core/contracts/scene-runtime.ts`
- `src/core/contracts/event-runtime.ts`
- `src/core/runtime/navigation-runtime.ts`
- `src/core/runtime/time-runtime.ts`
- `src/core/runtime/event-runtime.ts`
- `src/core/runtime/event-candidate-selector.ts`
- `src/core/runtime/event-condition-evaluator.ts`
- `src/core/runtime/event-activation.ts`
- `src/core/runtime/scene-runtime.ts`
- `src/core/runtime/scene-session.ts`
- `src/core/runtime/scene-choice-resolution.ts`

### Files Child 3 May Modify Only Through Additive Wiring

- `src/core/runtime/runtime-dispatch.ts`
- `src/core/runtime/runtime-router.ts`
- `src/core/contracts/runtime-result.ts`

These files may be extended only to wire Child 3 seams into the already-owned Child 1 boundary.

Child 3 must not:

- replace Child 1 dispatch ownership
- rewrite settlement ownership
- reshape save ownership to serve navigation/time/event concerns

### Reconciled Inherited Runtime And Save Seams

- `src/core/contracts/runtime-request.ts`
  - already defines `action`, `tick`, and `external` request variants
- `src/core/contracts/runtime-result.ts`
  - currently carries only `state`, `effects`, and optional `navigation`
- `src/core/runtime/runtime-dispatch.ts`
  - already owns dispatch entry plus post-route settlement
- `src/core/runtime/runtime-router.ts`
  - currently exposes the router type seam only; Child 3 may extend wiring additively
- `src/core/runtime/runtime-settlement.ts`
  - currently settles `setFlag` and `setVariable` effects only
- `src/core/save/save-envelope.ts`
  - Child 1/2 stabilized the envelope seam and current version constant
- `src/core/save/save-loader.ts`
  - Child 2 owns normalization plus selected-mod validation
- `src/core/save/save-writer.ts`
  - Child 2 owns serialization round-trip behavior
- `src/core/save/save-migrations.ts`
  - Child 2 owns migration ordering and legacy-shape normalization

### Child 3 Non-Overlap Rules

- Child 3 must treat `src/core/save/**` as closed ownership for this slice unless a runtime contract change strictly requires additive typing only.
- Child 3 must keep `dispatchRuntimeRequest()` as the entry seam introduced by Child 1 rather than inventing a parallel runtime executor.
- Child 3 must not absorb presenter ownership, save normalization logic, or full scene playback replacement while extracting navigation/time/event entry.
- Child 3 may reuse `src/application/navigation/**`, `src/application/time/**`, `src/application/events/**`, and `src/application/story/**` only through transitional wrappers, request factories, and runtime handoff seams.

### Remaining Child 3 Inventory

- typed runtime request factories for:
  - city entry
  - house entry
  - day-start / time advancement entry
- one additive runtime route that can accept those requests without replacing Child 1 dispatch ownership
- event candidate selection and activation seams that wrap current story/event trigger logic
- first event-to-scene handoff seam that can return scene metadata through `RuntimeResult`
- task action / task signal carriage only, without extracting a full task-state machine

### Files Child 3 May Read But Must Not Redesign

- `src/core/runtime/runtime-settlement.ts`
- `src/core/save/**`

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

If one of these commands is intentionally skipped, record the reason in `Progress Log` before marking any related step complete.

## Bug And Blocker Gate

- `P0`
  - build failure, type failure, white screen, broken navigation boot path, dead loop in event re-entry, unrecoverable scene lock
  - Rule: stop later tasks in this child plan until resolved
- `P1`
  - navigation requests bypass runtime, time progression bypasses runtime, event candidate pipeline breaks, scene handoff corrupts flow, task seam is missing where required by scene/event outputs
  - Rule: do not mark the affected task complete and do not mark this child `completed`
- `P2`
  - additive contract mismatch, temporary adapter duplication, non-critical source-guard gap, minor over-retained legacy helper
  - Rule: may be deferred only if logged in `Progress Log` with follow-up action

## Task 1: Reconcile Child 3 Scope Against Child 1 and Child 2

**Files:**
- Read: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- Read: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
- Read: `src/core/runtime/**`
- Modify: `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`

- [x] **Step 1: Confirm the inherited runtime seams**

Verified the currently inherited boundary in the local Child 3 worktree:

- `RuntimeRequest` already supports `action`, `tick`, and `external`
- `RuntimeResult` currently supports only `state`, `effects`, and optional `navigation`
- `dispatchRuntimeRequest()` already owns routing plus settlement
- `runtime-settlement.ts` currently settles only flag/variable effects
- `src/core/save/**` is already present and completed from Child 2
- `main.ts` still drives concrete navigation, time progression, and story-trigger entry inline

- [x] **Step 2: Record non-overlap rules if needed**

The non-overlap rules above now explicitly reserve:

- save ownership for Child 2
- presenter ownership for Child 5
- full scene/task-runtime extraction for later children
- transitional reuse of `application/story/*` rather than immediate replacement

- [x] **Step 3: Define the remaining Child 3 inventory**

The remaining inventory is now explicitly recorded above:

- navigation request entry
- time request entry
- event candidate pipeline
- scene handoff seam
- task action / task signal seam only

## Task 2: Add Failing Runtime Seam Tests

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add focused failing tests for navigation/time/event entry**

Add tests shaped like:

```js
test("runtime request contract supports navigation external entry ids", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/navigation-runtime.ts"),
    "utf8"
  );

  assert.match(source, /createEnterCityRequest/);
  assert.match(source, /createEnterHouseRequest/);
});

test("time runtime creates a typed day-start request", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/time-runtime.ts"),
    "utf8"
  );

  assert.match(source, /createDayStartRequest/);
});
```

- [x] **Step 2: Add focused failing tests for event candidate and scene handoff seams**

Add tests shaped like:

```js
test("event runtime exports candidate selection and activation seams", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/event-runtime.ts"),
    "utf8"
  );

  assert.match(source, /selectEventCandidate/);
  assert.match(source, /activateEvent/);
});

test("scene runtime accepts an activated event handoff", async () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/core/runtime/scene-runtime.ts"),
    "utf8"
  );

  assert.match(source, /runSceneFromEvent/);
});
```

- [x] **Step 3: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"
```

Expected:

- tests fail because Child 3 files do not exist yet

## Task 3: Add Navigation and Time Runtime Entry Seams

**Files:**
- Create: `src/core/runtime/navigation-runtime.ts`
- Create: `src/core/runtime/time-runtime.ts`
- Modify if needed: `src/core/contracts/runtime-request.ts`
- Modify if needed: `src/main.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add navigation request factory seams**

Create `src/core/runtime/navigation-runtime.ts` with:

```ts
import type { RuntimeRequest } from "../contracts/runtime-request";

export function createEnterCityRequest(cityId: string): RuntimeRequest {
  return {
    type: "external",
    eventId: "navigation.enter-city",
    payload: { cityId },
  };
}

export function createEnterHouseRequest(houseId: string): RuntimeRequest {
  return {
    type: "external",
    eventId: "navigation.enter-house",
    payload: { houseId },
  };
}
```

- [x] **Step 2: Add time request factory seams**

Create `src/core/runtime/time-runtime.ts` with:

```ts
import type { RuntimeRequest } from "../contracts/runtime-request";

export function createDayStartRequest(): RuntimeRequest {
  return {
    type: "tick",
    tickId: "time.day-start",
  };
}
```

- [x] **Step 3: Route one real navigation/time entry through the runtime seam**

Update the active boot path so at least one city-entry path and one day-start path use the new request-factory seam before dispatch.

Keep the production change minimal. The requirement is to create explicit runtime-owned entry points, not to rewrite all navigation and time logic in one pass.

- [x] **Step 4: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- navigation/time seam tests pass
- production build still passes
- at least one real navigation path and one real day-start path now enter runtime through typed requests

- [ ] **Step 5: Commit**

```bash
git add src/core/runtime/navigation-runtime.ts src/core/runtime/time-runtime.ts src/main.ts tests/robustness.test.cjs
git commit -m "feat: add navigation and time runtime entry seams"
```

## Task 4: Add Event Candidate Pipeline and Activation Seams

**Files:**
- Create: `src/core/contracts/event-runtime.ts`
- Create: `src/core/runtime/event-runtime.ts`
- Create: `src/core/runtime/event-candidate-selector.ts`
- Create: `src/core/runtime/event-condition-evaluator.ts`
- Create: `src/core/runtime/event-activation.ts`
- Read or Wrap: `src/application/events/condition-evaluator.ts`
- Read or Wrap: `src/application/events/trigger-evaluator.ts`
- Read or Wrap: `src/application/events/event-runner.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add the first event-runtime contracts**

Create `src/core/contracts/event-runtime.ts` with:

```ts
import type { RuntimeRequest } from "./runtime-request";

export type EventRuntimeCandidate = {
  eventId: string;
  priority: number;
  sceneId?: string;
  taskActions?: Array<{ type: string; taskId: string }>;
};

export type EventRuntimeInput = {
  request: RuntimeRequest;
  availableEventIds: string[];
};
```

- [x] **Step 2: Add candidate selection and condition-evaluator seams**

Create `src/core/runtime/event-candidate-selector.ts` with:

```ts
import type { EventRuntimeCandidate } from "../contracts/event-runtime";

export function selectEventCandidate(
  candidates: EventRuntimeCandidate[]
): EventRuntimeCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  return [...candidates].sort((left, right) => right.priority - left.priority)[0];
}
```

Create `src/core/runtime/event-condition-evaluator.ts` with:

```ts
export function canActivateEvent(input: {
  once?: boolean;
  alreadyConsumed?: boolean;
}): boolean {
  if (input.once && input.alreadyConsumed) {
    return false;
  }

  return true;
}
```

- [x] **Step 3: Add the event activation seam**

Create `src/core/runtime/event-activation.ts` with:

```ts
import type { EventRuntimeCandidate } from "../contracts/event-runtime";

export function activateEvent(candidate: EventRuntimeCandidate | null) {
  if (!candidate) {
    return null;
  }

  return {
    activeEventId: candidate.eventId,
    sceneId: candidate.sceneId ?? null,
    taskActions: candidate.taskActions ?? [],
  };
}
```

- [x] **Step 4: Add the unified event-runtime entry**

Create `src/core/runtime/event-runtime.ts` with:

```ts
import type { EventRuntimeInput } from "../contracts/event-runtime";
import { selectEventCandidate } from "./event-candidate-selector";
import { activateEvent } from "./event-activation";

export function runEventRuntime(input: EventRuntimeInput) {
  const candidate = selectEventCandidate(
    input.availableEventIds.map((eventId) => ({
      eventId,
      priority: 0,
    }))
  );

  return activateEvent(candidate);
}
```

This task only establishes the pipeline seam. The first pass may still use transitional adapters or stub candidate population where the real event content integration lands in follow-up work.

- [x] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- event runtime seam tests pass
- the new event runtime compiles without breaking existing gameplay paths
- production build still passes

- [ ] **Step 6: Commit**

```bash
git add src/core/contracts/event-runtime.ts src/core/runtime/event-runtime.ts src/core/runtime/event-candidate-selector.ts src/core/runtime/event-condition-evaluator.ts src/core/runtime/event-activation.ts tests/robustness.test.cjs
git commit -m "feat: add event runtime candidate and activation seams"
```

## Task 5: Add the First Scene Runtime Handoff

**Files:**
- Create: `src/core/contracts/scene-runtime.ts`
- Create: `src/core/runtime/scene-runtime.ts`
- Create: `src/core/runtime/scene-session.ts`
- Create: `src/core/runtime/scene-choice-resolution.ts`
- Read or Wrap: `src/application/scene/scene-runner.ts`
- Read or Wrap: `src/application/scene/choice-resolver.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Add scene-runtime contracts**

Create `src/core/contracts/scene-runtime.ts` with:

```ts
export type SceneRuntimeSession = {
  sceneId: string;
  currentNodeId: string | null;
};

export type SceneRuntimeResult = {
  session: SceneRuntimeSession | null;
  taskSignals: Array<{ type: string; taskId: string }>;
  effects: Array<Record<string, unknown>>;
};
```

- [x] **Step 2: Add scene-session and choice-resolution seams**

Create `src/core/runtime/scene-session.ts` with:

```ts
import type { SceneRuntimeSession } from "../contracts/scene-runtime";

export function createSceneSession(sceneId: string): SceneRuntimeSession {
  return {
    sceneId,
    currentNodeId: null,
  };
}
```

Create `src/core/runtime/scene-choice-resolution.ts` with:

```ts
export function resolveSceneChoice(input: {
  nextNodeId?: string;
}): string | null {
  return input.nextNodeId ?? null;
}
```

- [x] **Step 3: Add the first event-to-scene handoff**

Create `src/core/runtime/scene-runtime.ts` with:

```ts
import { createSceneSession } from "./scene-session";
import type { SceneRuntimeResult } from "../contracts/scene-runtime";

export function runSceneFromEvent(input: {
  sceneId: string;
}): SceneRuntimeResult {
  return {
    session: createSceneSession(input.sceneId),
    taskSignals: [],
    effects: [],
  };
}
```

The first pass only needs to prove that `Event Runtime` can hand off an activated `sceneId` into `Scene Runtime`. It does not need to replace all legacy scene playback yet.

- [x] **Step 4: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- scene handoff test passes
- scene seam compiles
- production build still passes

- [ ] **Step 5: Commit**

```bash
git add src/core/contracts/scene-runtime.ts src/core/runtime/scene-runtime.ts src/core/runtime/scene-session.ts src/core/runtime/scene-choice-resolution.ts tests/robustness.test.cjs
git commit -m "feat: add scene runtime handoff seam"
```

## Task 6: Wire Runtime Routing and Reserve Task Seams

**Files:**
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify if needed: `src/main.ts`
- Test: `tests/robustness.test.cjs`

- [x] **Step 1: Extend runtime-result concepts for scene and task seams**

Update `src/core/contracts/runtime-result.ts` so the contract can carry:

```ts
export type RuntimeTaskSignal = {
  type: string;
  taskId: string;
};

export type RuntimeTaskAction = {
  type: string;
  taskId: string;
};

export type RuntimeResult = {
  state: CoreGameState;
  effects: Effect[];
  navigation?: NavigationTarget | null;
  scene?: {
    sceneId: string;
    currentNodeId?: string | null;
  } | null;
  taskActions?: RuntimeTaskAction[];
  taskSignals?: RuntimeTaskSignal[];
};
```

- [x] **Step 2: Route one event path through event runtime and scene handoff**

Update the runtime router seam so a real event-oriented request can:

- enter `runEventRuntime(...)`
- receive an activated `sceneId`
- hand off to `runSceneFromEvent(...)`
- return `taskSignals` and `effects` in one unified runtime result

- [x] **Step 3: Keep task ownership as a seam only**

Do not implement a full task-state machine here.

Only ensure that:

- event runtime can return `taskActions`
- scene runtime can return `taskSignals`
- runtime result can carry those values forward for later `Task Runtime` extraction

- [x] **Step 4: Run final verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- runtime routing still compiles
- at least one real event path now flows through event activation and scene handoff
- task seams exist without completing full task runtime extraction
- production build still passes

- [ ] **Step 5: Update docs and commit**

Append a change log entry summarizing:

```md
- moved navigation and time trigger entry toward runtime-owned requests
- added event candidate and activation seams in `src/core/runtime`
- added first event-to-scene handoff seam
- reserved task action and task signal seams without extracting full task runtime yet
```

Commit:

```bash
git add src/core/contracts/runtime-result.ts src/core/runtime/runtime-router.ts src/core/runtime/runtime-dispatch.ts src/main.ts docs/change-log.md tests/robustness.test.cjs
git commit -m "refactor: route navigation time and event seams through core runtime"
```

## Task 7: Sync Orchestration and Close Child 3

**Files:**
- Modify: `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`
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

Add a concise entry summarizing Child 3 outcomes and any deferred full-task-runtime follow-up.

## Success Criteria

- navigation and time entry paths can produce typed runtime requests
- event candidate selection and activation are represented inside `src/core/runtime/**`
- at least one event path can hand off into `Scene Runtime`
- `main.ts` no longer owns primary navigation/time/event mutations inline
- task action and task signal seams exist without claiming full `Task / Mission Runtime` ownership
- Child 3 does not absorb save hardening, interactive runtime, house runtime, or presenter/render responsibilities

## Self-Review

- Spec coverage:
  - navigation/time trigger entry is covered by Task 3
  - event candidate and activation seams are covered by Task 4
  - first scene handoff is covered by Task 5
  - task seam reservation without full task extraction is covered by Task 6
- Placeholder scan:
  - no `TBD`, `TODO`, or "implement later" placeholders remain
  - all tasks list exact file paths and commands
- Type consistency:
  - `RuntimeRequest`, `RuntimeResult`, `EventRuntimeCandidate`, `SceneRuntimeSession`, and task signal concepts are used consistently throughout

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Parent plan synchronized
- [x] Weekly orchestration synchronized
- [x] Verification recorded
- [x] Change log updated
