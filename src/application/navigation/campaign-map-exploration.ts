import type { GameState } from "../../domain/game-state";
import type { MapExplorationState, MapId } from "../../domain/map";
import {
  coordinateToRoundedHex,
  getHexKey,
  getHexNeighbors,
  type CoordinateSpace,
  type GridCoordinate,
  type HexCoordinate,
} from "./travel-to-coordinate";

export type CampaignMapFogViewState = {
  mapId: MapId;
  revealedHexKeys: string[];
  revealingHexStartedAtMsByKey: Record<string, number>;
};

export const CAMPAIGN_MAP_FOG_REVEAL_DURATION_MS = 1400;

function createEmptyMapExplorationState(): MapExplorationState {
  return {
    revealedHexKeys: [],
    revealingHexStartedAtMsByKey: {},
  };
}

function normalizeMapExplorationState(
  state: MapExplorationState | undefined
): MapExplorationState {
  if (state == null) {
    return createEmptyMapExplorationState();
  }

  return {
    revealedHexKeys: Array.from(new Set(state.revealedHexKeys)).sort(),
    revealingHexStartedAtMsByKey: {
      ...state.revealingHexStartedAtMsByKey,
    },
  };
}

function getHexRevealNeighborhood(hex: HexCoordinate): HexCoordinate[] {
  return [hex, ...getHexNeighbors(hex)];
}

function pruneExpiredRevealAnimations(
  revealingHexStartedAtMsByKey: Record<string, number>,
  nowMs: number
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(revealingHexStartedAtMsByKey).filter(
      ([, startedAtMs]) =>
        Number.isFinite(startedAtMs) &&
        nowMs - startedAtMs < CAMPAIGN_MAP_FOG_REVEAL_DURATION_MS
    )
  );
}

export function getCampaignMapFogViewState(
  state: GameState,
  mapId: MapId
): CampaignMapFogViewState {
  const explorationState = normalizeMapExplorationState(
    state.runtime.mapExplorationByMapId?.[mapId]
  );

  return {
    mapId,
    revealedHexKeys: explorationState.revealedHexKeys,
    revealingHexStartedAtMsByKey: explorationState.revealingHexStartedAtMsByKey,
  };
}

export function revealCampaignMapAroundCoordinate(input: {
  state: GameState;
  mapId: MapId;
  coordinate: GridCoordinate;
  coordinateSpace: CoordinateSpace;
  revealedAtMs?: number;
  animateNewHexes?: boolean;
}): GameState {
  const revealedAtMs = input.revealedAtMs ?? Date.now();
  const currentExplorationState = normalizeMapExplorationState(
    input.state.runtime.mapExplorationByMapId?.[input.mapId]
  );
  const revealedHexKeys = new Set(currentExplorationState.revealedHexKeys);
  const nextRevealingHexes = pruneExpiredRevealAnimations(
    currentExplorationState.revealingHexStartedAtMsByKey,
    revealedAtMs
  );
  const centerHex = coordinateToRoundedHex(
    input.coordinate,
    input.coordinateSpace
  );
  let changed = false;

  for (const hex of getHexRevealNeighborhood(centerHex)) {
    const hexKey = getHexKey(hex);
    if (revealedHexKeys.has(hexKey)) {
      continue;
    }

    revealedHexKeys.add(hexKey);
    changed = true;
    if (input.animateNewHexes !== false) {
      nextRevealingHexes[hexKey] = revealedAtMs;
    }
  }

  if (!changed && Object.keys(nextRevealingHexes).length === Object.keys(
    currentExplorationState.revealingHexStartedAtMsByKey
  ).length) {
    return input.state;
  }

  return {
    ...input.state,
    runtime: {
      ...input.state.runtime,
      mapExplorationByMapId: {
        ...(input.state.runtime.mapExplorationByMapId ?? {}),
        [input.mapId]: {
          revealedHexKeys: Array.from(revealedHexKeys).sort(),
          revealingHexStartedAtMsByKey: nextRevealingHexes,
        },
      },
    },
  };
}

export function isCampaignMapCoordinateRevealed(input: {
  state: GameState;
  mapId: MapId;
  coordinate: GridCoordinate;
  coordinateSpace: CoordinateSpace;
}): boolean {
  const explorationState = input.state.runtime.mapExplorationByMapId?.[input.mapId];
  if (explorationState == null) {
    return false;
  }

  const hex = coordinateToRoundedHex(input.coordinate, input.coordinateSpace);
  return new Set(explorationState.revealedHexKeys).has(getHexKey(hex));
}
