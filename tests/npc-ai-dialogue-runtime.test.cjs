const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  openNpcInteraction,
} = require("../.test-dist/application/app-actions.js");
const {
  prototypeCards,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

function createBaseGameState(currentHouseId = "house.test.tea") {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    cards: {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[0]?.id ?? null,
    },
    valuables: {
      items: prototypeValuables,
      selectedItemId: prototypeValuables[0]?.id ?? null,
      equippedWeaponSet: {
        swordId:
          prototypeValuables.find(
            (valuableDefinition) => valuableDefinition.category === "weapon"
          )?.id ?? null,
        armorId:
          prototypeValuables.find(
            (valuableDefinition) => valuableDefinition.category === "armor"
          )?.id ?? null,
      },
    },
    currentView: "house",
  });
}

function createCharacterDefinition(id, name, houseId, title = undefined) {
  return {
    id,
    name,
    birthYear: 1330,
    age: 20,
    cityId: "city.kulan",
    houseId,
    portraitId: `portrait.${id}`,
    stats: {
      leadership: 1,
      martial: 1,
      intelligence: 1,
      politics: 1,
      charm: 1,
      fame: 1,
      gold: 0,
    },
    stamina: 100,
    availableFunctions: [],
    ...(title == null ? {} : { title }),
  };
}

function createBaseAppState() {
  return {
    gameState: createBaseGameState(),
    characterDefinitions: [
      createCharacterDefinition(playerCharacterId, "朱重八", "house.test.tea", "旅人"),
      createCharacterDefinition("char.test.npc", "茶博士", "house.test.tea", "掌柜"),
    ],
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: { facingDegrees: 0, isMoving: false },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityCardDrawTestState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {
      active: false,
      selectedTargetId: null,
      selectedComponentId: null,
      selectedElementId: null,
      backgroundMode: "off",
      backgroundAssetId: null,
      backgroundAssetQuery: "",
      backgroundSlice: null,
      battleUiValues: {},
    },
  };
}

function createHouseDefinition(overrides = {}) {
  return {
    id: "house.test.tea",
    cityId: "city.kulan",
    name: "测试茶馆",
    type: "tea-house",
    characterIds: [playerCharacterId, "char.test.npc"],
    defaultCharacterId: "char.test.npc",
    backAction: {
      label: "返回濠州",
      targetView: "city",
    },
    ...overrides,
  };
}

test("shared NPC AI dialogue contracts expose the runtime seam and persistent memory branch", () => {
  const npcDialogueSource = fs.readFileSync(
    "src/domain/npc-ai-dialogue.ts",
    "utf8"
  );
  const npcInteractionRuntimeSource = fs.readFileSync(
    "src/core/runtime/npc-interaction-runtime.ts",
    "utf8"
  );
  const npcInteractionSource = fs.readFileSync(
    "src/domain/npc-interaction.ts",
    "utf8"
  );
  const gameStateSource = fs.readFileSync("src/domain/game-state.ts", "utf8");
  const initialStateSource = fs.readFileSync(
    "src/application/state/create-initial-state.ts",
    "utf8"
  );

  assert.match(npcDialogueSource, /NpcAiDialogueProvider/u);
  assert.match(npcDialogueSource, /memoriesByCharacterId/u);
  assert.match(npcDialogueSource, /type:\s*"complete"/u);
  assert.match(npcInteractionRuntimeSource, /createNpcInteractionRuntimeBridge/u);
  assert.match(npcInteractionRuntimeSource, /npcAiDialogueProvider/u);
  assert.match(npcInteractionRuntimeSource, /type:\s*"start-talk"/u);
  assert.match(npcInteractionRuntimeSource, /type:\s*"close"/u);
  assert.match(npcInteractionSource, /mode:\s*"ai-dialogue"/u);
  assert.match(gameStateSource, /npcDialogue/u);
  assert.match(initialStateSource, /createInitialNpcAiDialogueRuntimeState/u);
});

test("shared NPC AI dialogue runtime starts provider streams and persists the completed turn into the target NPC memory log", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = openNpcInteraction(
    createBaseAppState(),
    {
      type: "house",
      houseId: "house.test.tea",
    },
    "char.test.npc"
  );
  const providerRequests = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.tea": createHouseDefinition(),
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        await onEvent({
          type: "start",
          requestId: request.requestId,
        });
        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: `
[DIALOGUE: char.test.npc,茶博士,"今日城里风声有些紧，东门商队昨夜才到。若你愿意，我可以慢慢说给你听。"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_town|问城里近况|问城里近况|recommended|true]
[OPTION: option.ask_road|问路上见闻|问路上见闻|mainline|false]
[OPTION: option.ask_people|问近来人物|问近来人物|side|false]
          `,
          allSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.npc",
              speakerName: "茶博士",
              text: "今日城里风声有些紧，东门商队昨夜才到。若你愿意，我可以慢慢说给你听。",
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
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  assert.equal(providerRequests.length, 1);
  assert.equal(providerRequests[0].metadata.npcId, "char.test.npc");
  assert.equal(providerRequests[0].metadata.placeName, "测试茶馆");
  assert.match(
    providerRequests[0].messages[0].content,
    /当前地点：测试茶馆/u
  );
  assert.match(
    providerRequests[0].messages[0].content,
    /当前玩家：朱重八/u
  );
  assert.match(
    providerRequests[0].messages[0].content,
    /当前NPC：茶博士/u
  );
  assert.match(
    providerRequests[0].messages[0].content,
    /当前对话双方：朱重八 与 茶博士/u
  );
  assert.match(
    providerRequests[0].messages[1].content,
    /根据当前情况/u
  );
  assert.match(
    providerRequests[0].messages[1].content,
    /开场白/u
  );
  assert.match(
    providerRequests[0].messages[1].content,
    /不能\s*ooc/iu
  );
  assert.match(
    providerRequests[0].messages[1].content,
    /符合人物设定/u
  );
  assert.equal(appState.gameState.ui.npcInteractionSession?.mode, "ai-dialogue");
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-advance"
  );
  assert.deepEqual(
    appState.gameState.ui.npcInteractionSession?.dialogue?.displayPages.map(
      (page) => page.text
    ),
    [
      "今日城里风声有些紧，东门商队昨夜才到。",
      "若你愿意，我可以慢慢说给你听。",
    ]
  );
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.options.length,
    3
  );
  assert.deepEqual(
    appState.gameState.runtime.npcDialogue?.memoriesByCharacterId?.["char.test.npc"]?.entries.map(
      (entry) => ({
        speaker: entry.speaker,
        text: entry.text,
      })
    ),
    [
      {
        speaker: "npc",
        text: "今日城里风声有些紧，东门商队昨夜才到。若你愿意，我可以慢慢说给你听。",
      },
    ]
  );

  runtime.dispatch({
    type: "advance-page",
  });

  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.currentDisplayPageIndex,
    1
  );
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-choice"
  );
});

test("shared NPC AI dialogue runtime ignores stale provider events after the player closes the panel", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = openNpcInteraction(
    createBaseAppState(),
    {
      type: "house",
      houseId: "house.test.tea",
    },
    "char.test.npc"
  );
  let capturedOnEvent = null;

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.tea": createHouseDefinition(),
    },
    npcAiDialogueProvider: {
      async stream(_request, onEvent) {
        capturedOnEvent = onEvent;
      },
      cancel() {},
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });
  runtime.dispatch({
    type: "close",
  });

  assert.equal(appState.gameState.ui.npcInteractionSession, null);
  assert.equal(typeof capturedOnEvent, "function");

  await capturedOnEvent({
    type: "complete",
    requestId: "npc-ai-dialogue-request-1",
    rawText: `
[DIALOGUE: char.test.npc,茶博士,"这是迟到的旧回应。"]
[CHOICE: 你想怎么接话？]
[OPTION: option.one|一|一|recommended|true]
[OPTION: option.two|二|二|mainline|false]
[OPTION: option.three|三|三|side|false]
    `,
    allSteps: [
      {
        type: "dialogue",
        speakerId: "char.test.npc",
        speakerName: "茶博士",
        text: "这是迟到的旧回应。",
      },
      {
        type: "choice",
        prompt: "你想怎么接话？",
        options: [
          { id: "option.one", label: "一", actionText: "一", recommended: true },
          { id: "option.two", label: "二", actionText: "二" },
          { id: "option.three", label: "三", actionText: "三" },
        ],
      },
    ],
  });

  await Promise.resolve();

  assert.deepEqual(
    appState.gameState.runtime.npcDialogue?.memoriesByCharacterId?.["char.test.npc"]?.entries ??
      [],
    []
  );
});

test("shared NPC AI dialogue runtime closes the house dialogue overlay without leaving the current building", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = {
    ...createBaseAppState(),
    gameState: createBaseGameState("house.test.market"),
    characterDefinitions: [
      createCharacterDefinition(
        playerCharacterId,
        "朱重八",
        "house.test.market",
        "旅人"
      ),
      createCharacterDefinition(
        "char.test.npc",
        "钱掌柜",
        "house.test.market",
        "掌柜"
      ),
    ],
  };
  appState = openNpcInteraction(
    appState,
    {
      type: "house",
      houseId: "house.test.market",
    },
    "char.test.npc"
  );

  const dispatchedRoutes = [];
  const cancelledRequestIds = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.market": createHouseDefinition({
        id: "house.test.market",
        name: "测试商铺",
        type: "market-house",
        moduleId: "market-house",
        characterIds: [playerCharacterId, "char.test.npc"],
      }),
    },
    selectHouseConversationCapabilitySnapshot: () => ({
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
      reachableHouses: [],
      leaveAction: {
        actionId: "leave-house",
        label: "离开货栈",
        available: true,
      },
      negotiableStoryNodes: [],
    }),
    dispatchHouseConversationRoute: (route) => {
      dispatchedRoutes.push(route);
      if (route.kind !== "leave-house") {
        return false;
      }

      appState = {
        ...appState,
        gameState: {
          ...appState.gameState,
          world: {
            ...appState.gameState.world,
            currentHouseId: null,
          },
          ui: {
            ...appState.gameState.ui,
            currentView: "city",
            overlayView: null,
            houseSession: null,
            npcInteractionSession: null,
          },
        },
      };
      return true;
    },
    npcAiDialogueProvider: {
      async stream() {},
      cancel(requestId) {
        cancelledRequestIds.push(requestId);
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });
  runtime.dispatch({
    type: "close",
  });

  assert.deepEqual(dispatchedRoutes, []);
  assert.deepEqual(cancelledRequestIds, ["npc-ai-dialogue-request-1"]);
  assert.equal(appState.gameState.ui.currentView, "house");
  assert.equal(appState.gameState.world.currentHouseId, "house.test.market");
  assert.equal(appState.gameState.ui.npcInteractionSession, null);
});

test("shared NPC AI dialogue runtime does not duplicate streamed steps when the final completion payload repeats the same prefix", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = openNpcInteraction(
    createBaseAppState(),
    {
      type: "house",
      houseId: "house.test.tea",
    },
    "char.test.npc"
  );

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.tea": createHouseDefinition(),
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        const firstStep = {
          type: "dialogue",
          speakerId: "char.test.npc",
          speakerName: "茶博士",
          text: "客官今日想聊哪一桩？",
        };
        const choiceStep = {
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
        };

        await onEvent({
          type: "start",
          requestId: request.requestId,
        });
        await onEvent({
          type: "step",
          requestId: request.requestId,
          step: firstStep,
        });
        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: `
[DIALOGUE: char.test.npc,茶博士,"客官今日想聊哪一桩？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_town|问城里近况|问城里近况|recommended|true]
[OPTION: option.ask_road|问路上见闻|问路上见闻|mainline|false]
[OPTION: option.ask_people|问近来人物|问近来人物|side|false]
          `,
          allSteps: [firstStep, choiceStep],
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();

  const transcript =
    appState.gameState.ui.npcInteractionSession?.mode === "ai-dialogue"
      ? appState.gameState.ui.npcInteractionSession.dialogue.transcript
      : [];
  assert.deepEqual(
    transcript.map((entry) => ({
      type: entry.type,
      speakerName: entry.type === "dialogue" ? entry.speakerName : undefined,
      text: entry.text,
    })),
    [
      {
        type: "dialogue",
        speakerName: "茶博士",
        text: "客官今日想聊哪一桩？",
      },
    ]
  );
  assert.deepEqual(
    appState.gameState.runtime.npcDialogue?.memoriesByCharacterId?.["char.test.npc"]?.entries.map(
      (entry) => ({
        speaker: entry.speaker,
        text: entry.text,
      })
    ),
    [{ speaker: "npc", text: "客官今日想聊哪一桩？" }]
  );
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.mode === "ai-dialogue"
      ? appState.gameState.ui.npcInteractionSession.dialogue.options.length
      : 0,
    3
  );
});

test("shared NPC AI dialogue runtime lets the player switch into custom input mode and sends the typed line back through the provider", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = openNpcInteraction(
    createBaseAppState(),
    {
      type: "house",
      houseId: "house.test.tea",
    },
    "char.test.npc"
  );
  const providerRequests = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.tea": createHouseDefinition(),
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        if (request.metadata.inputType === "start_talk") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,茶博士,"客官想先从哪头聊起？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_town|问城里近况|问城里近况|benevolent|true]
[OPTION: option.ask_road|问路上见闻|问路上见闻|neutral|false]
[OPTION: option.ask_people|问近来人物|问近来人物|hostile|false]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "茶博士",
                text: "客官想先从哪头聊起？",
              },
              {
                type: "choice",
                prompt: "你想怎么接话？",
                options: [
                  {
                    id: "option.ask_town",
                    label: "问城里近况",
                    actionText: "问城里近况",
                    kind: "benevolent",
                    recommended: true,
                  },
                  {
                    id: "option.ask_road",
                    label: "问路上见闻",
                    actionText: "问路上见闻",
                    kind: "neutral",
                  },
                  {
                    id: "option.ask_people",
                    label: "问近来人物",
                    actionText: "问近来人物",
                    kind: "hostile",
                  },
                ],
              },
            ],
          });
          return;
        }

        await onEvent({
          type: "start",
          requestId: request.requestId,
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "open-custom-input",
  });
  runtime.dispatch({
    type: "update-custom-input",
    value: "我想问问城外消息",
  });
  runtime.dispatch({
    type: "submit-custom",
  });

  assert.equal(providerRequests.length, 2);
  assert.equal(providerRequests[1].metadata.inputType, "custom_input");
  assert.equal(providerRequests[1].metadata.customInputText, "我想问问城外消息");
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "streaming"
  );
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.customInputOpen,
    false
  );
  assert.deepEqual(
    appState.gameState.runtime.npcDialogue?.memoriesByCharacterId?.["char.test.npc"]?.entries.map(
      (entry) => ({
        speaker: entry.speaker,
        text: entry.text,
      })
    ),
    [
      { speaker: "npc", text: "客官想先从哪头聊起？" },
      { speaker: "player", text: "我想问问城外消息" },
    ]
  );
});

test("shared NPC AI dialogue runtime uses the option action text for the visible player line and the next provider request", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = openNpcInteraction(
    createBaseAppState(),
    {
      type: "house",
      houseId: "house.test.tea",
    },
    "char.test.npc"
  );
  const providerRequests = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.tea": createHouseDefinition(),
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        if (request.metadata.inputType === "start_talk") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,茶博士,"客官想先从哪头聊起？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_town|善意回应|好啊，那你先说说城里近况。|benevolent|true]
[OPTION: option.ask_road|中立回应|路上见闻也行，你慢慢说。|neutral|false]
[OPTION: option.ask_people|恶意回应|少绕弯子，直接讲你知道的人物消息。|hostile|false]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "茶博士",
                text: "客官想先从哪头聊起？",
              },
              {
                type: "choice",
                prompt: "你想怎么接话？",
                options: [
                  {
                    id: "option.ask_town",
                    label: "善意回应",
                    actionText: "好啊，那你先说说城里近况。",
                    kind: "benevolent",
                    recommended: true,
                  },
                  {
                    id: "option.ask_road",
                    label: "中立回应",
                    actionText: "路上见闻也行，你慢慢说。",
                    kind: "neutral",
                  },
                  {
                    id: "option.ask_people",
                    label: "恶意回应",
                    actionText: "少绕弯子，直接讲你知道的人物消息。",
                    kind: "hostile",
                  },
                ],
              },
            ],
          });
          return;
        }

        await onEvent({
          type: "start",
          requestId: request.requestId,
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "select-option",
    optionId: "option.ask_town",
  });

  assert.equal(providerRequests.length, 2);
  assert.equal(providerRequests[1].metadata.inputType, "select_option");
  assert.equal(
    providerRequests[1].metadata.selectedOptionLabel,
    "好啊，那你先说说城里近况。"
  );
  assert.match(
    providerRequests[1].messages[1].content,
    /好啊，那你先说说城里近况。/u
  );
  assert.doesNotMatch(
    providerRequests[1].messages[1].content,
    /善意回应/u
  );
  assert.deepEqual(
    appState.gameState.ui.npcInteractionSession?.dialogue?.transcript.map(
      (entry) => ({
        speakerName: entry.type === "dialogue" ? entry.speakerName : null,
        text: entry.text,
      })
    ),
    [
      {
        speakerName: "茶博士",
        text: "客官想先从哪头聊起？",
      },
      {
        speakerName: "朱重八",
        text: "好啊，那你先说说城里近况。",
      },
    ]
  );
  assert.deepEqual(
    appState.gameState.runtime.npcDialogue?.memoriesByCharacterId?.["char.test.npc"]?.entries.map(
      (entry) => ({
        speaker: entry.speaker,
        text: entry.text,
      })
    ),
    [
      { speaker: "npc", text: "客官想先从哪头聊起？" },
      { speaker: "player", text: "好啊，那你先说说城里近况。" },
    ]
  );
});

test("shared NPC AI dialogue runtime waits for an explicit AI action handoff before leaving dialogue and opening the matched house action", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = {
    ...createBaseAppState(),
    gameState: createBaseGameState("house.test.market"),
    characterDefinitions: [
      createCharacterDefinition(
        playerCharacterId,
        "朱重八",
        "house.test.market",
        "旅人"
      ),
      createCharacterDefinition(
        "char.test.npc",
        "钱掌柜",
        "house.test.market",
        "掌柜"
      ),
    ],
  };
  appState = openNpcInteraction(
    appState,
    {
      type: "house",
      houseId: "house.test.market",
    },
    "char.test.npc"
  );

  const providerRequests = [];
  const dispatchedHouseActions = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.market": createHouseDefinition({
        id: "house.test.market",
        name: "测试商铺",
        type: "market-house",
        moduleId: "market-house",
        characterIds: [playerCharacterId, "char.test.npc"],
      }),
    },
    houseModuleRegistry: {
      getModule() {
        return {
          selectViewModel() {
            return {
              standbyRoster: [
                {
                  characterId: "char.test.npc",
                  name: "钱掌柜",
                  interactionActions: [
                    {
                      id: "investigate-market",
                      label: "调查行情",
                      kind: "special",
                      triggerKeywords: ["什么货", "货物", "特产"],
                    },
                    {
                      id: "buy-goods",
                      label: "买入货物",
                      kind: "special",
                      triggerKeywords: ["买货", "进货"],
                    },
                    {
                      id: "sell-goods",
                      label: "卖出货物",
                      kind: "special",
                      triggerKeywords: ["卖货", "出货"],
                    },
                  ],
                },
              ],
            };
          },
        };
      },
    },
    dispatchHouseAction: (actionId) => {
      dispatchedHouseActions.push(actionId);
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        if (request.metadata.inputType === "select_option") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"客官既想看货，我这就把近来能走的货路和现货都给你展开。"]
[ACTION: investigate-market]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "钱掌柜",
                text: "客官既想看货，我这就把近来能走的货路和现货都给你展开。",
              },
              {
                type: "action",
                actionId: "investigate-market",
              },
            ],
          });
          return;
        }

        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"客官想问点什么？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_goods|问货|你这都有什么货？|neutral|true]
[OPTION: option.ask_buy|买货|我想买点东西。|benevolent|false]
[OPTION: option.ask_leave|告辞|那我再看看。|neutral|false]
          `,
          allSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.npc",
              speakerName: "钱掌柜",
              text: "客官想问点什么？",
            },
            {
              type: "choice",
              prompt: "你想怎么接话？",
              options: [
                {
                  id: "option.ask_goods",
                  label: "问货",
                  actionText: "你这都有什么货？",
                },
                {
                  id: "option.ask_buy",
                  label: "买货",
                  actionText: "我想买点东西。",
                },
                {
                  id: "option.ask_leave",
                  label: "告辞",
                  actionText: "那我再看看。",
                },
              ],
            },
          ],
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "select-option",
    optionId: "option.ask_goods",
  });

  assert.equal(providerRequests.length, 2);
  assert.deepEqual(dispatchedHouseActions, []);
  assert.equal(appState.gameState.ui.npcInteractionSession?.mode, "ai-dialogue");
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-advance"
  );
  assert.deepEqual(
    appState.gameState.runtime.npcDialogue?.memoriesByCharacterId?.["char.test.npc"]?.entries.map(
      (entry) => ({
        speaker: entry.speaker,
        text: entry.text,
      })
    ),
    [
      { speaker: "npc", text: "客官想问点什么？" },
      { speaker: "player", text: "你这都有什么货？" },
      {
        speaker: "npc",
        text: "客官既想看货，我这就把近来能走的货路和现货都给你展开。",
      },
    ]
  );

  while (
    appState.gameState.ui.npcInteractionSession?.dialogue?.status ===
    "awaiting-advance"
  ) {
    runtime.dispatch({
      type: "advance-page",
    });
  }

  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-action-jump"
  );

  runtime.dispatch({
    type: "advance-page",
  });

  assert.deepEqual(dispatchedHouseActions, ["investigate-market"]);
  assert.equal(appState.gameState.ui.npcInteractionSession, null);
});

test("shared NPC AI dialogue runtime lets AI decide whether matching custom input should hand off into a house special action", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = {
    ...createBaseAppState(),
    gameState: createBaseGameState("house.test.market"),
    characterDefinitions: [
      createCharacterDefinition(
        playerCharacterId,
        "朱重八",
        "house.test.market",
        "旅人"
      ),
      createCharacterDefinition(
        "char.test.npc",
        "钱掌柜",
        "house.test.market",
        "掌柜"
      ),
    ],
  };
  appState = openNpcInteraction(
    appState,
    {
      type: "house",
      houseId: "house.test.market",
    },
    "char.test.npc"
  );

  const providerRequests = [];
  const dispatchedHouseActions = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.market": createHouseDefinition({
        id: "house.test.market",
        name: "测试商铺",
        type: "market-house",
        moduleId: "market-house",
        characterIds: [playerCharacterId, "char.test.npc"],
      }),
    },
    houseModuleRegistry: {
      getModule() {
        return {
          selectViewModel() {
            return {
              standbyRoster: [
                {
                  characterId: "char.test.npc",
                  name: "钱掌柜",
                  interactionActions: [
                    {
                      id: "investigate-market",
                      label: "调查行情",
                      kind: "special",
                      triggerKeywords: ["什么货", "货物", "特产"],
                    },
                  ],
                },
              ],
            };
          },
        };
      },
    },
    dispatchHouseAction: (actionId) => {
      dispatchedHouseActions.push(actionId);
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        if (request.metadata.inputType === "custom_input") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"既然是来探行情的，我便把本地都压着哪些货、哪里的价更合适，给你说个明白。"]
[ACTION: investigate-market]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "钱掌柜",
                text: "既然是来探行情的，我便把本地都压着哪些货、哪里的价更合适，给你说个明白。",
              },
              {
                type: "action",
                actionId: "investigate-market",
              },
            ],
          });
          return;
        }

        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"客官想问点什么？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_goods|问货|问问近况。|neutral|true]
[OPTION: option.ask_buy|买货|我想买点东西。|benevolent|false]
[OPTION: option.ask_leave|告辞|那我再看看。|neutral|false]
          `,
          allSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.npc",
              speakerName: "钱掌柜",
              text: "客官想问点什么？",
            },
            {
              type: "choice",
              prompt: "你想怎么接话？",
              options: [
                {
                  id: "option.ask_goods",
                  label: "问货",
                  actionText: "问问近况。",
                },
                {
                  id: "option.ask_buy",
                  label: "买货",
                  actionText: "我想买点东西。",
                },
                {
                  id: "option.ask_leave",
                  label: "告辞",
                  actionText: "那我再看看。",
                },
              ],
            },
          ],
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "open-custom-input",
  });
  runtime.dispatch({
    type: "update-custom-input",
    value: "你这里都有什么货物和特产？",
  });
  runtime.dispatch({
    type: "submit-custom",
  });

  assert.equal(providerRequests.length, 2);
  assert.equal(
    providerRequests[1].metadata.customInputText,
    "你这里都有什么货物和特产？"
  );
  assert.deepEqual(dispatchedHouseActions, []);
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-advance"
  );
  assert.deepEqual(
    appState.gameState.runtime.npcDialogue?.memoriesByCharacterId?.["char.test.npc"]?.entries.map(
      (entry) => ({
        speaker: entry.speaker,
        text: entry.text,
      })
    ),
    [
      { speaker: "npc", text: "客官想问点什么？" },
      { speaker: "player", text: "你这里都有什么货物和特产？" },
      {
        speaker: "npc",
        text: "既然是来探行情的，我便把本地都压着哪些货、哪里的价更合适，给你说个明白。",
      },
    ]
  );

  while (
    appState.gameState.ui.npcInteractionSession?.dialogue?.status ===
    "awaiting-advance"
  ) {
    runtime.dispatch({
      type: "advance-page",
    });
  }

  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-action-jump"
  );

  runtime.dispatch({
    type: "advance-page",
  });

  assert.deepEqual(dispatchedHouseActions, ["investigate-market"]);
  assert.equal(appState.gameState.ui.npcInteractionSession, null);
});

test("shared NPC AI dialogue runtime lets AI hand tavern custom input into gambling after an in-character transition line", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = {
    ...createBaseAppState(),
    gameState: createBaseGameState("house.test.tavern"),
    characterDefinitions: [
      createCharacterDefinition(
        playerCharacterId,
        "朱重八",
        "house.test.tavern",
        "旅人"
      ),
      createCharacterDefinition(
        "char.test.npc",
        "酒肆老板",
        "house.test.tavern",
        "掌柜"
      ),
    ],
  };
  appState = openNpcInteraction(
    appState,
    {
      type: "house",
      houseId: "house.test.tavern",
    },
    "char.test.npc"
  );

  const providerRequests = [];
  const dispatchedHouseActions = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.tavern": createHouseDefinition({
        id: "house.test.tavern",
        name: "测试酒肆",
        type: "tavern",
        moduleId: "tavern",
        characterIds: [playerCharacterId, "char.test.npc"],
      }),
    },
    houseModuleRegistry: {
      getModule() {
        return {
          selectViewModel() {
            return {
              standbyRoster: [
                {
                  characterId: "char.test.npc",
                  name: "酒肆老板",
                  interactionActions: [
                    {
                      id: "open-work",
                      label: "工作",
                      kind: "special",
                    },
                    {
                      id: "order-drink",
                      label: "喝酒",
                      kind: "special",
                    },
                    {
                      id: "open-gamble",
                      label: "赌博",
                      kind: "special",
                    },
                  ],
                },
              ],
            };
          },
        };
      },
    },
    dispatchHouseAction: (actionId) => {
      dispatchedHouseActions.push(actionId);
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        if (request.metadata.inputType === "custom_input") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,酒肆老板,"原来客官是想上桌试试手气？那便随我往里头走，牌九桌子正好空着。"]
[ACTION: open-gamble]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "酒肆老板",
                text: "原来客官是想上桌试试手气？那便随我往里头走，牌九桌子正好空着。",
              },
              {
                type: "action",
                actionId: "open-gamble",
              },
            ],
          });
          return;
        }

        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: `
[DIALOGUE: char.test.npc,酒肆老板,"客官是想喝酒，还是想找点别的乐子？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_drink|喝酒|先来壶酒。|neutral|true]
[OPTION: option.ask_work|工作|有没有活干？|benevolent|false]
[OPTION: option.ask_leave|告辞|我先看看。|neutral|false]
          `,
          allSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.npc",
              speakerName: "酒肆老板",
              text: "客官是想喝酒，还是想找点别的乐子？",
            },
            {
              type: "choice",
              prompt: "你想怎么接话？",
              options: [
                {
                  id: "option.ask_drink",
                  label: "喝酒",
                  actionText: "先来壶酒。",
                },
                {
                  id: "option.ask_work",
                  label: "工作",
                  actionText: "有没有活干？",
                },
                {
                  id: "option.ask_leave",
                  label: "告辞",
                  actionText: "我先看看。",
                },
              ],
            },
          ],
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "open-custom-input",
  });
  runtime.dispatch({
    type: "update-custom-input",
    value: "我来赌几把",
  });
  runtime.dispatch({
    type: "submit-custom",
  });

  assert.equal(providerRequests.length, 2);
  assert.deepEqual(dispatchedHouseActions, []);
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-advance"
  );
  assert.deepEqual(
    appState.gameState.runtime.npcDialogue?.memoriesByCharacterId?.["char.test.npc"]?.entries.map(
      (entry) => ({
        speaker: entry.speaker,
        text: entry.text,
      })
    ),
    [
      {
        speaker: "npc",
        text: "客官是想喝酒，还是想找点别的乐子？",
      },
      { speaker: "player", text: "我来赌几把" },
      {
        speaker: "npc",
        text: "原来客官是想上桌试试手气？那便随我往里头走，牌九桌子正好空着。",
      },
    ]
  );

  while (
    appState.gameState.ui.npcInteractionSession?.dialogue?.status ===
    "awaiting-advance"
  ) {
    runtime.dispatch({
      type: "advance-page",
    });
  }

  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-action-jump"
  );

  runtime.dispatch({
    type: "advance-page",
  });

  assert.deepEqual(dispatchedHouseActions, ["open-gamble"]);
  assert.equal(appState.gameState.ui.npcInteractionSession, null);
});

test("shared NPC AI dialogue runtime does not jump to unrelated house actions when the current NPC special actions do not match the selected line", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = {
    ...createBaseAppState(),
    gameState: createBaseGameState("house.test.market"),
    characterDefinitions: [
      createCharacterDefinition(
        playerCharacterId,
        "朱重八",
        "house.test.market",
        "旅人"
      ),
      createCharacterDefinition(
        "char.test.npc",
        "钱掌柜",
        "house.test.market",
        "掌柜"
      ),
    ],
  };
  appState = openNpcInteraction(
    appState,
    {
      type: "house",
      houseId: "house.test.market",
    },
    "char.test.npc"
  );

  const providerRequests = [];
  const dispatchedHouseActions = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.market": createHouseDefinition({
        id: "house.test.market",
        name: "测试商铺",
        type: "market-house",
        moduleId: "market-house",
        characterIds: [playerCharacterId, "char.test.npc"],
      }),
    },
    houseModuleRegistry: {
      getModule() {
        return {
          selectViewModel() {
            return {
              standbyRoster: [
                {
                  characterId: "char.test.npc",
                  name: "钱掌柜",
                  interactionActions: [
                    {
                      id: "investigate-market",
                      label: "调查行情",
                      kind: "special",
                      triggerKeywords: ["什么货", "货物", "特产"],
                    },
                    {
                      id: "buy-goods",
                      label: "买入货物",
                      kind: "special",
                      triggerKeywords: ["买货", "进货"],
                    },
                  ],
                },
              ],
            };
          },
        };
      },
    },
    dispatchHouseAction: (actionId) => {
      dispatchedHouseActions.push(actionId);
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        if (request.metadata.inputType === "start_talk") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"客官想问点什么？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_gamble|赌博|俺也去赌两把。|hostile|true]
[OPTION: option.ask_buy|买货|我想买点东西。|benevolent|false]
[OPTION: option.ask_leave|告辞|那我再看看。|neutral|false]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "钱掌柜",
                text: "客官想问点什么？",
              },
              {
                type: "choice",
                prompt: "你想怎么接话？",
                options: [
                  {
                    id: "option.ask_gamble",
                    label: "赌博",
                    actionText: "俺也去赌两把。",
                  },
                  {
                    id: "option.ask_buy",
                    label: "买货",
                    actionText: "我想买点东西。",
                  },
                  {
                    id: "option.ask_leave",
                    label: "告辞",
                    actionText: "那我再看看。",
                  },
                ],
              },
            ],
          });
          return;
        }

        await onEvent({
          type: "start",
          requestId: request.requestId,
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "select-option",
    optionId: "option.ask_gamble",
  });

  assert.equal(providerRequests.length, 2);
  assert.deepEqual(dispatchedHouseActions, []);
  assert.equal(appState.gameState.ui.npcInteractionSession?.mode, "ai-dialogue");
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "streaming"
  );
  assert.equal(
    providerRequests[1].metadata.selectedOptionLabel,
    "俺也去赌两把。"
  );
});

test("shared NPC AI dialogue runtime keeps clarify responses on the ordinary choice loop", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = {
    ...createBaseAppState(),
    gameState: createBaseGameState("house.test.tavern"),
    characterDefinitions: [
      createCharacterDefinition(
        playerCharacterId,
        "朱重八",
        "house.test.tavern",
        "旅人"
      ),
      createCharacterDefinition(
        "char.test.tavern_boss",
        "酒馆掌柜",
        "house.test.tavern",
        "掌柜"
      ),
    ],
  };
  appState = openNpcInteraction(
    appState,
    {
      type: "house",
      houseId: "house.test.tavern",
    },
    "char.test.tavern_boss"
  );

  const routeSnapshot = {
    cityId: "city.kulan",
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
  };

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.tavern": createHouseDefinition({
        id: "house.test.tavern",
        name: "测试酒馆",
        type: "tavern",
        moduleId: "tavern",
        characterIds: [playerCharacterId, "char.test.tavern_boss"],
      }),
    },
    selectHouseConversationCapabilitySnapshot: () => routeSnapshot,
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        if (request.metadata.inputType === "custom_input") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.tavern_boss,酒馆掌柜,"成，你是想开赌局，还是先问问规矩与玩法？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_rules|先说说规矩。|先说说规矩。|neutral|true]
[OPTION: option.open_short|我想先玩几句短局。|我想先玩几句短局。|benevolent|false]
[OPTION: option.leave|那我先看看别的。|那我先看看别的。|neutral|false]
            `,
            allSteps: [
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
            ],
          });
          return;
        }

        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: `
[DIALOGUE: char.test.tavern_boss,酒馆掌柜,"客官想喝酒，还是想找点别的乐子？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_drink|喝酒|先来壶酒。|neutral|true]
[OPTION: option.ask_gamble|赌博|我想玩点东西。|benevolent|false]
[OPTION: option.ask_leave|告辞|我先看看。|neutral|false]
          `,
          allSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.tavern_boss",
              speakerName: "酒馆掌柜",
              text: "客官想喝酒，还是想找点别的乐子？",
            },
            {
              type: "choice",
              prompt: "你想怎么接话？",
              options: [
                { id: "option.ask_drink", label: "喝酒", actionText: "先来壶酒。" },
                { id: "option.ask_gamble", label: "赌博", actionText: "我想玩点东西。" },
                { id: "option.ask_leave", label: "告辞", actionText: "我先看看。" },
              ],
            },
          ],
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "open-custom-input",
  });
  runtime.dispatch({
    type: "update-custom-input",
    value: "我想玩点东西",
  });
  runtime.dispatch({
    type: "submit-custom",
  });

  await Promise.resolve();

  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-choice"
  );
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.pendingRoute,
    null
  );
});

test("shared NPC AI dialogue runtime routes a validated hidden house jump after the transition line finishes", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = {
    ...createBaseAppState(),
    gameState: createBaseGameState("house.test.market"),
    characterDefinitions: [
      createCharacterDefinition(
        playerCharacterId,
        "朱重八",
        "house.test.market",
        "旅人"
      ),
      createCharacterDefinition(
        "char.test.npc",
        "钱掌柜",
        "house.test.market",
        "掌柜"
      ),
    ],
  };
  appState = openNpcInteraction(
    appState,
    {
      type: "house",
      houseId: "house.test.market",
    },
    "char.test.npc"
  );

  const providerRequests = [];
  const dispatchedRoutes = [];
  const routeSnapshot = {
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
    negotiableStoryNodes: [],
  };

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.market": createHouseDefinition({
        id: "house.test.market",
        name: "测试商铺",
        type: "market-house",
        moduleId: "market-house",
        characterIds: [playerCharacterId, "char.test.npc"],
      }),
    },
    selectHouseConversationCapabilitySnapshot: () => routeSnapshot,
    dispatchHouseConversationRoute: (route) => {
      dispatchedRoutes.push(route);
      return true;
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        if (request.metadata.inputType === "custom_input") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"城南粮铺今日正开着门，你若要去看米价，现在过去正合适。"]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "钱掌柜",
                text: "城南粮铺今日正开着门，你若要去看米价，现在过去正合适。",
              },
              {
                type: "route",
                route: {
                  kind: "go-to-house",
                  houseId: "house.kulan.grain_shop",
                },
              },
            ],
          });
          return;
        }

        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"客官想问点什么？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_goods|问货|问问近况。|neutral|true]
[OPTION: option.ask_buy|买货|我想买点东西。|benevolent|false]
[OPTION: option.ask_leave|告辞|那我再看看。|neutral|false]
          `,
          allSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.npc",
              speakerName: "钱掌柜",
              text: "客官想问点什么？",
            },
            {
              type: "choice",
              prompt: "你想怎么接话？",
              options: [
                {
                  id: "option.ask_goods",
                  label: "问货",
                  actionText: "问问近况。",
                },
                {
                  id: "option.ask_buy",
                  label: "买货",
                  actionText: "我想买点东西。",
                },
                {
                  id: "option.ask_leave",
                  label: "告辞",
                  actionText: "那我再看看。",
                },
              ],
            },
          ],
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "open-custom-input",
  });
  runtime.dispatch({
    type: "update-custom-input",
    value: "我去粮铺一趟",
  });
  runtime.dispatch({
    type: "submit-custom",
  });

  assert.equal(providerRequests.length, 2);
  assert.equal(
    providerRequests[1].metadata.houseConversationCapabilitySnapshot.reachableHouses[0]
      .houseId,
    "house.kulan.grain_shop"
  );

  while (
    appState.gameState.ui.npcInteractionSession?.dialogue?.status ===
    "awaiting-advance"
  ) {
    runtime.dispatch({
      type: "advance-page",
    });
  }

  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "awaiting-action-jump"
  );

  runtime.dispatch({
    type: "advance-page",
  });

  assert.deepEqual(dispatchedRoutes, [
    {
      kind: "go-to-house",
      houseId: "house.kulan.grain_shop",
    },
  ]);
  assert.equal(appState.gameState.ui.npcInteractionSession, null);
});

test("shared NPC AI dialogue runtime aligns option clicks and custom input through the same spoken route text", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  async function runRouteTurn(inputMode) {
    let appState = {
      ...createBaseAppState(),
      gameState: createBaseGameState("house.test.market"),
      characterDefinitions: [
        createCharacterDefinition(
          playerCharacterId,
          "朱重八",
          "house.test.market",
          "旅人"
        ),
        createCharacterDefinition(
          "char.test.npc",
          "钱掌柜",
          "house.test.market",
          "掌柜"
        ),
      ],
    };
    appState = openNpcInteraction(
      appState,
      {
        type: "house",
        houseId: "house.test.market",
      },
      "char.test.npc"
    );

    const providerRequests = [];
    const dispatchedRoutes = [];
    const routeSnapshot = {
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
    };

    const runtime = createNpcInteractionRuntimeBridge({
      getAppState: () => appState,
      setAppState: (nextAppState) => {
        appState = nextAppState;
      },
      renderApp: () => {},
      houseDefinitionsById: {
        "house.test.market": createHouseDefinition({
          id: "house.test.market",
          name: "测试商铺",
          type: "market-house",
          moduleId: "market-house",
          characterIds: [playerCharacterId, "char.test.npc"],
        }),
      },
      selectHouseConversationCapabilitySnapshot: () => routeSnapshot,
      dispatchHouseConversationRoute: (route) => {
        dispatchedRoutes.push(route);
        return true;
      },
      npcAiDialogueProvider: {
        async stream(request, onEvent) {
          providerRequests.push(request);
          if (
            request.metadata.inputType === "select_option" ||
            request.metadata.inputType === "custom_input"
          ) {
            await onEvent({
              type: "complete",
              requestId: request.requestId,
              rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"城南粮铺今日正开着门，你若要去看米价，现在过去正好。"]
              `,
              allSteps: [
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
              ],
            });
            return;
          }

          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"客官想问点什么？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_goods|问货|我去粮铺一趟|neutral|true]
[OPTION: option.ask_buy|买货|我想买点东西。|benevolent|false]
[OPTION: option.ask_leave|告辞|那我再看看。|neutral|false]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "钱掌柜",
                text: "客官想问点什么？",
              },
              {
                type: "choice",
                prompt: "你想怎么接话？",
                options: [
                  {
                    id: "option.ask_goods",
                    label: "问货",
                    actionText: "我去粮铺一趟",
                  },
                  {
                    id: "option.ask_buy",
                    label: "买货",
                    actionText: "我想买点东西。",
                  },
                  {
                    id: "option.ask_leave",
                    label: "告辞",
                    actionText: "那我再看看。",
                  },
                ],
              },
            ],
          });
        },
      },
    });

    runtime.dispatch({
      type: "start-talk",
    });

    await Promise.resolve();

    if (inputMode === "select_option") {
      runtime.dispatch({
        type: "select-option",
        optionId: "option.ask_goods",
      });
    } else {
      runtime.dispatch({
        type: "open-custom-input",
      });
      runtime.dispatch({
        type: "update-custom-input",
        value: "我去粮铺一趟",
      });
      runtime.dispatch({
        type: "submit-custom",
      });
    }

    await Promise.resolve();

    while (
      appState.gameState.ui.npcInteractionSession?.dialogue?.status ===
      "awaiting-advance"
    ) {
      runtime.dispatch({
        type: "advance-page",
      });
    }

    runtime.dispatch({
      type: "advance-page",
    });

    const routedRequest = providerRequests[1];
    const spokenText =
      inputMode === "select_option"
        ? routedRequest.metadata.selectedOptionLabel
        : routedRequest.metadata.customInputText;

    return {
      dispatchedRoutes,
      spokenText,
    };
  }

  assert.deepEqual(await runRouteTurn("select_option"), {
    dispatchedRoutes: [
      {
        kind: "go-to-house",
        houseId: "house.kulan.grain_shop",
      },
    ],
    spokenText: "我去粮铺一趟",
  });
  assert.deepEqual(await runRouteTurn("custom_input"), {
    dispatchedRoutes: [
      {
        kind: "go-to-house",
        houseId: "house.kulan.grain_shop",
      },
    ],
    spokenText: "我去粮铺一趟",
  });
});

test("shared NPC AI dialogue runtime rejects hidden route jumps that are absent from the current capability snapshot", async () => {
  const {
    createNpcInteractionRuntimeBridge,
  } = require("../.test-dist/core/runtime/npc-interaction-runtime.js");

  let appState = {
    ...createBaseAppState(),
    gameState: createBaseGameState("house.test.market"),
    characterDefinitions: [
      createCharacterDefinition(
        playerCharacterId,
        "朱重八",
        "house.test.market",
        "旅人"
      ),
      createCharacterDefinition(
        "char.test.npc",
        "钱掌柜",
        "house.test.market",
        "掌柜"
      ),
    ],
  };
  appState = openNpcInteraction(
    appState,
    {
      type: "house",
      houseId: "house.test.market",
    },
    "char.test.npc"
  );

  const dispatchedRoutes = [];

  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    houseDefinitionsById: {
      "house.test.market": createHouseDefinition({
        id: "house.test.market",
        name: "测试商铺",
        type: "market-house",
        moduleId: "market-house",
        characterIds: [playerCharacterId, "char.test.npc"],
      }),
    },
    selectHouseConversationCapabilitySnapshot: () => ({
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
      reachableHouses: [],
      leaveAction: {
        actionId: "leave-house",
        label: "离开货栈",
        available: true,
      },
      negotiableStoryNodes: [],
    }),
    dispatchHouseConversationRoute: (route) => {
      dispatchedRoutes.push(route);
      return true;
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        if (request.metadata.inputType === "custom_input") {
          await onEvent({
            type: "complete",
            requestId: request.requestId,
            rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"若是想去别处看看，你先把眼前的事说清楚也不迟。"]
            `,
            allSteps: [
              {
                type: "dialogue",
                speakerId: "char.test.npc",
                speakerName: "钱掌柜",
                text: "若是想去别处看看，你先把眼前的事说清楚也不迟。",
              },
              {
                type: "route",
                route: {
                  kind: "go-to-house",
                  houseId: "house.kulan.grain_shop",
                },
              },
            ],
          });
          return;
        }

        await onEvent({
          type: "complete",
          requestId: request.requestId,
          rawText: `
[DIALOGUE: char.test.npc,钱掌柜,"客官想问点什么？"]
[CHOICE: 你想怎么接话？]
[OPTION: option.ask_goods|问货|问问近况。|neutral|true]
[OPTION: option.ask_buy|买货|我想买点东西。|benevolent|false]
[OPTION: option.ask_leave|告辞|那我再看看。|neutral|false]
          `,
          allSteps: [
            {
              type: "dialogue",
              speakerId: "char.test.npc",
              speakerName: "钱掌柜",
              text: "客官想问点什么？",
            },
            {
              type: "choice",
              prompt: "你想怎么接话？",
              options: [
                {
                  id: "option.ask_goods",
                  label: "问货",
                  actionText: "问问近况。",
                },
                {
                  id: "option.ask_buy",
                  label: "买货",
                  actionText: "我想买点东西。",
                },
                {
                  id: "option.ask_leave",
                  label: "告辞",
                  actionText: "那我再看看。",
                },
              ],
            },
          ],
        });
      },
    },
  });

  runtime.dispatch({
    type: "start-talk",
  });

  await Promise.resolve();

  runtime.dispatch({
    type: "open-custom-input",
  });
  runtime.dispatch({
    type: "update-custom-input",
    value: "我去粮铺一趟",
  });
  runtime.dispatch({
    type: "submit-custom",
  });

  while (
    appState.gameState.ui.npcInteractionSession?.dialogue?.status ===
    "awaiting-advance"
  ) {
    runtime.dispatch({
      type: "advance-page",
    });
  }

  runtime.dispatch({
    type: "advance-page",
  });

  assert.deepEqual(dispatchedRoutes, []);
  assert.equal(appState.gameState.ui.npcInteractionSession?.mode, "ai-dialogue");
  assert.equal(
    appState.gameState.ui.npcInteractionSession?.dialogue?.status,
    "error"
  );
  assert.match(
    appState.gameState.ui.npcInteractionSession?.dialogue?.errorNotice ?? "",
    /当前不可用/u
  );
});
