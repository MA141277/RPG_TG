const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createDemoFormationStageState,
} = require("../.test-dist/application/formation/formation-stage.js");
const {
  createPartyEditorStageViewModel,
  createBattleFormationPreviewViewModel,
} = require("../.test-dist/application/formation/formation-stage-view-model.js");
const {
  openPartyEditor,
  closePartyEditor,
} = require("../.test-dist/application/app-actions.js");
const {
  createStagePresenterOutput,
} = require("../.test-dist/application/presenter/stage-presenters.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createPrototypeCharactersForStoryStage,
  prototypeCards,
  prototypeCities,
  prototypeCityEntries,
  prototypeCityNpcPools,
  prototypeHouses,
  prototypeMap,
  prototypeValuables,
} = require("../.test-dist/content/prototype-world.js");

test("shared formation-stage seam exposes one selected team for both party-editor and battle consumers", () => {
  const state = createDemoFormationStageState();
  const partyEditorModel = createPartyEditorStageViewModel(state);
  const battlePreviewModel = createBattleFormationPreviewViewModel(state);

  assert.equal(partyEditorModel.teams.length, 1);
  assert.equal(partyEditorModel.teams[0].name, "朱重八本队");
  assert.equal(partyEditorModel.resources[0].label, "金钱");
  assert.equal(partyEditorModel.resources[1].label, "食物");
  assert.equal(partyEditorModel.resources[2].label, "马匹");
  assert.equal(partyEditorModel.teams[0].slots.length, 9);
  assert.equal(battlePreviewModel.teamName, "朱重八本队");
  assert.equal(battlePreviewModel.slots.length, 9);
  assert.deepEqual(
    partyEditorModel.teams[0].slots.map((slot) => slot.slotKey),
    battlePreviewModel.slots.map((slot) => slot.slotKey)
  );
});

test("party-editor opens as a real stage and exits back to map", () => {
  const baseState = createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: prototypeCities[0].id,
    currentHouseId: prototypeHouses[0]?.id ?? null,
    playerCharacterId: "char.player",
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
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
        swordId: null,
        armorId: null,
      },
    },
    currentView: "map",
  });
  const characterDefinitions =
    createPrototypeCharactersForStoryStage("zhu-yuanzhang", null);
  const appState = {
    gameState: baseState,
    characterDefinitions,
  };

  const openedState = openPartyEditor(appState);
  assert.equal(openedState.gameState.ui.currentView, "party-editor");

  const stage = createStagePresenterOutput({
    appState: openedState,
    cityDefinition: prototypeCities[0],
    cityDefinitions: prototypeCities,
    houseDefinitions: prototypeHouses,
    cityEntries: prototypeCityEntries,
    cityNpcPoolDefinitions: prototypeCityNpcPools,
    playerCharacterId: "char.player",
  });
  assert.deepEqual(stage, { type: "party-editor" });

  const closedState = closePartyEditor(openedState);
  assert.equal(closedState.gameState.ui.currentView, "map");
});
