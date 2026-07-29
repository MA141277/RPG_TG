import type { GridCoordinate } from "../navigation/travel-to-coordinate";
import {
  getCampaignHexCellKey,
  getCampaignHexDisc,
  type CampaignCoordinateSpace,
} from "../../domain/campaign-hex";
import {
  coordinateToRoundedHex,
  type HexCoordinateSystem,
} from "../navigation/travel-to-coordinate";
import type { GameState } from "../../domain/game-state";
import type { MapDefinition, MapId } from "../../domain/map";
import type { CampaignMapExplorationState } from "../../domain/map-exploration";

export function createInitialCampaignMapExplorationState(): CampaignMapExplorationState {
  return {
    revealedHexKeysByMapId: {},
  };
}

export function getRevealedCampaignHexKeys(
  gameState: GameState,
  mapId: MapId
): string[] {
  return gameState.runtime.mapExploration.revealedHexKeysByMapId[mapId] ?? [];
}

export function getVisibleCampaignHexKeysForCoordinate(input: {
  coordinate: GridCoordinate;
  coordinateSpace: CampaignCoordinateSpace;
  coordinateSystem?: HexCoordinateSystem;
  radius?: number;
}): string[] {
  const centerHex = coordinateToRoundedHex(
    input.coordinate,
    input.coordinateSpace,
    input.coordinateSystem
  );

  return getCampaignHexDisc(centerHex, input.radius ?? 1).map((cell) =>
    getCampaignHexCellKey(cell.x, cell.y)
  );
}

export function getClearCampaignHexKeys(input: {
  revealedHexKeys: string[];
  coordinate: GridCoordinate;
  coordinateSpace: CampaignCoordinateSpace;
  coordinateSystem?: HexCoordinateSystem;
  visibleRadius?: number;
}): string[] {
  return Array.from(
    new Set([
      ...input.revealedHexKeys,
      ...getVisibleCampaignHexKeysForCoordinate(
        input.visibleRadius == null
          ? {
              coordinate: input.coordinate,
              coordinateSpace: input.coordinateSpace,
              ...(input.coordinateSystem == null ? {} : { coordinateSystem: input.coordinateSystem }),
            }
          : {
              coordinate: input.coordinate,
              coordinateSpace: input.coordinateSpace,
              ...(input.coordinateSystem == null ? {} : { coordinateSystem: input.coordinateSystem }),
              radius: input.visibleRadius,
            }
      ),
    ])
  );
}

export function revealCampaignMapHexesForCoordinate(
  gameState: GameState,
  mapDefinition: MapDefinition,
  coordinate: GridCoordinate,
  coordinateSystem?: HexCoordinateSystem
): GameState {
  const coordinateSpace =
    mapDefinition.coordinateSpace ??
    {
      width: mapDefinition.size ?? 1,
      height: mapDefinition.size ?? 1,
    };
  const currentRevealed = getRevealedCampaignHexKeys(gameState, mapDefinition.id);
  const nextRevealed = getClearCampaignHexKeys({
    revealedHexKeys: currentRevealed,
    coordinate,
    coordinateSpace,
    ...(coordinateSystem == null ? {} : { coordinateSystem }),
    visibleRadius: 1,
  });

  if (nextRevealed.length === currentRevealed.length) {
    return gameState;
  }

  return {
    ...gameState,
    runtime: {
      ...gameState.runtime,
      mapExploration: {
        ...gameState.runtime.mapExploration,
        revealedHexKeysByMapId: {
          ...gameState.runtime.mapExploration.revealedHexKeysByMapId,
          [mapDefinition.id]: nextRevealed,
        },
      },
    },
  };
}
