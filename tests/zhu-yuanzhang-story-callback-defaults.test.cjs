const assert = require("node:assert/strict");
const test = require("node:test");

const {
  resolveJoinGuoZixingCampStoryCallbackSeed,
  resolveSundeyaRescueBattleStoryCallbackSeed,
} = require("../.test-dist/application/story/zhu-yuanzhang-story-callback-defaults.js");
const {
  ZHU_YUANZHANG_STORY_STAGES,
} = require("../.test-dist/domain/zhu-yuanzhang-story.js");

test("join guo zixing camp callback seed centralizes campaign transition defaults", () => {
  assert.deepEqual(resolveJoinGuoZixingCampStoryCallbackSeed(), {
    reviewCountdownDays: 60,
    stage: ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp,
    missionTextId: "runtime.zhu_yuanzhang.main_mission.guo_zixing_keep",
    titleTextId: "runtime.zhu_yuanzhang.player.title.guo_zixing_camp",
    occupationTextId:
      "runtime.zhu_yuanzhang.player.occupation.guo_zixing_camp",
    affiliationTextId:
      "runtime.zhu_yuanzhang.player.affiliation.guo_zixing_camp",
    biographyTextId:
      "runtime.zhu_yuanzhang.player.biography.guo_zixing_camp",
    clanId: "clan.guo",
    houseId: "house.kulan.keep",
  });
});

test("sundeya rescue battle callback seed centralizes post-battle routing defaults", () => {
  assert.deepEqual(resolveSundeyaRescueBattleStoryCallbackSeed(), {
    enterHouseId: "house.kulan.keep",
    mainMissionTextId:
      "runtime.zhu_yuanzhang.main_mission.sundeya_battle_review",
  });
});
