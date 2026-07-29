import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

export class GameEventSoundPlayer {
  private queueCue(session: AppAudioSession, cueId: string): AppAudioSession {
    return queueAppAudioCue(session, cueId);
  }

  playMoney(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.gameMoney);
  }

  playTaskVictory(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.gameTaskVictory);
  }

  playTaskFailure(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.gameTaskFailure);
  }
}

export const GAME_EVENT_SOUND = new GameEventSoundPlayer();
