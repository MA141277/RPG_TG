import { ensureCityNpcPoolsForCurrentDay } from "../city-npcs/refresh-city-npc-pools";
import type { AppState } from "../app-shell";
import type { CityNpcPoolDefinition } from "../../domain/city-npc";

export function applyRenderPrepassState(
  appState: AppState,
  cityNpcPools: CityNpcPoolDefinition[],
  random: (() => number) | undefined = undefined
): AppState {
  return {
    ...appState,
    gameState: ensureCityNpcPoolsForCurrentDay(
      appState.gameState,
      cityNpcPools,
      random
    ),
  };
}
