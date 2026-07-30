# Runtime Event Settlement Id Payload Consumption Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move story-runtime settlement continuation lookup/application onto `RuntimeEventEntity.payload.settlementId` so routed settlement metadata stays on the shared runtime event seam.

**Architecture:** The previous children moved routed `taskInputs` and pre-start `actions` onto `RuntimeEventEntity.payload`, but settlement continuation still rereads `eventDefinition.settlementId` inside story-runtime and story-settlement-continuation. This child stays narrow: add one canonical settlement-id reader for runtime event payload, thread routed events through story-runtime's post-route settlement handling, and allow settlement application/lookup helpers to accept a routed settlement-id override while keeping authored fallback behavior unchanged.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Story-runtime settlement continuation now consumes RuntimeEventEntity.payload.settlementId through shared readRuntimeEventSettlementId(...), and story-settlement-continuation accepts a routed settlement-id override while preserving authored fallback behavior.`
- Next Step: `Commit and push this verified checkpoint, then continue the next runtime-only event-system migration slice.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/story-settlement-continuation.test.cjs` passed 18/18; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event settlement id payload consumption|runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|story settlement runtime owner convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"` passed 457/457; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
- Notes: `This child stays runtime-only, preserves authored fallback behavior, and does not touch src/main.ts, UI, map, backpack, or styles. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Completed the runtime-only settlement-id payload child. Shared runtime event projection now exports readRuntimeEventSettlementId(...), story-runtime threads routed settlement metadata through applyTriggeredStoryEvent(...), and story-settlement-continuation can consume a routed settlement-id override without losing authored fallback behavior.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed (exit 0); `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/story-settlement-continuation.test.cjs` passed 18/18; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event settlement id payload consumption|runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|story settlement runtime owner convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"` passed 457/457; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed (exit 0); `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` failed only on unrelated pre-existing `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md: missing required section matching /^# .+/m`.`
  - Next: `Commit and push this checkpoint, then continue the next runtime-only event-system migration slice.`

- 2026-07-30
  - Summary: `Created the next runtime-only child after routed action payload application. Audit found story-runtime settlement continuation still reads eventDefinition.settlementId directly in both readStorySettlement(...) and applyStorySettlementEvent(...), even though payload.settlementId is already authored and preserved on RuntimeEventEntity.`
  - Verification: `rg -n "readStorySettlement|eventDefinition\\.settlementId|applyStorySettlementEvent" src/application/story/story-runtime.ts src/application/story/story-settlement-continuation.ts src/core/runtime/event-entity-projection.ts tests/event-router-runtime.test.cjs tests/story-settlement-continuation.test.cjs tests/robustness.test.cjs`; `sed -n '220,340p' src/application/story/story-runtime.ts`; `sed -n '1,220p' src/application/story/story-settlement-continuation.ts`.`
  - Next: `Add RED coverage for payload-owned settlement-id consumption.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-runtime-event-action-payload-application-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `a95e864`, which moved routed direct-entry actions onto payload ownership.
  - Audit now shows the next smallest routed metadata gap is settlement-id consumption in story settlement continuation.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- add one canonical settlement-id reader for runtime event payload
- use that reader on story-runtime settlement continuation paths
- allow story settlement application/lookup helpers to accept a settlement-id override
- add focused runtime tests and robustness guards
- sync this child plus the parent handoff after GREEN verification

### Still Out Of Scope

- changing settlement next-event ownership
- broader dialogue/entryScene payload rewrites
- changing `src/main.ts`, UI, map, backpack, or style paths

## File Map

### Existing files to modify

- `src/core/runtime/event-entity-projection.ts`
  - Add a settlement-id payload reader.
- `src/application/story/story-runtime.ts`
  - Thread routed event settlement metadata into post-route settlement handling.
- `src/application/story/story-settlement-continuation.ts`
  - Accept a settlement-id override while preserving authored fallback behavior.
- `tests/event-router-runtime.test.cjs`
  - Add focused helper coverage.
- `tests/story-settlement-continuation.test.cjs`
  - Add runtime coverage for settlement-id override handling.
- `tests/robustness.test.cjs`
  - Guard story-runtime onto the routed settlement-id payload seam.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-runtime-event-settlement-id-payload-consumption-plan.md`
  - This child plan.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - one canonical helper reads settlementId from `RuntimeEventEntity.payload`
  - story settlement application can consume a routed settlement-id override
  - story-runtime settlement continuation consumes routed settlement metadata
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/story-settlement-continuation.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime event settlement id payload consumption|runtime event action payload application|runtime event task input payload consumption|runtime event entity payload projection|event router runtime core|story settlement runtime owner convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|child 26 story scene settlement re-triggers indoor-screen follow-up before render|child 26 house runtime owns indoor-screen follow-up before render"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit The Remaining Routed Settlement Metadata Re-Read

**Files:**
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/story/story-settlement-continuation.ts`
- Read: `src/core/runtime/event-entity-projection.ts`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-settlement-id-payload-consumption-plan.md`

- [x] **Step 1: Record the remaining routed settlement metadata re-read**

Document that story settlement continuation still reads `eventDefinition.settlementId`.

- [x] **Step 2: Lock the child boundary**

Document that this child changes settlement-id ownership only and preserves authored fallback behavior.

## Task 2: Add RED Coverage For Payload-Owned Settlement Id

**Files:**
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/story-settlement-continuation.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing payload-consumption guards**

Cover:

- a canonical helper reads settlementId from runtime event payload
- story settlement application can use a routed settlement-id override
- story-runtime settlement continuation consumes the routed settlement-id seam

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/story-settlement-continuation.test.cjs --test-name-pattern "settlement"
```

Expected:

- the new guard fails before implementation

## Task 3: Consume Routed Settlement Id From Runtime Event Payload

**Files:**
- Modify: `src/core/runtime/event-entity-projection.ts`
- Modify: `src/application/story/story-runtime.ts`
- Modify: `src/application/story/story-settlement-continuation.ts`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/story-settlement-continuation.test.cjs`
- Modify: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-event-settlement-id-payload-consumption-plan.md`

- [x] **Step 1: Add and consume the canonical routed settlement-id payload helper**

Keep next-event ownership unchanged and limit the slice to settlement-id consumption.

- [x] **Step 2: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] One canonical helper reads settlementId from `RuntimeEventEntity.payload`.
- [x] Story settlement application can consume a routed settlement-id override.
- [x] Story-runtime settlement continuation consumes routed settlement metadata.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Event Settlement Id Payload Consumption`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `commit-and-push-runtime-event-settlement-id-payload-consumption`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-event-settlement-id-payload-consumption-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Commit and push this verified checkpoint, then continue the next runtime-only event-system migration slice.`
