import type { CityDefinition } from "../../../domain/city";
import type { HouseDefinition } from "../../../domain/house";
import cityBackgroundVideoUrl from "../../../../ui/background/city.mp4?url";

function getHouseArtworkClass(houseDefinition: HouseDefinition): string {
  switch (houseDefinition.id) {
    case "house.kulan.tea_house":
      return "c-kulan-house-card--tea-house";
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

export function renderCityView(
  _cityDefinition: CityDefinition,
  houseDefinitions: HouseDefinition[]
): string {
  return `
    <section class="view-city view-city--kulan">
      <div class="c-kulan-city">
        <video
          class="c-kulan-city__background-video"
          autoplay
          muted
          loop
          playsinline
          aria-hidden="true"
        >
          <source src="${cityBackgroundVideoUrl}" type="video/mp4" />
        </video>
        <div class="c-kulan-city__body">
          <div class="c-kulan-city__stage">
            <button type="button" class="c-kulan-city__leave-action" data-action="leave-city">
              返回地图
            </button>
            <div class="c-kulan-city__house-deck" aria-label="城内地点">
              ${houseDefinitions
                .map(
                  (houseDefinition) => `
                    <button
                      type="button"
                      class="c-kulan-house-card ${getHouseArtworkClass(houseDefinition)}"
                      data-house-id="${houseDefinition.id}"
                      aria-label="进入${houseDefinition.name}"
                    >
                      <span class="c-kulan-house-card__art" aria-hidden="true"></span>
                    </button>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
