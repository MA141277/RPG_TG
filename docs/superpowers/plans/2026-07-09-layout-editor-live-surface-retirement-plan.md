# Layout Editor Live Surface Retirement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the live layout-editor surface from the covered production path while preserving the current `uiLayouts` and preset-backed non-editor layout baseline.

**Architecture:** Remove the editor surface in three bounded owner lines: render mounting in `src/ui/app-render.ts`, event wiring in `src/main.ts`, and editor-only live binding protocol in `src/ui/views/character/character-detail-view.ts`. Keep `uiLayouts`, `layoutEditor` state, and `layout-editor-presets` untouched so the queue can later reclassify that broader residue through `layout-baseline-residue-review`.

**Tech Stack:** TypeScript application runtime code, Node test runner through `tests/robustness.test.cjs`, Blueprint governance docs, `npm run typecheck`, `npm test`, `npm run lint:blueprints`, and `npm run lint:plans`.

## Execution State

- Status: `running`
- Last Updated: `2026-07-09`
- Current Focus: `Task 1 failing-test design for live layout-editor surface retirement.`
- Next Step: `Add source-guard regression coverage for app-render, main.ts, and character-detail-view.`
- Verification: `Blueprint queue admission and baseline-reconcile already pass npm run lint:blueprints and node --test tests/blueprint-governance-lint.test.cjs. Implementation verification has not started yet.`
- Notes: `This plan executes task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement only. Do not widen into uiLayouts baseline or preset deletion.`

## Progress Log

- 2026-07-09
  - Summary: `Plan created after the live-editor-surface-retirement design was approved and the active Blueprint queue froze this first implementation slice.`
  - Verification: `Not run`
  - Next: `Write the failing regression test before production code changes.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-09-layout-editor-live-surface-retirement-design.md`
- Active queue:
  - `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `queue.layout-editor-retirement-and-reference-removal is the single active queue.`
  - `task.layout-editor-retirement-and-reference-removal.live-editor-surface-retirement is the current active task.`
  - `src/ui/app-render.ts still mounts renderLayoutEditor, src/main.ts still wires layoutEditorCoordinator into the covered live event path, and src/ui/views/character/character-detail-view.ts still emits editor-only live binding attributes and resize handles.`

## Implementation Scope

### In Scope

- Remove `renderLayoutEditor(...)` from the covered production render path.
- Remove covered `layoutEditorCoordinator` instantiation and live event handling from `src/main.ts`.
- Remove editor-only live binding attributes and resize handles from `src/ui/views/character/character-detail-view.ts`.
- Add regression coverage proving the covered production path no longer exposes the editor surface.

### Still Out Of Scope

- Removing `AppState.uiLayouts`
- Removing `AppState.layoutEditor`
- Deleting `src/content/layout-editor-presets.ts`
- Reserve-family or `ui-contract-registry` activation
- Queue closeout or residue review decisions

## File Map

### Existing files to modify

- `tests/robustness.test.cjs`
  - Add source-guard regression coverage for the retired live editor surface.
- `src/ui/app-render.ts`
  - Stop mounting `renderLayoutEditor(...)`.
- `src/main.ts`
  - Remove `layoutEditorCoordinator` creation and the covered editor-only event branches.
- `src/ui/views/character/character-detail-view.ts`
  - Remove editor-only live binding protocol and resize handles.

### New files to create

- `docs/superpowers/plans/2026-07-09-layout-editor-live-surface-retirement-plan.md`
  - Execution controller for this implementation slice.

## Verification Plan

- Targeted verification:
  - `node --test --test-name-pattern "layout editor live surface retirement" tests/robustness.test.cjs`
- Required commands:
  - `npm run typecheck`
  - `npm test`
  - `npm run lint:blueprints`
  - `npm run lint:plans`

## Task 1: Retire The Live Layout-Editor Surface

**Files:**
- Modify: `tests/robustness.test.cjs`
- Modify: `src/ui/app-render.ts`
- Modify: `src/main.ts`
- Modify: `src/ui/views/character/character-detail-view.ts`
- Read: `src/ui/tools/layout-editor-view.ts`

- [ ] **Step 1: Write the failing test**

Add a new source-guard section in `tests/robustness.test.cjs` proving the covered production path no longer exposes the layout editor surface. The test names should be:

```js
test("layout editor live surface retirement removes editor mount from app-render", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/app-render.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /renderLayoutEditor/);
  assert.match(source, /uiLayouts\\["global-hud"\\]/);
});

test("layout editor live surface retirement removes editor coordinator wiring from main.ts", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/main.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /createLayoutEditorCoordinator/);
  assert.doesNotMatch(source, /layoutEditorCoordinator/);
});

test("layout editor live surface retirement removes character detail editor protocol", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "src/ui/views/character/character-detail-view.ts"),
    "utf8"
  );

  assert.doesNotMatch(source, /data-layout-component-handle|data-layout-element-handle/);
  assert.doesNotMatch(source, /c-main-ui-layout-resize-handle|c-main-ui-layout-element-resize-handle/);
  assert.match(source, /layout\\?: CharacterDetailScreenLayout/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test --test-name-pattern "layout editor live surface retirement" tests/robustness.test.cjs
```

Expected:

- `FAIL`
- The new tests fail because `app-render.ts`, `main.ts`, and `character-detail-view.ts` still expose the covered editor surface.

- [ ] **Step 3: Write minimal implementation**

Apply the smallest possible production changes:

```ts
// src/ui/app-render.ts
// remove:
import { renderLayoutEditor } from "./tools/layout-editor-view";

// remove:
${renderLayoutEditor(input.appState)}
```

```ts
// src/main.ts
// remove:
import { createLayoutEditorCoordinator } from "./application/layout-editor/layout-editor-coordinator";

// remove the whole layoutEditorCoordinator instantiation block
// remove the covered layoutEditorCoordinator.handleInput / handlePointerDown /
// handlePointerMove / handlePointerUp / handleMouseDown / handleClick branches
// keep all non-editor input branches untouched
```

```ts
// src/ui/views/character/character-detail-view.ts
// remove the editor-only helpers and live protocol:
// - isLayoutEditorEnabled
// - renderComponentResizeHandle
// - renderElementResizeHandle
// - data-layout-component-* / data-layout-element-* attributes
// - editor-selected class toggles
// keep layout-based positioning and background rendering intact
```

- [ ] **Step 4: Run targeted test to verify it passes**

Run:

```bash
node --test --test-name-pattern "layout editor live surface retirement" tests/robustness.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run typecheck
npm test
npm run lint:blueprints
npm run lint:plans
```

Expected:

- `PASS`

- [ ] **Step 6: Sync progress and queue state**

Update this plan's `Execution State`, append a `Progress Log` entry, and update `docs/blueprints/queues/layout-editor-retirement-and-reference-removal-queue.md` only if this task reaches a terminal after-state.

## Exit Check

- [ ] The covered production render path no longer mounts the layout editor.
- [ ] The live app shell no longer routes the covered path through `layoutEditorCoordinator`.
- [ ] Covered live views no longer expose editor-only binding protocol.
- [ ] Non-editor `uiLayouts` baseline consumption remains intact.
- [ ] Queue-local truth is synchronized if the task reaches a terminal after-state.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded
