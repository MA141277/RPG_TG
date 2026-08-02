const nodeTest = require("node:test");
const assert = require("node:assert/strict");

nodeTest(
  "city-begging settlement spends stamina again on the second completed round",
  () => {
    const { createInitialState } = require("../.test-dist/application/state/create-initial-state.js");
    const {
      commitRuntimeRequest,
    } = require("../.test-dist/core/runtime/state-sync-runtime.js");
    const {
      createLaunchPlayableRequest,
      createPlayableActionRequest,
      runPlayableRuntime,
    } = require("../.test-dist/core/runtime/playable-runtime.js");
    const {
      prototypeCharacters,
    } = require("../.test-dist/content/prototype-world.js");

    const playerCharacterId = "char.player";
    const playerCharacter = prototypeCharacters.find(
      (characterDefinition) => characterDefinition.id === playerCharacterId
    );
    assert.ok(playerCharacter, "Expected prototype player character to exist.");

    let appState = {
      gameState: createInitialState({
        currentMapId: "map.yuanmo_campaign",
        currentCityId: "city.kulan",
        currentHouseId: null,
        playerCharacterId,
        chapterId: "chapter.prototype",
        year: 1567,
        month: 1,
        day: 1,
        pinnedCharacterId: playerCharacterId,
        reviewDateText: "今日评定",
        mainHouseMissionText: "朱元璋：皇觉寺开局",
        cards: {
          ownedCardIds: [],
          selectedCardId: null,
        },
        valuables: {
          items: [],
          selectedItemId: null,
          equippedWeaponSet: {
            swordId: null,
            armorId: null,
          },
        },
        currentView: "city",
      }),
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
      characterDefinitions: [playerCharacter],
    };

    function commit(request) {
      return commitRuntimeRequest({
        state: appState,
        request,
        context: {
          router: {
            route: ({ state, request }) =>
              runPlayableRuntime({
                state,
                request,
                characterDefinitions: appState.characterDefinitions,
                playerCharacterId,
              }),
          },
        },
      }).state;
    }

    appState = commit(
      createLaunchPlayableRequest("city-begging", { payload: { now: 0 } })
    );
    appState = commit(
      createPlayableActionRequest("city-begging", "tick", {
        now: 60000,
      })
    );
    appState = commit(
      createPlayableActionRequest("city-begging", "confirm-result")
    );

    assert.equal(appState.characterStatusById?.[playerCharacterId]?.stamina, 85);

    appState = commit(
      createLaunchPlayableRequest("city-begging", { payload: { now: 1000 } })
    );
    appState = commit(
      createPlayableActionRequest("city-begging", "tick", {
        now: 61000,
      })
    );
    appState = commit(
      createPlayableActionRequest("city-begging", "confirm-result")
    );

    assert.equal(appState.characterStatusById?.[playerCharacterId]?.stamina, 70);
  }
);
