const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createInitialKeepHouseSessionState,
} = require("../.test-dist/application/house-modules/keep-house/keep-house-session-state.js");
const {
  templeHouseHouseModule,
} = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
const {
  keepHouseHouseModule,
} = require("../.test-dist/application/house-modules/keep-house/keep-house-house-module.js");
const {
  leaderResidenceHouseModule,
} = require("../.test-dist/application/house-modules/leader-residence/leader-residence-house-module.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
  createPrototypeCharactersForStoryStage,
} = require("../.test-dist/content/prototype-world.js");
const {
  KEEP_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/keep-house.js");
const {
  LEADER_RESIDENCE_VARIABLE_KEYS,
} = require("../.test-dist/domain/leader-residence.js");
const {
  TEMPLE_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/temple-house.js");
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

const playerCharacterId = "char.player";
const templeHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "temple-house"
);
const keepHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "keep-house"
);
const leaderResidenceHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "leader-residence"
);

assert.ok(templeHouse, "Expected prototype temple house to exist.");
assert.ok(keepHouse, "Expected prototype keep house to exist.");
assert.ok(
  leaderResidenceHouse,
  "Expected prototype leader residence house to exist."
);

function createBaseState(currentHouseId, currentCityId = "city.kulan") {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId,
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

function addTestDays(date, days) {
  const currentNumber = date.year * 360 + (date.month - 1) * 30 + date.day;
  const nextNumber = currentNumber + days;
  const nextYear = Math.floor((nextNumber - 1) / 360);
  const dayOfYear = nextNumber - nextYear * 360;
  const nextMonth = Math.floor((dayOfYear - 1) / 30) + 1;
  const nextDay = ((dayOfYear - 1) % 30) + 1;

  return {
    year: nextYear,
    month: nextMonth,
    day: nextDay,
  };
}

function withCouncilInDays(state, days = 30) {
  return {
    ...state,
    world: {
      ...state.world,
      schedule: {
        ...state.world.schedule,
        councilDate: addTestDays(state.calendar, days),
      },
    },
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: days,
      },
    },
  };
}

function createTempleWorkState() {
  const state = withCouncilInDays(createBaseState(templeHouse.id, templeHouse.cityId), 30);

  return {
    ...state,
    runtime: {
      ...state.runtime,
      flags: {
        ...state.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
      },
      variables: {
        ...state.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      },
    },
  };
}

function createTempleCharacters() {
  return createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
}

test("temple work preview and preview cancel emit typed work memory events", () => {
  const enterResult = templeHouseHouseModule.enter({
    gameState: createTempleWorkState(),
    characterDefinitions: createTempleCharacters(),
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const previewResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
      dailyActionPanel: "work",
    },
    request: { type: "action", actionId: "assign-temple-task:copy-scripture" },
  });

  assert.equal(previewResult.sessionState?.overlay?.type, "activity-confirm");
  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "work-preview"
  );
  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.actionId,
    "assign-temple-task:copy-scripture"
  );
  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.offerId,
    "copy-scripture"
  );
  assert.equal(
    previewResult.observedEvents?.[0]?.houseActionMemory?.resultKind,
    "preview"
  );
  assert.equal(previewResult.observedEvents?.[0]?.reactionHints, undefined);

  const cancelResult = templeHouseHouseModule.dispatch({
    gameState: previewResult.gameState,
    characterDefinitions: previewResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: previewResult.sessionState,
    request: { type: "action", actionId: "cancel-activity-confirm" },
  });

  assert.equal(cancelResult.sessionState?.overlay, null);
  assert.equal(
    cancelResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "work-preview-exit"
  );
  assert.equal(
    cancelResult.observedEvents?.[0]?.houseActionMemory?.offerId,
    "copy-scripture"
  );
  assert.equal(
    cancelResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    templeHouse.defaultCharacterId
  );
});

test("temple quick-complete settlement emits a typed work-complete memory event", () => {
  const activityId = "activity.zhu_yuanzhang.temple.copy_scripture";
  const baseState = createTempleWorkState();
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...baseState,
      runtime: {
        ...baseState.runtime,
        variables: {
          ...baseState.runtime.variables,
          [`var.activity.${activityId}.best_score`]: 20,
        },
      },
    },
    characterDefinitions: createTempleCharacters(),
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const result = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
      dailyActionPanel: "work",
    },
    request: {
      type: "action",
      actionId: "quick-complete-temple-task:copy-scripture",
    },
  });

  assert.equal(
    result.observedEvents?.[0]?.houseActionMemory?.kind,
    "work-complete"
  );
  assert.equal(
    result.observedEvents?.[0]?.houseActionMemory?.offerId,
    "copy-scripture"
  );
  assert.equal(
    result.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    templeHouse.defaultCharacterId
  );
});

test("keep house task assignment emits a typed work-complete memory event", () => {
  const result = keepHouseHouseModule.dispatch({
    gameState: withCouncilInDays(createBaseState(keepHouse.id, keepHouse.cityId), 30),
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: {
      ...createInitialKeepHouseSessionState(
        "meeting",
        "assign-task",
        ["听令行事。"],
        []
      ),
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "assign-keep-task:grain-procurement" },
  });

  assert.equal(result.sessionState?.meetingStage, "assigned");
  assert.equal(
    result.observedEvents?.[0]?.houseActionMemory?.kind,
    "work-complete"
  );
  assert.equal(
    result.observedEvents?.[0]?.houseActionMemory?.offerId,
    "grain-procurement"
  );
  assert.equal(
    result.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    keepHouse.defaultCharacterId
  );
});

test("leader residence learning emits a typed work-complete memory event", () => {
  const selectedCharacterId = "char.kulan_liu_bowen";
  const state = createBaseState(leaderResidenceHouse.id, leaderResidenceHouse.cityId);
  state.runtime.variables[LEADER_RESIDENCE_VARIABLE_KEYS.pendingCharacterId] =
    selectedCharacterId;

  const enterResult = leaderResidenceHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
  });

  const learnResult = leaderResidenceHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "leader-residence:learn" },
  });

  assert.equal(learnResult.sessionState?.mode, "learning");
  assert.equal(
    learnResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "work-complete"
  );
  assert.equal(
    learnResult.observedEvents?.[0]?.houseActionMemory?.actionId,
    "leader-residence:learn"
  );
  assert.equal(
    learnResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    selectedCharacterId
  );
});

test("leader residence leave-after-visit emits a typed house-leave memory event", () => {
  const selectedCharacterId = "char.kulan_liu_bowen";
  const state = createBaseState(leaderResidenceHouse.id, leaderResidenceHouse.cityId);
  state.runtime.variables[LEADER_RESIDENCE_VARIABLE_KEYS.pendingCharacterId] =
    selectedCharacterId;

  const enterResult = leaderResidenceHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
  });
  const greetingResult = leaderResidenceHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "leader-residence:greeting" },
  });

  const leaveResult = leaderResidenceHouseModule.leave({
    gameState: greetingResult.gameState,
    characterDefinitions: greetingResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: greetingResult.sessionState,
  });

  assert.equal(leaveResult.sessionState, null);
  assert.equal(
    leaveResult.observedEvents?.[0]?.houseActionMemory?.kind,
    "house-leave"
  );
  assert.equal(
    leaveResult.observedEvents?.[0]?.houseActionMemory?.actionId,
    "leave-house"
  );
  assert.equal(
    leaveResult.observedEvents?.[0]?.reactionHints?.[0]?.characterId,
    selectedCharacterId
  );
});
