import type { CharacterDefinition } from "../../domain/character";
import type { GameState } from "../../domain/game-state";
import {
  getMedicineHouseFavorabilityVariableKey,
  getMedicineHouseTimeVariableKey,
  getPlayerFatigueVariableKey,
  getPlayerHpVariableKey,
  getPlayerInjuryVariableKey,
  getPlayerPoisonVariableKey,
  type MedicineHouseActionOutcome,
} from "../../domain/medicine-house";
import {
  applyPlayerItemMutations,
  readPlayerItemQuantity,
} from "../inventory/player-item-inventory";

export type MedicineHouseMutationResult = {
  state: GameState;
  characterDefinitions: CharacterDefinition[];
};

function withVariable(
  state: GameState,
  key: string,
  value: number
): GameState {
  return {
    ...state,
    runtime: {
      ...state.runtime,
      variables: {
        ...state.runtime.variables,
        [key]: value,
      },
    },
  };
}

function readNumericVariable(
  state: GameState,
  key: string,
  fallback: number
): number {
  const value = state.runtime.variables[key];
  return typeof value === "number" ? value : fallback;
}

export function readPlayerFatigue(state: GameState, fallback = 0): number {
  return readNumericVariable(state, getPlayerFatigueVariableKey(), fallback);
}

export function applyMedicineHouseOutcome(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  houseId: string,
  actorId: string,
  outcome: MedicineHouseActionOutcome
): MedicineHouseMutationResult {
  let nextState = state;
  let nextCharacterDefinitions = characterDefinitions;

  if (outcome.moneyChange !== 0) {
    const goldMutation = mutatePlayerGold(
      nextState,
      nextCharacterDefinitions,
      playerCharacterId,
      outcome.moneyChange
    );
    nextState = goldMutation.state;
    nextCharacterDefinitions = goldMutation.characterDefinitions;
  }

  if (outcome.relationshipChange !== 0) {
    const favorKey = getMedicineHouseFavorabilityVariableKey(houseId, actorId);
    nextState = withVariable(
      nextState,
      favorKey,
      readNumericVariable(nextState, favorKey, 0) + outcome.relationshipChange
    );
  }

  if (outcome.fatigueRecovery !== 0) {
    const fatigueKey = getPlayerFatigueVariableKey();
    nextState = withVariable(
      nextState,
      fatigueKey,
      Math.max(
        0,
        readNumericVariable(nextState, fatigueKey, 0) - outcome.fatigueRecovery
      )
    );
  }

  for (const attributeChange of outcome.attributeChange) {
    if (attributeChange.key === "medicine" && attributeChange.delta !== 0) {
      const skillMutation = mutatePlayerCompoundingLevel(
        nextState,
        nextCharacterDefinitions,
        playerCharacterId,
        attributeChange.delta
      );
      nextState = skillMutation.state;
      nextCharacterDefinitions = skillMutation.characterDefinitions;
    }
  }

  if (outcome.inventoryChange.length > 0) {
    nextState = applyPlayerItemMutations(
      nextState,
      outcome.inventoryChange
        .filter((inventoryChange) => inventoryChange.quantity !== 0)
        .map((inventoryChange) => ({
          itemId: inventoryChange.itemId,
          delta: inventoryChange.quantity,
          legacySources: ["medicine-house"] as const,
        }))
    );
  }

  if (outcome.timeCost !== 0) {
    const timeKey = getMedicineHouseTimeVariableKey(houseId);
    nextState = withVariable(
      nextState,
      timeKey,
      readNumericVariable(nextState, timeKey, 0) + outcome.timeCost
    );
  }

  return {
    state: nextState,
    characterDefinitions: nextCharacterDefinitions,
  };
}

export function mutatePlayerGold(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): MedicineHouseMutationResult {
  return {
    state,
    characterDefinitions: characterDefinitions.map((characterDefinition) => {
      if (characterDefinition.id !== playerCharacterId) {
        return characterDefinition;
      }

      return {
        ...characterDefinition,
        stats: {
          ...characterDefinition.stats,
          gold: characterDefinition.stats.gold + delta,
        },
      };
    }),
  };
}

export function mutatePlayerCompoundingLevel(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  delta: number
): MedicineHouseMutationResult {
  return {
    state,
    characterDefinitions: characterDefinitions.map((characterDefinition) => {
      if (characterDefinition.id !== playerCharacterId || characterDefinition.skills == null) {
        return characterDefinition;
      }

      return {
        ...characterDefinition,
        skills: {
          ...characterDefinition.skills,
          compounding: Math.max(
            0,
            (characterDefinition.skills.compounding ?? 0) + delta
          ),
        },
      };
    }),
  };
}

export function readMedicineInventoryQuantity(
  state: GameState,
  itemId: string
): number {
  return readPlayerItemQuantity(state, itemId, ["medicine-house"]);
}

export function readReservedPlayerStatus(state: GameState): {
  hp: number;
  fatigue: number;
  poison: number;
  injury: number;
} {
  return {
    hp: readNumericVariable(state, getPlayerHpVariableKey(), 100),
    fatigue: readPlayerFatigue(state, 0),
    poison: readNumericVariable(state, getPlayerPoisonVariableKey(), 0),
    injury: readNumericVariable(state, getPlayerInjuryVariableKey(), 0),
  };
}
