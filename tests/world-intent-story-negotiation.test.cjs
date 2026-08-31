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
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");
const {
  TEMPLE_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/temple-house.js");
const {
  KEEP_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/keep-house.js");

function createPlayerCharacter() {
  return {
    id: "char.player",
    name: "朱元璋",
    birthYear: 1540,
    age: 27,
    cityId: "city.kulan",
    portraitId: "portrait.player",
    clanId: "clan.red_turban",
    stats: {
      leadership: 60,
      martial: 48,
      intelligence: 62,
      politics: 44,
      charm: 68,
      fame: 20,
      gold: 100,
    },
    stamina: 80,
    availableFunctions: [],
  };
}

function createAbbotCharacter() {
  return {
    id: "char.abbot",
    name: "住持",
    birthYear: 1500,
    age: 67,
    cityId: "city.kulan",
    portraitId: "portrait.abbot",
    title: "方丈",
    stats: {
      leadership: 40,
      martial: 20,
      intelligence: 55,
      politics: 45,
      charm: 58,
      fame: 30,
      gold: 0,
    },
    stamina: 100,
    availableFunctions: [],
  };
}

function createLordCharacter() {
  return {
    id: "char.lord",
    name: "郭子兴",
    birthYear: 1505,
    age: 62,
    cityId: "city.kulan",
    portraitId: "portrait.lord",
    clanId: "clan.red_turban",
    title: "元帅",
    stats: {
      leadership: 80,
      martial: 72,
      intelligence: 66,
      politics: 62,
      charm: 70,
      fame: 88,
      gold: 500,
    },
    stamina: 100,
    availableFunctions: [],
  };
}

function createSeniorMonkCharacter() {
  return {
    id: "char.senior_monk",
    name: "慧空",
    birthYear: 1518,
    age: 49,
    cityId: "city.kulan",
    portraitId: "portrait.senior_monk",
    title: "知客僧",
    stats: {
      leadership: 32,
      martial: 18,
      intelligence: 50,
      politics: 36,
      charm: 42,
      fame: 14,
      gold: 0,
    },
    stamina: 90,
    availableFunctions: [],
  };
}

function createBaseGameState(currentHouseId) {
  const state = createInitialState({
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
    currentView: "house",
  });

  state.runtime.variables[ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage] =
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple;
  state.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown] = 0;
  return state;
}

function createTempleHouseDefinition() {
  return {
    id: "house.kulan.temple",
    cityId: "city.kulan",
    name: "皇觉寺",
    type: "temple",
    characterIds: ["char.abbot", "char.senior_monk"],
    defaultCharacterId: "char.abbot",
    requiresPlayerCurrentCityMatch: true,
    moduleId: "temple-house",
    backAction: {
      label: "返回城内",
      targetView: "city",
    },
  };
}

function createKeepHouseDefinition() {
  return {
    id: "house.kulan.keep",
    cityId: "city.kulan",
    name: "帅府",
    type: "castle",
    characterIds: ["char.lord"],
    defaultCharacterId: "char.lord",
    requiresPlayerCurrentCityMatch: true,
    moduleId: "keep-house",
    backAction: {
      label: "返回城内",
      targetView: "city",
    },
  };
}

function createAppState(gameState) {
  return {
    gameState,
    characterDefinitions: [
      createPlayerCharacter(),
      createAbbotCharacter(),
      createSeniorMonkCharacter(),
      createLordCharacter(),
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

function createTempleDailyStageOutput() {
  return {
    type: "house",
    activeHouse: createTempleHouseDefinition(),
    moduleViewModel: {
      moduleId: "temple-house",
      houseId: "house.kulan.temple",
      sceneTitle: "皇觉寺",
      standbyRoster: [{ characterId: "char.abbot", name: "住持", isSelected: true }],
      dialogue: null,
      actionContainer: null,
      statusCard: null,
      overlay: null,
      leaveAction: { id: "leave-house", label: "离开寺庙" },
    },
    cityNpcSummaries: [],
  };
}

function createKeepMeetingStageOutput() {
  return {
    type: "house",
    activeHouse: createKeepHouseDefinition(),
    moduleViewModel: {
      moduleId: "keep-house",
      houseId: "house.kulan.keep",
      sceneTitle: "帅府",
      standbyRoster: [{ characterId: "char.lord", name: "郭子兴", isSelected: true }],
      dialogue: null,
      actionContainer: null,
      statusCard: null,
      overlay: null,
      leaveAction: { id: "leave-house", label: "离开帅府" },
    },
    cityNpcSummaries: [],
  };
}

test("Haozhou negotiation registry only exposes the legal temple and keep story nodes for the current house session", () => {
  const {
    selectHaozhouWorldIntentNegotiationNodes,
  } = require("../.test-dist/application/world-intent/world-intent-negotiation-registry.js");

  const templeDailyState = createBaseGameState("house.kulan.temple");
  templeDailyState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked] = false;
  templeDailyState.ui.houseSession = {
    moduleId: "temple-house",
    state: {
      mode: "daily",
      meetingStage: "finished",
      dialogueLines: [],
      dialogueOverride: null,
      dialoguePhase: "open",
      overlay: null,
      selectedTaskId: null,
      selectedWorkPlan: null,
      dailyActionPanel: "root",
    },
  };

  const templeMeetingState = createBaseGameState("house.kulan.temple");
  templeMeetingState.ui.houseSession = {
    moduleId: "temple-house",
    state: {
      mode: "meeting",
      meetingStage: "assign-duty",
      dialogueLines: [],
      dialogueOverride: null,
      dialoguePhase: "open",
      overlay: null,
      selectedTaskId: null,
      selectedWorkPlan: null,
      dailyActionPanel: "root",
    },
  };

  const keepMeetingState = createBaseGameState("house.kulan.keep");
  keepMeetingState.ui.houseSession = {
    moduleId: "keep-house",
    state: {
      mode: "meeting",
      meetingStage: "assign-task",
      dialogueLines: [],
      dialoguePhase: "open",
      overlay: null,
      selectedTaskId: null,
      contributionEntries: [],
    },
  };

  assert.deepEqual(
    selectHaozhouWorldIntentNegotiationNodes({
      appState: createAppState(templeDailyState),
      stageOutput: createTempleDailyStageOutput(),
    }).map((node) => node.nodeId),
    ["temple.request-early-begging"]
  );
  assert.deepEqual(
    selectHaozhouWorldIntentNegotiationNodes({
      appState: createAppState(templeMeetingState),
      stageOutput: createTempleDailyStageOutput(),
    }).map((node) => node.nodeId),
    ["temple.review-work-plan-negotiation"]
  );
  assert.deepEqual(
    selectHaozhouWorldIntentNegotiationNodes({
      appState: createAppState(keepMeetingState),
      stageOutput: createKeepMeetingStageOutput(),
    }).map((node) => node.nodeId),
    ["keep.assignment-negotiation"]
  );
});

test("Haozhou negotiation registry resolves AI negotiation intents into local house action ids", () => {
  const {
    resolveHaozhouWorldIntentNegotiationAction,
  } = require("../.test-dist/application/world-intent/world-intent-negotiation-registry.js");

  assert.deepEqual(
    resolveHaozhouWorldIntentNegotiationAction({
      nodeId: "temple.request-early-begging",
      approach: "plea",
    }),
    {
      actionId: "world-intent:temple-request-early-begging:plea",
    }
  );
  assert.deepEqual(
    resolveHaozhouWorldIntentNegotiationAction({
      nodeId: "temple.review-work-plan-negotiation",
      approach: "competence",
    }),
    {
      actionId: "world-intent:temple-review-work-plan-negotiation:competence",
    }
  );
  assert.deepEqual(
    resolveHaozhouWorldIntentNegotiationAction({
      nodeId: "keep.assignment-negotiation",
      approach: "duty",
    }),
    {
      actionId: "world-intent:keep-assignment-negotiation:duty",
    }
  );
});

test("temple house accepts world-intent early begging negotiation through its own local state owner", () => {
  const {
    templeHouseHouseModule,
  } = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
  const {
    createInitialTempleHouseSessionState,
  } = require("../.test-dist/application/house-modules/temple-house/temple-house-session-state.js");

  const gameState = createBaseGameState("house.kulan.temple");
  gameState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked] = false;

  const result = templeHouseHouseModule.dispatch({
    gameState,
    characterDefinitions: [
      createPlayerCharacter(),
      createAbbotCharacter(),
      createSeniorMonkCharacter(),
    ],
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: {
      ...createInitialTempleHouseSessionState("daily", "finished", ["寺内晨课已毕。"]),
      dialoguePhase: "open",
    },
    request: {
      type: "action",
      actionId: "world-intent:temple-request-early-begging:plea",
    },
  });

  assert.equal(
    result.gameState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked],
    true
  );
  assert.equal(
    result.gameState.runtime.variables[TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan],
    "beg-alms"
  );
  assert.equal(result.sessionState?.dialoguePhase, "open");
});

test("temple house accepts world-intent review negotiation and routes the result through the local beg-alms assignment owner", () => {
  const {
    templeHouseHouseModule,
  } = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
  const {
    createInitialTempleHouseSessionState,
  } = require("../.test-dist/application/house-modules/temple-house/temple-house-session-state.js");

  const gameState = createBaseGameState("house.kulan.temple");
  gameState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked] = false;

  const result = templeHouseHouseModule.dispatch({
    gameState,
    characterDefinitions: [
      createPlayerCharacter(),
      createAbbotCharacter(),
      createSeniorMonkCharacter(),
    ],
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: {
      ...createInitialTempleHouseSessionState("meeting", "assign-duty", ["你准备接下何种寺务？"]),
      dialoguePhase: "open",
    },
    request: {
      type: "action",
      actionId: "world-intent:temple-review-work-plan-negotiation:competence",
    },
  });

  assert.equal(
    result.gameState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked],
    true
  );
  assert.equal(result.sessionState?.mode, "daily");
  assert.equal(result.sessionState?.selectedWorkPlan, "beg-alms");
});

test("keep house accepts world-intent assignment negotiation and keeps assignment authority inside the keep module", () => {
  const {
    keepHouseHouseModule,
  } = require("../.test-dist/application/house-modules/keep-house/keep-house-house-module.js");
  const {
    createInitialKeepHouseSessionState,
  } = require("../.test-dist/application/house-modules/keep-house/keep-house-session-state.js");

  const gameState = createBaseGameState("house.kulan.keep");
  const result = keepHouseHouseModule.dispatch({
    gameState,
    characterDefinitions: [createPlayerCharacter(), createLordCharacter()],
    houseDefinition: createKeepHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: {
      ...createInitialKeepHouseSessionState(
        "meeting",
        "assign-task",
        ["有谁愿意领下这桩差事？"],
        []
      ),
      dialoguePhase: "open",
    },
    request: {
      type: "action",
      actionId: "world-intent:keep-assignment-negotiation:competence",
    },
  });

  assert.equal(typeof result.sessionState?.selectedTaskId, "string");
  assert.notEqual(result.sessionState?.selectedTaskId, "");
  assert.notEqual(result.gameState.ui.mainHouseMissionText, "");
});
