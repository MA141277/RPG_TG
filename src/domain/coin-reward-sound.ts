export type CoinRewardSoundEvent = "burst" | "collect";

export type CoinRewardSoundPlayer = {
  play(event: CoinRewardSoundEvent): void;
};
