const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  templeHouseHouseModule,
} = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
const {
  KEEP_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/keep-house.js");
const {
  TEMPLE_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/temple-house.js");
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

const playerCharacterId = "char.player";
const templeHouse = {
  id: "house.kulan.temple",
  cityId: "city.kulan",
  name: "皇觉寺",
  type: "temple",
  moduleId: "temple-house",
  characterIds: ["char.abbot", "char.senior-monk"],
  defaultCharacterId: "char.abbot",
};

function createTempleState() {
  const baseState = createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: templeHouse.id,
    playerCharacterId,
    chapterId: "chapter.test",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "house",
    councilDate: {
      year: 1567,
      month: 2,
      day: 1,
    },
    cards: {
      ownedCardIds: [],
      selectedCardId: null,
    },
    valuables: {
      items: [],
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
  });

  return {
    ...baseState,
    runtime: {
      ...baseState.runtime,
      flags: {
        ...baseState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
      },
      variables: {
        ...baseState.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
      },
    },
  };
}

function createTempleCharacters() {
  return [
    createCharacter(playerCharacterId, "玩家", "city.kulan", 100, 500),
    createCharacter("char.abbot", "住持", "city.kulan", 100, 0, {
      houseId: templeHouse.id,
      title: "方丈",
    }),
    createCharacter("char.senior-monk", "师兄", "city.kulan", 100, 0, {
      houseId: templeHouse.id,
      title: "师兄",
    }),
  ];
}

function createCharacter(id, name, cityId, stamina, gold, extra = {}) {
  return {
    id,
    name,
    birthYear: 1540,
    deathYear: null,
    age: 27,
    cityId,
    portraitId: `${id}.portrait`,
    stats: {
      leadership: 10,
      martial: 10,
      intelligence: 10,
      politics: 10,
      charm: 10,
      fame: 0,
      gold,
    },
    stamina,
    availableFunctions: [],
    ...extra,
  };
}

function createTempleActivityDefinitionsById() {
  return {
    "activity.test.temple.sweep-courtyard": {
      id: "activity.test.temple.sweep-courtyard",
      label: "sweep courtyard test",
      handlerId: "generic.qte",
      houseModuleId: "temple-house",
      taskId: "sweep-courtyard",
      missionId: "mission.temple.sweep-courtyard",
      titleTextId: "test.temple.task.sweep.title",
      briefingTextId: "test.temple.task.sweep.briefing",
      orderLineTextIds: [
        "test.temple.task.sweep.order.001",
        "test.temple.task.sweep.order.002",
      ],
    },
    "activity.test.temple.carry-water": {
      id: "activity.test.temple.carry-water",
      label: "carry water test",
      handlerId: "generic.qte",
      houseModuleId: "temple-house",
      taskId: "carry-water",
      missionId: "mission.temple.carry-water",
      titleTextId: "test.temple.task.carry.title",
      briefingTextId: "test.temple.task.carry.briefing",
      orderLineTextIds: [
        "test.temple.task.carry.order.001",
        "test.temple.task.carry.order.002",
      ],
    },
  };
}

function createTempleTextEntries() {
  return {
    "test.temple.task.sweep.title": "扫院子",
    "test.temple.task.sweep.briefing": "把寺院前庭打扫干净。",
    "test.temple.task.sweep.order.001": "先把落叶扫净。",
    "test.temple.task.sweep.order.002": "再把台阶冲洗一遍。",
    "test.temple.task.carry.title": "挑水",
    "test.temple.task.carry.briefing": "把今日用水挑回寺里。",
    "test.temple.task.carry.order.001": "先把木桶装满。",
    "test.temple.task.carry.order.002": "再沿山路稳稳挑回去。",
  };
}

function createTempleWorkEventDefinitionsById() {
  return {
    "event.building.house.kulan.temple.sweep_courtyard": {
      id: "event.building.house.kulan.temple.sweep_courtyard",
      chapterId: "chapter.test",
      name: "皇觉寺 - 打扫庭院",
      occurrence: "repeatable",
      dialogueId: "",
      actions: [
        {
          type: "launchPlayable",
          playableId: "activity-qte",
          integrationId:
            "playable.activity-qte.instance.template.temple-sweep-courtyard",
          ownerContext: {
            ownerKind: "house",
            ownerId: templeHouse.id,
            returnPolicy: "resume-owner",
          },
          payload: {
            activityId: "activity.test.temple.sweep-courtyard",
          },
        },
      ],
    },
    "event.building.house.kulan.temple.carry_water": {
      id: "event.building.house.kulan.temple.carry_water",
      chapterId: "chapter.test",
      name: "皇觉寺 - 挑水",
      occurrence: "repeatable",
      dialogueId: "",
      actions: [
        {
          type: "launchPlayable",
          playableId: "activity-qte",
          integrationId:
            "playable.activity-qte.instance.template.temple-carry-water",
          ownerContext: {
            ownerKind: "house",
            ownerId: templeHouse.id,
            returnPolicy: "resume-owner",
          },
          payload: {
            activityId: "activity.test.temple.carry-water",
          },
        },
      ],
    },
  };
}

function createTempleWorkEventBindings() {
  return [
    {
      id: "binding.building.house.kulan.temple.sweep_courtyard.container-item",
      eventId: "event.building.house.kulan.temple.sweep_courtyard",
      owner: {
        family: "building",
        id: templeHouse.id,
      },
      trigger: {
        timing: "after",
        action: "building-container-item-action",
        extra: {
          arrangementId: "arrangement.city.kulan.house.kulan.temple",
          containerId: "house.kulan.temple.actions",
          itemId: "sweep-courtyard",
        },
      },
      priority: 100,
      enabled: true,
    },
    {
      id: "binding.building.house.kulan.temple.carry_water.container-item",
      eventId: "event.building.house.kulan.temple.carry_water",
      owner: {
        family: "building",
        id: templeHouse.id,
      },
      trigger: {
        timing: "after",
        action: "building-container-item-action",
        extra: {
          arrangementId: "arrangement.city.kulan.house.kulan.temple",
          containerId: "house.kulan.temple.actions",
          itemId: "carry-water",
        },
      },
      priority: 100,
      enabled: true,
    },
  ];
}

function createTempleDispatchInput(taskId = "sweep-courtyard", overrides = {}) {
  const activityDefinitionsById = createTempleActivityDefinitionsById();
  const textEntriesById = createTempleTextEntries();
  const characterDefinitions = createTempleCharacters();
  const gameState = createTempleState();
  const enterResult = templeHouseHouseModule.enter({
    gameState,
    characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    activityDefinitionsById,
    textEntriesById,
    ...(overrides.eventDefinitionsById == null
      ? {}
      : { eventDefinitionsById: overrides.eventDefinitionsById }),
    ...(overrides.eventBindings == null
      ? {}
      : { eventBindings: overrides.eventBindings }),
  });

  const assignResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
      dailyActionPanel: "work",
    },
    request: { type: "action", actionId: `assign-temple-task:${taskId}` },
    activityDefinitionsById,
    textEntriesById,
    ...(overrides.eventDefinitionsById == null
      ? {}
      : { eventDefinitionsById: overrides.eventDefinitionsById }),
    ...(overrides.eventBindings == null
      ? {}
      : { eventBindings: overrides.eventBindings }),
  });

  assert.equal(assignResult.sessionState?.overlay?.type, "activity-confirm");

  return {
    activityDefinitionsById,
    textEntriesById,
    assignResult,
  };
}

test("temple sweep courtyard can launch from mirrored pack event data without leaving the house shell", () => {
  const { activityDefinitionsById, textEntriesById, assignResult } =
    createTempleDispatchInput("sweep-courtyard", {
      eventDefinitionsById: createTempleWorkEventDefinitionsById(),
      eventBindings: createTempleWorkEventBindings(),
    });

  const result = templeHouseHouseModule.dispatch({
    gameState: assignResult.gameState,
    characterDefinitions: assignResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-temple-task:sweep-courtyard",
    },
    activityDefinitionsById,
    textEntriesById,
    eventDefinitionsById: createTempleWorkEventDefinitionsById(),
    eventBindings: createTempleWorkEventBindings(),
  });

  assert.equal(result.sessionState?.overlay, null);
  assert.equal(result.sessionState?.selectedTaskId, "sweep-courtyard");
  assert.equal(result.gameState.ui.currentView, "house");
  assert.equal(
    result.gameState.runtime.playableSession?.integrationId,
    "playable.activity-qte.instance.template.temple-sweep-courtyard"
  );
});

test("temple sweep courtyard still falls back to the builtin temple playable launch when pack event data is unavailable", () => {
  const { activityDefinitionsById, textEntriesById, assignResult } =
    createTempleDispatchInput("sweep-courtyard");

  const result = templeHouseHouseModule.dispatch({
    gameState: assignResult.gameState,
    characterDefinitions: assignResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-temple-task:sweep-courtyard",
    },
    activityDefinitionsById,
    textEntriesById,
  });

  assert.equal(
    result.gameState.runtime.playableSession?.integrationId,
    "playable.activity-qte.house.temple"
  );
});

test("temple carry water can launch from mirrored pack event data without leaving the house shell", () => {
  const { activityDefinitionsById, textEntriesById, assignResult } =
    createTempleDispatchInput("carry-water", {
      eventDefinitionsById: createTempleWorkEventDefinitionsById(),
      eventBindings: createTempleWorkEventBindings(),
    });

  const result = templeHouseHouseModule.dispatch({
    gameState: assignResult.gameState,
    characterDefinitions: assignResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-temple-task:carry-water",
    },
    activityDefinitionsById,
    textEntriesById,
    eventDefinitionsById: createTempleWorkEventDefinitionsById(),
    eventBindings: createTempleWorkEventBindings(),
  });

  assert.equal(result.sessionState?.overlay, null);
  assert.equal(result.sessionState?.selectedTaskId, "carry-water");
  assert.equal(result.gameState.ui.currentView, "house");
  assert.equal(
    result.gameState.runtime.playableSession?.integrationId,
    "playable.activity-qte.instance.template.temple-carry-water"
  );
});

test("temple carry water still falls back to the builtin temple playable launch when pack event data is unavailable", () => {
  const { activityDefinitionsById, textEntriesById, assignResult } =
    createTempleDispatchInput("carry-water");

  const result = templeHouseHouseModule.dispatch({
    gameState: assignResult.gameState,
    characterDefinitions: assignResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-temple-task:carry-water",
    },
    activityDefinitionsById,
    textEntriesById,
  });

  assert.equal(
    result.gameState.runtime.playableSession?.integrationId,
    "playable.activity-qte.house.temple"
  );
});
