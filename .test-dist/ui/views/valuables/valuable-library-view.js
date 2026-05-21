"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderValuableLibraryView = renderValuableLibraryView;
const VALUABLE_FILTER_LABELS = {
    all: "全部",
    equipment: "武具",
};
const VALUABLE_SORT_LABELS = {
    name: "名称",
    price: "价值",
    ownedCount: "持有数",
    category: "种类",
};
const CATEGORY_LABELS = {
    weapon: "刀剑",
    armor: "铠甲",
};
function getVisibleItems(items, filter) {
    if (filter === "all") {
        return items;
    }
    return items.filter((itemDefinition) => itemDefinition.category === "weapon" || itemDefinition.category === "armor");
}
function sortItems(items, sortKey, sortDirection) {
    const clonedItems = [...items];
    clonedItems.sort((leftItem, rightItem) => {
        const leftValue = sortKey === "category"
            ? leftItem.kindText
            : leftItem[sortKey];
        const rightValue = sortKey === "category"
            ? rightItem.kindText
            : rightItem[sortKey];
        const comparison = typeof leftValue === "number" && typeof rightValue === "number"
            ? leftValue - rightValue
            : String(leftValue).localeCompare(String(rightValue), "zh-Hans-CN");
        return sortDirection === "asc" ? comparison : comparison * -1;
    });
    return clonedItems;
}
function renderValuableLibraryView(input) {
    const visibleItems = sortItems(getVisibleItems(input.inventory.items, input.filter), input.sortKey, input.sortDirection);
    const selectedItem = visibleItems.find((itemDefinition) => itemDefinition.id === input.inventory.selectedItemId) ??
        visibleItems[0] ??
        null;
    const equippedWeaponSet = input.inventory.equippedWeaponSet;
    const isWeaponEquipped = selectedItem?.category === "weapon" && equippedWeaponSet.swordId === selectedItem.id;
    const isArmorEquipped = selectedItem?.category === "armor" && equippedWeaponSet.armorId === selectedItem.id;
    const canEquip = selectedItem != null && (selectedItem.category === "weapon" || selectedItem.category === "armor");
    return `
    <section class="view-library-overlay">
      <div class="c-library-shell c-panel">
        <header class="c-library-shell__header">
          <div>
            <p class="c-library-shell__eyebrow">贵重物</p>
            <h1 class="c-library-shell__title">贵重物清单</h1>
          </div>
          <button class="c-button c-button--ghost" type="button" data-action="close-overlay">返回</button>
        </header>
        <div class="c-library-shell__toolbar c-library-shell__toolbar--between">
          <div class="c-filter-row">
            ${["all", "equipment"]
        .map((filterKey) => `
                  <button
                    class="c-filter-chip ${input.filter === filterKey ? "is-active" : ""}"
                    type="button"
                    data-valuable-filter="${filterKey}"
                  >
                    ${VALUABLE_FILTER_LABELS[filterKey]}
                  </button>
                `)
        .join("")}
          </div>
          <div class="c-equipment-summary">
            <span>刀剑: ${equippedWeaponSet.swordId ?? "未装备"}</span>
            <span>铠甲: ${equippedWeaponSet.armorId ?? "未装备"}</span>
          </div>
        </div>
        <div class="c-library-shell__body">
          <div class="c-library-table-wrap">
            <table class="c-library-table">
              <thead>
                <tr>
                  ${["name", "price", "ownedCount", "category"]
        .map((sortKey) => `
                        <th>
                          <button
                            class="c-table-sort ${input.sortKey === sortKey ? "is-active" : ""}"
                            type="button"
                            data-valuable-sort="${sortKey}"
                          >
                            ${VALUABLE_SORT_LABELS[sortKey]}
                            ${input.sortKey === sortKey ? (input.sortDirection === "asc" ? "↑" : "↓") : ""}
                          </button>
                        </th>
                      `)
        .join("")}
                </tr>
              </thead>
              <tbody>
                ${visibleItems
        .map((itemDefinition) => {
        const isSelected = selectedItem?.id === itemDefinition.id;
        const equippedLabel = itemDefinition.category === "weapon" && equippedWeaponSet.swordId === itemDefinition.id
            ? "已装备"
            : itemDefinition.category === "armor" && equippedWeaponSet.armorId === itemDefinition.id
                ? "已装备"
                : "";
        return `
                      <tr class="${isSelected ? "is-selected" : ""}" data-valuable-id="${itemDefinition.id}">
                        <td>
                          <button class="c-library-table__select" type="button" data-valuable-id="${itemDefinition.id}">
                            ${itemDefinition.name}
                          </button>
                        </td>
                        <td>${itemDefinition.price}</td>
                        <td>${itemDefinition.ownedCount}</td>
                        <td>${itemDefinition.kindText}${equippedLabel.length > 0 ? ` / ${equippedLabel}` : ""}</td>
                      </tr>
                    `;
    })
        .join("")}
              </tbody>
            </table>
          </div>
          <article class="c-library-detail">
            ${selectedItem == null
        ? `
                  <div class="c-library-empty">
                    <strong>没有符合条件的贵重物</strong>
                    <p>当前筛选下没有可显示的物品。</p>
                  </div>
                `
        : `
                  <div class="c-library-detail__hero">
                    <div class="c-library-portrait">
                      <span>${selectedItem.itemImageId}</span>
                    </div>
                    <div class="c-library-detail__headline">
                      <p class="c-library-detail__eyebrow">${CATEGORY_LABELS[selectedItem.category]}</p>
                      <h2 class="c-library-detail__title">${selectedItem.name}</h2>
                    </div>
                  </div>
                  <dl class="c-library-detail__grid">
                    <div>
                      <dt>价值</dt>
                      <dd>${selectedItem.price}</dd>
                    </div>
                    <div>
                      <dt>持有数</dt>
                      <dd>${selectedItem.ownedCount}</dd>
                    </div>
                    <div>
                      <dt>种类</dt>
                      <dd>${selectedItem.kindText}</dd>
                    </div>
                    <div>
                      <dt>说明</dt>
                      <dd>${selectedItem.description}</dd>
                    </div>
                  </dl>
                  <div class="c-library-detail__actions">
                    ${canEquip
            ? `
                          <button class="c-button" type="button" data-action="equip-valuable" data-valuable-id="${selectedItem.id}">
                            ${isWeaponEquipped || isArmorEquipped ? "已装备" : "装备"}
                          </button>
                        `
            : ""}
                  </div>
                `}
          </article>
        </div>
      </div>
    </section>
  `;
}
