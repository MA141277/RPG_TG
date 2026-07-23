import type { AppState } from "../app-shell";

export function applyCoinReward(
  state: AppState,
  playerCharacterId: string,
  delta: number
): AppState {
  return {
    ...state,
    characterDefinitions: state.characterDefinitions.map((characterDefinition) =>
      characterDefinition.id !== playerCharacterId
        ? characterDefinition
        : {
            ...characterDefinition,
            stats: {
              ...characterDefinition.stats,
              gold: characterDefinition.stats.gold + delta,
            },
          }
    ),
  };
}
