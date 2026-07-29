# Navigation Time Follow-Up Story Runtime City-Enter Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `navigation-time-follow-up` city-enter story triggering from the older `scene-runtime` compatibility seam onto the shared `story-runtime` seam without regressing current city-enter follow-up order, council-priority reminders, or the current UI/map/backpack baseline.

**Architecture:** This child exists separately because the remaining `city-enter` path is no longer a dormant helper or passive storyContent passthrough. It is an active behavior seam on the navigation follow-up path. The migration must keep `time.council-threshold-crossed` and other non-city-enter follow-up logic intact, avoid full shellification, and only widen `src/main.ts` storyContent passthrough if the narrower application/runtime seam cannot proceed without it.

**Tech Stack:** TypeScript, Vite, Node test runner, in-app browser smoke testing on `http://localhost:5173/`, runtime contract tests under `tests/*.test.cjs`, `pnpm run build:test`, `pnpm run typecheck`, `git diff --check`, and `npm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-29`
- Current Focus: `City-enter migration is implemented and verified: navigation-time-follow-up now routes navigation.entered-city through shared story-runtime, projects city/building world patches back through the outcome follow-up seam, and preserves council-threshold behavior.`
- Next Step: `Review the narrow diff, then decide whether to commit/push this child now or keep it open for another adjacent runtime slice.`
- Verification: `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm run build:test`; `node --test tests/navigation-time-follow-up.test.cjs`; `node --test tests/indoor-screen-story-runtime.test.cjs`; `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned only `src/main.ts`; `git diff --check`; browser smoke on \`http://localhost:5173/\` reached main menu -> 开始游戏 -> 开始冒险 -> campaign map -> 背包 -> 濠州 -> 进入城市 with no console warn/error logs; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm run lint:plans` still fails on the unrelated pre-existing file docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md missing a top-level title heading.`
- Notes: `This child was split out of the mod-first runtime handoff after eventBindings/progressTracks were already consumed by shared story-runtime for house-enter and indoor-screen-shown. The implemented seam keeps runtime behavior in application/core layers: src/main.ts only widened the existing navigationTimeFollowUp story/app context passthrough, while navigation-time-follow-up now owns the city-enter story-runtime bridge and runtime-dispatch/runtime-router only widened outcome follow-up result forwarding for city/building status patches. Keep current baseline behavior authoritative; do not mix this child with broader shellification or unrelated navigation/runtime cleanup.`

## Progress Log

- 2026-07-29
  - Summary: `Created a dedicated child plan for navigation-time-follow-up city-enter migration so the remaining scene-runtime -> story-runtime cutover can be reviewed and executed independently of the earlier Task 4 narrow slices.`
  - Verification: `pnpm run lint:plans` failed on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` because it is missing the required top-level title heading; no implementation commands were run for this child yet.`
  - Next: `Start Task 1 by rechecking the current city-enter path, required storyContent inputs, and the minimum verification set.`
- 2026-07-29
  - Summary: `Completed Task 1 ownership recheck. navigation-runtime emits navigation.entered-city, commitRuntimeRequest forwards that outcome into navigationTimeFollowUp.applyOutcome(), and navigation-time-follow-up still calls runStoryTriggerRuntime() from scene-runtime with only eventDefinitionsById, sceneDefinitionsById, optional activityDefinitionsById, and optional textEntriesById. Shared story-runtime support for city-enter already exists, but this seam is blocked by two gaps: navigation-time-follow-up does not receive eventBindings/settlements/progressTracks/cityDefinitions/houseDefinitions, and the outcome follow-up contract only returns RuntimeState plus characterDefinitions, so city/building status projection cannot flow back through the current bridge.`
  - Verification: `rg -n "navigation\\.entered-city|getStoryContent|runStoryTriggerRuntime|city-enter" src/main.ts src/application/runtime/navigation-time-follow-up.ts src/application/story/story-runtime.ts src/core/runtime/scene-runtime.ts src/core/runtime/navigation-runtime.ts src/core/runtime/runtime-dispatch.ts src/core/runtime/runtime-router.ts src/application/story/story-runtime-state-bridge.ts`; `sed -n '1,260p' src/application/runtime/navigation-time-follow-up.ts`; `sed -n '321,470p' src/application/story/story-runtime.ts`; `sed -n '1,260p' src/core/runtime/scene-runtime.ts`; `sed -n '60,120p' src/core/runtime/navigation-runtime.ts`; `sed -n '940,1035p' src/main.ts`; `sed -n '1,260p' src/application/story/story-runtime-state-bridge.ts`; `sed -n '1,260p' src/core/runtime/runtime-dispatch.ts`; `sed -n '1,220p' src/core/runtime/runtime-router.ts`; `sed -n '1,260p' tests/navigation-time-follow-up.test.cjs`; `sed -n '1,240p' tests/indoor-screen-story-runtime.test.cjs`.`
  - Next: `Write a failing test for city-enter on the shared story-runtime seam, then decide whether the narrowest fix is to widen outcome follow-up results with city/building status support or to introduce an application-level follow-up bridge before touching src/main.ts.`
- 2026-07-29
  - Summary: `Completed Tasks 2-4. Added failing coverage for shared story-runtime ownership and city-enter world patch projection, migrated navigation-time-follow-up away from scene-runtime onto triggerStoryEvents/buildStoryTriggerInput plus story-runtime-state-bridge, widened outcome follow-up result forwarding so city/building status patches survive commitRuntimeRequest, and kept the main.ts change limited to navigationTimeFollowUp story/app context passthrough.`
  - Verification: `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm run build:test`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node --test tests/navigation-time-follow-up.test.cjs`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node --test tests/indoor-screen-story-runtime.test.cjs`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned only `src/main.ts`; `git diff --check`; browser smoke on \`http://localhost:5173/\` reached main menu -> 开始游戏 -> 开始冒险 -> campaign map -> 背包 -> 濠州 -> 进入城市 with no console warn/error logs; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm run lint:plans` failed only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
  - Next: `Leave this child at completed-but-open until the user decides whether to commit/push now or continue with another adjacent runtime-only slice.`

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
- `src/core/runtime/runtime-router.ts`
  - only if Task 2 proves outcome follow-up must return city/building status patches in addition to RuntimeState and characterDefinitions
- `src/core/runtime/runtime-dispatch.ts`
  - only if the narrow follow-up result expansion requires dispatch wiring updates
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

- [x] **Step 1: Record the exact city-enter follow-up chain still using scene-runtime**

Document:

- where `navigation.entered-city` is emitted
- where `navigation-time-follow-up` receives it
- what storyContent fields are currently available there
- which missing fields block direct shared `story-runtime` use

Recorded result:

- `src/core/runtime/navigation-runtime.ts` emits `{ type: "navigation.entered-city", cityId }` from `createEnterCityRequest()`.
- `src/main.ts` forwards runtime outcomes through `commitRuntimeRequest(... followUp.handleOutcome ...)` into `navigationTimeFollowUp.applyOutcome({ state, outcome })`.
- `src/application/runtime/navigation-time-follow-up.ts` handles only `navigation.entered-city` by calling `runStoryTriggerRuntime()` from `src/core/runtime/scene-runtime.ts`.
- The current navigation follow-up storyContent only includes `eventDefinitionsById`, `sceneDefinitionsById`, optional `activityDefinitionsById`, and optional `textEntriesById`.
- Direct shared `story-runtime` use is blocked by two missing layers:
  - content gap: `eventBindingsById`, `settlementDefinitionsById`, `progressTrackDefinitionsById`, `progressTrackBindingsById`, `cityDefinitionsById`, and `houseDefinitionsById` are not passed into `navigation-time-follow-up`
  - state bridge gap: `navigation-time-follow-up` and `RuntimeOutcomeFollowUpResult` only carry `RuntimeState` plus optional `characterDefinitions`, while shared story-runtime world projection currently needs `AppState`-backed `cityStatusById` and `buildingStatusById` through `createStoryRuntimeDefinitionContext()` and `applyStoryRuntimeResultToAppState()`

- [x] **Step 2: Decide whether a new narrow `src/main.ts` passthrough is unavoidable**

If a passthrough expansion is needed, record the exact fields and why the boundary remains narrow.

Decision:

- A narrow `src/main.ts` passthrough expansion is likely required later so `navigationTimeFollowUp.getStoryContent()` can supply `eventBindingsById`, `settlementDefinitionsById`, `progressTrackDefinitionsById`, `progressTrackBindingsById`, `cityDefinitionsById`, and `houseDefinitionsById`.
- That is not the first blocker. Even with richer storyContent, the current outcome follow-up seam cannot project city/building status changes back into app state.
- Therefore `src/main.ts` should remain unchanged until Task 2 failing coverage proves whether a narrow follow-up result expansion or an application-level bridge can satisfy the state projection requirement without broadening shell ownership.

- [x] **Step 3: Update plan state before implementation**

Refresh `Execution State`, append a `Progress Log` entry, and record the exact intended write scope.

Intended write scope after Task 1:

- tests first in `tests/navigation-time-follow-up.test.cjs` and `tests/robustness.test.cjs`
- then the smallest runtime seam needed among `src/application/runtime/navigation-time-follow-up.ts`, `src/core/runtime/runtime-router.ts`, and `src/core/runtime/runtime-dispatch.ts`
- `src/main.ts` only if the tests prove richer storyContent passthrough is still required after the seam fix

## Task 2: Add Focused Failing Coverage

**Files:**
- Modify: `tests/navigation-time-follow-up.test.cjs`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Add a direct navigation-time follow-up test for city-enter on the shared story seam**

The test should fail against the current implementation and prove:

- city-enter can consume event binding driven story content
- settlement/progression world updates reach the returned runtime/app state
- council-threshold behavior remains unaffected

- [x] **Step 2: Extend seam ownership assertions if needed**

Keep the assertion narrow: this child should prove city-enter no longer depends on `scene-runtime`, without weakening existing boundary tests.

## Task 3: Implement The Narrow City-Enter Migration

**Files:**
- Modify: `src/application/runtime/navigation-time-follow-up.ts`
- Modify: `src/main.ts` only if Task 1 explicitly approved it
- Modify: `src/application/story/story-runtime.ts` only if a missing shared helper is still needed

- [x] **Step 1: Switch navigation-time-follow-up city-enter from scene-runtime to shared story-runtime**

Preserve:

- current outcome ownership
- current follow-up ordering
- current council-threshold path separation

- [x] **Step 2: Keep the write scope fail-closed**

Do not absorb unrelated runtime orchestration, UI work, or broader shell cleanup into this child.

## Task 4: Verify, Sync Docs, And Prepare Merge Checkpoint

**Files:**
- Modify: `docs/change-log.md` if behavior changes
- Modify: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Modify: `docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md`

- [x] **Step 1: Run the required verification**

Run the commands in `Verification Plan`, including the browser smoke.

- [x] **Step 2: Record verification and boundary status**

Document:

- pass/fail results
- whether `src/main.ts` was touched
- whether the boundary diff remained limited and approved

- [x] **Step 3: Decide whether to commit/push here or defer**

If implementation is complete and verified, prepare the commit/push checkpoint. If not, leave the child in `running` or `completed-but-open` with a precise resume point.

Decision:

- Implementation is complete and verified.
- Commit/push is intentionally deferred for user confirmation; child status is `completed-but-open`.
- `src/main.ts` was touched only for existing navigationTimeFollowUp story/app context passthrough expansion.
- Guarded boundary diff remained narrow and returned only `src/main.ts` among the protected shell/UI/map/backpack/style paths.

## Exit Check

- [x] `navigation-time-follow-up` no longer uses `scene-runtime` for the migrated city-enter path.
- [x] city-enter uses the shared `story-runtime` seam with the required storyContent inputs.
- [x] council-threshold and non-city-enter follow-up behavior remain intact.
- [x] boundary diff stays within the approved narrow scope.
- [x] browser smoke passes on the current baseline.
- [ ] Project progress sync is updated if the child state changes.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

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
- Resume From: `Open docs/superpowers/project-progress.md, confirm the current branch, review the verified diff for this child, then either commit/push this completed-but-open slice or continue only if the user explicitly wants another adjacent runtime-only follow-up before closeout.`
