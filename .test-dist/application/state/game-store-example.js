"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSampleSceneFlow = runSampleSceneFlow;
const sample_scenario_1 = require("../../content/sample-scenario");
const create_initial_state_1 = require("./create-initial-state");
const game_store_1 = require("./game-store");
function runSampleSceneFlow() {
    const initialState = (0, create_initial_state_1.createInitialState)({
        currentMapId: "map.central_japan",
        currentCityId: "city.gifu",
        currentHouseId: "house.gifu.castle",
        playerCharacterId: "char.kinoshita_tokichiro",
        chapterId: "chapter.rising_sun",
        year: 1567,
        month: 6,
        day: 1,
        pinnedCharacterId: "char.kinoshita_tokichiro",
        reviewDateText: "剩余40天",
        mainHouseMissionText: "前往评定会场",
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
        activeEventId: sample_scenario_1.sampleEvent.id,
        activeSceneId: sample_scenario_1.sampleEvent.entrySceneId,
        currentView: "scene",
    });
    const gameStore = (0, game_store_1.createGameStore)(initialState, {
        characterDefinitions: sample_scenario_1.sampleCharacters,
        eventDefinitionsById: sample_scenario_1.sampleEventsById,
        sceneDefinitionsById: sample_scenario_1.sampleScenesById,
    });
    const firstSnapshot = gameStore.syncScene();
    const secondSnapshot = gameStore.advanceScene();
    const thirdSnapshot = gameStore.advanceScene();
    const fourthSnapshot = gameStore.advanceScene();
    const choiceOptions = (0, sample_scenario_1.getSampleChoiceOptions)();
    const finalSnapshot = choiceOptions == null || choiceOptions[0] == null
        ? fourthSnapshot
        : gameStore.chooseOption(choiceOptions[0]);
    return {
        firstSnapshot,
        secondSnapshot,
        thirdSnapshot,
        fourthSnapshot,
        finalSnapshot,
    };
}
