const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createPrototypeCharactersForStoryStage,
  prototypeCards,
  prototypeHouseAccessRefusalRules,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const {
  selectHouseEntryAccess,
} = require("../.test-dist/application/story/story-stage-access.js");
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
  readZhuYuanzhangStoryStage,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

const playerCharacterId = "char.player";

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
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
        swordId: null,
        armorId: null,
      },
    },
    currentView: "house",
  });
}

function createStoryStageState(storyStage) {
  const state = createBaseState();
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]: storyStage,
      },
    },
  };
}

function createMonkStageState() {
  return createStoryStageState(ZHU_YUANZHANG_STORY_STAGES.huangjueTemple);
}

test("zhu yuanzhang story stage reader preserves village opening", () => {
  const villageOpeningState = createStoryStageState(
    ZHU_YUANZHANG_STORY_STAGES.villageOpening
  );

  assert.equal(
    readZhuYuanzhangStoryStage(villageOpeningState),
    ZHU_YUANZHANG_STORY_STAGES.villageOpening
  );
});

test("opening stage blocks outside house access before the opening review", () => {
  const villageOpeningState = createStoryStageState(
    ZHU_YUANZHANG_STORY_STAGES.villageOpening
  );
  const villageOpeningCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.villageOpening
  );
  const blockedHouseIds = [
    "house.kulan.grain_shop",
    "house.kulan.market",
    "house.kulan.inn",
  ];

  for (const houseId of blockedHouseIds) {
    const houseDefinition = prototypeHouses.find((house) => house.id === houseId);
    assert.ok(houseDefinition, `Missing test house ${houseId}`);

    const access = selectHouseEntryAccess(
      villageOpeningState,
      villageOpeningCharacters,
      houseDefinition,
      prototypeHouseAccessRefusalRules
    );

    assert.equal(access.canEnter, false);
    assert.equal(access.refusal?.text, "既然答应了主持，就先不要离开寺院吧。");
  }
});

test("first temple review blocks outside house access before the opening review", () => {
  const monkState = createMonkStageState();
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const blockedHouseIds = [
    "house.kulan.grain_shop",
    "house.kulan.market",
    "house.kulan.inn",
  ];

  for (const houseId of blockedHouseIds) {
    const houseDefinition = prototypeHouses.find((house) => house.id === houseId);
    assert.ok(houseDefinition, `Missing test house ${houseId}`);

    const access = selectHouseEntryAccess(
      monkState,
      monkCharacters,
      houseDefinition,
      prototypeHouseAccessRefusalRules
    );

    assert.equal(access.canEnter, false);
    assert.equal(access.refusal?.text, "既然答应了主持，就先不要离开寺院吧。");
  }
});

test("opening stage blocks keep house access before joining Guo Zixing", () => {
  const villageOpeningState = createStoryStageState(
    ZHU_YUANZHANG_STORY_STAGES.villageOpening
  );
  const villageOpeningCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.villageOpening
  );
  const keepHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.keep"
  );
  assert.ok(keepHouse);

  const keepAccess = selectHouseEntryAccess(
    villageOpeningState,
    villageOpeningCharacters,
    keepHouse,
    prototypeHouseAccessRefusalRules
  );

  assert.equal(keepAccess.canEnter, false);
  assert.equal(keepAccess.refusal?.speakerCharacterId, "char.kulan_soldier");
  assert.equal(keepAccess.refusal?.text, "军机要出，请阁下回避。");
});

test("long-distance begging blocks haozhou houses except temple with player evacuation line", () => {
  const beggingJourneyState = createStoryStageState(
    ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
  );
  const characters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
  );
  const templeHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.temple"
  );
  const grainShopHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.grain_shop"
  );
  const marketHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.market"
  );
  const keepHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.keep"
  );
  assert.ok(templeHouse);
  assert.ok(grainShopHouse);
  assert.ok(marketHouse);
  assert.ok(keepHouse);

  const templeAccess = selectHouseEntryAccess(
    beggingJourneyState,
    characters,
    templeHouse,
    prototypeHouseAccessRefusalRules
  );
  assert.equal(templeAccess.canEnter, true);

  for (const houseDefinition of [grainShopHouse, marketHouse, keepHouse]) {
    const access = selectHouseEntryAccess(
      beggingJourneyState,
      characters,
      houseDefinition,
      prototypeHouseAccessRefusalRules
    );

    assert.equal(access.canEnter, false);
    assert.equal(access.refusal?.speakerCharacterId, playerCharacterId);
    assert.equal(access.refusal?.text, "看来店主已经避难去了");
  }
});

test("long-distance begging evacuation rule is scoped to haozhou only", () => {
  const beggingJourneyState = createStoryStageState(
    ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
  );
  const characters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
  );
  const luzhouGrainShop = {
    id: "house.luzhou.grain_shop",
    cityId: "city.luzhou",
    name: "庐州粮铺",
    type: "merchant",
    characterIds: [],
    defaultCharacterId: null,
    moduleId: "grain-shop",
    backAction: { label: "返回", targetView: "city" },
  };

  const access = selectHouseEntryAccess(
    beggingJourneyState,
    characters,
    luzhouGrainShop,
    prototypeHouseAccessRefusalRules
  );

  assert.equal(access.canEnter, true);
});

test("script editor location-access template includes opening entry blockers", () => {
  const locationAccessPath = path.join(
    __dirname,
    "..",
    "src",
    "modules",
    "script-editor",
    "builtin-templates",
    "zhuyuanzhang",
    "location-access.json"
  );
  const locationAccessEntries = JSON.parse(
    fs.readFileSync(locationAccessPath, "utf8")
  );

  assert.equal(
    locationAccessEntries.some((entry) => entry.id.includes("first_review_stay")),
    true
  );
  assert.equal(
    locationAccessEntries.some((entry) => entry.id.includes("keep_closed")),
    true
  );
});

test("first temple review blocks leaving the temple house", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const templeHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.temple"
  );
  assert.ok(templeHouse);

  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...createMonkStageState(),
      runtime: {
        ...createMonkStageState().runtime,
        variables: {
          ...createMonkStageState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const leaveResult = templeHouseHouseModule.leave({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.deepEqual(leaveResult.navigation, { type: "stay-in-house" });
  assert.deepEqual(leaveResult.sessionState?.dialogueOverride?.textLines, [
    "既然答应了主持，就先不要离开寺院吧。",
  ]);
});

test("first tutorial work period still blocks leaving the temple", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const templeHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.temple"
  );
  assert.ok(templeHouse);

  const baseState = createMonkStageState();
  const firstWorkState = {
    ...baseState,
    runtime: {
      ...baseState.runtime,
      flags: {
        ...baseState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted]: false,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
      },
      variables: {
        ...baseState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
      },
    },
  };

  const enterResult = templeHouseHouseModule.enter({
    gameState: firstWorkState,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const leaveResult = templeHouseHouseModule.leave({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.deepEqual(leaveResult.navigation, { type: "stay-in-house" });
  assert.deepEqual(leaveResult.sessionState?.dialogueOverride?.textLines, [
    "既然答应了主持，就先不要离开寺院吧。",
  ]);
});
