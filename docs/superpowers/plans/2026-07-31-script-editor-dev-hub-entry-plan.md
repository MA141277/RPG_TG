# Script Editor Dev Hub Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the script editor landing page with a development interface hub that lists the 14 editor/tool entries as one organized entry screen.

**Architecture:** Keep the existing `open-script-editor` and `script-editor-landing` route. Add the hub markup and action handling inside `src/modules/script-editor/ui/main-ui-script-editor-module.js`; style it in `src/styles/script-editor.css`; keep `src/main.ts` untouched.

**Tech Stack:** Vite app, JavaScript UI module, CSS design tokens where practical, Node test runner source contract tests.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-31`
- Current Focus: `Implementation complete; local verification recorded.`
- Next Step: `Review or commit the local implementation if desired.`
- Verification: `node --test tests/script-editor-entry-availability.test.cjs PASS; npm run lint:plans PASS; npm run build:test PASS; npm run build PASS; npm run typecheck FAILS on unrelated existing src/ui/views/minigames/city-begging-default-dialogue-view.ts readonly string[] mismatch.`
- Notes: `User requested immediate inline implementation after approving Approach A. Browser smoke verified the main menu label, the hub renders 14 entries, and the script editor project page returns to the hub.`

## Progress Log

- 2026-07-31
  - Summary: `Plan created for the script editor development hub entry replacement.`
  - Verification: `Not run`
  - Next: `Start Task 1 with a failing source contract test.`
- 2026-07-31
  - Summary: `Implemented the development hub as the script editor landing page, grouped 14 entries, preserved the script editor project-management page behind the script-editor card, added return navigation, and renamed the main menu entry to Editor Workbench.`
  - Verification: `Targeted Node test, plan lint, build:test, and build passed. Typecheck still fails in unrelated existing city-begging dialogue view. Browser smoke at localhost:5173 verified the main menu label, 14 hub cards, project page entry, and return to hub.`
  - Next: `Review or commit local changes if desired.`

---

## Based On Spec

- Primary spec:
  - `User-approved inline design in current Codex task`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - `Working tree has unrelated existing modifications including src/main.ts and city-begging files; this plan must not touch them.`
  - `Current script editor entry uses open-script-editor -> showScriptEditorLanding -> renderScriptEditorLanding.`

## Implementation Scope

### In Scope

- Replace the script editor landing contents with a development hub.
- Include 14 tool/editor entries as one organized page.
- Keep the existing script editor project management flow behind a script-editor card/action.
- Add source contract tests for the new hub.

### Still Out Of Scope

- Reworking `src/main.ts`.
- Making app-internal tools that lack safe standalone context force-open runtime state.
- Refactoring the large script editor module.
- Closing or changing unrelated dirty worktree changes.

## File Map

### Existing files to modify

- `tests/script-editor-entry-availability.test.cjs`
  - Add source contract coverage for the new hub entries and actions.
- `src/ui/entry-shell/entry-shell-view.js`
  - Rename the main menu script editor entry to the editor hub label.
- `src/modules/script-editor/ui/main-ui-script-editor-module.js`
  - Render the dev hub landing and handle the card actions.
- `src/styles/script-editor.css`
  - Add hub layout styles.
- `docs/superpowers/plans/2026-07-31-script-editor-dev-hub-entry-plan.md`
  - Track execution state and verification.

### Existing files expected to be deleted

- None.

### New files to create

- None beyond this plan.

## Verification Plan

- Targeted verification:
  - `node --test tests/script-editor-entry-availability.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run build:test`
  - `node --test tests/script-editor-entry-availability.test.cjs`
  - `npm run typecheck`

## Task 1: Script Editor Development Hub Entry

**Files:**
- Modify: `tests/script-editor-entry-availability.test.cjs`
- Modify: `src/ui/entry-shell/entry-shell-view.js`
- Modify: `src/modules/script-editor/ui/main-ui-script-editor-module.js`
- Modify: `src/styles/script-editor.css`
- Modify: `docs/superpowers/plans/2026-07-31-script-editor-dev-hub-entry-plan.md`
- Read: `src/ui/entry-shell/entry-shell-view.js`

- [x] **Step 1: Write the failing source contract test**

Add assertions that the script editor module contains a development hub renderer, the 14 expected entry titles, a dedicated `open-script-editor-projects` action, and external tool paths for standalone tools.

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/script-editor-entry-availability.test.cjs
```

Expected:

- `FAIL` because `renderScriptEditorDevelopmentHub` and the new action are not implemented yet.

- [x] **Step 3: Implement minimal hub rendering and actions**

Update `renderScriptEditorLanding()` to render the hub, add `renderScriptEditorDevelopmentHub()`, `renderScriptEditorProjectLanding()`, tool entry helpers, and action handling for `open-script-editor-projects`, `back-to-dev-hub`, and external link opening.

- [x] **Step 4: Add hub styles**

Add CSS under the existing script editor landing section for the hub header, grouped entry grid, tool cards, and project landing body.

- [x] **Step 5: Run targeted verification**

Run:

```bash
node --test tests/script-editor-entry-availability.test.cjs
```

Expected:

- `PASS`

- [x] **Step 6: Run broader checks**

Run:

```bash
npm run lint:plans
npm run build:test
npm run typecheck
```

Result:

- `npm run lint:plans` PASS
- `npm run build:test` PASS
- `npm run build` PASS
- `npm run typecheck` FAILS on unrelated existing `src/ui/views/minigames/city-begging-default-dialogue-view.ts(49,57)` readonly `string[]` mismatch.

- [x] **Step 7: Sync progress and governance state**

Update this plan's checkboxes, `Execution State`, and `Progress Log` with verification results.

## Exit Check

- [x] The landing page is a development hub, not the direct script editor project list.
- [x] The hub lists 14 editor/tool entries.
- [x] The existing script editor project management flow is still reachable from the script editor card.
- [x] `src/main.ts` remains untouched by this work.
- [x] Project progress sync is not required because this is a user-requested local task outside the current governed child queue.
- [x] Closeout block is not added because remote push/closeout is outside this task.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `none`
- Parent Task: `none`
- Parent Stage: `none`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review local implementation if desired`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `none`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Review the current task diff and run the recorded verification commands.`
