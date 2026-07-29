import type { CharacterDefinition } from "../../domain/character";
import {
  mergeCharacterStatusById,
  type CharacterStatusById,
} from "../../domain/character-status";
import type { GameState } from "../../domain/game-state";

export const ACTIVITY_COMPLETION_STAMINA_COST = 15;

export type PlayerStaminaMutationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
  characterStatusById?: CharacterStatusById;
};

export function canAffordActivityCost(
  characterDefinition: Pick<CharacterDefinition, "stamina">,
  amount = ACTIVITY_COMPLETION_STAMINA_COST
): boolean {
  return characterDefinition.stamina >= Math.max(0, amount);
}

export function mutatePlayerStamina(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): PlayerStaminaMutationResult {
  let characterStatusById: CharacterStatusById = {};

  return {
    state,
    characterDefinitions: characterDefinitions.map((characterDefinition) => {
      if (characterDefinition.id !== playerCharacterId) {
        return characterDefinition;
      }

      const nextStamina = Math.max(0, characterDefinition.stamina + delta);
      characterStatusById = mergeCharacterStatusById(
        characterStatusById,
        playerCharacterId,
        { stamina: nextStamina }
      );

      return {
        ...characterDefinition,
        stamina: nextStamina,
      };
    }),
    characterStatusById,
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
