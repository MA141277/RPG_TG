import type { CityBeggingGameCompletionResult } from "../city-begging-minigame";

export type CityBeggingGranaryEscortBagState = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  lastBouncedAtMs: number;
};

export type CityBeggingGranaryEscortRatState = {
  id: number;
  x: number;
  y: number;
  speed: number;
  direction: -1 | 1;
};

export type CityBeggingGranaryEscortPlayingState = {
  status: "playing";
  startedAtMs: number;
  lastUpdatedAtMs: number;
  remainingMs: number;
  pointerX: number;
  playerX: number;
  successCount: number;
  combo: number;
  maxCombo: number;
  previewFoodGain: number;
  comboToastValue: number | null;
  comboToastTtlMs: number;
  nextBagSpawnAtMs: number;
  nextRatSpawnAtMs: number;
  nextEntityId: number;
  bags: CityBeggingGranaryEscortBagState[];
  rats: CityBeggingGranaryEscortRatState[];
};

export type CityBeggingGranaryEscortResultState = {
  status: "result";
  successCount: number;
  maxCombo: number;
  result: CityBeggingGameCompletionResult;
};

export type CityBeggingGranaryEscortState =
  | CityBeggingGranaryEscortPlayingState
  | CityBeggingGranaryEscortResultState;
