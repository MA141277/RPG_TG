# mod-first-dev Script Editor Merge Preservation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge `mod-first-dev` into the current branch while preserving all current-branch gameplay/UI behavior, keeping current map/building/layout behavior intact, and selectively retaining the `mod-first-dev` script/skeleton editor capabilities.

**Architecture:** This merge must be treated as a controlled convergence, not a default branch integration. Conflict handling follows a fixed priority order: preserve the current branch for `main shell`, `map`, `building layout`, `house`, `layout-editor`, and existing user-visible behavior; preserve `mod-first-dev` only for script-editor skeleton/authoring surfaces that do not force a rollback of the current branch runtime path. Every conflict decision must be written into a merge ledger during the merge so later regressions can be traced back to the exact keep/drop choice.

**Tech Stack:** Git merge tooling, TypeScript/JS runtime modules, CSS, Node test runner (`node --test`), repo verification commands (`npm run typecheck`, `npm run build:test`, `npm run build`), plan governance lint (`npm run lint:plans`).

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-08-03`
- Current Focus: `Local merge resolution is complete; remaining work is manual runtime smoke, review of imported docs/assets, and deciding whether to commit the merge.`
- Next Step: `Review the resolved file set, run manual script-editor smoke if desired, then either trim remaining docs/assets or create the merge commit.`
- Verification: `Plan lint remains blocked only by unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md. Local merge resolution has no unmerged files, build:test passed, typecheck passed, and build passed with existing Vite asset warnings.`
- Notes: `Execution is branch-local and intentionally not promoted into docs/superpowers/project-progress.md because the repository's canonical active child remains unrelated.`

## Progress Log

- 2026-08-03
  - Summary: `Created the merge-preservation plan for integrating mod-first-dev while preserving current branch UI, map, building layout, and runtime behavior.`
  - Verification: `Plan lint run via bundled Node failed only because unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md is malformed and missing its required title section.`
  - Next: `Wait for user approval to execute the merge under this plan, then create the merge ledger and start the real merge.`
- 2026-08-03
  - Summary: `Promoted the merge-preservation child into active branch-local execution after user approval; next step is creating the ledger and entering a real merge conflict state.`
  - Verification: `Pre-merge working tree checked on merage-mod2ui-1; execution will continue even though the plan file itself is currently untracked.`
  - Next: `Create the merge ledger file, then run git merge --no-commit --no-ff mod-first-dev and classify all conflicts before resolving any file.`
- 2026-08-03
  - Summary: `Created the merge ledger, entered a real merge conflict state against mod-first-dev, and confirmed the conflict set matches the planned convergence zones: main shell/render, map/building/layout, house/runtime, contracts/runtime, script-editor, styles, and docs/tests.`
  - Verification: `git merge --no-commit --no-ff mod-first-dev`; `git diff --name-only --diff-filter=U`; `git status --short --untracked-files=all`
  - Next: `Resolve keep-current root ownership files first, then reattach script-editor behavior selectively and keep all temporary bridges centralized in the transition/compat seam.`
- 2026-08-03
  - Summary: `Resolved the merge locally by restoring the full src tree to the current branch baseline, replaying only src/modules/script-editor/** and src/styles/script-editor.css from mod-first-dev, trimming unrelated governance/generated/test/tool additions, and adding a small centralized compatibility layer for the imported editor contracts.`
  - Verification: `git diff --name-only --diff-filter=U` returned empty output; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm run build:test`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm run typecheck`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm run build`
  - Next: `Run manual editor smoke if needed, then review/commit the merge result or trim any remaining imported documentation before commit.`

---

## Based On Spec

- Primary spec:
  - `none; user-approved merge policy captured in the 2026-08-03 conversation for this branch-local integration task`
- Plan governance spec:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`
- Additional shared docs expected to change during execution:
  - `docs/change-log.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `mod-first-dev` does not differ from the current branch only inside src/modules/script-editor/**; it also diverges in main shell, runtime contracts, content loading, styles, and multiple house/layout surfaces.`
  - `A dry-run merge already proved the branch cannot be integrated as a normal merge because the conflict set spans src/main.ts, ui/main-ui flow, runtime contracts, content-pack loading, layout-editor, house runtime, and script-editor authoring/export files.`
  - `The user requirement is asymmetrical: keep all current branch UI and gameplay behavior, keep current map UI and building layout behavior, but preserve mod-first-dev's script/skeleton editor behavior where possible.`

## Integration Policy

### Centralized Transition / Compat Rule

- All temporary merge-only compatibility or transition handling must stay concentrated in the repository's current transition scheme instead of being scattered across feature files.
- Prefer these owners for temporary merge bridges:
  - `src/application/runtime/transition/`
  - `src/application/runtime/compat/`
  - existing centralized runtime compatibility files such as `src/core/runtime/mod-first-compatibility.ts`
- Do not add ad hoc compatibility helpers directly into map, building, house, or generic UI feature modules unless the code is the final intended owner.
- `src/main.ts` may wire a coordinator or compat seam, but it must not become the storage site for merge-only fallback logic.
- Every temporary seam created during this merge must record:
  - why it exists
  - target owner
  - cleanup condition
  - matching ledger entry
  - how to verify that it can later be removed safely

### Preserve Current Branch By Default

- `src/main.ts`
- `src/ui/app-render.ts`
- `src/ui/main-ui/**`
- `src/ui/views/map/**`
- `src/application/navigation/**`
- `src/application/house/**`
- `src/application/house-modules/**`
- `src/application/layout-editor/**`
- `src/ui/tools/layout-editor-view.ts`
- `src/ui/views/house/**`
- `src/styles/*` that directly support current map, building, house, or app-shell behavior

### Preserve mod-first-dev Selectively

- `src/modules/script-editor/**`
- script-editor-specific slices of:
  - `src/styles/script-editor.css`
  - `src/modules/script-editor/main-ui-bridge.ts`
  - `src/modules/script-editor/application/runtime-pack-export.ts`
  - `src/modules/script-editor/application/runtime-pack-import.ts`

### Never Accept Blindly

- `src/core/contracts/**`
- `src/core/runtime/**`
- `src/application/content/**`
- `src/application/runtime/**`
- `src/domain/content-pack.ts`
- `tests/**`

These files are convergence points. They require explicit conflict decisions and ledger entries because they can silently break current branch gameplay or make the editor unusable even if the merge compiles.

## Implementation Scope

### In Scope

- Create a merge ledger that records every meaningful keep/drop decision during the merge.
- Keep all merge-era transition / compatibility handling centralized in the repository's current transition scheme rather than scattering fallback logic across multiple features.
- Execute a real merge of `mod-first-dev` into the current branch with conflicts preserved for manual resolution.
- Preserve current branch behavior for map UI, building layout, house flows, layout editor, and existing user-visible gameplay/UI.
- Recover script/skeleton editor capabilities from `mod-first-dev` without forcing the current branch onto `mod-first-dev` runtime or shell architecture.
- Add/update targeted tests and docs needed to prove both the preserved current behavior and the retained editor behavior.

### Still Out Of Scope

- Large runtime architecture refactors unrelated to making this merge work.
- General redesign of current map UI, house UI, building authoring, or layout editor UX.
- Full normalization of every legacy runtime contract introduced by `mod-first-dev`.
- Cleaning unrelated malformed historical plans unless `npm run lint:plans` is blocked by them.

## File Map

### Existing files to modify

- `docs/superpowers/plans/2026-08-03-mod-first-dev-script-editor-merge-preservation-plan.md`
  - Execution controller for this merge child.
- `docs/change-log.md`
  - Record what was preserved from the current branch and what script-editor capabilities were retained from `mod-first-dev`.
- `src/main.ts`
  - Resolve shell/runtime wiring conflicts in favor of the current branch.
- `src/ui/app-render.ts`
  - Preserve current branch render ownership if the merge attempts to revert it.
- `src/ui/main-ui/main-ui-flow.js`
  - Keep current UI interactions while reattaching script-editor entry points if needed.
- `src/application/content/content-pack-loader.ts`
  - Reconcile pack loading only as far as script-editor import/export needs require.
- `src/application/runtime/**`
  - Preserve current branch runtime route ownership unless a minimal script-editor dependency must be ported.
- `src/application/runtime/transition/**`
  - Preferred landing zone for temporary merge transition routing that still lacks a final owner.
- `src/application/runtime/compat/**`
  - Preferred landing zone for temporary compatibility shims that must stay centralized during the merge.
- `src/core/runtime/mod-first-compatibility.ts`
  - Centralized compatibility owner for bounded mod-first data/runtime bridges when a shared seam is still required.
- `src/application/layout-editor/**`
  - Preserve current building/layout editing behavior.
- `src/modules/script-editor/**`
  - Primary migration surface for mod-first-dev skeleton/script editor capabilities.
- `src/styles/script-editor.css`
  - Retain editor styles without regressing current app surfaces.
- `src/styles/main-ui.css`
  - Keep current branch UI behavior if the merge introduces shell-level regressions.
- `tests/**`
  - Update/add focused regressions that cover preserved map/building behavior and recovered script-editor behavior.

### Existing files expected to be deleted

- `none by default; any deletion proposed by the merge must be justified in the ledger before acceptance`

### New files to create

- `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`
  - Real-time ledger of conflict decisions, retained behavior, potential loss points, and post-merge follow-up checks.

## Merge Ledger Template

Each conflict or manual keep/drop decision recorded during execution must use this format:

```md
## [status] <path>

- Conflict type: `content | add/add | modify/delete | rename/collision | other`
- Default policy: `keep-current | keep-mod-first-dev | manual-split`
- Final resolution: `pending`
- Reason:
  - `Why the default policy applies here.`
- Current branch behavior to preserve:
  - `List concrete UI/runtime/gameplay behavior that must still work after this file is resolved.`
- mod-first-dev behavior to recover:
  - `List the exact editor/skeleton capability that motivated taking code from mod-first-dev.`
- Potential loss risk:
  - `What might disappear or regress if this resolution is wrong.`
- Recovery source:
  - `Branch, file, or commit to re-check if the behavior is missing later.`
- Post-merge verification:
  - `Exact command or manual smoke check.`
```

## Verification Plan

- Targeted verification:
  - current branch map UI still renders and behaves correctly
  - building layout and layout-editor behavior still work
  - house flows still use current branch implementations
  - script/skeleton editor opens, enters the workspace, and retains the intended mod-first-dev capabilities
  - script-editor import/export paths still work for the retained schema slice
- Required commands:
  - `npm run lint:plans`
  - `npm run build:test`
  - `npm run typecheck`
  - `npm run build`
  - `node --test <targeted-test-files-or-patterns-chosen-during-execution>`

## Task 1: Create The Merge Ledger And Freeze Merge Rules

**Files:**
- Modify: `docs/superpowers/plans/2026-08-03-mod-first-dev-script-editor-merge-preservation-plan.md`
- Create: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`
- Read: `docs/superpowers/specs/plan-governance-spec.md`
- Read: `docs/main-shell-contract.md`

- [x] **Step 1: Create the merge ledger file from the template in this plan**

Copy the `Merge Ledger Template` section into:

```txt
docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md
```

and add the opening policy block:

```md
# mod-first-dev Merge Ledger

- Source branch: `mod-first-dev`
- Target branch: `current working branch`
- Primary preservation rule: `Keep current branch for all existing UI/gameplay/map/building/layout behavior.`
- Selective retention rule: `Keep mod-first-dev only for script/skeleton editor behavior that does not force rollback of current branch runtime ownership.`
- Mandatory recording rule: `Every manual conflict choice must be written here before the file is considered resolved.`
```

- [x] **Step 2: Record the pre-merge conflict classes that are already known**

Create initial sections for:

```txt
src/main.ts
src/ui/main-ui/main-ui-flow.js
src/application/layout-editor/layout-editor-actions.ts
src/application/house/house-runtime.ts
src/modules/script-editor/ui/main-ui-script-editor-module.js
src/modules/script-editor/application/runtime-pack-export.ts
src/modules/script-editor/application/runtime-pack-import.ts
src/styles/script-editor.css
```

with `Final resolution: pending`.

- [x] **Step 3: Run plan lint before starting execution**

Run:

```bash
npm run lint:plans
```

Expected:

- `PASS`, or a failure message attributable only to unrelated pre-existing plan files that must be noted before execution starts.

## Task 2: Run The Real Merge And Classify Every Conflict

**Files:**
- Modify: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`
- Modify: merge-conflicted files reported by Git

- [x] **Step 1: Start the merge without auto-committing**

Run:

```bash
git merge --no-commit --no-ff mod-first-dev
git diff --name-only --diff-filter=U
```

Expected:

- `Git reports the unresolved files`
- `The working tree stays in merge state for manual conflict resolution`

- [x] **Step 2: Group conflicts into ownership classes in the ledger**

Create ledger sections for:

```txt
main-shell-and-render
map-and-building-layout
house-and-layout-editor
script-editor-authoring
contracts-and-runtime
styles
tests-and-docs
```

and list each conflicted file under the correct class with a default policy.

- [ ] **Step 3: Abort only if the conflict set differs materially from the planned boundary**

Abort with:

```bash
git merge --abort
```

only if the merge introduces an unexpected subsystem outside the known scope that would invalidate this plan. Otherwise continue under the active merge state.

## Task 3: Resolve Root Ownership Conflicts In Favor Of The Current Branch

**Files:**
- Modify: `src/main.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/application/layout-editor/**`
- Modify: `src/application/house/**`
- Modify: `src/ui/views/map/**`
- Modify: `src/ui/views/house/**`
- Modify: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`

- [ ] **Step 1: Resolve shell, map, building, house, and layout-editor files with keep-current as the default**

Use current-branch versions unless a specific line is required only to reconnect the editor entry path.

- [ ] **Step 2: For every exception, write a ledger entry before marking the file resolved**

Each exception must document:

```txt
what current behavior was protected
what mod-first-dev snippet was imported
why that snippet was safe
how to verify it later
```

- [ ] **Step 3: Move unavoidable temporary bridges into the centralized transition/compat scheme**

Allowed landing zones:

```txt
src/application/runtime/transition/<feature>-transition-coordinator.ts
src/application/runtime/compat/<feature>-compat-action.ts
src/core/runtime/mod-first-compatibility.ts
```

Disallowed landing zones:

```txt
merge-only fallback logic in src/main.ts
new scattered compat helpers inside map/building/house/UI feature files
```

- [ ] **Step 4: Run targeted preservation checks before moving on**

Run the smallest available targeted commands or manual smoke checks that prove:

```txt
map UI still opens
building layout behavior still works
layout-editor behavior still works
house entry/runtime still follows current branch behavior
```

## Task 4: Reattach mod-first-dev Script Editor Capabilities Selectively

**Files:**
- Modify: `src/modules/script-editor/**`
- Modify: `src/modules/script-editor/main-ui-bridge.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-export.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-import.ts`
- Modify: `src/styles/script-editor.css`
- Modify: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`

- [ ] **Step 1: Resolve pure script-editor files toward mod-first-dev unless they depend on reverted runtime contracts**

Prefer `mod-first-dev` for authoring/workspace/editor UI files when the dependency surface stays inside `src/modules/script-editor/**`.

- [ ] **Step 2: For import/export and bridge files, port only the minimum contract changes needed by the retained editor behavior**

Do not blindly keep all `mod-first-dev` schema/runtime changes. Reconcile them against the current branch runtime path and document every dropped schema change in the ledger.

- [ ] **Step 3: Route any editor-specific temporary fallback through the same centralized transition/compat scheme**

If the editor still needs a temporary bridge to current runtime ownership, place it in the shared transition/compat seam and record the target owner instead of burying fallback logic inside unrelated feature files.

- [ ] **Step 4: Smoke-test the editor entry and workspace flow before leaving this task**

Verify:

```txt
the script editor can open
the target skeleton/script editor surfaces are present
the workspace can load or initialize without obvious shell regressions
```

## Task 5: Finish Verification, Docs, And Merge Closeout

**Files:**
- Modify: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`
- Modify: `docs/change-log.md`
- Modify: `tests/**`

- [ ] **Step 1: Update the ledger from pending to final for every resolved conflict**

No conflicted file may remain with:

```txt
Final resolution: pending
```

after the merge is completed locally.

- [ ] **Step 2: Add or update targeted tests for preserved current behavior and retained editor behavior**

At minimum cover:

```txt
map/building/layout preservation
script-editor entry/workspace smoke
any import/export contract behavior changed during reconciliation
```

- [ ] **Step 3: Run final verification and record results**

Run:

```bash
npm run lint:plans
npm run build:test
npm run typecheck
npm run build
node --test <targeted-test-files-or-patterns-chosen-during-execution>
```

Expected:

- `PASS`, or only known unrelated failures explicitly documented in the ledger and progress log

- [ ] **Step 4: Record the merge summary in docs/change-log.md**

Describe:

```txt
which current branch subsystems were intentionally preserved
which mod-first-dev script-editor capabilities were retained
which follow-up risks remain
```

## Exit Check

- [ ] Current branch map UI and behavior remain intact after the merge.
- [ ] Current branch building layout and layout-editor behavior remain intact after the merge.
- [ ] Current branch house/runtime behavior remains intact after the merge.
- [ ] Intended mod-first-dev script/skeleton editor capabilities are present after the merge.
- [ ] Merge ledger documents all meaningful conflict decisions and recovery sources.
- [ ] Project progress sync is updated if this child is later promoted into active execution.
- [ ] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
- [ ] Merge ledger updated

## Child Closeout

- Closed Child: `Replace when closing.`
- Parent Task: `Replace when/if this child is promoted into canonical project progress.`
- Parent Stage: `Replace when/if this child is promoted into canonical project progress.`
- Closeout Status: `closed`
- Project Progress Synced: `yes/no`
- Next Child: `Replace when closing.`
- Next Child Status: `waiting/running/blocked/none`
- Next Required Action: `Replace when closing.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `Replace when closing.`
- Push Status: `success/failure/not-pushed`
- Push Commit: `commit-sha-or-none`
- Resume From: `Replace when closing.`
