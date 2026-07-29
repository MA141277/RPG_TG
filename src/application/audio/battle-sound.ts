import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

const BATTLE_DEMO_CUE_ID_TO_APP_AUDIO_CUE_ID = Object.freeze({
  troopSelection: BUILTIN_AUDIO_CUE_IDS.uiTroopSelection,
  buttonLight: BUILTIN_AUDIO_CUE_IDS.uiButtonLight,
  buttonHeavy: BUILTIN_AUDIO_CUE_IDS.uiButtonHeavy,
  slashHit1: BUILTIN_AUDIO_CUE_IDS.battleSlashHit1,
  slashHit2: BUILTIN_AUDIO_CUE_IDS.battleSlashHit2,
  slashHit3: BUILTIN_AUDIO_CUE_IDS.battleSlashHit3,
  slashMiss: BUILTIN_AUDIO_CUE_IDS.battleSlashMiss,
  horseRun: BUILTIN_AUDIO_CUE_IDS.battleHorseRun,
  jump: BUILTIN_AUDIO_CUE_IDS.battleJump,
  landing: BUILTIN_AUDIO_CUE_IDS.battleLanding,
});

export type BattleDemoMusicCommand =
  | {
      kind: "start-bgm";
      cueId: string;
    }
  | {
      kind: "play-victory";
      cueId: string;
      fadeOutMs: number;
    };

const BATTLE_DEMO_MUSIC_COMMAND_BY_CUE_ID: Readonly<
  Record<string, BattleDemoMusicCommand>
> = Object.freeze({
  battleMusicStart: {
    kind: "start-bgm",
    cueId: BUILTIN_AUDIO_CUE_IDS.bgmBattle,
  },
  battleMusicVictory: {
    kind: "play-victory",
    cueId: BUILTIN_AUDIO_CUE_IDS.battleVictory,
    fadeOutMs: 200,
  },
});

export function resolveBattleDemoCueId(cueId: string | null | undefined): string | null {
  if (typeof cueId !== "string") {
    return null;
  }

  const normalizedCueId = cueId.trim() as keyof typeof BATTLE_DEMO_CUE_ID_TO_APP_AUDIO_CUE_ID;
  return BATTLE_DEMO_CUE_ID_TO_APP_AUDIO_CUE_ID[normalizedCueId] ?? null;
}

export function resolveBattleDemoMusicCommand(
  cueId: string | null | undefined
): BattleDemoMusicCommand | null {
  if (typeof cueId !== "string") {
    return null;
  }

  const normalizedCueId = cueId.trim();
  return BATTLE_DEMO_MUSIC_COMMAND_BY_CUE_ID[normalizedCueId] ?? null;
}

export class BattleSoundPlayer {
  private queueCue(session: AppAudioSession, cueId: string): AppAudioSession {
    return queueAppAudioCue(session, cueId);
  }

  playSlashHit1(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleSlashHit1);
  }

  playSlashHit2(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleSlashHit2);
  }

  playSlashHit3(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleSlashHit3);
  }

  playSlashMiss(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleSlashMiss);
  }

  playHorseRun(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleHorseRun);
  }

  playBowDraw(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleBowDraw);
  }

  playArrowRelease(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleArrowRelease);
  }

  playJump(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleJump);
  }

  playLanding(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleLanding);
  }

  playImpact(session: AppAudioSession): AppAudioSession {
    return this.queueCue(session, BUILTIN_AUDIO_CUE_IDS.battleImpactHit);
  }
}

export const BATTLE_SOUND = new BattleSoundPlayer();
