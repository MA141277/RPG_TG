import type { GameState } from "../../domain/game-state";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../domain/keep-house";
import {
  ZHU_YUANZHANG_STORY_FLAG_KEYS,
  ZHU_YUANZHANG_STORY_STAGES,
  ZHU_YUANZHANG_STORY_VARIABLE_KEYS,
} from "../../domain/zhu-yuanzhang-story";
import { launchStoryBattlePlayable } from "../playables/story-battle/story-battle-definition";

export function createHaozhouReturnEncounterBattleState(input: {
  state: GameState;
  mainMissionText: string;
  textEntriesById?: Record<string, string> | undefined;
}): GameState {
  const preparedState: GameState = {
    ...input.state,
    world: {
      ...input.state.world,
      currentCityId: "city.kulan",
      currentHouseId: null,
    },
    ui: {
      ...input.state.ui,
      currentView: "battle",
      overlayView: null,
      houseSession: null,
      mainHouseMissionText: input.mainMissionText,
    },
    runtime: {
      ...input.state.runtime,
      flags: {
        ...input.state.runtime.flags,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.templeWorkUnlocked]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingUnlocked]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.beggingTransitionAssigned]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleCompleted]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.banditBattleWon]: true,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted]: false,
        [ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon]: false,
      },
      variables: {
        ...input.state.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: 0,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.stage]:
          ZHU_YUANZHANG_STORY_STAGES.huangjueBeggingJourney,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeWeek]: 4,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.templeContribution]: 30,
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId]:
          "story.zhu_yuanzhang.week4.roadside-bandits",
        [ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult]: "victory",
      },
    },
  };

  // launchStoryBattlePlayable creates the embedded demoScenarioId-backed battle session.
  return launchStoryBattlePlayable({
    state: preparedState,
    ownerId: "scene.story.zhu_yuanzhang.haozhou_return_encounter",
    completion: {
      completedFlagKey:
        ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleCompleted,
      winFlagKey: ZHU_YUANZHANG_STORY_FLAG_KEYS.sundeyaRescueBattleWon,
      battleIdVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleId,
      resultVariableKey: ZHU_YUANZHANG_STORY_VARIABLE_KEYS.lastBattleResult,
      enterHouseId: "house.kulan.keep",
      mainMissionText: input.mainMissionText,
    },
    textEntriesById: input.textEntriesById,
  });
}
