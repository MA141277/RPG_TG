# Runtime Event Entity Payload Projection Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize authored event -> `RuntimeEventEntity` projection and preserve runtime-relevant authored payload instead of emitting empty payload shells.

**Architecture:** The current branch still hand-builds five near-identical runtime event entities across story/event/binding/navigation/scene seams, and all of them emit `payload: {}`. This child keeps scope narrow: add one shared projection seam in `src/core/runtime`, preserve runtime-relevant authored payload fields on the entity, and repoint the five current callers without changing routing ownership.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `RuntimeEventEntity now preserves authored runtime payload through one shared projection seam in src/core/runtime/event-entity-projection.ts, and the live story/event/binding/navigation/scene wrappers no longer emit payload: {} shells.`
- Next Step: `Commit/push this child, then continue with the next runtime-only event-system migration slice toward canonical routed event payload ownership.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event entity payload projection|event router runtime core|event entity emit event ids propagation|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 454/454; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child keeps routing ownership unchanged and does not touch src/main.ts, UI, map, backpack, or styles. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only event-system child after authored emitEventIds propagation. Audit found story/event/binding/navigation/scene still hand-build RuntimeEventEntity with payload: {}, so authored runtime payload is dropped before routing and the projection seam remains duplicated.`
  - Verification: `sed -n '1,260p' docs/main-shell-contract.md`; `rg -n "payload:\\s*\\{\\}|to.*RuntimeEventEntity|RuntimeEventEntity" src/application/story/story-runtime.ts src/core/runtime/*.ts`; `sed -n '1,220p' src/core/runtime/event-router.ts`.`
  - Next: `Add RED coverage that forces one shared projection seam and a non-empty authored payload projection.`
- 2026-07-30
  - Summary: `Added RED guards for authored runtime payload projection, then centralized authored event -> RuntimeEventEntity projection in src/core/runtime/event-entity-projection.ts and repointed the live story/event/binding/navigation/scene wrappers so payload no longer collapses to {} before routing.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 12/12; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event entity payload projection|event router runtime core|event entity emit event ids propagation|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 454/454; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then continue with the next runtime-only event-system migration slice.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-event-entity-emit-event-ids-propagation-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `025a72d`, which propagated authored `emitEventIds` through current runtime event projections.
  - Audit now shows the next foundational gap is the duplicated authored event projection seam and its empty `payload: {}` shells.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- add one shared authored event -> `RuntimeEventEntity` projection seam
- preserve runtime-relevant authored payload on the entity
- repoint story/event/binding/navigation/scene seams
- add focused runtime tests and robustness guards
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- changing routing ownership to new event kinds
- shell/UI rewiring
- script-editor schema rewrites
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/application/story/story-runtime.ts`
  - Consume the shared projection seam.
- `src/core/runtime/event-runtime.ts`
  - Consume the shared projection seam.
- `src/core/runtime/event-binding-runtime.ts`
  - Consume the shared projection seam.
- `src/core/runtime/navigation-runtime.ts`
  - Consume the shared projection seam.
- `src/core/runtime/scene-runtime.ts`
  - Consume the shared projection seam.
- `tests/event-router-runtime.test.cjs`
  - Add focused projection/runtime coverage.
- `tests/robustness.test.cjs`
  - Guard the seam centralization and authored payload projection.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-event-entity-payload-projection-plan.md`
  - This child plan.

### New files to create

- `src/core/runtime/event-entity-projection.ts`
  - Shared authored event -> runtime event entity seam.

## Verification Plan

- Targeted verification:
  - one shared projection seam exists
  - live authored projections no longer emit `payload: {}`
  - runtime event entity carries authored runtime payload
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event entity payload projection|event router runtime core|event entity emit event ids propagation|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Duplicated Empty-Payload Projection Seam

**Files:**
- Read: `src/application/story/story-runtime.ts`
- Read: `src/core/runtime/event-runtime.ts`
- Read: `src/core/runtime/event-binding-runtime.ts`
- Read: `src/core/runtime/navigation-runtime.ts`
- Read: `src/core/runtime/scene-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-entity-payload-projection-plan.md`

- [x] **Step 1: Record the duplication and payload loss**

Document that five live projections still hand-build the entity and emit `payload: {}`.

- [x] **Step 2: Lock the child boundary**

Document that this child centralizes projection and preserves payload only; it does not change routing ownership.

## Task 2: Add RED Coverage For Shared Payload Projection

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing projection guards**

Cover:

- a shared runtime event-entity projection seam exists
- live authored projections no longer keep `payload: {}`
- runtime event entity preserves authored payload

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs --test-name-pattern "payload projection"
```

Expected:

- the new guard fails before implementation

## Task 3: Centralize Runtime Event Entity Projection

**Files:**
- Create: `src/core/runtime/event-entity-projection.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/core/runtime/event-runtime.ts`
- Modify: `src/core/runtime/event-binding-runtime.ts`
- Modify: `src/core/runtime/navigation-runtime.ts`
- Modify: `src/core/runtime/scene-runtime.ts`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-entity-payload-projection-plan.md`

- [x] **Step 1: Add one shared authored event projection seam**

Keep routing ownership unchanged and preserve authored runtime payload on the runtime entity.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] One shared authored event -> `RuntimeEventEntity` projection seam exists.
- [x] Live authored projections no longer emit `payload: {}`.
- [x] Runtime event entity preserves authored runtime payload.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Event Entity Payload Projection`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-runtime-event-entity-payload-projection`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-event-entity-payload-projection-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, continue with the next runtime-only event-system migration slice and keep follow-up work focused on canonical routed event ownership rather than shell rewiring.`
