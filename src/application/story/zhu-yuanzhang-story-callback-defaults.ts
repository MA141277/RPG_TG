import {
  ZHU_YUANZHANG_STORY_STAGES,
  type ZhuYuanzhangStoryStage,
} from "../../domain/zhu-yuanzhang-story";

export type JoinGuoZixingCampStoryCallbackSeed = {
  reviewCountdownDays: number;
  stage: ZhuYuanzhangStoryStage;
  missionTextId: string;
  titleTextId: string;
  occupationTextId: string;
  affiliationTextId: string;
  biographyTextId: string;
  clanId: string;
  houseId: string;
};

export type SundeyaRescueBattleStoryCallbackSeed = {
  enterHouseId: string;
  mainMissionTextId: string;
};

export function resolveJoinGuoZixingCampStoryCallbackSeed(): JoinGuoZixingCampStoryCallbackSeed {
  return {
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
  };
}

export function resolveSundeyaRescueBattleStoryCallbackSeed(): SundeyaRescueBattleStoryCallbackSeed {
  return {
    enterHouseId: "house.kulan.keep",
    mainMissionTextId:
      "runtime.zhu_yuanzhang.main_mission.sundeya_battle_review",
  };
}
