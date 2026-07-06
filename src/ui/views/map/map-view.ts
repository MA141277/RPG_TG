import type { GridCoordinate } from "../../../application/navigation/travel-to-coordinate";
import type { CityDefinition } from "../../../domain/city";
import { campaignUnitAssets } from "../../../content/yuanmo-strat-unit-assets";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "../../../domain/historical-character";
import type { MapDefinition, MapLayer, MapNode, MapStats } from "../../../domain/map";
import redTurbanMarkerUrl from "../../../assets/yuanmo-map/chuang-swordsman-marker.png";
import cityDepthMeshAssetUrl from "../../../3dasset/city_hun/city-hun-campaign-lowpoly.json?url";
import cityDepthTextureUrl from "../../../3dasset/city_hun/texture_pbr_20250901.png?url";

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
  historicalCharacters: {
    primary: string[];
    secondary: string[];
    background: string[];
    notes: string;
  } | null;
};

export type MapViewModel = {
  mode: "grid" | "campaign";
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
  heightmapImageUrl: string | null;
  hexTextureAtlasImageUrl: string | null;
  materialTextureImageUrl: string | null;
  cityDepthMeshAssetUrl: string | null;
  cityDepthTextureUrl: string | null;
  cityDepthMeshCoordinate: {
    x: number;
    y: number;
  } | null;
  campaignMarkers: CampaignMarker[];
  layers: MapLayer[];
  stats: MapStats | null;
};

export function createMapViewModel(input: {
  mapDefinition: MapDefinition;
  playerCoordinate: GridCoordinate;
  playerFacingDegrees?: number;
  playerIsMoving?: boolean;
  cityDefinitions: CityDefinition[];
  cityCoordinatesById: Record<string, GridCoordinate>;
  historicalCharacters?: HistoricalCharacterRecord[];
  historicalCityRosters?: HistoricalCityRoster[];
}): MapViewModel {
  const mode = input.mapDefinition.mode ?? "grid";
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

  return {
    mode,
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
    coordinateSpace: input.mapDefinition.coordinateSpace ?? {
      width: input.mapDefinition.size ?? 5,
      height: input.mapDefinition.size ?? 5,
    },
    displaySize: input.mapDefinition.displaySize ?? {
      width: input.mapDefinition.size ?? 5,
      height: input.mapDefinition.size ?? 5,
    },
    primaryImageUrl: input.mapDefinition.primaryImageUrl ?? null,
    regionOverlayImageUrl: input.mapDefinition.regionOverlayImageUrl ?? null,
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
    cityDepthMeshAssetUrl,
    cityDepthTextureUrl,
    cityDepthMeshCoordinate: input.mapDefinition.initialPlayerCoordinate ?? null,
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

  return `<span><b>${label}</b>${names.map(escapeHtml).join("、")}</span>`;
}

function renderHistoricalCharacters(
  marker: CampaignMarker
): string {
  if (marker.historicalCharacters == null) {
    return "";
  }

  const characterGroups = [
    renderCharacterGroup("核心人物：", marker.historicalCharacters.primary),
    renderCharacterGroup("相关人物：", marker.historicalCharacters.secondary),
    renderCharacterGroup("背景人物：", marker.historicalCharacters.background),
  ]
    .filter((item) => item !== "")
    .join("");
  const notes =
    marker.historicalCharacters.notes === ""
      ? ""
      : `<span><b>设定说明：</b>${escapeHtml(marker.historicalCharacters.notes)}</span>`;

  return `<span class="c-campaign-marker__characters">${characterGroups}${notes}</span>`;
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

      return `
        <button
          class="c-campaign-marker ${getMarkerClass(marker.kind)}"
          style="--marker-left:${left.toFixed(3)}%; --marker-bottom:${bottom.toFixed(3)}%;"
          data-terrain-projected-point="true"
          data-map-height-u="${heightU.toFixed(5)}"
          data-map-height-v="${heightV.toFixed(5)}"
          data-map-x="${marker.x}"
          data-map-y="${marker.y}"
          data-city-id="${marker.cityId ?? ""}"
          data-map-node-id="${marker.id}"
          data-map-node-name="${markerName}"
          title="${markerName} (${marker.x}, ${marker.y})"
        >
          <span class="c-campaign-marker__dot"></span>
          <span class="c-campaign-marker__label">${escapeHtml(displayName)}</span>
          <span class="c-campaign-marker__summary">
            <strong>${markerName}</strong>
            ${marker.summary === "" ? "" : `<span>${markerSummary}</span>`}
            ${renderHistoricalCharacters(marker)}
          </span>
        </button>
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
            <span>${layer.width}x${layer.height} · ${layer.description}</span>
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
        <div class="c-campaign-map__tiltshift" aria-hidden="true">
          ${renderCampaignMapVisualLayer(model, {
            transformClassName: "c-campaign-map__transform c-campaign-map__transform--tiltshift",
            transformDataAttribute: 'data-campaign-map-transform-blur="true"',
            includeInteractivePoints: false,
            ariaHidden: true,
          })}
        </div>
        <div class="c-campaign-map__vignette" aria-hidden="true"></div>
        <div class="c-campaign-map-debug" aria-label="Campaign map debug controls">
          <div class="c-campaign-map-debug__readout">
            <span>Scale <strong data-campaign-map-scale>1.00x</strong></span>
            <span>X <strong data-campaign-map-offset-x>0px</strong></span>
            <span>Y <strong data-campaign-map-offset-y>0px</strong></span>
          </div>
          <div class="c-campaign-map-debug__actions">
            <button type="button" data-map-debug-action="zoom-out">-</button>
            <label class="c-campaign-map-debug__scale-field">
              <span>Zoom</span>
              <input
                type="text"
                inputmode="decimal"
                value="1.00"
                data-campaign-map-scale-input
                aria-label="Map zoom scale"
              >
            </label>
            <button type="button" data-map-debug-action="zoom-in">+</button>
            <button type="button" data-map-debug-action="reset">Reset</button>
          </div>
          <div class="c-campaign-map-debug__terrain-style">
            <label>
              <span>Sat <strong data-campaign-terrain-style-value="saturation">1.00</strong></span>
              <input type="range" min="0" max="3" step="0.01" value="1.00" data-campaign-terrain-style-field="saturation">
            </label>
            <label>
              <span>Bright <strong data-campaign-terrain-style-value="brightness">1.00</strong></span>
              <input type="range" min="0" max="3" step="0.01" value="1.00" data-campaign-terrain-style-field="brightness">
            </label>
            <label>
              <span>Lift <strong data-campaign-terrain-style-value="brightnessOffset">0.000</strong></span>
              <input type="range" min="-0.2" max="0.2" step="0.005" value="0.000" data-campaign-terrain-style-field="brightnessOffset">
            </label>
            <label>
              <span>Shade Min <strong data-campaign-terrain-style-value="shadeMin">1.00</strong></span>
              <input type="range" min="0" max="2" step="0.01" value="1.00" data-campaign-terrain-style-field="shadeMin">
            </label>
            <label>
              <span>Shade Max <strong data-campaign-terrain-style-value="shadeMax">1.00</strong></span>
              <input type="range" min="0" max="2" step="0.01" value="1.00" data-campaign-terrain-style-field="shadeMax">
            </label>
            <button type="button" data-map-debug-action="terrain-style-reset">Reset Terrain</button>
          </div>
          <div class="c-campaign-map-debug__terrain-style">
            <label>
              <span>City Rot <strong data-campaign-city-mesh-value="rotationDegrees">0deg</strong></span>
              <input type="range" min="-180" max="180" step="1" value="0" data-campaign-city-mesh-field="rotationDegrees">
            </label>
            <label>
              <span>City Tilt <strong data-campaign-city-mesh-value="pitchDegrees">0deg</strong></span>
              <input type="range" min="-90" max="90" step="1" value="0" data-campaign-city-mesh-field="pitchDegrees">
            </label>
            <label>
              <span>City Size <strong data-campaign-city-mesh-value="scale">1.00</strong></span>
              <input type="range" min="0.1" max="6" step="0.01" value="1" data-campaign-city-mesh-field="scale">
            </label>
            <label>
              <span>Tile X <strong data-campaign-city-mesh-value="offsetX">0.00</strong></span>
              <input type="range" min="-1" max="1" step="0.01" value="0" data-campaign-city-mesh-field="offsetX">
            </label>
            <label>
              <span>Tile Y <strong data-campaign-city-mesh-value="offsetY">0.00</strong></span>
              <input type="range" min="-1" max="1" step="0.01" value="0" data-campaign-city-mesh-field="offsetY">
            </label>
            <label>
              <span>City Lift <strong data-campaign-city-mesh-value="lift">0.0000</strong></span>
              <input type="range" min="-0.08" max="0.16" step="0.001" value="0" data-campaign-city-mesh-field="lift">
            </label>
            <button type="button" data-map-debug-action="city-mesh-reset">Reset City</button>
            <button type="button" data-map-debug-action="city-mesh-copy">Copy Params</button>
            <span data-campaign-city-mesh-copy-status></span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderMapView(model: MapViewModel): string {
  if (model.mode === "campaign") {
    return `
      <section class="view-map view-map--campaign">
        ${renderCampaignMap(model)}
      </section>
    `;
  }

  return `
    <section class="view-map view-map--grid">
      <div class="c-stage-header">
        <div>
          <p class="c-stage-header__eyebrow">地图巡行</p>
          <h1 class="c-stage-header__title">${model.mapName}</h1>
        </div>
        <div class="c-map-legend">
          <span class="c-map-legend__item"><span class="c-player-token"></span> 玩家</span>
          <span class="c-map-legend__item"><span class="c-city-token">城池</span></span>
        </div>
      </div>
      ${renderGridMap(model)}
    </section>
  `;
}
