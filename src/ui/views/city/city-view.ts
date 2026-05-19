import type { CityDefinition } from "../../../domain/city";
import type { HouseDefinition } from "../../../domain/house";

export function renderCityView(
  cityDefinition: CityDefinition,
  houseDefinitions: HouseDefinition[]
): string {
  return `
    <section class="view-city">
      <div class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">城内</p>
          <h1 class="c-stage-header__title">${cityDefinition.name}</h1>
        </div>
        <button class="c-button c-button--ghost" data-action="leave-city">返回地图</button>
      </div>
      <div class="c-city-layout">
        <div class="c-city-portrait c-city-portrait--large">
          <span class="c-city-portrait__label">${cityDefinition.name}</span>
        </div>
        <div class="c-house-list">
          ${houseDefinitions
            .map(
              (houseDefinition) => `
                <button class="c-house-card c-panel" data-house-id="${houseDefinition.id}">
                  <span class="c-house-card__type">${houseDefinition.type}</span>
                  <strong class="c-house-card__name">${houseDefinition.name}</strong>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}
