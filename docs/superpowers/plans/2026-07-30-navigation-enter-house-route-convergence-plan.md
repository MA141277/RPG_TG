# Navigation Enter House Route Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge `navigation.enter-house` on-enter event activation onto the shared `event-router` seam so `application/navigation/enter-house.ts` no longer starts house entry events directly.

**Architecture:** The previous children converged `event-runtime` trigger activation and `event-binding-runtime` binding activation onto `dispatchEventRoute(...)` while preserving their existing outward seams. This child applies the same rule to the remaining navigation-owned direct-start path: `enterHouse(...)` becomes state-only house entry, and `navigation-runtime` becomes the narrow owner that routes `houseDefinition.onEnterEventId` through the canonical event-router seam before returning the existing navigation result.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `navigation.enter-house now keeps enterHouse(...) state-only and routes houseDefinition.onEnterEventId through routeHouseEnterEvent(...) -> dispatchEventRoute(...) inside navigation-runtime, while preserving the existing navigation result shape and blocked-access behavior.`
- Next Step: `Promote this verified checkpoint into branch history, then decide whether the next narrow runtime-only convergence slice should target event-continuation.ts, story-runtime's remaining direct-start helpers, or another isolated caller family.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "navigation enter-house convergence|event binding runtime route convergence|event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 430/430; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
- Notes: `This child stayed inside src/application/navigation/enter-house.ts, src/core/runtime/navigation-runtime.ts, focused tests, and governance docs. docs/superpowers/project-progress.md remains intentionally unrelated and unsynced.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next runtime-only child for navigation enter-house route convergence after pushing the event-binding runtime checkpoint.`
  - Verification: `git status --short --branch; sed -n '1,220p' src/application/navigation/enter-house.ts; sed -n '1,220p' src/core/runtime/navigation-runtime.ts; sed -n '1,220p' tests/navigation-runtime-access.test.cjs; rg -n "enterHouse\\(|navigation.enter-house|onEnterEventId|startEvent\\(|dispatchEventRoute\\(" src tests.`
  - Next: `Add RED tests plus source-level assertions for router-first house on-enter activation without widening into main.ts or unrelated navigation callers.`
- 2026-07-30
  - Summary: `Completed the navigation enter-house route convergence child as a verified completed-but-open checkpoint. enterHouse(...) is now state-only, navigation-runtime owns house on-enter event routing through dispatchEventRoute(...), and the new behavior test proves the shared event-router seam is exercised for house entry events.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "navigation enter-house convergence|event binding runtime route convergence|event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
  - Next: `Commit/push this navigation enter-house checkpoint, then choose the next remaining direct-start caller family.`

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-binding-runtime-route-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The pushed event-binding route checkpoint is `193741c`.
  - The active uncovered direct-start caller family is `navigation.enter-house`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- make `enterHouse(...)` state-only
- route `houseDefinition.onEnterEventId` through `dispatchEventRoute(...)` inside `navigation-runtime`
- add focused RED/GREEN coverage for router-first house entry activation
- preserve current navigation runtime outward result shape
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- `src/main.ts`
- broader navigation follow-up refactors beyond `navigation.enter-house`
- UI, map, backpack, style, or script-editor package changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/application/navigation/enter-house.ts`
  - Keep house entry state-only.
- `src/core/runtime/navigation-runtime.ts`
  - Route `onEnterEventId` through `dispatchEventRoute(...)` while preserving the existing navigation result.
- `tests/navigation-runtime-access.test.cjs`
  - Add RED/GREEN coverage for router-first house entry activation.
- `tests/robustness.test.cjs`
  - Add or update source-level assertions so `enter-house` cannot regress to local event start ownership.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and latest verified resume point.
- `docs/superpowers/plans/2026-07-30-navigation-enter-house-route-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `navigation.enter-house` routes `onEnterEventId` through `dispatchEventRoute(...)`
  - `enterHouse(...)` remains a state-only house entry helper
  - blocked house access behavior remains unchanged
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "navigation enter-house convergence|event binding runtime route convergence|event trigger runtime route convergence|child 33 event runtime task input contract stays canonical-first|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Navigation Enter-House Ownership

**Files:**
- Read: `src/application/navigation/enter-house.ts`
- Read: `src/core/runtime/navigation-runtime.ts`
- Read: `tests/navigation-runtime-access.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-navigation-enter-house-route-convergence-plan.md`

- [x] **Step 1: Record the exact direct-start seam**

Run:

```bash
git status --short --branch
sed -n '1,220p' src/application/navigation/enter-house.ts
sed -n '1,220p' src/core/runtime/navigation-runtime.ts
sed -n '1,220p' tests/navigation-runtime-access.test.cjs
rg -n "enterHouse\(|navigation.enter-house|onEnterEventId|startEvent\(|dispatchEventRoute\(" src tests
```

Expected:

- identify exactly where `enterHouse(...)` still starts the house on-enter event directly
- confirm `navigation-runtime` is the only caller family
- confirm current tests that can prove router-first activation before and after the change

- [x] **Step 2: Lock the child scope after the audit**

Document:

- included caller family: `navigation.enter-house`
- excluded work: `src/main.ts` and broader navigation follow-up rewiring
- current tests that can prove router-first house entry activation before and after the change

## Task 2: Add Focused RED Coverage For Router-First House Entry Activation

**Files:**
- Modify: `tests/navigation-runtime-access.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing behavior test for navigation.enter-house**

Add RED coverage that monkey-patches `dispatchEventRoute(...)` and proves `navigation.enter-house` still bypasses the shared event-router seam before implementation.

- [x] **Step 2: Add a failing source-level ownership assertion**

Add a robustness assertion that requires `navigation-runtime` to route house on-enter activation through `dispatchEventRoute(...)` and rejects `startEvent(...)` ownership inside `enterHouse(...)`.

## Task 3: Implement Navigation Enter-House Route Convergence

**Files:**
- Modify: `src/application/navigation/enter-house.ts`
- Modify: `src/core/runtime/navigation-runtime.ts`

- [x] **Step 1: Make enterHouse(...) state-only**

Keep the helper responsible only for house entry state.

- [x] **Step 2: Route on-enter event activation through the canonical event-router seam**

Implement the thinnest change that:

- preserves the existing navigation result shape
- routes `houseDefinition.onEnterEventId` through `dispatchEventRoute(...)`
- keeps blocked access behavior unchanged

## Task 4: Verify And Sync Governance State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-navigation-enter-house-route-convergence-plan.md`

- [x] **Step 1: Run the required verification commands**
- [x] **Step 2: Record the new checkpoint**

## Exit Check

- [x] `navigation.enter-house` no longer owns direct house on-enter event activation.
- [x] `enterHouse(...)` is state-only.
- [x] blocked house access behavior remains unchanged.
