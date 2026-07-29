const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const mainUiFlowPath = path.join(root, "src", "ui", "main-ui", "main-ui-flow.js");

function createClassList() {
  const values = new Set();
  return {
    add(...tokens) {
      for (const token of tokens) {
        values.add(token);
      }
    },
    remove(...tokens) {
      for (const token of tokens) {
        values.delete(token);
      }
    },
    toggle(token, force) {
      if (force === undefined) {
        if (values.has(token)) {
          values.delete(token);
          return false;
        }
        values.add(token);
        return true;
      }
      if (force) {
        values.add(token);
      } else {
        values.delete(token);
      }
      return force;
    },
    contains(token) {
      return values.has(token);
    },
  };
}

function loadMainUiFlowModule() {
  const source = fs.readFileSync(mainUiFlowPath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      allowJs: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: mainUiFlowPath,
  }).outputText;
  const module = { exports: {} };
  const LIGHT_BUTTON_SOUND = { id: "light" };
  const HEAVY_BUTTON_SOUND = { id: "heavy" };
  const requireStub = (specifier) => {
    switch (specifier) {
      case "../tools/live-layout-bindings":
        return { applyLiveLayoutBindings() {} };
      case "./opening-background-animation":
        return {
          mountOpeningBackgroundAnimation() {
            return () => {};
          },
        };
      case "../portrait-assets":
        return { resolveCharacterAvatarImageUrl() { return null; } };
      case "../tools/layout-editor-view":
        return { renderLayoutEditor() { return ""; } };
      case "../../application/audio/button-sound":
        return { LIGHT_BUTTON_SOUND, HEAVY_BUTTON_SOUND };
      default:
        throw new Error(`Unexpected import in main-ui-flow.js test: ${specifier}`);
    }
  };
  vm.runInNewContext(
    transpiled,
    {
      module,
      exports: module.exports,
      require: requireStub,
      globalThis,
      window: {},
      URL,
      setTimeout,
      clearTimeout,
    },
    { filename: mainUiFlowPath }
  );
  return {
    ...module.exports,
    LIGHT_BUTTON_SOUND,
    HEAVY_BUTTON_SOUND,
  };
}

function createOverlayRoot() {
  return {
    innerHTML: "",
    classList: createClassList(),
    addEventListener() {},
    removeEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };
}

function createCharacter(id, name) {
  return {
    id,
    name,
    age: 20,
    title: "角色",
    occupation: "职业",
    clanId: "clan.test",
    stats: {
      leadership: 10,
      martial: 11,
      intelligence: 12,
      politics: 13,
      charm: 14,
      fame: 15,
    },
  };
}

function createActionTarget(action, dataset = {}) {
  const actionElement = {
    dataset: {
      mainUiAction: action,
      ...dataset,
    },
    closest(selector) {
      if (selector === "[data-main-ui-action]") {
        return this;
      }
      return null;
    },
  };
  return {
    closest(selector) {
      if (selector === "[data-main-ui-action]") {
        return actionElement;
      }
      if (selector === "[data-layout-component-handle]") {
        return null;
      }
      if (selector === ".c-main-ui-page-turn-button") {
        return null;
      }
      return null;
    },
  };
}

function createPageTurnTarget() {
  const pageTurnButton = {};
  return {
    closest(selector) {
      if (selector === ".c-main-ui-page-turn-button") {
        return pageTurnButton;
      }
      if (selector === "[data-main-ui-action]") {
        return null;
      }
      if (selector === "[data-layout-component-handle]") {
        return null;
      }
      return null;
    },
  };
}

function createFlowHarness(overrides = {}) {
  const { MainUiFlow, LIGHT_BUTTON_SOUND, HEAVY_BUTTON_SOUND } = loadMainUiFlowModule();
  const order = [];
  const flow = new MainUiFlow({
    overlayRoot: createOverlayRoot(),
    characters: [
      createCharacter("char.player", "玩家"),
      createCharacter("char.saved", "存档角色"),
    ],
    scenarioPacks: [],
    onStartGame(character) {
      order.push(`start:${character.id}`);
    },
    onContinueGame(character) {
      order.push(`continue:${character.id}`);
    },
    onStartScenarioPack() {},
    onImportScenarioPackFiles() {},
    loadSaveData: async () => {
      order.push("load-save");
      return { selectedCharacterId: "char.saved" };
    },
    getAppState: () => ({
      layoutEditor: { isOpen: false },
    }),
    onQueueButtonSound(effect) {
      order.push(`sound:${effect.id}`);
    },
    ...overrides,
  });
  flow.render = () => {};
  flow.showCharacterSelect = () => {
    order.push("show-character-select");
  };
  flow.showMainMenu = () => {
    order.push("show-main-menu");
  };
  return {
    flow,
    order,
    LIGHT_BUTTON_SOUND,
    HEAVY_BUTTON_SOUND,
  };
}

test("main menu start click queues heavy button sound before opening character select", async () => {
  const { flow, order } = createFlowHarness();

  await flow.onClick({ target: createActionTarget("open-character-select") });

  assert.deepEqual(order, ["sound:heavy", "show-character-select"]);
});

test("continue click queues heavy button sound before loading save data", async () => {
  const { flow, order } = createFlowHarness();

  await flow.onClick({ target: createActionTarget("continue-game") });

  assert.deepEqual(order, [
    "sound:heavy",
    "load-save",
    "continue:char.saved",
  ]);
});

test("choose character click queues heavy button sound before starting the game", async () => {
  const { flow, order } = createFlowHarness();

  await flow.onClick({ target: createActionTarget("start-adventure") });

  assert.deepEqual(order, ["sound:heavy", "start:char.player"]);
});

test("back click queues the light button sound before returning to the menu", async () => {
  const { flow, order } = createFlowHarness();

  await flow.onClick({ target: createActionTarget("back-to-menu") });

  assert.deepEqual(order, ["sound:light", "show-main-menu"]);
});

test("character card clicks queue the light button sound immediately", async () => {
  const { flow, order } = createFlowHarness();

  await flow.onClick({
    target: createActionTarget("select-character", {
      characterId: "char.player",
    }),
  });

  assert.deepEqual(order, ["sound:light"]);
});

test("page turn buttons queue the light button sound even without a main-ui action id", async () => {
  const { flow, order } = createFlowHarness();

  await flow.onClick({ target: createPageTurnTarget() });

  assert.deepEqual(order, ["sound:light"]);
});
