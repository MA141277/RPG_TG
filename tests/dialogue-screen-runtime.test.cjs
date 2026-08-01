const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createDialogueScreenViewModel,
  continueDialogueScreen,
  selectDialogueScreenOption,
} = require("../.test-dist/core/runtime/dialogue-screen-runtime.js");

test("dialogue screen runtime builds a linear view model from dialogue instance plus runtime dependencies", () => {
  const dialogue = {
    id: "dialogue.linear",
    name: "线性对话",
    screen: {
      mode: "linear",
      textId: "text.dialogue.linear",
      speakerCharacterId: "char.abbot",
      cast: [
        { characterId: "char.abbot", side: "left" },
        { characterId: "char.hero", side: "right" },
      ],
      nextEventId: "event.followup",
    },
  };

  const viewModel = createDialogueScreenViewModel({
    dialogue,
    textEntriesById: {
      "text.dialogue.linear": "施主且慢。",
    },
    characterDefinitions: [
      { id: "char.abbot", name: "方丈" },
      { id: "char.hero", name: "主角" },
    ],
  });

  assert.deepEqual(viewModel, {
    dialogueId: "dialogue.linear",
    title: "线性对话",
    text: "施主且慢。",
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
        characterId: "char.hero",
        characterName: "主角",
        side: "right",
        isSpeaker: false,
      },
    ],
    options: [],
  });
});

test("dialogue screen runtime resolves continue into a stable close result without mutating host state", () => {
  const dialogue = {
    id: "dialogue.linear",
    name: "线性对话",
    screen: {
      mode: "linear",
      textId: "text.dialogue.linear",
      speakerCharacterId: "char.abbot",
      cast: [{ characterId: "char.abbot", side: "left" }],
      nextEventId: "event.followup",
    },
  };

  assert.deepEqual(continueDialogueScreen(dialogue), {
    type: "close",
    nextEventId: "event.followup",
  });
});

test("dialogue screen runtime resolves choice selection into a stable result without mutating host state", () => {
  const dialogue = {
    id: "dialogue.choice",
    name: "选择对话",
    screen: {
      mode: "choice",
      textId: "text.dialogue.choice",
      speakerCharacterId: "char.abbot",
      cast: [{ characterId: "char.abbot", side: "left" }],
      options: [
        {
          id: "option.accept",
          labelTextId: "text.option.accept",
          nextEventId: "event.accept",
        },
        {
          id: "option.reject",
          labelTextId: "text.option.reject",
          nextEventId: "event.reject",
        },
      ],
    },
  };

  const viewModel = createDialogueScreenViewModel({
    dialogue,
    textEntriesById: {
      "text.dialogue.choice": "是否应允？",
      "text.option.accept": "应下",
      "text.option.reject": "回绝",
    },
    characterDefinitions: [{ id: "char.abbot", name: "方丈" }],
  });

  assert.deepEqual(viewModel.options, [
    { id: "option.accept", text: "应下" },
    { id: "option.reject", text: "回绝" },
  ]);
  assert.deepEqual(selectDialogueScreenOption(dialogue, "option.reject"), {
    type: "choice",
    optionId: "option.reject",
    nextEventId: "event.reject",
  });
});
