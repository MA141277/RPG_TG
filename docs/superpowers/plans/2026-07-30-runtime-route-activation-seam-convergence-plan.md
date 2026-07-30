# Runtime Route Activation Seam Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the duplicated runtime route activation handlers in `event-runtime`, `event-binding-runtime`, `navigation-runtime`, and `scene-runtime` onto one shared activation seam so routed event entities always cross the same final bridge into `startEvent(...)`.

**Architecture:** The recent children already moved direct-start caller families onto router-first seams and narrowed generic event continuation into a pure lookup helper. The next duplication is inside the owner runtimes themselves: each runtime rebuilds identical `dialogue` and `settlement` handlers that only resolve an `EventDefinition` and call `startEvent(...)`. This child extracts that activation logic into a shared helper under `src/core/runtime`, then points the four owner runtimes at the same handler factory without changing route semantics.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `src/core/runtime/event-route-activation.ts now owns the shared routed-event activation handlers, and event-runtime, event-binding-runtime, navigation-runtime, and scene-runtime all reuse that one seam instead of rebuilding inline dialogue/settlement startEvent(...) handlers.`
- Next Step: `Promote this verified checkpoint into branch history, then continue shrinking the remaining explicit local startEvent fallback sites toward the same single activation seam.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 8/8; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime route activation seam convergence|event trigger runtime route convergence|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|event continuation contract narrowing|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 434/434; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing \`docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md\` missing the required top-level title heading.`
- Notes: `This child stays inside core runtime routing seams, focused tests, and governance docs. src/main.ts, UI, map, backpack, style, and script-editor paths remain out of scope.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next runtime-only child for route activation seam convergence after the event continuation contract was narrowed behind resolveEventContinuation(...).`
  - Verification: `rg -n "startEvent\\(" src/application src/core; sed -n '90,180p' src/core/runtime/event-runtime.ts; sed -n '120,180p' src/core/runtime/event-binding-runtime.ts; sed -n '190,245p' src/core/runtime/navigation-runtime.ts; sed -n '80,135p' src/core/runtime/scene-runtime.ts.`
  - Next: `Add RED coverage for a shared activation-handler seam, then replace the duplicated runtime-owned handlers with one helper.`
- 2026-07-30
  - Summary: `Completed the runtime route activation seam convergence child as a verified completed-but-open checkpoint. A new core helper, createEventRouteActivationHandlers(...), now owns the shared routed-event activation path, and the four owner runtimes consume it instead of duplicating inline dialogue/settlement handlers.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime route activation seam convergence|event trigger runtime route convergence|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|event continuation contract narrowing|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing \`docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md\` missing the required top-level title heading.`
  - Next: `Commit/push this checkpoint, then continue with the next narrower explicit local startEvent fallback family.`

## Based On Spec

- Primary spec:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-30-event-continuation-contract-narrowing-plan.md`
  - `docs/superpowers/plans/2026-07-30-scene-dialogue-runtime-continuation-route-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The freshly pushed event continuation checkpoint is `3c44795`.
  - The next uncovered duplication seam is runtime-owned event activation after `dispatchEventRoute(...)` resolves an event entity.

## Implementation Scope

### In Scope

- add a shared helper for route activation handlers in `src/core/runtime`
- migrate `event-runtime`, `event-binding-runtime`, `navigation-runtime`, and `scene-runtime` to that helper
- add focused behavior and source-level guards for the shared activation seam
- sync this child plan and the parent handoff with the new checkpoint

### Still Out Of Scope

- changing story-runtime activation semantics
- deleting `startEvent(...)`
- widening `dispatchEventRoute(...)` contracts
- `src/main.ts`, UI, map, backpack, style, or script-editor changes

## File Map

### Existing files to modify

- `src/core/runtime/event-runtime.ts`
  - Replace duplicated routed-event activation handlers with the shared helper.
- `src/core/runtime/event-binding-runtime.ts`
  - Replace duplicated routed-event activation handlers with the shared helper.
- `src/core/runtime/navigation-runtime.ts`
  - Replace duplicated routed-event activation handlers with the shared helper.
- `src/core/runtime/scene-runtime.ts`
  - Replace duplicated routed-event activation handlers with the shared helper.
- `tests/event-router-runtime.test.cjs`
  - Add behavior coverage for the shared activation helper seam.
- `tests/robustness.test.cjs`
  - Guard the new helper and the four owner-runtime imports.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the active child pointer and verification checkpoint.
- `docs/superpowers/plans/2026-07-30-runtime-route-activation-seam-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `src/core/runtime/event-route-activation.ts`
  - Host the single routed-event activation helper.

## Verification Plan

- Targeted verification:
  - routed event activation handlers are shared across runtime owners
  - event-runtime, event-binding-runtime, navigation-runtime, and scene-runtime keep current behavior while dropping inline activation duplication
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime route activation seam convergence|event trigger runtime route convergence|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|event continuation contract narrowing|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Exit Check

- [x] `src/core/runtime/event-route-activation.ts` owns the shared routed-event activation seam.
- [x] `event-runtime`, `event-binding-runtime`, `navigation-runtime`, and `scene-runtime` reuse that seam.
- [x] Inline duplicated dialogue/settlement `startEvent(...)` handlers are removed from those owner runtimes.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
