"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTeaHouseHouseView = renderTeaHouseHouseView;
function renderAlertOverlay(overlay) {
    return `
    <div class="c-grain-shop-overlay" data-house-overlay="alert">
      <div class="c-grain-shop-modal c-grain-shop-skin-panel" role="dialog" aria-modal="true">
        <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
        <div class="c-grain-shop-modal__body">
          ${overlay.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        <div class="c-grain-shop-modal__actions">
          <button
            type="button"
            class="c-button c-grain-shop-button c-grain-shop-button--gold"
            data-house-action="${overlay.confirmActionId}"
          >
            ${overlay.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}
function renderDebateOverlay(overlay) {
    return `
    <div class="c-grain-shop-overlay" data-house-overlay="debate">
      <div
        class="c-grain-shop-modal c-grain-shop-modal--game c-grain-shop-skin-panel c-tea-house-modal"
        role="dialog"
        aria-modal="true"
      >
        <header class="c-grain-shop-game__header">
          <h3 class="c-grain-shop-modal__title c-grain-shop-nameplate">${overlay.title}</h3>
          <div class="c-grain-shop-game__hud">
            <span>对手 <strong>${overlay.actorName}</strong></span>
            <span>回合 <strong>${overlay.round}</strong></span>
            <span>倒计时 <strong>${overlay.secondsLeft}</strong> 秒</span>
          </div>
          <div class="c-grain-shop-game__hud">
            <span>你的气势 <strong>${overlay.playerSpirit}</strong></span>
            <span>对方气势 <strong>${overlay.npcSpirit}</strong></span>
            <span>超时 <strong>${overlay.timeoutCount}</strong> 次</span>
          </div>
        </header>
        ${overlay.lastRoundSummary.length === 0
        ? ""
        : `
              <div class="c-grain-shop-ledger c-grain-shop-skin-card c-tea-house-debate__summary">
                ${overlay.lastRoundSummary.map((line) => `<p>${line}</p>`).join("")}
              </div>
            `}
        <div class="c-grain-shop-game__actions c-tea-house-topic-grid">
          ${overlay.topicActionIds
        .map((topicAction) => `
                <button
                  type="button"
                  class="c-button c-grain-shop-button c-grain-shop-button--gold c-tea-house-topic-grid__button"
                  data-house-action="${topicAction.actionId}"
                >
                  ${topicAction.topic}
                </button>
              `)
        .join("")}
        </div>
      </div>
    </div>
  `;
}
function renderOverlay(overlay) {
    if (overlay == null) {
        return "";
    }
    if (overlay.type === "alert") {
        return renderAlertOverlay(overlay);
    }
    if (overlay.type === "debate") {
        return renderDebateOverlay(overlay);
    }
    return "";
}
function renderActionContainer(viewModel) {
    if (viewModel.actionContainer == null) {
        return "";
    }
    return `
    <div class="c-grain-shop-center c-grain-shop-center--open">
      <nav
        class="c-grain-shop-actions"
        aria-label="${viewModel.actionContainer.title ?? "房屋操作"}"
      >
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
    <aside class="c-grain-shop-npc-idle c-tea-house-npc-idle" aria-label="茶馆人物">
      ${viewModel.standbyRoster
        .map((actor) => `
            <button
              type="button"
              class="c-grain-shop-npc-idle__button ${actor.isSelected ? "is-selected" : ""}"
              ${actor.actionId == null ? "" : `data-house-action="${actor.actionId}"`}
              aria-label="与${actor.name}交谈"
            >
              <div class="c-grain-shop-avatar" aria-hidden="true">
                <span class="c-grain-shop-avatar__art"></span>
              </div>
              <p class="c-grain-shop-avatar__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
                ${actor.name}
              </p>
              ${actor.title == null ? "" : `<span class="c-tea-house-npc-idle__title">${actor.title}</span>`}
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
    <footer class="c-grain-shop-dialogue c-tea-house-dialogue" aria-label="对话">
      <div
        class="c-grain-shop-dialogue__text c-grain-shop-skin-card ${clickable ? "c-grain-shop-dialogue__text--clickable" : ""}"
        ${clickable ? `data-house-action="${viewModel.dialogue.advanceActionId}" role="button" tabindex="0"` : ""}
      >
        ${viewModel.dialogue.textLines
        .map((line) => `<p class="c-grain-shop-dialogue__line">${line}</p>`)
        .join("")}
        ${viewModel.dialogue.advanceHintText == null
        ? ""
        : `<p class="c-grain-shop-dialogue__hint">${viewModel.dialogue.advanceHintText}</p>`}
      </div>
      <div class="c-grain-shop-dialogue__npc">
        <div class="c-grain-shop-portrait" aria-hidden="true">
          <span class="c-grain-shop-portrait__art"></span>
        </div>
        <p class="c-grain-shop-portrait__name c-grain-shop-nameplate c-grain-shop-nameplate--small">
          ${viewModel.dialogue.speakerName ?? ""}
        </p>
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
      ${viewModel.statusCard.subtitle == null
        ? ""
        : `<p class="c-grain-shop-scene-card__subtitle">${viewModel.statusCard.subtitle}</p>`}
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
function renderTeaHouseHouseView(viewModel) {
    const showLeaveButton = viewModel.overlay?.type !== "debate";
    return `
    <section class="view-house-grain-shop view-house-tea-house" data-house-module="${viewModel.moduleId}">
      ${renderActionContainer(viewModel)}
      ${renderStandbyRoster(viewModel)}
      ${renderDialogue(viewModel)}
      ${showLeaveButton
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
