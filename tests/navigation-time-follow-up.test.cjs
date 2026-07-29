const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createNavigationTimeFollowUpBridge,
  resolveCouncilPriorityHouseDefinition,
} = require("../.test-dist/application/runtime/navigation-time-follow-up.js");
const {
  prototypeCharacters,
  prototypeCities,
  prototypeHouses,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");

const playerCharacterId = "char.player";
const targetCity = prototypeCities.find((city) => city.id === "city.kulan");
const targetHouse = prototypeHouses.find((house) => house.moduleId === "grain-shop");

assert.ok(targetCity, "Expected prototype city.kulan.");
assert.ok(targetHouse, "Expected prototype grain-shop house.");

function createBaseState(currentCityId = "city.kulan") {
  return createInitialState({
    currentMapId: prototypeMap.id,
    currentCityId,
    currentHouseId: null,
    playerCharacterId,
    chapterId: "chapter.prototype",
    year: 1567,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "test",
    mainHouseMissionText: "test",
    currentView: "city",
  });
}

function createRuntimeState(currentCityId = targetCity.id) {
  return {
    core: createBaseState(currentCityId),
    app: {
      beggingMiniGameState: null,
      autoAdvanceState: null,
      campaignTravelState: null,
      cityDirectoryState: null,
      cityMenuState: null,
      locationDialogueState: null,
      modalState: null,
    },
    view: {},
  };
}

function createEventBindingProgressionStoryContent() {
  return {
    eventDefinitionsById: {
      "event.test.binding": {
        id: "event.test.binding",
        chapterId: "chapter.prototype",
        name: "event.test.binding",
        occurrence: "once",
        trigger: { timing: "manual" },
        conditions: [],
        entrySceneId: "scene.test.binding",
        type: "settlement",
        settlementId: "settlement.test.binding",
      },
    },
    sceneDefinitionsById: {
      "scene.test.binding": {
        id: "scene.test.binding",
        name: "Binding Scene",
        actions: [],
      },
    },
    eventBindingsById: {
      "binding.event.test.binding": {
        id: "binding.event.test.binding",
        eventId: "event.test.binding",
        owner: {
          family: "city",
          id: targetCity.id,
        },
        trigger: {
          timing: "after",
          action: "city-enter",
        },
      },
    },
    settlementDefinitionsById: {
      "settlement.test.binding": {
        id: "settlement.test.binding",
        title: "Binding Settlement",
        contents: [
          {
            targetFamily: "city",
            targetId: targetCity.id,
            attributeKey: "prosperity",
            attributeType: "number",
            operation: "add",
            value: 5,
          },
        ],
      },
      "settlement.test.progress-tier": {
        id: "settlement.test.progress-tier",
        title: "Progress Tier Settlement",
        contents: [
          {
            targetFamily: "building",
            targetId: targetHouse.id,
            attributeKey: "outputMultiplier",
            attributeType: "number",
            operation: "set",
            value: 4,
          },
        ],
      },
    },
    progressTrackDefinitionsById: {
      "track.city.prosperity": {
        id: "track.city.prosperity",
        title: "City Prosperity",
        metricKey: "prosperity",
        metricLabel: "Prosperity",
        hostFamily: "city",
        allowDemotion: false,
        tiers: [
          {
            id: "tier.city.prosperity",
            title: "Prosperous",
            threshold: targetCity.prosperity + 5,
            targetTierSettlementId: "settlement.test.progress-tier",
          },
        ],
      },
    },
    progressTrackBindingsById: {
      "binding.track.city.prosperity": {
        id: "binding.track.city.prosperity",
        trackId: "track.city.prosperity",
        host: {
          family: "city",
          id: targetCity.id,
        },
      },
    },
    cityDefinitionsById: {
      [targetCity.id]: targetCity,
    },
    houseDefinitionsById: {
      [targetHouse.id]: targetHouse,
    },
    textEntriesById: {},
  };
}

test(
  "resolveCouncilPriorityHouseDefinition applies city-scoped arrangement speaker override to the canonical priority house",
  () => {
    const gameState = createBaseState("city.kulan");
    const houseDefinitions = [
      {
        id: "house.template.keep",
        cityId: "city.other",
        name: "Keep",
        type: "castle",
        characterIds: [],
        defaultCharacterId: "char.keep.default",
        moduleId: "keep-house",
        backAction: {
          label: "Back",
          targetView: "city",
        },
      },
    ];
    const buildingArrangements = [
      {
        id: "arrangement.kulan.keep",
        cityId: "city.kulan",
        buildingId: "house.kulan.keep",
        mountedNpcIds: ["char.keep.kulan"],
        primaryNpcId: "char.keep.kulan",
        containers: [],
      },
    ];

    const resolved = resolveCouncilPriorityHouseDefinition(
      gameState,
      houseDefinitions,
      buildingArrangements
    );

    assert.ok(resolved);
    assert.equal(resolved.id, "house.template.keep");
    assert.equal(resolved.cityId, "city.kulan");
    assert.equal(resolved.defaultCharacterId, "char.keep.kulan");
  }
);

test("createNavigationTimeFollowUpBridge routes city-enter through shared story-runtime bindings and projects world patches", () => {
  const bridge = createNavigationTimeFollowUpBridge({
    getCharacterDefinitions: () => prototypeCharacters,
    getHouseDefinitions: () => prototypeHouses,
    getStoryContent: () => createEventBindingProgressionStoryContent(),
    getAppState: () => ({
      gameState: createBaseState(targetCity.id),
      characterDefinitions: prototypeCharacters,
      playerCoordinate: { x: 0, y: 0 },
      campaignActorState: {
        facingDegrees: 0,
        isMoving: false,
      },
      campaignTravelState: null,
      modalState: null,
      locationDialogueState: null,
      beggingMiniGameState: null,
      cityMenuState: null,
      cityDirectoryState: null,
      autoAdvanceState: null,
      uiLayouts: {},
      layoutEditor: {},
    }),
  });

  const result = bridge.applyOutcome({
    state: createRuntimeState(targetCity.id),
    outcome: {
      type: "navigation.entered-city",
      cityId: targetCity.id,
    },
  });

  assert.equal(result.handled, true);
  assert.equal(
    result.state.core.runtime.eventHistory["event.test.binding"]?.firedCount,
    1
  );
  assert.equal(
    result.cityStatusById?.[targetCity.id]?.valuePatch?.prosperity,
    targetCity.prosperity + 5
  );
  assert.equal(
    result.buildingStatusById?.[targetHouse.id]?.runtimePatch?.outputMultiplier,
    4
  );
});

test("createNavigationTimeFollowUpBridge keeps council-threshold reminders unchanged with richer city-enter story content", () => {
  const bridge = createNavigationTimeFollowUpBridge({
    getCharacterDefinitions: () => prototypeCharacters,
    getHouseDefinitions: () => prototypeHouses,
    getStoryContent: () => createEventBindingProgressionStoryContent(),
  });

  const result = bridge.applyOutcome({
    state: {
      ...createRuntimeState(targetCity.id),
      core: createBaseState(targetCity.id),
    },
    outcome: {
      type: "time.council-threshold-crossed",
    },
  });

  assert.equal(result.handled, true);
  assert.equal(result.state.app.modalState, null);
  assert.equal(result.state.app.locationDialogueState?.type, "council-arrival-reminder");
  assert.equal(result.state.app.cityMenuState, null);
  assert.equal(result.state.app.cityDirectoryState, null);
  assert.equal(result.state.app.autoAdvanceState, null);
  assert.equal(result.state.app.campaignTravelState, null);
});
