import type { ActivityDefinition, ActivityHandlerId } from "../../domain/activity";
import type {
  ActivityFortuneBoardCell,
  ActivityFortuneBoardCellKind,
  ActivityFortuneBoardSession,
  ActivityFortuneBoardTripletReward,
  ActivityPachinkoBoardBall,
  ActivityPachinkoBoardEventKind,
  ActivityPachinkoBoardEventLogEntry,
  ActivityPachinkoFortuneCardResult,
  ActivityPachinkoMovingGate,
  ActivityPachinkoBoardPin,
  ActivityPachinkoBoardSession,
  ActivityPachinkoBoardWheelRewardSegment,
  ActivityPachinkoBoardWheelState,
  ActivityQteSession,
  ActivityWorkSequenceSession,
} from "../../domain/activity-session";
import {
  FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
  PACHINKO_BOARD_DEFAULT_ANIMATION_TICK_MS,
} from "../../domain/activity-session";
import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import { applyEffects } from "../effects/effect-applier";
import { advanceGameStateTimeSegments } from "../time/time-progression";

const QTE_MARKER_STEP = 7;
const FORTUNE_BOARD_SIZE = 5;
const FORTUNE_BOARD_STARTING_PIECES = 5;
const FORTUNE_BOARD_FLASH_TICKS = 4;
const FORTUNE_BOARD_CELL_PICK_FLASH_TICKS = 4;
const FORTUNE_BOARD_FINAL_FLASH_TICKS = 4;
const FORTUNE_BOARD_FINAL_REROLL_TICKS = 8;
const FORTUNE_BOARD_CELL_COUNTS: Record<ActivityFortuneBoardCellKind, number> = {
  timing: 3,
  favorable: 5,
  complete: 6,
  resonance: 1,
  rumor: 1,
  plain: 9,
};
const FORTUNE_BOARD_TRIPLET_CONTRIBUTION: Partial<
  Record<ActivityFortuneBoardCellKind, number>
> = {
  timing: 10,
  favorable: 6,
  complete: 4,
  plain: 1,
};
const PACHINKO_BOARD_WIDTH = 700;
const PACHINKO_BOARD_HEIGHT = 1150;
const PACHINKO_STARTING_BALLS = 5;
const PACHINKO_BALL_RADIUS = 17;
const PACHINKO_PIN_RADIUS = 9;
const PACHINKO_GRAVITY = 0.42;
const PACHINKO_DAMPING = 0.992;
const PACHINKO_BOUNCE = 0.78;
const PACHINKO_PHYSICS_SUBSTEPS = 4;
const PACHINKO_FLIPPER_MIN_ANGLE = -65;
const PACHINKO_FLIPPER_MAX_ANGLE = 65;
const PACHINKO_FLIPPER_STEP = 2.5;
const PACHINKO_FLIPPER_ROOT_Y = 12;
const PACHINKO_FLIPPER_ROOT_GAP = 120;
const PACHINKO_FLIPPER_LENGTH = 139;
const PACHINKO_FLIPPER_RADIUS = 10;
const PACHINKO_FLIPPER_KICK = 0.42;
const PACHINKO_FIRST_PIN_ROW_Y = 590;
const PACHINKO_PIN_ROW_SPACING = 170;
const PACHINKO_TOP_MOVING_GATE_Y =
  PACHINKO_FIRST_PIN_ROW_Y - PACHINKO_PIN_ROW_SPACING;
const PACHINKO_MOVING_GATE_Y = 675;
const PACHINKO_MOVING_GATE_GAP = 100;
const PACHINKO_MOVING_GATE_MIN_X = 145;
const PACHINKO_MOVING_GATE_MAX_X = 555;
const PACHINKO_MOVING_GATE_STEP = 1.6;
const PACHINKO_TOP_MOVING_GATE_STEP = PACHINKO_MOVING_GATE_STEP / 2;
const PACHINKO_BOTTOM_WALL_START_Y = 1015;
const PACHINKO_LAYOUT_REFRESH_PERIOD_MS = 20_000;
const PACHINKO_SLOT_VALUES: Array<number | "fortune-card"> = [
  5,
  3,
  3,
  2,
  2,
  2,
  "fortune-card",
];
const PACHINKO_WHEEL_SEGMENTS: ActivityPachinkoBoardWheelRewardSegment[] = [
  { id: "score-2", label: "+2分", kind: "score", amount: 2, weight: 30 },
  { id: "ball-1", label: "+1球", kind: "extra-ball", amount: 1, weight: 20 },
  { id: "ball-2", label: "+2球", kind: "extra-ball", amount: 2, weight: 15 },
  { id: "score-5", label: "+5分", kind: "score", amount: 5, weight: 15 },
  { id: "score-minus-2", label: "-2分", kind: "score", amount: -2, weight: 10 },
  { id: "encounter", label: "奇遇", kind: "encounter", amount: 0, weight: 10 },
];
const PACHINKO_FORTUNE_CARDS: Array<
  Omit<ActivityPachinkoFortuneCardResult, "applied" | "resolved">
> = [
  {
    id: "good-abbot-effort",
    rank: "good",
    label: "吉",
    description: "方丈看到你努力工作的样子，得分 +5。",
    scoreDelta: 5,
  },
  {
    id: "good-clear-bell",
    rank: "good",
    label: "吉",
    description: "钟声正合你的节奏，手上的活计格外顺利，得分 +4。",
    scoreDelta: 4,
  },
  {
    id: "neutral-calm-temple",
    rank: "neutral",
    label: "平",
    description: "寺院里清净的氛围让你感到舒适，体力 +5。",
    staminaDelta: 5,
  },
  {
    id: "neutral-clean-water",
    rank: "neutral",
    label: "平",
    description: "井水清凉，你洗了把脸，精神稍稍恢复，体力 +3。",
    staminaDelta: 3,
  },
  {
    id: "bad-senior-trouble",
    rank: "bad",
    label: "凶",
    description: "有师兄找你茬，得分 -2。",
    scoreDelta: -2,
  },
  {
    id: "bad-broken-broom",
    rank: "bad",
    label: "凶",
    description: "扫帚忽然折断，耽误了不少工夫，得分 -1。",
    scoreDelta: -1,
  },
  {
    id: "encounter-abbot-question",
    rank: "encounter",
    label: "奇遇",
    description: "方丈似乎有话要问你。",
  },
  {
    id: "encounter-lamp-shadow",
    rank: "encounter",
    label: "奇遇",
    description: "殿前灯影微动，一段机缘悄然临近。",
  },
];

type PachinkoFlipperSegment = {
  rootX: number;
  rootY: number;
  tipX: number;
  tipY: number;
  angleRadians: number;
  radius: number;
};

export type ActivityQteCompletionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function createActivityQteSession(
  activityDefinition: ActivityDefinition,
  handlerId: ActivityHandlerId
): ActivityPachinkoBoardSession;
export function createActivityQteSession(
  activityDefinition: ActivityDefinition,
  handlerId: ActivityHandlerId,
  options: { variant: "fortune-board" }
): ActivityFortuneBoardSession;
export function createActivityQteSession(
  activityDefinition: ActivityDefinition,
  handlerId: ActivityHandlerId,
  options?: { variant: "fortune-board" }
): ActivityPachinkoBoardSession | ActivityFortuneBoardSession {
  if (options?.variant !== "fortune-board") {
    return createActivityPachinkoBoardSession(activityDefinition, handlerId);
  }

  return {
    type: "fortune-board",
    activityId: activityDefinition.id,
    handlerId,
    title: activityDefinition.label,
    taskLabel: activityDefinition.label,
    board: createFortuneBoard(activityDefinition.id, 0, []),
    remainingPieces: FORTUNE_BOARD_STARTING_PIECES,
    wager: 1,
    phase: "ready",
    highlightedColumn: null,
    selectedColumn: null,
    flashTicks: 0,
    pendingDropCount: 0,
    scanCellKeys: [],
    scanCellIndex: 0,
    highlightedCellKey: null,
    pickedCellKey: null,
    selectedCellKeys: [],
    animationTickMs: FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS,
    score: 0,
    baseScore: 0,
    tripletRewards: [],
    resonanceCount: 0,
    rumorCount: 0,
    rerollCount: 0,
    timeAdvanceCost: Math.max(0, activityDefinition.timeAdvanceCost ?? 0),
    ...(activityDefinition.outcome?.completedFlagKey == null
      ? {}
      : { completedFlagKey: activityDefinition.outcome.completedFlagKey }),
    ...(activityDefinition.outcome?.gradeVariableKey == null
      ? {}
      : { gradeVariableKey: activityDefinition.outcome.gradeVariableKey }),
    ...(activityDefinition.outcome?.scoreVariableKey == null
      ? {}
      : { scoreVariableKey: activityDefinition.outcome.scoreVariableKey }),
  };
}

function createActivityPachinkoBoardSession(
  activityDefinition: ActivityDefinition,
  handlerId: ActivityHandlerId
): ActivityPachinkoBoardSession {
  const movingGateX = PACHINKO_BOARD_WIDTH / 2;
  const movingGates = createPachinkoMovingGates(movingGateX);
  const middleMovingGate = movingGates[1];
  return {
    type: "pachinko-board",
    activityId: activityDefinition.id,
    handlerId,
    title: activityDefinition.label,
    taskLabel: activityDefinition.label,
    boardWidth: PACHINKO_BOARD_WIDTH,
    boardHeight: PACHINKO_BOARD_HEIGHT,
    phase: "ready",
    remainingBalls: PACHINKO_STARTING_BALLS,
    totalBalls: PACHINKO_STARTING_BALLS,
    activeBall: null,
    activeBalls: [],
    audioPulseCounter: 0,
    audioPulse: null,
    pins: createPachinkoPins(),
    movingGates,
    movingGatePins: middleMovingGate.pins,
    gatePassCount: 0,
    eventCharge: 0,
    eventLog: [],
    score: 0,
    lastSlotIndex: null,
    slotValues: PACHINKO_SLOT_VALUES,
    rewardQueue: [],
    wheelState: createIdlePachinkoWheelState(),
    fortuneCardCount: 0,
    fortuneCardsDrawn: 0,
    currentFortuneCard: null,
    fortuneCardHistory: [],
    flipperAngle: 0,
    flipperDirection: 1,
    movingGateX,
    movingGateDirection: 1,
    animationTickMs: PACHINKO_BOARD_DEFAULT_ANIMATION_TICK_MS,
    layoutRefreshElapsedMs: 0,
    layoutRefreshPeriodMs: PACHINKO_LAYOUT_REFRESH_PERIOD_MS,
    layoutVersion: 0,
    timeAdvanceCost: Math.max(0, activityDefinition.timeAdvanceCost ?? 0),
    ...(activityDefinition.outcome?.completedFlagKey == null
      ? {}
      : { completedFlagKey: activityDefinition.outcome.completedFlagKey }),
    ...(activityDefinition.outcome?.gradeVariableKey == null
      ? {}
      : { gradeVariableKey: activityDefinition.outcome.gradeVariableKey }),
    ...(activityDefinition.outcome?.scoreVariableKey == null
      ? {}
      : { scoreVariableKey: activityDefinition.outcome.scoreVariableKey }),
  };
}

export function advanceActivityQteMarker(state: GameState): GameState {
  const session = state.runtime.activitySession;
  if (session?.type === "pachinko-board") {
    return tickActivityPachinkoBoard(state).state;
  }

  if (session?.type === "fortune-board") {
    return tickActivityFortuneBoard(state).state;
  }

  if (session?.type !== "qte-bar") {
    return state;
  }

  const nextMarker = session.markerPercent + session.markerDirection * QTE_MARKER_STEP;
  const boundedMarker = Math.max(0, Math.min(100, nextMarker));
  const nextDirection: 1 | -1 =
    nextMarker >= 100 ? -1 : nextMarker <= 0 ? 1 : session.markerDirection;

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: {
        ...session,
        markerPercent: boundedMarker,
        markerDirection: nextDirection,
      },
    },
  };
}

export function stopActivityQte(
  state: GameState,
  activityDefinition: ActivityDefinition,
  characterDefinitions: CharacterDefinition[]
): ActivityQteCompletionResult {
  const session = state.runtime.activitySession;
  if (session?.type === "pachinko-board") {
    return playActivityPachinkoBoard(state, activityDefinition, characterDefinitions);
  }

  if (session?.type === "fortune-board") {
    return playActivityFortuneBoard(state, activityDefinition, characterDefinitions);
  }

  if (session?.type === "work-sequence") {
    return settleActivityQteCompletion({
      state,
      activityDefinition,
      characterDefinitions,
      session,
      nextScore: session.successes,
    });
  }

  if (session?.type !== "qte-bar" || session.activityId !== activityDefinition.id) {
    return {
      state,
      characterDefinitions,
    };
  }

  const hit =
    session.markerPercent >= session.targetStartPercent &&
    session.markerPercent <= session.targetStartPercent + session.targetWidthPercent;
  const nextSuccesses = session.successes + (hit ? 1 : 0);

  if (session.round < session.totalRounds) {
    const nextRound = session.round + 1;
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: {
            ...session,
            round: nextRound,
            successes: nextSuccesses,
            markerPercent: 0,
            markerDirection: 1,
            targetStartPercent: resolveTargetStartPercent(nextRound),
            targetWidthPercent: resolveTargetWidthPercent(
              nextRound,
              session.totalRounds
            ),
          },
        },
      },
      characterDefinitions,
    };
  }

  return settleActivityQteCompletion({
    state,
    activityDefinition,
    characterDefinitions,
    session,
    nextScore: nextSuccesses,
  });
}

export function playActivityQte(
  state: GameState,
  activityDefinition: ActivityDefinition,
  characterDefinitions: CharacterDefinition[]
): ActivityQteCompletionResult {
  const session = state.runtime.activitySession;
  if (session?.type === "pachinko-board") {
    return playActivityPachinkoBoard(state, activityDefinition, characterDefinitions);
  }

  if (session?.type === "fortune-board") {
    return playActivityFortuneBoard(state, activityDefinition, characterDefinitions);
  }

  return {
    state,
    characterDefinitions,
  };
}

export function tickActivityQte(
  state: GameState,
  activityDefinition: ActivityDefinition,
  characterDefinitions: CharacterDefinition[]
): ActivityQteCompletionResult {
  const session = state.runtime.activitySession;
  if (session?.type === "pachinko-board") {
    return tickActivityPachinkoBoard(state, activityDefinition, characterDefinitions);
  }

  if (session?.type === "fortune-board") {
    return tickActivityFortuneBoard(state, activityDefinition, characterDefinitions);
  }

  return {
    state,
    characterDefinitions,
  };
}

export function adjustActivityFortuneBoardWager(
  state: GameState,
  direction: -1 | 1
): GameState {
  const session = state.runtime.activitySession;
  if (session?.type !== "fortune-board" || session.phase !== "ready") {
    return state;
  }

  const nextWager = Math.max(
    1,
    Math.min(
      Math.min(FORTUNE_BOARD_STARTING_PIECES, session.remainingPieces),
      session.wager + direction
    )
  );

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: {
        ...session,
        wager: nextWager,
      },
    },
  };
}

export function setActivityPachinkoBoardAnimationTickMs(
  state: GameState,
  tickMs: number
): GameState {
  const session = state.runtime.activitySession;
  if (session?.type !== "pachinko-board") {
    return state;
  }

  const nextTickMs =
    Number.isFinite(tickMs) && tickMs > 0
      ? Math.max(16, Math.min(100, Math.round(tickMs)))
      : PACHINKO_BOARD_DEFAULT_ANIMATION_TICK_MS;

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: {
        ...session,
        animationTickMs: nextTickMs,
      },
    },
  };
}

export function setActivityFortuneBoardAnimationTickMs(
  state: GameState,
  tickMs: number
): GameState {
  const session = state.runtime.activitySession;
  if (session?.type !== "fortune-board") {
    return state;
  }

  const nextTickMs = clampFortuneBoardAnimationTickMs(tickMs);

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: {
        ...session,
        animationTickMs: nextTickMs,
      },
    },
  };
}

export function playActivityFortuneBoard(
  state: GameState,
  activityDefinition: ActivityDefinition,
  characterDefinitions: CharacterDefinition[]
): ActivityQteCompletionResult {
  const session = state.runtime.activitySession;
  if (session?.type !== "fortune-board" || session.activityId !== activityDefinition.id) {
    return {
      state,
      characterDefinitions,
    };
  }

  if (session.phase === "ready") {
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: {
            ...session,
            phase: "scanning",
            highlightedColumn: null,
            selectedColumn: null,
            pendingDropCount: 0,
            scanCellKeys: [],
            scanCellIndex: 0,
            highlightedCellKey: null,
            pickedCellKey: null,
            selectedCellKeys: [],
          },
        },
      },
      characterDefinitions,
    };
  }

  if (session.phase !== "scanning" || session.highlightedColumn == null) {
    return {
      state,
      characterDefinitions,
    };
  }

  const pendingDropCount = getAvailableFortuneBoardCellsInColumn(
    session,
    session.highlightedColumn
  ).length;

  return {
    state: {
      ...state,
      runtime: {
        ...state.runtime,
        activitySession: {
          ...session,
          phase: "column-flash",
          highlightedColumn: null,
          selectedColumn: session.highlightedColumn,
          flashTicks: FORTUNE_BOARD_FLASH_TICKS,
          pendingDropCount: Math.min(session.wager, pendingDropCount),
          scanCellKeys: [],
          scanCellIndex: 0,
          highlightedCellKey: null,
          pickedCellKey: null,
        },
      },
    },
    characterDefinitions,
  };
}

export function playActivityPachinkoBoard(
  state: GameState,
  activityDefinition: ActivityDefinition,
  characterDefinitions: CharacterDefinition[]
): ActivityQteCompletionResult {
  const session = state.runtime.activitySession;
  if (session?.type !== "pachinko-board" || session.activityId !== activityDefinition.id) {
    return {
      state,
      characterDefinitions,
    };
  }

  if (session.phase === "drawing-card") {
    if (session.fortuneCardCount <= 0) {
      return {
        state: {
          ...state,
          runtime: {
            ...state.runtime,
            activitySession: {
              ...session,
              phase: "settling",
            },
          },
        },
        characterDefinitions,
      };
    }

    const currentFortuneCard = drawPachinkoFortuneCard(session);
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: {
            ...session,
            phase: "card-result",
            fortuneCardCount: Math.max(0, session.fortuneCardCount - 1),
            fortuneCardsDrawn: session.fortuneCardsDrawn + 1,
            currentFortuneCard,
            fortuneCardHistory: [...session.fortuneCardHistory, currentFortuneCard],
          },
        },
      },
      characterDefinitions,
    };
  }

  if (session.phase === "card-result") {
    if (
      session.currentFortuneCard?.rank === "encounter" &&
      session.currentFortuneCard.resolved !== true
    ) {
      return {
        state,
        characterDefinitions,
      };
    }

    return {
      state: continueActivityPachinkoAfterFortuneCard(state),
      characterDefinitions,
    };
  }

  if (session.phase === "settling") {
    const resultState = {
      ...state,
      runtime: {
        ...state.runtime,
        activitySession: createPachinkoBoardResultSession(session),
      },
    };

    return settleActivityQteCompletion({
      state: resultState,
      activityDefinition,
      characterDefinitions,
      session,
      nextScore: session.score,
    });
  }

  if (
    (session.phase !== "ready" &&
      session.phase !== "dropping" &&
      session.phase !== "rewarding") ||
    session.remainingBalls <= 0
  ) {
    return {
      state,
      characterDefinitions,
    };
  }

  const activeBalls = getPachinkoActiveBalls(session);
  const launchAngle = (session.flipperAngle * Math.PI) / 180;
  const activeBall: ActivityPachinkoBoardBall = {
    x: session.boardWidth / 2,
    y: 36,
    previousX: session.boardWidth / 2,
    previousY: 36,
    vx: Math.sin(launchAngle) * 4.8 + session.flipperDirection * 0.9,
    vy: 2.2 + Math.abs(Math.cos(launchAngle)) * 0.8,
    radius: PACHINKO_BALL_RADIUS,
  };

  return {
    state: {
      ...state,
      runtime: {
        ...state.runtime,
        activitySession: {
          ...session,
          phase: "dropping",
          remainingBalls: Math.max(0, session.remainingBalls - 1),
          activeBall,
          activeBalls: [...activeBalls, activeBall],
          lastSlotIndex: null,
        },
      },
    },
    characterDefinitions,
  };
}

export function tickActivityPachinkoBoard(
  state: GameState,
  activityDefinition?: ActivityDefinition,
  characterDefinitions: CharacterDefinition[] = []
): ActivityQteCompletionResult {
  const session = state.runtime.activitySession;
  if (session?.type !== "pachinko-board") {
    return {
      state,
      characterDefinitions,
    };
  }

  const animatedSession = advancePachinkoBoardMechanisms(session);
  if (
    getPachinkoActiveBalls(animatedSession).length === 0
  ) {
    const rewardSession = advancePachinkoRewardFlow(animatedSession);
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: rewardSession,
        },
      },
      characterDefinitions,
    };
  }

  const nextSession = advancePachinkoRewardFlow(stepPachinkoBall(animatedSession));
  if (nextSession.phase === "settling") {
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: nextSession,
        },
      },
      characterDefinitions,
    };
  }

  return {
    state: {
      ...state,
      runtime: {
        ...state.runtime,
        activitySession: nextSession,
      },
    },
    characterDefinitions,
  };
}

export function tickActivityFortuneBoard(
  state: GameState,
  activityDefinition?: ActivityDefinition,
  characterDefinitions: CharacterDefinition[] = []
): ActivityQteCompletionResult {
  const session = state.runtime.activitySession;
  if (session?.type !== "fortune-board") {
    return {
      state,
      characterDefinitions,
    };
  }

  if (session.phase === "final-flash") {
    if (session.flashTicks > 1) {
      return {
        state: {
          ...state,
          runtime: {
            ...state.runtime,
            activitySession: {
              ...session,
              flashTicks: session.flashTicks - 1,
            },
          },
        },
        characterDefinitions,
      };
    }

    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: startFortuneBoardFinalReroll(session),
        },
      },
      characterDefinitions,
    };
  }

  if (session.phase === "final-reroll") {
    if (session.flashTicks > 1) {
      return {
        state: {
          ...state,
          runtime: {
            ...state.runtime,
            activitySession: {
              ...session,
              flashTicks: session.flashTicks - 1,
            },
          },
        },
        characterDefinitions,
      };
    }

    return settleFortuneBoardCompletion(
      state,
      activityDefinition,
      characterDefinitions,
      session
    );
  }

  if (session.phase === "scanning") {
    const nextHighlightedColumn = getNextAvailableFortuneBoardColumn(
      session,
      session.highlightedColumn ?? -1
    );

    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: {
            ...session,
            highlightedColumn: nextHighlightedColumn,
          },
        },
      },
      characterDefinitions,
    };
  }

  if (session.phase === "column-flash" && session.selectedColumn != null) {
    if (session.flashTicks > 1) {
      return {
        state: {
          ...state,
          runtime: {
            ...state.runtime,
            activitySession: {
              ...session,
              flashTicks: session.flashTicks - 1,
            },
          },
        },
        characterDefinitions,
      };
    }

    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: startFortuneBoardCellScan(session),
        },
      },
      characterDefinitions,
    };
  }

  if (session.phase === "cell-scan" && session.selectedColumn != null) {
    if (session.scanCellIndex < session.scanCellKeys.length - 1) {
      const nextScanCellIndex = session.scanCellIndex + 1;
      return {
        state: {
          ...state,
          runtime: {
            ...state.runtime,
            activitySession: {
              ...session,
              scanCellIndex: nextScanCellIndex,
              highlightedCellKey: session.scanCellKeys[nextScanCellIndex] ?? null,
            },
          },
        },
        characterDefinitions,
      };
    }

    const pickedCellKey =
      session.scanCellKeys[session.scanCellKeys.length - 1] ?? null;
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: {
            ...session,
            phase: "cell-pick",
            flashTicks: FORTUNE_BOARD_CELL_PICK_FLASH_TICKS,
            highlightedCellKey: null,
            pickedCellKey,
          },
        },
      },
      characterDefinitions,
    };
  }

  if (session.phase !== "cell-pick" || session.pickedCellKey == null) {
    return {
      state,
      characterDefinitions,
    };
  }

  if (session.flashTicks > 1) {
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: {
            ...session,
            flashTicks: session.flashTicks - 1,
          },
        },
      },
      characterDefinitions,
    };
  }

  const settledSession = settleFortuneBoardCell(session, session.pickedCellKey);
  if (
    settledSession.remainingPieces <= 0 ||
    !hasAvailableFortuneBoardCells(settledSession)
  ) {
    return {
      state: {
        ...state,
        runtime: {
          ...state.runtime,
          activitySession: startFortuneBoardFinalFlash(settledSession),
        },
      },
      characterDefinitions,
    };
  }

  return {
    state: {
      ...state,
      runtime: {
        ...state.runtime,
        activitySession: {
          ...advanceFortuneBoardAfterPick(settledSession),
        },
      },
    },
    characterDefinitions,
  };
}

function settleFortuneBoardCompletion(
  state: GameState,
  activityDefinition: ActivityDefinition | undefined,
  characterDefinitions: CharacterDefinition[],
  session: ActivityFortuneBoardSession
): ActivityQteCompletionResult {
  const resultState = {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: createFortuneBoardResultSession(session),
    },
  };

  return activityDefinition == null
    ? {
        state: resultState,
        characterDefinitions,
      }
    : settleActivityQteCompletion({
        state: resultState,
        activityDefinition,
        characterDefinitions,
        session,
        nextScore: session.score,
      });
}

export function chooseActivityQteCommand(
  state: GameState,
  activityDefinition: ActivityDefinition,
  characterDefinitions: CharacterDefinition[],
  commandId: string
): ActivityQteCompletionResult {
  const direction = commandId === "wager-minus" ? -1 : commandId === "wager-plus" ? 1 : 0;
  if (direction !== 0) {
    return {
      state: adjustActivityFortuneBoardWager(state, direction),
      characterDefinitions,
    };
  }

  if (commandId.startsWith("speed:")) {
    if (state.runtime.activitySession?.type === "pachinko-board") {
      return {
        state: setActivityPachinkoBoardAnimationTickMs(
          state,
          Number(commandId.slice("speed:".length))
        ),
        characterDefinitions,
      };
    }

    return {
      state: setActivityFortuneBoardAnimationTickMs(
        state,
        Number(commandId.slice("speed:".length))
      ),
      characterDefinitions,
    };
  }

  if (state.runtime.activitySession?.type === "pachinko-board") {
    return playActivityPachinkoBoard(state, activityDefinition, characterDefinitions);
  }

  return playActivityFortuneBoard(state, activityDefinition, characterDefinitions);
}

export function clearActivityResult(state: GameState): GameState {
  if (state.runtime.activitySession?.type !== "result") {
    return state;
  }

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: null,
    },
  };
}

function settleActivityQteCompletion(input: {
  state: GameState;
  activityDefinition: ActivityDefinition;
  characterDefinitions: CharacterDefinition[];
  session: Pick<
    | ActivityQteSession
    | ActivityWorkSequenceSession
    | ActivityFortuneBoardSession
    | ActivityPachinkoBoardSession,
    | "handlerId"
    | "timeAdvanceCost"
    | "completedFlagKey"
    | "gradeVariableKey"
    | "scoreVariableKey"
  >;
  nextScore: number;
}): ActivityQteCompletionResult {
  const grade = input.nextScore > 0 ? "success" : "failed";
  const effectResult =
    grade === "success"
      ? applyEffects(input.state, input.activityDefinition.outcome?.effects ?? [], {
          characterDefinitions: input.characterDefinitions,
        })
      : { state: input.state, characterDefinitions: input.characterDefinitions };
  const nextState =
    input.session.timeAdvanceCost <= 0
      ? effectResult.state
      : advanceGameStateTimeSegments(effectResult.state, input.session.timeAdvanceCost);
  const existingResultSession =
    nextState.runtime.activitySession?.type === "result"
      ? nextState.runtime.activitySession
      : null;

  return {
    state: {
      ...nextState,
      runtime: {
        ...nextState.runtime,
        flags: {
          ...nextState.runtime.flags,
          [`flag.${input.activityDefinition.id}.completed`]: true,
          ...(input.session.completedFlagKey == null
            ? {}
            : { [input.session.completedFlagKey]: true }),
        },
        variables: {
          ...nextState.runtime.variables,
          "var.activity.last_id": input.activityDefinition.id,
          "var.activity.last_handler": input.session.handlerId,
          [`var.${input.activityDefinition.id}.last_grade`]: grade,
          [`var.${input.activityDefinition.id}.last_score`]: input.nextScore,
          ...(input.session.gradeVariableKey == null
            ? {}
            : { [input.session.gradeVariableKey]: grade }),
          ...(input.session.scoreVariableKey == null
            ? {}
            : { [input.session.scoreVariableKey]: input.nextScore }),
        },
        activitySession: {
          type: "result",
          activityId: input.activityDefinition.id,
          title: input.activityDefinition.label,
          grade: existingResultSession?.grade ?? (grade === "success" ? "成功" : "失手"),
          score: input.nextScore,
          rewardLines:
            existingResultSession?.rewardLines ??
            (grade === "success"
              ? [`棋局结算：贡献 ${input.nextScore}`]
              : ["棋局未得贡献，本次不会写入成功收益。"]),
        },
      },
    },
    characterDefinitions: effectResult.characterDefinitions,
  };
}

function createPachinkoPins(): ActivityPachinkoBoardPin[] {
  const pins: ActivityPachinkoBoardPin[] = [];
  const row6X = createPachinkoRowWithEqualWallGaps(6);
  const row7X = createPachinkoGapCenterRow(row6X);
  const rows: Array<{ y: number; xs: number[] }> = [
    { y: PACHINKO_FIRST_PIN_ROW_Y, xs: row6X },
    { y: PACHINKO_FIRST_PIN_ROW_Y + PACHINKO_PIN_ROW_SPACING, xs: row6X },
    { y: 845, xs: row7X },
    { y: 930, xs: row6X },
    { y: PACHINKO_BOTTOM_WALL_START_Y, xs: row6X },
  ];

  rows.forEach((row, rowIndex) => {
    row.xs.forEach((x, columnIndex) => {
      pins.push({
        id: `pin-${rowIndex}-${columnIndex}`,
        x,
        y: row.y,
        radius: PACHINKO_PIN_RADIUS,
      });
    });
  });

  return pins;
}

function getPachinkoActiveBalls(
  session: ActivityPachinkoBoardSession
): ActivityPachinkoBoardBall[] {
  return session.activeBalls.length > 0
    ? session.activeBalls
    : session.activeBall == null
      ? []
      : [session.activeBall];
}

function createIdlePachinkoWheelState(): ActivityPachinkoBoardWheelState {
  return {
    phase: "idle",
    elapsedMs: 0,
    rotationDegrees: 0,
    targetRotationDegrees: 0,
    selectedIndex: null,
    selectedReward: null,
    flashCount: 0,
    segments: PACHINKO_WHEEL_SEGMENTS,
  };
}

function hasPendingPachinkoReward(session: ActivityPachinkoBoardSession): boolean {
  return (
    session.fortuneCardCount > 0 ||
    session.currentFortuneCard != null ||
    session.rewardQueue.length > 0 ||
    session.wheelState.phase === "spinning" ||
    session.wheelState.phase === "slowing" ||
    session.wheelState.phase === "flashing" ||
    session.wheelState.phase === "holding"
  );
}

function hasPendingPachinkoFortuneCard(session: ActivityPachinkoBoardSession): boolean {
  return session.fortuneCardCount > 0 || session.currentFortuneCard != null;
}

function createPachinkoRowWithEqualWallGaps(count: number): number[] {
  const spacing = PACHINKO_BOARD_WIDTH / (count + 1);
  return Array.from({ length: count }, (_, index) => spacing * (index + 1));
}

function createPachinkoGapCenterRow(anchorRow: number[]): number[] {
  const spacing = PACHINKO_BOARD_WIDTH / (anchorRow.length + 1);
  return Array.from(
    { length: anchorRow.length + 1 },
    (_, index) => spacing * index + spacing / 2
  );
}

function createPachinkoFlipperSegments(
  session: ActivityPachinkoBoardSession
): [PachinkoFlipperSegment, PachinkoFlipperSegment] {
  const leftRootX = session.boardWidth / 2 - PACHINKO_FLIPPER_ROOT_GAP / 2;
  const rightRootX = session.boardWidth / 2 + PACHINKO_FLIPPER_ROOT_GAP / 2;
  return [
    createPachinkoFlipperSegment(leftRootX, 10 + session.flipperAngle),
    createPachinkoFlipperSegment(rightRootX, -10 + session.flipperAngle),
  ];
}

function createPachinkoFlipperSegment(
  rootX: number,
  angleDegrees: number
): PachinkoFlipperSegment {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  return {
    rootX,
    rootY: PACHINKO_FLIPPER_ROOT_Y,
    tipX: rootX - Math.sin(angleRadians) * PACHINKO_FLIPPER_LENGTH,
    tipY: PACHINKO_FLIPPER_ROOT_Y + Math.cos(angleRadians) * PACHINKO_FLIPPER_LENGTH,
    angleRadians,
    radius: PACHINKO_FLIPPER_RADIUS,
  };
}

function createPachinkoMovingGates(
  centerX: number
): [ActivityPachinkoMovingGate, ActivityPachinkoMovingGate] {
  return [
    createPachinkoMovingGate({
      id: "top-moving-gate",
      label: "+2分",
      centerX,
      y: PACHINKO_TOP_MOVING_GATE_Y,
      direction: 1,
      step: PACHINKO_TOP_MOVING_GATE_STEP,
      reward: { kind: "score", amount: 2 },
    }),
    createPachinkoMovingGate({
      id: "moving-gate",
      label: "+1球",
      centerX,
      y: PACHINKO_MOVING_GATE_Y,
      direction: 1,
      step: PACHINKO_MOVING_GATE_STEP,
      reward: { kind: "extra-ball", amount: 1 },
    }),
  ];
}

function createPachinkoMovingGate(input: {
  id: string;
  label: string;
  centerX: number;
  y: number;
  direction: 1 | -1;
  step: number;
  reward: ActivityPachinkoMovingGate["reward"];
}): ActivityPachinkoMovingGate {
  const pins: [ActivityPachinkoBoardPin, ActivityPachinkoBoardPin] = [
    {
      id: `${input.id}-left`,
      x: input.centerX - PACHINKO_MOVING_GATE_GAP / 2,
      y: input.y,
      radius: PACHINKO_PIN_RADIUS,
      moving: true,
    },
    {
      id: `${input.id}-right`,
      x: input.centerX + PACHINKO_MOVING_GATE_GAP / 2,
      y: input.y,
      radius: PACHINKO_PIN_RADIUS,
      moving: true,
    },
  ];
  return {
    id: input.id,
    label: input.label,
    x: input.centerX,
    y: input.y,
    direction: input.direction,
    step: input.step,
    reward: input.reward,
    pins,
  };
}

function getPachinkoMovingGates(
  session: ActivityPachinkoBoardSession
): ActivityPachinkoMovingGate[] {
  if ((session.movingGates?.length ?? 0) > 0) {
    return session.movingGates;
  }

  return [
    createPachinkoMovingGate({
      id: "top-moving-gate",
      label: "+2分",
      centerX: session.movingGateX,
      y: PACHINKO_TOP_MOVING_GATE_Y,
      direction: session.movingGateDirection,
      step: PACHINKO_TOP_MOVING_GATE_STEP,
      reward: { kind: "score", amount: 2 },
    }),
    createPachinkoMovingGate({
      id: "moving-gate",
      label: "+1球",
      centerX: session.movingGateX,
      y: PACHINKO_MOVING_GATE_Y,
      direction: session.movingGateDirection,
      step: PACHINKO_MOVING_GATE_STEP,
      reward: { kind: "extra-ball", amount: 1 },
    }),
  ];
}

function advancePachinkoMovingGate(
  gate: ActivityPachinkoMovingGate
): ActivityPachinkoMovingGate {
  const nextX = gate.x + gate.direction * gate.step;
  const gateHitMax = nextX >= PACHINKO_MOVING_GATE_MAX_X;
  const gateHitMin = nextX <= PACHINKO_MOVING_GATE_MIN_X;
  const boundedX = Math.max(
    PACHINKO_MOVING_GATE_MIN_X,
    Math.min(PACHINKO_MOVING_GATE_MAX_X, nextX)
  );
  const nextDirection = gateHitMax ? -1 : gateHitMin ? 1 : gate.direction;
  return createPachinkoMovingGate({
    id: gate.id,
    label: gate.label,
    centerX: boundedX,
    y: gate.y,
    direction: nextDirection,
    step: gate.step,
    reward: gate.reward,
  });
}

function advancePachinkoBoardMechanisms(
  session: ActivityPachinkoBoardSession
): ActivityPachinkoBoardSession {
  const nextFlipperAngle =
    session.flipperAngle + session.flipperDirection * PACHINKO_FLIPPER_STEP;
  const flipperHitMax = nextFlipperAngle >= PACHINKO_FLIPPER_MAX_ANGLE;
  const flipperHitMin = nextFlipperAngle <= PACHINKO_FLIPPER_MIN_ANGLE;
  const boundedFlipperAngle = Math.max(
    PACHINKO_FLIPPER_MIN_ANGLE,
    Math.min(PACHINKO_FLIPPER_MAX_ANGLE, nextFlipperAngle)
  );
  const movingGates = getPachinkoMovingGates(session).map(advancePachinkoMovingGate);
  const primaryMovingGate = movingGates[1] ?? movingGates[0];
  return {
    ...session,
    audioPulse: null,
    flipperAngle: boundedFlipperAngle,
    flipperDirection: flipperHitMax ? -1 : flipperHitMin ? 1 : session.flipperDirection,
    movingGates,
    movingGateX: primaryMovingGate?.x ?? session.movingGateX,
    movingGateDirection: primaryMovingGate?.direction ?? session.movingGateDirection,
    movingGatePins: primaryMovingGate?.pins ?? session.movingGatePins,
    layoutRefreshElapsedMs: session.layoutRefreshElapsedMs + session.animationTickMs,
  };
}

function stepPachinkoBall(
  session: ActivityPachinkoBoardSession
): ActivityPachinkoBoardSession {
  const activeBalls = getPachinkoActiveBalls(session);
  if (activeBalls.length === 0) {
    return session;
  }

  let nextSession: ActivityPachinkoBoardSession = {
    ...session,
    activeBall: null,
    activeBalls: [],
  };
  const nextActiveBalls: ActivityPachinkoBoardBall[] = [];
  let tickCollisionCount = 0;
  let tickSettleCount = 0;

  activeBalls.forEach((activeBall) => {
    const result = stepSinglePachinkoBall(nextSession, activeBall);
    nextSession = result.session;
    tickCollisionCount += result.collisionCount;
    tickSettleCount += result.settleCount;
    if (result.ball != null) {
      nextActiveBalls.push(result.ball);
    }
  });

  const phase =
    nextActiveBalls.length > 0
      ? "dropping"
      : hasPendingPachinkoReward(nextSession)
        ? "rewarding"
        : nextSession.remainingBalls > 0
          ? "ready"
          : "settling";
  const hasAudioPulse = tickCollisionCount > 0 || tickSettleCount > 0;
  const nextAudioPulseToken = hasAudioPulse
    ? nextSession.audioPulseCounter + 1
    : nextSession.audioPulseCounter;

  return {
    ...nextSession,
    phase,
    activeBall: nextActiveBalls[nextActiveBalls.length - 1] ?? null,
    activeBalls: nextActiveBalls,
    audioPulseCounter: nextAudioPulseToken,
    audioPulse: hasAudioPulse
      ? {
          token: nextAudioPulseToken,
          collisionCount: tickCollisionCount,
          settleCount: tickSettleCount,
        }
      : null,
  };
}

function stepSinglePachinkoBall(
  session: ActivityPachinkoBoardSession,
  activeBall: ActivityPachinkoBoardBall
): {
  session: ActivityPachinkoBoardSession;
  ball: ActivityPachinkoBoardBall | null;
  collisionCount: number;
  settleCount: number;
} {
  let ball: ActivityPachinkoBoardBall = {
    ...activeBall,
    previousX: activeBall.x,
    previousY: activeBall.y,
    vx: activeBall.vx * PACHINKO_DAMPING,
    vy: activeBall.vy * PACHINKO_DAMPING + PACHINKO_GRAVITY,
  };

  const flipperSegments = createPachinkoFlipperSegments(session);
  const movingGates = getPachinkoMovingGates(session);
  const collisionPins = [
    ...session.pins,
    ...movingGates.flatMap((movingGate) => movingGate.pins),
  ];
  const bottomWallXs = createPachinkoRowWithEqualWallGaps(6);
  const tickPreviousX = ball.previousX;
  const tickPreviousY = ball.previousY;
  let collisionCount = 0;

  for (let substep = 0; substep < PACHINKO_PHYSICS_SUBSTEPS; substep += 1) {
    const substepVx = ball.vx / PACHINKO_PHYSICS_SUBSTEPS;
    const substepVy = ball.vy / PACHINKO_PHYSICS_SUBSTEPS;
    ball = {
      ...ball,
      previousX: ball.x,
      previousY: ball.y,
      x: ball.x + substepVx,
      y: ball.y + substepVy,
    };

    const sideWallCollision = countPachinkoCollision(
      ball,
      collisionCount,
      (candidate) => collidePachinkoBallWithSideWalls(candidate, session.boardWidth)
    );
    collisionCount = sideWallCollision.collisionCount;
    ball = sideWallCollision.ball;
    flipperSegments.forEach((flipper) => {
      const collisionResult = countPachinkoCollision(
        ball,
        collisionCount,
        (candidate) =>
          collidePachinkoBallWithFlipper(candidate, flipper, session.flipperDirection)
      );
      collisionCount = collisionResult.collisionCount;
      ball = collisionResult.ball;
    });
    collisionPins.forEach((pin) => {
      const collisionResult = countPachinkoCollision(ball, collisionCount, (candidate) =>
        collidePachinkoBallWithPin(candidate, pin)
      );
      collisionCount = collisionResult.collisionCount;
      ball = collisionResult.ball;
    });
    bottomWallXs.forEach((wallX) => {
      const collisionResult = countPachinkoCollision(ball, collisionCount, (candidate) =>
        collidePachinkoBallWithBottomWall(candidate, wallX)
      );
      collisionCount = collisionResult.collisionCount;
      ball = collisionResult.ball;
    });
  }

  ball = {
    ...ball,
    previousX: tickPreviousX,
    previousY: tickPreviousY,
  };

  const passedGate = movingGates.find((movingGate) =>
    didPachinkoBallPassMovingGate(ball, movingGate)
  );
  const scoredSession =
    passedGate == null ? session : scorePachinkoGatePass(session, passedGate);

  if (ball.y + ball.radius >= session.boardHeight) {
    return {
      session: settlePachinkoBall(scoredSession, ball),
      ball: null,
      collisionCount,
      settleCount: 1,
    };
  }

  return {
    session: scoredSession,
    ball,
    collisionCount,
    settleCount: 0,
  };
}

function countPachinkoCollision(
  ball: ActivityPachinkoBoardBall,
  collisionCount: number,
  applyCollision: (ball: ActivityPachinkoBoardBall) => ActivityPachinkoBoardBall
): {
  ball: ActivityPachinkoBoardBall;
  collisionCount: number;
} {
  const nextBall = applyCollision(ball);
  return {
    ball: nextBall,
    collisionCount:
      collisionCount + (didPachinkoCollisionChangeVelocity(ball, nextBall) ? 1 : 0),
  };
}

function didPachinkoCollisionChangeVelocity(
  previousBall: ActivityPachinkoBoardBall,
  nextBall: ActivityPachinkoBoardBall
): boolean {
  return (
    Math.abs(previousBall.vx - nextBall.vx) > 0.001 ||
    Math.abs(previousBall.vy - nextBall.vy) > 0.001
  );
}

function collidePachinkoBallWithSideWalls(
  ball: ActivityPachinkoBoardBall,
  boardWidth: number
): ActivityPachinkoBoardBall {
  if (ball.x - ball.radius < 0) {
    return { ...ball, x: ball.radius, vx: Math.abs(ball.vx) * PACHINKO_BOUNCE };
  }

  if (ball.x + ball.radius > boardWidth) {
    return {
      ...ball,
      x: boardWidth - ball.radius,
      vx: -Math.abs(ball.vx) * PACHINKO_BOUNCE,
    };
  }

  return ball;
}

function collidePachinkoBallWithPin(
  ball: ActivityPachinkoBoardBall,
  pin: ActivityPachinkoBoardPin
): ActivityPachinkoBoardBall {
  const dx = ball.x - pin.x;
  const dy = ball.y - pin.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = ball.radius + pin.radius;
  if (distance <= 0 || distance >= minDistance) {
    return ball;
  }

  const centeredHit = Math.abs(dx) < 0.001;
  const nx = centeredHit ? getPachinkoPinNudgeDirection(pin) * 0.34 : dx / distance;
  const ny = centeredHit
    ? Math.sign(dy || 1) * Math.sqrt(1 - nx * nx)
    : dy / distance;
  const overlap = minDistance - distance;
  const dot = ball.vx * nx + ball.vy * ny;
  const isEnteringPin = dot < 0;

  return {
    ...ball,
    x: ball.x + nx * overlap,
    y: ball.y + ny * overlap,
    vx: isEnteringPin ? (ball.vx - 2 * dot * nx) * PACHINKO_BOUNCE : ball.vx,
    vy: isEnteringPin ? (ball.vy - 2 * dot * ny) * PACHINKO_BOUNCE : ball.vy,
  };
}

function collidePachinkoBallWithFlipper(
  ball: ActivityPachinkoBoardBall,
  flipper: PachinkoFlipperSegment,
  flipperDirection: 1 | -1
): ActivityPachinkoBoardBall {
  const segmentX = flipper.tipX - flipper.rootX;
  const segmentY = flipper.tipY - flipper.rootY;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
  if (segmentLengthSquared <= 0) {
    return ball;
  }

  const projection = Math.max(
    0,
    Math.min(
      1,
      ((ball.x - flipper.rootX) * segmentX +
        (ball.y - flipper.rootY) * segmentY) /
        segmentLengthSquared
    )
  );
  const closestX = flipper.rootX + segmentX * projection;
  const closestY = flipper.rootY + segmentY * projection;
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  const distance = Math.hypot(dx, dy);
  const minDistance = ball.radius + flipper.radius;
  if (distance >= minDistance) {
    return ball;
  }

  const perpendicularLength = Math.hypot(segmentX, segmentY);
  const nx = distance <= 0 ? -segmentY / perpendicularLength : dx / distance;
  const ny = distance <= 0 ? segmentX / perpendicularLength : dy / distance;
  const overlap = minDistance - distance;
  const dot = ball.vx * nx + ball.vy * ny;
  const tangentX = -Math.cos(flipper.angleRadians) * flipperDirection;
  const tangentY = -Math.sin(flipper.angleRadians) * flipperDirection;
  const isEnteringFlipper = dot < 0;
  const reflectedVelocity =
    isEnteringFlipper
      ? {
          vx: (ball.vx - 2 * dot * nx) * PACHINKO_BOUNCE,
          vy: (ball.vy - 2 * dot * ny) * PACHINKO_BOUNCE,
        }
      : { vx: ball.vx, vy: ball.vy };

  return {
    ...ball,
    x: ball.x + nx * overlap,
    y: ball.y + ny * overlap,
    vx:
      reflectedVelocity.vx +
      (isEnteringFlipper ? tangentX * PACHINKO_FLIPPER_KICK : 0),
    vy:
      reflectedVelocity.vy +
      (isEnteringFlipper ? tangentY * PACHINKO_FLIPPER_KICK : 0),
  };
}

function collidePachinkoBallWithBottomWall(
  ball: ActivityPachinkoBoardBall,
  wallX: number
): ActivityPachinkoBoardBall {
  if (ball.y + ball.radius < PACHINKO_BOTTOM_WALL_START_Y) {
    return ball;
  }

  const halfWallWidth = PACHINKO_PIN_RADIUS;
  const minDistance = ball.radius + halfWallWidth;
  if (Math.abs(ball.x - wallX) >= minDistance) {
    return ball;
  }

  if (
    ball.previousY + ball.radius <= PACHINKO_BOTTOM_WALL_START_Y &&
    ball.y < PACHINKO_BOTTOM_WALL_START_Y + ball.radius
  ) {
    return {
      ...ball,
      y: PACHINKO_BOTTOM_WALL_START_Y - ball.radius,
      vy: -Math.abs(ball.vy) * PACHINKO_BOUNCE,
    };
  }

  const cameFromLeft = ball.previousX <= wallX - halfWallWidth;
  const cameFromRight = ball.previousX >= wallX + halfWallWidth;
  const pushLeft = cameFromLeft || (!cameFromRight && ball.x < wallX);
  return pushLeft
    ? {
        ...ball,
        x: wallX - minDistance,
        vx: -Math.abs(ball.vx) * PACHINKO_BOUNCE,
      }
    : {
        ...ball,
        x: wallX + minDistance,
        vx: Math.abs(ball.vx) * PACHINKO_BOUNCE,
      };
}

function getPachinkoPinNudgeDirection(pin: ActivityPachinkoBoardPin): 1 | -1 {
  return hashToPercent(pin.id) % 2 === 0 ? 1 : -1;
}

function didPachinkoBallPassMovingGate(
  ball: ActivityPachinkoBoardBall,
  gate: ActivityPachinkoMovingGate
): boolean {
  const [leftPin, rightPin] = gate.pins;
  return (
    ball.previousY < gate.y &&
    ball.y >= gate.y &&
    ball.x > leftPin.x + leftPin.radius &&
    ball.x < rightPin.x - rightPin.radius
  );
}

function scorePachinkoGatePass(
  session: ActivityPachinkoBoardSession,
  gate: ActivityPachinkoMovingGate
): ActivityPachinkoBoardSession {
  const rewardState =
    gate.reward.kind === "extra-ball"
      ? { remainingBalls: session.remainingBalls + gate.reward.amount }
      : { score: session.score + gate.reward.amount };
  return {
    ...session,
    ...rewardState,
    gatePassCount: session.gatePassCount + 1,
    eventCharge: 0,
    eventLog: [
      ...session.eventLog,
      {
        roll: 0,
        kind: "timing",
        label: `穿门 ${gate.label}`,
      },
    ],
  };
}

function createPachinkoEventLogEntry(
  session: ActivityPachinkoBoardSession,
  gatePassCount: number
): ActivityPachinkoBoardEventLogEntry {
  const roll = hashToPercent(
    `${session.activityId}:${gatePassCount}:${session.score}:${session.eventLog.length}`
  );
  const kind: ActivityPachinkoBoardEventKind =
    roll < 15
      ? "great"
      : roll < 45
        ? "good"
        : roll < 85
          ? "plain"
          : roll < 95
            ? "minor-bad"
            : "timing";
  return {
    roll,
    kind,
    label: getPachinkoEventLabel(kind),
  };
}

function hashToPercent(source: string): number {
  let hash = 2166136261;
  for (const char of source) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 100;
}

function getPachinkoEventLabel(kind: ActivityPachinkoBoardEventKind): string {
  switch (kind) {
    case "great":
      return "大吉";
    case "good":
      return "中吉";
    case "minor-bad":
      return "小凶";
    case "timing":
      return "天时";
    default:
      return "平";
  }
}

function settlePachinkoBall(
  session: ActivityPachinkoBoardSession,
  ball: ActivityPachinkoBoardBall
): ActivityPachinkoBoardSession {
  const slotWidth = session.boardWidth / session.slotValues.length;
  const slotIndex = Math.max(
    0,
    Math.min(session.slotValues.length - 1, Math.floor(ball.x / slotWidth))
  );
  const slotValue = session.slotValues[slotIndex] ?? 0;
  const scoreGain = slotValue === "fortune-card" ? 0 : slotValue;
  const fortuneCardCount =
    slotValue === "fortune-card"
      ? session.fortuneCardCount + 1
      : session.fortuneCardCount;
  const hasReward =
    fortuneCardCount > 0 ||
    session.currentFortuneCard != null ||
    session.wheelState.phase !== "idle";

  return {
    ...session,
    phase:
      session.remainingBalls > 0
        ? hasReward && session.wheelState.phase !== "idle"
          ? "rewarding"
          : "ready"
        : fortuneCardCount > 0
          ? "drawing-card"
          : hasReward
            ? "rewarding"
            : "settling",
    fortuneCardCount,
    activeBall: null,
    score: session.score + scoreGain,
    lastSlotIndex: slotIndex,
  };
}

function advancePachinkoRewardFlow(
  session: ActivityPachinkoBoardSession
): ActivityPachinkoBoardSession {
  if (session.phase === "drawing-card" || session.phase === "card-result") {
    return session;
  }

  if (
    session.remainingBalls <= 0 &&
    session.wheelState.phase === "idle" &&
    session.fortuneCardCount > 0
  ) {
    return {
      ...session,
      phase: "drawing-card",
    };
  }

  if (session.wheelState.phase === "idle") {
    if (session.rewardQueue.length === 0) {
      return session.phase === "rewarding"
        ? {
            ...session,
            phase:
              session.remainingBalls > 0
                ? "ready"
                : session.fortuneCardCount > 0
                  ? "drawing-card"
                  : "settling",
          }
        : session;
    }

    return startNextPachinkoWheelReward(session);
  }

  if (session.wheelState.phase === "settled") {
    if (session.rewardQueue.length > 0) {
      return startNextPachinkoWheelReward({
        ...session,
        wheelState: {
          ...session.wheelState,
          phase: "idle",
          elapsedMs: 0,
          selectedIndex: null,
          selectedReward: null,
          flashCount: 0,
        },
      });
    }

    return session.phase === "rewarding"
      ? {
          ...session,
          phase:
            session.remainingBalls > 0
              ? "ready"
              : session.fortuneCardCount > 0
                ? "drawing-card"
                : "settling",
        }
      : session;
  }

  const elapsedMs = session.wheelState.elapsedMs + session.animationTickMs;
  if (session.wheelState.phase === "spinning") {
    if (elapsedMs < PACHINKO_WHEEL_SPIN_MS) {
      return {
        ...session,
        phase: "rewarding",
        wheelState: {
          ...session.wheelState,
          elapsedMs,
          rotationDegrees: session.wheelState.rotationDegrees + 22,
        },
      };
    }

    return {
      ...session,
      phase: "rewarding",
      wheelState: {
        ...session.wheelState,
        phase: "slowing",
        elapsedMs: 0,
      },
    };
  }

  if (session.wheelState.phase === "slowing") {
    const progress = Math.min(1, elapsedMs / PACHINKO_WHEEL_SLOW_MS);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const rotationDegrees =
      session.wheelState.targetRotationDegrees - (1 - easedProgress) * 360;
    if (progress < 1) {
      return {
        ...session,
        phase: "rewarding",
        wheelState: {
          ...session.wheelState,
          elapsedMs,
          rotationDegrees,
        },
      };
    }

    return {
      ...session,
      phase: "rewarding",
      wheelState: {
        ...session.wheelState,
        phase: "flashing",
        elapsedMs: 0,
        rotationDegrees: session.wheelState.targetRotationDegrees,
        flashCount: 0,
      },
    };
  }

  if (session.wheelState.phase === "holding") {
    if (elapsedMs < PACHINKO_WHEEL_HOLD_MS) {
      return {
        ...session,
        phase: "rewarding",
        wheelState: {
          ...session.wheelState,
          elapsedMs,
        },
      };
    }

    if (session.rewardQueue.length > 0) {
      return startNextPachinkoWheelReward({
        ...session,
        wheelState: {
          ...createIdlePachinkoWheelState(),
          rotationDegrees: session.wheelState.rotationDegrees,
          targetRotationDegrees: session.wheelState.targetRotationDegrees,
          segments: session.wheelState.segments,
        },
      });
    }

    return {
      ...session,
      phase:
        session.remainingBalls > 0
          ? "ready"
          : session.fortuneCardCount > 0
            ? "drawing-card"
            : "settling",
      wheelState: {
        ...session.wheelState,
        phase: "settled",
        elapsedMs: PACHINKO_WHEEL_HOLD_MS,
      },
    };
  }

  const flashStepMs = PACHINKO_WHEEL_FLASH_MS / (PACHINKO_WHEEL_FLASH_COUNT * 2);
  const flashCount = Math.min(
    PACHINKO_WHEEL_FLASH_COUNT,
    Math.floor(elapsedMs / (flashStepMs * 2))
  );
  if (elapsedMs < PACHINKO_WHEEL_FLASH_MS) {
    return {
      ...session,
      phase: "rewarding",
      wheelState: {
        ...session.wheelState,
        elapsedMs,
        flashCount,
      },
    };
  }

  return applyPachinkoWheelReward({
    ...session,
    wheelState: {
      ...session.wheelState,
      flashCount: PACHINKO_WHEEL_FLASH_COUNT,
    },
  });
}

function startNextPachinkoWheelReward(
  session: ActivityPachinkoBoardSession
): ActivityPachinkoBoardSession {
  const [nextReward, ...remainingQueue] = session.rewardQueue;
  if (nextReward == null) {
    return session;
  }

  const segments =
    session.wheelState.segments.length > 0
      ? session.wheelState.segments
      : PACHINKO_WHEEL_SEGMENTS;
  const selectedIndex = selectPachinkoWheelRewardIndex(session, segments);
  const selectedReward = segments[selectedIndex] ?? segments[0] ?? null;
  const segmentAngle = 360 / Math.max(1, segments.length);
  const selectedCenterDegrees = segmentAngle * selectedIndex + segmentAngle / 2;
  const baseRotation = normalizePachinkoWheelDegrees(
    session.wheelState.rotationDegrees
  );
  const targetRotation = normalizePachinkoWheelDegrees(360 - selectedCenterDegrees);
  const targetRotationDelta = normalizePachinkoWheelDegrees(
    targetRotation - baseRotation
  );
  const targetRotationDegrees = baseRotation + 360 * 4 + targetRotationDelta;

  return {
    ...session,
    phase: "rewarding",
    rewardQueue: remainingQueue,
    wheelState: {
      phase: "spinning",
      elapsedMs: 0,
      rotationDegrees: baseRotation,
      targetRotationDegrees,
      selectedIndex,
      selectedReward,
      flashCount: 0,
      segments,
    },
  };
}

function drawPachinkoFortuneCard(
  session: ActivityPachinkoBoardSession
): ActivityPachinkoFortuneCardResult {
  const drawNumber = session.fortuneCardsDrawn + 1;
  const candidates =
    drawNumber === 2
      ? PACHINKO_FORTUNE_CARDS.filter((card) => card.rank === "encounter")
      : PACHINKO_FORTUNE_CARDS.filter((card) => card.rank !== "encounter");
  const deck = candidates.length > 0 ? candidates : PACHINKO_FORTUNE_CARDS;
  const index = hashToPercent(
    `${session.activityId}:fortune-card:${drawNumber}:${session.score}:${session.layoutVersion}`
  ) % deck.length;
  const card = deck[index] ?? deck[0];

  return {
    ...card,
    applied: false,
    resolved: card.rank !== "encounter",
  };
}

export function continueActivityPachinkoAfterFortuneCard(
  state: GameState
): GameState {
  const session = state.runtime.activitySession;
  if (session?.type !== "pachinko-board" || session.phase !== "card-result") {
    return state;
  }

  const nextPhase =
    session.fortuneCardCount > 0
      ? "drawing-card"
      : session.remainingBalls > 0
        ? "ready"
        : "settling";

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: {
        ...session,
        phase: nextPhase,
        currentFortuneCard: null,
      },
    },
  };
}

export function resolveActivityPachinkoFortuneEncounter(
  state: GameState
): GameState {
  const session = state.runtime.activitySession;
  if (
    session?.type !== "pachinko-board" ||
    session.phase !== "card-result" ||
    session.currentFortuneCard?.rank !== "encounter"
  ) {
    return state;
  }

  const currentFortuneCard = {
    ...session.currentFortuneCard,
    applied: true,
    resolved: true,
  };

  return {
    ...state,
    runtime: {
      ...state.runtime,
      activitySession: {
        ...session,
        currentFortuneCard,
        fortuneCardHistory: session.fortuneCardHistory.map((card) =>
          card.id === currentFortuneCard.id && card.resolved === false
            ? currentFortuneCard
            : card
        ),
      },
    },
  };
}

function normalizePachinkoWheelDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function selectPachinkoWheelRewardIndex(
  session: ActivityPachinkoBoardSession,
  segments: ActivityPachinkoBoardWheelRewardSegment[]
): number {
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  if (totalWeight <= 0) {
    return 0;
  }

  let roll =
    hashToPercent(
      `${session.activityId}:wheel:${session.score}:${session.remainingBalls}:${session.eventLog.length}:${session.rewardQueue.length}:${session.layoutVersion}`
    ) % totalWeight;
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (segment == null) {
      continue;
    }
    if (roll < segment.weight) {
      return index;
    }
    roll -= segment.weight;
  }

  return Math.max(0, segments.length - 1);
}

function applyPachinkoWheelReward(
  session: ActivityPachinkoBoardSession
): ActivityPachinkoBoardSession {
  const reward = session.wheelState.selectedReward;
  if (reward == null) {
    return {
      ...session,
      phase: session.rewardQueue.length > 0 ? "rewarding" : "settling",
      wheelState: createIdlePachinkoWheelState(),
    };
  }

  const score =
    reward.kind === "score"
      ? Math.max(0, session.score + reward.amount)
      : session.score;
  const remainingBalls =
    reward.kind === "extra-ball"
      ? session.remainingBalls + reward.amount
      : session.remainingBalls;

  return {
    ...session,
    phase: "rewarding",
    score,
    remainingBalls,
    wheelState: {
      ...session.wheelState,
      phase: "holding",
      elapsedMs: 0,
      flashCount: PACHINKO_WHEEL_FLASH_COUNT,
      selectedReward: reward,
    },
    eventLog: [
      ...session.eventLog,
      {
        roll: 0,
        kind: reward.kind === "encounter" ? "great" : "plain",
        label: `转盘 ${reward.label}`,
      },
    ],
  };
}

function createPachinkoBoardResultSession(
  session: ActivityPachinkoBoardSession
): GameState["runtime"]["activitySession"] {
  return {
    type: "result",
    activityId: session.activityId,
    title: session.title,
    grade: session.score > 0 ? "成功" : "失手",
    score: session.score,
    rewardLines: [
      `底槽得分 ${session.score}`,
      `穿门 ${session.gatePassCount} 次`,
      `事件 ${session.eventLog.length} 次${
        session.eventLog.length > 0
          ? `：${session.eventLog.map((entry) => entry.label).join("、")}`
          : ""
      }`,
    ],
  };
}

function settleFortuneBoardCell(
  session: ActivityFortuneBoardSession,
  pickedCellKey: string
): ActivityFortuneBoardSession {
  const pickedCell = session.board.find(
    (cell) => getFortuneBoardCellKey(cell) === pickedCellKey && !cell.selected
  );
  if (pickedCell == null) {
    return {
      ...session,
      pendingDropCount: 0,
      scanCellKeys: [],
      scanCellIndex: 0,
      highlightedCellKey: null,
      pickedCellKey: null,
      selectedCellKeys: [],
    };
  }

  const previousSelectedCount = session.board.filter((cell) => cell.selected).length;
  const nextBoard = session.board.map((cell) =>
    getFortuneBoardCellKey(cell) === pickedCellKey
      ? {
          ...cell,
          selected: true,
          selectedOrder: previousSelectedCount + 1,
        }
      : cell
  );
  const selectedKinds = nextBoard
    .filter((cell) => cell.selected)
    .map((cell) => cell.kind);
  const scoring = scoreFortuneBoard(selectedKinds);
  const resonanceGain = pickedCell.kind === "resonance" ? 3 : 0;

  return {
    ...session,
    board: nextBoard,
    remainingPieces: Math.max(0, session.remainingPieces - 1 + resonanceGain),
    pendingDropCount: Math.max(0, session.pendingDropCount - 1),
    scanCellKeys: [],
    scanCellIndex: 0,
    highlightedCellKey: null,
    pickedCellKey: null,
    selectedCellKeys: [pickedCellKey],
    score: scoring.score,
    baseScore: scoring.baseScore,
    tripletRewards: scoring.tripletRewards,
    resonanceCount: session.resonanceCount + (pickedCell.kind === "resonance" ? 1 : 0),
    rumorCount: session.rumorCount + (pickedCell.kind === "rumor" ? 1 : 0),
  };
}

function advanceFortuneBoardAfterPick(
  session: ActivityFortuneBoardSession
): ActivityFortuneBoardSession {
  if (
    session.selectedColumn != null &&
    session.pendingDropCount > 0 &&
    getAvailableFortuneBoardCellsInColumn(session, session.selectedColumn).length > 0
  ) {
    return startFortuneBoardCellScan(session);
  }

  return {
    ...session,
    phase: "ready",
    wager: Math.max(1, Math.min(session.wager, session.remainingPieces)),
    highlightedColumn: null,
    selectedColumn: null,
    flashTicks: 0,
    pendingDropCount: 0,
    scanCellKeys: [],
    scanCellIndex: 0,
    highlightedCellKey: null,
    pickedCellKey: null,
    board: createFortuneBoard(
      session.activityId,
      session.rerollCount + 1,
      session.board
    ),
    rerollCount: session.rerollCount + 1,
  };
}

function startFortuneBoardFinalFlash(
  session: ActivityFortuneBoardSession
): ActivityFortuneBoardSession {
  return {
    ...session,
    phase: "final-flash",
    highlightedColumn: null,
    selectedColumn: null,
    flashTicks: FORTUNE_BOARD_FINAL_FLASH_TICKS,
    pendingDropCount: 0,
    scanCellKeys: [],
    scanCellIndex: 0,
    highlightedCellKey: null,
    pickedCellKey: null,
    selectedCellKeys: session.board
      .filter((cell) => cell.selected)
      .map(getFortuneBoardCellKey),
  };
}

function startFortuneBoardFinalReroll(
  session: ActivityFortuneBoardSession
): ActivityFortuneBoardSession {
  return {
    ...session,
    phase: "final-reroll",
    flashTicks: FORTUNE_BOARD_FINAL_REROLL_TICKS,
    board: createFortuneBoard(
      session.activityId,
      session.rerollCount + 1,
      session.board
    ),
    rerollCount: session.rerollCount + 1,
    selectedCellKeys: session.board
      .filter((cell) => cell.selected)
      .map(getFortuneBoardCellKey),
  };
}

function startFortuneBoardCellScan(
  session: ActivityFortuneBoardSession
): ActivityFortuneBoardSession {
  const selectedColumn = session.selectedColumn ?? 0;
  const availableCellKeys = getAvailableFortuneBoardCellsInColumn(
    session,
    selectedColumn
  ).map(getFortuneBoardCellKey);
  const scanCellKeys = createFortuneBoardScanPath(session, availableCellKeys);

  if (scanCellKeys.length === 0) {
    return advanceFortuneBoardAfterPick({
      ...session,
      pendingDropCount: 0,
    });
  }

  return {
    ...session,
    phase: "cell-scan",
    flashTicks: 0,
    scanCellKeys,
    scanCellIndex: 0,
    highlightedCellKey: scanCellKeys[0] ?? null,
    pickedCellKey: null,
  };
}

function createFortuneBoardScanPath(
  session: ActivityFortuneBoardSession,
  availableCellKeys: string[]
): string[] {
  if (availableCellKeys.length === 0) {
    return [];
  }

  const pickedCellKey = pickFortuneBoardCellKey(session, availableCellKeys);
  const pickedIndex = Math.max(0, availableCellKeys.indexOf(pickedCellKey ?? ""));
  const selectedCount = session.board.filter((cell) => cell.selected).length;
  const random = createSeededRandom(
    `${session.activityId}:${session.rerollCount}:${session.selectedColumn ?? 0}:${selectedCount}:${session.pendingDropCount}:scan-path`
  );
  const extendsFirstPass = random() >= 2 / 3;
  const extendsSecondPass = extendsFirstPass && random() >= 2 / 3;
  const path = availableCellKeys.slice(0, pickedIndex + 1);

  if (!extendsFirstPass) {
    return path;
  }

  path.push(...availableCellKeys.slice(pickedIndex + 1));
  path.push(...availableCellKeys.slice(pickedIndex, availableCellKeys.length - 1).reverse());

  if (!extendsSecondPass) {
    return path;
  }

  path.push(...availableCellKeys.slice(0, pickedIndex).reverse());
  path.push(...availableCellKeys.slice(0, pickedIndex + 1));
  return path;
}

function getAvailableFortuneBoardCellsInColumn(
  session: ActivityFortuneBoardSession,
  column: number
): ActivityFortuneBoardCell[] {
  return session.board
    .filter((cell) => cell.column === column && !cell.selected)
    .sort((first, second) => first.row - second.row);
}

function pickFortuneBoardCellKey(
  session: ActivityFortuneBoardSession,
  cellKeys: string[]
): string | null {
  if (cellKeys.length === 0) {
    return null;
  }

  const selectedCount = session.board.filter((cell) => cell.selected).length;
  const random = createSeededRandom(
    `${session.activityId}:${session.rerollCount}:${session.selectedColumn ?? 0}:${selectedCount}:${session.pendingDropCount}`
  );
  return cellKeys[Math.floor(random() * cellKeys.length)] ?? cellKeys[0] ?? null;
}

function getNextAvailableFortuneBoardColumn(
  session: ActivityFortuneBoardSession,
  currentColumn: number
): number | null {
  for (let offset = 1; offset <= FORTUNE_BOARD_SIZE; offset += 1) {
    const column = (currentColumn + offset + FORTUNE_BOARD_SIZE) % FORTUNE_BOARD_SIZE;
    if (session.board.some((cell) => cell.column === column && !cell.selected)) {
      return column;
    }
  }

  return null;
}

function hasAvailableFortuneBoardCells(session: ActivityFortuneBoardSession): boolean {
  return session.board.some((cell) => !cell.selected);
}

function createFortuneBoardResultSession(
  session: ActivityFortuneBoardSession
): GameState["runtime"]["activitySession"] {
  return {
    type: "result",
    activityId: session.activityId,
    title: session.title,
    grade: session.score > 0 ? "成功" : "失手",
    score: session.score,
    rewardLines: [
      `基础 ${session.baseScore}`,
      ...session.tripletRewards.map(
        (reward) =>
          `${getFortuneBoardKindLabel(reward.kind)}三连 x${reward.sets} +${reward.contribution}`
      ),
      ...(session.resonanceCount > 0
        ? [`灵犀 ${session.resonanceCount} 次，额外获得 ${session.resonanceCount * 3} 枚棋子`]
        : []),
      ...(session.rumorCount > 0 ? ["奇闻已记录，特殊事件效果待补充。"] : []),
      `玩法分数 ${session.score}`,
      `贡献值 +${session.score}（1:1）`,
    ],
  };
}

function createFortuneBoard(
  activityId: string,
  rerollCount: number,
  previousBoard: ActivityFortuneBoardCell[]
): ActivityFortuneBoardCell[] {
  const selectedCellsByKey = new Map(
    previousBoard
      .filter((cell) => cell.selected)
      .map((cell) => [getFortuneBoardCellKey(cell), cell])
  );
  const randomKinds = createFortuneBoardKindDeck(
    activityId,
    rerollCount,
    previousBoard
  );
  let randomIndex = 0;

  return Array.from({ length: FORTUNE_BOARD_SIZE * FORTUNE_BOARD_SIZE }, (_, index) => {
    const row = Math.floor(index / FORTUNE_BOARD_SIZE);
    const column = index % FORTUNE_BOARD_SIZE;
    const existingSelectedCell = selectedCellsByKey.get(`${row}:${column}`);
    if (existingSelectedCell != null) {
      return existingSelectedCell;
    }

    const kind = randomKinds[randomIndex] ?? "plain";
    randomIndex += 1;
    return {
      row,
      column,
      kind,
      selected: false,
    };
  });
}

function createFortuneBoardKindDeck(
  activityId: string,
  rerollCount: number,
  previousBoard: ActivityFortuneBoardCell[]
): ActivityFortuneBoardCellKind[] {
  const selectedCounts = previousBoard.reduce<Record<ActivityFortuneBoardCellKind, number>>(
    (result, cell) =>
      cell.selected
        ? {
            ...result,
            [cell.kind]: result[cell.kind] + 1,
          }
        : result,
    {
      plain: 0,
      timing: 0,
      favorable: 0,
      complete: 0,
      resonance: 0,
      rumor: 0,
    }
  );
  const deck = (Object.entries(FORTUNE_BOARD_CELL_COUNTS) as Array<
    [ActivityFortuneBoardCellKind, number]
  >).flatMap(([kind, count]) =>
    Array.from({ length: Math.max(0, count - selectedCounts[kind]) }, () => kind)
  );
  const random = createSeededRandom(`${activityId}:${rerollCount}`);

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = deck[index] as ActivityFortuneBoardCellKind;
    deck[index] = deck[swapIndex] as ActivityFortuneBoardCellKind;
    deck[swapIndex] = current;
  }

  return deck;
}

function scoreFortuneBoard(kinds: ActivityFortuneBoardCellKind[]): {
  score: number;
  baseScore: number;
  tripletRewards: ActivityFortuneBoardTripletReward[];
} {
  const counts = kinds.reduce<Record<ActivityFortuneBoardCellKind, number>>(
    (result, kind) => ({
      ...result,
      [kind]: result[kind] + 1,
    }),
    {
      plain: 0,
      timing: 0,
      favorable: 0,
      complete: 0,
      resonance: 0,
      rumor: 0,
    }
  );
  const tripletRewards = (Object.entries(FORTUNE_BOARD_TRIPLET_CONTRIBUTION) as Array<
    [ActivityFortuneBoardCellKind, number]
  >).flatMap(([kind, contribution]) => {
    const sets = Math.floor(counts[kind] / 3);
    return sets <= 0
      ? []
      : [
          {
            kind,
            sets,
            contribution: sets * contribution,
          },
        ];
  });
  const baseScore = kinds.length;

  return {
    score:
      baseScore +
      tripletRewards.reduce((total, reward) => total + reward.contribution, 0),
    baseScore,
    tripletRewards,
  };
}

function createSeededRandom(seedText: string): () => number {
  let seed = Array.from(seedText).reduce(
    (result, char) => (result * 31 + char.charCodeAt(0)) >>> 0,
    2166136261
  );
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

function clampFortuneBoardAnimationTickMs(tickMs: number): number {
  if (!Number.isFinite(tickMs)) {
    return FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS;
  }

  return Math.max(
    FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
    Math.min(FORTUNE_BOARD_MAX_ANIMATION_TICK_MS, Math.round(tickMs))
  );
}

function getFortuneBoardCellKey(cell: Pick<ActivityFortuneBoardCell, "row" | "column">): string {
  return `${cell.row}:${cell.column}`;
}

function getFortuneBoardKindLabel(kind: ActivityFortuneBoardCellKind): string {
  switch (kind) {
    case "timing":
      return "天时";
    case "favorable":
      return "顺意";
    case "complete":
      return "周全";
    case "resonance":
      return "灵犀";
    case "rumor":
      return "奇闻";
    case "plain":
      return "平";
  }
}

function resolveTargetStartPercent(round: number): number {
  return 15 + ((round * 17 + 13) % 55);
}

function resolveTargetWidthPercent(round: number, totalRounds: number): number {
  if (round >= totalRounds) {
    return 16;
  }

  return round === totalRounds - 1 ? 18 : 22;
}
