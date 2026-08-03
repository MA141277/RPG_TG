import type { ActivityDefinition } from "../../../domain/activity";
import type { ActiveActivitySession } from "../../../domain/activity-session";
import type { GameState } from "../../../domain/game-state";
import type { Effect } from "../../../core/contracts/effect";
import type {
  ActivePlayableSession,
  PlayableCommand,
  PlayablePresenterModel,
  PlayableShell,
} from "../../../core/contracts/playable-runtime";
import {
  adjustActivityFortuneBoardWager,
  chooseActivityQteCommand,
  createActivityQteSession,
  playActivityFortuneBoard,
  stopActivityQte,
  tickActivityFortuneBoard,
} from "../../activity/activity-qte-runtime";
import { resolvePlayableResultRouting } from "../../../core/runtime/playable-result-routing";

const ACTIVITY_QTE_COMMAND_PREFIX = "playable.activity-qte.";
const ACTIVITY_QTE_TICK_MS = 90;

type ActivityQteLaunchActivity = {
  definition: ActivityDefinition;
  gameState: GameState;
};

type ActivityQteCompletionState = {
  outcome: "success" | "failure";
  factStatus: "completed" | "failed";
  score: number;
  grade: string;
  rewardLines: string[];
  effects: Effect[];
};

type ActivityQteSessionState = {
  launchPayload: Record<string, unknown>;
  launchActivity: ActivityQteLaunchActivity;
  activitySession: ActiveActivitySession;
  completion?: ActivityQteCompletionState | undefined;
};

export const activityQtePlayableShell: PlayableShell = {
  manifest: {
    playableId: "activity-qte",
    family: "minigame",
    commandPrefix: ACTIVITY_QTE_COMMAND_PREFIX,
  },
  createSession(input) {
    const launchPayload = readLaunchPayload(input.payload);
    const launchActivity = readLaunchActivity(launchPayload);
    const handlerId =
      typeof launchPayload.handlerId === "string"
        ? launchPayload.handlerId
        : launchActivity.definition.fallbackHandlerId ??
          launchActivity.definition.handlerId;

    return {
      sessionId: `playable.${input.integrationId}`,
      playableId: input.playableId,
      integrationId: input.integrationId,
      ownerContext: input.ownerContext,
      status: "active",
      state: {
        launchPayload,
        launchActivity,
        activitySession: createActivityQteSession(
          launchActivity.definition,
          handlerId
        ),
      } satisfies ActivityQteSessionState,
    };
  },
  reduce(session, command) {
    const state = readSessionState(session);
    if (state == null) {
      return session;
    }

    if (command.type === "cancel") {
      return {
        ...session,
        status: "cancelled",
      };
    }

    if (session.status !== "active" || command.type !== "custom") {
      return session;
    }

    if (
      command.actionId === "confirm-result" &&
      state.activitySession?.type === "result" &&
      state.completion != null
    ) {
      return {
        ...session,
        status: "completed",
      };
    }

    const runtimeResult = runActivityQteCommand(state, command);
    if (runtimeResult == null) {
      return session;
    }

    return writeSessionState(session, {
      ...state,
      activitySession: runtimeResult.activitySession,
      ...(runtimeResult.completion == null
        ? {}
        : {
            completion: runtimeResult.completion,
          }),
    });
  },
  present(session) {
    return createPresenter(session, readSessionState(session)?.activitySession ?? null);
  },
  complete(session) {
    const state = readSessionState(session);
    if (session.status === "cancelled") {
      return resolvePlayableResultRouting({
        session,
        outcome: "cancelled",
        factResult: {
          status: "cancelled",
        },
      });
    }
    if (state?.completion == null) {
      return null;
    }
    return resolvePlayableResultRouting({
      session,
      outcome: state.completion.outcome,
      factResult: {
        status: state.completion.factStatus,
        metrics: {
          score: state.completion.score,
        },
        detail: {
          grade: state.completion.grade,
          rewardLines: state.completion.rewardLines,
        },
      },
      settlementEffects: state.completion.effects,
    });
  },
  renderOverlay(session) {
    return renderActivityQteOverlay(
      session.playableId,
      readSessionState(session)?.activitySession ?? null
    );
  },
};

function createPresenter(
  session: ActivePlayableSession,
  activitySession: ActiveActivitySession | null
): PlayablePresenterModel {
  if (activitySession?.type === "result") {
    return {
      playableId: session.playableId,
      layout: "panel",
      title: activitySession.title,
      summaryLines: [
        `命中 ${activitySession.score}`,
        ...activitySession.rewardLines,
      ],
      actions: [
        {
          id: "confirm-result",
          label: "确认",
          commandType: "custom",
        },
      ],
      detail: {
        blocksBackgroundClicks: true,
      },
    };
  }

  if (activitySession?.type === "work-sequence") {
    return {
      playableId: session.playableId,
      layout: "panel",
      title: activitySession.title,
      summaryLines: [
        `第 ${activitySession.round} / ${activitySession.totalRounds} 轮`,
        `已成 ${activitySession.successes} 次`,
        activitySession.instruction,
      ],
      actions: activitySession.commandOptions.map((option) => ({
        id: `choose:${option.id}`,
        label: option.label,
        commandType: "custom",
      })),
      detail: {
        blocksBackgroundClicks: true,
      },
    };
  }

  if (activitySession?.type === "qte-bar") {
    return {
      playableId: session.playableId,
      layout: "panel",
      title: activitySession.title,
      summaryLines: [
        `第 ${activitySession.round} / ${activitySession.totalRounds} 轮`,
        `已中 ${activitySession.successes} 次`,
      ],
      actions: [
        {
          id: "stop",
          label: "停",
          commandType: "custom",
        },
      ],
      detail: {
        autoTickMs: ACTIVITY_QTE_TICK_MS,
        blocksBackgroundClicks: true,
      },
    };
  }

  return {
    playableId: session.playableId,
    layout: "panel",
    title: activitySession?.title ?? "互动问答",
    summaryLines:
      activitySession?.type === "fortune-board"
        ? [
            `剩余 ${activitySession.remainingPieces} 枚`,
            `本轮 ${activitySession.wager} 枚`,
            `贡献值 +${activitySession.score}`,
          ]
        : [],
    actions: [],
    detail:
      activitySession?.type === "fortune-board" &&
      activitySession.phase !== "ready"
        ? {
            autoTickMs: activitySession.animationTickMs,
            blocksBackgroundClicks: true,
          }
        : {
            blocksBackgroundClicks: true,
          },
  };
}

function renderActivityQteOverlay(
  playableId: string,
  activitySession: ActiveActivitySession | null
): string {
  if (activitySession?.type === "fortune-board") {
    const primaryActionLabel = getFortuneBoardPrimaryActionLabel(activitySession.phase);
    const primaryActionDisabled =
      activitySession.phase !== "ready" && activitySession.phase !== "scanning";
    const wagerControlsDisabled = activitySession.phase !== "ready";
    return `
      <div class="c-grain-shop-overlay" data-playable-overlay="${playableId}">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal c-fortune-board" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta">剩余 ${activitySession.remainingPieces} 枚 · 本轮 ${activitySession.wager} 枚 · 玩法分数 ${activitySession.score} · 贡献值 +${activitySession.score}</p>
          </div>
          <div class="c-fortune-board__grid" data-fortune-phase="${activitySession.phase}">
            ${activitySession.board
              .map((cell) => {
                const isHighlighted = activitySession.highlightedColumn === cell.column;
                const isColumnSelected = activitySession.selectedColumn === cell.column;
                const cellKey = `${cell.row}:${cell.column}`;
                const isNewSelection = activitySession.selectedCellKeys.includes(cellKey);
                const isCellHighlighted = activitySession.highlightedCellKey === cellKey;
                const isPicked = activitySession.pickedCellKey === cellKey;
                const isPickFlashActive =
                  activitySession.phase === "cell-pick" &&
                  isPicked &&
                  activitySession.flashTicks > 0 &&
                  activitySession.flashTicks % 2 === 0;
                const isFinalSelectionFlash =
                  activitySession.phase === "final-flash" && cell.selected;
                return `
                  <span
                    class="c-fortune-board__cell is-kind-${cell.kind} ${cell.selected ? "is-selected" : ""} ${isHighlighted ? "is-highlighted" : ""} ${isColumnSelected ? "is-column-selected" : ""} ${isCellHighlighted ? "is-cell-highlighted" : ""} ${isPicked ? "is-picked" : ""} ${isPickFlashActive ? "is-picked-flash" : ""} ${isFinalSelectionFlash ? "is-final-selection-flash" : ""} ${activitySession.phase === "column-flash" && activitySession.flashTicks > 0 && isColumnSelected && activitySession.flashTicks % 2 === 0 ? "is-flashing-column" : ""} ${isNewSelection ? "is-new-selection" : ""}"
                    data-fortune-cell-key="${cellKey}"
                    data-fortune-kind="${cell.kind}"
                    style="--fortune-row:${cell.row + 1}; --fortune-column:${cell.column + 1};"
                  >
                    <span class="c-fortune-board__cell-label">${getFortuneBoardKindLabel(cell.kind)}</span>
                  </span>
                `;
              })
              .join("")}
          </div>
          <div class="c-fortune-board__summary">
            <span>基础 ${activitySession.baseScore}</span>
            <span>时机/顺势/周全/平三连计分</span>
            ${
              activitySession.resonanceCount > 0
                ? `<span>灵感 +${activitySession.resonanceCount * 3} 枚</span>`
                : ""
            }
            ${activitySession.rumorCount > 0 ? "<span>奇闻待触发</span>" : ""}
          </div>
          <div class="c-grain-shop-modal__actions c-fortune-board__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-playable-id="${playableId}" data-playable-action="wager-minus" ${wagerControlsDisabled ? "disabled" : ""}>-</button>
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-playable-id="${playableId}" data-playable-action="play" ${primaryActionDisabled ? "disabled" : ""}>
              ${primaryActionLabel}
            </button>
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-playable-id="${playableId}" data-playable-action="wager-plus" ${wagerControlsDisabled ? "disabled" : ""}>+</button>
          </div>
        </div>
      </div>
    `;
  }

  if (activitySession?.type === "work-sequence") {
    const lastResult =
      activitySession.history[activitySession.history.length - 1] ?? null;
    return `
      <div class="c-grain-shop-overlay" data-playable-overlay="${playableId}">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta">第 ${activitySession.round} / ${activitySession.totalRounds} 轮 · 已成 ${activitySession.successes} 次</p>
          </div>
          <div class="c-grain-shop-modal__body">
            <p>${activitySession.instruction}</p>
            <p>
              目标指令：
              <strong>${activitySession.targetCommandLabel}</strong>
            </p>
            ${
              lastResult == null
                ? ""
                : `<p>${lastResult.success ? "判定成功" : "判定失败"}：${lastResult.selectedLabel}</p>`
            }
          </div>
          <div class="c-grain-shop-modal__actions">
            ${activitySession.commandOptions
              .map(
                (option) => `
                  <button
                    type="button"
                    class="c-button c-grain-shop-button c-grain-shop-button--gold"
                    data-playable-id="${playableId}"
                    data-playable-action="choose"
                    data-playable-command-id="${option.id}"
                  >
                    ${option.label}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  if (activitySession?.type === "qte-bar") {
    return `
      <div class="c-grain-shop-overlay" data-playable-overlay="${playableId}">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta">第 ${activitySession.round} / ${activitySession.totalRounds} 轮 · 已中 ${activitySession.successes} 次</p>
          </div>
          <div class="c-temple-house-qte__meter" data-playable-qte-meter>
            <span
              class="c-temple-house-qte__target"
              style="left:${activitySession.targetStartPercent}%; width:${activitySession.targetWidthPercent}%;"
            ></span>
            <span
              class="c-temple-house-qte__marker"
              style="left:${activitySession.markerPercent}%;"
            ></span>
          </div>
          <div class="c-grain-shop-modal__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-playable-id="${playableId}" data-playable-action="stop">
              停
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (activitySession?.type === "result") {
    return `
      <div class="c-grain-shop-overlay" data-playable-overlay="${playableId}">
        <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
          <div class="c-grain-shop-modal__body">
            <p class="c-temple-house-result__grade">评语：${activitySession.grade}</p>
            <p class="c-temple-house-result__grade">命中：${activitySession.score}</p>
            ${activitySession.rewardLines.map((line) => `<p>${line}</p>`).join("")}
          </div>
          <div class="c-grain-shop-modal__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-playable-id="${playableId}" data-playable-action="confirm-result">
              确认
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

function runActivityQteCommand(
  state: ActivityQteSessionState,
  command: Extract<PlayableCommand, { type: "custom" }>
): {
  activitySession: ActiveActivitySession | null;
  completion?: ActivityQteCompletionState | undefined;
} | null {
  if (state.activitySession == null) {
    return null;
  }

  const scratchState = createScratchGameState(state);
  const beforeFlags = scratchState.runtime.flags;
  const beforeVariables = scratchState.runtime.variables;
  let nextState = scratchState;

  if (command.actionId === "tick") {
    nextState = tickActivityFortuneBoard(
      scratchState,
      state.launchActivity.definition,
      []
    ).state;
  } else if (command.actionId === "play") {
    nextState = playActivityFortuneBoard(
      scratchState,
      state.launchActivity.definition,
      []
    ).state;
  } else if (command.actionId === "wager-minus") {
    nextState = adjustActivityFortuneBoardWager(scratchState, -1);
  } else if (command.actionId === "wager-plus") {
    nextState = adjustActivityFortuneBoardWager(scratchState, 1);
  } else if (
    command.actionId === "choose" &&
    typeof command.payload?.commandId === "string"
  ) {
    nextState = chooseActivityQteCommand(
      scratchState,
      state.launchActivity.definition,
      [],
      command.payload.commandId
    ).state;
  } else if (command.actionId === "stop") {
    nextState = stopActivityQte(
      scratchState,
      state.launchActivity.definition,
      []
    ).state;
  } else {
    return null;
  }

  const nextActivitySession = nextState.runtime.activitySession ?? null;
  if (nextActivitySession?.type !== "result") {
    return {
      activitySession: nextActivitySession,
    };
  }

  const succeeded = nextActivitySession.score > 0;
  return {
    activitySession: nextActivitySession,
    completion: {
      outcome: succeeded ? "success" : "failure",
      factStatus: succeeded ? "completed" : "failed",
      score: nextActivitySession.score,
      grade: nextActivitySession.grade,
      rewardLines: nextActivitySession.rewardLines,
      effects: [
        ...collectFlagEffects(beforeFlags, nextState.runtime.flags),
        ...collectVariableEffects(beforeVariables, nextState.runtime.variables),
        ...collectAdvanceTimeEffects(
          state.launchActivity.gameState,
          nextState
        ),
      ],
    },
  };
}

function createScratchGameState(
  state: ActivityQteSessionState
): GameState {
  return {
    ...state.launchActivity.gameState,
    runtime: {
      ...state.launchActivity.gameState.runtime,
      activitySession: state.activitySession,
    },
  };
}

function collectFlagEffects(
  beforeFlags: Record<string, boolean>,
  afterFlags: Record<string, boolean>
): Effect[] {
  return Object.entries(afterFlags)
    .filter(([key, value]) => beforeFlags[key] !== value)
    .map(([key, value]) => ({
      type: "setFlag",
      key,
      value,
    }));
}

function collectVariableEffects(
  beforeVariables: Record<string, number | string>,
  afterVariables: Record<string, number | string>
): Effect[] {
  return Object.entries(afterVariables)
    .filter(([key, value]) => beforeVariables[key] !== value)
    .map(([key, value]) => ({
      type: "setVariable",
      key,
      value,
    }));
}

function collectAdvanceTimeEffects(
  beforeState: GameState,
  afterState: GameState
): Effect[] {
  const beforeDayNumber =
    beforeState.calendar.year * 360 +
    (beforeState.calendar.month - 1) * 30 +
    beforeState.calendar.day;
  const afterDayNumber =
    afterState.calendar.year * 360 +
    (afterState.calendar.month - 1) * 30 +
    afterState.calendar.day;
  const dayDelta = Math.max(0, afterDayNumber - beforeDayNumber);
  const timeOrder = ["morning", "afternoon", "night"];
  const beforeTimeIndex = timeOrder.indexOf(beforeState.world.timeOfDay);
  const afterTimeIndex = timeOrder.indexOf(afterState.world.timeOfDay);
  const hours =
    dayDelta > 0
      ? afterTimeIndex
      : Math.max(0, afterTimeIndex - Math.max(0, beforeTimeIndex));

  if (dayDelta <= 0 && hours <= 0) {
    return [];
  }

  return [
    {
      type: "advanceTime",
      ...(dayDelta <= 0 ? {} : { days: dayDelta }),
      ...(hours <= 0 ? {} : { hours }),
    },
  ];
}

function getFortuneBoardKindLabel(kind: string): string {
  switch (kind) {
    case "timing":
      return "时机";
    case "favorable":
      return "顺势";
    case "complete":
      return "周全";
    case "resonance":
      return "灵感";
    case "rumor":
      return "奇闻";
    default:
      return "平常";
  }
}

function getFortuneBoardPrimaryActionLabel(
  phase: Extract<ActiveActivitySession, { type: "fortune-board" }>["phase"]
): string {
  switch (phase) {
    case "scanning":
      return "选定此列";
    case "ready":
      return "游玩";
    default:
      return "处理中";
  }
}

function readLaunchPayload(
  payload: Record<string, unknown> | undefined
): Record<string, unknown> {
  return payload == null ? {} : payload;
}

function readLaunchActivity(
  payload: Record<string, unknown>
): ActivityQteLaunchActivity {
  const activity = payload.__activity;
  if (typeof activity !== "object" || activity == null) {
    throw new Error("Activity QTE launch is missing activity context.");
  }

  const activityRecord = activity as Record<string, unknown>;
  if (
    typeof activityRecord.definition !== "object" ||
    activityRecord.definition == null ||
    typeof activityRecord.gameState !== "object" ||
    activityRecord.gameState == null
  ) {
    throw new Error("Activity QTE launch is missing activity context.");
  }

  return activity as ActivityQteLaunchActivity;
}

function readSessionState(
  session: ActivePlayableSession
): ActivityQteSessionState | null {
  const state = session.state;
  return state == null ? null : (state as ActivityQteSessionState);
}

function writeSessionState(
  session: ActivePlayableSession,
  state: ActivityQteSessionState
): ActivePlayableSession {
  return {
    ...session,
    state,
  };
}
