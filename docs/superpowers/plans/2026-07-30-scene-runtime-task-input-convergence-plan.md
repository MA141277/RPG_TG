# Scene Runtime Task Input Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge scene-runtime task signaling onto canonical `taskInputs` while preserving any still-required compatibility fallback in `RuntimeResult` and `runtime-dispatch`, without touching `src/main.ts`, UI, map, backpack, or styles.

**Architecture:** After the previous child, `event-runtime`, `event-activation`, dialogue-runtime, domain event definitions, and dispatch settlement all recognize `taskInputs` as the canonical task channel. The remaining core runtime producer still emitting a split task field is `scene-runtime`, which returns `taskSignals` through `SceneRuntimeResult` and story-trigger helpers. This child keeps the write scope inside `src/core/contracts/**`, `src/core/runtime/**`, and focused tests so the producer-side contract can converge before any later attempt to delete compatibility fields from `RuntimeResult`.

**Tech Stack:** TypeScript, Vite test build, Node test runner, targeted runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Scene-runtime task input convergence is implemented, verified, committed as 9acb1ae, and pushed to origin/codex/migration-hot-tasks. The remaining decision is whether to merge this checkpoint back to the aligned baseline now or hold it on the hot-task branch.`
- Next Step: `Merge the pushed checkpoint back to codex/sync-naqishuo-721ui-to-mmz-followup and origin/codex/sync-naqishuo-721ui-to-mmz, then open the next adjacent runtime-only child for runtime-dispatch split task input compatibility narrowing.`
- Verification: `pnpm run build:test`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runtime accepts an activated event handoff|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` passed; `pnpm run lint:plans` still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue; the broader targeted robustness invocation still carries the known unrelated "runtime router contract exports a formal routing seam" assertion.`
- Notes: `Do not touch src/main.ts, src/ui/**, map, backpack, or styles. This child remains producer-side only: it narrows scene-runtime from taskSignals to taskInputs, but does not remove RuntimeResult.taskSignals fallback from dispatch. Project-progress remains intentionally unsynced because docs/superpowers/project-progress.md still tracks an unrelated map-renderer child and the user has not asked to repoint it.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child after task-input contract convergence merged back at 91780be.`
  - Verification: `sed -n '1,220p' docs/superpowers/project-progress.md`; `sed -n '1,220p' src/core/contracts/scene-runtime.ts`; `sed -n '1,220p' src/core/runtime/scene-runtime.ts`; `rg -n "taskSignals" tests src/core/contracts src/core/runtime | head -n 120`; `rg -n "taskInputs|taskActions|taskSignals|taskUpdates|RuntimeTaskInput" src tests | head -n 250`.`
  - Next: `Record the exact remaining producer-side taskSignals seam and identify the smallest RED tests needed before production edits.`
- 2026-07-30
  - Summary: `Completed Task 2 and the implementation portion of Task 3. Added a RED source assertion for scene-runtime task input ownership, then narrowed SceneRuntimeResult and story-trigger helper returns from taskSignals to canonical taskInputs without widening the slice into dispatch fallback removal.`
  - Verification: `pnpm run build:test`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runtime accepts an activated event handoff|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `pnpm run lint:plans`.`
  - Next: `Sync the handoff and decide whether to commit/push this runtime-only checkpoint now or keep it local for another adjacent slice.`
- 2026-07-30
  - Summary: `Completed Task 4 and pushed the scene-runtime task input convergence checkpoint as 9acb1ae on codex/migration-hot-tasks.`
  - Verification: `git commit -m "merge: converge scene runtime task inputs"` created `9acb1ae`; `git push` updated `origin/codex/migration-hot-tasks` from `91780be` to `9acb1ae`; previous targeted verification remained green with the same known unrelated robustness and plan-lint failures only.`
  - Next: `Merge the pushed checkpoint back to the aligned baseline, then promote the next adjacent runtime-only child for runtime-dispatch split task input compatibility narrowing.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-task-input-contract-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The aligned local receiving branch is `codex/sync-naqishuo-721ui-to-mmz-followup`, which now sits at the same merge-back commit `91780be` as the current branch and `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - `docs/superpowers/project-progress.md` still points at an unrelated map-renderer child and remains intentionally unsynced because the user has not asked to repoint it.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit the remaining scene-runtime `taskSignals` producer seam
- add focused failing tests that require canonical `taskInputs` in scene-runtime contracts and helpers
- narrow `SceneRuntimeResult` and `runStoryTriggerRuntime()` from `taskSignals` to `taskInputs`
- keep `runtime-dispatch` compatibility fallback behavior unchanged unless Task 2 proves a narrower write is required
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- `src/main.ts` or any entry-shell rewiring
- UI, map, backpack, or style changes
- removing `RuntimeResult.taskActions` / `RuntimeResult.taskSignals` compatibility fallback from dispatch
- task runtime settlement behavior changes
- new production caller wiring for event-owned playable completion

## File Map

### Existing files to modify

- `src/core/contracts/scene-runtime.ts`
  - Narrow the scene-runtime result contract from split `taskSignals` to canonical `taskInputs`.
- `src/core/runtime/scene-runtime.ts`
  - Return canonical `taskInputs` from scene-trigger helpers and preserve current behavior.
- `tests/robustness.test.cjs`
  - Add or narrow source-level ownership assertions only if needed.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync for the new child.
- `docs/superpowers/plans/2026-07-30-scene-runtime-task-input-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected.`

## Verification Plan

- Targeted verification:
  - `scene-runtime` emits canonical `taskInputs`
  - story trigger helpers no longer expose split `taskSignals`
  - protected shell/UI/map/backpack/style paths remain untouched
  - previous task-input and follow-up ownership assertions stay green
- Required commands:
  - `pnpm run build:test`
  - `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runtime|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`
  - `pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `pnpm run lint:plans`

## Task 1: Audit Remaining Scene Runtime Task Signal Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/core/contracts/scene-runtime.ts`
- Read: `src/core/runtime/scene-runtime.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Modify: `docs/superpowers/plans/2026-07-30-scene-runtime-task-input-convergence-plan.md`

- [x] **Step 1: Record the exact remaining split producer seam**

Run:

```bash
sed -n '1,220p' docs/superpowers/project-progress.md
sed -n '1,220p' src/core/contracts/scene-runtime.ts
sed -n '1,220p' src/core/runtime/scene-runtime.ts
rg -n "taskSignals" tests src/core/contracts src/core/runtime | head -n 120
rg -n "taskInputs|taskActions|taskSignals|taskUpdates|RuntimeTaskInput" src tests | head -n 250
```

Expected:

- identify which core runtime producers still emit split task fields
- confirm whether `scene-runtime` is the last remaining core producer using `taskSignals`
- confirm whether project-progress remains unrelated and should stay unsynced

Recorded result:

- `src/core/contracts/scene-runtime.ts` still exposes `SceneRuntimeResult.taskSignals: RuntimeTaskSignal[]`.
- `src/core/runtime/scene-runtime.ts` still returns `taskSignals: []` from both `runSceneFromEvent()` and the null-session branch of `runStoryTriggerRuntime()`.
- `runtime-dispatch.ts` still retains compatibility fallback for `taskActions` / `taskSignals`, but producer-side canonical convergence has already happened in event-runtime, event-activation, dialogue-runtime, domain events, and mod-first compatibility layers.
- `scene-runtime` is now the remaining obvious core runtime producer still using split `taskSignals`.
- `docs/superpowers/project-progress.md` still tracks an unrelated map-renderer child and should remain unsynced unless the user explicitly asks to repoint it.

- [ ] **Step 2: Update the child plan with the audited write scope**
- [x] **Step 2: Update the child plan with the audited write scope**

Document:

- which `taskSignals` references can be narrowed in this child
- which compatibility surfaces must remain untouched for now
- which RED tests should be written before implementation begins

- [ ] **Step 3: Sync the parent handoff with the new active child**
- [x] **Step 3: Sync the parent handoff with the new active child**

Update the handoff plan so it points at this child as the next runtime-only convergence slice after task-input contract convergence.

## Task 2: Add Focused Failing Scene Runtime Coverage

**Files:**
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a failing scene-runtime contract assertion**
- [x] **Step 1: Add a failing scene-runtime contract assertion**

Add a focused RED assertion that requires:

- `SceneRuntimeResult` to expose `taskInputs`
- `runSceneFromEvent()` and `runStoryTriggerRuntime()` to return `taskInputs`
- the old `taskSignals` producer seam to disappear from `src/core/runtime/scene-runtime.ts`

- [ ] **Step 2: Run the new test to verify it fails for the expected reason**
- [x] **Step 2: Run the new test to verify it fails for the expected reason**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runtime|child 33 event runtime task input contract stays canonical-first"
```

Expected:

- at least one new assertion fails against the pre-implementation contract
- the failure points at `scene-runtime` still exporting `taskSignals` instead of canonical `taskInputs`

## Task 3: Implement Scene Runtime Task Input Convergence

**Files:**
- Modify: `src/core/contracts/scene-runtime.ts`
- Modify: `src/core/runtime/scene-runtime.ts`

- [ ] **Step 1: Narrow the scene-runtime contract to taskInputs**
- [x] **Step 1: Narrow the scene-runtime contract to taskInputs**

Implement the smallest change that switches `SceneRuntimeResult` to canonical task inputs, for example:

```ts
export type SceneRuntimeResult = {
  taskInputs: RuntimeTaskInput[];
};
```

- [ ] **Step 2: Return canonical taskInputs from scene helpers**
- [x] **Step 2: Return canonical taskInputs from scene helpers**

Keep current behavior while replacing the producer-facing split field:

```ts
return {
  taskInputs: [],
};
```

- [ ] **Step 3: Keep dispatch compatibility untouched unless tests prove otherwise**
- [x] **Step 3: Keep dispatch compatibility untouched unless tests prove otherwise**

Do not widen this child into dispatch fallback removal. The goal here is to converge the producer seam only.

## Task 4: Verify, Sync Docs, And Prepare The Commit Checkpoint

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-scene-runtime-task-input-convergence-plan.md`

- [x] **Step 1: Run the required verification**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "scene runtime|child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"
pnpm run typecheck
git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles
git diff --check
pnpm run lint:plans
```

Expected:

- targeted tests pass
- typecheck passes
- boundary diff is empty
- `lint:plans` fails only on the known unrelated `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` title issue unless that blocker is fixed separately

- [x] **Step 2: Record verification and exact boundary outcome**

Update both plans with:

- pass/fail results
- whether scene-runtime still retains any split compatibility fields
- confirmation that protected paths remained untouched
- the exact next unchecked task or merge checkpoint

- [x] **Step 3: Commit and push the runtime-only slice**

Run:

```bash
git status --short
git add src/core/contracts/scene-runtime.ts src/core/runtime/scene-runtime.ts tests/robustness.test.cjs docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md docs/superpowers/plans/2026-07-30-scene-runtime-task-input-convergence-plan.md
git commit -m "merge: converge scene runtime task inputs"
git push
```

Report:

- implemented scene-runtime task input convergence
- verification commands and results
- whether any split compatibility was retained
- whether the slice is ready for merge-back or should remain as a branch checkpoint

## Exit Check

- [x] `scene-runtime` emits canonical `taskInputs` instead of split `taskSignals`.
- [x] No unapproved changes landed in `src/main.ts`, UI, map, backpack, or styles.
- [x] Existing task-input and follow-up ownership assertions remain green.
- [x] The child plan and parent handoff both record the exact post-slice resume point.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Scene Runtime Task Input Convergence`
- Parent Task: `Mod First Runtime Migration`
- Parent Stage: `Runtime Migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `Runtime Dispatch Split Task Input Compatibility Narrowing`
- Next Child Status: `waiting`
- Next Required Action: `Merge the current checkpoint back to the aligned baseline, then open the next adjacent runtime-only child for runtime-dispatch split task input compatibility narrowing.`
- Next Entry Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Push Status: `success`
- Push Commit: `9acb1ae`
- Resume From: `Stay on codex/migration-hot-tasks, confirm the worktree is clean, merge this checkpoint back to codex/sync-naqishuo-721ui-to-mmz-followup, then decide whether to open the dispatch-compatibility child immediately.`
