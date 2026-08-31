const test = require("node:test");
const assert = require("node:assert/strict");

function loadRenderer() {
  return require("../.test-dist/ui/components/npc-interaction/npc-interaction-menu.js");
}

function loadInlineDialoguePanel() {
  return require(
    "../.test-dist/ui/components/npc-interaction/npc-interaction-dialogue-panel.js"
  );
}

function createDialogueSession() {
  return {
    context: {
      type: "house",
      houseId: "house.test.tea",
    },
    targetCharacterId: "char.test.npc",
    mode: "ai-dialogue",
    dialogue: {
      requestSequence: 2,
      currentRequestId: null,
      status: "awaiting-advance",
      transcript: [
        {
          id: "turn-1",
          type: "narration",
          text: "茶香未散，门外人声浮动。",
        },
        {
          id: "turn-2",
          type: "dialogue",
          speakerId: "char.test.npc",
          speakerName: "茶博士",
          text: "客官今日想聊哪一桩？",
        },
        {
          id: "turn-3",
          type: "dialogue",
          speakerId: "char.player",
          speakerName: "朱重八",
          text: "先问城里近况。",
        },
      ],
      displayPages: [
        {
          id: "page-1",
          type: "dialogue",
          speakerId: "char.test.npc",
          speakerName: "茶博士",
          text: "茶香未散，门外风声正紧。",
        },
        {
          id: "page-2",
          type: "dialogue",
          speakerId: "char.test.npc",
          speakerName: "茶博士",
          text: "客官今日想聊哪一桩？",
        },
      ],
      currentDisplayPageIndex: 0,
      options: [
        {
          id: "option.ask_town",
          label: "善意回应",
          actionText: "好啊，那你先说说城里近况。",
          actionId: "npc-ai-dialogue-select-option:option.ask_town",
          kind: "benevolent",
          recommended: true,
        },
        {
          id: "option.ask_road",
          label: "中立回应",
          actionText: "路上见闻也行，你慢慢说。",
          actionId: "npc-ai-dialogue-select-option:option.ask_road",
          kind: "neutral",
        },
        {
          id: "option.ask_people",
          label: "恶意回应",
          actionText: "少绕弯子，直接讲你知道的人物消息。",
          actionId: "npc-ai-dialogue-select-option:option.ask_people",
          kind: "hostile",
        },
      ],
      customInputValue: "",
      customInputOpen: false,
      statusNotice: null,
      errorNotice: null,
    },
  };
}

test("NPC AI dialogue renderer reuses the bottom dialogue shell and hides reply buttons until the current NPC pages are advanced", () => {
  const { renderNpcInteractionDialogue } = loadRenderer();

  const markup = renderNpcInteractionDialogue({
    session: createDialogueSession(),
    targetName: "茶博士",
    portraitArtClassName: "c-test-portrait",
  });

  assert.match(markup, /data-npc-dialogue="ai-dialogue"/u);
  assert.match(markup, /class="c-grain-shop-dialogue/u);
  assert.match(markup, /茶香未散，门外风声正紧/u);
  assert.doesNotMatch(markup, /客官今日想聊哪一桩/u);
  assert.match(markup, /c-test-portrait/u);
  assert.match(markup, /data-npc-action="advance-page"/u);
  assert.equal(
    (markup.match(/data-npc-action="select-option"/gu) ?? []).length,
    0
  );
  assert.doesNotMatch(markup, /data-npc-action="open-custom-input"/u);
  assert.doesNotMatch(markup, /data-npc-input="custom"/u);
  assert.match(markup, /data-npc-action="close"/u);
});

test("NPC AI dialogue renderer shows the three direct AI reply lines plus the custom entry only after the final NPC page is visible", () => {
  const { renderNpcInteractionDialogue } = loadRenderer();

  const markup = renderNpcInteractionDialogue({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        status: "awaiting-choice",
        currentDisplayPageIndex: 1,
      },
    },
    targetName: "茶博士",
  });

  assert.match(markup, /客官今日想聊哪一桩/u);
  assert.equal(
    (markup.match(/data-npc-action="select-option"/gu) ?? []).length,
    3
  );
  assert.match(markup, /data-npc-option-id="option\.ask_town"/u);
  assert.match(markup, /好啊，那你先说说城里近况。/u);
  assert.match(markup, /路上见闻也行，你慢慢说。/u);
  assert.match(markup, /少绕弯子，直接讲你知道的人物消息。/u);
  assert.doesNotMatch(markup, /善意回应/u);
  assert.doesNotMatch(markup, /中立回应/u);
  assert.doesNotMatch(markup, /恶意回应/u);
  assert.match(markup, /data-npc-action="open-custom-input"/u);
  assert.doesNotMatch(markup, /data-npc-input="custom"/u);
});

test("NPC AI dialogue renderer keeps the bottom dialogue box clickable while waiting to hand off into a resolved special action", () => {
  const { renderNpcInteractionDialogue } = loadRenderer();

  const markup = renderNpcInteractionDialogue({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        status: "awaiting-action-jump",
        displayPages: [
          {
            id: "page-1",
            type: "dialogue",
            speakerId: "char.test.npc",
            speakerName: "茶博士",
            text: "若你是来问行情的，我这就把柜上的新货都翻给你看。",
          },
        ],
        currentDisplayPageIndex: 0,
        options: [],
      },
    },
    targetName: "茶博士",
  });

  assert.match(markup, /data-npc-action="advance-page"/u);
  assert.match(markup, /点击继续/u);
  assert.equal(
    (markup.match(/data-npc-action="select-option"/gu) ?? []).length,
    0
  );
  assert.doesNotMatch(markup, /data-npc-action="open-custom-input"/u);
});

test("NPC AI dialogue renderer falls back to the target display name when the current speaker label looks like an internal token", () => {
  const { renderNpcInteractionDialogue } = loadRenderer();

  const markup = renderNpcInteractionDialogue({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        displayPages: [
          {
            id: "page-1",
            type: "dialogue",
            speakerId: "QIAN_ZHANGGUI",
            speakerName: "QIAN_ZHANGGUI",
            text: "近来货路不太平，你可得留神。",
          },
        ],
        currentDisplayPageIndex: 0,
      },
    },
    targetName: "钱掌柜",
  });

  assert.match(markup, /c-grain-shop-dialogue__speaker">钱掌柜<\/p>/u);
  assert.doesNotMatch(markup, /QIAN_ZHANGGUI/u);
});

test("NPC AI dialogue renderer uses the shared beige paper button skin for reply actions", () => {
  const { renderNpcInteractionDialogue } = loadRenderer();

  const markup = renderNpcInteractionDialogue({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        status: "awaiting-choice",
        currentDisplayPageIndex: 1,
      },
    },
    targetName: "茶博士",
  });

  assert.match(
    markup,
    /class="c-grain-shop-actions c-npc-interaction-inline-actions"/u
  );
  assert.match(
    markup,
    /class="c-button c-grain-shop-button c-grain-shop-button--paper c-npc-interaction-reply c-npc-interaction-reply--benevolent c-npc-interaction-option--recommended"/u
  );
  assert.match(
    markup,
    /class="c-button c-grain-shop-button c-grain-shop-button--paper c-npc-interaction-reply c-npc-interaction-reply--custom"/u
  );
  assert.doesNotMatch(markup, /c-house-red-nine-slice-actions/u);
  assert.doesNotMatch(markup, /c-house-red-nine-slice-button/u);
});

test("NPC AI dialogue renderer swaps the fourth reply slot into a custom composer when the player enters custom input mode", () => {
  const { renderNpcInteractionDialogue } = loadRenderer();

  const markup = renderNpcInteractionDialogue({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        status: "awaiting-choice",
        currentDisplayPageIndex: 1,
        customInputOpen: true,
        customInputValue: "我想问问城外消息",
      },
    },
    targetName: "茶博士",
  });

  assert.equal(
    (markup.match(/data-npc-action="select-option"/gu) ?? []).length,
    0
  );
  assert.match(markup, /data-npc-input="custom"/u);
  assert.match(markup, /value="我想问问城外消息"/u);
  assert.match(markup, /data-npc-action="submit-custom"/u);
  assert.match(markup, /data-npc-action="cancel-custom-input"/u);
});

test("NPC AI dialogue renderer surfaces streaming and recoverable error state through typed inline markup", () => {
  const { renderNpcInteractionDialogue } = loadRenderer();

  const markup = renderNpcInteractionDialogue({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        status: "streaming",
        currentRequestId: "npc-ai-dialogue-request-3",
        displayPages: [],
        currentDisplayPageIndex: 0,
        options: [],
        customInputOpen: false,
        statusNotice: "正在组织下一句回话……",
        errorNotice: "上一次请求已中断，可重新尝试。",
      },
    },
    targetName: "茶博士",
  });

  assert.match(markup, /data-npc-dialogue-streaming="true"/u);
  assert.match(markup, /正在组织下一句回话/u);
  assert.match(markup, /上一次请求已中断，可重新尝试/u);
  assert.equal(
    (markup.match(/data-npc-action="select-option"/gu) ?? []).length,
    0
  );
});

test("inline dialogue panel stays in the house shell footer instead of the standalone overlay", () => {
  const { renderNpcInteractionDialoguePanel } = loadInlineDialoguePanel();

  const markup = renderNpcInteractionDialoguePanel({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        status: "awaiting-choice",
        currentDisplayPageIndex: 1,
      },
    },
    targetName: "茶博士",
    inlineHouseMode: true,
  });

  assert.match(markup, /data-house-npc-dialogue="inline"/u);
  assert.doesNotMatch(markup, /role="dialog"[\s\S]*data-npc-menu="interaction"/u);
});

test("inline dialogue panel keeps its own exit button separate from the house leave button class", () => {
  const { renderNpcInteractionDialoguePanel } = loadInlineDialoguePanel();

  const markup = renderNpcInteractionDialoguePanel({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        status: "awaiting-choice",
        currentDisplayPageIndex: 1,
      },
    },
    targetName: "茶博士",
    inlineHouseMode: true,
  });

  assert.match(markup, /data-npc-action="close"/u);
  assert.match(markup, /c-npc-interaction-exit/u);
  assert.doesNotMatch(
    markup,
    /class="[^"]*c-grain-shop-leave[^"]*c-npc-interaction-exit[^"]*"/u
  );
});

test("inline dialogue panel can surface a separate house leave button while keeping the close-dialogue button", () => {
  const { renderNpcInteractionDialoguePanel } = loadInlineDialoguePanel();

  const markup = renderNpcInteractionDialoguePanel({
    session: {
      ...createDialogueSession(),
      dialogue: {
        ...createDialogueSession().dialogue,
        status: "awaiting-choice",
        currentDisplayPageIndex: 1,
      },
    },
    targetName: "茶博士",
    inlineHouseMode: true,
    inlineHouseLeaveAction: {
      id: "leave-house",
      label: "离开茶馆",
    },
  });

  assert.match(markup, /c-npc-interaction-inline-footer-actions/u);
  assert.match(markup, /c-npc-interaction-leave-house/u);
  assert.match(markup, /data-action="leave-house"/u);
  assert.match(markup, /离开茶馆/u);
  assert.match(markup, /data-npc-action="close"/u);
});
