# Task 1 Focused Review Package

Base: bef9271
Head: WORKTREE

Note: The target files contain unrelated pre-existing worktree changes outside this task. This package includes only the Task 1-owned regions for review.

## HTML toolbar before
```html
          </div>
        </div>
        <div id="unitContextToolbar" class="toolbar unit-toolbar">
          <button id="unitSwordsmanBtn" class="mode-button active" type="button">剑士</button>
          <button id="unitArcherBtn" class="mode-button" type="button">弓兵</button>
        </div>
        <div class="toolbar">
```

## HTML toolbar after
```html
            <span>楠ㄩ鑺傜偣 路 鍏抽敭甯?路 鎻掑€兼挱鏀?路 JSON 宸ョ▼瀵煎叆瀵煎嚭</span>
          </div>
        </div>
        <div id="unitContextToolbar" class="toolbar unit-toolbar">
          <label for="unitTypeSelect">Unit</label>
          <select id="unitTypeSelect"></select>
        </div>
        <div class="toolbar">
```

## Unit registry before
```js
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
```

## Unit registry after
```js
      const SPINE_UNIT_CONFIGS = {
        swordsman: {
          label: "鍓戝＋",
          projectUrl: "/src/faxian/leg/swordsman/project.json",
          enabled: true,
          featureGroups: ["swordsman"],
        },
        archer: {
          label: "寮撳叺",
          projectUrl: "/src/faxian/leg/archer/project.json",
          enabled: true,
          featureGroups: ["archer"],
        },
        spearman: {
          label: "Spearman",
          projectUrl: "",
          enabled: false,
          featureGroups: ["spearman"],
        },
      };
```

## Element map before
```js
        saveActionBtn: document.getElementById("saveActionBtn"),
        applyIdleToActionBtn: document.getElementById("applyIdleToActionBtn"),
        deleteActionBtn: document.getElementById("deleteActionBtn"),
        nodeList: document.getElementById("nodeList"),
        pieceList: document.getElementById("pieceList"),
        addNodeBtn: document.getElementById("addNodeBtn"),
        addPieceBtn: document.getElementById("addPieceBtn"),
```

## Element map after
```js
      const el = {
        app: document.querySelector(".app"),
        stage: document.getElementById("stage"),
        unitTypeSelect: document.getElementById("unitTypeSelect"),
        actionList: document.getElementById("actionList"),
        actionNameInput: document.getElementById("actionNameInput"),
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
          option.textContent = config.enabled ? config.label : `${config.label} (unconfigured)`;
          option.disabled = !config.enabled;
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
```

## Unit picker event binding after
```js
        el.saveJsonFileBtn.addEventListener("click", saveProjectJsonFile);
        el.sampleBtn.addEventListener("click", loadSample);
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
        el.replaceMaterialBtn.addEventListener("click", () => el.materialInput.click());
```

## Test file relevant excerpt before
```js
  assert.match(source, /async function switchSpineUnitContext\(unitType\)/);
  assert.match(source, /const project = await loadProjectJsonFile\(config\.projectUrl\)/);
  assert.match(source, /if \(!project\) \{[\s\S]*return false;[\s\S]*\}/);
  assert.match(source, /state\.currentUnitType = unitType;/);
});

test("Spine editor exposes top-level swordsman and archer unit buttons", () => {
  assert.match(source, /id="unitContextToolbar"/);
  assert.match(source, /id="unitSwordsmanBtn"/);
  assert.match(source, /id="unitArcherBtn"/);
  assert.match(source, /currentUnitType:\s*"swordsman"/);
});

test("Spine editor binds the unit buttons to switchSpineUnitContext", () => {
  assert.match(
    source,
    /el\.unitSwordsmanBtn\.addEventListener\("click", \(\) => switchSpineUnitContext\("swordsman"\)\)/,
  );
  assert.match(
    source,
    /el\.unitArcherBtn\.addEventListener\("click", \(\) => switchSpineUnitContext\("archer"\)\)/,
  );
});

test("Spine editor gates swordsman and archer feature groups by unit context", () => {
  assert.match(source, /id="swordsmanFeatureGroup"/);
  assert.match(source, /id="archerFeatureGroup"/);
  assert.match(source, /function renderSpineUnitFeatureGroups\(\)/);
});

test("Spine editor keeps shared controls outside dedicated unit groups", () => {
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\s\S]*id="swordsmanFeatureGroup"/);
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\s\S]*id="archerFeatureGroup"/);
});

test("Spine editor renders unit-specific group visibility from currentUnitType", () => {
  assert.match(source, /function renderSpineUnitFeatureGroups\(\) \{/);
  assert.match(source, /el\.swordsmanFeatureGroup\.hidden = state\.currentUnitType !== "swordsman";/);
  assert.match(source, /el\.archerFeatureGroup\.hidden = state\.currentUnitType !== "archer";/);
});
```

## Test file relevant excerpt after
```js
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

test("Spine editor exposes a registry-driven unit select control", () => {
  assert.match(source, /id="unitContextToolbar"/);
  assert.match(source, /id="unitTypeSelect"/);
  assert.doesNotMatch(source, /id="unitSwordsmanBtn"/);
  assert.doesNotMatch(source, /id="unitArcherBtn"/);
  assert.match(source, /currentUnitType:\s*"swordsman"/);
});

test("Spine editor marks unavailable units as disabled unconfigured options", () => {
  assert.match(source, /enabled:\s*false/);
  assert.match(source, /\$\{config\.label\} \(unconfigured\)/);
  assert.match(source, /option\.disabled = !config\.enabled;/);
});

test("Spine editor renders picker options from SPINE_UNIT_CONFIGS", () => {
  assert.match(source, /function renderSpineUnitOptions\(\) \{/);
  assert.match(source, /Object\.entries\(SPINE_UNIT_CONFIGS\)/);
  assert.match(source, /el\.unitTypeSelect\.appendChild\(option\)/);
});

test("Spine editor syncs the select value from currentUnitType", () => {
  assert.match(source, /function syncSpineUnitSelectValue\(\) \{/);
  assert.match(source, /el\.unitTypeSelect\.value = state\.currentUnitType;/);
});

test("Spine editor gates swordsman and archer feature groups by unit context", () => {
  assert.match(source, /id="swordsmanFeatureGroup"/);
  assert.match(source, /id="archerFeatureGroup"/);
  assert.match(source, /function renderSpineUnitFeatureGroups\(\)/);
});

test("Spine editor keeps shared controls outside dedicated unit groups", () => {
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\s\S]*id="swordsmanFeatureGroup"/);
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\s\S]*id="archerFeatureGroup"/);
});

test("Spine editor renders unit-specific group visibility from currentUnitType", () => {
  assert.match(source, /function renderSpineUnitFeatureGroups\(\) \{/);
  assert.match(source, /el\.swordsmanFeatureGroup\.hidden = state\.currentUnitType !== "swordsman";/);
  assert.match(source, /el\.archerFeatureGroup\.hidden = state\.currentUnitType !== "archer";/);
});
```
