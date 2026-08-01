const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");

function requireSourceModule(entryPath, overrides = {}) {
  const source = fs.readFileSync(entryPath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021,
    },
    fileName: entryPath,
  });
  const module = { exports: {} };
  const dirname = path.dirname(entryPath);

  const localRequire = (specifier) => {
    if (Object.hasOwn(overrides, specifier)) {
      return overrides[specifier];
    }
    if (!specifier.startsWith(".")) {
      return require(specifier);
    }

    const resolvedPath = resolveTsModulePath(dirname, specifier);
    const compiledPath = path.join(
      process.cwd(),
      ".test-dist",
      path
        .relative(path.join(process.cwd(), "src"), resolvedPath)
        .replace(/\\/g, "/")
        .replace(/\.ts$/, ".js")
    );
    if (fs.existsSync(compiledPath)) {
      return require(compiledPath);
    }

    return requireSourceModule(resolvedPath, overrides);
  };

  const evaluator = new Function(
    "exports",
    "require",
    "module",
    "__filename",
    "__dirname",
    outputText
  );
  evaluator(module.exports, localRequire, module, entryPath, dirname);
  return module.exports;
}

function resolveTsModulePath(dirname, specifier) {
  const basePath = path.resolve(dirname, specifier);
  const candidates = [
    `${basePath}.ts`,
    `${basePath}.js`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.js"),
  ];
  const resolvedPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (resolvedPath == null) {
    throw new Error(`Unable to resolve TypeScript module for ${specifier}.`);
  }
  return resolvedPath;
}

function createDialogueAppState() {
  const gameState = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "dialogue",
  });

  return {
    gameState: {
      ...gameState,
      dialogue: {
        ...gameState.dialogue,
        activeEventId: "event.dialogue.test",
        activeDialogueId: "dialogue.test.screen",
        status: "playing",
      },
      ui: {
        ...gameState.ui,
        currentView: "dialogue",
      },
    },
    characterDefinitions: [
      { id: "char.player", name: "玩家" },
      { id: "char.abbot", name: "方丈" },
    ],
    cityStatusById: {},
    buildingStatusById: {},
  };
}

test("dialogue stage presenter surfaces dialogue screen view models for single-screen dialogue instances", () => {
  const {
    createStagePresenterOutput,
  } = requireSourceModule(
    path.join(process.cwd(), "src/application/presenter/stage-presenters.ts")
  );
  const stage = createStagePresenterOutput({
    appState: createDialogueAppState(),
    cityDefinition: {
      id: "city.test",
      name: "测试城",
      regionId: "region.test",
      mapNodeId: "map-node.test",
      houseIds: [],
      neighbourCityIds: [],
      travelCost: 1,
      tags: [],
      prosperity: 50,
      danger: 0,
      specialDemand: [],
    },
    cityDefinitions: [
      {
        id: "city.test",
        name: "测试城",
        regionId: "region.test",
        mapNodeId: "map-node.test",
        houseIds: [],
        neighbourCityIds: [],
        travelCost: 1,
        tags: [],
        prosperity: 50,
        danger: 0,
        specialDemand: [],
      },
    ],
    houseDefinitions: [],
    buildingArrangements: [],
    cityEntries: [],
    cityNpcPoolDefinitions: [],
    playerCharacterId: "char.player",
    menuResourcesById: {},
    menuInstancesById: {},
    textEntriesById: {
      "text.dialogue.test": "施主请留步。",
    },
    dialogueDefinitionsById: {
      "dialogue.test.screen": {
        id: "dialogue.test.screen",
        name: "测试对话",
        screen: {
          mode: "linear",
          textId: "text.dialogue.test",
          speakerCharacterId: "char.abbot",
          cast: [
            { characterId: "char.abbot", side: "left" },
            { characterId: "char.player", side: "right" },
          ],
          nextEventId: "event.dialogue.followup",
        },
      },
    },
  });

  assert.equal(stage.type, "dialogue");
  if (stage.type !== "dialogue") {
    throw new Error("Expected dialogue stage.");
  }

  assert.deepEqual(stage.dialogueScreenViewModel, {
    dialogueId: "dialogue.test.screen",
    title: "测试对话",
    text: "施主请留步。",
    speakerCharacterId: "char.abbot",
    speakerName: "方丈",
    mode: "linear",
    cast: [
      {
        characterId: "char.abbot",
        characterName: "方丈",
        side: "left",
        isSpeaker: true,
      },
      {
        characterId: "char.player",
        characterName: "玩家",
        side: "right",
        isSpeaker: false,
      },
    ],
    options: [],
  });
  assert.equal(stage.legacyDialogueNode, null);
  assert.deepEqual(stage.legacyDialogueChoiceOptions, []);
});

test("dialogue stage presenter ignores legacy node payloads when a screen dialogue is present", () => {
  const {
    createStagePresenterOutput,
  } = requireSourceModule(
    path.join(process.cwd(), "src/application/presenter/stage-presenters.ts")
  );
  const stage = createStagePresenterOutput({
    appState: createDialogueAppState(),
    cityDefinition: {
      id: "city.test",
      name: "测试城",
      regionId: "region.test",
      mapNodeId: "map-node.test",
      houseIds: [],
      neighbourCityIds: [],
      travelCost: 1,
      tags: [],
      prosperity: 50,
      danger: 0,
      specialDemand: [],
    },
    cityDefinitions: [
      {
        id: "city.test",
        name: "测试城",
        regionId: "region.test",
        mapNodeId: "map-node.test",
        houseIds: [],
        neighbourCityIds: [],
        travelCost: 1,
        tags: [],
        prosperity: 50,
        danger: 0,
        specialDemand: [],
      },
    ],
    houseDefinitions: [],
    buildingArrangements: [],
    cityEntries: [],
    cityNpcPoolDefinitions: [],
    playerCharacterId: "char.player",
    menuResourcesById: {},
    menuInstancesById: {},
    textEntriesById: {
      "text.dialogue.test": "施主请留步。",
      "text.dialogue.legacy": "旧节点文案",
      "text.option.legacy": "旧节点选项",
    },
    dialogueDefinitionsById: {
      "dialogue.test.screen": {
        id: "dialogue.test.screen",
        name: "测试对话",
        screen: {
          mode: "choice",
          textId: "text.dialogue.test",
          speakerCharacterId: "char.abbot",
          cast: [
            { characterId: "char.abbot", side: "left" },
            { characterId: "char.player", side: "right" },
          ],
          options: [
            {
              id: "option.screen.accept",
              labelTextId: "text.option.legacy",
              nextEventId: "event.dialogue.followup",
            },
          ],
        },
        nodes: [
          {
            type: "choice",
            promptTextId: "text.dialogue.legacy",
            options: [
              {
                id: "option.legacy.accept",
                labelTextId: "text.option.legacy",
                nextEventId: "event.legacy.followup",
              },
            ],
          },
        ],
      },
    },
  });

  assert.equal(stage.type, "dialogue");
  if (stage.type !== "dialogue") {
    throw new Error("Expected dialogue stage.");
  }

  assert.equal(stage.legacyDialogueNode, null);
  assert.deepEqual(stage.legacyDialogueChoiceOptions, []);
  assert.equal(stage.dialogueScreenViewModel?.mode, "choice");
  assert.deepEqual(stage.dialogueScreenViewModel?.options, [
    {
      id: "option.screen.accept",
      text: "旧节点选项",
    },
  ]);
});

test("app render source consumes dialogueScreenViewModel as the main single-screen dialogue input", () => {
  const source = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.match(source, /dialogueScreenViewModel/);
  assert.match(source, /renderDialogueScreenPanel/);
  assert.match(source, /legacyDialogueNode/);
  assert.match(source, /legacyDialogueChoiceOptions/);
  assert.doesNotMatch(source, /currentDialogueNode/);
  assert.doesNotMatch(source, /currentDialogueChoiceOptions/);
});

test("presenter output contract marks node-based dialogue data as legacy fallback only", () => {
  const source = fs.readFileSync(
    "src/application/presenter/presenter-output.ts",
    "utf8"
  );

  assert.match(source, /legacyDialogueNode/);
  assert.match(source, /legacyDialogueChoiceOptions/);
  assert.doesNotMatch(source, /currentDialogueNode/);
  assert.doesNotMatch(source, /currentDialogueChoiceOptions/);
});

test("independent dialogue screen panel renders single-screen choice UI from view model only", () => {
  const {
    renderDialogueScreenPanel,
  } = requireSourceModule(
    path.join(process.cwd(), "src/ui/components/dialogue-screen-panel.ts")
  );

  const html = renderDialogueScreenPanel({
    dialogueScreenViewModel: {
      dialogueId: "dialogue.choice.screen",
      title: "测试选择",
      text: "可愿相助？",
      speakerCharacterId: "char.abbot",
      speakerName: "方丈",
      mode: "choice",
      cast: [
        {
          characterId: "char.abbot",
          characterName: "方丈",
          side: "left",
          isSpeaker: true,
        },
      ],
      options: [
        { id: "option.accept", text: "愿意" },
        { id: "option.reject", text: "不愿" },
      ],
    },
    activityOverlay: "",
    speakerPortraitImageUrl: null,
    speakerPortraitArtClassName: "c-test-portrait",
  });

  assert.match(html, /data-dialogue-view="choice"/);
  assert.match(html, /可愿相助？/);
  assert.match(html, /方丈/);
  assert.match(html, /data-dialogue-choice-id="option.accept"/);
  assert.match(html, /愿意/);
  assert.match(html, /data-dialogue-choice-id="option.reject"/);
  assert.match(html, /不愿/);
});
