const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("story dialogue advance surfaces no longer declare a page-turn button sound", () => {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/ui/views/scene/scene-view.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    html,
    /data-scene-action="\$\{options\.advanceActionId\}" role="button" tabindex="0" data-button-sound=/
  );
  assert.match(
    html,
    /data-scene-action="\$\{options\.advanceActionId\}" role="button" tabindex="0" data-ui-click-sound="none"/
  );
});

test("house dialogue advance surfaces no longer declare a page-turn button sound", () => {
  const { renderHouseDialogue } = require("../.test-dist/ui/views/house/house-shared-view.js");

  const html = renderHouseDialogue({
    moduleId: "test-module",
    houseId: "house.test",
    sceneTitle: "测试场景",
    standbyRoster: [],
    actionContainer: null,
    statusCard: null,
    overlay: null,
    leaveAction: { id: "leave-house", label: "离开" },
    dialogue: {
      mode: "character",
      speakerName: "测试人物",
      textLines: ["测试台词"],
      advanceActionId: "advance-dialogue",
      advanceHintText: "点击继续",
    },
  });

  assert.doesNotMatch(
    html,
    /data-house-action="advance-dialogue" role="button" tabindex="0" data-button-sound=/
  );
  assert.match(
    html,
    /data-house-action="advance-dialogue" role="button" tabindex="0" data-ui-click-sound="none"/
  );
});

test("location dialogue advance surfaces no longer declare a page-turn button sound", () => {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/ui/app-render.ts"),
    "utf8"
  );

  assert.doesNotMatch(
    html,
    /data-action="close-location-dialogue"[\s\S]*data-button-sound=/
  );
  assert.match(
    html,
    /data-action="close-location-dialogue"[\s\S]*data-ui-click-sound="none"/
  );
});

test("npc dialogue actions stay silent instead of falling back to the generic ui click cue", () => {
  const {
    renderNpcInteractionDialogue,
  } = require("../.test-dist/ui/components/npc-interaction/npc-interaction-menu.js");

  const html = renderNpcInteractionDialogue({
    session: {
      mode: "ai-dialogue",
      targetCharacterId: "character.test",
      dialogue: {
        requestSequence: 1,
        currentRequestId: null,
        status: "awaiting-choice",
        transcript: [
          {
            id: "turn-1",
            type: "dialogue",
            speakerId: "character.test",
            speakerName: "测试人物",
            text: "要聊什么？",
          },
        ],
        displayPages: [
          {
            id: "page-1",
            type: "dialogue",
            speakerId: "character.test",
            speakerName: "测试人物",
            text: "要聊什么？",
          },
        ],
        currentDisplayPageIndex: 0,
        options: [
          {
            id: "option.one",
            label: "问近况",
            actionText: "问近况",
            actionId: "npc-ai-dialogue-select-option:option.one",
            kind: "benevolent",
            recommended: true,
          },
          {
            id: "option.two",
            label: "问来路",
            actionText: "问来路",
            actionId: "npc-ai-dialogue-select-option:option.two",
            kind: "neutral",
          },
          {
            id: "option.three",
            label: "问人物",
            actionText: "问人物",
            actionId: "npc-ai-dialogue-select-option:option.three",
            kind: "hostile",
          },
        ],
        customInputValue: "",
        customInputOpen: false,
        statusNotice: null,
        errorNotice: null,
      },
    },
    targetName: "测试人物",
  });

  assert.doesNotMatch(
    html,
    /data-npc-action="select-option"[\s\S]*data-button-sound=/
  );
  assert.match(
    html,
    /data-npc-action="select-option"[\s\S]*data-ui-click-sound="none"/
  );
  assert.match(
    html,
    /data-npc-action="open-custom-input"[\s\S]*data-ui-click-sound="none"/
  );
  assert.match(
    html,
    /data-npc-action="close"[\s\S]*data-ui-click-sound="none"/
  );
});

test("npc dialogue page advance and custom composer actions stay silent", () => {
  const {
    renderNpcInteractionDialogue,
  } = require("../.test-dist/ui/components/npc-interaction/npc-interaction-menu.js");

  const pagingHtml = renderNpcInteractionDialogue({
    session: {
      mode: "ai-dialogue",
      targetCharacterId: "character.test",
      dialogue: {
        requestSequence: 1,
        currentRequestId: null,
        status: "awaiting-advance",
        transcript: [],
        displayPages: [
          {
            id: "page-1",
            type: "dialogue",
            speakerId: "character.test",
            speakerName: "测试人物",
            text: "第一页",
          },
          {
            id: "page-2",
            type: "dialogue",
            speakerId: "character.test",
            speakerName: "测试人物",
            text: "第二页",
          },
        ],
        currentDisplayPageIndex: 0,
        options: [],
        customInputValue: "",
        customInputOpen: false,
        statusNotice: null,
        errorNotice: null,
      },
    },
    targetName: "测试人物",
  });

  assert.doesNotMatch(
    pagingHtml,
    /data-npc-action="advance-page"[\s\S]*data-button-sound=/
  );
  assert.match(
    pagingHtml,
    /data-npc-action="advance-page"[\s\S]*data-ui-click-sound="none"/
  );

  const customHtml = renderNpcInteractionDialogue({
    session: {
      mode: "ai-dialogue",
      targetCharacterId: "character.test",
      dialogue: {
        requestSequence: 1,
        currentRequestId: null,
        status: "awaiting-choice",
        transcript: [],
        displayPages: [
          {
            id: "page-1",
            type: "dialogue",
            speakerId: "character.test",
            speakerName: "测试人物",
            text: "最后一页",
          },
        ],
        currentDisplayPageIndex: 0,
        options: [],
        customInputValue: "我自己说",
        customInputOpen: true,
        statusNotice: null,
        errorNotice: null,
      },
    },
    targetName: "测试人物",
  });

  assert.match(
    customHtml,
    /data-npc-action="submit-custom"[\s\S]*data-ui-click-sound="none"/
  );
  assert.match(
    customHtml,
    /data-npc-action="cancel-custom-input"[\s\S]*data-ui-click-sound="none"/
  );
});
