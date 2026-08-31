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
    portraitId: "portrait.player",
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

function createBaseAppState({
  currentView = "house",
  currentHouseId = "house.kulan.temple",
} = {}) {
  const gameState = createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId,
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
    currentView,
  });
  gameState.runtime.variables["var.story.zhu_yuanzhang.stage"] =
    "huangjue-temple";

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

function createCityDefinitions() {
  return [
    {
      id: "city.kulan",
      name: "濠州",
      regionId: "region.haozhou",
      mapNodeId: "node.haozhou",
      houseIds: [
        "house.kulan.temple",
        "house.kulan.market",
        "house.kulan.keep",
      ],
      neighbourCityIds: [],
      travelCost: 1,
      tags: ["city"],
      prosperity: 50,
      danger: 10,
      specialDemand: [],
    },
  ];
}

function createHouseDefinitions() {
  return [
    {
      id: "house.kulan.temple",
      cityId: "city.kulan",
      name: "皇觉寺",
      type: "temple",
      characterIds: ["char.abbot", "char.novice"],
      defaultCharacterId: "char.abbot",
      requiresPlayerCurrentCityMatch: true,
      moduleId: "temple-house",
      backAction: {
        label: "返回城内",
        targetView: "city",
      },
    },
    {
      id: "house.kulan.market",
      cityId: "city.kulan",
      name: "商铺",
      type: "merchant",
      characterIds: ["char.shopkeeper"],
      defaultCharacterId: "char.shopkeeper",
      requiresPlayerCurrentCityMatch: true,
      moduleId: "market-house",
      backAction: {
        label: "返回城内",
        targetView: "city",
      },
    },
    {
      id: "house.kulan.keep",
      cityId: "city.kulan",
      name: "帅府",
      type: "castle",
      characterIds: ["char.guard"],
      defaultCharacterId: "char.guard",
      requiresPlayerCurrentCityMatch: true,
      moduleId: "keep-house",
      backAction: {
        label: "返回城内",
        targetView: "city",
      },
    },
  ];
}

function createHouseAccessRefusalRules() {
  return [
    {
      id: "access.keep.blocked",
      houseIds: ["house.kulan.keep"],
      speakerCharacterId: "char.guard",
      title: "帅府",
      text: "今日不见客。",
      confirmLabel: "知道了",
    },
  ];
}

function createHouseStageOutput() {
  return {
    type: "house",
    activeHouse: createHouseDefinitions()[0],
    moduleViewModel: {
      moduleId: "temple-house",
      houseId: "house.kulan.temple",
      sceneTitle: "皇觉寺",
      sceneSubtitle: "晨钟未歇",
      standbyRoster: [
        {
          characterId: "char.abbot",
          name: "住持",
          isSelected: true,
        },
        {
          characterId: "char.novice",
          name: "小沙弥",
          disabled: true,
        },
      ],
      dialogue: null,
      actionContainer: {
        actions: [
          {
            id: "temple-work",
            label: "寺内干活",
          },
          {
            id: "request-begging",
            label: "请求外出化缘",
          },
          {
            id: "dismiss-dialogue",
            label: "离开",
          },
        ],
      },
      statusCard: null,
      overlay: null,
      leaveAction: {
        id: "leave-house",
        label: "离开寺庙",
      },
    },
    cityNpcSummaries: [],
  };
}

test("world-intent action coordinator contracts exist and main shell wires inline input plus advance handling through it", () => {
  const coordinatorSource = fs.readFileSync(
    "src/application/runtime/world-intent-action-coordinator.ts",
    "utf8"
  );
  const mainSource = fs.readFileSync("src/main.ts", "utf8");

  assert.match(coordinatorSource, /createWorldIntentActionCoordinator/u);
  assert.match(coordinatorSource, /selectWorldIntentCapabilitySnapshotForApp/u);
  assert.match(coordinatorSource, /handleLocationDialogueAdvance/u);
  assert.match(mainSource, /createWorldIntentActionCoordinator/u);
  assert.match(mainSource, /data-world-intent-action/u);
  assert.match(mainSource, /data-world-intent-input/u);
  assert.match(mainSource, /handleLocationDialogueAdvance/u);
  assert.match(mainSource, /createInitialAppWorldIntentState/u);
});

test("world-intent action coordinator builds the live city-house capability snapshot from the current stage owner", () => {
  const {
    selectWorldIntentCapabilitySnapshotForApp,
  } = require("../.test-dist/application/runtime/world-intent-action-coordinator.js");

  const snapshot = selectWorldIntentCapabilitySnapshotForApp({
    appState: createBaseAppState(),
    stageOutput: createHouseStageOutput(),
    cityDefinitions: createCityDefinitions(),
    houseDefinitions: createHouseDefinitions(),
    houseAccessRefusalRules: createHouseAccessRefusalRules(),
  });

  assert.equal(snapshot.cityId, "city.kulan");
  assert.equal(snapshot.currentHouseId, "house.kulan.temple");
  assert.equal(snapshot.currentHouseModuleId, "temple-house");
  assert.deepEqual(
    snapshot.reachableHouses.map((house) => house.houseId),
    ["house.kulan.temple", "house.kulan.market"]
  );
  assert.deepEqual(
    snapshot.talkTargets.map((target) => target.characterId),
    ["char.abbot"]
  );
  assert.deepEqual(
    snapshot.serviceActions.map((action) => action.actionId),
    ["temple-work", "request-begging"]
  );
  assert.equal(snapshot.leaveAction?.actionId, "leave-house");
});

test("world-intent action coordinator defers a go-to-house resolution into bottom-dialogue feedback before entering through the existing house owner", () => {
  const {
    createWorldIntentActionCoordinator,
  } = require("../.test-dist/application/runtime/world-intent-action-coordinator.js");

  let appState = createBaseAppState();
  const sideEffects = [];
  const coordinator = createWorldIntentActionCoordinator({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {
      sideEffects.push("render");
    },
    getStageOutput: () => createHouseStageOutput(),
    cityDefinitions: createCityDefinitions(),
    houseDefinitions: createHouseDefinitions(),
    houseAccessRefusalRules: createHouseAccessRefusalRules(),
    worldIntentRuntime: {
      dispatch() {},
      cancelActiveRequest() {},
    },
    enterHouse: (houseId) => {
      sideEffects.push(["enter-house", houseId]);
    },
    leaveHouse() {},
    dispatchHouseAction() {},
    openNpcTalk() {},
  });

  coordinator.handleResolvedIntent({
    requestId: "world-intent-request-1",
    result: {
      intent: "go-to-house",
      targetHouseId: "house.kulan.market",
      shortNarration: "你起身往商铺那边走去。",
      confidence: 0.99,
    },
  });

  assert.equal(appState.locationDialogueState?.type, "world-intent-feedback");
  assert.deepEqual(appState.locationDialogueState?.textLines, [
    "你起身往商铺那边走去。",
  ]);
  assert.equal(appState.worldIntentState.pendingResolution?.result.intent, "go-to-house");
  assert.deepEqual(
    sideEffects.filter((entry) => Array.isArray(entry)),
    []
  );

  const handled = coordinator.handleLocationDialogueAdvance();

  assert.equal(handled, true);
  assert.deepEqual(sideEffects.filter((entry) => Array.isArray(entry)), [
    ["enter-house", "house.kulan.market"],
  ]);
  assert.equal(appState.locationDialogueState, null);
  assert.equal(appState.worldIntentState.pendingResolution, null);
  assert.equal(appState.worldIntentState.status, "idle");
});

test("world-intent action coordinator routes talk-to-npc into the existing NPC AI talk owner after inline feedback advances", () => {
  const {
    createWorldIntentActionCoordinator,
  } = require("../.test-dist/application/runtime/world-intent-action-coordinator.js");

  let appState = createBaseAppState();
  const talkRequests = [];
  const coordinator = createWorldIntentActionCoordinator({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    getStageOutput: () => createHouseStageOutput(),
    cityDefinitions: createCityDefinitions(),
    houseDefinitions: createHouseDefinitions(),
    houseAccessRefusalRules: createHouseAccessRefusalRules(),
    worldIntentRuntime: {
      dispatch() {},
      cancelActiveRequest() {},
    },
    enterHouse() {},
    leaveHouse() {},
    dispatchHouseAction() {},
    openNpcTalk: (input) => {
      talkRequests.push(input);
    },
  });

  coordinator.handleResolvedIntent({
    requestId: "world-intent-request-2",
    result: {
      intent: "talk-to-npc",
      targetCharacterId: "char.abbot",
      shortNarration: "你转向住持，双手合十开口问候。",
      confidence: 0.96,
    },
  });

  assert.equal(talkRequests.length, 0);

  coordinator.handleLocationDialogueAdvance();

  assert.deepEqual(talkRequests, [
    {
      targetCharacterId: "char.abbot",
      context: {
        type: "house",
        houseId: "house.kulan.temple",
        moduleId: "temple-house",
      },
    },
  ]);
  assert.equal(appState.worldIntentState.pendingResolution, null);
});

test("world-intent action coordinator fails closed when AI returns a negotiation approach the current node does not expose", () => {
  const {
    createWorldIntentActionCoordinator,
  } = require("../.test-dist/application/runtime/world-intent-action-coordinator.js");

  let appState = createBaseAppState();
  const negotiations = [];
  const coordinator = createWorldIntentActionCoordinator({
    getAppState: () => appState,
    setAppState: (nextAppState) => {
      appState = nextAppState;
    },
    renderApp: () => {},
    getStageOutput: () => createHouseStageOutput(),
    cityDefinitions: createCityDefinitions(),
    houseDefinitions: createHouseDefinitions(),
    houseAccessRefusalRules: createHouseAccessRefusalRules(),
    worldIntentRuntime: {
      dispatch() {},
      cancelActiveRequest() {},
    },
    enterHouse() {},
    leaveHouse() {},
    dispatchHouseAction() {},
    openNpcTalk() {},
    selectNegotiableStoryNodes: () => [
      {
        nodeId: "temple.request-early-begging",
        label: "说服住持提前外出化缘",
        allowedApproaches: ["plea", "pragmatic"],
        targetCharacterId: "char.abbot",
      },
    ],
    negotiateStoryNode: (input) => {
      negotiations.push(input);
    },
  });

  coordinator.handleResolvedIntent({
    requestId: "world-intent-request-3",
    result: {
      intent: "negotiate-story-node",
      nodeId: "temple.request-early-begging",
      targetCharacterId: "char.abbot",
      approach: "defiant",
      confidence: 0.88,
    },
  });

  assert.deepEqual(negotiations, []);
  assert.equal(appState.locationDialogueState?.type, "world-intent-feedback");
  assert.equal(appState.locationDialogueState?.intentStatus, "refusal");
  assert.equal(appState.worldIntentState.pendingResolution, null);
});
