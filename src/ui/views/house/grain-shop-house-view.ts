import type { HouseModuleViewModel, HouseOverlayViewModel } from "../../../domain/house-module";
import {
  renderHouseActionContainer,
  renderHouseAlertOverlay,
  renderHouseConfirmOverlay,
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
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel c-house-trade-popup" role="dialog" aria-modal="true">
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

function renderPriceReportOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "grain-price-report" }>
): string {
  return `
    <div class="c-grain-shop-overlay" data-house-overlay="grain-price-report">
      <div class="c-grain-shop-modal c-grain-shop-modal--trade c-grain-shop-skin-panel c-house-trade-popup c-grain-intel-report" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body c-house-trade-popup__body">
          <p class="c-grain-shop-price-hint">${overlay.subtitle}</p>
          <div class="c-market-house-trade-list c-grain-intel-report__list">
            <table class="c-grain-intel-report__table">
              <thead>
                <tr>
                  <th scope="col">城名</th>
                  <th scope="col">方位</th>
                  <th scope="col">卖价</th>
                  <th scope="col">买价</th>
                  <th scope="col">对比本城</th>
                </tr>
              </thead>
              <tbody>
                ${overlay.rows
                  .map(
                    (row) => `
                      <tr class="c-grain-intel-report__row${row.isCurrentCity ? " c-grain-intel-report__row--current" : ""}">
                        <th scope="row" class="c-grain-intel-report__city">
                          ${row.cityName}${row.isCurrentCity ? "（本城）" : ""}
                        </th>
                        <td class="c-grain-intel-report__direction">${row.directionLabel}</td>
                        <td class="c-grain-intel-report__price">${row.sellPrice} 文/${row.grainUnit}</td>
                        <td class="c-grain-intel-report__price">${row.buyPrice} 文/${row.grainUnit}</td>
                        <td class="c-grain-intel-report__compare c-grain-intel-report__compare--${row.priceTone}">
                          ${row.comparisonLabel}
                        </td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
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

function renderMinigameOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "minigame" }>
): string {
  const bought = overlay.ledgerRows.find((row) => row.label === "买入")?.value ?? "--";
  const sold = overlay.ledgerRows.find((row) => row.label === "卖出")?.value ?? "--";
  const stock = overlay.ledgerRows.find((row) => row.label === "库存")?.value ?? "--";
  const minutes = String(Math.max(0, Math.floor(overlay.secondsLeft / 60))).padStart(2, "0");
  const seconds = String(Math.max(0, overlay.secondsLeft % 60)).padStart(2, "0");

  return `
    <div class="c-grain-shop-overlay c-grain-shop-overlay--accounting" data-house-overlay="minigame">
      <div class="c-grain-shop-accounting" role="dialog" aria-modal="true" aria-label="${overlay.title}">
        <header class="c-grain-shop-accounting__header">
          <h3 class="c-grain-shop-accounting__title">
            <span class="u-visually-hidden">${overlay.title}</span>
          </h3>
          <div class="c-grain-shop-accounting__hud" aria-label="当前剩余时间与得分">
            <div class="c-grain-shop-accounting__hud-section c-grain-shop-accounting__hud-section--time">
              <span class="c-grain-shop-accounting__timer-icon" aria-hidden="true"></span>
              <strong class="c-grain-shop-accounting__hud-value">${minutes}:${seconds}</strong>
            </div>
            <div class="c-grain-shop-accounting__hud-section c-grain-shop-accounting__hud-section--score">
              <span class="c-grain-shop-accounting__hud-label">得分：</span>
              <strong class="c-grain-shop-accounting__hud-value">${overlay.score}</strong>
            </div>
          </div>
        </header>
        <div class="c-grain-shop-accounting__body">
          <div class="c-grain-shop-accounting__stage">
            <section class="c-grain-shop-accounting__scroll" aria-label="账目题板">
              <div class="c-grain-shop-accounting__scroll-content">
                <div class="c-grain-shop-accounting__badge">当前题目</div>
                <div class="c-grain-shop-accounting__ledger">
                  <p class="c-grain-shop-accounting__ledger-row">
                    <span class="c-grain-shop-accounting__ledger-label">购入：</span>
                    <strong class="c-grain-shop-accounting__ledger-value">${bought}</strong>
                  </p>
                  <p class="c-grain-shop-accounting__ledger-row">
                    <span class="c-grain-shop-accounting__ledger-label">卖出：</span>
                    <strong class="c-grain-shop-accounting__ledger-value">${sold}</strong>
                  </p>
                  <div class="c-grain-shop-accounting__ledger-divider" aria-hidden="true"></div>
                  <p class="c-grain-shop-accounting__ledger-row c-grain-shop-accounting__ledger-row--stock">
                    <span class="c-grain-shop-accounting__ledger-label">库存：</span>
                    <strong class="c-grain-shop-accounting__ledger-value">${stock}</strong>
                  </p>
                </div>
              </div>
            </section>
            <div class="c-grain-shop-accounting__actions">
              <button
                type="button"
                class="c-grain-shop-accounting__decision c-grain-shop-accounting__decision--correct"
                data-house-action="${overlay.correctActionId}"
                aria-label="账对"
              ></button>
              <button
                type="button"
                class="c-grain-shop-accounting__decision c-grain-shop-accounting__decision--wrong"
                data-house-action="${overlay.wrongActionId}"
                aria-label="账错"
              ></button>
            </div>
          </div>
          <aside class="c-grain-shop-accounting__side" aria-label="当前成绩">
            <div class="c-grain-shop-accounting__side-card">
              <div class="c-grain-shop-accounting__side-title c-grain-shop-accounting__side-title--score">当前得分</div>
              <div class="c-grain-shop-accounting__side-content">
                <p class="c-grain-shop-accounting__side-label">累计得分</p>
                <p class="c-grain-shop-accounting__side-score">${overlay.score}</p>
                <dl class="c-grain-shop-accounting__side-metrics">
                  <div>
                    <dt>剩余时间</dt>
                    <dd>${minutes}:${seconds}</dd>
                  </div>
                  <div>
                    <dt>可错次数</dt>
                    <dd>${overlay.wrongsLeft} 次</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;
}

function renderResultOverlay(
  overlay: Extract<HouseOverlayViewModel, { type: "result" }>
): string {
  return `
    <div class="c-grain-shop-overlay c-grain-shop-overlay--accounting" data-house-overlay="result">
      <div class="c-grain-shop-accounting c-grain-shop-accounting--result" role="dialog" aria-modal="true" aria-label="${overlay.title}">
        <header class="c-grain-shop-accounting__header">
          <h3 class="c-grain-shop-accounting__title">
            <span class="u-visually-hidden">${overlay.title}</span>
          </h3>
          <div class="c-grain-shop-accounting__hud" aria-label="本局最终得分">
            <div class="c-grain-shop-accounting__hud-section c-grain-shop-accounting__hud-section--time">
              <span class="c-grain-shop-accounting__hud-label">状态：</span>
              <strong class="c-grain-shop-accounting__hud-value">已结束</strong>
            </div>
            <div class="c-grain-shop-accounting__hud-section c-grain-shop-accounting__hud-section--score">
              <span class="c-grain-shop-accounting__hud-label">得分：</span>
              <strong class="c-grain-shop-accounting__hud-value">${overlay.score}</strong>
            </div>
          </div>
        </header>
        <div class="c-grain-shop-accounting__body">
          <div class="c-grain-shop-accounting__stage">
            <section class="c-grain-shop-accounting__scroll c-grain-shop-accounting__scroll--result" aria-label="算账结算">
              <div class="c-grain-shop-accounting__scroll-content">
                <div class="c-grain-shop-accounting__badge">算账结算</div>
                <div class="c-grain-shop-accounting__result">
                  <p class="c-grain-shop-accounting__result-grade">评级：<strong>${overlay.grade}</strong></p>
                  <p class="c-grain-shop-accounting__result-score">本局得分：<strong>${overlay.score}</strong></p>
                  <ul class="c-grain-shop-accounting__result-rewards">
                    ${overlay.rewardLines.map((rewardLine) => `<li>${rewardLine}</li>`).join("")}
                  </ul>
                </div>
              </div>
            </section>
          </div>
          <aside class="c-grain-shop-accounting__side" aria-label="结算面板">
            <div class="c-grain-shop-accounting__side-card">
              <div class="c-grain-shop-accounting__side-title c-grain-shop-accounting__side-title--result">
                <span class="u-visually-hidden">游戏结束</span>
              </div>
              <div class="c-grain-shop-accounting__side-content c-grain-shop-accounting__side-content--result">
                <p class="c-grain-shop-accounting__side-label">最终得分</p>
                <p class="c-grain-shop-accounting__side-score c-grain-shop-accounting__side-score--result">${overlay.score}</p>
                <button
                  type="button"
                  class="c-grain-shop-accounting__confirm"
                  data-house-action="${overlay.confirmActionId}"
                  aria-label="${overlay.confirmLabel}"
                ></button>
              </div>
            </div>
          </aside>
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
      return renderHouseConfirmOverlay(overlay);
    case "trade":
      return renderTradeOverlay(overlay);
    case "grain-price-report":
      return renderPriceReportOverlay(overlay);
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
