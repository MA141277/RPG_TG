import type { GridCoordinate } from "../../../application/navigation/travel-to-coordinate";
import type { CityDefinition } from "../../../domain/city";
import type {
  HistoricalCharacterRecord,
  HistoricalCityRoster,
} from "../../../domain/historical-character";
import type { MapDefinition, MapLayer, MapNode, MapStats } from "../../../domain/map";

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
  materialTextureImageUrl: string | null;
  campaignMarkers: CampaignMarker[];
  layers: MapLayer[];
  stats: MapStats | null;
};

export function createMapViewModel(input: {
  mapDefinition: MapDefinition;
  playerCoordinate: GridCoordinate;
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
    materialTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_material_texture")
        ?.imageUrl ?? null,
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
  const terrainCanvasMarkup =
    model.primaryImageUrl == null ||
    model.heightmapImageUrl == null ||
    model.materialTextureImageUrl == null
      ? ""
      : `
        <canvas
          class="c-campaign-map__terrain"
          data-campaign-map-terrain="true"
          data-map-texture-url="${model.primaryImageUrl}"
          data-map-height-url="${model.heightmapImageUrl}"
          data-map-material-url="${model.materialTextureImageUrl}"
          aria-label="${model.mapName} terrain"
        ></canvas>
      `;
  const imageMarkup =
    model.primaryImageUrl == null
      ? ""
      : `<img class="c-campaign-map__image c-campaign-map__image--fallback" src="${model.primaryImageUrl}" alt="${model.mapName}">`;
  const regionOverlayMarkup =
    model.regionOverlayImageUrl == null
      ? ""
      : `<img class="c-campaign-map__regions" src="${model.regionOverlayImageUrl}" alt="">`;
  const playerHeightX = model.playerCoordinate.x / model.coordinateSpace.width;
  const playerHeightY = 1 - model.playerCoordinate.y / model.coordinateSpace.height;
  const transformClassName = options.transformClassName ?? "c-campaign-map__transform";
  const transformDataAttribute =
    options.transformDataAttribute ?? 'data-campaign-map-transform="true"';
  const ariaHiddenAttribute = options.ariaHidden === true ? ' aria-hidden="true"' : "";

  return `
    <div class="${transformClassName}" ${transformDataAttribute}${ariaHiddenAttribute}>
      ${terrainCanvasMarkup}
      ${imageMarkup}
      ${regionOverlayMarkup}
      ${
        options.includeInteractivePoints
          ? `
            ${renderCampaignMarkers(model)}
            <span
              class="c-campaign-player"
              data-terrain-projected-point="true"
              data-map-height-u="${playerHeightX.toFixed(5)}"
              data-map-height-v="${playerHeightY.toFixed(5)}"
              title="Player (${model.playerCoordinate.x}, ${model.playerCoordinate.y})"
            ></span>
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
            <button type="button" data-map-debug-action="zoom-in">+</button>
            <button type="button" data-map-debug-action="reset">Reset</button>
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
