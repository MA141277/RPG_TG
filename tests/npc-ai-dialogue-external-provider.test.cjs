const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function createSseResponse(chunks) {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        chunks.forEach((chunk) => {
          controller.enqueue(encoder.encode(chunk));
        });
        controller.close();
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
      },
    }
  );
}

function createProviderRequest(overrides = {}) {
  return {
    requestId: "npc-ai-dialogue-request-1",
    system: "test-system",
    messages: [{ role: "user", content: "开始和这个人交谈。" }],
    metadata: {
      contextType: "house",
      npcId: "char.test.npc",
      npcName: "茶博士",
      inputType: "start_talk",
      houseId: "house.test.tea",
      placeName: "测试茶馆",
    },
    ...overrides,
  };
}

function createRecordingLocalStorage() {
  const writes = [];

  return {
    writes,
    storage: {
      getItem() {
        return null;
      },
      setItem(key, value) {
        writes.push({ key, value });
      },
    },
  };
}

test("external NPC AI provider source reserves zip-inspired SSE config and browser-side override seams", () => {
  const source = fs.readFileSync(
    "src/application/npc-interaction/external-npc-ai-dialogue-provider.ts",
    "utf8"
  );

  assert.match(source, /openai-compatible/u);
  assert.match(source, /structured-sse/u);
  assert.match(source, /zip-visual-session/u);
  assert.match(source, /rpg_tg\.npc_ai\.provider/u);
  assert.match(source, /__RPG_TG_NPC_AI_CONFIG__/u);
});

test("configured NPC AI provider falls back to the local placeholder provider when no external config is present", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  let fallbackCalled = false;
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fallbackProvider: {
      async stream(_request, onEvent) {
        fallbackCalled = true;
        await onEvent({
          type: "complete",
          requestId: "npc-ai-dialogue-request-1",
          rawText: `[DIALOGUE: char.test.npc,茶博士,"这是占位回应。"]`,
          allSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.npc",
              speakerName: "茶博士",
              text: "这是占位回应。",
            },
          ],
        });
      },
    },
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.equal(fallbackCalled, true);
  assert.equal(events.length, 1);
  assert.equal(events[0].type, "complete");
});

test("configured NPC AI provider can consume zip-style visual action SSE responses through a configurable backend adapter", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "zip-visual-session",
        baseUrl: "https://example.com/backend/",
        sessionId: "visual-session-42",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (url, init) => {
      fetchCalls.push({
        url,
        method: init?.method,
        headers: Object.fromEntries(new Headers(init?.headers).entries()),
        body: init?.body == null ? null : JSON.parse(init.body),
      });

      return createSseResponse([
        `data: ${JSON.stringify({
          type: "start",
          message: "Starting narrative generation...",
          action: "开始和茶博士交谈",
        })}\n\n`,
        `data: ${JSON.stringify({
          type: "step",
          stepIndex: 0,
          step: {
            type: "dialogue",
            speakerId: "char.test.npc",
            speakerName: "茶博士",
            text: "客官今日想聊哪一桩？",
          },
        })}\n\n`,
        `data: ${JSON.stringify({
          type: "data",
          success: true,
          response: `[DIALOGUE: char.test.npc,茶博士,"客官今日想聊哪一桩？"]`,
          narrativeSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.npc",
              speakerName: "茶博士",
              text: "客官今日想聊哪一桩？",
            },
            {
              type: "choice",
              prompt: "你想怎么接话？",
              options: [
                {
                  id: "option.ask_town",
                  label: "问城里近况",
                  actionText: "问城里近况",
                  recommended: true,
                },
                {
                  id: "option.ask_road",
                  label: "问路上见闻",
                  actionText: "问路上见闻",
                },
                {
                  id: "option.ask_people",
                  label: "问近来人物",
                  actionText: "问近来人物",
                },
              ],
            },
          ],
        })}\n\n`,
        "event: done\ndata: {\"success\":true}\n\n",
      ]);
    },
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.equal(fetchCalls.length, 1);
  assert.equal(
    fetchCalls[0].url,
    "https://example.com/backend/api/visual/session/visual-session-42/action/stream"
  );
  assert.equal(fetchCalls[0].method, "POST");
  assert.equal(
    fetchCalls[0].headers.authorization,
    "Bearer secret-token"
  );
  assert.deepEqual(fetchCalls[0].body, {
    action: "开始和茶博士交谈",
  });

  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "step", "complete"]
  );
  assert.equal(events[1].step.text, "客官今日想聊哪一桩？");
  assert.equal(events[2].allSteps.length, 2);
});

test("external NPC AI provider normalizes zip-style response and options payloads into dialogue steps", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "zip-visual-session",
        baseUrl: "https://example.com/backend",
        sessionId: "visual-session-99",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async () =>
      createSseResponse([
        `data: ${JSON.stringify({
          type: "start",
        })}\n\n`,
        `data: ${JSON.stringify({
          type: "data",
          success: true,
          response: "茶博士压低声音道：这几日城里风声不稳。",
          options: [
            {
              id: "action_1",
              text: "问城里近况",
              isMain: true,
            },
            {
              id: "action_2",
              text: "问路上见闻",
            },
            {
              id: "action_3",
              text: "问近来人物",
            },
          ],
        })}\n\n`,
        "event: done\ndata: {\"success\":true}\n\n",
      ]),
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.equal(events[1].allSteps.length, 2);
  assert.deepEqual(events[1].allSteps[0], {
    type: "dialogue",
    speakerId: "char.test.npc",
    speakerName: "茶博士",
    text: "茶博士压低声音道：这几日城里风声不稳。",
  });
  assert.deepEqual(events[1].allSteps[1], {
    type: "choice",
    prompt: "你想怎么接话？",
    options: [
      {
        id: "action_1",
        label: "问城里近况",
        actionText: "问城里近况",
        kind: "main",
        recommended: true,
      },
      {
        id: "action_2",
        label: "问路上见闻",
        actionText: "问路上见闻",
      },
      {
        id: "action_3",
        label: "问近来人物",
        actionText: "问近来人物",
      },
    ],
  });
});

test("external NPC AI provider can call OpenAI-compatible chat completions and normalize marker content into dialogue steps", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
        stream: false,
        temperature: 0.4,
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (url, init) => {
      fetchCalls.push({
        url,
        method: init?.method,
        headers: Object.fromEntries(new Headers(init?.headers).entries()),
        body: init?.body == null ? null : JSON.parse(init.body),
      });

      return new Response(
        JSON.stringify({
          id: "chatcmpl-test-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.npc,茶博士,"这几日城里风声紧得很，你想先问哪一头？"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: option.ask_town|问城里近况|问城里近况|main|true]",
                  "[OPTION: option.ask_road|问路上见闻|问路上见闻|main|false]",
                  "[OPTION: option.ask_people|问近来人物|问近来人物|main|false]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.equal(fetchCalls.length, 1);
  assert.equal(
    fetchCalls[0].url,
    "https://example.com/proxy/v1/chat/completions"
  );
  assert.equal(fetchCalls[0].method, "POST");
  assert.equal(
    fetchCalls[0].headers.authorization,
    "Bearer secret-token"
  );
  assert.deepEqual(fetchCalls[0].body, {
    model: "deepseek-v3.1",
    stream: false,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: "test-system",
      },
      {
        role: "user",
        content: "开始和这个人交谈。",
      },
    ],
  });

  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.equal(events[1].allSteps.length, 2);
  assert.deepEqual(events[1].allSteps[0], {
    type: "dialogue",
    speakerId: "char.test.npc",
    speakerName: "茶博士",
    text: "这几日城里风声紧得很，你想先问哪一头？",
  });
  assert.equal(events[1].allSteps[1].type, "choice");
  assert.equal(events[1].allSteps[1].options.length, 3);
  assert.equal(events[1].allSteps[1].options[0].recommended, true);
});

test("external NPC AI provider can normalize proxy wrapper JSON without leaking logs into the dialogue output", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
        stream: false,
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async () =>
      new Response(
        JSON.stringify({
          response:
            `[DIALOGUE: char.test.npc,茶博士,"柜上的新货刚到，若要买布，我现在就能替你开单。"]`,
          options: [
            {
              id: "option.look_goods",
              label: "先看看货色",
              actionText: "先让我看看货色。",
              kind: "neutral",
              recommended: true,
            },
            {
              id: "option.buy_cloth",
              label: "直接谈布匹",
              actionText: "给我来一匹布。",
              kind: "benevolent",
            },
            {
              id: "option.leave",
              label: "改日再来",
              actionText: "我再想想，晚些再来。",
              kind: "hostile",
            },
          ],
          logs: [
            {
              stage: "trace",
              message: "internal debug payload should never surface",
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.equal(
    events[1].rawText,
    `[DIALOGUE: char.test.npc,茶博士,"柜上的新货刚到，若要买布，我现在就能替你开单。"]`
  );
  assert.equal(events[1].allSteps.length, 2);
  assert.equal(events[1].allSteps[1].type, "choice");
  assert.deepEqual(
    events[1].allSteps[1].options.map((option) => option.actionText),
    ["先让我看看货色。", "给我来一匹布。", "我再想想，晚些再来。"]
  );
  assert.doesNotMatch(
    JSON.stringify(events[1].allSteps),
    /internal debug payload|logs/u
  );
});

test("external NPC AI provider rewrites shorthand internal speaker markers back to the active NPC identity", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async () =>
      new Response(
        JSON.stringify({
          id: "chatcmpl-test-qian-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: QIAN_ZHANGGUI,"这几日货路不太平，你想先打听哪一头？"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: option.ask_goods|问货路|问货路|benevolent|true]",
                  "[OPTION: option.ask_city|问城里行情|问城里行情|neutral|false]",
                  "[OPTION: option.ask_rivals|问同行消息|问同行消息|hostile|false]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      messages: [{ role: "user", content: "开始和钱掌柜交谈。" }],
      metadata: {
        contextType: "house",
        npcId: "char.kulan_merchant",
        npcName: "钱掌柜",
        inputType: "start_talk",
        houseId: "house.kulan.market",
        placeName: "测试货栈",
      },
    }),
    (event) => {
      events.push(event);
    }
  );

  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.deepEqual(events[1].allSteps[0], {
    type: "dialogue",
    speakerId: "char.kulan_merchant",
    speakerName: "钱掌柜",
    text: "这几日货路不太平，你想先打听哪一头？",
  });
});

test("external NPC AI provider retries once when the model returns fewer than three reply options", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      if (fetchCalls.length === 1) {
        return new Response(
          JSON.stringify({
            id: "chatcmpl-invalid-1",
            object: "chat.completion",
            model: "deepseek-v3.1",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: {
                  role: "assistant",
                  content: [
                    `[DIALOGUE: char.test.npc,茶博士,"这几日城里风声紧得很，你想先问哪一头？"]`,
                    "[CHOICE: 你想怎么接话？]",
                    "[OPTION: option.ask_town|问城里近况|问城里近况|benevolent|true]",
                    "[OPTION: option.ask_road|问路上见闻|问路上见闻|neutral|false]",
                    "[END_CHOICE]",
                  ].join("\n"),
                },
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          id: "chatcmpl-fixed-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.npc,茶博士,"这几日城里风声紧得很，你想先问哪一头？"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: option.ask_town|问城里近况|问城里近况|benevolent|true]",
                  "[OPTION: option.ask_road|问路上见闻|问路上见闻|neutral|false]",
                  "[OPTION: option.ask_people|问近来人物|问近来人物|hostile|false]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.equal(fetchCalls.length, 2);
  assert.equal(fetchCalls[0].model, "deepseek-v3.1");
  assert.equal(fetchCalls[1].model, "deepseek-v3.1");
  assert.match(fetchCalls[1].messages[2].content, /上一次回复格式不合法/u);
  assert.match(fetchCalls[1].messages[2].content, /恰好 3 个 OPTION/u);
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.equal(events[1].allSteps[1].type, "choice");
  assert.equal(events[1].allSteps[1].options.length, 3);
});

test("external NPC AI provider runs a dedicated AI action-routing pass before generating the transition line for an explicit buy-goods request", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      if (fetchCalls.length === 1) {
        return new Response(
          JSON.stringify({
            id: "chatcmpl-route-1",
            object: "chat.completion",
            model: "deepseek-v3.1",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: {
                  role: "assistant",
                  content: "[ACTION: buy-goods]",
                },
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          id: "chatcmpl-transition-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content:
                  '[DIALOGUE: char.test.npc,钱掌柜,"既然客官是来买货的，我这就把柜上的现货给你展开。"]',
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      system: "test-system",
      messages: [
        {
          role: "user",
          content: [
            "当前地点：测试货栈",
            "当前玩家：朱重八",
            "当前NPC：钱掌柜",
            "当前对话双方：朱重八 与 钱掌柜",
            "当前可直接办理的功能（只有这些才能跳转）：",
            "buy-goods：买入货物",
            "investigate-market：调查行情",
          ].join("\n"),
        },
        {
          role: "user",
          content: "我想买点货",
        },
      ],
      metadata: {
        contextType: "house",
        npcId: "char.test.npc",
        npcName: "钱掌柜",
        inputType: "custom_input",
        houseId: "house.test.market",
        placeName: "测试货栈",
        customInputText: "我想买点货",
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
      },
    }),
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 2);
  assert.match(
    fetchCalls[0].messages.map((message) => message.content).join("\n"),
    /\[ACTION:\s*none\]/u
  );
  assert.match(
    fetchCalls[1].messages.map((message) => message.content).join("\n"),
    /buy-goods/u
  );
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.deepEqual(events[1].allSteps, [
    {
      type: "dialogue",
      speakerId: "char.test.npc",
      speakerName: "钱掌柜",
      text: "既然客官是来买货的，我这就把柜上的现货给你展开。",
    },
    {
      type: "action",
      actionId: "buy-goods",
    },
  ]);
});

test("external NPC AI provider collapses placeholder option labels down to the direct spoken reply text", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async () =>
      new Response(
        JSON.stringify({
          id: "chatcmpl-label-fix-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.npc,茶博士,"客官今日想聊哪一桩？"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: option.ask_town|善意回应|好啊，那你先说说城里近况。|benevolent|true]",
                  "[OPTION: option.ask_road|Option 2|路上见闻也行，你慢慢说。|neutral|false]",
                  "[OPTION: option.ask_people|Hostile reply|少绕弯子，直接讲你知道的人物消息。|hostile|false]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.equal(events[1].allSteps[1].type, "choice");
  assert.deepEqual(
    events[1].allSteps[1].options.map((option) => ({
      label: option.label,
      actionText: option.actionText,
    })),
    [
      {
        label: "好啊，那你先说说城里近况。",
        actionText: "好啊，那你先说说城里近况。",
      },
      {
        label: "路上见闻也行，你慢慢说。",
        actionText: "路上见闻也行，你慢慢说。",
      },
      {
        label: "少绕弯子，直接讲你知道的人物消息。",
        actionText: "少绕弯子，直接讲你知道的人物消息。",
      },
    ]
  );
});

test("external NPC AI provider retries when the model returns stance placeholders instead of direct spoken Chinese reply text", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      if (fetchCalls.length === 1) {
        return new Response(
          JSON.stringify({
            id: "chatcmpl-placeholder-1",
            object: "chat.completion",
            model: "deepseek-v3.1",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: {
                  role: "assistant",
                  content: [
                    `[DIALOGUE: char.test.npc,茶博士,"客官今日想聊哪一桩？"]`,
                    "[CHOICE: 你想怎么接话？]",
                    "[OPTION: option.ask_town|benevolent|benevolent|benevolent|true]",
                    "[OPTION: option.ask_road|neutral|neutral|neutral|false]",
                    "[OPTION: option.ask_people|hostile|hostile|hostile|false]",
                    "[END_CHOICE]",
                  ].join("\n"),
                },
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          id: "chatcmpl-placeholder-fixed-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.npc,茶博士,"客官今日想聊哪一桩？"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: option.ask_town|先说说城里近况。|先说说城里近况。|benevolent|true]",
                  "[OPTION: option.ask_road|那你讲讲路上的见闻。|那你讲讲路上的见闻。|neutral|false]",
                  "[OPTION: option.ask_people|直接告诉我最近有哪些人物消息。|直接告诉我最近有哪些人物消息。|hostile|false]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.equal(fetchCalls.length, 2);
  assert.match(fetchCalls[1].messages[2].content, /上一次回复格式不合法/u);
  assert.match(fetchCalls[1].messages[2].content, /直接说出口的中文台词/u);
  assert.match(fetchCalls[1].messages[2].content, /benevolent/u);
  assert.equal(events[1].allSteps[1].type, "choice");
  assert.deepEqual(
    events[1].allSteps[1].options.map((option) => option.actionText),
    [
      "先说说城里近况。",
      "那你讲讲路上的见闻。",
      "直接告诉我最近有哪些人物消息。",
    ]
  );
});

test("external NPC AI provider surfaces a choice-specific error message and records local diagnostics when malformed CHOICE payloads keep failing repair", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const { writes, storage } = createRecordingLocalStorage();
  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: storage,
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      return new Response(
        JSON.stringify({
          id: `chatcmpl-choice-bad-${fetchCalls.length}`,
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.npc,茶博士,"客官今日想聊哪一桩？"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: option.ask_town|先说说城里近况。|先说说城里近况。|benevolent|true]",
                  "[OPTION: option.ask_road|那你讲讲路上的见闻。|那你讲讲路上的见闻。|neutral|false]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.equal(fetchCalls.length, 2);
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "error"]
  );
  assert.equal(
    events[1].message,
    "NPC AI 对话选项格式不正确，请稍后重试。"
  );
  assert.equal(writes.length > 0, true);
  const recordedLogs = JSON.parse(writes[writes.length - 1].value);
  assert.equal(Array.isArray(recordedLogs), true);
  assert.equal(
    recordedLogs.some(
      (entry) =>
        entry.category === "choice" &&
        /必须返回恰好 3 个 OPTION/u.test(entry.issue) &&
        /option\.ask_town/u.test(entry.rawText ?? "")
    ),
    true
  );
});

test("external NPC AI provider falls back to a local transition lead-in when action handoff output omits the lead-in dialogue", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      if (fetchCalls.length === 1) {
        return new Response(
          JSON.stringify({
            id: "chatcmpl-action-route-1",
            object: "chat.completion",
            model: "deepseek-v3.1",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: {
                  role: "assistant",
                  content: "[ACTION: buy-goods]",
                },
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          id: `chatcmpl-action-transition-bad-${fetchCalls.length}`,
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: "[ACTION: buy-goods]",
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      metadata: {
        contextType: "house",
        npcId: "char.test.npc",
        npcName: "钱掌柜",
        inputType: "custom_input",
        houseId: "house.test.market",
        placeName: "测试货栈",
        customInputText: "我想买点货",
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
      },
      messages: [
        {
          role: "user",
          content: [
            "当前地点：测试货栈",
            "当前玩家：朱重八",
            "当前NPC：钱掌柜",
            "当前对话双方：朱重八 与 钱掌柜",
          ].join("\n"),
        },
        {
          role: "user",
          content: "我想买点货",
        },
      ],
    }),
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 2);
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.deepEqual(events[1].allSteps, [
    {
      type: "dialogue",
      speakerId: "char.test.npc",
      speakerName: "钱掌柜",
      text: "行，这就替你张罗。",
    },
    {
      type: "action",
      actionId: "buy-goods",
    },
  ]);
});

test("external NPC AI provider falls back to a local transition lead-in when a house service handoff response omits the lead-in dialogue", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      if (fetchCalls.length === 1) {
        return new Response(
          JSON.stringify({
            id: "chatcmpl-house-service-route-1",
            object: "chat.completion",
            model: "deepseek-v3.1",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: {
                  role: "assistant",
                  content: "[INTENT: route|settle-house-service|tavern-gamble]",
                },
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          id: "chatcmpl-house-service-transition-bad-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: "[ROUTE: settle-house-service|tavern-gamble]",
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      messages: [
        {
          role: "user",
          content: [
            "当前地点：测试酒馆",
            "当前玩家：朱重八",
            "当前NPC：酒馆掌柜",
            "当前对话双方：朱重八 与 酒馆掌柜",
            "当前可直接办理的功能（只有这些才能跳转）：",
            "open-gamble：赌博",
            "当前可直接办理的语义服务：",
            "tavern-gamble：开赌局",
          ].join("\n"),
        },
        {
          role: "user",
          content: "我想玩几句短局",
        },
      ],
      metadata: {
        contextType: "house",
        npcId: "char.test.tavern_boss",
        npcName: "酒馆掌柜",
        inputType: "custom_input",
        houseId: "house.test.tavern",
        placeName: "测试酒馆",
        customInputText: "我想玩几句短局",
        availableSpecialActions: [
          {
            id: "open-gamble",
            label: "赌博",
          },
        ],
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
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 2);
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.deepEqual(events[1].allSteps, [
    {
      type: "dialogue",
      speakerId: "char.test.tavern_boss",
      speakerName: "酒馆掌柜",
      text: "行，这就替你张罗。",
    },
    {
      type: "route",
      route: {
        kind: "settle-house-service",
        serviceId: "tavern-gamble",
        rawPlayerText: "我想玩几句短局",
      },
    },
  ]);
});

test("external NPC AI provider clarifies ambiguous house intent instead of guessing a route", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      if (fetchCalls.length === 1) {
        return new Response(
          JSON.stringify({
            id: "chatcmpl-house-clarify-gate-1",
            object: "chat.completion",
            model: "deepseek-v3.1",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: {
                  role: "assistant",
                  content: "[INTENT: clarify]",
                },
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          id: "chatcmpl-house-clarify-response-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.tavern_boss,酒馆掌柜,"成，你是想开赌局，还是先问问规矩与玩法？"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: option.ask_rules|先说说规矩。|先说说规矩。]",
                  "[OPTION: option.open_short|我想先玩几句短局。|我想先玩几句短局。]",
                  "[OPTION: option.leave|那我先看看别的。|那我先看看别的。]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      messages: [
        {
          role: "user",
          content: [
            "当前地点：测试酒馆",
            "当前玩家：朱重八",
            "当前NPC：酒馆掌柜",
            "当前对话双方：朱重八 与 酒馆掌柜",
          ].join("\n"),
        },
        {
          role: "user",
          content: "我想玩点东西",
        },
      ],
      metadata: {
        contextType: "house",
        npcId: "char.test.tavern_boss",
        npcName: "酒馆掌柜",
        inputType: "custom_input",
        houseId: "house.test.tavern",
        placeName: "测试酒馆",
        customInputText: "我想玩点东西",
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
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 2);
  assert.match(
    fetchCalls[0].messages.map((message) => message.content).join("\n"),
    /\[INTENT:\s*clarify\]/u
  );
  assert.match(
    fetchCalls[1].messages.map((message) => message.content).join("\n"),
    /简短的追问/u
  );
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.deepEqual(events[1].allSteps, [
    {
      type: "dialogue",
      speakerId: "char.test.tavern_boss",
      speakerName: "酒馆掌柜",
      text: "成，你是想开赌局，还是先问问规矩与玩法？",
    },
    {
      type: "choice",
      prompt: "你想怎么接话？",
      options: [
        { id: "option.ask_rules", label: "先说说规矩。", actionText: "先说说规矩。" },
        { id: "option.open_short", label: "我想先玩几句短局。", actionText: "我想先玩几句短局。" },
        { id: "option.leave", label: "那我先看看别的。", actionText: "那我先看看别的。" },
      ],
    },
  ]);
});

test("external NPC AI provider keeps house chat intent on the dedicated choice-loop response path", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      return new Response(
        JSON.stringify({
          id: `chatcmpl-house-chat-${fetchCalls.length}`,
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content:
                  fetchCalls.length === 1
                    ? "[INTENT: chat]"
                    : [
                        `[DIALOGUE: char.test.npc,茶博士,"这几日城里风声紧得很，你想先听哪一头？"]`,
                        "[CHOICE: 你想怎么接话？]",
                        "[OPTION: option.ask_town|问城里近况。|问城里近况。]",
                        "[OPTION: option.ask_road|问路上见闻。|问路上见闻。]",
                        "[OPTION: option.ask_people|问人物消息。|问人物消息。]",
                        "[END_CHOICE]",
                      ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      metadata: {
        contextType: "house",
        npcId: "char.test.npc",
        npcName: "茶博士",
        inputType: "select_option",
        houseId: "house.test.tea",
        placeName: "测试茶馆",
        selectedOptionId: "option.ask_town",
        selectedOptionLabel: "问城里近况。",
        houseConversationCapabilitySnapshot: {
          cityId: "city.kulan",
          houseId: "house.test.tea",
          moduleId: "tea-house",
          targetCharacterId: "char.test.npc",
          targetCharacterName: "茶博士",
          switchableNpcTargets: [
            {
              characterId: "char.test.npc",
              characterName: "茶博士",
              available: true,
            },
          ],
          houseActions: [],
          houseServices: [],
          reachableHouses: [],
          leaveAction: {
            actionId: "leave-house",
            label: "离开茶馆",
            available: true,
          },
          negotiableStoryNodes: [],
        },
      },
    }),
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 2);
  assert.match(
    fetchCalls[1].messages.map((message) => message.content).join("\n"),
    /普通聊天/u
  );
  assert.doesNotMatch(JSON.stringify(events[1].allSteps), /"type":"route"|"type":"action"/u);
  assert.equal(events[1].allSteps[1].type, "choice");
});

test("external NPC AI provider rejects ACTION handoff after a chat gate decision", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      return new Response(
        JSON.stringify({
          id: `chatcmpl-house-chat-action-leak-${fetchCalls.length}`,
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content:
                  fetchCalls.length === 1
                    ? "[INTENT: chat]"
                    : [
                        `[DIALOGUE: char.test.tavern_boss,酒馆掌柜,"闲话先放一放，我替你开桌。"]`,
                        "[ACTION: open-gamble]",
                      ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      metadata: {
        contextType: "house",
        npcId: "char.test.tavern_boss",
        npcName: "酒馆掌柜",
        inputType: "select_option",
        houseId: "house.test.tavern",
        placeName: "测试酒馆",
        selectedOptionId: "option.ask_rules",
        selectedOptionLabel: "先说说规矩。",
        availableSpecialActions: [
          {
            id: "open-gamble",
            label: "赌博",
          },
        ],
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
          houseServices: [],
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
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 3);
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "error"]
  );
  assert.equal(
    events[1].message,
    "NPC AI 功能交接格式不正确，请稍后重试。"
  );
});

test("external NPC AI provider rejects ACTION handoff after a clarify gate decision", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      return new Response(
        JSON.stringify({
          id: `chatcmpl-house-clarify-action-leak-${fetchCalls.length}`,
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content:
                  fetchCalls.length === 1
                    ? "[INTENT: clarify]"
                    : [
                        `[DIALOGUE: char.test.tavern_boss,酒馆掌柜,"成，那就替你开桌。"]`,
                        "[ACTION: open-gamble]",
                      ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      metadata: {
        contextType: "house",
        npcId: "char.test.tavern_boss",
        npcName: "酒馆掌柜",
        inputType: "custom_input",
        houseId: "house.test.tavern",
        placeName: "测试酒馆",
        customInputText: "我想玩点东西",
        availableSpecialActions: [
          {
            id: "open-gamble",
            label: "赌博",
          },
        ],
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
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 3);
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "error"]
  );
  assert.equal(
    events[1].message,
    "NPC AI 功能交接格式不正确，请稍后重试。"
  );
});

test("external NPC AI provider fails closed when the house intent gate stays malformed after repair", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      return new Response(
        JSON.stringify({
          id: `chatcmpl-house-gate-bad-${fetchCalls.length}`,
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content:
                  fetchCalls.length === 1
                    ? "我替你想想。"
                    : "[INTENT: route|go-to-house|house.kulan.keep]",
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      metadata: {
        contextType: "house",
        npcId: "char.test.npc",
        npcName: "钱掌柜",
        inputType: "custom_input",
        houseId: "house.test.market",
        placeName: "测试货栈",
        customInputText: "我去帅府一趟",
        houseConversationCapabilitySnapshot: {
          cityId: "city.kulan",
          houseId: "house.test.market",
          moduleId: "market-house",
          targetCharacterId: "char.test.npc",
          targetCharacterName: "钱掌柜",
          switchableNpcTargets: [
            {
              characterId: "char.test.npc",
              characterName: "钱掌柜",
              available: true,
            },
          ],
          houseActions: [],
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
          negotiableStoryNodes: [],
        },
      },
    }),
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 2);
  assert.match(
    fetchCalls[1].messages.map((message) => message.content).join("\n"),
    /格式不合法/u
  );
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "error"]
  );
  assert.match(events[1].message, /室内意图判断/u);
});

test("external NPC AI provider accepts explicit AI action handoff markers when the action id is declared in the current special action list", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async () =>
      new Response(
        JSON.stringify({
          id: "chatcmpl-action-handoff-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.npc,茶博士,"若是想买点货，我便替你把柜上的新货都搬出来。"]`,
                  "[ACTION: buy-goods]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      metadata: {
        contextType: "house",
        npcId: "char.test.npc",
        npcName: "茶博士",
        inputType: "custom_input",
        houseId: "house.test.tea",
        placeName: "测试茶馆",
        customInputText: "我想买点东西",
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
      },
    }),
    (event) => {
      events.push(event);
    }
  );

  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.deepEqual(events[1].allSteps, [
    {
      type: "dialogue",
      speakerId: "char.test.npc",
      speakerName: "茶博士",
      text: "若是想买点货，我便替你把柜上的新货都搬出来。",
    },
    {
      type: "action",
      actionId: "buy-goods",
    },
  ]);
});

test("external NPC AI provider strips four-segment pipe option metadata down to the direct spoken reply text", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async () =>
      new Response(
        JSON.stringify({
          id: "chatcmpl-pipe-option-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.npc,茶博士,"客官今日想聊哪一桩？"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: 1|占位标签|随便看看|neutral]",
                  "[OPTION: 2|第二个标签|问问近况|benevolent]",
                  "[OPTION: 3|第三个标签|直接离开|hostile]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.equal(events[1].allSteps[1].type, "choice");
  assert.deepEqual(
    events[1].allSteps[1].options.map((option) => ({
      label: option.label,
      actionText: option.actionText,
    })),
    [
      {
        label: "随便看看",
        actionText: "随便看看",
      },
      {
        label: "问问近况",
        actionText: "问问近况",
      },
      {
        label: "直接离开",
        actionText: "直接离开",
      },
    ]
  );
});

test("external NPC AI provider times out hung OpenAI-compatible requests instead of leaving the turn pending forever", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  let sawAbort = false;
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
        timeoutMs: 5,
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          sawAbort = init.signal?.aborted === true;
          const abortError = new Error("The operation was aborted.");
          abortError.name = "AbortError";
          reject(abortError);
        });
      }),
  });

  const events = [];
  void provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  await new Promise((resolve) => setTimeout(resolve, 30));

  assert.equal(sawAbort, true);
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "error"]
  );
  assert.match(events[1].message, /超时/u);
});

test("external NPC AI provider retries a fallback model after the preferred OpenAI-compatible model times out", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        fallbackModels: ["deepseek-v3"],
        authToken: "secret-token",
        timeoutMs: 5,
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      if (fetchCalls.length === 1) {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const abortError = new Error("The operation was aborted.");
            abortError.name = "AbortError";
            reject(abortError);
          });
        });
      }

      return new Response(
        JSON.stringify({
          id: "chatcmpl-test-fallback-1",
          object: "chat.completion",
          model: "deepseek-v3",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content: [
                  `[DIALOGUE: char.test.npc,茶博士,"城里风声紧得很，但你既然来了，我先给你讲个开头。"]`,
                  "[CHOICE: 你想怎么接话？]",
                  "[OPTION: option.ask_town|问城里近况|问城里近况|main|true]",
                  "[OPTION: option.ask_road|问路上见闻|问路上见闻|main|false]",
                  "[OPTION: option.ask_people|问近来人物|问近来人物|main|false]",
                  "[END_CHOICE]",
                ].join("\n"),
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(createProviderRequest(), (event) => {
    events.push(event);
  });

  assert.deepEqual(
    fetchCalls.map((call) => call.model),
    ["deepseek-v3.1", "deepseek-v3"]
  );
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.equal(events[1].allSteps[0].text, "城里风声紧得很，但你既然来了，我先给你讲个开头。");
});

test("external NPC AI provider resolves a hidden indoor house-jump route into a transition line plus a route step", async () => {
  const {
    createConfiguredNpcAiDialogueProvider,
  } = require("../.test-dist/application/npc-interaction/external-npc-ai-dialogue-provider.js");

  const fetchCalls = [];
  const provider = createConfiguredNpcAiDialogueProvider({
    globalObject: {
      __RPG_TG_NPC_AI_CONFIG__: {
        mode: "openai-compatible",
        baseUrl: "https://example.com/proxy/",
        model: "deepseek-v3.1",
        authToken: "secret-token",
      },
      localStorage: {
        getItem() {
          return null;
        },
      },
    },
    fetchImplementation: async (_url, init) => {
      const body = init?.body == null ? null : JSON.parse(init.body);
      fetchCalls.push(body);

      if (fetchCalls.length === 1) {
        return new Response(
          JSON.stringify({
            id: "chatcmpl-house-route-1",
            object: "chat.completion",
            model: "deepseek-v3.1",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: {
                  role: "assistant",
                  content: "[INTENT: route|go-to-house|house.kulan.grain_shop]",
                },
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          id: "chatcmpl-house-route-transition-1",
          object: "chat.completion",
          model: "deepseek-v3.1",
          choices: [
            {
              index: 0,
              finish_reason: "stop",
              message: {
                role: "assistant",
                content:
                  '[DIALOGUE: char.test.npc,钱掌柜,"城南粮铺今日正开着门，你若要去看米价，现在过去正好。"]',
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  });

  const events = [];
  await provider.stream(
    createProviderRequest({
      system: "test-system",
      messages: [
        {
          role: "user",
          content: [
            "当前地点：测试货栈",
            "当前玩家：朱元璋",
            "当前NPC：钱掌柜",
            "当前对话双方：朱元璋 与 钱掌柜",
            "当前可前往的地点：",
            "house.kulan.grain_shop：粮铺",
          ].join("\n"),
        },
        {
          role: "user",
          content: "我去粮铺一趟",
        },
      ],
      metadata: {
        contextType: "house",
        npcId: "char.test.npc",
        npcName: "钱掌柜",
        inputType: "custom_input",
        houseId: "house.test.market",
        placeName: "测试货栈",
        customInputText: "我去粮铺一趟",
        houseConversationCapabilitySnapshot: {
          cityId: "city.kulan",
          houseId: "house.test.market",
          moduleId: "market-house",
          targetCharacterId: "char.test.npc",
          targetCharacterName: "钱掌柜",
          switchableNpcTargets: [
            {
              characterId: "char.test.npc",
              characterName: "钱掌柜",
              available: true,
            },
          ],
          houseActions: [],
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
          negotiableStoryNodes: [],
        },
      },
    }),
    (event) => {
      events.push(event);
    }
  );

  assert.equal(fetchCalls.length, 2);
  assert.match(
    fetchCalls[0].messages.map((message) => message.content).join("\n"),
    /\[INTENT:\s*route\|go-to-house\|house\.kulan\.grain_shop\]/u
  );
  assert.match(
    fetchCalls[1].messages.map((message) => message.content).join("\n"),
    /粮铺/u
  );
  assert.deepEqual(
    events.map((event) => event.type),
    ["start", "complete"]
  );
  assert.deepEqual(events[1].allSteps, [
    {
      type: "dialogue",
      speakerId: "char.test.npc",
      speakerName: "钱掌柜",
      text: "城南粮铺今日正开着门，你若要去看米价，现在过去正好。",
    },
    {
      type: "route",
      route: {
        kind: "go-to-house",
        houseId: "house.kulan.grain_shop",
      },
    },
  ]);
});
