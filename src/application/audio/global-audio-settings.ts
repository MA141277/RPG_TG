import type { ContentPackAudioSettings } from "../../domain/content-pack";

export function normalizeGlobalAudioSettings(
  value: unknown
): ContentPackAudioSettings {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return { muted: false };
  }

  const candidate = value as { muted?: unknown };
  return {
    muted: candidate.muted === true,
  };
}

export function isGlobalAudioMuted(value: unknown): boolean {
  return normalizeGlobalAudioSettings(value).muted === true;
}

export function applyGlobalAudioMutedState(input: {
  players: readonly HTMLAudioElement[];
  muted: boolean;
}): void {
  input.players.forEach((player) => {
    player.muted = input.muted;
  });
}
