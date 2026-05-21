"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderGrainShopHouseView = renderGrainShopHouseView;
function renderAlertOverlay(overlay) {
    return `
    <div class="c-grain-shop-overlay" data-house-overlay="alert">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
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
function renderTradeOverlay(overlay) {
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
function renderMinigameOverlay(overlay) {
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
function renderResultOverlay(overlay) {
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
function renderOverlay(overlay) {
    if (overlay == null) {
        return "";
    }
    switch (overlay.type) {
        case "alert":
            return renderAlertOverlay(overlay);
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
function renderActionContainer(viewModel) {
    if (viewModel.actionContainer == null) {
        return "";
    }
    return `
    <div class="c-grain-shop-center c-grain-shop-center--open">
      <nav class="c-grain-shop-actions" aria-label="${viewModel.actionContainer.title ?? "房屋操作"}">
        ${viewModel.actionContainer.actions
        .map((action) => `
              <button
                type="button"
                class="c-button c-grain-shop-button ${action.tone === "accent" ? "c-grain-shop-button--gold" : "c-grain-shop-button--paper"}"
                data-house-action="${action.id}"
                ${action.disabled ? "disabled" : ""}
              >
                ${action.label}
              </button>
            `)
        .join("")}
      </nav>
    </div>
  `;
}
function renderStandbyRoster(viewModel) {
    if (viewModel.standbyRoster.length === 0) {
        return "";
    }
    return `
    <aside class="c-grain-shop-npc-idle" aria-label="待机角色">
      ${viewModel.standbyRoster
        .map((actor) => `
            <button
              type="button"
              class="c-grain-shop-npc-idle__button"
              ${actor.actionId == null ? "" : `data-house-action="${actor.actionId}"`}
              aria-label="与${actor.name}对话"
            >
              <div class="c-grain-shop-avatar" aria-hidden="true">
                <span class="c-grain-shop-avatar__art"></span>
              </div>
              <p class="c-grain-shop-avatar__name c-grain-shop-nameplate c-grain-shop-nameplate--small">${actor.name}</p>
            </button>
          `)
        .join("")}
    </aside>
  `;
}
function renderDialogue(viewModel) {
    if (viewModel.dialogue == null) {
        return "";
    }
    const clickable = viewModel.dialogue.advanceActionId != null;
    return `
    <footer class="c-grain-shop-dialogue" aria-label="对话">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-house-action="${viewModel.dialogue.advanceActionId}" role="button" tabindex="0"` : ""}
      >
        ${viewModel.dialogue.textLines.map((line) => `<p class="c-grain-shop-dialogue__line">${line}</p>`).join("")}
        ${viewModel.dialogue.advanceHintText == null ? "" : `<p class="c-grain-shop-dialogue__hint">${viewModel.dialogue.advanceHintText}</p>`}
      </div>
      <div class="c-grain-shop-dialogue__npc">
        <div class="c-grain-shop-portrait" aria-hidden="true">
          <span class="c-grain-shop-portrait__art"></span>
        </div>
        <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">${viewModel.dialogue.speakerName ?? ""}</p>
      </div>
    </footer>
  `;
}
function renderStatusCard(viewModel) {
    if (viewModel.statusCard == null) {
        return "";
    }
    return `
    <aside class="c-grain-shop-scene-card c-grain-shop-skin-dark" aria-label="当前场景">
      <p class="c-grain-shop-scene-card__eyebrow">${viewModel.statusCard.eyebrow}</p>
      <h2 class="c-grain-shop-scene-card__title">${viewModel.statusCard.title}</h2>
      ${viewModel.statusCard.subtitle == null ? "" : `<p class="c-grain-shop-scene-card__subtitle">${viewModel.statusCard.subtitle}</p>`}
      <dl class="c-grain-shop-scene-card__stats">
        ${viewModel.statusCard.metrics
        .map((metric) => `
              <div>
                <dt>${metric.label}</dt>
                <dd>${metric.value}</dd>
              </div>
            `)
        .join("")}
      </dl>
    </aside>
  `;
}
function renderGrainShopHouseView(viewModel) {
    const isIdle = viewModel.dialogue == null;
    return `
    <section class="view-house-grain-shop" data-house-module="${viewModel.moduleId}">
      ${renderActionContainer(viewModel)}
      ${renderStandbyRoster(viewModel)}
      ${renderDialogue(viewModel)}
      ${isIdle
        ? `
            <button
              type="button"
              class="c-button c-grain-shop-button c-grain-shop-button--gold c-grain-shop-leave"
              data-action="${viewModel.leaveAction.id}"
            >
              ${viewModel.leaveAction.label}
            </button>
          `
        : ""}
      ${renderStatusCard(viewModel)}
      ${renderOverlay(viewModel.overlay)}
    </section>
  `;
}
