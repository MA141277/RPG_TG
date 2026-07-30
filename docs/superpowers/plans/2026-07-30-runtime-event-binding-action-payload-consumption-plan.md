# Runtime Event Binding Action Payload Consumption Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move event-binding-runtime action application onto `RuntimeEventEntity.payload.actions` so binding-owned routed action application no longer rereads authored `eventDefinition.actions`.

**Architecture:** Earlier children moved story-runtime direct-entry action application, settlement continuation `settlementId`, and state-only dialogue-id classification onto shared runtime-event payload readers. The next smallest gap is `applyEventRuntimeActions(...)` in `event-binding-runtime`, which still applies actions from authored `eventDefinition.actions`. This child stays narrow: reuse the existing canonical runtime-event projection and shared `readRuntimeEventActions(...)`, repoint binding-owned action application to that seam, and keep event-router, state-only classification, and route activation ownership unchanged.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Event-binding-runtime action application now consumes RuntimeEventEntity.payload.actions through shared readRuntimeEventActions(...), so binding-owned action application no longer rereads authored eventDefinition.actions.`
- Next Step: `Commit and push this verified checkpoint, then continue the next runtime-only event-system migration slice.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event binding action payload consumption|runtime event dialogue id payload consumption|runtime event settlement id payload consumption|runtime event action payload application|event binding runtime route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 459/459; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stays runtime-only, preserves existing route/activation behavior, and does not touch src/main.ts, UI, map, backpack, or styles. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Completed the runtime-only binding-action payload child. event-binding-runtime now projects EventDefinition through createRuntimeEventEntity(...) and consumes readRuntimeEventActions(...) before applying runtime actions, so binding-owned action application no longer rereads authored eventDefinition.actions.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs` passed 5/5; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event binding action payload consumption|runtime event dialogue id payload consumption|runtime event settlement id payload consumption|runtime event action payload application|event binding runtime route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 459/459; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push this checkpoint, then continue the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Created the next runtime-only child after dialogue-id payload consumption. Audit found event-binding-runtime still applies actions through eventDefinition.actions inside applyEventRuntimeActions(...), even though action projection is already canonicalized on RuntimeEventEntity.payload.actions.`
  - Verification: `rg -n "applyEventRuntimeActions\\(|eventDefinition\\.actions|readRuntimeEventActions" src/core/runtime/event-binding-runtime.ts src/core/runtime/event-entity-projection.ts tests/event-binding-start-runtime.test.cjs tests/robustness.test.cjs`; `sed -n '160,230p' src/core/runtime/event-binding-runtime.ts`.`
  - Next: `Add RED coverage for payload-owned binding action application.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-event-action-payload-application-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-event-dialogue-id-payload-consumption-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `d43fcf2`, which moved state-only dialogue-id classification onto payload-owned metadata.
  - Audit now shows the next smallest routed metadata gap is binding-owned action application still rereading authored `actions`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- repoint `applyEventRuntimeActions(...)` onto projected runtime-event payload actions
- add focused runtime tests and robustness guards
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- changing route activation ownership
- changing state-only classification ownership
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/event-binding-runtime.ts`
  - Consume action payload via the shared projection seam.
- `tests/event-binding-start-runtime.test.cjs`
  - Add runtime coverage for payload-owned binding action application.
- `tests/robustness.test.cjs`
  - Guard binding action application onto the routed action payload seam.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-event-binding-action-payload-consumption-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - event-binding-runtime applies runtime actions from the shared payload action seam
  - binding-owned state-only/runtime routing behavior stays unchanged outside that seam
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event binding action payload consumption|runtime event dialogue id payload consumption|runtime event settlement id payload consumption|runtime event action payload application|event binding runtime route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Authored Action Re-Read

**Files:**
- Read: `src/core/runtime/event-binding-runtime.ts`
- Read: `src/core/runtime/event-entity-projection.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-binding-action-payload-consumption-plan.md`

- [x] **Step 1: Record the remaining authored action re-read**

Document that `applyEventRuntimeActions(...)` still reads `eventDefinition.actions`.

- [x] **Step 2: Lock the child boundary**

Document that this child changes binding-owned action application only and preserves route/classification behavior.

## Task 2: Add RED Coverage For Payload-Owned Binding Action Application

**Files:**
- Modify: `tests/event-binding-start-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing payload-consumption guards**

Cover:

- binding-owned action application can consume shared payload actions even when authored `eventDefinition.actions` is empty
- `applyEventRuntimeActions(...)` no longer applies actions from `eventDefinition.actions`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-binding-start-runtime.test.cjs --test-name-pattern "payload|action"
```

Expected:

- the new guard fails before implementation

## Task 3: Consume Payload-Owned Binding Actions

**Files:**
- Modify: `src/core/runtime/event-binding-runtime.ts`
- Modify: `tests/event-binding-start-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-binding-action-payload-consumption-plan.md`

- [x] **Step 1: Repoint binding-owned action application to the shared payload seam**

Keep route activation and classification ownership unchanged.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] Event-binding-runtime applies runtime actions from the shared payload action seam.
- [x] Binding-owned state-only/runtime routing behavior stays unchanged outside that seam.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Event Binding Action Payload Consumption`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-and-push-runtime-event-binding-action-payload-consumption`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-event-binding-action-payload-consumption-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Commit and push this verified checkpoint, then continue the next runtime-only event-system migration slice.`
