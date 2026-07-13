# Spine Unit Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a top-level unit selector to the Spine editor so switching between swordsman and archer automatically loads the matching project JSON and shows only that unit's dedicated editing tools while leaving shared tools untouched.

**Architecture:** Keep the existing single-page editor in `tools/spine-node-timeline-editor.html`, but introduce one explicit runtime unit-context layer. That layer owns the unit registry, the current unit type, project auto-load rules, and dedicated feature-group visibility. Existing arrow / slash-FX object-level enablement stays in place under this new context gate instead of being rewritten.

**Tech Stack:** Static HTML, inline vanilla JavaScript, Node `node:test` regression files under `tests/`, PowerShell command execution, and `npm run lint:plans` for governance validation.

## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-13`
- Current Focus: `Implementation and focused verification are complete; awaiting user review and any final iteration requests.`
- Next Step: `Review the updated Spine editor UI in a local browser session and decide whether to iterate further or close out the child.`
- Verification: `tools/lint-superpowers-plans.mjs PASS; tests/spine-unit-context.test.cjs PASS (7/7); tests/slash-fx-fade-window.test.cjs PASS (8/8)`
- Notes: `This plan follows docs/superpowers/specs/2026-07-13-spine-unit-context-design.md and is intentionally scoped to the editor only.`

## Progress Log

- 2026-07-13
  - Summary: `Plan created from the approved Spine unit-context design spec.`
  - Verification: `npm run lint:plans`
  - Next: `Select an execution approach, then implement the failing tests before touching the editor runtime.`

- 2026-07-13
  - Summary: `Completed the unit registry, selector wiring, and unit-specific feature-group gating in the Spine editor through Task 3, then ran the targeted regression checks for Task 4.`
  - Verification: `tools/lint-superpowers-plans.mjs PASS; tests/spine-unit-context.test.cjs PASS (7/7); tests/slash-fx-fade-window.test.cjs PASS (8/8)`
  - Next: `Have the user review the local editor behavior and decide whether to iterate or prepare branch-level closeout.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-13-spine-unit-context-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `The editor still mixes swordsman and archer-only controls in one surface.`
  - `The current quick-load path still centers on ad hoc sample loaders rather than an explicit unit registry.`
  - `No existing unit-context helper or dedicated regression test exists yet.`

## Implementation Scope

### In Scope

- Add a top-level swordsman / archer selector to the Spine editor.
- Add a single source of truth registry for unit labels, project URLs, and dedicated feature groups.
- Auto-load the matching project JSON when the selected unit changes.
- Gate swordsman-only and archer-only control groups by current unit type.
- Keep shared controls visible in all unit contexts.
- Add regression tests for registry presence, load behavior, and feature-group gating.

### Still Out Of Scope

- New battle runtime behavior.
- New JSON schema fields.
- New unit types beyond `swordsman` and `archer`.
- Large editor layout redesign outside the new selector and feature-group wrappers.

## File Map

### Existing files to modify

- `tools/spine-node-timeline-editor.html`
  - Add unit selector markup, unit-specific wrappers, runtime registry/state/helpers, and context-driven render behavior.

### New files to create

- `tests/spine-unit-context.test.cjs`
  - Regression tests for the new editor unit-context behavior and source structure.

## Verification Plan

- Targeted verification:
  - `tests/spine-unit-context.test.cjs`
  - Existing editor-adjacent regressions remain green after the unit-context patch.
- Required commands:
  - `npm run lint:plans`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\slash-fx-fade-window.test.cjs`

## Task 1: Lock The Unit Registry Contract With A Failing Test

**Files:**
- Create: `tests/spine-unit-context.test.cjs`
- Read: `tools/spine-node-timeline-editor.html`

**Interfaces:**
- Consumes:
  - `const SPINE_UNIT_CONFIGS = { ... }`
  - `function getSpineUnitConfig(unitType)`
  - `async function switchSpineUnitContext(unitType)`
- Produces:
  - Regression coverage that later tasks must satisfy for registry shape, project URLs, and switch-order guarantees.

- [x] **Step 1: Write the failing test**

Create `tests/spine-unit-context.test.cjs` with source-level assertions that describe the required behavior before implementation exists:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");

test("Spine editor defines a unit registry for swordsman and archer", () => {
  assert.match(source, /const SPINE_UNIT_CONFIGS = \\{/);
  assert.match(source, /swordsman:\\s*\\{[\\s\\S]*projectUrl:\\s*"\\/src\\/faxian\\/leg\\/swordsman\\/project\\.json"/);
  assert.match(source, /archer:\\s*\\{[\\s\\S]*projectUrl:\\s*"\\/src\\/faxian\\/leg\\/archer\\/project\\.json"/);
});

test("Spine editor switches unit context only after a project load succeeds", () => {
  assert.match(source, /async function switchSpineUnitContext\\(unitType\\)/);
  assert.match(source, /const project = await loadProjectJsonFile\\(config\\.projectUrl\\)/);
  assert.match(source, /if \\(!project\\) \\{[\\s\\S]*return false;[\\s\\S]*\\}/);
  assert.match(source, /state\\.currentUnitType = unitType;/);
});

test("Spine editor gates swordsman and archer feature groups by unit context", () => {
  assert.match(source, /id="swordsmanFeatureGroup"/);
  assert.match(source, /id="archerFeatureGroup"/);
  assert.match(source, /function renderSpineUnitFeatureGroups\\(\\)/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `FAIL`
- Missing `SPINE_UNIT_CONFIGS`, `switchSpineUnitContext`, and feature-group markers in `tools/spine-node-timeline-editor.html`

- [x] **Step 3: Write minimal implementation**

Add the smallest editor skeleton needed for the test to pass:

```js
const SPINE_UNIT_CONFIGS = {
  swordsman: {
    label: "剑士",
    projectUrl: "/src/faxian/leg/swordsman/project.json",
    featureGroups: ["swordsman"],
  },
  archer: {
    label: "弓兵",
    projectUrl: "/src/faxian/leg/archer/project.json",
    featureGroups: ["archer"],
  },
};

function getSpineUnitConfig(unitType) {
  return SPINE_UNIT_CONFIGS[unitType] || SPINE_UNIT_CONFIGS.swordsman;
}

async function switchSpineUnitContext(unitType) {
  const config = getSpineUnitConfig(unitType);
  const project = await loadProjectJsonFile(config.projectUrl);
  if (!project) {
    toast(`Failed to load ${config.label} project.`);
    return false;
  }
  applyProjectData(project);
  state.currentUnitType = unitType;
  renderSpineUnitFeatureGroups();
  renderAll();
  return true;
}
```

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `PASS`

- [x] **Step 5: Commit**

```bash
git add tests/spine-unit-context.test.cjs tools/spine-node-timeline-editor.html
git commit -m "feat: add spine unit context registry"
```

## Task 2: Add The Top-Level Unit Selector And Context-Aware Auto-Loading

**Files:**
- Modify: `tools/spine-node-timeline-editor.html`
- Read: `docs/superpowers/specs/2026-07-13-spine-unit-context-design.md`

**Interfaces:**
- Consumes:
  - `SPINE_UNIT_CONFIGS`
  - `getSpineUnitConfig(unitType)`
  - `switchSpineUnitContext(unitType): Promise<boolean>`
- Produces:
  - Unit selector UI and current-unit state transitions for later rendering logic.

- [x] **Step 1: Write the failing test**

Extend `tests/spine-unit-context.test.cjs` so it also requires the top selector buttons and current-unit state:

```js
test("Spine editor exposes top-level swordsman and archer unit buttons", () => {
  assert.match(source, /id="unitContextToolbar"/);
  assert.match(source, /id="unitSwordsmanBtn"/);
  assert.match(source, /id="unitArcherBtn"/);
  assert.match(source, /currentUnitType:\\s*"swordsman"/);
});

test("Spine editor binds the unit buttons to switchSpineUnitContext", () => {
  assert.match(source, /el\\.unitSwordsmanBtn\\.addEventListener\\("click", \\(\\) => switchSpineUnitContext\\("swordsman"\\)\\)/);
  assert.match(source, /el\\.unitArcherBtn\\.addEventListener\\("click", \\(\\) => switchSpineUnitContext\\("archer"\\)\\)/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `FAIL`
- Missing selector toolbar/buttons or click binding assertions

- [x] **Step 3: Write minimal implementation**

Add the selector markup and state wiring:

```html
<div id="unitContextToolbar" class="toolbar unit-toolbar">
  <button id="unitSwordsmanBtn" class="mode-button active" type="button">剑士</button>
  <button id="unitArcherBtn" class="mode-button" type="button">弓兵</button>
</div>
```

```js
const el = {
  unitSwordsmanBtn: document.getElementById("unitSwordsmanBtn"),
  unitArcherBtn: document.getElementById("unitArcherBtn"),
  // existing fields...
};

const state = {
  currentUnitType: "swordsman",
  // existing fields...
};

function renderSpineUnitContextControls() {
  el.unitSwordsmanBtn?.classList.toggle("active", state.currentUnitType === "swordsman");
  el.unitArcherBtn?.classList.toggle("active", state.currentUnitType === "archer");
}

if (el.unitSwordsmanBtn) el.unitSwordsmanBtn.addEventListener("click", () => switchSpineUnitContext("swordsman"));
if (el.unitArcherBtn) el.unitArcherBtn.addEventListener("click", () => switchSpineUnitContext("archer"));
```

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `PASS`

- [x] **Step 5: Commit**

```bash
git add tests/spine-unit-context.test.cjs tools/spine-node-timeline-editor.html
git commit -m "feat: add spine editor unit selector"
```

## Task 3: Group Dedicated Controls By Unit Without Touching Shared Controls

**Files:**
- Modify: `tools/spine-node-timeline-editor.html`
- Modify: `tests/spine-unit-context.test.cjs`

**Interfaces:**
- Consumes:
  - `state.currentUnitType`
  - `renderSpineUnitContextControls()`
- Produces:
  - `renderSpineUnitFeatureGroups()` that hides or shows swordsman-only and archer-only wrappers while preserving shared controls.

- [x] **Step 1: Write the failing test**

Extend `tests/spine-unit-context.test.cjs` with feature-group visibility assertions:

```js
test("Spine editor keeps shared controls outside dedicated unit groups", () => {
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\\s\\S]*id="swordsmanFeatureGroup"/);
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\\s\\S]*id="archerFeatureGroup"/);
});

test("Spine editor renders unit-specific group visibility from currentUnitType", () => {
  assert.match(source, /function renderSpineUnitFeatureGroups\\(\\) \\{/);
  assert.match(source, /el\\.swordsmanFeatureGroup\\.hidden = state\\.currentUnitType !== "swordsman";/);
  assert.match(source, /el\\.archerFeatureGroup\\.hidden = state\\.currentUnitType !== "archer";/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `FAIL`
- Missing dedicated wrappers or visibility helper logic

- [x] **Step 3: Write minimal implementation**

Wrap the existing dedicated controls only, then render them by unit:

```html
<div id="archerFeatureGroup" hidden>
  <div id="arrowVisibilityRow" class="button-row" hidden>...</div>
  <div id="arrowParentRow" class="form-grid" hidden>...</div>
</div>

<div id="swordsmanFeatureGroup" hidden>
  <div id="slashFxVisibilityRow" class="button-row" hidden>...</div>
  <div id="slashFxParentRow" class="form-grid" hidden>...</div>
</div>
```

```js
function renderSpineUnitFeatureGroups() {
  if (el.swordsmanFeatureGroup) {
    el.swordsmanFeatureGroup.hidden = state.currentUnitType !== "swordsman";
  }
  if (el.archerFeatureGroup) {
    el.archerFeatureGroup.hidden = state.currentUnitType !== "archer";
  }
}
```

Call `renderSpineUnitFeatureGroups()` from the main render path before the existing per-object button enablement runs.

- [x] **Step 4: Run test to verify it passes**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `PASS`

- [x] **Step 5: Commit**

```bash
git add tests/spine-unit-context.test.cjs tools/spine-node-timeline-editor.html
git commit -m "feat: group spine editor controls by unit"
```

## Task 4: Run Regression Verification And Sync The Plan State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-13-spine-unit-context.md`
- Modify: `tools/spine-node-timeline-editor.html`
- Modify: `tests/spine-unit-context.test.cjs`

**Interfaces:**
- Consumes:
  - All code and tests from Tasks 1-3
- Produces:
  - Recorded verification output and an updated plan state suitable for close review.

- [x] **Step 1: Run the targeted verification commands**

Run:

```bash
npm run lint:plans
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\slash-fx-fade-window.test.cjs
```

Expected:

- `lint:plans` passes
- `tests/spine-unit-context.test.cjs` passes
- `tests/slash-fx-fade-window.test.cjs` passes

- [x] **Step 2: Sync progress and governance state**

Update this plan in place:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-13`
- Current Focus: `Implementation finished; awaiting user review.`
- Next Step: `Review the editor UI behavior in a local browser session and decide whether to close or iterate.`
- Verification: `npm run lint:plans; spine-unit-context test PASS; slash-fx-fade-window test PASS`
```

Append a new `Progress Log` entry summarizing what changed, what passed, and what the next explicit action is.

- [x] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-07-13-spine-unit-context.md tests/spine-unit-context.test.cjs tools/spine-node-timeline-editor.html
git commit -m "feat: add spine editor unit context"
```

## Exit Check

- [x] Top-level unit selector exists in the Spine editor.
- [x] Switching units auto-loads the matching project JSON.
- [x] Failed loads do not change the current unit context.
- [x] Swordsman-only controls appear only for swordsman.
- [x] Archer-only controls appear only for archer.
- [x] Shared controls remain available across both contexts.
- [x] Verification results are recorded in the plan state.

## Completion Checklist

- [x] Plan checkboxes updated
- [x] `Execution State` updated
- [x] `Progress Log` updated
- [x] Verification recorded

## Child Closeout

- Closed Child: `Spine Unit Context`
- Parent Task: `none`
- Parent Stage: `none`
- Closeout Status: `not-ready`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-implementation`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-13-spine-unit-context.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue from the first unchecked step in docs/superpowers/plans/2026-07-13-spine-unit-context.md.`
