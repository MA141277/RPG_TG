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
import cityDiamondBaseTextureUrl from "../../../../ui/yuansu/菱形格子/20260716-111958.png?url";
import cityDiamondForegroundWallUrl from "../../../../ui/yuansu/菱形格子/20260716-141239.png?url";
import cityBuildingLeaderResidenceUrl from "../../../../ui/yuansu/菱形格子/upload_1784633870754903686.png?url";
import cityBuildingKeepUrl from "../../../../ui/yuansu/菱形格子/shuaifu.png?url";
import cityBuildingTeaHouseUrl from "../../../../ui/yuansu/菱形格子/chaguan.png?url";
import cityBuildingMarketUrl from "../../../../ui/yuansu/菱形格子/huozhai.png?url";
import cityBuildingGrainShopUrl from "../../../../ui/yuansu/菱形格子/liangpu.png?url";
import cityBuildingMedicineHouseUrl from "../../../../ui/yuansu/菱形格子/yaopu.png?url";
import cityBuildingTempleUrl from "../../../../ui/yuansu/菱形格子/huangjuesi.png?url";
import cityBuildingInnUrl from "../../../../ui/yuansu/菱形格子/kezhan.png?url";
import cityDecorHouse1Url from "../../../../ui/yuansu/菱形格子/1.png?url";
import cityDecorHouse2Url from "../../../../ui/yuansu/菱形格子/2.png?url";
import cityDecorHouse3Url from "../../../../ui/yuansu/菱形格子/3.png?url";
import cityDecorGrass1Url from "../../../../ui/yuansu/菱形格子/grass.png?url";
import cityDecorGrass2Url from "../../../../ui/yuansu/菱形格子/grass2.png?url";

type IsoTileType = "stone" | "road" | "grass" | "water" | "courtyard";

type IsoTile = {
  x: number;
  y: number;
  type: IsoTileType;
};

type CityMapBuildingEntry =
  | { type: "house"; houseId: string }
  | { type: "city-entry"; cityEntryId: string };

type CityMapBuildingPrototype = {
  id: string;
  name: string;
  entry: CityMapBuildingEntry;
  imageUrl: string;
  baseX: number;
  baseY: number;
  assetWidth: number;
  assetHeight: number;
  renderScale: number;
  ringWidth: number;
  ringHeight: number;
  ringOffsetY: number;
  labelAnchorOffsetX: number;
  labelAnchorOffsetY: number;
};

type CityMapPoint = {
  x: number;
  y: number;
};

type CityMapDecorHouseItem = {
  id: string;
  kind: "decor-house";
  imageUrl: string;
  baseX: number;
  baseY: number;
  assetWidth: number;
  assetHeight: number;
  targetWidth: number;
};

type CityMapGroundDecorItem = {
  id: string;
  kind: "grass";
  imageUrl: string;
  baseX: number;
  baseY: number;
  assetWidth: number;
  assetHeight: number;
  targetWidth: number;
  opacity?: number;
};

type CityMapBoundsInput = {
  id: string;
  baseX: number;
  baseY: number;
  assetWidth: number;
  assetHeight: number;
  renderScale?: number;
  targetWidth?: number;
};

type CityMapVisualClearanceItem = {
  id: string;
  label: string;
  kind: "special" | "decor";
  baseX: number;
  baseY: number;
  visualHalfWidth: number;
  visualHalfHeight: number;
};

const CITY_ISO_TILE_WIDTH = 56;
const CITY_ISO_TILE_HEIGHT = CITY_ISO_TILE_WIDTH / 2;
const CITY_ISO_MAP_SIZE = 20;
const CITY_MAP_STAGE_WIDTH = 2048;
const CITY_MAP_STAGE_HEIGHT = 1152;
const CITY_MAP_BASE_X = 139;
const CITY_MAP_BASE_Y = 88;
const CITY_MAP_BASE_WIDTH = 1771;
const CITY_MAP_BASE_HEIGHT = 976;
const CITY_MAP_BASE_LEFT_PERCENT = (CITY_MAP_BASE_X / CITY_MAP_STAGE_WIDTH) * 100;
const CITY_MAP_BASE_TOP_PERCENT = (CITY_MAP_BASE_Y / CITY_MAP_STAGE_HEIGHT) * 100;
const CITY_MAP_BASE_WIDTH_PERCENT =
  (CITY_MAP_BASE_WIDTH / CITY_MAP_STAGE_WIDTH) * 100;
const CITY_MAP_BASE_HEIGHT_PERCENT =
  (CITY_MAP_BASE_HEIGHT / CITY_MAP_STAGE_HEIGHT) * 100;
const CITY_BUILDING_RENDER_SCALE = 0.24;

const CITY_MAP_BUILDABLE_POLYGON: CityMapPoint[] = [
  { x: 620, y: 245 },
  { x: 1190, y: 245 },
  { x: 1560, y: 470 },
  { x: 1570, y: 615 },
  { x: 1220, y: 810 },
  { x: 690, y: 815 },
  { x: 250, y: 620 },
  { x: 245, y: 485 },
];

const CITY_MAP_BUILDING_PROTOTYPES: CityMapBuildingPrototype[] = [
  {
    id: "keep",
    name: "帅府",
    entry: { type: "house", houseId: "house.kulan.keep" },
    imageUrl: cityBuildingKeepUrl,
    baseX: 985,
    baseY: 355,
    assetWidth: 1333,
    assetHeight: 710,
    renderScale: CITY_BUILDING_RENDER_SCALE,
    ringWidth: 148,
    ringHeight: 60,
    ringOffsetY: -8,
    labelAnchorOffsetX: 0,
    labelAnchorOffsetY: -162,
  },
  {
    id: "leader-residence",
    name: "将领府邸",
    entry: {
      type: "city-entry",
      cityEntryId: "city-entry.kulan.leader-residence",
    },
    imageUrl: cityBuildingLeaderResidenceUrl,
    baseX: 675,
    baseY: 455,
    assetWidth: 1259,
    assetHeight: 859,
    renderScale: CITY_BUILDING_RENDER_SCALE,
    ringWidth: 132,
    ringHeight: 56,
    ringOffsetY: -8,
    labelAnchorOffsetX: -6,
    labelAnchorOffsetY: -158,
  },
  {
    id: "temple",
    name: "皇觉寺",
    entry: { type: "house", houseId: "house.kulan.temple" },
    imageUrl: cityBuildingTempleUrl,
    baseX: 1315,
    baseY: 465,
    assetWidth: 1066,
    assetHeight: 783,
    renderScale: CITY_BUILDING_RENDER_SCALE,
    ringWidth: 128,
    ringHeight: 56,
    ringOffsetY: -8,
    labelAnchorOffsetX: 4,
    labelAnchorOffsetY: -168,
  },
  {
    id: "market",
    name: "货栈",
    entry: { type: "house", houseId: "house.kulan.market" },
    imageUrl: cityBuildingMarketUrl,
    baseX: 455,
    baseY: 600,
    assetWidth: 975,
    assetHeight: 722,
    renderScale: CITY_BUILDING_RENDER_SCALE,
    ringWidth: 118,
    ringHeight: 52,
    ringOffsetY: -8,
    labelAnchorOffsetX: -4,
    labelAnchorOffsetY: -158,
  },
  {
    id: "tea-house",
    name: "茶馆",
    entry: { type: "house", houseId: "house.kulan.tea_house" },
    imageUrl: cityBuildingTeaHouseUrl,
    baseX: 725,
    baseY: 680,
    assetWidth: 1003,
    assetHeight: 770,
    renderScale: CITY_BUILDING_RENDER_SCALE,
    ringWidth: 120,
    ringHeight: 52,
    ringOffsetY: -8,
    labelAnchorOffsetX: 0,
    labelAnchorOffsetY: -162,
  },
  {
    id: "grain-shop",
    name: "粮铺",
    entry: { type: "house", houseId: "house.kulan.grain_shop" },
    imageUrl: cityBuildingGrainShopUrl,
    baseX: 1015,
    baseY: 610,
    assetWidth: 1054,
    assetHeight: 804,
    renderScale: CITY_BUILDING_RENDER_SCALE,
    ringWidth: 124,
    ringHeight: 54,
    ringOffsetY: -8,
    labelAnchorOffsetX: 0,
    labelAnchorOffsetY: -166,
  },
  {
    id: "medicine-house",
    name: "药铺",
    entry: { type: "house", houseId: "house.kulan.medicine_house" },
    imageUrl: cityBuildingMedicineHouseUrl,
    baseX: 1255,
    baseY: 710,
    assetWidth: 1068,
    assetHeight: 710,
    renderScale: CITY_BUILDING_RENDER_SCALE,
    ringWidth: 122,
    ringHeight: 52,
    ringOffsetY: -8,
    labelAnchorOffsetX: 4,
    labelAnchorOffsetY: -158,
  },
  {
    id: "inn",
    name: "客栈",
    entry: { type: "house", houseId: "house.kulan.inn" },
    imageUrl: cityBuildingInnUrl,
    baseX: 1485,
    baseY: 635,
    assetWidth: 909,
    assetHeight: 829,
    renderScale: CITY_BUILDING_RENDER_SCALE,
    ringWidth: 120,
    ringHeight: 52,
    ringOffsetY: -8,
    labelAnchorOffsetX: 8,
    labelAnchorOffsetY: -174,
  },
];

const CITY_MAP_DECOR_HOUSE_ITEMS: CityMapDecorHouseItem[] = [
  {
    id: "decor-house-01",
    kind: "decor-house",
    imageUrl: cityDecorHouse1Url,
    baseX: 515,
    baseY: 505,
    assetWidth: 1065,
    assetHeight: 668,
    targetWidth: 210,
  },
  {
    id: "decor-house-02",
    kind: "decor-house",
    imageUrl: cityDecorHouse3Url,
    baseX: 875,
    baseY: 515,
    assetWidth: 701,
    assetHeight: 592,
    targetWidth: 190,
  },
  {
    id: "decor-house-03",
    kind: "decor-house",
    imageUrl: cityDecorHouse2Url,
    baseX: 1185,
    baseY: 535,
    assetWidth: 1003,
    assetHeight: 648,
    targetWidth: 205,
  },
  {
    id: "decor-house-04",
    kind: "decor-house",
    imageUrl: cityDecorHouse3Url,
    baseX: 560,
    baseY: 705,
    assetWidth: 701,
    assetHeight: 592,
    targetWidth: 188,
  },
  {
    id: "decor-house-05",
    kind: "decor-house",
    imageUrl: cityDecorHouse1Url,
    baseX: 900,
    baseY: 775,
    assetWidth: 1065,
    assetHeight: 668,
    targetWidth: 205,
  },
  {
    id: "decor-house-06",
    kind: "decor-house",
    imageUrl: cityDecorHouse2Url,
    baseX: 1165,
    baseY: 790,
    assetWidth: 1003,
    assetHeight: 648,
    targetWidth: 205,
  },
  {
    id: "decor-house-07",
    kind: "decor-house",
    imageUrl: cityDecorHouse3Url,
    baseX: 1405,
    baseY: 545,
    assetWidth: 701,
    assetHeight: 592,
    targetWidth: 188,
  },
];

const CITY_MAP_GROUND_DECOR_ITEMS: CityMapGroundDecorItem[] = [
  {
    id: "grass-01",
    kind: "grass",
    imageUrl: cityDecorGrass1Url,
    baseX: 775,
    baseY: 565,
    assetWidth: 1356,
    assetHeight: 726,
    targetWidth: 250,
    opacity: 0.72,
  },
  {
    id: "grass-02",
    kind: "grass",
    imageUrl: cityDecorGrass2Url,
    baseX: 1190,
    baseY: 600,
    assetWidth: 1525,
    assetHeight: 718,
    targetWidth: 270,
    opacity: 0.7,
  },
  {
    id: "grass-03",
    kind: "grass",
    imageUrl: cityDecorGrass1Url,
    baseX: 965,
    baseY: 805,
    assetWidth: 1356,
    assetHeight: 726,
    targetWidth: 245,
    opacity: 0.7,
  },
];

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
            <div class="c-city-menu__item c-city-menu__item--${button.id}">
              <button
                type="button"
                class="c-city-menu__button${
                  button.id === "locations"
                    ? " c-city-menu__button--active"
                    : ""
                }"
                ${
                  button.id === "locations"
                    ? 'aria-haspopup="true"'
                    : `data-city-menu-open="${button.id}"`
                }
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

function formatStagePercent(value: number): string {
  return `${Number(value.toFixed(6))}%`;
}

function getCityMapItemRenderScale(item: CityMapBoundsInput): number {
  if (item.renderScale != null) {
    return item.renderScale;
  }

  if (item.targetWidth != null) {
    return item.targetWidth / item.assetWidth;
  }

  return 1;
}

function getCityMapItemRenderedSize(item: CityMapBoundsInput): {
  width: number;
  height: number;
} {
  const renderScale = getCityMapItemRenderScale(item);

  return {
    width: item.assetWidth * renderScale,
    height: item.assetHeight * renderScale,
  };
}

function getCityMapItemBounds(item: CityMapBoundsInput): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} {
  const renderedSize = getCityMapItemRenderedSize(item);

  return {
    left: item.baseX - renderedSize.width / 2,
    right: item.baseX + renderedSize.width / 2,
    top: item.baseY - renderedSize.height,
    bottom: item.baseY,
  };
}

function isCityMapItemWithinBaseSpace(item: CityMapBoundsInput): boolean {
  const bounds = getCityMapItemBounds(item);

  return (
    bounds.left >= 0 &&
    bounds.right <= CITY_MAP_BASE_WIDTH &&
    bounds.top >= 0 &&
    bounds.bottom <= CITY_MAP_BASE_HEIGHT
  );
}

function isPointInPolygon(point: CityMapPoint, polygon: CityMapPoint[]): boolean {
  let isInside = false;

  for (let index = 0, previousIndex = polygon.length - 1; index < polygon.length; previousIndex = index, index += 1) {
    const currentPoint = polygon[index];
    const previousPoint = polygon[previousIndex];

    if (currentPoint == null || previousPoint == null) {
      continue;
    }

    const intersects =
      currentPoint.y > point.y !== previousPoint.y > point.y &&
      point.x <
        ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) /
          (previousPoint.y - currentPoint.y) +
          currentPoint.x;

    if (intersects) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function getCityMapItemFootprintPoints(item: CityMapBoundsInput): CityMapPoint[] {
  const renderedSize = getCityMapItemRenderedSize(item);
  const footprintHalfWidth = renderedSize.width * 0.26;
  const footprintDepth = renderedSize.height * 0.14;

  return [
    { x: item.baseX, y: item.baseY },
    { x: item.baseX - footprintHalfWidth, y: item.baseY - footprintDepth },
    { x: item.baseX + footprintHalfWidth, y: item.baseY - footprintDepth },
    { x: item.baseX, y: item.baseY - footprintDepth * 1.8 },
  ];
}

function getCityMapItemFootprintBounds(item: CityMapBoundsInput): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} {
  const renderedSize = getCityMapItemRenderedSize(item);
  const footprintHalfWidth = renderedSize.width * 0.26;
  const footprintDepth = renderedSize.height * 0.26;

  return {
    left: item.baseX - footprintHalfWidth,
    right: item.baseX + footprintHalfWidth,
    top: item.baseY - footprintDepth,
    bottom: item.baseY,
  };
}

function isCityMapItemWithinBuildablePolygon(item: CityMapBoundsInput): boolean {
  return getCityMapItemFootprintPoints(item).every((point) =>
    isPointInPolygon(point, CITY_MAP_BUILDABLE_POLYGON)
  );
}

function doCityMapItemBoundsOverlap(
  firstItem: CityMapBoundsInput,
  secondItem: CityMapBoundsInput
): boolean {
  const firstBounds = getCityMapItemFootprintBounds(firstItem);
  const secondBounds = getCityMapItemFootprintBounds(secondItem);

  return !(
    firstBounds.right <= secondBounds.left ||
    firstBounds.left >= secondBounds.right ||
    firstBounds.bottom <= secondBounds.top ||
    firstBounds.top >= secondBounds.bottom
  );
}

function getCityMapItemDebugLabel(
  item:
    | CityMapBuildingPrototype
    | CityMapDecorHouseItem
    | CityMapGroundDecorItem
): string {
  return "name" in item ? item.name : item.id;
}

function getCityMapVisualClearanceItem(
  item: CityMapBuildingPrototype | CityMapDecorHouseItem,
  kind: CityMapVisualClearanceItem["kind"]
): CityMapVisualClearanceItem {
  const renderedSize = getCityMapItemRenderedSize(item);

  return {
    id: item.id,
    label: getCityMapItemDebugLabel(item),
    kind,
    baseX: item.baseX,
    baseY: item.baseY,
    visualHalfWidth: renderedSize.width * 0.22,
    visualHalfHeight: renderedSize.height * 0.12,
  };
}

function getCityMapVisualClearanceDistance(
  firstItem: CityMapVisualClearanceItem,
  secondItem: CityMapVisualClearanceItem
): number {
  if (firstItem.kind === "special" && secondItem.kind === "special") {
    return 205;
  }

  if (firstItem.kind === "decor" && secondItem.kind === "decor") {
    return 140;
  }

  return 165;
}

function isCityMapVisualClearanceTooClose(
  firstItem: CityMapVisualClearanceItem,
  secondItem: CityMapVisualClearanceItem
): boolean {
  const clearanceDistance = getCityMapVisualClearanceDistance(
    firstItem,
    secondItem
  );
  const clearanceX =
    firstItem.visualHalfWidth +
    secondItem.visualHalfWidth +
    clearanceDistance * 0.3;
  const clearanceY =
    firstItem.visualHalfHeight +
    secondItem.visualHalfHeight +
    clearanceDistance * 0.35;
  const normalizedDistance = Math.hypot(
    (firstItem.baseX - secondItem.baseX) / clearanceX,
    (firstItem.baseY - secondItem.baseY) / clearanceY
  );

  return normalizedDistance < 1;
}

function warnForCityMapVisualClearance(
  buildings: CityMapBuildingPrototype[],
  decorHouseItems: CityMapDecorHouseItem[]
): void {
  const visualItems: CityMapVisualClearanceItem[] = [
    ...buildings.map((building) =>
      getCityMapVisualClearanceItem(building, "special")
    ),
    ...decorHouseItems.map((decorHouseItem) =>
      getCityMapVisualClearanceItem(decorHouseItem, "decor")
    ),
  ];

  for (let i = 0; i < visualItems.length; i += 1) {
    const firstItem = visualItems[i];

    if (firstItem == null) {
      continue;
    }

    for (let j = i + 1; j < visualItems.length; j += 1) {
      const secondItem = visualItems[j];

      if (secondItem == null) {
        continue;
      }

      if (isCityMapVisualClearanceTooClose(firstItem, secondItem)) {
        console.warn(
          `[city-map] Visual clearance between "${firstItem.label}" and "${secondItem.label}" is tight.`,
          firstItem,
          secondItem
        );
      }
    }
  }
}

function warnForOverlappingCityMapBuildings(
  buildings: CityMapBuildingPrototype[]
): void {
  if (!import.meta.env.DEV) {
    return;
  }

  for (let i = 0; i < buildings.length; i += 1) {
    const firstBuilding = buildings[i];

    if (firstBuilding == null) {
      continue;
    }

    if (!isCityMapItemWithinBuildablePolygon(firstBuilding)) {
      console.warn(
        `[city-map] Building "${firstBuilding.name}" is outside the buildable polygon.`,
        firstBuilding
      );
    }

    for (let j = i + 1; j < buildings.length; j += 1) {
      const secondBuilding = buildings[j];

      if (secondBuilding == null) {
        continue;
      }

      if (doCityMapItemBoundsOverlap(firstBuilding, secondBuilding)) {
        console.warn(
          `[city-map] Buildings "${firstBuilding.name}" and "${secondBuilding.name}" overlap.`,
          firstBuilding,
          secondBuilding
        );
      }
    }
  }
}

function getVisibleCityMapBuildings(input: {
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
}): CityMapBuildingPrototype[] {
  const houseIds = new Set(
    input.houseDefinitions.map((houseDefinition) => houseDefinition.id)
  );
  const cityEntryIds = new Set(
    input.cityEntries.map((cityEntry) => cityEntry.id)
  );

  return CITY_MAP_BUILDING_PROTOTYPES.filter((building) => {
    if (building.entry.type === "house") {
      return houseIds.has(building.entry.houseId);
    }

    return cityEntryIds.has(building.entry.cityEntryId);
  });
}

function warnForCityMapDecorativeItems(
  decorHouseItems: CityMapDecorHouseItem[],
  groundDecorItems: CityMapGroundDecorItem[],
  buildings: CityMapBuildingPrototype[]
): void {
  if (!import.meta.env.DEV) {
    return;
  }

  for (const decorHouseItem of decorHouseItems) {
    if (!isCityMapItemWithinBaseSpace(decorHouseItem)) {
      console.warn(
        `[city-map] Decorative house "${decorHouseItem.id}" is outside the base-space bounds.`,
        decorHouseItem
      );
    }

    if (!isCityMapItemWithinBuildablePolygon(decorHouseItem)) {
      console.warn(
        `[city-map] Decorative house "${decorHouseItem.id}" is outside the buildable polygon.`,
        decorHouseItem
      );
    }
  }

  for (const groundDecorItem of groundDecorItems) {
    if (!isCityMapItemWithinBaseSpace(groundDecorItem)) {
      console.warn(
        `[city-map] Ground decoration "${groundDecorItem.id}" is outside the base-space bounds.`,
        groundDecorItem
      );
    }

    if (
      !isPointInPolygon(
        { x: groundDecorItem.baseX, y: groundDecorItem.baseY },
        CITY_MAP_BUILDABLE_POLYGON
      )
    ) {
      console.warn(
        `[city-map] Ground decoration "${groundDecorItem.id}" is outside the buildable polygon.`,
        groundDecorItem
      );
    }
  }

  for (let i = 0; i < decorHouseItems.length; i += 1) {
    const firstItem = decorHouseItems[i];

    if (firstItem == null) {
      continue;
    }

    for (let j = i + 1; j < decorHouseItems.length; j += 1) {
      const secondItem = decorHouseItems[j];

      if (secondItem == null) {
        continue;
      }

      if (doCityMapItemBoundsOverlap(firstItem, secondItem)) {
        console.warn(
          `[city-map] Decorative houses "${firstItem.id}" and "${secondItem.id}" overlap.`,
          firstItem,
          secondItem
        );
      }
    }
  }

  for (const decorativeItem of decorHouseItems) {
    for (const building of buildings) {
      if (doCityMapItemBoundsOverlap(decorativeItem, building)) {
        console.warn(
          `[city-map] Decorative house "${decorativeItem.id}" overlaps "${getCityMapItemDebugLabel(building)}".`,
          decorativeItem,
          building
        );
      }
    }
  }

  warnForCityMapVisualClearance(buildings, decorHouseItems);
}

function renderCityMapBuildingPrototype(
  building: CityMapBuildingPrototype
): string {
  const leftPercent = formatStagePercent(
    (building.baseX / CITY_MAP_BASE_WIDTH) * 100
  );
  const topPercent = formatStagePercent(
    (building.baseY / CITY_MAP_BASE_HEIGHT) * 100
  );
  const widthPercent = formatStagePercent(
    ((building.assetWidth * building.renderScale) / CITY_MAP_BASE_WIDTH) * 100
  );
  const ringWidthPercent = formatStagePercent(
    (building.ringWidth / CITY_MAP_BASE_WIDTH) * 100
  );
  const ringHeightPercent = formatStagePercent(
    (building.ringHeight / CITY_MAP_BASE_HEIGHT) * 100
  );
  const ringOffsetYPercent = formatStagePercent(
    (building.ringOffsetY / CITY_MAP_BASE_HEIGHT) * 100
  );
  const zIndex = Math.round(building.baseY);

  if (import.meta.env.DEV && !isCityMapItemWithinBaseSpace(building)) {
    console.warn(
      `[city-map] Building "${building.name}" is outside the base-space bounds.`,
      building
    );
  }

  return `
    <span
      class="c-city-map-stage__building"
      data-city-map-building-group-id="${building.id}"
      style="--building-x:${leftPercent}; --building-y:${topPercent}; --building-width:${widthPercent}; --building-z-index:${zIndex}; --building-ring-width:${ringWidthPercent}; --building-ring-height:${ringHeightPercent}; --building-ring-offset-y:${ringOffsetYPercent};"
    >
      <button
        type="button"
        class="c-city-map-stage__building-hotspot"
        data-city-map-building-id="${building.id}"
        aria-label="选中${building.name}"
        aria-pressed="false"
      >
        <span class="c-city-map-stage__building-ring" aria-hidden="true"></span>
        <img
          class="c-city-map-stage__building-image"
          src="${building.imageUrl}"
          alt=""
          aria-hidden="true"
        />
      </button>
    </span>
  `;
}

function renderCityMapDecorHouseItem(item: CityMapDecorHouseItem): string {
  const leftPercent = formatStagePercent(
    (item.baseX / CITY_MAP_BASE_WIDTH) * 100
  );
  const topPercent = formatStagePercent(
    (item.baseY / CITY_MAP_BASE_HEIGHT) * 100
  );
  const widthPercent = formatStagePercent(
    (item.targetWidth / CITY_MAP_BASE_WIDTH) * 100
  );
  const zIndex = Math.round(item.baseY);

  return `
    <span
      class="c-city-map-stage__decor-house"
      data-city-map-decor-id="${item.id}"
      style="--decor-x:${leftPercent}; --decor-y:${topPercent}; --decor-width:${widthPercent}; --decor-z-index:${zIndex};"
      aria-hidden="true"
    >
      <img
        class="c-city-map-stage__decor-house-image"
        src="${item.imageUrl}"
        alt=""
      />
    </span>
  `;
}

function renderCityMapGroundDecorItem(item: CityMapGroundDecorItem): string {
  const leftPercent = formatStagePercent(
    (item.baseX / CITY_MAP_BASE_WIDTH) * 100
  );
  const topPercent = formatStagePercent(
    (item.baseY / CITY_MAP_BASE_HEIGHT) * 100
  );
  const widthPercent = formatStagePercent(
    (item.targetWidth / CITY_MAP_BASE_WIDTH) * 100
  );
  const opacity = item.opacity ?? 1;
  const zIndex = Math.round(item.baseY);

  return `
    <span
      class="c-city-map-stage__ground-decor"
      data-city-map-ground-decor-id="${item.id}"
      style="--ground-decor-x:${leftPercent}; --ground-decor-y:${topPercent}; --ground-decor-width:${widthPercent}; --ground-decor-z-index:${zIndex}; --ground-decor-opacity:${opacity};"
      aria-hidden="true"
    >
      <img
        class="c-city-map-stage__ground-decor-image"
        src="${item.imageUrl}"
        alt=""
      />
    </span>
  `;
}

function renderCityMapBuildingLabel(building: CityMapBuildingPrototype): string {
  const labelX = building.baseX + building.labelAnchorOffsetX;
  const labelY = building.baseY + building.labelAnchorOffsetY;
  const labelXPercent = formatStagePercent(
    (labelX / CITY_MAP_BASE_WIDTH) * 100
  );
  const labelYPercent = formatStagePercent(
    (labelY / CITY_MAP_BASE_HEIGHT) * 100
  );
  const zIndex = Math.round(building.baseY);
  const entryAttribute =
    building.entry.type === "house"
      ? `data-house-id="${building.entry.houseId}"`
      : `data-city-entry-id="${building.entry.cityEntryId}"`;

  return `
    <button
      type="button"
      class="c-city-map-stage__building-label"
      data-city-map-building-label-id="${building.id}"
      ${entryAttribute}
      aria-label="进入${building.name}"
      style="--building-label-x:${labelXPercent}; --building-label-y:${labelYPercent}; --building-label-z-index:${zIndex};"
    >
      <span class="c-city-map-stage__building-label-text">${building.name}</span>
    </button>
  `;
}

function renderCityMapGroundDecorations(
  items: CityMapGroundDecorItem[]
): string {
  return items.map(renderCityMapGroundDecorItem).join("");
}

function renderCityMapVisualItems(input: {
  decorHouseItems: CityMapDecorHouseItem[];
  buildings: CityMapBuildingPrototype[];
}): string {
  const visualItems = [
    ...input.decorHouseItems.map((item) => ({
      baseY: item.baseY,
      markup: renderCityMapDecorHouseItem(item),
    })),
    ...input.buildings.map((building) => ({
      baseY: building.baseY,
      markup: renderCityMapBuildingPrototype(building),
    })),
  ].sort((firstItem, secondItem) => firstItem.baseY - secondItem.baseY);

  return visualItems.map((item) => item.markup).join("");
}

function renderCityMapBuildingLabels(
  buildings: CityMapBuildingPrototype[]
): string {
  return buildings.map(renderCityMapBuildingLabel).join("");
}

function renderCityMapScene(input: {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
}): string {
  return renderCityStageScene(input);
}

function renderLocationsDeckView(): string {
  return "";
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
    return renderLocationsDeckView();
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
        </div>
        <div class="c-city-menu-panel__body">
          ${bodyMarkup}
        </div>
        <div class="c-city-menu-panel__actions">
          <button type="button" class="c-city-directory__close c-city-menu-panel__close" data-action="close-city-menu">
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
          aria-label="进入 3D 城市场景"
        >
          3D
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
            <button type="button" class="c-kulan-city__leave-action" data-action="leave-city">
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
