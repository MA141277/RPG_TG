# Runtime Task Input Contract Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge runtime task signaling onto canonical `taskInputs` while preserving any still-required compatibility outputs and avoiding `src/main.ts`, UI, map, backpack, or style changes.

**Architecture:** The current runtime stack already demonstrates that `dispatchRuntimeRequest()` can settle unified `taskInputs`, but `RuntimeResult`, event/runtime helper contracts, and a few tests still carry legacy split input fields such as `taskActions` and `taskSignals`. This child keeps the work inside `src/core/contracts/**`, `src/core/runtime/**`, and focused tests so task signaling becomes more uniform without reopening shell or visible behavior boundaries.

**Tech Stack:** TypeScript, Vite test build, Node test runner, targeted runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-30`
- Current Focus: `Task 2 and the code portion of Task 3 are complete: runtime-dispatch now treats split taskActions/taskSignals as fallback-only when canonical taskInputs are present, and event-runtime / event-activation now expose taskInputs instead of taskActions.`
- Next Step: `Run Task 4 verification, sync the parent handoff, and record the exact push-ready checkpoint for this child.`
- Verification: `Targeted verification is green for pnpm run build:test, tests/runtime-dispatch-settlement.test.cjs, and focused robustness assertions covering child 33 plus the previously migrated child 16/25 follow-up boundaries. Full tests/robustness.test.cjs still has one unrelated pre-existing failure: "runtime router contract exports a formal routing seam" expects RuntimeResult instead of the now-exported RuntimeRouteResult alias.`
- Notes: `Do not touch src/main.ts, src/ui/**, map, backpack, or styles. Keep taskUpdates unless targeted tests prove they can be narrowed safely; this child is about converging task input channels first.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child for task-input contract convergence after merge-back of the follow-up contract slice.`
  - Verification: `Audit-only queries over RuntimeResult, event-runtime, runtime-dispatch, event-activation, and runtime-dispatch-settlement test coverage showed taskInputs are already the preferred settled input path while taskActions/taskSignals remain as legacy runtime inputs in core contracts and tests.`
  - Next: `Run Task 1 and record exactly which legacy task input fields still need to remain versus which can be narrowed in this slice.`
- 2026-07-30
  - Summary: `Completed Task 1 audit. taskInputs are already the canonical settled path in runtime-dispatch and the focused settlement test, but split taskActions/taskSignals are still carried by RuntimeResult, EventRuntimeCandidate, ActivatedEvent, and compatibility merging inside settleRuntimeTasks().`
  - Verification: `sed -n '1,220p' src/core/contracts/runtime-result.ts`; `sed -n '1,220p' src/core/contracts/event-runtime.ts`; `sed -n '1,220p' src/core/runtime/event-activation.ts`; `sed -n '1,260p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,260p' tests/runtime-dispatch-settlement.test.cjs`; `rg -n "taskActions\\?:|taskSignals\\?:|taskUpdates\\?:|taskInputs\\?:|taskInputs:|taskActions:|taskSignals:|taskUpdates:" src tests | head -n 250`.`
  - Next: `Add failing tests that make taskInputs canonical and split taskActions/taskSignals explicitly compatibility-only before changing runtime code.`
- 2026-07-30
  - Summary: `Completed Task 2 and the implementation part of Task 3. Added a RED test proving canonical taskInputs suppress split compatibility channels when present, added a focused robustness guard for the event-runtime task-input contract, then narrowed runtime-dispatch to canonical-first fallback and converged event-runtime / event-activation from taskActions to taskInputs.`
  - Verification: `pnpm run build:test`; `pnpm exec node --test tests/runtime-dispatch-settlement.test.cjs`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "child 33 event runtime task input contract stays canonical-first|child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator"`.`
  - Next: `Run typecheck, boundary diff, git diff --check, and lint:plans; then sync the parent handoff and prepare the push-ready commit.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The aligned local receiving branch is `codex/sync-naqishuo-721ui-to-mmz-followup`, which now sits at the same merge-back commit `92769f3` as the current branch and `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - The redundant local branch `codex/sync-naqishuo-721ui-to-mmz` has been deleted.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit canonical versus legacy task input channels across runtime contracts
- add focused failing tests for taskInputs as the canonical settled input surface
- narrow runtime-dispatch and nearby contracts away from split `taskActions` / `taskSignals` where safe
- keep task settlement behavior unchanged
- keep existing migrated ownership assertions green
- update this child plan and the handoff plan with the exact resume point

### Still Out Of Scope

- `src/main.ts` or any entry-shell rewiring
- UI, map, backpack, or style changes
- new production caller wiring for event-owned playable completion
- follow-up contract deletion beyond what was already completed in the previous child
- removing `taskUpdates` output unless targeted tests prove it is safe in the same slice

## File Map

### Existing files to modify

- `src/core/contracts/runtime-result.ts`
  - Canonical task input surface and retained compatibility fields.
- `src/core/contracts/event-runtime.ts`
  - Event runtime candidate contract that still carries split task action input.
- `src/core/runtime/event-activation.ts`
  - Event activation compatibility normalization.
- `src/core/runtime/runtime-dispatch.ts`
  - Task settlement input handling and compatibility narrowing.
- `tests/runtime-dispatch-settlement.test.cjs`
  - Canonical taskInputs settlement behavior and any retained compatibility fallback assertions.
- `tests/robustness.test.cjs`
  - Narrow contract assertions only if needed.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync for the new child.
- `docs/superpowers/plans/2026-07-30-runtime-task-input-contract-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected.`

## Verification Plan

- Targeted verification:
  - `dispatchRuntimeRequest()` continues to settle canonical `taskInputs`
  - any retained split task input compatibility remains explicit and test-guarded
  - migrated follow-up/runtime ownership assertions stay green
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `pnpm run build:test`
  - `node --test tests/runtime-dispatch-settlement.test.cjs`
  - `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`
  - `pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `pnpm run lint:plans`

## Task 1: Recheck Canonical And Compatibility Task Input Ownership

**Files:**
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/contracts/event-runtime.ts`
- Read: `src/core/runtime/event-activation.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-task-input-contract-convergence-plan.md`

- [x] **Step 1: Record the exact canonical versus compatibility task input shape**

Run:

```bash
sed -n '1,220p' src/core/contracts/runtime-result.ts
sed -n '1,220p' src/core/contracts/event-runtime.ts
sed -n '1,220p' src/core/runtime/event-activation.ts
sed -n '1,260p' src/core/runtime/runtime-dispatch.ts
sed -n '1,260p' tests/runtime-dispatch-settlement.test.cjs
```

Expected:

- identify the current canonical `taskInputs` surface
- identify every retained split compatibility field (`taskActions`, `taskSignals`, and any contract that still emits them)
- record whether dispatch still merges more than one task input channel before settlement

Recorded result:

- `src/core/contracts/runtime-result.ts` already exposes `taskInputs` and the focused dispatch-settlement test proves `dispatchRuntimeRequest()` can settle task work with `taskInputs` alone.
- The same `RuntimeResult` still retains split compatibility fields `taskActions` and `taskSignals`, plus `taskUpdates` output.
- `src/core/contracts/event-runtime.ts` still models `EventRuntimeCandidate.taskActions`.
- `src/core/runtime/event-activation.ts` still returns `ActivatedEvent.taskActions` and normalizes only `candidate.taskActions`.
- `src/core/runtime/runtime-dispatch.ts` still merges three channels before settlement: `taskInputs`, `taskActions`, and `taskSignals`.
- The current focused tests prove canonical taskInputs work, but they do not yet assert that split taskActions/taskSignals are compatibility-only rather than co-equal primary channels.

- [x] **Step 2: Update the child plan with the audited write scope**

Document:

- which split task input fields must remain after the audit
- which legacy paths can be narrowed but not deleted in this slice
- which failing tests should be written first before implementation starts

Audited write scope:

- Compatibility fields that must remain unless Task 2 disproves usage: `RuntimeResult.taskActions`, `RuntimeResult.taskSignals`, `EventRuntimeCandidate.taskActions`, and `ActivatedEvent.taskActions`.
- Legacy paths that can be narrowed but should not be deleted in this slice: the compatibility merge of `taskActions` / `taskSignals` into `settleRuntimeTasks()`, and the wording/tests that still treat split task input fields as first-class peers instead of compatibility-only seams.
- The first failing tests should be:
  - `tests/runtime-dispatch-settlement.test.cjs` extended so it asserts taskInputs are canonical and split taskActions/taskSignals remain retained only as explicit compatibility surface.
  - A second dispatch-focused assertion that fails until production code labels or narrows split task input compatibility handling.

- [x] **Step 3: Sync the parent handoff with the new active child**

Update the handoff plan so it points at this child as the next runtime-only convergence slice and no longer treats the follow-up contract child as the active checkpoint.

## Task 2: Add Focused Failing Task Input Coverage

**Files:**
- Modify: `tests/runtime-dispatch-settlement.test.cjs`
- Modify: `tests/robustness.test.cjs` only if a narrow contract assertion needs extension

- [x] **Step 1: Add a failing dispatch task-input contract test**

Add a test that proves canonical `taskInputs` are sufficient while split task input fields are compatibility-only, for example:

```js
test("dispatchRuntimeRequest does not require split taskActions and taskSignals once canonical taskInputs are present", () => {
  // route with taskInputs only
  // expect task settlement succeeds
});
```

Then add a second assertion that explicitly fails until the production source labels or narrows split compatibility handling.

- [x] **Step 2: Run the new test to verify it fails for the expected reason**

Run:

```bash
pnpm run build:test
node --test tests/runtime-dispatch-settlement.test.cjs
```

Expected:

- at least one new assertion fails against the pre-implementation contract
- the failure points at split task input compatibility still being treated as a primary peer instead of an explicit fallback

## Task 3: Implement The Runtime-Only Task Input Convergence

**Files:**
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/contracts/event-runtime.ts`
- Modify: `src/core/runtime/event-activation.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`

- [x] **Step 1: Clarify canonical and compatibility task input fields in runtime-result**

Implement the smallest change that keeps canonical and compatibility input layers explicit, for example:

```ts
export type RuntimeResult = {
  taskInputs?: RuntimeTaskInput[];
  // compatibility-only legacy split task input surfaces
  taskActions?: RuntimeTaskAction[];
  taskSignals?: RuntimeTaskSignal[];
};
```

- [x] **Step 2: Narrow nearby runtime contracts onto taskInputs where safe**

If the audit proves a producer can emit `taskInputs` directly without behavior change, narrow it. For example, replace a split contract like:

```ts
taskActions?: RuntimeTaskAction[];
```

with:

```ts
taskInputs?: RuntimeTaskInput[];
```

only when the owning code already normalizes through `taskInputs`.

- [x] **Step 3: Keep runtime-dispatch canonical-first for task settlement**

Preserve settlement behavior while minimizing split input merging. If compatibility merging still needs to remain, make it explicit and secondary.

- [ ] **Step 4: Keep the write scope fail-closed**

Do not touch:

- `src/main.ts`
- `src/ui/**`
- `src/components/**`
- `src/application/map/**`
- `src/application/backpack/**`
- `src/domain/map/**`
- `src/domain/backpack/**`
- `src/styles/**`

## Task 4: Verify, Sync Docs, And Prepare The Commit Checkpoint

**Files:**
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-task-input-contract-convergence-plan.md`

- [ ] **Step 1: Run the required verification**

Run:

```bash
pnpm run build:test
node --test tests/runtime-dispatch-settlement.test.cjs
node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs
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

- [ ] **Step 2: Record verification and exact boundary outcome**

Update both plans with:

- pass/fail results
- whether split task input fields were retained or narrowed
- confirmation that protected paths remained untouched
- the exact next unchecked task or merge checkpoint

- [ ] **Step 3: Commit and push the runtime-only slice**

Run:

```bash
git status --short
git add src/core/contracts/runtime-result.ts src/core/contracts/event-runtime.ts src/core/runtime/event-activation.ts src/core/runtime/runtime-dispatch.ts tests/runtime-dispatch-settlement.test.cjs tests/robustness.test.cjs docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md docs/superpowers/plans/2026-07-30-runtime-task-input-contract-convergence-plan.md
git commit -m "merge: converge runtime task input contract"
git push
```

Report:

- implemented runtime-only task input convergence
- verification commands and results
- whether split task input compatibility was retained
- whether the slice is ready for merge-back or should remain as a branch checkpoint

## Exit Check

- [ ] `taskInputs` remains the canonical settled task input surface and is directly tested.
- [ ] Any retained split task input compatibility remains explicit and secondary.
- [ ] No unapproved changes landed in `src/main.ts`, UI, map, backpack, or styles.
- [ ] Existing migrated ownership assertions remain green and do not regress to older seams.
- [ ] The child plan and parent handoff both record the exact post-slice resume point.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
