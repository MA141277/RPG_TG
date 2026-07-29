const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createInitialGrainShopSessionState,
} = require("../.test-dist/application/house-modules/grain-shop/grain-shop-session-state.js");
const {
  createInteractiveActionRequest,
} = require("../.test-dist/core/runtime/interactive-runtime.js");
const {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  getAccountingGradeReward,
  resolveAccountingGrade,
} = require("../.test-dist/application/grain-shop/accounting-minigame.js");
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

  const core = createInitialState({
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

  return {
    core: {
      ...core,
      ui: {
        ...core.ui,
        houseSession: {
          moduleId: "grain-shop",
          state: createInitialGrainShopSessionState("hello", "idle"),
        },
      },
    },
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

test("grain-accounting completion returns character status patches for runtime commit", () => {
  const score = 18;
  const grade = resolveAccountingGrade(score);
  const reward = getAccountingGradeReward(grade);
  const playerBefore = prototypeCharacters.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerBefore);

  const launched = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("grain-accounting", {
      ownerContext: {
        ownerKind: "house",
        ownerId: "house.grain-shop",
        returnPolicy: "resume-owner",
      },
    }),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });

  const minigameState = launched.state.core.ui.houseSession.state;
  const readyToSettle = {
    ...launched.state,
    core: {
      ...launched.state.core,
      ui: {
        ...launched.state.core.ui,
        houseSession: {
          ...launched.state.core.ui.houseSession,
          state: {
            ...minigameState,
            overlay: {
              ...minigameState.overlay,
              score,
              secondsLeft: 1,
            },
          },
        },
      },
    },
  };

  const completed = runPlayableRuntime({
    state: readyToSettle,
    request: createInteractiveActionRequest("playable.grain-accounting.tick"),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });

  assert.equal(completed.handled, true);
  assert.deepEqual(completed.characterStatusById[playerCharacterId], {
    statPatch: { gold: playerBefore.stats.gold + reward.money },
    skillPatch: {
      accounting: Math.max(
        0,
        (playerBefore.skills?.accounting ?? 0) + reward.math
      ),
    },
    stamina: Math.max(0, playerBefore.stamina - ACTIVITY_COMPLETION_STAMINA_COST),
  });
});
