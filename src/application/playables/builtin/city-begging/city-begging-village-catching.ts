import type { CityBeggingGameCompletionResult } from "../../../../domain/city-begging-minigame";
import type {
  CityBeggingVillageEvaluation,
  CityBeggingVillageFeedbackState,
  CityBeggingVillageItemKind,
  CityBeggingVillageItemState,
  CityBeggingVillagePlayingState,
  CityBeggingVillageState,
} from "../../../../domain/minigames/city-begging-village-catching";

type RangeConfig = {
  min: number;
  max: number;
};

type WeightedItemConfig = {
  kind: CityBeggingVillageItemKind;
  weight: number;
};

export const CITY_BEGGING_VILLAGE_CATCHING_CONFIG = {
  durationMs: 30_000,
  maxFrameStepMs: 34,
  world: {
    width: 1000,
    height: 560,
    groundY: 472,
    playerMinX: 92,
    playerMaxX: 908,
    playerCatchY: 418,
    catchHalfWidth: 46,
    catchHalfHeight: 58,
    spawnY: -48,
  },
  player: {
    followLerpPerSecond: 12,
    slowedFollowLerpPerSecond: 4.5,
    slowDurationMs: 2000,
  },
  itemSpawnIntervalMs: {
    min: 500,
    max: 1500,
  },
  benevolenceSpawnIntervalMs: {
    min: 220,
    max: 520,
  },
  items: {
    "rice-bag": {
      radius: 18,
      points: 1,
      fallSpeed: {
        min: 158,
        max: 212,
      },
    },
    "steamed-bun": {
      radius: 14,
      points: 0.5,
      fallSpeed: {
        min: 170,
        max: 224,
      },
    },
    coin: {
      radius: 12,
      points: 2,
      fallSpeed: {
        min: 184,
        max: 246,
      },
    },
    rat: {
      radius: 17,
      penaltyPoints: 1.2,
      fallSpeed: {
        min: 176,
        max: 228,
      },
    },
    "broken-bowl": {
      radius: 17,
      fallSpeed: {
        min: 166,
        max: 218,
      },
    },
    horizontalDrift: {
      min: -28,
      max: 28,
    },
  },
  combo: {
    toastTtlMs: 900,
    multipliers: [
      { combo: 1, multiplier: 1 },
      { combo: 3, multiplier: 1.08 },
      { combo: 5, multiplier: 1.16 },
      { combo: 10, multiplier: 1.3 },
    ],
  },
  specialEvent: {
    durationMs: 5000,
    cooldownMs: 9000,
    triggerChancePerSpawn: 0.18,
  },
  feedback: {
    ttlMs: 760,
  },
  reward: {
    scoreToDouTable: [
      { minScore: 0, foodGain: 1 },
      { minScore: 6, foodGain: 2 },
      { minScore: 11, foodGain: 3 },
      { minScore: 16, foodGain: 4 },
      { minScore: 21, foodGain: 5 },
      { minScore: 26, foodGain: 6 },
      { minScore: 31, foodGain: 7 },
      { minScore: 36, foodGain: 8 },
      { minScore: 41, foodGain: 9 },
    ],
  },
  resultEvaluation: [
    { minFoodGain: 1, label: "收获寥寥" as const },
    { minFoodGain: 4, label: "略有所得" as const },
    { minFoodGain: 7, label: "满载而归" as const },
    { minFoodGain: 9, label: "功德无量" as const },
  ],
  spawnWeights: {
    normal: [
      { kind: "rice-bag", weight: 4.8 },
      { kind: "steamed-bun", weight: 3.2 },
      { kind: "coin", weight: 1 },
      { kind: "rat", weight: 1.2 },
      { kind: "broken-bowl", weight: 0.8 },
    ],
    benevolence: [
      { kind: "rice-bag", weight: 7.4 },
      { kind: "steamed-bun", weight: 3.1 },
      { kind: "coin", weight: 1.2 },
      { kind: "rat", weight: 0.25 },
      { kind: "broken-bowl", weight: 0.35 },
    ],
  },
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pickRandomInRange(range: RangeConfig): number {
  return range.min + Math.random() * (range.max - range.min);
}

function pickWeightedItem(weightedItems: readonly WeightedItemConfig[]): CityBeggingVillageItemKind {
  const totalWeight = weightedItems.reduce((sum, item) => sum + item.weight, 0);
  let remaining = Math.random() * totalWeight;

  for (const item of weightedItems) {
    remaining -= item.weight;
    if (remaining <= 0) {
      return item.kind;
    }
  }

  return weightedItems[weightedItems.length - 1]?.kind ?? "rice-bag";
}

function resolveComboMultiplier(combo: number): number {
  let multiplier = 1;

  for (const entry of CITY_BEGGING_VILLAGE_CATCHING_CONFIG.combo.multipliers) {
    if (combo >= entry.combo) {
      multiplier = entry.multiplier;
    }
  }

  return multiplier;
}

function convertEffectiveScoreToFoodGain(effectiveScore: number): number {
  let result = 1;

  for (const entry of CITY_BEGGING_VILLAGE_CATCHING_CONFIG.reward.scoreToDouTable) {
    if (effectiveScore >= entry.minScore) {
      result = entry.foodGain;
    }
  }

  return result;
}

function calculateEffectiveScore(rawScore: number, maxCombo: number): number {
  return Math.max(0, rawScore * resolveComboMultiplier(maxCombo));
}

function buildCompletionResult(
  effectiveScore: number,
  maxCombo: number
): CityBeggingGameCompletionResult {
  return {
    foodGain: convertEffectiveScoreToFoodGain(effectiveScore),
    goldGain: 0,
    maxCombo,
    success: true,
  };
}

function resolveEvaluation(foodGain: number): CityBeggingVillageEvaluation {
  let result: CityBeggingVillageEvaluation = "收获寥寥";

  for (const entry of CITY_BEGGING_VILLAGE_CATCHING_CONFIG.resultEvaluation) {
    if (foodGain >= entry.minFoodGain) {
      result = entry.label;
    }
  }

  return result;
}

function scheduleNextSpawn(now: number, benevolenceActive: boolean): number {
  return (
    now +
    pickRandomInRange(
      benevolenceActive
        ? CITY_BEGGING_VILLAGE_CATCHING_CONFIG.benevolenceSpawnIntervalMs
        : CITY_BEGGING_VILLAGE_CATCHING_CONFIG.itemSpawnIntervalMs
    )
  );
}

function createFeedback(
  state: CityBeggingVillagePlayingState,
  label: string,
  x: number,
  y: number,
  color: string
): CityBeggingVillageFeedbackState {
  return {
    id: state.nextEntityId,
    label,
    x,
    y,
    color,
    ttlMs: CITY_BEGGING_VILLAGE_CATCHING_CONFIG.feedback.ttlMs,
  };
}

function pushFeedback(
  state: CityBeggingVillagePlayingState,
  feedback: CityBeggingVillageFeedbackState
): CityBeggingVillagePlayingState {
  return {
    ...state,
    nextEntityId: state.nextEntityId + 1,
    feedbacks: [...state.feedbacks, feedback],
  };
}

function breakCombo(state: CityBeggingVillagePlayingState): CityBeggingVillagePlayingState {
  if (state.combo === 0 && state.comboToastValue == null) {
    return state;
  }

  return {
    ...state,
    combo: 0,
    comboToastValue: null,
    comboToastTtlMs: 0,
  };
}

export function createVillageCatchingMiniGameState(
  now: number
): CityBeggingVillagePlayingState {
  const centerX =
    (CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.playerMinX +
      CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.playerMaxX) /
    2;

  return {
    status: "playing",
    startedAtMs: now,
    lastUpdatedAtMs: now,
    remainingMs: CITY_BEGGING_VILLAGE_CATCHING_CONFIG.durationMs,
    pointerX: centerX,
    playerX: centerX,
    combo: 0,
    maxCombo: 0,
    rawScore: 0,
    effectiveScore: 0,
    previewFoodGain: 0,
    riceBagCaughtCount: 0,
    comboToastValue: null,
    comboToastTtlMs: 0,
    slowedRemainingMs: 0,
    benevolenceRemainingMs: 0,
    specialEventCooldownRemainingMs: 0,
    nextSpawnAtMs: scheduleNextSpawn(now, false),
    nextEntityId: 1,
    items: [],
    feedbacks: [],
  };
}

export function setVillageCatchingMiniGamePointer(
  state: CityBeggingVillageState,
  pointerX: number
): CityBeggingVillageState {
  if (state.status !== "playing") {
    return state;
  }

  const nextPointerX = clamp(
    pointerX,
    CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.playerMinX,
    CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.playerMaxX
  );

  if (nextPointerX === state.pointerX) {
    return state;
  }

  return {
    ...state,
    pointerX: nextPointerX,
  };
}

function spawnItem(
  state: CityBeggingVillagePlayingState,
  now: number
): CityBeggingVillagePlayingState {
  const benevolenceActive = state.benevolenceRemainingMs > 0;
  const weightedItems = benevolenceActive
    ? CITY_BEGGING_VILLAGE_CATCHING_CONFIG.spawnWeights.benevolence
    : CITY_BEGGING_VILLAGE_CATCHING_CONFIG.spawnWeights.normal;
  const kind = pickWeightedItem(weightedItems);
  const itemConfig = CITY_BEGGING_VILLAGE_CATCHING_CONFIG.items[kind];
  const item: CityBeggingVillageItemState = {
    id: state.nextEntityId,
    kind,
    x: pickRandomInRange({
      min: CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.playerMinX,
      max: CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.playerMaxX,
    }),
    y: CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.spawnY,
    vy: pickRandomInRange(itemConfig.fallSpeed),
    vx: pickRandomInRange(CITY_BEGGING_VILLAGE_CATCHING_CONFIG.items.horizontalDrift),
    swayPhase: Math.random() * Math.PI * 2,
  };
  let nextState: CityBeggingVillagePlayingState = {
    ...state,
    nextEntityId: state.nextEntityId + 1,
    nextSpawnAtMs: scheduleNextSpawn(now, benevolenceActive),
    items: [...state.items, item],
  };

  if (
    !benevolenceActive &&
    state.specialEventCooldownRemainingMs <= 0 &&
    Math.random() < CITY_BEGGING_VILLAGE_CATCHING_CONFIG.specialEvent.triggerChancePerSpawn
  ) {
    nextState = pushFeedback(
      {
        ...nextState,
        benevolenceRemainingMs:
          CITY_BEGGING_VILLAGE_CATCHING_CONFIG.specialEvent.durationMs,
        specialEventCooldownRemainingMs:
          CITY_BEGGING_VILLAGE_CATCHING_CONFIG.specialEvent.cooldownMs,
      },
      createFeedback(nextState, "善人施舍", 500, 112, "#ffe8a8")
    );
  }

  return nextState;
}

function isPositiveItem(kind: CityBeggingVillageItemKind): boolean {
  return kind === "rice-bag" || kind === "steamed-bun" || kind === "coin";
}

function isPlayerColliding(item: CityBeggingVillageItemState, playerX: number): boolean {
  const itemRadius = CITY_BEGGING_VILLAGE_CATCHING_CONFIG.items[item.kind].radius;

  return (
    Math.abs(item.x - playerX) <=
      CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.catchHalfWidth + itemRadius &&
    Math.abs(item.y - CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.playerCatchY) <=
      CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.catchHalfHeight + itemRadius
  );
}

function updatePreview(state: CityBeggingVillagePlayingState): CityBeggingVillagePlayingState {
  const effectiveScore = calculateEffectiveScore(state.rawScore, state.maxCombo);

  return {
    ...state,
    effectiveScore,
    previewFoodGain:
      state.rawScore > 0 ? convertEffectiveScoreToFoodGain(effectiveScore) : 0,
  };
}

export function updateVillageCatchingMiniGameState(
  state: CityBeggingVillageState,
  now: number
): CityBeggingVillageState {
  if (state.status !== "playing") {
    return state;
  }

  const elapsedMs = now - state.lastUpdatedAtMs;
  const stepMs = clamp(
    elapsedMs,
    0,
    CITY_BEGGING_VILLAGE_CATCHING_CONFIG.maxFrameStepMs
  );
  const deltaSeconds = stepMs / 1000;
  const remainingMs = Math.max(
    0,
    CITY_BEGGING_VILLAGE_CATCHING_CONFIG.durationMs - (now - state.startedAtMs)
  );
  const slowedRemainingMs = Math.max(0, state.slowedRemainingMs - elapsedMs);
  const benevolenceRemainingMs = Math.max(
    0,
    state.benevolenceRemainingMs - elapsedMs
  );
  const specialEventCooldownRemainingMs = Math.max(
    0,
    state.specialEventCooldownRemainingMs - elapsedMs
  );
  const playerLerpPerSecond =
    slowedRemainingMs > 0
      ? CITY_BEGGING_VILLAGE_CATCHING_CONFIG.player.slowedFollowLerpPerSecond
      : CITY_BEGGING_VILLAGE_CATCHING_CONFIG.player.followLerpPerSecond;

  let nextState: CityBeggingVillagePlayingState = {
    ...state,
    lastUpdatedAtMs: now,
    remainingMs,
    slowedRemainingMs,
    benevolenceRemainingMs,
    specialEventCooldownRemainingMs,
    playerX:
      state.playerX +
      (state.pointerX - state.playerX) *
        Math.min(1, deltaSeconds * playerLerpPerSecond),
    comboToastTtlMs: Math.max(0, state.comboToastTtlMs - elapsedMs),
    comboToastValue:
      state.comboToastTtlMs - elapsedMs <= 0 ? null : state.comboToastValue,
    feedbacks: state.feedbacks
      .map((feedback) => ({
        ...feedback,
        y: feedback.y - 42 * deltaSeconds,
        ttlMs: feedback.ttlMs - elapsedMs,
      }))
      .filter((feedback) => feedback.ttlMs > 0),
  };

  if (remainingMs > 0) {
    while (nextState.nextSpawnAtMs <= now) {
      nextState = spawnItem(nextState, nextState.nextSpawnAtMs);
    }
  }

  const survivors: CityBeggingVillageItemState[] = [];

  for (const item of nextState.items) {
    const nextItem: CityBeggingVillageItemState = {
      ...item,
      x: clamp(
        item.x +
          item.vx * deltaSeconds +
          Math.sin(item.swayPhase + now * 0.002) * 12 * deltaSeconds,
        24,
        CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.width - 24
      ),
      y: item.y + item.vy * deltaSeconds,
      swayPhase: item.swayPhase + deltaSeconds * 2.6,
    };

    if (isPlayerColliding(nextItem, nextState.playerX)) {
      if (nextItem.kind === "rat") {
        nextState = updatePreview(
          pushFeedback(
            breakCombo({
              ...nextState,
              rawScore: Math.max(
                0,
                nextState.rawScore -
                  CITY_BEGGING_VILLAGE_CATCHING_CONFIG.items.rat.penaltyPoints
              ),
            }),
            createFeedback(nextState, "老鼠!", nextItem.x, nextItem.y, "#f0c7b0")
          )
        );
      } else if (nextItem.kind === "broken-bowl") {
        nextState = pushFeedback(
          {
            ...nextState,
            slowedRemainingMs:
              CITY_BEGGING_VILLAGE_CATCHING_CONFIG.player.slowDurationMs,
          },
          createFeedback(nextState, "破碗!", nextItem.x, nextItem.y, "#b7d4e4")
        );
      } else {
        const points = CITY_BEGGING_VILLAGE_CATCHING_CONFIG.items[nextItem.kind].points;
        const combo = nextState.combo + 1;
        const maxCombo = Math.max(nextState.maxCombo, combo);
        nextState = updatePreview(
          pushFeedback(
            {
              ...nextState,
              rawScore: nextState.rawScore + points,
              combo,
              maxCombo,
              riceBagCaughtCount:
                nextState.riceBagCaughtCount +
                (nextItem.kind === "rice-bag" ? 1 : 0),
              comboToastValue: combo >= 2 ? combo : nextState.comboToastValue,
              comboToastTtlMs:
                combo >= 2
                  ? CITY_BEGGING_VILLAGE_CATCHING_CONFIG.combo.toastTtlMs
                  : nextState.comboToastTtlMs,
            },
            createFeedback(
              nextState,
              `+${points}分`,
              nextItem.x,
              nextItem.y,
              nextItem.kind === "coin" ? "#ffe28e" : "#f4ebcf"
            )
          )
        );
      }

      continue;
    }

    if (nextItem.y >= CITY_BEGGING_VILLAGE_CATCHING_CONFIG.world.groundY) {
      if (isPositiveItem(nextItem.kind)) {
        nextState = breakCombo(nextState);
      }
      continue;
    }

    survivors.push(nextItem);
  }

  nextState = {
    ...nextState,
    items: survivors,
  };

  if (nextState.remainingMs <= 0 && nextState.items.length === 0) {
    const effectiveScore = calculateEffectiveScore(
      nextState.rawScore,
      nextState.maxCombo
    );
    const result = buildCompletionResult(effectiveScore, nextState.maxCombo);

    return {
      status: "result",
      riceBagCaughtCount: nextState.riceBagCaughtCount,
      maxCombo: nextState.maxCombo,
      rawScore: nextState.rawScore,
      effectiveScore,
      evaluation: resolveEvaluation(result.foodGain),
      result,
    };
  }

  return nextState;
}
