# Post-Merge Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validate and stabilize the `mod-first-dev` merge on `merage-mod2ui-1` by smoke-testing preserved current-branch flows first, then fixing retained script-editor compatibility gaps, then adding regression coverage, and finally closing documentation and compat-governance residue.

**Architecture:** This child keeps the existing post-merge ownership rule intact: current branch remains owner for shell, map, building layout, and house flows, while imported `src/modules/script-editor/**` behavior is allowed to survive only through centralized compat seams. Work proceeds in four ordered batches so observed regressions drive the minimum required compatibility/code changes before tests and documentation are updated.

**Tech Stack:** Vite localhost runtime at `http://localhost:5173/`, in-app browser validation, TypeScript/JS source under `src/**`, Node test runner, repo verification commands `pnpm run build:test`, `pnpm run typecheck`, `pnpm run build`, and targeted `node --test`.

## Execution State

- Status: `completed`
- Last Updated: `2026-08-03`
- Current Focus: `Closed after smoke, retained script-editor compatibility fixes, regression coverage, and documentation sync.`
- Next Step: `None unless a new post-merge regression is reproduced.`
- Verification: `Browser smoke passed; build:test passed; targeted node tests passed; typecheck passed; build passed with existing Vite asset/script warnings; lint:plans was rerun and failed only because unrelated docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md is malformed and missing its title section.`
- Notes: `Branch-local stabilization follow-up for the completed merge commit d5bb961b; intentionally not promoted into docs/superpowers/project-progress.md because the repository's canonical governed child remains unrelated.`

## Progress Log

- 2026-08-03
  - Summary: `Opened a branch-local post-merge stabilization child to execute smoke validation, compatibility follow-up, regression tests, and documentation closeout in the user-requested order.`
  - Verification: `Not run`
  - Next: `Execute Task 1 against the running localhost app before touching compat/runtime files.`
- 2026-08-03
  - Summary: `Browser smoke verified the retained editor entry path and preserved current-branch temple/house UI flow; runtime preview now reaches temple opening/council flow without console errors.`
  - Verification: `In-app browser smoke against http://localhost:5173/` passed through `剧本编辑 -> 使用模板 -> 运行预览 -> 寺庙开局 -> 评定/差事分配 -> 属性面板/NPC 交互` with empty browser `error/warn` logs.
  - Next: `Reproduce any retained script-editor compatibility gap programmatically before editing.`
- 2026-08-03
  - Summary: `Reproduced and fixed two retained script-editor compatibility gaps: runtime preview export now supports flow-backed event actions via the shared playable runtime path, and runtime-pack round trips now preserve menu destinations instead of degrading into raw openCityMenuPanel actions.`
  - Verification: `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm run build:test`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node --test tests/script-editor-runtime-preview-compat.test.cjs`
  - Next: `Sync ledger/change-log/plan closeout and rerun final verification commands.`
- 2026-08-03
  - Summary: `Added targeted regression coverage and closed stabilization documentation for the merge slice.`
  - Verification: `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm run typecheck`; `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm run build`
  - Next: `Run lint:plans once more and record the remaining unrelated blocker if it persists.`
- 2026-08-03
  - Summary: `Reran plan lint after closeout; the stabilization child itself is clean and the only remaining blocker is the pre-existing malformed historical plan file.`
  - Verification: `PATH=/Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ms/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm run lint:plans` failed only because `docs/superpowers/plans/2026-07-23-haozhou-coin-ingot-flight.md` is missing its required title section.
  - Next: `No remaining actions in this child.`

---

## Based On Spec

- Primary spec:
  - `none; execution order and acceptance criteria were set directly in the 2026-08-03 conversation after the merge landed`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`
- Related owner docs:
  - `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`
  - `docs/superpowers/plans/2026-08-03-mod-first-dev-script-editor-merge-preservation-plan.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `The merge is already committed and pushed as d5bb961b on merage-mod2ui-1, so this child stabilizes a landed branch state rather than resolving an in-progress merge.`
  - `Static verification already passed before this child starts: build:test, typecheck, and build all succeeded, but no current-branch map/building/house/editor smoke or targeted regression tests were added for the merge slice.`
  - `Known residue includes bounded script-editor import families, centralized compat seams without lifecycle headers, and missing docs/change-log/ledger closeout state.`

## Implementation Scope

### In Scope

- Smoke-test the preserved current-branch map, building/layout, house, and script-editor entry/workspace paths against the running localhost app.
- Fix only the post-merge issues that are reproduced by smoke or clearly block retained script-editor import/export compatibility.
- Add targeted regression tests for preserved current-branch owners and retained script-editor compatibility seams touched by the fixes.
- Close merge documentation and compat-governance residue for the files changed in this child.

### Still Out Of Scope

- Re-architecting shell ownership away from the current branch.
- Broad script-editor redesign or importing unsupported UI family slices beyond the minimum bounded compatibility work needed by reproduced failures.
- Closing or changing the repository's unrelated canonical governed child in `docs/superpowers/project-progress.md`.

## File Map

### Existing files to modify

- `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`
  - Record smoke findings, fixed compatibility gaps, and final closeout state.
- `docs/superpowers/plans/2026-08-03-mod-first-dev-script-editor-merge-preservation-plan.md`
  - Sync the merge child with post-merge stabilization outcomes and verification.
- `docs/superpowers/plans/2026-08-03-post-merge-stabilization-plan.md`
  - Track execution status for this stabilization child.
- `docs/change-log.md`
  - Record shared contract, compat seam, and retained script-editor behavior introduced by the merge and any stabilization edits.
- `src/modules/script-editor/application/runtime-pack-import.ts`
  - Primary owner for bounded import-family compatibility behavior if smoke or repro confirms retained editor packs still fail.
- `src/modules/script-editor/application/runtime-pack-export.ts`
  - Owner for retained export behavior if smoke or repro shows exporter/runtime contract drift.
- `src/modules/script-editor/**`
  - Script-editor retained surfaces that may need narrow fixes discovered during smoke.
- `src/core/runtime/mod-first-compatibility.ts`
  - Centralized compat seam for any bounded runtime action/schema bridge added or cleaned during stabilization.
- `src/core/registry/builtin-playable-shell-registry.ts`
  - Minimal shell-backed builtin registry seam if retained editor behavior needs richer centralized metadata.
- `src/domain/content-pack.ts`
  - Shared content-pack compat contract if retained import/export fixes require it.
- `src/domain/event.ts`
  - Shared event-route compat contract if retained editor/runtime convergence needs it.
- `src/core/contracts/playable-runtime.ts`
  - Shared playable compat contract if retained editor import/export fixes require it.
- `tests/**`
  - Add targeted regression coverage for any fixed post-merge gap.

### Existing files expected to be deleted

- `none by default`

### New files to create

- `none by default; add test files only if no existing targeted suite is the right home`

## Verification Plan

- Targeted verification:
  - `Current map screen still loads without overlay/runtime errors.`
  - `Current building/layout flow still opens and behaves on its preserved owner path.`
  - `Current house flow still uses preserved current-branch runtime ownership.`
  - `Script editor still opens from the current branch UI path and its retained workspace can load/export the bounded slice used in smoke.`
  - `Any new compatibility seam is covered by a targeted automated regression.`
- Required commands:
  - `pnpm run build:test`
  - `node --test <targeted-tests-chosen-during-execution>`
  - `pnpm run typecheck`
  - `pnpm run build`
  - `pnpm run lint:plans`

### Task 1: Smoke The Merged Runtime Surfaces

**Files:**
- Modify: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`
- Modify: `docs/superpowers/plans/2026-08-03-post-merge-stabilization-plan.md`
- Read: `docs/superpowers/plans/2026-08-03-mod-first-dev-script-editor-merge-preservation-plan.md`

- [x] **Step 1: Exercise the running localhost app in the browser**

Validate this flow order against `http://localhost:5173/`:

1. app loads
2. first meaningful screen renders without framework overlay
3. current map entry path is visible and interactive
4. one preserved current-branch flow for building/layout or house opens
5. script-editor entry path opens and reaches the retained workspace

- [x] **Step 2: Capture findings in the merge ledger**

Append a dated smoke section to `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md` with:

- passed flows
- failed flows
- console/runtime errors
- the exact next file owners to patch if a failure was reproduced

- [x] **Step 3: Sync this plan state**

Update `Execution State` and `Progress Log` in this plan with the smoke result and whether Task 2 needs code changes.

### Task 2: Fix Reproduced Script-Editor Compatibility Gaps

**Files:**
- Modify: `src/modules/script-editor/application/runtime-pack-import.ts`
- Modify: `src/modules/script-editor/application/runtime-pack-export.ts`
- Modify: `src/modules/script-editor/**`
- Modify: `src/core/runtime/mod-first-compatibility.ts`
- Modify: `src/core/registry/builtin-playable-shell-registry.ts`
- Modify: `src/domain/content-pack.ts`
- Modify: `src/domain/event.ts`
- Modify: `src/core/contracts/playable-runtime.ts`
- Modify: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`

- [x] **Step 1: Reproduce each Task 1 failure before editing**

For every failing retained-editor path from Task 1, write the exact reproduction note into the merge ledger:

- entry path
- observed failure
- owning file to patch

- [x] **Step 2: Patch only the centralized owner needed for the reproduced gap**

Rules:

- keep current-branch shell/map/building/house owners unchanged
- prefer `src/core/runtime/mod-first-compatibility.ts` or existing shared contracts for temporary convergence
- do not spread fallback logic into `src/main.ts` or preserved current-branch feature owners

- [x] **Step 3: Run focused verification immediately after each fix**

Run the smallest relevant command from:

```bash
pnpm run build:test
pnpm run typecheck
node --test <targeted-test-files-or-pattern>
```

and rerun the failing browser flow before taking the next fix.

- [x] **Step 4: Record the final fixed gap in the merge ledger**

For each fixed issue, add:

- changed file owner
- why the compat seam exists
- cleanup condition
- verification command and result

### Task 3: Add Targeted Regression Coverage

**Files:**
- Modify: `tests/**`
- Modify: `docs/superpowers/plans/2026-08-03-post-merge-stabilization-plan.md`
- Modify: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`

- [x] **Step 1: Add or extend the narrowest existing tests that cover the fixed gap**

Test targets must cover only the stabilized ownership/contracts touched in Task 2:

- preserved current-branch owner path remains intact
- retained script-editor compat path keeps working

- [x] **Step 2: Run the targeted suite**

Run the exact targeted tests you touched with `node --test ...`, then run:

```bash
pnpm run build:test
pnpm run typecheck
pnpm run build
```

- [x] **Step 3: Sync plan and ledger**

Record the targeted test commands and results in both this plan and the merge ledger.

### Task 4: Close Compat And Documentation Residue

**Files:**
- Modify: `src/core/runtime/mod-first-compatibility.ts`
- Modify: `src/core/registry/builtin-playable-shell-registry.ts`
- Modify: `docs/change-log.md`
- Modify: `docs/merge-ledgers/2026-08-03-mod-first-dev-merge-ledger.md`
- Modify: `docs/superpowers/plans/2026-08-03-mod-first-dev-script-editor-merge-preservation-plan.md`
- Modify: `docs/superpowers/plans/2026-08-03-post-merge-stabilization-plan.md`

- [x] **Step 1: Add lifecycle headers to any compat/transition file changed in this child**

Each changed compat file must include:

- created date
- feature
- temporary reason
- target owner
- remove-when condition

- [x] **Step 2: Close documentation gaps**

Update:

- `docs/change-log.md` with the merge/stabilization contract changes
- merge ledger state from active/pending wording to final post-merge wording
- merge preservation plan with final verification status and post-merge stabilization notes

- [x] **Step 3: Run final documentation verification**

Run:

```bash
pnpm run lint:plans
```

Record whether failures are only the known unrelated historical malformed plan or anything new introduced by this child.

## Exit Check

- [ ] `Smoke validation is recorded for map, preserved current-branch flow, and script-editor entry/workspace.`
- [ ] `Any reproduced retained-editor compatibility gap is fixed or explicitly logged as unresolved.`
- [ ] `Targeted automated regression coverage exists for every code fix made in this child.`
- [ ] `Merge ledger, merge plan, and change-log reflect the post-merge stabilized state.`
- [ ] Project progress sync remains intentionally unchanged because this is a branch-local child outside the canonical governed owner path.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
