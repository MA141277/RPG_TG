import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

export class EnterSoundEffect {
  readonly cueId: string;

  constructor(cueId: string) {
    this.cueId = cueId;
  }

  queue(session: AppAudioSession): AppAudioSession {
    return queueAppAudioCue(session, this.cueId);
  }
}

export const ENTER_SOUND = new EnterSoundEffect(BUILTIN_AUDIO_CUE_IDS.uiEnter);

export function resolveEnterSoundEffectById(
  soundId: string | null | undefined
): EnterSoundEffect | null {
  if (soundId === "enter") {
    return ENTER_SOUND;
  }

  return null;
}

export function resolveEnterSoundEffectFromTarget(target: {
  closest(selector: string): { dataset?: { enterSound?: string } } | null;
}): EnterSoundEffect | null {
  return resolveEnterSoundEffectById(
    target.closest("[data-enter-sound]")?.dataset?.enterSound
  );
}
