import type { CityDefinition } from "../../../domain/city";
import type {
  CityEntryDefinition,
  CityEntryOption,
} from "../../../domain/city-entry";
import type { HouseDefinition } from "../../../domain/house";
import cityBackgroundVideoUrl from "../../../../ui/background/city.mp4?url";

function getHouseArtworkClass(houseDefinition: HouseDefinition): string {
  switch (houseDefinition.id) {
    case "home_001":
      return "c-kulan-house-card--home-house";
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
    case "house.kulan.leader_residence":
      return "c-kulan-house-card--leader-residence";
    default:
      return "c-kulan-house-card--fallback";
  }
}

function renderCityDirectoryOption(option: CityEntryOption): string {
  return `
    <button
      type="button"
      class="c-city-directory__option"
      data-city-directory-character-id="${option.characterId}"
      ${option.disabled ? "disabled" : ""}
    >
      <div class="c-city-directory__option-copy">
        <div class="c-city-directory__option-header">
          <strong class="c-city-directory__option-title">${option.title}</strong>
          <span class="c-city-directory__option-status">${option.statusLabel}</span>
        </div>
        <p class="c-city-directory__option-subtitle">${option.subtitle}</p>
        <p class="c-city-directory__option-meta">${option.factionLabel} · ${option.relationLabel}</p>
      </div>
      <div class="c-city-directory__option-tags">
        ${option.tags
          .map(
            (tag) => `<span class="c-city-directory__option-tag">${tag}</span>`
          )
          .join("")}
      </div>
    </button>
  `;
}

function renderCityDirectory(
  cityDirectoryState:
    | {
        title: string;
        options: CityEntryOption[];
      }
    | null
): string {
  if (cityDirectoryState == null) {
    return "";
  }

  return `
    <div class="c-city-directory" role="dialog" aria-modal="true">
      <div class="c-city-directory__backdrop" data-action="close-city-directory"></div>
      <div class="c-city-directory__panel">
        <div class="c-city-directory__header">
          <div>
            <p class="c-city-directory__eyebrow">本城人物</p>
            <h2 class="c-city-directory__title">${cityDirectoryState.title}</h2>
          </div>
          <button type="button" class="c-city-directory__close" data-action="close-city-directory">
            关闭
          </button>
        </div>
        <div class="c-city-directory__list">
          ${cityDirectoryState.options.map(renderCityDirectoryOption).join("")}
        </div>
      </div>
    </div>
  `;
}

export function renderCityView(
  _cityDefinition: CityDefinition,
  houseDefinitions: HouseDefinition[],
  cityEntries: CityEntryDefinition[],
  cityDirectoryState:
    | {
        title: string;
        options: CityEntryOption[];
      }
    | null
): string {
  const visibleHouseDefinitions = houseDefinitions.filter(
    (houseDefinition) => houseDefinition.moduleId !== "leader-residence"
  );

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
              ${cityEntries
                .map(
                  (cityEntry) => `
                    <button
                      type="button"
                      class="c-kulan-house-card c-kulan-house-card--leader-residence"
                      data-city-entry-id="${cityEntry.id}"
                      aria-label="打开${cityEntry.name}"
                    >
                      <span class="c-kulan-house-card__art" aria-hidden="true"></span>
                    </button>
                  `
                )
                .join("")}
              ${visibleHouseDefinitions
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
        ${renderCityDirectory(cityDirectoryState)}
      </div>
    </section>
  `;
}
