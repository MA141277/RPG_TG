# Runtime Follow-Up Contract Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge the runtime follow-up/result contract onto a clearly tested canonical `followUp` path while preserving compatibility fields required by the current baseline and avoiding any `src/main.ts` or UI-facing change.

**Architecture:** This child exists because the runtime migration branch already moved several active behaviors onto shared story/runtime seams, but the core follow-up contract still mixes canonical and legacy handling. The slice stays inside `src/core/contracts/runtime-result.ts`, `src/core/runtime/runtime-router.ts`, `src/core/runtime/runtime-dispatch.ts`, and focused tests so the next migration steps inherit a cleaner runtime-only contract without reopening entry-shell or visible behavior work.

**Tech Stack:** TypeScript, Vite test build, Node test runner, targeted runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm run typecheck`, `git diff --check`, guarded boundary diff checks, and `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-30`
- Current Focus: `Task 1 audit is complete: followUp is already the canonical type alias, but runtime-result still exposes legacy outcome/interactive fields, runtime-router still exposes handleOutcome/handleInteractive compatibility handlers, and runtime-dispatch still mutates state through canonical followUp plus legacy outcome and interactive fallback paths.`
- Next Step: `Start Task 2 by adding failing contract tests that keep followUp canonical while explicitly asserting the retained compatibility surface and dispatch ordering before any runtime code change.`
- Verification: `Audit reads completed for src/core/contracts/runtime-result.ts, src/core/runtime/runtime-router.ts, src/core/runtime/runtime-dispatch.ts, tests/runtime-follow-up-contract.test.cjs, tests/runtime-router-follow-up-contract.test.cjs, and the relevant robustness follow-up ownership assertions; implementation verification has not run yet; pnpm run lint:plans still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue.`
- Notes: `Do not touch src/main.ts, src/ui/**, map, backpack, or styles. Do not remove a legacy field unless a targeted test first proves the current branch no longer needs it. The current audit shows outcome/interactive compatibility remains part of the live contract, so this slice should narrow and test those paths before deleting anything.`

## Progress Log

- 2026-07-30
  - Summary: `Opened the runtime follow-up contract convergence child from the new design spec so the next runtime-only slice can focus on canonical followUp ownership and compatibility guardrails instead of new caller wiring.`
  - Verification: `Design spec written at docs/superpowers/specs/2026-07-30-runtime-follow-up-contract-convergence-design.md and committed as fa70603; pnpm run lint:plans was re-run after saving this child and still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue; implementation verification not run yet.`
  - Next: `Run Task 1 contract audit, then add failing tests before touching runtime-result/runtime-router/runtime-dispatch.`
- 2026-07-30
  - Summary: `Completed Task 1 contract audit. followUp is already the canonical alias in runtime-result, but the current baseline still retains legacy outcome/interactive fields in RuntimeResult, handleOutcome/handleInteractive in RuntimeFollowUpContext, and explicit fallback branches in runtime-dispatch after canonical handleFollowUp runs.`
  - Verification: `sed -n '1,220p' src/core/contracts/runtime-result.ts`; `sed -n '1,220p' src/core/runtime/runtime-router.ts`; `sed -n '1,320p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,220p' tests/runtime-follow-up-contract.test.cjs`; `sed -n '1,220p' tests/runtime-router-follow-up-contract.test.cjs`; `sed -n '15530,15595p' tests/robustness.test.cjs`; `sed -n '17440,17490p' tests/robustness.test.cjs`; `git status --short --branch`.`
  - Next: `Add failing tests that assert followUp stays canonical while outcome/interactive remain explicit compatibility-only surfaces and runtime-dispatch preserves canonical-first ordering before the fallback handlers.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-30-runtime-follow-up-contract-convergence-design.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch is `codex/migration-hot-tasks`.
  - Upstream is `origin/codex/migration-hot-tasks`.
  - The latest committed local change is documentation-only commit `fa70603` for the convergence design spec.
  - The earlier city-enter runtime follow-up child is already implemented and merged into the aligned baseline; this child must not reopen that seam.
  - `npm run lint:plans` is still expected to fail on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing a required top-level title heading unless that external blocker is separately fixed.

## Implementation Scope

### In Scope

- re-audit canonical versus legacy follow-up fields in `runtime-result`
- re-audit router/dispatch ownership and fallback ordering for follow-up handling
- add focused failing tests for canonical follow-up contract and retained compatibility surface
- implement the smallest runtime-only convergence in the three core files
- keep existing migrated ownership assertions green
- update this child plan and the handoff plan with the exact resume point

### Still Out Of Scope

- `src/main.ts` or any entry-shell rewiring
- UI, map, backpack, or style changes
- new production caller wiring for event-owned playable completion
- broad renaming waves copied from `origin/mod-first-dev`
- removing compatibility fields without targeted proof

## File Map

### Existing files to modify

- `src/core/contracts/runtime-result.ts`
  - Canonical follow-up and compatibility type surface.
- `src/core/runtime/runtime-router.ts`
  - Follow-up handler contract and compatibility entry points.
- `src/core/runtime/runtime-dispatch.ts`
  - Central follow-up handling order and state forwarding.
- `tests/runtime-follow-up-contract.test.cjs`
  - Canonical contract plus retained compatibility assertions.
- `tests/runtime-router-follow-up-contract.test.cjs`
  - Router/dispatch handler shape assertions.
- `tests/robustness.test.cjs`
  - Ownership assertions for already migrated follow-up paths.
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - Parent handoff sync for the new runtime-only child.
- `docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md`
  - This child plan.

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `None expected.`

## Verification Plan

- Targeted verification:
  - `RuntimeFollowUp` remains the canonical continuation contract.
  - Any retained legacy `interactive` / `outcome` compatibility surface is explicit and test-guarded.
  - `runtime-dispatch` handles canonical follow-up first and narrows fallback behavior without changing migrated ownership.
  - Existing migrated paths still stay outside `src/main.ts` and do not regress to `scene-runtime`.
- Required commands:
  - `pnpm run build:test`
  - `node --test tests/runtime-follow-up-contract.test.cjs tests/runtime-router-follow-up-contract.test.cjs`
  - `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`
  - `pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `npm run lint:plans`

## Task 1: Recheck Canonical And Compatibility Follow-Up Ownership

**Files:**
- Read: `src/core/contracts/runtime-result.ts`
- Read: `src/core/runtime/runtime-router.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `tests/runtime-follow-up-contract.test.cjs`
- Read: `tests/runtime-router-follow-up-contract.test.cjs`
- Read: `tests/robustness.test.cjs`
- Modify: `docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md`

- [ ] **Step 1: Record the exact canonical versus compatibility contract shape**
- [x] **Step 1: Record the exact canonical versus compatibility contract shape**

Run:

```bash
sed -n '1,220p' src/core/contracts/runtime-result.ts
sed -n '1,220p' src/core/runtime/runtime-router.ts
sed -n '1,320p' src/core/runtime/runtime-dispatch.ts
sed -n '1,220p' tests/runtime-follow-up-contract.test.cjs
sed -n '1,220p' tests/runtime-router-follow-up-contract.test.cjs
```

Expected:

- identify the current canonical `followUp` surface
- identify every retained legacy field and handler (`interactive`, `outcome`, `handleInteractive`, `handleOutcome`)
- record whether dispatch currently mutates state through more than one follow-up path

Recorded result:

- `src/core/contracts/runtime-result.ts` already defines `RuntimeFollowUp` as the canonical alias to `RuntimeInteractiveSignal` and exposes `followUp` on `RuntimeResult`.
- The same `RuntimeResult` still retains legacy compatibility fields `outcome` and `interactive`.
- `src/core/runtime/runtime-router.ts` still retains `RuntimeInteractiveFollowUpInput`, `RuntimeOutcomeFollowUpInput`, `RuntimeOutcomeFollowUpResult`, and compatibility handlers `handleInteractive` plus `handleOutcome` alongside canonical `handleFollowUp`.
- `src/core/runtime/runtime-dispatch.ts` currently mutates state through three follow-up branches in `settleRuntimeFollowUp()`: canonical `handleFollowUp` first, then `handleOutcome`, then `handleInteractive`, while task settling also still preserves `taskInputs` plus legacy `taskActions` and `taskSignals`.
- The existing contract tests currently assert retention of the legacy fields and handlers, but they do not yet assert that legacy surfaces are compatibility-only or that dispatch preserves canonical-first ordering.

- [x] **Step 2: Update the child plan with the audited write scope**

Document:

- which compatibility fields must remain after the audit
- which legacy paths can be narrowed but not deleted in this slice
- which tests will fail first before implementation starts

Audited write scope:

- Compatibility fields that must remain unless Task 2 disproves usage: `RuntimeResult.outcome`, `RuntimeResult.interactive`, `RuntimeFollowUpContext.handleOutcome`, `RuntimeFollowUpContext.handleInteractive`, and the associated router input/result types they depend on.
- Legacy paths that can be narrowed but should not be deleted in this slice: dispatch fallback handling for `outcome` and `interactive`, plus the wording and tests that currently treat legacy fields as peers instead of explicit compatibility surfaces.
- The first failing tests should be:
  - `tests/runtime-follow-up-contract.test.cjs` extended so it asserts `followUp` is the canonical continuation surface and `interactive` / `outcome` remain retained only as compatibility.
  - `tests/runtime-router-follow-up-contract.test.cjs` extended so it asserts the router keeps compatibility handlers visible while `runtime-dispatch` handles canonical follow-up before checking `outcome` and `interactive`.

- [x] **Step 3: Sync the parent handoff with the new active child**

Update the handoff plan so it points at this child as the next runtime-only convergence slice and no longer frames the city-enter child as the immediate review checkpoint.

## Task 2: Add Focused Failing Contract Coverage

**Files:**
- Modify: `tests/runtime-follow-up-contract.test.cjs`
- Modify: `tests/runtime-router-follow-up-contract.test.cjs`
- Modify: `tests/robustness.test.cjs` only if a narrow ownership assertion needs extension

- [ ] **Step 1: Add a failing runtime-result contract test**
- [ ] **Step 1: Add a failing runtime-result contract test**

Add assertions like:

```js
assert.match(source, /export type RuntimeFollowUp = RuntimeInteractiveSignal;/);
assert.match(source, /followUp\\?: RuntimeFollowUp \\| null;/);
assert.match(source, /interactive\\?: RuntimeInteractiveSignal \\| null;/);
assert.match(source, /outcome\\?: RuntimeFollowUpOutcome \\| null;/);
```

The test must make explicit:

- `followUp` is canonical
- retained legacy fields remain visible only as compatibility surface

Concrete first failure target:

- keep the existing field-presence assertions
- add a new assertion that the contract file groups `followUp` ahead of the retained legacy fields
- add a new assertion that the test description and regex comments treat `interactive` / `outcome` as compatibility-only surfaces instead of co-equal primary channels

- [ ] **Step 2: Add a failing router/dispatch contract test**

Add assertions like:

```js
assert.match(source, /handleFollowUp\\?\\(input: RuntimeFollowUpInput\\): RuntimeFollowUpResult;/);
assert.match(source, /handleInteractive\\?\\(input: RuntimeInteractiveFollowUpInput\\): RuntimeState;/);
assert.match(source, /handleOutcome\\?\\(input: RuntimeOutcomeFollowUpInput\\): RuntimeOutcomeFollowUpResult;/);
```

Then add a narrow dispatch source assertion that proves canonical follow-up handling occurs before any compatibility fallback path.

Concrete first failure target:

- keep the existing handler-shape assertions
- add a source assertion over `src/core/runtime/runtime-dispatch.ts` that requires the `handleFollowUp` branch to run before `handleOutcome`, and `handleOutcome` before `handleInteractive`
- add a second assertion that no legacy fallback branch runs unless canonical `followUp` is absent or `none`

- [ ] **Step 3: Run the new tests to confirm at least one assertion fails before implementation**

Run:

```bash
pnpm run build:test
node --test tests/runtime-follow-up-contract.test.cjs tests/runtime-router-follow-up-contract.test.cjs
```

Expected:

- at least one test fails against the pre-implementation contract
- failure clearly identifies the contract drift being corrected

## Task 3: Implement The Runtime-Only Convergence

**Files:**
- Modify: `src/core/contracts/runtime-result.ts`
- Modify: `src/core/runtime/runtime-router.ts`
- Modify: `src/core/runtime/runtime-dispatch.ts`

- [ ] **Step 1: Clarify the canonical and compatibility types in runtime-result**

Implement the smallest change that keeps canonical and compatibility layers explicit, for example:

```ts
export type RuntimeFollowUp = RuntimeInteractiveSignal;

export type RuntimeResult = {
  // canonical continuation surface
  followUp?: RuntimeFollowUp | null;
  // compatibility-only legacy continuation surfaces
  outcome?: RuntimeFollowUpOutcome | null;
  interactive?: RuntimeInteractiveSignal | null;
};
```

If the audit proves a compatibility field is still required, keep it and comment only through type grouping, not broad prose comments.

- [ ] **Step 2: Narrow router follow-up handling without breaking compatibility**

Keep canonical handler ownership explicit, for example:

```ts
export type RuntimeFollowUpContext = {
  handleFollowUp?(input: RuntimeFollowUpInput): RuntimeFollowUpResult;
  handleInteractive?(input: RuntimeInteractiveFollowUpInput): RuntimeState;
  handleOutcome?(input: RuntimeOutcomeFollowUpInput): RuntimeOutcomeFollowUpResult;
};
```

Only remove a legacy handler if Task 2 proved the current branch no longer needs it.

- [ ] **Step 3: Centralize canonical-first ordering in runtime-dispatch**

Preserve state forwarding while ensuring canonical follow-up wins first, for example:

```ts
if (
  followUp != null &&
  followUp.type !== "none" &&
  input.context?.handleFollowUp != null
) {
  const handled = input.context.handleFollowUp({ state, followUp });
  state = handled.state;
  characterDefinitions = handled.characterDefinitions;
  followUp = { type: "none" };
}
```

Then keep any required legacy `outcome` / `interactive` fallback explicit and secondary.

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
- Modify: `docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md`

- [ ] **Step 1: Run the required verification**

Run:

```bash
pnpm run build:test
node --test tests/runtime-follow-up-contract.test.cjs tests/runtime-router-follow-up-contract.test.cjs
node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs
pnpm run typecheck
git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles
git diff --check
npm run lint:plans
```

Expected:

- targeted tests pass
- typecheck passes
- boundary diff is empty
- `lint:plans` fails only on the known unrelated `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` title issue, unless that blocker is fixed separately

- [ ] **Step 2: Record verification and exact boundary outcome**

Update both plans with:

- pass/fail results
- whether any compatibility fields were retained or narrowed
- confirmation that protected paths remained untouched
- the exact next unchecked task or merge checkpoint

- [ ] **Step 3: Commit and push the runtime-only slice**

Run:

```bash
git status --short
git add src/core/contracts/runtime-result.ts src/core/runtime/runtime-router.ts src/core/runtime/runtime-dispatch.ts tests/runtime-follow-up-contract.test.cjs tests/runtime-router-follow-up-contract.test.cjs tests/robustness.test.cjs docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md
git commit -m "merge: converge runtime follow-up contract"
git push
```

Report:

- implemented runtime-only convergence
- verification commands and results
- whether compatibility fields were retained
- whether the slice is ready for merge-back or should remain as a branch checkpoint

## Exit Check

- [ ] `RuntimeFollowUp` remains the canonical continuation surface and is directly tested.
- [ ] Router/dispatch handle canonical follow-up before any retained compatibility fallback.
- [ ] No unapproved changes landed in `src/main.ts`, UI, map, backpack, or styles.
- [ ] Existing migrated ownership assertions remain green and do not regress to older seams.
- [ ] The child plan and parent handoff both record the exact post-slice resume point.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
