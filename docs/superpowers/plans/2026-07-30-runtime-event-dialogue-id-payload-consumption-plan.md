# Runtime Event Dialogue Id Payload Consumption Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move state-only runtime event classification onto `RuntimeEventEntity.payload.dialogueId` so story-runtime and event-binding-runtime stop rereading authored `eventDefinition.dialogueId` on that seam.

**Architecture:** The previous children moved routed `taskInputs`, pre-start `actions`, and settlement continuation `settlementId` onto shared runtime event payload readers. The next smallest gap is the state-only/action-only branch used by story-runtime and event-binding-runtime, which still checks `eventDefinition.dialogueId` directly. This child stays narrow: add one canonical dialogue-id payload reader, switch the two state-only classifiers to shared projected runtime-event metadata, and preserve existing scene-opening behavior.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Story-runtime and event-binding-runtime state-only classification now consume RuntimeEventEntity.payload.dialogueId through shared readRuntimeEventDialogueId(...), and both classifiers project through the shared runtime-event seam instead of rereading authored eventDefinition.dialogueId.`
- Next Step: `Commit and push this verified checkpoint, then continue the next runtime-only event-system migration slice.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/event-binding-start-runtime.test.cjs` passed 20/20; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event dialogue id payload consumption|runtime event settlement id payload consumption|runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event binding runtime route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 458/458; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stays runtime-only, preserves existing scene-opening behavior, and does not touch src/main.ts, UI, map, backpack, or styles. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Completed the runtime-only dialogue-id payload child. Shared runtime event projection now exports readRuntimeEventDialogueId(...), and both story-runtime plus event-binding-runtime classify action-only/state-only events by projected payload dialogue metadata instead of authored eventDefinition.dialogueId.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/event-binding-start-runtime.test.cjs` passed 20/20; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event dialogue id payload consumption|runtime event settlement id payload consumption|runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event binding runtime route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 458/458; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push this checkpoint, then continue the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Created the next runtime-only child after settlement-id payload consumption. Audit found story-runtime and event-binding-runtime still classify action-only/state-only events by reading eventDefinition.dialogueId directly instead of the shared runtime-event payload seam.`
  - Verification: `rg -n "isStateOnlyRuntimeActionEvent|hasOnlyStateRuntimeActions|eventDefinition\\.dialogueId" src/application/story/story-runtime.ts src/core/runtime/event-binding-runtime.ts src/core/runtime/event-entity-projection.ts tests/event-binding-start-runtime.test.cjs tests/event-router-runtime.test.cjs tests/robustness.test.cjs`; `sed -n '700,760p' src/application/story/story-runtime.ts`; `sed -n '180,240p' src/core/runtime/event-binding-runtime.ts`.`
  - Next: `Add RED coverage for payload-owned dialogueId consumption in state-only runtime classification.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-event-settlement-id-payload-consumption-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `40ef258`, which moved story settlement continuation onto payload-owned `settlementId`.
  - Audit now shows the next smallest routed metadata gap is state-only runtime-action classification still rereading authored `dialogueId`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- add one canonical dialogue-id reader for runtime event payload
- switch story-runtime state-only classification onto the projected runtime-event seam
- switch event-binding-runtime state-only classification onto the projected runtime-event seam
- add focused runtime tests and robustness guards
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- changing entry-scene ownership
- changing continuation ownership
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/event-entity-projection.ts`
  - Add a dialogue-id payload reader.
- `src/application/story/story-runtime.ts`
  - Classify state-only runtime events through projected runtime-event metadata.
- `src/core/runtime/event-binding-runtime.ts`
  - Classify state-only runtime events through projected runtime-event metadata.
- `tests/event-router-runtime.test.cjs`
  - Add focused helper coverage.
- `tests/event-binding-start-runtime.test.cjs`
  - Add runtime coverage for payload-owned dialogue-id classification.
- `tests/robustness.test.cjs`
  - Guard state-only classification onto the dialogue-id payload seam.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-event-dialogue-id-payload-consumption-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - one canonical helper reads dialogueId from `RuntimeEventEntity.payload`
  - event-binding-runtime state-only classification consumes the shared dialogue-id payload seam
  - story-runtime state-only classification consumes the shared dialogue-id payload seam
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/event-binding-start-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event dialogue id payload consumption|runtime event settlement id payload consumption|runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event binding runtime route convergence|story runtime state-only binding route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Authored Dialogue Id Re-Read

**Files:**
- Read: `src/application/story/story-runtime.ts`
- Read: `src/core/runtime/event-binding-runtime.ts`
- Read: `src/core/runtime/event-entity-projection.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-dialogue-id-payload-consumption-plan.md`

- [x] **Step 1: Record the remaining authored dialogue-id re-read**

Document that the two state-only classifiers still read `eventDefinition.dialogueId`.

- [x] **Step 2: Lock the child boundary**

Document that this child changes state-only dialogue-id ownership only and preserves existing route/start behavior.

## Task 2: Add RED Coverage For Payload-Owned Dialogue Id

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/event-binding-start-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing payload-consumption guards**

Cover:

- a canonical helper reads dialogueId from runtime event payload
- event-binding-runtime state-only classification can consume the shared payload dialogue id seam
- story-runtime state-only classification consumes the shared payload dialogue-id seam

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/event-binding-start-runtime.test.cjs --test-name-pattern "dialogue|state-only"
```

Expected:

- the new guard fails before implementation

## Task 3: Consume Routed Dialogue Id From Runtime Event Payload

**Files:**
- Modify: `src/core/runtime/event-entity-projection.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/core/runtime/event-binding-runtime.ts`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/event-binding-start-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-dialogue-id-payload-consumption-plan.md`

- [x] **Step 1: Add and consume the canonical routed dialogue-id payload helper**

Keep entry-scene ownership unchanged and limit the slice to state-only dialogue-id classification.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] One canonical helper reads dialogueId from `RuntimeEventEntity.payload`.
- [x] Event-binding-runtime state-only classification can consume the shared dialogue-id payload seam.
- [x] Story-runtime state-only classification consumes routed dialogue-id metadata.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Event Dialogue Id Payload Consumption`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-and-push-runtime-event-dialogue-id-payload-consumption`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-event-dialogue-id-payload-consumption-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Commit and push this verified checkpoint, then continue the next runtime-only event-system migration slice.`
