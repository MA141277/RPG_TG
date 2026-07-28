const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

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
    path.join(basePath, "index.ts"),
  ];
  const resolvedPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (resolvedPath == null) {
    throw new Error(`Unable to resolve TypeScript module for ${specifier}.`);
  }
  return resolvedPath;
}

function createBackgroundAssetOverrides() {
  return {
    "../../ui/background/cheng.png?url": { default: "builtin:bg/cheng.png" },
    "../../ui/background/chengzhen.png?url": {
      default: "builtin:bg/chengzhen.png",
    },
    "../../ui/background/shijing.png?url": { default: "builtin:bg/shijing.png" },
    "../../ui/background/xiangcun.png?url": {
      default: "builtin:bg/xiangcun.png",
    },
    "../../ui/background/biaoju.png?url": { default: "builtin:bg/biaoju.png" },
    "../../ui/background/chalou.png?url": { default: "builtin:bg/chalou.png" },
    "../../ui/background/dangpu.png?url": { default: "builtin:bg/dangpu.png" },
    "../../ui/background/gudongfang.png?url": {
      default: "builtin:bg/gudongfang.png",
    },
    "../../ui/background/hanlinyuan.png?url": {
      default: "builtin:bg/hanlinyuan.png",
    },
    "../../ui/background/home.png?url": { default: "builtin:bg/home.png" },
    "../../ui/background/home1.png?url": { default: "builtin:bg/home1.png" },
    "../../ui/background/huichuntang.png?url": {
      default: "builtin:bg/huichuntang.png",
    },
    "../../ui/background/jiangshuaizhaidi.png?url": {
      default: "builtin:bg/jiangshuaizhaidi.png",
    },
    "../../ui/background/jiusi.png?url": { default: "builtin:bg/jiusi.png" },
    "../../ui/background/junying.png?url": { default: "builtin:bg/junying.png" },
    "../../ui/background/lianghang.png?url": {
      default: "builtin:bg/lianghang.png",
    },
    "../../ui/background/mingjiaofentan.png?url": {
      default: "builtin:bg/mingjiaofentan.png",
    },
    "../../ui/background/qinfang.png?url": { default: "builtin:bg/qinfang.png" },
    "../../ui/background/shuaifu.png?url": { default: "builtin:bg/shuaifu.png" },
    "../../ui/background/temple.jpg?url": { default: "builtin:bg/temple.jpg" },
    "../../ui/background/tiejiangpu.png?url": {
      default: "builtin:bg/tiejiangpu.png",
    },
    "../../ui/background/wuguan.png?url": { default: "builtin:bg/wuguan.png" },
    "../../ui/background/zizhai.png?url": { default: "builtin:bg/zizhai.png" },
  };
}

test("runtime-pack import preserves dialogue node portrait side and portrait id", () => {
  const {
    importScenarioPackToScriptEditorProject,
  } = require("../.test-dist/modules/script-editor/application/runtime-pack-import.js");

  const project = importScenarioPackToScriptEditorProject({
    schemaVersion: 1,
    id: "pack.dialogue.presentation",
    title: "Dialogue Presentation Pack",
    scenarioProfile: {
      id: "scenario.dialogue.presentation",
      playerCharacterId: "person.hero",
      chapterId: "chapter.opening",
      initialLocation: {
        mapId: "map.start",
        cityId: "city.start",
        houseId: null,
        view: "map",
      },
    },
    characters: [],
    events: [],
    dialogues: [
      {
        id: "dialogue.opening",
        name: "Opening",
        nodes: [
          {
            id: "node.opening",
            type: "dialogue",
            characterId: "person.hero",
            side: "left",
            portraitId: "portrait.hero.stage.20",
            textId: "text.opening",
          },
        ],
      },
    ],
    textEntries: {
      "text.opening": "Opening line.",
    },
  });

  assert.deepEqual(project.dialogues[0]?.nodes, [
    {
      id: "node.opening",
      nodeType: "dialogue",
      speakerPersonId: "person.hero",
      side: "left",
      portraitId: "portrait.hero.stage.20",
      textId: "text.opening",
      nextNodeId: "",
      choiceTargetNodeId: "",
    },
  ]);
});

test("runtime-pack import preserves dialogue background and music nodes", () => {
  const {
    importScenarioPackToScriptEditorProject,
  } = require("../.test-dist/modules/script-editor/application/runtime-pack-import.js");

  const project = importScenarioPackToScriptEditorProject({
    schemaVersion: 1,
    id: "pack.dialogue.background-music",
    title: "Dialogue Background Music Pack",
    scenarioProfile: {
      id: "scenario.dialogue.background-music",
      playerCharacterId: "person.hero",
      chapterId: "chapter.opening",
      initialLocation: {
        mapId: "map.start",
        cityId: "city.start",
        houseId: null,
        view: "map",
      },
    },
    characters: [],
    events: [],
    dialogues: [
      {
        id: "dialogue.opening",
        name: "Opening",
        nodes: [
          {
            id: "node.background",
            type: "background",
            backgroundId: "bg.temple.hall",
          },
          {
            id: "node.music",
            type: "music",
            musicId: "bgm.temple.night",
            loop: true,
          },
        ],
      },
    ],
    textEntries: {},
  });

  assert.deepEqual(project.dialogues[0]?.nodes, [
    {
      id: "node.background",
      nodeType: "background",
      speakerPersonId: "",
      backgroundId: "bg.temple.hall",
      textId: "",
      nextNodeId: "",
      choiceTargetNodeId: "",
    },
    {
      id: "node.music",
      nodeType: "music",
      speakerPersonId: "",
      musicId: "bgm.temple.night",
      loop: true,
      textId: "",
      nextNodeId: "",
      choiceTargetNodeId: "",
    },
  ]);
});

test("dialogue story materializer lowers authored portrait side and portrait id", () => {
  const {
    materializeScriptEditorDialogueStoryRuntime,
  } = require("../.test-dist/modules/script-editor/application/dialogue-story-runtime-materializer.js");

  const result = materializeScriptEditorDialogueStoryRuntime({
    dialogues: [
      {
        id: "dialogue.opening",
        title: "Opening",
        nodes: [
          {
            id: "node.opening",
            nodeType: "dialogue",
            speakerPersonId: "person.hero",
            side: "right",
            portraitId: "portrait.hero.stage.25",
            textId: "text.opening",
            nextNodeId: "",
            choiceTargetNodeId: "",
          },
        ],
      },
    ],
    storyNodes: [],
    textEntries: [{ id: "text.opening", text: "Opening line." }],
  });

  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.dialogues?.[0]?.nodes, [
    {
      type: "dialogue",
      characterId: "person.hero",
      side: "right",
      portraitId: "portrait.hero.stage.25",
      textId: "text.opening",
    },
  ]);
});

test("dialogue story materializer lowers authored background and music nodes", () => {
  const {
    materializeScriptEditorDialogueStoryRuntime,
  } = require("../.test-dist/modules/script-editor/application/dialogue-story-runtime-materializer.js");

  const result = materializeScriptEditorDialogueStoryRuntime({
    dialogues: [
      {
        id: "dialogue.opening",
        title: "Opening",
        nodes: [
          {
            id: "node.background",
            nodeType: "background",
            speakerPersonId: "",
            backgroundId: "bg.temple.hall",
            textId: "",
            nextNodeId: "node.music",
            choiceTargetNodeId: "",
          },
          {
            id: "node.music",
            nodeType: "music",
            speakerPersonId: "",
            musicId: "bgm.temple.night",
            loop: true,
            textId: "",
            nextNodeId: "",
            choiceTargetNodeId: "",
          },
        ],
      },
    ],
    storyNodes: [],
    textEntries: [],
  });

  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(result.dialogues?.[0]?.nodes, [
    {
      type: "background",
      backgroundId: "bg.temple.hall",
    },
    {
      type: "jump",
      nextDialogueId: "dialogue.opening.node.music",
    },
  ]);
  assert.deepEqual(result.dialogues?.[1]?.nodes, [
    {
      type: "music",
      musicId: "bgm.temple.night",
      loop: true,
    },
  ]);
});

test("dialogue view renders authored dialogue side and portrait override", () => {
  const { renderDialogueView } = requireSourceModule(
    path.join(process.cwd(), "src/ui/views/dialogue/dialogue-view.ts"),
    {
      "../../../application/content/text-resolution": {
        resolveDialogueNodeText: (node) => node,
        resolveChoiceOptionText: (option) => option,
      },
      "../../location-backgrounds": {
        resolveLocationBackgroundImageUrl: () => null,
      },
      "../../portrait-assets": {
        resolveCharacterPortraitImageUrl: (character) =>
          character.portraitVariants?.find(
            (variant) => variant.id === character.portraitVariantId
          )?.portraitImageUrl ??
          character.portraitImageUrl ??
          null,
      },
    }
  );

  const markup = renderDialogueView({
    currentAction: {
      type: "dialogue",
      characterId: "person.hero",
      side: "left",
      portraitId: "portrait.hero.stage.20",
      text: "Opening line.",
    },
    activitySession: null,
    characterDefinitions: [
      {
        id: "person.hero",
        name: "Hero",
        birthYear: 1300,
        age: 20,
        cityId: "city.start",
        portraitId: "portrait.hero",
        portraitImageUrl: "builtin:user/25.png",
        portraitVariants: [
          {
            id: "stage-20",
            label: "20",
            portraitId: "portrait.hero.stage.20",
            portraitImageUrl: "builtin:user/20.png",
          },
        ],
        stats: {
          leadership: 50,
          martial: 50,
          intelligence: 50,
          politics: 50,
          charm: 50,
          fame: 50,
          gold: 50,
        },
        stamina: 100,
        availableFunctions: [],
      },
    ],
    choiceOptions: [],
  });

  assert.match(markup, /data-dialogue-side="left"/);
  assert.match(markup, /builtin:user\/20\.png/);
  assert.doesNotMatch(markup, /builtin:user\/25\.png/);
});

test("dialogue view renders background presentation instead of the generic transition placeholder", () => {
  const { renderDialogueView } = requireSourceModule(
    path.join(process.cwd(), "src/ui/views/dialogue/dialogue-view.ts"),
    {
      "../../../application/content/text-resolution": {
        resolveDialogueNodeText: (node) => node,
        resolveChoiceOptionText: (option) => option,
      },
      "../../location-backgrounds": {
        resolveLocationBackgroundImageUrl: (backgroundId) =>
          backgroundId === "temple" ? "builtin:bg/temple.png" : null,
        resolveDialogueBackgroundPreviewImageUrl: (backgroundId) =>
          backgroundId === "temple" ? "builtin:bg/temple.png" : null,
      },
      "../../portrait-assets": {
        resolveCharacterPortraitImageUrl: () => null,
      },
    }
  );

  const markup = renderDialogueView({
    currentAction: {
      type: "background",
      backgroundId: "temple",
    },
    activitySession: null,
    characterDefinitions: [],
    choiceOptions: [],
  });

  assert.match(markup, /data-dialogue-view="background"/);
  assert.match(markup, /data-dialogue-background-id="temple"/);
  assert.match(markup, /builtin:bg\/temple\.png/);
  assert.match(markup, /temple/);
  assert.doesNotMatch(markup, /data-dialogue-view="transition"/);
});

test("dialogue background preview resolver supports shipped authored bg ids and fails closed otherwise", () => {
  const { resolveDialogueBackgroundPreviewImageUrl } = requireSourceModule(
    path.join(process.cwd(), "src/ui/location-backgrounds.ts"),
    createBackgroundAssetOverrides()
  );

  assert.equal(
    resolveDialogueBackgroundPreviewImageUrl("bg.temple.courtyard"),
    "builtin:bg/temple.jpg"
  );
  assert.equal(
    resolveDialogueBackgroundPreviewImageUrl("bg.temple.hall"),
    "builtin:bg/temple.jpg"
  );
  assert.equal(
    resolveDialogueBackgroundPreviewImageUrl("bg.pei_county.office"),
    "builtin:bg/jiangshuaizhaidi.png"
  );
  assert.equal(
    resolveDialogueBackgroundPreviewImageUrl("bg.unmapped.preview"),
    null
  );
});

test("dialogue view renders preview images for shipped authored bg ids", () => {
  const locationBackgrounds = requireSourceModule(
    path.join(process.cwd(), "src/ui/location-backgrounds.ts"),
    createBackgroundAssetOverrides()
  );
  const { renderDialogueView } = requireSourceModule(
    path.join(process.cwd(), "src/ui/views/dialogue/dialogue-view.ts"),
    {
      "../../../application/content/text-resolution": {
        resolveDialogueNodeText: (node) => node,
        resolveChoiceOptionText: (option) => option,
      },
      "../../location-backgrounds": locationBackgrounds,
      "../../portrait-assets": {
        resolveCharacterPortraitImageUrl: () => null,
      },
    }
  );

  const markup = renderDialogueView({
    currentAction: {
      type: "background",
      backgroundId: "bg.temple.hall",
    },
    activitySession: null,
    characterDefinitions: [],
    choiceOptions: [],
  });

  assert.match(markup, /data-dialogue-background-id="bg\.temple\.hall"/);
  assert.match(markup, /builtin:bg\/temple\.jpg/);
  assert.doesNotMatch(markup, /data-dialogue-view="transition"/);
});

test("dialogue view renders music presentation instead of the generic transition placeholder", () => {
  const { renderDialogueView } = requireSourceModule(
    path.join(process.cwd(), "src/ui/views/dialogue/dialogue-view.ts"),
    {
      "../../../application/content/text-resolution": {
        resolveDialogueNodeText: (node) => node,
        resolveChoiceOptionText: (option) => option,
      },
      "../../location-backgrounds": {
        resolveLocationBackgroundImageUrl: () => null,
      },
      "../../portrait-assets": {
        resolveCharacterPortraitImageUrl: () => null,
      },
    }
  );

  const markup = renderDialogueView({
    currentAction: {
      type: "music",
      musicId: "bgm.temple.night",
      loop: true,
    },
    activitySession: null,
    characterDefinitions: [],
    choiceOptions: [],
  });

  assert.match(markup, /data-dialogue-view="music"/);
  assert.match(markup, /data-dialogue-music-id="bgm\.temple\.night"/);
  assert.match(markup, /data-dialogue-music-loop="true"/);
  assert.match(markup, /bgm\.temple\.night/);
  assert.doesNotMatch(markup, /data-dialogue-view="transition"/);
});
