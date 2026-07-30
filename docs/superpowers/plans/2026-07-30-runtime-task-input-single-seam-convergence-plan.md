# Runtime Task Input Single Seam Convergence Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse runtime task input compatibility to one public seam by making `RuntimeTaskInput[]` the only supported runtime task input surface, removing legacy split `taskActions` / `taskSignals` fields and old alias type names from the public runtime contract.

**Architecture:** The previous children already narrowed producer ownership and moved split-field folding into `runtime-dispatch`. The remaining task-input compatibility references now live only in three places: the public `RuntimeResult` contract, the `selectRuntimeTaskInputs()` helper in `runtime-dispatch`, and `mod-first-compatibility`'s old alias imports. This child finishes the convergence by deleting legacy split fields from the public contract, deleting the dispatch folding helper, switching `mod-first-compatibility` to canonical `RuntimeTaskInput`, and updating tests so the runtime no longer treats split task input fields as a supported seam.

**Tech Stack:** TypeScript, Vite test build, Node test runner, focused runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `The local runtime checkpoint now finishes task-input public seam convergence: RuntimeResult exposes only canonical taskInputs, runtime-dispatch settles routed taskInputs directly without a folding helper, and mod-first-compatibility uses RuntimeTaskInput directly without a compatibility alias.`
- Next Step: `Decide whether to commit/push this batched local checkpoint now or keep batching another adjacent runtime-only child on top of the fully single-seam task-input baseline.`
- Verification: `git status --short --branch; sed -n '1,220p' docs/superpowers/project-progress.md; sed -n '1,220p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md; sed -n '1,220p' src/core/contracts/runtime-result.ts; sed -n '160,230p' src/core/runtime/runtime-dispatch.ts; sed -n '1,220p' src/core/runtime/mod-first-compatibility.ts; rg -n "RuntimeTaskAction|RuntimeTaskSignal|taskActions\\?:|taskSignals\\?:|taskActions:|taskSignals:|selectRuntimeTaskInputs|ModFirstRuntimeTaskInput" src/core tests; pnpm run build:test; pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs; pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch settles routed canonical taskInputs into unified task state|runtime task input single seam removes split compatibility surfaces|child 33 event runtime task input contract stays canonical-first"; pnpm run typecheck; git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles; git diff --check; pnpm run lint:plans failed only on unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing a top-level title heading.`
- Notes: `Do not touch src/main.ts, UI, map, backpack, or styles. This child intentionally changes the public runtime task-input contract by removing legacy split fields; targeted tests must prove there is no remaining production dependency on them. docs/superpowers/project-progress.md remains intentionally unsynced because it still tracks an unrelated map-renderer child and the user has not asked to repoint it.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child on top of the local dispatch/router checkpoint to finish task-input convergence as a single seam.`
  - Verification: `git status --short --branch`; `sed -n '1,220p' docs/superpowers/project-progress.md`; `sed -n '1,220p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`; `sed -n '1,220p' src/core/contracts/runtime-result.ts`; `sed -n '160,230p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,220p' src/core/runtime/mod-first-compatibility.ts`; `rg -n "RuntimeTaskAction|RuntimeTaskSignal|taskActions\\?:|taskSignals\\?:|taskActions:|taskSignals:|selectRuntimeTaskInputs|ModFirstRuntimeTaskInput" src/core tests`.`
  - Next: `Add RED coverage that fails unless the public contract and runtime-dispatch delete the split task-input seam entirely.`
- 2026-07-30
  - Summary: `Completed the RED/GREEN and focused verification for runtime task-input single-seam convergence. The public RuntimeResult contract no longer exposes taskActions/taskSignals or the old RuntimeTaskAction/RuntimeTaskSignal alias names, runtime-dispatch no longer carries selectRuntimeTaskInputs(), mod-first-compatibility now uses RuntimeTaskInput directly without a compatibility alias, and the stale robustness runtime-settlement assertion was updated to require canonical taskInputs.`
  - Verification: `pnpm run build:test`; `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch settles routed canonical taskInputs into unified task state|runtime task input single seam removes split compatibility surfaces|child 33 event runtime task input contract stays canonical-first"`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check`; `pnpm run lint:plans` failed only on unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing a top-level title heading.`
  - Next: `Decide whether to commit/push the batched local runtime checkpoint now or keep batching another adjacent runtime-only child on top of the single-seam task-input baseline.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-dispatch-task-input-compatibility-narrowing-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-router-formal-seam-alias-alignment-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The local checkpoint already includes uncommitted runtime-dispatch narrowing, runtime-router alias alignment, and plan sync changes; this child batches on top of that checkpoint.
  - The remaining task-input compatibility references are fully localized and no longer appear in active producers or router/runtime ownership tests.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- remove `RuntimeResult.taskActions` and `RuntimeResult.taskSignals`
- remove legacy `RuntimeTaskAction` and `RuntimeTaskSignal` public alias names
- delete `selectRuntimeTaskInputs()` and make `runtime-dispatch` consume canonical `taskInputs` directly
- switch `mod-first-compatibility` to canonical `RuntimeTaskInput`
- update focused tests and source assertions to prove the split task-input seam is gone
- sync this child plan and the parent handoff with the new resume point

### Still Out Of Scope

- follow-up/outcome/interactive compatibility removal
- changing task settlement semantics beyond removing split task-input compatibility
- `src/main.ts`, UI, map, backpack, or style changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/core/contracts/runtime-result.ts`
  - Remove legacy split task input fields and old alias exports while keeping canonical `RuntimeTaskInput`.
- `src/core/runtime/runtime-dispatch.ts`
  - Delete split-field folding and consume canonical `taskInputs` directly.
- `src/core/runtime/mod-first-compatibility.ts`
  - Replace old alias imports with canonical `RuntimeTaskInput`.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Replace legacy split-field behavior coverage with single-seam behavior coverage.
- `tests/robustness.test.cjs`
  - Update source assertions so split task-input fields and helpers must no longer exist.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the parent handoff with this new child.
- `docs/superpowers/plans/2026-07-30-runtime-task-input-single-seam-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `RuntimeResult` exposes only canonical `taskInputs`
  - `runtime-dispatch` no longer references split task input fields or a folding helper
  - mod-first compatibility references only `RuntimeTaskInput`
  - legacy split task input objects are no longer treated as a supported runtime seam
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `pnpm run build:test`
  - `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`
  - `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch settles routed canonical taskInputs into unified task state|runtime task input single seam removes split compatibility surfaces|child 33 event runtime task input contract stays canonical-first"`
  - `pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `pnpm run lint:plans`

## Task 1: Audit Remaining Split Task Input References

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/mod-first-compatibility.ts`
- Read: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-task-input-single-seam-convergence-plan.md`

- [x] **Step 1: Record the exact remaining split seam**

Run:

```bash
git status --short --branch
sed -n '1,220p' docs/superpowers/project-progress.md
sed -n '1,220p' src/core/contracts/runtime-result.ts
sed -n '160,230p' src/core/runtime/runtime-dispatch.ts
sed -n '1,220p' src/core/runtime/mod-first-compatibility.ts
rg -n "RuntimeTaskAction|RuntimeTaskSignal|taskActions\\?:|taskSignals\\?:|taskActions:|taskSignals:|selectRuntimeTaskInputs|ModFirstRuntimeTaskInput" src/core tests
```

Expected:

- confirm split task input compatibility is now isolated to contract and adapter seams
- confirm active producers already emit canonical `taskInputs`
- confirm project-progress remains unrelated and should stay unsynced

Recorded result:

- `src/core/contracts/runtime-result.ts` still exports `RuntimeTaskAction`, `RuntimeTaskSignal`, and the public `taskActions` / `taskSignals` compatibility fields.
- `src/core/runtime/runtime-dispatch.ts` still carries `selectRuntimeTaskInputs()` as the only split-field folding helper.
- `src/core/runtime/mod-first-compatibility.ts` still imports `RuntimeTaskAction` / `RuntimeTaskSignal` and rebuilds `ModFirstRuntimeTaskInput` from those legacy names.
- tests still cover the split task-input seam through `tests/runtime-dispatch-settlement.test.cjs` and source assertions in `tests/robustness.test.cjs`.
- `docs/superpowers/project-progress.md` still tracks an unrelated map-renderer child and should remain unsynced unless the user explicitly asks to repoint it.

- [x] **Step 2: Update the child plan with the audited write scope**

Document:

- that this child deletes the remaining split task-input seam instead of preserving fallback behavior
- which tests must fail before production edits begin

- [x] **Step 3: Sync the parent handoff with the new active child**

Update the handoff plan so it points at this child as the next adjacent runtime-only slice on top of the local dispatch/router checkpoint.

## Task 2: Add Failing Single-Seam Coverage

**Files:**
- Modify: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Replace split-field compatibility expectations with single-seam expectations**

Add or update tests so they require:

- `RuntimeResult` not to expose `taskActions` / `taskSignals`
- `runtime-dispatch` not to expose `selectRuntimeTaskInputs()`
- split task input fields to no longer be treated as a supported runtime settlement seam

- [x] **Step 2: Run the focused tests to verify RED**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs
pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch settles routed canonical taskInputs into unified task state|runtime task input single seam removes split compatibility surfaces|child 33 event runtime task input contract stays canonical-first"
```

Expected:

- at least one new assertion fails against the current split-field compatibility seam
- the failure points at public split task-input fields or the dispatch folding helper still existing

## Task 3: Implement Single-Seam Task Input Convergence

**Files:**
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `src/core/runtime/mod-first-compatibility.ts`

- [x] **Step 1: Remove legacy split task input names and fields from the public contract**

Keep canonical `RuntimeTaskInput`, but delete:

- `RuntimeTaskAction`
- `RuntimeTaskSignal`
- `RuntimeResult.taskActions`
- `RuntimeResult.taskSignals`

- [x] **Step 2: Remove split-field folding from runtime-dispatch**

Delete `selectRuntimeTaskInputs()` and make dispatch settle only:

```ts
taskInputs: routed.taskInputs
```

- [x] **Step 3: Switch mod-first compatibility to canonical RuntimeTaskInput**

Replace old alias imports and derived union names so mod-first compatibility uses `RuntimeTaskInput` directly.

- [x] **Step 4: Run targeted verification and sync docs**

Run the required verification commands, then update this child plan with exact outcomes and resume point.

## Exit Check

- [x] `RuntimeResult` exposes only canonical `taskInputs` for task input ownership.
- [x] `runtime-dispatch` no longer carries split task-input folding helpers.
- [x] `mod-first-compatibility` references only canonical `RuntimeTaskInput`.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [ ] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Task Input Single Seam Convergence`
- Parent Task: `Mod First Runtime Integration Handoff`
- Parent Stage: `Runtime Migration Narrowing`
- Closeout Status: `not-started`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Decide whether to commit/push the batched local runtime checkpoint now or continue with another adjacent runtime-only child from the fully single-seam task-input baseline.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-task-input-single-seam-convergence-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Review the local single-seam runtime checkpoint, restore incidental pnpm-lock drift if needed, then either commit/push it or open the next adjacent runtime-only child.`
