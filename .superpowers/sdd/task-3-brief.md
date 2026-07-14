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

- [ ] **Step 1: Write the failing test**

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

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
C:\Users\29636\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\spine-unit-context.test.cjs
```

Expected:

- `FAIL`
- Missing dedicated wrappers or visibility helper logic

- [ ] **Step 3: Write minimal implementation**

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
git commit -m "feat: group spine editor controls by unit"
```

