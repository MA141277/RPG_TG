# Navigation Time Follow-Up Story Runtime City-Enter Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `navigation-time-follow-up` city-enter story triggering from the older `scene-runtime` compatibility seam onto the shared `story-runtime` seam without regressing current city-enter follow-up order, council-priority reminders, or the current UI/map/backpack baseline.

**Architecture:** This child exists separately because the remaining `city-enter` path is no longer a dormant helper or passive storyContent passthrough. It is an active behavior seam on the navigation follow-up path. The migration must keep `time.council-threshold-crossed` and other non-city-enter follow-up logic intact, avoid full shellification, and only widen `src/main.ts` storyContent passthrough if the narrower application/runtime seam cannot proceed without it.

**Tech Stack:** TypeScript, Vite, Node test runner, in-app browser smoke testing on `http://localhost:5173/`, runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm run typecheck`, `git diff --check`, and `npm run lint:plans`.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-29`
- Current Focus: `Dedicated follow-up plan created; city-enter in navigation-time-follow-up still uses scene-runtime and has not yet been migrated to shared story-runtime.`
- Next Step: `Recheck current city-enter follow-up ownership, then add a targeted failing test before changing navigation-time-follow-up or widening storyContent passthrough.`
- Verification: `Plan creation only. Governance lint was attempted and failed on an unrelated pre-existing file: docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md is missing the required top-level title heading.`
- Notes: `This child was split out of the mod-first runtime handoff after eventBindings/progressTracks were already consumed by shared story-runtime for house-enter and indoor-screen-shown. Keep current baseline behavior authoritative; do not mix this child with broader shellification or unrelated navigation/runtime cleanup.`

## Progress Log

- 2026-07-29
  - Summary: `Created a dedicated child plan for navigation-time-follow-up city-enter migration so the remaining scene-runtime -> story-runtime cutover can be reviewed and executed independently of the earlier Task 4 narrow slices.`
  - Verification: `pnpm run lint:plans` failed on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` because it is missing the required top-level title heading; no implementation commands were run for this child yet.`
  - Next: `Start Task 1 by rechecking the current city-enter path, required storyContent inputs, and the minimum verification set.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - `docs/superpowers/plans/2026-07-03-child-25-navigation-time-follow-up-de-shell-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch for follow-up execution is expected to remain `codex/migration-hot-tasks` unless the user explicitly asks for a new child branch.
  - `navigation-time-follow-up` currently routes `navigation.entered-city` through `runStoryTriggerRuntime()` from `src/core/runtime/scene-runtime.ts`.
  - Shared `story-runtime` already consumes `eventBindingsById`, `settlementDefinitionsById`, `progressTrackDefinitionsById`, and `progressTrackBindingsById` for `city-enter`, `house-enter`, and `indoor-screen-shown`, but `navigation-time-follow-up` has not yet been switched over to that seam.
  - A successful migration here may require one more narrow `src/main.ts` storyContent passthrough expansion for `navigationTimeFollowUp.getStoryContent()`. Treat that as an explicit boundary decision, not an accidental side effect.
  - The current `docs/superpowers/project-progress.md` still points at an unrelated map renderer child. Do not repoint or close that entry unless the user explicitly asks.

## Implementation Scope

### In Scope

- re-audit the current `city-enter` follow-up path inside `navigation-time-follow-up`
- add focused tests for city-enter on the shared `story-runtime` seam
- migrate `navigation-time-follow-up` from `scene-runtime` to `story-runtime` if the verification surface stays narrow
- widen storyContent passthrough only where strictly required for this city-enter seam
- browser smoke for main menu -> map -> city-enter after the migration

### Still Out Of Scope

- full `main.ts` shellification
- unrelated time follow-up or council-threshold logic redesign
- map rendering, backpack UI, or other visible baseline feature rewrites
- direct merge or wholesale port from `origin/mod-first-dev`

## File Map

### Existing files to modify

- `src/application/runtime/navigation-time-follow-up.ts`
  - primary seam under migration
- `src/application/story/story-runtime.ts`
  - only if a missing shared helper or trigger adapter is still needed
- `src/main.ts`
  - only if `navigationTimeFollowUp.getStoryContent()` requires a narrow approved passthrough expansion
- `tests/navigation-time-follow-up.test.cjs`
  - direct unit coverage for the follow-up bridge
- `tests/robustness.test.cjs`
  - contract and boundary assertions around shared seam ownership
- `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
  - record progress if this child starts execution
- `docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md`
  - this child plan

### Existing files expected to be deleted

- `None expected.`

### New files to create

- `Only if a tiny helper is needed to keep navigation-time-follow-up from duplicating story trigger input assembly.`

## Verification Plan

- Targeted verification:
  - `city-enter follow-up still triggers story progression at the correct point`
  - `council-threshold follow-up remains unchanged`
  - `shared story-runtime, not scene-runtime, owns the migrated city-enter path`
  - `browser smoke still reaches map -> city-enter -> city view without console errors`
- Required commands:
  - `pnpm run build:test`
  - `node --test tests/navigation-time-follow-up.test.cjs`
  - `node --test tests/indoor-screen-story-runtime.test.cjs`
  - `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`
  - `pnpm run typecheck`
  - `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`
  - `git diff --check`
  - `npm run lint:plans`

## Task 1: Recheck City-Enter Follow-Up Ownership

**Files:**
- Read: `src/application/runtime/navigation-time-follow-up.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/core/runtime/scene-runtime.ts`
- Read: `src/main.ts`
- Modify: `docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md`

- [ ] **Step 1: Record the exact city-enter follow-up chain still using scene-runtime**

Document:

- where `navigation.entered-city` is emitted
- where `navigation-time-follow-up` receives it
- what storyContent fields are currently available there
- which missing fields block direct shared `story-runtime` use

- [ ] **Step 2: Decide whether a new narrow `src/main.ts` passthrough is unavoidable**

If a passthrough expansion is needed, record the exact fields and why the boundary remains narrow.

- [ ] **Step 3: Update plan state before implementation**

Refresh `Execution State`, append a `Progress Log` entry, and record the exact intended write scope.

## Task 2: Add Focused Failing Coverage

**Files:**
- Modify: `tests/navigation-time-follow-up.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [ ] **Step 1: Add a direct navigation-time follow-up test for city-enter on the shared story seam**

The test should fail against the current implementation and prove:

- city-enter can consume event binding driven story content
- settlement/progression world updates reach the returned runtime/app state
- council-threshold behavior remains unaffected

- [ ] **Step 2: Extend seam ownership assertions if needed**

Keep the assertion narrow: this child should prove city-enter no longer depends on `scene-runtime`, without weakening existing boundary tests.

## Task 3: Implement The Narrow City-Enter Migration

**Files:**
- Modify: `src/application/runtime/navigation-time-follow-up.ts`
- Modify: `src/main.ts` only if Task 1 explicitly approved it
- Modify: `src/application/story/story-runtime.ts` only if a missing shared helper is still needed

- [ ] **Step 1: Switch navigation-time-follow-up city-enter from scene-runtime to shared story-runtime**

Preserve:

- current outcome ownership
- current follow-up ordering
- current council-threshold path separation

- [ ] **Step 2: Keep the write scope fail-closed**

Do not absorb unrelated runtime orchestration, UI work, or broader shell cleanup into this child.

## Task 4: Verify, Sync Docs, And Prepare Merge Checkpoint

**Files:**
- Modify: `docs/change-log.md` if behavior changes
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md`

- [ ] **Step 1: Run the required verification**

Run the commands in `Verification Plan`, including the browser smoke.

- [ ] **Step 2: Record verification and boundary status**

Document:

- pass/fail results
- whether `src/main.ts` was touched
- whether the boundary diff remained limited and approved

- [ ] **Step 3: Decide whether to commit/push here or defer**

If implementation is complete and verified, prepare the commit/push checkpoint. If not, leave the child in `running` or `completed-but-open` with a precise resume point.

## Exit Check

- [ ] `navigation-time-follow-up` no longer uses `scene-runtime` for the migrated city-enter path.
- [ ] city-enter uses the shared `story-runtime` seam with the required storyContent inputs.
- [ ] council-threshold and non-city-enter follow-up behavior remain intact.
- [ ] boundary diff stays within the approved narrow scope.
- [ ] browser smoke passes on the current baseline.
- [ ] Project progress sync is updated if the child state changes.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Navigation Time Follow-Up Story Runtime City-Enter`
- Parent Task: `Mod First Runtime Migration`
- Parent Stage: `Runtime Migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Return to docs/superpowers/project-progress.md only if the user explicitly asks to sync canonical governance state.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, confirm the current branch, then continue from Task 1 of this child plan if the user asks to execute the city-enter migration.`
