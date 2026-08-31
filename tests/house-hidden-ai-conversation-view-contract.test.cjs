const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  prototypeCards,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

function createPlayerCharacter() {
  return {
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
  };
}

function createPilotHouseAppState(houseId = "house.kulan.market") {
  const gameState = createInitialState({
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
  });

  gameState.ui.npcInteractionSession = {
    context: {
      type: "house",
      houseId,
      moduleId: "market-house",
    },
    targetCharacterId: "char.kulan_merchant",
    mode: "ai-dialogue",
    dialogue: {
      requestSequence: 0,
      currentRequestId: null,
      status: "awaiting-choice",
      transcript: [],
      displayPages: [
        {
          id: "page-1",
          type: "dialogue",
          speakerId: "char.kulan_merchant",
          speakerName: "钱掌柜",
          text: "客官想问哪一桩？",
        },
      ],
      currentDisplayPageIndex: 0,
      options: [
        {
          id: "option-1",
          label: "善意回应",
          actionText: "想问问今日行情。",
          actionId: "npc-ai-dialogue-select-option:option-1",
          kind: "benevolent",
        },
        {
          id: "option-2",
          label: "中立回应",
          actionText: "随便聊聊。",
          actionId: "npc-ai-dialogue-select-option:option-2",
          kind: "neutral",
        },
        {
          id: "option-3",
          label: "恶意回应",
          actionText: "别绕弯子。",
          actionId: "npc-ai-dialogue-select-option:option-3",
          kind: "hostile",
        },
      ],
      customInputValue: "",
      customInputOpen: false,
      pendingSpecialActionId: null,
      statusNotice: null,
      errorNotice: null,
    },
  };

  return {
    gameState,
    characterDefinitions: [
      createPlayerCharacter(),
      {
        ...createPlayerCharacter(),
        id: "char.kulan_merchant",
        name: "钱掌柜",
        houseId,
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
  };
}

function createPilotRenderInput(houseId = "house.kulan.market") {
  const activeHouse = {
    id: houseId,
    cityId: "city.kulan",
    name: "货栈",
    type: "merchant",
    characterIds: ["char.kulan_merchant"],
    defaultCharacterId: "char.kulan_merchant",
    moduleId: "market-house",
    backAction: { label: "返回濠州", targetView: "city" },
  };
  const moduleViewModel = {
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
    dialogue: null,
    actionContainer: {
      actions: [
        {
          id: "market:trade",
          label: "买卖",
        },
        {
          id: "dismiss-dialogue",
          label: "离开",
        },
      ],
    },
    statusCard: null,
    overlay: null,
    leaveAction: { id: "leave-house", label: "离开" },
  };

  return {
    appState: createPilotHouseAppState(houseId),
    playerCharacterId: "char.player",
    mapDefinition: prototypeMap,
    cityDefinition: {
      id: "city.kulan",
      name: "濠州",
      regionId: "region.haozhou",
      mapNodeId: "node.haozhou",
      houseIds: [houseId],
      neighbourCityIds: [],
      travelCost: 1,
      tags: ["city"],
      prosperity: 50,
      danger: 10,
      specialDemand: [],
    },
    cityDefinitions: [],
    houseDefinitions: [activeHouse],
    cityEntries: [],
    cardDefinitions: prototypeCards,
    cityNpcPoolDefinitions: [],
    cityCoordinatesById: {},
    cityNameById: { "city.kulan": "濠州" },
    houseNameById: { [houseId]: "货栈" },
    characterNameById: { "char.kulan_merchant": "钱掌柜" },
    cityPortraits: {},
    presenterOutput: {
      stage: {
        type: "house",
        activeHouse,
        moduleViewModel,
        cityNpcSummaries: [],
      },
      overlay: {
        overlayView: null,
        shouldShowGlobalHud: true,
        locationText: "濠州",
        campaignTravelState: null,
        modalState: null,
        locationDialogueState: null,
        worldIntentState: {
          draftText: "",
          status: "idle",
          currentRequestId: null,
          pendingResolution: null,
          lastError: null,
        },
      },
    },
  };
}

test("eligible Haozhou pilot houses suppress the standalone NPC overlay and visible world-intent bar", () => {
  const {
    applyHouseConversationViewState,
    selectHouseConversationViewState,
  } = require("../.test-dist/application/presenter/house-conversation-view-state.js");
  const renderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");
  const renderInput = createPilotRenderInput("house.kulan.market");

  const viewState = selectHouseConversationViewState({
    appState: renderInput.appState,
    stageOutput: renderInput.presenterOutput.stage,
  });
  const viewModel = applyHouseConversationViewState(
    renderInput.presenterOutput.stage.moduleViewModel,
    viewState
  );

  assert.equal(viewState.hideWorldIntentBar, true);
  assert.equal(viewState.renderInlineNpcDialogue, true);
  assert.equal(viewModel.actionContainer, null);
  assert.match(renderSource, /renderInlineHouseNpcDialogue/u);
  assert.match(renderSource, /data-house-npc-dialogue="inline"/u);
  assert.match(renderSource, /renderInlineNpcDialogue/u);
  assert.match(
    renderSource,
    /houseConversationViewState\??\.renderInlineNpcDialogue === true/u
  );
  assert.match(renderSource, /hideWorldIntentBar/u);
  assert.match(renderSource, /renderWorldIntentShellControl\(input\)/u);
  assert.match(
    renderSource,
    /function renderNpcInteractionOverlay\(input: AppRenderInput\): string \{[\s\S]*selectHouseConversationViewState\([\s\S]*renderInlineNpcDialogue === true[\s\S]*return "";/u
  );
  assert.match(
    renderSource,
    /function renderWorldIntentShellControl\(input: AppRenderInput\): string \{[\s\S]*selectHouseConversationViewState\([\s\S]*hideWorldIntentBar === true[\s\S]*return "";/u
  );
});

test("eligible Haozhou pilot houses also suppress the legacy house dialogue footer while inline AI dialogue is active", () => {
  const {
    applyHouseConversationViewState,
    selectHouseConversationViewState,
  } = require("../.test-dist/application/presenter/house-conversation-view-state.js");
  const renderInput = createPilotRenderInput("house.kulan.market");

  renderInput.presenterOutput.stage.moduleViewModel.dialogue = {
    mode: "character",
    speakerName: "钱掌柜",
    textLines: ["客官是来看货，还是来问路子？"],
    advanceActionId: "advance-greeting",
  };

  const viewState = selectHouseConversationViewState({
    appState: renderInput.appState,
    stageOutput: renderInput.presenterOutput.stage,
  });
  const viewModel = applyHouseConversationViewState(
    renderInput.presenterOutput.stage.moduleViewModel,
    viewState
  );

  assert.equal(viewState.enabled, true);
  assert.equal(viewModel.actionContainer, null);
  assert.equal(viewModel.dialogue, null);
});

test("eligible Haozhou pilot houses forward the house leave action into the inline AI dialogue panel", () => {
  const renderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.match(renderSource, /renderInlineHouseNpcDialogue\(input, houseConversationViewState\)/u);
  assert.match(
    renderSource,
    /inlineHouseLeaveAction:\s*stage\.moduleViewModel\.leaveAction/u
  );
});

test("eligible Haozhou pilot houses compute NPC reopen blocking from the post-pilot house view model instead of the raw legacy house dialogue", () => {
  const renderSource = fs.readFileSync("src/ui/app-render.ts", "utf8");

  assert.doesNotMatch(
    renderSource,
    /houseDialogue:\s*stage\.moduleViewModel\.dialogue/u
  );
  assert.match(
    renderSource,
    /houseDialogue:\s*houseViewModel\.dialogue/u
  );
});
