# Runtime Router Formal Seam Alias Alignment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the stale robustness contract assertion with the current runtime-router formal seam, where `RuntimeRouter.route()` returns the exported alias `RuntimeRouteResult` and that alias remains defined as `RuntimeResult`.

**Architecture:** This is a narrow runtime-contract cleanup child. `src/core/runtime/runtime-router.ts` already exposes `RuntimeRouteInput`, `RuntimeRouteResult = RuntimeResult`, and `RuntimeRouter.route(input): RuntimeRouteResult`. The mismatch is in `tests/robustness.test.cjs`, which still asserts a direct `RuntimeResult` return instead of the explicit alias seam. This child should not widen runtime behavior or change UI/main-shell paths; it should only converge the source-level ownership assertion with the already-canonical runtime-router contract.

**Tech Stack:** TypeScript source assertions, Node test runner, focused robustness/runtime-router contract tests, `pnpm run build:test`, `pnpm exec node --test`, `pnpm run typecheck`, guarded boundary diff checks, `git diff --check`, and `pnpm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-30`
- Current Focus: `Runtime-router formal seam alias alignment is implemented and locally verified. tests/robustness.test.cjs now asserts the explicit RuntimeRouteResult alias seam, runtime-router follow-up contract tests remain green, and the broader robustness suite no longer carries the old route-result alias failure.`
- Next Step: `Decide whether to commit/push the batched local checkpoint now or continue batching another adjacent runtime-only child on top of it.`
- Verification: `pnpm run build:test`; `pnpm exec node --test tests/runtime-router-follow-up-contract.test.cjs`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router contract exports a formal routing seam|shared dispatch consumes the hardened runtime router contract"`; `pnpm exec node --test tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned empty output; `git diff --check` passed; `pnpm run lint:plans` still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue.`
- Notes: `Do not touch src/main.ts, UI, map, backpack, or styles. Do not change runtime-router runtime behavior unless the audit proves the alias seam itself is wrong. docs/superpowers/project-progress.md remains intentionally unsynced because it still tracks an unrelated map-renderer child and the user has not asked to repoint it.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the next adjacent runtime-only child on top of the local runtime-dispatch narrowing checkpoint to eliminate the known runtime-router formal-seam alias mismatch from the broader robustness subset.`
  - Verification: `git status --short --branch`; `sed -n '1,220p' docs/superpowers/project-progress.md`; `sed -n '1,220p' docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`; `sed -n '1,160p' src/core/runtime/runtime-router.ts`; `sed -n '1,120p' tests/runtime-router-follow-up-contract.test.cjs`; `sed -n '14718,14740p' tests/robustness.test.cjs`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router contract exports a formal routing seam"`.`
  - Next: `Align the stale robustness assertion with the explicit RuntimeRouteResult alias seam, then rerun focused verification.`
- 2026-07-30
  - Summary: `Completed Task 2 for the runtime-router alias-alignment child. Narrowed the stale robustness assertion from a direct RuntimeResult expectation to the explicit RuntimeRouteResult alias seam, leaving runtime-router production source unchanged.`
  - Verification: `pnpm run build:test`; `pnpm exec node --test tests/runtime-router-follow-up-contract.test.cjs`; `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router contract exports a formal routing seam|shared dispatch consumes the hardened runtime router contract"`; `pnpm exec node --test tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`; `pnpm run lint:plans`.`
  - Next: `Decide whether to commit/push this batched local checkpoint or continue with another adjacent runtime-only child first.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/superpowers/plans/2026-07-30-runtime-dispatch-task-input-compatibility-narrowing-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The local checkpoint already includes uncommitted runtime-dispatch narrowing changes plus plan sync; this child batches on top of that same local checkpoint.
  - `src/core/runtime/runtime-router.ts` and `tests/runtime-router-follow-up-contract.test.cjs` already agree on the alias seam, so the stale contract expectation is isolated to `tests/robustness.test.cjs`.
  - `pnpm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that blocker is separately fixed.

## Implementation Scope

### In Scope

- audit the current runtime-router formal seam and the stale robustness assertion
- narrow the robustness assertion to `RuntimeRouteResult`
- sync this child plan and the parent handoff with the updated resume point
- rerun focused runtime-router verification

### Still Out Of Scope

- changing runtime-router runtime behavior
- changing dispatch/follow-up behavior
- removing other compatibility fields from `RuntimeResult`
- `src/main.ts`, UI, map, backpack, or style changes
- repointing `docs/superpowers/project-progress.md`

## File Map

### Existing files to modify

- `tests/robustness.test.cjs`
  - Align the stale formal-seam source assertion with the canonical runtime-router alias seam.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Sync the parent handoff with this new adjacent child.
- `docs/superpowers/plans/2026-07-30-runtime-router-formal-seam-alias-alignment-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None beyond this child plan.`

## Verification Plan

- Targeted verification:
  - `runtime-router` formal seam remains explicit via `RuntimeRouteResult`
  - the stale broader robustness assertion no longer expects a direct `RuntimeResult`
  - runtime-router follow-up contract coverage remains green
  - protected shell/UI/map/backpack/style paths remain untouched
- Required commands:
  - `pnpm run build:test`
  - `pnpm exec node --test tests/runtime-router-follow-up-contract.test.cjs`
  - `pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router contract exports a formal routing seam|shared dispatch consumes the hardened runtime router contract"`
  - `pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `pnpm run lint:plans`

## Task 1: Audit Runtime Router Formal Seam Ownership

**Files:**
- Read: `docs/superpowers/project-progress.md`
- Read: `src/core/runtime/runtime-router.ts`
- Read: `tests/runtime-router-follow-up-contract.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-router-formal-seam-alias-alignment-plan.md`

- [x] **Step 1: Record the exact alias mismatch**

Run:

```bash
git status --short --branch
sed -n '1,220p' docs/superpowers/project-progress.md
sed -n '1,160p' src/core/runtime/runtime-router.ts
sed -n '1,120p' tests/runtime-router-follow-up-contract.test.cjs
sed -n '14718,14740p' tests/robustness.test.cjs
pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router contract exports a formal routing seam"
```

Expected:

- confirm runtime-router exports the formal alias seam already
- confirm the failing assertion is stale rather than the production contract
- confirm project-progress remains unrelated and should stay unsynced

Recorded result:

- `src/core/runtime/runtime-router.ts` exports `RuntimeRouteResult = RuntimeResult` and `RuntimeRouter.route(input: RuntimeRouteInput): RuntimeRouteResult`.
- `tests/runtime-router-follow-up-contract.test.cjs` already asserts the alias seam explicitly.
- `tests/robustness.test.cjs` still expects `/route\(input: RuntimeRouteInput\): RuntimeResult/`, which fails against the current source.
- `docs/superpowers/project-progress.md` still tracks an unrelated map-renderer child and should remain unsynced unless the user explicitly asks to repoint it.

- [x] **Step 2: Update the child plan with the audited write scope**

Document:

- that this child should narrow the stale assertion rather than rewrite runtime-router
- which verifications must be rerun after the assertion update

- [x] **Step 3: Sync the parent handoff with the new active child**

Update the handoff plan so it points at this child as the next adjacent runtime-only slice on top of the local dispatch-narrowing checkpoint.

## Task 2: Narrow The Stale Robustness Assertion

**Files:**
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Replace the stale direct-result expectation with the explicit alias seam**

Update the source assertion so it expects:

- `export type RuntimeRouteResult = RuntimeResult`
- `route(input: RuntimeRouteInput): RuntimeRouteResult`

- [x] **Step 2: Run the focused tests to verify the alias-aligned assertion is green**

Run:

```bash
pnpm run build:test
pnpm exec node --test tests/runtime-router-follow-up-contract.test.cjs
pnpm exec node --test tests/robustness.test.cjs --test-name-pattern "runtime router contract exports a formal routing seam|shared dispatch consumes the hardened runtime router contract"
```

Expected:

- the previous stale assertion failure disappears
- runtime-router follow-up contract coverage remains green

## Exit Check

- [x] `tests/robustness.test.cjs` no longer expects a stale direct RuntimeResult return for RuntimeRouter.route().
- [x] `src/core/runtime/runtime-router.ts` remains unchanged unless the audit disproves the alias seam.
- [x] Protected shell/UI/map/backpack/style boundaries remain untouched.
- [ ] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Runtime Router Formal Seam Alias Alignment`
- Parent Task: `Mod First Runtime Integration Handoff`
- Parent Stage: `Runtime Migration Narrowing`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Review the batched local checkpoint and decide whether to commit/push it now or continue with another adjacent runtime-only child.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-30-runtime-router-formal-seam-alias-alignment-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Stay on codex/migration-hot-tasks, review the batched local checkpoint, then decide whether to commit/push it or continue with another adjacent runtime-only child.`
