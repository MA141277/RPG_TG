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
import { resolveLocationBackgroundImageUrl } from "../../location-backgrounds";
import cityBackgroundVideoUrl from "../../../../ui/background/city.mp4?url";

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
        <p class="c-city-directory__option-meta">${option.factionLabel} 路 ${option.relationLabel}</p>
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
            <p class="c-city-directory__eyebrow">鏈煄浜虹墿</p>
            <h2 class="c-city-directory__title">${cityDirectoryState.title}</h2>
          </div>
          <button type="button" class="c-city-directory__close" data-action="close-city-directory">
            鍏抽棴
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
    <div class="c-city-menu" aria-label="鍩庡競鍔熻兘鑿滃崟">
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
  const backgroundImageUrl = resolveLocationBackgroundImageUrl(
    cityDefinition.backgroundId
  );

  if (backgroundImageUrl != null) {
    return `
      <div
        class="c-kulan-city__background-image"
        style="background-image:url('${backgroundImageUrl}')"
        aria-hidden="true"
      ></div>
    `;
  }

  return `
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
  `;
}

function renderLocationsDeckView(input: {
  cityDefinition: CityDefinition;
  cityEntries: CityEntryDefinition[];
}): string {
  return `
    <div class="c-city-locations-view" role="dialog" aria-modal="true" aria-label="${input.cityDefinition.name}鍦扮偣">
      <div class="c-city-locations-view__backdrop" data-action="close-city-menu"></div>
      <div class="c-city-locations-view__chrome">
        <div class="c-city-locations-view__header">
          <button type="button" class="c-city-locations-view__close" data-action="close-city-menu">
            杩斿洖鑿滃崟
          </button>
        </div>
        <div class="c-city-locations-view__deck" aria-label="鍩庡唴鍦扮偣鍗＄墖">
          ${input.cityEntries
            .map(
              (cityEntry) => `
                <button
                  type="button"
                  class="c-kulan-house-card ${getCityEntryArtworkClass(cityEntry)}"
                  data-city-entry-id="${cityEntry.id}"
                  aria-label="鎵撳紑${cityEntry.name}"
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
          杩斿洖
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
  let eyebrow = "鍩庡競鑿滃崟";
  let title = input.cityMenuState.title;
  let bodyMarkup = "";

  if (input.cityMenuState.panelId === "locations") {
    return renderLocationsDeckView(input);
  }

  switch (input.cityMenuState.panelId) {
    case "overview":
      eyebrow = "鍩庡競淇℃伅闈㈡澘";
      title = cultureViewModel.cityName;
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">浜烘枃鎻忚堪</h3>
          <p class="c-city-menu-panel__paragraph">${cultureViewModel.description}</p>
        </section>
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">缁忔祹鐘跺喌</h3>
          <div class="c-city-menu-panel__economy">
            <strong class="c-city-menu-panel__economy-level">${cultureViewModel.economyLevel}</strong>
            <span class="c-city-menu-panel__economy-value">economyValue: ${cultureViewModel.economyValue}</span>
          </div>
        </section>
        <section class="c-city-menu-panel__section">
          <h3 class="c-city-menu-panel__section-title">棰勭暀瀛楁</h3>
          <dl class="c-city-menu-panel__meta">
            <div><dt>population</dt><dd>${cultureViewModel.population ?? "寰呮帴鍏?"}</dd></div>
            <div><dt>security</dt><dd>${cultureViewModel.security ?? "寰呮帴鍏?"}</dd></div>
          </dl>
        </section>
      `;
      break;
    case "intel":
      eyebrow = "鍩庡競鎯呮姤闈㈡澘";
      title = `${input.cityDefinition.name}鎯呮姤`;
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <p class="c-city-menu-panel__hint">褰撳墠鐗堟湰浣跨敤妯℃嫙鎯呮姤锛屽悗缁皢鎺ュ叆鐪熷疄 House銆丯PC 涓庝簨浠跺唴瀹广€?/p>
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
      eyebrow = "绠＄悊闈㈡澘";
      title = "鍩庡競绠＄悊";
      bodyMarkup = `
        <section class="c-city-menu-panel__section">
          <div class="c-city-menu-panel__lock">
            <strong class="c-city-menu-panel__lock-title">闇€瑕佹垚涓哄煄涓绘垨鍔垮姏棰嗚鍚庤В閿併€?/strong>
            <p class="c-city-menu-panel__hint">褰撳墠鐗堟湰浠呬繚鐣欐帴鍙ｏ紝涓嶅疄鐜板缓璁俱€佸崌绾с€佺◣鐜囦笌娌诲畨鍔熻兘銆?/p>
          </div>
          <dl class="c-city-menu-panel__meta">
            <div><dt>canManageTown</dt><dd>${managementViewModel.canManageTown ? "true" : "false"}</dd></div>
            <div><dt>townLevel</dt><dd>${managementViewModel.townLevel ?? "寰呮帴鍏?"}</dd></div>
            <div><dt>buildingList</dt><dd>${managementViewModel.buildingList.length === 0 ? "寰呮帴鍏?" : managementViewModel.buildingList.join("銆?")}</dd></div>
            <div><dt>taxRate</dt><dd>${managementViewModel.taxRate ?? "寰呮帴鍏?"}</dd></div>
          </dl>
        </section>
      `;
      break;
    case "locations":
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
            鍏抽棴
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
          aria-label="杩涘叆 3D 鍩庡競鍦烘櫙"
        >
          3D
        </button>
      `;

  return `
    <section class="view-city view-city--kulan">
      <div class="c-kulan-city">
        ${renderCityBackground(cityDefinition)}
        <div class="c-kulan-city__body">
          <div class="c-kulan-city__stage">
            <button type="button" class="c-kulan-city__leave-action" data-action="leave-city">
              杩斿洖鍦板浘
            </button>
            ${city3dButton}
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
