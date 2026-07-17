import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStatusCard,
} from "./house-shared-view";

function renderRestDaysOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "rest-days" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="rest-days">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel c-house-trade-popup" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        <label class="c-grain-shop-trade__label" for="${overlay.quantityFieldId}">
          静养天数
        </label>
        <div class="c-grain-shop-trade__quantity">
          <input
            id="${overlay.quantityFieldId}"
            class="c-grain-shop-trade__input"
            type="number"
            min="1"
            max="99"
            value="${overlay.dayCount}"
            data-house-field="${overlay.quantityFieldId}"
          />
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

  switch (overlay.type) {
    case "alert":
      return renderHouseAlertOverlay(overlay);
    case "rest-days":
      return renderRestDaysOverlay(overlay);
    default:
      return "";
  }
}

export function renderHomeHouseView(viewModel: HouseModuleViewModel): string {
  return `
    <section class="view-house-grain-shop view-house-home" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseDialogue(viewModel, {
        footerClassName: "c-grain-shop-dialogue c-home-house-dialogue",
        ariaLabel: "自宅叙述",
      })}
      ${renderHouseLeaveButton(viewModel)}
      ${renderHouseStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
