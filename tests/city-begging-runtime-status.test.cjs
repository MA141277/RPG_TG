const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createInteractiveActionRequest,
} = require("../.test-dist/core/runtime/interactive-runtime.js");
const {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  createAdvanceTimeSegmentsRequest,
  runTimeRuntime,
} = require("../.test-dist/core/runtime/time-runtime.js");
const {
  ACTIVITY_COMPLETION_STAMINA_COST,
} = require("../.test-dist/application/player/player-stamina.js");
const {
  CITY_BEGGING_DURATION_DAYS,
} = require("../.test-dist/application/minigames/city-begging-minigame.js");
const {
  convertHouseActivityDaysToSegments,
} = require("../.test-dist/application/house/house-activity-costs.js");
const {
  prototypeCards,
  prototypeCharacters,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";

function createRuntimeState() {
  const grainShopHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.moduleId === "grain-shop"
  );

  return {
    core: createInitialState({
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

test("city-begging completion returns character status patches for runtime commit", () => {
  const playerBefore = prototypeCharacters.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerBefore);

  const launched = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { now: 789 },
    }),
    characterDefinitions: prototypeCharacters,
  });

  const completed = runPlayableRuntime({
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

  assert.equal(completed.handled, true);
  assert.deepEqual(completed.characterStatusById[playerCharacterId], {
    statPatch: { gold: playerBefore.stats.gold + 2 },
    stamina: Math.max(0, playerBefore.stamina - ACTIVITY_COMPLETION_STAMINA_COST),
  });

  const expectedState = runTimeRuntime({
    state: launched.state.core,
    request: createAdvanceTimeSegmentsRequest(
      convertHouseActivityDaysToSegments(CITY_BEGGING_DURATION_DAYS)
    ),
  }).state;
  assert.deepEqual(completed.state.core.calendar, expectedState.calendar);
  assert.equal(completed.state.core.world.timeOfDay, expectedState.world.timeOfDay);
});
