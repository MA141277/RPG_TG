import type { CalendarDate, GameState } from "../../domain/game-state";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../domain/keep-house";
import {
  addDaysToCalendarDate,
  formatCouncilStatusText,
  getCouncilDateDayOffset,
} from "../time/time-progression";

export type ReviewCycleScheduleInput = {
  scheduledDate: CalendarDate;
  missionText?: string | null;
};

type ReviewCycleReadableState = Pick<GameState, "calendar" | "world"> &
  Partial<Pick<GameState, "runtime">>;

function readLegacyReviewCountdown(state: ReviewCycleReadableState): number | null {
  const value = state.runtime?.variables?.[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown];
  return typeof value === "number" ? Math.max(0, value) : null;
}

function normalizeReviewCycleSchedule(state: GameState): GameState {
  const dayOffset = getReviewCycleDayOffset(state);
  const legacyCountdown = readLegacyReviewCountdown(state);
  if (dayOffset > 0 || legacyCountdown == null || legacyCountdown <= 0) {
    return state;
  }

  return {
    ...state,
    world: {
      ...state.world,
      schedule: {
        ...state.world.schedule,
        councilDate: addDaysToCalendarDate(state.calendar, legacyCountdown),
      },
    },
  };
}

export function getReviewCycleDayOffset(
  state: Pick<GameState, "calendar" | "world">
): number {
  return getCouncilDateDayOffset(state.calendar, state.world.schedule.councilDate);
}

export function getReviewCycleCountdown(
  state: ReviewCycleReadableState
): number {
  const dayOffset = getReviewCycleDayOffset(state);
  if (dayOffset > 0) {
    return dayOffset;
  }

  const legacyCountdown = readLegacyReviewCountdown(state);
  if (legacyCountdown != null && legacyCountdown > 0) {
    return legacyCountdown;
  }

  return Math.max(0, dayOffset);
}

export function getReviewCycleStatusText(
  state: ReviewCycleReadableState
): string {
  const countdown = getReviewCycleCountdown(state);
  if (countdown > 0) {
    return formatCouncilStatusText(countdown);
  }

  return formatCouncilStatusText(getReviewCycleDayOffset(state));
}

export function syncReviewCycleCompatibilityMirrors(
  state: GameState,
  input: Omit<ReviewCycleScheduleInput, "scheduledDate"> = {}
): GameState {
  const normalizedState = normalizeReviewCycleSchedule(state);
  return {
    ...normalizedState,
    ui: {
      ...normalizedState.ui,
      reviewDateText: getReviewCycleStatusText(normalizedState),
      ...(input.missionText === undefined
        ? {}
        : { mainHouseMissionText: input.missionText ?? "" }),
    },
    runtime: {
      ...normalizedState.runtime,
      variables: {
        ...normalizedState.runtime.variables,
        [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]:
          getReviewCycleCountdown(normalizedState),
      },
    },
  };
}

export function applyReviewCycleSchedule(
  state: GameState,
  input: ReviewCycleScheduleInput
): GameState {
  return syncReviewCycleCompatibilityMirrors(
    {
      ...state,
      world: {
        ...state.world,
        schedule: {
          ...state.world.schedule,
          councilDate: input.scheduledDate,
        },
      },
    },
    input.missionText === undefined ? {} : { missionText: input.missionText }
  );
}
