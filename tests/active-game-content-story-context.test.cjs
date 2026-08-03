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

test("active game content context treats playableShells as the canonical flow shell owner", () => {
  const content = createActiveGameContentContext({
    schemaVersion: 1,
    id: "pack.test.playable-shells",
    title: "Playable Shell Pack",
    textEntries: {},
    cities: [],
    houses: [],
    events: [],
    scenes: [],
    dialogues: [],
    eventBindings: [],
    settlements: [],
    progressTracks: [],
    progressTrackBindings: [],
    activities: [],
    tasks: [],
    cards: [],
    valuables: [],
    characters: [],
    playableShells: [
      {
        id: "flow.test.shell",
        title: "Flow Test Shell",
        initialNodeId: "node.start",
        nodes: [
          {
            id: "node.start",
            type: "text",
            text: "start",
            nextNodeId: "node.complete",
          },
          {
            id: "node.complete",
            type: "complete",
            outcome: "success",
          },
        ],
      },
    ],
  });

  assert.equal(content.gameContent.playableShells[0]?.id, "flow.test.shell");
  assert.equal(
    content.gameContent.playableShellsById["flow.test.shell"]?.title,
    "Flow Test Shell"
  );
  assert.equal(
    content.storyContent.playableShellsById["flow.test.shell"]?.title,
    "Flow Test Shell"
  );
  assert.equal(Object.hasOwn(content.gameContent, "flowPlayables"), false);
  assert.equal(Object.hasOwn(content.gameContent, "flowPlayablesById"), false);
  assert.equal(Object.hasOwn(content.storyContent, "flowPlayablesById"), false);
});

test("active game content context preserves runtime building support families for later mod execution", () => {
  const content = createActiveGameContentContext({
    schemaVersion: 1,
    id: "pack.test.runtime-building-support",
    title: "Runtime Building Support Pack",
    textEntries: {},
    cities: [],
    houses: [],
    events: [],
    scenes: [],
    dialogues: [],
    eventBindings: [],
    settlements: [],
    progressTracks: [],
    progressTrackBindings: [],
    activities: [],
    tasks: [],
    cards: [],
    valuables: [],
    characters: [],
    menuResources: [
      {
        id: "menu-resource.test.temple.primary",
        title: "寺庙菜单",
        entries: [],
      },
    ],
    menuInstances: [
      {
        id: "menu-instance.test.temple.primary",
        title: "寺庙菜单实例",
        resourceId: "menu-resource.test.temple.primary",
      },
    ],
    locationAccess: [
      {
        id: "location-access.test.temple",
        targetFamily: "building",
        targetId: "house.test.temple",
        purpose: "enter",
        blockedMessage: "闲人止步",
        conditions: [],
      },
    ],
    houseModuleDefaults: {
      "temple-house": {
        reviewEntryEventId: "event.building.template.house.temple.review",
      },
    },
  });

  assert.equal(
    content.gameContent.menuResourcesById["menu-resource.test.temple.primary"]?.title,
    "寺庙菜单"
  );
  assert.equal(
    content.gameContent.menuInstancesById["menu-instance.test.temple.primary"]?.resourceId,
    "menu-resource.test.temple.primary"
  );
  assert.equal(content.gameContent.locationAccess[0]?.targetId, "house.test.temple");
  assert.equal(
    content.gameContent.houseModuleDefaults?.["temple-house"]?.reviewEntryEventId,
    "event.building.template.house.temple.review"
  );
});
