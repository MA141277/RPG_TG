import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseDialogue,
  renderHouseLeaveButton,
  renderHouseStandbyRoster,
  renderHouseStatusCard,
} from "./house-shared-view";

function renderOverlay(overlay: HouseOverlayViewModel | null): string {
  if (overlay == null) {
    return "";
  }

  if (overlay.type === "market-trade") {
    return `
      <div class="c-grain-shop-overlay" data-house-overlay="market-trade">
        <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel" role="dialog" aria-modal="true">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <div class="c-grain-shop-modal__body">
            <div class="c-market-house-trade-list c-grain-shop-skin-card">
              ${overlay.rows
                .map(
                  (row) => `
                    <button
                      type="button"
                      class="c-market-house-trade-row${row.isSelected ? " is-selected" : ""}"
                      data-house-action="select-market-goods:${row.goodsId}"
                    >
                      <span class="c-market-house-trade-row__head">
                        <strong>${row.name}</strong>
                        <span>${row.categoryLabel}</span>
                      </span>
                      <span class="c-market-house-trade-row__price c-market-house-trade-row__price--${row.priceTone}">
                        当前价格：${row.currentPrice}文
                      </span>
                      <span class="c-market-house-trade-row__meta">
                        参考均价：${row.referencePrice}文 / ${row.quantityLabel}
                      </span>
                    </button>
                  `
                )
                .join("")}
            </div>
            ${
              overlay.selectedSummary == null
                ? ""
                : `
                  <div class="c-grain-shop-ledger c-grain-shop-skin-card">
                    <p>${overlay.selectedSummary.name}</p>
                    <p>分类：${overlay.selectedSummary.categoryLabel}</p>
                    <p class="c-market-house-trade-row__price c-market-house-trade-row__price--${overlay.selectedSummary.priceTone}">
                      当前价格：${overlay.selectedSummary.currentPrice}文
                    </p>
                    <p>参考均价：${overlay.selectedSummary.referencePrice}文</p>
                    <p>${overlay.selectedSummary.quantityLabel}</p>
                  </div>
                `
            }
          </div>
          <label class="c-grain-shop-trade__label" for="${overlay.quantityFieldId}">
            数量（${overlay.selectedSummary?.unit ?? "单位"}）
          </label>
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
          <p class="c-grain-shop-trade__total">合计：${overlay.selectedSummary?.tradeTotal ?? 0} 文</p>
          <div class="c-grain-shop-modal__body">
            ${overlay.helperLines.map((line) => `<p class="c-grain-shop-price-hint">${line}</p>`).join("")}
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

  if (overlay.type === "alert") {
    return renderHouseAlertOverlay(overlay);
  }

  return "";
}

export function renderMarketHouseView(viewModel: HouseModuleViewModel): string {
  const isIdle = viewModel.dialogue == null;

  return `
    <section class="view-house-grain-shop view-house-tea-house" data-house-module="${viewModel.moduleId}">
      ${renderHouseActionContainer(viewModel)}
      ${renderHouseStandbyRoster(viewModel, {
        asideClassName: "c-grain-shop-npc-idle c-tea-house-npc-idle",
        asideLabel: "市集人物",
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
