# Spine Unit Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Spine editor's garbled hard-coded unit buttons with a registry-driven unit dropdown that scales to many unit types, shows unavailable units as disabled `(unconfigured)` options, and requires confirmation before switching.

**Architecture:** Keep the existing single-file editor in `tools/spine-node-timeline-editor.html`, but move the top-right unit picker to a single native `<select>` fed entirely by `SPINE_UNIT_CONFIGS`. Extend the registry with enablement metadata, render picker options from that registry, and route all switch attempts through one confirmation-aware switch helper so the existing unit-specific feature-group gates remain intact.

**Tech Stack:** Static HTML, inline vanilla JavaScript, Node `node:test` regression coverage in `tests/spine-unit-context.test.cjs`, PowerShell command execution, the bundled Node runtime for `tools/lint-superpowers-plans.mjs`, and targeted regression reruns for adjacent editor behavior.

## Global Constraints

- Use `SPINE_UNIT_CONFIGS` as the single source of truth for picker labels, project paths, availability, and dedicated feature-group metadata.
- Keep shared editor controls outside unit-specific groups.
- Show all known units in the picker, but render unavailable units as disabled `label + " (unconfigured)"` options.
- Require confirmation before every attempted switch to a different enabled unit.
- Keep current unit and current in-memory project unchanged on canceled switches or failed loads.
- Do not change the project JSON schema.
- Do not redesign unrelated toolbar, timeline, drag, or rendering systems.

## Execution State

- Status: `waiting`
- Last Updated: `2026-07-13`
- Current Focus: `Plan authored from the approved dropdown-selector spec; implementation has not started.`
- Next Step: `Choose an execution mode, then start Task 1 by writing the failing dropdown-selector regression tests.`
- Verification: `Not run as part of this plan-authoring batch`
- Notes: `This plan follows docs/superpowers/specs/2026-07-13-spine-unit-dropdown-design.md and intentionally modifies only the Spine editor and its regression tests.`

## Progress Log

- 2026-07-13
  - Summary: `Plan created for the dropdown-based Spine unit selector replacement.`
  - Verification: `Not run as part of this doc-only change`
  - Next: `Select an execution approach, then implement Task 1 test-first.`

---

## Based On Spec

- Primary spec:
  - `docs/superpowers/specs/2026-07-13-spine-unit-dropdown-design.md`
- Plan governance:
  - `docs/superpowers/specs/plan-governance-spec.md`
- Canonical progress entry:
  - `docs/superpowers/project-progress.md`

## Baseline Recheck

- Recheck result: `unchanged`
- Notes:
  - `tools/spine-node-timeline-editor.html` still contains two hard-coded top-right unit buttons with garbled visible text.
  - `SPINE_UNIT_CONFIGS` exists, but the top toolbar does not yet render from it.
  - `switchSpineUnitContext()` already prevents same-unit reloads, but the UI still uses direct swordsman/archer button wiring.
  - `tests/spine-unit-context.test.cjs` covers the old button-driven selector and must be rewritten around the dropdown flow.

## Implementation Scope

### In Scope

- Replace the top-right unit button group with a single select-based picker.
- Extend `SPINE_UNIT_CONFIGS` with enablement metadata for configured vs unconfigured units.
- Render picker options from the unit registry.
- Display unavailable units as disabled `(unconfigured)` options.
- Add confirmation before switching to a different enabled unit.
- Keep canceled and failed switches from mutating the current unit or project data.
- Preserve existing unit-specific feature-group and binding-control gating.
- Update regression coverage to the new picker flow.

### Still Out Of Scope

- Adding new unit art, JSON, or runtime battle behavior.
- Adding search, categories, or modal pickers.
- Persisting the last-selected unit between sessions.
- Refactoring unrelated editor systems outside the dropdown-switch path.

## File Map

### Existing files to modify

- `tools/spine-node-timeline-editor.html`
  - Replace the hard-coded toolbar buttons with the new select UI, extend the unit registry, add picker rendering helpers, and route switch attempts through confirmation-aware logic.
- `tests/spine-unit-context.test.cjs`
  - Replace the old button-driven assertions with dropdown, disabled-option, and confirmation-flow regression coverage.

### New files to create

- `none`

## Verification Plan

- Targeted verification:
  - `tests/spine-unit-context.test.cjs`
  - `tests/slash-fx-fade-window.test.cjs`
- Required commands:
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs`
  - `C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\slash-fx-fade-window.test.cjs`

## Task 1: Replace The Toolbar Buttons With A Registry-Driven Dropdown

**Files:**
- Modify: `tools/spine-node-timeline-editor.html`
- Modify: `tests/spine-unit-context.test.cjs`
- Read: `docs/superpowers/specs/2026-07-13-spine-unit-dropdown-design.md`

**Interfaces:**
- Consumes:
  - `const SPINE_UNIT_CONFIGS = { ... }`
  - `function getSpineUnitConfig(unitType)`
  - `state.currentUnitType`
- Produces:
  - `renderSpineUnitOptions(): void`
  - `syncSpineUnitSelectValue(): void`
  - A single toolbar `<select>` that renders all known units and disables unconfigured ones.

- [ ] **Step 1: Write the failing test**

Replace the old button-centric assertions with dropdown-oriented coverage:

```js
test("Spine editor exposes a registry-driven unit select control", () => {
  assert.match(source, /id="unitTypeSelect"/);
  assert.doesNotMatch(source, /id="unitSwordsmanBtn"/);
  assert.doesNotMatch(source, /id="unitArcherBtn"/);
});

test("Spine editor marks unavailable units as disabled unconfigured options", () => {
  assert.match(source, /enabled:\s*false/);
  assert.match(source, /\\$\\{config\\.label\\} \\(unconfigured\\)/);
  assert.match(source, /option\\.disabled = !config\\.enabled;/);
});

test("Spine editor renders picker options from SPINE_UNIT_CONFIGS", () => {
  assert.match(source, /function renderSpineUnitOptions\\(\\) \\{/);
  assert.match(source, /Object\\.entries\\(SPINE_UNIT_CONFIGS\\)/);
  assert.match(source, /el\\.unitTypeSelect\\.appendChild\\(option\\)/);
});

test("Spine editor syncs the select value from currentUnitType", () => {
  assert.match(source, /function syncSpineUnitSelectValue\\(\\) \\{/);
  assert.match(source, /el\\.unitTypeSelect\\.value = state\\.currentUnitType;/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `FAIL`
- Missing `unitTypeSelect`
- Old swordsman / archer button assertions no longer valid
- Missing disabled-option and select-rendering helpers

- [ ] **Step 3: Write minimal implementation**

Replace the toolbar button markup and add the option-rendering helpers:

```html
<div id="unitContextToolbar" class="toolbar unit-toolbar">
  <label for="unitTypeSelect">Unit</label>
  <select id="unitTypeSelect"></select>
</div>
```

```js
const SPINE_UNIT_CONFIGS = {
  swordsman: { label: "Swordsman", projectUrl: "/src/faxian/leg/swordsman/project.json", enabled: true, featureGroups: ["swordsman"] },
  archer: { label: "Archer", projectUrl: "/src/faxian/leg/archer/project.json", enabled: true, featureGroups: ["archer"] },
  spearman: { label: "Spearman", projectUrl: "", enabled: false, featureGroups: ["spearman"] },
};

function renderSpineUnitOptions() {
  if (!el.unitTypeSelect) return;
  el.unitTypeSelect.innerHTML = "";
  Object.entries(SPINE_UNIT_CONFIGS).forEach(([unitType, config]) => {
    const option = document.createElement("option");
    option.value = unitType;
    option.textContent = config.enabled ? config.label : `${config.label} (unconfigured)`;
    option.disabled = !config.enabled;
    el.unitTypeSelect.appendChild(option);
  });
}

function syncSpineUnitSelectValue() {
  if (!el.unitTypeSelect) return;
  el.unitTypeSelect.value = state.currentUnitType;
}
```

Update `el` to include `unitTypeSelect`, remove button references, and call both helpers from the main render path.

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `PASS` for the select-rendering assertions

- [ ] **Step 5: Commit**

```bash
git add tests/spine-unit-context.test.cjs tools/spine-node-timeline-editor.html
git commit -m "feat: replace spine unit buttons with dropdown"
```

## Task 2: Add Confirmation-Aware Switching And Picker Reset Rules

**Files:**
- Modify: `tools/spine-node-timeline-editor.html`
- Modify: `tests/spine-unit-context.test.cjs`

**Interfaces:**
- Consumes:
  - `renderSpineUnitOptions(): void`
  - `syncSpineUnitSelectValue(): void`
  - `switchSpineUnitContext(unitType): Promise<boolean>`
- Produces:
  - `confirmSpineUnitSwitch(currentUnitType, nextUnitType): boolean`
  - Picker event wiring that restores the current value on cancel or load failure.

- [ ] **Step 1: Write the failing test**

Extend the regression file to cover confirmation, cancel, success, and failure reset flows:

```js
test("Spine editor confirms before switching to a different enabled unit", async () => {
  let confirmCalls = 0;
  let loadCalls = 0;
  const state = { currentUnitType: "swordsman" };
  const { switchSpineUnitContext } = loadUnitContextFns({
    state,
    confirmSwitch: () => {
      confirmCalls += 1;
      return false;
    },
    loadProjectJsonFile: async () => {
      loadCalls += 1;
      return { format: "spine-node-timeline-editor" };
    },
  });

  const result = await switchSpineUnitContext("archer");
  assert.equal(result, false);
  assert.equal(confirmCalls, 1);
  assert.equal(loadCalls, 0);
  assert.equal(state.currentUnitType, "swordsman");
});

test("Spine editor resets the picker value when switch confirmation is canceled", async () => {
  const state = { currentUnitType: "swordsman" };
  const select = { value: "archer" };
  const { switchSpineUnitContext } = loadUnitContextFns({
    state,
    el: { unitTypeSelect: select },
    confirmSwitch: () => false,
  });

  const result = await switchSpineUnitContext("archer");
  assert.equal(result, false);
  assert.equal(select.value, "swordsman");
});

test("Spine editor resets the picker value when a target project fails to load", async () => {
  const state = { currentUnitType: "swordsman" };
  const select = { value: "archer" };
  const { switchSpineUnitContext } = loadUnitContextFns({
    state,
    el: { unitTypeSelect: select },
    confirmSwitch: () => true,
    loadProjectJsonFile: async () => null,
  });

  const result = await switchSpineUnitContext("archer");
  assert.equal(result, false);
  assert.equal(select.value, "swordsman");
  assert.equal(state.currentUnitType, "swordsman");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `FAIL`
- Missing confirmation helper and select reset behavior on cancel / load failure

- [ ] **Step 3: Write minimal implementation**

Add the confirmation helper, reset helper, and select change listener:

```js
function confirmSpineUnitSwitch(currentUnitType, nextUnitType) {
  if (currentUnitType === nextUnitType) return true;
  return window.confirm(`Switch from ${getSpineUnitConfig(currentUnitType).label} to ${getSpineUnitConfig(nextUnitType).label}? Unsaved in-memory changes will be replaced.`);
}

function resetSpineUnitSelect() {
  if (!el.unitTypeSelect) return;
  el.unitTypeSelect.value = state.currentUnitType;
}

async function switchSpineUnitContext(unitType) {
  unitType = SPINE_UNIT_CONFIGS[unitType] ? unitType : "swordsman";
  if (unitType === state.currentUnitType) {
    resetSpineUnitSelect();
    return true;
  }
  if (!confirmSpineUnitSwitch(state.currentUnitType, unitType)) {
    resetSpineUnitSelect();
    return false;
  }
  const config = getSpineUnitConfig(unitType);
  const project = await loadProjectJsonFile(config.projectUrl);
  if (!project) {
    resetSpineUnitSelect();
    toast(`Failed to load ${config.label} project.`);
    return false;
  }
  applyProjectData(project);
  state.currentUnitType = unitType;
  renderSpineUnitFeatureGroups();
  renderAll();
  resetSpineUnitSelect();
  return true;
}

el.unitTypeSelect?.addEventListener("change", () => {
  void switchSpineUnitContext(el.unitTypeSelect.value);
});
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `PASS`

- [ ] **Step 5: Commit**

```bash
git add tests/spine-unit-context.test.cjs tools/spine-node-timeline-editor.html
git commit -m "feat: add guarded spine unit dropdown switching"
```

## Task 3: Run Regression Verification And Record Plan State

**Files:**
- Modify: `docs/superpowers/plans/2026-07-13-spine-unit-dropdown.md`
- Read: `tests/spine-unit-context.test.cjs`
- Read: `tests/slash-fx-fade-window.test.cjs`

**Interfaces:**
- Consumes:
  - Completed implementation from Tasks 1-3
- Produces:
  - Updated execution state and verification record suitable for user review or execution handoff.

- [ ] **Step 1: Run the targeted verification commands**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools\lint-superpowers-plans.mjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\slash-fx-fade-window.test.cjs
```

Expected:

- `tools/lint-superpowers-plans.mjs` passes
- `tests/spine-unit-context.test.cjs` passes
- `tests/slash-fx-fade-window.test.cjs` passes

- [ ] **Step 2: Sync progress and governance state**

Update this plan in place:

```md
## Execution State

- Status: `completed-but-open`
- Last Updated: `2026-07-13`
- Current Focus: `Dropdown selector implementation and targeted verification are complete; awaiting user review.`
- Next Step: `Review the Spine editor dropdown locally, then decide whether to iterate or close out.`
- Verification: `tools/lint-superpowers-plans.mjs PASS; tests/spine-unit-context.test.cjs PASS; tests/slash-fx-fade-window.test.cjs PASS`
```

Append a new `Progress Log` entry with the implementation summary, verification results, and next explicit action.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-07-13-spine-unit-dropdown.md tests/spine-unit-context.test.cjs tools/spine-node-timeline-editor.html
git commit -m "feat: add spine unit dropdown selector"
```

## Exit Check

- [ ] The garbled top-right unit buttons are removed.
- [ ] The toolbar shows a single unit dropdown.
- [ ] Dropdown options are rendered from `SPINE_UNIT_CONFIGS`.
- [ ] Unavailable units appear as disabled `(unconfigured)` options.
- [ ] Switching to a different unit always requires confirmation.
- [ ] Canceled and failed switches leave the active unit and active project unchanged.
- [ ] Existing unit-specific feature groups still obey `state.currentUnitType`.
- [ ] Verification results are recorded in the plan state.

## Completion Checklist

- [ ] Plan checkboxes updated
- [ ] `Execution State` updated
- [ ] `Progress Log` updated
- [ ] Verification recorded

## Child Closeout

- Closed Child: `Spine Unit Dropdown`
- Parent Task: `none`
- Parent Stage: `none`
- Closeout Status: `not-ready`
- Project Progress Synced: `no`
- Next Child: `none`
- Next Child Status: `none`
- Next Required Action: `review-implementation`
- Next Entry Document: `docs/superpowers/project-progress.md`
- Next Owner Document: `docs/superpowers/plans/2026-07-13-spine-unit-dropdown.md`
- Push Status: `not-pushed`
- Push Commit: `none`
- Resume From: `Open docs/superpowers/project-progress.md, then continue from the first unchecked step in docs/superpowers/plans/2026-07-13-spine-unit-dropdown.md.`
