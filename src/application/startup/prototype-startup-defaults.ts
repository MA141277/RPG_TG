import type { CalendarDate, ViewName } from "../../domain/game-state";
import type { HouseId } from "../../domain/house";
import type { MapId } from "../../domain/map";
import type { CityId } from "../../domain/city";
import {
  ZHU_YUANZHANG_STORY_STAGES,
  type ZhuYuanzhangStoryStage,
} from "../../domain/zhu-yuanzhang-story";

export type PrototypeStartupSeed = {
  currentMapId: MapId;
  currentCityId: CityId;
  currentHouseId: HouseId | null;
  chapterId: string;
  calendar: CalendarDate;
  currentView: ViewName;
  reviewCountdownDaysForUi: number;
  runtimeReviewCountdown: number;
  missionTextId: string;
  storyStage: ZhuYuanzhangStoryStage;
};

export function resolvePrototypeStartupSeed(input: {
  playerCharacterId: string;
  defaultPlayerCharacterId: string;
  defaultMapId: MapId;
  defaultCityId: CityId;
}): PrototypeStartupSeed {
  const storyStage: ZhuYuanzhangStoryStage =
    input.playerCharacterId === input.defaultPlayerCharacterId
      ? ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
      : ZHU_YUANZHANG_STORY_STAGES.guoZixingCamp;

  return {
    currentMapId: input.defaultMapId,
    currentCityId: input.defaultCityId,
    currentHouseId: null,
    chapterId: "chapter.prototype",
    calendar: {
      year: 1567,
      month: 1,
      day: 1,
    },
    currentView: "map",
    reviewCountdownDaysForUi:
      storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple ? 0 : 40,
    runtimeReviewCountdown: 0,
    missionTextId:
      storyStage === ZHU_YUANZHANG_STORY_STAGES.huangjueTemple
        ? "runtime.zhu_yuanzhang.prototype.main_mission.temple_review"
        : "runtime.zhu_yuanzhang.prototype.main_mission.review_hall",
    storyStage,
  };
}
