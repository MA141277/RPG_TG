import type { CityDefinition } from "../../../domain/city";
import type { CityEntryDefinition } from "../../../domain/city-entry";
import type { HouseDefinition } from "../../../domain/house";
import * as haozhouCityLayoutModule from "../../../../tools/city-map-building-editor/examples/haozhou-city-layout.example.json";
import * as haozhouCityPrefabModule from "../../../../tools/city-map-building-editor/examples/haozhou-city-prefabs.example.json";
import {
  composeCityStageLayout,
  type CityStageAsset,
  type CityStageGrid,
  type CityStageLayout,
  type CityStageLayoutSource,
  type CityStageLot,
  type CityStagePrefabLibrary,
  type ComposedCityStageEntity,
} from "./city-stage-layout-data";

type CityStageRenderMetrics = {
  entity: ComposedCityStageEntity;
  assetUrl: string;
  baseX: number;
  baseY: number;
  baseXPercent: string;
  baseYPercent: string;
  zIndex: number;
  boxLeftPercent: string;
  boxTopPercent: string;
  boxWidthPercent: string;
  boxHeightPercent: string;
  ringCenterXPercent: string;
  ringCenterYPercent: string;
  ringWidthPercent: string;
  ringHeightPercent: string;
  labelXPercent: string;
  labelYPercent: string;
  labelZIndex: number;
};

function unwrapJsonModule<T>(moduleValue: unknown): T {
  if (
    moduleValue != null &&
    typeof moduleValue === "object" &&
    "default" in moduleValue
  ) {
    return (moduleValue as { default: T }).default;
  }

  return moduleValue as T;
}

const haozhouCityStagePrefabs = unwrapJsonModule<CityStagePrefabLibrary>(
  haozhouCityPrefabModule
);
const haozhouCityStageLayoutSource = unwrapJsonModule<CityStageLayoutSource>(
  haozhouCityLayoutModule
);
const haozhouCityStageLayout: CityStageLayout = {
  version: haozhouCityStageLayoutSource.version,
  map: haozhouCityStageLayoutSource.map,
  grid: haozhouCityStageLayoutSource.grid,
  // Instance prefabId values are resolved against the prefab library here.
  entities: composeCityStageLayout(
    haozhouCityStageLayoutSource,
    haozhouCityStagePrefabs
  ),
};

const cityStageAssetModules = import.meta.glob("../../../../ui/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const cityStageAssetUrlByPath = new Map<string, string>(
  Object.entries(cityStageAssetModules).map(([modulePath, url]) => [
    normalizeAssetModulePath(modulePath),
    url,
  ])
);

function normalizeAssetModulePath(modulePath: string): string {
  const normalized = modulePath.replace(/\\/g, "/");
  const markerIndex = normalized.lastIndexOf("/ui/");

  if (markerIndex >= 0) {
    return normalized.slice(markerIndex + 1);
  }

  return normalized.replace(/^\.?\//, "");
}

function resolveAssetUrl(assetPath: string): string {
  const normalizedPath = assetPath.replace(/\\/g, "/").replace(/^\.?\//, "");
  return cityStageAssetUrlByPath.get(normalizedPath) ?? normalizedPath;
}

function formatStagePercent(value: number): string {
  return `${value.toFixed(6).replace(/\.?0+$/, "")}%`;
}

function gridToPixel(
  gridX: number,
  gridY: number,
  grid: CityStageGrid
): { x: number; y: number } {
  const halfW = grid.cellWidth / 2;
  const halfH = grid.cellHeight / 2;

  return {
    x: grid.originX + (gridX - gridY) * halfW,
    y: grid.originY + (gridX + gridY) * halfH,
  };
}

function getFootprintBounds(
  lot: CityStageLot,
  grid: CityStageGrid
): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} {
  const halfW = grid.cellWidth / 2;
  const halfH = grid.cellHeight / 2;
  let left = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (let row = 0; row < lot.rows; row += 1) {
    for (let col = 0; col < lot.cols; col += 1) {
      const center = gridToPixel(lot.gridX + col, lot.gridY + row, grid);

      left = Math.min(left, center.x - halfW);
      right = Math.max(right, center.x + halfW);
      top = Math.min(top, center.y - halfH);
      bottom = Math.max(bottom, center.y + halfH);
    }
  }

  return {
    left,
    right,
    top,
    bottom,
  };
}

function getLotAnchor(
  lot: CityStageLot,
  grid: CityStageGrid
): { x: number; y: number } {
  const bounds = getFootprintBounds(lot, grid);

  return {
    x: (bounds.left + bounds.right) / 2 + (lot.offsetX ?? 0),
    y: bounds.bottom + (lot.offsetY ?? 0),
  };
}

function getAssetBox(metrics: {
  anchorX: number;
  anchorY: number;
  asset: CityStageAsset;
}): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const width = Math.max(1, metrics.asset.naturalWidth * metrics.asset.scale);
  const height = Math.max(1, metrics.asset.naturalHeight * metrics.asset.scale);
  const x = metrics.anchorX + metrics.asset.offsetX;
  const y = metrics.anchorY + metrics.asset.offsetY;

  if (metrics.asset.anchor === "center") {
    return {
      left: x - width / 2,
      top: y - height / 2,
      width,
      height,
    };
  }

  if (metrics.asset.anchor === "top-left") {
    return {
      left: x,
      top: y,
      width,
      height,
    };
  }

  return {
    left: x - width / 2,
    top: y - height,
    width,
    height,
  };
}

function isEntityVisible(
  entity: ComposedCityStageEntity,
  visibleHouseIds: Set<string>,
  visibleCityEntryIds: Set<string>
): boolean {
  if (entity.render?.visible === false) {
    return false;
  }

  if (entity.entry.type === "house") {
    return visibleHouseIds.has(entity.entry.houseId);
  }

  if (entity.entry.type === "city-entry") {
    return visibleCityEntryIds.has(entity.entry.cityEntryId);
  }

  return true;
}

function createRenderMetrics(
  entity: ComposedCityStageEntity,
  layout: CityStageLayout
): CityStageRenderMetrics {
  const { baseSpace } = layout.map;
  const lotAnchor = getLotAnchor(entity.lot, layout.grid);
  const box = getAssetBox({
    anchorX: lotAnchor.x,
    anchorY: lotAnchor.y,
    asset: entity.asset,
  });
  const ringCenterX = lotAnchor.x + entity.interaction.hitArea.offsetX;
  const ringCenterY = lotAnchor.y + entity.interaction.hitArea.offsetY;
  const labelX = lotAnchor.x + entity.interaction.label.offsetX;
  const labelY = lotAnchor.y + entity.interaction.label.offsetY;
  const zIndex =
    entity.render?.zIndexMode === "manual" && entity.render.zIndex != null
      ? entity.render.zIndex
      : Math.round(lotAnchor.y);

  return {
    entity,
    assetUrl: resolveAssetUrl(entity.asset.image),
    baseX: lotAnchor.x,
    baseY: lotAnchor.y,
    baseXPercent: formatStagePercent((lotAnchor.x / baseSpace.width) * 100),
    baseYPercent: formatStagePercent((lotAnchor.y / baseSpace.height) * 100),
    zIndex,
    boxLeftPercent: formatStagePercent((box.left / baseSpace.width) * 100),
    boxTopPercent: formatStagePercent((box.top / baseSpace.height) * 100),
    boxWidthPercent: formatStagePercent((box.width / baseSpace.width) * 100),
    boxHeightPercent: formatStagePercent((box.height / baseSpace.height) * 100),
    ringCenterXPercent: formatStagePercent((ringCenterX / baseSpace.width) * 100),
    ringCenterYPercent: formatStagePercent((ringCenterY / baseSpace.height) * 100),
    ringWidthPercent: formatStagePercent(
      (entity.interaction.hitArea.width / baseSpace.width) * 100
    ),
    ringHeightPercent: formatStagePercent(
      (entity.interaction.hitArea.height / baseSpace.height) * 100
    ),
    labelXPercent: formatStagePercent((labelX / baseSpace.width) * 100),
    labelYPercent: formatStagePercent((labelY / baseSpace.height) * 100),
    labelZIndex: zIndex,
  };
}

function renderEntityImage(metrics: CityStageRenderMetrics): string {
  return `
    <img
      class="c-city-map-stage__entity-image"
      src="${metrics.assetUrl}"
      alt=""
      aria-hidden="true"
    />
  `;
}

function renderStaticEntity(metrics: CityStageRenderMetrics): string {
  return `
    <span
      class="c-city-map-stage__entity"
      style="--entity-z-index:${metrics.zIndex};"
      aria-hidden="true"
    >
      <span
        class="c-city-map-stage__entity-static"
        style="--entity-box-left:${metrics.boxLeftPercent}; --entity-box-top:${metrics.boxTopPercent}; --entity-box-width:${metrics.boxWidthPercent}; --entity-box-height:${metrics.boxHeightPercent};"
      >
        ${renderEntityImage(metrics)}
      </span>
    </span>
  `;
}

function renderInteractiveEntity(metrics: CityStageRenderMetrics): string {
  return `
    <span
      class="c-city-map-stage__entity"
      data-city-map-building-group-id="${metrics.entity.id}"
      style="--entity-z-index:${metrics.zIndex};"
    >
      <span
        class="c-city-map-stage__entity-ring"
        style="--entity-ring-center-x:${metrics.ringCenterXPercent}; --entity-ring-center-y:${metrics.ringCenterYPercent}; --entity-ring-width:${metrics.ringWidthPercent}; --entity-ring-height:${metrics.ringHeightPercent};"
        aria-hidden="true"
      ></span>
      <button
        type="button"
        class="c-city-map-stage__entity-hotspot"
        data-city-map-building-id="${metrics.entity.id}"
        aria-label="选中${metrics.entity.name}"
        aria-pressed="false"
        style="--entity-box-left:${metrics.boxLeftPercent}; --entity-box-top:${metrics.boxTopPercent}; --entity-box-width:${metrics.boxWidthPercent}; --entity-box-height:${metrics.boxHeightPercent};"
      >
        ${renderEntityImage(metrics)}
      </button>
    </span>
  `;
}

function renderEntity(metrics: CityStageRenderMetrics): string {
  if (metrics.entity.interaction.clickable) {
    return renderInteractiveEntity(metrics);
  }

  return renderStaticEntity(metrics);
}

function renderEntityLabel(metrics: CityStageRenderMetrics): string {
  const text = metrics.entity.interaction.label.text.trim();
  if (!metrics.entity.interaction.clickable || text.length === 0) {
    return "";
  }

  const entryAttribute =
    metrics.entity.entry.type === "house"
      ? `data-house-id="${metrics.entity.entry.houseId}"`
      : metrics.entity.entry.type === "city-entry"
        ? `data-city-entry-id="${metrics.entity.entry.cityEntryId}"`
        : "";

  if (entryAttribute.length === 0) {
    return "";
  }

  return `
    <button
      type="button"
      class="c-city-map-stage__building-label"
      data-city-map-building-label-id="${metrics.entity.id}"
      ${entryAttribute}
      aria-label="进入${metrics.entity.name}"
      style="--building-label-x:${metrics.labelXPercent}; --building-label-y:${metrics.labelYPercent}; --building-label-z-index:${metrics.labelZIndex};"
    >
      <span class="c-city-map-stage__building-label-text">${text}</span>
    </button>
  `;
}

export function renderCityStageScene(input: {
  cityDefinition: CityDefinition;
  houseDefinitions: HouseDefinition[];
  cityEntries: CityEntryDefinition[];
}): string {
  const layout = haozhouCityStageLayout;
  const visibleHouseIds = new Set(
    input.houseDefinitions.map((houseDefinition) => houseDefinition.id)
  );
  const visibleCityEntryIds = new Set(
    input.cityEntries.map((cityEntry) => cityEntry.id)
  );
  const renderableEntities = layout.entities
    .filter((entity) =>
      isEntityVisible(entity, visibleHouseIds, visibleCityEntryIds)
    )
    .map((entity) => createRenderMetrics(entity, layout));
  const groundEntities = renderableEntities
    .filter((metrics) => metrics.entity.category === "ground-decoration")
    .sort((firstItem, secondItem) => firstItem.baseY - secondItem.baseY);
  const visualEntities = renderableEntities
    .filter((metrics) => metrics.entity.category !== "ground-decoration")
    .sort((firstItem, secondItem) => firstItem.baseY - secondItem.baseY);
  const labels = visualEntities.map(renderEntityLabel).join("");
  const { baseSpace } = layout.map;
  const baseLeftPercent = formatStagePercent(
    (baseSpace.x / layout.map.stageWidth) * 100
  );
  const baseTopPercent = formatStagePercent(
    (baseSpace.y / layout.map.stageHeight) * 100
  );
  const baseWidthPercent = formatStagePercent(
    (baseSpace.width / layout.map.stageWidth) * 100
  );
  const baseHeightPercent = formatStagePercent(
    (baseSpace.height / layout.map.stageHeight) * 100
  );

  return `
    <div class="c-city-map-scene" aria-label="${input.cityDefinition.name}等距城镇地图">
      <div class="c-city-map-scene__ambient" aria-hidden="true"></div>
      <div class="c-city-map-stage">
        <div
          class="c-city-map-stage__base-space"
          style="--base-space-top:${baseTopPercent}; --base-space-left:${baseLeftPercent}; --base-space-width:${baseWidthPercent}; --base-space-height:${baseHeightPercent};"
        >
          <img
            class="c-city-map-stage__base"
            src="${resolveAssetUrl(layout.map.backgroundImage)}"
            alt=""
          />
          <div class="c-city-map-stage__ground-decorations">
            ${groundEntities.map(renderEntity).join("")}
          </div>
          <div class="c-city-map-stage__visual-items">
            ${visualEntities.map(renderEntity).join("")}
          </div>
        </div>
        <img
          class="c-city-map-stage__foreground-wall"
          src="${resolveAssetUrl(layout.map.foregroundImage)}"
          alt=""
        />
        <div
          class="c-city-map-stage__labels"
          style="--base-space-top:${baseTopPercent}; --base-space-left:${baseLeftPercent}; --base-space-width:${baseWidthPercent}; --base-space-height:${baseHeightPercent};"
        >
          ${labels}
        </div>
      </div>
    </div>
  `;
}
