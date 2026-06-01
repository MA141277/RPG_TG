import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
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

function renderGambleOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "gamble" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="gamble">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <p class="c-grain-shop-trade__price">选择本次赌本</p>
        <div class="c-grain-shop-trade__quantity">
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.decrementActionId}" aria-label="减少赌本">-</button>
          <div class="c-grain-shop-trade__input">${overlay.wager}</div>
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.incrementActionId}" aria-label="增加赌本">+</button>
        </div>
        <p class="c-grain-shop-trade__total">候选档位：${overlay.options.join(" / ")} 文</p>
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

function renderResultOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "result" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="result">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel c-temple-house-modal" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          <p class="c-temple-house-result__grade">评定：${overlay.grade}</p>
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

function renderOverlay(overlay: HouseOverlayViewModel | null): string {
  if (overlay == null) {
    return "";
  }

  switch (overlay.type) {
    case "alert":
      return renderHouseAlertOverlay(overlay);
    case "confirm":
      return renderConfirmOverlay(overlay);
    case "gamble":
      return renderGambleOverlay(overlay);
    case "qte-bar":
      return renderQteOverlay(overlay);
    case "result":
      return renderResultOverlay(overlay);
    default:
      return "";
  }
}

export function renderTavernHouseView(viewModel: HouseModuleViewModel): string {
  const isIdle = viewModel.dialogue == null;

  return `
    <section class="view-house-grain-shop view-house-tavern" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel, {
        asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
        asideLabel: "酒馆老板",
        includeSelectedState: true,
        renderSecondaryText: (actor) =>
          actor.title == null ? "" : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`,
      })}
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-tea-house-dialogue",
      })}
      ${isIdle ? renderHouseLeaveButton(viewModel) : ""}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
