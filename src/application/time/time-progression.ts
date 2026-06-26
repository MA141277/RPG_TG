import type { CalendarDate, GameState, TimeOfDay } from "../../domain/game-state";
import { KEEP_HOUSE_VARIABLE_KEYS } from "../../domain/keep-house";

const TIME_OF_DAY_SEQUENCE: TimeOfDay[] = ["morning", "afternoon", "night"];

export function readCalendarDateNumber(date: CalendarDate): number {
  return date.year * 360 + (date.month - 1) * 30 + date.day;
}

export function getCouncilDateDayOffset(
  currentDate: CalendarDate,
  councilDate: CalendarDate
): number {
  return readCalendarDateNumber(councilDate) - readCalendarDateNumber(currentDate);
}

export function formatCouncilStatusText(dayOffset: number): string {
  if (dayOffset > 0) {
    return `距离评定 ${dayOffset} 天`;
  }

  if (dayOffset === 0) {
    return "今日评定";
  }

  return `评定逾期 ${Math.abs(dayOffset)} 天`;
}

export function getCouncilStatusText(
  state: Pick<GameState, "calendar" | "world">
): string {
  return formatCouncilStatusText(
    getCouncilDateDayOffset(state.calendar, state.world.schedule.councilDate)
  );
}

export function addDaysToCalendarDate(date: CalendarDate, days: number): CalendarDate {
  const currentDateNumber = readCalendarDateNumber(date);
  return createCalendarDateFromNumber(currentDateNumber + days);
}

export function advanceGameStateOneDay(state: GameState): GameState {
  const nextDate = addDaysToCalendarDate(state.calendar, 1);
  const nextReviewCountdownValue = state.runtime.variables[KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown];
  const nextReviewCountdown =
    typeof nextReviewCountdownValue === "number"
      ? Math.max(0, nextReviewCountdownValue - 1)
      : nextReviewCountdownValue;

  return {
    ...state,
    calendar: {
      ...state.calendar,
      year: nextDate.year,
      month: nextDate.month,
      day: nextDate.day,
    },
    world: {
      ...state.world,
      timeOfDay: "morning",
    },
    ui: {
      ...state.ui,
      reviewDateText: formatCouncilStatusText(
        getCouncilDateDayOffset(nextDate, state.world.schedule.councilDate)
      ),
    },
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        ...(typeof nextReviewCountdown === "number"
          ? { [KEEP_HOUSE_VARIABLE_KEYS.reviewCountdown]: nextReviewCountdown }
          : {}),
      },
    },
  };
}

export function advanceGameStateTimeSegments(
  state: GameState,
  segments = 1
): GameState {
  let nextState = state;

  for (let index = 0; index < Math.max(0, segments); index += 1) {
    if (nextState.world.timeOfDay === "night") {
      nextState = advanceGameStateOneDay(nextState);
      continue;
    }

    nextState = {
      ...nextState,
      world: {
        ...nextState.world,
        timeOfDay: getNextTimeOfDay(nextState.world.timeOfDay),
      },
    };
  }

  return nextState;
}

function createCalendarDateFromNumber(dateNumber: number): CalendarDate {
  const normalizedDateNumber = Math.max(1, dateNumber);
  const nextYear = Math.floor((normalizedDateNumber - 1) / 360);
  const dayOfYear = normalizedDateNumber - nextYear * 360;
  const nextMonth = Math.floor((dayOfYear - 1) / 30) + 1;
  const nextDay = ((dayOfYear - 1) % 30) + 1;

  return {
    year: nextYear,
    month: nextMonth,
    day: nextDay,
  };
}

function getNextTimeOfDay(timeOfDay: TimeOfDay): TimeOfDay {
  const currentIndex = TIME_OF_DAY_SEQUENCE.indexOf(timeOfDay);
  if (currentIndex < 0) {
    return "morning";
  }

  return TIME_OF_DAY_SEQUENCE[Math.min(currentIndex + 1, TIME_OF_DAY_SEQUENCE.length - 1)]!;
}
