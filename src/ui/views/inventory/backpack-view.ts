import type {
  BackpackItemCategoryFilter,
  BackpackItemDefinition,
} from "../../../domain/item";
import {
  filterBackpackItems,
  resolveSelectedBackpackItemId,
} from "../../../application/inventory/item-inventory";
import { getBackpackActionButtonSound } from "./backpack-button-sound-policy";

const BACKPACK_FILTER_LABELS: Record<BackpackItemCategoryFilter, string> = {
  all: "全部",
  equipment: "装备",
  food: "食物",
  other: "其他",
};

function renderCityChoiceSkin(): string {
  return `
    <span class="c-city-choice-skin" aria-hidden="true">
      <span class="c-city-choice-skin__part c-city-choice-skin__part--tl"></span>
      <span class="c-city-choice-skin__part c-city-choice-skin__part--t"></span>
      <span class="c-city-choice-skin__part c-city-choice-skin__part--tr"></span>
      <span class="c-city-choice-skin__part c-city-choice-skin__part--l"></span>
      <span class="c-city-choice-skin__part c-city-choice-skin__part--c"></span>
      <span class="c-city-choice-skin__part c-city-choice-skin__part--r"></span>
      <span class="c-city-choice-skin__part c-city-choice-skin__part--bl"></span>
      <span class="c-city-choice-skin__part c-city-choice-skin__part--b"></span>
      <span class="c-city-choice-skin__part c-city-choice-skin__part--br"></span>
    </span>
  `;
}

function renderItemTypes(types: string[]): string {
  return types.join(";");
}

function isImageIcon(icon: string): boolean {
  return (
    icon.startsWith("/") ||
    icon.startsWith("./") ||
    icon.startsWith("../") ||
    icon.startsWith("http://") ||
    icon.startsWith("https://") ||
    icon.startsWith("data:image/") ||
    /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(icon)
  );
}

function renderItemIcon(item: BackpackItemDefinition): string {
  return item.icon == null || item.icon.length === 0 || !isImageIcon(item.icon)
    ? ""
    : `<span class="c-backpack-table__icon"><img class="c-backpack-table__icon-image" src="${item.icon}" alt=""></span>`;
}

function renderDetailIcon(item: BackpackItemDefinition): string {
  return item.icon != null && isImageIcon(item.icon)
    ? `<img class="c-backpack-detail__icon-image" src="${item.icon}" alt="">`
    : "<span>物</span>";
}

export function renderBackpackView(input: {
  items: BackpackItemDefinition[];
  filter: BackpackItemCategoryFilter;
  selectedItemId: string | null;
}): string {
  const visibleItems = filterBackpackItems(input.items, input.filter);
  const selectedItemId = resolveSelectedBackpackItemId(
    visibleItems,
    input.selectedItemId
  );
  const selectedItem =
    visibleItems.find((item) => item.id === selectedItemId) ?? null;

  return `
    <section class="view-library-overlay view-backpack-overlay">
      <div class="c-library-shell c-backpack-shell c-panel">
        <header class="c-library-shell__header">
          <div>
            <p class="c-library-shell__eyebrow">道具</p>
            <h1 class="c-library-shell__title">背包</h1>
          </div>
          <button class="c-button c-button--ghost" type="button" data-action="close-overlay" data-button-sound="light">返回</button>
        </header>
        <div class="c-library-shell__toolbar c-library-shell__toolbar--between">
          <div class="c-filter-row">
            ${(["all", "equipment", "food", "other"] as const)
              .map(
                (filterKey) => `
                  <button
                    class="c-filter-chip ${input.filter === filterKey ? "is-active" : ""}"
                    type="button"
                    data-backpack-filter="${filterKey}"
                    data-button-sound="light"
                  >
                    ${BACKPACK_FILTER_LABELS[filterKey]}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
        <div class="c-library-shell__body c-backpack-shell__body">
          <div class="c-library-table-wrap c-backpack-table-wrap">
            <table class="c-library-table c-backpack-table">
              <thead>
                <tr>
                  <th>icon</th>
                  <th>名字</th>
                  <th>价值</th>
                  <th>类型</th>
                  <th>持有数</th>
                </tr>
              </thead>
              <tbody>
                ${visibleItems
                  .map((item) => {
                    const isSelected = item.id === selectedItemId;
                    return `
                      <tr class="c-backpack-table__row ${isSelected ? "is-selected" : ""}" data-backpack-item-id="${item.id}">
                        <td>${renderItemIcon(item)}</td>
                        <td>
                          <button class="c-library-table__select c-backpack-table__select" type="button" data-backpack-item-id="${item.id}" data-button-sound="light">
                            ${renderCityChoiceSkin()}
                            <span>${item.name}</span>
                          </button>
                        </td>
                        <td>${item.value}</td>
                        <td>${renderItemTypes(item.types)}</td>
                        <td>${item.count}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
          <article class="c-library-detail c-backpack-detail">
            ${
              selectedItem == null
                ? `
                  <div class="c-library-empty">
                    <strong>没有符合条件的道具</strong>
                    <p>当前分类下没有可显示的物品。</p>
                  </div>
                `
                : `
                  <div class="c-library-detail__hero">
                    <div class="c-library-portrait">
                      ${renderDetailIcon(selectedItem)}
                    </div>
                    <div class="c-library-detail__headline">
                      <p class="c-library-detail__eyebrow">${renderItemTypes(selectedItem.types)}</p>
                      <h2 class="c-library-detail__title">${selectedItem.name}</h2>
                    </div>
                  </div>
                  <dl class="c-library-detail__grid">
                    <div>
                      <dt>价值</dt>
                      <dd>${selectedItem.value}</dd>
                    </div>
                    <div>
                      <dt>持有数</dt>
                      <dd>${selectedItem.count}</dd>
                    </div>
                    <div>
                      <dt>类型</dt>
                      <dd>${renderItemTypes(selectedItem.types)}</dd>
                    </div>
                    <div>
                      <dt>说明</dt>
                      <dd>${selectedItem.detailText ?? selectedItem.description}</dd>
                    </div>
                  </dl>
                  <div class="c-library-detail__actions">
                    ${selectedItem.actions
                      .map(
                        (action) => `
                          <button
                            class="c-button"
                            type="button"
                            data-action="run-backpack-item-action"
                            data-backpack-item-id="${selectedItem.id}"
                            data-item-action-id="${action.id}"
                            data-button-sound="${getBackpackActionButtonSound(action.id)}"
                            ${action.disabled === true ? "disabled" : ""}
                          >
                            ${action.label}
                          </button>
                        `
                      )
                      .join("")}
                  </div>
                `
            }
          </article>
        </div>
      </div>
    </section>
  `;
}
