import type { GameState } from "../../domain/game-state";
import { hasReachedCouncilDate } from "./council-priority";
import { readCalendarDateNumber } from "./time-progression";

export const COUNCIL_ATTENDANCE_RUNTIME_KEYS = {
  lastLatePenaltyCouncilDateNumber: "var.council.last_late_penalty_council_date_number",
} as const;

export const COUNCIL_LATE_GRACE_DAYS = 5;
export const COUNCIL_LATE_MINOR_CONTRIBUTION_PENALTY = 5;
export const COUNCIL_LATE_MAJOR_CONTRIBUTION_PENALTY = 12;
export const COUNCIL_LATE_MAJOR_EXPULSION_CHANCE = 0.35;

export type CouncilLateAttendanceResolution = {
  lateDays: number;
  severity: "minor" | "major";
  contributionPenalty: number;
  expelled: boolean;
};

function readNumericVariable(state: GameState, key: string, fallback: number): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function getCouncilLateDays(state: GameState): number {
  if (!hasReachedCouncilDate(state)) {
    return 0;
  }

  return Math.max(
    0,
    readCalendarDateNumber(state.calendar) -
      readCalendarDateNumber(state.world.schedule.councilDate)
  );
}

export function hasPendingLateCouncilAttendancePenalty(state: GameState): boolean {
  const lateDays = getCouncilLateDays(state);
  if (lateDays <= 0) {
    return false;
  }

  return (
    readNumericVariable(
      state,
      COUNCIL_ATTENDANCE_RUNTIME_KEYS.lastLatePenaltyCouncilDateNumber,
      -1
    ) !== readCalendarDateNumber(state.world.schedule.councilDate)
  );
}

export function resolveLateCouncilAttendance(
  state: GameState,
  randomValue = Math.random()
): CouncilLateAttendanceResolution | null {
  if (!hasPendingLateCouncilAttendancePenalty(state)) {
    return null;
  }

  const lateDays = getCouncilLateDays(state);
  const majorLate = lateDays > COUNCIL_LATE_GRACE_DAYS;

  return {
    lateDays,
    severity: majorLate ? "major" : "minor",
    contributionPenalty: majorLate
      ? COUNCIL_LATE_MAJOR_CONTRIBUTION_PENALTY
      : COUNCIL_LATE_MINOR_CONTRIBUTION_PENALTY,
    expelled: majorLate && randomValue < COUNCIL_LATE_MAJOR_EXPULSION_CHANCE,
  };
}

export function markLateCouncilAttendancePenaltyProcessed(state: GameState): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [COUNCIL_ATTENDANCE_RUNTIME_KEYS.lastLatePenaltyCouncilDateNumber]:
          readCalendarDateNumber(state.world.schedule.councilDate),
      },
    },
  };
}
