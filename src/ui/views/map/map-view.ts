import { campaignUnitAssets } from "../../../content/yuanmo-strat-unit-assets";
import type { MapLayer, MapStats } from "../../../domain/map";
import redTurbanMarkerUrl from "../../../assets/yuanmo-map/chuang-swordsman-marker.png";
import {
  createMapViewModel,
  type MapViewModel,
} from "./map-view-model";

export { createMapViewModel };
export type { MapViewModel };

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeJsonForHtmlScript(value: string): string {
  return value
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function renderCampaignMarkerRuntimeSource(model: MapViewModel): string {
  const markerSource = model.campaignMarkers.map((marker) => ({
    ...marker,
    left: marker.x / model.coordinateSpace.width * 100,
    bottom: marker.y / model.coordinateSpace.height * 100,
    u: marker.x / model.coordinateSpace.width,
    v: 1 - marker.y / model.coordinateSpace.height,
  }));

  return `
    <script type="application/json" data-campaign-marker-source="true">${escapeJsonForHtmlScript(JSON.stringify(markerSource))}</script>
    <div class="c-campaign-marker-layer" data-campaign-marker-layer="true"></div>
  `;
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
  const fortWallMeshAttributes =
    model.fortWallMeshAssetUrl == null
      ? ""
      : `data-campaign-fort-wall-mesh-url="${model.fortWallMeshAssetUrl}"`;
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
          ${fortWallMeshAttributes}
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
            ${renderCampaignMarkerRuntimeSource(model)}
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
