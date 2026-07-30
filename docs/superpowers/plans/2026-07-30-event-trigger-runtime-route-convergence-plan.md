# Event Trigger Runtime Route Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `event-runtime` trigger activation onto the shared `event-router` seam so triggered story events no longer start directly inside `runEventRuntime(...)`.

**Architecture:** The earlier story-runtime and scene-runner slices already moved direct-entry and scene-owned continuation onto router-first ownership. This child narrows the next uncovered trigger path: `runStoryEventRuntime(...)` currently selects an activated event and immediately `startEvent(...)`s it. The change stays inside `src/core/runtime/event-runtime.ts` plus focused tests by routing the activated event through `dispatchEventRoute(...)` and preserving the current `EventRuntimeResult` surface for `scene-runtime` and `dialogue-runtime`.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime/story contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Tasks 2-4 are locally complete and verified. event-runtime trigger activation now routes through dispatchEventRoute(...) instead of starting events directly after selection, while scene-runtime and dialogue-runtime continue to consume the same EventRuntimeResult seam.`
- Next Step: `Commit/push this checkpoint from codex/migration-hot-tasks, then decide whether the next adjacent runtime-only child should target event-binding-runtime or enter-house direct event start ownership.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|event router runtime core|scene runner scene-end continuation convergence|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 428/428; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stayed inside src/core/runtime/event-runtime.ts, focused tests, and governance docs only. docs/superpowers/project-progress.md remains intentionally unrelated and unsynced. event-binding-runtime and enter-house remain separate caller families for later slices.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next runtime-only child for event-trigger route convergence after pushing the scene-runner single-seam checkpoint.`
  - Verification: `sed -n '1,220p' docs/superpowers/project-progress.md; sed -n '1,260p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md; git status --short --branch; sed -n '1,220p' src/core/runtime/event-runtime.ts; sed -n '1,220p' src/core/runtime/dialogue-runtime.ts; sed -n '1,220p' src/core/runtime/scene-runtime.ts; sed -n '1,260p' tests/event-router-runtime.test.cjs; rg -n "runStoryEventRuntime|runEventRuntime|dispatchEventRoute|startEvent" src/core tests.`
  - Next: `Run Task 2 and add RED tests plus source-level assertions for router-first event-trigger activation without widening into event-binding-runtime or enter-house callers.`
- 2026-07-30
  - Summary: `Completed the local event-trigger route convergence checkpoint. runStoryEventRuntime(...) now routes activated trigger events through dispatchEventRoute(...), while scene-runtime and dialogue-runtime continue consuming the unchanged EventRuntimeResult seam.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 6/6; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|event router runtime core|scene runner scene-end continuation convergence|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 428/428; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Promote this checkpoint into branch history, then decide whether event-binding-runtime or enter-house is the next narrower direct-start caller family.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-direct-event-entry-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-scene-runner-scene-end-continuation-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The pushed scene-runner single-seam checkpoint is `e875ee6`.
  - The active uncovered trigger path is `src/core/runtime/event-runtime.ts`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit `runEventRuntime(...)` and `runStoryEventRuntime(...)` direct start ownership
- add focused RED tests that require triggered event activation to route through `dispatchEventRoute(...)`
- preserve current `EventRuntimeResult` shape for `scene-runtime` and `dialogue-runtime`
- keep task input passthrough and activation metadata behavior intact
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- `event-binding-runtime`
- `enter-house`
- broader recursive event-chain execution after event activation
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/core/runtime/event-runtime.ts`
  - Route activated trigger events through `dispatchEventRoute(...)` while preserving the current result envelope.
- `tests/event-router-runtime.test.cjs`
  - Add RED/GREEN coverage for router-first trigger activation.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so `event-runtime` cannot regress to direct trigger-owned event start.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-event-trigger-runtime-route-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `runStoryEventRuntime(...)` routes activated events through `dispatchEventRoute(...)`
  - `scene-runtime` and `dialogue-runtime` still receive the same activation/session behavior
  - task input metadata remains canonical-first
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|event router runtime core|scene runner scene-end continuation convergence|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Event Trigger Route Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/core/runtime/event-runtime.ts`
- Read: `src/core/runtime/dialogue-runtime.ts`
- Read: `src/core/runtime/scene-runtime.ts`
- Read: `tests/event-router-runtime.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-event-trigger-runtime-route-convergence-plan.md`

- [x] **Step 1: Record the exact trigger activation seam**

Run:

```bash
sed -n '1,220p' docs/superpowers/project-progress.md
sed -n '1,260p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md
git status --short --branch
sed -n '1,220p' src/core/runtime/event-runtime.ts
sed -n '1,220p' src/core/runtime/dialogue-runtime.ts
sed -n '1,220p' src/core/runtime/scene-runtime.ts
sed -n '1,260p' tests/event-router-runtime.test.cjs
rg -n "runStoryEventRuntime|runEventRuntime|dispatchEventRoute|startEvent" src/core tests
```

Expected:

- identify exactly where `event-runtime` still starts the activated event directly
- confirm `scene-runtime` and `dialogue-runtime` already treat `EventRuntimeResult` as the reusable boundary
- confirm `event-binding-runtime` and `enter-house` remain separate caller families

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included caller family: `runEventRuntime(...)` / `runStoryEventRuntime(...)`
- excluded caller families: `event-binding-runtime`, `enter-house`, broader event-chain execution
- current tests that can prove router-first activation before and after the change

Audit record:

- Included path: `runEventRuntime(...)` currently returns `state: startEvent(input.state, eventDefinition)`, so trigger activation still starts the event locally inside `event-runtime`.
- Existing reusable seam: `dispatchEventRoute(...)` already resolves canonical event entities and dispatches by kind, and `scene-runtime` / `dialogue-runtime` only depend on the resulting `EventRuntimeResult`.
- Excluded callers: `event-binding-runtime` and `enter-house` still start events directly, but they belong to separate owner families and should be migrated later in isolated slices.
- Current proof tests: `tests/event-router-runtime.test.cjs` already exercises the canonical event-router seam and can add direct coverage for `runStoryEventRuntime(...)`; `tests/robustness.test.cjs` already guards the event-runtime task input contract and can add a new source-level router-ownership assertion.

- [x] **Step 3: Sync the parent handoff with this active child**

Update the parent handoff so it points at this child as the next runtime-only convergence slice after the pushed scene-runner single-seam checkpoint.

## Task 2: Add Focused RED Coverage For Router-First Trigger Activation

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for runStoryEventRuntime(...)**

Add RED coverage that monkey-patches `dispatchEventRoute(...)` and proves `runStoryEventRuntime(...)` still bypasses the shared event-router seam before implementation.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires `event-runtime` to route activated events through `dispatchEventRoute(...)` and rejects a direct `startEvent(...)` return path in `runEventRuntime(...)`.

- [x] **Step 3: Run the RED suite**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event trigger runtime route convergence"
```

Expected:

- at least one new assertion fails against the pre-implementation trigger path
- the failure points at `event-runtime` still starting the event locally after trigger selection

## Task 3: Implement Event Trigger Route Convergence

**Files:**
- Modify: `src/core/runtime/event-runtime.ts`

- [x] **Step 1: Route activated trigger events through the canonical event-router seam**

Implement the thinnest change that:

- keeps `EventRuntimeResult` unchanged for current callers
- routes activated events through `dispatchEventRoute(...)`
- preserves activation metadata, task inputs, and current state behavior

- [x] **Step 2: Keep `scene-runtime` and `dialogue-runtime` unchanged**

Do not widen the caller surface of:

- `runSceneFromEvent(...)`
- `runDialogueFromEvent(...)`
- `runStoryTriggerRuntime(...)`
- `runStoryDialogueTriggerRuntime(...)`

- [x] **Step 3: Keep focused behavior coverage green**

Update tests so they still prove:

- router-first trigger activation is explicit
- activation/session behavior remains intact
- task input behavior remains canonical-first

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-event-trigger-runtime-route-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**

Run the full verification plan listed above and record the exact outcomes in this child plan.

- [x] **Step 2: Record the new checkpoint**

Update:

- this child plan `Execution State`
- this child plan `Progress Log`
- the parent handoff `Execution State`
- the parent handoff `Progress Log`

with the exact verified resume point and the remaining next child scope.

## Exit Check

- [x] `event-runtime` no longer owns direct trigger-started event activation.
- [x] `scene-runtime` and `dialogue-runtime` still consume the same `EventRuntimeResult` seam.
- [x] task input behavior remains canonical-first.
