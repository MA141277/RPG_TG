import {
  coordinateToRoundedHex,
  getHexKey,
  type GridCoordinate,
} from "../../../application/navigation/travel-to-coordinate";
import type { CityDefinition } from "../../../domain/city";
import { campaignUnitAssets } from "../../../content/yuanmo-strat-unit-assets";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "../../../domain/historical-character";
import type {
  MapDefinition,
  MapExplorationState,
  MapLayer,
  MapNode,
  MapStats,
} from "../../../domain/map";
import {
  campaignMapCoordinateToHex,
  getCampaignHexCellKey,
  getCampaignHexDisc,
} from "../../../domain/campaign-hex";
import redTurbanMarkerUrl from "../../../assets/yuanmo-map/chuang-swordsman-marker.png";
import cityDepthMeshAssetUrl from "../../../3dasset/city_hun/city-hun-campaign-lowpoly.json?url";
import cityDepthTextureUrl from "../../../3dasset/city_hun/texture_pbr_20250901.png?url";
import yuanmoHexBuildingUrl from "../../../../ui/yuansu/20260715-120754.png?url";

const YUANMO_HEX_BUILDING = {
  mapId: "map.yuanmo_campaign",
  nodeId: "settlement.fenyang_province",
  cityId: "city.kulan",
  x: 336.6,
  y: 318.6,
  travelX: 334,
  travelY: 318,
  label: "濠州",
} as const;

type CityMarker = {
  id: string;
  name: string;
  x: number;
  y: number;
};

type CampaignMarker = {
  id: string;
  cityId: string | null;
  name: string;
  x: number;
  y: number;
  kind: NonNullable<MapNode["kind"]>;
  summary: string;
  isRevealed: boolean;
  historicalCharacters: {
    primary: string[];
    secondary: string[];
    background: string[];
    notes: string;
  } | null;
};

export type MapViewModel = {
  mode: "grid" | "campaign";
  mapId: string;
  mapName: string;
  size: number;
  playerCoordinate: GridCoordinate;
  playerFacingDegrees: number;
  playerIsMoving: boolean;
  cityMarkers: CityMarker[];
  coordinateSpace: {
    width: number;
    height: number;
  };
  displaySize: {
    width: number;
    height: number;
  };
  primaryImageUrl: string | null;
  regionOverlayImageUrl: string | null;
  campaignHexGridUrl: string | null;
  campaignVegetationRulesUrl: string | null;
  heightmapImageUrl: string | null;
  hexTextureAtlasImageUrl: string | null;
  materialTextureImageUrl: string | null;
  grassTextureImageUrl: string | null;
  sandTextureImageUrl: string | null;
  rockTextureImageUrl: string | null;
  snowTextureImageUrl: string | null;
  waterTextureImageUrl: string | null;
  cloudNoiseTextureImageUrl: string | null;
  revealedHexKeys: string[];
  cityDepthMeshAssetUrl: string | null;
  cityDepthTextureUrl: string | null;
  cityDepthMeshCoordinate: {
    x: number;
    y: number;
  } | null;
  cloudClearHexKeys: string[];
  campaignMarkers: CampaignMarker[];
  layers: MapLayer[];
  stats: MapStats | null;
};

export function createMapViewModel(input: {
  mapDefinition: MapDefinition;
  playerCoordinate: GridCoordinate;
  playerFacingDegrees?: number;
  playerIsMoving?: boolean;
  revealedHexKeys?: string[];
  cityDefinitions: CityDefinition[];
  cityCoordinatesById: Record<string, GridCoordinate>;
  historicalCharacters?: HistoricalCharacterRecord[];
  historicalCityRosters?: HistoricalCityRoster[];
  mapExplorationState?: MapExplorationState | null;
}): MapViewModel {
  const mode = input.mapDefinition.mode ?? "grid";
  const coordinateSpace = input.mapDefinition.coordinateSpace ?? {
    width: input.mapDefinition.size ?? 5,
    height: input.mapDefinition.size ?? 5,
  };
  const displaySize = input.mapDefinition.displaySize ?? {
    width: input.mapDefinition.size ?? 5,
    height: input.mapDefinition.size ?? 5,
  };
  const playerHex = campaignMapCoordinateToHex(
    input.playerCoordinate,
    coordinateSpace
  );
  const cloudClearHexKeys = Array.from(
    new Set([
      ...(input.revealedHexKeys ?? []),
      ...getCampaignHexDisc(playerHex, 1).map((cell) =>
        getCampaignHexCellKey(cell.x, cell.y)
      ),
    ])
  );
  const historicalCharacterNameById = Object.fromEntries(
    (input.historicalCharacters ?? []).map((characterRecord) => [
      characterRecord.id,
      characterRecord.displayName,
    ])
  );
  const historicalRosterByCityNodeId = Object.fromEntries(
    (input.historicalCityRosters ?? []).map((roster) => [roster.cityNodeId, roster])
  );
  const cityIdByMapNodeId = Object.fromEntries(
    input.cityDefinitions
      .filter((cityDefinition) => cityDefinition.mapNodeId != null)
      .map((cityDefinition) => [
        cityDefinition.mapNodeId as string,
        cityDefinition.id,
      ])
  );
  const revealedHexKeySet = new Set(input.mapExplorationState?.revealedHexKeys ?? []);

  return {
    mode,
    mapId: input.mapDefinition.id,
    mapName: input.mapDefinition.name,
    size: input.mapDefinition.size ?? 5,
    playerCoordinate: input.playerCoordinate,
    playerFacingDegrees: input.playerFacingDegrees ?? 0,
    playerIsMoving: input.playerIsMoving ?? false,
    cityMarkers: input.cityDefinitions
      .map((cityDefinition) => {
        const coordinate = input.cityCoordinatesById[cityDefinition.id];
        if (coordinate == null) {
          return null;
        }

        return {
          id: cityDefinition.id,
          name: cityDefinition.name,
          x: coordinate.x,
          y: coordinate.y,
        };
      })
      .filter((cityMarker): cityMarker is CityMarker => cityMarker != null),
    coordinateSpace,
    displaySize,
    primaryImageUrl: input.mapDefinition.primaryImageUrl ?? null,
    regionOverlayImageUrl: input.mapDefinition.regionOverlayImageUrl ?? null,
    campaignHexGridUrl: input.mapDefinition.campaignHexGridUrl ?? null,
    campaignVegetationRulesUrl:
      input.mapDefinition.campaignVegetationRulesUrl ?? null,
    heightmapImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_heights")
        ?.imageUrl ?? null,
    hexTextureAtlasImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_hex_texture_atlas")
        ?.imageUrl ??
      input.mapDefinition.primaryImageUrl ??
      null,
    materialTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_ground_types")
        ?.imageUrl ??
      input.mapDefinition.layers?.find((layer) => layer.id === "map_material_texture")
        ?.imageUrl ??
      null,
    grassTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_grass_texture")
        ?.imageUrl ?? null,
    sandTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_sand_texture")
        ?.imageUrl ?? null,
    rockTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_rock_texture")
        ?.imageUrl ?? null,
    snowTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_snow_texture")
        ?.imageUrl ?? null,
    waterTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_water_noise")
        ?.imageUrl ?? null,
    cloudNoiseTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_fog_noise")
        ?.imageUrl ?? null,
    revealedHexKeys: Array.from(
      new Set(input.mapExplorationState?.revealedHexKeys ?? [])
    ).sort(),
    cityDepthMeshAssetUrl,
    cityDepthTextureUrl,
    cityDepthMeshCoordinate: input.mapDefinition.initialPlayerCoordinate ?? null,
    cloudClearHexKeys,
    campaignMarkers: input.mapDefinition.nodes
      .map((node, index) => {
        const nodeId = node.id ?? node.cityId ?? `map-node.${index}`;
        const roster =
          node.id == null ? null : historicalRosterByCityNodeId[node.id] ?? null;
        const resolveCharacterNames = (characterIds: string[]) =>
          characterIds.map(
            (characterId) => historicalCharacterNameById[characterId] ?? characterId
          );

        return {
          id: nodeId,
          cityId:
            node.cityId ??
            (node.id == null ? null : cityIdByMapNodeId[node.id] ?? null),
          name: node.label ?? node.cityId ?? `Node ${index + 1}`,
          x: node.x,
          y: node.y,
          kind: node.kind ?? (node.cityId == null ? "landmark" : "city"),
          summary: node.summary ?? "",
          isRevealed: revealedHexKeySet.has(
            getHexKey(
              coordinateToRoundedHex(
                { x: node.x, y: node.y },
                input.mapDefinition.coordinateSpace ?? {
                  width: input.mapDefinition.size ?? 1,
                  height: input.mapDefinition.size ?? 1,
                }
              )
            )
          ),
          historicalCharacters:
            roster == null
              ? null
              : {
                  primary: resolveCharacterNames(roster.primaryCharacterIds),
                  secondary: resolveCharacterNames(roster.secondaryCharacterIds),
                  background: resolveCharacterNames(roster.backgroundCharacterIds),
                  notes: roster.notes,
                },
        };
      })
      .filter((marker) => marker.kind !== "landmark"),
    layers: input.mapDefinition.layers ?? [],
    stats: input.mapDefinition.stats ?? null,
  };
}

function renderGridMap(model: MapViewModel): string {
  const cells: string[] = [];

  for (let y = 0; y < model.size; y += 1) {
    for (let x = 0; x < model.size; x += 1) {
      const cityMarker = model.cityMarkers.find(
        (marker) => marker.x === x && marker.y === y
      );
      const isPlayerHere =
        model.playerCoordinate.x === x && model.playerCoordinate.y === y;

      cells.push(`
        <button
          class="c-grid-cell ${cityMarker == null ? "" : "has-city"}"
          data-map-x="${x}"
          data-map-y="${y}"
          data-city-id="${cityMarker?.id ?? ""}"
        >
          <span class="c-grid-cell__coord">(${x}, ${y})</span>
          ${
            cityMarker == null
              ? ""
              : `<span class="c-city-token">${cityMarker.name}</span>`
          }
          ${
            isPlayerHere
              ? '<span class="c-player-token" aria-label="Player position"></span>'
              : ""
          }
        </button>
      `);
    }
  }

  return `
    <div class="c-grid-map" style="--grid-size:${model.size}">
      ${cells.join("")}
    </div>
  `;
}

function getMarkerClass(kind: CampaignMarker["kind"]): string {
  if (kind === "fort") {
    return "c-campaign-marker--fort";
  }

  if (kind === "settlement" || kind === "city") {
    return "c-campaign-marker--settlement";
  }

  return "c-campaign-marker--landmark";
}

function getMarkerDisplayName(name: string): string {
  const markerIndex = Math.max(
    name.lastIndexOf("\u2605"),
    name.lastIndexOf("\u203b"),
    name.lastIndexOf("\u25cf")
  );
  if (markerIndex >= 0) {
    return name.slice(markerIndex + 1).trim();
  }

  return name.replace(/^\u3010(.+)\u3011$/, "$1");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCharacterGroup(label: string, names: string[]): string {
  if (names.length === 0) {
    return "";
  }

  return `<span><b>${label}</b>${names.map(escapeHtml).join(" / ")}</span>`;
}

function renderHistoricalCharacters(
  marker: CampaignMarker
): string {
  if (marker.historicalCharacters == null) {
    return "";
  }

  const characterGroups = [
    renderCharacterGroup("Primary: ", marker.historicalCharacters.primary),
    renderCharacterGroup("Related: ", marker.historicalCharacters.secondary),
    renderCharacterGroup("Background: ", marker.historicalCharacters.background),
  ]
    .filter((item) => item !== "")
    .join("");
  const notes =
    marker.historicalCharacters.notes === ""
      ? ""
      : `<span><b>Notes: </b>${escapeHtml(marker.historicalCharacters.notes)}</span>`;

  return `<span class="c-campaign-marker__characters">${characterGroups}${notes}</span>`;
}

function renderCampaignHexBuilding(model: MapViewModel): string {
  if (model.mapId !== YUANMO_HEX_BUILDING.mapId) {
    return "";
  }

  const left = (YUANMO_HEX_BUILDING.x / model.coordinateSpace.width) * 100;
  const bottom = (YUANMO_HEX_BUILDING.y / model.coordinateSpace.height) * 100;
  const heightU = YUANMO_HEX_BUILDING.x / model.coordinateSpace.width;
  const heightV = 1 - YUANMO_HEX_BUILDING.y / model.coordinateSpace.height;

  return `
    <span
      class="c-campaign-hex-building"
      style="--hex-building-left:${left.toFixed(3)}%; --hex-building-bottom:${bottom.toFixed(3)}%;"
      data-terrain-projected-point="true"
      data-map-height-u="${heightU.toFixed(5)}"
      data-map-height-v="${heightV.toFixed(5)}"
      aria-label="${escapeHtml(YUANMO_HEX_BUILDING.label)}"
    >
      <img
        class="c-campaign-hex-building__image"
        src="${yuanmoHexBuildingUrl}"
        alt=""
        aria-hidden="true"
      >
      <button
        type="button"
        class="c-campaign-hex-building__hotspot"
        data-map-node-id="${YUANMO_HEX_BUILDING.nodeId}"
        data-map-node-name="${escapeHtml(YUANMO_HEX_BUILDING.label)}"
        data-map-x="${YUANMO_HEX_BUILDING.travelX}"
        data-map-y="${YUANMO_HEX_BUILDING.travelY}"
        data-city-id="${YUANMO_HEX_BUILDING.cityId}"
        title="${escapeHtml(YUANMO_HEX_BUILDING.label)} (${YUANMO_HEX_BUILDING.travelX}, ${YUANMO_HEX_BUILDING.travelY})"
        aria-label="进入${escapeHtml(YUANMO_HEX_BUILDING.label)}"
      ></button>
    </span>
  `;
}

function renderCampaignMarkers(model: MapViewModel): string {
  return model.campaignMarkers
    .map((marker) => {
      const left = (marker.x / model.coordinateSpace.width) * 100;
      const bottom = (marker.y / model.coordinateSpace.height) * 100;
      const heightU = marker.x / model.coordinateSpace.width;
      const heightV = 1 - marker.y / model.coordinateSpace.height;
      const displayName = getMarkerDisplayName(marker.name);
      const markerName = escapeHtml(marker.name);
      const markerSummary = escapeHtml(marker.summary);
      const markerPositionStyle = `--marker-left:${left.toFixed(3)}%; --marker-bottom:${bottom.toFixed(3)}%;`;
      const markerInteractionAttributes = marker.isRevealed
        ? `
          data-map-node-id="${marker.id}"
          data-map-node-name="${markerName}"
          title="${markerName} (${marker.x}, ${marker.y})"
        `
        : `
          disabled
          aria-hidden="true"
          tabindex="-1"
          data-map-node-revealed="false"
        `;
      const markerProjectionAttributes = `
          data-terrain-projected-point="true"
          data-map-height-u="${heightU.toFixed(5)}"
          data-map-height-v="${heightV.toFixed(5)}"
        `;

      return `
        <button
          class="c-campaign-marker ${getMarkerClass(marker.kind)}"
          style="${markerPositionStyle}"
          ${markerProjectionAttributes}
          data-campaign-marker-id="${escapeHtml(marker.id)}"
          data-map-x="${marker.x}"
          data-map-y="${marker.y}"
          data-city-id="${marker.cityId ?? ""}"
          ${markerInteractionAttributes}
        >
          <span class="c-campaign-marker__dot"></span>
          <span class="c-campaign-marker__label">${escapeHtml(displayName)}</span>
        </button>
        <span
          class="c-campaign-marker__summary"
          style="${markerPositionStyle}"
          ${markerProjectionAttributes}
          data-campaign-marker-summary-id="${escapeHtml(marker.id)}"
          aria-hidden="true"
          data-map-node-revealed="${marker.isRevealed ? "true" : "false"}"
        >
          <strong>${markerName}</strong>
          ${marker.summary === "" ? "" : `<span>${markerSummary}</span>`}
          ${renderHistoricalCharacters(marker)}
        </span>
      `;
    })
    .join("");
}

export function renderCampaignLayers(layers: MapLayer[]): string {
  return layers
    .map(
      (layer) => `
        <article class="c-map-layer-card">
          <img class="c-map-layer-card__image" src="${layer.imageUrl}" alt="${layer.label}" loading="lazy">
          <div class="c-map-layer-card__copy">
            <strong>${layer.label}</strong>
            <span>${layer.width}x${layer.height} 路 ${layer.description}</span>
          </div>
        </article>
      `
    )
    .join("");
}

export function renderCampaignStats(stats: MapStats | null): string {
  if (stats == null) {
    return "";
  }

  return `
    <dl class="c-map-stats">
      <div><dt>Regions</dt><dd>${stats.regionCount}</dd></div>
      <div><dt>Settlements</dt><dd>${stats.settlementCount}</dd></div>
      <div><dt>Forts</dt><dd>${stats.fortCount}</dd></div>
      <div><dt>Resources</dt><dd>${stats.resourceCount}</dd></div>
    </dl>
    ${
      stats.resourceSummary === ""
        ? ""
        : `<p class="c-map-resource-summary">${stats.resourceSummary}</p>`
    }
  `;
}

function renderMapStageActions(): string {
  return `
    <div class="c-map-stage-actions">
      <button
        type="button"
        class="c-map-troop-editor-entry c-button c-grain-shop-button c-grain-shop-button--gold"
        data-action="open-troop-editor"
        data-button-sound="heavy"
      >
        部队
      </button>
    </div>
  `;
}

function renderCampaignMapVisualLayer(
  model: MapViewModel,
  options: {
    transformClassName?: string;
    transformDataAttribute?: string;
    includeInteractivePoints: boolean;
    ariaHidden?: boolean;
  }
): string {
  const canRenderWebGlTerrain =
    model.hexTextureAtlasImageUrl != null &&
    model.heightmapImageUrl != null &&
    model.materialTextureImageUrl != null;
  const cityDepthMeshU =
    model.cityDepthMeshCoordinate == null
      ? null
      : model.cityDepthMeshCoordinate.x / model.coordinateSpace.width;
  const cityDepthMeshV =
    model.cityDepthMeshCoordinate == null
      ? null
      : 1 - model.cityDepthMeshCoordinate.y / model.coordinateSpace.height;
  const cityDepthMeshAttributes =
    model.cityDepthMeshAssetUrl == null ||
    model.cityDepthTextureUrl == null ||
    cityDepthMeshU == null ||
    cityDepthMeshV == null
      ? ""
      : `
          data-campaign-city-mesh-url="${model.cityDepthMeshAssetUrl}"
          data-campaign-city-texture-url="${model.cityDepthTextureUrl}"
          data-campaign-city-u="${cityDepthMeshU.toFixed(5)}"
          data-campaign-city-v="${cityDepthMeshV.toFixed(5)}"
        `;
  const terrainCanvasMarkup =
    !canRenderWebGlTerrain
      ? ""
      : `
        <canvas
          class="c-campaign-map__terrain"
          data-campaign-map-terrain="true"
          data-map-texture-url="${model.hexTextureAtlasImageUrl}"
          data-map-height-url="${model.heightmapImageUrl}"
          data-map-material-url="${model.materialTextureImageUrl}"
          ${model.campaignHexGridUrl == null ? "" : `data-map-hex-grid-url="${model.campaignHexGridUrl}"`}
          ${model.campaignVegetationRulesUrl == null ? "" : `data-map-vegetation-rules-url="${model.campaignVegetationRulesUrl}"`}
          ${model.grassTextureImageUrl == null ? "" : `data-map-grass-texture-url="${model.grassTextureImageUrl}"`}
          ${model.sandTextureImageUrl == null ? "" : `data-map-sand-texture-url="${model.sandTextureImageUrl}"`}
          ${model.rockTextureImageUrl == null ? "" : `data-map-rock-texture-url="${model.rockTextureImageUrl}"`}
          ${model.snowTextureImageUrl == null ? "" : `data-map-snow-texture-url="${model.snowTextureImageUrl}"`}
          ${model.waterTextureImageUrl == null ? "" : `data-map-water-texture-url="${model.waterTextureImageUrl}"`}
          ${cityDepthMeshAttributes}
          aria-label="${model.mapName} terrain"
        ></canvas>
      `;
  const actorCanvasMarkup =
    options.includeInteractivePoints &&
    canRenderWebGlTerrain
      ? `
        <canvas
          class="c-campaign-map__actor-layer"
          data-campaign-map-actor-layer="true"
          data-map-texture-url="${model.hexTextureAtlasImageUrl}"
          data-map-height-url="${model.heightmapImageUrl}"
          data-map-material-url="${model.materialTextureImageUrl}"
          ${model.campaignHexGridUrl == null ? "" : `data-map-hex-grid-url="${model.campaignHexGridUrl}"`}
          aria-hidden="true"
        ></canvas>
      `
      : "";
  const terrainEnabledMarkup = options.includeInteractivePoints ? terrainCanvasMarkup : "";
  const imageMarkup =
    model.primaryImageUrl == null || canRenderWebGlTerrain
      ? ""
      : `<img class="c-campaign-map__image c-campaign-map__image--fallback" src="${model.primaryImageUrl}" alt="${model.mapName}">`;
  const regionOverlayMarkup =
    model.regionOverlayImageUrl == null || canRenderWebGlTerrain
      ? ""
      : `<img class="c-campaign-map__regions" src="${model.regionOverlayImageUrl}" alt="">`;
  const playerHeightX = model.playerCoordinate.x / model.coordinateSpace.width;
  const playerHeightY = 1 - model.playerCoordinate.y / model.coordinateSpace.height;
  const transformClassName = options.transformClassName ?? "c-campaign-map__transform";
  const transformDataAttribute =
    options.transformDataAttribute ?? 'data-campaign-map-transform="true"';
  const ariaHiddenAttribute = options.ariaHidden === true ? ' aria-hidden="true"' : "";
  const playerClassName = model.playerIsMoving
    ? "c-campaign-player is-moving has-actor-model"
    : "c-campaign-player has-actor-model";

  return `
    <div class="${transformClassName}" ${transformDataAttribute}${ariaHiddenAttribute}>
      ${terrainEnabledMarkup}
      ${imageMarkup}
      ${regionOverlayMarkup}
      ${
        options.includeInteractivePoints
          ? `
            ${renderCampaignHexBuilding(model)}
            ${renderCampaignMarkers(model)}
            ${actorCanvasMarkup}
            <span
              class="${playerClassName}"
              data-campaign-player="true"
              data-campaign-player-sprite-url="${redTurbanMarkerUrl}"
              data-campaign-player-model-url="${campaignUnitAssets.friendly.modelUrl}"
              data-campaign-player-texture-url="${campaignUnitAssets.friendly.textureUrl}"
              data-campaign-player-idle-animation-url="${campaignUnitAssets.friendly.idleAnimationUrl}"
              data-campaign-player-walk-animation-url="${campaignUnitAssets.friendly.walkAnimationUrl}"
              data-campaign-player-facing-deg="${model.playerFacingDegrees.toFixed(2)}"
              data-campaign-player-moving="${model.playerIsMoving ? "true" : "false"}"
              data-terrain-projected-point="true"
              data-map-height-u="${playerHeightX.toFixed(5)}"
              data-map-height-v="${playerHeightY.toFixed(5)}"
              style="
                --campaign-player-image:url('${redTurbanMarkerUrl}');
                --campaign-player-facing-deg:${model.playerFacingDegrees.toFixed(2)}deg;
              "
              title="Player (${model.playerCoordinate.x}, ${model.playerCoordinate.y})"
            >
              <span class="c-campaign-player__gait" aria-hidden="true">
                <span class="c-campaign-player__sprite"></span>
              </span>
            </span>
          `
          : ""
      }
    </div>
  `;
}

function renderCampaignMap(model: MapViewModel): string {
  const playerLeft = (model.playerCoordinate.x / model.coordinateSpace.width) * 100;
  const playerBottom = (model.playerCoordinate.y / model.coordinateSpace.height) * 100;

  return `
    <div class="c-campaign-map-shell">
      <div
        class="c-campaign-map"
        data-campaign-map-viewport="true"
        style="
          --map-aspect:${model.displaySize.width} / ${model.displaySize.height};
          --player-left:${playerLeft.toFixed(3)}%;
          --player-bottom:${playerBottom.toFixed(3)}%;
        "
      >
        ${renderCampaignMapVisualLayer(model, {
          includeInteractivePoints: true,
        })}
        <canvas
          class="c-campaign-map__cloud"
          data-campaign-map-cloud="true"
          data-map-coordinate-width="${model.coordinateSpace.width}"
          data-map-coordinate-height="${model.coordinateSpace.height}"
          data-map-revealed-hex-keys="${escapeHtml(model.revealedHexKeys.join(" "))}"
          ${model.cloudNoiseTextureImageUrl == null ? "" : `data-map-cloud-noise-url="${model.cloudNoiseTextureImageUrl}"`}
          aria-hidden="true"
        ></canvas>
        <svg
          class="c-campaign-map__hover-hex"
          data-campaign-hover-hex="true"
          aria-hidden="true"
          focusable="false"
          hidden
        >
          <polygon data-campaign-hover-hex-polygon="true" points=""></polygon>
        </svg>
        <div class="c-campaign-map__tiltshift" aria-hidden="true">
          ${renderCampaignMapVisualLayer(model, {
            transformClassName: "c-campaign-map__transform c-campaign-map__transform--tiltshift",
            transformDataAttribute: 'data-campaign-map-transform-blur="true"',
            includeInteractivePoints: false,
            ariaHidden: true,
          })}
        </div>
        <div class="c-campaign-map__vignette" aria-hidden="true"></div>
      </div>
      <div class="c-campaign-map-actions" aria-label="主地图操作">
        <button
          class="c-campaign-map-actions__button"
          type="button"
          data-action="open-backpack"
          data-button-sound="heavy"
        >
          背包
        </button>
      </div>
    </div>
  `;
}

export function renderMapView(model: MapViewModel): string {
  if (model.mode === "campaign") {
    return `
      <section class="view-map view-map--campaign">
        ${renderCampaignMap(model)}
        ${renderMapStageActions()}
      </section>
    `;
  }

  return `
    <section class="view-map view-map--grid">
      ${renderMapStageActions()}
      <div class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">鍦板浘宸¤</p>
          <h1 class="c-stage-header__title">${model.mapName}</h1>
        </div>
        <div class="c-map-legend">
          <span class="c-map-legend__item"><span class="c-player-token"></span> 鐜╁</span>
          <span class="c-map-legend__item"><span class="c-city-token">鍩庢睜</span></span>
        </div>
      </div>
      ${renderGridMap(model)}
    </section>
  `;
}
