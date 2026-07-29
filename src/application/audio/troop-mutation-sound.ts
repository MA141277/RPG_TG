import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

export class TroopMutationSoundEffect {
  readonly cueId: string;

  constructor(cueId: string) {
    this.cueId = cueId;
  }

  queue(session: AppAudioSession): AppAudioSession {
    return queueAppAudioCue(session, this.cueId);
  }
}

export const TROOP_MUTATION_SOUND = new TroopMutationSoundEffect(
  BUILTIN_AUDIO_CUE_IDS.uiTroopMutation
);
