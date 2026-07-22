# Unified Backpack Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production batch of a unified backpack item system that replaces the visible valuables workflow while keeping legacy content compatible.

**Architecture:** Add a first-class item/inventory contract and keep old valuables plus grain as compatibility sources. The backpack UI reads the unified projection, while item actions are dispatched through code-owned handlers instead of arbitrary item scripts.

**Tech Stack:** TypeScript, Vite, Node test runner, existing CSS library/nine-slice skins, `npm run typecheck`, `npm run build`, `npm run lint:plans`.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-21`
- Current Focus: `Implementation complete with icon/layout regression fixes and campaign map bottom backpack entry; closeout remains open until repository sync/push policy is satisfied.`
- Next Step: `Review diff, commit if requested, and push before marking the child closed.`
- Verification: `npm run lint:plans`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }`; `npm run typecheck`; `npm run build`; `npm test`
- Notes: `This plan starts a new user-requested child and does not close the earlier governance migration batch.`

## Progress Log

- 2026-07-21
  - Summary: `Created the unified backpack inventory spec and executable plan from the user request.`
  - Verification: `Not run`
  - Next: `Run npm run lint:plans, then start Task 1 with failing tests.`
- 2026-07-21
  - Summary: `Implemented the compatibility-first unified backpack: legacy valuables and shared grain project into one item list, backpack filters/detail/action UI replaced the visible valuables surface, and shell wiring added character-detail plus bottom-HUD backpack entry points.`
  - Verification: `npm run lint:plans`; `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }`; `npm run typecheck`; `npm run build`; `npm test`
  - Next: `Review diff and perform repository sync before closing this child.`
- 2026-07-21
  - Summary: `Fixed the backpack icon column to hide non-image ids and stabilized the overlay grid rows so food/other filters do not move the whole UI when the visible list height changes.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs }`; `npm run typecheck`; `npm run build`; `npm run lint:plans`
  - Next: `Review diff and perform repository sync before closing this child.`
- 2026-07-21
  - Summary: `Added a map-owned bottom action bar with a backpack button to the campaign main map, matching the user-requested lower-screen entry instead of relying only on the outer HUD.`
  - Verification: `npm run build:test; if ($LASTEXITCODE -eq 0) { node --test tests/backpack-ui-contract.test.cjs }`; `npm run typecheck`; `npm run build`
  - Next: `Review diff and perform repository sync before closing this child.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-21-unified-backpack-inventory-spec.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `changed`
- Notes:
  - Existing valuables live in `src/domain/valuable-item.ts`, `src/application/inventory/inventory-selection.ts`, `src/ui/views/valuables/valuable-library-view.ts`, `src/application/app-actions.ts`, `src/ui/app-render.ts`, and `src/main.ts`.
  - Existing shared grain is backed by `var.player_inventory.grain_dou` in `src/application/inventory/trade-inventory.ts`.
  - Current UI already has a reusable library overlay and city choice nine-slice list skins.
  - This child keeps compatibility fields first instead of removing all `valuable` naming in one batch.

## Implementation Scope

### In Scope

- Add item domain types and inventory projection helpers.
- Add inventory selectors and safe action handlers for equipment.
- Render a backpack overlay using unified item rows.
- Replace user-facing valuables entry points with backpack entry points.
- Add a main screen bottom backpack button.
- Add tests for projection, filtering, selection, equip action, and UI contract.

### Still Out Of Scope

- Full content-pack file rename from `valuables.json` to `items.json`.
- Full task DSL migration.
- Full save migration from runtime grain variables into first-class stack storage.
- Consumable effect balancing for medicine and food.

## File Map

### Existing files to modify

- `src/domain/global-ui.ts`
  - Add backpack overlay/filter/sort naming while preserving compatibility.
- `src/domain/game-state.ts`
  - Add unified inventory state if needed by the selected compatibility approach.
- `src/application/state/create-initial-state.ts`
  - Seed the new inventory state or compatibility projection source.
- `src/application/inventory/inventory-selection.ts`
  - Preserve card selectors and delegate item selectors to the new inventory module.
- `src/application/inventory/trade-inventory.ts`
  - Keep grain compatibility and expose projection constants.
- `src/application/app-actions.ts`
  - Add backpack open/filter/select/action functions.
- `src/ui/app-render.ts`
  - Render the backpack overlay and resolve equipped item names through unified inventory helpers.
- `src/ui/views/character/character-detail-view.ts`
  - Keep the character detail entry, relabel it as backpack, and point it at backpack action ids.
- `src/main.ts`
  - Wire generic backpack event handlers and add the main bottom entry.
- `src/styles/prototype.css`
  - Reuse existing list skin or add backpack-specific composition classes.
- `docs/architecture.md`
  - Update the overlay/player runtime inventory description if shared state names change.
- `docs/change-log.md`
  - Record the unified backpack batch.

### Existing files expected to be deleted

- None in this first compatibility batch.

### New files to create

- `src/domain/item.ts`
  - Own unified item, filter, action, and inventory state types.
- `src/application/inventory/item-inventory.ts`
  - Own item projection, filtering, selection, sorting, and action dispatch helpers.
- `src/ui/views/inventory/backpack-view.ts`
  - Render the backpack table/detail overlay.
- `tests/unified-backpack-inventory.test.cjs`
  - Lock projection, filters, detail selection, and action behavior.
- `tests/backpack-ui-contract.test.cjs`
  - Lock visible UI labels, table columns, and action data attributes.

## Verification Plan

- Targeted verification:
  - `npm run build:test && node --test tests/unified-backpack-inventory.test.cjs tests/backpack-ui-contract.test.cjs`
- Required commands:
  - `npm run lint:plans`
  - `npm run typecheck`
  - `npm run build`

## Task 1: Item Contract And Compatibility Projection

**Files:**
- Create: `src/domain/item.ts`
- Create: `src/application/inventory/item-inventory.ts`
- Create: `tests/unified-backpack-inventory.test.cjs`
- Modify: `src/application/inventory/trade-inventory.ts`
- Modify: `src/application/inventory/inventory-selection.ts`

- [x] **Step 1: Write failing projection tests**

Add tests that require legacy valuables and `var.player_inventory.grain_dou` to appear as unified item rows with filters for `all`, `equipment`, `food`, and `other`.

- [x] **Step 2: Run the targeted tests and confirm they fail**

Run:

```bash
npm run build:test && node --test tests/unified-backpack-inventory.test.cjs
```

Expected:

- `FAIL` because the unified item module does not exist yet.

- [x] **Step 3: Implement the item types and projection helpers**

Create the item contract and selectors with explicit action ids for equipment and safe grain projection.

- [x] **Step 4: Run the targeted tests and confirm they pass**

Run:

```bash
npm run build:test && node --test tests/unified-backpack-inventory.test.cjs
```

Expected:

- `PASS`

## Task 2: Backpack Application Actions

**Files:**
- Modify: `src/domain/global-ui.ts`
- Modify: `src/domain/game-state.ts`
- Modify: `src/application/state/create-initial-state.ts`
- Modify: `src/application/app-actions.ts`
- Modify: `tests/unified-backpack-inventory.test.cjs`

- [x] **Step 1: Write failing selection and action tests**

Add tests for selecting an item, changing filters, and equipping weapon/armor through a declared item action.

- [x] **Step 2: Run the targeted tests and confirm they fail**

Run:

```bash
npm run build:test && node --test tests/unified-backpack-inventory.test.cjs
```

Expected:

- `FAIL` because backpack action functions are not implemented.

- [x] **Step 3: Implement backpack state transitions**

Add application actions for opening the backpack, selecting/filtering items, and dispatching item actions through code-owned handlers.

- [x] **Step 4: Run the targeted tests and confirm they pass**

Run:

```bash
npm run build:test && node --test tests/unified-backpack-inventory.test.cjs
```

Expected:

- `PASS`

## Task 3: Backpack Overlay UI

**Files:**
- Create: `src/ui/views/inventory/backpack-view.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `src/ui/views/character/character-detail-view.ts`
- Modify: `src/styles/prototype.css`
- Create: `tests/backpack-ui-contract.test.cjs`

- [x] **Step 1: Write failing UI contract tests**

Add tests requiring the backpack labels, filters, table columns, click-to-detail data attributes, and action buttons.

- [x] **Step 2: Run the targeted UI tests and confirm they fail**

Run:

```bash
npm run build:test && node --test tests/backpack-ui-contract.test.cjs
```

Expected:

- `FAIL` because the backpack view does not exist yet.

- [x] **Step 3: Implement the backpack view**

Render the list with columns `icon`, `名字`, `价值`, `类型`, `持有数`; keep a detail panel and item action buttons.

- [x] **Step 4: Reuse existing list skin styling**

Apply existing library overlay classes and city-choice/nine-slice-inspired row styling without introducing a separate visual system.

- [x] **Step 5: Run the targeted UI tests and confirm they pass**

Run:

```bash
npm run build:test && node --test tests/backpack-ui-contract.test.cjs
```

Expected:

- `PASS`

## Task 4: Main Shell Wiring

**Files:**
- Modify: `src/main.ts`
- Modify: `src/ui/app-render.ts`
- Modify: `tests/backpack-ui-contract.test.cjs`

- [x] **Step 1: Write failing shell wiring tests**

Add tests requiring `data-action="open-backpack"` wiring and `data-item-action-id` dispatch handling.

- [x] **Step 2: Run the targeted tests and confirm they fail**

Run:

```bash
npm run build:test && node --test tests/backpack-ui-contract.test.cjs
```

Expected:

- `FAIL` because shell event wiring is not complete.

- [x] **Step 3: Implement shell wiring**

Add character-detail and bottom-HUD backpack open handling, item row selection, filter handling, and item action dispatch.

- [x] **Step 4: Run the targeted tests and confirm they pass**

Run:

```bash
npm run build:test && node --test tests/backpack-ui-contract.test.cjs
```

Expected:

- `PASS`

## Task 5: Documentation And Full Verification

**Files:**
- Modify: `docs/architecture.md`
- Modify: `docs/change-log.md`
- Modify: `docs/superpowers/plans/2026-07-21-unified-backpack-inventory-plan.md`
- Modify: `docs/superpowers/project-progress.md`

- [x] **Step 1: Update architecture and change log**

Record the compatibility-first unified backpack contract and the remaining legacy cleanup boundary.

- [x] **Step 2: Run full verification**

Run:

```bash
npm run lint:plans
npm run typecheck
npm run build
```

Expected:

- `PASS`, or record exact unrelated blockers in this plan.

- [x] **Step 3: Sync progress and governance state**

Update this plan's `Execution State`, `Progress Log`, and `Completion Checklist` with final verification results.

## Exit Check

- [x] The backpack overlay can show legacy valuables and projected grain in one list.
- [x] `全部`, `装备`, `食物`, and `其他` filters work.
- [x] Clicking an item row updates the detail panel.
- [x] Weapon and armor items can be equipped from the backpack.
- [x] Food/grain items expose a safe action surface.
- [x] Character detail opens the backpack instead of the old valuables surface.
- [x] Main screen has a bottom backpack entry.
- [x] Project progress sync is updated if the child state changed.
- [x] Closeout block is added before the child is marked `closed`.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Unified Backpack Inventory`
- Parent Task: `User-requested backpack replacement`
- Parent Stage: `Inventory System Implementation`
- Closeout Status: `completed-but-open`
- Project Progress Synced: `yes`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-and-sync-repository`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-21-unified-backpack-inventory-plan.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue this plan from the first unchecked task.`
