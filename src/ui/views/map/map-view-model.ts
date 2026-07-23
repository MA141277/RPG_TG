import {
  coordinateToRoundedHex,
  getHexKey,
  type GridCoordinate,
} from "../../../application/navigation/travel-to-coordinate";
import cityDepthMeshAssetUrl from "../../../3dasset/city_hun/city-hun-campaign-lowpoly.json?url";
import cityDepthTextureUrl from "../../../3dasset/city_hun/texture_pbr_20250901.png?url";
import fortWallMeshAssetUrl from "../../../content/scenario-packs/zhuyuanzhang/assets/map-nodes/fort-wall/fort-hex-wall.json?url";
import type { CityDefinition } from "../../../domain/city";
import {
  campaignMapCoordinateToHex,
  getCampaignHexCellKey,
  getCampaignHexDisc,
} from "../../../domain/campaign-hex";
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

type CityMarker = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export type CampaignMarker = {
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
  fortWallMeshAssetUrl: string | null;
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
    fortWallMeshAssetUrl: mode === "campaign" ? fortWallMeshAssetUrl : null,
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
