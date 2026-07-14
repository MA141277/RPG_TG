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

