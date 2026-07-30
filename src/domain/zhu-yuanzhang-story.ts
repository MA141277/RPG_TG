import type { GameState } from "./game-state";

export type ZhuYuanzhangStoryStage =
  | "huangjue-temple"
  | "huangjue-begging-journey"
  | "guo-zixing-camp";

export const ZHU_YUANZHANG_STORY_STAGES = {
  huangjueTemple: "huangjue-temple",
  huangjueBeggingJourney: "huangjue-begging-journey",
  guoZixingCamp: "guo-zixing-camp",
} as const;

export const ZHU_YUANZHANG_STORY_VARIABLE_KEYS = {
  stage: "var.story.zhu_yuanzhang.stage",
  templeContribution: "var.story.zhu_yuanzhang.temple_contribution",
  templeWeek: "var.story.zhu_yuanzhang.temple_week",
  lastBattleId: "var.story.zhu_yuanzhang.last_battle_id",
  lastBattleResult: "var.story.zhu_yuanzhang.last_battle_result",
} as const;

export const ZHU_YUANZHANG_STORY_FLAG_KEYS = {
  ordinationCompleted: "flag.story.zhu_yuanzhang.ordination.completed",
  firstTempleReviewCompleted:
    "flag.story.zhu_yuanzhang.first_temple_review.completed",
  firstTempleWorkLockCompleted:
    "flag.story.zhu_yuanzhang.first_temple_work_lock.completed",
  templeWorkUnlocked: "flag.story.zhu_yuanzhang.temple_work_unlocked",
  beggingUnlocked: "flag.story.zhu_yuanzhang.begging_unlocked",
  beggingTransitionAssigned:
    "flag.story.zhu_yuanzhang.begging_transition_assigned",
  haozhouUprisingBroadcasted:
    "flag.story.zhu_yuanzhang.haozhou_uprising_broadcasted",
  banditBattleCompleted: "flag.story.zhu_yuanzhang.bandit_battle.completed",
  banditBattleWon: "flag.story.zhu_yuanzhang.bandit_battle.won",
  sundeyaRescueBattleCompleted:
    "flag.story.zhu_yuanzhang.sundeya_rescue_battle.completed",
  sundeyaRescueBattleWon:
    "flag.story.zhu_yuanzhang.sundeya_rescue_battle.won",
} as const;

export function isZhuYuanzhangStoryStage(
  value: string
): value is ZhuYuanzhangStoryStage {
  return (
    value === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple ||
    value === ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney ||
    value === ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp
  );
}

export function readZhuYuanzhangStoryStage(
  state: GameState
): ZhuYuanzhangStoryStage {
  const value = state.runtime.variables[ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage];
  return typeof value === "string" && isZhuYuanzhangStoryStage(value)
    ? value
    : ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp;
}

export function isZhuYuanzhangMonkStoryStage(state: GameState): boolean {
  const storyStage = readZhuYuanzhangStoryStage(state);
  return (
    storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple ||
    storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
  );
}

export function isZhuYuanzhangBeggingJourneyStage(
  state: GameState
): boolean {
  return (
    readZhuYuanzhangStoryStage(state) ===
    ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney
  );
}

export function isHaozhouShortageDuringBeggingJourney(
  state: GameState
): boolean {
  return (
    isZhuYuanzhangBeggingJourneyStage(state) &&
    state.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.haozhouUprisingBroadcasted] ===
      true &&
    state.world.currentCityId === "city.kulan"
  );
}
