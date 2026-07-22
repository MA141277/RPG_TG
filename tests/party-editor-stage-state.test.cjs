const test = require("node:test");
const assert = require("node:assert/strict");

const {
  selectPlayerTroopSnapshots,
  selectTroopEditorResources,
} = require("../.test-dist/application/troop-editor/troop-editor-selectors.js");
const {
  createTroopEditorStageViewModel,
} = require("../.test-dist/application/troop-editor/troop-editor-stage-view-model.js");
const {
  openTroopEditor,
  openTroopManagement,
  closeTroopEditor,
  closeTroopManagement,
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

function createAppState() {
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

  return {
    gameState: baseState,
    characterDefinitions,
  };
}

function getPlayerCharacter(appState) {
  return appState.characterDefinitions.find(
    (characterDefinition) => characterDefinition.id === "char.player"
  );
}

test("shared troop-editor selectors expose live gold fame and one player troop snapshot", () => {
  const appState = createAppState();
  const playerCharacter = getPlayerCharacter(appState);

  const resources = selectTroopEditorResources(appState, "char.player");
  const troopSnapshots = selectPlayerTroopSnapshots(appState, "char.player");
  const viewModel = createTroopEditorStageViewModel({
    resources,
    troopSnapshots,
  });

  assert.deepEqual(
    resources.map((resource) => resource.label),
    ["金钱", "声望"]
  );
  assert.equal(resources[0].valueText, `${playerCharacter.stats.gold} 文`);
  assert.equal(resources[1].valueText, `${playerCharacter.stats.fame}`);
  assert.equal(troopSnapshots.length, 1);
  assert.equal(troopSnapshots[0].name, "朱重八本队");
  assert.equal(troopSnapshots[0].slots.length, 9);
  assert.deepEqual(
    troopSnapshots[0].slots
      .filter((slot) => slot.isOccupied)
      .map((slot) => [slot.slotKey, slot.occupantName]),
    [
      ["front-left", "长枪"],
      ["front-center", "步兵"],
      ["front-right", "长枪"],
      ["middle-center", "步兵"],
      ["rear-center", "弓兵"],
    ]
  );
  assert.deepEqual(
    viewModel.troops[0].slots.map((slot) => slot.slotKey),
    [
      "rear-left",
      "middle-left",
      "front-left",
      "rear-center",
      "middle-center",
      "front-center",
      "rear-right",
      "middle-right",
      "front-right",
    ]
  );
  assert.equal(viewModel.troops.length, 1);
  assert.equal(viewModel.resources.length, 2);
});

test("troop-editor opens as a real stage and exits back to map", () => {
  const appState = createAppState();

  const openedState = openTroopEditor(appState);
  assert.equal(openedState.gameState.ui.currentView, "troop-editor");

  const stage = createStagePresenterOutput({
    appState: openedState,
    cityDefinition: prototypeCities[0],
    cityDefinitions: prototypeCities,
    houseDefinitions: prototypeHouses,
    cityEntries: prototypeCityEntries,
    cityNpcPoolDefinitions: prototypeCityNpcPools,
    playerCharacterId: "char.player",
  });
  assert.equal(stage.type, "troop-editor");
  if (stage.type !== "troop-editor") {
    throw new Error("Expected troop-editor stage output.");
  }
  assert.deepEqual(
    stage.viewModel.resources.map((resource) => resource.label),
    ["金钱", "声望"]
  );
  assert.equal(stage.viewModel.troops[0].name, "朱重八本队");

  const closedState = closeTroopEditor(openedState);
  assert.equal(closedState.gameState.ui.currentView, "map");
});

test("troop-management opens from troop-editor and returns to troop-editor", () => {
  const appState = createAppState();

  const editorState = openTroopEditor(appState);
  const managementState = openTroopManagement(editorState);
  assert.equal(managementState.gameState.ui.currentView, "troop-management");

  const stage = createStagePresenterOutput({
    appState: managementState,
    cityDefinition: prototypeCities[0],
    cityDefinitions: prototypeCities,
    houseDefinitions: prototypeHouses,
    cityEntries: prototypeCityEntries,
    cityNpcPoolDefinitions: prototypeCityNpcPools,
    playerCharacterId: "char.player",
  });
  assert.equal(stage.type, "troop-management");
  if (stage.type !== "troop-management") {
    throw new Error("Expected troop-management stage output.");
  }
  assert.equal(stage.viewModel.actions.at(-1)?.actionId, "close-troop-management");
  assert.equal(stage.viewModel.summaryFields.length, 5);
  assert.equal(stage.viewModel.battlefieldSlots.length, 9);

  const closedState = closeTroopManagement(managementState);
  assert.equal(closedState.gameState.ui.currentView, "troop-editor");
});
