import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

export class PachinkoLaunchSoundEffect {
  readonly cueId: string;

  constructor(cueId: string) {
    this.cueId = cueId;
  }

  queue(session: AppAudioSession): AppAudioSession {
    return queueAppAudioCue(session, this.cueId);
  }
}

export const PACHINKO_LAUNCH_SOUND = new PachinkoLaunchSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.activityPachinkoLaunch
);

export function resolvePachinkoLaunchSoundEffectById(
  soundId: string | null | undefined
): PachinkoLaunchSoundEffect | null {
  if (soundId === "launch") {
    return PACHINKO_LAUNCH_SOUND;
  }

  return null;
}

export function resolvePachinkoLaunchSoundEffectFromTarget(target: {
  closest(selector: string): { dataset?: { pachinkoSound?: string } } | null;
}): PachinkoLaunchSoundEffect | null {
  return resolvePachinkoLaunchSoundEffectById(
    target.closest("[data-pachinko-sound]")?.dataset?.pachinkoSound
  );
}
