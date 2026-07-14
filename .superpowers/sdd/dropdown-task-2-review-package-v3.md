# Dropdown Task 2 Focused Review Package v3

Head: WORKTREE

Task 2 scope for this review:
- Add confirmation-aware cross-unit switching.
- Keep same-unit selection as a no-op.
- Reset the picker value on canceled switches and failed loads.
- Refuse runtime switches to disabled registry entries.
- Preserve the current unit and project state when switching is canceled or target load fails.

## Confirmation and reset helpers
```js
      function confirmSpineUnitSwitch(currentUnitType, nextUnitType) {
        if (currentUnitType === nextUnitType) return true;
        const currentConfig = getSpineUnitConfig(currentUnitType);
        const nextConfig = getSpineUnitConfig(nextUnitType);
        return window.confirm(
          `Switch from ${currentConfig.label} to ${nextConfig.label}? Unsaved in-memory changes will be replaced.`,
        );
      }

      function resetSpineUnitSelect() {
        if (!el.unitTypeSelect) return;
        el.unitTypeSelect.value = state.currentUnitType;
      }
```

## switchSpineUnitContext after
```js
      async function switchSpineUnitContext(unitType) {
        unitType = SPINE_UNIT_CONFIGS[unitType] ? unitType : "swordsman";
        const config = getSpineUnitConfig(unitType);
        if (unitType === state.currentUnitType) {
          resetSpineUnitSelect();
          return true;
        }
        if (config.enabled === false) {
          resetSpineUnitSelect();
          return false;
        }
        if (!confirmSpineUnitSwitch(state.currentUnitType, unitType)) {
          resetSpineUnitSelect();
          return false;
        }
        const project = await loadProjectJsonFile(config.projectUrl);
        if (!project) {
          resetSpineUnitSelect();
          toast(`Failed to load ${config.label} project.`);
          return false;
        }
        applyProjectData(project);
```

## Picker change handler after
```js
        });
        el.saveJsonFileBtn.addEventListener("click", saveProjectJsonFile);
        el.sampleBtn.addEventListener("click", loadSample);
        el.walkSampleBtn.addEventListener("click", loadSideWalkSample);
        el.newVersionSampleBtn.addEventListener("click", loadNewVersionSample);
        if (el.unitTypeSelect) {
          el.unitTypeSelect.addEventListener("change", async () => {
            const switched = await switchSpineUnitContext(el.unitTypeSelect.value);
            if (!switched) {
```

## Task 2 behavior tests after
```js
test("Spine editor defines confirmation and picker reset helpers for unit switching", () => {
  assert.match(source, /function confirmSpineUnitSwitch\(currentUnitType, nextUnitType\) \{/);
  assert.match(source, /function resetSpineUnitSelect\(\) \{/);
});

test("Spine editor ignores same-unit clicks instead of reloading and overwriting unsaved state", async () => {
  let loadCalls = 0;
  let applyCalls = 0;
  const state = { currentUnitType: "swordsman" };
  const { switchSpineUnitContext } = loadUnitContextFns({
    state,
    loadProjectJsonFile: async () => {
      loadCalls += 1;
      return { format: "spine-node-timeline-editor" };
    },
    applyProjectData: () => {
      applyCalls += 1;
    },
  });

  const result = await switchSpineUnitContext("swordsman");
  assert.equal(result, true);
  assert.equal(loadCalls, 0);
  assert.equal(applyCalls, 0);
  assert.equal(state.currentUnitType, "swordsman");
});

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

test("Spine editor refuses runtime switches to disabled units without confirming or loading", async () => {
  let confirmCalls = 0;
  let loadCalls = 0;
  const state = { currentUnitType: "swordsman" };
  const select = { value: "archer" };
  const { switchSpineUnitContext } = loadUnitContextFns({
    state,
    el: { unitTypeSelect: select },
    SPINE_UNIT_CONFIGS: {
      swordsman: {
        label: "Swordsman",
        projectUrl: "/src/faxian/leg/swordsman/project.json",
        featureGroups: ["swordsman"],
```
