# Runtime Dispatch Task Input Compatibility Narrowing Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Narrow `runtime-dispatch` so canonical `taskInputs` are the only internal settlement seam, while preserving external `RuntimeResult.taskActions` / `taskSignals` compatibility behavior until a later child explicitly removes those legacy fields.

**Architecture:** After `runtime-task-input-contract-convergence` and `scene-runtime-task-input-convergence`, all active runtime producers already emit canonical `taskInputs`. The remaining split task seam is localized to `RuntimeResult` compatibility fields and `runtime-dispatch`, which still threads `taskActions` / `taskSignals` through `dispatchRuntimeRequest()` and `settleRuntimeTasks()`. This child should not delete compatibility fields from `RuntimeResult`; it should only narrow dispatch internals so the legacy split inputs are folded into canonical `taskInputs` at one boundary before settlement.

**Tech Stack:** TypeScript, Vite test build, Node test runner, targeted runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Runtime-dispatch task-input compatibility narrowing is implemented and locally verified. dispatchRuntimeRequest() now folds split compatibility fields into canonical taskInputs before settlement, settleRuntimeTasks() accepts canonical taskInputs only, and RuntimeResult compatibility fields remain unchanged.`
- Next Step: `Decide whether to commit/push this verified runtime-only checkpoint now or continue batching another adjacent child on top of the local changes.`
- Verification: `pnpm run build:test`; `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch task input compatibility narrowing|runtime dispatch settles routed task actions and signals into unified task state|dispatchRuntimeRequest treats split task action and signal fields as fallback-only when canonical taskInputs are present|child 33 event runtime task input contract stays canonical-first"`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` passed; `pnpm run lint:plans` still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue; the broader targeted robustness invocation still carries the known unrelated runtime-router route-result alias assertion.`
- Notes: `Do not touch src/main.ts, UI, map, backpack, or styles. Do not remove RuntimeResult.taskActions/taskSignals in this child. docs/superpowers/project-progress.md remains intentionally unsynced because it still tracks an unrelated map-renderer child and the user has not asked to repoint it.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child after scene-runtime task input convergence merged back at 81becd1.`
  - Verification: `git status --short --branch`; `sed -n '1,220p' docs/superpowers/project-progress.md`; `sed -n '1,220p' src/core/contracts/runtime-result.ts`; `sed -n '1,260p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,260p' tests/runtime-dispatch-settlement.test.cjs`; `rg -n "taskActions|taskSignals|taskInputs" src/core/contracts src/core/runtime tests | head -n 200`.`
  - Next: `Record the exact remaining compatibility ownership and add a RED assertion before production edits.`
- 2026-07-30
  - Summary: `Completed Task 2 and Task 3 for runtime-dispatch task-input compatibility narrowing. Added a RED source assertion for the narrowed dispatch seam, extended settlement coverage for legacy-fallback behavior, and then moved compatibility folding to dispatchRuntimeRequest() so settleRuntimeTasks() now consumes canonical taskInputs only.`
  - Verification: `pnpm run build:test`; `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch task input compatibility narrowing|runtime dispatch settles routed task actions and signals into unified task state|dispatchRuntimeRequest treats split task action and signal fields as fallback-only when canonical taskInputs are present|child 33 event runtime task input contract stays canonical-first"`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `pnpm run lint:plans`.`
  - Next: `Decide whether to commit/push this local checkpoint or continue batching another adjacent runtime-only child first.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-task-input-contract-convergence-plan.md`
  - `docs/superpowers/plans/2026-07-30-scene-runtime-task-input-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The aligned local receiving branch is `codex/sync-naqishuo-721ui-to-mmz-followup`, and the merge-back baseline across local/remote is currently `81becd1`.
  - All active runtime producers already emit canonical `taskInputs`; the remaining split seam is now limited to `RuntimeResult` compatibility fields and `src/core/runtime/runtime-dispatch.ts`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit the remaining `runtime-dispatch` split task compatibility seam
- add focused failing tests that require dispatch internals to settle canonical `taskInputs` only
- narrow `dispatchRuntimeRequest()` and `settleRuntimeTasks()` so compatibility folding happens once before settlement
- preserve fallback behavior for legacy `taskActions` / `taskSignals` inputs when canonical `taskInputs` are absent
- update this child plan and the parent handoff with the exact resume point

### Still Out Of Scope

- removing `RuntimeResult.taskActions` or `RuntimeResult.taskSignals`
- changing task settlement semantics or task-runtime behavior
- `src/main.ts`, UI, map, backpack, or style changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `src/core/runtime/runtime-dispatch.ts`
  - Narrow settlement internals so only canonical `taskInputs` cross the dispatch-to-settlement seam.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Keep behavioral coverage for canonical-first and legacy-fallback task settlement.
- `tests/robustness.test.cjs`
  - Add a source-level ownership assertion for the narrowed dispatch seam.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the parent handoff with this new child.
- `docs/superpowers/plans/2026-07-30-runtime-dispatch-task-input-compatibility-narrowing-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `runtime-dispatch` settles canonical `taskInputs` through one internal seam
  - split `taskActions` / `taskSignals` still behave as fallback-only when canonical `taskInputs` are absent
  - canonical `taskInputs` stay first-class when both canonical and legacy fields coexist
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `pnpm run build:test`
  - `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`
  - `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch task input compatibility narrowing|runtime dispatch settles routed task actions and signals into unified task state|dispatchRuntimeRequest treats split task action and signal fields as fallback-only when canonical taskInputs are present|child 33 event runtime task input contract stays canonical-first"`
  - `pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `pnpm run lint:plans`

## Task 1: Audit Remaining Runtime Dispatch Compatibility Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-dispatch-task-input-compatibility-narrowing-plan.md`

- [x] **Step 1: Record the exact remaining split compatibility seam**

Run:

```bash
git status --short --branch
sed -n '1,220p' docs/superpowers/project-progress.md
sed -n '1,220p' src/core/contracts/runtime-result.ts
sed -n '1,260p' src/core/runtime/runtime-dispatch.ts
sed -n '1,260p' tests/runtime-dispatch-settlement.test.cjs
rg -n "taskActions|taskSignals|taskInputs" src/core/contracts src/core/runtime tests | head -n 200
```

Expected:

- identify where legacy split task fields are still threaded through dispatch internals
- confirm active producers already emit canonical `taskInputs`
- confirm project-progress remains unrelated and should stay unsynced

Recorded result:

- `src/core/contracts/runtime-result.ts` still exposes compatibility-only `taskActions` and `taskSignals` alongside canonical `taskInputs`.
- `src/core/runtime/runtime-dispatch.ts` still passes `routed.taskActions` and `routed.taskSignals` into `settleRuntimeTasks()` and still types that settlement helper against all three fields.
- `selectRuntimeTaskInputs()` already contains the desired compatibility-folding rule, but it currently lives inside settlement instead of at the dispatch boundary.
- `tests/runtime-dispatch-settlement.test.cjs` already covers canonical `taskInputs` and canonical-first fallback behavior; `tests/robustness.test.cjs` still carries the legacy fallback-only behavior assertion.
- `docs/superpowers/project-progress.md` still tracks an unrelated map-renderer child and should remain unsynced unless the user explicitly asks to repoint it.

- [x] **Step 2: Update the child plan with the audited write scope**

Document:

- which internal dispatch seams can be narrowed in this child
- which compatibility fields must remain untouched for now
- which RED tests should fail before implementation begins

- [x] **Step 3: Sync the parent handoff with the new active child**

Update the handoff plan so it points at this child as the next runtime-only convergence slice after scene-runtime task input convergence merge-back.

## Task 2: Add Focused Failing Dispatch Compatibility Coverage

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a failing dispatch ownership assertion**

Add a focused RED assertion that requires:

- `dispatchRuntimeRequest()` to fold compatibility inputs into canonical `taskInputs` before settlement
- `settleRuntimeTasks()` to accept canonical `taskInputs` only
- the old direct `taskActions` / `taskSignals` settlement seam to disappear from the helper signature

- [x] **Step 2: Run the new test to verify it fails for the expected reason**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime dispatch task input compatibility narrowing|child 33 event runtime task input contract stays canonical-first"
```

Expected:

- at least one new assertion fails against the pre-implementation dispatch structure
- the failure points at `runtime-dispatch` still threading split compatibility fields directly into `settleRuntimeTasks()`

## Task 3: Implement Runtime Dispatch Compatibility Narrowing

**Files:**
- Modify: `src/core/runtime/runtime-dispatch.ts`
- Modify: `tests/runtime-dispatch-settlement.test.cjs`

- [x] **Step 1: Narrow the dispatch-to-settlement seam to canonical taskInputs**

Implement the smallest change that makes dispatch fold compatibility inputs once before settlement, for example:

```ts
const taskSettlement = settleRuntimeTasks({
  state: effectSettlement.state,
  taskInputs: selectRuntimeTaskInputs(routed),
  taskDefinitionsById: input.context.taskDefinitionsById,
});
```

- [x] **Step 2: Preserve explicit fallback behavior in focused tests**

Keep or extend focused tests so:

- legacy split fields still settle tasks when canonical `taskInputs` are absent
- canonical `taskInputs` remain first-class when both field styles coexist

- [x] **Step 3: Run targeted verification and sync docs**

Run the required verification commands, then update this child plan with exact outcomes and resume point.

## Exit Check

- [x] `runtime-dispatch` settles through canonical `taskInputs` only at the internal helper seam.
- [x] Legacy split `taskActions` / `taskSignals` behavior remains available as compatibility fallback only.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [ ] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Dispatch Task Input Compatibility Narrowing`
- Parent Task: `Mod First Runtime Integration Handoff`
- Parent Stage: `Runtime Migration Narrowing`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `Runtime Router Formal Seam Alias Alignment`
- Next Child Status: `completed-but-open`
- Next Required Action: `Review the batched local checkpoint that now includes runtime-dispatch narrowing plus runtime-router alias alignment, then decide whether to commit/push it or continue batching another adjacent runtime-only child.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-router-formal-seam-alias-alignment-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Stay on codex/migration-hot-tasks, review the batched local checkpoint, then decide whether to commit/push it or continue with another adjacent runtime-only child.`
