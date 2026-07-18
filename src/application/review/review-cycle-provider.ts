import type { GameState } from "../../domain/game-state";
import {
  getCouncilPriorityHouseModuleId,
  getInsufficientDaysForTimedActivity,
  hasReachedCouncilDate,
} from "../time/council-priority";
import type { HouseModuleId } from "../../domain/house-module";
import {
  applyReviewCycleSchedule,
  getReviewCycleCountdown,
  getReviewCycleStatusText,
  syncReviewCycleCompatibilityMirrors,
  type ReviewCycleScheduleInput,
} from "./review-cycle";

export type ReviewCyclePolicy = {
  getCountdown(state: GameState): number;
  getStatusText(state: GameState): string;
  hasReachedReviewDate(state: GameState): boolean;
  getInsufficientDaysForTimedActivity(
    state: GameState,
    durationDays: number
  ): number | null;
  getPriorityHouseModuleId(
    state: GameState
  ): Extract<HouseModuleId, "keep-house" | "temple-house">;
  syncCompatibilityMirrors(
    state: GameState,
    input?: Omit<ReviewCycleScheduleInput, "scheduledDate">
  ): GameState;
  applySchedule(state: GameState, input: ReviewCycleScheduleInput): GameState;
};

export function createReviewCyclePolicy(): ReviewCyclePolicy {
  return {
    getCountdown: getReviewCycleCountdown,
    getStatusText: getReviewCycleStatusText,
    hasReachedReviewDate: hasReachedCouncilDate,
    getInsufficientDaysForTimedActivity,
    getPriorityHouseModuleId: getCouncilPriorityHouseModuleId,
    syncCompatibilityMirrors: syncReviewCycleCompatibilityMirrors,
    applySchedule: applyReviewCycleSchedule,
  };
}

export const defaultReviewCyclePolicy = createReviewCyclePolicy();
