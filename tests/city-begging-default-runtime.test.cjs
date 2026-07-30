const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createLaunchPlayableRequest,
  runPlayableRuntime,
} = require("../.test-dist/core/runtime/playable-runtime.js");
const {
  prototypeCards,
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

test("city begging default dialogue selects a location and locks a fixed option result", async () => {
  const {
    createCityBeggingDefaultDialogueState,
    selectCityBeggingDefaultLocation,
    selectCityBeggingDefaultOption,
  } = await import(
    "../.test-dist/application/playables/city-begging/city-begging-default-dialogue.js"
  );

  const launched = createCityBeggingDefaultDialogueState(1000);
  assert.equal(launched.mode, "default-dialogue");
  assert.equal(launched.phase, "location-select");

  const atLocation = selectCityBeggingDefaultLocation(
    launched,
    "xicheng_guanyin"
  );
  assert.equal(atLocation.phase, "encounter");
  assert.equal(atLocation.selectedLocationId, "xicheng_guanyin");

  const afterOption = selectCityBeggingDefaultOption(
    atLocation,
    "help_mend_net",
    1200
  );
  assert.equal(afterOption.phase, "fortune-draw");
  assert.equal(afterOption.selectedOptionId, "help_mend_net");
  assert.equal(afterOption.fixedResult, "ji");
  assert.equal(afterOption.settlementApplied, false);
});

test("city begging launch payload can start the default dialogue mode", () => {
  const launched = runPlayableRuntime({
    state: createRuntimeState(),
    request: createLaunchPlayableRequest("city-begging", {
      payload: { mode: "default-dialogue", now: 1000 },
    }),
  });

  assert.equal(launched.handled, true);
  assert.equal(launched.state.app.beggingMiniGameState?.mode, "default-dialogue");
  assert.equal(
    launched.state.app.beggingMiniGameState?.phase,
    "location-select"
  );
});
