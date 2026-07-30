# Event Chain Runtime Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce the first controlled event-chain runtime so routed events can trigger follow-up events only through one shared chain owner, without reopening UI, `src/main.ts`, or script-editor schema work.

**Architecture:** This child sits immediately after the pushed story-settlement-next-event convergence checkpoint. The current branch already has canonical routed event entities, shared direct-entry seams, and centralized effect settlement, but chain execution is still fragmented between local continuation helpers and ad hoc follow-up handling. This child adds a bounded `event-chain` owner in `src/core/runtime/**`, keeps dialogue/scene pacing out of scope unless explicitly safe, and starts with the narrowest covered chain family: routed non-scene follow-up events that can execute immediately without bypassing the router.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed`
- Last Updated: `2026-07-30`
- Current Focus: `Completed the first bounded event-chain owner. src/core/runtime/event-chain-runtime.ts now owns queue-based immediate follow-up chaining, runtime-dispatch can consume routed followUpEventIds through an optional router.routeEventChain(...) seam, and the phase-one guard fails closed on owner-paced dialogue/settlement continuations.`
- Next Step: `Promote this locally verified child into branch history, then open the next adjacent runtime-only event-system child focused on routed payload/settlement ownership rather than more follow-up seam cleanup.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-chain-runtime.test.cjs tests/event-router-runtime.test.cjs tests/runtime-dispatch-settlement.test.cjs` passed 21/21; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event chain runtime|shared runtime dispatch consumes the shared event-chain owner through an optional router seam|event router runtime core|story settlement next-event convergence|scene dialogue runtime continuation route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|shared runtime dispatch routes RuntimeState instead of CoreGameState only|runtime dispatch settles effects after routing|runtime dispatch settles routed task actions and signals into unified task state"` passed 439/439; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue.`
- Notes: `Phase one intentionally covers only immediate routed follow-up events that can stay inside shared runtime ownership. Dialogue/scene continuation pacing remains outside scope and the chain owner now rejects those families explicitly. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only child for controlled event-chain ownership after the pushed story settlement next-event checkpoint.`
  - Verification: `Plan authoring only.`
  - Next: `Run the audit and RED coverage for safe immediate follow-up event chaining.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. The current branch already centralizes followUpEventIds production inside src/core/runtime/event-router.ts, but scene/dialogue continuations still remain owner-paced through resolveEventContinuation(...) and continueToEvent(...), so the first chain-owner slice must exclude those families and cover only immediate routed follow-up events.`
  - Verification: `rg -n "followUpEventIds|nextEventId|emitEventIds|resolveEventContinuation|continueToEvent|routeStoryDirectEntry|dispatchEventRoute\\(" src/core src/application`; `sed -n '1,220p' src/core/runtime/event-router.ts`; `sed -n '1,220p' src/application/events/event-continuation.ts`; `sed -n '1,260p' src/application/story/story-runtime.ts`; `sed -n '1,220p' src/core/runtime/runtime-dispatch.ts`.`
  - Next: `Add RED tests for queue-based immediate follow-up chaining and guard against accidental eager chaining of scene/dialogue continuation.`
- 2026-07-30
  - Summary: `Completed the event-chain runtime convergence child. Added src/core/runtime/event-chain-runtime.ts as the bounded queue owner, taught runtime-dispatch to consume routed followUpEventIds through an optional router.routeEventChain(...) seam, aggregated chained effects/taskInputs into the shared dispatch settlement path, and locked the phase-one guard so owner-paced dialogue/settlement continuations fail closed instead of silently eager-chaining.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-chain-runtime.test.cjs tests/event-router-runtime.test.cjs tests/runtime-dispatch-settlement.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event chain runtime|shared runtime dispatch consumes the shared event-chain owner through an optional router seam|event router runtime core|story settlement next-event convergence|scene dialogue runtime continuation route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator|shared runtime dispatch routes RuntimeState instead of CoreGameState only|runtime dispatch settles effects after routing|runtime dispatch settles routed task actions and signals into unified task state"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`.`
  - Next: `Commit/push this child, then open the next adjacent runtime-only plan for routed payload/settlement ownership.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed child:
  - `docs/superpowers/plans/2026-07-30-story-settlement-next-event-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-event-router-runtime-core-phase-a-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `3930403`, with runtime behavior for story settlement follow-up restored in prior commit `494de4a`.
  - The shared router/direct-entry seams now exist, so the remaining gap is no longer “can events continue”, but “who owns event->event chaining”.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- audit all current `followUpEventIds` producers and continuation helpers on covered runtime paths
- define the first bounded `event-chain` owner for immediate routed follow-up events
- add focused RED/GREEN tests for queue ordering, depth/duplicate protection, and router-owned event chaining
- integrate the new chain owner only where follow-up events are safe to execute immediately
- keep existing story/scene/dialogue pacing seams intact when they still require owner-managed pause/choice semantics
- sync this child plan and the parent handoff after verification

### Still Out Of Scope

- broad scene/dialogue continuation redesign
- script-editor export/schema changes
- item/menu/house instance migration onto event triggers
- `src/main.ts`, UI, map, backpack, or style changes
- settlement-command runtime unless RED coverage proves it is required for the covered path

## File Map

### Existing files to modify

- `src/core/runtime/event-router.ts`
  - Preserve canonical routed event dispatch while exposing the safe chain inputs/results needed by the chain owner.
- `src/core/runtime/runtime-dispatch.ts`
  - Consume chained routed results only if the audit proves the covered family can stay centralized here.
- `src/core/runtime/runtime-router.ts`
  - Add the optional router.routeEventChain(...) seam used by shared dispatch.
- `tests/event-router-runtime.test.cjs`
  - Add behavior coverage for router-owned immediate follow-up event chaining.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Add focused assertions if dispatch becomes the covered chain owner for the phase-one path.
- `tests/robustness.test.cjs`
  - Add ownership guards for the new `event-chain` seam and protect scene/dialogue pacing from accidental eager chaining.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-event-chain-runtime-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `src/core/runtime/event-chain-runtime.ts`
  - Bounded queue-based chain owner with max-depth and duplicate guard for covered immediate follow-up events.
- `tests/event-chain-runtime.test.cjs`
  - Focused event-chain runtime behavior coverage.

## Verification Plan

- Targeted verification:
  - covered events can emit follow-up events only through one shared chain owner
  - duplicate/loop protection remains fail-closed
  - safe immediate routed follow-up events stay router-owned instead of feature-owned
  - dialogue/scene continuation is not accidentally eager-chained
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/event-chain-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "event chain runtime|event router runtime core|story settlement next-event convergence|scene dialogue runtime continuation route convergence|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Safe Immediate Chain Families

**Files:**
- Read: `src/core/contracts/event-router.ts`
- Read: `src/core/runtime/event-router.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/events/event-continuation.ts`
- Modify: `docs/superpowers/plans/2026-07-30-event-chain-runtime-convergence-plan.md`

- [x] **Step 1: Record which current follow-up paths are safe for a phase-one chain owner**

Audit and document:

- which producers emit `followUpEventIds`
- which continuations are immediate and router-safe
- which continuations still require scene/dialogue pacing and must remain out of scope

- [x] **Step 2: Lock the first covered chain family**

Document the exact phase-one chain boundary so implementation and tests only cover safe immediate routed follow-up events.

## Task 2: Add RED Coverage For The Chain Owner

**Files:**
- Create: `tests/event-chain-runtime.test.cjs`
- Modify: `tests/event-router-runtime.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing event-chain runtime behavior tests**

Cover:

- queue-based deterministic ordering
- max-depth protection
- duplicate/visited protection
- no direct feature-owned follow-up start

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/event-router-runtime.test.cjs tests/event-chain-runtime.test.cjs
```

Expected:

- the new chain-owner assertions fail before implementation

## Task 3: Implement The Minimal Chain Owner

**Files:**
- Create: `src/core/runtime/event-chain-runtime.ts`
- Modify: `src/core/runtime/event-router.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `docs/superpowers/plans/2026-07-30-event-chain-runtime-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`

- [x] **Step 1: Add the bounded chain owner**

Implement a queue-based runtime owner with:

- deterministic ordering
- max-depth guard
- visited-event guard
- minimal state threading between routed events

- [x] **Step 2: Integrate the covered follow-up family**

Only wire the chain owner into the audited safe immediate family. Do not eager-chain scene/dialogue-owned continuations.

- [x] **Step 3: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact pushed-or-local checkpoint state.

## Exit Check

- [x] Covered immediate routed follow-up events execute only through one shared event-chain owner.
- [x] Duplicate/loop protection fails closed.
- [x] Scene/dialogue pacing is not accidentally moved onto eager chaining.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Event Chain Runtime Convergence`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `promote-event-chain-checkpoint`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Push Status: `pending`
- Push Commit: `none`
- Resume From: `Promote this locally verified child into branch history, then open the next adjacent runtime-only event-system plan.`
