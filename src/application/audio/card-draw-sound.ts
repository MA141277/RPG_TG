import type {
  CardDrawSoundEvent,
  CardDrawSoundPlayer,
} from "../../domain/card-draw-sound";
import type { AppAudioSession } from "./audio-manager";
import { BUILTIN_AUDIO_CUE_IDS, queueAppAudioCue } from "./audio-manager";

type CardDrawAudioTarget = {
  playCue(cueId: string): void;
};

export class CardDrawSoundEffectSet {
  readonly cueIdsByEvent: Readonly<Record<CardDrawSoundEvent, string>>;

  constructor(cueIdsByEvent: Record<CardDrawSoundEvent, string>) {
    this.cueIdsByEvent = { ...cueIdsByEvent };
  }

  getCueId(event: CardDrawSoundEvent): string {
    return this.cueIdsByEvent[event];
  }

  queue(
    session: AppAudioSession,
    event: CardDrawSoundEvent
  ): AppAudioSession {
    return queueAppAudioCue(session, this.getCueId(event));
  }

  play(target: CardDrawAudioTarget, event: CardDrawSoundEvent): string {
    const cueId = this.getCueId(event);
    target.playCue(cueId);
    return cueId;
  }
}

export class CardDrawAudioCuePlayer implements CardDrawSoundPlayer {
  private readonly target: CardDrawAudioTarget;
  private readonly soundEffects: CardDrawSoundEffectSet;

  constructor(input: {
    target: CardDrawAudioTarget;
    soundEffects?: CardDrawSoundEffectSet;
  }) {
    this.target = input.target;
    this.soundEffects = input.soundEffects ?? CARD_DRAW_SOUND_EFFECTS;
  }

  play(event: CardDrawSoundEvent): void {
    this.soundEffects.play(this.target, event);
  }
}

export const CARD_DRAW_SOUND_EFFECTS = new CardDrawSoundEffectSet({
  shuffle: BUILTIN_AUDIO_CUE_IDS.activityCardDrawShuffle,
  pull: BUILTIN_AUDIO_CUE_IDS.activityCardDrawPull,
  flip: BUILTIN_AUDIO_CUE_IDS.activityCardDrawFlip,
  return: BUILTIN_AUDIO_CUE_IDS.activityCardDrawPull,
});

export function createCardDrawAudioCuePlayer(
  target: CardDrawAudioTarget,
  soundEffects: CardDrawSoundEffectSet = CARD_DRAW_SOUND_EFFECTS
): CardDrawAudioCuePlayer {
  return new CardDrawAudioCuePlayer({
    target,
    soundEffects,
  });
}
