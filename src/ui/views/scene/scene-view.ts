import type { ActionNode, ChoiceOption } from "../../../domain/action";
import type { ActiveActivitySession } from "../../../domain/activity-session";
import {
  FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
} from "../../../domain/activity-session";
import type { CharacterDefinition } from "../../../domain/character";
import type { DialogueScreenViewModel } from "../../../core/runtime/dialogue-screen-runtime";
import {
  resolveActionNodeText,
  resolveChoiceOptionText,
} from "../../../application/content/text-resolution";
import {
  renderDialogueTypewriterHint,
  renderDialogueTypewriterLines,
} from "../../dialogue-typewriter";
import { resolveCharacterPortraitImageUrl } from "../../portrait-assets";
import { renderDialogueScreenPanel } from "../../components/dialogue-screen-panel";

type SceneViewInput = {
  currentAction: ActionNode | null;
  activitySession: ActiveActivitySession;
  characterDefinitions: CharacterDefinition[];
  choiceOptions: ChoiceOption[];
  dialogueScreenViewModel?: DialogueScreenViewModel | null;
  textEntriesById?: Record<string, string>;
};

function getScenePortraitArtClassName(characterId: string): string {
  switch (characterId) {
    case "char.kulan_temple_abbot":
      return "c-temple-house-portrait-art--abbot";
    case "char.kulan_temple_senior_monk":
      return "c-temple-house-portrait-art--senior-monk";
    default:
      return "";
  }
}

function getCharacterName(
  characterDefinitions: CharacterDefinition[],
  characterId: string
): string {
  return (
    characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === characterId
    )?.name ?? characterId
  );
}

function getCharacterDefinition(
  characterDefinitions: CharacterDefinition[],
  characterId: string
): CharacterDefinition | null {
  return (
    characterDefinitions.find(
      (characterDefinition) => characterDefinition.id === characterId
    ) ?? null
  );
}

function renderSceneDialogueCard(
  paragraphs: string[],
  options: {
    advanceActionId?: string;
    speakerName?: string;
    narration?: boolean;
    portraitImageUrl?: string | null;
    portraitArtClassName?: string;
  } = {}
): string {
  const clickable = options.advanceActionId != null;
  const typewriterLines = renderDialogueTypewriterLines(paragraphs);

  return `
    <footer class="c-grain-shop-dialogue c-scene-dialogue" aria-label="剧情对话">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-scene-action="${options.advanceActionId}" role="button" tabindex="0" data-ui-click-sound="none"` : ""}
      >
        ${typewriterLines.markup}
        ${
          clickable
            ? renderDialogueTypewriterHint(
                "点击继续",
                typewriterLines.totalDurationMs
              )
            : ""
        }
      </div>
      ${
        options.narration
          ? ""
          : `
            <div class="c-grain-shop-dialogue__npc">
              <div class="c-grain-shop-portrait" aria-hidden="true">
                ${
                  options.portraitImageUrl == null
                    ? `<span class="c-grain-shop-portrait__art ${options.portraitArtClassName ?? ""}"></span>`
                    : `<img class="c-grain-shop-portrait__image" src="${options.portraitImageUrl}" alt="">`
                }
              </div>
              <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
                ${options.speakerName ?? ""}
              </p>
            </div>
          `
      }
    </footer>
  `;
}

function renderChoiceList(choiceOptions: ChoiceOption[]): string {
  return `
    <div class="c-grain-shop-center c-grain-shop-center--open">
      <nav class="c-grain-shop-actions" aria-label="剧情选择">
        ${choiceOptions
          .map(
            (option) => `
              <button
                type="button"
                class="c-button c-grain-shop-button c-grain-shop-button--paper"
                data-scene-choice-id="${option.id}"
              >
                ${option.label}
              </button>
            `
          )
          .join("")}
      </nav>
    </div>
  `;
}

function getFortuneBoardKindLabel(kind: string): string {
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
    default:
      return "平";
  }
}

function formatPachinkoSlotValue(value: number | "wheel"): string {
  return value === "wheel" ? "转盘" : String(value);
}

function renderPachinkoWheel(
  wheelState: Extract<ActiveActivitySession, { type: "pachinko-board" }>["wheelState"],
  boardWidth: number,
  boardHeight: number
): string {
  const wheelLeft = 350;
  const wheelTop = 280;
  const wheelSize = 210;
  const segmentAngle = 360 / Math.max(1, wheelState.segments.length);
  return `
    <div
      class="c-pachinko-wheel ${wheelState.phase === "idle" ? "is-idle" : "is-active"} is-${wheelState.phase}"
      style="--wheel-left:${(wheelLeft / boardWidth) * 100}%; --wheel-top:${(wheelTop / boardHeight) * 100}%; --wheel-size:${(wheelSize / boardWidth) * 100}%; --wheel-rotation:${wheelState.rotationDegrees}deg;"
      aria-hidden="true"
    >
      <span class="c-pachinko-wheel__pointer"></span>
      <span class="c-pachinko-wheel__disc">
        ${wheelState.segments
          .map(
            (segment, index) => `
              <span
                class="c-pachinko-wheel__segment ${wheelState.selectedIndex === index ? "is-selected" : ""}"
                style="--segment-angle:${index * segmentAngle + segmentAngle / 2}deg;"
              >
                <span class="c-pachinko-wheel__label">${segment.label}</span>
              </span>
            `
          )
          .join("")}
      </span>
    </div>
  `;
}

function renderPachinkoBoard(input: {
  title: string;
  taskLabel: string;
  boardWidth: number;
  boardHeight: number;
  remainingBalls: number;
  totalBalls: number;
  phase: string;
  activeBall: Extract<ActiveActivitySession, { type: "pachinko-board" }>["activeBall"];
  activeBalls: Extract<ActiveActivitySession, { type: "pachinko-board" }>["activeBalls"];
  pins: Extract<ActiveActivitySession, { type: "pachinko-board" }>["pins"];
  movingGatePins: Extract<
    ActiveActivitySession,
    { type: "pachinko-board" }
  >["movingGatePins"];
  gatePassCount: number;
  eventCharge: number;
  eventLog: Extract<ActiveActivitySession, { type: "pachinko-board" }>["eventLog"];
  score: number;
  lastSlotIndex: number | null;
  slotValues: Array<number | "wheel">;
  rewardQueue: Extract<ActiveActivitySession, { type: "pachinko-board" }>["rewardQueue"];
  wheelState: Extract<ActiveActivitySession, { type: "pachinko-board" }>["wheelState"];
  flipperAngle: number;
  playButtonAttributes: string;
}): string {
  const pinDiameterPercent =
    input.pins.length === 0
      ? 2.571
      : ((input.pins[0]?.radius ?? 9) * 2 * 100) / input.boardWidth;
  const boardStyle = `--pachinko-width:${input.boardWidth}; --pachinko-height:${input.boardHeight}; --pachinko-flipper-angle:${input.flipperAngle}deg; --pachinko-pin-diameter:${pinDiameterPercent}%;`;
  const latestEvent = input.eventLog[input.eventLog.length - 1] ?? null;
  const wheel = renderPachinkoWheel(
    input.wheelState,
    input.boardWidth,
    input.boardHeight
  );
  const movingGateLabelX =
    (input.movingGatePins[0].x + input.movingGatePins[1].x) / 2;
  const movingGateLabelY =
    (input.movingGatePins[0].y + input.movingGatePins[1].y) / 2;
  const renderBalls =
    input.activeBalls.length > 0
      ? input.activeBalls
      : input.activeBall == null
        ? []
        : [input.activeBall];
  const playButtonLabel =
    input.phase === "settling"
      ? "确认结果"
      : input.phase === "dropping"
        ? "弹珠中"
        : "游玩";
  const playButtonSoundAttribute =
    input.phase === "settling"
      ? 'data-button-sound="heavy"'
      : 'data-pachinko-sound="launch"';
  return `
    <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal c-pachinko-board" role="dialog" aria-modal="true">
      <div class="c-temple-house-qte__header">
        <p class="c-temple-house-qte__task">${input.taskLabel}</p>
        <p class="c-temple-house-qte__meta">剩余 ${input.remainingBalls} / ${input.totalBalls} 枚 · 分数 ${input.score} · 穿门 ${input.gatePassCount} 次</p>
      </div>
      <div class="c-pachinko-board__field" style="${boardStyle}" data-pachinko-phase="${input.phase}">
        <div class="c-pachinko-board__launcher" aria-hidden="true">
          <span class="c-pachinko-board__flipper c-pachinko-board__flipper--left"></span>
          <span class="c-pachinko-board__flipper c-pachinko-board__flipper--right"></span>
        </div>
        ${wheel}
        ${input.pins
          .map(
            (pin) => `
              <span
                class="c-pachinko-board__pin"
                style="--pin-left:${(pin.x / input.boardWidth) * 100}%; --pin-top:${(pin.y / input.boardHeight) * 100}%; --pin-size:${(pin.radius / input.boardWidth) * 200}%;"
                aria-hidden="true"
              ></span>
            `
          )
          .join("")}
        ${input.movingGatePins
          .map(
            (pin) => `
              <span
                class="c-pachinko-board__pin c-pachinko-board__pin--moving"
                style="--pin-left:${(pin.x / input.boardWidth) * 100}%; --pin-top:${(pin.y / input.boardHeight) * 100}%; --pin-size:${(pin.radius / input.boardWidth) * 200}%;"
                aria-hidden="true"
              ></span>
            `
          )
          .join("")}
        <span
          class="c-pachinko-board__gate-label"
          style="--gate-label-left:${(movingGateLabelX / input.boardWidth) * 100}%; --gate-label-top:${(movingGateLabelY / input.boardHeight) * 100}%;"
          aria-hidden="true"
        >+1球</span>
        ${renderBalls
          .map(
            (ball) => `
              <span
                class="c-pachinko-board__ball"
                style="--ball-left:${(ball.x / input.boardWidth) * 100}%; --ball-top:${(ball.y / input.boardHeight) * 100}%; --ball-size:${(ball.radius / input.boardWidth) * 200}%;"
                aria-hidden="true"
              ></span>
            `
          )
          .join("")}
        <div class="c-pachinko-board__slots" aria-hidden="true">
          ${input.slotValues
            .map(
              (value, index) => `
                <span class="c-pachinko-board__slot ${input.lastSlotIndex === index ? "is-last" : ""}">
                  ${formatPachinkoSlotValue(value)}
                </span>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="c-pachinko-board__summary">
        <span>转盘队列 ${input.rewardQueue.length}</span>
        <span>最近奖励 ${latestEvent?.label ?? "未触发"}</span>
        <span>底槽：5 / 3 / 3 / 2 / 2 / 2 / 转盘</span>
      </div>
      <div class="c-grain-shop-modal__actions c-pachinko-board__actions">
        <button type="button" class="c-button c-grain-shop-button c-pachinko-board__play" ${input.playButtonAttributes} ${playButtonSoundAttribute} ${input.phase === "dropping" ? "disabled" : ""}>
          ${playButtonLabel}
        </button>
      </div>
    </div>
  `;
}

function renderActivityOverlay(activitySession: ActiveActivitySession): string {
  if (activitySession?.type === "pachinko-board") {
    return `
      <div class="c-grain-shop-overlay" data-activity-overlay="pachinko-board">
        ${renderPachinkoBoard({
          ...activitySession,
          playButtonAttributes: 'data-activity-action="play-board"',
        })}
      </div>
    `;
  }

  if (activitySession?.type === "fortune-board") {
    return `
      <div class="c-grain-shop-overlay" data-activity-overlay="fortune-board">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal c-fortune-board" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta" data-fortune-meta>剩余 ${activitySession.remainingPieces} 枚 · 本轮 ${activitySession.wager} 枚 · 玩法分数 ${activitySession.score} · 贡献值 +${activitySession.score}</p>
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
                    data-fortune-label="${getFortuneBoardKindLabel(cell.kind)}"
                    data-fortune-reroll-count="${activitySession.rerollCount}"
                    style="--fortune-row:${cell.row + 1}; --fortune-column:${cell.column + 1};"
                  >
                    <span class="c-fortune-board__cell-label">${getFortuneBoardKindLabel(cell.kind)}</span>
                  </span>
                `;
              })
              .join("")}
          </div>
          <div class="c-fortune-board__summary" data-fortune-summary>
            <span>基础 ${activitySession.baseScore}</span>
            <span>天时/顺意/周全/平三连计奖</span>
            ${
              activitySession.resonanceCount > 0
                ? `<span>灵犀 +${activitySession.resonanceCount * 3} 枚</span>`
                : ""
            }
            ${activitySession.rumorCount > 0 ? "<span>奇闻待触发</span>" : ""}
          </div>
          <div class="c-fortune-board__tuning" data-fortune-speed-control>
            <span>间隔</span>
            <input
              type="range"
              min="${FORTUNE_BOARD_MIN_ANIMATION_TICK_MS}"
              max="${FORTUNE_BOARD_MAX_ANIMATION_TICK_MS}"
              step="50"
              value="${activitySession.animationTickMs}"
              data-fortune-speed-input
            />
            <strong data-fortune-speed-value>${activitySession.animationTickMs}ms</strong>
          </div>
          <div class="c-grain-shop-modal__actions c-fortune-board__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-activity-action="wager-minus">‹</button>
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-activity-action="play-board">
              ${activitySession.phase === "scanning" ? "选定此列" : "游玩"}
            </button>
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-activity-action="wager-plus">›</button>
          </div>
        </div>
      </div>
    `;
  }

  if (activitySession?.type === "work-sequence") {
    const lastHistoryEntry =
      activitySession.history[activitySession.history.length - 1] ?? null;

    return `
      <div class="c-grain-shop-overlay" data-activity-overlay="work-sequence">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta">第 ${activitySession.round} / ${activitySession.totalRounds} 轮 · 已成 ${activitySession.successes} 次</p>
          </div>
          <div class="c-grain-shop-modal__body">
            <p>${activitySession.instruction}</p>
            <div class="c-activity-work-sequence__order" aria-live="polite">
              <span class="c-activity-work-sequence__label">令牌</span>
              <strong>${activitySession.targetCommandLabel}</strong>
            </div>
            ${
              lastHistoryEntry == null
                ? ""
                : `<p class="c-activity-work-sequence__feedback ${lastHistoryEntry.success ? "is-success" : "is-failed"}">
                    上轮：${lastHistoryEntry.selectedLabel} / ${lastHistoryEntry.success ? "办妥" : `应为 ${lastHistoryEntry.expectedLabel}`}
                  </p>`
            }
          </div>
          <div class="c-grain-shop-modal__actions c-activity-work-sequence__actions">
            ${activitySession.commandOptions
              .map(
                (command) => `
                  <button
                    type="button"
                    class="c-button c-grain-shop-button c-grain-shop-button--paper"
                    data-activity-action="choose-command"
                    data-activity-command-id="${command.id}"
                  >
                    ${command.label}
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
      <div class="c-grain-shop-overlay" data-activity-overlay="qte-bar">
        <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <div class="c-temple-house-qte__header">
            <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
            <p class="c-temple-house-qte__task">${activitySession.taskLabel}</p>
            <p class="c-temple-house-qte__meta">第 ${activitySession.round} / ${activitySession.totalRounds} 轮 · 已中 ${activitySession.successes} 次</p>
          </div>
          <div class="c-grain-shop-modal__body">
            <p>看准金色区间，点击停手。</p>
            <div class="c-temple-house-qte__track" aria-hidden="true">
              <span
                class="c-temple-house-qte__target"
                style="left:${activitySession.targetStartPercent}%; width:${activitySession.targetWidthPercent}%;"
              ></span>
              <span
                class="c-temple-house-qte__marker"
                style="left:${activitySession.markerPercent}%;"
              ></span>
            </div>
          </div>
          <div class="c-grain-shop-modal__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-activity-action="stop-qte">
              停手
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (activitySession?.type === "result") {
    return `
      <div class="c-grain-shop-overlay" data-activity-overlay="result">
        <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${activitySession.title}</h3>
          <div class="c-grain-shop-modal__body">
            <p class="c-temple-house-result__grade">评语：${activitySession.grade}</p>
            <p class="c-temple-house-result__grade">命中：${activitySession.score}</p>
            ${activitySession.rewardLines.map((line) => `<p>${line}</p>`).join("")}
          </div>
          <div class="c-grain-shop-modal__actions">
            <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-activity-action="close-result">
              确认
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

export function renderSceneView(input: SceneViewInput): string {
  const textEntriesById = input.textEntriesById ?? {};
  const action =
    input.currentAction == null
      ? null
      : resolveActionNodeText(input.currentAction, { textEntriesById });
  const resolvedChoiceOptions = input.choiceOptions.map((option) =>
    resolveChoiceOptionText(option, { textEntriesById })
  );
  const activityOverlay = renderActivityOverlay(input.activitySession);
  const dialogueScreenViewModel = input.dialogueScreenViewModel ?? null;

  if (dialogueScreenViewModel != null) {
    const speaker = getCharacterDefinition(
      input.characterDefinitions,
      dialogueScreenViewModel.speakerCharacterId
    );
    const portraitImageUrl =
      speaker == null ? null : resolveCharacterPortraitImageUrl(speaker);

    return renderDialogueScreenPanel({
      dialogueScreenViewModel,
      activityOverlay,
      speakerPortraitImageUrl: portraitImageUrl,
      ...(portraitImageUrl == null
        ? {
            speakerPortraitArtClassName: getScenePortraitArtClassName(
              dialogueScreenViewModel.speakerCharacterId
            ),
          }
        : {}),
    });
  }

  if (action == null) {
    return activityOverlay;
  }

  if (action.type === "narration") {
    return `
      <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="narration">
        ${renderSceneDialogueCard([action.text ?? ""], {
          advanceActionId: "advance",
          narration: true,
        })}
      </section>
      ${activityOverlay}
    `;
  }

  if (action.type === "dialogue") {
    const speaker = getCharacterDefinition(
      input.characterDefinitions,
      action.characterId
    );
    const portraitImageUrl =
      speaker == null ? null : resolveCharacterPortraitImageUrl(speaker);

    return `
      <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="dialogue">
        ${renderSceneDialogueCard([action.text ?? ""], {
          advanceActionId: "advance",
          speakerName:
            speaker?.name ??
            getCharacterName(input.characterDefinitions, action.characterId),
          portraitImageUrl,
          ...(portraitImageUrl == null
            ? {
                portraitArtClassName: getScenePortraitArtClassName(
                  action.characterId
                ),
              }
            : {}),
        })}
      </section>
      ${activityOverlay}
    `;
  }

  if (action.type === "choice") {
    return `
      <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="choice">
        ${renderSceneDialogueCard(
          [action.prompt ?? "你要如何回应？"],
          { narration: true }
        )}
        ${renderChoiceList(resolvedChoiceOptions)}
      </section>
      ${activityOverlay}
    `;
  }

  return `
    <section class="view-house-grain-shop view-house-temple view-scene" data-scene-view="transition">
      ${renderSceneDialogueCard(["场景推进中。"], {
        advanceActionId: "advance",
        narration: true,
      })}
    </section>
    ${activityOverlay}
  `;
}
