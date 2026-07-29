# Mod First Runtime Integration Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Continue migrating runtime capabilities from `mod-first-dev` into the current UI/map/backpack baseline without overwriting the baseline experience.

**Architecture:** Treat `mod-first-dev` as a reference source, not as a branch to merge directly. Runtime compatibility and bridge behavior must be centralized in core/application runtime seams, while visible UI, entry shell, map, backpack, and current feature behavior remain owned by the `origin/codex/sync-naqishuo-721ui-to-mmz` baseline. Each future slice should be small, tested, committed, pushed, and then merged back through the agreed baseline flow.

**Tech Stack:** TypeScript, Vite, Node test runner, PowerShell git workflow, runtime contract tests under `tests/*.test.cjs`, `npm.cmd run build:test`, `npm.cmd run typecheck`, and `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-29`
- Current Focus: `Continue runtime-only migration from the clean branch codex/mod-first-runtime-integration.`
- Next Step: `Pick the next runtime-only slice from Task 1, write/adjust focused tests first, then implement without touching UI/map/backpack/main shell unless explicitly scoped.`
- Verification: `git status --short --branch`; `git rev-parse --abbrev-ref --symbolic-full-name '@{u}'`; `git merge-base --is-ancestor codex/mod-first-runtime-integration origin/codex/sync-naqishuo-721ui-to-mmz`; `git merge-base --is-ancestor origin/codex/sync-naqishuo-721ui-to-mmz codex/mod-first-runtime-integration`; targeted runtime test suite listed below.
- Notes: `Current branch HEAD is 8d8e5145 and is identical to origin/codex/mod-first-runtime-integration, origin/codex/sync-naqishuo-721ui-to-mmz, and local migrate-scripteditor at the time this handoff was written. The existing docs/superpowers/project-progress.md still points at an unrelated map renderer child; do not close or repoint that child unless the user explicitly asks.`

## Progress Log

- 2026-07-29
  - Summary: `Captured the current mod-first runtime migration handoff so another Codex session can continue from the same branch, constraints, progress, verification set, and next task queue.`
  - Verification: `git status --short --branch` showed `## codex/mod-first-runtime-integration...origin/codex/mod-first-runtime-integration`; merge-base checks showed the current branch and `origin/codex/sync-naqishuo-721ui-to-mmz` contain each other; `git status --porcelain=v1` was empty before creating this document.
  - Next: `Run npm run lint:plans after saving this document, then commit and push this documentation slice if requested.`
- 2026-07-29
  - Summary: `Runtime migration stack already landed into the current baseline: dialogue compatibility, event binding start, event-owned playable start/completion, settlement effect handling, state-sync status/settlement commits, navigation access, playable registries/contributions, city-begging/grain/medicine status patches, interactive follow-up/status forwarding, flow playable kernel/dispatch/presenter, followUp aliases, runtime router/dispatch followUp handling, and source-event settlement/world continuation.`
  - Verification: `Recent recorded verification pattern: npm.cmd run build:test; node --test tests\event-owned-playable-completion.test.cjs tests\story-settlement-continuation.test.cjs tests\event-continuation-runtime.test.cjs tests\event-playable-start-runtime.test.cjs tests\runtime-settlement-content.test.cjs tests\runtime-dispatch-settlement.test.cjs tests\runtime-router-follow-up-contract.test.cjs tests\runtime-follow-up-contract.test.cjs tests\interactive-runtime-status.test.cjs; npm.cmd run typecheck; boundary diff checks for src\main.ts, UI, map, backpack, and styles.`
  - Next: `Continue with runtime-only callers and contracts; defer shellification and UI-facing mod-first-dev diffs.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/mod-first-runtime-subsystems-spec.md`
- Related runtime plans:
  - `docs/superpowers/plans/2026-07-03-playable-runtime-migration-weekly-orchestration-plan.md`
  - `docs/superpowers/plans/2026-07-03-main-runtime-ownerization-weekly-orchestration-plan.md`
  - `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`
  - `docs/superpowers/plans/2026-07-03-child-24-main-runtime-orchestration-ownerization-plan.md`
  - `docs/superpowers/plans/2026-07-03-child-25-navigation-time-follow-up-de-shell-plan.md`
  - `docs/superpowers/plans/2026-07-03-child-30-playable-runtime-skeleton-and-integration-registry-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch: `codex/mod-first-runtime-integration`.
  - Upstream: `origin/codex/mod-first-runtime-integration`.
  - Baseline branch for user-visible current app: `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - Current branch and baseline both resolve to commit `8d8e5145` at handoff time, so all prior local runtime migration commits have already been merged back into the baseline.
  - Local `migrate-scripteditor` also points to `8d8e5145` and tracks `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - Direct comparison to `origin/mod-first-dev` still shows large differences in `src/main.ts`, `src/ui/**`, `src/styles/**`, `src/application/map/**`, house modules, audio, layout editor, and presenter/runtime coordinator files. These are not safe to merge wholesale.

## Migration Reason

The current branch needs selected `mod-first-dev` runtime capabilities because script-editor-authored content, event-owned playables, structured settlement, runtime follow-up, state-sync commits, playable registries, and mod-contributed playables need to execute through stable runtime contracts instead of ad hoc entry code.

The current baseline also contains newer UI, map, backpack, script editor, entry, and feature work that `mod-first-dev` does not own. A whole-branch merge from `mod-first-dev` would delete or replace many of those files, including newer map renderer paths, backpack UI, house views, styles, and `src/main.ts` entry behavior. The migration must therefore port runtime seams in slices while preserving the current baseline UI and behavior.

## Global Constraints

- Do not direct-merge `mod-first-dev` into this branch.
- Do not copy `mod-first-dev` versions of `src/main.ts`, `src/ui/**`, `src/styles/**`, map modules/assets, backpack modules, or house view files.
- Do not modify UI, UI behavior, map behavior, backpack behavior, script editor entry, or entry shell unless the user explicitly scopes that slice.
- Keep compatibility logic centralized in runtime/compatibility modules. Do not scatter compatibility branches across unrelated callers.
- Prefer tests first for every behavior-changing runtime slice.
- Preserve old compatibility fields until the current entry path has fully migrated. For example, keep old `interactive` fallbacks while introducing `followUp`.
- Commit after each completed slice with a message that states the runtime capability migrated.
- After each slice, report what was implemented, what verification ran, and what the next slice is.
- After each plan task or migration slice, update this document before commit so another session can resume without reading chat history. Required updates are: checkbox state, `Execution State`, `Progress Log`, verification result, current branch/baseline status if it changed, and the exact next unchecked task.
- Before merging back to the baseline, run the boundary diff check that proves UI/map/backpack/main-shell files were not unintentionally changed.
- If a future task involves special house work, first present the house interface contract from `docs/special-house-interface.md` as required by `AGENTS.md`.

## Implementation Scope

### Already Migrated

- Script editor and script editor entry baseline are present in the current baseline.
- Script editor template loading has been fixed so built-in template packs resolve through packaged assets.
- `.gitignore` ignores local `tmp/` and `.superpowers/brainstorm/`.
- Main shell governance contract has been documented to prevent unsafe direct shellification.
- Dialogue runtime compatibility seam.
- Event binding runtime seam and event binding start runtime seam.
- Event-owned playable start runtime.
- Event-owned playable completion seam.
- Runtime settlement effect seam and runtime dispatch settlement carry.
- State-sync runtime status patch and runtime commit settlement effects.
- Navigation access runtime seam, with access checks only when explicit access data is supplied.
- Default playable registry seam and scenario-pack playable contribution projection.
- City begging, grain accounting, and medicine compounding status patches.
- Interactive runtime status patch forwarding.
- Flow playable runtime kernel, dispatch, and presenter model.
- `PlayableResult` and `RuntimeFollowUp` compatibility aliases.
- Runtime router follow-up contract and runtime dispatch `handleFollowUp()` priority with legacy fallback.
- Story-battle/playable/interactive runtime forwarding of both `interactive` and `followUp`.
- Event-owned playable source event continuation.
- Settlement continuation through source event `nextEventId`.
- Story settlement continuation helper under `src/application/story/story-settlement-continuation.ts`.
- Event-owned playable completion can carry `cityDefinitions` and `houseDefinitions` through story settlement continuation.

### Still In Scope

- Runtime-only application callers that can pass `cityDefinitions` and `houseDefinitions` into `applyEventOwnedPlayableCompletion()` without touching UI or `src/main.ts`.
- Additional event/dialogue/playable completion convergence where it stays inside `src/core/**` or `src/application/**` runtime seams.
- Canonical result naming cleanup that keeps old fields as compatibility aliases.
- Runtime coordinator helpers under `src/application/runtime/**` only if they can be added without replacing current entry/UI behavior.
- Tests that lock runtime behavior before any call-site wiring is changed.

### Still Out Of Scope

- Full `src/main.ts` shellification.
- Replacing current UI with `mod-first-dev` UI.
- Replacing current map renderer, map assets, map shaders, map styles, or map interaction behavior.
- Replacing current backpack/inventory UI or behavior.
- Deleting current house views or replacing them with `mod-first-dev` house module removals.
- Retiring legacy runtime fields before current entry code is safely migrated.
- Mod-first-dev audio/layout/editor deletion waves unless the user starts a dedicated slice.

## File Map

### Key files already changed by runtime migration

- `src/application/events/event-playable-runtime.ts`
  - Owns event-owned playable start/completion and source event continuation input.
- `src/application/story/story-runtime.ts`
  - Owns story event continuation and delegates settlement application.
- `src/application/story/story-settlement-continuation.ts`
  - Central helper for applying story settlement target changes to person/city/building definitions.
- `src/core/runtime/runtime-dispatch.ts`
  - Owns runtime dispatch result handling, including `followUp` priority and settlement carry.
- `src/core/runtime/runtime-router.ts`
  - Owns routed result and follow-up handler compatibility contract.
- `src/core/runtime/playable-runtime.ts`
  - Owns playable launch/action resolution, default registries, and flow playable dispatch.
- `src/core/runtime/interactive-runtime.ts`
  - Owns interactive-to-playable forwarding and status/followUp result propagation.
- `src/core/runtime/runtime-settlement.ts`
  - Owns runtime settlement effect application.
- `src/core/runtime/state-sync-runtime.ts`
  - Owns runtime result commit into shared app state.
- `src/core/contracts/runtime-result.ts`
  - Owns typed runtime result, settlement, and follow-up compatibility contracts.

### Tests that describe migrated behavior

- `tests/event-owned-playable-completion.test.cjs`
- `tests/event-continuation-runtime.test.cjs`
- `tests/story-settlement-continuation.test.cjs`
- `tests/event-playable-start-runtime.test.cjs`
- `tests/runtime-settlement-content.test.cjs`
- `tests/runtime-dispatch-settlement.test.cjs`
- `tests/runtime-router-follow-up-contract.test.cjs`
- `tests/runtime-follow-up-contract.test.cjs`
- `tests/interactive-runtime-status.test.cjs`
- `tests/flow-playable-runtime.test.cjs`
- `tests/flow-playable-runtime-dispatch.test.cjs`
- `tests/flow-playable-presenter.test.cjs`
- `tests/city-begging-runtime-status.test.cjs`
- `tests/grain-accounting-runtime-status.test.cjs`
- `tests/medicine-compounding-runtime-status.test.cjs`
- `tests/state-sync-runtime-commit.test.cjs`
- `tests/state-sync-core-seam.test.cjs`
- `tests/playable-runtime-registries.test.cjs`
- `tests/mod-runtime-contribution.test.cjs`

### Files to avoid unless explicitly scoped

- `src/main.ts`
- `src/ui/**`
- `src/styles/**`
- `src/components/**`
- `src/application/map/**`
- `src/domain/map/**`
- `src/application/backpack/**`
- `src/domain/backpack/**`
- `src/ui/views/inventory/**`
- `src/ui/views/map/**`
- `src/ui/views/house/**`

## Verification Plan

- Runtime slice verification:
  - `npm.cmd run build:test`
  - `node --test tests\event-owned-playable-completion.test.cjs tests\story-settlement-continuation.test.cjs tests\event-continuation-runtime.test.cjs tests\event-playable-start-runtime.test.cjs tests\runtime-settlement-content.test.cjs tests\runtime-dispatch-settlement.test.cjs tests\runtime-router-follow-up-contract.test.cjs tests\runtime-follow-up-contract.test.cjs tests\interactive-runtime-status.test.cjs`
  - `npm.cmd run typecheck`
- Boundary proof before commit:
  - `git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles`
  - Expected: empty unless the current slice was explicitly approved to touch one of these areas.
- Hygiene:
  - `git diff --check`
  - Existing LF/CRLF working-copy warnings may appear; new whitespace errors should be fixed.
- Plan/document verification:
  - `npm run lint:plans`
- Browser/UI smoke only when the user asks or when a runtime slice could affect visible behavior:
  - Start or reuse `http://127.0.0.1:5173/`.
  - Check startup, map visibility, backpack entry, city/house navigation, script editor entry, and no console errors.

## Task 1: World Definition Caller Wiring Audit

**Files:**
- Read: `src/application/events/event-playable-runtime.ts`
- Read: `src/application/story/story-runtime.ts`
- Read: `src/application/content/active-game-content.ts`
- Read: `src/core/runtime/runtime-dispatch.ts`
- Read: `src/core/runtime/state-sync-runtime.ts`
- Test: `tests/event-owned-playable-completion.test.cjs`
- Test: `tests/event-continuation-runtime.test.cjs`

- [ ] **Step 1: Find non-UI callers of event-owned playable completion**

Run:

```powershell
rg -n "applyEventOwnedPlayableCompletion|continueStoryFromSourceEvent|cityDefinitions|houseDefinitions" src\core src\application tests
```

Expected:

- Identify whether any caller outside `src/main.ts`, UI, map, backpack, and house view files can pass active city/house definitions into `applyEventOwnedPlayableCompletion()`.
- If all real callers are entry/UI-owned, record that the wiring is deferred rather than touching `src/main.ts` in this task.

- [ ] **Step 2: Add or extend a focused test for the caller seam**

If a non-UI runtime caller exists, extend the nearest test so it proves:

- the caller supplies `cityDefinitions` and `houseDefinitions`
- event-owned playable completion returns updated world definitions
- old character-only behavior still works when world definitions are omitted

Run the test first and confirm the new assertion fails before implementation.

- [ ] **Step 3: Implement minimal caller wiring**

Only modify runtime/application files from the audited caller path. Do not modify `src/main.ts`, UI, map, backpack, or styles in this task.

- [ ] **Step 4: Run verification**

Run:

```powershell
npm.cmd run build:test
node --test tests\event-owned-playable-completion.test.cjs tests\event-continuation-runtime.test.cjs tests\story-settlement-continuation.test.cjs
npm.cmd run typecheck
git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles
git diff --check
```

Expected:

- Targeted tests pass.
- Typecheck passes.
- Boundary diff is empty.

- [ ] **Step 5: Commit and report**

Run:

```powershell
git status --short
git add <changed-runtime-files> <changed-tests> docs\change-log.md docs\superpowers\plans\2026-07-29-mod-first-runtime-integration-handoff-plan.md
git commit -m "merge: wire event-owned playable world definitions"
git push
```

Report:

- What was implemented.
- Verification commands and results.
- Whether boundary diff was empty.
- Next task to execute.
- Confirmation that this handoff document was updated with the current resume point.

## Task 2: Dialogue And Event Completion Convergence Audit

**Files:**
- Read: `src/application/dialogue/**`
- Read: `src/application/events/**`
- Read: `src/application/story/**`
- Read: `src/core/runtime/**`
- Test: `tests/event-continuation-runtime.test.cjs`
- Test: `tests/runtime-router-follow-up-contract.test.cjs`
- Test: `tests/runtime-follow-up-contract.test.cjs`

- [ ] **Step 1: Compare remaining runtime-only diffs against mod-first-dev**

Run:

```powershell
git diff --name-status HEAD..origin/mod-first-dev -- src\application\dialogue src\application\events src\application\story src\core\runtime src\core\contracts tests
```

Expected:

- Extract runtime-only candidates.
- Exclude renames or deletions that drag UI/main shell changes into the current branch.

- [ ] **Step 2: Select one isolated completion/follow-up gap**

Choose one gap that:

- can be tested in existing Node tests
- does not require visible UI changes
- preserves old compatibility fields
- keeps compatibility in a shared runtime helper or contract module

- [ ] **Step 3: Write failing test and implement**

Use the nearest existing runtime test file. Keep the slice narrow enough for one commit.

- [ ] **Step 4: Run verification and boundary proof**

Run:

```powershell
npm.cmd run build:test
node --test tests\event-continuation-runtime.test.cjs tests\runtime-router-follow-up-contract.test.cjs tests\runtime-follow-up-contract.test.cjs tests\interactive-runtime-status.test.cjs
npm.cmd run typecheck
git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles
git diff --check
```

Expected:

- Tests and typecheck pass.
- Boundary diff is empty.

- [ ] **Step 5: Commit and report**

Use a commit message of the form:

```powershell
git commit -m "merge: converge <runtime-area> follow-up completion"
```

Report the implementation, verification, and next task.
Before committing, update this handoff document with completed checkboxes, `Execution State`, `Progress Log`, and the exact next resume point.

## Task 3: Runtime Coordinator Reference Slice

**Files:**
- Read: `src/application/runtime/**`
- Read: `src/core/runtime/**`
- Read: `src/main.ts`
- Test: choose focused tests under `tests/*.test.cjs`

- [ ] **Step 1: Audit mod-first-dev application runtime coordinators**

Run:

```powershell
git diff --name-status HEAD..origin/mod-first-dev -- src\application\runtime src\application\startup src\core\runtime src\main.ts
```

Expected:

- Identify coordinator helpers that can be added as dormant or test-only application modules without changing visible entry flow.
- Explicitly list any helper that would require `src/main.ts` shellification and defer it.

- [ ] **Step 2: Pick only a dormant/testable helper**

Allowed examples:

- a pure runtime input adapter
- a presenter-neutral runtime transition helper
- a typed follow-up continuation helper

Rejected examples:

- direct render coordinator replacement
- startup shell takeover
- map travel UI animation coordinator replacement
- city/house transition rewrite that changes current behavior

- [ ] **Step 3: Test first and implement**

Add a Node test that imports the helper directly and validates pure behavior.

- [ ] **Step 4: Run verification**

Run:

```powershell
npm.cmd run build:test
node --test <new-or-targeted-test-file>
npm.cmd run typecheck
git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles
git diff --check
```

Expected:

- No UI/main/map/backpack diff unless explicitly approved before this task.

- [ ] **Step 5: Commit and report**

Use a commit message of the form:

```powershell
git commit -m "merge: add <runtime-helper> coordinator seam"
```

Report the implementation, verification, and next task.
Before committing, update this handoff document with completed checkboxes, `Execution State`, `Progress Log`, and the exact next resume point.

## Task 4: Main Shellification Decision Gate

**Files:**
- Read: `src/main.ts`
- Read: `docs/superpowers/specs/2026-07-03-main-startup-orchestration-extraction-design.md`
- Read: `docs/superpowers/plans/2026-07-03-main-shell-ownerization-continuation-weekly-orchestration-plan.md`
- Read: `docs/superpowers/plans/2026-07-03-child-23-main-startup-orchestration-extraction-plan.md`
- Read: `docs/superpowers/plans/2026-07-03-child-24-main-runtime-orchestration-ownerization-plan.md`

- [ ] **Step 1: Do not start this task until runtime-only slices are stable**

Expected:

- Tasks 1-3 are complete or explicitly deferred with reasons.
- User has explicitly approved considering `src/main.ts`.

- [ ] **Step 2: Decide whether a tiny entry-wiring slice is needed**

If `src/main.ts` is the only remaining caller for an already-tested runtime helper, propose a tiny wiring slice that:

- changes only one call path
- does not replace the entry shell
- includes targeted tests or browser smoke
- has an explicit rollback boundary

- [ ] **Step 3: Reject full shellification in this plan**

Record any need for full shellification as a new dedicated plan. Do not borrow `mod-first-dev` shellification wholesale inside this runtime migration handoff.

## Exit Check

- [ ] Current branch remains based on the current UI/map/backpack baseline.
- [ ] Every runtime slice has a focused test.
- [ ] Every runtime slice has a commit and push.
- [ ] This handoff document is updated after every completed plan task or migration slice.
- [ ] Each slice reports implemented behavior, verification, boundary diff, and next task.
- [ ] Compatibility fields remain available until entry and caller paths are fully migrated.
- [ ] No direct merge from `mod-first-dev` was used.
- [ ] No unapproved changes landed in `src/main.ts`, `src/ui/**`, `src/styles/**`, map, or backpack paths.
- [ ] `origin/codex/sync-naqishuo-721ui-to-mmz` is updated after approved integration points.

## Completion Checklist

- [x] Handoff reason recorded.
- [x] Handoff goal recorded.
- [x] Hard requirements recorded.
- [x] Current branch/upstream/baseline recorded.
- [x] Completed migration progress recorded.
- [x] Remaining safe migration tasks recorded.
- [x] Verification and boundary commands recorded.
- [ ] Future runtime slices completed.
- [ ] Final merge-back and push recorded.

## Child Closeout

- Closed Child: `Mod First Runtime Integration Handoff`
- Parent Task: `Mod First Runtime Migration`
- Parent Stage: `Runtime Migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `World Definition Caller Wiring Audit`
- Next Child Status: `waiting`
- Next Required Action: `Run lint:plans for this handoff doc, commit/push the documentation slice if requested, then resume at Task 1.`
- Next Entry Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open this document, confirm branch codex/mod-first-runtime-integration, then execute the first unchecked task without changing UI/map/backpack/main shell paths unless the user explicitly approves that slice.`
