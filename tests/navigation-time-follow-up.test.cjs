const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  createCouncilInsufficientTimeDialogue,
  createCouncilPriorityRefusalDialogue,
  createNavigationTimeFollowUpBridge,
  resolveCouncilPriorityHouseDefinition,
} = require("../.test-dist/application/runtime/navigation-time-follow-up.js");
const {
  prototypeCharacters,
  prototypeCities,
  prototypeHouses,
  prototypeMap,
} = require("../.test-dist/content/prototype-world.js");
const {
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

const playerCharacterId = "char.player";
const targetCity = prototypeCities.find((city) => city.id === "city.kulan");
const targetHouse = prototypeHouses.find((house) => house.moduleId === "grain-shop");

assert.ok(targetCity, "Expected prototype city.kulan.");
assert.ok(targetHouse, "Expected prototype grain-shop house.");

function createBaseState(
  currentCityId = "city.kulan",
  storyStage = ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp
) {
  const state = createInitialState({
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

  state.runtime.variables[ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage] = storyStage;
  return state;
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

test("createNavigationTimeFollowUpBridge ignores non-triggerable event records during city-enter follow-up", () => {
  const storyContent = createEventBindingProgressionStoryContent();
  const bridge = createNavigationTimeFollowUpBridge({
    getCharacterDefinitions: () => prototypeCharacters,
    getHouseDefinitions: () => prototypeHouses,
    getStoryContent: () => ({
      ...storyContent,
      eventDefinitionsById: {
        ...storyContent.eventDefinitionsById,
        "event.test.city-enter": {
          id: "event.test.city-enter",
          chapterId: "chapter.prototype",
          name: "event.test.city-enter",
          occurrence: "once",
          trigger: {
            timing: "city-enter",
            scope: {
              cityId: targetCity.id,
            },
          },
          conditions: [],
          entrySceneId: "scene.test.binding",
          type: "settlement",
          settlementId: "settlement.test.binding",
        },
        "event.test.binding-only": {
          id: "event.test.binding-only",
          chapterId: "chapter.prototype",
          name: "event.test.binding-only",
          occurrence: "once",
          conditions: [],
          entrySceneId: "scene.test.binding",
          type: "settlement",
          settlementId: "settlement.test.binding",
        },
        "event.test.missing": undefined,
      },
      eventBindingsById: {},
    }),
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
    result.state.core.runtime.eventHistory["event.test.city-enter"]?.firedCount,
    1
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

test("council priority refusal dialogue resolves temple defaults through the shared runtime helper", () => {
  const dialogue = createCouncilPriorityRefusalDialogue({
    gameState: createBaseState(
      "city.kulan",
      ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
    ),
    houseDefinitions: [
      {
        id: "house.template.temple",
        cityId: "city.other",
        name: "皇觉寺",
        type: "temple",
        characterIds: [],
        defaultCharacterId: "char.temple.default",
        moduleId: "temple-house",
        backAction: {
          label: "Back",
          targetView: "city",
        },
      },
    ],
    buildingArrangements: [
      {
        id: "arrangement.kulan.temple",
        cityId: "city.kulan",
        buildingId: "house.kulan.temple",
        mountedNpcIds: ["char.kulan_temple_abbot"],
        primaryNpcId: "char.kulan_temple_abbot",
        containers: [],
      },
    ],
    textEntriesById: {
      "runtime.zhu_yuanzhang.council_refusal.temple.001":
        "先去{targetHouseName}应下评定。",
      "runtime.zhu_yuanzhang.council_refusal.temple.002": "别在外面耽搁。",
    },
  });

  assert.deepEqual(dialogue, {
    type: "house-access-refusal",
    speakerCharacterId: "char.kulan_temple_abbot",
    textLines: ["先去皇觉寺应下评定。", "别在外面耽搁。"],
    advanceHintText: "前往皇觉寺",
  });
});

test("council insufficient-time dialogue resolves keep arrived copy through the shared runtime helper", () => {
  const dialogue = createCouncilInsufficientTimeDialogue({
    gameState: createBaseState("city.kulan"),
    houseDefinitions: [
      {
        id: "house.template.keep",
        cityId: "city.other",
        name: "帅府",
        type: "castle",
        characterIds: [],
        defaultCharacterId: "char.keep.default",
        moduleId: "keep-house",
        backAction: {
          label: "Back",
          targetView: "city",
        },
      },
    ],
    buildingArrangements: [
      {
        id: "arrangement.kulan.keep",
        cityId: "city.kulan",
        buildingId: "house.kulan.keep",
        mountedNpcIds: ["char.kulan_guard"],
        primaryNpcId: "char.kulan_guard",
        containers: [],
      },
    ],
    textEntriesById: {
      "runtime.zhu_yuanzhang.council_insufficient_time.keep.arrived.001":
        "{activityLabel}至少要{durationDays}天，眼下不能再拖。",
      "runtime.zhu_yuanzhang.council_insufficient_time.keep.arrived.002":
        "先去{targetHouseName}报到。",
    },
    activityLabel: "远行运粮",
    durationDays: 5,
    remainingDays: 0,
  });

  assert.deepEqual(dialogue, {
    type: "house-access-refusal",
    speakerCharacterId: "char.kulan_guard",
    textLines: ["远行运粮至少要5天，眼下不能再拖。", "先去帅府报到。"],
    advanceHintText: "知道了",
  });
});
