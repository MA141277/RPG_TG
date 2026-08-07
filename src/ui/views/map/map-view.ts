import {
  coordinateToRoundedHex,
  getHexKey,
  hexToCoordinate,
  hexToCoordinatePolygon,
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
import type { CivilizationSandboxMapOverlay } from "../../../application/civilization-sandbox/map-overlay-presenter";
import { resolveCivilizationSandboxSpriteUrl } from "./civilization-sandbox-assets";
import {
  resolveCampaignStructureVisualProfile,
  type CampaignStructureVisualProfile,
} from "../../../content/campaign-structure-visual-profiles";
import redTurbanMarkerUrl from "../../../assets/yuanmo-map/chuang-swordsman-marker.png";

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
  grassNormalTextureImageUrl: string | null;
  sandTextureImageUrl: string | null;
  villageGroundTextureImageUrl: string | null;
  cityGroundTextureImageUrl: string | null;
  rockTextureImageUrl: string | null;
  snowTextureImageUrl: string | null;
  waterTextureImageUrl: string | null;
  cloudNoiseTextureImageUrl: string | null;
  revealedHexKeys: string[];
  campaignStructureProfile: CampaignStructureVisualProfile | null;
  campaignMarkers: CampaignMarker[];
  civilizationSandboxOverlay: CivilizationSandboxMapOverlay | null;
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
  mapExplorationState?: MapExplorationState | null;
  civilizationSandboxOverlay?: CivilizationSandboxMapOverlay | null;
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
  const campaignStructureProfile = resolveCampaignStructureVisualProfile(
    input.mapDefinition.campaignStructureProfileId
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
    grassNormalTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_grass_normal_texture")
        ?.imageUrl ?? null,
    sandTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_sand_texture")
        ?.imageUrl ?? null,
    villageGroundTextureImageUrl:
      input.mapDefinition.layers?.find(
        (layer) => layer.id === "map_village_ground_texture"
      )?.imageUrl ?? null,
    cityGroundTextureImageUrl:
      input.mapDefinition.layers?.find((layer) => layer.id === "map_city_ground_texture")
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
    campaignStructureProfile,
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
    civilizationSandboxOverlay: input.civilizationSandboxOverlay ?? null,
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
    left: (marker.x / model.coordinateSpace.width) * 100,
    bottom: (marker.y / model.coordinateSpace.height) * 100,
    u: marker.x / model.coordinateSpace.width,
    v: 1 - marker.y / model.coordinateSpace.height,
  }));

  return `
    <script type="application/json" data-campaign-marker-source="true">${escapeJsonForHtmlScript(JSON.stringify(markerSource))}</script>
    <div class="c-campaign-marker-layer" data-campaign-marker-layer="true"></div>
  `;
}

function renderCivilizationSandboxOverlay(
  overlay: CivilizationSandboxMapOverlay | null,
  coordinateSpace: {
    width: number;
    height: number;
  }
): string {
  if (overlay == null || !overlay.enabled) {
    return "";
  }

  const createProjectedPosition = (hex: { x: number; y: number }) => {
    const coordinate = hexToCoordinate(hex, coordinateSpace);
    const left = formatSandboxMapPercent(coordinate.x, coordinateSpace.width);
    const bottom = formatSandboxMapPercent(coordinate.y, coordinateSpace.height);
    const u = formatSandboxUnit(coordinate.x, coordinateSpace.width);
    const v = formatSandboxUnit(
      coordinateSpace.height - coordinate.y,
      coordinateSpace.height
    );

    return {
      style: `--sandbox-left:${left}%; --sandbox-bottom:${bottom}%;`,
      projectionAttributes: `data-terrain-projected-point="true" data-map-height-u="${u}" data-map-height-v="${v}" data-map-hex-x="${hex.x}" data-map-hex-y="${hex.y}"`,
    };
  };
  const territoryMarkup = overlay.claimedHexes
    .map(
      (entry) => `
        <polygon
          class="c-civilization-sandbox-territory"
          points="${formatSandboxPolygonPoints(entry.hex, coordinateSpace)}"
          style="--sandbox-territory-color:var(--color-${escapeHtml(entry.colorToken)});"
          data-sandbox-civilization-id="${escapeHtml(entry.civilizationId)}"
          aria-hidden="true"
        ></polygon>
      `
    )
    .join("");
  const farmGroundMarkup = overlay.structures
    .filter((structure) => structure.kind === "farm")
    .map((structure) => {
      return `
        <polygon
          class="${getCivilizationSandboxStructureClassName(structure.kind)}"
          points="${formatSandboxPolygonPoints(structure.hex, coordinateSpace)}"
          data-sandbox-civilization-id="${escapeHtml(structure.civilizationId)}"
          aria-hidden="true"
        ></polygon>
      `;
    })
    .join("");
  const individualsMarkup = overlay.individuals
    .map((individual) => {
      const spriteUrl = resolveCivilizationSandboxSpriteUrl(
        individual.spriteResourceId
      );
      const position = createProjectedPosition(individual.hex);

      return `
        <button
          type="button"
          class="c-civilization-sandbox-individual"
          data-civilization-sandbox-action="select"
          data-sandbox-entity-id="${escapeHtml(individual.id)}"
          style="${position.style}"
          ${position.projectionAttributes}
          title="${escapeHtml(individual.name)} · ${escapeHtml(individual.taskLabel)}"
        >
          ${
            spriteUrl == null
              ? '<span class="c-civilization-sandbox-individual__fallback"></span>'
              : `<img src="${spriteUrl}" alt="" class="c-civilization-sandbox-individual__sprite">`
          }
        </button>
      `;
    })
    .join("");

  return `
    <script type="application/json" data-civilization-sandbox-source="true">${escapeJsonForHtmlScript(JSON.stringify(overlay))}</script>
    <div
      class="c-civilization-sandbox-overlay"
      data-civilization-sandbox-overlay="true"
      data-civilization-sandbox-view-mode="${overlay.viewMode}"
    >
      <svg
        class="c-civilization-sandbox-ground"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        ${overlay.viewMode === "territory" ? territoryMarkup : ""}
        ${farmGroundMarkup}
      </svg>
      ${individualsMarkup}
    </div>
  `;
}

function getCivilizationSandboxStructureClassName(kind: string): string {
  if (kind === "rural-house") {
    return "c-civilization-sandbox-structure c-civilization-sandbox-structure--rural-house";
  }

  if (kind === "farm") {
    return "c-civilization-sandbox-structure c-civilization-sandbox-structure--farm";
  }

  return "c-civilization-sandbox-structure";
}

function formatSandboxMapPercent(value: number, total: number): string {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return "0";
  }

  return ((value / total) * 100).toFixed(3);
}

function formatSandboxUnit(value: number, total: number): string {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return "0.00000";
  }

  return Math.min(Math.max(value / total, 0), 1).toFixed(5);
}

function formatSandboxPolygonPoints(
  hex: { x: number; y: number },
  coordinateSpace: {
    width: number;
    height: number;
  }
): string {
  return hexToCoordinatePolygon({
    hex,
    coordinateSpace,
    radiusScale: 0.96,
  })
    .map((point) => {
      const x = formatSandboxMapPercent(point.x, coordinateSpace.width);
      const y = formatSandboxMapPercent(
        coordinateSpace.height - point.y,
        coordinateSpace.height
      );
      return `${x},${y}`;
    })
    .join(" ");
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
      >
        部队
      </button>
    </div>
  `;
}

function renderCivilizationSandboxControls(): string {
  return `
    <div class="c-civilization-sandbox-controls" aria-label="文明沙盒验证">
      <button type="button" data-civilization-sandbox-action="place-lord" data-sandbox-race-id="wu-tong">吴同</button>
      <button type="button" data-civilization-sandbox-action="place-lord" data-sandbox-race-id="yu-qingqing">于晴晴</button>
      <button type="button" data-civilization-sandbox-action="place-lord" data-sandbox-race-id="chen-yihan">陈倚晗</button>
      <button type="button" data-civilization-sandbox-action="tick">单步</button>
      <button type="button" data-civilization-sandbox-action="toggle-territory-view">领土</button>
      <button type="button" data-civilization-sandbox-action="clear">清空</button>
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
  const campaignStructureProfile = model.campaignStructureProfile;
  const fortCityAssetAttributes =
    campaignStructureProfile?.fortCityAssetId == null
      ? ""
      : `data-campaign-fort-city-asset-id="${campaignStructureProfile.fortCityAssetId}"`;
  const fortWallMeshAttributes =
    campaignStructureProfile?.fortWallMeshUrl == null
      ? ""
      : `data-campaign-fort-wall-mesh-url="${campaignStructureProfile.fortWallMeshUrl}"`;
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
          ${model.grassNormalTextureImageUrl == null ? "" : `data-map-grass-normal-texture-url="${model.grassNormalTextureImageUrl}"`}
          ${model.sandTextureImageUrl == null ? "" : `data-map-sand-texture-url="${model.sandTextureImageUrl}"`}
          ${model.villageGroundTextureImageUrl == null ? "" : `data-map-village-ground-texture-url="${model.villageGroundTextureImageUrl}"`}
          ${model.cityGroundTextureImageUrl == null ? "" : `data-map-city-ground-texture-url="${model.cityGroundTextureImageUrl}"`}
          ${model.rockTextureImageUrl == null ? "" : `data-map-rock-texture-url="${model.rockTextureImageUrl}"`}
          ${model.snowTextureImageUrl == null ? "" : `data-map-snow-texture-url="${model.snowTextureImageUrl}"`}
          ${model.waterTextureImageUrl == null ? "" : `data-map-water-texture-url="${model.waterTextureImageUrl}"`}
          ${fortCityAssetAttributes}
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
            ${renderCivilizationSandboxOverlay(
              model.civilizationSandboxOverlay,
              model.coordinateSpace
            )}
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
        ${renderCivilizationSandboxControls()}
        <label class="c-campaign-cloud-control">
          <span>云纹理</span>
          <input
            type="range"
            min="0.5"
            max="50"
            step="0.01"
            value="2.72"
            data-campaign-cloud-texture-scale-input="true"
          >
          <strong data-campaign-cloud-texture-scale-value="true">2.72x</strong>
        </label>
        <button
          class="c-campaign-map-actions__button"
          type="button"
          data-action="open-backpack"
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
