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
  renderHouseIdleOwner,
  renderHouseLeaveButton,
  renderHouseQuantityConfirmOverlay,
  renderHouseStandbyRoster,
} from "./house-shared-view";

function renderConfirmOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "confirm" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="confirm">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
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

function renderResultOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "result" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="result">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          <p class="c-temple-house-result__grade">评语：${overlay.grade}</p>
          <p class="c-temple-house-result__grade">命中：${overlay.score}</p>
          ${overlay.rewardLines.map((line) => `<p>${line}</p>`).join("")}
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
    <div class="c-grain-shop-overlay" data-house-overlay="rest-days">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
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
    return renderHouseAlertOverlay(overlay);
  }

  if (overlay.type === "confirm") {
    return renderConfirmOverlay(overlay);
  }

  if (overlay.type === "quantity-confirm") {
    return renderHouseQuantityConfirmOverlay(overlay);
  }

  if (overlay.type === "qte-bar") {
    return renderQteOverlay(overlay);
  }

  if (overlay.type === "fortune-board") {
    return renderFortuneBoardOverlay(overlay);
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
        .map(
          (actor) => `
            <article class="c-keep-house-seat c-temple-house-seat${actor.isSelected ? " is-selected" : ""}">
              <div class="c-grain-shop-avatar c-keep-house-seat__avatar" aria-hidden="true">
                <span class="c-grain-shop-avatar__art ${actor.avatarArtClassName ?? ""}"></span>
              </div>
              <div class="c-keep-house-seat__nameplate">
                <span class="c-keep-house-seat__name">${actor.name}</span>
                ${
                  actor.title == null
                    ? ""
                    : `<span class="c-keep-house-seat__title">${actor.title}</span>`
                }
              </div>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

export function renderTempleHouseView(viewModel: HouseModuleViewModel): string {
  const isMeeting = viewModel.standbyRoster.some(
    (actor) => actor.isSelected != null
  );
  const isIdle = viewModel.dialogue == null;
  const ownerActor =
    viewModel.standbyRoster.find((actor) => actor.actionId != null) ?? null;
  const idleOwnerActor = isMeeting || !isIdle ? null : ownerActor;
  const sideActors =
    ownerActor == null
      ? viewModel.standbyRoster
      : viewModel.standbyRoster.filter(
          (actor) => actor.characterId !== ownerActor.characterId
        );
  return `
    <section class="view-house-grain-shop view-house-temple" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${
        isMeeting
          ? renderMeetingRoster(viewModel)
          : renderHouseStandbyRoster(
              {
                ...viewModel,
                standbyRoster: sideActors,
              },
              {
                asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
                asideLabel: "寺中人物",
                includeSelectedState: false,
                renderSecondaryText: (actor) =>
                  actor.title == null
                    ? ""
                    : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
              }
            )
      }
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue c-temple-house-dialogue",
      })}
      ${
        isMeeting || !isIdle
          ? ""
          : renderHouseIdleOwner(idleOwnerActor, {
              renderSecondaryText: (actor) =>
                actor.title == null
                  ? ""
                  : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
            })
      }
      ${isMeeting ? "" : renderHouseLeaveButton(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
