# Core Production Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining production-path gaps in Child 1, Child 2, and Child 3 so engine boot ownership, save/load ownership, and runtime dispatch ownership are centered on `src/core` rather than on partially migrated `src/main.ts` orchestration.

**Architecture:** Treat this file as a prepared closure package, not an active weekly queue item. The plan assumes Child 1, Child 2, and Child 3 seam files already exist and focuses only on converting those seams into real production owners. Do not absorb Child 4 interactive runtime work, Child 5 presenter/render work, or full task-runtime extraction into this closure plan.

**Tech Stack:** TypeScript, Vite, Node test runner via `tests/robustness.test.cjs`, existing `src/core/**` seam files, repository plan governance

## Execution State

- Status: `not-started`
- Last Updated: `2026-06-29`
- Current Focus: `Prepared candidate plan only. This plan is intentionally not in the active weekly queue and must not be executed until the queue explicitly promotes it.`
- Next Step: `Reconcile this plan against the latest Child 4 / Child 5 sequencing decision, then begin Task 1 Step 1 only if it is formally promoted into execution.`
- Verification: `Not run as part of this doc-only change`
- Notes: `This file exists as a future closure package for Child 1, Child 2, and Child 3. It is intentionally separate from docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md and must remain outside the active weekly queue until promoted.`

## Progress Log

- 2026-06-29
  - Summary: `Authored a standalone candidate implementation plan for fully integrating Child 1, Child 2, and Child 3 into the real production path without adding it to the active weekly queue.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Reconcile against the latest runtime and weekly state before any execution begins.`
- 2026-06-29
  - Summary: `Tightened the candidate closure plan into a minimum-closeout package: clarified promotion rules, added a hard stop rule against Child 4/Child 5 scope bleed, and made the plan explicitly stop once production ownership is proven rather than chasing broad refactors.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Keep this plan outside the weekly queue until promotion is explicitly approved.`

---

## Source Documents

- Spec: `docs/superpowers/specs/2026-06-29-core-production-integration-spec.md`
- Parent architecture context: `docs/superpowers/specs/2026-06-29-engine-runtime-boundary-design.md`
- Parent orchestration plan: `docs/superpowers/plans/2026-06-29-mod-first-engine-runtime-extraction-plan.md`
- Weekly orchestration plan: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Child 1 implementation plan: `docs/superpowers/plans/2026-06-29-engine-runtime-boundary-plan.md`
- Child 2 implementation plan: `docs/superpowers/plans/2026-06-29-save-migration-hardening-plan.md`
- Child 3 implementation plan: `docs/superpowers/plans/2026-06-29-navigation-time-event-runtime-extraction-plan.md`

## Queue Position Rule

- This plan is not an active weekly queue item.
- Do not add this file to `Plan Status Board` or `Execution Queue` until the active weekly orchestrator explicitly promotes it.
- If this file is later promoted, update both this file and the weekly orchestration plan before any production code step is marked complete.

## Scope

This plan includes:

- EngineSession production adoption
- real save/load path cutover to `src/core/save/**`
- unified runtime dispatch/router adoption for navigation, time, event, and scene entry
- regression coverage that proves production path ownership

This plan does not include:

- interactive runtime extraction
- house runtime extraction
- presenter/render decoupling
- mod manifest loader or builtin-default-mod migration
- full task-state machine extraction

## Minimum Closure Rule

This file is a closeout plan, not a redesign plan.

Execution must stop once the following are all true:

- `EngineSession` is a real production-owned session boundary
- real save/load entry uses the core save APIs
- production navigation/time/event/scene entry uses dispatch/router ownership
- targeted regression tests prove the real cutover

Execution must not continue into:

- interactive runtime cleanup that belongs to Child 4
- presenter/render cleanup that belongs to Child 5
- broad state-model redesign outside the cutover need
- full task-runtime extraction
- "while we are here" refactors that do not change production ownership

If a desired code change does not directly move ownership from legacy production flow to `src/core`, it is out of scope for this plan.

## File Map

### Existing files to modify

- `src/main.ts`
  - Reduce direct orchestration and route production entry through core-owned session, save, and runtime seams.
- `src/application/state/create-initial-state.ts`
  - Align transitional state creation with the final production-owned core session boundary.
- `src/core/adapters/legacy-main-adapter.ts`
  - Promote the adapter from bootstrap seam to real production handoff contract as needed.
- `src/core/engine/engine-bootstrap.ts`
  - Accept the production-owned boot inputs and return the session/context that the app really uses.
- `src/core/engine/engine-factory.ts`
  - Finalize the session shape needed for real boot ownership.
- `src/core/engine/engine-session.ts`
  - Hold the production-owned engine session contract.
- `src/core/runtime/runtime-dispatch.ts`
  - Become the production runtime entrypoint rather than a test-only seam.
- `src/core/runtime/runtime-router.ts`
  - Own production routing for navigation, time, event, and scene request categories.
- `src/core/runtime/navigation-runtime.ts`
  - Participate in dispatch/router-owned runtime flow instead of standalone direct usage only.
- `src/core/runtime/time-runtime.ts`
  - Participate in dispatch/router-owned runtime flow instead of standalone direct usage only.
- `src/core/runtime/event-runtime.ts`
  - Participate in dispatch/router-owned runtime flow and shared runtime result output.
- `src/core/runtime/scene-runtime.ts`
  - Participate in dispatch/router-owned event-to-scene handoff output.
- `src/core/contracts/runtime-result.ts`
  - Carry any additive production-runtime result fields needed for the unified path.
- `src/core/save/save-envelope.ts`
  - Remain the write-side envelope seam used by the real production path.
- `src/core/save/save-loader.ts`
  - Become the real continue/load normalization entrypoint.
- `src/core/save/save-writer.ts`
  - Become the real save/export serialization entrypoint.
- `src/core/save/save-migrations.ts`
  - Stay behind the load path for real migration behavior.
- `tests/robustness.test.cjs`
  - Add failing tests first for production-path ownership rather than helper existence.
- `docs/change-log.md`
  - Record the future closure outcome once implementation lands.

### Existing files to read before execution

- `docs/superpowers/weekly/2026-06-29-weekly-review-index.md`
- `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`
- `docs/superpowers/weekly/2026-06-29-weekly-call-flows.md`

These files must be read before execution so the closure plan does not drift from the active architecture understanding.

## Required Verification Gate

For every production-code task in this plan, record at minimum:

- `npm run typecheck`
- `npm test`
- `npm run build`

For targeted seam ownership tasks, also record:

- `npm run build:test`
- the exact `node --test tests/robustness.test.cjs --test-name-pattern "..."`

If a command is skipped, record the reason in `Progress Log` before marking the related step complete.

## Bug And Blocker Gate

- `P0`
  - build failure, type failure, white screen, boot regression, save corruption, broken continue flow, unrecoverable runtime dead loop
  - Rule: stop later tasks in this plan until resolved
- `P1`
  - engine session still not production-owned, save/load still bypasses core save APIs, runtime dispatch still not the production owner, event-to-scene flow regresses
  - Rule: do not mark the affected task complete and do not mark this plan `completed`
- `P2`
  - additive typing cleanup, transitional duplication, limited manual-smoke-only gap with workaround
  - Rule: may be deferred only if logged in `Progress Log` with a follow-up action

## Task 1: Reconcile Closure Scope Against Latest Queue Reality

**Files:**
- Read: `docs/superpowers/specs/2026-06-29-core-production-integration-spec.md`
- Read: `docs/superpowers/plans/2026-06-29-weekly-orchestration-plan.md`
- Read: `docs/superpowers/weekly/2026-06-29-weekly-architecture-report.md`
- Read: `src/main.ts`
- Read: `src/core/**`
- Modify: `docs/superpowers/plans/2026-06-29-core-production-integration-plan.md`

- [ ] **Step 1: Confirm the plan is still out of weekly queue**

Verify all of the following before any production edit:

- this file is not named in the weekly execution queue
- no active child plan already owns the same closure scope
- Child 4 / Child 5 sequencing is explicitly known

- [ ] **Step 2: Reconcile the remaining production gaps**

Update this plan's notes if needed to reflect the actual current gaps:

- whether `EngineSession` is still ignored at runtime
- whether real save/load still bypasses `src/core/save/**`
- whether `dispatchRuntimeRequest()` is still not the production entrypoint

- [ ] **Step 3: Record the reconciled starting point**

Append a `Progress Log` entry that states:

- the queue decision
- the current real production gaps
- the first legal implementation task

## Task 2: Add Failing Production-Ownership Tests

**Files:**
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing engine-session ownership test**

Add a test shaped like:

```js
test("main.ts keeps a production-used engine session instead of discarding bootstrap output", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(mainSource, /void legacyEngineSession/);
});
```

- [ ] **Step 2: Add failing save-path ownership tests**

Add tests shaped like:

```js
test("production sources use loadSaveEnvelope on the real continue path", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(mainSource, /loadSaveEnvelope/);
});

test("production sources use serializeSaveEnvelope on the real save path", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(mainSource, /serializeSaveEnvelope/);
});
```

- [ ] **Step 3: Add a failing runtime-dispatch ownership test**

Add a test shaped like:

```js
test("main.ts routes runtime entry through dispatchRuntimeRequest instead of direct standalone runtime calls", () => {
  const mainSource = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.match(mainSource, /dispatchRuntimeRequest/);
});
```

- [ ] **Step 4: Run focused tests and confirm failure**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "production-used engine session|real continue path|real save path|routes runtime entry through dispatchRuntimeRequest"
```

Expected:

- tests fail because production ownership has not been fully cut over yet

## Task 3: Promote EngineSession To A Production-Owned Session Boundary

**Files:**
- Modify: `src/core/adapters/legacy-main-adapter.ts`
- Modify: `src/core/engine/engine-bootstrap.ts`
- Modify: `src/core/engine/engine-factory.ts`
- Modify: `src/core/engine/engine-session.ts`
- Modify: `src/main.ts`
- Modify if needed: `src/application/state/create-initial-state.ts`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Define the final production session contract**

Adjust `EngineSession` so it clearly owns:

- selected mod identity
- core state
- registries
- any transitional context needed by production boot

Do not leave the bootstrap result as an ignored value.

- [ ] **Step 2: Route `main.ts` through a retained session owner**

Update `main.ts` so it follows a seam shaped like:

```ts
const engineSession = bootstrapLegacyMain({
  selectedModId: builtinDefaultModId,
  registry: legacyEngineRegistry,
});

let coreState = engineSession.state;
```

The exact local names may differ, but the bootstrap result must become a real production dependency instead of a discarded bootstrap artifact.

- [ ] **Step 3: Align initial-state ownership**

Ensure the app's active state initialization reads from the retained engine/core session boundary rather than reconstructing parallel ownership after boot.

- [ ] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "production-used engine session"
```

Expected:

- the engine-session ownership test passes

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- production boot still succeeds
- no existing test regressions occur

- [ ] **Step 6: Commit**

```bash
git add src/core/adapters/legacy-main-adapter.ts src/core/engine src/application/state/create-initial-state.ts src/main.ts tests/robustness.test.cjs
git commit -m "refactor: promote engine session to production owner"
```

## Task 4: Cut The Real Save And Load Path Over To Core Save APIs

**Files:**
- Modify: `src/main.ts`
- Modify if needed: `src/core/save/save-envelope.ts`
- Modify if needed: `src/core/save/save-loader.ts`
- Modify if needed: `src/core/save/save-writer.ts`
- Modify if needed: `src/core/save/save-migrations.ts`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Reconcile current production save entrypoints**

Find the actual user-facing:

- continue/load path
- save/export/persist path

Record the exact functions in this plan's `Progress Log` before changing them.

- [ ] **Step 2: Route continue/load through `loadSaveEnvelope()`**

Update the real load path so it follows a seam shaped like:

```ts
const loadedEnvelope = loadSaveEnvelope(rawSaveData, {
  availableModIds: Object.keys(legacyEngineRegistry.mods),
});
```

The production load path must no longer normalize save data through an ad hoc non-core helper.

- [ ] **Step 3: Route save/export through `createSaveEnvelope()` and `serializeSaveEnvelope()`**

Update the real save path so it follows a seam shaped like:

```ts
const envelope = createSaveEnvelope({
  version: "1.0.0",
  state: coreState,
});
const serialized = serializeSaveEnvelope(envelope);
```

The production save path must no longer bypass the core envelope writer.

- [ ] **Step 4: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "real continue path|real save path|loadSaveEnvelope normalizes|missing selected mod|payload after load|save migration upgrades"
```

Expected:

- the new production ownership tests pass
- save compatibility tests still pass

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- save/load behavior still compiles and builds
- no existing regressions occur

- [ ] **Step 6: Commit**

```bash
git add src/main.ts src/core/save/save-envelope.ts src/core/save/save-loader.ts src/core/save/save-writer.ts src/core/save/save-migrations.ts tests/robustness.test.cjs
git commit -m "refactor: route production save load through core save APIs"
```

## Task 5: Make Dispatch And Router The Production Owners Of Runtime Entry

**Files:**
- Modify: `src/main.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/core/runtime/navigation-runtime.ts`
- Modify: `src/core/runtime/time-runtime.ts`
- Modify: `src/core/runtime/event-runtime.ts`
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify if needed: `src/core/contracts/runtime-result.ts`
- Test: `tests/robustness.test.cjs`

- [ ] **Step 1: Define the production router responsibilities**

Extend `runtime-router.ts` so the router can accept the request kinds already used in production and delegate to:

- navigation runtime
- time runtime
- event runtime
- scene handoff path where needed

- [ ] **Step 2: Keep `dispatchRuntimeRequest()` as the public entrypoint**

Update production code so runtime entry follows a seam shaped like:

```ts
const runtimeResult = dispatchRuntimeRequest({
  state: coreState,
  request,
  context: {
    routeRequest: routeRuntimeRequest,
  },
});
```

The exact helper names may differ, but `main.ts` must call one dispatch entrypoint rather than multiple standalone runtime helpers.

- [ ] **Step 3: Reduce direct standalone runtime calls in `main.ts`**

Replace production patterns shaped like:

```ts
runTimeRuntime(...)
runNavigationRuntime(...)
runEventRuntime(...)
runSceneFromEvent(...)
```

with request creation plus dispatch invocation.

For the covered production flows, do not leave mixed ownership behind.

The acceptable end state is:

- `main.ts` creates requests and handles browser/UI coordination
- `dispatchRuntimeRequest()` becomes the production runtime entrypoint
- `runtime-router.ts` becomes the production routing owner

- [ ] **Step 4: Preserve additive scene/task carriage**

Keep task seams additive only.

The cutover must preserve:

- scene handoff through runtime results
- task action carriage
- task signal carriage

without pulling full Task Runtime extraction into this plan.

- [ ] **Step 5: Run focused verification**

Run:

```bash
npm run build:test
node --test tests/robustness.test.cjs --test-name-pattern "routes runtime entry through dispatchRuntimeRequest|navigation external entry ids|typed day-start request|candidate selection and activation seams|activated event handoff"
```

Expected:

- the new production ownership test passes
- Child 3 seam tests still pass

- [ ] **Step 6: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run build
```

Expected:

- production runtime flow still compiles and builds
- navigation/time/event/scene regressions do not appear

- [ ] **Step 7: Commit**

```bash
git add src/main.ts src/core/runtime/runtime-dispatch.ts src/core/runtime/runtime-router.ts src/core/runtime/navigation-runtime.ts src/core/runtime/time-runtime.ts src/core/runtime/event-runtime.ts src/core/runtime/scene-runtime.ts src/core/contracts/runtime-result.ts tests/robustness.test.cjs
git commit -m "refactor: make core dispatch the production runtime owner"
```

## Task 6: Close Documentation And Promotion Readiness

**Files:**
- Modify: `docs/superpowers/plans/2026-06-29-core-production-integration-plan.md`
- Modify if needed: `docs/superpowers/specs/2026-06-29-core-production-integration-spec.md`
- Modify: `docs/change-log.md`

- [ ] **Step 1: Update plan state**

Update:

- `Execution State`
- `Progress Log`
- task checkboxes

- [ ] **Step 2: Record closure outcome**

Add a `docs/change-log.md` entry summarizing:

- EngineSession is now production-owned
- core save APIs own the real save/load path
- dispatch/router own runtime production entry for navigation/time/event/scene

- [ ] **Step 3: Record queue decision for future promotion**

If this plan was executed outside the weekly queue by explicit decision, record how it should now relate back to weekly governance.

If it was promoted into weekly governance before execution, record that promotion in the latest `Progress Log`.

- [ ] **Step 4: Run plan lint**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`

## Success Criteria

- Child 1 production ownership is real rather than bootstrap-only.
- Child 2 save/load ownership is real rather than test-only.
- Child 3 runtime dispatch ownership is real rather than partial helper adoption only.
- `src/main.ts` loses more feature orchestration responsibility and keeps browser/UI coordination responsibility.
- No Child 4, Child 5, or full Task Runtime scope leaks into this closure plan.
- Work stops after ownership cutover is proven; this plan does not continue into convenience refactors.

## Self-Review

- Spec coverage:
  - engine-session production adoption is covered by Task 3
  - save/load production cutover is covered by Task 4
  - runtime dispatch/router production cutover is covered by Task 5
  - closure documentation and promotion readiness are covered by Task 6
- Placeholder scan:
  - no `TBD`, `TODO`, or "implement later" placeholders remain
  - all tasks list exact file paths and commands
- Type consistency:
  - `EngineSession`, `loadSaveEnvelope()`, `createSaveEnvelope()`, `serializeSaveEnvelope()`, `dispatchRuntimeRequest()`, and runtime-result task/scene carriage are named consistently throughout

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
- [ ] Queue decision recorded
