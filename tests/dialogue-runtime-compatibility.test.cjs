const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createActiveGameContent,
} = require("../.test-dist/application/content/active-game-content.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  startEvent,
} = require("../.test-dist/application/events/event-runner.js");
const {
  parseScenarioPack,
} = require("../.test-dist/application/scenario/scenario-pack-loader.js");
const {
  runDialogueFromEvent,
} = require("../.test-dist/core/runtime/dialogue-runtime.js");

function createBaseState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.test",
    currentHouseId: null,
    playerCharacterId: "char.player",
    chapterId: "chapter.test",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: "char.player",
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

function createDialoguePack() {
  return {
    schemaVersion: 1,
    id: "pack.dialogue-runtime",
    title: "Dialogue Runtime",
    characters: [{ id: "char.player", name: "Player" }],
    events: [
      {
        id: "event.dialogue.opening",
        chapterId: "chapter.test",
        name: "Opening",
        occurrence: "repeatable",
        trigger: { timing: "manual" },
        conditions: [],
        entrySceneId: "dialogue.opening",
        dialogueId: "dialogue.opening",
      },
    ],
    dialogues: [
      {
        id: "dialogue.opening",
        name: "Opening Dialogue",
        nodes: [
          {
            type: "dialogue",
            characterId: "char.player",
            side: "left",
            text: "Hello",
          },
          {
            type: "jump",
            nextDialogueId: "dialogue.followup",
          },
        ],
      },
      {
        id: "dialogue.followup",
        name: "Follow-up Dialogue",
        nodes: [
          {
            type: "narration",
            text: "Follow-up",
          },
        ],
      },
    ],
  };
}

test("scenario packs may provide dialogues without legacy scenes", () => {
  const pack = parseScenarioPack({
    ...createDialoguePack(),
    scenarioProfile: {
      id: "scenario.dialogue-runtime",
      playerCharacterId: "char.player",
      chapterId: "chapter.test",
      initialLocation: {
        mapId: "map.test",
        cityId: "city.test",
        houseId: null,
        view: "city",
      },
    },
  });

  assert.equal(pack.scenes, undefined);
  assert.equal(pack.dialogues.length, 2);
});

test("active content exposes dialogue definitions as compatible scene definitions", () => {
  const content = createActiveGameContent(createDialoguePack());

  assert.equal(content.dialogueDefinitionsById["dialogue.opening"].id, "dialogue.opening");
  assert.equal(content.sceneDefinitionsById["dialogue.opening"].id, "dialogue.opening");
  assert.equal(
    content.sceneDefinitionsById["dialogue.opening"].actions[1].nextSceneId,
    "dialogue.followup"
  );
});

test("dialogue runtime runs dialogue definitions through the current scene carrier", () => {
  const content = createActiveGameContent(createDialoguePack());
  const eventDefinition = content.eventDefinitionsById["event.dialogue.opening"];
  const startedState = startEvent(createBaseState(), eventDefinition);

  const result = runDialogueFromEvent({
    state: startedState,
    characterDefinitions: content.characters,
    dialogueDefinitionsById: content.dialogueDefinitionsById,
    eventDefinitionsById: content.eventDefinitionsById,
  });

  assert.equal(result.state.scene.activeEventId, "event.dialogue.opening");
  assert.equal(result.state.scene.activeSceneId, "dialogue.opening");
  assert.equal(result.state.scene.status, "playing");
  assert.equal(result.session.dialogueId, "dialogue.opening");
  assert.equal(result.session.eventId, "event.dialogue.opening");
});
