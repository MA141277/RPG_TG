import type { ActivityPachinkoBoardSession } from "../../domain/activity-session";
import type { PachinkoCollisionSoundEffect } from "./pachinko-collision-sound";

export const PACHINKO_SETTLE_BURST_DELAY_MS = 80;

export function consumePachinkoCollisionAudioPulse(input: {
  session: ActivityPachinkoBoardSession | null;
  lastConsumedToken: number | null;
  sound: PachinkoCollisionSoundEffect;
  target: { playCue(cueId: string): void };
  scheduleTask?: (callback: () => void, delayMs: number) => unknown;
  random?: () => number;
  settleDelayMs?: number;
}): number | null {
  if (input.session == null) {
    return null;
  }

  const pulse = input.session.audioPulse ?? null;
  if (pulse == null || pulse.token === input.lastConsumedToken) {
    return input.lastConsumedToken;
  }

  for (let index = 0; index < pulse.collisionCount; index += 1) {
    input.sound.play(input.target, input.random);
  }

  for (let index = 0; index < pulse.settleCount; index += 1) {
    input.sound.play(input.target, input.random);
    (input.scheduleTask ?? setTimeout)(() => {
      input.sound.play(input.target, input.random);
    }, input.settleDelayMs ?? PACHINKO_SETTLE_BURST_DELAY_MS);
  }

  return pulse.token;
}
