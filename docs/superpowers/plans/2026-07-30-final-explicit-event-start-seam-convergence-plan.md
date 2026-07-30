# Final Explicit Event Start Seam Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the remaining explicit local event-start convergence so owner-side story direct entry and non-owner scene fallbacks both collapse onto the already-established shared seams.

**Architecture:** After the previous two children, explicit `startEvent(...)` calls are already concentrated into `event-route-activation.ts` and `event-continuation.ts`, but two caller families still bypass those seams: story direct-entry activation inside `story-runtime`, and local non-owner scene/choice fallbacks inside `scene-runner` and `choice-resolver`. This child removes those last caller-specific starts by reusing `createEventRouteActivationHandlers(...)` for story direct entry and `continueToEvent(...)` for scene/choice local fallback continuation.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Explicit local event starts are now fully converged: story direct entry reuses createEventRouteActivationHandlers(...), and scene-runner plus choice-resolver local non-owner fallbacks now reuse continueToEvent(...).`
- Next Step: `Promote this verified checkpoint into branch history, then treat subsequent work as the next event-system plan rather than more leftover explicit-start cleanup.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 9/9; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs` passed 16/16; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs` passed 3/3; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs` passed 4/4; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story runtime activation seam convergence|scene fallback continuation seam convergence|runtime route activation seam convergence|event continuation contract narrowing|scene dialogue runtime continuation route convergence|event trigger runtime route convergence|event binding runtime route convergence|navigation enter-house convergence|scene runner start event convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 436/436; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing \`docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md\` missing the required top-level title heading.`
- Notes: `This child stays inside application/core runtime seams, focused tests, and governance docs. src/main.ts, UI, map, backpack, style, and script-editor paths remain out of scope.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the final explicit event-start cleanup child after route activation and continuation seams had already been centralized.`
  - Verification: `rg -n "startEvent\\(" src/application src/core; sed -n '120,260p' src/application/story/story-runtime.ts; sed -n '150,330p' src/application/scene/scene-runner.ts; sed -n '1,120p' src/application/scene/choice-resolver.ts.`
  - Next: `Add RED coverage for story direct-entry activation plus scene/choice fallback continuation, then migrate those callers onto the shared seams.`
- 2026-07-30
  - Summary: `Completed the final explicit event-start convergence child as a verified completed-but-open checkpoint. Only the shared seams now call startEvent(...): createEventRouteActivationHandlers(...) for routed activation and continueToEvent(...) for local compatibility continuation.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-continuation-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/navigation-runtime-access.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/dialogue-runtime-compatibility.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story runtime activation seam convergence|scene fallback continuation seam convergence|runtime route activation seam convergence|event continuation contract narrowing|scene dialogue runtime continuation route convergence|event trigger runtime route convergence|event binding runtime route convergence|navigation enter-house convergence|scene runner start event convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing \`docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md\` missing the required top-level title heading.`
  - Next: `Commit/push this checkpoint, then move on to the next event-system plan.`

## Task 1: Converge Story Direct-Entry Activation

**Files:**
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/core/runtime/event-route-activation.ts`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add RED coverage for story direct-entry activation seam**
- [x] **Step 2: Reuse shared activation handlers in story-runtime**
- [x] **Step 3: Verify story direct-entry behavior and ownership guards**

## Task 2: Converge Scene And Choice Local Fallback Continuation

**Files:**
- Modify: `src/application/scene/scene-runner.ts`
- Modify: `src/application/scene/choice-resolver.ts`
- Modify: `tests/event-continuation-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add RED coverage for non-owner fallback continuation seam reuse**
- [x] **Step 2: Route local fallback continuation through continueToEvent(...)**
- [x] **Step 3: Verify fallback behavior and ownership guards**

## Exit Check

- [x] Story direct-entry no longer keeps a caller-specific local `startEvent(...)` path.
- [x] Scene-runner local non-owner fallback no longer keeps a caller-specific local `startEvent(...)` path.
- [x] Choice-resolver local non-owner fallback no longer keeps a caller-specific local `startEvent(...)` path.
- [x] Only shared seams now call `startEvent(...)` in production code.
