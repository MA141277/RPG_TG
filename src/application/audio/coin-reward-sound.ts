import type {
  CoinRewardSoundEvent,
  CoinRewardSoundPlayer,
} from "../../domain/coin-reward-sound";
import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

type CoinRewardAudioTarget = {
  playCue(cueId: string): void;
};

export class CoinRewardSoundEffectSet {
  readonly cueIdsByEvent: Readonly<Record<CoinRewardSoundEvent, string>>;

  constructor(cueIdsByEvent: Record<CoinRewardSoundEvent, string>) {
    this.cueIdsByEvent = { ...cueIdsByEvent };
  }

  getCueId(event: CoinRewardSoundEvent): string {
    return this.cueIdsByEvent[event];
  }

  queue(
    session: AppAudioSession,
    event: CoinRewardSoundEvent
  ): AppAudioSession {
    return queueAppAudioCue(session, this.getCueId(event));
  }

  play(target: CoinRewardAudioTarget, event: CoinRewardSoundEvent): string {
    const cueId = this.getCueId(event);
    target.playCue(cueId);
    return cueId;
  }
}

export class CoinRewardAudioCuePlayer implements CoinRewardSoundPlayer {
  private readonly target: CoinRewardAudioTarget;
  private readonly soundEffects: CoinRewardSoundEffectSet;

  constructor(input: {
    target: CoinRewardAudioTarget;
    soundEffects?: CoinRewardSoundEffectSet;
  }) {
    this.target = input.target;
    this.soundEffects = input.soundEffects ?? COIN_REWARD_SOUND_EFFECTS;
  }

  play(event: CoinRewardSoundEvent): void {
    this.soundEffects.play(this.target, event);
  }
}

export const COIN_REWARD_SOUND_EFFECTS = new CoinRewardSoundEffectSet({
  burst: BUILTIN_AUDIO_CUE_IDS.gameCoinRewardBurst,
  collect: BUILTIN_AUDIO_CUE_IDS.gameCoinRewardCollect,
});

export function createCoinRewardAudioCuePlayer(
  target: CoinRewardAudioTarget,
  soundEffects: CoinRewardSoundEffectSet = COIN_REWARD_SOUND_EFFECTS
): CoinRewardAudioCuePlayer {
  return new CoinRewardAudioCuePlayer({
    target,
    soundEffects,
  });
}
