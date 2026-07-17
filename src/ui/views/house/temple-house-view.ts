import type {
  HouseModuleViewModel,
  HouseOverlayViewModel,
} from "../../../domain/house-module";
import {
  FORTUNE_BOARD_MAX_ANIMATION_TICK_MS,
  FORTUNE_BOARD_MIN_ANIMATION_TICK_MS,
} from "../../../domain/activity-session";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseCharacterCard,
  renderHouseLeaveButton,
  renderHouseNpcTargetAttributes,
  renderHouseQuantityConfirmOverlay,
  renderHouseStandbyRoster,
} from "./house-shared-view";

const templePopupOverlayAttribute =
  ' data-house-overlay-variant="temple-utility-popup"';
const templePopupModalClassName =
  " c-house-contribution-settlement c-house-temple-utility-popup";

function renderConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "confirm" }>
): string {
  const isTempleTaskConfirm =
    overlay.confirmLabel === "现在开始" && overlay.cancelLabel === "稍后再领";
  const overlayVariantAttribute = isTempleTaskConfirm
    ? ' data-house-overlay-variant="temple-task-confirm"'
    : templePopupOverlayAttribute;
  const modalClassName = `c-grain-shop-modal c-grain-shop-skin-panel${
    isTempleTaskConfirm
      ? " c-house-contribution-settlement c-house-temple-task-confirm"
      : `${templePopupModalClassName} c-house-temple-confirm-popup`
  }`;
  const workDescription =
    overlay.workDescriptionLines == null
      ? ""
      : `
        <div class="c-grain-shop-modal__body">
          ${overlay.workDescriptionLines.map((line) => `<p>${line}</p>`).join("")}
        </div>
      `;
  const relatedAbilities =
    overlay.relatedAbilityLines == null
      ? ""
      : `
        <div class="c-grain-shop-modal__body">
          ${overlay.relatedAbilityLines.map((line) => `<p>${line}</p>`).join("")}
        </div>
      `;
  const costs =
    overlay.costLines == null
      ? ""
      : `
        <div class="c-grain-shop-modal__body">
          ${overlay.costLines.map((line) => `<p>${line}</p>`).join("")}
        </div>
      `;
  const bestScoreSummary =
    overlay.bestScore == null || overlay.quickCompleteScore == null
      ? ""
      : `
        <div class="c-grain-shop-modal__body">
          <p>历史最高分 ${overlay.bestScore}</p>
          <p>快速完成按 90% 计为 ${overlay.quickCompleteScore}</p>
        </div>
      `;
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="confirm"${overlayVariantAttribute}>
      <div class="${modalClassName}" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        ${workDescription}
        ${relatedAbilities}
        ${costs}
        ${bestScoreSummary}
        <div class="c-grain-shop-modal__actions c-grain-shop-modal__actions--split">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.cancelActionId}">
            ${overlay.cancelLabel}
          </button>
          ${
            overlay.quickCompleteActionId == null
              ? ""
              : `
                <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.quickCompleteActionId}">
                  ${overlay.quickCompleteLabel ?? "快速完成"}
                </button>
              `
          }
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.confirmActionId}">
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderQteOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "qte-bar" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="qte-bar">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
        <div class="c-temple-house-qte__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <p class="c-temple-house-qte__task">${overlay.taskLabel}</p>
          <p class="c-temple-house-qte__meta">第 ${overlay.round} / ${overlay.totalRounds} 轮 · 已中 ${overlay.successes} 次</p>
        </div>
        <div class="c-grain-shop-modal__body">
          ${overlay.helperLines.map((line) => `<p>${line}</p>`).join("")}
          <div class="c-temple-house-qte__track" aria-hidden="true">
            <span
              class="c-temple-house-qte__target"
              style="left:${overlay.targetStartPercent}%; width:${overlay.targetWidthPercent}%;"
            ></span>
            <span
              class="c-temple-house-qte__marker"
              style="left:${overlay.markerPercent}%;"
            ></span>
          </div>
        </div>
        <div class="c-grain-shop-modal__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.stopActionId}">
            停手
          </button>
        </div>
      </div>
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

function renderFortuneBoardOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "fortune-board" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="fortune-board">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal c-fortune-board" role="dialog" aria-modal="true">
        <div class="c-temple-house-qte__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <p class="c-temple-house-qte__task">${overlay.taskLabel}</p>
          <p class="c-temple-house-qte__meta" data-fortune-meta>剩余 ${overlay.remainingPieces} 枚 · 本轮 ${overlay.wager} 枚 · 玩法分数 ${overlay.score} · 贡献值 +${overlay.score}</p>
        </div>
        <div class="c-fortune-board__grid" data-fortune-phase="${overlay.phase}">
          ${overlay.board
            .map((cell) => {
              const isHighlighted = overlay.highlightedColumn === cell.column;
              const isColumnSelected = overlay.selectedColumn === cell.column;
              const cellKey = `${cell.row}:${cell.column}`;
              const isNewSelection = overlay.selectedCellKeys.includes(cellKey);
              const isCellHighlighted = overlay.highlightedCellKey === cellKey;
              const isPicked = overlay.pickedCellKey === cellKey;
              const isPickFlashActive = overlay.pickFlashActive && isPicked;
              const isFinalSelectionFlash =
                overlay.phase === "final-flash" && cell.selected;
              return `
                <span
                  class="c-fortune-board__cell is-kind-${cell.kind} ${cell.selected ? "is-selected" : ""} ${isHighlighted ? "is-highlighted" : ""} ${isColumnSelected ? "is-column-selected" : ""} ${isCellHighlighted ? "is-cell-highlighted" : ""} ${isPicked ? "is-picked" : ""} ${isPickFlashActive ? "is-picked-flash" : ""} ${isFinalSelectionFlash ? "is-final-selection-flash" : ""} ${overlay.flashActive && isColumnSelected ? "is-flashing-column" : ""} ${isNewSelection ? "is-new-selection" : ""}"
                  data-fortune-cell-key="${cellKey}"
                  data-fortune-kind="${cell.kind}"
                  data-fortune-label="${getFortuneBoardKindLabel(cell.kind)}"
                  data-fortune-reroll-count="${overlay.rerollCount}"
                  style="--fortune-row:${cell.row + 1}; --fortune-column:${cell.column + 1};"
                >
                  <span class="c-fortune-board__cell-label">${getFortuneBoardKindLabel(cell.kind)}</span>
                </span>
              `;
            })
            .join("")}
        </div>
        <div class="c-fortune-board__summary" data-fortune-summary>
          <span>基础 ${overlay.baseScore}</span>
          <span>天时/顺意/周全/平三连计奖</span>
          ${overlay.resonanceCount > 0 ? `<span>灵犀 +${overlay.resonanceCount * 3} 枚</span>` : ""}
          ${overlay.rumorCount > 0 ? "<span>奇闻待触发</span>" : ""}
        </div>
        <div class="c-fortune-board__tuning" data-fortune-speed-control>
          <span>间隔</span>
          <input
            type="range"
            min="${FORTUNE_BOARD_MIN_ANIMATION_TICK_MS}"
            max="${FORTUNE_BOARD_MAX_ANIMATION_TICK_MS}"
            step="50"
            value="${overlay.animationTickMs}"
            data-fortune-speed-input
            data-fortune-speed-field="${overlay.speedFieldId}"
          />
          <strong data-fortune-speed-value>${overlay.animationTickMs}ms</strong>
        </div>
        <div class="c-grain-shop-modal__actions c-fortune-board__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.decreaseWagerActionId}">‹</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.playActionId}">
            ${overlay.phase === "scanning" ? "选定此列" : "游玩"}
          </button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.increaseWagerActionId}">›</button>
        </div>
      </div>
    </div>
  `;
}

function formatPachinkoSlotValue(value: number | "wheel"): string {
  return value === "wheel" ? "转盘" : String(value);
}

function renderPachinkoWheel(
  wheelState: Extract<HouseOverlayViewModel, { type: "pachinko-board" }>["wheelState"],
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

function renderPachinkoBoardOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "pachinko-board" }>
): string {
  const latestEvent = overlay.eventLog[overlay.eventLog.length - 1] ?? null;
  const pinDiameterPercent =
    overlay.pins.length === 0
      ? 2.571
      : ((overlay.pins[0]?.radius ?? 9) * 2 * 100) / overlay.boardWidth;
  const boardStyle = `--pachinko-width:${overlay.boardWidth}; --pachinko-height:${overlay.boardHeight}; --pachinko-flipper-angle:${overlay.flipperAngle}deg; --pachinko-pin-diameter:${pinDiameterPercent}%;`;
  const wheel = renderPachinkoWheel(
    overlay.wheelState,
    overlay.boardWidth,
    overlay.boardHeight
  );
  const movingGateLabelX =
    (overlay.movingGatePins[0].x + overlay.movingGatePins[1].x) / 2;
  const movingGateLabelY =
    (overlay.movingGatePins[0].y + overlay.movingGatePins[1].y) / 2;
  const renderBalls =
    overlay.activeBalls.length > 0
      ? overlay.activeBalls
      : overlay.activeBall == null
        ? []
        : [overlay.activeBall];
  const playButtonLabel =
    overlay.phase === "settling"
      ? "确认结果"
      : overlay.phase === "dropping"
        ? "弹珠中"
        : "游玩";
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="pachinko-board">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-temple-house-modal c-pachinko-board" role="dialog" aria-modal="true">
        <div class="c-temple-house-qte__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <p class="c-temple-house-qte__task">${overlay.taskLabel}</p>
          <p class="c-temple-house-qte__meta">剩余 ${overlay.remainingBalls} / ${overlay.totalBalls} 枚 · 分数 ${overlay.score} · 穿门 ${overlay.gatePassCount} 次</p>
        </div>
        <div class="c-pachinko-board__field" style="${boardStyle}" data-pachinko-phase="${overlay.phase}">
          <div class="c-pachinko-board__launcher" aria-hidden="true">
            <span class="c-pachinko-board__flipper c-pachinko-board__flipper--left"></span>
            <span class="c-pachinko-board__flipper c-pachinko-board__flipper--right"></span>
          </div>
          ${wheel}
          ${overlay.pins
            .map(
              (pin) => `
                <span
                  class="c-pachinko-board__pin"
                  style="--pin-left:${(pin.x / overlay.boardWidth) * 100}%; --pin-top:${(pin.y / overlay.boardHeight) * 100}%; --pin-size:${(pin.radius / overlay.boardWidth) * 200}%;"
                  aria-hidden="true"
                ></span>
              `
            )
            .join("")}
          ${overlay.movingGatePins
            .map(
              (pin) => `
                <span
                  class="c-pachinko-board__pin c-pachinko-board__pin--moving"
                  style="--pin-left:${(pin.x / overlay.boardWidth) * 100}%; --pin-top:${(pin.y / overlay.boardHeight) * 100}%; --pin-size:${(pin.radius / overlay.boardWidth) * 200}%;"
                  aria-hidden="true"
                ></span>
              `
            )
            .join("")}
          <span
            class="c-pachinko-board__gate-label"
            style="--gate-label-left:${(movingGateLabelX / overlay.boardWidth) * 100}%; --gate-label-top:${(movingGateLabelY / overlay.boardHeight) * 100}%;"
            aria-hidden="true"
          >+1球</span>
          ${renderBalls
            .map(
              (ball) => `
                <span
                  class="c-pachinko-board__ball"
                  style="--ball-left:${(ball.x / overlay.boardWidth) * 100}%; --ball-top:${(ball.y / overlay.boardHeight) * 100}%; --ball-size:${(ball.radius / overlay.boardWidth) * 200}%;"
                  aria-hidden="true"
                ></span>
              `
            )
            .join("")}
          <div class="c-pachinko-board__slots" aria-hidden="true">
            ${overlay.slotValues
              .map(
                (value, index) => `
                  <span class="c-pachinko-board__slot ${overlay.lastSlotIndex === index ? "is-last" : ""}">
                    ${formatPachinkoSlotValue(value)}
                  </span>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="c-pachinko-board__summary">
          <span>转盘队列 ${overlay.rewardQueue.length}</span>
          <span>最近奖励 ${latestEvent?.label ?? "未触发"}</span>
          <span>底槽：5 / 3 / 3 / 2 / 2 / 2 / 转盘</span>
        </div>
        <div class="c-grain-shop-modal__actions c-pachinko-board__actions">
          <button type="button" class="c-button c-grain-shop-button c-pachinko-board__play" data-house-action="${overlay.playActionId}" ${overlay.phase === "dropping" ? "disabled" : ""}>
            ${playButtonLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function isTempleResultGainLine(line: string): boolean {
  if (/^(获得|得到|取得|物品|道具|装备|粮食|金钱)/u.test(line)) {
    return true;
  }

  return /^(属性|能力|技能|武力|智谋|政务|魅力|统率|耐力|名声|声望|体力上限).*([+＋]\d|\d+\s*->)/u.test(
    line
  );
}

function selectTempleResultSummaryLines(
  overlay: Extract<HouseOverlayViewModel, { type: "result" }>
): string[] {
  const scoreLine =
    overlay.rewardLines.find((line) => line.startsWith("玩法分数 ")) ??
    `玩法分数 ${overlay.score}`;
  const contributionLine =
    overlay.rewardLines.find((line) => /^贡献值\s*\+/u.test(line)) ??
    overlay.rewardLines.find((line) => /^寺中贡献\s*\+/u.test(line));
  const lines = [
    scoreLine,
    ...(contributionLine == null ? [] : [contributionLine]),
    ...overlay.rewardLines.filter(isTempleResultGainLine),
  ];

  return [...new Set(lines)];
}

function renderResultOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "result" }>
): string {
  const summaryLines = selectTempleResultSummaryLines(overlay);
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="result"${templePopupOverlayAttribute}>
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal${templePopupModalClassName}" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${summaryLines.map((line) => `<p>${line}</p>`).join("")}
        </div>
        <div class="c-grain-shop-modal__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.confirmActionId}">
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderRestDaysOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "rest-days" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="rest-days"${templePopupOverlayAttribute}>
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal${templePopupModalClassName}" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          <label class="c-grain-shop-trade__field">
            <span>休息天数</span>
            <input
              type="number"
              min="1"
              max="99"
              value="${overlay.dayCount}"
              data-house-field="${overlay.quantityFieldId}"
            >
          </label>
        </div>
        <div class="c-grain-shop-modal__actions c-grain-shop-modal__actions--split">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.cancelActionId}">
            ${overlay.cancelLabel}
          </button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.confirmActionId}">
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderOverlay(overlay: HouseOverlayViewModel | null): string {
  if (overlay == null) {
    return "";
  }

  if (overlay.type === "alert") {
    return renderHouseAlertOverlay(overlay, {
      overlayAttribute: templePopupOverlayAttribute,
      modalClassName: templePopupModalClassName,
    });
  }

  if (overlay.type === "confirm") {
    return renderConfirmOverlay(overlay);
  }

  if (overlay.type === "quantity-confirm") {
    return renderHouseQuantityConfirmOverlay(overlay, {
      overlayAttribute: templePopupOverlayAttribute,
      modalClassName: templePopupModalClassName,
    });
  }

  if (overlay.type === "qte-bar") {
    return renderQteOverlay(overlay);
  }

  if (overlay.type === "fortune-board") {
    return renderFortuneBoardOverlay(overlay);
  }

  if (overlay.type === "pachinko-board") {
    return renderPachinkoBoardOverlay(overlay);
  }

  if (overlay.type === "rest-days") {
    return renderRestDaysOverlay(overlay);
  }

  if (overlay.type === "result") {
    return renderResultOverlay(overlay);
  }

  return "";
}

function renderMeetingRoster(viewModel: HouseModuleViewModel): string {
  if (viewModel.standbyRoster.length === 0) {
    return "";
  }

  return `
    <section class="c-keep-house-meeting c-temple-house-meeting" aria-label="寺庙评定席">
      ${viewModel.standbyRoster
        .map((actor) => {
          const secondaryText =
            actor.title == null
              ? ""
              : `<span class="c-house-character-card__title">${actor.title}</span>`;

          return `
            <button
              type="button"
              class="c-keep-house-seat c-temple-house-seat${actor.isSelected ? " is-selected" : ""}"
              ${renderHouseNpcTargetAttributes(viewModel, actor)}
            >
              ${renderHouseCharacterCard(actor, {
                className: "c-keep-house-seat__card",
                secondaryText,
              })}
            </button>
          `;
        })
        .join("")}
    </section>
  `;
}

export function renderTempleHouseView(viewModel: HouseModuleViewModel): string {
  const isMeeting =
    viewModel.standbyRoster.length > 0 &&
    viewModel.standbyRoster.every((actor) => actor.isSelected != null) &&
    viewModel.standbyRoster.some((actor) => actor.isSelected === true);
  return `
    <section class="view-house-grain-shop view-house-temple" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${
        isMeeting
          ? renderMeetingRoster(viewModel)
          : renderHouseStandbyRoster(viewModel, {
                asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
                asideLabel: "寺中人物",
                includeSelectedState: false,
                renderSecondaryText: (actor) =>
                  actor.title == null
                    ? ""
                    : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
            })
      }
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue c-temple-house-dialogue",
      })}
      ${isMeeting ? "" : renderHouseLeaveButton(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
