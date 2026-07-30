# Event Runtime Candidate Task Input Payload Consumption Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move event-runtime candidate task-input projection onto `RuntimeEventEntity.payload.taskInputs` so candidate metadata no longer rereads authored `eventDefinition.taskInputs`.

**Architecture:** Earlier children moved story-runtime routed handlers, story direct-entry action application, story settlement continuation, state-only dialogue-id classification, and binding-owned action application onto shared runtime-event payload readers. The next smallest gap is `toEventRuntimeCandidate(...)` in `event-runtime`, which still copies task inputs from authored `eventDefinition.taskInputs`. This child stays narrow: reuse `createRuntimeEventEntity(...)` plus `readRuntimeEventTaskInputs(...)`, repoint candidate task-input projection to that seam, and leave route activation / scene-start ownership unchanged.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Event-runtime candidate taskInputs now consume RuntimeEventEntity.payload.taskInputs through shared readRuntimeEventTaskInputs(...), so candidate projection no longer rereads authored eventDefinition.taskInputs.`
- Next Step: `Commit and push this verified checkpoint, then continue the next runtime-only event-system migration slice.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 17/17; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event runtime candidate task input payload consumption|runtime event task input payload consumption|runtime event binding action payload consumption|runtime event action payload application|event router runtime core|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 460/460; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stays runtime-only, preserves candidate selection and route activation ownership, and does not touch src/main.ts, UI, map, backpack, or styles. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Completed the runtime-only event-runtime candidate task-input child. event-runtime now projects EventDefinition through createRuntimeEventEntity(...) and consumes readRuntimeEventTaskInputs(...) before building EventRuntimeCandidate.taskInputs, so candidate projection no longer rereads authored eventDefinition.taskInputs.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs` passed 17/17; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event runtime candidate task input payload consumption|runtime event task input payload consumption|runtime event binding action payload consumption|runtime event action payload application|event router runtime core|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 460/460; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push this checkpoint, then continue the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Created the next runtime-only child after binding-action payload consumption. Audit found event-runtime candidate projection still reads eventDefinition.taskInputs directly inside toEventRuntimeCandidate(...), even though task-input projection is already canonicalized on RuntimeEventEntity.payload.taskInputs.`
  - Verification: `rg -n "toEventRuntimeCandidate|eventDefinition\\.taskInputs|readRuntimeEventTaskInputs" src/core/runtime/event-runtime.ts src/core/runtime/event-entity-projection.ts tests/event-router-runtime.test.cjs tests/robustness.test.cjs`; `sed -n '100,130p' src/core/runtime/event-runtime.ts`.`
  - Next: `Add RED coverage for payload-owned candidate task-input projection.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-event-task-input-payload-consumption-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-event-binding-action-payload-consumption-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `5e73236`, which moved binding-owned action application onto payload-owned actions.
  - Audit now shows the next smallest routed metadata gap is event-runtime candidate task-input projection still rereading authored `taskInputs`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- repoint `toEventRuntimeCandidate(...)` task-input projection onto shared payload task inputs
- add focused runtime tests and robustness guards
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- changing scene-id projection ownership
- changing route activation or scene-start ownership
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/event-runtime.ts`
  - Consume candidate task inputs via the shared projection seam.
- `tests/event-router-runtime.test.cjs`
  - Add runtime coverage for payload-owned candidate task-input projection.
- `tests/robustness.test.cjs`
  - Guard candidate task-input projection onto the routed payload seam.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-event-runtime-candidate-task-input-payload-consumption-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - event-runtime candidate task inputs come from the shared payload seam
  - trigger activation and routing behavior stay unchanged outside that seam
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event runtime candidate task input payload consumption|runtime event task input payload consumption|runtime event binding action payload consumption|runtime event action payload application|event router runtime core|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Authored Candidate Task Input Re-Read

**Files:**
- Read: `src/core/runtime/event-runtime.ts`
- Read: `src/core/runtime/event-entity-projection.ts`
- Modify: `docs/superpowers/plans/2026-07-30-event-runtime-candidate-task-input-payload-consumption-plan.md`

- [x] **Step 1: Record the remaining authored candidate task-input re-read**

Document that `toEventRuntimeCandidate(...)` still reads `eventDefinition.taskInputs`.

- [x] **Step 2: Lock the child boundary**

Document that this child changes candidate task-input ownership only and preserves trigger/route behavior.

## Task 2: Add RED Coverage For Payload-Owned Candidate Task Inputs

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing payload-consumption guards**

Cover:

- event-runtime candidate task inputs can consume shared payload task inputs even when authored `eventDefinition.taskInputs` is empty
- `toEventRuntimeCandidate(...)` no longer reads `eventDefinition.taskInputs`

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs --test-name-pattern "task input|candidate"
```

Expected:

- the new guard fails before implementation

## Task 3: Consume Payload-Owned Candidate Task Inputs

**Files:**
- Modify: `src/core/runtime/event-runtime.ts`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-event-runtime-candidate-task-input-payload-consumption-plan.md`

- [x] **Step 1: Repoint candidate task-input projection to the shared payload seam**

Keep scene-id projection and route activation ownership unchanged.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] Event-runtime candidate task inputs come from the shared payload seam.
- [x] Trigger activation and routing behavior stay unchanged outside that seam.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Event Runtime Candidate Task Input Payload Consumption`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-and-push-event-runtime-candidate-task-input-payload-consumption`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-event-runtime-candidate-task-input-payload-consumption-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Commit and push this verified checkpoint, then continue the next runtime-only event-system migration slice.`
