const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  advanceStoryDialogueStep,
  getCurrentDialogueChoiceOptions,
  startStoryEventById,
} = require("../.test-dist/application/story/story-runtime.js");

function createBaseState() {
  return createInitialState({
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
    currentView: "city",
  });
}

test("story runtime hands single-screen dialogue events off to dialogue UI instead of consuming them in the legacy node runner", () => {
  const result = startStoryEventById(
    {
      state: createBaseState(),
      characterDefinitions: [
        { id: "char.player", name: "玩家" },
        { id: "char.abbot", name: "方丈" },
      ],
    },
    {
      eventDefinitionsById: {
        "event.dialogue.screen": {
          id: "event.dialogue.screen",
          chapterId: "chapter.test",
          name: "单屏对话事件",
          occurrence: "once",
          dialogueId: "dialogue.screen.test",
        },
      },
      dialogueDefinitionsById: {
        "dialogue.screen.test": {
          id: "dialogue.screen.test",
          name: "单屏对话",
          screen: {
            mode: "linear",
            textId: "text.dialogue.screen",
            speakerCharacterId: "char.abbot",
            cast: [
              { characterId: "char.abbot", side: "left" },
              { characterId: "char.player", side: "right" },
            ],
          },
        },
      },
      textEntriesById: {
        "text.dialogue.screen": "施主请留步。",
      },
    },
    "event.dialogue.screen"
  );

  assert.equal(result.state.dialogue.activeEventId, "event.dialogue.screen");
  assert.equal(result.state.dialogue.activeDialogueId, "dialogue.screen.test");
  assert.equal(result.state.dialogue.status, "playing");
  assert.equal(result.state.ui.currentView, "dialogue");
});

test("story runtime exposes choice options from single-screen dialogue definitions on the main path", () => {
  const result = startStoryEventById(
    {
      state: createBaseState(),
      characterDefinitions: [
        { id: "char.player", name: "玩家" },
        { id: "char.abbot", name: "方丈" },
      ],
    },
    {
      eventDefinitionsById: {
        "event.dialogue.choice": {
          id: "event.dialogue.choice",
          chapterId: "chapter.test",
          name: "单屏选择对话事件",
          occurrence: "once",
          dialogueId: "dialogue.choice.test",
        },
      },
      dialogueDefinitionsById: {
        "dialogue.choice.test": {
          id: "dialogue.choice.test",
          name: "单屏选择对话",
          screen: {
            mode: "choice",
            textId: "text.dialogue.choice",
            speakerCharacterId: "char.abbot",
            cast: [
              { characterId: "char.abbot", side: "left" },
              { characterId: "char.player", side: "right" },
            ],
            options: [
              {
                id: "option.accept",
                labelTextId: "text.option.accept",
                nextEventId: "event.followup.accept",
              },
            ],
          },
        },
      },
      textEntriesById: {
        "text.dialogue.choice": "可愿相助？",
        "text.option.accept": "愿意",
      },
    },
    "event.dialogue.choice"
  );

  assert.deepEqual(
    getCurrentDialogueChoiceOptions(result.state, {
      "dialogue.choice.test": {
        id: "dialogue.choice.test",
        name: "单屏选择对话",
        screen: {
          mode: "choice",
          textId: "text.dialogue.choice",
          speakerCharacterId: "char.abbot",
          cast: [
            { characterId: "char.abbot", side: "left" },
            { characterId: "char.player", side: "right" },
          ],
          options: [
            {
              id: "option.accept",
              labelTextId: "text.option.accept",
              nextEventId: "event.followup.accept",
            },
          ],
        },
      },
    }),
    [
      {
        id: "option.accept",
        labelTextId: "text.option.accept",
        nextEventId: "event.followup.accept",
      },
    ]
  );
  assert.equal(result.state.dialogue.status, "waiting-choice");
});

test("advancing a linear single-screen dialogue routes through nextEventId instead of legacy cursor stepping", () => {
  const started = startStoryEventById(
    {
      state: createBaseState(),
      characterDefinitions: [
        { id: "char.player", name: "玩家" },
        { id: "char.abbot", name: "方丈" },
      ],
    },
    {
      eventDefinitionsById: {
        "event.dialogue.screen": {
          id: "event.dialogue.screen",
          chapterId: "chapter.test",
          name: "单屏对话事件",
          occurrence: "once",
          dialogueId: "dialogue.screen.test",
        },
        "event.followup": {
          id: "event.followup",
          chapterId: "chapter.test",
          name: "后续事件",
          occurrence: "once",
          dialogueId: "",
        },
      },
      dialogueDefinitionsById: {
        "dialogue.screen.test": {
          id: "dialogue.screen.test",
          name: "单屏对话",
          screen: {
            mode: "linear",
            textId: "text.dialogue.screen",
            speakerCharacterId: "char.abbot",
            cast: [
              { characterId: "char.abbot", side: "left" },
              { characterId: "char.player", side: "right" },
            ],
            nextEventId: "event.followup",
          },
        },
      },
      textEntriesById: {
        "text.dialogue.screen": "施主请留步。",
      },
    },
    "event.dialogue.screen"
  );

  const advanced = advanceStoryDialogueStep(started, {
    eventDefinitionsById: {
      "event.dialogue.screen": {
        id: "event.dialogue.screen",
        chapterId: "chapter.test",
        name: "单屏对话事件",
        occurrence: "once",
        dialogueId: "dialogue.screen.test",
      },
      "event.followup": {
        id: "event.followup",
        chapterId: "chapter.test",
        name: "后续事件",
        occurrence: "once",
        dialogueId: "",
      },
    },
    dialogueDefinitionsById: {
      "dialogue.screen.test": {
        id: "dialogue.screen.test",
        name: "单屏对话",
        screen: {
          mode: "linear",
          textId: "text.dialogue.screen",
          speakerCharacterId: "char.abbot",
          cast: [
            { characterId: "char.abbot", side: "left" },
            { characterId: "char.player", side: "right" },
          ],
          nextEventId: "event.followup",
        },
      },
    },
    textEntriesById: {
      "text.dialogue.screen": "施主请留步。",
    },
  });

  assert.equal(advanced.state.runtime.eventHistory["event.followup"]?.firedCount, 1);
  assert.equal(advanced.state.dialogue.activeEventId, null);
  assert.equal(advanced.state.dialogue.activeDialogueId, null);
  assert.equal(advanced.state.dialogue.status, "idle");
});
