import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

function renderBuyOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "medicine-buy" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="medicine-buy">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-medicine-house-buy__list">
          ${overlay.items
            .map(
              (item) => `
                <button
                  type="button"
                  class="c-button c-grain-shop-button c-grain-shop-button--paper c-medicine-house-buy__item${
                    item.isSelected ? " is-selected" : ""
                  }"
                  data-house-action="${item.actionId}"
                  ${item.disabled ? "disabled" : ""}
                >
                  <span class="c-medicine-house-buy__name">${item.name}</span>
                  <span class="c-medicine-house-buy__meta">${item.typeLabel} · ${item.price} 文</span>
                </button>
              `
            )
            .join("")}
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

function renderCompoundingOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "medicine-compounding" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="medicine-compounding">
      <div class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <header class="c-grain-shop-game__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <div class="c-grain-shop-game__hud">
            <span>症候 <strong>${overlay.ailmentName}</strong></span>
            <span>剩余 <strong>${overlay.secondsLeft}</strong> 秒</span>
            <span>还可加药 <strong>${overlay.selectionsLeft}</strong> 次</span>
          </div>
          <div class="c-grain-shop-game__hud">
            <span>寒性目标 <strong>${overlay.coldRequired}</strong></span>
            <span>药效目标 <strong>${overlay.healRequired}</strong></span>
            <span>毒性上限 <strong>${overlay.maxPoison}</strong></span>
          </div>
        </header>
        <div class="c-grain-shop-ledger c-grain-shop-skin-card">
          ${
            overlay.selectionSummary.length === 0
              ? "<p>尚未投药。</p>"
              : overlay.selectionSummary.map((line) => `<p>${line}</p>`).join("")
          }
        </div>
        <div class="c-grain-shop-game__actions c-medicine-house-herb-grid">
          ${overlay.herbs
            .map(
              (herb) => `
                <button
                  type="button"
                  class="c-button c-grain-shop-button c-grain-shop-button--gold"
                  data-house-action="${herb.actionId}"
                >
                  ${herb.name}
                  <small>寒${herb.cold} 热${herb.heat} 毒${herb.poison} 效${herb.heal}</small>
                </button>
              `
            )
            .join("")}
        </div>
        <div class="c-grain-shop-modal__actions">
          <button type="button" class="c-button c-grain-shop-button c-grain-shop-button--paper" data-house-action="${overlay.finishActionId}">
            ${overlay.finishLabel}
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
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          <p class="c-grain-shop-result__grade">评级：<strong>${overlay.grade}</strong></p>
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

  if (overlay.type === "alert") {
    return renderHouseAlertOverlay(overlay);
  }

  if (overlay.type === "medicine-buy") {
    return renderBuyOverlay(overlay);
  }

  if (overlay.type === "medicine-compounding") {
    return renderCompoundingOverlay(overlay);
  }

  if (overlay.type === "result") {
    return renderResultOverlay(overlay);
  }

  return "";
}

export function renderMedicineHouseHouseView(viewModel: HouseModuleViewModel): string {
  const isIdle = viewModel.dialogue == null;

  return `
    <section class="view-house-grain-shop view-house-medicine-house" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel, {
        asideClassName: "c-grain-shop-npc-idle",
        asideLabel: "药铺",
      })}
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue",
      })}
      ${isIdle ? renderHouseLeaveButton(viewModel) : ""}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
