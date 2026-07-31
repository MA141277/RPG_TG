import type { CityBeggingGameCompletionResult } from "../../../../domain/city-begging-minigame";
import type {
  CityBeggingGranaryEscortBagState,
  CityBeggingGranaryEscortPlayingState,
  CityBeggingGranaryEscortRatState,
  CityBeggingGranaryEscortState,
} from "../../../../domain/minigames/city-begging-granary-escort";

type RangeConfig = {
  min: number;
  max: number;
};

export const CITY_BEGGING_GRANARY_ESCORT_CONFIG = {
  durationMs: 60_000,
  maxFrameStepMs: 34,
  world: {
    width: 1000,
    height: 560,
    groundY: 452,
    playerMinX: 146,
    playerMaxX: 794,
    playerHeadY: 360,
    granary: {
      x: 812,
      y: 144,
      width: 130,
      height: 224,
    },
    donationSpawnX: 142,
    donationSpawnY: 102,
    ratLaneY: 428,
  },
  player: {
    followLerpPerSecond: 10,
    headRadius: 34,
  },
  bag: {
    radius: 18,
    gravity: 920,
    spawnJitterX: 34,
    spawnVelocityX: {
      min: -12,
      max: 16,
    },
    spawnVelocityY: {
      min: 24,
      max: 72,
    },
    bounceVelocityX: {
      min: 232,
      max: 292,
    },
    bounceVelocityY: {
      min: -412,
      max: -354,
    },
    bounceCooldownMs: 180,
  },
  bagSpawnIntervalMs: {
    min: 1000,
    max: 2000,
  },
  rat: {
    width: 56,
    height: 26,
    spawnIntervalMs: {
      min: 4600,
      max: 8200,
    },
    speed: {
      min: 88,
      max: 132,
    },
  },
  combo: {
    toastTtlMs: 900,
  },
  reward: {
    perSuccessDou: 0.36,
    perComboBonusDou: 0.45,
    maxDou: 9,
  },
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pickRandomInRange(range: RangeConfig): number {
  return range.min + Math.random() * (range.max - range.min);
}

function isCircleCollidingWithRat(
  bag: CityBeggingGranaryEscortBagState,
  rat: CityBeggingGranaryEscortRatState
): boolean {
  return (
    Math.abs(bag.x - rat.x) <=
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.width / 2 +
        CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.radius &&
    Math.abs(bag.y - rat.y) <=
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.height / 2 +
        CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.radius
  );
}

function isBagInsideGranary(bag: CityBeggingGranaryEscortBagState): boolean {
  const { granary } = CITY_BEGGING_GRANARY_ESCORT_CONFIG.world;
  return (
    bag.x >= granary.x &&
    bag.x <= granary.x + granary.width &&
    bag.y >= granary.y &&
    bag.y <= granary.y + granary.height
  );
}

function scheduleNextSpawn(now: number, interval: RangeConfig): number {
  return now + pickRandomInRange(interval);
}

export function calculateGranaryEscortFoodGain(
  successCount: number,
  maxCombo: number
): number {
  if (successCount <= 0) {
    return 0;
  }

  const rewardValue =
    successCount * CITY_BEGGING_GRANARY_ESCORT_CONFIG.reward.perSuccessDou +
    Math.max(0, maxCombo - 1) *
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.reward.perComboBonusDou;

  return clamp(
    Math.max(1, Math.floor(rewardValue)),
    1,
    CITY_BEGGING_GRANARY_ESCORT_CONFIG.reward.maxDou
  );
}

function buildCompletionResult(
  successCount: number,
  maxCombo: number
): CityBeggingGameCompletionResult {
  return {
    foodGain: calculateGranaryEscortFoodGain(successCount, maxCombo),
    goldGain: 0,
    maxCombo,
    success: true,
  };
}

export function createGranaryEscortMiniGameState(
  now: number
): CityBeggingGranaryEscortPlayingState {
  const centerX =
    (CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.playerMinX +
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.playerMaxX) /
    2;

  return {
    status: "playing",
    startedAtMs: now,
    lastUpdatedAtMs: now,
    remainingMs: CITY_BEGGING_GRANARY_ESCORT_CONFIG.durationMs,
    pointerX: centerX,
    playerX: centerX,
    successCount: 0,
    combo: 0,
    maxCombo: 0,
    previewFoodGain: 0,
    comboToastValue: null,
    comboToastTtlMs: 0,
    nextBagSpawnAtMs: scheduleNextSpawn(
      now,
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.bagSpawnIntervalMs
    ),
    nextRatSpawnAtMs: scheduleNextSpawn(
      now + 900,
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.spawnIntervalMs
    ),
    nextEntityId: 1,
    bags: [],
    rats: [],
  };
}

export function setGranaryEscortMiniGamePointer(
  state: CityBeggingGranaryEscortState,
  pointerX: number
): CityBeggingGranaryEscortState {
  if (state.status !== "playing") {
    return state;
  }

  const nextPointerX = clamp(
    pointerX,
    CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.playerMinX,
    CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.playerMaxX
  );

  if (nextPointerX === state.pointerX) {
    return state;
  }

  return {
    ...state,
    pointerX: nextPointerX,
  };
}

function spawnBag(
  state: CityBeggingGranaryEscortPlayingState,
  spawnAtMs: number
): CityBeggingGranaryEscortPlayingState {
  const bag: CityBeggingGranaryEscortBagState = {
    id: state.nextEntityId,
    x:
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.donationSpawnX +
      pickRandomInRange({
        min: -CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.spawnJitterX,
        max: CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.spawnJitterX,
      }),
    y: CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.donationSpawnY,
    vx: pickRandomInRange(
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.spawnVelocityX
    ),
    vy: pickRandomInRange(
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.spawnVelocityY
    ),
    lastBouncedAtMs: Number.NEGATIVE_INFINITY,
  };

  return {
    ...state,
    nextEntityId: state.nextEntityId + 1,
    nextBagSpawnAtMs: scheduleNextSpawn(
      spawnAtMs,
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.bagSpawnIntervalMs
    ),
    bags: [...state.bags, bag],
  };
}

function spawnRat(
  state: CityBeggingGranaryEscortPlayingState,
  spawnAtMs: number
): CityBeggingGranaryEscortPlayingState {
  const direction = Math.random() > 0.5 ? 1 : -1;
  const rat: CityBeggingGranaryEscortRatState = {
    id: state.nextEntityId,
    direction,
    speed: pickRandomInRange(CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.speed),
    x:
      direction === 1
        ? -CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.width
        : CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.width +
          CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.width,
    y: CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.ratLaneY,
  };

  return {
    ...state,
    nextEntityId: state.nextEntityId + 1,
    nextRatSpawnAtMs: scheduleNextSpawn(
      spawnAtMs,
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.spawnIntervalMs
    ),
    rats: [...state.rats, rat],
  };
}

function breakComboIfNeeded(
  state: CityBeggingGranaryEscortPlayingState
): CityBeggingGranaryEscortPlayingState {
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

export function updateGranaryEscortMiniGameState(
  state: CityBeggingGranaryEscortState,
  now: number
): CityBeggingGranaryEscortState {
  if (state.status !== "playing") {
    return state;
  }

  const elapsedMs = now - state.lastUpdatedAtMs;
  const stepMs = clamp(
    elapsedMs,
    0,
    CITY_BEGGING_GRANARY_ESCORT_CONFIG.maxFrameStepMs
  );
  const deltaSeconds = stepMs / 1000;
  const remainingMs = Math.max(
    0,
    CITY_BEGGING_GRANARY_ESCORT_CONFIG.durationMs - (now - state.startedAtMs)
  );

  let nextState: CityBeggingGranaryEscortPlayingState = {
    ...state,
    lastUpdatedAtMs: now,
    remainingMs,
    playerX:
      state.playerX +
      (state.pointerX - state.playerX) *
        Math.min(
          1,
          deltaSeconds *
            CITY_BEGGING_GRANARY_ESCORT_CONFIG.player.followLerpPerSecond
        ),
    comboToastTtlMs: Math.max(0, state.comboToastTtlMs - elapsedMs),
    comboToastValue:
      state.comboToastTtlMs - elapsedMs <= 0 ? null : state.comboToastValue,
  };

  if (remainingMs > 0) {
    while (nextState.nextBagSpawnAtMs <= now) {
      nextState = spawnBag(nextState, nextState.nextBagSpawnAtMs);
    }

    while (nextState.nextRatSpawnAtMs <= now) {
      nextState = spawnRat(nextState, nextState.nextRatSpawnAtMs);
    }
  }

  const nextRats = nextState.rats
    .map((rat) => ({
      ...rat,
      x: rat.x + rat.speed * rat.direction * deltaSeconds,
    }))
    .filter(
      (rat) =>
        rat.x >= -CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.width * 2 &&
        rat.x <=
          CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.width +
            CITY_BEGGING_GRANARY_ESCORT_CONFIG.rat.width * 2
    );

  nextState = {
    ...nextState,
    rats: nextRats,
  };

  const survivingBags: CityBeggingGranaryEscortBagState[] = [];
  let successCount = nextState.successCount;
  let combo = nextState.combo;
  let maxCombo = nextState.maxCombo;
  let comboBroken = false;

  for (const bag of nextState.bags) {
    let nextBag: CityBeggingGranaryEscortBagState = {
      ...bag,
      x: bag.x + bag.vx * deltaSeconds,
      y: bag.y + bag.vy * deltaSeconds,
      vy:
        bag.vy +
        CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.gravity * deltaSeconds,
    };

    const canBounce =
      now - nextBag.lastBouncedAtMs >=
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.bounceCooldownMs;
    const headDistanceX = nextBag.x - nextState.playerX;
    const headDistanceY =
      nextBag.y - CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.playerHeadY;

    if (
      canBounce &&
      headDistanceX * headDistanceX + headDistanceY * headDistanceY <=
        (CITY_BEGGING_GRANARY_ESCORT_CONFIG.player.headRadius +
          CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.radius) **
          2 &&
      nextBag.vy >= -80
    ) {
      nextBag = {
        ...nextBag,
        x: nextState.playerX,
        y:
          CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.playerHeadY -
          CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.radius -
          3,
        vx: pickRandomInRange(
          CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.bounceVelocityX
        ),
        vy: pickRandomInRange(
          CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.bounceVelocityY
        ),
        lastBouncedAtMs: now,
      };
    }

    if (nextState.rats.some((rat) => isCircleCollidingWithRat(nextBag, rat))) {
      comboBroken = true;
      continue;
    }

    if (isBagInsideGranary(nextBag)) {
      successCount += 1;
      combo += 1;
      maxCombo = Math.max(maxCombo, combo);
      continue;
    }

    if (
      nextBag.y + CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.radius >=
      CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.groundY
    ) {
      comboBroken = true;
      continue;
    }

    if (
      nextBag.x < -CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.radius * 3 ||
      nextBag.x >
        CITY_BEGGING_GRANARY_ESCORT_CONFIG.world.width +
          CITY_BEGGING_GRANARY_ESCORT_CONFIG.bag.radius * 3
    ) {
      comboBroken = true;
      continue;
    }

    survivingBags.push(nextBag);
  }

  nextState = {
    ...nextState,
    bags: survivingBags,
    successCount,
    combo,
    maxCombo,
    previewFoodGain: calculateGranaryEscortFoodGain(successCount, maxCombo),
  };

  if (successCount > state.successCount && combo >= 2) {
    nextState = {
      ...nextState,
      comboToastValue: combo,
      comboToastTtlMs: CITY_BEGGING_GRANARY_ESCORT_CONFIG.combo.toastTtlMs,
    };
  }

  if (comboBroken) {
    nextState = breakComboIfNeeded(nextState);
  }

  if (nextState.remainingMs <= 0) {
    return {
      status: "result",
      successCount: nextState.successCount,
      maxCombo: nextState.maxCombo,
      result: buildCompletionResult(
        nextState.successCount,
        nextState.maxCombo
      ),
    };
  }

  return nextState;
}
