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

