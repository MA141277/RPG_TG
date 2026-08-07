import {
  createCityCultureViewModel,
  createCityManagementViewModel,
  type CityMenuEntryViewModel,
  type CityMenuState,
} from "../../../application/city-menu/city-menu";
import type { CharacterDefinition } from "../../../domain/character";
import type { CityDefinition } from "../../../domain/city";
import type {
  CityEntryDefinition,
  CityEntryOption,
} from "../../../domain/city-entry";
import type { CitySceneMapping } from "../../../domain/city-scene-mapping";
import { resolveCityBackgroundImageUrl } from "../../location-backgrounds";

function getCityEntryArtworkClass(cityEntry: CityEntryDefinition): string {
  switch (cityEntry.artworkId) {
    case "home-house":
      return "c-kulan-house-card--home-house";
    case "medicine-house":
      return "c-kulan-house-card--medicine-house";
    case "tea-house":
      return "c-kulan-house-card--tea-house";
    case "temple-house":
      return "c-kulan-house-card--temple-house";
    case "keep-house":
      return "c-kulan-house-card--keep";
    case "market-house":
      return "c-kulan-house-card--market";
    case "grain-shop":
      return "c-kulan-house-card--grain-shop";
    case "tavern":
      return "c-kulan-house-card--inn";
    case "leader-residence":
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
          .map((tag) => `<span class="c-city-directory__option-tag">${tag}</span>`)
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
            <p class="c-city-directory__eyebrow">城中名录</p>
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

function renderCityMenuButtons(cityMenuEntries: CityMenuEntryViewModel[]): string {
  if (cityMenuEntries.length === 0) {
    return "";
  }

  return `
    <div class="c-city-menu" aria-label="城市菜单">
      ${cityMenuEntries
        .map(
          (entry) => `
            <button
              type="button"
              class="c-city-menu__button${entry.isSpecial ? " c-city-menu__button--special" : ""}"
              data-city-menu-entry-id="${entry.id}"
              ${entry.isEnabled ? "" : "disabled"}
              ${entry.disabledHint.length === 0 ? "" : `title="${entry.disabledHint}"`}
            >
              ${entry.label}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderCityBackground(cityDefinition: CityDefinition): string {
  const backgroundImageUrl = resolveCityBackgroundImageUrl(
    cityDefinition.backgroundId
  );

  return `
    <div
      class="c-kulan-city__background-image"
      style="background-image:url('${backgroundImageUrl}')"
      aria-hidden="true"
    ></div>
  `;
}

function renderLocationsDeckView(input: {
  cityDefinition: CityDefinition;
  cityEntries: CityEntryDefinition[];
}): string {
  return `
    <div class="c-city-locations-view" role="dialog" aria-modal="true" aria-label="${input.cityDefinition.name}地点">
      <div class="c-city-locations-view__backdrop" data-action="close-city-menu"></div>
      <div class="c-city-locations-view__chrome">
        <div class="c-city-locations-view__header">
          <button type="button" class="c-city-locations-view__close" data-action="close-city-menu">
            关闭地点面板
          </button>
        </div>
        <div class="c-city-locations-view__deck" aria-label="城内地点卡片">
          ${input.cityEntries
            .map(
              (cityEntry) => `
                <button
                  type="button"
                  class="c-kulan-house-card ${getCityEntryArtworkClass(cityEntry)}"
                  data-city-entry-id="${cityEntry.id}"
                  aria-label="进入${cityEntry.name}"
                >
                  <span class="c-kulan-house-card__art" aria-hidden="true"></span>
                </button>
              `
            )
            .join("")}
        </div>
        <button
          type="button"
          class="c-city-locations-view__return-action"
          data-action="close-city-menu"
        >
          返回
        </button>
      </div>
    </div>
  `;
}

function renderCityMenuPanel(input: {
  cityDefinition: CityDefinition;
  cityEntries: CityEntryDefinition[];
  cityMenuState: CityMenuState | null;
}): string {
  if (input.cityMenuState == null) {
    return "";
  }

  const cultureViewModel = createCityCultureViewModel(input.cityDefinition);
  const managementViewModel = createCityManagementViewModel();
  let eyebrow = "城市面板";
  let title = input.cityMenuState.title;
  let bodyMarkup = "";

  if (input.cityMenuState.panelId === "locations") {
    return renderLocationsDeckView(input);
  }

  switch (input.cityMenuState.panelId) {
    case "overview":
      eyebrow = "城市概况";
      title = cultureViewModel.cityName;
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">城池简介</h3>
          <p class="c-city-menu-panel__paragraph">${cultureViewModel.description}</p>
        </section>
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">繁荣度</h3>
          <div class="c-city-menu-panel__economy">
            <strong class="c-city-menu-panel__economy-level">${cultureViewModel.economyLevel}</strong>
            <span class="c-city-menu-panel__economy-value">繁荣值：${cultureViewModel.economyValue}</span>
          </div>
        </section>
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">城市状态</h3>
          <dl class="c-city-menu-panel__meta">
            <div><dt>人口</dt><dd>${cultureViewModel.population ?? "暂无"}</dd></div>
            <div><dt>治安</dt><dd>${cultureViewModel.security ?? "暂无"}</dd></div>
          </dl>
        </section>
      `;
      break;
    case "intel":
      eyebrow = "城市情报";
      title = `${input.cityDefinition.name}情报`;
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <p class="c-city-menu-panel__hint">这里汇总当前城市中能打听到的风声、流言与线索，内容会随地点和人员变化。</p>
          <div class="c-city-menu-panel__intel-list">
            ${input.cityMenuState.intelItems
              .map(
                (intelItem) => `
                  <article class="c-city-menu-panel__intel-item">
                    <p>${intelItem}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `;
      break;
    case "management":
      eyebrow = "城市管理";
      title = "城市管理";
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <div class="c-city-menu-panel__lock">
            <strong class="c-city-menu-panel__lock-title">当前版本尚未开放完整的城市经营能力。</strong>
            <p class="c-city-menu-panel__hint">这里会承接后续的城务、税率、建设与治理功能，当前只保留只读占位信息。</p>
          </div>
          <dl class="c-city-menu-panel__meta">
            <div><dt>可管理</dt><dd>${managementViewModel.canManageTown ? "是" : "否"}</dd></div>
            <div><dt>城镇等级</dt><dd>${managementViewModel.townLevel ?? "暂无"}</dd></div>
            <div><dt>建筑列表</dt><dd>${managementViewModel.buildingList.length === 0 ? "暂无" : managementViewModel.buildingList.join("、")}</dd></div>
            <div><dt>税率</dt><dd>${managementViewModel.taxRate ?? "暂无"}</dd></div>
          </dl>
        </section>
      `;
      break;
  }

  return `
    <div class="c-city-directory c-city-menu-panel" role="dialog" aria-modal="true">
      <div class="c-city-directory__backdrop" data-action="close-city-menu"></div>
      <div class="c-city-directory__panel c-city-menu-panel__panel">
        <div class="c-city-directory__header">
          <div>
            <p class="c-city-directory__eyebrow">${eyebrow}</p>
            <h2 class="c-city-directory__title">${title}</h2>
          </div>
          <button type="button" class="c-city-directory__close" data-action="close-city-menu">
            关闭
          </button>
        </div>
        ${bodyMarkup}
      </div>
    </div>
  `;
}

export function renderCityView(
  cityDefinition: CityDefinition,
  _playerCharacter: CharacterDefinition,
  _houseDefinitions: unknown[],
  cityEntries: CityEntryDefinition[],
  cityMenuEntries: CityMenuEntryViewModel[],
  cityMenuState: CityMenuState | null,
  cityDirectoryState:
    | {
        title: string;
        options: CityEntryOption[];
      }
    | null,
  _citySceneMapping: CitySceneMapping | null = null
): string {
  return `
    <section class="view-city view-city--kulan">
      <div class="c-kulan-city">
        ${renderCityBackground(cityDefinition)}
        <div class="c-kulan-city__body">
          <div class="c-kulan-city__stage">
            <button type="button" class="c-kulan-city__leave-action" data-action="leave-city">
              返回地图
            </button>
            ${renderCityMenuButtons(cityMenuEntries)}
          </div>
        </div>
        ${renderCityMenuPanel({
          cityDefinition,
          cityEntries,
          cityMenuState,
        })}
        ${renderCityDirectory(cityDirectoryState)}
      </div>
    </section>
  `;
}
