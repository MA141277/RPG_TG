# Dropdown Task 2 Focused Review Package

Head: WORKTREE

Task 2 scope for this review:
- Add confirmation-aware cross-unit switching.
- Keep same-unit selection as a no-op.
- Reset the picker value on canceled switches and failed loads.
- Preserve the current unit and project state when switching is canceled or target load fails.

## Switch helpers after
```js
      function jumpRole(node) {
        const name = String(node.name || "");
        if (node.role === "torso" && /躯干\s*[56]/.test(name)) return "leftArm";
        return idleRole(node);
      }

      function nodePartIndex(node) {
        const match = String(node.name || "").match(/(\d+)\s*$/);
        return match ? Number(match[1]) : 1;
      }

      async function loadProjectJsonFile(url) {
        try {
          const response = await fetch(url, { cache: "no-store" });
          if (!response.ok) return null;
          const data = await response.json();
          return data?.format === "spine-node-timeline-editor" ? data : null;
        } catch (error) {
          console.warn("Failed to load project JSON", error);
          return null;
        }
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
```

## Picker event binding after
```js
            renderAll();
            toast("JSON 已导入");
          } catch (error) {
            toast(error.message || "导入失败");
          } finally {
            el.fileInput.value = "";
          }
        });
        el.copyJsonBtn.addEventListener("click", async () => {
          await navigator.clipboard.writeText(el.jsonPreview.value);
```

## Task 2 tests after
```js
  assert.match(source, /id="unitTypeSelect"/);
  assert.doesNotMatch(source, /id="unitSwordsmanBtn"/);
  assert.doesNotMatch(source, /id="unitArcherBtn"/);
  assert.match(source, /currentUnitType:\s*"swordsman"/);
});

test("Spine editor keeps the picker source aligned to active in-game troop assets", () => {
  assert.doesNotMatch(source, /enabled:\s*false/);
  assert.doesNotMatch(source, /\(unconfigured\)/);
  assert.match(source, /featureGroups:\s*\["swordsman"\]/);
  assert.match(source, /featureGroups:\s*\["archer"\]/);
});

test("Spine editor renders picker options from SPINE_UNIT_CONFIGS labels", () => {
  assert.match(source, /function renderSpineUnitOptions\(\) \{/);
  assert.match(source, /Object\.entries\(SPINE_UNIT_CONFIGS\)/);
  assert.match(source, /option\.textContent = config\.label;/);
  assert.match(source, /option\.disabled = config\.enabled === false;/);
  assert.match(source, /el\.unitTypeSelect\.appendChild\(option\)/);
});

test("Spine editor syncs the select value from currentUnitType", () => {
  assert.match(source, /function syncSpineUnitSelectValue\(\) \{/);
  assert.match(source, /el\.unitTypeSelect\.value = state\.currentUnitType;/);
});

test("Spine editor switches unit context only after a project load succeeds", () => {
  assert.match(source, /async function switchSpineUnitContext\(unitType\)/);
  assert.match(source, /const project = await loadProjectJsonFile\(config\.projectUrl\)/);
  assert.match(source, /if \(!project\) \{[\s\S]*return false;[\s\S]*\}/);
  assert.match(source, /state\.currentUnitType = unitType;/);
});

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
```
