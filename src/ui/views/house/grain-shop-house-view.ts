import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

function renderTradeOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "trade" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="trade">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <p class="c-grain-shop-trade__price">当前粮价：1 石 = ${overlay.grainPrice} 文</p>
        <label class="c-grain-shop-trade__label" for="${overlay.quantityFieldId}">数量（石）</label>
        <div class="c-grain-shop-trade__quantity">
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.decrementActionId}" aria-label="减少">-</button>
          <input
            id="${overlay.quantityFieldId}"
            class="c-grain-shop-trade__input"
            type="number"
            min="1"
            value="${overlay.quantity}"
            data-house-field="${overlay.quantityFieldId}"
          />
          <button type="button" class="c-grain-shop-qty-btn" data-house-action="${overlay.incrementActionId}" aria-label="增加">+</button>
        </div>
        <p class="c-grain-shop-trade__total">合计：${overlay.tradeTotal} 文</p>
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

function renderMinigameOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "minigame" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="minigame">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <header class="c-grain-shop-game__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <div class="c-grain-shop-game__hud">
            <span>剩余 <strong>${overlay.secondsLeft}</strong> 秒</span>
            <span>得分 <strong>${overlay.score}</strong></span>
            <span>可错 <strong>${overlay.wrongsLeft}</strong> 次</span>
          </div>
        </header>
        <div class="c-grain-shop-ledger c-grain-shop-skin-card">
          ${overlay.ledgerRows.map((row) => `<p>${row.label}：${row.value}</p>`).join("")}
        </div>
        <div class="c-grain-shop-game__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--gold" data-house-action="${overlay.correctActionId}">账对</button>
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.wrongActionId}">账错</button>
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
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          <p class="c-grain-shop-result__grade">评级：<strong>${overlay.grade}</strong></p>
          <p>本局得分：${overlay.score} 分</p>
          <ul class="c-grain-shop-result__rewards">
            ${overlay.rewardLines.map((rewardLine) => `<li>${rewardLine}</li>`).join("")}
          </ul>
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
    case "trade":
      return renderTradeOverlay(overlay);
    case "minigame":
      return renderMinigameOverlay(overlay);
    case "result":
      return renderResultOverlay(overlay);
    default:
      return "";
  }
}

export function renderGrainShopHouseView(viewModel: HouseModuleViewModel): string {
  const isIdle = viewModel.dialogue == null;

  return `
    <section class="view-house-grain-shop" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel)}
      ${renderHouseDialogue(viewModel)}
      ${isIdle ? renderHouseLeaveButton(viewModel) : ""}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
