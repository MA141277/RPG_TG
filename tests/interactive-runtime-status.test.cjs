const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createInteractiveActionRequest,
  runInteractiveRuntime,
} = require("../.test-dist/core/runtime/interactive-runtime.js");
const {
  createLaunchPlayableRequest,
  createPlayableActionRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  runStoryCallback,
} = require("../.test-dist/application/story/story-callbacks.js");
const {
  ACTIVITY_COMPLETION_STAMINA_COST,
} = require("../.test-dist/application/player/player-stamina.js");
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

const keepHouse = prototypeHouses.find(
  (houseDefinition) => houseDefinition.moduleId === "keep-house"
);

function createRuntimeState(coreState) {
  const grainShopHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.moduleId === "grain-shop"
  );

  return {
    core:
      coreState ??
      createInitialState({
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
      }),
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function startStoryBattleRuntimeState() {
  const started = runStoryCallback(
    "story.zhu_yuanzhang.start-sundeya-rescue-battle",
    {
      completedFlagKey:
        ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted,
      winFlagKey: ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon,
      battleIdVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId,
      resultVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult,
    },
    {
      state: createRuntimeState().core,
      characterDefinitions: prototypeCharacters,
    }
  );

  return createRuntimeState(started.state);
}

test("interactive runtime forwards playable character status patches", () => {
  const playerBefore = prototypeCharacters.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerBefore);

  const launched = runInteractiveRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { now: 789 },
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });

  const completed = runInteractiveRuntime({
    state: launched.state,
    request: createInteractiveActionRequest("interactive.city-begging.complete", {
      result: {
        foodGain: 3,
        goldGain: 2,
        maxCombo: 4,
        success: true,
      },
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });

  assert.equal(completed.session, null);
  assert.deepEqual(completed.characterStatusById[playerCharacterId], {
    statPatch: { gold: playerBefore.stats.gold + 2 },
    stamina: Math.max(0, playerBefore.stamina - ACTIVITY_COMPLETION_STAMINA_COST),
  });
});

test("story battle playable runtime mirrors legacy interactive result as follow-up", () => {
  assert.ok(keepHouse, "Expected prototype keep house to exist.");

  const settled = runPlayableRuntime({
    state: startStoryBattleRuntimeState(),
    request: createPlayableActionRequest("story-battle", "battle-action", {
      battleActionId: "embedded-victory",
    }),
    characterDefinitions: prototypeCharacters,
  });

  const expectedFollowUp = {
    type: "reenter-house",
    houseId: keepHouse.id,
  };
  assert.deepEqual(settled.interactive, expectedFollowUp);
  assert.deepEqual(settled.followUp, expectedFollowUp);
});

test("interactive runtime forwards playable follow-up while keeping legacy interactive", () => {
  assert.ok(keepHouse, "Expected prototype keep house to exist.");

  const settled = runInteractiveRuntime({
    state: startStoryBattleRuntimeState(),
    request: createInteractiveActionRequest("interactive.story-battle.action", {
      battleActionId: "embedded-victory",
    }),
    characterDefinitions: prototypeCharacters,
  });

  const expectedFollowUp = {
    type: "reenter-house",
    houseId: keepHouse.id,
  };
  assert.deepEqual(settled.interactive, expectedFollowUp);
  assert.deepEqual(settled.followUp, expectedFollowUp);
});
