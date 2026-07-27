import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

export class ButtonSoundEffect {
  readonly cueId: string;

  constructor(cueId: string) {
    this.cueId = cueId;
  }

  queue(session: AppAudioSession): AppAudioSession {
    return queueAppAudioCue(session, this.cueId);
  }
}

export const LIGHT_BUTTON_SOUND = new ButtonSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.uiButtonLight
);

export const HEAVY_BUTTON_SOUND = new ButtonSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy
);
