# Task 1 Focused Review Package v3

Head: WORKTREE

Task 1 scope for this review:
- Replace the top-right hard-coded unit buttons with a single registry-driven dropdown.
- Keep the picker aligned to current live in-game Spine troop assets used by battle runtime.
- Remove placeholder/demo unit entries.
- Do not add confirmation logic in this task; confirmation is scheduled for later task work.

Current live in-game asset source already in repo:
- prototypes/battle-demo/index.html -> BATTLE_SPINE_TROOP_ASSETS.default.projectUrl = /src/faxian/leg/swordsman/project.json
- prototypes/battle-demo/index.html -> BATTLE_SPINE_TROOP_ASSETS.archer.projectUrl = /src/faxian/leg/archer/project.json

Note: The target files contain unrelated pre-existing worktree changes outside this task. This package includes only the Task 1-owned regions for review.

## HTML toolbar after
```html
        </div>
        <div id="unitContextToolbar" class="toolbar unit-toolbar">
          <label for="unitTypeSelect">兵种</label>
          <select id="unitTypeSelect"></select>
        </div>
        <div class="toolbar">
```

## Unit registry after
```js
      const SPINE_UNIT_CONFIGS = {
        swordsman: {
          label: "剑士",
          projectUrl: "/src/faxian/leg/swordsman/project.json",
          enabled: true,
          featureGroups: ["swordsman"],
        },
        archer: {
          label: "弓兵",
          projectUrl: "/src/faxian/leg/archer/project.json",
          enabled: true,
          featureGroups: ["archer"],
        },
      };
```

## Element map after
```js
        app: document.querySelector(".app"),
        stage: document.getElementById("stage"),
        unitTypeSelect: document.getElementById("unitTypeSelect"),
        actionList: document.getElementById("actionList"),
        actionNameInput: document.getElementById("actionNameInput"),
        newActionBtn: document.getElementById("newActionBtn"),
```

## Render helpers after
```js
      function getSpineUnitConfig(unitType) {
        return SPINE_UNIT_CONFIGS[unitType] || SPINE_UNIT_CONFIGS.swordsman;
      }

      function renderSpineUnitOptions() {
        if (!el.unitTypeSelect) return;
        el.unitTypeSelect.innerHTML = "";
        Object.entries(SPINE_UNIT_CONFIGS).forEach(([unitType, config]) => {
          const option = document.createElement("option");
          option.value = unitType;
          option.textContent = config.label;
          option.disabled = config.enabled === false;
          el.unitTypeSelect.appendChild(option);
        });
      }

      function syncSpineUnitSelectValue() {
        if (!el.unitTypeSelect) return;
        el.unitTypeSelect.value = state.currentUnitType;
      }

      function renderSpineUnitContextControls() {
        renderSpineUnitOptions();
        syncSpineUnitSelectValue();
      }
```

## Unit picker event binding after
```js
        el.walkSampleBtn.addEventListener("click", loadSideWalkSample);
        el.newVersionSampleBtn.addEventListener("click", loadNewVersionSample);
        if (el.unitTypeSelect) {
          el.unitTypeSelect.addEventListener("change", async () => {
            const switched = await switchSpineUnitContext(el.unitTypeSelect.value);
            if (!switched) {
              syncSpineUnitSelectValue();
            }
          });
        }
```

## Test excerpt after
```js
test("Spine editor defines a unit registry for swordsman and archer", () => {
  assert.match(source, /const SPINE_UNIT_CONFIGS = \{/);
  assert.match(
    source,
    /swordsman:\s*\{[\s\S]*label:\s*"剑士"[\s\S]*projectUrl:\s*"\/src\/faxian\/leg\/swordsman\/project\.json"/,
  );
  assert.match(
    source,
    /archer:\s*\{[\s\S]*label:\s*"弓兵"[\s\S]*projectUrl:\s*"\/src\/faxian\/leg\/archer\/project\.json"/,
  );
  assert.doesNotMatch(source, /spearman:\s*\{/);
});

test("Spine editor exposes a registry-driven unit select control with current troop labels", () => {
  assert.match(source, /id="unitContextToolbar"/);
  assert.match(source, /<label for="unitTypeSelect">兵种<\/label>/);
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

test("Spine editor keeps shared controls outside dedicated unit groups", () => {
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\s\S]*id="swordsmanFeatureGroup"/);
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\s\S]*id="archerFeatureGroup"/);
});

test("Spine editor gates swordsman and archer feature groups by unit context", () => {
  assert.match(source, /id="swordsmanFeatureGroup"/);
  assert.match(source, /id="archerFeatureGroup"/);
  assert.match(source, /function renderSpineUnitFeatureGroups\(\)/);
});

test("Spine editor renders unit-specific group visibility from currentUnitType", () => {
  assert.match(source, /function renderSpineUnitFeatureGroups\(\) \{/);
  assert.match(source, /el\.swordsmanFeatureGroup\.hidden = state\.currentUnitType !== "swordsman";/);
  assert.match(source, /el\.archerFeatureGroup\.hidden = state\.currentUnitType !== "archer";/);
});

test("Spine editor gates binding-panel rig controls by unit context", () => {
  assert.match(source, /function renderSpineUnitBindingControls\(\) \{/);
  assert.match(source, /el\.createBowRigBtn\.hidden = state\.currentUnitType !== "archer";/);
  assert.match(source, /el\.createArrowRigBtn\.hidden = state\.currentUnitType !== "archer";/);
  assert.match(source, /el\.createSlashFxRigBtn\.hidden = state\.currentUnitType !== "swordsman";/);
```
