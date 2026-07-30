# Event Continuation Contract Narrowing Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split generic event continuation into a pure resolution helper plus a compatibility start wrapper so runtime-owned callers can converge on one event-definition seam without forcing immediate contract churn across every fallback caller.

**Architecture:** The previous children already moved direct story entry, binding activation, navigation enter-house, story-runtime state-only binding continuation, and scene/dialogue wrapper continuation onto router-first seams. The remaining shared helper, `continueToEvent(...)`, still mixes target resolution with local `startEvent(...)` mutation. This child narrows that seam by extracting `resolveEventContinuation(...)` and migrating the ownerized runtime callers in `story-runtime`, `scene-runner`, and `choice-resolver` onto the pure helper while preserving the old compatibility wrapper for untouched callers.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `event-continuation now exposes resolveEventContinuation(...) as the pure target lookup seam, while continueToEvent(...) is reduced to a compatibility wrapper that still performs the legacy local startEvent(...) fallback.`
- Next Step: `Promote this verified checkpoint into branch history, then continue by shrinking the remaining router-handler and activation caller families toward the same event-definition seam.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 14/14; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event continuation contract narrowing|story source event continuation convergence|story choice event continuation convergence|scene runner start event convergence|scene runner scene-end continuation convergence|scene dialogue runtime continuation route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 433/433; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing \`docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md\` missing the required top-level title heading.`
- Notes: `This child stayed inside application/runtime continuation helpers, focused tests, and governance docs. No src/main.ts, UI, map, backpack, style, or script-editor boundary files changed, and docs/superpowers/project-progress.md remains intentionally unrelated and unsynced.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next runtime-only child for event continuation contract narrowing after the scene/dialogue runtime wrappers were moved onto the shared continuation seam.`
  - Verification: `git status --short --branch; sed -n '1,220p' src/application/events/event-continuation.ts; sed -n '1,260p' src/application/story/story-runtime.ts; sed -n '1,260p' src/application/scene/scene-runner.ts; sed -n '1,220p' src/application/scene/choice-resolver.ts; rg -n "continueToEvent|resolveEventContinuation|startEvent\\(" src/application tests.`
  - Next: `Add RED coverage for pure resolution without state mutation, then extract the helper and migrate ownerized callers.`
- 2026-07-30
  - Summary: `Completed the event continuation contract narrowing child as a verified completed-but-open checkpoint. resolveEventContinuation(...) now owns target lookup plus visited-id tracking without state mutation, continueToEvent(...) is reduced to a compatibility wrapper, and story/scene runtime callers now consume the pure event-definition seam directly.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event continuation contract narrowing|story source event continuation convergence|story choice event continuation convergence|scene runner start event convergence|scene runner scene-end continuation convergence|scene dialogue runtime continuation route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
  - Next: `Commit/push this checkpoint, then continue with the next narrower router-handler or activation caller-family convergence slice.`

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-scene-dialogue-runtime-continuation-route-convergence-plan.md`
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
  - The pushed scene/dialogue runtime continuation checkpoint is `f4b8337`.
  - The next uncovered continuation seam is the mixed resolution-plus-start contract in `continueToEvent(...)`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- extract a pure `resolveEventContinuation(...)` helper from `continueToEvent(...)`
- migrate ownerized story/scene continuation callers onto the pure event-definition seam
- keep generic fallback behavior by retaining `continueToEvent(...)` as a compatibility wrapper
- add focused tests proving pure resolution does not mutate state
- sync this child plan and the parent handoff with the new checkpoint

### Still Out Of Scope

- deleting `continueToEvent(...)`
- broad runtime-router contract rewrites
- `src/main.ts`, UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/events/event-continuation.ts`
  - Extract the pure resolution seam and preserve the legacy wrapper.
- `src/application/story/story-runtime.ts`
  - Consume the pure continuation helper in runtime-owned continuation paths.
- `src/application/scene/scene-runner.ts`
  - Consume the pure continuation helper while keeping the explicit local fallback.
- `src/application/scene/choice-resolver.ts`
  - Consume the pure continuation helper for choice-driven next-event routing.
- `tests/event-continuation-runtime.test.cjs`
  - Add behavior coverage for pure resolution.
- `tests/robustness.test.cjs`
  - Guard the new seam split and updated scene-runner ownership.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-event-continuation-contract-narrowing-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `docs/superpowers/plans/2026-07-30-event-continuation-contract-narrowing-plan.md`
  - Record this child and its exact closeout checkpoint.

## Verification Plan

- Targeted verification:
  - pure continuation resolution returns the target event without mutating state
  - story and scene ownerized continuation paths consume the pure helper
  - the generic compatibility wrapper still owns local `startEvent(...)`
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event continuation contract narrowing|story source event continuation convergence|story choice event continuation convergence|scene runner start event convergence|scene runner scene-end continuation convergence|scene dialogue runtime continuation route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Mixed Continuation Contract

**Files:**
- Read: `src/application/events/event-continuation.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/scene/scene-runner.ts`
- Read: `src/application/scene/choice-resolver.ts`
- Modify: `docs/superpowers/plans/2026-07-30-event-continuation-contract-narrowing-plan.md`

- [x] **Step 1: Record the remaining mixed seam**

Run:

```bash
git status --short --branch
sed -n '1,220p' src/application/events/event-continuation.ts
sed -n '1,260p' src/application/story/story-runtime.ts
sed -n '1,260p' src/application/scene/scene-runner.ts
sed -n '1,220p' src/application/scene/choice-resolver.ts
rg -n "continueToEvent|startEvent\\(|continueFromSceneEvent|routeStoryDirectEntry" src/application tests
```

Expected:

- identify that `continueToEvent(...)` still mixes target lookup with local state mutation
- confirm story/scene runtime callers can consume a pure event-definition seam
- keep compatibility for any untouched fallback callers

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included seam: extract pure resolution plus migrate ownerized callers
- excluded work: deleting `continueToEvent(...)` or widening runtime-router contracts
- focused tests that can prove pure-resolution behavior and caller-family convergence

## Task 2: Add Focused RED Coverage For Pure Resolution

**Files:**
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add failing behavior coverage for non-mutating resolution**

Add RED coverage that proves the helper can return the next event definition and visited-id tracker without mutating scene state.

- [x] **Step 2: Add failing source-level ownership assertions**

Add a robustness assertion that requires `resolveEventContinuation(...)` to stay pure and the compatibility wrapper to remain the only local `startEvent(...)` holder in `event-continuation.ts`.

## Task 3: Implement Pure Resolution And Migrate Ownerized Callers

**Files:**
- Modify: `src/application/events/event-continuation.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/application/scene/scene-runner.ts`
- Modify: `src/application/scene/choice-resolver.ts`

- [x] **Step 1: Extract the pure helper**

Implement `resolveEventContinuation(...)` so event lookup and visited-id tracking are available without state mutation.

- [x] **Step 2: Keep compatibility in the wrapper**

Retain `continueToEvent(...)` as a compatibility wrapper that simply resolves then locally `startEvent(...)`.

- [x] **Step 3: Migrate ownerized callers**

Teach story-runtime, scene-runner, and choice-resolver to consume the pure helper directly while preserving explicit local fallback behavior where still required.

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-event-continuation-contract-narrowing-plan.md`

- [x] **Step 1: Run the required verification commands**
- [x] **Step 2: Record the new checkpoint**

## Exit Check

- [x] `resolveEventContinuation(...)` is pure and returns event-definition continuation data without mutating state.
- [x] `continueToEvent(...)` remains available as a compatibility wrapper.
- [x] Story and scene ownerized continuation callers consume the pure helper directly.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
