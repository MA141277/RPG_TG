const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createStagePresenterOutput,
} = require("../.test-dist/application/presenter/stage-presenters.js");
const {
  renderDialogueScreenPanel,
} = require("../.test-dist/ui/components/dialogue-screen-panel.js");

function createSceneAppState() {
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
    currentView: "scene",
  });

  return {
    gameState: {
      ...gameState,
      scene: {
        ...gameState.scene,
        activeEventId: "event.dialogue.test",
        activeSceneId: "dialogue.test.screen",
        status: "playing",
      },
      ui: {
        ...gameState.ui,
        currentView: "scene",
      },
    },
    characterDefinitions: [
      { id: "char.player", name: "玩家" },
      { id: "char.abbot", name: "方丈" },
    ],
  };
}

test("scene stage presenter surfaces dialogue screen view models for single-screen dialogue instances", () => {
  const stage = createStagePresenterOutput({
    appState: createSceneAppState(),
    cityDefinition: { id: "city.test", name: "测试城", houseIds: [] },
    cityDefinitions: [{ id: "city.test", name: "测试城", houseIds: [] }],
    houseDefinitions: [],
    cityEntries: [],
    cityNpcPoolDefinitions: [],
    playerCharacterId: "char.player",
    textEntriesById: {
      "text.dialogue.test": "施主请留步。",
    },
    sceneDefinitionsById: {},
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

  assert.equal(stage.type, "scene");
  if (stage.type !== "scene") {
    throw new Error("Expected scene stage.");
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
});

test("scene view source consumes dialogueScreenViewModel as the main single-screen dialogue input", () => {
  const source = fs.readFileSync(
    "src/ui/views/scene/scene-view.ts",
    "utf8"
  );

  assert.match(source, /dialogueScreenViewModel/);
  assert.match(source, /renderDialogueScreenPanel/);
});

test("independent dialogue screen panel renders single-screen choice UI from view model only", () => {
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

  assert.match(html, /data-scene-view="choice"/);
  assert.match(html, /可愿相助？/);
  assert.match(html, /方丈/);
  assert.match(html, /data-scene-choice-id="option.accept"/);
  assert.match(html, /愿意/);
  assert.match(html, /data-scene-choice-id="option.reject"/);
  assert.match(html, /不愿/);
});
