# Story Settlement Runtime Owner Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move story settlement definition application onto the shared core settlement owner so story runtime stops carrying a private settlement-apply path.

**Architecture:** The current branch already routes settlement events through shared event-router seams, but `src/application/story/story-settlement-continuation.ts` still reconstructs people/city/building settlement application locally. This child introduces one reusable settlement-definition apply seam in `src/core/runtime/runtime-settlement.ts`, reuses it from story settlement continuation, and leaves broader payload-schema or item/menu trigger migration out of scope.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed`
- Last Updated: `2026-07-30`
- Current Focus: `Completed the first shared settlement ownerization slice. src/core/runtime/runtime-settlement.ts now exports applySettlementDefinitionById(...), progression settlement application reuses that core seam, and src/application/story/story-settlement-continuation.ts now delegates settlement-definition application to shared runtime-settlement ownership instead of calling applySettlementContents(...) directly.`
- Next Step: `Promote this locally verified child into branch history, then open the next adjacent runtime-only plan for broader settlement payload/command ownership rather than more story-local settlement cleanup.`
- Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test` passed; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/story-settlement-continuation.test.cjs tests/event-continuation-runtime.test.cjs` passed 27/27; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story settlement runtime owner convergence|story settlement next-event convergence|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"` passed 440/440; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck` passed; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` returned empty output; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans` still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue.`
- Notes: `This child intentionally stops at shared settlement-definition ownership. Full settlement-command and payload-schema migration remains a later event-system child. docs/superpowers/project-progress.md remains intentionally unrelated.`

## Progress Log

- 2026-07-30
  - Summary: `Created the next runtime-only child after event-chain convergence to move story settlement application onto the shared core settlement owner.`
  - Verification: `Plan authoring only.`
  - Next: `Audit duplication between story settlement continuation and runtime-settlement before writing RED tests.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. The current branch already has a shared settlement owner for low-level settlement content application and progression settlement lookup under src/core/runtime/runtime-settlement.ts, but story settlement continuation still performs its own settlement-definition lookup and directly calls applySettlementContents(...) after rebuilding people/city/building collections in application space. The first safe convergence slice is therefore to add one shared settlement-definition apply seam in runtime-settlement and move story settlement continuation onto it, without touching payload-schema or settlement-authored nextEvent routing.`
  - Verification: `sed -n '260,420p' src/core/runtime/runtime-settlement.ts`; `sed -n '1,220p' src/application/story/story-settlement-continuation.ts`; `sed -n '220,340p' src/application/story/story-runtime.ts`; `sed -n '1,320p' tests/runtime-settlement-content.test.cjs`; `sed -n '1,220p' tests/story-settlement-continuation.test.cjs`; `rg -n "applyStorySettlementEvent\\(|readStorySettlement\\(|settlementDefinitionsById|type !== \\\"settlement\\\"|settlementId" src/application/story src/core/runtime tests`.`
  - Next: `Add RED tests for shared settlement-definition application and story-settlement delegation.`
- 2026-07-30
  - Summary: `Completed the story settlement runtime owner convergence child. runtime-settlement now owns a reusable applySettlementDefinitionById(...) seam, applySettlementInstances(...) reuses that seam, and story-settlement-continuation delegates settlement-definition application to the shared core owner while preserving story settlement outputs and settlement-authored nextEvent continuation behavior.`
  - Verification: `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/story-settlement-continuation.test.cjs tests/event-continuation-runtime.test.cjs`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story settlement runtime owner convergence|story settlement next-event convergence|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`.`
  - Next: `Commit/push this child, then open the next adjacent runtime-only plan for broader settlement payload/command ownership.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-event-router-runtime-core-design.md`
- Related runtime handoff:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Related completed children:
  - `docs/superpowers/plans/2026-07-30-event-chain-runtime-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-story-settlement-next-event-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest pushed checkpoint is `fa5e434`, which introduced the shared event-chain runtime.
  - Settlement events already route through shared event-router seams, but story settlement execution still depends on a local adapter in `src/application/story/story-settlement-continuation.ts`.
  - `pnpm run lint:plans` is still expected to fail only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is fixed separately.

## Implementation Scope

### In Scope

- audit duplication between `story-settlement-continuation` and `runtime-settlement`
- add one shared settlement-definition apply seam in `src/core/runtime/runtime-settlement.ts`
- move story settlement continuation onto that seam
- keep current story settlement behavior for person/city/building targets and settlement-authored `nextEventId`
- add focused RED/GREEN coverage plus ownership guards
- sync this child plan and the parent handoff after verification

### Still Out Of Scope

- broader settlement-command schema redesign
- event payload-schema lowering
- item/menu/house trigger migration
- `src/main.ts`, UI, map, backpack, or style changes
- script-editor export/import changes

## File Map

### Existing files to modify

- `src/core/runtime/runtime-settlement.ts`
  - Add the reusable settlement-definition apply seam and, if needed, move common lookup/warning behavior under core ownership.
- `src/application/story/story-settlement-continuation.ts`
  - Replace the local settlement application path with the shared core seam.
- `src/application/story/story-runtime.ts`
  - Only if needed for imported helper ownership or narrower settlement lookup reuse.
- `tests/runtime-settlement-content.test.cjs`
  - Add coverage for the new shared settlement-definition apply seam.
- `tests/story-settlement-continuation.test.cjs`
  - Prove story settlement continuation now delegates to the shared core owner while preserving behavior.
- `tests/robustness.test.cjs`
  - Guard the new settlement-owner seam and keep the story adapter thin.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync.
- `docs/superpowers/plans/2026-07-30-story-settlement-runtime-owner-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected.`

## Verification Plan

- Targeted verification:
  - story settlement definition application is owned by shared core runtime-settlement
  - story settlement behavior for person/city/building targets stays intact
  - progression settlement behavior is not regressed
  - settlement-authored `nextEventId` continuation remains intact
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/story-settlement-continuation.test.cjs tests/event-continuation-runtime.test.cjs`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "story settlement runtime owner convergence|story settlement next-event convergence|event chain runtime|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run lint:plans`

## Task 1: Audit Shared Settlement Owner Scope

**Files:**
- Read: `src/core/runtime/runtime-settlement.ts`
- Read: `src/application/story/story-settlement-continuation.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `tests/runtime-settlement-content.test.cjs`
- Read: `tests/story-settlement-continuation.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-story-settlement-runtime-owner-convergence-plan.md`

- [x] **Step 1: Record current duplication and safe reuse boundary**

Document:

- which settlement-definition apply logic already exists in `runtime-settlement`
- which logic is still duplicated in the story adapter
- why this child should move only settlement-definition application, not broader payload/command ownership

- [x] **Step 2: Lock the first settlement-owner seam**

Document the exact phase-one boundary: story settlement continuation may keep story-specific context shaping and `nextEventId` lookup, but settlement-definition application itself must come from shared core runtime-settlement ownership.

## Task 2: Add RED Coverage For Shared Settlement Ownership

**Files:**
- Modify: `tests/runtime-settlement-content.test.cjs`
- Modify: `tests/story-settlement-continuation.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Write failing settlement-owner tests**

Cover:

- a shared core helper can apply a settlement definition by id to people/city/building collections
- story settlement continuation delegates to the shared helper
- current person/city/building settlement behavior stays the same

- [x] **Step 2: Run RED verification**

Run:

```bash
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm run build:test
PATH="/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" pnpm exec node --test tests/runtime-settlement-content.test.cjs tests/story-settlement-continuation.test.cjs
```

Expected:

- the new shared-owner assertions fail before implementation

## Task 3: Implement Shared Settlement Owner Reuse

**Files:**
- Modify: `src/core/runtime/runtime-settlement.ts`
- Modify: `src/application/story/story-settlement-continuation.ts`
- Modify: `docs/superpowers/plans/2026-07-30-story-settlement-runtime-owner-convergence-plan.md`
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`

- [x] **Step 1: Add the shared settlement-definition apply seam**

Implement the smallest reusable core helper needed for settlement-definition lookup and application.

- [x] **Step 2: Point story settlement continuation at the shared owner**

Keep the story adapter responsible only for shaping story context and preserving current outputs, not for duplicating settlement application internals.

- [x] **Step 3: Run GREEN verification and sync governance**

Run the verification set from `Verification Plan`, then update this child plan and the parent handoff with the exact local-or-pushed checkpoint state.

## Exit Check

- [x] Story settlement definition application is owned by shared core runtime-settlement.
- [x] Story settlement continuation remains behaviorally unchanged for person/city/building targets.
- [x] Settlement-authored follow-up continuation remains intact.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [x] Project progress intentionally remains unchanged for this isolated child.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Story Settlement Runtime Owner Convergence`
- Parent Task: `mod-first runtime integration handoff`
- Parent Stage: `runtime-only event system migration`
- Closeout Status: `completed`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `promote-story-settlement-owner-checkpoint`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Push Status: `pending`
- Push Commit: `none`
- Resume From: `Promote this locally verified child into branch history, then open the next adjacent runtime-only settlement payload/command plan.`
