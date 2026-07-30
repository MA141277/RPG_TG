# Runtime Event Action Payload Application Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move story-runtime direct-entry action application onto `RuntimeEventEntity.payload.actions` so routed pre-start actions use the same shared payload seam as routed task inputs.

**Architecture:** The previous child moved routed `taskInputs` onto `RuntimeEventEntity.payload`, but story-runtime direct-entry still applies pre-start actions from `eventDefinition.actions` through `prepareCoreState`. This child stays narrow: add one canonical action reader for runtime event payload, repoint story-runtime's routed pre-start action application to it, and keep event-binding preselection/state-only ownership unchanged.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Story-runtime direct-entry pre-start handling now consumes canonical routed actions from RuntimeEventEntity.payload.actions through one shared helper, so the routed action seam no longer falls back to eventDefinition.actions.`
- Next Step: `Commit/push this child, then continue with the next runtime-only event-system migration slice toward payload-owned routed metadata and activation semantics.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 14/14; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"` passed 456/456; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stays runtime-only, does not change binding preselection/state-only ownership, and does not touch src/main.ts, UI, map, backpack, or styles. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only child after routed taskInputs payload consumption. Audit found story-runtime direct-entry still applies pre-start actions through applyEventRuntimeActions(coreState, eventDefinition), even though payload.actions is already authored and preserved on RuntimeEventEntity.`
  - Verification: `rg -n "applyEventRuntimeActions\\(|eventDefinition\\.actions|payload\\.actions|readRuntimeEventActions" src/application/story/story-runtime.ts src/core/runtime/event-binding-runtime.ts src/core/runtime/event-entity-projection.ts tests/event-router-runtime.test.cjs tests/robustness.test.cjs`; `sed -n '120,160p' src/application/story/story-runtime.ts`; `sed -n '160,230p' src/core/runtime/event-binding-runtime.ts`; `sed -n '1,220p' src/core/runtime/event-entity-projection.ts`.`
  - Next: `Add RED coverage for payload-owned routed action application.`
- 2026-07-30
  - Summary: `Added RED guards for payload-owned routed action application, then added readRuntimeEventActions(...) to the shared event-entity seam, exposed applyRuntimeActions(...) as the narrow concrete reducer helper, and repointed story-runtime direct-entry prepareCoreState to consume payload.actions instead of eventDefinition.actions.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override:/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 14/14; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"` passed 456/456; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit/push this child, then continue with the next runtime-only event-system migration slice.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-event-task-input-payload-consumption-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `af14064`, which moved routed story taskInputs onto payload ownership.
  - Audit now shows the next smallest routed-payload gap is direct-entry pre-start action application in story-runtime.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- add one canonical action reader for runtime event payload
- use that reader on story-runtime direct-entry pre-start action application
- add focused runtime tests and robustness guards
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- changing event-binding preselection logic
- moving state-only action detection to payload ownership
- broader dialogueId/settlementId payload rewrites
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/event-entity-projection.ts`
  - Add a routed action payload reader.
- `src/core/runtime/event-binding-runtime.ts`
  - Expose a small action-application helper usable by the routed seam.
- `src/application/story/story-runtime.ts`
  - Consume payload-owned actions in direct-entry pre-start handling.
- `tests/event-router-runtime.test.cjs`
  - Add focused helper/runtime coverage.
- `tests/robustness.test.cjs`
  - Guard story-runtime off authored actions in the routed direct-entry path.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-event-action-payload-application-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - one canonical helper reads routed actions from `RuntimeEventEntity.payload`
  - story-runtime direct-entry applies payload-owned routed actions
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|event binding runtime route convergence|navigation enter-house convergence|scene dialogue runtime continuation route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Routed Action Re-Read

**Files:**
- Read: `src/application/story/story-runtime.ts`
- Read: `src/core/runtime/event-binding-runtime.ts`
- Read: `src/core/runtime/event-entity-projection.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-action-payload-application-plan.md`

- [x] **Step 1: Record the remaining routed action re-read**

Document that story-runtime direct-entry still applies routed actions from `eventDefinition.actions`.

- [x] **Step 2: Lock the child boundary**

Document that this child changes story-runtime routed pre-start action ownership only.

## Task 2: Add RED Coverage For Payload-Owned Routed Actions

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing payload-consumption guards**

Cover:

- a canonical helper reads actions from runtime event payload
- story-runtime direct-entry consumes payload-owned actions
- story-runtime direct-entry no longer applies actions from `eventDefinition.actions`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs --test-name-pattern "action payload"
```

Expected:

- the new guard fails before implementation

## Task 3: Apply Routed Actions From Runtime Event Payload

**Files:**
- Modify: `src/core/runtime/event-entity-projection.ts`
- Modify: `src/core/runtime/event-binding-runtime.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-action-payload-application-plan.md`

- [x] **Step 1: Add and consume the canonical routed action payload helper**

Keep event-binding preselection/state-only ownership unchanged and limit the slice to story-runtime direct-entry action application.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] One canonical helper reads routed actions from `RuntimeEventEntity.payload`.
- [x] Story-runtime direct-entry applies payload-owned routed actions.
- [x] Story-runtime direct-entry no longer applies `eventDefinition.actions` on the routed seam.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Event Action Payload Application`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-push-runtime-event-action-payload-application`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-event-action-payload-application-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `After commit/push, continue with the next runtime-only event-system migration slice and keep the follow-up focused on payload-owned routed semantics rather than shell rewiring.`
