import {
  createCityCultureViewModel,
  createCityManagementViewModel,
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
import { renderCityStageScene } from "./city-stage-layout";
import haozhouCityBackgroundUrl from "../../../../ui/background/upload_1784207698799091496 (1).png?url";
import cityDiamondMapTextureUrl from "../../../../ui/yuansu/菱形格子/20260716-111958.png?url";

type IsoTileType = "stone" | "road" | "grass" | "water" | "courtyard";

type IsoTile = {
  x: number;
  y: number;
  type: IsoTileType;
};

const CITY_ISO_TILE_WIDTH = 56;
const CITY_ISO_TILE_HEIGHT = CITY_ISO_TILE_WIDTH / 2;
const CITY_ISO_MAP_SIZE = 20;

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

function renderCityMenuButtonSkin(): string {
  return `
    <span class="c-city-menu-button-skin" aria-hidden="true">
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--tl"></span>
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--t"></span>
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--tr"></span>
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--l"></span>
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--c"></span>
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--r"></span>
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--bl"></span>
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--b"></span>
      <span class="c-city-menu-button-skin__part c-city-menu-button-skin__part--br"></span>
    </span>
  `;
}

function renderCityDirectoryOption(option: CityEntryOption): string {
  return `
    <button
      type="button"
      class="c-city-directory__option"
      data-city-directory-character-id="${option.characterId}"
      data-button-sound="light"
      ${option.disabled ? "disabled" : ""}
    >
      ${renderCityChoiceSkin()}
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
          <button type="button" class="c-city-directory__close" data-action="close-city-directory" data-button-sound="light">
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

function renderCityLocationSubnav(input: {
  visibleHouseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
}): string {
  const cityEntryButtons = input.cityEntries.map(
    (cityEntry) => `
      <button
        type="button"
        class="c-city-menu__subnav-button"
        data-city-entry-id="${cityEntry.id}"
        data-city-location-entry-ref="${cityEntry.id}"
        data-enter-sound="enter"
        data-button-hover-sound="light"
      >
        <span class="c-city-menu__subnav-button-label">${cityEntry.name}</span>
      </button>
    `
  );
  const houseButtons = input.visibleHouseDefinitions.map(
    (houseDefinition) => `
      <button
        type="button"
        class="c-city-menu__subnav-button"
        data-house-id="${houseDefinition.id}"
        data-city-location-house-ref="${houseDefinition.id}"
        data-enter-sound="enter"
        data-button-hover-sound="light"
      >
        <span class="c-city-menu__subnav-button-label">${houseDefinition.name}</span>
      </button>
    `
  );

  return `
    <div class="c-city-menu__subnav" aria-label="地点列表">
      ${[...cityEntryButtons, ...houseButtons].join("")}
    </div>
  `;
}

function renderCityMenuButtons(input: {
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
}): string {
  const buttons = [
    { id: "culture", label: "风土人情" },
    { id: "intel", label: "情报" },
    { id: "management", label: "管理" },
    { id: "locations", label: "地点" },
  ];
  const visibleHouseDefinitions = input.houseDefinitions.filter(
    (houseDefinition) => houseDefinition.moduleId !== "leader-residence"
  );

  return `
    <div class="c-city-menu" aria-label="城市功能菜单">
      ${buttons
        .map(
          (button) => `
            <div class="c-city-menu__item${
              button.id === "locations" ? " c-city-menu__item--locations" : ""
            }">
              <button
                type="button"
                class="c-city-menu__button${
                  button.id === "locations"
                    ? " c-city-menu__button--active"
                    : ""
                }"
                ${
                  button.id === "locations"
                    ? 'aria-expanded="true"'
                    : `data-city-menu-open="${button.id}"`
                }
                data-button-sound="light"
              >
                ${renderCityMenuButtonSkin()}
                <span class="c-city-menu__button-label">${button.label}</span>
              </button>
              ${
                button.id === "locations"
                  ? renderCityLocationSubnav({
                      visibleHouseDefinitions,
                      cityEntries: input.cityEntries,
                    })
                  : ""
              }
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function createCitySceneTiles(): IsoTile[] {
  const tiles: IsoTile[] = [];
  const last = CITY_ISO_MAP_SIZE - 1;
  const moatMin = 2;
  const moatMax = CITY_ISO_MAP_SIZE - 3;
  const innerMin = 4;
  const innerMax = CITY_ISO_MAP_SIZE - 5;
  const centerA = Math.floor(CITY_ISO_MAP_SIZE / 2) - 1;
  const centerB = Math.floor(CITY_ISO_MAP_SIZE / 2);

  for (let y = 0; y < CITY_ISO_MAP_SIZE; y += 1) {
    for (let x = 0; x < CITY_ISO_MAP_SIZE; x += 1) {
      const isEdge = x === 0 || y === 0 || x === last || y === last;
      const isMoat =
        ((x === moatMin || x === moatMax) && y >= moatMin && y <= moatMax) ||
        ((y === moatMin || y === moatMax) && x >= moatMin && x <= moatMax);
      const isRoad =
        x === centerA || x === centerB || y === centerA || y === centerB;
      const isInnerCity =
        x >= innerMin && x <= innerMax && y >= innerMin && y <= innerMax;
      const isNorthwestCourtyard =
        x >= innerMin + 2 && x <= centerA - 2 && y >= innerMin + 2 && y <= centerA - 2;
      const isNortheastCourtyard =
        x >= centerB + 2 && x <= innerMax - 2 && y >= innerMin + 2 && y <= centerA - 2;
      const isSouthwestCourtyard =
        x >= innerMin + 2 && x <= centerA - 2 && y >= centerB + 2 && y <= innerMax - 2;
      const isSoutheastCourtyard =
        x >= centerB + 2 && x <= innerMax - 2 && y >= centerB + 2 && y <= innerMax - 2;
      const isCourtyard =
        isInnerCity &&
        (isNorthwestCourtyard ||
          isNortheastCourtyard ||
          isSouthwestCourtyard ||
          isSoutheastCourtyard);
      const type: IsoTileType = isMoat
        ? "water"
        : isEdge
          ? "grass"
          : isRoad
            ? "road"
            : isCourtyard
              ? "courtyard"
              : "stone";

      tiles.push({ x, y, type });
    }
  }

  return tiles;
}

function getIsoScreenPosition(tile: IsoTile): { x: number; y: number } {
  const rawX = (tile.x - tile.y) * (CITY_ISO_TILE_WIDTH / 2);
  const rawY = (tile.x + tile.y) * (CITY_ISO_TILE_HEIGHT / 2);
  const centerY =
    ((CITY_ISO_MAP_SIZE - 1) * CITY_ISO_TILE_HEIGHT) / 2;

  return {
    x: rawX,
    y: rawY - centerY,
  };
}

function renderCityIsometricMap(): string {
  return createCitySceneTiles()
    .map((tile) => {
      const screenPosition = getIsoScreenPosition(tile);

      return `
        <span
          class="c-city-isometric-tile c-city-isometric-tile--${tile.type}"
          style="--iso-x:${tile.x}; --iso-y:${tile.y}; --screen-x:${screenPosition.x}px; --screen-y:${screenPosition.y}px; --iso-tile-width:${CITY_ISO_TILE_WIDTH}px; --iso-tile-height:${CITY_ISO_TILE_HEIGHT}px; z-index:${tile.x + tile.y};"
          aria-hidden="true"
        ></span>
      `;
    })
    .join("");
}

function renderCityMapScene(input: {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
}): string {
  return renderCityStageScene(input);
}

function renderLocationsDeckView(input: {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
}): string {
  const visibleHouseDefinitions = input.houseDefinitions.filter(
    (houseDefinition) => houseDefinition.moduleId !== "leader-residence"
  );
  const cityEntryCards = input.cityEntries.map(
    (cityEntry) => `
      <button
        type="button"
        class="c-city-locations-subnav__button"
        data-city-entry-id="${cityEntry.id}"
        data-city-location-entry-ref="${cityEntry.id}"
        data-enter-sound="enter"
        data-button-hover-sound="light"
      >
        <span class="c-city-menu__subnav-button-label">${cityEntry.name}</span>
      </button>
    `
  );
  const houseCards = visibleHouseDefinitions.map(
    (houseDefinition) => `
      <button
        type="button"
        class="c-city-locations-subnav__button"
        data-house-id="${houseDefinition.id}"
        data-city-location-house-ref="${houseDefinition.id}"
        data-enter-sound="enter"
        data-button-hover-sound="light"
      >
        <span class="c-city-menu__subnav-button-label">${houseDefinition.name}</span>
      </button>
    `
  );

  return `
    <div class="c-city-locations-view" role="dialog" aria-modal="true" aria-label="${input.cityDefinition.name}地点">
      <div class="c-city-locations-view__backdrop"></div>
      <div class="c-city-locations-view__chrome">
        <div class="c-city-locations-view__header">
          <div>
            <p class="c-city-locations-view__eyebrow">城市地点</p>
            <h2 class="c-city-locations-view__title">${input.cityDefinition.name}</h2>
          </div>
        </div>
        <div class="c-city-locations-scene">
          <div class="c-city-locations-nav">
            <div class="c-city-locations-nav__primary">
              <button
                type="button"
                class="c-city-locations-nav__button c-city-locations-nav__button--active"
                aria-current="page"
              >
                地点
              </button>
            </div>
            <div class="c-city-locations-subnav">
              ${[...cityEntryCards, ...houseCards].join("")}
            </div>
          </div>
          <div class="c-city-isometric-map" aria-hidden="true">
            <div
              class="c-city-isometric-map__grid"
              style="--iso-map-width:${CITY_ISO_MAP_SIZE * CITY_ISO_TILE_WIDTH}px; --iso-map-height:${CITY_ISO_MAP_SIZE * CITY_ISO_TILE_HEIGHT}px;"
            >
              <img class="c-city-isometric-map__texture" src="${cityDiamondMapTextureUrl}" alt="" />
              ${renderCityIsometricMap()}
            </div>
          </div>
        </div>
        <div class="c-city-locations-view__deck">
          ${[...cityEntryCards, ...houseCards].join("")}
        </div>
        <button
          type="button"
          class="c-city-locations-view__return-action"
          data-action="close-city-menu"
          data-button-sound="light"
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
    return renderLocationsDeckView({
      cityDefinition: input.cityDefinition,
      houseDefinitions: input.houseDefinitions,
      cityEntries: input.cityEntries,
    });
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
                    ${renderCityChoiceSkin()}
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
            ${renderCityChoiceSkin()}
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
            ${renderCityChoiceSkin()}
            <strong class="c-city-menu-panel__lock-title">开始一次化缘</strong>
            <p class="c-city-menu-panel__hint">在城中接取粮食与钱物，小游戏结束后结算收益。</p>
            <button type="button" class="c-city-menu-panel__primary-action" data-action="start-begging-minigame" data-button-sound="light">
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
        </div>
        <div class="c-city-menu-panel__body">
          ${bodyMarkup}
        </div>
        <div class="c-city-menu-panel__actions">
          <button type="button" class="c-city-directory__close c-city-menu-panel__close" data-action="close-city-menu" data-button-sound="light">
            关闭
          </button>
        </div>
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
          data-button-sound="light"
          aria-label="进入 3D 城市场景"
        >
          3D
        </button>
      `;
  const haozhouCoinTestButton = `
    <button
      type="button"
      class="c-kulan-city__coin-test-action"
      data-action="grant-haozhou-test-coin"
      aria-label="测试获得十文钱"
    >
      测试+10文
    </button>
  `;

  return `
    <section class="view-city view-city--kulan">
      <div class="c-kulan-city">
        <img class="c-kulan-city__background-image" src="${haozhouCityBackgroundUrl}" alt="" aria-hidden="true" />
        <div class="c-kulan-city__body">
          <div class="c-kulan-city__stage">
            ${renderCityMapScene({
              cityDefinition,
              houseDefinitions,
              cityEntries,
            })}
            ${haozhouCoinTestButton}
            <button type="button" class="c-kulan-city__leave-action" data-action="leave-city" data-button-sound="light">
              返回地图
            </button>
            ${city3dButton}
            ${renderCityMenuButtons({
              houseDefinitions,
              cityEntries,
            })}
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
