import type { AppState } from "../../app-shell";
import type { InteractiveRuntimeHandoff } from "../../../core/contracts/interactive-runtime";
import { ZHU_YUANZHANG_STORY_FLAG_KEYS } from "../../../domain/zhu-yuanzhang-story";

/**
 * Created: 2026-07-31
 * Feature: Zhu Yuanzhang ordination scene house re-entry handoff.
 * Reason: story scene completion can currently leave the player on an already
 * mounted house view before the house runtime has re-entered the temple module.
 * Target owner: shared story-to-house lifecycle coordinator.
 * Remove when: scene completion follow-ups can request generic house re-entry
 * through the story/runtime contract without stage-specific transition checks.
 */

type StorySceneHouseFollowUpInput = {
  previousAppState: AppState;
  nextAppState: AppState;
};

const ORDINATION_EVENT_ID = "event.story.zhu_yuanzhang.ordination";
const TEMPLE_HOUSE_ID = "house.kulan.temple";

export function resolveStorySceneHouseFollowUp(
  input: StorySceneHouseFollowUpInput
): InteractiveRuntimeHandoff | null {
  const previousState = input.previousAppState.gameState;
  const nextState = input.nextAppState.gameState;

  if (previousState.scene.activeEventId !== ORDINATION_EVENT_ID) {
    return null;
  }

  if (nextState.scene.activeSceneId != null || nextState.scene.activeEventId != null) {
    return null;
  }

  if (
    nextState.ui.currentView !== "house" ||
    nextState.world.currentHouseId !== TEMPLE_HOUSE_ID
  ) {
    return null;
  }

  if (
    nextState.runtime.flags[ZHU_YUANZHANG_STORY_FLAG_KEYS.ordinationCompleted] !==
    true
  ) {
    return null;
  }

  if (
    nextState.runtime.flags[
      ZHU_YUANZHANG_STORY_FLAG_KEYS.firstTempleReviewCompleted
    ] === true
  ) {
    return null;
  }

  return {
    type: "reenter-house",
    houseId: TEMPLE_HOUSE_ID,
  };
}
