const assert = require("node:assert/strict");
const test = require("node:test");

const {
  resolvePrototypeStartupSeed,
} = require("../.test-dist/application/startup/prototype-startup-defaults.js");
const {
  ZHU_YUANZHANG_STORY_STAGES,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

test("prototype startup seed resolves monk-opening defaults for the default player character", () => {
  assert.deepEqual(
    resolvePrototypeStartupSeed({
      playerCharacterId: "char.player",
      defaultPlayerCharacterId: "char.player",
      defaultMapId: "map.yuanmo_campaign",
      defaultCityId: "city.kulan",
    }),
    {
      currentMapId: "map.yuanmo_campaign",
      currentCityId: "city.kulan",
      currentHouseId: null,
      chapterId: "chapter.prototype",
      calendar: {
        year: 1567,
        month: 1,
        day: 1,
      },
      currentView: "map",
      reviewCountdownDaysForUi: 0,
      runtimeReviewCountdown: 0,
      missionTextId:
        "runtime.zhu_yuanzhang.prototype.main_mission.temple_review",
      storyStage: ZHU_YUANZHANG_STORY_STAGES.huangjueTemple,
    }
  );
});

test("prototype startup seed resolves guo-zixing-camp defaults for non-default selectable characters", () => {
  assert.deepEqual(
    resolvePrototypeStartupSeed({
      playerCharacterId: "char.kulan_xu_da",
      defaultPlayerCharacterId: "char.player",
      defaultMapId: "map.yuanmo_campaign",
      defaultCityId: "city.kulan",
    }),
    {
      currentMapId: "map.yuanmo_campaign",
      currentCityId: "city.kulan",
      currentHouseId: null,
      chapterId: "chapter.prototype",
      calendar: {
        year: 1567,
        month: 1,
        day: 1,
      },
      currentView: "map",
      reviewCountdownDaysForUi: 40,
      runtimeReviewCountdown: 0,
      missionTextId:
        "runtime.zhu_yuanzhang.prototype.main_mission.review_hall",
      storyStage: ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp,
    }
  );
});
