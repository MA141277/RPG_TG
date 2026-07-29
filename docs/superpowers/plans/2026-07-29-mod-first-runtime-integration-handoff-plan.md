# Mod First Runtime Integration Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Continue migrating runtime capabilities from `mod-first-dev` into the current UI/map/backpack baseline without overwriting the baseline experience.

**Architecture:** Treat `mod-first-dev` as a reference source, not as a branch to merge directly. Runtime compatibility and bridge behavior must be centralized in core/application runtime seams, while visible UI, entry shell, map, backpack, and current feature behavior remain owned by the `origin/codex/sync-naqishuo-721ui-to-mmz` baseline. Each future slice should be small, tested, committed, pushed, and then merged back through the agreed baseline flow.

**Tech Stack:** TypeScript, Vite, Node test runner, PowerShell git workflow, runtime contract tests under `tests/*.test.cjs`, `npm.cmd run build:test`, `npm.cmd run typecheck`, and `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-30`
- Current Focus: `The city-enter child is complete on the aligned baseline, and the next runtime-only slice is now the dedicated runtime follow-up contract convergence child covering runtime-result/runtime-router/runtime-dispatch plus focused contract tests only.`
- Next Step: `Execute docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md from Task 1, starting with the canonical-versus-compatibility follow-up audit before any runtime code change.`
- Verification: `Design spec committed as fa70603 at docs/superpowers/specs/2026-07-30-runtime-follow-up-contract-convergence-design.md; the new child plan is saved at docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md; pnpm run lint:plans still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue; previous city-enter verification remains recorded in docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md.`
- Notes: `Current branch is codex/migration-hot-tasks and tracks origin/codex/migration-hot-tasks. Local submit/merge work no longer uses codex/mod-first-runtime-integration as the active continuation branch. Task 1 audit found no non-UI production caller of applyEventOwnedPlayableCompletion(), so caller wiring stayed deferred until the user explicitly approved a tiny main.ts slice. That approval is still only used for narrow storyContent passthrough in src/main.ts and the active runtime behavior remains in application/core seams. The first Task 4 slice closed the earlier gap where indoor-screen and house-enter timing triggers could fire settlement events without projecting city/building authored-definition changes back into app-state status layers. This second Task 4 slice now consumes eventBindings/progressTracks in shared story-runtime for orchestrated trigger-story-events plus house/indoor timing paths, and stores progression runtime state on optional gameState.runtime.progression. navigation-time-follow-up still uses the older scene-runtime compatibility seam. The runtime migration code stack was already merged into origin/codex/sync-naqishuo-721ui-to-mmz at commit 8d8e5145; later handoff-document or hot-task commits may exist only on the current branch until explicitly merged back. The existing docs/superpowers/project-progress.md still points at an unrelated map renderer child; do not close or repoint that child unless the user explicitly asks.`
- Notes: `Current branch is codex/migration-hot-tasks and tracks origin/codex/migration-hot-tasks. Local submit/merge work no longer uses codex/mod-first-runtime-integration as the active continuation branch. Task 1 audit found no non-UI production caller of applyEventOwnedPlayableCompletion(), so caller wiring stayed deferred until the user explicitly approved a tiny main.ts slice. That approval is still only used for narrow storyContent passthrough in src/main.ts and the active runtime behavior remains in application/core seams. The first Task 4 slice closed the earlier gap where indoor-screen and house-enter timing triggers could fire settlement events without projecting city/building authored-definition changes back into app-state status layers. This second Task 4 slice now consumes eventBindings/progressTracks in shared story-runtime for orchestrated trigger-story-events plus house/indoor timing paths, and stores progression runtime state on optional gameState.runtime.progression. navigation-time-follow-up still uses the older scene-runtime compatibility seam. A dedicated follow-up child now exists at docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md so any city-enter seam migration can be reviewed independently from this handoff. The runtime migration code stack was already merged into origin/codex/sync-naqishuo-721ui-to-mmz at commit 8d8e5145; later handoff-document or hot-task commits may exist only on the current branch until explicitly merged back. The existing docs/superpowers/project-progress.md still points at an unrelated map renderer child; do not close or repoint that child unless the user explicitly asks.`

## Progress Log

- 2026-07-29
  - Summary: `Captured the current mod-first runtime migration handoff so another Codex session can continue from the same branch, constraints, progress, verification set, and next task queue.`
  - Verification: `git status --short --branch` showed `## codex/mod-first-runtime-integration...origin/codex/mod-first-runtime-integration`; merge-base checks showed the current branch and `origin/codex/sync-naqishuo-721ui-to-mmz` contain each other; `git status --porcelain=v1` was empty before creating this document.
  - Next: `Run npm run lint:plans after saving this document, then commit and push this documentation slice if requested.`
- 2026-07-29
  - Summary: `Runtime migration stack already landed into the current baseline: dialogue compatibility, event binding start, event-owned playable start/completion, settlement effect handling, state-sync status/settlement commits, navigation access, playable registries/contributions, city-begging/grain/medicine status patches, interactive follow-up/status forwarding, flow playable kernel/dispatch/presenter, followUp aliases, runtime router/dispatch followUp handling, and source-event settlement/world continuation.`
  - Verification: `Recent recorded verification pattern: npm.cmd run build:test; node --test tests\event-owned-playable-completion.test.cjs tests\story-settlement-continuation.test.cjs tests\event-continuation-runtime.test.cjs tests\event-playable-start-runtime.test.cjs tests\runtime-settlement-content.test.cjs tests\runtime-dispatch-settlement.test.cjs tests\runtime-router-follow-up-contract.test.cjs tests\runtime-follow-up-contract.test.cjs tests\interactive-runtime-status.test.cjs; npm.cmd run typecheck; boundary diff checks for src\main.ts, UI, map, backpack, and styles.`
  - Next: `Continue with runtime-only callers and contracts; defer shellification and UI-facing mod-first-dev diffs.`
- 2026-07-29
  - Summary: `Added explicit branch topology and merge-back flow requirements so future sessions know which branch to work on, when to commit/push, and how to return verified integration slices to the current baseline.`
  - Verification: `git status --short --branch`; `git branch -vv` filtered for mod-first runtime, migrate-scripteditor, baseline, and mod-first-dev branches.
  - Next: `After this document update is pushed, resume Task 1 on codex/mod-first-runtime-integration; merge back to the baseline only after a verified runtime slice or agreed documentation checkpoint.`
- 2026-07-29
  - Summary: `Corrected the handoff branch ownership: local continuation, submit, and merge work now runs on codex/migration-hot-tasks instead of codex/mod-first-runtime-integration.`
  - Verification: `git branch --show-current` returned `codex/migration-hot-tasks`; `git rev-parse --abbrev-ref --symbolic-full-name '@{u}'` returned `origin/codex/migration-hot-tasks`.
  - Next: `Resume Task 1 on codex/migration-hot-tasks; treat codex/mod-first-runtime-integration as historical context only unless the user explicitly asks to revive it.`
- 2026-07-29
  - Summary: `Completed Task 1 audit and deferred caller wiring because applyEventOwnedPlayableCompletion() still has no non-UI production caller outside entry-owned paths; then completed a Task 2 local convergence slice so story runtime scene helpers preserve cityDefinitions/houseDefinitions across start and choice continuation.`
  - Verification: `rg -n "applyEventOwnedPlayableCompletion|continueStoryFromSourceEvent|cityDefinitions|houseDefinitions" src/core src/application tests`; `rg -n "applyEventOwnedPlayableCompletion\\(" src tests`; `git diff --name-status HEAD..origin/mod-first-dev -- src/application/dialogue src/application/events src/application/story src/core/runtime src/core/contracts tests`; `pnpm run build:test`; `node --test tests/event-continuation-runtime.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `If this local Task 2 slice should be kept, commit/push it with docs/change-log.md and this handoff document; otherwise continue Task 3 Step 1 from codex/migration-hot-tasks.`
- 2026-07-29
  - Summary: `Completed a Task 3 local dormant-helper slice by exporting council priority house resolution from navigation-time-follow-up and teaching it to apply city-scoped buildingArrangements/primaryNpcId overrides through canonical building owner matching.`
  - Verification: `git diff --name-status HEAD..origin/mod-first-dev -- src/application/runtime src/application/startup src/core/runtime src/main.ts`; `pnpm run build:test`; `node --test tests/navigation-time-follow-up.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `If this local Task 3 slice should be kept, commit/push it with docs/change-log.md and this handoff document; otherwise continue Task 3 by auditing for one more dormant helper that still avoids src/main.ts shellification.`
- 2026-07-29
  - Summary: `Completed another Task 3 local dormant-helper slice by adding story-runtime-state-bridge, a pure bidirectional bridge between authored city/house definitions plus app-state status layers and the runtime definition/result shape.`
  - Verification: `pnpm run build:test`; `node --test tests/story-runtime-state-bridge.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `If this local Task 3 slice should be kept, commit/push it with docs/change-log.md and this handoff document; otherwise continue Task 3 by auditing whether indoor-screen-story-follow-up can safely consume the bridge without requiring entry-shell rewiring.`
- 2026-07-29
  - Summary: `Completed another Task 3 local context-exposure slice by teaching content-pack loading and active-game-content/storyContent to retain eventBindings, settlements, progressTracks, and progressTrackBindings alongside city/house definition maps.`
  - Verification: `git rev-parse --abbrev-ref --symbolic-full-name '@{u}'`; `git merge-base --is-ancestor origin/codex/sync-naqishuo-721ui-to-mmz codex/migration-hot-tasks`; `pnpm run build:test`; `node --test tests/active-game-content-story-context.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `Commit/push this richer storyContent context slice, then decide whether any remaining Task 3 consumer can safely use it without crossing the entry/runtime wiring boundary.`
- 2026-07-29
  - Summary: `Committed and pushed the richer storyContent context slice as 2442566, then audited indoor-screen-story-follow-up and stopped Task 3 there because the remaining consumer path would require widening house-runtime/main.ts story-content wiring and broader story-runtime seam work beyond a dormant helper slice.`
  - Verification: `git status --short`; `git show --stat --oneline HEAD`; `git push`; `rg -n "getStoryContent|applyIndoorScreenStoryFollowUp|triggerStoryEvents|eventBindingsById|progressTrackDefinitionsById|settlementDefinitionsById|cityDefinitionsById|houseDefinitionsById" src/main.ts src/application/runtime src/application/story src/core/runtime/house-runtime.ts`; `sed -n '1,240p' src/application/runtime/indoor-screen-story-follow-up.ts`; `sed -n '1,260p' src/application/runtime/main-runtime-orchestrator.ts`
  - Next: `Do not extend indoor-screen-story-follow-up further under Task 3. Enter Task 4 only with explicit user approval for a tiny entry-wiring or house-runtime dependency slice, or open a new dedicated story-runtime follow-up plan if deeper seam migration is desired.`
- 2026-07-29
  - Summary: `After explicit user approval, entered Task 4 and implemented a tiny entry-wiring/runtime seam slice: indoor-screen-story-follow-up now uses story-runtime plus state-bridge world projection, story-runtime applies settlement contents on initial trigger activation, main-runtime-orchestrator projects timing-trigger settlement updates, and house-runtime projects house-enter settlement world updates.`
  - Verification: `pnpm run build:test`; `node --test tests/indoor-screen-story-runtime.test.cjs`; `node --test --test-name-pattern "child 26|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles`; `git diff --check`
  - Next: `Commit/push this Task 4 slice, then decide whether remaining eventBindings/progressTrack runtime consumption belongs in this handoff or should move to a new dedicated follow-up plan.`
- 2026-07-29
  - Summary: `Completed a second Task 4 narrow story-runtime slice: story-runtime now consumes eventBindings for city-enter/house-enter/indoor-screen-shown via the shared event-binding runtime, applies progression after settlement events, stores optional runtime.progression state on GameState, and receives event/progression storyContent passthrough from indoor-screen-story-follow-up, main-runtime-orchestrator, house-runtime, and the existing tiny main.ts wiring seam.`
  - Verification: `pnpm run build:test`; `node --test tests/indoor-screen-story-runtime.test.cjs`; `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned only `src/main.ts`; `git diff --check`; browser smoke on `http://localhost:5173/` reached main menu, character select, campaign map, backpack overlay, city entry prompt, and city view with no console warn/error logs.
  - Next: `Commit/push this second Task 4 slice, then decide whether navigation-time-follow-up city-enter should migrate to story-runtime here or move into a new dedicated follow-up plan.`
- 2026-07-29
  - Summary: `Created a dedicated child plan for the remaining navigation-time-follow-up city-enter migration so future work can switch that seam from scene-runtime to shared story-runtime without reopening this handoff's boundary ad hoc.`
  - Verification: `pnpm run lint:plans` was attempted and failed on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` because it is missing the required top-level title heading.`
  - Next: `If city-enter migration should proceed, execute docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md from Task 1.`
- 2026-07-29
  - Summary: `Executed the dedicated city-enter follow-up child to completed-but-open: navigation-time-follow-up now routes navigation.entered-city through shared story-runtime with eventBindings/settlement/progression inputs, shared world patches flow back through the narrowed outcome follow-up seam, and council-threshold reminders remain unchanged.`
  - Verification: `pnpm run build:test`; `node --test tests/navigation-time-follow-up.test.cjs`; `node --test tests/indoor-screen-story-runtime.test.cjs`; `node --test --test-name-pattern "child 16|child 25 narrow follow-up contract stays outside main.ts and main-runtime-orchestrator" tests/robustness.test.cjs`; `pnpm run typecheck`; `git diff --name-only -- src/main.ts src/ui src/components src/application/map src/application/backpack src/domain/backpack src/domain/map src/styles` returned only `src/main.ts`; `git diff --check`; browser smoke on \`http://localhost:5173/\` reached main menu -> 开始游戏 -> 开始冒险 -> campaign map -> 背包 -> 濠州 -> 进入城市 with no console warn/error logs; `pnpm run lint:plans` still fails only on unrelated pre-existing file `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` missing the required top-level title heading.`
  - Next: `Use the child plan as the review/commit checkpoint; do not reopen this handoff with more city-enter seam work unless the user explicitly wants a new adjacent runtime-only slice before push.`
- 2026-07-30
  - Summary: `Promoted the next adjacent runtime-only child: runtime follow-up contract convergence. This child is scoped to runtime-result/runtime-router/runtime-dispatch and focused tests so canonical followUp ownership can be clarified before any new caller wiring is considered.`
  - Verification: `Design spec added at docs/superpowers/specs/2026-07-30-runtime-follow-up-contract-convergence-design.md and committed as fa70603; new child plan saved at docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md; pnpm run lint:plans still fails only on the unrelated pre-existing docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md title-heading issue; implementation verification for the new child has not run yet.`
  - Next: `Execute docs/superpowers/plans/2026-07-30-runtime-follow-up-contract-convergence-plan.md from Task 1, then record whether legacy outcome/interactive fields remain required or can be narrowed.`

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
  - `docs/superpowers/plans/2026-07-29-navigation-time-follow-up-story-runtime-city-enter-plan.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Current working branch: `codex/migration-hot-tasks`.
  - Upstream: `origin/codex/migration-hot-tasks`.
  - Baseline branch for user-visible current app: `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - Runtime migration code up through commit `8d8e5145` is present in the historical integration branch history and `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - Documentation or migration hot-task commits after `8d8e5145` may exist only on `codex/migration-hot-tasks` until a deliberate merge-back step updates the baseline.
  - `codex/mod-first-runtime-integration` is now a historical predecessor branch, not the active local submit/merge branch.
  - Local `migrate-scripteditor` also points to `8d8e5145` and tracks `origin/codex/sync-naqishuo-721ui-to-mmz`.
  - Direct comparison to `origin/mod-first-dev` still shows large differences in `src/main.ts`, `src/ui/**`, `src/styles/**`, `src/application/map/**`, house modules, audio, layout editor, and presenter/runtime coordinator files. These are not safe to merge wholesale.

## Branch Topology

Use these branch roles unless the user explicitly gives a new branch name:

- Current branch: `codex/migration-hot-tasks`
- Branches involved in this migration flow:
  - `origin/codex/sync-naqishuo-721ui-to-mmz`
    - Role: remote target baseline branch.
    - Purpose: protects the current UI, map, backpack, script editor entry, and app behavior.
    - Rule: only receive verified integration slices after boundary checks pass.
  - `migrate-scripteditor`
    - Role: local baseline receiving branch.
    - Upstream/remote counterpart: `origin/codex/sync-naqishuo-721ui-to-mmz`.
    - Purpose: local branch used to merge integration work back into the remote target baseline.
    - Rule: update from remote before merging an integration slice back.
  - `codex/migration-hot-tasks`
    - Role: current runtime hot-task branch.
    - Upstream: `origin/codex/migration-hot-tasks`.
    - Purpose: continue runtime-only migration work in small commits from the current handoff state.
    - Rule: all new runtime migration slices should start here or from a fresh child branch based on it.
- Historical predecessor branch: `codex/mod-first-runtime-integration`
  - Role: previous local integration branch used before the handoff moved to `codex/migration-hot-tasks`.
  - Rule: do not use it for new local submit/merge flow unless the user explicitly asks.
- Source reference branch: `origin/mod-first-dev`
  - Role: read-only source for runtime ideas, existing shellification direction, and mod-first contracts.
  - Rule: do not merge this branch directly into the current baseline or integration branch.
- Older integration checkpoint: `codex/mod-first-dev-block-integration`
  - Role: historical checkpoint that brought in script editor entry baseline work.
  - Rule: do not continue new work there unless the user explicitly asks.

Historical final synchronized state after the `8d8e5145` runtime-stack merge-back:

- `origin/codex/sync-naqishuo-721ui-to-mmz`
- `origin/codex/mod-first-runtime-integration`
- `migrate-scripteditor`
- `codex/mod-first-runtime-integration`

At that checkpoint, these branches had no remaining runtime migration differences. Later documentation-only commits, such as this handoff document, or newer migration hot-task commits can make the current working branch `codex/migration-hot-tasks` lead the baseline until they are intentionally merged back.

Before starting any slice, run:

```powershell
git fetch origin
git status --short --branch
git branch --show-current
git rev-parse --abbrev-ref --symbolic-full-name '@{u}'
```

Expected:

- Current branch is `codex/migration-hot-tasks` or a clearly named child branch based on it.
- Worktree is clean before migration edits begin.
- Upstream is known.

## Merge Back Flow

Use this flow after each verified runtime slice or agreed documentation checkpoint:

1. Work on `codex/migration-hot-tasks` or a child branch created from it.
2. Implement one narrow runtime slice only.
3. Update this handoff document with checkbox state, `Execution State`, `Progress Log`, verification result, branch/baseline status if changed, and the exact next unchecked task.
4. Run targeted runtime tests and `npm.cmd run typecheck`.
5. Run the boundary proof:

```powershell
git diff --name-only -- src\main.ts src\ui src\components src\application\map src\application\backpack src\domain\backpack src\domain\map src\styles
```

Expected:

- Empty output unless the user explicitly approved that slice to touch one of these paths.

6. Commit on the current runtime branch with a runtime-specific message.
7. Push the current runtime branch:

```powershell
git push
```

8. Decide whether this is a merge-back checkpoint:
   - Merge back immediately for completed, verified slices that should become part of the current baseline.
   - Defer merge-back for exploratory or incomplete slices.
9. When merging back to the baseline, use the local baseline mirror:

```powershell
git switch migrate-scripteditor
git pull --ff-only
git merge --no-ff codex/migration-hot-tasks
```

10. Re-run the boundary proof and the relevant verification on `migrate-scripteditor`.
11. Push the baseline:

```powershell
git push origin migrate-scripteditor:codex/sync-naqishuo-721ui-to-mmz
```

12. Switch back to the current runtime branch and sync it from the updated baseline if needed:

```powershell
git switch codex/migration-hot-tasks
git merge --ff-only origin/codex/sync-naqishuo-721ui-to-mmz
git push
```

If `--ff-only` fails in step 12, stop and inspect the graph before merging. Do not rewrite either branch unless the user explicitly asks.

## Recorded Merge Back: Runtime Stack To Baseline

This is the completed merge-back flow that synchronized the runtime migration stack into the target baseline before this handoff document was added:

1. Checked the current integration branch:

```powershell
git switch codex/mod-first-runtime-integration
git status --short --branch
```

2. Found the integration branch was ahead of the target baseline by one runtime-support commit:

```text
db50ef1c chore: ignore local brainstorm notes
```

3. Switched to the local receiving baseline branch:

```powershell
git switch migrate-scripteditor
```

4. Aligned `migrate-scripteditor` with the remote target baseline:

```powershell
git fetch origin
git pull --ff-only
```

5. Merged the remote integration branch into the local receiving baseline:

```powershell
git merge --no-ff origin/codex/mod-first-runtime-integration
```

6. Created merge commit:

```text
8d8e5145 Merge remote-tracking branch 'origin/codex/mod-first-runtime-integration' into migrate-scripteditor
```

7. Ran the lightweight merge check:

```powershell
git diff --check
```

8. Pushed the local receiving branch back to the remote target baseline:

```powershell
git push origin migrate-scripteditor:codex/sync-naqishuo-721ui-to-mmz
```

9. Re-synced local `migrate-scripteditor` to the latest remote target baseline.

10. Switched back to the current integration branch:

```powershell
git switch codex/mod-first-runtime-integration
```

11. Fast-forwarded the integration branch to the latest target baseline.

12. Pushed the integration branch:

```powershell
git push origin codex/mod-first-runtime-integration
```

13. Final confirmation at that checkpoint:

```text
origin/codex/sync-naqishuo-721ui-to-mmz ... origin/codex/mod-first-runtime-integration = 0 0
origin/codex/sync-naqishuo-721ui-to-mmz ... migrate-scripteditor = 0 0
```

Result:

- No remaining runtime-stack commits needed to be merged into the target baseline.
- The last synchronized runtime-stack merge point was `8d8e5145`.

## Commit And Reporting Rules

- Commit once per completed runtime slice or documentation checkpoint.
- Push the active integration branch after each commit.
- Merge back to `origin/codex/sync-naqishuo-721ui-to-mmz` only after the slice is verified and the user-visible boundary check is clean.
- After merge-back, report:
  - active branch and commit
  - baseline branch and commit
  - what was implemented
  - verification commands and results
  - boundary diff result
  - whether baseline was updated
  - next task to run

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

- [x] **Step 1: Find non-UI callers of event-owned playable completion**

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

Status note:

- Audit result: all current production callers remain entry/UI-owned; `applyEventOwnedPlayableCompletion()` is referenced directly only by tests in this branch.
- Therefore Task 1 caller wiring is intentionally deferred until a runtime/application-owned caller exists or the user explicitly approves a tiny `src/main.ts` slice.

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

- [x] **Step 1: Compare remaining runtime-only diffs against mod-first-dev**

Run:

```powershell
git diff --name-status HEAD..origin/mod-first-dev -- src\application\dialogue src\application\events src\application\story src\core\runtime src\core\contracts tests
```

Expected:

- Extract runtime-only candidates.
- Exclude renames or deletions that drag UI/main shell changes into the current branch.

- [x] **Step 2: Select one isolated completion/follow-up gap**

Choose one gap that:

- can be tested in existing Node tests
- does not require visible UI changes
- preserves old compatibility fields
- keeps compatibility in a shared runtime helper or contract module

- [x] **Step 3: Write failing test and implement**

Use the nearest existing runtime test file. Keep the slice narrow enough for one commit.

- [x] **Step 4: Run verification and boundary proof**

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

Local slice completed:

- Selected gap: `story-runtime` scene helpers were dropping `cityDefinitions` / `houseDefinitions` outside the continuation helper path.
- Implemented slice: `startStoryEventById()`, `triggerStoryEvents()`, `advanceStorySceneStep()`, and `chooseStorySceneOption()` now keep the incoming world-definition context.
- Added/updated coverage: `tests/event-continuation-runtime.test.cjs` now proves story runtime keeps world definitions across scene start and choice continuation.

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

- [x] **Step 1: Audit mod-first-dev application runtime coordinators**

Run:

```powershell
git diff --name-status HEAD..origin/mod-first-dev -- src\application\runtime src\application\startup src\core\runtime src\main.ts
```

Expected:

- Identify coordinator helpers that can be added as dormant or test-only application modules without changing visible entry flow.
- Explicitly list any helper that would require `src/main.ts` shellification and defer it.

- [x] **Step 2: Pick only a dormant/testable helper**

Allowed examples:

- a pure runtime input adapter
- a presenter-neutral runtime transition helper
- a typed follow-up continuation helper

Rejected examples:

- direct render coordinator replacement
- startup shell takeover
- map travel UI animation coordinator replacement
- city/house transition rewrite that changes current behavior

- [x] **Step 3: Test first and implement**

Add a Node test that imports the helper directly and validates pure behavior.

- [x] **Step 4: Run verification**

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

Local slice completed:

- Selected helper: council priority house resolution inside `src/application/runtime/navigation-time-follow-up.ts`.
- Why this fit Task 3: it is a pure runtime/application helper, it can be imported directly by a Node test, and it does not require entry-shell takeover or visible transition rewrites.
- Implemented behavior: exported `resolveCouncilPriorityHouseDefinition()` now accepts optional `buildingArrangements` and uses canonical owner matching to project current-city and `primaryNpcId` overrides onto the resolved priority house.
- Added coverage: `tests/navigation-time-follow-up.test.cjs`.

Additional local helper slice completed:

- Selected helper: `src/application/story/story-runtime-state-bridge.ts`.
- Why this fit Task 3: it is a pure runtime/application helper, directly testable in Node, and it stays dormant until a runtime caller chooses to consume authored city/house definition context.
- Implemented behavior: `createStoryRuntimeDefinitionContext()` materializes authored world definitions through app-state status layers, and `applyStoryRuntimeResultToAppState()` maps runtime world-definition results back into `cityStatusById` / `buildingStatusById`.
- Added coverage: `tests/story-runtime-state-bridge.test.cjs`.

Additional local context slice completed:

- Selected helper seam: `src/application/content/active-game-content.ts` plus content/scenario pack manifest loading.
- Why this fit Task 3: it stays inside content/runtime context preparation, is directly testable in Node, and does not require `src/main.ts`, UI, map, backpack, or visible flow rewiring.
- Implemented behavior: content packs now explicitly accept `eventBindings`, `settlements`, `progressTracks`, and `progressTrackBindings`; `createActiveGameContent()` builds arrays plus `ById` maps for them; `createActiveGameContentContext()` exposes those maps together with `cityDefinitionsById` / `houseDefinitionsById` on `storyContent`.
- Added coverage: `tests/active-game-content-story-context.test.cjs`.

- [x] **Step 5: Commit and report**

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

- [x] **Step 1: Do not start this task until runtime-only slices are stable**

Expected:

- Tasks 1-3 are complete or explicitly deferred with reasons.
- User has explicitly approved considering `src/main.ts`.

- [x] **Step 2: Decide whether a tiny entry-wiring slice is needed**

If `src/main.ts` is the only remaining caller for an already-tested runtime helper, propose a tiny wiring slice that:

- changes only one call path
- does not replace the entry shell
- includes targeted tests or browser smoke
- has an explicit rollback boundary

- [x] **Step 3: Reject full shellification in this plan**

Local Task 4 slice completed:

- Approved boundary: one narrow `src/main.ts` wiring expansion plus runtime/application seam changes only; no UI/map/backpack shell rewrite.
- Implemented behavior: `indoor-screen-story-follow-up` now routes timing-trigger settlement world updates through `story-runtime` + `story-runtime-state-bridge`; `story-runtime` applies settlement contents on initial trigger activation; `main-runtime-orchestrator` and `house-runtime` both project resulting city/building definition deltas back into app-state status layers.
- Added coverage: `tests/indoor-screen-story-runtime.test.cjs` plus the existing child 25/26 robustness subset.

Additional local Task 4 slice completed:

- Approved boundary: keep the same tiny `src/main.ts` passthrough seam and continue only inside shared runtime/application story modules.
- Implemented behavior: `story-runtime` now consumes `eventBindingsById` for `city-enter`, `house-enter`, and `indoor-screen-shown`, runs settlement-triggered progression evaluation plus settlement emission, persists optional `gameState.runtime.progression`, and receives `eventBindings/progressTrack` storyContent passthrough from `indoor-screen-story-follow-up`, `main-runtime-orchestrator`, and `house-runtime`.
- Added coverage: `tests/indoor-screen-story-runtime.test.cjs` now also proves main runtime orchestrator consumes event binding plus progression settlement output, and browser smoke confirmed current localhost startup -> map -> backpack -> city flow without console warn/error logs.

Record any need for full shellification as a new dedicated plan. Do not borrow `mod-first-dev` shellification wholesale inside this runtime migration handoff.

## Exit Check

- [ ] Current branch `codex/migration-hot-tasks` remains based on the current UI/map/backpack baseline.
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
- [x] Branch topology recorded.
- [x] Merge-back flow recorded.
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
- Next Required Action: `Resume at Task 1 on codex/migration-hot-tasks, then merge verified checkpoints back to origin/codex/sync-naqishuo-721ui-to-mmz through the documented merge-back flow.`
- Next Entry Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-29-mod-first-runtime-integration-handoff-plan.md`
- Push Status: `current-branch-pushed; baseline-merge-pending-for-latest-doc-checkpoint`
- Push Commit: `latest origin/codex/migration-hot-tasks`
- Resume From: `Open this document, confirm branch codex/migration-hot-tasks, then execute the first unchecked task without changing UI/map/backpack/main shell paths unless the user explicitly approves that slice.`
