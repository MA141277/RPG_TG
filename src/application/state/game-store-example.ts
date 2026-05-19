import { createGameStore } from "./game-store";
import { createInitialState } from "./create-initial-state";
import {
  getSampleChoiceOptions,
  sampleCharacters,
  sampleEventsById,
  sampleEvent,
  sampleScenesById,
} from "../../content/sample-scenario";

export function runSampleSceneFlow() {
  const initialState = createInitialState({
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
    activeEventId: sampleEvent.id,
    activeSceneId: sampleEvent.entrySceneId,
    currentView: "scene",
  });

  const gameStore = createGameStore(initialState, {
    characterDefinitions: sampleCharacters,
    eventDefinitionsById: sampleEventsById,
    sceneDefinitionsById: sampleScenesById,
  });

  const firstSnapshot = gameStore.syncScene();
  const secondSnapshot = gameStore.advanceScene();
  const thirdSnapshot = gameStore.advanceScene();
  const fourthSnapshot = gameStore.advanceScene();

  const choiceOptions = getSampleChoiceOptions();
  const finalSnapshot =
    choiceOptions == null || choiceOptions[0] == null
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
