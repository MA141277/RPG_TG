const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  applyHouseModulePackEventById,
} = require("../.test-dist/application/house/house-module-pack-event-runtime.js");
const {
  templeHouseHouseModule,
} = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

function createHouseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "house",
  });
}

function createTempleLeaveEvent() {
  return {
    id: "event.building.template.house.temple.leave",
    chapterId: "chapter.test",
    name: "Temple Leave",
    occurrence: "repeatable",
    dialogueId: "",
    actions: [{ type: "closeBuilding" }],
  };
}

function createTempleHouseDefinition() {
  return {
    id: "house.kulan.temple",
    cityId: "city.kulan",
    name: "皇觉寺",
    type: "temple",
    moduleId: "temple-house",
    characterIds: ["char.abbot", "char.senior-monk"],
    defaultCharacterId: "char.abbot",
  };
}

function createTempleCharacters() {
  return [
    {
      id: "char.player",
      name: "Player",
      birthYear: 1540,
      deathYear: null,
      age: 27,
      cityId: "city.kulan",
      portraitId: "char.player.portrait",
      stats: {
        leadership: 10,
        martial: 10,
        intelligence: 10,
        politics: 10,
        charm: 10,
        fame: 0,
        gold: 120,
      },
      stamina: 100,
      availableFunctions: [],
    },
    {
      id: "char.abbot",
      name: "住持",
      birthYear: 1520,
      deathYear: null,
      age: 47,
      cityId: "city.kulan",
      portraitId: "char.abbot.portrait",
      stats: {
        leadership: 10,
        martial: 10,
        intelligence: 10,
        politics: 10,
        charm: 10,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      availableFunctions: [],
      houseId: "house.kulan.temple",
      title: "方丈",
    },
    {
      id: "char.senior-monk",
      name: "师兄",
      birthYear: 1530,
      deathYear: null,
      age: 37,
      cityId: "city.kulan",
      portraitId: "char.senior-monk.portrait",
      stats: {
        leadership: 10,
        martial: 10,
        intelligence: 10,
        politics: 10,
        charm: 10,
        fame: 0,
        gold: 0,
      },
      stamina: 100,
      availableFunctions: [],
      houseId: "house.kulan.temple",
      title: "师兄",
    },
  ];
}

function createTempleDispatchState() {
  const baseState = createHouseState();
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
      },
    },
  };
}

test("house module pack event runtime can apply pack-owned close-building events", () => {
  const state = createHouseState();

  const result = applyHouseModulePackEventById({
    state,
    eventDefinitionsById: {
      "event.building.template.house.temple.leave": createTempleLeaveEvent(),
    },
    eventId: "event.building.template.house.temple.leave",
  });

  assert.equal(result.handled, true);
  assert.equal(result.state.world.currentHouseId, null);
  assert.equal(result.state.ui.currentView, "city");
});

test("temple leave uses the pack-owned leave event when the temple exit is not blocked", () => {
  const state = createHouseState();

  const result = templeHouseHouseModule.leave({
    gameState: state,
    characterDefinitions: [{ id: "char.player", name: "Player" }],
    houseDefinition: {
      id: "house.kulan.temple",
      cityId: "city.kulan",
      name: "皇觉寺",
      type: "temple",
      moduleId: "temple-house",
      defaultCharacterId: "char.player",
    },
    playerCharacterId: "char.player",
    sessionState: null,
    eventDefinitionsById: {
      "event.building.template.house.temple.leave": createTempleLeaveEvent(),
    },
    eventBindings: [],
    activityDefinitionsById: {},
    textEntriesById: {},
  });

  assert.equal(result.sessionState, null);
  assert.equal(result.gameState.world.currentHouseId, null);
  assert.equal(result.gameState.ui.currentView, "city");
});

test("temple leave can resolve a pack-owned leave event through the bound item id instead of a fixed event id", () => {
  const state = createHouseState();
  const result = templeHouseHouseModule.leave({
    gameState: state,
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: null,
    eventDefinitionsById: {
      "event.temple.leave.custom": {
        id: "event.temple.leave.custom",
        chapterId: "chapter.test",
        name: "Temple Leave Custom",
        occurrence: "repeatable",
        dialogueId: "",
        actions: [{ type: "closeBuilding" }],
      },
    },
    eventBindings: [
      {
        id: "binding.temple.leave.custom",
        eventId: "event.temple.leave.custom",
        owner: {
          family: "building",
          id: "house.kulan.temple",
        },
        trigger: {
          timing: "after",
          action: "building-container-item-action",
          extra: {
            arrangementId: "arrangement.city.kulan.house.kulan.temple",
            containerId: "house.kulan.temple.actions",
            itemId: "leave",
          },
        },
        priority: 100,
        enabled: true,
      },
    ],
    activityDefinitionsById: {},
    textEntriesById: {},
  });

  assert.equal(result.gameState.world.currentHouseId, null);
  assert.equal(result.gameState.ui.currentView, "city");
});

test("temple donate can project pack-owned donate dialogue paragraphs through the bound item id while keeping the current overlay shell", () => {
  const dispatchState = createTempleDispatchState();
  const enterResult = templeHouseHouseModule.enter({
    gameState: dispatchState,
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
  });

  const result = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-donate" },
    eventDefinitionsById: {
      "event.temple.donate.custom": {
        id: "event.temple.donate.custom",
        chapterId: "chapter.test",
        name: "Temple Donate Custom",
        occurrence: "repeatable",
        dialogueId: "scene.temple.donate.custom",
      },
    },
    eventBindings: [
      {
        id: "binding.temple.donate.custom",
        eventId: "event.temple.donate.custom",
        owner: {
          family: "building",
          id: "house.kulan.temple",
        },
        trigger: {
          timing: "after",
          action: "building-container-item-action",
          extra: {
            arrangementId: "arrangement.city.kulan.house.kulan.temple",
            containerId: "house.kulan.temple.actions",
            itemId: "donate",
          },
        },
        priority: 100,
        enabled: true,
      },
    ],
    dialogueDefinitionsById: {
      "scene.temple.donate.custom": {
        id: "scene.temple.donate.custom",
        name: "Temple Donate Custom Scene",
        nodes: [
          {
            type: "narration",
            textId: "pack.temple.donate.001",
          },
          {
            type: "dialogue",
            characterId: "char.abbot",
            side: "left",
            textId: "pack.temple.donate.002",
          },
        ],
      },
    },
    textEntriesById: {
      "pack.temple.donate.001": "自定义香火说明一。",
      "pack.temple.donate.002": "自定义香火说明二。",
    },
  });

  assert.equal(result.sessionState?.overlay?.type, "donate-confirm");
  assert.deepEqual(result.sessionState?.overlay?.paragraphs, [
    "自定义香火说明一。",
    "自定义香火说明二。",
  ]);
});

test("temple review entry can project pack-owned review dialogue paragraphs through the bound item id while keeping the current meeting shell", () => {
  const enterResult = templeHouseHouseModule.enter({
    gameState: createTempleDispatchState(),
    characterDefinitions: createTempleCharacters(),
    houseDefinition: createTempleHouseDefinition(),
    playerCharacterId: "char.player",
    eventDefinitionsById: {
      "event.temple.review.custom": {
        id: "event.temple.review.custom",
        chapterId: "chapter.test",
        name: "Temple Review Custom",
        occurrence: "repeatable",
        dialogueId: "scene.temple.review.custom",
      },
    },
    eventBindings: [
      {
        id: "binding.temple.review.custom",
        eventId: "event.temple.review.custom",
        owner: {
          family: "building",
          id: "house.kulan.temple",
        },
        trigger: {
          timing: "after",
          action: "building-container-item-action",
          extra: {
            arrangementId: "arrangement.city.kulan.house.kulan.temple",
            containerId: "house.kulan.temple.actions",
            itemId: "review",
          },
        },
        priority: 100,
        enabled: true,
      },
    ],
    dialogueDefinitionsById: {
      "scene.temple.review.custom": {
        id: "scene.temple.review.custom",
        name: "Temple Review Custom Scene",
        nodes: [
          {
            type: "narration",
            textId: "pack.temple.review.001",
          },
          {
            type: "dialogue",
            characterId: "char.abbot",
            side: "left",
            textId: "pack.temple.review.002",
          },
        ],
      },
    },
    textEntriesById: {
      "pack.temple.review.001": "自定义寺评开场一。",
      "pack.temple.review.002": "自定义寺评开场二。",
    },
  });

  assert.equal(enterResult.sessionState?.mode, "meeting");
  assert.equal(enterResult.sessionState?.meetingStage, "intro");
  assert.deepEqual(enterResult.sessionState?.dialogueLines, [
    "自定义寺评开场一。",
    "自定义寺评开场二。",
  ]);
});
