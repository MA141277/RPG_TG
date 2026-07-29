const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createActiveGameContentContext,
} = require("../.test-dist/application/content/active-game-content.js");

test("active game content context exposes richer story runtime families", () => {
  const content = createActiveGameContentContext({
    schemaVersion: 1,
    id: "pack.test",
    title: "Test Pack",
    textEntries: {
      "text.test": "hello",
    },
    cities: [
      {
        id: "city.test",
        name: "Test City",
        regionId: "region.test",
        mapNodeId: "settlement.test",
        houseIds: ["house.test"],
        neighbourCityIds: [],
        travelCost: 1,
        tags: ["market"],
        prosperity: 10,
        danger: 5,
        specialDemand: ["grain"],
      },
    ],
    houses: [
      {
        id: "house.test",
        cityId: "city.test",
        name: "Test House",
        type: "custom",
        characterIds: [],
        defaultCharacterId: null,
        moduleId: "keep-house",
        backAction: {
          label: "Back",
          targetView: "city",
        },
      },
    ],
    events: [
      {
        id: "event.test",
        chapterId: "chapter.test",
        name: "Test Event",
        occurrence: "repeatable",
        trigger: { timing: "manual" },
        conditions: [],
        entrySceneId: "scene.test",
      },
    ],
    scenes: [
      {
        id: "scene.test",
        name: "Test Scene",
        actions: [],
      },
    ],
    dialogues: [
      {
        id: "dialogue.test",
        name: "Test Dialogue",
        nodes: [],
      },
    ],
    eventBindings: [
      {
        id: "binding.test",
        eventId: "event.test",
        owner: { family: "story", id: "chapter.test" },
        trigger: { timing: "after", action: "indoor-screen-shown" },
      },
    ],
    settlements: [
      {
        id: "settlement.test",
        title: "Test Settlement",
        contents: [],
      },
    ],
    progressTracks: [
      {
        id: "track.test",
        title: "Track",
        metricKey: "prosperity",
        metricLabel: "Prosperity",
        hostFamily: "city",
        tiers: [],
      },
    ],
    progressTrackBindings: [
      {
        id: "binding.track.test",
        trackId: "track.test",
        host: { family: "city", id: "city.test" },
      },
    ],
    activities: [],
    tasks: [],
    cards: [],
    valuables: [],
    characters: [],
  });

  assert.equal(content.storyContent.eventBindingsById["binding.test"]?.eventId, "event.test");
  assert.equal(content.storyContent.settlementDefinitionsById["settlement.test"]?.title, "Test Settlement");
  assert.equal(content.storyContent.progressTrackDefinitionsById["track.test"]?.metricKey, "prosperity");
  assert.equal(content.storyContent.progressTrackBindingsById["binding.track.test"]?.trackId, "track.test");
  assert.equal(content.storyContent.cityDefinitionsById["city.test"]?.name, "Test City");
  assert.equal(content.storyContent.houseDefinitionsById["house.test"]?.name, "Test House");
});
