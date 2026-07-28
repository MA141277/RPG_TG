# Person Attribute Group Tab Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the script-editor person `attribute-group` tab into a card-based grouped-attribute surface with paging, while keeping custom attributes editable and hiding runtime `key`/`id` from authors.

**Architecture:** Keep the current person authoring data contract based on `attributeGroup`, `attributeMappings`, and `attributeValues`. Limit this slice to authoring UI state, rendering, and styling in the person module, plus robustness coverage that locks the new group-card layout and prevents the custom-attribute editor from regressing back to visible runtime keys.

**Tech Stack:** Main UI authoring surface in `src/ui/main-ui/main-ui-flow.js`, styles in `src/styles/script-editor.css`, regression coverage in `tests/robustness.test.cjs`, verification with `npm.cmd run build:test`, targeted `node --test`, and `npm.cmd run lint:plans`.

## Global Constraints

- This slice is authoring-only; runtime person protocol stays unchanged.
- Custom attributes must stay available under the person profile tab.
- Author-facing UI must not expose runtime numeric-string `key` or legacy `id`.
- Attribute-group members come from the current person instance attributes, including custom attributes.
- Attribute-group list shows at most `3` groups per page.
- Each group shows at most `10` member cards per page in a `5 x 2` fixed-height grid.
- Group member cards show only the visible attribute name and a remove button.
- The group picker is lightweight inline UI, not a new modal system.

---

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-28`
- Current Focus: `Implementation and targeted verification are complete; the child remains open only for further user-directed refinements or closeout handling.`
- Next Step: `Resume from the latest verification entry if more UI refinements are requested; otherwise perform closeout or commit/push handling in a later batch.`
- Verification: `node --test tests/robustness.test.cjs --test-name-pattern "script editor person authoring queue keeps custom attributes|script editor person authoring queue exposes attribute-group tab" now passes for this slice; npm.cmd run build:test and npm.cmd run lint:plans also pass. The broader robustness suite still reports the pre-existing unrelated layout-editor transition failure.`
- Notes: `This legacy superpowers child exists because the operator explicitly resumed the person authoring slice under docs/superpowers after approving the 2026-07-28 layout spec.`

## Progress Log

- 2026-07-28
  - Summary: `Created the focused implementation plan for the person attribute-group tab layout slice and admitted it as the active legacy child.`
  - Verification: `Plan only; implementation verification not run yet.`
  - Next: `Add failing robustness tests covering the card layout, pagination hooks, picker trigger, and hidden runtime key behavior.`
- 2026-07-28
  - Summary: `Wrote the failing robustness assertions that ban the old checkbox group-membership hook and the stale legacy-key/runtime-id exposure path.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "script editor person authoring queue keeps custom attributes|script editor person authoring queue exposes attribute-group tab" (fails on old group checkbox hook; unrelated known layout-editor failure also remains in the suite output)`
  - Next: `Replace the old checkbox membership renderer and stale legacy summary residue with the approved group-card surface and matching paging hooks.`
- 2026-07-28
  - Summary: `Replaced the active person attribute-group authoring surface with paged group cards, paged member cards, and an inline attribute picker; custom attributes remain editable without visible runtime key/id fields.`
  - Verification: `node --test tests/robustness.test.cjs --test-name-pattern "script editor person authoring queue keeps custom attributes|script editor person authoring queue exposes attribute-group tab"; npm.cmd run build:test; npm.cmd run lint:plans`
  - Next: `Wait for user review or continue with follow-up polish on the person authoring UI.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-28-person-attribute-group-tab-layout-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `updated`
- Notes:
  - `The person authoring contract has already been cut over to attributeGroup + attributeMappings + attributeValues.`
  - `The active bug is now UI-level: the attribute-group tab still renders checkbox membership instead of the approved card-based editor, and a stale code path risks re-exposing runtime key/id controls.`

## Implementation Scope

### In Scope

- Add robustness coverage for the approved attribute-group tab layout.
- Replace the checkbox-based group member editor with card-based rendering and inline add/remove flows.
- Add authoring-only UI state for group-list paging, per-group member paging, and open picker targeting.
- Restore custom attributes as the data source for group membership selection without exposing runtime keys.
- Add or update styles for the fixed-height group list and member grid.

### Still Out Of Scope

- Runtime character detail or entry-shell rendering changes.
- Authoring schema changes beyond the already-landed `attributeGroup` / `attributeMappings` / `attributeValues` contract.
- Drag-sorting, cross-person attribute reuse, or runtime protocol changes.

## File Map

### Existing files to modify

- `docs/superpowers/project-progress.md`
  - Sync the explicit legacy child admission for this slice.
- `src/ui/main-ui/main-ui-flow.js`
  - Add authoring UI state, group-card rendering, inline picker flow, and interaction handlers.
- `src/styles/script-editor.css`
  - Style the paged group list, member cards, fixed-height grid, and picker surface.
- `tests/robustness.test.cjs`
  - Lock the layout contract and prevent runtime key/id regressions.

### Existing files expected to be deleted

- `none`

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `node --test tests/robustness.test.cjs --test-name-pattern "script editor person authoring queue keeps custom attributes|script editor person authoring queue exposes attribute-group tab"`
- Required commands:
  - `npm.cmd run build:test`
  - `node --test tests/robustness.test.cjs --test-name-pattern "script editor person authoring queue keeps custom attributes|script editor person authoring queue exposes attribute-group tab"`
  - `npm.cmd run lint:plans`

## Task 1: Lock The Authoring Layout Contract

**Files:**
- Modify: `tests/robustness.test.cjs`
- Read: `docs/superpowers/specs/2026-07-28-person-attribute-group-tab-layout-design.md`
- Read: `src/ui/main-ui/main-ui-flow.js`

- [x] **Step 1: Add failing layout assertions**

Extend the existing person-authoring robustness coverage so it requires:

- the active custom-attribute editor to expose `key-name`, `type`, and `value`, but not visible runtime `key` or legacy `id`
- the attribute-group tab to render card/paging/picker hooks instead of checkbox membership
- dedicated markup hooks for group-page actions and per-group member-page actions

- [x] **Step 2: Run the targeted tests and confirm the failure is the new layout contract**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "script editor person authoring queue keeps custom attributes|script editor person authoring queue exposes attribute-group tab"
```

Expected:

- `FAIL`
- old checkbox membership markup or missing paging/picker hooks causes the failure

- [x] **Step 3: Update child-local governance**

Record the failing-test checkpoint in this plan file before moving to implementation.

## Task 2: Implement The Group Card Surface

**Files:**
- Modify: `src/ui/main-ui/main-ui-flow.js`
- Modify: `src/styles/script-editor.css`
- Modify: `tests/robustness.test.cjs`

- [x] **Step 1: Implement minimal UI state and rendering**

Add the authoring-only state and rendering needed for:

- group-list paging (`3` groups per page)
- per-group member paging (`10` cards per page)
- inline picker open/close targeting
- card-based group member rendering with remove actions

- [x] **Step 2: Implement the matching styles**

Add the CSS needed for:

- fixed-height group list viewport
- fixed-height `5 x 2` member card grid
- compact member cards that show only the attribute name and remove button
- inline picker layout that reuses the existing editor visual language

- [x] **Step 3: Run targeted verification**

Run:

```bash
node --test tests/robustness.test.cjs --test-name-pattern "script editor person authoring queue keeps custom attributes|script editor person authoring queue exposes attribute-group tab"
```

Expected:

- `PASS`

- [x] **Step 4: Run broader verification**

Run:

```bash
npm.cmd run build:test
npm.cmd run lint:plans
```

Expected:

- `PASS`

## Exit Check

- [x] The active custom-attribute editor keeps custom attributes visible to authors without exposing runtime `key` or legacy `id`.
- [x] The attribute-group tab renders group cards instead of checkbox membership toggles.
- [x] Group-list paging exists for more than `3` groups.
- [x] Per-group member paging exists for more than `10` attributes.
- [x] Group member cards show only the visible attribute name and remove action.
- [x] Verification results are recorded in this plan and reported from fresh command output.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Person attribute-group tab layout`
- Parent Task: `Script editor person runtime-keyed attribute continuation`
- Parent Stage: `Historical Governance Migration`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `Wait for user review or perform formal closeout/commit handling in a later batch.`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-28-person-attribute-group-tab-layout-implementation.md`
- Push Status: `none`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then resume this child plan and continue from the first unchecked step.`
