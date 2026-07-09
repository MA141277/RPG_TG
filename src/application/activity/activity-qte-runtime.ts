import type { ActivityDefinition, ActivityHandlerId } from "../../domain/activity";
import type {
  ActivityFortuneBoardCell,
  ActivityFortuneBoardCellKind,
  ActivityFortuneBoardSession,
  ActivityFortuneBoardTripletReward,
  ActivityQteSession,
  ActivityWorkSequenceSession,
} from "../../domain/activity-session";
import {
  FORTUNE_BOARD_DEFAULT_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
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

export type ActivityQteCompletionResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function createActivityQteSession(
  activityDefinition: ActivityDefinition,
  handlerId: ActivityHandlerId
): ActivityFortuneBoardSession {
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

export function advanceActivityQteMarker(state: GameState): GameState {
  const session = state.runtime.activitySession;
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
    return {
      state: setActivityFortuneBoardAnimationTickMs(
        state,
        Number(commandId.slice("speed:".length))
      ),
      characterDefinitions,
    };
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
    ActivityQteSession | ActivityWorkSequenceSession | ActivityFortuneBoardSession,
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
