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
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  ACTIVITY_COMPLETION_STAMINA_COST,
} = require("../.test-dist/application/player/player-stamina.js");
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
