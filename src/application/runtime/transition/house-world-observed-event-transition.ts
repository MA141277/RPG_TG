/**
 * Created: 2026-08-27
 * Feature: house enter/leave world-observed events for NPC AI context
 * Reason: top-level shell needs a small, testable transition seam instead of
 * re-embedding house transition event business rules inside `src/main.ts`.
 * Target owner: shared house/world transition coordinator once shell action
 * dispatch is further extracted from `src/main.ts`.
 * Remove when: house/world transition ownership fully moves out of the shell.
 */

import type { GameState } from "../../../domain/game-state";
import type { HouseDefinition } from "../../../domain/house";
import type { WorldObservedEvent } from "../../../domain/world-intent";

type HouseTransitionGameState = Pick<GameState, "world" | "ui">;

function resolveHouseName(
  houseDefinitionsById: Record<string, HouseDefinition | undefined>,
  houseId: string
): string {
  return houseDefinitionsById[houseId]?.name ?? houseId;
}

function resolveHouseCityId(
  houseDefinitionsById: Record<string, HouseDefinition | undefined>,
  houseId: string,
  fallbackCityId: string
): string {
  return houseDefinitionsById[houseId]?.cityId ?? fallbackCityId;
}

export function collectHouseWorldObservedEventsForTransition(input: {
  previousGameState: HouseTransitionGameState;
  nextGameState: HouseTransitionGameState;
  houseDefinitionsById: Record<string, HouseDefinition | undefined>;
}): WorldObservedEvent[] {
  const previousHouseId = input.previousGameState.world.currentHouseId;
  const nextHouseId = input.nextGameState.world.currentHouseId;
  const previousInHouse =
    input.previousGameState.ui.currentView === "house" && previousHouseId != null;
  const nextInHouse =
    input.nextGameState.ui.currentView === "house" && nextHouseId != null;

  if (previousHouseId === nextHouseId && previousInHouse === nextInHouse) {
    return [];
  }

  const events: WorldObservedEvent[] = [];

  if (previousInHouse && previousHouseId != null && previousHouseId !== nextHouseId) {
    events.push({
      type: "system:leave-house",
      cityId: resolveHouseCityId(
        input.houseDefinitionsById,
        previousHouseId,
        input.previousGameState.world.currentCityId
      ),
      houseId: null,
      summary: `玩家离开了${resolveHouseName(
        input.houseDefinitionsById,
        previousHouseId
      )}。`,
    });
  }

  if (nextInHouse && nextHouseId != null && previousHouseId !== nextHouseId) {
    events.push({
      type: "system:enter-house",
      cityId: resolveHouseCityId(
        input.houseDefinitionsById,
        nextHouseId,
        input.nextGameState.world.currentCityId
      ),
      houseId: nextHouseId,
      summary: `玩家进入了${resolveHouseName(
        input.houseDefinitionsById,
        nextHouseId
      )}。`,
    });
  }

  return events;
}
