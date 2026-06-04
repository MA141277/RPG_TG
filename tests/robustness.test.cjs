const test = require("node:test");
const assert = require("node:assert/strict");

const { createInitialState } = require("../.test-dist/application/state/create-initial-state.js");
const {
  ensureCityNpcPoolsForCurrentDay,
  pickCityNpcActivityLocation,
} = require("../.test-dist/application/city-npcs/refresh-city-npc-pools.js");
const {
  selectCityNpcSummariesForHouse,
} = require("../.test-dist/application/city-npcs/select-city-npcs-for-house.js");
const {
  prototypeCards,
  createPrototypeCharactersForStoryStage,
  prototypeCharacters,
  prototypeCityEntries,
  prototypeHistoricalCharacterIdByCharacterId,
  prototypeLeaderResidenceHistoricalCharacters,
  prototypeHouseAccessRefusalRules,
  prototypeHouses,
  prototypeMap,
  prototypeCityNpcPools,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");
const { executeGrainTrade } = require("../.test-dist/application/grain-shop/grain-trade.js");
const {
  PLAYER_GRAIN_RUNTIME_KEYS,
} = require("../.test-dist/application/inventory/trade-inventory.js");
const {
  homeHouseHouseModule,
} = require("../.test-dist/application/house-modules/home-house/home-house-house-module.js");
const {
  grainShopHouseModule,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-house-module.js");
const {
  keepHouseHouseModule,
} = require("../.test-dist/application/house-modules/keep-house/keep-house-house-module.js");
const {
  templeHouseHouseModule,
} = require("../.test-dist/application/house-modules/temple-house/temple-house-house-module.js");
const {
  marketHouseHouseModule,
} = require("../.test-dist/application/house-modules/market-house/market-house-house-module.js");
const {
  medicineHouseHouseModule,
} = require("../.test-dist/application/house-modules/medicine-house/medicine-house-house-module.js");
const {
  teaHouseHouseModule,
} = require("../.test-dist/application/house-modules/tea-house/tea-house-house-module.js");
const {
  resolveCompoundingGrade,
} = require("../.test-dist/application/medicine-house/compounding-minigame.js");
const {
  tavernHouseModule,
} = require("../.test-dist/application/house-modules/tavern/tavern-house-module.js");
const {
  leaderResidenceHouseModule,
} = require("../.test-dist/application/house-modules/leader-residence/leader-residence-house-module.js");
const {
  selectLeaderResidenceOptions,
} = require("../.test-dist/application/city-entries/select-leader-residence-options.js");
const {
  canEnterHouseForStoryStage,
  isCityEntryVisibleForStoryStage,
  isHouseVisibleForStoryStage,
  selectHouseEntryAccess,
} = require("../.test-dist/application/story/story-stage-access.js");
const {
  applyCityBeggingMiniGameCompletion,
} = require("../.test-dist/application/minigames/city-begging-minigame.js");
const {
  ACTIVITY_COMPLETION_STAMINA_COST,
} = require("../.test-dist/application/player/player-stamina.js");
const {
  createInitialGrainShopSessionState,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-session-state.js");
const {
  equipValuableItem,
  getVisibleOwnedCards,
  getVisibleValuables,
  resolveSelectedCardId,
  resolveSelectedValuableId,
} = require("../.test-dist/application/inventory/inventory-selection.js");
const {
  accountingGradeRewards,
} = require("../.test-dist/content/houses/grain-shop-content.js");
const { GRAIN_SHOP_VARIABLE_KEYS } = require("../.test-dist/domain/grain-shop.js");
const { HOME_HOUSE_VARIABLE_KEYS } = require("../.test-dist/domain/home-house.js");
const { KEEP_HOUSE_VARIABLE_KEYS } = require("../.test-dist/domain/keep-house.js");
const { TEMPLE_HOUSE_VARIABLE_KEYS } = require("../.test-dist/domain/temple-house.js");
const {
  getMedicineInventoryQuantityVariableKey,
  getPlayerFatigueVariableKey,
} = require("../.test-dist/domain/medicine-house.js");
const {
  getTavernCompletedWorkKey,
  getTavernFailedWorkKey,
} = require("../.test-dist/domain/tavern.js");
const {
  getLeaderResidenceRelationKey,
  LEADER_RESIDENCE_VARIABLE_KEYS,
} = require("../.test-dist/domain/leader-residence.js");
const {
  pickTeaHouseAiTopic,
  resolveTeaHouseDebateRound,
} = require("../.test-dist/application/tea-house/tea-house-debate.js");
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

const playerCharacterId = "char.player";
const keepHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "keep-house"
);
const homeHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "home-house"
);
const grainShopHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "grain-shop"
);
const teaHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tea-house"
);
const marketHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "market-house"
);
const medicineHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "medicine-house"
);
const tavernHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "tavern"
);
const leaderResidenceHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "leader-residence"
);
const templeHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "temple-house"
);
const leaderResidenceEntry = prototypeCityEntries.find(
  (entryDefinition) => entryDefinition.id === "city-entry.kulan.leader-residence"
);

assert.ok(homeHouse, "Expected prototype home house to exist.");
assert.ok(keepHouse, "Expected prototype keep house to exist.");
assert.ok(grainShopHouse, "Expected prototype grain shop house to exist.");
assert.ok(marketHouse, "Expected prototype market house to exist.");
assert.ok(teaHouse, "Expected prototype tea house to exist.");
assert.ok(medicineHouse, "Expected prototype medicine house to exist.");
assert.ok(tavernHouse, "Expected prototype tavern house to exist.");
assert.ok(
  leaderResidenceHouse,
  "Expected prototype leader residence house to exist."
);
assert.ok(templeHouse, "Expected prototype temple house to exist.");
assert.ok(
  leaderResidenceEntry,
  "Expected prototype leader residence city entry to exist."
);

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: grainShopHouse.id,
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

function createStateWithGrainVariables() {
  const state = createBaseState();
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [GRAIN_SHOP_VARIABLE_KEYS.food]: 5,
        [GRAIN_SHOP_VARIABLE_KEYS.relationship]: 0,
        [GRAIN_SHOP_VARIABLE_KEYS.time]: 1,
        [GRAIN_SHOP_VARIABLE_KEYS.grainPrice]: 100,
      },
    },
  };
}

function createMonkStageState() {
  const state = createBaseState();
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
      },
    },
  };
}

function getPlayerCharacter(characterDefinitions) {
  const playerCharacter = characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerCharacter);
  return playerCharacter;
}

test("grain trade succeeds for a valid buy and advances runtime state", () => {
  const state = createStateWithGrainVariables();
  const result = executeGrainTrade(
    state,
    prototypeCharacters,
    playerCharacterId,
    "buy",
    1,
    100
  );

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  const playerCharacter = getPlayerCharacter(result.mutation.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 20);
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.food], 6);
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 2);
});

test("city begging completion applies reward and spends stamina", () => {
  const playerBefore = getPlayerCharacter(prototypeCharacters);
  const result = applyCityBeggingMiniGameCompletion(
    createBaseState(),
    prototypeCharacters,
    playerCharacterId,
    {
      foodGain: 3,
      goldGain: 20,
      maxCombo: 4,
      success: true,
    }
  );

  const playerAfter = getPlayerCharacter(result.characterDefinitions);
  assert.equal(
    playerAfter.stamina,
    playerBefore.stamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(playerAfter.stats.gold, playerBefore.stats.gold + 20);
  assert.equal(
    result.state.runtime.variables["var.minigame.city_begging.completion_count"],
    1
  );
  assert.equal(
    result.state.runtime.variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou],
    3
  );
});

test("leader residence selector only lists eligible historical visitors in the city", () => {
  const state = createBaseState();
  const options = selectLeaderResidenceOptions(
    state,
    prototypeCharacters,
    leaderResidenceEntry,
    {
      historicalCharacters: prototypeLeaderResidenceHistoricalCharacters,
      historicalCharacterIdByCharacterId: prototypeHistoricalCharacterIdByCharacterId,
    }
  );

  assert.equal(options.length > 0, true);
  assert.equal(
    options.every((option) => {
      const historicalCharacterId =
        prototypeHistoricalCharacterIdByCharacterId[option.characterId];
      if (historicalCharacterId == null) {
        return false;
      }
      const historicalCharacter = prototypeLeaderResidenceHistoricalCharacters.find(
        (characterRecord) => characterRecord.id === historicalCharacterId
      );
      return historicalCharacter?.leaderResidenceProfile?.eligible === true;
    }),
    true
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_lord"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_tea_boss"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_grain_shopkeeper"),
    false
  );
  assert.equal(
    options.some((option) => option.characterId === "char.kulan_merchant"),
    false
  );

  const liuBowenOption = options.find(
    (option) => option.characterId === "char.kulan_liu_bowen"
  );
  assert.ok(liuBowenOption);
  assert.equal(liuBowenOption.tags.length > 0, true);
});

test("leader residence enter requires a selected character id in runtime variables", () => {
  const state = createBaseState();

  assert.throws(() => {
    leaderResidenceHouseModule.enter({
      gameState: state,
      characterDefinitions: prototypeCharacters,
      houseDefinition: leaderResidenceHouse,
      playerCharacterId,
    });
  }, /pending selected character id/i);
});

test("leader residence interaction flow updates relation and learning skill", () => {
  const selectedCharacterId = "char.kulan_liu_bowen";
  const relationKey = getLeaderResidenceRelationKey(selectedCharacterId);
  const state = {
    ...createBaseState(),
    runtime: {
      ...createBaseState().runtime,
      variables: {
        ...createBaseState().runtime.variables,
        [LEADER_RESIDENCE_VARIABLE_KEYS.pendingCharacterId]: selectedCharacterId,
      },
    },
  };
  const playerBefore = getPlayerCharacter(prototypeCharacters);
  const originalMilitarySkill = playerBefore.skills.military;

  const enterResult = leaderResidenceHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
  });

  assert.equal(
    enterResult.sessionState?.selectedCharacterId,
    selectedCharacterId
  );

  const greetingResult = leaderResidenceHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "leader-residence:greeting" },
  });
  assert.equal(greetingResult.gameState.runtime.variables[relationKey], 1);

  const giftResult = leaderResidenceHouseModule.dispatch({
    gameState: greetingResult.gameState,
    characterDefinitions: greetingResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: greetingResult.sessionState,
    request: { type: "action", actionId: "leader-residence:gift" },
  });
  assert.equal(giftResult.gameState.runtime.variables[relationKey], 3);
  assert.equal(giftResult.sessionState?.overlay?.type, "alert");

  const learnResult = leaderResidenceHouseModule.dispatch({
    gameState: giftResult.gameState,
    characterDefinitions: giftResult.characterDefinitions,
    houseDefinition: leaderResidenceHouse,
    playerCharacterId,
    sessionState: giftResult.sessionState,
    request: { type: "action", actionId: "leader-residence:learn" },
  });
  const playerAfter = getPlayerCharacter(learnResult.characterDefinitions);

  assert.equal(playerAfter.skills.military, originalMilitarySkill + 1);
  assert.equal(learnResult.sessionState?.mode, "learning");
  assert.equal(learnResult.sessionState?.overlay?.type, "alert");
});

test("grain trade fails when the player cannot afford the purchase", () => {
  const state = createStateWithGrainVariables();
  const result = executeGrainTrade(
    state,
    prototypeCharacters,
    playerCharacterId,
    "buy",
    2,
    1000
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.errorTitle.length > 0, true);
  assert.equal(result.errorMessage.length > 0, true);
});

test("house enter and leave keep session wiring and interval side effects consistent", () => {
  const state = createBaseState();
  const enterResult = grainShopHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
  assert.equal(enterResult.gameState.runtime.cityMarkets["city.kulan"] != null, true);
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["grain-shop"] != null,
    true
  );
  assert.deepEqual(enterResult.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);

  const leaveResult = grainShopHouseModule.leave({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(leaveResult.sessionState, null);
  assert.deepEqual(leaveResult.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("keep house starts review meeting at countdown zero and resets to 60 after assignment", () => {
  const state = createBaseState();
  const enterResult = keepHouseHouseModule.enter({
    gameState: {
      ...state,
      runtime: {
        ...state.runtime,
        variables: {
          ...state.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.mode, "meeting");
  assert.equal(enterResult.sessionState?.meetingStage, "intro");

  const contributionResult = keepHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(contributionResult.sessionState?.meetingStage, "contribution");
  assert.equal(contributionResult.sessionState?.overlay?.type, "alert");

  const praiseResult = keepHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-alert" },
  });
  assert.equal(praiseResult.sessionState?.meetingStage, "praise");

  const strategyResult = keepHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(strategyResult.sessionState?.meetingStage, "strategy");

  const assignTaskResult = keepHouseHouseModule.dispatch({
    gameState: strategyResult.gameState,
    characterDefinitions: strategyResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: strategyResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });
  assert.equal(assignTaskResult.sessionState?.meetingStage, "assign-task");

  const assignedResult = keepHouseHouseModule.dispatch({
    gameState: assignTaskResult.gameState,
    characterDefinitions: assignTaskResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: assignTaskResult.sessionState,
    request: { type: "action", actionId: "assign-keep-task:grain-procurement" },
  });

  assert.equal(
    assignedResult.gameState.missions.activeMissionId,
    "mission.keep.grain-procurement"
  );
  assert.equal(assignedResult.gameState.ui.mainHouseMissionText, "采办军粮");
  assert.equal(
    assignedResult.gameState.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    60
  );
  assert.equal(assignedResult.gameState.world.schedule.councilDate.day, 1);
  assert.equal(assignedResult.gameState.world.schedule.councilDate.month, 3);
  assert.equal(assignedResult.sessionState?.overlay?.type, "alert");
});

test("story-stage access keeps leader residence entry visible in monk stage", () => {
  const monkState = createMonkStageState();
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const monkKeepHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.keep"
  );
  const monkTempleHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.temple"
  );

  assert.ok(homeHouse);
  assert.ok(leaderResidenceHouse);
  assert.ok(monkKeepHouse);
  assert.ok(monkTempleHouse);

  assert.equal(
    isHouseVisibleForStoryStage(monkState, monkCharacters, homeHouse),
    false
  );
  assert.equal(
    isHouseVisibleForStoryStage(monkState, monkCharacters, leaderResidenceHouse),
    true
  );
  assert.equal(
    isCityEntryVisibleForStoryStage(monkState, leaderResidenceEntry),
    true
  );
  assert.equal(
    isHouseVisibleForStoryStage(monkState, monkCharacters, monkKeepHouse),
    true
  );
  assert.equal(
    canEnterHouseForStoryStage(monkState, monkCharacters, monkKeepHouse),
    true
  );
  assert.equal(
    isHouseVisibleForStoryStage(monkState, monkCharacters, monkTempleHouse),
    true
  );
  assert.equal(
    canEnterHouseForStoryStage(monkState, monkCharacters, monkTempleHouse),
    true
  );
});

test("house access refusal blocks leaving temple before first review", () => {
  const monkState = createMonkStageState();
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const monkGrainShop = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.grain_shop"
  );
  const monkTempleHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.temple"
  );

  assert.ok(monkGrainShop);
  assert.ok(monkTempleHouse);

  const grainShopAccess = selectHouseEntryAccess(
    monkState,
    monkCharacters,
    monkGrainShop,
    prototypeHouseAccessRefusalRules
  );
  const templeAccess = selectHouseEntryAccess(
    monkState,
    monkCharacters,
    monkTempleHouse,
    prototypeHouseAccessRefusalRules
  );

  assert.equal(grainShopAccess.canEnter, false);
  assert.equal(grainShopAccess.refusal?.speakerCharacterId, "char.player");
  assert.equal(
    grainShopAccess.refusal?.text,
    "既然答应了主持，就先不要离开寺院吧。"
  );
  assert.equal(templeAccess.canEnter, true);
});

test("house access refusal shows guard dialogue for keep during monk stage", () => {
  const monkState = {
    ...createMonkStageState(),
    runtime: {
      ...createMonkStageState().runtime,
      flags: {
        ...createMonkStageState().runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
      },
    },
  };
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const monkKeepHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.keep"
  );

  assert.ok(monkKeepHouse);

  const keepAccess = selectHouseEntryAccess(
    monkState,
    monkCharacters,
    monkKeepHouse,
    prototypeHouseAccessRefusalRules
  );

  assert.equal(keepAccess.canEnter, false);
  assert.equal(keepAccess.refusal?.speakerCharacterId, "char.kulan_soldier");
  assert.equal(keepAccess.refusal?.text, "军机要出，请阁下回避。");
});

test("keep house stays in audience mode during monk stage even when review countdown is zero", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const enterResult = keepHouseHouseModule.enter({
    gameState: {
      ...createMonkStageState(),
      runtime: {
        ...createMonkStageState().runtime,
        flags: {
          ...createMonkStageState().runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        },
        variables: {
          ...createMonkStageState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.mode, "audience");
  assert.equal(enterResult.sessionState?.meetingStage, "finished");
});

test("keep house dismiss turns lord into idle roster actor that can reopen dialogue", () => {
  const enterResult = keepHouseHouseModule.enter({
    gameState: {
      ...createBaseState(),
      runtime: {
        ...createBaseState().runtime,
        variables: {
          ...createBaseState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
        },
      },
    },
    characterDefinitions: prototypeCharacters,
    houseDefinition: keepHouse,
    playerCharacterId,
  });

  const openResult = keepHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-keep-dialogue" },
  });

  const idleResult = keepHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "dismiss-dialogue" },
  });

  const idleViewModel = keepHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: keepHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");
  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.actionContainer, null);
  assert.equal(idleViewModel.standbyRoster.length, 1);
  assert.equal(idleViewModel.standbyRoster[0]?.characterId, "char.kulan_lord");
  assert.equal(idleViewModel.standbyRoster[0]?.actionId, "open-lord-dialogue");
});

test("temple house review only selects work direction and daily actions start temple chores later", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
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

  assert.equal(enterResult.sessionState?.mode, "meeting");
  assert.equal(enterResult.sessionState?.meetingStage, "intro");

  const contributionResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(contributionResult.sessionState?.meetingStage, "contribution");
  assert.equal(contributionResult.sessionState?.overlay?.type, "alert");

  const praiseResult = templeHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });
  assert.equal(praiseResult.sessionState?.meetingStage, "praise");

  const policyResult = templeHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(policyResult.sessionState?.meetingStage, "policy");

  const assignDutyResult = templeHouseHouseModule.dispatch({
    gameState: policyResult.gameState,
    characterDefinitions: policyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: policyResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(assignDutyResult.sessionState?.meetingStage, "assign-duty");

  const assignedResult = templeHouseHouseModule.dispatch({
    gameState: assignDutyResult.gameState,
    characterDefinitions: assignDutyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignDutyResult.sessionState,
    request: { type: "action", actionId: "select-review-work:temple-help" },
  });

  assert.equal(
    assignedResult.gameState.missions.activeMissionId,
    null
  );
  assert.equal(
    assignedResult.gameState.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    30
  );
  assert.equal(
    assignedResult.gameState.runtime.variables[
      TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan
    ],
    "temple-help"
  );
  assert.equal(assignedResult.gameState.world.schedule.councilDate.day, 1);
  assert.equal(assignedResult.gameState.world.schedule.councilDate.month, 2);
  assert.equal(assignedResult.sessionState?.mode, "daily");
  assert.equal(assignedResult.sessionState?.overlay?.type, "alert");

  const closeReviewResult = templeHouseHouseModule.dispatch({
    gameState: assignedResult.gameState,
    characterDefinitions: assignedResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignedResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });
  const dailyViewModel = templeHouseHouseModule.selectViewModel({
    gameState: closeReviewResult.gameState,
    characterDefinitions: closeReviewResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: closeReviewResult.sessionState,
  });

  assert.equal(closeReviewResult.sessionState?.dialoguePhase, "idle");
  assert.equal(dailyViewModel.actionContainer, null);
  assert.equal(
    dailyViewModel.standbyRoster.find(
      (actor) => actor.characterId === "char.kulan_temple_abbot"
    )?.actionId,
    "open-abbot-dialogue"
  );
  const reopenResult = templeHouseHouseModule.dispatch({
    gameState: closeReviewResult.gameState,
    characterDefinitions: closeReviewResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: closeReviewResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
  });
  const reopenedViewModel = templeHouseHouseModule.selectViewModel({
    gameState: reopenResult.gameState,
    characterDefinitions: reopenResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reopenResult.sessionState,
  });
  assert.deepEqual(
    reopenedViewModel.actionContainer?.actions.map((action) => action.id),
    [
      "open-temple-work-menu",
      "open-temple-rest-menu",
      "ask-fortune",
      "open-donate",
      "dismiss-dialogue",
    ]
  );
  const openWorkMenuResult = templeHouseHouseModule.dispatch({
    gameState: reopenResult.gameState,
    characterDefinitions: reopenResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reopenResult.sessionState,
    request: { type: "action", actionId: "open-temple-work-menu" },
  });
  const workMenuViewModel = templeHouseHouseModule.selectViewModel({
    gameState: openWorkMenuResult.gameState,
    characterDefinitions: openWorkMenuResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openWorkMenuResult.sessionState,
  });
  assert.deepEqual(
    workMenuViewModel.actionContainer?.actions.map((action) => action.id),
    [
      "assign-temple-task:copy-scripture",
      "assign-temple-task:sweep-courtyard",
      "assign-temple-task:carry-water",
      "close-temple-work-menu",
    ]
  );
});

test("temple house blocks leaving during first review with player dialogue", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
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
    sessionState: {
      ...enterResult.sessionState,
      overlay: {
        type: "alert",
        title: "上期寺中贡献",
        paragraphs: ["1. 觉远：18 点贡献", "2. 朱元璋：0 点贡献"],
        tone: "info",
      },
    },
  });

  assert.deepEqual(leaveResult.navigation, { type: "stay-in-house" });
  assert.equal(leaveResult.sessionState?.overlay, null);
  assert.equal(leaveResult.sessionState?.dialogueOverride?.speakerCharacterId, playerCharacterId);
  assert.deepEqual(leaveResult.sessionState?.dialogueOverride?.textLines, [
    "既然答应了主持，就先不要离开寺院吧。",
  ]);

  const viewModel = templeHouseHouseModule.selectViewModel({
    gameState: leaveResult.gameState,
    characterDefinitions: leaveResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: leaveResult.sessionState,
  });

  assert.equal(viewModel.dialogue?.characterId, playerCharacterId);
  assert.deepEqual(viewModel.dialogue?.textLines, [
    "既然答应了主持，就先不要离开寺院吧。",
  ]);
  assert.equal(
    viewModel.dialogue?.portraitArtClassName,
    "c-temple-house-portrait-art--player"
  );

});

test("temple house only blocks leaving during the first tutorial work period", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
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
  const firstWorkEnterResult = templeHouseHouseModule.enter({
    gameState: firstWorkState,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const blockedLeaveResult = templeHouseHouseModule.leave({
    gameState: firstWorkEnterResult.gameState,
    characterDefinitions: firstWorkEnterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: firstWorkEnterResult.sessionState,
  });

  assert.deepEqual(blockedLeaveResult.navigation, { type: "stay-in-house" });
  assert.deepEqual(blockedLeaveResult.sessionState?.dialogueOverride?.textLines, [
    "既然答应了主持，就先不要离开寺院吧。",
  ]);

  const nextReviewEnterResult = templeHouseHouseModule.enter({
    gameState: {
      ...firstWorkState,
      runtime: {
        ...firstWorkState.runtime,
        variables: {
          ...firstWorkState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  assert.equal(
    nextReviewEnterResult.gameState.runtime.flags[
      ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted
    ],
    true
  );

  const laterTempleHelpState = {
    ...firstWorkState,
    runtime: {
      ...firstWorkState.runtime,
      flags: {
        ...firstWorkState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleWorkLockCompleted]: true,
      },
    },
  };
  const laterEnterResult = templeHouseHouseModule.enter({
    gameState: laterTempleHelpState,
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const allowedLeaveResult = templeHouseHouseModule.leave({
    gameState: laterEnterResult.gameState,
    characterDefinitions: laterEnterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: laterEnterResult.sessionState,
  });

  assert.equal(allowedLeaveResult.navigation, undefined);
  assert.equal(allowedLeaveResult.sessionState, null);
});

test("temple house unlocked begging is chosen in review and executes later without qte", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const baseState = createMonkStageState();
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...baseState,
      runtime: {
        ...baseState.runtime,
        flags: {
          ...baseState.runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
        },
        variables: {
          ...baseState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 30,
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]: 2,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const contributionResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(contributionResult.sessionState?.meetingStage, "contribution");
  const praiseResult = templeHouseHouseModule.dispatch({
    gameState: contributionResult.gameState,
    characterDefinitions: contributionResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: contributionResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });
  assert.equal(praiseResult.sessionState?.meetingStage, "praise");
  const policyResult = templeHouseHouseModule.dispatch({
    gameState: praiseResult.gameState,
    characterDefinitions: praiseResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: praiseResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  const assignDutyResult = templeHouseHouseModule.dispatch({
    gameState: policyResult.gameState,
    characterDefinitions: policyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: policyResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  const reviewChoiceResult = templeHouseHouseModule.dispatch({
    gameState: assignDutyResult.gameState,
    characterDefinitions: assignDutyResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: assignDutyResult.sessionState,
    request: { type: "action", actionId: "select-review-work:beg-alms" },
  });
  const closeReviewResult = templeHouseHouseModule.dispatch({
    gameState: reviewChoiceResult.gameState,
    characterDefinitions: reviewChoiceResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reviewChoiceResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });

  const reopenResult = templeHouseHouseModule.dispatch({
    gameState: closeReviewResult.gameState,
    characterDefinitions: closeReviewResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: closeReviewResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
  });

  const begAlmsResult = templeHouseHouseModule.dispatch({
    gameState: reopenResult.gameState,
    characterDefinitions: reopenResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: reopenResult.sessionState,
    request: { type: "action", actionId: "open-temple-work-menu" },
  });

  const confirmBegAlmsResult = templeHouseHouseModule.dispatch({
    gameState: begAlmsResult.gameState,
    characterDefinitions: begAlmsResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: begAlmsResult.sessionState,
    request: { type: "action", actionId: "assign-temple-task:beg-alms" },
  });

  assert.equal(
    confirmBegAlmsResult.gameState.missions.activeMissionId,
    "mission.temple.beg-alms"
  );
  assert.equal(
    confirmBegAlmsResult.gameState.runtime.variables[TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan],
    "beg-alms"
  );
  assert.equal(
    confirmBegAlmsResult.gameState.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    30
  );
  assert.equal(confirmBegAlmsResult.sessionState?.overlay?.type, "alert");
});

test("temple begging submission spends stamina when work is settled", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const baseState = createMonkStageState();
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...baseState,
      runtime: {
        ...baseState.runtime,
        flags: {
          ...baseState.runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
        },
        variables: {
          ...baseState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "beg-alms",
          [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: 6,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "submit-temple-begging-food" },
  });

  assert.equal(openResult.sessionState?.overlay?.type, "submit-food");

  const submitResult = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "confirm-temple-begging-food" },
  });

  assert.equal(submitResult.sessionState?.overlay?.type, "result");
  assert.equal(
    getPlayerCharacter(submitResult.characterDefinitions).stamina,
    100 - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(
    submitResult.gameState.runtime.variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou],
    0
  );
});

test("temple house daily flow resolves fortune and donation through unified state", () => {
  const wealthyCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 500,
          },
        }
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: wealthyCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.mode, "daily");

  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-temple-dialogue" },
  });
  assert.equal(openResult.sessionState?.dialoguePhase, "open");

  const idleResult = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "dismiss-dialogue" },
  });
  const idleViewModel = templeHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");
  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.actionContainer, null);
  assert.equal(
    idleViewModel.standbyRoster.some(
      (actor) => actor.characterId === "char.kulan_temple_abbot"
    ),
    true
  );

  const fortuneResult = templeHouseHouseModule.dispatch({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
    request: { type: "action", actionId: "open-abbot-dialogue" },
  });
  assert.equal(fortuneResult.sessionState?.dialoguePhase, "open");

  const askFortuneResult = templeHouseHouseModule.dispatch({
    gameState: fortuneResult.gameState,
    characterDefinitions: fortuneResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: fortuneResult.sessionState,
    request: { type: "action", actionId: "ask-fortune" },
  });
  assert.equal(askFortuneResult.sessionState?.overlay?.type, "alert");

  const closedFortuneResult = templeHouseHouseModule.dispatch({
    gameState: askFortuneResult.gameState,
    characterDefinitions: askFortuneResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: askFortuneResult.sessionState,
    request: { type: "action", actionId: "close-temple-overlay" },
  });
  assert.equal(closedFortuneResult.sessionState?.overlay, null);

  const donatePromptResult = templeHouseHouseModule.dispatch({
    gameState: closedFortuneResult.gameState,
    characterDefinitions: closedFortuneResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: closedFortuneResult.sessionState,
    request: { type: "action", actionId: "open-donate" },
  });
  assert.equal(donatePromptResult.sessionState?.overlay?.type, "donate-confirm");

  const donatedResult = templeHouseHouseModule.dispatch({
    gameState: donatePromptResult.gameState,
    characterDefinitions: donatePromptResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: donatePromptResult.sessionState,
    request: { type: "action", actionId: "confirm-donate" },
  });

  const playerCharacter = getPlayerCharacter(donatedResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 450);
  assert.equal(
    donatedResult.gameState.runtime.variables[
      TEMPLE_HOUSE_VARIABLE_KEYS.donationTotal
    ],
    50
  );
  assert.equal(donatedResult.sessionState?.overlay?.type, "alert");
});

test("home house rest-one-day advances date, restores hp and fatigue, and resets morning", () => {
  const enterResult = homeHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
  });

  const preparedCharacters = enterResult.characterDefinitions.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stamina: 40,
        }
  );
  const preparedState = {
    ...enterResult.gameState,
    world: {
      ...enterResult.gameState.world,
      timeOfDay: "night",
      schedule: {
        councilDate: {
          year: 1567,
          month: 1,
          day: 10,
        },
      },
    },
    runtime: {
      ...enterResult.gameState.runtime,
      variables: {
        ...enterResult.gameState.runtime.variables,
        [HOME_HOUSE_VARIABLE_KEYS.hp]: 50,
        [HOME_HOUSE_VARIABLE_KEYS.maxHp]: 100,
        [HOME_HOUSE_VARIABLE_KEYS.fatigue]: 40,
        [HOME_HOUSE_VARIABLE_KEYS.maxFatigue]: 100,
      },
    },
  };

  const restResult = homeHouseHouseModule.dispatch({
    gameState: preparedState,
    characterDefinitions: preparedCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "rest-one-day",
    },
  });

  const playerCharacter = getPlayerCharacter(restResult.characterDefinitions);
  assert.equal(restResult.gameState.calendar.day, 2);
  assert.equal(restResult.gameState.world.timeOfDay, "morning");
  assert.equal(restResult.gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.hp] > 50, true);
  assert.equal(restResult.gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.fatigue] > 40, true);
  assert.equal(playerCharacter.stamina > 40, true);
  assert.equal(restResult.sessionState?.overlay?.type, "alert");
});

test("home house rest-until-council stops at configured council date", () => {
  const enterResult = homeHouseHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: homeHouse,
    playerCharacterId,
  });
  const preparedState = {
    ...enterResult.gameState,
    world: {
      ...enterResult.gameState.world,
      schedule: {
        councilDate: {
          year: 1567,
          month: 1,
          day: 3,
        },
      },
    },
  };

  const restResult = homeHouseHouseModule.dispatch({
    gameState: preparedState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: homeHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "rest-until-council",
    },
  });

  assert.equal(restResult.gameState.calendar.day, 3);
  assert.equal(restResult.gameState.ui.reviewDateText, "今日评定");
  assert.equal(restResult.sessionState?.overlay?.type, "alert");
  if (restResult.sessionState?.overlay?.type !== "alert") {
    return;
  }

  assert.equal(
    restResult.sessionState.overlay.paragraphs.some((paragraph) => paragraph.includes("评定")),
    true
  );
});

test("grain shop trade overlay reads buy and sell price from unified city market", () => {
  const enterResult = grainShopHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
  });

  const openBuy = grainShopHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "buy" },
  });
  const openSell = grainShopHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "sell" },
  });

  assert.equal(openBuy.sessionState?.overlay?.type, "trade");
  assert.equal(openSell.sessionState?.overlay?.type, "trade");
  if (openBuy.sessionState?.overlay?.type !== "trade") {
    return;
  }
  if (openSell.sessionState?.overlay?.type !== "trade") {
    return;
  }

  assert.equal(openBuy.sessionState.overlay.mode, "buy");
  assert.equal(openSell.sessionState.overlay.mode, "sell");
  assert.equal(
    openBuy.sessionState.overlay.grainPrice >= openSell.sessionState.overlay.grainPrice,
    true
  );
});

test("market house enters through module registry and ensures unified city shop data", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");
  assert.equal(enterResult.gameState.runtime.cityMarkets["city.kulan"] != null, true);
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["grain-shop"] != null,
    true
  );
  assert.equal(
    enterResult.gameState.runtime.cityMarkets["city.kulan"].shops["silk-shop"] != null,
    true
  );

  const viewModel = marketHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(viewModel.moduleId, "market-house");
  assert.equal(viewModel.sceneTitle, "货栈");
  assert.equal(viewModel.sceneTitle.length > 0, true);
});

test("market house inventory excludes grain and horse goods", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "buy-goods",
    },
  });

  const overlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
  });

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }

  assert.equal(
    overlayViewModel.overlay.rows.some(
      (row) => row.categoryLabel === "粮食" || row.categoryLabel === "马匹"
    ),
    false
  );
});

test("market house follows greeting open idle rhythm with fixed boss and guest roster", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.selectedActorId, "shopkeeper_qian");
  assert.equal(enterResult.sessionState?.guestActorIds.length >= 1, true);

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");
  assert.equal(openResult.sessionState?.dialogueLines[0].includes("钱掌柜"), true);

  const idleResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "dismiss-dialogue",
    },
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");

  const idleViewModel = marketHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.standbyRoster.length >= 2, true);
  assert.equal(idleViewModel.actionContainer, null);
});

test("market house can open trade overlay and execute buy flow", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const wealthyCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id !== playerCharacterId
      ? characterDefinition
      : {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 5000,
          },
        }
  );
  const enterResult = marketHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: wealthyCharacters,
    houseDefinition: marketHouse,
    playerCharacterId,
  });

  const openResult = marketHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  const overlayResult = marketHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "buy-goods",
    },
  });

  assert.equal(overlayResult.sessionState?.overlay?.type, "market-trade");
  if (overlayResult.sessionState?.overlay?.type !== "market-trade") {
    return;
  }

  const goodsId = overlayResult.sessionState.overlay.selectedGoodsId;
  assert.equal(typeof goodsId, "string");

  const overlayViewModel = marketHouseHouseModule.selectViewModel({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
  });

  assert.equal(overlayViewModel.overlay?.type, "market-trade");
  if (overlayViewModel.overlay?.type !== "market-trade") {
    return;
  }
  assert.equal(overlayViewModel.overlay.rows.length > 0, true);

  const buyResult = marketHouseHouseModule.dispatch({
    gameState: overlayResult.gameState,
    characterDefinitions: overlayResult.characterDefinitions,
    houseDefinition: marketHouse,
    playerCharacterId,
    sessionState: overlayResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-trade",
    },
  });

  assert.equal(buyResult.sessionState?.overlay?.type, "alert");
  const playerCharacter = getPlayerCharacter(buyResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold < 5000, true);
  assert.equal(
    buyResult.gameState.runtime.variables[`var.trade_inventory.${goodsId}`] > 0,
    true
  );
});

test("minigame tick settles into result overlay and applies grade reward", () => {
  const state = createStateWithGrainVariables();
  const sessionState = {
    ...createInitialGrainShopSessionState("greeting", "default"),
    overlay: {
      type: "minigame",
      score: 14,
      wrongCount: 0,
      secondsLeft: 1,
      question: {
        bought: 10,
        sold: 4,
        displayedStock: 6,
        isLedgerCorrect: true,
      },
    },
  };

  const result = grainShopHouseModule.dispatch({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState,
    request: {
      type: "tick",
      tickId: "grain-shop-accounting",
    },
  });

  assert.equal(result.sessionState?.overlay?.type, "result");
  if (result.sessionState?.overlay?.type !== "result") {
    return;
  }

  const reward = accountingGradeRewards.A;
  const playerCharacter = getPlayerCharacter(result.characterDefinitions);
  assert.equal(result.sessionState.overlay.grade, "A");
  assert.equal(playerCharacter.stats.gold, 120 + reward.money);
  assert.equal(playerCharacter.stamina, 100 - ACTIVITY_COMPLETION_STAMINA_COST);
  assert.equal(playerCharacter.skills.arithmetic, 1 + reward.math);
  assert.equal(
    result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.relationship],
    reward.relationship
  );
  assert.equal(result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 2);
  assert.deepEqual(result.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("inventory filtering and equip logic preserve valid selection", () => {
  const visibleBattleCards = getVisibleOwnedCards(
    prototypeCards,
    {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[2]?.id ?? null,
    },
    "battle"
  );
  assert.equal(
    resolveSelectedCardId(visibleBattleCards, prototypeCards[2]?.id ?? null),
    prototypeCards[2]?.id ?? null
  );

  const visibleSecretCards = getVisibleOwnedCards(
    prototypeCards,
    {
      ownedCardIds: prototypeCards.map((cardDefinition) => cardDefinition.id),
      selectedCardId: prototypeCards[2]?.id ?? null,
    },
    "secret-technique"
  );
  assert.equal(
    resolveSelectedCardId(visibleSecretCards, prototypeCards[2]?.id ?? null),
    prototypeCards[1]?.id ?? null
  );

  const visibleEquipment = getVisibleValuables(prototypeValuables, "equipment");
  assert.equal(
    resolveSelectedValuableId(visibleEquipment, prototypeValuables[1]?.id ?? null),
    prototypeValuables[1]?.id ?? null
  );

  const equippedInventory = equipValuableItem(
    {
      items: prototypeValuables,
      selectedItemId: null,
      equippedWeaponSet: {
        swordId: null,
        armorId: null,
      },
    },
    prototypeValuables[0].id
  );
  assert.equal(equippedInventory.selectedItemId, prototypeValuables[0].id);
  assert.equal(equippedInventory.equippedWeaponSet.swordId, prototypeValuables[0].id);
  assert.equal(equippedInventory.equippedWeaponSet.armorId, null);
});

test("city npc daily refresh picks weighted locations and stays stable within the same day", () => {
  const residentDefinition = prototypeCityNpcPools[0].residents[0];
  assert.equal(
    pickCityNpcActivityLocation(
      {
        ...residentDefinition,
        activityWeight: { market: 60, tavern: 40 },
      },
      () => 0.1
    ),
    "market"
  );
  assert.equal(
    pickCityNpcActivityLocation(
      {
        ...residentDefinition,
        activityWeight: { market: 60, tavern: 40 },
      },
      () => 0.9
    ),
    "tavern"
  );

  const refreshedState = ensureCityNpcPoolsForCurrentDay(
    createBaseState(),
    prototypeCityNpcPools,
    () => 0.1
  );
  const stableState = ensureCityNpcPoolsForCurrentDay(
    refreshedState,
    prototypeCityNpcPools,
    () => 0.9
  );

  assert.equal(stableState, refreshedState);
  assert.equal(
    refreshedState.runtime.cityNpcPools["city.kulan"].lastRefreshedOn,
    "1567-01-01"
  );
});

test("house city npc selector reads from shared city pool instead of fixed house ownership", () => {
  const state = createBaseState();
  const marketHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.id === "house.kulan.market"
  );

  assert.ok(marketHouse);

  const stateWithNpcPool = {
    ...state,
    runtime: {
      ...state.runtime,
      cityNpcPools: {
        "city.kulan": {
          cityId: "city.kulan",
          lastRefreshedOn: "1567-01-01",
          residents: {
            "city-npc.kulan.merchant_zhou": {
              npcId: "city-npc.kulan.merchant_zhou",
              favorability: 0,
              currentLocationId: "market",
            },
            "city-npc.kulan.scholar_he": {
              npcId: "city-npc.kulan.scholar_he",
              favorability: 0,
              currentLocationId: "tea-house",
            },
          },
        },
      },
    },
  };

  const summaries = selectCityNpcSummariesForHouse(
    stateWithNpcPool,
    marketHouse,
    prototypeCityNpcPools
  );

  assert.deepEqual(summaries, [
    {
      id: "city-npc.kulan.merchant_zhou",
      name: "周掌柜",
      title: "盐商",
    },
  ]);
});

test("tea house enter samples up to two city guests plus fixed boss", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  assert.ok(enterResult.sessionState);
  assert.equal(enterResult.sessionState.guestNpcIds.length <= 2, true);
  assert.equal(enterResult.sessionState.selectedActorId, "char.kulan_tea_boss");

  const viewModel = teaHouseHouseModule.selectViewModel({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
  });

  assert.equal(viewModel.moduleId, "tea-house");
  assert.equal(viewModel.dialogue?.speakerName, "柳四");
});

test("tea house follows greeting open idle rhythm like grain shop", () => {
  const state = ensureCityNpcPoolsForCurrentDay(createBaseState(), prototypeCityNpcPools, () => 0.1);
  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");

  const openResult = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: {
      type: "action",
      actionId: "advance-greeting",
    },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");

  const idleResult = teaHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: {
      type: "action",
      actionId: "dismiss-dialogue",
    },
  });

  assert.equal(idleResult.sessionState?.dialoguePhase, "idle");

  const idleViewModel = teaHouseHouseModule.selectViewModel({
    gameState: idleResult.gameState,
    characterDefinitions: idleResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: idleResult.sessionState,
  });

  assert.equal(idleViewModel.dialogue, null);
  assert.equal(idleViewModel.standbyRoster.length > 0, true);
  assert.equal(idleViewModel.actionContainer, null);
});

test("tea house debate resolves counters and timeout penalty", () => {
  const roundResult = resolveTeaHouseDebateRound(
    {
      round: 1,
      playerSpirit: 10,
      npcSpirit: 10,
      timeoutCount: 0,
      consecutivePlayerWins: 1,
    },
    "义",
    "利",
    true
  );

  assert.equal(roundResult.winner, "player");
  assert.equal(roundResult.nextState.playerSpirit, 9);
  assert.equal(roundResult.nextState.npcSpirit, 7);
  assert.equal(roundResult.nextState.timeoutCount, 1);
  assert.equal(roundResult.nextState.consecutivePlayerWins, 2);
});

test("tea house ai weights bias topic choice by personality", () => {
  assert.equal(pickTeaHouseAiTopic("精明", () => 0.2), "利");
  assert.equal(pickTeaHouseAiTopic("傲气", () => 0.5), "名");
});

test("tea house completed debate spends stamina", () => {
  const state = ensureCityNpcPoolsForCurrentDay(
    createBaseState(),
    prototypeCityNpcPools,
    () => 0.1
  );
  const enterResult = teaHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });
  const openResult = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });
  const startDebateResult = teaHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "start-debate" },
  });

  assert.equal(startDebateResult.sessionState?.overlay?.type, "debate");

  const finishResult = teaHouseHouseModule.dispatch({
    gameState: startDebateResult.gameState,
    characterDefinitions: startDebateResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...startDebateResult.sessionState,
      overlay: {
        ...startDebateResult.sessionState.overlay,
        playerSpirit: 2,
        npcSpirit: 1,
        consecutivePlayerWins: 1,
        plannedNpcTopic: "利",
        selectedPlayerTopic: "义",
      },
    },
    request: { type: "action", actionId: "confirm-debate-topic" },
  });

  const playerCharacter = getPlayerCharacter(finishResult.characterDefinitions);
  assert.equal(playerCharacter.stamina, 100 - ACTIVITY_COMPLETION_STAMINA_COST);
  assert.equal(finishResult.sessionState?.overlay?.type, "alert");
});

test("tavern drink flow spends 100 gold after confirmation", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openDrink = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "order-drink" },
  });

  assert.equal(openDrink.sessionState?.overlay?.type, "drink-confirm");

  const confirmDrink = tavernHouseModule.dispatch({
    gameState: openDrink.gameState,
    characterDefinitions: openDrink.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openDrink.sessionState,
    request: { type: "action", actionId: "confirm-drink" },
  });

  const playerCharacter = getPlayerCharacter(confirmDrink.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 20);
  assert.equal(confirmDrink.sessionState?.overlay?.type, "alert");
});

test("tavern gamble flow returns wager at 1.1x placeholder payout", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openGamble = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-gamble" },
  });

  assert.equal(openGamble.sessionState?.overlay?.type, "gamble");

  const settleGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...openGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  const playerCharacter = getPlayerCharacter(settleGamble.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 130);
  assert.equal(settleGamble.sessionState?.overlay?.type, "alert");
});

test("tavern work flow accepts dishwashing qte and submits with confirmation", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });

  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });

  assert.equal(openAccept.sessionState?.workPanelMode, "accept");

  const acceptWork = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
  });

  assert.equal(acceptWork.sessionState?.overlay?.type, "qte-bar");

  let qteResult = acceptWork;
  for (let round = 0; round < 3; round += 1) {
    qteResult = tavernHouseModule.dispatch({
      gameState: qteResult.gameState,
      characterDefinitions: qteResult.characterDefinitions,
      houseDefinition: tavernHouse,
      playerCharacterId,
      sessionState: {
        ...qteResult.sessionState,
        overlay: {
          ...qteResult.sessionState.overlay,
          markerPercent: qteResult.sessionState.overlay.targetStartPercent,
        },
      },
      request: { type: "action", actionId: "tavern-work-stop" },
    });
  }

  assert.equal(qteResult.sessionState?.overlay?.type, "result");

  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: qteResult.gameState,
    characterDefinitions: qteResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: qteResult.sessionState,
    request: { type: "action", actionId: "submit-work:offer.kulan.wash_dishes" },
  });

  assert.equal(openSubmitConfirm.sessionState?.overlay?.type, "submit-confirm");

  const submitResult = tavernHouseModule.dispatch({
    gameState: openSubmitConfirm.gameState,
    characterDefinitions: openSubmitConfirm.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openSubmitConfirm.sessionState,
    request: { type: "action", actionId: "confirm-submit-work" },
  });

  const playerCharacter = getPlayerCharacter(submitResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 190);
  assert.equal(playerCharacter.stamina, 100 - ACTIVITY_COMPLETION_STAMINA_COST);
  assert.equal(submitResult.sessionState?.acceptedOffers.length, 0);
  assert.equal(
    submitResult.gameState.runtime.flags[
      getTavernCompletedWorkKey(tavernHouse.id, "offer.kulan.wash_dishes")
    ],
    true
  );
});

test("tavern submitting unfinished work fails and clears active work", () => {
  const state = createBaseState();
  const enterResult = tavernHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
  });

  const openWork = tavernHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "open-work" },
  });

  const openAccept = tavernHouseModule.dispatch({
    gameState: openWork.gameState,
    characterDefinitions: openWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openWork.sessionState,
    request: { type: "action", actionId: "open-work-accept" },
  });

  const acceptRandom = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.supply_run" },
  });

  assert.equal(acceptRandom.sessionState?.acceptedOffers.length, 1);

  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: acceptRandom.gameState,
    characterDefinitions: acceptRandom.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptRandom.sessionState,
    request: { type: "action", actionId: "submit-work:offer.kulan.supply_run" },
  });

  assert.equal(openSubmitConfirm.sessionState?.overlay?.type, "submit-confirm");

  const submitResult = tavernHouseModule.dispatch({
    gameState: openSubmitConfirm.gameState,
    characterDefinitions: openSubmitConfirm.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openSubmitConfirm.sessionState,
    request: { type: "action", actionId: "confirm-submit-work" },
  });

  const playerCharacter = getPlayerCharacter(submitResult.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 120);
  assert.equal(playerCharacter.stamina, 100 - ACTIVITY_COMPLETION_STAMINA_COST);
  assert.equal(submitResult.sessionState?.acceptedOffers.length, 0);
  assert.equal(
    submitResult.gameState.runtime.flags[
      getTavernFailedWorkKey(tavernHouse.id, "offer.kulan.supply_run")
    ],
    true
  );
});

test("medicine house greeting flow opens actions after advance", () => {
  const state = createBaseState();
  const enterResult = medicineHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });

  assert.equal(enterResult.sessionState?.dialoguePhase, "greeting");

  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });

  assert.equal(openResult.sessionState?.dialoguePhase, "open");
  const viewModel = medicineHouseHouseModule.selectViewModel({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
  });

  assert.equal(viewModel.actionContainer?.actions.length, 5);
});

test("medicine house heal and buy update fatigue inventory and gold", () => {
  const state = createBaseState();
  const richCharacters = prototypeCharacters.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stats: {
            ...characterDefinition.stats,
            gold: 300,
          },
        }
      : characterDefinition
  );
  const enterResult = medicineHouseHouseModule.enter({
    gameState: {
      ...state,
      runtime: {
        ...state.runtime,
        variables: {
          ...state.runtime.variables,
          [getPlayerFatigueVariableKey()]: 40,
        },
      },
    },
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });

  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });

  const healResult = medicineHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: richCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "heal" },
  });

  assert.equal(healResult.gameState.runtime.variables[getPlayerFatigueVariableKey()], 10);

  const playerAfterHeal = getPlayerCharacter(healResult.characterDefinitions);
  assert.equal(playerAfterHeal.stats.gold, 250);

  const afterAlert = medicineHouseHouseModule.dispatch({
    gameState: healResult.gameState,
    characterDefinitions: healResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: healResult.sessionState,
    request: { type: "action", actionId: "close-alert" },
  });

  const buyOpen = medicineHouseHouseModule.dispatch({
    gameState: afterAlert.gameState,
    characterDefinitions: afterAlert.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: afterAlert.sessionState,
    request: { type: "action", actionId: "open-buy" },
  });

  assert.equal(buyOpen.sessionState?.overlay?.type, "buy");

  const buyResult = medicineHouseHouseModule.dispatch({
    gameState: buyOpen.gameState,
    characterDefinitions: buyOpen.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: buyOpen.sessionState,
    request: { type: "action", actionId: "confirm-buy" },
  });

  assert.equal(
    buyResult.gameState.runtime.variables[
      getMedicineInventoryQuantityVariableKey("medicine_heal_001")
    ],
    1
  );
});

test("medicine compounding completion spends stamina", () => {
  const state = createBaseState();
  const enterResult = medicineHouseHouseModule.enter({
    gameState: state,
    characterDefinitions: prototypeCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });
  const openResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: enterResult.sessionState,
    request: { type: "action", actionId: "advance-greeting" },
  });
  const startResult = medicineHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "start-compounding" },
  });

  assert.equal(startResult.sessionState?.overlay?.type, "compounding");

  const finishResult = medicineHouseHouseModule.dispatch({
    gameState: startResult.gameState,
    characterDefinitions: startResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: {
      ...startResult.sessionState,
      overlay: {
        ...startResult.sessionState.overlay,
        secondsLeft: 1,
      },
    },
    request: { type: "tick", tickId: "medicine-house-compounding" },
  });

  const playerCharacter = getPlayerCharacter(finishResult.characterDefinitions);
  assert.equal(playerCharacter.stamina, 100 - ACTIVITY_COMPLETION_STAMINA_COST);
  assert.equal(finishResult.sessionState?.overlay?.type, "result");
});

test("temple work reaching contribution threshold starts shared map auto advance for next review", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...createMonkStageState(),
      runtime: {
        ...createMonkStageState().runtime,
        flags: {
          ...createMonkStageState().runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        },
        variables: {
          ...createMonkStageState().runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
          [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 20,
        },
      },
    },
    characterDefinitions: monkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });

  const openResult = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "open-temple-work-menu" },
  });

  const startWorkResult = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "assign-temple-task:copy-scripture" },
  });

  let qteResult = startWorkResult;
  for (let round = 0; round < 3; round += 1) {
    qteResult = templeHouseHouseModule.dispatch({
      gameState: qteResult.gameState,
      characterDefinitions: qteResult.characterDefinitions,
      houseDefinition: templeHouse,
      playerCharacterId,
      sessionState: {
        ...qteResult.sessionState,
        overlay: {
          ...qteResult.sessionState.overlay,
          markerPercent: qteResult.sessionState.overlay.targetStartPercent,
        },
      },
      request: { type: "action", actionId: "temple-work-stop" },
    });
  }

  assert.equal(qteResult.sessionState?.overlay?.type, "result");
  assert.equal(
    qteResult.gameState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked],
    true
  );
  assert.equal(
    getPlayerCharacter(qteResult.characterDefinitions).stamina,
    100 - ACTIVITY_COMPLETION_STAMINA_COST
  );

  const closeResult = templeHouseHouseModule.dispatch({
    gameState: qteResult.gameState,
    characterDefinitions: qteResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: qteResult.sessionState,
    request: { type: "action", actionId: "close-temple-result" },
  });

  assert.equal(closeResult.sessionState, null);
  assert.equal(
    closeResult.sideEffects?.some(
      (sideEffect) => sideEffect.type === "start-map-auto-advance"
    ),
    true
  );
});

test("medicine compounding grades targets by closeness", () => {
  const perfect = resolveCompoundingGrade(
    {
      ailmentId: "wind_cold",
      ailmentName: "风寒",
      coldRequired: 2,
      healRequired: 5,
      maxPoison: 1,
    },
    [
      { herbId: "herb_bo_he", amount: 1 },
      { herbId: "herb_xing_ren", amount: 1 },
      { herbId: "herb_dang_gui", amount: 1 },
    ],
    [
      { id: "herb_bo_he", name: "薄荷", cold: 2, heat: 0, poison: 0, heal: 1 },
      { id: "herb_xing_ren", name: "杏仁", cold: 1, heat: 0, poison: 0, heal: 2 },
      { id: "herb_dang_gui", name: "当归", cold: 0, heat: 1, poison: 0, heal: 3 },
    ]
  );

  assert.equal(perfect.grade, "S");
});
