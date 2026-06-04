import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";

export const ACTIVITY_COMPLETION_STAMINA_COST = 15;

export type PlayerStaminaMutationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

export function mutatePlayerStamina(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): PlayerStaminaMutationResult {
  return {
    state,
    characterDefinitions: characterDefinitions.map((characterDefinition) => {
      if (characterDefinition.id !== playerCharacterId) {
        return characterDefinition;
      }

      return {
        ...characterDefinition,
        stamina: Math.max(0, characterDefinition.stamina + delta),
      };
    }),
  };
}

export function spendPlayerStamina(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  amount = ACTIVITY_COMPLETION_STAMINA_COST
): PlayerStaminaMutationResult {
  return mutatePlayerStamina(
    state,
    characterDefinitions,
    playerCharacterId,
    -Math.max(0, amount)
  );
}
