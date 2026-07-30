const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const {
  createTempleReviewRestAutoAdvanceStatus,
} = require("../.test-dist/application/house-modules/temple-house/temple-rest-auto-advance-status.js");
const {
  createInitialState,
} = require("../.test-dist/application/state/create-initial-state.js");
const {
  KEEP_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/keep-house.js");
const {
  TEMPLE_HOUSE_VARIABLE_KEYS,
} = require("../.test-dist/domain/temple-house.js");
const {
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

const playerCharacterId = "char.player";

function createTempleState() {
  return createInitialState({
    currentMapId: "map.test",
    currentCityId: "city.kulan",
    currentHouseId: "house.kulan.temple",
    playerCharacterId,
    chapterId: "chapter.zhu-yuanzhang-rise",
    year: 1352,
    month: 1,
    day: 1,
    councilDate: {
      year: 1352,
      month: 1,
      day: 4,
    },
    pinnedCharacterId: playerCharacterId,
    reviewDateText: "",
    mainHouseMissionText: "",
    currentView: "house",
    cards: {
      unlockedCharacterIds: [],
      ownedCardIds: [],
      selectedCardId: null,
    },
  });
}

test("temple review rest status includes review text stamina and monk-stage lines", () => {
  const baseState = createTempleState();
  const gameState = {
    ...baseState,
    ui: {
      ...baseState.ui,
      mainHouseMissionText: "扫地",
    },
    runtime: {
      ...baseState.runtime,
      variables: {
        ...baseState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 3,
        [TEMPLE_HOUSE_VARIABLE_KEYS.currentWorkPlan]: "temple-help",
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 12,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]: 2,
      },
    },
  };
  const characterDefinitions = [
    {
      id: playerCharacterId,
      name: "朱重八",
      cityId: "city.kulan",
      houseId: "house.kulan.temple",
      stamina: 61,
      title: "行童",
      occupation: "僧众",
      stats: { gold: 0, fame: 0 },
    },
  ];

  const status = createTempleReviewRestAutoAdvanceStatus({
    gameState,
    characterDefinitions,
    playerCharacterId,
  });

  assert.equal(status.variant, "temple-review-rest");
  assert.equal(status.title, "休至评定日");
  assert.ok(status.lines.includes("当前：寺中静修"));
  assert.ok(status.lines.includes("评定：距离评定 3 天"));
  assert.ok(status.lines.includes("体力：61 / 100"));
  assert.ok(status.lines.includes("贡献：12 / 30"));
  assert.ok(status.lines.includes("周次：第 2 周"));
  assert.ok(status.lines.includes("差事：扫地"));
});

test("temple review rest action carries auto advance status panel but other rest actions do not", () => {
  const source = fs.readFileSync(
    "src/application/house-modules/temple-house/temple-house-house-module.ts",
    "utf8"
  );

  assert.match(source, /createTempleReviewRestAutoAdvanceStatus/);
  assert.match(
    source,
    /const statusPanel =\s*actionId === TEMPLE_REST_UNTIL_COUNCIL_ACTION_ID\s*\?\s*createTempleReviewRestAutoAdvanceStatus[\s\S]*:\s*null/
  );
});
