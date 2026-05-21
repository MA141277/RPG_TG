"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCityView = renderCityView;
function getHouseArtworkClass(houseDefinition) {
    switch (houseDefinition.id) {
        case "house.kulan.keep":
            return "c-kulan-house-card--keep";
        case "house.kulan.market":
            return "c-kulan-house-card--market";
        case "house.kulan.grain_shop":
            return "c-kulan-house-card--grain-shop";
        case "house.kulan.inn":
            return "c-kulan-house-card--inn";
        default:
            return "c-kulan-house-card--fallback";
    }
}
function renderCityView(cityDefinition, houseDefinitions) {
    const cityTags = (cityDefinition.tags ?? []).join(" / ");
    const statusSummary = `可访屋舍 ${houseDefinitions.length} 处`;
    return `
    <section class="view-city view-city--kulan">
      <div class="c-kulan-city">
        <header class="c-kulan-city__top">
          <div class="c-kulan-city__portrait-frame" aria-hidden="true"></div>
          <div class="c-kulan-city__status">
            <div class="c-kulan-city__status-copy">
              <p class="c-kulan-city__eyebrow">城内</p>
              <h1 class="c-kulan-city__title">${cityDefinition.name}</h1>
              <p class="c-kulan-city__meta">${cityTags}</p>
            </div>
            <div class="c-kulan-city__status-metrics" aria-label="城市信息">
              <p class="c-kulan-city__metric">
                <span class="c-kulan-city__metric-label">总览</span>
                <strong>${statusSummary}</strong>
              </p>
              <p class="c-kulan-city__metric">
                <span class="c-kulan-city__metric-label">当前区域</span>
                <strong>${cityDefinition.regionId}</strong>
              </p>
            </div>
          </div>
          <div class="c-kulan-city__menu">
            <span class="c-kulan-city__menu-button c-kulan-city__menu-button--info" aria-hidden="true"></span>
            <span class="c-kulan-city__menu-button c-kulan-city__menu-button--functions" aria-hidden="true"></span>
          </div>
        </header>

        <div class="c-kulan-city__body">
          <div class="c-kulan-city__stage">
            <button type="button" class="c-kulan-city__leave-action" data-action="leave-city">
              返回地图
            </button>
            <div class="c-kulan-city__house-deck" aria-label="城内地点">
              ${houseDefinitions
        .map((houseDefinition) => `
                    <button
                      type="button"
                      class="c-kulan-house-card ${getHouseArtworkClass(houseDefinition)}"
                      data-house-id="${houseDefinition.id}"
                      aria-label="进入${houseDefinition.name}"
                    >
                      <span class="c-kulan-house-card__art" aria-hidden="true"></span>
                    </button>
                  `)
        .join("")}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
