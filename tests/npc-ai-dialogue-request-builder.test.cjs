const test = require("node:test");
const assert = require("node:assert/strict");

test("NPC AI dialogue request builder demands exactly three direct spoken reply options with no placeholder labels", () => {
  const {
    buildNpcAiDialogueProviderRequest,
  } = require("../.test-dist/application/npc-interaction/npc-ai-dialogue-request-builder.js");

  const request = buildNpcAiDialogueProviderRequest({
    requestId: "npc-ai-dialogue-request-1",
    contextType: "house",
    npcId: "char.test.npc",
    npcName: "茶博士",
    playerName: "朱重八",
    inputType: "start_talk",
    placeName: "测试茶馆",
    houseId: "house.test.tea",
    availableSpecialActions: [
      {
        id: "buy-goods",
        label: "买入货物",
      },
      {
        id: "investigate-market",
        label: "调查行情",
      },
    ],
  });

  assert.match(request.system, /恰好 3 个 OPTION/u);
  assert.match(request.system, /NARRATION 使用格式/u);
  assert.match(request.system, /按钮文案.*角色实际说法.*完全相同/u);
  assert.match(request.system, /\[ACTION:\s*exact_action_id\]/u);
  assert.match(request.system, /输出 \[ACTION\] 时禁止同时输出 \[CHOICE\]/u);
  assert.match(
    request.system,
    /禁止输出.*善意回应.*中立回应.*恶意回应.*option 1.*英文/u
  );
  assert.match(request.messages[0].content, /当前可直接办理的功能/u);
  assert.match(request.messages[0].content, /buy-goods/u);
  assert.match(request.messages[0].content, /调查行情/u);
  assert.match(request.messages[1].content, /恰好 3 个可选接话/u);
});

test("NPC AI dialogue request builder exposes the hidden indoor route snapshot and summarizes the legal handoff space", () => {
  const {
    buildNpcAiDialogueProviderRequest,
  } = require("../.test-dist/application/npc-interaction/npc-ai-dialogue-request-builder.js");

  const routeSnapshot = {
    cityId: "city.kulan",
    houseId: "house.kulan.market",
    moduleId: "market-house",
    targetCharacterId: "char.kulan_merchant",
    targetCharacterName: "钱掌柜",
    switchableNpcTargets: [
      {
        characterId: "char.kulan_merchant",
        characterName: "钱掌柜",
        available: true,
      },
      {
        characterId: "char.kulan_apothecary",
        characterName: "孙药商",
        available: true,
      },
    ],
    houseActions: [
      {
        actionId: "buy-goods",
        label: "买入货物",
        available: true,
      },
    ],
    houseServices: [],
    reachableHouses: [
      {
        houseId: "house.kulan.grain_shop",
        houseName: "粮铺",
        available: true,
      },
    ],
    leaveAction: {
      actionId: "leave-house",
      label: "离开货栈",
      available: true,
    },
    negotiableStoryNodes: [
      {
        nodeId: "temple.request-early-begging",
        label: "请求提前化缘",
        allowedApproaches: ["plea"],
        targetCharacterId: "char.kulan_temple_abbot",
      },
    ],
  };

  const request = buildNpcAiDialogueProviderRequest({
    requestId: "npc-ai-dialogue-request-2",
    contextType: "house",
    npcId: "char.kulan_merchant",
    npcName: "钱掌柜",
    playerName: "朱元璋",
    inputType: "custom_input",
    placeName: "货栈",
    houseId: "house.kulan.market",
    customInputText: "我去粮铺看看",
    houseConversationCapabilitySnapshot: routeSnapshot,
  });

  assert.match(request.messages[0].content, /当前可切换交谈对象/u);
  assert.match(request.messages[0].content, /孙药商/u);
  assert.match(request.messages[0].content, /当前可直接办理的功能/u);
  assert.match(request.messages[0].content, /买入货物/u);
  assert.match(request.messages[0].content, /当前可前往的地点/u);
  assert.match(request.messages[0].content, /粮铺/u);
  assert.match(request.messages[0].content, /当前可离开方式/u);
  assert.match(request.messages[0].content, /当前可推进的剧情交涉/u);
  assert.equal(
    request.metadata.houseConversationCapabilitySnapshot.reachableHouses[0].houseId,
    "house.kulan.grain_shop"
  );
});

test("NPC AI dialogue request builder includes current indoor state and forbids treating an internal-role player as an outside guest", () => {
  const {
    buildNpcAiDialogueProviderRequest,
  } = require("../.test-dist/application/npc-interaction/npc-ai-dialogue-request-builder.js");

  const request = buildNpcAiDialogueProviderRequest({
    requestId: "npc-ai-dialogue-request-state-1",
    contextType: "house",
    npcId: "char.kulan_temple_abbot",
    npcName: "方丈",
    playerName: "朱元璋",
    inputType: "start_talk",
    placeName: "皇觉寺",
    houseId: "house.kulan.temple",
    houseStateSummary: [
      "场景副题：皇觉寺 / 挂单修行 / 寺中评定",
      "当前面前事务：工作",
      "当前差事：寺内帮忙",
      "寺中贡献：18 / 30",
      "当前周次：第 1 周",
    ].join("\n"),
  });

  assert.match(request.messages[0].content, /当前房内状态/u);
  assert.match(request.messages[0].content, /挂单修行/u);
  assert.match(request.messages[0].content, /当前差事：寺内帮忙/u);
  assert.match(request.messages[0].content, /寺中贡献：18 \/ 30/u);
  assert.match(
    request.messages[1].content,
    /绝不能把玩家称作施主、客官、香客、外来人/u
  );
  assert.match(
    request.messages[1].content,
    /优先围绕这些职责、安排、进度或下一步要做的事发话/u
  );
});

test("NPC AI dialogue start_talk prioritizes the latest same-house related reaction memory when present", () => {
  const {
    buildNpcAiDialogueProviderRequest,
  } = require("../.test-dist/application/npc-interaction/npc-ai-dialogue-request-builder.js");

  const request = buildNpcAiDialogueProviderRequest({
    requestId: "npc-ai-dialogue-request-3",
    contextType: "house",
    npcId: "char.kulan_tavern_boss",
    npcName: "酒馆老板",
    playerName: "朱元璋",
    inputType: "start_talk",
    placeName: "酒馆",
    houseId: "house.kulan.tavern",
    reactionMemoryEntries: [
      {
        id: "reaction-1",
        eventId: "event-1",
        eventType: "tavern:gamble:entered-table",
        houseId: "house.kulan.tavern",
        summary: "他刚在牌桌边坐下看了看。",
      },
      {
        id: "reaction-2",
        eventId: "event-2",
        eventType: "market:trade-buy-success",
        houseId: "house.kulan.market",
        summary: "他刚在货栈里买走了一匹布。",
      },
      {
        id: "reaction-3",
        eventId: "event-2",
        eventType: "tavern:gamble:left-without-playing",
        houseId: "house.kulan.tavern",
        summary: "他刚坐到牌桌边，却没真下场玩就退了回来。",
      },
    ],
  });

  assert.match(
    request.messages[0].content,
    /此人对玩家最近行为的反应记忆（优先开场）/u
  );
  assert.match(
    request.messages[0].content,
    /他刚坐到牌桌边，却没真下场玩就退了回来。/u
  );
  assert.equal(
    request.metadata.latestReactionMemorySummary,
    "他刚坐到牌桌边，却没真下场玩就退了回来。"
  );
  assert.doesNotMatch(
    request.messages[0].content,
    /他刚在货栈里买走了一匹布。/u
  );
  assert.match(
    request.messages[1].content,
    /开场第一句必须先直接回应这条最近行为：他刚坐到牌桌边，却没真下场玩就退了回来。/u
  );
  assert.match(
    request.messages[1].content,
    /必须先围绕第一条最新反应记忆开场/u
  );
});

test("NPC AI dialogue request builder omits the reaction-memory block when no entry belongs to the current house", () => {
  const {
    buildNpcAiDialogueProviderRequest,
  } = require("../.test-dist/application/npc-interaction/npc-ai-dialogue-request-builder.js");

  const request = buildNpcAiDialogueProviderRequest({
    requestId: "npc-ai-dialogue-request-4",
    contextType: "house",
    npcId: "char.kulan_tavern_boss",
    npcName: "酒馆老板",
    playerName: "朱元璋",
    inputType: "start_talk",
    placeName: "酒馆",
    houseId: "house.kulan.tavern",
    reactionMemoryEntries: [
      {
        id: "reaction-1",
        eventId: "event-1",
        eventType: "market:trade-buy-success",
        houseId: "house.kulan.market",
        summary: "他刚在货栈里买走了一匹布。",
      },
    ],
  });

  assert.doesNotMatch(
    request.messages[0].content,
    /此人对玩家最近行为的反应记忆（优先开场）/u
  );
  assert.doesNotMatch(
    request.messages[1].content,
    /必须先围绕第一条最新反应记忆开场/u
  );
});
