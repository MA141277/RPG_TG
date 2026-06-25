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
  advanceTavernGambleMeldCountdown,
  advanceTavernGambleNpcThinking,
  createTavernLongGambleSession,
  confirmTavernGamblePlayGroup,
  createTavernGambleSession,
  createTavernMahjongDeck,
  declareTavernGambleMeld,
  discardForTavernGamble,
  drawForTavernGamble,
  passHumanLongHu,
  pushHumanLongHu,
  resolveTavernGambleBettingAction,
  scoreTavernGamblePlayer,
  toggleTavernGamblePlayTile,
} = require("../.test-dist/domain/tavern-gambling.js");
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
  ACTIVITY_COMPLETION_STAMINA_COST,
} = require("../.test-dist/application/player/player-stamina.js");
const {
  createSundeyaRescueBattleSession,
  dispatchStoryBattleAction,
  startStoryBattle,
} = require("../.test-dist/application/story-battle/story-battle-runtime.js");
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

function addTestDays(date, days) {
  const currentNumber = date.year * 360 + (date.month - 1) * 30 + date.day;
  const nextNumber = currentNumber + days;
  const nextYear = Math.floor((nextNumber - 1) / 360);
  const dayOfYear = nextNumber - nextYear * 360;
  return {
    year: nextYear,
    month: Math.floor((dayOfYear - 1) / 30) + 1,
    day: ((dayOfYear - 1) % 30) + 1,
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

function withPlayerStamina(characterDefinitions, stamina) {
  return characterDefinitions.map((characterDefinition) =>
    characterDefinition.id === playerCharacterId
      ? {
          ...characterDefinition,
          stamina,
        }
      : characterDefinition
  );
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
  assert.equal(
    result.mutation.state.runtime.variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou],
    60
  );
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.food], 0);
  assert.equal(result.mutation.state.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 2);
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
  assert.equal(confirmBegAlmsResult.sessionState?.overlay?.type, "activity-confirm");
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

  const autoAdvanceEffect = restResult.sideEffects?.find(
    (sideEffect) => sideEffect.type === "start-map-auto-advance"
  );
  assert.ok(autoAdvanceEffect);
  assert.equal(restResult.gameState.calendar.day, 1);
  assert.equal(restResult.gameState.world.timeOfDay, "night");
  assert.equal(autoAdvanceEffect.snapshots.length, 1);

  const finalSnapshot = autoAdvanceEffect.snapshots[0];
  const playerCharacter = getPlayerCharacter(finalSnapshot.characterDefinitions);
  assert.equal(finalSnapshot.gameState.calendar.day, 2);
  assert.equal(finalSnapshot.gameState.world.timeOfDay, "morning");
  assert.equal(
    finalSnapshot.gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.hp] > 50,
    true
  );
  assert.equal(
    finalSnapshot.gameState.runtime.variables[HOME_HOUSE_VARIABLE_KEYS.fatigue] > 40,
    true
  );
  assert.equal(playerCharacter.stamina > 40, true);
  assert.equal(autoAdvanceEffect.completion?.type, "restore-house-session");
  assert.equal(
    autoAdvanceEffect.completion?.houseSession?.state.overlay?.type,
    "alert"
  );
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

  const autoAdvanceEffect = restResult.sideEffects?.find(
    (sideEffect) => sideEffect.type === "start-map-auto-advance"
  );
  assert.ok(autoAdvanceEffect);
  assert.equal(restResult.gameState.calendar.day, 1);
  assert.equal(autoAdvanceEffect.snapshots.length, 2);

  const finalSnapshot = autoAdvanceEffect.snapshots.at(-1);
  assert.equal(finalSnapshot.gameState.calendar.day, 3);
  assert.equal(finalSnapshot.gameState.ui.reviewDateText, "今日评定");
  assert.equal(autoAdvanceEffect.completion?.type, "restore-house-session");
  const completionOverlay =
    autoAdvanceEffect.completion?.houseSession?.state.overlay;
  assert.equal(completionOverlay?.type, "alert");
  if (completionOverlay?.type !== "alert") {
    return;
  }

  assert.equal(
    completionOverlay.paragraphs.some((paragraph) => paragraph.includes("评定")),
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
  assert.equal(openResult.sessionState?.dialogueLines[0].includes("货单"), true);

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
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
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
  assert.equal(
    playerCharacter.stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(playerCharacter.skills.arithmetic, 1 + reward.math);
  assert.equal(
    result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.relationship],
    reward.relationship
  );
  assert.equal(result.gameState.runtime.variables[GRAIN_SHOP_VARIABLE_KEYS.time], 11);
  assert.deepEqual(result.sideEffects, [
    { type: "stop-interval", intervalId: "grain-shop-accounting" },
  ]);
});

test("grain shop accounting is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const result = grainShopHouseModule.dispatch({
    gameState: createStateWithGrainVariables(),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: grainShopHouse,
    playerCharacterId,
    sessionState: createInitialGrainShopSessionState("open", "default"),
    request: { type: "action", actionId: "accounting" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sideEffects, undefined);
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
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

test("tea house debate is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = teaHouseHouseModule.enter({
    gameState: ensureCityNpcPoolsForCurrentDay(
      withCouncilInDays(createBaseState(), 90),
      prototypeCityNpcPools,
      () => 0.1
    ),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });

  const result = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-debate" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sideEffects, undefined);
});

test("tea house debate spends stamina when settled", () => {
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
  const enterResult = teaHouseHouseModule.enter({
    gameState: ensureCityNpcPoolsForCurrentDay(
      withCouncilInDays(createBaseState(), 200),
      prototypeCityNpcPools,
      () => 0.1
    ),
    characterDefinitions: prototypeCharacters,
    houseDefinition: teaHouse,
    playerCharacterId,
  });
  const startDebate = teaHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-debate" },
  });
  assert.equal(startDebate.sessionState?.overlay?.type, "activity-confirm");

  const confirmedDebate = teaHouseHouseModule.dispatch({
    gameState: startDebate.gameState,
    characterDefinitions: startDebate.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: startDebate.sessionState,
    request: { type: "action", actionId: "confirm-start-debate" },
  });

  const result = teaHouseHouseModule.dispatch({
    gameState: confirmedDebate.gameState,
    characterDefinitions: confirmedDebate.characterDefinitions,
    houseDefinition: teaHouse,
    playerCharacterId,
    sessionState: {
      ...confirmedDebate.sessionState,
      overlay: {
        ...confirmedDebate.sessionState.overlay,
        npcSpirit: 1,
        plannedNpcTopic: "利",
        selectedPlayerTopic: "义",
      },
    },
    request: { type: "action", actionId: "confirm-debate-topic" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
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

test("tavern gamble flow opens structured mahjong table session", () => {
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

  assert.equal(openGamble.sessionState?.overlay?.type, "gamble-choice");

  const selectShortGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
  });

  assert.equal(selectShortGamble.sessionState?.overlay?.type, "gamble");

  const startGamble = tavernHouseModule.dispatch({
    gameState: selectShortGamble.gameState,
    characterDefinitions: selectShortGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectShortGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  const playerCharacter = getPlayerCharacter(startGamble.characterDefinitions);
  assert.equal(playerCharacter.stats.gold, 120);
  assert.equal(startGamble.sessionState?.overlay?.type, "gamble-table");
  assert.equal(startGamble.sessionState?.gambleSession?.phase, "betting");
  assert.equal(startGamble.sessionState?.gambleSession?.players[0]?.hand.length, 4);
  assert.equal(startGamble.sessionState?.gambleSession?.wager, 100);
  assert.equal(startGamble.sessionState?.gambleSession?.currentBet, 20);
  assert.equal(startGamble.sessionState?.gambleSession?.pot, 30);
  assert.equal(startGamble.sessionState?.gambleSession?.players[1]?.committed, 10);
  assert.equal(startGamble.sessionState?.gambleSession?.players[2]?.committed, 20);
});

test("tavern gamble start is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 200),
    characterDefinitions: lowStaminaCharacters,
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
  const selectShortGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
  });

  const result = tavernHouseModule.dispatch({
    gameState: selectShortGamble.gameState,
    characterDefinitions: selectShortGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectShortGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sessionState?.gambleSession, null);
});

test("tavern gamble settlement spends stamina", () => {
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
  const enterResult = tavernHouseModule.enter({
    gameState: createBaseState(),
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
  const selectShortGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:short" },
  });
  const startGamble = tavernHouseModule.dispatch({
    gameState: selectShortGamble.gameState,
    characterDefinitions: selectShortGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectShortGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  const result = tavernHouseModule.dispatch({
    gameState: startGamble.gameState,
    characterDefinitions: startGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: startGamble.sessionState,
    request: { type: "action", actionId: "gamble-settle" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(result.sessionState?.gambleSession, null);
});

test("tavern long gamble starts with personal public tile slots", () => {
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

  const selectLongGamble = tavernHouseModule.dispatch({
    gameState: openGamble.gameState,
    characterDefinitions: openGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openGamble.sessionState,
    request: { type: "action", actionId: "select-gamble-variant:long" },
  });

  const startGamble = tavernHouseModule.dispatch({
    gameState: selectLongGamble.gameState,
    characterDefinitions: selectLongGamble.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: {
      ...selectLongGamble.sessionState,
      currentWager: 100,
    },
    request: { type: "action", actionId: "confirm-gamble" },
  });

  const session = startGamble.sessionState?.gambleSession;
  assert.equal(session?.variant, "long");
  assert.equal(session?.players[0]?.hand.length, 5);
  assert.equal(session?.players[0]?.publicTileSlots?.length, 9);
  assert.deepEqual(
    session?.players[0]?.publicTileSlots?.map((slot) => slot.tile.kind === "suited" ? `${slot.tile.suit}-${slot.tile.rank}` : slot.tile.kind === "honor" ? slot.tile.honor : slot.tile.flower),
    session?.players[1]?.publicTileSlots?.map((slot) => slot.tile.kind === "suited" ? `${slot.tile.suit}-${slot.tile.rank}` : slot.tile.kind === "honor" ? slot.tile.honor : slot.tile.flower)
  );
  assert.equal(session?.publicTiles.length, 0);
});

test("tavern long gamble human can choose push hu or pass", () => {
  const deck = createTavernMahjongDeck();
  const suited = (suit, rank, count = 1) =>
    deck.filter((tile) => tile.kind === "suited" && tile.suit === suit && tile.rank === rank).slice(0, count);
  const honors = (honor, count = 1) =>
    deck.filter((tile) => tile.kind === "honor" && tile.honor === honor).slice(0, count);
  const eastTiles = honors("east", 3);
  const zhongTiles = honors("zhong", 2);

  const base = createTavernLongGambleSession({
    wager: 100,
    seed: 99,
    playerName: "tester",
  });
  const human = {
    ...base.players[0],
    hand: [suited("wan", 1)[0], suited("wan", 2)[0], suited("wan", 3)[0], suited("tiao", 1)[0], suited("tiao", 2)[0]],
    publicTileSlots: [
      suited("tiao", 3)[0],
      suited("tong", 1)[0],
      suited("tong", 2)[0],
      suited("tong", 3)[0],
      eastTiles[0],
      eastTiles[1],
      eastTiles[2],
      zhongTiles[0],
      zhongTiles[1],
    ].map((tile, index) => ({
      id: `human-public-${index}`,
      tile: { ...tile, id: `human-public-copy-${index}` },
      covered: false,
    })),
  };
  const session = {
    ...base,
    phase: "draw-discard",
    pendingDrawTile: null,
    pendingDiscardsRemaining: 0,
    wall: [suited("wan", 9)[0], suited("tiao", 9)[0], suited("tong", 9)[0]],
    players: [human, ...base.players.slice(1)],
  };

  const drawn = drawForTavernGamble(session);
  assert.equal(drawn.pendingHumanHu, true);

  const passed = passHumanLongHu(drawn);
  assert.equal(passed.pendingHumanHu, false);
  assert.equal(passed.pendingDiscardsRemaining, 3);

  const pushed = pushHumanLongHu(drawn);
  assert.equal(pushed.phase, "finished");
  assert.ok(pushed.showdown);
});

test("tavern long gamble npc no longer auto-plays short groups", () => {
  const deck = createTavernMahjongDeck();
  const suited = (suit, rank, count = 1) =>
    deck.filter((tile) => tile.kind === "suited" && tile.suit === suit && tile.rank === rank).slice(0, count);
  const honors = (honor, count = 1) =>
    deck.filter((tile) => tile.kind === "honor" && tile.honor === honor).slice(0, count);

  const base = createTavernLongGambleSession({
    wager: 100,
    seed: 109,
    playerName: "tester",
  });
  const npc = {
    ...base.players[1],
    hand: [suited("wan", 1)[0], suited("wan", 4)[0], suited("tiao", 6)[0], suited("tong", 9)[0], honors("fa", 1)[0]],
    publicTileSlots: [
      suited("wan", 7)[0],
      suited("wan", 9)[1],
      suited("tiao", 2)[0],
      suited("tiao", 8)[0],
      suited("tong", 1)[1],
      suited("tong", 5)[0],
      honors("east", 1)[0],
      honors("south", 1)[0],
      honors("bai", 1)[0],
    ].map((tile, index) => ({
      id: `npc-public-${index}`,
      tile: { ...tile, id: `npc-public-copy-${index}` },
      covered: false,
    })),
  };
  const session = {
    ...base,
    phase: "npc-thinking",
    npcThinkingSeat: npc.seatIndex,
    npcThinkTicksRemaining: 1,
    wall: [suited("wan", 2)[1], suited("tiao", 7)[1], suited("tong", 8)[1]],
    players: [base.players[0], npc, ...base.players.slice(2)],
  };

  const next = advanceTavernGambleNpcThinking(session);
  const nextNpc = next.players.find((player) => player.id === npc.id);
  assert.ok(nextNpc);
  assert.equal(nextNpc.playedGroups.length, 0);
  assert.equal(next.publicDiscards.length, 3);
});

test("tavern gamble scoring rejects scattered all-big tiles without a complete shape", () => {
  const deck = createTavernMahjongDeck();
  const tilesByKey = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const tileByKey = (key) => tilesByKey(key)[0];
  const createPlayer = (tiles) => ({
    id: "tester",
    name: "tester",
    isHuman: true,
    seatIndex: 0,
    hand: tiles.slice(0, 4),
    flowers: [],
    discarded: [],
    exposedMelds: [],
    playedGroups: [],
    playedOwnTileCount: 0,
    folded: false,
    committed: 0,
    skipsDraw: false,
  });

  const scattered = [
    "wan-7",
    "tiao-7",
    "wan-8",
    "tong-8",
    "tiao-9",
    "tong-9",
  ].map(tileByKey);
  const scatteredScore = scoreTavernGamblePlayer(
    createPlayer(scattered),
    scattered.slice(4)
  );
  assert.equal(scatteredScore.totalFan, 0);
  assert.equal(scatteredScore.bestScore.validHu, false);

  const shaped = ["wan-7", "wan-8", "wan-9", "tiao-7", "tiao-8", "tiao-9"].map(
    tileByKey
  );
  const shapedScore = scoreTavernGamblePlayer(createPlayer(shaped), shaped.slice(4));
  assert.equal(shapedScore.bestScore.mainPattern, "双顺");
  assert.equal(shapedScore.bestScore.validHu, true);
  assert.equal(
    shapedScore.bestScore.detailLines.some((line) => line.includes("全大+2")),
    true
  );

  const doubleTriplet = [
    ...tilesByKey("wan-7", 3),
    ...tilesByKey("tiao-8", 3),
  ];
  const doubleTripletScore = scoreTavernGamblePlayer(
    createPlayer(doubleTriplet),
    doubleTriplet.slice(4)
  );
  assert.equal(doubleTripletScore.bestScore.mainPattern, "双刻");
  assert.equal(doubleTripletScore.bestScore.validHu, true);
  assert.equal(doubleTripletScore.bestScore.totalFan >= 7, true);

  const stepStraight = [
    ...tilesByKey("wan-1", 1),
    ...tilesByKey("wan-2", 2),
    ...tilesByKey("wan-3", 2),
    ...tilesByKey("wan-4", 1),
  ];
  const stepStraightScore = scoreTavernGamblePlayer(
    createPlayer(stepStraight),
    stepStraight.slice(4)
  );
  assert.equal(stepStraightScore.bestScore.mainPattern, "双顺");
  assert.equal(
    stepStraightScore.bestScore.detailLines.some((line) => line.includes("步步高+4")),
    true
  );

  const playedFirstPlayer = {
    ...createPlayer([
      ...tilesByKey("wan-7", 3),
      ...tilesByKey("tiao-8", 1),
    ]),
    playedGroups: [
      {
        id: "played-you-1",
        kind: "sequence",
        tileLabels: ["1万", "2万", "3万"],
        ownTileCount: 3,
        usesPublicTile: false,
        fan: 1,
      },
      {
        id: "played-you-2",
        kind: "sequence",
        tileLabels: ["4条", "5条", "6条"],
        ownTileCount: 3,
        usesPublicTile: false,
        fan: 1,
      },
    ],
    playedOwnTileCount: 6,
  };
  const playedFirstScore = scoreTavernGamblePlayer(playedFirstPlayer, [
    ...tilesByKey("tiao-8", 2),
    ...tilesByKey("tiao-9", 3),
  ]);

  assert.deepEqual(playedFirstScore.bestScore.selectedTiles, [
    "1万",
    "2万",
    "3万",
    "4条",
    "5条",
    "6条",
  ]);
  assert.equal(playedFirstScore.bestScore.mainPattern, "双顺");
  assert.equal(
    playedFirstScore.bestScore.detailLines.some((line) => line.includes("提前胡+2")),
    true
  );
});

test("tavern gamble played group locks public tiles and still requires discards", () => {
  const deck = createTavernMahjongDeck();
  const takeTiles = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const [wan1] = takeTiles("wan-1");
  const [wan2] = takeTiles("wan-2");
  const [wan3] = takeTiles("wan-3");
  const [tong5] = takeTiles("tong-5");
  const [tong8] = takeTiles("tong-8");
  const [tiao9] = takeTiles("tiao-9");
  const [wan9] = takeTiles("wan-9");
  const [draw1] = takeTiles("tiao-1");
  const [draw2] = takeTiles("tiao-2");
  const [draw3] = takeTiles("tong-1");
  const [draw4] = takeTiles("tong-2");

  const base = createTavernGambleSession({
    wager: 100,
    seed: 77,
    playerName: "tester",
  });
  const human = {
    ...base.players[0],
    hand: [wan1, wan2, tong5, tong8, tiao9, wan9],
  };
  const session = {
    ...base,
    phase: "draw-discard",
    pendingDrawTile: wan9,
    pendingDiscardsRemaining: 0,
    publicTiles: [wan3],
    wall: [draw1, draw2, draw3, draw4],
    players: [human, ...base.players.slice(1)],
    selectedPlayTileIds: [],
    spentPublicTileIds: [],
  };

  const selected = [wan1.id, wan2.id, wan3.id].reduce(
    (nextSession, tileId) => toggleTavernGamblePlayTile(nextSession, tileId),
    session
  );
  const selectedDespiteGlobalSpent = [wan1.id, wan2.id, wan3.id].reduce(
    (nextSession, tileId) => toggleTavernGamblePlayTile(nextSession, tileId),
    { ...session, spentPublicTileIds: [wan3.id] }
  );

  assert.deepEqual(selectedDespiteGlobalSpent.selectedPlayTileIds, [
    wan1.id,
    wan2.id,
    wan3.id,
  ]);

  const played = confirmTavernGamblePlayGroup(selected);
  const playedHuman = played.players[0];

  assert.deepEqual(played.spentPublicTileIds, []);
  assert.deepEqual(playedHuman.spentPublicTileIds, [wan3.id]);
  assert.equal(playedHuman.playedOwnTileCount, 2);
  assert.equal(playedHuman.playedGroups.length, 1);
  assert.equal(playedHuman.hand.length, 6);
  assert.equal(played.pendingDiscardsRemaining, 2);

  const afterFirstDiscard = discardForTavernGamble(played, playedHuman.hand[0].id);
  const afterSecondDiscardHuman = afterFirstDiscard.players[0];
  const afterSecondDiscard = discardForTavernGamble(
    afterFirstDiscard,
    afterSecondDiscardHuman.hand[0].id
  );

  assert.equal(afterSecondDiscard.players[0].hand.length, 4);
  assert.equal(afterSecondDiscard.pendingDrawTile, null);

  const waitingHuman = {
    ...human,
    hand: [wan1, wan2, tong5, tong8, tiao9, wan9],
    playedGroups: [
      {
        id: "played-you-1",
        kind: "sequence",
        tileLabels: ["1万", "2万", "3万"],
        ownTileCount: 3,
        usesPublicTile: false,
        fan: 1,
      },
    ],
    playedOwnTileCount: 3,
  };
  const secondGroupSession = {
    ...session,
    players: [waitingHuman, ...base.players.slice(1)],
    selectedPlayTileIds: [],
    spentPublicTileIds: [],
  };
  const secondSelected = [wan1.id, wan2.id, wan3.id].reduce(
    (nextSession, tileId) => toggleTavernGamblePlayTile(nextSession, tileId),
    secondGroupSession
  );
  const afterSecondGroup = confirmTavernGamblePlayGroup(secondSelected);

  assert.equal(afterSecondGroup.players[0].playedGroups.length, 2);
  assert.equal(afterSecondGroup.pendingDiscardsRemaining, 0);
  assert.notEqual(afterSecondGroup.phase, "draw-discard");
});

test("tavern gamble opens staged discard response windows", () => {
  const deck = createTavernMahjongDeck();
  const takeTiles = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const [wan1] = takeTiles("wan-1");
  const [wan2] = takeTiles("wan-2");
  const wan3Tiles = takeTiles("wan-3", 4);
  const [tong5] = takeTiles("tong-5");
  const [wan8] = takeTiles("wan-8");
  const [tiao9] = takeTiles("tiao-9");

  const base = createTavernGambleSession({
    wager: 100,
    seed: 91,
    playerName: "tester",
  });
  const human = {
    ...base.players[0],
    hand: [wan1, wan2, wan3Tiles[1], wan3Tiles[2]],
  };
  const npc = {
    ...base.players[1],
    hand: [wan3Tiles[0], tong5],
  };
  const session = {
    ...base,
    phase: "npc-thinking",
    npcThinkingSeat: npc.seatIndex,
    npcThinkTicksRemaining: 1,
    wall: [wan8, tiao9],
    publicTiles: [],
    publicDiscards: [],
    players: [human, npc, ...base.players.slice(2)],
  };

  const response = advanceTavernGambleNpcThinking(session);
  assert.equal(response.phase, "meld-window");
  assert.equal(response.meldCountdownTicks, 3);
  assert.equal(response.meldWindow?.stage, "chi-pong-kong");
  assert.equal(response.pendingMelds.some((option) => option.kind === "chi"), true);
  assert.equal(response.pendingMelds.some((option) => option.kind === "pong"), true);

  const pongWindow = advanceTavernGambleMeldCountdown(
    advanceTavernGambleMeldCountdown(
      advanceTavernGambleMeldCountdown(response)
    )
  );
  assert.equal(pongWindow.phase, "meld-window");
  assert.equal(pongWindow.meldWindow?.stage, "pong-kong");
  assert.equal(pongWindow.pendingMelds.some((option) => option.kind === "chi"), false);
  assert.equal(pongWindow.pendingMelds.some((option) => option.kind === "pong"), true);
});

test("tavern gamble discard responses can use public tiles with hand tiles", () => {
  const deck = createTavernMahjongDeck();
  const takeTiles = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const [wan6] = takeTiles("wan-6");
  const [wan7] = takeTiles("wan-7");
  const wan8Tiles = takeTiles("wan-8", 4);
  const [tong5] = takeTiles("tong-5");
  const [tiao9] = takeTiles("tiao-9");
  const base = createTavernGambleSession({
    wager: 100,
    seed: 93,
    playerName: "tester",
  });
  const human = {
    ...base.players[0],
    hand: [wan6, wan8Tiles[1], tong5, tiao9],
  };
  const npc = {
    ...base.players[1],
    hand: [tong5],
    skipsDraw: true,
  };
  const session = {
    ...base,
    phase: "npc-thinking",
    npcThinkingSeat: npc.seatIndex,
    npcThinkTicksRemaining: 1,
    wall: [takeTiles("tong-1")[0], takeTiles("tong-2")[0]],
    publicTiles: [wan7, wan8Tiles[2], wan8Tiles[3]],
    publicDiscards: [wan8Tiles[0]],
    players: [human, npc, ...base.players.slice(2)],
  };

  const response = advanceTavernGambleNpcThinking(session);
  assert.equal(response.phase, "meld-window");
  assert.equal(response.pendingMelds.some((option) => option.kind === "chi"), true);
  assert.equal(response.pendingMelds.some((option) => option.kind === "pong"), true);
  assert.equal(response.pendingMelds.some((option) => option.kind === "public-kong"), true);

  const kongOption = response.pendingMelds.find((option) => option.kind === "public-kong");
  assert.ok(kongOption);
  const declared = declareTavernGambleMeld(response, kongOption.id);
  const declaredHuman = declared.players[0];
  assert.equal(declaredHuman.exposedMelds.some((meld) => meld.kind === "public-kong"), true);
  assert.equal(declaredHuman.spentPublicTileIds.includes(wan8Tiles[2].id), true);
  assert.equal(declaredHuman.spentPublicTileIds.includes(wan8Tiles[3].id), true);
});

test("tavern gamble npc cannot auto-play more than two groups", () => {
  const deck = createTavernMahjongDeck();
  const takeTiles = (key, count = 1) => {
    const [suit, rankText] = key.split("-");
    const tiles = deck.filter(
      (candidate) =>
        candidate.kind === "suited" &&
        candidate.suit === suit &&
        candidate.rank === Number(rankText)
    );
    assert.equal(tiles.length >= count, true, `missing tile ${key}`);
    return tiles.slice(0, count);
  };
  const base = createTavernGambleSession({
    wager: 100,
    seed: 92,
    playerName: "tester",
  });
  const npc = {
    ...base.players[1],
    hand: [
      takeTiles("wan-1")[0],
      takeTiles("wan-2")[0],
      takeTiles("wan-3")[0],
      takeTiles("tiao-1")[0],
    ],
  };
  const session = {
    ...base,
    phase: "npc-thinking",
    npcThinkingSeat: npc.seatIndex,
    npcThinkTicksRemaining: 1,
    wall: [
      takeTiles("tiao-2")[0],
      takeTiles("tiao-3")[0],
      takeTiles("tong-1")[0],
      takeTiles("tong-2")[0],
      takeTiles("tong-3")[0],
      takeTiles("wan-4")[0],
      takeTiles("wan-5")[0],
      takeTiles("wan-6")[0],
    ],
    publicTiles: [
      takeTiles("tong-4")[0],
      takeTiles("tong-5")[0],
      takeTiles("tong-6")[0],
    ],
    players: [base.players[0], npc, ...base.players.slice(2)],
  };

  const next = advanceTavernGambleNpcThinking(session);
  const nextNpc = next.players.find((player) => player.id === npc.id);
  assert.ok(nextNpc);
  assert.equal(nextNpc.playedGroups.length <= 2, true);
});

test("tavern gamble completed player skips later betting and draw actions", () => {
  const base = createTavernGambleSession({
    wager: 100,
    seed: 81,
    playerName: "tester",
  });
  const completedGroup = {
    id: "played-you-1",
    kind: "sequence",
    tileLabels: ["1万", "2万", "3万"],
    ownTileCount: 3,
    usesPublicTile: false,
    fan: 1,
  };
  const completedHuman = {
    ...base.players[0],
    playedGroups: [
      completedGroup,
      {
        ...completedGroup,
        id: "played-you-2",
        tileLabels: ["4万", "5万", "6万"],
      },
    ],
    playedOwnTileCount: 6,
  };

  const bettingSkipped = resolveTavernGambleBettingAction(
    {
      ...base,
      phase: "betting",
      players: [completedHuman, ...base.players.slice(1)],
    },
    "check"
  );

  assert.notEqual(bettingSkipped.phase, "betting");
  assert.equal(bettingSkipped.players[0].playedGroups.length, 2);

  const drawSkipped = drawForTavernGamble({
    ...base,
    phase: "draw-discard",
    pendingDrawTile: null,
    pendingDiscardsRemaining: 0,
    players: [completedHuman, ...base.players.slice(1)],
  });

  assert.notEqual(drawSkipped.phase, "draw-discard");
  assert.equal(drawSkipped.pendingDiscardsRemaining, 0);
  assert.equal(drawSkipped.players[0].playedGroups.length, 2);
});

test("tavern work flow accepts dishwashing qte and submits with confirmation", () => {
  const state = withCouncilInDays(createBaseState(), 30);
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
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

  assert.equal(acceptWork.sessionState?.overlay?.type, "activity-confirm");

  const confirmedWork = tavernHouseModule.dispatch({
    gameState: acceptWork.gameState,
    characterDefinitions: acceptWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptWork.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.wash_dishes",
    },
  });

  assert.equal(confirmedWork.sessionState?.overlay?.type, "qte-bar");

  let qteResult = confirmedWork;
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
  assert.equal(
    playerCharacter.stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(submitResult.sessionState?.acceptedOffers.length, 0);
  assert.equal(
    submitResult.gameState.runtime.flags[
      getTavernCompletedWorkKey(tavernHouse.id, "offer.kulan.wash_dishes")
    ],
    true
  );
});

test("tavern work acceptance is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = tavernHouseModule.enter({
    gameState: createBaseState(),
    characterDefinitions: lowStaminaCharacters,
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

  const result = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sessionState?.acceptedOffers.length, 0);
});

test("tavern work submission is blocked when stamina is below activity cost", () => {
  const enterResult = tavernHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 90),
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
  const acceptWork = tavernHouseModule.dispatch({
    gameState: openAccept.gameState,
    characterDefinitions: openAccept.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openAccept.sessionState,
    request: { type: "action", actionId: "accept-work:offer.kulan.wash_dishes" },
  });
  const confirmedWork = tavernHouseModule.dispatch({
    gameState: acceptWork.gameState,
    characterDefinitions: acceptWork.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptWork.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.wash_dishes",
    },
  });

  let qteResult = confirmedWork;
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

  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: qteResult.gameState,
    characterDefinitions: qteResult.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: qteResult.sessionState,
    request: { type: "action", actionId: "submit-work:offer.kulan.wash_dishes" },
  });
  const lowStaminaCharacters = withPlayerStamina(
    openSubmitConfirm.characterDefinitions,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );

  const result = tavernHouseModule.dispatch({
    gameState: openSubmitConfirm.gameState,
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: openSubmitConfirm.sessionState,
    request: { type: "action", actionId: "confirm-submit-work" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(getPlayerCharacter(result.characterDefinitions).stats.gold, 120);
  assert.equal(result.sessionState?.acceptedOffers.length, 1);
});

test("tavern submitting unfinished work fails and clears active work", () => {
  const state = withCouncilInDays(createBaseState(), 30);
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

  assert.equal(acceptRandom.sessionState?.overlay?.type, "activity-confirm");

  const confirmedRandom = tavernHouseModule.dispatch({
    gameState: acceptRandom.gameState,
    characterDefinitions: acceptRandom.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: acceptRandom.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-work:offer.kulan.supply_run",
    },
  });

  assert.equal(confirmedRandom.sessionState?.acceptedOffers.length, 1);

  const openSubmitConfirm = tavernHouseModule.dispatch({
    gameState: confirmedRandom.gameState,
    characterDefinitions: confirmedRandom.characterDefinitions,
    houseDefinition: tavernHouse,
    playerCharacterId,
    sessionState: confirmedRandom.sessionState,
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

test("medicine compounding is blocked when stamina is below activity cost", () => {
  const lowStaminaCharacters = withPlayerStamina(
    prototypeCharacters,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = medicineHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 30),
    characterDefinitions: lowStaminaCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });

  const result = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-compounding" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sideEffects, undefined);
});

test("medicine compounding spends stamina when settled", () => {
  const startingStamina = getPlayerCharacter(prototypeCharacters).stamina;
  const enterResult = medicineHouseHouseModule.enter({
    gameState: withCouncilInDays(createBaseState(), 200),
    characterDefinitions: prototypeCharacters,
    houseDefinition: medicineHouse,
    playerCharacterId,
  });
  const startResult = medicineHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "start-compounding" },
  });
  assert.equal(startResult.sessionState?.overlay?.type, "activity-confirm");

  const confirmedStart = medicineHouseHouseModule.dispatch({
    gameState: startResult.gameState,
    characterDefinitions: startResult.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: startResult.sessionState,
    request: { type: "action", actionId: "confirm-start-compounding" },
  });

  const result = medicineHouseHouseModule.dispatch({
    gameState: confirmedStart.gameState,
    characterDefinitions: confirmedStart.characterDefinitions,
    houseDefinition: medicineHouse,
    playerCharacterId,
    sessionState: confirmedStart.sessionState,
    request: { type: "action", actionId: "compound-finish" },
  });

  assert.equal(result.sessionState?.overlay?.type, "result");
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
});

test("temple work is blocked when stamina is below activity cost", () => {
  const baseState = createMonkStageState();
  const lowStaminaMonkCharacters = withPlayerStamina(
    createPrototypeCharactersForStoryStage(
      ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
    ),
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...baseState,
      currentHouseId: templeHouse.id,
      runtime: {
        ...baseState.runtime,
        flags: {
          ...baseState.runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        },
        variables: {
          ...baseState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
        },
      },
    },
    characterDefinitions: lowStaminaMonkCharacters,
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

  const result = templeHouseHouseModule.dispatch({
    gameState: openResult.gameState,
    characterDefinitions: openResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openResult.sessionState,
    request: { type: "action", actionId: "assign-temple-task:copy-scripture" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(result.sideEffects, undefined);
});

test("temple begging settlement is blocked when stamina is below activity cost", () => {
  const baseState = createMonkStageState();
  const lowStaminaMonkCharacters = withPlayerStamina(
    createPrototypeCharactersForStoryStage(
      ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
    ),
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...baseState,
      currentHouseId: templeHouse.id,
      runtime: {
        ...baseState.runtime,
        flags: {
          ...baseState.runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
        },
        variables: {
          ...baseState.runtime.variables,
          [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 30,
          [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "beg-alms",
          [PLAYER_GRAIN_RUNTIME_KEYS.quantityDou]: 15,
        },
      },
    },
    characterDefinitions: lowStaminaMonkCharacters,
    houseDefinition: templeHouse,
    playerCharacterId,
  });
  const openSubmit = templeHouseHouseModule.dispatch({
    gameState: enterResult.gameState,
    characterDefinitions: enterResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: {
      ...enterResult.sessionState,
      dialoguePhase: "open",
    },
    request: { type: "action", actionId: "submit-temple-begging-food" },
  });

  assert.equal(openSubmit.sessionState?.overlay?.type, "submit-food");

  const result = templeHouseHouseModule.dispatch({
    gameState: openSubmit.gameState,
    characterDefinitions: openSubmit.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: openSubmit.sessionState,
    request: { type: "action", actionId: "confirm-temple-begging-food" },
  });

  assert.equal(result.sessionState?.overlay?.type, "alert");
  assert.equal(
    result.gameState.runtime.variables[PLAYER_GRAIN_RUNTIME_KEYS.quantityDou],
    15
  );
  assert.equal(
    getPlayerCharacter(result.characterDefinitions).stamina,
    ACTIVITY_COMPLETION_STAMINA_COST - 1
  );
});

test("temple work reaching contribution threshold starts shared map auto advance for next review", () => {
  const monkCharacters = createPrototypeCharactersForStoryStage(
    ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
  );
  const startingStamina = getPlayerCharacter(monkCharacters).stamina;
  const enterResult = templeHouseHouseModule.enter({
    gameState: {
      ...withCouncilInDays(createMonkStageState(), 30),
      runtime: {
        ...withCouncilInDays(createMonkStageState(), 30).runtime,
        flags: {
          ...withCouncilInDays(createMonkStageState(), 30).runtime.flags,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
          [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        },
        variables: {
          ...withCouncilInDays(createMonkStageState(), 30).runtime.variables,
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
  assert.equal(startWorkResult.sessionState?.overlay?.type, "activity-confirm");

  const confirmedWorkResult = templeHouseHouseModule.dispatch({
    gameState: startWorkResult.gameState,
    characterDefinitions: startWorkResult.characterDefinitions,
    houseDefinition: templeHouse,
    playerCharacterId,
    sessionState: startWorkResult.sessionState,
    request: {
      type: "action",
      actionId: "confirm-start-temple-task:copy-scripture",
    },
  });

  let qteResult = confirmedWorkResult;
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
    getPlayerCharacter(qteResult.characterDefinitions).stamina,
    startingStamina - ACTIVITY_COMPLETION_STAMINA_COST
  );
  assert.equal(
    qteResult.gameState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked],
    true
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

test("story battle rescue flow opens battle demo scenario and returns to keep review", () => {
  const completion = {
    completedFlagKey:
      ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted,
    winFlagKey: ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon,
    battleIdVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId,
    resultVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult,
    enterHouseId: keepHouse.id,
    mainMissionText: "战后帅府评定",
  };
  const session = createSundeyaRescueBattleSession(completion);
  const startedState = startStoryBattle(createBaseState(), session);

  assert.equal(startedState.ui.currentView, "battle");
  assert.equal(startedState.storyBattle?.phase, "embedded-running");
  assert.equal(startedState.storyBattle?.demoScenarioId, "sundeya-rescue");
  assert.equal(
    startedState.storyBattle?.units.filter((unit) => unit.controller === "player").length,
    1
  );

  const finishResult = dispatchStoryBattleAction(startedState, "embedded-victory");
  assert.equal(finishResult.enterHouseId, keepHouse.id);
  assert.equal(finishResult.state.storyBattle, null);
  assert.equal(finishResult.state.ui.currentView, "house");
  assert.equal(
    finishResult.state.runtime.flags[
      ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted
    ],
    true
  );
  assert.equal(
    finishResult.state.runtime.variables[
      ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult
    ],
    "victory"
  );
  assert.equal(
    finishResult.state.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown],
    0
  );
});

test("medicine compounding grades targets by closeness", () => {
  const warmMix = resolveCompoundingGrade(
    {
      ailmentId: "wind_cold",
      ailmentName: "风寒",
      coldRequired: -2,
      healRequired: 5,
      maxPoison: 1,
    },
    [
      { herbId: "herb_ai_cao", amount: 1 },
      { herbId: "herb_xing_ren", amount: 1 },
      { herbId: "herb_gan_cao", amount: 1 },
    ],
    [
      { id: "herb_ai_cao", name: "艾草", cold: 0, heat: 2, poison: 0, heal: 1 },
      { id: "herb_xing_ren", name: "杏仁", cold: 1, heat: 0, poison: 0, heal: 2 },
      { id: "herb_gan_cao", name: "甘草", cold: 0, heat: 0, poison: -1, heal: 2 },
    ]
  );

  const coolMix = resolveCompoundingGrade(
    {
      ailmentId: "wind_cold",
      ailmentName: "风寒",
      coldRequired: -2,
      healRequired: 5,
      maxPoison: 1,
    },
    [
      { herbId: "herb_huang_lian", amount: 1 },
      { herbId: "herb_bo_he", amount: 1 },
    ],
    [
      { id: "herb_huang_lian", name: "黄连", cold: 3, heat: 0, poison: 1, heal: 2 },
      { id: "herb_bo_he", name: "薄荷", cold: 2, heat: 0, poison: 0, heal: 1 },
    ]
  );

  assert.equal(warmMix.grade, "A");
  assert.equal(coolMix.grade, "D");
});

test("medicine compounding expects cooling herbs for inner heat", () => {
  const coolMix = resolveCompoundingGrade(
    {
      ailmentId: "inner_heat",
      ailmentName: "内热",
      coldRequired: 2,
      healRequired: 4,
      maxPoison: 1,
    },
    [
      { herbId: "herb_huang_lian", amount: 1 },
      { herbId: "herb_gan_cao", amount: 1 },
    ],
    [
      { id: "herb_huang_lian", name: "黄连", cold: 3, heat: 0, poison: 1, heal: 2 },
      { id: "herb_gan_cao", name: "甘草", cold: 0, heat: 0, poison: -1, heal: 2 },
    ]
  );

  const warmMix = resolveCompoundingGrade(
    {
      ailmentId: "inner_heat",
      ailmentName: "内热",
      coldRequired: 2,
      healRequired: 4,
      maxPoison: 1,
    },
    [
      { herbId: "herb_ai_cao", amount: 1 },
      { herbId: "herb_sheng_jiang", amount: 1 },
    ],
    [
      { id: "herb_ai_cao", name: "艾草", cold: 0, heat: 2, poison: 0, heal: 1 },
      { id: "herb_sheng_jiang", name: "生姜", cold: 0, heat: 2, poison: 0, heal: 1 },
    ]
  );

  assert.equal(coolMix.grade, "A");
  assert.equal(warmMix.grade, "D");
});
