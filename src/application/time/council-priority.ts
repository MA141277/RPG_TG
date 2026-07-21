import type { GameState } from "../../domain/game-state";
import type { HouseDefinition } from "../../domain/house";
import {
  isZhuYuanzhangMonkStoryStage,
} from "../../domain/zhu-yuanzhang-story";
import { readCalendarDateNumber } from "./time-progression";

export type CouncilPriorityBuildingKind = "keep-house" | "temple-house";

export function hasReachedCouncilDate(state: GameState): boolean {
  return (
    readCalendarDateNumber(state.calendar) >=
    readCalendarDateNumber(state.world.schedule.councilDate)
  );
}

export function getRemainingDaysUntilCouncilDate(state: GameState): number {
  return Math.max(
    0,
    readCalendarDateNumber(state.world.schedule.councilDate) -
      readCalendarDateNumber(state.calendar)
  );
}

export function getInsufficientDaysForTimedActivity(
  state: GameState,
  durationDays: number
): number | null {
  const normalizedDurationDays = Math.max(1, Math.floor(durationDays));
  const remainingDays = getRemainingDaysUntilCouncilDate(state);
  if (remainingDays >= normalizedDurationDays) {
    return null;
  }

  return remainingDays;
}

export function getCouncilPriorityHouseModuleId(
  state: GameState
): CouncilPriorityBuildingKind {
  return isZhuYuanzhangMonkStoryStage(state) ? "temple-house" : "keep-house";
}

export function isCouncilPriorityHouseDefinition(
  state: GameState,
  houseDefinition: HouseDefinition
): boolean {
  return houseDefinition.moduleId === getCouncilPriorityHouseModuleId(state);
}
