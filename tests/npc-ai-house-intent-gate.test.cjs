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

test("house intent gate unwraps quoted, fenced, and JSON-encoded markers before validating them", () => {
  const {
    resolveHouseConversationIntentGateDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  const chatRequest = createHouseRequest({ customInputText: "最近生意怎么样" });
  const leaveRequest = createHouseRequest({ customInputText: "我先走了" });

  assert.deepEqual(
    resolveHouseConversationIntentGateDecision({
      rawText: '"[INTENT: chat]"',
      request: chatRequest,
    }),
    {
      decision: {
        kind: "chat",
      },
    }
  );

  assert.deepEqual(
    resolveHouseConversationIntentGateDecision({
      rawText: "```text\n[INTENT: route|leave-house]\n```",
      request: leaveRequest,
    }),
    {
      decision: {
        kind: "route",
        route: {
          kind: "leave-house",
        },
      },
    }
  );

  assert.deepEqual(
    resolveHouseConversationIntentGateDecision({
      rawText: '{"intent":"clarify"}',
      request: createHouseRequest({ customInputText: "我想买点东西" }),
    }),
    {
      decision: {
        kind: "clarify",
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

test("house intent gate rejects extra prose around the approved marker", () => {
  const {
    resolveHouseConversationIntentGateDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  assert.match(
    resolveHouseConversationIntentGateDecision({
      rawText: "好的，我来判断：[INTENT: chat]",
      request: createHouseRequest({ customInputText: "最近生意怎么样" }),
    }).issue,
    /只能输出 1 个完整的 \[INTENT: \.\.\.\] 标记/u
  );
});

test("house intent gate rejects route decisions with surplus pipe fields", () => {
  const {
    resolveHouseConversationIntentGateDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  assert.match(
    resolveHouseConversationIntentGateDecision({
      rawText: "[INTENT: route|leave-house|unexpected]",
      request: createHouseRequest({ customInputText: "我先走了" }),
    }).issue,
    /格式或参数不正确/u
  );

  assert.match(
    resolveHouseConversationIntentGateDecision({
      rawText: "[INTENT: route|go-to-house|house.kulan.grain_shop|extra]",
      request: createHouseRequest({ customInputText: "我去粮铺一趟" }),
    }).issue,
    /格式或参数不正确/u
  );
});

test("house intent gate rejects route decisions with empty pipe segments", () => {
  const {
    resolveHouseConversationIntentGateDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  for (const rawText of [
    "[INTENT: route|leave-house|]",
    "[INTENT: route||leave-house]",
    "[INTENT: route|go-to-house|house.kulan.grain_shop|]",
  ]) {
    assert.match(
      resolveHouseConversationIntentGateDecision({
        rawText,
        request: createHouseRequest({ customInputText: "我去粮铺一趟" }),
      }).issue,
      /格式或参数不正确/u
    );
  }
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

test("house intent gate request strongly constrains the model to output one machine-readable marker and to prefer route over clarify when intent is explicit", () => {
  const {
    buildHouseConversationIntentGateRequest,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  const request = buildHouseConversationIntentGateRequest(
    createHouseRequest({ customInputText: "我想买点东西" })
  );
  const promptText = [request.system, ...request.messages.map((message) => message.content)].join("\n");

  assert.match(promptText, /这一阶段不是 NPC 对话/u);
  assert.match(promptText, /输出必须只有一行/u);
  assert.match(promptText, /首字符必须是 \[/u);
  assert.match(promptText, /末字符必须是 \]/u);
  assert.match(promptText, /route 的 id 只能从当前允许列表里原样拷贝/u);
  assert.match(promptText, /如果玩家已明确说出要办的事.*不得输出 clarify/u);
});

test("house deterministic local intent resolver can recover clear service, travel, target-switch, and leave intents after the AI gate fails", () => {
  const {
    resolveDeterministicHouseConversationIntentDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  assert.deepEqual(
    resolveDeterministicHouseConversationIntentDecision(
      createHouseRequest({ customInputText: "我想买点东西" })
    ),
    {
      kind: "route",
      route: {
        kind: "settle-house-service",
        serviceId: "market-buy",
        rawPlayerText: "我想买点东西",
      },
    }
  );

  assert.deepEqual(
    resolveDeterministicHouseConversationIntentDecision(
      createHouseRequest({ customInputText: "我去粮铺一趟" })
    ),
    {
      kind: "route",
      route: {
        kind: "go-to-house",
        houseId: "house.kulan.grain_shop",
      },
    }
  );

  assert.deepEqual(
    resolveDeterministicHouseConversationIntentDecision(
      createHouseRequest({ customInputText: "我找孙药商聊聊" })
    ),
    {
      kind: "route",
      route: {
        kind: "switch-target-npc",
        characterId: "char.kulan_apothecary",
      },
    }
  );

  assert.deepEqual(
    resolveDeterministicHouseConversationIntentDecision(
      createHouseRequest({ customInputText: "我先走了" })
    ),
    {
      kind: "route",
      route: {
        kind: "leave-house",
      },
    }
  );

  assert.deepEqual(
    resolveDeterministicHouseConversationIntentDecision({
      ...createHouseRequest({
        customInputText: "我想来几局短局牌",
      }),
      messages: [
        {
          role: "user",
          content: [
            "当前地点：测试酒馆",
            "当前玩家：朱元璋",
            "当前NPC：酒馆掌柜",
            "当前对话双方：朱元璋 与 酒馆掌柜",
          ].join("\n"),
        },
        {
          role: "user",
          content: "我想来几局短局牌",
        },
      ],
      metadata: {
        ...createHouseRequest({
          customInputText: "我想来几局短局牌",
        }).metadata,
        npcId: "char.test.tavern_boss",
        npcName: "酒馆掌柜",
        houseId: "house.test.tavern",
        placeName: "测试酒馆",
        customInputText: "我想来几局短局牌",
        houseConversationCapabilitySnapshot: {
          cityId: "city.test",
          houseId: "house.test.tavern",
          moduleId: "tavern",
          targetCharacterId: "char.test.tavern_boss",
          targetCharacterName: "酒馆掌柜",
          switchableNpcTargets: [
            {
              characterId: "char.test.tavern_boss",
              characterName: "酒馆掌柜",
              available: true,
            },
          ],
          houseActions: [
            {
              actionId: "open-gamble",
              label: "赌博",
              available: true,
            },
          ],
          houseServices: [
            {
              serviceId: "tavern-gamble",
              label: "开赌局",
              description: "打开酒馆赌局选择与下注流程。",
              enabled: true,
            },
          ],
          reachableHouses: [],
          leaveAction: {
            actionId: "leave-house",
            label: "离开酒馆",
            available: true,
          },
          negotiableStoryNodes: [],
        },
      },
    }),
    {
      kind: "route",
      route: {
        kind: "settle-house-service",
        serviceId: "tavern-gamble",
        rawPlayerText: "我想来几局短局牌",
      },
    }
  );
});

test("house deterministic local intent resolver leaves ordinary small talk unresolved so the AI gate can judge it", () => {
  const {
    resolveDeterministicHouseConversationIntentDecision,
  } = require("../.test-dist/application/npc-interaction/npc-ai-house-intent-gate.js");

  assert.equal(
    resolveDeterministicHouseConversationIntentDecision(
      createHouseRequest({ customInputText: "最近生意如何" })
    ),
    null
  );
});
