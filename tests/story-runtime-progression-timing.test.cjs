const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createActiveGameContentContext,
} = require("../.test-dist/application/content/active-game-content.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  startStoryEventById,
} = require("../.test-dist/application/story/story-runtime.js");
const {
  prototypeCharacters,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");

const PLAYER_CHARACTER_ID = "char.player";
const HOST_KEY = `person:${PLAYER_CHARACTER_ID}`;
const TRACK_ID = "track.cultivation";

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

function createCreatorFlowContent(hero) {
  return createActiveGameContentContext({
    schemaVersion: 1,
    id: "pack.progression.creator-flow",
    title: "Creator Flow Progression Pack",
    characters: [hero],
    events: [
      {
        id: "event.progression.narration",
        chapterId: "chapter.prototype",
        name: "Narration Before Settlement",
        occurrence: "once",
        dialogueId: "dialogue.progression.narration",
      },
      {
        id: "event.progression.training",
        chapterId: "chapter.prototype",
        name: "Training Settlement",
        occurrence: "once",
        type: "settlement",
        dialogueId: "",
        settlementId: "settlement.progression.training",
      },
    ],
    settlements: [
      {
        id: "settlement.progression.training",
        title: "Training Settlement",
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
      {
        id: "settlement.progression.tier.2",
        title: "Tier 2 Settlement",
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
    ],
    progressTracks: [
      {
        id: TRACK_ID,
        title: "Cultivation Track",
        metricKey: "stamina",
        metricLabel: "Cultivation",
        hostFamily: "person",
        allowDemotion: true,
        tiers: [
          {
            id: "tier.1",
            title: "Entry",
            threshold: 0,
          },
          {
            id: "tier.2",
            title: "Skilled",
            threshold: 100,
            targetTierSettlementId: "settlement.progression.tier.2",
          },
        ],
      },
    ],
    progressTrackBindings: [
      {
        id: "binding.player.cultivation",
        trackId: TRACK_ID,
        host: {
          family: "person",
          id: PLAYER_CHARACTER_ID,
        },
        enabled: true,
      },
    ],
    dialogues: [
      {
        id: "dialogue.progression.narration",
        nodes: [
          {
            id: "dialogue-node.progression.narration",
            type: "narration",
            text: "Progression should wait until settlement execution completes.",
          },
        ],
      },
    ],
  }).storyContent;
}

test(
  "story progression waits for a settlement event before running creator-authored target-tier settlement convergence",
  () => {
    const baseHero = prototypeCharacters.find(
      (character) => character.id === PLAYER_CHARACTER_ID
    );
    assert.ok(baseHero, "Expected prototype player character to exist.");

    const hero = {
      ...baseHero,
      stamina: 95,
    };
    const content = createCreatorFlowContent(hero);

    const narrationResult = startStoryEventById(
      {
        state: createBaseState(),
        characterDefinitions: [hero],
      },
      content,
      "event.progression.narration"
    );

    assert.equal(narrationResult.characterDefinitions[0].stamina, 95);
    assert.equal(narrationResult.state.runtime.progression, undefined);

    const settlementResult = startStoryEventById(
      narrationResult,
      content,
      "event.progression.training"
    );
    const trackState =
      settlementResult.state.runtime.progression?.trackStatesByHostKey?.[
        HOST_KEY
      ]?.[TRACK_ID] ?? null;

    assert.equal(settlementResult.characterDefinitions[0].stamina, 105);
    assert.equal(
      settlementResult.state.runtime.eventHistory["event.progression.training"]
        ?.firedCount,
      1
    );
    assert.equal(trackState?.currentTierId, "tier.2");
    assert.equal(
      trackState?.metricValue,
      100,
      "Expected tier evaluation to read the post-settlement metric before emitting tier settlement work."
    );
    assert.equal(
      trackState?.updatedAt,
      "1567-01-01T00:00:00.000Z",
      "Expected story progression timestamps to use the canonical ISO occurredAt format."
    );
  }
);
