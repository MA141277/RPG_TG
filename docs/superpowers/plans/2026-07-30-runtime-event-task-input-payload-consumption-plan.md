# Runtime Event Task Input Payload Consumption Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move routed story-runtime task input consumption onto `RuntimeEventEntity.payload` so the newly centralized event-entity seam becomes the owner of canonical routed task inputs.

**Architecture:** The previous child centralized authored event -> `RuntimeEventEntity` projection and preserved `payload.taskInputs`, but the direct story-runtime route handlers still reread `eventDefinition.taskInputs`. This child keeps scope tight: add a small runtime helper for reading canonical routed task inputs from `RuntimeEventEntity.payload`, use it inside story-runtime's routed handler path, and leave activation ownership plus non-routed candidate selection unchanged.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Story-runtime routed handlers now consume canonical taskInputs from RuntimeEventEntity.payload through one shared helper in src/core/runtime/event-entity-projection.ts instead of rereading authored eventDefinition.taskInputs.`
- Next Step: `Commit/push this child, then continue with the next runtime-only event-system migration slice toward payload-owned routed event semantics.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"` passed 455/455; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stays runtime-only, does not change activation ownership, and does not touch src/main.ts, UI, map, backpack, or styles. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only child after runtime event payload projection. Audit found payload.taskInputs is now authored and preserved on RuntimeEventEntity, but story-runtime's routed dialogue/settlement handlers still read eventDefinition.taskInputs directly.`
  - Verification: `rg -n "taskInputs: eventDefinition\\.taskInputs|taskInputs:\\s*event\\.payload" src/application/story/story-runtime.ts src/core/runtime/event-entity-projection.ts tests/event-router-runtime.test.cjs tests/robustness.test.cjs`; `sed -n '150,220p' src/application/story/story-runtime.ts`; `sed -n '1,220p' src/core/runtime/event-entity-projection.ts`.`
  - Next: `Add RED coverage for payload-owned routed task input consumption.`
- 2026-07-30
  - Summary: `Added RED guards for payload-owned routed task inputs, then added readRuntimeEventTaskInputs(...) to the shared event-entity seam and repointed story-runtime's routed dialogue/settlement handlers so routed taskInputs now come from RuntimeEventEntity.payload rather than eventDefinition.taskInputs.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 13/13; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"` passed 455/455; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then continue with the next runtime-only event-system migration slice.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-event-entity-payload-projection-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `d21ce41`, which centralized authored event payload projection.
  - Audit now shows the next smallest routed-payload gap is story-runtime taskInputs still reading `eventDefinition.taskInputs`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- add a tiny runtime helper for canonical routed task-input payload reads
- use that helper in story-runtime routed handler output
- add focused runtime tests and robustness guards
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- changing event activation ownership
- changing event candidate selection inputs
- broader payload-field consumption rewrites
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/event-entity-projection.ts`
  - Add a routed task-input payload reader.
- `src/application/story/story-runtime.ts`
  - Consume routed task inputs from `RuntimeEventEntity.payload`.
- `tests/event-router-runtime.test.cjs`
  - Add focused helper/runtime coverage.
- `tests/robustness.test.cjs`
  - Guard story-runtime off authored `eventDefinition.taskInputs` in the routed path.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-event-task-input-payload-consumption-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - one canonical helper reads routed task inputs from `RuntimeEventEntity.payload`
  - story-runtime routed handlers consume payload-owned task inputs
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Routed Task Input Re-Read

**Files:**
- Read: `src/core/runtime/event-entity-projection.ts`
- Read: `src/application/story/story-runtime.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-task-input-payload-consumption-plan.md`

- [x] **Step 1: Record the remaining routed task-input re-read**

Document that routed story handlers still read `eventDefinition.taskInputs` after payload projection exists.

- [x] **Step 2: Lock the child boundary**

Document that this child changes routed task-input ownership only and does not widen into activation rewrites.

## Task 2: Add RED Coverage For Payload-Owned Routed Task Inputs

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing payload-consumption guards**

Cover:

- a canonical helper reads task inputs from runtime event payload
- story-runtime routed handlers consume the helper
- story-runtime routed handlers no longer emit `taskInputs: eventDefinition.taskInputs`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs --test-name-pattern "task input payload"
```

Expected:

- the new guard fails before implementation

## Task 3: Consume Routed Task Inputs From Runtime Event Payload

**Files:**
- Modify: `src/core/runtime/event-entity-projection.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-task-input-payload-consumption-plan.md`

- [x] **Step 1: Add and consume the canonical routed task-input payload helper**

Keep activation ownership unchanged and limit the slice to routed task input output.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] One canonical helper reads routed task inputs from `RuntimeEventEntity.payload`.
- [x] Story-runtime routed handlers consume payload-owned task inputs.
- [x] Story-runtime routed handlers no longer emit `taskInputs: eventDefinition.taskInputs`.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Event Task Input Payload Consumption`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-runtime-event-task-input-payload-consumption`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-event-task-input-payload-consumption-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, continue with the next runtime-only event-system migration slice and keep the follow-up focused on payload-owned routed semantics rather than shell rewiring.`
