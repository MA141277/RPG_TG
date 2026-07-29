const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createInitialMedicineHouseSessionState,
} = require("../.test-dist/application/house-modules/medicine-house/medicine-house-session-state.js");
const {
  resolveCompoundingGrade,
} = require("../.test-dist/application/medicine-house/compounding-minigame.js");
const {
  createInteractiveActionRequest,
} = require("../.test-dist/core/runtime/interactive-runtime.js");
const {
  runPlayableRuntime,
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
  const medicineHouse = prototypeHouses.find(
    (houseDefinition) => houseDefinition.moduleId === "medicine-house"
  );
  const herb = {
    id: "herb.test",
    name: "Test Herb",
    cold: 2,
    heat: 0,
    poison: 0,
    heal: 3,
  };
  const target = {
    ailmentId: "ailment.test",
    ailmentName: "Test Ailment",
    coldRequired: 2,
    healRequired: 3,
    maxPoison: 0,
  };
  const sessionState = createInitialMedicineHouseSessionState("hello");

  const core = createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: medicineHouse.id,
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
          moduleId: "medicine-house",
          state: {
            ...sessionState,
            overlay: {
              type: "compounding",
              target,
              availableHerbs: [herb],
              selections: [{ herbId: herb.id, amount: 1 }],
              selectionsLeft: 0,
              secondsLeft: 1,
            },
          },
        },
      },
      runtime: {
        ...core.runtime,
        playableSession: {
          sessionId: "playable.medicine-compounding",
          playableId: "medicine-compounding",
          integrationId: "playable.medicine-compounding.house.medicine-house",
          family: "minigame",
          ownerContext: {
            ownerKind: "house",
            ownerId: medicineHouse.id,
            returnPolicy: "resume-owner",
          },
          status: "active",
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
    expectedReward: resolveCompoundingGrade(
      target,
      [{ herbId: herb.id, amount: 1 }],
      [herb]
    ).reward,
  };
}

test("medicine-compounding completion returns character status patches for runtime commit", () => {
  const runtimeState = createRuntimeState();
  const playerBefore = prototypeCharacters.find(
    (characterDefinition) => characterDefinition.id === playerCharacterId
  );
  assert.ok(playerBefore);

  const completed = runPlayableRuntime({
    state: runtimeState,
    request: createInteractiveActionRequest("playable.medicine-compounding.finish"),
    characterDefinitions: prototypeCharacters,
    playerCharacterId,
  });

  assert.equal(completed.handled, true);
  assert.deepEqual(completed.characterStatusById[playerCharacterId], {
    skillPatch: {
      compounding: Math.max(
        0,
        (playerBefore.skills?.compounding ?? 0) + runtimeState.expectedReward.medicine
      ),
    },
    stamina: Math.max(0, playerBefore.stamina - ACTIVITY_COMPLETION_STAMINA_COST),
  });
});
