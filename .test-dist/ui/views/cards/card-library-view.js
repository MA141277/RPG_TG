"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCardLibraryView = renderCardLibraryView;
const CARD_FILTER_LABELS = {
    all: "全部",
    "secret-technique": "秘技",
    battle: "合战",
};
function getVisibleCards(cardDefinitions, inventory, filter) {
    const ownedIdSet = new Set(inventory.ownedCardIds);
    return cardDefinitions.filter((cardDefinition) => {
        if (!ownedIdSet.has(cardDefinition.id)) {
            return false;
        }
        return filter === "all" ? true : cardDefinition.category === filter;
    });
}
function renderCardLibraryView(input) {
    const visibleCards = getVisibleCards(input.cardDefinitions, input.inventory, input.filter);
    const selectedCard = visibleCards.find((cardDefinition) => cardDefinition.id === input.inventory.selectedCardId) ??
        visibleCards[0] ??
        null;
    return `
    <section class="view-library-overlay">
      <div class="c-library-shell c-panel">
        <header class="c-library-shell__header">
          <div>
            <p class="c-library-shell__eyebrow">卡列表</p>
            <h1 class="c-library-shell__title">持有卡库</h1>
          </div>
          <button class="c-button c-button--ghost" type="button" data-action="close-overlay">返回</button>
        </header>
        <div class="c-library-shell__toolbar">
          ${["all", "secret-technique", "battle"]
        .map((filterKey) => `
                <button
                  class="c-filter-chip ${input.filter === filterKey ? "is-active" : ""}"
                  type="button"
                  data-card-filter="${filterKey}"
                >
                  ${CARD_FILTER_LABELS[filterKey]}
                </button>
              `)
        .join("")}
        </div>
        <div class="c-library-shell__body">
          <div class="c-library-list">
            ${visibleCards
        .map((cardDefinition) => `
                  <button
                    class="c-library-list__item ${selectedCard?.id === cardDefinition.id ? "is-selected" : ""}"
                    type="button"
                    data-card-id="${cardDefinition.id}"
                  >
                    <span class="c-library-list__title">${cardDefinition.name}</span>
                    <span class="c-library-list__meta">${CARD_FILTER_LABELS[cardDefinition.category]}</span>
                  </button>
                `)
        .join("")}
          </div>
          <article class="c-library-detail c-library-detail--card">
            ${selectedCard == null
        ? `
                  <div class="c-library-empty">
                    <strong>没有符合条件的卡</strong>
                    <p>当前筛选下没有可显示的卡片。</p>
                  </div>
                `
        : `
                  <div class="c-library-detail__hero">
                    <div class="c-library-portrait">
                      <span>${selectedCard.cardImageId}</span>
                    </div>
                    <div class="c-library-detail__headline">
                      <p class="c-library-detail__eyebrow">${CARD_FILTER_LABELS[selectedCard.category]}</p>
                      <h2 class="c-library-detail__title">${selectedCard.name}</h2>
                    </div>
                  </div>
                  <dl class="c-library-detail__grid">
                    <div>
                      <dt>技能描述</dt>
                      <dd>${selectedCard.skillDescription}</dd>
                    </div>
                    <div>
                      <dt>战场显示</dt>
                      <dd>${selectedCard.battlefieldDisplay}</dd>
                    </div>
                    <div>
                      <dt>使用兵料</dt>
                      <dd>${selectedCard.ammoCostText}</dd>
                    </div>
                    <div>
                      <dt>业务逻辑</dt>
                      <dd>${selectedCard.logicNotes ?? "后续补充"}</dd>
                    </div>
                  </dl>
                `}
          </article>
        </div>
      </div>
    </section>
  `;
}
