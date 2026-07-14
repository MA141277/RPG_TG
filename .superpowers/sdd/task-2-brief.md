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

- [ ] **Step 1: Write the failing test**

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

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `FAIL`
- Missing selector toolbar/buttons or click binding assertions

- [ ] **Step 3: Write minimal implementation**

Add the selector markup and state wiring:

```html
<div id="unitContextToolbar" class="toolbar unit-toolbar">
  <button id="unitSwordsmanBtn" class="mode-button active" type="button">鍓戝＋</button>
  <button id="unitArcherBtn" class="mode-button" type="button">寮撳叺</button>
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
git commit -m "feat: add spine editor unit selector"
```

