const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  ensureNpcInteractionSessionForTarget,
} = require("../.test-dist/application/app-actions.js");
const {
  createNpcInteractionRuntimeBridge,
} = require("../.test-dist/core/runtime/npc-interaction-runtime.js");
const {
  prototypeCards,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

test("house action center default NPC buttons preserve house context for talk routing", () => {
  const {
    renderHouseActionContainer,
  } = require("../.test-dist/ui/views/house/house-shared-view.js");

  const html = renderHouseActionContainer({
    moduleId: "tea-house",
    houseId: "house.tea",
    sceneTitle: "测试茶馆",
    standbyRoster: [
      {
        characterId: "char.tea",
        name: "茶博士",
        isSelected: true,
        interactionActions: [
          {
            id: "tea:ask-intel",
            label: "问消息",
          },
        ],
      },
    ],
    dialogue: null,
    actionContainer: {
      className: "c-test-actions",
      actions: [
        {
          id: "tea:ask-intel",
          label: "问消息",
        },
      ],
    },
    statusCard: null,
    overlay: null,
    leaveAction: {
      id: "leave-house",
      label: "离开",
    },
  });

  assert.match(html, /data-npc-action="talk"/u);
  assert.match(html, /data-character-id="char\.tea"/u);
  assert.match(
    html,
    /data-npc-context="\{&quot;type&quot;:&quot;house&quot;,&quot;houseId&quot;:&quot;house\.tea&quot;,&quot;moduleId&quot;:&quot;tea-house&quot;\}"/u
  );
  assert.match(html, /data-house-id="house\.tea"/u);
  assert.match(html, /data-house-module-id="tea-house"/u);
});

test("NPC talk routing can seed a shared interaction session from house action context", () => {
  const {
    chooseNpcDefaultTalk,
    ensureNpcInteractionSessionForTarget,
  } = require("../.test-dist/application/app-actions.js");

  const opened = ensureNpcInteractionSessionForTarget(
    {
      gameState: {
        ui: {
          npcInteractionSession: null,
        },
      },
    },
    {
      context: {
        type: "house",
        houseId: "house.tea",
        moduleId: "tea-house",
      },
      targetCharacterId: "char.tea",
    }
  );

  assert.equal(opened.gameState.ui.npcInteractionSession?.mode, "menu");
  assert.equal(
    opened.gameState.ui.npcInteractionSession?.targetCharacterId,
    "char.tea"
  );

  const talked = chooseNpcDefaultTalk(opened, "char.tea");
  assert.equal(talked.gameState.ui.npcInteractionSession?.mode, "ai-dialogue");
});

function createHouseConversationHarness(
  houseId = "house.kulan.market",
  options = {}
) {
  const stageDialogue = options.stageDialogue ?? null;
  const providerRequests = [];
  const appStateRef = {
    current: {
      gameState: createInitialState({
        currentMapId: prototypeMap.id,
        currentCityId: "city.kulan",
        currentHouseId: houseId,
        playerCharacterId: "char.player",
        chapterId: "chapter.prototype",
        year: 1567,
        month: 1,
        day: 1,
        pinnedCharacterId: "char.player",
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
      }),
      characterDefinitions: [
        {
          id: "char.player",
          name: "朱元璋",
          birthYear: 1540,
          age: 27,
          cityId: "city.kulan",
          stats: {
            leadership: 1,
            martial: 1,
            intelligence: 1,
            politics: 1,
            charm: 1,
            fame: 1,
            gold: 100,
          },
          stamina: 50,
          availableFunctions: [],
        },
        {
          id: "char.kulan_merchant",
          name: "钱掌柜",
          birthYear: 1530,
          age: 37,
          cityId: "city.kulan",
          houseId,
          stats: {
            leadership: 1,
            martial: 1,
            intelligence: 1,
            politics: 1,
            charm: 1,
            fame: 1,
            gold: 100,
          },
          stamina: 50,
          availableFunctions: [],
        },
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
      worldIntentState: {
        draftText: "",
        status: "idle",
        currentRequestId: null,
        pendingResolution: null,
        lastError: null,
      },
    },
  };
  const runtime = createNpcInteractionRuntimeBridge({
    getAppState: () => appStateRef.current,
    setAppState: (nextAppState) => {
      appStateRef.current = nextAppState;
    },
    renderApp() {},
    houseDefinitionsById: {
      [houseId]: {
        id: houseId,
        cityId: "city.kulan",
        name: "货栈",
        type: "merchant",
        characterIds: ["char.kulan_merchant"],
        defaultCharacterId: "char.kulan_merchant",
        moduleId: "market-house",
        backAction: {
          label: "返回濠州",
          targetView: "city",
        },
      },
    },
    npcAiDialogueProvider: {
      async stream(request, onEvent) {
        providerRequests.push(request);
        await onEvent({
          type: "start",
          requestId: request.requestId,
        });
      },
    },
  });
  const {
    createHouseConversationActionCoordinator,
  } = require("../.test-dist/application/runtime/house-conversation-action-coordinator.js");
  const coordinator = createHouseConversationActionCoordinator({
    getAppState: () => appStateRef.current,
    setAppState: (nextAppState) => {
      appStateRef.current = nextAppState;
    },
    getStageOutput: () => ({
      type: "house",
      activeHouse: {
        id: houseId,
        cityId: "city.kulan",
        name: "货栈",
        type: "merchant",
        characterIds: ["char.kulan_merchant"],
        defaultCharacterId: "char.kulan_merchant",
        moduleId: "market-house",
        backAction: {
          label: "返回濠州",
          targetView: "city",
        },
      },
      moduleViewModel: {
        moduleId: "market-house",
        houseId,
        sceneTitle: "货栈",
        standbyRoster: [
          {
            characterId: "char.kulan_merchant",
            name: "钱掌柜",
            isSelected: true,
          },
        ],
        dialogue: stageDialogue,
        actionContainer: {
          actions: [
            {
              id: "market:trade",
              label: "买卖",
            },
          ],
        },
        statusCard: null,
        overlay: null,
        leaveAction: {
          id: "leave-house",
          label: "离开",
        },
      },
      cityNpcSummaries: [],
    }),
    renderApp() {},
    openNpcTalk: ({ targetCharacterId, context }) => {
      appStateRef.current = ensureNpcInteractionSessionForTarget(
        appStateRef.current,
        {
          context,
          targetCharacterId,
        }
      );
      runtime.dispatch({
        type: "start-talk",
      });
    },
    closeActiveRequest() {
      runtime.closeActiveRequest();
    },
  });

  return {
    coordinator,
    appStateRef,
    providerRequests,
  };
}

test("eligible Haozhou house entry auto-starts AI dialogue for the default NPC", async () => {
  const { coordinator, appStateRef, providerRequests } =
    createHouseConversationHarness("house.kulan.market");

  coordinator.syncFromStage();
  await Promise.resolve();

  assert.equal(providerRequests.length, 1);
  assert.equal(providerRequests[0].metadata.inputType, "start_talk");
  assert.equal(
    appStateRef.current.gameState.ui.npcInteractionSession?.targetCharacterId,
    "char.kulan_merchant"
  );
  assert.equal(
    appStateRef.current.gameState.ui.npcInteractionSession?.mode,
    "ai-dialogue"
  );
});

test("eligible Haozhou house entry still auto-starts AI dialogue while the house module still has a greeting dialogue", async () => {
  const { coordinator, providerRequests } = createHouseConversationHarness(
    "house.kulan.market",
    {
      stageDialogue: {
        mode: "character",
        speakerName: "钱掌柜",
        textLines: ["客官里面请，想先看哪样货？"],
        advanceActionId: "advance-greeting",
      },
    }
  );

  coordinator.syncFromStage();
  await Promise.resolve();

  assert.equal(providerRequests.length, 1);
  assert.equal(providerRequests[0].metadata.inputType, "start_talk");
});
