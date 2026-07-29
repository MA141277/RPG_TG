import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

export class TroopSelectionSoundEffect {
  readonly cueId: string;

  constructor(cueId: string) {
    this.cueId = cueId;
  }

  queue(session: AppAudioSession): AppAudioSession {
    return queueAppAudioCue(session, this.cueId);
  }
}

export const TROOP_SELECTION_SOUND = new TroopSelectionSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.uiTroopSelection
);
