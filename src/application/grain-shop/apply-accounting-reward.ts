import type { CharacterDefinition } from "../../domain/character";
import {
  mergeCharacterStatusMaps,
  type CharacterStatusById,
} from "../../domain/character-status";
import type { GameState } from "../../domain/game-state";
import type { AccountingGrade } from "../../domain/grain-shop";
import {
  advanceGrainShopTime,
  mutateGrainShopRelationship,
  mutatePlayerAccountingLevel,
  mutatePlayerGold,
  type GrainShopMutationResult,
} from "./grain-shop-mutations";
import { spendPlayerStamina } from "../player/player-stamina";
import { getAccountingGradeReward } from "./accounting-minigame";

export function applyAccountingReward(
  state: GameState,
  characterDefinitions: CharacterDefinition[],
  playerCharacterId: string,
  grade: AccountingGrade,
  durationDays: number
): GrainShopMutationResult {
  const reward = getAccountingGradeReward(grade);

  let nextState = state;
  let nextCharacters = characterDefinitions;
  let characterStatusById: CharacterStatusById = {};

  const goldMutation = mutatePlayerGold(
    nextState,
    nextCharacters,
    playerCharacterId,
    reward.money
  );
  nextState = goldMutation.state;
  nextCharacters = goldMutation.characterDefinitions;
  characterStatusById = mergeCharacterStatusMaps(
    characterStatusById,
    goldMutation.characterStatusById ?? {}
  );

  const mathMutation = mutatePlayerAccountingLevel(
    nextState,
    nextCharacters,
    playerCharacterId,
    reward.math
  );
  nextState = mathMutation.state;
  nextCharacters = mathMutation.characterDefinitions;
  characterStatusById = mergeCharacterStatusMaps(
    characterStatusById,
    mathMutation.characterStatusById ?? {}
  );

  const staminaMutation = spendPlayerStamina(
    nextState,
    nextCharacters,
    playerCharacterId
  );
  nextState = staminaMutation.state;
  nextCharacters = staminaMutation.characterDefinitions;
  characterStatusById = mergeCharacterStatusMaps(
    characterStatusById,
    staminaMutation.characterStatusById ?? {}
  );

  nextState = mutateGrainShopRelationship(nextState, reward.relationship);
  nextState = advanceGrainShopTime(nextState, durationDays);

  return {
    state: nextState,
    characterDefinitions: nextCharacters,
    characterStatusById,
  };
}
