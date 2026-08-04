import type { TavernShortClaimCountdownState } from "../../../domain/house-modules/tavern-session";

export const TAVERN_SHORT_CLAIM_COUNTDOWN_SECONDS = 10;

function getClaimCountdownTotalMs(countdown: TavernShortClaimCountdownState): number {
  return Math.max(1_000, Math.round(countdown.totalSeconds * 1_000));
}

export function createTavernShortClaimCountdown(
  nowMs: number = Date.now()
): TavernShortClaimCountdownState {
  return {
    totalSeconds: TAVERN_SHORT_CLAIM_COUNTDOWN_SECONDS,
    startedAtEpochMs: nowMs,
    expiresAtEpochMs: nowMs + TAVERN_SHORT_CLAIM_COUNTDOWN_SECONDS * 1_000,
  };
}

export function getTavernShortClaimCountdownRemainingMs(
  countdown: TavernShortClaimCountdownState,
  nowMs: number = Date.now()
): number {
  return Math.max(0, countdown.expiresAtEpochMs - nowMs);
}

export function getTavernShortClaimCountdownRemainingSeconds(
  countdown: TavernShortClaimCountdownState,
  nowMs: number = Date.now()
): number {
  return Math.ceil(getTavernShortClaimCountdownRemainingMs(countdown, nowMs) / 1_000);
}

export function getTavernShortClaimCountdownProgressPercent(
  countdown: TavernShortClaimCountdownState,
  nowMs: number = Date.now()
): number {
  const totalMs = getClaimCountdownTotalMs(countdown);
  const remainingMs = getTavernShortClaimCountdownRemainingMs(countdown, nowMs);
  return Math.max(0, Math.min(100, Math.round((remainingMs / totalMs) * 100)));
}

export function isTavernShortClaimCountdownExpired(
  countdown: TavernShortClaimCountdownState,
  nowMs: number = Date.now()
): boolean {
  return getTavernShortClaimCountdownRemainingMs(countdown, nowMs) <= 0;
}
