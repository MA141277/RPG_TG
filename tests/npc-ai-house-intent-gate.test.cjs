const test = require("node:test");
const assert = require("node:assert/strict");

function createHouseRequest(overrides = {}) {
  return {
    requestId: "npc-ai-house-intent-gate-request-1",
    system: "base dialogue system",
    messages: [
      {
        role: "user",
        content: [
          "当前地点：测试货栈",
          "当前玩家：朱元璋",
          "当前NPC：钱掌柜",
          "当前对话双方：朱元璋 与 钱掌柜",
        ].join("\n"),
      },
      {
        role: "user",
        content:
          overrides.customInputText ??
          overrides.selectedOptionLabel ??
          "继续",
      },
    ],
    metadata: {
      contextType: "house",
      npcId: "char.test.npc",
      npcName: "钱掌柜",
      inputType: "custom_input",
      houseId: "house.kulan.market",
      placeName: "测试货栈",
      customInputText: "继续",
      houseConversationCapabilitySnapshot: {
        cityId: "city.kulan",
        houseId: "house.kulan.market",
        moduleId: "market-house",
        targetCharacterId: "char.test.npc",
        targetCharacterName: "钱掌柜",
        switchableNpcTargets: [
          {
            characterId: "char.test.npc",
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
        houseServices: [
          {
            serviceId: "market-buy",
            label: "买货",
            description: "直接根据自然语言结算买货。",
            enabled: true,
          },
        ],
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
            targetCharacterId: "char.abbot",
          },
        ],
      },
      ...overrides,
    },
  };
}

test("house intent gate parses a direct chat decision", () => {
  const {
    resolveHouseConversationIntentGateDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  assert.deepEqual(
    resolveHouseConversationIntentGateDecision({
      rawText: "[INTENT: chat]",
      request: createHouseRequest({ customInputText: "最近生意怎么样" }),
    }),
    {
      decision: {
        kind: "chat",
      },
    }
  );
});

test("house intent gate parses a direct clarify decision", () => {
  const {
    resolveHouseConversationIntentGateDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  assert.deepEqual(
    resolveHouseConversationIntentGateDecision({
      rawText: "[INTENT: clarify]",
      request: createHouseRequest({ customInputText: "我想买点东西" }),
    }),
    {
      decision: {
        kind: "clarify",
      },
    }
  );
});

test("house intent gate parses and validates a legal route decision", () => {
  const {
    resolveHouseConversationIntentGateDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  assert.deepEqual(
    resolveHouseConversationIntentGateDecision({
      rawText: "[INTENT: route|go-to-house|house.kulan.grain_shop]",
      request: createHouseRequest({ customInputText: "我去粮铺一趟" }),
    }),
    {
      decision: {
        kind: "route",
        route: {
          kind: "go-to-house",
          houseId: "house.kulan.grain_shop",
        },
      },
    }
  );
});

test("house intent gate rejects an illegal route target outside the current snapshot", () => {
  const {
    resolveHouseConversationIntentGateDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  assert.match(
    resolveHouseConversationIntentGateDecision({
      rawText: "[INTENT: route|go-to-house|house.kulan.keep]",
      request: createHouseRequest({ customInputText: "我去帅府" }),
    }).issue,
    /当前合法的室内能力快照/u
  );
});

test("house chat and clarify response prompts forbid direct handoff markers and stay inside one visible choice loop", () => {
  const {
    buildHouseConversationChatResponseRequest,
    buildHouseConversationClarifyResponseRequest,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  for (const buildRequest of [
    buildHouseConversationChatResponseRequest,
    buildHouseConversationClarifyResponseRequest,
  ]) {
    const request = buildRequest(
      createHouseRequest({ customInputText: "我想买点东西" })
    );
    const promptText = [
      request.system,
      ...request.messages.map((message) => message.content),
    ].join("\n");

    assert.match(promptText, /\[DIALOGUE\]/u);
    assert.match(promptText, /\[CHOICE\]/u);
    assert.match(promptText, /恰好 3 个 \[OPTION\]/u);
    assert.match(promptText, /禁止输出 \[ACTION\]/u);
    assert.match(promptText, /禁止输出 .*?\[ROUTE\]/u);
    assert.match(promptText, /一个可见选择循环/u);
  }
});
