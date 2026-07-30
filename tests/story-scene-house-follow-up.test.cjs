const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  resolveStorySceneHouseFollowUp,
} = require("../.test-dist/application/runtime/transition/story-scene-house-follow-up.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

const playerCharacterId = "char.player";

function createBaseGameState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId,
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "",
    mainHouseMissionText: "",
    currentView: "house",
  });
}

function createAppState(gameState) {
  return {
    gameState,
    characterDefinitions: [],
    playerCoordinate: { x: 0, y: 0 },
    campaignActorState: {
      facingDegrees: 0,
      isMoving: false,
    },
    campaignTravelState: null,
    modalState: null,
    locationDialogueState: null,
    beggingMiniGameState: null,
    cityCardDrawTestState: null,
    cityMenuState: null,
    cityDirectoryState: null,
    autoAdvanceState: null,
    uiLayouts: {},
    layoutEditor: {},
  };
}

test("ordination scene close reenters temple to start first review", () => {
  const baseState = createBaseGameState();
  const previousAppState = createAppState({
    ...baseState,
    scene: {
      ...baseState.scene,
      activeEventId: "event.story.zhu_yuanzhang.ordination",
      activeSceneId: "scene.story.zhu_yuanzhang.ordination",
      status: "playing",
      returnView: "house",
    },
    ui: {
      ...baseState.ui,
      currentView: "scene",
    },
  });
  const nextAppState = createAppState({
    ...baseState,
    scene: {
      ...baseState.scene,
      activeEventId: null,
      activeSceneId: null,
      status: "idle",
      returnView: null,
    },
    runtime: {
      ...baseState.runtime,
      flags: {
        ...baseState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: false,
      },
    },
    ui: {
      ...baseState.ui,
      currentView: "house",
    },
  });

  assert.deepEqual(
    resolveStorySceneHouseFollowUp({
      previousAppState,
      nextAppState,
    }),
    {
      type: "reenter-house",
      houseId: "house.kulan.temple",
    }
  );
});

test("village opening scene close does not request temple reentry", () => {
  const baseState = createBaseGameState();
  const previousAppState = createAppState({
    ...baseState,
    world: {
      ...baseState.world,
      currentCityId: "city.huangcun",
      currentHouseId: null,
    },
    scene: {
      ...baseState.scene,
      activeEventId: "event.story.zhu_yuanzhang.village_elder_letter",
      activeSceneId: "scene.story.zhu_yuanzhang.village_elder_letter",
      status: "playing",
      returnView: "map",
    },
    ui: {
      ...baseState.ui,
      currentView: "scene",
    },
  });
  const nextAppState = createAppState({
    ...baseState,
    world: {
      ...baseState.world,
      currentCityId: "city.huangcun",
      currentHouseId: null,
    },
    scene: {
      ...baseState.scene,
      activeEventId: null,
      activeSceneId: null,
      status: "idle",
      returnView: null,
    },
    ui: {
      ...baseState.ui,
      currentView: "map",
    },
  });

  assert.equal(
    resolveStorySceneHouseFollowUp({
      previousAppState,
      nextAppState,
    }),
    null
  );
});

test("ordination scene close does not reenter temple after first review already completed", () => {
  const baseState = createBaseGameState();
  const previousAppState = createAppState({
    ...baseState,
    scene: {
      ...baseState.scene,
      activeEventId: "event.story.zhu_yuanzhang.ordination",
      activeSceneId: "scene.story.zhu_yuanzhang.ordination",
      status: "playing",
      returnView: "house",
    },
    ui: {
      ...baseState.ui,
      currentView: "scene",
    },
  });
  const nextAppState = createAppState({
    ...baseState,
    scene: {
      ...baseState.scene,
      activeEventId: null,
      activeSceneId: null,
      status: "idle",
      returnView: null,
    },
    runtime: {
      ...baseState.runtime,
      flags: {
        ...baseState.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
      },
    },
    ui: {
      ...baseState.ui,
      currentView: "house",
    },
  });

  assert.equal(
    resolveStorySceneHouseFollowUp({
      previousAppState,
      nextAppState,
    }),
    null
  );
});

test("main story scene advance wires house reentry follow-up through the helper", () => {
  const source = fs.readFileSync("src/main.ts", "utf8");

  assert.match(source, /resolveStorySceneHouseFollowUp/);
  assert.match(source, /houseRuntime\.applyInteractiveFollowUp\(followUp\)/);
});
