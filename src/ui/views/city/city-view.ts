import {
  createCityCultureViewModel,
  createCityManagementViewModel,
  isPlayerMonkIdentity,
  type CityMenuState,
} from "../../../application/city-menu/city-menu";
import type { CharacterDefinition } from "../../../domain/character";
import type { CityDefinition } from "../../../domain/city";
import type {
  CityEntryDefinition,
  CityEntryOption,
} from "../../../domain/city-entry";
import type { CitySceneMapping } from "../../../domain/city-scene-mapping";
import type { HouseDefinition } from "../../../domain/house";
import cityBackgroundVideoUrl from "../../../../ui/background/city.mp4?url";

function getHouseArtworkClass(houseDefinition: HouseDefinition): string {
  switch (houseDefinition.moduleId) {
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

function renderCityMenuButtons(playerCharacter: CharacterDefinition): string {
  const baseButtons = [
    { id: "culture", label: "风土人情" },
    { id: "intel", label: "情报" },
    { id: "locations", label: "地点" },
    { id: "management", label: "管理" },
  ];
  const buttons = isPlayerMonkIdentity(playerCharacter)
    ? [...baseButtons, { id: "begging", label: "化缘" }]
    : baseButtons;

  return `
    <div class="c-city-menu" aria-label="城市功能菜单">
      ${buttons
        .map(
          (button) => `
            <button
              type="button"
              class="c-city-menu__button${button.id === "begging" ? " c-city-menu__button--special" : ""}"
              data-city-menu-open="${button.id}"
            >
              ${button.label}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderLocationsDeckView(input: {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
}): string {
  const visibleHouseDefinitions = input.houseDefinitions.filter(
    (houseDefinition) => houseDefinition.moduleId !== "leader-residence"
  );

  return `
    <div class="c-city-locations-view" role="dialog" aria-modal="true" aria-label="${input.cityDefinition.name}地点">
      <div class="c-city-locations-view__backdrop" data-action="close-city-menu"></div>
      <div class="c-city-locations-view__chrome">
        <div class="c-city-locations-view__header">
          <button type="button" class="c-city-locations-view__close" data-action="close-city-menu">
            返回菜单
          </button>
        </div>
        <div class="c-city-locations-view__deck" aria-label="城内地点卡片">
          ${input.cityEntries
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
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
  cityMenuState: CityMenuState | null;
}): string {
  if (input.cityMenuState == null) {
    return "";
  }

  const cultureViewModel = createCityCultureViewModel(input.cityDefinition);
  const managementViewModel = createCityManagementViewModel();
  let eyebrow = "城市菜单";
  let title = "城市功能";
  let bodyMarkup = "";

  if (input.cityMenuState.panelId === "locations") {
    return renderLocationsDeckView(input);
  }

  switch (input.cityMenuState.panelId) {
    case "culture":
      eyebrow = "城市信息面板";
      title = cultureViewModel.cityName;
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">人文描述</h3>
          <p class="c-city-menu-panel__paragraph">${cultureViewModel.description}</p>
        </section>
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">经济状况</h3>
          <div class="c-city-menu-panel__economy">
            <strong class="c-city-menu-panel__economy-level">${cultureViewModel.economyLevel}</strong>
            <span class="c-city-menu-panel__economy-value">economyValue: ${cultureViewModel.economyValue}</span>
          </div>
        </section>
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">预留字段</h3>
          <dl class="c-city-menu-panel__meta">
            <div><dt>population</dt><dd>${cultureViewModel.population ?? "待接入"}</dd></div>
            <div><dt>security</dt><dd>${cultureViewModel.security ?? "待接入"}</dd></div>
          </dl>
        </section>
      `;
      break;
    case "intel":
      eyebrow = "城市情报面板";
      title = `${input.cityDefinition.name}情报`;
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <p class="c-city-menu-panel__hint">当前版本使用模拟情报，后续将接入真实 House、NPC 与事件内容。</p>
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
      eyebrow = "管理面板";
      title = "城市管理";
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <div class="c-city-menu-panel__lock">
            <strong class="c-city-menu-panel__lock-title">需要成为城主或势力领袖后解锁。</strong>
            <p class="c-city-menu-panel__hint">当前版本仅保留接口，不实现建设、升级、税率与治安功能。</p>
          </div>
          <dl class="c-city-menu-panel__meta">
            <div><dt>canManageTown</dt><dd>${managementViewModel.canManageTown ? "true" : "false"}</dd></div>
            <div><dt>townLevel</dt><dd>${managementViewModel.townLevel ?? "待接入"}</dd></div>
            <div><dt>buildingList</dt><dd>${managementViewModel.buildingList.length === 0 ? "待接入" : managementViewModel.buildingList.join("、")}</dd></div>
            <div><dt>taxRate</dt><dd>${managementViewModel.taxRate ?? "待接入"}</dd></div>
          </dl>
        </section>
      `;
      break;
    case "begging":
      eyebrow = "化缘";
      title = "化缘小游戏";
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <div class="c-city-menu-panel__lock">
            <strong class="c-city-menu-panel__lock-title">开始一次化缘</strong>
            <p class="c-city-menu-panel__hint">在城中接取粮食与钱物，小游戏结束后结算收益。</p>
            <button type="button" class="c-city-menu-panel__primary-action" data-action="start-begging-minigame">
              开始化缘
            </button>
          </div>
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
  playerCharacter: CharacterDefinition,
  houseDefinitions: HouseDefinition[],
  cityEntries: CityEntryDefinition[],
  cityMenuState: CityMenuState | null,
  cityDirectoryState:
    | {
        title: string;
        options: CityEntryOption[];
      }
    | null,
  citySceneMapping: CitySceneMapping | null = null
): string {
  const city3dButton =
    citySceneMapping == null
      ? ""
      : `
        <button
          type="button"
          class="c-kulan-city__three-d-action"
          data-action="enter-city-3d"
          aria-label="进入 3D 城市场景"
        >
          3D
        </button>
      `;

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
            ${city3dButton}
            ${renderCityMenuButtons(playerCharacter)}
          </div>
        </div>
        ${renderCityMenuPanel({
          cityDefinition,
          houseDefinitions,
          cityEntries,
          cityMenuState,
        })}
        ${renderCityDirectory(cityDirectoryState)}
      </div>
    </section>
  `;
}
