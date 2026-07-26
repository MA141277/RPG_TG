const assert = require("node:assert/strict");
const test = require("node:test");

const {
  runDialogueUntilPause,
} = require("../.test-dist/application/dialogue/dialogue-runner.js");
const {
  startEvent,
} = require("../.test-dist/application/events/event-runner.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  chooseStoryDialogueOption,
  startStoryEventById,
} = require("../.test-dist/application/story/story-runtime.js");
const {
  prototypeCharacters,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");

const PLAYER_CHARACTER_ID = "char.player";

function createBaseState() {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId: "city.kulan",
    currentHouseId: null,
    playerCharacterId: PLAYER_CHARACTER_ID,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: PLAYER_CHARACTER_ID,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

function createBaseHero() {
  const hero = prototypeCharacters.find(
    (character) => character.id === PLAYER_CHARACTER_ID
  );
  assert.ok(hero, "Expected prototype player character to exist.");
  return hero;
}

test(
  "dialogue runner fails closed when automatic nextEvent continuation revisits an already continued event",
  () => {
    const eventDefinitionsById = {
      "event.loop.a": {
        id: "event.loop.a",
        chapterId: "chapter.prototype",
        name: "Loop A",
        occurrence: "repeatable",
        dialogueId: "",
        nextEventId: "event.loop.b",
      },
      "event.loop.b": {
        id: "event.loop.b",
        chapterId: "chapter.prototype",
        name: "Loop B",
        occurrence: "repeatable",
        dialogueId: "",
        nextEventId: "event.loop.a",
      },
    };

    const result = runDialogueUntilPause(
      startEvent(createBaseState(), eventDefinitionsById["event.loop.a"]),
      {
        dialogueDefinitionsById: {},
        eventDefinitionsById,
        characterDefinitions: prototypeCharacters,
      }
    );

    assert.equal(result.state.dialogue.activeEventId, null);
    assert.equal(result.state.dialogue.activeDialogueId, null);
    assert.equal(result.state.dialogue.status, "idle");
    assert.equal(result.currentNode, null);
    assert.equal(
      result.state.runtime.eventHistory["event.loop.a"]?.firedCount,
      1
    );
    assert.equal(
      result.state.runtime.eventHistory["event.loop.b"]?.firedCount,
      1
    );
  }
);

test(
  "story runtime settlement continuation fails closed when settlement nextEvent routing loops back to an already applied event",
  () => {
    const hero = {
      ...createBaseHero(),
      stamina: 100,
    };

    const result = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: [hero],
      },
      {
        eventDefinitionsById: {
          "event.settlement.a": {
            id: "event.settlement.a",
            chapterId: "chapter.prototype",
            name: "Settlement A",
            occurrence: "repeatable",
            type: "settlement",
            dialogueId: "",
            settlementId: "settlement.loop.a",
          },
          "event.settlement.b": {
            id: "event.settlement.b",
            chapterId: "chapter.prototype",
            name: "Settlement B",
            occurrence: "repeatable",
            type: "settlement",
            dialogueId: "",
            settlementId: "settlement.loop.b",
          },
        },
        settlementDefinitionsById: {
          "settlement.loop.a": {
            id: "settlement.loop.a",
            title: "Settlement Loop A",
            nextEventId: "event.settlement.b",
            contents: [
              {
                targetFamily: "person",
                targetId: PLAYER_CHARACTER_ID,
                attributeKey: "stamina",
                attributeType: "number",
                operation: "add",
                value: 5,
              },
            ],
          },
          "settlement.loop.b": {
            id: "settlement.loop.b",
            title: "Settlement Loop B",
            nextEventId: "event.settlement.a",
            contents: [
              {
                targetFamily: "person",
                targetId: PLAYER_CHARACTER_ID,
                attributeKey: "stamina",
                attributeType: "number",
                operation: "add",
                value: 7,
              },
            ],
          },
        },
        dialogueDefinitionsById: {},
      },
      "event.settlement.a"
    );

    assert.equal(result.characterDefinitions[0].stamina, 112);
    assert.equal(
      result.state.runtime.eventHistory["event.settlement.a"]?.firedCount,
      1
    );
    assert.equal(
      result.state.runtime.eventHistory["event.settlement.b"]?.firedCount,
      1
    );
    assert.equal(result.state.dialogue.activeEventId, null);
    assert.equal(result.state.dialogue.activeDialogueId, null);
    assert.equal(result.state.dialogue.status, "idle");
  }
);

test(
  "story dialogue choice nextEvent fails closed when the selected option points back to the active event",
  () => {
    const runtime = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: prototypeCharacters,
      },
      {
        eventDefinitionsById: {
          "event.choice.loop": {
            id: "event.choice.loop",
            chapterId: "chapter.prototype",
            name: "Choice Loop",
            occurrence: "repeatable",
            dialogueId: "dialogue.choice.loop",
          },
        },
        dialogueDefinitionsById: {
          "dialogue.choice.loop": {
            id: "dialogue.choice.loop",
            name: "Choice Loop Dialogue",
            nodes: [
              {
                type: "choice",
                options: [
                  {
                    id: "option.loop",
                    label: "Loop",
                    nextEventId: "event.choice.loop",
                  },
                ],
              },
            ],
          },
        },
      },
      "event.choice.loop"
    );

    assert.equal(runtime.state.dialogue.status, "waiting-choice");

    const continued = chooseStoryDialogueOption(
      runtime,
      {
        eventDefinitionsById: {
          "event.choice.loop": {
            id: "event.choice.loop",
            chapterId: "chapter.prototype",
            name: "Choice Loop",
            occurrence: "repeatable",
            dialogueId: "dialogue.choice.loop",
          },
        },
        dialogueDefinitionsById: {
          "dialogue.choice.loop": {
            id: "dialogue.choice.loop",
            name: "Choice Loop Dialogue",
            nodes: [
              {
                type: "choice",
                options: [
                  {
                    id: "option.loop",
                    label: "Loop",
                    nextEventId: "event.choice.loop",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        id: "option.loop",
        label: "Loop",
        nextEventId: "event.choice.loop",
      }
    );

    assert.equal(continued.state.dialogue.activeEventId, null);
    assert.equal(continued.state.dialogue.activeDialogueId, null);
    assert.equal(continued.state.dialogue.status, "idle");
    assert.equal(
      continued.state.runtime.eventHistory["event.choice.loop"]?.firedCount,
      1
    );
  }
);

test(
  "story dialogue choice nextEvent still starts the selected follow-up event through the shared continuation seam",
  () => {
    const content = {
      eventDefinitionsById: {
        "event.choice.start": {
          id: "event.choice.start",
          chapterId: "chapter.prototype",
          name: "Choice Start",
          occurrence: "repeatable",
          dialogueId: "dialogue.choice.start",
        },
        "event.choice.followup": {
          id: "event.choice.followup",
          chapterId: "chapter.prototype",
          name: "Choice Follow-up",
          occurrence: "repeatable",
          dialogueId: "",
        },
      },
      dialogueDefinitionsById: {
        "dialogue.choice.start": {
          id: "dialogue.choice.start",
          name: "Choice Start Dialogue",
          nodes: [
            {
              type: "choice",
              options: [
                {
                  id: "option.followup",
                  label: "Follow-up",
                  nextEventId: "event.choice.followup",
                },
              ],
            },
          ],
        },
      },
    };
    const runtime = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: prototypeCharacters,
      },
      content,
      "event.choice.start"
    );

    const continued = chooseStoryDialogueOption(
      runtime,
      content,
      {
        id: "option.followup",
        label: "Follow-up",
        nextEventId: "event.choice.followup",
      }
    );

    assert.equal(
      continued.state.runtime.eventHistory["event.choice.start"]?.firedCount,
      1
    );
    assert.equal(
      continued.state.runtime.eventHistory["event.choice.followup"]?.firedCount,
      1
    );
    assert.equal(continued.state.dialogue.activeEventId, null);
    assert.equal(continued.state.dialogue.activeDialogueId, null);
    assert.equal(continued.state.dialogue.status, "idle");
  }
);
