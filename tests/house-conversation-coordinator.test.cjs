const test = require("node:test");
const assert = require("node:assert/strict");

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
    currentCityId: houseId.startsWith("house.yingtian.")
      ? "city.yingtian"
      : "city.kulan",
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

  return {
    gameState,
    characterDefinitions: [createPlayerCharacter()],
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

function createHouseDefinition(houseId) {
  if (houseId === "home_001") {
    return {
      id: "home_001",
      cityId: "city.kulan",
      name: "自宅",
      type: "residence",
      moduleId: "home-house",
      characterIds: ["char.player"],
      defaultCharacterId: "char.player",
      backAction: { label: "返回濠州", targetView: "city" },
    };
  }

  if (houseId === "house.kulan.temple_txt_narrative") {
    return {
      id: houseId,
      cityId: "city.kulan",
      name: "皇觉寺（文游）",
      type: "temple",
      moduleId: "txt-narrative-place",
      characterIds: ["char.kulan_temple_abbot"],
      defaultCharacterId: "char.kulan_temple_abbot",
      backAction: { label: "返回濠州", targetView: "city" },
    };
  }

  return {
    id: houseId,
    cityId: houseId.startsWith("house.yingtian.")
      ? "city.yingtian"
      : "city.kulan",
    name: "货栈",
    type: "merchant",
    moduleId: "market-house",
    characterIds: ["char.kulan_merchant"],
    defaultCharacterId: "char.kulan_merchant",
    backAction: { label: "返回濠州", targetView: "city" },
  };
}

function createHouseStageOutput(houseId = "house.kulan.market") {
  const activeHouse = createHouseDefinition(houseId);

  return {
    type: "house",
    activeHouse,
    moduleViewModel: {
      moduleId: activeHouse.moduleId,
      houseId,
      sceneTitle: activeHouse.name,
      standbyRoster: [
        {
          characterId: activeHouse.defaultCharacterId ?? "char.kulan_merchant",
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
    },
    cityNpcSummaries: [],
  };
}

test("Haozhou pilot auto-starts the default NPC only for eligible standard houses", () => {
  const {
    selectHaozhouHouseConversationPilotState,
  } = require("../.test-dist/application/house-conversation/haozhou-house-conversation-policy.js");

  const state = createPilotHouseAppState("house.kulan.market");
  const pilotState = selectHaozhouHouseConversationPilotState({
    appState: state,
    stageOutput: createHouseStageOutput("house.kulan.market"),
  });

  assert.equal(pilotState.enabled, true);
  assert.equal(pilotState.defaultTargetCharacterId, "char.kulan_merchant");
  assert.equal(pilotState.hideActionContainer, true);
  assert.equal(pilotState.hideWorldIntentBar, true);
  assert.equal(pilotState.reason, "eligible");
});

test("temple_txt_narrative and home_001 stay outside the hidden pilot", () => {
  const {
    selectHaozhouHouseConversationPilotState,
  } = require("../.test-dist/application/house-conversation/haozhou-house-conversation-policy.js");

  assert.equal(
    selectHaozhouHouseConversationPilotState({
      appState: createPilotHouseAppState("house.kulan.temple_txt_narrative"),
      stageOutput: createHouseStageOutput("house.kulan.temple_txt_narrative"),
    }).enabled,
    false
  );
  assert.equal(
    selectHaozhouHouseConversationPilotState({
      appState: createPilotHouseAppState("home_001"),
      stageOutput: createHouseStageOutput("home_001"),
    }).reason,
    "excluded-house"
  );
});

test("house conversation action coordinator exposes the pilot entry seam without dispatching later route behavior", () => {
  const {
    createHouseConversationActionCoordinator,
  } = require("../.test-dist/application/runtime/house-conversation-action-coordinator.js");

  let state = createPilotHouseAppState("house.kulan.market");
  const coordinator = createHouseConversationActionCoordinator({
    getAppState: () => state,
    setAppState: (nextState) => {
      state = nextState;
    },
    getStageOutput: () => createHouseStageOutput("house.kulan.market"),
    renderApp() {},
  });

  const result = coordinator.selectPilotState();

  assert.equal(result.enabled, true);
  assert.equal(result.defaultTargetCharacterId, "char.kulan_merchant");
  assert.equal(typeof coordinator.handleHouseConversationAction, "function");
});

