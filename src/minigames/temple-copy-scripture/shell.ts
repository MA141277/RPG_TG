import type { ActivityDefinition } from "../../domain/activity";
import type { ActiveActivitySession } from "../../domain/activity-session";
import type { GameState } from "../../domain/game-state";
import type { Effect } from "../../core/contracts/effect";
import type {
  ActivePlayableSession,
  PlayableCommand,
  PlayablePresenterModel,
  PlayableShell,
} from "../../core/contracts/playable-runtime";
import {
  adjustActivityFortuneBoardWager,
  chooseActivityQteCommand,
  createActivityQteSession,
  playActivityFortuneBoard,
  stopActivityQte,
  tickActivityFortuneBoard,
} from "../../application/activity/activity-qte-runtime";
import { resolvePlayableResultRouting } from "../../core/runtime/playable-result-routing";
import {
  TEMPLE_COPY_SCRIPTURE_COMMAND_PREFIX,
  TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID,
} from "./contract";

type TempleCopyScriptureLaunchActivity = {
  definition: ActivityDefinition;
  gameState: GameState;
};

type TempleCopyScriptureCompletionState = {
  outcome: "success" | "failure";
  factStatus: "completed" | "failed";
  score: number;
  grade: string;
  rewardLines: string[];
  effects: Effect[];
};

type TempleCopyScriptureSessionState = {
  launchPayload: Record<string, unknown>;
  launchActivity: TempleCopyScriptureLaunchActivity;
  activitySession: ActiveActivitySession;
  completion?: TempleCopyScriptureCompletionState | undefined;
};

export const templeCopyScripturePlayableShell: PlayableShell = {
  manifest: {
    playableId: TEMPLE_COPY_SCRIPTURE_PLAYABLE_ID,
    family: "minigame",
    commandPrefix: TEMPLE_COPY_SCRIPTURE_COMMAND_PREFIX,
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
      } satisfies TempleCopyScriptureSessionState,
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

    const runtimeResult = runTempleCopyScriptureCommand(state, command);
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
    const state = readSessionState(session);
    const activitySession = state?.activitySession ?? null;
    return createPresenter(session, activitySession);
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
    const state = readSessionState(session);
    return renderTempleCopyScriptureOverlay(
      session.playableId,
      state?.activitySession ?? null
    );
  },
};

function createPresenter(
  session: ActivePlayableSession,
  activitySession: ActiveActivitySession
): PlayablePresenterModel {
  return {
    playableId: session.playableId,
    layout: "panel",
    title: activitySession?.type === "result" ? activitySession.title : "寺庙抄经",
    summaryLines:
      activitySession?.type === "result"
        ? [
            `命中 ${activitySession.score}`,
            ...activitySession.rewardLines,
          ]
        : activitySession?.type === "fortune-board"
          ? [
              `剩余 ${activitySession.remainingPieces} 枚`,
              `本轮 ${activitySession.wager} 枚`,
              `贡献值 +${activitySession.score}`,
            ]
          : [],
    actions:
      activitySession?.type === "result"
        ? [
            {
              id: "confirm-result",
              label: "确认",
              commandType: "custom",
            },
          ]
        : [],
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

function renderTempleCopyScriptureOverlay(
  playableId: string,
  activitySession: ActiveActivitySession
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

function runTempleCopyScriptureCommand(
  state: TempleCopyScriptureSessionState,
  command: Extract<PlayableCommand, { type: "custom" }>
): {
  activitySession: ActiveActivitySession;
  completion?: TempleCopyScriptureCompletionState | undefined;
} | null {
  if (
    state.activitySession == null ||
    (state.activitySession.type !== "fortune-board" &&
      state.activitySession.type !== "qte-bar" &&
      state.activitySession.type !== "work-sequence")
  ) {
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
  } else if (command.actionId === "choose" && typeof command.payload?.commandId === "string") {
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

  const nextActivitySession = nextState.runtime.activitySession;
  if (nextActivitySession?.type !== "result") {
    return {
      activitySession: nextActivitySession,
    };
  }

  return {
    activitySession: nextActivitySession,
    completion: {
      outcome: nextActivitySession.score > 0 ? "success" : "failure",
      factStatus: nextActivitySession.score > 0 ? "completed" : "failed",
      score: nextActivitySession.score,
      grade: nextActivitySession.grade,
      rewardLines: nextActivitySession.rewardLines,
      effects: [
        ...collectFlagEffects(beforeFlags, nextState.runtime.flags),
        ...collectVariableEffects(beforeVariables, nextState.runtime.variables),
      ],
    },
  };
}

function createScratchGameState(
  state: TempleCopyScriptureSessionState
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
      type: "setFlag" as const,
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
      type: "setVariable" as const,
      key,
      value,
    }));
}

function readLaunchPayload(
  payload: Record<string, unknown> | undefined
): Record<string, unknown> {
  return payload == null ? {} : payload;
}

function readLaunchActivity(
  payload: Record<string, unknown>
): TempleCopyScriptureLaunchActivity {
  const activity = payload.__activity;
  if (typeof activity !== "object" || activity == null) {
    throw new Error("Temple copy scripture launch is missing activity context.");
  }

  const activityRecord = activity as Record<string, unknown>;
  if (
    typeof activityRecord.definition !== "object" ||
    activityRecord.definition == null ||
    typeof activityRecord.gameState !== "object" ||
    activityRecord.gameState == null
  ) {
    throw new Error("Temple copy scripture launch is missing activity context.");
  }

  return activity as TempleCopyScriptureLaunchActivity;
}

function readSessionState(
  session: ActivePlayableSession
): TempleCopyScriptureSessionState | null {
  const state = session.state;
  return state == null ? null : (state as TempleCopyScriptureSessionState);
}

function writeSessionState(
  session: ActivePlayableSession,
  state: TempleCopyScriptureSessionState
): ActivePlayableSession {
  return {
    ...session,
    state,
  };
}
