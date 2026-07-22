import {
  getSampleChoiceOptions,
  sampleCharacters,
  sampleDialogue,
  sampleDialoguesById,
  sampleEvent,
  sampleEventsById,
} from "../../content/sample-scenario";
import { createInitialState } from "./create-initial-state";
import { createGameStore } from "./game-store";

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
    activeEventId: sampleEvent.id,
    activeDialogueId: sampleDialogue.id,
    currentView: "dialogue",
  });

  const gameStore = createGameStore(initialState, {
    characterDefinitions: sampleCharacters,
    eventDefinitionsById: sampleEventsById,
    dialogueDefinitionsById: sampleDialoguesById,
  });

  const firstSnapshot = gameStore.syncDialogue();
  const secondSnapshot = gameStore.advanceDialogue();
  const thirdSnapshot = gameStore.advanceDialogue();
  const fourthSnapshot = gameStore.advanceDialogue();

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
