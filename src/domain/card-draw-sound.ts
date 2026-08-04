export type CardDrawSoundEvent = "shuffle" | "pull" | "flip" | "return";

export type CardDrawSoundPlayer = {
  play(event: CardDrawSoundEvent): void;
};
