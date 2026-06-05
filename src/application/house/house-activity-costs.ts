import { ACTIVITY_COMPLETION_STAMINA_COST } from "../player/player-stamina";

export const HOUSE_ACTIVITY_DAYS_PER_MINIGAME_LEVEL = 10;
export const HOUSE_ACTIVITY_WORK_DURATION_DAYS = 3;
export const HOUSE_ACTIVITY_SEGMENTS_PER_DAY = 3;

export function normalizeHouseActivityLevel(level: number): number {
  return Math.max(1, Math.floor(level));
}

export function getHouseMinigameDurationDays(level: number): number {
  return normalizeHouseActivityLevel(level) * HOUSE_ACTIVITY_DAYS_PER_MINIGAME_LEVEL;
}

export function getHouseWorkDurationDays(): number {
  return HOUSE_ACTIVITY_WORK_DURATION_DAYS;
}

export function convertHouseActivityDaysToSegments(days: number): number {
  return Math.max(0, Math.floor(days)) * HOUSE_ACTIVITY_SEGMENTS_PER_DAY;
}

export function formatHouseActivityCostLine(days: number): string {
  return `预计耗时 ${days} 天，消耗 ${ACTIVITY_COMPLETION_STAMINA_COST} 点体力。`;
}
