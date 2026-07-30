# Event Entity Emit Event Ids Propagation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Propagate authored `emitEventIds` through the runtime event-entity projection seams so canonical runtime entities can preserve multi-follow-up event intent from `EventDefinition`.

**Architecture:** The runtime event router and event chain already understand `emitEventIds`, but the authored `EventDefinition` shape and several runtime entity projection helpers still only preserve `nextEventId`. This child keeps scope narrow: add `emitEventIds` to the authored event definition and repoint the current runtime projections so authored multi-follow-up intent is not lost before routing.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Authored EventDefinition multi-follow-up intent now survives the live event-entity projection layer because the current event/story/binding/navigation/scene runtime seams preserve emitEventIds.`
- Next Step: `Commit/push this child, then continue with the next runtime-only event-system migration slice.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 11/11; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event entity emit event ids propagation|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 453/453; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child keeps behavior runtime-only and does not touch src/main.ts, UI, map, backpack, or styles. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only event-system child after settlement-emitter rename. Audit found RuntimeEventEntity already supports emitEventIds, but authored EventDefinition and the current event/story/navigation/binding/scene projection helpers still only preserve nextEventId.`
  - Verification: `sed -n '1,260p' src/domain/event.ts`; `rg -n "emitEventIds|nextEventId" src/application/story/story-runtime.ts src/core/runtime/event-runtime.ts src/core/runtime/event-binding-runtime.ts src/core/runtime/navigation-runtime.ts src/core/runtime/scene-runtime.ts tests/event-router-runtime.test.cjs tests/robustness.test.cjs`.`
  - Next: `Add RED coverage that forces emitEventIds through the authored event definition and projection seams.`
- 2026-07-30
  - Summary: `Added RED guards for authored multi-follow-up projection, then added emitEventIds to EventDefinition and preserved it through the current story/event/binding/navigation/scene runtime event-entity seams so authored multi-follow-up intent is no longer dropped before routing.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 11/11; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event entity emit event ids propagation|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 453/453; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then continue with the next runtime-only event-system migration slice.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-settlement-emitter-rename-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `38fe286`, which renamed `EffectEmitter` to `SettlementEmitter`.
  - Audit now shows `RuntimeEventEntity` already supports `emitEventIds`, but the authored event model and live event projection seams still drop that field.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- add `emitEventIds` to `EventDefinition`
- preserve `emitEventIds` in the current runtime event-entity projection helpers
- add focused runtime tests and robustness guards
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- broader script-editor schema rewrites
- production event-chain caller rewiring
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/domain/event.ts`
  - Add authored `emitEventIds`.
- `src/application/story/story-runtime.ts`
  - Preserve authored `emitEventIds` in story event projection.
- `src/core/runtime/event-runtime.ts`
  - Preserve authored `emitEventIds` in trigger-event projection.
- `src/core/runtime/event-binding-runtime.ts`
  - Preserve authored `emitEventIds` in binding-selected event projection.
- `src/core/runtime/navigation-runtime.ts`
  - Preserve authored `emitEventIds` in enter-house event projection.
- `src/core/runtime/scene-runtime.ts`
  - Preserve authored `emitEventIds` in scene continuation event projection.
- `tests/event-router-runtime.test.cjs`
  - Add focused projection/runtime coverage.
- `tests/robustness.test.cjs`
  - Guard the live projection seams.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-event-entity-emit-event-ids-propagation-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - authored `EventDefinition` accepts `emitEventIds`
  - live runtime event projections preserve `emitEventIds`
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event entity emit event ids propagation|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Missing Authored Multi-Follow-Up Projection

**Files:**
- Read: `src/domain/event.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/core/runtime/event-runtime.ts`
- Read: `src/core/runtime/event-binding-runtime.ts`
- Read: `src/core/runtime/navigation-runtime.ts`
- Read: `src/core/runtime/scene-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-30-event-entity-emit-event-ids-propagation-plan.md`

- [x] **Step 1: Record the missing authored field**

Document that authored `EventDefinition` and current runtime projections still drop `emitEventIds`.

- [x] **Step 2: Lock the child boundary**

Document that this child only preserves authored multi-follow-up intent through runtime entity projection seams.

## Task 2: Add RED Coverage For Emit Event Ids Projection

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing projection guards**

Cover:

- `EventDefinition` accepts `emitEventIds`
- runtime event projection helpers preserve `emitEventIds`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs --test-name-pattern "emit event ids"
```

Expected:

- the new guard fails before implementation

## Task 3: Preserve Authored Emit Event Ids In Runtime Event Projections

**Files:**
- Modify: `src/domain/event.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/core/runtime/event-runtime.ts`
- Modify: `src/core/runtime/event-binding-runtime.ts`
- Modify: `src/core/runtime/navigation-runtime.ts`
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-event-entity-emit-event-ids-propagation-plan.md`

- [x] **Step 1: Preserve emitEventIds through the runtime event-entity seams**

Keep the slice projection-only and do not widen it into caller rewiring.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] Authored `EventDefinition` accepts `emitEventIds`.
- [x] Live runtime event projection seams preserve `emitEventIds`.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Event Entity Emit Event Ids Propagation`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-event-entity-emit-event-ids-propagation`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-event-entity-emit-event-ids-propagation-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, continue with the next runtime-only event-system migration slice and keep the follow-up focused on canonical event routing rather than shell rewiring.`
