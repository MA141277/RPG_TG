const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const source = fs.readFileSync("tools/spine-node-timeline-editor.html", "utf8");

function extractFunctionBody(signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    throw new Error(`Missing signature: ${signature}`);
  }
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(bodyStart + 1, index);
      }
    }
  }
  throw new Error(`Unclosed function body for: ${signature}`);
}

function maybeExtractFunctionBody(signature) {
  const start = source.indexOf(signature);
  if (start === -1) {
    return null;
  }
  return extractFunctionBody(signature);
}

function loadUnitContextFns(overrides = {}) {
  const getSpineUnitConfigBody = extractFunctionBody("function getSpineUnitConfig(unitType)");
  const confirmSpineUnitSwitchBody = maybeExtractFunctionBody(
    "function confirmSpineUnitSwitch(currentUnitType, nextUnitType)",
  );
  const resetSpineUnitSelectBody = maybeExtractFunctionBody("function resetSpineUnitSelect()");
  const switchSpineUnitContextBody = extractFunctionBody("async function switchSpineUnitContext(unitType)");
  const configs = overrides.SPINE_UNIT_CONFIGS || {
    swordsman: {
      label: "Swordsman",
      projectUrl: "/src/faxian/leg/swordsman/project.json",
      featureGroups: ["swordsman"],
    },
    spearman: {
      label: "Spearman",
      projectUrl: "/src/faxian/leg/spearman/project.json",
      featureGroups: ["swordsman"],
    },
    archer: {
      label: "Archer",
      projectUrl: "/src/faxian/leg/archer/project.json",
      featureGroups: ["archer"],
    },
  };
  const state = overrides.state || { currentUnitType: "swordsman" };
  const el = overrides.el || {};
  const getSpineUnitConfig = new Function(
    "SPINE_UNIT_CONFIGS",
    `return function getSpineUnitConfig(unitType) {${getSpineUnitConfigBody}};`,
  )(configs);
  const confirmSpineUnitSwitch = confirmSpineUnitSwitchBody
    ? new Function(
        "getSpineUnitConfig",
        "window",
        `return function confirmSpineUnitSwitch(currentUnitType, nextUnitType) {${confirmSpineUnitSwitchBody}};`,
      )(
        getSpineUnitConfig,
        { confirm: overrides.confirmSwitch || (() => true) },
      )
    : (currentUnitType, nextUnitType) => currentUnitType === nextUnitType;
  const resetSpineUnitSelect = resetSpineUnitSelectBody
    ? new Function(
        "el",
        "state",
        `return function resetSpineUnitSelect() {${resetSpineUnitSelectBody}};`,
      )(el, state)
    : () => {};
  const switchSpineUnitContext = new Function(
    "SPINE_UNIT_CONFIGS",
    "getSpineUnitConfig",
    "confirmSpineUnitSwitch",
    "resetSpineUnitSelect",
    "loadProjectJsonFile",
    "applyProjectData",
    "renderSpineUnitFeatureGroups",
    "renderAll",
    "toast",
    "state",
    `return async function switchSpineUnitContext(unitType) {${switchSpineUnitContextBody}};`,
  )(
    configs,
    getSpineUnitConfig,
    confirmSpineUnitSwitch,
    resetSpineUnitSelect,
    overrides.loadProjectJsonFile || (async () => null),
    overrides.applyProjectData || (() => {}),
    overrides.renderSpineUnitFeatureGroups || (() => {}),
    overrides.renderAll || (() => {}),
    overrides.toast || (() => {}),
    state,
  );
  return { getSpineUnitConfig, confirmSpineUnitSwitch, resetSpineUnitSelect, switchSpineUnitContext };
}

test("Spine editor defines a unit registry for swordsman, spearman, and archer", () => {
  assert.match(source, /const SPINE_UNIT_CONFIGS = \{/);
  assert.match(
    source,
    /swordsman:\s*\{[\s\S]*projectUrl:\s*"\/src\/faxian\/leg\/swordsman\/project\.json"/,
  );
  assert.match(
    source,
    /spearman:\s*\{[\s\S]*projectUrl:\s*"\/src\/faxian\/leg\/spearman\/project\.json"/,
  );
  assert.match(
    source,
    /archer:\s*\{[\s\S]*projectUrl:\s*"\/src\/faxian\/leg\/archer\/project\.json"/,
  );
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
  assert.match(source, /imageBaseUrl:\s*"\/src\/faxian\/leg\/swordsman\/"/);
  assert.match(source, /imageBaseUrl:\s*"\/src\/faxian\/leg\/spearman\/"/);
  assert.match(source, /imageBaseUrl:\s*"\/src\/faxian\/leg\/archer\/"/);
  assert.match(source, /materialForegroundImageKeys:\s*\["newSword"\]/);
  assert.match(source, /materialForegroundNormalizeOptions:\s*\{[\s\S]*newSword:\s*\{[\s\S]*removeDarkGuideLine:\s*true/);
});

test("Spine editor resolves default unit images from the current unit asset folder", () => {
  assert.match(source, /function spineUnitImageBasePath\(unitType = state\.currentUnitType\) \{/);
  assert.match(source, /function spineUnitImageSources\(unitType = state\.currentUnitType\) \{/);
  assert.match(source, /newHead:\s*`\$\{basePath\}head\.png`/);
  assert.match(source, /newTorso:\s*`\$\{basePath\}torso\.png`/);
  assert.match(source, /newLeftArm:\s*`\$\{basePath\}leftarm\.png`/);
  assert.match(source, /newRightArm:\s*`\$\{basePath\}rightarm\.png`/);
  assert.match(source, /newLeftLeg:\s*`\$\{basePath\}leftleg\.png`/);
  assert.match(source, /newRightLeg:\s*`\$\{basePath\}rightleg%20\(1\)\.png`/);
  assert.match(source, /newSword:\s*`\$\{basePath\}sword\.png`/);
  assert.match(source, /function refreshCurrentUnitAssetImages\(unitType = state\.currentUnitType\) \{/);
  assert.match(source, /await Promise\.all\(\s*materialKeys\.map\(async \(key\) => \{/);
  assert.match(source, /images\[key\] = await normalizeForegroundImage\(image,\s*config\.materialForegroundNormalizeOptions\?\.\[key\] \|\| \{\}\);/);
});

test("Spine editor resolves leg asset filenames from the selected unit folder", () => {
  assert.match(source, /function registerLegAssetImage\(filename,\s*unitType = state\.currentUnitType\) \{/);
  assert.match(source, /function legAssetUrl\(filename,\s*unitType = state\.currentUnitType\) \{/);
  assert.match(source, /const basePath = spineUnitImageBasePath\(unitType\);/);
  assert.match(source, /function restoreLegAssetImages\(unitType = state\.currentUnitType\) \{/);
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
  assert.match(source, /refreshCurrentUnitAssetImages\(unitType\);/);
  assert.match(source, /if \(!project\) \{[\s\S]*return false;[\s\S]*\}/);
  assert.match(source, /state\.currentUnitType = unitType;/);
});

test("Spine editor loads the current in-game unit project on startup", () => {
  assert.match(source, /async function loadInitialSpineUnitProject\(\) \{/);
  assert.match(source, /const config = getSpineUnitConfig\(state\.currentUnitType\);/);
  assert.match(source, /const project = await loadProjectJsonFile\(config\.projectUrl\);/);
  assert.match(source, /await refreshCurrentUnitAssetImages\(state\.currentUnitType\);/);
  assert.match(source, /applyProjectData\(project,\s*\{\s*unitType:\s*state\.currentUnitType\s*\}\);/);
  assert.match(source, /loadInitialSpineUnitProject\(\);/);
});

test("Spine editor exposes the same foreground normalization entry points used for bow hollowing", () => {
  assert.match(source, /async function normalizeForegroundImage\(image,\s*options = \{\}\) \{/);
  assert.match(source, /const foreground = createMaterialForegroundMask\(imageData\);/);
  assert.match(source, /if \(options\.removeDarkGuideLine\) \{/);
  assert.match(source, /function removeDarkGuideLine\(imageData,\s*options = \{\}\) \{/);
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
        enabled: true,
      },
      archer: {
        label: "Archer",
        projectUrl: "/src/faxian/leg/archer/project.json",
        featureGroups: ["archer"],
        enabled: false,
      },
    },
    confirmSwitch: () => {
      confirmCalls += 1;
      return true;
    },
    loadProjectJsonFile: async () => {
      loadCalls += 1;
      return { format: "spine-node-timeline-editor" };
    },
  });

  const result = await switchSpineUnitContext("archer");
  assert.equal(result, false);
  assert.equal(confirmCalls, 0);
  assert.equal(loadCalls, 0);
  assert.equal(state.currentUnitType, "swordsman");
  assert.equal(select.value, "swordsman");
});

test("Spine editor picker change handler awaits switching and resyncs on failure", () => {
  assert.match(
    source,
    /el\.unitTypeSelect\.addEventListener\("change", async \(\) => \{[\s\S]*const switched = await switchSpineUnitContext\(el\.unitTypeSelect\.value\);[\s\S]*if \(!switched\) \{[\s\S]*syncSpineUnitSelectValue\(\);[\s\S]*\}[\s\S]*\}\);/,
  );
});

test("Spine editor keeps shared controls outside dedicated unit groups", () => {
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\s\S]*id="swordsmanFeatureGroup"/);
  assert.doesNotMatch(source, /id="copyKeyframeBtn"[\s\S]*id="archerFeatureGroup"/);
});

test("Spine editor gates swordsman-like and archer feature groups by unit context", () => {
  assert.match(source, /id="swordsmanFeatureGroup"/);
  assert.match(source, /id="archerFeatureGroup"/);
  assert.match(source, /function renderSpineUnitFeatureGroups\(\)/);
});

test("Spine editor renders unit-specific group visibility from currentUnitType", () => {
  assert.match(source, /function renderSpineUnitFeatureGroups\(\) \{/);
  assert.match(source, /el\.swordsmanFeatureGroup\.hidden = !\["swordsman",\s*"spearman"\]\.includes\(state\.currentUnitType\);/);
  assert.match(source, /el\.archerFeatureGroup\.hidden = state\.currentUnitType !== "archer";/);
});

test("Spine editor gates binding-panel rig controls by unit context", () => {
  assert.match(source, /function renderSpineUnitBindingControls\(\) \{/);
  assert.match(source, /el\.createBowRigBtn\.hidden = state\.currentUnitType !== "archer";/);
  assert.match(source, /el\.createArrowRigBtn\.hidden = state\.currentUnitType !== "archer";/);
  assert.match(source, /el\.createSlashFxRigBtn\.hidden = !\["swordsman",\s*"spearman"\]\.includes\(state\.currentUnitType\);/);
});

test("Spine editor defaults project saving to the current unit project file", () => {
  assert.match(source, /function defaultProjectSavePath\(\) \{/);
  assert.match(source, /const config = getSpineUnitConfig\(state\.currentUnitType\);/);
  assert.match(source, /return config\.projectUrl \|\| `src\/faxian\/leg\/\$\{baseName\}\.json`;/);
});

test("Spine editor exposes slash effect labels through a unit-aware context helper", () => {
  assert.match(source, /function slashEffectContext\(\) \{/);
  assert.match(source, /state\.currentUnitType === "spearman"/);
  assert.match(source, /label:\s*"戳刺特效"/);
  assert.match(source, /label:\s*"刀光"/);
});

test("Spine editor rewrites slash effect button labels for spearman context", () => {
  assert.match(source, /el\.slashFxShowBtn\.textContent = `\$\{fxContext\.label\}出现`;/);
  assert.match(source, /el\.slashFxHideBtn\.textContent = `\$\{fxContext\.label\}消失`;/);
  assert.match(source, /el\.slashFxActionVisibilityBtn\.textContent = hiddenForAction/);
  assert.match(source, /`\$\{fxContext\.actionPrefix\}显示\$\{fxContext\.label\}`/);
  assert.match(source, /`\$\{fxContext\.actionPrefix\}隐藏\$\{fxContext\.label\}`/);
  assert.match(source, /el\.createSlashFxRigBtn\.textContent = `创建\$\{slashEffectContext\(\)\.label\}骨骼`;/);
});
