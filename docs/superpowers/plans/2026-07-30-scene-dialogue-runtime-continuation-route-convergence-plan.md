# Scene Dialogue Runtime Continuation Route Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `scene-runtime` and `dialogue-runtime` scene-carried event continuation onto a shared runtime-owned router seam so `scene-runner` no longer falls back to local continuation state mutation when these runtimes are the owner.

**Architecture:** The recent children moved direct story entry, binding activation, navigation enter-house, and story-runtime state-only binding continuation onto shared router seams. The remaining cross-cutting continuation family is `continueToEvent(...)`, but it is still used by generic callers. Before narrowing that contract, the owner runtimes that wrap `runSceneUntilPause(...)` should first inject an explicit `continueFromSceneEvent` seam. This child keeps `continueToEvent(...)` unchanged for now, but teaches `runSceneFromEvent(...)` and `runDialogueFromEvent(...)` to route continuation events through one shared runtime-owned helper built on `dispatchEventRoute(...)`.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `scene-runtime and dialogue-runtime now inject continueFromSceneEvent and share one runtime-owned continuation helper built on dispatchEventRoute(...), so scene-carried continuation is no longer left on scene-runner's local fallback path when these runtimes are the owner.`
- Next Step: `Promote this verified checkpoint into branch history, then continue with the remaining generic continueToEvent(...) contract narrowing once the owner runtimes are in place.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene dialogue runtime continuation route convergence|scene runtime accepts an activated event handoff|scene runner scene-end continuation convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 432/432; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
- Notes: `This child stayed inside src/core/runtime/scene-runtime.ts, src/core/runtime/dialogue-runtime.ts, focused tests, and governance docs. continueToEvent(...) itself remains untouched in this slice and docs/superpowers/project-progress.md remains intentionally unrelated and unsynced.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next runtime-only child for scene/dialogue runtime continuation route convergence after pushing the story-runtime state-only binding checkpoint.`
  - Verification: `git status --short --branch; sed -n '1,200p' src/core/runtime/scene-runtime.ts; sed -n '1,200p' src/core/runtime/dialogue-runtime.ts; sed -n '1,240p' tests/dialogue-runtime-compatibility.test.cjs; rg -n "runSceneFromEvent|runDialogueFromEvent|continueFromSceneEvent|continueToEvent" src tests.`
  - Next: `Add RED coverage for runtime-owned continuation routing, then inject the shared continuation helper into both wrappers.`
- 2026-07-30
  - Summary: `Completed the scene/dialogue runtime continuation route convergence child as a verified completed-but-open checkpoint. scene-runtime now exports the shared routeSceneRuntimeContinuationEvent(...) helper, both runtime wrappers inject continueFromSceneEvent, and the new tests prove automatic nextEvent continuation is routed through dispatchEventRoute(...) under both carriers.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene dialogue runtime continuation route convergence|scene runtime accepts an activated event handoff|scene runner scene-end continuation convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
  - Next: `Commit/push this checkpoint, then continue with generic continueToEvent(...) contract narrowing.`

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-story-runtime-state-only-binding-route-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-navigation-enter-house-route-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The pushed story-runtime state-only binding checkpoint is `436da03`.
  - The active uncovered owner seam is runtime-owned scene/dialogue continuation through `runSceneUntilPause(...)`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- inject `continueFromSceneEvent` into `runSceneFromEvent(...)`
- inject the same continuation owner seam into `runDialogueFromEvent(...)`
- add focused RED/GREEN coverage proving these wrappers route continuation through the shared event-router seam
- preserve current `continueToEvent(...)` contract for generic callers
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- generic `continueToEvent(...)` contract narrowing
- `choice-resolver`, `game-store`, or `scene-runner` public contract rewrites
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/core/runtime/scene-runtime.ts`
  - Add the shared runtime-owned continuation helper and inject it into `runSceneUntilPause(...)`.
- `src/core/runtime/dialogue-runtime.ts`
  - Reuse the same shared continuation helper.
- `tests/dialogue-runtime-compatibility.test.cjs`
  - Keep baseline dialogue carrier coverage and extend it with router-first continuation coverage.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions for runtime-owned continuation injection.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-scene-dialogue-runtime-continuation-route-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `runSceneFromEvent(...)` routes continuation events through the shared event-router seam
  - `runDialogueFromEvent(...)` routes continuation events through the same seam
  - current dialogue carrier compatibility remains intact
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene dialogue runtime continuation route convergence|scene runtime accepts an activated event handoff|scene runner scene-end continuation convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Runtime-Owned Scene Continuation

**Files:**
- Read: `src/core/runtime/scene-runtime.ts`
- Read: `src/core/runtime/dialogue-runtime.ts`
- Read: `tests/dialogue-runtime-compatibility.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-scene-dialogue-runtime-continuation-route-convergence-plan.md`

- [x] **Step 1: Record the uncovered owner seam**

Run:

```bash
git status --short --branch
sed -n '1,200p' src/core/runtime/scene-runtime.ts
sed -n '1,200p' src/core/runtime/dialogue-runtime.ts
sed -n '1,240p' tests/dialogue-runtime-compatibility.test.cjs
rg -n "runSceneFromEvent|runDialogueFromEvent|continueFromSceneEvent|continueToEvent" src tests
```

Expected:

- identify that the owner runtimes still omit `continueFromSceneEvent`
- confirm both wrappers can share one continuation helper
- confirm `continueToEvent(...)` stays untouched in this slice

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included seam: `runSceneFromEvent(...)` and `runDialogueFromEvent(...)`
- excluded work: generic `continueToEvent(...)` rewrites
- current tests that can prove router-first continuation before and after the change

## Task 2: Add Focused RED Coverage For Runtime-Owned Continuation

**Files:**
- Modify: `tests/dialogue-runtime-compatibility.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add failing behavior coverage for scene/dialogue runtime continuation**

Add RED coverage that monkey-patches `dispatchEventRoute(...)` and proves scene/dialogue runtime continuation still bypasses the shared seam before implementation.

- [x] **Step 2: Add failing source-level ownership assertions**

Add a robustness assertion that requires both wrappers to inject `continueFromSceneEvent` and reuse one shared continuation helper.

## Task 3: Implement Runtime-Owned Continuation Route Convergence

**Files:**
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify: `src/core/runtime/dialogue-runtime.ts`

- [x] **Step 1: Add one shared continuation helper**

Implement a helper that routes continuation events through `dispatchEventRoute(...)` while preserving current continuation behavior.

- [x] **Step 2: Inject the helper into scene/dialogue wrappers**

Teach both wrappers to pass `continueFromSceneEvent` into `runSceneUntilPause(...)`.

- [x] **Step 3: Keep generic continuation contracts unchanged**

Do not change `continueToEvent(...)`, `scene-runner`, or `choice-resolver` public contracts in this slice.

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-scene-dialogue-runtime-continuation-route-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**
- [x] **Step 2: Record the new checkpoint**

## Exit Check

- [x] `scene-runtime` owns router-first scene continuation.
- [x] `dialogue-runtime` owns router-first scene continuation.
- [x] `continueToEvent(...)` public contract remains unchanged.
