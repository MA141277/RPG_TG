import type { GameState } from "./game-state";

export type ZhuYuanzhangStoryStage =
  | "huangjue-temple"
  | "guo-zixing-camp";

export const ZHU_YUANZHANG_STORY_STAGES = {
  huangjueTemple: "huangjue-temple",
  guoZixingCamp: "guo-zixing-camp",
} as const;

export const ZHU_YUANZHANG_STORY_VARIABLE_KEYS = {
  stage: "var.story.zhu_yuanzhang.stage",
  templeContribution: "var.story.zhu_yuanzhang.temple_contribution",
  templeWeek: "var.story.zhu_yuanzhang.temple_week",
} as const;

export const ZHU_YUANZHANG_STORY_FLAG_KEYS = {
  ordinationCompleted: "flag.story.zhu_yuanzhang.ordination.completed",
  firstTempleReviewCompleted:
    "flag.story.zhu_yuanzhang.first_temple_review.completed",
  firstTempleWorkLockCompleted:
    "flag.story.zhu_yuanzhang.first_temple_work_lock.completed",
  templeWorkUnlocked: "flag.story.zhu_yuanzhang.temple_work_unlocked",
  beggingUnlocked: "flag.story.zhu_yuanzhang.begging_unlocked",
} as const;

export function isZhuYuanzhangStoryStage(
  value: string
): value is ZhuYuanzhangStoryStage {
  return (
    value === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple ||
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
