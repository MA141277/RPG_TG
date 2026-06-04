import type { CityBeggingGameCompletionResult } from "../city-begging-minigame";

export type CityBeggingVillageItemKind =
  | "rice-bag"
  | "steamed-bun"
  | "coin"
  | "rat"
  | "broken-bowl";

export type CityBeggingVillageItemState = {
  id: number;
  kind: CityBeggingVillageItemKind;
  x: number;
  y: number;
  vy: number;
  vx: number;
  swayPhase: number;
};

export type CityBeggingVillageFeedbackState = {
  id: number;
  label: string;
  x: number;
  y: number;
  color: string;
  ttlMs: number;
};

export type CityBeggingVillagePlayingState = {
  status: "playing";
  startedAtMs: number;
  lastUpdatedAtMs: number;
  remainingMs: number;
  pointerX: number;
  playerX: number;
  combo: number;
  maxCombo: number;
  rawScore: number;
  effectiveScore: number;
  previewFoodGain: number;
  goldGain: number;
  riceBagCaughtCount: number;
  coinCaughtCount: number;
  comboToastValue: number | null;
  comboToastTtlMs: number;
  slowedRemainingMs: number;
  benevolenceRemainingMs: number;
  specialEventCooldownRemainingMs: number;
  nextSpawnAtMs: number;
  nextEntityId: number;
  items: CityBeggingVillageItemState[];
  feedbacks: CityBeggingVillageFeedbackState[];
};

export type CityBeggingVillageEvaluation =
  | "收获寥寥"
  | "略有所得"
  | "满载而归"
  | "功德无量";

export type CityBeggingVillageResultState = {
  status: "result";
  riceBagCaughtCount: number;
  coinCaughtCount: number;
  maxCombo: number;
  rawScore: number;
  effectiveScore: number;
  evaluation: CityBeggingVillageEvaluation;
  result: CityBeggingGameCompletionResult;
};

export type CityBeggingVillageState =
  | CityBeggingVillagePlayingState
  | CityBeggingVillageResultState;
