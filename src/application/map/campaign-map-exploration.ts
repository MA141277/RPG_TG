import type { GridCoordinate } from "../navigation/travel-to-coordinate";
import {
  campaignMapCoordinateToHex,
  getCampaignHexCellKey,
  getCampaignHexDisc,
  type CampaignCoordinateSpace,
} from "../../domain/campaign-hex";
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
  radius?: number;
}): string[] {
  const centerHex = campaignMapCoordinateToHex(
    input.coordinate,
    input.coordinateSpace
  );

  return getCampaignHexDisc(centerHex, input.radius ?? 1).map((cell) =>
    getCampaignHexCellKey(cell.x, cell.y)
  );
}

export function getClearCampaignHexKeys(input: {
  revealedHexKeys: string[];
  coordinate: GridCoordinate;
  coordinateSpace: CampaignCoordinateSpace;
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
            }
          : {
              coordinate: input.coordinate,
              coordinateSpace: input.coordinateSpace,
              radius: input.visibleRadius,
            }
      ),
    ])
  );
}

export function revealCampaignMapHexesForCoordinate(
  gameState: GameState,
  mapDefinition: MapDefinition,
  coordinate: GridCoordinate
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
